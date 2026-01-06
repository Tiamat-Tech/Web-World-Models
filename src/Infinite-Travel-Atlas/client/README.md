# Web World Model — Frontend Notes

Vite + React (TypeScript) powers the atlas UI. The client streams palettes, guides, and travel plans from the Express API and falls back to local JSON when offline.

## Run the client
- From repo root (installs once): `npm install`
- Dev server: `npm run dev:client` (proxy `/api` → http://localhost:5001)
- Build: `npm run build --workspace client`
- Preview: `npm run preview --workspace client`

## Key surfaces
- World canvas: `src/routes/World.tsx` (map, HUD, embedded Discover).
- Destination Guide: `src/routes/DestinationGuide.tsx` (queries `/api/agent/generate`).
- Discover / Planner: `src/routes/Discover.tsx`, `src/routes/Planner.tsx`, `src/routes/Guides.tsx`.
- Components for world data: `src/components/WorldMap.tsx`, `TravelPlacesPanel.tsx`, `TravelDatasetTicker.tsx`, `AtlasPlanBoard.tsx`.
- Theme state: `src/context/ThemeContext.tsx` (`requestVibe` → `/api/themes`).
- Planner/Guide helpers: `src/hooks/useGuideNavigation.ts`, `src/hooks/useDestinationFilters.ts`, `src/hooks/useSceneImage.ts`.

## Data + fallbacks
- Primary world dataset: procedural beacons from `/api/world/prompts` (no JSON file required).
- Static demo fallback: `public/fallback-travel-points.json` (used when the live dataset or API is unavailable).
- Core content (cards, tips, stats) comes from `/api/content` which reads `server/data/content.json`.

## API expectations
- `/api/themes` — palette + mood (OpenRouter preferred, static plugin fallback).
- `/api/agent/generate` — destination guide JSON (requires OpenRouter key).
- `/api/agent/generateTravelPlan` — travel plan JSON; server auto-fallback to templates on failure.
- `/api/ai/chat` — general chat wrapper.
- `/api/ai/scene` — hero art prompt/description (static preset if OpenRouter unavailable).
- `/api/world/*` — live travel nodes, nearby lookup, single place fetch.

## Styling + UX notes
- Global styles in `src/index.css` and `src/App.css`; route-specific styles in `src/routes/world.css`.
- Theme palettes bind directly from API responses; ensure palette keys (`background`, `foreground`, `accent`, `highlight`, `muted`) stay intact.
- React Query backs remote data; see individual routes/hooks for stale times and loading states.
