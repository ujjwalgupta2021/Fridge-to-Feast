/**
 * Fridge-to-Feast | Web Audio API Sound Synthesizer
 * Zero-asset, high-performance synthesized cozy cooking chimes
 */

class CozyAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playPop() {
    if (window.state && !window.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.09);

      // Audible tactile chime gain
      gain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playSlothChime() {
    if (window.state && !window.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5 (Warm Pentatonic)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.08));

        // Warm melodic pentatonic chime gain
        gain.gain.setValueAtTime(0.32, this.ctx.currentTime + (idx * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.08) + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + (idx * 0.08));
        osc.stop(this.ctx.currentTime + (idx * 0.08) + 0.45);
      });
    } catch (e) {
      console.warn("Chime error", e);
    }
  }

  playClick() {
    if (window.state && !window.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);

      // Subtle click sound gain
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

const audio = new CozyAudio();
window.CozyAudio = CozyAudio;
window.audio = audio;
