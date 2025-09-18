/**
 * Start Server with In-Memory MongoDB
 * Perfect for development and testing without local MongoDB installation
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const { loadAndValidateEnv } = require('../utils/validateEnv');
const { 
  createCorsMiddleware, 
  requestLogger, 
  sanitizeInput, 
  globalErrorHandler, 
  handleNotFound 
} = require('../middleware');
const apiRoutes = require('../routes');

let mongod;

async function startServerWithMemoryDB() {
  try {
    console.log('🚀 Alumni Management Backend - Development Mode');
    console.log('📦 Using In-Memory MongoDB (No installation required!)');
    console.log('=' .repeat(60));

    // Load environment variables (skip MongoDB validation for memory DB)
    process.env.MONGODB_URI = 'mongodb://memory-db/alumni_management_dev';
    loadAndValidateEnv();

    // Start in-memory MongoDB
    console.log('🔄 Starting in-memory MongoDB server...');
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'alumni_management_dev'
      }
    });
    
    const mongoUri = mongod.getUri();
    console.log('✅ In-memory MongoDB started');
    console.log('📍 Database URI:', mongoUri);

    // Connect to in-memory database
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to in-memory database');

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

    // Basic health check route
    app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Alumni Management Backend API is running',
        database: 'In-Memory MongoDB (Development)',
        timestamp: new Date().toISOString()
      });
    });

    // Database health check route
    app.get('/health/database', async (req, res) => {
      try {
        const dbStats = await mongoose.connection.db.stats();
        res.json({
          success: true,
          data: {
            database: {
              status: 'connected',
              type: 'In-Memory MongoDB',
              name: mongoose.connection.name,
              collections: dbStats.collections,
              dataSize: dbStats.dataSize,
              storageSize: dbStats.storageSize
            },
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        res.status(503).json({
          success: false,
          error: {
            message: 'Database health check failed',
            details: error.message,
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    // API routes
    app.use('/api', apiRoutes);

    // Error handling middleware (must be last)
    app.use(handleNotFound);
    app.use(globalErrorHandler);

    // Start Express server (use different port to avoid conflicts)
    const PORT = 5001;
    const server = app.listen(PORT, () => {
      console.log('\n🎉 Server Started Successfully!');
      console.log('=' .repeat(60));
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/health`);
      console.log(`🗄️  Database Health: http://localhost:${PORT}/health/database`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🎨 Frontend Demo: http://localhost:${PORT}/demo.html`);
      console.log('\n📡 API Endpoints:');
      console.log('   POST /api/auth/register - Register new user');
      console.log('   POST /api/auth/login - User login');
      console.log('   GET  /api/auth/profile - Get user profile');
      console.log('   PUT  /api/auth/profile - Update user profile');
      console.log('   GET  /api/auth/users - Get all users (Admin only)');
      console.log('\n💡 Features:');
      console.log('   ✅ In-memory database (no MongoDB installation needed)');
      console.log('   ✅ All data persists during session');
      console.log('   ✅ Full user registration and authentication');
      console.log('   ✅ Profile management and updates');
      console.log('   ✅ JWT token authentication');
      console.log('   ✅ Input validation and sanitization');
      console.log('   ✅ CORS configured for frontend integration');
      console.log('\n🧪 Test the API:');
      console.log('   1. Open: http://localhost:5000/demo.html');
      console.log('   2. Register a new user');
      console.log('   3. Login and update profile');
      console.log('   4. See all data saved in memory database');
      console.log('\n⚡ Press Ctrl+C to stop the server');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        console.log('📡 HTTP server closed');
        
        try {
          await mongoose.connection.close();
          console.log('🗄️  Database connection closed');
          
          if (mongod) {
            await mongod.stop();
            console.log('🔌 In-memory MongoDB stopped');
          }
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error.message);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    
    if (mongod) {
      await mongod.stop();
    }
    
    process.exit(1);
  }
}

// Start the server
startServerWithMemoryDB();

module.exports = { startServerWithMemoryDB };