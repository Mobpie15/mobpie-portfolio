/**
 * MOBPIE // MAGNETIC VELOCITY CURSOR ENGINE
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

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }

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

  function renderCursor() {
    if (isVisible) {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      ringX += dx * 0.18;
      ringY += dy * 0.18;

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(dist * 0.002, 0.35);
      const scaleX = ringScale * (1 + stretch);
      const scaleY = ringScale * (1 - stretch);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function setCursorMode(mode, text = '') {
    ring.setAttribute('data-mode', mode);
    if (label) {
      label.textContent = text;
      label.style.opacity = text ? '1' : '0';
    }

    if (mode === 'view') {
      ringScale = 2.4;
    } else if (mode === 'pointer') {
      ringScale = 1.3;
    } else {
      ringScale = 1;
    }
  }

  document.addEventListener('mouseover', function (e) {
    const target = e.target;

    const viewTarget = target.closest('[data-cursor="view"]');
    if (viewTarget) {
      setCursorMode('view', 'VIEW');
      if (window.MobpieAudio) window.MobpieAudio.playHover(2600);
      return;
    }

    const clickable = target.closest('a, button, input, select, textarea, .estimator-scope-item');
    if (clickable) {
      setCursorMode('pointer', '');
      if (window.MobpieAudio) window.MobpieAudio.playHover(2200);
      return;
    }

    setCursorMode('default', '');
  });

  document.addEventListener('mouseout', function (e) {
    const related = e.relatedTarget;
    if (!related || !related.closest('a, button, [data-cursor="view"]')) {
      setCursorMode('default', '');
    }
  });
})();
