import clsx from "clsx";
import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";

type WorldMapVariant = "earth" | "galaxy";

const DEFAULT_SWATCH = {
  accent: "#38bdf8",
  glow: "rgba(56, 189, 248, 0.35)"
};

const BIOME_SWATCHES: Record<string, { accent: string; glow: string }> = {
  desert: { accent: "#f97316", glow: "rgba(249, 115, 22, 0.35)" },
  atlas: { accent: "#facc15", glow: "rgba(250, 204, 21, 0.28)" },
  oasis: { accent: "#fcd34d", glow: "rgba(252, 211, 77, 0.24)" },
  stormglass: { accent: "#60a5fa", glow: "rgba(96, 165, 250, 0.35)" },
  "slag harbor": { accent: "#f472b6", glow: "rgba(244, 114, 182, 0.32)" },
  voidreef: { accent: "#22c55e", glow: "rgba(34, 197, 94, 0.32)" },
  "ember dunes": { accent: "#f97316", glow: "rgba(249, 115, 22, 0.34)" },
  "halo anchor": { accent: "#a855f7", glow: "rgba(168, 85, 247, 0.34)" },
  "frost delta": { accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.34)" },
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
  variant?: WorldMapVariant;
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashToUnit(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function projectToGalaxyPlacement(destination: MapDestination, index: number) {
  const structuralPosition = (destination as Partial<TravelAugmentedDestination>).structuralPosition;
  if (structuralPosition) {
    const left = clamp(50 + structuralPosition.x * 48, 4, 96);
    const top = clamp(50 + structuralPosition.y * 48, 4, 96);
    const depth = clamp(0.42 + hashToUnit(`${destination.slug}-depth`) * 0.5, 0.28, 0.95);
    const driftX = (hashToUnit(`${destination.slug}-dx`) - 0.5) * 18;
    const driftY = (hashToUnit(`${destination.slug}-dy`) - 0.5) * 14;
    const driftZ = 8 + hashToUnit(`${destination.slug}-dz`) * 10;
    const driftDuration = 12 + hashToUnit(`${destination.slug}-dur`) * 10;
    const driftDelay = hashToUnit(`${destination.slug}-delay`) * 3;
    const tilt =
      (Math.atan2(structuralPosition.y, structuralPosition.x) * 180) / Math.PI +
      hashToUnit(`${destination.slug}-t`) * 28;
    return {
      left: `${left}%`,
      top: `${top}%`,
      depth,
      driftX,
      driftY,
      driftZ,
      driftDuration,
      driftDelay,
      tilt
    };
  }

  const seed = destination.slug || destination.iso2 || `node-${index}`;
  const goldenAngle = 2.39996322972865332;
  const baseIndex = index + 1;
  const radius = 3 + Math.sqrt(baseIndex) * 2.6 + hashToUnit(`${seed}-r`) * 2.4;
  const angle = baseIndex * goldenAngle + hashToUnit(`${seed}-a`) * Math.PI * 2;
  const verticalBend = 0.7 + hashToUnit(`${seed}-v`) * 0.18;
  const left = clamp(50 + Math.cos(angle) * radius * 0.85, 4, 96);
  const top = clamp(50 + Math.sin(angle) * radius * verticalBend, 4, 96);
  const depth = clamp(0.38 + hashToUnit(`${seed}-d`) * 0.55, 0.28, 0.95);
  const driftX = (hashToUnit(`${seed}-dx`) - 0.5) * 28;
  const driftY = (hashToUnit(`${seed}-dy`) - 0.5) * 20;
  const driftZ = 10 + hashToUnit(`${seed}-dz`) * 10;
  const driftDuration = 14 + hashToUnit(`${seed}-dur`) * 10;
  const driftDelay = hashToUnit(`${seed}-delay`) * 4;
  const tilt = (angle * 180) / Math.PI + hashToUnit(`${seed}-t`) * 28;
  return {
    left: `${left}%`,
    top: `${top}%`,
    depth,
    driftX,
    driftY,
    driftZ,
    driftDuration,
    driftDelay,
    tilt
  };
}

function computeParallaxDepth(destination: MapDestination) {
  const energy = clamp(destination.travelEnergy ?? 0.55, 0, 1);
  const [lat, lon] = destination.latlng;
  const latWave = Math.abs(Math.sin((lat / 180) * Math.PI));
  const lonWave = Math.abs(Math.cos((lon / 180) * Math.PI));
  const beaconBias = clamp((destination.travelBeaconSize ?? 1) - 1, -0.4, 0.6) * 0.25;
  const raw = 0.32 + energy * 0.4 + (latWave + lonWave) * 0.12 + beaconBias;
  return clamp(raw, 0.2, 0.95);
}

function computePlanetTilt(destination: MapDestination) {
  const [lat, lon] = destination.latlng;
  return (lat + lon + 360) % 360;
}

const KEYBOARD_PAN_STEP = 28;

export function WorldMap({
  destinations,
  onSelect,
  activeSlug,
  activeDestination,
  onOpenGuide,
  variant = "earth"
}: WorldMapProps) {
  const activeSwatch = activeDestination ? getBiomeSwatch(activeDestination) : DEFAULT_SWATCH;
  const mapStyle = {
    "--map-accent": activeSwatch.accent,
    "--map-glow": activeSwatch.glow
  } as CSSProperties;
  const isGalaxyMode = variant === "galaxy";
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    dragged: false
  });
  const suppressedClickRef = useRef(false);

  const handleClearHover = () => setHoveredNode(null);
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    panStateRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      dragged: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!panStateRef.current.active) {
      return;
    }
    const deltaX = event.clientX - panStateRef.current.startX;
    const deltaY = event.clientY - panStateRef.current.startY;
    if (!panStateRef.current.dragged && Math.hypot(deltaX, deltaY) > 5) {
      panStateRef.current.dragged = true;
    }
    setPan({
      x: panStateRef.current.originX + deltaX,
      y: panStateRef.current.originY + deltaY
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panStateRef.current.active) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    suppressedClickRef.current = panStateRef.current.dragged;
    panStateRef.current = {
      active: false,
      startX: 0,
      startY: 0,
      originX: pan.x,
      originY: pan.y,
      dragged: false
    };
    window.setTimeout(() => {
      suppressedClickRef.current = false;
    }, 140);
  };

  const handlePointerCancel = () => {
    panStateRef.current = {
      active: false,
      startX: 0,
      startY: 0,
      originX: pan.x,
      originY: pan.y,
      dragged: false
    };
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    if (!["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      return;
    }
    event.preventDefault();
    const delta = {
      arrowup: { x: 0, y: KEYBOARD_PAN_STEP },
      arrowdown: { x: 0, y: -KEYBOARD_PAN_STEP },
      arrowleft: { x: KEYBOARD_PAN_STEP, y: 0 },
      arrowright: { x: -KEYBOARD_PAN_STEP, y: 0 }
    }[key]!;
    setPan((previous) => ({
      x: previous.x + delta.x,
      y: previous.y + delta.y
    }));
  };

  const handleNodeSelect = (destination: MapDestination) => {
    if (suppressedClickRef.current) {
      return;
    }
    onSelect(destination);
  };

  const panStyle = {
    transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`
  } as CSSProperties;
  const mapClassName = clsx("world-map", { "world-map--galaxy": isGalaxyMode });
  return (
    <div
      className={mapClassName}
      role="img"
      aria-label="Interactive map of clickable destinations"
      style={mapStyle}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
    >
      <div className="world-map-fabric" aria-hidden />
      <div className="world-map-surface" style={panStyle}>
        <div className="world-map-orbits" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="world-map-stars" aria-hidden />
        {destinations.map((destination, index) => {
          const galaxyPlacement = isGalaxyMode ? projectToGalaxyPlacement(destination, index) : null;
          const style = galaxyPlacement ?? projectToPercentages(destination.latlng);
          const swatch = getBiomeSwatch(destination);
          const beaconScale = getBeaconScale(destination);
          const parallaxDepth = isGalaxyMode
            ? galaxyPlacement?.depth ?? 0.5
            : computeParallaxDepth(destination);
          const tilt = isGalaxyMode
            ? galaxyPlacement?.tilt ?? computePlanetTilt(destination)
            : computePlanetTilt(destination);
          const driftX = isGalaxyMode ? galaxyPlacement?.driftX ?? 0 : 0;
          const driftY = isGalaxyMode ? galaxyPlacement?.driftY ?? 0 : 0;
          const driftZ = isGalaxyMode ? galaxyPlacement?.driftZ ?? 0 : 0;
          const driftDuration = isGalaxyMode ? galaxyPlacement?.driftDuration ?? 16 : undefined;
          const driftDelay = isGalaxyMode ? galaxyPlacement?.driftDelay ?? 0 : undefined;
          const translateZ = isGalaxyMode ? `${(parallaxDepth - 0.55) * 86}px` : "0px";
          const ringSize = 26 * beaconScale * (isGalaxyMode ? 1.05 + parallaxDepth * 0.12 : 1);
          const coreSize = (10 + beaconScale * 6) * (isGalaxyMode ? 1.05 : 1);
          const pinStyle = {
            left: style.left,
            top: style.top,
            "--node-accent": destination.travelColorway ?? swatch.accent,
            "--node-glow": swatch.glow,
            "--node-ring-size": `${ringSize}px`,
            "--node-core-size": `${coreSize}px`,
            ...(isGalaxyMode && {
              "--node-tilt": `${tilt}deg`,
              "--node-depth": parallaxDepth,
              "--node-translate-z": translateZ,
              "--node-drift-x": `${driftX}px`,
              "--node-drift-y": `${driftY}px`,
              "--node-drift-z": `${driftZ}px`,
              "--node-drift-duration": driftDuration ? `${driftDuration}s` : undefined,
              "--node-drift-delay": driftDelay ? `${driftDelay}s` : undefined
            })
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
              onClick={() => handleNodeSelect(destination)}
              onDoubleClick={(event) => {
                event.preventDefault();
                onOpenGuide?.(destination);
              }}
              onMouseEnter={() =>
                setHoveredNode({
                  destination,
                  position: { left: style.left, top: style.top }
                })
              }
              onMouseLeave={handleClearHover}
              onFocus={() =>
                setHoveredNode({
                  destination,
                  position: { left: style.left, top: style.top }
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
            <p>{trimPrompt(hoveredNode.destination.travelPrompt, hoveredNode.destination.summary)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
