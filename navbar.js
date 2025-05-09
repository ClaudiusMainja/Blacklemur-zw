document.addEventListener('DOMContentLoaded', () => {
    // GSAP animations
    gsap.from('.nav-link-effect', {
      opacity: 0,
      y: -10,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power1.out',
      delay: 0.2
    });
    
    gsap.from('.inquiry-link', {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.8
    });
    
    // Intersection Observer for scroll effects
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        if (st > 100) {
          navbar.classList.add('shadow-md');
          if (st > lastScrollTop) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
          } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
          }
        } else {
          navbar.classList.remove('shadow-md');
          navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
        scrollTimeout = null;
      }, 100); // Adjust the timeout value as needed
    });

    // Function to create particle effects
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        const colors = ['#6366f1', '#8b5cf6', '#d946ef'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 5 + 1;
            
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
            
            // Animate each particle
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                duration: Math.random() * 20 + 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    // Initialize particle effects
    createParticles();

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // Animation duration in milliseconds
            once: false,   // Whether animation should happen only once while scrolling down
            mirror: true   // Whether elements should animate out while scrolling past them
        });
    }

    // Reusable animation function
    function applyAnimation(elements, animationProps, delayMultiplier = 0) {
        elements.forEach((el, index) => {
            gsap.to(el, {
                ...animationProps,
                delay: index * delayMultiplier
            });
        });
    }

    // Floating animation for service icons
    const floatingElements = document.querySelectorAll('.float-animation');
    applyAnimation(floatingElements, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    }, 0.3);

    // Social icons animation
    const socialIcons = document.querySelectorAll('.social-icon');
    applyAnimation(socialIcons, {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    }, 0.2);

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            // Simulate form submission
            newsletterMessage.textContent = 'Subscribing...';
            newsletterMessage.className = 'mt-2 text-sm text-yellow-400';
            
            // Simulate API call
            setTimeout(() => {
                const isSuccess = Math.random() > 0.2; // Simulate 80% success rate
                if (isSuccess) {
                    newsletterMessage.textContent = 'Thank you for subscribing to our newsletter!';
                    newsletterMessage.className = 'mt-2 text-sm text-green-400';
                    emailInput.value = '';
                } else {
                    newsletterMessage.textContent = 'Failed to subscribe. Please try again later.';
                    newsletterMessage.className = 'mt-2 text-sm text-red-400';
                }
            }, 1500);
        });
    }

    // Service selector functionality
    const serviceButtons = document.querySelectorAll('.service-btn');
    const requestServiceBtn = document.getElementById('request-service');
    let selectedServices = [];
    
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            
            if (this.classList.contains('bg-indigo-600')) {
                // Remove service
                this.classList.remove('bg-indigo-600');
                this.classList.add('bg-white/10');
                selectedServices = selectedServices.filter(s => s !== service);
            } else {
                // Add service
                this.classList.remove('bg-white/10');
                this.classList.add('bg-indigo-600');
                selectedServices.push(service);
            }
            
            // Enable/disable request button
            if (selectedServices.length > 0) {
                requestServiceBtn.removeAttribute('disabled');
            } else {
                requestServiceBtn.setAttribute('disabled', 'disabled');
            }
        });
    });
    
    if (requestServiceBtn) {
        requestServiceBtn.addEventListener('click', function() {
            if (selectedServices.length > 0) {
                // Simulate service request - in production, this would redirect to a contact form
                alert('You selected: ' + selectedServices.join(', ') + '\nWe will contact you about these services!');
                
                // Reset selection
                serviceButtons.forEach(btn => {
                    btn.classList.remove('bg-indigo-600');
                    btn.classList.add('bg-white/10');
                });
                selectedServices = [];
                requestServiceBtn.setAttribute('disabled', 'disabled');
            }
        });
    }

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        let backToTopScrollTimeout;
        window.addEventListener('scroll', () => {
            if (backToTopScrollTimeout) return;

            backToTopScrollTimeout = setTimeout(() => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.remove('opacity-0', 'invisible');
                    backToTopButton.classList.add('opacity-100', 'visible');
                } else {
                    backToTopButton.classList.remove('opacity-100', 'visible');
                    backToTopButton.classList.add('opacity-0', 'invisible');
                }
                backToTopScrollTimeout = null;
            }, 100); // Adjust debounce delay as needed
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Service items hover animation
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                x: 5,
                duration: 0.3,
                ease: "power1.out"
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                duration: 0.3,
                ease: "power1.out"
            });
        });

        // Add touch interaction fallback
        item.addEventListener('touchstart', function() {
            gsap.to(this, {
                x: 5,
                duration: 0.3,
                ease: "power1.out"
            });
        });

        item.addEventListener('touchend', function() {
            gsap.to(this, {
                x: 0,
                duration: 0.3,
                ease: "power1.out"
            });
        });
    });
});