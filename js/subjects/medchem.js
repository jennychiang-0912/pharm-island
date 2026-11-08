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
  ] }
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
    ] }
};
PI.GLOSSARY = {};

/* 和生藥頁一樣：電腦版知識面板開大一點 */
document.documentElement.classList.add("is-amulet");
