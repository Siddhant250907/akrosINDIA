/**
 * server.js
 * Main Express entry point for akrosINDIA Backend.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend Vite client and localhost origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint: GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'akrosINDIA Backend API',
    model: 'gemini-3.8-flash (@google/genai)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

const tripRoutes = require('./routes/tripRoutes');
app.use('/api/trip', tripRoutes);

// 404 handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.message || err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` akrosINDIA Backend running on port ${PORT}`);
  console.log(` Health Check:  GET  http://localhost:${PORT}/api/health`);
  console.log(` AI Test:       GET  http://localhost:${PORT}/api/ai/test`);
  console.log(` Trip Planning: POST http://localhost:${PORT}/api/trip/plan`);
  console.log(`=========================================`);
});

module.exports = app;
