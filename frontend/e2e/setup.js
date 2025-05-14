// e2e/setup.js
// Create a simplified version that just pings the Firebase emulator URL

import { get, request } from 'node:http';

// Get the Firebase Auth Emulator host from environment or default to localhost:9099
const FIREBASE_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
const PROJECT_ID = 'demo-weallvote';
const FAKE_API_KEY = 'fake-api-key';

// Maximum time to wait for the emulator to be ready (30 seconds)
const MAX_WAIT_TIME = 30000;
// Check interval (500ms)
const CHECK_INTERVAL = 500;
// Initial delay before first check (2 seconds)
const INITIAL_DELAY = 2000;

async function checkEmulatorHealth() {
  return new Promise((resolve) => {
    // Use the actual auth endpoint that will be used by the tests
    const url = `http://${FIREBASE_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FAKE_API_KEY}`;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = request(url, options, (res) => {
      // Even if the response is an error, if we got a response, the server is up
      // The important thing is that the server responded, not that the request succeeded
      if (res.statusCode) {
        resolve(true);
      } else {
        resolve(false);
      }
      
      // Consume the response data to free up memory
      res.resume();
    });
    
    req.on('error', (err) => {
      resolve(false);
    });
    
    // Send a test user creation request
    req.write(JSON.stringify({
      email: 'healthcheck@example.com',
      password: 'test-password'
    }));
    
    req.end();
  });
}

async function deleteAllUsers() {
  return new Promise((resolve) => {
    const url = `http://${FIREBASE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts`;
    console.log(`Attempting to clear all test users: ${url}`);
    
    const options = {
      method: 'DELETE',
    };
    
    const req = request(url, options, (res) => {
      // Collect the response data in case there's an error message
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Successfully cleared all test users');
          resolve();
        } else {
          console.warn(`Failed to clear test users: HTTP ${res.statusCode}`);
          if (responseData) {
            console.warn(`Response: ${responseData}`);
          }
          resolve(); // Continue anyway
        }
      });
    });
    
    req.on('error', (error) => {
      console.warn('Error clearing test users:', error.message);
      console.warn('Will continue with tests anyway');
      resolve(); // Continue anyway
    });
    
    req.end();
  });
}

async function waitForEmulator() {
  console.log('Setting up E2E test environment...');
  console.log(`Firebase Auth Emulator Host: ${FIREBASE_EMULATOR_HOST}`);
  
  // Add an initial delay to allow the emulator to fully initialize
  console.log(`Waiting ${INITIAL_DELAY}ms for initial emulator startup...`);
  await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY));
  
  const startTime = Date.now();
  let attemptCount = 0;
  
  while (Date.now() - startTime < MAX_WAIT_TIME) {
    try {
      const isHealthy = await checkEmulatorHealth();
      
      if (isHealthy) {
        console.log(`Firebase Auth emulator is ready after ${Date.now() - startTime}ms (${attemptCount} attempts)`);
        try {
          await deleteAllUsers();
        } catch (e) {
          console.warn(`Warning: Could not clear users but continuing anyway: ${e.message}`);
        }
        return;
      }
    } catch (error) {
      console.warn(`Error during health check: ${error.message}`);
    }
    
    // Wait before the next check
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  console.error(`Firebase Auth emulator did not become ready within ${MAX_WAIT_TIME}ms after ${attemptCount} attempts`);
  console.error('This might indicate a configuration issue with the Firebase emulator.');
  console.error('Check that the container is running and the ports are correctly mapped.');
  process.exit(1);
}

// Run the script
waitForEmulator();
