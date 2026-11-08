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
    "1-PP：1-(2-{{pyrimidyl|結構}}★)-piperazine"] }
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
    ] }
};
PI.GLOSSARY = {};

/* 和生藥頁一樣：電腦版知識面板開大一點 */
document.documentElement.classList.add("is-amulet");
