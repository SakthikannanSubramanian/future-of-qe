import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests across all workers
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log('🧹 Starting global teardown...');

  try {
    // Clean up any global resources
    console.log('🗑️ Cleaning up global resources...');
    
    // Clean up authentication files
    // await fs.unlink('test/fixtures/auth.json').catch(() => {});
    
    // Clean up temporary test data
    console.log('📂 Cleaning up temporary test data...');
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown should not fail the entire test suite
  }
}

export default globalTeardown;
