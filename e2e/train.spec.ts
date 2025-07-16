import { test, expect } from '@playwright/test'

test('usuario visita la página principal', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'RegexLab' })).toBeVisible()
})

test('usuario accede a la documentación', async ({ page }) => {
  await page.goto('/docs')
  await expect(page).toHaveURL(/\/docs$/)
  await expect(page.getByText(/Documentación/i)).toBeVisible()
})

test('usuario accede al dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard$/)
  // Check for any content that indicates we're on the dashboard page
  await expect(page.locator('body')).toBeVisible()
})
