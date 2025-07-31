export async function geocode(address) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      const result = data.results[0];
      const location = result.geometry.location;
      const viewport = result.geometry.viewport;
      return { location, viewport };
    } else {
      throw new Error("Location not found");
    }
  } catch (err) {
    throw new Error("Geocoding failed");
  }
}
