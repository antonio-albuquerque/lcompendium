# Stage 1: Build frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend + serve frontend static
FROM python:3.13-slim AS backend
WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV PATH="/app/.venv/bin:$PATH"

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --no-dev --no-install-project

COPY backend/ ./
RUN uv sync --no-dev

# Copy frontend build output into backend/static
COPY --from=frontend-build /app/frontend/dist ./static

EXPOSE 8000
CMD ["bash", "start.sh"]
