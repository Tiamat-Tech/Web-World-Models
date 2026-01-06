# Sci‑Fic World Model

Sci‑Fic World Model is an infinite-universe travel product and a reference implementation of a code-grounded, neural-symbolic web world model. The browser renders a galaxy-scale atlas while the server constrains latent LLM outputs with TypeScript/Express logic, keeping physical/logical rules stable. OpenRouter handles flavor when available; static generators backfill so the atlas never goes dark. Everything is file-backed—no external DB. The default Galaxy Travel Atlas boots directly into a deterministic, seeded galaxy with anchor + swarm nodes; OpenOuter adds typed mission briefs on demand while the physics layer stays immutable.

## Highlights

- Infinite galaxies with guaranteed anchors + swarms, sci‑fi naming, and prompts (`client/src/galaxy/universe.ts`).
- Galaxy mode is default; the reseed control spins a new deterministic layout without ever producing empty canvases.
- Live palettes/guides via OpenRouter; static generators keep UX alive when offline.
- Hover/click tooltips, double-click to open full guides, status pills for provider health.
- End-to-end TypeScript; pluggable agent plugins on the server, file-backed content.

## Code-grounded world model (research note)

- Latent space is shaped by LLMs (themes, guides), but physics/logic live in TypeScript: procedural galaxies always yield clickable anchors + swarms, never empty canvases.
- Determinism and caching come from code + local JSON, while OpenRouter supplies stylistic variance; fallbacks keep behavior predictable when offline.
- Rendering is web-native (Vite + React), so the same constraints that govern logic also paint the UI—no train/test drift between model and view.
- This pattern lowers cost versus fully generative scene synthesis and produces reproducible worlds that obey authored rules.

## Why use it

- Reliability: deterministic scaffolding guarantees structure; LLMs add flavor without breaking rules.
- Transparency: `/api/themes/providers` surfaces live vs static sources; guides/themes are cached under `server/data/generated/`.
- Extensibility: add providers via `AgentPlugin`, tweak procedural rules, or swap palettes without touching DBs.
- Research-friendly: demonstrates a neural-symbolic web stack for world models, suitable for papers/demos with reproducible behavior.

## Stack

- **Frontend**: Vite, React, TypeScript, React Router, React Query; standalone prototype in `client/index.html`.
- **Server**: Node.js ≥ 20, Express, TypeScript, pluggable agent plugins, local JSON storage.
- **AI**: OpenRouter (preferred with `OPENROUTER_API_KEY`), static palette/guides offline.

## Developer ergonomics (TS over JS)

- Shared types keep client/server schemas aligned (themes, guides, plugin contracts) and make refactors safe.
- React props stay consistent with generated data shapes; Vite hot reload plus TS errors keeps “vibe coding” fast without runtime surprises.
- Express routes validate payloads at the edge, reducing malformed LLM responses; plugin implementations remain small and typed.

## Architecture

1. **Content layer** – `server/data/content.json` seeds destinations, featured journeys, tips, and stats via `/api/content`.
2. **Theme engine** – Cursor movement submits `ThemeRequestPayload` to `/api/themes`. `PluginRegistry` tries OpenRouter then static palettes to guarantee a response.
3. **Galaxy intel** – `client/src/galaxy/universe.ts` seeds anchors and swarm nodes with deterministic positions. `/api/galaxy/planets` runs `galaxyAgentService` to produce mission JSON with typed fields and deterministic fallbacks whenever OpenRouter is unavailable.
4. **Destination guides** – `/api/agent/generate` runs `contentAgentService` with caching and OpenRouter refresh; templates backfill when offline.
5. **Chat** – `/api/ai/chat` wraps OpenRouter chat with validation and usage normalization.
6. **Client experience** – World route hosts the atlas + intel; Discover is embedded nearby. Double-click pins (or HUD) to open Destination guides. Dedicated Discover/Planner/Guide routes remain available.

## Directory map & file highlights

| Path | Purpose |
| --- | --- |
| `client/src/api/client.ts` | Thin wrapper around `fetch` with JSON parsing. |
| `client/src/api/chat.ts` | Typed helper for `/api/ai/chat`. Accepts messages, optional model/temperature/maxTokens, returns OpenRouter output + usage. |
| `client/src/api/agent.ts` | Sends `AgentRequestPayload` to `/agent/generate` for structured destination guides. |
| `client/src/context/ThemeContext.tsx` | Stores the latest `ThemeProfile` and exposes `requestVibe`, which proxies `/api/themes`. |
| `client/src/data/worldDestinations.ts` | Metadata backing the world-map pins, including biome heuristics and default languages for guide generation. |
| `client/src/routes/World.tsx` | Displays the atlas, fires vibe requests on pointer moves, and navigates into dynamically generated guides. |
| `client/src/routes/DestinationGuide.tsx` | Fetches agent content via React Query and renders overview, itineraries, food, tips, and budget cards. |
| `client/src/galaxy/universe.ts` | Typed procedural generator for galaxies/systems with sci‑fi prompts and minimum clickable nodes. |
| `server/src/app.ts` | Express app factory that wires middleware, health checks, and the `apiRouter`. |
| `server/src/routes/index.ts` | Aggregates REST modules: content, themes, agent guides, and chat. |
| `server/src/routes/themeRoutes.ts` | Validates theme payloads and returns `ThemeResult` objects produced by the plugin registry. |
| `server/src/plugins/agentPlugin.ts` | Shared interface for all theme providers. |
| `server/src/plugins/openRouterPlugin.ts` | Calls OpenRouter for palette + mood data when an API key exists. |
| `server/src/plugins/staticThemePlugin.ts` | Deterministic fallback palette generator keyed by region/style with cursor influence. |
| `server/src/services/themeService.ts` | Normalizes cursor coordinates, instantiates the registry, and exposes `generateThemeForDestination`. |
| `server/src/services/contentAgentService.ts` | Core destination guide logic: cache, templates, OpenRouter integration, revalidation. |
| `server/src/services/galaxyAgentService.ts` | Deterministic + OpenRouter-backed mission briefs for seeded planets (terrain, sky, hazards, signal). |
| `server/src/routes/agentRoutes.ts` | Input validation + handler for `/agent/generate`. |
| `server/src/routes/galaxyRoutes.ts` | Input validation + handler for `/galaxy/planets`. |
| `server/src/services/openRouterChatService.ts` | Lowest-level OpenRouter chat client (headers, timeouts, usage normalization). |
| `server/src/routes/chatRoutes.ts` | Express route for `/ai/chat`, including strict role/content validation. |
| `server/src/utils/env.ts` | Loads `.env`, enforces defaults for API key/model/port. |

## UX notes

- `/` renders the atlas, intel panel, and Discover in one canvas. Hover/tap to refresh intel; HUD shows provider status and a guide CTA.
- Galaxy mode is default: anchors + swarms are guaranteed, and the "Reseed galaxy" control spins a fresh deterministic layout.
- Double-click pins (or HUD button) to open `/destinations/:slug` with ISO/theme/lang context.
- Discover embedded under the map matches the standalone `/discover` route.
- `/api/themes/providers` drives provider badges. Procedural galaxies ensure no dead ends (anchor + swarm per galaxy).

## AI workflow details

### Theme synthesis (`/api/themes`)
- Client sends `{ destinationId, cursor, vibeSeed }`.
- `themeService` clamps the cursor, then iterates over `PluginRegistry` providers.
- `OpenRouterPlugin` posts to `https://openrouter.ai/api/v1/chat/completions` with structured prompts. On success, it returns palette, descriptive text, and prompts for the front end.
- If OpenRouter is unavailable or errors, `StaticThemePlugin` generates a palette by blending region/style baselines with cursor offsets.
- Responses include `latencyMs`, `cached` flag, and the palette fields the UI binds into CSS variables.

### Galaxy intel (`/api/galaxy/planets`)
- Payload: `{ system?, world, region?, sector?, location?, travelStyle?, basePrompt? }` seeded from `client/src/galaxy/universe.ts`.
- Service: `galaxyAgentService` returns deterministic mission JSON (planetName, summary, terrain, sky, hazards[], missionHook, signal). When `OPENROUTER_API_KEY` is set it enriches the brief; otherwise the fallback stays stable per seed.
- Client: Galaxy mode caches intel per structural hash; the reseed control advances the generator without producing empty canvases.

### Destination guides (`/api/agent/generate`)
- Payload: `{ name, iso2, theme: "desert|seaside|forest|mountain|urban", language }`.
- The service keys cache entries by ISO + theme + language. On cache hit (under 6 hours old) it returns immediately and schedules a background refresh when stale.
- When OpenRouter is configured, `callOpenRouter` sends the schema instructions and expects JSON shaped like `AgentContentResponse`. Parse failures or HTTP issues fall back to the local `THEME_LIBRARY` templates (per biome) to keep guides online.
- Itinerary stops now accept either simple strings or structured objects (`{ title, description?, timing? }`). Hidden gems follow the same pattern (`string` or `{ title, why_go }`). The client normalizes both shapes so you can safely mix local templates with richer OpenRouter outputs.

### Chat completions (`/api/ai/chat`)
- Accepts `{ messages: [{ role, content }], model?, temperature?, maxTokens?, referer?, title? }`.
- `chatRoutes` validates roles (`system|user|assistant`) and non-empty content, then forwards to `sendChatCompletion`.
- The service adds optional `HTTP-Referer` and `X-Title` headers when supplied (helpful for OpenRouter rankings), merges project default model + API key, and normalizes the resulting usage stats.
- Client code (`client/src/api/chat.ts`) wraps the endpoint so any UI hook can request completions without exposing secrets.

## Run locally

```bash
npm install
npm run dev        # client + server
# or
npm run dev:client
npm run dev:server
```

Optional `server/.env`:
```
OPENROUTER_API_KEY=sk-your-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
PORT=5001
```

Visit `http://localhost:5173`, hover the atlas to stream palettes, click pins for guides, double-click to open full Destination guides.

## Build & verification scripts

| Command | Description |
| --- | --- |
| `npm run build --workspace client` | Type-check + bundle the Vite app into `client/dist`. |
| `npm run build --workspace server` | Type-check + emit the Express API into `server/dist`. |
| `npm run dev` | Run both dev servers with proxying (`/api` → Express). |
| `npm run dev:server` | Start Express with `tsx` file watching. |
| `npm run dev:client` | Start Vite (default port 5173). |

## Build & deploy

- `npm run build` – compile client + server
- `npm start` – run built server
- Serve static client from `client/dist`; proxy `/api/*` to `server/dist`

## Contributing & extending

- **New map destinations**: extend `client/src/data/worldDestinations.ts` with lat/lng, biome tags, and optional `defaultLanguage`. `themePicker.ts` will auto-select a theme based on biome heuristics.
- **Custom theme providers**: implement `AgentPlugin` (`server/src/plugins/agentPlugin.ts`), import it in `themeService.ts`, and add any provider-specific env vars. Provider status automatically surfaces through `/api/themes/providers` for the HUD.
- **Alternative guide schemas**: adjust `AgentContentResponse` in `server/src/types.ts` plus the content agent service. The React guide route reads directly from that contract.
- **New AI features**: reuse `sendChatCompletion` so every OpenRouter call respects the existing timeout, header, and error-handling conventions.

## Agents

- Codex/agent operators: see `AGENTS.md` for stack, provider selection, and publishing notes. Keep it checked in so automated agents follow the right playbook.

## Troubleshooting

- **React error: “Objects are not valid as a React child”** – This appears when cached itinerary stops or hidden gems return objects but the UI still expects strings. Pull the latest code (or re-run `npm install && npm run build --workspace client`) so the new renderers normalize structured stops into readable text.

Enjoy exploring (and extending) the atlas!
