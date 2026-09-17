/**
 * Mobpie Editorial Motion & Physics Engine
 * - 3D Gyroscopic Card Tilt: Smooth physics-based tilt for Mac browser frames & cards
 * - Dynamic Specular Glare: Real-time radial spotlight tracking cursor across glass surfaces
 * - Animated Metric Counters: Smooth ease-out counter interpolation on scroll
 * - Audio-Reactive Avatar Pulse: Live ambient aura modulation synchronized with music
 * - Canvas Scroll Fade: Auto-dims background canvases cleanly when scrolling past hero
 * - Staggered Scroll Reveals: Editorial Apple-grade entry transitions
 */

(function () {
  'use strict';

  // 1. HERO CANVASES SCROLL FADE CONTROLLER
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

          // Fades out between 15% and 65% scroll through hero
          const fadeStart = heroHeight * 0.15;
          const fadeEnd = heroHeight * 0.65;

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

    targets.forEach((el, idx) => {
      el.classList.add('reveal-on-scroll');
      el.style.setProperty('--reveal-delay', `${(idx % 4) * 0.08}s`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  // 3. 3D GYROSCOPIC TILT & SPECULAR GLARE
  function init3DCardTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.browser-mockup-frame, .capability-card, .why-card');

    cards.forEach(card => {
      let isHovered = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let animId = null;

      const maxTilt = card.classList.contains('browser-mockup-frame') ? 6 : 9;

      function updateTilt() {
        if (!isHovered && Math.abs(currentRotX) < 0.01 && Math.abs(currentRotY) < 0.01) {
          card.style.transform = '';
          animId = null;
          return;
        }

        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(8px)`;

        animId = requestAnimationFrame(updateTilt);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Specular glare coords
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Normalized tilt (-1 to +1)
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetRotX = -normY * maxTilt;
        targetRotY = normX * maxTilt;

        if (!animId) {
          isHovered = true;
          animId = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        card.style.setProperty('--mouse-x', `-500px`);
        card.style.setProperty('--mouse-y', `-500px`);
      });
    });
  }

  // 4. MOUSE SPOTLIGHT FOR REMAINING CARDS
  function initSpotlightCards() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = document.querySelectorAll(
      '.about-grid-card, .contact-left-card, .contact-form-card, .remake-showcase-box'
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

  // 5. ANIMATED METRIC COUNTERS
  function initMetricCounters() {
    const counterElements = document.querySelectorAll('.stat-counter');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = targetVal % 1 !== 0;
          const duration = 1400; // ms
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = targetVal * ease;

            el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${targetVal}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  // 6. AUDIO-REACTIVE AVATAR AURA CONTROLLER
  function initAudioAvatarPulse() {
    const avatarGlow = document.querySelector('.hero-ambient-glow');
    const avatarFrame = document.getElementById('hero-avatar-frame');
    if (!avatarGlow && !avatarFrame) return;

    let smoothedBass = 0;

    function pulseLoop() {
      requestAnimationFrame(pulseLoop);

      const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, energy: 0, isPlaying: false };
      const targetBass = audio.isPlaying ? audio.bass : 0;
      smoothedBass += (targetBass - smoothedBass) * 0.2;

      if (avatarGlow) {
        const scale = 1.0 + smoothedBass * 0.35;
        const opacity = 0.55 + smoothedBass * 0.45;
        avatarGlow.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        avatarGlow.style.opacity = opacity.toFixed(3);
      }

      if (avatarFrame && audio.isPlaying) {
        const lift = -(smoothedBass * 6.0);
        avatarFrame.style.transform = `translateY(${lift.toFixed(1)}px)`;
      } else if (avatarFrame) {
        avatarFrame.style.transform = '';
      }
    }

    pulseLoop();
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCanvasScrollFade();
      initScrollReveals();
      init3DCardTilt();
      initSpotlightCards();
      initMetricCounters();
      initAudioAvatarPulse();
    });
  } else {
    initCanvasScrollFade();
    initScrollReveals();
    init3DCardTilt();
    initSpotlightCards();
    initMetricCounters();
    initAudioAvatarPulse();
  }
})();
