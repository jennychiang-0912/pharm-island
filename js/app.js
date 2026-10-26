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
  function clozeLine(line, noHint) {
    const [text, hint] = splitHint(line);
    const body = esc(text).replace(CLOZE, (m, ans, type) => `<mark class="cloze" title="${esc((type || "").split("|")[0])}">${ans}</mark>`);
    return body + (hint && !noHint ? ` <span class="hint">${esc(hint)}</span>` : "");
  }
  // 這個單元資料裡的口訣（句尾的 #…），當作筆記欄的預設內容
  const noteText = u => PI.state.getNote(u.id) ?? mnemonicsOf(u).join("\n");
  const noteRows = u => Math.min(8, Math.max(2, noteText(u).split("\n").length));   // 筆記欄高度跟著行數，口訣不會被切掉
  const mnemonicsOf = u => (PI.UNIT_FIELDS || []).flatMap(([k]) => u[k] || []).map(l => splitHint(l)[1]).filter(Boolean);

  let focus = null;        // 目前篩選的章節
  let current = null;      // 目前選取的格子

  const cells = PI.map.init($("map"), { onSelect: showInfo, onSelectIsland: showIsland, onOpenTree: openKnowledge });

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
    const note = {
      available: "這格可以挑戰：答完這格的題目就佔領，答對幾題都可以。",
      locked: "先佔領旁邊的格子，這格才會解鎖。",
      occupied: "這格已經是你的領土了。"
    }[st];
    box.innerHTML = `<div class="info-top">${badge(ch, cat)}
        <div class="info-title"><h3>${u ? esc(u.name) : "預留格"}${u && titleBits(u).zh ? ` <span class="u-zh">${esc(titleBits(u).zh)}</span>` : ""}${u && u.group ? ` <span class="tag tag-inline">${esc(u.group)}</span>` : ""}</h3>
          ${u && titleBits(u).alias ? `<span class="u-alias">${esc(titleBits(u).alias)}</span>` : ""}<span class="muted">第 ${ch.id} 章・${esc(ch.name)}</span></div>
        <button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      ${u ? unitBody(u) : ""}
      ${u ? `<div class="u-note"><label for="uNote">我的筆記<span class="muted" id="uNoteSaved"></span></label>
        <textarea id="uNote" rows="${noteRows(u)}" placeholder="寫下自己的口訣或重點…">${esc(noteText(u))}</textarea></div>` : ""}
      <p>${note}</p>
      ${u && st !== "locked" ? `<div class="info-actions"><button type="button" class="btn btn-primary" id="infoQuiz">${st === "available" ? "挑戰這格" : "再練習一次"}</button></div>` : ""}`;
    box.hidden = false;
    $("infoClose").onclick = () => PI.map.select(null);
    if ($("infoQuiz")) $("infoQuiz").onclick = () => challenge(cell);
    if ($("uNote")) {   // 筆記：打字時自動存（存在瀏覽器，和進度放在一起）
      let t = 0;
      $("uNote").oninput = e => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => { PI.state.setNote(u.id, v); $("uNoteSaved").textContent = "已儲存"; }, 400); $("uNoteSaved").textContent = ""; };
      $("uNote").onkeydown = e => e.stopPropagation();   // 在筆記裡打字時，不要觸發地圖或答題的快捷鍵
    }
  }

  /* 挑戰格子：答完就佔領（不限答對題數）；已佔領的格子只是練習 */
  function challenge(cell) {
    const qs = PI.quiz.forUnit(cell.unit, 3);
    if (!qs.length) { $("info").querySelector("p:last-of-type").textContent = "這格的資料還不夠出題。"; return; }
    const practice = PI.state.statusOf(cell) === "occupied", need = 0;   // 不限答對題數：答完就佔領
    const ch = chOf(cell.chapter);
    PI.quiz.start({ qs, need, kicker: `第 ${ch.id} 章・${ch.name}`, title: `${practice ? "練習" : "挑戰"}：${cell.unit.name}`,
      okText: practice ? "複習完成！" : `佔領成功！+${PI.LEVEL.expPerCell} EXP，旁邊的格子解鎖了。答錯的題目可以看資訊卡複習。`,
      badText: practice ? "再複習一下資訊卡上的內容吧。" : `要答對 ${need} 題才能佔領，看完資訊卡再挑戰一次吧。`,
      onFinish: ok => { if (ok && !practice) PI.state.occupy(cell.id); },
      onClose: () => { showInfo(cell); } });
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
      : `<ul>${u[k].map(l => `<li>${clozeLine(l, true)}</li>`).join("")}</ul>`;   // 口訣移到下面的筆記欄
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
    return rows || cls || extra ? `<div class="u-body">${rows}${cls}${extra ? `<p class="u-meta">${extra}</p>` : ""}</div>` : "";
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
        ${isl.slotCount ? `<div class="isl-num"><b>${isl.slotCount}</b><span>預留格</span></div>` : ""}</div>`;
    box.hidden = false;
    $("infoClose").onclick = () => { box.hidden = true; };
  }

  /* ---------- 知識面板：點知識樹打開，關閉後地圖回到打開前的位置 ---------- */
  let kView = null, kFrom = null, kKey = null, kEditing = null, kFull = false, kGroup = null;   // kEditing：正在編輯的卡片 key；kFull：知識面板全螢幕
  // group：只看某一個結構分類（地圖上的好萊塢名牌）——只列出 item.group 是這一類的卡片和這一類的題目
  function openKnowledge(key, group) {
    group = group || null;
    if (kKey !== key || kGroup !== group) kEditing = null;
    kKey = key; kGroup = group;
    const K = (PI.KNOWLEDGE || {})[key]; if (!K) return;
    const land = PI.LANDMASSES.find(l => l.chapters.includes(K.chapter)) || { name: "" };
    if ($("kpanel").hidden) { kView = PI.map.getView(); kFrom = document.activeElement; }   // 換別棵樹時不覆蓋最早的位置
    $("info").hidden = true;
    const ch = chOf(K.chapter), cat = catOf(ch.cat);
    const chips = `<span class="k-chip">${badge(ch, cat)}第 ${ch.id} 章</span>`;
    const unitOf = id => PI.UNITS.find(u => u.id === id);
    const refItem = u => `<article class="k-item is-ref">
        <h4>${esc(u.name)}</h4>
        ${(PI.UNIT_FIELDS || []).filter(([k]) => u[k] && u[k].length).map(([k, label]) =>
          `${k === "points" ? "" : `<p class="k-field">${esc(label)}</p>`}<ul>${u[k].map(l => `<li>${clozeLine(l)}</li>`).join("")}</ul>`).join("")}
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
      return `${mk(it, li)}<span class="k-line" data-li="${li}">${body}</span>${hint ? ` <span class="hint">${esc(hint)}</span>` : ""}`;
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
      const pts = (it.points || []).map((p, i) => p ? `<li>${line(it, 1 + i, p)}</li>` : "").join("")
        + (it.extra || []).map(x => `<li class="is-extra">${line(it, "x" + x.id, x.text)}</li>`).join("");
      const head = isEd && it.title != null ? `<h4 class="ed-title" contenteditable="true" spellcheck="false">${esc(it.title)}</h4>` : it.title ? `<h4>${esc(it.title)}</h4>` : "<span></span>";
      const html = `<article class="k-item${isEd ? " k-edit" : ""}" data-key="${esc(ekey)}">${bar}
        <div class="k-item-head">${head}${tools}</div>
        ${it.text ? `<p>${line(it, 0, it.text)}</p>` : ""}
        ${it.image ? `<img class="k-img" src="${esc(it.image)}" alt="${esc(it.title || "")}" loading="lazy">` : ""}
        ${it.table ? tableHtml(it.table) : ""}
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
    //   格可以是字串，或 { t: "內容", rs: 跨幾列, cs: 跨幾欄, b: true 粗體 }；被上一列跨過去的格子寫 null。表格內容不出題。
    function tableHtml(T) {
      const cell = (c, tag) => { if (c === null) return ""; const o = typeof c === "object" ? c : { t: c };
        return `<${tag}${o.rs ? ` rowspan="${o.rs}"` : ""}${o.cs ? ` colspan="${o.cs}"` : ""}${o.b ? ' class="is-b"' : ""}>${esc(o.t).replace(/\n/g, "<br>")}</${tag}>`; };
      return `<div class="k-table-wrap"><table class="k-table${T.lastRed ? " last-red" : ""}">${T.head ? `<thead><tr>${T.head.map(h => cell(h, "th")).join("")}</tr></thead>` : ""}
        <tbody>${T.rows.map(r => `<tr>${r.map(c => cell(c, "td")).join("")}</tr>`).join("")}</tbody></table></div>
        ${T.note ? `<p class="k-table-note">${esc(T.note)}</p>` : ""}`;
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
    const inGroup = (sec, si) => (sec.items || []).map((it, ii) => [it, ii]).filter(([it]) => !group || [].concat(it.group || []).includes(group));
    const prefixes = group ? (K.sections || []).flatMap((sec, si) => inGroup(sec, si).map(([, ii]) => `t:${key}:${si}:${ii}:`)) : null;
    const treeQs = PI.quiz.forTree(key).filter(q => !group || prefixes.some(p => q.qid.startsWith(p))
      || (q.qid.startsWith("w:") && (PI.UNITS.find(u => "w:" + u.id === q.qid) || {}).group === group)), nQ = treeQs.length;
    const nDone = treeQs.filter(q => PI.state.isTreeDone(q.qid)).length;
    const expQ = PI.LEVEL.expPerTreeQuestion || 0;
    const nRef = (K.sections || []).flatMap(sec => sec.items || []).filter(it => it.unit).length;
    $("kpanel").innerHTML = `<div class="k-head">
        <div class="info-title"><span class="muted">${land.name ? esc(land.name) + "・" : ""}${group ? `${esc(K.title || ch.name)}・結構分類` : "知識樹"}</span><h3 id="kTitle">${esc(group || K.title || ch.name)}</h3></div>
        ${group ? `<button type="button" class="k-full-btn" id="kAll">看整棵知識樹</button>` : ""}
        <button type="button" class="k-full-btn" id="kFull" aria-pressed="${kFull}">${kFull ? "縮小" : "⛶ 全螢幕"}</button>
        <button type="button" class="close" id="kClose" aria-label="關閉知識面板">×</button></div>
      ${chips ? `<div class="k-chips">${chips}</div>` : ""}

      <div class="k-exp${nQ ? " is-btn" : ""}">${nQ ? `<button type="button" class="btn btn-primary" id="kQuiz">開始答題（${Math.min(5, nQ)} 題）</button>`
        : nRef ? `<p>★ 這裡的挖空題在本章的格子上作答，佔領一格 <b>+${PI.LEVEL.expPerCell} EXP</b></p>`
        : `<p>★ 加入內容後，挖空題答對每題 <b>+${expQ} EXP</b></p>`}</div>
      <div class="k-body">${(K.sections || []).map((sec, si) => [sec, si, inGroup(sec, si)]).filter(([, , its]) => !group || its.length).map(([sec, si, its]) => `<section class="k-sec">
          <h4 class="k-sec-title">${esc(sec.title)}</h4>
          ${its.length ? its.map(([it, ii]) => item(it, si, ii)).join("")
            : `<p class="k-empty">尚未加入內容，之後依課堂講義補充。</p>`}</section>`).join("")}</div>`;
    $("kpanel").hidden = false;
    $("kpanel").classList.toggle("is-full", kFull);
    $("kFull").onclick = () => { kFull = !kFull; rerenderKnowledge(); };
    if ($("kAll")) $("kAll").onclick = () => openKnowledge(key);
    glossify($("kpanel").querySelector(".k-body"));
    $("kClose").onclick = closeKnowledge;
    if ($("kQuiz")) $("kQuiz").onclick = () => {
      // 先出還沒答對過的題目
      const qs = [...treeQs].sort(() => Math.random() - .5).sort((a, b) => PI.state.isTreeDone(a.qid) - PI.state.isTreeDone(b.qid)).slice(0, 5);
      let gained = 0;
      PI.quiz.start({ qs, need: 0, kicker: `${group || K.title || ch.name}・知識樹`, title: "知識樹答題",
        onRight: q => { if (PI.state.markTree(q.qid)) gained += expQ; },
        onFinish: () => {}, okText: () => { return gained ? `這次獲得 ${gained} EXP！` : "這幾題之前都答對過了，這次沒有新的經驗值。"; },
        badText: "", onClose: () => openKnowledge(key, group) });
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
    openKnowledge(kKey, kGroup);
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
  PI.state.onChange(() => { PI.map.render(); renderStats(); renderChapters(); if (current) showInfo(current); });

  renderStats();
  renderChapters();
})();
