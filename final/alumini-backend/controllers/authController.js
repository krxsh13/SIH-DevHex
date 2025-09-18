/**
 * Authentication Controller - Essential MVP version
 * Basic user registration, login, and profile management
 */

const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { AppError, catchAsync } = require('../middleware/errorHandler');

/**
 * Register new user
 */
const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 409, 'USER_EXISTS'));
  }
  
  // Create new user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || 'Alumni'
  });
  
  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
});

/**
 * Login user
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }
  
  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Account is deactivated', 401, 'ACCOUNT_DEACTIVATED'));
  }
  
  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }
  
  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });
  
  // Remove password from response
  user.password = undefined;
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

/**
 * Get current user profile
 */
const getProfile = catchAsync(async (req, res, next) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

/**
 * Update user profile
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    'firstName', 'lastName', 'phone', 
    'profile.bio', 'profile.graduationYear', 'profile.degree',
    'profile.currentJob.title', 'profile.currentJob.company',
    'profile.location.city', 'profile.location.country'
  ];
  
  const updates = {};
  
  // Filter allowed updates
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  // Handle nested profile updates
  if (req.body.profile) {
    Object.keys(req.body.profile).forEach(key => {
      if (allowedUpdates.includes(`profile.${key}`)) {
        if (!updates.profile) updates.profile = {};
        updates.profile[key] = req.body.profile[key];
      }
    });
  }
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
});

/**
 * Get all users (Admin only)
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, role, search } = req.query;
  
  const query = {};
  
  // Filter by role
  if (role) {
    query.role = role;
  }
  
  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const total = await User.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
};