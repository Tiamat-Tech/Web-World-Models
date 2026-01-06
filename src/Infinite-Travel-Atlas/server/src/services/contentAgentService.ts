import type { AgentContentResponse, AgentRequestPayload, LlmChatMessage } from "../types.js";
import { env } from "../utils/env.js";
import { requestOpenRouterCompletion } from "./openRouterChatService.js";

function describeTravelContext(payload: AgentRequestPayload) {
  const context = payload.travelContext;
  if (!context) {
    return "Travel point context unavailable. Base the guide on the destination metadata only.";
  }

  const segments: string[] = [];
  if (context.dataset) {
    segments.push(`Source dataset: ${context.dataset}.`);
  }
  if (context.slug) {
    segments.push(`Travel node: ${context.slug}.`);
  }
  if (context.city || context.country) {
    segments.push(`Locality: ${[context.city, context.country].filter(Boolean).join(", ")}.`);
  }
  if (context.tags?.length) {
    segments.push(`Tags: ${context.tags.join(", ")}.`);
  }
  if (context.timeOfDay) {
    segments.push(`Preferred time window: ${context.timeOfDay}.`);
  }
  if (context.action) {
    segments.push(`Traveler action cue: ${context.action}.`);
  }
  if (context.sensoryCue) {
    segments.push(`Sensory detail: ${context.sensoryCue}.`);
  }
  if (typeof context.energy === "number") {
    segments.push(`Energy score: ${context.energy}.`);
  }
  if (context.latlng) {
    const [lat, lon] = context.latlng;
    segments.push(`Coordinates: ${lat}, ${lon}.`);
  }
  if (context.distanceKm !== undefined) {
    const bearingLabel = context.bearing !== undefined ? `${context.bearing}° bearing` : "bearing unknown";
    const radiusLabel = context.radiusKm !== undefined ? `±${context.radiusKm} km` : "flexible radius";
    segments.push(
      `Closest prompt is ${context.distanceKm} km from the clicked coordinate (${bearingLabel}) within ${radiusLabel}.`
    );
  } else if (context.radiusKm !== undefined) {
    segments.push(`Search radius from clicked coordinate: ±${context.radiusKm} km.`);
  }
  if (context.prompt) {
    segments.push(`Travel dataset prompt: ${context.prompt}`);
  }

  return segments.join(" ") || "Travel point provided no additional detail.";
}

function buildBaseMessages(payload: AgentRequestPayload): LlmChatMessage[] {
  const travelContext = describeTravelContext(payload);
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
        travelContext,
        "Structure keys: destination{name,iso2,theme}, overview(<=120 words), top_sights[{title,why_go,best_time}],",
        "itineraries[Perfect 24 Hours,2–3 Day Highlights with stops], food_highlights[{dish,where_to_try}],",
        "seasonality[{season,weather,pros,cons}], local_tips[], safety[], budget{shoestring,midrange,luxury,currency},",
        "transport{from_airport,getting_around,passes}, hidden_gems[2 items].",
        "Cover visa/permit reminders if common."
      ].join(" ")
    }
  ];
}

async function callOpenRouter(payload: AgentRequestPayload): Promise<AgentContentResponse> {
  if (!env.openRouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for guide generation");
  }

  const baseMessages = buildBaseMessages(payload);

  const firstReply = await requestOpenRouterCompletion({
    model: env.openRouter.model,
    responseFormat: { type: "json_object" },
    reasoning: { enabled: true },
    messages: baseMessages
  });

  const assistantMessage: LlmChatMessage & { reasoning_details?: unknown } = {
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

async function runAgent(payload: AgentRequestPayload) {
  return callOpenRouter(payload);
}

export async function generateDestinationContent(
  payload: AgentRequestPayload
): Promise<AgentContentResponse> {
  return runAgent(payload);
}
