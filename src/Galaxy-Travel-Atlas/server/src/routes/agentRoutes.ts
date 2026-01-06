import { Router } from "express";

import type { AgentRequestPayload, DestinationTheme } from "../types.js";
import { generateDestinationContent } from "../services/contentAgentService.js";

const THEMES: DestinationTheme[] = ["desert", "seaside", "forest", "mountain", "urban"];

const themeSet = new Set(THEMES);

function normalizePayload(body: unknown): AgentRequestPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  const { name, iso2, theme, language } = body as Record<string, unknown>;

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

  return {
    name: name.trim(),
    iso2: normalizedIso2,
    theme: theme as DestinationTheme,
    language: resolvedLanguage
  };
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
