/**
 * Mobpie Cyber Magnetic Cursor Engine
 * - Smooth 2-tier cursor: precision laser dot + fluid trailing lag ring
 * - Transforms to large "EXPLORE" badge over browser demo frames
 * - Magnetic suction on links, buttons, and interactive CTA pills
 * - Automatically skipped on touch/mobile devices
 */

(function () {
  'use strict';

  // Strictly skip touch devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Use existing DOM elements or create if missing
  let dot = document.getElementById('cursor-dot') || document.getElementById('cyber-cursor-dot');
  let ring = document.getElementById('cursor-ring') || document.getElementById('cyber-cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.className = 'cyber-cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.className = 'cyber-cursor-ring';
    const badge = document.createElement('span');
    badge.className = 'cursor-badge-text font-mono';
    badge.textContent = 'EXPLORE';
    ring.appendChild(badge);
    document.body.appendChild(ring);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
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

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
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
      ringX += (targetCenterX - ringX) * 0.24;
      ringY += (targetCenterY - ringY) * 0.24;
    } else {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
    }

    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
  }
  renderCursor();

  // Attach magnetic hover events
  function initHoverListeners() {
    const interactives = document.querySelectorAll(
      'a, button, .btn-primary-volt, .btn-secondary-ghost, .hud-cta-btn, .btn-whatsapp-direct, .btn-card-action, .physics-token, .cat-pill, .sprint-pill, .cmd-item, .sound-toggle-btn'
    );

    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-hover');
        if (el.classList.contains('btn-primary-volt') || el.classList.contains('hud-cta-btn') || el.classList.contains('btn-whatsapp-direct')) {
          magneticTarget = el;
        }
      });

      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-hover');
        magneticTarget = null;
      });
    });

    // Special "DRAG" state for sandbox playground and weapon preview stages
    const dragStages = document.querySelectorAll('.sandbox-canvas-area, .weapon-preview-stage, .circular-mask-stage');
    dragStages.forEach(demo => {
      demo.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-work-hover');
      });
      demo.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-work-hover');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoverListeners);
  } else {
    initHoverListeners();
  }
})();
