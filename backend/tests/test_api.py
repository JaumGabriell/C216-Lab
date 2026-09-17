"""Testes unitários para a API."""

import pytest
from fastapi.testclient import TestClient


class TestRootEndpoint:
    """Testes para o endpoint raiz."""

    def test_root_returns_200(self, client: TestClient):
        """Teste 1: Verifica se o endpoint raiz retorna status 200."""
        response = client.get("/")
        assert response.status_code == 200

    def test_root_returns_hello_message(self, client: TestClient):
        """Teste 2: Verifica se o endpoint raiz retorna a mensagem correta."""
        response = client.get("/")
        data = response.json()
        assert data["message"] == "hello"

    def test_root_response_is_json(self, client: TestClient):
        """Teste 3: Verifica se a resposta é JSON válido."""
        response = client.get("/")
        assert response.headers["content-type"] == "application/json"
        assert isinstance(response.json(), dict)


class TestErrorCases:
    """Testes para casos de erro."""

    def test_not_found_returns_404(self, client: TestClient):
        """Teste 4 (Caso de Erro): Verifica se rota inexistente retorna 404."""
        response = client.get("/rota-inexistente")
        assert response.status_code == 404

    @pytest.mark.parametrize(
        "method",
        ["post", "put", "delete", "patch"],
    )
    def test_root_method_not_allowed(self, client: TestClient, method: str):
        """Teste 5 (Parametrizado): Verifica se métodos não permitidos retornam 405."""
        response = getattr(client, method)("/")
        assert response.status_code == 405


class TestResponseStructure:
    """Testes para estrutura da resposta."""

    @pytest.mark.parametrize(
        "expected_key,expected_type",
        [
            ("message", str),
        ],
    )
    def test_response_has_expected_keys(
        self, client: TestClient, expected_key: str, expected_type: type
    ):
        """Teste 6 (Parametrizado): Verifica estrutura da resposta."""
        response = client.get("/")
        data = response.json()
        assert expected_key in data
        assert isinstance(data[expected_key], expected_type)
