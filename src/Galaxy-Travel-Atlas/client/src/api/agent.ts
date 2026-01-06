import type { AgentContentResponse, TravelTheme } from "../types";
import { apiFetch } from "./client";

export interface AgentRequestPayload {
  name: string;
  iso2: string;
  theme: TravelTheme;
  language?: string;
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
