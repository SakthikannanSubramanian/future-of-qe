import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Runs once before all tests across all workers
 */
async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🚀 Starting global setup...');

  // Launch browser for global setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Verify application is running
    console.log('🔍 Verifying application availability...');
    await page.goto(config.projects[0]?.use?.baseURL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Perform any global authentication setup here
    console.log('🔐 Setting up global authentication state...');
    
    // Save authentication state if needed
    // await page.context().storageState({ path: 'test/fixtures/auth.json' });
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
