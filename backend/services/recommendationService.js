/**
 * recommendationService.js
 * Synthesizes factual Preferred Plan and Recommended Plan for the trip.
 * Rule: Backend calculates factual values (stays, transport, activities, budget);
 * LLM organizes and explains.
 */

const path = require('path');
const fs = require('fs');
const budgetService = require('./budgetService');

// Load JSON data files
const transportData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/transport.json'), 'utf8')
);
const staysData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/stays.json'), 'utf8')
);
const placesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/places.json'), 'utf8')
);

/**
 * Normalizes transport mode string to match dataset keys ('Flight', 'Train', 'Car', 'Bus')
 */
function normalizeMode(mode) {
  if (!mode) return 'Flight';
  const lower = mode.toLowerCase().trim();
  if (lower.includes('flight') || lower.includes('plane')) return 'Flight';
  if (lower.includes('train') || lower.includes('rail')) return 'Train';
  if (lower.includes('car') || lower.includes('drive') || lower.includes('cab')) return 'Car';
  if (lower.includes('bus') || lower.includes('coach')) return 'Bus';
  return 'Flight';
}

/**
 * Determines stay tier based on budget and duration
 */
function determineStayTier(budget, duration) {
  const numDays = Math.max(1, duration || 4);
  const perDayBudget = budget / numDays;

  if (budget >= 90000 || perDayBudget >= 18000) {
    return 'luxury';
  } else if (budget >= 40000 || perDayBudget >= 8000) {
    return 'heritage';
  } else {
    return 'classic';
  }
}

/**
 * Filters places and activities according to user interests
 */
function filterPlacesAndActivities(destId, userInterests = []) {
  const destInfo = placesData[destId] || placesData['goa'];
  const allPlaces = destInfo.places || [];
  const allActivities = destInfo.activities || [];

  const normalizedInterests = (userInterests || []).map((i) => i.toLowerCase());

  // Match places with user interests
  let matchedPlaces = allPlaces.filter((p) =>
    normalizedInterests.some((int) => (p.category || '').toLowerCase().includes(int))
  );

  // If few or no matches, take top places
  if (matchedPlaces.length < 3) {
    const remaining = allPlaces.filter((p) => !matchedPlaces.includes(p));
    matchedPlaces = [...matchedPlaces, ...remaining].slice(0, 4);
  } else {
    matchedPlaces = matchedPlaces.slice(0, 4);
  }

  // Match activities
  let matchedActivities = allActivities.filter((a) =>
    normalizedInterests.some((int) => (a.category || '').toLowerCase().includes(int))
  );

  if (matchedActivities.length === 0) {
    matchedActivities = allActivities.slice(0, 2);
  } else {
    matchedActivities = matchedActivities.slice(0, 2);
  }

  return {
    places: matchedPlaces,
    activities: matchedActivities
  };
}

/**
 * Builds Preferred Plan and Recommended Plan
 * @param {object} params
 * @param {object} params.tripInput - User inputs (budget, duration, preferredTransport, interests, etc.)
 * @param {object} params.destinationData - Destination metadata
 * @param {object} params.routeData - Route details
 * @returns {object} { preferredPlan, recommendedPlan }
 */
function generatePlans({ tripInput, destinationData, routeData }) {
  const destId = destinationData.id;
  const destTransports = transportData[destId] || transportData['goa'];
  const destStays = staysData[destId] || staysData['goa'];
  const destPlaces = placesData[destId] || placesData['goa'];

  const duration = Math.max(1, parseInt(tripInput.duration, 10) || 4);
  const budget = Math.max(5000, parseInt(tripInput.budget, 10) || 45000);
  const preferredMode = normalizeMode(tripInput.preferredTransport || tripInput.travelMode);
  const interests = Array.isArray(tripInput.interests) ? tripInput.interests : ['Heritage', 'Relaxation'];

  // ==========================================
  // 1. GENERATE PREFERRED PLAN
  // Strictly follows user's chosen transport and matches user's budget tier
  // ==========================================
  const preferredTier = determineStayTier(budget, duration);
  const preferredTransport = {
    mode: preferredMode,
    ...(destTransports[preferredMode] || destTransports['Flight'])
  };
  const preferredStay = destStays[preferredTier] || destStays['classic'];

  const { places: prefPlaces, activities: prefActivities } = filterPlacesAndActivities(
    destId,
    interests
  );

  const preferredBudget = budgetService.calculateTripBudget({
    transport: preferredTransport,
    stay: preferredStay,
    duration,
    activities: prefActivities,
    places: prefPlaces,
    tier: preferredTier
  });

  const preferredPlan = {
    planTitle: `${preferredMode} & ${preferredStay.tier} Journey`,
    tagline: `Formulated precisely around your chosen ${preferredMode.toLowerCase()} transit and ${interests.slice(0, 2).join(' & ')} preferences.`,
    tier: preferredStay.tier,
    transport: {
      mode: preferredTransport.mode,
      provider: preferredTransport.provider,
      transitDetails: preferredTransport.flightCode || preferredTransport.trainNumber || 'Private AC Vehicle',
      travelTime: preferredTransport.travelTime,
      cost: preferredTransport.cost,
      summary: preferredTransport.summary
    },
    stay: {
      name: preferredStay.name,
      tier: preferredStay.tier,
      pricePerNight: preferredStay.pricePerNight,
      totalNights: preferredBudget.numNights,
      stayCost: preferredBudget.stayCost,
      rating: preferredStay.rating,
      location: preferredStay.location,
      amenities: preferredStay.amenities,
      description: preferredStay.description
    },
    places: prefPlaces.map((p) => ({
      name: p.name,
      category: p.category,
      duration: p.duration,
      entryFee: p.entryFee,
      description: p.description
    })),
    activities: prefActivities.map((a) => ({
      name: a.name,
      category: a.category,
      cost: a.cost,
      description: a.description
    })),
    costBreakdown: preferredBudget.summary,
    estimatedCost: preferredBudget.totalEstimate,
    itinerary: [] // populated by LLM
  };

  // ==========================================
  // 2. GENERATE RECOMMENDED PLAN
  // An elevated / alternative plan based on duration and budget constraints
  // - If user chose Bus/Train: Recommend Flight or Express rail for faster transit & comfort.
  // - If user chose Standard/Classic tier: Recommend Royal Heritage or Imperial Sanctuary.
  // - If user already chose Flight & Luxury: Recommend Private Chauffeur + highest tier sanctuary.
  // ==========================================
  let recMode = 'Flight';
  let recTier = 'heritage';

  if (preferredTier === 'classic') {
    recTier = 'heritage';
    recMode = preferredMode === 'Bus' || preferredMode === 'Train' ? 'Flight' : preferredMode;
  } else if (preferredTier === 'heritage') {
    recTier = 'luxury';
    recMode = preferredMode === 'Car' ? 'Flight' : 'Car';
  } else {
    // If user has luxury budget
    recTier = 'luxury';
    recMode = 'Flight';
  }

  // Ensure transport option exists
  const recTransport = {
    mode: recMode,
    ...(destTransports[recMode] || destTransports['Flight'])
  };
  const recStay = destStays[recTier] || destStays['luxury'] || destStays['heritage'];

  // For recommended plan, pick signature places and premium activities
  const allDestActivities = destPlaces.activities || [];
  const recActivities = allDestActivities.slice(0, 3);
  const recPlaces = (destPlaces.places || []).slice(0, 4);

  const recommendedBudget = budgetService.calculateTripBudget({
    transport: recTransport,
    stay: recStay,
    duration,
    activities: recActivities,
    places: recPlaces,
    tier: recTier
  });

  const recommendedPlan = {
    planTitle: `akrosINDIA Signature ${recStay.tier} Expedition`,
    tagline: `Alternative curated plan offering optimal travel efficiency via ${recMode.toLowerCase()} transit and elevated palace hospitality.`,
    tier: recStay.tier,
    transport: {
      mode: recTransport.mode,
      provider: recTransport.provider,
      transitDetails: recTransport.flightCode || recTransport.trainNumber || 'Private AC Vehicle',
      travelTime: recTransport.travelTime,
      cost: recTransport.cost,
      summary: recTransport.summary
    },
    stay: {
      name: recStay.name,
      tier: recStay.tier,
      pricePerNight: recStay.pricePerNight,
      totalNights: recommendedBudget.numNights,
      stayCost: recommendedBudget.stayCost,
      rating: recStay.rating,
      location: recStay.location,
      amenities: recStay.amenities,
      description: recStay.description
    },
    places: recPlaces.map((p) => ({
      name: p.name,
      category: p.category,
      duration: p.duration,
      entryFee: p.entryFee,
      description: p.description
    })),
    activities: recActivities.map((a) => ({
      name: a.name,
      category: a.category,
      cost: a.cost,
      description: a.description
    })),
    costBreakdown: recommendedBudget.summary,
    estimatedCost: recommendedBudget.totalEstimate,
    itinerary: [] // populated by LLM
  };

  return {
    preferredPlan,
    recommendedPlan
  };
}

module.exports = {
  generatePlans
};
