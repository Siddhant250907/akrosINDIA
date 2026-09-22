/**
 * aiRoutes.js
 * AI test routing for akrosINDIA Gemini integration.
 */

const express = require('express');
const router = express.Router();
const { generateTripTest } = require('../services/llmService');

/**
 * GET /api/ai/test
 * Sends a test travel prompt to Gemini and returns the response with model name.
 */
router.get('/test', async (req, res) => {
  const testPrompt = 'Give a short one-line travel suggestion for visiting Goa in India.';

  try {
    const result = await generateTripTest(testPrompt);
    return res.status(200).json({
      success: true,
      model: result.model,
      response: result.response || result.text || result,
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      error: 'Gemini service temporarily unavailable',
    });
  }
});

module.exports = router;
