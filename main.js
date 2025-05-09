
// Hero section text animation and 3D tilt effect

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Typed text effect
  const textElement = document.getElementById('typed-text');
  const textList = [
    'Social Media Marketing',
    'Website Development',
    'Brand Design',
    'SEO & Analytics',
    'Content Creation'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeText() {
    const currentText = textList[textIndex];
    
    if (isDeleting) {
      // Remove character
      textElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Add character
      textElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at end
    }
    
    // If deletion is complete
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textList.length;
    }
    
    setTimeout(typeText, typingSpeed);
  }
  
  // Start the typing animation
  typeText();
  
  // Initialize 3D tilt effect for hero image
  const heroImage = document.getElementById('hero-image-container');
  
  if (heroImage) {
    heroImage.addEventListener('mousemove', function(e) {
      const rect = heroImage.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      // Calculate rotation based on mouse position
      const xRotation = (y - rect.height / 2) / 20;
      const yRotation = (rect.width / 2 - x) / 20;
      
      // Apply transformation
      heroImage.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });
    
    // Reset transform when mouse leaves
    heroImage.addEventListener('mouseleave', function() {
      heroImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
  
  // Animate floating elements
  const floatingElements = document.querySelectorAll('.floating-element');
  floatingElements.forEach(element => {
    setInterval(() => {
      element.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    }, 1500);
  });
  
  // Services carousel animation
  const carousel = document.querySelector('.services-carousel');
  if (carousel) {
    const track = carousel.querySelector('.services-track');
    const pills = track.querySelectorAll('.service-pill');
    
    // Clone pills for infinite scrolling
    pills.forEach(pill => {
      const clone = pill.cloneNode(true);
      track.appendChild(clone);
    });
    
    // Start animation
    let position = 0;
    function animateCarousel() {
      position -= 1;
      
      // Reset position when needed
      if (position <= -1500) {
        position = 0;
      }
      
      track.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animateCarousel);
    }
    
    animateCarousel();
  }
  
  // Initialize service card hover effects
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0px)';
      this.style.boxShadow = 'none';
    });
  });
  
  // Initialize particles.js for background effects
  if (typeof particlesJS !== 'undefined') {
    // Hero section particles
    particlesJS('hero-particles', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#8B5CF6",
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        }
      }
    });
    
    // Services section particles
    particlesJS('services-particles', {
      particles: {
        number: { value: 40, density: { enable: true, value_area: 1000 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.1, random: true },
        size: { value: 2, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a78bfa",
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          out_mode: "out"
        }
      }
    });
  } else {
    console.log("particles.js not loaded");
  }
  
  // Initialize AOS (Animate on Scroll) library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false
    });
  }
  
  // Connection dots animation
  const dots = document.querySelectorAll('.connection-dot');
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      // Different animation for each dot
      const delay = index * 500;
      setInterval(() => {
        dot.animate([
          { transform: 'scale(1)', opacity: 0.7 },
          { transform: 'scale(1.5)', opacity: 1 },
          { transform: 'scale(1)', opacity: 0.7 }
        ], {
          duration: 2000,
          delay: delay,
          iterations: 1
        });
      }, 3000);
    });
  }
});



// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
  // Particles.js configuration
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 20,
          "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": "#ffffff" },
        "shape": {
          "type": "circle",
          "stroke": { "width": 0, "color": "#000000" },
          "polygon": { "nb_sides": 5 }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
          "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
          "repulse": { "distance": 200, "duration": 0.4 },
          "push": { "particles_nb": 4 },
          "remove": { "particles_nb": 2 }
        }
      },
      "retina_detect": true
    });
  }
  
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
  
  // Partners carousel animation
  const partnersTrack = document.querySelector('.partners-track');
  if (partnersTrack) {
    // Clone the partners track for infinite scrolling
    const clonedTrack = partnersTrack.cloneNode(true);
    document.querySelector('.partners-carousel').appendChild(clonedTrack);
    
    // Animate the carousel
    function animateCarousel() {
      const tracks = document.querySelectorAll('.partners-track');
      
      // Reset position when first track moves out of view
      if (parseFloat(getComputedStyle(tracks[0]).marginLeft) <= -tracks[0].offsetWidth) {
        tracks[0].style.marginLeft = '0px';
        tracks[1].style.marginLeft = '0px';
      }
      
      // Move both tracks at the same rate
      tracks.forEach(track => {
        const currentMargin = parseFloat(getComputedStyle(track).marginLeft) || 0;
        track.style.marginLeft = (currentMargin - 0.5) + 'px';
      });
      
      requestAnimationFrame(animateCarousel);
    }
    
    // Start the animation
    animateCarousel();
    
    // Pause animation on hover
    const carousel = document.querySelector('.partners-carousel');
    let isAnimating = true;
    
    carousel.addEventListener('mouseenter', () => {
      isAnimating = false;
    });
    
    carousel.addEventListener('mouseleave', () => {
      isAnimating = true;
      if (isAnimating) {
        animateCarousel();
      }
    });
  }
  
  // Portfolio card hover effects
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('img').style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        card.querySelector('img').style.transform = 'scale(1)';
      }, 300);
    });
  });
  
  // Service card hover animation
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('shadow-lg');
      card.classList.add('shadow-indigo-500/20');
      card.classList.add('transform');
      card.classList.add('translate-y-[-5px]');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('shadow-lg');
      card.classList.remove('shadow-indigo-500/20');
      card.classList.remove('transform');
      card.classList.remove('translate-y-[-5px]');
    });
  });
});

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
