/**
 * Middleware Demo Script
 * Demonstrates all middleware components working together
 */

const express = require('express');
const {
  createCorsMiddleware,
  requestLogger,
  sanitizeInput,
  validateUserLogin,
  globalErrorHandler,
  handleNotFound,
  AppError
} = require('../middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware in correct order
app.use(express.json());
app.use(createCorsMiddleware());
app.use(requestLogger);
app.use(sanitizeInput);

// Demo routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Alumni Management Backend API',
    middleware: [
      'CORS enabled',
      'Request logging active',
      'Input sanitization enabled',
      'Error handling configured'
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    middleware: {
      cors: 'enabled',
      logging: 'active',
      validation: 'ready',
      errorHandling: 'configured'
    },
    timestamp: new Date().toISOString()
  });
});

// Demo validation endpoint
app.post('/demo/login', validateUserLogin, (req, res) => {
  res.json({
    success: true,
    message: 'Validation passed!',
    data: {
      email: req.body.email,
      // Password is not returned for security
      validatedAt: new Date().toISOString()
    }
  });
});

// Demo error endpoint
app.get('/demo/error', (req, res, next) => {
  const error = new AppError('This is a demo error', 400, 'DEMO_ERROR', {
    demo: true,
    timestamp: new Date().toISOString()
  });
  next(error);
});

// Demo async error endpoint
app.get('/demo/async-error', async (req, res, next) => {
  try {
    // Simulate async operation that fails
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Async operation failed'));
      }, 100);
    });
  } catch (error) {
    next(new AppError('Async demo error', 500, 'ASYNC_DEMO_ERROR'));
  }
});

// Demo input sanitization
app.post('/demo/sanitize', (req, res) => {
  res.json({
    success: true,
    message: 'Input has been sanitized',
    originalInput: 'Check the logs to see what was sanitized',
    sanitizedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Apply error handling middleware (must be last)
app.use(handleNotFound);
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Middleware Demo Server running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   POST http://localhost:${PORT}/demo/login`);
  console.log(`   GET  http://localhost:${PORT}/demo/error`);
  console.log(`   GET  http://localhost:${PORT}/demo/async-error`);
  console.log(`   POST http://localhost:${PORT}/demo/sanitize`);
  console.log(`\n🧪 Test examples:`);
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl -X POST http://localhost:${PORT}/demo/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'`);
  console.log(`   curl -X POST http://localhost:${PORT}/demo/sanitize -H "Content-Type: application/json" -d '{"name":"<script>alert(\\"xss\\")</script>John","message":"Hello World"}'`);
  console.log(`\n⚡ Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;