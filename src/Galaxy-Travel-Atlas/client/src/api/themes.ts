import type { ThemeResult } from "../types";
import { apiFetch } from "./client";

export interface ThemeRequest {
  destinationId?: string;
  travelNodeId?: string;
  cursor?: { x: number; y: number };
  vibeSeed?: string;
}

export interface ThemeProvidersResponse {
  providers: Array<{
    id: string;
    label: string;
    supportsImages: boolean;
    ready: boolean;
  }>;
}

export function requestTheme(payload: ThemeRequest) {
  return apiFetch<ThemeResult>("/themes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchThemeProviders() {
  return apiFetch<ThemeProvidersResponse>("/themes/providers");
}
