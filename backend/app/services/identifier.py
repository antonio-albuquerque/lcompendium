from __future__ import annotations

from app.llm import get_provider
from app.llm.base import IdentificationResult


async def identify_species(
    image_bytes: bytes,
    mime_type: str,
    *,
    latitude: float | None = None,
    longitude: float | None = None,
) -> IdentificationResult:
    """Identify the species in the given image using the configured provider."""
    provider = get_provider()
    return await provider.identify(
        image_bytes, mime_type, latitude=latitude, longitude=longitude
    )
