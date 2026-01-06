import type { TravelTheme } from "../types";
import type { WorldDestinationMeta } from "../data/worldDestinations";
import type { TravelAugmentedDestination } from "./travelPlaces";
import { pickTheme } from "./themePicker";

type GuideDestination = WorldDestinationMeta | TravelAugmentedDestination;

export interface GuidePathOptions {
  theme?: TravelTheme;
  language?: string;
}

export interface GuidePathDescriptor {
  pathname: string;
  search: string;
  url: string;
  params: URLSearchParams;
  theme: TravelTheme;
  language: string;
}

function resolveTheme(meta: GuideDestination, override?: TravelTheme): TravelTheme {
  if (override) {
    return override;
  }
  const augmented = meta as Partial<TravelAugmentedDestination>;
  if (augmented.travelTheme) {
    return augmented.travelTheme;
  }
  return pickTheme(meta);
}

function resolveLanguage(meta: GuideDestination, override?: string): string {
  if (override?.trim()) {
    return override.trim();
  }
  if (meta.defaultLanguage?.trim()) {
    return meta.defaultLanguage.trim();
  }
  const augmented = meta as Partial<TravelAugmentedDestination>;
  if (augmented.defaultLanguage?.trim()) {
    return augmented.defaultLanguage.trim();
  }
  return "en";
}

export function buildGuidePath(meta: GuideDestination, options: GuidePathOptions = {}): GuidePathDescriptor {
  const theme = resolveTheme(meta, options.theme);
  const language = resolveLanguage(meta, options.language);
  const params = new URLSearchParams({
    iso2: meta.iso2,
    theme,
    lang: language
  });
  const pathname = `/destinations/${meta.slug}`;
  const search = params.toString();
  return {
    pathname,
    search,
    url: `${pathname}?${search}`,
    params,
    theme,
    language
  };
}
