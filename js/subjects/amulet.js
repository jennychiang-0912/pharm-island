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
          diagram: "assets/knowledge/flu-lifecycle.svg?v=2",
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

/* 這頁的知識面板在電腦上開大一點（示意圖看得清楚）；樣式見 css/style.css 的 .is-amulet */
document.documentElement.classList.add("is-amulet");


/* ================= 以下取自「藥理藥化平安符」講義（手機拍攝 277 頁），照講義順序 =================
   一章一個講義編號（01. 抗病毒藥物、02. 抗癌藥物…），一格一個藥（或講義表格的一列）。
   只收印刷字；手寫筆記與考古題年份（講義上手寫的 1xx-x）都沒有收錄。結構式圖沒有收錄，結構上的文字重點放在「結構」欄。
   第 1 章原有的知識樹（流感生命週期流程圖）保留不動，只補上講義表格的藥物格。 */
PI.UNIT_FIELDS = [["cls", "藥理分類／機轉"], ["struct", "結構"], ["feat", "藥理特色"], ["notes", "其他重點"]];
PI.GROUP_REGIONS = true;

const SRC_AM = "藥理藥化平安符";
/* 七座島，順序照講義章號 */
PI.LANDMASSES = [];
function isleA(id, name, palette) { PI.LANDMASSES.push({ id, name, chapters: [], palette }); }
function chA(id, no, name, pages, note) {
  const old = PI.CHAPTERS.find(c => c.id === id);
  const c = old || { id, name, cat: "amulet", estimate: 0, unitType: "drug" };
  c.name = name; c.no = no; c.estimate = 0; c.unitType = "drug";
  c.note = `講義：${name}（拍攝第 ${pages} 頁）。依講義的印刷字。${note || ""}`;
  if (!old) PI.CHAPTERS.push(c);
  PI.LANDMASSES[PI.LANDMASSES.length - 1].chapters.push(id);
}
/* 章號：id 是程式內部用的唯一編號，no 是講義上的編號（顯示用），例如 01、04-1。
   一格：dA(章號, 小分類, 頁, id, 名稱, 短名, {cls, struct, feat, notes}) */
function dA(chapter, group, page, id, name, short, f) {
  PI.UNITS.push(Object.assign({ id, chapter, name, short: short || undefined, type: "drug", group, source: SRC_AM + " 第 " + page + " 頁" }, f));
  const c = PI.CHAPTERS.find(x => x.id === chapter); if (c) c.estimate++;
}

/* 知識樹（講義的機轉圖、總整理表）：kA(章號, 段落標題, 頁, 卡片標題, 重點[]) */
function kA(chapter, section, page, title, points) {
  const key = "ch" + chapter;
  const K = PI.KNOWLEDGE[key] || (PI.KNOWLEDGE[key] = { chapter, title: (PI.CHAPTERS.find(c => c.id === chapter) || {}).name || "", sections: [] });
  let sec = K.sections.find(x => x.title === section);
  if (!sec) { sec = { id: "s" + K.sections.length, title: section, items: [] }; K.sections.push(sec); }
  const it = { title, source: SRC_AM + " 第 " + page + " 頁" };
  if (Array.isArray(points)) it.points = points; else Object.assign(it, points);   // 講義上是表格的卡片：傳 { table: {…} }
  sec.items.push(it);
}

/* ================= 抗感染與化療島（01～09） ================= */
isleA("infection", "抗感染與化療島", { ground: "#ECB4A5", light: "#F3CABF", cliff: "#CB8B7A" });

/* ===== 第 1 章 抗病毒藥物（流感）（拍攝第 1～2 頁）===== */
chA(1, "01", "抗病毒藥物（流感）", "1～2");
dA(1, "抑制脫殼", 2, "amantadine", "Amantadine", null, {
  cls: ["抑制脫殼（提升病毒之 {{Endosomal pH|名詞}}，只對 {{A 型|名詞}}流感有效）"],
  struct: ["{{一級胺|結構}}"],
  feat: ["可抗病毒及抗 {{PD|疾病}}（可入 {{BBB|名詞}}）", "以{{原型藥|名詞}}排除於尿液中，不易被代謝 → {{腎功能低下|族群}}者須做劑量調整"] });
dA(1, "抑制脫殼", 2, "rimantadine", "Rimantadine", null, {
  cls: ["抑制脫殼（提升病毒之 Endosomal pH，只對 A 型流感有效）"],
  feat: ["只能抗病毒（{{不入 BBB|性質}}）", "減少{{中樞神經系統|器官}}的副作用", "半衰期較 Amantadine {{長|性質}}"] });
dA(1, "抑制 RNA polymerase", 2, "ribavirin", "Ribavirin", null, {
  cls: ["抑制 {{RNA polymerase|標的}}"],
  struct: ["含有 {{Triazole|結構}}"],
  feat: ["{{Interferon-α|藥名}} ＋ Ribavirin，可治療 {{C 肝|疾病}}", "{{孕婦|族群}}禁用", "可用於兒童 {{RSV|疾病}} 感染"] });
dA(1, "Neuraminidase inhibitors", 2, "oseltamivir", "Oseltamivir（Tamiflu）", "Oseltamivir", {
  cls: ["{{Neuraminidase inhibitors|藥物類別}}（對 {{A&B 型|名詞}}流感有效）"],
  struct: ["含有 {{Cyclohexene|結構}}"],
  feat: ["以{{口服|給藥途徑}}給藥，為 {{Prodrug|名詞}}（{{Ester → COOH|反應}} 有活性）"] });
dA(1, "Neuraminidase inhibitors", 2, "zanamivir", "Zanamivir", null, {
  cls: ["Neuraminidase inhibitors（對 A&B 型流感有效）"],
  struct: ["含有 {{Guanidine|結構}}、甘油"],
  feat: ["以{{吸入|給藥途徑}}給藥"] });
dA(1, "Neuraminidase inhibitors", 2, "peramivir", "Peramivir", null, {
  cls: ["Neuraminidase inhibitors（對 A&B 型流感有效）"],
  struct: ["含有 {{Cyclopentane|結構}}"],
  feat: ["以{{注射|給藥途徑}}給藥"] });

/* ===== 01. 抗病毒藥（HIV）（拍攝第 3～10 頁），id 101 ===== */
chA(101, "01", "抗病毒藥物（HIV、肝炎）", "3～10");
dA(101, "NRTIs", 4, "zidovudine", "Zidovudine（AZT）", "Zidovudine", {
  cls: ["{{Nucleoside reverse transcriptase inhibitors|藥物類別}}（NRTIs）：對 {{HIV-1、HIV-2|名詞}} 病毒有效；屬於前驅藥，必須在 C-5 位上{{磷酸化|反應}}生成核苷三磷酸後，才能提供錯誤的核苷酸，讓病毒無法順利反轉錄 DNA"],
  struct: ["3′-Azido-3′-deoxythymidine；屬於 {{Thymine|結構}} 衍生物"],
  feat: ["代謝後{{不會產生尿酸|性質}}", "副作用：{{骨髓抑制|副作用}}", "因含 {{Azide（疊氮）|結構}}，須{{避光|名詞}}儲存"] });
dA(101, "NRTIs", 4, "stavudine", "Stavudine（d4T）", "Stavudine", {
  cls: ["NRTIs"], struct: ["屬於 {{Thymine|結構}} 衍生物"],
  feat: ["副作用：{{周邊神經炎、乳酸中毒|副作用}}"] });
dA(101, "NRTIs", 4, "zalcitabine", "Zalcitabine（ddC）", "Zalcitabine", {
  cls: ["NRTIs"], struct: ["2′-3′-Dideoxycytidine；屬於 {{Cytosine|結構}} 衍生物"],
  feat: ["副作用：{{胰臟炎、周邊神經病變|副作用}}"] });
dA(101, "NRTIs", 4, "lamivudine", "Lamivudine（3TC）", "Lamivudine", {
  cls: ["NRTIs"], struct: ["含有{{硫原子|結構}}，具有 {{Oxathiol|結構}}；屬於 Cytosine 衍生物"],
  feat: ["可用於治療 {{B 肝|疾病}}"] });
dA(101, "NRTIs", 4, "emtricitabine", "Emtricitabine（FTC）", "Emtricitabine", {
  cls: ["NRTIs"], struct: ["結構特色：{{3TC ＋ F|結構}}；屬於 Cytosine 衍生物"],
  feat: ["副作用：{{色素沉澱|副作用}}"] });
dA(101, "NRTIs", 4, "didanosine", "Didanosine（ddI）", "Didanosine", {
  cls: ["NRTIs"], struct: ["2′-3′-Dideoxyinosine；屬於 {{Inosine|結構}} 衍生物"],
  feat: ["為 {{Prodrug|名詞}}，代謝後會產生{{高尿酸血症|副作用}}", "副作用：{{胰臟炎、周邊神經病變|副作用}}"] });
dA(101, "NRTIs", 4, "abacavir", "Abacavir（ABC）", "Abacavir", {
  cls: ["NRTIs"], struct: ["屬於 {{Guanine|結構}} 衍生物"],
  feat: ["代謝後會產生{{尿酸|物質}}", "基因檢測：{{HLA-B5701|名詞}}"] });
dA(101, "NRTIs", 4, "tenofovir", "Tenofovir", null, {
  cls: ["NRTIs"], struct: ["屬於 {{Adenine|結構}} 衍生物"],
  feat: ["可治療 {{HIV、HBV|疾病}}", "副作用：{{骨質疏鬆、軟骨症|副作用}}"] });
kA(101, "HIV 生命週期與藥物作用點", 3, "抗病毒藥（HIV）機轉圖", [
  "與 Entry 有關：抑制病毒外套膜（{{Maraviroc|藥名}}）與細胞膜融合（{{Enfuvirtide|藥名}}）",
  "Maraviroc 作用於 {{CCR5 or CXR4|標的}} Co-receptor；Enfuvirtide 抑制{{融合|反應}}（Fusion）",
  "{{反轉錄酶|名詞}}（Reverse Transcriptase ＝ RT）：可將病毒 {{RNA 轉換為 DNA|名詞}}；抑制劑：NNRTIs（Nevirapine、Efavirenz）、NRTIs（Zidovudine、Didanosine、Zalcitabine）",
  "{{併入酶|名詞}}（Integrase）：將轉錄完成的 DNA {{嵌入宿主|名詞}}；抑制劑：{{Raltegravir、Elvitegravir|藥名}}",
  "{{蛋白酶|名詞}}（Protease）：幫助病毒轉化為具感染能力的病毒粒子；抑制劑：{{Saquinavir、Ritonavir|藥名}}"
]);
dA(101, "NNRTIs", 5, "nevirapine", "Nevirapine", null, {
  cls: ["{{Non-nucleoside reverse transcriptase inhibitors|藥物類別}}（NNRTIs）：僅對 {{HIV-1|名詞}} 病毒有效；{{不用轉化為三磷酸|性質}}的形式，直接抑制反轉錄酶"],
  struct: ["具有 {{Dipyridodiazepinone|結構}} 結構"],
  feat: ["為 {{CYP3A4 誘導劑|名詞}}", "副作用：{{肝毒性|副作用}}"] });
dA(101, "NNRTIs", 5, "efavirenz", "Efavirenz", null, {
  cls: ["NNRTIs"], struct: ["含有{{炔基|結構}}"],
  feat: ["屬於 {{3A4 inducer 及 3A4 inhibitor|名詞}}", "副作用：{{頭痛|副作用}}", "可進入{{中樞|器官}}"] });
dA(101, "NNRTIs", 5, "delavirdine", "Delavirdine", null, {
  cls: ["NNRTIs"], feat: ["機轉為 {{RT 抑制劑|名詞}}"] });
dA(101, "Protease inhibitors", 5, "ritonavir", "Ritonavir", null, {
  cls: ["{{Protease inhibitors|藥物類別}}（-navir）"],
  feat: ["{{CYP3A4 的強效抑制劑|名詞}}，可提高其他 Protease inhibitors 的藥效"] });
dA(101, "Protease inhibitors", 5, "indinavir", "Indinavir", null, {
  cls: ["Protease inhibitors（-navir）"], struct: ["含 {{Pentanoic acid amide|結構}}"],
  feat: ["{{酸化尿液|名詞}}可增加藥物排除", "副作用：{{腎結石|副作用}}"] });
dA(101, "HIV integrase inhibitors", 5, "raltegravir", "Raltegravir", null, {
  cls: ["{{HIV integrase inhibitors|藥物類別}}"], struct: ["含 {{Oxadiazole、Pyrimidine|結構}}"],
  feat: ["{{口服易吸收|性質}}", "食物{{不會影響|性質}}吸收速率"] });
dA(101, "Entry（Fusion）inhibitors", 5, "enfuvirtide", "Enfuvirtide", null, {
  cls: ["{{Entry（Fusion）inhibitors|藥物類別}}"], struct: ["含有 {{36|數值}} 個胺基酸"],
  feat: ["抑制 {{GP41|標的}}", "{{皮下注射|給藥途徑}}"] });
dA(101, "CCR5 receptor antagonist", 5, "maraviroc", "Maraviroc", null, {
  cls: ["{{CCR5 receptor antagonist|藥物類別}}"],
  feat: ["結合到宿主細胞 {{CCR5|標的}} 蛋白質，而阻斷病毒的進入"] });
kA(101, "抗疱疹藥物", 6, "抗疱疹藥物機轉圖", [
  "{{Valacyclovir|藥名}} → Acyclovir；{{Famciclovir|藥名}} → Penciclovir；{{Valganciclovir|藥名}} → Ganciclovir（前驅藥 → 活性藥）",
  "Acyclovir、Penciclovir 經 {{Viral thymidine kinase|酵素}} 磷酸化為 -P；Ganciclovir 經 {{UL 97 kinase|酵素}} 磷酸化為 -P",
  "-P 再經兩次 {{Cellular kinase|酵素}} 變成 -PPP（Cidofovir 本身已是 {{Cidofovir-P|物質}}，只需 Cellular kinase）",
  "Acyclovir-PPP、Penciclovir-PPP、Ganciclovir-PPP、Cidofovir-PPP 與 {{Foscarnet|藥名}} 都抑制 {{HSV DNA polymerase|標的}}"
]);
dA(101, "抗 HSV", 7, "acyclovir", "Acyclovir", null, {
  cls: ["抑制 {{DNA polymerase|標的}}：由{{病毒|名詞}}接一個磷酸根後由{{宿主|名詞}}接上兩個磷酸根，才有活性", "為 {{Acyclic guanine nucleoside|結構}}"],
  feat: ["經 {{Thymidine kinase|酵素}} 活化", "{{Valacyclovir|藥名}} 為 acyclovir 的 Prodrug"] });
dA(101, "抗 HSV", 7, "penciclovir", "Penciclovir", null, {
  cls: ["抑制 DNA polymerase：由病毒接一個磷酸根後由宿主接上兩個磷酸根，才有活性"],
  feat: ["為 Ganciclovir 之{{等價異構物|名詞}}（{{O → C|結構}}）", "{{Famciclovir|藥名}} 為 Penciclovir 之 Prodrug"] });
dA(101, "抗 HSV", 7, "ganciclovir", "Ganciclovir", null, {
  cls: ["抑制 DNA polymerase：由病毒接一個磷酸根後由宿主接上兩個磷酸根，才有活性"],
  struct: ["為 Acyclovir 之類似物，結構多了 {{-CH2OH|結構}}"],
  feat: ["{{Valganciclovir|藥名}} 為 Ganciclovir 之 Prodrug", "副作用：{{血液毒性|副作用}}", "可治療 {{CMV|疾病}}"] });
dA(101, "抗 HSV", 7, "cidofovir", "Cidofovir", null, {
  cls: ["抑制 DNA polymerase：由宿主接上{{兩個|數值}}磷酸根，才有活性"],
  feat: ["本身含有一個{{磷酸根|結構}}，不須經由病毒磷酸化", "副作用：{{腎毒性、Fanconi syndrome|副作用}}", "可治療 CMV"] });
dA(101, "抗 HSV", 7, "foscarnet", "Foscarnet", null, {
  cls: ["抑制 DNA polymerase"],
  struct: ["結構中有 {{3|數值}} 個鈉離子"],
  feat: ["{{不須經由活化|性質}}，即可抑制 DNA polymerase", "可治療 CMV"] });
dA(101, "抗 HSV", 7, "fomivirsen", "Fomivirsen", null, {
  cls: ["與{{巨細胞病毒|名詞}}之 {{mRNA|名詞}} 結合，抑制蛋白質合成"],
  struct: ["{{21-mer phosphorothioate oligodeoxynucleotide|結構}}"],
  feat: ["為 {{Antisense agent|名詞}}，不屬於蛋白質藥物", "副作用：{{增加眼內壓|副作用}}", "可治療 CMV"] });
dA(101, "抗 HSV", 7, "idoxuridine", "Idoxuridine", null, {
  cls: ["抑制 DNA polymerase：由宿主接上{{三個|數值}}磷酸根，才有活性"],
  struct: ["將 {{I|結構}} 改為 CH3 後結構似 Thymidine，可以干擾 {{Thymidine|物質}} 的利用"] });
dA(101, "抗 HSV", 7, "trifluridine", "Trifluridine", null, {
  cls: ["抑制 DNA polymerase：由宿主接上三個磷酸根，才有活性"],
  struct: ["將 {{CF3|結構}} 改為 CH3 後結構似 Thymidine，可以干擾 Thymidine 的利用"] });
dA(101, "抗 HSV", 7, "vidarabine", "Vidarabine（Ara-A）", "Vidarabine", {
  cls: ["抑制 DNA polymerase：由宿主接上三個磷酸根，才有活性"],
  struct: ["屬於 {{Adenine|結構}} 衍生物，含有 {{Arabinose|結構}}"],
  feat: ["由 {{Adenosine kinase|酵素}} 活化", "受 {{Adenosine deaminase|酵素}} 代謝"] });
dA(101, "治療 B 肝", 8, "tenofovir-disoproxil", "Tenofovir disoproxil", null, {
  cls: ["抑制 {{DNA/RNA 合成|名詞}}"],
  feat: ["對 {{lamivudine 及 entecavir|藥名}} 已經有抗性的病毒仍然保有其效用"] });
dA(101, "治療 B 肝", 8, "adefovir-dipivoxil", "Adefovir dipivoxil", null, {
  cls: ["抑制 DNA/RNA 合成"],
  feat: ["為 B 肝用藥，副作用較{{干擾素|藥名}}小", "副作用：{{腎毒性、乳酸中毒|副作用}}"] });
dA(101, "治療 B 肝", 8, "interferon-alpha", "Interferon α", null, {
  cls: ["{{抗病毒 & 免疫調節|名詞}}"],
  feat: ["{{皮下注射|給藥途徑}}", "副作用：{{類流感症狀、肝毒性、憂鬱|副作用}}"] });
dA(101, "治療 C 肝", 8, "boceprevir", "Boceprevir", null, {
  cls: ["{{Protease inhibitors|藥物類別}}"],
  struct: ["結構中有 {{Urea moiety|結構}}"],
  feat: ["可治療 {{HCV|疾病}} 感染", "併 {{Pegylated interferon α-2b 及 Ribavirin|藥名}} 可治療 C 肝"] });
kA(101, "B 肝、C 肝藥物", 8, "其他 B 肝用藥與 C 肝 DAA", [
  "其他 B 肝用藥：Tenofovir（Vemlidy/Viread）、{{Entecavir|藥名}}（Baraclude）、Lamivudine（干安能）、Adefovir、Telbivudine",
  "治療 B 肝 & HIV：{{Tenofovir、Lamivudine|藥名}}",
  "Protease inhibitors（Direct-acting antiviral）：{{NS3/4A protease inhibitors|藥物類別}}（{{-previr|名詞}}）：Boceprevir、Telaprevir、Simeprevir、Paritaprevir",
  "{{NS5A inhibitors|藥物類別}}（{{-asvir|名詞}}）：Daclatasvir、Ledipasvir、Velpatasvir",
  "{{NS5B polymerase inhibitors|藥物類別}}：Nucleosides：{{Sofosbuvir|藥名}}；Non-nucleosides：{{Dasabuvir|藥名}}"
]);
kA(101, "Interferon 與補充考點", 9, "Interferon 總整理", { table: {
  head: [{ t: "藥物", cs: 1 }, { t: "用途", cs: 3 }],
  cols: ["藥物", "製劑", "型別", "用途"],
  rowNames: ["Interferon-α", "Interferon-α", "Interferon-α", "Interferon-α", "Interferon-β", "Interferon-γ"],
  rows: [
    [{ t: "{{Interferon-α|藥名}}", b: true, rs: 4 }, "Interferon", { t: "{{α-2a|名詞}}", rs: 2 }, { t: "HBV、HCV", rs: 2 }],
    [null, "Pegylated Interferon", null, null],
    [null, "Interferon", { t: "α-2b", rs: 2 }, "HBV、HCV"],
    [null, "Pegylated Interferon", null, "{{僅可治療 HCV|名詞}}"],
    [{ t: "{{Interferon-β|藥名}}", b: true }, { t: "治療{{多發性硬化症|疾病}}", cs: 3 }],
    [{ t: "{{Interferon-γ|藥名}}", b: true }, { t: "治療{{慢性肉芽腫病變|疾病}}", cs: 3 }]
  ],
  note: "使用 Interferon 的副作用絕對比一般藥物{{高出許多|性質}}\n常見副作用：{{Flu-like syndrome、肝毒性、骨髓抑制|副作用}}\nInterferon 接上 {{PEG|物質}} 可延長藥效及增加藥物對{{肝臟|器官}}的選擇性\nInterferon 加入 {{Albumin|物質}} 可減少玻璃管壁的吸附" } });
kA(101, "Interferon 與補充考點", 9, "補充考點", { table: { head: ["補充考點"], rowNames: false, rows: [
  ["{{孕婦|族群}}可用的 NNRTIs：{{Nevirapine、Rilpivirine|藥名}}"],
  ["{{雞尾酒療法|名詞}}：兩種 {{NRTIs|藥物類別}} ＋ 其他類藥物"] ] } });
kA(101, "Interferon 與補充考點", 10, "干擾素衍生物", [
  "{{Statolon|藥名}}：天然雙股（Double-stranded）RNA，取自 {{Penicillium stoloniferum|菌種}}",
  "{{Poly I:C|藥名}}：由 Polyriboinosinic acid 和 Polyribocytidylic acid 組成的{{雙股聚合物|名詞}}",
  "{{Poly ICLC|藥名}}：Poly I:C 為增加穩定性加上 {{Poly-L-lysine 和 Carboxymethylcellulose|物質}}，臨床上局部使用時可預防{{鼻炎|疾病}}",
  "{{Ampligen|藥名}}：Poly I:C 中間隔有 {{Uridines|物質}}，是一種多核苷酸衍生物（Polynucleotide）",
  "{{Pyran copolymers|藥名}}：如 Tilorone、Diethylaminoethyldextran、Heparin"
]);

/* ===== 第 2 章 抗癌藥物 ===== */
chA(2, "02", "抗癌藥物", "11～23");
kA(2, "抗癌藥物機轉總覽", 11, "Antimetabolites 作用點（Medical Pharmacology at a Glance 圖）", [
  "{{Hydroxyurea|藥名}} ⊖ {{Ribonucleotide reductase|酵素}}（UMP → dUMP）",
  "{{Fluorouracil（5-FU）|藥名}} ⊖ {{Thymidylate synthetase|酵素}}（dUMP → dTMP）",
  "{{Methotrexate（MTX）|藥名}} ⊖ {{Dihydrofolate reductase|酵素}}（DHF → THF）",
  "Mercaptopurine（6-MP）抑制 Purine、Pyrimidine 的合成；{{Pentostatin|藥名}} ⊖ {{Adenosine deaminase|酵素}}",
  "{{Cytarabine、Fludarabine|藥名}} ⊖ {{DNA polymerase|酵素}}"
]);
kA(2, "抗癌藥物機轉總覽", 11, "作用在 DNA 的抗癌藥", [
  "烷基化劑（烷基化 {{Guanine-N7|結構}} 號位，與 Guanine 形成共價鍵）：(1) Nitrogen mustard：Cyclophosphamide、Melphalan；(2) {{Nitrosoureas|藥物類別}}：Carmustine、Lomustine；(3) Ethylenimines：{{Thiotepa|藥名}}；(4) Alkyl sulfonates：{{Busulfan|藥名}}；(5) Organoplatinum complex：Cisplatin",
  "甲基化 DNA：(6) {{DNA methylators|藥物類別}}：Dacarbazine、Procarbazine",
  "嵌入 DNA（抗生素類）：{{Doxorubicin、Dactinomycin|藥名}}",
  "形成自由基、引起磷酸雙酯鍵斷裂（抗生素類）：{{Bleomycin|藥名}}（影響 {{G2 期 → M 期|名詞}}）",
  "Topoisomerase inhibitors：{{Etoposide|藥名}}（Topo II）、{{Topotecan|藥名}}（Topo I）",
  "Antimicrotubule（M 期）：Vinka alkaloid、Taxanes、Ixabepilone、Estramustine、Eribulin",
  "(1) Monoclonal antibodies：Bevacizumab、Trastuzumab；(2) {{Tyrosine kinase inhibitors|藥物類別}}：Imatinib、Gefitinib"
]);
kA(2, "抗癌藥物簡介", 12, "細胞週期專一性", [
  "Antimetabolites：抑制 {{S-phase|名詞}}：Methotrexate（MTX）、5-Fluorouracil（5-FU）、6-Mercaptopurine（6-MP）、Cytarabine（Ara-C）",
  "Antimicrotubule：抑制 {{M-phase|名詞}}：Vinca alkaloids、Taxanes、Ixabepilone、Estramustine",
  "Topoisomerase II inhibitor（{{S→G2|名詞}}）→ Etoposide；Topoisomerase I inhibitors（{{G2→M|名詞}}）→ Topotecan",
  "Antitumor antibiotics：{{Bleomycin|藥名}}（G2→M）"
]);
kA(2, "抗癌藥物簡介", 12, "細胞週期非專一性", [
  "{{Alkylating agents|藥物類別}}：Nitrogen mustard and aziridine-mediated alkylators、Nitrosoureas、Organoplatinum complex、DNA methylators",
  "Antitumor antibiotics：{{Anthraquinone|結構}} 骨架"
]);
kA(2, "抗癌藥物簡介", 12, "副作用與合併使用", [
  "副作用：{{骨髓抑制、噁心嘔吐、禿頭|副作用}}",
  "噁心嘔吐以 {{Ondansetron|藥名}}（5-HT3 antagonist）、{{Aprepitant|藥名}}（Substance P antagonist）治療",
  "{{MOPP|名詞}}：Mechlorethamine、Vincristine（Oncovin）、Procarbazine、Prednisone → 治 {{Hodgkin's disease|疾病}}",
  "{{ABVD|名詞}}：Doxorubicin（Adriamycin）、Bleomycin、Vinblastine、Dacarbazine → 治 Hodgkin's disease",
  "{{CHOP|名詞}}：Cyclophosphamide、Doxorubicin（Hydroxydaunorubicin）、Oncovin、Prednisone → 治 {{Non-Hodgkin's lymphoma|疾病}}",
  "{{FAC|名詞}}：5-FU、Adriamycin、Cyclophosphamide → 治療{{乳癌|疾病}}"
]);
kA(2, "烷基化劑", 13, "烷基化劑總則", [
  "烷基化劑：主要作用在 DNA 的 {{Guanine 之 N-7|結構}} 號位，因此重點在於烷基化劑形成何種物質產生抗癌活性",
  "Nitrogen mustards：共同結構 {{Bis-β-chloroethylamines|結構}}，抗癌活性：形成 {{Aziridinium|名詞}}",
  "Nitrosoureas：抗癌活性：形成{{乙烯基（Vinyl cation）、碳陽離子（Carbonium ion）|名詞}}",
  "Ethylenimines：抗癌活性：形成 Aziridinium；Alkyl sulfonates：以{{丁基|結構}}和 DNA 產生鍵結",
  "Organoplatinum complex：以{{活性態|名詞}}的形式和 DNA 產生鍵結",
  "DNA methylators：Dacarbazine、Temozolomide 形成 {{CH3+|名詞}}；Procarbazine 形成 {{CH3·|名詞}}"
]);
dA(2, "Nitrogen mustards", 13, "mechlorethamine", "Mechlorethamine", null, {
  cls: ["烷基化劑：Nitrogen mustards"], struct: ["Bis-β-chloroethylamines"],
  feat: ["又叫 {{Chlormethine、Mustine|藥名}}", "形成 {{Aziridinium|名詞}}"] });
dA(2, "Nitrogen mustards", 13, "cyclophosphamide", "Cyclophosphamide", null, {
  cls: ["烷基化劑：Nitrogen mustards"], struct: ["Bis-β-chloroethylamines"],
  feat: ["為 Prodrug，經 {{CYP2B6|酵素}}（主要）/3A4 活化為 {{4-OHcyclophosphamide|物質}}", "代謝物 {{Acrolein|物質}} 會造成{{膀胱出血|副作用}} → 以 {{Mesna|藥名}} 治療", "用於抗癌、{{類風溼性關節炎|疾病}}"] });
dA(2, "Nitrogen mustards", 13, "ifosfamide", "Ifosfamide", null, {
  cls: ["烷基化劑：Nitrogen mustards"],
  feat: ["為 {{Cyclophosphamide|藥名}} 之異構物", "主要由 {{3A4|酵素}} 代謝"] });
dA(2, "Nitrogen mustards", 13, "melphalan", "Melphalan", null, {
  cls: ["烷基化劑：Nitrogen mustards"],
  feat: ["具 {{Aryl|結構}} 取代基，可口服使用", "具有 {{Phenylalanine|結構}}"] });
dA(2, "Nitrogen mustards", 13, "chlorambucil", "Chlorambucil", null, {
  cls: ["烷基化劑：Nitrogen mustards"], feat: ["可{{口服|給藥途徑}}使用"] });
dA(2, "Nitrosoureas", 13, "carmustine", "Carmustine（BCNU）", "Carmustine", {
  cls: ["烷基化劑：Nitrosoureas"],
  feat: ["以{{注射|給藥途徑}}給藥", "治療{{腦瘤|疾病}}（脂溶性高）"] });
dA(2, "Nitrosoureas", 13, "lomustine", "Lomustine（CCNU）", "Lomustine", {
  cls: ["烷基化劑：Nitrosoureas"],
  feat: ["可{{口服|給藥途徑}}給藥", "治療腦瘤（{{脂溶性高|性質}}）"] });
dA(2, "Ethylenimines", 13, "thiotepa", "Thiotepa", null, {
  cls: ["烷基化劑：{{Ethylenimines|藥物類別}}，形成 Aziridinium"],
  feat: ["造成 {{Interstrand cross linking|名詞}}"] });
dA(2, "Alkyl sulfonates", 13, "busulfan", "Busulfan", null, {
  cls: ["烷基化劑：{{Alkyl sulfonates|藥物類別}}"],
  feat: ["造成 Interstrand cross linking", "副作用：{{肺部纖維化|副作用}}"] });
dA(2, "Organoplatinum complex", 14, "cisplatin", "Cisplatin", null, {
  cls: ["烷基化劑：Organoplatinum complex"],
  feat: ["屬於 Prodrug，接上 {{Monoaqua 或 Diaqua|名詞}} 型態皆有活性", "大部分屬 Pt(II)，{{Satraplatin|藥名}} 之 Pt 為四價", "副作用：{{耳腎毒性|副作用}}", "可用生理食鹽水、Mannitol、{{Amifostine|藥名}}（細胞保護劑）降低毒性", "造成 {{Intra 及 Inter strand cross-linking|名詞}}"] });
dA(2, "Organoplatinum complex", 14, "carboplatin", "Carboplatin", null, {
  cls: ["烷基化劑：Organoplatinum complex"],
  struct: ["Cl 被 {{Cyclobutane dicarboxylate|結構}} 取代"], feat: ["治療{{卵巢癌|疾病}}"] });
dA(2, "Organoplatinum complex", 14, "oxaliplatin", "Oxaliplatin", null, {
  cls: ["烷基化劑：Organoplatinum complex"],
  struct: ["釋出 {{Oxalate anion|物質}} 後活化生成 Dihydrate diaminocyclohexane platinium 類似物"],
  feat: ["可治療{{結腸直腸癌|疾病}}"] });
dA(2, "DNA methylators", 14, "dacarbazine", "Dacarbazine", null, {
  cls: ["DNA methylators：形成 CH3+"],
  feat: ["在酸中產生中間產物：{{Diazonium ion|物質}}", "治療{{黑色瘤|疾病}}"] });
dA(2, "DNA methylators", 14, "temozolomide", "Temozolomide", null, {
  cls: ["DNA methylators：形成 CH3+"], struct: ["含有 {{Imidazotetrazine|結構}}"],
  feat: ["治療{{多形性神經膠母細胞瘤|疾病}}", "食物會{{減少|性質}}此藥物的吸收"] });
dA(2, "DNA methylators", 14, "procarbazine", "Procarbazine", null, {
  cls: ["DNA methylators：形成 {{CH3·|名詞}}"],
  feat: ["形成 CH3·、使 DNA 甲基化", "會造成 Guanine nucleotide 之 {{O6-methylation|名詞}}"] });
dA(2, "抗代謝藥物：葉酸拮抗", 15, "methotrexate", "Methotrexate（MTX）", "MTX", {
  cls: ["抑制 {{Dihydrofolate reductase|酵素}}；當 pH 越高，與酵素鍵結活性{{越小|性質}}"],
  struct: ["由 {{Pteridine + PABA + Glutamic acid|結構}} 組成"],
  feat: ["易在{{酸性|性質}}尿中產生尿結晶", "MTX 血中濃度過高時，應提高 {{Leucovorin|藥名}} 的劑量，以減少 MTX 的毒性", "治療{{類風溼性關節炎|疾病}}"] });
dA(2, "抗代謝藥物：Pyrimidine 類似物", 15, "fluorouracil", "Fluorouracil（5-FU）", "5-FU", {
  cls: ["與 {{Thymidylate synthetase|酵素}} 行不可逆抑制"],
  feat: ["活化為 {{5-FdUMP|物質}} 後，才有抗癌活性", "用於{{結腸及直腸癌|疾病}}", "與 {{Leucovorin|藥名}} 合併可以增強藥效"] });
dA(2, "抗代謝藥物：Pyrimidine 類似物", 15, "tegafur-capecitabine", "Tegafur、Capecitabine", "Capecitabine", {
  cls: ["與 Thymidylate synthetase 行不可逆抑制"],
  feat: ["為一種 {{prodrug|名詞}}，代謝後變為 {{5-FU|藥名}}", "Capecitabine 副作用為 {{Hand-foot syndrome|副作用}}"] });
dA(2, "抗代謝藥物：Pyrimidine 類似物", 15, "cytarabine", "Cytarabine（Ara-C）", "Cytarabine", {
  cls: ["{{DNA polymerase inhibitors|藥物類別}}"],
  feat: ["由 {{Deoxycytidine kinase|酵素}} 活化為三磷酸", "{{Cytidine deaminase|酵素}} 使 Ara-C 失效"] });
dA(2, "抗代謝藥物：Pyrimidine 類似物", 15, "gemcitabine", "Gemcitabine", null, {
  cls: ["DNA polymerase inhibitors"], feat: ["屬於 {{Pyrimidine|結構}} 類似物"] });
dA(2, "抗代謝藥物：Pyrimidine 類似物", 15, "decitabine-azacitidine", "Decitabine、Azacitidine", "Azacitidine", {
  cls: ["{{DNA methyltransferase inhibitors|藥物類別}}"],
  struct: ["含 {{Triazine|結構}}"],
  feat: ["在細胞中需活化為三磷酸，進入 DNA 鏈中抑制 DNA methyltransferase"] });
dA(2, "抗代謝藥物：Purine 類似物", 16, "mercaptopurine", "Mercaptopurine（6-MP）", "6-MP", {
  cls: ["抑制 {{5-phosphoribosylamine|物質}} 合成、抑制 Adenylic acid 的合成、抑制 Xanthylic acid 的合成；Purine 的合成與上述原料有關，因此可抑制 Purine 的形成"],
  feat: ["由 Hypoxanthine guanine phosphoribosyl transferase（{{HGPRT|酵素}}）生成 {{6-Thioinosinate|物質}}", "產生抗癌活性"] });
dA(2, "抗代謝藥物：Purine 類似物", 16, "thioguanine", "Thioguanine", null, {
  cls: ["同 6-MP：抑制 Purine 的形成"],
  feat: ["與 6-MP 相差一個{{胺基|結構}}", "機轉與 {{6-MP|藥名}} 相同"] });
dA(2, "抗代謝藥物：Purine 類似物", 16, "fludarabine", "Fludarabine（Ara-A+F）", "Fludarabine", {
  cls: ["抑制 {{DNA polymerase|酵素}}"],
  feat: ["活化為三磷酸，結合至 DNA 鏈中以抑制 DNA polymerase", "結構多出 {{F|結構}} 原子取代，減少被 {{Adenosine deaminase|酵素}} 破壞"] });
dA(2, "抗代謝藥物：Purine 類似物", 16, "nelarabine", "Nelarabine", null, {
  cls: ["DNA methyltransferase inhibitors"],
  feat: ["為 {{Purine|結構}} 類似物，機轉為 DNA methyltransferase inhibitors"] });
dA(2, "抗代謝藥物：其他", 16, "pentostatin", "Pentostatin", null, {
  cls: ["抑制 {{Adenosine deaminase|酵素}}"], struct: ["骨架：{{Tetrahydrodiazepine|結構}}"] });
dA(2, "抗代謝藥物：其他", 16, "hydroxyurea", "Hydroxyurea", null, {
  cls: ["抑制 {{Ribonucleotide reductase|酵素}}"],
  feat: ["治療：{{鐮刀型貧血|疾病}}患者、{{CML|疾病}}"] });
dA(2, "抗腫瘤抗生素", 17, "dactinomycin", "Dactinomycin（Actinomycin D）", "Dactinomycin", {
  cls: ["以 {{Phenoxazone|結構}} 嵌入 DNA，導致 {{Topoisomerase II|酵素}} 作用受阻"],
  feat: ["分子內具有兩個 {{Cyclic pentapeptide|結構}}", "治療 {{Wilms' tumor、睪丸癌|疾病}}", "不會與金屬離子產生螯合"] });
dA(2, "抗腫瘤抗生素", 17, "doxorubicin", "Doxorubicin 家族（小紅莓）", "Doxorubicin", {
  cls: ["含有 {{Anthraquinone|結構}} 嵌入 DNA，導致 Topoisomerase II 作用受阻", "形成 Superoxide radical anion，進而產生 {{Hydroxy radical|物質}}，引起 DNA 的破壞"],
  struct: ["屬於 {{Anthracyclinone O-glycosides|結構}}", "含有 {{L-Daunosamine|結構}}", "C-7 連結糖基是 {{α|結構}} 位向", "Doxorubicin：R1 OCH3、R4 OH；Daunorubicin：R1 OCH3、R4 H；{{Idarubicin|藥名}}：R1 H；Epirubicin：R2 OH、R3 H"],
  feat: ["Doxorubicin 又稱 {{Adriamycin|藥名}}", "Fe2+ 在 Anthracylinone 之 OH 及 =O 間被螯合", "具有光敏感性，因{{酚基|結構}}所引起", "副作用：{{心毒性、紅色尿液|副作用}}", "{{Dexrazoxane|藥名}} 可預防 anthracycline 類藥品的心毒性", "Doxorubicin 行還原反應形成活性代謝物 {{Doxorubicinol|物質}}"] });
dA(2, "抗腫瘤抗生素", 17, "mitoxantrone", "Mitoxantrone", null, {
  cls: ["嵌入 DNA，導致 Topoisomerase II 作用受阻"],
  struct: ["具有 {{Anthraquinone|結構}} 結構"],
  feat: ["不具有糖基、{{不會有心臟毒性|性質}}", "產生{{藍綠色|性質}}尿液"] });
dA(2, "抗腫瘤抗生素", 18, "plicamycin", "Plicamycin", null, {
  cls: ["阻斷 {{DNA-dependent RNA polymerase|酵素}}"],
  feat: ["可以螯合金屬，治療{{高血鈣|疾病}}"] });
dA(2, "抗腫瘤抗生素", 18, "mitomycin", "Mitomycin", null, {
  cls: ["主要{{烷基化 DNA|名詞}}，次要為嵌入 DNA"],
  struct: ["含有：{{Aziridine、Benzoquinone、Carbamate|結構}}"],
  feat: ["{{還原|名詞}}反應生成 Hydroquinone 才有抗癌活性"] });
dA(2, "抗腫瘤抗生素", 18, "bleomycin", "Bleomycin", null, {
  cls: ["Pyrimidine、Imidazole、Amine 與 {{Fe2+|物質}} 螯合後，產生超氧化物及自由基，引起{{磷酸雙脂鍵|結構}}的斷裂"],
  struct: ["骨架：具有 {{Glycopeptide|結構}}，是一種配糖體", "分子上的 {{Bithiazole|結構}} 也會嵌入到 DNA 中"],
  feat: ["影響 {{G2→M|名詞}} phase", "天然的產物為{{藍色的銅|性質}}螯合物", "可與二價金屬離子螯合，進到人體內會與腫瘤細胞的 Fe2+ 螯合", "抗藥性：癌細胞生成 {{Bleomycin hydrolase|酵素}}", "副作用：{{肺部纖維化|副作用}}、骨髓抑制作用小"],
  notes: ["引起肺部纖維化：{{Amiodarone、Busulfan|藥名}}"] });
dA(2, "抑制有絲分裂藥物", 19, "paclitaxel", "Paclitaxel", null, {
  cls: ["Taxanes：抑制有絲分裂，{{促進|性質}}微管的裝配"],
  feat: ["治療{{乳癌、卵巢癌|疾病}}", "主要代謝 {{CYP2C8|酵素}} 產生 6α-OHpaclitaxel；3A4 代謝生成 3'OHpaclitaxel、2OHpaclitaxel", "僅能以注射給予，以 {{castor oil|物質}} 為助溶劑"] });
dA(2, "抑制有絲分裂藥物", 19, "docetaxel", "Docetaxel", null, {
  cls: ["Taxanes：抑制有絲分裂，促進微管的裝配"],
  feat: ["從 Paclitaxel 之結構修飾目的：{{增加水溶性|性質}}", "經 CYP3A4 氧化後形成 Hydroxydocetaxel（在 {{t-butoxy|結構}} 的位置）", "以 {{Polysorbate（Tween）80|物質}} 助溶"] });
dA(2, "抑制有絲分裂藥物", 19, "cabazitaxel", "Cabazitaxel", null, {
  cls: ["Taxanes：抑制有絲分裂，促進微管的裝配"],
  feat: ["代謝：C7、C10 O 去甲基形成 {{Docetaxel|藥名}}"] });
dA(2, "抑制有絲分裂藥物", 19, "vinblastine", "Vinblastine", null, {
  cls: ["Vinca Alkaloids（長春花生物鹼）：抑制有絲分裂，{{破壞|性質}}微管的裝配及紡錘體的形成"],
  struct: ["R={{CH3|結構}}"],
  feat: ["治療 {{Hodgkin's disease|疾病}} 最有效單一製劑", "副作用：{{骨髓抑制|副作用}}"] });
dA(2, "抑制有絲分裂藥物", 19, "vincristine", "Vincristine", null, {
  cls: ["Vinca Alkaloids：抑制有絲分裂，破壞微管的裝配及紡錘體的形成"],
  struct: ["R={{CHO|結構}}"],
  feat: ["又稱 {{Oncovin|藥名}}", "治療{{急性白血病|疾病}}", "副作用：{{周邊神經毒性|副作用}}、噁心嘔吐作用小"] });
dA(2, "抑制有絲分裂藥物", 19, "ixabepilone", "Ixabepilone", null, {
  cls: ["Epothilone：類似 {{Taxanes|藥物類別}} 的抗癌機轉"],
  struct: ["含 {{Thiazole、Lactam、Epoxide|結構}}"],
  feat: ["Epothilone 是{{土壤中細菌|名詞}}的代謝物", "Ixabepilone 是透過 Epothilone 半合成而得"] });
dA(2, "抑制有絲分裂藥物", 19, "eribulin", "Eribulin", null, {
  cls: ["Halichondrins：藉由與 {{β-tubulin|標的}} 結合而抑制微管的生長"],
  feat: ["源自於{{海綿|名詞}} Halichondrin B", "含有巨內酯環，代謝：原形糞便排除", "用於治療{{乳癌|疾病}}"] });
dA(2, "抑制有絲分裂藥物", 19, "estramustine", "Estramustine", null, {
  cls: ["其他類：抑制細胞有絲分裂"],
  struct: ["Estra 為{{雌性素|結構}}骨架，Mustine 可找到 Bis-β-chloroethylamines"],
  feat: ["治療：{{攝護腺癌|疾病}}"] });
dA(2, "Topoisomerase Poisons", 20, "etoposide-teniposide", "Etoposide、Teniposide", "Etoposide", {
  cls: ["Podophyllotoxin：抑制 {{Topoisomerase II|酵素}}"],
  struct: ["Etoposide R=CH3；Teniposide R={{Thiophene|結構}}", "結構{{不含 N|性質}}"],
  feat: ["{{Podophyllotoxin|物質}} 之半合成衍生物", "原本 Podophyllotoxin 在環上 1,4 位取代為順式，此類藥物將 1,4 位取代改為{{反式|結構}}", "兩者副作用：{{腹瀉|副作用}}"] });
dA(2, "Topoisomerase Poisons", 20, "topotecan", "Topotecan", null, {
  cls: ["喜樹鹼類：抑制 {{Topoisomerase I|酵素}}"],
  struct: ["為 {{Camptothecin|物質}} 半合成類似物", "結構含有：{{Lactam、Lactone、Quinoline|結構}}", "在 9 號位增加鹼性基團，10 號位加上 OH 基增加溶解度"],
  feat: ["副作用：腹瀉", "用於治療{{卵巢癌|疾病}}"] });
dA(2, "Topoisomerase Poisons", 20, "irinotecan", "Irinotecan", null, {
  cls: ["喜樹鹼類：抑制 Topoisomerase I"],
  struct: ["10 號位有{{酯基|結構}}水解後形成活性代謝物", "具有 {{Piperidine|結構}} 環"],
  feat: ["用於治療{{大腸直腸癌|疾病}}"] });
dA(2, "新藥", 21, "trabectedin", "Trabectedin", null, {
  cls: ["烷基化 Guanine 之 {{N-2|結構}} 號位"],
  feat: ["可作用在 {{G2-M|名詞}} 期", "代謝物皆由{{糞便|名詞}}排除", "副作用：骨髓抑制、腸胃道障礙"] });
dA(2, "新藥", 21, "inotuzumab-ozogamicin", "Inotuzumab Ozogamicin Conjugate", "Inotuzumab", {
  cls: ["利用{{單株抗體連結藥物|名詞}}，釋出活性藥後可破壞癌細胞 DNA"],
  feat: ["以 IV 給藥", "於酸中水解生成活性藥 {{Calicheamicin|物質}}", "Ozogamicin 為 {{P-gp|標的}} 受質，對有 P-gp 的癌細胞無效"] });
dA(2, "新藥", 21, "lenalidomide", "Lenalidomide", null, {
  cls: ["{{免疫調控劑|藥物類別}}（孕婦應避免使用）"],
  feat: ["可使幹細胞增生，治療{{骨髓瘤|疾病}}", "副作用：{{末梢神經炎、靜脈血栓|副作用}}"] });
dA(2, "新藥", 21, "pomalidomide", "Pomalidomide", null, {
  cls: ["免疫調控劑（孕婦應避免使用）"],
  feat: ["{{最強效|性質}}的免疫調控劑", "主要由{{尿液|名詞}}排出"] });
dA(2, "組織蛋白去乙醯酶抑制劑", 21, "romidepsin", "Romidepsin", null, {
  cls: ["組織蛋白去乙醯酶抑制劑：使癌細胞中的抗致癌基因 {{p21|標的}} 增加，誘導細胞停止生長"],
  struct: ["為含有{{巨內酯環|結構}}的前驅藥"],
  feat: ["用於治療{{淋巴瘤|疾病}}", "副作用：骨髓抑制、{{QT 延長|副作用}}"] });
dA(2, "組織蛋白去乙醯酶抑制劑", 21, "belinostat", "Belinostat", null, {
  cls: ["組織蛋白去乙醯酶抑制劑"],
  struct: ["結構含有 {{Hydroxamic acid（-NHOH）|結構}}"], feat: ["治療淋巴瘤"] });
dA(2, "組織蛋白去乙醯酶抑制劑", 21, "vorinostat", "Vorinostat", null, {
  cls: ["組織蛋白去乙醯酶抑制劑"],
  struct: ["結構含有 Hydroxamic acid（-NHOH）"],
  feat: ["代謝：經水解及 {{β-氧化|名詞}} 形成 4-anilino-4-oxobutanoic acid"] });
dA(2, "組織蛋白去乙醯酶抑制劑", 21, "panobinostat", "Panobinostat Lactate", "Panobinostat", {
  cls: ["組織蛋白去乙醯酶抑制劑"],
  struct: ["結構含有 Hydroxamic acid（-NHOH）"], feat: ["代謝物皆{{無活性|性質}}"] });
kA(2, "癌症治療用藥整理", 22, "非小細胞肺癌治療用藥", { table: { head: ["藥理分類", "藥名"], rows: [
  ["Organoplatinum complex", "{{Cisplatin、Carboplatin|藥名}}"],
  ["Taxanes", "{{Docetaxel、Paclitaxel|藥名}}"],
  ["{{EGFR Tyrosine Kinase inhibitor|藥物類別}}", "Gefitinib、Erlotinib、Lapatinib"] ] } });
kA(2, "癌症治療用藥整理", 22, "白血病類型與治療藥物", { table: { head: ["白血病類型", "治療藥物"], rows: [
  ["急性骨髓性白血病（{{AML|疾病}}）\nAcute myelogenous leukemia", "Anthracycline + {{Cytarabine|藥名}}"],
  ["慢性骨髓性白血病（{{CML|疾病}}）\nChronic myelogenous leukemia", "{{Imatinib、Nilotinib、Dasatinib|藥名}}"],
  ["急性淋巴性白血病（{{ALL|疾病}}）\nAcute lymphoblastic leukemia", "{{L-Asparaginase|藥名}} + Vincristine + Epirubicin + Prednisolone"],
  ["慢性淋巴性白血病（{{CLL|疾病}}）\nChronic lymphoblastic leukemia", "Cyclophosphamide + Fludarabine + Rituximab（{{CFR|名詞}}）\nCyclophosphamide + Oncovine + Prednisolone（{{COP|名詞}}）"] ] } });
kA(2, "癌症治療用藥整理", 23, "卵巢癌治療用藥", { table: { head: [{ t: "卵巢癌治療用藥", cs: 2 }], cols: ["", "藥物"], rows: [
  [{ t: "首選用藥", b: true }, "{{Carboplatin + Paclitaxel|藥名}}"],
  [{ t: "復發（Platinum resistant）", b: true }, "{{Liposomal doxorubicin、Topotecan、Altretamine|藥名}}"] ] } });
kA(2, "癌症治療用藥整理", 23, "造成 Alkylating agent cyclophosphamide 抗藥性的原因", { table: { head: ["造成 Alkylating agent cyclophosphamide 抗藥性的原因"], rowNames: false, rows: [
  ["1. 癌細胞之 {{glutathione|物質}} 含量增加"],
  ["2. 癌細胞之 {{glutathione S-transferase|酵素}} 活性提高"],
  ["3. 癌細胞之 {{DNA 修復酵素|酵素}}活性增加"],
  ["4. 癌細胞之輸送藥物進入細胞的{{運輸蛋白|名詞}}表現量降低"] ] } });

/* ===== 第 3 章 標靶藥物 ===== */
chA(3, "03", "標靶藥物", "24～27");
kA(3, "標靶藥物作用圖", 24, "Receptor Tyrosine Kinases 與標靶藥物", [
  "VEGF ⊖ {{Bevacizumab|藥名}}：治大腸癌、腎細胞癌",
  "VEGFR 之 Tyr P ⊖ {{Sorafenib、Sunitinib、Pazopanib|藥名}}：治{{腎細胞癌|疾病}}",
  "HER-2 ⊖ {{Trastuzumab|藥名}}：治乳癌；HER-2/EGFR 之 Tyr P ⊖ {{Lapatinib|藥名}}：治乳癌",
  "EGFR ⊖ {{Panitumumab、Cetuximab|藥名}}：治{{大腸癌|疾病}}",
  "EGFR 之 P Tyr ⊖ {{Erlotinib、Geftinib|藥名}}：治 {{NSCLC|疾病}}（非小細胞肺癌）",
  "BCR-ABL（易位 Translocation、融合）⊖ {{Imatinib、Nilotinib、Dasatinib|藥名}}：治{{白血病|疾病}}",
  "Raf ⊖ {{Vemurafenib、Dabrafenib|藥名}}；MEK ⊖ {{Trametinib、Cobimetinib|藥名}}（K-Ras → Raf → MEK → ERK）",
  "PI3k ⊖ {{Idelalisib|藥名}}；mTOR ⊖ {{Sirolimus、Everolimus|藥名}}（PI3k → AKT → mTOR）",
  "VEGFR = Vascular Endothelial Growth Factor Receptor；EGFR = Epidermal Growth Factor Receptor；PDGFR = {{Platelet-Derived Growth Factor Receptor|名詞}}"
]);
/* 第 25 頁 單株抗體總整理：一列一格 */
dA(3, "單株抗體", 25, "mab-vegf", "Bevacizumab（VEGF）", "Bevacizumab", {
  cls: ["作用標的：{{VEGF|標的}}"],
  feat: ["適應症：{{大腸癌|疾病}}、腎臟癌、視網膜黃斑部病變", "副作用：{{高血壓、胃腸穿孔、血栓|副作用}}"],
  notes: ["罹患大腸癌的病患會先檢測 {{K-RAS|名詞}} 基因，若 K-RAS 基因突變則需使用 Bevacizumab"] });
dA(3, "單株抗體", 25, "mab-egfr", "Panitumumab、Cetuximab（EGFR）", "Cetuximab", {
  cls: ["作用標的：{{EGFR|標的}}"], feat: ["適應症：{{大腸癌|疾病}}"] });
dA(3, "單株抗體", 25, "mab-her2", "Trastuzumab、Pertuzumab（HER2）", "Trastuzumab", {
  cls: ["作用標的：{{HER2|標的}}"],
  feat: ["Pertuzumab 可與 Trastuzumab 併用治療{{乳癌|疾病}}", "副作用：{{心毒性|副作用}}"] });
dA(3, "單株抗體", 25, "mab-cd20", "Rituximab（CD20）", "Rituximab", {
  cls: ["作用標的：結合在 {{B-cell 上的 CD20|標的}}"],
  feat: ["適應症：{{B-cell non-Hodgkin's lymphoma|疾病}}"] });
dA(3, "單株抗體", 25, "mab-cd33", "Gemtuzumab（CD33）", "Gemtuzumab", {
  cls: ["作用標的：{{CD33|標的}}"], feat: ["適應症：急性骨髓性白血病（{{AML|疾病}}）"] });
dA(3, "單株抗體", 25, "mab-cd38", "Daratumumab（CD38）", "Daratumumab", {
  cls: ["作用標的：{{CD38|標的}}"], feat: ["適應症：{{多發性骨髓瘤|疾病}}"] });
dA(3, "單株抗體", 25, "mab-cd52", "Alemtuzumab（CD52）", "Alemtuzumab", {
  cls: ["作用標的：{{CD52|標的}}"],
  feat: ["適應症：{{多發性硬化症|疾病}}、慢性淋巴性白血病（CLL）", "副作用：增加{{黑色素瘤|疾病}}風險"] });
/* 第 26 頁 Tyrosine kinase inhibitors 統整、Ser/Thr Kinase inhibitors 統整 */
dA(3, "Tyrosine kinase inhibitors", 26, "tki-bcrabl", "Bcr-Abl 抑制劑（Imatinib…）", "Imatinib", {
  cls: ["作用標的：{{Bcr-Abl|標的}}"],
  feat: ["藥名：Imatinib、Nilotinib、Dasatinib、Bosutinib、Ponatinib、{{Omacetaxine|藥名}}（蛋白質合成抑制劑）", "適應症：慢性骨髓性白血病（{{CML|疾病}}）"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-vegfr", "VEGFR 抑制劑（Sorafenib…）", "Sorafenib", {
  cls: ["作用標的：{{VEGFR|標的}}"],
  feat: ["藥名：Axitinib、Sorafenib、Sunitinib、Lenvatinib、Pazopanib、Cabozantinib、Regorafenib", "適應症：{{腎細胞癌|疾病}}"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-her2", "HER2 抑制劑（Lapatinib…）", "Lapatinib", {
  cls: ["作用標的：{{HER2|標的}}"], feat: ["藥名：{{Neratinib、Afatinib、Lapatinib|藥名}}"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-egfr", "EGFR 抑制劑（Gefitinib…）", "Gefitinib", {
  cls: ["作用標的：{{EGFR|標的}}"],
  feat: ["藥名：Erlotinib、Gefitinib、Afatinib、Lapatinib、Osimertinib、Neratinib、Vandetanib", "適應症：{{非小細胞肺癌|疾病}}"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-alk", "ALK 抑制劑（Crizotinib…）", "Crizotinib", {
  cls: ["作用標的：Anaplastic lymphoma kinase（{{ALK|標的}}）"],
  feat: ["藥名：Alectinib、Brigatinib、Crizotinib、Ceritinib", "適應症：{{非小細胞肺癌|疾病}}"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-btk", "BTK 抑制劑（Ibrutinib…）", "Ibrutinib", {
  cls: ["作用標的：Bruton tyrosine kinase（{{BTK|標的}}）"],
  feat: ["藥名：Ibrutinib、Acalabrutinib", "適應症：與 {{B-細胞|名詞}}相關的血癌"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-flt3", "Midostaurin（FLT3）", "Midostaurin", {
  cls: ["作用標的：{{FLT3|標的}}"], feat: ["適應症：{{急性骨髓性白血病|疾病}}"] });
dA(3, "Tyrosine kinase inhibitors", 26, "tki-jak", "Ruxolitinib（JAK）", "Ruxolitinib", {
  cls: ["作用標的：{{JAK|標的}}"], feat: ["適應症：{{紅血球增多症、骨髓纖維化|疾病}}"] });
dA(3, "Ser/Thr Kinase inhibitors", 26, "sti-cdk", "CDK 抑制劑（Palbociclib…）", "Palbociclib", {
  cls: ["作用標的：Cyclin-Dependent Kinase（{{CDK|標的}}）"],
  feat: ["藥名：Palbociclib、Abemaciclib、Ribociclib（字尾 {{-ciclib|名詞}}）", "適應症：{{乳癌|疾病}}"] });
dA(3, "Ser/Thr Kinase inhibitors", 26, "sti-braf", "BRAF 抑制劑（Vemurafenib…）", "Vemurafenib", {
  cls: ["作用標的：B-rapidly accelerate fibrosarcoma（{{BRAF|標的}}）"],
  feat: ["藥名：Vemurafenib、Dabrafenib", "適應症：{{轉移性黑色素瘤|疾病}}"] });
dA(3, "Ser/Thr Kinase inhibitors", 26, "sti-mek", "MEK 抑制劑（Trametinib…）", "Trametinib", {
  cls: ["作用標的：{{MEK|標的}}"],
  feat: ["藥名：Trametinib、Cobimetinib", "{{Trametinib 與 Dabrafenib|藥名}} 併用可避免抗藥性"] });
dA(3, "Ser/Thr Kinase inhibitors", 26, "sti-mtor", "mTOR 抑制劑（Everolimus…）", "Everolimus", {
  cls: ["作用標的：{{mTOR|標的}}"],
  feat: ["藥名：Everolimus、Temsirolimus", "適應症：{{晚期腎細胞癌|疾病}}"] });
dA(3, "Ser/Thr Kinase inhibitors", 26, "sti-pi3k", "PI3K 抑制劑（Idelalisib…）", "Idelalisib", {
  cls: ["作用標的：Phosphatidylinositol 3 kinase（{{PI3K|標的}}）"],
  feat: ["藥名：Idelalisib、Copanlisib", "適應症：{{淋巴瘤|疾病}}"] });
dA(3, "非激酶標的酵素／蛋白抑制劑", 27, "nk-idh", "IDH 抑制劑（Ivosidenib、Enasidenib）", "Ivosidenib", {
  cls: ["作用標的：Isocitrate dehydrogenase（{{IDH|標的}}）：IDH-1 → {{Ivosidenib|藥名}}；IDH-2 → Enasidenib"],
  feat: ["適應症：{{急性骨髓性白血病|疾病}}"] });
dA(3, "非激酶標的酵素／蛋白抑制劑", 27, "nk-bcl2", "Venetoclax（BCL-2）", "Venetoclax", {
  cls: ["作用標的：B-cell lymphoma-2（{{BCL-2|標的}}）"], feat: ["適應症：{{慢性淋巴性白血病|疾病}}"] });
dA(3, "非激酶標的酵素／蛋白抑制劑", 27, "nk-parp", "PARP 抑制劑（Olaparib…）", "Olaparib", {
  cls: ["作用標的：Poly(ADP-ribose)polymerase（{{PARP|標的}}）"],
  feat: ["藥名：Olaparib、Rucaparib、Niraparib", "適應症：{{晚期卵巢癌|疾病}}"] });
dA(3, "非激酶標的酵素／蛋白抑制劑", 27, "nk-proteasome", "Proteasome 抑制劑（Bortezomib…）", "Bortezomib", {
  cls: ["作用標的：{{Proteasomes（26S）|標的}}"],
  feat: ["藥名：Bortezomib、Carfilzomib、Ixazomib、Oprozomib、Marizomib（字尾 {{-zomib|名詞}}）", "適應症：{{多發性骨髓瘤|疾病}}"] });
dA(3, "免疫檢查點抑制劑", 27, "ici-ctla4", "CTLA-4 抑制劑（Ipilimumab…）", "Ipilimumab", {
  cls: ["作用標的：作用在 T-cell 上的 {{CTLA-4|標的}}"],
  feat: ["藥名：Ipilimumab、Tremelimumab", "適應症：{{轉移性黑色素瘤|疾病}}"] });
dA(3, "免疫檢查點抑制劑", 27, "ici-pd1", "PD-1 抑制劑（Pembrolizumab…）", "Pembrolizumab", {
  cls: ["作用標的：作用在 T-cell 上的 programmed death receptor（{{PD-1|標的}}）"],
  feat: ["藥名：Pembrolizumab、Nivolumab", "適應症：黑色素瘤、{{非小細胞肺癌|疾病}}"] });
dA(3, "免疫檢查點抑制劑", 27, "ici-pdl1", "PD-L1 抑制劑（Atezolizumab…）", "Atezolizumab", {
  cls: ["作用標的：與腫瘤細胞上的 PD ligand-1（{{PD-L1|標的}}）結合"],
  feat: ["藥名：Atezolizumab、Avelumab、Durvalumab", "適應症：{{膀胱癌|疾病}}、非小細胞肺癌"] });

/* ===== 第 4 章 免疫藥理學 ===== */
chA(4, "04", "免疫藥理學", "28～29");
kA(4, "免疫抑制劑作用圖", 28, "T cell 活化與免疫抑制劑作用點", [
  "{{Abatacept|藥名}}：抑制 APC 對 T cell 的刺激",
  "Calcineurin inhibitors：{{Tacrolimus|藥名}} + FKBP、{{Cyclosporine|藥名}} + Cyclophilin → ⊖ Calcineurin → NFATc-P（inactive）無法變成 NFATc（active）→ IL-2 gene 無法轉錄",
  "IL-2 receptor antagonists：{{Daclizumab、Basiliximab|藥名}}",
  "mTOR inhibitors：{{Sirolimus、Everolimus|藥名}} + FKBP",
  "抑制 Purine 合成：{{Azathioprine、Mycophenolate|藥名}}；抑制 Pyrimidine 合成：{{Leflunomide|藥名}}",
  "IL-2 = Interleukin-2；NFATc = {{Nuclear Factor of Activated T cells|名詞}}；mTOR = mammalian Target of Rapamycin"
]);
dA(4, "Calcineurin inhibitors", 28, "cyclosporine", "Cyclosporine", null, {
  cls: ["Calcineurin inhibitors"],
  feat: ["作用點：與 {{Cyclophilin|標的}} 結合，抑制 Calcineurin", "副作用：{{腎毒性|副作用}}、牙齦增生、高血鉀、高血壓"],
  notes: ["使用免疫抑制劑後，會抑制 T 細胞合成 {{IL-2|物質}}，也會影響 IL-3，IFN-γ 的基因轉錄"] });
dA(4, "Calcineurin inhibitors", 28, "tacrolimus", "Tacrolimus", null, {
  cls: ["Calcineurin inhibitors"],
  feat: ["作用點：與 {{FK-binding protein|標的}} 結合，抑制 Calcineurin", "副作用：{{腎毒性|副作用}}"] });
dA(4, "mTOR inhibitors", 28, "sirolimus-everolimus", "Sirolimus、Everolimus", "Sirolimus", {
  cls: ["{{mTOR inhibitors|藥物類別}}"],
  feat: ["作用點：與 FK-binding protein 結合，抑制 {{mTOR|標的}}", "副作用：{{骨髓抑制、血小板缺乏症、高血脂|副作用}}"] });
dA(4, "IL-2 receptor antagonists", 28, "basiliximab-daclizumab", "Basiliximab、Daclizumab", "Basiliximab", {
  cls: ["IL-2 receptor antagonists"],
  feat: ["作用點：抑制 IL-2 receptor／抑制 T 細胞表面之 {{CD25|標的}}"] });
/* 同一個藥在後面的頁又出現時，補進原本那一格：mA(id, 頁, {欄位: [...]}) */
function mA(id, page, f) {
  const u = PI.UNITS.find(x => x.id === id);
  Object.keys(f).forEach(k => { u[k] = (u[k] || []).concat(f[k]); });
  if (!u.source.includes("第 " + page + " 頁")) u.source += "、第 " + page + " 頁";
}
mA("cyclosporine", 29, {
  feat: ["{{CYP3A4|酵素}} 受質", "用於{{器官移植|名詞}}後的抗排斥藥物"],
  struct: ["屬於{{脂溶性|性質}}的 peptide"] });
mA("tacrolimus", 29, { notes: ["又稱 {{FK506|藥名}}"] });
mA("sirolimus-everolimus", 29, { notes: ["Sirolimus 又稱 {{Rapamycin|藥名}}"] });
dA(4, "抑制 Purine 合成", 29, "mycophenolate-mofetil", "Mycophenolate Mofetil", "Mycophenolate", {
  cls: ["抑制 Purine 合成：抑制 Inosine monophosphate dehydrogenase（{{IMPDH|酵素}}），進一步抑制 T 和 B 淋巴球的增生"],
  feat: ["適應症：器官移植後的抗排斥藥、{{紅斑性狼瘡|疾病}}引起的腎臟疾病"] });
dA(4, "抑制 Purine 合成", 29, "azathioprine", "Azathioprine", null, {
  cls: ["抑制 Purine 合成"],
  feat: ["是一種 Prodrug，{{6-MP|藥名}} 為活性代謝物", "可治療{{類風溼性關節炎|疾病}}"] });
dA(4, "抑制 Pyrimidine 合成", 29, "leflunomide", "Leflunomide", null, {
  cls: ["抑制 {{Pyrimidine|結構}} 的合成；抑制 {{Dihydroorotate dehydrogenase|酵素}}（第 30 頁）"],
  struct: ["結構含 {{Isoxazole|結構}}"],
  feat: ["Leflunomide 為 Prodrug，{{Teriflunomide|物質}}（A77-1726）為活性代謝物"] });
dA(4, "抑制血管新生", 29, "thalidomide", "Thalidomide", null, {
  cls: ["抑制{{血管新生|名詞}}"],
  feat: ["副作用：造成{{胎兒畸形|副作用}}，增加{{靜脈栓塞|副作用}}之危險性"] });

/* ===== 第 4-1 章 免疫抑制劑 ===== */
chA(104, "04-1", "免疫抑制劑", "30～31");
kA(104, "免疫抑制劑總整理", 30, "機轉", { table: { head: [{ t: "機轉", cs: 1 }], cols: ["機轉"], rowNames: false, rows: [
  ["免疫力並非越強越好，假如因為免疫力過於旺盛而產生疾病，就必須透過免疫抑制劑藥物降低免疫力"],
  ["治療類風溼性關節炎（RA）之免疫抑制劑稱為 Disease modifying antirheumatic drugs（{{DMARDs|名詞}}）"] ] } });
kA(104, "免疫抑制劑總整理", 30, "免疫抑制劑總整理", { table: {
  head: [{ t: "作用標的", cs: 3 }, "藥物", "藥理特色及副作用"],
  cols: ["", "", "作用標的", "藥物", "藥理特色及副作用"],
  rowNames: ["抑制 Purine 合成", "抑制 Pyrimidine 合成", "破壞 DNA", "抑制 Calcineurin", "mTOR 抑制劑", "抑制 Cytokine 與 TNF-α", "TNF fusion protein", "TNF-α 抑制劑", "IL-1 抑制劑", "IL-6 抑制劑", "JAK 抑制劑", "其他類"],
  rows: [
    [{ t: "抗癌藥", b: true, rs: 3 }, { t: "抑制 Purine 合成", cs: 2 }, "Methotrexate、Azathioprine、{{Mycophenolate|藥名}}", { t: "Leflunomide：抑制 {{Dihydroorotate dehydrogenase|酵素}}\nMycophenolate：抑制 {{IMP Dehydrogenase|酵素}}", rs: 3 }],
    [null, { t: "抑制 Pyrimidine 合成", cs: 2 }, "{{Leflunomide|藥名}}", null],
    [null, { t: "破壞 DNA", cs: 2 }, "{{Cyclophosphamide|藥名}}", null],
    [{ t: "免疫抑制劑", b: true, rs: 2 }, { t: "抑制 Calcineurin", cs: 2 }, "{{Tacrolimus、Cyclosporine|藥名}}", { t: "常作為免疫抑制劑", rs: 2 }],
    [null, { t: "mTOR 抑制劑", cs: 2 }, "{{Sirolimus、Everolimus|藥名}}", null],
    [{ t: "Cytokine\n（治療類風溼性關節炎）", b: true, rs: 5 }, { t: "抑制 Cytokine 與 TNF-α", cs: 2 }, "Sulfasalazine、Hydroxychloroquine", "Hydroxychloroquine 具{{眼毒性|副作用}}"],
    [null, { t: "TNF-α 抑制劑", rs: 2 }, "TNF fusion protein", "{{Etanercept|藥名}}", { t: "Infliximab 以 {{IV|給藥途徑}} 給藥\n{{Certolizumab|藥名}} 會加入 {{PEG|物質}} 降低免疫反應", rs: 2 }],
    [null, null, "TNF-α 抑制劑", "Adalimumab（IgG）、Infliximab（IgG）、Golimumab、Certolizumab", null],
    [null, { t: "IL-1 抑制劑", cs: 2 }, "{{Anakinra|藥名}}", "治療類風溼性關節炎"],
    [null, { t: "IL-6 抑制劑", cs: 2 }, "{{Tocilizumab、Siltuximab|藥名}}", "治療類風溼性關節炎"],
    [{ t: "JAK 抑制劑", b: true }, { t: "抑制發炎反應", cs: 2 }, "{{Tofacitinib|藥名}}", "以{{口服|給藥途徑}}給藥\n治療 RA、乾癬、抗排斥用藥"],
    [{ t: "其他類", b: true }, { t: "可以減輕發炎反應，減少類風濕性因子", cs: 2 }, "Gold salts（金製劑）", "口服給藥：{{Auranofin|藥名}}\n{{單價|性質}}金離子較三價金離子有效，與{{硫|結構}}結合才有活性\n金在水溶液中不安定，半衰期短\n副作用：{{蛋白尿（腎毒性）|副作用}}、白血球、血小板減少"]
  ] } });
dA(104, "Cytokine：治療類風溼性關節炎", 30, "sulfasalazine-hcq", "Sulfasalazine、Hydroxychloroquine", "HCQ", {
  cls: ["抑制 {{Cytokine 與 TNF-α|標的}}"], feat: ["Hydroxychloroquine 具{{眼毒性|副作用}}"] });
dA(104, "Cytokine：治療類風溼性關節炎", 30, "etanercept", "Etanercept", null, {
  cls: ["TNF-α 抑制劑：{{TNF fusion protein|名詞}}"] });
dA(104, "Cytokine：治療類風溼性關節炎", 30, "tnf-mab", "Adalimumab、Infliximab、Golimumab、Certolizumab", "Infliximab", {
  cls: ["{{TNF-α 抑制劑|藥物類別}}（Adalimumab、Infliximab 為 IgG）"],
  feat: ["Infliximab 以 {{IV|給藥途徑}} 給藥", "{{Certolizumab|藥名}} 會加入 {{PEG|物質}} 降低免疫反應"] });
dA(104, "Cytokine：治療類風溼性關節炎", 30, "anakinra", "Anakinra", null, {
  cls: ["{{IL-1|標的}} 抑制劑"], feat: ["治療類風溼性關節炎"] });
dA(104, "Cytokine：治療類風溼性關節炎", 30, "tocilizumab", "Tocilizumab、Siltuximab", "Tocilizumab", {
  cls: ["{{IL-6|標的}} 抑制劑"], feat: ["治療類風溼性關節炎"] });
dA(104, "JAK 抑制劑", 30, "tofacitinib", "Tofacitinib", null, {
  cls: ["{{JAK|標的}} 抑制劑：抑制發炎反應"],
  feat: ["以{{口服|給藥途徑}}給藥", "治療 RA、{{乾癬|疾病}}、抗排斥用藥"] });
dA(104, "其他類", 30, "gold-salts", "Gold salts（金製劑）", "金製劑", {
  cls: ["可以減輕發炎反應，減少{{類風濕性因子|名詞}}"],
  feat: ["口服給藥：{{Auranofin|藥名}}", "{{單價|性質}}金離子較三價金離子有效，與{{硫|結構}}結合才有活性", "金在水溶液中不安定，半衰期短", "副作用：{{蛋白尿（腎毒性）|副作用}}、白血球、血小板減少"] });
dA(104, "Cytokine：治療其他免疫疾病", 31, "il1b-inh", "Rilonacept、Canakinumab（IL-1β）", "Canakinumab", {
  cls: ["Interleukins（白介素）：{{IL-1β|標的}}"], feat: ["治療{{痛風|疾病}}"] });
mA("basiliximab-daclizumab", 31, { feat: ["作用標的 {{IL-2|標的}}：{{腎臟移植|名詞}}免疫抑制劑"] });
dA(104, "Cytokine：治療其他免疫疾病", 31, "il5-inh", "Reslizumab、Mepolizumab（IL-5）", "Mepolizumab", {
  cls: ["Interleukins：{{IL-5|標的}}"], feat: ["治療{{氣喘|疾病}}"] });
dA(104, "Cytokine：治療其他免疫疾病", 31, "il17-il23-inh", "Secukinumab、Ixekizumab、Brodalumab（IL-17）、Ustekinumab（IL-23）", "Secukinumab", {
  cls: ["Interleukins：{{IL-17|標的}}（Secukinumab、Ixekizumab、Brodalumab）、{{IL-23|標的}}（Ustekinumab）"],
  feat: ["治療{{乾癬|疾病}}"] });
dA(104, "Cytokine：治療其他免疫疾病", 31, "interferons-imm", "Interferon-α、β、γ", "干擾素", {
  cls: ["Interferons（干擾素）"],
  feat: ["Interferon-α：常併用 {{Ribavirin|藥名}} 來治療 C 肝", "Interferon-β：治療{{多發性硬化症|疾病}}", "Interferon-γ：治療{{慢性肉芽腫病變|疾病}}"] });
dA(104, "免疫細胞：抑制 T 細胞活化", 31, "abatacept", "Abatacept", null, {
  cls: ["與 {{CD80/86|標的}} 結合，阻斷與 {{CD28|標的}} 的結合"], feat: ["治療{{類風溼性關節炎|疾病}}"] });
dA(104, "免疫細胞：抑制 T 細胞活化", 31, "efalizumab", "Efalizumab", null, {
  cls: ["阻斷 {{LFA-1 與 ICAM-1|標的}} 結合"], feat: ["治療{{牛皮癬|疾病}}"] });
dA(104, "免疫細胞：抑制 T 細胞活化", 31, "alefacept", "Alefacept", null, {
  cls: ["結合至 T cell 之 {{CD2|標的}}"], feat: ["治療牛皮癬"] });
dA(104, "免疫細胞：抑制 T 細胞活化", 31, "muromonab", "Muromonab（OKT3）", "Muromonab", {
  cls: ["與 {{CD3|標的}} 表面結合"], feat: ["{{抗排斥|名詞}}藥物"] });
dA(104, "免疫細胞：抑制 T 細胞活化", 31, "penicillamine", "Penicillamine", null, {
  cls: ["干擾免疫系統"], feat: ["治療{{銅中毒、Wilson's disease|疾病}}、RA"] });
dA(104, "免疫細胞：抑制 B 細胞", 31, "belimumab", "Belimumab", null, {
  cls: ["減少 {{B 細胞|名詞}}"], feat: ["治療紅斑性狼瘡（{{SLE|疾病}}）", "與 MTX 併用可減緩 RA 症狀"] });
dA(104, "其他類", 31, "apremilast", "Apremilast", null, {
  cls: ["{{PDE-4|酵素}} 抑制劑"], feat: ["口服劑型，用於治療{{乾癬性關節炎|疾病}}"] });
dA(104, "其他類", 31, "crisaborole", "Crisaborole", null, {
  cls: ["PDE-4 抑制劑"], struct: ["結構具有{{硼原子|結構}}，可促進對皮膚的穿透力"],
  feat: ["做成外用軟膏，用於治療{{異位性皮膚炎|疾病}}"] });
dA(104, "其他類", 31, "omalizumab", "Omalizumab", null, {
  cls: ["{{Anti-IgE|標的}}"], feat: ["治療{{嚴重氣喘|疾病}}"] });
mA("thalidomide", 31, {
  cls: ["降低嗜中性白血球吞噬作用、抑制 {{TNF-α|標的}} 合成、增加 IL-10 合成"],
  feat: ["用於治療{{多發性骨髓細胞瘤|疾病}}"] });

/* ===== 第 5 章 神經肌肉藥物 ===== */
chA(5, "05", "神經肌肉藥物", "32～34");
kA(5, "神經肌肉藥物總覽", 32, "05 神經肌肉藥物架構", [
  "多發性硬化症（Multiple Sclerosis）：干擾素：Interferon β-1a、Interferon β-1b、Peginterferon β-1a；單株抗體：{{Ocrelizumab、Alemtuzumab、Natalizumab|藥名}}；前驅藥：{{Dimethyl Fumarate、Fingolimod|藥名}}；其他類藥物：Glatiramer、Teriflunomide、Dalfampridine",
  "肌萎縮側索硬化症（Amyotrophic Lateral Sclerosis）：{{Riluzole|藥名}}、Edaravone、Tirasemtiv",
  "杜興氏肌肉萎縮症（Duchenne Muscular Dystrophy）：{{Deflazacort、Eteplirsen|藥名}}",
  "脊髓性肌肉萎縮症（Spinal Muscular Atrophy）：{{Nusinersen|藥名}}"
]);
dA(5, "多發性硬化症用藥", 33, "ms-interferon-beta", "Interferon β-1a、β-1b、Peginterferon β-1a", "IFN-β", {
  cls: ["干擾素：Interferon β-1a（{{IM|給藥途徑}}）、Interferon β-1b（SC）、Peginterferon β-1a（SC）"],
  feat: ["經由 {{JAK/STAT|名詞}} 路徑調控基因的表現", "副作用：注射處紅腫、{{Flu-like syndrome|副作用}}"] });
dA(5, "多發性硬化症用藥", 33, "ms-mab", "Ocrelizumab、Alemtuzumab、Natalizumab", "Natalizumab", {
  cls: ["單株抗體"],
  feat: ["皆為{{靜脈注射|給藥途徑}}給藥，作用的位置不同", "Ocrelizumab 作用在 {{CD20|標的}} 抗原", "Alemtuzumab 作用在 T 或 B cell 的 {{CD52|標的}} 抗原", "Natalizumab 作用在白血球 {{α-4 unit|標的}}"] });
dA(5, "多發性硬化症用藥", 33, "dimethyl-fumarate", "Dimethyl fumarate", null, {
  cls: ["前驅藥"],
  feat: ["屬於 Prodrug，口服後經由 {{esterase|酵素}} 水解形成活性代謝 {{monomethyl fumarate|物質}}"] });
dA(5, "多發性硬化症用藥", 33, "fingolimod", "Fingolimod", null, {
  cls: ["前驅藥"],
  feat: ["屬於 {{Prodrug|名詞}}", "機轉：在體內受到 kinase 活化成 Fingolimod phosphate，與 {{sphingosine-1-phosphate receptor|標的}} 結合，防止淋巴球進入中樞產生 MS 症狀"] });
dA(5, "多發性硬化症用藥", 33, "glatiramer", "Glatiramer", null, {
  cls: ["其他類（{{SC|給藥途徑}}）"],
  struct: ["為聚合物，結構含有 {{L-glutamic acid、L-alanine、L-lysine、L-tyrosine|結構}}"],
  feat: ["機轉：模擬{{髓鞘基本蛋白質|名詞}}，誘導免疫細胞攻擊，保護中樞神經"] });
dA(5, "多發性硬化症用藥", 33, "teriflunomide", "Teriflunomide", null, {
  cls: ["其他類"],
  feat: ["機轉：抑制 {{Dihydroorotate dehydrogenase|酵素}}，以減少 T&B 細胞增生", "{{肝臟機能不足及懷孕婦女|族群}}禁用"] });
dA(5, "多發性硬化症用藥", 33, "dalfampridine", "Dalfampridine", null, {
  cls: ["其他類"],
  feat: ["機轉：阻斷{{鉀離子通道|標的}}", "在體內會受 {{CYP2E1|酵素}} 氧化成 3-hydroxy 代謝物"] });
dA(5, "肌萎縮側索硬化症用藥", 34, "riluzole", "Riluzole", null, {
  cls: ["機轉：抑制 {{Glutamate|物質}} 釋放"], feat: ["口服吸收佳"] });
dA(5, "肌萎縮側索硬化症用藥", 34, "edaravone", "Edaravone", null, {
  cls: ["機轉：去除{{自由基|名詞}}以保護神經及血管內皮細胞"] });
dA(5, "肌萎縮側索硬化症用藥", 34, "tirasemtiv", "Tirasemtiv", null, {
  cls: ["機轉：提升{{骨骼肌收縮蛋白|名詞}}活性"], feat: ["口服吸收佳"] });
dA(5, "杜興氏肌肉萎縮症用藥", 34, "deflazacort", "Deflazacort", null, {
  struct: ["具{{類固醇|結構}}骨架"],
  feat: ["副作用：{{食慾增加、肥胖|副作用}}、上呼吸道感染、咳嗽"] });
dA(5, "杜興氏肌肉萎縮症用藥", 34, "eteplirsen", "Eteplirsen", null, {
  struct: ["結構含 30 個次單元 {{Morpholine phosphoro-diamidate|結構}} 骨架，在每個單元接上 oligonucleotide"],
  feat: ["可治療 {{exon51|名詞}} 基因突變的 DMD 患者", "低蛋白結合率，不受 CYP 代謝"] });
dA(5, "脊髓性肌肉萎縮症用藥", 34, "nusinersen", "Nusinersen", null, {
  cls: ["屬於{{反義寡核苷酸|名詞}}"],
  feat: ["利用{{鞘內注射|給藥途徑}}給藥", "副作用：血小板減少、呼吸道感染、便祕"] });
/* ===== 第 6 章 抗生素 ===== */
chA(6, "06", "抗生素", "35～57");
kA(6, "抗生素總覽", 35, "抗生素作用位置（Brock Biology of Microorganisms 圖）", [
  "① 抑制{{細胞壁|名詞}}合成：Penicillins 類、Cephalosporins 類、Monobactams 類、Carbapenems 類、Vancomycin、Bacitracin",
  "② 抑制{{細胞膜|名詞}}合成：{{Daptomycin、Polymyxin、Gramicidins|藥名}}",
  "③ 抑制蛋白質合成：30S：{{Aminoglycosides 類、Tetracyclines 類|藥物類別}}；50S：Macrolides 類、Chloramphenicol、Lincosamides 類、Streptogramins 類、Linezolid",
  "④ 抑制 DNA、RNA 合成：DNA gyrase（Topoisomerase II）→ {{Fluroquinolones 類|藥物類別}}；RNA polymerase → {{Rifampin|藥名}}",
  "⑤ 抑制代謝路徑（PABA → DHF → THF）：{{Trimethoprim|藥名}}、Sulfonamides 類（Sulfamethoxazole）"
]);
kA(6, "抗生素總覽", 36, "抗生素併用原則（殺菌併用殺菌，抑菌併用抑菌）", { table: { head: ["機轉", "作用"], rows: [
  ["抑制細胞壁及細胞膜", "{{殺菌|性質}}作用"],
  ["抑制蛋白質（30S 及 50S）", "{{抑菌|性質}}作用\n（除了{{胺醣類|藥物類別}}抗生素 → 殺菌作用）"],
  ["抑制細胞核（DNA／RNA）", "殺菌作用\n（除了 {{Griseofulvin、Sulfonamide|藥名}} → 抑菌作用）"] ],
  note: "{{Ticarcillin 與 Kanamycin|藥名}} 併用時，Ticarcillin 可以增加 Kanamycin 進入細菌細胞內的濃度，因而產生抑菌協同作用。" } });
kA(6, "抗生素總覽", 36, "常見細菌分類", { table: { head: [{ t: "常見細菌分類", cs: 2 }, "菌種"], cols: ["", "", "菌種"],
  rowNames: ["G(+) 好氧", "G(+) 好氧", "G(+) 好氧", "G(+) 厭氧", "G(-) 好氧", "G(-) 好氧", "G(-) 好氧", "G(-) 厭氧"],
  rows: [
  [{ t: "G(+)", b: true, rs: 4 }, { t: "好氧（Aerobic）", rs: 3 }, "Staphylococcus aureus（{{金黃色葡萄球菌|名詞}}）"],
  [null, null, "Streptococcus pyogenes（A 型鏈球菌）（Group A Streptococcus）"],
  [null, null, "Enterococcus faecalis（糞腸球菌）"],
  [null, "厭氧（Anaerobic）", "Clostridium difficile（{{困難梭菌|名詞}}）"],
  [{ t: "G(-)", b: true, rs: 4 }, { t: "好氧（Aerobic）", rs: 3 }, "Pseudomonas aeruginosa（{{綠膿桿菌|名詞}}）"],
  [null, null, "Escherichia coli（大腸桿菌）"],
  [null, null, "Neisseria gonorrhoeae（淋病雙球菌）"],
  [null, "厭氧（Anaerobic）", "Bacteroides fragilis（{{鬆脆桿菌|名詞}}）"] ],
  note: "在格蘭氏陰性菌株外膜因為有膜孔蛋白（{{Porin Channel|名詞}}），使抗生素不易進入\n長期使用 {{Clindamycin|藥名}} 易引起困難梭菌增生之偽膜性結腸炎，可口服 {{Vancomycin|藥名}} 治療" } });
kA(6, "細胞壁合成抑制劑", 37, "細菌細胞壁的組成", [
  "細菌細胞壁以 N-acetylmuramic acid（{{NAM|物質}}）以及 N-acetylglucosamine（{{NAG|物質}}）兩種醣基交錯合成，這兩種醣基以 {{β-1,4|結構}} 鍵結",
  "其中 NAM 會接上{{四|數值}}個胺基酸，而此 peptide 又以五個胺基酸之 peptide 與臨近的 NAM 連接在一起，此五個胺基酸皆為 {{Glycine|物質}}",
  "Peptidoglycan monomer 的胜肽鏈：L-Ala — D-Glu — L-Lys（—(Gly)5）— {{D-Ala — D-Ala|物質}}"
]);
kA(6, "細胞壁合成抑制劑", 38, "細胞壁合成抑制劑作用點", [
  "{{Fosfomycin|藥名}} ⊖ {{Enolpyruvial transferase|酵素}}（UDP-G → UDP-M）",
  "{{Cycloserine|藥名}} ⊖ {{Alanine racemase|酵素}}（L-Ala → D-Ala）及 D-alanyl-D-alanine ligase（D-Ala → D-Ala-D-Ala）",
  "{{Bacitracin|藥名}} ⊖ 載體 BP-PP 的 {{Dephosphorylation|名詞}}",
  "{{Vancomycin|藥名}} ⊖ {{Transglycosylase|酵素}}",
  "{{β-Lactams|藥物類別}} ⊖ {{Transpeptidase|酵素}}"
]);
dA(6, "細胞壁合成抑制劑", 39, "fosfomycin", "Fosfomycin", null, {
  cls: ["使 NAG 不能變成 NAM：抑制 {{Enolpyruvate transferase|酵素}}"],
  struct: ["藥物結構似{{丙酮酸|物質}}"] });
dA(6, "細胞壁合成抑制劑", 39, "cycloserine", "Cycloserine", null, {
  cls: ["阻止 L-Ala 轉化成 D-Ala：抑制 {{Alanine racemase and Alanine ligase|酵素}}"],
  feat: ["屬於{{肺結核|疾病}}用藥", "屬於 {{Alanine|物質}} 之拮抗劑"] });
dA(6, "細胞壁合成抑制劑", 39, "bacitracin", "Bacitracin", null, {
  cls: ["抑制 BP 去磷酸化：抑制 {{Dephosphorylation|名詞}}"],
  feat: ["{{局部|給藥途徑}}使用，因全身使用有{{腎毒性|副作用}}", "抗 {{G(+)|名詞}}"] });
dA(6, "細胞壁合成抑制劑", 39, "vancomycin", "Vancomycin", null, {
  cls: ["抑制肽聚醣單體的延長（{{Chain elongation|名詞}}）：抑制 {{Transglycosylase|酵素}}"],
  notes: ["長期使用 Clindamycin 易引起困難梭菌增生之偽膜性結腸炎，可{{口服|給藥途徑}} Vancomycin 治療（第 36 頁）"] });
kA(6, "細胞壁合成抑制劑", 39, "細胞壁合成步驟與抑制劑", { table: { head: ["步驟", "機轉", "藥物", { t: "藥物特色", cs: 2 }], cols: ["步驟", "機轉", "藥物", "藥物特色", ""], rows: [
  ["使 NAG 不能變成 NAM", "抑制 {{Enolpyruvate transferase|酵素}}", "{{Fosfomycin|藥名}}", "藥物結構似{{丙酮酸|物質}}", { img: "assets/amulet/fosfomycin.png", t: "Fosfomycin" }],
  ["阻止 L-Ala\n轉化成 D-Ala", "抑制 {{Alanine racemase and Alanine ligase|酵素}}", "{{Cycloserine|藥名}}", "屬於{{肺結核|疾病}}用藥\n屬於 Alanine 之拮抗劑", { img: "assets/amulet/cycloserine.png", t: "Cycloserine" }],
  ["抑制 BP 去磷酸化", "抑制 {{Dephosphorylation|名詞}}", "{{Bacitracin|藥名}}", { t: "局部使用，因全身使用有{{腎毒性|副作用}}\n抗 G(+)", cs: 2 }],
  ["抑制肽聚醣單體的延長\n（Chain elongation）", "抑制 {{Transglycosylase|酵素}}", "{{Vancomycin|藥名}}", { t: "", cs: 2 }],
  ["抑制肽聚醣間的交叉連結\n（{{Cross-linking|名詞}}）", "抑制 {{Transpeptidase|酵素}}", "{{β-lactams|藥物類別}} 類", { t: "", cs: 2 }] ] } });
kA(6, "Penicillins", 40, "Penicillins 藥理特色", [
  "機轉：抑制 {{Transpeptidase|酵素}} 抑制細菌細胞壁的合成",
  "Penicillin 遇酸形成 {{Penicillenic acid|物質}}；遇鹼形成 {{Penicilloic acid|物質}}",
  "Penicillin 有{{神經毒性|副作用}}，癲癇患者宜小心使用",
  "與 {{Aminoglycoside|藥物類別}} 併用時，會有協同作用",
  "大多由腎臟代謝，除了 {{Nafcillin、Oxacillin|藥名}} 由膽汁排除",
  "抗藥性：細菌結合蛋白 Penicillin Binding Protein（{{PBPs|名詞}}）發生改變，使 penicillin 無法作用",
  "藥物交互作用：Ampicillin 與含 {{Ethinyl estradiol|藥名}} 的避孕藥併用會降低避孕藥效果",
  "Penicillin 經由腎小管分泌由血中排除，此作用會被 {{Probenecid|藥名}} 抑制，造成較高的血漿濃度",
  "基本骨架：由 {{Cysteine 及 Valine|物質}} 合成；具 3 個不對稱碳原子，2S，5R，6R；半合成 Penicillin 之原料為 6-Aminopenicillanic acid（{{6-APA|物質}}）"
]);
dA(6, "Penicillins", 40, "penicillin-g", "Penicillin G", null, {
  cls: ["{{不抗酸不抗酶|性質}}"],
  feat: ["治療{{梅毒|疾病}}首選藥", "Penicillin G {{Procaine|藥名}} 可延長作用時間以 IM 給藥，而 Penicillin G {{Benzathine|藥名}} 半衰期最長"] });
dA(6, "Penicillins", 40, "methicillin", "Methicillin", null, {
  cls: ["{{不抗酸、抗酶|性質}}"], struct: ["結構中具有 {{2,6-dimethoxy|結構}}"], feat: ["以{{注射|給藥途徑}}給藥"] });
dA(6, "Penicillins", 40, "nafcillin", "Nafcillin", null, {
  cls: ["不抗酸、抗酶"], feat: ["{{口服吸收效果差|性質}}", "腎功能不全者不需調整劑量，由{{膽汁|名詞}}排泄"] });
dA(6, "Penicillins", 40, "penicillin-v", "Penicillin V", null, { cls: ["{{抗酸不抗酶|性質}}"] });
dA(6, "Penicillins", 40, "ampicillin", "Ampicillin", null, {
  cls: ["抗酸不抗酶"],
  feat: ["屬於{{兩性化合物|性質}}", "副作用為：{{腹瀉|副作用}}", "{{Hetacillin|藥名}} 水解產生 Ampicillin + Acetone"] });
dA(6, "Penicillins", 40, "amoxicillin", "Amoxicillin", null, {
  cls: ["抗酸不抗酶"], feat: ["和 Ampicillin 相比，吸收較{{完全|性質}}，腹瀉較少"] });
dA(6, "Penicillins", 40, "oxacillin", "Oxacillin", null, {
  cls: ["{{抗酸抗酶|性質}}"], struct: ["Oxacillin 具 {{Isoxazole|結構}}"],
  feat: ["腎功能不全者不需調整劑量，由膽汁排泄"] });
dA(6, "Penicillins", 40, "dicloxacillin", "Dicloxacillin", null, {
  cls: ["抗酸抗酶"], struct: ["具 Isoxazole"], feat: ["{{蛋白結合率最高|性質}}"] });
dA(6, "Penicillins", 40, "carbenicillin", "Carbenicillin", null, {
  cls: ["不抗酸不抗酶、{{抗綠膿桿菌|性質}}"], feat: ["Carbenicillin {{indanyl|結構}} 可口服給藥"] });
dA(6, "Penicillins", 40, "ticarcillin", "Ticarcillin", null, {
  cls: ["不抗酸不抗酶、抗綠膿桿菌"], struct: ["含有 {{Thiophene|結構}}"],
  feat: ["{{Temocillin|藥名}} 可抗酶但不可抗綠膿桿菌，結構為 Ticarcillin 加上 6-αOCH3"] });
dA(6, "Penicillins", 40, "azlo-mezlo-piperacillin", "Azlocillin、Mezlocillin、Piperacillin", "Piperacillin", {
  cls: ["不抗酸不抗酶、抗綠膿桿菌"], struct: ["Mezlocillin 結構含有{{尿素|結構}}"] });
kA(6, "Penicillins", 41, "Penicillins 結構與抗酸抗酶", { table: { head: [{ t: "抗酸（可口服）：有{{拉電子基|結構}}，抗酶：有{{大基團|結構}}，抗綠膿桿菌：含 {{COOH、尿素|結構}}", cs: 6 }], rowNames: false, rows: [
  [{ t: "不抗酸不抗酶", b: true, rs: 2 }, { t: "Penicillin G", b: true }, "", "", "", ""],
  [null, { img: "assets/amulet/penicillin-g.png", t: "Penicillin G" }, "", "", "", ""],
  [{ t: "不抗酸抗酶", b: true, rs: 2 }, { t: "Methicillin", b: true }, { t: "Nafcillin", b: true }, "", "", ""],
  [null, { img: "assets/amulet/methicillin.png", t: "Methicillin" }, { img: "assets/amulet/nafcillin.png", t: "Nafcillin" }, "", "", ""],
  [{ t: "抗酸不抗酶", b: true, rs: 2 }, { t: "Penicillin V", b: true }, { t: "Ampicillin", b: true }, { t: "Amoxicillin", b: true }, "", ""],
  [null, { img: "assets/amulet/penicillin-v.png", t: "Penicillin V" }, { img: "assets/amulet/ampicillin.png", t: "Ampicillin" }, { img: "assets/amulet/amoxicillin.png", t: "Amoxicillin" }, "", ""],
  [{ t: "抗酸抗酶", b: true, rs: 2 }, { t: "Oxacillin", b: true }, { t: "Dicloxacillin", b: true }, "", "", ""],
  [null, { img: "assets/amulet/oxacillin.png", t: "Oxacillin" }, { img: "assets/amulet/dicloxacillin.png", t: "Dicloxacillin" }, "", "", ""],
  [{ t: "不抗酸不抗酶\n抗綠膿桿菌", b: true, rs: 2 }, { t: "Carbenicillin", b: true }, { t: "Ticarcillin", b: true }, { t: "Azlocillin", b: true }, { t: "Mezlocillin", b: true }, { t: "Piperacillin", b: true }],
  [null, { img: "assets/amulet/carbenicillin.png", t: "Carbenicillin" }, { img: "assets/amulet/ticarcillin.png", t: "Ticarcillin" }, { img: "assets/amulet/azlo-mezlo-piperacillin.png", t: "Azlocillin" }, { img: "assets/amulet/azlo-mezlo-piperacillin-2.png", t: "Mezlocillin" }, { img: "assets/amulet/azlo-mezlo-piperacillin-3.png", t: "Piperacillin" }] ] } });
kA(6, "Cephalosporins", 42, "Cephalosporins 藥理特色", { table: { head: ["藥理特色／機轉", "分類", "藥名", "藥物特色"], cols: ["藥理特色／機轉", "分類", "藥名", "藥物特色"], rowNames: ["Cephalexin", "Cefadroxil", "Cephradine", "Cefazolin", "Cefaclor", "Cefuroxime", "Cefamandole", "Cefonicid", "Cefoxitin", "Cefotetan、Cefmetazole", "Ceftazidime", "Cefoperazone", "Cefotaxime", "Ceftriaxone", "Ceftizoxime", "Cefixime", "Ceftibuten", "Moxalactam", "Cefpirome、Cefepime", "Ceftaroline"],
  rows: [
  [{ t: "1. 機轉：抑制 {{Transpeptidase|酵素}} 抑制細菌細胞壁的合成\n2. 可否進入 BBB\n✓ 第一、二代皆不能進入 BBB，除了 {{Cefuroxime|藥名}}\n✓ 第三代可入 BBB，除了 {{Cefoperazone|藥名}}\n3. 抗菌範圍大原則：一代到三代的抗菌範圍對 G(+) 越來越{{差|性質}}，對 G(-) 則越來越好。四代則是對 G(+)、G(-) 都有效。\n4. 大多為腎臟代謝，由肝臟排除：{{Ceftriaxone、Cefoperazone|藥名}}\n5. 三號位為 H：{{Ceftizoxime、Ceftibuten|藥名}}\n6. 3rd 生體可用率高（口服）：{{Ceftibuten、Cefixime、Cefdinir|藥名}}\n7. 3rd 中無 Thiazole：{{Cefoperazone|藥名}}", rs: 11 }, { t: "第一代\n不能通過 BBB\n主要抗 {{G(+)|名詞}}", b: true, rs: 4 }, "Cephalexin", "具有和 {{Ampicillin|藥名}} 相同的側鏈"],
  [null, null, "Cefadroxil", "具有和 {{Amoxicillin|藥名}} 相同的側鏈"],
  [null, null, "Cephradine", "可以注射與口服使用"],
  [null, null, "Cefazolin", "{{手術前預防性|名詞}}抗生素用藥"],
  [null, { t: "第二代", b: true, rs: 6 }, "Cefaclor", "Loracarbef 為 Cefaclor 之等效異構物\n治療 {{H.influenzae|名詞}} 引起的感染"],
  [null, null, "Cefuroxime", "字尾是 {{oxime|結構}}，卻屬於 2 代"],
  [null, null, "Cefamandole", "有 {{MTT|結構}} 基團，會引起出血、Disulfiram-like reaction"],
  [null, null, "Cefonicid", "此類藥物{{半衰期最長、蛋白結合率最高|性質}}"],
  [null, null, "Cefoxitin", "含有 {{7-αOCH3|結構}} → 可以抗酶、抗厭氧菌"],
  [null, null, "Cefotetan\nCefmetazole", "皆含有 MTT 基團及 7-αOCH3"],
  [null, { t: "第三代\n可以抗{{綠膿桿菌|名詞}}", b: true, rs: 2 }, "Ceftazidime", "Ceftazidime 無法抗 {{β-lactamase|酵素}}"],
  [{ t: "✧ 基本骨架：", img: "assets/amulet/ceph-skeleton.png", rs: 6 }, null, "Cefoperazone", "Cefoperazone {{無法通過 BBB|性質}}"],
  [null, { t: "第三代\n抗更多 G(-)\n不可抗綠膿桿菌", b: true, rs: 6 }, "Cefotaxime", "治療{{腦膜炎|疾病}}首選的抗生素"],
  [null, null, "Ceftriaxone", "蛋白結合率高\n{{淋病雙球菌|名詞}}首選藥，可用來治療腦膜炎"],
  [null, null, "Ceftizoxime", "第三位為 {{H|結構}}"],
  [null, null, "Cefixime", "第三代可以{{口服|給藥途徑}}"],
  [null, null, "Ceftibuten", "Ceftibuten C-3 為 H，C-7 具有 {{Ethylidinecarboxyl|結構}}"],
  [{ t: "1. 含 {{Dihydrothiazine|結構}} 及 β-lactam\n2. C2、C3 以雙鍵連結\n3. C4 接氫", rs: 3 }, null, "Moxalactam", "含有 MTT 基團及 7-αOCH3"],
  [null, { t: "第四代", b: true }, "Cefpirome\nCefepime", "可以抗綠膿桿菌、{{β-lactamases|酵素}}"],
  [null, { t: "第五代", b: true }, "Ceftaroline", "含有 {{Thiazole、Thiadiazole、Pyridine|結構}}"] ] } });
dA(6, "Cephalosporins：第一代", 42, "cephalexin", "Cephalexin", null, {
  cls: ["第一代：不能通過 BBB，主要抗 {{G(+)|名詞}}"], feat: ["具有和 {{Ampicillin|藥名}} 相同的側鏈"] });
dA(6, "Cephalosporins：第一代", 42, "cefadroxil", "Cefadroxil", null, {
  cls: ["第一代"], feat: ["具有和 {{Amoxicillin|藥名}} 相同的側鏈"] });
dA(6, "Cephalosporins：第一代", 42, "cephradine", "Cephradine", null, {
  cls: ["第一代"], feat: ["可以{{注射與口服|給藥途徑}}使用"] });
dA(6, "Cephalosporins：第一代", 42, "cefazolin", "Cefazolin", null, {
  cls: ["第一代"], feat: ["{{手術前預防性|名詞}}抗生素用藥"] });
dA(6, "Cephalosporins：第二代", 42, "cefaclor", "Cefaclor", null, {
  cls: ["第二代"], feat: ["{{Loracarbef|藥名}} 為 Cefaclor 之等效異構物", "治療 {{H.influenzae|名詞}} 引起的感染"] });
dA(6, "Cephalosporins：第二代", 42, "cefuroxime", "Cefuroxime", null, {
  cls: ["第二代"], feat: ["字尾是 {{oxime|結構}}，卻屬於 2 代", "第一、二代中唯一可進入 {{BBB|名詞}}"] });
dA(6, "Cephalosporins：第二代", 42, "cefamandole", "Cefamandole", null, {
  cls: ["第二代"], struct: ["有 {{MTT|結構}} 基團"], feat: ["會引起出血、{{Disulfiram-like reaction|副作用}}"] });
dA(6, "Cephalosporins：第二代", 42, "cefonicid", "Cefonicid", null, {
  cls: ["第二代"], feat: ["此類藥物{{半衰期最長、蛋白結合率最高|性質}}"] });
dA(6, "Cephalosporins：第二代", 42, "cefoxitin", "Cefoxitin", null, {
  cls: ["第二代"], struct: ["含有 {{7-αOCH3|結構}} → 可以抗酶、抗厭氧菌"] });
dA(6, "Cephalosporins：第二代", 42, "cefotetan-cefmetazole", "Cefotetan、Cefmetazole", "Cefotetan", {
  cls: ["第二代"], struct: ["皆含有 {{MTT 基團及 7-αOCH3|結構}}"] });
dA(6, "Cephalosporins：第三代", 42, "ceftazidime", "Ceftazidime", null, {
  cls: ["第三代：可以抗{{綠膿桿菌|名詞}}"], feat: ["Ceftazidime 無法抗 {{β-lactamase|酵素}}"] });
dA(6, "Cephalosporins：第三代", 42, "cefoperazone", "Cefoperazone", null, {
  cls: ["第三代：可以抗綠膿桿菌"], feat: ["Cefoperazone {{無法通過 BBB|性質}}"] });
dA(6, "Cephalosporins：第三代", 42, "cefotaxime", "Cefotaxime", null, {
  cls: ["第三代：抗更多 G(-)，不可抗綠膿桿菌"], feat: ["治療{{腦膜炎|疾病}}首選的抗生素"] });
dA(6, "Cephalosporins：第三代", 42, "ceftriaxone", "Ceftriaxone", null, {
  cls: ["第三代：抗更多 G(-)，不可抗綠膿桿菌"],
  feat: ["蛋白結合率高", "{{淋病雙球菌|名詞}}首選藥，可用來治療腦膜炎"] });
dA(6, "Cephalosporins：第三代", 42, "ceftizoxime", "Ceftizoxime", null, {
  cls: ["第三代"], struct: ["第三位為 {{H|結構}}"] });
dA(6, "Cephalosporins：第三代", 42, "cefixime", "Cefixime", null, {
  cls: ["第三代"], feat: ["第三代可以{{口服|給藥途徑}}"] });
dA(6, "Cephalosporins：第三代", 42, "ceftibuten", "Ceftibuten", null, {
  cls: ["第三代"], struct: ["Ceftibuten C-3 為 H，C-7 具有 {{Ethylidinecarboxyl|結構}}"] });
dA(6, "Cephalosporins：第三代", 42, "moxalactam", "Moxalactam", null, {
  cls: ["第三代"], struct: ["含有 {{MTT 基團及 7-αOCH3|結構}}"] });
dA(6, "Cephalosporins：第四、五代", 42, "cefpirome-cefepime", "Cefpirome、Cefepime", "Cefepime", {
  cls: ["第四代"], feat: ["可以抗{{綠膿桿菌、β-lactamases|名詞}}"] });
dA(6, "Cephalosporins：第四、五代", 42, "ceftaroline", "Ceftaroline", null, {
  cls: ["第五代（IV）"], struct: ["含有 {{Thiazole、Thiadiazole、Pyridine|結構}}"] });
kA(6, "Cephalosporins", 43, "MTT 基團與 7-αOCH3", [
  "N-methyl-5-thiotetrazole（{{MTT|結構}} 基團）：具 MTT 基團會引起 {{Disulfiram-like|副作用}} 反應、{{出血|副作用}}",
  "具 MTT 基團：{{Cefmetazole、Cefotetan、Cefamandole、Cefoperazone、Moxalactam|藥名}}",
  "{{7-αOCH3|結構}}：可抗酶、抗厭氧菌：Cefmetazole、Cefotetan、Moxalactam、{{Cefoxitin|藥名}}"
]);
dA(6, "β-lactamase inhibitors", 44, "clavulanic-acid", "Clavulanic acid", null, {
  cls: ["β-lactamase inhibitors（本身{{不具抗菌|性質}}效果，與 β-lactams 併用可增強藥效）"],
  feat: ["與 β-lactamase 產生{{不可逆|性質}}的鍵結", "+ Amoxicillin = {{Augmentin|藥名}}", "+ Ticarcillin = {{Timentin|藥名}}"] });
dA(6, "β-lactamase inhibitors", 44, "sulbactam", "Sulbactam", null, {
  cls: ["β-lactamase inhibitors"], feat: ["+ Ampicillin = {{Unasyn|藥名}}"] });
dA(6, "β-lactamase inhibitors", 44, "tazobactam", "Tazobactam", null, {
  cls: ["β-lactamase inhibitors"], feat: ["+ Piperacillin = {{Zosyn|藥名}}；P:T = {{8:1|數值}}"] });
dA(6, "Carbapenems", 44, "thienamycin", "Thienamycin", null, {
  cls: ["Carbapenems（{{腸細菌科|名詞}}感染首選）"],
  struct: ["結構不含 {{C4-CH3|結構}}，因此 Dehydropeptidase-1（DHP-1）會水解此藥"] });
dA(6, "Carbapenems", 44, "imipenem", "Imipenem", null, {
  cls: ["Carbapenems"],
  struct: ["結構不含 C4-CH3"],
  feat: ["因此併用 {{Cilastatin|藥名}}（Tienam），可抑制 {{DHP-1|酵素}} 的代謝，增加藥效", "副作用：{{癲癇|副作用}}"] });
dA(6, "Carbapenems", 44, "meropenem", "Meropenem", null, {
  cls: ["Carbapenems"], struct: ["含 C4-CH3，{{不須|性質}}併用 Cilastatin"] });
dA(6, "Monobactams", 44, "aztreonam", "Aztreonam", null, {
  cls: ["{{Monobactams|藥物類別}}"], feat: ["可抗 {{G(-)、好氧菌|名詞}}"] });
mA("vancomycin", 44, {
  struct: ["Glycopeptide：含有雙醣、{{聯苯及芳香醚|結構}}"],
  feat: ["由{{腎臟|器官}}排除，只能對抗 {{G(+)|名詞}}", "口服：治療{{偽膜性結腸炎|疾病}}；IV：治療心內膜炎、{{MRSA|名詞}}", "輸注速率過快易發生 {{Red man syndrome|副作用}} → 以 Anti-histamine 治療"] });
dA(6, "Glycopeptide", 44, "teicoplanin", "Teicoplanin", null, {
  cls: ["{{Glycopeptide|藥物類別}}"],
  feat: ["相較 Vancomycin：{{脂溶性較高|性質}} → 半衰期長", "較不會造成 {{Red man syndrome|副作用}}"] });
dA(6, "抑制細胞膜合成", 45, "polymyxin", "Polymyxin B1、Polymyxin E1", "Polymyxin", {
  cls: ["抑制細胞膜合成：{{Polypeptides|藥物類別}}"],
  feat: ["Polymyxin B1 主要對抗 {{G(-)|名詞}}", "Polymyxin E1 又稱 {{Colistin A|藥名}}"] });
dA(6, "抑制細胞膜合成", 45, "gramicidins", "Gramicidins", null, {
  cls: ["抑制細胞膜合成：Polypeptides"],
  struct: ["結構屬{{線型|結構}}，非環狀"], feat: ["抗 {{G(+)|名詞}}"] });
dA(6, "抑制細胞膜合成", 45, "daptomycin", "Daptomycin", null, {
  cls: ["抑制細胞膜合成：{{Cyclic lipopeptide|藥物類別}}"], feat: ["抗 G(+)"] });
kA(6, "抑制蛋白質合成", 46, "抑制蛋白質合成的抗生素藥物（Medical Pharmacology at a Glance 圖）", [
  "{{Aminoglycosides|藥物類別}} 類（Streptomycin、Neomycin、Paromomycin、Amikacin、Sisomicin）：與 30s 結合，造成 {{mRNA 誤讀|名詞}}",
  "{{Tetracyclines|藥物類別}} 類（Oxytetracycline、Doxycycline）：與 30s 結合，阻斷 {{tRNA 連結|名詞}}",
  "① tRNA 攜帶胺基酸傳遞至 A 位；② {{轉胜肽作用|名詞}} ⊖ {{Chloramphenicol|藥名}}",
  "③ {{轉位作用|名詞}} ⊖ Macrolides 類（Erythromycin、Clarithromycin）、Lincosamide 類（Lincomycin）",
  "抑制 50s：Streptogramins 類（{{Quinupristin/Dalfopristin|藥名}}）、Oxazolidinones 類（{{Linezolid|藥名}}）",
  "A 位（Aminoacyl-tRNA binding site）：固定住攜帶{{胺基酸|物質}}的 tRNA；P 位（Peptidyl-tRNA binding site）：固定住攜帶{{多肽|物質}}的 tRNA"
]);
kA(6, "抑制蛋白質合成", 47, "作用點、步驟與機轉", { table: { head: ["作用點", "步驟", "機轉", "藥物"], rowNames: ["Kanamycin", "Tetracycline", "Chloramphenicol", "Azithromycin、Lincomycin", "Quinupristin/Dalfopristin", "Linezolid"],
  rows: [
  [{ t: "30S", b: true, rs: 2 }, { t: "tRNA 傳遞胺基酸至 A 位", rs: 2 }, "抑制{{起始複合物|名詞}}的形成、造成誤讀", "{{Kanamycin|藥名}}"],
  [null, null, "抑制 tRNA 與 mRNA 的鍵結", "{{Tetracycline|藥名}}"],
  [{ t: "50S", b: true, rs: 4 }, "使胜肽鏈延長，將 P 位胺基酸轉至 A 位", "{{轉胜肽作用|名詞}}（Transpeptidation）", "{{Chloramphenicol|藥名}}"],
  [null, "將 A 位胺基酸轉至 P 位，以便 A 位固定下一個 t-RNA", "{{轉位作用|名詞}}（Translocation）", "{{Azithromycin、Lincomycin|藥名}}"],
  [null, { t: "抑制 50S", rs: 2 }, "結合在細菌之 50S 核醣體上以抑制蛋白質的合成", "{{Quinupristin/Dalfopristin|藥名}}"],
  [null, null, "結合在 50S 核醣體的 {{23S|名詞}} 上，抑制 {{70S|名詞}} 起始複合物的形成", "Linezolid"] ] } });
kA(6, "Aminoglycosides", 48, "Aminoglycosides 機轉與藥理特色", [
  "機轉：和 {{30S|名詞}} 核醣體次單元鍵結，抑制起始複合物的形成，也會造成遺傳密碼的誤讀，讓錯誤的胺基酸併入到胜肽鏈",
  "抗菌範圍：主要抗 {{G(-)、好氧菌|名詞}}，藥物進入肺部能力差，不適用於治療 {{Legionella pneumonia|疾病}} 之感染",
  "有 Post-antibiotic effect（{{PAE|名詞}}）效應，可每天給藥一次",
  "結構有糖基 → OH 多，具高度水溶性，多 IV；原型藥腎排除，因此蛋白結合率低 → {{不入 BBB|性質}}",
  "可抗綠膿桿菌，與 {{Ticarcillin|藥名}} 併用可治療綠膿桿菌感染",
  "{{Paromomycin|藥名}} 可治腸道阿米巴原蟲感染",
  "在{{鹼性|性質}}環境作用強，臨床上常做成{{硫酸鹽|名詞}}使用"
]);
dA(6, "Aminoglycosides", 48, "streptomycin", "Streptomycin", null, {
  cls: ["Aminoglycosides"],
  struct: ["{{不含有 2-Deoxystreptamine|結構}}", "C-1、C-3 有兩分子 {{Guanidine|結構}}"],
  feat: ["不適合高壓蒸氣滅菌因含有{{醛基|結構}}"] });
dA(6, "Aminoglycosides", 48, "neomycin", "Neomycin", null, {
  cls: ["Aminoglycosides"],
  struct: ["只有 Neomycin 和 Paromomycin 有{{四個環|結構}}", "結構多了 {{ribose|結構}}，因此毒性大不能注射給藥"],
  feat: ["Neomycin 口服治療{{肝性腦病變|疾病}}"] });
dA(6, "Aminoglycosides", 48, "paromomycin", "Paromomycin", null, {
  cls: ["Aminoglycosides"],
  struct: ["有四個環，結構多了 ribose，因此毒性大不能注射給藥"],
  feat: ["可治腸道{{阿米巴原蟲|疾病}}感染"] });
kA(6, "Aminoglycosides", 49, "Aminoglycosides 藥化結構原則、抗藥性、副作用", [
  "糖：結構至少含有一個{{胺基六碳糖|結構}}，少數藥物（Neomycin、Paromomycin）具有五碳糖",
  "非糖：具 {{Streptidine|結構}} → Streptomycin；具 {{Deoxystreptamine|結構}} → Neomycin、Paromomycin、Kanamycin、Amikacin",
  "抗藥性：胺基乙醯化（N-Acetylation）、磷酸化（O-Phosphorylation）、{{腺嘌呤化（O-Adenylation）|名詞}}",
  "對 Streptomycin 已產生抗藥性的結核分枝桿菌通常不會對 {{Amikacin|藥名}} 有交互抗藥性",
  "若產生 Kanamycin 與 Neomycin 交互抗藥性，會進一步導致對 Amikacin 的抗藥性產生",
  "對 Tobramycin 或 Gentamicin 有抗藥性時的替代藥物，可以使用 {{Netilmicin 或 Amikacin|藥名}}",
  "副作用：{{耳腎毒性|副作用}}（耳腎毒性：Furosemide、Cisplatin）；神經肌肉阻斷作用 → 解毒劑：{{Neostigmine|藥名}}"
]);
dA(6, "Aminoglycosides", 49, "kanamycin", "Kanamycin", null, {
  cls: ["Aminoglycosides"], struct: ["Kanamycin B R1 及 R2 取代基均為 {{NH2|結構}} 作用最強"] });
dA(6, "Aminoglycosides", 49, "amikacin", "Amikacin", null, {
  cls: ["Aminoglycosides"],
  struct: ["由 {{Kanamycin A|藥名}} 半合成而得", "Deoxystreptamine 之 3-N 上具有 L-amino-α-hydroxybutyric acid（{{L-AHBA|結構}}）"] });
dA(6, "Aminoglycosides", 49, "tobramycin", "Tobramycin", null, {
  cls: ["Aminoglycosides"], struct: ["去除 3-OH 基，稱 {{3'-Deoxykanamycin B|藥名}}"] });
dA(6, "Aminoglycosides", 49, "gentamicin", "Gentamicin", null, {
  cls: ["Aminoglycosides"], struct: ["Gentamicin C1a：R1=R2=R3={{H|結構}}"],
  feat: ["Peak 5-8 μg/mL；Trough < {{2 μg/mL|數值}}", "Trough 濃度過高會引起{{腎毒性|副作用}}"] });
dA(6, "Aminoglycosides", 49, "sisomicin", "Sisomicin", null, {
  cls: ["Aminoglycosides"], struct: ["與 {{Gentamicin C1a|藥名}} 結構相似"] });
dA(6, "Aminoglycosides", 49, "netilmicin", "Netilmicin（1-N-Ethylsisomycin）", "Netilmicin", {
  cls: ["Aminoglycosides"], struct: ["Sisomicin N 上加入{{乙基|結構}}可得到 Netilmicin"] });
dA(6, "Aminoglycosides", 49, "spectinomycin", "Spectinomycin", null, {
  cls: ["Aminoglycosides"], struct: ["結構{{沒有胺糖|結構}}", "不含有 2-Deoxystreptamine"] });
kA(6, "Tetracyclines", 50, "Tetracyclines 機轉與藥理藥化特性", [
  "機轉：和 30S 核醣體次單元鍵結，防止 {{tRNA|物質}} 鍵結到 mRNA 上",
  "酸中：形成無活性 {{Anhydro-Tetracycline|物質}}；中性：形成活性減弱 {{Epitetracycline|物質}}（C4α → C4β）；鹼中：形成無活性 {{Isotetracycline|物質}}",
  "抗菌範圍：{{披衣菌、立克次體|名詞}}、伯氏疏螺旋體",
  "Tetracycline 具有 {{5|數值}} 個不對稱碳，而 Oxytetracycline 及 Doxycycline 具有 6 個不對稱碳",
  "C6-OH 極性較 C5-OH 高，因此去除 {{C6-OH|結構}}，藥物脂溶性高、吸收好、分布體積小、半衰期長",
  "C7-Cl 會使抗菌活性{{增加|性質}}",
  "結構有烯醇（enol）、酮（ketone）可螯合{{鈣|物質}}",
  "大多無法通過 BBB，除了 {{Minocycline、Doxycycline|藥名}}；大多腎排除，除了 {{Doxycycline|藥名}}",
  "抗藥性：細菌以{{主動運輸|名詞}}將 Tetracycline 排出體外",
  "副作用：會螯合鈣離子，{{孕婦和年齡低於八歲的孩童|族群}}應避免使用；具有光敏感性（Demeclocycline）；含 C6-OH 之 TC 易生成 4-EpianhydroTC，此產物具腎毒性易引起 {{Fanconi-like syndrome|副作用}}"
]);
dA(6, "Tetracyclines", 50, "tetracycline", "Tetracycline", null, {
  cls: ["Tetracyclines"], feat: ["{{分配係數最小|性質}}"], struct: ["必背結構：{{C6β-OH、C6α-CH3|結構}}"] });
dA(6, "Tetracyclines", 50, "rolitetracycline", "Rolitetracycline", null, {
  cls: ["Tetracyclines"], struct: ["2 號位有 {{Pyrrolidine|結構}}", "維持 C6β-OH、C6α-CH3"] });
dA(6, "Tetracyclines", 50, "oxytetracycline", "Oxytetracycline", null, {
  cls: ["Tetracyclines"], struct: ["加入 {{C5α-OH|結構}}", "維持 C6β-OH、C6α-CH3"] });
dA(6, "Tetracyclines", 50, "demeclocycline", "Demeclocycline", null, {
  cls: ["Tetracyclines"], struct: ["多了 {{C7-Cl|結構}} 去 C6α-CH3", "維持 C6β-OH"],
  feat: ["可治療 {{SIADH|疾病}}，具最強的{{光毒性|副作用}}"] });
dA(6, "Tetracyclines", 50, "doxycycline", "Doxycycline", null, {
  cls: ["Tetracyclines"], struct: ["多了 C5α-OH 刪 {{C6β-OH|結構}}"],
  feat: ["分配係數大 → 去除 C6-OH", "由{{膽汁|名詞}}排除"] });
dA(6, "Tetracyclines", 50, "minocycline", "Minocycline", null, {
  cls: ["Tetracyclines"], struct: ["4 號和 7 號位有{{二甲基胺|結構}}"],
  feat: ["{{分配係數最大|性質}} → 去除 C6-OH", "可過 {{BBB|名詞}}"] });
dA(6, "Tetracyclines", 50, "tigecycline", "Tigecycline", null, {
  cls: ["Tetracyclines"], struct: ["9 號位有 {{Glycylamido|結構}} 取代基", "屬於 {{tert-butylglycylamido|結構}} 衍生物"] });
kA(6, "Macrolides", 51, "Macrolides 機轉與特色", [
  "機轉：作用在 {{50S|名詞}}，抑制轉位（Translocation）作用",
  "抗菌範圍：披衣菌、肺炎黴漿菌、{{退伍軍人|名詞}}",
  "副作用：傷肝、傷胃、抑制 {{CYP450|酵素}} → Clarithromycin 由腎排除",
  "造成 {{QT 延長|副作用}}：Erythromycin、Clarithromycin",
  "可治療糖尿病造成的{{胃輕癱|疾病}}",
  "三合一療法治療幽門螺旋桿菌：{{Clarithromycin + Amoxicillin + PPI|藥名}}"
]);
dA(6, "Macrolides", 51, "erythromycin", "Erythromycin", null, {
  cls: ["Macrolides"],
  struct: ["{{14|數值}} 員環", "C3 有 {{L-Cladinose|結構}}，C5 有 {{Desosamine|結構}}", "C6 有 OH 基，酸中易形成 {{Spiroketal|結構}}，造成胃部痙攣"] });
dA(6, "Macrolides", 51, "clarithromycin", "Clarithromycin", null, {
  cls: ["Macrolides"], struct: ["C6 有 {{OCH3|結構}}，在酸中不易形成 Spiroketal，減少胃部副作用"] });
dA(6, "Macrolides", 51, "azithromycin", "Azithromycin", null, {
  cls: ["Macrolides"], struct: ["多了一個{{氮|結構}}，形成 {{15|數值}} 員環"], feat: ["不會抑制 CYP450"] });
dA(6, "Macrolides", 51, "troleandomycin", "Troleandomycin", null, {
  cls: ["Macrolides"], struct: ["具有 {{Epoxide|結構}}，在 8 號位"], feat: ["抑制 CYP450 效果{{最強|性質}}，現已不使用"] });
dA(6, "Macrolides", 51, "telithromycin", "Telithromycin", null, {
  cls: ["Macrolides"], struct: ["含有 {{Pyridine|結構}}"],
  feat: ["造成{{膽鹼阻斷|副作用}}的副作用，對重症肌無力可能導致惡化"] });
dA(6, "Macrolides", 51, "fidaxomicin", "Fidaxomicin", null, {
  cls: ["機轉：抑制 {{RNA 聚合酶|酵素}}"], struct: ["結構含糖基，口服吸收不佳"],
  feat: ["用於治療{{困難梭菌|名詞}}感染"] });
dA(6, "Streptogramins", 51, "quinupristin-dalfopristin", "Quinupristin / Dalfopristin（Q:D=3:7）", "Synercid", {
  cls: ["機轉：作用在 50S 核醣體次單元，以抑制蛋白質的合成", "單獨用：{{抑菌|性質}}；併用：{{殺菌|性質}}"],
  feat: ["Quinupristin 為 {{Streptogramin B|名詞}} 化合物", "Dalfopristin 為 {{Streptogramin A|名詞}} 化合物", "屬於 {{3A4|酵素}} 抑制劑，由膽汁排除"] });
kA(6, "Lincosamides", 52, "Lincosamides 機轉與特色", [
  "機轉：作用在 50S 核醣體次單元，抑制{{轉位（Translocation）|名詞}}作用",
  "抗菌範圍：{{G(+)、厭氧菌|名詞}}",
  "副作用：{{偽膜性結腸炎|副作用}} → 可用 Vancomycin、Metronidazole、Fidaxomicin 治療"
]);
dA(6, "Lincosamides", 52, "lincomycin", "Lincomycin", null, {
  cls: ["Lincosamides"], struct: ["含有 {{N-methylpyrrolidine|結構}}、Amino-octoside"] });
dA(6, "Lincosamides", 52, "clindamycin", "Clindamycin", null, {
  cls: ["Lincosamides"],
  struct: ["Lincomycin → Clindamycin（{{C-7OH → C-7Cl|結構}}），且 7 號位由 R → S", "Clindamycin 含有 {{Cl 與 S|結構}}"],
  feat: ["代謝：N 上{{脫甲基|名詞}}"] });
dA(6, "抑制蛋白質合成：未分類", 52, "chloramphenicol", "Chloramphenicol", null, {
  cls: ["機轉：作用在 50S 核醣體次單元，抑制{{轉胜肽作用（transpeptidation）|名詞}}"],
  feat: ["口服吸收良好，脂溶性高", "主要經由肝臟代謝，屬於 CYP {{抑制劑|名詞}}", "代謝：{{C3-Glucuronide|物質}}", "抗菌活性：D form（{{1R,2R|結構}}）", "副作用：成人{{再生不能性貧血|副作用}}，新生兒{{灰嬰症|副作用}}"] });
dA(6, "抑制蛋白質合成：未分類", 52, "linezolid", "Linezolid", null, {
  cls: ["機轉：結合在 50S 核醣體的 {{23S|名詞}} 上，抑制 70S 起始複合物的形成"],
  struct: ["結構屬於 {{Oxazolidinone|結構}}"],
  feat: ["具有抑制 {{MAO|酵素}} 的作用，避免同時服用含 Tyramine 之食物", "副作用：舌頭染色、{{血小板低下|副作用}}", "治療 {{MRSA|名詞}} 所引起的感染"] });
dA(6, "抑制蛋白質合成：未分類", 52, "retapamulin", "Retapamulin", null, {
  cls: ["機轉：作用在 50S，藥物結合位置與巨環類不同，較不會出現抗藥性"],
  struct: ["為半合成的{{二萜|結構}}衍生物", "{{C-14|結構}} 之 sulfamylacetate moiety 為重要的藥效基團"],
  feat: ["{{外用|給藥途徑}}給藥，不易進入體內"] });
dA(6, "抑制蛋白質合成：未分類", 52, "mupirocin", "Mupirocin", null, {
  cls: ["抑制 {{Isoleucyl transfer-RNA synthase|酵素}}"],
  struct: ["具有 {{Epoxide|結構}}"], feat: ["在體內易受水解，以{{外用|給藥途徑}}為主"] });
kA(6, "影響 DNA 的合成（Quinolones）", 53, "Quinolones 藥理特色", [
  "機轉：抑制 DNA gyrase（{{Topoisomerase II|酵素}}）和 Topoisomerase IV",
  "抗菌範圍：{{尿路感染、急性旅行者腹瀉|疾病}}",
  "副作用：破壞{{軟骨生長|副作用}}（18 歲以下不建議使用）、易與金屬離子結合而失效、光毒性",
  "通常以腎臟排泄，{{Moxifloxacin|藥名}} 經肝臟代謝；與制酸劑併用宜間隔兩小時",
  "交互作用：Ciprofloxacin（{{1A2|酵素}} 酵素抑制劑）與 {{Theophylline|藥名}} 併用，Theophylline 濃度會上升",
  "造成 QT 延長：{{Moxifloxacin、Gemifloxacin、Gatifloxacin|藥名}}",
  "可用於呼吸道感染：Levofloxacin、Moxifloxacin、Gemifloxacin、Gatifloxacin",
  "Quinolones 抗生素結構中，C-7 位置之 piperazine 基團可與 {{GABA|標的}} 受體結合，而產生中樞神經系統副作用"
]);
kA(6, "影響 DNA 的合成（Quinolones）", 53, "Fluroquinolones 之 SAR", [
  "R1-Cyclopropyl ring：{{Potency↑|性質}}",
  "R3-COOH：{{抗菌的藥效基團|名詞}}",
  "R6-F：{{細胞壁穿透力↑|性質}}",
  "R7-Piperazine、Pyrrolidine：{{增加抗菌範圍|性質}}",
  "R8-F：{{光毒性↑|副作用}}"
]);
dA(6, "Quinolones", 53, "nalidixic-acid", "Nalidixic acid", null, {
  cls: ["1st Quinolone"],
  struct: ["C3 有 {{COOH|結構}}", "C6 有 F 基，可增加抗菌效果", "C7 有 {{Piperazine|結構}}，可增加抗菌範圍"] });
dA(6, "Quinolones", 53, "ciprofloxacin", "Ciprofloxacin", null, {
  cls: ["2nd Quinolone"],
  feat: ["可抗{{綠膿桿菌、炭疽菌|名詞}}", "對於 G(-) 的效果{{最強|性質}}（包含綠膿桿菌）（第 54 頁）", "{{1A2|酵素}} 酵素抑制劑"] });
dA(6, "Quinolones", 53, "ofloxacin", "Ofloxacin", null, {
  cls: ["2nd Quinolone"], feat: ["Ofloxacin 之左旋異構物為 {{Levofloxacin|藥名}}"] });
dA(6, "Quinolones", 53, "levofloxacin", "Levofloxacin（左旋型 Ofloxacin）", "Levofloxacin", {
  cls: ["3rd Quinolone"],
  feat: ["可用於治療{{呼吸道感染|疾病}}", "對 G(-) 效果差，但加強了 {{G(+)|名詞}} 的抗菌效果；抗菌範圍介於二代及四代之間（第 54 頁）"] });
dA(6, "Quinolones", 53, "gatifloxacin", "Gatifloxacin", null, {
  cls: ["3rd Quinolone"], feat: ["可用於治療呼吸道感染", "造成 {{QT 延長|副作用}}"] });
dA(6, "Quinolones", 53, "gemifloxacin", "Gemifloxacin", null, {
  cls: ["3rd Quinolone"], feat: ["可用於治療呼吸道感染", "造成 QT 延長"] });
dA(6, "Quinolones", 53, "moxifloxacin", "Moxifloxacin", null, {
  cls: ["4th Quinolone"],
  feat: ["由{{肝臟|器官}}代謝", "服藥後尿中藥物濃度不足，不建議用於{{泌尿道感染|疾病}}", "副作用：易引起 {{Torsade de point|副作用}}", "抗 G(+) 效果更強，可對抗{{厭氧菌|名詞}}；無法殺綠膿桿菌（第 54 頁）"] });
kA(6, "影響 DNA 的合成（Quinolones）", 54, "Quinolone 抗菌整理", { table: { head: [{ t: "Quinolone 抗菌整理", cs: 2 }], cols: ["", "抗菌範圍"], rows: [
  [{ t: "第二代 Ciprofloxacin", b: true }, "對於 G(-) 的效果{{最強|性質}}（包含綠膿桿菌）"],
  [{ t: "第三代 Levofloxacin", b: true }, "對 G(-) 效果差，但加強了 {{G(+)|名詞}} 的抗菌效果\n抗菌範圍介於二代及四代之間"],
  [{ t: "第四代 Moxifloxacin", b: true }, "抗 G(+) 效果更強，可對抗{{厭氧菌|名詞}}\n無法殺綠膿桿菌。因在泌尿道濃度不足，不用於{{泌尿道感染|疾病}}"] ] } });
kA(6, "影響 DNA 的合成（Quinolones）", 54, "可抗綠膿桿菌的抗生素", { table: { head: ["抗生素", { t: "可抗綠膿桿菌", cs: 2 }], cols: ["抗生素", "", "可抗綠膿桿菌"], rowNames: ["Penicillins", "Cephalosporins 第三代", "Cephalosporins 第四代", "Fluoroquinolones", "Aminoglycosides"],
  rows: [
  [{ t: "Penicillins", b: true }, { t: "含 {{COOH、尿素|結構}}", cs: 2 }],
  [{ t: "Cephalosporins", b: true, rs: 2 }, "第三代", "{{Ceftazidime、Cefoperazone|藥名}}"],
  [null, "第四代", "{{Cefpirome、Cefepime|藥名}}"],
  [{ t: "Fluoroquinolones", b: true }, { t: "{{Ciprofloxacin|藥名}}（最強）、Levofloxacin", cs: 2 }],
  [{ t: "Aminoglycosides", b: true }, { t: "", cs: 2 }] ] } });
kA(6, "抑制葉酸合成", 55, "抑制葉酸合成之抗生素藥物", [
  "PABA + Pteridine —（{{Dihydropteraoate synthase|酵素}}）→ Dihydropteroic acid；⊖ {{Sulfonamides|藥物類別}} 類（Sulfamethoxazole）",
  "Dihydropteroic acid + {{Glutamic acid|物質}} → Dihydrofolic acid",
  "Dihydrofolic acid —（{{Dihydrofolate reductase|酵素}}）→ Tetrahydrofolic acid；⊖ {{Trimethoprim|藥名}}"
]);
kA(6, "抑制葉酸合成", 56, "Sulfonamides 藥理特色", [
  "機轉：因為結構類似 p-Aminobenzoic acid（{{PABA|物質}}），因而競爭抑制 Dihydropteroate synthetase（{{二氫蝶酸合成酶|酵素}}）",
  "抗菌範圍：廣效型抗生素，用於{{泌尿道感染、瘧疾|疾病}}",
  "副作用：在{{酸性|性質}}環境易產生結晶尿，Sulfisoxazole、Sulfamethoxazole 較不會產生結晶尿、溶血性貧血、新生兒服用會導致{{核黃疸|副作用}}的產生"
]);
dA(6, "Sulfonamides", 56, "sulfamethoxazole", "Sulfamethoxazole", null, {
  cls: ["Sulfonamides"], struct: ["字尾 oxazole 雜環卻是 {{isoxazole|結構}}"] });
dA(6, "Sulfonamides", 56, "sulfisoxazole", "Sulfisoxazole", null, {
  cls: ["Sulfonamides"], feat: ["{{最不容易造成結晶尿|性質}}", "代謝：N 上{{乙醯化|名詞}}"] });
dA(6, "Sulfonamides", 56, "sulfamethizole", "Sulfamethizole", null, {
  cls: ["Sulfonamides"], struct: ["雜環：{{Thiadiazole|結構}}"] });
dA(6, "Sulfonamides", 56, "sulfadiazine", "Sulfadiazine", null, {
  cls: ["Sulfonamides"], struct: ["雜環：{{Pyrimidine|結構}}", "+CH3 → {{Sulfamerazine|藥名}}", "+CH3×2 → {{Sulfamethazine|藥名}}"] });
dA(6, "Sulfonamides", 56, "mafenide", "Mafenide", null, {
  cls: ["Sulfonamides"], struct: ["Mafenide 不具 {{Aniline|結構}} 結構"], feat: ["用於{{燒燙傷|疾病}}"] });
dA(6, "Sulfonamides", 56, "silver-sulfadiazine", "Silver Sulfadiazine", null, {
  cls: ["Sulfonamides"], struct: ["Silver Sulfadiazine 具 {{Pyrimidine|結構}} 環"], feat: ["用於燒燙傷"] });
dA(6, "Sulfonamides", 56, "sulfacetamide", "Sulfacetamide sodium", "Sulfacetamide", {
  cls: ["Sulfonamides"], feat: ["治療{{細菌性結膜炎（砂眼）|疾病}}"] });
dA(6, "Sulfonamides", 56, "sulfasalazine", "Sulfasalazine", null, {
  cls: ["Sulfonamides"],
  feat: ["{{Mesalamine|藥名}}（消炎）+ {{Sulfapyridine|藥名}}（殺菌）", "Prodrug，由直腸 {{Azo reductase|酵素}} 分解", "治療{{潰瘍性結腸炎|疾病}}、類風溼性關節炎"] });
dA(6, "Sulfonamides", 56, "sulfadoxine", "Sulfadoxine", null, {
  cls: ["Sulfonamides"], struct: ["含有 Pyrimidine"], feat: ["常併用 {{Pyrimethamine|藥名}} 治瘧疾"] });
dA(6, "抑制葉酸合成", 56, "trimethoprim", "Trimethoprim", null, {
  cls: ["機轉：抑制 {{Dihydrofolate reductase|酵素}}"],
  feat: ["Trimethoprim-Sulfamethoxazole（= {{Co-trimoxazole|藥名}} = Baktar）劑量比例 {{1:5|數值}}，可治療{{卡氏肺囊蟲肺炎|疾病}}"] });
dA(6, "其他類抗生素", 57, "nitrofurantoin", "Nitrofurantoin", null, {
  cls: ["其他類抗生素"], feat: ["用於治療{{泌尿道感染|疾病}}（第二線用藥）"] });
dA(6, "其他類抗生素", 57, "methenamine", "Methenamine", null, {
  cls: ["其他類抗生素"],
  struct: ["具有 {{4|數值}} 個氮原子"],
  feat: ["用於治療泌尿道感染", "在{{酸性|性質}}環境中，可分解出 6 分子{{甲醛|物質}}，因而具有殺菌作用"] });
dA(6, "其他類抗生素", 57, "dapsone", "Dapsone", null, {
  cls: ["機轉：抑制 {{Dihydropteroate synthetase|酵素}}"],
  feat: ["副作用：{{變性血紅素血症|副作用}}、痲瘋結節性紅斑"] });

/* ===== 第 7 章 抗黴菌 ===== */
chA(7, "07", "抗黴菌", "58～61");
kA(7, "抗黴菌作用點", 58, "Mode of Action of Antifungal Drugs（圖）", [
  "細胞壁：抑制 {{β(1,3)-glucan synthase|酵素}}：Echinocandins（{{Caspofungin、Anidulafungin|藥名}}）",
  "細胞膜：Polyenes（{{Amphotericin B、Nystatin|藥名}}）⊖ 組成細胞膜（與 Ergosterol 結合）",
  "Azoles（Ketoconazole、Itraconazole、Fluconazole、Voriconazole）⊖ Lanosterol {{14α-demethylase|酵素}}（Lanosterol → Ergosterol）",
  "Allylamine（{{Terbinafine、Tolnaftate、Naftifine|藥名}}）⊖ {{Squalene epoxidase|酵素}}（Squalene → Squalene epoxide）",
  "抑制細胞分裂（微管）：{{Griseofulvin|藥名}}",
  "抑制 DNA 合成：{{Flucytosine（5-FC）|藥名}}"
]);
dA(7, "Allylamine", 59, "terbinafine", "Terbinafine", null, {
  cls: ["Allylamine：抑制 {{Squalene epoxidase|酵素}}"],
  feat: ["{{Butenafine、naftifine、tolnaftate|藥名}} 為相同機轉"] });
dA(7, "Azole 類", 59, "ketoconazole", "Ketoconazole", null, {
  cls: ["Azole 類：抑制 {{14α-demethylase|酵素}}，阻斷 ergosterol 的生成"],
  feat: ["抗黴菌機轉：抑制 Lanosterol 14α-demethylase", "抑制類固醇的合成，治療 {{Cushing's syndrome|疾病}}", "抑制雄性素合成：治療{{多毛症、攝護腺癌|疾病}}", "在{{酸性|性質}}條件下較容易吸收", "副作用：{{男性女乳症|副作用}}、肝毒性", "屬於 {{CYP3A4|酵素}} 的抑制劑"] });
dA(7, "Azole 類", 59, "clotrimazole", "Clotrimazole", null, {
  cls: ["Azole 類"], struct: ["含有 {{Imidazole|結構}}"], feat: ["用於{{陰道念珠菌|疾病}}感染局部治療"] });
dA(7, "Azole 類", 59, "itraconazole", "Itraconazole", null, {
  cls: ["Azole 類"], struct: ["含有 {{2|數值}} 個 Triazole 環"],
  feat: ["此藥會受食物影響（{{胃酸分泌增加|名詞}}）而增加吸收"] });
dA(7, "Azole 類", 59, "fluconazole", "Fluconazole", null, {
  cls: ["Azole 類"], struct: ["含有 2 個 Triazole"],
  feat: ["主要由{{腎臟|器官}}排泄（F 想成 Fluid）", "Azole 類大多由肝排除，Fluconazole 由腎排除"] });
dA(7, "Azole 類", 59, "voriconazole", "Voriconazole", null, {
  cls: ["Azole 類"], struct: ["含有 {{1|數值}} 個 Triazole"],
  feat: ["易引起{{視覺障礙|副作用}}（V 想成 Vision）"] });
dA(7, "Polyene 多烯類", 60, "amphotericin-b", "Amphotericin B", null, {
  cls: ["Polyene 多烯類：干擾細胞膜的{{通透性|名詞}}"],
  struct: ["含有 {{Heptaene|結構}}，醣分子為 {{Mycosamine|結構}}"],
  feat: ["屬於{{殺菌型|性質}}抗黴菌藥物", "屬於{{兩性物質|性質}}，無法通過 BBB", "治療 {{Cryptococcus neoformans|名詞}}（新型隱球菌）感染", "副作用：{{腎毒性|副作用}}，因此以脂質為載體，製成針劑以降低副作用", "臨床上以 {{Glucose|物質}} 稀釋，進行靜脈注射"] });
dA(7, "Polyene 多烯類", 60, "nystatin", "Nystatin", null, {
  cls: ["Polyene 多烯類"], struct: ["屬巨內酯（{{Macrolactone|結構}}）化合物"], feat: ["機轉為干擾細胞膜"] });
dA(7, "Echinocandin（環狀胜肽類）", 60, "caspofungin", "Caspofungin", null, {
  cls: ["Echinocandin：抑制 {{β-glucan synthase|酵素}}，進而抑制細胞壁生成"],
  feat: ["治療新型隱球菌{{無效|性質}}", "{{靜脈注射|給藥途徑}}給藥", "IV 太快會造成{{組織胺釋放|副作用}}（Vancomycin 有相同副作用）"] });
dA(7, "Echinocandin（環狀胜肽類）", 60, "anidulafungin", "Anidulafungin", null, {
  cls: ["Echinocandin"], feat: ["以{{靜脈注射|給藥途徑}}給藥"] });
dA(7, "Pyrimidine 衍生物", 60, "flucytosine", "Flucytosine", null, {
  cls: ["{{Pyrimidine|結構}} 衍生物：抑制 {{Thymidine synthetase|酵素}}"],
  feat: ["經由黴菌 {{Cytosine deaminase|酵素}} 活化後代謝為 5-Fluorouracil，再轉變為 5-FdUMP", "副作用：{{骨髓抑制|副作用}}"] });
dA(7, "抑制有絲分裂", 60, "griseofulvin", "Griseofulvin", null, {
  cls: ["機轉：抑制{{有絲分裂|名詞}}"],
  struct: ["具有 {{Spirocarbon、Benzofuran|結構}}"],
  feat: ["屬於{{全身性|性質}}抗黴菌製劑", "{{高脂溶性|性質}}的食物可以幫助吸收", "屬於天然抗生素"] });
dA(7, "其他抗黴菌", 61, "amorolfine", "Amorolfine", null, {
  cls: ["機轉：抑制 {{Δ14-reductase|酵素}} 及 Δ8，Δ7-isomerase"], feat: ["{{局部|給藥途徑}}使用"] });
dA(7, "其他抗黴菌", 61, "ciclopirox", "Ciclopirox", null, {
  cls: ["機轉：{{螯合陽離子|名詞}}"], struct: ["結構具有 {{Hydroxylated pyridinone|結構}}"] });
dA(7, "Azole 類", 61, "isavuconazole", "Isavuconazole", null, {
  cls: ["Azole 類"], struct: ["Triazole×1"], feat: ["肝代謝，不過 BBB", "{{半衰期最長|性質}}"] });
kA(7, "Azole 類比較", 61, "Azole 類比較表", { table: { head: ["", "結構特色", "代謝", "過 BBB", "藥理特色"], rows: [
  [{ t: "Ketoconazole", b: true }, "{{Imidazole|結構}}*1", "肝", "X", "男性女乳症"],
  [{ t: "Itraconazole", b: true }, "Triazole*2", "肝", "X", ""],
  [{ t: "Fluconazole", b: true }, "Triazole*2", "{{腎|器官}}", "{{O|性質}}", "{{DDI 較少|性質}}"],
  [{ t: "Voriconazole", b: true }, "Triazole*1", "肝", "O", "{{視覺障礙|副作用}}"],
  [{ t: "Isavuconazole", b: true }, "Triazole*1", "肝", "X", "{{半衰期最長|性質}}"] ] } });

/* ===== 第 8 章 抗肺結核藥物 ===== */
chA(8, "08", "抗肺結核藥物", "62～64");
kA(8, "抗肺結核藥物作用點", 62, "作用點、機轉與藥物", [
  "抑制細胞壁合成：抑制 {{Mycolic acid|物質}}：抑制 {{enoyl reductase|酵素}} → Isoniazid、Ethionamide",
  "抑制 Arabinogalactan：抑制 {{Arabinosyl transferase|酵素}} → {{Ethambutol|藥名}}",
  "抑制 Peptidoglycan：抑制 {{D-alanine racemase|酵素}} → Cycloserine",
  "抑制細胞膜：機轉不明 → {{Pyrazinamide|藥名}}",
  "抑制葉酸合成：抑制 Dihydropteroate synthetase → Para-Aminosalicylic acid（{{PAS|藥名}}）",
  "抑制 DNA & RNA：抑制 {{DNA-dependent RNA polymerase|酵素}} → Rifampin；抑制 DNA gyrase → Floroquinolone（對抗分枝桿菌，結構須含 {{F|結構}}）",
  "抑制 RNA 轉譯：抑制 30S → {{Streptomycin|藥名}}"
]);
dA(8, "第一線用藥", 63, "isoniazid", "Isoniazid", null, {
  cls: ["機轉：抑制細胞壁 {{Mycolic acid|物質}} 的合成"],
  feat: ["機轉：經 {{KatG|酵素}} 活化生成 Nicotinoyl radical，進而抑制 enoyl acyl carrier protein reductase（{{InhA|酵素}}）和 β-ketoacyl-cyl carrier protein synthase（KasA）",
    "本身為 Prodrug，由 {{N-acetyl transferase|酵素}} 乙醯化後再水解，生成 {{Acetylhydrazine|物質}} 為肝毒代謝物",
    "副作用：肝炎、Lupus-like syndrome → {{慢速乙醯化者|族群}}易產生；周邊神經炎 → 以 {{Vit B6（Pyridoxine）|藥名}} 預防",
    "為 {{CYP3A4 抑制劑|名詞}}", "屬於{{殺菌型|性質}}抗生素"] });
dA(8, "第一線用藥", 63, "rifampin", "Rifampin", null, {
  cls: ["機轉：以 {{Naphthalene|結構}} 抑制 {{DNA-dependent RNA polymerase|酵素}}"],
  feat: ["可以通過 BBB 治療{{腦脊髓膜炎|疾病}}", "主要代謝反應：Deacetylation（{{C-25|結構}} 脫乙醯基）；另經酸水解可得 3-formylrifamycin SV", "為 CYP3A4 {{誘導劑|名詞}}", "副作用：尿液{{橘紅（Red）色|副作用}}、肝毒性、Flu-like syndrome", "酵素誘導強弱：Rifampin > {{Rifapentine|藥名}} > Rifabutin"] });
dA(8, "第一線用藥", 63, "ethambutol", "Ethambutol", null, {
  cls: ["機轉：抑制細胞壁 {{Arabinogalactan|物質}} 的合成"],
  feat: ["副作用：{{高尿酸血症|副作用}}、視（Eye）神經炎", "由{{腎|器官}}排除"] });
dA(8, "第一線用藥", 63, "pyrazinamide", "Pyrazinamide", null, {
  cls: ["機轉：抑制{{細胞膜|名詞}}"],
  feat: ["是 {{Nicotinamide|物質}} 之 bioisostere", "本身為 Prodrug，在{{酸性|性質}}條件下水解為活性型 {{Pyrazinoic acid|物質}}", "副作用：肝毒性、{{高尿酸血症|副作用}}"] });
mA("streptomycin", 64, { feat: ["抗肺結核第二線用藥：抑制 30s 核醣體", "副作用：{{腎耳毒性|副作用}}"] });
dA(8, "第二線用藥", 64, "capreomycin", "Capreomycin", null, {
  cls: ["抑制{{蛋白質合成|名詞}}"], struct: ["具有 {{4|數值}} 個 Cyclic peptides"] });
dA(8, "第二線用藥", 64, "ethionamide", "Ethionamide（ETA）", "Ethionamide", {
  cls: ["屬於第二線藥物"],
  feat: ["氧化生成 {{Ethionamide sulfoxide|物質}} 抑制細胞壁合成"] });
kA(8, "抗肺結核藥物毒性", 64, "抗肺結核藥物毒性整理（From 阿摩）", { table: { head: [{ t: "抗肺結核藥物毒性整理（From 阿摩）", cs: 2 }], cols: ["", "藥物"], rows: [
  [{ t: "肝毒性", b: true }, "為他 R.I.P（{{Rifampin、Isoniazid、Pyrazinamide|藥名}}）"],
  [{ t: "高尿酸", b: true }, "痛風（尿酸過高）歌手出 EP（{{Ethambutol、Pyrazinamide|藥名}}）"] ] } });

/* ===== 第 9 章 抗寄生蟲感染藥物 ===== */
chA(9, "09", "抗寄生蟲感染藥物", "65～68", "第 67～68 頁是第 65～66 頁的重拍，內容相同。");
dA(9, "阿米巴原蟲、陰道滴蟲、梨形鞭毛蟲", 65, "metronidazole", "Metronidazole", null, {
  cls: ["用於{{阿米巴原蟲、陰道滴蟲|疾病}}、梨形鞭毛蟲的感染"],
  feat: ["經由{{還原反應|名詞}}產生活性", "經代謝後，產生 {{acetamide 及 oxalate|物質}} 衍生物", "可用於{{厭氧菌|名詞}}、困難梭菌、鬆脆桿菌的感染", "與酒精併用會發生 {{Disulfiram-like|副作用}}"] });
mA("trimethoprim", 65, { feat: ["機轉：Trimethoprim 抑制{{二氫葉酸還原酶|酵素}}，Sulfamethoxazole 抑制{{二氫蝶酸合成酶|酵素}}（抗寄生蟲章）"] });
dA(9, "卡式肺囊蟲肺炎", 65, "pentamidine", "Pentamidine Isethionate", "Pentamidine", {
  cls: ["用於卡式肺囊蟲肺炎"],
  feat: ["機轉：抑制卡式肺囊蟲之 {{Topoisomerase|酵素}}", "靜脈注射太快會導致 {{Histamine|物質}} 大量釋出"] });
dA(9, "卡式肺囊蟲肺炎", 65, "atovaquone", "Atovaquone", null, {
  cls: ["用於卡式肺囊蟲肺炎"], feat: ["機轉：抑制 {{Ubiquinone reductase|酵素}}"] });
dA(9, "抗瘧疾", 65, "primaquine", "Primaquine", null, {
  cls: ["抗瘧疾"], struct: ["骨架：{{8-Aminoquinolines|結構}}"],
  feat: ["副作用：{{G6PD 缺乏|族群}}患者，使用後會造成溶血"] });
dA(9, "抗瘧疾", 65, "tafenoquine", "Tafenoquine", null, {
  cls: ["抗瘧疾"], struct: ["骨架：8-aminoquinoline"],
  feat: ["為前驅藥物，可經 {{CYP2D6|酵素}} 代謝", "作用於{{肝臟休眠期|名詞}}的寄生蟲"] });
dA(9, "抗瘧疾", 65, "atovaquone-proguanil", "Atovaquone-Proguanil", null, {
  cls: ["抗瘧疾"],
  feat: ["Atovaquone 可抑制 Ubiquinone reductase", "Proguanil 為前驅藥經 {{2C19|酵素}} 代謝生成 {{Cycloguanil|物質}} 可抑制二氫葉酸還原酶", "屬於瘧疾{{預防性|性質}}藥物"] });
dA(9, "錐形蟲（Trypanosomiasis）", 66, "suramin", "Suramin", null, {
  cls: ["用於錐形蟲"],
  struct: ["結構具有 {{Bis hexasulfonated naphthylurea|結構}}"],
  feat: ["機轉：抑制 {{Dihydrofolate reductase 及 Thymidine kinase|酵素}}"] });
dA(9, "錐形蟲（Trypanosomiasis）", 66, "eflornithine", "Eflornithine", null, {
  cls: ["用於錐形蟲"],
  feat: ["機轉：利用 {{Difluoromethyl|結構}} 不可逆抑制 {{Ornithine decarboxylase|酵素}}"] });
dA(9, "錐形蟲（Trypanosomiasis）", 66, "melarsoprol", "Melarsoprol", null, {
  cls: ["用於錐形蟲"], struct: ["具有{{砷|結構}}原子"],
  feat: ["屬於前驅藥", "機轉：體內代謝為 Melarsin oxide 再與蟲體 {{Pyruvate kinase|酵素}} protein-SH 結合，或抑制 {{Trypanothione reductase|酵素}}"] });
dA(9, "錐形蟲（Trypanosomiasis）", 66, "nifurtimox", "Nifurtimox", null, {
  cls: ["用於錐形蟲"],
  feat: ["屬於前驅藥", "機轉：結構中 {{-NO2|結構}} 經還原形成自由基以破壞錐蟲體 DNA，或抑制 Trypanothione reductase"] });
dA(9, "蠕蟲感染", 66, "ivermectin", "Ivermectin", null, {
  cls: ["用於蠕蟲感染"],
  feat: ["機轉：加強寄生蟲 {{GABA|物質}} 神經傳遞，降低蟲體活動力", "用於治療{{蟠尾絲蟲病（Onchocerciasis）|疾病}}"] });
dA(9, "蠕蟲感染", 66, "praziquantel", "Praziquantel", null, {
  cls: ["用於蠕蟲感染"], struct: ["為 {{Isoquinoline|結構}} 衍生物"],
  feat: ["機轉：增加{{鈣離子|物質}}穿透寄生蟲細胞膜", "用來治療{{住血吸蟲（Schistosoma）|疾病}}之感染"] });
dA(9, "蠕蟲感染", 66, "mebendazole", "Mebendazole", null, {
  cls: ["用於蠕蟲感染"],
  feat: ["機轉：抑制{{微管|名詞}}合成及抑制 {{Fumarate reductase|酵素}}", "是治療{{鞭蟲|疾病}}感染之首選藥物", "{{孕婦|族群}}不可使用"] });

/* ================= 自主神經島（10～13） ================= */
isleA("autonomic", "自主神經島", { ground: "#B9D7A8", light: "#CDE4BF", cliff: "#8DB17A" });

/* ===== 第 10 章 交感神經系統藥物 ===== */
chA(10, "10", "交感神經系統藥物", "69～83", "第 76 頁是第 75 頁的重拍。");
kA(10, "自主神經總覽", 69, "交感、副交感、體神經", { images: ["assets/amulet/fig/ans.png"], table: {
  head: [[{ t: "", rs: 2 }, { t: "節前", cs: 2 }, null, { t: "節後", cs: 2 }, null], [null, "神經傳導物質", "受體", "神經傳導物質", "受體"]],
  cols: ["", "節前神經傳導物質", "節前受體", "節後神經傳導物質", "節後受體"], rows: [
  [{ t: "交感神經", b: true }, "Ach", "{{Nn(N1)|標的}}", "{{Norepinephrine|物質}}", "α、β"],
  [{ t: "副交感神經", b: true }, "Ach", "Nn(N1)", "Ach", "{{M|標的}}"],
  [{ t: "體神經", b: true }, { t: "無神經節", cs: 2 }, null, "Ach", "{{Nm(N2)|標的}}"] ] } });
kA(10, "自主神經總覽", 70, "交感神經與副交感神經", { table: {
  head: [[{ t: "交感神經與副交感神經", cs: 3 }, null, null], ["分布器官", "交感神經（白天）", "副交感神經（晚上）"]],
  cols: ["分布器官", "交感神經（白天）", "副交感神經（晚上）"], rows: [
  [{ t: "眼睛", b: true }, "{{散瞳|名詞}}", "{{縮瞳|名詞}}"],
  [{ t: "支氣管", b: true }, "擴張", "{{收縮|名詞}}"],
  [{ t: "心臟", b: true }, "強而有力", "{{緩慢|名詞}}"],
  [{ t: "腸胃道", b: true }, "腸胃蠕動↓", "腸胃蠕動{{↑|名詞}}"],
  [{ t: "膀胱、直腸", b: true }, "不排尿、不排便", "排尿、排便"],
  [{ t: "性器官", b: true }, "{{射精|名詞}}", "{{勃起|名詞}}"],
  [{ t: "液體", b: true }, "少、稠", "多、稀"],
  [{ t: "節前神經長短", b: true }, "節前{{較短|性質}}", "節前較長"] ] } });
kA(10, "自主神經總覽", 70, "接受器與生理作用綜合藥物機轉整理", { table: {
  head: [[{ t: "接受器與生理作用綜合藥物機轉整理", cs: 5 }, null, null, null, null], ["接受器", "生理作用", "作用劑", "阻斷劑", "非選擇性阻斷劑"]],
  cols: ["接受器", "生理作用", "作用劑", "阻斷劑", "非選擇性阻斷劑"],
  rowNames: ["刺激α1", "刺激α1", "刺激α1", "刺激α2", "刺激α2", "刺激α2", "刺激β1", "刺激β1", "刺激β2", "刺激β2", "刺激β3", "刺激β3", "刺激 D1", "刺激 D2"], rows: [
  [{ t: "刺激α1", b: true, rs: 3 }, "散瞳", { t: "{{Phenylephrine|藥名}}", rs: 3 }, { t: "{{Prazosin|藥名}}", rs: 3 }, { t: "{{Tolazoline|藥名}}\n{{Phentolamine|藥名}}\n{{Phenoxybenzamine|藥名}}", rs: 5 }],
  [null, "心臟、血管收縮", null, null, null],
  [null, "前列腺收縮（α1A）", null, null, null],
  [{ t: "刺激α2", b: true, rs: 3 }, "抑制神經傳遞物質釋放", "{{Clonidine|藥名}}", { t: "{{Yohimbine|藥名}}", rs: 2 }, null],
  [null, "使眼睛內血管收縮，因此可減少眼房水分泌", "{{Apraclonidine|藥名}}", null, null],
  [null, "血小板凝集", { t: "", cs: 3 }, null, null],
  [{ t: "刺激β1", b: true, rs: 2 }, "{{Renin|物質}} 釋放", { t: "Dobutamine", rs: 2 }, { t: "{{Atenolol|藥名}}", rs: 2 }, { t: "{{Propranolol|藥名}}", rs: 4 }],
  [null, "心臟收縮", null, null, null],
  [{ t: "刺激β2", b: true, rs: 2 }, "血管、氣管平滑肌擴張", "Salbutamol", { t: "Butoxamine", rs: 2 }, null],
  [null, "子宮平滑肌擴張", "{{Ritodrine|藥名}}", null, null],
  [{ t: "刺激β3", b: true, rs: 2 }, "脂肪分解", { t: "{{Mirabegron|藥名}}\n（治膀胱過動症）", rs: 2 }, { t: "", rs: 2 }, { t: "", rs: 2 }],
  [null, "逼尿肌鬆弛", null, null, null],
  [{ t: "刺激 D1", b: true }, "擴張腎臟血管平滑肌", "{{Fenoldopam|藥名}}", "", ""],
  [{ t: "刺激 D2", b: true }, "調節神經傳遞物質的釋放", "{{Bromocriptine|藥名}}", "{{Chlorpromazine|藥名}}", ""] ] } });
kA(10, "NE 生合成、代謝與 SAR", 71, "NE 生合成", { table: { cols: ["", "NE 生合成"], rowNames: ["NE 生合成", "生合成路徑"], rows: [
  [{ t: "NE 生合成", b: true }, "✧ Dopamine 可由 L-Dopa 經 {{Decarboxylation|名詞}} 反應而產生\n✧ {{Tyrosine|物質}} 是腎上腺素和正腎上腺素生合成的前驅物"],
  [{ t: "Tyrosine → DOPA → Dopamine → Norepinephrine → Epinephrine", img: "assets/amulet/fig/ne-syn.png", wide: true, cs: 2 }, null] ] } });
kA(10, "NE 生合成、代謝與 SAR", 71, "NE 代謝", { table: { cols: ["", "酵素", "", "代謝方式", "代謝受質"], rowNames: ["", "MAO-A", "MAO-B", "COMT", ""], rows: [
  [{ t: "NE 代謝", b: true, rs: 4 }, { t: "酵素", b: true, cs: 2 }, null, { t: "代謝方式", b: true }, { t: "代謝受質", b: true }],
  [null, { t: "MAO", rs: 2 }, "MAO-A", { t: "進行{{氧化去胺|名詞}}", rs: 2 }, "NE、{{Serotonin|物質}}"],
  [null, null, "MAO-B", null, "{{Dopamine|物質}}"],
  [null, { t: "COMT", cs: 2 }, null, "Catechol 間位{{氧甲基化|名詞}}（苯環 C-3 位）", ""],
  [{ t: "Norepinephrine → 3,4-Dihydroxymandelic acid → Vanillylmandelic acid", img: "assets/amulet/fig/ne-met.png", wide: true, cs: 5 }, null, null, null, null] ] } });
kA(10, "NE 生合成、代謝與 SAR", 71, "擬交感神經作用劑 SAR", { table: { cols: ["", "位置", "取代基", "藥化特色"], rowNames: ["", "R1", "R1", "R2 接上甲基", "R2 接上乙基", "芳香環"], rows: [
  [{ t: "擬交感神經\n作用劑 SAR", b: true, rs: 6 }, { t: "位置", b: true }, { t: "取代基", b: true }, { t: "藥化特色", b: true }],
  [null, { t: "R1", rs: 2 }, { t: "N 上取代基越大", rs: 2 }, "對受體選擇性越偏向 {{β|標的}}"],
  [null, null, null, "越不容易被 {{MAO|酵素}} 代謝"],
  [null, { t: "R2", rs: 2 }, "接上甲基", "{{α2|標的}} receptor 活性增加，不易被 MAO 代謝"],
  [null, null, "接上乙基", "{{β|標的}} receptor 活性增加，不易被 MAO 代謝"],
  [null, "芳香環", "結構沒有 {{Catechol|結構}}", "就不會被 COMT 代謝"] ] }, images: ["assets/amulet/ne-sar.png"] });
kA(10, "作用於交感神經系統的藥物", 72, "作用點（Medical Pharmacology at a Glance 圖）", { images: ["assets/amulet/fig/sym-drugs.png"], table: { head: ["藥物", "機轉"], rows: [
  [{ t: "Amphetamine", b: true }, "藉由 {{NET|標的}} 當作運輸管道，\n抑制 {{VMAT|標的}} 使 NE 無法進入突觸囊泡"],
  [{ t: "Cocaine", b: true }, "抑制 NET，對 VMAT {{無效果|性質}}"] ] } });
kA(10, "交感神經接受器", 73, "α 接受器", { table: { head: ["名稱", "位置", "作用"], rows: [
  [{ t: "α1", b: true }, "{{突觸後|名詞}}細胞膜上", "作用在 {{Gq|標的}} → 活化 Phospholipase C → PIP2 → DAG + IP3 → 細胞內 Ca2+ 增加\n→ 血管收縮、平滑肌收縮 → 使血壓上升"],
  [{ t: "α2", b: true }, "{{突觸前|名詞}}神經末梢", "作用在 {{Gi|標的}} → 抑制 Adenylyl cyclase → cAMP↓ → 抑制 Norepinephrine 釋放\n→ 血管、平滑肌擴張 → 使血壓下降"] ] } });
kA(10, "交感神經接受器", 73, "β 接受器", { table: { head: ["名稱", "位置", "生理機轉", "接收器作用機轉"], rows: [
  [{ t: "β1", b: true }, "心臟", "1. 使心跳速率、心臟收縮力增加\n2. 增加{{腎素（renin）|物質}}分泌", { t: "1. 作用在 {{Gs|標的}} → 活化 Adenylyl cyclase → cAMP↑\n2. cAMP 會被 PDE 代謝，{{Theophylline|藥名}} 為 PDE 的抑制劑，會讓 cAMP 上升，可作為氣喘藥物（作用在 β2）\n3. 氣喘用藥：M-antagonist、β-agonist、PDE inhibitor、{{Adenosine antagonist|藥物類別}}\n4. {{Glucagon|藥名}} 會作用在 Glucagon receptor 產生強心作用，可拮抗 β-blocker 中毒時的心臟症狀", rs: 3 }],
  [{ t: "β2", b: true }, "平滑肌", "1. 血管、氣管擴張\n2. 增加升醣素分泌，造成肝醣分解\n3. 增加胰島素分泌\n4. 放鬆{{子宮平滑肌|器官}}", null],
  [{ t: "β3", b: true }, "脂肪細胞", "1. 促進脂肪分解\n2. {{逼尿肌鬆弛|名詞}}", null] ] } });
kA(10, "交感神經接受器", 73, "接受器親和力比較", { table: { head: ["接收器親和力比較"], rowNames: ["α-receptor", "β1-receptor", "β2-receptor"], rows: [
  ["α-receptor：{{Epinephrine ≧ Norepinephrine ≫ Isoproterenol|名詞}}"],
  ["β1-receptor：{{Isoproterenol > Epinephrine ≧ Norepinephrine|名詞}}"],
  ["β2-receptor：{{Isoproterenol > Epinephrine ≫ Norepinephrine|名詞}}"] ] } });
kA(10, "眼科用藥", 74, "青光眼藥物統整", { table: { head: ["眼房水", "機轉", "藥理分類", "藥物"],
  rowNames: ["α2-agonists", "β-blockers", "Carbonic anhydrase inhibitors", "M-agonist", "AchE inhibitors", "Prostaglandins", "交感神經藥物"], rows: [
  [{ t: "減少\n眼房水生成", b: true, rs: 3 }, { t: "血管擴張造成眼房水滲出，\n因此血管收縮→減少眼房水生成", rs: 3 }, "α2-agonists", "{{Apraclonidine、Brimonidine|藥名}}"],
  [null, null, "β-blockers", "Metipranolol、Levobunolol\n{{Timolol|藥名}}、Carteolol、Betaxolol"],
  [null, null, "Carbonic anhydrase inhibitors", "{{Dorzolamide、Brinzolamide|藥名}}"],
  [{ t: "增加\n眼房水排除", b: true, rs: 4 }, { t: "睫狀肌收縮\n→打開許萊姆氏管\n→幫助眼房水的排除", rs: 2 }, "M-agonist", "{{Pilocarpine、Carbachol|藥名}}"],
  [null, null, "AchE inhibitors", "Physostigmine、Isoflurophate"],
  [null, "打開葡萄膜鞏膜\n→幫助眼房水的排除", "{{Prostaglandins|藥物類別}}\n（副作用：{{睫毛增生|副作用}}）", "Bimatoprost、Latanoprost、Travoprost、Unoprostone\n（白拉他翠 U）"],
  [null, "", "交感神經藥物", "{{Epinephrine、Dipivefrin|藥名}}"] ] } });
kA(10, "眼科用藥", 74, "散瞳縮瞳藥物統整", { table: { cols: ["瞳孔", "藥理分類", "藥物"], rowNames: ["瞳孔示意圖", "", "散瞳", "散瞳", "縮瞳", "縮瞳"], rows: [
  [{ t: "瞳孔示意圖", b: true }, { t: "副交感神經刺激 → 瞳孔縮小；交感神經刺激 → 瞳孔放大", img: "assets/amulet/fig/pupil.png", wide: true, cs: 2 }, null],
  [{ t: "瞳孔", b: true }, { t: "藥理分類", b: true }, { t: "藥物", b: true }],
  [{ t: "散瞳", b: true, rs: 2 }, "M-antagonist", "{{Atropine、Tropicamide|藥名}}"],
  [null, "α1-agonist", "{{Phenylephrine|藥名}}"],
  [{ t: "縮瞳", b: true, rs: 2 }, "M-agonist", "{{Pilocarpine、Physostigmine|藥名}}"],
  [null, "{{α1-antagonist|藥物類別}}", ""] ] } });
dA(10, "影響 catecholamine 生合成", 75, "metyrosine", "Metyrosine", null, {
  cls: ["影響 catecholamine 生合成"],
  feat: ["抑制 {{Tyrosine hydroxylase|酵素}}", "用於{{嗜鉻細胞瘤|疾病}}"] });
dA(10, "影響 catecholamine 生合成", 75, "methyldopa", "Methyldopa", null, {
  cls: ["影響 catecholamine 生合成"],
  feat: ["{{孕婦|族群}}治療高血壓首選藥", "{{α-methylnorepinephrine|物質}} 為活性代謝物，可當作假的傳遞物質，刺激 {{α2|標的}}-receptor", "副作用：肝毒性、{{溶血性貧血、男性女乳症|副作用}}", "抑制 {{Dopa decarboxylase|酵素}}"] });
dA(10, "抑制神經傳遞物質儲存與釋放", 75, "reserpine", "Reserpine", null, {
  cls: ["抑制神經傳遞物質儲存與釋放"],
  struct: ["C-16 水解得{{甲醇|物質}}", "C-18 水解得{{三甲氧基苯甲酸|物質}}", "C-3 位易發生 {{epimerization|名詞}}"],
  feat: ["機轉：{{排空 NE/DA|名詞}} → 具有降壓及鎮靜作用", "生合成來源：{{Tryptophan|物質}}"] });
dA(10, "抑制神經傳遞物質儲存與釋放", 75, "guanethidine", "Guanethidine", null, {
  cls: ["抑制神經傳遞物質儲存與釋放"],
  struct: ["具有 {{Guanidine|結構}}，不易產生中樞神經之副作用"],
  feat: ["容易產生{{姿勢性低血壓|副作用}} → {{Midodrine|藥名}} 可治療姿勢性低血壓", "易發生姿勢性低血壓的三類藥物：{{神經節阻斷、抑制 NE 釋放、α1 阻斷|名詞}}", "代謝：形成 N-oxide、含氮飽和雜環裂開"] });
dA(10, "抑制神經傳遞物質儲存與釋放", 75, "bretylium", "Bretylium", null, {
  cls: ["抑制神經傳遞物質儲存與釋放"],
  feat: ["不適合{{口服|給藥途徑}}", "心律不整 {{Class III|名詞}}，阻斷鉀離子", "會造成姿勢性低血壓"] });
dA(10, "抑制 Norepinephrine 再回收", 77, "cocaine", "Cocaine", null, {
  cls: ["抑制 Norepinephrine 再回收"],
  struct: ["具有{{四|數值}}個不對稱碳原子", "水解得：{{Ecgonine、Methyl alcohol、Benzoic acid|物質}}"],
  feat: ["當局麻使用{{不需|性質}}合併血管收縮劑", "生藥：波利維亞、祕魯，用部：{{古柯葉|名詞}}"] });
dA(10, "抑制 Norepinephrine 再回收", 77, "imipramine", "Imipramine", null, {
  cls: ["抑制 Norepinephrine 再回收"],
  feat: ["{{三環抗憂鬱|藥物類別}}藥物", "副作用：鎮靜、{{抗膽鹼|副作用}}、低血壓、體重上升"] });
dA(10, "促進 NE 釋放、抑制 NE 再回收", 77, "amphetamine", "Amphetamine", null, {
  cls: ["促進 NE 釋放、抑制 NE 再回收"],
  feat: ["治療{{發作性睡病|疾病}}、注意力不集中、造成食慾減退", "{{甲基安非他命|藥名}}之中樞刺激作用較安非他命強", "為{{麻黃素|藥名}}經化學合成之神經興奮劑", "安非他命具有抑制 {{MAO|酵素}} 的作用", "藉由 NET 當作運輸管道，抑制 VMAT 使 NE 無法進入突觸囊泡"] });
dA(10, "抑制 NE 再回收", 77, "methylphenidate", "Methylphenidate（Ritalin）", "Methylphenidate", {
  cls: ["抑制 NE 再回收"],
  struct: ["有兩個 Chiral center，以 {{D-threo（2R,2'R）|結構}} 為活性型"],
  feat: ["治療{{注意力不集中之過動症|疾病}}及發作性睡病"] });
dA(10, "內生性神經傳遞物質", 77, "dopamine", "Dopamine", null, {
  cls: ["內生性神經傳遞物質"],
  feat: ["低劑量時：作用於 {{D1|標的}}-receptor → 使腎臟血管擴張，增加腎血流", "中劑量時：作用於 {{β1|標的}}-receptor → 可增加心輸出量", "高劑量時：作用於 {{α1|標的}}-receptor → 血壓上升", "{{口服無效|性質}}", "無法改善巴金森氏症 → 以 {{Dopa|藥名}} 治療"] });
dA(10, "內生性神經傳遞物質", 77, "norepinephrine", "Norepinephrine", null, {
  cls: ["內生性神經傳遞物質"], struct: ["為{{一級胺|結構}}，帶有酸性官能基"], feat: ["受 {{MAO 及 COMT|酵素}} 代謝"] });
dA(10, "內生性神經傳遞物質", 77, "epinephrine", "Epinephrine", null, {
  cls: ["內生性神經傳遞物質"], struct: ["為{{二級胺|結構}}，受 COMT 及 MAO 代謝"],
  feat: ["作用在 α 及 β receptor", "治療{{過敏性休克|疾病}}首選藥", "{{Dipivefrin|藥名}} 為 Epinephrine 之 Prodrug，可治青光眼"] });
dA(10, "α1-agonist（~zoline）", 78, "phenylephrine", "Phenylephrine", null, {
  cls: ["α1-agonist"], feat: ["解{{鼻黏膜充血|疾病}}", "升高血壓 → 造成{{反射性心跳變慢|副作用}}"] });
dA(10, "α1-agonist（~zoline）", 78, "naphazoline", "Naphazoline", null, {
  cls: ["α1-agonist"], struct: ["具有 {{imidazolidine|結構}}"], feat: ["可治療鼻充血，眼睛充血"] });
dA(10, "α1-agonist（~zoline）", 78, "midodrine", "Midodrine", null, {
  cls: ["α1-agonist"], feat: ["治療{{姿勢性低血壓|疾病}}"] });
dA(10, "α1-agonist（~zoline）", 78, "methoxamine", "Methoxamine", null, {
  cls: ["α1-agonist"],
  struct: ["結構中含 {{2',5'-dimethoxylphenyl|結構}} 基團"],
  feat: ["活性代謝物為 {{5'-phenolic|物質}}", "高劑量具有 {{β-blocking|名詞}} 活性"] });
dA(10, "α2-agonist", 78, "clonidine", "Clonidine", null, {
  cls: ["α2-agonist（共同的代謝路徑：{{Aromatic hydroxylation|名詞}}）"],
  feat: ["代謝物為 {{4-hydroxyclonidine|物質}}", "能進入{{中樞|器官}}活化 α2 受體，產生降血壓的效果", "刺激周邊 α2 受體反而會引起{{短暫性高血壓|副作用}}", "可用於對抗高血壓、{{酒精及菸草的戒斷症狀|疾病}}", "Morphine 成癮：Methadone、buprenorphine；Morphine 中毒：Naloxone"] });
dA(10, "α2-agonist", 78, "guanabenz", "Guanabenz", null, {
  cls: ["α2-agonist"], struct: ["{{不含有 imidazolidine|結構}}"], feat: ["治療高血壓"] });
dA(10, "α2-agonist", 78, "guanfacine", "Guanfacine", null, {
  cls: ["α2-agonist"],
  feat: ["會活化 {{Imidazoline receptor|標的}}", "降壓作用受 {{Imipramine|藥名}} 抑制", "{{憂鬱症|疾病}}病人不可使用"] });
dA(10, "Imidazole-agonist", 78, "moxonidine-rilmenidine", "Moxonidine、Rilmenidine", "Moxonidine", {
  cls: ["Imidazole-agonist"],
  feat: ["可用於{{降壓|名詞}}", "此類藥物對 imidazole 選擇性高，但對 α2 選擇性{{低|性質}}，因此不易產生鎮靜、心搏過緩、情緒低落的副作用"] });
dA(10, "β-agonist", 79, "isoproterenol", "Isoproterenol", null, {
  cls: ["{{非選擇性 β-agonist|藥物類別}}"],
  feat: ["被 {{COMT|酵素}} 代謝，不被 MAO 代謝", "可用於治療氣喘", "副作用：{{震顫和心跳加快|副作用}}", "可溶於{{鹼性|性質}}水溶液 → 因為 catechol 是酸性"] });
dA(10, "β2-agonist", 79, "metaproterenol", "Metaproterenol", null, {
  cls: ["β2-agonist（副作用：{{肌肉震顫、低血鉀、心搏過速|副作用}}）"],
  feat: ["相較於 isoproterenol，作用時間較長 → 因為不易被酵素代謝", "用於治療氣喘", "不會被 {{COMT/MAO|酵素}} 代謝"] });
dA(10, "β2-agonist", 79, "terbutaline", "Terbutaline", null, {
  cls: ["β2-agonist"], struct: ["含有 {{Resorcinol|結構}}", "{{N-tert-butyl|結構}} → 選擇性偏向 β2 agonist"],
  feat: ["不會被 COMT 及 MAO 代謝"] });
dA(10, "β2-agonist", 79, "bitolterol", "Bitolterol", null, {
  cls: ["β2-agonist"], feat: ["代謝後可得 {{Colterol|物質}}"] });
dA(10, "β2-agonist", 79, "salbutamol", "Salbutamol（Albuterol）", "Salbutamol", {
  cls: ["β2-agonist：短效型（{{SABA|藥物類別}}）"],
  struct: ["Sal- 表結構有{{水楊醇|結構}}"],
  feat: ["口服有效", "{{R-isomer|結構}} 有效，S-isomer 會引起發炎", "用於治療氣喘（來的{{快|性質}}去的快）"] });
dA(10, "β2-agonist", 79, "salmeterol", "Salmeterol", null, {
  cls: ["β2-agonist：長效型（{{LABA|藥物類別}}）"],
  struct: ["Sal- 表水楊醇"],
  feat: ["治療氣喘（來的{{慢|性質}}去的慢）", "{{不建議|性質}}使用於急性氣喘發作"] });
dA(10, "β2-agonist", 79, "formoterol", "Formoterol", null, {
  cls: ["β2-agonist：長效型（LABA）"],
  feat: ["用於氣喘（來的{{快|性質}}去的慢）", "{{可用於|性質}}急性氣喘發作的緩解"] });
dA(10, "β2-agonist", 80, "ritodrine", "Ritodrine", null, {
  cls: ["β2-agonist"], feat: ["可用於{{安胎|名詞}}（β2 與子宮平滑肌鬆弛有關）"] });
dA(10, "β1-agonist", 80, "dobutamine", "Dobutamine", null, {
  cls: ["β1-agonist"], struct: ["{{不含有醇基|結構}}"],
  feat: ["具有強心作用，可治療{{心衰竭|疾病}}", "對 dopamine receptor {{無效|性質}}", "易被 {{COMT|酵素}} 代謝，不易被 MAO 代謝"] });
dA(10, "雙重機轉", 80, "ephedrine", "Ephedrine", null, {
  cls: ["雙重機轉：是{{直接及間接|名詞}}作用劑"],
  struct: ["立體化學為：Erythro（{{1R,2S|結構}}）", "具有 {{Phenylethylamine|結構}} 的結構"],
  feat: ["治療低血壓、氣喘、尿床、解鼻充血、散瞳", "不易被 COMT 代謝"] });
dA(10, "雙重機轉", 80, "pseudoephedrine", "Pseudoephedrine", null, {
  cls: ["雙重機轉"],
  struct: ["立體組態：Threo（{{1S,2S|結構}}）", "為 Ephedrine 之{{非鏡像異構物（Diastereoisomer）|名詞}}"],
  feat: ["為一種{{解鼻充血劑|藥物類別}}"] });
dA(10, "α-antagonist", 80, "tolazoline", "Tolazoline", null, {
  cls: ["{{非選擇性 α-antagonist|藥物類別}}"] });
dA(10, "α-antagonist", 80, "phentolamine", "Phentolamine", null, {
  cls: ["α-antagonist"],
  feat: ["治療 Pheochromocytoma（{{嗜鉻細胞瘤|疾病}}）", "副作用：姿勢性低血壓、{{反射性心跳過快|副作用}}"] });
dA(10, "α-antagonist", 80, "phenoxybenzamine", "Phenoxybenzamine", null, {
  cls: ["α-antagonist"],
  feat: ["藥物與 α 接受器產生{{不可逆|性質}}結合（共價鍵）", "用於嗜鉻細胞瘤患者（形成 {{Aziridinium ion|物質}}）", "副作用：姿勢性低血壓、反射性心跳過快"] });
dA(10, "α1-antagonist", 81, "prazosin", "Prazosin", null, {
  cls: ["α1-antagonist"],
  struct: ["含有 {{Quinazoline|結構}}、Piperazine、Furan"],
  feat: ["治療高血壓、{{前列腺肥大|疾病}}", "可能會使 TG（三酸甘油脂）{{降低|性質}}", "副作用：{{首劑暈厥|副作用}}（因為血壓突然下降）"] });
dA(10, "α1-antagonist", 81, "terazosin", "Terazosin", null, {
  cls: ["α1-antagonist"], struct: ["改成 {{Tetrahydrofuran|結構}} 為了延長半衰期"],
  feat: ["治療高血壓、前列腺肥大"] });
dA(10, "α1-antagonist", 81, "alfuzosin", "Alfuzosin", null, {
  cls: ["α1-antagonist"], struct: ["沒有 {{Piperazine|結構}}"], feat: ["用於治療前列腺肥大"] });
dA(10, "α1-antagonist", 81, "tamsulosin", "Tamsulosin", null, {
  cls: ["α1-antagonist"], struct: ["{{不含 Quinazoline|結構}}"], feat: ["用於治療{{前列腺肥大|疾病}}"] });
dA(10, "α1-antagonist", 81, "silodosin", "Silodosin", null, {
  cls: ["α1-antagonist"], struct: ["不含 Quinazoline"], feat: ["用於治療前列腺肥大"] });
dA(10, "α2-antagonist", 81, "yohimbine", "Yohimbine", null, {
  cls: ["{{α2-antagonist|藥物類別}}"],
  feat: ["生合成：{{Tryptophan|物質}}", "增加心跳和血壓", "稱為天然的{{威而鋼|名詞}}", "科名：{{茜草科|名詞}}；用部：皮；產地：西非"] });
kA(10, "Beta-blockers", 82, "Beta-blockers 分類", { table: { cols: ["分類", "藥物"], rows: [
  [{ t: "β1-blockers", b: true }, "Atenolol、Acebutolol、Betaxolol、Bisoprolol、{{Metoprolol|藥名}}、Esmolol、Practolol、Nebivolol、Celiprolol"],
  [{ t: "青光眼", b: true }, "Metipranolol、Levobunolol、{{Timolol|藥名}}、Carteolol、Betaxolol"],
  [{ t: "{{ISA|名詞}}（內生性擬交感神經活性）\n（心絞痛患者不可使用）", b: true }, "{{Acebutolol、Celiprolol、Carteolol、Penbutolol、Pindolol|藥名}}"],
  [{ t: "可用於心衰竭", b: true }, "{{Metoprolol、Bisoprolol、Carvedilol|藥名}}"],
  [{ t: "臨床上使用左旋", b: true }, "{{Levobunolol、Timolol、Penbutolol|藥名}}"],
  [{ t: "可阻斷 α receptor", b: true }, "{{Labetalol、Carvedilol|藥名}}"] ] } });
dA(10, "β-antagonist", 82, "propranolol", "Propranolol", null, {
  cls: ["{{非選擇性 β-antagonist|藥物類別}}"],
  feat: ["{{親脂性最大|性質}}（易被首渡代謝）", "可穿過血腦障壁，具有中樞抑制的作用 → β 與{{憂鬱症|疾病}}有關", "減少心輸出量及 renin 釋放 → 阻斷 β1 使 renin 減少 → 阻斷 β2 {{氣喘|疾病}}患者不得使用", "預防{{偏頭痛|疾病}}第一線用藥", "解焦慮、原發性顫抖症、甲狀腺毒症"] });
dA(10, "β-antagonist", 82, "carvedilol", "Carvedilol", null, {
  cls: ["β-antagonist（可阻斷 α receptor）"],
  struct: ["含 {{Carbazole|結構}} 環，具抗氧化與抗血管平滑肌細胞增生作用"],
  feat: ["可用於{{心衰竭|疾病}}"] });
dA(10, "Ergot alkaloids（具水溶性）", 83, "ergonovine", "Ergonovine（Ergometrine、Ergobasine）", "Ergonovine", {
  cls: ["麥角類衍生物：Ergot alkaloids（{{具水溶性|性質}}）"],
  struct: ["含有 {{3|數值}} 個 N"],
  feat: ["具有強烈{{子宮收縮|名詞}}作用", "用於治療{{產後出血|疾病}}", "生合成胺基酸：{{Tryptophan|物質}}"] });
dA(10, "Ergot alkaloids（具水溶性）", 83, "methysergide", "Methysergide", null, {
  cls: ["Ergot alkaloids（具水溶性）"],
  feat: ["為 {{5-HT 阻斷劑|藥物類別}} → 預防偏頭痛", "{{不作為催產劑|性質}}", "副作用：{{腹膜纖維化|副作用}}"] });
dA(10, "Ergot alkaloids（具水溶性）", 83, "lsd", "Lysergic acid diethylamide（LSD）", "LSD", {
  cls: ["Ergot alkaloids（具水溶性）"],
  struct: ["第八位取代基為 {{Diethylamine|結構}}"], feat: ["強效{{幻覺劑|藥物類別}}"] });
dA(10, "Ergot alkaloids（非水溶性）", 83, "ergotamine", "Ergotamine", null, {
  cls: ["Ergot alkaloids（{{非水溶性|性質}}）"],
  struct: ["Ergotamine 含有 {{5|數值}} 個 N"], feat: ["Ergotamine 用於治療{{偏頭痛|疾病}}"] });
dA(10, "Ergot alkaloids（非水溶性）", 83, "ergotoxine", "Ergotoxine", null, {
  cls: ["Ergot alkaloids（非水溶性）"], struct: ["為{{混合物|名詞}}"],
  feat: ["Ergotoxine 是由 {{Ergocristine、Ergocryptine、Ergocornine|物質}} 構成", "{{Ergoloid|藥名}} 為 Ergotoxine 之氫化物，可改善記憶"] });

/* ===== 第 11 章 副交感神經藥物 ===== */
chA(11, "11", "副交感神經藥物", "84～91");
kA(11, "副交感神經總覽", 84, "Ach 生合成與作用點（Cholinergic Agonists 圖）", { images: ["assets/amulet/fig/ach.png"] });
kA(11, "副交感神經總覽", 85, "蕈毒鹼性受體（Muscarinic receptor）", { table: {
  head: [[{ t: "蕈毒鹼性受體（Muscarinic receptor）", cs: 3 }, null, null], ["名稱", "位置", "受體種類"]], cols: ["名稱", "位置", "受體種類"], rows: [
  [{ t: "M1", b: true }, "{{大腦組織、外分泌腺體、自主神經節|器官}}", "Gq"],
  [{ t: "M2", b: true }, "{{心肌|器官}}", "{{Gi|標的}}"],
  [{ t: "M3", b: true }, "外分泌腺、平滑肌收縮、睫狀肌、環狀肌收縮", "{{Gq|標的}}"],
  [{ t: "M4", b: true }, "CNS 神經元", "Gi"],
  [{ t: "M5", b: true }, "CNS 神經元", "Gq"] ] } });
kA(11, "副交感神經總覽", 85, "菸鹼性受體（Nicotinic receptor）", { table: {
  head: [{ t: "菸鹼性受體（Nicotinic receptor）", cs: 3 }, null, null], cols: ["名稱", "部位", "受體種類"], rows: [
  [{ t: "Nn", b: true }, "{{神經節|器官}}部位", { t: "{{Ion channel（Na+）|標的}}", rs: 2 }],
  [{ t: "Nm", b: true }, "{{神經肌肉接合處|器官}}", null] ] } });
kA(11, "膽鹼的性質", 85, "膽鹼的性質", { table: {
  head: [[{ t: "膽鹼的性質", cs: 5 }, null, null, null, null], ["藥名", "結構", "被 AchE 代謝", "M-Agonist", "N-Agonist"]], cols: ["藥名", "結構", "被 AchE 代謝", "M-Agonist", "N-Agonist"], rows: [
  [{ t: "Acetylcholine", b: true }, { t: "Acetylcholine", img: "assets/amulet/ch-acetylcholine.png" }, "++++", "+++", "+++"],
  [{ t: "{{Methacholine|藥名}}", b: true }, { t: "Methacholine", img: "assets/amulet/ch-methacholine.png" }, "+", "{{++++|名詞}}", "-"],
  [{ t: "{{Carbachol|藥名}}", b: true }, { t: "Carbachol", img: "assets/amulet/ch-carbachol.png" }, "{{-|名詞}}", "++", "+++"],
  [{ t: "{{Bethanechol|藥名}}", b: true }, { t: "Bethanechol", img: "assets/amulet/ch-bethanechol.png" }, "-", "++", "-"] ],
  note: "✧ β 位加上{{甲基|結構}}，選擇性偏向 M\n✧ Methacholine 會被 Cholinesterase 水解，但作用於 Muscarinic receptor {{最強|性質}}\n✧ Carbachol {{不會|性質}}被膽鹼酯酶水解，對於 nicotinic 及 muscarinic receptor 皆有作用\n✧ {{Bethanechol|藥名}} 可用於手術後{{尿液滯留|疾病}}" } });
dA(11, "膽鹼性直接作用劑", 86, "cevimeline", "Cevimeline", null, {
  cls: ["膽鹼性直接作用劑"],
  struct: ["有 {{Quinuclidine、Oxathiolane|結構}}"],
  feat: ["{{M1|標的}}-agonist 作用於 CNS", "{{M3|標的}}-agonist 作用於淚腺、唾腺", "治療 {{Sjogren's syndrome|疾病}}"] });
dA(11, "膽鹼性直接作用劑", 86, "pilocarpine", "Pilocarpine", null, {
  cls: ["膽鹼性直接作用劑"],
  struct: ["{{兩|數值}}個 chiral center", "含有 {{imidazole、γ-lactone|結構}}"],
  feat: ["{{鹼|性質}}中，C3 因異構化形成 {{isopilocarpine|物質}} 而失效", "治療青光眼、Sjogren's syndrome", "生藥名：{{毛果芸香小葉|名詞}}", "生合成前驅物：{{Histidine|物質}}"] });
dA(11, "膽鹼性直接作用劑", 86, "arecoline", "Arecoline", null, {
  cls: ["膽鹼性直接作用劑"],
  struct: ["屬於 {{Tetrahydropyridine|結構}}"],
  feat: ["作用在 M、N receptor", "具有驅{{絛蟲|疾病}}的效果", "科名：{{棕梠科|名詞}} 用部：種子", "含有 Tannin，導致{{口腔癌|疾病}}"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 86, "physostigmine", "Physostigmine", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"],
  feat: ["pH 值為 {{6|數值}} 最安定，pH 值越小，作用越強", "治療{{青光眼|疾病}} → 增加眼房水的流出", "為 {{Atropine、三環抗憂鬱藥|藥名}}中毒的解毒劑 → 緩解抗膽鹼的作用", "{{Rubreserine|物質}} 為水溶液變質後的紅色物質", "為{{三級胺|結構}} → 口服吸收良好", "生藥名：{{毒扁豆|名詞}}", "前驅物：Tryptophan"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 87, "neostigmine", "Neostigmine", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"],
  feat: ["用於{{重症肌無力|疾病}}", "可抑制 {{Tubocurarine|藥名}} 所產生之骨骼肌鬆弛 → Neostigmine 會使肌肉收縮", "可增強 {{Succinylcholine|藥名}} 之神經肌肉阻斷作用 → Succinylcholine 受 ACHE 代謝", "屬於{{四級胺|結構}}不可進中樞，不能治療老年癡呆症、青光眼"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 87, "tacrine", "Tacrine", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"],
  struct: ["{{Tetrahydroacridine|結構}} 骨架"],
  feat: ["用於 {{Alzheimer's disease|疾病}}", "有{{肝毒性|副作用}}而使用途受限", "{{1-hydroxyl-tacrine|物質}} 為活性代謝物"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 87, "galantamine", "Galantamine", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"], feat: ["治療 Alzheimer's disease", "{{無肝毒性|性質}}"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 87, "donepezil", "Donepezil", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"], feat: ["可用於治療{{阿茲海默症|疾病}}"] });
dA(11, "可逆性膽鹼脂酶抑制劑", 87, "rivastigmine", "Rivastigmine", null, {
  cls: ["可逆性膽鹼脂酶抑制劑"], struct: ["其結構具有 {{Arylcarbamate|結構}}"], feat: ["用於{{失智症|疾病}}治療"] });
kA(11, "膽鹼脂酶抑制劑", 87, "治療 Alzheimer's disease", { table: { cols: ["", "可逆性膽鹼脂酶抑制劑", "NMDA 阻斷劑"], rowNames: ["治療 Alzheimer's disease"], rows: [
  [{ t: "治療 Alzheimer's disease", b: true }, "可逆性膽鹼脂酶抑制劑：{{Galantamine、Tacrine、Donepezil、Rivastigmine|藥名}}", "{{NMDA|標的}} 阻斷劑：{{Memantine|藥名}}"] ] } });
kA(11, "膽鹼脂酶抑制劑", 88, "有機磷中毒症狀", [
  "不可逆性膽鹼脂酶抑制劑",
  "✧ 有機磷中毒症狀：",
  "1. {{縮瞳|副作用}}",
  "2. 唾液多",
  "3. 小便失禁",
  "4. 肌肉震顫"
]);
dA(11, "不可逆性膽鹼脂酶抑制劑", 88, "isoflurophate", "Isoflurophate", null, {
  cls: ["不可逆性膽鹼脂酶抑制劑"],
  feat: ["屬於{{長效型|性質}}的青光眼治療劑 → 因為是不可逆型 ACHE inhibitor"] });
dA(11, "不可逆性膽鹼脂酶抑制劑", 88, "parathion", "Parathion", null, {
  cls: ["不可逆性膽鹼脂酶抑制劑"],
  feat: ["代謝物：{{Paraoxon|物質}}（{{S→O|結構}}）→ 是活性更強的膽鹼脂酶抑制劑"] });
dA(11, "解毒劑", 88, "pralidoxime", "Pralidoxime（2-PAM）", "2-PAM", {
  cls: ["解毒劑"],
  feat: ["為{{有機磷中毒|疾病}}之解毒劑，常併用 {{Atropine|藥名}}", "不以口服給藥{{四級胺|結構}}，口服吸收不佳"] });
kA(11, "膽鹼性阻斷劑", 89, "膽鹼性阻斷劑適應症", { table: {
  head: [[{ t: "膽鹼性阻斷劑適應症", cs: 5 }, null, null, null, null], ["抗巴金森氏症", "散瞳劑", "解膀胱痙攣", "治消化性潰瘍", "氣喘藥"]],
  cols: ["抗巴金森氏症", "散瞳劑", "解膀胱痙攣", "治消化性潰瘍", "氣喘藥"], rowNames: false, rows: [
  [{ t: "{{Benztropine、Orphenadrine、Biperiden、Trihexyphenidyl|藥名}}", rs: 2 }, { t: "Atropine（藥效{{最長|性質}}）\n{{Tropicamide|藥名}}（藥效最短）\nScopolamine\nHomatropine\nEucatropine", rs: 2 }, "3 級 N\n{{Oxybutynin|藥名}}\nSolifenacin\nDarifenacin\nTolterodine\nFesoterodine", { t: "{{Pirenzepine、Telenzepine|藥名}}\nPropantheline", rs: 2 }, { t: "{{Ipratropium、Tiotropium|藥名}}", rs: 2 }],
  [null, null, "4 級 N\n{{Trospium|藥名}}", null, null] ] } });
dA(11, "Muscarinic-antagonist", 89, "atropine", "Atropine（(±)-Hyoscyamine）", "Atropine", {
  cls: ["Muscarinic-antagonist"],
  struct: ["屬於 {{3|數值}} 級 N，為{{消旋化合物|名詞}}，不具光學活性"],
  feat: ["治療：{{Bradycardia（心跳徐緩）|疾病}}、PD", "副作用：散瞳、睫狀肌麻痺、皮膚乾燥且潮紅", "併用 {{Benzocaine|藥名}} 易產生毒性，因抑制 Esterase", "併用 Procaine 可使其局部麻醉作用延長", "Tropic acid 之前驅物為 {{Phenylalanine|物質}}"] });
dA(11, "Muscarinic-antagonist", 89, "scopolamine", "Scopolamine（(−)-Hyoscine）", "Scopolamine", {
  cls: ["Muscarinic-antagonist"],
  struct: ["含有 {{tropane epoxide|結構}} 骨架之生物鹼", "多了醚類，有{{中樞抑制|名詞}}作用"],
  feat: ["用於{{動暈病|疾病}}"] });
dA(11, "Muscarinic-antagonist", 89, "ipratropium-tiotropium", "Ipratropium、Tiotropium", "Tiotropium", {
  cls: ["Muscarinic-antagonist"],
  struct: ["屬於 {{4|數值}} 級 N"],
  feat: ["Ipratropium 是{{短效型|性質}}，Tiotropium 是長效型", "{{Tiotropium|藥名}} 效果較 Ipratropium 強"] });
dA(11, "Muscarinic-antagonist", 90, "oxybutynin", "Oxybutynin", null, {
  cls: ["Muscarinic-antagonist"], struct: ["but-{{四個碳|結構}} yn-{{炔|結構}}"], feat: ["用於緩解{{膀胱痙攣|疾病}}"] });
dA(11, "Muscarinic-antagonist", 90, "solifenacin", "Solifenacin", null, {
  cls: ["Muscarinic-antagonist"], struct: ["{{Tetrahydroisoquinoline|結構}} 衍生物"], feat: ["治療{{膀胱過動症|疾病}}"] });
dA(11, "Muscarinic-antagonist", 90, "benztropine", "Benztropine", null, {
  cls: ["Muscarinic-antagonist"], struct: ["結構屬於 {{Aminoether|結構}}"],
  feat: ["可單獨用於治療 {{PD|疾病}}（即可以進入中樞）", "會產生口乾、視覺模糊及胃腸道蠕動障礙", "應避免使用於同時患有{{青光眼和前列腺腫大|疾病}}之巴金森氏症患者"] });
dA(11, "Muscarinic-antagonist", 90, "orphenadrine", "Orphenadrine", null, {
  cls: ["Muscarinic-antagonist"], struct: ["與 {{Diphenhydramine|藥名}} 類似之結構"], feat: ["治療 Parkinson's disease"] });
dA(11, "Muscarinic-antagonist", 90, "pirenzepine", "Pirenzepine", null, {
  cls: ["Muscarinic-antagonist"],
  struct: ["pir-{{pyridine|結構}} zepine-含氮七角環"],
  feat: ["可用於降低{{胃酸|物質}}分泌 → {{M1|標的}}-antagonist"] });
kA(11, "交感與副交感機轉統整", 91, "交感神經與副交感神經作用機轉統整", { table: {
  head: [[{ t: "交感神經與副交感神經作用機轉統整", cs: 3 }, null, null], ["機轉", "交感神經", "副交感神經"]], cols: ["機轉", "交感神經", "副交感神經"], rows: [
  [{ t: "節後神經傳遞物質生合成前驅物", b: true }, "{{Tyrosine|物質}}", "{{Serine|物質}}"],
  [{ t: "儲存", b: true }, "{{Reserpine|藥名}} 抑制 VMAT\n（Vesicular monoamine transporter）", "{{Vesamicol|藥名}} 抑制 VAT\n（Vesicle-associated transporter）"],
  [{ t: "釋放", b: true }, "{{Guanethidine、Bretylium|藥名}} 抑制 NE 釋放", "{{Botulinum toxin|藥名}} 抑制 Ach 釋放"],
  [{ t: "再回收", b: true }, "Cocaine、TCA 抑制 {{NET|標的}}\n（Norepinephrine transporter）", "Physostigmine、Parathion、Sarin 抑制 {{AchE|酵素}}"] ] } });

/* 講義第 92～93 頁（12. 自主神經節阻斷劑、13. 作用於神經肌肉連結處的藥物）暫時沒有收錄。 */

/* ================= 中樞神經島（14～25） ================= */
isleA("cns", "中樞神經島", { ground: "#B8C4E6", light: "#CCD5EE", cliff: "#8A98C4" });

/* ===== 第 14 章 中樞總論 ===== */
chA(14, "14", "中樞總論", "94～96");
kA(14, "中樞神經傳遞物質", 94, "中樞神經傳遞物質", { table: { head: ["神經傳遞物質", "生理作用", "代表藥物及接受器特色"], rows: [
  [{ t: "GABA\n（γ-Aminobutyric acid）", b: true }, "✧ 是中樞神經主要的{{抑制性|性質}}傳遞物質\n✧ GABA-A 為{{突觸後|名詞}}接收器\n✧ GABA-B 位於{{突觸前|名詞}}神經末端，可減少神經傳遞物質的釋放", "1. {{Bicuculline|藥名}} 拮抗 GABA-A 可作為致痙攣劑\n2. {{Baclofen|藥名}} 活化 GABA-B 可作為肌肉鬆弛劑\n3. {{Tiagabine|藥名}} 抑制 GABA 再回收，可增強腦中 GABA 的含量\n4. {{Vigabatrin|藥名}} 是 GABA-Transaminase 之自殺性不可逆抑制劑\n5. {{Gabapentin|藥名}} 會促進 GABA 釋放"],
  [{ t: "Glycine（甘胺酸）", b: true }, "✧ 抑制性傳遞物質，主要存在於{{脊髓|器官}}", "1. Glycine 拮抗劑為 {{Strychnine|藥名}}（番木鱉鹼），引起痙攣的作用"],
  [{ t: "Glutamate", b: true }, "✧ 為中樞{{興奮性|性質}}傳遞物質", "1. Ligand-gated ion channels：NMDA、AMPA、Kainate\n2. G protein coupled receptors：Quisqualate\n3. {{Ketamine|藥名}} 阻斷 NMDA 接受器"],
  [{ t: "Acetylcholine", b: true }, "✧ 在腦部是經由抑制{{鉀離子|物質}}通道興奮中樞\n✧ Acetylcholine 的前驅物是 {{Serine|物質}}", "1. Acetylchoine↓ 造成阿茲海默症，\n以 Galantamine、Tacrine、Donepezil、Rivastigimine 治療"],
  [{ t: "Dopamine", b: true }, "✧ Dopamine 藉由打開{{鉀離子|物質}}通道抑制中樞神經\n多巴胺三大路徑\n✧ {{黑質紋狀體|名詞}}路徑：退化會造成巴金森氏症\n✧ {{中邊緣|名詞}}路徑：過度活化會造成精神分裂症\n✧ {{結節漏斗|名詞}}路徑：調節 Prolactin 的釋放", "1. Chlorpromazine 為 DA 阻斷劑可治療{{精神分裂症|疾病}}\n2. Bromocriptine 為 DA 作用劑可治療巴金森氏症\n3. CTZ（化學受體反射區）具有 Dopamine receptor\n4. {{Metoclopramide|藥名}} 為 D2-antagonist 可止嘔"],
  [{ t: "Norepinephrine", b: true }, "✧ NE 存在於腦幹中的{{藍斑|名詞}}\n✧ NE 和 DA 可能與藥物的成癮性有關\n✧ NE 的前驅物是 Tyrosine", "1. Phenylephrine 作用在 α1-receptor 可解鼻充血\n2. Prazosin 阻斷 α1-receptor 可降血壓"],
  [{ t: "Serotonin（5-HT）", b: true }, "✧ Serotonin 存在於腦幹的{{縫核|名詞}}中\n✧ Serotonin 下降將造成{{憂鬱症|疾病}}\n✧ 增加 Serotonin 的釋放，有降低食慾的作用\n✧ Serotonin 的前驅物是 {{L-Tryptophan|物質}}", "1. {{Lorcaserin|藥名}} 刺激 5-HT2c，作為減肥藥\n2. 活化 5-HT 接受器，可促進腸胃蠕動\n3. {{Tegaserod|藥名}} 刺激 5-HT4 治療便秘型刺激性腸道症候群\n4. {{Alosetron|藥名}} 阻斷 5-HT3 治療腹瀉型刺激型腸道症候群"],
  [{ t: "Neuropeptides\n（神經胜肽）", b: true }, "✧ Substance P 與{{痛覺|名詞}}有關，含 {{11|數值}} 個胺基酸\n✧ Enkephalins，與抑制痛覺有關", "1. Met-Enkephalin：Tyr-Gly-Gly-Phe-{{Met|物質}}\n2. Leu-Enkephalin：Tyr-Gly-Gly-Phe-{{Leu|物質}}"] ] } });
kA(14, "中樞神經傳遞物質總整理表格", 95, "中樞神經傳遞物質總整理表格", { table: {
  head: [[{ t: "中樞神經傳遞物質總整理表格", cs: 6 }, null, null, null, null, null], ["神經傳遞物質", { t: "受體亞型", cs: 3 }, null, null, "作用劑", "阻斷劑"]],
  cols: ["神經傳遞物質", "受體亞型", "受體亞型", "受體種類", "作用劑", "阻斷劑"],
  rowNames: ["M1", "M2", "Nicotinic", "D1", "D2", "GABA-A", "GABA-B", "NMDA", "AMPA", "Kainate", "Metabotropic", "Glycine receptor", "5-HT1A", "5-HT1D", "5-HT2A", "5-HT2C", "5-HT3", "5-HT4", "α1", "α2", "β1", "β2"], rows: [
  [{ t: "Acetylcholine", b: true, rs: 3 }, { t: "M1", cs: 2 }, null, "Gq", { t: "Muscarine", rs: 2 }, "Pirenzepine"],
  [null, { t: "M2", cs: 2 }, null, "Gi", null, "Atropine"],
  [null, { t: "Nicotinic", cs: 2 }, null, "Na+ channel", "Nicotine", "{{α-Bungarotoxin|藥名}}"],
  [{ t: "Dopamine", b: true, rs: 2 }, { t: "D1", cs: 2 }, null, "{{Gs|標的}}", "Fenoldopam", ""],
  [null, { t: "D2", cs: 2 }, null, "{{Gi|標的}}", "Bromocriptine", "Phenothiazine"],
  [{ t: "GABA", b: true, rs: 2 }, { t: "GABA-A", cs: 2 }, null, "{{Cl- channel|標的}}", "Muscimol", "{{Bicuculline、Picrotoxin|藥名}}"],
  [null, { t: "GABA-B", cs: 2 }, null, "Gi", "Baclofen", "{{Saclofen|藥名}}"],
  [{ t: "Glutamate", b: true, rs: 4 }, { t: "NMDA", cs: 2 }, null, { t: "Ion channel", rs: 3 }, "NMDA", ""],
  [null, { t: "AMPA", cs: 2 }, null, null, "AMPA", ""],
  [null, { t: "Kainate", cs: 2 }, null, null, "Kainate", ""],
  [null, { t: "Metabotropic", cs: 2 }, null, "G-protein", "Quisqualate", ""],
  [{ t: "Glycine", b: true }, { t: "Glycine receptor", cs: 2 }, null, "Cl- channel", "{{Taurine|物質}}", "Strychnine"],
  [{ t: "Serotonin", b: true, rs: 6 }, { t: "5-HT", rs: 6 }, "1A", { t: "Gi", rs: 2 }, "{{Buspirone|藥名}}", "Spiperone"],
  [null, null, "1D", null, "{{Sumatriptan|藥名}}", ""],
  [null, null, "2A", { t: "Gq", rs: 2 }, "LSD", "{{Ketanserin、Trazodone|藥名}}"],
  [null, null, "2C", null, "Lorcaserin", ""],
  [null, null, "3", "{{Ion channel|標的}}", "", "{{Ondansertron|藥名}}"],
  [null, null, "4", "{{Gs|標的}}", "Cisapride、Tegaserod、Metoclopramide", ""],
  [{ t: "Norepinephrine", b: true, rs: 4 }, { t: "α1", cs: 2 }, null, "Gq", "Phenylephrine", "Prazosin"],
  [null, { t: "α2", cs: 2 }, null, "Gi", "Clonidine", "Yohimbine"],
  [null, { t: "β1", cs: 2 }, null, { t: "Gs", rs: 2 }, "Dobutamine", "Atenolol"],
  [null, { t: "β2", cs: 2 }, null, null, "Salbutamol", "Butoxamine"] ] } });
kA(14, "中樞神經傳遞物質總整理表格", 96, "中樞神經傳遞物質總整理表格（續）", { table: {
  head: ["神經傳遞物質", { t: "受體亞型", cs: 2 }, null, "作用劑", "阻斷劑"],
  cols: ["神經傳遞物質", "受體亞型", "受體種類", "作用劑", "阻斷劑"],
  rowNames: ["μ（mu）", "δ（delta）", "κ（kappa）", "CB1", "H1", "H2", "H3", "OX1/OX2"], rows: [
  [{ t: "Opioid", b: true, rs: 3 }, "μ（mu）", { t: "{{Gi|標的}}", rs: 3 }, "{{Endorphin|物質}}", { t: "{{Naloxone|藥名}}", rs: 3 }],
  [null, "δ（delta）", null, "{{Enkephalin|物質}}", null],
  [null, "κ（kappa）", null, "{{Dynorphin|物質}}", null],
  [{ t: "Endocannabinoids", b: true }, { t: "CB1", cs: 2 }, null, "{{Anandamide|物質}}", "{{Rimonabant|藥名}}"],
  [{ t: "Histamine", b: true, rs: 3 }, "H1", "Gq", "Histamine", "{{Diphenhydramine|藥名}}"],
  [null, "H2", "Gs", "Dimaprit", "{{Cimetidine|藥名}}"],
  [null, "H3", "Gi", "Imetit、Lmepip", "Thioperamide"],
  [{ t: "Orexins", b: true }, { t: "OX1/OX2", cs: 2 }, null, "", "{{Suvorexant|藥名}}"] ] } });

/* ===== 第 15 章 血清素 Serotonin（5-HT） ===== */
chA(15, "15", "血清素 Serotonin（5-HT）", "97～103");
kA(15, "Serotonin 生合成", 97, "Serotonin 與 Melatonin 的生合成", { images: ["assets/amulet/fig/5ht-syn.png"], table: { cols: ["", "特色"], rowNames: ["Melatonin", "Ramelteon", "影響食慾之藥物"], rows: [
  [{ t: "Melatonin\n（褪黑激素）", b: true }, "✧ 由 Serotonin 經由 5-HT N-Acetyl transferase 及 5-OHindole-O-Methyl transferase 而得\n✧ Melatonin 在{{松果體|器官}}生合成和代謝\n✧ 結構不具有 Chiral center，以 L-tryptophan 為生合成起始物"],
  [{ t: "Ramelteon", b: true }, "✧ Ramelteon 為 Melatonin receptor 1 and 2 agonist 可用於治療{{失眠|疾病}}\n✧ 副作用：疲勞、頭暈和影響內分泌\n✧ 主要和 {{CYP1A2|酵素}} 代謝，和 Fluvoxamine（CYP1A2 inhibitor）併用時會增加 Ramelteon 的血中濃度，應避免一起使用"],
  [{ t: "✧ 影響食慾之藥物：服用毒品、迷幻藥基本上會抑制食慾，除了 {{THC、Dronabinol|藥名}} 會刺激食慾", cs: 2 }, null] ] } });
dA(15, "Melatonin 相關", 97, "melatonin", "Melatonin（褪黑激素）", "Melatonin", {
  cls: ["內生性物質"],
  struct: ["結構{{不具有|性質}} Chiral center，以 {{L-tryptophan|物質}} 為生合成起始物"],
  feat: ["由 Serotonin 經由 5-HT N-Acetyl transferase 及 5-OHindole-O-Methyl transferase 而得", "Melatonin 在{{松果體|器官}}生合成和代謝"] });
dA(15, "Melatonin 相關", 97, "ramelteon", "Ramelteon", null, {
  cls: ["{{Melatonin receptor 1 and 2 agonist|藥物類別}}"],
  feat: ["可用於治療{{失眠|疾病}}", "副作用：疲勞、頭暈和影響內分泌", "主要和 {{CYP1A2|酵素}} 代謝，和 {{Fluvoxamine|藥名}}（CYP1A2 inhibitor）併用時會增加 Ramelteon 的血中濃度，應避免一起使用"] });

/* ===== 第 15 章（續）：第 98～99 頁 ===== */
kA(15, "5-HT 受體藥物總覽", 98, "15 血清素藥物架構", { images: ["assets/amulet/fig/5ht-tree.png"] });
dA(15, "5HT1A", 99, "buspirone", "Buspirone", null, {
  cls: ["{{5HT1A agonist|藥物類別}}"],
  struct: ["結構具有 {{Azaspirodecanedione|結構}}"],
  feat: ["為抗焦慮藥物，Onset {{慢|性質}}須長期使用，成癮性較低，不具有鎮靜及肌肉放鬆之作用"] });
dA(15, "5HT1A", 99, "sarizotan", "Sarizotan", null, {
  cls: ["5HT1A agonist"], feat: ["可用於治療{{巴金森氏症|疾病}}"] });
dA(15, "5HT1A", 99, "spiperone", "Spiperone", null, {
  cls: ["屬於 {{5-HT1A antagonist|藥物類別}}"] });
dA(15, "5HT1B+1D", 99, "sumatriptan", "Sumatriptan", null, {
  cls: ["{{5HT1B+1D agonist|藥物類別}}"],
  struct: ["字尾有 Triptan，均含有 {{Indole|結構}}"],
  feat: ["治療{{偏頭痛|疾病}}"] });
dA(15, "5HT1B+1D", 99, "rizatriptan", "Rizatriptan", null, {
  cls: ["5HT1B+1D agonist"],
  struct: ["由 Sumatriptan 的 Sulfonamide 基團修飾成 {{Triazole|結構}} 而得"],
  feat: ["用於治療偏頭痛", "不能與 {{propranolol|藥名}} 併用"] });
dA(15, "5HT2 antagonist", 99, "ketanserin", "Ketanserin", null, {
  cls: ["屬於 Serotonin 的{{拮抗劑|藥物類別}}（5HT2）"] });
dA(15, "5HT2 antagonist", 99, "trazodone", "Trazodone", null, {
  cls: ["5HT2 antagonist"], feat: ["用於治療{{憂鬱症|疾病}}"] });
dA(15, "5HT2 antagonist", 99, "cyproheptadine", "Cyproheptadine", null, {
  cls: ["藥理機轉為：{{5-HT2-antagonist + H1 antagonist|藥物類別}}"] });
mA("methysergide", 99, { feat: ["5HT2 antagonist：{{預防|名詞}}偏頭痛（第 99 頁）"] });
mA("ergotamine", 99, { feat: ["5HT2 antagonist：治療偏頭痛（第 99 頁）"] });
dA(15, "5HT3 antagonist（-setron）", 100, "ondansetron", "Ondansetron", null, {
  cls: ["{{5HT3 antagonist|藥物類別}}"],
  struct: ["具有 {{Carbazolone|結構}} 之結構"],
  feat: ["治療{{化療、放療|名詞}}引致之嘔吐", "具 Imidazole 雜環的 5-HT3 抑制劑：Fabesetron、Ondansetron、Alosetron、Ramosetron", "本類藥物半衰期最長為：{{Palonosetron|藥名}}"] });
dA(15, "5HT3 antagonist（-setron）", 100, "alosetron", "Alosetron", null, {
  cls: ["5HT3 antagonist"], feat: ["治療{{腹瀉型|名詞}}刺激性腸道症候群"] });
dA(15, "5HT4 agonist", 100, "tegaserod", "Tegaserod", null, {
  cls: ["{{5HT4 agonist|藥物類別}}"], feat: ["治療{{便秘型|名詞}}刺激性腸道症候群"] });
dA(15, "5HT4 agonist", 100, "cisapride", "Cisapride", null, {
  cls: ["5HT4 agonist"], feat: ["易引起{{心律不整|副作用}}的副作用，現已下架"] });
dA(15, "5HT4 agonist", 100, "metoclopramide", "Metoclopramide", null, {
  cls: ["{{5HT4 agonist + D2 antagonist|藥物類別}}"],
  feat: ["屬於止嘔劑，作用在中樞神經之 chemoreceptor trigger zone（{{CTZ|名詞}}）", "副作用：易引起 {{EPS|副作用}} 副作用"] });
kA(15, "偏頭痛用藥", 100, "預防偏頭痛用藥（口訣 ABCDE）", { table: { head: [{ t: "預防偏頭痛用藥（口訣 ABCDE）", cs: 2 }, null], cols: ["分類", "藥物"], rows: [
  [{ t: "{{Anti-convulsants|藥物類別}}", b: true }, "Topiramate、Valproic acid"],
  [{ t: "β-blocker", b: true }, "{{Propranolol|藥名}}、Atenolol"],
  [{ t: "CCB", b: true }, "{{Verapamil|藥名}}"],
  [{ t: "anti-Depression", b: true }, "{{Amitriptyline|藥名}}"],
  [{ t: "Ergot alkaloids", b: true }, "{{Methysergide|藥名}}"],
  [{ t: "✧ 可同時用於治療及預防偏頭痛：{{Naproxen|藥名}}", cs: 2 }, null] ] } });
kA(15, "偏頭痛用藥", 101, "Triptan 類藥物比較", { table: { head: ["", "Sumatriptan", "Zolmitriptan", "Naratriptan", "Rizatriptan", "Almotriptan", "Frovatriptan", "Eletriptan"], rows: [
  [{ t: "LogP", b: true }, "0.7±0.6", "1.6±0.4", "1.4±0.6", "0.9±0.6", "1.9±0.6", "0.9±0.4", "3.1±0.6"],
  [{ t: "生體可用率", b: true }, "14-15", "40-50", "70", "40-50", "70-80", "20-30", "50"],
  [{ t: "半衰期", b: true }, "2.5", "2-3", "5-7", "2-3", "3-4", "25", "4-5"],
  [{ t: "代謝酵素", b: true }, "MAO-A", "CYP1A2\n代謝物會經 MAO-A\n代謝", "CYP3A4", "MAO-A", "主：MAO-A\n次：CYP3A4、\nCYP2D6", "CYP1A2", "CYP3A4"] ] } });
kA(15, "偏頭痛用藥", 101, "Triptan 類藥物總整理", { table: { head: [{ t: "Triptan 類藥物總整理", cs: 2 }, null], cols: ["", "藥物"], rows: [
  [{ t: "半衰期最長", b: true }, "{{Frovatriptan|藥名}}"],
  [{ t: "生體可用率最高", b: true }, "{{Almotriptan|藥名}}"],
  [{ t: "經由 MAO 代謝的藥物", b: true }, "{{Almotriptan、Rizatriptan、Sumatriptan、Zolmitriptan|藥名}}"],
  [{ t: "經由 3A4 代謝的藥物", b: true }, "{{Eletriptan、Naratriptan|藥名}}"],
  [{ t: "經由 1A2 代謝的藥物", b: true }, "{{Frovatriptan、Zolmitriptan|藥名}}"],
  [{ t: "鼻噴劑劑型", b: true }, "{{Sumatriptan、Zolmitriptan|藥名}}"] ] } });

/* 講義第 102～103 頁（16. 興奮劑、迷幻藥）暫時沒有收錄。 */

/* ===== 第 17 章 憂鬱症藥物 ===== */
chA(17, "17", "憂鬱症藥物", "104～115");
kA(17, "憂鬱症藥物總覽", 104, "作用點（Medical Pharmacology at a Glance 圖）", { images: ["assets/amulet/fig/antidep.png"] });
kA(17, "憂鬱症藥物總覽", 105, "17 憂鬱症藥物架構", { images: ["assets/amulet/fig/antidep-tree.png"] });
kA(17, "憂鬱症治療原則", 106, "病因、治療原則、停藥", { table: { cols: ["", "內容"], rows: [
  [{ t: "病因", b: true }, "抗憂鬱症的病因不明，但單胺假說認為憂鬱症的病因與大腦內 Serotonin、Norepinephrine、Dopamine 的{{缺乏|名詞}}有關"],
  [{ t: "治療原則", b: true }, "1. 以 {{SSRIs|藥物類別}} 為首選藥物，特別適用於有心臟血管疾病或需要避免鎮靜作用或無法忍受抗膽鹼性作用之患者\n2. 宜固定時間服用抗憂鬱藥，需經過 {{4~6 週|數值}}用藥後才能評估療效，且抗憂鬱藥物不屬於成癮性藥品\n3. 抗憂鬱藥物的副作用有時會比療效更快出現"],
  [{ t: "停藥", b: true }, "1. 抗憂鬱藥物服用一段時間，突然停藥會產生戒斷症狀，2-3 天會開始產生暈眩、頭痛等症狀，此症狀會持續約 3-7 天，應以每週{{漸次減量|名詞}}的方式停藥\n2. 服用 {{Fluoxetine、Bupropion|藥名}} 一段時間後，評估病情穩定改善可停藥時，不須數週漸次減量"] ] } });
kA(17, "憂鬱症治療原則", 106, "各類抗憂鬱藥特色", { table: { head: ["藥理分類", "藥理特色"], rowNames: ["TCAs", "SSRIs", "SNRIs", "DNRIs", "MAOIs", "MAOIs", "Atypical antidepressant"], rows: [
  [{ t: "Tricyclic antidepressants\n（TCAs）", b: true }, "1. 三環抗憂鬱藥常具有鎮靜和自主神經系統副作用，因而限制其用途，\n超過劑量最危險的副作用是{{心臟毒性|副作用}}（需監測心電圖）及痙攣，因此有心臟疾病患者禁用\n2. 三環抗憂鬱藥結構與 {{Phenothiazines|結構}} 相似，皆可阻斷：組織胺接受器，腎上腺素接收器，M 接收器"],
  [{ t: "Selective serotonin reuptake inhibitors\n（SSRIs）", b: true }, "1. 最常見的副作用是{{失眠|副作用}}、胃腸道不適、性功能障礙\n2. SSRI 為首選藥，特別適用於有心臟血管疾病或需要避免鎮靜作用或無法忍受抗膽鹼性作用之患者\n3. SSRIs 優於 TCAs 的方面，包括抗 M 作用少、心臟血管毒性小、鎮靜作用弱"],
  [{ t: "Serotonin–norepinephrine reuptake inhibitors\n（SNRIs）", b: true }, "1. 同時抑制血清素與正腎上腺素，效果與 TCA 相似\n2. 與 TCA 不同之處，對於腎上腺、毒蕈鹼、抗組織胺接受器{{沒有|性質}}抑制作用"],
  [{ t: "Norepinephrine-Dopamine reuptake inhibitor\n（DNRIs）", b: true }, "Bupropion\n1. 較不會引起體重增加、性功能障礙\n2. 適應症：{{戒菸|疾病}}（300mg/day）\n3. 副作用：失眠、誘發{{癲癇|副作用}}"],
  [{ t: "Monoamine oxidase inhibitors", b: true, rs: 2 }, "1. 與含 {{Tyramine|物質}} 的食物會產生交互作用，如起司、燒烤和啤酒，會產生高血壓危象\n2. MAO-A 抑制劑抑制 NE、5-HT 之代謝，可用於憂鬱症"],
  [null, "✧ 併用易引起 {{Serotonin syndrome|副作用}}\nSSRI、SNRI、MAOIs、Meperidine、Tramadol、Pentazocine、Fentanyl、Dextromethorphan、Linezolid\n若發生此症狀（臨床表徵：肌陣攣、顫抖、高血壓、精神狀態變化）→ 可以使用 {{Cyproheptadine|藥名}}"],
  [{ t: "Atypical antidepressant", b: true }, "1. {{Mirtazapine|藥名}} 具有 α2 阻斷的效果，可增加突觸間隙的 NE 量\n2. {{Trazodone|藥名}} 具有 5-HT2 阻斷的作用，增加突觸間多巴胺和 NE 的濃度"] ] } });
kA(17, "抗憂鬱藥物常見副作用", 107, "抗憂鬱藥物常見副作用", { table: {
  head: [[{ t: "抗憂鬱藥物常見副作用", cs: 9 }, null, null, null, null, null, null, null, null], ["藥物分類", "藥物", "鎮靜", "抗膽鹼", "姿勢性低血壓", "失眠（癲癇發作）", "噁心、腹瀉", "性功能障礙", "體重↑"]],
  cols: ["藥物分類", "藥物", "鎮靜", "抗膽鹼", "姿勢性低血壓", "失眠（癲癇發作）", "噁心、腹瀉", "性功能障礙", "體重↑"],
  rowNames: ["Amitriptyline", "Imipramine", "Nortriptyline", "Desipramine", "Doxepin", "Fluoxetine", "Paroxetine", "Sertraline", "Citalopram", "Escitalopram", "Venlafaxine", "Desvenlafaxine", "Duloxetine", "Bupropion", "Mirtazapine", "Nefazodone"], rows: [
  [{ t: "TCAs", b: true, rs: 5 }, "Amitriptyline", "++++", "++++", "++++", "0/+", "0/+", "++", "+++"],
  [null, "Imipramine（Fronil®福樂你）", "+++", "+++", "+++", "0/+", "0/+", "++", "++"],
  [null, "Nortriptyline", "++", "++", "++", "+", "0/+", "+", "++"],
  [null, "Desipramine", "++", "++", "+++", "+", "0/+", "+", "++"],
  [null, "Doxepin", "++++", "++++", "++++", "0/+", "0/+", "++", "++"],
  [{ t: "SSRIs", b: true, rs: 5 }, "Fluoxetine（Prozac®百憂解）", "+", "0/+", "0/+", "{{++++|數值}}", "++++", "++++", "+"],
  [null, "Paroxetine（Seroxat®克憂果）", "++", "+", "0", "++", "+++", "++++", "++"],
  [null, "Sertraline（Zoloft®樂復得）", "+", "0/+", "0", "+++", "+++", "+++", "+"],
  [null, "Citalopram", "++", "0/+", "0", "++", "+++", "++", "+"],
  [null, "Escitalopram（Leeyo®離憂）", "+", "0/+", "0", "++", "+++", "++", "+"],
  [{ t: "SNRIs", b: true, rs: 3 }, "Venlafaxine（Efexor®速悅）", "++", "+", "0", "++", "+++", "+++", "+"],
  [null, "Desvenlafaxine", "++", "+", "+", "++", "+++", "++", "0/+"],
  [null, "Duloxetine（Cymbalta®千憂解）", "++", "+", "0", "++", "+++", "++", "0/+"],
  [{ t: "DNRIs", b: true }, "Bupropion（Wellbutrin® XL 威克倦）", "{{0|數值}}", "+", "0", "+++", "+", "0/+", "0"],
  [{ t: "非典型", b: true, rs: 2 }, "Mirtazapine（Mesyrel®美舒鬱）", "++++", "++", "0/+", "0", "+", "0/+", "{{+++|數值}}"],
  [null, "Nefazodone", "+++", "+", "++", "+", "++", "0/+", "0/+"] ],
  note: "1. 使用 TCA 易引發{{姿勢性低血壓|副作用}}的副作用\n2. 較易引起體重增加：Amitriptyline、Mirtazapine、{{Paroxetine|藥名}}（SSRI 中最易誘發體重增加）\n3. 下列何種抗憂鬱劑最不適用於老年人？\n(A) Bupropion (B) Citalopram (C) Doxepin (D) Venlafaxine　選 {{C|名詞}}" } });
kA(17, "憂鬱症治療原則", 108, "神經病變疼痛治療用藥", { table: { head: ["神經病變疼痛治療用藥", "藥物分類", "藥名"], rowNames: ["第一線・抗癲癇", "第一線・SNRIs", "第一線・TCAs", "第二線"], rows: [
  [{ t: "第一線", b: true, rs: 3 }, "抗癲癇", "{{Pregabalin、Gabapentin|藥名}}"],
  [null, "SNRIs", "{{Duloxetine|藥名}}"],
  [null, "TCAs", "Amitriptyline、Nortriptyline、Desipramine"],
  [{ t: "第二線", b: true }, { t: "{{Lidocaine、Capsaicin（辣椒素）|藥名}}", cs: 2 }, null] ] } });
dA(17, "三環抗憂鬱藥：三級胺", 109, "amitriptyline", "Amitriptyline", null, {
  cls: ["三環抗憂鬱藥（三級胺）：抑制 {{NE 及 5-HT|物質}} 的再回收"],
  feat: ["{{抗膽鹼及鎮靜|副作用}}作用最強", "{{老年人|族群}}不宜使用", "與 Benztropine 併用，會有較強的口乾、視力模糊、尿滯留、便祕等反應", "活性代謝物：{{Nortriptyline|藥名}}、10-Hydroxy-nortriptyline"] });
mA("imipramine", 109, {
  struct: ["Amitriptyline 與 Imipramine 為 {{Bioisostere|名詞}}"],
  feat: ["三級胺：抑制 NE 及 5-HT 再回收", "活性代謝物：{{Desipramine|藥名}}、2-Hydroxydesipramine"] });
dA(17, "三環抗憂鬱藥：三級胺", 109, "doxepin", "Doxepin", null, {
  cls: ["三環抗憂鬱藥（三級胺）"],
  struct: ["具有 {{Dibenzoxepine|結構}} 骨架", "具有幾何異構物，其中 {{E-form|結構}} 對 NET 抑制較強，Z-form 對 SERT 抑制較強"],
  feat: ["代謝：{{N-脫烷基|名詞}}"] });
dA(17, "三環抗憂鬱藥：三級胺", 109, "clomipramine", "Clomipramine", null, {
  cls: ["三環抗憂鬱藥（三級胺）：抑制正腎上腺素及血清素的再吸收"],
  feat: ["經 {{2D6|酵素}} 行 N-脫甲基後生成之活性代謝物，抑制 NE 再回收之效力較原藥強"] });
dA(17, "三環抗憂鬱藥：二級胺", 110, "nortriptyline", "Nortriptyline", null, {
  cls: ["三環抗憂鬱藥（二級胺）：抑制 {{NE|物質}} Reuptake"],
  feat: ["較少的抗膽鹼、鎮靜作用，而有較多的{{興奮|名詞}}作用"] });
dA(17, "三環抗憂鬱藥：二級胺", 110, "desipramine", "Desipramine", null, {
  cls: ["三環抗憂鬱藥（二級胺）：抑制 NE Reuptake"],
  feat: ["較少的抗膽鹼及鎮靜作用，有較多的興奮作用", "三環抗憂鬱藥中，造成{{姿勢性低血壓|副作用}}的作用{{最小|性質}}"] });
dA(17, "三環抗憂鬱藥：二級胺", 110, "protriptyline", "Protriptyline", null, {
  cls: ["三環抗憂鬱藥（二級胺）"],
  struct: ["結構骨架：{{Dibenzocycloheptene|結構}}"] });
dA(17, "三環抗憂鬱藥：二級胺", 110, "amoxapine", "Amoxapine", null, {
  cls: ["三環抗憂鬱藥（二級胺）"],
  struct: ["結構骨架：{{Dibenzoxazepine|結構}}"],
  feat: ["{{Loxapine|藥名}} 經 N 脫甲基後可得 Amoxapine"] });
dA(17, "四環抗憂鬱藥", 110, "maprotiline", "Maprotiline", null, {
  cls: ["{{四環|結構}}抗憂鬱藥（二級胺）：抑制 NE Reuptake"],
  struct: ["結構骨架：{{Dibenzobicyclooctadiene|結構}}"],
  feat: ["體內受 {{2C19 及 2D6|酵素}} 形成活性代謝物 N-desmethylmaprotiline"] });
dA(17, "非三環抗憂鬱藥", 111, "nisoxetine", "(±)-Nisoxetine", "Nisoxetine", {
  cls: ["非三環抗憂鬱藥（二級胺）：抑制 NE Reuptake"],
  struct: ["具 {{Phenoxyphenylamine|結構}} 骨架"],
  feat: ["{{R form|結構}} 對 NET 之抑制力大於 S form"] });
dA(17, "非三環抗憂鬱藥", 111, "reboxetine", "S,S-Reboxetine", "Reboxetine", {
  cls: ["非三環抗憂鬱藥（二級胺）"],
  struct: ["結構具 {{Morpholine|結構}}", "有{{兩|數值}}個 Chiral center"],
  feat: ["可用於治療重度憂鬱症"] });
dA(17, "非三環抗憂鬱藥", 111, "atomoxetine", "R-(−)-Atomoxetine", "Atomoxetine", {
  cls: ["非三環抗憂鬱藥（二級胺）"],
  feat: ["用於治療兒童及成年人之{{注意力不集中症（ADHD）|疾病}}、成人憂鬱症", "R form 對 NET 之抑制力大於 S form"] });
dA(17, "SSRIs", 112, "fluoxetine", "(S)-Fluoxetine", "Fluoxetine", {
  cls: ["{{SSRIs|藥物類別}}：Phenoxy-phenylalkylamine"],
  feat: ["停藥後不易產生戒斷徵候症狀（Fluoxetine、Bupropion）", "可治療{{暴食症|疾病}}（使 5-HT 上升）", "屬於 {{2D6 inhibitors|名詞}}", "經 2D6 行 N-脫烷基形成活性代謝物 {{Norfluoxetine|物質}}", "副作用：{{失眠|副作用}}、躁動"] });
dA(17, "SSRIs", 112, "paroxetine", "Paroxetine", null, {
  cls: ["SSRIs：Phenoxy-phenylalkylamine"],
  struct: ["結構具兩個 chiral center，以 {{(3S,4R)-(−)|結構}} 上市"],
  feat: ["屬於 {{2D6 抑制劑|名詞}}"] });
dA(17, "SSRIs", 112, "citalopram", "Citalopram（Ci-CN）", "Citalopram", {
  cls: ["SSRIs：5-HT 再回收抑制劑"],
  feat: ["會使患者出現自殺傾向而作廢此藥", "{{S-form|結構}} 對 Serotonin transporter 選擇性及親和力較佳", "S-form 之代謝速率較 R-form {{快|性質}}"] });
dA(17, "SSRIs", 112, "sertraline", "Sertraline", null, {
  cls: ["SSRIs：Phenylalkylamines"],
  struct: ["具 {{Tetraline|結構}}", "有兩個 chiral center，以 {{S,S-(+)|結構}} 上市"],
  feat: ["經 {{2B6|酵素}} 行 N-脫烷基形成活性代謝物 N-desmethylsertraline"] });
dA(17, "SSRIs", 112, "fluvoxamine", "Fluvoxamine", null, {
  cls: ["SSRIs：Aralkylketone"],
  struct: ["含有 {{Oxime|結構}} 基團，需避光儲存", "具 CN 雙鍵"],
  feat: ["經 2D6 行 O-脫烷基，再繼續氧化成酸"] });
dA(17, "SNRIs", 113, "duloxetine", "Duloxetine", null, {
  cls: ["NE/5-HT 再回收抑制劑（{{SNRI|藥物類別}}）"],
  feat: ["Du 想成 {{dual|名詞}} 即抑制兩種神經傳遞物質", "經 2D6 行 N-脫烷基生成活性代謝物"] });
dA(17, "SNRIs", 113, "venlafaxine", "Venlafaxine", null, {
  cls: ["SNRI"],
  feat: ["由 CYP2D6（{{O-demethylation|名詞}}）形成活性代謝物 {{Desvenlafaxine|物質}}", "次要代謝：N-脫烷基"] });
dA(17, "SNRIs", 113, "milnacipran", "Milnacipran", null, {
  cls: ["SNRI"],
  feat: ["可治療{{纖維化肌痛|疾病}}", "以丙基胺取代甲基胺可生成具 {{NMDA 受體拮抗劑|藥物類別}}之抗憂鬱藥", "在美國 (1S,2R)-Levomilnacipran 上市", "Levomilnacipran 經由 {{3A4|酵素}} 行 N-脫乙基生成 Norlevomilnacipran"] });
dA(17, "NDRIs", 113, "bupropion", "Bupropion", null, {
  cls: ["Norepinephrine-Dopamine reuptake inhibitor（{{NDRIs|藥物類別}}）"],
  struct: ["記法：4(Bu)3(pro)酮(on)"],
  feat: ["可能使{{癲癇|疾病}}患者惡化（使 CNS 興奮）", "不容易引起體重增加、性功能障礙，停藥後不易產生戒斷症候群", "可用於{{戒菸|疾病}}患者", "經 {{2B6|酵素}} 行氧化生成活性代謝物 Hydroxybupropion"] });
dA(17, "NaSSA", 114, "mirtazapine", "Mirtazapine", null, {
  cls: ["Noradrenergic and specific serotonergic antidepressant（{{NaSSA|藥物類別}}）"],
  feat: ["阻斷 {{α2 receptor|標的}} 及 5-HT2，增加腦中 NE 及 5-HT 的活性", "主要副作用為{{鎮靜、體重上升|副作用}}"] });
mA("trazodone", 114, {
  cls: ["Serotonin receptor modulators and stimulator（{{SMS|藥物類別}}），本類藥物均具有 {{Phenylpiperazine|結構}}"],
  struct: ["具有 {{Triazolopyridine|結構}} 之結構"],
  feat: ["主要副作用為{{鎮靜|副作用}}", "經 {{3A4|酵素}} 行 N-脫烷基生成活性代謝物 {{m-chlorophenylpiperazine|物質}}", "少部分會代謝形成有毒物 Iminoquinone", "{{Nefazodone|藥名}} 為同機轉藥物"] });
dA(17, "SMS", 114, "vilazodone", "Vilazodone", null, {
  cls: ["SMS（具有 Phenylpiperazine）"], struct: ["結構含有 {{Indole、CN 三鍵|結構}}"] });
dA(17, "SMS", 114, "vortioxetine", "Vortioxetine", null, {
  cls: ["{{SMS|藥物類別}}（具有 Phenylpiperazine）"] });
kA(17, "MAOI", 115, "MAOI 共同注意事項", [
  "MAOI（{{不能|性質}}併用含 {{Tyramine|物質}} 的食物，會引起血壓上升的危險）"
]);
dA(17, "MAOI", 115, "phenelzine", "Phenelzine", null, {
  cls: ["MAOI"],
  feat: ["治療憂鬱症的機轉為抑制 {{MAO-A|酵素}}", "以 {{Phenethyl free radicals|物質}} 與 MAO 產生共價鍵", "為{{不可逆|性質}}之抑制作用"] });
dA(17, "MAOI", 115, "isocarboxazid", "Isocarboxazid", null, {
  cls: ["MAOI"],
  struct: ["拆字：Iso- {{isoxazole|結構}} car-carbamide"],
  feat: ["以 {{Benzyl radical|物質}} 抑制 MAO-A"] });
dA(17, "MAOI", 115, "tranylcypromine", "Tranylcypromine", null, {
  cls: ["MAOI"],
  struct: ["Tranyl-Phenyl cypro-{{環丙烷|結構}}"],
  feat: ["呈現類似 {{Amphetamine|藥名}} 之中樞興奮作用"] });
dA(17, "MAOI", 115, "selegiline", "Selegiline", null, {
  cls: ["MAOI：{{不可逆的 MAO-B|酵素}} 抑制劑"],
  struct: ["含 {{Propargylamine|結構}}"],
  feat: ["可用治療{{巴金森氏症|疾病}}"] });
dA(17, "MAOI", 115, "moclobemide", "Moclobemide", null, {
  cls: ["MAOI：{{可逆的 MAO-A|酵素}} 抑制劑"],
  struct: ["Mo-{{Morpholine|結構}}、E-ethyl、mide-醯胺、cl"] });

/* 講義第 116～119 頁（18. 抗巴金森氏症藥物）暫時沒有收錄。 */

/* ===== 第 19 章 全身麻醉劑 ===== */
chA(19, "19", "全身麻醉劑", "120～124");
kA(19, "吸入型麻醉劑總論", 120, "吸入型麻醉劑藥理重點（一）", { table: {
  head: [{ t: "吸入型麻醉劑", cs: 2 }, null, { t: "藥理重點", cs: 2 }, null],
  cols: ["吸入型麻醉劑", "", "藥理重點", "藥理重點"],
  rowNames: ["麻醉的分期", "作用機轉", "藥物的使用", "血氣分配係數", "吸入氣體濃度"], rows: [
  [{ t: "麻醉的分期", b: true, cs: 2 }, null, { t: "藥物對於中樞系統抑制作用是有順序的，通常把麻醉順序分為{{四|數值}}期\nStage 1：會產生{{止痛|名詞}}作用\nStage 2：會產生{{興奮|名詞}}作用（抑制，抑制性神經元）\nStage 3：會產生{{麻醉|名詞}}作用（抑制，興奮性神經元）\nStage 4：會產生{{延腦抑制|名詞}}作用（麻醉劑過量）", cs: 2 }, null],
  [{ t: "作用機轉", b: true, cs: 2 }, null, { t: "✧ 全麻可溶於細胞膜並擾亂細胞膜的結構，因此可以改變離子的流量\n→減少{{鈉離子內流|名詞}}和增加{{鉀離子外流|名詞}}（相當於抑制的作用），而產生麻醉作用\n→當藥物的{{油水分配係數|名詞}}增加，會使藥物活性上升", cs: 2 }, null],
  [{ t: "藥物的使用", b: true, cs: 2 }, null, { t: "麻醉前輔助用藥：\n✧ 解焦慮：口服 {{Benzodiazepines|藥物類別}}\n✧ 減少分泌物：給 {{Atropine、Scopolamine|藥名}}（也會造成記憶喪失）\n✧ 術後抗嘔吐作用：Metoclopramide、Ondansetron、Droperidol\n→與嘔吐有關的神經傳遞物質有多巴胺、血清素、組織胺、P 物質、乙醯膽鹼\n✧ 肌肉鬆弛劑：{{Atracurium、Pancuronium|藥名}}\n維持麻醉（吸入給藥）：{{N2O、Halothane|藥名}}\n誘導麻醉（靜脈注射給藥）：Barbiturates、Non-Barbiturates", cs: 2 }, null],
  [{ t: "探討麻醉的誘導速度\n（快慢）", b: true, rs: 2 }, { t: "血氣分配係數", b: true }, { t: "✧ N2O（血氣分配係數：{{0.47|數值}}）\n✧ Methoxyflurane（血氣分配係數：12）→血氣分配係數越大作用速度越{{慢|性質}}", cs: 2 }, null],
  [null, { t: "吸入氣體濃度", b: true }, "增加誘導速率：\n✧ 增加吸入型氣體中的藥物濃度比例\n✧ 增加{{肺泡換氣速率|名詞}}", "降低誘導速率：\n✧ 增加麻醉藥物的{{血中溶解度|名詞}}\n✧ 增加心輸出量"] ] } });
kA(19, "吸入型麻醉劑總論", 121, "吸入型麻醉劑藥理重點（二）", { table: { head: ["吸入型麻醉劑", "藥理重點"], rows: [
  [{ t: "探討麻醉的效力\n（強弱）", b: true }, "以最低肺泡濃度（{{MAC|名詞}}）評估：\n定義：在疼痛刺激下，當麻醉劑發揮藥效時，有 {{50%|數值}} 的患者不痛，此時的濃度稱為 MAC→MAC 越大藥效越{{弱|性質}}"],
  [{ t: "其他因素", b: true }, "✧ 體溫高→所需 MAC 上升，體溫低→所需 MAC 下降\n✧ 年輕人→所需 MAC 上升，{{老年人|族群}}→所需 MAC 下降\n✧ 長期飲酒，使用中樞抑制劑→所需 MAC {{上升|性質}}\n✧ 同時併用嗎啡類止痛藥→所需 MAC 下降\n✧ 懷孕→所需 MAC 下降"],
  [{ t: "探討藥物移除速率\nContext-sensitive half-time", b: true }, "定義：藥物在血中濃度達到停止前 50%，所需要的時間\n→數字越大，藥物移除速率越{{慢|性質}}"] ] } });
kA(19, "吸入性麻醉劑的藥理特性", 122, "吸入性麻醉劑的藥理特性", { table: { head: ["麻醉劑", "血氣分配係數（快慢）", "MAC（強弱）", "沸點（°C）", "代謝"], rows: [
  [{ t: "Nitrous oxide", b: true }, "0.47", "{{>100（最弱）|數值}}", "氣體", "無"],
  [{ t: "Halothane", b: true }, "2.3", "0.75", "50", ">40%"],
  [{ t: "Methoxyflurane", b: true }, "{{12（最慢）|數值}}", "{{0.16（最強）|數值}}", "105", ">70%"],
  [{ t: "Enflurane", b: true }, "1.8", "1.7", "56.5", "8%"],
  [{ t: "Isoflurane", b: true }, "1.4", "1.4", "49", "<2%"],
  [{ t: "Sevoflurane", b: true }, "0.69", "2.0", "58.5", "2-5%"],
  [{ t: "Desflurane", b: true }, "{{0.42（最快）|數值}}", "6-7", "23.5", "<0.05%"] ],
  note: "✓ 解題口訣（From 阿摩前輩）注意！由小到大排序\n1. 血氣分配係數：{{Desflurane|藥名}} < N2O < Sevoflurane < Isoflurane < Enflurane < Halothane < Methoxyflurane　→豬腦殺阿姨華美\n2. MAC：{{Methoxyflurane|藥名}} < Halothane < Isoflurane < Enflurane < Sevoflurane < Desflurane < N2O　→美華阿姨殺豬腦\n3. 代謝百分比：{{N2O|藥名}} < Desflurane < Isoflurane < Enflurane < Sevoflurane < Halothane < Methoxyflurane　→安(N)迪(D) I am 是我 hello me" } });
kA(19, "吸入性麻醉劑的藥理特性", 122, "練習題", [
  "1. 下列全身麻醉劑中何者的 minimum alveolar concentration（MAC）最高？(A) Nitrous oxide (B) Desflurane (C) Enflurane (D) Methoxyflurane",
  "2. 下列麻醉劑中，何者的代謝速率最慢？(A) Nitrous oxide (B) Enflurane (C) Halothane (D) Methoxyflurane",
  "3. 使用下列那一種全身性麻醉劑所需要的誘導期間最短，且其恢復也最快？(A) Sevoflurane (B) Methoxyflurane (C) Halothane (D) Isoflurane",
  "4. Minimum alveolar concentration（MAC）是評估全身麻醉劑效力的重要參數，下列何者的 MAC 值最小？(A) CHCl2 CF2OCH3 (B) CF3 CHBrCl (C) CHClFCF2OCHF2 (D) CF3 CHClOCHF2",
  "5. 下列全身麻醉劑中，何者在體內代謝之百分比最低？(A) CF3 CHBrCl (B) CHClFCF2OCHF2 (C) CHCl2 CF2 OCH3 (D) CF3 CHFOCHF2",
  "6. 下列全身麻醉劑中，何者對肝腎的毒性最低？(A) halothane (B) enflurane (C) methoxyflurane (D) isoflurane",
  "答案：1.{{A|名詞}} 2.{{D|名詞}} 3.{{A|名詞}} 4.{{A|名詞}} 5.{{D|名詞}} 6.{{D|名詞}}"
]);
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "nitrous-oxide", "Nitrous oxide（N2O）", "N2O", {
  cls: ["吸入型麻醉劑"],
  feat: ["於室溫時為{{氣體|性質}}", "{{不具|性質}}肌肉鬆弛作用（需合併使用肌肉鬆弛劑）", "不能單獨用於全身性麻醉", "單獨使用有{{止痛|名詞}}的效果", "有相對較短的麻醉誘導時間、較短的麻醉恢復期"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "halothane", "Halothane", null, {
  cls: ["吸入型麻醉劑"],
  feat: ["血氣分配係數：2.3", "最容易造成{{心輸出量及血壓下降|副作用}}", "止痛效果差（N2O 有止痛效果）", "引發{{肝毒性|副作用}}：因產生 {{CF3COCl|物質}}"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "methoxyflurane", "Methoxyflurane", null, {
  cls: ["吸入型麻醉劑"],
  feat: ["血氣分配係數：12", "MAC {{最小|性質}}", "其代謝產物的 {{F- 及 Oxalic acid|物質}} 會損害{{腎臟|器官}}"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "enflurane", "Enflurane", null, {
  cls: ["吸入型麻醉劑"],
  feat: ["不可用於{{癲癇|疾病}}患者（E-epileptic）", "代謝物會引起腎臟毒性", "{{CYP2E1|酵素}} 受質：Ethanol、Acetaminophen、Halothane"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "isoflurane", "Isoflurane", null, {
  cls: ["吸入型麻醉劑"],
  struct: ["與 Enflurane 為{{同分異構物|名詞}}"],
  feat: ["引起肝腎毒性的機率{{最低|性質}}（想成 iso 與別人與眾不同）", "代謝物為 {{CF3COOH|物質}}"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "desflurane", "Desflurane", null, {
  cls: ["吸入型麻醉劑"],
  feat: ["血氣分配係數{{最小|性質}}（des 去掉，想成來的快去的快）"] });
dA(19, "吸入型麻醉劑（維持麻醉，主要由 2E1 代謝）", 123, "sevoflurane", "Sevoflurane", null, {
  cls: ["吸入型麻醉劑"],
  feat: ["血氣分配係數：{{0.7|數值}}（想成 seven-0.7）"] });

/* 講義第 124～162 頁（19 章的靜脈麻醉劑、20～25 章）暫時沒有收錄。 */

/* ================= 心血管島（26～33） ================= */
isleA("cardio", "心血管島", { ground: "#E8A9B6", light: "#F0C2CB", cliff: "#C27A89" });

/* ===== 第 26 章 利尿劑用藥 ===== */
chA(26, "26", "利尿劑用藥", "163～171");
kA(26, "利尿劑作用位置", 163, "腎元作用位置（Katzung 圖）", { images: ["assets/amulet/fig/kidney.png"] });
kA(26, "利尿劑作用位置", 163, "四類利尿劑比較", { table: { head: ["", "Carbonic Anhydrase Inhibitors", "Loop diuretics", "Thiazide diuretics", "保鉀型利尿劑"], rows: [
  [{ t: "作用位置", b: true }, "近曲小管上的\nCarbonic anhydrase", "亨利式環之厚上行支的\n{{Na+/K+/2Cl- cotransporter|標的}}", "遠曲小管上的\n{{Na+/Cl- cotransporter|標的}}", "{{集尿管|器官}}"],
  [{ t: "人體 pH", b: true }, "代謝性{{酸|名詞}}中毒", "代謝性{{鹼|名詞}}中毒", "代謝性鹼中毒", "代謝性酸中毒"],
  [{ t: "尿液 pH", b: true }, "鹼化尿液", "酸化尿液", "酸化尿液", "鹼化尿液"],
  [{ t: "適應症", b: true }, "青光眼、高山症", "{{高血鈣|疾病}}、人體陰離子過量", "高血壓、{{腎因性尿崩症|疾病}}", "Amiloride\n可治 {{Liddle's syndrome|疾病}}"],
  [{ t: "副作用", b: true }, "感覺異常、肝性腦病變、\n磺胺過敏反應", "高尿酸、高血糖、耳毒性", "高尿酸、高血糖、高血脂", "{{高血鉀|副作用}}"] ] } });
kA(26, "Carbonic Anhydrase Inhibitors", 164, "CAI 機轉與特色", { images: ["assets/amulet/fig/pct.png"], points: [
  "1. 機轉：抑制近曲小管 {{HCO3-|物質}} 的再吸收，減少 Na+／H+ 之間的交換，造成 Na+、HCO3- 排出增加，H+ 排出減少",
  "（補充）：SGLT2（Sodium glucose cotransporter 2），其抑制劑為降血糖藥，如 {{Canagliflozin、Dapagliflozin|藥名}}",
  "2. 適應症：青光眼、高山症、{{癲癇|疾病}}",
  "3. 副作用：代謝性酸中毒、鹼化尿液、{{低血鉀|副作用}}、肝性腦病變、磺胺過敏反應、感覺異常",
  "✧ 連續使用 CAI，會對利尿作用產生{{抗藥性|名詞}}，藥效會降低",
  "✧ 大部分的鋰鹽在近曲小管被再吸收，因此 CAI 會{{加速|性質}}鋰鹽的排泄" ] });
kA(26, "Loop diuretics", 165, "Loop diuretics 機轉與特色", { images: ["assets/amulet/fig/loop.png"], points: [
  "1. 機轉：正常情況下，Na+、K+、Cl- 藉由 Loop 厚上行支的 Na+／K+／2Cl- cotransporter 送到細胞中，但是大部分的 K+ 會再運送回管腔中，因此管腔內相對帶{{正電|名詞}}，管腔內帶正電的 Ca+、Mg+ 因為正電互相排斥，會再吸收回細胞。",
  "2. 使用 Loop diuretics 時，因為阻斷 Na+／K+／2Cl- cotransporter，使 Na+、K+、Cl- 無法送到細胞，K+ 無法回到管腔內，此時管腔內的正電下降，{{Ca+、Mg+|物質}} 也無法再送回細胞。",
  "3. 適應症：{{高血鈣|疾病}}、高血鉀、心衰竭造成的{{肺水腫|疾病}}、人體陰離子過量",
  "4. 副作用：高血糖、高尿酸血症、低血鉀、低血鈣、{{低血鎂|副作用}}、耳毒性" ] });
kA(26, "Thiazide diuretics", 166, "Thiazide diuretics 機轉與特色", { images: ["assets/amulet/fig/dct.png"], points: [
  "1. 機轉：抑制{{遠曲小管|器官}}上的 Na+／Cl- cotransporter，造成 Na+ 的排除增加，產生利尿的作用。\n當 Na+／Cl- cotransport 被抑制時，Na+ 減少，會增加 Na+／Ca2+ 的交換，{{增加 Ca2+ 的再吸收|名詞}}。",
  "2. 適應症：高血壓、心衰竭、{{腎因性尿崩症|疾病}}",
  "3. 中樞性尿崩症：{{Desmopressin|藥名}} 治療",
  "4. Li 鹽導致的尿崩症：{{Amiloride|藥名}} 治療",
  "5. 副作用：{{高血鈣症|副作用}}、高尿酸血症、高血糖、高血脂、低血鉀" ] });
kA(26, "保鉀型利尿劑", 167, "集尿管的調節（Katzung 圖）", { images: ["assets/amulet/fig/cd.png"] });
kA(26, "保鉀型利尿劑", 167, "保鉀型利尿劑與 Vasopressin antagonist", { table: { cols: ["分類", "藥名", "藥理特色"], rowNames: ["Spironolactone、Eplerenone", "Triamterene、Amiloride", "Conivaptan、Tolvaptan"], rows: [
  [{ t: "保鉀型利尿劑", b: true }, "Spironolactone\nEplerenone", "1. 機轉：於集尿管中阻斷 {{Aldosterone|物質}} 的作用\n2. 適應症：{{肝硬化造成的腹水|疾病}}、Conn's syndrome、心衰竭\n3. 副作用：{{男性女乳症|副作用}}、高血鉀"],
  [{ t: "保鉀型利尿劑", b: true }, "Triamterene\nAmiloride", "1. 機轉：於集尿管中阻斷 {{Na+ channel|標的}}\n2. 適應症：Amiloride 可用於{{鋰鹽|藥名}}導致的尿崩症、Liddle's syndrome"],
  [{ t: "Vasopressin antagonist", b: true }, "Conivaptan(IV)\nTolvaptan(PO)", "1. 機轉：阻斷 {{V2 receptor|標的}}，使 {{Aquaporin-2|標的}} 無法產生作用\n2. 適應症：高血容積{{低血鈉症|疾病}}、{{SIADH|疾病}}"] ],
  note: "✧ Aldosterone：當血液循環體積減少及血壓下降時會刺激 Aldosterone 分泌，增加 {{Na+|物質}} 的再吸收，並增加 K+ 和 H+ 的排除\n✧ Vasopressin 含 {{9|數值}} 個胺基酸胜肽，由後葉釋放，作用在 V2 receptor，在集尿管會增加水通道的數量，並增加水的再吸收\n✧ {{Liddle's syndrome|疾病}} 為假性醛固酮過多症，可使用 Triamterene 或 Amiloride 治療" } });
dA(26, "保鉀型利尿劑", 167, "spironolactone", "Spironolactone、Eplerenone", "Spironolactone", {
  cls: ["保鉀型利尿劑：於集尿管中阻斷 {{Aldosterone|物質}} 的作用"],
  feat: ["適應症：{{肝硬化造成的腹水|疾病}}、Conn's syndrome、心衰竭", "副作用：{{男性女乳症|副作用}}、高血鉀"] });
dA(26, "保鉀型利尿劑", 167, "triamterene-amiloride", "Triamterene、Amiloride", "Amiloride", {
  cls: ["保鉀型利尿劑：於集尿管中阻斷 {{Na+ channel|標的}}"],
  feat: ["適應症：Amiloride 可用於{{鋰鹽|藥名}}導致的尿崩症、Liddle's syndrome"] });
dA(26, "Vasopressin antagonist", 167, "conivaptan-tolvaptan", "Conivaptan（IV）、Tolvaptan（PO）", "Tolvaptan", {
  cls: ["Vasopressin antagonist：阻斷 {{V2 receptor|標的}}，使 {{Aquaporin-2|標的}} 無法產生作用"],
  feat: ["適應症：高血容積{{低血鈉症|疾病}}、{{SIADH|疾病}}"] });
dA(26, "Carbonic anhydrase inhibitors", 168, "acetazolamide", "Acetazolamide", null, {
  cls: ["{{Carbonic anhydrase inhibitors|藥物類別}}"],
  feat: ["治療{{青光眼|疾病}}、高山症、癲癇治療輔助劑", "副作用：感覺異常、嘔吐", "可增加{{鋰鹽|藥名}}的排泄"] });
dA(26, "Carbonic anhydrase inhibitors", 168, "methazolamide", "Methazolamide", null, {
  cls: ["Carbonic anhydrase inhibitors"],
  struct: ["N 上多一個{{甲基|結構}}取代，降低極性，更容易滲透到眼液中"] });
dA(26, "Carbonic anhydrase inhibitors", 168, "dichlorphenamide", "Dichlorphenamide", null, {
  cls: ["Carbonic anhydrase inhibitors"],
  struct: ["4,5-Dichloro-1,3-benzenedisulfonamide"],
  feat: ["CAI 中{{最強效|性質}}藥物", "治療青光眼、急性高山症"] });
dA(26, "Loop diuretics", 168, "furosemide", "Furosemide", null, {
  cls: ["Loop Diuretics：5-Sulfamoyl-{{2|數值}}-aminobenzoic acid derivatives"],
  struct: ["為 {{Anthranilic acid|結構}} 衍生物，具 Sulfonamide 結構，含 {{Furan|結構}} 環"],
  feat: ["可用於肺水腫、心臟衰竭、高鈣血症之患者", "副作用：{{耳毒性|副作用}}"] });
dA(26, "Loop diuretics", 168, "bumetanide", "Bumetanide", null, {
  cls: ["Loop Diuretics：5-Sulfamoyl-{{3|數值}}-aminobenzoic acid derivatives"],
  struct: ["為 {{Metanilic acid|結構}} 衍生物"],
  feat: ["本類中{{最強效|性質}}藥物"] });
dA(26, "Loop diuretics", 168, "torsemide", "Torsemide", null, {
  cls: ["Loop Diuretics：4-amino-pyridyl-3-sulfonylurea"],
  struct: ["具有 {{Sulfonylurea|結構}}", "解字：T-toluene、O-sulfone、R-urea"],
  feat: ["本類中{{最長效|性質}}藥物"] });
dA(26, "Loop diuretics", 168, "ethacrynic-acid", "Ethacrynic acid", null, {
  cls: ["Loop Diuretics：{{Phenoxyacetic acid|結構}}"],
  struct: ["氯的位置是在 2-,3- 上"],
  feat: ["{{非磺胺類|性質}}藥物（不會產生過敏反應）", "副作用：最易造成{{耳毒性|副作用}}", "可與含 {{-SH|結構}} 基之酵素產生共價結合"] });
kA(26, "Thiazide diuretics", 169, "Thiazide-diuretics SAR", { table: { cols: ["位置", "藥化特色"], rows: [
  [{ t: "Thiazide-diuretics SAR", b: true }, { t: "Thiazide 骨架", img: "assets/amulet/thiazide-sar.png" }],
  [{ t: "位置", b: true }, { t: "藥化特色", b: true }],
  [{ t: "N2", b: true }, "小烷基取代（CH3）取代，可{{延長藥效|性質}}"],
  [{ t: "C3", b: true }, "烷基取代（Haloalkyl、Aralkyl、Thioether），可延長藥效、增加活性"],
  [{ t: "N4", b: true }, "C3、C4 之間的雙鍵飽和（{{3,4-Dihydro|結構}}），活性會增加 {{10|數值}} 倍"],
  [{ t: "N4 C5 C8", b: true }, "若有烷基取代，會{{降低|性質}}利尿活性"],
  [{ t: "C6", b: true }, "{{拉電子基|結構}}取代（Cl、Br、CF3、NO2）可增加活性\n推電子基取代（CH3、OCH3），活性降低"],
  [{ t: "C7", b: true }, "會在 7 號位導入 {{SO2NH2|結構}}（必要基團）\n7 號位之 N 與 2 號位之 N 相比，{{2 號位|結構}}之 N 酸性較強，\n會在 2 號位與 NaOH 反應形成鈉鹽供靜脈注射（IV）"] ] } });
dA(26, "Thiazide 類利尿劑", 170, "chlorothiazide", "Chlorothiazide", null, {
  cls: ["Thiazide Diuretics"],
  struct: ["具有 {{Benzothiadiazine-1,1-dioxide|結構}}"],
  feat: ["會抑制 insulin 釋放，導致{{血糖上升|副作用}}", "可減少尿液中的{{鈣離子|物質}}，治尿路結石"] });
dA(26, "Thiazide 類利尿劑", 170, "quinethazone", "Quinethazone", null, {
  cls: ["Thiazide-like Diuretics：Tetrahydroquinazolinone"],
  struct: ["結構中含有 {{Quinazolinone|結構}}", "{{Metolazone|藥名}} 亦含有 Quinazolinone"] });
dA(26, "Thiazide 類利尿劑", 170, "indapamide", "Indapamide", null, {
  cls: ["Thiazide-like Diuretics：Benzohydrazide"],
  struct: ["含有 {{Indoline|結構}} 環"],
  feat: ["同時具有利尿及{{血管放鬆|名詞}}作用"] });
dA(26, "Thiazide 類利尿劑", 170, "chlorthalidone", "Chlorthalidone", null, {
  cls: ["Thiazide-like Diuretics"], struct: ["結構特色：{{Phthalimidine|結構}}"] });
dA(26, "Thiazide 類利尿劑", 170, "xipamide", "Xipamide", null, {
  cls: ["Thiazide-like Diuretics"], struct: ["結構特色：{{Salicylanilide|結構}}"] });
mA("spironolactone", 171, {
  struct: ["在 7 號位有 {{-SCOCH3|結構}} 增加口服活性", "17 號位有 {{γ-Lactone|結構}} 五角環"],
  feat: ["經由脫去 C7-SCOCH3，生成活性代謝物 {{Canrenone|物質}}（Δ6）", "Eplerenone 9,11 有 {{epoxide|結構}}，相較於 Spironolactone 較不會有男性女乳症的副作用"] });
mA("triamterene-amiloride", 171, {
  struct: ["Triamterene：2,4,7-Triamino-6-phenylpteridine，結構上有 3 個胺基，為 {{pteridine|結構}} 衍生物", "Amiloride：具有強鹼性的 {{Guanidino|結構}} 基，為 {{Pyrazine|結構}} 衍生物"],
  feat: ["4'-hydroxytriamterene 具利尿活性", "Amiloride 噴霧劑可用於 {{Cystic fibrosis|疾病}} 病人"] });
dA(26, "滲透壓利尿劑", 171, "mannitol", "D-Mannitol", "Mannitol", {
  cls: ["滲透壓利尿劑（{{Osmotic Diuretics|藥物類別}}）：增加腎小管內過濾液的滲透壓，減少水份的再吸收，增加尿液排出量"],
  feat: ["可降低顱內壓、眼內壓、治療{{大腦水腫|疾病}}", "副作用：不可使用在{{心衰竭|疾病}}病人"] });

/* ===== 第 27 章 高血壓藥物 ===== */
chA(27, "27", "高血壓藥物", "172～179");
kA(27, "高血壓藥物總覽", 172, "種類、藥名與機轉", { table: { head: ["種類", "藥名", "機轉"], rows: [
  [{ t: "利尿劑", b: true, rs: 3 }, "Furosemide", "阻斷 Na+／K+／2Cl- cotransporter"],
  [null, "Chlorothiazide", "抑制 Na+／Cl- cotransporter"],
  [null, "Spironolactone", "阻斷 {{Aldosterone|物質}} 的作用"],
  [{ t: "中樞作用劑", b: true, rs: 3 }, "Methyldopa", "抑制 NE 的生合成"],
  [null, "Clonidine", { t: "{{α2-agonist|藥物類別}}", rs: 2 }],
  [null, "Guanfacine、Guanabenz", null],
  [{ t: "神經元阻斷劑", b: true, rs: 3 }, "Reserpine", "抑制 Norepinephrine、dopamine 儲存"],
  [null, "Guanethidine", { t: "抑制 Norepinephrine、dopamine 釋放", rs: 2 }],
  [null, "Bretylium", null],
  [{ t: "神經節阻斷劑", b: true }, "Trimethaphan", "阻斷神經節"],
  [{ t: "交感神經阻斷劑", b: true, rs: 4 }, "Prazosin", "{{α1-blocker|藥物類別}}"],
  [null, "Propranolol", "{{β-blocker|藥物類別}}"],
  [null, "Acebutolol", "{{β1-blocker|藥物類別}}"],
  [null, "Labetalol、Carvedilol", "{{α+β-blocker|藥物類別}}"],
  [{ t: "血管擴張劑", b: true, rs: 4 }, "Hydralazine、Nitroprusside", "直接血管擴張劑"],
  [null, "Fenoldopam", "{{D1-agonist|藥物類別}}"],
  [null, "Minoxidil、Diazoxide", "{{K+ Channel agonist|藥物類別}}"],
  [null, "Verapamil、Diltiazem、Nifedipine", "Calcium channel blocker"],
  [{ t: "Renin-Angiotension-Aldosterone System\n（RAAS）", b: true, rs: 3 }, "Captopril", "{{Angiotensin-Converting Enzyme Inhibitors|藥物類別}}"],
  [null, "Losartan", "{{Angiotensin Receptor Blockers|藥物類別}}"],
  [null, "Aliskiren", "{{Renin inhibitor|藥物類別}}"],
  [{ t: "其他類", b: true }, "Bosentan", "{{Endothelin receptor antagonist|藥物類別}}"] ] } });
kA(27, "RAAS", 173, "Renin-angiotensin-aldosterone system（Katzung 圖）", { images: ["assets/amulet/fig/raas.png"], points: [
  "1. Angiotensin I 共含有 {{10|數值}} 個胺基酸：Asp-Arg-Val-Tyr-Ile-His-Pro-Phe-His-Leu",
  "2. Angiotensin II 共含有 {{8|數值}} 個胺基酸：Asp-Arg-Val-Tyr-Ile-His-Pro-Phe",
  "3. Angiotensin II 之作用：由 Angiotensin I 轉換而來，引起腎臟血管收縮及刺激{{醛固酮|物質}}分泌的作用",
  "4. Bradykinin：會造成{{乾咳|副作用}}、支氣管收縮、血管滲透性↑",
  "5. ACEI：常見的副作用包括乾咳、皮疹和高血鉀，孕婦不可使用，會使出球小動脈擴張，長期使用 ACEI 會讓腎臟的壓力下降，造成保護腎臟的效果",
  "6. 本類藥物皆會造成{{致畸胎|副作用}}，孕婦禁用，均可能引起{{高血鉀|副作用}}",
  "7. Renin 為腎臟製造的{{酵素|名詞}}，不屬於腎自泌素" ] });
dA(27, "血管擴張劑（可用於急性高血壓）", 174, "hydralazine", "Hydralazine", null, {
  cls: ["血管擴張劑：直接擴張{{動脈|器官}}"],
  struct: ["具有 {{Hydrazine + Phthalazine|結構}}"],
  feat: ["副作用：會導致{{反射性心跳加速|副作用}}", "代謝：N 上乙醯化，{{慢速乙醯化者|族群}}會引起紅斑性狼瘡的症狀"] });
dA(27, "血管擴張劑（可用於急性高血壓）", 174, "nitroprusside", "Sodium nitroprusside（SNP）", "Nitroprusside", {
  cls: ["血管擴張劑：產生 {{NO|物質}}，增加血管 cGMP，擴張血管"],
  struct: ["結構中有 {{5|數值}} 個 CN，1 個 Fe2+"],
  feat: ["副作用：姿勢低血壓、反射性心跳加速", "溶液本身為{{紅棕色|性質}}", "過量會造成 {{Cyanide|物質}} 中毒，{{Nitrite 及 Sodium thiosulfate|藥名}} 為解毒劑"] });
dA(27, "血管擴張劑（可用於急性高血壓）", 174, "fenoldopam", "Fenoldopam", null, {
  cls: ["血管擴張劑：{{D1-agonist|藥物類別}}，可使腎血管擴張"],
  feat: ["副作用：反射性心跳過快、{{青光眼|疾病}}患者禁止使用"] });
dA(27, "K+ Channel agonist", 174, "minoxidil", "Minoxidil", null, {
  cls: ["{{K+ Channel agonist|藥物類別}}"],
  feat: ["適應症：高血壓、{{男性禿頭|疾病}}", "副作用：周邊血管水腫", "代謝物：{{Minoxidil N-O-sulfate|物質}}"] });
dA(27, "K+ Channel agonist", 174, "diazoxide", "Diazoxide", null, {
  cls: ["K+ Channel agonist"],
  struct: ["結構和{{利尿劑|藥物類別}}相似"],
  feat: ["無利尿作用而有{{升血糖|副作用}}效果的降壓藥", "活化 K+ Channel 抑制{{胰島素|物質}}的釋放進而升血糖", "代謝物：3-羧酸代謝物"] });
kA(27, "Calcium channel blocker", 175, "DHP 之 SAR", { table: { cols: ["位置", "藥化特色"], rows: [
  [{ t: "DHP 之 SAR", img: "assets/amulet/dhp-sar.png", cs: 2 }, null],
  [{ t: "位置", b: true }, { t: "藥化特色", b: true }],
  [{ t: "DHP 上的取代基", b: true }, "R2、R3 以{{雙酯基|結構}}取代 → 活性最佳\n若以不同酯基取代 → 增加{{血管選擇性|性質}}\n以其他拉電子基取代 → 增加鈣離子通道活化作用"],
  [{ t: "C4 取代基", b: true }, "以{{苯環|結構}}取代 → 活性增加\n其他取代 → 活性降低"],
  [{ t: "苯環上的取代基", b: true }, "{{2' 及 3'|結構}} 以拉電子基取代 → 活性增加\n4' 取代 → 活性降低"] ],
  note: "✓ 1,4-Dihydropyridine（DHP）為活性必須，氧化形成 {{Pyridine|結構}} 後活性降低\n✓ 苯環上的鄰位及間位取代基可使 1,4DHP 之構型固定{{垂直|結構}}" } });
dA(27, "Calcium channel blocker", 176, "nifedipine", "Nifedipine", null, {
  cls: ["Calcium channel blocker：Dihydropyridine"],
  feat: ["對{{血管平滑肌|器官}}最具有選擇性", "代謝：氧化脫 H 生成 {{Pyridine|結構}} 失效", "副作用：反射性心跳過快、便秘、{{牙齦增生|副作用}}", "會造成牙齦增生：{{Phenytoin、Cyclosporine|藥名}}"] });
dA(27, "Calcium channel blocker", 176, "nimodipine", "Nimodipine", null, {
  cls: ["Calcium channel blocker：Dihydropyridine"],
  feat: ["因{{脂溶性高|性質}}，最常用於治療出血性中風", "可治療{{蜘蛛膜下腔出血|疾病}}"] });
dA(27, "Calcium channel blocker", 176, "amlodipine", "Amlodipine", null, {
  cls: ["Calcium channel blocker：Dihydropyridine"],
  feat: ["半衰期較{{長|性質}}，最不會引起反射性心跳加速"] });
dA(27, "Calcium channel blocker", 176, "verapamil", "Verapamil", null, {
  cls: ["Calcium channel blocker：{{Phenylalkylamine|結構}}"],
  feat: ["同時可抑制心臟（{{AV node|器官}}）及血管 → 不會產生反射性心跳加快", "代謝：N-去 CH3，形成活性代謝物 {{Norverapamil|物質}}"] });
dA(27, "Calcium channel blocker", 176, "diltiazem", "Diltiazem", null, {
  cls: ["Calcium channel blocker：{{Benzothiazepine|結構}}"],
  feat: ["同時可抑制心臟（AV node）及血管 → 不會產生反射性心跳加快", "活性代謝物：水解酯基形成 {{deacetyldiltiazem|物質}}"] });
dA(27, "Calcium channel blocker", 176, "bepridil", "Bepridil", null, {
  cls: ["Calcium channel blocker"],
  struct: ["結構骨架：{{Diaminopropanol ether|結構}}"],
  feat: ["最會延長動作電位，使 QTc interval 延長，引起如 {{Torsade de pointes|副作用}} 的症狀"] });
kA(27, "ACEI", 177, "ACEI 總論", [
  "機轉：抑制 {{Angiotensin II|物質}} 的形成",
  "可改善腎臟病患者之{{蛋白尿|疾病}}",
  "副作用：乾咳、血管水腫、高血鉀",
  "不用於單側或雙側{{腎動脈狹窄|疾病}}之高血壓患者、孕婦",
  "ACE 含有 {{Zn2+|物質}}，因此要注意 ACEI 與 ACE 的結合部位，如：Captopril（{{-SH|結構}}）、Enalapril（-COO-）、Fosinopril（-P=O-OH）",
  "ACEI 中不含有 Pyrrolidine：{{Benazepril、Moexipril、Quinapril|藥名}}（BMQ 特力屋）"
]);
dA(27, "ACEI", 177, "captopril", "Captopril", null, {
  cls: ["ACEI"],
  struct: ["含有 {{Pyrrolidine 及 -SH|結構}}"],
  feat: ["Captopril、Lisinopril {{非前驅藥|性質}}（記憶：咖哩非前驅藥）", "副作用：{{味覺失調|副作用}}"] });
dA(27, "ACEI", 177, "lisinopril", "Lisinopril", null, {
  cls: ["ACEI"],
  struct: ["為 {{Lysine|物質}} 衍生物、具有 Pyrrolidine"],
  feat: ["在小腸中會生成 {{di-zwitterion|名詞}}", "水溶性大", "不屬於 Prodrug，原型藥排除體外"] });
dA(27, "ACEI", 177, "enalapril", "Enalapril", null, {
  cls: ["ACEI"],
  struct: ["含有 {{Alanine 及 Proline|物質}}"],
  feat: ["屬於 Prodrug，體內經肝臟 esterase 水解形成活性代謝物 {{Enalaprilat|物質}}"] });
dA(27, "ACEI", 177, "fosinopril", "Fosinopril", null, {
  cls: ["ACEI"],
  struct: ["結構具有{{次磷酸基|結構}}"],
  feat: ["此藥{{肝臟、腎臟|器官}}皆可排除", "Moexipril 也是肝腎皆可以排除"] });
dA(27, "ACEI", 177, "benazepril-moexipril-quinapril", "Benazepril、Moexipril、Quinapril", "Quinapril", {
  cls: ["ACEI"], struct: ["ACEI 中{{不含有 Pyrrolidine|結構}}（BMQ 特力屋）"] });
dA(27, "Renin inhibitor", 177, "aliskiren", "Aliskiren", null, {
  cls: ["{{Renin inhibitor|藥物類別}}"],
  feat: ["90% 由{{糞便|名詞}}以原型藥排除", "與高脂食物併用會{{降低|性質}}吸收", "屬於 {{Nonpeptide|名詞}} 藥物"] });
kA(27, "ARB", 178, "ARB 總論與雜環小整理", [
  "機轉：阻斷 {{AT1-receptor|標的}}",
  "{{不會|性質}}引起乾咳；應注意血鉀、孕婦不得使用",
  "{{Valsartan|藥名}} 由 losartan 衍生之第一個 biphenyl 藥物",
  "LOCI（Losartan、Olmesartan、Candesartan、Irbesartan）：{{Imidazole + Tetrazole|結構}}",
  "TEA（Telmisartan、Eprosartan、Azilsartan）：{{Imidazole|結構}}（米茶）；V（Valsartan）：{{Tetrazole|結構}}（拿出來）",
  "含 Benzimidazole：PPI、{{Candesartan、Azilsartan、Telmisartan|藥名}}（CAT）"
]);
dA(27, "ARB", 178, "losartan", "Losartan", null, {
  cls: ["ARB"],
  struct: ["不含 COOH，以 {{Tetrazole|結構}} 模擬 AT II 上的 COOH"],
  feat: ["代謝後{{更具活性|性質}}", "為 {{Peptidomimetics|名詞}} 藥物"] });
dA(27, "ARB", 178, "olmesartan", "Olmesartan medoxomil", "Olmesartan", {
  cls: ["ARB"], feat: ["為 {{Prodrug|名詞}}", "活性代謝物為 Olmesartan"] });
dA(27, "ARB", 178, "candesartan", "Candesartan cilexetil", "Candesartan", {
  cls: ["ARB"], feat: ["對 AT1 receptor 有{{最強|性質}}之抑制效果"] });
dA(27, "ARB", 178, "irbesartan", "Irbesartan", null, {
  cls: ["ARB"], struct: ["具 {{Imidazole 及 Tetrazole|結構}}"] });
dA(27, "ARB", 178, "valsartan", "Valsartan", null, {
  cls: ["ARB"], struct: ["含有 {{Valine|物質}}"] });
dA(27, "ARB", 178, "telmisartan", "Telmisartan", null, {
  cls: ["ARB"], feat: ["本類藥物{{最長效|性質}}"] });
dA(27, "ARB", 178, "eprosartan", "Eprosartan", null, {
  cls: ["ARB"], struct: ["不含 {{Biphenyl|結構}}", "含 {{Thiophene|結構}}"] });
dA(27, "ARB", 178, "azilsartan", "Azilsartan medoxomil", "Azilsartan", {
  cls: ["ARB"], feat: ["為 {{Prodrug|名詞}}"] });
dA(27, "Endothelin receptor antagonist", 178, "bosentan", "Bosentan", null, {
  cls: ["{{Endothelin receptor antagonist|藥物類別}}"],
  feat: ["口服給藥", "非選擇型阻斷血管內皮細胞上的 {{ETA 和 ETB|標的}} 受體", "選擇性阻斷 ETA：{{Ambrisentan、Sitaxsentan|藥名}}", "治療{{肺動脈高壓|疾病}}（Iloprost、Treprostinil、Epoprostenol）", "副作用：肝毒性、致畸胎，孕婦禁用"] });
kA(27, "高血壓治療目標", 179, "JNC8 高血壓治療目標", { table: { head: [{ t: "JNC8 高血壓治療目標", cs: 2 }, null], cols: ["年齡", "血壓標準"], rows: [
  [{ t: "{{≧60|數值}}", b: true }, "150／90 mmHg"],
  [{ t: "<60", b: true }, "140／90 mmHg"],
  [{ t: "不論年齡，有糖尿病但無慢性腎臟疾病", b: true }, "140／90 mmHg"],
  [{ t: "不論年齡，只要有慢性腎臟疾病", b: true }, "140／90 mmHg"] ],
  note: "✧ 起始治療建議使用 {{TD、ACEI、ARB、CCB|藥物類別}}\n✧ 黑人起始治療建議使用 {{TD、CCB|藥物類別}}\n✧ 慢性腎臟疾病合併高血壓起始治療建議使用 {{ACEI、ARB|藥物類別}}\n✧ MAP（平均動脈壓）= {{1/3 收縮壓 + 2/3 舒張壓|名詞}}" } });

/* ===== 第 28 章 心絞痛藥物 ===== */
chA(28, "28", "心絞痛藥物", "180～184", "第 180 頁拍攝時上下顛倒。");
kA(28, "心絞痛類型與首選治療", 180, "疾病類型、特色與首選藥物", { table: { head: ["疾病分類", "疾病特色", "首選治療藥物"], rows: [
  [{ t: "穩定型心絞痛\n（Stable angina）", b: true }, "動脈粥狀硬化引起心臟灌流不足，\n經由休息或舌下含一顆 NTG 即可緩解", "{{Nitrates ＋ β-blocker|藥物類別}}\n（不可選 ISA）"],
  [{ t: "不穩定型心絞痛\n（Unstable angina）", b: true }, "冠狀動脈有血液凝塊的阻塞，\n導致發作的時間更長", "Nitrates ＋ β-blocker ＋ ACEI ＋ {{Aspirin（Clopidogrel）|藥名}}"],
  [{ t: "變異型心絞痛\n（Variant angina）", b: true }, "冠狀動脈{{痙攣|名詞}}所引起", "{{Nitrates ＋ CCB|藥物類別}}"] ],
  note: "✧ 使用 {{Nifedipine|藥名}} 會惡化穩定型及不穩定型心絞痛（CCB）\n✧ 嚴禁合併使用 {{Verapamil 及 Metoprolol|藥名}}" } });
kA(28, "Nitrates & Nitrites", 181, "Nitrates ＆ Nitrites", { table: { cols: ["", "內容"], rows: [
  [{ t: "機轉", b: true }, "✧ 產生並釋放 {{NO|物質}} 刺激 Guanylyl cyclase 後，使 GTP→cGMP，cGMP 可使血管平滑肌鬆弛，減少心室體積，降低心肌需氧量\n✧ 低劑量下{{靜脈|器官}}的擴張效果比動脈擴張顯著，因此降低 {{Preload|名詞}} 較為顯著"],
  [{ t: "適應症", b: true }, "✧ 冠狀動脈疾病、治療{{氰化物|物質}}中毒"],
  [{ t: "耐藥性", b: true }, "✧ Nitrates 經過代謝後釋出 NO2 需要{{硫醇基|結構}}的參與，因此長期使用 Nitrates，容易因為耗盡硫醇基而產生耐藥性\n✧ 併用 {{Carvedilol|藥名}} 可以減少 Nitrates 之耐藥性"],
  [{ t: "副作用", b: true }, "✧ 頭痛、姿勢性低血壓、不可與 {{Viagra|藥名}} 同時併用、變性血紅素血症"],
  [{ t: "藥物", b: true, rs: 6 }, { t: "Amyl nitrite", b: true }],
  [null, "✧ {{吸入|給藥途徑}}給藥，Onset 最快\n✧ 屬於 Nitrite ester 類，分解後產生 NO + {{Valeric acid|物質}}"],
  [null, { t: "Nitroglycerin（組成：1 分子甘油 + 三分子 HNO3）", b: true }],
  [null, "✧ {{舌下|給藥途徑}}給藥，每 5 分鐘給予一顆舌下錠，至第 2 顆時若無法緩解症狀需送醫，送醫過程中服用第 3 顆"],
  [null, { t: "NTG patch", b: true }],
  [null, "✧ 作用時間可長達 {{24|數值}} 小時"] ] } });
kA(28, "Nitrates & Nitrites", 181, "Nitrates ＆ Nitrites（續）", { table: { cols: ["", "內容"], rows: [
  [{ t: "藥物", b: true, rs: 4 }, { t: "Isosorbide dinitrate", b: true }],
  [null, "✧ 活性代謝物（{{Isosorbide mononitrate|物質}}）作用時間比原藥更長"],
  [null, { t: "Pentaerythritol tetranitrate", b: true }],
  [null, "✧ 此類藥品中，作用時間{{第二長|性質}}（5 小時）"],
  [{ t: "Molsidomine", b: true }, "✧ 屬於 {{Mesionic compound|結構}}\n✧ 是一種 prodrug，可以提供 nitric oxide 使 cGMP 濃度上升"] ] } });
dA(28, "Nitrates & Nitrites", 181, "amyl-nitrite", "Amyl nitrite", null, {
  cls: ["Nitrates & Nitrites"],
  feat: ["{{吸入|給藥途徑}}給藥，Onset 最快", "屬於 Nitrite ester 類，分解後產生 NO + {{Valeric acid|物質}}"] });
dA(28, "Nitrates & Nitrites", 181, "nitroglycerin", "Nitroglycerin（NTG）", "NTG", {
  cls: ["Nitrates & Nitrites"],
  struct: ["組成：1 分子{{甘油|物質}} + 三分子 HNO3"],
  feat: ["{{舌下|給藥途徑}}給藥，每 5 分鐘給予一顆舌下錠，至第 2 顆時若無法緩解症狀需送醫，送醫過程中服用第 3 顆", "NTG patch：作用時間可長達 {{24|數值}} 小時"] });
dA(28, "Nitrates & Nitrites", 181, "isosorbide-dinitrate", "Isosorbide dinitrate", null, {
  cls: ["Nitrates & Nitrites"],
  feat: ["活性代謝物（{{Isosorbide mononitrate|物質}}）作用時間比原藥更長"] });
dA(28, "Nitrates & Nitrites", 181, "pentaerythritol-tetranitrate", "Pentaerythritol tetranitrate", null, {
  cls: ["Nitrates & Nitrites"], feat: ["此類藥品中，作用時間{{第二長|性質}}（5 小時）"] });
dA(28, "Nitrates & Nitrites", 181, "molsidomine", "Molsidomine", null, {
  cls: ["Nitrates & Nitrites"],
  struct: ["屬於 {{Mesionic compound|結構}}"],
  feat: ["是一種 prodrug，可以提供 nitric oxide 使 cGMP 濃度上升"] });
kA(28, "β-blocker", 181, "β-blocker", { table: { cols: ["", "內容"], rows: [
  [{ t: "機轉", b: true }, "✧ 降低心肌收縮力及心跳速率，使病人之心臟{{舒張期|名詞}}體積增加"],
  [{ t: "適應症", b: true }, "✧ 心絞痛、心衰竭、心律不整、高血壓"],
  [{ t: "注意事項", b: true, rs: 3 }, "✧ 氣喘患者應注意在高劑量下 β1-blocker {{不具有選擇性|性質}}"],
  [null, "✧ 心絞痛患者{{不可|性質}}選用具有 {{ISA|名詞}} 的藥物"],
  [null, "✧ 糖尿病患者應注意使用 β-blocker 會遮蔽{{低血糖|疾病}}時產生的震顫、心悸"] ] } });
kA(28, "PDE5 抑制劑", 182, "PDE5 抑制劑比較", { images: ["assets/amulet/fig/pde5-struct.png"], table: { head: ["", "Sildenafil\n（Viagra 威而鋼）", "Vardenafil\n（Levitra 樂威壯）", "Tadalafil\n（Cialis 犀利士）", "Avanafil\n（Spedra 賽倍達）"], rows: [
  [{ t: "脂溶性", b: true }, "高", "{{最高|性質}}", "低", "中"],
  [{ t: "活性強弱", b: true }, "強", "{{最強|性質}}", "中", "弱"],
  [{ t: "生體可用率", b: true }, "{{高|性質}}", "低", "中", "中"],
  [{ t: "Onset", b: true }, "快", "慢", "中", "{{最快|性質}}"],
  [{ t: "作用時間", b: true }, "中", "短", "{{長|性質}}", ""],
  [{ t: "代謝酵素", b: true }, "主要：3A4\n次要：2C9", "主要：3A4\n次要：2C9", "主要：3A4", "主要：3A4\n次要：2C9"],
  [{ t: "活性代謝物", b: true }, "N-demethyl", "N-demethyl", "{{無|名詞}}", "Pyrrolidine 羥基化"],
  [{ t: "主要受體選擇性", b: true }, "PDE5、{{PDE6|標的}}", "PDE5", "PDE5、{{PDE11|標的}}", "PDE5"] ],
  note: "✧ 機轉：抑制 PDE，使 {{cGMP 上升|名詞}}，促使血管擴張\n✧ Sildenafil、Vardenafil、Tadalafil 結構均含 {{Piperazine|結構}}\n✧ 抑制 {{PDE6|標的}} 會造成{{光敏感、視力模糊|副作用}}的副作用\n✧ 抑制 PDE11 會造成{{肌肉痠痛|副作用}}的副作用\n✧ 活性依序為 {{Vardenafil > Sildenafil > Tadalafil|名詞}}" } });
dA(28, "PDE5 抑制劑", 182, "sildenafil", "Sildenafil（Viagra 威而鋼）", "Sildenafil", {
  cls: ["{{PDE5 抑制劑|藥物類別}}：抑制 PDE5（及 {{PDE6|標的}}）"],
  feat: ["脂溶性{{高|性質}}、活性強、生體可用率高、Onset 快、作用時間中", "主要由 {{3A4|酵素}} 代謝（次要 2C9），活性代謝物為 N-demethyl", "抑制 PDE6 會造成{{光敏感、視力模糊|副作用}}的副作用"] });
dA(28, "PDE5 抑制劑", 182, "vardenafil", "Vardenafil（Levitra 樂威壯）", "Vardenafil", {
  cls: ["PDE5 抑制劑：抑制 PDE5"],
  feat: ["脂溶性{{最高|性質}}、活性{{最強|性質}}、生體可用率低、Onset 慢、作用時間短", "主要由 {{3A4|酵素}} 代謝（次要 2C9），活性代謝物為 N-demethyl"] });
dA(28, "PDE5 抑制劑", 182, "tadalafil", "Tadalafil（Cialis 犀利士）", "Tadalafil", {
  cls: ["PDE5 抑制劑：抑制 PDE5（及 {{PDE11|標的}}）"],
  feat: ["脂溶性低、活性中、作用時間{{最長|性質}}", "主要由 {{3A4|酵素}} 代謝，{{無|名詞}}活性代謝物", "抑制 PDE11 會造成{{肌肉痠痛|副作用}}的副作用"] });
dA(28, "PDE5 抑制劑", 182, "avanafil", "Avanafil（Spedra 賽倍達）", "Avanafil", {
  cls: ["PDE5 抑制劑：抑制 PDE5"],
  feat: ["脂溶性中、活性弱、Onset {{最快|性質}}", "主要由 {{3A4|酵素}} 代謝（次要 2C9），活性代謝物為 Pyrrolidine 羥基化"] });
kA(28, "Nitrates 與 β-blocker／CCB 比較", 183, "對心血管參數的影響", { table: { head: ["", "單獨用\nNitrates", "單獨用\nβ-blockers 或 CCB(Non-DHP)", "Nitrates 併用\nβ-blockers 或 CCB(Non-DHP)"], rows: [
  [{ t: "動脈壓\n(Arterial pressure)", b: true }, "↓", "↓", "↓"],
  [{ t: "心跳速率\n(Heart rate)", b: true }, "{{↑（反射性）|名詞}}", "↓", "↓"],
  [{ t: "心收縮力\n(Contractility)", b: true }, "↑（反射性）", "↓", "{{無影響|名詞}}"],
  [{ t: "射血時間\n(Ejection time)", b: true }, "↓", "{{↑|名詞}}", "無影響"],
  [{ t: "心舒張末期容積\n(End-diastolic volume)", b: true }, "↓", "↑", "無影響／減少"] ],
  note: "✧ 射血時間：血液從心室射出所需的時間\n✧ 心舒張末期容積：心室在舒張末期，收縮之前的血液量，稱為舒張末期容積\n✧ Nitrates 擴張{{靜脈 > 動脈|名詞}}；CCB 以擴張{{動脈|器官}}為主" } });
mA("nifedipine", 184, { feat: ["CCB 適應症：高血壓、心絞痛、心律不整", "導致{{反射性心跳過快|副作用}}"] });
mA("verapamil", 184, { feat: ["同時可抑制心臟及血管，心跳{{不會加快|性質}}"] });
mA("diltiazem", 184, { feat: ["以及 {{CYP3A4|酵素}} 行 N 脫甲基生成 N-monodesmethyldiltiazem"] });
dA(28, "其他類", 184, "ranolazine", "Ranolazine", null, {
  cls: ["其他類：抑制 {{late sodium current|標的}}"] });

/* ===== 第 29 章 心律不整藥物 ===== */
chA(29, "29", "心律不整藥物", "185～191");
kA(29, "心律不整機轉圖", 185, "動作電位與各類藥物（Medical Pharmacology at a Glance 圖）", { images: ["assets/amulet/fig/ap-arrhythmia.png"] });
kA(29, "心律不整機轉圖", 185, "心房顫動（Atrial fibrillation）藥物治療", { table: {
  head: [[{ t: "心房顫動（Atrial fibrillation）藥物治療", cs: 3 }], ["", "機轉", "藥物"]], cols: ["", "機轉", "藥物"], rows: [
  [{ t: "Rhythm control（心律控制）", b: true }, "控制不規則的節律，以恢復正常的心律", "{{Class Ia、Class Ic、Class III|藥物類別}}"],
  [{ t: "Rate control（心速控制）", b: true }, "主要減緩心跳速率（影響 AV node）", "{{Class II、Class IV|藥物類別}}"] ] } });
kA(29, "抗心律不整藥物分類", 186, "各類代表藥物與機轉", { table: { head: ["藥理分類", "", "代表藥物", "機轉"], rows: [
  [{ t: "Class I\n阻斷 Na+", b: true, rs: 8 }, { t: "Ia（中等阻斷）\n去極化時間↑→{{QRS↑|名詞}}", rs: 3 }, "Quinidine", { t: "1. 阻斷 K+ 通道，延長再極化時間→{{QT↑|名詞}}→Torsade de pointes\n2. 副作用：阻斷 α、{{M receptor|標的}}", rs: 3 }],
  [null, null, "Procainamide", null],
  [null, null, "Disopyramide", null],
  [null, { t: "Ib（微弱阻斷）", rs: 3 }, "Lidocaine", { t: "1. {{縮短|性質}}再極化時間→QT↓\n2. 僅用於治療{{心室性|名詞}}心律不整及毛地黃中毒", rs: 3 }],
  [null, null, "Mexiletine", null],
  [null, null, "Phenytoin", null],
  [null, { t: "Ic（強力阻斷）", rs: 2 }, "Flecainide", { t: "1. 再極化時間{{不變|性質}}", rs: 2 }],
  [null, null, "Propafenone", null],
  [{ t: "Class II\nβ-blockers", b: true, rs: 2 }, { t: "抑制 AV-node → {{PR↑|名詞}}", rs: 2 }, "Propranolol", "氣喘患者不可用 Propranolol"],
  [null, null, "Esmolol", "Esmolol 以 {{IV|給藥途徑}} 給藥，半衰期短"],
  [{ t: "Class III\n阻斷 K+", b: true, rs: 5 }, { t: "再極化時間↑→{{QT↑|名詞}}\n→Torsade de pointes(TdP)", rs: 5 }, "Amiodarone", { t: "1. {{Amiodarone|藥名}} 兼具 Class I～IV 的效果\n2. {{Sotalol|藥名}} 兼具 β-blocker 作用", rs: 5 }],
  [null, null, "Dronedarone", null],
  [null, null, "Bretylium", null],
  [null, null, "Sotalol", null],
  [null, null, "Ibutilide、Dofetilide", null],
  [{ t: "Class IV\n阻斷 Ca2+", b: true }, "抑制 AV-node → PR↑", "Verapamil、Diltiazem", "抑制作用大小排序 {{Verapamil > Diltiazem > Nifedipine|名詞}}"],
  [{ t: "其他類藥物", b: true, rs: 4 }, "", "Adenosine", "抑制 AV-node → PR↑"],
  [null, "", "Digoxin", "抑制 AV-node → PR↑"],
  [null, "", "Atropine", "抑制 {{M receptor|標的}} → {{HR↑|名詞}}"],
  [null, "", "MgSO4", "可治療 TdP、Digoxin 中毒、預防子癲前症之癲癇"] ] } });
kA(29, "抗心律不整藥物分類", 187, "心律不整病因與治療藥物", { table: { head: [{ t: "心律不整病因", cs: 1 }, "治療藥物"], cols: ["心律不整病因", "治療藥物"], rows: [
  [{ t: "心室性心律不整", b: true }, "{{Lidocaine|藥名}}"],
  [{ t: "上心室性心律不整", b: true }, "{{β-blocker、CCB、Digoxin|藥名}}"],
  [{ t: "陣發性上心室頻脈\n(Paroxysmal supraventricular tachycardia)", b: true }, "{{Adenosine、Verapamil|藥名}}"],
  [{ t: "上心室性與心室性心律不整", b: true }, "Class IA、Class IC、Class III"],
  [{ t: "心搏過緩(Bradycardia)", b: true }, "{{Atropine|藥名}}"] ],
  note: "✧ 造成 QT prolong 的藥品容易引起 Torsade de Pointes\n✧ 易引發 TdP 因子：\n1. 電解質：{{低血鉀、低血鎂|名詞}}\n2. 心律不整藥物：Class IA、Class III\n3. 抗生素類：Macrolide、Azole 類、Fluoroquinolones\n4. 抗組織胺：{{Astemizole、Terfenadine|藥名}}\n✧ TdP 治療：補血鉀、血鎂(MgSO4)、縮短 QT 間期(Lidocaine ＆ Phenytoin)" } });
dA(29, "Class IA", 188, "quinidine", "Quinidine", null, {
  cls: ["Class IA"],
  struct: ["含有 {{Quinoline 及 Quinuclidine|結構}}", "有 4 個不對稱碳：3R,4S,8R,9S", "與 Quinine 的關係為 {{Diastereoisomer|名詞}}"],
  feat: ["屬於 {{P-gp inhibitor|名詞}}（Amiodarone、Verapamil）", "副作用：抗膽鹼、腹瀉、{{血小板缺乏紫斑症|副作用}}、過量會造成金雞納中毒（眼耳毒性）", "代謝方式：hydroxylation / O-demethylation，代謝後會降低活性", "{{Dihydroquinidine|物質}} 是 Quinidine 之不純物，具有顯著毒性"] });
dA(29, "Class IA", 188, "procainamide", "Procainamide", null, {
  cls: ["Class IA"],
  feat: ["N 上加 {{acetyl|結構}} 為活性代謝物，代謝後屬於高度選擇性的 K+ 通道抑制劑，會使 QT 延長導致 TdP", "副作用：{{類紅斑性狼瘡|副作用}}", "Hydralazine、Propylthiouracil 也會導致類紅斑性狼瘡"] });
dA(29, "Class IA", 188, "disopyramide", "Disopyramide", null, {
  cls: ["Class IA"],
  feat: ["此類藥品中{{抗膽鹼|副作用}}效果最強", "具有負向強心作用，{{HF|疾病}} 患者不可用"] });
dA(29, "Class IB", 188, "lidocaine-arrhythmia", "Lidocaine（抗心律不整）", "Lidocaine", {
  cls: ["Class IB"],
  feat: ["只能 {{IV|給藥途徑}} 給予", "可治療{{毛地黃|藥名}}引起的心律不整", "代謝物 {{Monoethylglycinexylidide|物質}} 會造成中樞毒性"] });
dA(29, "Class IB", 188, "mexiletine", "Mexiletine", null, {
  cls: ["Class IB"],
  feat: ["Lidocaine 的衍生物，可{{口服|給藥途徑}}給藥", "可緩解{{糖尿病神經病變|疾病}}之疼痛", "抑制 Inactivated sodium channel，治療 {{LQT3|疾病}} 型心律不整", "副作用：易引起 Brugada Syndrome"] });
dA(29, "Class IB", 188, "phenytoin-arrhythmia", "Phenytoin（抗心律不整）", "Phenytoin", {
  cls: ["Class IB"],
  feat: ["具有抗癲癇和抗心律不整的藥物", "副作用：{{牙齦增生|副作用}}、軟骨症、多毛症", "導致牙齦增生：Cyclosporine、Nifedipine"] });
dA(29, "Class IB", 188, "tocainide", "Tocainide", null, {
  cls: ["Class IB"], feat: ["副作用：{{肺部纖維化|副作用}}"] });
dA(29, "Class IC", 189, "flecainide", "Flecainide", null, {
  cls: ["Class IC"],
  feat: ["字尾有 {{cainide|名詞}} 皆屬於 Class 1C（例外：Tocainide）", "抑制 K+ 通道，但{{不會|性質}}造成 QT 延長（例外）", "副作用：{{負向強心|副作用}}作用，心衰竭患者不可使用"] });
dA(29, "Class IC", 189, "propafenone", "Propafenone", null, {
  cls: ["Class IC"],
  struct: ["具有 Chiral center，{{S-form|結構}} 比 R-form 強"],
  feat: ["S-form 有 {{β-blocker|藥物類別}} 的作用"] });
mA("propranolol", 189, { feat: ["Class II：最適用於治療{{心房|器官}}心律不整及防止心肌梗塞復發"] });
dA(29, "Class II", 189, "esmolol", "Esmolol", null, {
  cls: ["Class II：屬於 {{β1-blocker|藥物類別}}"],
  feat: ["同類藥品中，作用時間{{最短|性質}}", "可用於治療{{上心室性|名詞}}心律不整"] });
dA(29, "Class III", 190, "amiodarone", "Amiodarone", null, {
  cls: ["Class III"],
  feat: ["半衰期長達 {{100|數值}} 天，是最長效的心律不整藥", "較不易引起 TdP", "副作用：{{甲狀腺功能異常、肺部纖維化|副作用}}（Tocainide 也會）、光敏感性、神經病變、肝功能異常、藍皮膚", "屬於 {{CYP3A4 inhibitor|名詞}}", "裝有心臟去顫器之患者併用本藥，可增加去顫器閾值，但需增加電壓，可減少電擊次數", "代謝方式：{{N-deethylation|名詞}}"] });
dA(29, "Class III", 190, "dronedarone", "Dronedarone", null, {
  cls: ["Class III"],
  struct: ["具有 Benzofuran，{{不含碘|結構}}，以減少 Amiodarone 甲狀腺異常的現象", "含 Methyl sulfonamide"],
  feat: ["脂溶性較 Amiodarone 小，分布體積較 Amiodarone 小"] });
dA(29, "Class III", 190, "bretylium-arrhythmia", "Bretylium（抗心律不整）", "Bretylium", {
  cls: ["Class III"],
  struct: ["含有鹵素（{{Br|結構}}），且含 4 級氮不可口服"],
  feat: ["可抑制 {{NE|物質}} 釋放"] });
dA(29, "Class III", 190, "sotalol", "Sotalol", null, {
  cls: ["Class III"],
  struct: ["具有 {{Methane sulfonanilide|結構}}"],
  feat: ["口服生體可用率佳，主要由{{腎臟|器官}}排出", "可減少去顫器所需通電量"] });
dA(29, "Class III", 190, "ibutilide", "Ibutilide", null, {
  cls: ["Class III：屬於 {{Pure class III|藥物類別}} 抗心律不整藥"],
  struct: ["具有 Methane sulfonamide"],
  feat: ["Class III 藥物中，最容易引起 {{TdP|副作用}}"] });
dA(29, "Class III", 190, "dofetilide", "Dofetilide", null, {
  cls: ["Class III"], struct: ["具有 {{Bis-methane sulfonamide|結構}}"] });
mA("verapamil", 191, { feat: ["Class IV：可抑制 AV node，治療{{上心室|名詞}}心律不整；抑制 AV node 作用大小：Verapamil > Diltiazem > Nifedipine"] });
mA("diltiazem", 191, { feat: ["Class IV：可抑制 AV node，治療上心室心律不整"] });
dA(29, "Other antiarrhythmic drugs", 191, "digoxin-arrhythmia", "Digoxin（抗心律不整）", "Digoxin", {
  cls: ["Other antiarrhythmic drugs"],
  feat: ["{{心房性纖維顫動合併心衰竭|疾病}}患者之首選藥", "毒性增加會造成心室性纖維顫動，用 {{Lidocaine、Phenytoin|藥名}} 治療"] });
dA(29, "Other antiarrhythmic drugs", 191, "adenosine", "Adenosine", null, {
  cls: ["Other antiarrhythmic drugs：抑制{{鈣離子|物質}}電流和增加內向整流的鉀離子電流以抑制 AV node"],
  feat: ["Paroxysmal supraventricular tachycardia（{{PSVT|疾病}}）首選用藥", "半衰期短，大約 {{10 秒|數值}}", "與{{咖啡因、茶鹼|藥名}}併用會降低其藥效"] });

/* ===== 第 30 章 心臟衰竭 ===== */
chA(30, "30", "心臟衰竭", "192～196");
kA(30, "心臟衰竭病生理學及藥物機轉", 192, "心衰竭惡性循環與藥物作用點（Pharmacotherapy of CHF 圖）", { images: ["assets/amulet/fig/hf-cycle.png"] });
kA(30, "心臟衰竭病生理學及藥物機轉", 193, "心衰竭治療藥物分類", { table: { head: ["機轉", "藥理分類", "藥名"], rowNames: ["血管擴張劑", "β-blocker", "ACE inhibitor", "ARB", "Aldosterone antagonist", "利尿劑", "強心配醣體", "β1 agonist", "PDE3 inhibitors"], rows: [
  [{ t: "抑制交感神經系統", b: true, rs: 2 }, "血管擴張劑", "Nitrates 類、Hydralazine、Minoxidil"],
  [null, "β-blocker", "{{Bisoprolol、Metoprolol、Carvedilol|藥名}}"],
  [{ t: "抑制 RAAS", b: true, rs: 3 }, "ACE inhibitor", "Captopril"],
  [null, "ARB", "Valsartan"],
  [null, "Aldosterone antagonist", "{{Spironolactone、Eplerenone|藥名}}"],
  [{ t: "減緩醛固酮引起的鈉水滯留", b: true }, "利尿劑（HF 合併水腫可使用 {{Loop 併用 Thiazide|藥物類別}}）", "Furosemide、Thiazide"],
  [{ t: "強心劑", b: true, rs: 3 }, "強心配醣體", "{{Digoxin|藥名}}"],
  [null, "β1 agonist", "{{Dobutamine|藥名}}"],
  [null, "PDE3 inhibitors", "{{Amrinone、Milrinone|藥名}}"] ],
  note: "✧ 當出現心衰竭時，心輸出量會減少，患者會產生代償反應：交感神經系統（刺激心跳速率與收縮並使血管阻力增加來維持血壓）、活化 RAAS\n✧ 這些系統若長期處於高度活化狀態，會讓心臟做功增加，加速惡化心衰竭，因此希望藥物可以「抑制交感及腎素系統」，並降低心臟負荷以及增加心肌的收縮力" } });
mA("digoxin-arrhythmia", 194, {
  cls: ["治療心衰竭：抑制 {{Na+/K+ ATPase|標的}} → 細胞內 Na+ 堆積 → 作用在 Ca2+/Na+ transporter → Ca2+ 進入細胞內 → 細胞內 Ca2+ 濃度上升 → 增加心肌收縮力", "治療心房顫動：增加副交感神經作用 → 抑制房室節（AV node）→ PR 間距延長 → 間接使心跳速率變慢"],
  feat: ["適應症：心衰竭、心房顫動、上心室性心跳過快", "禁用於 {{Wolff-Parkinson-White syndrome|疾病}} 患者", "中毒症狀：腹瀉、嘔吐、迷失方向感、視幻覺（{{黃綠視覺|副作用}}）、心跳減慢；{{低血鉀|名詞}}、低血鎂、高血鈣會增加毛地黃中毒的症狀", "處理方式：用 Class IB（Lidocaine、Phenytoin）、給予 {{Digoxin immune Fab|藥名}}、補充血鉀、血鎂、Atropine", "治療劑量範圍：心衰竭 {{0.5-0.8 ng/ml|數值}}；心律不整 0.8-1.5 ng/ml → 安全有效治療劑量範圍非常狹窄", "Digoxin 屬於 {{P-gp|標的}} 受質：Amiodarone、Verapamil、Quinidine、Ketoconazole、Erythromycin 會抑制 P-gp，使 Digoxin 濃度增加", "Thiazide、Furosemide 造成低血鉀 → Digoxin↑；Spironolactone 會降低 Digoxin 清除率", "{{Cholestyramine、Colestipol|藥名}} 降低 Digoxin 在胃的吸收 → Digoxin↓"] });
kA(30, "強心配糖體", 195, "強心配糖體結構比較", { images: ["assets/amulet/fig/cardiac-glycosides.png"], table: { head: [[{ t: "強心配糖體比較", cs: 3 }, null, null], ["藥物比較", "Lanatoside C → Digoxin", "Lanatoside A → Digitoxin"]], cols: ["藥物比較", "Digoxin", "Digitoxin"], rows: [
  [{ t: "生體可用率", b: true }, "75%", "95%-100%"],
  [{ t: "蛋白結合率", b: true }, "25-30%", "{{90-95%|數值}}"],
  [{ t: "半衰期", b: true }, "{{1.5 天|數值}}", "5-7 天"],
  [{ t: "主要排除路徑", b: true }, "{{腎臟|器官}}", "{{肝臟|器官}}"],
  [{ t: "口服劑量(mg)", b: true }, "0.75-1.5", "0.8-1.2"] ],
  note: "強心配糖體考試重點：\n✧ A-B／B-C／C-D 環之連結方式：{{cis / trans / cis|結構}}\n✧ 強心活性：{{C14β-OH|結構}}、C17-unsaturated lactone 和 A-B／C-D cis fused\n✧ 除了 {{C9-α|結構}}，其餘位置皆是以 β 方式連接\n✧ 醣基以 {{β-1,4|結構}} 鍵結在 C3\n✧ Digoxin = digitoxose-digitoxose-digitoxose-{{digoxigenin|物質}}\n✧ {{Ouabain|藥名}} 僅能以靜脈注射，主要由腎排泄" } });
mA("dobutamine", 196, { feat: ["β1 agonist：具有強心作用，可治療{{心衰竭|疾病}}；對 dopamine receptor 無效"] });
dA(30, "Phosphodiesterase 3 inhibitors", 196, "amrinone-milrinone", "Amrinone、Milrinone", "Milrinone", {
  cls: ["{{Phosphodiesterase 3|酵素}} inhibitors"],
  feat: ["{{Milrinone|藥名}} 屬於相同機轉的藥物"] });
dA(30, "Adenylate cyclase stimulants", 196, "forskolin", "Forskolin", null, {
  cls: ["{{Adenylate cyclase|酵素}} stimulants"],
  struct: ["是一種 {{Labdane diterpenoid|結構}}"],
  feat: ["增加 {{cAMP|物質}} 的作用"] });
dA(30, "刺激 Guanylate cyclase receptor", 196, "nesiritide", "Nesiritide", null, {
  cls: ["刺激 Guanylate cyclase receptor"],
  feat: ["屬於人類重組的 Brain natriuretic peptide（{{BNP|物質}}）", "機轉：增加血管平滑肌的 {{cGMP|物質}}，使動脈和靜脈擴張，增加心輸出量", "以 {{IV|給藥途徑}} 給藥，排除半衰期短"] });
dA(30, "ARNI", 196, "sacubitril-valsartan", "Valsartan / Sacubitril（Entresto）", "Entresto", {
  cls: ["ARNI（{{Angiotensin receptor-neprilysin inhibitor|藥物類別}}）"],
  feat: ["Valsartan，作用在 {{AT1|標的}} 受體", "Sacubitril：Neprilysin 會將 BNP 分解，此藥可抑制 {{Neprilysin|酵素}}，因此可以減少血管中的 BNP 被分解，達到降低血壓、降低交感神經活性的作用"] });
dA(30, "其他類", 196, "ivabradine", "Ivabradine", null, {
  cls: ["機轉：{{funny current（If）|標的}} blocker"],
  feat: ["副作用：{{光幻覺|副作用}}"] });
kA(30, "強心配糖體", 196, "心衰竭用藥重點", [
  "降低心衰竭死亡率的藥物：{{ACEI、ARB、β-blocker、Spironolactone|藥物類別}}",
  "心衰竭患者除了 {{Amlodipine、Felodipine|藥名}} 可以使用外，禁用其他 CCB",
  "β-blocker 中僅 {{Bisoprolol、Metoprolol、Carvedilol|藥名}} 可降低心衰竭患者死亡率"
]);

/* ===== 第 31 章 凝血藥物 ===== */
chA(31, "31", "凝血藥物", "197～202");
kA(31, "Warfarin 抗凝血機轉", 197, "Warfarin 抗凝血機轉圖（Katzung 圖）", { images: ["assets/amulet/fig/warfarin-mech.png"], points: [
  "Warfarin 作用在{{肝臟|器官}}，並且阻斷 Vitamin K reductase，使氧化型（無活性型）Vitamin K 無法轉變為還原型（活性型）Vitamin K，其中凝血因子 {{II、VII、IX、X|名詞}} 必須依靠活性型 Vitamin K 才能夠活化，因此 Warfarin 阻斷凝血因子 II、VII、IX、X 的形成。",
  "下列有關 warfarin 的敘述何者為非？\n(A) 減少 vitamin K dependent 的凝血因子，而達到抗凝血效果 (B) 減少 protein C 及 protein S (C) 會與許多藥物產生藥物交互作用 (D) 使用時常以 bleeding time 來監測其治療效果\n選 {{D|名詞}}"
] });
kA(31, "凝血路徑", 198, "凝血路徑圖與抗凝血藥物", { images: ["assets/amulet/fig/coag-pathway.png"], table: { head: ["抗凝血藥物", "抑制凝血因子"], rows: [
  [{ t: "Warfarin", b: true }, "II、VII、IX、X、{{Protein C ＆ Protein S|物質}}"],
  [{ t: "Unfractionated heparin", b: true }, "IIa、Xa"],
  [{ t: "Low-molecular-weight heparin：Enoxaparin、Dalteparin", b: true }, "{{Xa > IIa|名詞}}"],
  [{ t: "Pentasaccharide：Fondaparinux", b: true }, "Xa"] ],
  note: "✧ 使用 Warfarin 後，{{VII|名詞}} 之血中濃度降低最快\n✧ Warfarin 抑制 Protein C ＆ Protein S 會造成{{皮膚壞死|副作用}}\n✧ Heparin、Dalteparin、Fondaparinux 屬於間接作用劑，必須與 {{Antithrombin III|物質}} 結合後才可以抑制凝血因子\n✧ Argatroban、Rivaroxaban 屬於直接作用劑" } });
kA(31, "抗血小板藥物", 199, "抗血小板藥物（治動脈血栓）（Katzung 圖）", { images: ["assets/amulet/fig/antiplatelet.png"], table: { head: ["藥物", "機轉簡介"], rows: [
  [{ t: "Aspirin", b: true }, "{{不可逆|性質}}抑制 {{Cyclooxygenase|酵素}}，且低劑量 Aspirin 可治療動脈血栓"],
  [{ t: "Ticlopidine、Clopidogrel、Prasugrel", b: true }, "當 ADP 作用在 {{P2Y12 receptor|標的}} 上，可促進血小板的凝集，本類藥物藉由不可逆阻斷 P2Y12 receptor 來減少凝集作用"],
  [{ t: "Dipyridamole、Cilostazol", b: true }, "阻斷 {{PDE3|酵素}} 可以增加 cAMP，cAMP↑ 會抑制血小板凝集"],
  [{ t: "Tirofiban、Eptifibatide、Abciximab", b: true }, "阻斷 {{Glycoprotein IIb/IIIa receptor|標的}} 來抑制血小板凝集"] ] } });
kA(31, "纖維蛋白溶解系統", 200, "纖維蛋白溶解系統（Fibrinolytic system）（Katzung 圖）", { images: ["assets/amulet/fig/fibrinolysis.png"], points: [
  "Plasmin 可以幫助 Fibrin（血栓單體）降解。因此促進 {{Plasmin|物質}} 的形成可幫助血栓溶解",
  "{{Alteplase、Urokinase|藥名}} 幫助 Plasminogen 轉變為 Plasmin，可以促進血栓的溶解",
  "{{Streptokinase|藥名}} 的作用可分為兩步驟，先與 Activator 結合後，再使 Plasminogen 轉變為 Plasmin",
  "{{Aminocaproic acid|藥名}} 抑制 Plasminogen 轉變為 Plasmin，因此抑制血栓的溶解，可作為{{止血劑|藥物類別}}"
] });
dA(31, "Anticoagulants", 201, "heparin", "Heparin（Unfractionated heparin）", "Heparin", {
  cls: ["Anticoagulants：與 {{Antithrombin III|物質}} 結合並抑制 IIa、Xa"],
  struct: ["帶負電（{{SO3-、COO-|結構}}）", "可透過{{五個|數值}}糖分子上的陰離子，與 antithrombin III 結合"],
  feat: ["以 IV 給藥", "用於{{深層靜脈血栓、肺栓塞|疾病}}之患者", "副作用：出血、{{血小板缺乏症（HIT）|副作用}}、骨質疏鬆", "{{Protamine|藥名}} 以化學性拮抗作為 Heparin 中毒解毒劑", "不會穿過胎盤、乳汁，為{{孕婦|族群}}首選抗凝血藥", "監測 {{aPTT|名詞}} 可得知 Heparin 的療效和安全性"] });
dA(31, "Anticoagulants", 201, "lmwh", "Enoxaparin、Dalteparin（LMWH）", "LMWH", {
  cls: ["Low molecular weight heparin（{{LMWH|藥物類別}}）"],
  feat: ["和 Unfractionated heparin 相比 LMWH 生體可用率較佳、抗凝血效果較好、半衰期較長、副作用較小、{{不須監測 aPTT|性質}} 的變化"] });
dA(31, "Anticoagulants", 201, "fondaparinux", "Fondaparinux", null, {
  cls: ["{{Pentasaccharide|藥物類別}}"],
  struct: ["含有{{五碳多醣|結構}}"],
  feat: ["僅可抑制 {{Xa|名詞}}"] });
dA(31, "Direct thrombin inhibitors", 201, "argatroban", "Argatroban", null, {
  cls: ["{{Direct thrombin inhibitors|藥物類別}}"],
  feat: ["治療 Heparin-induced thrombocytopenia（{{HIT|疾病}}）", "治療 HIT：停止使用 Heparin；使用 Direct thrombin inhibitor（Argatroban）或 Factor Xa inhibitor（Fondaparinux）", "以 IV 給藥"] });
dA(31, "Direct thrombin inhibitors", 201, "dabigatran", "Dabigatran etexilate mesylate", "Dabigatran", {
  cls: ["Direct thrombin inhibitors"],
  feat: ["本身是 {{Prodrug|名詞}}", "活性代謝物 Dabigatran 屬於 direct thrombin inhibitors", "解毒劑：{{Idarucizumab|藥名}}", "以{{口服|給藥途徑}}給藥"] });
dA(31, "Direct thrombin inhibitors", 201, "hirudin", "Hirudin", null, {
  cls: ["Direct thrombin inhibitors"], feat: ["可用於治療 {{Heparin induced thrombocytopenia|疾病}}"] });
dA(31, "Direct Xa inhibitors", 201, "rivaroxaban", "Rivaroxaban", null, {
  cls: ["{{Direct Xa inhibitors|藥物類別}}"],
  feat: ["Direct Xa inhibitors 的解毒劑為 {{Andexanet alfa|藥名}}"] });
dA(31, "Oral anticoagulants", 202, "warfarin", "Warfarin", null, {
  cls: ["Oral anticoagulants"],
  struct: ["結構中的 {{-OH|結構}} 基團有助於製成鹽類製劑"],
  feat: ["{{(S)|結構}}-效力較 (R)-強，且 S form 主要受 {{CYP2C9|酵素}} 代謝", "經由 Reductase 得到 2'-OHwarfarin 為活性代謝物", "副作用：出血（監測 {{INR|名詞}}）、致畸胎（不會分泌到乳汁）、皮膚壞死（抑制 Protein C）", "解毒劑：{{Vitamin K1（Phytonadione）|藥名}}"] });
dA(31, "Oral anticoagulants", 202, "phenindione-anisindione", "Phenindione、Anisindione", "Phenindione", {
  cls: ["Oral anticoagulants"],
  struct: ["均為 {{Indanedione|結構}} 衍生物"],
  feat: ["為口服抗凝血劑"] });
dA(31, "Antiplatelet drugs", 202, "aspirin-antiplatelet", "Aspirin（抗血小板）", "Aspirin", {
  cls: ["Antiplatelet drugs：COX inhibitor"],
  feat: ["{{低劑量|名詞}}可預防心血管疾病", "兒童流感不可使用 Aspirin，以免造成 {{Reye's syndrome|疾病}}"] });
dA(31, "Antiplatelet drugs", 202, "ticlopidine", "Ticlopidine", null, {
  cls: ["不可逆的 P2Y12 receptor antagonist（結構骨架為 {{Thienopyridine|結構}}）"],
  feat: ["機轉：不可逆的抑制血小板上的 ADP 接受器", "副作用：{{顆粒性白血球缺乏症、再生不能性貧血|副作用}}"] });
dA(31, "Antiplatelet drugs", 202, "clopidogrel", "Clopidogrel", null, {
  cls: ["不可逆的 P2Y12 receptor antagonist（Thienopyridine）"],
  feat: ["和 Ticlopidine 相比，副作用較少", "與 {{Omeprazole|藥名}} 會產生交互作用，Clopidogrel 屬於 2C19 受質以及 CYP 2C19 酵素抑制劑", "為 Prodrug，受 CYP3A4 及 2C19 生成 {{-SH|結構}}，再與 P2Y12 共價產生不可逆抑制效果"] });
dA(31, "Antiplatelet drugs", 202, "prasugrel", "Prasugrel", null, {
  cls: ["不可逆的 P2Y12 receptor antagonist"],
  struct: ["結構似 Ticlopidine 含 {{Thienopyridine|結構}}"],
  feat: ["本類藥物{{半衰期最長|性質}}"] });
dA(31, "Antiplatelet drugs", 202, "ticagrelor", "Ticagrelor", null, {
  cls: ["{{可逆的|性質}} P2Y12 receptor antagonist"],
  feat: ["非 {{Prodrug|名詞}}"] });

/* 講義第 203～204 頁（31 章的 PDE3 抑制劑、GP IIb/IIIa 抑制劑、Heparin 與 Warfarin 比較）暫時沒有收錄。 */
kA(31, "抗凝血解毒劑總整理", 205, "抗凝血解毒劑總整理", [
  "Warfarin：{{Vitamin K1（Phytonadione）|藥名}}",
  "Heparin：{{Protamine|藥名}}",
  "Dabigatran：{{Idarucizumab|藥名}}",
  "Rivaroxaban：{{Andexanet alfa|藥名}}"
]);

/* 講義第 206 頁（32. 貧血藥物）暫時沒有收錄。 */

/* ===== 第 33 章 降血脂藥物 ===== */
chA(33, "33", "降血脂藥物", "207～211");
kA(33, "降血脂藥物作用圖", 207, "脂質代謝與藥物作用點", { images: ["assets/amulet/fig/lipid-metab.png"], points: [
  "TG = Triglyceride；CE = Cholesterol；NPC1L1 = Niemann-Pick C1-Like 1；MTP = Microsomal triglyceride transfer protein；CETP = Cholesteryl ester transfer protein"
] });
kA(33, "降血脂藥物分類", 208, "五類降血脂藥比較", { table: { head: ["分類", "降血脂功效", "機轉", "副作用"], rows: [
  [{ t: "HMG-CoA reductase inhibitor", b: true }, "主要降 {{Cholesterol|物質}}", "1. 抑制膽固醇的合成\n2. 抑制 Isoprenoids 合成，也能降低 Rho 及 Rab 蛋白\n3. 增加 {{LDL receptor|標的}} 數量，降低血液中的 LDL", "1. 造成{{橫紋肌溶解症|副作用}}，與 Fibrates、Niacin 併用造成橫紋肌溶解症機率最高\n2. 孕婦不可使用"],
  [{ t: "Fibrates", b: true }, "主要降 {{TG|物質}}", "1. 活化 {{PPAR-α|標的}}\n2. 活化 Lipoprotein lipase", "1. 造成腹瀉、膽結石、心律不整、AST、ALT（肝指數）上升、橫紋肌溶解症\n2. 孕婦、嚴重肝病患者不可使用"],
  [{ t: "Anionic exchange resins", b: true }, "主要降 Cholesterol", "1. 在小腸與膽酸結合可降 LDL，並增加 LDL receptor 的數目", "1. 造成便祕、併用其他藥物會降低療效、干擾 {{Vit ADEK|物質}} 的吸收\n2. 孕婦{{可用|性質}}"],
  [{ t: "Niacin", b: true }, "主要降 Cholesterol 和 TG，升 {{HDL|物質}} 最明顯", "1. 抑制脂肪組織內三酸甘油脂的分解\n2. 減少脂肪組織中游離脂肪酸的釋放", "1. 引起{{皮膚潮紅|副作用}}、消化性潰瘍、血糖和尿酸升高、肝指數上升"],
  [{ t: "Ezetimibe", b: true }, "主要降 Cholesterol", "作用在 {{NPC1L1|標的}} 使小腸吸收膽固醇及植物固醇的能力下降", ""] ] } });
dA(33, "新藥", 208, "lomitapide", "Lomitapide", null, {
  cls: ["Microsomal triglyceride transfer protein inhibitor（{{MTP|標的}}）"],
  feat: ["MTP 幫助 TG 及 CE 轉化為 VLDL，因此使用 MTP inhibitor 可幫助降低 {{VLDL 及 LDL|物質}}"] });
dA(33, "新藥", 208, "mipomersen", "Mipomersen", null, {
  cls: ["抑制 {{Apo-B100|物質}} 的合成"],
  feat: ["副作用：易有注射處紅腫及{{類流感|副作用}}情形"] });
dA(33, "新藥", 208, "torcetrapib", "Torcetrapib", null, {
  cls: ["{{CETP|標的}} 抑制劑"],
  feat: ["CETP 將 HDL 的 CE 轉換到 VLDL 及 LDL，LDL 內含較多的 CE 會容易使動脈硬化，因此 CETP 抑制劑可增加 {{HDL-C|物質}}、減少 LDL-C"] });
dA(33, "新藥", 208, "pcsk9-inhibitor", "Evolocumab、Alirocumab", "Evolocumab", {
  cls: ["{{PCSK9|標的}}（Proprotein Convertase Subtilisin/Kexin type 9）抑制劑"],
  feat: ["PCSK9 與 LDL 受體結合後會使 LDL 受體被分解，因此使用 PCSK9 抑制劑可以減少 LDL 受體被 PCSK9 分解，使 LDL 受體可以和血液中 LDL 結合，達到降低 LDL 的效果", "副作用：類流感症狀、{{鼻咽炎|副作用}}、眼疾"] });
kA(33, "Statin 類", 209, "Statin 類藥理特色", { table: { cols: ["藥理分類", "內容"], rows: [
  [{ t: "強弱比較", b: true }, "{{Rosuvastatin > Atorvastatin > Simvastatin|藥名}} >>> others"],
  [{ t: "CYP3A4 代謝", b: true }, "Lovastatin、Atorvastatin、Simvastatin"],
  [{ t: "CYP2C9 代謝", b: true }, "{{Rosuvastatin、Fluvastatin|藥名}}"],
  [{ t: "可與 statin 併用", b: true }, "1. Ezetimibe\n2. {{Fenofibrate|藥名}}（Fibrates 類中，選此藥較發生肌病變的機率較低）"],
  [{ t: "Prodrug", b: true }, "Mevastatin、Lovastatin、Simvastatin\n水解後得 {{3,5-dihydroxy acid|結構}} 以抑制 HMG-CoA reductase"],
  [{ t: "SAR", b: true }, "✧ 活性基團和 Mevaldyl-CoA intermediate 構造相似，可競爭 HMG-CoA reductase，增加 LDL 受體數目並降低 LDL 濃度\n✧ C5 與 Ring 間以{{兩個碳|結構}}的距離最佳\n✧ Chiral center：{{3R、5R|結構}}"] ] } });
kA(33, "Statin 類", 209, "雜環口訣（from 阿摩前輩）", { table: { head: [{ t: "雜環口訣（from 阿摩前輩）", cs: 2 }, null], cols: ["藥名", "雜環"], rows: [
  [{ t: "Fluvastatin", b: true }, "{{Indole|結構}}（福音）"],
  [{ t: "Atorvastatin", b: true }, "{{Pyrrole|結構}}（or 對 ro）"],
  [{ t: "Pitavastatin", b: true }, "{{Quinoline|結構}}（逼他哭）"],
  [{ t: "Rosuvastatin", b: true }, "{{Pyrimidine|結構}}（囉嗦，蝦米）"],
  [{ t: "Cerivastatin", b: true }, "{{Pyridine|結構}}（ri 對 ri）"] ] } });
kA(33, "Statin 類", 209, "練習題", [
  "Tip：此頁重點在於熟悉各 Statin 類藥品的雜環以及藥理特色",
  "Ex：Rosuvastatin 具下列何種雜環結構？(A) imidazole (B) pyrrole (C) pyrazole (D) pyrimidine　選 {{D|名詞}}"
]);
dA(33, "Statin 類", 209, "statins", "Statins（Mevastatin、Lovastatin、Simvastatin、Pravastatin…）", "Statins", {
  cls: ["{{HMG-CoA reductase inhibitor|藥物類別}}"],
  struct: ["Mevastatin、Lovastatin、Simvastatin 為 {{Prodrug|名詞}}", "Fluvastatin 含 Indole；Atorvastatin 含 Pyrrole；Pitavastatin 含 Quinoline；Rosuvastatin 含 Pyrimidine；Cerivastatin 含 Pyridine"] });
dA(33, "Fibrates", 210, "clofibrate", "Clofibrate", null, {
  cls: ["{{Fibrates|藥物類別}}"],
  feat: ["Clofibrate 屬於 Prodrug，{{Clofibric acid|物質}} 為活性代謝物", "不用於治療 Secondary hypercholesterolemia", "副作用：腹瀉、膽結石、心律不整、橫紋肌溶解"] });
dA(33, "Fibrates", 210, "fenofibrate", "Fenofibrate", null, {
  cls: ["Fibrates"],
  struct: ["為 Prodrug，結構屬於 {{Isopropyl ester|結構}}"],
  feat: ["Fenofibrate 為與 {{Statin|藥物類別}} 併用之首選藥"] });
dA(33, "Fibrates", 210, "gemfibrozil", "Gemfibrozil", null, {
  cls: ["Fibrates"],
  feat: ["為酸性藥物，具有高脂溶性，口服後可降 VLDL 濃度，在體內受 {{3A4|酵素}} 代謝進行 C-5 氧化形成 CH2OH", "Fibrates 類蛋白結合率高，具有很好的生體可用率，主要由{{腎|器官}}排泄，腎功能不良的病患服用此藥須減量"] });
dA(33, "膽固醇吸收抑制劑", 210, "ezetimibe", "Ezetimibe", null, {
  cls: ["膽固醇吸收抑制劑"],
  feat: ["常與 Statin 類藥物併用降膽固醇", "抑制小腸吸收膽固醇及植物固醇", "屬於 Prodrug，接上{{葡萄醣醛酸|物質}}後產生活性", "與制酸劑或膽酸結合樹脂併用 → Ezetimibe 濃度↓；與 {{Cyclosporine 或 Fibrates|藥名}} 併用 → Ezetimibe 濃度↑"] });
dA(33, "Bile acid-binding resins", 211, "bile-acid-resins", "Cholestyramine、Colestipol、Colesevelam", "Cholestyramine", {
  cls: ["{{Bile acid-binding resins|藥物類別}}"],
  feat: ["唯一{{不影響肝功能|性質}}的降血脂藥物", "孕婦可使用，因為{{不會被吸收|性質}}", "人體膽酸太多會造成皮膚搔癢的症狀，可利用此藥達到{{止癢|名詞}}的功效", "與其他藥品併服會降低其生體可用率，但 {{Colesevelam|藥名}} 較不會影響藥物的吸收"] });
dA(33, "未分類降血脂藥物", 211, "niacin", "Niacin（Vit B3、Nicotinic acid）", "Niacin", {
  cls: ["未分類降血脂藥物"],
  feat: ["副作用：增加{{前列腺素|物質}}的釋放引起皮膚潮紅、造成消化性潰瘍、使血糖和尿酸升高、肝指數上升", "引起的皮膚潮紅可用 {{NSAID|藥物類別}} 治療"] });
dA(33, "未分類降血脂藥物", 211, "dextrothyroxine", "Dextrothyroxine", null, {
  cls: ["未分類降血脂藥物"],
  feat: ["{{右旋|結構}}可以降血脂，左旋用來補充甲狀腺素"] });
dA(33, "其他", 211, "probucol", "Probucol", null, {
  cls: ["其他"],
  feat: ["本身是{{抗氧化劑|名詞}}，可降低 LDL 被氧化", "副作用：{{HDL 減少|副作用}}，QT 延長，胃腸道不適"] });

/* ================= 內分泌島（34～39） ================= */
isleA("endocrine", "內分泌島", { ground: "#E9D29A", light: "#F1E0B6", cliff: "#C4A96A" });

/* ===== 第 34 章 賀爾蒙藥物 ===== */
chA(34, "34", "賀爾蒙藥物", "212～215");
kA(34, "內分泌激素簡介", 212, "下視丘、腦下垂體前葉與標的器官", { table: { head: [{ t: "內分泌激素簡介", cs: 4 }, null, null, null], cols: ["下視丘", "腦下垂體前葉", "標的器官", "標的器官激素"], rows: [
  [{ t: "GHRH↑", b: true }, "Growth hormone↑\n（Somatotropin）", "肝臟、骨骼、肌肉", "{{IGF-1|物質}}（Insulin-like growth factor）"],
  [{ t: "CRH↑", b: true }, "ACTH↑", "腎上腺皮質", "Cortisol"],
  [{ t: "TRH↑", b: true }, "TSH↑", "甲狀腺", "Thyroxine、Triiodothyronine"],
  [{ t: "GnRH=LHRH↑", b: true }, "FSH、LH↑", "性腺", "Estrogen、Progesterone、Testosterone"],
  [{ t: "Dopamine↓", b: true }, "Prolactin↑", "乳房", ""] ] } });
kA(34, "GnRH 類似物", 212, "GnRH 結構與類似物", { table: { head: ["藥理分類", "", "藥名", "結構"], rows: [
  [{ t: "GnRH", cs: 2 }, null, "Gonadotropin releasing hormone", "pGlu-His-Trp-Ser-Tyr-{{Gly6|結構}}-Leu-Arg-Pro9-Gly10-NH2"],
  [{ t: "GnRH superagonist", b: true, rs: 5 }, { t: "10 個胺基酸", rs: 2 }, "Triptorelin", "--------------------D-Trp6--------------------"],
  [null, null, "Nafarelin", "--------------------D-Nal6--------------------"],
  [null, { t: "9 個胺基酸", rs: 3 }, "{{Leuprolide|藥名}}", "----------D-Leu6----------Pro9-NH-Et"],
  [null, null, "Hisrelin", "----------D-His6----------Pro9-NH-Et"],
  [null, null, "Goserelin", "----------D-Ser6----------Pro9-NH-NHCONH2"],
  [{ t: "GnRH-antagonist（-relix）", cs: 2 }, null, "{{Ganirelix、Cetrorelix|藥名}}", ""] ],
  note: "✧ Nafarelin 之六號位取代基為 {{D-β-(2-naphthyl alanine)|結構}}\n✧ Nafarelin 為鼻溶液在{{鼻腔|器官}}黏膜易被吸收，易產生戒斷性月經來潮，可治療子宮內膜異位，副作用為鼻炎\n✧ GnRH superagonist 長期使用可以治療{{子宮內膜異位及攝護腺癌|疾病}}，但會造成{{骨質疏鬆|副作用}}\n✧ 下列那個 GnRH superagonist 與 leuprolide 類似，均以 NH-Et 置換結構中的 C-terminal glycine 10-NH2\n(A) goserelin (B) histrelin (C) nafarelin (D) triptorelin　選 {{B|名詞}}" } });
dA(34, "GnRH superagonist", 212, "leuprolide", "Leuprolide（GnRH superagonist）", "Leuprolide", {
  cls: ["{{GnRH superagonist|藥物類別}}（9 個胺基酸）"],
  struct: ["D-Leu6、Pro9-{{NH-Et|結構}}"],
  feat: ["長期使用可以治療{{子宮內膜異位及攝護腺癌|疾病}}，但會造成骨質疏鬆"] });
dA(34, "GnRH-antagonist", 212, "ganirelix-cetrorelix", "Ganirelix、Cetrorelix", "Ganirelix", {
  cls: ["{{GnRH-antagonist|藥物類別}}（-relix）"] });
dA(34, "Growth hormone agonist", 213, "somatropin", "Somatropin", null, {
  cls: ["Growth hormone agonist"],
  feat: ["作用在 {{GH receptor|標的}} 上，增加 Insulin-like growth factor-1 的製造", "可用於{{侏儒症|疾病}}"] });
dA(34, "Growth hormone agonist", 213, "mecasermin", "Mecasermin", null, {
  cls: ["Growth hormone agonist"], feat: ["重組的 {{IGF-I|物質}}，可刺激 IGF-I receptor"] });
dA(34, "Growth hormone antagonist", 213, "somatostatin", "Somatostatin（體抑素）", "Somatostatin", {
  cls: ["Growth hormone antagonist"],
  struct: ["具有 {{14|數值}} 個胺基酸", "具有{{雙硫鍵|結構}}"],
  feat: ["可治療{{肢端肥大|疾病}}"] });
dA(34, "Growth hormone antagonist", 213, "octreotide", "Octreotide", null, {
  cls: ["Growth hormone antagonist：屬於 {{Somatostatin analog|藥物類別}}"],
  struct: ["以皮下給藥，具 {{8|數值}} 個胺基酸", "具有雙硫鍵；活性結構必須片段：{{Phe-Trp-Lys-Thr|結構}}（本色離席）"],
  feat: ["用於肢端肥大症、{{食道靜脈曲張出血|疾病}}、門靜脈高壓、胰島瘤、減輕 Achlorhydria（WDHA）syndrome、化療、放射線引起之腹瀉", "副作用：{{膽結石|副作用}}（最常見）、心跳徐緩、B12 缺乏"] });
dA(34, "Growth hormone antagonist", 213, "pegvisomant", "Pegvisomant", null, {
  cls: ["Growth hormone antagonist：抑制 {{GH receptor|標的}}"],
  feat: ["可治療{{肢端肥大症|疾病}}"] });
dA(34, "Prolactin-antagonist", 213, "bromocriptine", "Bromocriptine", null, {
  cls: ["Prolactin-antagonist：{{D2-agonist|藥物類別}}"],
  feat: ["可治療{{肢端肥大症|疾病}}、巴金森氏症、{{高泌乳素血症|疾病}}"] });
dA(34, "Prolactin-antagonist", 213, "cabergoline", "Cabergoline", null, {
  cls: ["Prolactin-antagonist：D2-agonist"],
  feat: ["用於{{高泌乳血症|疾病}}、巴金森氏症"] });
dA(34, "Oxytocin", 214, "oxytocin", "Oxytocin（催產素）", "Oxytocin", {
  cls: ["Oxytocin-agonist"],
  struct: ["X=NH2；Y={{Ile|物質}}；Z={{Leu|物質}}"],
  feat: ["{{鼻噴劑|劑型}}：可促進產後婦女乳汁分泌", "注射劑：促進子宮收縮，控制子宮出血"] });
dA(34, "Oxytocin", 214, "atosiban", "Atosiban", null, {
  cls: ["{{Oxytocin-antagonist|藥物類別}}"],
  feat: ["減少子宮收縮，用於早產{{安胎|名詞}}"] });
dA(34, "Vasopressin", 214, "vasopressin", "Vasopressin", null, {
  cls: ["Vasopressin-agonist"],
  struct: ["X=NH2；Y={{Phe|物質}}；Z={{Arg|物質}}", "與 Oxytocin 差別在 {{3、8|數值}} 號位"],
  feat: ["Vasopressin 有兩種受體：{{V1|標的}} 位於血管平滑肌，與血管收縮有關；{{V2|標的}} 位於腎小管細胞，與抗利尿作用有關", "可治療中樞性尿崩症（垂體性尿崩症）"] });
dA(34, "Vasopressin", 214, "desmopressin", "Desmopressin（DDAVP）", "Desmopressin", {
  cls: ["Vasopressin-agonist"],
  struct: ["X={{H|結構}}；Y=Phe；Z=Arg"],
  feat: ["可促使 VIII 凝血因子和 von Willebrand 因子釋放；可治療{{中樞性尿崩症|疾病}}"] });
mA("conivaptan-tolvaptan", 214, {
  feat: ["可治療低血鈉、SIADH；{{Demeclocycline|藥名}} 也可以治療 SIADH"] });
kA(34, "Oxytocin 與 Vasopressin", 214, "Oxytocin 與 Vasopressin 結構比較", { images: ["assets/amulet/fig/oxytocin-vaso-backbone.png"], table: { head: ["藥理分類", "藥名", "結構", "藥理特色"], rows: [
  [{ t: "Oxytocin-agonist", b: true }, "Oxytocin（催產素）", "X=NH2；Y=Ile；Z=Leu", "1. 鼻噴劑：可促進產後婦女乳汁分泌\n2. 注射劑：促進子宮收縮，控制子宮出血"],
  [{ t: "Oxytocin-antagonist", b: true }, "Atosiban", "", "1. 減少子宮收縮，用於早產安胎"],
  [{ t: "Vasopressin-agonist", b: true, rs: 2 }, "Vasopressin", "X=NH2；Y=Phe；Z=Arg", "1. Vasopressin 有兩種受體\nV1：位於血管平滑肌，與血管收縮有關\nV2：位於腎小管細胞，與抗利尿作用有關\n2. 可治療{{中樞性尿崩症（垂體性尿崩症）|疾病}}\n3. 與 Oxytocin 差別在 3,8 號位"],
  [null, "Desmopressin（DDAVP）", "X=H；Y=Phe；Z=Arg", "1. 可促使 {{VIII 凝血因子和 von Willebrand 因子|物質}}釋放\n2. 可治療中樞性尿崩症"],
  [{ t: "Vasopressin-antagonist", b: true }, "Conivaptan、Tolvaptan", "", "1. 可治療{{低血鈉、SIADH、ADPKD|疾病}}\n2. {{Demeclocycline|藥名}} 也可以治療 SIADH"] ] } });
kA(34, "Oxytocin 與 Vasopressin", 214, "Vasopressin 受體", { table: { head: ["受體", "神經傳遞物質", "生理作用"], rows: [
  [{ t: "V1(Gq)", b: true }, "{{Ca2+|物質}}", "血管收縮→血壓上升"],
  [{ t: "V2(Gs)", b: true, rs: 2 }, { t: "cAMP", rs: 2 }, "增加水通道的數量，促進水分再吸收"],
  [null, null, "促進 Von Willebrand factor 及凝血因子 VIII 釋放"] ],
  note: "✓ 催產素、抗利尿激素由{{下視丘|器官}}生成，腦下垂體{{後葉|器官}}釋放" } });
kA(34, "蛋白質藥物與胺基酸總數", 215, "蛋白質藥物與胺基酸總數", { table: { head: [{ t: "蛋白質藥物與胺基酸總數", cs: 5 }, null, null, null, null], cols: ["蛋白質藥物", "胺基酸總數", "蛋白質藥物", "", "胺基酸總數"], rows: [
  [{ t: "Glucagon", b: true }, "{{29|數值}}", "TRH", "", "3（pyro-Glutamyl-His-Pro amide）"],
  [{ t: "Calcitonin（具雙硫鍵）", b: true }, "{{32|數值}}", "Angiotensin", "", "10"],
  [{ t: "Insulin\n（2 個 interchain，1 個 intrachain）", b: true }, "{{51|數值}}（α21、β30）", "Angiotensin II", "", "8"],
  [{ t: "Parathyroid hormone", b: true }, "{{84|數值}}", "Oxytocin", { t: "（具雙硫鍵）", rs: 4 }, "9"],
  [{ t: "Enkephalin", b: true }, "5", "Vasopressin", null, "9"],
  [{ t: "Substance P", b: true }, "11", "Somatostatin", null, "{{14|數值}}"],
  [{ t: "", cs: 2 }, null, "Octreotide", null, "{{8|數值}}"] ] } });

/* ===== 第 35 章 皮質類固醇 ===== */
chA(35, "35", "皮質類固醇", "216～225");
kA(35, "皮質類固醇總論", 216, "下視丘-腦下垂體-腎上腺軸（Medical Pharmacology at a Glance 圖）", { images: ["assets/amulet/fig/hpa-axis.png"], table: { head: ["", "作用", "內容"], rows: [
  [{ t: "醣質皮質類固醇", b: true, rs: 2 }, "抗發炎", "抑制 {{Phospholipase A2|酵素}} 以及抑制 Cyclooxygenase"],
  [null, "降低免疫反應", "增加 {{IgG|物質}} 分解速率"],
  [{ t: "醣質皮質類固醇\n長期使用的副作用", b: true }, { t: "", cs: 2 }, "糖尿病、{{肌肉萎縮、骨質疏鬆|副作用}}、精神病、消化性潰瘍"],
  [{ t: "礦質皮質類固醇", b: true, rs: 2 }, "作用", "留鈉、排氫、排鉀"],
  [null, "常見的副作用", "低血鉀、高血壓、肌肉無力"] ],
  note: "✧ {{Cosyntropin|藥名}}：由人類 ACTH 之 {{1-24|數值}} 個 amino acid 組成，可作為腎上腺皮質功能不全診斷劑\n✧ 使用 Steroid 可抑制 ACTH 的分泌，造成抑制腎上腺的作用（即{{負回饋|名詞}}）\n✧ 108-2 長時間使用 glucocorticoids 製劑可能導致下列那些副作用？①胃潰瘍②肌肉病變③骨質疏鬆④血鈉過低⑤血糖過低\n(A) ①②③ (B) ①③⑤ (C) ②③④ (D) ②④⑤　選 {{A|名詞}}\n✧ 細胞內受體：類固醇、性激素、Thyroxine、Vitamin D" } });
kA(35, "類固醇的 SAR 與藥化特性", 217, "關鍵字與重要敘述", { images: ["assets/amulet/fig/steroid-skeleton.png"], table: { head: ["關鍵字", "重要敘述"], rows: [
  [{ t: "1. 藥名有 isone", b: true }, "11 號位有 {{C=O|結構}}"],
  [{ t: "2. 藥名有 isol", b: true }, "11 號位有 OH"],
  [{ t: "3. 11β-hydroxy", b: true }, "與類固醇受體結合的重要官能基"],
  [{ t: "4. Pred", b: true }, "1 號位有{{雙鍵|結構}}"],
  [{ t: "5. Metha", b: true }, "1 號位有雙鍵、9αF、16αCH3"] ] } });
kA(35, "類固醇的 SAR 與藥化特性", 217, "醣質／礦質皮質類固醇取代基效應", { table: { head: ["醣質皮質類固醇↑\n礦質皮質類固醇↑", "醣質皮質類固醇↑", "礦質皮質類固醇↓"], rows: [
  [{ t: "{{9α-F、9α-Cl、21-OH|結構}}" }, "1,2-雙鍵、{{6α-F|結構}}、11β-OH", "6α-CH3、16α-OH、17α-OH\n16α ＆ 16β-CH3\n16α，17α-acetonide"] ],
  note: "✧ B/C 環、C/D 環皆需以 {{trans|結構}} 配置才有活性；固醇結構 All trans 之活性大於 All cis\n✧ 21-OH 為活性必需，若被 {{Cl|結構}} 取代，可增加外用抗發炎效力\n✧ 雙鍵在 1,2 號位，抗發炎效果增強 {{4-5|數值}} 倍\n✧ 礦質皮質取代基強弱順序 {{9→1→6→16|名詞}}\n✧ 類固醇分子加上 9α-Fluoro，會使醣質及礦質皮質類固醇作用上升；加上 {{16α-Methyl|結構}}，使醣質皮質類固醇作用上升，礦質皮質類固醇作用下降" } });
kA(35, "消炎活性及礦質活性比較", 218, "類固醇的消炎活性及礦質活性比較", { table: { head: ["藥名", "消炎活性", "外用", "礦質活性"], rows: [
  [{ t: "短至中效醣質皮質類固醇", cs: 4 }, null, null, null],
  [{ t: "Hydrocortisone(=Cortisol)", b: true }, "1", "1", "1"],
  [{ t: "Cortisone", b: true }, "0.8（C-11 轉為 -OH）", "0", "0.8"],
  [{ t: "Prednisone", b: true }, "{{4|數值}}", "0", "0.3"],
  [{ t: "Prednisolone", b: true }, "{{5|數值}}", "4", "0.3"],
  [{ t: "中效醣質皮質類固醇", cs: 4 }, null, null, null],
  [{ t: "Triamcinolone", b: true }, "5", "{{25-100|數值}}", "0"],
  [{ t: "長效醣質皮質類固醇（C9、C1、C16 有取代基，抗發炎效果強）", cs: 4 }, null, null, null],
  [{ t: "Dexamethasone", b: true }, "{{30|數值}}", "10", "0"],
  [{ t: "Betamethasone", b: true }, "{{25-40|數值}}", "10", "0"] ] } });
kA(35, "消炎活性及礦質活性比較", 218, "礦質皮質類固醇", { table: { head: ["藥名", "消炎活性", "外用", "礦質活性"], rows: [
  [{ t: "Aldosterone", b: true }, "0.2", "0.2", "{{800|數值}}"],
  [{ t: "Fludrocortisone", b: true }, "10", "0", "{{250|數值}}"],
  [{ t: "Desoxycorticosterone", b: true }, "0", "0", "20"] ],
  note: "✓ 抗發炎口訣（from 阿摩）：{{Betamethasone > Dexamethasone > Fludrocortisone > Prednisone > Cortisone|藥名}}（炎被他弟殺，父陪你哭）\n✓ 鈉水滯留口訣（from 阿摩）：{{Aldosterone > Fludrocortisone > Desoxycorticosterone|藥名}}（黑道（台語）、富人流（鈉滯留）連於 Disco 舞廳）" } });
kA(35, "類固醇生合成路徑", 219, "類固醇生合成路徑（Katzung 圖）", { images: ["assets/amulet/fig/steroid-synthesis.png"] });
dA(35, "抑制類固醇合成", 220, "aminoglutethimide", "Aminoglutethimide", null, {
  cls: ["{{Desmolase inhibitor|藥物類別}}、Aromatase inhibitor"],
  feat: ["治療 {{Cushing's syndrome|疾病}}", "乳癌輔助用藥"] });
dA(35, "抑制類固醇合成", 220, "anastrozole", "Anastrozole", null, {
  cls: ["{{Aromatase inhibitor|藥物類別}}"], feat: ["治療{{乳癌|疾病}}"] });
dA(35, "抑制類固醇合成", 220, "mifepristone", "Mifepristone", null, {
  cls: ["{{Progesterone antagonist|藥物類別}}、Glucocorticoid antagonist"],
  feat: ["早期{{墮胎|名詞}}", "治療 Cushing's syndrome"] });
dA(35, "抑制類固醇合成", 220, "trilostane-metyrapone", "Ketoconazole、Trilostane、Metyrapone", "Metyrapone", {
  cls: ["{{抑制類固醇的合成|名詞}}"],
  feat: ["治療 Cushing's syndrome", "{{Metyrapone|藥名}}：診斷腎上腺功能"] });
kA(35, "腎上腺疾病", 220, "藥名、藥理機轉與適應症", { table: { head: ["藥名", "藥理機轉", "適應症"], rows: [
  [{ t: "Aminoglutethimide", b: true }, "Desmolase inhibitor\nAromatase inhibitor", "治療 Cushing's syndrome\n乳癌輔助用藥"],
  [{ t: "Anastrozole", b: true }, "Aromatase inhibitor", "治療乳癌"],
  [{ t: "Mifepristone", b: true }, "Progesterone antagonist\nGlucocorticoid antagonist", "早期墮胎\n治療 Cushing's syndrome"],
  [{ t: "Ketoconazole\nTrilostane\nMetyrapone", b: true }, "抑制類固醇的合成", "治療 Cushing's syndrome\nMetyrapone：診斷腎上腺功能"] ] } });
kA(35, "腎上腺疾病", 220, "疾病、原因與治療", { table: { head: ["疾病", "原因", "治療"], rows: [
  [{ t: "愛迪生氏症（{{Addison's disease|疾病}}）", b: true }, "腎上腺皮質激素過少", "補充 Steroid"],
  [{ t: "庫欣氏症（{{Cushing's disease|疾病}}）", b: true }, "腎上腺皮質激素過多", "使用抑制類固醇的合成的藥品"],
  [{ t: "原發性醛固酮症（{{Conn's syndrome|疾病}}）", b: true }, "缺乏 17α-Hydroxylase\n→導致醛固酮合成過多", "使用醛固酮阻斷劑 {{Spironolactone|藥名}}"] ],
  note: "✧ 醣質皮質類固醇 OH 合成的順序：{{17→21→11|名詞}}；礦質皮質類固醇 OH 合成的順序：{{21→11→18|名詞}}\n✧ Testosterone（男）→ Estradiol（女）：{{Aromatase|酵素}}\n✧ 碳數變化：Cholestrol（27 個 C）→ Pregnenolone（{{21C|數值}}）→ Testosterone（{{19C|數值}}）→ Estrogen（{{18C|數值}}）" } });
dA(35, "Natural steroids", 221, "estradiol", "Estradiol", null, {
  cls: ["Natural steroids"],
  struct: ["基本骨架由 {{18|數值}} 個碳原子所組成"],
  feat: ["抑制{{破骨細胞|名詞}}之活性", "增加血中 {{HDL|物質}} 濃度", "副作用：造成血栓性栓塞疾病、膽汁鬱積性黃疸", "{{口服無效|性質}}"] });
dA(35, "Natural steroids", 221, "testosterone", "Testosterone", null, {
  cls: ["Natural steroids"], struct: ["由 {{19|數值}} 個碳原子組成"] });
dA(35, "Natural steroids", 221, "progesterone", "Progesterone", null, {
  cls: ["Natural steroids"], struct: ["由 {{21|數值}} 個碳原子組成"] });
dA(35, "Glucocorticoids", 221, "cortisone", "Cortisone", null, {
  cls: ["Glucocorticoids（醣質皮質類固醇）"],
  feat: ["{{外用無效|性質}} → 11 號位要在體內轉化為 {{OH|結構}} 才能與受體結合", "礦質、糖質皮質類固醇效價為 {{0.8|數值}}"] });
dA(35, "Glucocorticoids", 221, "hydrocortisone", "Hydrocortisone", null, {
  cls: ["Glucocorticoids"],
  feat: ["又稱：{{Cortisol|物質}}", "礦質、糖質皮質類固醇效價為 {{1|數值}}"] });
dA(35, "Glucocorticoids", 221, "prednisolone", "Prednisolone", null, {
  cls: ["Glucocorticoids"],
  struct: ["Pred 代表有{{雙鍵|結構}} → 抗發炎藥效增至 4-5 倍"],
  feat: ["最常使用於{{器官移植|名詞}}的抗排斥藥物", "可外用"] });
dA(35, "Glucocorticoids", 222, "dexamethasone", "Dexamethasone", null, {
  cls: ["Glucocorticoids"],
  struct: ["Metha 代表 1 號位有雙鍵、{{9αF、16αCH3|結構}}"],
  feat: ["強效的抗發炎活性", "作為 {{Cushing's syndrome|疾病}} 診斷劑", "可用於促進{{胎兒肺功能|名詞}}成熟"] });
dA(35, "Glucocorticoids", 222, "betamethasone", "Betamethasone", null, {
  cls: ["Glucocorticoids"],
  struct: ["Metha 代表 1 號位有雙鍵、9αF、16αCH3", "與 Dexamethasone 的差別 {{16αCH3 → 16βCH3|結構}}"],
  feat: ["強效的抗發炎活性", "{{最常|性質}}用於促進胎兒肺功能成熟"] });
dA(35, "Glucocorticoids", 222, "triamcinolone", "Triamcinolone", null, {
  cls: ["Glucocorticoids"],
  struct: ["可接 {{acetonide|結構}}，藥效可增至 100 倍", "與 dexamethasone 的差別在於 {{16αOH|結構}}"] });
dA(35, "Glucocorticoids", 222, "fluocinolone-acetonide", "Fluocinolone acetonide", "Fluocinolone", {
  cls: ["Glucocorticoids"], struct: ["與 Triamcinolone 的差別在於 {{6αF|結構}}"] });
dA(35, "Glucocorticoids", 222, "meprednisone", "Meprednisone", null, {
  cls: ["Glucocorticoids"], feat: ["不會有產生鈉滯留，因為 {{16 有 CH3|結構}}"] });
dA(35, "吸入型類固醇", 223, "budesonide", "Budesonide", null, {
  cls: ["{{吸入型類固醇|藥物類別}}"],
  struct: ["結構{{未含有鹵素|結構}}"],
  feat: ["一種吸入型類固醇，使用後須{{漱口|名詞}}"] });
dA(35, "Mineralcorticoids", 223, "aldosterone", "Aldosterone", null, {
  cls: ["Mineralcorticoids（礦質皮質類固醇）"],
  feat: ["再吸收 Na+，排除 K+", "治療 {{Addison's disease|疾病}}", "鈉滯留能力{{最強|性質}}（800）"] });
dA(35, "Mineralcorticoids", 223, "fludrocortisone", "Fludrocortisone", null, {
  cls: ["Mineralcorticoids"],
  feat: ["鈉滯留能力第二（{{250|數值}}）", "抗發炎能力（10）", "可治療{{腎上腺增生症|疾病}}（缺乏 21-hydroxylase）"] });
dA(35, "Mineralcorticoids", 223, "deoxycorticosterone", "Deoxycorticosterone", null, {
  cls: ["Mineralcorticoids"],
  feat: ["Na+ 滯留能力第三", "沒有消炎的作用，因為 {{11 號位沒有 OH|結構}} 基"] });
mA("trilostane-metyrapone", 224, {
  struct: ["Trilostane 具 {{Steroid|結構}} 結構"],
  feat: ["Metyrapone：類固醇生合成抑制劑；副作用：{{多毛症|副作用}}"] });
mA("ketoconazole", 224, { feat: ["抑制類固醇的合成，治療 Cushing' syndrome"] });
mA("aminoglutethimide", 224, { cls: ["抑制 {{Cholesterol 轉變為 Pregnenolone|名詞}} → 治療 Cushing's syndrome；抑制 Aromatase，可治療乳癌"] });
mA("mifepristone", 224, {
  struct: ["具有 {{N,N-Dimethylphenyl|結構}}"],
  feat: ["口服生體可用率高", "Progesterone-antagonist → 併用 {{Misoprostol|藥名}} 用於性交後緊急避孕藥", "Glucocorticoid-antagonist → 治療 Cushing's syndrome"] });
mA("spironolactone", 224, { feat: ["Mineralocorticoid antagonist：治療 {{Conn's syndrome|疾病}} 及肝硬化造成的腹水"] });
kA(35, "類固醇的 SAR 與藥化特性", 225, "補充藥化考點", { table: { cols: ["取代基", "藥物"], rows: [
  [{ t: "必需基團", b: true, rs: 3 }, "1. 基本固醇結構 All trans 之活性大於 All cis"],
  [null, "2. B/C 環、C/D 環皆需以反式（trans）配置才有活性"],
  [null, "3. {{21-OH|結構}} 為活性必需基團"],
  [{ t: "不含鹵素", b: true }, "{{Desonide、Ciclesonide、Budesonide|藥名}}"],
  [{ t: "7-Cl", b: true }, "Alclometasone"],
  [{ t: "9-Cl", b: true }, "{{Beclomethasone|藥名}}"],
  [{ t: "9-Cl、21-Cl", b: true }, "{{Mometasone|藥名}}"],
  [{ t: "9-F、21-Cl", b: true }, "Halobetasol、Halcinonide、Clobetasol"],
  [{ t: "含有三個 F", b: true }, "{{Fluticasone|藥名}}"],
  [{ t: "16-OH", b: true }, "Triamcinolone、Fluocinolone"] ] } });

/* ===== 第 36 章 性激素藥物 ===== */
chA(36, "36", "性激素藥物", "226～231");
kA(36, "性激素作用圖", 226, "男性與女性性激素路徑（Katzung 圖）", { images: ["assets/amulet/fig/sex-hormone.png"], points: [
  "男性：下視丘 GnRH → 腦垂腺前葉 → FSH → Sertoli cell → 形成精子；LH → Leydig cell → Testosterone →（{{5α-reductase|酵素}}，被 {{Finasteride|藥名}} 抑制）→ 5α-dihydrotestosterone → Androgen receptor",
  "Androgen receptor 產生作用：男性第二性徵、同化作用（蛋白質合成）；雄性素受體阻斷劑：{{Flutamide、Cyproterone、Spironolactone|藥名}}",
  "抑制 Testosterone 合成：{{Ketoconazole、Spironolactone|藥名}}",
  "GnRH-supergonist：Nafarelin；GnRH-antagonist：Ganirelix",
  "女性：FSH → 濾泡 → 排卵（被 {{Clomiphene|藥名}}、避孕藥影響）→ 黃體 → Progesterone →（17α-hydroxylase，被 Ketoconazole 抑制）→ Testosterone、Androstenedione →（Aromatase）→ Estradiol ⇌ Estrone → Estriol",
  "Aromatase inhibitors：{{Anastrozole、Aminoglutethimide|藥名}}；Estrogen receptor antagonist：{{Fulvestrant|藥名}}",
  "Estrogen receptor 產生作用：女性第二性徵、子宮內膜發育、抑制{{蝕骨細胞|名詞}}、增加凝血因子"
] });
kA(36, "性激素作用圖", 226, "性激素考點", [
  "5α-Dihydrotestosterone 的活性比 Testosterone 高 {{10|數值}} 倍",
  "{{Cyproterone 與 Flutamide|藥名}} 為雄性激素受體的抑制劑",
  "Ketoconazole、Spironolactone 抑制{{雄性素|物質}}合成",
  "Clomiphene 為 {{SERMs|藥物類別}}，利用阻斷雌性素受體的機轉，可增加 LH、FSH 的分泌，促使濾泡排卵",
  "Aminoglutethimide 與 Anastrozole 可減少 {{Estradiol|物質}} 的生成，可治療乳癌",
  "含 Ethinyl estradiol（EE）的口服避孕藥與{{抗生素|藥物類別}}併用，會使避孕藥腸肝循環受抑制，影響藥效"
]);
mA("estradiol", 227, {
  cls: ["雌激素（活性必須：A 環為{{芳香環|結構}}且環上有 C3-OH 取代，C3 與 C17 的兩個 OH 間最適當距離為 10.3-12.1Å）"],
  feat: ["代謝：Estradiol ⇌ Estrone → Estriol", "氧化代謝物：C2、C4、C16 氧化形成 OH", "Estrone：C17-OH → C=O，活性僅剩 {{1/3|數值}}", "Estriol：C3-OH、C16-OH、C17-OH，活性剩 {{1/60|數值}}", "作為{{停經後|名詞}}的荷爾蒙治療"] });
dA(36, "雌激素", 227, "ethinyl-estradiol", "Ethinyl estradiol", null, {
  cls: ["雌激素"],
  struct: ["取代基位置：{{17α-ethinyl|結構}}，阻礙 17β-OH 氧化"],
  feat: ["不是 Prodrug，為 {{CYP450|酵素}} 的抑制劑"] });
dA(36, "雌激素", 227, "diethylstilbestrol", "Diethylstilbestrol", null, {
  cls: ["雌激素"],
  struct: ["具有 {{Stilbene|結構}} 結構，以「{{Trans|結構}}」活性較佳"],
  feat: ["在懷孕時服用，女嬰易罹患{{陰道癌|疾病}}", "為{{非固醇類|性質}}女性荷爾蒙藥物"] });
dA(36, "SERMs", 227, "clomiphene", "Clomiphene", null, {
  cls: ["Selective estrogen receptor modulators（{{SERMs|藥物類別}}）"],
  struct: ["結構具有 {{Triphenylethylene|結構}}"],
  feat: ["{{E-isomer|結構}} 具有抗雌性素活性，當雌性素下降會使 LH 上升，促進排卵", "Z-isomer 具有雌性素的作用", "副作用：熱潮紅、{{多胞胎|副作用}}", "口訣：Clomiphene 排卵 E 常"] });
dA(36, "SERMs", 227, "tamoxifen", "Tamoxifen", null, {
  cls: ["SERMs"],
  feat: ["對乳癌細胞為 {{antagonist|名詞}}，對子宮內膜為 {{agonist|名詞}}，因此用於治療乳癌，但會造成子宮內膜增生", "代謝：{{N-demethylation（3A4）|名詞}}，芳香環對位碳氧化（2D6）後活性會增加", "{{Z-isomer|結構}} 最具有抗乳癌作用", "有口服劑型", "使用本藥物 5 年後建議以 {{anastrozole|藥名}} 做為替代藥物治療", "口訣：Tamoxifen 順（Z）風婦產科"] });
dA(36, "SERMs", 228, "raloxifene", "Raloxifene", null, {
  cls: ["SERMs"],
  struct: ["{{不具有|性質}} Triphenylethylene"],
  feat: ["對骨骼上的雌激素受體為{{致效劑|名詞}}，對子宮及乳房組織則為拮抗劑", "商品名：鈣穩錠", "治療停經後的{{骨質疏鬆|疾病}}", "不會有子宮內膜增生的副作用"] });
dA(36, "SERMs", 228, "bazedoxifene", "Bazedoxifene", null, {
  cls: ["SERMs"],
  struct: ["屬 {{Indole|結構}} 衍生物"],
  feat: ["對骨骼上的雌激素受體為致效劑，對子宮及乳房組織則為拮抗劑", "作為停經婦女雌激素補充或預防停經婦女的骨質疏鬆"] });
dA(36, "Antiestrogen", 228, "fulvestrant", "Fulvestrant", null, {
  cls: ["Antiestrogen：{{Pure|性質}} estrogen receptor antagonist"],
  feat: ["用於治療{{乳癌|疾病}}"] });
dA(36, "Aromatase inhibitors", 228, "letrozole", "Letrozole", null, {
  cls: ["Aromatase inhibitors：{{Reversible|性質}} aromatase inhibitor"],
  struct: ["屬於非固醇類骨架，具有 {{Triazole|結構}} 環", "Letrozole 的 {{1,2,4-triazole|結構}} 可與 aromatase 的血基質（heme）產生交互作用"],
  feat: ["治療停經後婦女乳癌之首選藥"] });
mA("anastrozole", 228, {
  struct: ["Reversible aromatase inhibitor，皆有 Triazole、CN 除了 {{Vorozole|藥名}}"],
  feat: ["治療停經後婦女乳癌之首選藥"] });
dA(36, "Aromatase inhibitors", 228, "exemestane", "Exemestane", null, {
  cls: ["Aromatase inhibitors：{{Irreversible|性質}} aromatase inhibitor"],
  struct: ["屬於{{類固醇|結構}}骨架"] });
mA("progesterone", 229, {
  cls: ["黃體素"],
  feat: ["不可口服，代謝：{{5β-Pregnanediol|物質}}", "可增加女性{{基礎體溫|名詞}}", "影響血脂：使 HDL↓、LDL↑", "懷孕初期的受孕著床與維持正常懷孕的重要荷爾蒙"] });
dA(36, "黃體素", 229, "norgestrel", "Norgestrel", null, {
  cls: ["黃體素"], feat: ["{{植入型|劑型}}長效避孕藥（諾普蘭）", "{{二代|名詞}}黃體素"] });
dA(36, "黃體素", 229, "desogestrel", "Desogestrel", null, {
  cls: ["黃體素"],
  struct: ["去除 {{C19-CH3|結構}}，不易引起男性化的副作用"],
  feat: ["第{{三|數值}}代黃體素"] });
mA("mifepristone", 229, { cls: ["Antiprogestin"] });
kA(36, "黃體素 SAR", 229, "Medroxyprogesterone acetate 與 Megestrol", { images: ["assets/amulet/fig/mpa-megestrol-sar.png"], table: { head: ["藥名", "SAR"], rows: [
  [{ t: "Medroxyprogesterone acetate", b: true }, "{{C6|結構}} 接上甲基，{{C17α|結構}} 接上乙酯基"],
  [{ t: "Megestrol", b: true }, "{{C6、C7|結構}} 導入雙鍵"] ] } });
mA("testosterone", 230, {
  cls: ["雄性素"],
  struct: ["加上 {{17α-CH3|結構}} 可以幫助口服", "5α-Androstane 之 A/B、B/C、C/D 環之立體結構為 {{All trans|結構}}", "修飾成 5β-H、17α-OH 不具有雄性激素活性", "三號位酮基取代為非必要結構，如 Androsterone"],
  feat: ["5α-Dihydrotestosterone 的活性比 Testosterone 高 {{10|數值}} 倍"] });
dA(36, "雄性素衍生物", 230, "danazol", "Danazol", null, {
  cls: ["雄性素衍生物"],
  struct: ["雜環骨架：{{Isoxazole|結構}}"],
  feat: ["治療{{子宮內膜異位|疾病}}", "活性代謝物：Ethisterone，非活性代謝物：2-OHmethylethisterone"] });
dA(36, "蛋白質同化劑", 230, "stanozolol", "Stanozolol", null, {
  cls: ["{{蛋白質同化劑|藥物類別}}"],
  struct: ["雜環骨架：{{Pyrazole|結構}}"],
  feat: ["使雄性活性上升：{{C17-CH3、C5α-H、A ring 雙鍵|結構}}"] });
dA(36, "Antiandrogens：抑制 Androgen receptor", 231, "flutamide-group", "Flutamide、Nilutamide、Bicalutamide", "Flutamide", {
  cls: ["Antiandrogens：抑制 {{Androgen receptor|標的}}"],
  struct: ["屬於{{非固醇類|性質}}骨架", "結構具有苯胺，其對位有{{拉電子基|結構}}取代（NO2、CN）可阻斷雄性素受體的作用"],
  feat: ["治療{{攝護腺癌|疾病}}"] });
dA(36, "Antiandrogens：抑制 Androgen receptor", 231, "enzalutamide", "Enzalutamide", null, {
  cls: ["Antiandrogens：抑制 Androgen receptor"],
  struct: ["骨架：{{Thiohydantoin|結構}}"],
  feat: ["屬於{{二代|名詞}}抗雄性激素藥", "受 CYP3A4 & 2C8 代謝 N-脫甲基，生成活性代謝物：N-desmethylenzalutamide"] });
dA(36, "Antiandrogens：抑制 Androgen receptor", 231, "cyproterone", "Cyproterone", null, {
  cls: ["Antiandrogens：抑制 Androgen receptor"],
  feat: ["治療攝護腺癌、{{女性多毛症|疾病}}"] });
dA(36, "Antiandrogens：抑制 5α-reductase", 231, "finasteride", "Finasteride", null, {
  cls: ["Antiandrogens：抑制 {{5α-reductase|酵素}}"],
  struct: ["結構骨架為 {{Azasteroid|結構}}"],
  feat: ["5α-reductase 的{{機理性抑制劑（mechanism-based）|名詞}}", "機理性抑制劑：原本藥物無活性，會被目標酵素活化，藥物活化後反而抑制目標酵素", "治療{{前列腺增生、雄性禿|疾病}}"] });
dA(36, "Antiandrogens：抑制 5α-reductase", 231, "dutasteride", "Dutasteride", null, {
  cls: ["Antiandrogens：抑制 5α-reductase"],
  feat: ["與 Finasteride 相比，作用較強、血漿蛋白結合力高、半衰期長，有活性代謝物（{{6'+OH|結構}}）"] });

/* ===== 第 37 章 骨質疏鬆藥物 ===== */
chA(37, "37", "骨質疏鬆藥物", "232～233");
kA(37, "骨質疏鬆藥物作用圖", 232, "造骨細胞與破骨細胞（Katzung 圖）", { images: ["assets/amulet/fig/bone-remodel.png"], points: [
  "{{Teriparatide|藥名}}（parathyroid hormone）⊕ 造骨細胞（Osteoblast）",
  "造骨細胞釋放 RANKL → RANK → ⊕ 破骨細胞（Osteoclast）；{{Denosumab|藥名}} ⊖ RANKL",
  "{{鍶化合物|藥名}} ⊕ 造骨細胞、⊖ 破骨細胞",
  "⊖ 破骨細胞：{{Calcitonin、Estrogen|藥名}}；Bisphosphonates（{{Zoledronic acid|藥名}}）；SERMs（{{Raloxifene|藥名}}）"
] });
dA(37, "與破骨細胞相關", 233, "estrogen-bone", "Estrogen（骨鬆）", "Estrogen", {
  cls: ["與破骨細胞相關：減少{{破骨細胞|名詞}}的活性"] });
mA("raloxifene", 233, { cls: ["骨鬆：作用在骨骼內的{{雌性素接受器|標的}}"], feat: ["副作用：熱潮紅、{{血栓靜脈炎|副作用}}"] });
dA(37, "與破骨細胞相關", 233, "calcitonin", "Calcitonin（抑鈣素）", "Calcitonin", {
  cls: ["與破骨細胞相關：抑制破骨細胞"],
  feat: ["有{{鼻噴劑|劑型}}劑型，副作用：鼻炎、鼻出血"] });
dA(37, "與破骨細胞相關", 233, "denosumab", "Denosumab", null, {
  cls: ["與破骨細胞相關：Denosumab 與 {{RANKL|標的}} 結合，使 RANKL 和破骨細胞無法結合"],
  feat: ["給藥頻率：{{六個月一次|名詞}}", "副作用：{{顎骨壞死|副作用}}"] });
dA(37, "雙磷酸鹽類", 233, "bisphosphonates", "Alendronate、Ibandronate、Zoledronic acid、Risedronate、Etidronate", "雙磷酸鹽", {
  cls: ["雙磷酸鹽類：直接抑制破骨細胞活性 → 抑制 {{Farnesyl pyrophosphate synthase|酵素}}"],
  feat: ["{{Zoledronic acid|藥名}} 可用於治療惡質高血鈣", "強度比較：{{Zoledronic acid > Risedronate >> Etidronate|藥名}}", "服用雙磷酸鹽類時，必需補充鈣，但{{不可以同時併服|性質}}", "生體可用率低，吸收皆不良，副作用：{{顎骨壞死|副作用}}", "服藥後上半身須直立至少 {{30|數值}} 分鐘，以減少藥物刺激", "雙磷酸鹽類為治療 {{Paget's disease|疾病}} 的第一線用藥"] });
dA(37, "與造骨細胞有關", 233, "teriparatide", "Teriparatide", null, {
  cls: ["與造骨細胞有關：減少造骨細胞{{凋亡|名詞}}"],
  feat: ["長期使用會導致破骨細胞活性增加，屬於 {{Parathyroid hormone|物質}} 製劑"] });
dA(37, "混和型", 233, "strontium-ranelate", "Strontium ranelate", null, {
  cls: ["混和型（抗破骨促造骨）：促進造骨細胞／抑制破骨細胞"] });
kA(37, "補充藥理考點", 233, "Vitamin D 活化與 Cinacalcet", [
  "Vitamin D 之活化先後順序：先經由{{肝臟|器官}}的 25-Hydroxylase，形成 25-OH Vitamin D；再藉由{{腎臟|器官}}的 1-Hydroxylase，形成 {{1,25-(OH)2 Vitamin D|物質}}（活性 D3）",
  "{{Cinacalcet|藥名}} 可以活化 calcium sensing receptor，抑制副甲狀腺分泌，治療副甲狀腺亢進"
]);

/* ===== 第 38 章 抗甲狀腺藥物 ===== */
chA(38, "38", "抗甲狀腺藥物", "234～237");
kA(38, "甲狀腺素合成與藥物", 234, "甲狀腺素合成步驟與抑制藥物（Katzung 圖）", { images: ["assets/amulet/fig/thyroid-synth.png"], table: { head: ["步驟", "機轉", "藥物"], rows: [
  [{ t: "攝取碘離子", b: true }, "競爭 {{Na+/I- Symporter|標的}}", "ClO4-、TcO4-、SCN-、BF4-"],
  [{ t: "碘離子轉為碘分子", b: true }, "抑制 {{Peroxidase|酵素}}", "PTU、MMI、Carbimazole"],
  [{ t: "碘化（Iodination）", b: true }, "抑制碘分子轉為 MIT、DIT", "PTU、MMI、Iodides（Lugol's solution）"],
  [{ t: "偶合（Coupling）", b: true }, "抑制 MIT+DIT→T3\n抑制 DIT+DIT→T4", "PTU、MMI"],
  [{ t: "蛋白質分解（Proteolysis）", b: true }, "抑制甲狀腺釋放 T3 及 T4", "Iodides（Lugol's solution）"],
  [{ t: "去碘", b: true }, "抑制 {{5'-deiodinase|酵素}}", "PTU、Iopanoic acid（放射線顯影劑）、β-blocker、Corticosteroids、Amiodarone"] ],
  note: "✓ {{Dopamine、Glucocorticoids|藥名}} 會抑制腦下垂體前葉分泌 TSH\n✓ PTU = Propylthiouracil；MMI = Methimazole；MIT = Monoiodotyrosine；DIT = diiodoTyrosine" } });
kA(38, "甲狀腺疾病", 235, "甲狀腺機能亢進與低下", { table: { head: ["", "甲狀腺機能亢進", "甲狀腺機能低下"], rows: [
  [{ t: "病名", b: true }, "葛瑞夫茲病（{{Graves's disease|疾病}}）", "橋本氏甲狀腺炎（{{Hashimoto's disease|疾病}}）"],
  [{ t: "病因", b: true }, "一種甲狀腺亢進症，會分泌抗體刺激 TSH 受體，造成 T3 和 T4 過度分泌", "甲狀腺之自體免疫破壞"],
  [{ t: "荷爾蒙", b: true }, "T3、T4 上升", "T4 下降、TSH 上升（初期甲狀腺會腫大）"],
  [{ t: "症狀", b: true }, "造成{{凸眼症|副作用}}、增加心跳速率、食慾增加、貧血、基礎代謝率增加", "小孩會造成{{呆小症|疾病}}、大人會造成{{黏液水腫|疾病}}"],
  [{ t: "治療", b: true }, "{{PTU、MMI、β-blocker、Iodides（Lugol's solution）|藥名}}", "T3、T4"] ] } });
dA(38, "甲狀腺素", 236, "levothyroxine", "T4（Levothyroxine）", "Levothyroxine", {
  cls: ["甲狀腺素"],
  feat: ["分布體積 10L；清除率 1.1L；鍵結數量 99.95%（多）", "半衰期 {{7 天|數值}}；作用強度{{小|性質}}；口服吸收 70%／pKa 6.7", "血漿蛋白結合率{{高|性質}}；排除：{{50% 尿液／50% 糞便|名詞}}", "治療甲狀腺機能低下、橋本氏甲狀腺炎、黏液水腫昏迷"] });
dA(38, "甲狀腺素", 236, "liothyronine", "T3（Liothyronine）", "Liothyronine", {
  cls: ["甲狀腺素"],
  feat: ["分布體積 {{40L（大）|數值}}；清除率 24L；鍵結數量 99.6%", "半衰期 {{1 天|數值}}；作用強度{{大|性質}}；口服吸收 95%／pKa 8.4", "血漿蛋白結合率低；排除：{{尿液|名詞}}"] });
kA(38, "T3 T4 比較", 236, "T3 T4 比較表", { table: { head: ["藥理", "T4（Levothyroxine）", "T3（Liothyronine）"], rows: [
  [{ t: "結構", b: true }, { t: "T4", img: "assets/amulet/fig/t4-struct.png" }, { t: "T3", img: "assets/amulet/fig/t3-struct.png" }],
  [{ t: "分布體積", b: true }, "10L", "40L（大）"],
  [{ t: "清除率", b: true }, "1.1L", "24L"],
  [{ t: "蛋白結合量", b: true }, "99.95%（多）", "99.6%"],
  [{ t: "半衰期", b: true }, "{{7 天|數值}}", "1 天"],
  [{ t: "作用強度", b: true }, "小", "{{大|性質}}"],
  [{ t: "口服吸收／pKa", b: true }, "70% ／6.7", "95% ／8.4"],
  [{ t: "血漿蛋白結合率", b: true }, "{{高|性質}}", "低"],
  [{ t: "排除", b: true }, "{{50%尿液／50%糞便|名詞}}", "尿液"],
  [{ t: "特色", b: true }, { t: "1. 治療甲狀腺機能低下、橋本氏甲狀腺炎、黏液水腫昏迷（T4 治療）\n2. {{Liotrix|藥名}} 是 T4 與 T3 以 {{4:1|數值}} 之比例混合而成\n3. 甲狀腺生合成的前驅物為 {{L-Tyrosine|物質}}\n4. 體內濃度：{{T4 > T3|名詞}}", cs: 2 }, null] ] } });
dA(38, "Thioamide", 237, "ptu", "Propylthiouracil（PTU）", "PTU", {
  cls: ["抑制 Peroxidase、碘化、偶合、抑制 {{5'-deiodinase|酵素}}"],
  struct: ["均含有 {{Thioamide|結構}}", "活性必需基團：{{N1 不接取代基|結構}}；增加活性：C6 接烷基"],
  feat: ["血中半衰期 {{75 分鐘|數值}}；作用強度 1；Onset {{快|性質}}；一天 1-4 次", "通過胎盤、乳汁濃度{{低|性質}}", "孕婦首選（{{懷孕前期|名詞}}可用）；可治療甲狀腺風暴", "副作用：{{肝毒性|副作用}}、類紅斑性狼瘡（Lupus-like syndrome）、顆粒性白血球缺乏（Agranulocytosis）"] });
dA(38, "Thioamide", 237, "methimazole", "Methimazole（MMI）", "MMI", {
  cls: ["抑制 Peroxidase、碘化、偶合（{{沒有抑制 5'-deiodinase|性質}}）"],
  feat: ["血中半衰期 {{4-6 小時|數值}}；作用強度 {{10|數值}}；Onset 慢；一天 1 次", "通過胎盤、乳汁濃度高；使用於{{懷孕後期|名詞}}", "副作用：{{再生不能性貧血|副作用}}（Aplastic anemia）、顆粒性白血球缺乏", "{{Carbimazole|藥名}} 在體內轉換為 Methimazole"] });
kA(38, "抗甲狀腺其他考點", 237, "Propylthiouracil（PTU）與 Methimazole（MMI）比較", { table: { head: ["", "Propylthiouracil（PTU）", "Methimazole（MMI）"], rows: [
  [{ t: "結構\n（均含有 Thioamide）", b: true }, "✓ 活性必需基團：N1 不接取代基\n✓ 增加活性：C6 接烷基", ""],
  [{ t: "機轉", b: true }, "抑制 Peroxidase、碘化、偶合、\n抑制 5'-deiodinase", "抑制 Peroxidase、碘化、偶合、\n（沒有抑制 5'-deiodinase）"],
  [{ t: "血中半衰期", b: true }, "{{75 分鐘|數值}}", "4-6 小時"],
  [{ t: "作用強度", b: true }, "1", "10"],
  [{ t: "Onset", b: true }, "{{快|性質}}", "慢"],
  [{ t: "給藥次數", b: true }, "一天 1-4 次", "一天 1 次"],
  [{ t: "通過胎盤", b: true }, "低", "高"],
  [{ t: "在乳汁的濃度", b: true }, "低", "高"],
  [{ t: "孕婦首選", b: true }, "✓（懷孕前期可用）", "使用於懷孕後期"],
  [{ t: "治療甲狀腺風暴", b: true }, "✓", ""],
  [{ t: "副作用", b: true }, "{{肝毒性|副作用}}\n類紅斑性狼瘡（Lupus-like syndrome）、\n{{顆粒性白血球缺乏（Agranulocytosis）|副作用}}", "再生不能性貧血（Aplastic anemia）、\n{{顆粒性白血球缺乏（Agranulocytosis）|副作用}}"] ],
  note: "其他考試重點：\n✧ Carbimazole 在體內轉換為 Methimazole\n✧ Thioamide（{{S=C-N|結構}}）為 Propylthiouracil、Methimazole 活性必須結構\n✧ 藥物作用之 onset 較慢，最少需{{四周|數值}}以上\n✧ 其他甲狀腺風暴用藥：Propylthiouracil、Propranolol、Iodides、類固醇、{{Acetaminophen|藥名}}（不使用 NSAID，因競爭甲狀腺球蛋白反而增加血中游離的 T3、T4）\n✧ 放射性碘 131I 特色：半衰期為 {{8 天|數值}}、治療甲狀腺癌、孕婦不可使用" } });

/* ===== 第 39 章 糖尿病藥物 ===== */
chA(39, "39", "糖尿病藥物", "238～244");
kA(39, "糖尿病藥物作用圖", 238, "血糖調節與藥物作用點（圖）", { images: ["assets/amulet/fig/diabetes-action.png"] });
kA(39, "糖尿病簡介", 239, "糖尿病簡介", { table: { cols: ["", "內容"], rows: [
  [{ t: "糖尿病簡介", b: true }, "1. 空腹及飯後兩小時的血糖值分別大於 {{126 / 200|數值}}\n2. HbA1c 大於 {{6.5%|數值}}，可反應長期（2-3 個月）血糖平均值"] ] } });
kA(39, "糖尿病簡介", 239, "致病原因分類", { table: { cols: ["類型", "內容"], rows: [
  [{ t: "Type 1 DM", b: true }, "幼年型糖尿病，血中胰島素濃度接近零，需以胰島素治療"],
  [{ t: "Type 2 DM", b: true }, "成年型糖尿病，組織對胰島素的作用產生{{阻抗|名詞}}或胰島素分泌不足所導致"],
  [{ t: "Type 3 DM", b: true }, "可能由藥物引起，像是服用類固醇、Diazoxide、Thiazide、Niacin、酒精（增加 Tolbutamide 代謝）"],
  [{ t: "Type 4 DM", b: true }, "又稱{{妊娠型|名詞}}糖尿病，發生在懷孕時，需以胰島素治療"] ] } });
kA(39, "糖尿病簡介", 239, "胰島細胞分類與 Glucose transporters", { table: { cols: ["", "內容"], rows: [
  [{ t: "Alpha cell", b: true }, "分泌 {{Glucagon|物質}}"],
  [{ t: "Beta cell", b: true }, "分泌 Insulin"],
  [{ t: "Delta cell", b: true }, "分泌 Somatostatin"],
  [{ t: "Epsilon cell", b: true }, "分泌 Ghrelin"],
  [{ t: "GLUT2", b: true }, "調節胰島素之釋放"],
  [{ t: "GLUT4", b: true }, "{{促使葡萄糖由細胞外（血液）進入細胞內的載體|名詞}}"],
  [{ t: "GLUT5", b: true }, "果糖的吸收"] ] } });
kA(39, "糖尿病簡介", 239, "Insulin 補充考點", [
  "1. Insulin receptor 具有 {{Tyrosine kinase|酵素}} 的活性",
  "2. 胰島素在體內會促進肌肉中的肝醣、蛋白質的合成以及增加{{脂肪組織中三酸甘油脂的儲存|名詞}}",
  "3. 由 {{51|數值}} 個胺基酸組成，A 鏈由 21 個胺基酸組成，B 鏈由 30 個胺基酸組成，其中 28 號位為 Proline，29 號位為 lysine",
  "4. 分子中含有 {{3|數值}} 個雙硫鍵，2 個 interchain（鏈間）和 1 個 intrachain（鏈內）",
  "5. 造成血糖上升的藥物：Somatostatin、Diazoxide、Niacin、Glucocorticoids、Hydrocholorthiazide",
  "6. 當糖尿病病人出現{{酮酸中毒|疾病}}現象時，應直接給予 Insulin"
]);
dA(39, "胰島素：控制飯後血糖", 240, "rapid-insulin", "Lispro、Aspart、Glulisine（速效）", "Lispro", {
  cls: ["速效胰島素：控制{{飯後血糖|名詞}}，作為餐前胰島素使用"],
  struct: ["Lispro：{{B28Lys、B29Pro|結構}}", "Aspart：{{B28Asp|結構}}", "Glulisine：B3Lys、B29Glu"],
  feat: ["外觀{{清澈|性質}}（可 IV）"] });
dA(39, "胰島素：控制飯後血糖", 240, "regular-insulin", "Regular insulin（短效）", "Regular insulin", {
  cls: ["短效胰島素：控制飯後血糖"],
  feat: ["外觀清澈（可 IV）", "與 {{Zn|物質}} 形成錯合物延長吸收時間", "皮下注射時，由{{六聚體|名詞}}解離成單體發揮藥效"] });
dA(39, "胰島素：控制空腹血糖", 240, "nph", "Neutral Protamine Hagedorn insulin（NPH，中效）", "NPH", {
  cls: ["中效胰島素：控制{{空腹血糖|名詞}}，作為基礎胰島素使用"],
  feat: ["外觀{{混濁|性質}}（不可 IV）", "含有魚精蛋白（{{Protamine|物質}}）及 Zn（鋅）的胰島素", "以 {{m-Cresol（甲酚）|物質}} 為防腐劑"] });
dA(39, "胰島素：控制空腹血糖", 240, "glargine-detemir", "Glargine、Detemir（長效）", "Glargine", {
  cls: ["長效胰島素：控制空腹血糖"],
  feat: ["外觀清澈（不可 IV）", "較無{{夜間低血糖|副作用}}的副作用", "Glargine 等電點接近 {{7|數值}}"] });
dA(39, "口服降血糖藥", 240, "alpha-glucosidase-inhibitors", "Acarbose、Voglibose、Miglitol", "Acarbose", {
  cls: ["{{α-Glucosidase inhibitors|藥物類別}}：阻斷 α-Glucosidase，使雙醣不被分解，即可降低血糖"] });
dA(39, "口服降血糖藥", 240, "sglt2-inhibitors", "Canagliflozin、Dapagliflozin", "Dapagliflozin", {
  cls: ["{{SGLT2 inhibitors|藥物類別}}（Sodium-Glucose co-transporter 2）：抑制葡萄糖再吸收，增加葡萄糖從尿中排出的量，達到降血糖的效果"] });
dA(39, "腸泌素相關", 240, "glp1", "Exenatide、Liraglutide", "Liraglutide", {
  cls: ["{{GLP-1|藥物類別}}（Glucagon-like peptide）：促進{{葡萄糖依賴性|名詞}}胰島素的分泌、減少升糖素（Glucagon）的分泌"] });
dA(39, "腸泌素相關", 240, "dpp4", "Sitagliptin、Saxagliptin", "Sitagliptin", {
  cls: ["{{DPP-4 inhibitors|藥物類別}}：可抑制 GLP-1 被代謝，增加 GLP-1 的作用時間"] });
dA(39, "促胰島素分泌", 240, "sulfonylurea", "Sulfonylurea（Tolbutamide、Chlorpropamide、Glipizide、Glyburide）", "Sulfonylurea", {
  cls: ["Sulfonylurea：抑制 {{K+ channel|標的}}，促進胰島素釋放"],
  feat: ["第一代：Tolbutamide、Chlorpropamide；第二代：{{Glipizide、Glyburide|藥名}}"] });
dA(39, "促胰島素分泌", 240, "meglitinide", "Repaglinide、Nateglinide", "Repaglinide", {
  cls: ["{{Meglitinide|藥物類別}}：抑制 K+ channel，促進胰島素釋放"] });
dA(39, "增加胰島素敏感性", 240, "metformin", "Metformin", null, {
  cls: ["{{Biguanides|藥物類別}}：活化 {{AMPK|酵素}}，抑制肝臟糖質新生作用"] });
dA(39, "增加胰島素敏感性", 240, "tzd", "Pioglitazone、Rosiglitazone", "Pioglitazone", {
  cls: ["Thiazolidinediones（TZD）：為 {{PPAR-γ agonist|藥物類別}}，可增加肌肉及脂肪組織對胰島素的敏感性"] });
dA(39, "其他", 240, "pramlintide", "Pramlintide", null, {
  cls: ["{{Amylin analogs|藥物類別}}：抑制升糖素的分泌"] });
mA("sulfonylurea", 241, {
  feat: ["Tolbutamide：作用時間{{最短|性質}}，適用於老年人 → 因 {{Toluene|結構}} 上的甲基易被氧化", "Chlorpropamide：{{半衰期最長|性質}} → 因苯環上 CH3 改為 {{Cl|結構}}，因此不易被代謝；易引起 {{Disulfiram reaction|副作用}}", "Glyburide：容易引起{{低血糖|副作用}}副作用，應避免用於年長者；屬於 2nd Sulfonylureas 藥物", "Glimepiride（Amaryl）主要經由 {{2C9|酵素}} 代謝"] });
mA("meglitinide", 241, {
  feat: ["Repaglinide：不屬於 Sulfonylurea 衍生物；腎功能不全者{{不須|性質}}調劑量", "Nateglinide：結構具有 {{Phenylalanine|結構}}；肝腎功能不全者不須調劑量；代謝：異丙基上形成雙鍵或加 OH（主要）"] });
mA("metformin", 241, {
  feat: ["副作用：腹瀉、體重減輕、消化不良、{{乳酸中毒|副作用}}、長期使用會影響 {{B12|物質}} 的吸收、接受顯影劑檢查宜暫停使用", "腎功能不全者（{{eGFR<30|數值}}）禁用，心衰竭患者不可使用"] });
mA("tzd", 241, {
  feat: ["副作用：肝毒、{{水腫|副作用}}（HF 患者不可用）、體重上升、骨質疏鬆", "{{Troglitazone|藥名}} 會造成肝毒性現已下架", "Rosiglitazone 會造成{{心毒性|副作用}}", "Fibrates 類藥物作用在 {{PPAR-α|標的}}"] });
dA(39, "其他", 242, "muraglitazar", "Muraglitazar", null, {
  cls: ["{{Glitazar|藥物類別}}"], feat: ["可同時降低{{血糖及三酸甘油脂|物質}}"] });
mA("alpha-glucosidase-inhibitors", 242, {
  feat: ["副作用：胃腸道{{脹氣、腹瀉|副作用}}", "{{隨餐|名詞}}服用（吃第一口時一起服用）", "Acarbose 含有 {{carvosine|結構}}"] });
mA("glp1", 242, {
  struct: ["Exenatide（{{39|數值}} 個胺基酸）；Lixisenatide（末端接上 6 個 lysine）；Albiglutide（以 {{albumin|物質}} 當載體）；Dulaglutide（接上 IgG4）；Liraglutide（結構具有 {{16|數值}} 碳脂肪酸）；Semaglutide（結構具有 18 碳脂肪酸）"],
  feat: ["此類藥品即是模擬 GLP-1 的胜肽序列達到控制血糖的作用", "GLP 分泌一段時間後會被 {{DPP-4|酵素}} 分解成無活性的代謝物", "{{胰臟炎|疾病}}患者不可使用"] });
mA("dpp4", 243, {
  cls: ["DPP-4（Dipeptidyl peptidase-4）本身是一種 {{Serine|名詞}} protease，抑制它可使 GLP-1 不被代謝，增加 GLP-1 的作用時間"],
  struct: ["Saxagliptin、Vildagliptin 含 {{Pyrrolidine|結構}}", "Saxagliptin 結構中不含 {{Nitro|結構}} 基團"] });
mA("sglt2-inhibitors", 243, { feat: ["副作用：尿中含糖量增加，所以增加{{泌尿道感染|副作用}}的機率"] });
mA("pramlintide", 243, { struct: ["此藥是將 Amylin 的胺基酸序列 {{25、28、29|數值}} 以 {{Proline|物質}} 置換而得"] });
kA(39, "DPP-IV 抑制劑總整理", 244, "DPP-IV 抑制劑總整理", { table: { head: ["", "Vildagliptin\n(Galvus)", "Sitagliptin\n(Januvia)", "Saxagliptin\n(Onglyza)", "Alogliptin\n(Nesina)", "Linagliptin\n(Tradjenta)"], rows: [
  [{ t: "生體可用率", b: true }, "{{90%|數值}}", "87%", "67%", "63%", "{{30%|數值}}"],
  [{ t: "血漿蛋白結合率", b: true }, "<10%", "38%", "<10%", "x", "{{70-80%|數值}}"] ],
  note: "✧ DPP-IV 屬於 {{Serine protease|酵素}}，Saxagliptin 之 {{CN|結構}} 可與之結合\n✧ Vildagliptin 結構含 {{aminoacylpyrrolidine|結構}}\n✧ Sitagliptin 結構含 {{6 個 F 及 Piperazine+Pyrazole|結構}}\n✧ Saxagliptin 結構含 aminoacylpyrrolidine，經 3A4 形成 {{5-OHSaxagliptin|物質}}\n✧ Alogliptin 結構含 {{Pyrimidine 及 CN|結構}}\n✧ Linagliptin 具 {{Xanthine|結構}}，Piperidine 與丁炔可增加對 DPP-IV 之親和力" } });

/* 講義第 245～251 頁（40. 鴉片類藥物）暫時沒有收錄。 */

/* ================= 發炎、腸胃與解毒島（41～47） ================= */
isleA("misc", "發炎、腸胃與解毒島", { ground: "#A9D3D6", light: "#C2E1E3", cliff: "#7AAEB2" });

/* ===== 第 41 章 前列腺素 ===== */
chA(41, "41", "前列腺素", "252～254");
kA(41, "前列腺素結構", 252, "前列腺素骨架與五元環", { images: ["assets/amulet/fig/pg-skeletons.png"], table: { head: ["雙鍵數目", "雙鍵位置"], rows: [
  [{ t: "1", b: true }, "13,14"],
  [{ t: "2", b: true }, "13,14、5,6"],
  [{ t: "3", b: true }, "13,14、5,6、17,18"] ],
  note: "共同特色：\n✧ PGE「2」表含有 {{2|數值}} 個雙鍵\n✧ 前列腺素均含有 {{C-15αOH|結構}}" } });
kA(41, "前列腺素結構", 252, "前列腺素比較", { table: { head: ["", "PGD2", "PGE1", "PGF2"], rows: [
  [{ t: "C-9", b: true }, "OH", "{{酮基|結構}}", "OH"],
  [{ t: "C-11", b: true }, "{{酮基|結構}}", "OH", "OH"] ] } });
kA(41, "前列腺素結構", 253, "前列腺素生合成（Katzung 圖）", { images: ["assets/amulet/fig/pg-biosynth.png"], points: [
  "由 Phospholipids 合成 PGI2 須經由 Phospholipase A2、Cyclooxygenase、Prostacyclin synthase",
  "由 Phospholipids 合成 TXA2 須經由 Phospholipase A2、Cyclooxygenase、Thromboxane synthase"
] });
kA(41, "白三烯素", 254, "白三烯素生合成", { images: ["assets/amulet/fig/leukotriene-synth.png"], points: [
  "5-lipoxygenase 催化 {{leukotrienes|物質}} 的生合成",
  "LTA4 受 glutathion-S-transferase 作用後，不會產生下列何種產物？\n(A) LTB4 (B) LTC4 (C) LTD4 (D) LTE4　選 {{A|名詞}}"
] });
dA(41, "白三烯素相關藥物", 254, "zileuton", "Zileuton", null, {
  cls: ["{{5-Lipoxygenase inhibitors|藥物類別}}"] });
dA(41, "白三烯素相關藥物", 254, "montelukast", "Zafirlukast、Montelukast", "Montelukast", {
  cls: ["{{Leukotriene receptor antagonists|藥物類別}}：阻斷 LTC4、LTD4、LTE4"],
  feat: ["用於{{氣喘|疾病}}"] });

/* ===== 第 42 章 非類固醇抗發炎藥 ===== */
chA(42, "42", "非類固醇抗發炎藥", "255～261");
kA(42, "NSAID 作用圖", 255, "花生四烯酸路徑與各產物作用（Katzung 圖）", [
  "Phospholipid —（Phospholipase A2，被 Glucocorticoids 抑制）→ Arachidonic acid",
  "Cyclooxygenase（COX-1、COX-2）：非選擇 COX 抑制劑 {{Aspirin|藥名}}；選擇性 COX-2 抑制劑 {{Celecoxib、Lumiracoxib|藥名}}",
  "COX → PGG2 —（Peroxidase）→ PGH2",
  "PGI2（Prostacyclin synthase）：血管擴張（保腎）、胃酸減少（保胃）、支氣管擴張（保氣管）、{{抑制血小板凝集|名詞}}、疼痛增強",
  "PGD2：血管擴張、抑制血小板凝集",
  "PGE2：血管擴張、胃酸減少、支氣管擴張、{{子宮收縮|名詞}}、體溫增加、疼痛增強",
  "PGF2α：血管收縮、支氣管收縮、子宮收縮、體溫增加",
  "TXA2（Thromboxane Synthase）：血管收縮（傷腎）、支氣管收縮（傷氣管）、{{促進血小板凝集|名詞}}",
  "5-Lipoxygenase（Zileuton 抑制）→ LTC4 → LTD4 → LTE4 誘發氣喘（Zafirlukast、Montelukast）；LTB4 → 吞噬細胞活化 → 發炎（秋水仙素 Colchicine）"
]);
dA(41, "前列腺素藥物", 256, "alprostadil", "Alprostadil（PGE1）", "Alprostadil", {
  cls: ["PGE1"],
  feat: ["用於{{陽痿|疾病}}、新生兒{{動脈導管暢通|名詞}}", "血管擴張、支氣管擴張、血小板凝集的抑制劑"] });
dA(41, "前列腺素藥物", 256, "misoprostol", "Misoprostol（PGE1 衍生物）", "Misoprostol", {
  cls: ["{{PGE1|物質}} 衍生物"],
  feat: ["可以抗{{胃酸|物質}}分泌、刺激子宮收縮"] });
dA(41, "前列腺素藥物", 256, "dinoprostone", "Dinoprostone（PGE2）", "Dinoprostone", {
  cls: ["{{PGE2|物質}}"],
  feat: ["血管擴張、減少胃酸分泌、支氣管擴張、子宮平滑肌收縮、體溫增加"] });
dA(41, "前列腺素藥物", 256, "dinoprost-carboprost", "Dinoprost、Carboprost（PGF2α）", "Carboprost", {
  cls: ["{{PGF2α|物質}}"],
  feat: ["子宮收縮、支氣管收縮、產熱、血管收縮"] });
dA(41, "前列腺素藥物", 256, "prostaglandin-glaucoma", "Bimatoprost、Latanoprost、Travoprost、Unoprostone", "Latanoprost", {
  cls: ["PGF2α 衍生物"],
  feat: ["可用於{{青光眼|疾病}}", "副作用：{{眼睫毛變長|副作用}}"] });
dA(41, "前列腺素藥物", 256, "epoprostenol", "Epoprostenol（PGI2）", "Epoprostenol", {
  cls: ["{{PGI2|物質}}"],
  feat: ["血管擴張、抑制胃酸分泌、擴張支氣管、血小板凝集抑制劑"] });
dA(41, "前列腺素藥物", 256, "iloprost-treprostinil", "Iloprost、Treprostinil（PGI2 衍生物）", "Iloprost", {
  cls: ["PGI2 衍生物"], feat: ["用於治療{{肺動脈高壓|疾病}}"] });
mA("montelukast", 256, { struct: ["以 {{Sulfonamide|結構}} 與 cysteinyl leukotriene 結合"] });
kA(41, "前列腺素結構", 256, "TXA2 與白三烯素作用", [
  "TXA2（血栓素 A2）：血管收縮、{{誘導血小板凝集|名詞}}、支氣管收縮",
  "LTB4：增加白血球的{{趨化性|名詞}}和凝集",
  "LTC4、LTD4、LTE4：支氣管收縮，是{{氣喘|疾病}}的致病因子之一"
]);
kA(42, "NSAID 藥理", 257, "NSAID 藥理作用", [
  "解熱：PGE2 為腦部中的熱原，會增加內生性熱原（{{interleukin-1|物質}}）的釋放；NSAID 防止 PGE2 的增加，達到解熱的作用",
  "鎮痛：前列腺素本身不會產生痛覺反應，但會{{加強|性質}}其他發炎物質造成的疼痛",
  "抗發炎：抑制 {{Cyclooxygenase|酵素}}，使前列腺素無法合成",
  "抗凝血：Aspirin 抑制 {{TXA2|物質}} 合成，可治療栓塞疾病，有心保護作用"
]);
kA(42, "NSAID 藥理", 257, "NSAID 副作用與 COX-2 抑制劑", [
  "傷胃：NSAID 本身為酸性（{{Nabumetone|藥名}} 為中性代謝後為酸性），會對胃造成直接的刺激；再者，NSAID 會抑制前列腺素合成，導致胃酸分泌，引起消化性胃潰瘍",
  "傷腎：{{PGE2 和 PGI2|物質}} 為血管擴張劑，NSAID 抑制腎臟前列腺素的合成，會導致腎臟血流量減少，引起腎衰竭",
  "其他副作用：造成氣喘、抑制血小板凝集、Aspirin 用在幼兒易引起 {{Reye's syndrome|疾病}}",
  "傳統的 NSAIDs 沒有選擇性，因此會同時抑制 COX-1、COX-2，容易造成腸胃道出血及腎臟血流量減少，因此發展出選擇性 COX-2 抑制劑",
  "選擇性 COX-2 抑制劑不易有傷胃的作用，但容易促進{{血小板凝集|名詞}}，造成動脈粥狀硬化的機會提高，病人容易有心臟病和中風的危險"
]);
kA(42, "COX-1 與 COX-2", 258, "COX-1 與 COX-2 比較", [
  "COX-1：{{生理型|名詞}}酵素 → 平時就存在於體內；生理功能：分泌黏液保護胃壁、維持腎臟功能、促進血小板凝集",
  "COX-2：{{誘發型|名詞}}酵素 → 當身體發炎或結腸直腸癌所誘發的酵素；生理功能：發燒、維持腎臟功能",
  "非選擇性 COX 抑制劑副作用：抑制胃黏液分泌 → 傷胃；減少腎臟血流量 → 傷腎；抑制血小板凝集 → 出血",
  "選擇性 COX-2 抑制劑：長期使用還是會傷腎及產生{{心血管|名詞}}副作用；較不會有腸胃道不適的副作用",
  "{{Arg120|結構}} 可與 NSAIDs 負離子以離子鍵結",
  "Tyr348、Val349、Tyr385、Trp387 可與 NSAID 的芳香環間以疏水鍵及凡得瓦爾鍵結合",
  "COX-2 有 {{Val434 & Val523|結構}}，而 COX-1 有 Ile434 & Ile523，因此使選擇性 COX-2 抑制劑無法進入 COX-1 allosteric site",
  "Aspirin 會在 COX-1 之 {{Serine|物質}} 上進行乙醯化，而造成不可逆的抑制作用，而其他 NSAIDs 為 COX 的可逆抑制劑"
]);
mA("aspirin-antiplatelet", 259, {
  cls: ["NSAID：水楊酸衍生物，以{{乙醯化|名詞}}行不可逆抑制 COX-1"],
  feat: ["Aspirin 代謝：{{COOH 接 Glycine|名詞}}（主要）、COOH 接 Glucuronide、OH 接 Glucuronide", "低劑量會抑制{{尿酸|物質}}排泄，痛風病人禁用", "可預防心肌梗塞", "{{氣喘|疾病}}患者禁用"] });
dA(42, "水楊酸衍生物", 259, "triflusal-diflunisal", "Triflusal、Diflunisal", "Diflunisal", {
  cls: ["NSAID：水楊酸衍生物"],
  feat: ["水楊酸衍生物：小兒不可用，會造成 {{Reye's syndrome|疾病}}"] });
dA(42, "芳香環乙酸類", 259, "indomethacin", "Indomethacin", null, {
  cls: ["NSAID：芳香環乙酸類"],
  feat: ["代謝：{{醯胺水解|名詞}}、COOH 加 Glucuronide、C5 脫甲基", "治療新生兒{{動脈導管閉鎖不全|疾病}}"] });
dA(42, "芳香環乙酸類", 259, "sulindac", "Sulindac", null, {
  cls: ["NSAID：芳香環乙酸類"],
  feat: ["本身為 {{Prodrug|名詞}}，還原成 {{Sulfide|物質}}（有活性）", "氧化成 Sulfone（無活性）"] });
dA(42, "芳香環乙酸類", 259, "diclofenac", "Diclofenac", null, {
  cls: ["NSAID：芳香環乙酸類"],
  feat: ["代謝：{{C4' 羥基化|名詞}}（主要）", "具有高脂溶性，有明顯的{{首渡效應|名詞}}"] });
dA(42, "芳香環乙酸類", 259, "tolmetin", "Tolmetin", null, {
  cls: ["NSAID：芳香環乙酸類"], feat: ["代謝：{{Benzylic oxidation|名詞}}"] });
dA(42, "芳香環乙酸類", 259, "nabumetone", "Nabumetone", null, {
  cls: ["NSAID：芳香環乙酸類"],
  feat: ["本身為 Prodrug，行 {{β-oxidation|名詞}} 後形成 6-Methoxy-2-Naphthylacetic acid（{{6-MNA|物質}}）", "NSAID 為 Prodrug：{{Nabumetone、Sulindac|藥名}}"] });
dA(42, "芳香環丙酸類", 260, "ibuprofen", "Ibuprofen", null, {
  cls: ["NSAID：芳香環丙酸類"], feat: ["代謝：{{ω-1|名詞}} 代謝", "有一個{{對掌中心|結構}}"] });
dA(42, "芳香環丙酸類", 260, "naproxen", "Naproxen", null, {
  cls: ["NSAID：芳香環丙酸類"],
  feat: ["Naproxen 是唯一以光學活性型 {{S(+)|結構}} 上市的 NSAID", "以光學活性異構物上市，具有 Chiral center", "與蛋白質結合力{{大|性質}}"] });
dA(42, "芳香環丙酸類", 260, "flurbiprofen", "Flurbiprofen", null, {
  cls: ["NSAID：芳香環丙酸類"], feat: ["代謝：{{C4' 接 OH|名詞}}"] });
dA(42, "N-arylanthranilic acid（苯胺酸）", 260, "mefenamic-acid", "Mefenamic acid", null, {
  cls: ["NSAID：{{N-arylanthranilic acid|結構}}（苯胺酸）"],
  feat: ["代謝：{{間位 CH3 接 OH|名詞}}、COOH 接 Glucuronide", "補充：{{Furosemide|藥名}} 亦含有 N-arylanthranilic acid 之架構"] });
dA(42, "Oxicams", 260, "piroxicam", "Piroxicam", null, {
  cls: ["Oxicams（Enolcarboxamides），均含有 {{Benzothiazine|結構}}"],
  feat: ["代謝：{{Pyridine|結構}} 對位接 OH（2C9）", "次要代謝物：{{糖精（Saccharin）|物質}}", "NSAID 中抗發炎{{最強、最長效|性質}}者"] });
dA(42, "Oxicams", 260, "meloxicam", "Meloxicam", null, {
  cls: ["Oxicams（Enolcarboxamides）"],
  feat: ["代謝：氧化 {{Thiazole|結構}} 上的甲基", "與 Piroxicam 的差別：含有 thiazole"] });
dA(42, "Pyrazolidinedione", 260, "phenylbutazone", "Phenylbutazone", null, {
  cls: ["NSAID：{{Pyrazolidinedione|結構}}"], feat: ["副作用：{{顆粒性白血球缺乏|副作用}}"] });
dA(42, "COX-2 Inhibitors", 261, "coxibs", "Parecoxib、Valdecoxib、Rofecoxib、Etoricoxib、Celecoxib、Lumiracoxib", "Celecoxib", {
  cls: ["{{COX-2 Inhibitors|藥物類別}}"],
  struct: ["Parecoxib、Valdecoxib 含 {{Isoxazole|結構}}；Rofecoxib 含 {{Lactone|結構}}；Etoricoxib 含 Pyridine；Celecoxib 含 {{Pyrazole|結構}}；Lumiracoxib 含 Phenyl"],
  feat: ["{{Lumiracoxib|藥名}} 對 COX-2 選擇性最高", "副作用：有{{心毒性|副作用}}", "較不會抑制血小板凝集、傷胃，但仍有{{腎毒性|副作用}}", "代謝：Celecoxib（{{2C9|酵素}}）氧化苯環上的甲基；Lumiracoxib 氧化形成 4'-Hydroxylumiracoxib", "雜環口訣：拿犀利（Cele）的刀劈肉（Pyrazole），怕（Pa）沒肉（Val），挨瘦（Isoxazole）；若非（Rof）富男（Furan）給糖（Lactone），一坨（Et）劈（Bipyridine）兩次"] });
dA(42, "解熱鎮痛藥", 261, "acetaminophen", "Acetaminophen", null, {
  cls: ["解熱鎮痛藥"],
  feat: ["代謝：小孩 {{O-Sulfate|名詞}} 和大人 O-glucuronide", "氧化（{{2E1|酵素}}）形成毒性代謝物 {{N-acetylimidoquinone|物質}}", "解毒劑：利用 {{Glutathione 及 N-acetylcysteine|藥名}} 之 SH 行 Conjugation 作用", "{{無抗發炎|性質}}的作用"] });

/* ===== 第 43 章 抗痛風藥物 ===== */
chA(43, "43", "抗痛風藥物", "262～263");
kA(43, "尿酸代謝與痛風", 262, "尿酸路徑與藥物作用點（Katzung 圖）", [
  "Hypoxanthine —（{{Xanthine oxidase|酵素}}）→ Xanthine —（Xanthine oxidase）→ Uric acid；減少尿酸合成：{{Allopurinol、Febuxostat|藥名}} 抑制",
  "Uric acid 經腎小管排除 → 尿液；增加尿酸排除：{{Probenecid、Sulfinpyrazone|藥名}}",
  "Uric acid —（{{Uricase|酵素}}）→ Allantoin（尿囊素）；增加尿酸降解：{{Pegloticase|藥名}}",
  "痛風的特徵是{{尿酸結晶|物質}}沉積在關節，而引起疼痛性關節炎",
  "治療方式：減少尿酸結晶鹽引起的發炎反應；抑制 Xanthine oxidase，減少尿酸合成；增加尿酸的排除；增加尿酸的溶解度"
]);
dA(43, "秋水仙素", 263, "colchicine", "Colchicine", null, {
  cls: ["秋水仙素：抑制{{嗜中性白血球|名詞}}吞噬作用"],
  feat: ["治療{{急性|性質}}痛風首選常併用 Indomethacin", "生合成：{{Phenylalanine + Tyrosine|物質}}"] });
dA(43, "增加尿酸排除", 263, "probenecid", "Probenecid", null, {
  cls: ["增加尿酸排除：抑制尿酸在{{腎小管|器官}}的再吸收"],
  feat: ["併用 {{Penicillin、MTX、Indomethacin|藥名}} 使腎排除下降，使上述藥物藥效上升"] });
dA(43, "增加尿酸排除", 263, "sulfinpyrazone", "Sulfinpyrazone", null, {
  cls: ["增加尿酸排除"],
  feat: ["還原為 {{sulfide|物質}} 只有抗血小板凝集的效果", "芳香環羥基生成對位酚基衍生物或將 S=O → O=S=O 代謝物則具有降尿酸活性"] });
dA(43, "增加尿酸排除", 263, "benzbromarone", "Benzbromarone", null, {
  cls: ["增加尿酸排除：抑制尿酸在腎小管的再吸收"] });
dA(43, "增加尿酸排除", 263, "lesinurad", "Lesinurad", null, {
  cls: ["增加尿酸排除：抑制尿酸在腎小管的再吸收"] });
dA(43, "抑制尿酸形成", 263, "allopurinol", "Allopurinol", null, {
  cls: ["抑制尿酸形成：抑制 {{Xanthine oxidase|酵素}}"],
  feat: ["併用 {{6-MP|藥名}} 時須將 6-MP 的劑量降低 {{75%|數值}}", "須檢測 {{HLA-B*5801|名詞}} 基因", "副作用：{{Steven-Johnson syndrome|副作用}}"] });
dA(43, "抑制尿酸形成", 263, "febuxostat", "Febuxostat", null, {
  cls: ["抑制尿酸形成：屬於{{非嘌呤類|性質}}選擇性非競爭型 Xanthine oxidase 抑制劑"],
  feat: ["{{慢性|性質}}痛風用藥"] });
dA(43, "增加尿酸代謝", 263, "pegloticase", "Pegloticase、Rasburicase", "Pegloticase", {
  cls: ["增加尿酸代謝：活化 {{Uricase|酵素}}"],
  feat: ["催化尿酸變成尿囊素（{{allantoin|物質}}），尿囊素溶解度更好，更易排泄"] });

/* ===== 第 44 章 抗組織胺藥物 ===== */
chA(44, "44", "抗組織胺藥物", "264～266");
kA(44, "組織胺簡介", 264, "組織胺簡介、受體與化學性質", [
  "是一種{{發炎反應|名詞}}的媒介物質；體內分布包括：肥大細胞的分泌顆粒、胃腸道、丘腦",
  "組織胺的合成：儲存於{{肥大細胞、嗜鹼性細胞|名詞}}",
  "H1（{{Gq|標的}}）：平滑肌、內皮；H2（{{Gs|標的}}）：胃黏膜、心肌、肥大細胞、腦；H3（Gi）：腦；H4（Gi）：嗜酸性球、嗜中性球",
  "Histidine 經{{脫羧|名詞}}形成 Histamine",
  "Nπ：較接近側鏈，為近端的（pros）N；Nτ：較遠離側鏈，為遠端的（tele）N",
  "選擇性：{{五號位|結構}}有甲基時，對 H1 作用消失，僅剩 H2 的作用",
  "拮抗：雜環到氮加至{{四個|數值}}原子距，對組織胺受體產生拮抗作用"
]);
kA(44, "第一代 H1-blocker", 265, "第一代 H1-blocker 結構分類", [
  "一代抗組織胺可用於{{動暈症|疾病}}：Diphenhydramine、Meclizine、Promethazine",
  "Aminoalkyl Ethers（{{Ethanol amines|結構}}）：代表藥 Diphenhydramine；Doxylamine、Clemastine、Setastine、Carbinoxamine；鎮靜、抗膽鹼、抗動暈；{{Dimenhydrinate|藥名}} = Diphenhydramine + 8-Chlortheophyllinate",
  "{{Ethylenediamines|結構}}（el,il,yl；例外：Doxylamine）：代表藥 Tripelennamine；Pyrilamine、Thonzylamine、Antazoline；胃腸道副作用",
  "{{Propylamines|結構}}（ir,pro,but）：代表藥 Pheniramine；Pyrrobutamine、Triprolidine、Phenindamine；強抗組織胺；Phenindamine 睡前服用會造成{{失眠|副作用}}",
  "{{Piperazines|結構}}（Cyclizines，-clizine）：代表藥 Cyclizine、Hydroxyzine；Meclizine；抗動暈、致畸形胎；Hydroxyzine 氧化代謝成 {{Cetirizine|藥名}}",
  "{{Phenothiazines|結構}}（-thazine）：代表藥 Promethazine；Trimeprazine、Methdilazine；鎮靜、抗膽鹼、抗動暈",
  "{{Dibenzocycloheptenes|結構}}（-tadine）：代表藥 Cyproheptadine；Azatadine；有抗血清素的作用，可緩解 Serotonin syndrome 及刺激食慾的作用",
  "carbinoxamine、clemastine 及 setastine 的共同結構：{{ethanolamine ether|結構}}"
]);
dA(44, "第一代 H1-blocker", 265, "diphenhydramine", "Diphenhydramine", null, {
  cls: ["第一代 H1-blocker：Aminoalkyl Ethers（Ethanol amines）"],
  feat: ["{{鎮靜、抗膽鹼、抗動暈|副作用}}", "Dimenhydrinate = Diphenhydramine + {{8-Chlortheophyllinate|物質}}"] });
dA(44, "第一代 H1-blocker", 265, "tripelennamine", "Tripelennamine", null, {
  cls: ["第一代 H1-blocker：{{Ethylenediamines|結構}}"], feat: ["{{胃腸道|名詞}}副作用"] });
dA(44, "第一代 H1-blocker", 265, "pheniramine", "Pheniramine", null, {
  cls: ["第一代 H1-blocker：{{Propylamines|結構}}"], feat: ["強抗組織胺"] });
dA(44, "第一代 H1-blocker", 265, "cyclizine-hydroxyzine", "Cyclizine、Hydroxyzine、Meclizine", "Hydroxyzine", {
  cls: ["第一代 H1-blocker：{{Piperazines（Cyclizines）|結構}}"],
  feat: ["抗動暈、{{致畸形胎|副作用}}", "Hydroxyzine 氧化代謝成 {{Cetirizine|藥名}}"] });
dA(44, "第一代 H1-blocker", 265, "promethazine", "Promethazine", null, {
  cls: ["第一代 H1-blocker：{{Phenothiazines|結構}}"], feat: ["鎮靜、抗膽鹼、抗動暈"] });
mA("cyproheptadine", 265, {
  cls: ["第一代 H1-blocker：{{Dibenzocycloheptenes|結構}}（-tadine）"],
  feat: ["有抗血清素的作用，可緩解 {{Serotonin syndrome|副作用}} 及刺激食慾的作用"] });
kA(44, "第二代 H1-blocker", 266, "第二代 H1-blocker", [
  "第二代 H1-blocker 因{{極性大|性質}}，較不易穿透 BBB，鎮靜作用較小"
]);
dA(44, "第二代 H1-blocker", 266, "terfenadine-fexofenadine", "Terfenadine、Fexofenadine", "Fexofenadine", {
  cls: ["第二代 H1-blocker"],
  struct: ["Terfenadine（R=CH3）、Fexofenadine（R={{COOH|結構}}）"],
  feat: ["Terfenadine 造成致命性{{心律不整|副作用}} → 代謝為 Fexofenadine 副作用較小", "經由 {{CYP3A4|酵素}} 氧化代謝為 Fexofenadine"] });
dA(44, "第二代 H1-blocker", 266, "ebastine", "Ebastine、Carebastine", "Ebastine", {
  cls: ["第二代 H1-blocker"],
  struct: ["Ebastine（R=CH3）、Carebastine（R=COOH）"],
  feat: ["氧化代謝為 {{Carebastine|物質}}"] });
dA(44, "第二代 H1-blocker", 266, "loratadine", "Loratadine、Desloratadine", "Loratadine", {
  cls: ["第二代 H1-blocker"],
  struct: ["Desloratadine（R=H）、Loratadine（R=COOCH2CH3）"],
  feat: ["Loratadine 的活性代謝物為 {{N 上脫烷基|名詞}}"] });
dA(44, "第二代 H1-blocker", 266, "astemizole", "Astemizole", null, {
  cls: ["第二代 H1-blocker"], feat: ["會造成致命性{{心律不整|副作用}}"] });
dA(44, "第二代 H1-blocker", 266, "acrivastine", "Acrivastine", null, {
  cls: ["第二代 H1-blocker"], struct: ["Acri- {{Acrylic acid|結構}}（丙烯酸）"] });
dA(44, "第二代 H1-blocker", 266, "cetirizine", "Cetirizine", null, {
  cls: ["第二代 H1-blocker"], feat: ["{{Hydroxyzine|藥名}} 氧化代謝成 Cetirizine"] });
dA(44, "預防用藥", 266, "khellin", "Khellin", null, {
  cls: ["預防用藥：抑制組織胺釋放即{{穩定肥大細胞|名詞}} → 不會直接作用在氣管平滑肌引起放鬆"],
  struct: ["具有 {{Furanochromone|結構}}"],
  feat: ["產生過敏症狀服用本類藥物{{無效|性質}}"] });
dA(44, "預防用藥", 266, "cromolyn", "Cromolyn", null, {
  cls: ["預防用藥：穩定肥大細胞 → 不會直接作用在氣管平滑肌引起放鬆"],
  struct: ["結構屬於 {{bischromones|結構}}"] });
dA(44, "預防用藥", 266, "pemirolast", "Pemirolast", null, {
  cls: ["預防用藥：穩定肥大細胞"],
  struct: ["以 {{Tetrazole|結構}} 取代羧酸之組織胺釋放抑制劑"] });

/* ===== 第 45 章 與胃酸分泌有關的藥物 ===== */
chA(45, "45", "與胃酸分泌有關的藥物", "267～270");
kA(45, "胃酸分泌", 267, "壁細胞胃酸分泌與藥物作用點", [
  "Histamine → {{H2（Gs）|標的}} → 活化 adenylyl cyclase → cAMP↑ → 胃酸分泌增加；被 {{Cimetidine|藥名}} 阻斷",
  "Gastrin → Gastrin receptor、Ach → M：{{Gq|標的}} → 活化 Phospholipase C → PIP2 變為 DAG+IP3 → 細胞內 Ca2+ 增加 → 胃酸分泌增加",
  "PGE、PGI2 → PG receptor（PG-R）：{{Gi|標的}} → 抑制 Adenylyl cyclase → cAMP↓ → 減少胃酸分泌；{{Misoprostol|藥名}} 增強",
  "cAMP↑、Ca2+ → Protein kinase → 質子幫浦（pump）分泌胃酸 H+、換入 K+；被 {{Omeprazole|藥名}} 抑制"
]);
dA(45, "制酸劑", 268, "antacids", "Al(OH)3、NaHCO3、Mg(OH)2、CaCO3", "制酸劑", {
  cls: ["{{制酸劑|藥物類別}}"],
  feat: ["會造成便祕：{{Al(OH)3|藥名}}", "會造成腹瀉：{{Mg(OH)2|藥名}}"] });
dA(45, "Proton pump inhibitors（PPI）", 268, "omeprazole", "Omeprazole", null, {
  cls: ["Proton pump inhibitors（PPI）：{{不可逆|性質}}抑制質子幫浦"],
  struct: ["Prazole = {{Pyridine + Imidazole|結構}}", "具 Chiral center，以{{硫（S）|結構}}為中心"],
  feat: ["治療 {{Zollinger-Ellison|疾病}} 的首選藥物", "為 Prodrug，在酸中可轉為活性態（S=O → S-OH）→ 以 {{thiol|結構}} 的形式與質子幫浦形成雙硫鍵", "在{{腸道|器官}}吸收，不是在胃吸收", "半衰期短（1.5hr），但抑制胃酸分泌的有效時間長（24hr）", "為 {{CYP2C19|酵素}} 抑制劑；代謝：CYP2C19 hydroxylation（主要）、CYP3A4 sulfoxidation、CYP2C19 O-demethylation", "幽門螺旋桿菌三藥組合法 → Amoxicillin + Clarithromycin + Omeprazole", "S-form 為 {{Esomeprazole|藥名}}（Nexium 耐適恩）", "為弱鹼藥物，不具耐酸性，與食物併服會降低生體可用率，需{{空腹|名詞}}服用（飯前一小時）", "藥物誘發的胃潰瘍，PPI 為首選藥"] });
dA(45, "Proton pump inhibitors（PPI）", 268, "lansoprazole", "Lansoprazole（Takepron 泰克胃通）", "Lansoprazole", {
  cls: ["Proton pump inhibitors（PPI）"],
  feat: ["代謝：O-去 CH3，芳香環氧化，{{Sulfoxidation|名詞}}"] });
dA(45, "Proton pump inhibitors（PPI）", 268, "pantoprazole", "Pantoprazole", null, {
  cls: ["Proton pump inhibitors（PPI）"],
  struct: ["具有 {{difluoromethoxy|結構}}"],
  feat: ["藥物交互作用較{{小|性質}}"] });
mA("pirenzepine", 268, { cls: ["{{M1-antagonist|藥物類別}}：可用於降低胃酸分泌"] });
kA(45, "PPI 結構", 269, "Proton pump 抑制劑結構比較（X／R1／R3／R2／R4）", [
  "Omeprazole：CH／OCH3／CH3／CH3／CH3；Esomeprazole（{{S-form|結構}}）同 Omeprazole",
  "Tenatoprazole：X 為 {{N|結構}}；其餘同 Omeprazole",
  "Pantoprazole：CH／{{OCHF2|結構}}／CH3／OCH3／H",
  "Lansoprazole：CH／H／{{CH2CF3|結構}}／CH3／H；Dexlansoprazole（{{R-form|結構}}）同 Lansoprazole",
  "Rabeprazole：CH／H／{{(CH2)3OCH3|結構}}／CH3／H"
]);
dA(45, "黏膜保護劑", 270, "sucralfate", "Sucralfate", null, {
  cls: ["黏膜保護劑（在潰瘍部位形成保護膜）"],
  struct: ["含鋁的有機鹽，具有{{雙糖|結構}}結構"],
  feat: ["副作用：{{便祕|副作用}}（鋁會造成便祕）"] });
dA(45, "黏膜保護劑", 270, "bismuth-subsalicylate", "Bismuth Subsalicylate", null, {
  cls: ["黏膜保護劑"],
  feat: ["Bismuth 具有保護胃壁及{{抗菌|名詞}}作用，經糞便排除", "Salicylate 可抑制{{前列腺素|物質}}的分泌，由胃吸收"] });
mA("misoprostol", 270, {
  struct: ["iso-異位，原 {{15αOH → 16βOH|結構}}"],
  feat: ["用於避免 {{NSAID|藥物類別}} 造成之胃潰瘍", "可刺激子宮收縮作為墮胎藥"] });
dA(45, "H2-blockers", 270, "cimetidine", "Cimetidine", null, {
  cls: ["{{H2-blockers|藥物類別}}"],
  struct: ["Im-{{imidazole|結構}}，Ci-{{Cyano|結構}}，具 Guanidine"],
  feat: ["{{CYP 酵素抑制劑|名詞}}", "副作用：{{陽痿、男性女乳症|副作用}}"] });
dA(45, "H2-blockers", 270, "ranitidine", "Ranitidine", null, {
  cls: ["H2-blockers"], struct: ["記憶：Ran-{{furan|結構}}，ni-{{nitro|結構}}"] });
dA(45, "H2-blockers", 270, "nizatidine", "Nizatidine", null, {
  cls: ["H2-blockers"],
  struct: ["N-az+i-thi = {{thiazole|結構}}，Ni-nitromethylene"],
  feat: ["{{生體可用率最高|性質}} → niza-念起來像你吃，可以吃即生體可用率高"] });
dA(45, "H2-blockers", 270, "famotidine", "Famotidine", null, {
  cls: ["H2-blockers"],
  struct: ["Fa-Sulfa = {{SO2NH2|結構}}"],
  feat: ["{{效價最強|性質}} famo-即魔法，魔法效果很強"] });

/* ===== 第 46 章 止吐劑／止瀉劑／瀉劑／腸胃蠕動劑 ===== */
chA(46, "46", "止吐劑／止瀉劑／瀉劑／腸胃蠕動劑", "271～274");
kA(46, "止吐劑", 271, "止吐劑總覽", [
  "與嘔吐有關的神經傳遞物質有{{多巴胺、血清素、組織胺、P 物質、乙醯膽鹼|物質}}，其阻斷劑則具有止吐的作用"
]);
dA(46, "止吐劑", 271, "domperidone", "Domperidone", null, {
  cls: ["{{D2-antagonist|藥物類別}}"],
  feat: ["可加速餐後{{胃排空|名詞}}", "副作用：促進{{催乳素|物質}}的分泌"] });
mA("ondansetron", 271, { feat: ["可用於懷孕時引起的噁心嘔吐，但{{非主要|性質}}治療孕吐之藥物"] });
mA("metoclopramide", 271, { feat: ["屬於止吐劑，作用在中樞神經之 {{chemoreceptor trigger zone|名詞}}"] });
dA(46, "止吐劑", 271, "aprepitant", "Aprepitant（口服）、Fosaprepitant（IV）", "Aprepitant", {
  cls: ["{{Substance P/Neurokinin-1 antagonist|藥物類別}}"],
  feat: ["用於治療{{化療後|名詞}}的嘔吐"] });
mA("diphenhydramine", 271, { cls: ["止吐劑：{{H1-antagonist|藥物類別}}"] });
mA("scopolamine", 271, { feat: ["止吐劑（M-antagonist）：可用於治療動暈症；具{{貼片|劑型}}劑型"] });
dA(46, "瀉劑", 272, "stimulant-laxatives", "Bisacodyl、Sennoside（Senna）、Castor oil", "Senna", {
  cls: ["{{刺激性|名詞}}瀉劑"],
  feat: ["Caster oil 不可用在{{孕婦|族群}}，會引起子宮收縮", "Senna 與含有 docusate 的軟便劑合用，可用於治療{{鴉片類|藥物類別}}藥物引發之便秘"] });
dA(46, "瀉劑", 272, "osmotic-laxatives", "MgO、Mg(OH)2、Lactulose、Polyethylene Glycol（PEG）", "Lactulose", {
  cls: ["{{滲透壓性|名詞}}瀉劑"],
  feat: ["{{Lactulose|藥名}} 用於治療便秘、肝性腦病變（因可排除體內的 {{NH3|物質}}）", "Mg(OH)2 副作用：腹瀉"] });
dA(46, "瀉劑", 272, "bulk-laxatives", "Methylcellulose、車前子", "Methylcellulose", {
  cls: ["{{膨脹型|名詞}}瀉劑"], feat: ["臥床病人需慎用，可能造成{{腸阻塞|副作用}}"] });
dA(46, "瀉劑", 272, "stool-softeners", "Glycerin、Mineral oil、Paraffin", "Mineral oil", {
  cls: ["{{軟便劑|藥物類別}}"], feat: ["長期使用會影響{{脂溶性維生素|物質}}或藥物吸收"] });
dA(46, "瀉劑", 272, "lubiprostone", "Lubiprostone", null, {
  cls: ["屬於{{氯離子通道|標的}}活化劑"] });
dA(46, "止瀉劑", 273, "kaopectin", "Kaopectin", null, {
  cls: ["{{吸附劑|藥物類別}}：吸附細菌、毒素"],
  feat: ["避免同時服用其他藥物而影響其吸收", "Kaopectin = {{Kaolin + Pectin|物質}}"] });
mA("bile-acid-resins", 273, { cls: ["止瀉劑：膽酸結合樹脂"] });
dA(46, "止瀉劑", 273, "loperamide", "Loperamide", null, {
  cls: ["{{μ-agonist|藥物類別}}"],
  feat: ["不會影響 CNS，僅作用在周邊（因會被 {{P-gp|標的}} 排除）"] });
dA(46, "止瀉劑", 273, "diphenoxylate", "Diphenoxylate", null, {
  cls: ["μ-agonist"], feat: ["常併用 {{Atropine|藥名}} 防止濫用"] });
mA("octreotide", 273, { feat: ["止瀉劑（Somatostatin analog）：治療糖尿病、化療、放射線引起之腹瀉；副作用：膽結石（最常見）、{{心跳徐緩|副作用}}"] });
mA("bismuth-subsalicylate", 273, { feat: ["副作用：{{黑便|副作用}}"] });
mA("tegaserod", 274, { feat: ["促進腸胃蠕動劑：用於治療{{便秘型刺激性腸道症候群|疾病}}"] });
mA("cisapride", 274, { feat: ["促進腸胃蠕動劑：易引起{{心律不整|副作用}}的副作用，現已下架"] });
mA("metoclopramide", 274, { feat: ["具雙重機轉：{{5-HT4 agonist + D2 antagonist|藥物類別}}"] });
dA(46, "促進腸胃蠕動劑", 274, "bethanechol", "Bethanechol", null, {
  cls: ["{{M3-agonist|藥物類別}}"],
  feat: ["可增加腸胃蠕動、可用於手術後{{尿液滯留|疾病}}"] });
mA("neostigmine", 274, { feat: ["促進腸胃蠕動劑（AchE Inhibitor）：可用於治療重症肌無力、促進腸胃蠕動"] });
mA("erythromycin", 274, { cls: ["促進腸胃蠕動劑：{{Motilin receptor agonist|藥物類別}}"], feat: ["用於治療{{糖尿病|疾病}}造成的胃輕癱"] });

/* ===== 第 47 章 解毒劑 ===== */
chA(47, "47", "解毒劑", "275～277");
dA(47, "重金屬及螯合劑", 275, "deferoxamine", "Deferoxamine（IV）、Deferasirox（口服）", "Deferoxamine", {
  cls: ["{{鐵|物質}}中毒的螯合劑"],
  feat: ["鐵中毒症狀：腸胃道症狀、{{凝血異常|副作用}}"] });
dA(47, "重金屬及螯合劑", 275, "dimercaprol-succimer", "Succimer（DMSA）、Dimercaprol（BAL）、Unithiol（DMPS）", "Dimercaprol", {
  cls: ["{{汞、砷、鉛|物質}}中毒的螯合劑"],
  feat: ["Succimer（PO）：{{水溶性高|性質}}，與金屬螯合後，可快速由尿液排除", "Dimercaprol（British anti-lewisite，IM）：{{脂溶性高|性質}}，IM 給藥，副作用：{{高血壓|副作用}}", "Unithiol（Dimercaptopropanesulfonic acid，DMPS）（IV/PO）"] });
dA(47, "重金屬及螯合劑", 275, "edta", "Edetate calcium disodium（EDTA）（IV）", "EDTA", {
  cls: ["{{鉛|物質}}中毒的螯合劑"],
  feat: ["鉛中毒：神經系統病變（中樞神經、周邊神經）；腸胃問題、{{溶血性貧血|副作用}}"] });
mA("penicillamine", 275, {
  struct: ["{{D-dimethylcysteine|結構}}（PO）"],
  feat: ["汞、銅、鉛中毒的螯合劑", "Wilson's disease：血液中銅離子少、腦和內臟銅離子多；治療藥物：{{Penicillamine|藥名}}（首選）、Zinc acetate（口服）、Trientine hydrochloride"] });
dA(47, "重金屬及螯合劑", 275, "dtpa", "Calcium disodium diethylenetriaminepentaacetic acid", "DTPA", {
  cls: ["{{鈾|物質}}中毒的螯合劑"] });
dA(47, "重金屬及螯合劑", 275, "prussian-blue", "Prussian blue（PO）", "Prussian blue", {
  cls: ["{{銫、鉈|物質}}中毒的解毒劑"] });
kA(47, "金屬中毒症狀", 275, "汞、砷中毒症狀", [
  "急性汞中毒常因汞{{蒸氣|物質}}（無機汞）引起，化學性肺炎、肺水腫",
  "慢性汞中毒常因{{甲基汞|物質}}（有機汞）引起，易引發感覺異常、動作、聽力及言語障礙",
  "砷中毒：週邊神經病變（感覺遲鈍）、週邊血管疾病（門脈高血壓）、{{癌症、烏腳病|疾病}}"
]);
kA(47, "器官毒性與解毒劑", 276, "器官毒性與解毒劑", [
  "肝毒性：Acetaminophen → {{N-Acetylcysteine|藥名}}；甲醇 → {{Ethanol、Fomepizole|藥名}}",
  "心毒性：Doxorubicin → {{Dexrazoxane|藥名}}",
  "肺毒性：{{Bleomycin、Busulfan、Amiodarone|藥名}} → 無",
  "腎毒性：Amioglycoside、Amphotericin B、NSAIDs → 無",
  "腎毒性：Cisplatin → 生理食鹽水、Mannitol、{{Amifostine|藥名}} 可預防腎毒性",
  "腎毒性：Cyclophosphamide → 代謝物 {{Acrolein|物質}} 會造成膀胱出血，以 {{Mesna|藥名}} 治療"
]);
kA(47, "常見藥物中毒解毒劑", 277, "常見藥物中毒解毒劑", [
  "Isoniazid → {{Vitamin B6|藥名}}（預防神經毒性）",
  "Methotrexate → {{Leucovorin|藥名}}",
  "Physostigmine → {{Atropine|藥名}}",
  "Organophosphate → Atropine + {{Pralidoxime（2-PAM）|藥名}}",
  "Theophylline、Caffeine、Metaproterenol → {{Esmolol|藥名}}",
  "β-blocker → {{Glucagon|藥名}}",
  "Benzodiazepine → {{Flumazenil|藥名}}",
  "氰化物中毒 → {{Sodium nitrite、Sodium thiosulfate、Hydroxocobalamin|藥名}}",
  "Digoxin → {{Digoxin immune Fab|藥名}}、Class Ib（Lidocaine、Phenytoin）",
  "Warfarin → {{Vitamin K|藥名}}；Heparin → {{Protamine|藥名}}",
  "Dabigatran → {{Idarucizumab|藥名}}；Rivaroxaban → {{Andexanet alfa|藥名}}",
  "Morphine → {{Naloxone（IV）、Naltrexone（PO）|藥名}}"
]);

/* 結構圖：從講義照片剪下（assets/amulet/），只收講義結構欄的印刷結構式；手寫標註與結構重疊的部分無法去除。 */
const AM_IMG = {"amantadine": 1, "rimantadine": 1, "ribavirin": 1, "oseltamivir": 1, "zanamivir": 1, "peramivir": 1, "zidovudine": 1, "stavudine": 1, "zalcitabine": 1, "lamivudine": 1, "emtricitabine": 1, "didanosine": 1, "abacavir": 1, "tenofovir": 1, "nevirapine": 1, "efavirenz": 1, "delavirdine": 1, "ritonavir": 1, "indinavir": 1, "raltegravir": 1, "enfuvirtide": 1, "maraviroc": 1, "acyclovir": 1, "penciclovir": 1, "ganciclovir": 1, "cidofovir": 1, "foscarnet": 1, "fomivirsen": 1, "idoxuridine": 1, "trifluridine": 1, "vidarabine": 1, "tenofovir-disoproxil": 1, "adefovir-dipivoxil": 1, "boceprevir": 1, "mechlorethamine": 1, "cyclophosphamide": 1, "ifosfamide": 1, "melphalan": 1, "chlorambucil": 1, "carmustine": 1, "lomustine": 1, "thiotepa": 1, "busulfan": 1, "cisplatin": 1, "carboplatin": 1, "oxaliplatin": 1, "dacarbazine": 1, "temozolomide": 1, "procarbazine": 1, "methotrexate": 1, "fluorouracil": 1, "tegafur-capecitabine": 2, "cytarabine": 1, "gemcitabine": 1, "decitabine-azacitidine": 2, "mercaptopurine": 1, "thioguanine": 1, "fludarabine": 1, "nelarabine": 1, "pentostatin": 1, "hydroxyurea": 1, "dactinomycin": 1, "doxorubicin": 2, "mitoxantrone": 1, "plicamycin": 1, "mitomycin": 1, "bleomycin": 1, "paclitaxel": 1, "docetaxel": 1, "cabazitaxel": 1, "vinblastine": 1, "vincristine": 1, "ixabepilone": 1, "eribulin": 1, "estramustine": 1, "etoposide-teniposide": 1, "topotecan": 1, "irinotecan": 1, "trabectedin": 1, "inotuzumab-ozogamicin": 1, "lenalidomide": 1, "pomalidomide": 1, "romidepsin": 1, "belinostat": 1, "vorinostat": 1, "panobinostat": 1, "cyclosporine": 1, "tacrolimus": 1, "sirolimus-everolimus": 2, "mycophenolate-mofetil": 1, "azathioprine": 1, "leflunomide": 1, "thalidomide": 1, "fosfomycin": 1, "cycloserine": 1, "penicillin-g": 1, "methicillin": 1, "nafcillin": 1, "penicillin-v": 1, "ampicillin": 1, "amoxicillin": 1, "oxacillin": 1, "dicloxacillin": 1, "carbenicillin": 1, "ticarcillin": 1, "azlo-mezlo-piperacillin": 3, "cephalexin": 1, "cefadroxil": 1, "cephradine": 1, "cefazolin": 1, "cefaclor": 1, "cefuroxime": 1, "cefamandole": 1, "cefonicid": 1, "cefoxitin": 1, "cefotetan-cefmetazole": 2, "ceftazidime": 1, "cefoperazone": 1, "cefotaxime": 1, "ceftriaxone": 1, "ceftizoxime": 1, "cefixime": 1, "ceftibuten": 1, "moxalactam": 1, "cefpirome-cefepime": 2, "ceftaroline": 1, "clavulanic-acid": 1, "sulbactam": 1, "tazobactam": 1, "thienamycin": 1, "imipenem": 1, "meropenem": 1, "aztreonam": 1, "vancomycin": 1, "teicoplanin": 1, "streptomycin": 1, "neomycin": 1, "paromomycin": 1, "kanamycin": 1, "amikacin": 1, "tobramycin": 1, "gentamicin": 1, "sisomicin": 1, "netilmicin": 1, "spectinomycin": 1, "tetracycline": 1, "rolitetracycline": 1, "oxytetracycline": 1, "demeclocycline": 1, "doxycycline": 1, "minocycline": 1, "tigecycline": 1, "erythromycin": 1, "clarithromycin": 1, "azithromycin": 1, "troleandomycin": 1, "telithromycin": 1, "fidaxomicin": 1, "quinupristin-dalfopristin": 1, "lincomycin": 1, "clindamycin": 1, "chloramphenicol": 1, "linezolid": 1, "retapamulin": 1, "mupirocin": 1, "nalidixic-acid": 1, "ciprofloxacin": 1, "ofloxacin": 1, "levofloxacin": 1, "gatifloxacin": 1, "gemifloxacin": 1, "moxifloxacin": 1, "sulfamethoxazole": 1, "sulfisoxazole": 1, "sulfamethizole": 1, "sulfadiazine": 1, "mafenide": 1, "silver-sulfadiazine": 1, "sulfacetamide": 1, "sulfasalazine": 1, "sulfadoxine": 1, "trimethoprim": 1, "nitrofurantoin": 1, "methenamine": 1, "dapsone": 1, "terbinafine": 1, "ketoconazole": 1, "clotrimazole": 1, "itraconazole": 1, "fluconazole": 1, "voriconazole": 1, "amphotericin-b": 1, "nystatin": 1, "caspofungin": 1, "anidulafungin": 1, "flucytosine": 1, "griseofulvin": 1, "amorolfine": 1, "ciclopirox": 1, "isoniazid": 1, "rifampin": 1, "ethambutol": 1, "pyrazinamide": 1, "metronidazole": 1, "pentamidine": 1, "atovaquone": 1, "primaquine": 1, "tafenoquine": 1, "atovaquone-proguanil": 1, "capreomycin": 1, "ethionamide": 1, "suramin": 1, "eflornithine": 1, "melarsoprol": 1, "nifurtimox": 1, "ivermectin": 1, "praziquantel": 1, "mebendazole": 1, "metyrosine": 1, "methyldopa": 1, "reserpine": 1, "guanethidine": 1, "bretylium": 1, "cocaine": 1, "imipramine": 1, "amphetamine": 1, "methylphenidate": 1, "dopamine": 1, "norepinephrine": 1, "epinephrine": 1, "phenylephrine": 1, "naphazoline": 1, "midodrine": 1, "methoxamine": 1, "clonidine": 1, "guanabenz": 1, "guanfacine": 1, "moxonidine-rilmenidine": 2, "isoproterenol": 1, "metaproterenol": 1, "terbutaline": 1, "bitolterol": 1, "salbutamol": 1, "salmeterol": 1, "formoterol": 1, "ritodrine": 1, "dobutamine": 1, "ephedrine": 1, "pseudoephedrine": 1, "tolazoline": 1, "phentolamine": 1, "phenoxybenzamine": 1, "prazosin": 1, "terazosin": 1, "alfuzosin": 1, "tamsulosin": 1, "silodosin": 1, "yohimbine": 1, "propranolol": 1, "carvedilol": 1, "ergonovine": 1, "methysergide": 1, "lsd": 1, "ergotamine": 1, "cevimeline": 1, "pilocarpine": 1, "arecoline": 1, "physostigmine": 1, "neostigmine": 1, "tacrine": 1, "galantamine": 1, "donepezil": 1, "rivastigmine": 1, "isoflurophate": 1, "parathion": 1, "pralidoxime": 1, "atropine": 1, "scopolamine": 1, "ipratropium-tiotropium": 2, "oxybutynin": 1, "solifenacin": 1, "benztropine": 1, "orphenadrine": 1, "pirenzepine": 1, "buspirone": 1, "sarizotan": 1, "spiperone": 1, "sumatriptan": 1, "rizatriptan": 1, "ketanserin": 1, "cyproheptadine": 1, "melatonin": 1, "ondansetron": 1, "alosetron": 1, "tegaserod": 1, "cisapride": 1, "metoclopramide": 1, "amitriptyline": 1, "doxepin": 1, "clomipramine": 1, "nortriptyline": 1, "desipramine": 1, "protriptyline": 1, "amoxapine": 1, "maprotiline": 1, "nisoxetine": 1, "reboxetine": 1, "atomoxetine": 1, "fluoxetine": 1, "paroxetine": 1, "citalopram": 1, "sertraline": 1, "fluvoxamine": 1, "duloxetine": 1, "venlafaxine": 1, "milnacipran": 1, "bupropion": 1, "mirtazapine": 1, "trazodone": 1, "vilazodone": 1, "vortioxetine": 1, "phenelzine": 1, "isocarboxazid": 1, "tranylcypromine": 1, "selegiline": 1, "moclobemide": 1, "nitrous-oxide": 1, "halothane": 1, "methoxyflurane": 1, "enflurane": 1, "isoflurane": 1, "desflurane": 1, "sevoflurane": 1, "acetazolamide": 1, "methazolamide": 1, "dichlorphenamide": 1, "furosemide": 1, "bumetanide": 1, "torsemide": 1, "ethacrynic-acid": 1, "chlorothiazide": 1, "quinethazone": 1, "indapamide": 1, "chlorthalidone": 1, "xipamide": 1, "spironolactone": 1, "triamterene-amiloride": 2, "mannitol": 1, "hydralazine": 1, "nitroprusside": 1, "fenoldopam": 1, "minoxidil": 1, "diazoxide": 1, "nifedipine": 1, "nimodipine": 1, "amlodipine": 1, "verapamil": 1, "diltiazem": 1, "bepridil": 1, "sildenafil": 1, "vardenafil": 1, "tadalafil": 1, "avanafil": 1, "captopril": 1, "lisinopril": 1, "enalapril": 1, "fosinopril": 1, "benazepril-moexipril-quinapril": 3, "aliskiren": 1, "losartan": 1, "olmesartan": 1, "candesartan": 1, "irbesartan": 1, "valsartan": 1, "telmisartan": 1, "eprosartan": 1, "azilsartan": 1, "bosentan": 1, "quinidine": 1, "procainamide": 1, "disopyramide": 1, "lidocaine-arrhythmia": 1, "mexiletine": 1, "phenytoin-arrhythmia": 1, "tocainide": 1, "flecainide": 1, "propafenone": 1, "esmolol": 1, "amiodarone": 1, "dronedarone": 1, "bretylium-arrhythmia": 1, "sotalol": 1, "ibutilide": 1, "dofetilide": 1, "digoxin-arrhythmia": 1, "adenosine": 1, "amrinone-milrinone": 1, "forskolin": 1, "sacubitril-valsartan": 1, "ivabradine": 1, "heparin": 1, "fondaparinux": 1, "argatroban": 1, "dabigatran": 1, "warfarin": 1, "phenindione-anisindione": 2, "aspirin-antiplatelet": 1, "ticlopidine": 1, "clopidogrel": 1, "prasugrel": 1, "ticagrelor": 1, "statins": 9, "clofibrate": 1, "fenofibrate": 1, "gemfibrozil": 1, "ezetimibe": 1, "bile-acid-resins": 1, "niacin": 1, "dextrothyroxine": 1, "probucol": 1, "somatostatin": 1, "octreotide": 1, "oxytocin": 1, "estradiol": 1, "testosterone": 1, "progesterone": 1, "cortisone": 1, "hydrocortisone": 1, "prednisolone": 1, "dexamethasone": 1, "betamethasone": 1, "triamcinolone": 1, "fluocinolone-acetonide": 1, "meprednisone": 1, "budesonide": 1, "aldosterone": 1, "fludrocortisone": 1, "deoxycorticosterone": 1, "ethinyl-estradiol": 1, "diethylstilbestrol": 1, "clomiphene": 1, "tamoxifen": 1, "raloxifene": 1, "bazedoxifene": 1, "fulvestrant": 1, "aminoglutethimide": 1, "letrozole": 1, "anastrozole": 1, "exemestane": 1, "norgestrel": 1, "desogestrel": 1, "mifepristone": 1, "danazol": 1, "stanozolol": 1, "flutamide-group": 3, "enzalutamide": 1, "cyproterone": 1, "finasteride": 1, "dutasteride": 1, "ptu": 1, "methimazole": 1, "levothyroxine": 1, "liothyronine": 1, "sulfonylurea": 4, "meglitinide": 2, "metformin": 1, "tzd": 2, "muraglitazar": 1, "alpha-glucosidase-inhibitors": 3, "dpp4": 4, "triflusal-diflunisal": 2, "indomethacin": 1, "sulindac": 1, "diclofenac": 1, "tolmetin": 1, "nabumetone": 1, "ibuprofen": 1, "naproxen": 1, "flurbiprofen": 1, "mefenamic-acid": 1, "piroxicam": 1, "meloxicam": 1, "phenylbutazone": 1, "coxibs": 6, "acetaminophen": 1, "colchicine": 1, "probenecid": 1, "sulfinpyrazone": 1, "benzbromarone": 1, "lesinurad": 1, "allopurinol": 1, "febuxostat": 1, "diphenhydramine": 1, "tripelennamine": 1, "pheniramine": 1, "cyclizine-hydroxyzine": 2, "promethazine": 1, "terfenadine-fexofenadine": 1, "ebastine": 1, "loratadine": 1, "astemizole": 1, "acrivastine": 1, "cetirizine": 1, "khellin": 1, "cromolyn": 1, "pemirolast": 1, "omeprazole": 1, "lansoprazole": 1, "pantoprazole": 1, "sucralfate": 1, "bismuth-subsalicylate": 1, "misoprostol": 1, "cimetidine": 1, "ranitidine": 1, "nizatidine": 1, "famotidine": 1};
Object.entries(AM_IMG).forEach(([id, n]) => {
  const u = PI.UNITS.find(x => x.id === id); if (!u) return;
  u.img = "assets/amulet/" + id + ".png";
  if (n > 1) u.imgMore = Array.from({ length: n - 1 }, (_, i) => "assets/amulet/" + id + "-" + (i + 2) + ".png");
});
