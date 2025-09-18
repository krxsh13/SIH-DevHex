/**
 * Centralized Error Handling Middleware
 * Provides standardized error response format across the application
 */

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Development error response - includes stack trace
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || null,
      stack: err.stack,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Production error response - no stack trace
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || 'OPERATIONAL_ERROR',
        details: err.details || null,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 * @param {Error} err - MongoDB cast error
 * @returns {AppError} - Formatted application error
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle MongoDB duplicate field errors
 * @param {Error} err - MongoDB duplicate key error
 * @returns {AppError} - Formatted application error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} = '${value}'. Please use another value!`;
  
  return new AppError(message, 409, 'DUPLICATE_FIELD', {
    field,
    value
  });
};

/**
 * Handle MongoDB validation errors
 * @param {Error} err - MongoDB validation error
 * @returns {AppError} - Formatted application error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));

  const message = 'Invalid input data';
  return new AppError(message, 400, 'VALIDATION_ERROR', { errors });
};

/**
 * Handle JWT errors
 * @param {Error} err - JWT error
 * @returns {AppError} - Formatted application error
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');

/**
 * Handle JWT expired errors
 * @param {Error} err - JWT expired error
 * @returns {AppError} - Formatted application error
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401, 'TOKEN_EXPIRED');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Log error details for debugging
  console.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors and pass them to error handling middleware
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function with error handling
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleNotFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'ROUTE_NOT_FOUND');
  next(err);
};

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleNotFound
};