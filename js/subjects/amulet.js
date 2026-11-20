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
  sec.items.push({ title, source: SRC_AM + " 第 " + page + " 頁", points });
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
kA(101, "Interferon 與補充考點", 9, "Interferon 總整理", [
  "{{Interferon-α|藥名}}：Interferon、Pegylated Interferon {{α-2a|名詞}} → HBV、HCV；α-2b 之 Interferon → HBV、HCV，α-2b 之 Pegylated Interferon → {{僅可治療 HCV|名詞}}",
  "{{Interferon-β|藥名}}：治療{{多發性硬化症|疾病}}",
  "{{Interferon-γ|藥名}}：治療{{慢性肉芽腫病變|疾病}}",
  "使用 Interferon 的副作用絕對比一般藥物{{高出許多|性質}}；常見副作用：{{Flu-like syndrome、肝毒性、骨髓抑制|副作用}}",
  "Interferon 接上 {{PEG|物質}} 可延長藥效及增加藥物對{{肝臟|器官}}的選擇性",
  "Interferon 加入 {{Albumin|物質}} 可減少玻璃管壁的吸附"
]);
kA(101, "Interferon 與補充考點", 9, "補充考點", [
  "{{孕婦|族群}}可用的 NNRTIs：{{Nevirapine、Rilpivirine|藥名}}",
  "{{雞尾酒療法|名詞}}：兩種 {{NRTIs|藥物類別}} ＋ 其他類藥物"
]);
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
kA(2, "癌症治療用藥整理", 22, "非小細胞肺癌治療用藥", [
  "Organoplatinum complex：{{Cisplatin、Carboplatin|藥名}}",
  "Taxanes：{{Docetaxel、Paclitaxel|藥名}}",
  "{{EGFR Tyrosine Kinase inhibitor|藥物類別}}：Gefitinib、Erlotinib、Lapatinib"
]);
kA(2, "癌症治療用藥整理", 22, "白血病類型與治療藥物", [
  "急性骨髓性白血病（{{AML|疾病}}）：Anthracycline + {{Cytarabine|藥名}}",
  "慢性骨髓性白血病（{{CML|疾病}}）：{{Imatinib、Nilotinib、Dasatinib|藥名}}",
  "急性淋巴性白血病（{{ALL|疾病}}）：{{L-Asparaginase|藥名}} + Vincristine + Epirubicin + Prednisolone",
  "慢性淋巴性白血病（{{CLL|疾病}}）：Cyclophosphamide + Fludarabine + Rituximab（{{CFR|名詞}}）；Cyclophosphamide + Oncovine + Prednisolone（{{COP|名詞}}）"
]);
kA(2, "癌症治療用藥整理", 23, "卵巢癌治療用藥", [
  "首選用藥：{{Carboplatin + Paclitaxel|藥名}}",
  "復發（Platinum resistant）：{{Liposomal doxorubicin、Topotecan、Altretamine|藥名}}"
]);
kA(2, "癌症治療用藥整理", 23, "造成 Alkylating agent cyclophosphamide 抗藥性的原因", [
  "癌細胞之 {{glutathione|物質}} 含量增加",
  "癌細胞之 {{glutathione S-transferase|酵素}} 活性提高",
  "癌細胞之 {{DNA 修復酵素|酵素}}活性增加",
  "癌細胞之輸送藥物進入細胞的{{運輸蛋白|名詞}}表現量降低"
]);

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
kA(104, "免疫抑制劑總整理", 30, "機轉", [
  "免疫力並非越強越好，假如因為免疫力過於旺盛而產生疾病，就必須透過免疫抑制劑藥物降低免疫力",
  "治療類風溼性關節炎（RA）之免疫抑制劑稱為 Disease modifying antirheumatic drugs（{{DMARDs|名詞}}）"
]);
kA(104, "免疫抑制劑總整理", 30, "抗癌藥與免疫抑制劑", [
  "抗癌藥：抑制 Purine 合成：Methotrexate、Azathioprine、Mycophenolate；抑制 Pyrimidine 合成：{{Leflunomide|藥名}}；破壞 DNA：{{Cyclophosphamide|藥名}}",
  "Leflunomide：抑制 {{Dihydroorotate dehydrogenase|酵素}}；Mycophenolate：抑制 {{IMP Dehydrogenase|酵素}}",
  "免疫抑制劑：抑制 Calcineurin：{{Tacrolimus、Cyclosporine|藥名}}；mTOR 抑制劑：{{Sirolimus、Everolimus|藥名}} → 常作為免疫抑制劑"
]);
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
kA(6, "抗生素總覽", 36, "抗生素併用原則（殺菌併用殺菌，抑菌併用抑菌）", [
  "抑制細胞壁及細胞膜 → {{殺菌|性質}}作用",
  "抑制蛋白質（30S 及 50S）→ {{抑菌|性質}}作用（除了{{胺醣類|藥物類別}}抗生素 → 殺菌作用）",
  "抑制細胞核（DNA／RNA）→ 殺菌作用（除了 {{Griseofulvin、Sulfonamide|藥名}} → 抑菌作用）",
  "{{Ticarcillin 與 Kanamycin|藥名}} 併用時，Ticarcillin 可以增加 Kanamycin 進入細菌細胞內的濃度，因而產生抑菌協同作用"
]);
kA(6, "抗生素總覽", 36, "常見細菌分類", [
  "G(+) 好氧：Staphylococcus aureus（{{金黃色葡萄球菌|名詞}}）、Streptococcus pyogenes（A 型鏈球菌）、Enterococcus faecalis（糞腸球菌）",
  "G(+) 厭氧：Clostridium difficile（{{困難梭菌|名詞}}）",
  "G(-) 好氧：Pseudomonas aeruginosa（{{綠膿桿菌|名詞}}）、Escherichia coli（大腸桿菌）、Neisseria gonorrhoeae（淋病雙球菌）",
  "G(-) 厭氧：Bacteroides fragilis（{{鬆脆桿菌|名詞}}）",
  "在格蘭氏陰性菌株外膜因為有膜孔蛋白（{{Porin Channel|名詞}}），使抗生素不易進入",
  "長期使用 {{Clindamycin|藥名}} 易引起困難梭菌增生之偽膜性結腸炎，可口服 {{Vancomycin|藥名}} 治療"
]);
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
kA(6, "細胞壁合成抑制劑", 39, "細胞壁合成步驟與抑制劑", [
  "使 NAG 不能變成 NAM：抑制 Enolpyruvate transferase → {{Fosfomycin|藥名}}",
  "阻止 L-Ala 轉化成 D-Ala：抑制 Alanine racemase and Alanine ligase → {{Cycloserine|藥名}}",
  "抑制 BP 去磷酸化 → {{Bacitracin|藥名}}",
  "抑制肽聚醣單體的延長（Chain elongation）：抑制 Transglycosylase → {{Vancomycin|藥名}}",
  "抑制肽聚醣間的交叉連結（{{Cross-linking|名詞}}）：抑制 Transpeptidase → β-lactams 類"
]);
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
kA(6, "Penicillins", 41, "Penicillins 結構與抗酸抗酶", [
  "抗酸（可口服）：有{{拉電子基|結構}}",
  "抗酶：有{{大基團|結構}}",
  "抗綠膿桿菌：含 {{COOH、尿素|結構}}",
  "不抗酸不抗酶：Penicillin G；不抗酸抗酶：Methicillin、Nafcillin；抗酸不抗酶：Penicillin V、Ampicillin、Amoxicillin；抗酸抗酶：Oxacillin、Dicloxacillin；不抗酸不抗酶抗綠膿桿菌：Carbenicillin、Ticarcillin、Azlocillin、Mezlocillin、Piperacillin"
]);
kA(6, "Cephalosporins", 42, "Cephalosporins 藥理特色", [
  "機轉：抑制 {{Transpeptidase|酵素}} 抑制細菌細胞壁的合成",
  "可否進入 BBB：第一、二代皆不能進入 BBB，除了 {{Cefuroxime|藥名}}；第三代可入 BBB，除了 {{Cefoperazone|藥名}}",
  "抗菌範圍大原則：一代到三代的抗菌範圍對 G(+) 越來越{{差|性質}}，對 G(-) 則越來越好；四代則是對 G(+)、G(-) 都有效",
  "大多為腎臟代謝，由肝臟排除：{{Ceftriaxone、Cefoperazone|藥名}}",
  "三號位為 H：{{Ceftizoxime、Ceftibuten|藥名}}",
  "3rd 生體可用率高（口服）：{{Ceftibuten、Cefixime、Cefdinir|藥名}}",
  "3rd 中無 Thiazole：{{Cefoperazone|藥名}}",
  "基本骨架：含 {{Dihydrothiazine|結構}} 及 β-lactam；C2、C3 以雙鍵連結；C4 接氫"
]);
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
kA(6, "抑制蛋白質合成", 47, "作用點、步驟與機轉", [
  "30S：tRNA 傳遞胺基酸至 A 位：抑制{{起始複合物|名詞}}的形成、造成誤讀 → {{Kanamycin|藥名}}；抑制 tRNA 與 mRNA 的鍵結 → {{Tetracycline|藥名}}",
  "50S：使胜肽鏈延長，將 P 位胺基酸轉至 A 位：{{轉胜肽作用（Transpeptidation）|名詞}} → Chloramphenicol",
  "50S：將 A 位胺基酸轉至 P 位，以便 A 位固定下一個 t-RNA：{{轉位作用（Translocation）|名詞}} → {{Azithromycin、Lincomycin|藥名}}",
  "抑制 50S：結合在細菌之 50S 核醣體上以抑制蛋白質的合成 → {{Quinupristin/Dalfopristin|藥名}}",
  "抑制 50S：結合在 50S 核醣體的 {{23S|名詞}} 上，抑制 {{70S|名詞}} 起始複合物的形成 → Linezolid"
]);
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
kA(6, "影響 DNA 的合成（Quinolones）", 54, "可抗綠膿桿菌的抗生素", [
  "Penicillins：含 {{COOH、尿素|結構}}",
  "Cephalosporins：第三代 {{Ceftazidime、Cefoperazone|藥名}}；第四代 {{Cefpirome、Cefepime|藥名}}",
  "Fluoroquinolones：{{Ciprofloxacin|藥名}}（最強）、Levofloxacin",
  "Aminoglycosides"
]);
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
kA(7, "Azole 類比較", 61, "Azole 類比較表", [
  "Ketoconazole：{{Imidazole×1|結構}}；肝代謝；不過 BBB；男性女乳症",
  "Itraconazole：Triazole×2；肝代謝；不過 BBB",
  "Fluconazole：Triazole×2；{{腎|器官}}代謝；{{過 BBB|性質}}；{{DDI 較少|性質}}",
  "Voriconazole：Triazole×1；肝代謝；過 BBB；{{視覺障礙|副作用}}",
  "Isavuconazole：Triazole×1；肝代謝；不過 BBB；{{半衰期最長|性質}}"
]);

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
kA(8, "抗肺結核藥物毒性", 64, "抗肺結核藥物毒性整理（From 阿摩）", [
  "肝毒性：為他 R.I.P（{{Rifampin、Isoniazid、Pyrazinamide|藥名}}）",
  "高尿酸：痛風（尿酸過高）歌手出 EP（{{Ethambutol、Pyrazinamide|藥名}}）"
]);

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
kA(10, "自主神經總覽", 69, "交感、副交感、體神經", [
  "交感神經：節前 Ach → {{Nn(N1)|標的}}；節後 {{Norepinephrine|物質}} → α、β",
  "副交感神經：節前 Ach → Nn(N1)；節後 Ach → {{M|標的}}",
  "體神經：無神經節；Ach → {{Nm(N2)|標的}}",
  "Agonist / Antagonist：α1-{{Phenylephrine|藥名}} / Prazosin；α2-{{Clonidine|藥名}} / Yohimbine；β-Isoproterenol / Propranolol；β1-{{Dobutamine|藥名}} / Atenolol；β2-Salbutamol / {{Butoxamine|藥名}}；β3-{{Mirabegron|藥名}}",
  "M-agonist：{{Pilocarpine|藥名}}；M-antagonist：{{Atropine|藥名}}",
  "AchE inhibitor：可逆：{{Physostigmine|藥名}}；不可逆：{{Parathion、Echothiophate|藥名}}",
  "Nm：競爭型：{{Tubocurarine|藥名}}；去極化型：{{Decamethonium、Succinylcholine|藥名}}；AchE inhibitor：Neostigmine"
]);
kA(10, "自主神經總覽", 70, "交感神經（白天）與副交感神經（晚上）", [
  "眼睛：交感 {{散瞳|名詞}}；副交感 {{縮瞳|名詞}}",
  "支氣管：交感擴張；副交感{{收縮|名詞}}",
  "心臟：交感強而有力；副交感{{緩慢|名詞}}",
  "腸胃道：交感腸胃蠕動↓；副交感腸胃蠕動{{↑|名詞}}",
  "膀胱、直腸：交感不排尿、不排便；副交感排尿、排便",
  "性器官：交感{{射精|名詞}}；副交感{{勃起|名詞}}",
  "液體：交感少、稠；副交感多、稀",
  "節前神經長短：交感節前{{較短|性質}}；副交感節前較長"
]);
kA(10, "自主神經總覽", 70, "接受器與生理作用綜合藥物機轉整理", [
  "刺激 α1：散瞳、心臟、血管收縮、前列腺收縮（α1A）；作用劑 {{Phenylephrine|藥名}}；阻斷劑 {{Prazosin|藥名}}",
  "刺激 α2：抑制神經傳遞物質釋放、使眼睛內血管收縮因此可減少眼房水分泌、血小板凝集；作用劑 {{Clonidine、Apraclonidine|藥名}}；阻斷劑 {{Yohimbine|藥名}}",
  "α 非選擇性阻斷劑：{{Tolazoline、Phentolamine、Phenoxybenzamine|藥名}}",
  "刺激 β1：{{Renin|物質}} 釋放、心臟收縮；作用劑 Dobutamine；阻斷劑 {{Atenolol|藥名}}",
  "刺激 β2：血管、氣管平滑肌擴張、子宮平滑肌擴張；作用劑 Salbutamol、{{Ritodrine|藥名}}；阻斷劑 Butoxamine",
  "刺激 β3：脂肪分解、逼尿肌鬆弛；作用劑 {{Mirabegron|藥名}}（治膀胱過動症）",
  "β 非選擇性阻斷劑：{{Propranolol|藥名}}",
  "刺激 D1：擴張腎臟血管平滑肌；作用劑 {{Fenoldopam|藥名}}",
  "刺激 D2：調節神經傳遞物質的釋放；作用劑 {{Bromocriptine|藥名}}；阻斷劑 {{Chlorpromazine|藥名}}"
]);
kA(10, "NE 生合成、代謝與 SAR", 71, "NE 生合成", [
  "Dopamine 可由 L-Dopa 經 {{Decarboxylation|名詞}} 反應而產生",
  "{{Tyrosine|物質}} 是腎上腺素和正腎上腺素生合成的前驅物",
  "Tyrosine —（{{Tyrosine Hydroxylase|酵素}}）→ DOPA —（DOPA Decarboxylase）→ Dopamine —（{{Dopamine-β-hydroxylase|酵素}}）→ Norepinephrine —（{{Phenylethanolamine-N-methyltransferase|酵素}}）→ Epinephrine"
]);
kA(10, "NE 生合成、代謝與 SAR", 71, "NE 代謝", [
  "MAO：進行{{氧化去胺|名詞}}；MAO-A 代謝受質 NE、{{Serotonin|物質}}；MAO-B 代謝受質 {{Dopamine|物質}}",
  "COMT：Catechol 間位{{氧甲基化|名詞}}（苯環 C-3 位）",
  "Norepinephrine —（MAO-A）→ 3,4-Dihydroxymandelic acid —（COMT）→ {{Vanillylmandelic acid|物質}}"
]);
kA(10, "NE 生合成、代謝與 SAR", 71, "擬交感神經作用劑 SAR", [
  "R1：N 上取代基越大 → 對受體選擇性越偏向 {{β|標的}}、越不容易被 {{MAO|酵素}} 代謝",
  "R2：接上甲基 → {{α2|標的}} receptor 活性增加，不易被 MAO 代謝",
  "R2：接上乙基 → {{β|標的}} receptor 活性增加，不易被 MAO 代謝",
  "芳香環：結構沒有 {{Catechol|結構}} → 就不會被 COMT 代謝"
]);
kA(10, "作用於交感神經系統的藥物", 72, "作用點（Medical Pharmacology at a Glance 圖）", [
  "{{Metyrosine|藥名}} ⊖ Tyrosine hydroxylase；{{Methyldopa|藥名}} ⊖ Dopa decarboxylase",
  "α2 Autoreceptor：α2-agonist {{Clonidine|藥名}}；α2-antagonist {{Yohimbine|藥名}}",
  "抑制 NE 釋放：{{Guanethidine、Bretylium|藥名}}；促進 NE 釋放：{{Amphetamine|藥名}}；排空 NE：{{Reserpine|藥名}}",
  "抑制 NE 再回收：{{Cocaine、Amitriptyline（TCA）|藥名}}",
  "α1-agonist：Phenylephrine、{{Methoxamine|藥名}}；α1-antagonist：Prazosin",
  "β1/β2-antagonist：Propranolol；β1/β2-agonist：{{Isoproterenol|藥名}}；β1-agonist：Dobutamine；β2-agonist：Salbutamol",
  "Amphetamine：藉由 {{NET|標的}} 當作運輸管道，抑制 {{VMAT|標的}} 使 NE 無法進入突觸囊泡",
  "Cocaine：抑制 NET，對 VMAT {{無效果|性質}}",
  "NET：Norepinephrine transporter；VMAT：Vesicular monoamine transporter"
]);
kA(10, "交感神經接受器", 73, "α 接受器", [
  "α1：位於{{突觸後|名詞}}細胞膜上；作用在 {{Gq|標的}} → 活化 Phospholipase C → PIP2 → DAG + IP3 → 細胞內 Ca2+ 增加 → 血管收縮、平滑肌收縮 → 使血壓上升",
  "α2：位於{{突觸前|名詞}}神經末梢；作用在 {{Gi|標的}} → 抑制 Adenylyl cyclase → cAMP↓ → 抑制 Norepinephrine 釋放 → 血管、平滑肌擴張 → 使血壓下降"
]);
kA(10, "交感神經接受器", 73, "β 接受器", [
  "β1（心臟）：使心跳速率、心臟收縮力增加；增加{{腎素（renin）|物質}}分泌",
  "β2（平滑肌）：血管、氣管擴張；增加升醣素分泌，造成肝醣分解；增加胰島素分泌；放鬆{{子宮平滑肌|器官}}",
  "β3（脂肪細胞）：促進脂肪分解；{{逼尿肌鬆弛|名詞}}",
  "作用在 {{Gs|標的}} → 活化 Adenylyl cyclase → cAMP↑",
  "cAMP 會被 PDE 代謝，{{Theophylline|藥名}} 為 PDE 的抑制劑，會讓 cAMP 上升，可作為氣喘藥物（作用在 β2）",
  "氣喘用藥：M-antagonist、β-agonist、PDE inhibitor、{{Adenosine antagonist|藥物類別}}",
  "{{Glucagon|藥名}} 會作用在 Glucagon receptor 產生強心作用，可拮抗 β-blocker 中毒時的心臟症狀"
]);
kA(10, "交感神經接受器", 73, "接受器親和力比較", [
  "α-receptor：{{Epinephrine ≧ Norepinephrine ≫ Isoproterenol|名詞}}",
  "β1-receptor：{{Isoproterenol > Epinephrine ≧ Norepinephrine|名詞}}",
  "β2-receptor：{{Isoproterenol > Epinephrine ≫ Norepinephrine|名詞}}"
]);
kA(10, "眼科用藥", 74, "青光眼藥物統整", [
  "減少眼房水生成（血管擴張造成眼房水滲出，因此血管收縮 → 減少眼房水生成）：α2-agonists：{{Apraclonidine、Brimonidine|藥名}}",
  "β-blockers：Metipranolol、Levobunolol、{{Timolol|藥名}}、Carteolol、Betaxolol",
  "Carbonic anhydrase inhibitors：{{Dorzolamide、Brinzolamide|藥名}}",
  "增加眼房水排除（睫狀肌收縮 → 打開許萊姆氏管 → 幫助眼房水的排除）：M-agonist：{{Pilocarpine、Carbachol|藥名}}；AchE inhibitors：Physostigmine、Isoflurophate",
  "打開葡萄膜鞏膜 → 幫助眼房水的排除：{{Prostaglandins|藥物類別}}（副作用：{{睫毛增生|副作用}}）：Bimatoprost、Latanoprost、Travoprost、Unoprostone（白拉他翠 U）",
  "交感神經藥物：{{Epinephrine、Dipivefrin|藥名}}"
]);
kA(10, "眼科用藥", 74, "散瞳縮瞳藥物統整", [
  "瞳孔示意圖：副交感神經刺激 → 環狀肌（M3）收縮 → 瞳孔縮小；交感神經刺激 → 放射肌（輻射肌）（α1）收縮 → 瞳孔放大",
  "散瞳：M-antagonist：{{Atropine、Tropicamide|藥名}}；α1-agonist：{{Phenylephrine|藥名}}",
  "縮瞳：M-agonist：{{Pilocarpine、Physostigmine|藥名}}；{{α1-antagonist|藥物類別}}"
]);
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
kA(10, "Beta-blockers", 82, "Beta-blockers 分類", [
  "β1-blockers：Atenolol、Acebutolol、Betaxolol、Bisoprolol、{{Metoprolol|藥名}}、Esmolol、Practolol、Nebivolol、Celiprolol",
  "青光眼：Metipranolol、Levobunolol、{{Timolol|藥名}}、Carteolol、Betaxolol",
  "{{ISA|名詞}}（內生性擬交感神經活性）（心絞痛患者不可使用）：{{Acebutolol、Celiprolol、Carteolol、Penbutolol、Pindolol|藥名}}",
  "可用於心衰竭：{{Metoprolol、Bisoprolol、Carvedilol|藥名}}",
  "臨床上使用左旋：{{Levobunolol、Timolol、Penbutolol|藥名}}",
  "可阻斷 α receptor：{{Labetalol、Carvedilol|藥名}}"
]);
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
kA(11, "副交感神經總覽", 84, "Ach 生合成與作用點（Cholinergic Agonists 圖）", [
  "{{Serine|物質}} —（Serine Decarboxylase）→ Ethanolamine —（Choline N-methyltransferase）→ Choline",
  "Choline Transporter ⊖ {{Hemicholinium|藥名}}",
  "Choline —（{{Choline Acetyltransferase|酵素}}）→ Acetylcholine（Ach）→ VAT（Vesicle-associated transporter）",
  "排空 Ach：{{Vesamicol|藥名}}；抑制 Ach 釋放：{{Botulinum toxin|藥名}}",
  "AchE：可逆型 AchE inhibitors：{{Physostigmine|藥名}}；不可逆型 AchE inhibitors：{{Parathion、Melathion|藥名}}",
  "NM（Na+ channel）：去極化型：{{Succinylcholine、Decamethonium|藥名}}；競爭型：Tubocurarine、Pancuronium、Atracurium",
  "M1,3,5（{{Gq|標的}}）、M2,4（{{Gi|標的}}）：M-agonist：Pilocarpine；M-antagonist：Atropine"
]);
kA(11, "副交感神經總覽", 85, "蕈毒鹼性受體（Muscarinic receptor）", [
  "M1：{{大腦組織、外分泌腺體、自主神經節|器官}}；Gq",
  "M2：{{心肌|器官}}；{{Gi|標的}}",
  "M3：外分泌腺、平滑肌收縮、睫狀肌、環狀肌收縮；{{Gq|標的}}",
  "M4：CNS 神經元；Gi",
  "M5：CNS 神經元；Gq"
]);
kA(11, "副交感神經總覽", 85, "菸鹼性受體（Nicotinic receptor）", [
  "Nn：{{神經節|器官}}部位；Nm：{{神經肌肉接合處|器官}}",
  "受體種類：{{Ion channel（Na+）|標的}}"
]);
kA(11, "膽鹼的性質", 85, "膽鹼的性質", [
  "Acetylcholine：被 AchE 代謝 ++++；M-Agonist +++；N-Agonist +++",
  "{{Methacholine|藥名}}：被 AchE 代謝 +；M-Agonist {{++++|名詞}}；N-Agonist −",
  "{{Carbachol|藥名}}：被 AchE 代謝 {{−|名詞}}；M-Agonist ++；N-Agonist +++",
  "{{Bethanechol|藥名}}：被 AchE 代謝 −；M-Agonist ++；N-Agonist −",
  "β 位加上{{甲基|結構}}，選擇性偏向 M",
  "Methacholine 會被 Cholinesterase 水解，但作用於 Muscarinic receptor {{最強|性質}}",
  "Carbachol {{不會|性質}}被膽鹼酯酶水解，對於 nicotinic 及 muscarinic receptor 皆有作用",
  "{{Bethanechol|藥名}} 可用於手術後{{尿液滯留|疾病}}"
]);
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
kA(11, "膽鹼脂酶抑制劑", 87, "治療 Alzheimer's disease", [
  "可逆性膽鹼脂酶抑制劑：{{Galantamine、Tacrine、Donepezil、Rivastigmine|藥名}}",
  "{{NMDA|標的}} 阻斷劑：{{Memantine|藥名}}"
]);
kA(11, "膽鹼脂酶抑制劑", 88, "有機磷中毒症狀", [
  "不可逆性膽鹼脂酶抑制劑 → 有機磷中毒症狀：{{縮瞳|副作用}}、唾液多、小便失禁、肌肉震顫"
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
kA(11, "膽鹼性阻斷劑", 89, "膽鹼性阻斷劑適應症", [
  "抗巴金森氏症：{{Benztropine、Orphenadrine、Biperiden、Trihexyphenidyl|藥名}}",
  "散瞳劑：Atropine（藥效{{最長|性質}}）、{{Tropicamide|藥名}}（藥效最短）、Scopolamine、Homatropine、Eucatropine",
  "解膀胱痙攣：3 級 N：{{Oxybutynin|藥名}}、Solifenacin、Darifenacin、Tolterodine、Fesoterodine；4 級 N：{{Trospium|藥名}}",
  "治消化性潰瘍：{{Pirenzepine、Telenzepine|藥名}}、Propantheline",
  "氣喘藥：{{Ipratropium、Tiotropium|藥名}}"
]);
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
kA(11, "交感與副交感機轉統整", 91, "交感神經與副交感神經作用機轉統整", [
  "節後神經傳遞物質生合成前驅物：交感 {{Tyrosine|物質}}；副交感 {{Serine|物質}}",
  "儲存：交感 {{Reserpine|藥名}} 抑制 VMAT（Vesicular monoamine transporter）；副交感 {{Vesamicol|藥名}} 抑制 VAT（Vesicle-associated transporter）",
  "釋放：交感 {{Guanethidine、Bretylium|藥名}} 抑制 NE 釋放；副交感 {{Botulinum toxin|藥名}} 抑制 Ach 釋放",
  "再回收：交感 Cocaine、TCA 抑制 {{NET|標的}}（Norepinephrine transporter）；副交感 Physostigmine、Parathion、Sarin 抑制 {{AchE|酵素}}"
]);

/* 講義第 92～93 頁（12. 自主神經節阻斷劑、13. 作用於神經肌肉連結處的藥物）暫時沒有收錄。 */

/* ================= 中樞神經島（14～25） ================= */
isleA("cns", "中樞神經島", { ground: "#B8C4E6", light: "#CCD5EE", cliff: "#8A98C4" });

/* ===== 第 14 章 中樞總論 ===== */
chA(14, "14", "中樞總論", "94～96");
kA(14, "中樞神經傳遞物質", 94, "GABA（γ-Aminobutyric acid）", [
  "是中樞神經主要的{{抑制性|性質}}傳遞物質",
  "GABA-A 為{{突觸後|名詞}}接收器；GABA-B 位於{{突觸前|名詞}}神經末端，可減少神經傳遞物質的釋放",
  "{{Bicuculline|藥名}} 拮抗 GABA-A 可作為致痙攣劑",
  "{{Baclofen|藥名}} 活化 GABA-B 可作為肌肉鬆弛劑",
  "{{Tiagabine|藥名}} 抑制 GABA 再回收，可增強腦中 GABA 的含量",
  "{{Vigabatrin|藥名}} 是 GABA-Transaminase 之自殺性不可逆抑制劑",
  "{{Gabapentin|藥名}} 會促進 GABA 釋放"
]);
kA(14, "中樞神經傳遞物質", 94, "Glycine、Glutamate、Acetylcholine", [
  "Glycine（甘胺酸）：抑制性傳遞物質，主要存在於{{脊髓|器官}}；Glycine 拮抗劑為 {{Strychnine|藥名}}（番木鱉鹼），引起痙攣的作用",
  "Glutamate：為中樞{{興奮性|性質}}傳遞物質；Ligand-gated ion channels：NMDA、AMPA、Kainate；G protein coupled receptors：Quisqualate；{{Ketamine|藥名}} 阻斷 NMDA 接受器",
  "Acetylcholine：在腦部是經由抑制{{鉀離子|物質}}通道興奮中樞；前驅物是 {{Serine|物質}}；Acetylcholine↓ 造成阿茲海默症，以 Galantamine、Tacrine、Donepezil、Rivastigimine 治療"
]);
kA(14, "中樞神經傳遞物質", 94, "Dopamine 與 Norepinephrine", [
  "Dopamine 藉由打開{{鉀離子|物質}}通道抑制中樞神經",
  "多巴胺三大路徑：{{黑質紋狀體|名詞}}路徑：退化會造成巴金森氏症；{{中邊緣|名詞}}路徑：過度活化會造成精神分裂症；{{結節漏斗|名詞}}路徑：調節 Prolactin 的釋放",
  "Chlorpromazine 為 DA 阻斷劑可治療{{精神分裂症|疾病}}；Bromocriptine 為 DA 作用劑可治療巴金森氏症",
  "CTZ（化學受體反射區）具有 Dopamine receptor；{{Metoclopramide|藥名}} 為 D2-antagonist 可止嘔",
  "NE 存在於腦幹中的{{藍斑|名詞}}；NE 和 DA 可能與藥物的成癮性有關；NE 的前驅物是 Tyrosine",
  "Phenylephrine 作用在 α1-receptor 可解鼻充血；Prazosin 阻斷 α1-receptor 可降血壓"
]);
kA(14, "中樞神經傳遞物質", 94, "Serotonin（5-HT）與 Neuropeptides", [
  "Serotonin 存在於腦幹的{{縫核|名詞}}中；Serotonin 下降將造成{{憂鬱症|疾病}}；增加 Serotonin 的釋放，有降低食慾的作用；前驅物是 {{L-Tryptophan|物質}}",
  "{{Lorcaserin|藥名}} 刺激 5-HT2c，作為減肥藥；活化 5-HT 接受器，可促進腸胃蠕動",
  "{{Tegaserod|藥名}} 刺激 5-HT4 治療便秘型刺激性腸道症候群；{{Alosetron|藥名}} 阻斷 5-HT3 治療腹瀉型刺激型腸道症候群",
  "Substance P 與{{痛覺|名詞}}有關，含 {{11|數值}} 個胺基酸；Enkephalins，與抑制痛覺有關",
  "Met-Enkephalin：Tyr-Gly-Gly-Phe-{{Met|物質}}；Leu-Enkephalin：Tyr-Gly-Gly-Phe-{{Leu|物質}}"
]);
kA(14, "中樞神經傳遞物質總整理表格", 95, "受體亞型、作用劑、阻斷劑", [
  "Acetylcholine：M1（Gq）、M2（Gi）作用劑 Muscarine，阻斷劑 Pirenzepine、Atropine；Nicotinic（Na+ channel）作用劑 Nicotine，阻斷劑 {{α-Bungarotoxin|藥名}}",
  "Dopamine：D1（{{Gs|標的}}）作用劑 Fenoldopam；D2（{{Gi|標的}}）作用劑 Bromocriptine，阻斷劑 Phenothiazine",
  "GABA：GABA-A（{{Cl- channel|標的}}）作用劑 Muscimol，阻斷劑 {{Bicuculline、Picrotoxin|藥名}}；GABA-B（Gi）作用劑 Baclofen，阻斷劑 {{Saclofen|藥名}}",
  "Glutamate：NMDA、AMPA、Kainate（Ion channel）；Metabotropic（G-protein）作用劑 Quisqualate",
  "Glycine：Glycine receptor（Cl- channel）作用劑 {{Taurine|物質}}，阻斷劑 Strychnine",
  "5-HT1A（Gi）作用劑 {{Buspirone|藥名}}，阻斷劑 Spiperone；5-HT1D（Gi）作用劑 {{Sumatriptan|藥名}}",
  "5-HT2A（Gq）作用劑 LSD，阻斷劑 {{Ketanserin、Trazodone|藥名}}；5-HT2C（Gq）作用劑 Lorcaserin",
  "5-HT3（{{Ion channel|標的}}）阻斷劑 {{Ondansertron|藥名}}；5-HT4（{{Gs|標的}}）作用劑 Cisapride、Tegaserod、Metoclopramide",
  "Norepinephrine：α1（Gq）Phenylephrine / Prazosin；α2（Gi）Clonidine / Yohimbine；β1（Gs）Dobutamine / Atenolol；β2（Gs）Salbutamol / Butoxamine"
]);
kA(14, "中樞神經傳遞物質總整理表格", 96, "Opioid、Endocannabinoids、Histamine、Orexins", [
  "Opioid：μ（mu）、δ（delta）、κ（kappa）皆為 {{Gi|標的}}；作用劑：μ {{Endorphin|物質}}、δ {{Enkephalin|物質}}、κ {{Dynorphin|物質}}；阻斷劑 {{Naloxone|藥名}}",
  "Endocannabinoids：CB1；作用劑 {{Anandamide|物質}}；阻斷劑 {{Rimonabant|藥名}}",
  "Histamine：H1（Gq）作用劑 Histamine，阻斷劑 {{Diphenhydramine|藥名}}；H2（Gs）作用劑 Dimaprit，阻斷劑 {{Cimetidine|藥名}}；H3（Gi）作用劑 Imetit、Lmepip，阻斷劑 Thioperamide",
  "Orexins：OX1/OX2；阻斷劑 {{Suvorexant|藥名}}"
]);

/* ===== 第 15 章 血清素 Serotonin（5-HT） ===== */
chA(15, "15", "血清素 Serotonin（5-HT）", "97～103");
kA(15, "Serotonin 生合成", 97, "Serotonin 與 Melatonin 的生合成", [
  "L-Tryptophan —（{{Tryptophan hydroxylase|酵素}}）→ 5-hydroxy tryptophan —（{{Aromatic amino acid decarboxylase|酵素}}）→ Serotonin",
  "Serotonin —（{{5-HT N-Acetyl transferase|酵素}}）→ N-Acetyl-5-HT —（{{5-Hydroxyindole-O-Methyl transferase|酵素}}）→ Melatonin",
  "影響食慾之藥物：服用毒品、迷幻藥基本上會抑制食慾，除了 {{THC、Dronabinol|藥名}} 會刺激食慾"
]);
dA(15, "Melatonin 相關", 97, "melatonin", "Melatonin（褪黑激素）", "Melatonin", {
  cls: ["內生性物質"],
  struct: ["結構{{不具有|性質}} Chiral center，以 {{L-tryptophan|物質}} 為生合成起始物"],
  feat: ["由 Serotonin 經由 5-HT N-Acetyl transferase 及 5-OHindole-O-Methyl transferase 而得", "Melatonin 在{{松果體|器官}}生合成和代謝"] });
dA(15, "Melatonin 相關", 97, "ramelteon", "Ramelteon", null, {
  cls: ["{{Melatonin receptor 1 and 2 agonist|藥物類別}}"],
  feat: ["可用於治療{{失眠|疾病}}", "副作用：疲勞、頭暈和影響內分泌", "主要和 {{CYP1A2|酵素}} 代謝，和 {{Fluvoxamine|藥名}}（CYP1A2 inhibitor）併用時會增加 Ramelteon 的血中濃度，應避免一起使用"] });

/* ===== 第 15 章（續）：第 98～99 頁 ===== */
kA(15, "5-HT 受體藥物總覽", 98, "15 血清素藥物架構", [
  "5-HT1 agonist：5HT1A — {{Buspirone|藥名}} — 抗焦慮；5-HT1B/1D — {{Sumatriptan|藥名}} — 治療偏頭痛",
  "5-HT2 antagonist：Methylsergide — 預防偏頭痛；{{Clozapine|藥名}} — 抗精神藥物；{{Trazodone|藥名}} — 抗憂鬱藥物",
  "5-HT3 antagonist：{{Ondansetron|藥名}} — 化放療止吐；{{Alosetron|藥名}} — 治療腹瀉型腸道症",
  "5-HT4 agonist：Metoclopramide — 促進腸胃蠕動；{{Tegaserod|藥名}} — 治療便秘型腸道症"
]);
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
kA(15, "偏頭痛用藥", 100, "預防偏頭痛用藥（口訣 ABCDE）", [
  "{{Anti-convulsants|藥物類別}}：Topiramate、Valproic acid",
  "β-blocker：{{Propranolol|藥名}}、Atenolol",
  "CCB：{{Verapamil|藥名}}",
  "anti-Depression：{{Amitriptyline|藥名}}",
  "Ergot alkaloids：{{Methysergide|藥名}}",
  "可同時用於治療及預防偏頭痛：{{Naproxen|藥名}}"
]);
kA(15, "偏頭痛用藥", 101, "Triptan 類藥物總整理", [
  "半衰期最長：{{Frovatriptan|藥名}}（25 小時）",
  "生體可用率最高：{{Almotriptan|藥名}}（70-80）",
  "經由 MAO 代謝的藥物：{{Almotriptan、Rizatriptan、Sumatriptan、Zolmitriptan|藥名}}",
  "經由 3A4 代謝的藥物：{{Eletriptan、Naratriptan|藥名}}",
  "經由 1A2 代謝的藥物：{{Frovatriptan、Zolmitriptan|藥名}}",
  "鼻噴劑劑型：{{Sumatriptan、Zolmitriptan|藥名}}",
  "LogP 最高：Eletriptan（3.1）；Sumatriptan 生體可用率最低（14-15）"
]);
