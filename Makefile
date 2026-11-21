POETRY = poetry
BACKEND_DIR = backend
FRONTEND_DIR = frontend
DATABASE_URL ?= postgresql+psycopg://c216:c216@localhost:5432/c216

.DEFAULT_GOAL := help

.PHONY: help install install-front test test-backend test-front test-unit test-integration test-e2e lint lint-backend lint-front build-front format \
	compose-up compose-up-build compose-down compose-build compose-logs compose-restart docker-ps \
	migrate migration

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install: ## Instala as dependências do backend
	cd $(BACKEND_DIR) && $(POETRY) install --no-root

test: ## Executa os testes do backend (local, usa SQLite em memória)
	cd $(BACKEND_DIR) && $(POETRY) run pytest

test-backend: ## Executa os testes do backend
	cd $(BACKEND_DIR) && $(POETRY) run pytest

install-front: ## Instala as dependências do frontend
	cd $(FRONTEND_DIR) && npm ci

test-front: test-unit test-integration test-e2e ## Executa todos os testes do frontend

test-unit: ## Executa os testes unitários do frontend
	cd $(FRONTEND_DIR) && npm run test:unit

test-integration: ## Executa os testes de integração do frontend
	cd $(FRONTEND_DIR) && npm run test:integration

test-e2e:  ## Executa os testes E2E do frontend
	cd $(FRONTEND_DIR) && npm run test:e2e

lint: ## Verifica lint e formatação do backend
	cd $(BACKEND_DIR) && $(POETRY) run ruff check .
	cd $(BACKEND_DIR) && $(POETRY) run ruff format --check .

lint-backend: ## Verifica lint e formatação do backend
	cd $(BACKEND_DIR) && $(POETRY) run ruff check .
	cd $(BACKEND_DIR) && $(POETRY) run ruff format --check .

lint-front: ## Verifica lint do frontend
	cd $(FRONTEND_DIR) && npm run lint

build-front: ## Compila o frontend
	cd $(FRONTEND_DIR) && npm run build

format: ## Corrige lint e aplica formatação
	cd $(BACKEND_DIR) && $(POETRY) run ruff check --fix .
	cd $(BACKEND_DIR) && $(POETRY) run ruff format .

compose-up: ## Inicia os containers do docker
	docker compose up -d

compose-up-build: ## Reconstrói a imagem da API e inicia os containers
	docker compose up -d --build

compose-down: ## Para os containers do docker
	docker compose down

compose-build: ## Reconstrói as imagens
	docker compose build

compose-logs: ## Mostra logs dos containers
	docker compose logs -f

compose-restart: ## Reinicia os containers
	docker compose restart

docker-ps: ## Mostra os containers do docker
	docker ps

migrate: ## Aplica as migrations no Postgres do container (roda local, via localhost)
	cd $(BACKEND_DIR) && DATABASE_URL=$(DATABASE_URL) $(POETRY) run alembic upgrade head

migration: ## Gera migration: make migration m="mensagem"
	cd $(BACKEND_DIR) && DATABASE_URL=$(DATABASE_URL) $(POETRY) run alembic revision --autogenerate -m "$(m)"