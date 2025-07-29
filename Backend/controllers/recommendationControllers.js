import { haverSineDistance } from "../utils/Haversine.js";
import { getSvdResults } from "./svdControllers.js";
import prisma from "../PrismaClient.js";
export async function getUserRecommendations({
  userLat,
  userLng,
  range,
  userId,
}) {
  if (!userLat || !userLng || !range) {
    throw new Error("Missing required params");
  }
  try {
    const songs = await prisma.savedSong.findMany({
      where: {
        NOT: {
          userId,
        },
      },
      select: { song: true, lat: true, lng: true },
    });

    const userSavedSongs = await prisma.savedSong.findMany({
      where: {
        userId,
      },
      select: { songId: true },
    });

    const userSavedSongIds = new Set(
      userSavedSongs.map((saved) => saved.songId)
    );
    function normalizeDistance(distance, min = 50, max = 1) {
      const norm = (distance - min) / (max - min);
      return norm;
    }
    const recommendedSongs = songs
      .map((song) => {
        const distance = haverSineDistance(
          userLat,
          userLng,
          song.lat,
          song.lng
        );
        const normDist = normalizeDistance(distance);
        return { ...song, distance, normDist };
      })
      .filter((song) => song.distance <= range)
      .filter((song) => !userSavedSongIds.has(song.song.id))
      .sort((a, b) => a.distance - b.distance);
    const unFilteredResults = recommendedSongs;
    const seen = new Set();
    const filtered = [];
    for (const savedSong of unFilteredResults) {
      const songId = savedSong.song.id;
      if (!seen.has(songId)) {
        seen.add(songId);
        filtered.push(savedSong);
      }
    }
    return filtered;
  } catch (error) {
    throw new Error("Error getting recommended songs");
  }
}

export async function getHybridRecommendations({
  userLat,
  userLng,
  range,
  userId,
  svdWeight = 0.4,
  locationWeight = 0.6,
  limit = 15,
}) {
  if (!userLat || !userLng || !range || !userId) {
    throw new Error("Missing required parameters");
  }
  try {
    const svdRecommendations = await getSvdResults(userId);
    const locationRecommendations = await getUserRecommendations({
      userLat,
      userLng,
      range,
      userId,
    });
    //Initialize a songMap to track which songs is being recommended from both systems
    const songMap = new Map();
    svdRecommendations.forEach((song) => {
      //record normalized svd score
      const svdScore = song.predictionNormScore;
      songMap.set(song.id, {
        song: song,
        svdScore: svdScore,
        locationScore: 0,
        finalScore: 0,
      });
    });
    locationRecommendations.forEach((item) => {
      const song = item.song;
      const locationScore = item.normDist;

      if (songMap.has(song.id)) {
        // Song exists in SVD results, update data with location score
        const songData = songMap.get(song.id);
        songData.locationScore = locationScore;
      } else {
        // Song only exists in location results
        songMap.set(song.id, {
          song: song,
          svdScore: 0,
          locationScore: locationScore,
          finalScore: 0,
        });
      }
    });
    // Calculate final scores using pre-defined weights
    for (const [songId, songData] of songMap.entries()) {
      songData.finalScore =
        songData.svdScore * svdWeight + songData.locationScore * locationWeight;
    }
    const hybridRecommendations = Array.from(songMap.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);

    // Return combined recommendations
    return hybridRecommendations;
  } catch (error) {
    throw new Error("Error getting hybrid recommendations");
  }
}
