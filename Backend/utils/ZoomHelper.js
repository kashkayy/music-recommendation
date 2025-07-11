//Maps each google Maps zoom level to an approximate bucket size in degrees
// higher zoom = smaller buckets and vice versa 
const bucketSizeByZoomLevel = {
  1: 5.0,
  2: 2.5,
  3: 1.5,
  4: 1.0,
  5: 0.5,
  6: 0.25,
  7: 0.1,
  8: 0.05,
  9: 0.02,
  10: 0.01,
  11: 0.005,
  12: 0.002,
  13: 0.001,
  14: 0.0005,
  15: 0.00025,
  16: 0.0001,
  17: 0.00005,
  18: 0.000025,
  19: 0.00001,
  20: 0.000005,
}
export function getBucketSizeFromZoom(zoom, centerLat = 0) {
  const base = bucketSizeByZoomLevel[zoom] || 0.0001
  const bucketLat = base
  const bucketLng = (base / Math.cos(centerLat * Math.PI / 180))
  return {bucketLat, bucketLng}
}
export function getCoordBounds(latMax, lngMax, latMin, lngMin) {
  return {
    lat: { gte: latMin, lte: latMax },
    lng: { gte: lngMin, lte: lngMax },
  };
}
export function roundedCalculator(coord, bucketCoord) {
  return Math.floor((coord * bucketCoord) / bucketCoord)
}
