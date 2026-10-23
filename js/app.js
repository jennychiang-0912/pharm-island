/* PHARMA ISLAND：介面
   導覽列、左側面板、格子資訊卡、設定。地圖與進度的細節交給 map.js、state.js。 */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const catOf = id => PI.CATEGORIES.find(c => c.id === id);
  const chOf = id => PI.CHAPTERS.find(c => c.id === id);
  const STATUS = { occupied: "已佔領", available: "可挑戰", locked: "未解鎖" };

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
      available: "這格可以挑戰。答題功能還沒加入，之後點這格就會出題。",
      locked: "先佔領旁邊的格子，這格才會解鎖。",
      occupied: "這格已經是你的領土了。"
    }[st];
    box.innerHTML = `<div class="info-top">${badge(ch, cat)}
        <div class="info-title"><h3>${u ? esc(u.name) : "預留格"}</h3><span class="muted">第 ${ch.id} 章・${esc(ch.name)}</span></div>
        <button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      <div class="tags"><span class="tag st-${st}">${STATUS[st]}</span>
        ${u ? `<span class="tag">${esc(PI.UNIT_TYPES[u.type] || u.type)}</span>${u.group ? `<span class="tag">${esc(u.group)}</span>` : ""}` : `<span class="tag">尚未加入藥物資料</span>`}</div>
      <p>${note}</p>`;
    box.hidden = false;
    $("infoClose").onclick = () => PI.map.select(null);
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
  let kView = null, kFrom = null;
  function openKnowledge(key) {
    const K = (PI.KNOWLEDGE || {})[key]; if (!K) return;
    const land = PI.LANDMASSES.find(l => l.chapters.includes(K.chapter)) || { name: "" };
    if ($("kpanel").hidden) { kView = PI.map.getView(); kFrom = document.activeElement; }   // 換別棵樹時不覆蓋最早的位置
    $("info").hidden = true;
    const ch = chOf(K.chapter), cat = catOf(ch.cat);
    const chips = `<span class="k-chip">${badge(ch, cat)}第 ${ch.id} 章</span>`;
    const item = it => `<article class="k-item">
        ${it.title ? `<h4>${esc(it.title)}</h4>` : ""}
        ${it.text ? `<p>${esc(it.text)}</p>` : ""}
        ${it.points && it.points.length ? `<ul>${it.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        ${it.source ? `<p class="k-src">出處：${esc(it.source)}</p>` : ""}</article>`;
    $("kpanel").innerHTML = `<div class="k-head">
        <div class="info-title"><span class="muted">${land.name ? esc(land.name) + "・" : ""}知識樹</span><h3 id="kTitle">${esc(K.title || ch.name)}</h3></div>
        <button type="button" class="close" id="kClose" aria-label="關閉知識面板">×</button></div>
      ${chips ? `<div class="k-chips">${chips}</div>` : ""}
      <div class="k-body">${(K.sections || []).map(sec => `<section class="k-sec">
          <h4 class="k-sec-title">${esc(sec.title)}</h4>
          ${sec.items && sec.items.length ? sec.items.map(item).join("")
            : `<p class="k-empty">尚未加入內容，之後依課堂講義補充。</p>`}</section>`).join("")}</div>`;
    $("kpanel").hidden = false;
    $("kClose").onclick = closeKnowledge;
    $("kClose").focus();
  }
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

  /* ---------- 新增學習單元：島嶼自動擴展，面板跟著更新 ----------
     例：PI.addUnit({ id: "vancomycin", chapter: 3, name: "Vancomycin", type: "drug", group: "Glycopeptides" }) */
  PI.addUnit = u => { const c = PI.map.addUnit(u); renderStats(); renderChapters(); return c; };

  /* ---------- 進度變動時全部更新 ---------- */
  PI.state.onChange(() => { PI.map.render(); renderStats(); renderChapters(); if (current) showInfo(current); });

  renderStats();
  renderChapters();
})();
