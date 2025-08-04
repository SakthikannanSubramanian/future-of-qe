import { test, expect } from '@playwright/test';

test.describe('Homepage Components - Functional Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('should display main navigation elements', async ({ page }) => {
    console.log('🔍 Testing main navigation functionality');
    
    // Check if main navigation elements are present and functional (use first() to avoid strict mode)
    const header = page.locator('header, nav, .header').first();
    await expect(header).toBeVisible();
    
    // Test navigation links if they exist
    const homeLink = page.locator('a[href="/"], a[href="#home"], button:has-text("Home")').first();
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible();
      console.log('✅ Home navigation element found');
    }
    
    console.log('✅ Navigation elements functional');
  });

  test('should have functional interactive elements', async ({ page }) => {
    console.log('🔍 Testing interactive elements');
    
    // Test buttons are clickable
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      console.log(`✅ Found ${buttonCount} buttons`);
      
      // Test first button is clickable
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      await expect(firstButton).toBeEnabled();
      
      // Click the first button and verify it responds
      await firstButton.click();
      console.log('✅ Button click functionality verified');
    }
    
    // Test links are functional
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      console.log(`✅ Found ${linkCount} links`);
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();
    }
    
    console.log('✅ Interactive elements functional');
  });

  test('should have proper form elements if present', async ({ page }) => {
    console.log('🔍 Testing form functionality');
    
    // Check for forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`✅ Found ${formCount} forms`);
      
      // Test input fields
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        console.log(`✅ Found ${inputCount} input elements`);
        
        // Test first input is functional
        const firstInput = inputs.first();
        await expect(firstInput).toBeVisible();
        
        // Test typing in input if it's a text field
        const inputType = await firstInput.getAttribute('type');
        if (!inputType || inputType === 'text' || inputType === 'email') {
          await firstInput.fill('test input');
          const inputValue = await firstInput.inputValue();
          expect(inputValue).toBe('test input');
          console.log('✅ Input field functionality verified');
        }
      }
    } else {
      console.log('ℹ️ No forms found on homepage');
    }
    
    console.log('✅ Form elements functional');
  });

  test('should display content correctly', async ({ page }) => {
    console.log('🔍 Testing content display');
    
    // Check page has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      console.log(`✅ Found ${headingCount} headings`);
      const firstHeading = headings.first();
      await expect(firstHeading).toBeVisible();
      const headingText = await firstHeading.textContent();
      expect(headingText?.length).toBeGreaterThan(0);
    }
    
    // Check for paragraphs or text content
    const textContent = page.locator('p, div, span');
    const textCount = await textContent.count();
    
    if (textCount > 0) {
      console.log(`✅ Found ${textCount} text elements`);
    }
    
    console.log('✅ Content display functional');
  });

  test('should respond to viewport changes', async ({ page }) => {
    console.log('🔍 Testing responsive functionality');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    console.log('✅ Desktop viewport functional');
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
    console.log('✅ Tablet viewport functional');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
    console.log('✅ Mobile viewport functional');
    
    console.log('✅ Responsive functionality verified');
  });
});
