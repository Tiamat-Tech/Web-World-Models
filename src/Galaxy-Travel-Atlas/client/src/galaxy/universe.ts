import { slugify } from "../utils/format";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";

const GOLDEN_ANGLE = 2.399963229728653;

const SYSTEM_PREFIXES = ["Velis", "Threx", "Yaka", "Halo", "Nyx", "Orro", "Kestri", "Sable", "Aster", "Zephra"];
const SYSTEM_SUFFIXES = ["Corridor", "Spur", "Drift", "Node", "Anchor", "Reach", "Array", "Ridge", "Fold", "Haze"];
const SECTOR_NAMES = [
  "Halo Corridor",
  "Velis Reach",
  "Nyx Tangle",
  "Obsidian Run",
  "Crown Spur",
  "Glass Haze",
  "Auric Fold",
  "Storm Archive"
];
const WORLD_ALIASES = ["Anchor", "Minor Node", "Outpost", "Drift Node", "Spoke", "Array", "Relay", "Harbor"];
const WINDOW_LABELS = ["Blue shift", "Twilight window", "Graveyard orbit", "Sunrise ping", "Midwatch cycle"];

const BIOME_PROFILES = [
  { tag: "stormglass", color: "#60a5fa", prompt: "stormglass reefs and refracted ice shards", risk: "volatile" },
  { tag: "slag harbor", color: "#f472b6", prompt: "scrap towers welded into drifting cities", risk: "crowded" },
  { tag: "voidreef", color: "#22c55e", prompt: "voidreef shelves with bioluminescent bloom", risk: "steady" },
  { tag: "ember dunes", color: "#f97316", prompt: "ember dune seas with buried maglev spines", risk: "charged" },
  { tag: "halo anchor", color: "#a855f7", prompt: "anchored monasteries projecting gravity wells", risk: "stable" },
  { tag: "frost delta", color: "#38bdf8", prompt: "ice deltas under aurora nets and quiet relay pylons", risk: "calm" }
];

const SIGNAL_TAGLINES = [
  "Signal hums on amber channel seven.",
  "Beacon drifts between Helios bands four and five.",
  "Telemetry pings through Lux-Delta lattice.",
  "Pulse chained to Crown Spur harmonics.",
  "Whispers leak across Obsidian relay mesh.",
  "Carrier wave braided with Nyx range static."
];

export interface GalaxyWorld extends TravelAugmentedDestination {
  worldKind: "galaxy";
  structuralHash: string;
  systemName: string;
  sectorName: string;
  worldBiome: string;
  riskProfile: string;
  structuralPrompt: string;
  orbitIndex: number;
  anchor: boolean;
  signalTagline: string;
  structuralPosition: { x: number; y: number };
}

export interface GalaxyGenerationOptions {
  anchors?: number;
  swarm?: number;
}

function hashToUnit(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const value = Math.sin(hash) * 10000;
  return value - Math.floor(value);
}

function pick<T>(list: T[], seed: string, salt: string): T {
  if (list.length === 0) {
    throw new Error("Cannot pick from an empty list");
  }
  const index = Math.floor(hashToUnit(`${seed}-${salt}`) * list.length);
  return list[index % list.length]!;
}

function buildIsoCode(systemName: string, sectorName: string) {
  const letters = `${systemName}${sectorName}`.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (letters.length >= 2) {
    return letters.slice(0, 2);
  }
  return (letters + "XX").slice(0, 2);
}

function computeEnergy(riskProfile: string, isAnchor: boolean) {
  const base =
    riskProfile === "volatile"
      ? 0.84
      : riskProfile === "charged"
        ? 0.76
        : riskProfile === "crowded"
          ? 0.68
          : riskProfile === "steady"
            ? 0.62
            : riskProfile === "stable"
              ? 0.58
              : 0.52;
  const anchorBias = isAnchor ? 0.08 : -0.02;
  return Math.min(1, Math.max(0, Number((base + anchorBias).toFixed(2))));
}

function computePosition(seed: string, anchorIndex: number, orbitIndex: number, totalAnchors: number) {
  const angle =
    (anchorIndex + 1) * GOLDEN_ANGLE +
    orbitIndex * 0.42 +
    hashToUnit(`${seed}-ang-${anchorIndex}-${orbitIndex}`) * Math.PI * 2;
  const anchorRadius = 0.24 + (anchorIndex / Math.max(totalAnchors, 1)) * 0.32;
  const orbitRadius =
    anchorRadius + orbitIndex * 0.038 + hashToUnit(`${seed}-rad-${anchorIndex}-${orbitIndex}`) * 0.04;
  const warp = 0.7 + hashToUnit(`${seed}-warp-${anchorIndex}-${orbitIndex}`) * 0.2;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius * warp;
  return { x, y };
}

function energyBucket(score: number): "calm" | "balanced" | "charged" {
  if (score <= 0.45) return "calm";
  if (score >= 0.7) return "charged";
  return "balanced";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildWorld(seed: string, anchorIndex: number, orbitIndex: number, totalAnchors: number, isAnchor: boolean): GalaxyWorld {
  const systemName = `${pick(SYSTEM_PREFIXES, seed, `sys-pre-${anchorIndex}`)} ${pick(
    SYSTEM_SUFFIXES,
    seed,
    `sys-suf-${anchorIndex}`
  )}`;
  const sectorName = pick(SECTOR_NAMES, seed, `sector-${anchorIndex}`);
  const alias = pick(WORLD_ALIASES, seed, `alias-${orbitIndex}`);
  const biome = pick(BIOME_PROFILES, seed, `biome-${orbitIndex}`);
  const worldName = isAnchor ? `${systemName} Anchor` : `${systemName} ${alias}`;
  const structuralHash = slugify(`${seed}-${systemName}-${orbitIndex}-${biome.tag}-${isAnchor ? "anchor" : "node"}`);
  const windowLabel = pick(WINDOW_LABELS, seed, `window-${orbitIndex}`);
  const signalTagline = pick(SIGNAL_TAGLINES, seed, `signal-${orbitIndex}`);
  const riskProfile = biome.risk;
  const energy = computeEnergy(riskProfile, isAnchor);
  const position = computePosition(seed, anchorIndex, orbitIndex, totalAnchors);
  const latlng: [number, number] = [
    Number((position.y * 80).toFixed(2)),
    Number((position.x * 180).toFixed(2))
  ];

  const structuralPrompt = [
    `System: ${systemName}. Sector: ${sectorName}.`,
    `${isAnchor ? "Anchor" : "Swarm"} node at orbit ${orbitIndex + 1}.`,
    `Biome: ${biome.prompt}. Risk: ${riskProfile}.`,
    `Signal: ${signalTagline}`
  ].join(" ");

  const summary = `${isAnchor ? "Anchor world" : "Swarm node"} guiding ${sectorName} lanes through ${
    systemName
  }. ${biome.prompt}.`;

  return {
    worldKind: "galaxy",
    structuralHash,
    systemName,
    sectorName,
    worldBiome: biome.tag,
    riskProfile,
    structuralPrompt,
    orbitIndex,
    anchor: isAnchor,
    signalTagline,
    structuralPosition: position,
    name: worldName,
    iso2: buildIsoCode(systemName, sectorName),
    latlng,
    biomeTags: [biome.tag, isAnchor ? "anchor" : "swarm"],
    coastlineRatio: clamp(0.4 + hashToUnit(`${seed}-coast-${orbitIndex}`) * 0.3, 0, 1),
    forestCover: clamp(0.2 + hashToUnit(`${seed}-forest-${orbitIndex}`) * 0.5, 0, 1),
    meanElevation: Math.round(100 + hashToUnit(`${seed}-elev-${orbitIndex}`) * 900),
    summary,
    region: sectorName,
    slug: structuralHash,
    image: "",
    defaultLanguage: "en",
    destinationId: undefined,
    travelPrompt: structuralPrompt,
    travelHeadline: summary,
    travelAtmosphere: structuralPrompt,
    travelTags: [biome.tag, sectorName, systemName, isAnchor ? "anchor" : "swarm"],
    travelAction: isAnchor ? "Anchor hold" : "Swarm relay",
    travelTimeOfDay: windowLabel,
    travelSensoryCue: signalTagline,
    travelColorway: biome.color,
    travelEnergy: energy,
    travelEnergyBucket: energyBucket(energy),
    travelBeaconSize: isAnchor ? 1.3 : 0.85 + energy * 0.3,
    travelPlaceSlug: structuralHash
  };
}

export function generateGalaxyWorlds(seed: string, options: GalaxyGenerationOptions = {}): GalaxyWorld[] {
  const anchorCount = clamp(options.anchors ?? 7, 3, 12);
  const swarmPerAnchor = clamp(options.swarm ?? 8, 4, 16);
  const worlds: GalaxyWorld[] = [];

  for (let anchorIndex = 0; anchorIndex < anchorCount; anchorIndex += 1) {
    worlds.push(buildWorld(seed, anchorIndex, 0, anchorCount, true));
    for (let orbitIndex = 1; orbitIndex <= swarmPerAnchor; orbitIndex += 1) {
      worlds.push(buildWorld(seed, anchorIndex, orbitIndex, anchorCount, false));
    }
  }

  return worlds;
}
