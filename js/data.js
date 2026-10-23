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
   cells 是這一章在地圖上的格子數，之後可依題庫數量調整。 */
PI.CHAPTERS = [
  { id: 1,  name: "抗菌藥物療法導論",       cat: "micro", cells: 7 },
  { id: 2,  name: "磺胺藥與泌尿道感染用藥", cat: "micro", cells: 7 },
  { id: 3,  name: "細胞壁合成抑制劑",       cat: "micro", cells: 7 },
  { id: 4,  name: "蛋白質合成抑制劑",       cat: "micro", cells: 7 },
  { id: 5,  name: "抗分枝桿菌藥物",         cat: "micro", cells: 7 },
  { id: 6,  name: "抗黴菌藥",               cat: "micro", cells: 7 },
  { id: 7,  name: "抗病毒藥物",             cat: "micro", cells: 7 },
  { id: 8,  name: "消毒殺菌劑",             cat: "micro", cells: 7 },
  { id: 9,  name: "胰島素與口服降血糖藥",   cat: "endo",  cells: 7 },
  { id: 10, name: "呼吸系統用藥",           cat: "resp",  cells: 7 },
  { id: 11, name: "腸胃道用藥",             cat: "gi",    cells: 7 }
];

/* 地圖設定 */
PI.MAP = {
  hexRadius: 60,        // 六角格頂點半徑：寬 103.92、高 120，與 Penpot 的 hex-rounded 一致
  border: 12,           // 格子邊框（奶油黃格線）寬度
  borderColor: "#F3E5B5",
  corner: 12,           // 六角格圓角
  fill: {               // 三種狀態的填色，全部在淺綠色系
    locked: "#D6E3C9",
    available: "#A8C98F",
    occupied: "#5E8B67"
  },
  padding: 64           // 地圖與容器邊緣的留白
};

/* 地圖美術：海水平鋪紋理與獨立放置的裝飾素材
   尺寸都是「世界座標」單位（一格六角形寬約 104），縮放時會跟著格子一起放大縮小。
   原始的整張海洋插畫保留在 assets/reference/，只當美術參考，不用在遊戲裡。 */
PI.ART = {
  seaTile: { src: "assets/sea-tile.jpg", size: 640 },   // 可無縫平鋪的海水
  chunkSize: 1200,                                        // 分塊大小：只畫畫面附近的區塊
  keepClear: 150,                                         // 裝飾離格子至少這麼遠，不會蓋到領地
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
  perChunk: { island: [0, 1], rock: [1, 3], wave: [1, 3] } // 每個區塊放幾個（最少、最多）
};

/* 等級規則：每佔領一格得到的經驗值，以及每升一級需要的經驗值 */
PI.LEVEL = { expPerCell: 10, expPerLevel: 50 };
