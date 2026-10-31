# Variáveis
BACKEND_DIR = backend
FRONTEND_DIR = frontend
POETRY = poetry
NPM = npm


# Phony targets
.PHONY: help install test test-verbose test-cov lint format run \
	frontend-install frontend-dev frontend-lint frontend-format frontend-check \
	frontend-test frontend-test-e2e frontend-build check-all \
	compose-up compose-down compose-ps compose-build compose-logs compose-restart \
	docker-ps

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


# Frontend

frontend-install: ## Instala as dependências do frontend
	$(NPM) --prefix $(FRONTEND_DIR) ci

frontend-dev: ## Inicia o servidor de desenvolvimento (Vite)
	$(NPM) --prefix $(FRONTEND_DIR) run dev

frontend-lint: ## Executa o linter do frontend (ESLint)
	$(NPM) --prefix $(FRONTEND_DIR) run lint

frontend-format: ## Formata o código do frontend (Biome)
	$(NPM) --prefix $(FRONTEND_DIR) run format

frontend-check: ## Executa lint e formatação sem alterar arquivos
	$(NPM) --prefix $(FRONTEND_DIR) run check

frontend-test: ## Executa os testes do frontend (Vitest)
	$(NPM) --prefix $(FRONTEND_DIR) run test:run

frontend-test-e2e: ## Executa os testes E2E do frontend (Playwright)
	$(NPM) --prefix $(FRONTEND_DIR) run test:e2e

frontend-build: ## Gera o build de produção do frontend
	$(NPM) --prefix $(FRONTEND_DIR) run build

# Verificação geral

check-all: ## Executa verificações do backend e frontend
	$(MAKE) lint
	$(MAKE) test
	$(MAKE) frontend-check
	$(MAKE) frontend-test
	$(MAKE) frontend-build
	$(MAKE) frontend-test-e2e

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

lint: ## Executa o linter (ruff)
	cd $(BACKEND_DIR) && $(POETRY) run ruff check .

format: ## Formata o código (ruff)
	cd $(BACKEND_DIR) && $(POETRY) run ruff format .
