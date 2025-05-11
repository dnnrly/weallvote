import { test, expect } from '@playwright/test';

test('can sign up a new user', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc123');
  await page.getByTestId('modal-submit-button').click();
});

test('can log in an existing user', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByTestId('nav-login-button').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc123');
  await page.getByTestId('modal-submit-button').click();
});

