/**
 * Enhanced portfolio website JavaScript with improved:
 * - Performance optimization
 * - Error handling
 * - Responsive design
 * - Code organization
 * - Browser compatibility
 * - Lightbox/modal functionality for viewing large images
 */

// Wrap everything in an IIFE to avoid global scope pollution
(function() {
  // Initialize GSAP safely with feature detection
  if (typeof gsap !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      console.warn('ScrollTrigger plugin not loaded:', e);
    }
  } else {
    console.warn('GSAP not found. Animations will not run.');
    return; // Exit early if GSAP isn't available
  }

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', initializePortfolio);

  /**
   * Main initialization function
   */
  function initializePortfolio() {
    initCustomCursor();
    initBackgroundGrid();
    initFloatingElements();
    initPortfolioAnimations();
    initFilterFunctionality();
    initLoadMoreButton();
    initLightboxFunctionality();
  }

  /**
   * Custom cursor effect with performance optimizations
   */
  function initCustomCursor() {
    const cursor = document.querySelector('.cursor-glow');
    if (!cursor) return;

    // Only enable custom cursor on desktop devices
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) {
      cursor.style.display = 'none';
      return;
    }

    // Use requestAnimationFrame for smoother cursor following
    let cursorX = 0;
    let cursorY = 0;
    let requestId = null;

    function updateCursorPosition() {
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY
      });
      requestId = null;
    }

    document.addEventListener('mousemove', (e) => {
      cursor.style.display = 'block';
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      // Only request a new frame if we don't already have a pending one
      if (!requestId) {
        requestId = requestAnimationFrame(updateCursorPosition);
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      // Only hide if we're actually leaving the window
      if (e.relatedTarget === null || e.relatedTarget.nodeName === 'HTML') {
        cursor.style.display = 'none';
      }
    });
    
    document.addEventListener('mouseover', () => {
      cursor.style.display = 'block';
    });
    
    // Add custom cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .filter-btn, .portfolio-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-expanded');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-expanded');
      });
    });
  }

  /**
   * Background grid with optimized rendering
   */
  function initBackgroundGrid() {
    const gridBg = document.querySelector('.grid-bg');
    if (!gridBg) return;
    
    // Clear existing content
    gridBg.innerHTML = '';
    
    // Adjust grid density based on screen size for performance
    let rows, cols;
    if (window.innerWidth <= 768) {
      rows = 20;
      cols = 20;
    } else {
      rows = 50;
      cols = 50;
    }

    // Create grid using document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.cssText = `
          position: absolute;
          width: 1px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          top: ${(i / rows) * 100}%;
          left: ${(j / cols) * 100}%;
          transform: translate(-50%, -50%);
        `;
        fragment.appendChild(dot);
      }
    }
    
    gridBg.appendChild(fragment);
    
    // Create noise overlay with better SVG
    const noiseOverlay = document.querySelector('.noise-overlay');
    if (noiseOverlay) {
      // Use a lighter noise pattern for better performance
      noiseOverlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
    }

    // Add resize handler to adjust grid for responsive design
    window.addEventListener('resize', debounce(() => {
      initBackgroundGrid();
    }, 250));
  }

  /**
   * Animate floating background elements with performance optimizations
   */
  function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-circle');
    if (!floatingElements.length) return;
    
    // Limit the number of floating elements on mobile
    let elementsToAnimate = floatingElements;
    if (window.innerWidth <= 768) {
      elementsToAnimate = Array.from(floatingElements).slice(0, Math.min(floatingElements.length, 3));
      // Hide the rest
      Array.from(floatingElements).slice(Math.min(floatingElements.length, 3)).forEach(el => {
        el.style.display = 'none';
      });
    }
    
    elementsToAnimate.forEach((el, index) => {
      // Set random initial positions
      gsap.set(el, {
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8
      });
      
      // Create random animation
      gsap.to(el, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        duration: 10 + Math.random() * 10,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      });
    });

    // Update positions when window resizes
    window.addEventListener('resize', debounce(() => {
      initFloatingElements();
    }, 250));
  }

  /**
   * Portfolio items animations with improved scroll triggers
   */
  function initPortfolioAnimations() {
    const portfolioSection = document.querySelector('#portfolio');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioHeader = document.querySelector('.portfolio-header');
    
    if (!portfolioSection || !portfolioItems.length) return;

    // Only initialize animations if ScrollTrigger is available
    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger not available. Portfolio animations disabled.');
      return;
    }

    // Create animations with better performance settings
    gsap.from(portfolioItems, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".portfolio-grid",
        start: "top bottom-=50",
        toggleActions: "play none none none",
        once: true // Only animate once for better performance
      }
    });
    
    if (portfolioHeader) {
      gsap.from(portfolioHeader, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: portfolioSection,
          start: "top bottom-=100",
          toggleActions: "play none none none",
          once: true
        }
      });
    }
  }

  /**
   * Filter functionality with improved animation and accessibility
   */
  function initFilterFunctionality() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length || !portfolioItems.length) return;
    
    // Set initial state - activate "All" button
    const allButton = Array.from(filterBtns).find(btn => btn.getAttribute('data-filter') === 'all');
    if (allButton) {
      allButton.classList.add('active', 'border-cyan-500/50', 'glow');
      allButton.classList.remove('border-gray-700');
      allButton.setAttribute('aria-selected', 'true');
    }
    
    // Set accessibility attributes
    filterBtns.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
    });
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Don't do anything if this button is already active
        if (btn.classList.contains('active')) return;
        
        // Remove active class from all buttons
        filterBtns.forEach(b => {
          b.classList.remove('active', 'border-cyan-500/50', 'glow');
          b.classList.add('border-gray-700');
          b.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to clicked button
        btn.classList.add('active', 'border-cyan-500/50', 'glow');
        btn.classList.remove('border-gray-700');
        btn.setAttribute('aria-selected', 'true');
        
        const filter = btn.getAttribute('data-filter');
        const timeline = gsap.timeline();
        
        // Two-phase animation for smoother transitions
        portfolioItems.forEach(item => {
          const matches = filter === 'all' || item.getAttribute('data-category') === filter;
          
          if (matches) {
            timeline.to(item, { 
              scale: 1, 
              opacity: 1, 
              duration: 0.4,
              display: 'block',
              ease: "power2.out"
            }, 0);
          } else {
            timeline.to(item, { 
              scale: 0.9, 
              opacity: 0, 
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => {
                item.style.display = 'none';
              }
            }, 0);
          }
        });
      });
    });

    // Make it keyboard accessible
    filterBtns.forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * Load More button functionality with error handling
   */
  function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
      this.innerHTML = '<span>Loading...</span>';
      this.classList.add('animate-pulse');
      this.disabled = true; // Prevent double-clicks
      
      // Simulate loading more content (replace with actual API call)
      try {
        // Simulate potential API call or content loading
        setTimeout(() => {
          // This is where you would normally fetch more projects
          // For demo purposes, we're just changing the button state
          
          this.innerHTML = '<span>All Projects Loaded</span>';
          this.classList.remove('animate-pulse');
          this.classList.add('bg-gray-700');
          this.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-500');
        }, 1500);
      } catch (error) {
        // Handle errors gracefully
        console.error('Error loading more projects:', error);
        this.innerHTML = '<span>Try Again</span>';
        this.classList.remove('animate-pulse');
        this.disabled = false;
      }
    });
  }

  /**
   * Utility function to debounce frequent events like resize
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * Lightbox/Modal functionality for viewing large images
   */
  function initLightboxFunctionality() {
    // Check if lightbox elements exist
    const lightboxExists = document.querySelector('.portfolio-lightbox');
    let lightbox;
    
    // Create lightbox if it doesn't exist
    if (!lightboxExists) {
      lightbox = createLightboxElement();
    } else {
      lightbox = lightboxExists;
    }
    
    // Add "View Large" buttons to each portfolio item
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
      // Find or create the "View Large" button
      let viewLargeBtn = item.querySelector('.view-large-btn');
      
      if (!viewLargeBtn) {
        viewLargeBtn = document.createElement('button');
        viewLargeBtn.classList.add(
          'view-large-btn', 
          'absolute', 
          'bottom-4', 
          'right-4', 
          'bg-black/70', 
          'hover:bg-cyan-600', 
          'text-white', 
          'text-sm', 
          'py-2', 
          'px-3', 
          'rounded-md', 
          'transition-all', 
          'duration-300',
          'opacity-0',
          'group-hover:opacity-100',
          'z-10'
        );
        viewLargeBtn.innerHTML = '<span>View Large</span>';
        viewLargeBtn.setAttribute('aria-label', 'View large image');
        viewLargeBtn.setAttribute('type', 'button');
        
        // Make sure the parent has relative positioning for absolute button placement
        if (!item.classList.contains('relative')) {
          item.classList.add('relative');
        }
        
        // Add hover state to parent if not already there
        if (!item.classList.contains('group')) {
          item.classList.add('group');
        }
        
        item.appendChild(viewLargeBtn);
      }
      
      // Get image source from the item
      const itemImage = item.querySelector('img');
      let imageSrc = itemImage ? itemImage.getAttribute('src') : null;
      let imageAlt = itemImage ? itemImage.getAttribute('alt') : 'Portfolio item';
      
      // If no image is found, use data attribute or background image as fallback
      if (!imageSrc) {
        imageSrc = item.getAttribute('data-image') || 
                  getComputedStyle(item).backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      }
      
      // If we still don't have a valid image, skip this item
      if (!imageSrc || imageSrc === 'none') {
        viewLargeBtn.style.display = 'none';
        return;
      }
      
      // Store image info in button data attributes
      viewLargeBtn.setAttribute('data-image', imageSrc);
      viewLargeBtn.setAttribute('data-title', item.getAttribute('data-title') || '');
      viewLargeBtn.setAttribute('data-description', item.getAttribute('data-description') || '');
      
      // Set up click event
      viewLargeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(this.getAttribute('data-image'), 
                    this.getAttribute('data-title'), 
                    this.getAttribute('data-description'));
      });
      
      // Make the entire item clickable as well (optional)
      item.addEventListener('click', function(e) {
        // Only trigger if they didn't click on the button itself
        if (e.target !== viewLargeBtn && !viewLargeBtn.contains(e.target)) {
          viewLargeBtn.click();
        }
      });
    });
    
    // Make the entire item clickable for touch devices
    if ('ontouchstart' in window) {
      portfolioItems.forEach(item => {
        item.classList.add('touch-target');
      });
    }
    
    /**
     * Create lightbox DOM element
     */
    function createLightboxElement() {
      const lightbox = document.createElement('div');
      lightbox.classList.add(
        'portfolio-lightbox', 
        'fixed', 
        'inset-0', 
        'bg-black/90', 
        'z-50', 
        'flex', 
        'items-center', 
        'justify-center', 
        'opacity-0',
        'pointer-events-none',
        'transition-opacity',
        'duration-300'
      );
      
      // Create lightbox content
      lightbox.innerHTML = `
        <div class="lightbox-container relative max-w-7xl max-h-[90vh] mx-auto p-4 flex flex-col">
          <button class="lightbox-close absolute top-2 right-2 md:top-4 md:right-4 bg-black/70 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center z-10" aria-label="Close lightbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="lightbox-content flex flex-col md:flex-row gap-4 bg-gray-900 rounded-lg overflow-hidden">
            <div class="lightbox-image-container w-full md:w-3/4 relative flex items-center justify-center">
              <img class="lightbox-image max-w-full max-h-[70vh] object-contain" src="" alt="">
              <div class="lightbox-loading absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            </div>
            <div class="lightbox-info w-full md:w-1/4 bg-gray-800 p-4 md:p-6 overflow-y-auto max-h-[30vh] md:max-h-[70vh]">
              <h3 class="lightbox-title text-xl md:text-2xl font-bold text-white mb-2"></h3>
              <p class="lightbox-description text-gray-300"></p>
            </div>
          </div>
          <div class="lightbox-nav flex justify-between mt-4">
            <button class="lightbox-prev bg-black/70 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition-colors" aria-label="Previous image">Previous</button>
            <button class="lightbox-next bg-black/70 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition-colors" aria-label="Next image">Next</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(lightbox);
      
      // Set up event listeners
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      
      // Close button
      closeBtn.addEventListener('click', closeLightbox);
      
      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      });
      
      // Background click to close
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      
      // Navigation buttons
      prevBtn.addEventListener('click', showPrevImage);
      nextBtn.addEventListener('click', showNextImage);
      
      // Arrow key navigation
      document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
          showPrevImage();
        } else if (e.key === 'ArrowRight') {
          showNextImage();
        }
      });
      
      return lightbox;
    }
    
    // Current image index for navigation
    let currentImageIndex = 0;
    let portfolioImageSources = [];
    let portfolioImageTitles = [];
    let portfolioImageDescriptions = [];
    
    /**
     * Open lightbox with image
     */
    function openLightbox(imageSrc, title, description) {
      const lightbox = document.querySelector('.portfolio-lightbox');
      const image = lightbox.querySelector('.lightbox-image');
      const loading = lightbox.querySelector('.lightbox-loading');
      const titleEl = lightbox.querySelector('.lightbox-title');
      const descriptionEl = lightbox.querySelector('.lightbox-description');
      
      // Collect all image sources for navigation
      portfolioImageSources = [];
      portfolioImageTitles = [];
      portfolioImageDescriptions = [];
      
      document.querySelectorAll('.view-large-btn').forEach(btn => {
        if (btn.style.display !== 'none') {
          portfolioImageSources.push(btn.getAttribute('data-image'));
          portfolioImageTitles.push(btn.getAttribute('data-title') || '');
          portfolioImageDescriptions.push(btn.getAttribute('data-description') || '');
        }
      });
      
      // Find current image index
      currentImageIndex = portfolioImageSources.indexOf(imageSrc);
      
      // Hide image until loaded
      image.style.opacity = '0';
      loading.style.display = 'flex';
      
      // Set content
      image.src = imageSrc;
      image.alt = title || 'Portfolio image';
      titleEl.textContent = title || '';
      descriptionEl.textContent = description || '';
      
      // Handle image load
      image.onload = function() {
        loading.style.display = 'none';
        image.style.opacity = '1';
      };
      
      image.onerror = function() {
        loading.style.display = 'none';
        image.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
        image.style.opacity = '1';
      };
      
      // Show lightbox
      lightbox.classList.add('active');
      lightbox.style.opacity = '1';
      lightbox.style.pointerEvents = 'auto';
      
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Update navigation buttons
      updateNavButtons();
    }
    
    /**
     * Close lightbox
     */
    function closeLightbox() {
      const lightbox = document.querySelector('.portfolio-lightbox');
      
      if (!lightbox) return;
      
      lightbox.classList.remove('active');
      lightbox.style.opacity = '0';
      lightbox.style.pointerEvents = 'none';
      
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
    
    /**
     * Show previous image
     */
    function showPrevImage() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        openLightbox(
          portfolioImageSources[currentImageIndex],
          portfolioImageTitles[currentImageIndex],
          portfolioImageDescriptions[currentImageIndex]
        );
      }
    }
    
    /**
     * Show next image
     */
    function showNextImage() {
      if (currentImageIndex < portfolioImageSources.length - 1) {
        currentImageIndex++;
        openLightbox(
          portfolioImageSources[currentImageIndex],
          portfolioImageTitles[currentImageIndex],
          portfolioImageDescriptions[currentImageIndex]
        );
      }
    }
    
    /**
     * Update navigation buttons state
     */
    function updateNavButtons() {
      const prevBtn = document.querySelector('.lightbox-prev');
      const nextBtn = document.querySelector('.lightbox-next');
      
      if (currentImageIndex === 0) {
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
        prevBtn.disabled = true;
      } else {
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        prevBtn.disabled = false;
      }
      
      if (currentImageIndex === portfolioImageSources.length - 1) {
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.disabled = true;
      } else {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextBtn.disabled = false;
      }
    }
  }

  /**
   * Check if ScrollTrigger is available to avoid errors
   */
  function isScrollTriggerAvailable() {
    return typeof ScrollTrigger !== 'undefined';
  }

  /**
   * Media query helper for responsive behavior
   */
  function matchesMedia(query) {
    return window.matchMedia(query).matches;
  }

  /**
   * Utility function to check for browser support
   */
  function supportsFeature(feature) {
    if (feature === 'gsap') {
      return typeof gsap !== 'undefined';
    }
    if (feature === 'scrollTrigger') {
      return typeof ScrollTrigger !== 'undefined';
    }
    return false;
  }
})();