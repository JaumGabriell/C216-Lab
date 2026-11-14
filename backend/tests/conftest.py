"""Fixtures compartilhadas para os testes."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import models  # noqa: F401 - registra os modelos
from app.main import app
from database import Base, get_db

# Banco de dados em memória para testes
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client() -> TestClient:
    """Fixture que fornece um TestClient com banco de teste."""
    # Cria as tabelas
    Base.metadata.create_all(bind=engine)

    # Substitui a dependência do banco
    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)

    # Limpa as tabelas após o teste
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()
