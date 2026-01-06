import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { generateAgentContent } from "../api/agent";
import { requestTheme } from "../api/themes";
import { requestGalaxyIntel } from "../api/galaxy";
import type {
  AgentContentResponse,
  AgentHiddenGem,
  AgentItineraryStop,
  GalaxyPlanetIntel,
  ThemeProfile,
  TravelTheme
} from "../types";
import { findWorldDestination, type WorldDestinationMeta } from "../data/worldDestinations";
import { pickTheme } from "../utils/themePicker";
import { buildImageFromPrompt } from "../utils/imagePrompt";
import { SceneBanner } from "../components/SceneBanner";
import { useWorldTravel } from "../context/WorldTravelContext";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";
import { buildThemeRequestForDestination } from "../utils/themeRequest";

const THEME_PRESETS: Record<TravelTheme, { label: string; icon: string; accent: string; surface: string }> = {
  desert: {
    label: "Desert survival cue",
    icon: "🏜️",
    accent: "#f97316",
    surface: "linear-gradient(135deg, rgba(252, 211, 77, 0.35), rgba(234, 88, 12, 0.5))"
  },
  seaside: {
    label: "Seaside flow",
    icon: "🌊",
    accent: "#38bdf8",
    surface: "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(59, 130, 246, 0.3))"
  },
  forest: {
    label: "Forest etiquette",
    icon: "🌿",
    accent: "#22c55e",
    surface: "linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(21, 128, 61, 0.45))"
  },
  mountain: {
    label: "Mountain mindset",
    icon: "⛰️",
    accent: "#8b5cf6",
    surface: "linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(139, 92, 246, 0.4))"
  },
  urban: {
    label: "Urban playbook",
    icon: "🏙️",
    accent: "#f59e0b",
    surface: "linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(59, 130, 246, 0.25))"
  }
};

const VALID_THEMES: TravelTheme[] = ["desert", "seaside", "forest", "mountain", "urban"];

function isValidTheme(theme: string | null): theme is TravelTheme {
  return Boolean(theme && VALID_THEMES.includes(theme as TravelTheme));
}

const skeletonArray = Array.from({ length: 3 });

function ensureArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function renderItineraryStop(stop: AgentItineraryStop, index: number) {
  if (typeof stop === "string") {
    const key = `${index}-${stop.slice(0, 24)}`;
    return (
      <li key={key} className="itinerary-stop">
        {stop}
      </li>
    );
  }

  const key = `${index}-${stop.title ?? "stop"}`;
  return (
    <li key={key} className="itinerary-stop">
      <div className="itinerary-stop-head">
        <strong>{stop.title ?? `Stop ${index + 1}`}</strong>
        {stop.timing && <span className="pill pill-muted">{stop.timing}</span>}
      </div>
      {stop.description && <p>{stop.description}</p>}
    </li>
  );
}

function formatHiddenGem(gem: AgentHiddenGem) {
  if (typeof gem === "string") {
    return gem;
  }
  if (!gem) {
    return "";
  }
  if (gem.why_go) {
    return `${gem.title}: ${gem.why_go}`;
  }
  return gem.title;
}

function GuideSkeleton() {
  return (
    <div className="guide-card skeleton">
      {skeletonArray.map((_, index) => (
        <div key={index} className="skeleton-line" />
      ))}
    </div>
  );
}

export function DestinationGuideRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const themeCacheRef = useRef(new Map<string, ThemeProfile>());

  const stateDestination = (
    location.state as { destination?: TravelAugmentedDestination } | undefined
  )?.destination;
  const isoParam = searchParams.get("iso2");
  const { findAugmentedBySlug, findAugmentedByIso } = useWorldTravel();

  const travelDatasetDestination = useMemo(() => {
    if (slug) {
      const place = findAugmentedBySlug(slug);
      if (place) {
        return place;
      }
    }
    if (isoParam) {
      return findAugmentedByIso(isoParam);
    }
    return undefined;
  }, [slug, isoParam, findAugmentedBySlug, findAugmentedByIso]);

  const destinationMeta: TravelAugmentedDestination | WorldDestinationMeta | undefined = useMemo(() => {
    if (stateDestination) {
      return stateDestination;
    }
    if (travelDatasetDestination) {
      return travelDatasetDestination;
    }
    if (slug) {
      const fromSlug = findWorldDestination(slug);
      if (fromSlug) {
        return fromSlug;
      }
    }
    if (isoParam) {
      return findWorldDestination(isoParam);
    }
    return undefined;
  }, [slug, isoParam, stateDestination, travelDatasetDestination]);

  const isGalaxy = (destinationMeta as TravelAugmentedDestination | undefined)?.worldKind === "galaxy";

  const rawTheme = destinationMeta ? searchParams.get("theme") : null;
  const theme: TravelTheme = destinationMeta
    ? isValidTheme(rawTheme)
      ? (rawTheme as TravelTheme)
      : pickTheme(destinationMeta)
    : "urban";

  const defaultLanguage = destinationMeta?.defaultLanguage ?? "en";
  const language = destinationMeta ? searchParams.get("lang") ?? defaultLanguage : defaultLanguage;
  const preset = THEME_PRESETS[theme];

  const query = useQuery<AgentContentResponse, Error>({
    queryKey: ["agent-guide", isGalaxy ? "galaxy" : "travel", destinationMeta?.iso2 ?? "unknown", theme, language],
    queryFn: () => {
      if (!destinationMeta) {
        throw new Error("Destination missing");
      }
      return generateAgentContent({
        name: destinationMeta.name,
        iso2: destinationMeta.iso2,
        theme,
        language
      });
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: Boolean(destinationMeta) && !isGalaxy
  });

  const guideThemeRequest = useMemo(
    () => (destinationMeta ? buildThemeRequestForDestination(destinationMeta, { x: 0.55, y: 0.45 }) : null),
    [destinationMeta]
  );
  const guideThemeCacheKey = guideThemeRequest?.destinationId ?? guideThemeRequest?.travelNodeId ?? null;

  const themeQuery = useQuery({
    queryKey: ["destination-guide-theme", guideThemeCacheKey ?? "offline"],
    enabled: Boolean(guideThemeRequest),
    queryFn: () => {
      if (!guideThemeRequest) {
        throw new Error("Missing destination id");
      }
      return requestTheme(guideThemeRequest);
    },
    staleTime: 1000 * 60 * 10
  });

  const galaxyPayload = useMemo(() => {
    if (!isGalaxy || !destinationMeta) {
      return null;
    }
    const galaxyDestination = destinationMeta as TravelAugmentedDestination;
    return {
      system: galaxyDestination.systemName ?? galaxyDestination.region,
      world: galaxyDestination.name,
      region: galaxyDestination.region,
      sector: galaxyDestination.sectorName ?? galaxyDestination.region,
      location: galaxyDestination.worldBiome,
      travelStyle: galaxyDestination.riskProfile,
      basePrompt:
        galaxyDestination.structuralPrompt ?? galaxyDestination.travelPrompt ?? galaxyDestination.summary
    };
  }, [destinationMeta, isGalaxy]);

  const galaxyQuery = useQuery<GalaxyPlanetIntel>({
    queryKey: ["galaxy-guide", destinationMeta?.slug, galaxyPayload?.world],
    queryFn: () => {
      if (!galaxyPayload) {
        throw new Error("Missing galaxy context");
      }
      return requestGalaxyIntel(galaxyPayload);
    },
    enabled: isGalaxy && Boolean(galaxyPayload),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  useEffect(() => {
    if (themeQuery.data?.profile && guideThemeCacheKey) {
      themeCacheRef.current.set(guideThemeCacheKey, themeQuery.data.profile);
    }
  }, [guideThemeCacheKey, themeQuery.data?.profile]);

  const { data, isPending, isFetching, error } = query;
  const isLoading = (!data && isPending) || (!data && isFetching);
  const themeProfile = useMemo(() => {
    if (themeQuery.data?.profile) {
      return themeQuery.data.profile;
    }
    if (guideThemeCacheKey) {
      return themeCacheRef.current.get(guideThemeCacheKey);
    }
    return undefined;
  }, [guideThemeCacheKey, themeQuery.data?.profile]);

  const palette = themeProfile?.palette;
  const heroAccent = palette?.accent ?? preset.accent;
  const heroSurface = palette?.muted
    ? `linear-gradient(135deg, color-mix(in srgb, ${palette.muted} 70%, transparent), color-mix(in srgb, ${heroAccent} 30%, transparent))`
    : preset.surface;
  const heroPrompt = themeProfile?.prompt;
  const heroImage = heroPrompt ? buildImageFromPrompt(heroPrompt, 1200, 800) : destinationMeta?.image;
  const topSights = ensureArray(data?.top_sights);
  const itineraries = ensureArray(data?.itineraries);
  const foodHighlights = ensureArray(data?.food_highlights);
  const seasonalityEntries = ensureArray(data?.seasonality);
  const localTips = ensureArray(data?.local_tips);
  const safetyNotes = ensureArray(data?.safety);
  const hiddenGems = ensureArray(data?.hidden_gems);

  if (!destinationMeta) {
    return (
      <div className="view view-destination">
        <section className="section">
          <h1>Destination not found</h1>
          <p>Choose a spot from the world map to generate a fresh guide.</p>
          <Link className="primary-btn" to="/world">
            Back to map
          </Link>
        </section>
      </div>
    );
  }

  const heroImageUrl = heroImage ?? destinationMeta.image;
  const galaxyIntel = galaxyQuery.data;
  const galaxyLoading = (!galaxyIntel && galaxyQuery.isPending) || galaxyQuery.isFetching;

  if (isGalaxy) {
    const galaxyDestination = destinationMeta as TravelAugmentedDestination;
    return (
      <div className="view view-destination">
        <SceneBanner
          page="destination"
          label={`${destinationMeta.name} mission brief`}
          context={destinationMeta.name}
        />
        <section
          className="section destination-hero"
          style={{
            background: heroSurface,
            borderColor: heroAccent
          }}
        >
          <div className="destination-hero-header">
            <button className="ghost-btn" type="button" onClick={() => navigate(-1)}>
              Back
            </button>
            <span className="pill pill-muted">Galaxy structural state</span>
          </div>
          <div className="destination-hero-layout">
            <div className="destination-hero-body">
              <div className="destination-hero-meta">
                <span className="pill" style={{ background: heroAccent, color: "#0b1120" }}>
                  OpenOuter brief
                </span>
                <span className="pill pill-muted">{destinationMeta.region}</span>
                <span className="pill pill-muted">{destinationMeta.iso2}</span>
              </div>
              <h1>{destinationMeta.name}</h1>
              <p className="lead">{galaxyIntel?.summary ?? destinationMeta.summary}</p>
              <p className="subtle">
                System {galaxyDestination.systemName ?? "Unlisted"} · Sector{" "}
                {galaxyDestination.sectorName ?? galaxyDestination.region}
              </p>
              <p className="subtle">Seed {galaxyDestination.structuralHash ?? galaxyDestination.slug}</p>
            </div>
            <div className="destination-hero-media" style={{ borderColor: heroAccent }}>
              {heroImageUrl ? (
                <img src={heroImageUrl} alt={`${destinationMeta.name} mission moodboard`} loading="lazy" />
              ) : (
                <div className="destination-hero-placeholder">Rendering mission moodboard…</div>
              )}
            </div>
          </div>
        </section>

        {galaxyQuery.error && !galaxyIntel && (
          <section className="section">
            <div className="guide-card error">
              <p>We could not load the latest mission brief. Try again in a moment.</p>
            </div>
          </section>
        )}

        {galaxyLoading && (
          <section className="section guide-grid">
            {Array.from({ length: 3 }).map((_, idx) => (
              <GuideSkeleton key={idx} />
            ))}
          </section>
        )}

        {galaxyIntel && (
          <section className="section guide-grid">
            <article className="guide-card">
              <h2>Mission hook</h2>
              <p>{galaxyIntel.missionHook}</p>
              <p className="subtle">{galaxyIntel.signal}</p>
            </article>
            <article className="guide-card">
              <h2>Summary</h2>
              <p>{galaxyIntel.summary}</p>
              <p className="subtle">
                {galaxyDestination.structuralPrompt ?? galaxyDestination.travelPrompt}
              </p>
            </article>
            <article className="guide-card">
              <h2>Terrain and sky</h2>
              <p>{galaxyIntel.terrain}</p>
              <p className="subtle">Sky: {galaxyIntel.sky}</p>
            </article>
            <article className="guide-card">
              <h2>Hazards</h2>
              <ul>
                {galaxyIntel.hazards.map((hazard) => (
                  <li key={hazard}>{hazard}</li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="view view-destination">
      <SceneBanner page="destination" label={`${destinationMeta.name} moodboard`} context={destinationMeta.name} />
      <section
        className="section destination-hero"
        style={{
          background: heroSurface,
          borderColor: heroAccent
        }}
      >
        <div className="destination-hero-header">
          <button className="ghost-btn" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <span className="pill pill-muted">Live atlas feed</span>
        </div>
        <div className="destination-hero-layout">
          <div className="destination-hero-body">
            <div className="destination-hero-meta">
              <span className="pill" style={{ background: heroAccent, color: "#0b1120" }}>
                {preset.icon} {preset.label}
              </span>
              <span className="pill pill-muted">{destinationMeta.region}</span>
              <span className="pill pill-muted">{destinationMeta.iso2}</span>
            </div>
            <h1>{destinationMeta.name}</h1>
            <p className="lead">{destinationMeta.summary}</p>
            <p className="subtle">
              Lat/Lng {destinationMeta.latlng[0].toFixed(2)}°, {destinationMeta.latlng[1].toFixed(2)}°
            </p>
          </div>
          <div className="destination-hero-media" style={{ borderColor: heroAccent }}>
            {heroImageUrl ? (
              <img src={heroImageUrl} alt={`${destinationMeta.name} AI moodboard`} loading="lazy" />
            ) : (
              <div className="destination-hero-placeholder">Rendering AI guide…</div>
            )}
          </div>
        </div>
      </section>

      {error && !data && (
        <section className="section">
          <div className="guide-card error">
            <p>We couldn't load the latest guide. Try again in a moment.</p>
          </div>
        </section>
      )}

      {isLoading && (
        <section className="section guide-grid">
          {Array.from({ length: 4 }).map((_, idx) => (
            <GuideSkeleton key={idx} />
          ))}
        </section>
      )}

      {data && (
        <section className="section guide-grid">
          <article className="guide-card">
            <h2>Overview</h2>
            <p>{data.overview}</p>
          </article>

          <article className="guide-card">
            <h2>Top sights</h2>
            <div className="guide-list">
              {topSights.map((sight) => (
                <div key={sight.title} className="guide-list-item">
                  <h3>{sight.title}</h3>
                  <p>{sight.why_go}</p>
                  <span className="pill pill-muted">Best: {sight.best_time}</span>
                </div>
              ))}
            </div>
          </article>

          {itineraries.map((itinerary) => (
            <article key={itinerary.title} className="guide-card">
              <h2>{itinerary.title}</h2>
              <ol>
                {ensureArray(itinerary.stops).map((stop, index) => renderItineraryStop(stop, index))}
              </ol>
            </article>
          ))}

          <article className="guide-card">
            <h2>Food highlights</h2>
            <ul>
              {foodHighlights.map((item) => (
                <li key={item.dish}>
                  <strong>{item.dish}</strong> <span>{item.where_to_try}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>Seasonality</h2>
            <div className="guide-list">
              {seasonalityEntries.map((season) => (
                <div key={season.season} className="guide-list-item">
                  <h3>{season.season}</h3>
                  <p>{season.weather}</p>
                  <p className="subtle">Pros: {season.pros}</p>
                  <p className="subtle">Cons: {season.cons}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="guide-card">
            <h2>Local tips</h2>
            <ul>
              {localTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>Safety & etiquette</h2>
            <ul>
              {safetyNotes.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>Budget (per day)</h2>
            <div className="budget-grid">
              <div>
                <p className="subtle">Shoestring</p>
                <strong>
                  {data.budget.currency} {Math.round(data.budget.shoestring)}
                </strong>
              </div>
              <div>
                <p className="subtle">Midrange</p>
                <strong>
                  {data.budget.currency} {Math.round(data.budget.midrange)}
                </strong>
              </div>
              <div>
                <p className="subtle">Luxury</p>
                <strong>
                  {data.budget.currency} {Math.round(data.budget.luxury)}
                </strong>
              </div>
            </div>
          </article>

          <article className="guide-card">
            <h2>Transport</h2>
            <ul>
              <li>
                <strong>From airport:</strong> {data.transport.from_airport}
              </li>
              <li>
                <strong>Getting around:</strong> {data.transport.getting_around}
              </li>
              <li>
                <strong>Passes:</strong> {data.transport.passes}
              </li>
            </ul>
          </article>

          <article className="guide-card">
            <h2>Hidden gems</h2>
            <div className="pill-row">
              {hiddenGems.map((gem, index) => {
                const label = formatHiddenGem(gem);
                if (!label) {
                  return null;
                }
                return (
                  <span key={`${index}-${label.slice(0, 24)}`} className="pill">
                    {label}
                  </span>
                );
              })}
            </div>
          </article>
        </section>
      )}

    </div>
  );
}
