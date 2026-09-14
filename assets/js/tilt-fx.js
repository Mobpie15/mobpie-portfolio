/**
 * Mobpie Editorial Motion & Interaction Controller
 * - Canvas Scroll Fade: Automatically fades background canvases on scroll so lower sections are 100% clean obsidian
 * - Staggered Scroll Reveals: Luxury Apple-grade IntersectionObserver entry animations
 * - Mouse Spotlight Tracker: Soft, subtle radial glare that follows cursor on cards
 */

(function() {
  'use strict';

  // 1. HERO CANVASES SCROLL FADE CONTROLLER (Eliminates clutter on scroll)
  function initCanvasScrollFade() {
    const threeCanvas = document.getElementById('three-canvas');
    const waveCanvas = document.getElementById('waveform-canvas');
    if (!threeCanvas && !waveCanvas) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const heroHeight = window.innerHeight;
          
          // Fades out between 10% and 55% scroll through hero
          const fadeStart = heroHeight * 0.10;
          const fadeEnd = heroHeight * 0.55;
          
          let opacity = 1;
          if (scrollY > fadeStart) {
            opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
          }

          const opacityStr = opacity.toFixed(3);
          if (threeCanvas) threeCanvas.style.opacity = opacityStr;
          if (waveCanvas) waveCanvas.style.opacity = opacityStr;

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. STAGGERED SCROLL REVEALS
  function initScrollReveals() {
    const targets = document.querySelectorAll(
      '.section-tag, .section-title, .section-subtitle, ' +
      '.capability-card, .why-card, .plan-card-spacious, ' +
      '.about-grid-card, .remake-showcase-box, .contact-left-card, .contact-form-card'
    );

    targets.forEach(el => {
      el.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  // 3. MOUSE SPOTLIGHT RADIAL GLARE FOR ALL CARDS
  function initSpotlightCards() {
    // Touch devices excluded to prevent sticky hover states
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll(
      '.capability-card, .why-card, .plan-card-spacious, .about-grid-card, .remake-showcase-box, .contact-left-card, .contact-form-card'
    );

    cards.forEach(card => {
      card.classList.add('spotlight-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-500px`);
        card.style.setProperty('--mouse-y', `-500px`);
      });
    });
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCanvasScrollFade();
      initScrollReveals();
      initSpotlightCards();
    });
  } else {
    initCanvasScrollFade();
    initScrollReveals();
    initSpotlightCards();
  }
})();
