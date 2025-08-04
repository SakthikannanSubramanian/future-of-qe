import { test, expect } from '@playwright/test';

test.describe('Homepage Performance Analysis', () => {
  test('should analyze homepage performance metrics', async ({ page }, testInfo) => {
    console.log('🚀 HOMEPAGE PERFORMANCE ANALYSIS STARTING');
    console.log('=' .repeat(60));
    
    const startTime = performance.now();
    
    // Navigate to homepage with network monitoring
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        timing: response.timing()
      });
    });
    
    console.log('📡 Navigating to homepage...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const navigationTime = performance.now() - startTime;
    console.log(`⏱️ Total Navigation Time: ${navigationTime.toFixed(2)}ms`);
    
    // Get comprehensive performance metrics
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Core timing metrics
        ttfb: nav.responseStart - nav.fetchStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
        loadComplete: nav.loadEventEnd - nav.fetchStart,
        domInteractive: nav.domInteractive - nav.fetchStart,
        
        // Paint metrics
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Network timing breakdown
        dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
        tcpConnect: nav.connectEnd - nav.connectStart,
        serverResponse: nav.responseEnd - nav.responseStart,
        domParsing: nav.domInteractive - nav.responseEnd,
        resourceLoading: nav.loadEventStart - nav.domContentLoadedEventEnd,
        
        // Resource counts
        totalRequests: performance.getEntriesByType('resource').length,
        
        // Page info
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    // Analyze network requests
    const networkAnalysis = {
      total: responses.length,
      successful: responses.filter(r => r.status >= 200 && r.status < 300).length,
      failed: responses.filter(r => r.status >= 400).length,
      redirects: responses.filter(r => r.status >= 300 && r.status < 400).length,
      byType: {}
    };
    
    responses.forEach(response => {
      const type = response.contentType.split(';')[0] || 'unknown';
      if (!networkAnalysis.byType[type]) {
        networkAnalysis.byType[type] = 0;
      }
      networkAnalysis.byType[type]++;
    });
    
    console.log('');
    console.log('📊 PERFORMANCE METRICS ANALYSIS');
    console.log('=' .repeat(60));
    console.log('🔍 CORE WEB VITALS:');
    console.log(`   Time to First Byte (TTFB):     ${metrics.ttfb.toFixed(2)}ms`);
    console.log(`   First Paint (FP):              ${metrics.firstPaint.toFixed(2)}ms`);
    console.log(`   First Contentful Paint (FCP):  ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`   DOM Content Loaded:            ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`   Load Complete:                 ${metrics.loadComplete.toFixed(2)}ms`);
    
    console.log('');
    console.log('⚡ NETWORK TIMING BREAKDOWN:');
    console.log(`   DNS Lookup:                    ${metrics.dnsLookup.toFixed(2)}ms`);
    console.log(`   TCP Connection:                ${metrics.tcpConnect.toFixed(2)}ms`);
    console.log(`   Server Response:               ${metrics.serverResponse.toFixed(2)}ms`);
    console.log(`   DOM Parsing:                   ${metrics.domParsing.toFixed(2)}ms`);
    console.log(`   Resource Loading:              ${metrics.resourceLoading.toFixed(2)}ms`);
    
    console.log('');
    console.log('📡 NETWORK REQUESTS ANALYSIS:');
    console.log(`   Total Requests:                ${networkAnalysis.total}`);
    console.log(`   Successful (2xx):              ${networkAnalysis.successful}`);
    console.log(`   Failed (4xx/5xx):              ${networkAnalysis.failed}`);
    console.log(`   Redirects (3xx):               ${networkAnalysis.redirects}`);
    
    console.log('');
    console.log('📁 REQUESTS BY CONTENT TYPE:');
    Object.entries(networkAnalysis.byType).forEach(([type, count]) => {
      console.log(`   ${type.padEnd(30)}: ${count} requests`);
    });
    
    // Performance scoring (Google's thresholds adapted for dev)
    const score = {
      ttfb: metrics.ttfb < 800 ? 'GOOD' : metrics.ttfb < 1800 ? 'NEEDS IMPROVEMENT' : 'POOR',
      fcp: metrics.firstContentfulPaint < 1800 ? 'GOOD' : metrics.firstContentfulPaint < 3000 ? 'NEEDS IMPROVEMENT' : 'POOR',
      domContentLoaded: metrics.domContentLoaded < 2000 ? 'GOOD' : metrics.domContentLoaded < 4000 ? 'NEEDS IMPROVEMENT' : 'POOR',
      loadComplete: metrics.loadComplete < 3000 ? 'GOOD' : metrics.loadComplete < 6000 ? 'NEEDS IMPROVEMENT' : 'POOR'
    };
    
    console.log('');
    console.log('🎯 PERFORMANCE SCORING:');
    console.log('=' .repeat(60));
    console.log(`   TTFB:                          ${score.ttfb}`);
    console.log(`   First Contentful Paint:       ${score.fcp}`);
    console.log(`   DOM Content Loaded:            ${score.domContentLoaded}`);
    console.log(`   Load Complete:                 ${score.loadComplete}`);
    
    // Overall performance assessment
    const scores = Object.values(score);
    const goodScores = scores.filter(s => s === 'GOOD').length;
    const overallGrade = goodScores >= 3 ? 'EXCELLENT' : goodScores >= 2 ? 'GOOD' : goodScores >= 1 ? 'NEEDS IMPROVEMENT' : 'POOR';
    
    console.log('');
    console.log('🏆 OVERALL PERFORMANCE GRADE:', overallGrade);
    console.log('=' .repeat(60));
    
    // Generate comprehensive performance report
    const performanceReport = {
      timestamp: new Date().toISOString(),
      testDuration: navigationTime,
      url: metrics.url,
      viewport: metrics.viewport,
      coreMetrics: {
        ttfb: { value: metrics.ttfb, score: score.ttfb, threshold: '< 800ms (dev)' },
        firstPaint: { value: metrics.firstPaint, score: 'INFO', threshold: 'N/A' },
        firstContentfulPaint: { value: metrics.firstContentfulPaint, score: score.fcp, threshold: '< 1.8s (dev)' },
        domContentLoaded: { value: metrics.domContentLoaded, score: score.domContentLoaded, threshold: '< 2s (dev)' },
        loadComplete: { value: metrics.loadComplete, score: score.loadComplete, threshold: '< 3s (dev)' }
      },
      networkAnalysis,
      overallGrade,
      recommendations: []
    };
    
    // Add performance recommendations
    if (score.ttfb !== 'GOOD') {
      performanceReport.recommendations.push('Optimize server response time and reduce backend processing');
    }
    if (score.fcp !== 'GOOD') {
      performanceReport.recommendations.push('Optimize critical rendering path and reduce render-blocking resources');
    }
    if (score.domContentLoaded !== 'GOOD') {
      performanceReport.recommendations.push('Minimize DOM complexity and optimize JavaScript execution');
    }
    if (score.loadComplete !== 'GOOD') {
      performanceReport.recommendations.push('Optimize resource loading and implement lazy loading for non-critical assets');
    }
    if (networkAnalysis.failed > 0) {
      performanceReport.recommendations.push(`Fix ${networkAnalysis.failed} failed network requests`);
    }
    
    // Take performance screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('homepage-performance-screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
    
    // Attach detailed performance report
    await testInfo.attach('performance-analysis-report', {
      body: JSON.stringify(performanceReport, null, 2),
      contentType: 'application/json'
    });
    
    if (performanceReport.recommendations.length > 0) {
      console.log('');
      console.log('💡 PERFORMANCE RECOMMENDATIONS:');
      performanceReport.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
    
    console.log('');
    console.log('✅ PERFORMANCE ANALYSIS COMPLETED!');
    console.log('📄 Detailed report attached to test results');
    console.log('=' .repeat(60));
    
    // Relaxed assertions for development environment
    expect(metrics.ttfb).toBeLessThan(5000); // 5s max for dev
    expect(metrics.firstContentfulPaint).toBeLessThan(8000); // 8s max for dev
    expect(metrics.domContentLoaded).toBeLessThan(10000); // 10s max for dev
    expect(networkAnalysis.failed).toBe(0); // No failed requests
  });
});
