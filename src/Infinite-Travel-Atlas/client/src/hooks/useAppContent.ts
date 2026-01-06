import { useQuery } from "@tanstack/react-query";

import { fetchAppContent } from "../api/content";

export function useAppContent() {
  return useQuery({
    queryKey: ["app-content"],
    queryFn: fetchAppContent,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
}
