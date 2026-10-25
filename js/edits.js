/* PHARMA ISLAND：知識卡片的個人修改紀錄
   原始知識資料（js/knowledge.js 或 js/subjects/<科目>.js 的 PI.KNOWLEDGE）完全不動：
   打開網頁時先把原始資料複製一份存在 ORIGINAL，再把「個人修改紀錄」套上去，變成畫面和題庫用的 PI.KNOWLEDGE。
   修改紀錄存在 localStorage（js/state.js 的 edits），跟著科目分開存；每張卡片都可以「還原原文」＝刪掉那張卡片的紀錄。

   卡片 key：「知識樹 key|第幾段|第幾張」，例如 "ch1|1|0"（和題目編號 t:ch1:1:0:… 用同一套位置）。
   一張卡片的修改紀錄：
     { title: "新標題",                       // 有改才有
       slots: { "2": { text: "…" }, "5": { del: true } },   // 第幾行（和題目編號同一套順序）改成什麼／刪掉
       extra: [{ id: "k3x9", text: "…" }],   // 自己新增的行（題目編號用 x<id>，不會擠到原本的行）
       marks: { "2": "teacher", "xk3x9": "mine" },   // 考點標記
       hidden: true }                          // 整張卡片隱藏
   行的順序和 js/quiz.js 出題的順序一樣：0＝text、1…＝points、接著每一步流程的 text，再來是 ⊖ 抑制框的 label、drugs、note。
   刪掉的行不會真的移除，只是變成空字串：後面每一行的位置（題目編號）都不變，已答對的紀錄和 EXP 不會亂掉。
   引用格子內容的卡片（{ unit: "…" }）這一版不開放修改。 */
window.PI = window.PI || {};

PI.edits = (function () {
  const clone = o => JSON.parse(JSON.stringify(o));
  const ORIGINAL = clone(PI.KNOWLEDGE || {});
  const FORMAT = "pharma-island-edits", VERSION = 1;

  /* 考點來源與可信度：AI 建議只是「尚未確認」，不會當成必考 */
  const MARKS = {
    ai:      { label: "AI 建議・未確認", short: "AI 建議" },
    teacher: { label: "老師明確強調",     short: "老師強調" },
    exam:    { label: "考古題曾出現",     short: "考古題" },
    mine:    { label: "我自行標記重要",   short: "我標記" }
  };

  const keyOf = (treeKey, si, ii) => `${treeKey}|${si}|${ii}`;
  function itemAt(K, key) {
    const [tk, si, ii] = String(key).split("|");
    const sec = ((K[tk] || {}).sections || [])[+si];
    return sec && (sec.items || [])[+ii] || null;
  }

  /* 一張卡片有哪些行（順序＝出題順序）。get／set 直接讀寫那一張卡片物件 */
  function slotsOf(it) {
    const S = [];
    S.push({ li: 0, label: "說明", get: () => it.text || "", set: v => { it.text = v; }, exists: () => it.text != null });
    (it.points || []).forEach((_, i) => S.push({ li: S.length, label: `重點 ${i + 1}`, get: () => it.points[i] || "", set: v => { it.points[i] = v; }, exists: () => true }));
    (it.flow || []).forEach((st, n) => {
      (st.text || []).forEach((_, i) => S.push({ li: S.length, label: `第 ${n + 1} 步・說明`, get: () => st.text[i] || "", set: v => { st.text[i] = v; }, exists: () => true }));
      if (st.block) [["label", "⊖ 抑制框標題"], ["drugs", "⊖ 藥名"], ["note", "⊖ 補充"]].forEach(([f, lab]) =>
        S.push({ li: S.length, label: `第 ${n + 1} 步・${lab}`, get: () => st.block[f] || "", set: v => { st.block[f] = v; }, exists: () => st.block[f] != null }));
    });
    return S;
  }

  /* 原始資料＋修改紀錄 → PI.KNOWLEDGE */
  function apply() {
    const K = clone(ORIGINAL), all = PI.state.getEdits();
    Object.entries(all).forEach(([key, e]) => {
      const it = itemAt(K, key);
      if (!it || it.unit || !e) return;   // 找不到卡片（原始資料改過）或引用格子的卡片：跳過，但紀錄保留
      if (typeof e.title === "string") it.title = e.title;
      const S = slotsOf(it);
      Object.entries(e.slots || {}).forEach(([li, v]) => { const s = S[+li]; if (s && v) s.set(v.del ? "" : String(v.text ?? "")); });
      it.extra = (e.extra || []).filter(x => x && x.id && x.text);
      it.marks = e.marks || {};
      it.hidden = !!e.hidden;
      it.edited = true;
    });
    PI.KNOWLEDGE = K;
    if (PI.quiz && PI.quiz.rebuild) PI.quiz.rebuild();   // 題庫跟著重建
  }

  const original = key => { const it = itemAt(ORIGINAL, key); return it ? clone(it) : null; };

  /* ---------- 匯出／匯入 ---------- */
  function exportData() {
    return { format: FORMAT, version: VERSION, storageKey: PI.STORAGE_KEY || "pharma-island-v1",
             exportedAt: new Date().toISOString(), edits: PI.state.getEdits() };
  }
  // 檢查匯入的檔案，只留認得的欄位；有問題就丟出錯誤訊息（中文，直接顯示給使用者）
  function sanitize(data) {
    if (!data || data.format !== FORMAT) throw new Error("這不是 PHARMA ISLAND 的知識卡片修改檔。");
    if (data.version !== VERSION) throw new Error(`檔案版本 ${data.version} 不支援（目前是 ${VERSION}）。`);
    const mine = PI.STORAGE_KEY || "pharma-island-v1";
    if (data.storageKey !== mine) throw new Error(`這個檔案是別的科目頁面匯出的（${data.storageKey}），請到那一頁匯入。`);
    if (!data.edits || typeof data.edits !== "object" || Array.isArray(data.edits)) throw new Error("檔案裡沒有修改紀錄。");
    const str = v => typeof v === "string" ? v.slice(0, 5000) : null;
    const out = {};
    Object.entries(data.edits).forEach(([key, e]) => {
      if (!/^[^|]+\|\d+\|\d+$/.test(key) || !e || typeof e !== "object") return;
      const c = {};
      if (str(e.title) !== null) c.title = str(e.title);
      if (e.slots && typeof e.slots === "object") {
        const sl = {};
        Object.entries(e.slots).forEach(([li, v]) => { if (!/^\d+$/.test(li) || !v) return;
          if (v.del === true) sl[li] = { del: true }; else if (str(v.text) !== null) sl[li] = { text: str(v.text) }; });
        if (Object.keys(sl).length) c.slots = sl;
      }
      if (Array.isArray(e.extra)) {
        const ex = e.extra.filter(x => x && /^[a-z0-9]{1,16}$/i.test(x.id) && str(x.text)).map(x => ({ id: x.id, text: str(x.text) }));
        if (ex.length) c.extra = ex;
      }
      if (e.marks && typeof e.marks === "object") {
        const mk = {};
        Object.entries(e.marks).forEach(([k, v]) => { if (/^(\d+|x[a-z0-9]{1,16})$/i.test(k) && MARKS[v]) mk[k] = v; });
        if (Object.keys(mk).length) c.marks = mk;
      }
      if (e.hidden === true) c.hidden = true;
      if (Object.keys(c).length) out[key] = c;
    });
    return out;
  }
  function importData(data) {
    const edits = sanitize(data);
    PI.state.replaceEdits(edits);
    apply();
    return Object.keys(edits).length;
  }

  apply();
  return { MARKS, keyOf, slotsOf, apply, original, exportData, importData, sanitize,
           get: key => PI.state.getEdit(key), set: (key, v) => { PI.state.setEdit(key, v); apply(); } };
})();
