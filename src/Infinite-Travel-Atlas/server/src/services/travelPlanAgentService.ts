import type {
  LlmChatMessage,
  TravelPlanItineraryDay,
  TravelPlanRequestPayload,
  TravelPlanResponse,
  WorldTravelPlace
} from "../types.js";
import { jsonrepair } from "jsonrepair";
import { env } from "../utils/env.js";
import { requestOpenRouterCompletion } from "./openRouterChatService.js";
import { findWorldTravelPlace } from "./worldPromptService.js";
import {
  buildFallbackPlanSkeleton,
  finalizeFallbackPlan,
  mergePlanWithFallback
} from "./travelPlanFallbackService.js";

class InvalidPlanError extends Error {}

const JSON_SANITIZE_REGEX = /```(?:json)?|```|^json\b/gi;

function sanitizeCompletionOutput(raw: string) {
  return raw.replace(JSON_SANITIZE_REGEX, "").replace(/\u0000/g, "").trim();
}

function parseTravelPlanJson(raw: string) {
  const cleaned = sanitizeCompletionOutput(raw);
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    try {
      const repaired = jsonrepair(cleaned);
      return JSON.parse(repaired);
    } catch (repairError) {
      throw error;
    }
  }
}

function sanitizeString(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return "";
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.trim();
      }
      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        const parts = [record.title, record.detail, record.text, record.description, record.why]
          .map((part) => (typeof part === "string" ? part.trim() : ""))
          .filter(Boolean);
        return parts.join(": ");
      }
      return "";
    })
    .filter(Boolean);
}

function sanitizeItinerary(value: unknown): TravelPlanItineraryDay[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const raw = entry as Record<string, unknown>;
      const parsedDay = raw.day;
      const day = typeof parsedDay === "number" && Number.isFinite(parsedDay) ? parsedDay : index + 1;
      const morning = sanitizeString(raw.morning);
      const afternoon = sanitizeString(raw.afternoon);
      const evening = sanitizeString(raw.evening);
      if (!morning && !afternoon && !evening) {
        return null;
      }
      return {
        day,
        title: sanitizeString(raw.title) || `Day ${day}`,
        morning,
        afternoon,
        evening
      };
    })
    .filter((entry): entry is TravelPlanItineraryDay => Boolean(entry));
}

function normalizePlan(data: unknown, payload: TravelPlanRequestPayload): TravelPlanResponse {
  const baseLocation = {
    continent: payload.location.continent,
    country: payload.location.country,
    city: payload.location.city,
    area: payload.location.area
  };

  if (!data || typeof data !== "object") {
    return {
      location: baseLocation,
      overview: "",
      best_time_to_go: "",
      ideal_for: "",
      itinerary: [],
      highlights: [],
      food_and_drink: [],
      local_culture: [],
      practical_tips: [],
      safety_notes: []
    };
  }

  const record = data as Record<string, unknown>;
  const locationValue = record.location;
  const location =
    locationValue && typeof locationValue === "object"
      ? {
          continent: sanitizeString((locationValue as Record<string, unknown>).continent) || baseLocation.continent,
          country: sanitizeString((locationValue as Record<string, unknown>).country) || baseLocation.country,
          city: sanitizeString((locationValue as Record<string, unknown>).city) || baseLocation.city,
          area: sanitizeString((locationValue as Record<string, unknown>).area) || baseLocation.area
        }
      : baseLocation;

  return {
    location,
    overview: sanitizeString(record.overview),
    best_time_to_go: sanitizeString(record.best_time_to_go),
    ideal_for: sanitizeString(record.ideal_for),
    itinerary: sanitizeItinerary(record.itinerary),
    highlights: sanitizeStringArray(record.highlights),
    food_and_drink: sanitizeStringArray(record.food_and_drink),
    local_culture: sanitizeStringArray(record.local_culture),
    practical_tips: sanitizeStringArray(record.practical_tips),
    safety_notes: sanitizeStringArray(record.safety_notes)
  };
}

function assertPlanCompleteness(plan: TravelPlanResponse) {
  if (!plan.overview) {
    throw new InvalidPlanError("overview missing");
  }
  if (!plan.best_time_to_go) {
    throw new InvalidPlanError("best_time_to_go missing");
  }
  if (!plan.ideal_for) {
    throw new InvalidPlanError("ideal_for missing");
  }
  if (plan.itinerary.length < 2) {
    throw new InvalidPlanError("itinerary requires at least two days");
  }
  if (plan.highlights.length < 3) {
    throw new InvalidPlanError("highlights require at least three entries");
  }
  if (plan.food_and_drink.length < 3) {
    throw new InvalidPlanError("food_and_drink requires at least three entries");
  }
  if (plan.local_culture.length < 2) {
    throw new InvalidPlanError("local_culture requires at least two entries");
  }
  if (plan.practical_tips.length < 3) {
    throw new InvalidPlanError("practical_tips requires at least three entries");
  }
  if (plan.safety_notes.length < 1) {
    throw new InvalidPlanError("safety_notes requires at least one entry");
  }
}

function attachMetadata(
  plan: TravelPlanResponse,
  payload: TravelPlanRequestPayload,
  model: string,
  place?: WorldTravelPlace
): TravelPlanResponse {
  const source = {
    ...(payload.metadata?.travelPointId ? { travelPointId: payload.metadata.travelPointId } : {}),
    ...(place ? { dataset: place.dataset ?? "procedural_seed" } : {})
  };

  return {
    ...plan,
    provider: "openrouter",
    model,
    generatedAt: new Date().toISOString(),
    ...(Object.keys(source).length > 0 ? { source } : {})
  };
}

function buildSystemPrompt(failureReason?: string) {
  const base = [
    "You are an expert travel planner. Return JSON that strictly matches this schema:",
    "{",
    "  \"location\": { continent, country, city, area },",
    "  \"overview\": string (<=120 words),",
    "  \"best_time_to_go\": string (1 sentence),",
    "  \"ideal_for\": string (1-2 sentences),",
    "  \"itinerary\": [ { day, title, morning, afternoon, evening }, ... ],",
    "  \"highlights\": [string, ...],",
    "  \"food_and_drink\": [string, ...],",
    "  \"local_culture\": [string, ...],",
    "  \"practical_tips\": [string, ...],",
    "  \"safety_notes\": [string, ...]",
    "}",
    "Output raw JSON only. Do not wrap the response in backticks, markdown, or commentary.",
    "All list entries must be 3-6 SHORT SENTENCES AS PLAIN STRINGS (no nested JSON).",
    "Each itinerary day must include meaningful morning/afternoon/evening guidance.",
    "Do not mention prompts, agents, or APIs."
  ];
  if (failureReason) {
    if (failureReason.startsWith("json_error")) {
      const detail = failureReason.split(":").slice(1).join(":") || "invalid JSON";
      base.push(
        `Your previous reply could not be parsed (${detail}). Produce valid JSON only—no commentary, no markdown.`
      );
    } else if (failureReason === "missing_fields") {
      base.push(
        "The previous response was rejected because required fields were missing. Include every field and obey the schema exactly."
      );
    }
  }
  return base.join("\n");
}

function buildUserMessage(payload: TravelPlanRequestPayload, place?: WorldTravelPlace) {
  const context: Record<string, unknown> = {
    request_location: payload.location,
    prompt_seed: payload.prompt
  };
  if (place) {
    context.travel_point = {
      id: place.id,
      slug: place.slug,
      destination: place.destination,
      city: place.city,
      country: place.country,
      continent: place.continent,
      theme: place.theme,
      headline: place.headline,
      atmosphere: place.atmosphere,
      timeOfDay: place.timeOfDay,
      action: place.action,
      sensoryCue: place.sensoryCue,
      tags: place.tags,
      energyBucket: place.energyBucket,
      energyScore: place.energyScore
    };
  }
  return JSON.stringify(context, null, 2);
}

async function requestPlanFromOpenRouter(
  payload: TravelPlanRequestPayload,
  place: WorldTravelPlace | undefined,
  fallback: TravelPlanResponse,
  attempt = 0,
  failureReason?: string
): Promise<TravelPlanResponse> {
  if (!env.openRouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for travel plan generation");
  }

  const targetLabel = payload.metadata?.travelPointId ?? `${payload.location.country}-${payload.location.city}`;
  // eslint-disable-next-line no-console
  console.info(`[travel-plan] calling OpenRouter for ${targetLabel} (attempt ${attempt + 1})`);

  const messages: LlmChatMessage[] = [
    { role: "system", content: buildSystemPrompt(failureReason) },
    { role: "user", content: buildUserMessage(payload, place) }
  ];

  const completion = await requestOpenRouterCompletion({
    model: env.openRouter.model,
    responseFormat: { type: "json_object" },
    messages,
    maxTokens: 1100,
    temperature: 0.65,
    title: `Atlas plan: ${payload.location.city || payload.location.country}`
  });

  let parsed: unknown;
  try {
    parsed = parseTravelPlanJson(completion.output);
  } catch (error) {
    if (attempt === 0) {
      const detail = error instanceof Error ? error.message : "invalid JSON";
      return requestPlanFromOpenRouter(payload, place, fallback, attempt + 1, `json_error:${detail}`);
    }
    // eslint-disable-next-line no-console
    console.warn("[travel-plan] Unable to parse OpenRouter payload", {
      error,
      snippet: completion.output.slice(0, 400)
    });
    throw new Error(`Invalid travel plan JSON: ${(error as Error).message}`);
  }

  const normalized = normalizePlan(parsed, payload);
  const blended = mergePlanWithFallback(normalized, fallback);
  try {
    assertPlanCompleteness(blended);
  } catch (error) {
    if (error instanceof InvalidPlanError && attempt === 0) {
      return requestPlanFromOpenRouter(payload, place, fallback, attempt + 1, "missing_fields");
    }
    throw error;
  }

  return attachMetadata(blended, payload, completion.model, place);
}

async function resolveTravelPlace(payload: TravelPlanRequestPayload) {
  const slug = payload.metadata?.travelPointId?.trim();
  if (!slug) {
    return undefined;
  }
  try {
    return await findWorldTravelPlace(slug);
  } catch {
    return undefined;
  }
}

async function runAgent(
  payload: TravelPlanRequestPayload,
  place: WorldTravelPlace | undefined,
  fallback: TravelPlanResponse
) {
  return requestPlanFromOpenRouter(payload, place, fallback);
}

export async function generateTravelPlan(payload: TravelPlanRequestPayload): Promise<TravelPlanResponse> {
  const place = await resolveTravelPlace(payload);
  const fallbackPlan = buildFallbackPlanSkeleton(payload, place);
  try {
    return await runAgent(payload, place, fallbackPlan);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[travel-plan] Falling back to local template", error);
    return finalizeFallbackPlan(fallbackPlan, payload, place);
  }
}
