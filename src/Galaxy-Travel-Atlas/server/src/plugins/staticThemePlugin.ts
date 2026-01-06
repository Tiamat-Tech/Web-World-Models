import type { AgentPlugin, ThemePluginContext } from "./agentPlugin.js";
import type { Destination, ThemePalette, ThemeProfile } from "../types.js";

const REGION_BASE: Record<string, ThemePalette> = {
  asia: {
    background: "#081226",
    foreground: "#f1f5f9",
    accent: "#f97316",
    highlight: "#22d3ee",
    muted: "#1e293b"
  },
  europe: {
    background: "#0f172a",
    foreground: "#e2e8f0",
    accent: "#38bdf8",
    highlight: "#facc15",
    muted: "#1e293b"
  },
  americas: {
    background: "#111827",
    foreground: "#f8fafc",
    accent: "#fbbf24",
    highlight: "#22c55e",
    muted: "#1f2937"
  },
  africa: {
    background: "#1a120b",
    foreground: "#fde68a",
    accent: "#f97316",
    highlight: "#fef08a",
    muted: "#3f2f1b"
  },
  oceania: {
    background: "#031d44",
    foreground: "#e0f2fe",
    accent: "#0ea5e9",
    highlight: "#38f6a9",
    muted: "#0b284f"
  },
  other: {
    background: "#0b1120",
    foreground: "#f1f5f9",
    accent: "#a855f7",
    highlight: "#f472b6",
    muted: "#1f2937"
  }
};

const STYLE_ACCENTS: Record<string, string> = {
  culture: "#f97316",
  adventure: "#22d3ee",
  history: "#f59e0b",
  food: "#ef4444",
  outdoors: "#22c55e",
  relaxation: "#a855f7",
  any: "#38bdf8"
};

const SOUNDTRACK_BY_REGION: Record<string, string> = {
  asia: "Shamisen strings weaving with downtempo beats",
  europe: "Neo-classical piano with soft electronica layers",
  americas: "Indie folk guitars meets Andean flutes",
  africa: "Afro-jazz percussion with desert ambient pads",
  oceania: "Ambient synth swells with oceanic field recordings",
  other: "Cinematic soundscapes with generative textures"
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function adjustHex(hex: string, factor: number): string {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  const r = clamp(((num >> 16) & 0xff) + factor, 0, 255);
  const g = clamp(((num >> 8) & 0xff) + factor, 0, 255);
  const b = clamp((num & 0xff) + factor, 0, 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function buildPalette(destination: Destination, cursorXRatio: number): ThemePalette {
  const basePalette = REGION_BASE[destination.region] ?? REGION_BASE.other;
  if (!basePalette) {
    throw new Error(`Palette not configured for region: ${destination.region}`);
  }
  const accent = STYLE_ACCENTS[destination.style] ?? basePalette.accent;
  const shift = Math.round((cursorXRatio - 0.5) * 80);

  return {
    background: adjustHex(basePalette.background, shift),
    foreground: adjustHex(basePalette.foreground, -shift / 2),
    accent: adjustHex(accent, shift / 1.5),
    highlight: adjustHex(basePalette.highlight, shift),
    muted: adjustHex(basePalette.muted, shift / 3)
  };
}

export class StaticThemePlugin implements AgentPlugin {
  readonly id = "static-local";
  readonly label = "Local palette generator";
  readonly supportsImages = false;

  ready(): boolean {
    return true;
  }

  async generateTheme({ destination, request }: ThemePluginContext): Promise<ThemeProfile> {
    const cursorX =
      request.cursor?.x !== undefined
        ? clamp(request.cursor.x, 0, 1)
        : Math.random();

    const palette = buildPalette(destination, cursorX);
    const soundtrack: string =
      SOUNDTRACK_BY_REGION[destination.region] ??
      SOUNDTRACK_BY_REGION.other ??
      "Cinematic textures";

    return {
      destinationId: destination.id,
      provider: this.id,
      palette,
      mood: `${destination.name}: ${destination.style} energy with ${Math.round(
        (cursorX + 0.2) * 10
      ) / 10}x twilight glow`,
      soundtrack,
      description: `A ${destination.style} journey through ${destination.country}, imagining the scene from the vantage of your cursor position on the canvas.`,
      travelCue: `Lean into ${destination.highlights[0]?.toLowerCase() ?? "local encounters"} while the skyline shifts with your movement.`,
      prompt: `Design ambient theme for ${destination.name} (${destination.region}) with ${destination.style} focus. Palette seed: ${JSON.stringify(
        palette
      )}.`,
      createdAt: new Date().toISOString()
    };
  }
}
