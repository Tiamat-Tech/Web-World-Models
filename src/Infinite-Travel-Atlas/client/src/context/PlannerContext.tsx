import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode
} from "react";

import type { Destination, ItineraryEntry } from "../types";

interface PlannerContextValue {
  favorites: string[];
  itinerary: ItineraryEntry[];
  toggleFavorite: (destinationId: string) => void;
  addToItinerary: (destination: Destination) => void;
  removeFromItinerary: (entryId: string) => void;
  resetItinerary: () => void;
}

interface PlannerState {
  favorites: string[];
  itinerary: ItineraryEntry[];
}

type PlannerAction =
  | { type: "toggleFavorite"; destinationId: string }
  | { type: "addItinerary"; entry: ItineraryEntry }
  | { type: "removeItinerary"; entryId: string }
  | { type: "reset" };

const STORAGE_KEY = "web-world-model::planner";

function loadInitialState(): PlannerState {
  if (typeof window === "undefined") {
    return { favorites: [], itinerary: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { favorites: [], itinerary: [] };
    }
    return JSON.parse(raw) as PlannerState;
  } catch {
    return { favorites: [], itinerary: [] };
  }
}

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case "toggleFavorite": {
      const favorites = state.favorites.includes(action.destinationId)
        ? state.favorites.filter((id) => id !== action.destinationId)
        : [...state.favorites, action.destinationId];
      return { ...state, favorites };
    }
    case "addItinerary": {
      const itinerary = [...state.itinerary, action.entry].map((entry, index) => ({
        ...entry,
        day: index + 1
      }));
      return { ...state, itinerary };
    }
    case "removeItinerary": {
      const itinerary = state.itinerary
        .filter((entry) => entry.id !== action.entryId)
        .map((entry, index) => ({
          ...entry,
          day: index + 1
        }));
      return { ...state, itinerary };
    }
    case "reset":
      return { favorites: [], itinerary: [] };
    default:
      return state;
  }
}

const PlannerContext = createContext<PlannerContextValue | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, undefined, loadInitialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleFavorite = (destinationId: string) => {
    dispatch({ type: "toggleFavorite", destinationId });
  };

  const addToItinerary = (destination: Destination) => {
    const entry: ItineraryEntry = {
      id: `plan-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      destinationId: destination.id,
      name: destination.name,
      country: destination.country,
      focus: destination.style,
      day: state.itinerary.length + 1,
      notes: destination.highlights[0] ?? destination.description
    };
    dispatch({ type: "addItinerary", entry });
  };

  const removeFromItinerary = (entryId: string) => {
    dispatch({ type: "removeItinerary", entryId });
  };

  const resetItinerary = () => {
    dispatch({ type: "reset" });
  };

  const value = useMemo<PlannerContextValue>(
    () => ({
      favorites: state.favorites,
      itinerary: state.itinerary,
      toggleFavorite,
      addToItinerary,
      removeFromItinerary,
      resetItinerary
    }),
    [state.favorites, state.itinerary]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner must be used within PlannerProvider");
  }
  return context;
}
