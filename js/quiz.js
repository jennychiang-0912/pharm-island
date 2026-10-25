/* PHARMA ISLAND：答題
   題目全部從資料裡的挖空 {{答案|類型}} 自動產生，不另外寫題庫：
   - 挖空題：一句話挖掉一個答案，錯誤選項從「同類型」的其他答案抽（同一組 > 同一章 > 其他章）。
   - 認藥題：給這個藥「獨有」的一兩句特徵，問是哪一個藥；錯誤選項是同一組／同一章的其他藥。
     只出現在知識樹答題（格子的標題就是藥名，在格子上出沒有意義）。
   會排除「這個藥本身其他句子也成立」的錯誤選項，避免一題有兩個正確答案。
   挑戰格子：連答最多 3 題，答完就佔領（不限答對題數）。
   知識樹：每次 5 題；每一題第一次答對 +PI.LEVEL.expPerTreeQuestion EXP。 */
window.PI = window.PI || {};

PI.quiz = (function () {
  const RE = /\{\{([^{}|]+)(?:\|([^{}]*))?\}\}/g;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => String(s).toLowerCase().replace(/[\s（）()]/g, "");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const FIELD = Object.fromEntries(PI.UNIT_FIELDS || []);

  /* 一句話拆成：文字片段 + 挖空 + 口訣 */
  function parse(line) {
    const i = line.search(/\s#/), text = i < 0 ? line : line.slice(0, i), hint = i < 0 ? "" : line.slice(i).trim();
    const parts = [], blanks = []; let last = 0, m; RE.lastIndex = 0;
    while ((m = RE.exec(text))) {
      // {{答案|類型}} 或 {{答案|類型|錯誤選項1/錯誤選項2/錯誤選項3}}（自己指定錯誤選項）
      const [type, opts] = (m[2] || "").split("|");
      parts.push(text.slice(last, m.index));
      blanks.push({ ans: m[1].trim(), type: (type || "").trim(), opts: opts ? opts.split("/").map(x => x.trim()).filter(Boolean) : null });
      last = RE.lastIndex;
    }
    parts.push(text.slice(last));
    return { parts, blanks, hint };
  }
  // 把句子組回 HTML：hide 是要挖掉的那一格（-1 表示全部顯示答案）
  function render(p, hide, mark) {
    return p.parts.map((t, k) => esc(t) + (k < p.blanks.length
      ? (k === hide ? `<span class="q-blank">${mark ? esc(p.blanks[k].ans) : "＿＿＿"}</span>` : esc(p.blanks[k].ans)) : "")).join("");
  }
  const plain = p => p.parts.map((t, k) => t + (k < p.blanks.length ? p.blanks[k].ans : "")).join("").trim();

  /* ---------- 題庫（第一次用到時建立） ---------- */
  let bank = null;
  function build() {
    const lines = [], ownerAns = new Map(), byType = new Map(), facts = new Map();
    const add = (owner, meta, line) => {
      const p = parse(line); if (!p.blanks.length && !meta.unit) return;
      const L = { owner, ...meta, p, id: `${owner}#${lines.length}` }; lines.push(L);
      if (!ownerAns.has(owner)) ownerAns.set(owner, new Set());
      p.blanks.forEach(b => {
        ownerAns.get(owner).add(norm(b.ans));
        if (!byType.has(b.type)) byType.set(b.type, []);
        byType.get(b.type).push({ ans: b.ans, owner, chapter: meta.chapter, group: meta.group });
      });
      const key = norm(plain(p)); facts.set(key, (facts.get(key) || 0) + 1);
    };
    PI.UNITS.forEach(u => (PI.UNIT_FIELDS || []).forEach(([k]) => (u[k] || []).forEach((line, li) =>
      add(`u:${u.id}`, { unit: u, field: k, chapter: u.chapter, group: u.group || null, qid: `u:${u.id}:${k}:${li}` }, line))));
    Object.entries(PI.KNOWLEDGE || {}).forEach(([key, K]) => (K.sections || []).forEach((sec, si) => (sec.items || []).forEach((it, ii) => {
      if (it.unit || it.hidden) return;   // 引用格子的內容：題目算在格子上；隱藏的卡片不出題（位置照算，題目編號不變）
      // 流程圖（flow）的每一步也可以出題：步驟說明、抑制框的標題、藥名、說明
      //   題目標題會帶上是哪一步，例如「脫殼 Uncoating・⊖ 抑制」，才知道在問哪裡
      const flowLines = (it.flow || []).flatMap((st, n) => [
        ...(st.text || []).map(t => [t, { n: n + 1, title: st.title || "", block: false }]),
        ...(st.block ? [st.block.label, st.block.drugs, st.block.note].map((t, k) => [t, { n: n + 1, title: k === 2 ? "" : st.title || "", block: true }]) : [])]);   // 補充說明常在講這一步本身，不顯示步驟名稱
      [...[it.text, ...(it.points || [])].map(t => [t, null]), ...flowLines].forEach(([line, ctx], li) => line &&
        add(`t:${key}`, { tree: key, item: it, ctx, chapter: K.chapter, group: null, qid: `t:${key}:${si}:${ii}:${li}` }, line));
      // 自己新增的行（js/edits.js）：題目編號用 x<id>，不會擠到原本的行
      (it.extra || []).forEach(x => x.text && add(`t:${key}`, { tree: key, item: it, ctx: null, chapter: K.chapter, group: null, qid: `t:${key}:${si}:${ii}:x${x.id}` }, x.text));
    })));
    const ownerText = new Map();
    lines.forEach(L => ownerText.set(L.owner, (ownerText.get(L.owner) || "") + "|" + norm(plain(L.p))));
    bank = { lines, ownerAns, byType, facts, ownerText };
  }

  /* 錯誤選項：同類型、不是這個藥（或這棵樹這句）已知成立的答案 */
  function distractors(L, b) {
    if (b.opts && b.opts.length) return shuffle(b.opts.slice(0, 3));   // 資料裡自己指定的錯誤選項優先
    // 對比組（耐酸／不耐酸……）：選項就用同組的其他詞
    const set = (PI.CLOZE_SETS || []).find(g => g.some(x => norm(x) === norm(b.ans)));
    if (set) return shuffle(set.filter(x => norm(x) !== norm(b.ans)));
    const bad = new Set([...(bank.ownerAns.get(L.owner) || []), ...L.p.blanks.map(x => norm(x.ans))]);
    if (L.unit) { bad.add(norm(L.unit.name)); bad.add(norm(L.unit.short || L.unit.name)); }
    const a0 = norm(b.ans);
    const text = bank.ownerText.get(L.owner) || "";   // 這個藥資料裡已經寫到的詞也不能當錯誤選項
    const nameLike = b.type === "藥名" || b.type === "藥物類別";
    const seen = new Set(), cand = [];
    shuffle((bank.byType.get(b.type) || []).slice()).forEach(c => {
      const k = norm(c.ans);
      if (bad.has(k) || seen.has(k) || text.includes(k) || k.includes(a0) || a0.includes(k)) return;   // 太像正確答案的（IV 和 IV/IM）也不要
      seen.add(k);
      // 藥名：同一組最難；其他類型（疾病、菌種、副作用……）：同章的藥抗菌範圍常重疊、可能其實也對，所以優先用別章的
      const sameG = L.group && c.group === L.group, sameC = c.chapter === L.chapter;
      cand.push({ ...c, rank: nameLike ? (sameG ? 2 : 0) + (sameC ? 1 : 0) : (sameG ? 0 : sameC ? 1 : 2) });
    });
    cand.sort((x, y) => y.rank - x.rank);
    return cand.length >= 3 ? cand.slice(0, 3).map(c => c.ans) : null;
  }

  function clozeQ(L, k) {
    const b = L.p.blanks[k], wrong = distractors(L, b); if (!wrong) return null;
    // 流程圖的題目：標題帶上第幾步；如果答案就寫在步驟名稱裡（例如「脫殼」），就不顯示步驟名稱，免得直接看到答案
    const ctxLabel = c => { const showTitle = c.title && !norm(c.title).includes(norm(b.ans)) && !norm(b.ans).includes(norm(c.title));
      return `第 ${c.n} 步${showTitle ? "・" + c.title : ""}${c.block ? "・⊖ 抑制" : ""}`; };
    const who = L.unit ? (L.unit.type === "topic" ? L.unit.name : `${L.unit.name}・${FIELD[L.field] || ""}`) : (L.ctx ? ctxLabel(L.ctx) : (L.item.title || ""));
    return {
      kind: "cloze", qid: `${L.qid}:${k}`, label: who,
      prompt: render(L.p, k, false), answer: render(L.p, k, true), hint: L.p.hint,
      options: shuffle([{ text: b.ans, ok: true }, ...wrong.map(t => ({ text: t, ok: false }))])
    };
  }

  /* 認藥題：這個藥獨有的特徵句（別的藥沒有一模一樣的句子，也沒有寫到藥名） */
  function whichQ(u) {
    if (u.type !== "drug") return null;
    const name = norm(u.name), short = norm(u.short || u.name);
    const mine = shuffle(bank.lines.filter(L => L.owner === `u:${u.id}` && L.p.blanks.length &&
      bank.facts.get(norm(plain(L.p))) === 1 && !norm(plain(L.p)).includes(short) && !norm(plain(L.p)).includes(name)));
    if (!mine.length) return null;
    const pick = mine.slice(0, 2);
    const others = shuffle(PI.UNITS.filter(x => x.type === "drug" && x.id !== u.id && x.chapter === u.chapter))
      .sort((a, b) => (b.group === u.group) - (a.group === u.group)).slice(0, 3);
    if (others.length < 3) return null;
    return {
      kind: "which", qid: `w:${u.id}`, label: "認藥：哪一個藥？",
      prompt: `<ul class="q-facts">${pick.map(L => `<li><span class="q-field">${esc(FIELD[L.field] || "")}</span>${render(L.p, -1)}</li>`).join("")}</ul>`,
      answer: `答案是 <b>${esc(u.name)}</b>`, hint: "",
      options: shuffle([{ text: u.name, ok: true }, ...others.map(x => ({ text: x.name, ok: false }))])
    };
  }

  function forUnit(u, n = 3) {
    if (!bank) build();
    const qs = [];   // 格子上不出認藥題：標題就是藥名，一看就知道
    const lines = shuffle(bank.lines.filter(L => L.owner === `u:${u.id}`));
    // 先每句各出一題，題目不夠再同一句換一個挖空
    for (let round = 0; qs.length < n && round < 4; round++)
      lines.forEach(L => { if (qs.length >= n || round >= L.p.blanks.length) return;
        const ks = shuffle(L.p.blanks.map((_, k) => k)); const q = clozeQ(L, ks[round]); if (q && !qs.some(x => x.qid === q.qid)) qs.push(q); });
    return shuffle(qs).slice(0, n);
  }
  function forTree(key) {
    if (!bank) build();
    const out = [];
    bank.lines.filter(L => L.owner === `t:${key}`).forEach(L => L.p.blanks.forEach((_, k) => { const q = clozeQ(L, k); if (q) out.push(q); }));
    // 認藥題放在知識樹：這裡看不到藥名，才真的考得到「這是哪個藥」
    const ch = (PI.KNOWLEDGE[key] || {}).chapter;
    PI.UNITS.filter(u => u.chapter === ch).forEach(u => { const q = whichQ(u); if (q) out.push(q); });
    return out;
  }

  /* ---------- 介面 ---------- */
  let box, run = null;
  function ensureBox() {
    if (box) return box;
    box = document.createElement("section");
    box.className = "quiz"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "答題");
    document.getElementById("map").appendChild(box);
    box.addEventListener("click", e => {
      const o = e.target.closest("[data-opt]"); if (o) return choose(+o.dataset.opt);
      if (e.target.closest("[data-next]")) return next();
      if (e.target.closest("[data-hint]")) { run.hinted = true; draw(); return; }
      if (e.target.closest("[data-close]")) return close();
    });
    document.addEventListener("keydown", e => {
      if (!run || box.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (/^[1-4]$/.test(e.key) && run.picked === null && !run.finished) choose(+e.key - 1);
      else if (e.key === "Enter" && (run.picked !== null || run.finished)) { e.preventDefault(); run.finished ? close() : next(); }
    });
    return box;
  }
  function start(opts) {
    ensureBox();
    run = { ...opts, i: 0, right: 0, picked: null, hinted: false, finished: false };
    box.hidden = false; box.parentNode.classList.add("is-quizzing"); draw();   // 答題時把資訊卡、知識面板藏起來，不能偷看答案
    box.querySelector("button")?.focus();
  }
  function choose(k) {
    const q = run.qs[run.i]; if (run.picked !== null || !q.options[k]) return;
    run.picked = k;
    if (q.options[k].ok) { run.right++; run.onRight && run.onRight(q); }
    draw();
  }
  function next() {
    if (run.i + 1 >= run.qs.length) { run.finished = true; const ok = run.right >= run.need; run.onFinish && run.onFinish(ok, run.right); draw(); return; }
    run.i++; run.picked = null; run.hinted = false; draw();
  }
  function close() { box.hidden = true; box.parentNode.classList.remove("is-quizzing"); const r = run; run = null; r && r.onClose && r.onClose(); }

  function draw() {
    const r = run;
    const head = `<div class="q-head"><div class="q-title"><span class="muted">${esc(r.kicker)}</span><h3>${esc(r.title)}</h3></div>
      <button type="button" class="close" data-close aria-label="關閉">×</button></div>`;
    if (r.finished) {
      const ok = r.right >= r.need;
      box.innerHTML = `<div class="q-card">` + head + `<div class="q-result ${ok ? "is-ok" : "is-bad"}">
          <p class="q-score">答對 <b>${r.right}</b> / ${r.qs.length}</p>
          <p>${esc(ok ? (typeof r.okText === "function" ? r.okText() : r.okText) : r.badText)}</p></div>
        <div class="q-foot"><button type="button" class="btn btn-primary" data-close>${ok ? "好" : "再看一下"}</button></div></div>`;
      box.querySelector("[data-close].btn").focus();
      return;
    }
    const q = r.qs[r.i], done = r.picked !== null;
    const dots = r.qs.map((_, k) => `<i class="${k < r.i ? "done" : k === r.i ? "now" : ""}"></i>`).join("");
    box.innerHTML = `<div class="q-card">` + head + `<div class="q-meta"><span class="q-dots" aria-label="第 ${r.i + 1} 題，共 ${r.qs.length} 題">${dots}</span><span class="q-label">${esc(q.label)}</span></div>
      <div class="q-prompt">${done && q.kind === "cloze" ? q.answer : q.prompt}</div>
      ${q.hint && !done ? (r.hinted ? `<p class="q-hint">${esc(q.hint)}</p>` : `<button type="button" class="link-btn q-hint-btn" data-hint>看口訣提示</button>`) : ""}
      <div class="q-opts">${q.options.map((o, k) => {
        const cls = done ? (o.ok ? "is-right" : k === r.picked ? "is-wrong" : "is-dim") : "";
        return `<button type="button" class="q-opt ${cls}" data-opt="${k}" ${done ? "disabled" : ""}><span class="q-key">${k + 1}</span>${esc(o.text)}</button>`;
      }).join("")}</div>
      ${done ? `<div class="q-feedback ${q.options[r.picked].ok ? "is-ok" : "is-bad"}">
          <b>${q.options[r.picked].ok ? "答對了！" : "差一點！"}</b>${q.kind === "which" ? " " + q.answer : ""}${q.hint ? `<span class="q-hint">${esc(q.hint)}</span>` : ""}</div>
        <div class="q-foot"><button type="button" class="btn btn-primary" data-next>${r.i + 1 >= r.qs.length ? "看結果" : "下一題"}</button></div>` : ""}</div>`;
    (done ? box.querySelector("[data-next]") : box.querySelector(".q-opt"))?.focus();
  }

  return {
    forUnit, forTree, start,
    rebuild() { bank = null; },   // 知識卡片改過之後重建題庫
    countTree: key => forTree(key).length,
    isOpen: () => !!run
  };
})();
