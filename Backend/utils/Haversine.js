// Trig functions mostly expect radians and not degrees so I created helper
export function convertToRad(coord) {
  return coord * (Math.PI / 180);
}
//Haversine formula
//This formula calaculates the distance between two points across a sphere
const EARTH_RADIUS = 6371; // km
export function haverSineDistance(userLat, userLng, songLat, songLng) {
  const lat1 = convertToRad(userLat);
  const lng1 = convertToRad(userLng);
  const lat2 = convertToRad(songLat);
  const lng2 = convertToRad(songLng);
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;
  return distance;
}
