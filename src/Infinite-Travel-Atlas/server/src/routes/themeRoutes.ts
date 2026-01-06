import { Router } from "express";

import type { ThemeRequestPayload } from "../types.js";
import { generateThemeForDestination, listThemeProviders } from "../services/themeService.js";

export const themeRouter = Router();

themeRouter.get("/themes/providers", (_req, res) => {
  res.json({ providers: listThemeProviders() });
});

themeRouter.post("/themes", async (req, res) => {
  const payload = req.body as ThemeRequestPayload;
  const hasDestination = typeof payload?.destinationId === "string" && payload.destinationId.trim().length > 0;
  const hasTravelNode = typeof payload?.travelNodeId === "string" && payload.travelNodeId.trim().length > 0;
  if (!hasDestination && !hasTravelNode) {
    res.status(400).json({ message: "destinationId or travelNodeId is required" });
    return;
  }

  try {
    const result = await generateThemeForDestination(payload);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
