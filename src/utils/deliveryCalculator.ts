import { City } from "country-state-city";

const CONSTANT_AVERAGE_SPEED = 50; // mph

/**
 * Get city coordinates from the country-state-city package
 * @param cityState - Format: "City, ST" (e.g., "New York, NY")
 * @returns City coordinates { lat, lon }
 */
function getCityCoordinates(cityState: string): { lat: number; lon: number } {
  const [cityName, stateCode] = cityState.split(", ").map((s) => s.trim());

  if (!stateCode) {
    throw new Error(`Invalid state code: ${stateCode}`);
  }

  // For demo purposes, I only used the US, but it can be extended to other countries.
  const cities = City.getCitiesOfState("US", stateCode);

  if (!cities || cities.length === 0) {
    throw new Error(`No cities found for state code: ${stateCode}`);
  }

  // Find city by exact match (case-insensitive)
  const city = cities.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );

  if (!city) {
    // Provide helpful error message with available cities
    const availableCities = cities
      .slice(0, 5)
      .map((c) => c.name)
      .join(", ");
    throw new Error(
      `City not found: "${cityName}" in ${stateCode}. ` +
        `Available cities include: ${availableCities}...` +
        ` (${cities.length} total cities in ${stateCode})`
    );
  }

  return {
    lat: parseFloat(city.latitude),
    lon: parseFloat(city.longitude),
  };
}

/**
 * Haversine formula to calculate great-circle distance between two points
 * Returns distance in miles
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getDistance(city1: string, city2: string): number {
  const coord1 = getCityCoordinates(city1);
  const coord2 = getCityCoordinates(city2);

  return calculateHaversineDistance(
    coord1.lat,
    coord1.lon,
    coord2.lat,
    coord2.lon
  );
}

export function calculateEstimatedDeliveryTime(
  origin: string,
  destination: string
): Date {
  const distance = getDistance(origin, destination);
  const hours = distance / CONSTANT_AVERAGE_SPEED;
  const deliveryDate = new Date();
  deliveryDate.setHours(deliveryDate.getHours() + Math.ceil(hours));
  return deliveryDate;
}
