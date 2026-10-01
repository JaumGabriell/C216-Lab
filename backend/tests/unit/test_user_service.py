import pytest

from app.schemas.user import UserCreate, UserUpdate
from app.service import user as user_service


@pytest.fixture(autouse=True)
def clear_db():
    """Limpa o banco antes de cada teste."""
    user_service.clear_all_users()


class TestUserService:
    def test_create_user(self):
        data = UserCreate(name="João", email="joao@test.com", password="123456")
        user = user_service.create_user(data)
        
        assert user.id == 1
        assert user.name == "João"
        assert user.email == "joao@test.com"

    def test_get_user_by_id(self):
        data = UserCreate(name="Maria", email="maria@test.com", password="123456")
        created = user_service.create_user(data)
        
        user = user_service.get_user_by_id(created.id)
        assert user is not None
        assert user.name == "Maria"

    def test_get_user_not_found(self):
        user = user_service.get_user_by_id(999)
        assert user is None

    def test_get_all_users(self):
        user_service.create_user(UserCreate(name="A", email="a@test.com", password="123456"))
        user_service.create_user(UserCreate(name="B", email="b@test.com", password="123456"))
        
        users = user_service.get_all_users()
        assert len(users) == 2

    def test_update_user(self):
        created = user_service.create_user(UserCreate(name="Old", email="old@test.com", password="123456"))
        updated = user_service.update_user(created.id, UserCreate(name="New", email="new@test.com", password="123456"))
        
        assert updated.name == "New"
        assert updated.email == "new@test.com"

    def test_patch_user(self):
        created = user_service.create_user(UserCreate(name="Name", email="email@test.com", password="123456"))
        patched = user_service.patch_user(created.id, UserUpdate(name="Name2"))
        
        assert patched.name == "Name2"
        assert patched.email == "email@test.com"  # não mudou
        assert patched.password == "123456"

    def test_delete_user(self):
        created = user_service.create_user(UserCreate(name="ToDelete", email="del@test.com", password="123456"))
        
        result = user_service.delete_user(created.id)
        assert result is True
        assert user_service.get_user_by_id(created.id) is None

    def test_delete_user_not_found(self):
        result = user_service.delete_user(999)
        assert result is False