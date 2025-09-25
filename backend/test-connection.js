// Test script to verify frontend-backend connection
const axios = require('axios');

const BACKEND_URL = 'https://codexa-api.onrender.com';
const FRONTEND_URL = 'https://codexa-ochre.vercel.app';

async function testConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/healthz`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  try {
    // Test 2: CORS preflight
    console.log('\n2. Testing CORS preflight...');
    const corsResponse = await axios.options(`${BACKEND_URL}/api/auth/profile`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('✅ CORS preflight passed:', corsResponse.status);
  } catch (error) {
    console.log('❌ CORS preflight failed:', error.message);
  }

  try {
    // Test 3: API endpoint (without auth)
    console.log('\n3. Testing API endpoint...');
    const apiResponse = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    console.log('✅ API endpoint accessible:', apiResponse.status);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ API endpoint accessible (401 Unauthorized - expected without auth)');
    } else {
      console.log('❌ API endpoint failed:', error.message);
    }
  }

  console.log('\n🎯 Connection test completed!');
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Backend: ${BACKEND_URL}`);
}

testConnection().catch(console.error);
