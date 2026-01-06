import type { AgentContentResponse, TravelTheme } from "../types";
import { apiFetch } from "./client";

export interface AgentTravelContext {
  slug?: string;
  prompt?: string;
  city?: string;
  country?: string;
  tags?: string[];
  timeOfDay?: string;
  action?: string;
  sensoryCue?: string;
  energy?: number;
  dataset?: string;
  latlng?: [number, number];
  radiusKm?: number;
  distanceKm?: number;
  bearing?: number;
}

export interface AgentRequestPayload {
  name: string;
  iso2: string;
  theme: TravelTheme;
  language?: string;
  travelContext?: AgentTravelContext;
}

export function generateAgentContent(payload: AgentRequestPayload) {
  const body = {
    ...payload,
    language: payload.language ?? "en"
  };
  return apiFetch<AgentContentResponse>("/agent/generate", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
