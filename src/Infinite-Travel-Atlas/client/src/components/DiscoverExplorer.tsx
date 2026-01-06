import { type FormEvent } from "react";

import { DestinationCard } from "./DestinationCard";
import { REGION_OPTIONS, STYLE_OPTIONS } from "../data/constants";
import { usePlanner } from "../context/PlannerContext";
import { useThemeController } from "../context/ThemeContext";
import { useDestinationFilters } from "../hooks/useDestinationFilters";
import { pluralize } from "../utils/format";
import type { Destination } from "../types";

interface DiscoverExplorerProps {
  destinations: Destination[];
}

export function DiscoverExplorer({ destinations }: DiscoverExplorerProps) {
  const { favorites, toggleFavorite, addToItinerary } = usePlanner();
  const { requestVibe } = useThemeController();

  const { filters, setFilters, filteredDestinations, resetFilters } = useDestinationFilters(destinations);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFilters();
  };

  const filteredCount = filteredDestinations.length;

  return (
    <>
      <section className="section search-panel">
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Search destinations</span>
            <input
              type="search"
              placeholder="Try Marrakech, fjords, or food tours"
              value={filters.query}
              onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Region</span>
            <select
              value={filters.region}
              onChange={(event) => setFilters((prev) => ({ ...prev, region: event.target.value }))}
            >
              {REGION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Travel style</span>
            <select
              value={filters.style}
              onChange={(event) => setFilters((prev) => ({ ...prev, style: event.target.value }))}
            >
              {STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="ghost-btn" type="submit">
            Reset filters
          </button>
        </form>
        <p className="search-meta">
          {filteredCount} curated {pluralize(filteredCount, "destination")} match your filters.
        </p>
      </section>

      <section className="section destination-grid">
        {filteredDestinations.length === 0 ? (
          <p className="empty-state">No destinations match right now. Adjust filters to explore more ideas.</p>
        ) : (
          filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isFavorite={favorites.includes(destination.id)}
              onToggleFavorite={toggleFavorite}
              onAddToPlan={addToItinerary}
              onRequestVibe={(destinationId, cursor) =>
                requestVibe({ destinationId, cursor }).catch(() => {
                  /* swallow error for UX */
                })
              }
            />
          ))
        )}
      </section>
    </>
  );
}
