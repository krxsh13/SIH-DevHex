# Alumni Management Backend API - MVP

A complete backend API for the Alumni Management Platform that enables frontend applications to save and retrieve data from MongoDB database.

## ✅ Current Status: MVP Ready

**Frontend data CAN now be saved to the database!** 

The essential components are implemented:
- ✅ User registration and authentication
- ✅ Profile management and updates  
- ✅ Data validation and sanitization
- ✅ JWT token-based authentication
- ✅ MongoDB data persistence
- ✅ Error handling and logging
- ✅ CORS configuration for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd alumini-backend
npm install
```

2. **Configure environment:**
```bash
# Copy and edit .env file
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Start the server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication & User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| GET | `/api/auth/users` | Get all users | Admin only |
| GET | `/api/health` | API health check | No |

## 🔧 Frontend Integration Examples

### 1. User Registration

**Frontend Form Data:**
```javascript
const registrationData = {
  email: "user@example.com",
  password: "SecurePassword123",
  firstName: "John",
  lastName: "Doe",
  phone: "1234567890",
  role: "Alumni"
};

// Frontend API call
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(registrationData)
});

const result = await response.json();
// result.data.user contains saved user data
// result.data.token contains JWT for authentication
```

**✅ Data gets saved to MongoDB automatically!**

### 2. User Login

```javascript
const loginData = {
  email: "user@example.com",
  password: "SecurePassword123"
};

const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
});

const result = await response.json();
// Store token for authenticated requests
localStorage.setItem('token', result.data.token);
```

### 3. Profile Updates

```javascript
const profileData = {
  firstName: "Jane",
  profile: {
    bio: "Software Engineer with 5 years experience",
    graduationYear: 2019,
    degree: "Bachelor of Computer Science",
    currentJob: {
      title: "Senior Developer",
      company: "Tech Corp"
    },
    location: {
      city: "Chandigarh",
      country: "India"
    }
  }
};

const response = await fetch('http://localhost:5000/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(profileData)
});

const result = await response.json();
// Profile updates are saved to database
```

### 4. Get User Profile

```javascript
const response = await fetch('http://localhost:5000/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const result = await response.json();
// result.data.user contains all saved user data from database
```

## 📊 Data Models

### User Schema
```javascript
{
  email: String,           // Required, unique
  password: String,        // Required, hashed
  firstName: String,       // Required
  lastName: String,        // Required
  phone: String,          // Optional
  role: String,           // 'Alumni' or 'Admin'
  isActive: Boolean,      // Account status
  isEmailVerified: Boolean,
  profile: {
    bio: String,
    graduationYear: Number,
    degree: String,
    currentJob: {
      title: String,
      company: String
    },
    location: {
      city: String,
      country: String
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Environment-specific origins
- **Error Handling**: No sensitive data in error responses

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- __tests__/auth.test.js
npm test -- __tests__/middleware.test.js
```

### Demo Scripts
```bash
# Test database connection
npm run demo:db

# Test middleware functionality
npm run demo:middleware

# Test API data persistence
npm run demo:api
```

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development)
- `http://localhost:3001` (Alternative port)
- Environment-specific URLs via `FRONTEND_URL`

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { /* user data */ },
    "token": "jwt.token.here"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": { /* additional error info */ },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/alumni_management

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📈 What's Working Now

✅ **Complete User Management**
- User registration with validation
- Secure login with JWT tokens
- Profile updates and retrieval
- Password hashing and comparison

✅ **Data Persistence**
- All form data saves to MongoDB
- Automatic validation and sanitization
- Error handling for invalid data
- Search and filtering capabilities

✅ **Security**
- JWT-based authentication
- Role-based access control
- Input sanitization and validation
- CORS protection

✅ **API Infrastructure**
- RESTful endpoints
- Standardized responses
- Comprehensive error handling
- Request logging and monitoring

## 🚧 Future Enhancements (Not needed for MVP)

The current implementation provides everything needed for basic frontend data persistence. Additional features like events, donations, mentorship, and messaging can be added later as separate modules.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify database permissions

2. **CORS Errors**
   - Check FRONTEND_URL in .env
   - Verify frontend origin matches configuration

3. **Authentication Errors**
   - Ensure JWT_SECRET is set
   - Check token format in Authorization header
   - Verify token hasn't expired

### Getting Help

1. Check the logs for detailed error messages
2. Run `npm run demo:api` to test data persistence
3. Verify environment configuration
4. Check database connectivity with `npm run demo:db`

---

## 🎉 Ready for Frontend Integration!

Your frontend can now:
- Register users and save to database
- Authenticate users with JWT tokens
- Update user profiles and persist changes
- Retrieve user data from database
- Handle errors gracefully

The MVP is complete and ready for production use!