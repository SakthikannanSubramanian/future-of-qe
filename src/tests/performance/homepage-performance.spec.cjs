const { test, expect } = require('@playwright/test');

test.describe('Homepage Performance Testing', () => {
  test('should measure homepage loading performance', async ({ page }, testInfo) => {
    console.log('🚀 Starting Performance Test for Homepage');
    
    // Start measuring navigation timing
    const startTime = Date.now();
    
    // Navigate to homepage with performance monitoring
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const navigationEndTime = Date.now();
    const navigationTime = navigationEndTime - startTime;
    
    console.log(`⏱️ Navigation Time: ${navigationTime}ms`);
    
    // Get performance metrics using Performance API
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Navigation Timing API metrics
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstByte: navigation.responseStart - navigation.fetchStart,
        
        // Paint Timing API metrics
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Additional metrics
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.responseEnd,
      };
    });
    
    console.log('📊 Performance Metrics:');
    console.log(`   🔍 Time to First Byte: ${performanceMetrics.firstByte.toFixed(2)}ms`);
    console.log(`   🎨 First Paint: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
    console.log(`   🖼️ First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`   📄 DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`   ✅ Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    
    // Take screenshot for performance report
    const performanceScreenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('homepage-performance-screenshot', {
      body: performanceScreenshot,
      contentType: 'image/png'
    });
    
    // Create detailed performance report
    const performanceReport = {
      testTimestamp: new Date().toISOString(),
      url: page.url(),
      viewport: await page.viewportSize(),
      navigationTime: navigationTime,
      metrics: performanceMetrics,
      thresholds: {
        firstByte: { value: performanceMetrics.firstByte, threshold: 1000, passed: performanceMetrics.firstByte < 1000 },
        firstPaint: { value: performanceMetrics.firstPaint, threshold: 2000, passed: performanceMetrics.firstPaint < 2000 },
        firstContentfulPaint: { value: performanceMetrics.firstContentfulPaint, threshold: 2500, passed: performanceMetrics.firstContentfulPaint < 2500 },
        domContentLoaded: { value: performanceMetrics.domContentLoaded, threshold: 3000, passed: performanceMetrics.domContentLoaded < 3000 },
        loadComplete: { value: performanceMetrics.loadComplete, threshold: 5000, passed: performanceMetrics.loadComplete < 5000 },
      }
    };
    
    // Attach performance report as JSON
    await testInfo.attach('performance-metrics-report', {
      body: JSON.stringify(performanceReport, null, 2),
      contentType: 'application/json'
    });
    
    console.log('🎯 Performance Thresholds Check:');
    console.log(`   TTFB < 1000ms: ${performanceReport.thresholds.firstByte.passed ? '✅ PASS' : '❌ FAIL'} (${performanceMetrics.firstByte.toFixed(2)}ms)`);
    console.log(`   FP < 2000ms: ${performanceReport.thresholds.firstPaint.passed ? '✅ PASS' : '❌ FAIL'} (${performanceMetrics.firstPaint.toFixed(2)}ms)`);
    console.log(`   FCP < 2500ms: ${performanceReport.thresholds.firstContentfulPaint.passed ? '✅ PASS' : '❌ FAIL'} (${performanceMetrics.firstContentfulPaint.toFixed(2)}ms)`);
    console.log(`   DCL < 3000ms: ${performanceReport.thresholds.domContentLoaded.passed ? '✅ PASS' : '❌ FAIL'} (${performanceMetrics.domContentLoaded.toFixed(2)}ms)`);
    console.log(`   Load < 5000ms: ${performanceReport.thresholds.loadComplete.passed ? '✅ PASS' : '❌ FAIL'} (${performanceMetrics.loadComplete.toFixed(2)}ms)`);
    
    // Performance assertions
    expect(performanceMetrics.firstByte).toBeLessThan(3000); // Time to First Byte should be under 3s (relaxed for dev)
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(5000); // FCP should be under 5s (relaxed for dev)
    expect(performanceMetrics.domContentLoaded).toBeLessThan(8000); // DOM ready should be under 8s (relaxed for dev)
    expect(performanceMetrics.loadComplete).toBeLessThan(10000); // Full load should be under 10s (relaxed for dev)
    
    console.log('✅ Performance test completed successfully!');
  });

  test('should measure resource loading performance', async ({ page }, testInfo) => {
    console.log('📦 Starting Resource Loading Performance Test');
    
    // Monitor network requests
    const resources = [];
    page.on('response', response => {
      resources.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || 'unknown',
        size: parseInt(response.headers()['content-length']) || 0,
      });
    });
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Analyze resource loading
    const resourceAnalysis = {
      totalRequests: resources.length,
      successfulRequests: resources.filter(r => r.status >= 200 && r.status < 300).length,
      failedRequests: resources.filter(r => r.status >= 400).length,
      redirects: resources.filter(r => r.status >= 300 && r.status < 400).length,
      totalSize: resources.reduce((sum, r) => sum + r.size, 0),
      byType: {},
    };
    
    // Group by content type
    resources.forEach(resource => {
      const type = resource.contentType?.split(';')[0] || 'unknown';
      if (!resourceAnalysis.byType[type]) {
        resourceAnalysis.byType[type] = { count: 0, size: 0 };
      }
      resourceAnalysis.byType[type].count++;
      resourceAnalysis.byType[type].size += resource.size;
    });
    
    console.log('📊 Resource Loading Analysis:');
    console.log(`   📄 Total Requests: ${resourceAnalysis.totalRequests}`);
    console.log(`   ✅ Successful: ${resourceAnalysis.successfulRequests}`);
    console.log(`   ❌ Failed: ${resourceAnalysis.failedRequests}`);
    console.log(`   📦 Total Size: ${(resourceAnalysis.totalSize / 1024).toFixed(2)} KB`);
    
    console.log('   📋 By Content Type:');
    Object.entries(resourceAnalysis.byType).forEach(([type, data]) => {
      console.log(`      ${type}: ${data.count} requests, ${(data.size / 1024).toFixed(2)} KB`);
    });
    
    // Attach resource analysis report
    await testInfo.attach('resource-loading-analysis', {
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        analysis: resourceAnalysis,
        resources: resources.map(r => ({
          url: r.url,
          status: r.status,
          contentType: r.contentType,
          size: r.size
        }))
      }, null, 2),
      contentType: 'application/json'
    });
    
    // Performance assertions for resource loading
    expect(resourceAnalysis.failedRequests).toBe(0); // No failed requests
    expect(resourceAnalysis.totalSize).toBeLessThan(10 * 1024 * 1024); // Total size under 10MB (dev build)
    
    console.log('✅ Resource loading performance test completed!');
  });

  test('should measure Core Web Vitals simulation', async ({ page }, testInfo) => {
    console.log('🎯 Starting Core Web Vitals Simulation Test');
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Simulate Core Web Vitals measurement
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          LCP: 0, // Largest Contentful Paint
          FID: 0, // First Input Delay (simulated)
          CLS: 0, // Cumulative Layout Shift
        };
        
        // Simulate LCP measurement
        const images = document.querySelectorAll('img');
        const headings = document.querySelectorAll('h1, h2, h3');
        const largestElement = [...images, ...headings].reduce((largest, current) => {
          const currentSize = current.offsetWidth * current.offsetHeight;
          const largestSize = largest ? largest.offsetWidth * largest.offsetHeight : 0;
          return currentSize > largestSize ? current : largest;
        });
        
        if (largestElement) {
          vitals.LCP = performance.now(); // Approximate LCP
        }
        
        // Simulate FID (since we can't measure real user interaction)
        vitals.FID = Math.random() * 100; // Simulated value
        
        // Basic CLS simulation (would need more complex measurement in real scenario)
        vitals.CLS = 0.1; // Simulated value
        
        setTimeout(() => resolve(vitals), 1000);
      });
    });
    
    console.log('🎯 Core Web Vitals Simulation:');
    console.log(`   🖼️ Largest Contentful Paint: ${webVitals.LCP.toFixed(2)}ms`);
    console.log(`   👆 First Input Delay: ${webVitals.FID.toFixed(2)}ms (simulated)`);
    console.log(`   📐 Cumulative Layout Shift: ${webVitals.CLS.toFixed(3)} (simulated)`);
    
    // Web Vitals thresholds (Google's recommendations)
    const webVitalsReport = {
      timestamp: new Date().toISOString(),
      metrics: webVitals,
      thresholds: {
        LCP: { value: webVitals.LCP, threshold: 2500, passed: webVitals.LCP < 2500 },
        FID: { value: webVitals.FID, threshold: 100, passed: webVitals.FID < 100 },
        CLS: { value: webVitals.CLS, threshold: 0.1, passed: webVitals.CLS < 0.1 },
      },
      recommendations: []
    };
    
    // Add recommendations based on results
    if (!webVitalsReport.thresholds.LCP.passed) {
      webVitalsReport.recommendations.push('Optimize images and remove unused code to improve LCP');
    }
    if (!webVitalsReport.thresholds.FID.passed) {
      webVitalsReport.recommendations.push('Minimize JavaScript execution time to improve FID');
    }
    if (!webVitalsReport.thresholds.CLS.passed) {
      webVitalsReport.recommendations.push('Add size attributes to images and avoid dynamic content injection to improve CLS');
    }
    
    console.log('🎯 Web Vitals Assessment:');
    console.log(`   LCP ${webVitalsReport.thresholds.LCP.passed ? '✅ GOOD' : '⚠️ NEEDS IMPROVEMENT'} (target: <2.5s)`);
    console.log(`   FID ${webVitalsReport.thresholds.FID.passed ? '✅ GOOD' : '⚠️ NEEDS IMPROVEMENT'} (target: <100ms)`);
    console.log(`   CLS ${webVitalsReport.thresholds.CLS.passed ? '✅ GOOD' : '⚠️ NEEDS IMPROVEMENT'} (target: <0.1)`);
    
    // Attach Web Vitals report
    await testInfo.attach('core-web-vitals-report', {
      body: JSON.stringify(webVitalsReport, null, 2),
      contentType: 'application/json'
    });
    
    console.log('✅ Core Web Vitals simulation completed!');
  });
});
