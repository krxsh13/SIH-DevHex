const dbConnection = require('../config/db');

/**
 * Database connection middleware
 * Ensures database is connected before processing requests
 */

/**
 * Middleware to check database connection status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const checkDatabaseConnection = (req, res, next) => {
  try {
    const isConnected = dbConnection.getConnectionStatus();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: {
          message: 'Database service unavailable. Please try again later.',
          code: 'DATABASE_UNAVAILABLE',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Add database connection details to request object for debugging
    req.dbConnection = dbConnection.getConnectionDetails();
    next();
    
  } catch (error) {
    console.error('Database connection middleware error:', error.message);
    
    return res.status(503).json({
      success: false,
      error: {
        message: 'Database connection check failed',
        code: 'DATABASE_CHECK_FAILED',
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Middleware to handle database connection errors during request processing
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleDatabaseError = (error, req, res, next) => {
  // Check if error is database-related
  if (error.name === 'MongoError' || 
      error.name === 'MongooseError' || 
      error.name === 'ValidationError' ||
      error.message.includes('MongoDB') ||
      error.message.includes('mongoose')) {
    
    console.error('Database error during request processing:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Handle specific database errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Data validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (error.code === 11000) { // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: {
          message: `Duplicate value for field: ${field}`,
          code: 'DUPLICATE_KEY_ERROR',
          field: field,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Generic database error
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Pass non-database errors to next error handler
  next(error);
};

/**
 * Health check endpoint for database status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const databaseHealthCheck = async (req, res) => {
  try {
    const connectionDetails = dbConnection.getConnectionDetails();
    const testResult = await dbConnection.testConnection();
    
    const healthStatus = {
      database: {
        status: connectionDetails.status,
        connection: connectionDetails,
        test: testResult
      },
      timestamp: new Date().toISOString()
    };

    if (testResult.success) {
      res.status(200).json({
        success: true,
        data: healthStatus
      });
    } else {
      res.status(503).json({
        success: false,
        error: {
          message: 'Database health check failed',
          code: 'DATABASE_HEALTH_CHECK_FAILED',
          details: healthStatus
        }
      });
    }
  } catch (error) {
    console.error('Database health check error:', error.message);
    
    res.status(503).json({
      success: false,
      error: {
        message: 'Database health check failed',
        code: 'DATABASE_HEALTH_CHECK_ERROR',
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Middleware to ensure database connection is established before starting server
 * @returns {Promise<Function>}
 */
const ensureDatabaseConnection = async () => {
  try {
    if (!dbConnection.getConnectionStatus()) {
      console.log('🔄 Establishing database connection...');
      await dbConnection.connect();
    }
    
    return (req, res, next) => {
      next();
    };
  } catch (error) {
    console.error('Failed to establish database connection:', error.message);
    throw error;
  }
};

module.exports = {
  checkDatabaseConnection,
  handleDatabaseError,
  databaseHealthCheck,
  ensureDatabaseConnection
};