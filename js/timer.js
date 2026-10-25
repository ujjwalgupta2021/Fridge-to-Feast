/**
 * Fridge-to-Feast | Hands-Free "Sloth Nap" Cooking Timer
 * Web Audio chimes, Web Speech API voice announcements, and tactile countdown
 */

const SlothTimer = {
  totalSeconds: 900,     // Default: 15 minutes
  remainingSeconds: 900,
  isRunning: false,
  intervalId: null,
  voiceEnabled: true,
  soothingVoice: null,

  init() {
    this.bindEvents();
    this.syncWithCurrentRecipe();
    this.updateDisplay();
    this.initVoices();
  },

  initVoices() {
    if (!('speechSynthesis' in window)) return;
    this.soothingVoice = this.getSoothingVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      this.soothingVoice = this.getSoothingVoice();
    };
  },

  // Discover and prioritize the most soothing, natural, and calm voice available
  getSoothingVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prioritized patterns: Natural neural voices, warm soft female tones, gentle conversational voices
    const soothingPatterns = [
      /natural/i,                    // Microsoft Neural Natural voices (Edge/Win11)
      /aria/i,                       // Microsoft Aria (gentle, warm, natural)
      /jenny/i,                      // Microsoft Jenny (warm, conversational)
      /sonia/i,                      // Microsoft Sonia (calm British)
      /libby/i,                      // Microsoft Libby (soft tone)
      /zira/i,                       // Microsoft Zira
      /samantha/i,                   // macOS / iOS Siri voice
      /victoria/i,                   // macOS Victoria
      /serena/i,                     // Premium soft voice
      /google uk english female/i,   // Chrome UK gentle female
      /google us english/i,          // Chrome US
      /female/i                      // Any calm female profile
    ];

    for (const pattern of soothingPatterns) {
      const match = voices.find(v => pattern.test(v.name) && v.lang.startsWith('en'));
      if (match) return match;
    }

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  },

  // Sync default duration with current recipe or active energy mode (3m, 15m, 30m)
  syncWithCurrentRecipe() {
    if (this.isRunning) return; // Don't interrupt if currently counting down

    let durationMins = null;
    const timeStr = window.state?.currentRecipe?.timeStr;
    if (timeStr) {
      const match = timeStr.match(/(\d+)\s*(?:min|m)/i);
      if (match) durationMins = parseInt(match[1], 10);
    }

    if (!durationMins) {
      const modeIdx = window.state?.energyMode ?? 1;
      if (modeIdx === 0) {
        durationMins = 3; // 3 minutes
      } else if (modeIdx === 1) {
        durationMins = 15; // 15 minutes
      } else {
        durationMins = 30; // 30 minutes
      }
    }

    this.totalSeconds = Math.max(60, durationMins * 60);
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  },

  setDurationMinutes(mins) {
    if (this.isRunning) this.pause();
    this.totalSeconds = Math.max(60, mins * 60);
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  },

  addMinutes(deltaMins) {
    const newRemaining = Math.max(60, this.remainingSeconds + deltaMins * 60);
    this.remainingSeconds = newRemaining;
    if (newRemaining > this.totalSeconds) {
      this.totalSeconds = newRemaining;
    }
    this.updateDisplay();
    if (window.audio) window.audio.playClick();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const startBtn = document.getElementById('timer-start-btn');
    const startIcon = document.getElementById('timer-start-icon');
    const startText = document.getElementById('timer-start-text');
    const badge = document.getElementById('timer-status-badge');

    if (startText) startText.textContent = "Pause Nap";
    if (startIcon) startIcon.setAttribute('data-lucide', 'pause');
    if (badge) {
      badge.textContent = "Sloth Nap: Cooking...";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-emerald text-cream-50 font-bold uppercase animate-pulse shadow-tactile-sm";
    }
    if (window.lucide) window.lucide.createIcons();

    if (window.audio) window.audio.playPop();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  },

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.intervalId);

    const startBtn = document.getElementById('timer-start-btn');
    const startIcon = document.getElementById('timer-start-icon');
    const startText = document.getElementById('timer-start-text');
    const badge = document.getElementById('timer-status-badge');

    if (startText) startText.textContent = "Resume";
    if (startIcon) startIcon.setAttribute('data-lucide', 'play');
    if (badge) {
      badge.textContent = "Paused";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-sloth-ochre text-cream-50 font-bold uppercase shadow-tactile-sm";
    }
    if (window.lucide) window.lucide.createIcons();
    if (window.audio) window.audio.playClick();
  },

  togglePlayPause() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  },

  reset() {
    this.pause();
    this.syncWithCurrentRecipe();

    const startText = document.getElementById('timer-start-text');
    const startIcon = document.getElementById('timer-start-icon');
    const badge = document.getElementById('timer-status-badge');

    if (startText) startText.textContent = "Start Nap Timer";
    if (startIcon) startIcon.setAttribute('data-lucide', 'play');
    if (badge) {
      badge.textContent = "Sloth Nap: Ready";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-cream-300 dark:bg-[#2c2622] text-roasted-muted dark:text-cream-300 font-bold uppercase";
    }
    if (window.lucide) window.lucide.createIcons();
    this.updateDisplay();
    if (window.audio) window.audio.playClick();
  },

  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.updateDisplay();

      // Soft audio tick every minute
      if (this.remainingSeconds % 60 === 0 && this.remainingSeconds > 0) {
        if (window.audio) window.audio.playClick();
      }
    } else {
      this.complete();
    }
  },

  complete() {
    this.pause();
    this.remainingSeconds = 0;
    this.updateDisplay();

    const badge = document.getElementById('timer-status-badge');
    if (badge) {
      badge.textContent = "🎉 Feast is Ready!";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-emerald text-cream-50 font-extrabold uppercase shadow-tactile-sm animate-bounce";
    }

    // Play victory chimes
    if (window.audio) {
      window.audio.playSlothChime();
      setTimeout(() => window.audio?.playSlothChime(), 600);
    }

    const title = window.state?.currentRecipe?.title || "your delicious feast";

    if (typeof showToast === 'function') {
      showToast(`Ding! ${title} is ready to enjoy straight from the cookware!`, "🎉");
    }

    // Hands-free soothing voice announcement
    if (this.voiceEnabled) {
      this.speakSoothingAnnouncement();
    }
  },

  // Speaks an announcement using the discovered soothing voice with relaxed cadence and natural breath-like pauses
  speakSoothingAnnouncement(customText = null) {
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech cleanly

      const title = window.state?.currentRecipe?.title || "your delicious feast";
      // Gentle phrasing with punctuation for natural, unhurried breath pauses
      const text = customText || `Wake up, master... Your ${title} is ready. Turn off the heat whenever you are ready, and enjoy your meal.`;

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.soothingVoice || this.getSoothingVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Calm, soothing acoustic parameters
      utterance.rate = 0.88;    // Relaxed, unhurried cadence (avoids rapid robotic delivery)
      utterance.pitch = 0.98;   // Warm, gentle pitch (avoids shrill or robotic frequencies)
      utterance.volume = 0.92;  // Comfortably audible

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  },

  updateDisplay() {
    const displayEl = document.getElementById('timer-display');
    const progressBar = document.getElementById('timer-progress-bar');

    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (displayEl) {
      displayEl.textContent = formatted;
    }

    if (progressBar && this.totalSeconds > 0) {
      const pct = Math.max(0, Math.min(100, (this.remainingSeconds / this.totalSeconds) * 100));
      progressBar.style.width = `${pct}%`;
    }
  },

  bindEvents() {
    const startBtn = document.getElementById('timer-start-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const addMinBtn = document.getElementById('timer-add-min-btn');
    const subMinBtn = document.getElementById('timer-sub-min-btn');
    const voiceToggle = document.getElementById('timer-voice-toggle');
    const previewVoiceBtn = document.getElementById('timer-preview-voice-btn');

    startBtn?.addEventListener('click', () => this.togglePlayPause());
    resetBtn?.addEventListener('click', () => this.reset());
    addMinBtn?.addEventListener('click', () => this.addMinutes(1));
    subMinBtn?.addEventListener('click', () => this.addMinutes(-1));

    previewVoiceBtn?.addEventListener('click', () => {
      const title = window.state?.currentRecipe?.title || "your delicious feast";
      this.speakSoothingAnnouncement(`Wake up, master... Your ${title} is ready. Turn off the heat, and enjoy your meal.`);
      if (typeof showToast === 'function') {
        showToast("Playing soothing voice preview 🗣️", "🦥");
      }
      if (window.audio) window.audio.playPop();
    });

    voiceToggle?.addEventListener('change', (e) => {
      this.voiceEnabled = e.target.checked;
      if (typeof showToast === 'function') {
        showToast(this.voiceEnabled ? "Voice announcer: ON 🗣️" : "Voice announcer: OFF 🔇", "🦥");
      }
      if (window.audio) window.audio.playClick();
    });
  }
};

window.SlothTimer = SlothTimer;
