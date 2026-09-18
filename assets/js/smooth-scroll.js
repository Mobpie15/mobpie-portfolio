/**
 * MOBPIE // BUTTER-SMOOTH INERTIAL SCROLL ENGINE
 * Lightweight, hardware-optimized smooth scroll with momentum physics.
 * Low CPU/RAM footprint, native touch preservation on mobile.
 */

(function () {
  'use strict';

  // Check if reduced motion or touch device
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReduced) {
    // Enable standard native smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }

  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  let targetScroll = currentScroll;
  let isRunning = false;
  const ease = 0.085; // Damping lerp factor

  function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  function onWheel(e) {
    // If a modal or scrollable drawer is open, let it scroll naturally
    if (e.target.closest('.modal-body') || e.target.closest('.mobile-drawer') || e.target.closest('[data-lenis-prevent]')) {
      return;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const delta = e.deltaY * 1.15;
    targetScroll = clamp(targetScroll + delta, 0, maxScroll);

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(updateScroll);
    }
  }

  function updateScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = clamp(targetScroll, 0, maxScroll);

    const diff = targetScroll - currentScroll;
    currentScroll += diff * ease;

    if (Math.abs(diff) < 0.5) {
      currentScroll = targetScroll;
      window.scrollTo(0, currentScroll);
      isRunning = false;
      return;
    }

    window.scrollTo(0, currentScroll);
    requestAnimationFrame(updateScroll);
  }

  // Smooth programmatic scroll for anchors
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href === '#' || href.length <= 1) return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    const targetOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = clamp(targetOffset, 0, maxScroll);

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(updateScroll);
    }
  });

  // Sync scroll position on native events (e.g. resize, tab switch)
  window.addEventListener('scroll', function () {
    if (!isRunning) {
      currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      targetScroll = currentScroll;
    }
  }, { passive: true });

  window.addEventListener('wheel', onWheel, { passive: false });

  window.MobpieScroll = {
    scrollTo: function (offset) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = clamp(offset, 0, maxScroll);
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(updateScroll);
      }
    }
  };
})();
