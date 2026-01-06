import type { ThemeRequest } from "../api/themes";
import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelAugmentedDestination } from "./travelPlaces";

export type ThemeableDestination = WorldDestinationMeta | TravelAugmentedDestination;

export function buildThemeRequestForDestination(
  destination: ThemeableDestination,
  cursor: { x: number; y: number } = { x: 0.5, y: 0.5 }
): ThemeRequest | null {
  if (destination.destinationId) {
    return {
      destinationId: destination.destinationId,
      cursor,
      vibeSeed: destination.name
    };
  }

  const augmented = destination as Partial<TravelAugmentedDestination>;
  if (augmented.travelNodeId) {
    return {
      travelNodeId: augmented.travelNodeId,
      cursor,
      vibeSeed: destination.name
    };
  }

  return null;
}
