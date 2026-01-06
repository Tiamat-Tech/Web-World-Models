import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  DestinationRegion,
  DestinationTheme,
  WorldTravelNode,
  WorldTravelPlace,
  WorldTravelPrompt,
  WorldTravelSummary
} from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const PROMPT_FILE_PATH = path.resolve(PROJECT_ROOT, "world_travel_prompts_500.json");

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

const THEME_KEYWORDS: Record<DestinationTheme, string[]> = {
  desert: ["desert", "dune", "sahara", "wadi", "arid", "oasis"],
  seaside: ["coast", "beach", "island", "lagoon", "reef", "harbor", "ocean"],
  forest: ["forest", "jungle", "canopy", "amazon", "rainforest", "grove"],
  mountain: ["mountain", "summit", "peak", "alp", "himalaya", "ridge"],
  urban: ["city", "skyline", "urban", "neon", "metro", "tower"]
};

const REGION_ALIASES: Record<string, DestinationRegion> = {
  "north america": "americas",
  "south america": "americas",
  "latin america": "americas",
  "central america": "americas",
  caribbean: "americas",
  europe: "europe",
  eu: "europe",
  asia: "asia",
  "south asia": "asia",
  "southeast asia": "asia",
  "middle east": "asia",
  oceania: "oceania",
  australia: "oceania",
  "new zealand": "oceania",
  africa: "africa"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

function deriveRegion(continentLabel?: string): DestinationRegion {
  if (!continentLabel) {
    return "other";
  }
  const normalized = continentLabel.toLowerCase();
  for (const [key, region] of Object.entries(REGION_ALIASES)) {
    if (normalized.includes(key)) {
      return region;
    }
  }

  if (normalized.includes("africa")) return "africa";
  if (normalized.includes("europe")) return "europe";
  if (normalized.includes("asia")) return "asia";
  if (normalized.includes("america")) return "americas";
  if (normalized.includes("oceania") || normalized.includes("australia")) return "oceania";

  return "other";
}

function inferTheme(prompt: string): DestinationTheme {
  const text = prompt.toLowerCase();
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS) as Array<
    [DestinationTheme, string[]]
  >) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return theme;
    }
  }
  return "urban";
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

function inferCoordinates(region: DestinationRegion, slug: string): [number, number] {
  const bounds = CONTINENT_RANGES[region] ?? CONTINENT_RANGES.other;
  const latSeed = seededFraction(`${slug}-lat`);
  const lonSeed = seededFraction(`${slug}-lon`);
  const lat = bounds.lat[0] + latSeed * (bounds.lat[1] - bounds.lat[0]);
  const lon = bounds.lon[0] + lonSeed * (bounds.lon[1] - bounds.lon[0]);
  return [Number(lat.toFixed(2)), Number(lon.toFixed(2))];
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

function normalizePromptEntry(entry: WorldTravelPrompt, index: number): WorldTravelNode | null {
  const destination =
    normalizeString(entry.destination) ??
    normalizeString(entry.city) ??
    normalizeString(entry.country);
  const country = normalizeString(entry.country);
  const prompt = normalizeString(entry.prompt);

  if (!destination || !prompt || !country) {
    return null;
  }

  const city = normalizeString(entry.city);
  const continentLabel = normalizeString(entry.continent) ?? "Global";
  const region = deriveRegion(continentLabel);
  const slugBase = slugify(destination);
  const slug = slugBase ? `${slugBase}-${index}` : `node-${index}`;
  const id = `travel-node-${index}-${slug}`;
  const iso2 = deriveIso(country);
  const theme = inferTheme(prompt);
  const latlng = inferCoordinates(region, `${slug}-${city ?? country}`);

  const node: WorldTravelNode = {
    id,
    slug,
    destination,
    country,
    continent: continentLabel,
    region,
    prompt,
    iso2,
    theme,
    latlng
  };

  if (city) {
    node.city = city;
  }

  return node;
}

async function loadPromptPlaces(): Promise<WorldTravelPlace[]> {
  try {
    const fileRaw = await readFile(PROMPT_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileRaw) as WorldTravelPrompt[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    const nodes = parsed
      .map((entry, index) => normalizePromptEntry(entry, index))
      .filter((node): node is WorldTravelNode => Boolean(node))
      .map(enrichTravelNode);
    return nodes;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[worldPromptService] Unable to load travel prompts", error);
    return [];
  }
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
