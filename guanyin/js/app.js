// app.js - Guanyin Oracle state machine and main controller

const DEBUG = new URLSearchParams(window.location.search).has('debug');

const App = {
  // MENU | PRAYER | INITIALIZING | FIRST_THROW | DRAW_STICK | SHOW_STICK | CONFIRM_THROW | RESULT
  state: 'MENU',
  isAnimating: false,
  useFallback: false,
  fallbackBound: false,
  hasHeld: false,
  meditationTimer: null,

  // Oracle state
  currentLotNumber: null,
  confirmCount: 0,       // how many consecutive holy in confirm phase (0-3)

  // DOM elements cache
  el: {},

  init() {
    this.el = {
      menuScreen: document.getElementById('menu-screen'),
      loadingScreen: document.getElementById('loading-screen'),
      prayerScreen: document.getElementById('prayer-screen'),
      throwScreen: document.getElementById('throw-screen'),
      drawScreen: document.getElementById('draw-screen'),
      stickScreen: document.getElementById('stick-screen'),
      resultScreen: document.getElementById('result-screen'),
      btnStart: document.getElementById('btn-start'),
      btnStartThrow: document.getElementById('btn-start-throw'),
      throwContainer: document.getElementById('throw-container'),
      throwRoundInfo: document.getElementById('throw-round-info'),
      throwPrompt: document.getElementById('throw-prompt'),
      confirmProgress: document.getElementById('confirm-progress'),
      dots: [
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3')
      ],
      gestureStatus: document.getElementById('gesture-status'),
      gestureHandLeft: document.getElementById('gesture-hand-left'),
      gestureHandRight: document.getElementById('gesture-hand-right'),
      gestureLabel: document.getElementById('gesture-label'),
      stickContainer: document.getElementById('stick-container'),
      stickNumber: document.getElementById('stick-number'),
      btnStickYes: document.getElementById('btn-stick-yes'),
      btnStickNo: document.getElementById('btn-stick-no'),
      resultLotNumber: document.getElementById('result-lot-number'),
      resultFortuneBadge: document.getElementById('result-fortune-badge'),
      resultTitle: document.getElementById('result-title'),
      poemContainer: document.getElementById('poem-container'),
      resultInterpretation: document.getElementById('result-interpretation'),
      adviceGrid: document.getElementById('advice-grid'),
      btnAgain: document.getElementById('btn-again'),
      btnHome: document.getElementById('btn-home'),
      meditationOverlay: document.getElementById('meditation-overlay'),
      meditationText: document.getElementById('meditation-text'),
      video: document.getElementById('webcam'),
      fallbackNotice: document.getElementById('fallback-notice'),
    };

    Animations.init();

    // Menu start
    this.el.btnStart.addEventListener('click', () => {
      this.enterPrayer();
    });

    // Prayer → throw
    this.el.btnStartThrow.addEventListener('click', () => {
      this._initAndEnterThrow('FIRST_THROW');
    });

    // Stick container → draw (fallback click only)
    this.el.stickContainer.addEventListener('click', () => {
      if (this.useFallback) this.drawStick();
    });

    // Stick confirmation buttons
    this.el.btnStickYes.addEventListener('click', () => {
      if (DEBUG) {
        this.enterResult();
      } else {
        this._initAndEnterThrow('CONFIRM_THROW');
      }
    });

    this.el.btnStickNo.addEventListener('click', () => {
      this.enterDraw();
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
    const screens = [
      'menuScreen', 'loadingScreen', 'prayerScreen',
      'throwScreen', 'drawScreen', 'stickScreen', 'resultScreen'
    ];
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
    this.currentLotNumber = null;
    this.confirmCount = 0;
    this._stopMeditation();
    GestureSystem.stop();
    this._hideFallbackNotice();
    this.showScreen('menuScreen');
  },

  // --- State: PRAYER ---
  enterPrayer() {
    this.state = 'PRAYER';
    this.currentLotNumber = null;
    this.confirmCount = 0;
    this.showScreen('prayerScreen');
  },

  // --- Camera & Gesture Init ---
  async _initAndEnterThrow(targetState) {
    this.state = 'INITIALIZING';
    this.showScreen('loadingScreen');
    this._setLoadingText('正在啟動視訊鏡頭...');

    try {
      await this._initCamera();
      this._setLoadingText('正在載入手勢辨識模型...');
      await GestureSystem.init(this.el.video);
      this._setupGestureCallbacks();
      this.useFallback = false;
      this.enterThrow(targetState);
    } catch (err) {
      console.warn('Camera/MediaPipe init failed, using click fallback:', err);
      this.useFallback = true;
      this._setupClickFallback();
      this.enterThrow(targetState);
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
    // Combined two-hand state change — for throw screens
    GestureSystem.onStateChange = (state, prev) => {
      if (this.isAnimating) return;
      if (this.state !== 'FIRST_THROW' && this.state !== 'CONFIRM_THROW') return;

      this._updateGestureUI(state);

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

    // Per-frame hand update — for single-hand stick drawing
    GestureSystem.onHandUpdate = (lh, rh) => {
      if (this.isAnimating || this.state !== 'DRAW_STICK') return;

      const anyGrab = lh === 'grab' || rh === 'grab';
      this._updateDrawGestureUI(anyGrab, lh, rh);

      if (anyGrab && !this._drawHasHeld) {
        this._drawHasHeld = true;
        this._shakeStartTime = Date.now();
        Animations.startShake();
      }

      if (!anyGrab && this._drawHasHeld) {
        this._drawHasHeld = false;
        const elapsed = Date.now() - (this._shakeStartTime || 0);
        if (elapsed >= 800) {
          this.drawStick();
        } else {
          Animations.stopShake();
        }
      }
    };
  },

  _drawHasHeld: false,
  _shakeStartTime: 0,

  _updateDrawGestureUI(anyGrab, lh, rh) {
    const hint = document.getElementById('draw-hint');
    const gestureUI = document.getElementById('draw-gesture-status');
    if (!gestureUI) return;

    gestureUI.classList.remove('hidden');
    const handEl = gestureUI.querySelector('.gesture-hand');
    const label = gestureUI.querySelector('.gesture-label');
    if (!handEl || !label) return;

    handEl.className = 'gesture-hand';

    if (anyGrab) {
      handEl.textContent = '✊';
      handEl.classList.add('grab');
      label.textContent = '搖動中...張開手掌抽籤';
      if (hint) hint.textContent = '';
    } else if (lh !== 'none' || rh !== 'none') {
      handEl.textContent = '✋';
      handEl.classList.add('detected');
      label.textContent = '握拳搖動籤筒';
      if (hint) hint.textContent = '';
    } else {
      handEl.textContent = '✋';
      label.textContent = '將手伸到鏡頭前';
      if (hint) hint.textContent = '握拳搖動籤筒，張開手掌抽籤';
    }
  },

  _updateGestureUI(state) {
    const leftEl = this.el.gestureHandLeft;
    const rightEl = this.el.gestureHandRight;
    const label = this.el.gestureLabel;

    leftEl.className = 'gesture-hand';
    rightEl.className = 'gesture-hand';

    const lh = GestureSystem.leftHand;
    const rh = GestureSystem.rightHand;

    if (lh === 'grab') {
      leftEl.textContent = '✊';
      leftEl.classList.add('grab');
    } else if (lh === 'open' || lh === 'point') {
      leftEl.textContent = '✋';
      leftEl.classList.add('detected');
    } else {
      leftEl.textContent = '✋';
    }

    if (rh === 'grab') {
      rightEl.textContent = '✊';
      rightEl.classList.add('grab');
    } else if (rh === 'open' || rh === 'point') {
      rightEl.textContent = '✋';
      rightEl.classList.add('detected');
    } else {
      rightEl.textContent = '✋';
    }

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

  // --- State: FIRST_THROW / CONFIRM_THROW ---
  enterThrow(targetState) {
    this.state = targetState || 'FIRST_THROW';
    this.isAnimating = false;
    this.hasHeld = false;
    this.showScreen('throwScreen');
    Animations.reset();

    // Show/hide confirm progress dots
    if (this.state === 'CONFIRM_THROW') {
      this.confirmCount = 0;
      this.el.confirmProgress.classList.remove('hidden');
      this.el.dots.forEach(d => { d.className = 'confirm-dot'; });
    } else {
      this.el.confirmProgress.classList.add('hidden');
    }

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
    if (this.state === 'FIRST_THROW') {
      this.el.throwRoundInfo.textContent = '擲筊求允';
    } else if (this.state === 'CONFIRM_THROW') {
      this.el.throwRoundInfo.textContent = `確認擲筊 — 第 ${this.confirmCount + 1} / 3 擲`;
    }

    if (this.useFallback) {
      this.el.throwPrompt.textContent = '點擊畫面擲筊';
    } else {
      this.el.throwPrompt.textContent = '雙手握拳，張開即擲';
    }
    this.el.throwPrompt.classList.add('pulse');
    this.el.throwPrompt.classList.remove('hidden');
  },

  // --- Perform Throw ---
  async performThrow() {
    if ((this.state !== 'FIRST_THROW' && this.state !== 'CONFIRM_THROW') || this.isAnimating) return;

    this.isAnimating = true;
    this._stopMeditation();
    this.el.throwPrompt.classList.add('hidden');
    if (!this.useFallback) {
      this.el.gestureStatus.classList.add('hidden');
    }

    const result = DEBUG ? 'holy' : throwJiaobei();
    await Animations.throwBlocks(result);

    const r = RESULTS[result];
    this.el.throwPrompt.textContent = `${r.icon} ${r.name}`;
    this.el.throwPrompt.classList.remove('hidden', 'pulse');

    await this._delay(1500);

    if (this.state === 'FIRST_THROW') {
      this._handleFirstThrowResult(result);
    } else if (this.state === 'CONFIRM_THROW') {
      this._handleConfirmThrowResult(result);
    }
  },

  _handleFirstThrowResult(result) {
    if (result === 'holy') {
      // 聖筊 → go to draw
      this.el.throwPrompt.textContent = '菩薩允准，請抽籤';
      this.el.throwPrompt.classList.remove('hidden');
      this._delay(1000).then(() => {
        this.enterDraw();
      });
    } else {
      // 非聖筊 → stay, let user try again
      this.isAnimating = false;
      this.hasHeld = false;
      Animations.reset();

      if (!this.useFallback) {
        this.el.gestureStatus.classList.remove('hidden');
        this._updateGestureUI('none');
      }

      this._updateThrowUI();
      this.el.throwRoundInfo.textContent = '尚未獲允，再擲一次';
      this._showMeditation();
    }
  },

  _handleConfirmThrowResult(result) {
    if (result === 'holy') {
      // 聖筊 → light up dot green
      this.el.dots[this.confirmCount].classList.add('success');
      this.confirmCount++;

      if (this.confirmCount >= 3) {
        // 三聖筊 → show result
        this._delay(800).then(() => {
          this.enterResult();
        });
        return;
      }

      // Continue to next confirm throw
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
      // 非聖筊 → light dot red, go back to draw
      this.el.dots[this.confirmCount].classList.add('fail');
      this.el.throwPrompt.textContent = '此籤未獲允准，重新抽籤';
      this.el.throwPrompt.classList.remove('hidden');

      this._delay(1500).then(() => {
        this.enterDraw();
      });
    }
  },

  // --- State: DRAW_STICK ---
  enterDraw() {
    this.state = 'DRAW_STICK';
    this.currentLotNumber = null;
    this.confirmCount = 0;
    this._drawHasHeld = false;
    this._stopMeditation();
    Animations.resetStickContainer();
    this.isAnimating = false;
    this.showScreen('drawScreen');

    // Start gesture for shake detection (if available)
    if (!this.useFallback) {
      GestureSystem.start();
      this._hideFallbackNotice();
      // hide fallback click hint, show gesture UI
      const gestureUI = document.getElementById('draw-gesture-status');
      if (gestureUI) gestureUI.classList.remove('hidden');
    } else {
      this._showFallbackNotice();
      const gestureUI = document.getElementById('draw-gesture-status');
      if (gestureUI) gestureUI.classList.add('hidden');
    }
  },

  async drawStick() {
    if (this.state !== 'DRAW_STICK' || this.isAnimating) return;
    this.isAnimating = true;

    let lotNumber;
    if (this.useFallback) {
      // Fallback: click triggers full shake + draw
      lotNumber = await Animations.shakeAndDraw();
    } else {
      // Gesture: container already shaking, just draw
      lotNumber = await Animations.drawStickFromContainer();
    }
    this.currentLotNumber = lotNumber;

    await this._delay(600);
    this.isAnimating = false;
    this.enterShowStick();
  },

  // --- State: SHOW_STICK ---
  enterShowStick() {
    this.state = 'SHOW_STICK';

    this.el.stickNumber.textContent = `第 ${this.currentLotNumber} 籤`;

    this.showScreen('stickScreen');
  },

  // --- State: RESULT ---
  enterResult() {
    this.state = 'RESULT';
    this._stopMeditation();
    GestureSystem.stop();

    const lot = getLot(this.currentLotNumber);
    const fortune = FORTUNE_LEVELS[lot.fortune];

    // Lot number
    this.el.resultLotNumber.textContent = `第 ${lot.number} 籤`;

    // Fortune badge
    this.el.resultFortuneBadge.textContent = fortune.label;
    this.el.resultFortuneBadge.className = `result-fortune-badge ${fortune.cssClass}`;

    // Title
    this.el.resultTitle.textContent = lot.title;

    // Poem
    this.el.poemContainer.innerHTML = '';
    lot.poem.forEach(line => {
      const div = document.createElement('div');
      div.className = 'poem-line';
      div.textContent = line;
      this.el.poemContainer.appendChild(div);
    });

    // Interpretation
    this.el.resultInterpretation.textContent = lot.interpretation;

    // Advice grid
    const adviceLabels = {
      marriage: '婚姻', career: '事業', health: '健康', wealth: '財運',
      travel: '出行', lawsuit: '訴訟', lostItem: '失物', pregnancy: '求孕'
    };

    this.el.adviceGrid.innerHTML = '';
    Object.entries(adviceLabels).forEach(([key, label]) => {
      if (!lot.advice[key]) return;
      const item = document.createElement('div');
      item.className = 'advice-item';
      item.innerHTML = `
        <div class="advice-category">${label}</div>
        <div class="advice-text">${lot.advice[key]}</div>
      `;
      this.el.adviceGrid.appendChild(item);
    });

    this.showScreen('resultScreen');

    // Scroll result container to top
    this.el.resultScreen.querySelector('.result-container').scrollTop = 0;
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
      if (this.state !== 'FIRST_THROW' && this.state !== 'CONFIRM_THROW') return;
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
