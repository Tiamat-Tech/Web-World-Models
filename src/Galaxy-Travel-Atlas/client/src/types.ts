export type DestinationRegion =
  | "asia"
  | "europe"
  | "americas"
  | "africa"
  | "oceania"
  | "other";

export type DestinationStyle =
  | "culture"
  | "adventure"
  | "history"
  | "food"
  | "outdoors"
  | "relaxation"
  | "any";

export type TravelTheme = "desert" | "seaside" | "forest" | "mountain" | "urban";

export interface AgentTopSight {
  title: string;
  why_go: string;
  best_time: string;
}

export interface AgentItineraryStopDetail {
  title: string;
  description?: string;
  timing?: string;
}

export type AgentItineraryStop = string | AgentItineraryStopDetail;

export interface AgentItinerary {
  title: string;
  stops: AgentItineraryStop[];
}

export interface AgentFoodHighlight {
  dish: string;
  where_to_try: string;
}

export interface AgentSeasonalityEntry {
  season: string;
  weather: string;
  pros: string;
  cons: string;
}

export interface AgentBudgetInfo {
  shoestring: number;
  midrange: number;
  luxury: number;
  currency: string;
}

export interface AgentTransportInfo {
  from_airport: string;
  getting_around: string;
  passes: string;
}

export interface AgentHiddenGemDetail {
  title: string;
  why_go?: string;
}

export type AgentHiddenGem = string | AgentHiddenGemDetail;

export interface AgentContentResponse {
  destination: {
    name: string;
    iso2: string;
    theme: TravelTheme;
  };
  overview: string;
  top_sights: AgentTopSight[];
  itineraries: [AgentItinerary, AgentItinerary];
  food_highlights: AgentFoodHighlight[];
  seasonality: AgentSeasonalityEntry[];
  local_tips: string[];
  safety: string[];
  budget: AgentBudgetInfo;
  transport: AgentTransportInfo;
  hidden_gems: AgentHiddenGem[];
}

export interface GalaxyPlanetIntelRequest {
  system?: string | undefined;
  world?: string | undefined;
  region?: string | undefined;
  sector?: string | undefined;
  location?: string | undefined;
  travelStyle?: string | undefined;
  basePrompt?: string | undefined;
}

export interface GalaxyPlanetIntel {
  planetName: string;
  summary: string;
  terrain: string;
  sky: string;
  hazards: string[];
  missionHook: string;
  signal: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: DestinationRegion;
  style: DestinationStyle;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: number;
  budgetTier: "budget" | "moderate" | "premium";
  climate: string;
  rating: number;
  cover: string;
}

export interface Journey {
  id: string;
  title: string;
  length: string;
  route: string[];
  description: string;
}

export interface TravelTip {
  id: string;
  category: string;
  title: string;
  body: string;
}

export interface TravelStat {
  id: string;
  label: string;
  value: string;
  context: string;
}

export interface AppContent {
  destinations: Destination[];
  featuredJourneys: Journey[];
  travelTips: TravelTip[];
  travelStats: TravelStat[];
}

export interface WorldTravelNode {
  id: string;
  slug: string;
  destination: string;
  country: string;
  city?: string;
  continent: string;
  region: DestinationRegion;
  prompt: string;
  iso2: string;
  theme: TravelTheme;
  latlng: [number, number];
}

export interface WorldTravelPlace extends WorldTravelNode {
  placeLabel: string;
  locationLabel: string;
  headline: string;
  atmosphere: string;
  action: string;
  timeOfDay: string;
  sensoryCue: string;
  tags: string[];
  energyScore: number;
  colorway: string;
  energyBucket: "calm" | "balanced" | "charged";
  beaconSize: number;
}

export interface WorldTravelSummary {
  total: number;
  continents: Record<string, number>;
  themes: Record<TravelTheme, number>;
  topTags: Array<{ tag: string; count: number }>;
  timeOfDay: Record<string, number>;
  actions: Array<{ action: string; count: number }>;
  energy: {
    average: number;
    peak: number;
    low: number;
  };
  refreshedAt: string;
}

export interface ItineraryEntry {
  id: string;
  destinationId: string;
  name: string;
  country: string;
  focus: DestinationStyle;
  day: number;
  notes: string;
}

export interface ThemePalette {
  background: string;
  foreground: string;
  accent: string;
  highlight: string;
  muted: string;
}

export interface ThemeProfile {
  destinationId: string;
  provider: string;
  palette: ThemePalette;
  mood: string;
  soundtrack: string;
  description: string;
  travelCue: string;
  prompt: string;
  createdAt: string;
}

export interface ThemeResult {
  profile: ThemeProfile;
  cached: boolean;
  latencyMs?: number;
}
