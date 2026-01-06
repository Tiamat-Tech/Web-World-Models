import type { AgentTravelContext } from "../api/agent";
import type { TravelAugmentedDestination } from "./travelPlaces";

export function hasTravelAugmentation(
  destination: unknown
): destination is TravelAugmentedDestination {
  return Boolean(destination && typeof destination === "object" && "travelPrompt" in destination);
}

export function buildAgentTravelContext(
  destination?: TravelAugmentedDestination
): AgentTravelContext | undefined {
  if (!destination) {
    return undefined;
  }

  const context: AgentTravelContext = {};
  const slug = destination.travelPlaceSlug ?? destination.slug;
  if (slug) {
    context.slug = slug;
  }
  if (destination.travelPrompt) {
    context.prompt = destination.travelPrompt;
  }
  if (destination.travelCity) {
    context.city = destination.travelCity;
  }
  if (destination.travelCountry) {
    context.country = destination.travelCountry;
  }
  const tags = destination.travelTags?.map((tag) => tag.trim()).filter(Boolean);
  if (tags && tags.length > 0) {
    context.tags = tags;
  }
  if (destination.travelTimeOfDay) {
    context.timeOfDay = destination.travelTimeOfDay;
  }
  if (destination.travelAction) {
    context.action = destination.travelAction;
  }
  if (destination.travelSensoryCue) {
    context.sensoryCue = destination.travelSensoryCue;
  }
  if (typeof destination.travelEnergy === "number" && Number.isFinite(destination.travelEnergy)) {
    context.energy = Number(destination.travelEnergy.toFixed(2));
  }
  const datasetId =
    destination.geoSource ??
    (destination.travelPlaceSlug ? destination.dataset ?? "procedural_seed" : undefined);
  if (datasetId) {
    context.dataset = datasetId;
  }
  if (destination.latlng) {
    context.latlng = destination.latlng;
  }
  if (typeof destination.geoRadiusKm === "number") {
    context.radiusKm = Number(destination.geoRadiusKm.toFixed(0));
  }
  if (typeof destination.geoDistanceKm === "number") {
    context.distanceKm = Number(destination.geoDistanceKm.toFixed(1));
  }
  if (typeof destination.geoBearing === "number") {
    context.bearing = Number(destination.geoBearing.toFixed(1));
  }

  return Object.keys(context).length > 0 ? context : undefined;
}
