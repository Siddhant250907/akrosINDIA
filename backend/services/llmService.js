/**
 * llmService.js
 * Gemini LLM integration service for akrosINDIA backend.
 * Uses official @google/genai SDK with exponential backoff and fallback model handling.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables if not already loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

const { GoogleGenAI } = require('@google/genai');

// Model constants
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash';

// Backoff delays in milliseconds: 2s -> 4s -> 8s
const RETRY_DELAYS_MS = [2000, 4000, 8000];

/**
 * Initializes and returns the Gemini client using process.env.GEMINI_API_KEY.
 * Never logs or prints the API key.
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in backend/.env');
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

/**
 * Utility helper to pause execution for a given duration.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if an error represents a 503 / UNAVAILABLE / high demand condition.
 */
function isUnavailableError(err) {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const status = (err.status || '').toString().toLowerCase();
  const code = (err.code || err.statusCode || '').toString();

  return (
    status === 'unavailable' ||
    status === '503' ||
    code === '503' ||
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('spikes in demand')
  );
}

/**
 * Executes a single content generation attempt for a given model.
 */
async function executeModelCall(ai, modelName, prompt) {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  const text = response.text ? response.text.trim() : '';
  if (!text) {
    throw new Error('Empty response received from Gemini model');
  }
  return text;
}

/**
 * Sends a prompt to Gemini with exponential backoff and model fallback.
 * @param {string} prompt - The text prompt to send to Gemini
 * @returns {Promise<{ text: string, model: string, response: string }>}
 */
async function generateTripTest(prompt) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new Error('Prompt must be a non-empty string');
  }

  const ai = getGeminiClient();

  // 1. Try Primary Model with up to 3 retries (total 4 attempts) on 503/UNAVAILABLE
  const maxPrimaryAttempts = 1 + RETRY_DELAYS_MS.length; // 1 initial + 3 retries

  for (let attempt = 1; attempt <= maxPrimaryAttempts; attempt++) {
    try {
      const text = await executeModelCall(ai, PRIMARY_MODEL, prompt);
      return {
        text,
        response: text,
        model: PRIMARY_MODEL,
      };
    } catch (err) {
      const errorStatus = isUnavailableError(err) ? '503 UNAVAILABLE' : err.status || 'ERROR';
      console.log(`[LLM Service] Model: ${PRIMARY_MODEL} | Attempt: ${attempt}/${maxPrimaryAttempts} | Status: ${errorStatus}`);

      // If it's a 503/UNAVAILABLE and we have retries left, wait using backoff
      if (isUnavailableError(err) && attempt <= RETRY_DELAYS_MS.length) {
        const delay = RETRY_DELAYS_MS[attempt - 1];
        console.log(`[LLM Service] Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else if (!isUnavailableError(err)) {
        // For non-transient errors (e.g. auth), break early to fallback
        break;
      }
    }
  }

  // 2. If primary attempts fail, try Fallback Model (gemini-3.5-flash)
  console.log(`[LLM Service] Switching to fallback model: ${FALLBACK_MODEL}`);
  const maxFallbackAttempts = 2;

  for (let attempt = 1; attempt <= maxFallbackAttempts; attempt++) {
    try {
      const text = await executeModelCall(ai, FALLBACK_MODEL, prompt);
      return {
        text,
        response: text,
        model: FALLBACK_MODEL,
      };
    } catch (err) {
      const errorStatus = isUnavailableError(err) ? '503 UNAVAILABLE' : err.status || 'ERROR';
      console.log(`[LLM Service] Model: ${FALLBACK_MODEL} | Attempt: ${attempt}/${maxFallbackAttempts} | Status: ${errorStatus}`);

      if (isUnavailableError(err) && attempt < maxFallbackAttempts) {
        await sleep(2000);
      }
    }
  }

  // 3. All attempts exhausted
  throw new Error('Gemini service temporarily unavailable');
}

module.exports = {
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  generateTripTest,
};
