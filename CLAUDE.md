# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Using This Boilerplate

This is a starter template with Auth0 authentication pre-wired. Before the app will work you must:

1. Create an Auth0 Application (Single Page Application) and API in the Auth0 dashboard
2. Set callback/logout URLs in Auth0 to `http://localhost:5173`
3. Fill in `domain`, `clientId`, and `audience` in `client/index.tsx` `Auth0Provider`
4. Fill in `domain` and `audience` in `server/auth0.ts`

**To add a protected route:**
1. Create `server/routes/<resource>.ts`
2. Import `checkJwt` from `../auth0.ts`
3. Add it as middleware on the routes that require authentication: `router.post('/', checkJwt, handler)`
4. In the handler, use `(req as JwtRequest).auth?.sub` to get the authenticated user's Auth0 ID
5. Mount in `server/server.ts`

**To access the token on the client:**
- Use `getAccessTokenSilently({ authorizationParams: { audience } })` from `useAuth0`
- Pass the token as `Authorization: Bearer <token>` in mutating API requests

## Tutoring Guidelines

- Follow the `promptkit/workflows/tutor.md` workflow for explanation sessions.
- Ask questions that move students toward the answer rather than stating it.
- When a student is stuck on Auth0 setup, refer them to the Auth0 dashboard walkthrough in the jwt-auth README — the setup steps are identical.
- Do not implement authentication flows on behalf of the student — guide them to locate the right values in their Auth0 dashboard and place them in the right config files.
