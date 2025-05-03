import { test, expect } from '@playwright/test'

test('homepage has Tailwind demo', async ({ page }) => {
  await page.goto('/')
  
  // Element should be visible
  await expect(page.locator('text=Vue + Tailwind 4')).toBeVisible()
  
  // Button should exist
  await expect(page.locator('button', { hasText: 'Get Started' })).toBeVisible()
})
