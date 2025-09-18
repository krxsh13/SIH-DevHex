/**
 * Request Logging Middleware
 * Provides comprehensive request logging for debugging and monitoring
 */

/**
 * Generate unique request ID for tracking
 * @returns {string} Unique request identifier
 */
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} Client IP address
 */
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
};

/**
 * Get user agent information
 * @param {Object} req - Express request object
 * @returns {Object} Parsed user agent info
 */
const getUserAgentInfo = (req) => {
  const userAgent = req.get('User-Agent') || 'unknown';
  
  // Simple user agent parsing
  const isBot = /bot|crawler|spider|scraper/i.test(userAgent);
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const browser = userAgent.match(/(chrome|firefox|safari|edge|opera)/i)?.[1] || 'unknown';
  
  return {
    raw: userAgent,
    isBot,
    isMobile,
    browser
  };
};

/**
 * Sanitize sensitive data from logs
 * @param {Object} data - Data to sanitize
 * @returns {Object} Sanitized data
 */
const sanitizeLogData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = [
    'password', 'token', 'authorization', 'cookie', 'session',
    'secret', 'key', 'private', 'confidential', 'ssn', 'credit'
  ];
  
  const sanitized = { ...data };
  
  const sanitizeObject = (obj, path = '') => {
    for (let key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (sensitiveFields.some(field => 
        key.toLowerCase().includes(field) || 
        currentPath.toLowerCase().includes(field)
      )) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key], currentPath);
      }
    }
  };
  
  sanitizeObject(sanitized);
  return sanitized;
};

/**
 * Format log message with consistent structure
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Formatted log entry
 */
const formatLogMessage = (level, message, metadata = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...metadata
  };
};

/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Add request ID to request object for use in other middleware
  req.requestId = requestId;
  
  // Add request ID to response headers for client tracking
  res.set('X-Request-ID', requestId);
  
  const clientIP = getClientIP(req);
  const userAgent = getUserAgentInfo(req);
  
  // Log incoming request
  const requestLog = formatLogMessage('info', 'Incoming Request', {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: sanitizeLogData(req.query),
    headers: sanitizeLogData({
      'content-type': req.get('Content-Type'),
      'accept': req.get('Accept'),
      'origin': req.get('Origin'),
      'referer': req.get('Referer'),
      'user-agent': req.get('User-Agent')
    }),
    body: req.method !== 'GET' ? sanitizeLogData(req.body) : undefined,
    clientIP,
    userAgent: userAgent.raw,
    isMobile: userAgent.isMobile,
    isBot: userAgent.isBot,
    browser: userAgent.browser
  });
  
  console.log(JSON.stringify(requestLog, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    // Log response
    const responseLog = formatLogMessage('info', 'Outgoing Response', {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(data).length,
      success: res.statusCode < 400,
      clientIP
    });
    
    console.log(JSON.stringify(responseLog, null, process.env.NODE_ENV === 'development' ? 2 : 0));
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  // Log when request finishes (for non-JSON responses)
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (!res.headersSent || res.get('Content-Type')?.includes('json')) {
      return; // Already logged in res.json override
    }
    
    const responseLog = formatLogMessage('info', 'Request Completed', {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: res.statusCode < 400,
      clientIP
    });
    
    console.log(JSON.stringify(responseLog, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  });
  
  next();
};

/**
 * Error logging middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorLogger = (err, req, res, next) => {
  const errorLog = formatLogMessage('error', 'Request Error', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    error: {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    clientIP: getClientIP(req),
    userAgent: req.get('User-Agent')
  });
  
  console.error(JSON.stringify(errorLog, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  
  next(err);
};

/**
 * Performance monitoring middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const performanceLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      const slowRequestLog = formatLogMessage('warn', 'Slow Request Detected', {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        clientIP: getClientIP(req)
      });
      
      console.warn(JSON.stringify(slowRequestLog, null, 2));
    }
  });
  
  next();
};

/**
 * Security event logger
 * @param {string} event - Security event type
 * @param {Object} req - Express request object
 * @param {Object} details - Additional event details
 */
const logSecurityEvent = (event, req, details = {}) => {
  const securityLog = formatLogMessage('warn', `Security Event: ${event}`, {
    requestId: req.requestId,
    event,
    method: req.method,
    url: req.originalUrl || req.url,
    clientIP: getClientIP(req),
    userAgent: req.get('User-Agent'),
    details: sanitizeLogData(details),
    timestamp: new Date().toISOString()
  });
  
  console.warn(JSON.stringify(securityLog, null, 2));
};

/**
 * Database operation logger
 * @param {string} operation - Database operation type
 * @param {string} collection - Database collection
 * @param {Object} query - Database query
 * @param {number} duration - Operation duration in ms
 * @param {Object} req - Express request object (optional)
 */
const logDatabaseOperation = (operation, collection, query, duration, req = null) => {
  const dbLog = formatLogMessage('info', `Database Operation: ${operation}`, {
    requestId: req?.requestId,
    operation,
    collection,
    query: sanitizeLogData(query),
    duration: `${duration}ms`,
    slow: duration > 100 // Flag slow queries
  });
  
  if (duration > 100) {
    console.warn(JSON.stringify(dbLog, null, 2));
  } else if (process.env.NODE_ENV === 'development') {
    console.log(JSON.stringify(dbLog, null, 2));
  }
};

module.exports = {
  requestLogger,
  errorLogger,
  performanceLogger,
  logSecurityEvent,
  logDatabaseOperation,
  generateRequestId,
  getClientIP,
  sanitizeLogData,
  formatLogMessage
};