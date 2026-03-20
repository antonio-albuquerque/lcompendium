from __future__ import annotations

import base64
import json

import openai

from app.config import get_settings
from app.llm.base import IdentificationResult, LLMProvider

PROMPT = (
    "Identify the species in this photo. Respond with JSON: "
    '{"species_name": "...", "description": "2-3 sentence description of the species", '
    '"confidence": "high|medium|low"}'
)


class OpenAIProvider(LLMProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def identify(self, image_bytes: bytes, mime_type: str) -> IdentificationResult:
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
        # Extract JSON from the response (handle markdown code blocks)
        if "```" in raw_text:
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        data = json.loads(raw_text.strip())
        return IdentificationResult(**data)
