# Middleware Infrastructure

This directory contains the core middleware infrastructure for the Alumni Management Backend API. The middleware provides essential functionality including error handling, CORS configuration, input validation, and request logging.

## Overview

The middleware infrastructure consists of four main components:

1. **Error Handler** - Centralized error handling with standardized responses
2. **CORS Configuration** - Cross-Origin Resource Sharing for frontend integration
3. **Input Validation** - Comprehensive input validation using express-validator
4. **Request Logger** - Detailed request/response logging for debugging and monitoring

## Components

### 1. Error Handler (`errorHandler.js`)

Provides centralized error handling with standardized error response format.

**Features:**
- Custom `AppError` class for application-specific errors
- Environment-specific error responses (development vs production)
- Automatic handling of MongoDB/Mongoose errors
- JWT error handling
- Async error catching utility

**Usage:**
```javascript
const { AppError, globalErrorHandler, catchAsync } = require('./middleware/errorHandler');

// Throw custom error
throw new AppError('User not found', 404, 'USER_NOT_FOUND');

// Wrap async functions
const asyncFunction = catchAsync(async (req, res, next) => {
  // Your async code here
});

// Apply global error handler (must be last middleware)
app.use(globalErrorHandler);
```

### 2. CORS Configuration (`cors.js`)

Handles Cross-Origin Resource Sharing for frontend integration.

**Features:**
- Environment-specific CORS configuration
- Configurable allowed origins, methods, and headers
- Credentials support for authentication
- CORS error handling

**Usage:**
```javascript
const { createCorsMiddleware } = require('./middleware/cors');

// Apply CORS middleware
app.use(createCorsMiddleware());
```

**Environment Variables:**
- `FRONTEND_URL` - Production frontend URL
- `ADMIN_FRONTEND_URL` - Admin frontend URL (optional)

### 3. Input Validation (`validation.js`)

Comprehensive input validation using express-validator.

**Features:**
- Pre-built validation rules for common patterns
- User registration and login validation
- Profile update validation
- Event, donation, and message validation
- Input sanitization to prevent XSS attacks
- Pagination and search query validation

**Usage:**
```javascript
const { validateUserRegistration, validateUserLogin } = require('./middleware/validation');

// Apply validation to routes
app.post('/register', validateUserRegistration, registerController);
app.post('/login', validateUserLogin, loginController);
```

**Available Validators:**
- `validateUserRegistration` - User registration data
- `validateUserLogin` - User login credentials
- `validateProfileUpdate` - Profile update data
- `validateEvent` - Event creation/update
- `validateDonation` - Donation data
- `validateMessage` - Message data
- `validatePagination` - Query pagination parameters
- `validateSearch` - Search query parameters

### 4. Request Logger (`logger.js`)

Detailed request/response logging for debugging and monitoring.

**Features:**
- Unique request ID generation
- Request/response logging with timing
- Error logging with context
- Security event logging
- Performance monitoring (slow request detection)
- Sensitive data sanitization
- Database operation logging

**Usage:**
```javascript
const { requestLogger, errorLogger, logSecurityEvent } = require('./middleware/logger');

// Apply request logging
app.use(requestLogger);

// Log security events
logSecurityEvent('FAILED_LOGIN', req, { attempts: 3 });

// Apply error logging
app.use(errorLogger);
```

## Integration

### Complete Middleware Setup

```javascript
const express = require('express');
const {
  createCorsMiddleware,
  requestLogger,
  sanitizeInput,
  globalErrorHandler,
  handleNotFound
} = require('./middleware');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply custom middleware in order
app.use(createCorsMiddleware());
app.use(requestLogger);
app.use(sanitizeInput);

// Your routes here
app.use('/api', routes);

// Error handling (must be last)
app.use(handleNotFound);
app.use(globalErrorHandler);
```

### Validation Example

```javascript
const { validateUserRegistration } = require('./middleware/validation');

app.post('/api/auth/register', validateUserRegistration, async (req, res, next) => {
  try {
    // Registration logic here
    const user = await createUser(req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
```

## Error Response Format

All errors follow a standardized format:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {},
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Logging Format

Request logs follow a structured JSON format:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "INFO",
  "message": "Incoming Request",
  "requestId": "req_1234567890_abc123",
  "method": "POST",
  "url": "/api/auth/login",
  "clientIP": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "duration": "45ms",
  "statusCode": 200
}
```

## Security Features

### Input Sanitization
- XSS prevention through script tag removal
- JavaScript protocol removal
- Event handler attribute removal

### Sensitive Data Protection
- Password fields automatically redacted in logs
- Token and key fields sanitized
- Configurable sensitive field patterns

### CORS Security
- Environment-specific origin validation
- Configurable allowed methods and headers
- Credentials handling for authentication

## Testing

Run the middleware tests:

```bash
npm test -- __tests__/middleware.test.js
```

## Demo

Run the middleware demonstration server:

```bash
npm run demo:middleware
```

This starts a demo server with all middleware components configured, providing test endpoints to demonstrate functionality.

## Environment Configuration

### Development
- Permissive CORS settings
- Detailed error messages with stack traces
- Verbose logging

### Production
- Restrictive CORS settings
- Sanitized error messages
- Optimized logging

### Environment Variables

```env
NODE_ENV=development|production|test
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_FRONTEND_URL=https://admin.your-domain.com
```

## Best Practices

1. **Error Handling**
   - Always use `AppError` for operational errors
   - Wrap async functions with `catchAsync`
   - Provide meaningful error codes and messages

2. **Validation**
   - Validate all user input
   - Use appropriate validation rules for each field
   - Sanitize input to prevent security vulnerabilities

3. **Logging**
   - Log all requests in production
   - Use structured logging format
   - Sanitize sensitive data in logs

4. **CORS**
   - Configure allowed origins based on environment
   - Use restrictive settings in production
   - Enable credentials only when necessary

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify origin is in allowed origins list
   - Ensure credentials are configured correctly

2. **Validation Failures**
   - Check validation rules match your data format
   - Verify required fields are provided
   - Review error details for specific field issues

3. **Logging Issues**
   - Ensure request logger is applied before routes
   - Check console output for log messages
   - Verify log format is valid JSON

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and verbose logging.