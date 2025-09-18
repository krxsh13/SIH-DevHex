/**
 * Demo Startup Script
 * Starts the backend server and opens the frontend demo
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Alumni Management Demo...');
console.log('=' .repeat(50));

// Start the server
console.log('📡 Starting backend server...');
const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

// Wait a moment for server to start
setTimeout(() => {
  console.log('\n🌐 Frontend Demo Available:');
  console.log('   Open: http://localhost:5000/demo.html');
  console.log('\n📋 API Endpoints:');
  console.log('   Health: http://localhost:5000/api/health');
  console.log('   Register: POST http://localhost:5000/api/auth/register');
  console.log('   Login: POST http://localhost:5000/api/auth/login');
  console.log('   Profile: GET http://localhost:5000/api/auth/profile');
  console.log('\n💡 Instructions:');
  console.log('   1. Open the demo URL in your browser');
  console.log('   2. Register a new user');
  console.log('   3. See the data get saved to database');
  console.log('   4. Login and view your profile');
  console.log('\n⚡ Press Ctrl+C to stop the demo');
}, 2000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping demo...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping demo...');
  server.kill();
  process.exit(0);
});