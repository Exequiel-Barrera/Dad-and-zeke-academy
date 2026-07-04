@promptkit/

# AGENTS.md

## Project Overview

boilerplate-fullstack-auth is a starter template for full-stack TypeScript applications with Auth0 JWT authentication pre-wired. It extends the standard fullstack boilerplate with Auth0 SDK on the client and `express-jwt` / `jwks-rsa` validation on the server.

**Key Technologies:**
- **Frontend**: React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, `@auth0/auth0-react`
- **Backend**: Node.js, Express.js, TypeScript, Knex.js, SQLite3, `express-jwt`, `jwks-rsa`
- **Testing**: Vitest, React Testing Library

**Architecture:**
- `client/`: React SPA — Auth0Provider wraps the app; `useAuth0` hook provides login/logout/user
- `server/`: Express backend — `server/auth0.ts` exports `checkJwt` middleware for protected routes
- `models/`: Shared TypeScript interfaces
- API base path: `/api/v1`

## Building and Running

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run knex migrate:latest` | Run database migrations |
| `npm run knex seed:run` | Seed database with initial data |
| `npm run dev` | Start client (`http://localhost:5173`) and server (`http://localhost:3000`) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test -- --run` | Run all tests once |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |

**Important:** Always use `npm run dev`. Opening `index.html` directly won't load TypeScript.

## Development Conventions

- **Code Style**: ESLint and Prettier enforce consistent style.
- **Authentication setup**: Configure Auth0 domain, client ID, and audience in `client/index.tsx` and `server/auth0.ts` before the app will work.
- **Testing**: Vitest and React Testing Library.

## Architecture Decisions

- **Auth0 for identity**: Auth0 handles all login/registration — the app never processes passwords. After login the client holds a JWT; the server validates it via JWKS.
- **`checkJwt` middleware**: `server/auth0.ts` exports a configured `express-jwt` middleware. Add it to any route that should require authentication: `router.post('/', checkJwt, handler)`.
- **`auth0Id` (`sub` claim)**: `req.auth?.sub` in protected handlers contains the user's Auth0 identifier — useful for associating records with a user.
- **Tailwind CSS**: Frontend styled with Tailwind utility classes. Configuration in `tailwind.config.js`.
- **React Router**: Client-side routing is included. Routes defined in `client/routes.tsx`.

## Key Conventions

- Fill in `domain`, `clientId`, and `audience` in `client/index.tsx` `Auth0Provider` before running.
- Fill in `domain` and `audience` in `server/auth0.ts` to match Auth0 dashboard values.
- Protected routes use `checkJwt` as middleware and receive `JwtRequest` (typed with `req.auth`).
- Public routes use the standard `Request` type and do not use `checkJwt`.
- **Note:** This template uses strict ESLint and Prettier rules. Follow them exactly when extending the boilerplate.

## Potential Pitfalls

- **Auth0 config required before testing**: Empty `domain`/`clientId`/`audience` strings cause silent failures at login — Auth0 will not redirect correctly.
- **`audience` must match exactly**: The `audience` in `Auth0Provider` (client) and `server/auth0.ts` must be identical to the API Identifier in Auth0 — a mismatch causes 401 errors even with a valid token.
- **`getAccessTokenSilently` needs audience**: On the client, pass `{ authorizationParams: { audience } }` to get a JWT rather than an opaque token.
- **JWKS URI constructed from domain**: `server/auth0.ts` builds the JWKS URI from `domain` — ensure `domain` is the full URL with protocol (e.g. `https://your-app.au.auth0.com`).

## Related Documentation

- [AGENTS.md](AGENTS.md): Shared AI context file — source of truth for all agent briefings.
- [CLAUDE.md](CLAUDE.md): Claude Code context (imports AGENTS.md; may include tutoring guidelines if used in educational settings).
- [GEMINI.md](GEMINI.md): Gemini AI context (self-contained copy of this file's content).

## PromptKit Quick Reference
- Review the available artefacts when the student requests them:
  - Protocol: `promptkit/protocols/setup.md` — instructions for updating these CLI briefings.
  - Workflow: `promptkit/workflows/tutor.md` — guide for tutoring/explanation sessions.
  - Workflow: `promptkit/workflows/reflect.md` — guide for documenting outcomes and next steps.
- Student notes live in `promptkit/notes/`; The table in `progress-journal.md` is main place to update with reflections. Instructor Activities are in `promptkit/activities/` (read-only).
- When new workflows arrive, expect additional files under `promptkit/workflows/`.
