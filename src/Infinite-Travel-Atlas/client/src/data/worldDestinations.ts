import { slugify } from "../utils/format";

export interface WorldDestinationMeta {
  name: string;
  iso2: string;
  latlng: [number, number];
  biomeTags: string[];
  coastlineRatio: number;
  forestCover: number;
  meanElevation: number;
  summary: string;
  region: string;
  slug: string;
  image: string;
  defaultLanguage?: string;
  destinationId?: string;
}

const SEED_DESTINATIONS: Array<Omit<WorldDestinationMeta, "slug">> = [
  {
    name: "Morocco",
    iso2: "MA",
    latlng: [31.8, -5.5],
    biomeTags: ["desert", "atlas", "oasis"],
    coastlineRatio: 0.4,
    forestCover: 0.12,
    meanElevation: 800,
    summary: "Sahara gateways, High Atlas villages, and Atlantic medinas in one loop.",
    region: "Africa & Middle East",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    destinationId: "dest-morocco"
  },
  {
    name: "Maldives",
    iso2: "MV",
    latlng: [3.2, 73.2],
    biomeTags: ["island", "coral", "seaside"],
    coastlineRatio: 0.95,
    forestCover: 0.07,
    meanElevation: 5,
    summary: "String of coral atolls built for lagoon hops and marine life.",
    region: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    defaultLanguage: "en",
    destinationId: "dest-maldives"
  },
  {
    name: "Japan",
    iso2: "JP",
    latlng: [36.2, 138.25],
    biomeTags: ["urban", "alpine", "coast", "onsen"],
    coastlineRatio: 0.62,
    forestCover: 0.67,
    meanElevation: 438,
    summary: "Shinkansen-laced archipelago mixing neon wards, cedar forests, and onsen towns.",
    region: "East Asia",
    image: "https://images.unsplash.com/photo-1504788363733-507549153474?auto=format&fit=crop&w=1200&q=80",
    defaultLanguage: "en",
    destinationId: "dest-japan"
  },
  {
    name: "Costa Rica",
    iso2: "CR",
    latlng: [9.7, -84.0],
    biomeTags: ["rainforest", "cloud forest", "wildlife"],
    coastlineRatio: 0.45,
    forestCover: 0.52,
    meanElevation: 1150,
    summary: "Caribbean mangroves to volcanic cloud forests with wildlife corridors.",
    region: "Central America",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
    destinationId: "dest-costa-rica"
  },
  {
    name: "Nepal",
    iso2: "NP",
    latlng: [28.4, 84.1],
    biomeTags: ["alpine", "himalaya", "mountain"],
    coastlineRatio: 0,
    forestCover: 0.25,
    meanElevation: 2200,
    summary: "Tea houses, base camps, and highland monasteries along Himalayan ridges.",
    region: "South Asia",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    destinationId: "dest-nepal"
  },
  {
    name: "Singapore",
    iso2: "SG",
    latlng: [1.35, 103.82],
    biomeTags: ["urban", "harbor", "garden"],
    coastlineRatio: 0.3,
    forestCover: 0.18,
    meanElevation: 70,
    summary: "Multi-lingual city-state blending hawker eats, design, and efficient transit.",
    region: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1501696468281-3b9a3b417ebb?auto=format&fit=crop&w=1200&q=80",
    destinationId: "dest-singapore"
  },
  {
    name: "Finland Lapland",
    iso2: "FI",
    latlng: [67.85, 26.7],
    biomeTags: ["boreal forest", "aurora", "tundra"],
    coastlineRatio: 0.2,
    forestCover: 0.75,
    meanElevation: 300,
    summary: "Boreal night skies, husky trails, and sauna culture above the Arctic Circle.",
    region: "Nordics",
    image: "https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?auto=format&fit=crop&w=1200&q=80",
    destinationId: "dest-lapland"
  },
  {
    name: "Norway",
    iso2: "NO",
    latlng: [60.47, 8.47],
    biomeTags: ["fjords", "mountain", "aurora", "coast"],
    coastlineRatio: 0.82,
    forestCover: 0.38,
    meanElevation: 460,
    summary: "Glacier-carved fjords, Arctic rail journeys, and design-forward cities near the sea.",
    region: "Nordics",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80",
    defaultLanguage: "en",
    destinationId: "dest-norway"
  },
  {
    name: "Chile Atacama",
    iso2: "CL",
    latlng: [-24.19, -69.32],
    biomeTags: ["desert", "salt flat", "altiplano"],
    coastlineRatio: 0.1,
    forestCover: 0.02,
    meanElevation: 2400,
    summary: "Mars-like valleys, geyser basins, and star-powered nights in northern Chile.",
    region: "South America",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Croatia Coast",
    iso2: "HR",
    latlng: [43.5, 16.43],
    biomeTags: ["coast", "island", "seaside"],
    coastlineRatio: 0.78,
    forestCover: 0.35,
    meanElevation: 500,
    summary: "Adriatic archipelagos built for ferries, fortified towns, and sea-kayak sunsets.",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Brazil",
    iso2: "BR",
    latlng: [-14.2, -51.9],
    biomeTags: ["rainforest", "amazon", "cerrado", "coast"],
    coastlineRatio: 0.5,
    forestCover: 0.59,
    meanElevation: 320,
    summary: "Amazon canopy flights, samba coastlines, and cerrado-to-reef biodiversity.",
    region: "South America",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    defaultLanguage: "en",
    destinationId: "dest-brazil"
  }
];

const MICRO_DESTINATIONS_PER_SEED = 48;
const MICRO_DESCRIPTORS = [
  "Harbor",
  "Summit",
  "Lagoon",
  "Traverse",
  "Pass",
  "Grove",
  "Ridge",
  "Circuit",
  "Cove",
  "Outpost",
  "Market",
  "Bay"
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wrapLongitude(lon: number) {
  if (lon > 180) {
    return ((lon + 180) % 360) - 180;
  }
  if (lon < -180) {
    return ((lon - 180) % 360) + 180;
  }
  return lon;
}

function clampRatio(value: number) {
  return clamp(value, 0, 1);
}

function createMicroDestinations(seed: Omit<WorldDestinationMeta, "slug">) {
  return Array.from({ length: MICRO_DESTINATIONS_PER_SEED }, (_, index) => {
    const descriptor = MICRO_DESCRIPTORS[index % MICRO_DESCRIPTORS.length];
    const latWave = ((index % 8) - 3.5) * 0.4;
    const lonWave = ((Math.floor(index / 8) % 8) - 3.5) * 0.65;
    const lat = clamp(seed.latlng[0] + latWave, -85, 85);
    const lon = wrapLongitude(seed.latlng[1] + lonWave);
    const coastline = clampRatio(seed.coastlineRatio + ((index % 3) - 1) * 0.04);
    const forest = clampRatio(seed.forestCover + ((index % 5) - 2) * 0.03);
    const elevation = Math.max(0, seed.meanElevation + ((index % 7) - 3) * 45);
    const name = `${seed.name} ${descriptor} ${index + 1}`;

    return {
      name,
      iso2: `${seed.iso2}${(index + 1).toString().padStart(2, "0")}`,
      latlng: [lat, lon] as [number, number],
      biomeTags: [...seed.biomeTags, descriptor.toLowerCase()],
      coastlineRatio: coastline,
      forestCover: forest,
      meanElevation: elevation,
      summary: `Micro-destination orbiting ${seed.name}, tuned for ${descriptor.toLowerCase()} vibes with live atlas tinting.`,
      region: seed.region,
      image: seed.image,
      defaultLanguage: seed.defaultLanguage,
      destinationId: undefined
    } satisfies Omit<WorldDestinationMeta, "slug">;
  });
}

const seededDestinations: WorldDestinationMeta[] = SEED_DESTINATIONS.map((destination) => ({
  ...destination,
  slug: slugify(destination.name)
}));

const microDestinations: WorldDestinationMeta[] = SEED_DESTINATIONS.flatMap((seed) =>
  createMicroDestinations(seed).map((destination, index) => ({
    ...destination,
    slug: slugify(`${destination.name}-${index}`)
  }))
);

export const WORLD_DESTINATIONS: WorldDestinationMeta[] = [...seededDestinations, ...microDestinations];

export function findWorldDestination(slugOrIso: string): WorldDestinationMeta | undefined {
  const target = slugOrIso.toLowerCase();
  return WORLD_DESTINATIONS.find(
    (destination) => destination.slug === target || destination.iso2.toLowerCase() === target
  );
}
