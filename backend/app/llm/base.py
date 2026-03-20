from __future__ import annotations

from abc import ABC, abstractmethod

from pydantic import BaseModel


class IdentificationResult(BaseModel):
    species_name: str
    description: str
    confidence: str  # "high", "medium", or "low"


class LLMProvider(ABC):
    @abstractmethod
    async def identify(self, image_bytes: bytes, mime_type: str) -> IdentificationResult:
        """Identify the species in the given image."""
        ...
