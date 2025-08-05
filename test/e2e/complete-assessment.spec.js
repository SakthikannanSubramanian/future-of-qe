import { test, expect } from '@playwright/test';

test.describe('Complete Questionnaire Flow', () => {
  test('should complete full assessment questionnaire from home to success', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(60000);
    
    console.log('🚀 Starting Complete Assessment Flow');
    
    // Step 1: Navigate to home page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Home page loaded');
    
    // Step 2: Click on Question Screen card
    const questionCard = page.locator('text=❓Question Screen').first();
    await expect(questionCard).toBeVisible();
    await questionCard.click();
    console.log('🎯 Clicked Question Screen card');
    
    // Step 3: Wait for navigation to questions page
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/questions.*/);
    await expect(page.locator('h1:has-text("Assessment Questions")')).toBeVisible();
    console.log('📝 Successfully navigated to Assessment Questions page');
    
    // Step 4: Complete all categories/parameters
    let totalQuestionsAnswered = 0;
    let categoryCount = 0;
    const maxCategories = 25; // Increase safety limit
    
    while (categoryCount < maxCategories) {
      categoryCount++;
      console.log(`\n🔄 Processing category ${categoryCount}`);
      
      // Check if we've reached the assessment success page
      const currentUrl = page.url();
      if (currentUrl.includes('assessment-success') || currentUrl.includes('success')) {
        console.log('🎉 Successfully reached assessment success page!');
        break;
      }
      
      // Wait for questions to load
      await page.waitForSelector('[class*="questionCard"]', { timeout: 10000 });
      
      // Get all question cards in current category
      const questionCards = page.locator('[class*="questionCard"]');
      const questionCount = await questionCards.count();
      
      if (questionCount === 0) {
        console.log('❌ No question cards found in this category');
        break;
      }
      
      console.log(`📋 Found ${questionCount} questions in category ${categoryCount}`);
      
      // Answer each question in the current category
      for (let i = 0; i < questionCount; i++) {
        try {
          const questionCard = questionCards.nth(i);
          
          // Find radio buttons within this specific question card
          const radioButtons = questionCard.locator('input[type="radio"]');
          const radioCount = await radioButtons.count();
          
          if (radioCount > 0) {
            // Select a random radio button from this question
            const randomIndex = Math.floor(Math.random() * radioCount);
            const selectedRadio = radioButtons.nth(randomIndex);
            
            await selectedRadio.check();
            
            // Verify the selection was made
            const isChecked = await selectedRadio.isChecked();
            if (isChecked) {
              totalQuestionsAnswered++;
              console.log(`   ✅ Q${i + 1}: Selected option ${randomIndex + 1}/${radioCount}`);
            } else {
              console.log(`   ⚠️ Q${i + 1}: Failed to select option`);
            }
            
            // Small delay to ensure UI updates
            await page.waitForTimeout(100);
          } else {
            console.log(`   ⚠️ Q${i + 1}: No radio buttons found`);
          }
        } catch (error) {
          console.log(`   ❌ Q${i + 1}: Error - ${error.message}`);
        }
      }
      
      console.log(`📊 Completed ${questionCount} questions in category ${categoryCount}`);
      
      // Look for navigation buttons
      const nextButton = page.locator('button:has-text("Next")').first();
      const submitButton = page.locator('button:has-text("Submit Assessment")').first();
      
      // Check which button is available and click it
      if (await submitButton.isVisible()) {
        console.log('🚀 Found "Submit Assessment" button - submitting final assessment...');
        await submitButton.click();
        await page.waitForLoadState('networkidle');
        // Give time for redirect to complete
        await page.waitForTimeout(2000);
        break;
      } else if (await nextButton.isVisible()) {
        console.log('➡️ Found "Next" button - proceeding to next category...');
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        // Wait for new category to load
        await page.waitForTimeout(500);
      } else {
        console.log('❌ No navigation buttons found');
        // Try to find any button that might proceed
        const anyButton = page.locator('button').filter({ hasText: /next|continue|proceed|submit/i }).first();
        if (await anyButton.isVisible()) {
          const buttonText = await anyButton.textContent();
          console.log(`🔄 Found fallback button: "${buttonText}" - clicking...`);
          await anyButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(500);
        } else {
          console.log('❌ No navigation buttons found at all - ending flow');
          break;
        }
      }
    }
    
    // Step 5: Validate Assessment Submission
    const finalUrl = page.url();
    console.log(`\n📍 Final URL: ${finalUrl}`);
    
    // Check for success page indicators
    const isOnSuccessPage = finalUrl.includes('assessment-success') || 
                           finalUrl.includes('success') ||
                           await page.locator('text=/success|complete|submitted|thank you/i').count() > 0;
    
    if (isOnSuccessPage) {
      console.log('🎉 SUCCESS: Assessment completed and reached success page!');
      
      // Comprehensive Assessment Submission Validation
      console.log('\n🔍 VALIDATING ASSESSMENT SUBMISSION:');
      
      // Wait for assessment processing to complete (in case it's still loading)
      const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
      if (await loadingSpinner.isVisible()) {
        console.log('⏳ Assessment is being processed, waiting for completion...');
        await page.waitForSelector('[data-testid="assessment-success-container"]', { timeout: 30000 });
        console.log('✅ Assessment processing completed');
      }
      
      // Validate main success container
      const successContainer = page.locator('[data-testid="assessment-success-container"]');
      await expect(successContainer).toBeVisible();
      console.log('✅ Assessment success container found');
      
      // Validate assessment results title
      const resultsTitle = page.locator('[data-testid="assessment-results-title"]');
      if (await resultsTitle.isVisible()) {
        const titleText = await resultsTitle.textContent();
        console.log(`✅ Assessment results title: "${titleText}"`);
        expect(titleText).toMatch(/assessment.*results/i);
      }
      
      // Validate overall score
      const overallScore = page.locator('[data-testid="overall-score-value"]');
      if (await overallScore.isVisible()) {
        const scoreText = await overallScore.textContent();
        console.log(`✅ Overall score: ${scoreText}`);
        expect(scoreText).toMatch(/\d+%/); // Should be a percentage
      }
      
      // Validate overall level
      const overallLevel = page.locator('[data-testid="overall-level"]');
      if (await overallLevel.isVisible()) {
        const levelText = await overallLevel.textContent();
        console.log(`✅ Overall level: "${levelText}"`);
        expect(levelText).toMatch(/overall level/i);
      }
      
      // Validate feedback message
      const overallFeedback = page.locator('[data-testid="overall-feedback"]');
      if (await overallFeedback.isVisible()) {
        const feedbackText = await overallFeedback.textContent();
        console.log(`✅ Feedback message: "${feedbackText.substring(0, 100)}..."`);
        expect(feedbackText).toBeTruthy();
      }
      
      // Validate category breakdown section
      const categoryBreakdown = page.locator('[data-testid="category-breakdown-title"]');
      if (await categoryBreakdown.isVisible()) {
        const breakdownText = await categoryBreakdown.textContent();
        console.log(`✅ Category breakdown section: "${breakdownText}"`);
        expect(breakdownText).toMatch(/category.*breakdown/i);
      }
      
      // Check for score progress indicator
      const scoreProgress = page.locator('[data-testid="overall-score-progress"]');
      if (await scoreProgress.isVisible()) {
        console.log('✅ Score progress indicator found');
      }
      
      // Validate that assessment data was successfully processed
      const scoreSections = await page.locator('[data-testid*="score"], [data-testid*="level"]').count();
      console.log(`✅ Found ${scoreSections} assessment data elements`);
      expect(scoreSections).toBeGreaterThan(2); // Should have multiple score/level elements
      
      // Validate that we're not on an error page
      const errorIndicators = await page.locator('text=/error|failed|problem|issue/i').count();
      expect(errorIndicators).toBe(0);
      console.log(`✅ No error indicators found`);
      
      // Take screenshot of success page for visual validation
      await page.screenshot({ 
        path: 'test-results/assessment-success-validation.png',
        fullPage: true 
      });
      console.log('📸 Success page screenshot saved');
      
      // Validate URL structure
      expect(finalUrl).toMatch(/success|complete|submitted/i);
      console.log('✅ Success URL validation passed');
      
      // Check if there are any navigation options on success page
      const nextSteps = page.locator('button, a').filter({ hasText: /dashboard|home|continue|next|view results/i });
      const nextStepsCount = await nextSteps.count();
      if (nextStepsCount > 0) {
        console.log(`✅ Found ${nextStepsCount} next step options on success page`);
        
        // Log available next steps
        for (let i = 0; i < Math.min(nextStepsCount, 3); i++) {
          const stepText = await nextSteps.nth(i).textContent();
          console.log(`   📋 Next step option: "${stepText}"`);
        }
      }
      
    } else {
      console.log('❌ Assessment flow did not reach success page');
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: 'test-results/assessment-incomplete.png',
        fullPage: true 
      });
      
      // Check what page we ended up on
      const pageContent = await page.locator('h1, h2, h3').first().textContent();
      console.log(`❌ Ended up on page with heading: "${pageContent}"`);
    }
    
    // Final summary
    console.log('\n🎯 E2E ASSESSMENT FLOW SUMMARY:');
    console.log(`   📂 Categories processed: ${categoryCount}`);
    console.log(`   📝 Total questions answered: ${totalQuestionsAnswered}`);
    console.log(`   📍 Final URL: ${finalUrl}`);
    console.log(`   ✅ Success page reached: ${isOnSuccessPage ? 'YES' : 'NO'}`);
    console.log(`   🔄 Assessment submission validated: ${isOnSuccessPage ? 'YES' : 'NO'}`);
    
    // Test assertions for assessment submission validation
    expect(totalQuestionsAnswered).toBeGreaterThan(0);
    expect(categoryCount).toBeGreaterThan(0);
    expect(isOnSuccessPage).toBe(true); // Ensure we reached success page
    expect(finalUrl).toMatch(/success|complete|submitted/i); // Validate success URL
    
    console.log('🏁 Complete Assessment Flow Test with Submission Validation FINISHED!');
  });
});
