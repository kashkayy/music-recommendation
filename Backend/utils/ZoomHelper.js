export function getBucketSizeFromZoom(zoom){
  let bucketSize = 5
  if (zoom > 22.0 || zoom < 0.0) bucketSize = null
  switch(true){
    case(zoom < 5.0):
      bucketSize = 5
      break;
    case (zoom < 10.0):
      bucketSize = 2
      break;
    case (zoom < 14.0):
      bucketSize = 1
      break;
    case (zoom < 18.0):
      bucketSize = 0.5
      break;
    case (zoom < 22.0):
      bucketSize = 0.25
      break;
    default:
      return
  }
  return bucketSize
}
export function getCoordBounds(latMax, lngMax, latMin, lngMin) {
  return {
    lat: {gte: latMin, lte: latMax},
    lng: {gte: lngMin, lte: lngMax}
  }
}
export function roundedCalculator(coord, bucketSize){
  return Math.floor((coord * bucketSize)/ bucketSize)
}