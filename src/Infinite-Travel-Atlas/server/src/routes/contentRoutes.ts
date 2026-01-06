import { Router } from "express";

import { getAppContent, getDestinationById } from "../data/contentStore.js";

export const contentRouter = Router();

contentRouter.get("/content", (_req, res) => {
  res.json(getAppContent());
});

contentRouter.get("/destinations/:id", (req, res) => {
  const destination = getDestinationById(req.params.id);
  if (!destination) {
    res.status(404).json({ message: "Destination not found" });
    return;
  }
  res.json(destination);
});
