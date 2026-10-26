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
    // 主島（多個章節共用一塊陸地）：所有章節用同一張格子座標，像拼圖一樣互相貼合、拼成一整座島
    const land = landOf.get(ch.id);
    isl.shared = land && land.def.chapters.length > 1 ? land.occ : null;
    islands.push(isl); islandOf.set(ch.id, isl);
    return isl;
  }

  // 下一格要放哪裡：只從已有格子旁邊的空位挑
  function nextSpot(isl, group) {
    const shared = isl.shared;
    const taken = key => isl.occ.has(key) || (shared && shared.has(key));
    if (!isl.cells.length) return shared && shared.size ? seedSpot(isl) : [0, 0];
    // 同一組已有的格子：算出中心，新格子越靠近中心越好，同組才會聚成一團，不會拉成長條
    const mates = group ? isl.cells.filter(c => c.group === group) : [];
    const gq = mates.length ? mates.reduce((s, c) => s + c.q, 0) / mates.length : 0;
    const gr = mates.length ? mates.reduce((s, c) => s + c.r, 0) / mates.length : 0;
    // 主島：這一章自己的中心（讓每一章是一塊完整的拼圖，不會被拉散）
    const cq = isl.cells.reduce((s, c) => s + c.q, 0) / isl.cells.length, cr = isl.cells.reduce((s, c) => s + c.r, 0) / isl.cells.length;
    const seen = new Set(); let best = null, bestScore = -Infinity;
    isl.cells.forEach(c => DIRS.forEach(([dq, dr]) => {
      const q = c.q + dq, r = c.r + dr, key = `${q},${r}`;
      if (taken(key) || seen.has(key)) return;
      seen.add(key);
      let nb = 0, same = 0, other = 0;
      DIRS.forEach(([a, b]) => {
        const k = `${q + a},${r + b}`, n = isl.occ.get(k);
        if (n) { nb++; if (group && n.group === group) same++; }
        else if (shared && shared.has(k)) other++;
      });
      const n = noise(q, r, isl.chapter * 7919);
      let score;
      if (mates.length) {        // 同組的後續格子：貼著同組、往同組中心靠（同組才會聚成一團，不會拉成長條）
        score = nb * 3 + same * 3 - hexDist(q - gq, r - gr) * 2.5 + n * 0.5 - hexDist(q, r) * 0.75;
      } else {                   // 新的一組的第一格，或沒有分組的格子
        score = nb * 3 + n * (group ? 2 : 3.4) - hexDist(q, r) * 0.75;
      }
      if (shared) score += other * 1.6 - hexDist(q - cq, r - cr) * 0.8 + hexDist(q, r) * 0.45;   // 主島：貼緊別章填滿縫隙
      if (score > bestScore) { bestScore = score; best = [q, r]; }
    }));
    // 主島上這一章被別章包住、旁邊沒有空位時：改從整座島的邊緣找離這章最近的空位
    if (!best && shared) best = frontierOf(shared).sort((A, B) => hexDist(A[0] - cq, A[1] - cr) - hexDist(B[0] - cq, B[1] - cr))[0];
    return best;
  }
  // 整塊陸地外圍的空位
  function frontierOf(shared) {
    const out = [], seen = new Set();
    shared.forEach(c => DIRS.forEach(([dq, dr]) => {
      const q = c.q + dq, r = c.r + dr, key = `${q},${r}`;
      if (shared.has(key) || seen.has(key)) return;
      seen.add(key); out.push([q, r]);
    }));
    return out;
  }
  // 主島上新的一章的第一格：貼著上一章、往島的中心靠，各章一圈一圈拼起來，整座島才會是圓的一整塊
  function seedSpot(isl) {
    const shared = isl.shared, land = landOf.get(isl.chapter);
    const prev = land.regions[land.regions.length - 1];
    let best = null, bestScore = -Infinity;
    frontierOf(shared).forEach(([q, r]) => {
      let nb = 0, nbPrev = 0;
      DIRS.forEach(([a, b]) => { const n = shared.get(`${q + a},${r + b}`); if (n) { nb++; if (prev && n.chapter === prev.chapter) nbPrev++; } });
      const score = nb * 2 + nbPrev * 2.5 - hexDist(q, r) * 1.2 + noise(q, r, isl.chapter * 131) * 1;
      if (score > bestScore) { bestScore = score; best = [q, r]; }
    });
    return best;
  }

  function placeCell(isl, item) {
    const [q, r] = nextSpot(isl, item.group);
    const [lx, ly] = toXY(q, r);
    const c = { id: item.id, chapter: isl.chapter, island: isl, q, r, lx, ly, x: lx, y: ly,
                isStart: isl.cells.length === 0, unit: item.unit || null, group: item.group || null, neighbors: [] };
    DIRS.forEach(([a, b]) => { const n = isl.occ.get(`${q + a},${r + b}`); if (n) { c.neighbors.push(n.id); n.neighbors.push(c.id); } });
    isl.cells.push(c); isl.occ.set(`${q},${r}`, c);
    if (isl.shared) isl.shared.set(`${q},${r}`, c);
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
      if (land.occ.size) {   // 主島：各章已經拼在同一張格子上，不用再排位置
        const all = [...land.occ.values()], xs = all.map(c => c.lx), ys = all.map(c => c.ly);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        land.lc = { cx, cy };
        land.regions.forEach(isl => { isl.offset = { x: 0, y: 0 }; isl.layoutRad = Infinity; });
        land.radius = Math.max(...all.map(c => Math.hypot(c.lx - cx, c.ly - cy))) + R * 1.95 + R * 1.5;
        return;
      }
      const placed = [], gap = PI.MAP.regionGap * SQ3 * R;
      land.regions.forEach((isl, i) => {
        const rad = reservedRadius(isl);
        const pos = findSpot(placed, rad, gap, i * 2.39996 + 0.6, Math.PI * 2);
        placed.push({ ...pos, rad }); isl.layoutRad = rad; isl.offset = pos;
      });
      land.radius = Math.max(...placed.map(p => Math.hypot(p.x, p.y) + p.rad)) + R * 1.5;
    });
    // 2) 陸地之間：主島在中央，其他島依設定的方向放，隔著海
    const placedLands = [], placedCells = [], gap = PI.MAP.islandGap * SQ3 * R;
    // 這塊陸地的格子相對於陸地中心的位置（和下面「套用位置」用同一個算法）
    const landCellsRel = land => land.regions.flatMap(isl => { const c0 = land.lc || isl.coast;
      return isl.cells.map(c => [isl.offset.x - c0.cx + c.lx, isl.offset.y - c0.cy + c.ly]); });
    lands.forEach(land => {
      const ang = (land.def.angle ?? 0) * Math.PI / 180;
      land.center = findSpot(placedLands, land.radius, gap + noise(land.regions[0].chapter, 3, 9) * R * 0.5, ang, Math.PI * 0.9);
      // 用圓形估的距離太保守（島不是圓的）：沿著方向往主島拉近，直到格子和別的島的格子剛好隔 islandGap 格海
      const rel = landCellsRel(land);
      if (placedLands.length && rel.length) {
        const far = { ...land.center }, need = gap + SQ3 * R;
        const ok = t => { const cx = far.x * t, cy = far.y * t;
          return rel.every(([x, y]) => placedCells.every(([px, py]) => Math.hypot(cx + x - px, cy + y - py) >= need)); };
        let lo = 0, hi = 1;
        for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
        land.center = { x: far.x * hi, y: far.y * hi };
      }
      rel.forEach(([x, y]) => placedCells.push([land.center.x + x, land.center.y + y]));
      placedLands.push({ ...land.center, rad: land.radius });
    });
    // 3) 套用位置
    islands.forEach(isl => {
      const land = landOf.get(isl.chapter);
      const c0 = land.lc || isl.coast;   // 主島用整塊陸地的中心
      isl.origin = { x: land.center.x + isl.offset.x - c0.cx, y: land.center.y + isl.offset.y - c0.cy };
      isl.growth.needsLayout = false;
      isl.cells.forEach(c => { c.x = isl.origin.x + c.lx; c.y = isl.origin.y + c.ly; });
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      const t = `translate(${isl.origin.x.toFixed(1)},${isl.origin.y.toFixed(1)})`;
      Object.values(isl.g).forEach(g => g && g.setAttribute("transform", t));
    });
    lands.forEach(drawTerrain);
    placeTrees();
    const all = [...islands.map(i => i.bounds), ...lands.map(l => l.bounds).filter(Boolean),   // 包含未解鎖格子
      ...[...trees.values()].map(t => ({ minX: t.x - R * 1.6, maxX: t.x + R * 1.6, minY: t.y - R * 1.6, maxY: t.y + R * 1.6 }))];   // 告示牌島
    Object.assign(bounds, {
      minX: Math.min(...all.map(b => b.minX)), maxX: Math.max(...all.map(b => b.maxX)),
      minY: Math.min(...all.map(b => b.minY)), maxY: Math.max(...all.map(b => b.maxY))
    });
    buildClearGrid();
    decorChunks.forEach(d => d.g.remove()); decorChunks.clear();   // 島移動過，海上裝飾重新擺
  }

  function buildWorld() {
    const defs = PI.LANDMASSES || PI.CHAPTERS.map(ch => ({ id: `ch${ch.id}`, chapters: [ch.id] }));
    const assigned = new Set(defs.flatMap(d => d.chapters));
    PI.CHAPTERS.filter(ch => !assigned.has(ch.id)).forEach(ch => defs.push({ id: `ch${ch.id}`, chapters: [ch.id] }));   // 新章節自動成為獨立島
    defs.forEach(def => { const land = { id: def.id, def, regions: [], g: null, occ: new Map() }; lands.push(land); def.chapters.forEach(id => landOf.set(id, land)); });
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
  let hl, hov, svg, world, mapEl, stage, sea, decorLayer, terrainLayer, cellLayer, labelLayer, treeLayer, onSelect = () => {}, onSelectIsland = () => {}, onOpenTree = () => {}, selected = null, focusCh = null;
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
    onOpenTree = opts.onOpenTree || onOpenTree;
    mapEl = container;
    // 舞台：海水與地圖放在同一層。拖曳、縮放時只移動這一層（交給 GPU），停下來才重畫地圖內容
    stage = document.createElement("div"); stage.className = "map-stage";
    sea = document.createElement("div"); sea.className = "map-sea";
    sea.style.backgroundImage = `url("${PI.ART.seaTile.src}")`;
    HEX_PATH = hexPath(R + 0.8, 0);   // 格子不做圓角、稍微放大一點點：格線透明時，相鄰格子之間不會露出縫或小三角
    SHINE_PATH = hexPath(R - PI.MAP.cell.locked.lineWidth / 2, PI.MAP.corner);
    RING_PATH = hexPath(R * 0.62, 6);

    svg = el("svg", { class: "map-svg", role: "img", "aria-label": "藥理學群島地圖" });
    world = el("g", { class: "map-world" });
    decorLayer = el("g", { class: "layer-decor", "aria-hidden": "true" });    // 海上裝飾
    terrainLayer = el("g", { class: "layer-terrain" });                      // 島嶼地形與海岸線
    cellLayer = el("g", { class: "layer-cells" });                           // 六角格
    treeLayer = el("g", { class: "layer-trees" });                           // 知識樹（每座島一棵）
    labelLayer = el("g", { class: "layer-labels" });                         // 章節標記
    hl = el("path", { class: "sel-ring", d: HEX_PATH, fill: "none", "stroke-width": 6, "pointer-events": "none" });   // 選取外框
    hov = el("path", { class: "hover-hex", d: SHINE_PATH, "pointer-events": "none" });   // 滑鼠所在格子的高亮（全地圖共用一個）
    hov.style.display = "none";
    world.append(decorLayer, terrainLayer, cellLayer, hov, treeLayer, labelLayer, hl);
    svg.appendChild(world);
    stage.append(sea, svg);
    container.appendChild(stage);

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
    svg.addEventListener("pointerover", e => { const g = e.target.closest?.(".cell"); placeHover(g && g.dataset.status !== "locked" ? g.dataset.id : null); });
    svg.addEventListener("pointerleave", () => placeHover(null));
    svg.addEventListener("focusout", () => placeRing(selected));
    bindPanZoom(container);
    // 待機畫面：放大到第一章的起點格（看得清楚格子和藥名），不是一開始就縮到整張地圖；按「顯示整張地圖」才看全部
    const s0 = cells.find(c => c.isStart && c.chapter === PI.CHAPTERS[0].id) || cells[0];
    if (s0) lastFrame = { b: { minX: s0.x - R * 2, maxX: s0.x + R * 2, minY: s0.y - R * 2, maxY: s0.y + R * 2 }, cap: PI.MAP.startZoom || 1.2 };
    new ResizeObserver(() => frame(lastFrame.b, false, lastFrame.cap)).observe(container);
    render();
    return cells;
  }

  /* ================= 島嶼地形（六角形組成） =================
     陸地只長在已佔領的格子底下，每一格就是一塊六角形的地；見 drawTerrain。 */
  function drawTerrain(land) {
    /* 島由六角形組成：每一個已佔領的格子就是一塊六角形的地。
       海岸的淺水、浪花、沙灘、土坡也都是同一格放大一點的六角形，疊在一起就是沿著六角格邊緣的海岸線。 */
    const g = land.g; g.textContent = "";
    const C = PI.MAP.coast, P = land.def.palette || { ground: "#B4D69A", light: "#C5E2AA", cliff: "#8CB57A" };
    const all = land.regions.flatMap(r => r.cells);
    const occ = all.filter(c => PI.state.statusOf(c) === "occupied");
    if (!occ.length) { land.bounds = null; land.groundEls = null; return; }
    const xs = occ.map(c => c.x), ys = occ.map(c => c.y), pad = R * 1.8;
    land.bounds = { minX: Math.min(...xs) - pad, minY: Math.min(...ys) - pad, maxX: Math.max(...xs) + pad, maxY: Math.max(...ys) + pad + 24 };
    const V = [...Array(6)].map((_, i) => { const a = Math.PI / 180 * (60 * i - 90); return [Math.cos(a), Math.sin(a)]; });
    const hexes = r => occ.map(c => V.map(([vx, vy], i) => (i ? "L" : "M") + (c.x + r * vx).toFixed(1) + "," + (c.y + r * vy).toFixed(1)).join("") + "Z").join("");
    const shape = (r, fill, op, dy = 0, cls) => el("path", { d: hexes(r), fill, "fill-opacity": op, transform: dy ? `translate(0,${dy})` : "", class: `t-${cls}` });

    // 海岸外的礁石：挑幾個「旁邊還是海」的格子，在海那一側放一顆
    const seed = land.regions[0].chapter, rocks = PI.ART.decor.filter(d => d.kind === "rock"), decoImgs = [];
    const taken = new Set(occ.map(c => `${Math.round(c.x)},${Math.round(c.y)}`));
    const edge = [];
    occ.forEach(c => V.forEach(([vx, vy], k) => {
      const a = Math.PI / 180 * (60 * k - 60), nx = c.x + Math.cos(a) * SQ3 * R, ny = c.y + Math.sin(a) * SQ3 * R;
      if (!occ.some(o => Math.hypot(o.x - nx, o.y - ny) < R)) edge.push({ c, a });
    }));
    const nRock = Math.min(edge.length, 2 + Math.floor(noise(seed, 5, 1) * 3));
    for (let i = 0; i < nRock; i++) {
      const e = edge[Math.floor(noise(seed, i, 17) * edge.length)], d = rocks[Math.floor(noise(seed, i, 3) * rocks.length)];
      const x = e.c.x + Math.cos(e.a) * R * 1.75, y = e.c.y + Math.sin(e.a) * R * 1.75;
      decoImgs.push(el("image", { href: d.src, x: (x - d.w / 2).toFixed(1), y: (y - d.h / 2).toFixed(1), width: d.w, height: d.h, class: "decor" }));
    }

    g.append(shape(R * 1.16, C.shadow, .2, 22, "shadow"), shape(R * 1.5, C.shallow, .55, 0, "shallow"), ...decoImgs,
      shape(R * 1.28, C.foam, .85, 0, "foam"), shape(R * 1.16, C.sandShade, 1, 7, "sand-shade"), shape(R * 1.16, C.sand, 1, 0, "sand"),
      shape(R + 1, P.cliff, 1, 9, "cliff"), shape(R + 1, P.ground, 1, 0, "grass"));
    land.groundEls = { cliff: g.querySelector(".t-cliff"), grass: g.querySelector(".t-grass"), inner: null };
    land.frac = null; tintLand(land);
  }
  const mixHex = (a, b, t) => "#" + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - t) + parseInt(b.substr(i + 1, 2), 16) * t).toString(16).padStart(2, "0")).join("");
  function tintLand(land) {
    if (!land.groundEls || !land.groundEls.grass) return;
    const all = land.regions.flatMap(r => r.cells), occ = all.filter(c => PI.state.statusOf(c) === "occupied").length;
    const frac = 1;   // 陸地只長在已佔領的格子底下，所以直接用島的顏色
    if (land.frac !== null && Math.abs(frac - land.frac) < 1e-6) return;
    land.frac = frac;
    const P = land.def.palette || { ground: "#B4D69A", light: "#C5E2AA", cliff: "#8CB57A" }, W = PI.MAP.wild;
    const e = land.groundEls;
    e.cliff.setAttribute("fill", mixHex(W.cliff, P.cliff, frac));
    e.grass.setAttribute("fill", mixHex(W.ground, P.ground, frac));
    if (e.inner) e.inner.setAttribute("fill", mixHex(W.light, P.light, frac));
  }



  // 格子裡的名字：超過格子寬度就截短（中文字比較寬，依實際寬度算）
  function fitName(name, maxW = 86) {
    measure.font = `600 13px ${getComputedStyle(document.body).fontFamily}`;
    if (measure.measureText(name).width <= maxW) return name;
    let s = name;
    while (s.length > 1 && measure.measureText(s + "…").width > maxW) s = s.slice(0, -1);
    return s + "…";
  }
  function drawCell(c) {
    const g = el("g", { class: "cell", transform: `translate(${c.lx.toFixed(1)},${c.ly.toFixed(1)})`, "data-id": c.id, role: "button" });
    // 每格只有一個六角形；可挑戰的虛線圈與已佔領的旗子，等狀態需要時才加（見 render）
    g.appendChild(el("path", { class: "cell-hex", d: HEX_PATH }));   // 填色與外框由 render 依狀態設定
    if (!c.unit) g.classList.add("is-slot");
    c.st = null;
    if (c.unit) {
      const t = el("text", { class: "cell-name", y: 34 });
      t.textContent = fitName(c.unit.short || c.unit.name);
      g.appendChild(t);
    }
    c.el = g;
    c.island.g.cells.appendChild(g);
  }

  // 章節標記：島的上方一塊牌子（章節徽章＋名稱），縮小地圖時牌子維持可讀的大小
  function drawLabel(isl) {
    const ch = chapterOf(isl.chapter), cat = catOf(ch.cat);
    const g = isl.g.label; g.textContent = "";
    let x = isl.coast.cx, y = isl.coast.minY + R * 0.35;
    if (isl.shared && isl.cells.length) {   // 主島：牌子放在這一章的中心附近（各章的牌子才不會擠在一起）
      x = isl.cells.reduce((s, c) => s + c.lx, 0) / isl.cells.length;
      y = isl.cells.reduce((s, c) => s + c.ly, 0) / isl.cells.length - R * 0.9;
    }
    const lab = el("g", { class: "island-label" + (isl.shared ? " on-shared" : ""), "data-island": isl.chapter, transform: `translate(${x.toFixed(1)},${y.toFixed(1)})`, tabindex: 0, role: "button", "aria-label": `第 ${ch.id} 章 ${ch.name}` });
    const inner = el("g", { class: "label-inner" });
    measure.font = `700 17px ${getComputedStyle(document.body).fontFamily}`;
    const w = Math.ceil(measure.measureText(ch.name).width) + 62;
    inner.appendChild(el("rect", { class: "label-shadow", x: -w / 2, y: -19, width: w, height: 42, rx: 21 }));   // 簡單的底影，不用濾鏡
    inner.appendChild(el("rect", { class: "label-bg", x: -w / 2, y: -21, width: w, height: 42, rx: 21 }));
    inner.appendChild(el("circle", { cx: -w / 2 + 21, cy: 0, r: 14, fill: cat.tint, stroke: cat.color, "stroke-width": 2.5 }));
    const num = el("text", { class: "label-num", x: -w / 2 + 21, y: 1 }); num.textContent = ch.id;
    const name = el("text", { class: "label-name", x: -w / 2 + 43, y: 1 }); name.textContent = ch.name;
    inner.append(num, name);
    lab.appendChild(inner);
    g.appendChild(lab);
    isl.labelInner = inner;
  }

  /* ---------- 知識告示牌：每一章一個，自己是一座一格大的小島（不放格子、不出格子的題） ----------
     哪些章節有告示牌、內容是什麼，都在 js/knowledge.js（或各科目的 js/subjects/*.js）。
     位置：這一章的格子外面，離起點格最近、和所有格子與其他告示牌島都隔至少一格海的地方。
     點告示牌島打開知識面板。 */
  const trees = new Map();   // 知識樹 id → { chapter, x, y, g }
  const ringOffsets = k => { const out = []; for (let q = -k; q <= k; q++) for (let r = -k; r <= k; r++) if (hexDist(q, r) === k) out.push([q, r]); return out; };
  function placeTrees() {
    const D = SQ3 * R, used = [];
    Object.entries(PI.KNOWLEDGE || {}).forEach(([key, K]) => {
      const isl = islandOf.get(K.chapter);
      if (!isl || !isl.cells.length) return;
      const start = isl.cells.find(c => c.isStart) || isl.cells[0];
      const others = cells.filter(c => Math.abs(c.x - start.x) < D * 14 && Math.abs(c.y - start.y) < D * 14);
      let pos = null;
      for (let k = 2; k <= 6 && !pos; k++) {
        const offs = ringOffsets(k); let best = Infinity;
        isl.cells.forEach(c => offs.forEach(([dq, dr]) => {
          const [ox, oy] = toXY(dq, dr), x = c.x + ox, y = c.y + oy;
          if (others.some(o => Math.hypot(o.x - x, o.y - y) < 2 * D - 1)) return;   // 和格子之間至少隔一格海
          if (used.some(u => Math.hypot(u.x - x, u.y - y) < 2 * D - 1)) return;
          // 越靠近起點格越好；獨立島的上方是章節牌子，避開
          const s = Math.hypot(x - start.x, y - start.y) + (!isl.shared && y < isl.bounds.minY + R * 2.2 ? 3 * D : 0) + noise(Math.round(x), Math.round(y), 7) * 0.2 * D;
          if (s < best) { best = s; pos = { x, y }; }
        }));
      }
      if (!pos) return;
      used.push(pos);
      let t = trees.get(key);
      if (!t) { t = { g: drawTree(key, K) }; treeLayer.appendChild(t.g); trees.set(key, t); }
      Object.assign(t, { chapter: K.chapter, x: pos.x, y: pos.y });
      t.g.setAttribute("transform", `translate(${pos.x.toFixed(1)},${pos.y.toFixed(1)})`);
    });
  }
  // 告示牌島的地：和其他島一樣的海岸層次（淺水、浪花、沙灘、土坡、草地），只有一格
  function isletLand(P) {
    const C = PI.MAP.coast;
    const hex = r => [...Array(6)].map((_, i) => { const a = Math.PI / 180 * (60 * i - 90); return (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + "," + (r * Math.sin(a)).toFixed(1); }).join("") + "Z";
    const sh = (r, fill, op, dy = 0) => el("path", { d: hex(r), fill, "fill-opacity": op, transform: dy ? `translate(0,${dy})` : "" });
    return [sh(R * 1.16, C.shadow, .2, 22), sh(R * 1.5, C.shallow, .55), sh(R * 1.28, C.foam, .85), sh(R * 1.16, C.sandShade, 1, 7),
            sh(R * 1.16, C.sand, 1), sh(R + 1, P.cliff, 1, 9), sh(R + 1, P.ground, 1)];
  }
  /* 知識告示牌（原本是樹）：木牌＋中央六角徽章。不同知識分類共用同一個木牌，只換徽章（K.badge，預設分子圖示） */
  const BADGE_ICONS = {
    molecule: () => [   // 分子：苯環＋一個取代基
      el("path", { d: hexPath(5.6, 0), fill: "none", stroke: "#315B43", "stroke-width": 1.6, "stroke-linejoin": "round" }),
      el("path", { d: "M4.85,-2.8 L7.4,-4.3", stroke: "#315B43", "stroke-width": 1.6, "stroke-linecap": "round" }),
      el("circle", { cx: 7.9, cy: -4.6, r: 1.8, fill: "#315B43" }),
      el("circle", { r: 2.2, fill: "none", stroke: "#315B43", "stroke-width": 1.1 })]
  };
  function drawTree(key, K) {
    const title = K.title || chapterOf(K.chapter).name;
    const cat = catOf(chapterOf(K.chapter).cat) || {};
    const g = el("g", { class: "k-tree k-sign", "data-tree": key, tabindex: 0, role: "button", "aria-label": `${title}知識樹：打開背景知識` });
    const P = (landOf.get(K.chapter) || { def: {} }).def.palette || { ground: "#B4D69A", light: "#C5E2AA", cliff: "#8CB57A" };
    const land = el("g", { class: "k-islet" }); land.append(...isletLand(P));
    const sign = el("g", { class: "k-sign-art", transform: "translate(0,6) scale(1.3)" });   // 島上只有告示牌
    const tip = el("title"); tip.textContent = `${title}・知識樹（點一下看背景知識）`;
    const badge = el("g", { class: "k-badge", transform: "translate(0,-19)" });
    badge.append(
      el("path", { d: hexPath(13, 3), fill: "#FFF9EE", stroke: cat.color || "#7FB069", "stroke-width": 2.6 }),   // 六角徽章（框色跟著分類）
      el("path", { d: hexPath(9.6, 2), fill: cat.tint || "#E4F1DA", "fill-opacity": .9 }),
      ...(BADGE_ICONS[K.badge] || BADGE_ICONS.molecule)());
    g.append(tip, land, sign);
    sign.append(
      el("circle", { class: "k-hit", cx: 0, cy: -10, r: 30 }),                                // 滑鼠移上去會出現外圈
      el("ellipse", { cx: 0, cy: 19, rx: 18, ry: 4, fill: "#24372C", "fill-opacity": .1 }),   // 淡淡的影子
      el("rect", { x: -15, y: -6, width: 5, height: 25, rx: 2.5, fill: "#A27A55" }),          // 兩根木樁
      el("rect", { x: 10, y: -6, width: 5, height: 25, rx: 2.5, fill: "#A27A55" }),
      el("rect", { x: -25, y: -38, width: 50, height: 36, rx: 9, fill: "#D6AC7C", stroke: "#9C7350", "stroke-width": 2 }),   // 木牌
      el("path", { d: "M-19,-31 H-9 M12,-9 H19 M-20,-8 H-14", stroke: "#C29466", "stroke-width": 1.6, "stroke-linecap": "round" }),   // 木紋（只畫幾筆）
      badge,
      el("path", { d: "M-19,19 q1,-6 3,-8 M-16,19 q0,-4 -1,-7 M16,19 q-1,-5 -3,-7", stroke: "#7FAE6E", "stroke-width": 2, "stroke-linecap": "round", fill: "none" }));   // 一小撮草
    return g;
  }

  function placeRing(id) {
    const c = id && cellById.get(id);
    if (!c) { hl.style.display = "none"; return; }
    hl.setAttribute("transform", `translate(${c.x.toFixed(1)},${c.y.toFixed(1)})`);
    hl.style.display = "";
  }

  function placeHover(id) {
    const c = id && cellById.get(id);
    if (!c) { hov.style.display = "none"; return; }
    hov.setAttribute("transform", `translate(${c.x.toFixed(1)},${c.y.toFixed(1)})`);
    hov.style.display = "";
  }

  const STATUS_TEXT = { occupied: "已佔領", available: "可挑戰", locked: "未解鎖" };
  const tintQueue = new Set();
  function render() {
    cells.forEach(c => {
      const st = PI.state.statusOf(c);
      const tab = st === "locked" && focusCh !== c.chapter ? "-1" : "0";
      if (c.tab !== tab) { c.tab = tab; c.el.setAttribute("tabindex", tab); }
      if (c.st === st) return;   // 狀態沒變就不碰 DOM
      const claimed = c.st && c.st !== "occupied" && st === "occupied";   // 這一次剛佔領（不是載入時）
      if (c.st && (c.st === "occupied") !== (st === "occupied")) queueTerrain(landOf.get(c.chapter));   // 佔領（或清除進度）時重畫這座島的陸地
      c.st = st;
      const g = c.el, hex = g.firstChild, M = PI.MAP.cell;
      g.dataset.status = st;
      const S = M[st];   // 未解鎖、可挑戰：灰米色的未探索地；已佔領：島的顏色（綠色草地等）
      hex.setAttribute("fill", st === "occupied" ? ((landOf.get(c.chapter).def.palette || {}).ground || "#B4D69A") : S.fill);
      hex.setAttribute("fill-opacity", S.opacity);
      hex.setAttribute("stroke", S.line); hex.setAttribute("stroke-opacity", S.lineOpacity); hex.setAttribute("stroke-width", S.lineWidth);
      if (claimed) {   // 佔領動畫：一圈淡淡的光，播完就移除
        const glow = el("path", { class: "claim-glow", d: HEX_PATH, "pointer-events": "none" });
        g.appendChild(glow); setTimeout(() => glow.remove(), 1200);
      }
      const old = g.querySelector(".cell-ring, .cell-flag"); if (old) old.remove();
      if (st === "available") g.insertBefore(el("path", { class: "cell-ring", d: RING_PATH }), hex.nextSibling);
      if (st === "occupied") g.insertBefore(el("path", { class: "cell-flag", d: "M-8,14 L-8,-16 M-8,-16 L14,-9 L-8,-2", fill: "none", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round",
      }), hex.nextSibling);
      g.setAttribute("aria-label", `第 ${c.chapter} 章 ${chapterOf(c.chapter).name}，${c.unit ? c.unit.name : "預留格"}，${STATUS_TEXT[st]}`);
    });
    tintQueue.forEach(tintLand); tintQueue.clear();
    islands.forEach(isl => { const dim = focusCh !== null && isl.chapter !== focusCh; if (isl.dim !== dim) { isl.dim = dim; Object.values(isl.g).forEach(g => g.classList.toggle("is-dim", dim)); } });
    trees.forEach(t => { const dim = focusCh !== null && t.chapter !== focusCh; if (t.dim !== dim) { t.dim = dim; t.g.classList.toggle("is-dim", dim); } });   // 知識樹跟著自己的章節變淡
    placeRing(selected);
  }

  /* ---------- 拖曳與縮放 ---------- */
  /* 拖曳、縮放的每一個畫面只改舞台的 CSS transform（由 GPU 合成，不重畫 SVG）；
     停下來 140ms 後才「提交」：更新 SVG 的世界座標轉換、海水位置、章節牌大小與分區顯示。
     舞台比地圖容器大一圈（overscan），拖曳時周圍已經畫好，不會露白；拖太遠時會提前提交。 */
  const OVER = 0.35;                      // 舞台四周多畫 35% 畫面
  const committed = { x: 0, y: 0, k: 1 };
  let commitTimer = 0, nearState = null, farState = null;
  function overscan() { const { w, h } = size(); return { ox: w * OVER, oy: h * OVER, w, h }; }
  function apply() {
    const { ox, oy, w, h } = overscan();
    const s = view.k / committed.k;
    const dx = view.x + ox - s * (committed.x + ox), dy = view.y + oy - s * (committed.y + oy);
    if (Math.abs(dx) > w * 0.3 || Math.abs(dy) > h * 0.3 || s < 0.55 || s > 1.8) { commit(); return; }   // 超出預先畫好的範圍才提前提交
    stage.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
    clearTimeout(commitTimer); commitTimer = setTimeout(commit, 140);
  }
  function commit() {
    clearTimeout(commitTimer);
    Object.assign(committed, { x: view.x, y: view.y, k: view.k });
    const { ox, oy } = overscan();
    world.setAttribute("transform", `translate(${(view.x + ox).toFixed(1)},${(view.y + oy).toFixed(1)}) scale(${view.k.toFixed(4)})`);
    // 海水紋理跟著世界座標移動與縮放，所以無論拖到哪裡都不會露出空白
    const t = PI.ART.seaTile.size * view.k;
    sea.style.backgroundSize = `${t.toFixed(2)}px ${t.toFixed(2)}px`;
    sea.style.backgroundPosition = `${(view.x + ox).toFixed(1)}px ${(view.y + oy).toFixed(1)}px`;
    stage.style.transform = "";
    // 章節牌子：地圖縮小時放大回來，讓字維持可讀
    const s = Math.min(Math.max(0.9 / view.k, 1), 3).toFixed(3);
    const lift = (-21 * (s - 1)).toFixed(1);   // 放大時牌子往上長，不蓋到島
    const s2 = Math.min(s, 2.2).toFixed(3), lift2 = (-21 * (s2 - 1)).toFixed(1);   // 主島的牌子靠得近，放大上限小一點
    islands.forEach(isl => isl.labelInner && isl.labelInner.setAttribute("transform", isl.shared ? `translate(0,${lift2}) scale(${s2})` : `translate(0,${lift}) scale(${s})`));
    // 細節層級：放大才顯示藥名；縮很小時隱藏小裝飾（只在跨過門檻時才改 class）
    const near = view.k > 0.55, far = view.k < 0.3;
    if (near !== nearState) { nearState = near; svg.classList.toggle("is-near", near); }
    if (far !== farState) { farState = far; svg.classList.toggle("is-far", far); }
    cull();
  }

  /* ---------- 分區顯示：只顯示畫面附近的島嶼與裝飾 ---------- */
  function visibleRect() {   // 舞台涵蓋的世界範圍（含 overscan）
    const { ox, oy, w, h } = overscan();
    return { x0: (-ox - view.x) / view.k, y0: (-oy - view.y) / view.k, x1: (w + ox - view.x) / view.k, y1: (h + oy - view.y) / view.k };
  }
  function cull() {
    const v = visibleRect(), m = 300 / view.k;   // 牌子會放大，邊界多留一點
    const vis = b => b.maxX + m > v.x0 && b.minX - m < v.x1 && b.maxY + m > v.y0 && b.minY - m < v.y1;
    islands.forEach(isl => {
      const on = vis(isl.bounds);
      if (on !== isl.on) { isl.on = on; Object.values(isl.g).forEach(g => { g.style.display = on ? "" : "none"; }); }
    });
    lands.forEach(land => {
      const on = !!land.bounds && vis(land.bounds);
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
    [...cells, ...trees.values()].forEach(c => {   // 告示牌島旁邊也不放海上裝飾
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
  function size() { const r = mapEl.getBoundingClientRect(); return { w: r.width, h: r.height }; }
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
    if (reduce || !ms) { Object.assign(view, target); commit(); return; }
    const from = { ...view }, t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3);
      view.x = from.x + (target.x - from.x) * e; view.y = from.y + (target.y - from.y) * e; view.k = from.k + (target.k - from.k) * e;
      if (t < 1) { apply(); requestAnimationFrame(step); } else commit();
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
    const local = e => { const r = mapEl.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
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
          const g = hit?.closest(".cell"), isl = hit?.closest("[data-island]"), land = hit?.closest("[data-land]"), tree = hit?.closest(".k-tree");
          if (tree) onOpenTree(tree.dataset.tree);
          else if (g) select(g.dataset.id);
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
      const g = e.target.closest?.(".cell"), isl = e.target.closest?.(".island-label"), tree = e.target.closest?.(".k-tree");
      if (tree) { e.preventDefault(); onOpenTree(tree.dataset.tree); }
      else if (g) { e.preventDefault(); select(g.dataset.id); }
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
    const wasSlot = !!c;
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
    if (isl.coast.radius > isl.layoutRad || (isl.shared && !wasSlot)) {   // 超過預留大小（或主島長出新格）：重新安排，同一個畫面內只做一次
      isl.growth.needsLayout = true;
      if (!layoutQueued) { layoutQueued = true; requestAnimationFrame(() => { layoutQueued = false; layout(); commit(); render(); }); }
    }
    else {
      isl.bounds = { minX: isl.origin.x + isl.coast.minX - R, maxX: isl.origin.x + isl.coast.maxX + R,
                     minY: isl.origin.y + isl.coast.minY - R * 1.6, maxY: isl.origin.y + isl.coast.maxY + R };
      queueTerrain(landOf.get(isl.chapter));   // 只重畫這塊陸地的地形與海岸線（同一個畫面內合併成一次）
      buildClearGrid();
    }
    commit(); render();
    return c;
  }

  return {
    init, render, select, focusChapter, addUnit,
    fit: () => fit(true), zoomIn: () => zoomBy(1.25), zoomOut: () => zoomBy(0.8),
    get islands() { return islands; },
    getView: () => ({ x: view.x, y: view.y, k: view.k }),
    setView: (v, animate) => { if (v) animateTo({ x: v.x, y: v.y, k: v.k }, animate ? 380 : 0); }
  };
})();
