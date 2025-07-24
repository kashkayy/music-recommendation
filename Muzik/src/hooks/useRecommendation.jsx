import { useState, useCallback } from "react";
import { getUserRecommendation } from "../api";
export default function useRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const getRecommendations = useCallback(async (userLat, userLng, range = 5, userId) => {
    setRecommendationsLoading(true);
    try {
      const response = await getUserRecommendation(userLat, userLng, range, userId);
      setRecommendations(response);
    } catch (error) {
      throw new Error("Error fetching recommended songs");
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);
  return { recommendations, getRecommendations, recommendationsLoading }
}
