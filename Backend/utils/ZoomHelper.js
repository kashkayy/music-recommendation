const worldDiameter_Km = 7000
const unitConverter = 111.1
export function getBucketSizeFromZoom(zoom, centerLat = 0) {
  const defaultZoom = 2
  const radius = worldDiameter_Km/(2 ** (zoom - defaultZoom))
  const bucketLat = radius/unitConverter
  const safePoint = Math.max(-89.9999, Math.min(89.9999, centerLat))
  const bucketLng = (bucketLat/ Math.cos(safePoint * Math.PI / 180))
  return { bucketLat, bucketLng }
}
