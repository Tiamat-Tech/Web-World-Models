import { Router } from "express";

import type {
  AgentRequestPayload,
  AgentTravelContext,
  DestinationTheme,
  TravelPlanRequestPayload
} from "../types.js";
import { generateDestinationContent } from "../services/contentAgentService.js";
import { generateTravelPlan } from "../services/travelPlanAgentService.js";

const THEMES: DestinationTheme[] = ["desert", "seaside", "forest", "mountain", "urban"];

const themeSet = new Set(THEMES);

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const tags = value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
  return tags.length > 0 ? tags : undefined;
}

function normalizeTravelContext(input: unknown): AgentTravelContext | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const raw = input as Record<string, unknown>;
  const context: AgentTravelContext = {};

  const slug = normalizeString(raw.slug);
  if (slug) {
    context.slug = slug;
  }
  const prompt = normalizeString(raw.prompt);
  if (prompt) {
    context.prompt = prompt;
  }
  const city = normalizeString(raw.city);
  if (city) {
    context.city = city;
  }
  const country = normalizeString(raw.country);
  if (country) {
    context.country = country;
  }
  const tags = normalizeTags(raw.tags);
  if (tags) {
    context.tags = tags;
  }
  const timeOfDay = normalizeString(raw.timeOfDay);
  if (timeOfDay) {
    context.timeOfDay = timeOfDay;
  }
  const action = normalizeString(raw.action);
  if (action) {
    context.action = action;
  }
  const sensoryCue = normalizeString(raw.sensoryCue);
  if (sensoryCue) {
    context.sensoryCue = sensoryCue;
  }
  const dataset = normalizeString(raw.dataset);
  if (dataset) {
    context.dataset = dataset;
  }
  const energyRaw = raw.energy;
  if (typeof energyRaw === "number" && Number.isFinite(energyRaw)) {
    context.energy = Number(energyRaw.toFixed(2));
  }
  const latlng = raw.latlng;
  if (Array.isArray(latlng) && latlng.length === 2) {
    const [latRaw, lonRaw] = latlng;
    const lat = typeof latRaw === "number" ? latRaw : Number(latRaw);
    const lon = typeof lonRaw === "number" ? lonRaw : Number(lonRaw);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      context.latlng = [Number(lat.toFixed(5)), Number(lon.toFixed(5))];
    }
  }
  const radiusRaw = raw.radiusKm;
  if (typeof radiusRaw === "number" && Number.isFinite(radiusRaw)) {
    context.radiusKm = Number(radiusRaw.toFixed(1));
  }
  const distanceRaw = raw.distanceKm;
  if (typeof distanceRaw === "number" && Number.isFinite(distanceRaw)) {
    context.distanceKm = Number(distanceRaw.toFixed(1));
  }
  const bearingRaw = raw.bearing;
  if (typeof bearingRaw === "number" && Number.isFinite(bearingRaw)) {
    context.bearing = Number(bearingRaw.toFixed(1));
  }

  return Object.keys(context).length > 0 ? context : undefined;
}

function normalizePayload(body: unknown): AgentRequestPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  const raw = body as Record<string, unknown>;
  const { name, iso2, theme, language } = raw;

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("name is required");
  }
  if (typeof iso2 !== "string" || iso2.trim().length < 2) {
    throw new Error("iso2 must be at least 2 characters");
  }
  if (typeof theme !== "string" || !themeSet.has(theme as DestinationTheme)) {
    throw new Error(`theme must be one of: ${[...themeSet].join(", ")}`);
  }

  const resolvedLanguage = typeof language === "string" && language.trim() ? language.trim() : "en";
  const normalizedIso2 = iso2.trim().slice(0, 2).toUpperCase();
  const travelContext = normalizeTravelContext(raw.travelContext);

  return {
    name: name.trim(),
    iso2: normalizedIso2,
    theme: theme as DestinationTheme,
    language: resolvedLanguage,
    ...(travelContext ? { travelContext } : {})
  };
}

function normalizeTravelPlanLocation(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("location is required");
  }
  const record = value as Record<string, unknown>;
  const location = {
    continent: normalizeString(record.continent),
    country: normalizeString(record.country),
    city: normalizeString(record.city),
    area: normalizeString(record.area)
  };
  if (!location.continent) {
    throw new Error("location.continent is required");
  }
  if (!location.country) {
    throw new Error("location.country is required");
  }
  if (!location.area) {
    location.area = location.city || location.country;
  }
  return location;
}

function normalizeTravelPlanPayload(body: unknown): TravelPlanRequestPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }
  const raw = body as Record<string, unknown>;
  const prompt = normalizeString(raw.prompt);
  if (!prompt) {
    throw new Error("prompt is required");
  }

  const payload: TravelPlanRequestPayload = {
    prompt,
    location: normalizeTravelPlanLocation(raw.location)
  };

  const metadataRaw = raw.metadata;
  if (metadataRaw && typeof metadataRaw === "object") {
    const metadataInput = metadataRaw as Record<string, unknown>;
    const metadata: TravelPlanRequestPayload["metadata"] = {};
    const travelPointId = normalizeString(metadataInput.travelPointId);
    if (travelPointId) {
      metadata.travelPointId = travelPointId;
    }
    const iso2 = normalizeString(metadataInput.iso2);
    if (iso2) {
      metadata.iso2 = iso2.slice(0, 2).toUpperCase();
    }
    const themeValue = normalizeString(metadataInput.theme);
    if (themeValue && themeSet.has(themeValue as DestinationTheme)) {
      metadata.theme = themeValue as DestinationTheme;
    }
    if (Object.keys(metadata).length > 0) {
      payload.metadata = metadata;
    }
  }

  return payload;
}

export const agentRouter = Router();

agentRouter.post("/agent/generate", async (req, res) => {
  let payload: AgentRequestPayload;
  try {
    payload = normalizePayload(req.body);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
    return;
  }

  try {
    const data = await generateDestinationContent(payload);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

agentRouter.post("/agent/generateTravelPlan", async (req, res) => {
  let payload: TravelPlanRequestPayload;
  try {
    payload = normalizeTravelPlanPayload(req.body);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
    return;
  }

  try {
    const plan = await generateTravelPlan(payload);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
