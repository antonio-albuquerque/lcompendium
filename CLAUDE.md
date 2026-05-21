# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# L Compendium

Web app for cataloging animals and plants. Users upload photos, a provider identifies the species, and the app records entries with photo, date, and location.

## Tech Stack
- Backend: Python ≥3.11 + FastAPI + SQLAlchemy async + PostgreSQL, managed with `uv` (not pip)
- Frontend: React + Vite + TypeScript + TanStack Query + Axios
- Storage: S3-compatible (MinIO for local dev)
- Species-ID providers: Claude API, OpenAI API, iNaturalist CV API — selected via `LLM_PROVIDER` env var. iNaturalist is a computer-vision API for species identification, NOT a chat LLM.

## Development

Use the Makefile — it wraps `uv` and `npm` correctly. Don't `pip install`.

- `make install` — install backend (uv) and frontend (npm) deps
- `make start-db` — Postgres + MinIO via docker compose
- `make start-be` — backend on :8000 (runs `alembic upgrade head` first)
- `make start-fe` — frontend on :5173 (Vite proxies `/api` → :8000)
- `make migrate` — `alembic upgrade head`
- `make createsuperuser USERNAME=... EMAIL=... PASSWORD=...` — bootstrap an approved admin

## Conventions
- Backend uses async/await throughout
- Ruff for Python lint/format, configured with `line-length = 99` in `backend/pyproject.toml`
- API endpoints under `/api/`
- Photos served via pre-signed S3 URLs
- Tests: `pytest` + `pytest-asyncio` (run via `uv run pytest`). `backend/tests/` currently has no test files — new tests go there.
- Frontend has no ESLint or Prettier — TypeScript `strict: true` (in `frontend/tsconfig.json`) is the only static check.

## Gotchas
- **New signups default to `is_approved=False`.** Login (`/api/auth/login`) doesn't enforce approval, but `get_current_user` in `backend/app/deps.py` does — so unapproved users get a token but can't hit any protected route. A superuser must approve new accounts (or use `make createsuperuser` for the first one).
- **`DATABASE_URL` scheme rewriting.** `app/config.py` auto-rewrites `postgresql://` → `postgresql+asyncpg://` so Railway-style URLs work. Don't strip this; Alembic's `env.py` reverses it for the sync migration driver.
- **Frontend auth tokens** live in `localStorage["access_token"]` and are attached as Bearer headers by the Axios client.
- **Production serves the SPA from FastAPI.** The Dockerfile builds the frontend and copies it to `backend/static/`; backend routes and the SPA share one origin in prod (no CORS needed there).
