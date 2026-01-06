import type { SceneImageResult } from "../types.js";
import { sendChatCompletion } from "./openRouterChatService.js";
import { env } from "../utils/env.js";

const SYSTEM_PROMPT = `You are an art director for a travel UI. Given metadata about a page, respond with JSON containing a vivid "prompt" for an image generator and a short "description" explaining the vibe. Keep prompts concise (under 50 words) but specific about lighting, mood, and geography.`;

const SCENE_HINTS: Record<string, string> = {
  world: "Global atlas overview with luminescent map nodes and aurora lighting",
  discover: "Editorial collage of mindful travelers, eco resorts, and artisan markets",
  planner: "Flat-lay of notebooks, boarding passes, and botanical textures",
  guides: "Macro photography of maps, handwritten notes, and local ingredients",
  destination: "Immersive view of the highlighted destination with cultural details"
};

const STATIC_SCENES: Record<string, { prompt: string; description: string }> = {
  world: {
    prompt: "A cinematic satellite composite of Earth at dusk with neon travel paths",
    description: "A luminous map backdrop hinting at live atlas data and motion."
  },
  discover: {
    prompt: "Collage of coastal cliffs, cafe terraces, and modern trains in golden hour",
    description: "A curated spread of mindful travel inspirations."
  },
  planner: {
    prompt: "Overhead desk with travel journal, vintage camera, and dried florals in soft light",
    description: "Planning nook textures that calm the itinerary mind."
  },
  guides: {
    prompt: "Close-up of annotated maps, spices, and woven textiles on a wooden table",
    description: "Guidebook ingredients ready for curious travelers."
  },
  destination: {
    prompt: "Hero shot of a storied city blending old architecture and lush nature",
    description: "Destination mood with architectural and natural cues."
  }
};

const DEFAULT_SCENE_PRESET = STATIC_SCENES.discover ?? {
  prompt: "Collage of soft-lit coastlines, notebooks, and aurora lines",
  description: "Fallback vignette inspired by mindful travel cues."
};

const DEFAULT_SCENE_HINT = SCENE_HINTS.discover ?? "Mindful travel collage blending coasts, cities, and auroras";

function normalizePage(page: string): string {
  const trimmed = page?.toLowerCase().trim();
  if (!trimmed) {
    return "discover";
  }
  return trimmed;
}

function buildFallbackScene(page: string, context?: string): SceneImageResult {
  const preset = STATIC_SCENES[page];
  const safePreset = preset ?? DEFAULT_SCENE_PRESET;
  return {
    page,
    prompt: safePreset.prompt,
    description: context ?? safePreset.description,
    provider: "static",
    generatedAt: new Date().toISOString()
  };
}

function parseSceneResponse(raw: string): { prompt: string; description?: string } | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.prompt) {
        const result: { prompt: string; description?: string } = {
          prompt: String(parsed.prompt)
        };
        if (parsed.description) {
          result.description = String(parsed.description);
        }
        return result;
      }
    } catch {
      // ignore JSON parsing issues
    }
  }

  const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) {
    return null;
  }
  const [firstLine, secondLine] = lines;
  const promptLine = (firstLine ?? "").replace(/^prompt\s*[:\-]?\s*/i, "");
  const descriptionLine = secondLine?.replace(/^description\s*[:\-]?\s*/i, "");
  const result: { prompt: string; description?: string } = {
    prompt: promptLine || trimmed
  };
  if (descriptionLine) {
    result.description = descriptionLine;
  }
  return result;
}

export async function generateSceneImage(page: string, context?: string): Promise<SceneImageResult> {
  const normalizedPage = normalizePage(page);
  const hintSource = SCENE_HINTS[normalizedPage] ?? DEFAULT_SCENE_HINT;
  const fallback = buildFallbackScene(normalizedPage, context ?? hintSource);

  if (!env.openRouter.apiKey) {
    return fallback;
  }

  try {
    const baseContext = context?.trim() || hintSource || fallback.description;
    const response = await sendChatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            page: normalizedPage,
            context: baseContext
          })
        }
      ],
      temperature: 0.8,
      maxTokens: 220,
      title: "Roam Atlas Scene Painter"
    });

    const parsed = parseSceneResponse(response.output);
    if (parsed?.prompt) {
      const description = parsed.description ?? baseContext;
      return {
        page: normalizedPage,
        prompt: parsed.prompt,
        description,
        provider: "openrouter",
        generatedAt: new Date().toISOString()
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Scene image generation fell back to static prompt", error);
  }

  return buildFallbackScene(normalizedPage, fallback.description);
}
