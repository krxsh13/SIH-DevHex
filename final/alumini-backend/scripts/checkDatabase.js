/**
 * Database Checker Script
 * Checks if data is being stored in the database
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('../models/User');

async function checkDatabase() {
  try {
    console.log('🔍 Checking Database Connection and Data...\n');

    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_management';
    console.log('📡 Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully\n');

    // Check total user count
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total Users in Database: ${totalUsers}\n`);

    if (totalUsers > 0) {
      // Get all users
      const users = await User.find({}, 'firstName lastName email role createdAt isActive')
        .sort({ createdAt: -1 })
        .limit(10);

      console.log('👥 Recent Users:');
      console.log('================');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log('');
      });

      // Get users by role
      const roleCounts = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      console.log('📈 Users by Role:');
      console.log('=================');
      roleCounts.forEach(role => {
        console.log(`${role._id}: ${role.count} users`);
      });
      console.log('');

      // Get recent registrations (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: yesterday }
      });

      console.log(`🕐 New Users (Last 24 hours): ${recentUsers}\n`);

    } else {
      console.log('❌ No users found in database');
      console.log('💡 Try registering a new user through the frontend\n');
    }

    // Check database stats
    const stats = await mongoose.connection.db.stats();
    console.log('💾 Database Statistics:');
    console.log('======================');
    console.log(`Collections: ${stats.collections}`);
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log(`Indexes: ${stats.indexes}`);

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the check
checkDatabase();
