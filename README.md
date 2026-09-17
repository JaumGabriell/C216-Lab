# C216-Lab

Projeto da disciplina C216 - Laboratório de Engenharia de Software.

## Requisitos

- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation)
- Docker (opcional)

## Instalação

```bash
# Instalar dependências do backend
make install
```

## Executar Testes

### Localmente

```bash
# Executar testes
make test

# Executar testes com saída detalhada
make test-verbose

# Executar testes com cobertura (requer pytest-cov)
make test-cov
```

### Via Poetry (diretamente)

```bash
cd backend
poetry install
poetry run pytest -v
```

## CI/CD

O projeto utiliza **GitHub Actions** para integração contínua.

### Workflow: CI Backend

- **Arquivo**: `.github/workflows/ci-backend.yml`
- **Trigger**: Push e Pull Request nas branches `main` e `master`
- **Jobs**:
  - Configura Python 3.11
  - Instala Poetry
  - Instala dependências
  - Executa Pytest

O status do CI pode ser visualizado na aba **Actions** do repositório.

## Docker

```bash
# Subir containers
make compose-up

# Parar containers
make compose-down

# Ver logs
make compose-logs
```
