// Configuration file for Evol Jewels Kiosk
const KIOSK_CONFIG = {
  // SearchAPI Configuration
  searchApi: {
    apiKey: 'ZgJMBGcnrRfdn4eieFb7cMFm',
    baseUrl: 'https://www.searchapi.io/api/v1/search',
    engine: 'bing_images',
    timeout: 5000,
    cacheDuration: 3600000, // 1 hour in milliseconds
    maxRetries: 2,
    fallbackEnabled: true
  },
  // Display settings
  display: {
    orientation: 'portrait',
    width: 1080,
    height: 1920,
    touchEnabled: true,
    fullscreen: true
  },
  
  // Timing settings
  timing: {
    inactivityTimeout: 30000,      // 30 seconds
    timeoutWarningDuration: 10000, // 10 seconds
    analysisDelay: 3000,           // 3 seconds
    transitionDuration: 500        // 0.5 seconds
  },
  
  // UI settings
  ui: {
    minimumTouchTargetSize: 80,    // 80px minimum
    baseFontSize: 24,              // 24px base font
    animationsEnabled: true,
    soundEnabled: false,
    hapticFeedback: false
  },
  
  // Survey configuration
  survey: {
    totalQuestions: 5,
    progressIndicator: true,
    allowBack: true,
    requireAllAnswers: true
  },
  
  // Product display settings
  products: {
    gridColumns: 'auto-fit',
    minCardWidth: 350,
    maxProductsPerPage: 8,
    showPricesInINR: true,
    highlightStyleMatches: true
  },
  
  // AI/Matching settings
  matching: {
    styleWeightThreshold: 1,
    randomizeCelebritySelection: true,
    considerBudgetInRecommendations: false,
    maxRecommendations: 8
  },
  
  // Analytics and tracking (disabled for kiosk privacy)
  analytics: {
    enabled: false,
    trackUserJourney: false,
    logInteractions: false
  },
  
  // Accessibility settings
  accessibility: {
    highContrast: true,
    largeText: true,
    voiceGuidance: false,
    screenReader: false
  },
  
  // Development settings
  development: {
    debugMode: false,
    showConsoleErrors: false,
    enableTestMode: false
  }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KIOSK_CONFIG;
} else {
  window.KIOSK_CONFIG = KIOSK_CONFIG;
}