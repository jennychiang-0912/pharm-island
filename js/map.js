/* PHARMA ISLAND：六角格地圖
   - 依 PI.CHAPTERS 動態產生格子（不手動畫）
   - 每章一群格子（中心一格＋周圍最多六格），各群拼成一座島
   - 支援拖曳、滾輪／雙指縮放、放大縮小按鈕
   點擊格子只會呼叫 onSelect，要做什麼由 app.js 決定。 */
window.PI = window.PI || {};

PI.map = (function () {
  const SVGNS = "http://www.w3.org/2000/svg";
  const R = PI.MAP.hexRadius;
  const SQ3 = Math.sqrt(3);
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];   // 六個相鄰方向（axial 座標）

  /* ---------- 產生格子 ---------- */
  // 每章的中心位置：用「七格花」的排列，讓各章的格子剛好拼在一起
  const rot = ([q, r]) => [-r, q + r];                 // 旋轉 60°
  const FLOWER = [[2, 1]]; for (let i = 0; i < 5; i++) FLOWER.push(rot(FLOWER[i]));
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  function clusterCenters(n) {
    const ring1 = FLOWER;
    const ring2 = [];
    for (let i = 0; i < 6; i++) { ring2.push(add(FLOWER[i], FLOWER[i])); ring2.push(add(FLOWER[i], FLOWER[(i + 1) % 6])); }
    const order = [[0, 0], ...ring1, ...[0, 3, 6, 9, 1, 4, 7, 10, 2, 5, 8, 11].map(i => ring2[i])];
    return order.slice(0, n);
  }

  function buildCells() {
    const centers = clusterCenters(PI.CHAPTERS.length);
    const cells = [];
    PI.CHAPTERS.forEach((ch, i) => {
      const c = centers[i];
      const spots = [c, ...DIRS.map(d => add(c, d))].slice(0, Math.min(ch.cells, 7));
      spots.forEach(([q, r], k) => cells.push({
        id: `c${ch.id}-${k}`, chapter: ch.id, q, r, isStart: k === 0,
        x: R * SQ3 * (q + r / 2), y: R * 1.5 * r
      }));
    });
    const byQR = new Map(cells.map(c => [`${c.q},${c.r}`, c]));
    cells.forEach(c => {
      c.neighbors = DIRS.map(d => byQR.get(`${c.q + d[0]},${c.r + d[1]}`)).filter(Boolean).map(n => n.id);
    });
    return cells;
  }

  /* 圓角六角形（與 Penpot 的 hex-rounded 同形狀） */
  function hexPath(rad, corner) {
    const P = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 90); P.push([rad * Math.cos(a), rad * Math.sin(a)]); }
    const toward = (a, b, t) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L]; };
    let d = "";
    for (let i = 0; i < 6; i++) {
      const p0 = P[(i + 5) % 6], p1 = P[i], p2 = P[(i + 1) % 6];
      const a = toward(p1, p0, corner), b = toward(p1, p2, corner);
      d += (i ? " L" : "M") + a.map(v => v.toFixed(2)).join(",") + " Q" + p1.map(v => v.toFixed(2)).join(",") + " " + b.map(v => v.toFixed(2)).join(",");
    }
    return d + " Z";
  }

  /* ---------- 繪製 ---------- */
  let hl, svg, world, cells, onSelect = () => {}, selected = null, focusCh = null;
  const view = { x: 0, y: 0, k: 1 };
  const bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const el = (tag, attrs) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const chapterOf = id => PI.CHAPTERS.find(c => c.id === id);
  const catOf = id => PI.CATEGORIES.find(c => c.id === id);

  function init(container, opts) {
    onSelect = opts.onSelect || onSelect;
    cells = buildCells();
    svg = el("svg", { class: "map-svg", role: "img", "aria-label": "領土地圖" });
    world = el("g", { class: "map-world" });
    svg.appendChild(world);
    container.appendChild(svg);

    const path = hexPath(R, PI.MAP.corner);
    cells.forEach(c => {
      const g = el("g", { class: "cell", transform: `translate(${c.x.toFixed(1)},${c.y.toFixed(1)})`, "data-id": c.id });
      g.appendChild(el("path", { class: "cell-hex", d: path, "stroke-width": PI.MAP.border, stroke: PI.MAP.borderColor }));
      g.appendChild(el("path", { class: "cell-ring", d: hexPath(R * 0.62, 6) }));
      const flag = el("g", { class: "cell-flag" });
      flag.appendChild(el("path", { d: "M-8,14 L-8,-16 M-8,-16 L14,-9 L-8,-2", fill: "none", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      g.appendChild(flag);
      if (c.isStart) {   // 章節徽章：依分類使用識別色
        const cat = catOf(chapterOf(c.chapter).cat);
        const badge = el("g", { class: "cell-badge" });
        badge.appendChild(el("circle", { class: "badge-halo", r: 30 }));
        badge.appendChild(el("circle", { r: 24, fill: cat.tint, stroke: cat.color, "stroke-width": 3 }));
        const t = el("text", { class: "badge-num", y: 1 });
        t.textContent = c.chapter;
        badge.appendChild(t);
        g.appendChild(badge);
      }
      world.appendChild(g);
    });

    // 選取外框另外畫在最上層，才不會被旁邊的格子蓋住
    hl = el("path", { class: "sel-ring", d: path, fill: "none", "stroke-width": 6, "pointer-events": "none" });
    world.appendChild(hl);
    svg.addEventListener("focusin", e => { const g = e.target.closest?.(".cell"); if (g) placeRing(g.dataset.id); });
    svg.addEventListener("focusout", () => placeRing(selected));

    bounds.minX = Math.min(...cells.map(c => c.x)) - R; bounds.maxX = Math.max(...cells.map(c => c.x)) + R;
    bounds.minY = Math.min(...cells.map(c => c.y)) - R; bounds.maxY = Math.max(...cells.map(c => c.y)) + R;

    bindPanZoom(container);
    new ResizeObserver(() => frame(lastFrame.b, false, lastFrame.cap)).observe(container);
    render();
    return cells;
  }

  function placeRing(id) {
    const c = id && cells.find(x => x.id === id);
    if (!c) { hl.style.display = "none"; return; }
    hl.setAttribute("transform", `translate(${c.x.toFixed(1)},${c.y.toFixed(1)})`);
    hl.style.display = "";
  }

  function render() {
    cells.forEach(c => {
      const g = world.querySelector(`[data-id="${c.id}"]`);
      const st = PI.state.statusOf(c), ch = chapterOf(c.chapter);
      g.dataset.status = st;
      const hex = g.querySelector(".cell-hex");
      hex.setAttribute("fill", PI.MAP.fill[st]);
      g.classList.toggle("is-selected", selected === c.id);
      g.classList.toggle("is-dim", focusCh !== null && c.chapter !== focusCh);
      g.setAttribute("tabindex", st === "locked" && !(focusCh === c.chapter) ? "-1" : "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", `第 ${c.chapter} 章 ${ch.name}，${({ occupied: "已佔領", available: "可挑戰", locked: "未解鎖" })[st]}`);
    });
    placeRing(selected);
  }

  /* ---------- 拖曳與縮放 ---------- */
  function apply() { world.setAttribute("transform", `translate(${view.x.toFixed(1)},${view.y.toFixed(1)}) scale(${view.k.toFixed(4)})`); }
  function size() { const r = svg.getBoundingClientRect(); return { w: r.width, h: r.height }; }
  function fitScale(b) {
    const { w, h } = size(); const pad = Math.min(PI.MAP.padding, Math.min(w, h) * 0.06);   // 小螢幕時留白跟著縮小
    return Math.min((w - pad * 2) / (b.maxX - b.minX), (h - pad * 2) / (b.maxY - b.minY));
  }
  function limits() { const f = fitScale(bounds); return { min: f * 0.6, max: Math.max(f * 4, 1.6) }; }
  function clamp() {
    // 讓地圖至少有一部分留在畫面裡，不會被拖到看不見
    const { w, h } = size(), m = 80;
    const left = bounds.minX * view.k + view.x, right = bounds.maxX * view.k + view.x;
    const top = bounds.minY * view.k + view.y, bottom = bounds.maxY * view.k + view.y;
    if (right < m) view.x += m - right; if (left > w - m) view.x -= left - (w - m);
    if (bottom < m) view.y += m - bottom; if (top > h - m) view.y -= top - (h - m);
  }
  function animateTo(target, ms) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !ms) { Object.assign(view, target); apply(); return; }
    const from = { ...view }, t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3);
      view.x = from.x + (target.x - from.x) * e; view.y = from.y + (target.y - from.y) * e; view.k = from.k + (target.k - from.k) * e;
      apply(); if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  let lastFrame = { b: bounds, cap: Infinity };
  function frame(b, animate, cap = Infinity) {
    lastFrame = { b, cap };
    const { w, h } = size(); if (!w || !h) return;
    const k = Math.min(fitScale(b), cap), cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
    view.ready = true;
    animateTo({ k, x: w / 2 - cx * k, y: h / 2 - cy * k }, animate ? 380 : 0);
  }
  function fit(animate) { frame(bounds, animate); }
  function zoomAt(factor, px, py) {
    const { min, max } = limits();
    const k = Math.max(min, Math.min(max, view.k * factor));
    view.x = px - (px - view.x) * (k / view.k); view.y = py - (py - view.y) * (k / view.k); view.k = k;
    clamp(); apply();
  }
  function zoomBy(factor) { const { w, h } = size(); zoomAt(factor, w / 2, h / 2); }

  function bindPanZoom(container) {
    const pts = new Map(); let moved = 0, last = null, pinch = null;
    const local = e => { const r = svg.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    svg.addEventListener("pointerdown", e => {
      svg.setPointerCapture(e.pointerId); pts.set(e.pointerId, local(e)); moved = 0;
      if (pts.size === 1) last = local(e);
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) }; }
      container.classList.add("is-dragging");
    });
    svg.addEventListener("pointermove", e => {
      if (!pts.has(e.pointerId)) return;
      const p = local(e); pts.set(e.pointerId, p);
      if (pts.size === 2 && pinch) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        zoomAt(d / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinch.d = d; moved += 10; return;
      }
      if (pts.size === 1 && last) {
        view.x += p[0] - last[0]; view.y += p[1] - last[1]; moved += Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]);
        last = p; clamp(); apply();
      }
    });
    const end = e => {
      pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
      if (pts.size === 1) last = [...pts.values()][0];
      if (!pts.size) {
        container.classList.remove("is-dragging");
        if (moved < 6 && e.type === "pointerup") {
          const g = document.elementFromPoint(e.clientX, e.clientY)?.closest(".cell");
          select(g ? g.dataset.id : null);
        }
      }
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    svg.addEventListener("wheel", e => { e.preventDefault(); const [x, y] = local(e); zoomAt(Math.exp(-e.deltaY * 0.0015), x, y); }, { passive: false });
    svg.addEventListener("keydown", e => {
      if ((e.key === "Enter" || e.key === " ") && e.target.closest?.(".cell")) { e.preventDefault(); select(e.target.closest(".cell").dataset.id); }
    });
  }

  function select(id) {
    selected = id; render();
    onSelect(id ? cells.find(c => c.id === id) : null);
  }

  function focusChapter(chId) {
    focusCh = chId; render();
    if (chId === null) { fit(true); return; }
    const mine = cells.filter(c => c.chapter === chId);
    const b = { minX: Math.min(...mine.map(c => c.x)) - R * 2, maxX: Math.max(...mine.map(c => c.x)) + R * 2,
                minY: Math.min(...mine.map(c => c.y)) - R * 2, maxY: Math.max(...mine.map(c => c.y)) + R * 2 };
    frame(b, true, 0.95);   // 聚焦章節時不要放得太大
  }

  return { init, render, fit: () => fit(true), zoomIn: () => zoomBy(1.25), zoomOut: () => zoomBy(0.8), focusChapter, select };
})();
