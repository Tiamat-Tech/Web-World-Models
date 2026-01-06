import type { AgentPlugin, ThemePluginContext } from "./agentPlugin.js";
import type {
  Destination,
  DestinationRegion,
  DestinationStyle,
  DestinationTheme,
  ThemePalette,
  ThemeProfile
} from "../types.js";

const STYLE_TO_THEME: Partial<Record<DestinationStyle, DestinationTheme>> = {
  relaxation: "seaside",
  culture: "urban",
  history: "urban",
  food: "urban",
  outdoors: "forest",
  adventure: "mountain",
  any: "urban"
};

const VIBE_KEYWORDS: Array<{ pattern: RegExp; theme: DestinationTheme }> = [
  { pattern: /\b(desert|dune|wadi|sahara)\b/i, theme: "desert" },
  { pattern: /\b(coast|island|shore|harbor|reef|sea|beach)\b/i, theme: "seaside" },
  { pattern: /\b(forest|jungle|rainforest|canopy)\b/i, theme: "forest" },
  { pattern: /\b(mountain|peak|summit|alpine|ridge|fjord)\b/i, theme: "mountain" },
  { pattern: /\b(city|urban|metro|neon|skyline)\b/i, theme: "urban" }
];

const BASE_THEME_PALETTES: Record<DestinationTheme, ThemePalette> = {
  desert: {
    background: "#1c120d",
    foreground: "#f4e7da",
    accent: "#e09b5b",
    highlight: "#ffce7a",
    muted: "#6f4c3e"
  },
  seaside: {
    background: "#081521",
    foreground: "#e4f6ff",
    accent: "#43bdec",
    highlight: "#7fe4ff",
    muted: "#2c4052"
  },
  forest: {
    background: "#071811",
    foreground: "#e4f4ea",
    accent: "#38c76f",
    highlight: "#95f3c1",
    muted: "#22402e"
  },
  mountain: {
    background: "#0b1022",
    foreground: "#e9edff",
    accent: "#8897ff",
    highlight: "#c4d3ff",
    muted: "#2b2f48"
  },
  urban: {
    background: "#0f0915",
    foreground: "#f4eafa",
    accent: "#ff8ecf",
    highlight: "#ffd2f4",
    muted: "#39253f"
  }
};

const REGION_ACCENTS: Record<DestinationRegion, string> = {
  americas: "#f97316",
  europe: "#818cf8",
  asia: "#10b981",
  africa: "#fbbf24",
  oceania: "#38bdf8",
  other: "#a855f7"
};

const SOUNDTRACKS: Record<DestinationTheme, string[]> = {
  desert: ["Tuareg desert blues", "Handpan + oud echoes", "Wind-chime drones"],
  seaside: ["Balearic tide loops", "Soft bossa nova beats", "Ambient steel drum wash"],
  forest: ["Field recordings + light percussion", "Violin over rain taps", "Acoustic fern chorus"],
  mountain: ["Post-rock swells", "Alpine horn textures", "Minimal piano + wind"],
  urban: ["Late-night house pulse", "Lo-fi jazz circuits", "Future garage shimmer"]
};

const CUE_LIBRARY: Record<DestinationTheme, string[]> = {
  desert: ["heat mirages and wind-carved dunes", "sandstone canyons after dusk", "starlit caravan routes"],
  seaside: ["tidal pools and briny spray", "lantern-lit harbors", "salt air markets"],
  forest: ["fern-lined footpaths", "misty understories", "river-hum trails"],
  mountain: ["crisp alpine switchbacks", "glacier-fed lakes", "lantern-lit passes"],
  urban: ["neon reflections after rain", "cable car silhouettes", "late-night market glow"]
};

const MOOD_LIBRARY: Record<DestinationTheme, string[]> = {
  desert: ["Saffron dusk over {name}", "Moonlit caravans near {name}", "Slow heat rising through {region} passes"],
  seaside: ["Sea glass shimmer along {region}", "Harbor haze wrapping {name}", "Sunlit spray and midnight phosphor"],
  forest: ["Emerald hush outside {name}", "Rain-soaked understories in {region}", "Canopy whispers around {name}"],
  mountain: ["Blue-hour ridgelines above {name}", "Alpine breath circling {region}", "Glacier glow near {name}"],
  urban: ["Neon bloom over {name}", "Night-market cadence through {region}", "Cinematic skylines echoing {name}"]
};

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

function seededFraction(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) => {
    const clamped = Math.round(Math.min(Math.max(value, 0), 255));
    const hex = clamped.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(color: string, target: string, weight: number) {
  const a = hexToRgb(color);
  const b = hexToRgb(target);
  const ratio = clamp01(weight);
  const r = a.r * (1 - ratio) + b.r * ratio;
  const g = a.g * (1 - ratio) + b.g * ratio;
  const bl = a.b * (1 - ratio) + b.b * ratio;
  return rgbToHex(r, g, bl);
}

function shiftLuminance(color: string, delta: number) {
  if (delta === 0) {
    return color;
  }
  const normalized = clamp01(Math.abs(delta));
  if (delta > 0) {
    return mixColors(color, "#ffffff", normalized);
  }
  return mixColors(color, "#000000", normalized);
}

function pickFromList(list: string[], seed: string) {
  if (!list.length) {
    return "";
  }
  const fraction = seededFraction(seed);
  const index = Math.floor(fraction * list.length) % list.length;
  return list[index]!;
}

function titleCase(value?: string) {
  if (!value) {
    return "";
  }
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveTheme(destination: Destination, request: ThemePluginContext["request"]) {
  const seeds = [destination.description, destination.highlights.join(" "), request.vibeSeed ?? ""]
    .filter(Boolean)
    .join(" ");
  for (const entry of VIBE_KEYWORDS) {
    if (entry.pattern.test(seeds)) {
      return entry.theme;
    }
  }
  const styleTheme = STYLE_TO_THEME[destination.style];
  if (styleTheme) {
    return styleTheme;
  }
  return "urban";
}

function buildPalette(
  theme: DestinationTheme,
  region: DestinationRegion,
  cursorX: number,
  cursorY: number,
  seed: string
): ThemePalette {
  const base = BASE_THEME_PALETTES[theme];
  const regionAccent = REGION_ACCENTS[region] ?? REGION_ACCENTS.other;
  const noise = seededFraction(`${seed}-noise`);
  const accentMix = mixColors(base.accent, regionAccent, 0.35 + noise * 0.2);
  const highlightMix = mixColors(base.highlight, regionAccent, 0.25 + noise * 0.15);
  const background = shiftLuminance(base.background, (cursorY - 0.5) * 0.35);
  const foreground = shiftLuminance(base.foreground, (0.5 - cursorY) * 0.25);
  const accent = shiftLuminance(accentMix, (cursorX - 0.5) * 0.4);
  const highlight = shiftLuminance(highlightMix, ((1 - cursorX) - 0.5) * 0.35);
  const mutedBase = mixColors(base.muted, base.background, 0.45);
  const muted = shiftLuminance(mutedBase, (noise - 0.5) * 0.2 + (cursorY - 0.5) * 0.1);
  return {
    background,
    foreground,
    accent,
    highlight,
    muted
  };
}

function buildMood(destination: Destination, theme: DestinationTheme, seed: string) {
  const template = pickFromList(MOOD_LIBRARY[theme], `${seed}-mood`);
  const regionLabel = titleCase(destination.region);
  return template
    .replace("{name}", destination.name)
    .replace("{region}", regionLabel || "the region");
}

function buildTravelCue(destination: Destination, theme: DestinationTheme, seed: string) {
  const cue = pickFromList(CUE_LIBRARY[theme], `${seed}-cue`);
  const highlight = destination.highlights[0] ?? destination.description;
  return `Trace ${cue} near ${destination.name}. Highlight: ${highlight}.`;
}

function buildDescription(destination: Destination, mood: string) {
  const summary = destination.highlights.slice(0, 2).join("; ") || destination.description;
  const climateLine = destination.climate || `${titleCase(destination.region)} climate window`;
  return `${destination.name} leans into ${mood.toLowerCase()}. ${climateLine}. ${summary}`;
}

function buildPrompt(destination: Destination, palette: ThemePalette, theme: DestinationTheme) {
  const regionLabel = titleCase(destination.region);
  return [
    `Cinematic ${theme} palette for ${destination.name} (${regionLabel} · ${destination.style}).`,
    `Background ${palette.background}, foreground ${palette.foreground}, accent ${palette.accent},`,
    `highlight ${palette.highlight}, muted ${palette.muted}.`,
    "Translate into CSS variables with gentle gradients inspired by cursor drift."
  ].join(" ");
}

export class StaticThemePlugin implements AgentPlugin {
  readonly id = "static";
  readonly label = "Static palette generator";
  readonly supportsImages = false;

  ready(): boolean {
    return true;
  }

  async generateTheme({ destination, request }: ThemePluginContext): Promise<ThemeProfile> {
    const theme = resolveTheme(destination, request);
    const seed = `${destination.id}-${request.vibeSeed ?? "atlas"}`;
    const cursorX = clamp01(request.cursor?.x ?? seededFraction(`${seed}-x`));
    const cursorY = clamp01(request.cursor?.y ?? seededFraction(`${seed}-y`));
    const palette = buildPalette(theme, destination.region, cursorX, cursorY, seed);
    const mood = buildMood(destination, theme, seed);
    const travelCue = buildTravelCue(destination, theme, seed);
    const description = buildDescription(destination, mood);
    const soundtrack = pickFromList(SOUNDTRACKS[theme], `${seed}-soundtrack`);
    const prompt = buildPrompt(destination, palette, theme);

    return {
      destinationId: destination.id,
      provider: this.id,
      palette,
      mood,
      soundtrack,
      description,
      travelCue,
      prompt,
      createdAt: new Date().toISOString()
    };
  }
}
