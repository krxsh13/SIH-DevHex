/**
 * Authentication Middleware - Essential MVP version
 * Basic JWT authentication and authorization
 */

const { verifyToken } = require('../utils/auth');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

/**
 * Authenticate user with JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('Access token is required', 401, 'NO_TOKEN'));
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 401, 'USER_NOT_FOUND'));
    }
    
    if (!user.isActive) {
      return next(new AppError('User account is deactivated', 401, 'ACCOUNT_DEACTIVATED'));
    }
    
    // Add user to request
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    next(error);
  }
};

/**
 * Authorize user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
    }
    
    next();
  };
};

/**
 * Optional authentication (for public routes that can benefit from user context)
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};