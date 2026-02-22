// app.js - Application state machine and main controller

const App = {
  state: 'MENU', // MENU | INITIALIZING | SHUFFLE | DRAW | READING
  selectedSpread: null,
  slots: [],
  floatingCard: null,
  drawnCard: null,
  useFallback: false,
  fallbackBound: false,
  isMouseDown: false,
  _lastCursorPos: null,

  // Shuffle idle timer
  shuffleIdleTimer: null,
  shuffleIdleMs: 5000,
  shuffleHasMoved: false,

  // Shuffle meditation prompts
  shuffleMeditationTimer: null,
  shuffleMeditations: [
    '在心中默想你的問題...',
    '讓思緒沉澱，專注於內心...',
    '深呼吸，感受此刻的寧靜...',
    '將你的疑問交付給牌...',
    '放下雜念，聆聽直覺的聲音...',
    '讓牌感受你的能量...',
    '靜下心來，答案正在浮現...',
    '信任你的直覺...',
    '此刻只有你與牌的對話...',
    '帶著誠意，牌會回應你...',
  ],

  init() {
    UI.init();

    document.querySelectorAll('.spread-card').forEach(el => {
      el.addEventListener('click', () => {
        const spreadId = el.dataset.spread;
        if (!SPREADS[spreadId]) return;
        this.selectSpread(spreadId);
      });
    });

    UI.elements.btnRestart.addEventListener('click', () => {
      this.restart();
    });

    UI.elements.btnCloseReading.addEventListener('click', () => {
      this.restart();
    });

    this.showMenu();
  },

  showMenu() {
    this.state = 'MENU';
    UI.showScreen('menuScreen');
    UI.hideVideo();
    UI.hideInstruction();
    UI.hideMeditation();
    UI.hideReading();
    UI.hideCursor();
    UI.hideFallbackNotice();
    GestureSystem.stop();
  },

  async selectSpread(spreadId) {
    this.selectedSpread = SPREADS[spreadId];
    SpreadLayout.setSpread(spreadId);
    Deck.init();

    this.state = 'INITIALIZING';
    UI.showScreen('loadingScreen');
    UI.setLoadingText('正在啟動視訊鏡頭...');

    try {
      await this._initCamera();
      UI.setLoadingText('正在載入手勢辨識模型...');
      await GestureSystem.init(UI.elements.video);
      this._setupGestureCallbacks();
      GestureSystem.start();
      UI.showVideo();
      this.useFallback = false;
      this.enterShuffle();
    } catch (err) {
      console.warn('Camera/MediaPipe init failed, using mouse fallback:', err);
      this.useFallback = true;
      this._setupMouseFallback();
      this.enterShuffle();
    }
  },

  async _initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' }
    });
    UI.elements.video.srcObject = stream;
    await UI.elements.video.play();
  },

  _setupGestureCallbacks() {
    GestureSystem.onHandMove = (nx, ny) => {
      const x = nx * window.innerWidth;
      const y = ny * window.innerHeight;
      UI.updateCursor(x, y, GestureSystem.confirmedGesture);

      if (this.state === 'SHUFFLE') {
        this._onShuffleMove(x, y);
      } else if (this.state === 'DRAW') {
        if (this.floatingCard) {
          Animations.moveFloatingCard(this.floatingCard, x, y);
        } else {
          // Highlight nearest fan card
          const nearest = Animations.getNearestFanCard(x, y);
          Animations.highlightFanCard(nearest);
        }
      }
    };

    GestureSystem.onGestureChange = (gesture, prev) => {
      if (this.state === 'SHUFFLE' && gesture === 'grab' && this.shuffleHasMoved) {
        this._finishShuffle();
        return;
      }
      if (this.state === 'DRAW') {
        this._handleDrawGesture(gesture, prev);
      }
    };
  },

  // --- Mouse/Touch Fallback (bind only once) ---
  _setupMouseFallback() {
    UI.showFallbackNotice();
    if (this.fallbackBound) return;
    this.fallbackBound = true;

    const table = UI.elements.tableScreen;

    table.addEventListener('mousemove', (e) => {
      if (!this.useFallback) return;
      this._lastCursorPos = { x: e.clientX, y: e.clientY };
      UI.updateCursor(e.clientX, e.clientY, this.isMouseDown ? 'grab' : 'point');
      if (this.state === 'SHUFFLE') {
        this._onShuffleMove(e.clientX, e.clientY);
      } else if (this.state === 'DRAW') {
        if (this.floatingCard) {
          Animations.moveFloatingCard(this.floatingCard, e.clientX, e.clientY);
        } else {
          const nearest = Animations.getNearestFanCard(e.clientX, e.clientY);
          Animations.highlightFanCard(nearest);
        }
      }
    });

    table.addEventListener('mousedown', (e) => {
      if (!this.useFallback) return;
      this.isMouseDown = true;
      if (this.state === 'DRAW' && !this.floatingCard) {
        this._handleDrawGesture('grab', 'point');
      }
    });

    table.addEventListener('mouseup', (e) => {
      if (!this.useFallback) return;
      this.isMouseDown = false;
      if (this.state === 'DRAW' && this.floatingCard) {
        this._handleDrawGesture('open', 'grab');
      }
    });

    table.addEventListener('touchstart', (e) => {
      if (!this.useFallback) return;
      const t = e.touches[0];
      this.isMouseDown = true;
      this._lastCursorPos = { x: t.clientX, y: t.clientY };
      UI.updateCursor(t.clientX, t.clientY, 'grab');
      if (this.state === 'SHUFFLE') {
        this._onShuffleMove(t.clientX, t.clientY);
      } else if (this.state === 'DRAW') {
        // Highlight nearest card on touch, then draw
        const nearest = Animations.getNearestFanCard(t.clientX, t.clientY);
        Animations.highlightFanCard(nearest);
        if (!this.floatingCard) {
          this._handleDrawGesture('grab', 'point');
        }
      }
    });

    table.addEventListener('touchmove', (e) => {
      if (!this.useFallback) return;
      e.preventDefault();
      const t = e.touches[0];
      this._lastCursorPos = { x: t.clientX, y: t.clientY };
      UI.updateCursor(t.clientX, t.clientY, 'grab');
      if (this.state === 'SHUFFLE') {
        this._onShuffleMove(t.clientX, t.clientY);
      } else if (this.state === 'DRAW') {
        if (this.floatingCard) {
          Animations.moveFloatingCard(this.floatingCard, t.clientX, t.clientY);
        }
      }
    }, { passive: false });

    table.addEventListener('touchend', () => {
      if (!this.useFallback) return;
      this.isMouseDown = false;
      if (this.state === 'DRAW' && this.floatingCard) {
        this._handleDrawGesture('open', 'grab');
      }
    });
  },

  // --- State: SHUFFLE ---
  enterShuffle() {
    this.state = 'SHUFFLE';
    this.shuffleHasMoved = false;
    UI.showScreen('tableScreen');
    Animations.init(UI.elements.deckArea, UI.elements.spreadArea);

    // Scatter cards full-screen, do NOT create spread slots yet
    Animations.scatterCards(UI.elements.shuffleArea);

    const opHint = this.useFallback
      ? '在牌面上移動滑鼠來洗牌，停止後自動結束'
      : '在牌面上揮動手掌來洗牌，握拳代表洗牌結束 ✊';

    UI.showMeditation(this._randomMeditation(), opHint);
    this._startMeditationCycle();
  },

  _randomMeditation() {
    return this.shuffleMeditations[
      Math.floor(Math.random() * this.shuffleMeditations.length)
    ];
  },

  _startMeditationCycle() {
    this._stopMeditationCycle();
    this.shuffleMeditationTimer = setInterval(() => {
      if (this.state !== 'SHUFFLE') return;
      UI.updateMeditationText(this._randomMeditation());
    }, 3500);
  },

  _stopMeditationCycle() {
    if (this.shuffleMeditationTimer) {
      clearInterval(this.shuffleMeditationTimer);
      this.shuffleMeditationTimer = null;
    }
  },

  _onShuffleMove(x, y) {
    if (this.state !== 'SHUFFLE') return;

    this.shuffleHasMoved = true;
    Animations.pushCardsNear(x, y);

    // Reset 3-second idle timer
    if (this.shuffleIdleTimer) clearTimeout(this.shuffleIdleTimer);
    this.shuffleIdleTimer = setTimeout(() => this._finishShuffle(), this.shuffleIdleMs);
  },

  async _finishShuffle() {
    if (this.state !== 'SHUFFLE' || !this.shuffleHasMoved) return;
    this.state = 'INITIALIZING'; // prevent re-trigger
    this._stopMeditationCycle();
    UI.hideMeditation();

    UI.showInstruction('洗牌完成');

    Deck.shuffle();
    await Animations.gatherCards();

    // Create spread slots in upper area
    this.slots = Animations.createSpreadSlots(this.selectedSpread);

    // Create fan layout at bottom (full 78-card deck)
    Animations.createFanLayout(UI.elements.deckArea, 78);

    this.enterDraw();
  },

  // --- State: DRAW ---
  enterDraw() {
    this.state = 'DRAW';
    this.floatingCard = null;
    this.drawnCard = null;

    const nextSlot = SpreadLayout.getNextSlotIndex();
    if (nextSlot < 0) {
      this.enterReading();
      return;
    }

    Animations.highlightSlot(this.slots, nextSlot);

    const pos = this.selectedSpread.positions[nextSlot];
    const remaining = this.selectedSpread.cardCount - nextSlot;

    if (this.useFallback) {
      UI.showInstruction(
        `抽第 ${nextSlot + 1} 張牌 — ${pos.labelCN}`,
        `從下方選一張牌，拖曳到位置放下（剩餘 ${remaining} 張）`
      );
    } else {
      UI.showInstruction(
        `抽第 ${nextSlot + 1} 張牌 — ${pos.labelCN}`,
        `握拳抽牌，移到位置後張開手放牌（剩餘 ${remaining} 張）`
      );
    }
  },

  async _handleDrawGesture(gesture, prev) {
    if (this.state !== 'DRAW') return;

    if (gesture === 'grab' && !this.floatingCard) {
      // Find which fan card is highlighted
      const fanIdx = Animations.fanHighlightIdx;
      if (fanIdx < 0) return;

      this.drawnCard = Deck.draw();
      if (!this.drawnCard) return;

      const screenPos = this.useFallback
        ? this._lastCursorPos || { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        : GestureSystem.getScreenPos();

      this.floatingCard = await Animations.drawFromFan(
        fanIdx, screenPos.x, screenPos.y
      );
    }

    if (gesture === 'open' && this.floatingCard && this.drawnCard) {
      const nextSlot = SpreadLayout.getNextSlotIndex();
      if (nextSlot < 0) return;

      const slotEl = this.slots[nextSlot];
      await Animations.animateToSlot(this.floatingCard, slotEl);
      this.floatingCard = null;

      Animations.createCardInSlot(slotEl, this.drawnCard);
      SpreadLayout.placeCard(this.drawnCard, nextSlot);
      Animations.clearHighlights(this.slots);

      this.drawnCard = null;

      if (SpreadLayout.isComplete()) {
        await new Promise(r => setTimeout(r, 300));
        this.enterReading();
      } else {
        this.enterDraw();
      }
    }
  },

  // --- State: READING ---
  async enterReading() {
    this.state = 'READING';
    UI.hideInstruction();
    UI.hideCursor();
    if (!this.useFallback) {
      GestureSystem.stop();
    }

    const cardElements = this.slots
      .map(slot => slot.querySelector('.card'))
      .filter(Boolean);

    await Animations.flipAllCards(cardElements, 500);

    UI.showReading(this.selectedSpread, SpreadLayout.placedCards);
  },

  // --- Restart ---
  restart() {
    if (this.floatingCard) {
      this.floatingCard.remove();
      this.floatingCard = null;
    }

    UI.elements.spreadArea.innerHTML = '';
    Animations.clearFan(UI.elements.deckArea);
    UI.elements.shuffleArea.innerHTML = '';
    UI.elements.shuffleArea.classList.remove('active');
    SpreadLayout.reset();
    Deck.reset();

    this.slots = [];
    this.drawnCard = null;
    this.selectedSpread = null;
    this.shuffleHasMoved = false;
    if (this.shuffleIdleTimer) {
      clearTimeout(this.shuffleIdleTimer);
      this.shuffleIdleTimer = null;
    }
    this._stopMeditationCycle();

    if (!this.useFallback) {
      GestureSystem.stop();
    }

    this.showMenu();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
