interface MapGuideWindowProps {
  destinationName: string;
  regionLabel: string;
  isoCode: string;
  locationLabel?: string;
  guideSummary?: string;
  prompt?: string;
  tags?: string[];
  actionLabel?: string;
  timeOfDayLabel?: string;
  sensoryCue?: string;
  signalTagline?: string;
  variant?: "travel" | "galaxy";
  itineraryPreview: Array<{ key: string; label: string }>;
  isGuideLoading: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
  onOpenPlanner: () => void;
}

export function MapGuideWindow({
  destinationName,
  regionLabel,
  isoCode,
  locationLabel,
  guideSummary,
  prompt,
  tags,
  actionLabel,
  timeOfDayLabel,
  sensoryCue,
  signalTagline,
  variant = "travel",
  itineraryPreview,
  isGuideLoading,
  onClose,
  onOpenGuide,
  onOpenPlanner
}: MapGuideWindowProps) {
  const locationLine = locationLabel ?? regionLabel;
  const showItinerary = itineraryPreview.length > 0;

  return (
    <div className="map-guide-window" role="dialog" aria-modal="true" aria-label="Travel planning window">
      <header className="map-guide-window__header">
        <div>
          <p className="map-guide-window__eyebrow">
            {variant === "galaxy" ? "OpenOuter brief" : "Travel plan and guides"}
          </p>
          <div className="map-guide-window__tags" aria-hidden={false}>
            <span className="pill pill-muted">{regionLabel}</span>
            <span className="pill">{isoCode}</span>
          </div>
          <h2>{destinationName}</h2>
          <p className="map-guide-window__location">{locationLine}</p>
        </div>
        <button
          type="button"
          className="map-guide-window__close"
          aria-label="Close travel planning window"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <section className="map-guide-window__section">
        <div className="map-guide-window__section-head">
          <strong>{variant === "galaxy" ? "Mission plan" : "Travel plan"}</strong>
          <span>Agent sync</span>
        </div>
        {showItinerary ? (
          <ul className="map-guide-window__list">
            {itineraryPreview.map((stop) => (
              <li key={stop.key}>{stop.label}</li>
            ))}
          </ul>
        ) : (
          <p className="map-guide-window__placeholder">
            {isGuideLoading ? "Assembling a fresh itinerary…" : "Select a node to pull AI itinerary cues."}
          </p>
        )}
      </section>

      <section className="map-guide-window__section">
        <div className="map-guide-window__section-head">
          <strong>Guide preview</strong>
          <span>Live summary</span>
        </div>
        <p className="map-guide-window__copy">
          {guideSummary ?? prompt ?? "Awaiting AI guide signal…"}
        </p>
        {(actionLabel || timeOfDayLabel || (tags?.length ?? 0) > 0 || sensoryCue) && (
          <div className="map-guide-window__meta">
            <div className="tag-row muted">
              {actionLabel && <span className="pill pill-muted">{actionLabel}</span>}
              {timeOfDayLabel && <span className="pill pill-muted">{timeOfDayLabel}</span>}
            </div>
            {sensoryCue && <p className="subtle">{sensoryCue}</p>}
            {tags && tags.length > 0 && (
              <div className="tag-row">
                {tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="pill pill-ghost">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {prompt && (
          <p className="map-guide-window__prompt" aria-label="Dataset travel prompt">
            {prompt}
          </p>
        )}
        {signalTagline && (
          <p className="map-guide-window__prompt subtle" aria-label="Signal description">
            {signalTagline}
          </p>
        )}
      </section>

      <footer className="map-guide-window__footer">
        <button type="button" className="primary-btn" onClick={onOpenGuide}>
          Launch AI guide
        </button>
        <button type="button" className="ghost-btn" onClick={onOpenPlanner}>
          Open trip planner
        </button>
      </footer>
    </div>
  );
}
