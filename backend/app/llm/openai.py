from __future__ import annotations

import base64
import json

import openai

from app.config import get_settings
from app.llm.base import IdentificationResult, LLMProvider

PROMPT = (
    "Identify the species in this photo. Respond with JSON containing the species name "
    "and a 2-3 sentence description in both English and Brazilian Portuguese:\n"
    '{"species_name_en": "...", "species_name_pt": "...", '
    '"description_en": "...", "description_pt": "...", '
    '"confidence": "high|medium|low"}'
)


class OpenAIProvider(LLMProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def identify(
        self,
        image_bytes: bytes,
        mime_type: str,
        *,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> IdentificationResult:
        image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
        data_url = f"data:{mime_type};base64,{image_b64}"

        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": data_url},
                        },
                        {
                            "type": "text",
                            "text": PROMPT,
                        },
                    ],
                }
            ],
            max_tokens=1024,
        )

        raw_text = response.choices[0].message.content or ""
        if "```" in raw_text:
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        data = json.loads(raw_text.strip())
        return IdentificationResult(**data)
