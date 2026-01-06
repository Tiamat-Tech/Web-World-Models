import type { TravelTheme } from "../types";
import type { WorldDestinationMeta } from "../data/worldDestinations";

const DESERT_KEYWORDS = ["desert", "erg", "wadi", "atacama", "sahara", "arabian"];
const SEASIDE_KEYWORDS = ["coast", "island", "seaside", "atoll", "lagoon", "reef"];
const FOREST_KEYWORDS = ["forest", "rainforest", "boreal", "jungle", "canopy"];
const MOUNTAIN_KEYWORDS = ["mountain", "alpine", "himalaya", "andes", "cordillera"];

export function pickTheme(meta: Pick<WorldDestinationMeta, "name" | "biomeTags" | "coastlineRatio" | "forestCover" | "meanElevation">): TravelTheme {
  const normalized = meta.biomeTags.map((tag) => tag.toLowerCase());
  const name = meta.name.toLowerCase();

  if (normalized.some((tag) => DESERT_KEYWORDS.some((keyword) => tag.includes(keyword))) ||
    DESERT_KEYWORDS.some((keyword) => name.includes(keyword))) {
    return "desert";
  }

  if (
    normalized.some((tag) => SEASIDE_KEYWORDS.some((keyword) => tag.includes(keyword))) ||
    meta.coastlineRatio > 0.5
  ) {
    return "seaside";
  }

  if (
    normalized.some((tag) => FOREST_KEYWORDS.some((keyword) => tag.includes(keyword))) ||
    meta.forestCover > 0.4
  ) {
    return "forest";
  }

  if (
    normalized.some((tag) => MOUNTAIN_KEYWORDS.some((keyword) => tag.includes(keyword))) ||
    meta.meanElevation > 1200
  ) {
    return "mountain";
  }

  return "urban";
}
