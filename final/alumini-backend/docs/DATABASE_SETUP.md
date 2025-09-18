# Database Setup Documentation

## Overview

This document describes the database connection and configuration system for the Alumni Management Backend. The system provides robust MongoDB connectivity with error handling, retry logic, and comprehensive middleware support.

## Architecture

### Components

1. **Database Connection Utility** (`config/db.js`)
   - Singleton connection manager
   - Retry logic with exponential backoff
   - Connection pooling configuration
   - Health monitoring and testing

2. **Database Middleware** (`middleware/database.js`)
   - Connection status validation
   - Error handling for database operations
   - Health check endpoints
   - Request-level database validation

3. **Environment Validation** (`utils/validateEnv.js`)
   - Comprehensive environment variable validation
   - Security requirement checks
   - Configuration summary reporting

## Configuration

### Required Environment Variables

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/alumni_management
DB_NAME=alumni_management

# JWT Configuration (required for authentication)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
```

### Optional Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Database Connection Features

### Connection Management
- **Automatic Retry**: Up to 5 connection attempts with 5-second delays
- **Connection Pooling**: Optimized pool settings for performance
- **Graceful Shutdown**: Proper cleanup on application termination
- **Health Monitoring**: Real-time connection status tracking

### Connection Pool Settings
```javascript
{
  maxPoolSize: 10,        // Maximum connections
  minPoolSize: 2,         // Minimum connections
  maxIdleTimeMS: 30000,   // Idle timeout
  serverSelectionTimeoutMS: 5000,  // Server selection timeout
  socketTimeoutMS: 45000, // Socket timeout
  bufferCommands: false   // Disable buffering
}
```

### Error Handling
- **Connection Errors**: Automatic retry with logging
- **Validation Errors**: Proper HTTP status codes (400)
- **Duplicate Key Errors**: Conflict handling (409)
- **Generic Database Errors**: Standardized error responses (500)

## API Endpoints

### Health Check Endpoints

#### Basic Health Check
```
GET /health
```
Returns basic application status.

#### Database Health Check
```
GET /health/database
```
Returns detailed database connectivity information including:
- Connection status
- Database statistics
- Performance metrics
- Connection details

### Protected Routes
All `/api/*` routes are automatically protected by database connection middleware.

## Usage Examples

### Starting the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Testing Database Connection
```bash
# Run comprehensive database tests
npm run test:db

# Run unit tests
npm test

# Demonstrate configuration
npm run demo:db
```

### Health Check Examples

#### Basic Health Check
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "Alumni Management Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Database Health Check
```bash
curl http://localhost:5000/health/database
```

Response:
```json
{
  "success": true,
  "data": {
    "database": {
      "status": "connected",
      "connection": {
        "status": "connected",
        "host": "localhost",
        "port": 27017,
        "name": "alumni_management",
        "readyState": 1,
        "collections": []
      },
      "test": {
        "success": true,
        "ping": { "ok": 1 },
        "stats": {
          "collections": 0,
          "dataSize": 0,
          "storageSize": 0,
          "indexes": 0
        }
      }
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### Database Unavailable (503)
```json
{
  "success": false,
  "error": {
    "message": "Database service unavailable. Please try again later.",
    "code": "DATABASE_UNAVAILABLE",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "message": "Data validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format"
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Duplicate Key Error (409)
```json
{
  "success": false,
  "error": {
    "message": "Duplicate value for field: email",
    "code": "DUPLICATE_KEY_ERROR",
    "field": "email",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Development Workflow

### 1. Environment Setup
1. Copy `.env.example` to `.env`
2. Configure database connection string
3. Set JWT secret and other required variables

### 2. Database Setup
1. Install and start MongoDB
2. Verify connection with `npm run demo:db`
3. Run tests with `npm run test:db`

### 3. Development
1. Start development server with `npm run dev`
2. Monitor database health at `/health/database`
3. Use database middleware for all API routes

## Troubleshooting

### Common Issues

#### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running on the specified host and port.

#### Authentication Failed
```
Error: Authentication failed
```
**Solution**: Check MongoDB credentials in MONGODB_URI.

#### Environment Variables Missing
```
Error: Missing required environment variables: MONGODB_URI
```
**Solution**: Ensure all required environment variables are set in `.env` file.

### Debug Steps
1. Check MongoDB service status
2. Verify environment variables with `npm run demo:db`
3. Test connection with `npm run test:db`
4. Check application logs for detailed error messages
5. Verify firewall and network connectivity

## Security Considerations

### Environment Variables
- Use strong JWT secrets (minimum 32 characters)
- Never commit `.env` files to version control
- Use different secrets for different environments

### Database Security
- Use MongoDB authentication in production
- Configure proper user permissions
- Enable SSL/TLS for database connections
- Regularly update MongoDB version

### Connection Security
- Use connection pooling to prevent connection exhaustion
- Implement proper timeout settings
- Monitor connection health regularly
- Log security-related events

## Performance Optimization

### Connection Pool Tuning
- Adjust `maxPoolSize` based on expected load
- Monitor connection usage patterns
- Optimize `maxIdleTimeMS` for your use case

### Query Optimization
- Use proper indexing strategies
- Monitor slow queries
- Implement query result caching where appropriate

### Monitoring
- Track connection pool metrics
- Monitor database response times
- Set up alerts for connection failures

## Testing

### Unit Tests
```bash
npm test -- --testPathPattern=database.test.js
```

### Integration Tests
```bash
npm run test:db
```

### Load Testing
Consider using tools like:
- Apache Bench (ab)
- Artillery
- k6

## Production Deployment

### Environment Configuration
- Use MongoDB Atlas or managed MongoDB service
- Configure proper connection strings with authentication
- Set appropriate connection pool sizes
- Enable monitoring and alerting

### Health Monitoring
- Set up monitoring for `/health/database` endpoint
- Configure alerts for database connectivity issues
- Monitor connection pool metrics
- Track database performance metrics

### Backup and Recovery
- Implement regular database backups
- Test backup restoration procedures
- Document recovery processes
- Monitor backup success/failure

## Support

For issues related to database connectivity:
1. Check this documentation
2. Review application logs
3. Test with provided scripts
4. Verify MongoDB service status
5. Check network connectivity

For additional support, refer to:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)