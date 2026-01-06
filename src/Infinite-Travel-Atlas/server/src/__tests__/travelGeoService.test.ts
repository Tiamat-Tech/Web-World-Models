import assert from "node:assert/strict";
import test from "node:test";

import type { WorldTravelPlace } from "../types.js";
import { findNearbyTravelPlaces } from "../services/travelGeoService.js";

const BASE_PLACE: Pick<
  WorldTravelPlace,
  | "id"
  | "slug"
  | "destination"
  | "country"
  | "continent"
  | "region"
  | "prompt"
  | "iso2"
  | "theme"
  | "latlng"
  | "placeLabel"
  | "locationLabel"
  | "headline"
  | "atmosphere"
  | "action"
  | "timeOfDay"
  | "sensoryCue"
  | "tags"
  | "energyScore"
  | "colorway"
  | "energyBucket"
  | "beaconSize"
> = {
  id: "p-0",
  slug: "p-0",
  destination: "Test Point",
  country: "Testland",
  continent: "Test",
  region: "other",
  prompt: "Test prompt",
  iso2: "TT",
  theme: "urban",
  latlng: [0, 0],
  placeLabel: "Test",
  locationLabel: "Test",
  headline: "Test",
  atmosphere: "Test",
  action: "Explore",
  timeOfDay: "anytime",
  sensoryCue: "Test",
  tags: [],
  energyScore: 0.6,
  colorway: "#fff",
  energyBucket: "balanced",
  beaconSize: 1
};

function makePlace(id: string, latlng: [number, number], energyScore: number): WorldTravelPlace {
  return {
    ...BASE_PLACE,
    id,
    slug: id,
    destination: `Place ${id}`,
    placeLabel: `Place ${id}`,
    latlng,
    energyScore,
    energyBucket: energyScore > 0.7 ? "charged" : energyScore < 0.4 ? "calm" : "balanced",
    beaconSize: 1 + energyScore * 0.1
  };
}

test("findNearbyTravelPlaces ranks by distance and energy", async () => {
  const places: WorldTravelPlace[] = [
    makePlace("close-low-energy", [10, 10], 0.2), // closer but low energy
    makePlace("close-high-energy", [10.2, 10.1], 0.9), // similar distance, higher energy
    makePlace("far", [40, 40], 0.9)
  ];

  const result = await findNearbyTravelPlaces({
    lat: 10,
    lon: 10,
    radiusKm: 800,
    limit: 2,
    placesOverride: places
  });

  assert.equal(result.matches.length, 2);
  const topIds = result.matches.map((m) => m.place.id);
  assert.equal(topIds[0], "close-high-energy", "higher energy near match should rank first");
  assert.ok(result.matches[0]!.distanceKm < 40, "distance should be computed");
});

test("findNearbyTravelPlaces respects limit and radius fallback", async () => {
  const places: WorldTravelPlace[] = [
    makePlace("near-1", [0, 0], 0.5),
    makePlace("near-2", [0.1, 0.1], 0.5),
    makePlace("far-1", [50, 50], 0.5)
  ];

  const result = await findNearbyTravelPlaces({
    lat: 0,
    lon: 0,
    radiusKm: 30,
    limit: 1,
    placesOverride: places
  });

  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0]!.place.id, "near-1");
  assert.ok(result.radiusKm >= 30, "radius should expand to cover selected match when needed");
});

test("findNearbyTravelPlaces throws on invalid coordinates", async () => {
  await assert.rejects(
    findNearbyTravelPlaces({ lat: Number.NaN, lon: 0 }),
    /lat and lon are required/
  );
});

test("findNearbyTravelPlaces applies filters when available", async () => {
  const places: WorldTravelPlace[] = [
    makePlace("urban-energetic", [0, 0], 0.9),
    { ...makePlace("forest-calm", [0.05, 0.05], 0.3), theme: "forest" },
    { ...makePlace("urban-low", [0.1, 0.1], 0.2), theme: "urban" }
  ];

  const result = await findNearbyTravelPlaces({
    lat: 0,
    lon: 0,
    radiusKm: 50,
    limit: 2,
    theme: "urban",
    minEnergy: 0.5,
    placesOverride: places
  });

  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0]!.place.id, "urban-energetic");
  assert.equal(result.filters?.theme, "urban");
  assert.equal(result.filters?.minEnergy, 0.5);
});
