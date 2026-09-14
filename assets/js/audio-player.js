/**
 * Mobpie Ambient Audio Engine
 * - Smooth ambient soundtrack playback (webloopsong.mp3)
 * - Real-time FFT frequency metrics (bass, mid, treble, energy) for background waveform canvas
 * - Rock-solid SOUND ON / MUTED toggle across all buttons
 * - Live VU meter equalizer bars in console
 * - Window-level getAudioMetrics() accessor
 */

class MobpieAudioEngine {
  constructor() {
    this.audioSrc = 'assets/audio/webloopsong.mp3';
    this.audio = new Audio(this.audioSrc);
    this.audio.loop = true;
    this.audio.preload = 'auto';

    this.isPlaying = false;
    this.ctx = null;
    this.analyser = null;
    this.source = null;
    this.gainNode = null;
    this.fftBins = 128;
    this.freqData = new Uint8Array(this.fftBins);
    this.timeData = new Uint8Array(this.fftBins);
    this.animId = null;

    this.metrics = {
      bass: 0,
      mid: 0,
      treble: 0,
      energy: 0,
      isPlaying: false
    };

    this.initAudioContext();
    this.bindButtons();
    this.setupAutoplay();
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass && !this.ctx) {
        this.ctx = new AudioContextClass();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = this.fftBins * 2;
        this.analyser.smoothingTimeConstant = 0.75;

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.85, this.ctx.currentTime);

        this.source = this.ctx.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('AudioContext initialization notice:', e);
    }
  }

  ensureContextRunning() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  bindButtons() {
    const attach = () => {
      const soundBtns = document.querySelectorAll('.sound-toggle-btn');
      soundBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        };
      });
      this.updateUIButtons();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  }

  setupAutoplay() {
    const unlockBanner = document.getElementById('unlock-audio-banner');

    const tryPlay = () => {
      if (this.isPlaying) return;
      this.ensureContextRunning();

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.onPlaySuccess();
        }).catch(() => {
          // Autoplay was blocked by browser policy; prompt user with banner
          if (unlockBanner) {
            unlockBanner.style.display = 'flex';
          }
        });
      }
    };

    if (document.readyState === 'complete') {
      tryPlay();
    } else {
      window.addEventListener('load', tryPlay);
    }

    // Trusted user gesture events: 'click', 'touchend', 'pointerup', 'keydown'
    const gestureEvents = ['click', 'touchend', 'pointerup', 'keydown'];
    const onUserGesture = () => {
      if (this.isPlaying) return;
      this.ensureContextRunning();

      this.audio.play().then(() => {
        this.onPlaySuccess();
        // Remove gesture listeners ONLY after playback has successfully started
        gestureEvents.forEach(evt => window.removeEventListener(evt, onUserGesture));
      }).catch(err => {
        console.warn('Playback waiting for explicit interaction:', err);
      });
    };

    gestureEvents.forEach(evt => {
      window.addEventListener(evt, onUserGesture, { passive: true });
    });

    if (unlockBanner) {
      unlockBanner.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.ensureContextRunning();
        this.audio.play().then(() => {
          this.onPlaySuccess();
        }).catch(() => {});
      };
    }
  }

  onPlaySuccess() {
    this.isPlaying = true;
    this.metrics.isPlaying = true;
    this.ensureContextRunning();

    const unlockBanner = document.getElementById('unlock-audio-banner');
    if (unlockBanner) unlockBanner.style.display = 'none';

    this.updateUIButtons();
    this.analysisLoop();
  }

  toggle() {
    this.ensureContextRunning();

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.metrics.isPlaying = false;
      this.metrics.bass = 0;
      this.metrics.mid = 0;
      this.metrics.treble = 0;
      this.metrics.energy = 0;
      cancelAnimationFrame(this.animId);
      this.updateUIButtons();
    } else {
      this.audio.play().then(() => {
        this.onPlaySuccess();
      }).catch(err => {
        console.error('Play request failed:', err);
      });
    }
  }

  updateUIButtons() {
    const soundBtns = document.querySelectorAll('.sound-toggle-btn');
    soundBtns.forEach(btn => {
      const text = btn.querySelector('.btn-label');
      if (this.isPlaying) {
        btn.classList.add('active');
        if (text) text.textContent = 'SOUND: ON';
      } else {
        btn.classList.remove('active');
        if (text) text.textContent = 'SOUND: MUTED';
      }
    });

    const statusDot = document.getElementById('vu-live-dot');
    if (statusDot) {
      if (this.isPlaying) {
        statusDot.classList.add('active');
      } else {
        statusDot.classList.remove('active');
      }
    }
  }

  analysisLoop() {
    if (!this.isPlaying) return;

    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.freqData);
      this.analyser.getByteTimeDomainData(this.timeData);

      // Bass bins (approx 20Hz - 250Hz)
      let bassSum = 0;
      for (let i = 1; i <= 8; i++) bassSum += this.freqData[i];
      this.metrics.bass = (bassSum / 8) / 255;

      // Mid bins (approx 250Hz - 2000Hz)
      let midSum = 0;
      for (let i = 9; i <= 35; i++) midSum += this.freqData[i];
      this.metrics.mid = (midSum / 27) / 255;

      // Treble bins (approx 2000Hz - 8000Hz)
      let trebSum = 0;
      for (let i = 36; i <= 90; i++) trebSum += this.freqData[i];
      this.metrics.treble = (trebSum / 55) / 255;

      // Overall RMS energy
      this.metrics.energy = (this.metrics.bass * 0.5 + this.metrics.mid * 0.35 + this.metrics.treble * 0.15);

      // Update HUD VU equalizer bars safely
      const bars = document.querySelectorAll('.vu-bar');
      if (bars.length > 0) {
        const heights = [
          0.15 + this.metrics.bass * 0.85,
          0.12 + (this.metrics.bass * 0.6 + this.metrics.mid * 0.4),
          0.18 + this.metrics.mid * 0.8,
          0.12 + (this.metrics.mid * 0.4 + this.metrics.treble * 0.6),
          0.15 + this.metrics.treble * 0.85,
          0.12 + this.metrics.treble * 0.65,
          0.18 + this.metrics.mid * 0.75,
          0.20 + this.metrics.bass * 0.8
        ];
        bars.forEach((b, idx) => {
          const h = Math.min(1.0, Math.max(0.1, heights[idx % heights.length]));
          b.style.transform = `scaleY(${h.toFixed(3)})`;
        });
      }
    }

    this.animId = requestAnimationFrame(() => this.analysisLoop());
  }

  getMetrics() {
    return this.metrics;
  }
}

// Global instances
window.audioEngine = new MobpieAudioEngine();
window.RockSolidBeatSyncEngine = MobpieAudioEngine;
window.getAudioMetrics = function() {
  if (window.audioEngine) {
    return window.audioEngine.getMetrics();
  }
  return { bass: 0, mid: 0, treble: 0, energy: 0, isPlaying: false };
};
