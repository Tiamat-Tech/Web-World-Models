import { useEffect, useState } from "react";

import { useSceneImage } from "../hooks/useSceneImage";
import { buildImageFromPrompt } from "../utils/imagePrompt";

interface SceneBannerProps {
  page: string;
  label: string;
  context?: string;
  description?: string;
}

export function SceneBanner({ page, label, context, description }: SceneBannerProps) {
  const sceneQuery = useSceneImage(page, context);
  const [cachedScene, setCachedScene] = useState(sceneQuery.data ?? null);

  useEffect(() => {
    if (sceneQuery.data) {
      setCachedScene(sceneQuery.data);
    }
  }, [sceneQuery.data]);

  const scene = sceneQuery.data ?? cachedScene;
  const prompt = scene?.prompt;
  const imageUrl = prompt ? buildImageFromPrompt(prompt, 1400, 800) : undefined;
  const details = scene?.description ?? description ?? "Summoning AI moodboard";

  return (
    <section
      className="scene-banner"
      aria-label={`${label} visual`}
      style={
        imageUrl
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.35)), url(${imageUrl})`
            }
          : undefined
      }
    >
      <div className="scene-banner-overlay">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="scene-banner-copy">{details}</p>
          {sceneQuery.data && (
            <p className="scene-banner-caption subtle">
              {sceneQuery.data.provider === "openrouter" ? "AI" : "Local"} prompt · {new Date(sceneQuery.data.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <button className="ghost-btn" type="button" onClick={() => sceneQuery.refetch()} disabled={sceneQuery.isFetching}>
          {sceneQuery.isFetching ? "Refreshing scene..." : "Refresh AI scene"}
        </button>
      </div>
      {sceneQuery.isError && <p className="scene-banner-error">Falling back to static imagery.</p>}
    </section>
  );
}
