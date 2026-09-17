/**
 * Mobpie Cyber Magnetic Cursor Engine
 * - Smooth 2-tier cursor: 4px precision laser dot + fluid trailing lag ring
 * - Native mix-blend-mode: difference for ultra-crisp luxury contrast
 * - Magnetic suction on links, buttons, and demo preview frames
 * - Excludes touch / mobile devices automatically
 */

(function () {
  'use strict';

  // Strictly skip mobile/touch devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Create Cursor DOM Elements
  const dot = document.createElement('div');
  dot.id = 'cyber-cursor-dot';
  dot.className = 'cyber-cursor-dot';

  const ring = document.createElement('div');
  ring.id = 'cyber-cursor-ring';
  ring.className = 'cyber-cursor-ring';

  const badge = document.createElement('span');
  badge.className = 'cursor-badge-text';
  badge.textContent = 'EXPLORE';
  ring.appendChild(badge);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovering = false;
  let isDemoHover = false;
  let magneticTarget = null;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Smooth trailing spring loop for ring
  function renderCursor() {
    requestAnimationFrame(renderCursor);

    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      // Pull toward center of button
      ringX += (targetCenterX - ringX) * 0.22;
      ringY += (targetCenterY - ringY) * 0.22;
    } else {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
    }

    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
  }
  renderCursor();

  // Attach magnetic hover events
  function initHoverListeners() {
    const interactives = document.querySelectorAll(
      'a, button, .sound-toggle-btn, .top-pill-link, .hero-scroll-link, .hero-wa-pill, .btn-live-primary, .channel-card'
    );

    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-hover');
        if (el.classList.contains('hero-wa-pill') || el.classList.contains('btn-live-primary') || el.classList.contains('top-pill-link')) {
          magneticTarget = el;
        }
      });

      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-hover');
        magneticTarget = null;
      });
    });

    // Special state for live demo frames
    const demoScreens = document.querySelectorAll('.browser-viewport-screen');
    demoScreens.forEach(demo => {
      demo.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-demo-hover');
      });
      demo.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-demo-hover');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoverListeners);
  } else {
    initHoverListeners();
  }
})();
