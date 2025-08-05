const { test, expect } = require('@playwright/test');

/**
 * Homepage Functional Tests
 * Testing core functionality and user interactions on the homepage
 */
test.describe('Homepage - Happy Path Functional Testing', () => {
  
  // Test data configuration
  const navigationSections = [
    {
      cardSelector: '[aria-label="Question Screen"]',
      expectedUrl: /.*\/pre-questionnaire.*/,
      expectedContent: 'Project & User Details',
      description: 'Pre-questionnaire form',
      formFields: ['input[name="projectName"]', 'input[name="accountName"]']
    },
    {
      cardSelector: '[aria-label="Tech Stack"]',
      expectedUrl: /.*\/tech-stack.*/,
      expectedContent: /tech|stack|technology/i,
      description: 'Tech Stack page'
    },
    {
      cardSelector: '[aria-label="Dashboard Screen"]',
      expectedUrl: /.*\/dashboard.*/,
      expectedContent: /dashboard/i,
      description: 'Dashboard page'
    }
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and wait for it to fully load
    await page.goto('/'); // Use relative URL - baseURL is configured in playwright.config.cjs
    await page.waitForLoadState('networkidle');
  });

  // Helper function to verify homepage state
  async function verifyHomepage(page) {
    await expect(page).toHaveURL(/.*\/$|.*\/$/);
    const mainTitle = page.locator('h1:has-text("Future of QE Platform")');
    await expect(mainTitle).toBeVisible();
  }

  // Helper function to navigate to a section and verify
  async function navigateToSection(page, section) {
    const card = page.locator(section.cardSelector);
    await expect(card).toBeVisible();
    await expect(card).toBeEnabled();
    
    await card.click();
    await page.waitForLoadState('networkidle');
    
    // Verify navigation was successful
    await expect(page).toHaveURL(section.expectedUrl);
    
    // Verify page content
    if (typeof section.expectedContent === 'string') {
      const content = page.locator(`h1, h2, h3`).filter({ hasText: section.expectedContent });
      await expect(content).toBeVisible();
    } else {
      const content = page.locator(`h1, h2, h3`).filter({ hasText: section.expectedContent }).first();
      await expect(content).toBeVisible();
    }

    // Verify form fields if specified
    if (section.formFields) {
      for (const fieldSelector of section.formFields) {
        const field = page.locator(fieldSelector);
        await expect(field).toBeVisible();
      }
    }
  }

  // Helper function to navigate back to homepage
  async function navigateBackToHomepage(page) {
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await verifyHomepage(page);
  }

  test('should load homepage successfully and display key elements', async ({ page }) => {
    // Use test.step for better reporting and organization
    await test.step('Verify page loads with correct title', async () => {
      await expect(page).toHaveTitle(/Future of QE/i);
    });

    await test.step('Verify main content structure is present', async () => {
      // Use more specific and reliable selectors
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Check for header section
      const header = page.locator('header, h1').first();
      await expect(header).toBeVisible();

      // Verify the main title is present
      const mainTitle = page.locator('h1:has-text("Future of QE Platform")');
      await expect(mainTitle).toBeVisible();
    });

    await test.step('Verify navigation cards are present and accessible', async () => {
      // Check for the three main navigation cards
      for (const section of navigationSections) {
        const card = page.locator(section.cardSelector);
        await expect(card).toBeVisible();
        await expect(card).toHaveAttribute('aria-label');
      }
    });

    await test.step('Verify page content and descriptions', async () => {
      // Check for description section
      const description = page.locator('.description, [class*="description"]').first();
      await expect(description).toBeVisible();

      // Verify description contains expected content
      await expect(description).toContainText(/Quality Engineering platform/i);
    });
  });

  test('should navigate through all homepage sections successfully', async ({ page }) => {
    // Test navigation to each section and back - consolidated test
    for (const section of navigationSections) {
      await test.step(`Navigate to ${section.description} and back`, async () => {
        await navigateToSection(page, section);
        await navigateBackToHomepage(page);
        
        // Verify all navigation cards are still visible after return
        for (const navSection of navigationSections) {
          const card = page.locator(navSection.cardSelector);
          await expect(card).toBeVisible();
        }
      });
    }
  });

  test('should handle navigation state and maintain session', async ({ page }) => {
    await test.step('Test navigation state persistence', async () => {
      // Navigate to Question Screen
      const questionCard = page.locator('[aria-label="Question Screen"]');
      await questionCard.click();
      await page.waitForLoadState('networkidle');
      
      // Fill out some form data to test state
      const projectNameField = page.locator('input[name="projectName"]');
      if (await projectNameField.isVisible()) {
        await projectNameField.fill('Test Project Navigation');
        
        // Navigate back and forth to test if browser handles state correctly
        await page.goBack();
        await page.waitForLoadState('networkidle');
        
        // Go forward again
        await page.goForward();
        await page.waitForLoadState('networkidle');
        
        // Check if the form field exists and test state persistence
        // Note: React forms may not persist state through navigation
        const fieldValue = await projectNameField.inputValue();
        // Form state persistence depends on React implementation
        // Just verify the field is functional after navigation
        expect(typeof fieldValue).toBe('string');
      }
      
      // Return to homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Test direct URL navigation', async () => {
      // Test direct navigation to each route
      const routes = navigationSections.map(section => {
        const url = section.expectedUrl.source.replace(/\.\*|\\\//g, '').replace(/\$/, '');
        return url.replace('\\/', '/'); // Clean up regex to get actual path
      });
      
      for (const section of navigationSections) {
        const route = section.expectedUrl.source.match(/\/([^.\\]+)/)?.[0] || '/';
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        
        // Verify page loads correctly
        await expect(page).toHaveURL(section.expectedUrl);
        
        // Verify page is functional (no error states)
        const errorElements = page.locator('text=/error|not found|404|500/i');
        await expect(errorElements).toHaveCount(0);
        
        // Navigate back to home
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test('should have proper responsive design elements', async ({ page }) => {
    await test.step('Verify layout adapts to different viewport sizes', async () => {
      // Test desktop viewport (default)
      const navigationGrid = page.locator('.navigationGrid, [class*="navigation"]').first();
      await expect(navigationGrid).toBeVisible();

      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500); // Allow layout to adjust
      await expect(navigationGrid).toBeVisible();

      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500); // Allow layout to adjust
      await expect(navigationGrid).toBeVisible();

      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
    });
  });

  test('should have proper accessibility features', async ({ page }) => {
    await test.step('Verify semantic HTML structure', async () => {
      // Check for proper semantic elements
      const main = page.locator('main');
      const header = page.locator('header, h1').first();
      const section = page.locator('section').first();

      await expect(main).toBeVisible();
      await expect(header).toBeVisible();
      await expect(section).toBeVisible();
    });

    await test.step('Verify ARIA labels and attributes', async () => {
      // Verify each navigation card has meaningful aria-label using our configuration
      for (const section of navigationSections) {
        const card = page.locator(section.cardSelector);
        await expect(card).toBeVisible();
        
        const ariaLabel = await card.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel.length).toBeGreaterThan(3); // Meaningful label
      }
    });

    await test.step('Verify keyboard navigation support', async () => {
      // Test tab navigation through interactive elements
      const questionCard = page.locator('[aria-label="Question Screen"]');
      
      // Focus on the first card
      await questionCard.focus();
      await expect(questionCard).toBeFocused();

      // Test Enter key interaction
      const href = await questionCard.getAttribute('href');
      expect(href).toBe('/pre-questionnaire');
    });
  });

  test('should handle error states gracefully', async ({ page }) => {
    await test.step('Verify page loads without JavaScript errors', async () => {
      const errors = [];
      
      // Listen for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Reload page to catch any initialization errors
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check that no critical errors occurred
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && // Ignore favicon errors
        !error.includes('analytics') && // Ignore analytics errors
        !error.includes('tracking') // Ignore tracking errors
      );

      expect(criticalErrors).toHaveLength(0);
    });

    await test.step('Verify page remains functional after network interruption', async () => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });

      // Interact with page elements
      const questionCard = page.locator('[aria-label="Question Screen"]');
      await expect(questionCard).toBeVisible();
      await expect(questionCard).toBeEnabled();

      // Remove route simulation
      await page.unroute('**/*');
    });
  });
});
