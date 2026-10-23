/* PHARMA ISLAND：分類、章節與地圖設定
   只放資料，不放程式邏輯。題庫之後另外放在 js/questions.js。 */
window.PI = window.PI || {};

/* 四大分類與色系 */
PI.CATEGORIES = [
  { id: "micro", name: "抗微生物藥物",   color: "#7FA86A" },
  { id: "endo",  name: "內分泌系統用藥", color: "#E2C46A" },
  { id: "resp",  name: "呼吸系統用藥",   color: "#8DB3CF" },
  { id: "gi",    name: "腸胃道用藥",     color: "#E9A094" }
];

/* 11 個章節：名稱照課程，不要更改。
   color 是這一章格子的顏色（同一分類同一色系，深淺不同）。
   cells 是這一章在地圖上的格子數，之後可依題庫數量調整。 */
PI.CHAPTERS = [
  { id: 1,  name: "抗菌藥物療法導論",       cat: "micro", color: "#7FA86A", cells: 7 },
  { id: 2,  name: "磺胺藥與泌尿道感染用藥", cat: "micro", color: "#93B57E", cells: 7 },
  { id: 3,  name: "細胞壁合成抑制劑",       cat: "micro", color: "#6E9C6B", cells: 7 },
  { id: 4,  name: "蛋白質合成抑制劑",       cat: "micro", color: "#A3C48C", cells: 7 },
  { id: 5,  name: "抗分枝桿菌藥物",         cat: "micro", color: "#7BA27A", cells: 7 },
  { id: 6,  name: "抗黴菌藥",               cat: "micro", color: "#8FB878", cells: 7 },
  { id: 7,  name: "抗病毒藥物",             cat: "micro", color: "#86AE84", cells: 7 },
  { id: 8,  name: "消毒殺菌劑",             cat: "micro", color: "#9BBD7C", cells: 7 },
  { id: 9,  name: "胰島素與口服降血糖藥",   cat: "endo",  color: "#E2C46A", cells: 7 },
  { id: 10, name: "呼吸系統用藥",           cat: "resp",  color: "#8DB3CF", cells: 7 },
  { id: 11, name: "腸胃道用藥",             cat: "gi",    color: "#E9A094", cells: 7 }
];

/* 地圖設定 */
PI.MAP = {
  hexRadius: 60,        // 六角格頂點半徑：寬 103.92、高 120，與 Penpot 的 hex-rounded 一致
  border: 12,           // 格子邊框寬度
  borderColor: "#F3E5B5",
  lockedFill: "#E3E8D8"
};

/* 等級規則：每佔領一格得到的經驗值，以及每升一級需要的經驗值 */
PI.LEVEL = { expPerCell: 10, expPerLevel: 50 };
