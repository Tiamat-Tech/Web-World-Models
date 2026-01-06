import { apiFetch } from "./client";

export interface SceneImageRequest {
  page: string;
  context?: string;
}

export interface SceneImage {
  page: string;
  prompt: string;
  description: string;
  provider: "openrouter" | "static";
  generatedAt: string;
}

export async function requestSceneImage(payload: SceneImageRequest): Promise<SceneImage> {
  const response = await apiFetch<{ scene: SceneImage }>("/ai/scene", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.scene;
}
