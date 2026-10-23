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
  const islands = [];               // 每一章的區域資料（主島上的區域或獨立島）
  const islandOf = new Map();       // 章節 id → 區域
  const lands = [];                 // 陸地（主島、第 9／10／11 章島）：地形依這裡畫
  const landOf = new Map();         // 章節 id → 陸地
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

  // 區域的邊界範圍（本地座標），用來安排位置
  function computeCoast(isl) {
    const pad = R * 1.95;
    if (!isl.cells.length) { isl.coast = { minX: -pad, minY: -pad, maxX: pad, maxY: pad, radius: pad, cx: 0, cy: 0 }; return; }
    const xs = isl.cells.map(c => c.lx), ys = isl.cells.map(c => c.ly);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    isl.coast = {
      minX: Math.min(...xs) - pad, maxX: Math.max(...xs) + pad, minY: Math.min(...ys) - pad, maxY: Math.max(...ys) + pad,
      radius: Math.max(...isl.cells.map(c => Math.hypot(c.lx - cx, c.ly - cy))) + pad, cx, cy
    };
  }

  // 島嶼位置：預留的大小決定要隔多遠；預留足夠時，島長大也不用移動其他島
  function reservedRadius(isl) {
    // 主島上的區域：緊靠排列，只留一條小路的寬度（超過時會自動重新安排）
    if (landOf.get(isl.chapter).def.chapters.length > 1) return isl.coast.radius - R * 0.95;
    const n = Math.max(isl.cells.length, 1);
    let k = 0; while (3 * k * (k + 1) + 1 < Math.ceil(n * 1.25)) k++;
    isl.growth.reservedRings = k + 1;
    return Math.max((k + 1.5) * SQ3 * R + R * 1.95, isl.coast.radius) + R * 0.6;
  }
  const bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  // 在已放好的圓旁邊找位置：沿著指定方向（或黃金角）由近而遠找第一個不相撞的點
  function findSpot(placed, rad, gap, angle, spread) {
    if (!placed.length) return { x: 0, y: 0 };
    for (let d = R; ; d += R * 0.6) {
      const steps = Math.max(12, Math.ceil(2 * Math.PI * d / (R * 1.2)));
      for (let s = 0; s < steps; s++) {
        const off = (s % 2 ? 1 : -1) * Math.ceil(s / 2) / steps * spread;   // 從偏好方向往兩側展開
        const a = angle + off;
        const x = d * Math.cos(a), y = d * Math.sin(a) * 0.82;
        if (placed.every(p => Math.hypot(p.x - x, p.y - y) >= p.rad + rad + gap)) return { x, y };
      }
    }
  }
  function layout() {
    // 1) 每塊陸地內：各章節區域緊靠排列，中間留一條草地小路
    lands.forEach(land => {
      const placed = [], gap = PI.MAP.regionGap * SQ3 * R;
      land.regions.forEach((isl, i) => {
        const rad = reservedRadius(isl);
        const pos = findSpot(placed, rad, gap, i * 2.39996 + 0.6, Math.PI * 2);
        placed.push({ ...pos, rad }); isl.layoutRad = rad; isl.offset = pos;
      });
      land.radius = Math.max(...placed.map(p => Math.hypot(p.x, p.y) + p.rad)) + R * 1.5;
    });
    // 2) 陸地之間：主島在中央，其他島依設定的方向放，隔著海
    const placedLands = [], gap = PI.MAP.islandGap * SQ3 * R;
    lands.forEach(land => {
      const ang = (land.def.angle ?? 0) * Math.PI / 180;
      land.center = findSpot(placedLands, land.radius, gap + noise(land.regions[0].chapter, 3, 9) * R * 2, ang, Math.PI * 0.9);
      placedLands.push({ ...land.center, rad: land.radius });
    });
    // 3) 套用位置
    islands.forEach(isl => {
      const land = landOf.get(isl.chapter);
      isl.origin = { x: land.center.x + isl.offset.x - isl.coast.cx, y: land.center.y + isl.offset.y - isl.coast.cy };
      isl.growth.needsLayout = false;
      isl.cells.forEach(c => { c.x = isl.origin.x + c.lx; c.y = isl.origin.y + c.ly; });
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      const t = `translate(${isl.origin.x.toFixed(1)},${isl.origin.y.toFixed(1)})`;
      Object.values(isl.g).forEach(g => g && g.setAttribute("transform", t));
    });
    lands.forEach(drawTerrain);
    Object.assign(bounds, {
      minX: Math.min(...lands.map(l => l.bounds.minX)), maxX: Math.max(...lands.map(l => l.bounds.maxX)),
      minY: Math.min(...lands.map(l => l.bounds.minY)), maxY: Math.max(...lands.map(l => l.bounds.maxY))
    });
    buildClearGrid();
    decorChunks.forEach(d => d.g.remove()); decorChunks.clear();   // 島移動過，海上裝飾重新擺
  }

  function buildWorld() {
    const defs = PI.LANDMASSES || PI.CHAPTERS.map(ch => ({ id: `ch${ch.id}`, chapters: [ch.id] }));
    const assigned = new Set(defs.flatMap(d => d.chapters));
    PI.CHAPTERS.filter(ch => !assigned.has(ch.id)).forEach(ch => defs.push({ id: `ch${ch.id}`, chapters: [ch.id] }));   // 新章節自動成為獨立島
    defs.forEach(def => { const land = { id: def.id, def, regions: [], g: null }; lands.push(land); def.chapters.forEach(id => landOf.set(id, land)); });
    PI.CHAPTERS.forEach(ch => {
      const isl = makeIsland(ch);
      const units = PI.UNITS.filter(u => u.chapter === ch.id);
      units.forEach(u => placeCell(isl, { id: `u:${u.id}`, unit: u, group: u.group }));
      const slots = Math.max((ch.estimate || 0) - units.length, 0);
      for (let i = 0; i < slots; i++) placeCell(isl, { id: `s${ch.id}-${units.length + i}` });
      isl.unitCount = units.length; isl.slotCount = slots;
      computeCoast(isl);
      landOf.get(ch.id).regions.push(isl);
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
    lands.forEach(land => { land.g = el("g", { class: "land-terrain", "data-land": land.id }); terrainLayer.appendChild(land.g); });
    islands.forEach(isl => {
      isl.g.cells = el("g", { class: "island-g island-cells" });
      isl.g.label = el("g", { class: "island-g" });
      cellLayer.appendChild(isl.g.cells); labelLayer.appendChild(isl.g.label);
      isl.cells.forEach(drawCell); drawLabel(isl);
    });
    layout();   // 決定位置，並畫出每塊陸地的地形

    svg.addEventListener("focusin", e => { const g = e.target.closest?.(".cell"); if (g) placeRing(g.dataset.id); });
    svg.addEventListener("focusout", () => placeRing(selected));
    bindPanZoom(container);
    new ResizeObserver(() => frame(lastFrame.b, false, lastFrame.cap)).observe(container);
    render();
    return cells;
  }

  /* ================= 島嶼地形（與格子分開） =================
     地形不是用格子拼出來的。做法：
     1. 在陸地範圍內建立一張「地形場」：每一格在自己附近貢獻一點高度（高斯分布），再加上低頻雜訊，
        讓海岸有自然的海灣與岬角。
     2. 用等高線（marching squares）在不同高度切出淺水、浪花、沙灘、草地、內陸淺草地的輪廓。
     3. 輪廓再做一次平滑。格子只是放在草地裡，外圍六角格的邊不會變成海岸線。
     新增格子後重新呼叫 drawTerrain(陸地) 就會更新地形。 */
  function valueNoise(x, y, seed) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const n00 = noise(ix, iy, seed), n10 = noise(ix + 1, iy, seed), n01 = noise(ix, iy + 1, seed), n11 = noise(ix + 1, iy + 1, seed);
    return (n00 * (1 - sx) + n10 * sx) * (1 - sy) + (n01 * (1 - sx) + n11 * sx) * sy;
  }
  function terrainField(land) {
    const T = PI.MAP.terrain, step = T.step, sig = R * T.sigma, inv = 1 / (2 * sig * sig);
    const pts = land.regions.flatMap(r => r.cells).map(c => ({ x: c.x, y: c.y, w: 1 }));
    const seed0 = land.regions[0].chapter * 131;
    // 地形專用的額外高度點（不是格子）：
    // (1) 陸橋：相鄰章節區域之間補滿，主島才會是連續的一塊地
    land.regions.forEach((A, i) => land.regions.forEach((B, j) => {
      if (j <= i) return;
      let best = null;
      A.cells.forEach(a => B.cells.forEach(b => { const d = Math.hypot(a.x - b.x, a.y - b.y); if (!best || d < best.d) best = { a, b, d }; }));
      if (!best || best.d > R * 7) return;
      const n = Math.ceil(best.d / (R * 0.6));
      for (let k = 1; k < n; k++) for (const off of [-0.9, 0, 0.9]) {
        const t = k / n, ux = (best.b.x - best.a.x) / best.d, uy = (best.b.y - best.a.y) / best.d;
        pts.push({ x: best.a.x + (best.b.x - best.a.x) * t - uy * off * R, y: best.a.y + (best.b.y - best.a.y) * t + ux * off * R, w: 1 });
      }
    }));
    // (2) 岬角與小半島：沿著幾個方向把陸地往外延伸，海岸線才不會跟著六角格的外形走
    const cells0 = land.regions.flatMap(r => r.cells), cxm = cells0.reduce((s, c) => s + c.x, 0) / cells0.length, cym = cells0.reduce((s, c) => s + c.y, 0) / cells0.length;
    const lobes = 4 + land.regions.length + Math.floor(noise(seed0, 1, 1) * 3);
    for (let i = 0; i < lobes; i++) {
      const a = (i / lobes + noise(seed0, i, 2) * 0.6 / lobes) * Math.PI * 2;
      const ux = Math.cos(a), uy = Math.sin(a);
      // 從這個方向上最外側的格子往外長，確保半島和陸地連在一起
      const along = cells0.filter(c => Math.abs(-(c.x - cxm) * uy + (c.y - cym) * ux) < R * 1.6);
      if (!along.length) continue;
      const tip = along.reduce((m, c) => ((c.x - cxm) * ux + (c.y - cym) * uy > (m.x - cxm) * ux + (m.y - cym) * uy ? c : m));
      const ext = R * (0.3 + noise(seed0, i, 3) * 1.4);
      for (let d = 0; d <= ext + R; d += R * 0.5)
        pts.push({ x: tip.x + ux * d, y: tip.y + uy * d, w: 0.8 + noise(seed0, i, 4) * 0.2 });
    }
    const margin = R * 6;
    const x0 = Math.min(...pts.map(c => c.x)) - margin, y0 = Math.min(...pts.map(c => c.y)) - margin;
    const x1 = Math.max(...pts.map(c => c.x)) + margin, y1 = Math.max(...pts.map(c => c.y)) + margin;
    const nx = Math.ceil((x1 - x0) / step) + 1, ny = Math.ceil((y1 - y0) / step) + 1;
    const B = sig * 3, buckets = new Map();
    pts.forEach(c => { const k = `${Math.floor(c.x / B)},${Math.floor(c.y / B)}`; if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(c); });
    const F = new Float32Array(nx * ny), seed = land.regions[0].chapter * 101 + 7;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + i * step, y = y0 + j * step, bx = Math.floor(x / B), by = Math.floor(y / B);
      let sum = 0;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const list = buckets.get(`${bx + a},${by + b}`);
        if (list) for (const c of list) { const dx = c.x - x, dy = c.y - y; sum += c.w * Math.exp(-(dx * dx + dy * dy) * inv); }
      }
      const n = 0.65 * valueNoise(x / 420, y / 420, seed) + 0.35 * valueNoise(x / 190, y / 190, seed + 1);
      F[j * nx + i] = sum + T.noise * (n - 0.42) * Math.min(1, sum * 1.6);   // 雜訊只影響陸地附近，不會在遠海冒出小島
    }
    // 邊框強制為 0，等高線一定是封閉的
    for (let i = 0; i < nx; i++) { F[i] = 0; F[(ny - 1) * nx + i] = 0; }
    for (let j = 0; j < ny; j++) { F[j * nx] = 0; F[j * nx + nx - 1] = 0; }
    return { F, nx, ny, x0, y0, step, x1, y1 };
  }
  // marching squares：切出高度 t 的所有封閉輪廓（世界座標）
  function contours(field, t) {
    const { F, nx, ny, x0, y0, step } = field;
    const adj = new Map(), P = new Map();
    const v = (i, j) => F[j * nx + i];
    const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
      const idx = (a > t) * 8 + (b > t) * 4 + (c > t) * 2 + (d > t);
      if (idx === 0 || idx === 15) continue;
      const E = {
        T: () => { const k = `h${i},${j}`; P.has(k) || P.set(k, [i + (t - a) / (b - a), j]); return k; },
        R: () => { const k = `v${i + 1},${j}`; P.has(k) || P.set(k, [i + 1, j + (t - b) / (c - b)]); return k; },
        B: () => { const k = `h${i},${j + 1}`; P.has(k) || P.set(k, [i + (t - d) / (c - d), j + 1]); return k; },
        L: () => { const k = `v${i},${j}`; P.has(k) || P.set(k, [i, j + (t - a) / (d - a)]); return k; }
      };
      const segs = { 1: ["LB"], 2: ["BR"], 3: ["LR"], 4: ["TR"], 5: ["TR", "LB"], 6: ["TB"], 7: ["TL"], 8: ["TL"], 9: ["TB"], 10: ["TL", "RB"], 11: ["TR"], 12: ["LR"], 13: ["RB"], 14: ["LB"] }[idx];
      segs.forEach(sg => link(E[sg[0]](), E[sg[1]]()));
    }
    const loops = [], seen = new Set();
    adj.forEach((_, start) => {
      if (seen.has(start)) return;
      const loop = []; let prev = null, cur = start;
      while (cur && !seen.has(cur)) {
        seen.add(cur); loop.push(P.get(cur));
        const nb = adj.get(cur).filter(k => k !== prev && !seen.has(k));
        prev = cur; cur = nb[0];
      }
      if (loop.length > 4) loops.push(loop.map(([gx, gy]) => [x0 + gx * step, y0 + gy * step]));
    });
    return loops;
  }
  function smoothPath(loops) {   // Chaikin 平滑一次後轉成 SVG 路徑
    return loops.map(L => {
      const S = [];
      for (let i = 0; i < L.length; i++) {
        const p = L[i], q = L[(i + 1) % L.length];
        S.push([p[0] * .75 + q[0] * .25, p[1] * .75 + q[1] * .25], [p[0] * .25 + q[0] * .75, p[1] * .25 + q[1] * .75]);
      }
      return "M" + S.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
    }).join("");
  }

  function drawTerrain(land) {
    const g = land.g; g.textContent = "";
    const T = PI.MAP.terrain, C = PI.MAP.coast;
    const field = terrainField(land);
    land.bounds = { minX: field.x0, minY: field.y0, maxX: field.x1, maxY: field.y1 };
    // 去掉被陸地包住的「洞」（內陸小湖），只保留外圍海岸線，主島才是完整的一塊地
    const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
    const loops = {}; ["shallow", "foam", "sand", "grass", "inner"].forEach(k => {
      const all = contours(field, T[k]);
      loops[k] = k === "inner" ? all : all.filter(L => !all.some(M => M !== L && M.length > L.length && inside(L[0], M)));
    });
    const shape = (k, fill, op, dy = 0, cls = "") => el("path", { d: smoothPath(loops[k]), fill, opacity: op, "fill-rule": "evenodd",
      transform: dy ? `translate(0,${dy})` : "", class: `t-${cls || k}` });
    const seed = land.regions[0].chapter;

    // 海岸外的礁石、迷你小島：沿著淺水邊緣挑幾個點
    const rocks = PI.ART.decor.filter(d => d.kind === "rock"), tiny = PI.ART.decor.filter(d => d.kind === "island");
    const outer = loops.shallow.reduce((a, b) => (b.length > a.length ? b : a), []);
    const decoImgs = [];
    const nDeco = 3 + Math.floor(noise(seed, 5, 1) * 3);
    for (let i = 0; i < nDeco && outer.length; i++) {
      const p = outer[Math.floor(noise(seed, i, 17) * outer.length)];
      const big = i === 0 && land.regions.length > 1;
      const d = big ? tiny[Math.floor(noise(seed, i, 2) * tiny.length)] : rocks[Math.floor(noise(seed, i, 3) * rocks.length)];
      const sc = big ? 0.75 : 1, w = d.w * sc, h = d.h * sc;
      const dx = p[0] - land.center.x, dy = p[1] - land.center.y, len = Math.hypot(dx, dy) || 1;
      const push = big ? w * 0.6 : 10;
      const x = p[0] + dx / len * push, y = p[1] + dy / len * push;
      decoImgs.push(el("image", { href: d.src, x: (x - w / 2).toFixed(1), y: (y - h / 2).toFixed(1), width: w.toFixed(1), height: h.toFixed(1), class: "decor" }));
    }

    g.append(shape("sand", C.shadow, .2, 24, "shadow"), shape("shallow", C.shallow, .55), ...decoImgs,
      shape("foam", C.foam, .85), shape("sand", C.sandShade, 1, 7, "sand-shade"), shape("sand", C.sand, 1),
      shape("grass", C.cliff, 1, 9, "cliff"), shape("grass", C.grass, 1), shape("inner", C.grassLight, .45));

    // 主島各章節區域：很淡的草地色差，加上區域之間的小路
    if (land.regions.length > 1) {
      const tints = el("g", { class: "t-regions", opacity: .32 });
      land.regions.forEach((isl, i) => {
        const tg = el("g", { fill: PI.MAP.regionTints[i % PI.MAP.regionTints.length] });
        isl.cells.forEach(c => tg.appendChild(el("circle", { cx: c.x.toFixed(1), cy: c.y.toFixed(1), r: (R * 1.55).toFixed(1) })));
        tints.appendChild(tg);
      });
      g.appendChild(tints);
      g.appendChild(regionPaths(land));
    }
    // 草地邊緣的小花與草叢：沿著草地輪廓，往內一點
    const deco = el("g", { class: "t-deco" });
    loops.grass.forEach(L => L.forEach((p, i) => {
      if (i % 4) return;
      const pick = noise(Math.round(p[0]), Math.round(p[1]), seed + 23);
      if (pick > 0.3) return;
      const dx = land.center.x - p[0], dy = land.center.y - p[1], len = Math.hypot(dx, dy) || 1;
      const x = p[0] + dx / len * 18, y = p[1] + dy / len * 18;
      deco.appendChild(pick < 0.11 ? flower(x, y, pick) : tuft(x, y));
    }));
    g.appendChild(deco);
  }
  // 章節區域之間的小路：連接相鄰區域（最小生成樹），只畫在區域之間的草地上
  function regionPaths(land) {
    const g = el("g", { class: "t-paths", fill: "none", stroke: PI.MAP.coast.path, "stroke-width": 16, "stroke-linecap": "round", opacity: .9 });
    const R0 = land.regions, ctr = r => [r.origin.x + r.coast.cx, r.origin.y + r.coast.cy];
    const inTree = new Set([0]);
    while (inTree.size < R0.length) {
      let best = null;
      inTree.forEach(i => R0.forEach((r, j) => {
        if (inTree.has(j)) return;
        const [ax, ay] = ctr(R0[i]), [bx, by] = ctr(r), d = Math.hypot(ax - bx, ay - by);
        if (!best || d < best.d) best = { i, j, d };
      }));
      inTree.add(best.j);
      const A = R0[best.i], B = R0[best.j], [bx, by] = ctr(B), [ax, ay] = ctr(A);
      const pa = A.cells.reduce((m, c) => (Math.hypot(c.x - bx, c.y - by) < Math.hypot(m.x - bx, m.y - by) ? c : m));
      const pb = B.cells.reduce((m, c) => (Math.hypot(c.x - ax, c.y - ay) < Math.hypot(m.x - ax, m.y - ay) ? c : m));
      const ux = pb.x - pa.x, uy = pb.y - pa.y, L = Math.hypot(ux, uy) || 1;
      const s = [pa.x + ux / L * R * 0.9, pa.y + uy / L * R * 0.9], e = [pb.x - ux / L * R * 0.9, pb.y - uy / L * R * 0.9];
      const bend = (noise(best.i, best.j, 41) - 0.5) * R * 0.8;
      const m = [(s[0] + e[0]) / 2 - uy / L * bend, (s[1] + e[1]) / 2 + ux / L * bend];
      g.appendChild(el("path", { d: `M${s[0].toFixed(1)},${s[1].toFixed(1)} Q${m[0].toFixed(1)},${m[1].toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}` }));
    }
    return g;
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
    const s = Math.min(Math.max(0.9 / view.k, 1), 3).toFixed(3);
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
    const vis = b => b.maxX + m > v.x0 && b.minX - m < v.x1 && b.maxY + m > v.y0 && b.minY - m < v.y1;
    islands.forEach(isl => {
      const on = vis(isl.bounds);
      if (on !== isl.on) { isl.on = on; Object.values(isl.g).forEach(g => { g.style.display = on ? "" : "none"; }); }
    });
    lands.forEach(land => {
      const on = vis(land.bounds);
      if (on !== land.on) { land.on = on; land.g.style.display = on ? "" : "none"; }
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
          const g = hit?.closest(".cell"), isl = hit?.closest("[data-island]"), land = hit?.closest("[data-land]");
          if (g) select(g.dataset.id);
          else if (isl) selectIsland(+isl.dataset.island);
          else if (land) {   // 點到草地或沙灘：找這塊陸地上最近的章節區域
            const [sx, sy] = local(e), wx = (sx - view.x) / view.k, wy = (sy - view.y) / view.k;
            const L = lands.find(l => l.id === land.dataset.land);
            const near = L.regions.reduce((m, r) => {
              const d = Math.min(...r.cells.map(c => Math.hypot(c.x - wx, c.y - wy)));
              return !m || d < m.d ? { r, d } : m;
            }, null);
            selectIsland(near.r.chapter);
          }
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

  let layoutQueued = false;
  const dirtyLands = new Set();
  function queueTerrain(land) {
    if (!dirtyLands.size) requestAnimationFrame(() => { dirtyLands.forEach(drawTerrain); dirtyLands.clear(); buildClearGrid(); });
    dirtyLands.add(land);
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
    computeCoast(isl); drawLabel(isl);
    if (isl.coast.radius > isl.layoutRad) {   // 超過預留大小：重新安排（會重畫地形），同一個畫面內只做一次
      isl.growth.needsLayout = true;
      if (!layoutQueued) { layoutQueued = true; requestAnimationFrame(() => { layoutQueued = false; layout(); apply(); render(); }); }
    }
    else {
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      queueTerrain(landOf.get(isl.chapter));   // 只重畫這塊陸地的地形與海岸線（同一個畫面內合併成一次）
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
