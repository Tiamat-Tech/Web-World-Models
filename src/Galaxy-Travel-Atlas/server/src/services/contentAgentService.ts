import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AgentContentResponse,
  AgentRequestPayload,
  DestinationTheme,
  LlmChatMessage
} from "../types.js";
import { env } from "../utils/env.js";
import { requestOpenRouterCompletion } from "./openRouterChatService.js";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.resolve(__dirname, "../../data/generated");

interface CacheEntry {
  timestamp: number;
  data: AgentContentResponse;
}

const memoryCache = new Map<string, CacheEntry>();
const refreshMap = new Map<string, Promise<void>>();

const THEME_LIBRARY: Record<
  DestinationTheme,
  {
    overview: (name: string) => string;
    topSights: Array<{ title: (name: string) => string; why: string; best: string }>;
    itineraryDay: string[];
    itineraryHighlights: string[];
    food: Array<{ dish: string; spot: string }>;
    seasonality: Array<{ season: string; weather: string; pros: string; cons: string }>;
    localTips: string[];
    safety: string[];
    hiddenGems: string[];
    budget: { shoestring: number; midrange: number; luxury: number };
    transport: { from: string; around: string; passes: string };
  }
> = {
  desert: {
    overview: (name) =>
      `${name} rewards pre-dawn starts, wide-brimmed hats, and strategic siestas. Plan short bursts outside with cooling breaks indoors to dodge the brutal mid-day sun.`,
    topSights: [
      {
        title: (name) => `${name} dune ridge sunrise`,
        why: "Golden light and long shadows make the dunes photogenic while temps are manageable.",
        best: "05:30–08:00, Oct–Mar"
      },
      {
        title: () => "Oasis caravan stop",
        why: "Palm groves with fresh water resupply and local guides sharing navigation tips.",
        best: "Late afternoon shade"
      },
      {
        title: (name) => `${name} star field camp`,
        why: "Dry air delivers clear constellations; many camps include astronomy briefings.",
        best: "Nov–Feb nights"
      }
    ],
    itineraryDay: [
      "Sunrise dune hike with ranger",
      "Camel or 4x4 traverse between ridges",
      "Cool down at oasis cafe",
      "Sunset ridge watch",
      "Stargazing with local guide"
    ],
    itineraryHighlights: [
      "Medina supply run",
      "Day trip to fossil plateau",
      "Slow lunch at desert farm",
      "Dune boarding session",
      "Overnight nomad camp"
    ],
    food: [
      { dish: "Berber tagine", spot: "Family tents near the main oasis" },
      { dish: "Spiced harira", spot: "Sahara cooperatives along caravan hubs" },
      { dish: "Date + almond sweets", spot: "Weekly souks before sunset" }
    ],
    seasonality: [
      {
        season: "Cool season",
        weather: "Mild days, near-freezing nights",
        pros: "Best for treks and comfortable camping",
        cons: "Windstorms can reduce visibility"
      },
      {
        season: "Hot season",
        weather: "40°C+ afternoons, high UV",
        pros: "Clear skies for astrophotography",
        cons: "Activity windows limited to dawn/dusk"
      },
      {
        season: "Shoulder",
        weather: "Warm days, breezy nights",
        pros: "Dates harvest festivals and lighter crowds",
        cons: "Erratic sandstorms"
      }
    ],
    localTips: [
      "Carry at least 3L of water per person and stash electrolytes for dune climbs.",
      "Pack a scarf or buff to block blowing sand and use breathable long sleeves for sun.",
      "Check ${ISO2}-visa and desert permit rules; many protected zones require ranger clearance."
    ],
    safety: [
      "Avoid hiking alone; dunes shift quickly and phones lose signal in basins.",
      "Flag convoy location with lodging before long drives and note kilometer markers.",
      "Respect wildlife tracks—snakes and scorpions cool under rocks after sunset."
    ],
    hiddenGems: ["Dry river canyon marble pools", "Nomad-run astronomy platform"],
    budget: { shoestring: 45, midrange: 140, luxury: 360 },
    transport: {
      from: "Shared 4x4 transfers run from the nearest regional airport; book ahead for dawn arrivals.",
      around: "Guided convoys and camel shuttles connect dunes with oasis villages.",
      passes: "No transit passes; arrange ranger permits for protected ergs."
    }
  },
  seaside: {
    overview: (name) =>
      `${name} is about tides, trade winds, and flag colors. Pace days around swell reports and plan indoor breaks when UV peaks.`,
    topSights: [
      {
        title: () => "Protected reef snorkel",
        why: "Calm morning water with reef rangers explaining coral etiquette.",
        best: "07:30–10:00 when winds are light"
      },
      {
        title: (name) => `${name} lookout trail`,
        why: "Clifftop views of coves and quick weather readouts from lifeguards.",
        best: "Late afternoon golden hour"
      },
      {
        title: () => "Harbor night market",
        why: "Fresh catch tastings and local musicians; great for cooler evenings.",
        best: "Thu–Sun nights"
      }
    ],
    itineraryDay: [
      "Dawn swim or SUP session",
      "Coffee at harbor roastery",
      "Cycling between beaches",
      "Slow lunch under shade sails",
      "Sunset sail or pier walk"
    ],
    itineraryHighlights: [
      "Island hop by local ferry",
      "Hire marine biologist for reef drift",
      "Cooking class focused on coastal spice blends",
      "Daybed session at quieter cove",
      "Evening market crawl"
    ],
    food: [
      { dish: "Citrus ceviche", spot: "Harbor-side cooperative kitchens" },
      { dish: "Charred octopus", spot: "Family tavern on windward quay" },
      { dish: "Tropical shaved ice", spot: "Beach carts near lifeguard towers" }
    ],
    seasonality: [
      {
        season: "Dry season",
        weather: "Trade winds, moderate humidity",
        pros: "Clear snorkeling and calmer surf",
        cons: "Prices climb; book boats early"
      },
      {
        season: "Wet season",
        weather: "Short downpours, warmer seas",
        pros: "Lush scenery and turtle nesting",
        cons: "Rip currents stronger mid-afternoon"
      },
      {
        season: "Shoulder",
        weather: "Mix of sun and clouds",
        pros: "Plenty of space on popular beaches",
        cons: "Some ferry routes on limited schedules"
      }
    ],
    localTips: [
      "Check daily flag colors—red or double-red closes swimming regardless of calm looks.",
      "Bring reef-safe sunscreen and long-sleeve rash guards; UV index stays high until 4pm.",
      "Review ${ISO2} visa-on-arrival rules; island chains often require proof of onward travel."
    ],
    safety: [
      "Respect lifeguard whistles immediately; undertows swing fast after storms.",
      "Avoid feeding wildlife such as reef fish or iguanas—fines are enforced.",
      "Register boat rentals with harbor master so radios stay monitored."
    ],
    hiddenGems: ["Mangrove kayak tunnel", "Tidepool boardwalk at dusk"],
    budget: { shoestring: 70, midrange: 180, luxury: 420 },
    transport: {
      from: "Airport shuttle counters sell coastal transfers; aim for early flights to beat traffic.",
      around: "Beach cruisers, tuk-tuks, and ferries link most bays; rideshare handles late nights.",
      passes: "Regional ferry passes cover multi-island hops within 5 days."
    }
  },
  forest: {
    overview: (name) =>
      `${name} is all about canopy layers, respectful wildlife watching, and trail pacing. Expect misty mornings and plan for leeches, drizzle, and mossy boardwalks.`,
    topSights: [
      {
        title: () => "Canopy suspension circuit",
        why: "Rangers brief visitors on bird calls and primate etiquette before the walk.",
        best: "Early morning before cicadas peak"
      },
      {
        title: (name) => `${name} waterfall amphitheater`,
        why: "Short hike with spray-cooled viewpoints and natural pools.",
        best: "Midday when light hits the falls"
      },
      {
        title: () => "Night walk for bioluminescence",
        why: "Guides teach low-light etiquette and identify frogs without flashlights.",
        best: "20:00–22:00 after rainfall"
      }
    ],
    itineraryDay: [
      "Birdsong coffee on lodge deck",
      "Guided canopy walk",
      "River swim and packed lunch",
      "Village homestay craft workshop",
      "Nighttime frog spotting"
    ],
    itineraryHighlights: [
      "Loop trail to remote research station",
      "Canoe downstream with local tracker",
      "Forest-to-table cooking demo",
      "Reforestation volunteer block",
      "Sunrise tower climb"
    ],
    food: [
      { dish: "Herb-stuffed river fish", spot: "Community-run eco lodges" },
      { dish: "Cassava leaf stew", spot: "Trailhead kitchens" },
      { dish: "Wild berry pastries", spot: "Mountain tea houses" }
    ],
    seasonality: [
      {
        season: "Dry window",
        weather: "Cool nights, manageable mud",
        pros: "Best for long treks and wildlife",
        cons: "Popular lodges book out"
      },
      {
        season: "Rains",
        weather: "Heavy showers, swollen rivers",
        pros: "Waterfalls thunder and crowds thin",
        cons: "Leeches and trail closures"
      },
      {
        season: "Transition",
        weather: "Patchy showers, humid",
        pros: "Blooming orchids and easier permits",
        cons: "Mosquito spikes at dusk"
      }
    ],
    localTips: [
      "Pack quick-dry layers plus a lightweight poncho; cotton stays damp for days.",
      "Walk single-file and keep voices low to avoid startling wildlife.",
      "Confirm ${ISO2} park permits; some biosphere zones cap entries daily."
    ],
    safety: [
      "Hire certified guides for night walks; the trail network gets tricky after rain.",
      "Carry basic leech socks and antihistamines in your daypack.",
      "Treat all water with filters or UV pens even inside lodges."
    ],
    hiddenGems: ["Mist boardwalk over peat bog", "Community-run orchid nursery"],
    budget: { shoestring: 55, midrange: 150, luxury: 320 },
    transport: {
      from: "Minivans connect the regional airport to trailhead towns twice daily.",
      around: "Shared 4x4 shuttles and river boats reach most lodges.",
      passes: "Multi-day park wristbands save on ranger fees."
    }
  },
  mountain: {
    overview: (name) =>
      `${name} mixes altitude prep with weather whiplash. Hydrate aggressively, climb slowly, and layer up for sleet one hour and sun the next.`,
    topSights: [
      {
        title: () => "Acclimatization ridge walk",
        why: "Panoramic views with gradual incline—ideal for day one.",
        best: "Late morning once frost melts"
      },
      {
        title: (name) => `${name} high hut traverse`,
        why: "Link refuges with glacier views; locals share avalanche updates.",
        best: "June–September"
      },
      {
        title: () => "Geothermal soak valley",
        why: "Soothes muscles post-hike and pairs with local tea houses.",
        best: "Evenings after summit attempts"
      }
    ],
    itineraryDay: [
      "Slow breakfast + oxygen check",
      "Cable car or hike to mid-station",
      "Picnic near alpine lake",
      "Afternoon skills session (crampon/trekking)",
      "Sunset lookout and hearty stew"
    ],
    itineraryHighlights: [
      "Summit push with IFMGA guide",
      "Mountain bike descent",
      "Cultural visit to highland village",
      "Glacier walk with crampons",
      "Down valley wine tasting"
    ],
    food: [
      { dish: "Barley + yak butter stew", spot: "High huts" },
      { dish: "Cheese fondue", spot: "Valley chalets" },
      { dish: "Cloud-forest coffee", spot: "Base-town cafes" }
    ],
    seasonality: [
      {
        season: "Climbing prime",
        weather: "Cool, stable mornings",
        pros: "Most lifts operating, guides abundant",
        cons: "Higher hut demand"
      },
      {
        season: "Monsoon/Storm",
        weather: "Daily storms, landslides",
        pros: "Lush valleys and cheaper stays",
        cons: "Limited high routes"
      },
      {
        season: "Winter",
        weather: "Snow, icy trails",
        pros: "Great skiing and clear skies",
        cons: "Avalanche risk and road closures"
      }
    ],
    localTips: [
      "Follow the 300m elevation gain rule per night to avoid AMS.",
      "Pack merino base layers plus shell; weather flips within minutes.",
      "Secure ${ISO2} trekking permits or hut bookings at least 2 weeks prior."
    ],
    safety: [
      "Monitor avalanche bulletins and never ignore closed signs.",
      "Carry microspikes even on easy trails; black ice forms at dusk.",
      "Drink 3L of water daily and add electrolytes to beat altitude headaches."
    ],
    hiddenGems: ["Alpine herb garden terrace", "Abandoned funicular viewpoint"],
    budget: { shoestring: 60, midrange: 170, luxury: 400 },
    transport: {
      from: "Airport shuttles climb to base towns every hour; reserve if carrying skis.",
      around: "Mountain buses and gondolas honor the same reloadable card.",
      passes: "Regional alpine pass bundles lifts + rail at a discount."
    }
  },
  urban: {
    overview: (name) =>
      `${name} is a multi-neighborhood sprint—plan museum slots early, ride transit passes hard, and chase late-night kitchens for authentic bites.`,
    topSights: [
      {
        title: () => "Morning market walk",
        why: "Street food plus conversations with producers before crowds swell.",
        best: "07:00–09:00"
      },
      {
        title: (name) => `${name} design district crawl`,
        why: "Galleries, indie boutiques, and architecture tours in one walkable grid.",
        best: "Weekdays after 11:00"
      },
      {
        title: () => "Skyline rooftop circuit",
        why: "Golden hour cocktails with citywide views and wind-down playlists.",
        best: "17:00–20:00"
      }
    ],
    itineraryDay: [
      "Espresso + pastry in heritage cafe",
      "Museum block with timed entry",
      "Artisanal lunch counters",
      "Train to emerging neighborhood",
      "Speakeasy or jazz bar nightcap"
    ],
    itineraryHighlights: [
      "Transit-based street art hunt",
      "Bike lane tour of riverfront",
      "Cooking class on local staples",
      "Tech hub visit for coworking",
      "Day trip to satellite town"
    ],
    food: [
      { dish: "Night market skewers", spot: "Laneway hawker stalls" },
      { dish: "Modern bistro tasting", spot: "Warehouse district" },
      { dish: "Third-wave coffee flight", spot: "Creative cluster roasters" }
    ],
    seasonality: [
      {
        season: "Peak events",
        weather: "Warm, humid",
        pros: "Festivals and late-night transit",
        cons: "Hotel rates spike"
      },
      {
        season: "Cool months",
        weather: "Crisp mornings",
        pros: "Ideal for museum marathons",
        cons: "Some rooftop bars close"
      },
      {
        season: "Rainy weeks",
        weather: "Short storms",
        pros: "Smaller queues and discounts",
        cons: "Flood-prone streets—plan indoor blocks"
      }
    ],
    localTips: [
      "Load a day or weekly transit pass; tap-ins unlock metro + buses + ferries.",
      "Reserve sought-after museums with timed tickets to skip two-hour queues.",
      "Review ${ISO2} entry rules; proof of onward travel and accommodation is often checked."
    ],
    safety: [
      "Use official taxis or registered ride-hailing late at night.",
      "Keep valuables front-facing on transit; rush hours are pickpocket prime.",
      "Stick to lit streets after midnight and note last-train schedules."
    ],
    hiddenGems: ["Rooftop community garden cinema", "Micro gallery inside retro station"],
    budget: { shoestring: 80, midrange: 220, luxury: 500 },
    transport: {
      from: "Airport express trains beat traffic; buy tickets from kiosks in arrivals.",
      around: "Metro + tram network hits all major boroughs; micromobility handles final mile.",
      passes: "City passes bundle museums with unlimited transit for 48–120 hours."
    }
  }
};

function ensureCacheDir() {
  mkdirSync(CACHE_DIR, { recursive: true });
}

function cacheFilePath(key: string) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function getCacheKey(payload: AgentRequestPayload) {
  return `${payload.iso2.toUpperCase()}-${payload.theme}-${payload.language}`;
}

function readCache(key: string): CacheEntry | null {
  const existing = memoryCache.get(key);
  if (existing) {
    return existing;
  }

  try {
    const raw = readFileSync(cacheFilePath(key), "utf-8");
    const parsed = JSON.parse(raw) as CacheEntry;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: AgentContentResponse) {
  ensureCacheDir();
  const entry: CacheEntry = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);
  writeFileSync(cacheFilePath(key), JSON.stringify(entry, null, 2), "utf-8");
}

function mapLocalTips(tips: string[], iso2: string) {
  return tips.map((tip) => tip.replace(/\$\{ISO2\}/g, iso2));
}

function limitWords(text: string, maxWords = 120) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text.trim();
  }
  return words.slice(0, maxWords).join(" ");
}

function generateLocalContent(payload: AgentRequestPayload): AgentContentResponse {
  const template = THEME_LIBRARY[payload.theme];
  const iso = payload.iso2.toUpperCase();
  return {
    destination: {
      name: payload.name,
      iso2: iso,
      theme: payload.theme
    },
    overview: limitWords(template.overview(payload.name)),
    top_sights: template.topSights.map((item) => ({
      title: item.title(payload.name),
      why_go: item.why,
      best_time: item.best
    })),
    itineraries: [
      {
        title: "Perfect 24 Hours",
        stops: template.itineraryDay
      },
      {
        title: "2–3 Day Highlights",
        stops: template.itineraryHighlights
      }
    ],
    food_highlights: template.food.map((entry) => ({
      dish: entry.dish,
      where_to_try: entry.spot
    })),
    seasonality: template.seasonality,
    local_tips: mapLocalTips(template.localTips, iso),
    safety: template.safety,
    budget: {
      ...template.budget,
      currency: "USD"
    },
    transport: {
      from_airport: template.transport.from,
      getting_around: template.transport.around,
      passes: template.transport.passes
    },
    hidden_gems: template.hiddenGems
  };
}

function buildBaseMessages(payload: AgentRequestPayload): LlmChatMessage[] {
  return [
    {
      role: "system",
      content:
        "You are the Content Agent for a world exploration studio. Reply only with JSON that matches the agreed travel schema. Keep tone practical, friendly, up-to-date. Lists hold 3-6 items."
    },
    {
      role: "user",
      content: [
        `Destination name: ${payload.name}. ISO2: ${payload.iso2}. Theme: ${payload.theme}.`,
        `Language: ${payload.language}.`,
        "Structure keys: destination{name,iso2,theme}, overview(<=120 words), top_sights[{title,why_go,best_time}],",
        "itineraries[Perfect 24 Hours,2–3 Day Highlights with stops], food_highlights[{dish,where_to_try}],",
        "seasonality[{season,weather,pros,cons}], local_tips[], safety[], budget{shoestring,midrange,luxury,currency},",
        "transport{from_airport,getting_around,passes}, hidden_gems[2 items].",
        "Cover visa/permit reminders if common."
      ].join(" ")
    }
  ];
}

type ExtendedLlmMessage = LlmChatMessage & Record<string, unknown>;

async function callOpenRouter(payload: AgentRequestPayload): Promise<AgentContentResponse> {
  const baseMessages = buildBaseMessages(payload);

  const firstReply = await requestOpenRouterCompletion({
    model: env.openRouter.model,
    responseFormat: { type: "json_object" },
    reasoning: { enabled: true },
    messages: baseMessages
  });

  const assistantMessage: ExtendedLlmMessage = {
    role: "assistant",
    content: firstReply.output
  };
  if (firstReply.message?.reasoning_details !== undefined) {
    assistantMessage.reasoning_details = firstReply.message.reasoning_details;
  }

  const followUpMessages: LlmChatMessage[] = [
    ...baseMessages,
    assistantMessage,
    { role: "user", content: "Are you sure? Think carefully." }
  ];

  const secondReply = await requestOpenRouterCompletion({
    model: env.openRouter.model,
    responseFormat: { type: "json_object" },
    messages: followUpMessages
  });

  return JSON.parse(secondReply.output) as AgentContentResponse;
}

async function runAgent(payload: AgentRequestPayload): Promise<AgentContentResponse> {
  if (env.openRouter.apiKey) {
    try {
      return await callOpenRouter(payload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("OpenRouter content generation failed, using fallback", error);
    }
  }
  return generateLocalContent(payload);
}

function scheduleRevalidation(key: string, payload: AgentRequestPayload) {
  if (refreshMap.has(key)) {
    return;
  }
  const task = runAgent(payload)
    .then((data) => writeCache(key, data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.warn("Background revalidation failed", error);
    })
    .finally(() => {
      refreshMap.delete(key);
    });
  refreshMap.set(key, task);
}

export async function generateDestinationContent(
  payload: AgentRequestPayload
): Promise<AgentContentResponse> {
  const key = getCacheKey(payload);
  const cached = readCache(key);

  if (cached) {
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      scheduleRevalidation(key, payload);
    }
    return cached.data;
  }

  const fresh = await runAgent(payload);
  writeCache(key, fresh);
  return fresh;
}
