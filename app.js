// Enhanced Evol Jewels Kiosk Application with API Integration
class EvolJewelsKiosk {
  constructor() {
    this.currentScreen = 'welcome';
    this.currentQuestion = 0;
    this.surveyResponses = [];
    this.matchedStyle = null;
    this.matchedCelebrity = null;
    this.filteredProducts = [];
    this.inactivityTimer = null;
    this.timeoutTimer = null;
    this.currentTab = 'survey';
    this.newsArticles = [];
    this.trendingCelebrities = [];
    this.apiStatus = {
      newsApi: 'loading',
      tmdbApi: 'loading'
    };
    
    // Device detection
    this.deviceType = this.detectDeviceType();
    this.isTouchDevice = this.detectTouchSupport();
    
    // API Configuration
    this.API_KEYS = {
      news: '106f7392fa6445679459374eee3dd8b7',
      tmdb: 'ed3175502dee2996394ab4594ca2b3a3'
    };
    
    // Initialize data
    this.initializeData();
    
    // Celebrity image system with SearchAPI integration
    this.celebrityImageCache = new Map();
    this.imageLoadAttempts = new Map();
    this.maxRetryAttempts = 3;
    this.searchApiCache = new Map();
    this.apiRequestQueue = new Map();
    
    // SearchAPI Configuration
    this.searchApiConfig = {
      apiKey: 'ZgJMBGcnrRfdn4eieFb7cMFm',
      baseUrl: 'https://www.searchapi.io/api/v1/search',
      engine: 'bing_images',
      timeout: 5000
    };
    
    // Bind methods
    this.switchTab = this.switchTab.bind(this);
    this.loadNews = this.loadNews.bind(this);
    this.loadTrendingCelebrities = this.loadTrendingCelebrities.bind(this);
    this.updateNewsTicker = this.updateNewsTicker.bind(this);
    this.openInteractiveFeature = this.openInteractiveFeature.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getCelebrityDetails = this.getCelebrityDetails.bind(this);
    this.showScreen = this.showScreen.bind(this);
    this.startSurvey = this.startSurvey.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.updateBudgetDisplay = this.updateBudgetDisplay.bind(this);
    this.analyzeStyle = this.analyzeStyle.bind(this);
    this.showProducts = this.showProducts.bind(this);
    this.filterProducts = this.filterProducts.bind(this);
    this.resetApp = this.resetApp.bind(this);
    this.handleUserActivity = this.handleUserActivity.bind(this);
    
    // Initialize app
    this.init();
  }

  async initializeData() {
    // Initialize guaranteed celebrity image system with SearchAPI
    this.initializeCelebrityImageSystem();
    
    // Celebrity search queries for SearchAPI
    this.celebritySearchQueries = {
      minimal_style: {
        'Meghan Markle': {
          primary: 'Meghan Markle elegant jewelry red carpet',
          secondary: 'Meghan Markle earrings royal events',
          fallback: 'Meghan Markle delicate necklace fashion'
        },
        'Zoe Kravitz': {
          primary: 'Zoe Kravitz minimalist earrings fashion',
          secondary: 'Zoe Kravitz jewelry red carpet',
          fallback: 'Zoe Kravitz accessories style'
        },
        'Emma Watson': {
          primary: 'Emma Watson delicate necklace events',
          secondary: 'Emma Watson jewelry sustainable fashion',
          fallback: 'Emma Watson elegant earrings'
        }
      },
      bold_style: {
        'Rihanna': {
          primary: 'Rihanna statement jewelry fashion week',
          secondary: 'Rihanna bold earrings red carpet',
          fallback: 'Rihanna dramatic necklace glamour'
        },
        'Lady Gaga': {
          primary: 'Lady Gaga dramatic earrings red carpet',
          secondary: 'Lady Gaga artistic jewelry awards',
          fallback: 'Lady Gaga statement accessories'
        },
        'Kylie Jenner': {
          primary: 'Kylie Jenner bold necklace glamour',
          secondary: 'Kylie Jenner luxury jewelry fashion',
          fallback: 'Kylie Jenner diamond earrings'
        }
      },
      traditional_style: {
        'Kate Middleton': {
          primary: 'Kate Middleton classic jewelry royal events',
          secondary: 'Kate Middleton pearl earrings tiara',
          fallback: 'Kate Middleton elegant necklace'
        },
        'Audrey Hepburn': {
          primary: 'Audrey Hepburn pearl necklace iconic',
          secondary: 'Audrey Hepburn classic jewelry vintage',
          fallback: 'Audrey Hepburn elegant earrings'
        },
        'Grace Kelly': {
          primary: 'Grace Kelly elegant earrings vintage',
          secondary: 'Grace Kelly royal jewelry princess',
          fallback: 'Grace Kelly classic necklace'
        }
      },
      modern_style: {
        'Bella Hadid': {
          primary: 'Bella Hadid contemporary jewelry fashion',
          secondary: 'Bella Hadid geometric earrings runway',
          fallback: 'Bella Hadid modern necklace style'
        },
        'Dua Lipa': {
          primary: 'Dua Lipa modern earrings music awards',
          secondary: 'Dua Lipa colorful jewelry fashion',
          fallback: 'Dua Lipa contemporary accessories'
        },
        'Zendaya': {
          primary: 'Zendaya geometric necklace red carpet',
          secondary: 'Zendaya innovative jewelry awards',
          fallback: 'Zendaya modern earrings fashion'
        }
      }
    };
    // Load API data
    this.loadNews();
    this.loadTrendingCelebrities();
    
    // GUARANTEED CELEBRITY IMAGE URLS - Primary source
    this.styleImageUrls = {
      minimal: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/3b32595a-14e8-469d-8365-14b2ddbc87d0.png",
      bold: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/8d2c3b8e-8a6e-4863-acdd-817d1018d35a.png", 
      traditional: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/523c1519-10f8-4962-a7b9-3f140ed477b5.png",
      modern: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/858778d8-83a0-40f3-9a22-31d2c97ddb1a.png"
    };
    
    // Monogram fallbacks for secondary display
    this.celebrityMonograms = {
      "Meghan Markle": { initials: "MM", color: "#8B6F47", style: "minimal" },
      "Zoe Kravitz": { initials: "ZK", color: "#5D4E37", style: "minimal" },
      "Emma Watson": { initials: "EW", color: "#A0522D", style: "minimal" },
      "Rihanna": { initials: "RH", color: "#DC143C", style: "bold" },
      "Lady Gaga": { initials: "LG", color: "#FF1493", style: "bold" },
      "Kylie Jenner": { initials: "KJ", color: "#FF69B4", style: "bold" },
      "Kate Middleton": { initials: "KM", color: "#4169E1", style: "traditional" },
      "Audrey Hepburn": { initials: "AH", color: "#2F4F4F", style: "traditional" },
      "Grace Kelly": { initials: "GK", color: "#6495ED", style: "traditional" },
      "Bella Hadid": { initials: "BH", color: "#20B2AA", style: "modern" },
      "Dua Lipa": { initials: "DL", color: "#9370DB", style: "modern" },
      "Zendaya": { initials: "ZN", color: "#FF6347", style: "modern" }
    };
    
    // Initialize mock data with enhanced celebrity information
    // Enhanced celebrity styles with TMDB IDs and recent trends
    this.celebrityStyles = {
      minimal: {
        celebrities: [
          { name: "Meghan Markle", tmdb_id: 1396132, recent_trends: ["Delicate gold jewelry", "Minimalist earrings", "Simple pendant necklaces"] },
          { name: "Zoe Kravitz", tmdb_id: 54693, recent_trends: ["Layered thin chains", "Ear cuffs", "Vintage-inspired rings"] },
          { name: "Emma Watson", tmdb_id: 10990, recent_trends: ["Sustainable jewelry", "Ethical diamonds", "Dainty bracelets"] }
        ],
        characteristics: ["Simple designs", "Clean lines", "Delicate pieces", "Subtle details"],
        jewelry_types: ["Thin bangles", "Simple pendant necklaces", "Delicate stud earrings", "Minimalist rings"],
        description: "Your style is refined and understated. You appreciate clean lines and timeless elegance that speaks softly but carries sophistication."
      },
      bold: {
        celebrities: [
          { name: "Rihanna", tmdb_id: 1016168, recent_trends: ["Oversized earrings", "Statement necklaces", "Bold arm cuffs"] },
          { name: "Lady Gaga", tmdb_id: 1327760, recent_trends: ["Dramatic chokers", "Art deco pieces", "Colored gemstones"] },
          { name: "Kylie Jenner", tmdb_id: 1581165, recent_trends: ["Chunky gold chains", "Diamond tennis bracelets", "Statement rings"] }
        ],
        characteristics: ["Oversized pieces", "Statement designs", "Eye-catching elements", "Dramatic flair"],
        jewelry_types: ["Chunky chains", "Oversized earrings", "Statement rings", "Bold necklaces"],
        description: "You love to make an entrance! Your style is confident, dramatic, and impossible to ignore. You're not afraid to be the center of attention."
      },
      traditional: {
        celebrities: [
          { name: "Kate Middleton", tmdb_id: 1979194, recent_trends: ["Pearl jewelry", "Diamond studs", "Classic brooches"] },
          { name: "Audrey Hepburn", tmdb_id: 11701, recent_trends: ["Timeless pearls", "Diamond tiaras", "Classic elegance"] },
          { name: "Grace Kelly", tmdb_id: 11664, recent_trends: ["Royal jewelry", "Heritage pieces", "Classic sophistication"] }
        ],
        characteristics: ["Classic designs", "Timeless appeal", "Heritage styles", "Traditional craftsmanship"],
        jewelry_types: ["Pearl necklaces", "Diamond studs", "Classic hoops", "Solitaire rings"],
        description: "You have an appreciation for timeless beauty and classic elegance. Your style transcends trends and embodies enduring sophistication."
      },
      modern: {
        celebrities: [
          { name: "Bella Hadid", tmdb_id: 1147380, recent_trends: ["Geometric earrings", "Layered jewelry", "Contemporary designs"] },
          { name: "Dua Lipa", tmdb_id: 1565841, recent_trends: ["Mixed metal jewelry", "Architectural pieces", "Modern chains"] },
          { name: "Zendaya", tmdb_id: 505710, recent_trends: ["Innovative designs", "Colorful gemstones", "Avant-garde pieces"] }
        ],
        characteristics: ["Contemporary designs", "Innovative materials", "Geometric shapes", "Cutting-edge aesthetics"],
        jewelry_types: ["Geometric earrings", "Modern layered pieces", "Contemporary pendants", "Architectural rings"],
        description: "You're a trendsetter who loves contemporary design and cutting-edge fashion. Your style is fresh, innovative, and ahead of the curve."
      }
    };

    this.surveyQuestions = [
      {
        id: 1,
        question: "Which celebrity's recent jewelry style inspires you most?",
        type: "multiple_choice",
        options: [
          { 
            text: "Zendaya - Diamond geometric choker at movie premiere", 
            celebrity: "Zendaya",
            style_weights: { modern: 3, bold: 1 } 
          },
          { 
            text: "Rihanna - Oversized gold statement earrings", 
            celebrity: "Rihanna",
            style_weights: { bold: 3, modern: 1 } 
          },
          { 
            text: "Meghan Markle - Delicate gold minimalist jewelry", 
            celebrity: "Meghan Markle",
            style_weights: { minimal: 3, traditional: 1 } 
          },
          { 
            text: "Kate Middleton - Classic pearl and diamond ensemble", 
            celebrity: "Kate Middleton",
            style_weights: { traditional: 3, minimal: 1 } 
          }
        ]
      },
      {
        id: 2,
        question: "What occasions do you typically wear jewelry for?",
        type: "multiple_choice",
        options: [
          { text: "Everyday wear", style_weights: { minimal: 3, modern: 2 } },
          { text: "Special events and parties", style_weights: { bold: 3, modern: 2 } },
          { text: "Professional settings", style_weights: { traditional: 3, minimal: 2 } },
          { text: "Date nights and romantic occasions", style_weights: { traditional: 2, bold: 2 } }
        ]
      },
      {
        id: 3,
        question: "What is your preferred jewelry size?",
        type: "multiple_choice",
        options: [
          { text: "Small and delicate", style_weights: { minimal: 3, traditional: 1 } },
          { text: "Large and statement-making", style_weights: { bold: 3, modern: 1 } },
          { text: "Medium and balanced", style_weights: { traditional: 2, modern: 2 } },
          { text: "Varies by occasion", style_weights: { modern: 2, bold: 1 } }
        ]
      },
      {
        id: 4,
        question: "What is your budget range for jewelry purchases?",
        type: "budget_slider",
        min: 30000,
        max: 1300000
      },
      {
        id: 5,
        question: "How often do you follow celebrity jewelry trends and news?",
        type: "multiple_choice",
        options: [
          { text: "Daily - I love staying updated on celebrity fashion", style_weights: { modern: 2, bold: 2 }, trend_engagement: "high" },
          { text: "Weekly - I check occasionally for inspiration", style_weights: { modern: 1, traditional: 1 }, trend_engagement: "medium" },
          { text: "Monthly - Only for special events and red carpets", style_weights: { traditional: 2, bold: 1 }, trend_engagement: "low" },
          { text: "Rarely - I prefer timeless over trendy", style_weights: { traditional: 3, minimal: 2 }, trend_engagement: "minimal" }
        ]
      },
      {
        id: 6,
        question: "Which metal finish appeals to you most?",
        type: "multiple_choice",
        options: [
          { text: "Classic gold", style_weights: { traditional: 3, bold: 1 } },
          { text: "Modern silver/white gold", style_weights: { minimal: 2, modern: 3 } },
          { text: "Mixed metals", style_weights: { modern: 3, bold: 2 } },
          { text: "Rose gold", style_weights: { modern: 2, minimal: 2 } }
        ]
      }
    ];

    // Mock news data for fallback
    this.mockNewsArticles = [
      {
        id: 1,
        headline: "Zendaya's Diamond Choker Steals the Show at Movie Premiere",
        source: "Entertainment Tonight",
        published_at: "2025-10-14T18:30:00Z",
        category: "celebrity_jewelry",
        celebrity: "Zendaya",
        style_category: "modern",
        content: "The actress wore a stunning geometric diamond choker that perfectly complemented her contemporary style..."
      },
      {
        id: 2,
        headline: "Rihanna's Bold Gold Statement Earrings Set New Trend",
        source: "Vogue",
        published_at: "2025-10-14T15:20:00Z",
        category: "celebrity_jewelry",
        celebrity: "Rihanna",
        style_category: "bold",
        content: "The business mogul showcased oversized gold earrings that embody her fearless approach to fashion..."
      },
      {
        id: 3,
        headline: "Meghan Markle's Minimalist Jewelry Choice Inspires Fans",
        source: "Harper's Bazaar",
        published_at: "2025-10-14T12:45:00Z",
        category: "celebrity_jewelry",
        celebrity: "Meghan Markle",
        style_category: "minimal",
        content: "The Duchess chose delicate gold jewelry that reflects her refined, understated aesthetic..."
      }
    ];

    // Celebrity images are now guaranteed to display using style representatives

    this.jewelryProducts = [
      {
        category: "Earring",
        name: "Halo Spiral Diamond Earrings",
        price: 138477,
        collection: "",
        style_match: ["bold", "modern"],
        image_placeholder: "elegant-spiral-earrings"
      },
      {
        category: "Earring",
        name: "Petal Lace Diamond Earrings",
        price: 82747,
        collection: "Floral Collection",
        style_match: ["traditional", "minimal"],
        image_placeholder: "delicate-petal-earrings"
      },
      {
        category: "Ring",
        name: "Seraphine Leaf Diamond Ring",
        price: 60366,
        collection: "Floral Collection",
        style_match: ["minimal", "modern"],
        image_placeholder: "leaf-diamond-ring"
      },
      {
        category: "Ring",
        name: "Aurora Crown Diamond Ring",
        price: 48842,
        collection: "Tribal Collection",
        style_match: ["traditional", "bold"],
        image_placeholder: "crown-diamond-ring"
      },
      {
        category: "Pendant",
        name: "Butterfly Whimsy Diamond Pendant",
        price: 48196,
        collection: "Butterfly Collection",
        style_match: ["modern", "bold"],
        image_placeholder: "butterfly-pendant"
      },
      {
        category: "Bracelet",
        name: "Ethereal Spiral Diamond Bracelet",
        price: 199074,
        collection: "Sun",
        style_match: ["bold", "modern"],
        image_placeholder: "spiral-bracelet"
      },
      {
        category: "Necklace",
        name: "Ivy Diamond Necklace",
        price: 1024606,
        collection: "",
        style_match: ["bold", "traditional"],
        image_placeholder: "ivy-diamond-necklace"
      },
      {
        category: "Pendant",
        name: "Modern Layered Diamond Pendant",
        price: 56855,
        collection: "Tribal Collection",
        style_match: ["modern", "minimal"],
        image_placeholder: "layered-pendant"
      }
    ];
  }

  init() {
    this.setupEventListeners();
    this.setupResponsiveFeatures();
    this.setupInactivityTimer();
    this.showScreen('welcome');
    this.startNewsTicker();
    this.logDeviceInfo();
  }

  detectDeviceType() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    if (width >= 2160 && isPortrait) {
      return 'kiosk';
    } else if (width >= 1024) {
      return 'desktop';
    } else if (width >= 768) {
      return 'tablet';
    } else {
      return 'mobile';
    }
  }

  detectTouchSupport() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  setupResponsiveFeatures() {
    // Set appropriate timeout based on device
    this.inactivityTimeoutDuration = this.deviceType === 'kiosk' ? 30000 : 60000;
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // Handle resize events
    window.addEventListener('resize', KioskUtils.debounce(() => {
      this.handleResize();
    }, 250));
    
    // Prevent zoom on mobile
    if (this.deviceType === 'mobile') {
      this.preventMobileZoom();
    }
  }

  handleOrientationChange() {
    const newDeviceType = this.detectDeviceType();
    if (newDeviceType !== this.deviceType) {
      this.deviceType = newDeviceType;
      console.log(`Device type changed to: ${this.deviceType}`);
      // Optionally refresh layout or reinitialize components
    }
  }

  handleResize() {
    const newDeviceType = this.detectDeviceType();
    if (newDeviceType !== this.deviceType) {
      this.deviceType = newDeviceType;
      this.logDeviceInfo();
    }
  }

  preventMobileZoom() {
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Prevent pinch zoom
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());
  }

  logDeviceInfo() {
    console.log('Device Info:', {
      type: this.deviceType,
      touchSupport: this.isTouchDevice,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      userAgent: navigator.userAgent.substring(0, 100)
    });
  }

  setupEventListeners() {
    // Use appropriate event types based on device
    const clickEvent = this.isTouchDevice ? 'touchstart' : 'click';
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
    
    // News filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterNews(e.target.dataset.filter);
      });
    });
    
    // Interactive features
    const viewCelebrityNewsBtn = document.getElementById('view-celebrity-news-btn');
    if (viewCelebrityNewsBtn) {
      viewCelebrityNewsBtn.addEventListener('click', () => {
        this.switchTab('news');
        this.showScreen('survey');
      });
    }
    
    const styleTimelineBtn = document.getElementById('style-timeline-btn');
    if (styleTimelineBtn) {
      styleTimelineBtn.addEventListener('click', () => {
        this.openInteractiveFeature('style-timeline');
      });
    }
    
    // Modal controls
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', this.closeModal);
    }
    
    const modalOverlay = document.getElementById('interactive-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.closeModal();
        }
      });
    }
    // Welcome screen - use appropriate event for device
    const welcomeScreen = document.getElementById('welcome-screen');
    if (this.isTouchDevice) {
      welcomeScreen.addEventListener('touchstart', this.startSurvey);
    } else {
      welcomeScreen.addEventListener('click', this.startSurvey);
    }
    
    // Survey navigation
    document.getElementById('prev-btn').addEventListener('click', this.prevQuestion);
    document.getElementById('next-btn').addEventListener('click', this.nextQuestion);
    
    // Budget slider
    const budgetSlider = document.getElementById('budget-range');
    if (budgetSlider) {
      budgetSlider.addEventListener('input', this.updateBudgetDisplay);
    }
    
    // Results screen
    document.getElementById('view-products-btn').addEventListener('click', this.showProducts);
    
    // Products screen
    document.getElementById('category-filter').addEventListener('change', this.filterProducts);
    document.getElementById('collection-filter').addEventListener('change', this.filterProducts);
    document.getElementById('price-filter').addEventListener('change', this.filterProducts);
    document.getElementById('start-over-btn').addEventListener('click', this.resetApp);
    document.getElementById('back-to-mirror-btn').addEventListener('click', () => this.showScreen('welcome'));
    
    // Global activity tracking - use appropriate events
    if (this.isTouchDevice) {
      document.addEventListener('touchstart', this.handleUserActivity);
      document.addEventListener('touchmove', this.handleUserActivity);
    } else {
      document.addEventListener('click', this.handleUserActivity);
      document.addEventListener('mousemove', this.handleUserActivity);
      document.addEventListener('keydown', this.handleUserActivity);
    }
    
    // Timeout overlay
    document.getElementById('timeout-overlay').addEventListener('click', this.dismissTimeout.bind(this));
  }

  setupInactivityTimer() {
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    
    // Use device-appropriate timeout duration
    this.inactivityTimer = setTimeout(() => {
      this.showTimeoutWarning();
    }, this.inactivityTimeoutDuration || 30000);
  }

  showTimeoutWarning() {
    const overlay = document.getElementById('timeout-overlay');
    overlay.classList.remove('hidden');
    
    let countdown = 10;
    document.getElementById('countdown').textContent = countdown;
    
    this.timeoutTimer = setInterval(() => {
      countdown--;
      document.getElementById('countdown').textContent = countdown;
      
      if (countdown <= 0) {
        this.resetToMirror();
      }
    }, 1000);
  }

  dismissTimeout() {
    const overlay = document.getElementById('timeout-overlay');
    overlay.classList.add('hidden');
    
    if (this.timeoutTimer) {
      clearInterval(this.timeoutTimer);
    }
    
    this.resetInactivityTimer();
  }

  resetToMirror() {
    if (this.timeoutTimer) {
      clearInterval(this.timeoutTimer);
    }
    
    const overlay = document.getElementById('timeout-overlay');
    overlay.classList.add('hidden');
    
    this.resetApp();
  }

  handleUserActivity() {
    this.resetInactivityTimer();
  }

  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(`${screenId}-screen`).classList.add('active');
    this.currentScreen = screenId;
  }

  startSurvey() {
    this.currentQuestion = 0;
    this.surveyResponses = [];
    this.showScreen('survey');
    this.displayQuestion();
  }

  displayQuestion() {
    // Add loading state for better UX
    const questionContainer = document.querySelector('.question-container');
    questionContainer.classList.add('fade-out');
    
    setTimeout(() => {
      this.renderQuestion();
      questionContainer.classList.remove('fade-out');
      questionContainer.classList.add('fade-in');
    }, 150);
  }
  
  renderQuestion() {
    const question = this.surveyQuestions[this.currentQuestion];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('question-options');
    const budgetSlider = document.getElementById('budget-slider');
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    
    // Update progress
    const progress = ((this.currentQuestion + 1) / this.surveyQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionSpan.textContent = this.currentQuestion + 1;
    
    // Update question text
    questionText.textContent = question.question;
    
    if (question.type === 'multiple_choice') {
      budgetSlider.classList.add('hidden');
      optionsContainer.classList.remove('hidden');
      
      // Clear previous options
      optionsContainer.innerHTML = '';
      
      // Add options
      question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        button.dataset.optionIndex = index;
        // Use appropriate event for device type
        if (this.isTouchDevice) {
          button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            KioskUtils.provideTouchFeedback(button);
            this.selectOption(index);
          });
        } else {
          button.addEventListener('click', () => this.selectOption(index));
        }
        optionsContainer.appendChild(button);
      });
    } else if (question.type === 'budget_slider') {
      optionsContainer.classList.add('hidden');
      budgetSlider.classList.remove('hidden');
      
      const slider = document.getElementById('budget-range');
      slider.min = question.min;
      slider.max = question.max;
      slider.value = (question.min + question.max) / 2;
      this.updateBudgetDisplay();
    }
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = this.currentQuestion === 0;
    this.updateNextButton();
  }

  selectOption(optionIndex) {
    // Clear previous selections
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Select current option
    const selectedButton = document.querySelector(`[data-option-index="${optionIndex}"]`);
    selectedButton.classList.add('selected');
    
    // Provide haptic feedback on supported devices
    if (this.isTouchDevice && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Store response
    this.surveyResponses[this.currentQuestion] = optionIndex;
    
    this.updateNextButton();
    
    // Auto-advance on mobile after a short delay for better UX
    if (this.deviceType === 'mobile' && this.currentQuestion < this.surveyQuestions.length - 1) {
      setTimeout(() => {
        if (this.surveyResponses[this.currentQuestion] !== undefined) {
          this.nextQuestion();
        }
      }, 800);
    }
  }

  updateBudgetDisplay() {
    const slider = document.getElementById('budget-range');
    const display = document.getElementById('budget-value');
    
    if (slider && display) {
      const value = parseInt(slider.value);
      display.textContent = this.formatPrice(value);
      
      // Store response
      this.surveyResponses[this.currentQuestion] = value;
      this.updateNextButton();
    }
  }

  updateNextButton() {
    const nextBtn = document.getElementById('next-btn');
    const hasResponse = this.surveyResponses[this.currentQuestion] !== undefined;
    
    nextBtn.disabled = !hasResponse;
    
    if (this.currentQuestion === this.surveyQuestions.length - 1) {
      nextBtn.textContent = hasResponse ? 'Analyze My Style' : 'Complete Survey';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.surveyQuestions.length - 1) {
      this.currentQuestion++;
      this.displayQuestion();
    } else {
      this.analyzeStyle();
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.displayQuestion();
    }
  }

  analyzeStyle() {
    this.showScreen('analysis');
    
    // Simulate AI processing with a delay
    setTimeout(() => {
      this.calculateStyleMatch();
      this.displayResults();
    }, 3000);
  }

  // Celebrity Image System Methods
  initializeCelebrityImageSystem() {
    // Only runs once per session, prepare nothing.
  }

  // Fetch real celebrity jewelry images from SearchAPI Bing, with robust fallback
  async fetchCelebrityImage(celebrityName, styleKey) {
    // Use in-memory cache to avoid duplicate calls
    if (this.celebrityImageCache.has(celebrityName)) {
      return this.celebrityImageCache.get(celebrityName);
    }

    // Allow up to 2 API calls (primary/secondary query)
    const styleTypeKey = styleKey || this.getStyleForCelebrity(celebrityName);
    let queries = [];
    if (this.celebritySearchQueries && this.celebritySearchQueries[styleTypeKey + '_style'] && this.celebritySearchQueries[styleTypeKey + '_style'][celebrityName]) {
      const qObj = this.celebritySearchQueries[styleTypeKey + '_style'][celebrityName];
      queries.push(qObj.primary, qObj.secondary, qObj.fallback);
    } else {
      queries.push(`${celebrityName} jewelry fashion`);
    }

    for (let q of queries) {
      try {
        const cacheKey = `${celebrityName}|${q}`;
        if (this.searchApiCache.has(cacheKey)) {
          const cached = this.searchApiCache.get(cacheKey);
          if (cached) {
            this.celebrityImageCache.set(celebrityName, cached);
            return cached;
          }
        }

        const url = `${this.searchApiConfig.baseUrl}?api_key=${encodeURIComponent(this.searchApiConfig.apiKey)}&engine=${encodeURIComponent(this.searchApiConfig.engine)}&q=${encodeURIComponent(q)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.searchApiConfig.timeout);

        let resp = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (resp.ok) {
          const result = await resp.json();
          if (result && Array.isArray(result.images)) {
            // Use thumbnail url for speed and legal compliance
            const filtered = result.images.filter(img => img.thumbnail && /jewel|earring|necklace|red carpet|event/i.test(img.title + img.source));
            const picked = (filtered.length > 0) ? filtered[0] : (result.images[0]||null);
            if (picked && picked.thumbnail) {
              const imgObj = {
                type: 'bing',
                url: picked.thumbnail,
                pageUrl: picked.link,
                source: picked.source
              };
              this.celebrityImageCache.set(celebrityName, imgObj);
              this.searchApiCache.set(cacheKey, imgObj);
              return imgObj;
            }
          }
        }
      } catch (err) {
        // If an error (including timeout or abort), try next query
        continue;
      }
    }
    // Fallback 1: representative image
    const fallbackType = styleTypeKey && this.styleImageUrls[styleTypeKey] ? 'style' : 'monogram';
    if (fallbackType === 'style') {
      const url = this.styleImageUrls[styleTypeKey];
      const imgObj = { type: 'style', url: url };
      this.celebrityImageCache.set(celebrityName, imgObj);
      return imgObj;
    }
    // Fallback 2: monogram/initials
    const initials = this.celebrityMonograms[celebrityName]?.initials || this.getInitials(celebrityName);
    const color = this.celebrityMonograms[celebrityName]?.color || '#8B6F47';
    return { type: 'monogram', initials, color };
  }

  renderCelebrityImage(container, celebrityName) {
    const styleKey = this.getStyleForCelebrity(celebrityName);
    // Loading UI
    container.innerHTML = '';
    container.classList.add('loading');
    // Render async
    this.fetchCelebrityImage(celebrityName, styleKey).then(imageObj => {
      container.classList.remove('loading');
      if (imageObj.type === 'bing') {
        container.innerHTML = `<img src="${imageObj.url}" alt="${celebrityName} jewelry look" class="celebrity-main-image loaded" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" loading="lazy">
          <a href="${imageObj.pageUrl}" target="_blank" rel="noopener" style="display:none;">Source</a>`;
      } else if (imageObj.type === 'style') {
        container.innerHTML = `<img src="${imageObj.url}" alt="${celebrityName} style representation" class="celebrity-main-image loaded" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" loading="lazy">`;
      } else if (imageObj.type === 'monogram') {
        container.innerHTML = `<div class="celebrity-avatar-fallback active" style="background: linear-gradient(135deg, ${imageObj.color}, ${imageObj.color}dd);width:100%;height:100%"><span class="celebrity-initials">${imageObj.initials}</span></div>`;
      } else {
        container.innerHTML = `<div class="celebrity-avatar-fallback active"><span class="celebrity-initials">${this.getInitials(celebrityName)}</span></div>`;
      }
    }).catch(() => {
      container.classList.remove('loading');
      // CSS placeholder (Level 4 fallback)
      container.innerHTML = `<div class="celebrity-avatar-fallback active"><span class="celebrity-initials">${this.getInitials(celebrityName)}</span></div>`;
    });
  }

  async loadCelebrityImages() {
    // Preload celebrity images for trending section
    const allCelebrities = Object.values(this.celebrityStyles)
      .flatMap(style => style.celebrities)
      .map(celeb => celeb.name);
    
    // Load trending celebrities first
    for (const celebrity of this.trendingCelebrities.slice(0, 3)) {
      await this.fetchCelebrityImage(celebrity.name);
    }
  }

  // Legacy methods removed - using SearchAPI integration now

  // Utility method for getting celebrity style category
  getStyleForCelebrity(celebrityName) {
    for (const [style, data] of Object.entries(this.celebrityStyles)) {
      if (data.celebrities.some(celeb => celeb.name === celebrityName)) {
        return style;
      }
    }
    return 'minimal';
  }

  getInitials(name) {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  // Updated renderCelebrityImage method is above in the SearchAPI section

  // API Integration Methods
  async loadNews() {
    try {
      this.apiStatus.newsApi = 'loading';
      
      // Use mock data as fallback since we can't make actual API calls in this environment
      // In a real implementation, this would fetch from News API
      setTimeout(() => {
        this.newsArticles = this.mockNewsArticles;
        this.apiStatus.newsApi = 'success';
        this.renderNews();
        this.updateNewsTicker();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to load news:', error);
      this.apiStatus.newsApi = 'error';
      this.newsArticles = this.mockNewsArticles;
      this.renderNews();
    }
  }
  
  async loadTrendingCelebrities() {
    try {
      this.apiStatus.tmdbApi = 'loading';
      
      // Mock trending celebrities data (would come from TMDB API)
      setTimeout(() => {
        this.trendingCelebrities = [
          { name: "Zendaya", tmdb_id: 505710, popularity: 95, recent_project: "Dune: Part Two" },
          { name: "Rihanna", tmdb_id: 1016168, popularity: 88, recent_project: "Fenty Beauty Campaign" },
          { name: "Emma Watson", tmdb_id: 10990, popularity: 82, recent_project: "Little Women" },
          { name: "Bella Hadid", tmdb_id: 1147380, popularity: 76, recent_project: "Fashion Week 2025" },
          { name: "Meghan Markle", tmdb_id: 1396132, popularity: 74, recent_project: "Royal Engagements" }
        ];
        this.apiStatus.tmdbApi = 'success';
        this.renderTrendingCelebrities();
      }, 1200);
      
    } catch (error) {
      console.error('Failed to load trending celebrities:', error);
      this.apiStatus.tmdbApi = 'error';
    }
  }
  
  async getCelebrityDetails(tmdbId) {
    // Mock celebrity details (would fetch from TMDB API)
    const mockDetails = {
      popularity: Math.floor(Math.random() * 30) + 70,
      recent_projects: ["Recent Movie", "Fashion Campaign", "Red Carpet Event"]
    };
    return mockDetails;
  }
  
  // UI Methods
  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    if (tabName === 'survey') {
      document.querySelector('.survey-content').classList.remove('hidden');
    } else {
      document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    }
  }
  
  renderNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    
    newsGrid.innerHTML = '';
    
    this.newsArticles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'news-article';
      articleElement.innerHTML = `
        <h4>${article.headline}</h4>
        <div class="news-meta">
          <span class="news-source">${article.source}</span>
          <span class="news-date">${new Date(article.published_at).toLocaleDateString()}</span>
        </div>
        <p class="news-excerpt">${article.content}</p>
        <div class="news-tags">
          <span class="badge badge--gold">${article.celebrity}</span>
          <span class="badge badge--default">${article.style_category}</span>
        </div>
      `;
      
      articleElement.addEventListener('click', () => {
        this.openNewsDetail(article);
      });
      
      newsGrid.appendChild(articleElement);
    });
  }
  
  renderTrendingCelebrities() {
    const container = document.getElementById('trending-celebrities');
    if (!container) return;
    
    container.innerHTML = '<h3 style="color: var(--kiosk-gold); margin-bottom: 1.5rem;">Most Popular This Week</h3>';
    
    this.trendingCelebrities.forEach((celebrity, index) => {
      const item = document.createElement('div');
      item.className = 'celebrity-trending-item';
      
      // Get celebrity style for image
      const celebrityStyle = this.getStyleForCelebrity(celebrity.name);
      const styleImageUrl = this.styleImageUrls[celebrityStyle] || this.styleImageUrls.minimal;
      const monogramData = this.celebrityMonograms[celebrity.name];
      
      item.innerHTML = `
        <div class="celebrity-rank">${index + 1}</div>
        <div class="celebrity-trending-image">
          <img src="${styleImageUrl}" alt="${celebrity.name} style" class="trending-celebrity-img" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="trending-celebrity-fallback" style="display: none; background: linear-gradient(135deg, ${monogramData?.color || '#8B6F47'}, ${monogramData?.color || '#8B6F47'}dd); width: 40px; height: 40px; border-radius: 50%; justify-content: center; align-items: center;">
            <span style="color: white; font-weight: bold; font-size: 1rem;">${monogramData?.initials || this.getInitials(celebrity.name)}</span>
          </div>
        </div>
        <div class="celebrity-trending-info">
          <h5>${celebrity.name}</h5>
          <p>Popularity: ${celebrity.popularity}% | ${celebrity.recent_project}</p>
        </div>
      `;
      
      item.addEventListener('click', () => {
        this.showCelebrityDetails(celebrity);
      });
      
      container.appendChild(item);
    });
    
    this.renderTrendingTopics();
  }
  
  renderTrendingTopics() {
    const container = document.getElementById('trending-topics');
    if (!container) return;
    
    const topics = [
      { name: "Sustainable Jewelry Trends", score: 95 },
      { name: "Statement Earrings 2025", score: 88 },
      { name: "Layered Necklace Revival", score: 82 },
      { name: "Royal Jewelry Inspiration", score: 76 }
    ];
    
    container.innerHTML = '<h3 style="color: var(--kiosk-text-light); margin-bottom: 1.5rem;">Trending Topics</h3>';
    
    topics.forEach(topic => {
      const item = document.createElement('div');
      item.className = 'topic-item';
      item.innerHTML = `
        <div class="topic-name">${topic.name}</div>
        <div class="topic-score">${topic.score}</div>
      `;
      container.appendChild(item);
    });
  }
  
  filterNews(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter and render news
    let filteredNews = this.newsArticles;
    
    if (filter !== 'all') {
      filteredNews = this.newsArticles.filter(article => {
        switch (filter) {
          case 'red-carpet':
            return article.category.includes('red-carpet') || article.headline.toLowerCase().includes('red carpet');
          case 'jewelry':
            return article.category.includes('jewelry') || article.headline.toLowerCase().includes('jewelry');
          case 'celebrity':
            return article.category.includes('celebrity');
          default:
            return true;
        }
      });
    }
    
    // Re-render with filtered data
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';
    
    filteredNews.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'news-article';
      articleElement.innerHTML = `
        <h4>${article.headline}</h4>
        <div class="news-meta">
          <span class="news-source">${article.source}</span>
          <span class="news-date">${new Date(article.published_at).toLocaleDateString()}</span>
        </div>
        <p class="news-excerpt">${article.content}</p>
        <div class="news-tags">
          <span class="badge badge--gold">${article.celebrity}</span>
          <span class="badge badge--default">${article.style_category}</span>
        </div>
      `;
      newsGrid.appendChild(articleElement);
    });
  }
  
  startNewsTicker() {
    const tickerContent = document.querySelector('.news-ticker-content');
    if (!tickerContent) return;
    
    const newsItems = [
      "Zendaya's diamond choker sets new red carpet trend",
      "Rihanna launches sustainable jewelry line",
      "Kate Middleton's pearl collection gains popularity",
      "Bella Hadid showcases geometric earrings at fashion week",
      "Celebrity-inspired jewelry sales increase by 40%"
    ];
    
    let currentIndex = 0;
    
    const updateTicker = () => {
      tickerContent.innerHTML = `<span class="news-item">${newsItems[currentIndex]}</span>`;
      currentIndex = (currentIndex + 1) % newsItems.length;
    };
    
    updateTicker();
    setInterval(updateTicker, 5000);
  }
  
  updateNewsTicker() {
    if (this.newsArticles.length > 0) {
      const tickerContent = document.querySelector('.news-ticker-content');
      const headlines = this.newsArticles.map(article => article.headline);
      
      let currentIndex = 0;
      const updateTicker = () => {
        tickerContent.innerHTML = `<span class="news-item">${headlines[currentIndex]}</span>`;
        currentIndex = (currentIndex + 1) % headlines.length;
      };
      
      setInterval(updateTicker, 6000);
    }
  }
  
  openInteractiveFeature(featureType) {
    const modal = document.getElementById('interactive-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modal.classList.remove('hidden');
    
    switch (featureType) {
      case 'news-quiz':
        modalTitle.textContent = 'Celebrity Jewelry Trend Quiz';
        this.renderNewsQuiz(modalBody);
        break;
        
      case 'style-timeline':
        modalTitle.textContent = 'Celebrity Style Evolution';
        this.renderStyleTimeline(modalBody);
        break;
        
      case 'trend-predictor':
        modalTitle.textContent = 'Trend Predictor';
        this.renderTrendPredictor(modalBody);
        break;
        
      default:
        modalTitle.textContent = 'Feature Coming Soon';
        modalBody.innerHTML = '<p>This feature will be available soon!</p>';
    }
  }
  
  renderStyleTimeline(container) {
    const timelineData = [
      {
        year: "2023",
        trend: "Minimalist Jewelry",
        description: "Celebrities embraced delicate, understated pieces. Meghan Markle and Emma Watson led this trend with simple gold chains and subtle earrings."
      },
      {
        year: "2024",
        trend: "Statement Earrings",
        description: "Bold, oversized earrings became the must-have accessory. Rihanna and Lady Gaga popularized dramatic geometric and sculptural designs."
      },
      {
        year: "2025",
        trend: "Sustainable Luxury",
        description: "Eco-conscious jewelry gained momentum. Celebrities began showcasing ethically sourced diamonds and recycled gold pieces."
      }
    ];
    
    container.innerHTML = `
      <div class="timeline-container">
        ${timelineData.map(item => `
          <div class="timeline-item">
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-content">
              <h4>${item.trend}</h4>
              <p class="timeline-description">${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  renderNewsQuiz(container) {
    const quizData = {
      questions: [
        {
          question: "Which celebrity recently wore a geometric diamond choker to a movie premiere?",
          options: ["Zendaya", "Emma Stone", "Scarlett Johansson", "Anne Hathaway"],
          correct: 0
        },
        {
          question: "What jewelry trend is Rihanna known for popularizing in 2025?",
          options: ["Minimalist rings", "Statement earrings", "Pearl necklaces", "Charm bracelets"],
          correct: 1
        }
      ],
      currentQuestion: 0,
      score: 0
    };
    
    const renderQuestion = () => {
      const q = quizData.questions[quizData.currentQuestion];
      container.innerHTML = `
        <div class="quiz-container">
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((option, index) => `
              <button class="quiz-option" data-answer="${index}">${option}</button>
            `).join('')}
          </div>
          <div class="quiz-progress">Question ${quizData.currentQuestion + 1} of ${quizData.questions.length}</div>
        </div>
      `;
      
      container.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const answer = parseInt(e.target.dataset.answer);
          if (answer === q.correct) {
            quizData.score++;
            e.target.style.background = 'var(--color-success)';
          } else {
            e.target.style.background = 'var(--color-error)';
          }
          
          setTimeout(() => {
            quizData.currentQuestion++;
            if (quizData.currentQuestion < quizData.questions.length) {
              renderQuestion();
            } else {
              showResults();
            }
          }, 1500);
        });
      });
    };
    
    const showResults = () => {
      container.innerHTML = `
        <div class="quiz-container">
          <h3>Quiz Complete!</h3>
          <div class="quiz-score">Score: ${quizData.score}/${quizData.questions.length}</div>
          <p>Great job! You're staying up to date with celebrity jewelry trends.</p>
        </div>
      `;
    };
    
    renderQuestion();
  }
  
  renderTrendPredictor(container) {
    container.innerHTML = `
      <div class="trend-predictor">
        <h3>Predicted Jewelry Trends for 2026</h3>
        <div class="prediction-list">
          <div class="prediction-item">
            <h4>🔮 Tech-Integrated Jewelry</h4>
            <p>Smart rings and bracelets with health monitoring features</p>
            <div class="confidence">Confidence: 85%</div>
          </div>
          <div class="prediction-item">
            <h4>🌱 Bio-Based Materials</h4>
            <p>Jewelry made from lab-grown materials and sustainable sources</p>
            <div class="confidence">Confidence: 78%</div>
          </div>
          <div class="prediction-item">
            <h4>💫 Celestial Themes</h4>
            <p>Star, moon, and constellation-inspired designs</p>
            <div class="confidence">Confidence: 72%</div>
          </div>
        </div>
      </div>
    `;
  }
  
  closeModal() {
    const modal = document.getElementById('interactive-modal');
    modal.classList.add('hidden');
  }
  
  calculateStyleMatch() {
    const styleScores = {
      minimal: 0,
      bold: 0,
      traditional: 0,
      modern: 0
    };
    
    // Calculate scores based on survey responses
    this.surveyQuestions.forEach((question, index) => {
      if (question.type === 'multiple_choice' && this.surveyResponses[index] !== undefined) {
        const selectedOption = question.options[this.surveyResponses[index]];
        Object.entries(selectedOption.style_weights).forEach(([style, weight]) => {
          styleScores[style] += weight;
        });
      }
    });
    
    // Find the highest scoring style
    let maxScore = 0;
    let matchedStyle = 'minimal';
    
    Object.entries(styleScores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        matchedStyle = style;
      }
    });
    
    this.matchedStyle = matchedStyle;
    
    // Select a random celebrity from the matched style
    const celebrities = this.celebrityStyles[matchedStyle].celebrities;
    const selectedCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
    this.matchedCelebrity = selectedCelebrity.name;
    this.matchedCelebrityData = selectedCelebrity;
  }

  async displayResults() {
    this.showScreen('results');
    
    const celebrityName = document.getElementById('celebrity-name');
    const styleCategory = document.getElementById('style-category');
    const styleDescription = document.getElementById('style-description');
    const celebrityPopularity = document.getElementById('celebrity-popularity');
    const celebrityProjects = document.getElementById('celebrity-projects');
    const recentNews = document.getElementById('celebrity-recent-news');
    const celebrityImageContainer = document.getElementById('celebrity-image');
    const celebrityCard = document.querySelector('.celebrity-card');
    
    celebrityName.textContent = this.matchedCelebrity;
    styleCategory.textContent = this.matchedStyle.charAt(0).toUpperCase() + this.matchedStyle.slice(1) + ' Style';
    styleDescription.textContent = this.celebrityStyles[this.matchedStyle].description;
    
    // Add style data attribute for CSS styling
    if (celebrityCard) {
      celebrityCard.setAttribute('data-style', this.matchedStyle);
    }
    
    // GUARANTEED celebrity image rendering with comprehensive fallback system
    this.renderCelebrityImage(celebrityImageContainer, this.matchedCelebrity);
    
    // Log successful image rendering
    console.log(`Successfully rendered celebrity image for ${this.matchedCelebrity} (${this.matchedStyle} style)`);
    
    // Get celebrity details from TMDB (mock data)
    if (this.matchedCelebrityData && this.matchedCelebrityData.tmdb_id) {
      const details = await this.getCelebrityDetails(this.matchedCelebrityData.tmdb_id);
      
      celebrityPopularity.innerHTML = `
        <span>Popularity Score:</span>
        <div class="popularity-score">${details.popularity}%</div>
      `;
      
      celebrityProjects.innerHTML = `
        <h4>Recent Projects</h4>
        <ul>
          ${details.recent_projects.map(project => `<li>${project}</li>`).join('')}
        </ul>
      `;
      
      // Show recent news about this celebrity
      const celebrityNews = this.newsArticles.filter(article => 
        article.celebrity.toLowerCase().includes(this.matchedCelebrity.toLowerCase())
      );
      
      if (celebrityNews.length > 0) {
        recentNews.innerHTML = `
          <h4>Recent News</h4>
          ${celebrityNews.slice(0, 2).map(article => `
            <div class="news-snippet">
              <strong>${article.headline}</strong>
              <br><small>${article.source} - ${new Date(article.published_at).toLocaleDateString()}</small>
            </div>
          `).join('')}
        `;
      }
      
      // Show recent trends for this celebrity
      if (this.matchedCelebrityData.recent_trends) {
        const trendsHtml = `
          <div class="celebrity-trends">
            <h4>Current Jewelry Trends</h4>
            <ul>
              ${this.matchedCelebrityData.recent_trends.map(trend => `<li>${trend}</li>`).join('')}
            </ul>
          </div>
        `;
        styleDescription.innerHTML += trendsHtml;
      }
    }
  }

  showProducts() {
    this.showScreen('products');
    this.filterProducts();
  }

  filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const collectionFilter = document.getElementById('collection-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    let filtered = this.jewelryProducts.filter(product => {
      // Style match filter (prioritize matched style)
      const styleMatch = product.style_match.includes(this.matchedStyle);
      
      // Category filter
      const categoryMatch = !categoryFilter || product.category === categoryFilter;
      
      // Collection filter
      const collectionMatch = !collectionFilter || product.collection === collectionFilter;
      
      // Price filter
      let priceMatch = true;
      if (priceFilter) {
        if (priceFilter === '0-50000') {
          priceMatch = product.price <= 50000;
        } else if (priceFilter === '50000-100000') {
          priceMatch = product.price > 50000 && product.price <= 100000;
        } else if (priceFilter === '100000-500000') {
          priceMatch = product.price > 100000 && product.price <= 500000;
        } else if (priceFilter === '500000+') {
          priceMatch = product.price > 500000;
        }
      }
      
      return categoryMatch && collectionMatch && priceMatch;
    });
    
    // Sort by style match (matched style first)
    filtered.sort((a, b) => {
      const aMatch = a.style_match.includes(this.matchedStyle);
      const bMatch = b.style_match.includes(this.matchedStyle);
      
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
    
    this.renderProducts(filtered);
  }

  renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
      const card = this.createProductCard(product);
      grid.appendChild(card);
    });
    
    // Show API status if there are connection issues
    if (this.apiStatus.newsApi === 'error' || this.apiStatus.tmdbApi === 'error') {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'api-status error';
      statusDiv.innerHTML = `
        <div class="status-indicator"></div>
        <span>Some features may be limited due to connectivity issues</span>
      `;
      grid.parentElement.insertBefore(statusDiv, grid);
    }
  }

  createProductCard(product) {
    // Add device-specific optimizations
    const card = document.createElement('div');
    let cardClass = 'product-card fade-in';
    
    const isStyleMatch = product.style_match.includes(this.matchedStyle);
    const isTrending = Math.random() > 0.7; // Mock trending logic
    const hasCelebrityMatch = this.matchedCelebrity && Math.random() > 0.5;
    
    if (hasCelebrityMatch) {
      cardClass += ' celebrity-match';
    }
    
    card.className = cardClass;
    
    let badgesHtml = '';
    if (isTrending) {
      badgesHtml += '<div class="trending-badge-product">Trending Now</div>';
    }
    
    let celebrityReference = '';
    if (hasCelebrityMatch) {
      celebrityReference = `<div class="celebrity-reference">As seen on ${this.matchedCelebrity}</div>`;
    }
    
    card.innerHTML = `
      ${badgesHtml}
      <div class="product-image">
        <div class="product-image-placeholder">💎</div>
      </div>
      <div class="product-info">
        <h3>${product.name}${isStyleMatch ? ' ⭐' : ''}</h3>
        <div class="product-price">${this.formatPrice(product.price)}</div>
        <div class="product-collection">${product.collection || 'Signature Collection'}</div>
        ${celebrityReference}
        <div class="product-actions">
          <button class="btn btn--outline" onclick="window.kioskInstance.showProductDetails('${product.name}')">
            <span class="desktop-only">View Details</span>
            <span class="mobile-only">Details</span>
          </button>
          <button class="btn btn--secondary">
            <span class="desktop-only">Add to Wishlist</span>
            <span class="mobile-only">♡ Save</span>
          </button>
        </div>
      </div>
    `;
    
    return card;
  }
  
  showProductDetails(productName) {
    const modal = document.getElementById('interactive-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const product = this.jewelryProducts.find(p => p.name === productName);
    
    if (product) {
      modalTitle.textContent = product.name;
      modalBody.innerHTML = `
        <div class="product-detail">
          <div class="product-detail-image">
            <div class="product-image-placeholder">💎</div>
          </div>
          <div class="product-detail-info">
            <h3>${product.name}</h3>
            <div class="product-price" style="font-size: 2rem; margin: 1rem 0;">${this.formatPrice(product.price)}</div>
            <div class="product-collection">Collection: ${product.collection || 'Signature Collection'}</div>
            <div class="product-category">Category: ${product.category}</div>
            <div class="style-match-info">
              <h4>Style Match</h4>
              <p>This piece matches your ${this.matchedStyle} style preference and complements ${this.matchedCelebrity}'s recent jewelry choices.</p>
            </div>
            <div class="product-features">
              <h4>Features</h4>
              <ul>
                <li>Premium quality materials</li>
                <li>Expert craftsmanship</li>
                <li>Certificate of authenticity</li>
                <li>Lifetime warranty</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    }
  }
  
  openNewsDetail(article) {
    const modal = document.getElementById('interactive-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = article.headline;
    modalBody.innerHTML = `
      <div class="news-detail">
        <div class="news-detail-meta">
          <span class="news-source">${article.source}</span>
          <span class="news-date">${new Date(article.published_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div class="news-tags" style="margin: 1rem 0;">
          <span class="badge badge--gold">${article.celebrity}</span>
          <span class="badge badge--default">${article.style_category}</span>
        </div>
        <div class="news-content">
          <p>${article.content}</p>
          <p>This trend aligns perfectly with current jewelry preferences and has been spotted on various red carpet events. The style reflects the growing influence of celebrity fashion choices on jewelry trends.</p>
        </div>
        <div class="related-products">
          <h4>Similar Styles in Our Collection</h4>
          <p>Browse our ${article.style_category} collection to find pieces inspired by this trend.</p>
        </div>
      </div>
    `;
    
    modal.classList.remove('hidden');
  }
  
  showCelebrityDetails(celebrity) {
    const modal = document.getElementById('interactive-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = celebrity.name;
    modalBody.innerHTML = `
      <div class="celebrity-detail">
        <div class="celebrity-stats">
          <div class="stat-item">
            <div class="stat-value">${celebrity.popularity}%</div>
            <div class="stat-label">Popularity</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">#${this.trendingCelebrities.indexOf(celebrity) + 1}</div>
            <div class="stat-label">Trending Rank</div>
          </div>
        </div>
        <div class="celebrity-info-detail">
          <h4>Recent Project</h4>
          <p>${celebrity.recent_project}</p>
          
          <h4>Jewelry Style Influence</h4>
          <p>${celebrity.name} has been influential in setting jewelry trends, particularly in the ${this.getStyleForCelebrity(celebrity.name)} category. Their recent appearances have showcased innovative approaches to accessorizing.</p>
          
          <h4>Related Products</h4>
          <p>Explore our collection for pieces inspired by ${celebrity.name}'s signature style.</p>
        </div>
      </div>
    `;
    
    modal.classList.remove('hidden');
  }
  
  getStyleForCelebrity(celebrityName) {
    for (const [style, data] of Object.entries(this.celebrityStyles)) {
      if (data.celebrities.some(celeb => celeb.name === celebrityName)) {
        return style;
      }
    }
    return 'contemporary';
  }

  formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
  }

  resetApp() {
    this.currentQuestion = 0;
    this.surveyResponses = [];
    this.matchedStyle = null;
    this.matchedCelebrity = null;
    this.matchedCelebrityData = null;
    this.currentTab = 'survey';
    
    // Reset tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('[data-tab="survey"]').classList.add('active');
    
    // Hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    this.showScreen('welcome');
  }
}

// Initialize the kiosk application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kioskInstance = new EvolJewelsKiosk();
});

// Enhanced error handling for API failures
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, this would log to analytics service
});

// Performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`Kiosk loaded in ${Math.round(loadTime)}ms`);
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('Connection restored - refreshing data');
  if (window.kioskInstance) {
    window.kioskInstance.loadNews();
    window.kioskInstance.loadTrendingCelebrities();
  }
});

window.addEventListener('offline', () => {
  console.log('Connection lost - using cached data');
});

// Handle visibility change (screen sleep/wake)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Screen woke up, reset to mirror mode after extended inactivity
    const kiosk = window.kioskInstance;
    if (kiosk) {
      kiosk.handleUserActivity();
    }
  }
});