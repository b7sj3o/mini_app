# Mini App — FastAPI + PostgreSQL + CI/CD

Мінімальний проєкт для вивчення CI/CD, Docker, PostgreSQL, Alembic.

## Структура

```
app/            # FastAPI backend
  main.py       # FastAPI app + CORS
  config.py     # Settings (pydantic-settings)
  database.py   # SQLAlchemy engine, Session
  models/       # User, Item
  schemas/      # Pydantic schemas
  routers/      # users, items
web/            # React + Vite frontend
  src/
    api.js      # API client
    pages/      # Home, Users, Items
alembic/        # Database migrations
tests/          # Pytest tests
.github/        # CI workflow
```

## Швидкий старт

```bash
# Копіювати env
cp .env.example .env

# Запуск всього (PostgreSQL + API + Web)
docker compose up --build

# Міграції виконуються автоматично при старті app
# API:  http://localhost:8000
# Docs: http://localhost:8000/docs
# Web:  http://localhost:5173
```

Локальний dev (без Docker для web):

```bash
docker compose up -d db app
cd web && npm install && npm run dev
# Web: http://localhost:5173 (proxy → API)
```

## Локальна розробка (без Docker)

```bash
# 1. Запустити PostgreSQL (наприклад через Docker)
docker compose up -d db

# 2. Міграції
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_app alembic upgrade head

# 3. Запуск app
uvicorn app.main:app --reload
```

## Тести

```bash
# PostgreSQL має бути запущений
docker compose up -d db
pytest tests/ -v
```

## CI/CD (.github/workflows/CI.yml)

- **test**: PostgreSQL service, міграції, pytest
- **lint**: Ruff
- **build**: Docker image (після test + lint)

## Endpoints

| Method | Path | Опис |
|--------|------|------|
| GET | / | Root |
| GET | /health | Health check |
| GET/POST | /users | List/Create users |
| GET/PATCH/DELETE | /users/{id} | User by id |
| GET/POST | /items | List/Create items (pagination, filter by owner) |
| GET/PATCH/DELETE | /items/{id} | Item by id |

## Alembic

```bash
# Створити нову міграцію
alembic revision --autogenerate -m "add_foo_column"

# Застосувати міграції
alembic upgrade head
```
