// ui.js - UI control: cursor, instructions, video, reading panel

const UI = {
  elements: {},

  init() {
    this.elements = {
      cursor: document.getElementById('gesture-cursor'),
      instruction: document.getElementById('instruction-banner'),
      instructionText: document.querySelector('.instruction-text'),
      instructionSub: document.querySelector('.instruction-sub'),
      shuffleArea: document.getElementById('shuffle-area'),
      video: document.getElementById('webcam'),
      menuScreen: document.getElementById('menu-screen'),
      loadingScreen: document.getElementById('loading-screen'),
      tableScreen: document.getElementById('table-screen'),
      deckArea: document.getElementById('deck-area'),
      spreadArea: document.getElementById('spread-area'),
      readingPanel: document.getElementById('reading-panel'),
      readingCards: document.getElementById('reading-cards'),
      readingTitle: document.getElementById('reading-title'),
      btnCloseReading: document.getElementById('btn-close-reading'),
      btnRestart: document.getElementById('btn-restart'),
      fallbackNotice: document.getElementById('fallback-notice'),
      meditationOverlay: document.getElementById('meditation-overlay'),
      meditationText: document.getElementById('meditation-text'),
      meditationHint: document.getElementById('meditation-hint'),
    };
  },

  // --- Screen switching ---
  showScreen(name) {
    const screens = ['menuScreen', 'loadingScreen', 'tableScreen'];
    screens.forEach(s => {
      const el = this.elements[s];
      if (!el) return;
      if (s === name) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  },

  // --- Gesture cursor ---
  updateCursor(x, y, gesture) {
    const c = this.elements.cursor;
    if (!c) return;
    c.classList.add('active');
    c.style.left = `${x - 18}px`;
    c.style.top = `${y - 18}px`;

    c.classList.remove('grabbing', 'open');
    if (gesture === 'grab') c.classList.add('grabbing');
    if (gesture === 'open') c.classList.add('open');
  },

  hideCursor() {
    const c = this.elements.cursor;
    if (c) c.classList.remove('active');
  },

  // --- Instructions ---
  showInstruction(text, sub = '') {
    const banner = this.elements.instruction;
    if (!banner) return;
    banner.classList.remove('hidden');
    this.elements.instructionText.textContent = text;
    this.elements.instructionSub.textContent = sub;
  },

  hideInstruction() {
    const banner = this.elements.instruction;
    if (banner) banner.classList.add('hidden');
  },

  // --- Video (hidden, only for gesture detection) ---
  showVideo() {},
  hideVideo() {},

  // --- Loading ---
  setLoadingText(text) {
    const lt = document.querySelector('.loading-text');
    if (lt) lt.textContent = text;
  },

  // --- Reading Panel ---
  showReading(spread, placedCards) {
    const panel = this.elements.readingPanel;
    const cardsContainer = this.elements.readingCards;
    if (!panel || !cardsContainer) return;

    cardsContainer.innerHTML = '';
    cardsContainer.dataset.count = spread.cardCount;

    placedCards.forEach((card, i) => {
      if (!card) return;
      const pos = spread.positions[i];
      const reading = card.isReversed ? card.reversed : card.upright;

      const item = document.createElement('div');
      item.className = 'reading-card-item';
      item.innerHTML = `
        <div class="reading-card-header">
          <span class="reading-card-position">${pos.labelCN}</span>
          <span class="reading-card-name">${card.symbol} ${card.nameCN} (${card.name})</span>
          ${card.isReversed ? '<span class="reading-card-orientation">逆位</span>' : ''}
        </div>
        <div class="reading-card-meaning">${reading.description}</div>
        <div class="reading-card-keywords">
          ${reading.keywords.map(k => `<span class="reading-keyword">${k}</span>`).join('')}
        </div>
      `;
      cardsContainer.appendChild(item);
    });

    this.elements.readingTitle.textContent = `${spread.nameCN} — 解讀`;
    panel.classList.add('visible');
  },

  hideReading() {
    const panel = this.elements.readingPanel;
    if (panel) panel.classList.remove('visible');
  },

  // --- Meditation ---
  showMeditation(text, hint) {
    const overlay = this.elements.meditationOverlay;
    if (!overlay) return;
    overlay.classList.remove('hidden');
    this.elements.meditationText.textContent = text;
    this.elements.meditationHint.textContent = hint;
  },

  updateMeditationText(text) {
    const el = this.elements.meditationText;
    if (!el) return;
    el.classList.add('fading');
    setTimeout(() => {
      el.textContent = text;
      el.classList.remove('fading');
    }, 500);
  },

  hideMeditation() {
    const overlay = this.elements.meditationOverlay;
    if (overlay) overlay.classList.add('hidden');
  },

  showFallbackNotice() {
    const n = this.elements.fallbackNotice;
    if (n) n.classList.add('visible');
  },

  hideFallbackNotice() {
    const n = this.elements.fallbackNotice;
    if (n) n.classList.remove('visible');
  }
};
