/**
 * Mobpie Architecture Portal Controller
 * - Interactive Project Scope & Timeline Estimator
 * - Direct Project Inquiry Console (WhatsApp & Email formatters)
 * - Subtle 3D mouse parallax tilt on hero portrait
 */

(function() {
  'use strict';

  // 1. Interactive Project Scope & Timeline Estimator
  function initEstimator() {
    const checkboxes = document.querySelectorAll('.estimator-check');
    const planPill = document.getElementById('est-plan-pill');
    const timelineVal = document.getElementById('est-timeline-val');
    const modulesCount = document.getElementById('est-modules-count');
    const whatsappBtn = document.getElementById('est-whatsapp-cta');

    if (!checkboxes.length || !planPill || !timelineVal) return;

    function recalculate() {
      let selected = [];
      let hasPro = false;
      let hasFlagship = false;

      checkboxes.forEach(cb => {
        if (cb.checked) {
          selected.push(cb.getAttribute('data-label'));
          const tier = cb.getAttribute('data-tier');
          if (tier === 'pro') hasPro = true;
          if (tier === 'flagship') hasFlagship = true;
        }
      });

      if (modulesCount) {
        modulesCount.textContent = `${selected.length} MODULES SELECTED`;
      }

      let recommendedPlan = 'BASE SPRINT';
      let turnaround = '5 - 7 DAYS';

      if (hasPro || selected.length >= 5) {
        recommendedPlan = 'PRO ENTERPRISE';
        turnaround = '21 - 28 DAYS';
      } else if (hasFlagship || selected.length >= 3) {
        recommendedPlan = 'STANDARD FLAGSHIP';
        turnaround = '10 - 14 DAYS';
      } else if (selected.length === 0) {
        recommendedPlan = 'CUSTOM SCOPE';
        turnaround = 'TO BE AUDITED';
      }

      planPill.textContent = recommendedPlan;
      timelineVal.textContent = turnaround;

      if (whatsappBtn) {
        const messageText = encodeURIComponent(
          `Hello Mobpie! I configured a project estimate on your portfolio:\n\n` +
          `• Recommended Tier: ${recommendedPlan}\n` +
          `• Estimated Turnaround: ${turnaround}\n` +
          `• Selected Deliverables: ${selected.join(', ') || 'None'}\n\n` +
          `I would like to discuss commissioning this sprint for my brand.`
        );
        whatsappBtn.href = `https://wa.me/918957420306?text=${messageText}`;
      }
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', recalculate);
    });

    recalculate();
  }

  // 2. Direct Inquiry Console
  function initInquiryForm() {
    const waSubmitBtn = document.getElementById('inquiry-wa-btn');
    const mailSubmitBtn = document.getElementById('inquiry-mail-btn');

    function buildPayload() {
      const name = (document.getElementById('inq-name') || {}).value || 'Founder';
      const brand = (document.getElementById('inq-brand') || {}).value || 'Brand';
      const storeUrl = (document.getElementById('inq-url') || {}).value || 'New Project';
      const scope = (document.getElementById('inq-scope') || {}).value || 'Standard Flagship';
      const notes = (document.getElementById('inq-notes') || {}).value || 'Bespoke high-ticket build';

      return { name, brand, storeUrl, scope, notes };
    }

    if (waSubmitBtn) {
      waSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = buildPayload();
        const text = encodeURIComponent(
          `Hello Mobpie! Here are my project inquiry details:\n\n` +
          `• Name: ${p.name}\n` +
          `• Brand / Company: ${p.brand}\n` +
          `• Store / URL: ${p.storeUrl}\n` +
          `• Scope of Interest: ${p.scope}\n` +
          `• Project Notes: ${p.notes}\n\n` +
          `Looking forward to discussing the sprint!`
        );
        window.open(`https://wa.me/918957420306?text=${text}`, '_blank');
      });
    }

    if (mailSubmitBtn) {
      mailSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = buildPayload();
        const subject = encodeURIComponent(`Project Commission Inquiry: ${p.brand} (${p.name})`);
        const body = encodeURIComponent(
          `Hello Mobpie,\n\nHere are our project details:\n` +
          `• Client Name: ${p.name}\n` +
          `• Brand: ${p.brand}\n` +
          `• URL: ${p.storeUrl}\n` +
          `• Scope: ${p.scope}\n` +
          `• Notes: ${p.notes}\n\n` +
          `Please let us know your earliest sprint availability.`
        );
        window.location.href = `mailto:mobpiexd@gmail.com?subject=${subject}&body=${body}`;
      });
    }
  }

  // 3. Subtle Hero Parallax
  function initHeroParallax() {
    const heroArea = document.querySelector('.avatar-stage-area');
    const avatarFrame = document.querySelector('#hero-avatar-frame');
    if (!heroArea || !avatarFrame) return;

    heroArea.addEventListener('mousemove', (e) => {
      const rect = heroArea.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      avatarFrame.style.transform = `perspective(800px) rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(${(y * 4).toFixed(2)}px)`;
    });

    heroArea.addEventListener('mouseleave', () => {
      avatarFrame.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
      avatarFrame.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { avatarFrame.style.transition = ''; }, 400);
    });
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initEstimator();
      initInquiryForm();
      initHeroParallax();
    });
  } else {
    initEstimator();
    initInquiryForm();
    initHeroParallax();
  }
})();
