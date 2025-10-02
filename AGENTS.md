# Engineering Agents & Conventions (Backend - NestJS)

## Mission

Expose a clean REST API for movie search (OMDb proxy) and in-memory favorites. Keep controllers thin, services pure, and types explicit to enable fast iteration and testing.

## Golden Rules

- **Controller**: I/O only (validate DTOs, map status codes).
- **Service**: Business logic. No HTTP primitives here (except injected clients).
- **Types**: Prefer explicit types for external data (OMDb).
- **Errors**: Translate external failures into meaningful 4xx/5xx.
- **Config**: Read-only ConfigService; all secrets via `.env`.
- **State**: Favorites live in an in-memory `Map` (resets on restart).

## API Contracts

- `GET /movies/search?q=<string>&page=<number>` -> `Array<{ imdbID, Title, Year, Poster }>`
- `GET /favorites` -> same shape as search items
- `POST /favorites` body `{ imdbID }` -> 201 on create, 200 on idempotent
- `DELETE /favorites/:imdbID` -> 204

## Observability

- Log each outbound OMDb call (method, URL, status, ms).
- Add request IDs (header `x-request-id` passthrough).

## Testing Policy

- Unit: services (search parsing, favorites add/remove).
- E2E: happy path for all routes (optional if time-boxed).

## Non-Goals

- Persistence (DB) beyond memory.
- Complex auth/roles (public demo).
