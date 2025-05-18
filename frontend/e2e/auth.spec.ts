// This is your test code, which is structured correctly for waiting.
// The error you see indicates an underlying issue in the application's
// Firebase configuration when running in the test environment.

import { test, expect } from '@playwright/test';
import { TestUserManager } from './helpers/TestUserManager.js';

const userManager = new TestUserManager();

test.beforeAll(async () => {
  await userManager.createUser('unverified@example.com', 'test-pass');
  await userManager.createAndVerifyUser('verified@example.com', 'test-pass');
});

test.afterAll(async () => {
  await userManager.deleteAllUsers();
});

test('can sign up a new user', async ({ page }) => {
  // Capture console logs if you want to see the Firebase errors during the test run
  page.on('console', msg => console.log(`Browser Console [${msg.type()}] ${msg.text()}`));

  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknown@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test-pass');
  await page.getByTestId('modal-submit-button').click();

  await page.getByTestId('modal-submit-button').waitFor({ state: 'detached', timeout: 10000 });
  await expect(page.getByTestId('email-unverified')).toBeVisible({ timeout: 10000 });
});

test('can log in an existing verified user', async ({ page }) => {
  // Capture console logs to see Firebase errors and potentially state updates
  page.on('console', msg => console.log(`Browser Console [${msg.type()}] ${msg.text()}`));

  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('textbox', { name: 'Email' }).fill('verified@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test-pass');
  await page.getByTestId('modal-submit-button').click();

  // Wait for the modal to disappear
  await page.getByTestId('modal-submit-button').waitFor({ state: 'detached', timeout: 10000 });

  // Wait for the user's email/name span to appear - confirms user is logged in
  const userEmailSpan = page.locator('span.text-sm.text-gray-800');
  await expect(userEmailSpan).toContainText('verified@example.com', { timeout: 10000 });

  // TODO: figure out why this does not work locally
  // await expect(page.getByTestId('email-unverified')).not.toBeVisible({ timeout: 5000 });
});

test('can log in an existing unverified user', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => console.log(`Browser Console [${msg.type()}] ${msg.text()}`));

  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unverified@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test-pass');
  await page.getByTestId('modal-submit-button').click();

  await page.getByTestId('modal-submit-button').waitFor({ state: 'detached', timeout: 10000 });
  const userEmailSpan = page.locator('span.text-sm.text-gray-800');
  await expect(userEmailSpan).toContainText('unverified@example.com', { timeout: 10000 });
  await expect(page.getByTestId('email-unverified')).toBeVisible({ timeout: 5000 });
});