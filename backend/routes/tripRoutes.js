/**
 * tripRoutes.js
 * Routing for akrosINDIA trip planning endpoints.
 */

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// POST /api/trip/plan - Generate bespoke trip plans and LLM itinerary
router.post('/plan', tripController.planTrip);

// GET /api/trip/destinations - Available destinations catalogue
router.get('/destinations', tripController.getDestinations);

module.exports = router;
