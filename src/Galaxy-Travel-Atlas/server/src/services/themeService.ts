import type {
  CursorPosition,
  Destination,
  DestinationStyle,
  DestinationTheme,
  ThemeProfile,
  ThemeRequestPayload,
  ThemeResult,
  WorldTravelPlace
} from "../types.js";
import { getDestinationById } from "../data/contentStore.js";
import { PluginRegistry } from "../plugins/pluginRegistry.js";
import { OpenRouterPlugin } from "../plugins/openRouterPlugin.js";
import { StaticThemePlugin } from "../plugins/staticThemePlugin.js";
import { findWorldTravelPlace } from "./worldPromptService.js";

const registry = new PluginRegistry([
  new OpenRouterPlugin(),
  new StaticThemePlugin()
]);

const THEME_CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const themeCache = new Map<string, { profile: ThemeProfile; timestamp: number }>();

const THEME_STYLE_MAP: Record<DestinationTheme, DestinationStyle> = {
  desert: "adventure",
  seaside: "relaxation",
  forest: "outdoors",
  mountain: "adventure",
  urban: "culture"
};

const THEME_DURATION_MAP: Record<DestinationTheme, number> = {
  desert: 5,
  seaside: 4,
  forest: 5,
  mountain: 6,
  urban: 4
};

const THEME_BUDGET_MAP: Record<DestinationTheme, "budget" | "moderate" | "premium"> = {
  desert: "moderate",
  seaside: "premium",
  forest: "moderate",
  mountain: "premium",
  urban: "moderate"
};

const THEME_COVER_MAP: Record<DestinationTheme | "fallback", string> = {
  desert: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80",
  seaside: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  forest: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  mountain: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  urban: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  fallback: "https://images.unsplash.com/photo-1473625220525-9f203621ce78?auto=format&fit=crop&w=1200&q=80"
};

function normalizeCursor(cursor: CursorPosition): CursorPosition {
  return {
    x: Math.min(Math.max(cursor.x, 0), 1),
    y: Math.min(Math.max(cursor.y, 0), 1)
  };
}

function getCachedTheme(cacheKey: string) {
  const entry = themeCache.get(cacheKey);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.timestamp > THEME_CACHE_TTL) {
    themeCache.delete(cacheKey);
    return null;
  }
  return entry.profile;
}

function setCachedTheme(cacheKey: string, profile: ThemeProfile) {
  themeCache.set(cacheKey, { profile, timestamp: Date.now() });
}

function toTitle(value?: string) {
  if (!value) {
    return "";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTimeWindow(timeOfDay?: string) {
  if (!timeOfDay) {
    return "Flexible windows";
  }
  const label = toTitle(timeOfDay);
  return `${label} windows`;
}

function buildHighlights(place: WorldTravelPlace) {
  const highlights = new Set<string>();
  if (place.headline) {
    highlights.add(place.headline);
  }
  if (place.sensoryCue) {
    highlights.add(`Sensory cue: ${place.sensoryCue}`);
  }
  if (place.action) {
    highlights.add(`${place.action} mode`);
  }
  if (place.tags?.length) {
    highlights.add(`Tags: ${place.tags.slice(0, 2).join(", ")}`);
  }
  return Array.from(highlights).slice(0, 3);
}

function describeClimate(place: WorldTravelPlace) {
  const energyDescription = `${place.energyBucket} energy · ${place.energyScore.toFixed(2)}`;
  const timeWindow = formatTimeWindow(place.timeOfDay);
  return `${place.continent} climate signal · ${timeWindow} · ${energyDescription}`;
}

function createDestinationFromWorldPlace(place: WorldTravelPlace): Destination {
  const style = THEME_STYLE_MAP[place.theme] ?? "any";
  const duration = THEME_DURATION_MAP[place.theme] ?? 4;
  const budgetTier = THEME_BUDGET_MAP[place.theme] ?? "moderate";
  const cover = THEME_COVER_MAP[place.theme] ?? THEME_COVER_MAP.fallback;

  return {
    id: place.id,
    name: place.destination,
    country: place.country,
    region: place.region,
    style,
    description: place.atmosphere ?? place.prompt,
    highlights: buildHighlights(place),
    bestTime: formatTimeWindow(place.timeOfDay),
    duration,
    budgetTier,
    climate: describeClimate(place),
    rating: Number((4.4 + Math.min(place.energyScore, 1) * 0.4).toFixed(1)),
    cover
  };
}

async function resolveThemeDestination(payload: ThemeRequestPayload): Promise<{
  destination: Destination;
  cacheKey: string;
}> {
  const destinationId = payload.destinationId?.trim();
  if (destinationId) {
    const destination = getDestinationById(destinationId);
    if (!destination) {
      throw new Error(`Unknown destination: ${destinationId}`);
    }
    return { destination, cacheKey: destination.id };
  }

  const travelNodeId = payload.travelNodeId?.trim();
  if (travelNodeId) {
    const travelPlace = await findWorldTravelPlace(travelNodeId);
    if (!travelPlace) {
      throw new Error(`Unknown travel node: ${travelNodeId}`);
    }
    const syntheticDestination = createDestinationFromWorldPlace(travelPlace);
    return { destination: syntheticDestination, cacheKey: syntheticDestination.id };
  }

  throw new Error("destinationId or travelNodeId is required");
}

export async function generateThemeForDestination(
  payload: ThemeRequestPayload
): Promise<ThemeResult> {
  const normalizedPayload: ThemeRequestPayload = {};
  if (payload.destinationId?.trim()) {
    normalizedPayload.destinationId = payload.destinationId.trim();
  }
  if (payload.travelNodeId?.trim()) {
    normalizedPayload.travelNodeId = payload.travelNodeId.trim();
  }
  if (payload.vibeSeed !== undefined) {
    normalizedPayload.vibeSeed = payload.vibeSeed;
  }
  if (payload.cursor) {
    normalizedPayload.cursor = normalizeCursor(payload.cursor);
  }

  const { destination, cacheKey } = await resolveThemeDestination(normalizedPayload);

  try {
    const result = await registry.generateTheme({
      destination,
      request: normalizedPayload
    });
    setCachedTheme(cacheKey, result.profile);
    return result;
  } catch (error) {
    const cachedProfile = getCachedTheme(cacheKey);
    if (cachedProfile) {
      return { profile: cachedProfile, cached: true };
    }
    // Last-resort fallback that should never trigger because of static plugin,
    // but it prevents the API from exploding if everything fails.
    const staticPlugin = new StaticThemePlugin();
    const profile = await staticPlugin.generateTheme({
      destination,
      request: normalizedPayload
    });
    setCachedTheme(cacheKey, profile);
    return { profile, cached: true };
  }
}

export function listThemeProviders() {
  return registry.getAll().map((plugin) => ({
    id: plugin.id,
    label: plugin.label,
    supportsImages: plugin.supportsImages,
    ready: plugin.ready()
  }));
}
