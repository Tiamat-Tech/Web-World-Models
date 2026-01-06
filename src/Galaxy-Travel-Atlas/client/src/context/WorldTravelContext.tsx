import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchWorldTravelPlaces } from "../api/world";
import type { WorldTravelPlace, WorldTravelSummary } from "../types";
import { transformTravelPlace, type TravelAugmentedDestination } from "../utils/travelPlaces";

interface WorldTravelContextValue {
  places: WorldTravelPlace[];
  augmentedPlaces: TravelAugmentedDestination[];
  spotlight: TravelAugmentedDestination[];
  calmPlaces: TravelAugmentedDestination[];
  summary?: WorldTravelSummary;
  isLoading: boolean;
  isRefreshing: boolean;
  error: unknown;
  refresh: () => void;
  findBySlug: (slug: string) => WorldTravelPlace | undefined;
  findByIso: (iso2: string) => WorldTravelPlace | undefined;
  findAugmentedBySlug: (slug: string) => TravelAugmentedDestination | undefined;
  findAugmentedByIso: (iso2: string) => TravelAugmentedDestination | undefined;
}

const WorldTravelContext = createContext<WorldTravelContextValue | undefined>(undefined);

function buildIndex(nodes: WorldTravelPlace[]) {
  const map = new Map<string, WorldTravelPlace>();
  for (const node of nodes) {
    map.set(node.slug, node);
    map.set(node.slug.toLowerCase(), node);
    map.set(node.id.toLowerCase(), node);
    map.set(node.iso2.toLowerCase(), node);
    if (node.destination) {
      map.set(node.destination.toLowerCase(), node);
    }
    if (node.city) {
      map.set(node.city.toLowerCase(), node);
    }
  }
  return map;
}

function buildAugmentedIndex(nodes: TravelAugmentedDestination[]) {
  const map = new Map<string, TravelAugmentedDestination>();
  for (const node of nodes) {
    const keys = [
      node.slug,
      node.slug?.toLowerCase(),
      node.iso2,
      node.iso2?.toLowerCase(),
      node.travelPlaceSlug,
      node.travelPlaceSlug?.toLowerCase(),
      node.travelCity,
      node.travelCity?.toLowerCase(),
      node.travelCountry,
      node.travelCountry?.toLowerCase()
    ].filter(Boolean) as string[];
    for (const key of keys) {
      map.set(key, node);
    }
  }
  return map;
}

function sortByEnergy(
  nodes: TravelAugmentedDestination[],
  direction: "asc" | "desc" = "desc"
) {
  return nodes
    .slice()
    .sort((a, b) => {
      const energyA = a.travelEnergy ?? 0;
      const energyB = b.travelEnergy ?? 0;
      return direction === "desc" ? energyB - energyA : energyA - energyB;
    });
}

export function WorldTravelProvider({ children }: PropsWithChildren) {
  const placesQuery = useQuery({
    queryKey: ["world-travel-places"],
    queryFn: fetchWorldTravelPlaces,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });

  const nodes = placesQuery.data?.nodes ?? [];
  const augmented = useMemo(() => nodes.map(transformTravelPlace), [nodes]);
  const index = useMemo(() => buildIndex(nodes), [nodes]);
  const augmentedIndex = useMemo(() => buildAugmentedIndex(augmented), [augmented]);

  const spotlight = useMemo(() => sortByEnergy(augmented, "desc").slice(0, 6), [augmented]);
  const calmPlaces = useMemo(() => {
    return sortByEnergy(
      augmented.filter((place) => (place.travelEnergy ?? 0) <= 0.55),
      "asc"
    ).slice(0, 6);
  }, [augmented]);

  const findBySlug = useCallback(
    (slug: string) => {
      if (!slug) {
        return undefined;
      }
      const key = slug.toLowerCase();
      return index.get(key) ?? index.get(slug);
    },
    [index]
  );

  const findByIso = useCallback(
    (iso2: string) => {
      if (!iso2) {
        return undefined;
      }
      return index.get(iso2.toLowerCase());
    },
    [index]
  );

  const findAugmentedBySlug = useCallback(
    (slug: string) => {
      if (!slug) {
        return undefined;
      }
      const key = slug.toLowerCase();
      return augmentedIndex.get(key) ?? augmentedIndex.get(slug);
    },
    [augmentedIndex]
  );

  const findAugmentedByIso = useCallback(
    (iso2: string) => {
      if (!iso2) {
        return undefined;
      }
      return augmentedIndex.get(iso2.toLowerCase());
    },
    [augmentedIndex]
  );

  const refresh = useCallback(() => {
    placesQuery.refetch().catch(() => {
      /* ignore errors for fire-and-forget refresh */
    });
  }, [placesQuery]);

  const value = useMemo<WorldTravelContextValue>(
    () => ({
      places: nodes,
      augmentedPlaces: augmented,
      spotlight,
      calmPlaces,
      summary: placesQuery.data?.summary,
      isLoading: placesQuery.isLoading,
      isRefreshing: placesQuery.isFetching,
      error: placesQuery.error,
      refresh,
      findBySlug,
      findByIso,
      findAugmentedBySlug,
      findAugmentedByIso
    }),
    [
      nodes,
      augmented,
      spotlight,
      calmPlaces,
      placesQuery.data?.summary,
      placesQuery.isLoading,
      placesQuery.isFetching,
      placesQuery.error,
      refresh,
      findBySlug,
      findByIso,
      findAugmentedBySlug,
      findAugmentedByIso
    ]
  );

  return <WorldTravelContext.Provider value={value}>{children}</WorldTravelContext.Provider>;
}

export function useWorldTravel() {
  const context = useContext(WorldTravelContext);
  if (!context) {
    throw new Error("useWorldTravel must be used within WorldTravelProvider");
  }
  return context;
}
