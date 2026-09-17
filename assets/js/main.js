/**
 * MOBPIE // LUXURY CONTROLLER (v6.0)
 * Haute Digital Architecture
 * 
 * Features:
 * 1. Cinematic Curtain Page Load Sequence
 * 2. Live New Delhi Atomic Clock (IST UTC+5:30)
 * 3. Sticky Luxury Header Scroll Behavior
 * 4. High-Intent WhatsApp VIP Hotline Dispatcher
 * 5. Mobile Navigation Drawer & Dock ScrollSpy
 * 6. Precision Magnetic Cursor Integration
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. CINEMATIC CURTAIN REVEAL SEQUENCE
  // -------------------------------------------------------------------------
  function initLoadReveal() {
    const overlay = document.getElementById('page-reveal-overlay');
    if (!overlay) return;

    // Phase 1: Reveal monogram and brand name
    setTimeout(() => {
      overlay.classList.add('logo-visible');
    }, 100);

    // Phase 2: Wipe panel retracts
    setTimeout(() => {
      overlay.classList.add('wipe-out');
    }, 650);

    // Phase 3: Fade out overlay
    setTimeout(() => {
      overlay.classList.add('is-done');
    }, 1250);

    // Phase 4: Clean up from DOM
    setTimeout(() => {
      overlay.classList.add('is-removed');
    }, 1850);
  }

  // -------------------------------------------------------------------------
  // 2. LIVE NEW DELHI (IST UTC+5:30) CLOCK
  // -------------------------------------------------------------------------
  function initLiveClock() {
    const clockEl = document.getElementById('ist-live-clock');
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
  // 3. STICKY LUXURY HEADER SCROLL MONITOR
  // -------------------------------------------------------------------------
  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER & DOCK SCROLLSPY
  // -------------------------------------------------------------------------
  function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');

    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', () => drawer.classList.add('open'));
    }
    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
    }

    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        if (drawer) drawer.classList.remove('open');
      });
    });

    // Mobile Bottom Dock ScrollSpy
    const sections = [
      { id: 'hero', tab: 'home' },
      { id: 'works', tab: 'works' },
      { id: 'protocol', tab: 'protocol' }
    ];
    const dockBtns = document.querySelectorAll('.dock-btn:not(.dock-btn-gold)');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let activeTab = 'home';

      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && scrollPos >= el.offsetTop) {
          activeTab = s.tab;
        }
      });

      dockBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === activeTab);
      });
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 5. STRUCTURED LUXURY INQUIRY DISPATCHER
  // -------------------------------------------------------------------------
  window.handleLuxuryInquiry = function (event) {
    event.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const brand = document.getElementById('f-brand').value.trim();
    const contact = document.getElementById('f-contact').value.trim();
    const timeline = document.getElementById('f-timeline').value;
    const vision = document.getElementById('f-vision').value.trim();
    const feedback = document.getElementById('luxury-form-feedback');

    if (!name || !brand || !contact) {
      if (feedback) {
        feedback.className = 'form-feedback error font-mono';
        feedback.textContent = 'Please provide your name, brand, and contact coordinates.';
      }
      return false;
    }

    const message = `Hello Mobpie!%0A%0AMy name is ${encodeURIComponent(name)} from ${encodeURIComponent(brand)}.%0AContact: ${encodeURIComponent(contact)}%0ATimeline: ${encodeURIComponent(timeline)}%0A%0AProject Scope:%0A${encodeURIComponent(vision || 'We are interested in commissioning a 72-Hour Zero-Risk Staging Prototype.')}`;
    const waUrl = `https://wa.me/918957420306?text=${message}`;

    if (feedback) {
      feedback.className = 'form-feedback success font-mono';
      feedback.textContent = 'Connecting to Mobpie direct VIP hotline...';
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 350);

    return false;
  };

  // -------------------------------------------------------------------------
  // 6. PRECISION CURSOR EXPANSION ON SHOWCASE CARDS
  // -------------------------------------------------------------------------
  function initCursorShowcaseHover() {
    const ring = document.getElementById('cursor-ring');
    if (!ring) return;

    document.querySelectorAll('.work-visual-stage').forEach(stage => {
      stage.addEventListener('mouseenter', () => ring.classList.add('cursor-work-hover'));
      stage.addEventListener('mouseleave', () => ring.classList.remove('cursor-work-hover'));
    });
  }

  // -------------------------------------------------------------------------
  // BOOT CONTROLLER
  // -------------------------------------------------------------------------
  function boot() {
    initLoadReveal();
    initLiveClock();
    initScrollHeader();
    initMobileNav();
    initCursorShowcaseHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
