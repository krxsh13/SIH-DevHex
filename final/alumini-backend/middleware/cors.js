/**
 * CORS Middleware Configuration
 * Handles Cross-Origin Resource Sharing for frontend integration
 */

const cors = require('cors');

/**
 * CORS configuration options
 */
const corsOptions = {
  // Allow requests from frontend development and production URLs
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',        // Next.js development server
      'http://127.0.0.1:3000',        // Alternative localhost
      'http://localhost:3001',        // Alternative port
      'https://alumni-management.vercel.app', // Production frontend (example)
      process.env.FRONTEND_URL,       // Environment-specific frontend URL
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'), false);
    }
  },

  // Allow specific HTTP methods
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS'
  ],

  // Allow specific headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Cache preflight response for 24 hours
  maxAge: 86400,

  // Handle preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204
};

/**
 * Development CORS configuration (more permissive)
 */
const devCorsOptions = {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

/**
 * Production CORS configuration (more restrictive)
 */
const prodCorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_FRONTEND_URL,
      // Add other production domains as needed
    ].filter(Boolean);

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

/**
 * Get CORS configuration based on environment
 * @returns {Object} CORS configuration object
 */
const getCorsConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return prodCorsOptions;
    case 'development':
      return devCorsOptions;
    case 'test':
      return devCorsOptions; // Use permissive config for testing
    default:
      return corsOptions;
  }
};

/**
 * CORS middleware factory
 * @returns {Function} Configured CORS middleware
 */
const createCorsMiddleware = () => {
  const config = getCorsConfig();
  
  console.log(`🌐 CORS configured for ${process.env.NODE_ENV || 'development'} environment`);
  
  return cors(config);
};

/**
 * Custom CORS error handler
 * @param {Error} err - CORS error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleCorsError = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    console.error('CORS Error:', {
      origin: req.get('Origin'),
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    return res.status(403).json({
      success: false,
      error: {
        message: 'Cross-Origin Request Blocked',
        code: 'CORS_ERROR',
        details: 'This request is not allowed from your origin',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  next(err);
};

/**
 * Middleware to log CORS requests for debugging
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logCorsRequests = (req, res, next) => {
  const origin = req.get('Origin');
  
  if (origin && process.env.NODE_ENV === 'development') {
    console.log(`🌐 CORS Request: ${req.method} ${req.url} from ${origin}`);
  }
  
  next();
};

module.exports = {
  createCorsMiddleware,
  handleCorsError,
  logCorsRequests,
  corsOptions,
  devCorsOptions,
  prodCorsOptions
};