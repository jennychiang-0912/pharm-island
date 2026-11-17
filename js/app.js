/* PHARMA ISLAND：介面
   導覽列、左側面板、格子資訊卡、設定。地圖與進度的細節交給 map.js、state.js。 */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const catOf = id => PI.CATEGORIES.find(c => c.id === id);
  const chOf = id => PI.CHAPTERS.find(c => c.id === id);
  const STATUS = { occupied: "已佔領", available: "可挑戰", locked: "未解鎖" };

  /* 挖空句子：{{答案|類型}} 是挖空處，句尾「 #口訣」是提示。平常顯示時把答案標出來 */
  const CLOZE = /\{\{([^{}|]+)(?:\|([^{}]*))?\}\}/g;
  const splitHint = line => { const i = line.search(/\s#/); return i < 0 ? [line, ""] : [line.slice(0, i), line.slice(i).trim()]; };
  const blanks = line => (splitHint(line)[0].match(CLOZE) || []).length;
  /* 講義的字型樣式（放在已經 esc 過的 HTML 上）：[i]斜體[/i]、[u]底線[/u]、\n 換行。
     行首「- 」＝縮排的子項目（空心點）、「> 」＝縮排的接續行（不加點）、「→」＝縮排、箭頭照樣顯示；「- 」「> 」記號本身拿掉。
     記號不要放進挖空 {{…}} 裡，選項會直接看到記號。 */
  const fmt = h => h.replace(/^(- |&gt; )/, "").replace(/\[(\/?)([iu])\]/g, "<$1$2>").replace(/\n/g, "<br>");
  PI.fmt = fmt;   // quiz.js 的題目也用同一套
  const subCls = l => /^\s*(→|> )/.test(l) ? ' class="k-sub k-arrow"' : /^\s*- /.test(l) ? ' class="k-sub"' : "";
  function clozeLine(line, noHint) {
    const [text, hint] = splitHint(line);
    const body = fmt(esc(text).replace(CLOZE, (m, ans, type) => `<mark class="cloze" title="${esc((type || "").split("|")[0])}">${ans}</mark>`));
    return body + (hint && !noHint ? ` <span class="hint">${esc(hint)}</span>` : "");
  }
  // 這個單元資料裡的口訣（句尾的 #…），當作筆記欄的預設內容
  const noteText = u => PI.state.getNote(u.id) ?? mnemonicsOf(u).join("\n");
  const noteRows = u => Math.min(8, Math.max(2, noteText(u).split("\n").length));   // 筆記欄高度跟著行數，口訣不會被切掉
  const mnemonicsOf = u => (PI.UNIT_FIELDS || []).flatMap(([k]) => u[k] || []).map(l => splitHint(l)[1]).filter(Boolean);

  let focus = null;        // 目前篩選的章節
  let current = null;      // 目前選取的格子

  const cells = PI.map.init($("map"), { onSelect: showInfo, onSelectIsland: showIsland, onOpenTree: openKnowledge });

  /* ---------- 島的解鎖：完成一座島（格子全部佔領＋告示牌的題目全部答對）才能進入下一座島 ----------
     順序照 PI.CHAPTERS；沒有內容的章節跳過。已經佔領過格子的島維持開放（舊進度不會被鎖住）。 */
  const islandOrder = PI.CHAPTERS.map(ch => ch.id).filter(id => cells.some(c => c.chapter === id && c.unit));
  let treeQidCache = null, openCache = null;
  const rebuild0 = PI.quiz.rebuild;
  PI.quiz.rebuild = () => { rebuild0(); treeQidCache = null; openCache = null; };   // 知識卡片改過：題目跟著變
  function signQids(chId) {   // 這座島所有告示牌的題目
    if (!treeQidCache) treeQidCache = new Map();
    if (!treeQidCache.has(chId)) treeQidCache.set(chId, [...new Set(Object.keys(PI.KNOWLEDGE || {})
      .filter(k => PI.KNOWLEDGE[k].chapter === chId).flatMap(k => PI.quiz.forTree(k).map(q => q.qid)))]);
    return treeQidCache.get(chId);
  }
  function signProgress(chId) { const q = signQids(chId); return { done: q.filter(id => PI.state.isTreeDone(id)).length, total: q.length }; }
  function islandCleared(chId) {
    const pr = PI.state.chapterProgress(cells, chId), sp = signProgress(chId);
    return pr.done >= pr.total && sp.done >= sp.total;
  }
  const prevIsland = chId => { const i = islandOrder.indexOf(chId); return i > 0 ? islandOrder[i - 1] : null; };
  function computeOpen() {
    const open = new Set();
    islandOrder.forEach((id, i) => {
      if (i === 0 || cells.some(c => c.chapter === id && PI.state.isOccupied(c.id)) || (open.has(islandOrder[i - 1]) && islandCleared(islandOrder[i - 1]))) open.add(id);
    });
    PI.CHAPTERS.forEach(ch => { if (!islandOrder.includes(ch.id)) open.add(ch.id); });
    return open;
  }
  /* ---------- 小白標流程（PI.GROUP_GATE）：告示牌 → 小白標 → 這一類的格子 → 佔領完換下一個小白標 → 整座島完成解鎖下一座 ----------
     小白標＝地圖上白色的小分類名牌（group）。順序照這一章格子在 PI.UNITS 裡出現的先後。
     告示牌的題目：知識樹裡「沒有分類」的卡片的挖空題。完成告示牌，第一個小白標才打開。
     小白標的題目：知識樹裡這一類卡片的挖空題＋這一類「通論」格子（type: topic）的題目。
       小白標打開後：通論格子可以直接挑戰；小白標的題目全部答對過，這一類其他格子才能挑戰。
     這一類的格子全部佔領 → 下一個小白標打開。沒有分類的格子：告示牌完成就能挑戰。
     不開 PI.GROUP_GATE 的科目維持原本規則（起點格＋緊鄰已佔領格）。 */
  const treeKeyOf = chId => Object.keys(PI.KNOWLEDGE || {}).find(k => PI.KNOWLEDGE[k].chapter === chId);
  const unitById = id => PI.UNITS.find(u => u.id === id);
  const itemGroups = it => [].concat(it.group || (it.unit && (unitById(it.unit) || {}).group) || []);
  let flowCache = new Map();
  const rebuild1 = PI.quiz.rebuild;
  PI.quiz.rebuild = () => { rebuild1(); flowCache = new Map(); };
  function flowOf(chId) {   // 題目 id 清單（不會變，快取起來）
    if (flowCache.has(chId)) return flowCache.get(chId);
    const key = treeKeyOf(chId), K = key && PI.KNOWLEDGE[key];
    const tq = key ? PI.quiz.forTree(key) : [];
    const pref = test => K ? (K.sections || []).flatMap((sec, si) => (sec.items || []).map((it, ii) => [it, ii])
      .filter(([it]) => !it.unit && test(itemGroups(it))).map(([, ii]) => `t:${key}:${si}:${ii}:`)) : [];
    const pick = ps => tq.filter(q => ps.some(p => q.qid.startsWith(p))).map(q => q.qid);
    const groups = [...new Set(PI.UNITS.filter(u => u.chapter === chId && u.group).map(u => u.group))];
    const f = { key, sign: pick(pref(gs => !gs.length)), groups,
      white: new Map(groups.map(g => [g, [...pick(pref(gs => gs.includes(g))),
        ...PI.UNITS.filter(u => u.chapter === chId && u.type === "topic" && u.group === g).flatMap(u => PI.quiz.allForUnit(u).map(q => q.qid))]])) };
    flowCache.set(chId, f); return f;
  }
  const allDone = ids => ids.every(id => PI.state.isTreeDone(id));
  const groupCleared = (chId, g) => cells.filter(c => c.chapter === chId && c.unit && c.unit.group === g).every(c => PI.state.isOccupied(c.id));
  function flowState(chId) {   // 告示牌完成了沒、現在輪到哪一個小白標
    const f = flowOf(chId), signOk = allDone(f.sign);
    const current = f.groups.find(g => !groupCleared(chId, g)) || null;
    return { f, signOk, current };
  }
  const groupOpen = (chId, g) => { const s = flowState(chId); return s.signOk && (!g || groupCleared(chId, g) || g === s.current); };
  function cellGate(cell) {
    if (!PI.GROUP_GATE) return undefined;
    const g = cell.unit.group;
    if (!groupOpen(cell.chapter, g)) return false;
    if (!g || cell.unit.type === "topic") return true;
    return allDone(flowOf(cell.chapter).white.get(g) || []);
  }
  // 格子為什麼還不能挑戰（資訊卡上的說明＋按鈕）
  function flowLock(cell) {
    if (!PI.GROUP_GATE) return null;
    const s = flowState(cell.chapter), g = cell.unit.group, cnt = ids => `${ids.filter(id => PI.state.isTreeDone(id)).length} / ${ids.length}`;
    if (!s.signOk) return { text: `🔒 先完成這座島的告示牌題目（${cnt(s.f.sign)}），小白標才會打開。`, btn: "打開告示牌", key: s.f.key, group: null };
    if (g && !groupOpen(cell.chapter, g)) return { text: `🔒 先佔領完小白標「${s.current}」這一類的格子，才會輪到「${g}」。`, btn: `前往「${s.current}」`, key: s.f.key, group: s.current };
    const w = g && s.f.white.get(g) || [];
    if (g && !allDone(w)) return { text: `🔒 先完成小白標「${g}」的題目（${cnt(w)}），這一類的格子才能挑戰。`, btn: "打開小白標", key: s.f.key, group: g };
    return null;
  }
  PI.state.setCellGate(cellGate);

  const islandOpen = chId => (openCache || (openCache = computeOpen())).has(chId);
  PI.state.setGate(islandOpen);
  PI.map.render();
  function lockNote(chId) {
    const p = prevIsland(chId), ch = p && chOf(p); if (!ch) return "";
    const pr = PI.state.chapterProgress(cells, p), sp = signProgress(p);
    return `🔒 先完成第 ${ch.id} 章「${ch.short || ch.name}」才能進入這座島：佔領全部格子（${pr.done}/${pr.total}），並答對告示牌的全部題目（${sp.done}/${sp.total}）。`;
  }

  /* ---------- 導覽列與玩家面板 ---------- */
  function renderStats() {
    const p = PI.state.progress(cells);
    $("topTerritory").textContent = `領土 ${p.done} 格`;
    $("topLevel").textContent = `LV. ${p.level}`;
    $("pLevel").textContent = `LV. ${p.level}`;
    $("pExpText").textContent = `EXP ${p.expInLevel} / ${p.expNeed}`;
    $("pExpBar").querySelector("i").style.width = `${p.expInLevel / p.expNeed * 100}%`;
    $("pExpBar").setAttribute("aria-valuenow", p.expInLevel);
    $("pExpBar").setAttribute("aria-valuemax", p.expNeed);
    $("pCells").textContent = p.done;
    $("pPct").textContent = `${p.pct}%`;
  }

  /* ---------- 章節篩選 ---------- */
  function renderChapters() {
    $("chapterList").innerHTML = PI.CATEGORIES.map(cat => {
      const chs = PI.CHAPTERS.filter(c => c.cat === cat.id);
      return `<div class="cat"><p class="cat-name"><span class="dot" style="background:${cat.color}"></span>${esc(cat.name)}</p>
        ${chs.map(ch => {
          const pr = PI.state.chapterProgress(cells, ch.id);
          return `<button type="button" class="ch-btn" data-ch="${ch.id}" aria-pressed="${focus === ch.id}">
            <span class="ch-no" style="background:${cat.tint};border-color:${cat.color}">${ch.id}</span>
            <span class="ch-name">${esc(ch.name)}</span>
            <span class="ch-prog">${pr.done}/${pr.total}</span></button>`;
        }).join("")}</div>`;
    }).join("");
    $("allBtn").setAttribute("aria-pressed", focus === null);
  }
  function setFocus(chId) {
    focus = chId;
    if (chId === null && !current) $("info").hidden = true;   // 回到全島時關掉島嶼資訊卡
    PI.map.focusChapter(chId);
    renderChapters();
  }
  $("chapterList").addEventListener("click", e => {
    const b = e.target.closest(".ch-btn"); if (!b) return;
    const id = +b.dataset.ch;
    setFocus(focus === id ? null : id);
  });
  $("allBtn").onclick = () => setFocus(null);

  /* ---------- 格子資訊卡 ---------- */
  function badge(ch, cat) { return `<span class="ch-no" style="background:${cat.tint};border-color:${cat.color}">${ch.id}</span>`; }
  function showInfo(cell) {
    current = cell;
    const box = $("info");
    if (!cell) { box.hidden = true; return; }
    const ch = chOf(cell.chapter), cat = catOf(ch.cat), st = PI.state.statusOf(cell);
    const u = cell.unit;
    let note = {
      available: "這格可以挑戰：每次 5 題，答對的知識點會記住，全部答對過就佔領。",
      locked: islandOpen(cell.chapter) ? "先佔領旁邊的格子，這格才會解鎖。" : lockNote(cell.chapter),
      occupied: "這格已經是你的領土了。"
    }[st];
    const why = st === "locked" && islandOpen(cell.chapter) ? flowLock(cell) : null;   // 小白標流程：為什麼還不能挑戰
    if (why) note = why.text;
    box.innerHTML = `<div class="info-top">${badge(ch, cat)}
        <div class="info-title"><h3>${u ? esc(u.name) : "預留格"}${u && titleBits(u).zh ? ` <span class="u-zh">${esc(titleBits(u).zh)}</span>` : ""}${u && u.group ? ` <span class="tag tag-inline">${esc(u.group)}</span>` : ""}</h3>
          ${u && titleBits(u).alias ? `<span class="u-alias">${esc(titleBits(u).alias)}</span>` : ""}<span class="muted">第 ${ch.id} 章・${esc(ch.name)}</span></div>
        <button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      ${u ? unitBody(u) : ""}
      ${u ? `<div class="u-note"><label for="uNote">我的筆記<span class="muted" id="uNoteSaved"></span></label>
        <textarea id="uNote" rows="${noteRows(u)}" placeholder="寫下自己的口訣或重點…">${esc(noteText(u))}</textarea></div>` : ""}
      ${u ? progressBars(cell, st) : ""}
      <p>${note}</p>
      ${why && why.btn ? `<div class="info-actions"><button type="button" class="btn btn-primary" id="infoGate">${esc(why.btn)}</button></div>`
        : u && st !== "locked" ? `<div class="info-actions"><button type="button" class="btn btn-primary" id="infoQuiz">${st === "available" ? "挑戰這格" : "再練習一次"}</button></div>` : ""}`;
    box.hidden = false;
    $("infoClose").onclick = () => PI.map.select(null);
    if ($("infoQuiz")) $("infoQuiz").onclick = () => challenge(cell);
    if ($("infoGate")) $("infoGate").onclick = () => openKnowledge(why.key, why.group);
    if ($("uNote")) {   // 筆記：打字時自動存（存在瀏覽器，和進度放在一起）
      let t = 0;
      $("uNote").oninput = e => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => { PI.state.setNote(u.id, v); $("uNoteSaved").textContent = "已儲存"; }, 400); $("uNoteSaved").textContent = ""; };
      $("uNote").onkeydown = e => e.stopPropagation();   // 在筆記裡打字時，不要觸發地圖或答題的快捷鍵
    }
  }

  /* 挑戰格子：每次隨機 5 題，先出還沒答對過的知識點；答對的知識點會記住（攻略進度），
     這格的知識點全部答對過就佔領，並直接跳到下一個可挑戰的格子。已佔領的格子練習時隨機 3 題。 */
  const pointsOf = u => PI.quiz.allForUnit(u);
  function cellProgress(cell) {
    const all = pointsOf(cell.unit), done = all.filter(q => PI.state.isTreeDone(q.qid)).length;
    return { all, done, total: all.length };
  }
  const bar = (label, done, total, unit) => `<div class="isl-prog"><div class="isl-prog-top"><span>${label}</span><b>${done}<small> / ${total} ${unit}</small></b></div>
      <div class="isl-bar"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></div></div>`;
  function challenge(cell) {
    const practice = PI.state.statusOf(cell) === "occupied";
    if (!practice && PI.state.statusOf(cell) !== "available") { showInfo(cell); return; }
    const { all } = cellProgress(cell);
    if (!all.length) { $("info").querySelector("p:last-of-type").textContent = "這格的資料還不夠出題。"; return; }
    const rnd = a => a.sort(() => Math.random() - .5);
    const qs = practice ? rnd([...all]).slice(0, 3)
      : [...rnd(all.filter(q => !PI.state.isTreeDone(q.qid))), ...rnd(all.filter(q => PI.state.isTreeDone(q.qid)))].slice(0, 5);   // 還沒答對的先出，不夠 5 題再用答對過的複習
    const ch = chOf(cell.chapter);
    let won = false;
    PI.quiz.start({ qs, need: 0, skipOk: () => won, kicker: `第 ${ch.id} 章・${ch.name}`, title: `${practice ? "練習" : "挑戰"}：${cell.unit.name}`, blindTitle: `${practice ? "練習" : "挑戰"}：這格的藥是？`,
      onRight: q => { PI.state.markTree(q.qid); },
      okText: () => practice ? "複習完成！" : `還差 ${cellProgress(cell).total - cellProgress(cell).done} 個知識點就能佔領這格，再挑戰一次吧！`,
      resultHtml: () => practice ? "" : `<div class="q-prog">${bar("攻略進度", cellProgress(cell).done, cellProgress(cell).total, "知識點")}</div>`,
      onFinish: () => { if (!practice) { const p = cellProgress(cell); if (p.done >= p.total) { won = true; PI.state.occupy(cell.id); } } },
      onClose: () => { won ? goNext(cell) : showInfo(cell); } });
  }
  /* 資訊卡上的兩條進度：這格的攻略進度（知識點）、這座島的佔領進度（格子） */
  function progressBars(cell, st) {
    const p = cellProgress(cell), pr = PI.state.chapterProgress(cells, cell.chapter);
    const done = st === "occupied" ? p.total : p.done;
    return `<div class="isl-stats info-prog">${p.total ? bar("這格攻略", done, p.total, "知識點") : ""}${bar("此島攻略", pr.done, pr.total, "格")}</div>`;
  }
  /* 下一格：剛解鎖、在旁邊的格子優先（同一小分類 > 同一章），沒有的話找這一章其他可挑戰的格子 */
  function goNext(cell) {
    const avail = c => c.unit && PI.state.statusOf(c) === "available";
    const byId = new Map(cells.map(c => [c.id, c]));
    const near = cell.neighbors.map(id => byId.get(id)).filter(c => c && avail(c));
    const rank = c => (c.chapter === cell.chapter ? 2 : 0) + (cell.unit.group && c.unit.group === cell.unit.group ? 1 : 0);
    const next = near.sort((a, b) => rank(b) - rank(a))[0] || cells.find(c => c.chapter === cell.chapter && avail(c));
    const pr = PI.state.chapterProgress(cells, cell.chapter), sp = signProgress(cell.chapter);
    if (next) { toast(`佔領成功！+${PI.LEVEL.expPerCell} EXP`); PI.map.select(next.id); return; }
    if (pr.done >= pr.total && sp.done < sp.total) {   // 格子都佔領了：告示牌的題目還沒答完
      toast(`這座島的格子都佔領了 🎉 答對告示牌的全部題目（${sp.done}/${sp.total}）就能進入下一座島`);
      PI.map.select(null); showIsland(cell.chapter); return;
    }
    toast(`佔領成功！+${PI.LEVEL.expPerCell} EXP`);
    PI.map.select(cell.id);
  }
  function toast(text) {
    let t = $("piToast");
    if (!t) { t = document.createElement("div"); t.id = "piToast"; t.className = "pi-toast"; t.setAttribute("role", "status"); $("map").appendChild(t); }
    t.textContent = text; t.classList.remove("is-on"); void t.offsetWidth; t.classList.add("is-on");
  }

  /* 標題列：科目設定 PI.UNIT_TITLE_FIELD 時（生藥是 names），「中文：…」放在名稱旁邊，其他名稱（英文、別名）小字放下面 */
  const plainOf = l => splitHint(l)[0].replace(CLOZE, "$1");
  function titleBits(u) {
    const f = PI.UNIT_TITLE_FIELD, lines = (f && u[f]) || [];
    const zhLine = lines.find(l => /^中文：/.test(plainOf(l)));
    return { zh: zhLine ? plainOf(zhLine).replace(/^中文：/, "") : "",
             alias: lines.filter(l => l !== zhLine).map(plainOf).join("・") };
  }
  /* 單元內容：分成幾個框框。科目可以用 PI.UNIT_BOXES 把幾個欄位放進同一框（例如生藥的「來源」＝基源＋科別＋部位）；
     沒有設定時，每個欄位一框，短的兩框並排。 */
  function unitBody(u) {
    const F = Object.fromEntries(PI.UNIT_FIELDS || []), has = k => u[k] && u[k].length;
    const list = k => u[k].length === 1 ? `<p class="u-one">${clozeLine(u[k][0], true)}</p>`
      : `<ul>${u[k].map(l => `<li${subCls(l)}>${clozeLine(l, true)}</li>`).join("")}</ul>`;   // 口訣移到下面的筆記欄
    // 框框裡的小欄位（例如來源的基源）：好幾項就接在同一行，不用點點；項目裡有「：」（自己是一小段說明）時改用「；」分開
    const inline = k => `<p class="u-one">${u[k].map(l => clozeLine(l, true)).join(u[k].some(l => /：/.test(plainOf(l))) ? "；" : "、")}</p>`;
    const used = new Set(PI.UNIT_TITLE_FIELD && titleBits(u).zh ? [PI.UNIT_TITLE_FIELD] : []);
    const boxes = (PI.UNIT_BOXES || []).map(b => ({ ...b, fields: b.fields.filter(has) })).filter(b => b.fields.length);
    boxes.forEach(b => b.fields.forEach(k => used.add(k)));
    (PI.UNIT_FIELDS || []).forEach(([k, label]) => { if (has(k) && !used.has(k)) boxes.push({ label, fields: [k], auto: true }); });
    const rows = boxes.map(b => {
      if (b.fields.length > 1)   // 一框裡好幾個欄位：左邊小標、右邊內容
        return `<div class="u-row is-wide"><span class="u-label">${esc(b.label || "")}</span><div class="u-sub">${b.fields.map(k =>
          `<span class="u-sublabel">${esc(F[k] || k)}</span><div>${inline(k)}</div>`).join("")}</div></div>`;
      const k = b.fields[0], wide = !b.auto || u[k].length > 2 || u[k].some(l => plainOf(l).length > 18);
      return `<div class="u-row${wide ? " is-wide" : ""}"><span class="u-label">${esc(b.label || F[k] || k)}</span>${list(k)}</div>`;
    }).join("");
    const extra = [u.generation, u.source && `出處：${u.source}`].filter(Boolean).map(esc).join("・");
    const cls = u.class ? `<p class="u-class">類別共通內容（機轉、藥動、副作用等）在本章知識樹</p>` : "";
    // 結構圖（藥化）：講義裁下來的原圖，放在最上面
    const img = u.img ? `<figure class="u-struct">${[u.img, ...(u.imgMore || [])].map(s => `<img src="${esc(s)}" alt="${esc(u.name)} 結構" loading="lazy">`).join("")}</figure>` : "";   // imgMore：講義同一格旁邊的其他結構（例如 urea、malonic acid）
    return img || rows || cls || extra ? `<div class="u-body">${img}${rows}${cls}${extra ? `<p class="u-meta">${extra}</p>` : ""}</div>` : "";
  }

  /* ---------- 島嶼資訊卡：點島嶼的海岸或章節牌子 ---------- */
  function showIsland(chId) {
    current = null;
    if (focus !== chId) setFocus(chId);
    const ch = chOf(chId), cat = catOf(ch.cat), isl = PI.map.islands.find(i => i.chapter === chId);
    const pr = PI.state.chapterProgress(cells, chId);
    const box = $("info");
    box.innerHTML = `<div class="info-top">${badge(ch, cat)}
        <div class="info-title"><h3>${esc(ch.name)}</h3><span class="muted">${esc(cat.name)}</span></div>
        <button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      <div class="isl-stats">
        <div class="isl-prog"><div class="isl-prog-top"><span>已佔領</span><b>${pr.done}<small> / ${pr.total} 格</small></b></div>
          <div class="isl-bar"><i style="width:${pr.total ? Math.round(pr.done / pr.total * 100) : 0}%"></i></div></div>
        <div class="isl-num"><b>${isl.unitCount}</b><span>${esc(PI.UNIT_TYPES[ch.unitType] || "單元")}</span></div>
        ${isl.slotCount ? `<div class="isl-num"><b>${isl.slotCount}</b><span>預留格</span></div>` : ""}</div>
      ${signProgress(chId).total ? `<div class="isl-stats">${bar("告示牌題目", signProgress(chId).done, signProgress(chId).total, "題")}</div>` : ""}
      <p class="isl-gate">${!islandOpen(chId) ? esc(lockNote(chId))
        : islandCleared(chId) ? "✓ 這座島已經完成" + (islandOrder.indexOf(chId) < islandOrder.length - 1 ? "，下一座島已解鎖。" : "！")
        : "完成這座島（格子全部佔領＋告示牌的題目全部答對）就能進入下一座島。"}</p>`;
    box.hidden = false;
    $("infoClose").onclick = () => { box.hidden = true; };
  }

  /* ---------- 知識面板：點知識樹打開，關閉後地圖回到打開前的位置 ---------- */
  let kView = null, kFrom = null, kKey = null, kEditing = null, kFull = false, kGroup = null, kAllMode = false;   // kEditing：正在編輯的卡片 key；kFull：知識面板全螢幕
  // group：只看某一個結構分類（地圖上的好萊塢名牌）——只列出 item.group 是這一類的卡片和這一類的題目
  function openKnowledge(key, group, all) {
    group = group || null; all = !group && !!all;
    if (kKey !== key || kGroup !== group) kEditing = null;
    kKey = key; kGroup = group; kAllMode = all;
    const K = (PI.KNOWLEDGE || {})[key]; if (!K) return;
    const land = PI.LANDMASSES.find(l => l.chapters.includes(K.chapter)) || { name: "" };
    if ($("kpanel").hidden) { kView = PI.map.getView(); kFrom = document.activeElement; }   // 換別棵樹時不覆蓋最早的位置
    $("info").hidden = true;
    const ch = chOf(K.chapter), cat = catOf(ch.cat);
    const chips = `<span class="k-chip">${badge(ch, cat)}第 ${ch.id} 章</span>`;
    const unitOf = id => PI.UNITS.find(u => u.id === id);
    const refItem = u => `<article class="k-item is-ref">
        <h4>${esc(u.name)}</h4>
        ${u.img ? `<figure class="u-struct">${[u.img, ...(u.imgMore || [])].map(s => `<img src="${esc(s)}" alt="${esc(u.name)} 結構" loading="lazy">`).join("")}</figure>` : ""}
        ${(PI.UNIT_FIELDS || []).filter(([k]) => u[k] && u[k].length).map(([k, label]) =>
          `${k === "points" ? "" : `<p class="k-field">${esc(label)}</p>`}<ul>${u[k].map(l => `<li${subCls(l)}>${clozeLine(l)}</li>`).join("")}</ul>`).join("")}
        <p class="k-src">在格子「${esc(u.short || u.name)}」上作答${u.source ? `・出處：${esc(u.source)}` : ""}</p></article>`;
    // 考點標記（js/edits.js 的 MARKS）：放在那一行最前面
    const mk = (it, li) => { const t = (it.marks || {})[li], M = PI.edits && PI.edits.MARKS[t];
      return M ? `<span class="k-mark m-${t}" title="${esc(M.label)}">${esc(M.short)}</span>` : ""; };
    // 一行：k-line 包住正文（data-li＝第幾行），自己用螢光筆標的考點加 is-hl
    //   編輯中的卡片（edNow）：同一行直接變成可以打字的字（edLine），看起來跟平常一樣
    let edNow = false;
    const line = (it, li, raw) => {
      if (edNow) return mk(it, li) + edLine(it, li, raw);
      const km = (it.kmaps || {})[li], src = it.hlsrc || {}, [text, hint] = splitHint(raw); let k = -1;
      const body = esc(text).replace(CLOZE, (m, ans, type) => { k++;
        const hk = km && typeof km[k] === "string" ? km[k] : null, hs = hk ? (src[`${li}:${hk}`] || "mine") : "";
        return `<mark class="cloze${hk ? ` is-hl hl-${hs}` : ""}" data-k="${k}" title="${hk ? esc((PI.edits.MARKS[hs] || {}).label || "") + "（螢光筆考點）" : esc((type || "").split("|")[0])}">${ans}</mark>`; });
      return `${mk(it, li)}<span class="k-line" data-li="${li}">${fmt(body)}</span>${hint ? ` <span class="hint">${esc(hint)}</span>` : ""}`;
    };
    const item = (it, si, ii) => {
      if (it.unit) return unitOf(it.unit) ? refItem(unitOf(it.unit)) : "";   // 引用格子：這一版不開放修改
      const ekey = PI.edits ? PI.edits.keyOf(key, si, ii) : "";
      if (it.hidden) return `<article class="k-item is-hidden" data-key="${esc(ekey)}"><div class="k-item-head">
          <p class="muted">已隱藏的卡片：${esc(it.title || "（無標題）")}</p>
          <div class="k-tools"><button type="button" class="k-tool" data-act="unhide">取消隱藏</button><button type="button" class="k-tool" data-act="restore">還原原文</button></div></div></article>`;
      const isEd = !!ekey && kEditing === ekey;
      edNow = isEd;
      const tools = !PI.edits ? "" : isEd ? "" : `<div class="k-tools">${it.edited ? `<span class="k-edited">已修改</span><button type="button" class="k-tool" data-act="restore">還原原文</button>` : ""}
          <button type="button" class="k-tool" data-act="edit">✎ 編輯</button></div>`;
      const bar = isEd ? `<div class="k-ed-bar"><span class="k-ed-tip">✎ 直接點字修改・反白文字可以畫螢光筆（畫的地方會出題）</span>
          <span class="k-ed-acts"><button type="button" class="k-tool is-main" data-act="save">完成</button><button type="button" class="k-tool" data-act="cancel">取消</button>
          <button type="button" class="k-tool" data-act="more" aria-label="更多">⋯</button></span>
          <span class="k-ed-more" hidden><button type="button" class="k-tool" data-act="hide">隱藏這張卡片</button>${it.edited ? `<button type="button" class="k-tool" data-act="restore">還原原文</button>` : ""}</span></div>
          <p class="k-ed-msg" role="alert" hidden></p>` : "";
      const pts = (it.points || []).map((p, i) => p ? `<li${edNow ? "" : subCls(p)}>${line(it, 1 + i, p)}</li>` : "").join("")
        + (it.extra || []).map(x => `<li class="is-extra">${line(it, "x" + x.id, x.text)}</li>`).join("");
      const head = isEd && it.title != null ? `<h4 class="ed-title" contenteditable="true" spellcheck="false">${esc(it.title)}</h4>` : it.title ? `<h4>${esc(it.title)}</h4>` : "<span></span>";
      const html = `<article class="k-item${isEd ? " k-edit" : ""}" data-key="${esc(ekey)}">${bar}
        <div class="k-item-head">${head}${tools}</div>
        ${it.text ? `<p>${line(it, 0, it.text)}</p>` : ""}
        ${it.image ? `<img class="k-img" src="${esc(it.image)}" alt="${esc(it.title || "")}" loading="lazy">` : ""}
        ${it.table ? tableHtml(it.table) : ""}
        ${it.gallery ? `<div class="k-gallery">${it.gallery.map(g => `<figure><img src="${esc(g.img)}" alt="${esc(g.cap || "")}" loading="lazy">${g.cap ? `<figcaption>${esc(g.cap)}</figcaption>` : ""}</figure>`).join("")}</div>` : ""}
        ${pts || isEd ? `<ul class="k-pts">${pts}</ul>` : ""}
        ${it.diagram ? `<figure class="k-diagram" title="點圖放大／再點一下縮回"><img src="${esc(it.diagram)}" alt="${esc(it.title || "示意圖")}" loading="lazy"></figure>
          ${PI.GLOSSARY && Object.keys(PI.GLOSSARY).length && !isEd ? `<p class="k-gl-row"><span class="muted">點名詞看小框框：</span>${Object.keys(PI.GLOSSARY).map(esc).join("・")}</p>` : ""}` : ""}
        ${it.flow ? (it.diagram ? `<details class="k-flow-wrap"${isEd ? " open" : ""}><summary>看文字步驟</summary>${flowHtml(it)}</details>` : flowHtml(it)) : ""}
        ${it.original ? `<details class="k-orig"><summary>看原始講義圖</summary><img class="k-img" src="${esc(it.original)}" alt="原始講義圖" loading="lazy"></details>` : ""}
        ${it.source ? `<p class="k-src">出處：${esc(it.source)}</p>` : ""}</article>`;
      edNow = false;
      return html;
    };
    // 表格（item.table）：{ head: ["欄1", …], rows: [[格, …], …], note: "表格下方的小字" }
    //   格可以是字串，或 { t: "內容", rs: 跨幾列, cs: 跨幾欄, b: true 粗體標題格, s: true 講義上的粗體字 }；被上一列跨過去的格子寫 null。
    //   head 也可以是好幾列（[[…], […]]，和講義一樣的雙層表頭），這時用 cols 給出題用的欄名。
    function tableHtml(T) {
      const tcl = t => fmt(esc(t).replace(CLOZE, (m, ans) => `<mark class="cloze">${ans}</mark>`)).replace(/(^|<br>)(- |&gt; )/g, "$1");   // 表格裡的挖空：標成考點
      const cell = (c, tag) => { if (c === null) return ""; const o = typeof c === "object" ? c : { t: c };
        const cl = [o.b && "is-b", o.s && "is-s", o.img && "is-img", o.band && "is-band"].filter(Boolean).join(" ");
        const body = o.img ? `<img src="${esc(o.img)}" alt="${esc(o.t || "結構")}" loading="lazy">` : tcl(o.t || "");   // { img: "…" }：格子裡放結構圖
        return `<${tag}${o.rs ? ` rowspan="${o.rs}"` : ""}${o.cs ? ` colspan="${o.cs}"` : ""}${cl ? ` class="${cl}"` : ""}>${body}</${tag}>`; };
      const heads = !T.head ? [] : Array.isArray(T.head[0]) ? T.head : [T.head];
      return `<div class="k-table-wrap"><table class="k-table${T.lastRed ? " last-red" : ""}${heads.length > 1 ? " multi-head" : ""}">${heads.length ? `<thead>${heads.map(r => `<tr>${r.map(h => cell(h, "th")).join("")}</tr>`).join("")}</thead>` : ""}
        <tbody>${T.rows.map(r => `<tr>${r.map(c => cell(c, "td")).join("")}</tr>`).join("")}</tbody></table></div>
        ${T.note ? `<p class="k-table-note">${tcl(T.note)}</p>` : ""}`;
    }
    // 流程圖：一步一步往下，被藥擋住的步驟旁邊有「⊖ 抑制」框
    //   li：每一行的位置，順序和出題一樣（text、points 之後接流程；抑制框固定佔 3 行）
    function flowHtml(it) {
      let li = 1 + (it.points || []).length;
      return `<ol class="k-flow">${it.flow.map((st, i) => {
        const texts = (st.text || []).map(t => { const n = li++; return t ? `<p>${line(it, n, t)}</p>` : ""; }).join("");
        let block = "";
        if (st.block) {
          const [a, b, c] = [li, li + 1, li + 2]; li += 3;
          const B = st.block;
          block = B.label || B.drugs || B.note ? `<div class="k-block"><span class="k-block-tag">⊖ 抑制</span>
              ${B.label ? `<p class="k-block-label">${line(it, a, B.label)}</p>` : ""}
              ${B.drugs ? `<p class="k-block-drugs">${line(it, b, B.drugs)}</p>` : ""}
              ${B.note ? `<p class="k-block-note">${line(it, c, B.note)}</p>` : ""}</div>` : "";
        }
        return `<li class="k-step">
          <span class="k-step-no">${i + 1}</span>
          <div class="k-step-body"><b class="k-step-title">${esc(st.title || "")}</b>${texts}${block}</div></li>`;
      }).join("")}</ol>`;
    }
    // 這棵樹有幾題（一個挖空＝一題）；看單一結構分類時，只算這一類卡片的題目和這一類生藥的認藥題
    const signOnly = PI.GROUP_GATE && !group && !all;   // 小白標流程：告示牌只放沒有分類的卡片，有分類的放進小白標
    const inGroup = (sec, si) => (sec.items || []).map((it, ii) => [it, ii]).filter(([it]) => group ? itemGroups(it).includes(group) : !signOnly || !itemGroups(it).length);   // 引用格子的卡片用那一格的 group
    const prefixes = group ? (K.sections || []).flatMap((sec, si) => inGroup(sec, si).map(([, ii]) => `t:${key}:${si}:${ii}:`)) : null;
    const flowF = PI.GROUP_GATE ? flowOf(K.chapter) : null;
    const signSet = flowF && !group ? new Set(flowF.sign) : null;   // 小白標流程：告示牌只考沒有分類的卡片、沒有分類的藥
    const treeQs = [...PI.quiz.forTree(key).filter(q => signSet ? (signSet.has(q.qid) || (/^[ws]:/.test(q.qid) && !(unitById(q.qid.slice(2)) || {}).group)) : !group || prefixes.some(p => q.qid.startsWith(p))
      || (/^[ws]:/.test(q.qid) && (unitById(q.qid.slice(2)) || {}).group === group)),   // 這一類藥的認藥題、認結構題
      ...(group ? PI.UNITS.filter(u => u.chapter === K.chapter && u.type === "topic" && u.group === group).flatMap(u => PI.quiz.allForUnit(u)) : [])], nQ = treeQs.length;   // 小白標：這一類通論格子的題目
    const nDone = treeQs.filter(q => PI.state.isTreeDone(q.qid)).length;
    const sgList = flowF ? (flowF.groups || []) : [];
    const expQ = PI.LEVEL.expPerTreeQuestion || 0;
    const nRef = (K.sections || []).flatMap(sec => sec.items || []).filter(it => it.unit).length;
    $("kpanel").innerHTML = `<div class="k-head">
        <div class="info-title"><span class="muted">${land.name ? esc(land.name) + "・" : ""}${group ? `${esc(K.title || ch.name)}・結構分類` : "知識樹"}</span><h3 id="kTitle">${esc(group || K.title || ch.name)}</h3></div>
        ${group || signOnly ? `<button type="button" class="k-full-btn" id="kAll">看整棵知識樹</button>` : all && PI.GROUP_GATE ? `<button type="button" class="k-full-btn" id="kSign">回告示牌</button>` : ""}
        <button type="button" class="k-full-btn" id="kFull" aria-pressed="${kFull}">${kFull ? "縮小" : "⛶ 全螢幕"}</button>
        <button type="button" class="close" id="kClose" aria-label="關閉知識面板">×</button></div>
      ${chips ? `<div class="k-chips">${chips}</div>` : ""}

      <div class="k-exp${nQ ? " is-btn" : ""}">${group && flowF && !groupOpen(K.chapter, group) ? `<p>🔒 ${flowState(K.chapter).signOk ? `先佔領完小白標「${esc(flowState(K.chapter).current)}」這一類的格子，才會輪到這個小白標。` : "先完成這座島的告示牌題目，小白標才會打開。"}</p>`
        : nQ ? `<button type="button" class="btn btn-primary" id="kQuiz">開始答題（${Math.min(5, nQ)} 題）</button>`
        : signOnly ? `<p>這座島的告示牌沒有總論題目，直接從下面的小白標開始。</p>`
        : nRef ? `<p>★ 這裡的挖空題在本章的格子上作答，佔領一格 <b>+${PI.LEVEL.expPerCell} EXP</b></p>`
        : `<p>★ 加入內容後，挖空題答對每題 <b>+${expQ} EXP</b></p>`}</div>
      <div class="k-body">${(K.sections || []).map((sec, si) => [sec, si, inGroup(sec, si)]).filter(([, , its]) => !(group || signOnly) || its.length).map(([sec, si, its]) => `<section class="k-sec">
          <h4 class="k-sec-title">${esc(sec.title)}</h4>
          ${its.length ? its.map(([it, ii]) => item(it, si, ii)).join("")
            : `<p class="k-empty">尚未加入內容，之後依課堂講義補充。</p>`}</section>`).join("")}
        ${signOnly && sgList.length ? `<section class="k-sec"><h4 class="k-sec-title">統整內容</h4>
          <div class="k-sg-list">${sgList.map(g => `<button type="button" class="k-sg-btn${groupOpen(K.chapter, g) ? "" : " is-locked"}" data-g="${esc(g)}">${esc(g)}</button>`).join("")}</div></section>` : ""}</div>`;
    $("kpanel").hidden = false;
    $("kpanel").classList.toggle("is-full", kFull);
    $("kFull").onclick = () => { kFull = !kFull; rerenderKnowledge(); };
    if ($("kAll")) $("kAll").onclick = () => openKnowledge(key, null, true);
    if ($("kSign")) $("kSign").onclick = () => openKnowledge(key);
    $("kpanel").querySelectorAll(".k-sg-btn").forEach(b => b.onclick = () => openKnowledge(key, b.dataset.g));
    glossify($("kpanel").querySelector(".k-body"));
    $("kClose").onclick = closeKnowledge;
    if ($("kQuiz")) $("kQuiz").onclick = () => {
      // 先出還沒答對過的題目
      const qs = [...treeQs].sort(() => Math.random() - .5).sort((a, b) => PI.state.isTreeDone(a.qid) - PI.state.isTreeDone(b.qid)).slice(0, 5);
      let gained = 0;
      const nx0 = islandOrder[islandOrder.indexOf(ch.id) + 1], wasOpen = nx0 == null || islandOpen(nx0);
      PI.quiz.start({ qs, need: 0, kicker: `${group || K.title || ch.name}・知識樹`, title: "知識樹答題",
        onRight: q => { if (PI.state.markTree(q.qid)) gained += expQ; },
        onFinish: () => {}, okText: () => { return gained ? `這次獲得 ${gained} EXP！` : "這幾題之前都答對過了，這次沒有新的經驗值。"; },
        badText: "", onClose: () => {
          openKnowledge(key, group, all);
          const i = islandOrder.indexOf(ch.id), nx = islandOrder[i + 1];
          if (nx != null && !wasOpen && islandOpen(nx)) toast(`🎉 第 ${ch.id} 章完成！解鎖下一座島：第 ${nx} 章「${chOf(nx).short || chOf(nx).name}」`);
        } });
    };
    $("kClose").focus();
  }
  /* ---------- 名詞小框框：PI.GLOSSARY 裡的名詞加虛線，點一下跳出解釋（沒有 PI.GLOSSARY 的頁面不受影響） ---------- */
  function glossify(root) {
    const G = PI.GLOSSARY; if (!root || !G) return;
    const terms = Object.keys(G).sort((a, b) => b.length - a.length);
    if (!terms.length) return;
    const alt = terms.map(t => t.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&")).join("|");
    const re = new RegExp("(" + alt + ")(?![A-Za-z])", "g");
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n =>
      n.parentElement.closest("summary, button, .gl-pop, textarea, select, input, .k-edit") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(n => {
      if (!re.test(n.nodeValue)) return; re.lastIndex = 0;
      const frag = document.createDocumentFragment(); let last = 0;
      n.nodeValue.replace(re, (m, t, i) => {
        frag.append(n.nodeValue.slice(last, i));
        const b = document.createElement("button"); b.type = "button"; b.className = "gl"; b.dataset.term = t; b.textContent = t;
        frag.append(b); last = i + m.length; return m;
      });
      frag.append(n.nodeValue.slice(last)); n.replaceWith(frag);
    });
    let pop = null;
    const hide = () => { if (pop) { pop.remove(); pop = null; } };
    root.onclick = e => {
      const fig = e.target.closest(".k-diagram"); if (fig) { fig.classList.toggle("is-zoom"); return; }   // 點圖放大
      const b = e.target.closest(".gl"); const was = pop && pop.dataset.term;
      hide(); if (!b || was === b.dataset.term) return;
      pop = document.createElement("div"); pop.className = "gl-pop"; pop.dataset.term = b.dataset.term;
      pop.innerHTML = `<b>${esc(b.dataset.term)}</b><p>${esc(G[b.dataset.term])}</p>`;
      root.append(pop);
      const r = b.getBoundingClientRect(), R = root.getBoundingClientRect();
      pop.style.top = `${r.bottom - R.top + root.scrollTop + 6}px`;
      pop.style.left = `${Math.max(4, Math.min(r.left - R.left, root.clientWidth - pop.offsetWidth - 4))}px`;
    };
  }
  /* ---------- 知識卡片的編輯（js/edits.js）：用事件委派，面板重畫也不用重新綁 ---------- */
  const newId = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).slice(-12);
  // 編輯中的一行：一般文字直接打字；挖空／螢光筆是不能拆開的小標籤（data-raw 存原本的寫法，選項、類型都不會動到）
  function edLine(it, li, raw) {
    const cut = raw.search(/\s#/), text = cut < 0 ? raw : raw.slice(0, cut), rest = cut < 0 ? "" : raw.slice(cut);
    const km = (it.kmaps || {})[li], src = it.hlsrc || {}, re = new RegExp(CLOZE.source, "g");
    let html = "", last = 0, k = -1, m;
    while ((m = re.exec(text))) {
      k++; html += esc(text.slice(last, m.index)); last = re.lastIndex;
      const hk = km && typeof km[k] === "string" ? km[k] : null, hs = hk ? (src[`${li}:${hk}`] || "mine") : "";
      html += `<span class="ed-chip${hk ? ` is-hl hl-${hs}` : ""}" contenteditable="false" data-raw="${esc(m[0])}"${hk ? ` data-src="${hs}"` : ""}>${esc(m[1])}</span>`;
    }
    html += esc(text.slice(last));
    const x = String(li)[0] === "x";
    return `<span class="k-line ed-line" contenteditable="true" spellcheck="false" ${x ? `data-x="${esc(String(li).slice(1))}"` : `data-li="${li}"`} data-rest="${esc(rest)}">${html}</span>${rest ? ` <span class="hint">${esc(rest.trim())}</span>` : ""}`;
  }
  // 一行的畫面 → 存檔的寫法：一般文字照打的字（去掉會弄壞格式的 { } #），小標籤用 data-raw
  function serLine(el) {
    let out = "";
    (function walk(n) { n.childNodes.forEach(c => {
      if (c.nodeType === 3) out += c.nodeValue.replace(/[{}]/g, "").replace(/#/g, "＃");
      else if (c.classList && c.classList.contains("ed-chip")) out += c.dataset.raw;
      else if (c.nodeName === "BR") out += " ";
      else walk(c);
    }); })(el);
    return out.replace(/ /g, " ");
  }
  // 重畫面板，捲動位置不變
  function rerenderKnowledge() {
    const body = $("kpanel").querySelector(".k-body"), top = body ? body.scrollTop : 0;
    openKnowledge(kKey, kGroup, kAllMode);
    const nb = $("kpanel").querySelector(".k-body"); if (nb) nb.scrollTop = top;
  }
  function collectEdit(card, ekey) {
    const orig = PI.edits.original(ekey), S0 = PI.edits.slotsOf(orig), prev = PI.edits.get(ekey) || {};
    const e = {}, slots = {}, extra = [], hlsrc = {};
    Object.entries(prev.slots || {}).forEach(([li, v]) => { if (v && v.del) slots[li] = { del: true }; });   // 之前刪掉的行（畫面上已經不顯示）照舊
    const t = card.querySelector(".ed-title");
    if (t) { const v = t.textContent.replace(/\s*\n\s*/g, " ").trim(); if (v !== (orig.title || "")) e.title = v; }
    const hlOf = (el, key, o, raw) => {   // 這一行的螢光筆來源
      const km = PI.edits.kmapOf(o, raw);
      [...el.querySelectorAll(".ed-chip")].forEach((c, k) => { if (c.dataset.src && typeof km[k] === "string") hlsrc[`${key}:${km[k]}`] = c.dataset.src; });
    };
    card.querySelectorAll(".ed-line[data-li]").forEach(el => {
      const li = +el.dataset.li, o = S0[li].get(), raw = serLine(el) + el.dataset.rest;
      delete slots[li];
      if (!raw.trim()) { slots[li] = { del: true }; return; }   // 字全部刪光＝刪掉這一行
      if (raw !== o) slots[li] = { text: raw };
      hlOf(el, li, o, raw);
    });
    card.querySelectorAll(".ed-line[data-x]").forEach(el => {
      const raw = (serLine(el) + el.dataset.rest).trim();
      if (!raw) return;
      extra.push({ id: el.dataset.x, text: raw }); hlOf(el, "x" + el.dataset.x, "", raw);
    });
    if (Object.keys(slots).length) e.slots = slots;
    if (extra.length) e.extra = extra;
    if (Object.keys(hlsrc).length) e.hlsrc = hlsrc;
    if (prev.marks) e.marks = prev.marks;   // 以前加的整行考點標記照留
    if (prev.hidden) e.hidden = true;
    return Object.keys(e).length ? e : null;
  }
  const edMsg = (card, t) => { const m = card.querySelector(".k-ed-msg"); m.textContent = t; m.hidden = !t; };

  /* 螢光筆（在編輯模式裡）：記住最後一次在某一行裡的反白，按來源按鈕時用（手機按按鈕會把反白清掉） */
  let edRange = null, chipPop = null;
  const hideChipPop = () => { if (chipPop) { chipPop.remove(); chipPop = null; } };
  document.addEventListener("selectionchange", () => {
    const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) return;
    const r = sel.getRangeAt(0), el = n => (n.nodeType === 1 ? n : n.parentElement);
    const ln = el(r.startContainer).closest(".k-edit .ed-line");
    edRange = ln && el(r.endContainer).closest(".ed-line") === ln ? { ln, r: r.cloneRange() } : null;
    if (!edRange || !r.toString().trim()) return;
    // 反白後在旁邊跳出螢光筆（像 PDF 閱讀器那樣）
    hideChipPop();
    const P = $("kpanel"), R = P.getBoundingClientRect(), c = r.getBoundingClientRect();
    chipPop = document.createElement("div"); chipPop.className = "hl-bar";
    chipPop.innerHTML = `<span class="hl-q">🖍</span>${["teacher", "exam", "mine"].map(t => `<button type="button" class="hl-pick hl-${t}" data-hl="${t}">${esc(PI.edits.MARKS[t].short)}</button>`).join("")}`;
    P.append(chipPop);
    chipPop.style.left = `${Math.max(8, Math.min(c.left - R.left, P.clientWidth - chipPop.offsetWidth - 8))}px`;
    let y = c.top - R.top - chipPop.offsetHeight - 8; if (y < 8) y = c.bottom - R.top + 8;
    chipPop.style.top = `${y}px`;
  });
  function applyHl(card, src) {
    const R = edRange && card.contains(edRange.ln) ? edRange : null;
    if (!R || R.r.collapsed) return edMsg(card, "先用滑鼠（手機長按）反白一段字，再按螢光筆");
    const { ln, r } = R;
    if ([...ln.querySelectorAll(".ed-chip")].some(c => r.intersectsNode(c))) return edMsg(card, "選到的字裡已經有考點了，換一段沒有標過的字");
    const str = r.toString(), word = str.trim();
    if (!word) return edMsg(card, "先反白一段字");
    if (/[{}|#＃]/.test(word)) return edMsg(card, "這段字裡有特殊符號，不能畫");
    if (word.length > 60) return edMsg(card, "一次最多畫 60 個字");
    const type = PI.quiz.typeOf(word) || PI.edits.HL_TYPE;
    const chip = document.createElement("span");
    chip.className = `ed-chip is-hl hl-${src}`; chip.contentEditable = "false";
    chip.dataset.raw = `{{${word}|${type}}}`; chip.dataset.src = src; chip.textContent = word;
    const lead = str.slice(0, str.length - str.trimStart().length), tail = str.slice(str.trimEnd().length);
    r.deleteContents();
    const frag = document.createDocumentFragment();
    if (lead) frag.append(lead); frag.append(chip); if (tail) frag.append(tail);
    r.insertNode(frag);
    getSelection().removeAllRanges(); edRange = null; edMsg(card, "");
  }
  function showChipPop(chip) {
    hideChipPop();
    const P = $("kpanel"), R = P.getBoundingClientRect(), c = chip.getBoundingClientRect();
    chipPop = document.createElement("div"); chipPop.className = "hl-bar";
    chipPop.innerHTML = `<button type="button" class="hl-pick" data-chip="unmark">取消考點（保留文字）</button><button type="button" class="hl-pick" data-chip="remove">刪除這段字</button>`;
    chipPop._chip = chip; P.append(chipPop);
    chipPop.style.left = `${Math.max(8, Math.min(c.left - R.left, P.clientWidth - chipPop.offsetWidth - 8))}px`;
    chipPop.style.top = `${c.bottom - R.top + 6}px`;
  }

  $("kpanel").addEventListener("keydown", e => {
    if (!e.target.closest(".k-edit")) return;
    e.stopPropagation();   // 在編輯裡打字（含 Esc）不要觸發面板或地圖的快捷鍵
    const ln = e.target.classList && e.target.classList.contains("ed-line") ? e.target : null; if (!ln) return;
    if (e.key === "Enter") {   // Enter：在這張卡片最後加一行（原本的行順序固定，題目編號才不會亂）
      e.preventDefault();
      const card = ln.closest(".k-edit"), li = document.createElement("li");
      li.className = "is-extra"; li.innerHTML = edLine({}, "x" + newId(), "");
      card.querySelector(".k-pts").append(li); li.querySelector(".ed-line").focus();
    } else if (e.key === "Backspace" && ln.dataset.x && !ln.textContent) {   // 空的新行按退格：刪掉這一行
      e.preventDefault();
      const lines = [...ln.closest(".k-edit").querySelectorAll(".ed-line")], prev = lines[lines.indexOf(ln) - 1];
      ln.closest("li").remove();
      if (prev) { prev.focus(); const r = document.createRange(); r.selectNodeContents(prev); r.collapse(false); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); }
    }
  });
  $("kpanel").addEventListener("paste", e => {   // 貼上只貼純文字
    const ln = e.target.closest && e.target.closest(".ed-line"); if (!ln) return;
    e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData.getData("text/plain") || "").replace(/\s*\n\s*/g, " "));
  });
  $("kpanel").addEventListener("mousedown", e => { if (e.target.closest(".k-ed-bar, .hl-bar")) e.preventDefault(); });   // 按螢光筆時不要把反白取消
  $("kpanel").addEventListener("click", e => {
    const cp = e.target.closest("[data-chip]");
    if (cp && chipPop) {
      const chip = chipPop._chip;
      if (cp.dataset.chip === "unmark") chip.replaceWith(document.createTextNode(chip.textContent)); else chip.remove();
      hideChipPop(); return;
    }
    const chip = e.target.closest(".k-edit .ed-chip");
    if (chip && chip.closest(".ed-line").getAttribute("contenteditable") === "true") { showChipPop(chip); return; }
    if (!e.target.closest(".hl-bar") && getSelection().isCollapsed) hideChipPop();   // 剛反白完的那一下 click 不要把螢光筆關掉
    const btn = e.target.closest("[data-act], [data-hl]");
    const card = btn && (btn.closest(".k-item[data-key]") || (btn.dataset.hl && edRange && edRange.ln.closest(".k-item[data-key]")));
    if (!btn || !card || !PI.edits) return;
    const ekey = card.dataset.key, act = btn.dataset.act, cur = PI.edits.get(ekey) || {};
    if (btn.dataset.hl) { applyHl(card, btn.dataset.hl); hideChipPop(); }
    else if (act === "more") { const m = card.querySelector(".k-ed-more"); m.hidden = !m.hidden; }
    else if (act === "edit") { kEditing = ekey; rerenderKnowledge(); }
    else if (act === "cancel") { kEditing = null; rerenderKnowledge(); }
    else if (act === "restore") { PI.edits.set(ekey, null); kEditing = null; rerenderKnowledge(); }
    else if (act === "unhide") { delete cur.hidden; PI.edits.set(ekey, Object.keys(cur).length ? cur : null); rerenderKnowledge(); }
    else if (act === "hide") { PI.edits.set(ekey, { ...(collectEdit(card, ekey) || {}), hidden: true }); kEditing = null; rerenderKnowledge(); }   // 先保留已經改好的內容
    else if (act === "save") { PI.edits.set(ekey, collectEdit(card, ekey)); kEditing = null; rerenderKnowledge(); }
  });

  function closeKnowledge() {
    if ($("kpanel").hidden) return;
    kFull = false; $("kpanel").classList.remove("is-full");
    hideChipPop();
    $("kpanel").hidden = true;
    PI.map.setView(kView, true);   // 回到打開面板前的地圖位置
    kView = null;
    if (kFrom && kFrom.focus) kFrom.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("kpanel").hidden) closeKnowledge(); });

  /* ---------- 地圖按鈕 ---------- */
  $("zoomIn").onclick = () => PI.map.zoomIn();
  $("zoomOut").onclick = () => PI.map.zoomOut();
  $("zoomFit").onclick = () => setFocus(null);

  /* ---------- 全螢幕 ---------- */
  const mapEl = $("map");
  const isFull = () => mapEl.classList.contains("is-full");
  function markFull(on, fake) {
    mapEl.classList.toggle("is-full", on);
    mapEl.classList.toggle("is-fake", on && !!fake);
    document.body.style.overflow = on && fake ? "hidden" : "";
    $("fullBtn").setAttribute("aria-pressed", on);
    $("fullBtn").setAttribute("aria-label", on ? "離開全螢幕" : "全螢幕");
    $("fullBtn").title = on ? "離開全螢幕" : "全螢幕";
  }
  $("fullBtn").onclick = () => {
    if (isFull()) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else markFull(false);
      return;
    }
    if (mapEl.requestFullscreen && document.fullscreenEnabled) {
      mapEl.requestFullscreen().then(() => markFull(true, false)).catch(() => markFull(true, true));
    } else markFull(true, true);
  };
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && isFull()) markFull(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && mapEl.classList.contains("is-fake")) markFull(false); });

  /* ---------- 設定 ---------- */
  const openSettings = () => { $("settings").hidden = false; $("setClose").focus(); };
  const closeSettings = () => { $("settings").hidden = true; $("resetConfirm").hidden = true; $("settingsBtn").focus(); };
  $("settingsBtn").onclick = openSettings;
  $("setClose").onclick = closeSettings;
  $("settings").addEventListener("click", e => { if (e.target.id === "settings") closeSettings(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("settings").hidden) closeSettings(); });
  $("setFit").onclick = () => { setFocus(null); closeSettings(); };
  $("setReset").onclick = () => { $("resetConfirm").hidden = false; };
  $("resetNo").onclick = () => { $("resetConfirm").hidden = true; };
  $("resetYes").onclick = () => { PI.state.reset(); closeSettings(); };

  /* ---------- 設定：雲端同步（js/sync.js） ---------- */
  PI.refreshKnowledge = () => { if (!$("kpanel").hidden && kKey && !kEditing) rerenderKnowledge(); };   // 雲端進度合併進來後重畫（正在編輯時不打斷）
  if (PI.sync) {
    const row = document.createElement("div");
    row.innerHTML = `<div class="set-row set-sync">
        <div><b>雲端同步</b><span class="muted" id="syStat"></span></div>
        <span class="set-btns" id="syOut" hidden><button type="button" class="btn" id="syNow">立即同步</button><button type="button" class="btn" id="syLogout">登出</button></span></div>
      <form class="confirm" id="syForm" hidden><input type="email" id="syEmail" required placeholder="你的 email" autocomplete="email">
        <button type="submit" class="btn btn-primary">寄登入信</button></form>
      <p class="confirm" id="syMsg" role="status" hidden></p>`;
    const foot = $("settings").querySelector(".dialog-foot");
    [...row.children].forEach(c => foot.before(c));
    const resetNote = $("setReset").closest(".set-row").querySelector(".muted"), resetText = resetNote.textContent;
    PI.sync.onStatus((st, user) => {
      $("syStat").textContent = st;
      resetNote.textContent = user ? "清除所有領土與經驗值（已登入同步：每台裝置都會一起清除）" : resetText;
      $("syOut").hidden = !user; $("syForm").hidden = !!user || !PI.sync.enabled;
    });
    const say = t => { $("syMsg").textContent = t; $("syMsg").hidden = false; };
    $("syEmail").onkeydown = e => e.stopPropagation();
    $("syForm").onsubmit = e => {
      e.preventDefault();
      PI.sync.signIn($("syEmail").value.trim())
        .then(() => say("登入信寄出了：到信箱點信裡的連結，會回到這一頁並自動同步。每台裝置第一次都要登入一次。"))
        .catch(err => say("寄信失敗：" + (err.message || err)));
    };
    $("syNow").onclick = () => PI.sync.syncNow();
    $("syLogout").onclick = () => PI.sync.signOut().then(() => say("已登出。這台裝置上的進度還在，只是不再同步。"));
  }

  /* ---------- 設定：知識卡片修改的匯出／匯入（JSON） ---------- */
  if (PI.edits) {
    const row = document.createElement("div");
    row.innerHTML = `<div class="set-row">
        <div><b>知識卡片的個人修改</b><span class="muted" id="edStat"></span></div>
        <span class="set-btns"><button type="button" class="btn" id="edExport">匯出 JSON</button>
          <button type="button" class="btn" id="edImport">匯入 JSON</button></span>
        <input type="file" id="edFile" accept=".json,application/json" hidden></div>
      <p class="confirm" id="edMsg" role="status" hidden></p>`;
    const foot = $("settings").querySelector(".dialog-foot");
    [...row.children].forEach(c => foot.before(c));
    const stat = () => { const n = Object.keys(PI.state.getEdits()).length;
      $("edStat").textContent = n ? `已修改 ${n} 張卡片（存在這台裝置）；匯入會取代目前的修改` : "還沒有修改；匯入會取代目前的修改"; };
    const msg = t => { $("edMsg").textContent = t; $("edMsg").hidden = false; };
    $("settingsBtn").addEventListener("click", () => { stat(); $("edMsg").hidden = true; });
    $("edExport").onclick = () => {
      const data = PI.edits.exportData();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      a.download = `pharma-island-edits-${data.storageKey}-${day}.json`;
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      msg(`已匯出 ${Object.keys(data.edits).length} 張卡片的修改。`);
    };
    $("edImport").onclick = () => $("edFile").click();
    $("edFile").onchange = () => {
      const f = $("edFile").files[0]; if (!f) return;
      f.text().then(t => {
        let n; try { n = PI.edits.importData(JSON.parse(t)); } catch (err) { msg("匯入失敗：" + (err instanceof SyntaxError ? "檔案不是正確的 JSON。" : err.message)); return; }
        msg(`已匯入 ${n} 張卡片的修改。`); stat(); kEditing = null;
        if (!$("kpanel").hidden && kKey) rerenderKnowledge();
      }).finally(() => { $("edFile").value = ""; });
    };
  }

  /* ---------- 新增學習單元：島嶼自動擴展，面板跟著更新 ----------
     例：PI.addUnit({ id: "vancomycin", chapter: 3, name: "Vancomycin", type: "drug", group: "Glycopeptides" }) */
  PI.addUnit = u => { const c = PI.map.addUnit(u); renderStats(); renderChapters(); return c; };

  /* ---------- 進度變動時全部更新 ---------- */
  PI.state.onChange(() => { openCache = null; PI.map.render(); renderStats(); renderChapters(); if (current) showInfo(current); });

  renderStats();
  renderChapters();
})();
