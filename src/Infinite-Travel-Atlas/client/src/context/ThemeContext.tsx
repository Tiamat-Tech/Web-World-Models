import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import {
  fetchThemeProviders,
  requestTheme,
  type ThemeProvidersResponse,
  type ThemeRequest
} from "../api/themes";
import type { ThemePalette, ThemeProfile } from "../types";
import { resolvePalette, type ThemeMode } from "../theme/palettes";

interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemePalette;
  vibe: ThemeProfile | null;
  isVibeLoading: boolean;
  providers: ThemeProvidersResponse["providers"];
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  requestVibe: (payload: ThemeRequest) => Promise<ThemeProfile>;
  clearVibe: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getPreferredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "day";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

function applyPaletteToDocument(mode: ThemeMode, palette: ThemePalette) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.setProperty("--app-bg", palette.background);
  root.style.setProperty("--app-fg", palette.foreground);
  root.style.setProperty("--app-accent", palette.accent);
  root.style.setProperty("--app-highlight", palette.highlight);
  root.style.setProperty("--app-muted", palette.muted);
  document.body.style.background = palette.background;
  document.body.style.color = palette.foreground;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getPreferredMode);
  const [vibe, setVibe] = useState<ThemeProfile | null>(null);
  const [isVibeLoading, setIsVibeLoading] = useState(false);
  const [providers, setProviders] = useState<ThemeProvidersResponse["providers"]>([]);
  const cacheRef = useRef(new Map<string, { profile: ThemeProfile; timestamp: number }>());

  const palette = useMemo(() => resolvePalette(mode, vibe), [mode, vibe]);

  useEffect(() => {
    applyPaletteToDocument(mode, palette);
  }, [mode, palette]);

  useEffect(() => {
    fetchThemeProviders()
      .then((response) => setProviders(response.providers))
      .catch(() => {
        // best-effort probing of available providers
      });
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "day" ? "night" : "day"));
  };

  const handleSetMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
  };

  const requestVibe = async (payload: ThemeRequest) => {
    const cacheKey = payload.destinationId ?? payload.travelNodeId;
    if (!cacheKey) {
      throw new Error("Theme request requires destinationId or travelNodeId");
    }
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 30_000) {
      setVibe(cached.profile);
      return cached.profile;
    }

    setIsVibeLoading(true);
    try {
      const result = await requestTheme(payload);
      cacheRef.current.set(cacheKey, { profile: result.profile, timestamp: Date.now() });
      setVibe(result.profile);
      return result.profile;
    } finally {
      setIsVibeLoading(false);
    }
  };

  const clearVibe = () => {
    setVibe(null);
  };

  const value: ThemeContextValue = {
    mode,
    palette,
    vibe,
    isVibeLoading,
    providers,
    toggleMode,
    setMode: handleSetMode,
    requestVibe,
    clearVibe
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeController() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeController must be used within ThemeProvider");
  }
  return context;
}
