/* PHARMA ISLAND：藥理藥化平安符科目
   這個檔案只在 amulet.html 載入，會把藥理的章節、單元、知識樹換成藥理藥化平安符的。
   格式和藥理完全一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）。
   正式章節與內容還沒提供，先放一座島、一章、20 個預留格，沒有虛構任何內容。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-amulet-v1";   // 進度和藥理分開存

PI.CATEGORIES = [
  { id: "amulet", name: "藥理藥化平安符", color: "#DE9384", tint: "#F7DDD6" }
];

/* 章節：之後拿到課程章節再改名、往後加（加章節時記得在下面的 PI.LANDMASSES 把章節編號放進同一座島） */
PI.CHAPTERS = [
  { id: 1, name: "抗病毒藥物（流感）", cat: "amulet", estimate: 20, unitType: "drug", note: "第一座島。內容還沒提供，先預留 20 格。" }
];

/* 一座島 */
PI.LANDMASSES = [
  { id: "amulet", name: "流感島", chapters: [1],
    palette: { ground: "#ECB4A5", light: "#F3CABF", cliff: "#CB8B7A" } }
];

/* 學習單元：格式見 js/units.js 開頭的統一模板 */
PI.UNITS = [];

/* 知識樹：格式見 js/knowledge.js 開頭的說明；分段名稱可以自己改 */
/* 流程圖格式（flow）：知識樹的卡片可以放一串步驟，每一步：
     { title: "步驟名稱", text: ["說明（可挖空）"], block: { label: "抑制框標題", drugs: "藥名", note: "補充" } }
   block 是「被藥擋住的步驟」，會畫成紅色的 ⊖ 抑制框。
   挖空也可以自己指定錯誤選項：{{答案|類型|錯1/錯2/錯3}}（題庫還小的時候用，選項都取自同一張講義）。
   diagram：重畫的示意圖（放最上面，文字步驟會收合成「看文字步驟」）。
   original：原始講義圖，放在卡片最下面，點開才顯示。 */
PI.KNOWLEDGE = {
  ch1: {
    chapter: 1, title: "抗病毒藥物（流感）",
    sections: [
      { id: "structure", title: "病毒構造", items: [
        { title: "流感病毒表面", source: "講義 01. 抗病毒藥物（流感）",
          points: [
            "{{RNA|名詞|DNA/逆轉錄/雙股 DNA}} virus",
            "表面構造：{{Neuraminidase|標的|Integrase/Protease/Reverse transcriptase}}、M2 Protein、Hemagglutinin",
            "{{Hemagglutinin|標的|Neuraminidase/M2 Protein/RNA polymerase}}：紅血球凝集素"
          ] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { title: "流感病毒生命週期與藥物作用點", source: "講義圖（Arch Bronconeumol. 2017;53(1):19-26）",
          diagram: "assets/knowledge/flu-lifecycle.svg",
          original: "assets/knowledge/flu-lifecycle.jpg",
          flow: [
            { title: "進入細胞",
              text: ["病毒進入宿主細胞，形成 {{Endosome|結構|Lysosome/Ribosome/Golgi body}}"] },
            { title: "脫殼 Uncoating",
              text: ["{{M2 Protein|標的|Neuraminidase/Hemagglutinin/RNA polymerase}} 活化，使 {{H⁺|離子|Na⁺/K⁺/Ca²⁺}} 往病毒內送（{{pH↓|性質|pH↑/pH 不變/pH 中性}}），病毒外殼脫去、釋出遺傳物質"],
              block: { label: "治療 {{A 型|名詞|B 型/A、B 型/C 型}}流感",
                       drugs: "{{Amantadine|藥名|Oseltamivir/Ribavirin/Zanamivir}}、Rimantadine",
                       note: "Amantadine 的機轉可抑制病毒{{脫殼|反應|釋放/RNA 複製/出芽}}，達到抗病毒的效果" } },
            { title: "病毒 RNA 複製",
              text: ["{{RNA polymerase|標的|Neuraminidase/M2 Protein/Hemagglutinin}}（Replication of viral RNA）"],
              block: { label: "{{RNA polymerase inhibitors|藥物類別|Neuraminidase inhibitors/M2 inhibitors/Protease inhibitors}}",
                       drugs: "{{Ribavirin|藥名|Amantadine/Oseltamivir/Peramivir}}" } },
            { title: "運送・配裝 → 出芽",
              text: ["運送 Transport、配裝 Assembly，病毒從宿主細胞{{出芽|反應|脫殼/吸附/複製}}"] },
            { title: "釋放 Release",
              text: ["病毒離開宿主細胞時，{{Neuraminidase|標的|M2 Protein/Hemagglutinin/RNA polymerase}} 可幫助病毒離開宿主細胞"],
              block: { label: "治療 {{A 型、B 型|名詞|A 型/B 型/C 型}}流感：{{Neuraminidase inhibitors|藥物類別|M2 inhibitors/RNA polymerase inhibitors/Protease inhibitors}}",
                       drugs: "Zanamivir、{{Oseltamivir|藥名|Amantadine/Rimantadine/Ribavirin}}、Peramivir",
                       note: "Oseltamivir 抑制 Neuraminidase，阻止病毒{{釋出|反應|脫殼/複製/進入細胞}}" } }
          ] }
      ] }
    ]
  }
};

/* 名詞小框框：知識樹裡出現這些名詞時加虛線，點一下跳出解釋。解釋只用講義上印的內容。 */
PI.GLOSSARY = {
  "Hemagglutinin": "紅血球凝集素；流感病毒的表面構造之一。",
  "Neuraminidase": "流感病毒的表面構造之一；病毒離開宿主細胞時，可幫助病毒離開宿主細胞。被 Neuraminidase inhibitors 抑制。",
  "M2 Protein": "流感病毒的表面構造之一；活化後使 H⁺ 往病毒內送（pH↓），病毒脫殼。被 Amantadine、Rimantadine 抑制。",
  "Endosome": "病毒進入宿主細胞後形成，接著在這裡脫殼（講義圖第 1→2 步）。",
  "Uncoating": "脫殼：病毒外殼脫去、釋出遺傳物質。",
  "RNA polymerase": "負責病毒 RNA 複製（Replication of viral RNA）。被 Ribavirin 抑制。"
};
