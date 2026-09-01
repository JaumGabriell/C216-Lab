# Variáveis
BACKEND_DIR = backend
POETRY = poetry

# Phony targets
.PHONY: help install test lint format run help

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