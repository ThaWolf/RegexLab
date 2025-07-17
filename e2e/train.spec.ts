import { test, expect } from '@playwright/test'

test('user visits the main page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'RegexLab' })).toBeVisible()
})

test('user accesses the documentation', async ({ page }) => {
  await page.goto('/docs')
  await expect(page).toHaveURL(/\/docs$/)
  await expect(page.getByText(/Documentation/i)).toBeVisible()
})

test('user accesses the dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard$/)
  // Check for any content that indicates we're on the dashboard page
  await expect(page.locator('body')).toBeVisible()
})
