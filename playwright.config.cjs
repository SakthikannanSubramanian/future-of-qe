const { defineConfig, devices } = require('@playwright/test');

/**
 * Consolidated Playwright Configuration
 * Supports all test types: functional, e2e, performance, and visual
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Global test configuration
  testDir: './src/tests',
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Global timeout settings */
  timeout: 90000, // 90 seconds for E2E tests
  expect: {
    timeout: 15000, // 15 seconds for expect assertions
  },
  
  /* Reporter configuration */
  reporter: [
    ['list'],
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never',
      attachmentsBaseURL: 'data/',
    }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  /* Shared settings for all projects */
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  
  /* Configure projects for different test types */
  projects: [
    // FUNCTIONAL TESTS
    {
      name: 'functional',
      testDir: './src/tests/functional',
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
      outputDir: 'test-results/functional/',
    },
    
    // E2E TESTS
    {
      name: 'e2e',
      testDir: './src/tests/e2e',
      fullyParallel: false, // Run E2E tests sequentially
      retries: process.env.CI ? 1 : 0,
      workers: 1, // Single worker for E2E stability
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
      outputDir: 'test-results/e2e/',
    },
    
    // PERFORMANCE TESTS
    {
      name: 'performance',
      testDir: './src/tests/performance',
      fullyParallel: false, // Run performance tests sequentially for accurate results
      retries: process.env.CI ? 1 : 0,
      workers: 1, // Single worker for consistent performance measurements
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        screenshot: 'on',
        video: 'retain-on-failure',
        // Performance testing specific settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
        },
      },
      outputDir: 'test-results/performance/',
    },
    
    // VISUAL REGRESSION TESTS
    {
      name: 'visual',
      testDir: './src/tests/visual',
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        screenshot: 'on', // Always take screenshots for visual tests
        video: 'retain-on-failure',
        // Specific settings for visual testing
        actionTimeout: 10000,
        navigationTimeout: 30000,
      },
      // Visual regression specific settings
      expect: {
        // Threshold for visual comparisons (0-1, where 0 = exact match)
        toHaveScreenshot: { 
          threshold: 0.15,          // Allow 15% difference
          mode: 'strict',           // Strict comparison mode
          animations: 'disabled',   // Disable animations for consistent screenshots
          maxDiffPixels: 50000,     // Allow up to 50,000 different pixels
        },
        toMatchSnapshot: { 
          threshold: 0.15,
          maxDiffPixels: 50000,
        },
      },
      outputDir: 'test-results/visual/',
    },
  ],
  
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  /* Global output directory */
  outputDir: 'test-results/',
});
