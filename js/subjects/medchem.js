/* PHARMA ISLAND：藥化科目
   這個檔案只在 medchem.html 載入，會把藥理的章節、單元、知識樹換成藥物化學的。
   格式和生藥頁一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）。
   章節照「藥物化學國考統整」的目錄：
     統整（一）中樞神經系統：壹～陸 → 第 1～6 章（中樞神經島）
     統整（三）心臟血管系統：柒、捌、玖、壹拾壹 → 第 7～10 章（心血管島）
   內容來自教授給的期中考複習講義（藥物化學國考統整），只擷取：分類、結構圖、粗體字。
   目前已加入第 1 章到講義 p.14；之後的章節還是預留格。
   結構圖是從講義裁下來的原圖，放在 assets/medchem/（id 和單元 id 一樣）。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-medchem-v1";   // 進度和其他科目分開存

PI.CATEGORIES = [
  { id: "cns", name: "統整（一）中樞神經", color: "#8E7CB8", tint: "#E6E0F2" },
  { id: "cv", name: "統整（三）心臟血管", color: "#C77C7C", tint: "#F4DEDE" }
];

/* 地圖：小分類（Barbiturates、Benzodiazepines…）畫交界線和名牌 */
PI.GROUP_REGIONS = true;

/* 藥化的欄位：照講義表格的欄位（藥物｜結構｜特性｜藥理及臨床應用） */
PI.UNIT_FIELDS = [["use", "分類／用途"], ["bold", "粗體重點"]];
PI.UNIT_TITLE_FIELD = null;
PI.UNIT_BOXES = [];
PI.UNIT_TYPES = { drug: "藥物", preparation: "製劑", category: "分類", topic: "主題" };

PI.CLOZE_TYPES = ["藥名", "藥物類別", "結構", "取代基", "位置", "機轉", "受體", "標的", "酵素", "代謝", "代謝物", "用途", "疾病",
  "副作用", "性質", "數值", "作用時間", "離子", "名詞", "器官", "給藥途徑", "物質"];
PI.CLOZE_SETS = (PI.CLOZE_SETS || []).concat([
  ["長效型", "中效型", "短效型"], ["開啟時間", "開啟頻率"], ["活性", "無活性"], ["Class A", "Class B"],
  ["R form", "S form"], ["增加", "降低"]
]);

PI.CHAPTERS = [
  { id: 1, name: "鎮靜安眠與抗焦慮藥物", cat: "cns", estimate: 30, unitType: "drug", note: "統整（一）壹，p.3–18。" },
  { id: 2, name: "抗癲癇藥物", cat: "cns", estimate: 25, unitType: "drug", note: "統整（一）貳，p.19–31。" },
  { id: 3, name: "抗憂鬱藥物", cat: "cns", estimate: 25, unitType: "drug", note: "統整（一）參，p.32–43。" },
  { id: 4, name: "神經疾病相關藥物（帕金森氏症、阿茲海默症等）", short: "神經疾病相關藥物", cat: "cns", estimate: 15, unitType: "drug", note: "統整（一）肆，p.44–48。" },
  { id: 5, name: "抗精神病藥物", cat: "cns", estimate: 25, unitType: "drug", note: "統整（一）伍，p.49–62。" },
  { id: 6, name: "肌肉鬆弛劑及抗痙攣藥物", cat: "cns", estimate: 12, unitType: "drug", note: "統整（一）陸，p.63–67。" },
  { id: 7, name: "利尿劑", cat: "cv", estimate: 20, unitType: "drug", note: "統整（三）柒，p.39–46。" },
  { id: 8, name: "心絞痛藥物", cat: "cv", estimate: 8, unitType: "drug", note: "統整（三）捌，p.47–48。" },
  { id: 9, name: "心衰竭藥物", cat: "cv", estimate: 10, unitType: "drug", note: "統整（三）玖，p.49–53。" },
  { id: 10, name: "抗凝血與血液相關藥物", cat: "cv", estimate: 25, unitType: "drug", note: "統整（三）壹拾壹，p.58–69。" }
];

/* 兩座島：統整（一）的六章拼成一座、統整（三）的四章拼成一座 */
PI.LANDMASSES = [
  { id: "cns", name: "中樞神經島", chapters: [1, 2, 3, 4, 5, 6],
    palette: { ground: "#C3B5DE", light: "#D5CBE8", cliff: "#9C8CBF" } },
  { id: "cv", name: "心血管島", chapters: [7, 8, 9, 10], angle: 20,
    palette: { ground: "#E8B4B0", light: "#F0C9C6", cliff: "#C48A86" } }
];

PI.UNITS = [
/* ===== 第 1 章 鎮靜安眠與抗焦慮藥物（統整（一）壹，p.3–18）===== */
{ id: "sh-barb-vs-bzd", chapter: 1, name: "Barbiturates 與 BZD 之比較", short: "Barb vs BZD", type: "topic", group: "總覽", source: "統整（一）p.3",
  bold: [
    "Barbiturates：活化 GABA_A 之 Cl⁻ 通道，增加{{開啟時間|機轉}}",
    "Benzodiazepine：異位活化 GABA_A 之 Cl⁻ 通道，增加{{開啟頻率|機轉}}",
    "產生作用之順序：{{鎮靜 Sedation|名詞|催眠 Hypnosis/麻醉 Anesthesia/昏迷 Coma}} → 催眠 Hypnosis → 麻醉 Anesthesia → 昏迷 Coma",
    "睡眠周期之影響：增加{{第二期非快速動眼期|名詞|快速動眼期/慢波睡眠期/第一期非快速動眼期}}的睡眠時間（Stage II：non-REM）",
    "反彈性失眠：{{短效|作用時間|長效/中效}}>長效",
    "Barbiturates 解毒劑：{{Picrotoxin|藥名}}（GABA_A 拮抗劑）",
    "BZD 解毒劑：{{Flumazenil|藥名}}（GABA 之競爭型負向異位調節劑），只能 IV 給予",
    "藥理補充：{{β-Carbolines|藥名}}、Bicuculline 為 {{Inverse agonist|機轉}}",
    "{{Flumazenil|藥名}} 可拮抗 BZD 和 Z-drugs 的作用"
  ] },
{ id: "sh-barb-general", chapter: 1, name: "Barbiturates 通論", short: "Barb 通論", type: "topic", group: "Barbiturates", source: "統整（一）p.4", img: "assets/medchem/sh-barb-general.png",
  bold: [
    "基本結構為 {{5,5-disubstituted barbituric acid|結構}}（由尿素 urea 與丙二酸 malonic acid 構成）",
    "{{高脂溶性|性質}}，為{{弱酸性|性質}}，與 NaOH 反應可製成鈉鹽，增加水溶性",
    "延長 Cl⁻ 通道的開啟{{時間|機轉|頻率/數目/速度}}",
    "為 CYP450 之強效{{誘導劑|性質|抑制劑/受質/活化劑}}★",
    "側鏈：支鏈多，作用時間短；{{雙鍵|取代基}}取代，作用時間短",
    "Pentobarbital、Secobarbital 為{{短效型|作用時間}}；Phenobarbital 為{{長效型|作用時間}}",
    "Barbiturates 可{{促進紫質|副作用}}（Porphyrins）合成，故禁用於急性間歇性紫質症的患者"
  ] },
{ id: "amobarbital", chapter: 1, name: "Amobarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.4–5", img: "assets/medchem/amobarbital.png",
  use: ["{{鎮靜安眠|用途}}（青發）"],
  bold: ["R₂ 為 {{Isoamyl|取代基}}（5C）", "與 Pentobarbital 互為{{結構異構物|名詞}}"] },
{ id: "pentobarbital", chapter: 1, name: "Pentobarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.4–5", img: "assets/medchem/pentobarbital.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["R₂ 為 2-n-pentyl", "{{短效藥|作用時間}}"] },
{ id: "butabarbital", chapter: 1, name: "Butabarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.4–5", img: "assets/medchem/butabarbital.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["R₂ 為 {{4C|數值}} 結構（sec-butyl）"] },
{ id: "methohexital", chapter: 1, name: "Methohexital", type: "drug", group: "Barbiturates", source: "統整（一）p.5", img: "assets/medchem/methohexital.png",
  use: ["{{麻醉劑|用途}}：IV 型全身麻醉劑"],
  bold: [] },
{ id: "phenobarbital", chapter: 1, name: "Phenobarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.4–6", img: "assets/medchem/phenobarbital.png",
  use: ["{{鎮靜安眠|用途}}、{{抗癲癇|用途}}"],
  bold: ["R₂ 為 {{Benzene|取代基}}", "{{長效藥|作用時間}}",
    "pKa=7.4 為{{弱酸性|性質}}的藥物",
    "{{兒童性熱痙攣|疾病}}之首選藥物",
    "代謝：在苯環 {{para 位接上 OH|代謝}}，再經共軛反應排出"] },
{ id: "thiopental", chapter: 1, name: "Thiopental", type: "drug", group: "Barbiturates", source: "統整（一）p.5", img: "assets/medchem/thiopental.png",
  use: ["{{麻醉劑|用途}}：IV 型全身麻醉劑", "又稱 Thiopentobarbital"],
  bold: ["將 Pentobarbital 第二位的 O 改成 {{S|取代基}}", "{{麻醉誘導|用途}}★"] },
{ id: "secobarbital", chapter: 1, name: "Secobarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.4–5", img: "assets/medchem/secobarbital.png",
  use: ["{{鎮靜安眠|用途}}（紅中）"],
  bold: ["R₁ 為 {{allyl group|取代基}}", "與 Pentobarbital 只差在{{丙烯基|取代基}}", "{{短效藥|作用時間}}"] },
{ id: "thiamylal", chapter: 1, name: "Thiamylal", type: "drug", group: "Barbiturates", source: "統整（一）p.5", img: "assets/medchem/thiamylal.png",
  use: ["{{麻醉劑|用途}}：IV 型全身麻醉劑"],
  bold: ["將 Secobarbital 第二位的 O 改成 {{S|取代基}}"] },
{ id: "mephobarbital", chapter: 1, name: "Mephobarbital", type: "drug", group: "Barbiturates", source: "統整（一）p.6", img: "assets/medchem/mephobarbital.png",
  use: ["{{抗癲癇|用途}}"],
  bold: ["與 Phenobarbital 只相差一個{{甲基|取代基}}（3 號 N 上接 CH₃）",
    "代謝：主要在肝臟進行 {{N-去甲基化|代謝}}形成 phenobarbital",
    "經 {{CYP2C19|酵素}}（R form）、{{CYP2B6|酵素}}（S form）代謝之 4-hydroxy★代謝物具有立體選擇性",
    "CYP2C19 缺陷之患者藥物{{清除率會降低|性質}}"] },
{ id: "primidone", chapter: 1, name: "Primidone", type: "drug", group: "Barbiturates", source: "統整（一）p.6", img: "assets/medchem/primidone.png",
  use: ["{{抗癲癇|用途}}"],
  bold: ["為 phenobarbital {{2 號位去氧|結構}}之產物", "2 號位{{沒有 C=O|結構}}（carbonyl）"] },

{ id: "sh-bzd-general", chapter: 1, name: "BZD 通論", type: "topic", group: "BZD 總論", source: "統整（一）p.7", img: "assets/medchem/sh-bzd-general.png",
  bold: [
    "Benzodiazepines 會和 GABA_A 受體的 BZD 位結合，增加 Cl⁻ 通道開啟的{{頻率|機轉|時間/數目/速度}}",
    "吸收快、脂溶性高、代謝物無活性 → {{鎮定 Sedative|用途|抗焦慮 Antianxiety}}",
    "吸收慢、脂溶性低、代謝物有活性 → {{抗焦慮 Antianxiety|用途|鎮定 Sedative}}",
    "半衰期{{越短|性質|越長}}，所造成之反彈性失眠越嚴重★",
    "{{Flunitrazepam|藥名}} 為 FM2 之成分",
    "Class A 長效：Clorazepate、Diazepam、Flurazepam、Chlordiazepoxide、Halazepam、Quazepam；其中 Onset {{快|性質}}：Flurazepam",
    "Class A 短效：Temazepam、Lorazepam、Oxazepam；Class B 短效：{{Triazolam|藥名}}、Midazolam"
  ] },
{ id: "clorazepate", chapter: 1, name: "Clorazepate", type: "drug", group: "BZD Class A", source: "統整（一）p.8", img: "assets/medchem/clorazepate.png",
  use: ["{{抗焦慮|用途}}、{{抗癲癇|用途}}"],
  bold: ["{{3 號位接 carboxyl group|結構}}★",
    "屬於 {{Prodrug|性質}}，在胃中會{{脫羧|代謝}}★形成有活性的 Desmethyldiazepam（{{Nordiazepam|代謝物}}）",
    "代謝性質與 {{Diazepam|藥名}} 相似★",
    "與制酸劑併服會{{降低|性質}}吸收"] },
{ id: "diazepam", chapter: 1, name: "Diazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.8", img: "assets/medchem/diazepam.png",
  use: ["{{抗焦慮|用途}}、抗癲癇、麻醉劑、抗痙攣"],
  bold: ["1 號 N 上接{{甲基|取代基}}",
    "IV 可快速控制癲癇重積症 {{status epilepticus|疾病}}",
    "代謝：CYP2C19、CYP3A4 進行 {{N-去甲基化|代謝}} → 形成活性代謝物 {{Nordiazepam|代謝物}}",
    "半衰期由 46 增為 71 小時，{{長效型|作用時間}}藥物",
    "Nordiazepam 可再行 {{3-hydroxylation|代謝}} 形成 {{Oxazepam|代謝物}}"] },
{ id: "flurazepam", chapter: 1, name: "Flurazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.8", img: "assets/medchem/flurazepam.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  bold: ["1 號 N 有 {{2-(diethylamino)ethyl|取代基}} 結構（三級胺）",
    "C 環上有 {{2'-F|取代基}} 取代基",
    "口服製劑會做成 {{dihydrochloride salt|性質}}",
    "Onset {{最快|性質}}，{{長效型|作用時間}}",
    "代謝：主要由 {{N-dealkylation|代謝}}★代謝"] },
{ id: "chlordiazepoxide", chapter: 1, name: "Chlordiazepoxide", type: "drug", group: "BZD Class A", source: "統整（一）p.9", img: "assets/medchem/chlordiazepoxide.png",
  use: ["{{抗焦慮|用途}}"],
  bold: ["2 號位上並非 C=O，而是 {{-NHCH₃|取代基}}",
    "{{長效型|作用時間}}：因為有{{活性代謝物|性質}}",
    "代謝：主要由 {{CYP3A4|酵素}} 負責 → 產生活性代謝物 {{Nordiazepam|代謝物}}"] },
{ id: "quazepam", chapter: 1, name: "Quazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.9", img: "assets/medchem/quazepam.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["唯一 2 號位上的 C=O 改為 {{C=S|結構}}", "C 環上有 {{2'-F|取代基}} 取代基",
    "有兩條代謝路徑：主要路徑會{{保留|性質|脫去}} CF₃ 基團"] },
{ id: "clonazepam", chapter: 1, name: "Clonazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.9", img: "assets/medchem/clonazepam.png",
  use: ["{{抗癲癇|用途}}"],
  bold: ["7 號位有 {{NO₂|取代基}} 取代基 → Class A 中唯一 R₇ 不接 Cl 者", "C 環上有 {{2'-Cl|取代基}} 取代基",
    "被核准治療{{失張性|疾病}} akinetic、{{肌攣性|疾病}} myclonic 發作",
    "代謝：可進行 {{7-reduction|代謝}}★將 NO₂→NH₂"] },
{ id: "sh-bzd-3oh", chapter: 1, name: "含 3-OH 之 BZD（不經肝臟代謝）", short: "3-OH BZD", type: "topic", group: "BZD Class A", source: "統整（一）p.10",
  bold: ["Class A（字尾 {{-azepam|結構}}）：Temazepam、Lorazepam、Oxazepam 含 {{3-OH|取代基}} 取代基，不經肝臟代謝★，為短效型藥物",
    "不經肝臟代謝，較適合肝功能不佳者使用的 BZDs：{{Oxazepam|藥名}}★、Lorazepam、Temazepam",
    "皆經由 Glucuronide {{conjugation|代謝}} 代謝★"] },
{ id: "temazepam", chapter: 1, name: "Temazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.10", img: "assets/medchem/temazepam.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["{{短效型|作用時間}}，半衰期短", "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation → 適合{{肝功能不佳|疾病}}的患者"] },
{ id: "lorazepam", chapter: 1, name: "Lorazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.10", img: "assets/medchem/lorazepam.png",
  use: ["{{抗焦慮|用途}}、抗癲癇、麻醉劑"],
  bold: ["為 Oxazepam 的 {{2'-Cl|取代基}} 衍生物", "{{短效型|作用時間}}，半衰期短",
    "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation → 適合{{肝功能不佳|疾病}}的患者"] },
{ id: "oxazepam", chapter: 1, name: "Oxazepam", type: "drug", group: "BZD Class A", source: "統整（一）p.10", img: "assets/medchem/oxazepam.png",
  use: ["{{抗焦慮|用途}}"],
  bold: ["{{短效型|作用時間}}，半衰期短", "為 {{Chlordiazepoxide|藥名}} 與 Diazepam 的活性代謝物",
    "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation → 適合{{肝功能不佳|疾病}}的患者"] },
{ id: "estazolam", chapter: 1, name: "Estazolam", type: "drug", group: "BZD Class B", source: "統整（一）p.11", img: "assets/medchem/estazolam.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["Class B：{{s-triazolo|結構}}-benzodiazepine，含有 {{1,3,4-triazole ring|結構}}",
    "{{1 個|數值}}取代基（Ring A：7-Cl）",
    "{{中效型|作用時間}}，半衰期較長", "結構中沒有甲基，{{不經 CYP3A4 代謝|代謝}}",
    "代謝物 {{4'-hydroxyestazolam|代謝物}} 脂溶性低，且因立體構型障礙使其與 GABA_A {{結合力下降|性質}}"] },
{ id: "alprazolam", chapter: 1, name: "Alprazolam", type: "drug", group: "BZD Class B", source: "統整（一）p.11", img: "assets/medchem/alprazolam.png",
  use: ["{{抗焦慮|用途}}"],
  bold: ["{{2 個|數值}}取代基（Ring A：7-Cl；Triazole ring：有甲基）", "{{中效型|作用時間}}抗焦慮用藥", "可以治療{{恐慌症|疾病}}"] },
{ id: "triazolam", chapter: 1, name: "Triazolam", type: "drug", group: "BZD Class B", source: "統整（一）p.11", img: "assets/medchem/triazolam.png",
  use: ["{{鎮靜安眠|用途}}"],
  bold: ["{{3 個|數值}}取代基（Ring A：7-Cl；Ring C：2'-Cl；Triazole ring：有甲基）",
    "{{短效型|作用時間}}：Onset 最快、Duration 短", "副作用：{{反彈性失眠|副作用}}★ → 容易有戒斷症狀",
    "代謝：經 CYP3A4 在甲基氧化代謝後形成活性代謝物 {{α-hydroxytriazolam|代謝物}}"] },
{ id: "midazolam", chapter: 1, name: "Midazolam", type: "drug", group: "BZD Class B", source: "統整（一）p.11", img: "assets/medchem/midazolam.png",
  use: ["{{麻醉劑|用途}}、抗焦慮、癲癇"],
  bold: ["Class B（{{imidazo|結構}}-benzodiazepine）", "{{3 個|數值}}取代基（Ring A：7-Cl；Ring C：2'-F；Imidazole ring：有甲基）",
    "可治療{{持續性癲癇|疾病}}", "IV 注射：{{誘導麻醉|用途}} → Onset 快、恢復快",
    "Dihydrochloride 鹽類體外多為{{開環|結構|閉環}}結構，進入生理環境後會重新閉環（活性結構）"] },
{ id: "eszopiclone", chapter: 1, name: "Eszopiclone", type: "drug", group: "Z-drugs", source: "統整（一）p.12", img: "assets/medchem/eszopiclone.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  bold: ["Z-drugs（Nonbenzodiazepines）作用於 BZR 上，增加 Cl⁻ 通道打開的{{頻率|機轉|時間/數目/速度}}",
    "三者中{{唯一有 chiral center|結構}}", "{{S-enantiomer|結構}} 活性及親和性較高（Es）",
    "主要由 CYP3A4 進行 {{N-去甲基化|代謝}}，代謝產物仍有活性；但若進行 {{N-oxide|代謝}} 代謝，則會失去活性★",
    "Z-drugs 中 Duration 為{{中效|作用時間}}"] },
{ id: "zaleplon", chapter: 1, name: "Zaleplon", type: "drug", group: "Z-drugs", source: "統整（一）p.12", img: "assets/medchem/zaleplon.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  bold: ["吸收快速、半衰期短 → {{超短效型|作用時間}}",
    "主要經 {{Aldehyde Oxidase|酵素}}★生成 {{5-oxozaleplon|代謝物}}"] },
{ id: "zolpidem", chapter: 1, name: "Zolpidem", type: "drug", group: "Z-drugs", source: "統整（一）p.12", img: "assets/medchem/zolpidem.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  bold: ["屬於 {{Imidazopyridine|結構}}★類", "代謝：主要是{{苯環上的甲基|位置}}被氧化接上 OH"] },
{ id: "flumazenil", chapter: 1, name: "Flumazenil", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/flumazenil.png",
  use: ["{{BZD 與 Z-drug 過量之解毒劑|用途}}", "GABA 負向異位調節劑，不興奮也不抑制，僅擋住受體阻斷藥物作用；僅能 {{IV|給藥途徑}} 給予"],
  bold: ["Flumazenil★（國考重點）"] },
{ id: "beta-carbolines", chapter: 1, name: "β-Carbolines", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/beta-carbolines.png",
  use: ["選擇性拮抗中樞 GABA_A 受體 {{Inverse agonist|機轉}}，可降低 BZD 之抑制作用"], bold: [] },
{ id: "bicuculline", chapter: 1, name: "Bicuculline", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/bicuculline.png",
  use: ["選擇性拮抗中樞 GABA_A 受體 {{Inverse agonist|機轉}}，可降低 BZD 之抑制作用"], bold: [] },
{ id: "picrotoxin", chapter: 1, name: "Picrotoxin", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/picrotoxin.png",
  use: ["負向異位作用於 GABA_A 受體（GABA_A antagonist）", "可用於 {{Barbiturates 過量之解毒劑|用途}}"], bold: [] },
{ id: "bemegride", chapter: 1, name: "Bemegride", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/bemegride.png",
  use: ["負向異位作用於 GABA_A 受體（GABA_A antagonist）", "可用於 {{Barbiturates 過量之解毒劑|用途}}"], bold: [] },
{ id: "sh-serotonin", chapter: 1, name: "血清素（Serotonin）簡介", short: "血清素簡介", type: "topic", group: "Serotonin Agonists", source: "統整（一）p.14", img: "assets/medchem/sh-serotonin.png",
  bold: ["血清素為{{抑制型|性質|興奮型}}的神經遞質，結構為 {{5-hydroxytryptamine|結構}}（5-HT）",
    "主要由 {{L-tryptophan|物質}}★生合成；代謝主要由 MAO 進行 {{Oxidative deamination|代謝}}★",
    "5-HT {{無法|性質|可以}}通過血腦障壁，必須靠腦中神經細胞自己合成",
    "其中 {{5-HT1A|受體}} 和調節焦慮有關",
    "血清素被釋放後，會結合並活化突觸後受體，{{抑制|性質|興奮}}神經元的活性",
    "比較：{{Bupropion|藥名}} 為 NDRI，用來治療憂鬱症"] },
{ id: "buspirone", chapter: 1, name: "Buspirone", type: "drug", group: "Serotonin Agonists", source: "統整（一）p.14", img: "assets/medchem/buspirone.png",
  use: ["{{抗焦慮|用途}}"],
  bold: ["屬於 {{Azaspirodecanedione|結構}}★類藥物（pyrimidinylbutylpiperazine）", "含有{{螺環|結構}}結構",
    "{{5-HT1A|受體}} 受體{{部分致效劑|機轉}}★（Partial agonist）",
    "{{沒有安眠|性質}}、抗痙攣及肌肉鬆弛作用", "用於治療{{廣泛性焦慮症|疾病}}（GAD）",
    "代謝：經肝臟 CYP3A4 代謝成 {{1-PP|代謝物}}★，會進入腦中作為 {{α₂-antagonist|機轉}}",
    "1-PP：1-(2-{{pyrimidyl|結構}}★)-piperazine"] },

/* ===== 第 2 章 抗癲癇藥物（統整（一）貳，p.19–31）===== */
{ id: "ae-intro", chapter: 2, name: "抗癲癇精神藥理學簡介", short: "抗癲癇簡介", type: "topic", group: "總論", source: "統整（一）p.19",
  bold: [
    "人體主要由生理食鹽水組成，所以{{細胞外|位置|細胞內}} Na⁺、Cl⁻ 多",
    "被動運輸：由{{高|性質|低}}濃度往低濃度方向跑",
    "興奮性神經遞質：{{Glutamate|物質}}、Serotonin、Histamine",
    "抑制性神經遞質：{{GABA|物質}}、Glycine",
    "癲癇發作（興奮狀態）：阻止興奮性遞質 → 抑制 {{Glutamate|物質}} 作用；促進抑制性遞質 → 促進 {{GABA|物質}} 作用",
    "抗癲癇藥物調節離子通道：阻斷 Na⁺通道、阻斷 {{T-type|名詞}} Ca²⁺通道、促進 K⁺通道、間接促進 Cl⁻通道（BZD 藥物）"
  ] },
{ id: "ae-firstline", chapter: 2, name: "各類型癲癇治療首選藥物", short: "癲癇首選藥", type: "topic", group: "總論", source: "統整（一）p.19",
  bold: [
    "局部性發作：{{Carbamazepine|藥名}}、Phenytoin、Valproic acid",
    "全身強直痙攣發作（大發作）：Carbamazepine、Phenytoin、{{Valproic acid|藥名}}",
    "失神性發作（小發作）：{{Ethosuximide|藥名}}、Lamotrigine、Valproic acid",
    "肌攣性發作：{{Valproic acid|藥名}}、Clonazepam",
    "癲癇重積症：{{Lorazepam|藥名}}、Diazepam"
  ] },
{ id: "ae-action-site", chapter: 2, name: "抗癲癇藥物作用位置整理", short: "藥物作用位置", type: "topic", group: "總論", source: "統整（一）p.20",
  bold: [
    "癲癇成因：離子通道異常（細胞外 Ca²⁺↓、K⁺↑）、抑制性 GABA 被抑制、興奮性 Glutamate 被促進",
    "阻斷 Na⁺通道（{{最多|性質}}藥物作用）：Carbamazepine、Oxcarbazepine、Lamotrigine、Lacosamide、Phenytoin",
    "阻斷 {{T-type|名詞}} Ca²⁺通道：Ethosuximide",
    "促進 K⁺通道開啟：{{Ezogabine|藥名}}（Retigabine）",
    "促進抑制性 GABA：抑制 GAT 再回收 → {{Tiagabine|藥名}}；活化 GABA_A 受體 → BZDs、Phenobarbital；抑制 {{GABA-T|標的}} 代謝 → Vigabatrin（不可逆）；增強 GAD → Gabapentin",
    "抑制興奮性 Glutamate：阻斷 P/Q-type Ca²⁺通道 → Gabapentin、Pregabalin；阻斷 NMDA 的 Ca²⁺通道 → {{Felbamate|藥名}}；阻斷 AMPA/KA 的 Na⁺通道 → Topiramate；抑制 Glutamate 釋放 → Lamotrigine",
    "廣效型（多重作用機轉）：{{Valproate|藥名}}、Levetiracetam、Topiramate、Zonisamide、Felbamate",
    "GAD = glutamate decarboxylase（可合成 GABA）；GAT = GABA transporter（可回收 GABA）；GABA-T = GABA transaminase（會代謝 GABA）"
  ] },

/* 一、局部性及全身強直-痙攣性：Hydantoin 類衍生物 */
{ id: "phenytoin", chapter: 2, name: "Phenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/phenytoin.png",
  use: ["{{局部性發作|用途}}、全身強直痙攣發作（又稱 Diphenylhydantoin）"],
  bold: [
    "含有 {{Hydantoin|結構}} 結構",
    "5 號位接{{兩個苯環|取代基}}",
    "{{水溶性差|性質}}★，pKa=8 常製成鈉鹽增加溶解度（屬於{{弱酸性|性質}}★藥物）",
    "藉三個氫鍵、Hydrophobic 作用與 {{Na⁺通道|標的}}★結合",
    "投與劑量與血中濃度呈{{非線性|性質|線性}}關係",
    "大量與血漿蛋白結合，且會{{誘導|性質|抑制}} CYP3A4",
    "對{{失神性發作|疾病}}沒有療效，可能會惡化疾病",
    "代謝：{{CYP2C9|酵素}} 進行 para-hydroxylation★"
  ] },
{ id: "fosphenytoin", chapter: 2, name: "Fosphenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/fosphenytoin.png",
  use: ["{{局部性發作|用途}}、全身強直痙攣發作"],
  bold: [
    "比 Phenytoin 多了{{磷酸鹽|結構}}結構",
    "3 號位的 N 上接甲基磷酸根 {{-CH₂OPO₃²⁻|取代基}}",
    "{{水溶性較高|性質}}，常以 IV 或 {{IM|給藥途徑}} 給藥★",
    "為 Phenytoin 的 {{Prodrug|性質}}★，體內被磷酸酶切掉磷酯鍵生成 Phenytoin",
    "副作用：{{齒齦增生|副作用}}、巨球型貧血、致畸胎"
  ] },
{ id: "ethotoin", chapter: 2, name: "Ethotoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/ethotoin.png",
  use: ["{{強直痙攣性|用途}}及複雜性局部性發作（輔助藥物）"],
  bold: [
    "3 號位的 N 上接{{乙基|取代基}}",
    "5 號位接{{一個苯環|取代基}}",
    "毒性較 Phenytoin {{低|性質|高}}，但癲癇療效較差、鎮定效果較強，做輔助治療藥物而非首選",
    "代謝：可進行 {{N-去乙基化|代謝}}"
  ] },
{ id: "mephenytoin", chapter: 2, name: "Mephenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/mephenytoin.png",
  use: ["{{局部性發作|用途}}（第二線用藥）"],
  bold: [
    "3 號位的 N 上接{{甲基|取代基}}",
    "5 號位接一個苯環及{{乙基|取代基}}",
    "鎮定效果較 Phenytoin {{強|性質|弱}}",
    "具強烈毒性，可能造成嚴重皮疹、{{無顆粒性白血球症|副作用}}或肝炎，為第二線用藥",
    "{{3-N-demethylation|代謝}} 之代謝物具有毒性（5-ethyl-5-phenylhydantoin）"
  ] },

/* Iminostilbene 類衍生物 */
{ id: "iminostilbene", chapter: 2, name: "Iminostilbene", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/iminostilbene.png",
  use: ["Carbamazepine 的母核結構"],
  bold: [
    "為 {{Stilbene|結構}} 之衍生物",
    "中間結構為含 N {{七元雜環|結構}}，兩側接苯環",
    "第 {{10、11|位置}} 號位有 C=C 雙鍵",
    "原本 Stilbene 在 {{trans|名詞|cis}} form 比較穩定，但為了與 NH₂ 反應變成 cis form，最後生成 Iminostilbene"
  ] },
{ id: "carbamazepine", chapter: 2, name: "Carbamazepine", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/carbamazepine.png",
  use: ["{{局部性發作|用途}}（單純&複雜性）首選用藥★", "也可用於治療{{三叉神經痛|疾病}}★"],
  bold: [
    "Iminostilbene 之衍生物，中間結構為含 N 七元雜環（-azepine）",
    "具有 {{Carboxamide|結構}} 結構",
    "pKa=13，為{{酸性藥|性質}}，在酸中解離程度小",
    "代謝：大部分由 {{CYP3A4|酵素}} 代謝，將 C10-11 之雙鍵代謝為 {{epoxide|代謝物}}★ → 活性及毒性都更強",
    "CBZ-IQ、2-OHIS 均為活性代謝物，與{{肝毒性|副作用}}有關",
    "代謝路徑：CBZ → 2-hydroxy-CBZ → 2-hydroxyiminostilbene({{2-OHIS|代謝物}}) → CBZ-Iminoquinone(CBZ-IQ)",
    "Carbamazepine 和 {{Trazodone|藥名}} 都會代謝產生 Iminoquinone"
  ] },
{ id: "oxcarbazepine", chapter: 2, name: "Oxcarbazepine", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/oxcarbazepine.png",
  use: ["{{局部性發作|用途}}"],
  bold: [
    "Carbamazepine 之衍生物",
    "與 CBZ 之結構差異：第 10、11 號位為{{飽和單鍵|結構|雙鍵}}；10 號位有 {{C=O|取代基}}（ketone）取代",
    "可以阻斷 {{Na⁺通道|標的}}",
    "代謝：經 {{Alcohol dehydrogenase|酵素}} 還原成 10-hydroxyoxcarbazepine（活性代謝物）",
    "半衰期較 Carbamazepine {{短|性質|長}}，藥效較弱但肝毒性較小，較容易引起{{低血鈉|副作用}}"
  ] },

/* Biscarbamates 類衍生物 */
{ id: "felbamate", chapter: 2, name: "Felbamate", type: "drug", group: "Biscarbamates 類衍生物", source: "統整（一）p.24", img: "assets/medchem/felbamate.png",
  use: ["抗癲癇（阻斷 NMDA 的 Ca²⁺通道）"],
  bold: [
    "具有{{兩個|數值}} Carbamate 結構",
    "結構與肌肉鬆弛劑 {{Meprobamate|藥名}} 相似",
    "機轉不明，但會和 {{NMDA|受體}}★受體結合，抑制 Ca²⁺流入",
    "形成毒性代謝物 {{2-phenylpropenal|代謝物}}★（Atropaldehyde）"
  ] },
{ id: "fluorofelbamate", chapter: 2, name: "2-Fluorofelbamate", type: "drug", group: "Biscarbamates 類衍生物", source: "統整（一）p.24", img: "assets/medchem/fluorofelbamate.png",
  use: ["抗癲癇（研發中，尚未上市）"],
  bold: [
    "與 Felbamate 只差一個 F，{{C₂|位置}}上有 F 取代基",
    "為了避免 Felbamate C₂ 上的 H 代謝產生具有毒性的 {{atropaldehyde|代謝物}}，故以 F 取代 H"
  ] },

/* GABA 類衍生物 */
{ id: "gabapentin", chapter: 2, name: "Gabapentin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/gabapentin.png",
  use: ["{{糖尿病神經痛|疾病}}、皰疹後神經痛"],
  bold: [
    "含有 {{GABA|結構}} 結構",
    "5 個 C 原子與 GABA 之 β-carbon 形成{{飽和六元環|結構}}",
    "可增加 {{GAD|標的}} 的作用，使 GABA 合成↑",
    "結合 {{P/Q-type|名詞}} Ca²⁺通道異位調節，減少 Ca²⁺流入",
    "水溶性高，但可作用在 {{CNS|器官}}",
    "代謝：{{不經過代謝|代謝}}，直接透過腎臟排除"
  ] },
{ id: "pregabalin", chapter: 2, name: "Pregabalin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/pregabalin.png",
  use: ["皰疹後神經痛，輔助治療成人的{{局部性發作|用途}}"],
  bold: [
    "結構為 {{S-3-isobutyl|結構}} GABA",
    "有一個 chiral center，以 {{S form|結構|R form}} 存在",
    "結合到 P/Q-type-Ca²⁺通道的 {{α₂δ|名詞}} 次單元，可降低通道活性，減少 Ca²⁺流入",
    "藥效為 Gabapentin 的 {{3-10|數值}} 倍"
  ] },
{ id: "vigabatrin", chapter: 2, name: "Vigabatrin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/vigabatrin.png",
  use: ["治療嬰兒痙攣，及其他藥物難以改善之成人複雜性局部發作"],
  bold: [
    "結構為 {{γ-vinyl|結構}} GABA",
    "只有 {{S(+)-form|結構}}★具有活性，臨床上用消旋",
    "{{不可逆|性質|可逆}}的 GABA-T 抑制劑★",
    "代謝：以{{原型藥|代謝}}直接由尿液排出"
  ] },

/* 含 amide group 之衍生物 */
{ id: "rufinamide", chapter: 2, name: "Rufinamide", type: "drug", group: "含 amide group 之衍生物", source: "統整（一）p.26", img: "assets/medchem/rufinamide.png",
  use: ["治療{{雷葛氏症候群|疾病}}的孤兒藥"],
  bold: [
    "含五元雜環 {{triazole|結構}} 及一個 amide group",
    "苯環之{{兩個 ortho 位|位置}}有 F 取代",
    "增加 Na⁺通道的{{不活化時間|機轉}}，減少重複放電次數",
    "代謝：主要由 {{carboxylesterase|酵素}} 將 amide 水解為 COOH"
  ] },
{ id: "lacosamide", chapter: 2, name: "Lacosamide", type: "drug", group: "含 amide group 之衍生物", source: "統整（一）p.26", img: "assets/medchem/lacosamide.png",
  use: ["輔助治療 17 歲以上患者之{{局部性發作|用途}}"],
  bold: [
    "為 {{L-serine|物質}} 的衍生物，共有兩個 amide",
    "N 端接 acetyl group，C 端接 benzylamine，以 {{-OCH₃|取代基}} 取代 Serine 上的 -OH",
    "阻斷 {{Na⁺通道|標的}}，但和 phenytoin、CBZ 機轉不同",
    "代謝：60% 會經 {{CYP2C9|酵素}} 產生無活性 O-demethyl 代謝物，其餘未經代謝者由尿液排出"
  ] },

/* 含 acetamide group 之衍生物 */
{ id: "levetiracetam", chapter: 2, name: "S-(-)-Levetiracetam", type: "drug", group: "含 acetamide group 之衍生物", source: "統整（一）p.26", img: "assets/medchem/levetiracetam.png",
  use: ["輔助治療成人的{{局部性發作|用途}}（與 pregabalin 相同）"],
  bold: [
    "含有 {{pyrrolidone|結構}} 結構",
    "N 上接 {{acetamide|取代基}} 取代基",
    "結構必為{{左旋|性質|右旋}}（Levorotory）",
    "Amide 結構容易被 {{esterase|酵素}} 水解代謝",
    "作用機轉不明",
    "代謝：主要以{{原型藥|代謝}}★由尿液排出，其餘將 amide 水解為 COOH（無活性）後排出"
  ] },

/* 未分類結構 */
{ id: "ezogabine", chapter: 2, name: "Ezogabine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/ezogabine.png",
  use: ["輔助治療成人的{{局部性發作|用途}}（又名 Retigabine）"],
  bold: [
    "具有 Ethyl 和 {{carbamate|結構}} 結構",
    "機轉：促進開啟 {{K⁺通道|標的}}★，使 K⁺流出細胞造成過極化，抑制中樞神經興奮",
    "代謝：{{不經 CYP450|代謝}} 代謝"
  ] },
{ id: "lamotrigine", chapter: 2, name: "Lamotrigine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/lamotrigine.png",
  use: ["治療成人的{{雷葛氏症候群|疾病}} Lennox-Gastaut"],
  bold: [
    "為 {{6-phenyl-1,2,4-triazine|結構}} 衍生物",
    "主要在 {{2 號位|位置}}★進行 glucuronidation★",
    "機轉：阻斷 {{Na⁺通道|標的}}，也可阻斷 Ca²⁺通道",
    "{{孕婦|名詞}}使用最安全的抗癲癇藥物",
    "和 {{Valproic acid|藥名}}★併用可延長半衰期（Valproic acid 為 CYP 抑制劑，可抑制代謝）",
    "副作用：{{紅疹|副作用}}、嗜睡、複視"
  ] },
{ id: "tiagabine", chapter: 2, name: "Tiagabine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/tiagabine.png",
  use: ["抑制 GABA 再吸收，抗癲癇"],
  bold: [
    "非 GABA 類似結構",
    "含有{{兩個 Thiophene|結構}} 結構",
    "含有 {{Nipecotic acid|結構}} 結構",
    "機轉：抑制 GABA 的再吸收★ → 抑制 {{GAT|標的}}★",
    "口服吸收佳，可通過 {{BBB|器官}}★",
    "代謝：主要經 {{CYP3A4|酵素}} 在 thiophene 上進行 oxidation，之後再進行 glucuronidation"
  ] },
{ id: "topiramate", chapter: 2, name: "Topiramate", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/topiramate.png",
  use: ["抗癲癇（阻斷 AMPA/KA 的 Na⁺通道）"],
  bold: [
    "由 {{Fructose|物質}} 形成 ketal 後與 sulfamate ester 發展而成的酯類衍生物",
    "機轉目前仍不明",
    "與血漿蛋白結合率{{低|性質|高}}",
    "代謝：大部分藥物會直接經{{尿液|代謝}}排出"
  ] },
{ id: "zonisamide", chapter: 2, name: "Zonisamide", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/zonisamide.png",
  use: ["輔助治療 16 歲以上且第一線藥物難以控制的病症"],
  bold: [
    "為 {{Sulfonamide|結構}}★的衍生物",
    "含有 {{Benzisoxazole|結構}} 結構",
    "機轉：阻斷 {{Na⁺通道|標的}}和 T-type Ca²⁺通道",
    "代謝：於 Sulfonamide 的 N 上行 N-acetylation；經 {{CYP3A4|酵素}} 或 CYP2D6 進行還原；在 N-O 之間開環形成 2-sulfamoylacetyl phenol"
  ] },
{ id: "valproic-acid", chapter: 2, name: "Valproic acid", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/valproic-acid.png",
  use: ["廣效型抗癲癇（VPA），各類發作皆可用"],
  bold: [
    "Acetic acid 上有{{兩個丙基|取代基}}，故又稱為 dipropylacetic acid",
    "pKa=4.7，在體內可以{{完全解離|性質}}",
    "為 {{CYP2C9|酵素}} 的抑制劑★，與 lamotrigine 併服可延長其半衰期",
    "機轉可能是活化 {{glutamic acid decarboxylase|標的}} 或抑制 GABA 轉胺酶 → 使 GABA 濃度上升",
    "代謝：主要由肝臟代謝，在碳鏈上行 hydroxylation★",
    "40% 經 β-oxidation 形成二級醇，脫水之主要代謝物為具活性的 {{(E)-2-ene-VPA|代謝物}}",
    "15-20% 經 ω-oxidation 形成一級醇，脫水後產生毒性代謝物 {{(E)-2,4-diene-VPA|代謝物}}"
  ] },

/* 二、失神性發作藥物：Oxazolidinediones 類衍生物 */
{ id: "trimethadione", chapter: 2, name: "Trimethadione", type: "drug", group: "Oxazolidinediones 類衍生物", source: "統整（一）p.29", img: "assets/medchem/trimethadione.png",
  use: ["{{失神性發作|用途}}（或其他藥物難以改善的病症）"],
  bold: [
    "結構中有{{三個甲基|取代基}}（trimethadione）",
    "{{Prodrug|性質}}★，必須經 N-demethylation 代謝為 {{dimethadione|代謝物}}★才能作用在 T-type Ca²⁺通道"
  ] },

/* Succinimides 類衍生物 */
{ id: "ethosuximide", chapter: 2, name: "Ethosuximide", type: "drug", group: "Succinimides 類衍生物", source: "統整（一）p.29", img: "assets/medchem/ethosuximide.png",
  use: ["治療{{失神性發作|用途}}之首選藥★"],
  bold: [
    "將 Oxazolidinedione 五元環上的 {{O→C|結構}}（降低毒性）",
    "3 號位接甲基、{{乙基|取代基}}（Etho-）",
    "{{不會|性質}}與血漿蛋白結合★",
    "副作用：刺激胃部、貧血、血小板↓",
    "代謝：{{乙基上氧化|代謝}}為無活性代謝物，由尿液排出"
  ] },
{ id: "methsuximide", chapter: 2, name: "Methsuximide", type: "drug", group: "Succinimides 類衍生物", source: "統整（一）p.29", img: "assets/medchem/methsuximide.png",
  use: ["失神性發作（毒性較強，較少使用）"],
  bold: [
    "N 上接有{{甲基|取代基}}（Meth-）",
    "3 號位接甲基、{{苯環|取代基}}",
    "毒性較 Ethosuximide {{強|性質|弱}}，較少使用",
    "代謝：經 {{N-demethylation|代謝}} 形成之代謝物具有長半衰期（25 小時）"
  ] },
{ id: "phensuximide", chapter: 2, name: "Phensuximide", type: "drug", group: "Succinimides 類衍生物", source: "統整（一）p.29", img: "assets/medchem/phensuximide.png",
  use: ["失神性發作（藥效較弱）"],
  bold: [
    "N 上接有{{甲基|取代基}}（Meth-）",
    "3 號位接{{苯環|取代基}}",
    "會使尿液變成{{粉紅色|性質}}或紅色（無毒性）",
    "代謝：直接由{{膽汁|代謝}}或尿液排出"
  ] },

/* 總整理 */
{ id: "ae-ureide", chapter: 2, name: "Ureide 基本結構衍生物", short: "Ureide 衍生物", type: "topic", group: "總整理", source: "統整（一）p.29–31", img: "assets/medchem/ae-ureide.png",
  bold: [
    "Ureide 基本結構衍生物：{{Barbiturates|藥物類別}}、Hydantoin、Oxazolidinediones、Succinimides",
    "Ureide 可形成 {{enolic hydroxy|結構}}，在鹼性水溶液中解離程度較大",
    "X group 改變會造成控制的{{發作類型|名詞}}顯著改變",
    "Oxazolidinediones（X = {{O|離子|C}}）→ Trimethadione → absence seizure",
    "Succinimides（X = CH₂）→ Ethosuximide、Methsuximide、Phensuximide → absence seizure"
  ] },
{ id: "ae-se-summary", chapter: 2, name: "抗癲癇藥物副作用統整", short: "副作用統整", type: "topic", group: "總整理", source: "統整（一）p.31",
  bold: [
    "體重增加：{{Valproic acid|藥名}}、Gabapentin、Vigabatrin",
    "體重減少：{{Felbamate|藥名}}、Topiramate、Zonisamide",
    "失神性發作用藥：Valproic acid、{{Ethosuximide|藥名}}、Lamotrigine",
    "孕婦禁用：{{Phenytoin|藥名}}、Topiramate",
    "無藥物交互作用：{{Ethosuximide|藥名}}、Gabapentin、Levetiracetam",
    "Steve-Johnson 症狀：Phenytoin、Carbamazepine、{{Lamotrigine|藥名}}"
  ] },

/* ===== 第 3 章 抗憂鬱藥物（統整（一）參，p.32–43）===== */
{ id: "ad-classes", chapter: 3, name: "抗憂鬱藥物分類總表", short: "抗憂鬱分類", type: "topic", group: "總論", source: "統整（一）p.32",
  bold: [
    "NSRI（非選擇性正腎上腺素與血清素再回收抑制劑）：Amitriptyline 類 TCA、Imipramine 類 TCA、非 TCA（Venlafaxine、Milnacipran、Duloxetine）",
    "SNRI（選擇性正腎上腺素再回收抑制劑）：TCA（Desipramine、Nortriptyline、Amoxapine、Protriptyline、Maprotiline）、非 TCA（Reboxetine、Atomoxetine）",
    "SSRI（選擇性血清素再回收抑制劑）：Fluoxetine、Paroxetine、Citalopram、Sertraline、Fluvoxamine",
    "DNRI（多巴胺與正腎上腺素再回收抑制劑）：{{Bupropion|藥名}}",
    "SRM/SARI（血清素受體調節劑）：Trazodone、Aripiprazole、Vilazone",
    "NaSSA（正腎上腺素與選擇性血清素拮抗劑）：Mianserin、Mirtazapine",
    "MAOI（單胺氧化酶抑制劑）：選擇性 Moclobemide；非選擇性 Phenelzine、Tranylcypromine",
    "心情穩定劑：{{Lithium|藥名}}、Valproic acid、Carbamazepine"
  ] },

/* 一、NSRI：含末端三級胺之 TCA — Amitriptyline 類（環外有雙鍵） */
{ id: "amitriptyline", chapter: 3, name: "Amitriptyline", type: "drug", group: "TCA-NSRIs：Amitriptyline 類", source: "統整（一）p.33", img: "assets/medchem/amitriptyline.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "屬於 {{Dibenzocycloheptene|結構}} 類 TCA",
    "5 號位為 C 原子，且接有 {{propylidene|取代基}}",
    "結構和 {{Nortriptyline|藥名}} 相似（SNRIs）",
    "對光敏感，須避光保存，以防{{氧化成酮|性質}}而沉澱",
    "主要由 {{CYP2D6|酵素}} 經 N-demethylation 代謝成有活性的二級胺 {{Nortriptyline|代謝物}}",
    "可在 C₁₀ 進行水解，產生有活性的 {{E-10-hydroxy|代謝物}} 代謝物"
  ] },
{ id: "doxepin", chapter: 3, name: "Doxepin", type: "drug", group: "TCA-NSRIs：Amitriptyline 類", source: "統整（一）p.33", img: "assets/medchem/doxepin.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "屬於 {{Dibenzoxepine|結構}} 類 TCA",
    "七元雜環中含有 {{O 原子|結構}}（11 號位）→ 造成三環系統不對稱",
    "{{E form|結構}} 較穩定但 {{Z form|結構}} 活性較大（市售多販售 E/Z=85/15）",
    "代謝：主要進行 N-desmethylation；E form 由 {{CYP2D6|酵素}}、CYP2C19 代謝；Z form 只由 {{CYP2C19|酵素}} 代謝"
  ] },
{ id: "dosulepin", chapter: 3, name: "Dosulepin", type: "drug", group: "TCA-NSRIs：Amitriptyline 類", source: "統整（一）p.33", img: "assets/medchem/dosulepin.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "為 Doxepin 的 {{Thio-isoster|名詞}}",
    "七元雜環中含有 {{S 原子|結構}}（11 號位）",
    "只有 {{E form|結構}} 具有活性",
    "容易在腸胃道 GI 被吸收，會經{{肝臟首渡代謝|代謝}}",
    "主要經 {{S-oxidation|代謝}} 生成有活性的 Dosulepin S-oxide；其次經 N-demethylation 代謝為無活性產物",
    "TCA 大多具高度首渡代謝，且有 Antihistamine、α-blocker、Antimuscarinic 的副作用（抗 {{HAM|名詞}}）"
  ] },

/* NSRI：Imipramine 類（結構無雙鍵、C5 為 N、字尾 -pramine） */
{ id: "imipramine", chapter: 3, name: "Imipramine", type: "drug", group: "TCA-NSRIs：Imipramine 類", source: "統整（一）p.34", img: "assets/medchem/imipramine.png",
  use: ["{{抗憂鬱|用途}}，可改善{{兒童遺尿|疾病}}"],
  bold: [
    "皆為 {{10,11-dihydrodibenzazepine|結構}} 類 TCA（結構無雙鍵，C₅ 為 N，字尾 -pramine）",
    "對 {{5-HT|受體}} 的選擇性較佳",
    "若 3 號位接{{鹵素或氰基|取代基}}，可增強對 SERT 的選擇性",
    "主要由 CYP2C19、{{CYP1A2|酵素}} 行 N-demethylation，產生活性代謝物二級胺 {{Desipramine|代謝物}}（SNRIs）→ 失去抑制 5-HT 活性，選擇性抑制 NE 的再吸收"
  ] },
{ id: "clomipramine", chapter: 3, name: "Clomipramine", type: "drug", group: "TCA-NSRIs：Imipramine 類", source: "統整（一）p.34", img: "assets/medchem/clomipramine.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "3 號位上有 {{Cl|取代基}} 取代基★ → 藥效提升 50 倍",
    "與 {{Chlorpromazine|藥名}} 為 isostere",
    "主要由 {{CYP2D6|酵素}} 進行 N-demethylation，產生之活性代謝物選擇性、藥效皆比原來更高",
    "也可進行 C₂、C₈ 的 {{hydroxylation|代謝}}"
  ] },
{ id: "trimipramine", chapter: 3, name: "Trimipramine", type: "drug", group: "TCA-NSRIs：Imipramine 類", source: "統整（一）p.34", img: "assets/medchem/trimipramine.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "結構中共有{{三個甲基|取代基}}（Trimi-）",
    "5-propyl 的側鏈多接一個甲基 → 形成 {{chiral center|名詞}}（★）",
    "主要以{{消旋|性質}}化合物上市",
    "(-)-Trimipramine 經 {{CYP2D6|酵素}} 行 2-hydroxylation；(+)-Trimipramine 經 {{CYP2C19|酵素}} 行 N-demethylation"
  ] },
{ id: "lofepramine", chapter: 3, name: "Lofepramine", type: "drug", group: "TCA-NSRIs：Imipramine 類", source: "統整（一）p.34", img: "assets/medchem/lofepramine.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "末端 N 上接了 {{para-chlorophenacyl|取代基}} → 親脂性提升，更容易進入 CNS，對 NET 的選擇性也更高",
    "進行 N-demethylation，形成二級胺 {{Desipramine|代謝物}} → 失去抑制 5-HT 活性，選擇性抑制 NE 的再吸收"
  ] },

/* 非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs） */
{ id: "venlafaxine", chapter: 3, name: "Venlafaxine / Desvenlafaxine", short: "Venlafaxine", type: "drug", group: "Non-TCA NSRIs", source: "統整（一）p.35", img: "assets/medchem/venlafaxine.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "以 {{methoxyphenylethylamine|結構}} 為骨架，屬 TCA 開環後的化合物，一邊接苯環，另一邊接 {{cyclohexanol|結構}}",
    "側鏈之距離為{{一個 C|數值}}（TCA 是 3 個）",
    "與阿片類止痛藥 {{Tramadol|藥名}} 結構類似",
    "主要由 {{CYP2D6|酵素}} 進行 O-demethylation → 產生活性代謝物 O-desmethylvenlafaxine（ODV），直接用此代謝物作為新藥：{{Desvenlafaxine|代謝物}}",
    "次要由 CYP3A4 進行 N-demethylation"
  ] },
{ id: "milnacipran", chapter: 3, name: "Milnacipran", type: "drug", group: "Non-TCA NSRIs", source: "統整（一）p.35", img: "assets/medchem/milnacipran.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "具有 {{Cyclopropane|結構}} 結構（-cipran）",
    "由 phenylcyclopropanecarboxamide 修飾而得的 {{cis-aminomethyl|結構}} 衍生物",
    "若用 aminopropyl 取代 aminomethyl，會變成強效的 {{NMDA 受體拮抗劑|機轉}}",
    "對 {{5-HT|受體}} 選擇性較佳；對 α、M、H₁ 受體有較弱親和力 → 副作用較 TCA 少",
    "代謝：50% 藥物會直接經{{尿液|代謝}}排出"
  ] },
{ id: "duloxetine", chapter: 3, name: "Duloxetine", type: "drug", group: "Non-TCA NSRIs", source: "統整（一）p.35", img: "assets/medchem/duloxetine.png",
  use: ["{{抗憂鬱|用途}}（作用強弱：Duloxetine > Milnacipran > Venlafaxine）"],
  bold: [
    "以 Fluoxetine（SSRIs）為模板進行改良：Phenoxy → {{Naphthyloxy|結構}}；Benzene → {{Thiophene|結構}}（isostere）",
    "CYP2D6 進行 N-demethylation，形成活性代謝物",
    "CYP1A2 在萘環的 4/5/6 號位進行 hydroxylation → {{4-hydroxy|代謝物}} 代謝物仍具活性，但選擇性抑制 SERT",
    "次要代謝會在 Thiophene 上行 oxidation，代謝物會導致類似{{黃疸|副作用}}的症狀（Jaundice-like condition）"
  ] },

/* 二、SNRI：含末端二級胺之 TCA */
{ id: "desipramine", chapter: 3, name: "Desipramine", type: "drug", group: "TCA-SNRIs", source: "統整（一）p.36", img: "assets/medchem/desipramine.png",
  use: ["{{抗憂鬱|用途}}（選擇性抑制 NE 再吸收）"],
  bold: [
    "為 {{Imipramine|藥名}} 經 N-去甲基化後的活性代謝物（Des-）",
    "屬於 {{Dihydrobenzazepine|結構}} 類",
    "主要由 {{CYP2D6|酵素}} 在 N 之對位進行 2-hydroxylation",
    "次要由 CYP1A2、CYP2C19 於支鏈進行 N-去甲基化，形成{{一級胺|結構}}（以上兩者均為無活性代謝物）"
  ] },
{ id: "nortriptyline", chapter: 3, name: "Nortriptyline", type: "drug", group: "TCA-SNRIs", source: "統整（一）p.36", img: "assets/medchem/nortriptyline.png",
  use: ["{{抗憂鬱|用途}}（選擇性抑制 NE 再吸收）"],
  bold: [
    "為 {{Amitriptyline|藥名}} 經 N-去甲基化後的活性代謝物（Nor-）",
    "屬於 {{Dibenzocycloheptene|結構}} 類",
    "主要由 CYP2D6 在支鏈進行 N-demethylation，形成一級胺（無活性）",
    "次要由 CYP2D 在 benzylic / C₁₀ 進行 hydroxylation，形成活性代謝物 {{E-10-hydroxynortriptyline|代謝物}}（Z form 無活性）"
  ] },
{ id: "amoxapine", chapter: 3, name: "Amoxapine", type: "drug", group: "TCA-SNRIs", source: "統整（一）p.36", img: "assets/medchem/amoxapine.png",
  use: ["{{抗憂鬱|用途}}（為最快代謝排除的 TCA）"],
  bold: [
    "屬於 {{Dibenzoxepine|結構}} 類（含 N、O 七元雜環）",
    "支鏈非三個碳：以 {{piperazinyl|取代基}} 取代；2 號位有 Cl 取代",
    "由 {{Loxapine|藥名}}（抗精神病藥）經 N-demethylation 而來",
    "可由 {{CYP3A4|酵素}} 在沒有接 Cl 的環上進行 hydroxylation，形成 7/8-hydroxyamoxapine（皆具活性）",
    "不可和 {{Ketoconazole|藥名}} 併服，因兩者都由 CYP3A4 代謝"
  ] },
{ id: "protriptyline", chapter: 3, name: "Protriptyline", type: "drug", group: "TCA-SNRIs", source: "統整（一）p.37", img: "assets/medchem/protriptyline.png",
  use: ["{{抗憂鬱|用途}}（選擇性抑制 NE 再吸收）"],
  bold: [
    "屬於 {{Dibenzocycloheptriene|結構}} TCA",
    "TCA 中唯一中間環有 {{C=C 雙鍵|結構}}者",
    "與 Nortriptyline 只差再一個雙鍵在環內、一個雙鍵再環外",
    "中央環之雙鍵容易形成 {{epoxide|代謝物}}，再被 H₂O 開環接上兩個 OH 基，形成無活型的 {{diol|代謝物}} 代謝物"
  ] },
{ id: "maprotiline", chapter: 3, name: "Maprotiline", type: "drug", group: "TCA-SNRIs", source: "統整（一）p.37", img: "assets/medchem/maprotiline.png",
  use: ["{{抗憂鬱|用途}}（選擇性抑制 NE 再吸收）"],
  bold: [
    "屬 {{Dibenzobicyclooctadiene|結構}} 四環類 TCA",
    "第四環由雙碳橋 ethylene bridge 連接中央六元環之 para 位，形成 {{bicyclo-molecular|結構}}",
    "主要由多型 Polymorphic 的 {{CYP2D6|酵素}}、CYP2C19 代謝",
    "N-demethylation 形成有活性的代謝物；N-oxidation 形成{{無活性|性質}}的 Maprotiline-N-oxide"
  ] },

/* 非三環結構之選擇性 NE 再回收抑制劑（Non-TCA SNRIs） */
{ id: "reboxetine", chapter: 3, name: "Reboxetine", type: "drug", group: "Non-TCA SNRIs", source: "統整（一）p.37", img: "assets/medchem/reboxetine.png",
  use: ["{{抗憂鬱|用途}}（選擇性抑制 NE 再吸收）"],
  bold: [
    "結構為 {{Phenoxyphenylpropylamine|結構}} 類",
    "含有 {{Morpholine|結構}} 結構",
    "有兩個 chiral center → {{S,S-(+)-enantiomer|結構}} 活性較大",
    "由 {{CYP3A4|酵素}} 負責代謝，主要進行 O-dealkylation，產生無活性代謝物（去除乙氧基的 ethyl group）"
  ] },
{ id: "atomoxetine", chapter: 3, name: "R-(-)-Atomoxetine", short: "Atomoxetine", type: "drug", group: "Non-TCA SNRIs", source: "統整（一）p.37", img: "assets/medchem/atomoxetine.png",
  use: ["治療孩童過動症 {{ADHD|疾病}} 及成人憂鬱症"],
  bold: [
    "結構為 Phenoxyphenylpropylamine 類",
    "{{R form|結構}} 與 NET 的親和力強 10 倍",
    "較無抗膽鹼及心血管方面的副作用",
    "主要由 {{CYP2D6|酵素}} 在 phenoxy group 對位進行 hydroxylation，形成有活性的 4-hydroxy-(R)-代謝物",
    "次要由 CYP2C19 在支鏈進行 N-demethylation"
  ] },

/* 三、SSRI：憂鬱症首選用藥（同時為第一線抗焦慮用藥） */
{ id: "fluoxetine-ad", chapter: 3, name: "Fluoxetine", type: "drug", group: "SSRI：Phenoxyphenylalkylamine", source: "統整（一）p.38", img: "assets/medchem/fluoxetine.png",
  use: ["{{抗焦慮|用途}}、抗憂鬱（SSRI 為憂鬱症首選用藥）"],
  bold: [
    "市售為消旋化合物，但 {{S form|結構}} 效果較強",
    "含有 {{CF₃|取代基}} 取代基",
    "為 {{CYP2D6|酵素}} 強力抑制劑",
    "主要由 CYP2D6 行 N-去甲基化，形成活性代謝物 {{Norfluoxetine|代謝物}}",
    "本分類的三個藥物之胺基都會質子化並與自身氧原子形成氫鍵 → 形成 {{β-arylamino-like group|結構}}"
  ] },
{ id: "paroxetine", chapter: 3, name: "Paroxetine", type: "drug", group: "SSRI：Phenoxyphenylalkylamine", source: "統整（一）p.38", img: "assets/medchem/paroxetine.png",
  use: ["{{抗焦慮|用途}}、抗憂鬱"],
  bold: [
    "Fluoxetine 的{{閉環|結構}}類似物",
    "具有兩個 chiral center，所以有 4 個異構物 → 市售以 {{(3S,4R)-(-)-enantiomer|結構}} 為主",
    "為 {{CYP2D6|酵素}} 強力抑制劑"
  ] },
{ id: "citalopram", chapter: 3, name: "Citalopram / Escitalopram", short: "Citalopram", type: "drug", group: "SSRI：Phenoxyphenylalkylamine", source: "統整（一）p.38", img: "assets/medchem/citalopram.png",
  use: ["{{抗焦慮|用途}}、抗憂鬱"],
  bold: [
    "由 Talopram、S-Talsupram 衍生而來",
    "含有 {{C≡N|結構}}、F 原子",
    "其 S-enantiomer 稱為 {{Escitalopram|藥名}}，對受體有高度親和力與選擇性",
    "進行 N-demethylation，主要代謝物仍有 {{50%|數值}}活性"
  ] },
{ id: "sertraline", chapter: 3, name: "Sertraline", type: "drug", group: "SSRI：Phenylalkylamine", source: "統整（一）p.39", img: "assets/medchem/sertraline.png",
  use: ["{{抗焦慮|用途}}、抗憂鬱"],
  bold: [
    "含有 {{tetralin|結構}} 結構，為 phenylaminotetralin",
    "具有兩個 chiral center → 市售以 {{S,S-(+)-diastereomer|結構}} 為主",
    "主要經 {{CYP2B6|酵素}} 行 N-去甲基化，主要代謝物活性比原來小 5-10 倍 → 仍屬於活性代謝物"
  ] },
{ id: "fluvoxamine", chapter: 3, name: "Fluvoxamine", type: "drug", group: "SSRI：Miscellaneous", source: "統整（一）p.39", img: "assets/medchem/fluvoxamine.png",
  use: ["{{抗焦慮|用途}}、抗憂鬱"],
  bold: [
    "屬於 {{nontricyclic SERT inhibitor|名詞}}",
    "使用上以 {{E form|結構}} 為主（異側）",
    "由 {{Noxiptilin|藥名}} 開環修飾得到",
    "苯環對位上有 {{CF₃|取代基}} 取代基，具有長碳鏈脂溶性端（aliphatic）",
    "{{CYP2D6|酵素}} 行 O-去甲基化，最後氧化成酸"
  ] },

/* 四、DNRI */
{ id: "bupropion", chapter: 3, name: "Bupropion", type: "drug", group: "DNRI", source: "統整（一）p.40", img: "assets/medchem/bupropion.png",
  use: ["{{抗憂鬱|用途}}，也能降低菸癮作為{{戒菸用藥|用途}}"],
  bold: [
    "結構為 {{phenylisopropylaminoketone|結構}}，由甲基安非他命衍生而來",
    "含有 {{tert-butyl|取代基}} group → 可防止藥物進行 N-dealkylation 代謝 → 防止擬交感神經活性或厭食症 anorexigenic",
    "為{{最不會|性質}}有體重增加的副作用★",
    "tert-butyl 其中任一甲基可由 {{CYP2B6|酵素}} 氧化形成 hydroxybupropion（50% 活性代謝物）",
    "酮也可被還原成 OH，形成具兩個 chiral center 之活性代謝物"
  ] },

/* 五、SRM/SARI */
{ id: "trazodone", chapter: 3, name: "Trazodone", type: "drug", group: "SRM/SARI：Arylpiperazine", source: "統整（一）p.41", img: "assets/medchem/trazodone.png",
  use: ["{{抗憂鬱|用途}}（具雙重作用）"],
  bold: [
    "為 {{phenylpiperazine-triazolopyridine|結構}}★類",
    "雙重作用：{{5-HT2A antagonist|機轉}}★、弱的 5-HT reuptake inhibitor",
    "主要由 CYP3A4 進行 N-dealkylation，產生 Triazolopyridinone-propionic acid / TPP 和 {{m-CPP|代謝物}}（活性★代謝物）",
    "次要由 CYP3A4 在苯環 para 位加上 OH 後，於 pyridine 形成環氧基，若用親核基開環產生{{肝毒性|副作用}}"
  ] },
{ id: "aripiprazole", chapter: 3, name: "Aripiprazole", type: "drug", group: "SRM/SARI：Arylpiperazine", source: "統整（一）p.41", img: "assets/medchem/aripiprazole.png",
  use: ["抗精神病、{{抗憂鬱|用途}}（用於急性躁狂及躁鬱症，青少年及成人皆可）"],
  bold: [
    "結構含有 {{quinolinone|結構}}，苯環有兩個 Cl",
    "同時為第二代{{抗精神病|用途}}藥物，具有雙重作用",
    "經 {{CYP3A4|酵素}} 進行 Dehydroxylation，脫水形成雙鍵 → 產生活性代謝物 Dehydroaripiprazole",
    "經 CYP3A4 進行 N-dealkylation，產生有活性的 {{DCPP|代謝物}}"
  ] },
{ id: "vilazone", chapter: 3, name: "Vilazone", type: "drug", group: "SRM/SARI：Indole", source: "統整（一）p.41", img: "assets/medchem/vilazone.png",
  use: ["{{抗憂鬱|用途}}（5-HT 的部分促效劑及再回收抑制劑）"],
  bold: [
    "為 {{phenylpiperazine-2-benzofuran-carboxamide|結構}} 類",
    "含有 {{Indole|結構}}、C≡N 結構，具有雙重作用",
    "主要由 {{CYP3A4|酵素}} 代謝；次要為 CYP2C19、CYP2D6",
    "在苯環 6 號位進行 hydroxylation，產生{{無活性|性質}}代謝物"
  ] },

/* 六、NaSSA */
{ id: "nassa-topic", chapter: 3, name: "NaSSA 機轉與比較", short: "NaSSA 比較", type: "topic", group: "NaSSA", source: "統整（一）p.42",
  bold: [
    "機轉：{{α₂-antagonist|機轉}} 和 5-HT₃ antagonist，可以增強傳遞 NE 或 5-HT（沒有抑制再回收的作用）",
    "Mirtazapine 屬於 {{pyrazinopyridobenzazepine|結構}} 類抗憂鬱藥",
    "Mirtazapine 和 Mianserin 互為 {{isostere|名詞}}（生物等效物）",
    "Mirtazapine 含有 {{pyridine|結構}} 結構；Mianserin 含有 benzene 結構",
    "右邊苯環之 6 號位：Mianserin 為 C（benzene）、Mirtazapine 為 N（pyridine）",
    "對 NET 之影響：Mianserin 為 {{NET inhibitor|機轉}}、Mirtazapine 無影響",
    "Mianserin 僅在歐洲使用，美國不使用，會造成{{顆粒性白血球缺乏症|副作用}}、白血球減少症",
    "Mirtazapine 以 pyridine 取代苯環，造成極性增加、分配係數下降（水溶性↑）、鹼度下降、NET 抑制劑活性較弱",
    "副作用：鎮靜、{{體重上升|副作用}}★，但不會影響性功能",
    "代謝：2 號位 C 進行 N-desmethylation、8 號位 C 水解加上 OH 形成 8-hydroxymirtazapine（皆微弱活性）；{{N-oxide|代謝}} 之代謝產物無活性"
  ] },
{ id: "mianserin", chapter: 3, name: "Mianserin", type: "drug", group: "NaSSA", source: "統整（一）p.42", img: "assets/medchem/mianserin.png",
  use: ["{{抗憂鬱|用途}}（僅歐洲使用）"],
  bold: [
    "右邊第六號位為 {{C|離子}}（benzene）",
    "對 NET 為 {{NET inhibitor|機轉}}",
    "副作用太大，改用 Mirtazapine"
  ] },
{ id: "mirtazapine", chapter: 3, name: "Mirtazapine", type: "drug", group: "NaSSA", source: "統整（一）p.42", img: "assets/medchem/mirtazapine.png",
  use: ["{{抗憂鬱|用途}}"],
  bold: [
    "右邊第六號位為 {{N|離子}}（pyridine，-aza-）",
    "對 NET {{無影響|性質}}",
    "副作用：鎮靜、{{體重上升|副作用}}★，但不影響性功能"
  ] },

/* 七、MAOI */
{ id: "maoi-topic", chapter: 3, name: "MAOI 藥物簡介", short: "MAOI 簡介", type: "topic", group: "MAOI", source: "統整（一）p.43",
  bold: [
    "由 {{Isoniazid|藥名}}（抗分枝桿菌藥物）衍生而來，具有單胺氧化酶抑制作用（減緩單胺被降解），可治療憂鬱症",
    "不能和富含 {{Tyramine|物質}} 的食物併服，會有產生{{高血壓|副作用}}的風險（Tyramine 富含於發酵食物，如紅酒、乳酪、優格、味噌、香腸、培根）",
    "因 MAOI 與多種藥物有交互作用，為抗憂鬱症之{{最後一線|名詞}}用藥"
  ] },
{ id: "phenelzine", chapter: 3, name: "Phenelzine", type: "drug", group: "MAOI", source: "統整（一）p.43", img: "assets/medchem/phenelzine.png",
  use: ["{{抗憂鬱|用途}}（不可逆、無選擇性 MAOI）"],
  bold: [
    "結構為 2-(phenylethyl)-hydrazine，為 {{Hydrazine|結構}} 類的 MAOI",
    "主要代謝物為 {{Phenylacetic acid|代謝物}} 及 p-hydroxyphenylacetic acid",
    "代謝物 β-phenylethylamine 可能會提高腦中 {{GABA|物質}} 的濃度",
    "以 {{N-acetylation|代謝}} 的方式經尿液排出"
  ] },
{ id: "tranylcypromine", chapter: 3, name: "Tranylcypromine", type: "drug", group: "MAOI", source: "統整（一）p.43", img: "assets/medchem/tranylcypromine.png",
  use: ["{{抗憂鬱|用途}}（不可逆、無選擇性 MAOI）"],
  bold: [
    "結構為 (±)-trans-2-phenylcyclopropylamine，為 {{non-Hydrazine|結構}} 類的 MAOI",
    "為 {{Amphetamine|藥名}} 的 cyclopropyl 衍生物",
    "Tranylcypromine = trans-form + {{cyclopropyl|結構}} + amphetamine 衍生物"
  ] },
{ id: "moclobemide", chapter: 3, name: "Moclobemide", type: "drug", group: "MAOI", source: "統整（一）p.43", img: "assets/medchem/moclobemide.png",
  use: ["{{抗憂鬱|用途}}（可逆、具選擇性 MAOI）"],
  bold: [
    "為 {{Benzamide|結構}} 的衍生物，且含有 Morpholine 結構",
    "Moclobemide = morpholine + para-chloro + benzamide 衍生物",
    "具有 {{MAO-A|標的}} 選擇性，可避免嚴重{{低血壓|副作用}}的副作用"
  ] },

/* 八、情緒穩定劑 */
{ id: "lithium", chapter: 3, name: "Lithium（情緒穩定劑）", short: "Lithium", type: "topic", group: "情緒穩定劑", source: "統整（一）p.43",
  bold: [
    "阻斷 {{IP turnover|機轉}}，減少 IP₃ 和 DAG 之合成，進而降低細胞興奮性",
    "抑制 {{GSK-3|標的}} receptor（屬 Serine/Threonine protein kinase，與阿滋海默症、雙極症有關）",
    "可抑制心臟傳導，因此患有心臟疾病之患者應小心使用",
    "使受體和其 G protein {{去偶合|機轉}}★，如使 TSH 受體失效造成甲狀腺功能低下、使 ADH 受體失效造成{{腎因性尿崩症|疾病}}"
  ] },

/* ===== 第 4 章 神經疾病相關藥物（統整（一）肆，p.44–48）===== */
/* 一、帕金森氏症 */
{ id: "pd-classes", chapter: 4, name: "帕金森氏症藥物分類與複方", short: "帕金森分類", type: "topic", group: "帕金森總論", source: "統整（一）p.44",
  bold: [
    "增加 Dopamine 合成：Levodopa（Dopamine 之前驅藥）",
    "抑制 Dopamine 代謝：抑制週邊 Dopamine decarboxylase（Carbidopa、Benserazide）、抑制 COMT（Entacapone、Tolcapone）、不可逆抑制中樞 {{MAO-B|標的}}（Selegiline、Rasagiline）",
    "活化 Dopamine 受體：麥角生物鹼類（Bromocriptine、Pergolide、Lisuride、Cabergoline）、非麥角類（Pramipexole、Ropinirole、Rotigotine、Apomorphine）",
    "降低 ACh 活性：阻斷中樞毒蕈鹼受體（Benztropine、Biperidine、Trihexyphenidyl）、中樞抗膽鹼之 {{H₁-blocker|藥物類別}}（Ethopropazine、Diethazine、Diphenhydramine）",
    "促進 Dopamine 釋放：{{Adenosine A₂ₐ antagonist|機轉}}（Amantadine、Memantine、Istradefylline、Sarizotan）",
    "複方：Sinemet = Levodopa + {{Carbidopa|藥名}}；Madopar = Levodopa + Benserazide；Stalevo = Sinemet + Entacapone",
    "MPPP 水解後可形成 MPTP，再被 {{MAO-B|標的}}★氧化代謝成毒性代謝物 MPP⁺，可產生自由基破壞多巴胺神經"
  ] },
{ id: "levodopa", chapter: 4, name: "Levodopa", type: "drug", group: "增加 Dopamine 合成", source: "統整（一）p.45", img: "assets/medchem/levodopa.png",
  use: ["{{帕金森氏症|疾病}}（Dopamine 之前驅藥）"],
  bold: [
    "Prodrug，{{脫羧|代謝}}★形成 Dopamine，口服空腹使用",
    "具有三級胺結構，可進入 BBB（以 {{Active transport|名詞}} 分布到中樞）",
    "可併用 Carbidopa，避免 Levodopa 進入中樞前被分解",
    "與 Pyridoxine / {{Vit B₆|物質}} 併用會降低 Levodopa 進入中樞的濃度（因 Vit B₆ 可活化 decarboxylase）",
    "副作用：{{On-off phenomenon|副作用}}、厭食、失眠、棕色尿液"
  ] },
{ id: "carbidopa", chapter: 4, name: "Carbidopa", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/carbidopa.png",
  use: ["{{帕金森氏症|疾病}}（與 Levodopa 併用，Sinemet）"],
  bold: [
    "{{Hydrazine|結構}}★衍生物（-NHNH₂）",
    "立體組態：{{S(-) form|結構}}★",
    "抑制{{週邊|位置}}★ Dopamine decarboxylase → 藥物不進入 BBB（又稱 Aromatic L-amino acid decarboxylase）"
  ] },
{ id: "entacapone", chapter: 4, name: "Entacapone", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/entacapone.png",
  use: ["{{帕金森氏症|疾病}}（COMT 抑制劑，週邊作用）"],
  bold: [
    "抑制 {{COMT|酵素}} 分解 Dopamine，用做輔助治療",
    "與{{鐵劑|物質}}併服會降低藥物吸收，需隔開使用",
    "副作用：腹瀉、{{橘棕色尿液|副作用}}"
  ] },
{ id: "tolcapone", chapter: 4, name: "Tolcapone", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/tolcapone.png",
  use: ["{{帕金森氏症|疾病}}（COMT 抑制劑，中樞作用）"],
  bold: [
    "抑制 {{COMT|酵素}} 分解 Dopamine（中樞作用），用做輔助治療",
    "副作用：腹瀉、橘棕色尿液"
  ] },
{ id: "selegiline", chapter: 4, name: "Selegiline", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/selegiline.png",
  use: ["{{帕金森氏症|疾病}}（不可逆抑制 MAO-B）"],
  bold: [
    "基本結構：{{Propargylamine|結構}}★",
    "於 {{R(-)|結構}} 時活性最大",
    "不可逆抑制 {{MAO-B|標的}}★（MAO-A 代謝 NE+5-HT、MAO-B 代謝 Dopamine）",
    "與 Levodopa 併用可能引發{{高血壓急症|副作用}}"
  ] },
{ id: "rasagiline", chapter: 4, name: "Rasagiline", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/rasagiline.png",
  use: ["{{帕金森氏症|疾病}}（不可逆抑制 MAO-B）"],
  bold: [
    "基本結構：{{Propargylamine|結構}}★",
    "於 {{R(+)|結構}} 時活性最大",
    "不可逆抑制 {{MAO-B|標的}}★"
  ] },
/* 活化 Dopamine 受體：麥角生物鹼類 */
{ id: "bromocriptine", chapter: 4, name: "Bromocriptine", type: "drug", group: "活化 Dopamine 受體（麥角）", source: "統整（一）p.46", img: "assets/medchem/bromocriptine.png",
  use: ["{{帕金森氏症|疾病}}、高泌乳血症、肢端肥大症"],
  bold: [
    "活化 D₂、D₃ → {{不活化 5-HT2B|機轉}}，不會造成心毒性",
    "可降低帕金森震顫（Tremor）的發生機率（震顫發生於{{休息靜止時|名詞}}）",
    "具有強效{{抗膽鹼|機轉}}作用",
    "麥角生物鹼類較容易有{{肋膜及心包膜纖維化|副作用}}之副作用"
  ] },
{ id: "lisuride", chapter: 4, name: "Lisuride", type: "drug", group: "活化 Dopamine 受體（麥角）", source: "統整（一）p.46", img: "assets/medchem/lisuride.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "活化 D₂、D₃ → {{不活化 5-HT2B|機轉}}，不會造成心毒性",
    "麥角生物鹼類較容易有肋膜及心包膜纖維化之副作用"
  ] },
{ id: "pergolide", chapter: 4, name: "Pergolide", type: "drug", group: "活化 Dopamine 受體（麥角）", source: "統整（一）p.46", img: "assets/medchem/pergolide.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "活化 D₂、D₃、{{5-HT2B|受體}}（活化 5-HT2B 會造成{{心毒性|副作用}}）",
    "Pergolide 由{{肝臟|器官}}排除，半衰期長"
  ] },
{ id: "cabergoline", chapter: 4, name: "Cabergoline", type: "drug", group: "活化 Dopamine 受體（麥角）", source: "統整（一）p.46", img: "assets/medchem/cabergoline.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "活化 D₂、D₃、{{5-HT2B|受體}}（活化 5-HT2B 會造成心毒性）"
  ] },
/* 活化 Dopamine 受體：非麥角生物鹼類 */
{ id: "pramipexole", chapter: 4, name: "Pramipexole", type: "drug", group: "活化 Dopamine 受體（非麥角）", source: "統整（一）p.46", img: "assets/medchem/pramipexole.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "活化 {{D₂、D₃|受體}} 受體",
    "多巴胺 agonist 副作用：厭食、姿勢性低血壓、{{遲發性運動障礙|副作用}}（Dyskinesia）",
    "Pramipexole 由{{腎臟|器官}}排除，併用 Cimetidine、FQ 抗生素會抑制其代謝"
  ] },
{ id: "ropinirole", chapter: 4, name: "Ropinirole", type: "drug", group: "活化 Dopamine 受體（非麥角）", source: "統整（一）p.46", img: "assets/medchem/ropinirole.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "活化 {{D₂、D₃|受體}} 受體",
    "多巴胺 agonist 副作用：厭食、姿勢性低血壓、遲發性運動障礙"
  ] },
{ id: "rotigotine", chapter: 4, name: "Rotigotine", type: "drug", group: "活化 Dopamine 受體（非麥角）", source: "統整（一）p.46", img: "assets/medchem/rotigotine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "可活化 {{D₁、D₂、D₃|受體}} 受體"
  ] },
{ id: "apomorphine", chapter: 4, name: "Apomorphine", type: "drug", group: "活化 Dopamine 受體（非麥角）", source: "統整（一）p.46", img: "assets/medchem/apomorphine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "可活化 {{D₁、D₂|受體}} 受體",
    "立體組態：{{R(-)|結構}}★"
  ] },
/* 降低 ACh 活性：阻斷中樞毒蕈鹼受體 */
{ id: "benztropine", chapter: 4, name: "Benztropine", type: "drug", group: "降低 ACh 活性（抗蕈鹼）", source: "統整（一）p.47", img: "assets/medchem/benztropine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "阻斷{{膽鹼性受體|標的}}，可產生類似增加多巴胺神經傳導的作用",
    "副作用：散瞳、尿液滯留、口乾，{{青光眼|疾病}}、前列腺肥大患者應避免使用"
  ] },
{ id: "biperidine", chapter: 4, name: "Biperidine", type: "drug", group: "降低 ACh 活性（抗蕈鹼）", source: "統整（一）p.47", img: "assets/medchem/biperidine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "阻斷{{膽鹼性受體|標的}}，產生類似增加多巴胺神經傳導的作用"
  ] },
{ id: "trihexyphenidyl", chapter: 4, name: "Trihexyphenidyl", type: "drug", group: "降低 ACh 活性（抗蕈鹼）", source: "統整（一）p.47", img: "assets/medchem/trihexyphenidyl.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "阻斷{{膽鹼性受體|標的}}，產生類似增加多巴胺神經傳導的作用"
  ] },
/* 降低 ACh 活性：第一代 H1-blockers */
{ id: "ethopropazine", chapter: 4, name: "Ethopropazine", type: "drug", group: "降低 ACh 活性（H₁-blocker）", source: "統整（一）p.47", img: "assets/medchem/ethopropazine.png",
  use: ["{{帕金森氏症|疾病}}（中樞抗膽鹼之 H₁-blocker）"],
  bold: [
    "{{Phenothiazine|結構}}★衍生物"
  ] },
{ id: "diethazine", chapter: 4, name: "Diethazine", type: "drug", group: "降低 ACh 活性（H₁-blocker）", source: "統整（一）p.47", img: "assets/medchem/diethazine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "{{Phenothiazine|結構}} 衍生物"
  ] },
{ id: "diphenhydramine", chapter: 4, name: "Diphenhydramine", type: "drug", group: "降低 ACh 活性（H₁-blocker）", source: "統整（一）p.47", img: "assets/medchem/diphenhydramine.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "{{Aminoalkyl ether|結構}} 類"
  ] },
/* 促進 Dopamine 釋放：Adenosine A2A antagonist */
{ id: "amantadine", chapter: 4, name: "Amantadine", type: "drug", group: "促進 Dopamine 釋放", source: "統整（一）p.47", img: "assets/medchem/amantadine.png",
  use: ["{{帕金森氏症|疾病}}，也當作{{抗病毒|用途}}藥"],
  bold: [
    "抑制毒蕈鹼、{{NMDA 受體|標的}}",
    "副作用：{{網狀青斑|副作用}}"
  ] },
{ id: "istradefylline", chapter: 4, name: "Istradefylline", type: "drug", group: "促進 Dopamine 釋放", source: "統整（一）p.47", img: "assets/medchem/istradefylline.png",
  use: ["{{帕金森氏症|疾病}}（Adenosine A₂ₐ antagonist）"],
  bold: [
    "具有 {{Xanthine|結構}}★結構"
  ] },
{ id: "sarizotan", chapter: 4, name: "Sarizotan", type: "drug", group: "促進 Dopamine 釋放", source: "統整（一）p.47", img: "assets/medchem/sarizotan.png",
  use: ["{{帕金森氏症|疾病}}"],
  bold: [
    "同時是 {{5-HT1A agonist|機轉}}、D₂ partial agonist"
  ] },

/* 二、阿茲海默症 */
{ id: "az-intro", chapter: 4, name: "阿茲海默症藥物簡介", short: "阿茲海默簡介", type: "topic", group: "阿茲海默", source: "統整（一）p.48",
  bold: [
    "為一種神經退化性疾病，原因為腦部神經細胞受到破壞",
    "治療主要有{{膽鹼酯酶抑制劑|藥物類別}}及 NMDA 受體拮抗劑，幫助患者減緩心智功能退化",
    "可逆型膽鹼酯酶抑制劑：皆有{{三級胺|結構}}結構，可穿過 BBB 增加 ACh 濃度"
  ] },
{ id: "donepezil", chapter: 4, name: "Donepezil", type: "drug", group: "膽鹼酯酶抑制劑", source: "統整（一）p.48", img: "assets/medchem/donepezil.png",
  use: ["{{阿茲海默症|疾病}}（商品名 Aricept 愛憶欣）"],
  bold: [
    "具有 {{piperidine|結構}} 結構",
    "過量時可使用 {{Atropine|藥名}} 作為解毒劑"
  ] },
{ id: "galantamine", chapter: 4, name: "Galantamine", type: "drug", group: "膽鹼酯酶抑制劑", source: "統整（一）p.48", img: "assets/medchem/galantamine.png",
  use: ["{{阿茲海默症|疾病}}（商品名 Reminyl 利憶靈）"],
  bold: [
    "天然生物鹼，結構類似 {{Codeine|藥名}}"
  ] },
{ id: "rivastigmine", chapter: 4, name: "Rivastigmine", type: "drug", group: "膽鹼酯酶抑制劑", source: "統整（一）p.48", img: "assets/medchem/rivastigmine.png",
  use: ["{{阿茲海默症|疾病}}（商品名 Exelon 憶思能）"],
  bold: [
    "具有 {{Carbamyl|結構}} group"
  ] },
{ id: "tacrine", chapter: 4, name: "Tacrine", type: "drug", group: "膽鹼酯酶抑制劑", source: "統整（一）p.48", img: "assets/medchem/tacrine.png",
  use: ["{{阿茲海默症|疾病}}（因肝毒性副作用現已下市）"],
  bold: [
    "具有 {{Tetrahydroacridine|結構}} 結構",
    "活性代謝物：{{1-hydroxytacrine|代謝物}}"
  ] },
{ id: "memantine", chapter: 4, name: "Memantine", type: "drug", group: "NMDA 受體拮抗劑", source: "統整（一）p.48", img: "assets/medchem/memantine.png",
  use: ["{{阿茲海默症|疾病}}（NMDA antagonist）"],
  bold: [
    "可阻斷因 {{Glutamate|物質}} 強度升高所導致的神經障礙",
    "用於治療阿茲海默症（比較：Amantadine 用於治療帕金森氏症）"
  ] },

/* 三、亨廷頓舞蹈症 */
{ id: "hd-intro", chapter: 4, name: "亨廷頓舞蹈症藥物簡介", short: "亨廷頓簡介", type: "topic", group: "亨廷頓", source: "統整（一）p.48",
  bold: [
    "為一種體染色體顯性遺傳的中樞退化疾病，原因為第四對染色體的基因突變，導致 {{CAG|名詞}} 重複序列過度擴張",
    "治療藥物：降低 {{Dopamine|物質}} 的濃度"
  ] },
{ id: "tetrabenazine", chapter: 4, name: "Tetrabenazine", type: "drug", group: "亨廷頓舞蹈症用藥", source: "統整（一）p.48", img: "assets/medchem/tetrabenazine.png",
  use: ["{{亨廷頓舞蹈症|疾病}}"],
  bold: [
    "{{Dopamine 排空劑|機轉}}"
  ] },
{ id: "clozapine", chapter: 4, name: "Clozapine", type: "drug", group: "亨廷頓舞蹈症用藥", source: "統整（一）p.48", img: "assets/medchem/clozapine.png",
  use: ["{{亨廷頓舞蹈症|疾病}}"],
  bold: [
    "{{非典型抗精神病|藥物類別}}藥物"
  ] },

/* ===== 第 5 章 抗精神病藥物（統整（一）伍，p.49–62）===== */
/* 總論 */
{ id: "ap-pathways", chapter: 5, name: "思覺失調症與多巴胺傳導路徑", short: "多巴胺路徑", type: "topic", group: "總論", source: "統整（一）p.49",
  bold: [
    "精神分裂症與中腦邊緣系統（Mesolimbic-frontal pathway）中的{{多巴胺神經活動增加|機轉}}★有關",
    "黑質紋狀體（Nigrostriatal）管運動，阻斷後產生{{錐體外作用|副作用}}（EPS，類似帕金森氏症）",
    "中腦皮質與邊緣系統（Mesocortical & Mesolimbic）管情緒行為，阻斷後可改善精神分裂症",
    "結節漏斗（Tuberoinfundibular）管荷爾蒙，阻斷後導致{{泌乳激素分泌增加|副作用}}（Prolactin），可使用 Bromocriptine 治療",
    "多巴胺分泌過多：{{精神分裂症|疾病}}★、藥物或酒精濫用；分泌過少：帕金森氏症★、高泌乳激素血症",
    "大多數抗精神病藥物阻斷中樞神經節後 {{D₂ receptor|標的}}",
    "Anticholinergic agents（如 {{Benztropine|藥名}}）可改善錐體外症狀的副作用"
  ] },
{ id: "ap-se-summary", chapter: 5, name: "抗精神病藥物副作用總整理", short: "抗精神病副作用", type: "topic", group: "總論", source: "統整（一）p.48,62",
  bold: [
    "錐體外症狀（EPS）：主要由{{第一代|名詞}}★抗精神病藥物引起",
    "高泌乳素血症：{{Risperidone|藥名}}★、Paliperidone 容易產生（Prolactin 分泌被 Dopamine 所抑制）",
    "顆粒性白血球減少：嚴重程度 {{Clozapine|藥名}}★ > Chlorpromazine > Olanzapine",
    "體重增加：第二代較易產生（與阻斷 5-HT 受體有關），程度 {{Olanzapine|藥名}}★ > Risperidone > Quetiapine",
    "鎮靜最強：{{Chlorpromazine|藥名}}；EPS 最強：Haloperidol；最不會增加體重：Ziprasidone"
  ] },
{ id: "ptz-sar", chapter: 5, name: "Phenothiazine（PTZ）結構與 SAR", short: "PTZ SAR", type: "topic", group: "第一代：Phenothiazine", source: "統整（一）p.49",
  bold: [
    "第一代主要治療{{正向症狀|名詞}}，且具有止吐作用（第二代無止吐作用）",
    "依 N-10 取代基分三類：Aliphatic 直鏈（-promazine，活性最弱、EPS 最弱、{{鎮靜最強|性質}}★）、Piperidine（-ridazine）、Piperazine（末端 CH₃：-perazine／末端 OH：-phenazine，活性最強、{{EPS 最強|性質}}★、鎮靜最弱）",
    "Site A：當末端從 -CH₃ 變成 {{-NC₂H₅OH|取代基}} 時，為最強效之 PTZs",
    "Site B：只有{{三個碳|數值}}★的長度才具抗精神病活性，且三個碳上都不可有分支；若為兩個碳，則具抗組織胺 H₁、抗毒蕈鹼活性（為帕金森氏症藥物）",
    "Site C：Phenothiazine 結構非同平面，而是折成{{蝶翼|名詞}}的形狀；Site A 和 C 必為 cis form；取代基只能在 2 號碳上（S 的對位）；取代基為拉電子基時可增加活性（-Cl、-CF₃★等）",
    "本章藥物主要以 {{D₂-receptor blockers|藥物類別}} 為主（以 mesolimbic-frontal pathway 為主）"
  ] },
/* Phenothiazine — Aliphatic（-promazine） */
{ id: "chlorpromazine", chapter: 5, name: "Chlorpromazine", type: "drug", group: "第一代：Phenothiazine（Aliphatic）", source: "統整（一）p.50", img: "assets/medchem/chlorpromazine.png",
  use: ["{{抗精神病|用途}}（CPZ，鎮靜副作用最強）"],
  bold: [
    "2 號位上有 {{Cl|取代基}} 取代基",
    "10 號位有 propyldimethylamino group（三級胺）",
    "為了模仿 Dopamine 的構型，直鏈胺基支鏈會偏向含氯取代的環",
    "代謝：由 {{CYP2D6|酵素}} 進行 C₇-Hydroxylation；{{Sulfoxide|代謝物}} 代謝物沒有活性★",
    "{{鎮靜|副作用}}副作用最強；具有光敏感性"
  ] },
{ id: "triflupromazine", chapter: 5, name: "Triflupromazine", type: "drug", group: "第一代：Phenothiazine（Aliphatic）", source: "統整（一）p.50", img: "assets/medchem/triflupromazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["2 號位上有 {{CF₃|取代基}} 取代基"] },
/* Phenothiazine — Piperidine（-ridazine） */
{ id: "thioridazine", chapter: 5, name: "Thioridazine", type: "drug", group: "第一代：Phenothiazine（Piperidine）", source: "統整（一）p.50", img: "assets/medchem/thioridazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "2 號位上有 {{-SCH₃|取代基}} 取代基",
    "氧化代謝為兩倍活性代謝物 {{Mesoridazine|代謝物}}，多巴胺受體效價從 10nM→4nM（藥物會拮抗多巴胺受體）"
  ] },
{ id: "mesoridazine", chapter: 5, name: "Mesoridazine", type: "drug", group: "第一代：Phenothiazine（Piperidine）", source: "統整（一）p.50", img: "assets/medchem/mesoridazine.png",
  use: ["{{抗精神病|用途}}（Thioridazine 的活性代謝物）"],
  bold: ["meso：甲基接在 {{S|離子}} 上"] },
/* Phenothiazine — Piperazine（-phenazine／-perazine） */
{ id: "perphenazine", chapter: 5, name: "Perphenazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/perphenazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "Piperazine 末端有 -NCH₃CH₃OH；2 號位上有 {{Cl|取代基}} 取代基（結構與 chlorpromazine 相似）",
    "末端 OH 可做成脂肪酸鹽類 Perphenazine enanthate → {{長效 IM|給藥途徑}} 注射"
  ] },
{ id: "fluphenazine", chapter: 5, name: "Fluphenazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/fluphenazine.png",
  use: ["{{抗精神病|用途}}（高效價，有嚴重 EPS）"],
  bold: [
    "Piperazine 末端有 -NCH₃CH₃OH；2 號位上有 {{CF₃|取代基}} 取代基（結構與 triflupromazine 相似）",
    "末端 OH 可做成酯類前驅藥 Fluphenazine decanoate/enanthate → {{長效 IM|給藥途徑}} 注射★"
  ] },
{ id: "trifluperazine", chapter: 5, name: "Trifluperazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/trifluperazine.png",
  use: ["{{抗精神病|用途}}（高效價，有嚴重 EPS）"],
  bold: ["Piperazine 末端有 {{-CH₃|取代基}}；結構與 Fluphenazine 相似"] },
{ id: "prochlorperazine", chapter: 5, name: "Prochlorperazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/prochlorperazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["末端有 -CH₃，結構與 {{Perphenazine|藥名}} 相似"] },
{ id: "thiethylperazine", chapter: 5, name: "Thiethylperazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/thiethylperazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["末端有 -CH₃，結構與 {{Thioridazine|藥名}} 相似"] },
{ id: "acetophenazine", chapter: 5, name: "Acetophenazine", type: "drug", group: "第一代：Phenothiazine（Piperazine）", source: "統整（一）p.51", img: "assets/medchem/acetophenazine.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["末端含 {{OH|取代基}} 基"] },
/* Thioxanthene（-thix-） */
{ id: "thiothixene", chapter: 5, name: "Thiothixene", type: "drug", group: "第一代：Thioxanthene", source: "統整（一）p.52", img: "assets/medchem/thiothixene.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "Thioxanthene 類：C9 上接烯雙鍵（olefinic double bond），存在順反異構物且 {{cis form|結構}} 活性大",
    "具有 {{Sulfonamide|結構}} 結構；cis form（Z form）的活性較強；可製成 hydrochloride 鹽類"
  ] },
{ id: "flupenthixol", chapter: 5, name: "Flupenthixol", type: "drug", group: "第一代：Thioxanthene", source: "統整（一）p.52", img: "assets/medchem/flupenthixol.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "末端 piperazine 上的 OH 可被做成脂肪酸鹽類 Flupenthixol decanoate，用於{{長效 IM|給藥途徑}} 注射"
  ] },
/* Butyrophenone（-peridol／-perone） */
{ id: "butyrophenone", chapter: 5, name: "Butyrophenone 藥效基團", short: "Butyrophenone", type: "topic", group: "第一代：Butyrophenone", source: "統整（一）p.55", img: "assets/medchem/butyrophenone.png",
  bold: ["Butyrophenone 為此類藥物之{{藥效基團|名詞}}；字尾 -peridol（R group 含 OH）、-perone（R group 含 C=O）"] },
{ id: "haloperidol", chapter: 5, name: "Haloperidol", type: "drug", group: "第一代：Butyrophenone", source: "統整（一）p.55", img: "assets/medchem/haloperidol.png",
  use: ["{{抗精神病|用途}}（高效價，有最嚴重 EPS）"],
  bold: [
    "R group 有 OH 基（-peridol），具有 {{Fluorobutyrophenone|結構}} 結構；含 F、Cl 兩種鹵素",
    "Piperidine 與羰基隔 {{3C|數值}} 時活性最強；苯環對位有 F 取代 → 減少藥物被代謝去活化",
    "代謝：高低劑量有不同代謝酵素 {{CYP3A4|酵素}}（高）、CYP2D6（低）、CYP1A2（抽菸）；代謝物 p-fluorophenylacetic acid 和 glycine 結合",
    "{{遲發性運動困難|副作用}}（Tardive dyskinesia）：代謝後產物不可逆烷化 D₂ 受體，使受體過度敏感而讓運動機能亢進",
    "可製成脂肪酸鹽類 decanoate → 長效 IM 注射；也會造成{{高泌乳素血症|副作用}}★"
  ] },
{ id: "droperidol", chapter: 5, name: "Droperidol", type: "drug", group: "第一代：Butyrophenone", source: "統整（一）p.55", img: "assets/medchem/droperidol.png",
  use: ["{{抗精神病|用途}}（短效型★，麻醉前處理）"],
  bold: [
    "R group 有 C=O 基（Dro-perone）；具 Fluorobutyrophenone 結構",
    "具有 tetrahydropyridine 結構（有雙鍵）、{{imidazolone|取代基}} 取代基",
    "短效型★，還有鎮靜、麻醉、止吐作用；麻醉時會與止痛藥 {{Fentanyl|藥名}} 並用"
  ] },
{ id: "trifluperidol", chapter: 5, name: "Trifluperidol", type: "drug", group: "第一代：Butyrophenone", source: "統整（一）p.55", img: "assets/medchem/trifluperidol.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["R group 含 {{-OH|取代基}}"] },
{ id: "spiperone", chapter: 5, name: "Spiperone", type: "drug", group: "第一代：Butyrophenone", source: "統整（一）p.55", img: "assets/medchem/spiperone.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["R group 含 C=O，具有 {{Spiro|結構}} 螺環結構"] },
/* Diphenylbutyl piperidine */
{ id: "pimozide", chapter: 5, name: "Pimozide", type: "drug", group: "第一代：Diphenylbutyl piperidine", source: "統整（一）p.56", img: "assets/medchem/pimozide.png",
  use: ["治療 {{Tourette syndrome|疾病}}"],
  bold: [
    "將 Butyrophenone 的酮基以 {{4-Fluorophenyl|取代基}} 取代，可有效降低藥物的代謝、增強作用時間",
    "結構與 Droperidol 相似，差異在 piperidine 及 C=O 基被取代為 4-Fluorophenyl → 具有 {{di-4-fluorophenylmenthane|結構}} 結構"
  ] },
{ id: "penfluridol", chapter: 5, name: "Penfluridol", type: "drug", group: "第一代：Diphenylbutyl piperidine", source: "統整（一）p.56", img: "assets/medchem/penfluridol.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["結構中共有{{五個 F 原子|數值}}（Pentafluridol）"] },
{ id: "fluspirilene", chapter: 5, name: "Fluspirilene", type: "drug", group: "第一代：Diphenylbutyl piperidine", source: "統整（一）p.56", img: "assets/medchem/fluspirilene.png",
  use: ["{{抗精神病|用途}}"],
  bold: ["具有{{螺環|結構}}（Spiro）結構，結構與 Spiperone 相似"] },
/* Benzamide */
{ id: "metoclopramide", chapter: 5, name: "Metoclopramide", type: "drug", group: "第一代：Benzamide", source: "統整（一）p.57", img: "assets/medchem/metoclopramide.png",
  use: ["{{抗精神病|用途}}、最常用的{{止吐藥|用途}}★（Promeran）"],
  bold: [
    "{{Benzamide|結構}}★衍生物；苯環上有 Cl 取代",
    "{{D₂ 受體拮抗劑|機轉}}；增加胃的收縮力，可促進腸胃蠕動★與胃部排空"
  ] },
{ id: "sulpiride", chapter: 5, name: "S-(-)-Sulpiride", short: "Sulpiride", type: "drug", group: "第一代：Benzamide", source: "統整（一）p.57", img: "assets/medchem/sulpiride.png",
  use: ["{{抗精神病|用途}}（錐體外副作用較小）"],
  bold: [
    "末端環化成 pyrrolidine（字尾 -piride）；具有 {{Sulfonamide|結構}}、Benzamide 結構",
    "{{水溶性高|性質}}，難以通過 BBB → 口服吸收率低、效價低"
  ] },
{ id: "amisulpiride", chapter: 5, name: "Amisulpiride", type: "drug", group: "第一代：Benzamide", source: "統整（一）p.57", img: "assets/medchem/amisulpiride.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "為 Sulpiride 之對位胺基-外消旋同類物（racemic para-amino congener）；具有 {{Sulfone|結構}} 結構"
  ] },
{ id: "remoxipride", chapter: 5, name: "Remoxipride", type: "drug", group: "第一代：Benzamide", source: "統整（一）p.57", img: "assets/medchem/remoxipride.png",
  use: ["{{抗精神病|用途}}（已下市）"],
  bold: [
    "苯環上有 {{Br|取代基}} 取代",
    "效價與 Haloperidol 相似，但錐體外作用、自主神經副作用較少",
    "造成{{再生不良性貧血|副作用}}（Aplastic anemia），已下市"
  ] },

/* 二、第二代精神病藥物（非典型）：主要阻斷 5-HT₂ receptor */
{ id: "ap2-misc", chapter: 5, name: "第二代（非典型）總論", short: "第二代總論", type: "topic", group: "第二代：總論", source: "統整（一）p.56",
  bold: ["第二代精神病藥物（非典型）主要阻斷 {{5-HT₂|受體}} receptor"] },
{ id: "aripiprazole-ap", chapter: 5, name: "Aripiprazole", type: "drug", group: "第二代：Miscellaneous", source: "統整（一）p.58", img: "assets/medchem/aripiprazole.png",
  use: ["{{抗精神病|用途}}、抗憂鬱"],
  bold: [
    "{{Arylpiperazine quinolinone|結構}}★衍生物（Aryl- 表示芳香環上有 piperazine 取代）"
  ] },
{ id: "molindone", chapter: 5, name: "Molindone", type: "drug", group: "第二代：Miscellaneous", source: "統整（一）p.58", img: "assets/medchem/molindone.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "{{Tetrahydro-indole|結構}} 的酮類衍生物（六元環上的兩個雙鍵被飽和）",
    "與 Ondansetron★同屬 {{β-aminoketones|結構}}★（Ondansetron 為 5-HT₃ 拮抗劑，用於止吐）",
    "具有 {{Morpholine|結構}} 取代基"
  ] },
{ id: "sertindole", chapter: 5, name: "Sertindole", type: "drug", group: "第二代：Miscellaneous", source: "統整（一）p.58", img: "assets/medchem/sertindole.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "{{Indole|結構}} 結構之衍生物；具有 imidazolin-2-one 取代基、piperidine 結構（比較：Aripiprazole 含 piperazine）",
    "和血清素（Serotonin）有類似結構"
  ] },
/* Benzazepine（-apine） */
{ id: "benzazepine-table", chapter: 5, name: "Benzazepine 類結構總覽", short: "Benzazepine 總覽", type: "topic", group: "第二代：Benzazepine", source: "統整（一）p.59",
  bold: [
    "Clozapine：X=N、R=CH₃、兩苯環、8-Cl",
    "Olanzapine：X=N、R=CH₃、苯環+{{thiophene|結構}}、CH₃",
    "Loxapine：X={{O|離子}}、R=CH₃、兩苯環、2-Cl",
    "Quetiapine：X={{S|離子}}、兩苯環",
    "Asenapine：X=O、兩苯環、3-Cl；10-11 雙鍵被飽和，且 10 號 N 被取代成 C（{{pyrrolidine-fused|結構}}，非 piperazine）"
  ] },
{ id: "clozapine-ap", chapter: 5, name: "Clozapine", type: "drug", group: "第二代：Benzazepine", source: "統整（一）p.59", img: "assets/medchem/clozapine-ap.png",
  use: ["{{抗精神病|用途}}（Clozaril，第二代之原型 Prototype）"],
  bold: [
    "為 {{Dibenzodiazepine|結構}}★結構；苯環上有 8-Cl 取代",
    "為多種 GPCRs 之拮抗劑；對 {{D₄ 受體|標的}}有高親和性 → EPS 最少；長期使用不會造成 Tardive dyskinesia",
    "副作用：{{顆粒性白血球缺乏|副作用}}（Agranulocytosis）、體重增加、鎮靜、癲癇"
  ] },
{ id: "olanzapine", chapter: 5, name: "Olanzapine", type: "drug", group: "第二代：Benzazepine", source: "統整（一）p.59", img: "assets/medchem/olanzapine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "為 {{Thienobenzodiazepine|結構}} 結構；含有 Thiophene 結構；多由 {{CYP1A2|酵素}} 代謝",
    "對 D₂ 和 5-HT₂A 受體有高親和力；{{體重增加|副作用}}副作用最明顯★，但不會造成顆粒性白血球缺乏"
  ] },
{ id: "loxapine", chapter: 5, name: "Loxapine", type: "drug", group: "第二代：Benzazepine", source: "統整（一）p.60", img: "assets/medchem/loxapine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "為 {{Dibenzooxazepine|結構}} 結構；苯環上有 2-Cl 取代",
    "對 D₂、5-HT₁、H₁ 受體有高親和力，但為弱的 M₁ 拮抗劑；活性代謝物對 D₂ 的親和力更強",
    "N-去甲基後的代謝物 {{Amoxapine|代謝物}} 被用作抗憂鬱藥物"
  ] },
{ id: "quetiapine", chapter: 5, name: "Quetiapine", type: "drug", group: "第二代：Benzazepine", source: "統整（一）p.60", img: "assets/medchem/quetiapine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "為 {{Dibenzothiazepine|結構}} 結構；多由 {{CYP3A4|酵素}} 代謝；活性代謝物：7-hydroxyquetiapine",
    "對 H₁ 受體有高度親和力；對 D₂/₃、5-HT₂A 有中度親和力；對 M₁ 為弱的拮抗劑（因側鏈非甲基）"
  ] },
{ id: "asenapine", chapter: 5, name: "Asenapine", type: "drug", group: "第二代：Benzazepine", source: "統整（一）p.60", img: "assets/medchem/asenapine.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "為 {{Dihydrodibenzoxepine|結構}} 結構；苯環上有 Cl 取代；由 piperazine 變成 pyrrolidine-fused 結構 → 沒有 piperazine ring",
    "對 {{5-HT|受體}} 受體有超高親和力；副作用 EPS 較預期輕微，體重增加狀況較 Olanzapine 少；經腎臟、糞便排除"
  ] },
/* Benzisoxazole／Benzisothiazole */
{ id: "benzisox-table", chapter: 5, name: "Benzisoxazole／Benzisothiazole 總覽", short: "Benzisoxazole 總覽", type: "topic", group: "第二代：Benzisoxazole/thiazole", source: "統整（一）p.61",
  bold: [
    "此類藥物為選擇性 monoamine neurotransmitter 拮抗劑，主要阻斷 {{5-HT₂A|受體}} 受體",
    "Benzisoxazole（字尾 -peridone）：X=CH（Piperidine）、Y={{O|離子}}、Z=F",
    "Benzisothiazole（字尾 -rasidone）：X=N（Piperazine）、Y={{S|離子}}、Z=H（苯環無取代）"
  ] },
{ id: "risperidone", chapter: 5, name: "Risperidone", type: "drug", group: "第二代：Benzisoxazole（-peridone）", source: "統整（一）p.61", img: "assets/medchem/risperidone.png",
  use: ["{{抗精神病|用途}}（最容易發生高泌乳血症）"],
  bold: [
    "R=H；經 {{9-hydroxylation|代謝}} 後變成活性代謝物 {{Paliperidone|代謝物}}；主要由 CYP2D6/3A4 代謝",
    "半衰期約為 {{22 小時|數值}}；最容易發生高泌乳血症"
  ] },
{ id: "paliperidone", chapter: 5, name: "Paliperidone", type: "drug", group: "第二代：Benzisoxazole（-peridone）", source: "統整（一）p.61",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "R={{OH|取代基}}；為 Risperidone（R=H）經 9-hydroxylation 後的活性代謝物（結構見 Risperidone）",
    "半衰期約為 22 小時；最容易發生高泌乳血症"
  ] },
{ id: "iloperidone", chapter: 5, name: "Iloperidone", type: "drug", group: "第二代：Benzisoxazole（-peridone）", source: "統整（一）p.61", img: "assets/medchem/iloperidone.png",
  use: ["{{抗精神病|用途}}"],
  bold: [
    "結構與 GPCR 結合位皆與 Risperidone 相似；主要由 CYP3A4、CYP2D6 代謝 → {{O-demethylation|代謝}} 產生活性代謝物"
  ] },
{ id: "ziprasidone", chapter: 5, name: "Ziprasidone", type: "drug", group: "第二代：Benzisothiazole（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/ziprasidone.png",
  use: ["{{抗精神病|用途}}（體重增加作用最不明顯）"],
  bold: [
    "R group 具有 {{Cl|取代基}} 取代基；主要由 CYP3A4、{{Aldehyde oxidase|酵素}} 進行代謝",
    "口服生體可用率約 60%，與脂肪類食物併服可增加吸收；{{體重增加|副作用}}作用最不明顯"
  ] },
{ id: "lurasidone", chapter: 5, name: "Lurasidone", type: "drug", group: "第二代：Benzisothiazole（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/lurasidone.png",
  use: ["{{抗精神病|用途}}（Once-daily dosing）"],
  bold: [
    "側鏈由 {{Succinimide|結構}} 和 Norbornane 兩個環狀結構融合而成；主要由 CYP3A4 代謝",
    "半衰期約 18 小時，適合做成每日服用一次的劑型"
  ] },
{ id: "perospirone", chapter: 5, name: "Perospirone", type: "drug", group: "第二代：Benzisothiazole（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/perospirone.png",
  use: ["{{抗精神病|用途}}（在日本上市）"],
  bold: ["Benzisothiazole 類衍生物（補充），在{{日本|名詞}}上市"] },

/* ===== 第 6 章 肌肉鬆弛劑及抗痙攣藥物（統整（一）陸，p.63–67）===== */
/* 骨骼肌鬆弛劑：中樞性（Glycerol Monoethers、Substituted Alkanediols、Benzoxazole、Miscellaneous） */
{ id: "antodyne", chapter: 6, name: "Antodyne", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/antodyne.png",
  use: ["為本類藥物之原型 {{Prototype|名詞}}", "具有{{鎮痛|用途}} Analgesic、{{退燒|用途}} Antipyretics 作用，但肌肉鬆弛效果太短暫，臨床上並不好用"],
  bold: ["結構為 {{3-phenoxy-1,2-propanediol|結構}}"] },
{ id: "mephenesin", chapter: 6, name: "Mephenesin", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/mephenesin.png",
  use: ["{{肌肉鬆弛劑|用途}}"],
  bold: ["屬於 {{Glycerol monoether|結構}} 衍生物", "結構比 Antodyne 多一個{{甲基|取代基}} → 苯環的 {{ortho|位置}} 位多一個甲基"] },
{ id: "chlorphenesin-carbamate", chapter: 6, name: "Chlorphenesin carbamate", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/chlorphenesin-carbamate.png",
  use: ["{{肌肉鬆弛劑|用途}}：為 Mephenesin 的 {{carbamate analog|名詞}}，較為長效"],
  bold: ["具有 {{carbamate|結構}} 結構", "苯環的 {{para|位置}} 位有 Cl 取代"] },
{ id: "methocarbamol", chapter: 6, name: "Methocarbamol", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/methocarbamol.png",
  use: ["{{肌肉鬆弛劑|用途}}：為 Mephenesin 的 carbamate analog，較為長效", "市售多為{{消旋 Racemic|性質}}"],
  bold: ["具有 {{carbamate|結構}} 結構", "苯環的 {{ortho|位置}} 位有{{甲氧基|取代基}}", "標示★為 {{chiral center|名詞}} → 實驗測得 {{R form|結構|S form}} 活性較佳"] },

{ id: "meprobamate", chapter: 6, name: "Meprobamate", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/meprobamate.png",
  use: ["為 {{Carisoprodol|藥名}} 之代謝產物", "具 BZD 藥物之{{鎮靜安眠|用途}}作用 → 常被依賴與濫用"],
  bold: ["結構：具有{{兩個|數值}} carbamate"] },
{ id: "carisoprodol", chapter: 6, name: "Carisoprodol", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/carisoprodol.png",
  use: ["有類似 {{BZD|藥物類別}} 藥物之{{鎮靜安眠|用途}}作用 → 常被依賴與濫用"],
  bold: ["結構：具有 isopropyl、{{biscarbamate|結構}}", "與 Meprobamate 只相差在其中一個 carbamate 的 N 上 H 取代為{{異丙基|取代基}}", "代謝：經 {{N-dealkylation|代謝}} 代謝後變成 {{Meprobamate|代謝物}}"] },
{ id: "metaxalone", chapter: 6, name: "Metaxalone", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/metaxalone.png",
  use: ["{{肌肉鬆弛劑|用途}}：無濫用情況"],
  bold: ["具有 {{oxazolidin-2-one|結構}} 結構", "苯環的兩個 {{meta|位置}} 位具有{{甲基|取代基}}"] },

{ id: "chlorzoxazone", chapter: 6, name: "Chlorzoxazone", type: "drug", group: "Benzoxazole 類衍生物", source: "統整（一）p.65", img: "assets/medchem/chlorzoxazone.png",
  use: ["{{肌肉鬆弛劑|用途}}：市售常見的肌肉鬆弛劑，是否有解痙攣功能仍未知"],
  bold: ["具有 {{oxazolidin-2-one|結構}} 結構", "Cl 取代基接在相對於 O 之{{苯環對位|位置}}"] },

{ id: "orphenadrine", chapter: 6, name: "Orphenadrine", type: "drug", group: "Miscellaneous 雜類藥物", source: "統整（一）p.65", img: "assets/medchem/orphenadrine.png",
  use: ["屬 {{diphenhydramine|藥名}} 類{{抗組織胺|藥物類別}}藥物 → 副作用：頭暈、嗜睡", "具有 CNS {{抗膽鹼|機轉}}作用 → 副作用：{{口乾|副作用}}"],
  bold: ["結構：{{ethanolamine ether|結構}}"] },
{ id: "cyclobenzaprine", chapter: 6, name: "Cyclobenzaprine", type: "drug", group: "Miscellaneous 雜類藥物", source: "統整（一）p.65", img: "assets/medchem/cyclobenzaprine.png",
  use: ["有明顯的{{抗膽鹼|機轉}}作用", "為 {{5-HT₂|受體}} 受體拮抗劑，所以有肌肉鬆弛效果，但不強", "{{沒有|性質}}抗憂鬱作用"],
  bold: ["結構與 {{Amitriptyline|藥名}} 非常類似，僅相差在七元環上的{{雙鍵|取代基}}"] },

/* 骨骼肌鬆弛劑：週邊性（抗 Nm 受體藥物） */
{ id: "nm-blocker-intro", chapter: 6, name: "抗Nm 受體藥物總論", short: "抗Nm 總論", type: "topic", group: "抗Nm 總論", source: "統整（一）p.66",
  bold: [
    "非去極化型尼古丁受體拮抗劑（競爭型）共同結構為 {{Tetrahydroisoquinoline|結構}}",
    "類固醇尼古丁受體拮抗劑（Pancuronium、Vecuronium）屬於{{非去極化|名詞|去極化}}性阻斷劑",
    "去極化性阻斷劑（非競爭型）：{{Succinylcholine|藥名}}",
    "肝腎功能不佳之患者可使用：{{Succinylcholine|藥名}}、Atracurium、Mivacurium"
  ] },
{ id: "d-tubocurarine", chapter: 6, name: "d-Tubocurarine", type: "drug", group: "抗Nm：非去極化（競爭型）", source: "統整（一）p.66", img: "assets/medchem/d-tubocurarine.png",
  use: ["{{非去極化型|機轉}}尼古丁受體拮抗劑（競爭型）"],
  bold: ["共同結構為 {{Tetrahydroisoquinoline|結構}}"] },
{ id: "atracurium", chapter: 6, name: "Atracurium", type: "drug", group: "抗Nm：非去極化（競爭型）", source: "統整（一）p.66", img: "assets/medchem/atracurium.png",
  use: ["{{非去極化型|機轉}}（競爭型）；適合用於{{肝腎疾病|疾病}}之患者"],
  bold: ["經由 {{Hofmann degradation|代謝}}★代謝，形成 {{Laudanosine|代謝物}}★", "也會經由 {{BuchE|酵素}} 代謝"] },
{ id: "mivacurium", chapter: 6, name: "Mivacurium", type: "drug", group: "抗Nm：非去極化（競爭型）", source: "統整（一）p.66", img: "assets/medchem/mivacurium.png",
  use: ["{{非去極化型|機轉}}（競爭型）；適合用於{{肝腎疾病|疾病}}之患者"],
  bold: ["經由 {{BuchE|酵素}} 代謝"] },
{ id: "doxacurium", chapter: 6, name: "Doxacurium", type: "drug", group: "抗Nm：非去極化（競爭型）", source: "統整（一）p.66", img: "assets/medchem/doxacurium.png",
  use: ["{{非去極化型|機轉}}尼古丁受體拮抗劑（競爭型）"],
  bold: [] },
{ id: "pancuronium", chapter: 6, name: "Pancuronium", type: "drug", group: "抗Nm：類固醇型", source: "統整（一）p.66", img: "assets/medchem/pancuronium.png",
  use: ["{{非去極化型|機轉}}尼古丁受體拮抗劑（類固醇型）"],
  bold: ["具有 {{5α-Androstane steroid|結構}} 骨架"] },
{ id: "vecuronium", chapter: 6, name: "Vecuronium", type: "drug", group: "抗Nm：類固醇型", source: "統整（一）p.66", img: "assets/medchem/vecuronium.png",
  use: ["{{非去極化型|機轉}}尼古丁受體拮抗劑（類固醇型）"],
  bold: ["具有 {{5α-Androstane steroid|結構}} 骨架"] },
{ id: "succinylcholine", chapter: 6, name: "Succinylcholine", type: "drug", group: "抗Nm：去極化型", source: "統整（一）p.66", img: "assets/medchem/succinylcholine.png",
  use: ["{{去極化性|機轉}}阻斷劑（非競爭型）"],
  bold: ["為 {{Acetylcholine|藥名}} 的雙體結構（{{diquaternary ammonium ester|結構}}）", "半衰期{{極短|性質}}"] },

/* 抗痙攣劑 */
{ id: "msr-diazepam", chapter: 6, name: "Diazepam", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/msr-diazepam.png",
  use: ["當{{肌肉鬆弛劑|用途}}使用，但 FDA 沒有核准這項適應症"],
  bold: ["屬於 {{Benzodiazepines|藥物類別}} 類藥物", "結合到 GABA_A 的 {{BZD 受體|受體}}，增加 {{Cl⁻|離子}} 的流入"] },
{ id: "baclofen", chapter: 6, name: "Baclofen", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/baclofen.png",
  use: ["為 {{GABA_B|受體}} 受體的{{促效劑|機轉}}★", "減少 {{Ca²⁺|離子}} 的向內電流，抑制脊髓神經元的過極化，降低其活性"],
  bold: ["{{兩性化合物|性質}}，含有 {{GABA|結構}}★結構", "(R)-enantiomer 較具活性，但核准的是{{消旋|性質}}化合物"] },
{ id: "dantrolene", chapter: 6, name: "Dantrolene", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/dantrolene.png",
  use: ["作用位置：骨骼肌細胞的肌漿網 SR，阻斷骨骼肌 {{ryanodine|標的}} Ca²⁺ release channel，抑制離子釋放", "具{{周邊|名詞}}解痙攣效果", "可治療麻醉劑引發的{{惡性高熱|疾病}}"],
  bold: ["為 {{hydantoin|結構}}★衍生物（有 {{ureide|結構}} 骨架），也具有 furan、nitrobenzene 結構", "代謝還原後形成 {{Aminodantrolene|代謝物}}（NO₂→NH₂）"] },
{ id: "tizanidine", chapter: 6, name: "Tizanidine", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/tizanidine.png",
  use: ["促進運動神經元前突觸的 {{α₂受體|受體}} → 抑制興奮性神經活性", "有{{中樞|器官}}活性的肌肉鬆弛效果", "治療因腦或脊髓損傷造成的痙攣"],
  bold: ["為 {{Clonidine|藥名}} 的類似物", "有 {{imidazoline|結構}}、benzothiadiazole 結構", "代謝：三個環的 {{oxidation|代謝}}"] },

/* ===== 第 7 章 利尿劑（統整（三）柒，p.39–46）===== */
{ id: "diu-location", chapter: 7, name: "利尿劑作用位置總論", short: "作用位置", type: "topic", group: "總論", source: "統整（三）p.39",
  bold: [
    "近曲小管：{{碳酸酐酶抑制劑|藥物類別}}（Acetazolamide、Dichlorphenamide）",
    "亨氏套上升支：{{環利尿劑|藥物類別}} Loop（Furosemide、Bumetanide、Torsemide、Ethacrynic acid）",
    "遠曲小管：{{Thiazides|藥物類別}} 利尿劑（Chlorothiazide、Metolazone、Chlorthalidone、Indapamide）",
    "集尿管（阻斷 NaCl）：{{保鉀型利尿劑|藥物類別}}（Spironolactone、Eplerenone、Triamterene、Amiloride）",
    "集尿管（阻斷 H₂O）：抗利尿激素受體拮抗劑 ADH antagonist（{{Tolvaptan|藥名}}）"
  ] },
{ id: "osmotic-intro", chapter: 7, name: "滲透壓型利尿劑總論", short: "滲透壓總論", type: "topic", group: "滲透壓型利尿劑", source: "統整（三）p.40",
  bold: [
    "滲透壓型利尿劑作用在{{亨、近、集|位置}}，副作用為{{心衰竭|副作用}}",
    "可自由通過{{鮑氏囊|器官}}進入腎小管，不會被再吸收（含豐富 OH 基、水溶性極高）",
    "管腔內{{滲透壓增加|機轉}}，使水分從血管進入腎小管",
    "其他類：醣類 Glucose、Sucrose；尿素（{{Urea|物質}}）不具多羥基，但過去還是當作 Osmotic diuretics 使用"
  ] },
{ id: "mannitol", chapter: 7, name: "Mannitol", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/mannitol.png",
  use: ["{{滲透壓型利尿劑|用途}}：最被廣泛使用", "口服吸收不佳，容易被腎小球過濾，但{{不被腎小管再吸收|性質}}★"],
  bold: ["屬於 {{Polyol|結構}} 類（多羥基）化合物", "Mannitol 與 Sorbitol 兩者互為 {{R、S 異構物|性質}}（2-OH 方向不同）", "兩者作用機轉相同"] },
{ id: "sorbitol", chapter: 7, name: "Sorbitol", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/sorbitol.png",
  use: ["{{滲透壓型利尿劑|用途}}"],
  bold: ["與 Mannitol 互為 {{R、S 異構物|性質}}（2-OH 方向不同）", "兩者作用機轉相同"] },
{ id: "isosorbide", chapter: 7, name: "Isosorbide", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/isosorbide.png",
  use: ["可口服", "同時可{{降低眼壓|用途}}，治療青光眼 → 降眼壓效果較利尿效果強", "衍生物 Isosorbide Dinitrate 可治療心絞痛"],
  bold: ["為 Sorbitol 之{{雙五環|結構}}★型態（將 Sorbitol 環化）"] },

{ id: "cai-intro", chapter: 7, name: "碳酸酐酶抑制劑總論", short: "CAI 總論", type: "topic", group: "碳酸酐酶抑制劑", source: "統整（三）p.41",
  bold: [
    "碳酸酐酶抑制劑作用在{{近曲小管|位置}}，字尾 -amide",
    "CA 催化 CO₂+H₂O → {{H₂CO₃|物質}}，碳酸解離為 H⁺+HCO₃⁻",
    "H⁺分泌到腎小管交換 Na⁺、HCO₃⁻再吸收（吸鈉留水）；CAI 抑制此反應使 {{Na⁺|離子}} 無法再吸收",
    "作用點太前面，一般用以治療{{青光眼|疾病}}；副作用：{{代謝性酸中毒|副作用}}"
  ] },
{ id: "acetazolamide", chapter: 7, name: "Acetazolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/acetazolamide.png",
  use: ["{{碳酸酐酶抑制劑|用途}}：可用於急性高山症、青光眼、癲癇、代謝性鹼中毒、尿液鹼化劑", "會產生全身性{{酸中毒|副作用}}，使用上受限制"],
  bold: ["具有 {{thiadiazole|結構}}★結構", "本類藥物皆含有 {{Sulfonamide|結構}}★結構", "第一個{{口服有效|性質}}的 CA 抑制劑"] },
{ id: "methazolamide", chapter: 7, name: "Methazolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/methazolamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["與 Acetazolamide 差別僅在 thiadiazole 環 N 上有{{甲基|取代基}}取代 → 增加藥物{{脂溶性|性質}}，使其更容易進入眼內"] },
{ id: "ethoxzolamide", chapter: 7, name: "Ethoxzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/ethoxzolamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["具 {{1,3-benzothiazole|結構}} 結構", "Sulfonamide 接在雜環上", "具有{{乙氧基|取代基}}（ethoxy）"] },
{ id: "dichlorphenamide", chapter: 7, name: "Dichlorphenamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/dichlorphenamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["具有 {{disulfonamide|結構}}★結構", "{{沒有 thiazole ring|結構}}★：與 Acetazolamide 不同", "2、3 位上有 {{Cl|取代基}} 取代"] },
{ id: "dorzolamide", chapter: 7, name: "Dorzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/dorzolamide.png",
  use: ["僅適用於{{青光眼|疾病}}的眼部局部給藥"],
  bold: ["具有可解離的 {{2 級胺|結構}}結構", "仍具相當脂溶性，可穿透角膜"] },
{ id: "brinzolamide", chapter: 7, name: "Brinzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/brinzolamide.png",
  use: ["僅適用於{{青光眼|疾病}}的眼部局部給藥"],
  bold: ["與 Dorzolamide 類似，具可解離的 {{2 級胺|結構}}結構，可穿透角膜"] },

{ id: "thiazide-sar", chapter: 7, name: "Thiazide 利尿劑 SAR", short: "Thiazide SAR", type: "topic", group: "Thiazide Diuretics", source: "統整（三）p.42", img: "assets/medchem/benzothiadiazine.png",
  bold: [
    "Thiazide（Benzothiadiazine）主要作用在{{遠曲小管|位置}}，競爭 Na⁺/Cl⁻通道的氯離子結合位 → 抑制 Na⁺、Cl⁻再吸收",
    "副作用：{{低血鉀|副作用}}（Na⁺-K⁺ pump 補償使 K⁺被分泌）",
    "具有 benzothiadiazine {{1,1-dioxide|結構}} 基本結構，C₇上須有磺胺基-SO₂NH₂，呈{{弱酸性|性質}}",
    "若 3、4 號間的雙鍵{{飽和|性質|不飽和}}，則利尿活性上升★（Hydrochlorothiazide>Chlorothiazide）",
    "{{3 號位|位置}}★上的親脂基團決定 Potency 及 Duration",
    "藥物合成：Chloraminophenamide 與 {{Acylating agents|物質}} 環化可得 Thiazide；與 Aldehydes 脫水環化可得 Hydrothiazide"
  ] },
{ id: "chlorothiazide", chapter: 7, name: "Chlorothiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42", img: "assets/medchem/chlorothiazide.png",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團：{{H|取代基}}", "3、4 號間為{{不飽和雙鍵|結構|飽和單鍵}}（活性較 Hydrochlorothiazide 低）", "C₂的磺胺基酸度較大★，容易和 NaOH 形成水溶性鈉鹽"] },
{ id: "hydrochlorothiazide", chapter: 7, name: "Hydrochlorothiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42", img: "assets/medchem/hydrochlorothiazide.png",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["與 Chlorothiazide 僅差在 3、4 號間{{不飽和雙鍵|結構}}飽和 → 利尿{{活性上升|性質}}★", "3 號位親脂基團：{{H|取代基}}"] },
{ id: "benzthiazide", chapter: 7, name: "Benzthiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{benzylthiomethyl|取代基}}（-CH₂-S-benzyl）", "3、4 號間為{{不飽和雙鍵|結構}}"] },
{ id: "methyclothiazide", chapter: 7, name: "Methyclothiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{ClCH₂|取代基}}", "2 號 N 上有{{甲基|取代基}}取代"] },
{ id: "trichlormethiazide", chapter: 7, name: "Trichlormethiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{CHCl₂|取代基}}（二氯甲基）", "3、4 號間為{{飽和單鍵|結構}}"] },
{ id: "polythiazide", chapter: 7, name: "Polythiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{-CH₂-S-CH₂CF₃|取代基}}", "2 號 N 上有{{甲基|取代基}}取代"] },
{ id: "hydroflumethiazide", chapter: 7, name: "Hydroflumethiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團：{{H|取代基}}", "6 號位為 {{CF₃|取代基}}（非 Cl）"] },
{ id: "bendroflumethiazide", chapter: 7, name: "Bendroflumethiazide", type: "drug", group: "Thiazide Diuretics", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為{{苯環|取代基}}（benzyl）", "6 號位為 {{CF₃|取代基}}"] },
{ id: "metolazone", chapter: 7, name: "Metolazone", type: "drug", group: "Thiazide-like（Quinazolinone）", source: "統整（三）p.43", img: "assets/medchem/metolazone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["不含 Benzothiadiazine 結構，但仍有 {{Sulfonamide|結構}} 結構★，與 Thiazide 有類似作用", "由 Thiazide 之 1(4) 號位的 {{Sulfone|取代基}} 基團置換成 {{C=O|取代基}}★所得", "2 號 N 上有 {{Toluidine|取代基}} 取代基", "3 號 C 上接{{甲基|取代基}}"] },
{ id: "quinethazone", chapter: 7, name: "Quinethazone", type: "drug", group: "Thiazide-like（Quinazolinone）", source: "統整（三）p.43", img: "assets/medchem/quinethazone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["與 Metolazone 一樣含有 {{Quinazolinone|結構}} 雜環★", "2 號 N 上{{沒有取代基|結構}}", "3 號 C 上接{{乙基|取代基}}"] },
{ id: "chlorthalidone", chapter: 7, name: "Chlorthalidone", type: "drug", group: "Thiazide-like（Phthalimidine）", source: "統整（三）p.43", img: "assets/medchem/chlorthalidone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["屬於 {{Phthalimidine|結構}}★類衍生物", "代謝：在體內會{{開環|代謝}}（含 Benzophenone 結構）"] },
{ id: "indapamide", chapter: 7, name: "Indapamide", type: "drug", group: "Thiazide-like（Indoline）", source: "統整（三）p.43", img: "assets/medchem/indapamide.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["屬於 {{Indoline|結構}} 類衍生物", "代謝：透過羥基化、水解、酯化、氧化{{四種|數值}}路徑代謝"] },

{ id: "loop-intro", chapter: 7, name: "環利尿劑總論", short: "環利尿劑總論", type: "topic", group: "環利尿劑", source: "統整（三）p.44",
  bold: [
    "環利尿劑作用在{{亨氏套粗上升支|位置}}的 Na⁺/K⁺/2Cl⁻通道",
    "Onset 快、Duration 短，利尿效果較其他類佳，故稱 {{High-Ceiling|名詞}} Diuretics",
    "此類藥物較無類似結構，是因相似的藥理作用而歸類在一起"
  ] },
{ id: "furosemide", chapter: 7, name: "Furosemide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/furosemide.png",
  use: ["{{環利尿劑|用途}}", "酸性強（因具有-COOH）", "2 號位取代基影響活性：{{furfuryl|取代基}}>benzyl>thienylmethyl★"],
  bold: ["{{ortho-aminobenzoic acid|結構}}★衍生物（5-sulfomyl-2-aminobenzoic acid）", "含有 {{anthranilic acid|結構}} 類似結構", "取代基：胺基+Furan、Cl、SO₂NH₂"] },
{ id: "bumetanide", chapter: 7, name: "Bumetanide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/bumetanide.png",
  use: ["{{環利尿劑|用途}}：效價最強（Furosemide 的 {{40|數值}} 倍）"],
  bold: ["{{meta-aminobenzoic acid|結構}}★衍生物（5-sulfomyl-3-aminobenzoic acid）", "3 號位含有{{正丁基|取代基}}結構（Butyl group）", "4 號位上有 {{Phenoxy|取代基}} 取代（O 改成 N 或 S 仍具活性）"] },
{ id: "torsemide", chapter: 7, name: "Torsemide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/torsemide.png",
  use: ["{{環利尿劑|用途}}"],
  bold: ["以 {{Pyridine|結構}} 為骨架（不同於其他三者）", "SO₂NH₂ 修飾成 {{Sulfonylurea|結構}}★結構", "N 上有 {{Toluidine|取代基}} 結構", "半衰期{{最長|性質}}"] },
{ id: "ethacrynic-acid", chapter: 7, name: "Ethacrynic acid", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/ethacrynic-acid.png",
  use: ["{{環利尿劑|用途}}", "生體可用率最高（100%）", "可用在對磺胺類過敏的病患", "比其他環利尿劑有更嚴重的{{耳毒性|副作用}}★及腸胃副作用"],
  bold: ["唯一{{不含 Sulfonamide|結構}}★結構的環利尿劑", "含有 {{Acrylic acid|結構}} 結構，Cl 取代在 2、3 位", "Oxyacetic acid 與 αβ-unsaturated carbonyl 為 {{para-position|位置}}★時利尿效果最好", "與腎小管的-SH 形成{{共價鍵|機轉}}結合"] },

{ id: "mra-intro", chapter: 7, name: "保鉀型（MRA）總論", short: "MRA 總論", type: "topic", group: "保鉀型（MRA）", source: "統整（三）p.45",
  bold: [
    "礦物性腎上腺皮質受體抑制劑（MRA）同時歸類為{{保鉀型利尿劑|藥物類別}}",
    "主要抑制{{醛固酮 Aldosterone|物質}}的作用 → 需要 Aldosterone 存在才可作用★",
    "受體（含 {{Methionine|物質}}）被抑制，使 Na⁺和水無法再吸收（K⁺留在體內）"
  ] },
{ id: "spironolactone", chapter: 7, name: "Spironolactone", type: "drug", group: "保鉀型（MRA）", source: "統整（三）p.45", img: "assets/medchem/spironolactone.png",
  use: ["{{保鉀型利尿劑|用途}}", "副作用：{{男性女乳症|副作用}}（gynocomastia）、腸胃不適、昏睡"],
  bold: ["7α★：-SC(O)CH₃（{{Ethanethiolate|取代基}}）★", "17 號：{{γ-lactone ring|結構}}", "7 號取代基可拮抗 Aldosterone 與受體 {{Methionine|物質}}★活化", "代謝：經肝臟首渡代謝脫去-SC(O)CH₃★形成 {{Canrenone|代謝物}}★（有活性）"] },
{ id: "eplerenone", chapter: 7, name: "Eplerenone", type: "drug", group: "保鉀型（MRA）", source: "統整（三）p.45", img: "assets/medchem/eplerenone.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["在 9α、11α 上有 {{epoxy group|取代基}} → 對 MR 親合度較 Spironolactone {{低|性質|高}}", "代謝：經 {{CYP3A4|酵素}} 產生 4 種代謝物"] },

{ id: "ksparing-intro", chapter: 7, name: "保鉀型（Na⁺通道）總論", short: "保鉀型總論", type: "topic", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46",
  bold: [
    "保鉀型利尿劑作用在{{遠曲、集尿管|位置}}的 Na⁺通道，副作用：{{高血鉀|副作用}}",
    "與 Spironolactone、Eplerenone 不同，{{不需要|性質}} Aldosterone 存在即可作用★",
    "皆含有 N 原子，弱酸環境被質子化形成陽離子 BH⁺，與 Na⁺通道上的陰離子基團結合而抑制 Na⁺再吸收"
  ] },
{ id: "triamterene", chapter: 7, name: "Triamterene", type: "drug", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46", img: "assets/medchem/triamterene.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["由 {{Pteridine|結構}}★（4N）發展而來：與葉酸、Methotrexate★結構類似", "結構中有 {{3 個|數值}}胺基-NH₂，故稱 Triamterene", "代謝：經 {{CYP1A2|酵素}} 代謝成 4'-hydroxytriamterene + Sulfate-conjugated，均有活性"] },
{ id: "amiloride", chapter: 7, name: "Amiloride", type: "drug", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46", img: "assets/medchem/amiloride.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["由 Triamterene {{開環|結構}}而來，具有 {{pyrazine|結構}}★結構", "具有 Aminopyrazine、{{Guanidine|結構}}★的結構", "鹼性較強，較易質子化", "代謝：幾乎不會代謝，以{{原型|代謝}}排出體外"] },

/* ===== 第 8 章 心絞痛藥物（統整（三）捌，p.47–48）===== */
{ id: "dipyridamole", chapter: 8, name: "Dipyridamole", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/dipyridamole.png",
  use: ["{{心絞痛|疾病}}（PDE 抑制劑，Persantine®）", "抑制 {{PDE-3|標的}}，使 cAMP↑", "同時抑制 {{adenosine|物質}} 再回收★，刺激 adenyl cyclase 使 cAMP↑"],
  bold: ["以 {{pyrimidopyrimidine|結構}} 為骨架", "具 {{piperidine|結構}} 結構"] },
{ id: "cilostazol", chapter: 8, name: "Cilostazol", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/cilostazol.png",
  use: ["{{口服|給藥途徑}}藥，對 {{PDE-3A|標的}} 更具選擇性", "同時抑制 adenosine 再回收，使 cAMP↑", "可治療{{間歇性跛行|疾病}}"],
  bold: ["以 {{quinolinone|結構}} 為骨架", "具 {{tetrazole|結構}} 結構", "具環己烷結構"] },
{ id: "papaverine", chapter: 8, name: "Papaverine", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/papaverine.png",
  use: ["{{心絞痛|疾病}}（作用於血管平滑肌使血管舒張）"],
  bold: ["以 {{Benzoisoquinoline|結構}} 為骨架"] },
{ id: "minoxidil", chapter: 8, name: "Minoxidil", type: "drug", group: "心絞痛（補充）", source: "統整（三）p.47", img: "assets/medchem/minoxidil.png",
  use: ["具有降血壓、血管擴張作用，但{{不用在心衰竭治療|用途}}", "後被發現有促進{{毛髮再生|用途}}的能力"],
  bold: ["為 {{K⁺通道促效劑|機轉}}"] },

{ id: "nitrate-intro", chapter: 8, name: "硝酸酯類總論", short: "硝酸酯總論", type: "topic", group: "硝酸酯類", source: "統整（三）p.48",
  bold: [
    "含硝基血管擴張劑與組織中游離的{{硫醇基|物質}}（R-SH）結合，產生雙硫鍵釋放 NO₂⁻，最後生成 {{NO|物質}}（內生性 NO 由 L-arginine★生合成）",
    "NO 生合成為 nitrosothiol（R-SNO），刺激 {{guanylate cyclase|酵素}}★生成 cGMP",
    "活化 PKG 使 myosine light chain 之{{磷酸化減少|機轉}}★，造成血管平滑肌放鬆（{{靜脈擴張|性質}}>動脈擴張★）",
    "特性：揮發性強、脂溶性高；具爆炸性需防潮；與 amines 形成 {{nitrosamines|物質}} 具致癌性",
    "做成{{舌下錠|給藥途徑}}治療緊急心絞痛；可作{{氰化物|物質}}★中毒之解毒劑",
    "不可和 {{PDE-5 inhibitors|藥物類別}}（Sildenafil、Tadalafil）併用"
  ] },
{ id: "glyceryl-trinitrate", chapter: 8, name: "Glyceryl Trinitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/glyceryl-trinitrate.png",
  use: ["{{心絞痛|疾病}}（舌下錠）"],
  bold: ["又名 nitroglycerin，{{結構式和化學式|名詞}}★要記"] },
{ id: "amyl-nitrite", chapter: 8, name: "Amyl Nitrite", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/amyl-nitrite.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["屬於 {{Nitrite ester|結構}}★亞硝酸酯", "以{{氣體|給藥途徑}}給藥，油溶性高、{{Onset 最快|作用時間}}★"] },
{ id: "isosorbide-dinitrate", chapter: 8, name: "Isosorbide Dinitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/isosorbide-dinitrate.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["具有 {{4 個|數值}}★不對稱中心", "{{活性代謝物|性質}}作用時間更長★"] },
{ id: "pentaerythritol-tetranitrate", chapter: 8, name: "Pentaerythritol Tetranitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/pentaerythritol-tetranitrate.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["{{作用時間最長|作用時間}}★"] },
{ id: "molsidomine", chapter: 8, name: "Molsidomine", type: "drug", group: "NO Donor", source: "統整（三）p.48", img: "assets/medchem/molsidomine.png",
  use: ["{{心絞痛|疾病}}（NO donor）", "具光敏性、藥效短，治療劑量時有{{抗血小板|用途}}作用"],
  bold: ["不需要雙硫鍵催化，可直接提供 {{NO|物質}}", "化學結構屬於 {{Mesionic compound|結構}}★", "經 liver esterases 水解成活性代謝物 {{Linsidomine|代謝物}}★（含 imine 結構），再開環成 SIN-1A"] }
];

/* 知識樹：第 1 章。總論類的主題格用 unit 引用（題目算在格子上）；
   另外會出「看結構選藥名」的認結構題（js/quiz.js 的 structQ，選項都是真的藥名）。 */
PI.KNOWLEDGE = {
  ch1: { chapter: 1, title: "鎮靜安眠與抗焦慮藥物",
    sections: [
      { id: "overview", title: "總覽", items: [{ unit: "sh-barb-vs-bzd" }] },
      { id: "barb", title: "一、Barbiturates", items: [{ unit: "sh-barb-general" }] },
      { id: "bzd", title: "二、Benzodiazepines", items: [{ unit: "sh-bzd-general" }, { unit: "sh-bzd-3oh" }] },
      { id: "5ht", title: "五、Serotonin Agonists", items: [{ unit: "sh-serotonin" }] }
    ] },
  ch2: { chapter: 2, title: "抗癲癇藥物",
    sections: [
      { id: "intro", title: "總論", items: [{ unit: "ae-intro" }, { unit: "ae-firstline" }, { unit: "ae-action-site" }] },
      { id: "partial", title: "一、局部性及全身強直-痙攣性發作", items: [] },
      { id: "absence", title: "二、失神性發作", items: [] },
      { id: "summary", title: "總整理", items: [{ unit: "ae-ureide" }, { unit: "ae-se-summary" }] }
    ] },
  ch3: { chapter: 3, title: "抗憂鬱藥物",
    sections: [
      { id: "classes", title: "分類總表", items: [{ unit: "ad-classes" }] },
      { id: "nsri", title: "一、NSRI", items: [] },
      { id: "snri", title: "二、SNRI", items: [] },
      { id: "ssri", title: "三、SSRI", items: [] },
      { id: "dnri-srm", title: "四、DNRI／五、SRM・SARI", items: [] },
      { id: "nassa", title: "六、NaSSA", items: [{ unit: "nassa-topic" }] },
      { id: "maoi", title: "七、MAOI", items: [{ unit: "maoi-topic" }] },
      { id: "mood", title: "八、情緒穩定劑", items: [{ unit: "lithium" }] }
    ] },
  ch4: { chapter: 4, title: "神經疾病相關藥物",
    sections: [
      { id: "pd", title: "一、帕金森氏症", items: [{ unit: "pd-classes" }] },
      { id: "az", title: "二、阿茲海默症", items: [{ unit: "az-intro" }] },
      { id: "hd", title: "三、亨廷頓舞蹈症", items: [{ unit: "hd-intro" }] }
    ] },
  ch5: { chapter: 5, title: "抗精神病藥物",
    sections: [
      { id: "overview", title: "總論", items: [{ unit: "ap-pathways" }, { unit: "ap-se-summary" }] },
      { id: "gen1", title: "一、第一代（典型）", items: [{ unit: "ptz-sar" }, { unit: "butyrophenone" }] },
      { id: "gen2", title: "二、第二代（非典型）", items: [{ unit: "ap2-misc" }, { unit: "benzazepine-table" }, { unit: "benzisox-table" }] }
    ] },
  ch6: { chapter: 6, title: "肌肉鬆弛劑及抗痙攣藥物",
    sections: [
      { id: "central", title: "一、中樞性骨骼肌鬆弛劑", items: [] },
      { id: "peripheral", title: "二、週邊性骨骼肌鬆弛劑（抗Nm）", items: [{ unit: "nm-blocker-intro" }] },
      { id: "antispasm", title: "三、抗痙攣劑", items: [] }
    ] },
  ch7: { chapter: 7, title: "利尿劑",
    sections: [
      { id: "overview", title: "總論（作用位置）", items: [{ unit: "diu-location" }] },
      { id: "osmotic", title: "一、滲透壓型利尿劑", items: [{ unit: "osmotic-intro" }] },
      { id: "cai", title: "二、碳酸酐酶抑制劑", items: [{ unit: "cai-intro" }] },
      { id: "thiazide", title: "三、Thiazide 利尿劑", items: [{ unit: "thiazide-sar" }] },
      { id: "loop", title: "四、環利尿劑", items: [{ unit: "loop-intro" }] },
      { id: "mra", title: "五、保鉀型（MRA）", items: [{ unit: "mra-intro" }] },
      { id: "ksparing", title: "六、保鉀型（Na⁺通道）", items: [{ unit: "ksparing-intro" }] }
    ] },
  ch8: { chapter: 8, title: "心絞痛藥物",
    sections: [
      { id: "pde", title: "一、PDE 抑制劑", items: [] },
      { id: "nitrate", title: "二、硝酸酯類", items: [{ unit: "nitrate-intro" }] }
    ] }
};
PI.GLOSSARY = {};

/* 和生藥頁一樣：電腦版知識面板開大一點 */
document.documentElement.classList.add("is-amulet");
