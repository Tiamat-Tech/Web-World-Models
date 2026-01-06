import { Router } from "express";

import { generateSceneImage } from "../services/sceneImageService.js";

export const sceneRouter = Router();

sceneRouter.post("/ai/scene", async (req, res) => {
  const { page, context } = req.body ?? {};
  if (typeof page !== "string" || !page.trim()) {
    res.status(400).json({ message: "page is required" });
    return;
  }

  try {
    const scene = await generateSceneImage(page, typeof context === "string" ? context : undefined);
    res.json({ scene });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
