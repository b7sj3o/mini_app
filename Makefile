.PHONY: up down test migrate lint

up:
	docker compose up -d

down:
	docker compose down

test:
	docker compose up -d db
	docker compose exec db pg_isready -U postgres || sleep 3
	DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ci_test alembic upgrade head
	DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ci_test pytest tests/ -v

migrate:
	alembic upgrade head

migrate-new:
	alembic revision --autogenerate -m "$(msg)"

lint:
	ruff check app/ tests/
