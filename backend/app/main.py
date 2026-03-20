from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.entry import Entry  # noqa: F401 — ensure model is registered
from app.routers.entries import router as entries_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Create tables on startup (dev convenience)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="L Compendium API", lifespan=lifespan)

# CORS middleware — allow all origins (dev mode)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries_router)


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
