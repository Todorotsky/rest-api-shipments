const CONSTANT_AVERAGE_SPEED = 50;

const DISTANCES: Record<string, Record<string, number>> = {
  "New York, NY": {
    "Los Angeles, CA": 2800,
    "Chicago, IL": 800,
    "Miami, FL": 1300,
    "San Francisco, CA": 2900,
    "Houston, TX": 1600,
  },
  "Chicago, IL": {
    "Los Angeles, CA": 2000,
    "Miami, FL": 1400,
    "San Francisco, CA": 2000,
    "Houston, TX": 1000,
  },
  "Los Angeles, CA": {
    "Miami, FL": 2700,
    "San Francisco, CA": 400,
    "Houston, TX": 1600,
  },
  "Miami, FL": {
    "San Francisco, CA": 3100,
    "Houston, TX": 1200,
  },
  "San Francisco, CA": {
    "Houston, TX": 1900,
  },
};

function getDistance(city1: string, city2: string): number {
  // Try city1 -> city2
  if (DISTANCES[city1]?.[city2]) {
    return DISTANCES[city1][city2];
  }
  // Try reverse direction
  if (DISTANCES[city2]?.[city1]) {
    return DISTANCES[city2][city1];
  }

  throw new Error(`Distance not found between ${city1} and ${city2}`);
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
