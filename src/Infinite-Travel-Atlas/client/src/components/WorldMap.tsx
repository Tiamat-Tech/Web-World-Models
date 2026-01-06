import clsx from "clsx";
import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";

const DEFAULT_SWATCH = {
  accent: "#38bdf8",
  glow: "rgba(56, 189, 248, 0.35)"
};

const BIOME_SWATCHES: Record<string, { accent: string; glow: string }> = {
  desert: { accent: "#f97316", glow: "rgba(249, 115, 22, 0.35)" },
  atlas: { accent: "#facc15", glow: "rgba(250, 204, 21, 0.28)" },
  oasis: { accent: "#fcd34d", glow: "rgba(252, 211, 77, 0.24)" },
  island: { accent: "#34d399", glow: "rgba(52, 211, 153, 0.32)" },
  coral: { accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.32)" },
  seaside: { accent: "#0ea5e9", glow: "rgba(14, 165, 233, 0.3)" },
  urban: { accent: "#f472b6", glow: "rgba(244, 114, 182, 0.3)" },
  alpine: { accent: "#a78bfa", glow: "rgba(167, 139, 250, 0.32)" },
  coast: { accent: "#2563eb", glow: "rgba(37, 99, 235, 0.32)" },
  onsen: { accent: "#fb7185", glow: "rgba(251, 113, 133, 0.28)" },
  rainforest: { accent: "#22c55e", glow: "rgba(34, 197, 94, 0.34)" },
  "cloud forest": { accent: "#16a34a", glow: "rgba(22, 163, 74, 0.32)" },
  wildlife: { accent: "#10b981", glow: "rgba(16, 185, 129, 0.34)" },
  harbor: { accent: "#0ea5e9", glow: "rgba(14, 165, 233, 0.28)" },
  garden: { accent: "#84cc16", glow: "rgba(132, 204, 22, 0.26)" },
  "boreal forest": { accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.28)" },
  aurora: { accent: "#c084fc", glow: "rgba(192, 132, 252, 0.35)" },
  tundra: { accent: "#14b8a6", glow: "rgba(20, 184, 166, 0.3)" },
  fjords: { accent: "#60a5fa", glow: "rgba(96, 165, 250, 0.32)" },
  mountain: { accent: "#6366f1", glow: "rgba(99, 102, 241, 0.32)" },
  "salt flat": { accent: "#fbbf24", glow: "rgba(251, 191, 36, 0.3)" },
  altiplano: { accent: "#ec4899", glow: "rgba(236, 72, 153, 0.3)" },
  amazon: { accent: "#16a34a", glow: "rgba(22, 163, 74, 0.34)" },
  cerrado: { accent: "#4ade80", glow: "rgba(74, 222, 128, 0.3)" }
};

function getBiomeSwatch(destination: WorldDestinationMeta) {
  for (const tag of destination.biomeTags) {
    const key = tag.toLowerCase();
    if (BIOME_SWATCHES[key]) {
      return BIOME_SWATCHES[key];
    }
  }
  return DEFAULT_SWATCH;
}

type MapDestination = WorldDestinationMeta & Partial<TravelAugmentedDestination>;

interface HoveredNode {
  destination: MapDestination;
  position: { left: string; top: string };
}

interface WorldMapProps {
  destinations: MapDestination[];
  activeSlug?: string;
  activeDestination?: WorldDestinationMeta;
  onSelect: (destination: WorldDestinationMeta) => void;
  onOpenGuide?: (destination: WorldDestinationMeta) => void;
  onCoordinateSelect?: (coords: { lat: number; lon: number }) => void;
}

function projectToPercentages([lat, lon]: [number, number]) {
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

function getBeaconScale(destination: MapDestination) {
  if ("travelBeaconSize" in destination) {
    const value = Number(
      (destination as WorldDestinationMeta & { travelBeaconSize?: number }).travelBeaconSize ?? 1
    );
    if (Number.isFinite(value) && value > 0) {
      return Math.min(Math.max(value, 0.6), 1.4);
    }
  }
  return 1;
}

function buildLocationLabel(destination: MapDestination) {
  const travelLocation = [destination.travelCity, destination.travelCountry]
    .filter(Boolean)
    .join(", ");
  if (travelLocation) {
    return travelLocation;
  }
  if (destination.region) {
    return destination.region;
  }
  return destination.iso2;
}

function trimPrompt(prompt?: string, fallback?: string) {
  const source = prompt ?? fallback ?? "";
  if (source.length <= 160) {
    return source;
  }
  return `${source.slice(0, 157).trim()}…`;
}

function hasTravelDataset(destination: MapDestination) {
  return Boolean(destination.travelPrompt || destination.travelCity || destination.travelTags?.length);
}

function formatDistance(destination: MapDestination) {
  if (destination.geoDistanceKm === undefined) {
    return "";
  }
  if (destination.geoDistanceKm < 1) {
    return "<1 km away";
  }
  if (destination.geoDistanceKm < 100) {
    return `${destination.geoDistanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(destination.geoDistanceKm)} km away`;
}

function formatTheme(destination: MapDestination) {
  if (!destination.travelTheme) {
    return "";
  }
  return destination.travelTheme;
}

export function WorldMap({
  destinations,
  onSelect,
  activeSlug,
  activeDestination,
  onOpenGuide,
  onCoordinateSelect
}: WorldMapProps) {
  const activeSwatch = activeDestination ? getBiomeSwatch(activeDestination) : DEFAULT_SWATCH;
  const mapStyle = {
    "--map-accent": activeSwatch.accent,
    "--map-glow": activeSwatch.glow
  } as CSSProperties;
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);

  const handleClearHover = () => setHoveredNode(null);
  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onCoordinateSelect) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest("button.world-node")) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width;
    const yRatio = (event.clientY - rect.top) / rect.height;
    const lon = xRatio * 360 - 180;
    const lat = 90 - yRatio * 180;
    onCoordinateSelect({ lat, lon });
  };
  return (
    <div
      className="world-map"
      role="img"
      aria-label="Interactive map of clickable destinations"
      style={mapStyle}
      onClick={handleMapClick}
    >
      <div className="world-map-grid" aria-hidden />
      <div className="world-map-ocean" aria-hidden />
      {destinations.map((destination) => {
        const style = projectToPercentages(destination.latlng);
        const swatch = getBiomeSwatch(destination);
        const beaconScale = getBeaconScale(destination);
        const ringSize = 26 * beaconScale;
        const coreSize = 10 + beaconScale * 6;
        const pinStyle = {
          ...style,
          "--node-accent": destination.travelColorway ?? swatch.accent,
          "--node-glow": swatch.glow,
          "--node-ring-size": `${ringSize}px`,
          "--node-core-size": `${coreSize}px`
        } as CSSProperties;
        const isActive = destination.slug === activeSlug;
        const hasDataset = hasTravelDataset(destination);
        return (
          <button
            key={destination.slug}
            className={clsx("world-node", {
              active: isActive,
              "world-node--live": hasDataset
            })}
            style={pinStyle}
            aria-label={`Open travel plan for ${destination.name}`}
            onClick={() => onSelect(destination)}
            onDoubleClick={(event) => {
              event.preventDefault();
              onOpenGuide?.(destination);
            }}
            onMouseEnter={() =>
              setHoveredNode({
                destination,
                position: style
              })
            }
            onMouseLeave={handleClearHover}
            onFocus={() =>
              setHoveredNode({
                destination,
                position: style
              })
            }
            onBlur={handleClearHover}
            type="button"
          >
            <span className="world-node-ring" aria-hidden />
            <span className="world-node-core" aria-hidden />
            <span className="sr-only">{destination.name}</span>
          </button>
        );
      })}
      {hoveredNode && (
        <div
          className="world-node-tooltip"
          style={hoveredNode.position as CSSProperties}
          role="status"
        >
          <span className="world-node-tooltip__eyebrow">{buildLocationLabel(hoveredNode.destination)}</span>
          <strong>{hoveredNode.destination.name}</strong>
          {hoveredNode.destination.geoDistanceKm !== undefined && (
            <span className="pill pill-muted">{formatDistance(hoveredNode.destination)}</span>
          )}
          {formatTheme(hoveredNode.destination) && (
            <span className="pill pill-muted">{formatTheme(hoveredNode.destination)}</span>
          )}
          <p>{trimPrompt(hoveredNode.destination.travelPrompt, hoveredNode.destination.summary)}</p>
        </div>
      )}
    </div>
  );
}
