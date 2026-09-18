/**
 * MOBPIE // PROCEDURAL WEB AUDIO SYNTHESIZER
 * 0kb audio footprint — 100% synthesized real-time audio via Web Audio API.
 * Features:
 * - Micro-haptic tactile click (800-1200Hz exponential decay)
 * - Subtle UI hover ping (2200Hz soft sine wave)
 * - Project switch frequency glide
 * - Atmospheric sub-bass studio aura drone
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isMuted = true;
  let ambientOsc1 = null;
  let ambientOsc2 = null;
  let ambientGain = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Tactile micro-haptic click
  function playClick(freq = 950, duration = 0.035) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Soft hover ping
  function playHover(freq = 2400) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {}
  }

  // Project switch transition glide
  function playSwitch() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Toggle ambient atmospheric tone
  function toggleAmbientSound() {
    const ctx = getAudioContext();
    if (!ctx) return false;

    isMuted = !isMuted;

    if (isMuted) {
      if (ambientGain) {
        ambientGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
      }
    } else {
      playClick(1200, 0.05);

      if (!ambientOsc1) {
        ambientOsc1 = ctx.createOscillator();
        ambientOsc2 = ctx.createOscillator();
        ambientGain = ctx.createGain();

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 180;

        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.value = 48.0; // Deep sub drone

        ambientOsc2.type = 'sine';
        ambientOsc2.frequency.value = 72.0; // Harmonic fifth

        ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);

        ambientOsc1.connect(filter);
        ambientOsc2.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(ctx.destination);

        ambientOsc1.start();
        ambientOsc2.start();
      }

      ambientGain.gain.setTargetAtTime(0.03, ctx.currentTime, 0.5);
    }

    return !isMuted;
  }

  window.MobpieAudio = {
    playClick,
    playHover,
    playSwitch,
    toggleAmbient: toggleAmbientSound,
    isMuted: () => isMuted
  };
})();
