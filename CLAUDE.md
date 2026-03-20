# L Compendium

Web app for cataloging animals and plants. Users upload photos, an LLM identifies the species, and the app records entries with photo, date, and location.

## Tech Stack
- Backend: Python + FastAPI + SQLAlchemy async + PostgreSQL
- Frontend: React + Vite + TypeScript
- Storage: S3-compatible (MinIO for local dev)
- LLM: Abstracted provider (Claude API / OpenAI API)

## Development

```bash
# Start infrastructure
docker compose up -d

# Backend
cd backend
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload  # runs on :8000

# Frontend
cd frontend
npm install
npm run dev  # runs on :5173, proxies /api to :8000
```

## Project Layout
- `backend/app/` — FastAPI application
- `backend/app/models/` — SQLAlchemy models
- `backend/app/schemas/` — Pydantic schemas
- `backend/app/routers/` — API route handlers
- `backend/app/services/` — Business logic (storage, identifier)
- `backend/app/llm/` — LLM provider abstraction
- `frontend/src/` — React application

## Conventions
- Backend uses async/await throughout
- Ruff for Python linting/formatting
- API endpoints under `/api/`
- Photos served via pre-signed S3 URLs
