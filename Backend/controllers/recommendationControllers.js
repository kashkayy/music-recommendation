import { haverSineDistance } from "../utils/Haversine.js";
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
    const recommendedSongs = songs
      .map((song) => {
        const distance = haverSineDistance(
          userLat,
          userLng,
          song.lat,
          song.lng
        );
        return { ...song, distance };
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
