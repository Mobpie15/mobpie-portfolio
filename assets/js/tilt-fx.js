/**
 * Mobpie Editorial Motion & Physics Engine
 * - 3D Gyroscopic Card Tilt: Smooth physics-based tilt for Mac browser frames & cards
 * - Dynamic Specular Glare: Real-time radial spotlight tracking cursor across glass surfaces
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
      '.section-header-block, .matrix-card, .showcase-card, ' +
      '.sandbox-window, .protocol-card, .calculator-card, ' +
      '.contact-hotline-card, .contact-form-card'
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

    const cards = document.querySelectorAll('.browser-mockup-frame, .matrix-card, .protocol-card, .telemetry-card');

    cards.forEach(card => {
      let isHovered = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let animId = null;

      const maxTilt = card.classList.contains('browser-mockup-frame') ? 5 : 7;

      function updateTilt() {
        if (!isHovered && Math.abs(currentRotX) < 0.01 && Math.abs(currentRotY) < 0.01) {
          card.style.transform = '';
          animId = null;
          return;
        }

        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(6px)`;

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

  // 4. AUDIO-REACTIVE AVATAR AURA CONTROLLER
  function initAudioAvatarPulse() {
    const avatarGlow = document.querySelector('.hero-center-halo');
    if (!avatarGlow) return;

    let smoothedBass = 0;

    function pulseLoop() {
      requestAnimationFrame(pulseLoop);

      const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, energy: 0, isPlaying: false };
      const targetBass = audio.isPlaying ? audio.bass : 0;
      smoothedBass += (targetBass - smoothedBass) * 0.2;

      if (avatarGlow) {
        const scale = 1.0 + smoothedBass * 0.3;
        const opacity = 0.5 + smoothedBass * 0.5;
        avatarGlow.style.transform = `scale(${scale.toFixed(3)})`;
        avatarGlow.style.opacity = opacity.toFixed(3);
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
      initAudioAvatarPulse();
    });
  } else {
    initCanvasScrollFade();
    initScrollReveals();
    init3DCardTilt();
    initAudioAvatarPulse();
  }
})();
