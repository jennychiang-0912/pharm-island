/* PHARMA ISLAND：分類、章節與地圖設定
   只放資料，不放程式邏輯。題庫之後另外放在 js/questions.js。 */
window.PI = window.PI || {};

/* 四大分類與識別色：color 是章節徽章的外圈，tint 是徽章底色 */
PI.CATEGORIES = [
  { id: "micro", name: "抗微生物藥物",   color: "#6E9C76", tint: "#DDEBD3" },
  { id: "endo",  name: "內分泌系統用藥", color: "#D4B04F", tint: "#F7EBC2" },
  { id: "resp",  name: "呼吸系統用藥",   color: "#7FA7C9", tint: "#DCE8F2" },
  { id: "gi",    name: "腸胃道用藥",     color: "#DE9384", tint: "#F7DDD6" }
];

/* 11 個章節：名稱照課程，不要更改。
   每一章是一座島。島的大小由「學習單元」決定（見 js/units.js）：
   - estimate：預估的單元數。正式資料還沒進來前，島上先放這麼多「預留格」，不會虛構藥名。
   - unitType：這一章主要的單元類型（drug 藥物、preparation 製劑、category 分類、topic 主題）。
   - note：顯示在島嶼資訊卡上的說明。 */
PI.CHAPTERS = [
  { id: 1,  name: "抗菌藥物療法導論",       cat: "micro", estimate: 7,  unitType: "topic",       note: "新手教學島：概論與藥物分類入口，沒有新增藥物。" },
  { id: 2,  name: "磺胺藥與泌尿道感染用藥", cat: "micro", estimate: 17, unitType: "drug" },
  { id: 3,  name: "細胞壁合成抑制劑",       cat: "micro", estimate: 50, unitType: "drug" },
  { id: 4,  name: "蛋白質合成抑制劑",       cat: "micro", estimate: 25, unitType: "drug" },
  { id: 5,  name: "抗分枝桿菌藥物",         cat: "micro", estimate: 17, unitType: "drug" },
  { id: 6,  name: "抗黴菌藥",               cat: "micro", estimate: 18, unitType: "drug" },
  { id: 7,  name: "抗病毒藥物",             cat: "micro", estimate: 55, unitType: "drug" },
  { id: 8,  name: "消毒殺菌劑",             cat: "micro", estimate: 20, unitType: "preparation", note: "單元是製劑與分類（約 20 種製劑，分成 9 類），不一定是藥品名稱。" },
  { id: 9,  name: "胰島素與口服降血糖藥",   cat: "endo",  estimate: 45, unitType: "drug" },
  { id: 10, name: "呼吸系統用藥",           cat: "resp",  estimate: 50, unitType: "drug" },
  { id: 11, name: "腸胃道用藥",             cat: "gi",    estimate: 95, unitType: "drug" }
];
/* 以上 estimate 都是預估值，不是正式藥物清單。第 1、2 章已依 W1 筆記改成實際單元數。 */

/* 群島：哪些章節在同一塊陸地上。主島上每一章是一個區域，區域之間用小路分開。
   angle：這座島放在主島的哪個方向（度，0 是右邊、90 是下面），讓群島構圖自然、不對稱。 */
PI.LANDMASSES = [
  // palette：島的地面顏色。ground 草地（也是已解鎖格子的底色）、light 內陸較淺處、cliff 地面邊緣的土坡
  { id: "main", name: "抗微生物主島", chapters: [1, 2, 3, 4, 5, 6, 7, 8],
    palette: { ground: "#B4D69A", light: "#C5E2AA", cliff: "#8CB57A" } },   // 草地綠
  { id: "endo", name: "內分泌島", chapters: [9],  angle: -28,
    palette: { ground: "#EAD796", light: "#F2E4B3", cliff: "#C9B068" } },   // 柔和黃
  { id: "resp", name: "呼吸島",   chapters: [10], angle: 168,
    palette: { ground: "#A8CBE0", light: "#C2DBEA", cliff: "#7DA3BD" } },   // 柔和藍
  { id: "gi",   name: "腸胃島",   chapters: [11], angle: 62,
    palette: { ground: "#ECB4A5", light: "#F3CABF", cliff: "#CB8B7A" } }    // 柔和珊瑚粉
];

/* 地圖設定 */
PI.MAP = {
  hexRadius: 60,        // 六角格頂點半徑：寬 103.92、高 120，與 Penpot 的 hex-rounded 一致
  cell: {              // 格子外觀：已解鎖的格子用所在島嶼的 ground 色；未解鎖的格子透明，只留低調的灰框
    unlockedOpacity: 0.92, line: "#F6EDCB", lineOpacity: 0.85, lineWidth: 3,
    lockedLine: "#DCE4E1", lockedLineOpacity: 0.55, lockedLineWidth: 2
  },
  corner: 12,           // 六角格圓角
  padding: 64,          // 地圖與容器邊緣的留白
  islandGap: 3.2,       // 島與島之間至少隔幾格寬的海
  regionGap: 1.4,       // 主島上章節區域之間的草地小路寬度（格數）
  coast: {              // 島嶼地形：依格子位置疊圓形，合起來是連續草地與圓潤海岸
    shadow: "#1C7A9E",    // 水下陰影（讓島有一點厚度）；草地顏色改由各島的 palette 決定
    shallow: "#9FDCD8",   // 淺水
    foam: "#FFFFFF",      // 浪花
    sand: "#F2E3B5",      // 沙灘
    sandShade: "#E3CF97", // 沙灘靠水那側的陰影
  },
  terrain: {            // 地形場的等高線門檻：數字越小越靠外
    shallow: 0.16, foam: 0.33, sand: 0.4, grass: 0.55, inner: 1.35,
    sigma: 0.85,        // 每一格對地形的影響範圍（格半徑的倍數）：小一點，陸地才會只在已解鎖的格子底下
    noise: 0.2,         // 海岸不規則程度
    step: 24            // 計算精細度（世界座標單位），越小越細但越慢
  }
};

/* 地圖美術：海水平鋪紋理與獨立放置的裝飾素材
   尺寸都是「世界座標」單位（一格六角形寬約 104），縮放時會跟著格子一起放大縮小。
   原始的整張海洋插畫保留在 assets/reference/，只當美術參考，不用在遊戲裡。 */
PI.ART = {
  seaTile: { src: "assets/sea-tile.jpg", size: 640 },   // 可無縫平鋪的海水
  chunkSize: 1200,                                        // 分塊大小：只畫畫面附近的區塊
  keepClear: 300,                                         // 海上裝飾離島嶼格子至少這麼遠，不會蓋到島
  decor: [
    // kind：island 小島、rock 礁石、wave 浪花；w、h 是在世界座標中的大小
    { kind: "island", src: "assets/decor/island-dock.png",  w: 336, h: 222 },
    { kind: "island", src: "assets/decor/island-round.png", w: 183, h: 165 },
    { kind: "island", src: "assets/decor/islet-palm.png",   w: 254, h: 198 },
    { kind: "island", src: "assets/decor/islet-palm2.png",  w: 219, h: 180 },
    { kind: "island", src: "assets/decor/islet-tree.png",   w: 159, h: 140 },
    { kind: "rock",   src: "assets/decor/rock-2.png",       w: 57,  h: 51 },
    { kind: "rock",   src: "assets/decor/rock-3.png",       w: 56,  h: 48 },
    { kind: "rock",   src: "assets/decor/rock-4.png",       w: 74,  h: 63 },
    { kind: "rock",   src: "assets/decor/rock-5.png",       w: 63,  h: 50 },
    { kind: "wave",   src: "assets/decor/wave-1.png",       w: 498, h: 180 },
    { kind: "wave",   src: "assets/decor/wave-2.png",       w: 293, h: 113 },
    { kind: "wave",   src: "assets/decor/wave-3.png",       w: 258, h: 86 },
    { kind: "wave",   src: "assets/decor/wave-4.png",       w: 201, h: 96 },
    { kind: "wave",   src: "assets/decor/wave-5.png",       w: 180, h: 56 },
    { kind: "wave",   src: "assets/decor/wave-6.png",       w: 123, h: 143 }
  ],
  perChunk: { island: [0, 1], rock: [0, 1], wave: [0, 1] } // 每個區塊放幾個（最少、最多）
};

/* 等級規則：每佔領一格得到的經驗值、知識樹每答對一題（一個挖空）得到的經驗值，以及每升一級需要的經驗值 */
PI.LEVEL = { expPerCell: 10, expPerTreeQuestion: 5, expPerLevel: 50 };
