from __future__ import annotations

import re
from datetime import date

import httpx

from app.config import get_settings
from app.llm.base import IdentificationResult, LLMProvider

API_BASE = "https://api.inaturalist.org/v1"


class InaturalistProvider(LLMProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self.api_token = settings.INATURALIST_API_TOKEN
        if not self.api_token:
            raise ValueError(
                "INATURALIST_API_TOKEN is required. "
                "Get yours at https://www.inaturalist.org/users/api_token"
            )

    async def identify(
        self,
        image_bytes: bytes,
        mime_type: str,
        *,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> IdentificationResult:
        headers = {"Authorization": self.api_token}

        data: dict[str, str] = {"observed_on": date.today().isoformat()}
        if latitude is not None:
            data["lat"] = str(latitude)
        if longitude is not None:
            data["lng"] = str(longitude)

        ext = "jpg" if "jpeg" in (mime_type or "") or "jpg" in (mime_type or "") else "png"
        files = {"image": (f"photo.{ext}", image_bytes, mime_type or "image/jpeg")}

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{API_BASE}/computervision/score_image",
                headers=headers,
                data=data,
                files=files,
            )
            resp.raise_for_status()
            results = resp.json().get("results", [])

            if not results:
                return IdentificationResult(
                    species_name_en="Unknown species",
                    species_name_pt="Espécie desconhecida",
                    description_en="Could not identify the species in this photo.",
                    description_pt="Não foi possível identificar a espécie nesta foto.",
                    confidence="low",
                )

            top = results[0]
            taxon_id = top["taxon"]["id"]
            score = top.get("combined_score", top.get("vision_score", 0))

            en_data, pt_data = await _fetch_taxon_locales(client, taxon_id, headers)

        if score >= 90:
            confidence = "high"
        elif score >= 60:
            confidence = "medium"
        else:
            confidence = "low"

        return IdentificationResult(
            species_name_en=en_data["name"],
            species_name_pt=pt_data["name"],
            description_en=en_data["description"],
            description_pt=pt_data["description"],
            confidence=confidence,
        )


async def _fetch_taxon_locales(
    client: httpx.AsyncClient,
    taxon_id: int,
    headers: dict[str, str],
) -> tuple[dict[str, str], dict[str, str]]:
    """Fetch taxon info in both en and pt-BR locales concurrently."""
    import asyncio

    async def fetch(locale: str) -> dict[str, str]:
        resp = await client.get(
            f"{API_BASE}/taxa/{taxon_id}",
            headers=headers,
            params={"locale": locale},
        )
        resp.raise_for_status()
        taxa = resp.json().get("results", [])
        if not taxa:
            return {"name": "Unknown", "description": ""}
        taxon = taxa[0]
        common = taxon.get("preferred_common_name") or ""
        scientific = taxon.get("name", "Unknown")
        name = f"{common} ({scientific})" if common else scientific
        description = _build_description(taxon)
        return {"name": name, "description": description}

    en, pt = await asyncio.gather(fetch("en"), fetch("pt-BR"))
    return en, pt


def _build_description(taxon: dict) -> str:
    summary = taxon.get("wikipedia_summary", "")
    if summary:
        clean = re.sub(r"<[^>]+>", "", summary).strip()
        if len(clean) > 300:
            clean = clean[:297].rsplit(" ", 1)[0] + "..."
        return clean

    common = taxon.get("preferred_common_name") or taxon.get("name", "Unknown")
    scientific = taxon.get("name", "")
    rank = taxon.get("rank", "species")
    return f"{common} ({scientific}) is a {rank}."
