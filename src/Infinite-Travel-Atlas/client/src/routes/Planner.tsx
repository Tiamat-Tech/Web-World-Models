import { Link } from "react-router-dom";

import { useAppContent } from "../hooks/useAppContent";
import { usePlanner } from "../context/PlannerContext";
import { useWorldTravel } from "../context/WorldTravelContext";
import { pluralize, toTitleCase } from "../utils/format";
import { SceneBanner } from "../components/SceneBanner";
import { TravelDatasetTicker } from "../components/TravelDatasetTicker";
import { buildGuidePath } from "../utils/guideNavigation";

export function PlannerRoute() {
  const { data, isLoading, error } = useAppContent();
  const { itinerary, removeFromItinerary, resetItinerary, addToItinerary } = usePlanner();
  const { calmPlaces } = useWorldTravel();

  if (isLoading) {
    return <p className="loading-state">Loading your plan...</p>;
  }

  if (error || !data) {
    return <p className="error-state">Unable to load planner information.</p>;
  }

  const destinations = data.destinations;
  const totalDays = itinerary.length;
  const uniquePlaces = new Set(itinerary.map((entry) => entry.destinationId)).size;

  const suggestions = destinations
    .filter((destination) => !itinerary.some((entry) => entry.destinationId === destination.id))
    .slice(0, 3);
  const travelBeaconSuggestions = calmPlaces.slice(0, 3);

  return (
    <div className="view view-planner">
      <SceneBanner page="planner" label="Planner moodboard" />
      <section className="section itinerary-summary">
        <div>
          <h2>Your travel plan</h2>
          <p className="lead">
            {totalDays
              ? `You have ${totalDays} active ${pluralize(totalDays, "day")} across ${uniquePlaces} ${pluralize(
                  uniquePlaces,
                  "destination"
                )}.`
              : "Start pinning destinations to see your plan take shape."}
          </p>
        </div>
        <div className="summary-actions">
          <button className="ghost-btn" onClick={resetItinerary} disabled={totalDays === 0}>
            Clear plan
          </button>
          <Link className="primary-btn" to="/discover">
            Add more ideas
          </Link>
        </div>
      </section>

      <TravelDatasetTicker variant="compact" />

      <section className="section itinerary-list">
        {itinerary.length === 0 ? (
          <p className="empty-state">
            Nothing planned yet. Head to Discover to start pinning destinations.
          </p>
        ) : (
          itinerary.map((entry) => {
            const destination = destinations.find((item) => item.id === entry.destinationId);
            return (
              <article key={entry.id} className="card itinerary-card">
                <header className="card-header">
                  <span className="badge">Day {entry.day}</span>
                  <h3>{entry.name}</h3>
                  <p className="subtle">{destination?.country ?? entry.country}</p>
                </header>
                <p className="card-copy">{entry.notes}</p>
                <footer className="card-footer">
                  <span className="pill">{toTitleCase(entry.focus)}</span>
                  <span className="pill">
                    Recommended: {destination?.bestTime ?? "View guide"}
                  </span>
                  <button className="ghost-btn" onClick={() => removeFromItinerary(entry.id)}>
                    Remove
                  </button>
                </footer>
              </article>
            );
          })
        )}
      </section>

      {suggestions.length > 0 && (
        <section className="section suggestions">
          <div className="section-heading">
            <h2>Need inspiration?</h2>
            <p>Add one of these traveler favorites to round out your itinerary.</p>
          </div>
          <div className="suggestion-grid">
            {suggestions.map((destination) => (
              <article key={destination.id} className="card suggestion-card">
                <h3>{destination.name}</h3>
                <p className="card-copy">{destination.description}</p>
                <p className="subtle">
                  {destination.bestTime} · {destination.duration} nights
                </p>
                <button className="primary-btn" onClick={() => addToItinerary(destination)}>
                  Add to plan
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {travelBeaconSuggestions.length > 0 && (
        <section className="section travel-beacons">
          <div className="section-heading">
            <h2>Live travel beacons</h2>
            <p>Low-energy prompts streaming from the dataset to plug into your plan.</p>
          </div>
          <div className="travel-beacons-grid">
            {travelBeaconSuggestions.map((place) => (
              <article key={place.slug} className="card travel-beacon-card">
                <header className="card-tags">
                  {place.travelAction && <span className="pill pill-muted">{place.travelAction}</span>}
                  {place.travelTimeOfDay && (
                    <span className="pill pill-muted">{place.travelTimeOfDay}</span>
                  )}
                </header>
                <h3>{place.name}</h3>
                <p className="card-copy">{place.travelHeadline ?? place.summary}</p>
                <p className="subtle">{place.travelCity ?? place.travelCountry}</p>
                <Link
                  className="primary-btn"
                  to={buildGuidePath(place).url}
                  state={{ destination: place }}
                >
                  Open AI guide
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
