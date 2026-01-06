import { useMemo, useState } from "react";

import type { Destination } from "../types";

export interface DestinationFilters {
  query: string;
  region: string;
  style: string;
}

const defaultFilters: DestinationFilters = {
  query: "",
  region: "all",
  style: "any"
};

function applyFilters(destinations: Destination[], filters: DestinationFilters) {
  const query = filters.query.trim().toLowerCase();
  return destinations.filter((destination) => {
    const matchesRegion = filters.region === "all" || destination.region === filters.region;
    const matchesStyle = filters.style === "any" || destination.style === filters.style;
    if (!matchesRegion || !matchesStyle) {
      return false;
    }
    if (!query) {
      return true;
    }
    const haystack = [
      destination.name,
      destination.country,
      destination.description,
      ...destination.highlights
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function useDestinationFilters(destinations: Destination[]) {
  const [filters, setFilters] = useState<DestinationFilters>(defaultFilters);

  const filteredDestinations = useMemo(
    () => applyFilters(destinations, filters),
    [destinations, filters]
  );

  const resetFilters = () => setFilters(defaultFilters);

  return {
    filters,
    setFilters,
    filteredDestinations,
    resetFilters
  } as const;
}
