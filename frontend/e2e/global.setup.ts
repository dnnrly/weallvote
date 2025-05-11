import { type FullConfig } from '@playwright/test';
import { createTestUser } from './auth-helpers.js';

async function globalSetup(config: FullConfig) {
  createTestUser('test2@example.com', 'abc123');
}

export default globalSetup;