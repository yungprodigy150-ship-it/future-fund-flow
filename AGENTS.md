# Base44 dev environment notes

## What this app is
Vite + React 19 SPA (`FinSmart`), no bundled backend. Supabase is used **only for
authentication** (`src/lib/supabaseClient.ts`, `src/contexts/AuthContext.tsx`);
savings/goal data lives in `localStorage` (`src/components/SavingsTracker.tsx`).
The Paystack return route is client-side only — no server-side payment secret exists
in this repo.

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
One service, `web`, on host port 3000: `oven/bun:1.2.22` with the repo bind-mounted at
`/app`, `bun install --frozen-lockfile` then `bun run dev` (Vite dev server).
`node_modules` is a named volume so host installs never leak in.

The image is a plain runtime image and the source is bind-mounted — edits hot-reload.
No rebuild is needed for code changes.

## Gotchas
- **Vite reads `VITE_*` from `process.env` at dev-server start.** The values are baked
  into `import.meta.env` for the client, so changing a secret requires the container to
  be recreated (the platform does this automatically when secrets change). Verify with
  `curl -s localhost:3000/src/lib/supabaseClient.ts | head -1`.
- `@supabase/supabase-js` **throws at import time** unless the URL is `http(s)://`,
  which blanks the entire page. The compose `command` substitutes a placeholder URL when
  no usable value is configured, so the UI boots before real credentials exist. Real
  `https://` values from `/run/base44/app.env` are passed through untouched.
- Escape `$` as `$$` in compose shell commands, otherwise Compose interpolates the
  variable away before the shell ever sees it.
- `vite.config.ts` already sets `allowedHosts: true`, so the preview proxy host works.

## Verifying
```
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/      # expect 200
docker compose -f docker-compose.base44.yml ps                       # expect (healthy)
```
The compose healthcheck fetches `/` and asserts the served HTML references
`src/main.tsx`, i.e. the dev server is serving live source rather than a built bundle.
`vite-plugin-checker` prints `[TypeScript] Found 0 errors` in the logs on startup.
