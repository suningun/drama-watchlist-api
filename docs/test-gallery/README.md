# Test Gallery Checklist

Screenshots live in this folder. Capture each request in Postman or Thunder
Client, then save the image with the matching filename.

| # | Proof required | Request | Expected | Filename |
| --- | --- | --- | --- | --- |
| 1 | List all items | `GET /items` | `200` + array | `01-list.png` |
| 2 | Get one item | `GET /items/:id` | `200` + record | `02-get-one.png` |
| 3 | Create an item | `POST /items` with bearer token | `201` + record | `03-create.png` |
| 4 | Validation error for empty required field | `POST /items` with `{ "title": "", "genre": "Drama" }` | `400` + `title should not be empty` | `04-validation-empty.png` |
| 5 | Update an item | `PATCH /items/:id` with `{ "watched": true }` | `200` + updated record | `05-update.png` |
| 6 | Delete an item | `DELETE /items/:id` | `200` + `{ "deleted": true }` | `06-delete.png` |
| 7 | Missing item | `GET /items/999999` | `404` + `not found` | `07-not-found.png` |
| 8a | Create without token | `POST /items` with no auth header | `401` | `08a-unauthorized.png` |
| 8b | Same request with token | `POST /items` with `Authorization: Bearer ...` | `201` | `08b-authorized.png` |
| 9a | Unit tests pass | `npm test` | all tests green | `09a-unit-tests.png` |
| 9b | E2E tests pass | `npm run test:e2e` | all tests green | `09b-e2e-tests.png` |

## Getting a token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password123"}'
```

Use the returned `access_token` as a Bearer token for the protected requests.
