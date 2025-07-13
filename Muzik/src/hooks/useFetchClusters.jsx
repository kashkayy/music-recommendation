import { useCallback, useState } from "react";
import { getClusters } from "../api";
export default function useFetchClusters() {
  const [clusters, setClusters] = useState([]);
  const fetchClusters = useCallback(
    async ({ latMin, latMax, lngMin, lngMax, zoom }) => {
      try {
        const data = await getClusters(latMin, latMax, lngMin, lngMax, zoom);
        return data.results || [];
      } catch (error) {
        throw new Error("Error fetching clusters");
      }
    },
    []
  );
  const handleMapIdle = useCallback(
    async (map) => {
      if (!map) return;
      try {
        const bounds = map.getBounds();
        const zoom = map.getZoom();

        const latMin = bounds.getSouthWest().lat();
        const latMax = bounds.getNorthEast().lat();
        const lngMin = bounds.getSouthWest().lng();
        const lngMax = bounds.getNorthEast().lng();

        const data = await fetchClusters({
          latMin,
          latMax,
          lngMin,
          lngMax,
          zoom,
        });
        setClusters(data);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
    [fetchClusters, setClusters]
  );
  return { handleMapIdle, clusters };
}
