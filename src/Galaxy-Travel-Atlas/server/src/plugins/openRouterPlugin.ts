import type { AxiosError } from "axios";

import type { AgentPlugin, ThemePluginContext } from "./agentPlugin.js";
import type { ThemePalette, ThemeProfile, LlmChatMessage } from "../types.js";
import { env } from "../utils/env.js";
import { requestOpenRouterCompletion } from "../services/openRouterChatService.js";

interface OpenRouterThemeResponse {
  palette: ThemePalette;
  mood: string;
  soundtrack: string;
  description: string;
  travelCue: string;
  prompt: string;
}

export class OpenRouterPlugin implements AgentPlugin {
  readonly id = "openrouter";
  readonly label = "OpenRouter AI";
  readonly supportsImages = true;
  private failureCount = 0;
  private cooldownUntil = 0;
  private static readonly FAILURE_THRESHOLD = 2;
  private static readonly COOLDOWN_MS = 1000 * 60 * 2; // 2 minutes

  ready(): boolean {
    if (!env.openRouter.apiKey) {
      return false;
    }
    if (this.cooldownUntil > Date.now()) {
      return false;
    }
    return true;
  }

  async generateTheme({ destination, request }: ThemePluginContext): Promise<ThemeProfile> {
    if (!env.openRouter.apiKey) {
      throw new Error("OpenRouter API key missing");
    }
    if (this.cooldownUntil > Date.now()) {
      throw new Error("OpenRouter temporarily unavailable");
    }

    const cursorDescriptor = request.cursor
      ? `Cursor normalized position: (${request.cursor.x.toFixed(2)}, ${request.cursor.y.toFixed(
          2
        )}).`
      : "Cursor data not supplied.";

    const messages: LlmChatMessage[] = [
      {
        role: "system",
        content:
          "You are an AI travel moodboard generator. Always reply with compact JSON using keys palette(background, foreground, accent, highlight, muted), mood, soundtrack, description, travelCue, prompt."
      },
      {
        role: "user",
        content: [
          `Destination: ${destination.name}, ${destination.country}.`,
          `Region: ${destination.region}. Style: ${destination.style}.`,
          `Highlights: ${destination.highlights.join("; ") || "n/a"}.`,
          `Best time: ${destination.bestTime}. Climate: ${destination.climate}.`,
          cursorDescriptor,
          `Optional vibe seed: ${request.vibeSeed ?? "none"}.`,
          "Generate a cinematic travel vibe referencing local culture and landscapes."
        ].join(" ")
      }
    ];

    let parsed: OpenRouterThemeResponse;
    try {
      const completion = await requestOpenRouterCompletion({
        model: env.openRouter.model,
        responseFormat: { type: "json_object" },
        messages
      });
      parsed = JSON.parse(completion.output) as OpenRouterThemeResponse;
      this.resetFailures();
    } catch (error) {
      this.registerFailure(error);
      throw error;
    }

    return {
      destinationId: destination.id,
      provider: this.id,
      palette: parsed.palette,
      mood: parsed.mood,
      soundtrack: parsed.soundtrack,
      description: parsed.description,
      travelCue: parsed.travelCue,
      prompt: parsed.prompt,
      createdAt: new Date().toISOString()
    };
  }

  private resetFailures() {
    this.failureCount = 0;
    this.cooldownUntil = 0;
  }

  private registerFailure(error: unknown) {
    this.failureCount += 1;
    const axiosError = error as AxiosError<{ error?: { message?: string } }>;
    const status = axiosError?.response?.status;
    const shouldCooldown =
      this.failureCount >= OpenRouterPlugin.FAILURE_THRESHOLD || (status !== undefined && status >= 400);
    if (shouldCooldown) {
      this.cooldownUntil = Date.now() + OpenRouterPlugin.COOLDOWN_MS;
    }
    const detailMessage =
      axiosError?.response?.data?.error?.message ?? axiosError?.message ?? "Unknown OpenRouter error";
    // eslint-disable-next-line no-console
    console.warn(
      `[plugin:${this.id}] Failed to generate theme (status: ${status ?? "n/a"}) - ${detailMessage}` +
        (this.cooldownUntil > Date.now()
          ? ` | entering cooldown until ${new Date(this.cooldownUntil).toISOString()}`
          : "")
    );
  }
}
