import type {
  DestinationRegion,
  DestinationTheme,
  TravelGeoMatch,
  TravelNearbyFilters,
  TravelNearbyResult,
  WorldTravelNode,
  WorldTravelPlace
} from "../types.js";
import { env } from "../utils/env.js";
import { findNearbyTravelPlaces } from "./travelGeoService.js";
import { buildWorldTravelPlaceFromNode } from "./worldPromptService.js";

const DEFAULT_RESOLUTION_DEG = Math.max(env.procedural.resolutionDeg, 0.05);
const CACHE_TTL_MS = Math.max(env.procedural.cacheTtlMs, 1000 * 60);
const CACHE_LIMIT = Math.max(env.procedural.cacheLimit, 100);

type CachedBeacon = {
  place: WorldTravelPlace;
  expiresAt: number;
};

type ProceduralOptions = {
  lat: number;
  lon: number;
  resolutionDeg?: number;
  radiusKm?: number;
  limit?: number;
  theme?: DestinationTheme;
  minEnergy?: number;
  includeNearby?: boolean;
};

const beaconCache = new Map<string, CachedBeacon>();

const REGION_LABELS: Record<DestinationRegion, string> = {
  americas: "Americas",
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  oceania: "Oceania",
  other: "Frontier"
};

const THEME_MOTIFS: Record<DestinationTheme, string[]> = {
  desert: [
    "across dune ridges and hidden oasis markets",
    "over sandstone canyons and lantern-lit caravanserai",
    "along dry riverbeds where night bazaars flicker"
  ],
  seaside: [
    "between coral harbors and tidal boardwalks",
    "along reef shallows and fishing wharfs",
    "past ferry lanterns and neon surf towns"
  ],
  forest: [
    "through canopy bridges and cloud forests",
    "along moss trails and misty boardwalks",
    "beneath giant ferns and lantern-lit trailheads"
  ],
  mountain: [
    "over alpine terraces and glacier streams",
    "along ridge spines and lanterned switchbacks",
    "across hanging bridges and summit huts"
  ],
  urban: [
    "through neon night markets and sky trains",
    "past rooftop gardens and harborfront esplanades",
    "between museum quarters and riverfront promenades"
  ]
};

const THEME_SENSORY: Record<DestinationTheme, string[]> = {
  desert: ["heat shimmer, spice markets, and camel bells", "oasis breezes and midnight stars"],
  seaside: ["ocean spray, harbor bells, and salt air", "reef glow, ferry horns, and tide pools"],
  forest: ["forest chorus, cedar smoke, and mist", "rain on leaves and soft lantern glow"],
  mountain: ["crisp alpine air and distant prayer flags", "ice melt, yak bells, and ridge winds"],
  urban: ["lantern glow, street food smoke, and river breeze", "tram hum, gallery chatter, and night skylines"]
};

const TIME_CUES = ["at sunrise", "in the early morning", "during golden hour", "at sunset", "after dark"];
const ACTIONS = ["Trace", "Wander", "Glide", "Climb", "Sail", "Follow", "Drift"];

function clampLatitude(lat: number) {
  return Number(Math.max(Math.min(lat, 90), -90).toFixed(6));
}

function normalizeLongitude(lon: number) {
  let normalized = lon;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return Number(normalized.toFixed(6));
}

function quantizeCoordinate(value: number, resolution: number) {
  return Number((Math.round(value / resolution) * resolution).toFixed(4));
}

function formatCoordinateLabel(lat: number, lon: number) {
  const latLabel = `${lat >= 0 ? "N" : "S"}${Math.abs(lat).toFixed(2)}`;
  const lonLabel = `${lon >= 0 ? "E" : "W"}${Math.abs(lon).toFixed(2)}`;
  return `${latLabel} ${lonLabel}`;
}

function seededFraction(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function pickSeeded<T>(items: T[], seed: string): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from empty collection");
  }
  const index = Math.floor(seededFraction(seed) * items.length) % items.length;
  return items[index]!;
}

function pruneCache() {
  if (beaconCache.size <= CACHE_LIMIT) {
    return;
  }
  const iterator = beaconCache.keys();
  while (beaconCache.size > CACHE_LIMIT) {
    const next = iterator.next();
    if (next.done) {
      break;
    }
    beaconCache.delete(next.value);
  }
}

function buildCellId(lat: number, lon: number, resolution: number) {
  const latLabel = `${lat >= 0 ? "p" : "n"}${Math.abs(lat).toFixed(2)}`;
  const lonLabel = `${lon >= 0 ? "p" : "n"}${Math.abs(lon).toFixed(2)}`;
  return `cell-${latLabel}-${lonLabel}-r${resolution.toFixed(2)}`;
}

function regionFromCoords(lat: number, lon: number): DestinationRegion {
  const normalizedLon = normalizeLongitude(lon);
  if (normalizedLon >= -170 && normalizedLon <= -30) {
    return "americas";
  }
  if (normalizedLon > -20 && normalizedLon < 60) {
    if (lat >= 35) {
      return "europe";
    }
    if (lat >= -35) {
      return "africa";
    }
  }
  if (normalizedLon >= 60 && normalizedLon <= 180) {
    if (lat <= -10 && normalizedLon >= 110) {
      return "oceania";
    }
    return "asia";
  }
  if (normalizedLon >= -60 && normalizedLon <= 180 && lat <= -35 && lat >= -60) {
    return "oceania";
  }
  return "other";
}

function deriveTheme(seed: string, lat: number, hint?: DestinationTheme): DestinationTheme {
  if (hint) {
    return hint;
  }
  const absLat = Math.abs(lat);
  if (absLat > 66) {
    return "mountain";
  }
  if (absLat < 12) {
    return pickSeeded(["desert", "seaside"], `${seed}-equator`);
  }
  if (absLat < 28) {
    return pickSeeded(["seaside", "forest", "urban"], `${seed}-tropics`);
  }
  if (absLat < 50) {
    return pickSeeded(["forest", "urban", "mountain"], `${seed}-temperate`);
  }
  return pickSeeded(["mountain", "forest"], `${seed}-high`);
}

function buildPrompt(options: {
  cellId: string;
  coordsLabel: string;
  anchorLabel: string;
  theme: DestinationTheme;
}) {
  const { cellId, coordsLabel, anchorLabel, theme } = options;
  const motif = pickSeeded(THEME_MOTIFS[theme], `${cellId}-motif`);
  const sensory = pickSeeded(THEME_SENSORY[theme], `${cellId}-sensory`);
  const timeCue = pickSeeded(TIME_CUES, `${cellId}-time`);
  const action = pickSeeded(ACTIONS, `${cellId}-action`);
  return `${action} ${motif} ${timeCue} near ${anchorLabel}, where ${sensory} guide the path. Coordinates ${coordsLabel} stay pinned to the atlas so physics and logic remain grounded in code.`;
}

function buildProceduralNode(params: {
  lat: number;
  lon: number;
  cellId: string;
  anchor?: TravelGeoMatch;
  themeHint?: DestinationTheme;
}): WorldTravelPlace {
  const { lat, lon, cellId, anchor, themeHint } = params;
  const region = anchor?.place.region ?? regionFromCoords(lat, lon);
  const continent = anchor?.place.continent ?? REGION_LABELS[region] ?? "Atlas";
  const theme = deriveTheme(cellId, lat, themeHint ?? anchor?.place.theme);
  const coordsLabel = formatCoordinateLabel(lat, lon);
  const anchorLabel = anchor
    ? `${Math.round(anchor.distanceKm)} km from ${anchor.place.placeLabel || anchor.place.destination}`
    : `${continent} grid ${coordsLabel}`;
  const prompt = buildPrompt({ cellId, coordsLabel, anchorLabel, theme });
  const destination = anchor
    ? `${anchor.place.destination} halo ${coordsLabel}`
    : `Atlas node ${coordsLabel}`;
  const country = anchor?.place.country ?? REGION_LABELS[region] ?? "Frontier";
  const iso2 = anchor?.place.iso2 ?? (REGION_LABELS[region]?.slice(0, 2).toUpperCase() || "XX");
  const node: WorldTravelNode = {
    id: `geo-${cellId}`,
    slug: `geo-${cellId}`,
    destination,
    country,
    continent,
    region,
    prompt,
    iso2,
    theme,
    latlng: [lat, lon]
  };

  if (anchor?.place.city) {
    node.city = anchor.place.city;
  }

  const place = buildWorldTravelPlaceFromNode(node);
  return {
    ...place,
    dataset: "procedural_geo",
    generatedAt: new Date().toISOString()
  };
}

export async function generateProceduralBeacon(options: ProceduralOptions): Promise<TravelNearbyResult> {
  const normalizedLat = clampLatitude(options.lat);
  const normalizedLon = normalizeLongitude(options.lon);
  const resolution = Number.isFinite(options.resolutionDeg) && (options.resolutionDeg as number) > 0.05
    ? (options.resolutionDeg as number)
    : DEFAULT_RESOLUTION_DEG;
  const quantizedLat = quantizeCoordinate(normalizedLat, resolution);
  const quantizedLon = quantizeCoordinate(normalizedLon, resolution);
  const cellId = buildCellId(quantizedLat, quantizedLon, resolution);
  const now = Date.now();

  const includeNearby = options.includeNearby !== false;
  const radiusInput = Number.isFinite(options.radiusKm ?? undefined) ? (options.radiusKm as number) : undefined;
  const limitInput = Number.isFinite(options.limit ?? undefined) ? (options.limit as number) : undefined;
  const radiusKm = Math.min(Math.max(radiusInput ?? 320, 25), 2500);
  const limit = Math.min(Math.max(Math.trunc(limitInput ?? 6), 1), 12);

  let nearby: TravelNearbyResult | null = null;
  try {
    const nearbyOptions: {
      lat: number;
      lon: number;
      radiusKm?: number;
      limit?: number;
      theme?: DestinationTheme;
      minEnergy?: number;
    } = {
      lat: quantizedLat,
      lon: quantizedLon,
      radiusKm,
      limit
    };
    if (options.theme !== undefined) {
      nearbyOptions.theme = options.theme;
    }
    if (options.minEnergy !== undefined) {
      nearbyOptions.minEnergy = options.minEnergy;
    }
    nearby = await findNearbyTravelPlaces(nearbyOptions);
  } catch {
    nearby = null;
  }

  const anchor = nearby?.matches?.[0];
  const cached = beaconCache.get(cellId);
  const validCached = cached && cached.expiresAt > now;
  const nodeParams: {
    lat: number;
    lon: number;
    cellId: string;
    anchor?: TravelGeoMatch;
    themeHint?: DestinationTheme;
  } = {
    lat: quantizedLat,
    lon: quantizedLon,
    cellId
  };
  if (anchor) {
    nodeParams.anchor = anchor;
  }
  if (options.theme !== undefined) {
    nodeParams.themeHint = options.theme;
  }
  const proceduralPlace = validCached ? cached!.place : buildProceduralNode(nodeParams);

  if (!validCached) {
    beaconCache.set(cellId, { place: proceduralPlace, expiresAt: now + CACHE_TTL_MS });
    pruneCache();
  }

  const matches: TravelGeoMatch[] = [
    { place: proceduralPlace, distanceKm: 0, bearing: 0, score: 0 }
  ];

  if (includeNearby && nearby?.matches?.length) {
    for (const match of nearby.matches) {
      if (match.place.slug === proceduralPlace.slug) {
        continue;
      }
      matches.push(match);
    }
  }

  const filters: TravelNearbyFilters | undefined =
    options.theme || options.minEnergy !== undefined
      ? {
          ...(options.theme ? { theme: options.theme } : {}),
          ...(options.minEnergy !== undefined ? { minEnergy: options.minEnergy } : {})
        }
      : undefined;

  return {
    center: { lat: quantizedLat, lon: quantizedLon },
    radiusKm: Number((nearby?.radiusKm ?? radiusKm).toFixed(1)),
    matches,
    totalCandidates: 1 + (nearby?.totalCandidates ?? 0),
    source: "procedural_geo",
    ...(filters ? { filters } : {}),
    ...(validCached ? { cached: true } : {})
  };
}
