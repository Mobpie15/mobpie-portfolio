/**
 * Mobpie Portfolio Mobile Navigation Controller
 * - Slideout Drawer Toggle & Backdrop Overlay
 * - Bottom Action Dock: Tracks active viewport section via IntersectionObserver
 * - Smooth scroll & auto-close drawer on link click
 */

(function() {
  'use strict';

  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (!drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      if (toggleBtn) toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      if (toggleBtn) toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  function initBottomDockActiveTracker() {
    const dockTabs = document.querySelectorAll('.mobile-dock-tab[data-tab]');
    if (!dockTabs.length) return;

    const sections = [
      { id: 'hero', tab: 'hero' },
      { id: 'about', tab: 'hero' },
      { id: 'capabilities', tab: 'capabilities' },
      { id: 'remakes', tab: 'remakes' },
      { id: 'why-us', tab: 'capabilities' },
      { id: 'plans', tab: 'plans' },
      { id: 'contact', tab: 'whatsapp' }
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = sections.find(s => s.id === entry.target.id);
          if (match) {
            dockTabs.forEach(tab => {
              if (tab.getAttribute('data-tab') === match.tab) {
                tab.classList.add('active');
              } else {
                tab.classList.remove('active');
              }
            });
          }
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '-60px 0px -40% 0px'
    });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileDrawer();
      initBottomDockActiveTracker();
    });
  } else {
    initMobileDrawer();
    initBottomDockActiveTracker();
  }
})();
