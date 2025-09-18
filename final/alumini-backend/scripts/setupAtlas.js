/**
 * MongoDB Atlas Setup Helper
 * Guides user through setting up cloud MongoDB
 */

const fs = require('fs');
const path = require('path');

console.log('🌐 MongoDB Atlas Setup Guide');
console.log('=' .repeat(50));

console.log('\n📋 Follow these steps to set up cloud MongoDB (FREE):');
console.log('\n1️⃣  Create MongoDB Atlas Account:');
console.log('   • Go to: https://www.mongodb.com/atlas');
console.log('   • Click "Try Free" and sign up');
console.log('   • Verify your email');

console.log('\n2️⃣  Create a Cluster:');
console.log('   • Click "Build a Database"');
console.log('   • Choose "FREE" shared cluster');
console.log('   • Select a cloud provider and region');
console.log('   • Click "Create Cluster" (takes 2-3 minutes)');

console.log('\n3️⃣  Create Database User:');
console.log('   • Go to "Database Access" in left menu');
console.log('   • Click "Add New Database User"');
console.log('   • Choose "Password" authentication');
console.log('   • Enter username and password (remember these!)');
console.log('   • Set role to "Atlas Admin"');
console.log('   • Click "Add User"');

console.log('\n4️⃣  Whitelist IP Address:');
console.log('   • Go to "Network Access" in left menu');
console.log('   • Click "Add IP Address"');
console.log('   • Click "Allow Access from Anywhere" (for development)');
console.log('   • Click "Confirm"');

console.log('\n5️⃣  Get Connection String:');
console.log('   • Go back to "Database" (clusters view)');
console.log('   • Click "Connect" on your cluster');
console.log('   • Choose "Connect your application"');
console.log('   • Copy the connection string');
console.log('   • It looks like: mongodb+srv://username:password@cluster.mongodb.net/');

console.log('\n6️⃣  Update Your .env File:');
console.log('   • Replace the MONGODB_URI in your .env file');
console.log('   • Example:');
console.log('     MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/alumni_management');

console.log('\n✅ Once completed, run: npm start');
console.log('   Your app will connect to cloud MongoDB!');

console.log('\n💡 Alternative: Quick Test with In-Memory Database');
console.log('   Run: npm run dev:memory');
console.log('   (No MongoDB installation or setup needed!)');

// Check if .env exists and show current config
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
  
  if (mongoLine) {
    console.log('\n📄 Current .env configuration:');
    console.log('   ' + mongoLine);
    
    if (mongoLine.includes('localhost')) {
      console.log('   ⚠️  Currently set to localhost - update this with Atlas connection string');
    } else if (mongoLine.includes('mongodb+srv://')) {
      console.log('   ✅ Looks like Atlas connection string is configured');
    }
  }
}

console.log('\n🆘 Need help? Check: docs/mongodb-setup.md');
console.log('=' .repeat(50));