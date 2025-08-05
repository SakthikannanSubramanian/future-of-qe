import { Page, Locator, expect } from '@playwright/test';

/**
 * Interface for dependency injection container
 */
export interface IDependencyContainer {
  page: Page;
  baseURL: string;
}

/**
 * Base Page Object Model class with dependency injection
 * Provides common functionality and patterns for all page objects
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  /**
   * Constructor with dependency injection
   * @param dependencies - Container with injected dependencies
   */
  constructor(dependencies: IDependencyContainer) {
    this.page = dependencies.page;
    this.baseURL = dependencies.baseURL;
  }

  /**
   * Navigate to the page
   * @param path - Optional path to append to base URL
   */
  async goto(path: string = ''): Promise<void> {
    const fullURL = `${this.baseURL}${path}`;
    await this.page.goto(fullURL);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for element to be visible with timeout
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for element to be hidden with timeout
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Safe click with retry mechanism
   * @param locator - Element locator
   * @param options - Click options
   */
  async safeClick(locator: Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.waitForVisible(locator, options?.timeout);
    await locator.click(options);
  }

  /**
   * Safe fill with clear and validation
   * @param locator - Input element locator
   * @param value - Value to fill
   * @param shouldValidate - Whether to validate the input
   */
  async safeFill(locator: Locator, value: string, shouldValidate: boolean = true): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(value);
    
    if (shouldValidate) {
      await expect(locator).toHaveValue(value);
    }
  }

  /**
   * Take screenshot with custom name
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Scroll element into view
   * @param locator - Element locator
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get element text content safely
   * @param locator - Element locator
   * @returns Text content or empty string
   */
  async getTextContent(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if element exists without waiting
   * @param locator - Element locator
   * @returns Boolean indicating if element exists
   */
  async isElementPresent(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'attached', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for URL to match pattern
   * @param pattern - URL pattern (string or regex)
   * @param timeout - Timeout in milliseconds
   */
  async waitForURL(pattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Abstract method to be implemented by specific page objects
   * Should define page-specific validation
   */
  abstract isPageLoaded(): Promise<boolean>;

  /**
   * Abstract method to get page title
   */
  abstract getPageTitle(): Promise<string>;
}
