#imagem base
FROM python:3.11-slim

#Diretorio de trabalho
WORKDIR /app

# instalar poetry
RUN pip install poetry

#copiar arquivos de dependencia
COPY pyproject.toml poetry.lock ./

#instalar dependencias
RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi --no-root

#copiar codigo fonte
COPY app ./app

#expor porta
EXPOSE 8000

#comando para rodar a aplicacao
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]