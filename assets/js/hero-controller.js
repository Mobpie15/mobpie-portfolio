/**
 * Mobpie Hero Controller
 * - Interactive Avatar Pose Switcher (4 Poses: Seated, Tailored, Shades, Stride)
 * - Auto-Cycle Mode: Smoothly cycles poses on timer or audio beats
 * - System Performance Telemetry: Interactive tabs (Vitals, Stack, Live Audit)
 * - Live Speed Audit Simulator: Simulates real-time Lighthouse test hitting 99/100 score
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. AVATAR POSE SWITCHER & AUTO-CYCLE
  // =========================================================================
  const poses = [
    { id: '04', name: 'Zenith Seated', desc: 'Independent Designer', file: 'pose-04-sitting.png' },
    { id: '02', name: 'Tailored Suit', desc: 'Bespoke Kingpin', file: 'pose-02-standing.png' },
    { id: '03', name: 'Executive Shades', desc: 'Senior Full-Stack Engineer', file: 'pose-03-shades.png' },
    { id: '01', name: 'Perspective Step', desc: 'High-Impact Execution', file: 'pose-01-step.png' }
  ];

  let currentPoseIndex = 0;
  let autoCycleActive = false;
  let cycleTimer = null;

  function setPose(index) {
    if (index < 0 || index >= poses.length) index = 0;
    currentPoseIndex = index;
    const pose = poses[currentPoseIndex];

    // Update avatar layer images
    const layers = document.querySelectorAll('.hero-avatar-frame .avatar-layer');
    layers.forEach(layer => {
      if (layer.getAttribute('data-pose') === pose.id) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    // Update dock buttons
    const dockBtns = document.querySelectorAll('.pose-tab-btn[data-pose]');
    dockBtns.forEach(btn => {
      if (btn.getAttribute('data-pose') === pose.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update status badge
    const statusLabel = document.getElementById('avatar-pose-label');
    if (statusLabel) {
      statusLabel.textContent = `POSE [${String(currentPoseIndex + 1).padStart(2, '0')}] ${pose.name.toUpperCase()} • ${pose.desc.toUpperCase()}`;
    }
  }

  function nextPose() {
    setPose((currentPoseIndex + 1) % poses.length);
  }

  function toggleAutoCycle() {
    autoCycleActive = !autoCycleActive;
    const btn = document.getElementById('pose-autocycle-btn');
    const label = btn ? btn.querySelector('.tab-name') : null;
    const dot = btn ? btn.querySelector('.cycle-dot') : null;

    if (autoCycleActive) {
      if (btn) btn.classList.add('active');
      if (label) label.textContent = 'AUTO: ON';
      if (dot) dot.classList.add('active');
      cycleTimer = setInterval(nextPose, 3800);
    } else {
      if (btn) btn.classList.remove('active');
      if (label) label.textContent = 'AUTO: OFF';
      if (dot) dot.classList.remove('active');
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
    }
  }

  function initPoseControls() {
    // Dock tab click
    const dockBtns = document.querySelectorAll('.pose-tab-btn[data-pose]');
    dockBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setPose(idx);
        // If auto was running, reset timer
        if (autoCycleActive) {
          clearInterval(cycleTimer);
          cycleTimer = setInterval(nextPose, 3800);
        }
      });
    });

    // Auto cycle toggle button
    const autoBtn = document.getElementById('pose-autocycle-btn');
    if (autoBtn) {
      autoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAutoCycle();
      });
    }

    // Direct click on avatar frame cycles to next pose
    const avatarFrame = document.getElementById('hero-avatar-frame');
    if (avatarFrame) {
      avatarFrame.addEventListener('click', () => {
        nextPose();
        if (autoCycleActive) {
          clearInterval(cycleTimer);
          cycleTimer = setInterval(nextPose, 3800);
        }
      });
    }
  }

  // =========================================================================
  // 2. SYSTEM PERFORMANCE TELEMETRY & LIVE AUDIT CONTROLLER
  // =========================================================================
  function initTelemetryConsole() {
    const tabs = document.querySelectorAll('.tele-tab-btn');
    const panels = document.querySelectorAll('.tele-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`panel-${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Live Speed Audit Simulator
    const runAuditBtn = document.getElementById('run-audit-btn');
    const auditStatus = document.getElementById('audit-status-text');
    const auditBar = document.getElementById('audit-progress-fill');
    const auditResult = document.getElementById('audit-result-box');

    if (runAuditBtn && auditBar && auditStatus && auditResult) {
      let isAuditing = false;

      runAuditBtn.addEventListener('click', () => {
        if (isAuditing) return;
        isAuditing = true;
        runAuditBtn.disabled = true;
        runAuditBtn.textContent = 'RUNNING TEST...';
        auditResult.style.display = 'none';
        auditBar.style.width = '0%';

        const steps = [
          { pct: '25%', text: 'Pinging Edge CDN & DNS Resolution (14ms)...' },
          { pct: '60%', text: 'Auditing Asset Payloads & DOM Bloat (0 Templates)...' },
          { pct: '85%', text: 'Calculating First Contentful Paint (< 0.38s)...' },
          { pct: '100%', text: 'Lighthouse Audit Complete!' }
        ];

        let i = 0;
        const interval = setInterval(() => {
          if (i < steps.length) {
            auditBar.style.width = steps[i].pct;
            auditStatus.textContent = steps[i].text;
            i++;
          } else {
            clearInterval(interval);
            auditResult.style.display = 'flex';
            runAuditBtn.textContent = 'RE-RUN SPEED AUDIT';
            runAuditBtn.disabled = false;
            isAuditing = false;
          }
        }, 380);
      });
    }
  }

  // DOM ready initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPoseControls();
      initTelemetryConsole();
    });
  } else {
    initPoseControls();
    initTelemetryConsole();
  }
})();
