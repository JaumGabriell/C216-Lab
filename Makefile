# Variáveis
BACKEND_DIR = backend
POETRY = poetry

# Phony targets
.PHONY: help install test test-verbose test-cov lint format run help compose-up compose-down compose-ps

# Target padrão
.DEFAULT_GOAL := help

help: ## Mostra esta mensagem de ajuda
	@echo "Uso: make [target]"
	@echo ""
	@echo "Targets disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

run: ## Executa o backend
	cd $(BACKEND_DIR) && $(POETRY) run uvicorn app.main:app --host 0.0.0.0 --port 8000

install: ## Instala as dependências do backend
	cd $(BACKEND_DIR) && $(POETRY) install

test: ## Executa os testes do backend
	cd $(BACKEND_DIR) && $(POETRY) run pytest

test-verbose: ## Executa os testes com saída detalhada
	cd $(BACKEND_DIR) && $(POETRY) run pytest -v

test-cov: ## Executa os testes com relatório de cobertura
	cd $(BACKEND_DIR) && $(POETRY) run pytest --cov=app --cov-report=term-missing

test-unit: ## Executa testes unitários
	cd $(BACKEND_DIR) && $(POETRY) run pytest tests/unit -v

test-integration: ## Executa testes de integração
	cd $(BACKEND_DIR) && $(POETRY) run pytest tests/integration -v

compose-up: ## Inicia os containers do docker
	docker compose up -d

compose-down: ## Para os containers do docker
	docker compose down

docker-ps: ## Mostra os containers do docker
	docker ps

compose-build: ## Reconstrói as imagens
	docker compose build

compose-logs: ## Mostra logs dos containers
	docker compose logs -f

compose-restart: ## Reinicia os containers
	docker compose restart
