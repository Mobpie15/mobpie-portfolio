/**
 * MOBPIE // KINETIC CONTROLLER (v9.0)
 * Inspired by MotionSites.ai, Animmaster Lib (animmasterlib.dev) & Skiper UI (skiper-ui.com)
 * 
 * Features:
 * 1. Curtain Reveal Page Sequence
 * 2. MotionSites-Style Mechanical Odometer Character Reel with Gradient Shift
 * 3. Skiper-Style "Things Drag & Throw" Physics Engine (Inertia, Bounce, Off-screen Auto-pause)
 * 4. Skiper-Style Command Palette (Cmd + K Modal & Hotkeys)
 * 5. Skiper-Style Circular Mask UI Reveal (Slop vs Weapon Diagnostic Cockpit)
 * 6. Animmaster-Style Zero-Reload Weapon Category Filter
 * 7. Animmaster Decryption Text Scrambler
 * 8. Low-End PC Safeguard: Video & Physics Intersection Observer (Pauses background loops)
 * 9. Live New Delhi IST Atomic Clock (<380ms Telemetry)
 * 10. Interactive Architecture Spec Lab & WhatsApp Dispatcher
 * 11. Dennis Snellenberg Magnetic Button Physics
 * 12. Mobile Dock ScrollSpy & Drawer
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. CINEMATIC CURTAIN REVEAL SEQUENCE
  // -------------------------------------------------------------------------
  function initLoadReveal() {
    const overlay = document.getElementById('page-reveal-overlay');
    if (!overlay) return;

    setTimeout(() => overlay.classList.add('logo-visible'), 80);
    setTimeout(() => overlay.classList.add('wipe-out'), 550);
    setTimeout(() => overlay.classList.add('is-done'), 1100);
    setTimeout(() => overlay.classList.add('is-removed'), 1600);
  }

  // -------------------------------------------------------------------------
  // 2. MOTIONSITES & SKIPER MECHANICAL ODOMETER CHARACTER REEL
  // -------------------------------------------------------------------------
  function initOdometerReel() {
    const reelWrap = document.getElementById('odometer-reel');
    if (!reelWrap) return;

    const targetWords = ['UNFAIR WEAPONS'];
    const word = targetWords[0];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@';

    reelWrap.innerHTML = '';

    const slotCols = [];

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (char === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.style.display = 'inline-block';
        spaceSpan.style.width = '0.35em';
        reelWrap.appendChild(spaceSpan);
        continue;
      }

      const col = document.createElement('span');
      col.className = 'odo-slot-col font-display';

      const strip = document.createElement('span');
      strip.className = 'odo-slot-strip';

      // Build random reel sequence ending with actual character
      const reelLen = 6 + (i % 4);
      for (let r = 0; r < reelLen; r++) {
        const span = document.createElement('span');
        span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
        strip.appendChild(span);
      }

      const finalSpan = document.createElement('span');
      finalSpan.textContent = char;
      finalSpan.className = 'shiny-gradient-text';
      strip.appendChild(finalSpan);

      col.appendChild(strip);
      reelWrap.appendChild(col);

      slotCols.push({ strip, reelLen });
    }

    // Trigger roll animation with staggered delays
    setTimeout(() => {
      slotCols.forEach((item, idx) => {
        setTimeout(() => {
          item.strip.style.transform = `translateY(-${item.reelLen * 1.05}em)`;
        }, idx * 45);
      });
    }, 450);
  }

  // -------------------------------------------------------------------------
  // 3. SKIPER-STYLE "THINGS DRAG & THROW" PHYSICS PLAYGROUND
  // -------------------------------------------------------------------------
  function initDraggablePlayground() {
    const area = document.getElementById('sandbox-area');
    const wrapper = document.getElementById('sandbox-wrapper');
    if (!area || !wrapper) return;

    const tokenEls = area.querySelectorAll('.physics-token');
    const tokens = [];

    tokenEls.forEach(el => {
      const startLeft = el.offsetLeft;
      const startTop = el.offsetTop;

      const tokenState = {
        el: el,
        x: startLeft,
        y: startTop,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        lastX: startLeft,
        lastY: startTop,
        lastTime: performance.now()
      };

      tokens.push(tokenState);

      // Mouse Events
      el.addEventListener('mousedown', (e) => {
        tokenState.isDragging = true;
        const eRect = el.getBoundingClientRect();
        tokenState.dragOffsetX = e.clientX - eRect.left;
        tokenState.dragOffsetY = e.clientY - eRect.top;
        tokenState.lastX = e.clientX;
        tokenState.lastY = e.clientY;
        tokenState.lastTime = performance.now();
        el.style.zIndex = '50';
        const ring = document.getElementById('cursor-ring');
        if (ring) ring.classList.add('is-dragging');
        if (window.audioEngine) window.audioEngine.playActionThud();
      });

      // Touch Events
      el.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          tokenState.isDragging = true;
          const touch = e.touches[0];
          const eRect = el.getBoundingClientRect();
          tokenState.dragOffsetX = touch.clientX - eRect.left;
          tokenState.dragOffsetY = touch.clientY - eRect.top;
          tokenState.lastX = touch.clientX;
          tokenState.lastY = touch.clientY;
          tokenState.lastTime = performance.now();
          el.style.zIndex = '50';
          if (window.audioEngine) window.audioEngine.playActionThud();
        }
      }, { passive: true });
    });

    // Window Listeners for Smooth Drag Tracking & Throw Velocity
    window.addEventListener('mousemove', (e) => {
      tokens.forEach(t => {
        if (t.isDragging) {
          const areaRect = area.getBoundingClientRect();
          const targetX = e.clientX - areaRect.left - t.dragOffsetX;
          const targetY = e.clientY - areaRect.top - t.dragOffsetY;

          const now = performance.now();
          const dt = Math.max(1, now - t.lastTime);
          t.vx = ((e.clientX - t.lastX) / dt) * 12;
          t.vy = ((e.clientY - t.lastY) / dt) * 12;
          t.lastX = e.clientX;
          t.lastY = e.clientY;
          t.lastTime = now;

          t.x = targetX;
          t.y = targetY;
          t.el.style.left = `${t.x}px`;
          t.el.style.top = `${t.y}px`;
        }
      });
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        tokens.forEach(t => {
          if (t.isDragging) {
            const areaRect = area.getBoundingClientRect();
            const targetX = touch.clientX - areaRect.left - t.dragOffsetX;
            const targetY = touch.clientY - areaRect.top - t.dragOffsetY;

            const now = performance.now();
            const dt = Math.max(1, now - t.lastTime);
            t.vx = ((touch.clientX - t.lastX) / dt) * 12;
            t.vy = ((touch.clientY - t.lastY) / dt) * 12;
            t.lastX = touch.clientX;
            t.lastY = touch.clientY;
            t.lastTime = now;

            t.x = targetX;
            t.y = targetY;
            t.el.style.left = `${t.x}px`;
            t.el.style.top = `${t.y}px`;
          }
        });
      }
    }, { passive: true });

    const stopDragging = () => {
      const ring = document.getElementById('cursor-ring');
      if (ring) ring.classList.remove('is-dragging');
      tokens.forEach(t => {
        if (t.isDragging) {
          t.isDragging = false;
          t.el.style.zIndex = '10';
        }
      });
    };

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

    // Physics Engine Loop with Low-End PC Auto-Pause Safeguard
    let isPhysicsActive = true;
    let animFrameId = null;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isPhysicsActive = entry.isIntersecting;
          if (isPhysicsActive && !animFrameId) {
            animFrameId = requestAnimationFrame(physicsLoop);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(wrapper);
    }

    function physicsLoop() {
      if (!isPhysicsActive) {
        animFrameId = null;
        return;
      }

      const areaWidth = area.clientWidth;
      const areaHeight = area.clientHeight;

      tokens.forEach(t => {
        if (!t.isDragging) {
          // Apply velocity and decay
          t.x += t.vx;
          t.y += t.vy;
          t.vx *= 0.94;
          t.vy *= 0.94;

          const tokenWidth = t.el.offsetWidth || 180;
          const tokenHeight = t.el.offsetHeight || 50;

          // Boundary Bouncing with Elasticity
          if (t.x < 10) {
            t.x = 10;
            t.vx = -t.vx * 0.65;
          } else if (t.x + tokenWidth > areaWidth - 10) {
            t.x = areaWidth - tokenWidth - 10;
            t.vx = -t.vx * 0.65;
          }

          if (t.y < 10) {
            t.y = 10;
            t.vy = -t.vy * 0.65;
          } else if (t.y + tokenHeight > areaHeight - 10) {
            t.y = areaHeight - tokenHeight - 10;
            t.vy = -t.vy * 0.65;
          }

          t.el.style.left = `${t.x}px`;
          t.el.style.top = `${t.y}px`;
        }
      });

      animFrameId = requestAnimationFrame(physicsLoop);
    }

    animFrameId = requestAnimationFrame(physicsLoop);
  }

  // -------------------------------------------------------------------------
  // 4. SKIPER-STYLE COMMAND PALETTE (CMD + K)
  // -------------------------------------------------------------------------
  let isCmdOpen = false;

  window.openCommandPalette = function () {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-search-input');
    if (!backdrop) return;

    backdrop.classList.add('open');
    isCmdOpen = true;
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
    filterCmdResults('');
    if (window.audioEngine) window.audioEngine.playActionThud();
  };

  window.closeCommandPalette = function () {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    isCmdOpen = false;
  };

  window.handleBackdropClick = function (e) {
    if (e.target.id === 'cmd-palette-backdrop') {
      closeCommandPalette();
    }
  };

  window.toggleSoundFromCmd = function () {
    if (window.audioEngine) {
      window.audioEngine.toggle();
      const label = document.getElementById('cmd-sound-label');
      if (label) {
        label.textContent = window.audioEngine.isPlaying ? 'Sound Aura Active [Playing]' : 'Sound Aura Muted';
      }
    }
    closeCommandPalette();
  };

  function initCommandPaletteShortcuts() {
    const input = document.getElementById('cmd-search-input');

    // Global Key Listener
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCmdOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }

      if (isCmdOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeCommandPalette();
        } else if (e.key === '1') {
          window.location.hash = '#weapons';
          closeCommandPalette();
        } else if (e.key === '2') {
          window.location.hash = '#reveal';
          closeCommandPalette();
        } else if (e.key === '3') {
          window.location.hash = '#spec-lab';
          closeCommandPalette();
        } else if (e.key === '4') {
          window.location.hash = '#manifesto';
          closeCommandPalette();
        } else if (e.key.toLowerCase() === 's' && document.activeElement !== input) {
          toggleSoundFromCmd();
        }
      }
    });

    if (input) {
      input.addEventListener('input', (e) => {
        filterCmdResults(e.target.value.trim().toLowerCase());
      });
    }
  }

  function filterCmdResults(query) {
    const items = document.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. SKIPER-STYLE CIRCULAR MASK UI REVEAL (SLOP VS WEAPON)
  // -------------------------------------------------------------------------
  function initCircularMaskReveal() {
    const stage = document.getElementById('mask-stage');
    if (!stage) return;

    let targetX = stage.clientWidth * 0.5;
    let targetY = stage.clientHeight * 0.5;
    let currentX = targetX;
    let currentY = targetY;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const rect = stage.getBoundingClientRect();
        targetX = e.touches[0].clientX - rect.left;
        targetY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    function renderMask() {
      requestAnimationFrame(renderMask);

      // Smooth Spring lerp
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      stage.style.setProperty('--lens-x', `${currentX}px`);
      stage.style.setProperty('--lens-y', `${currentY}px`);
    }

    renderMask();
  }

  // -------------------------------------------------------------------------
  // 6. ANIMMASTER-STYLE CATEGORY FILTER FOR WEAPONS
  // -------------------------------------------------------------------------
  window.filterWeapons = function (cat, btn) {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.weapon-card');
    cards.forEach(card => {
      const cardCats = card.getAttribute('data-cat') || '';
      if (cat === 'all' || cardCats.includes(cat)) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.classList.add('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
      }
    });

    if (window.audioEngine) window.audioEngine.playActionThud();
  };

  // -------------------------------------------------------------------------
  // 7. ANIMMASTER DECRYPTION SCRAMBLE EFFECT
  // -------------------------------------------------------------------------
  function initTextScramble() {
    const glyphs = '01#_//[]<>-*^';
    const scrambleEls = document.querySelectorAll('.section-kicker, .hero-kicker-pill span:last-child, .weapon-tag');

    scrambleEls.forEach(el => {
      const originalText = el.textContent;
      let isScrambling = false;

      el.addEventListener('mouseenter', () => {
        if (isScrambling) return;
        isScrambling = true;
        let iterations = 0;
        const interval = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, index) => {
              if (index < iterations || char === ' ' || char === '/') return originalText[index];
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join('');

          if (iterations >= originalText.length) {
            clearInterval(interval);
            el.textContent = originalText;
            isScrambling = false;
          }
          iterations += 1;
        }, 22);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 8. LOW-END PC SAFEGUARD: VIDEO INTERSECTION OPTIMIZER
  // Pauses background video loops when scrolled off-screen
  // -------------------------------------------------------------------------
  function initVideoOptimizer() {
    const videos = document.querySelectorAll('video');
    if (!('IntersectionObserver' in window) || videos.length === 0) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });

    videos.forEach(v => videoObserver.observe(v));
  }

  // -------------------------------------------------------------------------
  // 9. LIVE NEW DELHI (IST UTC+5:30) CLOCK
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
  // 10. ARCHITECTURE SPEC LAB & WHATSAPP DISPATCHER
  // -------------------------------------------------------------------------
  let currentSprint = '72h';

  window.toggleSpecModule = function (el) {
    el.classList.toggle('selected');
    if (window.audioEngine) window.audioEngine.playActionThud();
    updateBlueprintSummary();
  };

  window.selectSprintCadence = function (btn, type) {
    document.querySelectorAll('.sprint-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    currentSprint = type;
    if (window.audioEngine) window.audioEngine.playActionThud();

    const deliveryEl = document.getElementById('spec-delivery-val');
    const riskEl = document.getElementById('spec-risk-val');

    if (type === '72h') {
      if (deliveryEl) deliveryEl.textContent = '72 Hours On Private Staging';
      if (riskEl) riskEl.textContent = '₹0 / $0 (Proof-First Model)';
    } else {
      if (deliveryEl) deliveryEl.textContent = '30-Day Turnkey Production Launch';
      if (riskEl) riskEl.textContent = 'Milestone-Based Founder Sign-off';
    }
  };

  function updateBlueprintSummary() {
    const selectedModules = document.querySelectorAll('.spec-module-card.selected');
    const countEl = document.getElementById('spec-modules-count');
    const latencyEl = document.getElementById('spec-latency-val');

    if (countEl) {
      countEl.textContent = `${selectedModules.length} Enterprise Modules Selected`;
    }

    const hasSpeed = document.querySelector('.spec-module-card[data-module="speed"]')?.classList.contains('selected');
    if (latencyEl) {
      latencyEl.textContent = hasSpeed ? 'Sub-380ms // 99+ Lighthouse' : 'Standard 600ms Edge';
    }
  }

  window.dispatchConfiguredSpec = function () {
    const selected = Array.from(document.querySelectorAll('.spec-module-card.selected')).map(el => {
      return el.querySelector('.module-name')?.textContent?.trim() || '';
    }).filter(Boolean);

    const sprintName = currentSprint === '72h' ? '72-Hour Rapid Prototype (Zero Upfront Risk)' : 'Full 30-Day Production Launch';
    const moduleList = selected.length ? selected.map(s => `• ${s}`).join('%0A') : '• Core Luxury Flagship Architecture';

    const message = `Hello Mobpie!%0A%0AI configured a custom Digital Flagship Spec on your new portfolio:%0A%0ACadence:%0A${encodeURIComponent(sprintName)}%0A%0ASelected Capabilities:%0A${moduleList}%0A%0ALet's schedule the 1:1 briefing and initiate the private staging sprint.`;
    const waUrl = `https://wa.me/918957420306?text=${message}`;

    if (window.audioEngine) window.audioEngine.playActionThud();
    window.open(waUrl, '_blank');
  };

  window.handleConciergeInquiry = function (event) {
    event.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const brand = document.getElementById('f-brand').value.trim();
    const contact = document.getElementById('f-contact').value.trim();
    const cadence = document.getElementById('f-cadence').value;
    const vision = document.getElementById('f-vision').value.trim();
    const feedback = document.getElementById('concierge-form-feedback');

    if (!name || !brand || !contact) {
      if (feedback) {
        feedback.className = 'form-feedback error font-mono';
        feedback.textContent = 'Please provide your name, brand, and contact coordinates.';
      }
      return false;
    }

    const message = `Hello Mobpie!%0A%0AMy name is ${encodeURIComponent(name)} from ${encodeURIComponent(brand)}.%0AContact: ${encodeURIComponent(contact)}%0ATimeline: ${encodeURIComponent(cadence)}%0A%0AProject Scope:%0A${encodeURIComponent(vision || 'We want to commission a 72-Hour Zero-Risk Staging Prototype.')}`;
    const waUrl = `https://wa.me/918957420306?text=${message}`;

    if (feedback) {
      feedback.className = 'form-feedback success font-mono';
      feedback.textContent = 'Connecting to Mobpie direct VIP hotline...';
    }

    setTimeout(() => window.open(waUrl, '_blank'), 350);
    return false;
  };

  // -------------------------------------------------------------------------
  // 11. DENNIS SNELLENBERG MAGNETIC BUTTONS (DESKTOP)
  // -------------------------------------------------------------------------
  function initMagneticButtons() {
    if (window.innerWidth <= 860) return;
    const magneticEls = document.querySelectorAll('.btn-primary-volt, .hud-cta-btn, .btn-whatsapp-direct, .hud-monogram, .btn-card-action');
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { el.style.transition = ''; }, 380);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 12. MOBILE DOCK & DRAWER SCROLLSPY
  // -------------------------------------------------------------------------
  function initMobileControls() {
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

    const dockItems = document.querySelectorAll('.dock-item:not(.dock-item-volt)');
    const sections = [
      { id: 'hero', tab: 'home' },
      { id: 'weapons', tab: 'weapons' },
      { id: 'reveal', tab: 'moat' },
      { id: 'spec-lab', tab: 'spec' }
    ];

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let activeTab = 'home';

      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && scrollPos >= el.offsetTop) {
          activeTab = s.tab;
        }
      });

      dockItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-tab') === activeTab);
      });
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // BOOT CONTROLLER
  // -------------------------------------------------------------------------
  function boot() {
    initLoadReveal();
    initOdometerReel();
    initDraggablePlayground();
    initCommandPaletteShortcuts();
    initCircularMaskReveal();
    initTextScramble();
    initVideoOptimizer();
    initLiveClock();
    initMagneticButtons();
    initMobileControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
