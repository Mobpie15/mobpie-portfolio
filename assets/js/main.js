/**
 * MOBPIE // MINIMALIST MAIN CONTROLLER (v30.0)
 * - Live Atomic IST Clock (New Delhi, Asia/Kolkata)
 * - Precision Spatial Cursor (Dot & Interactive Ring)
 * - Mobile Drawer State Controller
 * - Video Performance Observer (Low-End PC Safeguard)
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. LIVE NEW DELHI IST ATOMIC CLOCK
  // -------------------------------------------------------------------------
  function initLiveClock() {
    const clockEl = document.getElementById('ist-time');
    if (!clockEl) return;

    function updateTime() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };
        const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
        clockEl.textContent = `${timeStr} IST`;
      } catch (e) {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (3600000 * 5.5));
        const hh = String(ist.getHours()).padStart(2, '0');
        const mm = String(ist.getMinutes()).padStart(2, '0');
        const ss = String(ist.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss} IST`;
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // -------------------------------------------------------------------------
  // 2. PRECISION SPATIAL CURSOR
  // -------------------------------------------------------------------------
  function initSpatialCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
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

    function renderRing() {
      requestAnimationFrame(renderRing);
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    }
    renderRing();

    // Hover Expansion on Interactive Targets
    const targets = document.querySelectorAll('a, button, .btn-spatial-primary, .btn-spatial-ghost, .btn-card-launch, .btn-wa-monolith');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }

  // -------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------------------
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    document.querySelectorAll('.d-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // -------------------------------------------------------------------------
  // 4. VIDEO PERFORMANCE OBSERVER (LOW-END PC SAFEGUARD)
  // -------------------------------------------------------------------------
  function initVideoPerformance() {
    if (!('IntersectionObserver' in window)) return;

    const videos = document.querySelectorAll('video');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.15 });

    videos.forEach(v => observer.observe(v));
  }

  // -------------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------------
  function init() {
    initLiveClock();
    initSpatialCursor();
    initMobileDrawer();
    initVideoPerformance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
