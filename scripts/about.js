// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle animation in hero section
    initParticles();
    
    // Implement smooth scrolling for navigation
    implementSmoothScroll();
    
    // Reveal animations on scroll
    initRevealOnScroll();
    
    // Set up counters for statistics
    initCounters();
});

/**
 * Initializes the particle background animation in the hero section
 */
function initParticles() {
    const particleContainer = document.getElementById('particles');
    if (!particleContainer) return;
    
    // Create a number of particles
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        
        // Set particle style
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 20 + 15}s infinite linear`;
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        particle.style.transform = 'translateZ(0)';
        
        particleContainer.appendChild(particle);
    }
    
    // Add keyframes for floating animation
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes float {
            0% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(${Math.random() * 100}px, ${Math.random() * 100}px);
            }
            50% {
                transform: translate(${Math.random() * -100}px, ${Math.random() * 100}px);
            }
            75% {
                transform: translate(${Math.random() * -100}px, ${Math.random() * -100}px);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        
        .gradient-text {
            background: linear-gradient(90deg, #4f46e5, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #4f46e5, #8b5cf6);
        }
        
        .card-shadow {
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.1);
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 1.5s forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Implements smooth scrolling for any anchor links
 */
function implementSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero scroll down button functionality
    const scrollButton = document.querySelector('.animate-bounce');
    if (scrollButton) {
        scrollButton.addEventListener('click', function() {
            const nextSection = document.querySelector('section:nth-child(2)');
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth' 
                });
            }
        });
        
        // Make the button clickable
        scrollButton.style.cursor = 'pointer';
    }
}

/**
 * Creates reveal animation effect for elements as they come into view
 */
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });
    
    revealElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        element.style.transform = "translateY(40px)";
        revealObserver.observe(element);
    });
    
    // Style for revealed elements
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Initializes counters with animation for statistics
 */
function initCounters() {
    // For the years counter in hero section
    const yearsCounter = document.getElementById('counter-years');
    if (yearsCounter) {
        const counterSpan = yearsCounter.querySelector('span');
        if (counterSpan) {
            const targetValue = 9; // Current years of experience
            const startYear = 2016;
            const currentYear = new Date().getFullYear();
            const actualYears = currentYear - startYear;
            
            // Update the counter text and the years text below it
            counterSpan.textContent = '0';
            
            // Animate the counter
            let currentValue = 0;
            const duration = 2000; // 2 seconds
            const stepTime = 50; // Update every 50ms
            const steps = duration / stepTime;
            const increment = targetValue / steps;
            
            const counterInterval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= actualYears) {
                    currentValue = actualYears;
                    clearInterval(counterInterval);
                    
                    // Update the "Years of Experience" text
                    const yearsText = yearsCounter.nextElementSibling;
                    if (yearsText && yearsText.querySelector('p:nth-child(2)')) {
                        yearsText.querySelector('p:nth-child(2)').textContent = `Since ${startYear}`;
                    }
                }
                counterSpan.textContent = Math.round(currentValue);
            }, stepTime);
        }
    }
}

// Add event listener for mobile menu toggle if there's a mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Enhance testimonial section with simple carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonials-section .grid > div');
    if (testimonials.length > 3) {
        let currentIndex = 0;
        
        // Create navigation buttons
        const testimonialsSection = document.querySelector('.testimonials-section .grid');
        
        if (testimonialsSection) {
            const navContainer = document.createElement('div');
            navContainer.className = 'flex justify-center mt-8 space-x-2';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors';
            prevButton.innerHTML = 'Previous';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors';
            nextButton.innerHTML = 'Next';
            
            navContainer.appendChild(prevButton);
            navContainer.appendChild(nextButton);
            
            testimonialsSection.parentNode.appendChild(navContainer);
            
            // Handle navigation
            nextButton.addEventListener('click', function() {
                showTestimonials((currentIndex + 1) % testimonialsSection.children.length);
            });
            
            prevButton.addEventListener('click', function() {
                showTestimonials((currentIndex - 1 + testimonialsSection.children.length) % testimonialsSection.children.length);
            });
            
            function showTestimonials(index) {
                currentIndex = index;
                
                testimonials.forEach((testimonial, i) => {
                    testimonial.style.display = 'none';
                });
                
                // Show 3 testimonials starting from the current index
                for (let i = 0; i < 3; i++) {
                    const idx = (currentIndex + i) % testimonials.length;
                    testimonials[idx].style.display = 'block';
                }
            }
            
            // Initialize
            showTestimonials(0);
        }
    }
});