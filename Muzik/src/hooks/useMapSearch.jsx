import { useCallback, useState } from "react";
import { geocode } from "../utils/geocoder";
import { Notify } from "../utils/toast";
export default function useMapSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = useCallback(async (query, map, onMapMove) => {
    if (!query.trim() || !map) return;
    setIsSearching(true);
    try {
      const { location, viewport } = await geocode(query);
      if (viewport) {
        const bounds = {
          north: viewport.northeast.lat,
          east: viewport.northeast.lng,
          south: viewport.southwest.lat,
          west: viewport.southwest.lng,
        };
        map.fitBounds(bounds);
      } else {
        map.panTo(location);
        map.setZoom(12);
      }
      setSearchQuery(query);
      if (onMapMove) {
        setTimeout(() => onMapMove(map), 500);
      }
    } catch (err) {
      Notify("Cannot find location :(");
    } finally {
      setIsSearching(false);
    }
  }, []);
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    handleSearch,
    clearSearch,
  };
}
