/**
 * routeService.js
 * Review 1 Prototype Route Calculation Service.
 * Computes realistic distances, transit durations, and corridor summaries.
 * Structured modularly so Google Maps / Routes API can be plugged in directly.
 */

// Coordinates for major Indian origin cities
const ORIGIN_COORDINATES = {
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
};

// Known baseline highway distances (in km) from major hubs for Review 1 precision
const KNOWN_ROUTE_DISTANCES = {
  'new delhi-goa': 1870,
  'delhi-goa': 1870,
  'mumbai-goa': 590,
  'bengaluru-goa': 560,
  'new delhi-jaipur': 280,
  'delhi-jaipur': 280,
  'mumbai-jaipur': 1150,
  'new delhi-manali': 535,
  'delhi-manali': 535,
  'mumbai-manali': 1950,
  'new delhi-kerala': 2600,
  'delhi-kerala': 2600,
  'mumbai-kerala': 1400,
  'bengaluru-kerala': 550,
  'bengaluru-coorg': 250,
  'new delhi-coorg': 2350,
  'mumbai-coorg': 980,
  'new delhi-udaipur': 660,
  'delhi-udaipur': 660,
  'mumbai-udaipur': 750,
  'new delhi-madurai': 2550,
  'bengaluru-madurai': 435,
  'chennai-madurai': 460,
  'new delhi-assam': 1980,
  'kolkata-assam': 980,
  'new delhi-ladakh': 1020,
  'new delhi-varanasi': 820,
};

/**
 * Calculates Great-Circle distance in km using Haversine formula
 */
function calculateHaversineDistance(coords1, coords2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Resolves origin coordinates from string (e.g. "New Delhi (Current Location)" -> "new delhi")
 */
function resolveOriginCoords(startLocation) {
  const clean = (startLocation || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim();

  for (const [key, coords] of Object.entries(ORIGIN_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return { name: key.toUpperCase(), coords };
    }
  }

  // Default fallback to New Delhi hub
  return { name: 'NEW DELHI', coords: ORIGIN_COORDINATES['new delhi'] };
}

/**
 * Formats duration in minutes to human readable "X hrs Y mins"
 */
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} mins`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} mins`;
}

/**
 * Calculates route information
 * @param {string} startLocation - User provided departure location
 * @param {object} destinationData - Destination record from destinations.json
 * @param {string} preferredTransport - Transport mode ('Flight', 'Train', 'Car', 'Bus')
 * @returns {Promise<object>} Route metrics { distance, travelTime, origin, destination, mode, summary }
 */
async function getRoute(startLocation, destinationData, preferredTransport = 'Flight') {
  const originInfo = resolveOriginCoords(startLocation);
  const destId = destinationData.id;
  const destCoords = destinationData.coordinates;

  // 1. Check known lookup key
  const routeKey = `${originInfo.name.toLowerCase()}-${destId}`;
  let distanceKm = KNOWN_ROUTE_DISTANCES[routeKey];

  // 2. If not in known list, compute via coordinates
  if (!distanceKm) {
    const directDist = calculateHaversineDistance(originInfo.coords, destCoords);
    // Apply realistic terrestrial highway / rail curvature factor (~1.22x)
    distanceKm = Math.round(directDist * 1.22);
  }

  // 3. Compute travel time according to transit mode
  let durationMinutes = 0;
  const mode = preferredTransport || 'Flight';

  switch (mode.toLowerCase()) {
    case 'flight': {
      // Flight speed ~700 km/h + 60 min terminal/climb/descent
      const flightMins = Math.round((distanceKm / 700) * 60) + 55;
      durationMinutes = Math.max(70, flightMins);
      break;
    }
    case 'train': {
      // High-speed / express train avg 75 km/h
      const trainMins = Math.round((distanceKm / 75) * 60);
      durationMinutes = Math.max(120, trainMins);
      break;
    }
    case 'car': {
      // Highway speed ~55 km/h + breaks
      const driveMins = Math.round((distanceKm / 55) * 60);
      durationMinutes = Math.max(60, driveMins);
      break;
    }
    case 'bus': {
      // Coach avg ~45 km/h
      const busMins = Math.round((distanceKm / 45) * 60);
      durationMinutes = Math.max(90, busMins);
      break;
    }
    default:
      durationMinutes = Math.round((distanceKm / 65) * 60);
  }

  return {
    distance: `${distanceKm.toLocaleString('en-IN')} km`,
    travelTime: formatDuration(durationMinutes),
    origin: startLocation || 'New Delhi',
    destination: destinationData.name,
    mode: mode,
    summary: `Curated ${mode} transit link connecting ${startLocation} with ${destinationData.name} across ${distanceKm.toLocaleString('en-IN')} km.`
  };
}

module.exports = {
  getRoute,
  calculateHaversineDistance
};
