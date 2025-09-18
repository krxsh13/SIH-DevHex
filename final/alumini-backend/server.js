const express = require('express');
const { loadAndValidateEnv } = require('./utils/validateEnv');
const dbConnection = require('./config/db');
const { checkDatabaseConnection, handleDatabaseError, databaseHealthCheck } = require('./middleware/database');
const { 
  createCorsMiddleware, 
  requestLogger, 
  sanitizeInput, 
  globalErrorHandler, 
  handleNotFound 
} = require('./middleware');
const apiRoutes = require('./routes');

// Load and validate environment variables
loadAndValidateEnv();

// Create Express app
const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (for demo)
app.use(express.static('public'));

// Apply custom middleware
app.use(createCorsMiddleware());
app.use(requestLogger);
app.use(sanitizeInput);

// Database connection middleware for API routes
app.use('/api', checkDatabaseConnection);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Alumni Management Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check route
app.get('/health/database', databaseHealthCheck);

// API routes
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(handleDatabaseError);
app.use(handleNotFound);
app.use(globalErrorHandler);

// Start server with database connection
async function startServer() {
  try {
    // Connect to database before starting server
    console.log('🔄 Connecting to database...');
    await dbConnection.connect();
    
    // Start Express server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Alumni Management Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️  Database health: http://localhost:${PORT}/health/database`);
      console.log(`🔗 API base: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await dbConnection.disconnect();
          console.log('Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during database disconnect:', error.message);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;