import { test, expect } from '@playwright/test';

test.describe('Visual Regression Demo - Detecting Changes', () => {
  test('should detect visual differences when CSS changes', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // DEMO: Inject a small visual change to demonstrate difference detection
    // This will make the title text red - easily visible difference
    await page.addStyleTag({
      content: `
        h1, h2, [class*="mainTitle"] {
          color: red !important;
          border: 3px solid blue !important;
        }
      `
    });

    await page.waitForTimeout(500);

    // This screenshot will be compared against the baseline
    // Since we added red color and blue border, it should show differences
    await expect(page).toHaveScreenshot('homepage-desktop-with-changes.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match baseline when no changes are made', async ({ page }) => {
    // Navigate to homepage without any modifications
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // This should match the baseline exactly
    await expect(page).toHaveScreenshot('homepage-desktop-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
