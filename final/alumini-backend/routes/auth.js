/**
 * Authentication Routes - Essential MVP version
 * Basic user authentication and profile management routes
 */

const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  getAllUsers 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateProfileUpdate 
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);

// Admin only routes
router.get('/users', authenticate, authorize('Admin'), getAllUsers);

module.exports = router;