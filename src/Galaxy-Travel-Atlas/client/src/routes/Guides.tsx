import { Link } from "react-router-dom";

import { useAppContent } from "../hooks/useAppContent";
import { SceneBanner } from "../components/SceneBanner";
import { TravelDatasetTicker } from "../components/TravelDatasetTicker";

export function GuidesRoute() {
  const { data, isLoading, error } = useAppContent();

  if (isLoading) {
    return <p className="loading-state">Gathering travel insights...</p>;
  }

  if (error || !data) {
    return <p className="error-state">Unable to load guides right now.</p>;
  }

  return (
    <div className="view view-guides">
      <SceneBanner page="guides" label="Guides moodboard" />
      <section className="section tips">
        <div className="section-heading">
          <h2>Local-first travel tips</h2>
          <p>Build confident, considerate travel habits from booking to arrival.</p>
        </div>
        <div className="tip-grid">
          {data.travelTips.map((tip) => (
            <article key={tip.id} className="card tip-card">
              <span className="pill pill-muted">{tip.category}</span>
              <h3>{tip.title}</h3>
              <p className="card-copy">{tip.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section stats">
        <div className="section-heading">
          <h2>Trip planning insights</h2>
          <p>Quick benchmarks to stay ahead of the booking curve.</p>
        </div>
        <div className="stat-grid">
          {data.travelStats.map((stat) => (
            <article key={stat.id} className="card stat-card">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
              <p className="card-copy">{stat.context}</p>
            </article>
          ))}
        </div>
      </section>

      <TravelDatasetTicker />

      <section className="section cta">
        <div className="cta-card">
          <h2>Ready to map your next journey?</h2>
          <p>Jump back into Discover to explore curated destinations, then add your favorites to the Planner.</p>
          <div className="cta-actions">
            <Link className="primary-btn" to="/discover">
              Explore destinations
            </Link>
            <Link className="ghost-btn" to="/planner">
              View planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
