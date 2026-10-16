import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import models  # noqa: F401 - registra os modelos
from app.schemas.user import UserCreate, UserUpdate
from app.service import user as user_service
from database import Base

# Banco SQLite em memória para testes
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    """Fixture que fornece uma sessão de banco de teste."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


class TestUserService:
    def test_create_user(self, db):
        data = UserCreate(name="João", email="joao@test.com", password="123456")
        user = user_service.create_user(db, data)

        assert user.id is not None
        assert user.name == "João"
        assert user.email == "joao@test.com"

    def test_get_user_by_id(self, db):
        data = UserCreate(name="Maria", email="maria@test.com", password="123456")
        created = user_service.create_user(db, data)

        user = user_service.get_user_by_id(db, created.id)
        assert user is not None
        assert user.name == "Maria"

    def test_get_user_not_found(self, db):
        user = user_service.get_user_by_id(db, 999)
        assert user is None

    def test_get_all_users(self, db):
        user_service.create_user(db, UserCreate(name="A", email="a@test.com", password="123456"))
        user_service.create_user(db, UserCreate(name="B", email="b@test.com", password="123456"))

        users = user_service.get_all_users(db)
        assert len(users) == 2

    def test_update_user(self, db):
        created = user_service.create_user(
            db, UserCreate(name="Old", email="old@test.com", password="123456")
        )
        updated = user_service.update_user(
            db, created.id, UserCreate(name="New", email="new@test.com", password="123456")
        )

        assert updated.name == "New"
        assert updated.email == "new@test.com"

    def test_patch_user(self, db):
        created = user_service.create_user(
            db, UserCreate(name="Name", email="email@test.com", password="123456")
        )
        patched = user_service.patch_user(db, created.id, UserUpdate(name="Name2"))

        assert patched.name == "Name2"
        assert patched.email == "email@test.com"

    def test_delete_user(self, db):
        created = user_service.create_user(
            db, UserCreate(name="ToDelete", email="del@test.com", password="123456")
        )

        result = user_service.delete_user(db, created.id)
        assert result is True
        assert user_service.get_user_by_id(db, created.id) is None

    def test_delete_user_not_found(self, db):
        result = user_service.delete_user(db, 999)
        assert result is False
