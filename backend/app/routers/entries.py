from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.entry import Entry
from app.schemas.entry import EntryListResponse, EntryResponse
from app.services import identifier, storage

router = APIRouter(prefix="/api/entries", tags=["entries"])


async def _entry_to_response(entry: Entry) -> EntryResponse:
    """Convert an Entry model to an EntryResponse with a presigned photo URL."""
    photo_url = await storage.get_presigned_url(entry.photo_key)
    return EntryResponse(
        id=entry.id,
        species_name=entry.species_name,
        description=entry.description,
        photo_url=photo_url,
        latitude=entry.latitude,
        longitude=entry.longitude,
        created_at=entry.created_at,
    )


@router.post("/", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    file: UploadFile = File(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    db: AsyncSession = Depends(get_db),
) -> EntryResponse:
    """Upload a photo, identify the species, and create a new entry."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image.",
        )

    file_bytes = await file.read()

    # Upload photo to S3
    photo_key = await storage.upload_file(
        file_bytes, file.filename or "upload.jpg", file.content_type
    )

    # Identify species via LLM
    try:
        result = await identifier.identify_species(file_bytes, file.content_type)
    except Exception as exc:
        # Clean up the uploaded file if identification fails
        await storage.delete_file(photo_key)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Species identification failed: {exc}",
        ) from exc

    # Create database entry
    entry = Entry(
        species_name=result.species_name,
        description=result.description,
        photo_key=photo_key,
        latitude=latitude,
        longitude=longitude,
    )
    db.add(entry)
    await db.flush()
    await db.refresh(entry)

    return await _entry_to_response(entry)


@router.get("/", response_model=EntryListResponse)
async def list_entries(
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
) -> EntryListResponse:
    """Return a paginated list of entries."""
    # Total count
    count_result = await db.execute(select(func.count(Entry.id)))
    total = count_result.scalar_one()

    # Paginated query
    offset = (page - 1) * per_page
    result = await db.execute(
        select(Entry).order_by(Entry.created_at.desc()).offset(offset).limit(per_page)
    )
    entries = result.scalars().all()

    entry_responses = [await _entry_to_response(e) for e in entries]

    return EntryListResponse(
        entries=entry_responses,
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_entry(
    entry_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> EntryResponse:
    """Return a single entry by ID."""
    result = await db.execute(select(Entry).where(Entry.id == entry_id))
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found.",
        )

    return await _entry_to_response(entry)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete an entry and its associated S3 object."""
    result = await db.execute(select(Entry).where(Entry.id == entry_id))
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found.",
        )

    await storage.delete_file(entry.photo_key)
    await db.delete(entry)
