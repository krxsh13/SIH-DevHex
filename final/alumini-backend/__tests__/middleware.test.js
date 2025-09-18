/**
 * Middleware Unit Tests
 * Comprehensive tests for all middleware components
 */

const request = require('supertest');
const express = require('express');
const {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleNotFound
} = require('../middleware/errorHandler');
const {
  createCorsMiddleware,
  handleCorsError
} = require('../middleware/cors');
const {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  sanitizeInput
} = require('../middleware/validation');
const {
  requestLogger,
  errorLogger,
  logSecurityEvent,
  sanitizeLogData
} = require('../middleware/logger');

describe('Error Handler Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('AppError Class', () => {
    test('should create AppError with all properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR', { field: 'test' });
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ field: 'test' });
      expect(error.isOperational).toBe(true);
    });

    test('should create AppError with minimal properties', () => {
      const error = new AppError('Simple error', 500);
      
      expect(error.message).toBe('Simple error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(null);
      expect(error.details).toBe(null);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('Global Error Handler', () => {
    test('should handle AppError in development', async () => {
      process.env.NODE_ENV = 'development';
      
      app.get('/test', (req, res, next) => {
        next(new AppError('Test error', 400, 'TEST_ERROR'));
      });
      app.use(globalErrorHandler);

      const response = await request(app).get('/test');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Test error');
      expect(response.body.error.code).toBe('TEST_ERROR');
      expect(response.body.error.stack).toBeDefined();
    });

    test('should handle AppError in production', async () => {
      process.env.NODE_ENV = 'production';
      
      app.get('/test', (req, res, next) => {
        next(new AppError('Test error', 400, 'TEST_ERROR'));
      });
      app.use(globalErrorHandler);

      const response = await request(app).get('/test');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Test error');
      expect(response.body.error.code).toBe('TEST_ERROR');
      expect(response.body.error.stack).toBeUndefined();
    });

    test('should handle non-operational errors in production', async () => {
      process.env.NODE_ENV = 'production';
      
      app.get('/test', (req, res, next) => {
        const error = new Error('Programming error');
        error.isOperational = false;
        next(error);
      });
      app.use(globalErrorHandler);

      const response = await request(app).get('/test');
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Something went wrong!');
      expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('catchAsync Function', () => {
    test('should catch async errors and pass to error handler', async () => {
      const asyncFunction = catchAsync(async (req, res, next) => {
        throw new AppError('Async error', 400);
      });

      app.get('/test', asyncFunction);
      app.use(globalErrorHandler);

      const response = await request(app).get('/test');
      
      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Async error');
    });
  });

  describe('handleNotFound Middleware', () => {
    test('should handle 404 errors', async () => {
      app.use(handleNotFound);
      app.use(globalErrorHandler);

      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(response.body.error.message).toContain('/nonexistent');
    });
  });
});

describe('CORS Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    process.env.NODE_ENV = 'development';
  });

  test('should create CORS middleware', () => {
    const corsMiddleware = createCorsMiddleware();
    expect(typeof corsMiddleware).toBe('function');
  });

  test('should handle CORS errors', async () => {
    app.use((req, res, next) => {
      const error = new Error('Not allowed by CORS policy');
      handleCorsError(error, req, res, next);
    });

    const response = await request(app).get('/test');
    
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('CORS_ERROR');
  });
});

describe('Validation Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('User Registration Validation', () => {
    test('should validate valid user registration data', async () => {
      app.post('/register', validateUserRegistration, (req, res) => {
        res.json({ success: true });
      });

      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890'
      };

      const response = await request(app)
        .post('/register')
        .send(validData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject invalid email', async () => {
      app.post('/register', validateUserRegistration, (req, res) => {
        res.json({ success: true });
      });
      app.use(globalErrorHandler);

      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/register')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should reject weak password', async () => {
      app.post('/register', validateUserRegistration, (req, res) => {
        res.json({ success: true });
      });
      app.use(globalErrorHandler);

      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/register')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('User Login Validation', () => {
    test('should validate valid login data', async () => {
      app.post('/login', validateUserLogin, (req, res) => {
        res.json({ success: true });
      });

      const validData = {
        email: 'test@example.com',
        password: 'anypassword'
      };

      const response = await request(app)
        .post('/login')
        .send(validData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject missing password', async () => {
      app.post('/login', validateUserLogin, (req, res) => {
        res.json({ success: true });
      });
      app.use(globalErrorHandler);

      const invalidData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/login')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize XSS attempts', () => {
      const req = {
        body: {
          name: '<script>alert("xss")</script>John',
          description: 'javascript:alert("xss")'
        },
        query: {},
        params: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.name).toBe('John');
      expect(req.body.description).toBe('alert("xss")');
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Logger Middleware', () => {
  let app;
  let consoleSpy;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Request Logger', () => {
    test('should log incoming requests', async () => {
      app.use(requestLogger);
      app.get('/test', (req, res) => {
        res.json({ message: 'test' });
      });

      await request(app).get('/test');

      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls.find(call => 
        call[0].includes('Incoming Request')
      );
      expect(logCall).toBeDefined();
    });

    test('should add request ID to response headers', async () => {
      app.use(requestLogger);
      app.get('/test', (req, res) => {
        res.json({ message: 'test' });
      });

      const response = await request(app).get('/test');

      expect(response.headers['x-request-id']).toBeDefined();
      expect(response.headers['x-request-id']).toMatch(/^req_\d+_[a-z0-9]+$/);
    });
  });

  describe('Error Logger', () => {
    test('should log errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const req = { 
        requestId: 'test-123', 
        method: 'GET', 
        url: '/test',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-agent')
      };
      const res = {};
      const next = jest.fn();
      const error = new Error('Test error');

      errorLogger(error, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Security Event Logger', () => {
    test('should log security events', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const req = {
        requestId: 'test-123',
        method: 'POST',
        url: '/login',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-agent')
      };

      logSecurityEvent('FAILED_LOGIN', req, { attempts: 3 });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const logCall = consoleWarnSpy.mock.calls[0][0];
      expect(logCall).toContain('FAILED_LOGIN');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Data Sanitization', () => {
    test('should sanitize sensitive data', () => {
      const sensitiveData = {
        username: 'john',
        password: 'secret123',
        token: 'jwt-token',
        publicInfo: 'safe data'
      };

      const sanitized = sanitizeLogData(sensitiveData);

      expect(sanitized.username).toBe('john');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.publicInfo).toBe('safe data');
    });

    test('should sanitize nested sensitive data', () => {
      const nestedData = {
        user: {
          name: 'john',
          credentials: {
            password: 'secret',
            apiKey: 'key123'
          }
        }
      };

      const sanitized = sanitizeLogData(nestedData);

      expect(sanitized.user.name).toBe('john');
      expect(sanitized.user.credentials.password).toBe('[REDACTED]');
      expect(sanitized.user.credentials.apiKey).toBe('[REDACTED]');
    });
  });
});

describe('Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Apply all middleware
    app.use(createCorsMiddleware());
    app.use(requestLogger);
    app.use(sanitizeInput);
  });

  test('should handle complete request flow with all middleware', async () => {
    app.post('/test', validateUserLogin, (req, res) => {
      res.json({ success: true, data: req.body });
    });
    app.use(globalErrorHandler);

    const response = await request(app)
      .post('/test')
      .send({
        email: 'test@example.com',
        password: 'validpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['x-request-id']).toBeDefined();
  });

  test('should handle validation errors in complete flow', async () => {
    app.post('/test', validateUserLogin, (req, res) => {
      res.json({ success: true });
    });
    app.use(globalErrorHandler);

    const response = await request(app)
      .post('/test')
      .send({
        email: 'invalid-email'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});