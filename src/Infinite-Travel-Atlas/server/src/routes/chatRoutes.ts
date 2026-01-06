import { Router } from "express";

import type { ChatRole, LlmChatMessage, LlmChatRequest } from "../types.js";
import { sendChatCompletion } from "../services/openRouterChatService.js";

const ALLOWED_ROLES: ChatRole[] = ["system", "user", "assistant"];
const roleSet = new Set(ALLOWED_ROLES);

function normalizeMessages(input: unknown): LlmChatMessage[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("messages must be a non-empty array");
  }

  return input.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`message at index ${index} is invalid`);
    }
    const { role, content } = entry as Record<string, unknown>;
    if (typeof role !== "string" || !roleSet.has(role as ChatRole)) {
      throw new Error(`message role must be one of: ${ALLOWED_ROLES.join(", ")}`);
    }
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("message content must be a non-empty string");
    }
    return {
      role: role as ChatRole,
      content: content.trim()
    };
  });
}

function normalizeChatPayload(body: unknown): LlmChatRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  const raw = body as Record<string, unknown>;
  const messages = normalizeMessages(raw.messages);

  const payload: LlmChatRequest = { messages };

  if (typeof raw.model === "string" && raw.model.trim()) {
    payload.model = raw.model.trim();
  }

  if (typeof raw.temperature === "number" && Number.isFinite(raw.temperature)) {
    payload.temperature = raw.temperature;
  }

  const maxTokens = raw.maxTokens ?? raw.max_tokens;
  if (typeof maxTokens === "number" && Number.isFinite(maxTokens)) {
    payload.maxTokens = Math.max(1, Math.floor(maxTokens));
  }

  if (typeof raw.referer === "string" && raw.referer.trim()) {
    payload.referer = raw.referer.trim();
  }

  if (typeof raw.title === "string" && raw.title.trim()) {
    payload.title = raw.title.trim();
  }

  return payload;
}

export const chatRouter = Router();

chatRouter.post("/ai/chat", async (req, res) => {
  let payload: LlmChatRequest;
  try {
    payload = normalizeChatPayload(req.body);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
    return;
  }

  try {
    const result = await sendChatCompletion(payload);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
