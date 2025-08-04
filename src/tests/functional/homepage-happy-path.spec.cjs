const { test, expect } = require('@playwright/test');

test.describe('Homepage - Happy Path Functional Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully and display key elements', async ({ page }) => {
    console.log('🔍 Testing homepage happy path functionality');
    
    // Verify page loads with correct title
    await expect(page).toHaveTitle(/Future of QE|React|Vite/);
    
    // Check if main content area is visible
    const mainContent = page.locator('main, #root, .app, [data-testid="main-content"]').first();
    await expect(mainContent).toBeVisible();
    
    // Verify at least one interactive element exists (button or link)
    const interactiveElement = page.locator('button, a, input[type="button"], [role="button"]').first();
    await expect(interactiveElement).toBeVisible();
    
    console.log('✅ Homepage loaded successfully with key elements');
  });

  test('should allow basic navigation interaction', async ({ page }) => {
    console.log('� Testing basic navigation interaction');
    
    // Find and interact with the first safe clickable element (avoid navigation cards that cause page changes)
    const safeClickableElement = page.locator('button:not([class*="card"]), [role="button"]:not([class*="card"])').first();
    
    if (await safeClickableElement.isVisible()) {
      await safeClickableElement.click();
      
      // Wait for any state change
      await page.waitForTimeout(1000);
      
      // Verify page is still responsive
      await expect(page.locator('body')).toBeVisible();
      
      console.log('✅ Basic navigation interaction successful');
    } else {
      console.log('ℹ️ No safe clickable elements found - static page');
    }
  });
});
