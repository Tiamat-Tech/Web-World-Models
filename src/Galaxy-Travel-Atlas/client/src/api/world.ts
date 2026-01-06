import type { WorldTravelPlace, WorldTravelSummary } from "../types";
import { apiFetch } from "./client";

interface WorldTravelPlacesResponse {
  nodes: WorldTravelPlace[];
  summary?: WorldTravelSummary;
}

export function fetchWorldTravelPlaces() {
  return apiFetch<WorldTravelPlacesResponse>("/world/prompts");
}

export function fetchWorldTravelPlace(slug: string) {
  return apiFetch<WorldTravelPlace>(`/world/places/${slug}`);
}
