/* PHARMA ISLAND：領土狀態與玩家進度
   只管「哪些格子被佔領」與由此算出的經驗值、等級、進度。
   進度存在這台裝置的瀏覽器（localStorage）；登入雲端同步後，js/sync.js 會再存一份到 Supabase。
   ts：每一筆資料最後改動的時間（毫秒），兩台裝置合併時用（見 merge）：
     occ／done：格子／題目第幾時取得；notes／edits：每則筆記、每張卡片最後修改的時間（刪掉的也留時間，才知道是「刪除」比較新）；
     resetAt：最後一次「清除學習進度」的時間，比它早取得的格子和答對紀錄合併時不算。 */
window.PI = window.PI || {};

PI.state = (function () {
  const KEY = PI.STORAGE_KEY || "pharma-island-v1";   // 每個科目（藥理、藥劑、藥分）各自存進度
  let occupied = new Set();
  let treeDone = new Set();   // 知識樹已答對過的題目（每題只算一次經驗值）
  let notes = {};             // 格子的「我的筆記」：單元 id → 文字
  let edits = {};             // 知識卡片的個人修改紀錄（原始資料不動，見 js/edits.js）：卡片 key → 修改內容
  let ts = { occ: {}, done: {}, notes: {}, edits: {}, resetAt: 0 };
  const listeners = [], saveHooks = [];
  const now = () => Date.now();
  const obj = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};

  function load(d) {
    occupied = new Set(Array.isArray(d.occupied) ? d.occupied : []); treeDone = new Set(Array.isArray(d.treeDone) ? d.treeDone : []);
    notes = obj(d.notes); edits = obj(d.edits);
    const t = obj(d.ts);
    ts = { occ: obj(t.occ), done: obj(t.done), notes: obj(t.notes), edits: obj(t.edits), resetAt: +t.resetAt || 0 };
    // 舊存檔沒有時間：記成 1（很早以前），只有在另一台裝置清除過進度時才會被合併掉
    const fill = (set, m) => set.forEach(k => { if (!m[k]) m[k] = 1; });
    fill(occupied, ts.occ); fill(treeDone, ts.done); fill(Object.keys(notes), ts.notes); fill(Object.keys(edits), ts.edits);
  }
  try { const raw = localStorage.getItem(KEY); if (raw) load(JSON.parse(raw)); } catch (e) { /* 無法讀取時從零開始 */ }

  const snapshot = () => ({ occupied: [...occupied], treeDone: [...treeDone], notes, edits, ts });
  function save(quiet) {
    try { localStorage.setItem(KEY, JSON.stringify(snapshot())); } catch (e) {}
    if (!quiet) saveHooks.forEach(fn => fn());   // 雲端同步：有改動就排隊上傳
  }
  function emit() { listeners.forEach(fn => fn()); }

  /* 合併兩份存檔（這台裝置 a、雲端 b）：格子和答對紀錄取聯集（清除進度之前的不算），筆記和卡片修改每一筆取比較新的 */
  function merge(a, b) {
    const A = { ...a, ts: obj(a.ts) }, B = { ...b, ts: obj(b.ts) };
    const resetAt = Math.max(+A.ts.resetAt || 0, +B.ts.resetAt || 0);
    const pickSet = (field, tk) => {
      const out = {};
      [A, B].forEach(S => { const m = obj(S.ts[tk]); (Array.isArray(S[field]) ? S[field] : []).forEach(k => {
        const t = +m[k] || 1; if (t > resetAt && (!out[k] || t > out[k])) out[k] = t; }); });
      return out;
    };
    const pickMap = (field, tk) => {
      const val = {}, tm = {};
      const keys = new Set([A, B].flatMap(S => [...Object.keys(obj(S[field])), ...Object.keys(obj(S.ts[tk]))]));
      keys.forEach(k => {
        const ta = +obj(A.ts[tk])[k] || 0, tb = +obj(B.ts[tk])[k] || 0, S = tb > ta ? B : A;
        tm[k] = Math.max(ta, tb);
        if (Object.prototype.hasOwnProperty.call(obj(S[field]), k)) val[k] = S[field][k];
      });
      return [val, tm];
    };
    const occ = pickSet("occupied", "occ"), done = pickSet("treeDone", "done");
    const [n, nt] = pickMap("notes", "notes"), [e, et] = pickMap("edits", "edits");
    return { occupied: Object.keys(occ), treeDone: Object.keys(done), notes: n, edits: e,
             ts: { occ, done, notes: nt, edits: et, resetAt } };
  }

  return {
    onChange(fn) { listeners.push(fn); },

    isOccupied(cellId) { return occupied.has(cellId); },

    /* 答題系統之後會呼叫這個：答對就佔領格子 */
    occupy(cellId) { if (!occupied.has(cellId)) ts.occ[cellId] = now(); occupied.add(cellId); save(); emit(); },

    reset() { occupied = new Set(); treeDone = new Set(); ts.occ = {}; ts.done = {}; ts.resetAt = now(); save(); emit(); },   // 筆記和知識卡片的修改不會被清掉

    /* 知識樹答對一題：第一次答對才加經驗值，回傳是不是第一次 */
    markTree(qid) { if (treeDone.has(qid)) return false; treeDone.add(qid); ts.done[qid] = now(); save(); emit(); return true; },
    isTreeDone(qid) { return treeDone.has(qid); },

    /* 我的筆記：沒寫過時回傳 null（畫面會先放這個單元的口訣） */
    getNote(id) { return Object.prototype.hasOwnProperty.call(notes, id) ? notes[id] : null; },
    setNote(id, text) { notes[id] = text; ts.notes[id] = now(); save(); },   // 不觸發重畫，打字才不會被打斷

    /* 知識卡片的個人修改紀錄：value 是 null 就刪掉這張卡片的修改（＝還原原文） */
    getEdits() { return JSON.parse(JSON.stringify(edits)); },
    getEdit(key) { return Object.prototype.hasOwnProperty.call(edits, key) ? JSON.parse(JSON.stringify(edits[key])) : null; },
    setEdit(key, value) { if (value) edits[key] = value; else delete edits[key]; ts.edits[key] = now(); save(); },
    replaceEdits(all) { const t = now(); new Set([...Object.keys(edits), ...Object.keys(all)]).forEach(k => { ts.edits[k] = t; }); edits = all; save(); },

    /* 雲端同步（js/sync.js）用 */
    snapshot() { return JSON.parse(JSON.stringify(snapshot())); },
    merge,
    adopt(d) { load(d); save(true); emit(); },   // 換成合併後的存檔（不會再觸發上傳）
    onSave(fn) { saveHooks.push(fn); },
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
