/**
 * tripController.js
 * Trip Planning Controller for akrosINDIA Review 1.
 * Coordinates route, recommendation, budget, and LLM services.
 */

const path = require('path');
const fs = require('fs');
const routeService = require('../services/routeService');
const recommendationService = require('../services/recommendationService');
const llmService = require('../services/llmService');

// Load destinations data
const destinations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/destinations.json'), 'utf8')
);

/**
 * Resolves user-provided destination against destinations database
 */
function findDestination(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.toLowerCase().trim();

  // 1. Direct match by ID
  const directId = destinations.find((d) => d.id.toLowerCase() === clean);
  if (directId) return directId;

  // 2. Direct match or substring in Name
  const directName = destinations.find(
    (d) => d.name.toLowerCase() === clean || clean.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(clean)
  );
  if (directName) return directName;

  // 3. Match through aliases
  const matchAlias = destinations.find((d) =>
    d.aliases.some((alias) => clean.includes(alias) || alias.includes(clean))
  );
  if (matchAlias) return matchAlias;

  return null;
}

/**
 * POST /api/trip/plan
 * Generates bespoke travel itinerary and comparative plans.
 */
async function planTrip(req, res, next) {
  try {
    const {
      startingLocation,
      startLocation,
      destination,
      budget,
      duration,
      preferredTransport,
      travelMode,
      interests
    } = req.body || {};

    // 1. Validate Starting Location
    const origin = (startingLocation || startLocation || '').trim();
    if (!origin) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: startingLocation (e.g. "New Delhi", "Mumbai")'
      });
    }

    // 2. Validate Destination
    const destQuery = (destination || '').trim();
    if (!destQuery) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: destination (e.g. "Goa", "Jaipur", "Manali", "Kerala", "Coorg")'
      });
    }

    const destinationData = findDestination(destQuery);
    if (!destinationData) {
      const availableNames = destinations.map((d) => d.name);
      return res.status(404).json({
        success: false,
        error: `Destination "${destQuery}" not found in Review 1 prototype database.`,
        availableDestinations: availableNames
      });
    }

    // 3. Validate Budget
    // Remove non-digits if passed as "₹65,000"
    const parsedBudget = typeof budget === 'string'
      ? parseInt(budget.replace(/[^0-9]/g, ''), 10)
      : parseInt(budget, 10);

    if (isNaN(parsedBudget) || parsedBudget < 1000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid budget. Please provide a realistic budget of at least ₹1,000.'
      });
    }

    // 4. Validate Duration
    const parsedDuration = typeof duration === 'string'
      ? parseInt(duration.replace(/[^0-9]/g, ''), 10)
      : parseInt(duration, 10);

    if (isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 30) {
      return res.status(400).json({
        success: false,
        error: 'Invalid duration. Duration must be between 1 and 30 days.'
      });
    }

    // Normalize transport mode and interests
    const transportPreference = preferredTransport || travelMode || 'Flight';
    const userInterests = Array.isArray(interests) && interests.length > 0
      ? interests
      : destinationData.popularInterests;

    const tripInput = {
      startingLocation: origin,
      destination: destinationData.name,
      budget: parsedBudget,
      duration: parsedDuration,
      preferredTransport: transportPreference,
      interests: userInterests
    };

    // 5. Calculate Route Information
    const routeData = await routeService.getRoute(origin, destinationData, transportPreference);

    // 6. Generate Preferred and Recommended Factual Plans
    const { preferredPlan, recommendedPlan } = recommendationService.generatePlans({
      tripInput,
      destinationData,
      routeData
    });

    // 7. Synthesize Day-Wise Itineraries via LLM Service (Gemini API)
    let llmResult;
    try {
      llmResult = await llmService.generateItineraries({
        tripInput,
        destinationData,
        routeData,
        preferredPlan,
        recommendedPlan
      });
    } catch (llmErr) {
      console.error('[tripController] LLM generation error:', llmErr.message);
      return res.status(502).json({
        success: false,
        error: `LLM Service Error: ${llmErr.message}. Ensure GEMINI_API_KEY is configured in backend/.env.`
      });
    }

    // 8. Attach LLM-generated day-wise itinerary & explanation to plans
    preferredPlan.itinerary = llmResult.preferredItinerary;
    preferredPlan.explanation = llmResult.preferredExplanation;

    recommendedPlan.itinerary = llmResult.recommendedItinerary;
    recommendedPlan.explanation = llmResult.recommendedExplanation;

    // 9. Return standard JSON contract matching user specification
    return res.status(200).json({
      success: true,
      trip: {
        startLocation: origin,
        destination: destinationData.name,
        budget: parsedBudget,
        duration: parsedDuration
      },
      route: {
        distance: routeData.distance,
        travelTime: routeData.travelTime,
        summary: routeData.summary
      },
      preferredPlan: {
        planTitle: preferredPlan.planTitle,
        tagline: preferredPlan.tagline,
        explanation: preferredPlan.explanation,
        tier: preferredPlan.tier,
        transport: preferredPlan.transport,
        stay: preferredPlan.stay,
        places: preferredPlan.places,
        activities: preferredPlan.activities,
        costBreakdown: preferredPlan.costBreakdown,
        estimatedCost: preferredPlan.estimatedCost,
        itinerary: preferredPlan.itinerary
      },
      recommendedPlan: {
        planTitle: recommendedPlan.planTitle,
        tagline: recommendedPlan.tagline,
        explanation: recommendedPlan.explanation,
        tier: recommendedPlan.tier,
        transport: recommendedPlan.transport,
        stay: recommendedPlan.stay,
        places: recommendedPlan.places,
        activities: recommendedPlan.activities,
        costBreakdown: recommendedPlan.costBreakdown,
        estimatedCost: recommendedPlan.estimatedCost,
        itinerary: recommendedPlan.itinerary
      }
    });
  } catch (err) {
    console.error('[tripController] Unexpected error in planTrip:', err);
    return next(err);
  }
}

/**
 * GET /api/destinations
 * Returns available destination list for frontend autocomplete/discovery
 */
function getDestinations(req, res) {
  return res.status(200).json({
    success: true,
    count: destinations.length,
    destinations: destinations.map((d) => ({
      id: d.id,
      name: d.name,
      state: d.state,
      region: d.region,
      description: d.description,
      popularInterests: d.popularInterests
    }))
  });
}

module.exports = {
  planTrip,
  getDestinations
};
