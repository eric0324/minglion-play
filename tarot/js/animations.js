// animations.js - Animation control for shuffle, flip, draw, and place

const Animations = {
  deckArea: null,
  spreadArea: null,
  scatterCardData: [],  // {el, cx, cy, rotation}
  shuffleAreaEl: null,
  _pushPending: false,
  _pendingCursorX: 0,
  _pendingCursorY: 0,
  _prevCursorX: 0,
  _prevCursorY: 0,
  _shuffleRadius: 15,
  _shuffleAngleOffset: 0,

  init(deckArea, spreadArea) {
    this.deckArea = deckArea;
    this.spreadArea = spreadArea;
  },

  // --- Scatter Cards (circular spreading shuffle) ---
  scatterCards(container) {
    this.shuffleAreaEl = container;
    container.innerHTML = '';
    container.classList.add('active');
    this.scatterCardData = [];

    const viewW = container.clientWidth;
    const viewH = container.clientHeight;
    const count = 78;

    this._shuffleRadius = 15;
    this._shuffleAngleOffset = 0;
    this._prevCursorX = 0;
    this._prevCursorY = 0;
    this._shuffleCenterX = viewW / 2;
    this._shuffleCenterY = viewH / 2;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'scatter-card';
      el.innerHTML = '<div class="card-back"><div class="card-back-pattern"></div></div>';

      // Each card gets a fixed angle on the circle + heavy jitter for messiness
      const baseAngle = (i / count) * Math.PI * 2;
      const angleJitter = (Math.random() - 0.5) * 0.8;
      const radiusJitter = (Math.random() - 0.5) * 80;
      const rotJitter = (Math.random() - 0.5) * 50; // extra random rotation

      // Start all at center
      const x = this._shuffleCenterX - 35;
      const y = this._shuffleCenterY - 54;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = 'rotate(0deg)';
      el.style.zIndex = i;

      container.appendChild(el);

      this.scatterCardData.push({
        el,
        cx: x,
        cy: y,
        baseAngle,
        angleJitter,
        radiusJitter,
        rotJitter,
        rotation: 0
      });
    }
  },

  // --- Push cards near cursor (throttled via rAF) ---
  pushCardsNear(cursorX, cursorY) {
    this._pendingCursorX = cursorX;
    this._pendingCursorY = cursorY;
    if (this._pushPending) return;
    this._pushPending = true;
    if (this._prevCursorX === 0 && this._prevCursorY === 0) {
      this._prevCursorX = cursorX;
      this._prevCursorY = cursorY;
    }
    requestAnimationFrame(() => {
      this._doPushCards(this._pendingCursorX, this._pendingCursorY);
      this._pushPending = false;
    });
  },

  _doPushCards(cursorX, cursorY) {
    if (!this.shuffleAreaEl) return;
    const viewW = this.shuffleAreaEl.clientWidth;
    const viewH = this.shuffleAreaEl.clientHeight;
    const cx = this._shuffleCenterX;
    const cy = this._shuffleCenterY;

    const vx = cursorX - this._prevCursorX;
    const vy = cursorY - this._prevCursorY;
    this._prevCursorX = cursorX;
    this._prevCursorY = cursorY;

    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed < 2) return;

    // Grow radius with each movement, capped to stay on screen
    const maxRadius = (Math.min(viewW, viewH) / 2) - 130;
    this._shuffleRadius = Math.min(maxRadius, this._shuffleRadius + speed * 0.08);

    // Rotate circle — direction based on cursor movement relative to center
    const toCenterX = cursorX - cx;
    const toCenterY = cursorY - cy;
    const cross = toCenterX * vy - toCenterY * vx;
    this._shuffleAngleOffset += Math.sign(cross) * speed * 0.0025;

    // Update all cards
    for (const card of this.scatterCardData) {
      const angle = card.baseAngle + card.angleJitter + this._shuffleAngleOffset;
      const r = this._shuffleRadius + card.radiusJitter;

      card.cx = cx + Math.cos(angle) * r - 35;
      card.cy = cy + Math.sin(angle) * r - 54;
      card.rotation = (angle * 180 / Math.PI) + 90 + card.rotJitter;

      card.el.style.left = `${card.cx}px`;
      card.el.style.top = `${card.cy}px`;
      card.el.style.transform = `rotate(${card.rotation}deg)`;
    }
  },

  // --- Gather cards to bottom center ---
  async gatherCards() {
    if (!this.shuffleAreaEl) return;
    const viewW = this.shuffleAreaEl.clientWidth;
    const viewH = this.shuffleAreaEl.clientHeight;
    const gatherX = viewW / 2 - 35;
    const gatherY = viewH * 0.22 - 54; // gather to fan area (upper-middle)

    this.scatterCardData.forEach((card, i) => {
      card.el.classList.add('gathering');
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = (Math.random() - 0.5) * 6;
      card.el.style.left = `${gatherX + offsetX}px`;
      card.el.style.top = `${gatherY + offsetY}px`;
      card.el.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg)`;
      card.el.style.opacity = '0';
    });

    await this._delay(1000);

    // Cleanup
    this.shuffleAreaEl.innerHTML = '';
    this.shuffleAreaEl.classList.remove('active');
    this.scatterCardData = [];
  },

  // --- Fan layout state ---
  fanCards: [],       // { el, index, angle, baseX, baseY }
  fanHighlightIdx: -1,

  // --- Create fan layout (horizontal spread in middle of screen) ---
  createFanLayout(container, cardCount) {
    container.innerHTML = '';
    this.fanCards = [];
    this.fanHighlightIdx = -1;

    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    const padX = 40;
    const fanY = viewH * 0.22; // upper-middle area
    const totalWidth = viewW - padX * 2;

    const maxRotation = 10; // degrees at the edges

    for (let i = 0; i < cardCount; i++) {
      const t = cardCount === 1 ? 0.5 : i / (cardCount - 1);
      const x = padX + t * totalWidth;

      // Gentle downward arc at edges (parabolic)
      const nt = (t - 0.5) * 2; // -1 to 1
      const yOffset = nt * nt * 25;
      const y = fanY + yOffset;

      // Slight rotation fanning out from center
      const rotation = nt * maxRotation;

      // z-index: rightmost card on top
      const zIndex = i;

      const el = document.createElement('div');
      el.className = 'fan-card';
      el.innerHTML = '<div class="card"><div class="card-inner"><div class="card-face card-back"><div class="card-back-pattern"></div></div></div></div>';
      // Start stacked at the left edge
      el.style.left = `${padX}px`;
      el.style.top = `${fanY}px`;
      el.style.transform = `translate(-50%, -50%) rotate(0deg)`;
      el.style.zIndex = zIndex;

      container.appendChild(el);

      this.fanCards.push({
        el,
        index: i,
        baseX: x,
        baseY: y,
        rotation,
        baseZIndex: zIndex,
        drawn: false
      });
    }

    // Animate in: slide from left to right sequentially
    requestAnimationFrame(() => {
      this.fanCards.forEach((card, i) => {
        setTimeout(() => {
          card.el.classList.add('visible');
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.transform = `translate(-50%, -50%) rotate(${card.rotation}deg)`;
        }, 10 + i * 12);
      });
    });

    return this.fanCards;
  },

  // --- Find nearest fan card to cursor ---
  getNearestFanCard(x, y) {
    let nearest = -1;
    let minDist = Infinity;

    // Only activate when cursor is in upper 45% of screen (fan area)
    if (y > window.innerHeight * 0.45) return -1;

    for (const card of this.fanCards) {
      if (card.drawn) continue;
      const dx = card.baseX - x;
      const dy = card.baseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = card.index;
      }
    }
    return nearest;
  },

  // --- Highlight a fan card (unhighlight previous) ---
  highlightFanCard(index) {
    if (index === this.fanHighlightIdx) return;

    // Remove previous highlight
    if (this.fanHighlightIdx >= 0 && this.fanCards[this.fanHighlightIdx]) {
      const prev = this.fanCards[this.fanHighlightIdx];
      prev.el.classList.remove('active');
      prev.el.style.transform = `translate(-50%, -50%) rotate(${prev.rotation}deg)`;
      prev.el.style.zIndex = prev.baseZIndex || prev.index;
    }

    this.fanHighlightIdx = index;

    if (index >= 0 && this.fanCards[index] && !this.fanCards[index].drawn) {
      const card = this.fanCards[index];
      card.el.classList.add('active');
      // Float up: translateY -30px and slight scale
      card.el.style.transform = `translate(-50%, -50%) rotate(${card.rotation}deg) translateY(-30px) scale(1.08)`;
      card.el.style.zIndex = 100;
    }
  },

  // --- Draw a card from the fan, return floating card ---
  async drawFromFan(index, targetX, targetY) {
    if (index < 0 || !this.fanCards[index] || this.fanCards[index].drawn) return null;

    const card = this.fanCards[index];
    card.drawn = true;

    // Get position of the fan card
    const rect = card.el.getBoundingClientRect();

    // Hide the fan card
    card.el.classList.add('drawn');
    card.el.classList.remove('active');

    // Create floating card at same position
    const floatingEl = document.createElement('div');
    floatingEl.className = 'floating-card';
    floatingEl.innerHTML = `
      <div class="card">
        <div class="card-inner">
          <div class="card-face card-back">
            <div class="card-back-pattern"></div>
          </div>
        </div>
      </div>
    `;
    floatingEl.style.left = `${rect.left}px`;
    floatingEl.style.top = `${rect.top}px`;
    floatingEl.style.transform = 'scale(0.9)';
    document.body.appendChild(floatingEl);

    // Animate to cursor
    await this._delay(20);
    floatingEl.classList.add('animating');
    floatingEl.style.left = `${targetX - 60}px`;
    floatingEl.style.top = `${targetY - 95}px`;
    floatingEl.style.transform = 'scale(1)';

    await this._delay(420);
    floatingEl.classList.remove('animating');
    return floatingEl;
  },

  // --- Cleanup fan ---
  clearFan(container) {
    this.fanCards = [];
    this.fanHighlightIdx = -1;
    if (container) container.innerHTML = '';
  },

  // --- Create floating card (for dragging) ---
  createFloatingCard(x, y) {
    const el = document.createElement('div');
    el.className = 'floating-card';
    el.innerHTML = `
      <div class="card">
        <div class="card-inner">
          <div class="card-face card-back">
            <div class="card-back-pattern"></div>
          </div>
        </div>
      </div>
    `;
    el.style.left = `${x - 60}px`;
    el.style.top = `${y - 95}px`;
    document.body.appendChild(el);
    return el;
  },

  // --- Move floating card to position ---
  moveFloatingCard(el, x, y) {
    if (!el) return;
    el.style.left = `${x - 60}px`;
    el.style.top = `${y - 95}px`;
  },

  // --- Animate card flying from deck to cursor ---
  async animateDrawFromDeck(deckRect, targetX, targetY) {
    const el = document.createElement('div');
    el.className = 'floating-card';
    el.innerHTML = `
      <div class="card">
        <div class="card-inner">
          <div class="card-face card-back">
            <div class="card-back-pattern"></div>
          </div>
        </div>
      </div>
    `;

    el.style.left = `${deckRect.left}px`;
    el.style.top = `${deckRect.top}px`;
    el.style.transform = 'scale(0.9)';
    document.body.appendChild(el);

    await this._delay(20);
    el.classList.add('animating');
    el.style.left = `${targetX - 60}px`;
    el.style.top = `${targetY - 95}px`;
    el.style.transform = 'scale(1)';

    await this._delay(420);
    el.classList.remove('animating');
    return el;
  },

  // --- Animate card flying to slot ---
  async animateToSlot(floatingEl, slotEl) {
    if (!floatingEl || !slotEl) return;

    const slotRect = slotEl.getBoundingClientRect();
    floatingEl.classList.add('animating');
    floatingEl.style.left = `${slotRect.left}px`;
    floatingEl.style.top = `${slotRect.top}px`;
    floatingEl.style.transform = 'scale(1)';

    await this._delay(420);
    floatingEl.remove();
  },

  // --- Create card element in slot ---
  createCardInSlot(slotEl, cardData) {
    const reversed = cardData.isReversed;
    const reading = reversed ? cardData.reversed : cardData.upright;

    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.cardId = cardData.id;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <div class="card-back-pattern"></div>
        </div>
        <div class="card-face card-front ${reversed ? 'reversed' : ''}">
          <div class="card-numeral">${cardData.numeral}</div>
          <div class="card-symbol">${cardData.symbol}</div>
          <div class="card-name">${cardData.name}</div>
          <div class="card-name-cn">${cardData.nameCN}</div>
          ${reversed ? '<div class="card-reversed-label">逆位</div>' : ''}
          <div class="card-keywords">${reading.keywords.join(' / ')}</div>
        </div>
      </div>
    `;

    slotEl.classList.add('filled');
    slotEl.appendChild(cardEl);
    return cardEl;
  },

  // --- Flip card ---
  async flipCard(cardEl, delay = 0) {
    if (delay > 0) await this._delay(delay);
    cardEl.classList.add('flipped');
    await this._delay(800);
  },

  // --- Flip all cards in sequence ---
  async flipAllCards(cardElements, intervalMs = 400) {
    for (let i = 0; i < cardElements.length; i++) {
      cardElements[i].classList.add('flipped');
      if (i < cardElements.length - 1) {
        await this._delay(intervalMs);
      }
    }
    // Wait for last flip animation to complete
    await this._delay(900);
  },

  // --- Create spread slots ---
  createSpreadSlots(spread) {
    this.spreadArea.innerHTML = '';
    const slots = [];

    spread.positions.forEach((pos, i) => {
      const slot = document.createElement('div');
      slot.className = `spread-slot ${pos.crossed ? 'crossed' : ''}`;
      slot.style.left = `${pos.x}%`;
      slot.style.top = `${pos.y}%`;
      slot.dataset.slotIndex = i;

      const label = document.createElement('div');
      label.className = 'slot-label';
      label.textContent = pos.labelCN;
      slot.appendChild(label);

      this.spreadArea.appendChild(slot);
      slots.push(slot);
    });

    return slots;
  },

  // --- Highlight next slot ---
  highlightSlot(slots, index) {
    slots.forEach((s, i) => {
      s.classList.toggle('highlight', i === index);
    });
  },

  // --- Clear highlights ---
  clearHighlights(slots) {
    slots.forEach(s => s.classList.remove('highlight'));
  },

  // --- Utility ---
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
