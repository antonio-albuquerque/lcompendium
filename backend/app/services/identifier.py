from __future__ import annotations

from app.llm import get_provider
from app.llm.base import IdentificationResult


async def identify_species(image_bytes: bytes, mime_type: str) -> IdentificationResult:
    """Identify the species in the given image using the configured LLM provider."""
    provider = get_provider()
    return await provider.identify(image_bytes, mime_type)
