import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Baseline Comparison', () => {
  test('should show differences when compared to established baseline', async ({ page }, testInfo) => {
    console.log('🎯 Demonstrating Visual Difference Detection Against Baseline');
    
    // Navigate to homepage
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport (same as baseline)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Take screenshot before changes for report attachment
    const beforeChanges = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('01-original-state', { 
      body: beforeChanges, 
      contentType: 'image/png' 
    });
    
    // Inject noticeable CSS changes to demonstrate difference detection
    await page.addStyleTag({
      content: `
        /* Making obvious visual changes for demonstration */
        body { 
          background: linear-gradient(45deg, #ffcccc, #ccffcc) !important; 
        }
        h1, h2, h3 { 
          color: red !important; 
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
        }
        button, .btn { 
          border: 4px solid blue !important; 
          background-color: yellow !important;
          color: black !important;
        }
        .card, [class*="card"] { 
          border: 3px dashed purple !important; 
          background-color: rgba(255, 0, 255, 0.1) !important;
        }
      `
    });
    
    console.log('✅ Applied visual changes - background gradient, red text, colored borders');
    await page.waitForTimeout(500);
    
    // Take screenshot after changes for report attachment
    const afterChanges = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('02-modified-state', { 
      body: afterChanges, 
      contentType: 'image/png' 
    });
    
    // This will create a screenshot with our changes
    // The filename matches our baseline, so Playwright will compare them
    await expect(page).toHaveScreenshot('homepage-desktop-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,        // Allow up to 15% difference
      maxDiffPixels: 50000,   // Allow up to 50,000 different pixels
    });
  });

  test('should match baseline exactly when no changes are made', async ({ page }, testInfo) => {
    console.log('🎯 Testing exact match with baseline (should pass)');
    
    // Navigate to homepage without any modifications
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport (same as baseline)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    console.log('✅ Page loaded without modifications');
    
    // Take screenshot for report attachment
    const cleanState = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('clean-homepage-state', { 
      body: cleanState, 
      contentType: 'image/png' 
    });
    
    // This should match the existing baseline exactly
    await expect(page).toHaveScreenshot('homepage-desktop-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,        // Allow up to 15% difference for minor rendering variations
      maxDiffPixels: 50000,   // Allow up to 50,000 different pixels
    });
  });
});
