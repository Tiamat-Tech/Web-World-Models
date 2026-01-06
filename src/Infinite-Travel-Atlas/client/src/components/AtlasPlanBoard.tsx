import type { AgentTopSight, ThemeProfile } from "../types";

interface AtlasPlanBoardProps {
  destinationName: string;
  isoCode: string;
  regionLabel: string;
  locationLabel?: string;
  guideSummary?: string;
  themeProfile?: ThemeProfile;
  errorMessage?: string;
  travelAction?: string;
  travelTimeOfDay?: string;
  travelSensoryCue?: string;
  travelTags: string[];
  paletteAccent: string;
  itineraryPreview: Array<{ key: string; label: string }>;
  topSights: AgentTopSight[];
  localIntel: string[];
  hiddenGems: string[];
  isGuideLoading: boolean;
  onOpenGuide: () => void;
}

const FALLBACK_PALETTE = [
  { label: "Background", value: "#0b1120" },
  { label: "Foreground", value: "#f8fafc" },
  { label: "Accent", value: "#38bdf8" },
  { label: "Highlight", value: "#f472b6" }
];

function getPaletteSwatches(themeProfile?: ThemeProfile) {
  if (!themeProfile?.palette) {
    return FALLBACK_PALETTE;
  }
  const { palette } = themeProfile;
  return [
    { label: "Background", value: palette.background },
    { label: "Foreground", value: palette.foreground },
    { label: "Accent", value: palette.accent },
    { label: "Highlight", value: palette.highlight }
  ];
}

export function AtlasPlanBoard({
  destinationName,
  isoCode,
  regionLabel,
  locationLabel,
  guideSummary,
  themeProfile,
  errorMessage,
  travelAction,
  travelTimeOfDay,
  travelSensoryCue,
  travelTags,
  paletteAccent,
  itineraryPreview,
  topSights,
  localIntel,
  hiddenGems,
  isGuideLoading,
  onOpenGuide
}: AtlasPlanBoardProps) {
  const paletteSwatches = getPaletteSwatches(themeProfile);
  const fallbackSummary = errorMessage
    ? `Unable to load AI itinerary: ${errorMessage}`
    : "Atlas is composing the next travel blueprint...";
  const summaryCopy = guideSummary ?? fallbackSummary;
  const providerLabel = themeProfile?.provider ?? "Static palette generator";
  const tags = travelTags.slice(0, 4);
  const highlightSights = topSights.slice(0, 3);
  const intelEntries = localIntel.slice(0, 2);
  const gemEntries = hiddenGems.slice(0, 2);

  return (
    <section className="atlas-plan-board" aria-live="polite">
      <header className="atlas-plan-board__head">
        <div>
          <span className="pill pill-muted">Atlas AI plan</span>
          <h3>{destinationName}</h3>
          <p>{summaryCopy}</p>
        </div>
        <div className="atlas-plan-board__actions">
          <div className="atlas-plan-board__meta">
            <span>{regionLabel}</span>
            <span>{isoCode}</span>
            {locationLabel && <span>{locationLabel}</span>}
          </div>
          <button type="button" className="primary-btn" onClick={onOpenGuide}>
            Launch AI guide
          </button>
        </div>
      </header>
      <div className="atlas-plan-board__grid">
        <article className="atlas-plan-card atlas-plan-card--theme" style={{ borderColor: paletteAccent }}>
          <div className="atlas-plan-card__eyebrow">Theme board</div>
          <h4>{themeProfile?.mood ?? "Tune the cursor over any node"}</h4>
          <p className="atlas-plan-card__copy">
            {themeProfile?.travelCue ?? travelSensoryCue ?? "Cursor movement breathes life into this palette."}
          </p>
          <div className="atlas-plan-palette">
            {paletteSwatches.map((swatch) => (
              <div key={swatch.label} className="atlas-plan-swatch" style={{ background: swatch.value }}>
                <span>{swatch.label}</span>
                <strong>{swatch.value}</strong>
              </div>
            ))}
          </div>
          <dl className="atlas-plan-details">
            <div>
              <dt>Provider</dt>
              <dd>{providerLabel}</dd>
            </div>
            <div>
              <dt>Action</dt>
              <dd>{travelAction ?? "Free roam"}</dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>{travelTimeOfDay ?? "Flexible"}</dd>
            </div>
          </dl>
          <div className="atlas-plan-tags">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="pill pill-ghost">
                  {tag}
                </span>
              ))
            ) : (
              <span className="subtle">Waiting for cue clusters...</span>
            )}
          </div>
        </article>
        <article className="atlas-plan-card atlas-plan-card--plan">
          <div className="atlas-plan-card__eyebrow">Plan blueprint</div>
          {isGuideLoading && (
            <p className="subtle">Synthesizing local itinerary signals...</p>
          )}
          {!isGuideLoading && itineraryPreview.length > 0 ? (
            <ol className="atlas-plan-list">
              {itineraryPreview.map((stop) => (
                <li key={stop.key}>{stop.label}</li>
              ))}
            </ol>
          ) : (
            !isGuideLoading && (
              <p className="subtle">
                {errorMessage ? `Unable to sync itinerary: ${errorMessage}` : "Tap any glowing pin to stage a route."}
              </p>
            )
          )}
          <p className="atlas-plan-hint">
            {themeProfile?.soundtrack ?? travelSensoryCue ?? "Soundtrack cue pending..."}
          </p>
        </article>
        <article className="atlas-plan-card atlas-plan-card--intel">
          <div className="atlas-plan-card__eyebrow">Guide intel</div>
          <div className="atlas-plan-card__intel-grid">
            <div>
              <strong>Top sights</strong>
              {highlightSights.length > 0 ? (
                <ul>
                  {highlightSights.map((sight) => (
                    <li key={sight.title}>
                      <span>{sight.title}</span>
                      <small>{sight.why_go}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Awaiting highlight sync...</p>
              )}
            </div>
            <div>
              <strong>Local intel</strong>
              {intelEntries.length > 0 ? (
                <ul>
                  {intelEntries.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Collecting neighborhood cues...</p>
              )}
            </div>
            <div>
              <strong>Hidden gems</strong>
              {gemEntries.length > 0 ? (
                <ul>
                  {gemEntries.map((gem) => (
                    <li key={gem}>{gem}</li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Agent scouting in progress...</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
