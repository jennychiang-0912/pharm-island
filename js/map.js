/* PHARMA ISLAND：群島地圖
   世界是一片海，每一章是一座島，島上每一格是一個學習單元（藥物、製劑、分類或主題）。

   資料與外觀分開：
   - 格子配置：每座島從中心一格開始，一格一格往外長。每次只從「已有格子旁邊的空位」挑，
     所以島一定連通、不會重疊、不會有孤立格；挑選時偏好鄰居多、離中心近的位置，再加一點固定亂數，形狀才自然。
   - 島嶼外觀：海岸線（淺水、浪花、沙灘、草地）依照格子位置重新畫，不拿海岸線來決定格子。
   - 島嶼位置：依各島預留的大小，從中心往外找不會相撞、且隔著足夠海面的位置。

   圖層（同一套世界座標）：
   海水紋理（容器背景）→ 海上裝飾 → 島嶼地形與海岸線 → 六角格 → 章節標記 → 選取外框
   只顯示畫面附近的島嶼與裝飾區塊。
   點格子呼叫 onSelect，點島嶼呼叫 onSelectIsland，要做什麼由 app.js 決定。 */
window.PI = window.PI || {};

PI.map = (function () {
  const SVGNS = "http://www.w3.org/2000/svg";
  const R = PI.MAP.hexRadius;
  const SQ3 = Math.sqrt(3);
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];   // 六個相鄰方向（axial 座標）
  const el = (tag, attrs) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const chapterOf = id => PI.CHAPTERS.find(c => c.id === id);
  const catOf = id => PI.CATEGORIES.find(c => c.id === id);
  const hexDist = (q, r) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
  const toXY = (q, r) => [R * SQ3 * (q + r / 2), R * 1.5 * r];
  function noise(a, b, s) {   // 固定亂數：同樣的輸入永遠得到同樣的值
    let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(s | 0, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /* ================= 島嶼資料 ================= */
  const islands = [];               // 每座島的資料
  const islandOf = new Map();       // 章節 id → 島
  const cells = [];                 // 所有格子（世界座標）
  const cellById = new Map();

  function makeIsland(ch) {
    const isl = {
      id: `island-${ch.id}`, chapter: ch.id,
      origin: { x: 0, y: 0 },       // 島在世界中的位置
      cells: [], occ: new Map(),    // 已配置的格子；occ 以 "q,r" 查格子
      coast: null,                  // 島嶼邊界：本地座標的範圍與半徑
      decor: [],                    // 島邊的礁石、迷你小島位置（本地座標）
      growth: { reservedRings: 0, needsLayout: false },   // 擴張狀態
      unitCount: 0, slotCount: 0,   // 目前的學習單元數、預留格數
      g: {}                         // 各圖層裡屬於這座島的群組
    };
    islands.push(isl); islandOf.set(ch.id, isl);
    return isl;
  }

  // 下一格要放哪裡：只從已有格子旁邊的空位挑
  function nextSpot(isl, group) {
    if (!isl.cells.length) return [0, 0];
    const seen = new Set(); let best = null, bestScore = -Infinity;
    isl.cells.forEach(c => DIRS.forEach(([dq, dr]) => {
      const q = c.q + dq, r = c.r + dr, key = `${q},${r}`;
      if (isl.occ.has(key) || seen.has(key)) return;
      seen.add(key);
      let nb = 0, same = 0;
      DIRS.forEach(([a, b]) => { const n = isl.occ.get(`${q + a},${r + b}`); if (n) { nb++; if (group && n.group === group) same++; } });
      const score = nb * 3 + same * 2 + noise(q, r, isl.chapter * 7919) * 3.4 - hexDist(q, r) * 0.75;
      if (score > bestScore) { bestScore = score; best = [q, r]; }
    }));
    return best;
  }

  function placeCell(isl, item) {
    const [q, r] = nextSpot(isl, item.group);
    const [lx, ly] = toXY(q, r);
    const c = { id: item.id, chapter: isl.chapter, island: isl, q, r, lx, ly, x: lx, y: ly,
                isStart: isl.cells.length === 0, unit: item.unit || null, group: item.group || null, neighbors: [] };
    DIRS.forEach(([a, b]) => { const n = isl.occ.get(`${q + a},${r + b}`); if (n) { c.neighbors.push(n.id); n.neighbors.push(c.id); } });
    isl.cells.push(c); isl.occ.set(`${q},${r}`, c);
    cells.push(c); cellById.set(c.id, c);
    return c;
  }

  // 島嶼邊界與島邊裝飾
  function computeCoast(isl) {
    const pad = R * 1.95;
    if (!isl.cells.length) { isl.coast = { minX: -pad, minY: -pad, maxX: pad, maxY: pad, radius: pad, cx: 0, cy: 0 }; return; }
    const xs = isl.cells.map(c => c.lx), ys = isl.cells.map(c => c.ly);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    isl.coast = {
      minX: Math.min(...xs) - pad, maxX: Math.max(...xs) + pad, minY: Math.min(...ys) - pad, maxY: Math.max(...ys) + pad,
      radius: Math.max(...isl.cells.map(c => Math.hypot(c.lx - cx, c.ly - cy))) + pad, cx, cy
    };
    // 島邊放 2～3 個礁石或迷你小島，位置跟著島的形狀走
    const rocks = PI.ART.decor.filter(d => d.kind === "rock"), tiny = PI.ART.decor.filter(d => d.kind === "island");
    const n = 2 + Math.floor(noise(isl.chapter, 1, 77) * 2);
    isl.decor = [];
    for (let i = 0; i < n; i++) {
      const a = noise(isl.chapter, i, 91) * Math.PI * 2;
      const d = (i === 0 && isl.cells.length > 20) ? tiny[Math.floor(noise(isl.chapter, i, 5) * tiny.length)] : rocks[Math.floor(noise(isl.chapter, i, 3) * rocks.length)];
      const scale = d.kind === "island" ? 0.6 : 1;
      const reach = Math.max(...isl.cells.map(c => (c.lx - cx) * Math.cos(a) + (c.ly - cy) * Math.sin(a)));
      const dist = reach + R * 1.9 + Math.max(d.w, d.h) * scale / 2;
      isl.decor.push({ src: d.src, w: d.w * scale, h: d.h * scale, x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist });
    }
  }

  // 島嶼位置：預留的大小決定要隔多遠；預留足夠時，島長大也不用移動其他島
  function reservedRadius(isl) {
    const n = Math.max(isl.cells.length, 1);
    let k = 0; while (3 * k * (k + 1) + 1 < Math.ceil(n * 1.25)) k++;
    isl.growth.reservedRings = k + 1;
    return Math.max((k + 1.5) * SQ3 * R + R * 1.95, isl.coast.radius) + R * 0.6;
  }
  const bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  function layout() {
    const placed = [], gap = PI.MAP.islandGap * SQ3 * R;
    islands.forEach((isl, i) => {
      const rad = reservedRadius(isl);
      let pos = { x: 0, y: 0 };
      if (placed.length) {
        search: for (let d = R; ; d += R * 0.75) {
          const steps = Math.max(12, Math.ceil(2 * Math.PI * d / (R * 1.5)));
          for (let s = 0; s < steps; s++) {
            const a = i * 2.39996 + s / steps * Math.PI * 2;
            const x = d * Math.cos(a), y = d * Math.sin(a) * 0.8;
            if (placed.every(p => Math.hypot(p.x - x, p.y - y) >= p.rad + rad + gap)) { pos = { x, y }; break search; }
          }
        }
      }
      placed.push({ ...pos, rad });
      isl.layoutRad = rad;
      isl.origin = { x: pos.x - isl.coast.cx, y: pos.y - isl.coast.cy };
      isl.growth.needsLayout = false;
    });
    islands.forEach(isl => {
      isl.cells.forEach(c => { c.x = isl.origin.x + c.lx; c.y = isl.origin.y + c.ly; });
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      const t = `translate(${isl.origin.x.toFixed(1)},${isl.origin.y.toFixed(1)})`;
      Object.values(isl.g).forEach(g => g && g.setAttribute("transform", t));
    });
    Object.assign(bounds, {
      minX: Math.min(...islands.map(i => i.bounds.minX)), maxX: Math.max(...islands.map(i => i.bounds.maxX)),
      minY: Math.min(...islands.map(i => i.bounds.minY)), maxY: Math.max(...islands.map(i => i.bounds.maxY))
    });
    buildClearGrid();
    decorChunks.forEach(d => d.g.remove()); decorChunks.clear();   // 島移動過，海上裝飾重新擺
  }

  function buildWorld() {
    PI.CHAPTERS.forEach(ch => {
      const isl = makeIsland(ch);
      const units = PI.UNITS.filter(u => u.chapter === ch.id);
      units.forEach(u => placeCell(isl, { id: `u:${u.id}`, unit: u, group: u.group }));
      const slots = Math.max((ch.estimate || 0) - units.length, 0);
      for (let i = 0; i < slots; i++) placeCell(isl, { id: `s${ch.id}-${units.length + i}` });
      isl.unitCount = units.length; isl.slotCount = slots;
      computeCoast(isl);
    });
  }

  /* ================= 繪製 ================= */
  let hl, svg, world, mapEl, decorLayer, terrainLayer, cellLayer, labelLayer, onSelect = () => {}, onSelectIsland = () => {}, selected = null, focusCh = null;
  const CH = PI.ART.chunkSize;
  const decorChunks = new Map();   // 海上裝飾：區塊 → 群組（需要時才產生）
  const view = { x: 0, y: 0, k: 1 };
  let HEX_PATH, SHINE_PATH, RING_PATH;
  const measure = document.createElement("canvas").getContext("2d");

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

  function init(container, opts) {
    onSelect = opts.onSelect || onSelect;
    onSelectIsland = opts.onSelectIsland || onSelectIsland;
    mapEl = container;
    container.style.backgroundImage = `url("${PI.ART.seaTile.src}")`;
    HEX_PATH = hexPath(R, PI.MAP.corner);
    SHINE_PATH = hexPath(R - PI.MAP.border / 2, PI.MAP.corner);
    RING_PATH = hexPath(R * 0.62, 6);

    svg = el("svg", { class: "map-svg", role: "img", "aria-label": "藥理學群島地圖" });
    // 格子的柔和明暗：左上亮、右下略暗
    svg.innerHTML = `<defs><radialGradient id="cellShade" cx="35%" cy="30%" r="80%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".08"/><stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="1" stop-color="#2F5A3F" stop-opacity=".07"/></radialGradient></defs>`;
    world = el("g", { class: "map-world" });
    decorLayer = el("g", { class: "layer-decor", "aria-hidden": "true" });    // 海上裝飾
    terrainLayer = el("g", { class: "layer-terrain" });                      // 島嶼地形與海岸線
    cellLayer = el("g", { class: "layer-cells" });                           // 六角格
    labelLayer = el("g", { class: "layer-labels" });                         // 章節標記
    hl = el("path", { class: "sel-ring", d: HEX_PATH, fill: "none", "stroke-width": 6, "pointer-events": "none" });   // 選取外框
    world.append(decorLayer, terrainLayer, cellLayer, labelLayer, hl);
    svg.appendChild(world);
    container.appendChild(svg);

    buildWorld();
    islands.forEach(isl => {
      isl.g.terrain = el("g", { class: "island-g island-terrain", "data-island": isl.chapter });
      isl.g.cells = el("g", { class: "island-g island-cells" });
      isl.g.label = el("g", { class: "island-g" });
      terrainLayer.appendChild(isl.g.terrain); cellLayer.appendChild(isl.g.cells); labelLayer.appendChild(isl.g.label);
      drawTerrain(isl); isl.cells.forEach(drawCell); drawLabel(isl);
    });
    layout();

    svg.addEventListener("focusin", e => { const g = e.target.closest?.(".cell"); if (g) placeRing(g.dataset.id); });
    svg.addEventListener("focusout", () => placeRing(selected));
    bindPanZoom(container);
    new ResizeObserver(() => frame(lastFrame.b, false, lastFrame.cap)).observe(container);
    render();
    return cells;
  }

  // 海岸線：只在島邊的格子底下疊圓形（淺水 → 浪花 → 沙灘 → 草地），合起來是圓潤不規則的島形
  /* 島嶼地形：全部依格子位置動態計算，新增格子後重新呼叫即可更新。
     由下到上：水下陰影 → 淺水 → 礁石 → 浪花 → 沙灘（含陰影）→ 草地土坡 → 連續草地 → 草地斑塊 → 島邊小花草叢
     外圍的圓形有固定亂數的大小變化，所以海岸線圓潤不規則，不會直接是六角格的硬邊。 */
  function drawTerrain(isl) {
    const g = isl.g.terrain; g.textContent = "";
    const C = PI.MAP.coast, seed = isl.chapter;
    const edge = isl.cells.filter(c => c.neighbors.length < 6);
    const layer = (cls, fill, op) => el("g", { class: cls, fill, opacity: op });
    const L = {
      shadow: layer("t-shadow", C.shadow, .22), shallow: layer("t-shallow", C.shallow, .55), foam: layer("t-foam", C.foam, .85),
      sandShade: layer("t-sand-shade", C.sandShade, 1), sand: layer("t-sand", C.sand, 1), cliff: layer("t-cliff", C.cliff, 1),
      grass: layer("t-grass", C.grass, 1), light: layer("t-grass-light", C.grassLight, .4), deco: el("g", { class: "t-deco" })
    };
    const circ = (grp, x, y, r) => grp.appendChild(el("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(1) }));
    edge.forEach(c => {
      const j = k => 0.9 + noise(c.q * 3 + k, c.r, seed) * 0.2;   // 每層各自的大小變化
      circ(L.shadow, c.lx, c.ly + 22, R * 1.72 * j(0));
      circ(L.shallow, c.lx, c.ly, R * 1.98 * j(1));
      circ(L.foam, c.lx, c.ly + 3, R * 1.5 * j(2));
      circ(L.sandShade, c.lx, c.ly + 8, R * 1.38 * j(3));
      circ(L.sand, c.lx, c.ly, R * 1.36 * j(3));
      circ(L.cliff, c.lx, c.ly + 9, R * 1.1);
    });
    // 連續草地：每一格都鋪，格子之間沒有縫
    isl.cells.forEach(c => {
      circ(L.grass, c.lx, c.ly, R * 1.1);
      if (noise(c.q, c.r, seed + 19) > 0.3) return;   // 只有少數幾處有淺色斑塊，跨在格子之間
      const a = noise(c.q, c.r, seed + 11) * Math.PI * 2, d = R * (0.55 + noise(c.q, c.r, seed + 13) * 0.35);
      circ(L.light, c.lx + Math.cos(a) * d, c.ly + Math.sin(a) * d, R * (0.6 + noise(c.q, c.r, seed + 17) * 0.4));
    });
    // 島邊的小花與草叢：只放在外圍格子朝海那一側的草地邊緣，不會蓋到格子
    edge.forEach(c => DIRS.forEach(([dq, dr], i) => {
      if (isl.occ.has(`${c.q + dq},${c.r + dr}`)) return;
      const pick = noise(c.q, c.r, seed * 31 + i);
      if (pick > 0.42) return;
      const [nx, ny] = toXY(dq, dr), len = Math.hypot(nx, ny);
      const x = c.lx + nx / len * R * 0.98, y = c.ly + ny / len * R * 0.98;
      L.deco.appendChild(pick < 0.16 ? flower(x, y, pick) : tuft(x, y));
    }));
    g.append(L.shadow, L.shallow);
    isl.decor.forEach(d => g.appendChild(el("image", { href: d.src, x: (d.x - d.w / 2).toFixed(1), y: (d.y - d.h / 2).toFixed(1), width: d.w.toFixed(1), height: d.h.toFixed(1), class: "decor" })));
    g.append(L.foam, L.sandShade, L.sand, L.cliff, L.grass, L.light, L.deco);
  }
  function flower(x, y, t) {
    const colors = ["#FFFFFF", "#F7D9E3", "#FBEFA8"], col = colors[Math.floor(t * 100) % 3];
    const f = el("g", { class: "t-flower", transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` });
    [[-5, -2], [4, -4], [1, 5]].forEach(([dx, dy]) => f.appendChild(el("circle", { cx: dx, cy: dy, r: 3.4, fill: col })));
    f.appendChild(el("circle", { cx: 0, cy: 0, r: 2.2, fill: "#F2C14E" }));
    return f;
  }
  function tuft(x, y) {
    return el("path", { class: "t-tuft", d: `M${(x - 7).toFixed(1)},${(y + 4).toFixed(1)} q3,-9 5,-11 M${x.toFixed(1)},${(y + 4).toFixed(1)} q0,-10 1,-13 M${(x + 7).toFixed(1)},${(y + 4).toFixed(1)} q-2,-8 -4,-10`,
      fill: "none", stroke: "#7FAE6A", "stroke-width": 2.6, "stroke-linecap": "round" });
  }

  function drawCell(c) {
    const g = el("g", { class: "cell", transform: `translate(${c.lx.toFixed(1)},${c.ly.toFixed(1)})`, "data-id": c.id, role: "button" });
    g.appendChild(el("path", { class: "cell-hex", d: HEX_PATH, "stroke-width": PI.MAP.border, stroke: PI.MAP.borderColor, "stroke-opacity": PI.MAP.borderOpacity }));
    g.appendChild(el("path", { class: "cell-shade", d: SHINE_PATH, fill: "url(#cellShade)" }));   // 極輕微的明暗，讓每塊地有一點起伏
    g.appendChild(el("path", { class: "cell-shine", d: SHINE_PATH }));   // 滑鼠移上去時只讓格子內部變亮
    g.appendChild(el("path", { class: "cell-ring", d: RING_PATH }));
    const flag = el("g", { class: "cell-flag" });
    flag.appendChild(el("path", { d: "M-8,14 L-8,-16 M-8,-16 L14,-9 L-8,-2", fill: "none", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }));
    g.appendChild(flag);
    if (c.unit) {
      const t = el("text", { class: "cell-name", y: 34 });
      t.textContent = c.unit.name.length > 11 ? c.unit.name.slice(0, 10) + "…" : c.unit.name;
      g.appendChild(t);
    }
    c.el = g;
    c.island.g.cells.appendChild(g);
  }

  // 章節標記：島的上方一塊牌子（章節徽章＋名稱），縮小地圖時牌子維持可讀的大小
  function drawLabel(isl) {
    const ch = chapterOf(isl.chapter), cat = catOf(ch.cat);
    const g = isl.g.label; g.textContent = "";
    const x = isl.coast.cx, y = isl.coast.minY + R * 0.35;
    const lab = el("g", { class: "island-label", "data-island": isl.chapter, transform: `translate(${x.toFixed(1)},${y.toFixed(1)})`, tabindex: 0, role: "button", "aria-label": `第 ${ch.id} 章 ${ch.name}` });
    const inner = el("g", { class: "label-inner" });
    measure.font = `700 17px ${getComputedStyle(document.body).fontFamily}`;
    const w = Math.ceil(measure.measureText(ch.name).width) + 62;
    inner.appendChild(el("rect", { class: "label-bg", x: -w / 2, y: -21, width: w, height: 42, rx: 21 }));
    inner.appendChild(el("circle", { cx: -w / 2 + 21, cy: 0, r: 14, fill: cat.tint, stroke: cat.color, "stroke-width": 2.5 }));
    const num = el("text", { class: "label-num", x: -w / 2 + 21, y: 1 }); num.textContent = ch.id;
    const name = el("text", { class: "label-name", x: -w / 2 + 43, y: 1 }); name.textContent = ch.name;
    inner.append(num, name);
    lab.appendChild(inner);
    g.appendChild(lab);
    isl.labelInner = inner;
  }

  function placeRing(id) {
    const c = id && cellById.get(id);
    if (!c) { hl.style.display = "none"; return; }
    hl.setAttribute("transform", `translate(${c.x.toFixed(1)},${c.y.toFixed(1)})`);
    hl.style.display = "";
  }

  function render() {
    cells.forEach(c => {
      const g = c.el;
      const st = PI.state.statusOf(c), ch = chapterOf(c.chapter);
      g.dataset.status = st;
      g.classList.toggle("is-slot", !c.unit);
      const hex = g.querySelector(".cell-hex");
      hex.setAttribute("fill", PI.MAP.fill[st].color);
      hex.setAttribute("fill-opacity", PI.MAP.fill[st].opacity);
      g.setAttribute("tabindex", st === "locked" && focusCh !== c.chapter ? "-1" : "0");
      const what = c.unit ? c.unit.name : "預留格";
      g.setAttribute("aria-label", `第 ${c.chapter} 章 ${ch.name}，${what}，${({ occupied: "已佔領", available: "可挑戰", locked: "未解鎖" })[st]}`);
    });
    islands.forEach(isl => Object.values(isl.g).forEach(g => g.classList.toggle("is-dim", focusCh !== null && isl.chapter !== focusCh)));
    placeRing(selected);
  }

  /* ---------- 拖曳與縮放 ---------- */
  function apply() {
    world.setAttribute("transform", `translate(${view.x.toFixed(1)},${view.y.toFixed(1)}) scale(${view.k.toFixed(4)})`);
    // 海水紋理跟著世界座標移動與縮放，所以無論拖到哪裡都不會露出空白
    const t = PI.ART.seaTile.size * view.k;
    mapEl.style.backgroundSize = `${t.toFixed(2)}px ${t.toFixed(2)}px`;
    mapEl.style.backgroundPosition = `${view.x.toFixed(1)}px ${view.y.toFixed(1)}px`;
    // 章節牌子：地圖縮小時放大回來，讓字維持可讀
    const s = Math.min(Math.max(0.9 / view.k, 1), 5).toFixed(3);
    const lift = (-21 * (s - 1)).toFixed(1);   // 放大時牌子往上長，不蓋到島
    islands.forEach(isl => isl.labelInner && isl.labelInner.setAttribute("transform", `translate(0,${lift}) scale(${s})`));
    svg.classList.toggle("is-near", view.k > 0.55);   // 放大到一定程度才顯示格子裡的藥名
    if (!cullQueued) { cullQueued = true; requestAnimationFrame(cull); }
  }

  /* ---------- 分區顯示：只顯示畫面附近的島嶼與裝飾 ---------- */
  let cullQueued = false;
  function visibleRect() {
    const { w, h } = size();
    return { x0: -view.x / view.k, y0: -view.y / view.k, x1: (w - view.x) / view.k, y1: (h - view.y) / view.k };
  }
  function cull() {
    cullQueued = false;
    const v = visibleRect(), m = 300 / view.k;   // 牌子會放大，邊界多留一點
    islands.forEach(isl => {
      const b = isl.bounds;
      const on = b.maxX + m > v.x0 && b.minX - m < v.x1 && b.maxY + m > v.y0 && b.minY - m < v.y1;
      if (on !== isl.on) { isl.on = on; Object.values(isl.g).forEach(g => { g.style.display = on ? "" : "none"; }); }
    });
    const kx0 = Math.floor(v.x0 / CH) - 1, kx1 = Math.floor(v.x1 / CH) + 1;
    const ky0 = Math.floor(v.y0 / CH) - 1, ky1 = Math.floor(v.y1 / CH) + 1;
    if ((kx1 - kx0) * (ky1 - ky0) > 400) return;          // 縮得太小時不再新增裝飾
    for (let kx = kx0; kx <= kx1; kx++) for (let ky = ky0; ky <= ky1; ky++) ensureDecor(kx, ky);
    decorChunks.forEach((d, key) => {
      const on = d.kx >= kx0 && d.kx <= kx1 && d.ky >= ky0 && d.ky <= ky1;
      if (on !== d.on) { d.on = on; d.g.style.display = on ? "" : "none"; }
      const far = Math.max(kx0 - d.kx, d.kx - kx1, ky0 - d.ky, d.ky - ky1);
      if (far > 4) { d.g.remove(); decorChunks.delete(key); }   // 離很遠的區塊直接移除，避免越拖越卡
    });
  }

  /* ---------- 裝飾：小島、礁石、浪花（依區塊用固定亂數擺放，同一區塊每次都一樣） ---------- */
  const clearGrid = new Map(); const CG = 200;
  function buildClearGrid() {
    clearGrid.clear();
    cells.forEach(c => {
      const k = `${Math.floor(c.x / CG)},${Math.floor(c.y / CG)}`;
      if (!clearGrid.has(k)) clearGrid.set(k, []);
      clearGrid.get(k).push(c);
    });
  }
  function nearTerritory(x, y, r) {
    const need = r + PI.ART.keepClear, span = Math.ceil(need / CG);
    const gx = Math.floor(x / CG), gy = Math.floor(y / CG);
    for (let i = -span; i <= span; i++) for (let j = -span; j <= span; j++) {
      const list = clearGrid.get(`${gx + i},${gy + j}`);
      if (list && list.some(c => Math.hypot(c.x - x, c.y - y) < need)) return true;
    }
    return false;
  }
  function rng(seed) {   // mulberry32
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function ensureDecor(kx, ky) {
    const key = `${kx},${ky}`;
    if (decorChunks.has(key)) return;
    const g = el("g", { class: "chunk-decor" });
    const rand = rng(kx * 73856093 ^ ky * 19349663);
    const placed = [];
    ["island", "rock", "wave"].forEach(kind => {
      const pool = PI.ART.decor.filter(d => d.kind === kind);
      const [lo, hi] = PI.ART.perChunk[kind];
      const count = lo + Math.floor(rand() * (hi - lo + 1));
      for (let n = 0; n < count; n++) {
        const d = pool[Math.floor(rand() * pool.length)];
        for (let tries = 0; tries < 6; tries++) {
          const x = (kx + rand()) * CH, y = (ky + rand()) * CH, r = Math.max(d.w, d.h) / 2;
          if (nearTerritory(x, y, r * 0.8)) continue;
          if (placed.some(p => Math.hypot(p.x - x, p.y - y) < (p.r + r) * 0.9)) continue;
          placed.push({ x, y, r });
          const img = el("image", { href: d.src, x: (x - d.w / 2).toFixed(1), y: (y - d.h / 2).toFixed(1), width: d.w, height: d.h, class: `decor decor-${kind}` });
          if (kind === "wave") g.prepend(img); else g.appendChild(img);   // 浪花在最底下
          break;
        }
      }
    });
    decorLayer.appendChild(g);
    decorChunks.set(key, { g, kx, ky, on: true });
  }
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
          const hit = document.elementFromPoint(e.clientX, e.clientY);
          const g = hit?.closest(".cell"), isl = hit?.closest("[data-island]");
          if (g) select(g.dataset.id);
          else if (isl) selectIsland(+isl.dataset.island);
          else select(null);
        }
      }
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    svg.addEventListener("wheel", e => { e.preventDefault(); const [x, y] = local(e); zoomAt(Math.exp(-e.deltaY * 0.0015), x, y); }, { passive: false });
    svg.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const g = e.target.closest?.(".cell"), isl = e.target.closest?.(".island-label");
      if (g) { e.preventDefault(); select(g.dataset.id); }
      else if (isl) { e.preventDefault(); selectIsland(+isl.dataset.island); }
    });
  }


  function select(id) {
    selected = id; render();
    onSelect(id ? cellById.get(id) : null);
  }
  function selectIsland(chId) {
    selected = null; render();
    onSelectIsland(chId);
  }

  function focusChapter(chId) {
    focusCh = chId; render();
    if (chId === null) { fit(true); return; }
    const isl = islandOf.get(chId);
    frame(isl.bounds, true, 0.95);   // 聚焦章節時不要放得太大
  }

  /* ================= 新增學習單元：自動擴展對應的島 =================
     先填進這座島的預留格；沒有預留格時，在島的邊界旁長出新的一格。
     只重畫這座島的海岸線；島長到超過預留大小時才重新安排島的位置（只移動群組，不重畫）。 */
  function addUnit(u) {
    if (!u || !u.id || !islandOf.has(u.chapter)) throw new Error("單元需要 id 與正確的 chapter");
    if (cellById.has(`u:${u.id}`)) throw new Error(`單元 id 重複：${u.id}`);
    PI.UNITS.push(u);
    const isl = islandOf.get(u.chapter);
    let c = isl.cells.find(x => !x.unit);
    if (c) {   // 預留格 → 正式單元
      const oldId = c.id, newId = `u:${u.id}`;
      cellById.delete(oldId); c.id = newId; c.unit = u; c.group = u.group || null; cellById.set(newId, c);
      c.neighbors.forEach(nid => { const n = cellById.get(nid); n.neighbors = n.neighbors.map(x => x === oldId ? newId : x); });
      c.el.remove(); drawCell(c);
      isl.slotCount--;
    } else {
      c = placeCell(isl, { id: `u:${u.id}`, unit: u, group: u.group });
      c.x = isl.origin.x + c.lx; c.y = isl.origin.y + c.ly;
      drawCell(c);
    }
    isl.unitCount++;
    computeCoast(isl); drawTerrain(isl); drawLabel(isl);
    if (isl.coast.radius > isl.layoutRad) { isl.growth.needsLayout = true; layout(); }
    else {
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      buildClearGrid();
    }
    apply(); render();
    return c;
  }

  return {
    init, render, select, focusChapter, addUnit,
    fit: () => fit(true), zoomIn: () => zoomBy(1.25), zoomOut: () => zoomBy(0.8),
    get islands() { return islands; }
  };
})();
