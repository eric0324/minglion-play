// jiaobei.js - Jiaobei (moon blocks) data, logic and result definitions

const RESULTS = {
  holy: {
    id: 'holy',
    name: '聖筊',
    icon: '🌙',
    description: '一陰一陽，神明允准。',
    meaning: '聖筊代表神明同意你的請求或認同你的想法。你所求之事得到了正面的回應，可以放心依照計畫前行。',
    detail: '聖筊是一正一反的組合，象徵陰陽調和、天地相應。在傳統信仰中，聖筊代表神明已聽見你的禱告並給予肯定的答覆。這是最吉祥的筊象。',
    cssClass: 'holy'
  },
  laugh: {
    id: 'laugh',
    name: '笑筊',
    icon: '😊',
    description: '雙陽朝上，神明微笑。',
    meaning: '笑筊代表神明覺得你的問題不夠明確，或是時機未到。建議你重新整理思緒，把問題想得更清楚再來請示。',
    detail: '笑筊兩面皆為凸面朝上，傳統上認為神明在笑，可能是問題不夠具體、時候未到，或是神明認為你已經知道答案了。不妨換個方式重新發問。',
    cssClass: 'laugh'
  },
  negative: {
    id: 'negative',
    name: '陰筊',
    icon: '🌑',
    description: '雙陰朝上，神明未允。',
    meaning: '陰筊代表神明不同意你的請求，或認為此事不宜。建議你重新考慮計畫，或換個方向思考。',
    detail: '陰筊兩面皆為平面朝上，傳統上認為是神明否定的表示。這並非懲罰，而是善意的提醒——也許此事尚有未考慮到的地方，或時機尚未成熟。',
    cssClass: 'negative'
  }
};

const MODES = {
  single: {
    id: 'single',
    name: '單擲問卜',
    totalThrows: 1,
    getVerdict(results) {
      return results[0];
    },
    getVerdictText(results) {
      const r = results[0];
      if (r === 'holy') return '神明允准你所求之事。';
      if (r === 'laugh') return '神明微笑不語，建議重新釐清問題再來請示。';
      return '神明未允此事，建議換個角度思考。';
    }
  },
  triple: {
    id: 'triple',
    name: '三擲定論',
    totalThrows: 3,
    getVerdict(results) {
      const counts = { holy: 0, laugh: 0, negative: 0 };
      results.forEach(r => counts[r]++);
      if (counts.holy >= 2) return 'holy';
      if (counts.negative >= 2) return 'negative';
      return 'laugh';
    },
    getVerdictText(results) {
      const counts = { holy: 0, laugh: 0, negative: 0 };
      results.forEach(r => counts[r]++);
      if (counts.holy === 3) return '三筊皆聖，神明大力允准！此事大吉大利。';
      if (counts.holy >= 2) return '多數為聖筊，神明同意你所求之事。';
      if (counts.negative === 3) return '三筊皆陰，神明明確表示此事不宜。建議另做打算。';
      if (counts.negative >= 2) return '多數為陰筊，神明對此事有所保留。建議重新考慮。';
      return '結果不明確，神明似乎另有考量。建議換個方式問問看。';
    }
  },
  consecutive: {
    id: 'consecutive',
    name: '連續聖筊',
    totalThrows: Infinity,
    targetConsecutive: 3,
    getVerdict(results) {
      let consecutive = 0;
      for (const r of results) {
        if (r === 'holy') {
          consecutive++;
          if (consecutive >= 3) return 'holy';
        } else {
          consecutive = 0;
        }
      }
      return consecutive >= 3 ? 'holy' : 'negative';
    },
    getVerdictText(results) {
      let consecutive = 0;
      let maxConsecutive = 0;
      for (const r of results) {
        if (r === 'holy') {
          consecutive++;
          maxConsecutive = Math.max(maxConsecutive, consecutive);
        } else {
          consecutive = 0;
        }
      }
      if (maxConsecutive >= 3) {
        return `連續 ${maxConsecutive} 次聖筊！神明堅定地允准你所求之事。此乃極為殊勝的筊象。`;
      }
      return `共擲 ${results.length} 次，未能連續三次聖筊。神明對此事尚有保留。`;
    }
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
  '在心中向神明稟告你的問題...',
  '放下雜念，專注於你所求之事...',
  '深呼吸，讓心沉靜下來...',
  '以虔誠之心，等待神明的回應...',
  '閉上眼睛，感受與神明的連結...',
  '將你的誠意化為禱告...',
  '心誠則靈，靜待聖意...',
];

function randomMeditation() {
  return MEDITATIONS[Math.floor(Math.random() * MEDITATIONS.length)];
}
