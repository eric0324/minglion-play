// deck.js - 22 Major Arcana tarot card data and deck operations

const MAJOR_ARCANA = [
  {
    id: 0,
    name: 'The Fool',
    nameCN: '愚者',
    numeral: '0',
    symbol: '🃏',
    upright: {
      meaning: '新的開始、冒險精神、純真無邪、自由自在',
      keywords: ['新開始', '冒險', '純真', '信念飛躍'],
      description: '愚者代表一段全新旅程的開始。你正站在懸崖邊緣，準備踏入未知。相信直覺，擁抱不確定性，這是蛻變的契機。'
    },
    reversed: {
      meaning: '魯莽行事、恐懼未知、猶豫不決、缺乏計畫',
      keywords: ['魯莽', '恐懼', '猶豫', '不成熟'],
      description: '逆位的愚者提醒你，衝動與勇氣只有一線之隔。在跳躍之前，先看清腳下的路。不要讓恐懼束縛你，但也別盲目前行。'
    }
  },
  {
    id: 1,
    name: 'The Magician',
    nameCN: '魔術師',
    numeral: 'I',
    symbol: '🎭',
    upright: {
      meaning: '創造力、意志力、技巧純熟、資源充足',
      keywords: ['創造', '意志', '技巧', '顯化'],
      description: '魔術師掌握了四大元素，象徵你擁有實現目標的所有資源。專注意念，將想法化為行動，你有能力創造奇蹟。'
    },
    reversed: {
      meaning: '操控他人、才華浪費、欺騙、缺乏方向',
      keywords: ['操控', '浪費', '欺騙', '迷失'],
      description: '逆位的魔術師警告你可能正在浪費天賦，或有人在操控局勢。重新審視你的意圖，確保你的力量用在正確的方向。'
    }
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameCN: '女祭司',
    numeral: 'II',
    symbol: '🌙',
    upright: {
      meaning: '直覺、潛意識、神秘智慧、內在之聲',
      keywords: ['直覺', '智慧', '神秘', '潛意識'],
      description: '女祭司守護著隱藏的知識。此刻請安靜下來，傾聽內在的聲音。答案不在外界，而在你的潛意識深處。'
    },
    reversed: {
      meaning: '忽視直覺、秘密曝光、表面化、資訊隱瞞',
      keywords: ['忽視', '秘密', '表面', '隱瞞'],
      description: '逆位的女祭司表示你正在忽視直覺的指引，或有重要資訊尚未揭露。停下來，不要被表象迷惑。'
    }
  },
  {
    id: 3,
    name: 'The Empress',
    nameCN: '皇后',
    numeral: 'III',
    symbol: '👑',
    upright: {
      meaning: '豐饒、母性、自然、感官享受、創造力',
      keywords: ['豐饒', '母性', '創造', '滋養'],
      description: '皇后帶來豐盛與滋養的能量。這是收穫的時刻，享受生命的美好。你的創造力正在開花結果。'
    },
    reversed: {
      meaning: '創造力枯竭、依賴他人、過度放縱、忽視自我',
      keywords: ['枯竭', '依賴', '放縱', '忽視'],
      description: '逆位的皇后提示你可能過度付出而忽視自己的需求，或是創造力陷入低潮。先照顧好自己，豐盛才會回來。'
    }
  },
  {
    id: 4,
    name: 'The Emperor',
    nameCN: '皇帝',
    numeral: 'IV',
    symbol: '⚔️',
    upright: {
      meaning: '權威、結構、穩定、領導力、紀律',
      keywords: ['權威', '穩定', '領導', '紀律'],
      description: '皇帝代表秩序與掌控。現在需要理性、有結構地處理事務。建立規則，承擔責任，你有能力掌控局面。'
    },
    reversed: {
      meaning: '專制、僵化、失控、逃避責任',
      keywords: ['專制', '僵化', '失控', '逃避'],
      description: '逆位的皇帝暗示權力被濫用或完全缺乏紀律。檢視你是否過度控制或放任，找到平衡點。'
    }
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameCN: '教皇',
    numeral: 'V',
    symbol: '⛪',
    upright: {
      meaning: '傳統、信仰、教導、精神指引、體制',
      keywords: ['傳統', '信仰', '教導', '指引'],
      description: '教皇象徵傳統智慧與精神指引。尋求導師的建議，或回歸你信奉的價值觀。有時遵循傳統是明智的選擇。'
    },
    reversed: {
      meaning: '打破常規、個人信念、反叛、不合時宜',
      keywords: ['反叛', '個人', '突破', '質疑'],
      description: '逆位的教皇鼓勵你質疑既有規範，走出自己的路。不必盲從傳統，但要確保你的反叛有其意義。'
    }
  },
  {
    id: 6,
    name: 'The Lovers',
    nameCN: '戀人',
    numeral: 'VI',
    symbol: '💕',
    upright: {
      meaning: '愛情、和諧、抉擇、價值觀統一、夥伴關係',
      keywords: ['愛', '和諧', '抉擇', '結合'],
      description: '戀人牌不只關於愛情，更關於重要的抉擇。傾聽心的聲音，選擇與你核心價值觀一致的道路。'
    },
    reversed: {
      meaning: '關係失衡、價值衝突、誘惑、錯誤抉擇',
      keywords: ['失衡', '衝突', '誘惑', '猶豫'],
      description: '逆位的戀人警示關係中的不和諧或面臨艱難抉擇。別讓外在誘惑動搖你的核心價值。'
    }
  },
  {
    id: 7,
    name: 'The Chariot',
    nameCN: '戰車',
    numeral: 'VII',
    symbol: '🏇',
    upright: {
      meaning: '意志力、勝利、決心、克服障礙、前進',
      keywords: ['勝利', '決心', '克服', '前進'],
      description: '戰車象徵透過堅定意志取得勝利。掌控相反的力量，朝目標全速前進。成功就在眼前，不要停下來。'
    },
    reversed: {
      meaning: '失去方向、挫敗、攻擊性、失控',
      keywords: ['迷失', '挫敗', '失控', '強勢'],
      description: '逆位的戰車顯示你可能失去方向或過度強硬。重新校準目標，記住真正的力量來自內在的平衡。'
    }
  },
  {
    id: 8,
    name: 'Strength',
    nameCN: '力量',
    numeral: 'VIII',
    symbol: '🦁',
    upright: {
      meaning: '內在力量、勇氣、耐心、慈悲、柔中帶剛',
      keywords: ['勇氣', '耐心', '慈悲', '內在力量'],
      description: '力量牌教導你，真正的力量不是暴力，而是溫柔的堅定。以耐心和慈悲面對挑戰，你比想像中更強大。'
    },
    reversed: {
      meaning: '自我懷疑、軟弱、缺乏勇氣、內在衝突',
      keywords: ['懷疑', '軟弱', '恐懼', '衝突'],
      description: '逆位的力量表示自信心動搖。你暫時迷失了內在的勇氣，但它一直都在。重新連結你的核心力量。'
    }
  },
  {
    id: 9,
    name: 'The Hermit',
    nameCN: '隱者',
    numeral: 'IX',
    symbol: '🏔️',
    upright: {
      meaning: '內省、獨處、智慧、指引、靈性追尋',
      keywords: ['內省', '獨處', '智慧', '追尋'],
      description: '隱者提著燈籠照亮前路。這是向內探索的時候，暫時抽離喧囂，在獨處中找到你需要的答案。'
    },
    reversed: {
      meaning: '孤立、逃避、固執己見、拒絕幫助',
      keywords: ['孤立', '逃避', '固執', '封閉'],
      description: '逆位的隱者提醒你，獨處與孤立不同。不要用逃避偽裝成沉思，適時向外尋求連結。'
    }
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameCN: '命運之輪',
    numeral: 'X',
    symbol: '☸️',
    upright: {
      meaning: '命運轉折、好運降臨、循環、改變、機會',
      keywords: ['轉折', '好運', '循環', '機會'],
      description: '命運之輪不停轉動，變化正在到來。這是一個有利的轉折點，把握機會順勢而為，好運正在眷顧你。'
    },
    reversed: {
      meaning: '厄運、抗拒改變、失控、逆境',
      keywords: ['逆境', '抗拒', '失控', '低潮'],
      description: '逆位的命運之輪提示你正經歷低谷，但請記住輪子會繼續轉動。接受暫時的逆境，為下一個上升做準備。'
    }
  },
  {
    id: 11,
    name: 'Justice',
    nameCN: '正義',
    numeral: 'XI',
    symbol: '⚖️',
    upright: {
      meaning: '公正、真相、因果報應、法律、平衡',
      keywords: ['公正', '真相', '因果', '平衡'],
      description: '正義牌要求誠實面對一切。種什麼因得什麼果，現在是清算與平衡的時刻。做出公正的決定。'
    },
    reversed: {
      meaning: '不公正、逃避責任、偏見、失衡',
      keywords: ['不公', '逃避', '偏見', '失衡'],
      description: '逆位的正義警告有不公正的事正在發生。可能有人（包括你自己）在逃避應負的責任。尋求真相。'
    }
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameCN: '倒吊人',
    numeral: 'XII',
    symbol: '🔄',
    upright: {
      meaning: '犧牲、新視角、等待、放下、順其自然',
      keywords: ['犧牲', '新視角', '等待', '放下'],
      description: '倒吊人自願倒掛以獲得新的視角。有時候放下掌控，讓事情自然發展，反而能看見之前看不到的答案。'
    },
    reversed: {
      meaning: '無意義的犧牲、拖延、固執、錯失時機',
      keywords: ['拖延', '固執', '徒勞', '錯失'],
      description: '逆位的倒吊人表示你可能在做無謂的犧牲或拖延必要的行動。是時候做出決定了。'
    }
  },
  {
    id: 13,
    name: 'Death',
    nameCN: '死神',
    numeral: 'XIII',
    symbol: '💀',
    upright: {
      meaning: '結束、轉化、蛻變、放手、新生',
      keywords: ['結束', '轉化', '蛻變', '新生'],
      description: '死神並非字面上的死亡，而是深刻的轉化。舊的必須結束，新的才能開始。勇敢放手，迎接蛻變。'
    },
    reversed: {
      meaning: '抗拒改變、恐懼結束、停滯不前、執著過去',
      keywords: ['抗拒', '恐懼', '停滯', '執著'],
      description: '逆位的死神顯示你正在抗拒必要的結束。緊抓著已經結束的事物只會帶來更多痛苦。放手吧。'
    }
  },
  {
    id: 14,
    name: 'Temperance',
    nameCN: '節制',
    numeral: 'XIV',
    symbol: '⏳',
    upright: {
      meaning: '平衡、節制、耐心、和諧、中庸之道',
      keywords: ['平衡', '節制', '耐心', '和諧'],
      description: '節制天使在兩個杯子間倒水，象徵完美的平衡。保持耐心，取中庸之道，各方面的和諧正在形成。'
    },
    reversed: {
      meaning: '失衡、過度、急躁、衝突、缺乏節制',
      keywords: ['失衡', '過度', '急躁', '衝突'],
      description: '逆位的節制暗示生活失去平衡。可能在某方面過度而另一方面不足。重新找到你的中心。'
    }
  },
  {
    id: 15,
    name: 'The Devil',
    nameCN: '惡魔',
    numeral: 'XV',
    symbol: '😈',
    upright: {
      meaning: '束縛、執念、物質主義、陰暗面、誘惑',
      keywords: ['束縛', '執念', '誘惑', '陰暗'],
      description: '惡魔揭示綑綁你的鎖鏈。仔細看——那些鎖鏈是鬆的，你隨時可以掙脫。是什麼讓你心甘情願被束縛？'
    },
    reversed: {
      meaning: '掙脫束縛、克服執念、覺醒、重獲自由',
      keywords: ['掙脫', '克服', '覺醒', '自由'],
      description: '逆位的惡魔是好消息——你正在掙脫束縛。面對陰暗面需要勇氣，而你正在這條路上。'
    }
  },
  {
    id: 16,
    name: 'The Tower',
    nameCN: '高塔',
    numeral: 'XVI',
    symbol: '🗼',
    upright: {
      meaning: '突變、崩塌、啟示、解放、真相揭露',
      keywords: ['突變', '崩塌', '啟示', '解放'],
      description: '高塔被閃電擊中，代表突如其來的劇變。雖然過程痛苦，但虛假的結構必須倒塌，才能在真實的基礎上重建。'
    },
    reversed: {
      meaning: '避開災禍、延遲崩塌、恐懼改變、內在轉變',
      keywords: ['避開', '延遲', '恐懼', '內在'],
      description: '逆位的高塔可能表示你避開了一場劫難，或者崩塌正在內心深處悄悄發生。正面迎擊比逃避更好。'
    }
  },
  {
    id: 17,
    name: 'The Star',
    nameCN: '星星',
    numeral: 'XVII',
    symbol: '⭐',
    upright: {
      meaning: '希望、靈感、平靜、療癒、信心',
      keywords: ['希望', '靈感', '療癒', '平靜'],
      description: '暴風雨後，星星在夜空中閃耀。這是希望與療癒的時刻，讓自己沐浴在寧靜的能量中。一切都會好的。'
    },
    reversed: {
      meaning: '失去希望、信心喪失、脫離現實、失望',
      keywords: ['絕望', '喪失', '脫離', '失望'],
      description: '逆位的星星表示你暫時失去了希望。但星星從未消失，只是被烏雲遮蔽。重新連結你的信心。'
    }
  },
  {
    id: 18,
    name: 'The Moon',
    nameCN: '月亮',
    numeral: 'XVIII',
    symbol: '🌕',
    upright: {
      meaning: '幻象、恐懼、潛意識、不確定、直覺',
      keywords: ['幻象', '恐懼', '潛意識', '迷惑'],
      description: '月光下一切似是而非。你正走在一條充滿不確定的路上，恐懼和幻象環繞。信任直覺，但不要被想像力嚇到。'
    },
    reversed: {
      meaning: '真相浮現、恐懼消散、清明、走出迷惘',
      keywords: ['真相', '清明', '消散', '覺醒'],
      description: '逆位的月亮表示迷霧正在散去，真相即將浮現。你開始看清那些只是幻象的恐懼。'
    }
  },
  {
    id: 19,
    name: 'The Sun',
    nameCN: '太陽',
    numeral: 'XIX',
    symbol: '☀️',
    upright: {
      meaning: '喜悅、成功、活力、樂觀、光明',
      keywords: ['喜悅', '成功', '活力', '光明'],
      description: '太陽是牌中最正面的牌之一。光明、溫暖、喜悅正在照耀你。享受這個美好的時刻，你值得擁有幸福。'
    },
    reversed: {
      meaning: '暫時陰霾、延遲的成功、內在小孩受傷、過度樂觀',
      keywords: ['陰霾', '延遲', '受傷', '過度'],
      description: '逆位的太陽只是暫時的烏雲。快樂可能遲到但不會缺席。重新找到你內在那個無憂無慮的孩子。'
    }
  },
  {
    id: 20,
    name: 'Judgement',
    nameCN: '審判',
    numeral: 'XX',
    symbol: '📯',
    upright: {
      meaning: '覺醒、評判、重生、召喚、自我反省',
      keywords: ['覺醒', '重生', '召喚', '反省'],
      description: '天使吹響號角，這是覺醒的時刻。回顧過去，誠實面對自己的所作所為，然後帶著清明的意識重生。'
    },
    reversed: {
      meaning: '自我懷疑、逃避反省、錯失召喚、內心譴責',
      keywords: ['懷疑', '逃避', '錯失', '譴責'],
      description: '逆位的審判表示你在逃避內心的聲音。那個召喚一直在那裡，停止自我譴責，勇敢回應它。'
    }
  },
  {
    id: 21,
    name: 'The World',
    nameCN: '世界',
    numeral: 'XXI',
    symbol: '🌍',
    upright: {
      meaning: '完成、圓滿、成就、整合、旅程結束',
      keywords: ['完成', '圓滿', '成就', '整合'],
      description: '世界牌代表一個完美的循環。你已經完成了重要的旅程，所有的經歷都整合為圓滿。慶祝你的成就吧！'
    },
    reversed: {
      meaning: '未竟之事、缺乏完結、延遲圓滿、尋找意義',
      keywords: ['未竟', '延遲', '缺乏', '尋找'],
      description: '逆位的世界暗示還有未完成的事。差一步就到終點了，不要在最後放棄。完成它。'
    }
  }
];

// --- Minor Arcana ---
const MINOR_ARCANA_SUITS = [
  {
    suit: 'Wands', suitCN: '權杖', symbol: '🪄', element: '火',
    theme: '行動、熱情、創造、意志',
    cards: [
      { rank: 'Ace', rankCN: '王牌', numeral: 'A',
        upright: { keywords: ['新開始', '靈感', '潛力'], description: '權杖王牌帶來一股全新的創造能量。一個充滿潛力的機會正在萌芽，把握這股熱情付諸行動。' },
        reversed: { keywords: ['延遲', '缺乏動力', '猶豫'], description: '逆位的權杖王牌暗示創意受阻或動力不足。等待正確的時機，不要勉強。' }
      },
      { rank: 'Two', rankCN: '二', numeral: 'II',
        upright: { keywords: ['計畫', '決定', '進展'], description: '你正在規劃未來的方向。掌握主動權，大膽做出決定，世界等著你去探索。' },
        reversed: { keywords: ['恐懼', '缺乏計畫', '受限'], description: '害怕跨出舒適圈讓你停滯不前。重新審視目標，不要讓恐懼支配你的選擇。' }
      },
      { rank: 'Three', rankCN: '三', numeral: 'III',
        upright: { keywords: ['擴展', '遠見', '領導'], description: '你的計畫開始展現成果。持續擴展視野，機會就在地平線上等著你。' },
        reversed: { keywords: ['延遲', '挫折', '缺乏遠見'], description: '進展不如預期，但這是暫時的。重新調整策略，保持耐心。' }
      },
      { rank: 'Four', rankCN: '四', numeral: 'IV',
        upright: { keywords: ['慶祝', '和諧', '里程碑'], description: '值得慶祝的時刻到了！你的努力獲得回報，與重要的人分享這份喜悅。' },
        reversed: { keywords: ['不穩定', '過渡期', '缺乏支持'], description: '基礎尚未穩固，現在不是慶祝的時候。先把根基打好。' }
      },
      { rank: 'Five', rankCN: '五', numeral: 'V',
        upright: { keywords: ['衝突', '競爭', '挑戰'], description: '各方意見分歧，衝突在所難免。把競爭視為成長的動力，而非阻礙。' },
        reversed: { keywords: ['逃避衝突', '內在矛盾', '妥協'], description: '避免正面衝突不一定是好事。有些矛盾需要直接面對才能化解。' }
      },
      { rank: 'Six', rankCN: '六', numeral: 'VI',
        upright: { keywords: ['勝利', '認可', '自信'], description: '你的努力獲得公開的認可和讚賞。享受這份榮耀，你值得這一切。' },
        reversed: { keywords: ['自負', '失敗', '缺乏認可'], description: '勝利可能來得不完整，或者驕傲蒙蔽了你。保持謙遜，繼續前進。' }
      },
      { rank: 'Seven', rankCN: '七', numeral: 'VII',
        upright: { keywords: ['堅持', '防衛', '勇氣'], description: '面對挑戰你佔據有利位置。堅守立場，不要輕易退讓。' },
        reversed: { keywords: ['被壓倒', '放棄', '脆弱'], description: '壓力讓你感到喘不過氣。評估是否值得繼續堅持，有時撤退也是智慧。' }
      },
      { rank: 'Eight', rankCN: '八', numeral: 'VIII',
        upright: { keywords: ['快速行動', '變化', '進展'], description: '事情正在快速推進。順著這股勢能前進，不要猶豫不決。' },
        reversed: { keywords: ['延遲', '挫折', '阻力'], description: '進展被意外阻礙。保持靈活，尋找繞過障礙的方法。' }
      },
      { rank: 'Nine', rankCN: '九', numeral: 'IX',
        upright: { keywords: ['韌性', '堅毅', '最後考驗'], description: '你已經走了很遠，最後的考驗就在眼前。咬牙撐過去，終點就在前方。' },
        reversed: { keywords: ['疲憊', '固執', '偏執'], description: '你已經筋疲力盡但不願放手。適時休息不是軟弱，是為了走更遠。' }
      },
      { rank: 'Ten', rankCN: '十', numeral: 'X',
        upright: { keywords: ['重擔', '責任', '壓力'], description: '你承擔了太多責任。審視哪些是必要的，學會分擔與放下。' },
        reversed: { keywords: ['釋放', '減壓', '委託'], description: '你開始學會放下不必要的重擔。把一些責任交給值得信賴的人。' }
      },
      { rank: 'Page', rankCN: '侍者', numeral: 'Pg',
        upright: { keywords: ['好奇', '探索', '熱忱'], description: '權杖侍者帶來令人興奮的消息或新的學習機會。保持好奇心，勇於嘗試。' },
        reversed: { keywords: ['衝動', '不成熟', '缺乏方向'], description: '熱情有餘但缺乏深思。在行動之前多想一步。' }
      },
      { rank: 'Knight', rankCN: '騎士', numeral: 'Kn',
        upright: { keywords: ['冒險', '熱情', '行動力'], description: '權杖騎士充滿行動力和冒險精神。大膽追求你的目標，現在是行動的時候。' },
        reversed: { keywords: ['魯莽', '急躁', '缺乏計畫'], description: '衝動行事可能帶來負面後果。冷靜下來，先想好再做。' }
      },
      { rank: 'Queen', rankCN: '皇后', numeral: 'Q',
        upright: { keywords: ['自信', '獨立', '魅力'], description: '權杖皇后散發溫暖而堅定的能量。相信自己的能力，用熱情感染身邊的人。' },
        reversed: { keywords: ['嫉妒', '控制', '暴躁'], description: '情緒失控可能破壞你的人際關係。找回內在的平靜和自信。' }
      },
      { rank: 'King', rankCN: '國王', numeral: 'K',
        upright: { keywords: ['領袖', '遠見', '果斷'], description: '權杖國王是天生的領導者。用你的遠見引導他人，果斷而不專斷。' },
        reversed: { keywords: ['獨裁', '衝動', '暴躁'], description: '權力被濫用或決策過於衝動。真正的領袖懂得傾聽和自制。' }
      }
    ]
  },
  {
    suit: 'Cups', suitCN: '聖杯', symbol: '🏆', element: '水',
    theme: '情感、直覺、關係、心靈',
    cards: [
      { rank: 'Ace', rankCN: '王牌', numeral: 'A',
        upright: { keywords: ['新感情', '靈感', '喜悅'], description: '聖杯王牌帶來情感上的新開始。一段新關係、新的創意靈感或內心深處的喜悅正在湧現。' },
        reversed: { keywords: ['情感封閉', '空虛', '失落'], description: '你可能壓抑了真實的情感。打開心扉，讓愛與喜悅流入。' }
      },
      { rank: 'Two', rankCN: '二', numeral: 'II',
        upright: { keywords: ['合作', '吸引', '連結'], description: '兩個人之間產生了美好的連結。無論是愛情還是友情，這段關係值得珍惜。' },
        reversed: { keywords: ['失衡', '誤解', '疏離'], description: '關係中出現了不對等或溝通障礙。花時間傾聽對方的需求。' }
      },
      { rank: 'Three', rankCN: '三', numeral: 'III',
        upright: { keywords: ['慶祝', '友誼', '社交'], description: '與朋友們共度美好時光。慶祝、歡聚、分享喜悅，享受人際間的溫暖。' },
        reversed: { keywords: ['過度沉溺', '孤立', '八卦'], description: '社交活動可能讓你感到疲憊，或出現不真誠的交往。選擇品質而非數量。' }
      },
      { rank: 'Four', rankCN: '四', numeral: 'IV',
        upright: { keywords: ['倦怠', '不滿足', '沉思'], description: '對現狀感到厭倦。你擁有的已經很多，但內心渴望更深層的意義。' },
        reversed: { keywords: ['覺醒', '新動力', '行動'], description: '你終於從倦怠中醒來，準備好接受新的機會和可能性。' }
      },
      { rank: 'Five', rankCN: '五', numeral: 'V',
        upright: { keywords: ['失落', '悲傷', '遺憾'], description: '經歷了一些失去，悲傷是自然的。但轉身看看——你還擁有珍貴的東西。' },
        reversed: { keywords: ['接受', '釋懷', '前進'], description: '你開始從悲傷中走出來。接受已經發生的事，準備好迎接新的開始。' }
      },
      { rank: 'Six', rankCN: '六', numeral: 'VI',
        upright: { keywords: ['懷舊', '純真', '回憶'], description: '美好的回憶浮現。這是一個療癒的時刻，從過去的經歷中汲取溫暖和力量。' },
        reversed: { keywords: ['活在過去', '不切實際', '依賴'], description: '過度沉浸在過去無法前進。珍惜回憶但活在當下。' }
      },
      { rank: 'Seven', rankCN: '七', numeral: 'VII',
        upright: { keywords: ['幻想', '選擇', '誘惑'], description: '面前出現了太多誘人的選擇。小心分辨幻想與現實，不是每個機會都值得追求。' },
        reversed: { keywords: ['清醒', '決斷', '聚焦'], description: '迷霧散去，你能清楚看到什麼是真正值得追求的。做出明智的選擇。' }
      },
      { rank: 'Eight', rankCN: '八', numeral: 'VIII',
        upright: { keywords: ['離開', '放棄', '追尋'], description: '是時候離開不再適合你的地方了。這不是逃避，而是追尋更有意義的目標。' },
        reversed: { keywords: ['猶豫', '恐懼離開', '徘徊'], description: '你知道該離開卻捨不得。有些東西必須放下才能找到更好的。' }
      },
      { rank: 'Nine', rankCN: '九', numeral: 'IX',
        upright: { keywords: ['滿足', '願望成真', '幸福'], description: '你的心願即將實現！享受這份滿足與幸福，你值得擁有一切美好。' },
        reversed: { keywords: ['不滿足', '貪婪', '空虛'], description: '得到了想要的卻仍然不快樂。真正的滿足來自內心，而非外在。' }
      },
      { rank: 'Ten', rankCN: '十', numeral: 'X',
        upright: { keywords: ['圓滿', '家庭', '和諧'], description: '情感上的圓滿與和諧。家庭幸福、關係和睦，這是最美好的狀態。' },
        reversed: { keywords: ['家庭問題', '不和', '破裂'], description: '關係中出現裂痕。需要每個人的努力來修復和重建和諧。' }
      },
      { rank: 'Page', rankCN: '侍者', numeral: 'Pg',
        upright: { keywords: ['浪漫', '直覺', '好消息'], description: '聖杯侍者帶來情感上的好消息。可能是一段新的浪漫或創意靈感的到來。' },
        reversed: { keywords: ['情緒化', '不成熟', '幻想'], description: '過度感性可能讓你脫離現實。在情感中加入一些理性思考。' }
      },
      { rank: 'Knight', rankCN: '騎士', numeral: 'Kn',
        upright: { keywords: ['浪漫', '魅力', '追求'], description: '聖杯騎士帶來浪漫和追求。跟隨心的指引，勇敢表達你的感受。' },
        reversed: { keywords: ['情緒不穩', '虛偽', '逃避'], description: '情感上的不穩定或不真誠。確保你的感受是真實的，不是一時衝動。' }
      },
      { rank: 'Queen', rankCN: '皇后', numeral: 'Q',
        upright: { keywords: ['慈悲', '直覺', '情感智慧'], description: '聖杯皇后擁有深沉的情感智慧。用慈悲和直覺對待自己和他人。' },
        reversed: { keywords: ['情緒依賴', '殉道者', '敏感'], description: '過度在意他人的情緒讓你忽視了自己。先照顧好自己的需求。' }
      },
      { rank: 'King', rankCN: '國王', numeral: 'K',
        upright: { keywords: ['情感成熟', '智慧', '平衡'], description: '聖杯國王展現了情感的成熟與平衡。用理性引導情感，用情感豐富理性。' },
        reversed: { keywords: ['壓抑情感', '冷漠', '操控'], description: '情感被壓抑或用來操控他人。學會健康地表達和處理感受。' }
      }
    ]
  },
  {
    suit: 'Swords', suitCN: '寶劍', symbol: '⚔️', element: '風',
    theme: '思考、溝通、衝突、真相',
    cards: [
      { rank: 'Ace', rankCN: '王牌', numeral: 'A',
        upright: { keywords: ['真相', '清明', '突破'], description: '寶劍王牌帶來思維的突破和清明。真相已經揭露，用清晰的頭腦做出決定。' },
        reversed: { keywords: ['混亂', '誤解', '不清'], description: '思緒混亂，判斷力受到干擾。暫停做重大決定，先釐清思路。' }
      },
      { rank: 'Two', rankCN: '二', numeral: 'II',
        upright: { keywords: ['抉擇', '僵局', '平衡'], description: '你面臨一個需要謹慎思考的抉擇。蒙住眼睛的你需要用心去感受正確的方向。' },
        reversed: { keywords: ['資訊過載', '拖延決定', '焦慮'], description: '過度分析讓你無法做出決定。有時候不完美的行動勝過完美的等待。' }
      },
      { rank: 'Three', rankCN: '三', numeral: 'III',
        upright: { keywords: ['心痛', '分離', '悲傷'], description: '心碎是痛苦的，但這份痛苦是真實的。允許自己感受悲傷，然後慢慢癒合。' },
        reversed: { keywords: ['療癒', '釋放', '原諒'], description: '傷痛開始癒合。原諒自己和他人，讓心重新變得完整。' }
      },
      { rank: 'Four', rankCN: '四', numeral: 'IV',
        upright: { keywords: ['休息', '恢復', '沉思'], description: '你需要一段安靜的時間來恢復精力。暫時放下一切，讓身心得到休息。' },
        reversed: { keywords: ['焦躁', '疲憊', '強迫行動'], description: '你的身體在發出休息的訊號但你不願停下。繼續硬撐只會適得其反。' }
      },
      { rank: 'Five', rankCN: '五', numeral: 'V',
        upright: { keywords: ['衝突', '爭論', '失敗'], description: '一場爭鬥以不光彩的方式結束。贏了面子卻輸了裡子，重新思考何為真正的勝利。' },
        reversed: { keywords: ['和解', '放下仇恨', '反省'], description: '衝突漸漸平息。現在是和解的時候，放下過去的怨恨向前看。' }
      },
      { rank: 'Six', rankCN: '六', numeral: 'VI',
        upright: { keywords: ['過渡', '離開', '療癒'], description: '你正在離開困難的處境，駛向更平靜的水域。雖然旅途漫長，但最壞的已經過去。' },
        reversed: { keywords: ['困住', '無法前進', '舊傷'], description: '你想要前進卻被過去的事情拖住。處理好未解決的問題才能真正啟程。' }
      },
      { rank: 'Seven', rankCN: '七', numeral: 'VII',
        upright: { keywords: ['策略', '欺騙', '機智'], description: '需要用策略和機智處理當前的局面。但要小心，計謀不等於欺騙。' },
        reversed: { keywords: ['被揭穿', '良心不安', '坦白'], description: '隱瞞的事情可能被揭露。與其等著被拆穿，不如主動坦誠。' }
      },
      { rank: 'Eight', rankCN: '八', numeral: 'VIII',
        upright: { keywords: ['受困', '限制', '無力感'], description: '你感到被困住了，但仔細看——束縛你的可能是自己的想法。改變觀點就能找到出路。' },
        reversed: { keywords: ['解脫', '新觀點', '自由'], description: '你終於看到了束縛只是暫時的。新的觀點帶來了解脫的可能。' }
      },
      { rank: 'Nine', rankCN: '九', numeral: 'IX',
        upright: { keywords: ['焦慮', '噩夢', '擔憂'], description: '夜深人靜時的焦慮感正在侵蝕你。許多擔憂來自想像而非現實，試著區分兩者。' },
        reversed: { keywords: ['釋放焦慮', '希望', '恢復'], description: '焦慮開始消退，你看到了隧道盡頭的光。最黑暗的時刻即將過去。' }
      },
      { rank: 'Ten', rankCN: '十', numeral: 'X',
        upright: { keywords: ['結束', '崩潰', '觸底'], description: '最痛苦的結局。但好消息是——已經到底了，唯一的方向是向上。這是徹底的結束和全新的開始。' },
        reversed: { keywords: ['重生', '最壞已過', '恢復'], description: '最壞的時期已經過去。你正在從廢墟中站起來，帶著教訓重新開始。' }
      },
      { rank: 'Page', rankCN: '侍者', numeral: 'Pg',
        upright: { keywords: ['好奇', '求知', '觀察'], description: '寶劍侍者帶來需要思考的消息。保持好奇和警覺，用理性分析收到的資訊。' },
        reversed: { keywords: ['八卦', '輕率', '偷窺'], description: '小心不要成為流言蜚語的傳播者。未經證實的消息不要輕易散播。' }
      },
      { rank: 'Knight', rankCN: '騎士', numeral: 'Kn',
        upright: { keywords: ['果斷', '直率', '敏捷'], description: '寶劍騎士快速而果斷地行動。直言不諱是優點，但也要注意不要傷人。' },
        reversed: { keywords: ['衝動', '尖銳', '無方向'], description: '過度急躁和尖銳的言辭可能造成傷害。三思而後言。' }
      },
      { rank: 'Queen', rankCN: '皇后', numeral: 'Q',
        upright: { keywords: ['理性', '獨立', '洞察'], description: '寶劍皇后用清晰的頭腦看透事物本質。不受情感干擾，做出最理性的判斷。' },
        reversed: { keywords: ['冷酷', '尖刻', '情感壓抑'], description: '過度理性讓你顯得冷漠。適時展現柔軟的一面不是弱點。' }
      },
      { rank: 'King', rankCN: '國王', numeral: 'K',
        upright: { keywords: ['智慧', '權威', '公正'], description: '寶劍國王以智慧和公正做出決策。用知識和經驗引導判斷，追求真相。' },
        reversed: { keywords: ['濫權', '暴政', '冷血'], description: '智慧被用於傷害而非幫助。權力需要以正義為基礎。' }
      }
    ]
  },
  {
    suit: 'Pentacles', suitCN: '錢幣', symbol: '💰', element: '土',
    theme: '物質、工作、金錢、健康',
    cards: [
      { rank: 'Ace', rankCN: '王牌', numeral: 'A',
        upright: { keywords: ['新機會', '財富', '穩定'], description: '錢幣王牌帶來物質上的新機會。一個有利可圖的開始正在等著你，腳踏實地地把握。' },
        reversed: { keywords: ['錯失機會', '財務不穩', '貪婪'], description: '機會可能因為猶豫或貪心而溜走。穩健比快速更重要。' }
      },
      { rank: 'Two', rankCN: '二', numeral: 'II',
        upright: { keywords: ['平衡', '多工', '靈活'], description: '你正在同時處理多件事情。保持靈活和平衡，你有能力兼顧一切。' },
        reversed: { keywords: ['失衡', '分心', '力不從心'], description: '試圖兼顧太多讓你筋疲力盡。專注於最重要的事情。' }
      },
      { rank: 'Three', rankCN: '三', numeral: 'III',
        upright: { keywords: ['技藝', '團隊', '品質'], description: '你的專業能力獲得認可。專注於提升技藝品質，與團隊合作會帶來更好的成果。' },
        reversed: { keywords: ['敷衍', '缺乏技能', '不合作'], description: '工作品質下降或團隊配合出現問題。回到基本功，重建專業態度。' }
      },
      { rank: 'Four', rankCN: '四', numeral: 'IV',
        upright: { keywords: ['守護', '安全感', '節儉'], description: '你正在保護已經擁有的東西。適度的節儉是好的，但不要因為恐懼而緊抓不放。' },
        reversed: { keywords: ['吝嗇', '貪婪', '不安全感'], description: '過度的佔有慾反而讓你失去更多。學會適度地給予和分享。' }
      },
      { rank: 'Five', rankCN: '五', numeral: 'V',
        upright: { keywords: ['困難', '貧困', '孤立'], description: '經歷物質或精神上的困難。但困境是暫時的，尋找可以幫助你的資源和人。' },
        reversed: { keywords: ['度過難關', '恢復', '接受幫助'], description: '最困難的時期正在過去。敞開心胸接受他人的幫助。' }
      },
      { rank: 'Six', rankCN: '六', numeral: 'VI',
        upright: { keywords: ['慷慨', '分享', '施與受'], description: '你處於可以幫助他人的位置。慷慨地分享你的資源，施與受之間會找到平衡。' },
        reversed: { keywords: ['債務', '自私', '不平等'], description: '給予和接受之間失去平衡。確保交易是公平的。' }
      },
      { rank: 'Seven', rankCN: '七', numeral: 'VII',
        upright: { keywords: ['耐心', '長期投資', '等待收穫'], description: '你播下的種子需要時間成長。保持耐心，持續灌溉，收穫的日子會到來。' },
        reversed: { keywords: ['焦慮', '收益不佳', '缺乏耐心'], description: '等待讓你感到焦慮。確認你的投入方向正確，然後給它更多時間。' }
      },
      { rank: 'Eight', rankCN: '八', numeral: 'VIII',
        upright: { keywords: ['勤奮', '專注', '精進'], description: '透過持續的努力和專注，你的技術不斷精進。享受這個精雕細琢的過程。' },
        reversed: { keywords: ['缺乏熱情', '重複', '完美主義'], description: '工作變得機械化缺乏熱情。找回初心，或考慮是否該嘗試新的方向。' }
      },
      { rank: 'Nine', rankCN: '九', numeral: 'IX',
        upright: { keywords: ['豐收', '獨立', '享受成果'], description: '你的努力帶來了豐盛的回報。享受物質和精神的富足，你值得這一切。' },
        reversed: { keywords: ['過度依賴物質', '孤獨', '損失'], description: '物質的富足無法填補精神的空虛。回頭看看，什麼才是真正的富有。' }
      },
      { rank: 'Ten', rankCN: '十', numeral: 'X',
        upright: { keywords: ['傳承', '家族', '長久財富'], description: '建立了持久而穩定的基業。這不只是財富，更是可以傳承的價值和智慧。' },
        reversed: { keywords: ['家族問題', '財產糾紛', '不穩定'], description: '家族或長期計畫中出現問題。需要審視基礎，確保根基穩固。' }
      },
      { rank: 'Page', rankCN: '侍者', numeral: 'Pg',
        upright: { keywords: ['學習', '新技能', '機會'], description: '錢幣侍者帶來學習和成長的機會。用認真的態度對待這個起點。' },
        reversed: { keywords: ['不務實', '浪費', '缺乏專注'], description: '缺乏耐心和務實態度。成功需要從基礎一步步累積。' }
      },
      { rank: 'Knight', rankCN: '騎士', numeral: 'Kn',
        upright: { keywords: ['務實', '可靠', '穩步前進'], description: '錢幣騎士腳踏實地地朝目標前進。不求速度，但求穩定和確實。' },
        reversed: { keywords: ['停滯', '懶惰', '過度保守'], description: '過於保守讓你停滯不前。適時冒一些計算過的風險。' }
      },
      { rank: 'Queen', rankCN: '皇后', numeral: 'Q',
        upright: { keywords: ['務實', '豐饒', '照顧'], description: '錢幣皇后善於經營和照顧。用務實的方式創造溫暖舒適的環境。' },
        reversed: { keywords: ['過度物質', '忽視健康', '不安全感'], description: '過度專注物質層面而忽視了精神和身體的需求。平衡是關鍵。' }
      },
      { rank: 'King', rankCN: '國王', numeral: 'K',
        upright: { keywords: ['富足', '成功', '穩健'], description: '錢幣國王透過穩健的經營達到了富足。你有能力也有責任善用你的資源。' },
        reversed: { keywords: ['貪婪', '吝嗇', '物質至上'], description: '過度追求財富讓你失去了其他重要的東西。金錢只是工具，不是目的。' }
      }
    ]
  }
];

// Build Minor Arcana array from suit data
const MINOR_ARCANA = [];
let minorId = 22;
MINOR_ARCANA_SUITS.forEach(suit => {
  suit.cards.forEach(card => {
    MINOR_ARCANA.push({
      id: minorId++,
      name: `${card.rank} of ${suit.suit}`,
      nameCN: `${suit.suitCN}${card.rankCN}`,
      numeral: card.numeral,
      symbol: suit.symbol,
      upright: {
        meaning: card.upright.keywords.join('、'),
        keywords: card.upright.keywords,
        description: card.upright.description
      },
      reversed: {
        meaning: card.reversed.keywords.join('、'),
        keywords: card.reversed.keywords,
        description: card.reversed.description
      }
    });
  });
});

// Full 78-card deck
const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// Deck management
const Deck = {
  cards: [],
  drawnCards: [],

  init() {
    this.cards = ALL_CARDS.map(card => ({
      ...card,
      isReversed: false
    }));
    this.drawnCards = [];
  },

  // Fisher-Yates shuffle with random reversed
  shuffle() {
    this.drawnCards = [];
    const arr = this.cards;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // 50% chance for each card to be reversed
    arr.forEach(card => {
      card.isReversed = Math.random() < 0.5;
    });
  },

  // Draw top card from deck
  draw() {
    if (this.cards.length === 0) return null;
    const card = this.cards.pop();
    this.drawnCards.push(card);
    return card;
  },

  // Get remaining count
  get remaining() {
    return this.cards.length;
  },

  // Reset deck
  reset() {
    this.init();
  }
};
