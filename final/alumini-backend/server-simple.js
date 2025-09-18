/**
 * Simple Server - Works without MongoDB
 * Perfect for testing frontend integration
 */

const express = require('express');
const { 
  createCorsMiddleware, 
  requestLogger, 
  sanitizeInput, 
  globalErrorHandler, 
  handleNotFound 
} = require('./middleware');

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

// Mock authentication utilities
const mockAuth = {
  hashPassword: (password) => `hashed_${password}`,
  comparePassword: (password, hash) => hash === `hashed_${password}`,
  generateToken: (user) => `mock_token_${user.id}_${Date.now()}`
};

// Import Indian sample data
const { indianSampleUsers } = require('./data/indian-sample-data');

// Mock data storage (in memory) - Initialize with Indian sample data
let users = indianSampleUsers.map((user, index) => ({
  _id: index + 1,
  ...user,
  password: mockAuth.hashPassword(user.password),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}));
let userIdCounter = users.length + 1;

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Alumni Management Backend API is running (Simple Mode)',
    mode: 'No Database Required',
    timestamp: new Date().toISOString()
  });
});

// Mock API routes for testing
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'User already exists with this email',
          code: 'USER_EXISTS',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Create new user
    const user = {
      _id: userIdCounter++,
      email,
      password: mockAuth.hashPassword(password),
      firstName,
      lastName,
      phone,
      role: role || 'Alumni',
      isActive: true,
      profile: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(user);
    
    // Log the new user creation
    console.log('✅ New user registered:', {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      totalUsers: users.length
    });
    
    // Generate token
    const token = mockAuth.generateToken(user);
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully (Mock Mode)',
      data: {
        user: userResponse,
        token
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Check password
    if (!mockAuth.comparePassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Generate token
    const token = mockAuth.generateToken(user);
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Login successful (Mock Mode)',
      data: {
        user: userResponse,
        token
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'LOGIN_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Mock auth middleware
const mockAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token is required',
        code: 'NO_TOKEN',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token.startsWith('mock_token_')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Extract user ID from token
  const userId = parseInt(token.split('_')[2]);
  const user = users.find(u => u._id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  req.user = user;
  next();
};

app.get('/api/auth/profile', mockAuthMiddleware, (req, res) => {
  const userResponse = { ...req.user };
  delete userResponse.password;
  
  res.json({
    success: true,
    data: {
      user: userResponse
    }
  });
});

app.put('/api/auth/profile', mockAuthMiddleware, (req, res) => {
  try {
    const user = req.user;
    const updates = req.body;
    
    // Update user data
    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.phone) user.phone = updates.phone;
    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile };
    }
    
    user.updatedAt = new Date();
    
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Profile updated successfully (Mock Mode)',
      data: {
        user: userResponse
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'UPDATE_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
});

app.get('/api/auth/users', mockAuthMiddleware, (req, res) => {
  const usersResponse = users.map(user => {
    const userCopy = { ...user };
    delete userCopy.password;
    return userCopy;
  });
  
  res.json({
    success: true,
    data: {
      users: usersResponse,
      pagination: {
        page: 1,
        limit: 10,
        total: users.length,
        pages: 1
      }
    }
  });
});

// New endpoint to check all data (no auth required for debugging)
app.get('/api/debug/users', (req, res) => {
  console.log('📊 Current users in memory:', users.length);
  console.log('👥 User details:', users.map(u => ({ 
    id: u._id, 
    name: `${u.firstName} ${u.lastName}`, 
    email: u.email, 
    role: u.role 
  })));
  
  res.json({
    success: true,
    message: 'Debug data retrieved',
    data: {
      totalUsers: users.length,
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
        isActive: user.isActive
      }))
    }
  });
});

// Error handling middleware (must be last)
app.use(handleNotFound);
app.use(globalErrorHandler);

// Start Express server
const PORT = 5002;
const server = app.listen(PORT, () => {
  console.log('🚀 Alumni Management Backend - Simple Mode');
  console.log('=' .repeat(50));
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🎨 Frontend Demo: http://localhost:${PORT}/demo.html`);
  console.log('\n📡 API Endpoints:');
  console.log('   POST /api/auth/register - Register new user');
  console.log('   POST /api/auth/login - User login');
  console.log('   GET  /api/auth/profile - Get user profile');
  console.log('   PUT  /api/auth/profile - Update user profile');
  console.log('   GET  /api/auth/users - Get all users');
  console.log('\n💡 Features:');
  console.log('   ✅ No database required');
  console.log('   ✅ Data stored in memory during session');
  console.log('   ✅ Full API functionality for testing');
  console.log('   ✅ Frontend integration ready');
  console.log('\n🧪 Test the API:');
  console.log('   1. Open: http://localhost:' + PORT + '/demo.html');
  console.log('   2. Register and login users');
  console.log('   3. Update profiles');
  console.log('   4. See data persist during session');
  console.log('\n⚡ Press Ctrl+C to stop the server');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ Server closed');
    console.log(`📊 Session Summary: ${users.length} users created`);
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;