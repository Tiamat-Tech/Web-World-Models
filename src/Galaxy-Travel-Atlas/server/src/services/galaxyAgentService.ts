import type { GalaxyPlanetIntel, GalaxyPlanetIntelRequest } from "../types.js";
import { env } from "../utils/env.js";
import { requestOpenRouterCompletion } from "./openRouterChatService.js";

interface OpenOuterPlanetResponse {
  planetName?: string;
  summary?: string;
  terrain?: string;
  sky?: string;
  hazards?: string[] | string;
  missionHook?: string;
  signal?: string;
}

const SURFACE_DESCRIPTORS = [
  "obsidian tidepools frozen in low gravity",
  "hanging basalt orchards haloing the canyon rim",
  "crystal reefs that breathe ion storms",
  "prismatic salt steppes perforated by sensor towers",
  "mycelial forests that glow along tectonic scars",
  "liquid mirror seas circling abandoned refineries"
];

const SKY_DESCRIPTORS = [
  "auroras that scroll like hymnals",
  "braided comet tails reflecting in the magnetic haze",
  "storm bands pulsing between twin suns",
  "dust halos dotted with derelict stations",
  "slow lightning that sketches orbital runes",
  "tidal vapor trails shimmering a violet dusk"
];

const HAZARD_DESCRIPTORS = [
  "ferro-sand squalls that strip hull plating",
  "stray gravity wells seeded by lost jump drives",
  "psionic echoes disrupting guidance arrays",
  "chorus fauna attracted to unshielded power cores",
  "volcanic bloom surges that rewrite terrain",
  "glacier shards calving without warning along the rim"
];

const MISSION_HOOKS = [
  "Stabilize the pilgrim relay before the next ion tide.",
  "Recover the drift choir logs sealed beneath the canyon.",
  "Escort smugglers carrying seed vaults through the prism storms.",
  "Locate the lost republic beacon rumored to pulse under the dunes.",
  "Broker ceasefire terms between station caretakers and void harvesters.",
  "Catalog the aurora-lit docks before they vanish into the Nyx reach."
];

const SIGNAL_TAGLINES = [
  "Signal hums on amber channel seven.",
  "Beacon drifts between Helios bands 4–5.",
  "Telemetry pings through Lux-Delta lattice.",
  "Pulse chained to Crown Spur harmonics.",
  "Whispers leak across Obsidian relay mesh.",
  "Carrier wave braided with Nyx-range static."
];

const SUMMARY_THREADS = [
  "Locals navigate by resonance lanterns anchored to the canyon rim.",
  "Orbital drones script pathfinding sigils ahead of each landing party.",
  "Pilgrim shrines keep the charge storms calm for only a few minutes at a time.",
  "Contraband skiffs etch temporary safe corridors across the outer docks.",
  "Ancient monorails still thrum beneath the sand, guiding travelers toward the beacon spires.",
  "Grav cables stitched between cliffs create slow-moving sanctuaries amid the dust."
];

function seededFraction(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function pickFrom(list: string[], seed: string, salt: string): string {
  if (list.length === 0) {
    return "";
  }
  const index = Math.floor(seededFraction(`${seed}-${salt}`) * list.length);
  const safeIndex = index % list.length;
  return list[safeIndex] ?? "";
}

function buildFallbackIntel(context: GalaxyPlanetIntelRequest): GalaxyPlanetIntel {
  const seed =
    context.world ??
    context.system ??
    context.region ??
    context.sector ??
    context.location ??
    "openouter";
  const planetName =
    context.world ??
    context.system ??
    `Relay-${String(Math.floor(seededFraction(seed) * 4096)).padStart(3, "0")}`;
  const surface = pickFrom(SURFACE_DESCRIPTORS, seed, "surface");
  const sky = pickFrom(SKY_DESCRIPTORS, seed, "sky");
  const hazardOne = pickFrom(HAZARD_DESCRIPTORS, seed, "hazard-1");
  let hazardTwo = pickFrom(HAZARD_DESCRIPTORS, seed, "hazard-2");
  if (hazardTwo === hazardOne) {
    hazardTwo = pickFrom(HAZARD_DESCRIPTORS, `${seed}-${hazardOne}`, "hazard-3");
  }
  const hook = pickFrom(MISSION_HOOKS, seed, "hook");
  const signal = pickFrom(SIGNAL_TAGLINES, seed, "signal");
  const bonus = pickFrom(SUMMARY_THREADS, seed, "summary");
  const promptLead = context.basePrompt?.split(".")[0]?.trim();
  const summarySource =
    promptLead && promptLead.length > 24
      ? promptLead
      : `Frontier waypoint along the ${context.region ?? context.sector ?? "Outer Rim"} lanes.`;

  return {
    planetName,
    summary: `${summarySource} ${bonus}`,
    terrain: `${surface}${
      context.location ? ` near the ${context.location}` : ""
    }, threaded with ${context.travelStyle ?? "unmapped rituals"}.`,
    sky: sky,
    hazards: [hazardOne, hazardTwo],
    missionHook: hook,
    signal
  };
}

function normalizeOpenOuterResponse(
  raw: OpenOuterPlanetResponse | undefined,
  fallback: GalaxyPlanetIntel
): GalaxyPlanetIntel {
  if (!raw) {
    return fallback;
  }
  const hazardArray = Array.isArray(raw.hazards)
    ? raw.hazards.map((entry) => String(entry)).filter(Boolean)
    : raw.hazards
      ? [String(raw.hazards)]
      : fallback.hazards;
  return {
    planetName: raw.planetName?.trim() || fallback.planetName,
    summary: raw.summary?.trim() || fallback.summary,
    terrain: raw.terrain?.trim() || fallback.terrain,
    sky: raw.sky?.trim() || fallback.sky,
    hazards: hazardArray.length ? hazardArray : fallback.hazards,
    missionHook: raw.missionHook?.trim() || fallback.missionHook,
    signal: raw.signal?.trim() || fallback.signal
  };
}

export async function generatePlanetIntel(
  context: GalaxyPlanetIntelRequest
): Promise<GalaxyPlanetIntel> {
  const fallback = buildFallbackIntel(context);
  if (!env.openRouter.apiKey) {
    return fallback;
  }
  try {
    const completion = await requestOpenRouterCompletion({
      model: env.openRouter.model,
      responseFormat: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are OpenOuter, a mission artist for interstellar scouts. Always return compact JSON with keys planetName, summary, terrain, sky, hazards (array), missionHook, signal."
        },
        {
          role: "user",
          content: [
            `System: ${context.system ?? "Unknown system"}.`,
            `Known world: ${context.world ?? "Unlisted world"}.`,
            `Region: ${context.region ?? "Deep drift"}, sector: ${context.sector ?? "Uncharted"}.`,
            context.location ? `Notable landmark: ${context.location}.` : "",
            context.travelStyle ? `Culture reference: ${context.travelStyle}.` : "",
            context.basePrompt ? `Scene prompt: ${context.basePrompt}` : "",
            "Invent a fresh planetary briefing that feels cinematic but actionable.",
            "Summary <= 60 words. Terrain and sky should be vivid but concise.",
            "Signal should be a short line referencing comms/bandwidth."
          ]
            .filter(Boolean)
            .join(" ")
        }
      ]
    });
    const parsed = JSON.parse(completion.output) as OpenOuterPlanetResponse;
    return normalizeOpenOuterResponse(parsed, fallback);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[galaxy] OpenOuter generation failed, using fallback", error);
    return fallback;
  }
}
