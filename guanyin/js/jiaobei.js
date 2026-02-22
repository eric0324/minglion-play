// jiaobei.js - Simplified jiaobei logic for Guanyin oracle (throw + results only)

const RESULTS = {
  holy: {
    id: 'holy',
    name: '聖筊',
    icon: '🌙',
    description: '一陰一陽，神明允准。',
    cssClass: 'holy'
  },
  laugh: {
    id: 'laugh',
    name: '笑筊',
    icon: '😊',
    description: '雙陽朝上，神明微笑。',
    cssClass: 'laugh'
  },
  negative: {
    id: 'negative',
    name: '陰筊',
    icon: '🌑',
    description: '雙陰朝上，神明未允。',
    cssClass: 'negative'
  }
};

// Throw logic: determine result randomly
function throwJiaobei() {
  const rand = Math.random();
  // Probabilities: 聖筊 ~50%, 笑筊 ~25%, 陰筊 ~25%
  if (rand < 0.5) return 'holy';
  if (rand < 0.75) return 'laugh';
  return 'negative';
}

// Meditation prompts
const MEDITATIONS = [
  '靜心凝神，誠心默禱...',
  '在心中向觀音菩薩稟告你的問題...',
  '放下雜念，專注於你所求之事...',
  '深呼吸，讓心沉靜下來...',
  '以虔誠之心，等待菩薩的回應...',
  '閉上眼睛，感受與菩薩的連結...',
  '將你的誠意化為禱告...',
  '心誠則靈，靜待聖意...',
];

function randomMeditation() {
  return MEDITATIONS[Math.floor(Math.random() * MEDITATIONS.length)];
}
