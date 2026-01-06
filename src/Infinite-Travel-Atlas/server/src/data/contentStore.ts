import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AppContent, Destination } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentPath = path.resolve(__dirname, "../../data/content.json");

let contentCache: AppContent | null = null;

export function getAppContent(): AppContent {
  if (!contentCache) {
    const raw = readFileSync(contentPath, "utf-8");
    contentCache = JSON.parse(raw) as AppContent;
  }
  return contentCache;
}

export function getDestinationById(id: string): Destination | undefined {
  return getAppContent().destinations.find((destination) => destination.id === id);
}
