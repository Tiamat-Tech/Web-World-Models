import { DiscoverExplorer } from "../components/DiscoverExplorer";
import { TravelPlacesPanel } from "../components/TravelPlacesPanel";
import { useAppContent } from "../hooks/useAppContent";

export function DiscoverRoute() {
  const { data, isLoading, error } = useAppContent();

  if (isLoading) {
    return <p className="loading-state">Loading curated moments...</p>;
  }

  if (error) {
    return <p className="error-state">Unable to load destinations.</p>;
  }

  return (
    <div className="view view-discover">
      <DiscoverExplorer destinations={data?.destinations ?? []} />
      <TravelPlacesPanel />
    </div>
  );
}
