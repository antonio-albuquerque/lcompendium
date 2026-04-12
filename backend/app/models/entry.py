from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, String, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class Entry(Base):
    __tablename__ = "entries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    species_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    species_name_pt: Mapped[str] = mapped_column(String(255), nullable=False, server_default="")
    description_en: Mapped[str] = mapped_column(Text, nullable=False)
    description_pt: Mapped[str] = mapped_column(Text, nullable=False, server_default="")
    photo_key: Mapped[str] = mapped_column(String(512), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
