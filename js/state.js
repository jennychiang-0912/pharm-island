/* PHARMA ISLAND：領土狀態與玩家進度
   只管「哪些格子被佔領」與由此算出的經驗值、等級、進度。
   進度存在這台裝置的瀏覽器（localStorage）。 */
window.PI = window.PI || {};

PI.state = (function () {
  const KEY = PI.STORAGE_KEY || "pharma-island-v1";   // 每個科目（藥理、藥劑、藥分）各自存進度
  let occupied = new Set();
  let treeDone = new Set();   // 知識樹已答對過的題目（每題只算一次經驗值）
  const listeners = [];

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const d = JSON.parse(raw); occupied = new Set(d.occupied || []); treeDone = new Set(d.treeDone || []); }
  } catch (e) { /* 無法讀取時從零開始 */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ occupied: [...occupied], treeDone: [...treeDone] })); } catch (e) {}
  }
  function emit() { listeners.forEach(fn => fn()); }

  return {
    onChange(fn) { listeners.push(fn); },

    isOccupied(cellId) { return occupied.has(cellId); },

    /* 答題系統之後會呼叫這個：答對就佔領格子 */
    occupy(cellId) { occupied.add(cellId); save(); emit(); },

    reset() { occupied = new Set(); treeDone = new Set(); save(); emit(); },

    /* 知識樹答對一題：第一次答對才加經驗值，回傳是不是第一次 */
    markTree(qid) { if (treeDone.has(qid)) return false; treeDone.add(qid); save(); emit(); return true; },
    isTreeDone(qid) { return treeDone.has(qid); },

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
