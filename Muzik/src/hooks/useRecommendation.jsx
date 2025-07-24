import { useState, useCallback } from "react";
import { getUserRecommendation } from "../api";
export default function useRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const getRecommendations = useCallback(async (userLat, userLng, range = 5, userId) => {
    setRecommendationsLoading(true);
    try {
      const response = await getUserRecommendation(userLat, userLng, range, userId);
      setRecommendations(response);
    } catch (error) {
      setRecommendationsError("Error fetching recommended songs, please try again");
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);
  return { recommendations, getRecommendations, recommendationsLoading, recommendationsError }
}
