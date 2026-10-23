/* PHARMA ISLAND：學習單元（藥物、製劑、分類、主題）
   一個單元＝島上的一格。章節與地圖格子分開管理：這裡只放單元資料，格子位置由 js/map.js 自動配置。

   ===== 統一模板 =====
   { id: "ciprofloxacin",     // 唯一 ID（英數與連字號），之後不要改，進度會跟著它
     chapter: 2,              // 對應 PI.CHAPTERS 的 id
     name: "Ciprofloxacin",   // 顯示名稱
     short: "Cipro",          // 選填：格子裡放不下全名時用的短名（資訊卡仍顯示全名）
     type: "drug",            // drug 藥物、preparation 製劑、category 分類、topic 主題
     group: "Fluoroquinolones", // 選填：同一組的單元擴張時會盡量排在一起
     class: "fq",             // 選填：所屬類別；類別共通的內容寫在這章的知識樹（js/knowledge.js），這裡不重複
     generation: "第二代",     // 選填：第幾代
     // 以下欄位都是「句子陣列」，沒有資料就不寫（不要硬填）。欄位與順序見 PI.UNIT_FIELDS。
     mechanism: [], spectrum: [], indications: [], pk: [], adverse: [], contraindications: [], resistance: [], notes: [],
     points: [],              // 主題單元（topic）用：沒有固定欄位的重點
     source: "W1" }           // 出處

   ===== 挖空寫法（藥物格、主題格、知識樹都一樣）=====
   - {{答案|類型}}：要挖空的地方。例："抑制細菌 {{DHPS|標的}}"
     出題時一次挖一個；錯誤選項從整個題庫裡「同類型」的其他答案抽，不用手寫。
     類型請盡量用 PI.CLOZE_TYPES 裡的名稱，同類型才會互相當干擾選項。
   - 句尾「 #口訣」：這句的口訣，答題時當提示。例："可進入 {{CSF|部位}} #TT很洗腦"
   - 平常顯示時，挖空處直接顯示答案。

   規則：
   - 只能往後加，不要插在中間或刪掉，已配置的格子位置才不會變。
   - 某章的單元數少於 estimate 時，剩下的位置是「預留格」；新單元會依序填進預留格，超過預估才往外擴張。
   - 內容只來自課堂筆記（目前是 W1 心智圖），沒有自行補充。 */
window.PI = window.PI || {};

PI.UNIT_TYPES = { drug: "藥物", preparation: "製劑", category: "分類", topic: "主題" };

/* 欄位名稱與顯示順序 */
PI.UNIT_FIELDS = [
  ["points", "重點"], ["mechanism", "機轉"], ["spectrum", "抗菌範圍"], ["indications", "臨床應用"],
  ["pk", "藥動"], ["adverse", "副作用"], ["contraindications", "禁忌與交互作用"], ["resistance", "抗藥性"], ["notes", "其他重點"]
];

/* 挖空類型：同類型的答案會互相當錯誤選項 */
PI.CLOZE_TYPES = ["藥名", "藥物類別", "標的", "作用位置", "受質", "反應", "菌種", "疾病", "副作用", "器官", "部位",
  "離子", "物質", "性質", "藥效", "藥動", "給藥途徑", "名詞", "數值"];

PI.UNITS = [
  /* ===== 第 1 章 抗菌藥物療法導論（W1 一）===== */
  { id: "antibiotics-vs-antimicrobials", chapter: 1, name: "Antibiotics vs Antimicrobials", short: "Antibiotics", type: "topic", source: "W1",
    points: [
      "{{Antibiotics|名詞}}：傳統指微生物產生、可抑制其他微生物的物質",
      "{{Antimicrobial agents|名詞}}：含微生物產生 + 合成/半合成藥物"
    ] },
  { id: "static-vs-cidal", chapter: 1, name: "抑菌與殺菌", type: "topic", source: "W1",
    points: [
      "Bacteriostatic：{{抑菌|藥效}}；{{蛋白質合成抑制劑|藥物類別}}多屬此類 #沒有工具",
      "Bactericidal：{{殺菌|藥效}}；作用於{{細胞壁|作用位置}}者多屬此類 #牆倒菌死"
    ] },
  { id: "fetal-toxicity", chapter: 1, name: "★胎兒毒性", type: "topic", source: "W1（國考常考）",
    points: [
      "{{Aminoglycosides|藥名}}：{{耳毒性|副作用}} #阿咪聽不到",
      "{{Chloramphenicol|藥名}}：{{灰嬰症|副作用}}、{{骨髓抑制|副作用}} #氯黴素吃骨",
      "{{Sulfonamides|藥名}}：{{溶血|副作用}} #沙發溶血",
      "{{Tetracyclines|藥名}}：{{抑制骨骼|副作用}} #小孩四歲長不高",
      "{{Trimethoprim|藥名}}：{{影響葉酸代謝|副作用}} #修葉子",
      "{{Quinolones|藥名}}：{{軟骨異常|副作用}} #Q彈軟骨",
      "{{Vancomycin|藥名}}：{{聽覺毒性|副作用}} #Van音響開太大了"
    ] },
  { id: "prophylaxis", chapter: 1, name: "預防性投藥", type: "topic", source: "W1",
    points: [
      "外科手術前：★首選 {{Cefazolin|藥名}}（不會就猜它）"
    ] },
  { id: "moa-wall-membrane", chapter: 1, name: "★機轉分類：細胞壁與細胞膜", short: "細胞壁膜機轉", type: "topic", source: "W1（必考）",
    points: [
      "{{細胞壁合成|作用位置}}：Vancomycin、Bacitracin、Penicillins、Cephalosporins、Monobactams、Carbapenems",
      "{{細胞膜|作用位置}}：Polymyxins、Daptomycin #大頭膜"
    ] },
  { id: "moa-folate-nucleic", chapter: 1, name: "★機轉分類：葉酸與核酸", short: "葉酸核酸機轉", type: "topic", source: "W1（必考）",
    points: [
      "{{葉酸代謝|作用位置}}：Sulfonamides、Trimethoprim",
      "核酸合成－{{DNA gyrase|標的}}：Quinolones",
      "核酸合成－{{RNA polymerase|標的}}：Rifampin"
    ] },
  { id: "moa-protein", chapter: 1, name: "★機轉分類：蛋白質合成", short: "蛋白質機轉", type: "topic", source: "W1（必考）",
    points: [
      "{{30S|標的}}：Tetracyclines、Aminoglycosides #助教(TA)30歲了",
      "{{50S|標的}}：Macrolides、Chloramphenicol、Clindamycin、Streptogramins、Linezolid #50元收抹茶資工劉",
      "{{tRNA|標的}}：Mupirocin"
    ] },

  /* ===== 第 2 章 磺胺藥與泌尿道感染用藥（W1 二）=====
     Sulfonamides、Fluoroquinolones 的類別共通內容（藥動、副作用、禁忌、抗藥性、機轉）在第 2 章知識樹 */
  { id: "sulfasalazine", chapter: 2, name: "Sulfasalazine", type: "drug", group: "Sulfonamides", class: "sulfonamides", source: "W1",
    pk: [
      "口服{{不吸收|藥動}}（磺胺藥中的例外） #木法沙愛腸",
      "腸道菌分解為 {{Mesalamine (5-ASA)|藥名}} + {{Sulfapyridine|藥名}}"
    ],
    indications: ["治療{{慢性腸炎|疾病}}"] },
  { id: "silver-sulfadiazine", chapter: 2, name: "Silver sulfadiazine", type: "drug", group: "Sulfonamides", class: "sulfonamides", source: "W1",
    indications: ["{{外用|給藥途徑}}／{{燒燙傷|疾病}}"] },
  { id: "sulfadiazine", chapter: 2, name: "Sulfadiazine", type: "drug", group: "Sulfonamides", class: "sulfonamides", source: "W1",
    indications: ["{{弓漿蟲|疾病}}：Sulfadiazine + {{Pyrimethamine|藥名}} #公沙發愛被打屁"] },
  { id: "sulfadoxine", chapter: 2, name: "Sulfadoxine", type: "drug", group: "Sulfonamides", class: "sulfonamides", source: "W1",
    indications: ["抗 {{Chloroquine|藥名}} 瘧疾：Sulfadoxine + {{Pyrimethamine|藥名}} #沒事不要自作虐"] },

  { id: "trimethoprim", chapter: 2, name: "Trimethoprim", type: "drug", group: "葉酸拮抗劑", source: "W1",
    mechanism: ["{{DHFR|標的}} 抑制劑"],
    indications: ["治療 {{acute UTIs|疾病}}", "可治療{{前列腺炎|疾病}}與{{陰道炎|疾病}}"],
    pk: ["可進入 {{CSF|部位}} #TT很洗腦"],
    adverse: ["{{葉酸缺乏|副作用}} → {{巨母紅血球貧血|副作用}}、白血球低下；補充 {{Folinic acid|藥名}}"] },
  { id: "co-trimoxazole", chapter: 2, name: "Co-trimoxazole", type: "drug", group: "葉酸拮抗劑", source: "W1",
    mechanism: ["Sulfamethoxazole : Trimethoprim = {{5:1|數值}}，{{協同作用|名詞}} #在一起的時候比較S"],
    indications: [
      "可治療泌尿道、腸胃道、呼吸道感染及{{李斯特菌 (Listeriosis)|菌種}}",
      "可治療免疫力低下（如 AIDS 患者）易得的{{肺囊蟲肺炎 (P. jiroveci p.)|疾病}}",
      "可治療抗 Ampicillin 或氯黴素 (Chloramphenicol) 的{{沙門氏菌 (Salmonella)|菌種}}"
    ],
    adverse: ["與 Sulfamethoxazole、Trimethoprim 的副作用相似", "肺囊蟲肺炎患者易出現{{發燒|副作用}}、{{紅疹|副作用}}"] },
  { id: "pyrimethamine", chapter: 2, name: "Pyrimethamine", type: "drug", group: "葉酸拮抗劑", source: "W1",
    mechanism: ["抑制人與細菌 {{DHFR|標的}}（DHF → THF）"],
    indications: ["+ Sulfadoxine：抗 Chloroquine {{瘧疾|疾病}}", "+ Sulfadiazine：{{弓漿蟲|疾病}}"] },
  { id: "methotrexate", chapter: 2, name: "Methotrexate", type: "drug", group: "葉酸拮抗劑", source: "W1",
    mechanism: ["抑制人與細菌 {{DHFR|標的}}（DHF → THF）"],
    notes: ["W1 只寫到機轉"] },

  { id: "nalidixic-acid", chapter: 2, name: "Nalidixic acid", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第一代", source: "W1",
    spectrum: ["{{G(-)|菌種}}"], notes: ["已少用"] },
  { id: "ciprofloxacin", chapter: 2, name: "Ciprofloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第二代", source: "W1",
    indications: ["★{{綠膿桿菌|菌種}}首選 #賽柏2由約翰綠膿、炭疽出演", "{{炭疽|疾病}}治療"] },
  { id: "norfloxacin", chapter: 2, name: "Norfloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第二代", source: "W1",
    indications: ["{{UTI|疾病}}、{{前列腺炎|疾病}}"] },
  { id: "ofloxacin", chapter: 2, name: "Ofloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", source: "W1",
    pk: ["FQ 中只有 Ofloxacin 可進入 {{CSF|部位}} #BBB警察來襲，快叫歐福羅"] },
  { id: "levofloxacin", chapter: 2, name: "Levofloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第三代（Respiratory FQ）", source: "W1",
    indications: ["{{肺炎鏈球菌|菌種}}"] },
  { id: "moxifloxacin", chapter: 2, name: "Moxifloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第四代", source: "W1",
    spectrum: ["{{G(+)|菌種}}、{{厭氧菌|菌種}}效果更強"],
    pk: ["經{{肝|器官}}排除（腎功能差可用） #沒心肝"] },
  { id: "trovafloxacin", chapter: 2, name: "Trovafloxacin", type: "drug", group: "Fluoroquinolones", class: "fq", generation: "第四代", source: "W1",
    adverse: ["嚴重{{肝毒性|副作用}}"],
    notes: ["用於有生命危險的感染，限用 ≤ {{14|數值}} 天"] },

  { id: "methenamine", chapter: 2, name: "Methenamine", type: "drug", group: "其他泌尿道抗菌劑", source: "W1",
    mechanism: ["{{酸性|性質}}尿（pH < {{5.5|數值}}）水解出{{甲醛|物質}}殺菌 #甲甲"],
    spectrum: ["E.coli、G(-)、葡萄球菌"],
    adverse: ["易引起{{腸胃道不適|副作用}}"],
    contraindications: ["禁與{{磺胺藥|藥物類別}}併用；{{肝腎不全|疾病}}禁用"],
    notes: ["常與酸如{{扁桃酸 (Mandelic acid)|藥名}}、{{馬尿酸 (Hippuric acid)|藥名}}做成製劑"] },
  { id: "nitrofurantoin", chapter: 2, name: "Nitrofurantoin", type: "drug", group: "其他泌尿道抗菌劑", source: "W1",
    spectrum: ["E.coli、G(+)"],
    indications: ["預防 UTI 復發{{第二線|名詞}}"],
    adverse: ["{{紅棕色尿|副作用}}"] }
];
