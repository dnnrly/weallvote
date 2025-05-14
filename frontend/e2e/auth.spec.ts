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
  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknown@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test-pass');
  await page.getByTestId('modal-submit-button').click();
  // Make sure that the modal dialog is closed
  await page.getByTestId('modal-submit-button').waitFor({ state: 'detached' });
});

test('can log in an existing unverified user', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unverified@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test-pass');
  await page.getByTestId('modal-submit-button').click();
});

