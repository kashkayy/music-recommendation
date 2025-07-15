import prisma from "../PrismaClient.js";
import {
  getBucketSizeFromZoom
} from "../utils/ZoomHelper.js";
export async function getClustersData({
  latMin,
  latMax,
  lngMin,
  lngMax,
  zoom,
}) {
  const centerLat = ((latMin + latMax) / 2)
  const { bucketLat, bucketLng } = getBucketSizeFromZoom(zoom, centerLat);
  if (!bucketLat || !bucketLng) throw new Error("Something went wrong.");
  try {
    const clusters = await prisma.$queryRaw`
      SELECT
        FLOOR (ss.lat/${bucketLat}) AS lat_idx,
        FLOOR (ss.lng/${bucketLng}) AS lng_idx,
        AVG (ss.lat) AS avg_lat,
        AVG (ss.lng) AS avg_lng,
        COUNT(*) AS count
      FROM
        "SavedSong" ss
      WHERE
        ss.lat BETWEEN ${latMin} AND ${latMax}
        AND ss.lng BETWEEN ${lngMin} AND ${lngMax}
      GROUP BY lat_idx, lng_idx
    `
    const results = clusters.map((cluster) => ({
      id: `${cluster.lat_idx}_${cluster.lng_idx}`,
      lat: Number(cluster.avg_lat),
      lng: Number(cluster.avg_lng),
      count: Number(cluster.count),
      latBucket: Number(cluster.lat_idx),
      lngBucket: Number(cluster.lng_idx)
    }))
    return results
  } catch (err) {
    throw new Error("Error getting clusters data");
  }
}
export async function getTopSongs({ lat, lng, zoom }) {
  const centerLat = ((latMax + latMin) / 2)
  const { bucketLat, bucketLng } = getBucketSizeFromZoom(zoom, centerLat);
  if (!bucketLat || !bucketLng)
    throw new Error("Something went wrong");
  const latMin = lat * bucketLat;
  const latMax = latMin + bucketLat;
  const lngMin = lng * bucketLng;
  const lngMax = lngMin + bucketLng;
  const songLimit = 5

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
