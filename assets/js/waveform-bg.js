/**
 * Mobpie Silk Harmonic Waveform
 * Real-time audio beat-synchronized waveform canvas
 * Smoothly oscillates behind seated hero avatar and surges to music beats
 * Low-end PC optimized: pauses execution when scrolled past hero
 */

(function() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', onResize, { passive: true });

  let phase = 0;
  let smoothedBass = 0;
  let smoothedMid = 0;
  let smoothedEnergy = 0;

  function renderWaveform() {
    requestAnimationFrame(renderWaveform);

    // Low-end PC safeguard: Pause rendering when scrolled past hero
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > window.innerHeight * 0.9) return;

    ctx.clearRect(0, 0, width, height);

    // Audio Metrics from global engine
    const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, mid: 0, treble: 0, energy: 0, isPlaying: false };

    // Dynamic smoothing for smooth beat reaction
    const targetBass = audio.isPlaying ? audio.bass : 0.04;
    const targetMid = audio.isPlaying ? audio.mid : 0.03;
    const targetEnergy = audio.isPlaying ? audio.energy : 0.03;

    smoothedBass += (targetBass - smoothedBass) * 0.22;
    smoothedMid += (targetMid - smoothedMid) * 0.18;
    smoothedEnergy += (targetEnergy - smoothedEnergy) * 0.20;

    // Faster wave velocity when music beats hit
    const speed = audio.isPlaying ? (0.018 + smoothedBass * 0.045) : 0.012;
    phase += speed;

    // Wave baseline: Positioned gracefully behind seated avatar (approx 38% from top)
    const baseY = height * 0.38;

    // -------------------------------------------------------------
    // WAVE 1: Primary Luminous Silk Wave (Surges to Bass & Kicks)
    // -------------------------------------------------------------
    ctx.beginPath();
    ctx.lineWidth = audio.isPlaying ? (1.8 + smoothedBass * 2.2) : 1.6;
    const alpha1 = audio.isPlaying ? (0.45 + smoothedBass * 0.45) : 0.28;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha1.toFixed(3)})`;
    ctx.shadowColor = audio.isPlaying ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = audio.isPlaying ? (10 + smoothedBass * 25) : 6;

    const baseAmp1 = audio.isPlaying ? (35 + smoothedBass * 85) : 22;

    for (let x = 0; x <= width; x += 6) {
      const normX = x / width;
      const env = Math.sin(normX * Math.PI);
      const angle = normX * Math.PI * 3.2 + phase;
      const harmonic = Math.sin(normX * Math.PI * 6.4 + phase * 1.5) * (smoothedBass * 18);
      const y = baseY + (baseAmp1 * Math.sin(angle) + harmonic) * (0.45 + env * 0.65);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // -------------------------------------------------------------
    // WAVE 2: Secondary Harmonic Wave (Surgical Acid Emerald Accent)
    // -------------------------------------------------------------
    ctx.beginPath();
    ctx.lineWidth = audio.isPlaying ? (1.2 + smoothedMid * 1.4) : 1.0;
    const alpha2 = audio.isPlaying ? (0.35 + smoothedMid * 0.35) : 0.18;
    ctx.strokeStyle = `rgba(216, 255, 56, ${alpha2.toFixed(3)})`;
    ctx.shadowBlur = audio.isPlaying ? (6 + smoothedMid * 16) : 0;
    ctx.shadowColor = 'rgba(216, 255, 56, 0.8)';

    const baseAmp2 = audio.isPlaying ? (24 + smoothedMid * 55) : 16;

    for (let x = 0; x <= width; x += 8) {
      const normX = x / width;
      const env = Math.sin(normX * Math.PI);
      const angle = normX * Math.PI * 4.2 - phase * 0.85;
      const y = baseY + (baseAmp2 * Math.cos(angle)) * (0.4 + env * 0.65) + 8;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // -------------------------------------------------------------
    // WAVE 3: Tertiary Ambient Wave (High-Frequency Shimmer)
    // -------------------------------------------------------------
    ctx.beginPath();
    ctx.lineWidth = 0.9;
    const alpha3 = audio.isPlaying ? (0.2 + smoothedEnergy * 0.25) : 0.12;
    ctx.strokeStyle = `rgba(226, 228, 234, ${alpha3.toFixed(3)})`;
    ctx.shadowBlur = 0;

    const baseAmp3 = audio.isPlaying ? (18 + smoothedEnergy * 35) : 12;

    for (let x = 0; x <= width; x += 10) {
      const normX = x / width;
      const angle = normX * Math.PI * 5.0 + phase * 1.2;
      const y = baseY + (baseAmp3 * Math.sin(angle)) - 6;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  renderWaveform();
})();
