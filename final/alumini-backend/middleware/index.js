/**
 * Middleware Index
 * Central export point for all middleware modules
 */

// Import all middleware modules
const errorHandler = require('./errorHandler');
const cors = require('./cors');
const validation = require('./validation');
const logger = require('./logger');
const database = require('./database');

// Export all middleware for easy importing
module.exports = {
  // Error handling middleware
  ...errorHandler,
  
  // CORS middleware
  ...cors,
  
  // Validation middleware
  ...validation,
  
  // Logging middleware
  ...logger,
  
  // Database middleware
  ...database
};

// Also export individual modules for specific imports
module.exports.errorHandler = errorHandler;
module.exports.cors = cors;
module.exports.validation = validation;
module.exports.logger = logger;
module.exports.database = database;