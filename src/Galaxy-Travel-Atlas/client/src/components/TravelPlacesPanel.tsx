import { useWorldTravel } from "../context/WorldTravelContext";
import { useGuideNavigation } from "../hooks/useGuideNavigation";

function formatTimeLabel(timestamp?: string) {
  if (!timestamp) {
    return "";
  }
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function TravelPlacesPanel() {
  const {
    augmentedPlaces,
    spotlight,
    summary,
    isLoading,
    error,
    isRefreshing,
    refresh
  } = useWorldTravel();
  const { openGuide } = useGuideNavigation();
  const hasError = Boolean(error);

  const highlightDestinations = spotlight;

  const refreshedLabel = formatTimeLabel(summary?.refreshedAt);

  return (
    <section className="section travel-places-panel">
      <header className="travel-places-header">
        <div>
          <span className="pill pill-muted">Live AI dataset</span>
          <h2>Traveling places feed</h2>
          {summary ? (
            <p>
              {summary.total}+ prompts across {Object.keys(summary.continents).length} continents. Last synced{" "}
              {refreshedLabel || "just now"}.
            </p>
          ) : (
            <p>world_travel_prompts_500.json hydrates these AI cards once synced.</p>
          )}
        </div>
        <button type="button" className="ghost-btn" onClick={refresh} disabled={isRefreshing}>
          {isRefreshing ? "Syncing…" : "Refresh feed"}
        </button>
      </header>
      {isLoading && <p className="loading-state inline">Streaming travel prompts…</p>}
      {!isLoading && hasError && (
        <p className="error-state inline">Unable to load live travel places. Try refreshing.</p>
      )}
      {!isLoading && !error && (
        <>
          {summary?.topTags && summary.topTags.length > 0 && (
            <div className="travel-places-summary">
              <strong>Top cue clusters</strong>
              <div className="tag-row">
                {summary.topTags.slice(0, 6).map((entry) => (
                  <span key={entry.tag} className="pill pill-ghost">
                    {entry.tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {highlightDestinations.length === 0 ? (
            <p className="empty-state inline">
              {augmentedPlaces.length === 0
                ? "Dataset warming up—please hold tight."
                : "Dataset online—tap refresh to pull spotlight cards."}
            </p>
          ) : (
            <div className="travel-places-grid">
              {highlightDestinations.map((destination) => (
                <article key={destination.slug} className="travel-place-card">
                  <div className="travel-place-card__tags">
                    {destination.travelAction && (
                      <span className="pill pill-muted">{destination.travelAction}</span>
                    )}
                    {destination.travelTimeOfDay && (
                      <span className="pill pill-muted">{destination.travelTimeOfDay}</span>
                    )}
                  </div>
                  <h3>{destination.name}</h3>
                  <p className="subtle">{destination.travelHeadline ?? destination.summary}</p>
                  {destination.travelTags && destination.travelTags.length > 0 && (
                    <div className="tag-row">
                      {destination.travelTags.slice(0, 3).map((tag) => (
                        <span key={tag} className="pill pill-ghost">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="travel-place-card__footer">
                    <span>{destination.travelCity ?? destination.travelCountry}</span>
                    <button type="button" className="primary-btn" onClick={() => openGuide(destination)}>
                      Open AI guide
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
