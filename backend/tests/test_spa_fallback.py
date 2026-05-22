"""SPA fallback: unknown frontend routes should serve index.html, not 404."""
from __future__ import annotations

from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.spa import SPAStaticFiles

INDEX_HTML = "<!doctype html><title>L Compendium</title><div id=root></div>"


@pytest.fixture
def client(tmp_path: Path) -> TestClient:
    (tmp_path / "index.html").write_text(INDEX_HTML)
    assets = tmp_path / "assets"
    assets.mkdir()
    (assets / "app.js").write_text("console.log('hi');")

    app = FastAPI()

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.mount("/", SPAStaticFiles(directory=tmp_path, html=True), name="spa")
    return TestClient(app)


def test_root_serves_index(client: TestClient) -> None:
    res = client.get("/")
    assert res.status_code == 200
    assert "L Compendium" in res.text


@pytest.mark.parametrize(
    "path",
    [
        "/upload",
        "/entries",
        "/entries/abc-123-def",
        "/login",
        "/register",
        "/some/deeply/nested/unknown/route",
    ],
)
def test_unknown_frontend_route_falls_back_to_index(
    client: TestClient, path: str
) -> None:
    """Direct visits to client-side routes must render the SPA, not 404."""
    res = client.get(path)
    assert res.status_code == 200, f"{path} returned {res.status_code}"
    assert "<div id=root>" in res.text, f"{path} did not serve index.html"


def test_existing_asset_served_directly(client: TestClient) -> None:
    """Real files in the static dir must be served, not replaced by index.html."""
    res = client.get("/assets/app.js")
    assert res.status_code == 200
    assert "console.log" in res.text
    assert "<div id=root>" not in res.text


def test_api_route_not_intercepted_by_spa_fallback(client: TestClient) -> None:
    """API routes registered before the mount must still win."""
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_post_to_unknown_path_does_not_serve_index(client: TestClient) -> None:
    """Non-GET requests to unknown paths must not silently return index.html."""
    res = client.post("/upload")
    assert res.status_code != 200
    assert "<div id=root>" not in res.text
