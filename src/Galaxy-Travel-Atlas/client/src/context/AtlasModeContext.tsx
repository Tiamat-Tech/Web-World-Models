import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

export type AtlasMode = "earth" | "galaxy";

interface AtlasModeContextValue {
  mode: AtlasMode;
  setMode: (mode: AtlasMode) => void;
  toggleMode: () => void;
}

const AtlasModeContext = createContext<AtlasModeContextValue | undefined>(undefined);

export function AtlasModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<AtlasMode>("galaxy");

  const toggleMode = () => {
    setMode((previous) => (previous === "earth" ? "galaxy" : "earth"));
  };

  const value = useMemo<AtlasModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode
    }),
    [mode]
  );

  return <AtlasModeContext.Provider value={value}>{children}</AtlasModeContext.Provider>;
}

export function useAtlasMode() {
  const context = useContext(AtlasModeContext);
  if (!context) {
    throw new Error("useAtlasMode must be used within AtlasModeProvider");
  }
  return context;
}
