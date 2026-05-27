const SUBJECT_META = window.CSQ_META;
const QUESTION_BANK = window.CSQ_QUESTION_BANK;
const LABEL = window.CSQ_DIFFICULTY_LABEL;

const state = {
  playerName: "新手冒險者",
  hp: 100,
  exp: 0,
  level: 1,
  subject: null,
  currentPage: "homePage",
  activeSession: null,
  difficulty: "easy",
  monsterHp: 120,
  monsterMaxHp: 120,
  currentQuestion: null,
  usedIds: new Set(),
  stageQuestionSigs: new Set(),
  correct: 0,
  wrong: 0,
  total: 0,
  roundCount: 0,
  bossCount: 0,
  bossMode: false,
  hiddenBossMode: false,
  hiddenBossIndex: 0,
  hiddenBossResult: "",
  hiddenBossClearCount: 0,
  hiddenBossFirstClear: false,
  hiddenBossLastScore: null,
  bossFinisherPlaying: false,
  correctStreak: 0,
  wrongStreak: 0,
  totalExpEarned: 0,
  answered: false,
  battleLog: [],
  wrongBook: [],
  wrongTypeStats: {},
  wrongBookMode: false,
  daily3Mode: false,
  daily3SubjectHistory: [],
  daily3Stats: { lastDate:"", streak:0, clears:0, rewardedDate:"", lastSummary:null },
  dailyMail: { lastClaimDate:"", streak:0, lastRewardText:"", lastMessage:"" },
  wrongBookFixStreak: 0,
  wrongBookFixedTotal: 0,
  wrongBookModeSubject: null,
  wrongBookModeTypeKey: null,
  weakPracticeMode: false,
  weakPracticeTypeKey: null,
  aiPracticeQuestion: null,
  lastWrongRecord: null,
  chests: 0,
  healPotion: 0,
  expPotion: 0,
  inventoryLog: [],
  questStats: { answered: 0, correct: 0, wrong: 0, boss: 0, chinese: 0, english: 0, math: 0, nature: 0, society: 0, feed: 0, pet: 0, tenpull: 0 },
  claimedQuests: [],
  gameMode: "chapter",
  stageCleared: false,
  rogueBuffs: {},
  roguePending: false,
  rogueNextAction: "next",
  correctSinceBuff: 0,
  fragments: 0,
  gachaPity: { epic: 0, ssr: 0 },
  achievements: {},
  titles: ["rookie"],
  equippedTitle: "rookie",
  eventPending: false,
  eventCounter: 0,
  counterMode: false,
  mapPending: false,
  mapCooldownRound: -1,
  mapNodes: [],
  dungeonFloor: 1,
  dungeonMap: null,
  currentRoomId: null,
  pendingRoomId: null,
  lastMapNote: "",
  nextQuestionMode: null,
  items: { removeWrong: 0, hintCard: 0, shieldCard: 0, feverBattery: 0, bonusGuard: 0, expBoost: 0, hardTicket: 0 },
  activeShield: false,
  activeBonusGuard: false,
  activeExpBoost: false,
  catShards: {},
  catSkillLevels: {},
  bonusCombo: 0,
  feverGauge: 0,
  feverActive: false,
  feverTurns: 0,
  cat: { name: "Pixel", level: 1, love: 0, energy: 50, fish: 0, unlockedSkins: ["orange_tabby"], equippedSkin: "orange_tabby" }
};

const correctLines = [
  "破解成功。資料同步完成，這題沒有漏洞。",
  "漂亮，這一擊很乾淨。EXP 已入帳。",
  "答對了。怪物防火牆裂開一層，繼續推進。"
];

const SKIN_META = {
  orange_tabby: { name: "橘虎初始型", rarity: "COMMON", src: "./assets/skins/orange_tabby.png", effect: { type: "generalExp", value: 0.03 }, effectText: "全科答對 EXP +3%" },
  tuxedo_basic: { name: "燕尾黑白型", rarity: "COMMON", src: "./assets/skins/tuxedo_basic.png", effect: { type: "subjectExp", subject: "英文", value: 0.08 }, effectText: "英文答對 EXP +8%" },
  siamese_basic: { name: "暹羅奶咖型", rarity: "COMMON", src: "./assets/skins/siamese_basic.png", effect: { type: "potionExp", value: 0.10 }, effectText: "升級藥水 EXP +10%" },
  gray_tabby: { name: "灰紋巡航型", rarity: "COMMON", src: "./assets/skins/gray_tabby.png", effect: { type: "subjectExp", subject: "數學", value: 0.08 }, effectText: "數學答對 EXP +8%" },
  white_basic: { name: "雪白軟糖型", rarity: "COMMON", src: "./assets/skins/white_basic.png", effect: { type: "healBoost", value: 0.10 }, effectText: "回復藥水效果 +10%" },
  black_basic: { name: "黑曜夜行型", rarity: "COMMON", src: "./assets/skins/black_basic.png", effect: { type: "bossExp", value: 0.08 }, effectText: "Boss 題答對 EXP +8%" },
  ninja_orange: { name: "武士橘喵型", rarity: "UNCOMMON", src: "./assets/skins/ninja_orange.png", effect: { type: "subjectExp", subject: "國文", value: 0.18 }, effectText: "國文答對 EXP +18%" },
  cozy_siamese: { name: "暖心毛衣型", rarity: "UNCOMMON", src: "./assets/skins/cozy_siamese.png", effect: { type: "catLove", value: 2 }, effectText: "答對時 Pixel 親密度額外 +2" },
  detective_gray: { name: "偵探灰影型", rarity: "RARE", src: "./assets/skins/detective_gray.png", effect: { type: "subjectExp", subject: "社會", value: 0.20 }, effectText: "社會答對 EXP +20%" },
  astronaut_white: { name: "太空白喵型", rarity: "RARE", src: "./assets/skins/astronaut_white.png", effect: { type: "subjectExp", subject: "自然", value: 0.20 }, effectText: "自然答對 EXP +20%" },
  wizard_black: { name: "魔導黑喵型", rarity: "EPIC", src: "./assets/skins/wizard_black.png", effect: { type: "hardExp", value: 0.18 }, effectText: "困難題答對 EXP +18%" },
  cyber_tuxedo: { name: "賽博未來型", rarity: "EPIC", src: "./assets/skins/cyber_tuxedo.png", effect: { type: "allExpAndChest", value: 0.10 }, effectText: "全科答對 EXP +10%，Boss 擊破有機率額外寶箱" },
  ssr_moon_treasure: { name: "月夜寶藏豹貓", rarity: "SSR", src: "./assets/skins/ssr_moon_treasure.png", effect: { type: "allExpAndChest", value: 0.18 }, effectText: "全科答對 EXP +18%，Boss 擊破額外寶箱機率提升" },
  ssr_fortune_miko: { name: "櫻焰祈願三花", rarity: "SSR", src: "./assets/skins/ssr_fortune_miko.png", effect: { type: "subjectExp", subject: "國文", value: 0.35 }, effectText: "國文答對 EXP +35%，任務獎勵感應強化" },
  ssr_alchemy_queen: { name: "幻彩鍊金白貓", rarity: "SSR", src: "./assets/skins/ssr_alchemy_queen.png", effect: { type: "subjectExp", subject: "自然", value: 0.35 }, effectText: "自然答對 EXP +35%，藥水效果同步強化" }
};


const TITLE_META = {
  rookie: { name:"新手冒險者", effectText:"無特殊效果", effect:{} },
  textAssassin: { name:"文意刺客", effectText:"國文 EXP +5%", effect:{type:"subjectExp", subject:"國文", value:0.05} },
  mathModeler: { name:"數學建模師", effectText:"數學 EXP +5%", effect:{type:"subjectExp", subject:"數學", value:0.05} },
  sciencePilot: { name:"自然實驗王", effectText:"自然 EXP +5%", effect:{type:"subjectExp", subject:"自然", value:0.05} },
  societyReader: { name:"社會判讀者", effectText:"社會 EXP +5%", effect:{type:"subjectExp", subject:"社會", value:0.05} },
  englishHunter: { name:"英文語境獵人", effectText:"英文 EXP +5%", effect:{type:"subjectExp", subject:"英文", value:0.05} },
  catGuardian: { name:"貓貓守護者", effectText:"餵食親密度 +20%", effect:{type:"feedLove", value:0.2} },
  endlessSurvivor: { name:"無盡倖存者", effectText:"戰鬥開始 HP +10", effect:{type:"startHp", value:10} },
  ssrLucky: { name:"SSR 歐皇", effectText:"寶箱碎片獲得 +1", effect:{type:"fragmentBonus", value:1} },
  newtonWhisperer: { name:"Newton Gate 破譯者", effectText:"數學答對 EXP +8%，Boss 題 EXP +5%", effect:{type:"hybrid", effects:[{type:"subjectExp", subject:"數學", value:0.08},{type:"bossExp", value:0.05}]} }
};

const BOSS_PROFILES = {
  "國文": { icon:"🀄", name:"焚符判詞使", img:"./assets/bosses/chinese_boss.png", desc:"操控符咒、判詞與古文語境的怨靈術師，最擅長在字義、修辭與語氣裡埋陷阱。", hp:165, wrongPenalty:1.05, rewardFragments:4, skill:"判詞封印：答錯時 Bonus 額外歸零。" },
  "英文": { icon:"🪶", name:"緋羽夜鴉公", img:"./assets/bosses/english_boss.png", desc:"以詞彙、語境、時態與文意推論構成的夜鴉伯爵，會把線索藏在句子細節裡。", hp:160, wrongPenalty:1.0, rewardFragments:4, skill:"語境干擾：Boss 題 EXP 額外提高。" },
  "數學": { icon:"🔷", name:"幾何星律師", img:"./assets/bosses/math_boss.png", desc:"掌控幾何、代數與推理結構的星界術士，多步驟運算與圖形概念都在牠的領域內。", hp:180, wrongPenalty:1.15, rewardFragments:5, skill:"重擊：答錯扣血較高，但答對獎勵也較高。" },
  "自然": { icon:"🧪", name:"污染實驗王", img:"./assets/bosses/nature_boss.png", desc:"把實驗、原子、藥劑與污染變因揉成一體的瘋狂科學家，專門用觀念混淆來反擊。", hp:170, wrongPenalty:1.08, rewardFragments:5, skill:"變因污染：答錯時 Fever 減少更多。" },
  "社會": { icon:"🌍", name:"帝圖審判者", img:"./assets/bosses/society_boss.png", desc:"以歷史、地理、公民制度與世界局勢構成的帝王審判者，擅長地圖、制度與史料判讀。", hp:170, wrongPenalty:1.05, rewardFragments:5, skill:"制度壓力：Boss 擊破給更多碎片。" }
};


const HIDDEN_CALCULUS_QUESTIONS = [
  {
    id:"HCB-001",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜拉普拉斯反轉",
    question:"求 $\\mathcal{L}^{-1}\\left\\{\\dfrac{s+3}{(s+1)^2+4}\\right\\}$。",
    choices:["$e^{-t}(\\cos 2t+\\sin 2t)$","$e^{-t}(\\cos 2t+2\\sin 2t)$","$e^{-t}(\\cos t+\\sin 2t)$","$e^{-2t}(\\cos 2t+\\sin 2t)$"],
    answer:"$e^{-t}(\\cos 2t+\\sin 2t)$",
    explanation:"將 $s+3=(s+1)+2$，故反轉為 $e^{-t}\\cos 2t+e^{-t}\\sin 2t$。"
  },
  {
    id:"HCB-002",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜Green 定理",
    question:"令 $C$ 為單位圓正向邊界，計算 $\\displaystyle \\oint_C (x^2-y)\\,dx+(x+y^2)\\,dy$。",
    choices:["$2\\pi$","$\\pi$","$-2\\pi$","$0$"],
    answer:"$2\\pi$",
    explanation:"由 Green 定理，$\\partial Q/\\partial x-\\partial P/\\partial y=1-(-1)=2$，單位圓面積為 $\\pi$，故結果 $2\\pi$。"
  },
  {
    id:"HCB-003",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜常係數微分方程",
    question:"解 $y''+4y'+5y=e^{-2x}$，且 $y(0)=0,\\ y'(0)=1$。下列何者正確？",
    choices:["$e^{-2x}(1-\\cos x+\\sin x)$","$e^{-2x}(1-\\cos 2x+\\sin x)$","$e^{-2x}(1+\\cos x-\\sin x)$","$e^{-x}(1-\\cos x+\\sin x)$"],
    answer:"$e^{-2x}(1-\\cos x+\\sin x)$",
    explanation:"齊次解為 $e^{-2x}(C_1\\cos x+C_2\\sin x)$，特解為 $e^{-2x}$。代入初值可得 $C_1=-1,C_2=1$。"
  },
  {
    id:"HCB-004",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜重積分換序",
    question:"計算 $\\displaystyle \\int_0^1\\int_0^x e^{x^2}\\,dy\\,dx$。",
    choices:["$\\dfrac{e-1}{2}$","$e-1$","$\\dfrac{e^2-1}{2}$","$\\dfrac{1-e^{-1}}{2}$"],
    answer:"$\\dfrac{e-1}{2}$",
    explanation:"內積分先對 $y$ 得 $x e^{x^2}$，再令 $u=x^2$，結果為 $\\frac12(e-1)$。"
  },
  {
    id:"HCB-005",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜傅立葉級數",
    question:"在 $(0,L)$ 上，$f(x)=x$ 的傅立葉正弦級數係數 $b_n$ 為何？",
    choices:["$\\dfrac{2L(-1)^{n+1}}{n\\pi}$","$\\dfrac{L(-1)^{n+1}}{n\\pi}$","$\\dfrac{2(-1)^{n+1}}{n\\pi}$","$\\dfrac{2L(-1)^n}{n\\pi}$"],
    answer:"$\\dfrac{2L(-1)^{n+1}}{n\\pi}$",
    explanation:"$b_n=\\frac{2}{L}\\int_0^L x\\sin(n\\pi x/L)dx=\\frac{2L(-1)^{n+1}}{n\\pi}$。"
  },
  {
    id:"HCB-006",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜熱方程分離變數",
    question:"熱方程 $u_t=k u_{xx}$，$u(0,t)=u(L,t)=0$，$u(x,0)=\\sin(\\pi x/L)+3\\sin(3\\pi x/L)$。求 $u(L/2,t)$。",
    choices:["$e^{-k\\pi^2t/L^2}-3e^{-9k\\pi^2t/L^2}$","$e^{-k\\pi^2t/L^2}+3e^{-9k\\pi^2t/L^2}$","$e^{-k\\pi^2t/L^2}-e^{-9k\\pi^2t/L^2}$","$3e^{-k\\pi^2t/L^2}-e^{-9k\\pi^2t/L^2}$"],
    answer:"$e^{-k\\pi^2t/L^2}-3e^{-9k\\pi^2t/L^2}$",
    explanation:"代入 $x=L/2$，有 $\\sin(\\pi/2)=1$，$\\sin(3\\pi/2)=-1$。"
  },
  {
    id:"HCB-007",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜廣義積分",
    question:"設 $a>0$，計算 $\\displaystyle \\int_0^\\infty \\dfrac{x}{(x^2+a^2)^2}\\,dx$。",
    choices:["$\\dfrac{1}{2a^2}$","$\\dfrac{1}{a^2}$","$\\dfrac{1}{2a}$","$\\dfrac{\\pi}{4a^2}$"],
    answer:"$\\dfrac{1}{2a^2}$",
    explanation:"令 $u=x^2+a^2$，$du=2x dx$，得 $\\frac12\\int_{a^2}^{\\infty}u^{-2}du=\\frac{1}{2a^2}$。"
  },
  {
    id:"HCB-008",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜留數定理",
    question:"求 $\\displaystyle \\operatorname{Res}_{z=i}\\dfrac{e^{2z}}{(z-i)^2}$。",
    choices:["$2e^{2i}$","$e^{2i}$","$-2e^{2i}$","$2ie^{2i}$"],
    answer:"$2e^{2i}$",
    explanation:"二階極點型態 $g(z)/(z-i)^2$ 的留數為 $g'(i)$。此處 $g(z)=e^{2z}$，故 $g'(i)=2e^{2i}$。"
  },
  {
    id:"HCB-009",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜拉普拉斯微分性質",
    question:"求 $\\mathcal{L}\\{t e^{-3t}\\sin 2t\\}$。",
    choices:["$\\dfrac{4(s+3)}{((s+3)^2+4)^2}$","$\\dfrac{2(s+3)}{((s+3)^2+4)^2}$","$\\dfrac{4s}{((s+3)^2+4)^2}$","$\\dfrac{4(s+3)}{((s+3)^2-4)^2}$"],
    answer:"$\\dfrac{4(s+3)}{((s+3)^2+4)^2}$",
    explanation:"$\\mathcal{L}\\{e^{-3t}\\sin2t\\}=2/((s+3)^2+4)$，再用 $\\mathcal{L}\\{tf(t)\\}=-F'(s)$。"
  },
  {
    id:"HCB-010",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜部分分式與反轉",
    question:"求 $\\mathcal{L}^{-1}\\left\\{\\dfrac{1}{(s^2+1)(s^2+4)}\\right\\}$。",
    choices:["$\\dfrac{1}{3}\\sin t-\\dfrac{1}{6}\\sin 2t$","$\\dfrac{1}{3}\\sin t-\\dfrac{1}{3}\\sin 2t$","$\\dfrac{1}{6}\\sin t-\\dfrac{1}{3}\\sin 2t$","$\\dfrac{1}{3}\\cos t-\\dfrac{1}{6}\\cos 2t$"],
    answer:"$\\dfrac{1}{3}\\sin t-\\dfrac{1}{6}\\sin 2t$",
    explanation:"$\\frac{1}{(s^2+1)(s^2+4)}=\\frac{1}{3}\\frac{1}{s^2+1}-\\frac{1}{3}\\frac{1}{s^2+4}$，反轉得 $\\frac{1}{3}\\sin t-\\frac{1}{6}\\sin 2t$。"
  }
];

function isNewtonUnlocked(){
  return String(state.cat?.name || "").trim().toLowerCase() === "newton";
}

function updateHiddenBossButton(){
  const btn = $("hiddenNewtonBossBtn");
  if(!btn) return;
  const unlocked = isNewtonUnlocked();
  btn.style.display = unlocked ? "inline-flex" : "none";
  btn.textContent = state.hiddenBossFirstClear ? "∂²" : "∂";
  btn.title = unlocked ? (state.hiddenBossFirstClear ? "Newton Gate（已破解，可再次挑戰）" : "Newton Gate") : "";
  btn.setAttribute("aria-label", btn.title || "hidden boss trigger");
}

function hiddenBossProfile(){
  return {
    icon:"∂",
    name:"國立彰化師範大學 陳明飛校長",
    img:"./assets/bosses/hidden_calc_boss.png",
    desc:"虛構隱藏 Boss。沒有提示、沒有暖身，只有高壓工程數學；每一題的答案都近得離譜。",
    hp:999,
    wrongPenalty:1.85,
    rewardFragments:12,
    skill:"Newton Gate：10 題工程數學連擊，答錯就被懲罰。"
  };
}

function grantHiddenBossRewards(){
  const firstClear = !state.hiddenBossFirstClear;
  const expReward = 140 + state.correct * 18;
  const fragmentReward = 6 + Math.max(2, state.correct);
  const chestReward = firstClear ? 2 : 1;
  addExp(expReward);
  gainFragments(fragmentReward);
  state.chests += chestReward;
  state.hiddenBossClearCount = (state.hiddenBossClearCount || 0) + 1;
  state.hiddenBossFirstClear = true;
  if(!state.titles.includes("newtonWhisperer")) state.titles.push("newtonWhisperer");
  state.battleLog.unshift(`∂ Newton Gate 獎勵發放：EXP +${expReward}、寶箱 +${chestReward}、碎片 +${fragmentReward}${firstClear ? "｜稱號解鎖：Newton Gate 破譯者" : ""}`);
}


function cleanupHiddenBossNavigation(resetSubject=false){
  state.hiddenBossMode = false;
  state.bossMode = false;
  state.currentQuestion = null;
  state.activeSession = null;
  state.mapPending = false;
  state.mapNodes = [];
  state.dungeonMap = null;
  state.currentRoomId = null;
  state.pendingRoomId = null;
  state.lastMapNote = "";
  state.nextQuestionMode = null;
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.daily3Mode = false;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.eventPending = false;
  state.currentEvent = null;
  state.counterMode = false;
  if(resetSubject){
    state.subject = null;
    state.gameMode = "chapter";
    state.hiddenBossResult = "";
  }
}

function finishHiddenBossRun(victory){
  const won = !!victory;
  state.stageCleared = won;
  state.hiddenBossResult = won ? "victory" : "defeat";
  if(won) grantHiddenBossRewards();
  state.hiddenBossLastScore = {
    victory: won,
    correct: state.correct,
    wrong: state.wrong,
    total: state.total,
    accuracy: calcAccuracy(),
    remainingHp: state.hp,
    clearedAt: new Date().toISOString()
  };
  cleanupHiddenBossNavigation(false);
  saveGameState();
  if(!won){
    cleanupHiddenBossNavigation(true);
    setCatMessage("小喵", "Newton Gate 挑戰失敗。這不是普通數學題，也不會進錯題本。先回主頁喘口氣。");
    return goHome();
  }
  switchToStartMusic();
  return showReport();
}

function startHiddenCalculusBoss(){
  if(!isNewtonUnlocked()) return;
  switchToHiddenBossMusic();
  state.subject = "Newton Gate";
  state.gameMode = "hidden";
  state.hiddenBossMode = true;
  state.hiddenBossIndex = 0;
  state.stageCleared = false;
  state.rogueBuffs = {}; state.roguePending = false; state.correctSinceBuff = 0;
  if(typeof resetStageQuestionMemory === "function") resetStageQuestionMemory(); else state.stageQuestionSigs = new Set();
  state.difficulty = "hard";
  state.monsterMaxHp = 999;
  state.monsterHp = 999;
  state.hp = 100;
  state.correct = 0;
  state.wrong = 0;
  state.total = 0;
  state.roundCount = 0;
  state.bossCount = 0;
  state.bossMode = true;
  state.correctStreak = 0;
  state.wrongStreak = 0;
  state.totalExpEarned = 0;
  state.answered = false;
  state.battleLog = [];
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.eventPending = false;
  state.eventCounter = 0;
  state.currentEvent = null;
  state.counterMode = false;
  state.mapPending=false; state.mapCooldownRound=-1; state.mapNodes=[]; state.dungeonFloor=1; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null; state.lastMapNote=''; state.nextQuestionMode=null; state.activeShield=false; state.activeBonusGuard=false; state.activeExpBoost=false; state.hardNodeBonus=false;
  state.usedIds = new Set();
  state.currentQuestion = null;
  state.activeSession = null;
  state.hiddenBossResult = "";
  $("feedbackArea").innerHTML=`<div class="feedback-card wrong boss-feedback"><div class="feedback-title wrong">∂ Newton Gate 啟動</div><p>10 題工程數學連發開始。沒有提示、沒有暖身，請直接作答。</p></div>`;
  state.battleLog.unshift("∂ Newton Gate 啟動：極限微積術師已出現。這次沒有提示，只有工程數學。");
  nextHiddenCalculusQuestion();
  renderBattle();
  showPage("battlePage");
}


function prepareHiddenBossQuestion(q, sourceIndex){
  const question = {...q};
  const correct = question.answer;
  const distractors = (question.choices || []).filter(x => x !== correct);
  for(let i=distractors.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  // v103: keep hidden-boss answers spread across A/B/C/D, not always A.
  const answerSlots = [2,0,3,1,2,1,3,0,2,1]; // C,A,D,B,C,B,D,A,C,B
  const target = answerSlots[sourceIndex % answerSlots.length];
  const arranged = [];
  let d = 0;
  for(let i=0;i<4;i++){
    arranged[i] = (i === target) ? correct : distractors[d++];
  }
  question.choices = arranged;
  question.answer = correct;
  question.correctLetter = choiceLetter(target);
  return question;
}


function nextHiddenCalculusQuestion(){
  if(!state.hiddenBossMode) return nextAdaptiveQuestion();
  if(state.hp <= 0) return finishHiddenBossRun(false);
  if(state.hiddenBossIndex >= HIDDEN_CALCULUS_QUESTIONS.length) return finishHiddenBossRun(true);
  const sourceIndex = state.hiddenBossIndex;
  const q = prepareHiddenBossQuestion(HIDDEN_CALCULUS_QUESTIONS[sourceIndex], sourceIndex);
  q.subject = "Newton Gate";
  state.hiddenBossIndex += 1;
  state.currentQuestion = q;
  state.currentQuestion.boss = true;
  state.currentQuestion.hiddenBoss = true;
  state.currentQuestion.difficulty = "hard";
  state.bossMode = true;
  state.difficulty = "hard";
  state.answered = false;
}


const ACHIEVEMENTS = [
  { id:"firstBoss", title:"第一次擊敗 Boss", desc:"擊破 1 隻 Boss", key:"boss", target:1, reward:{exp:40, fragments:5, title:"endlessSurvivor"} },
  { id:"correct10", title:"十連破解", desc:"累積答對 10 題", key:"correct", target:10, reward:{exp:50, fragments:3} },
  { id:"catLove100", title:"貓貓守護者", desc:"Pixel 親密度達 100", custom:()=>state.cat.love>=100 || state.cat.level>=2, reward:{exp:40, title:"catGuardian"} },
  { id:"ssrFirst", title:"SSR 歐皇", desc:"獲得任一 SSR 造型", custom:()=>state.cat.unlockedSkins.some(id=>SKIN_META[id]?.rarity==="SSR"), reward:{exp:80, title:"ssrLucky"} },
  { id:"feverOne", title:"第一次 Fever", desc:"Fever 啟動 1 次", key:"fever", target:1, reward:{exp:35, fragments:3} },
  { id:"endless50", title:"無盡模式倖存者", desc:"單輪答題達 50 題", custom:()=>state.gameMode==="endless" && state.total>=50, reward:{exp:100, chest:1, title:"endlessSurvivor"} },
  { id:"chinese10", title:"文意刺客", desc:"完成 10 題國文", key:"chinese", target:10, reward:{exp:45, title:"textAssassin"} },
  { id:"math10", title:"數學建模師", desc:"完成 10 題數學", key:"math", target:10, reward:{exp:45, title:"mathModeler"} },
  { id:"nature10", title:"自然實驗王", desc:"完成 10 題自然", key:"nature", target:10, reward:{exp:45, title:"sciencePilot"} },
  { id:"society10", title:"社會判讀者", desc:"完成 10 題社會", key:"society", target:10, reward:{exp:45, title:"societyReader"} },
  { id:"english10", title:"英文語境獵人", desc:"完成 10 題英文", key:"english", target:10, reward:{exp:45, title:"englishHunter"} }
];

const RANDOM_EVENTS = [
  {
    id:"examNight", title:"期末考前夜", desc:"Pixel 發現一份破碎筆記。要怎麼處理？",
    choices:[
      { text:"挑戰困難題模組", effect:"EXP +25，但 HP -8", run:()=>{ addExp(25); state.hp=Math.max(1,state.hp-8); } },
      { text:"整理錯題筆記", effect:"寶箱碎片 +3", run:()=>{ gainFragments(3); } },
      { text:"讓 Pixel 休息", effect:"HP +12，親密度 +8", run:()=>{ state.hp=Math.min(100,state.hp+12); state.cat.love=Math.min(100,state.cat.love+8); } }
    ]
  },
  {
    id:"mysteryTutor", title:"神秘補習班", desc:"小喵發現一個可疑的速成課程。",
    choices:[
      { text:"破解課程資料庫", effect:"Fever +30", run:()=>gainFever(30) },
      { text:"拿走練習卷", effect:"EXP +18，碎片 +2", run:()=>{ addExp(18); gainFragments(2); } },
      { text:"把小魚乾留給貓", effect:"小魚乾 +8", run:()=>{ state.cat.fish+=8; } }
    ]
  },
  {
    id:"catSignal", title:"貓貓訊號", desc:"這小傢伙盯著螢幕，好像發現了什麼。",
    choices:[
      { text:"跟著他調查", effect:"寶箱碎片 +4", run:()=>gainFragments(4) },
      { text:"摸摸他冷靜一下", effect:"親密度 +12", run:()=>{ state.cat.love=Math.min(100,state.cat.love+Math.round(12*(1+(titleBonus("feedLove")||0)))); } },
      { text:"直接進入下一題", effect:"Bonus Combo +1", run:()=>{ state.bonusCombo=(state.bonusCombo||0)+1; } }
    ]
  }
];

function bossProfile(){ return state.hiddenBossMode ? hiddenBossProfile() : (BOSS_PROFILES[state.subject] || {icon:"👑", name:"核心 Boss", img:"", hp:160, wrongPenalty:1, rewardFragments:4, desc:"核心 Boss。", skill:"無"}); }
function titleMeta(){ return TITLE_META[state.equippedTitle] || TITLE_META.rookie; }
function titleBonus(type, subject){
  const eff = titleMeta().effect || {};
  if(eff.type === "hybrid" && Array.isArray(eff.effects)){
    return eff.effects
      .filter(x=>x.type === type && (!subject || x.subject === subject))
      .reduce((sum,x)=>sum + (x.value || 0), 0);
  }
  if(eff.type === type && (!subject || eff.subject === subject)) return eff.value || 0;
  return 0;
}
function rewardText2(r){
  const arr=[];
  if(r.exp) arr.push(`EXP +${r.exp}`);
  if(r.fragments) arr.push(`碎片 +${r.fragments}`);
  if(r.chest) arr.push(`寶箱 +${r.chest}`);
  if(r.title) arr.push(`稱號：${TITLE_META[r.title]?.name || r.title}`);
  return arr.join("｜");
}
function gainFragments(n){
  const bonus = titleBonus("fragmentBonus") ? titleBonus("fragmentBonus") : 0;
  state.fragments = (state.fragments || 0) + n + bonus;
  while(state.fragments >= 10){
    state.fragments -= 10;
    state.chests++;
    pushLootLog("🧩 寶箱碎片合成：寶箱 +1。");
  }
}
function craftChestFromFragments(){
  if((state.fragments || 0) < 10){
    if($("gachaMessage")) $("gachaMessage").textContent = `碎片不足，目前 ${state.fragments || 0}/10。`;
    return;
  }
  state.fragments -= 10;
  state.chests++;
  if($("gachaMessage")) $("gachaMessage").textContent = "碎片合成成功：寶箱 +1。";
  updateSidebar();
}
function achievementProgress(a){
  if(a.custom) return a.custom() ? a.target || 1 : 0;
  return questValue(a.key);
}
function applyAchievementReward(r){
  if(r.exp) addExp(r.exp);
  if(r.fragments) gainFragments(r.fragments);
  if(r.chest) state.chests += r.chest;
  if(r.title && !state.titles.includes(r.title)) state.titles.push(r.title);
}
function claimAchievement(id){
  const a = ACHIEVEMENTS.find(x=>x.id===id);
  if(!a || state.achievements[id]) return;
  const target = a.target || 1;
  if(achievementProgress(a) < target) return;
  state.achievements[id] = true;
  applyAchievementReward(a.reward || {});
  pushLootLog(`🏆 成就完成：${a.title}，獲得 ${rewardText2(a.reward||{})}。`);
  renderAchievementPage();
  updateSidebar();
}
function equipTitle(id){
  if(!state.titles.includes(id)) return;
  state.equippedTitle = id;
  renderAchievementPage();
  updateSidebar();
}
function renderAchievementPage(){
  const box=$("achievementList");
  if(box){
    box.innerHTML = ACHIEVEMENTS.map(a=>{
      const target=a.target||1, value=Math.min(achievementProgress(a), target), done=value>=target, claimed=!!state.achievements[a.id], pct=Math.min(100,value/target*100);
      return `<div class="achievement-card ${done?'done':''} ${claimed?'claimed':''}">
        <div class="achievement-head"><div><div class="achievement-title">${esc(a.title)}</div><div class="muted small">${esc(a.desc)}</div></div><div class="achievement-reward">${esc(rewardText2(a.reward||{}))}</div></div>
        <div class="progress-small"><div style="width:${pct}%"></div></div>
        <div class="bar-label">${value}/${target}</div>
        <button class="${done&&!claimed?'primary-btn':'secondary-btn'}" ${done&&!claimed?'':'disabled'} onclick="claimAchievement('${a.id}')">${claimed?'已領取':done?'領取成就':'尚未完成'}</button>
      </div>`;
    }).join("");
  }
  const titleList=$("titleList");
  if(titleList){
    titleList.innerHTML = Object.entries(TITLE_META).map(([id,t])=>{
      const unlocked=state.titles.includes(id), equipped=state.equippedTitle===id;
      return `<div class="title-card ${unlocked?'unlocked':'locked'} ${equipped?'equipped':''}">
        <div class="title-head"><div><div class="title-name">${esc(t.name)}</div><div class="muted small">${esc(t.effectText)}</div></div><div class="title-effect-mini">${equipped?'已裝備':unlocked?'可裝備':'未解鎖'}</div></div>
        <button class="${unlocked?'primary-btn':'secondary-btn'}" ${unlocked?'':'disabled'} onclick="equipTitle('${id}')">${equipped?'使用中':'裝備稱號'}</button>
      </div>`;
    }).join("");
  }
  if($("equippedTitleName")) $("equippedTitleName").textContent=titleMeta().name;
  if($("titleEffectText")) $("titleEffectText").textContent=`效果：${titleMeta().effectText}`;
}
function showAchievementPage(){ renderAchievementPage(); showPage("achievementPage"); }

function renderCodexPage(){
  const cats=$("codexCats");
  if(cats){
    cats.innerHTML=Object.entries(SKIN_META).map(([id,m])=>`<div class="codex-card"><div class="codex-head"><div><img src="${m.src}" alt="${esc(m.name)}"><div class="codex-name">${esc(m.name)}</div><div class="muted small">${esc(m.effectText||"")}</div></div><div class="codex-tag">${m.rarity}</div></div></div>`).join("");
  }
  const bosses=$("codexBosses");
  if(bosses){
    bosses.innerHTML=Object.entries(BOSS_PROFILES).map(([s,b])=>`<div class="codex-card"><img class="codex-boss-img" src="${b.img}" alt="${esc(b.name)}"><div class="codex-name">${b.icon} ${esc(s)}｜${esc(b.name)}</div><div class="muted small">${esc(b.desc)}</div><div class="codex-tag">${esc(b.skill)}</div></div>`).join("");
  }
  const buffs=$("codexBuffs");
  if(buffs){
    buffs.innerHTML=ROGUE_BUFFS.map(b=>`<div class="codex-card"><div class="codex-name">${b.icon} ${esc(b.title)}</div><div class="muted small">${esc(b.desc)}</div></div>`).join("");
  }
}
function showCodexPage(){ renderCodexPage(); showPage("codexPage"); }


const SHOP_ITEMS = [
  { id:"removeWrong", icon:"🧹", name:"刪錯卡", desc:"戰鬥中刪除 1 個錯誤選項。", costType:"fish", cost:6 },
  { id:"hintCard", icon:"💡", name:"提示卡", desc:"顯示這題的題型提醒與思考方向。", costType:"fish", cost:5 },
  { id:"shieldCard", icon:"🛡️", name:"護盾卡", desc:"下一次答錯不扣 HP。", costType:"fish", cost:8 },
  { id:"feverBattery", icon:"⚡", name:"Fever 電池", desc:"立即補充 35 Fever 能量。", costType:"fish", cost:9 },
  { id:"bonusGuard", icon:"🔥", name:"Bonus 保護卡", desc:"下一次答錯時保住 Combo 不歸零。", costType:"fragments", cost:3 },
  { id:"expBoost", icon:"📘", name:"EXP 加倍卡", desc:"下一題答對 EXP 加倍。", costType:"fragments", cost:4 },
  { id:"hardTicket", icon:"🧠", name:"困難挑戰券", desc:"下一題強制困難，答對額外給碎片。", costType:"fragments", cost:3 }
];

const MAP_NODE_POOL = [
  { id:"normal", icon:"📘", title:"穩定學習節點", desc:"下一題維持目前節奏，HP +4。", reward:"安全、回血", run:()=>{ state.hp=Math.min(100,state.hp+4); state.nextQuestionMode=null; } },
  { id:"hard", icon:"🧠", title:"困難挑戰節點", desc:"下一題強制困難，答對可得到額外碎片。", reward:"高風險高報酬", run:()=>{ state.nextQuestionMode="hard"; state.hardNodeBonus=true; } },
  { id:"shop", icon:"🛒", title:"小魚乾商店", desc:"進入商店購買提示、護盾、刪錯卡等道具。", reward:"補給與策略", run:()=>showShopPage(true) },
  { id:"rest", icon:"🐾", title:"貓貓休息站", desc:"Pixel 休息並幫你回血，親密度也會上升。", reward:"HP +15、親密度 +8", run:()=>{ state.hp=Math.min(100,state.hp+15); state.cat.love=Math.min(100,state.cat.love+8); } },
  { id:"event", icon:"🌙", title:"突發事件節點", desc:"直接觸發一個隨機事件，可能賺也可能虧。", reward:"事件選擇", run:()=>showRandomEvent() },
  { id:"boss", icon:"👑", title:"Boss 追蹤節點", desc:"加速進入 Boss 戰，適合狀態很好的時候。", reward:"快速刷碎片", run:()=>{ state.roundCount=10; } }
];

function ensureItems(){
  state.items = Object.assign({ removeWrong:0, hintCard:0, shieldCard:0, feverBattery:0, bonusGuard:0, expBoost:0, hardTicket:0 }, state.items || {});
  state.catShards = state.catShards || {};
  state.catSkillLevels = state.catSkillLevels || {};
}

function itemName(id){
  return SHOP_ITEMS.find(x=>x.id===id)?.name || id;
}

function catSkillLevel(id = state.cat.equippedSkin){
  state.catSkillLevels = state.catSkillLevels || {};
  return state.catSkillLevels[id] || 1;
}

function catSkillMultiplier(id = state.cat.equippedSkin){
  return 1 + (catSkillLevel(id) - 1) * 0.12;
}

function catUpgradeCost(id = state.cat.equippedSkin){
  const lv = catSkillLevel(id);
  const rarity = SKIN_META[id]?.rarity || "COMMON";
  const base = rarity === "SSR" ? 4 : rarity === "EPIC" ? 3 : rarity === "RARE" ? 2 : 1;
  return { shards: base + lv - 1, fragments: Math.max(1, Math.ceil((base + lv) / 2)) };
}

function duplicateShardAmount(rarity){
  if(rarity === "SSR") return 10;
  if(rarity === "EPIC") return 6;
  if(rarity === "RARE") return 4;
  if(rarity === "UNCOMMON") return 2;
  return 1;
}

function renderCatSkillPanel(){
  if(!$("catSkillName")) return;
  const id = state.cat.equippedSkin;
  const meta = SKIN_META[id] || SKIN_META.orange_tabby;
  const lv = catSkillLevel(id);
  const cost = catUpgradeCost(id);
  $("catSkillName").textContent = meta.name;
  $("catSkillLevel").textContent = `Lv.${lv}`;
  $("catShardCount").textContent = `${state.catShards?.[id] || 0}`;
  $("catSkillEffect").textContent = `目前支援倍率：x${catSkillMultiplier(id).toFixed(2)}。升級需要 ${cost.shards} 個該貓碎片與 ${cost.fragments} 個寶箱碎片。`;
}

function upgradeEquippedCatSkill(){
  ensureItems();
  const id = state.cat.equippedSkin;
  const cost = catUpgradeCost(id);
  const haveShard = state.catShards[id] || 0;
  if(haveShard < cost.shards || (state.fragments || 0) < cost.fragments){
    setCatMessage("小喵", `這小傢伙的升級材料還不夠。需要貓碎片 ${cost.shards}、寶箱碎片 ${cost.fragments}。`);
    return;
  }
  state.catShards[id] -= cost.shards;
  state.fragments -= cost.fragments;
  state.catSkillLevels[id] = catSkillLevel(id) + 1;
  pushLootLog(`🧬 ${skinName(id)} 技能升到 Lv.${state.catSkillLevels[id]}。`);
  setCatMessage("小喵", `這小傢伙的同步等級升到 Lv.${state.catSkillLevels[id]}。看起來有點得意。`);
  updateCatUI();
  updateSidebar();
}

function renderItemBag(){
  ensureItems();
  const box = $("itemBagList");
  if(!box) return;
  const useMap = {
    removeWrong: "useRemoveWrong",
    hintCard: "useHintCard",
    shieldCard: "useShieldCard",
    feverBattery: "useFeverBattery",
    bonusGuard: "useBonusGuard",
    expBoost: "useExpBoost",
    hardTicket: "useHardTicket"
  };
  const total = SHOP_ITEMS.reduce((sum,item)=>sum+(state.items[item.id]||0),0);
  box.innerHTML = `<details class="shop-item-accordion" open>
    <summary><span>🎒 道具背包</span><strong>${total}</strong></summary>
    <div class="shop-item-grid">
      ${SHOP_ITEMS.map(item => `<div class="item-bag-card compact">
        <div class="item-name">${item.icon} ${esc(item.name)}</div>
        <div class="muted small">${esc(item.desc)}</div>
        <div class="item-count">持有：${state.items[item.id] || 0}</div>
        <div class="item-use-line"><button class="secondary-btn" onclick="${useMap[item.id]}()">使用</button></div>
      </div>`).join("")}
    </div>
  </details>`;
}

function renderShopPage(){
  ensureItems();
  const box = $("shopList");
  if(box){
    box.innerHTML = SHOP_ITEMS.map(item=>{
      const costLabel = item.costType === "fish" ? `小魚乾 ${item.cost}` : `寶箱碎片 ${item.cost}`;
      return `<div class="shop-card">
        <div class="shop-title">${item.icon} ${esc(item.name)}</div>
        <div class="muted small">${esc(item.desc)}</div>
        <div class="shop-cost">價格：${costLabel}</div>
        <button class="primary-btn" onclick="buyShopItem('${item.id}')">購買</button>
      </div>`;
    }).join("");
  }
  renderItemBag();
  updateSidebar();
}

function showShopPage(fromMap=false){
  state.shopReturnToBattle = !!fromMap;
  renderShopPage();
  showPage("shopPage");
}

function buyShopItem(id){
  ensureItems();
  const item = SHOP_ITEMS.find(x=>x.id===id);
  if(!item) return;
  if(item.costType === "fish"){
    if(state.cat.fish < item.cost){ setCatMessage("小喵", "小魚乾不夠。那隻小傢伙也不想把最後一口借出去。"); return; }
    state.cat.fish -= item.cost;
  } else {
    if((state.fragments || 0) < item.cost){ setCatMessage("小喵", "寶箱碎片不夠。先去打困難題或 Boss。"); return; }
    state.fragments -= item.cost;
  }
  state.items[id] = (state.items[id] || 0) + 1;
  pushLootLog(`🛒 購買 ${item.name} x1。`);
  renderShopPage();
  updateSidebar();
}

function useRemoveWrong(){
  ensureItems();
  if((state.items.removeWrong || 0) <= 0){ setCatMessage("小喵", "沒有刪錯卡。去商店補貨吧。"); return; }
  if(!state.currentQuestion || state.answered) return;

  const btns = Array.from(document.querySelectorAll ? document.querySelectorAll("#choices button") : []);
  const wrongBtns = btns.filter(btn =>
    btn &&
    btn.dataset &&
    btn.dataset.correct !== "1" &&
    !btn.disabled &&
    !(btn.classList && btn.classList.contains("removed-choice"))
  );

  if(!wrongBtns.length){
    setCatMessage("小喵", "目前已經沒有可刪除的錯誤選項。");
    return;
  }

  const btn = wrongBtns[Math.floor(Math.random()*wrongBtns.length)];
  btn.disabled = true;
  btn.classList.add("removed-choice");
  btn.setAttribute("aria-disabled", "true");

  state.items.removeWrong--;
  state.battleLog.unshift(`🧹 刪錯卡啟動：已確實移除一個錯誤選項。`);
  updateSidebar();
}

function useHintCard(){
  ensureItems();
  if((state.items.hintCard || 0) <= 0){ setCatMessage("小喵", "沒有提示卡。商店有賣，別硬扛。"); return; }
  if(!state.currentQuestion || state.answered) return;
  state.items.hintCard--;
  const q = state.currentQuestion;
  $("feedbackArea").innerHTML = `<div class="feedback-card correct"><div class="feedback-title correct">💡 小喵提示</div><p>題型：${esc(q.topic)}。先找題幹中的限制條件，不要只看關鍵字。這題的陷阱通常在選項的細節差異。</p></div>`;
  updateSidebar();
}

function useShieldCard(){
  ensureItems();
  if((state.items.shieldCard || 0) <= 0){ setCatMessage("小喵", "沒有護盾卡。"); return; }
  state.items.shieldCard--;
  state.activeShield = true;
  state.battleLog.unshift("🛡️ 護盾啟動：下一次答錯不扣 HP。");
  updateSidebar();
}

function useFeverBattery(){
  ensureItems();
  if((state.items.feverBattery || 0) <= 0){ setCatMessage("小喵", "沒有 Fever 電池。"); return; }
  state.items.feverBattery--;
  gainFever(35);
  state.battleLog.unshift("⚡ Fever 電池使用：能量 +35。");
  updateSidebar();
  if(state.subject) renderBattle();
}

function useBonusGuard(){
  ensureItems();
  if((state.items.bonusGuard || 0) <= 0){ setCatMessage("小喵", "沒有 Bonus 保護卡。"); return; }
  state.items.bonusGuard--;
  state.activeBonusGuard = true;
  state.battleLog.unshift("🔥 Bonus 保護啟動：下一次答錯不歸零 Combo。");
  updateSidebar();
}

function useExpBoost(){
  ensureItems();
  if((state.items.expBoost || 0) <= 0){ setCatMessage("小喵", "沒有 EXP 加倍卡。"); return; }
  state.items.expBoost--;
  state.activeExpBoost = true;
  state.battleLog.unshift("📘 EXP 加倍啟動：下一題答對 EXP x2。");
  updateSidebar();
}

function useHardTicket(){
  ensureItems();
  if((state.items.hardTicket || 0) <= 0){ setCatMessage("小喵", "沒有困難挑戰券。"); return; }
  state.items.hardTicket--;
  state.nextQuestionMode = "hard";
  state.hardNodeBonus = true;
  state.battleLog.unshift("🧠 困難挑戰券啟動：下一題強制困難，答對額外給碎片。");
  updateSidebar();
}


function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function roomCenter(room){
  return { x: room.x + room.w/2, y: room.y + room.h/2 };
}

function overlapWithMargin(a,b,margin=1){
  return !(a.x + a.w + margin <= b.x || b.x + b.w + margin <= a.x || a.y + a.h + margin <= b.y || b.y + b.h + margin <= a.y);
}

function roomTypeMeta(type){
  const meta = {
    spawn: { icon:'🏁', name:'出生房', desc:'起點房，從這裡開始探索。', reward:'起點', className:'spawn' },
    teleport: { icon:'🌀', name:'傳送房', desc:'抵達後可前往下一張地圖。', reward:'前進下一層', className:'teleport' },
    normal: { icon:'⚔️', name:'題目房', desc:'完成 1 題一般挑戰。', reward:'答題推進', className:'normal' },
    hard: { icon:'🔥', name:'挑戰房', desc:'完成 1 題較難挑戰，額外獎勵碎片。', reward:'困難題＋獎勵', className:'hard' },
    rest: { icon:'💖', name:'補給房', desc:'回復一些 HP，穩定往前。', reward:'HP 回復', className:'rest' },
    treasure: { icon:'🎁', name:'獎勵房', desc:'拿到小魚乾與碎片。', reward:'補給獎勵', className:'treasure' }
  };
  return meta[type] || meta.normal;
}

function generateDungeonMap(floor=1){
  const cols = 28;
  const rows = 18;
  const roomCount = randomInt(7, 11);
  const rooms = [];
  let attempts = 0;
  while(rooms.length < roomCount && attempts < 400){
    attempts++;
    const room = { id:`r${rooms.length+1}`, x:randomInt(1, cols-7), y:randomInt(1, rows-5), w:randomInt(3,6), h:randomInt(2,4) };
    if(room.x + room.w >= cols-1 || room.y + room.h >= rows-1) continue;
    if(rooms.some(r => overlapWithMargin(r, room, 1))) continue;
    rooms.push(room);
  }
  if(rooms.length < 5){
    return generateDungeonMap(floor);
  }
  rooms.sort((a,b)=>a.x-b.x || a.y-b.y);
  rooms.forEach((r,i)=>{ r.seq=i+1; r.neighbors=[]; r.cleared=false; r.visited=false; r.type='normal'; });
  const edges = [];
  const seen = new Set();
  const link = (a,b)=>{
    if(!a || !b || a.id===b.id) return;
    const key=[a.id,b.id].sort().join('-');
    if(seen.has(key)) return;
    seen.add(key);
    a.neighbors.push(b.id);
    b.neighbors.push(a.id);
    edges.push({a:a.id,b:b.id});
  };
  for(let i=0;i<rooms.length-1;i++) link(rooms[i], rooms[i+1]);
  const extra = randomInt(1, Math.min(3, rooms.length-3));
  for(let k=0;k<extra;k++){
    const a = rooms[randomInt(0, rooms.length-2)];
    const b = rooms[randomInt(1, rooms.length-1)];
    link(a,b);
  }

  rooms[0].type = 'spawn';
  rooms[0].cleared = true;
  rooms[0].visited = true;
  rooms[rooms.length-1].type = 'teleport';

  const mids = rooms.slice(1,-1);
  if(mids.length){
    const candidates = mids.slice();
    const shuffle = arr => { for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; };
    shuffle(candidates);
    if(candidates[0]) candidates[0].type = 'rest';
    if(candidates[1]) candidates[1].type = 'treasure';
    const hardCount = floor >= 3 ? 2 : 1;
    for(let i=0;i<hardCount;i++) if(candidates[2+i]) candidates[2+i].type = 'hard';
  }

  const map = {
    floor,
    cols,
    rows,
    rooms,
    edges,
    spawnId: rooms[0].id,
    teleportId: rooms[rooms.length-1].id
  };
  return map;
}

function ensureDungeonMap(forceNew=false){
  if(forceNew || !state.dungeonMap){
    state.dungeonMap = assertMapHasForwardGoal(generateDungeonMap(state.dungeonFloor || 1));
    state.currentRoomId = state.dungeonMap.spawnId;
    state.pendingRoomId = null;
    state.lastMapNote = '從出生房出發，只能往前走；沿著走廊一定能抵達傳送房。';
  }
  return state.dungeonMap;
}

function currentDungeonRoom(){
  const rooms = state.dungeonMap?.rooms || [];
  return rooms.find(r=>r.id===state.currentRoomId) || null;
}

function getRoomById(id){
  const rooms = state.dungeonMap?.rooms || [];
  return rooms.find(r=>r.id===id) || null;
}

function accessibleRooms(){
  const room = currentDungeonRoom();
  if(!room) return [];
  // v86: 單向推圖。只能前往排序在目前房間之後、尚未完成的相鄰房間。
  // 地圖生成時會以房間序號串成主路徑，所以一定能一路走到傳送房。
  return room.neighbors
    .map(id=>getRoomById(id))
    .filter(r => r && r.seq > room.seq && !r.cleared)
    .sort((a,b)=>a.seq-b.seq);
}

function hasForwardPathToTeleport(map){
  if(!map || !map.rooms?.length) return false;
  const byId = Object.fromEntries(map.rooms.map(r=>[r.id,r]));
  const visited = new Set();
  const stack = [map.spawnId];
  while(stack.length){
    const id = stack.pop();
    if(id === map.teleportId) return true;
    if(visited.has(id)) continue;
    visited.add(id);
    const room = byId[id];
    if(!room) continue;
    for(const nextId of room.neighbors){
      const next = byId[nextId];
      if(next && next.seq > room.seq && !visited.has(next.id)) stack.push(next.id);
    }
  }
  return false;
}

function assertMapHasForwardGoal(map){
  if(hasForwardPathToTeleport(map)) return map;
  // 保險：若隨機結果意外沒有單向路徑，重新生成。
  return generateDungeonMap(map?.floor || state.dungeonFloor || 1);
}

function drawDungeonSvg(map){
  const tile = 22;
  const width = map.cols * tile;
  const height = map.rows * tile;
  const roomById = Object.fromEntries(map.rooms.map(r=>[r.id,r]));
  const corridorParts = map.edges.map(edge=>{
    const a = roomCenter(roomById[edge.a]);
    const b = roomCenter(roomById[edge.b]);
    const x1 = a.x * tile, y1 = a.y * tile, x2 = b.x * tile, y2 = b.y * tile;
    return `<path d="M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}" class="dungeon-corridor" />`;
  }).join('');
  const current = state.currentRoomId;
  const accIds = new Set(accessibleRooms().map(r=>r.id));
  const roomParts = map.rooms.map(room=>{
    const meta = roomTypeMeta(room.type);
    const x = room.x * tile, y = room.y * tile, w = room.w * tile, h = room.h * tile;
    const classes = ['dungeon-room', `type-${meta.className}`];
    if(room.id === current) classes.push('current');
    if(room.cleared) classes.push('cleared');
    if(accIds.has(room.id) && room.id !== current) classes.push('reachable');
    const small = meta.name.replace('房','');
    const canGo = accIds.has(room.id) && room.id !== current;
    return `<g class="${classes.join(' ')}" ${canGo ? `onclick="enterDungeonRoom('${room.id}')" role="button" tabindex="0"` : ''}>
      <rect x="${x}" y="${y}" rx="8" ry="8" width="${w}" height="${h}"></rect>
      <text x="${x + w/2}" y="${y + h/2 - 4}" text-anchor="middle" class="dungeon-room-label">${meta.icon}</text>
      <text x="${x + w/2}" y="${y + h/2 + 14}" text-anchor="middle" class="dungeon-room-sub">${small}</text>
    </g>`;
  }).join('');
  const playerRoom = getRoomById(current);
  let marker='';
  if(playerRoom){
    const c = roomCenter(playerRoom);
    marker = `<g class="dungeon-player"><circle cx="${c.x * tile}" cy="${c.y * tile}" r="10"></circle><text x="${c.x * tile}" y="${c.y * tile + 4}" text-anchor="middle">🐾</text></g>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" class="dungeon-svg" aria-label="隨機關卡地圖">${corridorParts}${roomParts}${marker}</svg>`;
}

function renderMapPage(){
  const map = ensureDungeonMap(false);
  if($('mapSvgWrap')) $('mapSvgWrap').innerHTML = drawDungeonSvg(map);
  const room = currentDungeonRoom();
  const choices = accessibleRooms();
  if($('mapRoomChoices')){
    $('mapRoomChoices').innerHTML = choices.map(r=>{
      const meta = roomTypeMeta(r.type);
      return `<button class="map-room-choice ${meta.className}" onclick="enterDungeonRoom('${r.id}')">
        <div class="node-title">${meta.icon} ${meta.name}</div>
        <div class="muted small">${esc(meta.desc)}</div>
        <div class="node-reward">${esc(meta.reward)}</div>
      </button>`;
    }).join('') || '<div class="muted">目前沒有可前往的房間。</div>';
  }
  if($('mapCurrentRoom')) $('mapCurrentRoom').textContent = room ? `${roomTypeMeta(room.type).icon} ${roomTypeMeta(room.type).name}` : '-';
  if($('mapFloor')) $('mapFloor').textContent = `${map.floor}`;
  if($('mapRoomCount')) $('mapRoomCount').textContent = `${map.rooms.length}`;
  if($('mapSubject')) $('mapSubject').textContent = state.subject || '-';
  if($('mapTotal')) $('mapTotal').textContent = state.total;
  if($('mapHp')) $('mapHp').textContent = `${state.hp}/100`;
  if($('mapFish')) $('mapFish').textContent = state.cat.fish;
  if($('mapFragments')) $('mapFragments').textContent = `${state.fragments || 0}/10`;
  if($('mapNote')) $('mapNote').textContent = state.lastMapNote || '選擇相鄰房間後前進。';
}

function showMapPage(forceNew=false){
  if(state.daily3Mode || state.gameMode === "daily3"){
    showPage("battlePage");
    if($("hubHint")) $("hubHint").textContent = "今日 3 題是短挑戰，不使用冒險地圖。";
    return;
  }
  if(state.hiddenBossMode || state.gameMode === "hidden" || state.subject === "Newton Gate"){
    cleanupHiddenBossNavigation(true);
    showSubjects();
    if($("hubHint")) $("hubHint").textContent = "隱藏 Boss 不使用冒險地圖。請重新選擇一般科目。";
    saveGameState();
    return;
  }
  if(!state.subject) return showSubjects();
  switchToBattleMusic();
  state.mapPending = true;
  ensureDungeonMap(forceNew);
  renderMapPage();
  showPage('mapPage');
}

function clearRoomAndReturn(room, note=''){
  if(!room) return;
  room.cleared = true;
  room.visited = true;
  state.currentRoomId = room.id;
  state.pendingRoomId = null;
  state.currentQuestion = null;
  state.answered = false;
  if(note) state.lastMapNote = note;
  renderMapPage();
  showPage('mapPage');
  updateSidebar();
}

function enterDungeonRoom(roomId){
  const room = getRoomById(roomId);
  if(!room) return;
  const reachableIds = new Set(accessibleRooms().map(r=>r.id));
  if(room.id !== state.currentRoomId && !reachableIds.has(room.id)){
    state.lastMapNote = "這張地圖是單向推進，不能回到已經走過的房間。請選擇前方相鄰房間。";
    renderMapPage();
    return;
  }
  const meta = roomTypeMeta(room.type);
  state.lastMapNote = `已前往 ${meta.name}。`;
  state.mapPending = false;

  if(room.type === 'teleport'){
    state.currentRoomId = room.id;
    room.cleared = true;
    room.visited = true;
    state.dungeonFloor = (state.dungeonFloor || 1) + 1;
    state.dungeonMap = assertMapHasForwardGoal(generateDungeonMap(state.dungeonFloor));
    state.currentRoomId = state.dungeonMap.spawnId;
    state.pendingRoomId = null;
    state.lastMapNote = `已通過第 ${state.dungeonFloor - 1} 張地圖，前往第 ${state.dungeonFloor} 張。`;
    state.battleLog.unshift(`🌀 抵達傳送房，已前往第 ${state.dungeonFloor} 張地圖。`);
    renderMapPage();
    showPage('mapPage');
    updateSidebar();
    return;
  }

  if(room.type === 'rest'){
    const heal = randomInt(10, 18);
    state.hp = Math.min(100, state.hp + heal);
    state.battleLog.unshift(`💖 補給房：HP 回復 ${heal}。`);
    return clearRoomAndReturn(room, `補給完成，HP 回復 ${heal}。`);
  }

  if(room.type === 'treasure'){
    const fish = randomInt(3, 8);
    const frag = randomInt(1, 2);
    state.cat.fish += fish;
    gainFragments(frag);
    state.battleLog.unshift(`🎁 獎勵房：小魚乾 +${fish}，碎片 +${frag}。`);
    return clearRoomAndReturn(room, `已取得獎勵：小魚乾 +${fish}、碎片 +${frag}。`);
  }

  state.pendingRoomId = room.id;
  state.currentRoomId = room.id;
  state.currentQuestion = null;
  state.answered = false;
  if(room.type === 'hard'){
    state.nextQuestionMode = 'hard';
    state.hardNodeBonus = true;
  }
  nextAdaptiveQuestion();
  $('feedbackArea').innerHTML='';
  renderBattle();
  showPage('battlePage');
}

function continueFromMap(){
  const choices = accessibleRooms();
  const nextRoom = choices.find(r=>r.type!=='teleport') || choices[0];
  if(nextRoom) return enterDungeonRoom(nextRoom.id);
}

function chooseMapNode(i){
  const node = (state.mapNodes || [])[i];
  if(!node) return;
}

function shouldOfferMap(){
  return false;
}

function maybeTriggerEvent(){
  if(state.gameMode !== "endless" || state.bossMode || state.eventPending || state.hp<=0) return false;
  state.eventCounter = (state.eventCounter || 0) + 1;
  if(state.eventCounter >= 6){
    state.eventCounter = 0;
    showRandomEvent();
    return true;
  }
  return false;
}
function showRandomEvent(){
  state.eventPending=true;
  const ev = RANDOM_EVENTS[Math.floor(Math.random()*RANDOM_EVENTS.length)];
  state.currentEvent = ev;
  if($("eventTitle")) $("eventTitle").textContent = ev.title;
  if($("eventDesc")) $("eventDesc").textContent = ev.desc;
  if($("eventChoices")){
    $("eventChoices").innerHTML = ev.choices.map((c,i)=>`<button class="event-choice-card" onclick="chooseEvent(${i})"><div class="achievement-title">${esc(c.text)}</div><div class="muted small">${esc(c.effect)}</div></button>`).join("");
  }
  showPage("eventPage");
}
function chooseEvent(i){
  const ev = state.currentEvent;
  if(ev && ev.choices[i]) ev.choices[i].run();
  state.eventPending=false;
  state.currentEvent = null;
  pushLootLog(`🌙 事件完成：${ev?.title || "神秘事件"}。`);
  updateSidebar();
  showPage("battlePage");
  goNext();
}
function startCounterQuestion(){
  if(!state.lastWrongRecord) return;
  state.counterMode=true;
  state.currentQuestion = offlineSimilarQuestion(state.lastWrongRecord);
  state.currentQuestion.topic = "錯題反擊｜" + (state.currentQuestion.topic || "");
  state.answered=false;
  $("feedbackArea").innerHTML="";
  renderBattle();
  showPage("battlePage");
}


function expToNext(){ return 50 + (state.level - 1) * 10; }
function modeLabel(m){ return m === "daily3" ? "今日 3 題" : (m === "hidden" ? "隱藏 Boss" : (m === "wrongbook" ? "錯題本模式" : (m === "endless" ? "無盡模式" : "10題章節模式"))); }
function skinName(id){ return SKIN_META[id]?.name || id; }
function rarityClass(r){ return String(r || "COMMON").toLowerCase(); }
function currentSkin(){ return SKIN_META[state.cat.equippedSkin] || SKIN_META.orange_tabby; }
function currentEffectText(){ return currentSkin().effectText || "無特殊效果"; }
function computeExpBonus(base, q, isBoss){
  const skin = currentSkin();
  const eff = skin.effect || {};
  let bonus = 0;
  if(eff.type === "generalExp") bonus += eff.value;
  if(eff.type === "allExpAndChest") bonus += eff.value;
  if(eff.type === "subjectExp" && eff.subject === state.subject) bonus += eff.value;
  bonus += titleBonus("subjectExp", state.subject);
  if(eff.type === "bossExp" && isBoss) bonus += eff.value;
  if(eff.type === "hardExp" && q && q.difficulty === "hard") bonus += eff.value;
  return { exp: Math.max(1, Math.round(base * (1 + bonus))), bonus };
}
function questValue(key){ return state.questStats?.[key] || 0; }
function bumpQuest(key, amount = 1){
  if(!state.questStats) state.questStats = {};
  state.questStats[key] = (state.questStats[key] || 0) + amount;
}
function pushLootLog(text){
  state.inventoryLog.unshift(text);
  state.inventoryLog = state.inventoryLog.slice(0, 10);
}

function ensureDailyMail(){
  state.dailyMail = Object.assign({ lastClaimDate:"", streak:0, lastRewardText:"", lastMessage:"" }, state.dailyMail || {});
  return state.dailyMail;
}

function dailyMailTodayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dailyMailYesterdayKey(){
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dailyMailRewardPreview(nextStreak){
  if(nextStreak > 0 && nextStreak % 7 === 0) return "7 日獎勵：寶箱 +1、刪錯卡 +1、小魚乾 +3";
  if(nextStreak > 0 && nextStreak % 3 === 0) return "3 日獎勵：碎片 +2、小魚乾 +4";
  return "今日獎勵：小魚乾 +3、碎片 +1";
}

function dailyMailApplyReward(streak){
  let text = "";
  if(streak > 0 && streak % 7 === 0){
    state.chests += 1;
    ensureItems();
    state.items.removeWrong = (state.items.removeWrong || 0) + 1;
    state.cat.fish += 3;
    text = "寶箱 +1、刪錯卡 +1、小魚乾 +3";
  }else if(streak > 0 && streak % 3 === 0){
    gainFragments(2);
    state.cat.fish += 4;
    text = "碎片 +2、小魚乾 +4";
  }else{
    gainFragments(1);
    state.cat.fish += 3;
    text = "小魚乾 +3、碎片 +1";
  }
  return text;
}

function buildDailyMailMessage(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  const claimed = mail.lastClaimDate === today;
  const nextStreak = claimed ? (mail.streak || 0) : ((mail.lastClaimDate === dailyMailYesterdayKey()) ? (mail.streak || 0) + 1 : 1);
  const catName = state.cat?.name || "Pixel";

  if(claimed){
    return `${catName} 今天的郵件已經領過了。可以不用硬衝，完成「今日 3 題」就算有維持手感。`;
  }
  if(nextStreak >= 7 && nextStreak % 7 === 0){
    return `${catName} 寄來一封閃亮郵件：你快湊到 7 日節奏了。今天只要回來一下，也值得被獎勵。`;
  }
  if(nextStreak >= 3 && nextStreak % 3 === 0){
    return `${catName} 在信上畫了三個魚乾：連續回來的感覺正在形成。今天不用多，先打 3 題就好。`;
  }
  return `${catName} 今天也在等你。讀書很累的話，不用開長關卡，先用「今日 3 題」讓腦袋暖機。`;
}

function renderDailyMailCard(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  const claimed = mail.lastClaimDate === today;
  const nextStreak = claimed ? (mail.streak || 0) : ((mail.lastClaimDate === dailyMailYesterdayKey()) ? (mail.streak || 0) + 1 : 1);

  if($("dailyMailDate")) $("dailyMailDate").textContent = `今日日期：${today}`;
  if($("dailyMailStreak")) $("dailyMailStreak").textContent = `連續 ${mail.streak || 0} 天`;
  if($("dailyMailMessage")) $("dailyMailMessage").textContent = buildDailyMailMessage();
  if($("dailyMailReward")) $("dailyMailReward").textContent = claimed ? `已領取：${mail.lastRewardText || "今日郵件獎勵"}` : dailyMailRewardPreview(nextStreak);
  if($("dailyMailClaimBtn")){
    $("dailyMailClaimBtn").disabled = claimed;
    $("dailyMailClaimBtn").textContent = claimed ? "今日已領取" : "領取今日郵件";
  }
}

function claimDailyMail(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  if(mail.lastClaimDate === today){
    renderDailyMailCard();
    return;
  }
  const streak = mail.lastClaimDate === dailyMailYesterdayKey() ? (mail.streak || 0) + 1 : 1;
  const rewardText = dailyMailApplyReward(streak);
  mail.lastClaimDate = today;
  mail.streak = streak;
  mail.lastRewardText = rewardText;
  mail.lastMessage = buildDailyMailMessage();
  pushLootLog(`📮 今日貓貓郵件：${rewardText}。連續 ${streak} 天。`);
  setCatMessage("小喵", `今日郵件已領取：${rewardText}。`);
  saveGameState();
  renderDailyMailCard();
  updateSidebar();
}


function weightedPick(list){
  const rarityBuckets = {
    SSR: list.filter(x => x.rarity === "SSR"),
    EPIC: list.filter(x => x.rarity === "EPIC"),
    RARE: list.filter(x => x.rarity === "RARE"),
    OTHER: list.filter(x => !["SSR","EPIC","RARE"].includes(x.rarity))
  };

  // v53 fixed gacha rates:
  // SSR total 3%, EPIC total 10%, RARE total 30%, COMMON/UNCOMMON/items total 57%.
  // Individual cards/items inside each rarity still use their own weight.
  if(rarityBuckets.SSR.length && rarityBuckets.EPIC.length && rarityBuckets.RARE.length && rarityBuckets.OTHER.length){
    const roll = Math.random() * 100;
    let bucket = rarityBuckets.OTHER;
    if(roll < 3) bucket = rarityBuckets.SSR;
    else if(roll < 13) bucket = rarityBuckets.EPIC;
    else if(roll < 43) bucket = rarityBuckets.RARE;
    return weightedPickWithin(bucket);
  }

  return weightedPickWithin(list);
}

function weightedPickWithin(list){
  const total = list.reduce((s,x)=>s+x.weight,0);
  let r = Math.random() * total;
  for(const item of list){ r -= item.weight; if(r <= 0) return item; }
  return list[list.length - 1];
}
function syncCatDisplay(){
  const img = $("catSkinDisplay");
  if(img) img.src = SKIN_META[state.cat.equippedSkin]?.src || "./assets/skins/orange_tabby.png";
  if($("equippedSkinName")) $("equippedSkinName").textContent = skinName(state.cat.equippedSkin);
}



const STORAGE_KEY = "CSQ_V60_PLAYER_PROFILE";
const SAVE_VERSION = 94;

function setToSetArray(v){
  if(v instanceof Set) return Array.from(v);
  if(Array.isArray(v)) return v;
  return [];
}

function activeSessionModeLabel(session){
  if(!session) return "尚無進行中模式";
  if(session.hiddenBossMode) return "Newton Gate｜隱藏 Boss";
  if(session.daily3Mode || session.gameMode === "daily3") return "今日 3 題｜放鬆挑戰";
  if(session.wrongBookMode) return session.wrongBookModeTypeKey ? "錯題本模式｜指定類型" : "錯題本模式";
  if(session.weakPracticeMode) return "常錯類型加練";
  if(session.gameMode === "endless") return "無盡模式";
  if(session.gameMode === "chapter") return "章節模式";
  return modeLabel(session.gameMode || "chapter");
}

function activeSessionDetail(session){
  if(!session) return "目前沒有可繼續的進度。";
  const subject = session.subject || "未選科目";
  const answeredText = session.answered ? "已作答，等待下一步" : "作答中";
  const roomText = session.dungeonMap ? `｜地圖 ${session.dungeonFloor || 1}` : "";
  const hiddenText = session.hiddenBossMode ? `｜第 ${Math.min(session.hiddenBossIndex || 0, HIDDEN_CALCULUS_QUESTIONS.length)}/${HIDDEN_CALCULUS_QUESTIONS.length} 題` : "";
  const qText = session.currentQuestion ? `｜${session.currentQuestion.topic || "題目"}｜${answeredText}` : "｜冒險地圖";
  return `${subject}｜${activeSessionModeLabel(session)}${hiddenText}${roomText}${qText}`;
}

function captureActiveSession(){
  const hasQuestion = !!state.currentQuestion;
  const hasMap = !!state.dungeonMap && !!state.subject;
  const activeMode = state.daily3Mode || state.hiddenBossMode || state.wrongBookMode || state.weakPracticeMode || state.gameMode === "chapter" || state.gameMode === "endless" || state.gameMode === "hidden" || state.gameMode === "daily3";
  if(!state.subject || state.stageCleared || state.hp <= 0 || (!hasQuestion && !hasMap && !activeMode)) return null;
  if(!hasQuestion && !hasMap) return null;
  return {
    savedAt: new Date().toISOString(),
    page: hasQuestion ? "battlePage" : "mapPage",
    subject: state.subject,
    difficulty: state.difficulty,
    gameMode: state.gameMode,
    daily3Mode: state.daily3Mode,
    daily3SubjectHistory: state.daily3SubjectHistory,
    hiddenBossMode: state.hiddenBossMode,
    hiddenBossIndex: state.hiddenBossIndex,
    hiddenBossResult: state.hiddenBossResult,
    hp: state.hp,
    monsterHp: state.monsterHp,
    monsterMaxHp: state.monsterMaxHp,
    currentQuestion: state.currentQuestion,
    usedIds: setToSetArray(state.usedIds),
    stageQuestionSigs: setToSetArray(state.stageQuestionSigs),
    answered: state.answered,
    bossMode: state.bossMode,
    bossCount: state.bossCount,
    roundCount: state.roundCount,
    correct: state.correct,
    wrong: state.wrong,
    total: state.total,
    correctStreak: state.correctStreak,
    wrongStreak: state.wrongStreak,
    totalExpEarned: state.totalExpEarned,
    battleLog: state.battleLog,
    stageCleared: state.stageCleared,
    wrongBookMode: state.wrongBookMode,
    wrongBookModeSubject: state.wrongBookModeSubject,
    wrongBookModeTypeKey: state.wrongBookModeTypeKey,
    weakPracticeMode: state.weakPracticeMode,
    weakPracticeTypeKey: state.weakPracticeTypeKey,
    mapPending: state.mapPending,
    mapNodes: state.mapNodes,
    dungeonFloor: state.dungeonFloor,
    dungeonMap: state.dungeonMap,
    currentRoomId: state.currentRoomId,
    pendingRoomId: state.pendingRoomId,
    lastMapNote: state.lastMapNote,
    nextQuestionMode: state.nextQuestionMode,
    eventPending: state.eventPending,
    currentEvent: state.currentEvent,
    counterMode: state.counterMode,
    rogueBuffs: state.rogueBuffs,
    roguePending: state.roguePending,
    rogueNextAction: state.rogueNextAction,
    correctSinceBuff: state.correctSinceBuff,
    activeShield: state.activeShield,
    activeBonusGuard: state.activeBonusGuard,
    activeExpBoost: state.activeExpBoost,
    hardNodeBonus: state.hardNodeBonus
  };
}

function restoreActiveSession(session = state.activeSession){
  if(!session){
    setManualSaveStatus("目前沒有進行中的關卡可返回。", "warn");
    return false;
  }
  Object.assign(state, session);
  state.usedIds = new Set(session.usedIds || []);
  state.stageQuestionSigs = new Set(session.stageQuestionSigs || []);
  state.battleLog = Array.isArray(session.battleLog) ? session.battleLog : [];
  state.currentQuestion = session.currentQuestion || null;
  state.activeSession = session;
  state.currentPage = session.page || (state.currentQuestion ? "battlePage" : "mapPage");
  updateSidebar();
  updateCatUI();
  updateQuickHub();
  if(state.currentQuestion){
    if(state.hiddenBossMode) switchToHiddenBossMusic();
    else switchToBattleMusic();
    $("feedbackArea").innerHTML = state.answered ? `<div class="feedback neutral">已回到進行中的題目。這題已作答，請按「下一步」繼續。</div>` : "";
    renderBattle();
    showPage("battlePage");
  }else if(state.dungeonMap){
    switchToBattleMusic();
    renderMapPage();
    showPage("mapPage");
  }else if(session.wrongBookMode){
    nextWrongBookQuestion();
  }else{
    showSubjects();
  }
  setManualSaveStatus(`已回到進行中模式：${activeSessionModeLabel(session)}`, "saved");
  return true;
}

function clearActiveSession(){
  state.activeSession = null;
  state.currentQuestion = null;
  state.subject = null;
  state.stageCleared = false;
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.daily3Mode = false;
  state.dungeonMap = null;
  state.currentRoomId = null;
  state.pendingRoomId = null;
  saveGameState();
  updateResumePanel();
  setManualSaveStatus("已清除進行中關卡紀錄。角色、貓貓、錯題本與背包仍保留。", "warn");
}

function updateResumePanel(){
  const panel = $("resumePanel");
  if(!panel) return;
  const live = captureActiveSession();
  if(live) state.activeSession = live;
  const session = state.activeSession;
  if(!session){
    panel.classList.add("empty");
    if($("resumeModeText")) $("resumeModeText").textContent = "沒有進行中的關卡";
    if($("resumeDetailText")) $("resumeDetailText").textContent = "選科目開始後，這裡會顯示目前模式並可一鍵返回。";
    if($("resumeBtn")) $("resumeBtn").disabled = true;
    if($("resumeClearBtn")) $("resumeClearBtn").disabled = true;
    return;
  }
  panel.classList.remove("empty");
  if($("resumeModeText")) $("resumeModeText").textContent = activeSessionModeLabel(session);
  if($("resumeDetailText")) $("resumeDetailText").textContent = activeSessionDetail(session);
  if($("resumeBtn")) $("resumeBtn").disabled = false;
  if($("resumeClearBtn")) $("resumeClearBtn").disabled = false;
}



function persistentSnapshot(){
  return {
    saveVersion: SAVE_VERSION,
    gameName: "會考貓貓冒險",
    savedFrom: location.href,
    storageKey: STORAGE_KEY,
    activeSession: captureActiveSession(),
    currentPage: state.currentPage,
    playerName: state.playerName,
    hp: state.hp,
    exp: state.exp,
    level: state.level,
    correct: state.correct,
    wrong: state.wrong,
    total: state.total,
    totalExpEarned: state.totalExpEarned,
    chests: state.chests,
    healPotion: state.healPotion,
    expPotion: state.expPotion,
    inventoryLog: state.inventoryLog,
    wrongBook: state.wrongBook,
    wrongTypeStats: state.wrongTypeStats,
    wrongBookFixStreak: state.wrongBookFixStreak,
    wrongBookFixedTotal: state.wrongBookFixedTotal,
    questStats: state.questStats,
    claimedQuests: state.claimedQuests,
    daily3Stats: state.daily3Stats,
    daily3SubjectHistory: state.daily3SubjectHistory,
    dailyMail: state.dailyMail,
    gameMode: state.gameMode,
    hiddenBossMode: state.hiddenBossMode,
    hiddenBossIndex: state.hiddenBossIndex,
    hiddenBossResult: state.hiddenBossResult,
    hiddenBossClearCount: state.hiddenBossClearCount,
    hiddenBossFirstClear: state.hiddenBossFirstClear,
    hiddenBossLastScore: state.hiddenBossLastScore,
    fragments: state.fragments,
    gachaPity: state.gachaPity,
    achievements: state.achievements,
    titles: state.titles,
    equippedTitle: state.equippedTitle,
    items: state.items,
    catShards: state.catShards,
    catSkillLevels: state.catSkillLevels,
    cat: state.cat,
    savedAt: new Date().toISOString()
  };
}

function saveGameState(){
  try{
    const data = persistentSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }catch(e){}
}

function applySaveDataToState(data){
  if(!data || typeof data !== "object") return false;
  const keepVolatile = {
    subject: null,
    currentQuestion: null,
    usedIds: new Set(),
    stageQuestionSigs: new Set(),
    answered: false,
    bossMode: false,
    bossCount: 0,
    roundCount: 0,
    battleLog: [],
    wrongBookMode: false,
    wrongBookModeSubject: null,
    mapPending: false,
    mapNodes: [],
    dungeonMap: null,
    dungeonFloor: 1,
    currentRoomId: null,
    pendingRoomId: null,
    lastMapNote: '',
    eventPending: false,
    currentEvent: null,
    counterMode: false
  };
  Object.assign(state, data, keepVolatile);
  state.usedIds = new Set();
  state.stageQuestionSigs = new Set();
  state.wrongBook = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  state.daily3Mode = !!state.daily3Mode;
  state.daily3Stats = Object.assign({ lastDate:"", streak:0, clears:0, rewardedDate:"", lastSummary:null }, state.daily3Stats || {});
  state.daily3SubjectHistory = Array.isArray(state.daily3SubjectHistory) ? state.daily3SubjectHistory : [];
  state.dailyMail = Object.assign({ lastClaimDate:"", streak:0, lastRewardText:"", lastMessage:"" }, state.dailyMail || {});
  state.hiddenBossMode = !!state.hiddenBossMode;
  state.hiddenBossIndex = state.hiddenBossIndex || 0;
  state.hiddenBossResult = state.hiddenBossResult || "";
  state.hiddenBossClearCount = state.hiddenBossClearCount || 0;
  state.hiddenBossFirstClear = !!state.hiddenBossFirstClear;
  state.hiddenBossLastScore = state.hiddenBossLastScore || null;
  state.activeSession = state.activeSession || null;
  state.currentPage = state.currentPage || "homePage";
  state.wrongTypeStats = state.wrongTypeStats && typeof state.wrongTypeStats === "object" ? state.wrongTypeStats : {};
  state.wrongBookFixStreak = state.wrongBookFixStreak || 0;
  state.wrongBookFixedTotal = state.wrongBookFixedTotal || 0;
  state.questStats = Object.assign({ answered:0, correct:0, wrong:0, boss:0, chinese:0, english:0, math:0, nature:0, society:0, feed:0, pet:0, tenpull:0, fever:0 }, state.questStats || {});
  state.items = Object.assign({ removeWrong:0, hintCard:0, shieldCard:0, feverBattery:0, bonusGuard:0, expBoost:0, hardTicket:0 }, state.items || {});
  state.cat = Object.assign({ name:"Pixel", level:1, love:0, energy:50, fish:0, unlockedSkins:["orange_tabby"], equippedSkin:"orange_tabby" }, state.cat || {});
  state.cat.unlockedSkins = Array.from(new Set(state.cat.unlockedSkins || ["orange_tabby"]));
  if(!state.cat.unlockedSkins.includes("orange_tabby")) state.cat.unlockedSkins.unshift("orange_tabby");
  state.titles = Array.from(new Set(state.titles || ["rookie"]));
  if(!state.titles.includes("rookie")) state.titles.unshift("rookie");
  state.catShards = state.catShards || {};
  state.catSkillLevels = state.catSkillLevels || {};
  state.gachaPity = Object.assign({ epic:0, ssr:0 }, state.gachaPity || {});
  sanitizeCatSkins();
  return true;
}

function loadGameState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const data = JSON.parse(raw);
    return applySaveDataToState(data);
  }catch(e){
    return false;
  }
}

function saveFileName(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const name = String(state.playerName || "player").replace(/[\\/:*?"<>|]/g,"_").slice(0,18);
  return `cyber-study-quest-save_${name}_${stamp}.json`;
}

function downloadSaveFile(data = persistentSnapshot()){
  try{
    const payload = {
      ...data,
      saveVersion: SAVE_VERSION,
      exportedAt: new Date().toISOString(),
      savedFrom: location.href,
      note: "這是會考貓貓冒險本地存檔備份。匯入同一網站即可恢復進度。"
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = saveFileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 800);
    return true;
  }catch(e){
    console.error("downloadSaveFile failed", e);
    return false;
  }
}

function triggerImportSaveFile(){
  const input = $("importSaveFileInput");
  if(input) input.click();
}

function importSaveFileFromInput(input){
  const file = input?.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(String(reader.result || "{}"));
      const ok = applySaveDataToState(data);
      if(!ok) throw new Error("bad save data");
      saveGameState();
      updateSidebar();
      updateCatUI();
      updateQuickHub();
      if(typeof renderAudioControls === "function") renderAudioControls();
      setManualSaveStatus(`已匯入備份並寫入這個網址的本機存檔：${formatSaveTime()}`, "saved");
      if($("home小喵Text")) $("home小喵Text").textContent = "小喵已匯入備份檔。之後用同一個網址、同一個瀏覽器進入，就會自動讀到這份進度。";
    }catch(e){
      console.error("import save failed", e);
      setManualSaveStatus("匯入失敗：請確認選的是本遊戲匯出的 JSON 存檔。", "warn");
    }finally{
      input.value = "";
    }
  };
  reader.onerror = () => {
    setManualSaveStatus("讀取檔案失敗，請重新選擇存檔 JSON。", "warn");
    input.value = "";
  };
  reader.readAsText(file, "utf-8");
}


function formatSaveTime(){
  try{
    return new Date().toLocaleString("zh-TW", { hour12:false });
  }catch(e){
    return new Date().toISOString();
  }
}

function setManualSaveStatus(text, cls="saved"){
  const box = $("manualSaveStatus");
  if(!box) return;
  box.textContent = text;
  box.classList.remove("saved");
  box.classList.remove("warn");
  if(cls) box.classList.add(cls);
}

function manualSaveGame(){
  const data = persistentSnapshot();
  saveGameState();
  const downloaded = downloadSaveFile(data);
  setManualSaveStatus(`${downloaded ? "已存檔並下載備份" : "已存檔，但備份下載可能被瀏覽器阻擋"}：${formatSaveTime()}`, downloaded ? "saved" : "warn");
  if($("home小喵Text")){
    $("home小喵Text").textContent = "小喵已把進度寫進這個網址的本機存檔，並下載一份 JSON 備份。之後用同一個網址與同一個瀏覽器進入，會自動讀到進度。";
  }
}

function manualLoadGame(){
  const ok = loadGameState();
  if(ok){
    updateSidebar();
    updateCatUI();
    updateQuickHub();
    setManualSaveStatus(`已讀取這個網址的本機存檔：${formatSaveTime()}`, "saved");
    if($("home小喵Text")){
      $("home小喵Text").textContent = "小喵已讀取這台電腦裡的本地存檔。";
    }
  }else{
    setManualSaveStatus("找不到這個網址的本機存檔。可先遊玩後按「存檔並下載」，或匯入備份 JSON。", "warn");
  }
}

function clearSavedGame(){
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
}

function renamePlayer(){
  const next = prompt("請輸入新的玩家名字：", state.playerName || "新手冒險者");
  if(next === null) return;
  const name = String(next).trim().slice(0, 16);
  if(!name) return;
  state.playerName = name;
  updateSidebar();
  if($("playerName")) $("playerName").textContent = state.playerName;
  saveGameState();
}

function renameCat(){
  const next = prompt("請輸入新的貓貓名字：", state.cat?.name || "Pixel");
  if(next === null) return;
  const name = String(next).trim().slice(0, 16);
  if(!name) return;
  state.cat.name = name;
  updateCatUI();
  saveGameState();
}

function maybeDropCatShard(reason="升級", loveValue=null){
  state.catShards = state.catShards || {};
  const id = state.cat?.equippedSkin || "orange_tabby";
  const rarity = SKIN_META[id]?.rarity || "COMMON";
  const baseChance = rarity === "SSR" ? 0.22 : rarity === "EPIC" ? 0.30 : rarity === "RARE" ? 0.38 : rarity === "UNCOMMON" ? 0.48 : 0.58;
  const effectiveLove = loveValue === null ? (state.cat?.love || 0) : loveValue;
  const loveBonus = Math.min(0.22, effectiveLove / 500);
  const chance = Math.min(0.78, baseChance + loveBonus);
  if(Math.random() < chance){
    const amount = rarity === "SSR" ? 1 : rarity === "EPIC" ? 1 : rarity === "RARE" ? (Math.random()<0.35?2:1) : (Math.random()<0.45?2:1);
    state.catShards[id] = (state.catShards[id] || 0) + amount;
    pushLootLog(`🐾 ${reason} 掉落：${skinName(id)} 貓貓碎片 x${amount}。`);
    return amount;
  }
  pushLootLog(`🐾 ${reason} 沒有掉落貓貓碎片。`);
  return 0;
}

function sanitizeCatSkins(){
  const valid = new Set(Object.keys(SKIN_META));
  state.cat.unlockedSkins = Array.from(new Set((state.cat.unlockedSkins || []).filter(id => valid.has(id))));
  if(!state.cat.unlockedSkins.includes("orange_tabby")) state.cat.unlockedSkins.unshift("orange_tabby");
  if(!valid.has(state.cat.equippedSkin)) state.cat.equippedSkin = "orange_tabby";
}

function $(id){ return document.getElementById(id); }

const REQUIRED_ASSETS = [
  "./assets/nova_pixel_chibi.gif",
  "./assets/start_music.mp3",
  "./assets/battle_music.mp3",
  "./assets/cat_music.mp3",
  "./assets/gacha_music.mp3",
  "./assets/hidden_boss_music.mp3",
  "./assets/cat_meow.mp3",
  "./assets/skins/orange_tabby.png",
  "./assets/bosses/chinese_boss.png",
  "./assets/bosses/hidden_calc_boss.png",
  "./assets/boss_finisher_red_bg.png",
  "./assets/boss_finisher_slash.mp3"
];

function setAssetStatus(msg, type=""){
  const box = $("assetStatusBox");
  const text = $("assetStatusText");
  if(text) text.textContent = msg;
  if(box){
    box.classList.remove("ok","warn","bad");
    if(type) box.classList.add(type);
  }
}

async function checkRequiredAssets(){
  if(location.protocol === "file:"){
    setAssetStatus("本機 file:// 模式可能限制音樂播放；GitHub Pages 上請確認 assets 資料夾有一起上傳。", "warn");
    return;
  }
  const missing = [];
  await Promise.all(REQUIRED_ASSETS.map(async (url)=>{
    try{
      const res = await fetch(url, { method:"HEAD", cache:"no-store" });
      if(!res.ok) missing.push(url);
    }catch(e){
      missing.push(url);
    }
  }));
  if(missing.length){
    setAssetStatus(`有 ${missing.length} 個資源讀不到。請確認 GitHub repo 根目錄有 assets 資料夾，大小寫完全相同，且不是只上傳 zip。`, "bad");
    console.warn("Missing game assets:", missing);
  }else{
    setAssetStatus("圖片、GIF、音樂路徑檢查正常。若音樂沒播放，請先點「開始練習」或解除瀏覽器靜音。", "ok");
  }
}


const QUICK_HUB_KEY = "CSQ_V90_QUICK_HUB_COLLAPSED";

function setQuickHubCollapsed(collapsed, persist=true){
  const hub = $("quickHub");
  const head = hub ? hub.querySelector(".quick-hub-head") : null;
  const icon = $("quickHubToggleIcon");
  if(!hub) return;
  hub.classList.toggle("collapsed", !!collapsed);
  if(head) head.setAttribute("aria-expanded", collapsed ? "false" : "true");
  if(icon) icon.textContent = collapsed ? "＋" : "－";
  if(persist){
    try{ localStorage.setItem(QUICK_HUB_KEY, collapsed ? "1" : "0"); }catch(e){}
  }
}

function toggleQuickHub(){
  const hub = $("quickHub");
  if(!hub) return;
  setQuickHubCollapsed(!hub.classList.contains("collapsed"));
}

function loadQuickHubState(){
  let collapsed = true;
  try{
    const saved = localStorage.getItem(QUICK_HUB_KEY);
    if(saved === "0") collapsed = false;
    if(saved === "1") collapsed = true;
  }catch(e){}
  setQuickHubCollapsed(collapsed, false);
}


function esc(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

function normalizeQuestionSignature(q){
  const text = String(q && q.question ? q.question : "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, "")
    .replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g, "")
    .replace(/[ABCDＡＢＣＤ][\.．、)]/g, "")
    .trim();
  const topic = String(q && q.topic ? q.topic : "").replace(/\s+/g, "");
  const subject = String(state.subject || (q && q.subject) || "");
  return `${subject}|${topic}|${text}`;
}

function markQuestionSeen(q){
  if(!state.stageQuestionSigs) state.stageQuestionSigs = new Set();
  state.stageQuestionSigs.add(normalizeQuestionSignature(q));
}

function hasQuestionSeen(q){
  if(!state.stageQuestionSigs) state.stageQuestionSigs = new Set();
  return state.stageQuestionSigs.has(normalizeQuestionSignature(q));
}

function resetStageQuestionMemory(){
  state.stageQuestionSigs = new Set();
}



function updateQuickHub(){
  const mapBtn = $("hubMapBtn");
  const hint = $("hubHint");
  if(mapBtn){
    const inStage = !!state.subject;
    mapBtn.classList.toggle("locked", !inStage);
    mapBtn.textContent = inStage ? "🗺️ 冒險地圖" : "🗺️ 進關卡後開啟";
  }
  if(hint){
    if(state.subject){
      hint.textContent = `目前關卡：${state.subject}｜可從這裡回到地圖、商店或抽卡。`;
    } else {
      hint.textContent = "先進入科目關卡，冒險地圖才會開啟。";
    }
  }
}

function openAdventureMap(){
  if(state.hiddenBossMode || state.gameMode === "hidden" || state.subject === "Newton Gate"){
    cleanupHiddenBossNavigation(true);
    showSubjects();
    if($("hubHint")) $("hubHint").textContent = "隱藏 Boss 是獨立挑戰，不連接冒險地圖。請重新選擇一般科目。";
    saveGameState();
    return;
  }
  if(!state.subject){
    showSubjects();
    if($("hubHint")) $("hubHint").textContent = "先選一個科目關卡，冒險地圖會自動彈出。";
    return;
  }
  if(state.currentQuestion && !state.answered){
    if($("feedbackArea")){
      $("feedbackArea").innerHTML = `<div class="feedback-card correct"><div class="feedback-title correct">🗺️ 地圖待命</div><p>先完成目前這題，下一步再切換冒險地圖比較安全。你也可以直接查看商店或抽卡。</p></div>`;
    }
    showPage("battlePage");
    return;
  }
  showMapPage(false);
}


function handleGachaMusicOnPageChange(pageId){
  try{
    const gacha = document.getElementById("gachaMusicAudio");
    const hidden = document.getElementById("hiddenBossMusicAudio");

    if(state.hiddenBossMode && pageId === "battlePage"){
      if(!hidden || hidden.paused) switchToHiddenBossMusic();
      return;
    }

    if(pageId === "gachaPage") return;

    const specialPlaying = (gacha && !gacha.paused) || (hidden && !hidden.paused);
    if(!specialPlaying) return;

    if(pageId === "battlePage" || pageId === "mapPage" || pageId === "buffPage"){
      switchToBattleMusic();
    }else if(pageId === "catPage"){
      switchToCatMusic();
    }else{
      switchToStartMusic();
    }
  }catch(e){}
}



function handleAdventureMusicOnPageChange(pageId){
  try{
    if(state.hiddenBossMode && pageId === "battlePage"){
      switchToHiddenBossMusic();
      return;
    }
    if((pageId === "battlePage" || pageId === "mapPage" || pageId === "buffPage") && state.subject !== "Newton Gate" && state.gameMode !== "hidden"){
      switchToBattleMusic();
    }
  }catch(e){}
}


function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(id).classList.add("active");
  state.currentPage = id;
  handleAdventureMusicOnPageChange(id);
  handleGachaMusicOnPageChange(id);
  updateSidebar();
  renderBuffHud();
  updateQuickHub();
  updateResumePanel();
  if(id === "homePage") renderDailyMailCard();
  saveGameState();
}
function goHome(){
  if(state.gameMode === "hidden" && !state.hiddenBossMode){
    cleanupHiddenBossNavigation(true);
  }
  switchToStartMusic();
  showPage("homePage");
}

function setGameMode(mode){
  state.gameMode = mode === "endless" ? "endless" : "chapter";
  updateModeUI();
  updateQuickHub();
  saveGameState();
}


function updateSubjectModeButtons(){
  const buttons = document.querySelectorAll ? document.querySelectorAll(".subject-start-btn") : [];
  buttons.forEach(btn => {
    const subject = btn.getAttribute("data-subject") || "";
    if(state.gameMode === "endless"){
      btn.className = "primary-btn subject-start-btn endless";
      btn.textContent = `♾️ 開始${subject}無盡挑戰`;
      btn.setAttribute("aria-label", `開始${subject}無盡挑戰`);
    } else {
      btn.className = "primary-btn subject-start-btn chapter";
      btn.textContent = `📘 開始${subject}10題挑戰`;
      btn.setAttribute("aria-label", `開始${subject}10題挑戰`);
    }
  });

  const badges = document.querySelectorAll ? document.querySelectorAll(".subject-mode-badge") : [];
  badges.forEach(badge => {
    badge.textContent = state.gameMode === "endless" ? "目前套用：無盡模式" : "目前套用：10題章節模式";
    badge.className = state.gameMode === "endless" ? "subject-mode-badge endless" : "subject-mode-badge chapter";
  });
}

function updateModeUI(){
  const c = $("modeChapterBtn"), e = $("modeEndlessBtn"), d = $("modeDescription");
  if(c && e){
    if(state.gameMode === "chapter"){
      c.className = "primary-btn";
      e.className = "secondary-btn";
    } else {
      c.className = "secondary-btn";
      e.className = "primary-btn";
    }
  }
  if(d){
    d.textContent = state.gameMode === "chapter"
      ? "目前模式：10題章節模式｜下面所有科目的開始按鈕都已切換為 10 題挑戰。"
      : "目前模式：無盡模式｜下面所有科目的開始按鈕都已切換為無盡挑戰。";
  }
  updateSubjectModeButtons();
}


function subjectMeta(){
  if(state.hiddenBossMode || state.gameMode === "hidden" || state.subject === "Newton Gate"){
    return {
      icon:"∂",
      monster:"國立彰化師範大學 陳明飛校長",
      color:"#ef4444",
      desc:"獨立隱藏挑戰，不列入一般數學題庫與錯題本分析。"
    };
  }
  if(state.daily3Mode || state.gameMode === "daily3"){
    return { icon:"🌙", monster:"放鬆小怪", color:"#38bdf8", desc:"低壓 3 題挑戰，不扣 HP、不進錯題本，完成拿今日小獎勵。" };
  }
  return SUBJECT_META[state.subject] || { icon:"❔", monster:"未知挑戰", color:"#94a3b8", desc:"" };
}

function updateSidebar(){
  $("sidePlayerName").textContent = state.playerName;
  if($("sideTitleName")) $("sideTitleName").textContent = titleMeta().name;
  if($("sideCatName")) $("sideCatName").textContent = state.cat?.name || "Pixel";
  $("sideLevel").textContent = state.level;
  $("sideHpText").textContent = `${state.hp}/100`;
  $("sideExpText").textContent = `${state.exp}/${expToNext()}`;
  $("sideHpBar").style.width = `${Math.max(0,state.hp)}%`;
  $("sideExpBar").style.width = `${Math.min(100,state.exp/expToNext()*100)}%`;
  if($("sideCatLevel")) $("sideCatLevel").textContent = state.cat.level;
  if($("sideFish")) $("sideFish").textContent = state.cat.fish;
  if($("sideChestCount")) $("sideChestCount").textContent = state.chests;
  if($("sideHealPotion")) $("sideHealPotion").textContent = state.healPotion;
  if($("sideExpPotion")) $("sideExpPotion").textContent = state.expPotion;
  if($("sideEquippedSkin")) $("sideEquippedSkin").textContent = skinName(state.cat.equippedSkin);
  if($("battleHealPotion")) $("battleHealPotion").textContent = state.healPotion;
  if($("battleExpPotion")) $("battleExpPotion").textContent = state.expPotion;
  ensureItems();
  if($("battleRemoveWrong")) $("battleRemoveWrong").textContent = state.items.removeWrong || 0;
  if($("battleHintCard")) $("battleHintCard").textContent = state.items.hintCard || 0;
  if($("battleShieldCard")) $("battleShieldCard").textContent = state.items.shieldCard || 0;
  if($("battleFeverBattery")) $("battleFeverBattery").textContent = state.items.feverBattery || 0;
  if($("battleBonusGuard")) $("battleBonusGuard").textContent = state.items.bonusGuard || 0;
  if($("battleExpBoost")) $("battleExpBoost").textContent = state.items.expBoost || 0;
  if($("battleHardTicket")) $("battleHardTicket").textContent = state.items.hardTicket || 0;
  if($("battleItemTotal")){
    const itemTotal = (state.healPotion||0) + (state.expPotion||0) + Object.values(state.items || {}).reduce((a,b)=>a+(Number(b)||0),0);
    $("battleItemTotal").textContent = itemTotal;
  }
  if($("reportChestCount")) $("reportChestCount").textContent = state.chests;
  if($("reportHealCount")) $("reportHealCount").textContent = state.healPotion;
  if($("reportExpCount")) $("reportExpCount").textContent = state.expPotion;
  if($("catChestCount")) $("catChestCount").textContent = state.chests;
  if($("catHealPotion")) $("catHealPotion").textContent = state.healPotion;
  if($("catExpPotion")) $("catExpPotion").textContent = state.expPotion;
  if($("reportMode")) $("reportMode").textContent = modeLabel(state.gameMode);
  if($("questLevel")) $("questLevel").textContent = state.level;
  if($("questExp")) $("questExp").textContent = `${state.exp}/${expToNext()}`;
  if($("questChestCount")) $("questChestCount").textContent = state.chests;
  if($("questCompleteCount")) $("questCompleteCount").textContent = `${(state.claimedQuests || []).length}/${(typeof QUESTS !== "undefined" ? QUESTS.length : 0)}`;
  if($("gachaChestCount")) $("gachaChestCount").textContent = state.chests;
  if($("gachaFragmentCount")) $("gachaFragmentCount").textContent = `${state.fragments || 0}/10`;
  if($("gachaEpicPity")) $("gachaEpicPity").textContent = `${state.gachaPity?.epic || 0}/30`;
  if($("gachaSsrPity")) $("gachaSsrPity").textContent = `${state.gachaPity?.ssr || 0}/80`;
  if($("equippedTitleName")) $("equippedTitleName").textContent = titleMeta().name;
  if($("titleEffectText")) $("titleEffectText").textContent = `效果：${titleMeta().effectText}`;
  if($("gachaEquippedName")) $("gachaEquippedName").textContent = skinName(state.cat.equippedSkin);
  if($("gachaEquippedRarity")) $("gachaEquippedRarity").textContent = currentSkin().rarity;
  if($("gachaEquippedEffect")) $("gachaEquippedEffect").textContent = `效果：${currentEffectText()}`;
  if($("gachaEquippedCat")) $("gachaEquippedCat").src = currentSkin().src;
  renderCatSkillPanel();
  syncCatDisplay();
  updateModeUI();
  updateQuickHub();
  updateResumePanel();
  saveGameState();
}

function resetAll(){
  clearSavedGame();
  state.hp=100 + Math.round(titleBonus("startHp") || 0); state.exp=0; state.level=1; state.subject=null; state.difficulty="easy";
  state.monsterHp=120; state.monsterMaxHp=120; state.correct=0; state.wrong=0; state.total=0; state.roundCount=0; state.bossCount=0;
  state.bossMode=false; state.currentPage="homePage"; state.activeSession=null; state.correctStreak=0; state.wrongStreak=0; state.totalExpEarned=0;
  state.answered=false; state.battleLog=[]; state.wrongBook=[];
  state.eventPending=false; state.eventCounter=0; state.counterMode=false; state.usedIds = new Set(); state.stageQuestionSigs = new Set();
  state.chests = 0; state.healPotion = 0; state.expPotion = 0; state.inventoryLog = [];
  state.fragments = 0; state.gachaPity = {epic:0, ssr:0}; state.achievements = {}; state.titles = ["rookie"]; state.equippedTitle = "rookie"; state.eventPending=false; state.eventCounter=0; state.counterMode=false;
  state.items = { removeWrong:0, hintCard:0, shieldCard:0, feverBattery:0, bonusGuard:0, expBoost:0, hardTicket:0 }; state.activeShield=false; state.activeBonusGuard=false; state.activeExpBoost=false; state.catShards={}; state.catSkillLevels={}; state.mapPending=false; state.mapCooldownRound=-1; state.mapNodes=[]; state.dungeonFloor=1; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null; state.lastMapNote='';
  state.questStats = { answered: 0, correct: 0, wrong: 0, boss: 0, chinese: 0, english: 0, math: 0, nature: 0, society: 0, feed: 0, pet: 0, tenpull: 0 };
  state.claimedQuests = [];
  state.gameMode = "chapter"; state.stageCleared = false; state.rogueBuffs = {}; state.roguePending = false; state.correctSinceBuff = 0; resetBonusFever(); resetBonusFever();
  state.cat={name: state.cat?.name || "Pixel",level:1,love:0,energy:50,fish:0, unlockedSkins:["orange_tabby"], equippedSkin:"orange_tabby"};
  const f=$("feedbackArea"); if(f) f.innerHTML="";
  updateCatUI(); updateSidebar(); goHome();
}



const ROGUE_BUFFS = [
  { id:"sharpClaws", icon:"🗡️", title:"銳爪演算法", desc:"答對造成的怪物傷害 +15%。可疊加。", type:"damage", value:0.15 },
  { id:"studyCore", icon:"📘", title:"學習核心增幅", desc:"答對獲得 EXP +12%。無盡模式越疊越強。", type:"exp", value:0.12 },
  { id:"fishFinder", icon:"🐟", title:"小魚乾雷達", desc:"答對獲得的小魚乾 +1。", type:"fishFlat", value:1 },
  { id:"shieldPatch", icon:"🛡️", title:"錯題護盾", desc:"答錯受到的傷害 -15%。可疊加。", type:"wrongDamageReduce", value:0.15 },
  { id:"bossBreaker", icon:"👑", title:"Boss 破甲晶片", desc:"Boss 題答對傷害 +25%，Boss 題 EXP +10%。", type:"bossBoost", value:0.25 },
  { id:"luckyChest", icon:"🎁", title:"寶箱嗅覺", desc:"每次擊破 Boss 額外寶箱機率 +15%。", type:"extraChestChance", value:0.15 },
  { id:"catBond", icon:"🐱", title:"貓貓同步", desc:"答對時 Pixel 親密度額外 +3。", type:"catLoveFlat", value:3 },
  { id:"hardScholar", icon:"🧠", title:"困難題學霸模式", desc:"普通/困難題答對 EXP +18%。", type:"normalHardExp", value:0.18 },
  { id:"healProtocol", icon:"💊", title:"自動修復協議", desc:"每答對 3 題，額外回復 HP +4。", type:"healEvery3Correct", value:4 }
];

function buffLevel(id){ if(!state.rogueBuffs) state.rogueBuffs = {}; return state.rogueBuffs[id] || 0; }
function buffBonus(type){
  return ROGUE_BUFFS
    .filter(b => b.type === type)
    .reduce((sum,b) => sum + buffLevel(b.id) * b.value, 0);
}
function buffFlat(type){
  return ROGUE_BUFFS
    .filter(b => b.type === type)
    .reduce((sum,b) => sum + buffLevel(b.id) * b.value, 0);
}

function bonusMultiplier(){
  const combo = state.bonusCombo || 0;
  if(combo <= 1) return 1;
  return Math.min(1.5, 1 + Math.min(combo - 1, 10) * 0.05);
}

function gainFever(amount){
  if(!state.feverActive){
    state.feverGauge = Math.min(100, (state.feverGauge || 0) + amount);
    if(state.feverGauge >= 100){
      state.feverGauge = 0;
      state.feverActive = true;
      state.feverTurns = 5;
      bumpQuest("fever");
      state.battleLog.unshift("⚡ FEVER 啟動！接下來 5 次答題，傷害與 EXP 大幅提升。");
    }
  }
}

function tickFever(){
  if(state.feverActive){
    state.feverTurns--;
    if(state.feverTurns <= 0){
      state.feverTurns = 0;
      state.feverActive = false;
      state.battleLog.unshift("⚡ FEVER 結束。重新累積能量。");
    }
  }
}

function resetBonusFever(){
  state.bonusCombo = 0;
  state.feverGauge = 0;
  state.feverActive = false;
  state.feverTurns = 0;
}

function renderBonusFever(){
  const bonus = $("bonusText"), fever = $("feverText"), bar = $("feverBar"), status = $("feverStatus");
  if(bonus) bonus.textContent = `Combo ${state.bonusCombo || 0}｜x${bonusMultiplier().toFixed(2)}`;
  if(fever) fever.textContent = state.feverActive ? `FEVER ${state.feverTurns} turns` : `${state.feverGauge || 0}/100`;
  if(bar) bar.style.width = state.feverActive ? "100%" : `${state.feverGauge || 0}%`;
  if(status){
    if(state.feverActive){
      status.textContent = "FEVER 中：傷害與 EXP +50%，答題節奏正在暴走。";
      status.classList.add("active");
    } else if((state.bonusCombo || 0) >= 3){
      status.textContent = "BONUS 連段中：連續答對越多，EXP 與傷害越高。";
      status.classList.remove("active");
    } else {
      status.textContent = "連續答對可累積 Bonus，答對也會累積 Fever。";
      status.classList.remove("active");
    }
  }
}

function activeBuffText(){
  const arr = ROGUE_BUFFS.filter(b => buffLevel(b.id)>0).map(b => `${b.icon} ${b.title} Lv.${buffLevel(b.id)}`);
  return arr.length ? arr : ["尚未取得助益"];
}
function shouldOfferBuff(){
  const need = state.gameMode === "endless" ? 3 : 4;
  return state.correctSinceBuff >= need && !state.roguePending && state.hp > 0;
}
function pickBuffChoices(){
  const pool = ROGUE_BUFFS.slice();
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [pool[i],pool[j]]=[pool[j],pool[i]];
  }
  // Prefer not showing three already-high-level buffs together.
  return pool.sort((a,b)=>buffLevel(a.id)-buffLevel(b.id)).slice(0,3);
}
function renderBuffHud(){
  const box = $("buffHud");
  if(!box) return;
  const texts = activeBuffText();
  box.innerHTML = texts.map(t => `<div class="buff-chip"><strong>${esc(t)}</strong></div>`).join("");
}
function showBuffChoice(nextAction="next"){
  state.roguePending = true;
  state.rogueNextAction = nextAction;
  const grid = $("buffChoiceGrid");
  if(!grid){ state.roguePending=false; return nextAction==="report" ? showReport() : goNext(); }
  if(grid){
    const choices = pickBuffChoices();
    grid.innerHTML = choices.map(b => `
      <div class="buff-card">
        <div>
          <div class="buff-icon">${b.icon}</div>
          <div class="buff-title">${esc(b.title)}</div>
          <div class="buff-desc">${esc(b.desc)}</div>
          <div class="buff-meta">目前 Lv.${buffLevel(b.id)} → Lv.${buffLevel(b.id)+1}</div>
        </div>
        <button class="primary-btn" onclick="chooseBuff('${b.id}')">選擇這個助益</button>
      </div>
    `).join("");
  }
  showPage("buffPage");
}
function chooseBuff(id){
  state.rogueBuffs[id] = (state.rogueBuffs[id] || 0) + 1;
  state.correctSinceBuff = 0;
  state.roguePending = false;
  const buff = ROGUE_BUFFS.find(b=>b.id===id);
  state.battleLog.unshift(`✨ 取得助益：${buff?.title || id} Lv.${buffLevel(id)}。`);
  if(state.rogueNextAction === "report") return showReport();
  if(state.dungeonMap){
    state.lastMapNote = `已取得助益：${buff?.title || id}。請選擇下一個房間。`;
    return showMapPage(false);
  }
  nextAdaptiveQuestion();
  $("feedbackArea").innerHTML="";
  renderBattle();
  showPage("battlePage");
}

const QUESTS = [
  { id: "answer10", title: "初級駭客訓練", desc: "累積回答 10 題", key: "answered", target: 10, reward: { exp: 35 } },
  { id: "correct7", title: "穩定破解", desc: "累積答對 7 題", key: "correct", target: 7, reward: { exp: 45 } },
  { id: "boss1", title: "核心 Boss 擊破", desc: "擊破 1 隻 Boss", key: "boss", target: 1, reward: { exp: 60, chest: 1 } },
  { id: "chinese5", title: "國文語感同步", desc: "完成 5 題國文", key: "chinese", target: 5, reward: { exp: 35 } },
  { id: "english5", title: "英文語境掃描", desc: "完成 5 題英文", key: "english", target: 5, reward: { exp: 35 } },
  { id: "math5", title: "數學建模啟動", desc: "完成 5 題數學", key: "math", target: 5, reward: { exp: 35 } },
  { id: "nature5", title: "自然實驗紀錄", desc: "完成 5 題自然", key: "nature", target: 5, reward: { exp: 35 } },
  { id: "society5", title: "社會判讀任務", desc: "完成 5 題社會", key: "society", target: 5, reward: { exp: 35 } },
  { id: "feed3", title: "Pixel 補給員", desc: "餵食 Pixel 3 次", key: "feed", target: 3, reward: { exp: 25, fish: 5 } },
  { id: "tenpull1", title: "第一次十連抽", desc: "完成 1 次十連抽", key: "tenpull", target: 1, reward: { exp: 40, potion: 1 } }
];

function rewardText(r){
  const arr = [];
  if(r.exp) arr.push(`EXP +${r.exp}`);
  if(r.chest) arr.push(`寶箱 +${r.chest}`);
  if(r.potion) arr.push(`升級藥水 +${r.potion}`);
  if(r.heal) arr.push(`回復藥水 +${r.heal}`);
  if(r.fish) arr.push(`小魚乾 +${r.fish}`);
  return arr.join("｜");
}
function applyQuestReward(reward){
  if(reward.exp) addExp(reward.exp);
  if(reward.chest) state.chests += reward.chest;
  if(reward.potion) state.expPotion += reward.potion;
  if(reward.heal) state.healPotion += reward.heal;
  if(reward.fish) state.cat.fish += reward.fish;
}
function claimQuest(id){
  const quest = QUESTS.find(q => q.id === id);
  if(!quest || state.claimedQuests.includes(id)) return;
  const progress = Math.min(questValue(quest.key), quest.target);
  if(progress < quest.target) return;
  state.claimedQuests.push(id);
  applyQuestReward(quest.reward);
  playQuestRewardSfx();
  pushLootLog(`📜 任務完成：${quest.title}，獲得 ${rewardText(quest.reward)}。`);
  renderQuestPage();
  updateSidebar();
}
function renderQuestPage(){
  const box = $("questList");
  if(!box) return;
  box.innerHTML = QUESTS.map(quest => {
    const value = Math.min(questValue(quest.key), quest.target);
    const done = value >= quest.target;
    const claimed = state.claimedQuests.includes(quest.id);
    const pct = Math.min(100, value / quest.target * 100);
    return `<div class="quest-card ${done ? "done" : ""} ${claimed ? "claimed" : ""}">
      <div class="quest-head">
        <div><div class="quest-title">${esc(quest.title)}</div><div class="muted small">${esc(quest.desc)}</div></div>
        <div class="quest-reward">${esc(rewardText(quest.reward))}</div>
      </div>
      <div class="quest-progress"><div class="bar-label">${value}/${quest.target}</div><div class="quest-progressbar"><div style="width:${pct}%"></div></div></div>
      <button class="${done && !claimed ? "primary-btn" : "secondary-btn"}" ${done && !claimed ? "" : "disabled"} onclick="claimQuest('${quest.id}')">${claimed ? "已領取" : done ? "領取獎勵" : "尚未完成"}</button>
    </div>`;
  }).join("");
  updateSidebar();
}
function showQuestPage(){ renderQuestPage(); updateSidebar(); showPage("questPage"); }
function showGachaPage(){ switchToGachaMusic(); renderGachaPage(); showPage("gachaPage"); }


function showSubjects(){
  renderSubjects();
  updateModeUI();
  showPage("subjectPage");
}

function renderSubjects(){
  const grid = $("subjectGrid");
  grid.innerHTML="";
  Object.entries(SUBJECT_META).forEach(([subject, meta])=>{
    const counts = QUESTION_BANK[subject];
    const card=document.createElement("div");
    card.className="subject-card";
    card.innerHTML=`
      <div>
        <div class="subject-icon">${meta.icon}</div>
        <h2>${subject}</h2>
        <div class="monster-name">${meta.monster}</div>
        <p class="muted">${meta.desc}</p>
        <p class="muted small">練習題會依章節節奏出現，選項會盡量貼合題幹，不走一眼答案。</p>
        <p class="muted small">章節模式：10 題後進 Boss；無盡模式：Boss 後繼續挑戰。</p>
      </div>
      <div class="subject-actions single">
        <div class="subject-mode-badge ${state.gameMode === "endless" ? "endless" : "chapter"}">${state.gameMode === "endless" ? "目前套用：無盡模式" : "目前套用：10題章節模式"}</div>
        <button class="primary-btn subject-start-btn ${state.gameMode === "endless" ? "endless" : "chapter"}" data-subject="${subject}" onclick="startBattle('${subject}')">
          ${state.gameMode === "endless" ? `♾️ 開始${subject}無盡挑戰` : `📘 開始${subject}10題挑戰`}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
  updateSubjectModeButtons();
}


function wrongRecordKey(q){
  const base = q?.capId || q?.id || "";
  if(base && !String(base).startsWith("WRONGBOOK-") && !String(base).startsWith("PRACTICE-") && !String(base).startsWith("OFFLINE-PRACTICE-")) return String(base);
  return normalizeQuestionSignature(q || {});
}


function wrongTypeKeyFrom(q){
  const subject = q?.subject || state.subject || "未分類";
  const topic = q?.topic || q?.wrongBookSourceTopic || "未分類題型";
  return `${subject}｜${topic}`;
}

function wrongTypeParts(key){
  const raw = String(key || "未分類｜未分類題型");
  const parts = raw.split("｜");
  return { subject: parts[0] || "未分類", topic: parts.slice(1).join("｜") || "未分類題型" };
}

function shortWrongTypeLabel(key, max=10){
  const p = wrongTypeParts(key);
  const t = p.topic.length > max ? p.topic.slice(0, max) + "…" : p.topic;
  return `${p.subject}\\n${t}`;
}

function recordWrongTypeStat(q){
  state.wrongTypeStats = state.wrongTypeStats && typeof state.wrongTypeStats === "object" ? state.wrongTypeStats : {};
  const key = wrongTypeKeyFrom(q);
  const p = wrongTypeParts(key);
  const current = state.wrongTypeStats[key] || { subject:p.subject, topic:p.topic, count:0, corrected:0, lastMissedAt:0, lastCorrectedAt:0 };
  current.subject = p.subject;
  current.topic = p.topic;
  current.count = (current.count || 0) + 1;
  current.lastMissedAt = Date.now();
  state.wrongTypeStats[key] = current;
  return current;
}

function recordWrongTypeCorrection(q){
  state.wrongTypeStats = state.wrongTypeStats && typeof state.wrongTypeStats === "object" ? state.wrongTypeStats : {};
  const key = wrongTypeKeyFrom(q);
  const p = wrongTypeParts(key);
  const current = state.wrongTypeStats[key] || { subject:p.subject, topic:p.topic, count:0, corrected:0, lastMissedAt:0, lastCorrectedAt:0 };
  current.corrected = (current.corrected || 0) + 1;
  current.lastCorrectedAt = Date.now();
  state.wrongTypeStats[key] = current;
  return current;
}

function wrongTypeEntries(limit=null){
  const stats = state.wrongTypeStats && typeof state.wrongTypeStats === "object" ? state.wrongTypeStats : {};
  const entries = Object.entries(stats).map(([key,v]) => ({
    key,
    subject: v.subject || wrongTypeParts(key).subject,
    topic: v.topic || wrongTypeParts(key).topic,
    count: Number(v.count || 0),
    corrected: Number(v.corrected || 0),
    remaining: wrongBookRecords(null, key).length
  })).filter(x => x.count > 0).sort((a,b)=>(b.count-b.corrected*0.05) - (a.count-a.corrected*0.05));
  return limit ? entries.slice(0, limit) : entries;
}

function wrongTypeRadarHTML(){
  let entries = wrongTypeEntries(6);
  if(!entries.length){
    const topicCounts = {};
    (state.wrongBook || []).forEach(x=>{
      const key = wrongTypeKeyFrom(x);
      topicCounts[key] = (topicCounts[key] || 0) + (x.wrongCount || 1);
    });
    entries = Object.entries(topicCounts).map(([key,count])=>({ key, ...wrongTypeParts(key), count, corrected:0, remaining: wrongBookRecords(null,key).length })).sort((a,b)=>b.count-a.count).slice(0,6);
  }
  if(!entries.length){
    return `<div class="empty-note">目前還沒有足夠資料繪製雷達圖。答錯幾題後，這裡會顯示常出錯的題型。</div>`;
  }
  while(entries.length < 3){
    entries.push({ key:`補足${entries.length}`, subject:"-", topic:"-", count:0, corrected:0, remaining:0 });
  }
  const max = Math.max(1, ...entries.map(e=>e.count));
  const cx = 160, cy = 150, r = 92;
  const axes = entries.map((e,i)=>{
    const ang = -Math.PI/2 + (Math.PI*2*i/entries.length);
    return { e, x:cx+Math.cos(ang)*r, y:cy+Math.sin(ang)*r, ax:cx+Math.cos(ang)*(r+24), ay:cy+Math.sin(ang)*(r+24), ang };
  });
  const poly = axes.map(a=>{
    const rr = r * (a.e.count / max);
    return `${cx+Math.cos(a.ang)*rr},${cy+Math.sin(a.ang)*rr}`;
  }).join(" ");
  const grid = [0.33,0.66,1].map(k=>{
    const pts = axes.map(a=>`${cx+Math.cos(a.ang)*r*k},${cy+Math.sin(a.ang)*r*k}`).join(" ");
    return `<polygon points="${pts}" class="radar-grid"></polygon>`;
  }).join("");
  const axisLines = axes.map(a=>`<line x1="${cx}" y1="${cy}" x2="${a.x}" y2="${a.y}" class="radar-axis"></line>`).join("");
  const labels = axes.map(a=>{
    const label = shortWrongTypeLabel(a.e.key).split("\\n");
    const anchor = a.ax < cx-10 ? "end" : (a.ax > cx+10 ? "start" : "middle");
    return `<text x="${a.ax}" y="${a.ay}" text-anchor="${anchor}" class="radar-label"><tspan x="${a.ax}" dy="0">${esc(label[0])}</tspan><tspan x="${a.ax}" dy="14">${esc(label[1] || "")}</tspan><tspan x="${a.ax}" dy="14">錯 ${a.e.count}</tspan></text>`;
  }).join("");
  const points = axes.map(a=>{
    const rr = r * (a.e.count / max);
    return `<circle cx="${cx+Math.cos(a.ang)*rr}" cy="${cy+Math.sin(a.ang)*rr}" r="4" class="radar-point"></circle>`;
  }).join("");
  const list = entries.filter(e=>e.count>0).map(e=>`<button class="wrong-topic-chip clickable" onclick="startWrongBookModeByType('${encodeURIComponent(e.key)}')"><span>${esc(e.subject)}｜${esc(e.topic)}</span><strong>${e.count}</strong></button>`).join("");
  return `
    <div class="wrong-radar-wrap">
      <svg viewBox="0 0 320 300" class="wrong-radar-svg" role="img" aria-label="常出錯題型雷達圖">
        ${grid}${axisLines}
        <polygon points="${poly}" class="radar-area"></polygon>
        ${points}${labels}
      </svg>
      <div class="wrong-radar-side">
        <div class="radar-title">常出錯類型 TOP ${entries.filter(e=>e.count>0).length}</div>
        <div class="muted small">雷達圖依歷史答錯次數統計；即使題目已修正，也會保留為弱點分析。</div>
        <div class="wrong-topic-list">${list}</div>
      </div>
    </div>
  `;
}

function wrongBookFilterRecords(subject=null, typeKey=null){
  const list = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  return list.filter(x => {
    const okSubject = subject ? ((x.subject || state.subject) === subject) : true;
    const okType = typeKey ? (wrongTypeKeyFrom(x) === typeKey) : true;
    return okSubject && okType;
  });
}


function addWrongBookRecord(q, studentAnswer){
  if(!q) return null;
  recordWrongTypeStat(q);
  state.wrongBook = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  const key = wrongRecordKey(q);
  const record = {
    ...q,
    wrongKey: key,
    originalId: q.capId || q.id || key,
    subject: q.subject || state.subject,
    topic: q.topic || "未分類題型",
    difficulty: q.difficulty || state.difficulty,
    studentAnswer,
    missedAt: Date.now(),
    wrongCount: 1
  };
  const idx = state.wrongBook.findIndex(x => (x.wrongKey || wrongRecordKey(x)) === key);
  if(idx >= 0){
    state.wrongBook[idx] = { ...state.wrongBook[idx], ...record, wrongCount: (state.wrongBook[idx].wrongCount || 1) + 1 };
    return state.wrongBook[idx];
  }
  state.wrongBook.push(record);
  if(state.wrongBook.length > 120) state.wrongBook = state.wrongBook.slice(-120);
  return record;
}

function removeWrongBookRecordByKey(key){
  state.wrongBook = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  const idx = state.wrongBook.findIndex(x => (x.wrongKey || wrongRecordKey(x)) === key);
  if(idx >= 0){
    const [removed] = state.wrongBook.splice(idx, 1);
    return removed;
  }
  return null;
}

function wrongBookRecords(subject=null, typeKey=null){
  return wrongBookFilterRecords(subject, typeKey);
}

function wrongBookStatsHTML(){
  const list = wrongBookRecords();
  const subjectCounts = {};
  const topicCounts = {};
  list.forEach(x=>{
    const s = x.subject || "未分類";
    const t = wrongTypeKeyFrom(x);
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  });
  const subjectButtons = Object.entries(subjectCounts).map(([s,c])=>`<button class="wrongbook-pill" onclick="startWrongBookMode('${esc(s)}')"><span>${esc(s)}</span><strong>${c}</strong></button>`).join("");
  const topics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([t,c])=>{
    const p = wrongTypeParts(t);
    return `<button class="wrong-topic-chip clickable" onclick="startWrongBookModeByType('${encodeURIComponent(t)}')"><span>${esc(p.subject)}｜${esc(p.topic)}</span><strong>${c}</strong></button>`;
  }).join("");

  if(!list.length){
    return `
      <div class="wrongbook-empty-clean">
        <div class="wrongbook-empty-icon">✨</div>
        <h3>目前沒有待修正錯題</h3>
        <p class="muted">答題時答錯的題型會自動加入這裡。之後可以用雷達圖快速修正弱點。</p>
        <div class="wrongbook-actions centered">
          <button class="primary-btn" onclick="showSubjects()">去選科目練習</button>
          <button class="secondary-btn" onclick="goHome()">回主頁</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="wrongbook-overview">
      <div class="wrongbook-stat-card"><span>待修正錯題</span><strong>${list.length}</strong></div>
      <div class="wrongbook-stat-card"><span>連續修正</span><strong>${state.wrongBookFixStreak || 0}/5</strong></div>
      <div class="wrongbook-stat-card"><span>已修正</span><strong>${state.wrongBookFixedTotal || 0}</strong></div>
      <div class="wrongbook-stat-card"><span>錯誤類型</span><strong>${wrongTypeEntries().length}</strong></div>
    </div>

    <div class="wrongbook-main-grid">
      <div class="wrong-analysis-card radar-panel-clean">
        ${wrongTypeRadarHTML()}
      </div>
      <div class="wrongbook-start-panel">
        <h3>開始修正</h3>
        <p class="muted small">直接進入錯題本模式，或點下方科目 / 類型進行針對性修正。</p>
        <button class="primary-btn full-width" onclick="startWrongBookMode()">開始全部錯題</button>
        <div class="wrongbook-pill-grid">${subjectButtons}</div>
        <div class="wrongbook-type-title">常錯類型</div>
        <div class="wrong-topic-list compact-list">${topics}</div>
      </div>
    </div>
  `;
}


function wrongBookCompletionHTML(){
  return `
    <div class="wrongbook-finished">
      <div class="finish-icon">✅</div>
      <h2>錯題本本輪修正完成</h2>
      <p class="muted">目前篩選範圍的錯題已經打完。錯題數已更新，接下來可以進入結算或回主頁。</p>
      <div class="wrongbook-actions">
        <button class="primary-btn" onclick="showReport()">查看結算</button>
        <button class="secondary-btn" onclick="goHome()">回主頁</button>
        <button class="secondary-btn" onclick="showSubjects()">選科目</button>
      </div>
      <div class="wrong-analysis-card">
        <h3>📊 常出錯類型分析</h3>
        ${wrongTypeRadarHTML()}
      </div>
    </div>
  `;
}

function renderWrongBookPage(completed=false){
  if($("wrongBookContent")) $("wrongBookContent").innerHTML = completed ? wrongBookCompletionHTML() : wrongBookStatsHTML();
  showPage("wrongBookPage");
}

function showWrongBookPage(){
  renderWrongBookPage();
}


function startWrongBookModeByType(encodedKey){
  const key = decodeURIComponent(encodedKey);
  const p = wrongTypeParts(key);
  return startWrongBookMode(p.subject, key);
}

function weakPracticeSourceFromKey(key){
  const p = wrongTypeParts(key);
  const existing = wrongBookRecords(p.subject, key)[0];
  if(existing) return existing;
  return {
    id: "WEAK-TYPE-SOURCE-" + key,
    subject: p.subject,
    topic: p.topic,
    difficulty: state.difficulty || "easy",
    question: "",
    choices: [],
    answer: "",
    explanation: ""
  };
}

function nextWeakTypePracticeQuestion(){
  const key = state.weakPracticeTypeKey;
  if(!key) return showWrongBookPage();
  const source = weakPracticeSourceFromKey(key);
  state.subject = source.subject || state.subject || "國文";
  const q = offlineSimilarQuestion(source);
  state.currentQuestion = {
    ...q,
    id: "WEAKTYPE-" + Date.now() + "-" + Math.floor(Math.random()*10000),
    subject: source.subject,
    topic: source.topic,
    difficulty: q.difficulty || source.difficulty || "easy",
    weakPracticeMode: true
  };
  state.bossMode = false;
  state.answered = false;
  state.weakPracticeMode = true;
  if(Array.isArray(state.currentQuestion.choices)){
    state.currentQuestion.choices = state.currentQuestion.choices.slice().sort(()=>Math.random()-0.5);
  }
  $("feedbackArea").innerHTML = "";
  renderBattle();
  showPage("battlePage");
}

function startWeakTypePractice(encodedKey){
  const key = decodeURIComponent(encodedKey);
  const p = wrongTypeParts(key);
  switchToBattleMusic();
  state.gameMode = "wrongbook";
  state.subject = p.subject || state.subject || "國文";
  state.weakPracticeMode = true;
  state.weakPracticeTypeKey = key;
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.wrongBookModeTypeKey = null;
  state.stageCleared = false;
  state.hp = Math.max(30, state.hp || 100);
  state.monsterMaxHp = 120;
  state.monsterHp = 120;
  state.correct = 0;
  state.wrong = 0;
  state.total = 0;
  state.roundCount = 0;
  state.bossCount = 0;
  state.bossMode = false;
  state.correctStreak = 0;
  state.wrongStreak = 0;
  state.totalExpEarned = 0;
  state.answered = false;
  state.battleLog = [`📊 常錯類型加練啟動：${p.subject}｜${p.topic}。`];
  state.mapPending=false; state.mapNodes=[]; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null;
  nextWeakTypePracticeQuestion();
}


function buildWrongBookQuestion(record){
  const previousSubject = state.subject;
  state.subject = record.subject || state.subject || "國文";
  const q = offlineSimilarQuestion(record);
  state.subject = previousSubject || state.subject;
  return {
    ...q,
    id: "WRONGBOOK-" + Date.now() + "-" + Math.floor(Math.random()*10000),
    subject: record.subject || q.subject || state.subject,
    topic: record.topic || q.topic || "錯題本題型",
    difficulty: record.difficulty || q.difficulty || state.difficulty || "easy",
    wrongBookSourceKey: record.wrongKey || wrongRecordKey(record),
    wrongBookSourceTopic: record.topic || q.topic || "錯題本題型",
    wrongBookMode: true
  };
}

function nextWrongBookQuestion(){
  const records = wrongBookRecords(state.wrongBookModeSubject, state.wrongBookModeTypeKey);
  if(!records.length){
    state.wrongBookMode = false;
    state.wrongBookModeSubject = null;
    state.wrongBookModeTypeKey = null;
    state.weakPracticeMode = false;
    state.weakPracticeTypeKey = null;
    state.stageCleared = true;
    state.battleLog.unshift("📘 錯題本已清空，這輪修正完成。");
    return showReport();
  }
  const record = records[Math.floor(Math.random()*records.length)];
  const q = buildWrongBookQuestion(record);
  state.subject = q.subject || state.subject;
  state.currentQuestion = q;
  state.bossMode = false;
  state.answered = false;
  if(Array.isArray(state.currentQuestion.choices)){
    state.currentQuestion.choices = state.currentQuestion.choices.slice().sort(()=>Math.random()-0.5);
  }
  $("feedbackArea").innerHTML = "";
  renderBattle();
  showPage("battlePage");
}

function startWrongBookMode(subject=null, typeKey=null){
  const records = wrongBookRecords(subject, typeKey);
  if(!records.length){
    const label = typeKey ? `${wrongTypeParts(typeKey).subject}｜${wrongTypeParts(typeKey).topic}` : (subject || "全部");
    setCatMessage("小喵", `${label} 目前沒有待修正錯題。這個錯題範圍已完成。`);
    return renderWrongBookPage(false);
  }
  switchToBattleMusic();
  state.wrongBookMode = true;
  state.wrongBookModeSubject = subject;
  state.wrongBookModeTypeKey = typeKey;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.gameMode = "wrongbook";
  state.subject = subject || records[0].subject || state.subject || "國文";
  state.stageCleared = false;
  state.hp = Math.max(30, state.hp || 100);
  state.monsterMaxHp = 120;
  state.monsterHp = 120;
  state.correct = 0;
  state.wrong = 0;
  state.total = 0;
  state.roundCount = 0;
  state.bossCount = 0;
  state.bossMode = false;
  state.correctStreak = 0;
  state.wrongStreak = 0;
  state.totalExpEarned = 0;
  state.answered = false;
  state.battleLog = [`📘 錯題本模式啟動：只會出你答錯過的題型。連續修正 5 題可獲得 EXP 獎勵。`];
  state.activeSession = null;
  state.mapPending=false; state.mapNodes=[]; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null;
  nextWrongBookQuestion();
}

function handleWrongBookCorrect(q){
  const removed = removeWrongBookRecordByKey(q.wrongBookSourceKey || wrongRecordKey(q));
  state.wrongBookFixStreak = (state.wrongBookFixStreak || 0) + 1;
  state.wrongBookFixedTotal = (state.wrongBookFixedTotal || 0) + 1;
  let bonusText = "";
  recordWrongTypeCorrection(removed || q);
  if(state.wrongBookFixStreak >= 5){
    const bonus = 50;
    addExp(bonus);
    state.wrongBookFixStreak = 0;
    bonusText = ` 連續修正 5 題，額外 EXP +${bonus}。`;
    pushLootLog(`📘 錯題本連續修正 5 題：EXP +${bonus}。`);
  }
  saveGameState();
  return `這題已從錯題本移除。${removed ? `修正題型：${removed.topic || q.topic}。` : ""}${bonusText}`;
}

function handleWrongBookWrong(q, choice){
  state.wrongBookFixStreak = 0;
  const sourceKey = q.wrongBookSourceKey || wrongRecordKey(q);
  const source = (state.wrongBook || []).find(x => (x.wrongKey || wrongRecordKey(x)) === sourceKey);
  if(source){
    source.studentAnswer = choice;
    source.wrongCount = (source.wrongCount || 1) + 1;
    source.missedAt = Date.now();
    recordWrongTypeStat(source);
  } else {
    recordWrongTypeStat(q);
  }
  saveGameState();
  return "錯題本連續修正中斷。這個題型會留在錯題本，之後再修正一次。";
}



const DAILY3_SUBJECTS = ["國文","英文","數學","自然","社會"];

function daily3TodayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function daily3PickSubject(){
  const hist = Array.isArray(state.daily3SubjectHistory) ? state.daily3SubjectHistory.slice(-2) : [];
  const candidates = DAILY3_SUBJECTS.filter(s => !hist.includes(s));
  const pool = candidates.length ? candidates : DAILY3_SUBJECTS;
  return pool[Math.floor(Math.random()*pool.length)];
}

function daily3CompletionReward(){
  state.daily3Stats = Object.assign({ lastDate:"", streak:0, clears:0, rewardedDate:"", lastSummary:null }, state.daily3Stats || {});
  const today = daily3TodayKey();
  const yesterday = (()=>{ const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; })();
  const firstToday = state.daily3Stats.rewardedDate !== today;
  let rewardText = "";
  if(firstToday){
    const fish = 6;
    const frag = 2;
    const exp = 35;
    state.cat.fish += fish;
    gainFragments(frag);
    addExp(exp);
    state.daily3Stats.streak = state.daily3Stats.lastDate === yesterday ? (state.daily3Stats.streak || 0) + 1 : 1;
    state.daily3Stats.lastDate = today;
    state.daily3Stats.rewardedDate = today;
    rewardText = `今日首通獎勵：小魚乾 +${fish}、碎片 +${frag}、EXP +${exp}。連續 ${state.daily3Stats.streak} 天。`;
    if(state.daily3Stats.streak > 0 && state.daily3Stats.streak % 3 === 0){
      state.chests += 1;
      rewardText += " 連續 3 天獎勵：寶箱 +1。";
    }
  }else{
    state.cat.fish += 1;
    rewardText = "今天已領過每日獎勵，本次追加小魚乾 +1。";
  }
  state.daily3Stats.clears = (state.daily3Stats.clears || 0) + 1;
  state.daily3Stats.lastSummary = { date:today, correct:state.correct, wrong:state.wrong, total:state.total, accuracy:calcAccuracy(), rewardText };
  pushLootLog(`🌙 今日 3 題完成：${rewardText}`);
  return rewardText;
}

function startDaily3Challenge(){
  switchToBattleMusic();
  state.subject = daily3PickSubject();
  state.gameMode = "daily3";
  state.daily3Mode = true;
  state.stageCleared = false;
  state.rogueBuffs = {}; state.roguePending = false; state.correctSinceBuff = 0;
  if(typeof resetStageQuestionMemory === "function") resetStageQuestionMemory(); else state.stageQuestionSigs = new Set();
  state.difficulty = "easy";
  state.monsterMaxHp = 90;
  state.monsterHp = 90;
  state.hp = 100;
  state.correct = 0;
  state.wrong = 0;
  state.total = 0;
  state.roundCount = 0;
  state.bossCount = 0;
  state.bossMode = false;
  state.hiddenBossMode = false;
  state.hiddenBossIndex = 0;
  state.correctStreak = 0;
  state.wrongStreak = 0;
  state.totalExpEarned = 0;
  state.answered = false;
  state.battleLog = ["🌙 今日 3 題：低壓放鬆模式啟動。不扣 HP、不進錯題本、不開 Boss。"];
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.eventPending = false;
  state.currentEvent = null;
  state.counterMode = false;
  state.mapPending=false; state.mapCooldownRound=-1; state.mapNodes=[]; state.dungeonFloor=1; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null; state.lastMapNote=''; state.nextQuestionMode=null; state.activeShield=false; state.activeBonusGuard=false; state.activeExpBoost=false; state.hardNodeBonus=false;
  state.usedIds = new Set();
  state.currentQuestion = null;
  state.activeSession = null;
  state.daily3SubjectHistory = Array.isArray(state.daily3SubjectHistory) ? state.daily3SubjectHistory : [];
  $("feedbackArea").innerHTML="";
  nextDaily3Question();
  renderBattle();
  showPage("battlePage");
}

function nextDaily3Question(){
  if(!state.daily3Mode && state.gameMode !== "daily3") return nextAdaptiveQuestion();
  if(state.total >= 3){
    state.stageCleared = true;
    const rewardText = daily3CompletionReward();
    state.battleLog.unshift(`🌙 今日 3 題完成：${rewardText}`);
    state.daily3Mode = false;
    state.activeSession = null;
    saveGameState();
    return showReport();
  }
  const nextSubject = daily3PickSubject();
  state.subject = nextSubject;
  state.daily3SubjectHistory = Array.isArray(state.daily3SubjectHistory) ? state.daily3SubjectHistory : [];
  state.daily3SubjectHistory.push(nextSubject);
  state.daily3SubjectHistory = state.daily3SubjectHistory.slice(-6);
  state.difficulty = state.total === 0 ? "easy" : "normal";
  state.bossMode = false;
  state.nextQuestionMode = state.difficulty;
  nextAdaptiveQuestion();
  if(state.currentQuestion){
    state.currentQuestion.daily3 = true;
    state.currentQuestion.subject = nextSubject;
    state.currentQuestion.difficulty = state.difficulty;
  }
  state.answered = false;
}


function startBattle(subject, mode = state.gameMode){
  switchToBattleMusic();
  state.subject=subject;
  state.gameMode = mode === "endless" ? "endless" : "chapter";
  state.stageCleared = false;
  state.rogueBuffs = {}; state.roguePending = false; state.correctSinceBuff = 0;
  if(typeof resetStageQuestionMemory === "function") resetStageQuestionMemory(); else state.stageQuestionSigs = new Set();
  state.difficulty="easy";
  state.monsterMaxHp=120;
  state.monsterHp=120;
  state.hp=100;
  state.correct=0;
  state.wrong=0;
  state.total=0;
  state.roundCount=0;
  state.bossCount=0;
  state.bossMode=false;
  state.daily3Mode=false;
  state.hiddenBossMode=false;
  state.hiddenBossIndex=0;
  state.correctStreak=0;
  state.wrongStreak=0;
  state.totalExpEarned=0;
  state.answered=false;
  state.battleLog=[];
  state.wrongBookMode=false;
  state.wrongBookModeSubject=null;
  state.wrongBookModeTypeKey=null;
  state.weakPracticeMode=false;
  state.weakPracticeTypeKey=null;
  state.eventPending=false;
  state.eventCounter=0;
  state.currentEvent=null;
  state.counterMode=false;
  state.mapPending=false; state.mapCooldownRound=-1; state.mapNodes=[]; state.dungeonFloor=1; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null; state.lastMapNote=''; state.nextQuestionMode=null; state.activeShield=false; state.activeBonusGuard=false; state.activeExpBoost=false; state.hardNodeBonus=false;
  state.usedIds=new Set();
  state.currentQuestion = null;
  state.activeSession = null;
  $("feedbackArea").innerHTML="";
  state.mapPending = true;
  state.mapCooldownRound = state.roundCount;
  state.mapNodes = [];
  showMapPage(false);
}

function restartBattle(){
  if(!state.subject) return showSubjects();
  startBattle(state.subject);
}

function nextAdaptiveQuestion(){
  if(state.roundCount >= 10 && !state.bossMode){
    state.bossMode = true;
    const bp = bossProfile();
    state.monsterMaxHp = (bp.hp || 160) + state.bossCount * 30;
    state.monsterHp = state.monsterMaxHp;
    state.battleLog.unshift(`👑 BOSS 關啟動！第 ${state.bossCount + 1} 隻 Boss 已鎖定。`);
  }

  let diffForQuestion = state.nextQuestionMode || state.difficulty;
  state.nextQuestionMode = null;
  if(state.bossMode && state.bossCount >= 1 && diffForQuestion === "easy"){
    diffForQuestion = "normal";
  }

  let chosen = null;
  let duplicateAttempts = 0;

  for(let tries = 0; tries < 80; tries++){
    let candidate;
    if (state.subject === "國文" && window.CSQ_GENERATE_CHINESE_QUESTION) {
      candidate = window.CSQ_GENERATE_CHINESE_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
    } else if (state.subject === "英文" && window.CSQ_GENERATE_ENGLISH_QUESTION) {
      candidate = window.CSQ_GENERATE_ENGLISH_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
    } else if (state.subject === "數學" && window.CSQ_GENERATE_MATH_QUESTION) {
      candidate = window.CSQ_GENERATE_MATH_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
    } else if (state.subject === "自然" && window.CSQ_GENERATE_SCIENCE_QUESTION) {
      candidate = window.CSQ_GENERATE_SCIENCE_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
    } else if (state.subject === "社會" && window.CSQ_GENERATE_SOCIAL_QUESTION) {
      candidate = window.CSQ_GENERATE_SOCIAL_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
    } else if (window.CSQ_GENERATE_QUESTION) {
      candidate = window.CSQ_GENERATE_QUESTION(state.subject, diffForQuestion, state.lastWrongRecord);
    } else {
      const pool = QUESTION_BANK[state.subject][diffForQuestion];
      let available = pool.filter(q=>!state.usedIds.has(q.id));
      if(available.length === 0){
        state.usedIds = new Set();
        available = pool;
      }
      candidate = {...available[Math.floor(Math.random()*available.length)]};
      state.usedIds.add(candidate.id);
    }

    if(!hasQuestionSeen(candidate)){
      chosen = candidate;
      break;
    }
    duplicateAttempts++;
  }

  // If the generator somehow keeps producing repeated stems, force a topic-neutral fallback.
  if(!chosen && state.subject === "國文" && window.CSQ_GENERATE_CHINESE_QUESTION){
    chosen = window.CSQ_GENERATE_CHINESE_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
  } else if(!chosen && state.subject === "英文" && window.CSQ_GENERATE_ENGLISH_QUESTION){
    chosen = window.CSQ_GENERATE_ENGLISH_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
  } else if(!chosen && state.subject === "數學" && window.CSQ_GENERATE_MATH_QUESTION){
    chosen = window.CSQ_GENERATE_MATH_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
  } else if(!chosen && state.subject === "自然" && window.CSQ_GENERATE_SCIENCE_QUESTION){
    chosen = window.CSQ_GENERATE_SCIENCE_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
  } else if(!chosen && state.subject === "社會" && window.CSQ_GENERATE_SOCIAL_QUESTION){
    chosen = window.CSQ_GENERATE_SOCIAL_QUESTION(state.roundCount, state.bossMode, state.stageQuestionSigs, diffForQuestion);
  } else if(!chosen && window.CSQ_FORCE_UNIQUE_QUESTION){
    chosen = window.CSQ_FORCE_UNIQUE_QUESTION(state.subject, diffForQuestion, state.stageQuestionSigs);
  }

  // Absolute last fallback: accept one generated question, but this should rarely happen after 80 attempts.
  if(!chosen){
    chosen = window.CSQ_GENERATE_QUESTION
      ? window.CSQ_GENERATE_QUESTION(state.subject, diffForQuestion, {topic: "__force_new__"})
      : {...QUESTION_BANK[state.subject][diffForQuestion][Math.floor(Math.random()*QUESTION_BANK[state.subject][diffForQuestion].length)]};
  }

  state.currentQuestion = chosen;
  markQuestionSeen(state.currentQuestion);

  if(duplicateAttempts >= 8){
    state.battleLog.unshift(`🔁 題目去重：已避開 ${duplicateAttempts} 次重複題幹。`);
  }

  if(state.bossMode){
    state.currentQuestion.boss = true;
    state.currentQuestion.difficulty = diffForQuestion;
  }
  state.answered=false;
}


function escapeHtmlLocal(text){
  return String(text ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function stripLatexTextCommands(expr){
  return String(expr || "").replace(/\\text\{([^{}]*)\}/g, "$1");
}

function renderLatexLite(expr){
  const rawExpr = stripLatexTextCommands(String(expr || "").trim());
  if(!rawExpr) return "";

  // v104: use KaTeX when available. This fixes nested fractions, integrals,
  // Laplace symbols, derivatives, limits, and other engineering-math notation.
  try{
    if(typeof katex !== "undefined" && katex && typeof katex.renderToString === "function"){
      return katex.renderToString(rawExpr, {
        throwOnError:false,
        strict:false,
        trust:false,
        output:"html"
      });
    }
  }catch(e){
    console.warn("KaTeX render failed, using fallback:", rawExpr, e);
  }

  // Fallback renderer for offline/local testing when CDN has not loaded.
  let s = escapeHtmlLocal(rawExpr);

  s = s
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\mathcal\{L\}/g, "𝓛")
    .replace(/\\operatorname\{([^{}]+)\}/g, "$1")
    .replace(/\\lim/g, "lim")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "∞")
    .replace(/\\oint/g, "∮")
    .replace(/\\int/g, "∫")
    .replace(/\\partial/g, "∂")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\exp/g, "exp")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\Omega/g, "Ω")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "·")
    .replace(/\\,/g, " ")
    .replace(/\\ /g, " ");

  s = s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body) => {
    const rows = body.split(/\\\\/).map(x => x.trim()).filter(Boolean);
    return `<span class="math-cases"><span class="math-brace">{</span><span class="math-case-rows">${rows.map(r => `<span>${renderLatexLite(r)}</span>`).join("")}</span></span>`;
  });

  // Render fractions repeatedly. The fallback is not a full parser, but it handles
  // the hidden-boss questions after v103's fraction cleanup.
  let guard = 0;
  const fracRe = /\\(?:d)?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g;
  while(fracRe.test(s) && guard < 20){
    guard++;
    s = s.replace(fracRe, (_, a, b) => `<span class="math-frac"><span class="math-frac-top">${renderLatexLite(a)}</span><span class="math-frac-bottom">${renderLatexLite(b)}</span></span>`);
  }

  s = s
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, (_, a) => `<span class="math-root">√<span class="math-root-body">${renderLatexLite(a)}</span></span>`)
    .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>")
    .replace(/\^(-?\d+|[A-Za-z])/g, "<sup>$1</sup>")
    .replace(/_(-?\d+|[A-Za-z])/g, "<sub>$1</sub>")
    .replace(/\\[A-Za-z]+/g, "");

  return s;
}

function renderMathText(text){
  const raw = String(text ?? "");
  if(!raw) return "";
  let out = "";
  let last = 0;
  const re = /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g;
  let m;
  while((m = re.exec(raw))){
    out += escapeHtmlLocal(raw.slice(last, m.index));
    const token = m[0];
    const display = token.startsWith("$$");
    const expr = display ? token.slice(2, -2) : token.slice(1, -1);
    out += `<span class="${display ? "math-display" : "math-inline"}">${renderLatexLite(expr)}</span>`;
    last = m.index + token.length;
  }
  out += escapeHtmlLocal(raw.slice(last));
  return out.replace(/\n/g, "<br>");
}

function renderQuestionHtml(text){
  const raw = String(text || "").replace(/\r\n/g,"\n").trim();
  if(!raw) return "";

  const contextMatch = raw.match(/【情境】([\s\S]*?)(?=\n\s*【資料／題目】|\n\s*【命題方向】|$)/);
  const dataMatch = raw.match(/【資料／題目】([\s\S]*?)(?=\n\s*【命題方向】|$)/);
  const directionMatch = raw.match(/【命題方向】([\s\S]*)$/);

  if(contextMatch || dataMatch || directionMatch){
    const context = contextMatch ? contextMatch[1].trim() : "";
    const data = dataMatch ? dataMatch[1].trim() : "";
    const direction = directionMatch ? directionMatch[1].trim() : "";

    const contextHtml = context
      ? `<div class="cap-section-subtitle">情境</div><div class="cap-context-text">${renderMathText(context)}</div>`
      : "";
    const dataHtml = data
      ? `<div class="cap-section-subtitle">題目</div><div class="cap-question-body">${renderMathText(data)}</div>`
      : "";
    const directionHtml = direction
      ? `<div class="cap-direction-chip">${renderMathText(direction).replace(/<br>/g," ")}</div>`
      : "";

    return `<section class="cap-block combined-question-block">
      <div class="cap-block-label">閱讀題幹</div>
      <div class="cap-block-body">${contextHtml}${dataHtml}</div>
      ${directionHtml}
    </section>`;
  }

  const blocks = raw.split(/\n{2,}/);
  return blocks.map(block=>{
    const trimmed = block.trim();
    const rendered = renderMathText(trimmed);
    if(trimmed.includes("：") && /[0-9A-Za-z甲乙丙丁一二三四五六週]/.test(trimmed)){
      return `<section class="cap-block table-like-block"><div class="cap-block-body">${rendered}</div></section>`;
    }
    return `<p class="cap-paragraph">${rendered}</p>`;
  }).join("");
}

function choiceLetter(index){
  return ["A","B","C","D"][index] || String(index + 1);
}

function toggleReadingMode(){
  const page = $("battlePage");
  if(!page) return;
  page.classList.toggle("reading-mode");
}

function renderBattle(){
  if(!state.currentQuestion){
    showMapPage(false);
    return;
  }
  const meta=subjectMeta();
  const bossTag = state.hiddenBossMode ? "｜∂ HIDDEN" : (state.bossMode ? "｜👑 BOSS 關" : "");
  $("battleTitle").textContent=`答題戰鬥｜${state.subject}${bossTag}`;
  const nextBoss = state.hiddenBossMode ? `${state.hiddenBossIndex}/${HIDDEN_CALCULUS_QUESTIONS.length}` : (state.bossMode ? "Boss 戰進行中" : `${Math.max(0,10 - state.roundCount)} 題後`);
  $("battleSubtitle").textContent=`${meta.monster}｜模式：${modeLabel(state.gameMode)}｜難度：${LABEL[state.difficulty]}｜已答 ${state.total} 題｜進度：${nextBoss}`;

  $("playerName").textContent=state.playerName;
  $("playerHpText").textContent=`${state.hp}/${Math.max(100, state.hp)}`;
  $("playerHpBar").style.width=`${state.hp}%`;
  $("playerExpText").textContent=`${state.exp}/${expToNext()}`;
  $("playerExpBar").style.width=`${Math.min(100,state.exp/expToNext()*100)}%`;
  $("playerLevelTag").textContent=`Level ${state.level}`;
  renderBonusFever();

  const boss = bossProfile();
  $("monsterIconTitle").textContent=state.bossMode ? `👑 Boss 資料` : `${meta.icon} 怪物資料`;
  $("monsterName").textContent=state.bossMode ? `${boss.icon} ${boss.name}` : meta.monster;
  $("monsterDesc").textContent=state.bossMode ? `${boss.desc}｜技能：${boss.skill}` : meta.monsterDesc;
  const portrait = $("monsterPortrait");
  if(portrait){
    if(state.bossMode && boss.img){
      portrait.src = boss.img;
      portrait.style.display = "block";
    } else {
      portrait.removeAttribute("src");
      portrait.style.display = "none";
    }
  }
  $("monsterHpText").textContent=`${state.monsterHp}/${state.monsterMaxHp}`;
  $("monsterHpBar").style.width=`${Math.max(0,state.monsterHp/state.monsterMaxHp*100)}%`;

  const q=state.currentQuestion;
  const bossLabel = state.hiddenBossMode ? `∂ 隱藏題 ${state.hiddenBossIndex}/${HIDDEN_CALCULUS_QUESTIONS.length}｜` : (state.bossMode ? "👑 Boss 題｜" : "");
  $("questionMeta").textContent=`${bossLabel}${LABEL[q.difficulty]}｜${q.topic}｜${q.id}｜連對 ${state.correctStreak}｜連錯 ${state.wrongStreak}`;
  $("questionText").innerHTML=renderQuestionHtml(q.question);
  if(q.imageRequirement && q.imageRequirement.Need_Image && q.imageRequirement.Local_Image){
    const figure = document.createElement("figure");
    figure.className = "question-figure";
    const img = document.createElement("img");
    img.className = "question-figure-img";
    img.src = q.imageRequirement.Local_Image;
    img.alt = q.imageRequirement.Alt_Text || "附圖";
    figure.appendChild(img);
    const cap = document.createElement("figcaption");
    cap.textContent = "附圖";
    figure.appendChild(cap);
    $("questionText").appendChild(figure);
  }
  const choices=$("choices");
  choices.innerHTML="";
  q.choices.forEach((choice, idx)=>{
    const btn=document.createElement("button");
    btn.className=state.bossMode ? "choice-btn boss-choice cap-choice-btn" : "choice-btn cap-choice-btn";
    btn.dataset.choiceIndex = String(idx);
    btn.dataset.correct = choice === q.answer ? "1" : "0";
    btn.innerHTML=`<span class="choice-letter">${choiceLetter(idx)}</span><span class="choice-content">${renderMathText(choice)}</span>`;
    btn.disabled=state.answered || state.hp <= 0;
    btn.onclick=()=>answerQuestion(choice);
    choices.appendChild(btn);
  });
  $("battleCatLine").textContent = catBattleLine();
  renderBattleLog();
  updateSidebar();
  renderBuffHud();
}

function catBattleLine(){
  if(state.hiddenBossMode) return "Pixel 壓低耳朵：喵……這關沒有提示，你只能靠自己了。";
  if(state.bossMode) return "Pixel 進入 Boss 支援模式：喵！牠的尾巴正在發光。";
  if(state.cat.love>=80) return "Pixel 超同步中：喵！牠正在幫你壓低緊張值。";
  if(state.cat.energy<25) return "Pixel 有點累了，去貓貓房餵小魚乾吧。";
  return "Pixel 正在旁邊觀察你的答題節奏。";
}

function addExp(amount){
  state.exp += amount;
  state.totalExpEarned += amount;
  while(state.exp >= expToNext()){
    const need = expToNext();
    state.exp -= need;
    state.level++;
    state.hp = Math.min(100, state.hp + 10);
    state.chests += 1;
    pushLootLog(`🎁 玩家升到 Level ${state.level}，獲得寶箱 x1。`);
    maybeDropCatShard("玩家升級掉落");
    state.battleLog.unshift(`✨ 升級！玩家 Level ${state.level}，HP 回復 10，寶箱 +1。`);
  }
}

function answerQuestion(choice){
  if(state.answered || state.hp <= 0) return;
  const q=state.currentQuestion;
  const wasBossQuestion = !!state.bossMode;
  const ok = choice === q.answer;

  if(state.counterMode){
    state.answered=true;
    if(ok){
      playCorrectSfx();
      const recover = 14;
      state.hp = Math.min(100, state.hp + recover);
      addExp(6);
      state.battleLog.unshift(`⚔️ 錯題反擊成功！HP +${recover}，EXP +6。`);
      state.counterMode=false;
      showFeedback(true,q,choice,"反擊成功。剛剛那個漏洞被你補起來了。");
    } else {
      playWrongSfx();
      state.hp = Math.max(0, state.hp - 8);
      state.battleLog.unshift("⚔️ 錯題反擊失敗，HP -8。");
      state.counterMode=false;
      showFeedback(false,q,choice,"反擊沒有成功，但這題已經進錯題庫，等等再回來拆。");
    }
    updateSidebar();
    return;
  }

  state.answered=true;
  state.total++;
  bumpQuest("answered");
  const subjectKeyMap = {"國文":"chinese","英文":"english","數學":"math","自然":"nature","社會":"society"};
  if(subjectKeyMap[state.subject]) bumpQuest(subjectKeyMap[state.subject]);

  if(ok){
    playCorrectSfx();
    state.correct++;
    state.bonusCombo++;
    gainFever(state.bossMode ? 35 : 22);
    state.correctSinceBuff++;
    if(buffLevel("healProtocol") > 0 && state.correct % 3 === 0){ state.hp = Math.min(100, state.hp + buffLevel("healProtocol") * 4); }
    bumpQuest("correct");
    state.correctStreak++;
    state.wrongStreak=0;

    const baseDamage = q.difficulty==="easy" ? 18 : q.difficulty==="normal" ? 25 : 35;
    const baseExp = q.difficulty==="easy" ? 8 : q.difficulty==="normal" ? 12 : 18;
    const damageBase = state.bossMode ? baseDamage * 2 : baseDamage;
    const isDaily3 = state.gameMode === "daily3" || !!q.daily3;
    const feverMult = state.feverActive ? 1.5 : 1;
    const comboMult = bonusMultiplier();
    const damage = Math.round((isDaily3 ? damageBase * 0.75 : damageBase) * (1 + buffBonus("damage") + (state.bossMode ? buffBonus("bossBoost") : 0)) * feverMult * comboMult * catSkillMultiplier());
    const expBase = state.bossMode ? baseExp * 3 : baseExp;
    let expBuff = buffBonus("exp") + (state.bossMode ? buffBonus("bossBoost") * 0.4 : 0) + ((q.difficulty === "normal" || q.difficulty === "hard") ? buffBonus("normalHardExp") : 0);
    const expPack = computeExpBonus(Math.round(expBase * (1 + expBuff) * feverMult * comboMult), q, state.bossMode);
    let exp = expPack.exp;
    if(state.activeExpBoost){ exp *= 2; state.activeExpBoost=false; }
    const fish = (state.bossMode ? 8 : q.difficulty==="hard" ? 3 : 2) + Math.round(buffFlat("fishFlat")) + (state.feverActive ? 1 : 0);

    state.monsterHp=Math.max(0,state.monsterHp-damage);
    addExp(exp);
    state.cat.fish += fish;
    if(q.difficulty==="hard") gainFragments(1);
    if(state.hardNodeBonus){ gainFragments(2); state.hardNodeBonus=false; }
    state.cat.love = Math.min(100, state.cat.love + (state.bossMode ? 10 : 4) + ((currentSkin().effect?.type === "catLove" ? currentSkin().effect.value : 0) + buffFlat("catLoveFlat")));

    let wrongBookLine = "";
    if(state.wrongBookMode && q.wrongBookMode){
      wrongBookLine = handleWrongBookCorrect(q);
    }

    state.battleLog.unshift(`✅ 答對！${state.bossMode ? "Boss 受到重擊！" : ""}怪物 -${damage} HP，EXP +${exp}${expPack.bonus ? "（貓貓加成）" : ""}${state.bonusCombo>=2 ? `｜BONUS x${comboMult.toFixed(2)}` : ""}${state.feverActive ? "｜FEVER!" : ""}，小魚乾 +${fish}。${wrongBookLine ? "｜" + wrongBookLine : ""}`);

    if(state.correctStreak >= 3) increaseDifficulty();
    let novaLine = state.bossMode ? "Boss 核心被你打穿了。這一擊漂亮，EXP 加倍同步。" : correctLines[Math.floor(Math.random()*correctLines.length)];
    let bossFinisherTriggered = false;
    if(state.bossMode && state.monsterHp <= 0 && !state.hiddenBossMode){
      bossFinisherTriggered = true;
      clearBoss();
      if(state.stageCleared){
        novaLine = "Boss 核心完全瓦解。10 題章節已通關，目前貓貓發動最後一擊。";
      } else {
        novaLine = "Boss 已被擊破。目前貓貓發動最後一擊，無盡模式繼續開放。";
      }
    }
    if(wrongBookLine) novaLine += " " + wrongBookLine;
    tickFever();
    showFeedback(true,q,choice, novaLine);
    if(bossFinisherTriggered) setTimeout(()=>playBossFinisherCutscene(), 160);

  } else {
    playWrongSfx();
    state.wrong++;
    if(state.activeBonusGuard){ state.activeBonusGuard=false; state.battleLog.unshift("🔥 Bonus 保護卡生效：Combo 沒有歸零。"); } else { state.bonusCombo = 0; }
    if(!state.feverActive) state.feverGauge = Math.max(0, (state.feverGauge || 0) - 12);
    bumpQuest("wrong");
    state.wrongStreak++;
    state.correctStreak=0;

    const isDaily3Wrong = state.gameMode === "daily3" || !!q.daily3;
    let penalty = isDaily3Wrong ? 0 : (q.difficulty==="easy" ? 8 : q.difficulty==="normal" ? 12 : 18);
    if(!isDaily3Wrong && state.bossMode) penalty += 15;
    penalty = isDaily3Wrong ? 0 : Math.max(1, Math.round(penalty * bossProfile().wrongPenalty * (1 - Math.min(0.75, buffBonus("wrongDamageReduce")))));

    let extra = "";
    if(!isDaily3Wrong && state.wrongStreak >= 3){
      penalty += 12;
      state.cat.energy = Math.max(0, state.cat.energy - 12);
      extra = " 連錯懲罰啟動：額外扣 HP，Pixel 能量下降。";
    }

    if(state.activeShield){
      penalty = 0;
      state.activeShield = false;
      extra += " 護盾卡生效，本次不扣 HP。";
    } else {
      state.hp=Math.max(0,state.hp-penalty);
    }
    let wrongBookLine = "";
    if(isDaily3Wrong){
      state.lastWrongRecord = null;
      wrongBookLine = "今日 3 題不進錯題本";
    } else if(state.hiddenBossMode || q.hiddenBoss){
      state.lastWrongRecord = null;
      wrongBookLine = "隱藏 Boss 不進錯題本";
    } else if(state.wrongBookMode && q.wrongBookMode){
      wrongBookLine = handleWrongBookWrong(q, choice);
      state.lastWrongRecord = (state.wrongBook || []).find(x => (x.wrongKey || wrongRecordKey(x)) === q.wrongBookSourceKey) || q;
    } else {
      state.lastWrongRecord = addWrongBookRecord(q, choice);
    }
    state.cat.fish += state.bossMode ? 2 : 1;
    state.battleLog.unshift(`⚠️ 答錯！${state.bossMode ? "Boss 反擊！" : ""}HP -${penalty}。${extra}${wrongBookLine ? "｜" + wrongBookLine : ""}`);

    if(!isDaily3Wrong && state.wrongStreak >= 2 && !state.wrongBookMode) decreaseDifficulty();
    const dailyLine = isDaily3Wrong ? "放鬆模式不扣 HP、不進錯題本；看完解析就好。" : makeWrongLine(q,choice,extra);
    showFeedback(false,q,choice, dailyLine + (wrongBookLine ? " " + wrongBookLine : ""));
  }

  if(!wasBossQuestion && state.gameMode !== "daily3"){
    state.roundCount++;
  }

  renderBattle();
}


function hideBossFinisherCutscene(){
  const overlay = $("bossFinisherOverlay");
  if(!overlay) return;
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden","true");
  state.bossFinisherPlaying = false;
}

function playBossFinisherCutscene(){
  const overlay = $("bossFinisherOverlay");
  const cat = $("bossFinisherCat");
  const name = $("bossFinisherCatName");
  const bossBase = $("bossFinisherBossBase");
  const bossName = $("bossFinisherBossName");
  if(!overlay || !cat) return;

  const skin = currentSkin();
  const boss = bossProfile();
  const bossSrc = boss?.img || "./assets/bosses/chinese_boss.png";
  const bossLabel = boss?.name || "Boss";

  cat.src = skin.src;
  cat.alt = `${skinName(state.cat.equippedSkin)} 最後一擊`;
  if(name) name.textContent = `${skinName(state.cat.equippedSkin)}｜最後一擊`;

  if(bossBase){
    bossBase.src = bossSrc;
    bossBase.alt = `${bossLabel} 最後一擊`;
  }
  document.querySelectorAll('.boss-finisher-slice-img').forEach(img=>{
    img.src = bossSrc;
    img.alt = `${bossLabel} 切割畫面`;
  });
  if(bossName) bossName.textContent = bossLabel;

  state.bossFinisherPlaying = true;
  overlay.classList.remove("active");
  void overlay.offsetWidth;
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden","false");

  // v100: play uploaded slash SFX right when the cutting panels hit the Boss.
  playBossFinisherSlashSfx(720);
  playBossFinisherSlashSfx(1040);

  setTimeout(()=>hideBossFinisherCutscene(), 3450);
}

function clearBoss(){
  state.bossCount++;
  state.bossMode=false;
  state.roundCount=0;
  resetStageQuestionMemory();
  state.monsterMaxHp = 120 + state.bossCount * 20;
  state.monsterHp = state.monsterMaxHp;
  state.hp = Math.min(100, state.hp + 15);
  state.cat.fish += 5;
  gainFragments(bossProfile().rewardFragments || 4);
  state.chests += 1;
  bumpQuest("boss");
  let extraChest = 0;
  if((currentSkin().effect?.type === "allExpAndChest" && Math.random() < 0.25) || Math.random() < buffBonus("extraChestChance")){
    state.chests += 1;
    extraChest = 1;
  }
  pushLootLog(`👑 Boss 擊破獎勵：寶箱 x${1 + extraChest}、小魚乾 +5。`);
  state.battleLog.unshift(`🏆 Boss 擊破！Boss Count ${state.bossCount}。HP 回復 15，寶箱 +${1 + extraChest}，小魚乾 +5。`);
  if(state.gameMode === "chapter"){
    state.stageCleared = true;
  }
}

function increaseDifficulty(){
  if(state.difficulty==="easy"){
    state.difficulty="normal";
    state.correctStreak=0;
    state.battleLog.unshift("⬆️ 小喵：連續破解成功，難度升級到普通。");
  } else if(state.difficulty==="normal"){
    state.difficulty="hard";
    state.correctStreak=0;
    state.battleLog.unshift("⬆️ 小喵：技能點解鎖，難度升級到困難。");
  }
}

function decreaseDifficulty(){
  if(state.difficulty==="hard"){
    state.difficulty="normal";
    state.wrongStreak=0;
    state.battleLog.unshift("⬇️ 小喵：錯題漏洞偏多，難度調整到普通。");
  } else if(state.difficulty==="normal"){
    state.difficulty="easy";
    state.wrongStreak=0;
    state.battleLog.unshift("⬇️ 小喵：系統切換補救模式，難度調整到簡單。");
  }
}

function makeWrongLine(q,choice,extra){
  return `偵測到漏洞：你選了「${choice}」，但正確答案是「${q.answer}」。${q.explanation} ${extra ? "系統已啟動懲罰，但這只是提醒你先補核心觀念。" : "先看清楚題目條件，再推進下一題。"}`;
}

function showFeedback(ok,q,choice,novaText){
  const bossFeedback = !!q.boss;
  const cls=ok?"correct":"wrong";
  const title=ok?"✅ 攻擊成功｜答案正確":"⚠️ 怪物反擊｜答案錯誤";
  const nextBtn = state.hp <= 0
    ? `<button class="primary-btn" onclick="goNext()">📊 HP 歸零｜查看報告</button>`
    : state.stageCleared
      ? `<button class="primary-btn" onclick="goNext()">🏆 Boss 擊破｜前往結算</button>`
      : `<button class="primary-btn" onclick="goNext()">➡ 下一題</button>`;

  $("feedbackArea").innerHTML=`
    <div class="feedback-card ${cls} ${bossFeedback ? "boss-feedback" : ""} ${state.feverActive ? "fever-flash" : ""}">
      <div class="feedback-title ${cls}">${bossFeedback ? "👑 " : ""}${title}</div>
      <p><strong>你的選擇：</strong>${renderMathText(choice)}</p>
      <p><strong>正確答案：</strong>${renderMathText(q.answer)}</p>
      <p><strong>詳解：</strong>${renderMathText(q.explanation)}</p>
    </div>
    <div class="nova-dialog">
      <div class="nova-avatar">N</div>
      <div><div class="nova-name-line">學習夥伴 小喵</div><div class="nova-text">${renderMathText(novaText)}</div></div>
    </div>
    <div class="battle-actions">
      ${!ok && state.hp>0 && !state.counterMode && state.gameMode !== "daily3" ? `<button class="secondary-btn counter-btn" onclick="startCounterQuestion()">⚔️ 錯題反擊</button>` : ""}${nextBtn}
      ${state.gameMode !== "daily3" ? `<button class="secondary-btn" onclick="showReport()">📊 查看目前報告</button>` : ""}
    </div>
  `;
}

function goNext(){
  if(!state.subject) return showSubjects();
  if(state.pendingRoomId){
    const pending = getRoomById(state.pendingRoomId);
    if(pending){ pending.cleared = true; pending.visited = true; }
    state.pendingRoomId = null;
    state.currentQuestion = null;
    state.answered = false;
  }
  if(state.daily3Mode || state.gameMode === "daily3"){
    if(state.total >= 3){
      return nextDaily3Question();
    }
    nextDaily3Question();
    $("feedbackArea").innerHTML="";
    renderBattle();
    showPage("battlePage");
    return;
  }
  if(state.hiddenBossMode){
    const completed = state.total >= HIDDEN_CALCULUS_QUESTIONS.length;
    if(completed || state.hp <= 0){
      return finishHiddenBossRun(completed && state.hp > 0);
    }
    nextHiddenCalculusQuestion();
    $("feedbackArea").innerHTML="";
    renderBattle();
    showPage("battlePage");
    return;
  }
  if(state.hp <= 0 || state.stageCleared){
    if(shouldOfferBuff()) return showBuffChoice("report");
    return showReport();
  }
  if(state.wrongBookMode){
    return nextWrongBookQuestion();
  }
  if(state.weakPracticeMode){
    return nextWeakTypePracticeQuestion();
  }
  if(shouldOfferBuff()) return showBuffChoice("next");
  if(state.dungeonMap){
    state.lastMapNote = '本房間已完成，請選擇前方相鄰房間。已走過的房間不能回頭。';
    return showMapPage(false);
  }
  if(shouldOfferMap()) return showMapPage();
  if(maybeTriggerEvent()) return;
  nextAdaptiveQuestion();
  $("feedbackArea").innerHTML="";
  renderBattle();
  showPage("battlePage");
}

function renderBattleLog(){
  const log=$("battleLog");
  if(state.battleLog.length===0){
    log.innerHTML=`<div class="log-item">${modeLabel(state.gameMode)}啟動。${state.gameMode === "daily3" ? "3 題、不扣 HP、不進錯題本。" : (state.hiddenBossMode ? "10 題，不講道理。" : (state.wrongBookMode ? "只出錯題本題型，答對會移除。" : "每 10 題會出現 Boss。"))}</div>`;
    return;
  }
  log.innerHTML=state.battleLog.slice(0,7).map(i=>`<div class="log-item">${esc(i)}</div>`).join("");
}

function calcAccuracy(){
  return state.total ? Math.round(state.correct/state.total*1000)/10 : 0;
}

function showReport(){
  state.activeSession = null;
  state.currentQuestion = null;
  state.dungeonMap = null;
  state.pendingRoomId = null;
  try{
    renderReport();
  }catch(e){
    console.error("renderReport failed", e);
    const box = $("reportNovaText") || $("report小喵Text");
    if(box) box.textContent = "結算資料整理時遇到小錯誤，但本回合獎勵與進度已保留。";
  }
  showPage("reportPage");
}


function compactTopicText(topic, max=26){
  const t = String(topic || "這一輪的題目").replace(/^今日3題｜/, "");
  return t.length > max ? t.slice(0, max) + "…" : t;
}

function currentTopWeakness(){
  if(state.gameMode === "daily3") return null;
  if(state.lastWrongRecord && (state.wrong || 0) > 0){
    return {
      subject: state.lastWrongRecord.subject || state.subject || "本回合",
      topic: state.lastWrongRecord.topic || state.lastWrongRecord.wrongBookSourceTopic || "剛剛答錯的題型",
      source: "last"
    };
  }
  const entries = typeof wrongTypeEntries === "function" ? wrongTypeEntries(1) : [];
  if(entries && entries.length){
    return { subject: entries[0].subject, topic: entries[0].topic, source:"history" };
  }
  return null;
}

function buildCatDiaryHTML(){
  const a = calcAccuracy();
  const catName = state.cat?.name || "Pixel";
  const mode = modeLabel(state.gameMode);
  const subject = state.gameMode === "daily3" ? "今日 3 題" : (state.subject || "這一輪");
  const topWeak = currentTopWeakness();
  const isDaily = state.gameMode === "daily3";
  const isHidden = state.gameMode === "hidden";
  const wonHidden = isHidden && state.hiddenBossResult === "victory";

  let mood = "穩定";
  let lead = "";
  if(isHidden){
    mood = wonHidden ? "極限突破" : "先撤退";
    lead = wonHidden
      ? `${catName} 覺得你今天真的有點猛，連 Newton Gate 都被你拆掉了。`
      : `${catName} 把爪子收起來了：Newton Gate 本來就不是一般關卡，撤退不丟臉。`;
  }else if(isDaily){
    mood = "輕量完成";
    lead = `${catName} 的今日觀察：你今天有回來打 3 題，這比完全放棄還重要。`;
  }else if(a >= 85){
    mood = "狀態很好";
    lead = `${catName} 今天看到你打得很順，答題節奏很穩。`;
  }else if(a >= 60){
    mood = "有進展";
    lead = `${catName} 覺得今天不是完美，但你有把題目拆完，這就是進度。`;
  }else{
    mood = "需要休息";
    lead = `${catName} 發現你今天可能有點累，先不要硬衝太久。`;
  }

  let weakLine = "";
  if(isDaily){
    const summary = state.daily3Stats?.lastSummary || {};
    weakLine = `今日 3 題屬於放鬆挑戰，不記入錯題本。${summary.rewardText ? "獎勵也已經放進背包。" : "完成就可以收工。"}`;
  }else if(isHidden){
    weakLine = "隱藏 Boss 是獨立挑戰，不列入一般數學與錯題分析。打完就當作額外彩蛋。";
  }else if(topWeak){
    weakLine = `比較需要留意的是「${topWeak.subject}｜${compactTopicText(topWeak.topic)}」。明天不用貪多，可以先從這個類型暖身。`;
  }else if((state.wrong || 0) === 0 && (state.total || 0) > 0){
    weakLine = "這輪沒有新增錯題。可以休息，也可以去貓貓房補一下能量。";
  }else{
    weakLine = "目前資料還不多。多完成幾輪後，Pixel 會更準確地抓出常錯類型。";
  }

  let suggestion = "";
  if(isDaily){
    suggestion = "建議：今天如果很累，到這裡就很好；還想玩再去貓貓房或抽卡。";
  }else if((state.wrong || 0) >= 3){
    suggestion = "建議：下一輪先不要打 Boss，去錯題本或今日 3 題把手感找回來。";
  }else if((state.correct || 0) >= 7){
    suggestion = "建議：狀態不錯，可以領任務獎勵，或再挑一科短練。";
  }else{
    suggestion = "建議：看完解析後先休息一下，回來用今日 3 題維持連續感。";
  }

  if($("catDiaryMood")) $("catDiaryMood").textContent = mood;

  return `
    <div class="cat-diary-line">${esc(lead)}</div>
    <div class="cat-diary-stats">
      <span>${esc(subject)}</span>
      <span>${esc(mode)}</span>
      <span>正確率 ${esc(String(a))}%</span>
      <span>答對 ${esc(String(state.correct || 0))} 題</span>
    </div>
    <div class="cat-diary-line">${esc(weakLine)}</div>
    <div class="cat-diary-suggestion">${esc(suggestion)}</div>
  `;
}

function renderCatDiary(){
  const box = $("catDiaryContent");
  if(!box) return;
  try{
    box.innerHTML = buildCatDiaryHTML();
  }catch(e){
    console.warn("cat diary render failed", e);
    box.textContent = "Pixel 想寫日記，但今天的資料有點亂。你的獎勵與進度已經保留。";
  }
}


function renderReport(){
  const a=calcAccuracy();
  $("reportSubject").textContent=state.gameMode === "daily3" ? "今日 3 題" : state.subject;
  $("reportAccuracy").textContent=`${a}%`;
  $("reportCounts").textContent=`${state.correct} / ${state.wrong}`;
  $("reportReward").textContent=`+${state.totalExpEarned} EXP`;
  if($("reportMode")) $("reportMode").textContent = modeLabel(state.gameMode);
  if($("questLevel")) $("questLevel").textContent = state.level;
  if($("questExp")) $("questExp").textContent = `${state.exp}/${expToNext()}`;
  if($("questChestCount")) $("questChestCount").textContent = state.chests;
  if($("questCompleteCount")) $("questCompleteCount").textContent = `${(state.claimedQuests || []).length}/${(typeof QUESTS !== "undefined" ? QUESTS.length : 0)}`;
  if($("gachaChestCount")) $("gachaChestCount").textContent = state.chests;
  if($("gachaFragmentCount")) $("gachaFragmentCount").textContent = `${state.fragments || 0}/10`;
  if($("gachaEpicPity")) $("gachaEpicPity").textContent = `${state.gachaPity?.epic || 0}/30`;
  if($("gachaSsrPity")) $("gachaSsrPity").textContent = `${state.gachaPity?.ssr || 0}/80`;
  if($("equippedTitleName")) $("equippedTitleName").textContent = titleMeta().name;
  if($("titleEffectText")) $("titleEffectText").textContent = `效果：${titleMeta().effectText}`;
  if($("gachaEquippedName")) $("gachaEquippedName").textContent = skinName(state.cat.equippedSkin);
  if($("gachaEquippedRarity")) $("gachaEquippedRarity").textContent = currentSkin().rarity;
  if($("gachaEquippedEffect")) $("gachaEquippedEffect").textContent = `效果：${currentEffectText()}`;
  if($("gachaEquippedCat")) $("gachaEquippedCat").src = currentSkin().src;
  let text = "";
  if(state.gameMode === "daily3"){
    const summary = state.daily3Stats?.lastSummary || {};
    text = `今日 3 題完成：本輪答對 ${state.correct} 題，答錯 ${state.wrong} 題，正確率 ${a}%。`;
    text += `\n${summary.rewardText || "完成獎勵已記錄。"}\n這是低壓放鬆模式：不扣 HP、不進錯題本、不開 Boss。`;
  } else if(state.gameMode === "hidden"){
    const won = state.hiddenBossResult === "victory";
    text = won
      ? `隱藏 Boss 擊破：完成 ${state.total} / ${HIDDEN_CALCULUS_QUESTIONS.length} 題，答對 ${state.correct} 題，答錯 ${state.wrong} 題，正確率 ${a}%。`
      : `隱藏 Boss 未通過：完成 ${state.total} / ${HIDDEN_CALCULUS_QUESTIONS.length} 題，答對 ${state.correct} 題，答錯 ${state.wrong} 題，正確率 ${a}%。`;
    text += won
      ? `
你已成功破解 Newton Gate，目前累積通關 ${state.hiddenBossClearCount || 0} 次。${state.hiddenBossFirstClear ? `已取得稱號「${TITLE_META.newtonWhisperer.name}」。` : ""}`
      : `
這個模式不列入普通章節或錯題本；它就是純粹來折磨人的工程數學區。先補血、補觀念，再回來挑戰。`;
  } else if(state.gameMode === "wrongbook"){
    const remain = (state.wrongBook || []).length;
    text = `錯題本修正結算：本輪完成 ${state.correct} 題，答錯 ${state.wrong} 題，正確率 ${a}%。`;
    text += remain === 0 ? `\n目前錯題本已清空，錯題數已歸零。` : `\n目前錯題本剩餘 ${remain} 題，可以回錯題本繼續修正。`;
    text += `\n本模式只統計錯題修正，不計入普通章節或無盡挑戰。`;
  } else if(a>=80) text=`${state.gameMode === "chapter" ? "章節挑戰完成。" : "無盡任務表現很好。"}你已答 ${state.total} 題，擊破 ${state.bossCount} 隻 Boss。建議繼續挑戰，看看能不能維持困難模式。Pixel 也拿到不少小魚乾。`;
  else if(a>=50) text=`資料分析完成：你已答 ${state.total} 題，擊破 ${state.bossCount} 隻 Boss。${state.gameMode === "chapter" ? "本次 10 題章節已完成，" : "本次無盡挑戰先告一段落，"}核心觀念有一定基礎，但錯題庫還有 ${state.wrongBook.length} 題，建議先複習再繼續。`;
  else text=`弱點掃描完成：目前 ${state.subject} 基礎還不穩。建議回到簡單題多刷幾輪，再挑戰 Boss。Pixel 會等你。`;
  text += `\n本輪助益：${activeBuffText().join("、") || "尚未取得"}。`; text += `\n目前 Bonus：Combo ${state.bonusCombo || 0}，Fever：${state.feverActive ? "啟動中" : (state.feverGauge || 0)+"/100"}。`; text += `\n稱號：${titleMeta().name}｜寶箱碎片：${state.fragments || 0}/10。`; const reportTextBox = $("reportNovaText") || $("report小喵Text"); if(reportTextBox) reportTextBox.textContent=text;
  renderCatDiary();
  if(state.gameMode === "daily3"){
    $("extraQuestionBox").innerHTML = `<div class="question-card"><div class="question-meta">今日 3 題</div><p>完成就可以休息，也可以再打一輪或回主頁。</p><button class="primary-btn" onclick="startDaily3Challenge()">再打 3 題</button><button class="secondary-btn" onclick="goHome()">回主頁</button></div>`;
  }else if(state.gameMode === "hidden"){
    $("extraQuestionBox").innerHTML = `<div class="question-card"><div class="question-meta">Newton Gate</div><p>這是獨立隱藏挑戰，不列入數學科題庫，也不進入弱點分析。</p><button class="secondary-btn" onclick="goHome()">回主頁</button></div>`;
  }else{
    $("extraQuestionBox").innerHTML = wrongBookHTML();
  }
  updateSidebar();
}

function wrongBookHTML(){
  if(state.wrongBook.length===0) return `<div class="question-card"><div class="question-meta">錯題本</div><p>目前沒有待修正錯題，錯題數已清空。</p><button class="secondary-btn" onclick="showWrongBookPage()">查看常錯類型分析</button></div>`;
  return `<div class="question-card"><div class="question-meta">錯題本｜剩餘 ${state.wrongBook.length} 題｜連續修正 ${state.wrongBookFixStreak || 0}/5</div>${wrongTypeRadarHTML()}<button class="primary-btn" onclick="showWrongBookPage()">回錯題本模式</button></div>`;
}

function generateExtraQuestion(){
  const wrong = state.lastWrongRecord || (state.wrongBook.length ? state.wrongBook[state.wrongBook.length - 1] : state.currentQuestion);
  const q = offlineSimilarQuestion(wrong);
  state.aiPracticeQuestion = q;
  renderPracticeQuestion(q, "離線同類型加練題｜會考風格補強");
}

function useHealPotion(){
  if(state.healPotion <= 0){
    const msg = "沒有回復藥水。先升級或開寶箱再來。";
    if($("feedbackArea") && $("battlePage").classList.contains("active")) $("feedbackArea").innerHTML = `<div class="feedback-card wrong"><div class="feedback-title wrong">🧪 補給不足</div><p>${esc(msg)}</p></div>`;
    setCatMessage("小喵", msg);
    return;
  }
  if(state.hp >= 100){
    setCatMessage("小喵", "你的 HP 已滿，先把藥水留著。");
    return;
  }
  state.healPotion--;
  const healAmount = Math.round(30 * (1 + (currentSkin().effect?.type === "healBoost" ? currentSkin().effect.value : 0)));
  state.hp = Math.min(100, state.hp + healAmount);
  pushLootLog(`🧪 使用回復藥水：HP 回復 ${healAmount}，目前 ${state.hp}/100。`);
  state.battleLog.unshift(`🧪 使用回復藥水，HP 回復 ${healAmount}。`);
  if($("feedbackArea") && $("battlePage").classList.contains("active")) $("feedbackArea").innerHTML = `<div class="feedback-card correct"><div class="feedback-title correct">🧪 補給成功</div><p>你使用了回復藥水，HP 回復 ${healAmount}，目前 ${state.hp}/100。</p></div>`;
  updateSidebar();
  updateCatUI();
  if(state.subject) renderBattle();
}

function useExpPotion(){
  if(state.expPotion <= 0){
    setCatMessage("小喵", "沒有升級藥水。先去開寶箱吧。");
    return;
  }
  state.expPotion--;
  const potionExp = Math.round(25 * (1 + (currentSkin().effect?.type === "potionExp" ? currentSkin().effect.value : 0)));
  addExp(potionExp);
  pushLootLog(`✨ 使用升級藥水：EXP +${potionExp}。`);
  state.battleLog.unshift(`✨ 使用升級藥水，EXP +${potionExp}。`);
  setCatMessage("小喵", "升級藥水已使用，EXP 直接注入。");
  updateSidebar();
  updateCatUI();
  if(state.subject) renderBattle();
}

// Gacha rates are controlled in weightedPick():
// SSR total 3%, EPIC total 10%, RARE total 30%, all remaining lower-tier/items total 57%.
// The weight values below only decide distribution inside the same rarity bucket.
function chestPool(){
  return [
    { type: "heal", amount: 1, rarity: "COMMON", weight: 24, label: "回復藥水 x1" },
    { type: "heal", amount: 2, rarity: "UNCOMMON", weight: 12, label: "回復藥水 x2" },
    { type: "exp", amount: 1, rarity: "UNCOMMON", weight: 16, label: "升級藥水 x1" },
    { type: "exp", amount: 2, rarity: "RARE", weight: 7, label: "升級藥水 x2" },
    { type: "fish", amount: 8, rarity: "COMMON", weight: 10, label: "小魚乾 x8" },
    { type: "fish", amount: 15, rarity: "UNCOMMON", weight: 5, label: "小魚乾 x15" },
    { type: "skin", skin: "tuxedo_basic", rarity: "COMMON", weight: 10, label: "燕尾黑白型" },
    { type: "skin", skin: "siamese_basic", rarity: "COMMON", weight: 10, label: "暹羅奶咖型" },
    { type: "skin", skin: "gray_tabby", rarity: "COMMON", weight: 10, label: "灰紋巡航型" },
    { type: "skin", skin: "white_basic", rarity: "COMMON", weight: 9, label: "雪白軟糖型" },
    { type: "skin", skin: "black_basic", rarity: "COMMON", weight: 9, label: "黑曜夜行型" },
    { type: "skin", skin: "ninja_orange", rarity: "UNCOMMON", weight: 7, label: "武士橘喵型" },
    { type: "skin", skin: "cozy_siamese", rarity: "UNCOMMON", weight: 7, label: "暖心毛衣型" },
    { type: "skin", skin: "detective_gray", rarity: "RARE", weight: 5, label: "偵探灰影型" },
    { type: "skin", skin: "astronaut_white", rarity: "RARE", weight: 4, label: "太空白喵型" },
    { type: "skin", skin: "wizard_black", rarity: "EPIC", weight: 2, label: "魔導黑喵型" },
    { type: "skin", skin: "cyber_tuxedo", rarity: "EPIC", weight: 2, label: "賽博未來型" },
    { type: "skin", skin: "ssr_moon_treasure", rarity: "SSR", weight: 1, label: "月夜寶藏豹貓" },
    { type: "skin", skin: "ssr_fortune_miko", rarity: "SSR", weight: 1, label: "櫻焰祈願三花" },
    { type: "skin", skin: "ssr_alchemy_queen", rarity: "SSR", weight: 1, label: "幻彩鍊金白貓" }
  ];
}


function applyDrawReward(reward){
  let rewardText = "";
  if(reward.type === "heal"){
    state.healPotion += reward.amount;
    rewardText = `回復藥水 x${reward.amount}`;
  } else if(reward.type === "exp"){
    state.expPotion += reward.amount;
    rewardText = `升級藥水 x${reward.amount}`;
  } else if(reward.type === "fish"){
    state.cat.fish += reward.amount;
    rewardText = `小魚乾 x${reward.amount}`;
  } else if(reward.type === "skin"){
    if(!state.cat.unlockedSkins.includes(reward.skin)){
      state.cat.unlockedSkins.push(reward.skin);
      state.cat.equippedSkin = reward.skin;
      rewardText = `新造型：${skinName(reward.skin)}`;
    } else {
      const shards = duplicateShardAmount(SKIN_META[reward.skin]?.rarity || reward.rarity);
      state.catShards[reward.skin] = (state.catShards[reward.skin] || 0) + shards;
      rewardText = `重複造型：${skinName(reward.skin)} → 貓碎片 x${shards}`;
    }
  }
  return rewardText;
}
function renderGachaResults(results){
  const box = $("gachaResults");
  if(!box) return;
  box.innerHTML = results.map(r => {
    const skin = r.reward.skin ? SKIN_META[r.reward.skin] : null;
    const img = skin ? `<img src="${skin.src}" alt="${skin.name}">` : `<div class="gacha-item-icon">${r.reward.type === "heal" ? "🧪" : r.reward.type === "exp" ? "✨" : "🐟"}</div>`;
    return `<div class="gacha-result ${rarityClass(r.reward.rarity)}">
      ${img}
      <div class="rarity-tag ${rarityClass(r.reward.rarity)}">${r.reward.rarity}</div>
      <div class="gacha-result-name">${esc(r.text)}</div>
    </div>`;
  }).join("");
}
function renderGachaPage(){
  updateSidebar();
  if($("gachaMessage")) $("gachaMessage").textContent = state.chests > 0 ? "可以開始抽卡。" : "目前沒有寶箱，先去完成任務或升級。";
  renderGachaResults([]);
}



function pickGachaReward(){
  state.gachaPity = state.gachaPity || {epic:0, ssr:0};
  state.gachaPity.epic++;
  state.gachaPity.ssr++;
  let pool = chestPool();
  if(state.gachaPity.ssr >= 80){
    pool = pool.filter(x=>x.rarity==="SSR");
  } else if(state.gachaPity.epic >= 30){
    pool = pool.filter(x=>["EPIC","SSR"].includes(x.rarity));
  }
  const reward = weightedPick(pool.length ? pool : chestPool());
  if(reward.rarity==="SSR"){ state.gachaPity.ssr=0; state.gachaPity.epic=0; }
  else if(reward.rarity==="EPIC"){ state.gachaPity.epic=0; }
  return reward;
}

function openChest(){
  if(state.chests <= 0){
    if($("chestMessage")) $("chestMessage").innerHTML = `<span class="rarity-tag common">NO BOX</span> 目前沒有寶箱，先去答題升級吧。`;
    if($("gachaMessage")) $("gachaMessage").innerHTML = `<span class="rarity-tag common">NO BOX</span> 目前沒有寶箱，先去答題升級吧。`;
    return;
  }
  state.chests--;
  const reward = pickGachaReward();
  const text = applyDrawReward(reward);
  const line = `🎁 [${reward.rarity}] ${text}`;
  pushLootLog(line);
  if($("chestMessage")) $("chestMessage").innerHTML = `<span class="rarity-tag ${rarityClass(reward.rarity)}">${reward.rarity}</span> ${esc(text)}`;
  if($("gachaMessage")) $("gachaMessage").innerHTML = `<span class="rarity-tag ${rarityClass(reward.rarity)}">${reward.rarity}</span> ${esc(text)}`;
  renderGachaResults([{reward, text}]);
  setCatMessage("小喵", reward.rarity==="SSR" ? `等等，這個機率……你不會真的把伺服器駭了吧？${text}` : `寶箱解析完成。${text}`);
  updateCatUI();
  updateSidebar();
}
function openTenChests(){
  if(state.chests < 10){
    if($("gachaMessage")) $("gachaMessage").innerHTML = `<span class="rarity-tag common">NO BOX</span> 十連抽需要 10 個寶箱，目前只有 ${state.chests} 個。`;
    return;
  }
  state.chests -= 10;
  bumpQuest("tenpull");
  const results = [];
  for(let i=0;i<10;i++){
    const reward = pickGachaReward();
    const text = applyDrawReward(reward);
    results.push({reward, text});
    pushLootLog(`🎰 十連抽 [${reward.rarity}] ${text}`);
  }
  if($("gachaMessage")) $("gachaMessage").innerHTML = `十連抽完成！共獲得 10 項獎勵。`;
  renderGachaResults(results);
  updateCatUI();
  updateSidebar();
  renderQuestPage();
}

function renderChestLog(){
  const box = $("chestLog");
  if(!box) return;
  if(state.inventoryLog.length === 0){
    box.innerHTML = `<div class="log-item">尚無寶箱紀錄。升級後就會出現。</div>`;
    return;
  }
  box.innerHTML = state.inventoryLog.slice(0,6).map(t => `<div class="log-item">${esc(t)}</div>`).join("");
}

function renderSkinGallery(){
  const box = $("skinGallery");
  if(!box) return;
  const entries = Object.entries(SKIN_META);
  box.innerHTML = entries.map(([id, meta]) => {
    const unlocked = state.cat.unlockedSkins.includes(id);
    const active = state.cat.equippedSkin === id;
    return `<button class="skin-item ${unlocked ? 'unlocked' : 'locked'} ${active ? 'active' : ''}" ${unlocked ? `onclick="equipSkin('${id}')"` : 'disabled'}>
      <img src="${meta.src}" alt="${meta.name}" class="skin-thumb ${id === 'portrait_calico' ? 'portrait' : 'transparent-skin'}" />
      <div class="skin-label">${esc(meta.name)}</div>
      <div class="rarity-tag ${rarityClass(meta.rarity)}">${meta.rarity}</div>
      <div class="skin-effect">${esc(meta.effectText || "無特殊效果")}</div><div class="skin-state">${active ? '已裝備' : (unlocked ? '可裝備' : '未解鎖')}</div>
    </button>`;
  }).join("");
}

function equipSkin(id){
  if(!state.cat.unlockedSkins.includes(id)) return;
  state.cat.equippedSkin = id;
  setCatMessage("Pixel", `喵！已切換成「${skinName(id)}」。`);
  updateCatUI();
  updateSidebar();
}

function showCatPage(){ switchToCatMusic(); updateCatUI(); renderSkinGallery(); renderChestLog();
  renderCatSkillPanel(); showPage("catPage"); }
function updateCatUI(){
  if($("catNameDisplay")) $("catNameDisplay").textContent = state.cat?.name || "Pixel";
  if(!$("catLevel")) return;
  $("catLevel").textContent=state.cat.level;
  $("catLove").textContent=state.cat.love;
  $("catEnergy").textContent=state.cat.energy;
  $("fishCount").textContent=state.cat.fish;
  $("catLoveText").textContent=`${state.cat.love}/100`;
  $("catEnergyText").textContent=`${state.cat.energy}/100`;
  $("catLoveBar").style.width=`${state.cat.love}%`;
  $("catEnergyBar").style.width=`${state.cat.energy}%`;
  updateSidebar();
  renderSkinGallery();
  renderChestLog();
  if($("reportMode")) $("reportMode").textContent = modeLabel(state.gameMode);
  if($("questLevel")) $("questLevel").textContent = state.level;
  if($("questExp")) $("questExp").textContent = `${state.exp}/${expToNext()}`;
  if($("questChestCount")) $("questChestCount").textContent = state.chests;
  if($("questCompleteCount")) $("questCompleteCount").textContent = `${(state.claimedQuests || []).length}/${(typeof QUESTS !== "undefined" ? QUESTS.length : 0)}`;
  if($("gachaChestCount")) $("gachaChestCount").textContent = state.chests;
  if($("gachaFragmentCount")) $("gachaFragmentCount").textContent = `${state.fragments || 0}/10`;
  if($("gachaEpicPity")) $("gachaEpicPity").textContent = `${state.gachaPity?.epic || 0}/30`;
  if($("gachaSsrPity")) $("gachaSsrPity").textContent = `${state.gachaPity?.ssr || 0}/80`;
  if($("equippedTitleName")) $("equippedTitleName").textContent = titleMeta().name;
  if($("titleEffectText")) $("titleEffectText").textContent = `效果：${titleMeta().effectText}`;
  if($("gachaEquippedName")) $("gachaEquippedName").textContent = skinName(state.cat.equippedSkin);
  if($("gachaEquippedRarity")) $("gachaEquippedRarity").textContent = currentSkin().rarity;
  if($("gachaEquippedEffect")) $("gachaEquippedEffect").textContent = `效果：${currentEffectText()}`;
  if($("gachaEquippedCat")) $("gachaEquippedCat").src = currentSkin().src;
  syncCatDisplay();
  updateHiddenBossButton();
  updateModeUI();
}

function feedCat(){
  if(state.cat.fish<=0){ setCatMessage("小喵","喂喂喂，這小傢伙的小魚乾庫存是 0，不先去打幾題補貨嗎？"); return false; }
  state.cat.fish--;
  bumpQuest("feed");
  const beforeEnergy = state.cat.energy;
  state.cat.energy=Math.min(100,state.cat.energy+28);
  playCatMeowSfx();
  setCatMessage("小喵",`喂喂喂，這隻${skinName(state.cat.equippedSkin)}吃到小魚乾後，能量從 ${beforeEnergy} 補到 ${state.cat.energy}。親密度不會因餵食增加，想培養感情就摸摸他吧。`);
  updateCatUI();
  return true;
}

function petCat(){
  const cost = 10;
  if(state.cat.energy <= 0){
    setCatMessage("小喵","他現在能量條是 0。喂喂喂，先餵點小魚乾，不然這小傢伙不想被摸。");
    return false;
  }
  bumpQuest("pet");
  state.cat.energy=Math.max(0,state.cat.energy-cost);
  state.cat.love=Math.min(100,state.cat.love+6);
  catLevelCheck();
  playCatMeowSfx();
  setCatMessage("小喵", state.cat.energy <= 0 ? "這小傢伙被摸到沒電了。能量條歸零，先餵小魚乾吧。" : "他看起來想要些摸摸。嗯，這小傢伙現在挺開心的。");
  updateCatUI();
  return true;
}

// v60: 同步訓練已從介面移除。保留空函式避免舊版快取呼叫造成錯誤。
function trainCat(){
  setCatMessage("小喵","同步訓練已移除。現在貓貓養成改成：餵小魚乾只補能量，摸摸消耗能量並增加親密度。貓貓升等時會機率掉落目前造型碎片。");
  return false;
}

function catLevelCheck(){
  if(state.cat.love>=100){
    const levelBefore = state.cat.level;
    const loveBeforeReset = state.cat.love;
    state.cat.level++;
    state.cat.energy=Math.min(100,state.cat.energy+12);
    pushLootLog(`🐾 ${state.cat.name || "Pixel"} 從 Level ${levelBefore} 升到 Level ${state.cat.level}。升等時會機率掉落目前造型的貓貓碎片。`);
    maybeDropCatShard("貓貓升等", loveBeforeReset);
    state.cat.love=35;
  }
}

function setCatMessage(n,t){
  const box = $("catMessage");
  if(!box) return;
  const isCat = n === "Pixel" || n === "貓貓" || n === state.cat.name;
  const avatar = isCat
    ? `<img class="cat-dialog-avatar-img" src="${currentSkin().src}" alt="${esc(skinName(state.cat.equippedSkin))}">`
    : `N`;
  const speaker = isCat ? `${skinName(state.cat.equippedSkin)} Pixel` : "小喵學習夥伴";
  box.innerHTML=`<div class="nova-avatar ${isCat ? 'cat-dialog-avatar' : ''}">${avatar}</div><div><div class="nova-name-line">${esc(speaker)}</div><div class="nova-text">${esc(t)}</div></div>`;
}

function test小喵(){
  $("backendStatus").textContent = "v3.9 題庫與隨機概念地圖已啟用：每張地圖會隨機生成房間、走廊、出生房與傳送房。";
  $("home小喵Text").textContent = "離線 CAP 題庫已啟用。第一次玩可以從首頁三步驟開始：選科目、養貓貓、抽卡收集。";
}


function normalizePracticeQuestion(q, source){
  return {
    id: "PRACTICE-" + Date.now(),
    subject: q.subject || state.subject,
    difficulty: q.difficulty || source.difficulty || state.difficulty,
    topic: q.topic || source.topic || "同類型加練",
    question: q.question,
    choices: Array.isArray(q.choices) ? q.choices.slice(0,4) : [],
    answer: q.answer,
    explanation: q.explanation || "請依題目條件判斷。"
  };
}

function offlineSimilarQuestion(source){
  const diff = source?.difficulty || state.difficulty || "easy";
  if (window.CSQ_GENERATE_QUESTION) {
    const q = window.CSQ_GENERATE_QUESTION(state.subject, diff, source);
    return {
      ...q,
      id: "OFFLINE-PRACTICE-" + Date.now() + "-" + Math.floor(Math.random()*10000),
      topic: q.topic || source?.topic || "同類型加練"
    };
  }

  const topic = source.topic;
  let pool = QUESTION_BANK[state.subject][diff] || QUESTION_BANK[state.subject].easy;
  let sameTopic = pool.filter(q => q.topic === topic && q.id !== source.id);
  if(sameTopic.length === 0) sameTopic = pool.filter(q => q.id !== source.id);
  const q = sameTopic[Math.floor(Math.random() * sameTopic.length)] || source;
  return {
    ...q,
    id: "OFFLINE-PRACTICE-" + Date.now(),
    topic: q.topic || topic || "同類型加練"
  };
}

function renderPracticeQuestion(q, title){
  $("extraQuestionBox").innerHTML = `
    <div class="question-card ai-practice-card">
      <div class="question-meta">${esc(title)}｜${esc(q.topic || "")}｜${LABEL[q.difficulty] || q.difficulty || ""}</div>
      <div class="question-text">${renderMathText(q.question)}</div>
      ${(q.choices || []).map(c => `<div class="extra-choice">${renderMathText(c)}</div>`).join("")}
      <p><strong>正確答案：</strong>${renderMathText(q.answer)}</p>
      <p><strong>詳解：</strong>${renderMathText(q.explanation)}</p>
      <button class="primary-btn" onclick="startPracticeQuestion()">把這題加入下一題挑戰</button>
    </div>
  `;
}

function startPracticeQuestion(){
  if(!state.aiPracticeQuestion){
    const wrong = state.lastWrongRecord || state.currentQuestion;
    state.aiPracticeQuestion = offlineSimilarQuestion(wrong);
  }
  state.currentQuestion = {...state.aiPracticeQuestion};
  state.bossMode = false;
  state.answered = false;
  $("feedbackArea").innerHTML = "";
  showPage("battlePage");
  renderBattle();
}

function parseJsonMaybe(text){
  try { return JSON.parse(text); } catch(e) {}
  const match = String(text).match(/\{[\s\S]*\}/);
  if(match){
    try { return JSON.parse(match[0]); } catch(e) {}
  }
  return null;
}

renderSubjects();
updateSidebar();




/* ===== v2.9 Clean audio rebuilt from v1.9 base ===== */
const AUDIO_SETTINGS_KEY = "CSQ_V83_AUDIO_SETTINGS";
const audioSettings = { master: 1, bgm: 0.70, sfx: 0.90, muted: false };
const bgmBaseVolume = { startMusicAudio:0.55, battleMusicAudio:0.62, catMusicAudio:0.45, gachaMusicAudio:0.88, hiddenBossMusicAudio:0.88 };
let currentBgmAudioId = null;

function clampVolumeValue(v){
  const n = Number(v);
  if(Number.isNaN(n)) return 1;
  return Math.max(0, Math.min(1, n));
}

function loadAudioSettings(){
  try{
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    audioSettings.master = clampVolumeValue(saved.master ?? audioSettings.master);
    audioSettings.bgm = clampVolumeValue(saved.bgm ?? audioSettings.bgm);
    audioSettings.sfx = clampVolumeValue(saved.sfx ?? audioSettings.sfx);
    audioSettings.muted = !!saved.muted;
  }catch(e){}
}

function saveAudioSettings(){
  try{ localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettings)); }catch(e){}
}

function audioVolume(kind, base=1){
  if(audioSettings.muted) return 0;
  const typeVol = kind === "bgm" ? audioSettings.bgm : audioSettings.sfx;
  return clampVolumeValue(base) * audioSettings.master * typeVol;
}

function renderAudioControls(){
  const set = (id, value) => { const el = $(id); if(el) el.value = Math.round(value * 100); };
  const label = (id, value) => { const el = $(id); if(el) el.textContent = `${Math.round(value * 100)}%`; };
  set("masterVolume", audioSettings.master);
  set("bgmVolume", audioSettings.bgm);
  set("sfxVolume", audioSettings.sfx);
  label("masterVolumeText", audioSettings.master);
  label("bgmVolumeText", audioSettings.bgm);
  label("sfxVolumeText", audioSettings.sfx);
  const btn = $("muteToggleBtn");
  if(btn) btn.textContent = audioSettings.muted ? "🔇 解除靜音" : "🔊 關閉靜音";
}

function applyAudioSettings(){
  try{
    Object.entries(bgmBaseVolume).forEach(([id,base])=>{
      const a = document.getElementById(id);
      if(a) a.volume = audioVolume("bgm", base);
    });
    const sfxBase = {
      catMeowAudio:1.0,
      bossFinisherSlashSfx:1.0,
      correctSfx1:0.78,
      correctSfx2:0.78,
      correctSfx3:0.78,
      wrongSfx1:0.82,
      wrongSfx2:0.82,
      correctSfxAudio:0.78,
      wrongSfxAudio:0.82
    };
    Object.entries(sfxBase).forEach(([id,base])=>{
      const a = document.getElementById(id);
      if(a) a.volume = audioVolume("sfx", base);
    });
    if(typeof questRewardSfx !== "undefined") questRewardSfx.volume = audioVolume("sfx", 0.65);
  }catch(e){}
  renderAudioControls();
}

function updateVolumeSetting(kind, value){
  const v = clampVolumeValue(Number(value) / 100);
  if(kind === "master") audioSettings.master = v;
  if(kind === "bgm") audioSettings.bgm = v;
  if(kind === "sfx") audioSettings.sfx = v;
  saveAudioSettings();
  applyAudioSettings();
  // Keep the currently playing BGM responsive while dragging the slider.
  try{
    if(currentBgmAudioId){
      const audio = document.getElementById(currentBgmAudioId);
      const base = bgmBaseVolume[currentBgmAudioId] ?? 1;
      if(audio) audio.volume = audioVolume("bgm", base);
    }
  }catch(e){}
}

function toggleMute(){
  audioSettings.muted = !audioSettings.muted;
  saveAudioSettings();
  applyAudioSettings();
}

function safeAudioPlay(audioId, volume) {
  try {
    ["startMusicAudio", "battleMusicAudio", "catMusicAudio", "gachaMusicAudio", "hiddenBossMusicAudio"].forEach(id => {
      const a = document.getElementById(id);
      if (a && id !== audioId) {
        a.pause();
        a.currentTime = 0;
      }
    });

    const audio = document.getElementById(audioId);
    if (!audio) return;

    bgmBaseVolume[audioId] = clampVolumeValue(volume);
    currentBgmAudioId = audioId;
    audio.volume = audioVolume("bgm", bgmBaseVolume[audioId]);
    audio.loop = true;

    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch(e) {}
}

function switchToStartMusic() {
  safeAudioPlay("startMusicAudio", 0.55);
}

function switchToBattleMusic() {
  safeAudioPlay("battleMusicAudio", 0.62);
}

function switchToCatMusic() {
  safeAudioPlay("catMusicAudio", 0.45);
}

function switchToGachaMusic() {
  safeAudioPlay("gachaMusicAudio", 0.88);
}

function switchToHiddenBossMusic() {
  safeAudioPlay("hiddenBossMusicAudio", 0.88);
}

function startGameWithMusic() {
  switchToStartMusic();
  showSubjects();
}


const questRewardSfx = new Audio("./assets/audio/quest_reward_coin.mp3");
questRewardSfx.volume = audioVolume("sfx", 0.65);

function playQuestRewardSfx(){
  try{
    questRewardSfx.currentTime = 0;
    questRewardSfx.play();
  }catch(e){}
}

function playCorrectSfx() {
  try {
    const ids = ["correctSfx1", "correctSfx2", "correctSfx3"];
    const id = ids[Math.floor(Math.random() * ids.length)];
    const audio = document.getElementById(id);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = audioVolume("sfx", 0.78);

    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch(e) {}
}

function playWrongSfx() {
  try {
    const ids = ["wrongSfx1", "wrongSfx2"];
    const id = ids[Math.floor(Math.random() * ids.length)];
    const audio = document.getElementById(id);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = audioVolume("sfx", 0.82);

    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch(e) {}
}


function playBossFinisherSlashSfx(delay=0){
  const run = () => {
    try{
      const audio = document.getElementById("bossFinisherSlashSfx");
      if(!audio) return;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = audioVolume("sfx", 1.0);
      const p = audio.play();
      if(p && typeof p.catch === "function") p.catch(()=>{});
    }catch(e){}
  };
  if(delay) setTimeout(run, delay);
  else run();
}

function playCatMeowSfx() {
  try {
    const audio = document.getElementById("catMeowAudio");
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = audioVolume("sfx", 1.0);

    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch(e) {}
}

/* v60: Cat interactions call meow after successful action directly; wrapper disabled to avoid duplicate meow. */
window.addEventListener("load", () => {
  try{
    checkRequiredAssets();
    loadQuickHubState();
    loadAudioSettings();
    applyAudioSettings();
    const loaded = loadGameState();
    updateSidebar();
    updateCatUI();
    updateQuickHub();
    renderAudioControls();
    updateResumePanel();
    if(loaded) setManualSaveStatus(state.activeSession ? "已自動讀取存檔，偵測到進行中關卡，可按「返回進度」繼續。" : "已自動讀取這個網址的本機存檔", "saved");
  }catch(e){}
});