// playwright-visual.config.js - Specific configuration for visual regression tests
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report-visual',
      open: 'never',
      attachmentsBaseURL: 'data/',
    }],
    ['list'],
    ['json', { outputFile: 'test-results/visual-results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on',              // Always take screenshots for visual tests
    video: 'retain-on-failure',
    // Specific settings for visual testing
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Visual regression specific settings
  expect: {
    // Threshold for visual comparisons (0-1, where 0 = exact match)
    toHaveScreenshot: { 
      threshold: 0.15,          // Allow 15% difference (more permissive than 0.1)
      mode: 'strict',           // Strict comparison mode
      animations: 'disabled',   // Disable animations for consistent screenshots
      maxDiffPixels: 50000,     // Allow up to 50,000 different pixels
    },
    toMatchSnapshot: { 
      threshold: 0.15,
      maxDiffPixels: 50000,
    },
  },

  projects: [
    // Desktop Chrome - Primary visual testing browser
    {
      name: 'visual-chrome-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
