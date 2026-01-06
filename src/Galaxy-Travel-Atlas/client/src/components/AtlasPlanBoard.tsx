import type { AgentTopSight, ThemeProfile } from "../types";

interface AtlasPlanBoardProps {
  destinationName: string;
  isoCode: string;
  regionLabel: string;
  locationLabel?: string;
  guideSummary?: string;
  themeProfile?: ThemeProfile;
  travelPrompt?: string;
  travelAction?: string;
  travelTimeOfDay?: string;
  travelSensoryCue?: string;
  travelTags: string[];
  structuralTags?: string[];
  paletteAccent: string;
  itineraryPreview: Array<{ key: string; label: string }>;
  topSights: AgentTopSight[];
  localIntel: string[];
  hiddenGems: string[];
  isGuideLoading: boolean;
  variant?: "travel" | "galaxy";
  missionHook?: string;
  hazards?: string[];
  signal?: string;
  sky?: string;
  terrain?: string;
  riskProfile?: string;
  isAnchor?: boolean;
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
  travelPrompt,
  travelAction,
  travelTimeOfDay,
  travelSensoryCue,
  travelTags,
  structuralTags,
  paletteAccent,
  itineraryPreview,
  topSights,
  localIntel,
  hiddenGems,
  isGuideLoading,
  variant = "travel",
  missionHook,
  hazards,
  signal,
  sky,
  terrain,
  riskProfile,
  isAnchor,
  onOpenGuide
}: AtlasPlanBoardProps) {
  const paletteSwatches = getPaletteSwatches(themeProfile);
  const summaryCopy =
    guideSummary ??
    travelPrompt ??
    (variant === "galaxy" ? "OpenOuter is composing the next world brief…" : "Atlas is drafting the next travel blueprint…");
  const providerLabel = themeProfile?.provider ?? "Static palette generator";
  const tags = (variant === "galaxy" ? structuralTags ?? travelTags : travelTags).slice(0, 4);
  const hazardEntries = (hazards ?? []).slice(0, 3);
  const highlightSights = topSights.slice(0, 3);
  const intelEntries = localIntel.slice(0, 2);
  const gemEntries = hiddenGems.slice(0, 2);
  const roleLabel =
    variant === "galaxy"
      ? isAnchor
        ? "Anchor world"
        : travelAction ?? "Swarm relay"
      : travelAction ?? "Free exploration";
  const windowLabel = variant === "galaxy" ? travelTimeOfDay ?? "Signal window" : travelTimeOfDay ?? "Flexible";
  const riskLabel = variant === "galaxy" ? riskProfile ?? "Stable corridor" : windowLabel;
  const signalLabel = signal ?? travelSensoryCue;

  return (
    <section className="atlas-plan-board" aria-live="polite">
      <header className="atlas-plan-board__head">
        <div>
          <span className="pill pill-muted">
            {variant === "galaxy" ? "OpenOuter brief" : "Atlas AI plan"}
          </span>
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
          <div className="atlas-plan-card__eyebrow">
            {variant === "galaxy" ? "Structural palette" : "Theme board"}
          </div>
          <h4>
            {themeProfile?.mood ??
              (variant === "galaxy" ? "Anchor palette ready for drift" : "Tune the cursor over any node")}
          </h4>
          <p className="atlas-plan-card__copy">
            {themeProfile?.travelCue ??
              travelSensoryCue ??
              (variant === "galaxy"
                ? "Cursor drift adjusts the tint; the physics scaffold stays fixed."
                : "Cursor movement breathes life into this palette.")}
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
              <dt>{variant === "galaxy" ? "Role" : "Action"}</dt>
              <dd>{roleLabel}</dd>
            </div>
            <div>
              <dt>{variant === "galaxy" ? "Risk" : "Window"}</dt>
              <dd>{riskLabel}</dd>
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
              <span className="subtle">
                {variant === "galaxy" ? "Waiting for signal tags…" : "Waiting for cue clusters…"}
              </span>
            )}
          </div>
        </article>
        <article className="atlas-plan-card atlas-plan-card--plan">
          <div className="atlas-plan-card__eyebrow">
            {variant === "galaxy" ? "Mission blueprint" : "Plan blueprint"}
          </div>
          {isGuideLoading && (
            <p className="subtle">
              {variant === "galaxy" ? "Linking OpenOuter intel…" : "Synthesizing local itinerary signals…"}
            </p>
          )}
          {!isGuideLoading &&
            (variant === "galaxy" ? (
              <ul className="atlas-plan-list">
                {missionHook && <li key="mission">{missionHook}</li>}
                {terrain && <li key="terrain">{terrain}</li>}
                {sky && <li key="sky">{sky}</li>}
                {hazardEntries.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            ) : itineraryPreview.length > 0 ? (
              <ol className="atlas-plan-list">
                {itineraryPreview.map((stop) => (
                  <li key={stop.key}>{stop.label}</li>
                ))}
              </ol>
            ) : (
              <p className="subtle">Tap any glowing pin to stage a route.</p>
            ))}
          <p className="atlas-plan-hint">
            {variant === "galaxy"
              ? signalLabel ?? "Signal window warming up…"
              : themeProfile?.soundtrack ?? travelSensoryCue ?? "Soundtrack cue pending…"}
          </p>
        </article>
        <article className="atlas-plan-card atlas-plan-card--intel">
          <div className="atlas-plan-card__eyebrow">
            {variant === "galaxy" ? "OpenOuter intel" : "Guide intel"}
          </div>
          <div className="atlas-plan-card__intel-grid">
            <div>
              <strong>{variant === "galaxy" ? "Signal" : "Top sights"}</strong>
              {variant === "galaxy" ? (
                signalLabel ? (
                  <ul>
                    <li key="signal">{signalLabel}</li>
                  </ul>
                ) : (
                  <p className="subtle">Signal warming up…</p>
                )
              ) : highlightSights.length > 0 ? (
                <ul>
                  {highlightSights.map((sight) => (
                    <li key={sight.title}>
                      <span>{sight.title}</span>
                      <small>{sight.why_go}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Awaiting highlight sync…</p>
              )}
            </div>
            <div>
              <strong>{variant === "galaxy" ? "Terrain and sky" : "Local intel"}</strong>
              {variant === "galaxy" ? (
                terrain || sky ? (
                  <ul>
                    {terrain && <li key="terrain">{terrain}</li>}
                    {sky && <li key="sky">{sky}</li>}
                  </ul>
                ) : (
                  <p className="subtle">Collecting terrain scans…</p>
                )
              ) : intelEntries.length > 0 ? (
                <ul>
                  {intelEntries.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Collecting neighborhood cues…</p>
              )}
            </div>
            <div>
              <strong>{variant === "galaxy" ? "Hazards" : "Hidden gems"}</strong>
              {variant === "galaxy" ? (
                hazardEntries.length > 0 ? (
                  <ul>
                    {hazardEntries.map((hazard) => (
                      <li key={hazard}>{hazard}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="subtle">Scanning for hazards…</p>
                )
              ) : gemEntries.length > 0 ? (
                <ul>
                  {gemEntries.map((gem) => (
                    <li key={gem}>{gem}</li>
                  ))}
                </ul>
              ) : (
                <p className="subtle">Agent scouting in progress…</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
