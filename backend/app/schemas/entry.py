from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EntryCreate(BaseModel):
    latitude: float | None = None
    longitude: float | None = None


class EntryResponse(BaseModel):
    id: UUID
    species_name_en: str
    species_name_pt: str
    description_en: str
    description_pt: str
    photo_url: str
    latitude: float | None = None
    longitude: float | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EntryListResponse(BaseModel):
    entries: list[EntryResponse]
    total: int
    page: int
    per_page: int
