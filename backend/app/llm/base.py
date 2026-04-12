from __future__ import annotations

from abc import ABC, abstractmethod

from pydantic import BaseModel


class IdentificationResult(BaseModel):
    species_name_en: str
    species_name_pt: str
    description_en: str
    description_pt: str
    confidence: str  # "high", "medium", or "low"


class LLMProvider(ABC):
    @abstractmethod
    async def identify(
        self,
        image_bytes: bytes,
        mime_type: str,
        *,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> IdentificationResult:
        """Identify the species in the given image."""
        ...
