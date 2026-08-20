install:
	cd backend && poetry install

test:
	cd backend && poetry run pytest