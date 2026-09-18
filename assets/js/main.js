/**
 * MOBPIE // EDITORIAL MASTER CONTROLLER
 */

(function () {
  'use strict';

  // 1. Live IST Clock
  function initClock() {
    const clockEl = document.getElementById('ist-time');
    if (!clockEl) return;

    function update() {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      clockEl.textContent = `${formatter.format(new Date())} IST`;
    }
    update();
    setInterval(update, 1000);
  }

  // 2. Sound Aura Toggle
  window.toggleSoundAura = function () {
    if (!window.MobpieAudio) return;
    const isNowActive = window.MobpieAudio.toggleAmbient();
    const soundText = document.getElementById('sound-toggle-text');
    const soundBtn = document.getElementById('sound-toggle-btn');

    if (soundText && soundBtn) {
      if (isNowActive) {
        soundText.textContent = 'SOUND [ON]';
        soundBtn.classList.add('sound-active');
      } else {
        soundText.textContent = 'SOUND [OFF]';
        soundBtn.classList.remove('sound-active');
      }
    }
  };

  // 3. Editorial Scope Estimator
  function initEstimator() {
    const scopeItems = document.querySelectorAll('.estimator-scope-item');
    const priceDisplay = document.getElementById('estimate-cost');
    const whatsappBtn = document.getElementById('estimator-whatsapp-btn');

    let basePrice = 3200;
    let selectedName = '3D WebGL World & Custom Shaders';

    function recalculate() {
      if (priceDisplay) {
        priceDisplay.textContent = `$${basePrice.toLocaleString('en-US')}`;
      }

      if (whatsappBtn) {
        const msg = encodeURIComponent(
          `Hello Mobpie! I'm interested in commissioning:\n\n• Scope: ${selectedName}\n• Approx Budget: $${basePrice.toLocaleString('en-US')}\n\nLet's discuss scheduling and kickoff!`
        );
        whatsappBtn.href = `https://wa.me/918957420306?text=${msg}`;
      }
    }

    scopeItems.forEach(item => {
      item.addEventListener('click', function () {
        scopeItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        basePrice = parseInt(item.getAttribute('data-price') || '3200', 10);
        selectedName = item.querySelector('.scope-item-title')?.textContent || 'Bespoke';

        if (window.MobpieAudio) window.MobpieAudio.playClick(1200, 0.03);
        recalculate();
      });
    });

    recalculate();
  }

  // 4. Project Modal Viewports
  const projectDetails = {
    'atelier': {
      title: 'ATELIER ORA',
      badge: 'QUIET LUXURY DIGITAL FLAGSHIP',
      kicker: 'HAUTE COUTURE APPAREL // 12-PIECE SIGNATURE DEMO',
      image: 'assets/images/remake-fashion-preview.png',
      desc: 'Engineered as an uncompromising digital showroom for bespoke tailoring. Features a tactile travertine limestone palette, surgical typography, interactive PDP with fabric texture switchers, and zero-distraction editorial checkout.',
      metrics: [
        { label: 'CONVERSION VELOCITY', val: '+148%' },
        { label: 'RENDER PERFORMANCE', val: '60 FPS' },
        { label: 'BOUNCE RATE', val: '18.4%' }
      ],
      stack: ['HTML5 / WebGL', 'Vanilla JS Physics', 'CSS Subgrid', 'Vercel Edge'],
      liveUrl: 'https://atelier-ora.vercel.app',
      githubUrl: 'https://github.com/Mobpie15/fashion-brand'
    },
    'amazon': {
      title: 'AMAZON LUXURY REMAKE',
      badge: 'ENTERPRISE STOREFRONT REDESIGN',
      kicker: 'MASS-MARKET INTERFACE ELEVATION // ZERO CLUTTER',
      image: 'assets/images/remake-amazon-preview.png',
      desc: 'Complete architectural remake of Amazon e-commerce. Strips away banner clutter, visual noise, and dark patterns, replacing them with runway-grade product curation, instant drawer carts, and high-velocity micro-interactions.',
      metrics: [
        { label: 'USER RETENTION', val: '+92%' },
        { label: 'CHECKOUT LATENCY', val: '2.1s' },
        { label: 'SEARCH SPEED', val: '< 50ms' }
      ],
      stack: ['Next.js / TypeScript', 'Tailwind Core', 'Framer Motion', 'Stripe API'],
      liveUrl: 'https://amazon-redesign-nine.vercel.app',
      githubUrl: 'https://github.com/Mobpie15/amazon-redesign'
    },
    'piebot': {
      title: 'PIEBOT INFRASTRUCTURE',
      badge: 'HIGH-CONCURRENCE BOT ENGINE',
      kicker: 'DISCORD AUTOMATION // REAL-TIME TELEMETRY',
      image: 'assets/images/remakes/remake-tech.jpg',
      desc: 'Custom-engineered high-throughput Discord engine powering multi-server moderation, role-granting pipelines, custom audio streaming, and live WebSocket telemetry dashboards.',
      metrics: [
        { label: 'SOCKET LATENCY', val: '18ms' },
        { label: 'UPTIME RECORD', val: '99.98%' },
        { label: 'CONCURRENT OPS', val: '10,000+' }
      ],
      stack: ['Node.js / Discord.js', 'WebSocket API', 'Redis Cache', 'Docker'],
      liveUrl: 'https://discord.gg/9k7c8qG',
      githubUrl: 'https://github.com/Mobpie15/Piebot'
    },
    'creator': {
      title: 'EXPLOIT CREATOR HUB',
      badge: 'GAMING DATA ARCHITECTURE',
      kicker: '@MOBPIE-OP // 46 AUDITED EPISODES',
      image: 'assets/images/remakes/remake-streetwear.jpg',
      desc: 'YouTube creator intelligence platform analyzing 46 deep gaming uploads (GTA 5 Story Mode & Minecraft Exploit systems) to systematically maximize viewer retention and CTR.',
      metrics: [
        { label: 'CTR PEAK', val: '8.5%' },
        { label: 'WATCH TIME CONV', val: '66%' },
        { label: 'HOOK RETENTION', val: '+74%' }
      ],
      stack: ['YouTube Analytics API', 'Python / Pandas', 'Chart.js', 'FastAPI'],
      liveUrl: 'https://youtube.com/@mobpie-op',
      githubUrl: 'https://github.com/Mobpie15'
    }
  };

  function initModals() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalClose = modal.querySelector('.modal-close');
    const modalBackdrop = modal.querySelector('.modal-backdrop');

    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalKicker = document.getElementById('modal-kicker');
    const modalDesc = document.getElementById('modal-desc');
    const modalImage = document.getElementById('modal-img');
    const modalMetrics = document.getElementById('modal-metrics');
    const modalStack = document.getElementById('modal-stack');
    const modalLive = document.getElementById('modal-live-btn');
    const modalGithub = document.getElementById('modal-github-btn');

    function openModal(id) {
      const data = projectDetails[id];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBadge) modalBadge.textContent = data.badge;
      if (modalKicker) modalKicker.textContent = data.kicker;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalImage) modalImage.src = data.image;

      if (modalMetrics) {
        modalMetrics.innerHTML = data.metrics.map(m => `
          <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <span style="font-size: 1.5rem; font-weight: 800; color: #fff; display: block;" class="font-display">${m.val}</span>
            <span style="font-size: 0.68rem; color: #94a3b8;" class="font-mono">${m.label}</span>
          </div>
        `).join('');
      }

      if (modalStack) {
        modalStack.innerHTML = data.stack.map(s => `
          <span style="padding: 0.35rem 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; font-size: 0.75rem;" class="font-mono">${s}</span>
        `).join('');
      }

      if (modalLive) modalLive.href = data.liveUrl;
      if (modalGithub) modalGithub.href = data.githubUrl;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (window.MobpieAudio) window.MobpieAudio.playClick(1300, 0.04);
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.MobpieAudio) window.MobpieAudio.playClick(800, 0.02);
    }

    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        const id = trigger.getAttribute('data-open-modal');
        openModal(id);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 5. Copy Email
  function initCopyEmail() {
    const copyBtns = document.querySelectorAll('[data-copy-email]');
    const toast = document.getElementById('copy-toast');

    copyBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const email = 'mobpie.business@gmail.com';

        navigator.clipboard.writeText(email).then(() => {
          if (toast) {
            toast.textContent = `COPIED TO CLIPBOARD: ${email}`;
            toast.classList.add('show');
            setTimeout(() => {
              toast.classList.remove('show');
            }, 3000);
          }
          if (window.MobpieAudio) window.MobpieAudio.playClick(1500, 0.04);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initClock();
    initEstimator();
    initModals();
    initCopyEmail();
  });
})();
