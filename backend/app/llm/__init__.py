from __future__ import annotations

from app.config import get_settings
from app.llm.base import LLMProvider


def get_provider() -> LLMProvider:
    """Return the configured LLM provider instance."""
    settings = get_settings()
    provider = settings.LLM_PROVIDER.lower()

    if provider == "claude":
        from app.llm.claude import ClaudeProvider

        return ClaudeProvider()
    elif provider == "openai":
        from app.llm.openai import OpenAIProvider

        return OpenAIProvider()
    else:
        raise ValueError(f"Unknown LLM provider: {provider!r}. Use 'claude' or 'openai'.")
