import { Router } from "express";

import type { DestinationTheme } from "../types.js";
import {
  findWorldTravelPlace,
  getWorldTravelNodes,
  getWorldTravelSummary
} from "../services/worldPromptService.js";
import { findNearbyTravelPlaces } from "../services/travelGeoService.js";
import { generateProceduralBeacon } from "../services/proceduralBeaconService.js";

export const worldRouter = Router();

worldRouter.get("/world/prompts", async (_req, res) => {
  try {
    const [nodes, summary] = await Promise.all([getWorldTravelNodes(), getWorldTravelSummary()]);
    res.json({ nodes, summary });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

worldRouter.get("/world/nearby", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radiusKmRaw = req.query.radiusKm ? Number(req.query.radiusKm) : undefined;
  const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;
  const themeParam = typeof req.query.theme === "string" ? req.query.theme.trim() : "";
  const minEnergyParam = req.query.minEnergy ? Number(req.query.minEnergy) : undefined;
  const themes: DestinationTheme[] = ["desert", "seaside", "forest", "mountain", "urban"];
  const themeSet = new Set(themes);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    res.status(400).json({ message: "lat and lon are required" });
    return;
  }

  try {
    const options: {
      lat: number;
      lon: number;
      radiusKm?: number;
      limit?: number;
      theme?: DestinationTheme;
      minEnergy?: number;
    } = { lat, lon };
    if (radiusKmRaw !== undefined && Number.isFinite(radiusKmRaw)) {
      options.radiusKm = radiusKmRaw;
    }
    if (limitRaw !== undefined && Number.isFinite(limitRaw)) {
      options.limit = limitRaw;
    }
    if (themeParam && themeSet.has(themeParam as DestinationTheme)) {
      options.theme = themeParam as DestinationTheme;
    }
    if (minEnergyParam !== undefined && Number.isFinite(minEnergyParam)) {
      options.minEnergy = Math.min(Math.max(minEnergyParam, 0), 1);
    }
    const result = await findNearbyTravelPlaces(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

worldRouter.get("/world/places/:slug", async (req, res) => {
  try {
    const place = await findWorldTravelPlace(req.params.slug);
    if (!place) {
      res.status(404).json({ message: "Travel place not found" });
      return;
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

worldRouter.get("/world/beacon", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radiusKmRaw = req.query.radiusKm ? Number(req.query.radiusKm) : undefined;
  const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;
  const resolutionRaw = req.query.resolutionDeg ? Number(req.query.resolutionDeg) : undefined;
  const themeParam = typeof req.query.theme === "string" ? req.query.theme.trim() : "";
  const minEnergyParam = req.query.minEnergy ? Number(req.query.minEnergy) : undefined;
  const includeNearby = req.query.includeNearby !== "false";
  const themes: DestinationTheme[] = ["desert", "seaside", "forest", "mountain", "urban"];
  const themeSet = new Set(themes);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    res.status(400).json({ message: "lat and lon are required" });
    return;
  }

  try {
    const options: {
      lat: number;
      lon: number;
      includeNearby: boolean;
      radiusKm?: number;
      limit?: number;
      resolutionDeg?: number;
      theme?: DestinationTheme;
      minEnergy?: number;
    } = { lat, lon, includeNearby };

    if (radiusKmRaw !== undefined && Number.isFinite(radiusKmRaw)) {
      options.radiusKm = radiusKmRaw;
    }
    if (limitRaw !== undefined && Number.isFinite(limitRaw)) {
      options.limit = limitRaw;
    }
    if (resolutionRaw !== undefined && Number.isFinite(resolutionRaw)) {
      options.resolutionDeg = resolutionRaw;
    }
    if (themeParam && themeSet.has(themeParam as DestinationTheme)) {
      options.theme = themeParam as DestinationTheme;
    }
    if (minEnergyParam !== undefined && Number.isFinite(minEnergyParam)) {
      options.minEnergy = minEnergyParam;
    }

    const result = await generateProceduralBeacon(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
