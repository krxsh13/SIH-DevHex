# Design Document

## Overview

The Centralized Alumni Management Platform backend is designed as a RESTful API service built with Node.js, Express.js, and MongoDB. The system follows a layered architecture pattern with clear separation of concerns, implementing JWT-based authentication, role-based authorization, and comprehensive data validation. The backend serves a Next.js frontend application and provides secure, scalable endpoints for alumni management, event coordination, donation tracking, mentorship programs, and communication features.

## Architecture

### System Architecture
The backend follows a modular MVC (Model-View-Controller) architecture with additional layers for middleware and utilities:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Express.js    │    │   MongoDB       │
│   Frontend      │◄──►│   Backend API   │◄──►│   Database      │
│   (Port 3000)   │    │   (Port 5000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Layer Structure
- **Routes Layer**: Defines API endpoints and HTTP method handlers
- **Controller Layer**: Contains business logic and request/response handling
- **Middleware Layer**: Handles authentication, validation, error handling, and CORS
- **Model Layer**: Defines data schemas and database interactions using Mongoose
- **Utility Layer**: Provides helper functions for JWT, email, and common operations

### Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Email**: nodemailer
- **Environment**: dotenv
- **CORS**: cors middleware

## Components and Interfaces

### Core Models

#### User Model (Alumni + Admin)
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['Alumni', 'Admin'], required),
  profile: {
    firstName: String (required),
    lastName: String (required),
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    education: [{
      institution: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number,
      gpa: Number
    }],
    career: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }],
    skills: [String],
    interests: [String],
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      website: String
    }
  },
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Event Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  eventType: String (enum: ['Conference', 'Workshop', 'Networking', 'Reunion', 'Other']),
  startDate: Date (required),
  endDate: Date (required),
  location: {
    venue: String,
    address: String,
    city: String,
    state: String,
    isVirtual: Boolean,
    virtualLink: String
  },
  capacity: Number,
  registrationDeadline: Date,
  organizer: ObjectId (ref: 'User'),
  attendees: [{
    user: ObjectId (ref: 'User'),
    registeredAt: Date,
    rsvpStatus: String (enum: ['Going', 'Maybe', 'Not Going']),
    checkInTime: Date
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Donation Model
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: 'User', required),
  amount: Number (required),
  currency: String (default: 'INR'),
  donationType: String (enum: ['One-time', 'Monthly', 'Annual']),
  purpose: String (enum: ['General Fund', 'Scholarship', 'Infrastructure', 'Research', 'Other']),
  status: String (enum: ['Pledged', 'Processing', 'Completed', 'Failed', 'Refunded']),
  paymentMethod: String,
  transactionId: String,
  receiptNumber: String,
  notes: String,
  isAnonymous: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

#### Mentorship Model
```javascript
{
  _id: ObjectId,
  mentor: ObjectId (ref: 'User'),
  mentee: ObjectId (ref: 'User'),
  status: String (enum: ['Pending', 'Active', 'Completed', 'Cancelled']),
  mentorProfile: {
    expertise: [String],
    experience: Number,
    availability: String,
    preferredCommunication: String
  },
  menteeProfile: {
    goals: [String],
    currentLevel: String,
    preferredSchedule: String
  },
  matchScore: Number,
  startDate: Date,
  endDate: Date,
  sessions: [{
    scheduledDate: Date,
    duration: Number,
    notes: String,
    completed: Boolean
  }],
  feedback: {
    mentorRating: Number,
    menteeRating: Number,
    mentorComments: String,
    menteeComments: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Message Model
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: 'User', required),
  recipients: [ObjectId] (ref: 'User'),
  subject: String (required),
  content: String (required),
  messageType: String (enum: ['Direct', 'Announcement', 'System']),
  priority: String (enum: ['Low', 'Normal', 'High']),
  readBy: [{
    user: ObjectId (ref: 'User'),
    readAt: Date
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints Structure

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /verify-email/:token` - Email verification
- `POST /refresh-token` - Refresh JWT token

#### Alumni Routes (`/api/alumni`)
- `GET /` - Get all alumni (Admin only, with pagination)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update current user profile
- `GET /:id` - Get specific alumni profile
- `PUT /:id` - Update specific alumni profile (Admin only)
- `DELETE /:id` - Delete alumni profile (Admin only)
- `GET /search` - Search alumni by criteria

#### Event Routes (`/api/events`)
- `GET /` - Get all events (with filters)
- `POST /` - Create new event (Admin only)
- `GET /:id` - Get specific event details
- `PUT /:id` - Update event (Admin only)
- `DELETE /:id` - Delete event (Admin only)
- `POST /:id/register` - Register for event
- `PUT /:id/rsvp` - Update RSVP status
- `GET /:id/attendees` - Get event attendees (Admin only)

#### Donation Routes (`/api/donations`)
- `GET /` - Get all donations (Admin only)
- `POST /` - Create donation/pledge
- `GET /my-donations` - Get current user's donations
- `GET /:id` - Get specific donation details
- `PUT /:id` - Update donation status (Admin only)
- `GET /analytics` - Get donation analytics (Admin only)

#### Mentorship Routes (`/api/mentorship`)
- `GET /` - Get mentorship opportunities
- `POST /mentor/enroll` - Enroll as mentor
- `POST /mentee/request` - Request mentorship
- `GET /my-connections` - Get user's mentorship connections
- `PUT /:id/status` - Update mentorship status
- `POST /:id/session` - Schedule/log mentorship session
- `POST /:id/feedback` - Submit mentorship feedback

#### Message Routes (`/api/messages`)
- `GET /` - Get user's messages
- `POST /` - Send new message
- `GET /:id` - Get specific message
- `PUT /:id/read` - Mark message as read
- `DELETE /:id` - Delete message
- `POST /announcement` - Send announcement (Admin only)

### Middleware Components

#### Authentication Middleware
- Validates JWT tokens
- Extracts user information from token
- Handles token expiration and refresh

#### Authorization Middleware
- Implements role-based access control
- Validates user permissions for specific routes
- Handles resource ownership validation

#### Validation Middleware
- Input validation using express-validator
- Sanitizes user input to prevent injection attacks
- Validates request parameters, body, and query strings

#### Error Handling Middleware
- Centralized error handling
- Consistent error response format
- Logging and monitoring integration

## Data Models

### Database Design Principles
- **Normalization**: Proper data normalization to reduce redundancy
- **Indexing**: Strategic indexing on frequently queried fields
- **Relationships**: Proper use of MongoDB references and embedded documents
- **Validation**: Schema-level validation with Mongoose
- **Soft Deletes**: Implement soft deletes for data integrity

### Key Relationships
- User ↔ Event (Many-to-Many through attendees array)
- User ↔ Donation (One-to-Many)
- User ↔ Mentorship (Many-to-Many with mentor/mentee roles)
- User ↔ Message (Many-to-Many through sender/recipients)

### Indexing Strategy
```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ "profile.education.graduationYear": 1 })

// Event indexes
db.events.createIndex({ startDate: 1 })
db.events.createIndex({ eventType: 1 })
db.events.createIndex({ "attendees.user": 1 })

// Donation indexes
db.donations.createIndex({ donor: 1 })
db.donations.createIndex({ status: 1 })
db.donations.createIndex({ createdAt: -1 })

// Mentorship indexes
db.mentorships.createIndex({ mentor: 1, mentee: 1 })
db.mentorships.createIndex({ status: 1 })

// Message indexes
db.messages.createIndex({ recipients: 1 })
db.messages.createIndex({ sender: 1 })
db.messages.createIndex({ createdAt: -1 })
```

## Error Handling

### Error Response Format
```javascript
{
  success: false,
  error: {
    message: "Human-readable error message",
    code: "ERROR_CODE",
    details: {}, // Additional error details
    timestamp: "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Categories
- **Validation Errors** (400): Invalid input data
- **Authentication Errors** (401): Invalid or missing credentials
- **Authorization Errors** (403): Insufficient permissions
- **Not Found Errors** (404): Resource not found
- **Conflict Errors** (409): Data conflicts (e.g., duplicate email)
- **Server Errors** (500): Internal server errors

### Error Handling Strategy
- Centralized error handling middleware
- Proper HTTP status codes
- Detailed error logging for debugging
- User-friendly error messages
- Security-conscious error responses (no sensitive data exposure)

## Testing Strategy

### Unit Testing
- **Models**: Test schema validation, methods, and static functions
- **Controllers**: Test business logic and error handling
- **Middleware**: Test authentication, authorization, and validation
- **Utilities**: Test helper functions and token generation

### Integration Testing
- **API Endpoints**: Test complete request/response cycles
- **Database Operations**: Test CRUD operations and relationships
- **Authentication Flow**: Test login, registration, and token refresh
- **Authorization**: Test role-based access control

### Testing Tools
- **Jest**: Primary testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **Factory Pattern**: Generate test data consistently

### Test Coverage Goals
- Minimum 80% code coverage
- 100% coverage for critical security functions
- All API endpoints tested
- All error scenarios covered

### Testing Environment
- Separate test database
- Mock external services (email, payment)
- Automated testing in CI/CD pipeline
- Performance testing for high-load scenarios