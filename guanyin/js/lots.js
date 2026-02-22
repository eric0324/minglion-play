// lots.js - 100 Guanyin Oracle Lots (觀音靈籤)

const FORTUNE_LEVELS = {
  '上上': { label: '上上籤', cssClass: 'fortune-best' },
  '上':   { label: '上籤',   cssClass: 'fortune-good' },
  '中':   { label: '中籤',   cssClass: 'fortune-mid' },
  '下':   { label: '下籤',   cssClass: 'fortune-bad' },
  '下下': { label: '下下籤', cssClass: 'fortune-worst' }
};

const LOTS = [
  {
    number: 1, fortune: '上上', title: '開天闢地作良緣',
    poem: ['日出便見風雲散', '光明清淨照世間', '一朝雷雨聲遍地', '萬物欣榮福自天'],
    interpretation: '此籤大吉，萬事亨通，如旭日東升雲開霧散，一切障礙自然消除。',
    advice: { marriage: '天作之合，良緣可期。', career: '大展鴻圖，事業有成。', health: '身體康健，無須掛慮。', wealth: '財源廣進，利路亨通。', travel: '出行大吉，一路平安。', lawsuit: '官司必勝，理在己方。', lostItem: '失物可尋，不日即回。', pregnancy: '求孕順利，喜得貴子。' }
  },
  {
    number: 2, fortune: '下下', title: '鬼門關前險路行',
    poem: ['鬼門關前險路行', '未知何處是前程', '若能勤修功與德', '幽暗之中見光明'],
    interpretation: '此籤不吉，前路險阻重重，宜多行善積德以化解困境。',
    advice: { marriage: '姻緣未至，暫勿強求。', career: '諸事不順，宜守不宜進。', health: '注意保養，慎防疾病。', wealth: '財運不佳，切忌投機。', travel: '不宜遠行，出門多阻。', lawsuit: '訴訟不利，宜和解退讓。', lostItem: '失物難尋，恐難復得。', pregnancy: '暫時不宜，需多調養。' }
  },
  {
    number: 3, fortune: '下', title: '臨崖勒馬收韁晚',
    poem: ['勸君切莫向他求', '似鶴飛來暗箭投', '若去採薪蛇在草', '恐遭毒害不堪憂'],
    interpretation: '此籤警示防小人暗害，凡事小心謹慎，勿輕信他人。',
    advice: { marriage: '對象需慎選，防有欺瞞。', career: '提防小人，凡事三思。', health: '慎防暗疾，宜及早就醫。', wealth: '勿貪小利，防遭損失。', travel: '出行不利，宜留守為安。', lawsuit: '官司兇險，宜避為妙。', lostItem: '恐被人取，難以尋回。', pregnancy: '需多注意安胎保養。' }
  },
  {
    number: 4, fortune: '上', title: '千年古鏡重磨光',
    poem: ['千年古鏡復重光', '女再求夫男再婚', '自此門庭重改換', '更添福祿在兒孫'],
    interpretation: '此籤主重新開始，否極泰來，舊事翻新，家運興隆。',
    advice: { marriage: '再婚可成，良緣再續。', career: '轉機已到，事業更新。', health: '舊疾漸癒，身體好轉。', wealth: '財運漸開，日漸豐盈。', travel: '出行有利，可獲新機。', lawsuit: '訴訟轉好，可望勝出。', lostItem: '舊物可尋，終會復得。', pregnancy: '求孕有望，耐心等待。' }
  },
  {
    number: 5, fortune: '中', title: '有勢不可倚盡力',
    poem: ['一錐僅解破一孔', '仔細工夫不可同', '若使事事皆如意', '勸君且慢費心胸'],
    interpretation: '凡事不可操之過急，一步一步來方能成事，切勿好高騖遠。',
    advice: { marriage: '循序漸進，不可急躁。', career: '腳踏實地，穩步前行。', health: '平安無大礙，注意作息。', wealth: '小有進帳，不可貪多。', travel: '可行但勿遠，近遊為宜。', lawsuit: '耐心處理，不宜急進。', lostItem: '仔細尋找，或可復得。', pregnancy: '順其自然，勿過焦慮。' }
  },
  {
    number: 6, fortune: '中', title: '投身岩下銅鳥飛',
    poem: ['投身岩下銅鳥居', '須是還他大丈夫', '捨得眼前花果撒', '方知枝頭別有珠'],
    interpretation: '有捨方有得，眼前之失未必是真失，放下執著方見真機。',
    advice: { marriage: '放下成見，真緣自來。', career: '先捨後得，需有遠見。', health: '改掉壞習慣，健康自來。', wealth: '捨小取大，先投資後收益。', travel: '出行可往，另有收穫。', lawsuit: '宜退一步，海闊天空。', lostItem: '捨舊得新，不必執著。', pregnancy: '放鬆心情，順其自然。' }
  },
  {
    number: 7, fortune: '下', title: '浪淘沙裏能揀金',
    poem: ['奔波勞碌過春秋', '倦鳥歸巢百不憂', '若有閒情觀自在', '名利何須苦追求'],
    interpretation: '辛苦奔波卻所得有限，不如放下名利，安分守己。',
    advice: { marriage: '隨緣即可，強求無益。', career: '暫時蟄伏，不宜妄動。', health: '勞累過度，宜多休息。', wealth: '求財不易，量入為出。', travel: '奔波無益，不如在家。', lawsuit: '訟事費心，不如和解。', lostItem: '勞而無功，恐難復得。', pregnancy: '心情放鬆，不宜過慮。' }
  },
  {
    number: 8, fortune: '上', title: '茂林松柏正興旺',
    poem: ['茂林松柏正興旺', '雨雪風霜總莫為', '異日忽然成大用', '功名成就棟樑材'],
    interpretation: '如松柏經冬不凋，歷經考驗終成大器，前途光明。',
    advice: { marriage: '佳偶天成，感情穩固。', career: '厚積薄發，終成大業。', health: '體質強健，耐力持久。', wealth: '穩中求進，財運漸旺。', travel: '出行平安，前途順暢。', lawsuit: '正義在手，終可勝訴。', lostItem: '耐心等待，終可尋回。', pregnancy: '順利可期，母子均安。' }
  },
  {
    number: 9, fortune: '中', title: '命中正逢羅睺星',
    poem: ['煩惱從來因自起', '須教歷過事方知', '緊咬牙關撐過去', '看破紅塵悟禪機'],
    interpretation: '眼前雖有煩惱，但咬牙撐過便能豁然開朗，苦盡甘來。',
    advice: { marriage: '感情有波折，需耐心經營。', career: '先苦後甜，堅持即勝。', health: '小病纏身，調養可癒。', wealth: '暫時困頓，日後好轉。', travel: '途中有阻，但終可達。', lawsuit: '曲折反覆，最終尚可。', lostItem: '費些工夫，或可尋得。', pregnancy: '過程辛苦，但有好結果。' }
  },
  {
    number: 10, fortune: '中', title: '離山觀天十成九',
    poem: ['石藏無價玉和珍', '只管他鄉外處尋', '宛如持燈更覓火', '不如收拾枉勞心'],
    interpretation: '所求之物近在眼前，不必外求，回頭即見。',
    advice: { marriage: '身邊人即是良緣，勿遠求。', career: '善用手邊資源，不必他求。', health: '調整生活作息即可改善。', wealth: '現有之業用心經營即可。', travel: '不必遠行，近處即有所得。', lawsuit: '就近解決，勿節外生枝。', lostItem: '就在身邊，仔細找找。', pregnancy: '放鬆心態，好消息就在眼前。' }
  },
  {
    number: 11, fortune: '上', title: '有心作福莫遲疑',
    poem: ['有心作福莫遲疑', '無論多寡濟貧危', '天公自有相酬意', '報答功德在後期'],
    interpretation: '積善行德必有好報，勿因善小而不為，福報後至。',
    advice: { marriage: '以誠待人，姻緣自成。', career: '廣結善緣，貴人自來。', health: '心存善念，身心安泰。', wealth: '樂善好施，財運更旺。', travel: '出行助人，必得回報。', lawsuit: '以和為貴，善了結局。', lostItem: '行善積德，失物可回。', pregnancy: '多行善事，求孕順遂。' }
  },
  {
    number: 12, fortune: '中', title: '否極泰來咸有功',
    poem: ['否極泰來咸有功', '操心用盡暗中逢', '誠心且把觀音禱', '做事須知先後通'],
    interpretation: '困境即將過去，誠心祈禱做事有條有理，否極泰來。',
    advice: { marriage: '先苦後甜，終能圓滿。', career: '漸入佳境，按部就班。', health: '病情好轉，持續調養。', wealth: '困頓將過，財運回升。', travel: '稍安勿躁，時機將至。', lawsuit: '耐心等候，終有轉機。', lostItem: '幾經波折，或可復得。', pregnancy: '誠心祈禱，好事將近。' }
  },
  {
    number: 13, fortune: '中', title: '春來花發映陽台',
    poem: ['春來花發映陽台', '萬里車來進寶財', '若得禹門三級浪', '恰如平地一聲雷'],
    interpretation: '時運將開，如春花綻放，若把握機會可一飛沖天。',
    advice: { marriage: '春暖花開，好事將近。', career: '把握時機，可望晉升。', health: '健康漸佳，精神煥發。', wealth: '財運亨通，收入增加。', travel: '出行有利，可遇好事。', lawsuit: '形勢有利，可望勝出。', lostItem: '有望尋回，耐心等候。', pregnancy: '時機成熟，可期喜訊。' }
  },
  {
    number: 14, fortune: '中', title: '宿債冤家當面來',
    poem: ['宿債冤家當面來', '稜稜過後漸無災', '人生可比秋風起', '堪笑寒枝惜殘荷'],
    interpretation: '舊日糾紛找上門，但忍過便無災，學會放下過往。',
    advice: { marriage: '舊情糾葛，需理清關係。', career: '處理舊帳，方能前行。', health: '舊疾復發，需積極治療。', wealth: '先還舊債，再求新財。', travel: '暫緩出行，先理清事務。', lawsuit: '舊案纏身，耐心處理。', lostItem: '與舊事有關，循線可查。', pregnancy: '先調理身體，再做打算。' }
  },
  {
    number: 15, fortune: '中', title: '行船離港又遇風',
    poem: ['行船離港又遇風', '指望求謀總是空', '莫歎世途多險惡', '心寬步穩自亨通'],
    interpretation: '眼前阻礙重重，但只要心態放寬、穩步前行，終能亨通。',
    advice: { marriage: '勿急於求成，耐心等待。', career: '遇阻勿慌，穩住腳步。', health: '放寬心情，注意壓力。', wealth: '暫時不順，守穩為宜。', travel: '途中有風浪，小心謹慎。', lawsuit: '不可急躁，以穩為主。', lostItem: '暫難尋回，不必急躁。', pregnancy: '放鬆心情，順其自然。' }
  },
  {
    number: 16, fortune: '上', title: '愁眉思慮暫時開',
    poem: ['愁眉思慮暫時開', '兩扇門中易得財', '不用慮他前後事', '天公遲早報將來'],
    interpretation: '愁雲即散，財運將至，不必過慮，天自有安排。',
    advice: { marriage: '喜事臨門，姻緣美滿。', career: '好運降臨，事業順利。', health: '憂慮放下，身體自安。', wealth: '財路大開，收入豐厚。', travel: '出行順利，心情愉快。', lawsuit: '官司有利，可望勝出。', lostItem: '不久即可尋回。', pregnancy: '好消息將至，安心等待。' }
  },
  {
    number: 17, fortune: '上', title: '秋月掛在半天中',
    poem: ['秋月掛在半天中', '佳人偶遇及時逢', '只宜靜守莫輕動', '天賜良緣恐自蹤'],
    interpretation: '良緣天定，靜待即可，莫輕舉妄動以免錯失機緣。',
    advice: { marriage: '靜候佳音，良緣天定。', career: '守住本分，好機會自來。', health: '靜養為宜，不宜操勞。', wealth: '財運平穩，靜候佳機。', travel: '暫且安守，時機未到。', lawsuit: '靜觀其變，勿輕舉妄動。', lostItem: '安靜等待，自會出現。', pregnancy: '放鬆心情，好孕將至。' }
  },
  {
    number: 18, fortune: '上', title: '恰如抱虎過山溪',
    poem: ['恰如抱虎過山溪', '急於慌忙莫措持', '心靜只宜求靜好', '恐防一出事難移'],
    interpretation: '處境雖險但終能過關，關鍵在於沉著冷靜，切忌慌張。',
    advice: { marriage: '冷靜處理感情問題。', career: '危中有機，沉著應對。', health: '保持鎮定，配合治療。', wealth: '謹慎理財，不宜冒險。', travel: '出行小心，但可平安。', lawsuit: '冷靜應對，不可慌亂。', lostItem: '靜心回想，可找到線索。', pregnancy: '安心靜養，一切順利。' }
  },
  {
    number: 19, fortune: '中', title: '急水灘頭放船歸',
    poem: ['急水灘頭放船歸', '風波作浪欲何為', '若要安然求穩當', '等待良辰彩雲飛'],
    interpretation: '急流中不宜冒進，等待適當時機再行動方為上策。',
    advice: { marriage: '時機未到，耐心等候。', career: '暫勿躁進，等待時機。', health: '多加保重，不宜勞累。', wealth: '暫時守穩，勿急投資。', travel: '延後出行較為安全。', lawsuit: '暫緩訴訟，等待有利時機。', lostItem: '暫時無消息，靜候。', pregnancy: '順其自然，時機未到。' }
  },
  {
    number: 20, fortune: '中', title: '當春久雨喜初晴',
    poem: ['當春久雨喜初晴', '玉兔金烏漸漸明', '舊事消散新事遂', '看看一跳過龍門'],
    interpretation: '陰霾即將散去，新氣象來臨，舊事消散、新運開展。',
    advice: { marriage: '舊緣散去，新緣將至。', career: '轉機出現，好運將來。', health: '病情好轉，漸漸康復。', wealth: '財運回升，漸入佳境。', travel: '雨過天晴，出行順利。', lawsuit: '案情轉好，可望了結。', lostItem: '或有消息，不日可回。', pregnancy: '好事漸近，安心等候。' }
  },
  {
    number: 21, fortune: '上', title: '陰陽道合此形明',
    poem: ['陰陽道合此形明', '邪正真假到此分', '前途莫為閒操心', '凡事自有好前程'],
    interpretation: '是非分明，前途光明，不必為閒事操心，一切自有定數。',
    advice: { marriage: '真假可辨，真緣在前。', career: '前途明朗，安心前行。', health: '身體無礙，不須擔心。', wealth: '正財可得，偏財勿取。', travel: '出行順利，可放心前往。', lawsuit: '是非分明，正義得彰。', lostItem: '真假可辨，可望尋回。', pregnancy: '安心待產，一切平順。' }
  },
  {
    number: 22, fortune: '中', title: '六月飛霜冷透心',
    poem: ['六月飛霜冷透心', '待時久了又無音', '雖然足下生雲霧', '到底還歸正道行'],
    interpretation: '目前處境令人心寒，但終將撥雲見日，回歸正途。',
    advice: { marriage: '暫有冷淡，但終能回溫。', career: '遭遇挫折，但方向正確。', health: '體寒需注意保暖調養。', wealth: '暫入低谷，終會回升。', travel: '途中不順，但能平安歸。', lawsuit: '過程艱辛，但結果尚可。', lostItem: '暫無消息，耐心等候。', pregnancy: '暫時未有，不必灰心。' }
  },
  {
    number: 23, fortune: '中', title: '一紙官書火急催',
    poem: ['一紙官書火急催', '心中愁悶意難開', '須當仔細觀前後', '只在門庭日裡回'],
    interpretation: '事情緊迫令人焦慮，但仔細思量便能在近處找到解決之道。',
    advice: { marriage: '勿急於定論，仔細考量。', career: '急事緩辦，三思而行。', health: '如有不適，儘速就醫。', wealth: '急用之財，家中可周轉。', travel: '急事出行可，但需謹慎。', lawsuit: '仔細應對，注意細節。', lostItem: '就在家中附近，仔細找。', pregnancy: '勿過焦慮，按部就班。' }
  },
  {
    number: 24, fortune: '上', title: '不求自至有何疑',
    poem: ['不求自至有何疑', '善惡分明各有時', '但把心田耕種好', '自然秋後果然奇'],
    interpretation: '不必刻意追求，只要心存善念勤勉耕耘，福報自然到來。',
    advice: { marriage: '不必強求，緣分到自然成。', career: '踏實耕耘，成果自然來。', health: '養生有道，自然健康。', wealth: '正當經營，財自然來。', travel: '不必特意安排，隨緣即可。', lawsuit: '行得正坐得端，無須擔心。', lostItem: '不必刻意尋找，自會出現。', pregnancy: '順其自然，水到渠成。' }
  },
  {
    number: 25, fortune: '上', title: '過了憂危第幾重',
    poem: ['過了憂危第幾重', '從今再歷永無凶', '一心只管依天理', '福祿無窮盡此中'],
    interpretation: '危難已過，從此一帆風順，依循正道福祿綿長。',
    advice: { marriage: '苦盡甘來，幸福長久。', career: '困難已過，前程似錦。', health: '大病已過，從此安康。', wealth: '否極泰來，財運大好。', travel: '一路平安，萬事順遂。', lawsuit: '官司已了，不再有憂。', lostItem: '已可尋回，不再遺失。', pregnancy: '順利得子，母子平安。' }
  },
  {
    number: 26, fortune: '中', title: '上下傳來事轉虛',
    poem: ['上下傳來事轉虛', '天邊接得一封書', '出路須當忍耐好', '凡事待時無太急'],
    interpretation: '消息真假難辨，凡事宜忍耐等待，切勿太急。',
    advice: { marriage: '消息未明，勿聽信傳言。', career: '靜待確認，勿輕信承諾。', health: '多方求證，勿聽偏方。', wealth: '投資需查證，勿聽傳言。', travel: '確認消息後再出發。', lawsuit: '消息反覆，耐心等候。', lostItem: '消息不確，仍需等待。', pregnancy: '多方確認，耐心等候。' }
  },
  {
    number: 27, fortune: '下', title: '一謀一用一番書',
    poem: ['一謀一用一番書', '願望難成事事虛', '只恐路旁彈外發', '須防牆上耳邊聽'],
    interpretation: '計謀難成，須防隔牆有耳，小心機密外洩。',
    advice: { marriage: '秘密恐被揭露，需坦誠相對。', career: '計畫恐遭洩漏，慎言慎行。', health: '注意隱疾，及早檢查。', wealth: '投資不宜，恐有損失。', travel: '出行不利，宜在家守候。', lawsuit: '機密外洩，訟事不利。', lostItem: '恐被他人所得，難以追回。', pregnancy: '時機不佳，需多調養。' }
  },
  {
    number: 28, fortune: '下', title: '東邊月上正嬋娟',
    poem: ['東邊月上正嬋娟', '頂上雲遮月半邊', '莫道圓時還缺少', '有人拋擲在前川'],
    interpretation: '好事將成卻有阻礙，圓滿中仍有缺憾，需防暗中破壞。',
    advice: { marriage: '看似美好卻有隱憂。', career: '將成之事恐生變數。', health: '表面無事，暗藏隱患。', wealth: '到手之財恐有損耗。', travel: '途中有變，需做備案。', lawsuit: '看似有利，實則凶險。', lostItem: '似見蹤影，卻難到手。', pregnancy: '需多注意，防止意外。' }
  },
  {
    number: 29, fortune: '下', title: '急走過場抽妙計',
    poem: ['急走過場抽妙計', '看看得路又猶疑', '猛然一棒金鑼響', '萬馬奔騰不可知'],
    interpretation: '局勢變化莫測，剛見機會又生變數，難以掌控。',
    advice: { marriage: '變數太多，暫緩決定。', career: '局勢不明，觀望為宜。', health: '病情反覆，需持續追蹤。', wealth: '市場多變，不宜冒險。', travel: '行程多變，需有彈性。', lawsuit: '案情反覆，難以預料。', lostItem: '線索斷續，難以追蹤。', pregnancy: '狀況不穩，需密切注意。' }
  },
  {
    number: 30, fortune: '中', title: '一場歡喜一場空',
    poem: ['一場歡喜一場空', '想起那時好威風', '倒不如淡飯黃齏過', '免得人前遭困窮'],
    interpretation: '繁華如夢轉眼空，不如安分守己、粗茶淡飯過日子。',
    advice: { marriage: '務實相處，勿追求虛榮。', career: '穩紮穩打，勿好高騖遠。', health: '簡單飲食，規律作息。', wealth: '勿追暴利，穩健理財。', travel: '簡單出行，勿鋪張。', lawsuit: '虛名不值，宜快速了結。', lostItem: '放下執著，隨緣即可。', pregnancy: '平常心看待，順其自然。' }
  },
  {
    number: 31, fortune: '上', title: '春來雷震百蟲鳴',
    poem: ['春來雷震百蟲鳴', '番身一轉離泥中', '始知出入還來往', '一笑開顏事事通'],
    interpretation: '如驚蟄春雷喚醒萬物，困境一轉即出，事事亨通。',
    advice: { marriage: '柳暗花明，喜事臨門。', career: '轉機降臨，一飛沖天。', health: '病痛消除，精神煥發。', wealth: '財運突破，收入大增。', travel: '出行大吉，處處逢春。', lawsuit: '翻案成功，撥雲見日。', lostItem: '突然出現，意外尋回。', pregnancy: '好消息突然降臨。' }
  },
  {
    number: 32, fortune: '上', title: '前生注定事非輕',
    poem: ['前生注定事非輕', '好把經文多看誦', '如逢善事只宜為', '還須恭敬觀世音'],
    interpretation: '一切皆有因緣，多行善事、虔誠禮佛，自然逢凶化吉。',
    advice: { marriage: '前世姻緣，此生續寫。', career: '遇貴人指引，事業有成。', health: '虔誠修行，身心安泰。', wealth: '善財廣進，福報不斷。', travel: '出行平安，菩薩護佑。', lawsuit: '心存善念，逢凶化吉。', lostItem: '誠心祈禱，或可復得。', pregnancy: '虔誠祈求，可得如願。' }
  },
  {
    number: 33, fortune: '中', title: '內藏無價寶和珍',
    poem: ['內藏無價寶和珍', '得玉何須外處尋', '不如行善多修福', '前途自有貴人臨'],
    interpretation: '寶藏就在自身，多行善修福，貴人自然出現。',
    advice: { marriage: '身邊即有良緣，勿外求。', career: '自身實力足夠，善用才能。', health: '自身免疫力佳，信心為要。', wealth: '經營現有事業即可。', travel: '不必遠行，近處有福。', lawsuit: '自身有理，貴人相助。', lostItem: '就在身邊，仔細翻找。', pregnancy: '調養好身體，自然可得。' }
  },
  {
    number: 34, fortune: '下', title: '行藏虛實自家知',
    poem: ['行藏虛實自家知', '禍到將臨何處避', '一動不如且守靜', '待時機到自然明'],
    interpretation: '禍患將臨，此時不宜妄動，靜守以待時機。',
    advice: { marriage: '暫勿表態，靜觀其變。', career: '不宜跳槽或創業，守穩為要。', health: '防範未然，定期檢查。', wealth: '守住現有，切勿冒險。', travel: '不宜出行，留守為安。', lawsuit: '靜待時機，勿輕舉妄動。', lostItem: '暫時放下，日後再說。', pregnancy: '暫不適宜，靜候時機。' }
  },
  {
    number: 35, fortune: '中', title: '衡門之下可棲遲',
    poem: ['衡門之下可棲遲', '頓把心頭事已知', '倘若猛然風雷至', '恰如月被黑雲遮'],
    interpretation: '目前安穩但需防突發變故，居安思危方為上策。',
    advice: { marriage: '目前穩定，但需防變。', career: '安穩中求進步，防突發狀況。', health: '目前尚可，需持續注意。', wealth: '收入穩定，但需有備無患。', travel: '短途可行，遠行需防變。', lawsuit: '暫時平靜，但需警覺。', lostItem: '可能在某處安放，仔細回想。', pregnancy: '穩定中求，注意保養。' }
  },
  {
    number: 36, fortune: '中', title: '眼前病訟不須憂',
    poem: ['眼前病訟不須憂', '戶內陰人且莫愁', '凡事小心加謹慎', '看看凶去得安流'],
    interpretation: '病痛官司不必過憂，小心謹慎便能化險為夷。',
    advice: { marriage: '小心經營，感情無礙。', career: '謹慎處事，可化險為夷。', health: '積極治療，可望痊癒。', wealth: '謹慎理財，不致損失。', travel: '小心出行，可保平安。', lawsuit: '小心應對，可望化解。', lostItem: '仔細搜尋，或可復得。', pregnancy: '多加小心，可保平安。' }
  },
  {
    number: 37, fortune: '上', title: '一道明光照暗中',
    poem: ['一道明光照暗中', '千里路上不停風', '自由自在逍遙去', '秋水雲開見碧空'],
    interpretation: '光明照亮前路，一切障礙消散，自由自在前行。',
    advice: { marriage: '姻緣明朗，幸福可期。', career: '前途光明，一路順遂。', health: '身體康健，精神飽滿。', wealth: '財運亨通，來路光明。', travel: '一路順風，暢行無阻。', lawsuit: '正義昭彰，必然勝訴。', lostItem: '很快可尋回。', pregnancy: '一切順利，喜獲麟兒。' }
  },
  {
    number: 38, fortune: '下', title: '月照天書靜處期',
    poem: ['月照天書靜處期', '忽聞雲外一聲雷', '平地風波無處避', '心中驚恐暗生疑'],
    interpretation: '平靜中突生變故，令人措手不及，心中驚恐不安。',
    advice: { marriage: '突生變故，需冷靜面對。', career: '意外狀況發生，需應變。', health: '突發疾病，速速就醫。', wealth: '意外損失，需有心理準備。', travel: '出行恐有意外，宜延後。', lawsuit: '突然被告，需速求律師。', lostItem: '突然發現遺失，難以追回。', pregnancy: '注意突發狀況，定期檢查。' }
  },
  {
    number: 39, fortune: '下', title: '天邊消息實難猜',
    poem: ['天邊消息實難猜', '切莫多心望上台', '若要得他須費力', '恐防到底一場災'],
    interpretation: '遠方消息不可靠，勿抱過高期望，強求恐招災禍。',
    advice: { marriage: '遠距離戀情不利，勿強求。', career: '期望落空，需調整方向。', health: '勿信偏方，尋求正規治療。', wealth: '投資勿聽遠方消息。', travel: '遠行不利，宜近不宜遠。', lawsuit: '勝算不大，宜和解。', lostItem: '恐已遠去，難以追回。', pregnancy: '目前不宜，需多調養。' }
  },
  {
    number: 40, fortune: '上', title: '一年作事急如飛',
    poem: ['一年作事急如飛', '務要求謀莫遲疑', '正好努力奮志去', '運來得意稱心機'],
    interpretation: '時運已到，把握機會全力以赴，一切如意。',
    advice: { marriage: '積極追求，良緣可成。', career: '奮力向前，事業騰飛。', health: '身體強健，充滿活力。', wealth: '財運大好，積極理財。', travel: '出行大吉，把握機會。', lawsuit: '積極應對，可望勝出。', lostItem: '積極尋找，必可復得。', pregnancy: '積極調養，好消息將至。' }
  },
  {
    number: 41, fortune: '上', title: '無限好事君須記',
    poem: ['無限好事君須記', '終朝每日常歡喜', '若問前途是幾何', '萬事勝意在今始'],
    interpretation: '好運連連，從今日起萬事如意，好事不斷。',
    advice: { marriage: '喜事臨門，婚姻美滿。', career: '萬事勝意，事業輝煌。', health: '身心愉快，健康長壽。', wealth: '財源滾滾，好運不斷。', travel: '出行愉快，處處順利。', lawsuit: '官司順利，必得勝訴。', lostItem: '好消息，很快尋回。', pregnancy: '大喜之兆，可得如願。' }
  },
  {
    number: 42, fortune: '上', title: '一脈祥光照四方',
    poem: ['一脈祥光照四方', '出門遇貴得平康', '若問功名成就處', '秋來冬盡是風光'],
    interpretation: '祥瑞之光普照，出門遇貴人相助，功名指日可待。',
    advice: { marriage: '貴人牽線，良緣美滿。', career: '貴人提攜，功名有望。', health: '平安康泰，不必掛慮。', wealth: '貴人相助，財運大吉。', travel: '出行遇貴，萬事平安。', lawsuit: '貴人相助，官司有利。', lostItem: '有人幫忙，可望尋回。', pregnancy: '秋冬時節，可期喜訊。' }
  },
  {
    number: 43, fortune: '中', title: '天賜良緣偶自成',
    poem: ['天賜良緣偶自成', '官中有祿在前程', '須知佳境非常得', '不是煙雲浪里生'],
    interpretation: '良緣與功祿皆天賜，但需珍惜，切勿視為理所當然。',
    advice: { marriage: '天賜良緣，好好珍惜。', career: '機會難得，把握住。', health: '健康是福，需加珍惜。', wealth: '得來之財，善加運用。', travel: '適時出行，把握良機。', lawsuit: '形勢有利，珍惜機會。', lostItem: '偶然間可尋回。', pregnancy: '天賜之福，好好珍惜。' }
  },
  {
    number: 44, fortune: '中', title: '棋逢敵手在前頭',
    poem: ['棋逢敵手在前頭', '好事多磨不自由', '且守分隨時過日', '釜中魚兒怎能游'],
    interpretation: '遇到勢均力敵的對手，好事多磨，宜安分守己度過。',
    advice: { marriage: '有競爭者出現，需用心經營。', career: '競爭激烈，守住本分。', health: '壓力大，注意身心調適。', wealth: '競爭多，利潤薄，穩守為宜。', travel: '出行多阻，不如在家。', lawsuit: '勢均力敵，難分勝負。', lostItem: '被他人所得，難以追回。', pregnancy: '多磨但終有好結果。' }
  },
  {
    number: 45, fortune: '上', title: '溫柔自古勝剛強',
    poem: ['溫柔自古勝剛強', '積善之家慶有餘', '若能更把觀音禮', '定叫福壽永康寧'],
    interpretation: '以柔克剛，積善之家必有餘慶，虔誠禮佛福壽康寧。',
    advice: { marriage: '以柔情相待，婚姻美滿。', career: '以德服人，事業長久。', health: '心平氣和，身體自安。', wealth: '積善得福，財運綿長。', travel: '和氣出行，處處平安。', lawsuit: '以和為貴，化干戈為玉帛。', lostItem: '善意尋求，可望歸還。', pregnancy: '虔誠祈禱，福壽雙全。' }
  },
  {
    number: 46, fortune: '上', title: '勸君耐守舊生涯',
    poem: ['勸君耐守舊生涯', '怎曉天公作馬牙', '久困龍蛇終有日', '開花結果向天涯'],
    interpretation: '堅守本業耐心等待，如蟄伏之龍終有騰飛之日。',
    advice: { marriage: '耐心等待，良人終至。', career: '堅守崗位，終會出頭。', health: '耐心調養，終可痊癒。', wealth: '守住本業，終能致富。', travel: '暫留守，日後再行。', lawsuit: '堅持正義，終得公道。', lostItem: '耐心等待，終可尋回。', pregnancy: '耐心等候，終得喜訊。' }
  },
  {
    number: 47, fortune: '上', title: '錦上添花色更鮮',
    poem: ['錦上添花色更鮮', '運來祿馬喜雙全', '時人莫恨功名晚', '一舉登科天下傳'],
    interpretation: '好上加好，功名利祿雙收，大器晚成亦是美事。',
    advice: { marriage: '錦上添花，雙喜臨門。', career: '一舉成名，功成名就。', health: '健康更上層樓。', wealth: '財運大旺，喜上加喜。', travel: '出行大吉，喜事連連。', lawsuit: '大獲全勝。', lostItem: '不但尋回，還有額外收穫。', pregnancy: '大喜之兆。' }
  },
  {
    number: 48, fortune: '中', title: '鯤化為鵬未遂時',
    poem: ['鯤化為鵬未遂時', '候風雲會有期奇', '須教恆志無休倦', '守得雲開見月時'],
    interpretation: '大鵬尚未展翅，需恆心等待風雲際會，堅持必有出頭之日。',
    advice: { marriage: '緣分未到，持續等待。', career: '時機未熟，持續努力。', health: '長期調養，終見成效。', wealth: '暫未發達，但前景看好。', travel: '時機未到，稍安勿躁。', lawsuit: '案件需時，耐心等候。', lostItem: '暫無消息，但有望尋回。', pregnancy: '需要耐心，持續調養。' }
  },
  {
    number: 49, fortune: '下', title: '一片無心莫問他',
    poem: ['一片無心莫問他', '坎坷途路實堪嗟', '若論前世因和果', '須等春風化朽枒'],
    interpretation: '前路坎坷，問事無益，需等待時機如春風化枯木。',
    advice: { marriage: '暫無姻緣，勿強求。', career: '前途坎坷，需等待時機。', health: '身體欠安，需耐心治療。', wealth: '財運低迷，量入為出。', travel: '不宜出行。', lawsuit: '訟事不利，宜忍耐。', lostItem: '恐難尋回。', pregnancy: '時機未到，需多調養。' }
  },
  {
    number: 50, fortune: '中', title: '五十功名志未休',
    poem: ['五十功名志未休', '百般變化顯身手', '若然前路行將去', '莫負當初一點愁'],
    interpretation: '雖歷經滄桑仍志氣不減，堅持走下去，莫忘初心。',
    advice: { marriage: '初心不改，感情長久。', career: '堅持初衷，成就可期。', health: '保持良好習慣，健康無虞。', wealth: '持續努力，財運可期。', travel: '出行前做好準備。', lawsuit: '堅持正義，終有結果。', lostItem: '回想初始地點，或可尋得。', pregnancy: '持續調養，不放棄希望。' }
  },
  {
    number: 51, fortune: '中', title: '夏日炎天日正長',
    poem: ['夏日炎天日正長', '人人撐傘避清涼', '始知萬物皆由命', '何必營營日夜忙'],
    interpretation: '凡事皆有定數，不必過度操勞，順天知命方能自在。',
    advice: { marriage: '隨緣而定，勿過操心。', career: '適度努力，不必過勞。', health: '注意防暑，適度休息。', wealth: '知足常樂，不必強求。', travel: '防曬防暑，適度出行。', lawsuit: '順其自然，勿過強求。', lostItem: '命中注定，隨緣即可。', pregnancy: '放寬心態，聽從天意。' }
  },
  {
    number: 52, fortune: '下', title: '夜靜水寒魚不食',
    poem: ['夜靜水寒魚不食', '滿船空載月明歸', '可歎漁翁徒費力', '不如收拾早回家'],
    interpretation: '時機不對，一切努力恐徒勞無功，不如暫且收手。',
    advice: { marriage: '暫時無緣，不如放下。', career: '時機不對，暫且退守。', health: '需重新評估治療方案。', wealth: '投入無回報，宜及早止損。', travel: '此時不宜出行。', lawsuit: '勝算不大，宜撤訴和解。', lostItem: '恐已無法尋回。', pregnancy: '暫時放下，調養身體。' }
  },
  {
    number: 53, fortune: '中', title: '失意番成得意時',
    poem: ['失意番成得意時', '龍吟虎嘯兩相宜', '青雲有路終須到', '許我功名在後期'],
    interpretation: '失意之後轉為得意，青雲路終須一到，大器晚成。',
    advice: { marriage: '先苦後甜，好事在後。', career: '困境轉好，功名在後。', health: '康復在望，耐心等候。', wealth: '先虧後賺，耐心等候。', travel: '延後出行反而更好。', lawsuit: '後來居上，終可勝出。', lostItem: '日後有望尋回。', pregnancy: '稍後會有好消息。' }
  },
  {
    number: 54, fortune: '中', title: '夢中得寶醒來無',
    poem: ['夢中得寶醒來無', '自去經營也當初', '猛然覺悟來時路', '吃得苦中苦後甜'],
    interpretation: '空想無益需腳踏實地，吃得苦中苦方為人上人。',
    advice: { marriage: '腳踏實地經營感情。', career: '空想無益，實際行動。', health: '落實健康計畫，不只嘴上說。', wealth: '實幹才能致富，勿空想。', travel: '實際規劃，勿空想。', lawsuit: '準備充分，腳踏實地。', lostItem: '認真找尋，不要只想。', pregnancy: '實際調養，勿只靠想。' }
  },
  {
    number: 55, fortune: '中', title: '有心求財莫太忙',
    poem: ['有心求財莫太忙', '陸地行船枉費張', '只待秋來冬又至', '莫嫌枝上果難嚐'],
    interpretation: '求財不可急躁，如同陸地行船徒勞無功，需待時節成熟。',
    advice: { marriage: '不可急躁，慢慢培養感情。', career: '循序漸進，不可躁進。', health: '慢慢調養，急不得。', wealth: '秋冬季節財運較佳。', travel: '不急於出行，待時而動。', lawsuit: '慢慢來，急不得。', lostItem: '慢慢找，不要急。', pregnancy: '放鬆心情，時候到了自然來。' }
  },
  {
    number: 56, fortune: '中', title: '過河須用筏和船',
    poem: ['過河須用筏和船', '有路何曾不許行', '莫信旁人多閒語', '自家心正自然明'],
    interpretation: '做事需有工具與方法，走自己的路，勿聽閒言閒語。',
    advice: { marriage: '堅定信心，勿被閒言影響。', career: '方法正確就大膽前行。', health: '正規治療，勿聽偏方。', wealth: '用對方法，財路自通。', travel: '做好準備即可出行。', lawsuit: '心正理直，勿怕流言。', lostItem: '用對方法，可望找到。', pregnancy: '正規檢查調養，勿信偏方。' }
  },
  {
    number: 57, fortune: '下', title: '莫聽閒言與是非',
    poem: ['莫聽閒言與是非', '靜坐修心煉性機', '也是前生曾註定', '豈是凡人可預知'],
    interpretation: '是非纏身，宜靜心修養，一切自有天意安排。',
    advice: { marriage: '是非多，宜冷靜處理。', career: '勿捲入辦公室是非。', health: '靜心修養，勿因是非氣壞身體。', wealth: '勿因是非損失錢財。', travel: '暫避是非，出行可考慮。', lawsuit: '是非纏身，宜靜待。', lostItem: '與是非有關，暫且放下。', pregnancy: '心情平靜，勿受是非影響。' }
  },
  {
    number: 58, fortune: '下', title: '直待高山水倒流',
    poem: ['直待高山水倒流', '俊鳥出在鐵籠中', '極目長天舒望眼', '非到時候不自由'],
    interpretation: '目前如籠中鳥，不得自由，非到時候無法解脫。',
    advice: { marriage: '目前受限，暫難如願。', career: '被束縛住，等待突破。', health: '病情反覆，需長期治療。', wealth: '資金被套，暫難解套。', travel: '行動受限，暫不宜行。', lawsuit: '被動受限，暫難翻身。', lostItem: '被困某處，暫難取回。', pregnancy: '受限於身體狀況，需耐心。' }
  },
  {
    number: 59, fortune: '中', title: '有心事業莫閒拋',
    poem: ['有心事業莫閒拋', '頭上天公日正高', '但得良辰逢吉日', '何須着急自心焦'],
    interpretation: '事業有成的機會就在眼前，等待良辰吉日，不必焦急。',
    advice: { marriage: '時辰將到，不必焦急。', career: '機會在前，準備好迎接。', health: '按時就醫，不必焦慮。', wealth: '良辰一到，財運自開。', travel: '選好日子出行即可。', lawsuit: '選好時機，有利應訴。', lostItem: '選對時間地點，可望找到。', pregnancy: '時機將至，耐心等候。' }
  },
  {
    number: 60, fortune: '下', title: '抽得此籤莫驚慌',
    poem: ['抽得此籤莫驚慌', '營謀用事仔細詳', '前途若有荊棘阻', '且向心田種善良'],
    interpretation: '雖抽下籤勿慌，前路有阻但多行善即可逢凶化吉。',
    advice: { marriage: '多行善事，姻緣自來。', career: '前途有阻，行善化解。', health: '不必驚慌，積極面對。', wealth: '暫時不順，行善積德。', travel: '出行有阻，需做好準備。', lawsuit: '多做善事，化解災厄。', lostItem: '行善積德，或有轉機。', pregnancy: '多行善事，祈求菩薩庇佑。' }
  },
  {
    number: 61, fortune: '上', title: '日上吟詩月下歌',
    poem: ['日上吟詩月下歌', '逢場作戲笑呵呵', '相逢會遇難藏避', '莫把心機枉自磨'],
    interpretation: '一切自然而然，隨遇而安，勿費心機反而自在。',
    advice: { marriage: '自然相遇，天作之合。', career: '隨遇而安，好事自來。', health: '放鬆心情，身體自安。', wealth: '不費心機，財運自來。', travel: '隨興出行，處處驚喜。', lawsuit: '順其自然，不必過慮。', lostItem: '不經意間就會找到。', pregnancy: '放鬆心情，好孕自來。' }
  },
  {
    number: 62, fortune: '中', title: '晨昏全賴佛扶持',
    poem: ['晨昏全賴佛扶持', '須是逢危卻不危', '若得貴人來接引', '前途自有好風吹'],
    interpretation: '有神佛庇佑遇危不危，貴人出現則前途順遂。',
    advice: { marriage: '有貴人介紹，可成良緣。', career: '貴人相助，遇難呈祥。', health: '菩薩庇佑，逢凶化吉。', wealth: '貴人帶財，運勢好轉。', travel: '出行有貴人護佑。', lawsuit: '貴人相助，化險為夷。', lostItem: '有人幫忙，可望尋回。', pregnancy: '虔誠祈求，菩薩保佑。' }
  },
  {
    number: 63, fortune: '中', title: '萬人叢裡逞英雄',
    poem: ['萬人叢裡逞英雄', '猶恐前途有伏攻', '棋中有劫須提防', '步步為營保成功'],
    interpretation: '雖有英雄之志，但前途暗藏危機，需步步為營。',
    advice: { marriage: '表面順利，暗藏隱患。', career: '成功在望但需防暗箭。', health: '外表健康，需防隱疾。', wealth: '獲利同時需防風險。', travel: '出行防備，步步小心。', lawsuit: '勝算有但需防暗招。', lostItem: '有線索但需小心追蹤。', pregnancy: '順利中需注意細節。' }
  },
  {
    number: 64, fortune: '下', title: '遊魚卻在碧波池',
    poem: ['遊魚卻在碧波池', '撞入羅網四邊圍', '思量無路翻身轉', '只待大風吹水時'],
    interpretation: '如魚入網，四面受困，只能等待大風來破局。',
    advice: { marriage: '陷入困局，暫難脫身。', career: '被困住了，需等外力解救。', health: '病情棘手，需尋求專家。', wealth: '資金困住，暫難周轉。', travel: '行動受阻，暫不宜行。', lawsuit: '困境重重，需等轉機。', lostItem: '被困某處，難以取回。', pregnancy: '困難重重，需專業協助。' }
  },
  {
    number: 65, fortune: '中', title: '眼前歡喜未為歡',
    poem: ['眼前歡喜未為歡', '始覺諸般不可難', '若得恆心堅守待', '枯木回春花再開'],
    interpretation: '眼前小喜不足為恃，堅持等待方能枯木逢春。',
    advice: { marriage: '初見好感，仍需長期觀察。', career: '小成不足喜，堅持才有大成。', health: '初步好轉，仍需持續治療。', wealth: '小賺不足喜，穩健才是正道。', travel: '短途小遊可，大計畫需緩。', lawsuit: '初步有利，仍需堅持。', lostItem: '有些線索，仍需耐心。', pregnancy: '初步好消息，仍需持續。' }
  },
  {
    number: 66, fortune: '中', title: '一輪明月正當空',
    poem: ['一輪明月正當空', '雲散光輝到處通', '忽有清風雲霧散', '那時寶貝自然逢'],
    interpretation: '雲散月明之時，一切迷霧消散，寶物自然呈現。',
    advice: { marriage: '真相大白，良緣自現。', career: '迷霧散去，方向清晰。', health: '病因查明，對症下藥。', wealth: '時機到時，財運自然來。', travel: '天氣轉好，出行順利。', lawsuit: '真相明朗，有利判決。', lostItem: '迷霧散去，失物可見。', pregnancy: '撥雲見日，好消息將至。' }
  },
  {
    number: 67, fortune: '上', title: '一條金線秤心高',
    poem: ['一條金線秤心高', '無偏無倚利名交', '良辰美景逢春到', '又有何愁不發燒'],
    interpretation: '公正無偏，名利雙收，良辰美景春意盎然。',
    advice: { marriage: '公平相待，婚姻美滿。', career: '正直經營，名利雙收。', health: '身心平衡，健康長壽。', wealth: '正當經營，財運亨通。', travel: '春暖出行，大吉大利。', lawsuit: '公正裁判，正義得彰。', lostItem: '公道自在，失物可回。', pregnancy: '一切均衡，順利可期。' }
  },
  {
    number: 68, fortune: '中', title: '南北東西盡皆通',
    poem: ['南北東西盡皆通', '出門處處遇春風', '萬事皆吉無阻隔', '正是天公作美中'],
    interpretation: '四方暢通，處處逢春，萬事皆吉。',
    advice: { marriage: '四處皆有良緣。', career: '各方面都順利。', health: '身體各方面都好。', wealth: '各路財源皆通。', travel: '四方皆宜，出行大吉。', lawsuit: '各方面都有利。', lostItem: '四處尋找，可望找到。', pregnancy: '一切順利，可得如願。' }
  },
  {
    number: 69, fortune: '下', title: '冬來嶺上一枝梅',
    poem: ['冬來嶺上一枝梅', '葉落枝枯終不摧', '但得陽回春色到', '自然遍地百花開'],
    interpretation: '如寒梅傲雪，雖處逆境但堅持不懈，春來必百花齊放。',
    advice: { marriage: '目前寒冷期，需耐心等候春天。', career: '逆境中堅持，等待轉機。', health: '身體較弱，需好好保養過冬。', wealth: '目前蕭條，春天會好轉。', travel: '冬季不宜遠行。', lawsuit: '逆境中堅持，終有轉機。', lostItem: '目前難尋，來年有望。', pregnancy: '冬去春來，好消息會到。' }
  },
  {
    number: 70, fortune: '中', title: '手持金鏡照開先',
    poem: ['手持金鏡照開先', '跋涉途中苦又甜', '一旦雲開天朗日', '便是揚名天下仙'],
    interpretation: '持明鏡照前路，雖苦甜參半，但雲開之日便名揚天下。',
    advice: { marriage: '看清對方真面目，苦盡甘來。', career: '認清方向，苦盡終有甜。', health: '找對方法，治療有效。', wealth: '看準方向投資，終有回報。', travel: '辛苦旅途但收穫豐富。', lawsuit: '看清局勢，終能勝出。', lostItem: '仔細觀察，可望找到。', pregnancy: '辛苦調養，終有好結果。' }
  },
  {
    number: 71, fortune: '下', title: '半輪殘月暗昏時',
    poem: ['半輪殘月暗昏時', '心事重重有幾知', '世上幾多陰險事', '恐防暗箭暗中施'],
    interpretation: '月暗星沉之時，需防小人暗箭，心事重重難解。',
    advice: { marriage: '防第三者介入。', career: '防暗箭，小心小人。', health: '暗疾需防，定期檢查。', wealth: '防被騙，勿輕信他人。', travel: '夜間出行不利。', lawsuit: '防對方暗招。', lostItem: '恐被人暗中取走。', pregnancy: '多加防範，注意保養。' }
  },
  {
    number: 72, fortune: '中', title: '養蜂須用蜜成甜',
    poem: ['養蜂須用蜜成甜', '做事終須步步圓', '若能頃刻回頭轉', '何愁不是有因緣'],
    interpretation: '做事需循序漸進面面俱到，若能及時回頭便是良緣。',
    advice: { marriage: '用心經營，感情自甜。', career: '步步為營，做事周全。', health: '全面調養，循序漸進。', wealth: '細水長流，穩健獲利。', travel: '規劃周全再出行。', lawsuit: '面面俱到，可望勝出。', lostItem: '循線追查，步步為營。', pregnancy: '全面調養，好事將成。' }
  },
  {
    number: 73, fortune: '下', title: '有船無楫且休撐',
    poem: ['有船無楫且休撐', '善惡前途仔細分', '只等風平浪靜後', '安然順利過前津'],
    interpretation: '船無槳不可強行，等風平浪靜再行動方為上策。',
    advice: { marriage: '條件不具備，暫緩。', career: '準備不足，暫勿行動。', health: '暫勿冒險治療，等條件成熟。', wealth: '資源不足，暫勿投資。', travel: '準備不全，延後出行。', lawsuit: '準備不足，暫緩訴訟。', lostItem: '暫無線索，等待時機。', pregnancy: '身體尚未調養好，先等等。' }
  },
  {
    number: 74, fortune: '上', title: '從前作事總徒勞',
    poem: ['從前作事總徒勞', '恰似遊魚卻有遭', '到底終須有日出', '光明前路任君超'],
    interpretation: '過去的辛苦不會白費，終有日出之時，前路光明任你馳騁。',
    advice: { marriage: '過去的努力不白費，良緣將至。', career: '苦盡甘來，光明在前。', health: '長期治療終見成效。', wealth: '過去投資終有回報。', travel: '出行順利，前途光明。', lawsuit: '堅持終有勝出之日。', lostItem: '長期尋找，終可復得。', pregnancy: '長期調養，終有好消息。' }
  },
  {
    number: 75, fortune: '中', title: '恰如抱虎過高山',
    poem: ['恰如抱虎過高山', '戰戰兢兢膽裡寒', '須是過關方可喜', '事到頭來應不難'],
    interpretation: '雖然過程驚險萬分，但過了這關便無大礙。',
    advice: { marriage: '過了考驗期，就能穩定。', career: '關鍵時刻撐過去就好。', health: '度過危險期，即可康復。', wealth: '風險期過後，財運回穩。', travel: '途中驚險但終能平安。', lawsuit: '關鍵時刻撐過即勝。', lostItem: '經過一番波折可尋回。', pregnancy: '過了關鍵期，一切平安。' }
  },
  {
    number: 76, fortune: '中', title: '魚龍混雜在其中',
    poem: ['魚龍混雜在其中', '仔細分明辨真容', '須教百煉千錘後', '方始成功在眼中'],
    interpretation: '真偽混雜需仔細分辨，千錘百煉方能成功。',
    advice: { marriage: '真心假意需分辨清楚。', career: '識人辨才，方能用對人。', health: '辨別真假資訊，找對醫生。', wealth: '分辨真假投資機會。', travel: '辨別真假資訊再行動。', lawsuit: '分辨真偽證據。', lostItem: '仔細辨認，去偽存真。', pregnancy: '辨別正確資訊，科學調養。' }
  },
  {
    number: 77, fortune: '中', title: '捷報傳來事可期',
    poem: ['捷報傳來事可期', '名成利就在今時', '不須疑慮前程事', '只管安心待好期'],
    interpretation: '好消息即將到來，名利可期，安心等候即可。',
    advice: { marriage: '好消息將至，安心等候。', career: '捷報頻傳，成就可期。', health: '好消息，病情好轉。', wealth: '財運將至，安心等候。', travel: '出行順利，好消息在前。', lawsuit: '勝訴在望。', lostItem: '好消息，即將尋回。', pregnancy: '喜訊將至，安心等候。' }
  },
  {
    number: 78, fortune: '上', title: '急水灘頭慢放船',
    poem: ['急水灘頭慢放船', '心中守分靜安然', '只宜穩重行方便', '切莫輕浮失太先'],
    interpretation: '越是急流越要穩，沉穩行事方能順利渡過。',
    advice: { marriage: '穩重相待，感情長久。', career: '沉穩處事，步步為營。', health: '穩定作息，健康自來。', wealth: '穩健投資，安穩獲利。', travel: '穩重出行，安全第一。', lawsuit: '穩紮穩打，必能勝出。', lostItem: '穩步尋找，終可復得。', pregnancy: '穩定心情，安心等候。' }
  },
  {
    number: 79, fortune: '下', title: '虛空結願未曾還',
    poem: ['虛空結願未曾還', '保得安寧兩不難', '莫向門庭求活計', '善心修積福源寬'],
    interpretation: '許下的願尚未還，宜行善積德拓寬福源。',
    advice: { marriage: '先還願再求新緣。', career: '先完成承諾再求新。', health: '注意未了之事對身心的影響。', wealth: '先還舊債再求新財。', travel: '先了結事務再出行。', lawsuit: '先處理未了之事。', lostItem: '先還願，或有轉機。', pregnancy: '先許願行善，再求子。' }
  },
  {
    number: 80, fortune: '中', title: '直上重樓去藏身',
    poem: ['直上重樓去藏身', '四圍荊棘繞為鄰', '須知亂後能成治', '不覺暗中有鬼神'],
    interpretation: '暫避鋒芒以待時機，混亂之後自能恢復秩序。',
    advice: { marriage: '暫時退讓，日後再說。', career: '暫避風頭，伺機而動。', health: '避免過度操勞，安心靜養。', wealth: '暫時守穩，避開風險。', travel: '暫且不動，避開是非。', lawsuit: '暫避鋒芒，日後再戰。', lostItem: '暫時隱藏，日後出現。', pregnancy: '暫且安養，耐心等候。' }
  },
  {
    number: 81, fortune: '上', title: '梧桐葉落秋將暮',
    poem: ['梧桐葉落秋將暮', '守得寒冬待春來', '好向明年新氣象', '一枝紅杏出牆開'],
    interpretation: '秋去冬來春不遠，耐心等候新氣象，春暖花開。',
    advice: { marriage: '冬去春來，新緣將至。', career: '新年新氣象，事業更上層樓。', health: '冬季好好調養，春天煥然一新。', wealth: '來年財運大開。', travel: '春天出行最佳。', lawsuit: '新年有新轉機。', lostItem: '來年有望尋回。', pregnancy: '春天可期好消息。' }
  },
  {
    number: 82, fortune: '下', title: '炎炎烈日放光輝',
    poem: ['炎炎烈日放光輝', '守己安分莫亂為', '如今眼前閒是非', '低頭忍耐過年時'],
    interpretation: '烈日炎炎之際宜安分守己，忍耐是非便可過關。',
    advice: { marriage: '忍耐是非，莫意氣用事。', career: '低調行事，勿出風頭。', health: '注意火氣，清心靜養。', wealth: '安分守己，勿投機取巧。', travel: '暫勿出行，安分待在原處。', lawsuit: '低頭忍耐，避免衝突。', lostItem: '安分等待，或有轉機。', pregnancy: '安分靜養，勿過操勞。' }
  },
  {
    number: 83, fortune: '上', title: '心中有事費商量',
    poem: ['心中有事費商量', '倒不如靜坐思量好', '一朝逢貴得提攜', '那時名利自然到'],
    interpretation: '心中煩事不如靜思，待貴人出現便名利雙收。',
    advice: { marriage: '靜待貴人介紹良緣。', career: '遇貴人提攜，前途光明。', health: '找對好醫生，藥到病除。', wealth: '貴人帶來財運。', travel: '遇貴人同行，旅途順利。', lawsuit: '貴人相助，官司有利。', lostItem: '有貴人幫忙找到。', pregnancy: '遇良醫指導，好事將成。' }
  },
  {
    number: 84, fortune: '下', title: '因誦善經消罪愆',
    poem: ['因誦善經消罪愆', '猶如朗月正當天', '時來殷殷相勸化', '是非場中莫浪言'],
    interpretation: '多誦善經消災解厄，是非場中慎言為上。',
    advice: { marriage: '言多必失，慎言慎行。', career: '少說多做，遠離是非。', health: '靜心修養，口業宜清。', wealth: '勿因口舌損失錢財。', travel: '出行少言，避免爭端。', lawsuit: '慎言避禍，少說為妙。', lostItem: '問東問西反而不利。', pregnancy: '靜心養胎，勿多言。' }
  },
  {
    number: 85, fortune: '上', title: '雲開月出照天下',
    poem: ['雲開月出照天下', '忽有清風撲面來', '不須着力自然到', '何用遲疑費安排'],
    interpretation: '雲開月出一切明朗，好事自然來到，不必費力安排。',
    advice: { marriage: '良緣自來，不必刻意。', career: '水到渠成，事業自成。', health: '身體自然好轉。', wealth: '財運自然亨通。', travel: '隨意出行，處處順利。', lawsuit: '案情自然明朗。', lostItem: '自然會出現。', pregnancy: '不必費心，好孕自來。' }
  },
  {
    number: 86, fortune: '中', title: '春來花發映陽台',
    poem: ['春來花發映陽台', '此際好音從天來', '若得明珠帶在手', '何愁不入玉門開'],
    interpretation: '春暖花開好消息從天而降，得到關鍵之物則一切順遂。',
    advice: { marriage: '好消息從天而降。', career: '得到關鍵資源，事業大開。', health: '找到對的方法，健康恢復。', wealth: '得到好消息，財運大開。', travel: '出行有好消息。', lawsuit: '得到關鍵證據，大為有利。', lostItem: '好消息，失物有著落。', pregnancy: '好消息即將到來。' }
  },
  {
    number: 87, fortune: '中', title: '人生天命早安排',
    poem: ['人生天命早安排', '人算不如天算來', '何必營營苦用意', '隨緣度日更為佳'],
    interpretation: '天命自有安排，人算不如天算，隨緣度日最為自在。',
    advice: { marriage: '隨緣即可，天自安排。', career: '順天應人，不必強求。', health: '隨遇而安，保持樂觀。', wealth: '知足常樂，隨緣致富。', travel: '隨興出行，自在即好。', lawsuit: '順其自然，天意自明。', lostItem: '隨緣即可，不必執著。', pregnancy: '天命安排，隨緣即可。' }
  },
  {
    number: 88, fortune: '下', title: '面前禾穀已先收',
    poem: ['面前禾穀已先收', '只恐中間有暗愁', '切忌是非休要管', '長江風浪盡回舟'],
    interpretation: '表面豐收但暗藏憂患，需遠離是非及早收手。',
    advice: { marriage: '表面和諧，暗藏問題。', career: '見好就收，勿貪多。', health: '外表健康，需防隱疾。', wealth: '適時獲利了結，勿貪。', travel: '及早回程，勿久留。', lawsuit: '及早了結，勿再糾纏。', lostItem: '及早尋找，遲則不利。', pregnancy: '注意隱患，定期檢查。' }
  },
  {
    number: 89, fortune: '上', title: '出入營謀大吉昌',
    poem: ['出入營謀大吉昌', '路途平穩任遊揚', '有人來報門庭喜', '萬事如意保安康'],
    interpretation: '出入營謀大吉大利，路途平穩，喜事臨門萬事如意。',
    advice: { marriage: '大吉大利，喜事臨門。', career: '萬事如意，事業昌盛。', health: '身體安康，萬事無憂。', wealth: '財運大吉，收入豐厚。', travel: '出入平安，一路順風。', lawsuit: '大吉大利，必勝無疑。', lostItem: '必可尋回。', pregnancy: '大喜之兆，母子平安。' }
  },
  {
    number: 90, fortune: '上', title: '忽言一信向天飛',
    poem: ['忽言一信向天飛', '泰山寶蓋入雲衢', '雖是眼前有險阻', '過了前川事盡宜'],
    interpretation: '好消息從天而來，雖眼前有小阻，過了便一切順利。',
    advice: { marriage: '好消息在路上，稍安勿躁。', career: '突破眼前障礙，即見光明。', health: '過了這關，便可康復。', wealth: '小阻之後，財運大開。', travel: '小心前段路，之後一帆風順。', lawsuit: '過了眼前難關，便可勝出。', lostItem: '突然有消息，可望尋回。', pregnancy: '過了難關，好消息即至。' }
  },
  {
    number: 91, fortune: '中', title: '一盞明燈四處通',
    poem: ['一盞明燈四處通', '正逢帆穩好行蹤', '只須安守莫輕動', '待到春風百事通'],
    interpretation: '明燈指路，航行穩定，但仍需安守不可輕動。',
    advice: { marriage: '穩定中求進步。', career: '方向正確，穩步前行。', health: '狀況穩定，繼續調養。', wealth: '穩健理財，不宜冒進。', travel: '出行平穩，但勿冒險。', lawsuit: '穩紮穩打，勿輕舉妄動。', lostItem: '有線索，耐心追蹤。', pregnancy: '穩定中等待好消息。' }
  },
  {
    number: 92, fortune: '下', title: '仔細更當須用心',
    poem: ['仔細更當須用心', '人無遠慮有近憂', '若能勤勉多修善', '何怕前途路不通'],
    interpretation: '人無遠慮必有近憂，需加倍用心且多行善。',
    advice: { marriage: '用心經營，勿掉以輕心。', career: '居安思危，未雨綢繆。', health: '防患未然，注意保健。', wealth: '謹慎理財，防範風險。', travel: '出行前做足準備。', lawsuit: '用心準備，不可大意。', lostItem: '仔細用心找，或可復得。', pregnancy: '用心調養，行善積德。' }
  },
  {
    number: 93, fortune: '中', title: '雞棲鳳巢不自由',
    poem: ['雞棲鳳巢不自由', '須待金雞報曉秋', '若問前程歸宿處', '從今好事在後頭'],
    interpretation: '目前環境不太適合，但好事在後頭，耐心等候。',
    advice: { marriage: '目前環境不理想，日後會改善。', career: '暫時委屈，好事在後。', health: '暫時不適，日後好轉。', wealth: '目前不順，秋後有望。', travel: '暫不宜行，秋後再說。', lawsuit: '暫時不利，日後轉好。', lostItem: '目前找不到，日後有望。', pregnancy: '時機在後，耐心等候。' }
  },
  {
    number: 94, fortune: '中', title: '小人君子共當權',
    poem: ['小人君子共當權', '須辨忠言與佞言', '心中明白是非路', '莫被浮雲蔽目前'],
    interpretation: '忠奸並存需明辨是非，勿被浮雲遮蔽眼前判斷。',
    advice: { marriage: '明辨真心假意。', career: '分辨忠奸，謹慎交友。', health: '辨別真假資訊。', wealth: '分辨投資真偽。', travel: '辨別可信資訊再行動。', lawsuit: '明辨忠奸，蒐集證據。', lostItem: '分辨真假線索。', pregnancy: '聽取正確醫療建議。' }
  },
  {
    number: 95, fortune: '中', title: '事到頭來總是虛',
    poem: ['事到頭來總是虛', '何須固執苦追思', '放開懷抱隨天意', '自有佳期不再遲'],
    interpretation: '執著到頭終是空，放開胸懷順天意，佳期自到。',
    advice: { marriage: '放下執著，緣分自來。', career: '放開格局，機會更多。', health: '放鬆心情，健康自來。', wealth: '放下貪念，財運自通。', travel: '放開心胸，隨遇而安。', lawsuit: '放下執著，和解為上。', lostItem: '放下執著，或有轉機。', pregnancy: '放鬆心態，順其自然。' }
  },
  {
    number: 96, fortune: '上', title: '門前春色正融融',
    poem: ['門前春色正融融', '財帛漸來喜氣濃', '萬事且隨心所願', '自然秋後果然豐'],
    interpretation: '門前春色融融，財喜漸來，萬事隨心，秋後豐收。',
    advice: { marriage: '春暖花開，喜事連連。', career: '萬事如意，心想事成。', health: '春風得意，身體康健。', wealth: '財帛漸來，喜氣洋洋。', travel: '春遊大吉，處處春風。', lawsuit: '形勢大好。', lostItem: '很快即可尋回。', pregnancy: '心想事成，喜得貴子。' }
  },
  {
    number: 97, fortune: '中', title: '當風點燭空疏影',
    poem: ['當風點燭空疏影', '恍惚不明半是迷', '急要等待天開眼', '一朝風雨便光輝'],
    interpretation: '如風中燭火搖曳不明，但等天開眼便光輝重現。',
    advice: { marriage: '目前迷惘，待時間釐清。', career: '方向不明，等待指引。', health: '病因未明，需進一步檢查。', wealth: '形勢不明，暫勿投資。', travel: '時機不明，暫緩出行。', lawsuit: '案情不明，等待轉機。', lostItem: '線索不明，耐心等候。', pregnancy: '情況不明，持續觀察。' }
  },
  {
    number: 98, fortune: '下', title: '出入求謀事不宜',
    poem: ['出入求謀事不宜', '當前暗路恐迷離', '看透浮雲多險惡', '寧可靜守待天時'],
    interpretation: '出入求謀皆不宜，前路暗淡迷離，宜靜守待天時。',
    advice: { marriage: '暫不適宜談婚論嫁。', career: '不宜跳槽或創業。', health: '需格外注意身體。', wealth: '不宜投資或求財。', travel: '不宜出行。', lawsuit: '不宜訴訟。', lostItem: '恐難尋回，靜待。', pregnancy: '時機不宜，靜養為上。' }
  },
  {
    number: 99, fortune: '下', title: '守舊安分莫妄求',
    poem: ['守舊安分莫妄求', '安穩之中自有謀', '若問前程何日好', '冬盡春來便可遊'],
    interpretation: '安分守己勿妄求，冬去春來便是好時光。',
    advice: { marriage: '安分等待，春天有緣。', career: '安守本分，勿躁進。', health: '安穩調養，冬去春來。', wealth: '安分守財，勿冒險。', travel: '冬盡春來時出行為佳。', lawsuit: '安分守己，靜待轉機。', lostItem: '安心等候，春來有望。', pregnancy: '安分調養，春天可期。' }
  },
  {
    number: 100, fortune: '上上', title: '三寶之中第一尊',
    poem: ['三寶之中第一尊', '回頭好比上天門', '大吉大利占此籤', '百事亨通萬事成'],
    interpretation: '此籤大吉大利，百事亨通，萬事皆成，為上上之籤。',
    advice: { marriage: '天作之合，百年好合。', career: '百事亨通，功成名就。', health: '身體康泰，長命百歲。', wealth: '財源廣進，萬事如意。', travel: '出入平安，大吉大利。', lawsuit: '必勝無疑。', lostItem: '必可尋回。', pregnancy: '大吉大利，心想事成。' }
  }
];

function getLot(number) {
  return LOTS.find(l => l.number === number) || LOTS[0];
}

function getRandomLotNumber() {
  return Math.floor(Math.random() * 100) + 1;
}
