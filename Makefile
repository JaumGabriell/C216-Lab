POETRY = poetry
BACKEND_DIR = backend
DATABASE_URL ?= postgresql+psycopg://c216:c216@localhost:5432/c216

.DEFAULT_GOAL := help

.PHONY: help install test lint format \
	compose-up compose-up-build compose-down compose-build compose-logs compose-restart docker-ps \
	migrate migration

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install: ## Instala as dependências do backend
	cd $(BACKEND_DIR) && $(POETRY) install --no-root

test: ## Executa os testes do backend (local, usa SQLite em memória)
	cd $(BACKEND_DIR) && $(POETRY) run pytest

lint: ## Verifica lint e formatação do backend
	cd $(BACKEND_DIR) && $(POETRY) run ruff check .
	cd $(BACKEND_DIR) && $(POETRY) run ruff format --check .

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