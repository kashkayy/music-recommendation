import { useState, useCallback } from "react";
import { getUserRecommendation } from "../api";
import useDebounce from "./useDebounce";
export default function useRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [range, setRange] = useState(1);
  const [userInfo, setUserInfo] = useState({
    lat: null,
    lng: null,
    userId: null,
  });

  const getRecommendations = useCallback(
    async (userLat, userLng, rangeValue, userId) => {
      setRecommendationsLoading(true);
      try {
        setUserInfo({ lat: userLat, lng: userLng, userId });
        const response = await getUserRecommendation(
          userLat,
          userLng,
          rangeValue,
          userId
        );
        setRecommendations(response);
      } catch (error) {
        setRecommendationsError(
          "Error fetching recommended songs, please try again"
        );
      } finally {
        setRecommendationsLoading(false);
      }
    },
    []
  );
  const debouncedRecommendations = useDebounce(getRecommendations, 600);

  const handleRangeChange = useCallback(
    (event) => {
      const newRange = event.target.value;
      setRange(newRange);
      const { lat, lng, userId } = userInfo;
      if (lat && lng && userId) {
        debouncedRecommendations(lat, lng, newRange, userId);
      }
    },
    [userInfo, debouncedRecommendations]
  );

  return {
    recommendations,
    getRecommendations,
    recommendationsLoading,
    recommendationsError,
    range,
    handleRangeChange,
  };
}
