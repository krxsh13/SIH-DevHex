/**
 * Input Validation Middleware
 * Provides comprehensive input validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Handle validation results and format errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    console.warn('Validation errors:', {
      url: req.url,
      method: req.method,
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });

    return next(new AppError(
      'Input validation failed',
      400,
      'VALIDATION_ERROR',
      { errors: formattedErrors }
    ));
  }
  
  next();
};

/**
 * Sanitize and validate common input patterns
 */
const commonValidations = {
  // Email validation
  email: () => 
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

  // Password validation
  password: (minLength = 8) =>
    body('password')
      .isLength({ min: minLength })
      .withMessage(`Password must be at least ${minLength} characters long`)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Name validation
  name: (field) =>
    body(field)
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage(`${field} must be between 2 and 50 characters`)
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage(`${field} must contain only letters and spaces`),

  // Phone validation
  phone: () =>
    body('phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),

  // MongoDB ObjectId validation
  mongoId: (field = 'id') =>
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),

  // Date validation
  date: (field) =>
    body(field)
      .isISO8601()
      .toDate()
      .withMessage(`${field} must be a valid date`),

  // URL validation
  url: (field) =>
    body(field)
      .optional()
      .isURL()
      .withMessage(`${field} must be a valid URL`),

  // Numeric validation
  number: (field, min = 0, max = null) => {
    let validation = body(field)
      .isNumeric()
      .withMessage(`${field} must be a number`)
      .custom(value => value >= min)
      .withMessage(`${field} must be at least ${min}`);
    
    if (max !== null) {
      validation = validation
        .custom(value => value <= max)
        .withMessage(`${field} must not exceed ${max}`);
    }
    
    return validation;
  },

  // String length validation
  stringLength: (field, min = 1, max = 255) =>
    body(field)
      .trim()
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`),

  // Enum validation
  enum: (field, allowedValues) =>
    body(field)
      .isIn(allowedValues)
      .withMessage(`${field} must be one of: ${allowedValues.join(', ')}`),

  // Array validation
  array: (field, minLength = 0, maxLength = null) => {
    let validation = body(field)
      .isArray({ min: minLength })
      .withMessage(`${field} must be an array with at least ${minLength} items`);
    
    if (maxLength !== null) {
      validation = validation
        .isArray({ max: maxLength })
        .withMessage(`${field} must not have more than ${maxLength} items`);
    }
    
    return validation;
  }
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  commonValidations.email(),
  commonValidations.password(),
  commonValidations.name('firstName'),
  commonValidations.name('lastName'),
  commonValidations.phone(),
  body('role')
    .optional()
    .isIn(['Alumni', 'Admin'])
    .withMessage('Role must be either Alumni or Admin'),
  handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
  commonValidations.email(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  commonValidations.name('firstName').optional(),
  commonValidations.name('lastName').optional(),
  commonValidations.phone(),
  body('address.street').optional().trim().isLength({ max: 100 }),
  body('address.city').optional().trim().isLength({ max: 50 }),
  body('address.state').optional().trim().isLength({ max: 50 }),
  body('address.zipCode').optional().trim().isLength({ max: 10 }),
  body('address.country').optional().trim().isLength({ max: 50 }),
  commonValidations.array('skills', 0, 20),
  commonValidations.array('interests', 0, 10),
  commonValidations.url('socialLinks.linkedin'),
  commonValidations.url('socialLinks.twitter'),
  commonValidations.url('socialLinks.facebook'),
  commonValidations.url('socialLinks.website'),
  handleValidationErrors
];

/**
 * Event creation/update validation
 */
const validateEvent = [
  commonValidations.stringLength('title', 3, 100),
  commonValidations.stringLength('description', 10, 1000),
  commonValidations.enum('eventType', ['Conference', 'Workshop', 'Networking', 'Reunion', 'Other']),
  commonValidations.date('startDate'),
  commonValidations.date('endDate'),
  body('endDate')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  commonValidations.number('capacity', 1, 10000),
  commonValidations.date('registrationDeadline'),
  body('location.venue').optional().trim().isLength({ max: 100 }),
  body('location.address').optional().trim().isLength({ max: 200 }),
  body('location.city').optional().trim().isLength({ max: 50 }),
  body('location.state').optional().trim().isLength({ max: 50 }),
  body('location.isVirtual').optional().isBoolean(),
  commonValidations.url('location.virtualLink'),
  handleValidationErrors
];

/**
 * Donation validation
 */
const validateDonation = [
  commonValidations.number('amount', 1, 1000000),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR'])
    .withMessage('Currency must be INR, USD, or EUR'),
  commonValidations.enum('donationType', ['One-time', 'Monthly', 'Annual']),
  commonValidations.enum('purpose', ['General Fund', 'Scholarship', 'Infrastructure', 'Research', 'Other']),
  body('notes').optional().trim().isLength({ max: 500 }),
  body('isAnonymous').optional().isBoolean(),
  handleValidationErrors
];

/**
 * Message validation
 */
const validateMessage = [
  commonValidations.stringLength('subject', 3, 100),
  commonValidations.stringLength('content', 10, 2000),
  commonValidations.array('recipients', 1, 100),
  body('recipients.*')
    .isMongoId()
    .withMessage('Each recipient must be a valid user ID'),
  commonValidations.enum('messageType', ['Direct', 'Announcement', 'System']),
  commonValidations.enum('priority', ['Low', 'Normal', 'High']),
  handleValidationErrors
];

/**
 * Query parameter validation for pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .matches(/^[a-zA-Z_]+(:asc|:desc)?$/)
    .withMessage('Sort format should be field:asc or field:desc'),
  handleValidationErrors
];

/**
 * Search query validation
 */
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('fields')
    .optional()
    .matches(/^[a-zA-Z_,]+$/)
    .withMessage('Fields parameter must contain only letters, underscores, and commas'),
  handleValidationErrors
];

/**
 * Generic input sanitization middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attempts
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove script tags and other potentially dangerous content
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

module.exports = {
  handleValidationErrors,
  commonValidations,
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validateEvent,
  validateDonation,
  validateMessage,
  validatePagination,
  validateSearch,
  sanitizeInput
};