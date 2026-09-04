// High-Fidelity Procedural Web Audio Ambient & SFX Engine
// No external audio files needed — zero network latency, infinite procedural variation!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.6;
    this.currentMood = "drift";

    // Audio nodes for ambient layer
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.subOsc = null;
    this.noiseNode = null;
    this.noiseFilter = null;
    this.lfo = null;
    this.lfoGain = null;

    // Heartbeat scheduler
    this.heartbeatTimer = null;
    this.heartbeatBpm = 70;
    this.heartbeatActive = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Ambient bus
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // SFX bus
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  async resume() {
    if (!this.ctx) this.init();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  startAmbient() {
    if (!this.ctx) this.init();
    if (this.isPlaying) return;
    this.resume();

    const t = this.ctx.currentTime;

    // Sub-bass drone (55Hz A1)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = "sine";
    this.subOsc.frequency.setValueAtTime(55, t);

    // Secondary warm detuned saw
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = "sawtooth";
    this.droneOsc1.frequency.setValueAtTime(110, t); // A2

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = "triangle";
    this.droneOsc2.frequency.setValueAtTime(110.8, t); // Detuned for warmth

    // Low-pass filter for the drones
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = "lowpass";
    this.droneFilter.frequency.setValueAtTime(280, t);
    this.droneFilter.Q.setValueAtTime(4.0, t);

    // LFO for slow breathing filter sweep
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.12, t); // 8 second cycle
    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(90, t);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.droneFilter.frequency);

    // Cosmic atmospheric wind / noise generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = "bandpass";
    this.noiseFilter.frequency.setValueAtTime(450, t);
    this.noiseFilter.Q.setValueAtTime(1.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, t);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);

    // Connect oscillators to filter
    this.subOsc.connect(this.droneFilter);
    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(this.ambientGain);

    // Start audio sources
    this.subOsc.start(t);
    this.droneOsc1.start(t);
    this.droneOsc2.start(t);
    this.noiseNode.start(t);
    this.lfo.start(t);

    this.isPlaying = true;
    this.startHeartbeat();
  }

  stopAmbient() {
    if (!this.isPlaying) return;
    try {
      if (this.subOsc) this.subOsc.stop();
      if (this.droneOsc1) this.droneOsc1.stop();
      if (this.droneOsc2) this.droneOsc2.stop();
      if (this.noiseNode) this.noiseNode.stop();
      if (this.lfo) this.lfo.stop();
    } catch (e) {
      // ignore already stopped nodes
    }
    this.stopHeartbeat();
    this.isPlaying = false;
  }

  setMood(mood, tensionLevel = 30, heartbeatBpm = 70) {
    this.currentMood = mood;
    this.heartbeatBpm = heartbeatBpm;
    if (!this.ctx || !this.isPlaying) return;

    const t = this.ctx.currentTime;
    const targetCutoff = 200 + (tensionLevel * 12);

    if (this.droneFilter) {
      this.droneFilter.frequency.setTargetAtTime(targetCutoff, t, 1.5);
    }

    // Adjust oscillator pitches based on mood
    if (this.subOsc && this.droneOsc1 && this.droneOsc2) {
      if (mood === "agony" || mood === "panic" || mood === "alarm") {
        this.subOsc.frequency.setTargetAtTime(41.2, t, 0.8); // E1 (tense low)
        this.droneOsc1.frequency.setTargetAtTime(82.4, t, 0.8);
        this.droneOsc2.frequency.setTargetAtTime(123.47, t, 0.8); // Minor interval
      } else if (mood === "climax" || mood === "burn") {
        this.subOsc.frequency.setTargetAtTime(65.4, t, 0.5); // C2 energetic
        this.droneOsc1.frequency.setTargetAtTime(130.8, t, 0.5);
        this.droneOsc2.frequency.setTargetAtTime(196.0, t, 0.5); // 5th power
      } else if (mood === "ethereal" || mood === "epiphany") {
        this.subOsc.frequency.setTargetAtTime(55, t, 1.5);
        this.droneOsc1.frequency.setTargetAtTime(220, t, 1.5); // Octave float
        this.droneOsc2.frequency.setTargetAtTime(277.18, t, 1.5); // Major 3rd
      } else if (mood === "warm-resolution" || mood === "peace") {
        this.subOsc.frequency.setTargetAtTime(58.27, t, 2.0); // Bb warm
        this.droneOsc1.frequency.setTargetAtTime(116.54, t, 2.0);
        this.droneOsc2.frequency.setTargetAtTime(174.61, t, 2.0);
      } else {
        // Default drift
        this.subOsc.frequency.setTargetAtTime(55, t, 1.0);
        this.droneOsc1.frequency.setTargetAtTime(110, t, 1.0);
        this.droneOsc2.frequency.setTargetAtTime(110.8, t, 1.0);
      }
    }

    if (this.noiseFilter) {
      const noiseFreq = mood === "burn" ? 1800 : mood === "agony" ? 800 : 450;
      this.noiseFilter.frequency.setTargetAtTime(noiseFreq, t, 1.0);
    }
  }

  // Heartbeat generator
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatActive = true;
    const runHeartbeat = () => {
      if (!this.heartbeatActive || !this.isPlaying) return;
      this.playHeartbeatStroke();
      const intervalMs = (60 / this.heartbeatBpm) * 1000;
      this.heartbeatTimer = setTimeout(runHeartbeat, intervalMs);
    };
    runHeartbeat();
  }

  stopHeartbeat() {
    this.heartbeatActive = false;
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  playHeartbeatStroke() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const intensity = this.currentMood === "agony" || this.currentMood === "panic" ? 0.35 : 0.12;

    // Sub-kick 1 (Lub)
    this.synthesizeHeartbeatPulse(t, 55, 30, 0.14, intensity);
    // Sub-kick 2 (Dub)
    this.synthesizeHeartbeatPulse(t + 0.18, 50, 25, 0.12, intensity * 0.7);
  }

  synthesizeHeartbeatPulse(time, startFreq, endFreq, duration, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Sound Effects
  playClick() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playGlitch() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.setValueAtTime(890, t + 0.02);
    osc.frequency.setValueAtTime(150, t + 0.05);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playAlert() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    [0, 0.16].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t + offset);
      gain.gain.setValueAtTime(0.15, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + offset);
      osc.stop(t + offset + 0.12);
    });
  }

  playImpact() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(24, t + 0.9);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  playTransition() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }
}

export const soundEngine = new SoundEngine();
