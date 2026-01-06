import type {
  DestinationRegion,
  DestinationTheme,
  WorldTravelNode,
  WorldTravelPlace,
  WorldTravelSummary
} from "../types.js";

const CONTINENT_RANGES: Record<
  DestinationRegion,
  { lat: [number, number]; lon: [number, number] }
> = {
  europe: { lat: [35, 70], lon: [-15, 45] },
  asia: { lat: [5, 55], lon: [60, 140] },
  americas: { lat: [-55, 60], lon: [-120, -30] },
  africa: { lat: [-35, 35], lon: [-20, 50] },
  oceania: { lat: [-45, 5], lon: [110, 180] },
  other: { lat: [-60, 75], lon: [-170, 170] }
};

const TIME_OF_DAY_KEYWORDS = [
  { label: "sunrise", pattern: /\b(sunrise|dawn|early morning)\b/i },
  { label: "morning", pattern: /\b(morning|midday|noon)\b/i },
  { label: "golden hour", pattern: /\b(golden hour|afternoon)\b/i },
  { label: "sunset", pattern: /\b(sunset|dusk|twilight)\b/i },
  { label: "night", pattern: /\b(night|midnight|starry|after dark)\b/i }
];

const SENSORY_KEYWORDS = [
  { cue: "lantern glow", pattern: /\blantern(s)?\b/i },
  { cue: "market aroma", pattern: /\b(market|street\sfood|bazaar)\b/i },
  { cue: "ocean spray", pattern: /\b(wave|shore|ocean|coast)\b/i },
  { cue: "mountain air", pattern: /\b(peak|summit|ridge|alp)\b/i },
  { cue: "temple bell", pattern: /\b(temple|shrine|monastery)\b/i },
  { cue: "forest chorus", pattern: /\b(forest|jungle|canopy)\b/i }
];

const TAG_RULES: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /\b(market|bazaar|souq)\b/i, tag: "market crawl" },
  { pattern: /\b(coast|beach|shore|lagoon|harbor)\b/i, tag: "coastal" },
  { pattern: /\b(mountain|peak|summit|ridge)\b/i, tag: "highland" },
  { pattern: /\b(forest|jungle|rainforest|canopy)\b/i, tag: "forest trail" },
  { pattern: /\b(desert|dune|sahara|wadi)\b/i, tag: "desert traverse" },
  { pattern: /\b(temple|monastery|cathedral|ruins)\b/i, tag: "heritage" },
  { pattern: /\b(lake|river|waterfront|canal)\b/i, tag: "waterfront" },
  { pattern: /\b(sky\s?tower|neon|city)\b/i, tag: "cityscape" }
];

const THEME_COLORWAYS: Record<DestinationTheme, string> = {
  desert: "#f97316",
  seaside: "#0ea5e9",
  forest: "#22c55e",
  mountain: "#8b5cf6",
  urban: "#f472b6"
};

const THEME_BASE_ENERGY: Record<DestinationTheme, number> = {
  desert: 0.62,
  seaside: 0.7,
  forest: 0.55,
  mountain: 0.6,
  urban: 0.75
};

let cachedPlaces: WorldTravelPlace[] | null = null;
let cacheTimestamp = 0;
let cachedSummary: WorldTravelSummary | null = null;
const CACHE_TTL_MS = 1000 * 60 * 10;

const REGION_LABELS: Record<DestinationRegion, string> = {
  americas: "Americas",
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  oceania: "Oceania",
  other: "Frontier"
};

const SEED_COORDS: Array<{ lat: number; lon: number; label: string }> = [
  { lat: 48.85, lon: 2.35, label: "Seine glow" },
  { lat: 52.52, lon: 13.4, label: "Spree arc" },
  { lat: 40.71, lon: -74.0, label: "Hudson orbit" },
  { lat: 34.05, lon: -118.24, label: "Pacific terrace" },
  { lat: -33.86, lon: 151.21, label: "Harbor trail" },
  { lat: 35.68, lon: 139.69, label: "Lantern ward" },
  { lat: 22.54, lon: 114.05, label: "Harbor spine" },
  { lat: 1.35, lon: 103.82, label: "Equator quay" },
  { lat: 25.2, lon: 55.27, label: "Dune inlet" },
  { lat: -23.55, lon: -46.63, label: "Rainforest ridge" },
  { lat: -34.6, lon: -58.38, label: "River delta" },
  { lat: 64.13, lon: -21.82, label: "Aurora fjord" },
  { lat: 59.91, lon: 10.75, label: "Nordic pier" },
  { lat: 64.96, lon: -19.02, label: "Icefall plain" },
  { lat: 55.75, lon: 37.61, label: "Winter metro" },
  { lat: 30.04, lon: 31.24, label: "Nile bend" },
  { lat: -1.29, lon: 36.82, label: "Savanna rise" },
  { lat: 6.52, lon: 3.37, label: "Lagoon arc" },
  { lat: 19.43, lon: -99.13, label: "Volcano belt" },
  { lat: 37.57, lon: -122.32, label: "Bay strait" },
  { lat: 21.16, lon: -86.85, label: "Reef gate" },
  { lat: 45.42, lon: -75.69, label: "Canal crest" },
  { lat: 13.75, lon: 100.5, label: "River glow" },
  { lat: 50.11, lon: 8.68, label: "Main quay" },
  { lat: 41.9, lon: 12.5, label: "Ancient stone" },
  { lat: 60.17, lon: 24.94, label: "Harbor ice" },
  { lat: 59.33, lon: 18.07, label: "Archipelago thread" },
  { lat: -36.85, lon: 174.76, label: "Island wake" },
  { lat: 43.65, lon: -79.38, label: "Lakefront beam" },
  { lat: 14.6, lon: 120.97, label: "Bay mosaic" }
];

const SEED_ACTIONS = ["Wander", "Drift", "Trace", "Sail", "Climb", "Follow", "Hover"];
const SEED_MOTIFS = [
  "lantern-lit boardwalks",
  "riverfront promenades",
  "coral harbors",
  "ridge trails",
  "forest canopy bridges",
  "desert alleys",
  "night markets"
];
const SEED_TIME = ["at sunrise", "by golden hour", "after dark", "in the early morning", "by dusk"];

const GRID_LAT_RANGE: [number, number] = [-78, 78];
const GRID_LON_RANGE: [number, number] = [-180, 180];
const GRID_LAT_STEP = 12;
const GRID_LON_STEP = 15;

function normalizeCoordinate(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number") {
    return null;
  }
  if (!Number.isFinite(value)) {
    return null;
  }
  const clamped = Math.max(Math.min(value, max), min);
  return Number(clamped.toFixed(5));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveRegionFromCoords(lat: number, lon: number): DestinationRegion {
  const normalizedLon = normalizeCoordinate(lon, -180, 180);
  const normalizedLat = normalizeCoordinate(lat, -90, 90);
  if (normalizedLon === null || normalizedLat === null) {
    return "other";
  }
  if (normalizedLon >= -170 && normalizedLon <= -30) {
    return "americas";
  }
  if (normalizedLon > -20 && normalizedLon < 60) {
    if (normalizedLat >= 35) {
      return "europe";
    }
    if (normalizedLat >= -35) {
      return "africa";
    }
  }
  if (normalizedLon >= 60 && normalizedLon <= 180) {
    if (normalizedLat <= -10 && normalizedLon >= 110) {
      return "oceania";
    }
    return "asia";
  }
  if (normalizedLon >= -60 && normalizedLon <= 180 && normalizedLat <= -35 && normalizedLat >= -60) {
    return "oceania";
  }
  return "other";
}

function deriveIso(country?: string): string {
  if (!country) {
    return "XX";
  }
  const alpha = country.replace(/[^a-z]/gi, "").toUpperCase();
  return alpha.slice(0, 2) || "XX";
}

function seededFraction(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function deriveSeedTheme(lat: number): DestinationTheme {
  const absLat = Math.abs(lat);
  if (absLat > 66) {
    return "mountain";
  }
  if (absLat < 12) {
    return "desert";
  }
  if (absLat < 28) {
    return "seaside";
  }
  if (absLat < 50) {
    return "forest";
  }
  return "urban";
}

function buildSeedPrompt(label: string, coordsLabel: string, theme: DestinationTheme, seed: string) {
  const action = SEED_ACTIONS[Math.floor(seededFraction(`${seed}-action`) * SEED_ACTIONS.length)]!;
  const motif = SEED_MOTIFS[Math.floor(seededFraction(`${seed}-motif`) * SEED_MOTIFS.length)]!;
  const time = SEED_TIME[Math.floor(seededFraction(`${seed}-time`) * SEED_TIME.length)]!;
  return `${action} through ${motif} ${time}, anchored at ${label} (${coordsLabel}). Theme: ${theme}.`;
}

function formatCoordsLabel(lat: number, lon: number) {
  const latLabel = `${lat >= 0 ? "N" : "S"}${Math.abs(lat).toFixed(2)}`;
  const lonLabel = `${lon >= 0 ? "E" : "W"}${Math.abs(lon).toFixed(2)}`;
  return `${latLabel} ${lonLabel}`;
}

function buildProceduralSeedPlaces(): WorldTravelPlace[] {
  const generatedAt = new Date().toISOString();
  const places: WorldTravelPlace[] = [];

  const makePlace = (
    lat: number,
    lon: number,
    label: string,
    seedKey: string,
    slugHint: string
  ) => {
    const region = deriveRegionFromCoords(lat, lon);
    const continent = REGION_LABELS[region] ?? "Atlas";
    const theme = deriveSeedTheme(lat);
    const coordsLabel = formatCoordsLabel(lat, lon);
    const prompt = buildSeedPrompt(label, coordsLabel, theme, seedKey);
    const destination = label || `Atlas node ${coordsLabel}`;
    const slugBase = slugify(destination);
    const slug = slugBase ? `${slugBase}-${slugHint}` : `${slugHint}`;
    const node: WorldTravelNode = {
      id: `${slugHint}`,
      slug,
      destination,
      country: continent,
      continent,
      region,
      prompt,
      iso2: deriveIso(continent),
      theme,
      latlng: [Number(lat.toFixed(2)), Number(lon.toFixed(2))]
    };
    const place = enrichTravelNode(node);
    places.push({
      ...place,
      dataset: "procedural_seed",
      generatedAt
    });
  };

  SEED_COORDS.forEach((seed, index) => {
    makePlace(seed.lat, seed.lon, seed.label, `seed-${index}-${seed.label}`, `seed-node-${index}`);
  });

  let gridIndex = 0;
  for (let lat = GRID_LAT_RANGE[0]; lat <= GRID_LAT_RANGE[1]; lat += GRID_LAT_STEP) {
    for (let lon = GRID_LON_RANGE[0]; lon < GRID_LON_RANGE[1]; lon += GRID_LON_STEP) {
      const label = `Atlas node ${formatCoordsLabel(lat, lon)}`;
      makePlace(lat, lon, label, `grid-${gridIndex}-${label}`, `grid-node-${gridIndex}`);
      gridIndex += 1;
    }
  }

  return places;
}

function splitPromptSentences(prompt: string) {
  const sentences = prompt
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const headline = sentences[0] ?? prompt;
  const atmosphere = sentences.slice(1).join(" ") || headline;
  return { headline, atmosphere };
}

function extractAction(prompt: string) {
  const match = prompt.trim().match(/^[A-Za-z'-]+/);
  if (!match) {
    return "Explore";
  }
  const word = match[0].toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function extractTimeOfDay(prompt: string) {
  for (const candidate of TIME_OF_DAY_KEYWORDS) {
    if (candidate.pattern.test(prompt)) {
      return candidate.label;
    }
  }
  return "anytime";
}

function deriveSensoryCue(prompt: string, fallback: string) {
  for (const entry of SENSORY_KEYWORDS) {
    if (entry.pattern.test(prompt)) {
      return entry.cue;
    }
  }
  const clauseMatch = /(?:while|as)\s+([^.]*)/i.exec(prompt);
  if (clauseMatch?.[1]) {
    return clauseMatch[1].trim();
  }
  return fallback;
}

function normalizeTag(tag: string) {
  return slugify(tag).replace(/-/g, " ").trim();
}

function buildTags(node: WorldTravelNode, prompt: string) {
  const tags = new Set<string>();
  tags.add(normalizeTag(node.region));
  tags.add(normalizeTag(node.theme));
  tags.add(normalizeTag(node.continent));
  if (node.city) {
    tags.add(normalizeTag(node.city));
  }
  for (const rule of TAG_RULES) {
    if (rule.pattern.test(prompt)) {
      tags.add(normalizeTag(rule.tag));
    }
  }
  return Array.from(tags);
}

function deriveEnergyScore(theme: DestinationTheme, prompt: string) {
  let energy = THEME_BASE_ENERGY[theme] ?? 0.6;
  if (/\b(sunrise|sunset|golden hour|dusk|dawn)\b/i.test(prompt)) {
    energy += 0.05;
  }
  if (/\b(market|festival|parade|street food)\b/i.test(prompt)) {
    energy += 0.08;
  }
  if (/\b(star|night|lantern|quiet|calm|still)\b/i.test(prompt)) {
    energy -= 0.04;
  }
  return Math.min(1, Math.max(0, Number(energy.toFixed(2))));
}

function deriveEnergyBucket(score: number): "calm" | "balanced" | "charged" {
  if (score <= 0.45) {
    return "calm";
  }
  if (score >= 0.7) {
    return "charged";
  }
  return "balanced";
}

function deriveBeaconSize(score: number) {
  const normalized = 0.7 + score * 0.5;
  return Number(normalized.toFixed(2));
}

function enrichTravelNode(node: WorldTravelNode): WorldTravelPlace {
  const { headline, atmosphere } = splitPromptSentences(node.prompt);
  const locationLabel = [node.city, node.country].filter(Boolean).join(", ");
  const sensoryCue = deriveSensoryCue(node.prompt, atmosphere);
  const energyScore = deriveEnergyScore(node.theme, node.prompt);
  return {
    ...node,
    placeLabel: node.destination,
    locationLabel,
    headline,
    atmosphere,
    action: extractAction(node.prompt),
    timeOfDay: extractTimeOfDay(node.prompt),
    sensoryCue,
    tags: buildTags(node, node.prompt),
    energyScore,
    colorway: THEME_COLORWAYS[node.theme] ?? "#38bdf8",
    energyBucket: deriveEnergyBucket(energyScore),
    beaconSize: deriveBeaconSize(energyScore)
  };
}

export function buildWorldTravelPlaceFromNode(node: WorldTravelNode): WorldTravelPlace {
  return enrichTravelNode(node);
}

function buildSummary(nodes: WorldTravelPlace[]): WorldTravelSummary {
  const continents: Record<string, number> = {};
  const themes: Record<DestinationTheme, number> = {
    desert: 0,
    seaside: 0,
    forest: 0,
    mountain: 0,
    urban: 0
  };
  const tagCounts = new Map<string, number>();
  const timeOfDayCounts: Record<string, number> = {};
  const actionCounts = new Map<string, number>();
  let energySum = 0;
  let energyMax = 0;
  let energyMin = nodes.length > 0 ? nodes[0]!.energyScore : 0;

  for (const node of nodes) {
    continents[node.continent] = (continents[node.continent] ?? 0) + 1;
    themes[node.theme] = (themes[node.theme] ?? 0) + 1;
    for (const tag of node.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    const bucket = node.timeOfDay ?? "anytime";
    timeOfDayCounts[bucket] = (timeOfDayCounts[bucket] ?? 0) + 1;
    if (node.action) {
      actionCounts.set(node.action, (actionCounts.get(node.action) ?? 0) + 1);
    }
    energySum += node.energyScore;
    energyMax = Math.max(energyMax, node.energyScore);
    energyMin = Math.min(energyMin, node.energyScore);
  }

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  const actions = Array.from(actionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([action, count]) => ({ action, count }));
  const averageEnergy = nodes.length > 0 ? Number((energySum / nodes.length).toFixed(2)) : 0;
  const energyRange = {
    average: averageEnergy,
    peak: Number(energyMax.toFixed(2)),
    low: Number((nodes.length > 0 ? energyMin : 0).toFixed(2))
  };

  return {
    total: nodes.length,
    continents,
    themes,
    topTags,
    timeOfDay: timeOfDayCounts,
    actions,
    energy: energyRange,
    refreshedAt: new Date().toISOString()
  };
}

async function loadPromptPlaces(): Promise<WorldTravelPlace[]> {
  // Static JSON removed; always serve procedural seed beacons.
  return buildProceduralSeedPlaces();
}

async function refreshCache() {
  cachedPlaces = await loadPromptPlaces();
  cacheTimestamp = Date.now();
  cachedSummary = buildSummary(cachedPlaces);
}

export async function getWorldTravelNodes(): Promise<WorldTravelPlace[]> {
  const now = Date.now();
  if (cachedPlaces && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPlaces;
  }
  await refreshCache();
  return cachedPlaces ?? [];
}

export async function getWorldTravelSummary(): Promise<WorldTravelSummary> {
  if (!cachedSummary || !cachedPlaces || Date.now() - cacheTimestamp >= CACHE_TTL_MS) {
    await refreshCache();
  }
  return cachedSummary ?? {
    total: 0,
    continents: {},
    themes: {
      desert: 0,
      seaside: 0,
      forest: 0,
      mountain: 0,
      urban: 0
    },
    topTags: [],
    timeOfDay: {},
    actions: [],
    energy: {
      average: 0,
      peak: 0,
      low: 0
    },
    refreshedAt: new Date().toISOString()
  };
}

export async function findWorldTravelPlace(
  slugOrIso: string
): Promise<WorldTravelPlace | undefined> {
  const normalized = slugOrIso.trim().toLowerCase();
  const nodes = await getWorldTravelNodes();
  return nodes.find(
    (node) =>
      node.slug.toLowerCase() === normalized ||
      node.iso2.toLowerCase() === normalized ||
      node.id.toLowerCase() === normalized
  );
}
