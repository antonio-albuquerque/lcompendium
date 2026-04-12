from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = (
        "postgresql+asyncpg://lcompendium:lcompendium@localhost:5432/lcompendium"
    )
    S3_ENDPOINT_URL: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "lcompendium"
    S3_PUBLIC_URL: str = "http://localhost:9000"
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    INATURALIST_API_TOKEN: str = ""
    LLM_PROVIDER: str = "claude"

    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"

    model_config = {"env_file": ".env"}

    def model_post_init(self, __context: object) -> None:
        if self.DATABASE_URL.startswith("postgresql://"):
            object.__setattr__(
                self,
                "DATABASE_URL",
                self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1),
            )


@lru_cache
def get_settings() -> Settings:
    return Settings()
