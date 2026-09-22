/**
 * budgetService.js
 * Review 1 Prototype Budget Calculation Service.
 * Factual and transparent travel cost estimator:
 * - Transport cost (round-trip or private vehicle charter)
 * - Stay cost (per-night * duration)
 * - Food allowance (curated dining based on travel tier)
 * - Curated activities & entry fees
 * - Local transit estimate
 * - Total estimated package cost
 */

const DAILY_FOOD_RATES = {
  classic: 1000,    // Authentic local bistros, cafes, thalis
  heritage: 2400,   // Heritage dining rooms, courtyards, specialty restaurants
  luxury: 4800      // Fine dining, palace banquets, bespoke chef tables
};

const DAILY_LOCAL_TRANSIT_RATES = {
  classic: 600,     // Local autos, shared cabs, scooter rental
  heritage: 1500,   // Dedicated local air-conditioned sedan
  luxury: 3000      // Private luxury chauffeur vehicle at destination
};

/**
 * Calculates complete factual budget breakdown for a trip plan.
 * @param {object} params
 * @param {object} params.transport - Selected transport item { cost, mode, tier, provider }
 * @param {object} params.stay - Selected stay item { pricePerNight, tier, name }
 * @param {number} params.duration - Duration in days (e.g. 4)
 * @param {Array<object>} params.activities - Curated activities included in plan
 * @param {Array<object>} params.places - Sightseeing places included in plan
 * @param {string} params.tier - Plan tier ('classic' | 'heritage' | 'luxury')
 * @returns {object} Full budget breakdown with itemized costs and total estimate
 */
function calculateTripBudget({ transport, stay, duration, activities = [], places = [], tier = 'classic' }) {
  const numDays = Math.max(1, parseInt(duration, 10) || 3);
  const numNights = Math.max(1, numDays - 1);

  // 1. Transport Cost:
  // For Car, the cost is the entire dedicated private vehicle hire.
  // For Flight / Train / Bus, the cost is return tickets (cost * 2).
  const isCar = (transport.mode || '').toLowerCase() === 'car';
  const transportCost = isCar ? transport.cost : transport.cost * 2;

  // 2. Stay Cost:
  const stayCost = (stay.pricePerNight || 3000) * numNights;

  // 3. Food Cost:
  const foodRate = DAILY_FOOD_RATES[tier] || DAILY_FOOD_RATES.classic;
  const foodCost = foodRate * numDays;

  // 4. Activity & Sightseeing Cost:
  const placeEntryFees = places.reduce((sum, p) => sum + (p.entryFee || 0), 0);
  const activityFees = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const activityCost = placeEntryFees + activityFees;

  // 5. Local Travel Cost:
  // If dedicated private chauffeur car was selected for travel, destination local transit is largely included.
  const localRate = isCar ? Math.round((DAILY_LOCAL_TRANSIT_RATES[tier] || 600) * 0.3) : (DAILY_LOCAL_TRANSIT_RATES[tier] || 600);
  const localTravelCost = localRate * numDays;

  // 6. Total Estimate
  const totalEstimate = transportCost + stayCost + foodCost + activityCost + localTravelCost;

  return {
    transportCost,
    stayCost,
    foodCost,
    activityCost,
    localTravelCost,
    totalEstimate,
    numDays,
    numNights,
    summary: {
      transport: `₹${transportCost.toLocaleString('en-IN')}`,
      stay: `₹${stayCost.toLocaleString('en-IN')}`,
      food: `₹${foodCost.toLocaleString('en-IN')}`,
      activities: `₹${activityCost.toLocaleString('en-IN')}`,
      localTravel: `₹${localTravelCost.toLocaleString('en-IN')}`,
      total: `₹${totalEstimate.toLocaleString('en-IN')}`
    }
  };
}

module.exports = {
  calculateTripBudget
};
