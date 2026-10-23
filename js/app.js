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

  const cells = PI.map.init($("map"), { onSelect: showInfo });

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
            <span class="ch-no" style="background:${ch.color}">${ch.id}</span>
            <span class="ch-name">${esc(ch.name)}</span>
            <span class="ch-prog">${pr.done}/${pr.total}</span></button>`;
        }).join("")}</div>`;
    }).join("");
    $("allBtn").setAttribute("aria-pressed", focus === null);
  }
  function setFocus(chId) {
    focus = chId;
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
  function showInfo(cell) {
    current = cell;
    const box = $("info");
    if (!cell) { box.hidden = true; return; }
    const ch = chOf(cell.chapter), cat = catOf(ch.cat), st = PI.state.statusOf(cell);
    const pr = PI.state.chapterProgress(cells, ch.id);
    const note = {
      available: "這格可以挑戰。答題功能還沒加入，之後點這格就會出題。",
      locked: "先佔領旁邊的格子，這格才會解鎖。",
      occupied: "這格已經是你的領土了。"
    }[st];
    box.innerHTML = `<div class="info-top"><span class="ch-no" style="background:${ch.color}">${ch.id}</span>
        <h3>${esc(ch.name)}</h3><button type="button" class="close" id="infoClose" aria-label="關閉">×</button></div>
      <div class="tags"><span class="tag st-${st}">${STATUS[st]}</span><span class="tag">${esc(cat.name)}</span><span class="tag">本章 ${pr.done}/${pr.total} 格</span></div>
      <p>${note}</p>`;
    box.hidden = false;
    $("infoClose").onclick = () => PI.map.select(null);
  }

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

  /* ---------- 進度變動時全部更新 ---------- */
  PI.state.onChange(() => { PI.map.render(); renderStats(); renderChapters(); if (current) showInfo(current); });

  renderStats();
  renderChapters();
})();
