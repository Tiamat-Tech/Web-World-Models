import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelTheme, WorldTravelPlace } from "../types";

export type TravelAugmentedDestination = WorldDestinationMeta & {
  travelPrompt?: string;
  travelCity?: string;
  travelCountry?: string;
  travelTheme?: TravelTheme;
  travelNodeId?: string;
  travelHeadline?: string;
  travelAtmosphere?: string;
  travelTags?: string[];
  travelTimeOfDay?: string;
  travelAction?: string;
  travelColorway?: string;
  travelEnergy?: number;
  travelEnergyBucket?: "calm" | "balanced" | "charged";
  travelBeaconSize?: number;
  travelSensoryCue?: string;
  travelPlaceSlug?: string;
  worldKind?: "earth" | "galaxy";
  structuralHash?: string;
  systemName?: string;
  sectorName?: string;
  worldBiome?: string;
  riskProfile?: string;
  structuralPrompt?: string;
  orbitIndex?: number;
  anchor?: boolean;
  signalTagline?: string;
  structuralPosition?: { x: number; y: number };
};

const THEME_METRICS: Record<
  TravelTheme,
  { coastline: number; forest: number; elevation: number }
> = {
  desert: { coastline: 0.2, forest: 0.1, elevation: 480 },
  seaside: { coastline: 0.82, forest: 0.3, elevation: 90 },
  forest: { coastline: 0.4, forest: 0.72, elevation: 550 },
  mountain: { coastline: 0.3, forest: 0.5, elevation: 1650 },
  urban: { coastline: 0.45, forest: 0.28, elevation: 110 }
};

function deriveMetrics(theme: TravelTheme) {
  return THEME_METRICS[theme] ?? THEME_METRICS.urban;
}

export function transformTravelPlace(place: WorldTravelPlace): TravelAugmentedDestination {
  const metrics = deriveMetrics(place.theme);
  const name = place.placeLabel || place.destination || place.city || place.country;
  const summary = place.headline ?? place.prompt;
  return {
    name,
    iso2: place.iso2,
    latlng: place.latlng,
    biomeTags: [place.theme, place.action.toLowerCase()],
    coastlineRatio: metrics.coastline,
    forestCover: metrics.forest,
    meanElevation: metrics.elevation,
    summary,
    region: place.continent,
    slug: place.slug,
    image: "",
    defaultLanguage: "en",
    destinationId: undefined,
    travelPrompt: place.prompt,
    travelCity: place.city,
    travelCountry: place.country,
    travelTheme: place.theme,
    travelNodeId: place.id,
    travelHeadline: place.headline,
    travelAtmosphere: place.atmosphere,
    travelTags: place.tags,
    travelTimeOfDay: place.timeOfDay,
    travelAction: place.action,
    travelColorway: place.colorway,
    travelEnergy: place.energyScore,
    travelEnergyBucket: place.energyBucket,
    travelBeaconSize: place.beaconSize,
    travelSensoryCue: place.sensoryCue,
    travelPlaceSlug: place.slug
  };
}
