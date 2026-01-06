import { Router } from "express";

import type { GalaxyPlanetIntelRequest } from "../types.js";
import { generatePlanetIntel } from "../services/galaxyAgentService.js";

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizePlanetPayload(body: unknown): GalaxyPlanetIntelRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }
  const { system, world, region, sector, location, travelStyle, basePrompt } = body as Record<
    string,
    unknown
  >;
  const payload: GalaxyPlanetIntelRequest = {
    system: normalizeString(system),
    world: normalizeString(world),
    region: normalizeString(region),
    sector: normalizeString(sector),
    location: normalizeString(location),
    travelStyle: normalizeString(travelStyle),
    basePrompt: normalizeString(basePrompt)
  };
  if (!payload.system && !payload.world) {
    throw new Error("system or world is required");
  }
  return payload;
}

export const galaxyRouter = Router();

galaxyRouter.post("/galaxy/planets", async (req, res) => {
  let payload: GalaxyPlanetIntelRequest;
  try {
    payload = normalizePlanetPayload(req.body);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
    return;
  }
  try {
    const intel = await generatePlanetIntel(payload);
    res.json(intel);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
