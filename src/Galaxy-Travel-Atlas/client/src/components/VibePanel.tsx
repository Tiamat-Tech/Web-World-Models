import { useThemeController } from "../context/ThemeContext";

export function VibePanel() {
  const { vibe, isVibeLoading, palette, providers } = useThemeController();

  const heading = vibe ? vibe.mood : "Move across a destination to awaken its vibe";
  const subtitle = vibe
    ? `${vibe.provider === "openrouter" ? "AI-generated" : "Local"} palette • ${new Date(
        vibe.createdAt
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : isVibeLoading
    ? "Summoning palette..."
    : "Cursor-sensitive themes await";

  return (
    <aside className="vibe-panel" style={{ borderColor: palette.accent }}>
      <div className="vibe-panel-meta">
        <span className="pill pill-muted">Live vibe</span>
        {isVibeLoading && <span className="spinner" aria-hidden />}
      </div>
      {providers.length > 0 && (
        <div className="provider-list">
          {providers.map((provider) => (
            <span
              key={provider.id}
              className={provider.ready ? "provider provider-ready" : "provider"}
            >
              {provider.label}
            </span>
          ))}
        </div>
      )}
      <h3>{heading}</h3>
      <p className="subtle">{subtitle}</p>
      {vibe && (
        <div className="vibe-palette">
          {Object.entries(vibe.palette).map(([key, value]) => (
            <div key={key} className="vibe-swatch">
              <span
                className="vibe-color"
                style={{ backgroundColor: value }}
                aria-hidden
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
