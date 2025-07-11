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
  const centerLat = ((latMin + latMax)/2)
  const {bucketLat, bucketLng} = getBucketSizeFromZoom(zoom, centerLat);
  const boundBox = getCoordBounds(latMax, lngMax, latMin, lngMin);
  if (!bucketLat || !bucketLng) throw new Error("Something went wrong.");
  try {
    const savedSongs = await prisma.savedSong.findMany({
      where: boundBox,
    });
    const clusterMap = {};
    for (const song of savedSongs) {
      const roundedLat = roundedCalculator(song.lat, bucketLat);
      const roundedLng = roundedCalculator(song.lng, bucketLng);
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
  const {bucketLat, bucketLng} = getBucketSizeFromZoom(zoom);
  if (!bucketLat|| !bucketLng)
    throw new Error("Something went wrong");
  const latMin = lat-bucketLat;
  const latMax = lat + bucketLat;
  const lngMin = lng -bucketLng;
  const lngMax = lng + bucketLng;
  const songLimit = 30
  console.log("Coords of visible boundary: ", latMax, latMin, lngMax, lngMin)
  console.log("bucketCoords: ", bucketLat, bucketLng)
  try {
    const topSongs = await prisma.$queryRaw`
      SELECT 
        s.id AS id,
        s.title AS title,
        s.artist AS artist,
        s."coverUrl" AS coverUrl,
        COUNT(ss."songId")::integer AS save_count
      FROM
        "SavedSong" ss
      JOIN
        "Song" s ON ss."songId" = s.id
      WHERE
        ss.lat BETWEEN ${latMin} AND ${latMax}
        AND ss.lng BETWEEN ${lngMin} AND ${lngMax}
      GROUP BY
        s.id, s.title, s.artist, s."coverUrl"
      ORDER BY
        save_count DESC
      LIMIT ${songLimit}
      `
    return topSongs
  } catch (err) {
    throw new Error("Error getting top songs");
  }
}
