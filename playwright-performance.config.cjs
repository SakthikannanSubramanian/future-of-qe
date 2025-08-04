// playwright-performance.config.js - Configuration for performance testing
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/tests/performance',
  fullyParallel: false, // Run performance tests sequentially for accurate results
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker for consistent performance measurements
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report-performance',
      open: 'never',
      attachmentsBaseURL: 'data/',
    }],
    ['list'],
    ['json', { outputFile: 'test-results/performance-results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    // Performance testing specific settings
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    // Desktop Chrome - Performance testing
    {
      name: 'performance-chrome-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        // Disable some features for consistent performance measurement
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
        },
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
