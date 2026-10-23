/* PHARMA ISLAND：藥劑科目
   這個檔案只在 pharmaceutics.html 載入，會把藥理的章節、單元、知識樹換成藥劑的。
   格式和藥理完全一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）。
   正式章節與內容還沒提供，先放一座島、一章、20 個預留格，沒有虛構任何內容。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-pharmaceutics-v1";   // 進度和藥理分開存

PI.CATEGORIES = [
  { id: "pharmaceutics", name: "藥劑學", color: "#7FA7C9", tint: "#DCE8F2" }
];

/* 章節：之後拿到課程章節再改名、往後加（加章節時記得在下面的 PI.LANDMASSES 把章節編號放進同一座島） */
PI.CHAPTERS = [
  { id: 1, name: "藥劑學", cat: "pharmaceutics", estimate: 20, unitType: "topic", note: "章節與內容還沒提供，先預留 20 格。" }
];

/* 一座島 */
PI.LANDMASSES = [
  { id: "pharmaceutics", name: "藥劑島", chapters: [1],
    palette: { ground: "#A8CBE0", light: "#C2DBEA", cliff: "#7DA3BD" } }
];

/* 學習單元：格式見 js/units.js 開頭的統一模板 */
PI.UNITS = [];

/* 知識樹：格式見 js/knowledge.js 開頭的說明；分段名稱可以自己改 */
PI.KNOWLEDGE = {
  ch1: {
    chapter: 1, title: "藥劑學",
    sections: [
      { id: "basics",  title: "基本概念",   items: [] },
      { id: "methods", title: "原理與方法", items: [] },
      { id: "summary", title: "重點整理",   items: [] }
    ]
  }
};
