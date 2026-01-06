import { z } from "zod";

import type { AppContent, Destination } from "../types";
import { apiFetch } from "./client";

const RegionEnum = z.enum(["asia", "europe", "americas", "africa", "oceania", "other"]);
const StyleEnum = z.enum(["culture", "adventure", "history", "food", "outdoors", "relaxation", "any"]);
const BudgetEnum = z.enum(["budget", "moderate", "premium"]);

const DestinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  region: RegionEnum,
  style: StyleEnum,
  description: z.string(),
  highlights: z.array(z.string()),
  bestTime: z.string(),
  duration: z.number(),
  budgetTier: BudgetEnum,
  climate: z.string(),
  rating: z.number(),
  cover: z.string().url()
});

const JourneySchema = z.object({
  id: z.string(),
  title: z.string(),
  length: z.string(),
  route: z.array(z.string()),
  description: z.string()
});

const TravelTipSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  body: z.string()
});

const TravelStatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  context: z.string()
});

const AppContentSchema = z.object({
  destinations: z.array(DestinationSchema),
  featuredJourneys: z.array(JourneySchema),
  travelTips: z.array(TravelTipSchema),
  travelStats: z.array(TravelStatSchema)
});

export async function fetchAppContent() {
  const payload = await apiFetch<AppContent>("/content");
  return AppContentSchema.parse(payload) as AppContent;
}

export async function fetchDestination(id: string) {
  const payload = await apiFetch<Destination>(`/destinations/${id}`);
  return DestinationSchema.parse(payload) as Destination;
}
