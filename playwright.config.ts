import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: (process.env.PLAYWRIGHT_BASE_URL as string) || 'http://localhost:3000',
    headless: true,
  },
})
