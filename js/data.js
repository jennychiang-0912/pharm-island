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

/* 等級規則：每佔領一格得到的經驗值，以及每升一級需要的經驗值 */
PI.LEVEL = { expPerCell: 10, expPerLevel: 50 };
