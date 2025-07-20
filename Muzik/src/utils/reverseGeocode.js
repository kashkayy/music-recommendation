// Region represents a string like: "9.518_-31.012_6", goal: estimate region lat/lng and reverse geocode to human readable location
export async function reverseGeocoder(region) {
  //extract lat/lng indices from region and convert to int
  const regionArray = region.split("_");
  const regionCoordsArray = regionArray.map(Number);
  //convert those indices to approx. lat/lng values
  const bucketSize = 3.938;
  const lat = Number(regionCoordsArray[0] * bucketSize);
  const lng = Number(regionCoordsArray[1] * bucketSize);
  //Geocoding api to fetch address
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  //extract city from formatted address
  const formattedAddress = data?.results?.[0]?.formatted_address;
  const addressArray = formattedAddress.split(",");
  const regionName = addressArray[1] || "Unknown Location";
  return regionName;
}
