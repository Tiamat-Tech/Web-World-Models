import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelAugmentedDestination } from "../utils/travelPlaces";
import { buildGuidePath, type GuidePathOptions } from "../utils/guideNavigation";

type GuideDestination = WorldDestinationMeta | TravelAugmentedDestination;

export interface OpenGuideOptions extends GuidePathOptions {
  newTab?: boolean;
  state?: Record<string, unknown>;
}

export function useGuideNavigation() {
  const navigate = useNavigate();

  const openGuide = useCallback(
    (destination: GuideDestination, options: OpenGuideOptions = {}) => {
      const descriptor = buildGuidePath(destination, options);
      const finalState = { destination, ...options.state };
      if (options.newTab && typeof window !== "undefined" && window?.open) {
        window.open(descriptor.url, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(`${descriptor.pathname}?${descriptor.search}`, { state: finalState });
    },
    [navigate]
  );

  const buildGuideUrl = useCallback(
    (destination: GuideDestination, options?: GuidePathOptions) => buildGuidePath(destination, options).url,
    []
  );

  return { openGuide, buildGuideUrl };
}
