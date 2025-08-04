const { defineConfig, devices } = require('@playwright/test');

/**
 * E2E Playwright Configuration
 */
module.exports = defineConfig({
  testDir: './src/tests/e2e',
  
  fullyParallel: false, // Run E2E tests sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker for E2E stability
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-e2e' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  timeout: 90000, // Longer timeout for E2E
  expect: {
    timeout: 15000,
  },
  
  outputDir: 'test-results-e2e/',
});
