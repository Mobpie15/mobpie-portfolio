/**
 * MOBPIE // AWWWARDS MASTERPIECE CONTROLLER (v40.0)
 * Features:
 * 1. Synthesized Web Audio API Micro-Haptics (Sub-Bass Resonance & Glass Click)
 * 2. Live Atomic IST Clock (New Delhi, Asia/Kolkata)
 * 3. Pinned Horizon Project Theater Controller (Crossfade + Real-Time 3D Morph Dispatch)
 * 4. Precision Spatial Cursor with Interactive Orbit State
 * 5. Mobile Drawer Controller
 * 6. Video Performance Observer (Low-End PC Safeguard)
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. SYNTHESIZED WEB AUDIO API MICRO-HAPTICS
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSubBass() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Audio fallback
    }
  }

  function playGlassClick() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Audio fallback
    }
  }

  window.toggleSoundAura = function () {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    const soundText = document.getElementById('sound-toggle-text');
    if (soundText) {
      soundText.textContent = isSoundEnabled ? 'SOUND [ON]' : 'SOUND [OFF]';
    }
    if (isSoundEnabled) playGlassClick();
  };

  // -------------------------------------------------------------------------
  // 2. LIVE NEW DELHI IST ATOMIC CLOCK
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
  // 3. PINNED HORIZON PROJECT THEATER CONTROLLER
  // -------------------------------------------------------------------------
  const PROJECTS_DATA = [
    {
      id: 'atelier',
      index: '01 / 04',
      badge: '60 FPS WEBGL &bull; THREE.JS',
      domain: 'HAUTE COUTURE 3D',
      title: 'Atelier Ora &bull; 3D Garment Studio & Logistics ERP',
      narrative: 'Proprietary Three.js 3D garment inspection with 360° orbit, real-time colorway switching, fabric drape physics simulation, mobile checkout, and an independent Patron & Inventory Management ERP.',
      specs: ['Three.js WebGL', 'Sub-340ms Edge', 'Zero Plugin Tax', 'Stripe Webhooks'],
      video: 'assets/videos/mouse-4-650.webm',
      launchUrl: 'https://fashion-brand-dun.vercel.app',
      launchText: 'LAUNCH 3D ATELIER',
      secondaryUrl: 'https://fashion-brand-dun.vercel.app/admin.html',
      secondaryText: 'INSPECT ADMIN ERP'
    },
    {
      id: 'amazon',
      index: '02 / 04',
      badge: 'EDITORIAL COMMERCE',
      domain: 'ENTERPRISE REDESIGN',
      title: 'Amazon Luxury &bull; High-Ticket Retail Reimagination',
      narrative: 'Transforms cluttered mass-market retail into an editorial luxury shopping destination. Zero-reload instantaneous category filtering, Swiss architectural typography, and seamless single-stream checkout.',
      specs: ['Swiss Grid Typography', 'Zero-Reload State', 'Sub-Second Conversion'],
      video: 'assets/videos/sliders-7-650.webm',
      launchUrl: 'https://amazon-redesign-five.vercel.app',
      launchText: 'INSPECT FLAGSHIP',
      secondaryUrl: null,
      secondaryText: null
    },
    {
      id: 'piebot',
      index: '03 / 04',
      badge: '18MS INTERNAL DISPATCH',
      domain: 'SYSTEM AUTOMATION',
      title: 'Piebot Engine &bull; WebSocket Infrastructure Core',
      narrative: 'Autonomous community infrastructure engine built with bare-metal Node.js and real-time WebSocket architecture. Powers mission-critical community infrastructure with continuous 99.9% uptime.',
      specs: ['Node.js WebSockets', '99.9% Production SLA', 'Distributed Event Queue'],
      video: 'assets/videos/scroll-48-650.webm',
      launchUrl: 'https://wa.me/918957420306?text=Hello%20Mobpie!%20I\'m%20interested%20in%20custom%20real-time%20automation%20infrastructure.',
      launchText: 'DISCUSS ARCHITECTURE',
      secondaryUrl: null,
      secondaryText: null
    },
    {
      id: 'exploit',
      index: '04 / 04',
      badge: 'STATE SYNCHRONIZATION',
      domain: 'PROTOCOL RESEARCH',
      title: 'Exploit Labs &bull; Game Sandbox Protocol Mechanics',
      narrative: 'Technical reverse-engineering studies analyzing sandbox game state mechanics, packet flow synchronization, and client-server authoritative game loops published via @mobpie-op.',
      specs: ['Protocol Reverse-Engineering', 'Low-Level Logic', 'State Audited'],
      video: 'assets/videos/scroll-30-650.webm',
      launchUrl: 'https://wa.me/918957420306?text=Hello%20Mobpie!%20Saw%20your%20Exploit%20Labs%20technical%20studies.',
      launchText: 'INQUIRE RESEARCH',
      secondaryUrl: null,
      secondaryText: null
    }
  ];

  let currentProjectIdx = 0;

  window.selectTheaterProject = function (idx, btn) {
    if (idx === currentProjectIdx && btn.classList.contains('active')) return;
    currentProjectIdx = idx;

    // Update buttons
    document.querySelectorAll('.theater-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const project = PROJECTS_DATA[idx];
    if (!project) return;

    // Trigger Web Audio
    playSubBass();

    // Trigger 3D WebGL Morph
    if (typeof window.setProjectMorph === 'function') {
      window.setProjectMorph(project.id);
    }

    // Smoothly crossfade theater display elements
    const video = document.getElementById('theater-video');
    const badge = document.getElementById('theater-badge');
    const index = document.getElementById('theater-index');
    const domain = document.getElementById('theater-domain');
    const title = document.getElementById('theater-title');
    const narrative = document.getElementById('theater-narrative');
    const specs = document.getElementById('theater-specs');
    const launchBtn = document.getElementById('theater-launch-btn');
    const secBtn = document.getElementById('theater-sec-btn');

    if (video) {
      video.style.opacity = '0.3';
      setTimeout(() => {
        video.src = project.video;
        video.play().catch(() => {});
        video.style.opacity = '1';
      }, 150);
    }

    if (badge) badge.innerHTML = project.badge;
    if (index) index.textContent = project.index;
    if (domain) domain.textContent = project.domain;
    if (title) title.textContent = project.title;
    if (narrative) narrative.textContent = project.narrative;

    if (specs) {
      specs.innerHTML = project.specs.map(s => `<span>${s}</span>`).join('<span class="spec-dot">&bull;</span>');
    }

    if (launchBtn) {
      launchBtn.href = project.launchUrl;
      launchBtn.querySelector('span').textContent = project.launchText;
    }

    if (secBtn) {
      if (project.secondaryUrl) {
        secBtn.style.display = 'inline-flex';
        secBtn.href = project.secondaryUrl;
        secBtn.textContent = project.secondaryText;
      } else {
        secBtn.style.display = 'none';
      }
    }
  };

  // -------------------------------------------------------------------------
  // 4. PRECISION SPATIAL CURSOR
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
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    }
    renderRing();

    // Hover Expansion on Interactive Targets
    const targets = document.querySelectorAll('a, button, .theater-tab-btn, .btn-spatial-primary, .btn-spatial-ghost, .btn-wa-monolith');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
      el.addEventListener('click', () => playGlassClick());
    });
  }

  // -------------------------------------------------------------------------
  // 5. MOBILE DRAWER CONTROLLER
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
      playGlassClick();
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      playGlassClick();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    document.querySelectorAll('.d-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // -------------------------------------------------------------------------
  // 6. VIDEO INTERSECTION OBSERVER (LOW-END PC SAFEGUARD)
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
