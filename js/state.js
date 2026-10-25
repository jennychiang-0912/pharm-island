/* PHARMA ISLAND：領土狀態與玩家進度
   只管「哪些格子被佔領」與由此算出的經驗值、等級、進度。
   進度存在這台裝置的瀏覽器（localStorage）。 */
window.PI = window.PI || {};

PI.state = (function () {
  const KEY = PI.STORAGE_KEY || "pharma-island-v1";   // 每個科目（藥理、藥劑、藥分）各自存進度
  let occupied = new Set();
  let treeDone = new Set();   // 知識樹已答對過的題目（每題只算一次經驗值）
  let notes = {};             // 格子的「我的筆記」：單元 id → 文字
  let edits = {};             // 知識卡片的個人修改紀錄（原始資料不動，見 js/edits.js）：卡片 key → 修改內容
  const listeners = [];

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const d = JSON.parse(raw); occupied = new Set(d.occupied || []); treeDone = new Set(d.treeDone || []); notes = d.notes || {}; edits = d.edits && typeof d.edits === "object" ? d.edits : {}; }
  } catch (e) { /* 無法讀取時從零開始 */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ occupied: [...occupied], treeDone: [...treeDone], notes, edits })); } catch (e) {}
  }
  function emit() { listeners.forEach(fn => fn()); }

  return {
    onChange(fn) { listeners.push(fn); },

    isOccupied(cellId) { return occupied.has(cellId); },

    /* 答題系統之後會呼叫這個：答對就佔領格子 */
    occupy(cellId) { occupied.add(cellId); save(); emit(); },

    reset() { occupied = new Set(); treeDone = new Set(); save(); emit(); },   // 筆記和知識卡片的修改不會被清掉

    /* 知識樹答對一題：第一次答對才加經驗值，回傳是不是第一次 */
    markTree(qid) { if (treeDone.has(qid)) return false; treeDone.add(qid); save(); emit(); return true; },
    isTreeDone(qid) { return treeDone.has(qid); },

    /* 我的筆記：沒寫過時回傳 null（畫面會先放這個單元的口訣） */
    getNote(id) { return Object.prototype.hasOwnProperty.call(notes, id) ? notes[id] : null; },
    setNote(id, text) { notes[id] = text; save(); },   // 不觸發重畫，打字才不會被打斷

    /* 知識卡片的個人修改紀錄：value 是 null 就刪掉這張卡片的修改（＝還原原文） */
    getEdits() { return JSON.parse(JSON.stringify(edits)); },
    getEdit(key) { return Object.prototype.hasOwnProperty.call(edits, key) ? JSON.parse(JSON.stringify(edits[key])) : null; },
    setEdit(key, value) { if (value) edits[key] = value; else delete edits[key]; save(); },
    replaceEdits(all) { edits = all; save(); },
    treeDoneList() { return [...treeDone]; },

    /* 格子狀態：已佔領 / 可挑戰 / 未解鎖
       可挑戰 = 每章的起點格，或緊鄰一個已佔領格的格子 */
    statusOf(cell) {
      if (occupied.has(cell.id)) return "occupied";
      if (cell.isStart) return "available";
      if (cell.neighbors.some(n => occupied.has(n))) return "available";
      return "locked";
    },

    /* 玩家進度 */
    progress(cells) {
      const total = cells.length;
      const done = cells.filter(c => occupied.has(c.id)).length;
      const exp = done * PI.LEVEL.expPerCell + treeDone.size * (PI.LEVEL.expPerTreeQuestion || 0);
      const level = Math.floor(exp / PI.LEVEL.expPerLevel) + 1;
      const expInLevel = exp % PI.LEVEL.expPerLevel;
      return { total, done, exp, level, expInLevel, expNeed: PI.LEVEL.expPerLevel,
               pct: total ? Math.round(done / total * 100) : 0 };
    },

    chapterProgress(cells, chapterId) {
      const mine = cells.filter(c => c.chapter === chapterId);
      return { total: mine.length, done: mine.filter(c => occupied.has(c.id)).length };
    }
  };
})();
