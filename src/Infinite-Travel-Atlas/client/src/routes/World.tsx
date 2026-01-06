import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useAppContent } from "../hooks/useAppContent";
import { useThemeController } from "../context/ThemeContext";
import { useWorldTravel } from "../context/WorldTravelContext";
import { useGuideNavigation } from "../hooks/useGuideNavigation";
import type { AgentHiddenGem, AgentItineraryStop, ThemeProfile, TravelTheme } from "../types";
import { WorldMap } from "../components/WorldMap";
import { DiscoverExplorer } from "../components/DiscoverExplorer";
import { AtlasPlanBoard } from "../components/AtlasPlanBoard";
import { WORLD_DESTINATIONS } from "../data/worldDestinations";
import { pickTheme } from "../utils/themePicker";
import { generateAgentContent } from "../api/agent";
import { requestTheme } from "../api/themes";
import { requestSceneImage, type SceneImage } from "../api/scenes";
import { fetchWorldBeacon } from "../api/world";
import { buildImageFromPrompt, buildTravelImagePrompt } from "../utils/imagePrompt";
import { transformTravelPlace, type TravelAugmentedDestination } from "../utils/travelPlaces";
import { buildThemeRequestForDestination } from "../utils/themeRequest";
import { buildAgentTravelContext } from "../utils/agentContext";
import "./world.css";

function summarizeItineraryStop(stop: AgentItineraryStop) {
  if (typeof stop === "string") {
    return stop;
  }
  const segments = [stop.title, stop.description, stop.timing].filter(Boolean);
  return segments.join(" · ");
}

function buildStopKey(stop: AgentItineraryStop, index: number) {
  if (typeof stop === "string") {
    return `${index}-${stop.slice(0, 24)}`;
  }
  return `${index}-${stop.title ?? "stop"}`;
}

function normalizeHiddenGems(entries: AgentHiddenGem[] = []) {
  return entries
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }
      if (!entry) {
        return "";
      }
      if (entry.why_go) {
        return `${entry.title}: ${entry.why_go}`;
      }
      return entry.title;
    })
    .filter(Boolean);
}


export function WorldRoute() {
  const { data: appContent, isLoading: contentLoading, error: contentError } = useAppContent();
  const { requestVibe, providers } = useThemeController();
  const {
    augmentedPlaces,
    summary: travelSummary,
    isLoading: travelDatasetLoading,
    isRefreshing: travelDatasetRefreshing,
    refresh: refreshTravelPlaces
  } = useWorldTravel();
  const themeCacheRef = useRef(new Map<string, ThemeProfile>());
  const sceneCacheRef = useRef(new Map<string, SceneImage>());
  const { openGuide } = useGuideNavigation();
  const fallbackDestinations = useMemo<TravelAugmentedDestination[]>(
    () => WORLD_DESTINATIONS.map((destination) => ({ ...destination })),
    []
  );
  const promptDestinations = augmentedPlaces;
  const [geoMatches, setGeoMatches] = useState<TravelAugmentedDestination[]>([]);
  const [geoQueryContext, setGeoQueryContext] = useState<{
    lat: number;
    lon: number;
    radiusKm: number;
  } | null>(null);
  const [lastQueryCoords, setLastQueryCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState(240);
  const [searchTheme, setSearchTheme] = useState<TravelTheme | "all">("all");
  const [minEnergy, setMinEnergy] = useState(0.45);
  const [geoError, setGeoError] = useState<string | null>(null);
  const mapDestinations =
    geoMatches.length > 0
      ? geoMatches
      : promptDestinations.length > 0
        ? promptDestinations
        : fallbackDestinations;
  const promptNodesOnline = promptDestinations.length > 0;
  const [activeWorldDestination, setActiveWorldDestination] = useState<TravelAugmentedDestination>(
    (mapDestinations[0] ?? fallbackDestinations[0])!
  );
  const [guideWindowDestination, setGuideWindowDestination] =
    useState<TravelAugmentedDestination | null>(null);
  useEffect(() => {
    if (mapDestinations.length === 0) {
      return;
    }
    setActiveWorldDestination((previous) => {
      if (!previous) {
        return mapDestinations[0];
      }
      return mapDestinations.find((destination) => destination.slug === previous.slug) ?? mapDestinations[0];
    });
  }, [mapDestinations]);
  useEffect(() => {
    if (!guideWindowDestination) {
      return;
    }
    const stillAvailable = mapDestinations.some(
      (destination) => destination.slug === guideWindowDestination.slug
    );
    if (!stillAvailable) {
      setGuideWindowDestination(null);
    }
  }, [guideWindowDestination, mapDestinations]);
  const datasetTagHighlights =
    promptNodesOnline && travelSummary?.topTags
      ? travelSummary.topTags.slice(0, 4)
      : [];
  const datasetTimeWindows =
    promptNodesOnline && travelSummary?.timeOfDay
      ? Object.entries(travelSummary.timeOfDay)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
      : [];

  const activeTheme = activeWorldDestination.travelTheme ?? pickTheme(activeWorldDestination);
  const activeLanguage = activeWorldDestination.defaultLanguage ?? "en";
  const travelPrompt = activeWorldDestination.travelPrompt;
  const travelHeadline = activeWorldDestination.travelHeadline ?? activeWorldDestination.summary;
  const travelAtmosphere = activeWorldDestination.travelAtmosphere ?? travelPrompt;
  const travelTags = activeWorldDestination.travelTags ?? [];
  const travelAction = activeWorldDestination.travelAction;
  const travelTimeOfDay = activeWorldDestination.travelTimeOfDay;
  const travelSensoryCue = activeWorldDestination.travelSensoryCue;
  const activeThemeRequest = buildThemeRequestForDestination(activeWorldDestination);
  const themeCacheKey = activeThemeRequest?.destinationId ?? activeThemeRequest?.travelNodeId ?? null;
  const activeAgentContext = useMemo(
    () => buildAgentTravelContext(activeWorldDestination),
    [activeWorldDestination]
  );
  const activeAgentKey =
    activeWorldDestination.travelNodeId ??
    activeWorldDestination.travelPlaceSlug ??
    activeWorldDestination.destinationId ??
    activeWorldDestination.slug ??
    activeWorldDestination.iso2;

  const agentQuery = useQuery({
    queryKey: ["world-active-agent", activeAgentKey, activeTheme, activeLanguage],
    queryFn: () =>
      generateAgentContent({
        name: activeWorldDestination.name,
        iso2: activeWorldDestination.iso2,
        theme: activeTheme,
        language: activeLanguage,
        ...(activeAgentContext ? { travelContext: activeAgentContext } : {})
      }),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(activeWorldDestination)
  });

  const themeQuery = useQuery({
    queryKey: ["world-active-theme", themeCacheKey ?? "offline"],
    queryFn: () => {
      if (!activeThemeRequest) {
        throw new Error("Missing theme descriptor");
      }
      return requestTheme(activeThemeRequest);
    },
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(activeThemeRequest)
  });

  const sceneQuery = useQuery({
    queryKey: ["world-scene", activeWorldDestination.slug, travelPrompt],
    queryFn: () =>
      requestSceneImage({
        page: "world",
        context: travelPrompt ?? activeWorldDestination.name
    }),
    staleTime: 1000 * 60 * 20,
    enabled: Boolean(travelPrompt || !activeWorldDestination.destinationId)
  });
  const nearbyQuery = useMutation({
    mutationKey: ["world-nearby"],
    mutationFn: (coords: { lat: number; lon: number }) => {
      const theme = searchTheme === "all" ? undefined : searchTheme;
      return fetchWorldBeacon({
        ...coords,
        limit: 6,
        radiusKm: searchRadiusKm,
        theme,
        minEnergy,
        resolutionDeg: 0.75
      });
    },
    onSuccess: (result) => {
      const matches = result.matches.map((match) =>
        transformTravelPlace(match.place, {
          distanceKm: match.distanceKm,
          bearing: match.bearing,
          radiusKm: result.radiusKm,
          queryCenter: [result.center.lat, result.center.lon],
          source: result.source
        })
      );
      setGeoMatches(matches);
      setGeoQueryContext({
        lat: result.center.lat,
        lon: result.center.lon,
        radiusKm: result.radiusKm
      });
      setLastQueryCoords({ lat: result.center.lat, lon: result.center.lon });
      setGeoError(null);
      if (matches[0]) {
        handleSelectDestination(matches[0]);
      }
    },
    onError: (error) => {
      setGeoMatches([]);
      setGeoQueryContext(null);
      setGeoError((error as Error).message);
    }
  });

  useEffect(() => {
    if (themeQuery.data?.profile && themeCacheKey) {
      themeCacheRef.current.set(themeCacheKey, themeQuery.data.profile);
    }
  }, [themeQuery.data?.profile, themeCacheKey]);

  useEffect(() => {
    if (sceneQuery.data) {
      sceneCacheRef.current.set(activeWorldDestination.slug, sceneQuery.data);
    }
  }, [activeWorldDestination.slug, sceneQuery.data]);

  const themeProfile = useMemo(() => {
    if (themeQuery.data?.profile) {
      return themeQuery.data.profile;
    }
    if (themeCacheKey) {
      return themeCacheRef.current.get(themeCacheKey);
    }
    return undefined;
  }, [themeQuery.data?.profile, themeCacheKey]);

  const fallbackScene = useMemo(() => {
    if (!travelPrompt && activeWorldDestination.destinationId) {
      return undefined;
    }
    return sceneQuery.data ?? sceneCacheRef.current.get(activeWorldDestination.slug);
  }, [sceneQuery.data, activeWorldDestination.destinationId, activeWorldDestination.slug, travelPrompt]);

  const palette = themeProfile?.palette;
  const detailAccent = palette?.accent ?? activeWorldDestination.travelColorway ?? "#38bdf8";
  const detailMuted = palette?.muted ?? "#0f172a";
  const travelMoodSeed =
    travelPrompt ?? travelAtmosphere ?? travelHeadline ?? activeWorldDestination.summary;
  const travelImagePrompt =
    travelPrompt &&
    buildTravelImagePrompt(
      {
        continent: activeWorldDestination.region,
        country:
          activeWorldDestination.travelCountry ??
          activeWorldDestination.region ??
          activeWorldDestination.name,
        city:
          activeWorldDestination.travelCity ??
          activeWorldDestination.travelCountry ??
          activeWorldDestination.region,
        destination: activeWorldDestination.travelHeadline ?? activeWorldDestination.name,
        prompt: travelMoodSeed
      },
      activeTheme
    );
  const detailPrompt = travelImagePrompt ?? themeProfile?.prompt ?? travelPrompt ?? fallbackScene?.prompt;
  const detailImage = detailPrompt
    ? buildImageFromPrompt(detailPrompt, 1200, 800)
    : activeWorldDestination.image;
  const topSights = agentQuery.data?.top_sights ?? [];
  const spotlightSights = topSights.slice(0, 3);
  const primaryItinerary = agentQuery.data?.itineraries?.[0];
  const hiddenGemEntries = useMemo(
    () => normalizeHiddenGems(agentQuery.data?.hidden_gems ?? []),
    [agentQuery.data?.hidden_gems]
  );

  const guideBlocks = [
    {
      title: "Local intel",
      subtitle: "On-the-ground tips",
      entries: agentQuery.data?.local_tips ?? []
    },
    {
      title: "Hidden gems",
      subtitle: "Hidden corners",
      entries: hiddenGemEntries
    },
    {
      title: "Safety signals",
      subtitle: "Safety notes",
      entries: agentQuery.data?.safety ?? []
    }
  ].map((block) => ({
    ...block,
    entries: block.entries.filter(Boolean)
  }));
  const isGuideLoading = (!agentQuery.data && agentQuery.isPending) || agentQuery.isFetching;
  const foodHighlights = agentQuery.data?.food_highlights ?? [];
  const seasonality = agentQuery.data?.seasonality?.[0];
  const itineraryStops = primaryItinerary?.stops ?? [];
  const itineraryPreview = itineraryStops.slice(0, 3).map((stop, index) => ({
    key: buildStopKey(stop, index),
    label: summarizeItineraryStop(stop)
  }));
  const planBoardItineraryPreview = itineraryStops.slice(0, 5).map((stop, index) => ({
    key: `${buildStopKey(stop, index)}-plan`,
    label: summarizeItineraryStop(stop)
  }));
  const guideSummaryText = agentQuery.data?.overview;
  const activeGuideSummary = agentQuery.data?.overview;
  const guideErrorMessage = agentQuery.error ? (agentQuery.error as Error).message : undefined;
  const localIntelEntries = agentQuery.data?.local_tips ?? [];
  const activeLocationLabel =
    [activeWorldDestination.travelCity, activeWorldDestination.travelCountry].filter(Boolean).join(", ") ||
    activeWorldDestination.region;
  const currentSpotLabel = useMemo(() => {
    const cityCountry = [activeWorldDestination.travelCity, activeWorldDestination.travelCountry]
      .filter(Boolean)
      .join(", ");
    const segments = [activeWorldDestination.name, cityCountry].filter(Boolean);
    return segments.join(" · ");
  }, [activeWorldDestination]);
  const lastHopLabel = useMemo(() => {
    const cityCountry = [activeWorldDestination.travelCity, activeWorldDestination.travelCountry]
      .filter(Boolean)
      .join(", ");
    if (cityCountry) {
      return `Last chosen: ${cityCountry}`;
    }
    if (activeWorldDestination.name) {
      return `Last chosen: ${activeWorldDestination.name}`;
    }
    return "Waiting for your first leap";
  }, [activeWorldDestination]);

  const handleSelectDestination = (destinationMeta: TravelAugmentedDestination) => {
    setActiveWorldDestination(destinationMeta);
    setGuideWindowDestination(destinationMeta);
    const vibeRequest = buildThemeRequestForDestination(destinationMeta);
    if (vibeRequest) {
      requestVibe(vibeRequest).catch(() => {
        /* ignore */
      });
    }
  };

  const handleCoordinateSelect = (coords: { lat: number; lon: number }) => {
    setGeoError(null);
    setLastQueryCoords(coords);
    nearbyQuery.mutate(coords);
  };

  const resetGeoScan = () => {
    setGeoMatches([]);
    setGeoQueryContext(null);
    setGeoError(null);
    setLastQueryCoords(null);
  };

  const rescanLastPoint = () => {
    if (!lastQueryCoords) {
      return;
    }
    nearbyQuery.mutate(lastQueryCoords);
  };

  const refreshActiveProfile = () => {
    agentQuery.refetch();
    if (activeThemeRequest) {
      themeQuery.refetch();
      requestVibe(activeThemeRequest).catch(() => {
        /* ignore */
      });
    }
  };

  const openSelectedGuide = () => {
    openGuide(activeWorldDestination);
  };

  const discoverDestinations = appContent?.destinations ?? [];
  const detailSelectionActive = Boolean(guideWindowDestination);
  const guidePanelTitle = detailSelectionActive
    ? guideWindowDestination?.name ?? activeWorldDestination.name
    : "Follow a glowing light to see the plan.";
  const guidePanelSummary = detailSelectionActive
    ? guideSummaryText ??
      (guideErrorMessage ? `Unable to load AI guide: ${guideErrorMessage}` : "Synthesizing itinerary signals...")
    : "Your travel studio fills in the moment a light catches your eye.";
  const detailMetaTags = detailSelectionActive ? guideWindowDestination?.travelTags ?? [] : travelTags;
  const detailMetaAction = detailSelectionActive
    ? guideWindowDestination?.travelAction ?? undefined
    : travelAction;
  const detailMetaTime = detailSelectionActive
    ? guideWindowDestination?.travelTimeOfDay ?? undefined
    : travelTimeOfDay;
  const detailMetaCue = detailSelectionActive
    ? guideWindowDestination?.travelSensoryCue ?? undefined
    : travelSensoryCue;
  const agentStatusLabel = isGuideLoading || agentQuery.isFetching ? "Gathering" : "Ready when you drift closer.";
  const atlasStats = [
    {
      label: "Glowing paths",
      value:
        geoMatches.length > 0
          ? `${geoMatches.length} nearby spots`
          : `${mapDestinations.length} live prompts`,
      hint:
        geoMatches.length > 0 && geoQueryContext
          ? `Anchored at ${geoQueryContext.lat.toFixed(2)}, ${geoQueryContext.lon.toFixed(2)}`
          : promptNodesOnline
            ? "Streaming AI prompts"
            : "Offline atlas beacons"
    },
    {
      label: "Current spot",
      value: currentSpotLabel || "Hover over a light to meet it.",
      hint: currentSpotLabel ? "Where you're looking now" : "Awaiting your gaze"
    },
    {
      label: "Geo scan",
      value: nearbyQuery.isPending ? "Scanning..." : geoQueryContext ? "Free roam active" : "Click the map",
      hint: geoQueryContext
        ? `±${Math.round(geoQueryContext.radiusKm)} km window`
        : "Tap to search by lat/lon"
    },
    {
      label: "Last hop",
      value: lastHopLabel,
      hint: currentSpotLabel ? "Trail of your latest leap" : "Ready when you wander"
    },
    {
      label: "Guide signal",
      value: agentStatusLabel,
      hint: promptNodesOnline ? "Stories streaming" : "Quiet lull"
    },
    {
      label: "Story energy",
      value:
        promptNodesOnline && travelSummary ? travelSummary.energy.average.toFixed(2) : "-",
      hint:
        promptNodesOnline && travelSummary
          ? `${travelSummary.energy.low.toFixed(2)}-${travelSummary.energy.peak.toFixed(2)}`
          : "Offline"
    }
  ];
  const atlasAccentStyle = useMemo(
    () =>
      ({
        "--atlas-accent": detailAccent
      }) as CSSProperties,
    [detailAccent]
  );
  const atlasMemoryCopy = promptNodesOnline
    ? "The map mints procedural beacons wherever you click; nearby nodes keep the atlas coherent."
    : travelDatasetLoading
      ? "The map is recalling your travel stories..."
      : "The static star map is guarding familiar journeys while it waits for new inspiration.";
  const detailItineraryFallback = detailSelectionActive
    ? "Agent warming up - tap refresh to request a layout."
    : "Use the atlas map to choose a place and its story will unfurl here.";
  const providerCopy = promptNodesOnline
    ? "Palette and guide streams prefer OpenRouter; static generators step in when offline."
    : "Offline cache keeps palettes alive until providers come back online.";
  return (
    <div className="view view-world">
      <section className="world-surface">
        <div className="atlas-view-shell" style={atlasAccentStyle}>
          <header className="atlas-header">
            <div>
              <p className="map-hud-kicker">Atlas cockpit / Map console</p>
              <h1>{detailSelectionActive ? guidePanelTitle : "Scattered across the globe"}</h1>
              <p className="map-hud-source">
                {atlasMemoryCopy}
                {contentError && " Content source is offline; switched to local cache."}
              </p>
            </div>
            <div className="atlas-header__status">
              <span className="atlas-header__pill">{mapDestinations.length}+ live beacons</span>
              <span className="atlas-status-indicator">
                <span
                  className={`atlas-status-dot ${isGuideLoading || agentQuery.isFetching ? "is-loading" : "is-ready"}`}
                />
                {agentStatusLabel}
              </span>
            </div>
          </header>
          <div className="atlas-stage">
              <div className="atlas-stage__globe">
                <div className="world-map-panel">
                  <WorldMap
                    destinations={mapDestinations}
                    onSelect={handleSelectDestination}
                    activeSlug={activeWorldDestination.slug}
                    activeDestination={activeWorldDestination}
                    onOpenGuide={openGuide}
                    onCoordinateSelect={handleCoordinateSelect}
                  />
                </div>
                <div className="atlas-globe-caption">
                  <div>
                    <span className="atlas-caption-label">Now focused</span>
                    <strong>{currentSpotLabel || "Scattered across the globe"}</strong>
                  </div>
                  <div>
                    <span className="atlas-caption-label">Last hop</span>
                    <strong>{lastHopLabel}</strong>
                  </div>
                  <div>
                    <span className="atlas-caption-label">Free roam</span>
                    <strong>
                      {nearbyQuery.isPending
                        ? "Scanning nearby..."
                        : geoMatches.length > 0
                          ? `${geoMatches.length} nearby spots`
                          : "Tap map to scout"}
                    </strong>
                    <p className="atlas-caption-subtle">
                      {geoQueryContext
                        ? `Lat ${geoQueryContext.lat.toFixed(2)}, Lon ${geoQueryContext.lon.toFixed(2)} · ±${Math.round(geoQueryContext.radiusKm)} km`
                        : "Click anywhere on the globe to fetch the nearest AI travel prompt."}
                    </p>
                    {geoError && <p className="atlas-caption-error">{geoError}</p>}
                  </div>
                  <div className="atlas-caption-actions">
                    <button className="ghost-btn" type="button" onClick={openSelectedGuide}>
                      Open AI guide
                    </button>
                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={resetGeoScan}
                      disabled={!geoMatches.length && !geoQueryContext && !nearbyQuery.isPending}
                    >
                      Reset map
                    </button>
                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={rescanLastPoint}
                      disabled={!lastQueryCoords || nearbyQuery.isPending}
                    >
                      Rescan
                    </button>
                  </div>
                  <div className="atlas-control-deck">
                    <div className="atlas-control">
                      <div className="atlas-control__label">Scan radius</div>
                      <input
                        type="range"
                        min={50}
                        max={800}
                        step={10}
                        value={searchRadiusKm}
                        onChange={(event) => setSearchRadiusKm(Number(event.target.value))}
                      />
                      <div className="atlas-control__value">{searchRadiusKm} km</div>
                    </div>
                    <div className="atlas-control">
                      <div className="atlas-control__label">Energy floor</div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={minEnergy}
                        onChange={(event) => setMinEnergy(Number(event.target.value))}
                      />
                      <div className="atlas-control__value">{minEnergy.toFixed(2)}</div>
                    </div>
                    <div className="atlas-control atlas-control--pills">
                      <div className="atlas-control__label">Theme filter</div>
                      <div className="atlas-control__pill-row">
                        {(["all", "desert", "seaside", "forest", "mountain", "urban"] as const).map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            className={`pill ${searchTheme === theme ? "pill-active" : "pill-ghost"}`}
                            onClick={() => setSearchTheme(theme)}
                          >
                            {theme === "all" ? "All" : theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <aside className="atlas-stage__panel">
              <div className="atlas-detail-card">
                <span className="atlas-detail-eyebrow">Travel plan / Itinerary</span>
                <h2>{guidePanelTitle}</h2>
                <p className="atlas-detail-copy">{guidePanelSummary}</p>
                {detailSelectionActive && (
                  <div className="atlas-detail-meta">
                    <div className="tag-row muted">
                      {detailMetaAction && <span className="pill pill-muted">{detailMetaAction}</span>}
                      {detailMetaTime && <span className="pill pill-muted">{detailMetaTime}</span>}
                    </div>
                    {detailMetaCue && <p className="subtle">{detailMetaCue}</p>}
                    {detailMetaTags.length > 0 && (
                      <div className="tag-row">
                        {detailMetaTags.slice(0, 4).map((tag) => (
                          <span key={tag} className="pill pill-ghost">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {detailSelectionActive && itineraryPreview.length > 0 ? (
                  <ul className="atlas-detail-itinerary">
                    {itineraryPreview.map((stop) => (
                      <li key={stop.key}>{stop.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="atlas-detail-placeholder">{detailItineraryFallback}</p>
                )}
                <div className="atlas-detail-actions">
                  <button className="primary-btn" type="button" onClick={openSelectedGuide}>
                    Launch AI guide
                  </button>
                  <button className="ghost-btn" type="button" onClick={refreshActiveProfile}>
                    Refresh signals
                  </button>
                </div>
              </div>
              <div className="atlas-provider-strip">
                <div className="atlas-provider-head">
                  <span>Live providers</span>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={refreshTravelPlaces}
                    disabled={travelDatasetRefreshing}
                  >
                    {travelDatasetRefreshing ? "Gathering..." : "Refresh stories"}
                  </button>
                </div>
                <div className="atlas-provider-grid">
                  {providers.length > 0 ? (
                    providers.map((provider) => (
                      <span
                        key={provider.id}
                        className={`atlas-provider-chip ${provider.ready ? "is-ready" : "is-offline"}`}
                      >
                        <span className="atlas-provider-dot" aria-hidden />
                        {provider.label}
                      </span>
                    ))
                  ) : (
                    <span className="atlas-provider-chip is-offline">Static palette generator</span>
                  )}
                </div>
                <p className="atlas-provider-copy">{providerCopy}</p>
              </div>
            </aside>
          </div>
          <div className="atlas-status-grid">
            {atlasStats.map((stat) => (
              <article key={stat.label} className="atlas-status-card">
                <span className="atlas-caption-label">{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.hint}</p>
              </article>
            ))}
            <article className="atlas-status-card atlas-status-card--action">
              <span className="atlas-caption-label">Guide window</span>
              <button className="primary-btn" type="button" onClick={openSelectedGuide}>
                Open guide for {activeWorldDestination.name}
              </button>
            </article>
          </div>
          <div className="atlas-meta-ribbon">
            <div>
              <span className="atlas-caption-label">Atlas memory</span>
              <p>{atlasMemoryCopy}</p>
            </div>
            <div className="atlas-ribbon-tags">
              <div>
                <span className="atlas-caption-label">Cue clusters</span>
                <div className="tag-row">
                  {datasetTagHighlights.length > 0 ? (
                    datasetTagHighlights.map((entry) => (
                      <span key={entry.tag} className="pill pill-ghost">
                        {entry.tag}
                      </span>
                    ))
                  ) : (
                    <span className="subtle">Gathering cue clusters...</span>
                  )}
                </div>
              </div>
              <div>
                <span className="atlas-caption-label">Time windows</span>
                <div className="tag-row">
                  {datasetTimeWindows.length > 0 ? (
                    datasetTimeWindows.map(([label, count]) => (
                      <span key={label} className="pill pill-ghost">
                        {label} · {count}
                      </span>
                    ))
                  ) : (
                    <span className="subtle">Waiting for time cues...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AtlasPlanBoard
            destinationName={activeWorldDestination.name}
            isoCode={activeWorldDestination.iso2}
            regionLabel={activeWorldDestination.region}
            locationLabel={activeLocationLabel}
            guideSummary={activeGuideSummary}
            themeProfile={themeProfile ?? undefined}
            errorMessage={guideErrorMessage}
            travelAction={travelAction}
            travelTimeOfDay={travelTimeOfDay}
            travelSensoryCue={travelSensoryCue}
            travelTags={travelTags}
            paletteAccent={detailAccent}
            itineraryPreview={planBoardItineraryPreview}
            topSights={topSights}
            localIntel={localIntelEntries}
            hiddenGems={hiddenGemEntries}
            isGuideLoading={isGuideLoading}
            onOpenGuide={openSelectedGuide}
          />
        </div>
        <section className="world-intel-panel">
          <div className="intel-header">
            <div>
              <span className="pill pill-muted">{activeWorldDestination.region}</span>
              <span className="pill" style={{ background: detailAccent, color: "#0b1120" }}>
                {activeWorldDestination.iso2}
              </span>
            </div>
            <div className="intel-actions">
              <button className="ghost-btn" type="button" onClick={refreshActiveProfile}>
                Refresh vibe
              </button>
              <button className="primary-btn" type="button" onClick={openSelectedGuide}>
                View full AI guide
              </button>
            </div>
          </div>
          <div className="intel-title">
            <h2>{activeWorldDestination.name}</h2>
            <p>{agentQuery.data?.overview ?? activeWorldDestination.summary}</p>
          </div>
          {travelPrompt && (
            <div className="intel-blueprint" style={{ borderColor: detailAccent }}>
              <div className="intel-blueprint-body">
                <div>
                  <span className="pill pill-muted">AI travel brief</span>
                  <strong>{activeWorldDestination.travelCity ?? activeWorldDestination.name}</strong>
                  <p>{travelAtmosphere ?? travelPrompt}</p>
                </div>
                <div className="intel-blueprint-meta">
                  <div className="tag-row muted">
                    {travelAction && <span className="pill pill-muted">{travelAction}</span>}
                    {travelTimeOfDay && <span className="pill pill-muted">{travelTimeOfDay}</span>}
                  </div>
                  {travelSensoryCue && <p className="subtle">{travelSensoryCue}</p>}
                  {travelTags.length > 0 && (
                    <div className="tag-row">
                      {travelTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="pill pill-ghost">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="blueprint-actions">
                <span className="subtle">
                  {sceneQuery.isFetching ? "Generating postcard..." : "Prompt ready"}
                </span>
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => sceneQuery.refetch()}
                  disabled={sceneQuery.isFetching}
                >
                  {sceneQuery.isFetching ? "Rendering..." : "Generate AI image"}
                </button>
              </div>
            </div>
          )}
        <div className="intel-render" style={{ borderColor: detailAccent, background: detailMuted }}>
          {detailImage ? (
            <img src={detailImage} alt={`${activeWorldDestination.name} AI render`} loading="lazy" />
          ) : (
            <div className="world-preview-placeholder">Brewing atlas tile...</div>
          )}
          <div className="intel-render-meta">
            <span className="pill pill-muted">AI render</span>
            <div>
              <strong>{activeWorldDestination.name} visual pass</strong>
              <p>Generated from the live prompt seed to match today&apos;s vibe.</p>
            </div>
          </div>
        </div>
        <div className="intel-sights">
          {spotlightSights.length === 0 && <p className="subtle">Sourcing micro-sights...</p>}
          {spotlightSights.map((sight) => (
            <div key={sight.title} className="intel-sight-card">
              <div>
                <strong>{sight.title}</strong>
                <p className="subtle">{sight.why_go}</p>
              </div>
              <span>{sight.best_time}</span>
            </div>
          ))}
        </div>
        <div className="intel-plan">
          <div>
            <span className="pill pill-muted">AI plan</span>
            <strong>{primaryItinerary?.title ?? "Plan preview"}</strong>
          </div>
          {seasonality && (
            <div className="intel-season">
              <span>{seasonality.season}</span>
              <p>{seasonality.weather}</p>
            </div>
          )}
        </div>
          {itineraryStops.length > 0 ? (
            <ol className="intel-plan-steps">
              {itineraryStops.slice(0, 6).map((stop, index) => (
                <li key={buildStopKey(stop, index)}>{summarizeItineraryStop(stop)}</li>
              ))}
            </ol>
          ) : (
            <p className="subtle">Tap a glowing pin to draft a tailored route.</p>
          )}
          {foodHighlights.length > 0 && (
            <div className="intel-food">
              <span className="pill pill-muted">Taste radar</span>
              <div className="intel-food-grid">
                {foodHighlights.slice(0, 3).map((item) => (
                  <div key={item.dish}>
                    <strong>{item.dish}</strong>
                    <p className="subtle">{item.where_to_try}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="intel-guides">
            {guideBlocks.map(
              (block) =>
                block.entries.length > 0 && (
                  <div key={block.title} className="intel-guide-block">
                    <div className="intel-guide-heading">
                      <strong>{block.title}</strong>
                      <span>{block.subtitle}</span>
                    </div>
                    <ul>
                      {block.entries.slice(0, 3).map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </section>
      </section>
      <section className="world-discover-panel">
        {contentLoading && <p className="loading-state inline">Gathering discovery feed...</p>}
        {contentError && (
          <p className="error-state inline">Unable to load discovery feed; offline mode active.</p>
        )}
        {!contentLoading && !contentError && (
          <DiscoverExplorer destinations={discoverDestinations} />
        )}
      </section>
    </div>
  );
}
