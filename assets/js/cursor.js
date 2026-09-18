/**
 * MOBPIE // MAGNETIC VELOCITY CURSOR ENGINE
 * Dual-node precision cursor with velocity stretching, magnetic snapping,
 * and contextual hover modes.
 */

(function () {
  'use strict';

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = ring ? ring.querySelector('.cursor-label') : null;

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let ringScale = 1;
  let isVisible = false;
  let currentMode = 'default';

  // Mouse move tracker
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }

    // Instant dot movement
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    isVisible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  window.addEventListener('mouseenter', function () {
    isVisible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Physics animation loop for smooth trailing ring
  function renderCursor() {
    if (isVisible) {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Lerp positioning
      ringX += dx * 0.18;
      ringY += dy * 0.18;

      // Velocity stretching
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(dist * 0.002, 0.35);
      const scaleX = ringScale * (1 + stretch);
      const scaleY = ringScale * (1 - stretch);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Contextual Hover Modes
  function setCursorMode(mode, text = '') {
    currentMode = mode;
    ring.setAttribute('data-mode', mode);

    if (label) {
      label.textContent = text;
      label.style.opacity = text ? '1' : '0';
    }

    if (mode === 'drag') {
      ringScale = 2.2;
    } else if (mode === 'view') {
      ringScale = 2.0;
    } else if (mode === 'pointer') {
      ringScale = 1.4;
    } else if (mode === 'copy') {
      ringScale = 1.8;
    } else {
      ringScale = 1;
    }
  }

  // Hover detection delegation
  document.addEventListener('mouseover', function (e) {
    const target = e.target;

    const dragTarget = target.closest('[data-cursor="drag"]') || target.closest('#hero-canvas-container');
    if (dragTarget) {
      setCursorMode('drag', 'DRAG 3D');
      if (window.MobpieAudio) window.MobpieAudio.playHover(3000);
      return;
    }

    const viewTarget = target.closest('[data-cursor="view"]');
    if (viewTarget) {
      setCursorMode('view', 'VIEW');
      if (window.MobpieAudio) window.MobpieAudio.playHover(2600);
      return;
    }

    const copyTarget = target.closest('[data-cursor="copy"]');
    if (copyTarget) {
      setCursorMode('copy', 'COPY');
      if (window.MobpieAudio) window.MobpieAudio.playHover(2800);
      return;
    }

    const clickable = target.closest('a, button, input, select, textarea, [data-cursor="pointer"]');
    if (clickable) {
      setCursorMode('pointer', '');
      if (window.MobpieAudio) window.MobpieAudio.playHover(2400);
      return;
    }

    setCursorMode('default', '');
  });

  document.addEventListener('mouseout', function (e) {
    const related = e.relatedTarget;
    if (!related || !related.closest('a, button, input, select, [data-cursor]')) {
      setCursorMode('default', '');
    }
  });

  // Click pulse animation
  document.addEventListener('mousedown', function () {
    ring.classList.add('cursor-active');
  });

  document.addEventListener('mouseup', function () {
    ring.classList.remove('cursor-active');
  });
})();
