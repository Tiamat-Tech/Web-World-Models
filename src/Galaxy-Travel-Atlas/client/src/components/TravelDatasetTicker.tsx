import { useMemo } from "react";

import { useWorldTravel } from "../context/WorldTravelContext";

interface TravelDatasetTickerProps {
  variant?: "full" | "compact";
}

function formatPercent(count: number, total: number) {
  if (!total) {
    return "0";
  }
  return Math.round((count / total) * 100).toString();
}

function buildTimeWindows(
  summaryTotal: number,
  timeOfDay?: Record<string, number>,
  limit = 4
) {
  if (!timeOfDay) {
    return [];
  }
  return Object.entries(timeOfDay)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      percent: formatPercent(count, summaryTotal)
    }));
}

export function TravelDatasetTicker({ variant = "full" }: TravelDatasetTickerProps) {
  const { summary, spotlight, calmPlaces } = useWorldTravel();

  if (!summary || summary.total === 0) {
    return null;
  }

  const limit = variant === "compact" ? 3 : 5;
  const timeWindows = useMemo(
    () => buildTimeWindows(summary.total, summary.timeOfDay, limit),
    [summary.timeOfDay, summary.total, limit]
  );
  const actionEntries = summary.actions.slice(0, limit);
  const trendingSource = variant === "compact" ? calmPlaces : spotlight;
  const trendingPlaces =
    trendingSource.length > 0 ? trendingSource.slice(0, limit) : spotlight.slice(0, limit);
  const energyAvg = summary.energy.average;

  const energyLabel =
    energyAvg >= 0.7 ? "Charged energy" : energyAvg <= 0.45 ? "Calm drift" : "Balanced flow";
  const energyAccent =
    energyAvg >= 0.7 ? "#f97316" : energyAvg <= 0.45 ? "#38bdf8" : "#a855f7";

  return (
    <section className={`travel-dataset-ticker ${variant}`}>
      <header>
        <div>
          <span className="pill pill-muted">world_travel_prompts_500.json</span>
          <h3>Live travel place telemetry</h3>
          <p>
            {summary.total}+ prompts synced · {energyLabel} ({energyAvg.toFixed(2)} avg)
          </p>
        </div>
        <div className="ticker-energy" style={{ borderColor: energyAccent }}>
          <strong>{energyAvg.toFixed(2)}</strong>
          <span>Energy avg</span>
        </div>
      </header>
      <div className="ticker-grid">
        <div className="ticker-block">
          <strong>Time windows</strong>
          <ul>
            {timeWindows.length === 0 && (
              <li>
                <span>Anytime</span>
                <span>—</span>
              </li>
            )}
            {timeWindows.map((entry) => (
              <li key={entry.label}>
                <span>{entry.label}</span>
                <span>
                  {entry.count} · {entry.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ticker-block">
          <strong>Action cues</strong>
          <ul>
            {actionEntries.length === 0 && (
              <li>
                <span>Exploring</span>
                <span>—</span>
              </li>
            )}
            {actionEntries.map((entry) => (
              <li key={entry.action}>
                <span>{entry.action}</span>
                <span>{entry.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ticker-block">
          <strong>{variant === "compact" ? "Calm beacons" : "Trending beacons"}</strong>
          <div className="ticker-pills">
            {trendingPlaces.length === 0 && (
              <span className="pill pill-ghost subtle">Syncing travel beacons…</span>
            )}
            {trendingPlaces.map((place) => (
              <span key={place.slug} className="pill pill-ghost">
                {place.name} · {place.travelTimeOfDay ?? "anytime"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
