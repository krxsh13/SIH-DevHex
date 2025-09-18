const mongoose = require('mongoose');

/**
 * Database connection utility with error handling and retry logic
 * Implements connection pooling, retry mechanism, and proper error handling
 */

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
    this.connectionOptions = {
      // Connection pool settings
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long to wait for a response
      bufferCommands: false, // Disable mongoose buffering
    };
  }

  /**
   * Connect to MongoDB with retry logic
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      // Validate environment variables
      this.validateEnvironmentVariables();

      const mongoUri = process.env.MONGODB_URI;
      
      console.log('🔄 Attempting to connect to MongoDB...');
      
      await mongoose.connect(mongoUri, this.connectionOptions);
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      
    } catch (error) {
      this.isConnected = false;
      this.connectionAttempts++;
      
      console.error('❌ MongoDB connection failed:', error.message);
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in ${this.retryDelay / 1000} seconds... (Attempt ${this.connectionAttempts}/${this.maxRetries})`);
        
        setTimeout(() => {
          this.connect();
        }, this.retryDelay);
      } else {
        console.error('💥 Maximum connection attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('🔌 MongoDB disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get connection details
   * @returns {Object}
   */
  getConnectionDetails() {
    const readyState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    if (readyState !== 1) {
      return { 
        status: states[readyState] || 'unknown',
        readyState: readyState
      };
    }

    return {
      status: 'connected',
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: readyState,
      collections: Object.keys(mongoose.connection.collections)
    };
  }

  /**
   * Validate required environment variables
   * @throws {Error} If required environment variables are missing
   */
  validateEnvironmentVariables() {
    const requiredEnvVars = [
      'MONGODB_URI',
      'DB_NAME'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate MongoDB URI format
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://');
    }
  }

  /**
   * Setup connection event listeners
   */
  setupEventListeners() {
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    // Connection error
    mongoose.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error.message);
      this.isConnected = false;
    });

    // Connection disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Application termination
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Test database connectivity
   * @returns {Promise<Object>}
   */
  async testConnection() {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
      }

      // Test basic database operation
      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();
      
      const stats = await mongoose.connection.db.stats();
      
      return {
        success: true,
        ping: result,
        stats: {
          collections: stats.collections,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexes: stats.indexes
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Setup event listeners
dbConnection.setupEventListeners();

module.exports = dbConnection;