import type { TravelNearbyResult, WorldTravelPlace, WorldTravelSummary } from "../types";
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

export function fetchWorldNearby(params: {
  lat: number;
  lon: number;
  radiusKm?: number;
  limit?: number;
  theme?: string;
  minEnergy?: number;
}) {
  const search = new URLSearchParams();
  search.set("lat", String(params.lat));
  search.set("lon", String(params.lon));
  if (params.radiusKm !== undefined) {
    search.set("radiusKm", String(params.radiusKm));
  }
  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }
  if (params.theme) {
    search.set("theme", params.theme);
  }
  if (params.minEnergy !== undefined) {
    search.set("minEnergy", String(params.minEnergy));
  }
  return apiFetch<TravelNearbyResult>(`/world/nearby?${search.toString()}`);
}

export function fetchWorldBeacon(params: {
  lat: number;
  lon: number;
  radiusKm?: number;
  limit?: number;
  resolutionDeg?: number;
  theme?: string;
  minEnergy?: number;
  includeNearby?: boolean;
}) {
  const search = new URLSearchParams();
  search.set("lat", String(params.lat));
  search.set("lon", String(params.lon));
  if (params.radiusKm !== undefined) {
    search.set("radiusKm", String(params.radiusKm));
  }
  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }
  if (params.resolutionDeg !== undefined) {
    search.set("resolutionDeg", String(params.resolutionDeg));
  }
  if (params.theme) {
    search.set("theme", params.theme);
  }
  if (params.minEnergy !== undefined) {
    search.set("minEnergy", String(params.minEnergy));
  }
  if (params.includeNearby === false) {
    search.set("includeNearby", "false");
  }
  return apiFetch<TravelNearbyResult>(`/world/beacon?${search.toString()}`);
}
