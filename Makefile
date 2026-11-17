POETRY = poetry
BACKEND_DIR = backend

# Phony targets
.PHONY: help install test lint format run help compose-up compose-down compose-ps

install: ## Instala as dependências do backend
	cd $(BACKEND_DIR) && $(POETRY) install --no-root

test: ## Executa os testes do backend
	cd $(BACKEND_DIR) && $(POETRY) run pytest

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