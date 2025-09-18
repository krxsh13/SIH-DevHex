# MongoDB Setup Guide

## 🚀 Quick Solutions for MongoDB Connection Issues

### Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED FOR MVP**

**Easiest solution - No local installation needed!**

#### Step 1: Create Free MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create account
3. Create a new cluster (select FREE tier)
4. Wait for cluster to be created (2-3 minutes)

#### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### Step 3: Update Your .env File
```env
# Replace this line in your .env file:
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/alumni_management

# Example:
MONGODB_URI=mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/alumni_management
```

#### Step 4: Whitelist Your IP
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)

**✅ Done! Your app will now connect to cloud MongoDB**

---

### Option 2: Local MongoDB Installation

#### For Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will start automatically as a service

#### For macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### For Linux (Ubuntu):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

### Option 3: Docker MongoDB (For Developers)

#### Step 1: Install Docker
Download from [docker.com](https://www.docker.com/products/docker-desktop)

#### Step 2: Run MongoDB Container
```bash
# Run MongoDB in Docker
docker run -d \
  --name alumni-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=alumni_management \
  mongo:latest

# Your .env should be:
MONGODB_URI=mongodb://admin:password123@localhost:27017/alumni_management
```

#### Step 3: Manage Container
```bash
# Stop MongoDB
docker stop alumni-mongodb

# Start MongoDB
docker start alumni-mongodb

# Remove container (if needed)
docker rm alumni-mongodb
```

---

### Option 4: MongoDB Memory Server (For Testing)

**Perfect for development/testing - no installation needed!**

#### Step 1: Install Memory Server
```bash
cd alumini-backend
npm install --save-dev mongodb-memory-server
```

#### Step 2: Create Development Database Config
```javascript
// config/db-dev.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

const connectDB = async () => {
  try {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('🚀 Starting in-memory MongoDB...');
    console.log('📍 URI:', uri);
    
    await mongoose.connect(uri);
    console.log('✅ Connected to in-memory MongoDB');
    
    return uri;
  } catch (error) {
    console.error('❌ Memory MongoDB connection failed:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log('🔌 Disconnected from in-memory MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting:', error);
  }
};

module.exports = { connectDB, disconnectDB };
```

#### Step 3: Add Development Script
```json
// Add to package.json scripts:
"dev:memory": "NODE_ENV=development node scripts/startWithMemoryDB.js"
```

---

## 🔍 Troubleshooting

### Check MongoDB Status

#### Windows:
```cmd
# Check if MongoDB service is running
sc query MongoDB

# Start MongoDB service
net start MongoDB
```

#### macOS/Linux:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB status (Linux)
sudo systemctl status mongod

# Check MongoDB status (macOS)
brew services list | grep mongodb
```

### Test Connection
```bash
# Test database connection
npm run demo:db

# Or manually test
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log('✅ Connected'))
  .catch(err => console.log('❌ Failed:', err.message));
"
```

### Common Connection Errors

#### Error: `ECONNREFUSED 127.0.0.1:27017`
**Solution:** MongoDB is not running
- Start MongoDB service
- Or use MongoDB Atlas (cloud)

#### Error: `Authentication failed`
**Solution:** Check username/password in connection string

#### Error: `Server selection timed out`
**Solution:** 
- Check if MongoDB is accessible
- Verify firewall settings
- For Atlas: check IP whitelist

---

## 🎯 **RECOMMENDED QUICK FIX**

**For immediate testing, use MongoDB Atlas:**

1. **Sign up**: [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
2. **Create cluster**: Choose free tier
3. **Get connection string**: Replace in your `.env`
4. **Whitelist IP**: Allow access from anywhere
5. **Test**: Run `npm start`

**Takes 5 minutes and works immediately!** ✅

---

## 📱 Alternative: Skip Database for Frontend Testing

If you just want to test frontend connectivity without database:

```javascript
// Temporary: Mock database responses
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful (mock)',
    data: {
      user: { id: '123', email: req.body.email, firstName: req.body.firstName },
      token: 'mock-jwt-token'
    }
  });
});
```

This lets you test frontend integration while setting up the real database.