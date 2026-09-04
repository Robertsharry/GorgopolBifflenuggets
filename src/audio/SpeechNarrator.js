// SpeechNarration Engine using Web Speech API (speechSynthesis)
// Features multi-voice character modulation, boundary word sync, and timer fallback.

class SpeechNarrator {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.rate = 1.0;
    this.volume = 1.0;
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.onWordHighlight = null;
    this.onBeatComplete = null;
    this.fallbackTimer = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (!this.selectedVoice && this.voices.length > 0) {
      // Prefer natural English voices if available
      const preferred = this.voices.find(v => 
        (v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Alex")))
      ) || this.voices.find(v => v.lang.startsWith("en")) || this.voices[0];
      this.selectedVoice = preferred;
    }
  }

  getAvailableVoices() {
    if (!this.voices.length && this.synth) {
      this.loadVoices();
    }
    return this.voices.filter(v => v.lang.startsWith("en") || !v.lang);
  }

  setVoice(voiceUri) {
    const found = this.voices.find(v => v.voiceURI === voiceUri || v.name === voiceUri);
    if (found) {
      this.selectedVoice = found;
    }
  }

  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.5, rate));
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  speakBeat(beat, options = {}) {
    this.stop();

    const { enabled = true, onWord, onComplete } = options;
    this.onWordHighlight = onWord;
    this.onBeatComplete = onComplete;

    // Clean text for speech synthesis (strip bracketed HUD tags for cleaner speech, or read them distinctly)
    let speakableText = beat.text.replace(/[[]«»]/g, "");

    // If speech is turned off by user or unavailable, use visual timing fallback
    if (!enabled || !this.synth) {
      this.runVisualTimer(beat.text, onComplete);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(speakableText);
      this.currentUtterance = utterance;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Modulation based on character speaker
      let pitch = 1.0;
      let speakerRateMultiplier = 1.0;

      if (beat.speaker === "arthur") {
        pitch = 0.88; // Lower, gritty
        speakerRateMultiplier = 0.95;
      } else if (beat.speaker === "valerie") {
        pitch = 1.25; // Synthesized feminine AI
        speakerRateMultiplier = 1.08;
      } else if (beat.speaker === "system" || beat.speaker === "station") {
        pitch = 0.72; // Deep cold robotic
        speakerRateMultiplier = 0.92;
      }

      utterance.pitch = pitch;
      utterance.rate = this.rate * speakerRateMultiplier;
      utterance.volume = this.volume;

      utterance.onboundary = (event) => {
        if (event.name === "word" && this.onWordHighlight) {
          const charIndex = event.charIndex;
          this.onWordHighlight(charIndex, event.charLength || 0);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onBeatComplete) {
          this.onBeatComplete();
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error or interrupt:", e);
        this.isSpeaking = false;
        if (this.onBeatComplete && e.error !== "interrupted" && e.error !== "canceled") {
          this.onBeatComplete();
        }
      };

      this.isSpeaking = true;
      this.synth.speak(utterance);
    } catch (err) {
      console.error("Failed to speak with SpeechSynthesis:", err);
      this.runVisualTimer(beat.text, onComplete);
    }
  }

  runVisualTimer(text, onComplete) {
    // Calculate reading time based on word count: avg 160 words per minute / speed
    const words = text.split(/\s+/).length;
    const baseDurationSec = Math.max(3.2, (words / (160 * (this.rate || 1))) * 60);
    const durationMs = baseDurationSec * 1000;

    // Word progress ticker
    const stepMs = durationMs / Math.max(1, words);
    let currentWordIdx = 0;

    const interval = setInterval(() => {
      currentWordIdx++;
      if (this.onWordHighlight) {
        // Approximate character position
        const approxChar = Math.floor((currentWordIdx / words) * text.length);
        this.onWordHighlight(approxChar, 5);
      }
      if (currentWordIdx >= words) {
        clearInterval(interval);
      }
    }, stepMs);

    this.fallbackTimer = setTimeout(() => {
      clearInterval(interval);
      if (onComplete) onComplete();
    }, durationMs);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }
}

export const speechNarrator = new SpeechNarrator();
