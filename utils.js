// Utility functions for Evol Jewels Kiosk
class KioskUtils {
  // Format currency in Indian Rupees
  static formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // Format number with Indian numbering system (lakhs, crores)
  static formatIndianNumber(number) {
    return number.toLocaleString('en-IN');
  }
  
  // Debounce function for performance optimization
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Throttle function for touch events
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  // Generate random ID
  static generateId(prefix = 'kiosk') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Deep clone object (for survey responses)
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => KioskUtils.deepClone(item));
    }
    
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = KioskUtils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }
  
  // Smooth scroll to element (for kiosk navigation)
  static smoothScrollTo(element, duration = 300) {
    if (!element) return;
    
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = KioskUtils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
  }
  
  // Easing function for smooth animations
  static easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  // Check if device supports touch
  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  // Get device orientation
  static getOrientation() {
    if (window.innerHeight > window.innerWidth) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  }
  
  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate phone number (Indian format)
  static isValidIndianPhone(phone) {
    const phoneRegex = /^[+]?[91]?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  }
  
  // Calculate reading time for text
  static calculateReadingTime(text, wordsPerMinute = 200) {
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  }
  
  // Truncate text with ellipsis
  static truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength - 3) + '...';
  }
  
  // Convert price range to filter criteria
  static parsePriceRange(rangeString) {
    if (!rangeString) return null;
    
    if (rangeString.includes('-')) {
      const [min, max] = rangeString.split('-').map(s => parseInt(s));
      return { min, max };
    } else if (rangeString.includes('+')) {
      const min = parseInt(rangeString.replace('+', ''));
      return { min, max: Infinity };
    }
    
    return null;
  }
  
  // Generate product recommendation score
  static calculateRecommendationScore(product, userStyle, userBudget = null) {
    let score = 0;
    
    // Style match scoring
    if (product.style_match && product.style_match.includes(userStyle)) {
      score += 10;
    }
    
    // Budget scoring (closer to budget = higher score)
    if (userBudget) {
      const priceDifference = Math.abs(product.price - userBudget);
      const maxDifference = userBudget; // Normalize by budget
      const priceScore = Math.max(0, 5 - (priceDifference / maxDifference) * 5);
      score += priceScore;
    }
    
    // Collection bonus (featured collections)
    const featuredCollections = ['Floral Collection', 'Butterfly Collection', 'Tribal Collection'];
    if (product.collection && featuredCollections.includes(product.collection)) {
      score += 2;
    }
    
    return score;
  }
  
  // Log interaction for analytics (if enabled)
  static logInteraction(eventType, data = {}) {
    if (window.KIOSK_CONFIG && window.KIOSK_CONFIG.analytics.enabled) {
      const event = {
        timestamp: Date.now(),
        type: eventType,
        data: data,
        sessionId: KioskUtils.getSessionId()
      };
      
      // In a real implementation, this would send to analytics service
      console.log('Kiosk Interaction:', event);
    }
  }
  
  // Get or create session ID
  static getSessionId() {
    let sessionId = KioskUtils._sessionId;
    if (!sessionId) {
      sessionId = KioskUtils.generateId('session');
      KioskUtils._sessionId = sessionId;
    }
    return sessionId;
  }
  
  // Reset session (for new user)
  static resetSession() {
    KioskUtils._sessionId = null;
  }
  
  // Handle touch feedback
  static provideTouchFeedback(element) {
    if (!element) return;
    
    // Add visual feedback class
    element.classList.add('touch-feedback');
    
    // Remove feedback after animation
    setTimeout(() => {
      element.classList.remove('touch-feedback');
    }, 150);
    
    // Haptic feedback (if supported and enabled)
    if (window.KIOSK_CONFIG && window.KIOSK_CONFIG.ui.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
  
  // Check if kiosk is in demo mode
  static isDemoMode() {
    return window.KIOSK_CONFIG && window.KIOSK_CONFIG.development.enableTestMode;
  }
  
  // SearchAPI utility methods
  static buildSearchApiUrl(apiKey, query, options = {}) {
    const baseUrl = 'https://www.searchapi.io/api/v1/search';
    const params = new URLSearchParams({
      api_key: apiKey,
      engine: 'bing_images',
      q: query,
      ...options
    });
    return `${baseUrl}?${params.toString()}`;
  }
  
  // Filter search results for quality and relevance
  static filterSearchResults(results, keywords = []) {
    if (!Array.isArray(results)) return [];
    
    return results.filter(item => {
      // Must have thumbnail for faster loading
      if (!item.thumbnail) return false;
      
      // Check for relevant keywords in title or source
      const text = (item.title + ' ' + item.source).toLowerCase();
      const hasRelevantKeywords = keywords.length === 0 || 
        keywords.some(keyword => text.includes(keyword.toLowerCase()));
      
      return hasRelevantKeywords;
    }).sort((a, b) => {
      // Prioritize by image dimensions (larger is better)
      const aSize = (a.original?.width || 0) * (a.original?.height || 0);
      const bSize = (b.original?.width || 0) * (b.original?.height || 0);
      return bSize - aSize;
    });
  }
  
  // Validate image URL accessibility
  static async validateImageUrl(url, timeout = 3000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  // Create image loading promise with timeout
  static loadImageWithTimeout(src, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.src = ''; // Stop loading
        reject(new Error('Image load timeout'));
      }, timeout);
      
      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Image load failed'));
      };
      
      img.src = src;
    });
  }
  
  // Generate celebrity search query variants
  static generateSearchQueries(celebrityName, style = 'jewelry') {
    const baseQueries = [
      `${celebrityName} ${style} red carpet`,
      `${celebrityName} ${style} fashion week`,
      `${celebrityName} ${style} awards show`,
      `${celebrityName} elegant ${style}`,
      `${celebrityName} ${style} style`
    ];
    
    return baseQueries;
  }
  
  // Get mock data for demo mode
  static getMockSurveyResponse() {
    if (!KioskUtils.isDemoMode()) return null;
    
    return {
      responses: [0, 1, 2, 665000, 1], // Sample responses
      style: 'modern',
      celebrity: 'Zendaya'
    };
  }
}

// Add CSS class for touch feedback if not already defined
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .touch-feedback {
      transform: scale(0.95) !important;
      transition: transform 150ms ease-out !important;
    }
  `;
  document.head.appendChild(style);
}

// Export utility class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KioskUtils;
} else {
  window.KioskUtils = KioskUtils;
}