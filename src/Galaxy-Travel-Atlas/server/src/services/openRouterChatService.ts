import axios from "axios";

import type { LlmChatRequest, LlmChatResult, LlmChatUsage } from "../types.js";
import { env } from "../utils/env.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function flattenContent(content: unknown): string | null {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const merged = content
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }
        if (entry && typeof entry === "object" && "text" in entry) {
          return String((entry as Record<string, unknown>).text ?? "");
        }
        if (entry && typeof entry === "object" && "content" in entry) {
          return String((entry as Record<string, unknown>).content ?? "");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
    return merged || null;
  }

  if (content && typeof content === "object" && "text" in content) {
    return String((content as Record<string, unknown>).text ?? "");
  }

  return null;
}

function normalizeUsage(usage: unknown): LlmChatUsage | undefined {
  if (!usage || typeof usage !== "object") {
    return undefined;
  }
  const data = usage as Record<string, unknown>;
  const parse = (value: unknown) => {
    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  };
  const result: LlmChatUsage = {};
  const promptTokens = parse(data.prompt_tokens);
  const completionTokens = parse(data.completion_tokens);
  const totalTokens = parse(data.total_tokens);
  if (promptTokens !== undefined) {
    result.promptTokens = promptTokens;
  }
  if (completionTokens !== undefined) {
    result.completionTokens = completionTokens;
  }
  if (totalTokens !== undefined) {
    result.totalTokens = totalTokens;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export interface OpenRouterCompletionOptions extends LlmChatRequest {
  responseFormat?: Record<string, unknown>;
  reasoning?: Record<string, unknown>;
}

export interface OpenRouterCompletionResult {
  id: string;
  model: string;
  output: string;
  usage?: LlmChatUsage;
  message?: Record<string, unknown>;
}

export async function requestOpenRouterCompletion(
  options: OpenRouterCompletionOptions
): Promise<OpenRouterCompletionResult> {
  if (!env.openRouter.apiKey) {
    throw new Error("OpenRouter API key missing");
  }

  if (!options.messages?.length) {
    throw new Error("messages are required");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.openRouter.apiKey}`,
    "Content-Type": "application/json"
  };

  if (options.referer) {
    headers["HTTP-Referer"] = options.referer;
  }
  if (options.title) {
    headers["X-Title"] = options.title;
  }

  const body: Record<string, unknown> = {
    model: options.model ?? env.openRouter.model,
    messages: options.messages
  };

  if (options.temperature !== undefined) {
    body.temperature = options.temperature;
  }
  if (options.maxTokens !== undefined) {
    body.max_tokens = options.maxTokens;
  }
  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }
  if (options.reasoning) {
    body.reasoning = options.reasoning;
  }

  const response = await axios.post(OPENROUTER_URL, body, {
    headers,
    timeout: 20_000
  });

  const firstChoice = response.data?.choices?.[0];
  const message = firstChoice?.message as Record<string, unknown> | undefined;
  const messageContent = flattenContent(message?.content);
  if (!messageContent) {
    throw new Error("OpenRouter returned empty content");
  }

  const usage = normalizeUsage(response.data?.usage);
  const result: OpenRouterCompletionResult = {
    id: response.data?.id ?? "",
    model: response.data?.model ?? (options.model ?? env.openRouter.model),
    output: messageContent
  };
  if (usage) {
    result.usage = usage;
  }
  if (message) {
    result.message = message;
  }
  return result;
}

export async function sendChatCompletion(payload: LlmChatRequest): Promise<LlmChatResult> {
  const result = await requestOpenRouterCompletion(payload);
  return {
    id: result.id,
    model: result.model,
    output: result.output,
    ...(result.usage ? { usage: result.usage } : {})
  };
}
