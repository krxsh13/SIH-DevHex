/**
 * User Model - Essential MVP version
 * Simplified user schema for basic data persistence
 */

const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/auth');

const userSchema = new mongoose.Schema({
  // Basic Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Indian Name Fields
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  // Indian Cultural Fields
  fatherName: {
    type: String,
    trim: true,
    maxlength: [100, 'Father name cannot exceed 100 characters']
  },
  motherName: {
    type: String,
    trim: true,
    maxlength: [100, 'Mother name cannot exceed 100 characters']
  },
  caste: {
    type: String,
    trim: true,
    maxlength: [50, 'Caste cannot exceed 50 characters']
  },
  religion: {
    type: String,
    trim: true,
    maxlength: [50, 'Religion cannot exceed 50 characters']
  },
  motherTongue: {
    type: String,
    trim: true,
    maxlength: [50, 'Mother tongue cannot exceed 50 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number']
  },
  
  // Role - Indian Educational System
  role: {
    type: String,
    enum: ['Alumni', 'Student', 'Faculty', 'Admin', 'Guest'],
    default: 'Alumni'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Indian Profile Data
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    // Indian Educational System
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year must be after 1950'],
      max: [new Date().getFullYear() + 10, 'Graduation year cannot be too far in the future']
    },
    degree: {
      type: String,
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    stream: {
      type: String,
      trim: true,
      maxlength: [100, 'Stream cannot exceed 100 characters']
    },
    college: {
      type: String,
      trim: true,
      maxlength: [200, 'College name cannot exceed 200 characters']
    },
    university: {
      type: String,
      trim: true,
      maxlength: [200, 'University name cannot exceed 200 characters']
    },
    // Indian Address System
    address: {
      houseNumber: {
        type: String,
        trim: true,
        maxlength: [50, 'House number cannot exceed 50 characters']
      },
      street: {
        type: String,
        trim: true,
        maxlength: [100, 'Street cannot exceed 100 characters']
      },
      area: {
        type: String,
        trim: true,
        maxlength: [100, 'Area cannot exceed 100 characters']
      },
      city: {
        type: String,
        trim: true,
        maxlength: [50, 'City cannot exceed 50 characters']
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, 'State cannot exceed 50 characters']
      },
      pincode: {
        type: String,
        trim: true,
        match: [/^\d{6}$/, 'Pincode must be 6 digits']
      },
      country: {
        type: String,
        trim: true,
        default: 'India',
        maxlength: [50, 'Country cannot exceed 50 characters']
      }
    },
    // Professional Information
    currentJob: {
      title: {
        type: String,
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters']
      },
      company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
      },
      industry: {
        type: String,
        trim: true,
        maxlength: [100, 'Industry cannot exceed 100 characters']
      },
      experience: {
        type: Number,
        min: [0, 'Experience cannot be negative']
      }
    },
    // Indian Government Documents
    documents: {
      aadharNumber: {
        type: String,
        trim: true,
        match: [/^\d{12}$/, 'Aadhar number must be 12 digits']
      },
      panNumber: {
        type: String,
        trim: true,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format']
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);