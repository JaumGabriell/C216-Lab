import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.service import user as user_service


@pytest.fixture
def client():
    user_service.clear_all_users()
    return TestClient(app)


class TestUsersAPI:
    def test_get_users_empty(self, client: TestClient):
        response = client.get("/users/")
        assert response.status_code == 200
        assert response.json() == []

    def test_create_user(self, client: TestClient):
        response = client.post("/users/", json={"name": "Test", "email": "test@test.com", "password": "password"})
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test"
        assert "id" in data
        

    def test_get_user_by_id(self, client: TestClient):
        # Cria usuário
        create_resp = client.post("/users/", json={"name": "User", "email": "user@test.com", "password": "password"})
        user_id = create_resp.json()["id"]
        
        # Busca por ID (Path Parameter)
        response = client.get(f"/users/{user_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "User"

    def test_get_user_not_found(self, client: TestClient):
        response = client.get("/users/999")
        assert response.status_code == 404

    def test_update_user_put(self, client: TestClient):
        create_resp = client.post("/users/", json={"name": "Old", "email": "old@test.com", "password": "password"})
        user_id = create_resp.json()["id"]
        
        response = client.put(f"/users/{user_id}", json={"name": "New", "email": "new@test.com", "password": "password"})
        assert response.status_code == 200
        assert response.json()["name"] == "New"

    def test_patch_user(self, client: TestClient):
        create_resp = client.post("/users/", json={"name": "Name", "email": "email@test.com", "password": "password"})
        user_id = create_resp.json()["id"]
        
        response = client.patch(f"/users/{user_id}", json={"name": "Patched"})
        assert response.status_code == 200
        assert response.json()["name"] == "Patched"
        assert response.json()["email"] == "email@test.com"

    def test_delete_user(self, client: TestClient):
        create_resp = client.post("/users/", json={"name": "ToDelete", "email": "del@test.com", "password": "password"})
        user_id = create_resp.json()["id"]
        
        response = client.delete(f"/users/{user_id}")
        assert response.status_code == 204
        
        # Confirma que foi deletado
        get_resp = client.get(f"/users/{user_id}")
        assert get_resp.status_code == 404

    def test_delete_user_not_found(self, client: TestClient):
        response = client.delete("/users/999")
        assert response.status_code == 404