import { apiFetch } from "./client";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  referer?: string;
  title?: string;
}

export interface ChatUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ChatResponse {
  id: string;
  model: string;
  output: string;
  usage?: ChatUsage;
}

export function requestChatCompletion(payload: ChatRequest) {
  return apiFetch<ChatResponse>("/ai/chat", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
