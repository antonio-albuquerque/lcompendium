from __future__ import annotations

from collections.abc import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings


def _build_engine_args(url: str) -> tuple[str, dict[str, object]]:
    # asyncpg doesn't understand libpq's ?sslmode=... — translate to connect_args["ssl"]
    # and strip the param from the URL so SQLAlchemy doesn't choke on it.
    parsed = urlparse(url)
    query = parse_qs(parsed.query, keep_blank_values=True)
    sslmode = query.pop("sslmode", [None])[0]
    connect_args: dict[str, object] = {}
    if sslmode in ("require", "verify-ca", "verify-full"):
        connect_args["ssl"] = True
    elif sslmode == "disable":
        connect_args["ssl"] = False
    cleaned = parsed._replace(query=urlencode(query, doseq=True))
    return urlunparse(cleaned), connect_args


_url, _connect_args = _build_engine_args(get_settings().DATABASE_URL)
engine = create_async_engine(_url, echo=False, connect_args=_connect_args)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
