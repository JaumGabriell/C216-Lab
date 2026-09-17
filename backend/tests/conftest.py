"""Fixtures compartilhadas para os testes."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Fixture que fornece um TestClient para testar a API."""
    return TestClient(app)
