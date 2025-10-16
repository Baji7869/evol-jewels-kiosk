// Reusable components for Evol Jewels Kiosk
class KioskComponents {
  
  // Create a loading spinner component
  static createLoadingSpinner(size = 'medium', color = 'gold') {
    const spinner = document.createElement('div');
    spinner.className = `loading-spinner loading-spinner--${size} loading-spinner--${color}`;
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'loading-dot';
      spinner.appendChild(dot);
    }
    
    return spinner;
  }
  
  // Create a progress bar component
  static createProgressBar(progress = 0, showText = true) {
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    const bar = document.createElement('div');
    bar.className = 'progress-bar-bg';
    
    const fill = document.createElement('div');
    fill.className = 'progress-bar-fill';
    fill.style.width = `${progress}%`;
    
    bar.appendChild(fill);
    container.appendChild(bar);
    
    if (showText) {
      const text = document.createElement('div');
      text.className = 'progress-text';
      text.textContent = `${Math.round(progress)}% Complete`;
      container.appendChild(text);
    }
    
    return container;
  }
  
  // Create a modal component
  static createModal(title, content, actions = []) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    header.appendChild(titleElement);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = () => KioskComponents.closeModal(overlay);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else {
      body.appendChild(content);
    }
    
    modal.appendChild(header);
    modal.appendChild(body);
    
    if (actions.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `btn ${action.class || 'btn--secondary'}`;
        btn.textContent = action.text;
        btn.onclick = action.handler;
        footer.appendChild(btn);
      });
      
      modal.appendChild(footer);
    }
    
    overlay.appendChild(modal);
    
    return overlay;
  }
  
  // Close modal
  static closeModal(modalOverlay) {
    modalOverlay.style.opacity = '0';
    setTimeout(() => {
      if (modalOverlay.parentNode) {
        modalOverlay.parentNode.removeChild(modalOverlay);
      }
    }, 300);
  }
  
  // Create a toast notification
  static createToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    
    switch (type) {
      case 'success':
        icon.textContent = '✓';
        break;
      case 'error':
        icon.textContent = '✗';
        break;
      case 'warning':
        icon.textContent = '⚠';
        break;
      default:
        icon.textContent = 'ⓘ';
    }
    
    const text = document.createElement('span');
    text.className = 'toast-text';
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    
    // Add to page
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateY(-100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    return toast;
  }
  
  // Create a card component
  static createCard(options = {}) {
    const {
      title = '',
      content = '',
      image = null,
      actions = [],
      className = ''
    } = options;
    
    const card = document.createElement('div');
    card.className = `card ${className}`;
    
    if (image) {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'card-image';
      
      if (typeof image === 'string') {
        const img = document.createElement('img');
        img.src = image;
        img.alt = title;
        imageContainer.appendChild(img);
      } else {
        imageContainer.appendChild(image);
      }
      
      card.appendChild(imageContainer);
    }
    
    const body = document.createElement('div');
    body.className = 'card-body';
    
    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.className = 'card-title';
      titleElement.textContent = title;
      body.appendChild(titleElement);
    }
    
    if (content) {
      const contentElement = document.createElement('div');
      contentElement.className = 'card-content';
      
      if (typeof content === 'string') {
        contentElement.innerHTML = content;
      } else {
        contentElement.appendChild(content);
      }
      
      body.appendChild(contentElement);
    }
    
    card.appendChild(body);
    
    if (actions.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'card-footer';
      
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `btn ${action.class || 'btn--secondary'}`;
        btn.textContent = action.text;
        btn.onclick = action.handler;
        footer.appendChild(btn);
      });
      
      card.appendChild(footer);
    }
    
    return card;
  }
  
  // Create a badge component
  static createBadge(text, type = 'default') {
    const badge = document.createElement('span');
    badge.className = `badge badge--${type}`;
    badge.textContent = text;
    return badge;
  }
  
  // Create a rating display component
  static createRating(rating, maxRating = 5) {
    const container = document.createElement('div');
    container.className = 'rating';
    
    for (let i = 1; i <= maxRating; i++) {
      const star = document.createElement('span');
      star.className = 'rating-star';
      star.textContent = i <= rating ? '★' : '☆';
      container.appendChild(star);
    }
    
    return container;
  }
  
  // Create a price display component
  static createPriceDisplay(price, originalPrice = null, currency = '₹') {
    const container = document.createElement('div');
    container.className = 'price-display';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = `${currency}${KioskUtils.formatIndianNumber(price)}`;
    container.appendChild(currentPrice);
    
    if (originalPrice && originalPrice > price) {
      const original = document.createElement('span');
      original.className = 'original-price';
      original.textContent = `${currency}${KioskUtils.formatIndianNumber(originalPrice)}`;
      container.appendChild(original);
      
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      const discountBadge = document.createElement('span');
      discountBadge.className = 'discount-badge';
      discountBadge.textContent = `${discount}% OFF`;
      container.appendChild(discountBadge);
    }
    
    return container;
  }
  
  // Create a countdown timer component
  static createCountdownTimer(seconds, onComplete = null) {
    const container = document.createElement('div');
    container.className = 'countdown-timer';
    
    const display = document.createElement('div');
    display.className = 'countdown-display';
    display.textContent = seconds;
    container.appendChild(display);
    
    let remaining = seconds;
    const interval = setInterval(() => {
      remaining--;
      display.textContent = remaining;
      
      if (remaining <= 0) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);
    
    return container;
  }
  
  // Create an image placeholder with icon
  static createImagePlaceholder(icon = '🖼️', text = 'Image') {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    
    const iconElement = document.createElement('div');
    iconElement.className = 'placeholder-icon';
    iconElement.textContent = icon;
    
    const textElement = document.createElement('div');
    textElement.className = 'placeholder-text';
    textElement.textContent = text;
    
    placeholder.appendChild(iconElement);
    placeholder.appendChild(textElement);
    
    return placeholder;
  }
  
  // Create a search input component
  static createSearchInput(placeholder = 'Search...', onSearch = null) {
    const container = document.createElement('div');
    container.className = 'search-input-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control search-input';
    input.placeholder = placeholder;
    
    const searchBtn = document.createElement('button');
    searchBtn.className = 'search-btn';
    searchBtn.textContent = '🔍';
    
    if (onSearch) {
      const handleSearch = () => onSearch(input.value.trim());
      searchBtn.addEventListener('click', handleSearch);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      });
    }
    
    container.appendChild(input);
    container.appendChild(searchBtn);
    
    return container;
  }
}

// Add component styles to the page
if (typeof document !== 'undefined') {
  const componentStyles = `
    .loading-spinner {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }
    
    .loading-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--kiosk-gold, #d4af37);
      animation: loading-pulse 1.4s ease-in-out infinite;
    }
    
    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes loading-pulse {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    
    .modal {
      background: var(--kiosk-bg-secondary, #1a1a1a);
      border-radius: 12px;
      border: 2px solid var(--kiosk-gold, #d4af37);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      transform: scale(1);
      transition: transform 0.3s ease;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid var(--kiosk-text-dim, #cccccc);
    }
    
    .modal-close {
      background: none;
      border: none;
      color: var(--kiosk-text-light, #ffffff);
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .modal-footer {
      padding: 24px;
      border-top: 1px solid var(--kiosk-text-dim, #cccccc);
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
    
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1100;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      background: var(--kiosk-bg-secondary, #1a1a1a);
      border: 2px solid;
      color: var(--kiosk-text-light, #ffffff);
      transform: translateY(0);
      opacity: 1;
      transition: all 0.3s ease;
      min-width: 300px;
    }
    
    .toast--success { border-color: var(--color-success, #10b981); }
    .toast--error { border-color: var(--color-error, #ef4444); }
    .toast--warning { border-color: var(--color-warning, #f59e0b); }
    .toast--info { border-color: var(--kiosk-gold, #d4af37); }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .badge--default {
      background: var(--kiosk-bg-secondary, #1a1a1a);
      color: var(--kiosk-text-light, #ffffff);
    }
    
    .badge--gold {
      background: var(--kiosk-gold, #d4af37);
      color: var(--kiosk-bg-primary, #0a0a0a);
    }
    
    .rating {
      display: flex;
      gap: 4px;
    }
    
    .rating-star {
      color: var(--kiosk-gold, #d4af37);
      font-size: 20px;
    }
    
    .price-display {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .current-price {
      font-weight: 600;
      color: var(--kiosk-gold, #d4af37);
    }
    
    .original-price {
      text-decoration: line-through;
      color: var(--kiosk-text-dim, #cccccc);
      font-size: 0.9em;
    }
    
    .discount-badge {
      background: var(--color-success, #10b981);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: 600;
    }
    
    .countdown-timer {
      text-align: center;
    }
    
    .countdown-display {
      font-size: 48px;
      font-weight: bold;
      color: var(--kiosk-gold, #d4af37);
    }
    
    .search-input-container {
      display: flex;
      position: relative;
    }
    
    .search-input {
      flex: 1;
      padding-right: 60px;
    }
    
    .search-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = componentStyles;
  document.head.appendChild(styleElement);
}

// Export components class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KioskComponents;
} else {
  window.KioskComponents = KioskComponents;
}