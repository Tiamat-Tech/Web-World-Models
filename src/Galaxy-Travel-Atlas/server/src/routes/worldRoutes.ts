import { Router } from "express";

import {
  findWorldTravelPlace,
  getWorldTravelNodes,
  getWorldTravelSummary
} from "../services/worldPromptService.js";

export const worldRouter = Router();

worldRouter.get("/world/prompts", async (_req, res) => {
  try {
    const [nodes, summary] = await Promise.all([getWorldTravelNodes(), getWorldTravelSummary()]);
    res.json({ nodes, summary });
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
