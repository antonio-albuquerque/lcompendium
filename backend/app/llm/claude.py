from __future__ import annotations

import base64
import json

import anthropic

from app.config import get_settings
from app.llm.base import IdentificationResult, LLMProvider

PROMPT = (
    "Identify the species in this photo. Respond with JSON containing the species name "
    "and a 2-3 sentence description in both English and Brazilian Portuguese:\n"
    '{"species_name_en": "...", "species_name_pt": "...", '
    '"description_en": "...", "description_pt": "...", '
    '"confidence": "high|medium|low"}'
)


class ClaudeProvider(LLMProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self.client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def identify(
        self,
        image_bytes: bytes,
        mime_type: str,
        *,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> IdentificationResult:
        image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

        response = await self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": mime_type,
                                "data": image_b64,
                            },
                        },
                        {
                            "type": "text",
                            "text": PROMPT,
                        },
                    ],
                }
            ],
        )

        raw_text = response.content[0].text
        if "```" in raw_text:
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        data = json.loads(raw_text.strip())
        return IdentificationResult(**data)
