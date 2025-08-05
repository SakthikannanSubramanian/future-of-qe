# Visual Regression Testing

This directory contains visual regression tests for the Future of QE application using Playwright's screenshot comparison capabilities.

## Overview

Visual regression testing helps detect unintended changes to the user interface by comparing screenshots of components and pages against baseline images. This ensures that:

- Layout changes are intentional and approved
- Styling updates don't break other parts of the UI
- Responsive design works across different viewports
- Theme variations render correctly
- Interactive states (hover, focus) display properly

## Test Structure

### 📁 Files
- `homepage-visual-regression.spec.js` - Complete visual tests for homepage
- `../playwright-visual.config.js` - Specific configuration for visual tests

### 🧪 Test Categories

1. **Basic Visual Tests**
   - Full page screenshots
   - Viewport screenshots
   - Component-specific screenshots

2. **Responsive Design Tests**
   - Desktop (1920x1080)
   - Tablet (768x1024) 
   - Mobile (375x667)
   - Large Desktop (2560x1440)

3. **Theme Variation Tests**
   - Light theme
   - Dark theme

4. **Interactive State Tests**
   - Hover states
   - Focus states
   - Active states

5. **Network Condition Tests**
   - Slow network simulation
   - Loading states

## Running Visual Tests

### Generate Initial Baselines
```bash
# Generate baseline screenshots for the first time
npm run test:visual:update
```

### Run Visual Regression Tests
```bash
# Run all visual tests
npm run test:visual

# Run in UI mode for interactive debugging
npm run test:visual:ui

# Debug specific test
npm run test:visual:debug
```

### Update Screenshots
```bash
# Update all baseline screenshots (after intentional changes)
npm run test:visual:update

# Update specific test screenshots
npx playwright test --config=playwright-visual.config.js homepage-visual-regression.spec.js --update-snapshots
```

## Configuration

The visual tests use a dedicated configuration file (`playwright-visual.config.js`) with optimized settings:

- **Threshold**: 20% difference tolerance
- **Animations**: Disabled for consistency
- **Multiple Browsers**: Chrome, Firefox
- **Multiple Viewports**: Desktop, Tablet, Mobile, Retina
- **Screenshot Mode**: Strict comparison

## Best Practices

### ✅ Do's
- Run `test:visual:update` after intentional UI changes
- Test across different viewports and browsers
- Disable animations for consistent screenshots
- Use specific selectors for component testing
- Wait for content to fully load before screenshots

### ❌ Don'ts
- Don't commit visual test failures without review
- Don't ignore small visual differences
- Don't run visual tests with unstable network
- Don't take screenshots of dynamic content (timestamps, random data)

## Screenshot Storage

Screenshots are stored in:
```
test/visual/homepage-visual-regression.spec.js-snapshots/
├── visual-chrome-desktop/
├── visual-firefox-desktop/
├── visual-tablet/
├── visual-mobile/
└── visual-retina/
```

## Troubleshooting

### Common Issues

1. **Screenshot Differences**
   ```bash
   # View the comparison report
   npx playwright show-report playwright-report-visual
   ```

2. **Font Rendering Differences**
   - Ensure consistent font loading
   - Add font fallbacks in CSS
   - Use web fonts instead of system fonts

3. **Animation Issues**
   - Verify `animations: 'disabled'` is set
   - Add explicit waits for dynamic content
   - Use `waitForLoadState('networkidle')`

4. **Cross-Browser Differences**
   - Review browser-specific CSS
   - Test on actual browsers, not just Chromium
   - Consider browser-specific baselines

### Updating Tests

When the UI intentionally changes:

1. Review the visual differences in the report
2. Verify changes are intentional
3. Update screenshots: `npm run test:visual:update`
4. Commit the new baseline images
5. Document the changes in PR description

## CI/CD Integration

Visual tests are configured for CI environments:

- **Retries**: 2 retries on failure
- **Workers**: Single worker for consistency
- **Reports**: HTML and JSON output
- **Screenshots**: Only on failure to save space

## Example Usage

```javascript
// Basic screenshot comparison
await expect(page).toHaveScreenshot('homepage-full.png');

// Component-specific screenshot
await expect(page.locator('.navigation-cards')).toHaveScreenshot('nav-cards.png');

// Custom threshold for specific test
await expect(page).toHaveScreenshot('dynamic-content.png', { 
  threshold: 0.3 
});
```

## Performance Tips

- Use `fullPage: false` for faster viewport screenshots
- Limit the number of screenshots per test
- Run visual tests on powerful machines for faster execution
- Consider using `--workers=1` for consistency

## Documentation

For more details on Playwright visual testing:
- [Playwright Screenshots Documentation](https://playwright.dev/docs/screenshots)
- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
