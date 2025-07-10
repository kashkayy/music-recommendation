import prisma from "../PrismaClient.js";
import {
  getBucketSizeFromZoom,
  getCoordBounds,
  roundedCalculator,
} from "../utils/ZoomHelper.js";
export async function getClustersData({
  latMin,
  latMax,
  lngMin,
  lngMax,
  zoom,
}) {
  const bucketSize = getBucketSizeFromZoom(zoom);
  const boundBox = getCoordBounds(latMax, lngMax, latMin, lngMin);
  if (!bucketSize) throw new Error("Something went wrong.");
  try {
    const savedSongs = await prisma.savedSong.findMany({
      where: boundBox,
    });
    const clusterMap = {};
    for (const song of savedSongs) {
      const roundedLat = roundedCalculator(song.lat, bucketSize);
      const roundedLng = roundedCalculator(song.lng, bucketSize);
      const key = `${roundedLat}_${roundedLng}`;
      if (clusterMap[key]) {
        clusterMap[key].count++;
      } else {
        clusterMap[key] = {
          lat: roundedLat,
          lng: roundedLng,
          count: 1,
        };
      }
    }
    return Object.values(clusterMap);
  } catch (err) {
    throw new Error("Error getting clusters data");
  }
}
export async function getTopSongs({ lat, lng, zoom }) {
  const bucketSize = getBucketSizeFromZoom(zoom);
  const roundedLat = roundedCalculator(lat, bucketSize);
  const roundedLng = roundedCalculator(lng, bucketSize);
  if (!bucketSize || !roundedLat || !roundedLng)
    throw new Error("Something went wrong");
  const latMin = roundedLat;
  const latMax = roundedLat + bucketSize;
  const lngMin = roundedLng;
  const lngMax = roundedLng + bucketSize;
  const boundBox = getCoordBounds(latMax, lngMax, latMin, lngMin);
  try {
    const songs = await prisma.savedSong.findMany({
      where: boundBox,
      include: {
        song: true,
      },
    });
    const songMap = {};
    for (const item of songs) {
      const id = item.songId;
      if (songMap[id]) {
        songMap[id].count++;
      } else {
        songMap[id] = {
          count: 1,
          song: item.song,
        };
      }
    }
    return Object.values(songMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);
  } catch (err) {
    throw new Error("Error getting top songs");
  }
}
