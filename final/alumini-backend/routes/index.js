/**
 * Main Routes Index - Essential MVP version
 * Central routing configuration
 */

const express = require('express');
const authRoutes = require('./auth');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Alumni Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;