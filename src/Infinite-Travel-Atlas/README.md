# Infinite Travel Atlas

Infinite travel atlas: a cursor-reactive React front end sits on top of a TypeScript + Express API that orchestrates OpenRouter for palettes, itineraries, travel plans, and chat.

## What ships
- Atlas-first UI (Vite + React) with Discover, Planner, and Destination Guide routes powered by the world dataset.
- Theme engine that streams vibes from OpenRouter with a static palette backfill when the provider is offline.
- Destination guide agent that injects travel-point context so itineraries and hidden gems feel place-aware.
- Travel-plan agent for the cockpit globe, plus scene-image prompts for hero art.
- General-purpose chat wrapper so the client can call OpenRouter without exposing secrets.

## Architecture at a glance
- **Data layer**: `server/data/content.json` seeds destinations/journeys/tips/stats for `/api/content`. World beacons are procedurally generated via `server/src/services/worldPromptService.ts` (seed grid) and `server/src/services/proceduralBeaconService.ts` (on-demand beacons).
- **Theme engine (`/api/themes`)**: `themeService.ts` clamps cursor coords, resolves a destination (by `destinationId` or `travelNodeId`), then walks the plugin registry (`PluginRegistry` with `OpenRouterPlugin` + `StaticThemePlugin`). OpenRouter is preferred when `OPENROUTER_API_KEY` is set; otherwise the static palette generator backfills.
- **Destination guides (`/api/agent/generate`)**: `contentAgentService.ts` streams JSON from OpenRouter using the live travel-point context (slug, sensory cues, tags, coords). The client normalizes simple strings and structured itinerary/hidden gem objects.
- **Travel plans (`/api/agent/generateTravelPlan`)**: `travelPlanAgentService.ts` enriches cockpit prompts with dataset metadata, validates the LLM JSON, and auto-recovers with `travelPlanFallbackService.ts` if OpenRouter is absent or returns incomplete output.
- **Scene art (`/api/ai/scene`)**: `sceneImageService.ts` returns OpenRouter prompts for hero imagery, with static presets per page when offline.
- **Chat (`/api/ai/chat`)**: Thin OpenRouter wrapper with strict role/content validation and usage normalization.

## Quick start (local launch)
1) Install once from the repo root:
```bash
npm install
```

2) Create `server/.env` (required for AI-powered routes):
```
OPENROUTER_API_KEY=sk-your-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
PORT=5001
```

3) Run the stack:
```bash
npm run dev             # runs client + server together
# or split:
npm run dev:server
npm run dev:client
```

4) Open http://localhost:5173 — hover the world to stream palettes, click/double-click pins to launch guides, or use the cockpit globe in `client/index.html` for travel-plan generation.

## API cheat sheet
- `GET /api/content` — Base content JSON for destinations, journeys, tips, stats.
- `POST /api/themes` — Body: `{ destinationId? | travelNodeId?, cursor?, vibeSeed? }` → `ThemeResult` with palette, mood, travelCue, prompt. Falls back to static plugin if OpenRouter is down.
- `GET /api/themes/providers` — Live provider readiness (OpenRouter vs static).
- `POST /api/agent/generate` — Body: `{ name, iso2, theme, language, travelContext? }` → structured `AgentContentResponse`.
- `POST /api/agent/generateTravelPlan` — Body: `{ prompt, location:{ continent,country,city,area }, metadata? }` → `TravelPlanResponse` with auto-fallback if JSON is missing fields.
- `POST /api/ai/chat` — Body: `{ messages:[{role,content}], model?, temperature?, maxTokens?, referer?, title? }`.
- `POST /api/ai/scene` — Body: `{ page, context? }` → scene prompt/description (static fallback when offline).
- `GET /api/world/prompts` — Normalized world nodes + summary from procedural seed beacons (no JSON file required).
- `GET /api/world/nearby?lat&lon[&radiusKm&limit&theme&minEnergy]` — Ranked nearby prompts with energy scoring and optional filters.
- `GET /api/world/beacon?lat&lon[&radiusKm&limit&resolutionDeg&theme&minEnergy&includeNearby]` — Procedurally generates a beacon for any coordinate (cached per grid cell) and optionally surrounds it with nearby static prompts.
- `GET /api/world/places/:slug` — Single normalized world node by slug/iso/id.

Example curl (theme from travel node):
```bash
curl -X POST http://localhost:5001/api/themes \
  -H "Content-Type: application/json" \
  -d '{"travelNodeId":"travel-node-1-kyoto","cursor":{"x":0.42,"y":0.58}}'
```

## Frontend guide
- Entry: `client/src/main.tsx`, routes in `client/src/routes`.
- World canvas: `client/src/routes/World.tsx` (map + Discover embedded). Destination guide: `client/src/routes/DestinationGuide.tsx`.
- Vanilla cockpit (`client/index.html` + `client/script.js`): fetches `/api/world/prompts` first, jitters inferred coords and shuffles points to avoid grid patterns, then falls back to baked-in `fallback-travel-points` if the API is unavailable.
- Theme state: `client/src/context/ThemeContext.tsx` (`requestVibe` → `/api/themes`).
- World dataset visuals: `client/src/components/WorldMap.tsx`, `TravelPlacesPanel.tsx`, `AtlasPlanBoard.tsx`.
- Fallback travel points for static demos: `client/public/fallback-travel-points.json`.

## Server guide
- Entry: `server/src/index.ts` with `createApp` in `server/src/app.ts`.
- Routes assembled in `server/src/routes/index.ts`; see route files for validation rules.
- Env loader: `server/src/utils/env.ts` (defaults port 5001, model `anthropic/claude-3.5-sonnet`).
- World dataset normalization: `server/src/services/worldPromptService.ts`.
- Geo queries + caching: `server/src/services/travelGeoService.ts` (tests in `server/src/__tests__/travelGeoService.test.ts`).
- Agent plugins contract: `server/src/plugins/agentPlugin.ts`; registry in `pluginRegistry.ts`; providers in `openRouterPlugin.ts` and `staticThemePlugin.ts`.

## Data + customization
- World beacons: procedural seeds power `/api/world/prompts`; `/api/world/beacon` mints any coordinate on-demand. No JSON file required.
- Add featured destinations/journeys/stats: edit `server/data/content.json`.
- New theme providers: implement `AgentPlugin`, register in `themeService.ts`. Provider readiness surfaces in `/api/themes/providers`.
- Tweak fallback travel plans: adjust templates in `server/src/services/travelPlanFallbackService.ts`.

### Procedural beacon tuning
- `PROCEDURAL_RESOLUTION_DEG` (default `0.75`): denser/looser grid for procedural pins.
- `PROCEDURAL_CACHE_TTL_MS` (default `1800000` = 30 min): how long a generated cell stays cached.
- `PROCEDURAL_CACHE_LIMIT` (default `1200`): max cached cells before older entries are pruned.

## Build, test, ship
- Type-check/bundle: `npm run build --workspace client` and `npm run build --workspace server`.
- Run server tests: `npm test --workspace server` (covers `travelGeoService` today).
- Production start: `npm run build && npm run start`.

## Operational notes
- OpenRouter is required for AI-powered guides, plans, chat, and dynamic themes. When the key is missing or the provider cools down, themes fall back to the static plugin and travel plans fall back to the local template, so the UI keeps moving.
- No external DB: everything is in JSON on disk. Ports/env live in `server/.env`.
- CORS is open (`origin: *`) for local development; lock it down before exposing publicly.

Enjoy shipping the infinite travel atlas.
