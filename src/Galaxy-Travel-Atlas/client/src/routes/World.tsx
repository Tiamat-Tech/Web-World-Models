import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAppContent } from "../hooks/useAppContent";
import { useThemeController } from "../context/ThemeContext";
import { useWorldTravel } from "../context/WorldTravelContext";
import { useGuideNavigation } from "../hooks/useGuideNavigation";
import type { AgentHiddenGem, AgentItineraryStop, GalaxyPlanetIntel, ThemeProfile } from "../types";
import { WorldMap } from "../components/WorldMap";
import { DiscoverExplorer } from "../components/DiscoverExplorer";
import { MapGuideWindow } from "../components/MapGuideWindow";
import { AtlasPlanBoard } from "../components/AtlasPlanBoard";
import { AtlasModeToggle } from "../components/AtlasModeToggle";
import { WORLD_DESTINATIONS } from "../data/worldDestinations";
import { pickTheme } from "../utils/themePicker";
import { generateAgentContent } from "../api/agent";
import { requestTheme } from "../api/themes";
import { requestSceneImage, type SceneImage } from "../api/scenes";
import { requestGalaxyIntel } from "../api/galaxy";
import { buildImageFromPrompt, buildTravelImagePrompt } from "../utils/imagePrompt";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";
import { buildThemeRequestForDestination } from "../utils/themeRequest";
import { useAtlasMode } from "../context/AtlasModeContext";
import { generateGalaxyWorlds, type GalaxyWorld } from "../galaxy/universe";

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
  const { mode } = useAtlasMode();
  const isGalaxyMode = mode === "galaxy";
  const { data: appContent, isLoading: contentLoading, error: contentError } = useAppContent();
  const { requestVibe, providers, isVibeLoading } = useThemeController();
  const {
    augmentedPlaces,
    summary: travelSummary,
    isLoading: travelDatasetLoading,
    isRefreshing: travelDatasetRefreshing,
    refresh: refreshTravelPlaces
  } = useWorldTravel();
  const [galaxySeed, setGalaxySeed] = useState<string>("atlas-core");
  const themeCacheRef = useRef(new Map<string, ThemeProfile>());
  const sceneCacheRef = useRef(new Map<string, SceneImage>());
  const navigate = useNavigate();
  const { openGuide } = useGuideNavigation();
  const fallbackDestinations = useMemo<TravelAugmentedDestination[]>(
    () => WORLD_DESTINATIONS.map((destination) => ({ ...destination })),
    []
  );
  const galaxyDestinations = useMemo<GalaxyWorld[]>(() => generateGalaxyWorlds(galaxySeed), [galaxySeed]);
  const promptDestinations = augmentedPlaces;
  const mapDestinations: TravelAugmentedDestination[] = isGalaxyMode
    ? galaxyDestinations
    : promptDestinations.length > 0
      ? promptDestinations
      : fallbackDestinations;
  const promptNodesOnline = isGalaxyMode ? galaxyDestinations.length > 0 : promptDestinations.length > 0;
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
    !isGalaxyMode && promptNodesOnline && travelSummary?.topTags
      ? travelSummary.topTags.slice(0, 4)
      : [];
  const datasetTimeWindows =
    !isGalaxyMode && promptNodesOnline && travelSummary?.timeOfDay
      ? Object.entries(travelSummary.timeOfDay)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
      : [];
  const planetDensityRatio = Math.max(0, Math.min(mapDestinations.length / 320, 1));
  const filledDensityDots = Math.min(6, Math.max(2, Math.round(planetDensityRatio * 6)));
  const planetDensityLabel =
    planetDensityRatio < 0.33 ? "Sparse drift" : planetDensityRatio < 0.66 ? "Gathering bloom" : "Dense signal belt";

  const mapHudKicker = isGalaxyMode ? "OpenOuter orrery · mission board" : "Atlas cockpit · travel desk";
  const heroHeading = isGalaxyMode
    ? "Traverse the Galaxy Travel Atlas."
    : "Let the atlas glide beneath your fingertips.";
  const heroDescription = isGalaxyMode
    ? "Every glowing world comes from a deterministic seed. Hover to read its physics, drag to pan through the cluster, and click to summon the OpenOuter agent for a typed mission brief."
    : "Drag to drift across continents, hover for a quiet orbit preview, and click to open a living story seeded by the OpenRouter agent.";
  const heroSourceCopy = isGalaxyMode
    ? promptNodesOnline
      ? "Structural seeds stay fixed; OpenRouter layers narrative when relays are live."
      : "Structural seeds stay fixed even offline—every anchor remains clickable."
    : promptNodesOnline
      ? "Signals are warm; move the map and new briefs surface in real time."
      : "Offline cache keeps the atlas breathing even without live prompts.";
  const consoleStatusCopy = isGalaxyMode
    ? promptNodesOnline
      ? "OpenOuter relays are live; cached fallbacks keep every orbit populated."
      : travelDatasetLoading
        ? "Sequencing anchors from the current seed…"
        : "Static generators are holding the lanes until live relays return."
    : promptNodesOnline
      ? "OpenRouter keeps your itineraries warm; drifting the map coaxes out fresh cues."
      : travelDatasetLoading
        ? "Refreshing cached travel threads…"
        : "Static routes are on watch until live data returns.";
  const glowingPathsCaption = isGalaxyMode ? "Threaded across the seeded cluster" : "Scattered across the globe";
  const guideSignalCaption = promptNodesOnline
    ? isGalaxyMode
      ? "Mission briefs streaming"
      : "Stories streaming"
    : isGalaxyMode
      ? "Signal drift"
      : "Quiet lull";

  const activeTheme = activeWorldDestination.travelTheme ?? pickTheme(activeWorldDestination);
  const activeLanguage = activeWorldDestination.defaultLanguage ?? "en";
  const travelPrompt = activeWorldDestination.travelPrompt;
  const travelHeadline = activeWorldDestination.travelHeadline ?? activeWorldDestination.summary;
  const travelAtmosphere = activeWorldDestination.travelAtmosphere ?? travelPrompt;
  const travelTags = activeWorldDestination.travelTags ?? [];
  const travelAction = activeWorldDestination.travelAction;
  const travelTimeOfDay = activeWorldDestination.travelTimeOfDay;
  const travelSensoryCue = activeWorldDestination.travelSensoryCue;
  const structuralTags = isGalaxyMode
    ? [
        activeWorldDestination.systemName,
        activeWorldDestination.sectorName,
        activeWorldDestination.worldBiome,
        activeWorldDestination.riskProfile
      ].filter(Boolean) as string[]
    : travelTags;
  const riskProfile = activeWorldDestination.riskProfile;
  const signalTagline = activeWorldDestination.signalTagline;
  const isAnchorNode = Boolean(activeWorldDestination.anchor);
  const activeThemeRequest = buildThemeRequestForDestination(activeWorldDestination);
  const themeCacheKey = activeThemeRequest?.destinationId ?? activeThemeRequest?.travelNodeId ?? null;

  const agentQuery = useQuery({
    queryKey: ["world-active-agent", mode, activeWorldDestination.iso2, activeTheme, activeLanguage],
    queryFn: () =>
      generateAgentContent({
        name: activeWorldDestination.name,
        iso2: activeWorldDestination.iso2,
        theme: activeTheme,
        language: activeLanguage
      }),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(activeWorldDestination) && !isGalaxyMode
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

  const planetIntelPayload = useMemo(() => {
    if (!isGalaxyMode || !activeWorldDestination.structuralHash) {
      return null;
    }
    return {
      system: activeWorldDestination.systemName ?? activeWorldDestination.region,
      world: activeWorldDestination.name,
      region: activeWorldDestination.region,
      sector: activeWorldDestination.sectorName ?? activeWorldDestination.region,
      location: activeWorldDestination.worldBiome,
      travelStyle: activeWorldDestination.riskProfile,
      basePrompt:
        activeWorldDestination.structuralPrompt ??
        activeWorldDestination.travelPrompt ??
        activeWorldDestination.summary
    };
  }, [
    activeWorldDestination.name,
    activeWorldDestination.region,
    activeWorldDestination.riskProfile,
    activeWorldDestination.sectorName,
    activeWorldDestination.structuralHash,
    activeWorldDestination.structuralPrompt,
    activeWorldDestination.summary,
    activeWorldDestination.systemName,
    activeWorldDestination.travelPrompt,
    activeWorldDestination.worldBiome,
    isGalaxyMode
  ]);

  const planetIntelQuery = useQuery({
    queryKey: [
      "galaxy-planet-intel",
      galaxySeed,
      planetIntelPayload?.system,
      planetIntelPayload?.world,
      planetIntelPayload?.sector,
      planetIntelPayload?.location
    ],
    queryFn: () => {
      if (!planetIntelPayload) {
        throw new Error("Missing planet context");
      }
      return requestGalaxyIntel(planetIntelPayload);
    },
    staleTime: 1000 * 60 * 30,
    enabled: isGalaxyMode && Boolean(planetIntelPayload)
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
  const signalReady = isGalaxyMode
    ? !(planetIntelQuery.isFetching || planetIntelQuery.isPending || isVibeLoading)
    : !(agentQuery.isFetching || agentQuery.isPending || isVibeLoading);

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
  const galaxyIntel: GalaxyPlanetIntel | undefined = planetIntelQuery.data;
  const missionStops: AgentItineraryStop[] = isGalaxyMode
    ? [
        galaxyIntel?.missionHook ? { title: "Mission", description: galaxyIntel.missionHook } : null,
        galaxyIntel?.terrain ? { title: "Terrain", description: galaxyIntel.terrain } : null,
        galaxyIntel?.sky ? { title: "Sky", description: galaxyIntel.sky } : null,
        galaxyIntel?.signal ? { title: "Signal", description: galaxyIntel.signal } : null
      ].filter(Boolean) as AgentItineraryStop[]
    : [];
  const topSights = isGalaxyMode ? [] : agentQuery.data?.top_sights ?? [];
  const spotlightSights = isGalaxyMode ? [] : topSights.slice(0, 3);
  const primaryItinerary = isGalaxyMode
    ? missionStops.length > 0
      ? { title: "Recon checklist", stops: missionStops }
      : undefined
    : agentQuery.data?.itineraries?.[0];
  const hiddenGemEntries = useMemo(
    () => (isGalaxyMode ? galaxyIntel?.hazards ?? [] : normalizeHiddenGems(agentQuery.data?.hidden_gems ?? [])),
    [agentQuery.data?.hidden_gems, galaxyIntel?.hazards, isGalaxyMode]
  );

  const guideBlocks = (
    isGalaxyMode
      ? [
          {
            title: "Mission",
            subtitle: "Primary objective",
            entries: [galaxyIntel?.missionHook]
          },
          {
            title: "Hazards",
            subtitle: "Risk profile",
            entries: galaxyIntel?.hazards ?? []
          },
          {
            title: "Signal and sky",
            subtitle: "Telemetry",
            entries: [galaxyIntel?.signal, galaxyIntel?.sky]
          }
        ]
      : [
          {
            title: "Local intel",
            subtitle: "Local notes",
            entries:
              agentQuery.data?.local_tips ??
              (activeWorldDestination.summary ? [activeWorldDestination.summary] : [])
          },
          {
            title: "Hidden gems",
            subtitle: "Hidden spots",
            entries: hiddenGemEntries
          },
          {
            title: "Safety signals",
            subtitle: "Safety",
            entries: agentQuery.data?.safety ?? []
          }
        ]
  ).map((block) => ({
    ...block,
    entries: (block.entries ?? []).filter(Boolean)
  }));
  const isGuideLoading = isGalaxyMode
    ? planetIntelQuery.isFetching || (!planetIntelQuery.data && planetIntelQuery.isPending)
    : (!agentQuery.data && agentQuery.isPending) || agentQuery.isFetching;
  const foodHighlights = isGalaxyMode ? [] : agentQuery.data?.food_highlights ?? [];
  const seasonality = isGalaxyMode ? undefined : agentQuery.data?.seasonality?.[0];
  const itineraryStops = primaryItinerary?.stops ?? missionStops ?? [];
  const itineraryPreview = itineraryStops.slice(0, 3).map((stop, index) => ({
    key: buildStopKey(stop, index),
    label: summarizeItineraryStop(stop)
  }));
  const planBoardItineraryPreview = itineraryStops.slice(0, 5).map((stop, index) => ({
    key: `${buildStopKey(stop, index)}-plan`,
    label: summarizeItineraryStop(stop)
  }));
  const guideSummaryText =
    (isGalaxyMode ? galaxyIntel?.summary : agentQuery.data?.overview) ??
    guideWindowDestination?.travelHeadline ??
    guideWindowDestination?.summary ??
    travelHeadline ??
    travelPrompt ??
    activeWorldDestination.summary;
  const activeGuideSummary =
    (isGalaxyMode ? galaxyIntel?.summary : agentQuery.data?.overview) ??
    activeWorldDestination.travelHeadline ??
    activeWorldDestination.summary ??
    travelHeadline ??
    travelPrompt;
  const localIntelEntries = isGalaxyMode
    ? ([galaxyIntel?.missionHook, galaxyIntel?.signal].filter(Boolean) as string[])
    : agentQuery.data?.local_tips ?? [];
  const guideWindowLocationLabel = [guideWindowDestination?.travelCity, guideWindowDestination?.travelCountry]
    .filter(Boolean)
    .join(", ") || undefined;
  const activeLocationLabel =
    [activeWorldDestination.travelCity, activeWorldDestination.travelCountry].filter(Boolean).join(", ") ||
    activeWorldDestination.region;
  const guideWindowPrompt =
    guideWindowDestination?.travelPrompt ??
    guideWindowDestination?.travelAtmosphere ??
    guideWindowDestination?.summary;
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
  const currentSpotHelper = currentSpotLabel
    ? isGalaxyMode
      ? "Where your sensors are focused"
      : "Where you're looking now"
    : isGalaxyMode
      ? "Awaiting your scan"
      : "Awaiting your gaze";
  const lastHopHelper = currentSpotLabel
    ? isGalaxyMode
      ? "Trail of your latest jump"
      : "Trail of your latest leap"
    : isGalaxyMode
      ? "Awaiting your first jump"
      : "Waiting for your first leap";

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

  const refreshActiveProfile = () => {
    if (isGalaxyMode) {
      planetIntelQuery.refetch();
      return;
    }
    agentQuery.refetch();
    if (activeThemeRequest) {
      themeQuery.refetch();
      requestVibe(activeThemeRequest).catch(() => {
        /* ignore */
      });
    }
  };

  const reseedGalaxy = () => {
    const nextSeed = `seed-${Math.random().toString(36).slice(2, 8)}`;
    setGalaxySeed(nextSeed);
  };

  const closeGuideWindow = () => {
    setGuideWindowDestination(null);
  };

  const openPlannerWindow = () => {
    const plannerUrl = "/planner";
    if (typeof window !== "undefined" && window?.open) {
      window.open(plannerUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(plannerUrl);
    }
  };

  const openGuideForDestination = (destination: TravelAugmentedDestination) => {
    const state =
      destination.worldKind === "galaxy"
        ? { mode: "galaxy", galaxySeed, structuralHash: destination.structuralHash }
        : undefined;
    openGuide(destination, state ? { state } : undefined);
  };

  const openSelectedGuide = () => {
    openGuideForDestination(activeWorldDestination);
  };

  const discoverDestinations = appContent?.destinations ?? [];
  return (
    <div className="view view-world">
      <section className="world-surface">
        <div className="atlas-cockpit-block">
          <div className="atlas-cockpit-header">
            <div className="atlas-cockpit-copy">
              <div className="atlas-cockpit-topline">
                <p className="map-hud-kicker">{mapHudKicker}</p>
                <AtlasModeToggle />
              </div>
              <h1>{heroHeading}</h1>
              <p>{heroDescription}</p>
              <p className="map-hud-source">
                {heroSourceCopy}
                {contentError && " Content source is resting; offline caches are active."}
              </p>
            </div>
            <div className="atlas-provider-panel">
              <span className="atlas-provider-label">Live providers</span>
              <div className="map-provider-list">
                {providers.map((provider) => (
                  <span
                    key={provider.id}
                    className={`map-provider ${provider.ready ? "ready" : ""}`}
                  >
                    <span className="map-provider-dot" aria-hidden />
                    {provider.label}
                  </span>
                ))}
                {providers.length === 0 && (
                  <span className="map-provider offline">probing providers…</span>
                )}
              </div>
            </div>
          </div>
          <div className="atlas-map-plane">
            <div className="world-map-panel">
              <WorldMap
                destinations={mapDestinations}
                onSelect={handleSelectDestination}
                activeSlug={activeWorldDestination.slug}
                activeDestination={activeWorldDestination}
                onOpenGuide={openGuideForDestination}
                variant={isGalaxyMode ? "galaxy" : "earth"}
              />
            </div>
          </div>
          {guideWindowDestination && (
            <MapGuideWindow
              destinationName={guideWindowDestination.name}
              regionLabel={guideWindowDestination.region}
              isoCode={guideWindowDestination.iso2}
              locationLabel={guideWindowLocationLabel}
              guideSummary={guideSummaryText}
              prompt={guideWindowPrompt}
              tags={guideWindowDestination.travelTags}
              actionLabel={guideWindowDestination.travelAction}
              timeOfDayLabel={guideWindowDestination.travelTimeOfDay}
              sensoryCue={guideWindowDestination.travelSensoryCue}
              signalTagline={guideWindowDestination.signalTagline}
              variant={isGalaxyMode ? "galaxy" : "travel"}
              itineraryPreview={itineraryPreview}
              isGuideLoading={isGuideLoading}
              onClose={closeGuideWindow}
              onOpenGuide={() => guideWindowDestination && openGuideForDestination(guideWindowDestination)}
              onOpenPlanner={openPlannerWindow}
            />
          )}
          <div className="atlas-console">
            <div className="atlas-console-status">
              <span className="pill pill-muted">Atlas memory</span>
              <div>
                <strong>Whispering map archive</strong>
                <p>{consoleStatusCopy}</p>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={isGalaxyMode ? reseedGalaxy : refreshTravelPlaces}
                disabled={!isGalaxyMode && travelDatasetRefreshing}
              >
                {isGalaxyMode ? "Reseed galaxy" : travelDatasetRefreshing ? "Gathering…" : "Refresh stories"}
              </button>
            </div>
            <div className="map-telemetry">
              <div className="map-chip">
                <div className="map-chip__label">STAR LANES</div>
                <div className="map-chip__value">
                  <span className="map-chip__orbit" aria-hidden />
                  <span>{glowingPathsCaption}</span>
                </div>
                <p className="map-chip__hint">Every glowing planet listens for your signal.</p>
              </div>
              <div className="map-chip">
                <div className="map-chip__label">CURRENT WORLD</div>
                <div className="map-chip__value">
                  <span className="map-chip__pulse ready" aria-hidden />
                  <span>{currentSpotLabel || "Hover over a light to meet it."}</span>
                </div>
                <p className="map-chip__hint">{currentSpotHelper}</p>
              </div>
              <div className="map-chip">
                <div className="map-chip__label">LAST SIGNAL</div>
                <div className="map-chip__value">
                  <span className="map-chip__trail" aria-hidden />
                  <span>{lastHopLabel}</span>
                </div>
                <p className="map-chip__hint">{lastHopHelper}</p>
              </div>
              <div className="map-chip map-chip--density">
                <div className="map-chip__label">PLANET DENSITY</div>
                <div className="map-chip__value">
                  <div className="density-meter" aria-hidden>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <span
                        key={index}
                        className={`density-meter__dot ${index < filledDensityDots ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                  <span>{planetDensityLabel}</span>
                </div>
                <p className="map-chip__hint">From sparse edges to a thick inner bloom.</p>
              </div>
              {isGalaxyMode && (
                <div className="map-chip">
                  <div className="map-chip__label">GALAXY SEED</div>
                  <div className="map-chip__value">
                    <span className="map-chip__trail" aria-hidden />
                    <span>{galaxySeed}</span>
                  </div>
                  <p className="map-chip__hint">Reseed to jump to a new deterministic layout.</p>
                  <button className="ghost-btn map-chip__action" type="button" onClick={reseedGalaxy}>
                    New seed
                  </button>
                </div>
              )}
              <div className="map-chip map-chip--signal">
                <div className="map-chip__label">OPENOUTER SIGNAL</div>
                <div className="map-chip__value">
                  <span className={`map-chip__pulse ${signalReady ? "ready" : ""}`} aria-hidden />
                  <span>{signalReady ? "Channel open" : "Gathering"}</span>
                </div>
                <p className="map-chip__hint">{guideSignalCaption}</p>
                <button className="ghost-btn map-chip__action" type="button" onClick={openSelectedGuide}>
                  Open guide for {activeWorldDestination.name}
                </button>
              </div>
            </div>
            {promptNodesOnline && (
              <div className="atlas-console-tags">
                <span className="map-stat-label">Cue clusters</span>
                <div className="tag-row">
                  {datasetTagHighlights.length > 0 ? (
                    datasetTagHighlights.map((entry) => (
                      <span key={entry.tag} className="pill pill-ghost">
                        {entry.tag}
                      </span>
                    ))
                  ) : (
                    <span className="subtle">Gathering cue clusters…</span>
                  )}
                </div>
              </div>
            )}
            {promptNodesOnline && datasetTimeWindows.length > 0 && (
              <div className="atlas-console-tags">
                <span className="map-stat-label">Time windows</span>
                <div className="tag-row">
                  {datasetTimeWindows.map(([label, count]) => (
                    <span key={label} className="pill pill-ghost">
                      {label} · {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <AtlasPlanBoard
            destinationName={activeWorldDestination.name}
            isoCode={activeWorldDestination.iso2}
            regionLabel={activeWorldDestination.region}
            locationLabel={activeLocationLabel}
            guideSummary={activeGuideSummary}
            themeProfile={themeProfile ?? undefined}
            travelPrompt={travelPrompt ?? travelAtmosphere ?? travelHeadline}
            travelAction={travelAction}
            travelTimeOfDay={travelTimeOfDay}
            travelSensoryCue={isGalaxyMode ? signalTagline ?? travelSensoryCue : travelSensoryCue}
            travelTags={isGalaxyMode ? structuralTags : travelTags}
            structuralTags={structuralTags}
            paletteAccent={detailAccent}
            itineraryPreview={planBoardItineraryPreview}
            topSights={topSights}
            localIntel={localIntelEntries}
            hiddenGems={hiddenGemEntries}
            isGuideLoading={isGuideLoading}
            variant={isGalaxyMode ? "galaxy" : "travel"}
            missionHook={galaxyIntel?.missionHook}
            hazards={isGalaxyMode ? galaxyIntel?.hazards ?? [] : []}
            signal={isGalaxyMode ? galaxyIntel?.signal ?? signalTagline : undefined}
            sky={isGalaxyMode ? galaxyIntel?.sky : undefined}
            terrain={isGalaxyMode ? galaxyIntel?.terrain : undefined}
            riskProfile={riskProfile}
            isAnchor={isAnchorNode}
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
                {sceneQuery.isFetching ? "Generating postcard…" : "Prompt ready"}
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
            <div className="world-preview-placeholder">Brewing atlas tile…</div>
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
          {spotlightSights.length === 0 && <p className="subtle">Sourcing micro-sights…</p>}
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
        {contentLoading && <p className="loading-state inline">Gathering discovery feed…</p>}
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
