/**
 * Environment variable validation utility
 * Validates all required environment variables for the application
 */

/**
 * Validate database-related environment variables
 * @throws {Error} If validation fails
 */
const validateDatabaseConfig = () => {
  const errors = [];

  // Required database variables
  const requiredDbVars = {
    MONGODB_URI: 'MongoDB connection string',
    DB_NAME: 'Database name'
  };

  // Check for missing required variables
  Object.entries(requiredDbVars).forEach(([varName, description]) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName} (${description})`);
    }
  });

  // Validate MongoDB URI format
  if (process.env.MONGODB_URI) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      errors.push('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    }

    // Check if URI contains database name (optional but recommended)
    if (!mongoUri.includes('/') || mongoUri.endsWith('/')) {
      console.warn('⚠️  Warning: MONGODB_URI should include database name in the connection string');
    }
  }

  // Validate DB_NAME format
  if (process.env.DB_NAME) {
    const dbName = process.env.DB_NAME;
    if (!/^[a-zA-Z0-9_-]+$/.test(dbName)) {
      errors.push('DB_NAME can only contain letters, numbers, underscores, and hyphens');
    }
  }

  return errors;
};

/**
 * Validate all application environment variables
 * @throws {Error} If validation fails
 */
const validateEnvironmentVariables = () => {
  const allErrors = [];

  // Validate database configuration
  const dbErrors = validateDatabaseConfig();
  allErrors.push(...dbErrors);

  // Validate server configuration
  if (!process.env.PORT) {
    console.warn('⚠️  Warning: PORT not specified, will default to 5000');
  } else {
    const port = parseInt(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      allErrors.push('PORT must be a valid number between 1 and 65535');
    }
  }

  // Validate NODE_ENV
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    allErrors.push('NODE_ENV must be one of: development, production, test');
  }

  // Validate JWT configuration (required for authentication)
  const requiredJwtVars = {
    JWT_SECRET: 'JWT signing secret',
    JWT_EXPIRE: 'JWT expiration time'
  };

  Object.entries(requiredJwtVars).forEach(([varName, description]) => {
    if (!process.env[varName]) {
      allErrors.push(`Missing required environment variable: ${varName} (${description})`);
    }
  });

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    allErrors.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate BCRYPT_SALT_ROUNDS
  if (process.env.BCRYPT_SALT_ROUNDS) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    if (isNaN(saltRounds) || saltRounds < 10 || saltRounds > 15) {
      allErrors.push('BCRYPT_SALT_ROUNDS must be a number between 10 and 15');
    }
  }

  // Validate email configuration (optional but warn if missing)
  const emailVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingEmailVars = emailVars.filter(varName => !process.env[varName]);
  
  if (missingEmailVars.length > 0 && missingEmailVars.length < emailVars.length) {
    console.warn('⚠️  Warning: Incomplete email configuration. Missing:', missingEmailVars.join(', '));
  }

  // Validate FRONTEND_URL format
  if (process.env.FRONTEND_URL) {
    try {
      new URL(process.env.FRONTEND_URL);
    } catch (error) {
      allErrors.push('FRONTEND_URL must be a valid URL');
    }
  }

  // If there are errors, throw them
  if (allErrors.length > 0) {
    const errorMessage = 'Environment validation failed:\n' + allErrors.map(err => `  - ${err}`).join('\n');
    throw new Error(errorMessage);
  }

  console.log('✅ Environment variables validated successfully');
};

/**
 * Get environment configuration summary
 * @returns {Object} Configuration summary
 */
const getEnvironmentSummary = () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database: {
      uri: process.env.MONGODB_URI ? '***configured***' : 'not configured',
      name: process.env.DB_NAME || 'not configured'
    },
    jwt: {
      configured: !!process.env.JWT_SECRET,
      expiration: process.env.JWT_EXPIRE || 'not configured'
    },
    email: {
      configured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER),
      host: process.env.EMAIL_HOST || 'not configured'
    },
    cors: {
      frontendUrl: process.env.FRONTEND_URL || 'not configured'
    },
    security: {
      bcryptRounds: process.env.BCRYPT_SALT_ROUNDS || 'default (12)'
    }
  };
};

/**
 * Load and validate environment variables
 * @param {string} envPath - Path to .env file (optional)
 */
const loadAndValidateEnv = (envPath = null) => {
  try {
    // Load environment variables
    require('dotenv').config(envPath ? { path: envPath } : {});
    
    // Validate environment variables
    validateEnvironmentVariables();
    
    // Log configuration summary
    const summary = getEnvironmentSummary();
    console.log('🔧 Environment Configuration:');
    console.log(`   Node Environment: ${summary.nodeEnv}`);
    console.log(`   Port: ${summary.port}`);
    console.log(`   Database: ${summary.database.name}`);
    console.log(`   JWT: ${summary.jwt.configured ? 'Configured' : 'Not configured'}`);
    console.log(`   Email: ${summary.email.configured ? 'Configured' : 'Not configured'}`);
    
  } catch (error) {
    console.error('❌ Environment validation failed:');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = {
  validateDatabaseConfig,
  validateEnvironmentVariables,
  getEnvironmentSummary,
  loadAndValidateEnv
};