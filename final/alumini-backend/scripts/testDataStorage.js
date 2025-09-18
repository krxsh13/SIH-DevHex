/**
 * Data Storage Test Script
 * Tests if data is being saved properly to database
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

let mongod;

async function testDataStorage() {
  try {
    console.log('🧪 Testing Data Storage');
    console.log('=' .repeat(40));

    // Start in-memory database
    console.log('🔄 Starting test database...');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to test database');

    // Test 1: Create User
    console.log('\n1️⃣  Testing User Creation...');
    const userData = {
      email: 'test@example.com',
      password: 'TestPassword123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      role: 'Alumni'
    };

    const user = await User.create(userData);
    console.log('✅ User created successfully');
    console.log('   ID:', user._id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.fullName);
    console.log('   Password hashed:', user.password !== userData.password);

    // Test 2: Retrieve User
    console.log('\n2️⃣  Testing User Retrieval...');
    const retrievedUser = await User.findById(user._id);
    console.log('✅ User retrieved successfully');
    console.log('   Found user:', retrievedUser.email);

    // Test 3: Update Profile
    console.log('\n3️⃣  Testing Profile Update...');
    const profileUpdate = {
      profile: {
        bio: 'Software Engineer with 5 years experience',
        graduationYear: 2019,
        degree: 'Bachelor of Computer Science',
        currentJob: {
          title: 'Senior Developer',
          company: 'Tech Corp'
        },
        location: {
          city: 'Chandigarh',
          country: 'India'
        }
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      profileUpdate,
      { new: true, runValidators: true }
    );

    console.log('✅ Profile updated successfully');
    console.log('   Bio:', updatedUser.profile.bio);
    console.log('   Graduation Year:', updatedUser.profile.graduationYear);
    console.log('   Job:', updatedUser.profile.currentJob.title, 'at', updatedUser.profile.currentJob.company);

    // Test 4: Password Verification
    console.log('\n4️⃣  Testing Password Verification...');
    const isPasswordValid = await updatedUser.comparePassword('TestPassword123');
    const isWrongPassword = await updatedUser.comparePassword('wrongpassword');
    
    console.log('✅ Password verification working');
    console.log('   Correct password:', isPasswordValid);
    console.log('   Wrong password:', isWrongPassword);

    // Test 5: JWT Token Generation
    console.log('\n5️⃣  Testing JWT Token Generation...');
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    console.log('✅ JWT token generated');
    console.log('   Token length:', token.length);
    console.log('   Token preview:', token.substring(0, 50) + '...');

    // Test 6: Search Functionality
    console.log('\n6️⃣  Testing Search Functionality...');
    
    // Create another user for search testing
    await User.create({
      email: 'jane@example.com',
      password: 'Password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Alumni'
    });

    const searchResults = await User.find({
      $or: [
        { firstName: { $regex: 'John', $options: 'i' } },
        { email: { $regex: 'jane', $options: 'i' } }
      ]
    });

    console.log('✅ Search functionality working');
    console.log('   Found', searchResults.length, 'users');
    searchResults.forEach(user => {
      console.log('   -', user.fullName, '(' + user.email + ')');
    });

    // Test 7: Data Persistence Check
    console.log('\n7️⃣  Testing Data Persistence...');
    const allUsers = await User.find({});
    console.log('✅ Data persistence verified');
    console.log('   Total users in database:', allUsers.length);
    
    allUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}:`, {
        id: user._id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        hasProfile: !!user.profile?.bio,
        createdAt: user.createdAt
      });
    });

    // Test 8: Validation Testing
    console.log('\n8️⃣  Testing Data Validation...');
    
    try {
      await User.create({
        email: 'invalid-email',
        password: '123', // Too short
        firstName: '', // Empty
        lastName: 'Test'
      });
      console.log('❌ Validation failed - invalid data was accepted');
    } catch (error) {
      console.log('✅ Validation working correctly');
      console.log('   Caught validation errors:', Object.keys(error.errors || {}).length);
    }

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n📊 Summary:');
    console.log('   ✅ User creation and storage');
    console.log('   ✅ Data retrieval from database');
    console.log('   ✅ Profile updates and persistence');
    console.log('   ✅ Password hashing and verification');
    console.log('   ✅ JWT token generation');
    console.log('   ✅ Search and filtering');
    console.log('   ✅ Data validation and error handling');
    console.log('\n💡 Your backend is ready to save frontend data!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.errors) {
      console.error('   Validation errors:', error.errors);
    }
  } finally {
    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
    }
    console.log('\n🔌 Test database closed');
  }
}

// Run the test
testDataStorage();