import type { ThemePalette, ThemeProfile } from "../types";

export const basePalettes = {
  day: {
    background: "#f8fafc",
    foreground: "#0f172a",
    accent: "#2563eb",
    highlight: "#f97316",
    muted: "#cbd5f5"
  },
  night: {
    background: "#020617",
    foreground: "#e2e8f0",
    accent: "#38bdf8",
    highlight: "#f472b6",
    muted: "#1f2937"
  }
} satisfies Record<string, ThemePalette>;

export type ThemeMode = keyof typeof basePalettes;

export function resolvePalette(mode: ThemeMode, vibe?: ThemeProfile | null): ThemePalette {
  const base = basePalettes[mode];
  if (!vibe) {
    return base;
  }
  const palette = vibe.palette;
  return {
    background: palette.background || base.background,
    foreground: palette.foreground || base.foreground,
    accent: palette.accent || base.accent,
    highlight: palette.highlight || base.highlight,
    muted: palette.muted || base.muted
  };
}
