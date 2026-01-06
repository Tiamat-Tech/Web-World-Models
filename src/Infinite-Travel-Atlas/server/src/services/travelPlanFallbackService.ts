import type {
  TravelPlanItineraryDay,
  TravelPlanRequestPayload,
  TravelPlanResponse,
  WorldTravelPlace
} from "../types.js";

const PROMPT_SNIPPET_FALLBACKS = [
  "late-night street food smoke",
  "salt air hanging above the docks",
  "quiet alleys waking up at sunrise",
  "lantern light shimmering down the promenade"
];

function seededFraction(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function cleanPromptString(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function buildPromptIntro(prompt?: string) {
  const cleaned = cleanPromptString(prompt);
  if (!cleaned) {
    return "You’ll wander wherever the lights pull you.";
  }
  const sentence = cleaned
    .split(/[.!?]/)
    .map((chunk) => chunk.trim())
    .find(Boolean);
  if (!sentence) {
    return "You’ll wander wherever the lights pull you.";
  }
  const trimmed = sentence.replace(/^you['’]?ll\s+/i, "").trim();
  const lowered = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  const result = `You’ll ${lowered}`.replace(/\s+/g, " ").trim();
  return result.endsWith(".") ? result : `${result}.`;
}

function buildPromptSnippet(prompt?: string, maxLength = 80) {
  const cleaned = cleanPromptString(prompt);
  if (!cleaned) {
    return PROMPT_SNIPPET_FALLBACKS[0]!;
  }
  const parts = cleaned
    .split(/[.!?]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  let snippet = parts[1] || parts[0] || cleaned;
  snippet = snippet
    .replace(/capture the atmosphere/gi, "")
    .replace(/capture the mood/gi, "")
    .replace(/calibrate .*?sensors/gi, "")
    .replace(/relay .*?hq/gi, "")
    .replace(/^while\s+/i, "")
    .replace(/^as\s+/i, "")
    .replace(/^with\s+/i, "")
    .replace(/^and\s+/i, "")
    .replace(/^collect\s+/i, "")
    .trim();
  if (!snippet) {
    const fallbackSeed = parts[0] || cleaned;
    const fallbackIndex = Math.floor(
      seededFraction(`${fallbackSeed}-snippet`) * PROMPT_SNIPPET_FALLBACKS.length
    );
    snippet = PROMPT_SNIPPET_FALLBACKS[fallbackIndex]!;
  }
  snippet = snippet.replace(/\.$/, "").trim();
  if (!snippet) {
    const fallbackIndex = Math.floor(
      seededFraction(`${cleaned}-fallback`) * PROMPT_SNIPPET_FALLBACKS.length
    );
    snippet = PROMPT_SNIPPET_FALLBACKS[fallbackIndex]!;
  }
  if (snippet.length > maxLength) {
    snippet = `${snippet.slice(0, maxLength - 1).trim()}…`;
  }
  const lowered = snippet.charAt(0).toLowerCase() + snippet.slice(1);
  return lowered;
}

function formatSnippetLine(text?: string, { capitalize = false } = {}) {
  const base = cleanPromptString(text);
  if (!base) {
    return PROMPT_SNIPPET_FALLBACKS[1]!;
  }
  if (capitalize) {
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  return base.charAt(0).toLowerCase() + base.slice(1);
}

function inferBestTimeWindow(prompt?: string, cityLabel?: string) {
  const place = cityLabel || "this destination";
  if (!prompt) {
    return `Follow the local forecast and chase the best windows around ${place}.`;
  }
  if (/\b(sunrise|dawn|first light)\b/i.test(prompt)) {
    return `Aim for dawn—${place} glows just before sunrise.`;
  }
  if (/\b(sunset|golden hour|dusk|twilight)\b/i.test(prompt)) {
    return `Golden hour into sunset is magic; nap in the afternoon so you can roam once the sky warms.`;
  }
  if (/\b(night|midnight|starry|after dark)\b/i.test(prompt)) {
    return `After dark the streets hum—pack a layer and explore evenings when neon flips on.`;
  }
  if (/\b(misty|rain|monsoon|storm)\b/i.test(prompt)) {
    return `Expect shifting clouds and quick showers. Keep a lightweight shell handy for ${place}.`;
  }
  return `Weather moves quickly in ${place}; keep plans flexible and ride the clearest windows.`;
}

function inferIdealFor(prompt?: string, placeLabel?: string) {
  const place = placeLabel || "this trip";
  if (prompt && /\b(hike|climb|trek|trail|summit)\b/i.test(prompt)) {
    return "Hikers and ridge-chasers craving early starts and dramatic overlooks.";
  }
  if (prompt && /\b(market|street food|cafe|bazaar)\b/i.test(prompt)) {
    return "Food lovers and cultural grazers who love market chatter and slow tasting sessions.";
  }
  if (prompt && /\b(kayak|harbor|shore|lagoon|coast|waterfront)\b/i.test(prompt)) {
    return "Waterfront wanderers splitting time between shoreline strolls and calm paddles.";
  }
  if (prompt && /\b(temple|ruins|cathedral|historic|monastery)\b/i.test(prompt)) {
    return "History fans and photographers who savor layered heritage walks.";
  }
  return `Curious travelers who enjoy unstructured roaming, note-taking, and conversations in ${place}.`;
}

function sentenceCase(value: string) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildGenericPlanCopy(
  payload: TravelPlanRequestPayload,
  place?: WorldTravelPlace
): {
  location: TravelPlanResponse["location"];
  promptIntro: string;
  snippetLine: string;
  snippetLower: string;
  cityLabel: string;
  countryLabel: string;
  areaLabel: string;
} {
  const location = {
    continent: place?.continent ?? payload.location.continent,
    country: place?.country ?? payload.location.country,
    city: place?.city ?? payload.location.city ?? payload.location.area ?? payload.location.country,
    area: place?.placeLabel ?? payload.location.area ?? payload.location.city ?? payload.location.country
  };
  const promptSource = place?.prompt ?? payload.prompt;
  const promptIntro = place?.headline ? place.headline : buildPromptIntro(promptSource);
  const snippet = buildPromptSnippet(promptSource);
  return {
    location,
    promptIntro,
    snippetLine: formatSnippetLine(snippet, { capitalize: true }),
    snippetLower: formatSnippetLine(snippet),
    cityLabel: location.city || location.country,
    countryLabel: location.country,
    areaLabel: location.area || location.city || location.country
  };
}

function buildFallbackItinerary(
  copy: ReturnType<typeof buildGenericPlanCopy>,
  place?: WorldTravelPlace
): TravelPlanItineraryDay[] {
  const action = place?.action || "Wander";
  const timeWindow = place?.timeOfDay || "any window";
  return [
    {
      day: 1,
      title: `${sentenceCase(action)} arrival`,
      morning: `Wake early in ${copy.cityLabel} to walk quiet lanes toward ${copy.areaLabel} while the city stretches.`,
      afternoon: `Follow clues through markets, galleries, or waterfront paths, letting ${copy.snippetLower} guide detours.`,
      evening: `Settle near ${copy.areaLabel} for ${timeWindow} light and trade notes with locals lingering nearby.`
    },
    {
      day: 2,
      title: "Hidden layers & twilight",
      morning: `Join a neighborhood walk or light hike to see how ${copy.cityLabel} lives beyond postcards.`,
      afternoon: `Reserve time for a cafe break and scout overlooks or waterfronts as shadows lengthen.`,
      evening: `Snack-hop through evening stalls and soak up the soundtrack as ${copy.snippetLower}.`
    }
  ];
}

function buildHighlights(copy: ReturnType<typeof buildGenericPlanCopy>) {
  return [
    `Sunrise hush around ${copy.areaLabel}`,
    `Slow market loops through ${copy.cityLabel}`,
    `${sentenceCase(copy.snippetLower)}`
  ];
}

function buildFoodAndDrink(copy: ReturnType<typeof buildGenericPlanCopy>) {
  return [
    `Grab a street-side breakfast pastry near ${copy.areaLabel} before the rush.`,
    `Order whatever sizzles loudest in ${copy.cityLabel}'s markets for lunch.`,
    `Try a nightcap or tea stand beloved by ${copy.countryLabel} locals.`
  ];
}

function buildLocalCulture(copy: ReturnType<typeof buildGenericPlanCopy>) {
  return [
    `Greet shopkeepers and elders respectfully—small nods go a long way in ${copy.countryLabel}.`,
    `Dress with modesty near sacred or historic sites around ${copy.areaLabel}.`,
    `Ask before photographing people or intimate scenes in ${copy.cityLabel}.`
  ];
}

function buildPracticalTips(copy: ReturnType<typeof buildGenericPlanCopy>) {
  return [
    `Carry small cash and a reusable bottle; kiosks in ${copy.cityLabel} may be cash-only.`,
    `Pack layers for shifting temps and keep a light rain shell handy.`,
    `Download an offline map so you can roam beyond strong signal zones.`,
    `Share your plan if you head to remote overlooks—rides back can thin out after dark.`
  ];
}

function buildSafetyNotes(copy: ReturnType<typeof buildGenericPlanCopy>) {
  return [
    `Stick to well-lit streets after dark near ${copy.areaLabel} and hail trusted rides for longer hops.`,
    `Keep valuables secured in markets or ferry terminals where crowds compress quickly.`
  ];
}

export function buildFallbackPlanSkeleton(
  payload: TravelPlanRequestPayload,
  place?: WorldTravelPlace
): TravelPlanResponse {
  const copy = buildGenericPlanCopy(payload, place);
  const sourcePrompt = place?.prompt ?? payload.prompt;
  return {
    location: copy.location,
    overview: copy.promptIntro,
    best_time_to_go: inferBestTimeWindow(sourcePrompt, copy.cityLabel),
    ideal_for: inferIdealFor(sourcePrompt, copy.areaLabel),
    itinerary: buildFallbackItinerary(copy, place),
    highlights: buildHighlights(copy),
    food_and_drink: buildFoodAndDrink(copy),
    local_culture: buildLocalCulture(copy),
    practical_tips: buildPracticalTips(copy),
    safety_notes: buildSafetyNotes(copy)
  };
}

export function finalizeFallbackPlan(
  fallbackPlan: TravelPlanResponse,
  payload: TravelPlanRequestPayload,
  place?: WorldTravelPlace
): TravelPlanResponse {
  const source: Record<string, string> = {};
  if (payload.metadata?.travelPointId) {
    source.travelPointId = payload.metadata.travelPointId;
  }
  if (place) {
    source.dataset = place.dataset ?? "procedural_seed";
  }
  return {
    ...fallbackPlan,
    provider: "static-fallback",
    model: "local-template",
    generatedAt: new Date().toISOString(),
    ...(Object.keys(source).length > 0 ? { source } : {})
  };
}

function ensureStrings(base: string[], fallback: string[], minimum: number) {
  const cleaned = base.filter((entry) => typeof entry === "string" && entry.trim());
  if (cleaned.length >= minimum) {
    return cleaned;
  }
  const merged = [...cleaned];
  for (const entry of fallback) {
    if (merged.length >= minimum) {
      break;
    }
    merged.push(entry);
  }
  return merged.length > 0 ? merged : fallback.slice();
}

function cloneItineraryDay(day: TravelPlanItineraryDay): TravelPlanItineraryDay {
  return {
    day: day.day,
    title: day.title,
    morning: day.morning,
    afternoon: day.afternoon,
    evening: day.evening
  };
}

function ensureItinerary(
  base: TravelPlanItineraryDay[],
  fallback: TravelPlanItineraryDay[]
): TravelPlanItineraryDay[] {
  if (base.length >= 2) {
    return base.map(cloneItineraryDay);
  }
  const merged = base.map(cloneItineraryDay);
  for (const day of fallback) {
    if (merged.length >= 2) {
      break;
    }
    merged.push(cloneItineraryDay(day));
  }
  return merged.length > 0 ? merged : fallback.map(cloneItineraryDay);
}

export function mergePlanWithFallback(
  plan: TravelPlanResponse,
  fallback: TravelPlanResponse
): TravelPlanResponse {
  return {
    location: {
      continent: plan.location.continent || fallback.location.continent,
      country: plan.location.country || fallback.location.country,
      city: plan.location.city || fallback.location.city,
      area: plan.location.area || fallback.location.area
    },
    overview: plan.overview || fallback.overview,
    best_time_to_go: plan.best_time_to_go || fallback.best_time_to_go,
    ideal_for: plan.ideal_for || fallback.ideal_for,
    itinerary: ensureItinerary(plan.itinerary, fallback.itinerary),
    highlights: ensureStrings(plan.highlights, fallback.highlights, 3),
    food_and_drink: ensureStrings(plan.food_and_drink, fallback.food_and_drink, 3),
    local_culture: ensureStrings(plan.local_culture, fallback.local_culture, 2),
    practical_tips: ensureStrings(plan.practical_tips, fallback.practical_tips, 3),
    safety_notes: ensureStrings(plan.safety_notes, fallback.safety_notes, 1)
  };
}
