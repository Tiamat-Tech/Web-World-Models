**Stack:** Node.js (≥ 20), TypeScript, Express, Vite + React (TS), local file storage (no DB), OpenRouter for LLM text & image generation

## Agent integration notes

- Theme plugins implement `AgentPlugin` (`server/src/plugins/agentPlugin.ts`) and are registered in `themeService.ts`.
- OpenRouter is preferred when `OPENROUTER_API_KEY` is present; a static palette generator backfills when offline.
- Frontend displays live provider availability via `/api/themes/providers`.

## Product context (public-ready)

- **Experience**: An infinite sci‑fi travel atlas with clickable galaxies and worlds. Palettes/themes and guides stream from OpenRouter when available; static fallbacks prevent downtime.
- **Guarantees**: Every galaxy has clickable systems (anchor + swarm) generated via `client/src/galaxy/universe.ts`. No empty views.
- **Front end**: Vite + React + TS; primary UX in `client/src/routes/World.tsx`, plus a standalone prototype in `client/index.html`.
- **Back end**: Express + TS with pluggable providers. OpenRouter is primary; static theme plugin is the safety net.
- **Data**: File-backed (JSON). No database. Guides/palettes cached under `server/data/generated/`.

## Developer quickstart

- `npm install`
- `npm run dev` (client + server) or `npm run dev:client` / `npm run dev:server`
- Set `OPENROUTER_API_KEY` in `server/.env` for live themes/guides; otherwise static generators respond.

## Publishing notes

- The client can be hosted as static assets from `client/dist`; proxy `/api/*` to the Express server (`server/dist`).
- Provider status surfaces automatically via `/api/themes/providers`—keep it exposed for transparency.
- Keep `AGENTS.md` checked in for integrators; point product docs to `docs/PRODUCT_LAUNCH.md` for release steps.
