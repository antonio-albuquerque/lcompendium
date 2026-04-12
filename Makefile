.PHONY: help install start-db stop-db migrate start-be stop-be start-fe stop-fe createsuperuser

help:
	@echo "L·Compendium — common commands"
	@echo ""
	@echo "  make install     install backend (uv) and frontend (npm) deps"
	@echo "  make start-db    start postgres + minio via docker compose"
	@echo "  make stop-db     stop docker compose services"
	@echo "  make migrate     run alembic migrations"
	@echo "  make start-be    run backend dev server on :8000"
	@echo "  make stop-be     stop backend dev server"
	@echo "  make start-fe    run frontend dev server on :5173"
	@echo "  make stop-fe     stop frontend dev server"
	@echo "  make createsuperuser  create the first superuser (prompts for args)"

install:
	cd backend && uv sync --extra dev
	cd frontend && npm install

start-db:
	docker compose up -d

stop-db:
	docker compose down

migrate:
	cd backend && uv run alembic upgrade head

start-be:
	cd backend && uv run uvicorn app.main:app --reload --port 8000

stop-be:
	@pkill -f "uvicorn app.main:app" 2>/dev/null && echo "Backend stopped." || echo "Backend not running."

start-fe:
	cd frontend && npm run dev

stop-fe:
	@pkill -f "vite.*frontend" 2>/dev/null && echo "Frontend stopped." || echo "Frontend not running."

createsuperuser:
	cd backend && uv run python -m app.cli createsuperuser \
		--username $(USERNAME) --email $(EMAIL) --password $(PASSWORD)
