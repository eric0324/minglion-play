// app.js - Application state machine and main controller

const App = {
  state: 'MENU', // MENU | PRAYER | INITIALIZING | THROW | RESULT
  currentMode: null,
  throwResults: [],
  currentThrow: 0,
  isAnimating: false,
  useFallback: false,
  fallbackBound: false,
  hasHeld: false, // whether user has held (grab) before releasing
  meditationTimer: null,

  // DOM elements cache
  el: {},

  init() {
    this.el = {
      menuScreen: document.getElementById('menu-screen'),
      loadingScreen: document.getElementById('loading-screen'),
      prayerScreen: document.getElementById('prayer-screen'),
      throwScreen: document.getElementById('throw-screen'),
      resultScreen: document.getElementById('result-screen'),
      btnStartThrow: document.getElementById('btn-start-throw'),
      throwContainer: document.getElementById('throw-container'),
      throwRoundInfo: document.getElementById('throw-round-info'),
      throwPrompt: document.getElementById('throw-prompt'),
      gestureStatus: document.getElementById('gesture-status'),
      gestureHandLeft: document.getElementById('gesture-hand-left'),
      gestureHandRight: document.getElementById('gesture-hand-right'),
      gestureLabel: document.getElementById('gesture-label'),
      resultIcon: document.getElementById('result-icon'),
      resultTitle: document.getElementById('result-title'),
      resultMeaning: document.getElementById('result-meaning'),
      resultHistory: document.getElementById('result-history'),
      resultDetail: document.getElementById('result-detail'),
      btnAgain: document.getElementById('btn-again'),
      btnHome: document.getElementById('btn-home'),
      meditationOverlay: document.getElementById('meditation-overlay'),
      meditationText: document.getElementById('meditation-text'),
      video: document.getElementById('webcam'),
      fallbackNotice: document.getElementById('fallback-notice'),
    };

    Animations.init();

    // Mode selection
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const modeId = card.dataset.mode;
        if (MODES[modeId]) this.selectMode(modeId);
      });
    });

    // Start throw button (from prayer screen)
    this.el.btnStartThrow.addEventListener('click', () => {
      this._initAndEnterThrow();
    });

    // Result buttons
    this.el.btnAgain.addEventListener('click', () => {
      this.enterPrayer();
    });

    this.el.btnHome.addEventListener('click', () => {
      this.showMenu();
    });

    this.showMenu();
  },

  // --- Screen Management ---
  showScreen(name) {
    const screens = ['menuScreen', 'loadingScreen', 'prayerScreen', 'throwScreen', 'resultScreen'];
    screens.forEach(s => {
      const el = this.el[s];
      if (!el) return;
      if (s === name) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  },

  // --- State: MENU ---
  showMenu() {
    this.state = 'MENU';
    this.currentMode = null;
    this.throwResults = [];
    this.currentThrow = 0;
    this._stopMeditation();
    GestureSystem.stop();
    this._hideFallbackNotice();
    this.showScreen('menuScreen');
  },

  // --- Mode Selection ---
  selectMode(modeId) {
    this.currentMode = MODES[modeId];
    this.throwResults = [];
    this.currentThrow = 0;
    this.enterPrayer();
  },

  // --- State: PRAYER ---
  enterPrayer() {
    this.state = 'PRAYER';
    this.throwResults = [];
    this.currentThrow = 0;
    this.showScreen('prayerScreen');
  },

  // --- Camera & Gesture Init ---
  async _initAndEnterThrow() {
    this.state = 'INITIALIZING';
    this.showScreen('loadingScreen');
    this._setLoadingText('正在啟動視訊鏡頭...');

    try {
      await this._initCamera();
      this._setLoadingText('正在載入手勢辨識模型...');
      await GestureSystem.init(this.el.video);
      this._setupGestureCallbacks();
      this.useFallback = false;
      this.enterThrow();
    } catch (err) {
      console.warn('Camera/MediaPipe init failed, using click fallback:', err);
      this.useFallback = true;
      this._setupClickFallback();
      this.enterThrow();
    }
  },

  async _initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' }
    });
    this.el.video.srcObject = stream;
    await this.el.video.play();
  },

  _setLoadingText(text) {
    const lt = document.querySelector('.loading-text');
    if (lt) lt.textContent = text;
  },

  // --- Gesture Callbacks ---
  _setupGestureCallbacks() {
    GestureSystem.onStateChange = (state, prev) => {
      if (this.state !== 'THROW' || this.isAnimating) return;

      this._updateGestureUI(state);

      // Detect hold → release sequence to trigger throw
      if (state === 'holding') {
        this.hasHeld = true;
        this.el.throwPrompt.textContent = '張開雙手，擲出！';
        this.el.throwPrompt.classList.remove('pulse');
      }

      if (state === 'released' && prev === 'holding' && this.hasHeld) {
        this.hasHeld = false;
        this.performThrow();
      }
    };
  },

  _updateGestureUI(state) {
    const leftEl = this.el.gestureHandLeft;
    const rightEl = this.el.gestureHandRight;
    const label = this.el.gestureLabel;

    // Reset classes
    leftEl.className = 'gesture-hand';
    rightEl.className = 'gesture-hand';

    const lh = GestureSystem.leftHand;
    const rh = GestureSystem.rightHand;

    // Left hand icon
    if (lh === 'grab') {
      leftEl.textContent = '✊';
      leftEl.classList.add('grab');
    } else if (lh === 'open' || lh === 'point') {
      leftEl.textContent = '✋';
      leftEl.classList.add('detected');
    } else {
      leftEl.textContent = '✋';
    }

    // Right hand icon
    if (rh === 'grab') {
      rightEl.textContent = '✊';
      rightEl.classList.add('grab');
    } else if (rh === 'open' || rh === 'point') {
      rightEl.textContent = '✋';
      rightEl.classList.add('detected');
    } else {
      rightEl.textContent = '✋';
    }

    // Label
    if (state === 'holding') {
      label.textContent = '很好，準備好就張開雙手';
    } else if (state === 'released') {
      label.textContent = '';
    } else if (lh !== 'none' || rh !== 'none') {
      label.textContent = '請雙手握拳';
    } else {
      label.textContent = '將雙手伸到鏡頭前';
    }
  },

  // --- Click/Touch Fallback ---
  _setupClickFallback() {
    this._showFallbackNotice();
    if (this.fallbackBound) return;
    this.fallbackBound = true;

    this.el.throwContainer.addEventListener('click', () => {
      if (!this.useFallback) return;
      this.performThrow();
    });
  },

  _showFallbackNotice() {
    const n = this.el.fallbackNotice;
    if (n) n.classList.add('visible');
  },

  _hideFallbackNotice() {
    const n = this.el.fallbackNotice;
    if (n) n.classList.remove('visible');
  },

  // --- State: THROW ---
  enterThrow() {
    this.state = 'THROW';
    this.isAnimating = false;
    this.hasHeld = false;
    this.showScreen('throwScreen');
    Animations.reset();

    if (this.useFallback) {
      this.el.throwContainer.classList.add('fallback');
      this.el.gestureStatus.classList.add('hidden');
      this._showFallbackNotice();
    } else {
      this.el.throwContainer.classList.remove('fallback');
      this.el.gestureStatus.classList.remove('hidden');
      GestureSystem.start();
      this._updateGestureUI('none');
    }

    this._updateThrowUI();
    this._showMeditation();
  },

  _updateThrowUI() {
    const mode = this.currentMode;
    if (!mode) return;

    if (mode.id === 'single') {
      this.el.throwRoundInfo.textContent = '';
    } else if (mode.id === 'triple') {
      this.el.throwRoundInfo.textContent = `第 ${this.currentThrow + 1} / ${mode.totalThrows} 擲`;
    } else if (mode.id === 'consecutive') {
      const consecutive = this._getConsecutiveHoly();
      this.el.throwRoundInfo.textContent = `第 ${this.currentThrow + 1} 擲（已連續 ${consecutive} 次聖筊）`;
    }

    if (this.useFallback) {
      this.el.throwPrompt.textContent = '點擊畫面擲筊';
    } else {
      this.el.throwPrompt.textContent = '雙手握拳，張開即擲';
    }
    this.el.throwPrompt.classList.add('pulse');
    this.el.throwPrompt.classList.remove('hidden');
  },

  _getConsecutiveHoly() {
    let count = 0;
    for (let i = this.throwResults.length - 1; i >= 0; i--) {
      if (this.throwResults[i] === 'holy') count++;
      else break;
    }
    return count;
  },

  // --- Perform Throw ---
  async performThrow() {
    if (this.state !== 'THROW' || this.isAnimating) return;

    this.isAnimating = true;
    this._stopMeditation();
    this.el.throwPrompt.classList.add('hidden');
    if (!this.useFallback) {
      this.el.gestureStatus.classList.add('hidden');
    }

    // Determine result
    const result = throwJiaobei();
    this.throwResults.push(result);
    this.currentThrow++;

    // Play throw animation
    await Animations.throwBlocks(result);

    // Show brief result feedback
    const r = RESULTS[result];
    this.el.throwPrompt.textContent = `${r.icon} ${r.name}`;
    this.el.throwPrompt.classList.remove('hidden', 'pulse');

    await this._delay(1500);

    // Check if we should continue or show results
    if (this._shouldContinue()) {
      this.isAnimating = false;
      this.hasHeld = false;
      Animations.reset();

      if (!this.useFallback) {
        this.el.gestureStatus.classList.remove('hidden');
        this._updateGestureUI('none');
      }

      this._updateThrowUI();
      this._showMeditation();
    } else {
      this.enterResult();
    }
  },

  _shouldContinue() {
    const mode = this.currentMode;
    if (!mode) return false;

    if (mode.id === 'single') return false;

    if (mode.id === 'triple') {
      return this.currentThrow < mode.totalThrows;
    }

    if (mode.id === 'consecutive') {
      const consecutive = this._getConsecutiveHoly();
      if (consecutive >= mode.targetConsecutive) return false;
      if (this.currentThrow >= 20) return false;
      return true;
    }

    return false;
  },

  // --- State: RESULT ---
  enterResult() {
    this.state = 'RESULT';
    this._stopMeditation();
    GestureSystem.stop();

    const mode = this.currentMode;
    const verdict = mode.getVerdict(this.throwResults);
    const verdictText = mode.getVerdictText(this.throwResults);
    const r = RESULTS[verdict];

    this.el.resultIcon.textContent = r.icon;
    this.el.resultTitle.textContent = r.name;
    this.el.resultTitle.className = `result-title ${r.cssClass}`;
    this.el.resultMeaning.textContent = verdictText;

    // Build throw history for multi-throw modes
    this.el.resultHistory.innerHTML = '';
    if (this.throwResults.length > 1) {
      this.throwResults.forEach((res, i) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.style.animationDelay = `${i * 0.1}s`;
        const ri = RESULTS[res];
        item.innerHTML = `
          <span class="history-round">第 ${i + 1} 擲</span>
          <span class="history-icon">${ri.icon}</span>
          <span class="history-label">${ri.name}</span>
        `;
        this.el.resultHistory.appendChild(item);
      });
    }

    this.el.resultDetail.textContent = r.detail;
    this.showScreen('resultScreen');
  },

  // --- Meditation ---
  _showMeditation() {
    const overlay = this.el.meditationOverlay;
    const text = this.el.meditationText;
    if (!overlay || !text) return;

    overlay.classList.remove('hidden');
    text.textContent = randomMeditation();

    this._stopMeditation();
    this.meditationTimer = setInterval(() => {
      if (this.state !== 'THROW') return;
      text.classList.add('fading');
      setTimeout(() => {
        text.textContent = randomMeditation();
        text.classList.remove('fading');
      }, 500);
    }, 3500);
  },

  _stopMeditation() {
    if (this.meditationTimer) {
      clearInterval(this.meditationTimer);
      this.meditationTimer = null;
    }
    const overlay = this.el.meditationOverlay;
    if (overlay) overlay.classList.add('hidden');
  },

  // --- Utility ---
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
