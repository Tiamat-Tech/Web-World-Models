import type { GalaxyPlanetIntel, GalaxyPlanetIntelRequest } from "../types";
import { apiFetch } from "./client";

export function requestGalaxyIntel(payload: GalaxyPlanetIntelRequest) {
  return apiFetch<GalaxyPlanetIntel>("/galaxy/planets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
