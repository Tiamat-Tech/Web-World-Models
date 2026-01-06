import { useQuery } from "@tanstack/react-query";

import { requestSceneImage, type SceneImage } from "../api/scenes";

export function useSceneImage(page: string, context?: string) {
  return useQuery<SceneImage>({
    queryKey: ["scene-image", page, context ?? null],
    queryFn: () => requestSceneImage({ page, context }),
    staleTime: 1000 * 60 * 30
  });
}
