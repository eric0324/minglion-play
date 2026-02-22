// spreads.js - Tarot spread definitions and layout calculations

const SPREADS = {
  single: {
    id: 'single',
    name: '單牌占卜',
    nameCN: '單牌',
    description: '抽取一張牌，獲得直接的指引',
    cardCount: 1,
    positions: [
      { label: 'Guidance', labelCN: '指引', x: 50, y: 63 }
    ]
  },

  threeCard: {
    id: 'threeCard',
    name: '三牌陣',
    nameCN: '時間之流',
    description: '過去、現在、未來的時間線占卜',
    cardCount: 3,
    positions: [
      { label: 'Past', labelCN: '過去', x: 25, y: 63 },
      { label: 'Present', labelCN: '現在', x: 50, y: 63 },
      { label: 'Future', labelCN: '未來', x: 75, y: 63 }
    ]
  },

  celticCross: {
    id: 'celticCross',
    name: '凱爾特十字',
    nameCN: '凱爾特十字',
    description: '十張牌的深度解讀，全方位分析',
    cardCount: 10,
    positions: [
      { label: 'Present', labelCN: '現況', x: 35, y: 65 },
      { label: 'Challenge', labelCN: '挑戰', x: 35, y: 65, crossed: true },
      { label: 'Foundation', labelCN: '基礎', x: 35, y: 85 },
      { label: 'Past', labelCN: '過去', x: 15, y: 65 },
      { label: 'Crown', labelCN: '可能性', x: 35, y: 45 },
      { label: 'Future', labelCN: '近未來', x: 55, y: 65 },
      { label: 'Self', labelCN: '自我', x: 78, y: 85 },
      { label: 'Environment', labelCN: '環境', x: 78, y: 75 },
      { label: 'Hopes', labelCN: '希望與恐懼', x: 78, y: 60 },
      { label: 'Outcome', labelCN: '結果', x: 78, y: 45 }
    ]
  }
};

// Spread layout helper
const SpreadLayout = {
  currentSpread: null,
  placedCards: [],

  setSpread(spreadId) {
    this.currentSpread = SPREADS[spreadId];
    this.placedCards = new Array(this.currentSpread.cardCount).fill(null);
  },

  getNextSlotIndex() {
    return this.placedCards.findIndex(c => c === null);
  },

  placeCard(card, slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.placedCards.length) return false;
    if (this.placedCards[slotIndex] !== null) return false;
    this.placedCards[slotIndex] = card;
    return true;
  },

  isComplete() {
    return this.placedCards.every(c => c !== null);
  },

  getSlotPosition(slotIndex) {
    if (!this.currentSpread) return null;
    return this.currentSpread.positions[slotIndex];
  },

  reset() {
    this.currentSpread = null;
    this.placedCards = [];
  }
};
