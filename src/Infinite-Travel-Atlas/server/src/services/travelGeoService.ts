import type {
  DestinationTheme,
  TravelGeoMatch,
  TravelNearbyResult,
  WorldTravelPlace
} from "../types.js";
import { getWorldTravelNodes } from "./worldPromptService.js";

const EARTH_RADIUS_KM = 6371;
const DEFAULT_RADIUS_KM = 220;
const DEFAULT_LIMIT = 6;
const CACHE_TTL_MS = 1000 * 60 * 3;

type NearbyCacheEntry = {
  result: TravelNearbyResult;
  timestamp: number;
};

const nearbyCache = new Map<string, NearbyCacheEntry>();

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function normalizeLongitude(lon: number) {
  let normalized = lon;
  while (normalized > 180) {
    normalized -= 360;
  }
  while (normalized < -180) {
    normalized += 360;
  }
  return Number(normalized.toFixed(5));
}

function clampLatitude(lat: number) {
  return Number(Math.max(Math.min(lat, 90), -90).toFixed(5));
}

function haversineDistanceKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function bearingDegrees([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);
  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(rLat2);
  const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function scoreMatch(place: WorldTravelPlace, distanceKm: number) {
  const energyScore = Number.isFinite(place.energyScore) ? place.energyScore : 0.5;
  const energyPenalty = (1 - energyScore) * 40;
  return distanceKm + energyPenalty;
}

function buildCacheKey(lat: number, lon: number, radiusKm: number, limit: number) {
  return `${lat.toFixed(2)}:${lon.toFixed(2)}:${radiusKm}:${limit}`;
}

async function loadTravelPlaces() {
  const places = await getWorldTravelNodes();
  return places.filter(
    (place) =>
      Array.isArray(place.latlng) &&
      place.latlng.length === 2 &&
      Number.isFinite(place.latlng[0]) &&
      Number.isFinite(place.latlng[1])
  );
}

function rankMatches(
  places: WorldTravelPlace[],
  center: [number, number],
  radiusKm: number,
  limit: number
): { selected: TravelGeoMatch[]; radiusUsed: number } {
  const matches: TravelGeoMatch[] = places.map((place) => {
    const distanceKm = haversineDistanceKm(center, place.latlng);
    const bearing = bearingDegrees(center, place.latlng);
    return {
      place,
      distanceKm: Number(distanceKm.toFixed(1)),
      bearing: Number(bearing.toFixed(1)),
      score: scoreMatch(place, distanceKm)
    };
  });

  matches.sort((a, b) => a.score - b.score || a.distanceKm - b.distanceKm);

  const withinRadius = matches.filter((match) => match.distanceKm <= radiusKm);
  const pool = withinRadius.length >= limit ? withinRadius : matches;
  const selected = pool.slice(0, limit);
  const radiusUsed =
    selected.length > 0 ? Math.max(radiusKm, selected[selected.length - 1]!.distanceKm) : radiusKm;

  return { selected, radiusUsed };
}

export async function findNearbyTravelPlaces(options: {
  lat: number;
  lon: number;
  radiusKm?: number;
  limit?: number;
  theme?: DestinationTheme;
  minEnergy?: number;
  placesOverride?: WorldTravelPlace[];
}): Promise<TravelNearbyResult> {
  const { lat, lon } = options;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("lat and lon are required");
  }

  const normalizedLat = clampLatitude(lat);
  const normalizedLon = normalizeLongitude(lon);
  const radiusInput = Number.isFinite(options.radiusKm ?? undefined)
    ? (options.radiusKm as number)
    : undefined;
  const limitInput = Number.isFinite(options.limit ?? undefined) ? (options.limit as number) : undefined;
  const radiusKm = Math.min(Math.max(radiusInput ?? DEFAULT_RADIUS_KM, 25), 2500);
  const limit = Math.min(Math.max(Math.trunc(limitInput ?? DEFAULT_LIMIT), 1), 12);

  const cacheKey = buildCacheKey(normalizedLat, normalizedLon, radiusKm, limit);
  const cached = nearbyCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.result, cached: true };
  }

  const places = options.placesOverride ?? (await loadTravelPlaces());
  if (places.length === 0) {
    throw new Error("Travel dataset unavailable");
  }

  const filtered = places.filter((place) => {
    if (options.theme && place.theme !== options.theme) {
      return false;
    }
    if (options.minEnergy !== undefined && place.energyScore < options.minEnergy) {
      return false;
    }
    return true;
  });

  const { selected, radiusUsed } = rankMatches(
    filtered.length > 0 ? filtered : places,
    [normalizedLat, normalizedLon],
    radiusKm,
    limit
  );

  const result: TravelNearbyResult = {
    center: { lat: normalizedLat, lon: normalizedLon },
    radiusKm: Number(radiusUsed.toFixed(1)),
    matches: selected,
    totalCandidates: places.length,
    source: places[0]?.dataset ?? "procedural_seed",
    ...(options.theme || options.minEnergy !== undefined
      ? {
          filters: {
            ...(options.theme ? { theme: options.theme } : {}),
            ...(options.minEnergy !== undefined ? { minEnergy: options.minEnergy } : {})
          }
        }
      : {})
  };
  nearbyCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

export async function getGeoDatasetStatus() {
  const nodes = await getWorldTravelNodes();
  return {
    totalPlaces: nodes.length,
    cacheEntries: nearbyCache.size,
    refreshedAt: new Date().toISOString()
  };
}
