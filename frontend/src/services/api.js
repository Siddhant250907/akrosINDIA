/**
 * frontend/src/services/api.js
 * REST client for akrosINDIA backend.
 * Never stores or exposes private API keys to client-side code.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Checks backend health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Backend health check failed:', err.message);
    return null;
  }
}

/**
 * Sends trip parameters to backend to generate bespoke plans and day-by-day itineraries.
 * @param {object} tripData - { startLocation, destination, budget, duration, travelMode, interests }
 * @returns {Promise<object>} Backend response with { success, trip, route, preferredPlan, recommendedPlan }
 */
export async function planTripAPI(tripData) {
  const payload = {
    startingLocation: tripData.startLocation || 'New Delhi',
    destination: tripData.destination || 'Goa',
    budget: tripData.budget,
    duration: tripData.duration,
    preferredTransport: tripData.travelMode || tripData.preferredTransport || 'Flight',
    interests: tripData.interests || []
  };

  const response = await fetch(`${API_BASE_URL}/trip/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.error || `Error ${response.status}: Failed to generate trip plan`;
    throw new Error(errorMsg);
  }

  return data;
}
