import { memo, type KeyboardEvent } from "react";

import type { Destination } from "../types";
import { toTitleCase } from "../utils/format";

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (destinationId: string) => void;
  onAddToPlan: (destination: Destination) => void;
  onRequestVibe: (destinationId: string, cursor: { x: number; y: number }) => void;
}

export const DestinationCard = memo(
  ({ destination, isFavorite, onToggleFavorite, onAddToPlan, onRequestVibe }: DestinationCardProps) => {
    const triggerVibe = () => {
      onRequestVibe(destination.id, { x: 0.5, y: 0.5 });
    };

    const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        triggerVibe();
      }
    };

    return (
      <article
        className="card destination-card"
        role="button"
        tabIndex={0}
        onClick={triggerVibe}
        onKeyDown={handleCardKeyDown}
      >
        <div
          className="card-media"
          style={{ backgroundImage: `url(${destination.cover})` }}
          role="img"
          aria-label={destination.name}
        />
        <div className="card-body">
          <div className="card-tags">
            <span className="pill">{toTitleCase(destination.region)}</span>
            <span className="pill">{toTitleCase(destination.style)}</span>
          </div>
          <h3>{destination.name}</h3>
          <p className="card-copy">{destination.description}</p>
          <ul className="highlight-list">
            {destination.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="card-meta">
            <span>{destination.duration} nights</span>
            <span>Budget: {toTitleCase(destination.budgetTier)}</span>
            <span>Rating: {destination.rating.toFixed(1)}</span>
          </div>
          <div className="card-actions">
            <button
              className="ghost-btn"
              onClick={() => {
                triggerVibe();
                onToggleFavorite(destination.id);
              }}
            >
              {isFavorite ? "Saved to shortlist" : "Save for later"}
            </button>
            <button
              className="primary-btn"
              onClick={() => {
                triggerVibe();
                onAddToPlan(destination);
              }}
            >
              Add to plan
            </button>
          </div>
        </div>
      </article>
    );
  }
);

DestinationCard.displayName = "DestinationCard";
