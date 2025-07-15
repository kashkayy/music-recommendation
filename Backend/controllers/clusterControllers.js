import prisma from "../PrismaClient.js";
import {
  getBucketSizeFromZoom,
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
  if (!bucketLat || !bucketLng) throw new Error("Something went wrong.");
  try {
    const clusters = await prisma.$queryRaw`
      SELECT
        FLOOR (ss.lat/CAST(${bucketLat} AS DOUBLE PRECISION)) AS lat_idx,
        FLOOR (ss.lng/CAST(${bucketLng} AS DOUBLE PRECISION)) AS lng_idx,
        AVG (ss.lat) AS avg_lat,
        AVG (ss.lng) AS avg_lng,
        COUNT(*) AS count
      FROM
        "SavedSong" ss
      WHERE
        ss.lat BETWEEN CAST (${latMin} AS DOUBLE PRECISION) AND CAST(${latMax} AS DOUBLE PRECISION)
        AND ss.lng BETWEEN CAST (${lngMin} AS DOUBLE PRECISION) AND CAST(${lngMax} AS DOUBLE PRECISION)
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
export async function getTopSongs({lat, lng, zoom}) {
  const { bucketLat, bucketLng } = getBucketSizeFromZoom(zoom)
  if (!bucketLat || !bucketLng)
    throw new Error("Invalid bucket sizes");
  const latMin = lat - bucketLat/2;
  const latMax = lat + bucketLat/2;
  const lngMin = lng - bucketLng/2;
  const lngMax = lng + bucketLng/2;
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
        ss.lat BETWEEN CAST(${latMin} AS DOUBLE PRECISION) AND CAST(${latMax} AS DOUBLE PRECISION)
        AND ss.lng BETWEEN CAST(${lngMin} AS DOUBLE PRECISION) AND CAST(${lngMax} AS DOUBLE PRECISION)
      GROUP BY
        s.id, s.title, s.artist, s."coverUrl"
      ORDER BY
        save_count DESC
      LIMIT CAST(${songLimit} AS INT)
      `
    return topSongs
  } catch (err) {
    throw new Error("Error getting top songs");
  }
}
