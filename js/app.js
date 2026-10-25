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
        <div class="info-title"><h3>${u ? esc(u.name) : "預留格"}</h3><span class="muted">第 ${ch.id} 章・${esc(ch.name)}</span></div>
        <button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      <div class="tags"><span class="tag st-${st}">${STATUS[st]}</span>
        ${u ? `<span class="tag">${esc(PI.UNIT_TYPES[u.type] || u.type)}</span>${u.group ? `<span class="tag">${esc(u.group)}</span>` : ""}` : `<span class="tag">尚未加入藥物資料</span>`}</div>
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

  /* 單元內容：依 PI.UNIT_FIELDS 的順序列出有資料的欄位 */
  function unitBody(u) {
    const rows = (PI.UNIT_FIELDS || []).filter(([k]) => u[k] && u[k].length).map(([k, label]) =>
      `<div class="u-row"><span class="u-label">${esc(label)}</span><ul>${u[k].map(l => `<li>${clozeLine(l, true)}</li>`).join("")}</ul></div>`).join("");   // 口訣移到下面的筆記欄
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
      <div class="tags"><span class="tag">${isl.cells.length} 格</span><span class="tag">已加入 ${isl.unitCount} 個${esc(PI.UNIT_TYPES[ch.unitType] || "單元")}</span>
        ${isl.slotCount ? `<span class="tag">預留 ${isl.slotCount} 格</span>` : ""}<span class="tag">已佔領 ${pr.done}/${pr.total}</span></div>
      <p>${ch.note ? esc(ch.note) + " " : ""}島的大小先依預估約 ${ch.estimate} 個單元預留，加入正式資料後會自動調整。</p>`;
    box.hidden = false;
    $("infoClose").onclick = () => { box.hidden = true; };
  }

  /* ---------- 知識面板：點知識樹打開，關閉後地圖回到打開前的位置 ---------- */
  let kView = null, kFrom = null, kKey = null, kEditing = null;   // kEditing：正在編輯的卡片 key
  function openKnowledge(key) {
    if (kKey !== key) kEditing = null;
    kKey = key;
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
    const line = (it, li, t) => mk(it, li) + clozeLine(t);
    const item = (it, si, ii) => {
      if (it.unit) return unitOf(it.unit) ? refItem(unitOf(it.unit)) : "";   // 引用格子：這一版不開放修改
      const ekey = PI.edits ? PI.edits.keyOf(key, si, ii) : "";
      if (ekey && kEditing === ekey) return editForm(it, ekey);
      const tools = PI.edits ? `<div class="k-tools">${it.edited ? `<span class="k-edited">已修改</span><button type="button" class="k-tool" data-act="restore">還原原文</button>` : ""}
          <button type="button" class="k-tool" data-act="edit">✎ 編輯</button></div>` : "";
      if (it.hidden) return `<article class="k-item is-hidden" data-key="${esc(ekey)}"><div class="k-item-head">
          <p class="muted">已隱藏的卡片：${esc(it.title || "（無標題）")}</p>
          <div class="k-tools"><button type="button" class="k-tool" data-act="unhide">取消隱藏</button><button type="button" class="k-tool" data-act="restore">還原原文</button></div></div></article>`;
      const pts = (it.points || []).map((p, i) => p ? `<li>${line(it, 1 + i, p)}</li>` : "").join("")
        + (it.extra || []).map(x => `<li class="is-extra">${line(it, "x" + x.id, x.text)}</li>`).join("");
      return `<article class="k-item" data-key="${esc(ekey)}">
        <div class="k-item-head">${it.title ? `<h4>${esc(it.title)}</h4>` : "<span></span>"}${tools}</div>
        ${it.text ? `<p>${line(it, 0, it.text)}</p>` : ""}
        ${it.image ? `<img class="k-img" src="${esc(it.image)}" alt="${esc(it.title || "")}" loading="lazy">` : ""}
        ${pts ? `<ul>${pts}</ul>` : ""}
        ${it.diagram ? `<figure class="k-diagram" title="點圖放大／再點一下縮回"><img src="${esc(it.diagram)}" alt="${esc(it.title || "示意圖")}" loading="lazy"></figure>
          ${PI.GLOSSARY ? `<p class="k-gl-row"><span class="muted">點名詞看小框框：</span>${Object.keys(PI.GLOSSARY).map(esc).join("・")}</p>` : ""}` : ""}
        ${it.flow ? (it.diagram ? `<details class="k-flow-wrap"><summary>看文字步驟</summary>${flowHtml(it)}</details>` : flowHtml(it)) : ""}
        ${it.original ? `<details class="k-orig"><summary>看原始講義圖</summary><img class="k-img" src="${esc(it.original)}" alt="原始講義圖" loading="lazy"></details>` : ""}
        ${it.source ? `<p class="k-src">出處：${esc(it.source)}</p>` : ""}</article>`;
    };
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
    // 編輯表單：每一行一個文字框（原樣顯示挖空語法），可改、刪除、加考點標記，也可以新增行
    function editForm(it, ekey) {
      const orig = PI.edits.original(ekey), S0 = PI.edits.slotsOf(orig), S = PI.edits.slotsOf(it);
      const cur = PI.edits.get(ekey) || {}, marks = it.marks || {};
      const sel = k => `<select class="k-ed-mark" aria-label="考點標記"><option value="">考點標記：無</option>${Object.entries(PI.edits.MARKS)
        .map(([v, M]) => `<option value="${v}"${marks[k] === v ? " selected" : ""}>${esc(M.label)}</option>`).join("")}</select>`;
      const rows = S0.filter(s => s.exists()).map(s => {
        const del = !!((cur.slots || {})[s.li] || {}).del;
        return `<div class="k-ed-row${del ? " is-del" : ""}" data-li="${s.li}"><span class="k-ed-label">${esc(s.label)}</span>
          <textarea rows="2"${del ? " disabled" : ""}>${esc(del ? s.get() : S[s.li].get())}</textarea>
          <div class="k-ed-row-tools">${sel(s.li)}<button type="button" class="k-tool" data-act="del-row">${del ? "復原這一行" : "刪除這一行"}</button></div></div>`;
      }).join("");
      const extra = (it.extra || []).map(x => extraRow(x.id, x.text, sel("x" + x.id))).join("");
      return `<article class="k-item k-edit" data-key="${esc(ekey)}">
        <p class="k-ed-help">直接改文字；挖空寫法 <code>{{答案|類型|錯1/錯2/錯3}}</code>，句尾 <code> #口訣</code> 是提示。改完按「儲存」才會保存（存在這台裝置）。原始講義資料不會被改到。</p>
        ${orig.title != null ? `<label class="k-ed-row"><span class="k-ed-label">標題</span><input class="k-ed-title" value="${esc(it.title || "")}"></label>` : ""}
        ${rows}<div class="k-ed-extra">${extra}</div>
        <button type="button" class="k-tool" data-act="add-row">＋ 新增一行</button>
        <p class="k-ed-msg" role="alert" hidden></p>
        <div class="k-ed-foot"><button type="button" class="btn btn-primary" data-act="save">儲存</button>
          <button type="button" class="btn" data-act="cancel">取消</button>
          <button type="button" class="btn" data-act="hide">隱藏這張卡片</button>
          ${it.edited ? `<button type="button" class="btn btn-warn" data-act="restore">還原原文</button>` : ""}</div></article>`;
    }
    // 這棵樹有幾題（一個挖空＝一題）
    const treeQs = PI.quiz.forTree(key), nQ = treeQs.length;
    const nDone = treeQs.filter(q => PI.state.isTreeDone(q.qid)).length;
    const expQ = PI.LEVEL.expPerTreeQuestion || 0;
    const nRef = (K.sections || []).flatMap(sec => sec.items || []).filter(it => it.unit).length;
    $("kpanel").innerHTML = `<div class="k-head">
        <div class="info-title"><span class="muted">${land.name ? esc(land.name) + "・" : ""}知識樹</span><h3 id="kTitle">${esc(K.title || ch.name)}</h3></div>
        <button type="button" class="close" id="kClose" aria-label="關閉知識面板">×</button></div>
      ${chips ? `<div class="k-chips">${chips}</div>` : ""}
      <div class="k-exp">${nQ ? `<p>★ 這棵樹有 <b>${nQ}</b> 題，第一次答對每題 <b>+${expQ} EXP</b>
            <span class="muted">已答對 ${nDone} / ${nQ}（${nDone * expQ} / ${nQ * expQ} EXP）</span></p>
          <button type="button" class="btn btn-primary" id="kQuiz">開始答題（${Math.min(5, nQ)} 題）</button>`
        : nRef ? `<p>★ 這裡的挖空題在本章的格子上作答，佔領一格 <b>+${PI.LEVEL.expPerCell} EXP</b></p>`
        : `<p>★ 加入內容後，挖空題答對每題 <b>+${expQ} EXP</b></p>`}</div>
      <div class="k-body">${(K.sections || []).map((sec, si) => `<section class="k-sec">
          <h4 class="k-sec-title">${esc(sec.title)}</h4>
          ${sec.items && sec.items.length ? sec.items.map((it, ii) => item(it, si, ii)).join("")
            : `<p class="k-empty">尚未加入內容，之後依課堂講義補充。</p>`}</section>`).join("")}</div>`;
    $("kpanel").hidden = false;
    glossify($("kpanel").querySelector(".k-body"));
    $("kClose").onclick = closeKnowledge;
    if ($("kQuiz")) $("kQuiz").onclick = () => {
      // 先出還沒答對過的題目
      const qs = [...treeQs].sort(() => Math.random() - .5).sort((a, b) => PI.state.isTreeDone(a.qid) - PI.state.isTreeDone(b.qid)).slice(0, 5);
      let gained = 0;
      PI.quiz.start({ qs, need: 0, kicker: `${K.title || ch.name}・知識樹`, title: "知識樹答題",
        onRight: q => { if (PI.state.markTree(q.qid)) gained += expQ; },
        onFinish: () => {}, okText: () => { return gained ? `這次獲得 ${gained} EXP！` : "這幾題之前都答對過了，這次沒有新的經驗值。"; },
        badText: "", onClose: () => openKnowledge(key) });
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
  function extraRow(id, text, selHtml) {
    return `<div class="k-ed-row is-extra" data-x="${esc(id)}"><span class="k-ed-label">新增的行</span>
      <textarea rows="2">${esc(text)}</textarea>
      <div class="k-ed-row-tools">${selHtml}<button type="button" class="k-tool" data-act="del-extra">刪除這一行</button></div></div>`;
  }
  // 重畫面板，捲動位置不變
  function rerenderKnowledge() {
    const body = $("kpanel").querySelector(".k-body"), top = body ? body.scrollTop : 0;
    openKnowledge(kKey);
    const nb = $("kpanel").querySelector(".k-body"); if (nb) nb.scrollTop = top;
  }
  // 挖空語法檢查：{{ 和 }} 要成對、不能巢狀、答案不能是空的
  function checkCloze(t) {
    const open = (t.match(/\{\{/g) || []).length, close = (t.match(/\}\}/g) || []).length;
    if (open !== close) return "挖空的 {{ 和 }} 沒有成對";
    const inner = t.match(/\{\{([^{}]*)\}\}/g) || [];
    if (inner.length !== open) return "挖空不能放在另一個挖空裡";
    if (inner.some(m => !m.slice(2, -2).split("|")[0].trim())) return "挖空的答案是空的";
    return "";
  }
  function collectEdit(card, ekey) {
    const orig = PI.edits.original(ekey), S0 = PI.edits.slotsOf(orig), prev = PI.edits.get(ekey) || {};
    const e = {}, slots = {}, marks = {}, extra = [], errs = [];
    const t = card.querySelector(".k-ed-title");
    if (t && t.value !== (orig.title || "")) e.title = t.value;
    card.querySelectorAll(".k-ed-row[data-li]").forEach(r => {
      const li = +r.dataset.li, ta = r.querySelector("textarea"), m = r.querySelector("select").value;
      if (r.classList.contains("is-del")) slots[li] = { del: true };
      else { const err = checkCloze(ta.value); if (err) errs.push(`${S0[li].label}：${err}`);
        if (ta.value !== S0[li].get()) slots[li] = { text: ta.value }; }
      if (m) marks[li] = m;
    });
    card.querySelectorAll(".k-ed-row[data-x]").forEach(r => {
      const v = r.querySelector("textarea").value.trim(), m = r.querySelector("select").value;
      if (!v) return;
      const err = checkCloze(v); if (err) errs.push(`新增的行：${err}`);
      extra.push({ id: r.dataset.x, text: v }); if (m) marks["x" + r.dataset.x] = m;
    });
    if (Object.keys(slots).length) e.slots = slots;
    if (extra.length) e.extra = extra;
    if (Object.keys(marks).length) e.marks = marks;
    if (prev.hidden) e.hidden = true;
    return { e: Object.keys(e).length ? e : null, errs };
  }
  $("kpanel").addEventListener("keydown", e => { if (e.target.closest(".k-edit")) e.stopPropagation(); });   // 在表單裡打字（含 Esc）不要觸發面板或地圖的快捷鍵
  $("kpanel").addEventListener("click", e => {
    const btn = e.target.closest("[data-act]"), card = btn && btn.closest(".k-item[data-key]");
    if (!btn || !card || !PI.edits) return;
    const ekey = card.dataset.key, act = btn.dataset.act, cur = PI.edits.get(ekey) || {};
    if (act === "edit") { kEditing = ekey; rerenderKnowledge(); }
    else if (act === "cancel") { kEditing = null; rerenderKnowledge(); }
    else if (act === "restore") { PI.edits.set(ekey, null); kEditing = null; rerenderKnowledge(); }
    else if (act === "unhide") { delete cur.hidden; PI.edits.set(ekey, Object.keys(cur).length ? cur : null); rerenderKnowledge(); }
    else if (act === "hide") {
      const { e: ed, errs } = collectEdit(card, ekey);   // 先保留表單裡已經改好的內容
      if (errs.length) return showEdMsg(card, errs);
      PI.edits.set(ekey, { ...(ed || {}), hidden: true }); kEditing = null; rerenderKnowledge();
    }
    else if (act === "save") {
      const { e: ed, errs } = collectEdit(card, ekey);
      if (errs.length) return showEdMsg(card, errs);
      PI.edits.set(ekey, ed); kEditing = null; rerenderKnowledge();
    }
    else if (act === "del-row") {
      const r = btn.closest(".k-ed-row"), on = !r.classList.contains("is-del");
      r.classList.toggle("is-del", on); r.querySelector("textarea").disabled = on;
      btn.textContent = on ? "復原這一行" : "刪除這一行";
    }
    else if (act === "del-extra") btn.closest(".k-ed-row").remove();
    else if (act === "add-row") {
      const tmp = document.createElement("div");
      tmp.innerHTML = extraRow(newId(), "", `<select class="k-ed-mark" aria-label="考點標記"><option value="">考點標記：無</option>${Object.entries(PI.edits.MARKS)
        .map(([v, M]) => `<option value="${v}">${esc(M.label)}</option>`).join("")}</select>`);
      card.querySelector(".k-ed-extra").append(tmp.firstElementChild);
      card.querySelector(".k-ed-extra .k-ed-row:last-child textarea").focus({ preventScroll: true });
    }
  });
  function showEdMsg(card, errs) { const m = card.querySelector(".k-ed-msg"); m.textContent = "還沒儲存：" + errs.join("；"); m.hidden = false; }

  function closeKnowledge() {
    if ($("kpanel").hidden) return;
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
    PI.sync.onStatus((st, user) => {
      $("syStat").textContent = st;
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
