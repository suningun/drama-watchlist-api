# Drama Watchlist API

A NestJS + PostgreSQL CRUD API for keeping a personal watchlist of dramas
(K-dramas, in my case). It supports listing, creating, updating, and deleting
dramas, with JWT-protected write operations and validated request bodies.

## Theme and data fields

**Theme:** a personal drama watchlist. Each record is one drama you want to
watch or have finished.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Primary key, auto-increment |
| `title` | string | Required, non-empty |
| `genre` | string | Required, non-empty |
| `watched` | boolean | Defaults to `false` |
| `createdAt` | timestamp | Set automatically |

## Routes

| Action | Method | URL |
| --- | --- | --- |
| List all dramas | GET | `/items` |
| Get one drama | GET | `/items/:id` |
| Create a drama | POST | `/items` |
| Update a drama | PATCH | `/items/:id` |
| Delete a drama | DELETE | `/items/:id` |

`GET` routes are public. `POST`, `PATCH`, and `DELETE` require
`Authorization: Bearer <token>`; requests without a valid token return `401`.
IDs are auto-increment integers, so records are easy to reference (for example
`GET /items/1`).

## Run it with Docker (recommended)

Requires Docker Desktop. Nothing else — the database and migrations are handled
for you.

```bash
docker compose up --build
```

API: <http://localhost:3000>. Stop with `docker compose down`.

## Run it locally

Requires Node.js **22.12+** and PostgreSQL 14+ (or Docker for the database).

```bash
docker compose up -d db          # PostgreSQL on localhost:5433
cp .env.example .env             # defaults already point at port 5433
npm ci
npm run migration:run
npm run start:dev
```

If you already run PostgreSQL locally on port 5432, set `DB_PORT=5432` and
`DB_NAME=drama_watchlist` in `.env` instead.

## Try it

```bash
# 1. Log in (demo credentials)
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password123"}'
# => { "access_token": "..." }

# 2. Put the token in an environment variable (copy it from the response above)
export TOKEN="paste-the-access-token-here"

# 3. Create a drama
curl -X POST http://localhost:3000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Reply 1988","genre":"Drama"}'
# => { "id": 1, "title": "Reply 1988", "genre": "Drama", "watched": false, ... }

# 4. List dramas (public)
curl http://localhost:3000/items
```

Demo credentials: **admin / password123**.

## Tests

```bash
npm test           # unit tests
npm run test:e2e   # end-to-end tests
npm run lint
```

The E2E suite needs PostgreSQL running with migrations applied. Complete the
local setup above (database + `.env` + `npm run migration:run`) before running
it, even if you started the API with Docker. Both suites pass (9 unit tests,
15 E2E tests).

## Documentation

- [Reflection](REFLECTION.md)
- [Test gallery checklist](docs/test-gallery/README.md)
