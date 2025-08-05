import { test, expect } from '@playwright/test';

/**
 * Homepage Visual Regression - Responsive Breakpoints
 * Core visual regression testing for homepage across different viewport sizes
 */
test.describe('Homepage Visual Regression - Responsive Breakpoints', () => {
  
  // Responsive breakpoint configurations
  const breakpoints = [
    { name: 'desktop', width: 1920, height: 1080, description: 'Desktop breakpoint' },
    { name: 'tablet', width: 768, height: 1024, description: 'Tablet breakpoint' },
    { name: 'mobile', width: 375, height: 667, description: 'Mobile breakpoint' }
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);
  });

  // Helper function for consistent screenshot taking
  async function takeResponsiveScreenshot(page, breakpoint) {
    await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
    await page.waitForTimeout(500); // Allow layout to adjust

    await expect(page).toHaveScreenshot(`homepage-${breakpoint.name}-fullpage.png`, {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,
      maxDiffPixels: 50000,
    });
  }

  // Data-driven test for all responsive breakpoints
  for (const breakpoint of breakpoints) {
    test(`should match homepage on ${breakpoint.description} (${breakpoint.width}x${breakpoint.height})`, async ({ page }) => {
      await takeResponsiveScreenshot(page, breakpoint);
    });
  }

  // Combined test for quick responsive verification
  test('should maintain visual consistency across all breakpoints', async ({ page }) => {
    for (const breakpoint of breakpoints) {
      await test.step(`Verify ${breakpoint.description}`, async () => {
        await takeResponsiveScreenshot(page, breakpoint);
      });
    }
  });
});
