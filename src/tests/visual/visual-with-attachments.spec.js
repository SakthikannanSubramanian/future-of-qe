import { test, expect } from '@playwright/test';

test.describe('Visual Regression with Report Attachments', () => {
  test('should attach screenshots to report for comparison', async ({ page }, testInfo) => {
    console.log('🎯 Visual test with screenshot attachments');
    
    // Navigate to homepage
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    console.log('✅ Page loaded and viewport set');
    
    // Take a screenshot before any modifications (this will be attached to report)
    const beforeScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('01-baseline-screenshot', { 
      body: beforeScreenshot, 
      contentType: 'image/png' 
    });
    
    // Apply some visual changes for demonstration
    await page.addStyleTag({
      content: `
        /* Adding subtle changes for comparison */
        h1, h2 { 
          color: #e74c3c !important; 
          font-weight: bold !important;
        }
        button { 
          background-color: #3498db !important; 
          color: white !important;
          border-radius: 8px !important;
        }
      `
    });
    
    await page.waitForTimeout(500);
    console.log('✅ Applied visual modifications');
    
    // Take a screenshot after modifications (this will be attached to report)
    const afterScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('02-modified-screenshot', { 
      body: afterScreenshot, 
      contentType: 'image/png' 
    });
    
    // Main visual regression test - this will show expected vs actual in report
    await expect(page).toHaveScreenshot('homepage-with-attachments.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,
      maxDiffPixels: 50000,
    });
    
    console.log('✅ Visual regression test completed with attachments');
  });

  test('should demonstrate visual comparison workflow', async ({ page }, testInfo) => {
    console.log('🎯 Demonstrating visual comparison with baseline');
    
    // Navigate to homepage
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport (same as our baseline)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Take screenshot for manual comparison in report
    const currentScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('current-state-screenshot', { 
      body: currentScreenshot, 
      contentType: 'image/png' 
    });
    
    // Add metadata about the test
    await testInfo.attach('test-metadata', { 
      body: JSON.stringify({
        viewport: { width: 1920, height: 1080 },
        url: page.url(),
        timestamp: new Date().toISOString(),
        testPurpose: 'Visual regression baseline comparison',
        thresholdSettings: {
          threshold: 0.15,
          maxDiffPixels: 50000
        }
      }, null, 2), 
      contentType: 'application/json' 
    });
    
    // Visual regression test using existing baseline
    await expect(page).toHaveScreenshot('homepage-desktop-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,
      maxDiffPixels: 50000,
    });
    
    console.log('✅ Baseline comparison completed with metadata');
  });
});
