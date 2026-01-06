const DEFAULT_SUFFIX = "Cinematic travel photography, high fidelity, natural light";

export interface TravelImagePromptSeed {
  continent?: string;
  country?: string;
  city?: string;
  destination?: string;
  prompt?: string;
}

function formatValue(value?: string, fallback = "Unknown") {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function buildTravelImagePrompt(tp: TravelImagePromptSeed, vibeTheme?: string) {
  const continent = formatValue(tp.continent, "Global focus");
  const country = formatValue(tp.country, "Traveler homeland unknown");
  const city = formatValue(tp.city, "City unknown");
  const destination = formatValue(tp.destination, "Central district");
  const moodSeed = formatValue(tp.prompt, "Capture the inviting arrival energy.");
  const vibe = formatValue(vibeTheme, "Default cinematic vibe");

  return `
You are an AI image model.

Create ONE cinematic travel photograph that feels like a postcard overview of this place:

Location
- Continent: ${continent}
- Country: ${country}
- City / region: ${city}
- Local area / highlight: ${destination}

Travel mood seed
"${moodSeed}"

Vibe theme: ${vibe}

Goal
Show what it feels like for a traveler to arrive here on a good day:
- landscape, light, sky, and overall atmosphere
- a sense of local architecture and terrain
- optional small human figures for scale, but no close-up portraits

Style
- Realistic, natural colors
- Cinematic 16:9 wide shot suitable as a hero image
- Soft lighting that matches the vibe theme
- No text, logos, watermarks, UI elements, or frames
- No split panels, only a single continuous scene

Emphasis
- If the prompt mentions specific times of day (sunrise, golden hour, sunset, night),
  match the lighting.
- If it mentions markets, alleys, or old town streets, show them as part of the scene.
- If it mentions cliffs, dunes, beaches, or mountains, make them visually prominent.

Output
Generate only the image according to this description. Do not overlay any text.
`.trim();
}

export function buildImageFromPrompt(prompt: string, width = 1000, height = 700) {
  const normalized = `${prompt}. ${DEFAULT_SUFFIX}`;
  const encoded = encodeURIComponent(normalized);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}`;
}
