/* PHARMA ISLAND：生藥科目
   這個檔案只在 pharmacognosy.html 載入，會把藥理的章節、單元、知識樹換成生藥的。
   格式和藥理完全一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）；版面參考藥理藥化平安符頁。
   正式章節與內容還沒提供，先放一座島、一章、20 個預留格，沒有虛構任何內容。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-pharmacognosy-v1";   // 進度和其他科目分開存

PI.CATEGORIES = [
  { id: "pharmacognosy", name: "生藥學", color: "#A39A5C", tint: "#ECE8CF" }
];

/* 章節：之後拿到課程章節再改名、往後加（加章節時記得在下面的 PI.LANDMASSES 把章節編號放進同一座島） */
PI.CHAPTERS = [
  { id: 1, name: "生藥學", cat: "pharmacognosy", estimate: 20, unitType: "drug", note: "第一座島。內容還沒提供，先預留 20 格。" }
];

/* 一座島 */
PI.LANDMASSES = [
  { id: "pharmacognosy", name: "生藥島", chapters: [1],
    palette: { ground: "#CFC594", light: "#DFD8B0", cliff: "#A89D68" } }
];

/* 學習單元：格式見 js/units.js 開頭的統一模板 */
PI.UNITS = [];

/* 知識樹：格式見 js/knowledge.js 開頭的說明；流程圖（flow）、示意圖（diagram）的寫法見 js/subjects/amulet.js */
PI.KNOWLEDGE = {
  ch1: {
    chapter: 1, title: "生藥學",
    sections: [
      { id: "basics",    title: "基本概念", items: [] },
      { id: "mechanism", title: "成分與作用", items: [] },
      { id: "summary",   title: "重點整理", items: [] }
    ]
  }
};

/* 名詞小框框：之後有講義再補（只用講義上印的內容） */
PI.GLOSSARY = {};

/* 和平安符頁一樣：電腦版知識面板開大一點（樣式見 css/style.css 的 .is-amulet） */
document.documentElement.classList.add("is-amulet");
