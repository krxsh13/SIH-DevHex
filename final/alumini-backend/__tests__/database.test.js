/**
 * Database connection and middleware tests
 * Tests database utilities without requiring a running MongoDB instance
 */

const { validateDatabaseConfig, validateEnvironmentVariables } = require('../utils/validateEnv');

// Mock environment variables for testing
const originalEnv = process.env;

describe('Database Configuration Tests', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('Environment Variable Validation', () => {
    test('should validate required database environment variables', () => {
      // Set required variables
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
      process.env.DB_NAME = 'test_db';
      process.env.JWT_SECRET = 'test_secret_key_that_is_long_enough_for_security';
      process.env.JWT_EXPIRE = '7d';

      const errors = validateDatabaseConfig();
      expect(errors).toHaveLength(0);
    });

    test('should return errors for missing required variables', () => {
      // Clear required variables
      delete process.env.MONGODB_URI;
      delete process.env.DB_NAME;

      const errors = validateDatabaseConfig();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('MONGODB_URI'))).toBe(true);
      expect(errors.some(error => error.includes('DB_NAME'))).toBe(true);
    });

    test('should validate MongoDB URI format', () => {
      process.env.MONGODB_URI = 'invalid_uri_format';
      process.env.DB_NAME = 'test_db';

      const errors = validateDatabaseConfig();
      expect(errors.some(error => error.includes('mongodb://'))).toBe(true);
    });

    test('should validate database name format', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
      process.env.DB_NAME = 'invalid@db#name';

      const errors = validateDatabaseConfig();
      expect(errors.some(error => error.includes('DB_NAME'))).toBe(true);
    });

    test('should accept valid MongoDB Atlas URI', () => {
      process.env.MONGODB_URI = 'mongodb+srv://user:pass@cluster.mongodb.net/database';
      process.env.DB_NAME = 'valid_db_name';

      const errors = validateDatabaseConfig();
      expect(errors.filter(error => error.includes('MONGODB_URI'))).toHaveLength(0);
    });
  });

  describe('Database Connection Class', () => {
    let DatabaseConnection;

    beforeEach(() => {
      // Mock mongoose to avoid actual database connections
      jest.doMock('mongoose', () => ({
        connect: jest.fn(),
        disconnect: jest.fn(),
        connection: {
          readyState: 1,
          host: 'localhost',
          port: 27017,
          name: 'test_db',
          collections: {},
          on: jest.fn(),
          db: {
            admin: () => ({
              ping: jest.fn().mockResolvedValue({ ok: 1 })
            }),
            stats: jest.fn().mockResolvedValue({
              collections: 5,
              dataSize: 1024,
              storageSize: 2048,
              indexes: 10
            })
          }
        }
      }));

      // Set up environment variables
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
      process.env.DB_NAME = 'test_db';

      // Require the class after mocking
      DatabaseConnection = require('../config/db').constructor;
    });

    test('should initialize with correct default values', () => {
      const dbConnection = new DatabaseConnection();
      expect(dbConnection.isConnected).toBe(false);
      expect(dbConnection.connectionAttempts).toBe(0);
      expect(dbConnection.maxRetries).toBe(5);
      expect(dbConnection.retryDelay).toBe(5000);
    });

    test('should validate environment variables on connect attempt', () => {
      delete process.env.MONGODB_URI;
      
      const dbConnection = new DatabaseConnection();
      expect(() => dbConnection.validateEnvironmentVariables()).toThrow('Missing required environment variables');
    });
  });

  describe('Database Middleware', () => {
    let middleware;
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      // Mock the database connection module
      jest.doMock('../config/db', () => ({
        getConnectionStatus: jest.fn(),
        getConnectionDetails: jest.fn()
      }));

      middleware = require('../middleware/database');

      // Set up mock Express objects
      mockReq = {
        url: '/api/test',
        method: 'GET'
      };

      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      mockNext = jest.fn();
    });

    test('should pass through when database is connected', () => {
      const dbConnection = require('../config/db');
      dbConnection.getConnectionStatus.mockReturnValue(true);
      dbConnection.getConnectionDetails.mockReturnValue({
        status: 'connected',
        host: 'localhost',
        port: 27017,
        name: 'test_db'
      });

      middleware.checkDatabaseConnection(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.dbConnection).toBeDefined();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should return 503 when database is not connected', () => {
      const dbConnection = require('../config/db');
      dbConnection.getConnectionStatus.mockReturnValue(false);

      middleware.checkDatabaseConnection(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'DATABASE_UNAVAILABLE'
          })
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle database errors properly', () => {
      const error = new Error('Database connection failed');
      error.name = 'MongoError';

      middleware.handleDatabaseError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'DATABASE_ERROR'
          })
        })
      );
    });

    test('should handle validation errors with 400 status', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = { email: 'Invalid email format' };

      middleware.handleDatabaseError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR'
          })
        })
      );
    });

    test('should handle duplicate key errors with 409 status', () => {
      const error = new Error('Duplicate key error');
      error.name = 'MongoError'; // Add this to make it a database error
      error.code = 11000;
      error.keyPattern = { email: 1 };

      middleware.handleDatabaseError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'DUPLICATE_KEY_ERROR'
          })
        })
      );
    });
  });
});

describe('Integration Tests (Mock)', () => {
  test('should demonstrate complete database setup flow', async () => {
    // Set up environment
    process.env.MONGODB_URI = 'mongodb://localhost:27017/alumni_management';
    process.env.DB_NAME = 'alumni_management';
    process.env.JWT_SECRET = 'test_secret_key_that_is_long_enough_for_security';
    process.env.JWT_EXPIRE = '7d';

    // Test environment validation
    expect(() => validateEnvironmentVariables()).not.toThrow();

    // Test database configuration validation
    const dbErrors = validateDatabaseConfig();
    expect(dbErrors).toHaveLength(0);

    console.log('✅ Mock integration test passed - Database setup is properly configured');
  });
});