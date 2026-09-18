/**
 * MOBPIE // 3D PERSPECTIVE TILT & SPECULAR GLARE ENGINE
 * Calculates real-time card rotation and moving specular reflections.
 */

(function () {
  'use strict';

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      let bounds = null;
      let rafId = null;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 120ms ease-out';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        const maxRotateX = 8.5;
        const maxRotateY = 8.5;

        const rotX = -percentY * maxRotateX;
        const rotY = percentX * maxRotateY;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
          card.style.setProperty('--glare-x', `${(mouseX / bounds.width * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${(mouseY / bounds.height * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-opacity', '0.65');
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        bounds = null;
        card.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.setProperty('--glare-opacity', '0');
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltCards);
  } else {
    initTiltCards();
  }

  window.MobpieTilt = { init: initTiltCards };
})();
