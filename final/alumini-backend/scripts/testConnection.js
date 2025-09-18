#!/usr/bin/env node

/**
 * Database connection test script
 * Tests MongoDB connectivity and validates configuration
 */

const { loadAndValidateEnv } = require('../utils/validateEnv');
const dbConnection = require('../config/db');

/**
 * Test database connection and configuration
 */
async function testDatabaseConnection() {
  console.log('🧪 Starting database connection test...\n');

  try {
    // Step 1: Load and validate environment variables
    console.log('1️⃣ Loading and validating environment variables...');
    loadAndValidateEnv();
    console.log('✅ Environment variables validated\n');

    // Step 2: Test database connection
    console.log('2️⃣ Testing database connection...');
    await dbConnection.connect();
    
    // Wait a moment for connection to be fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Database connection established\n');

    // Step 3: Test basic database operations
    console.log('3️⃣ Testing basic database operations...');
    const testResult = await dbConnection.testConnection();
    
    if (testResult.success) {
      console.log('✅ Database operations test passed');
      console.log('📊 Database Statistics:');
      console.log(`   Collections: ${testResult.stats.collections}`);
      console.log(`   Data Size: ${(testResult.stats.dataSize / 1024).toFixed(2)} KB`);
      console.log(`   Storage Size: ${(testResult.stats.storageSize / 1024).toFixed(2)} KB`);
      console.log(`   Indexes: ${testResult.stats.indexes}\n`);
    } else {
      throw new Error(`Database operations test failed: ${testResult.error}`);
    }

    // Step 4: Test connection details
    console.log('4️⃣ Verifying connection details...');
    const connectionDetails = dbConnection.getConnectionDetails();
    console.log('✅ Connection details retrieved');
    console.log('🔗 Connection Information:');
    console.log(`   Status: ${connectionDetails.status}`);
    console.log(`   Host: ${connectionDetails.host}`);
    console.log(`   Port: ${connectionDetails.port}`);
    console.log(`   Database: ${connectionDetails.name}`);
    console.log(`   Ready State: ${connectionDetails.readyState}`);
    console.log(`   Collections: ${connectionDetails.collections.length}\n`);

    // Step 5: Test connection status check
    console.log('5️⃣ Testing connection status check...');
    const isConnected = dbConnection.getConnectionStatus();
    if (isConnected) {
      console.log('✅ Connection status check passed\n');
    } else {
      throw new Error('Connection status check failed');
    }

    // Step 6: Test graceful disconnection
    console.log('6️⃣ Testing graceful disconnection...');
    await dbConnection.disconnect();
    console.log('✅ Graceful disconnection successful\n');

    console.log('🎉 All database connection tests passed successfully!');
    console.log('✨ Your database configuration is working correctly.\n');

  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.stack) {
      console.error('\n📋 Stack trace:');
      console.error(error.stack);
    }

    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check if MongoDB is running');
    console.log('   2. Verify MONGODB_URI in your .env file');
    console.log('   3. Ensure database credentials are correct');
    console.log('   4. Check network connectivity to MongoDB server');
    console.log('   5. Verify firewall settings allow MongoDB connections');

    process.exit(1);
  }
}

/**
 * Test database middleware functionality
 */
async function testDatabaseMiddleware() {
  console.log('🧪 Testing database middleware...\n');

  try {
    const { checkDatabaseConnection, handleDatabaseError } = require('../middleware/database');

    // Mock Express request and response objects
    const mockReq = {
      url: '/test',
      method: 'GET'
    };

    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      }
    };

    const mockNext = jest.fn ? jest.fn() : () => {};

    console.log('1️⃣ Testing database connection middleware...');
    
    // Connect to database first
    await dbConnection.connect();
    
    // Test middleware with connected database
    checkDatabaseConnection(mockReq, mockRes, mockNext);
    
    if (mockReq.dbConnection && mockReq.dbConnection.status === 'connected') {
      console.log('✅ Database connection middleware test passed');
    } else {
      throw new Error('Database connection middleware test failed');
    }

    console.log('✅ Database middleware tests completed\n');

    // Cleanup
    await dbConnection.disconnect();

  } catch (error) {
    console.error('❌ Database middleware test failed:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await testDatabaseConnection();
    await testDatabaseMiddleware();
    
    console.log('🏆 All tests completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  testDatabaseConnection,
  testDatabaseMiddleware
};