import { test, expect } from '@playwright/test'

test('usuario inicia sesión y accede a /train', async ({ page }) => {
  await page.route('**/api/auth/session**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: { name: 'Test User', email: 'test@example.com' },
      expires: '2999-01-01T00:00:00.000Z'
    })
  }))

  await page.goto('/')
  await page.getByRole('link', { name: 'Entrenar' }).click()
  await expect(page).toHaveURL(/\/train$/)
  await expect(page.getByText('Entrenamiento')).toBeVisible()
})

test('usuario completa un ejercicio y recibe feedback', async ({ page }) => {
  await page.route('**/api/trainings/random*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 1,
      inputString: 'abc123',
      description: 'Encuentra los números'
    })
  }))
  await page.route('**/api/trainings/validate', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true })
  }))

  await page.goto('/train')
  await page.locator('textarea').fill('\\d+')
  await page.getByRole('button', { name: 'Validar' }).click()
  await expect(page.getByText('¡Correcto!')).toBeVisible()
})

test('usuario visita /docs y visualiza documentación', async ({ page }) => {
  await page.goto('/docs')
  await expect(page.getByRole('heading', { name: 'Documentación de Expresiones Regulares' })).toBeVisible()
})
