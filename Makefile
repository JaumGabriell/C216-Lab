# Variáveis
BACKEND_DIR = backend
POETRY = poetry

# Phony targets
.PHONY: help install test lint format run help compose-up compose-down compose-ps

# Target padrão
.DEFAULT_GOAL := help

help: ## Mostra esta mensagem de ajuda
	@echo "Uso: make [target]"
	@echo ""
	@echo "Targets disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Instala as dependências do backend
	cd $(BACKEND_DIR) && $(POETRY) install

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
