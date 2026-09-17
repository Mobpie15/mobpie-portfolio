/**
 * MOBPIE ATELIER // KINETIC CORE (v20.0)
 * Quiet Luxury & Precision Engineering
 * - Live Atomic IST Clock (New Delhi, Asia/Kolkata)
 * - Minimalist Precision Cursor (Dual-Tier Dot & Halo)
 * - Navigation Scroll Elevation & Blur
 * - Mobile Drawer State Controller
 * - Direct Concierge Brief Dispatcher via WhatsApp
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
  // 2. MINIMALIST PRECISION CURSOR
  // -------------------------------------------------------------------------
  function initPrecisionCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const halo = document.getElementById('cursor-halo');
    if (!dot || !halo) return;

    let mouseX = -100;
    let mouseY = -100;
    let haloX = -100;
    let haloY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        halo.style.opacity = '1';
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      halo.style.opacity = '0';
    });

    function renderHalo() {
      requestAnimationFrame(renderHalo);
      haloX += (mouseX - haloX) * 0.18;
      haloY += (mouseY - haloY) * 0.18;
      halo.style.transform = `translate3d(${haloX.toFixed(2)}px, ${haloY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    }
    renderHalo();

    // Hover Magnification on Interactive Elements
    const targets = document.querySelectorAll('a, button, input, select, textarea, .btn-gold-primary, .btn-ghost-secondary, .btn-folio-launch');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => halo.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => halo.classList.remove('cursor-hover'));
    });
  }

  // -------------------------------------------------------------------------
  // 3. NAVIGATION SCROLL ELEVATION
  // -------------------------------------------------------------------------
  function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------------------
  function initMobileDrawer() {
    const openBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-close-btn');
    const drawer = document.getElementById('mobile-nav-panel');
    if (!openBtn || !drawer) return;

    openBtn.addEventListener('click', () => {
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

    document.querySelectorAll('.m-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // -------------------------------------------------------------------------
  // 5. RAPID INQUIRY & WHATSAPP DISPATCHER
  // -------------------------------------------------------------------------
  window.handleInquirySubmit = function (event) {
    event.preventDefault();

    const name = document.getElementById('founder-name')?.value.trim();
    const brand = document.getElementById('brand-name')?.value.trim();
    const contact = document.getElementById('founder-contact')?.value.trim();
    const cadence = document.getElementById('sprint-cadence')?.value || '72h';
    const vision = document.getElementById('brand-vision')?.value.trim() || 'Not specified';
    const feedback = document.getElementById('form-feedback');

    if (!name || !brand || !contact) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please provide your name, brand, and contact information.';
      }
      return;
    }

    const cadenceText = cadence === '72h'
      ? '72-Hour Rapid Prototype (Proof-First / ₹0 Risk)'
      : cadence === '30d'
        ? '30-Day Full Production Launch'
        : 'Concept Architecture Exploration';

    const message = `Hello Mobpie!%0A%0AI would like to commission a digital flagship for my brand:%0A%0A• Founder: ${encodeURIComponent(name)}%0A• Brand: ${encodeURIComponent(brand)}%0A• Contact: ${encodeURIComponent(contact)}%0A• Timeline: ${encodeURIComponent(cadenceText)}%0A• Vision / URL: ${encodeURIComponent(vision)}%0A%0ALet's schedule the 1:1 briefing and initiate the private staging sprint.`;

    const waUrl = `https://wa.me/918957420306?text=${message}`;

    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Brief compiled. Opening VIP WhatsApp Hotline...';
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
      event.target.reset();
    }, 600);
  };

  // -------------------------------------------------------------------------
  // 6. VIDEO PERFORMANCE OBSERVER (LOW-END PC SAFEGUARD)
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
    initPrecisionCursor();
    initNavScroll();
    initMobileDrawer();
    initVideoPerformance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
