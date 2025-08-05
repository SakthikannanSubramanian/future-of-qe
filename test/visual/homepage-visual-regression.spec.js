import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Regression - Responsive Breakpoints', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);
  });

  test('should match homepage on desktop breakpoint', async ({ page }) => {
    // Desktop breakpoint: 1920x1080
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500); // Allow layout to adjust

    await expect(page).toHaveScreenshot('homepage-desktop-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage on tablet breakpoint', async ({ page }) => {
    // Tablet breakpoint: 768x1024
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Allow layout to adjust

    await expect(page).toHaveScreenshot('homepage-tablet-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage on mobile breakpoint', async ({ page }) => {
    // Mobile breakpoint: 375x667
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout to adjust

    await expect(page).toHaveScreenshot('homepage-mobile-fullpage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
