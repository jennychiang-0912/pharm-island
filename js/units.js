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
   - 內容只來自課堂筆記（目前是 W1～W3 心智圖），沒有自行補充。 */
window.PI = window.PI || {};

PI.UNIT_TYPES = { drug: "藥物", preparation: "製劑", category: "分類", topic: "主題" };

/* 欄位名稱與顯示順序 */
PI.UNIT_FIELDS = [
  ["points", "重點"], ["mechanism", "機轉"], ["spectrum", "抗菌範圍"], ["indications", "臨床應用"],
  ["pk", "藥動"], ["adverse", "副作用"], ["contraindications", "禁忌與交互作用"], ["resistance", "抗藥性"], ["notes", "其他重點"]
];

/* 對比組：答案在某一組裡時，選項就用同一組的其他詞（例如「耐酸／不耐酸」），不從整個題庫亂抽。
   這些只是對照用的選項詞，不是新增的知識。 */
PI.CLOZE_SETS = [
  ["耐酸", "不耐酸"], ["耐酶", "不耐酶"], ["可逆", "不可逆"], ["↑", "↓"], ["高", "低"], ["長", "短"], ["快", "慢"],
  ["厚", "薄"], ["酸性", "鹼性", "中性"], ["空腹", "飯後"], ["厭氧", "需氧"], ["正電", "負電"], ["窄", "寬"],
  ["廣效", "窄效"], ["脂溶性", "水溶性"], ["抑菌", "殺菌"], ["誘導", "抑制"], ["分裂中", "休眠中"],
  ["無抗菌力", "有抗菌力"], ["第一線", "第二線", "後線用藥"]
];

/* 挖空類型：同類型的答案會互相當錯誤選項 */
PI.CLOZE_TYPES = ["藥名", "藥物類別", "標的", "酵素", "作用位置", "機轉", "結構", "受質", "反應", "菌種", "疾病", "副作用",
  "器官", "部位", "離子", "物質", "性質", "顏色", "族群", "藥效", "藥動", "給藥途徑", "名詞", "數值"];

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
    adverse: ["{{紅棕色尿|副作用}}"] },

  /* ===== 第 3 章 細胞壁合成抑制劑（W2 前半）=====
     概論、細胞壁合成三步驟、Penicillins／Cephalosporins／Carbapenems／β-lactamase 抑制劑的共通內容在第 3 章知識樹 */
  { id: "penicillin-g", chapter: 3, name: "Penicillin G", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["天然 penicillin：{{不耐酸|性質}}、{{不耐酶|性質}}"],
    indications: ["{{肺炎鏈球菌|菌種}}肺炎", "{{淋病|疾病}}", "{{梅毒|疾病}}（單次治療） #G梅單"] },
  { id: "penicillin-v", chapter: 3, name: "Penicillin V", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["天然 penicillin：{{耐酸|性質}}，可{{口服|給藥途徑}} #YA(可耐酸)"] },
  { id: "methicillin", chapter: 3, name: "Methicillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{葡萄球菌|菌種}}（耐酶）；{{不耐酸|性質}} #梅西討厭酸民"],
    adverse: ["{{間質性腎炎|副作用}} #甲甲才會走腎"] },
  { id: "nafcillin", chapter: 3, name: "Nafcillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{葡萄球菌|菌種}}（{{耐酶|性質}}） #梅鈉歐迪打敗葡萄牙"] },
  { id: "oxacillin", chapter: 3, name: "Oxacillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{葡萄球菌|菌種}}（{{耐酶|性質}}） #梅鈉歐迪打敗葡萄牙"] },
  { id: "dicloxacillin", chapter: 3, name: "Dicloxacillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{葡萄球菌|菌種}}（耐酶）；{{耐酸|性質}} #梅鈉歐迪打敗葡萄牙"] },
  { id: "ampicillin", chapter: 3, name: "Ampicillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["{{廣效|名詞}} penicillin：可抗 {{G(-)|菌種}}；不耐酶，需併 {{β-lactamase inhibitor|藥物類別}} #谷阿默沒了"],
    adverse: ["治{{單核球增多症|疾病}}時易出現過敏 → {{斑丘疹|副作用}}", "{{腹瀉|副作用}}（常見於廣效型 penicillin） #吃筆芯會讓你想棒賽"] },
  { id: "amoxicillin", chapter: 3, name: "Amoxicillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["{{廣效|名詞}} penicillin：可抗 {{G(-)|菌種}}；不耐酶，需併 {{β-lactamase inhibitor|藥物類別}} #谷阿默沒了"] },
  { id: "carbenicillin", chapter: 3, name: "Carbenicillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{綠膿桿菌|菌種}} penicillin #綠膿討厭TA搞CP"] },
  { id: "piperacillin", chapter: 3, name: "Piperacillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{綠膿桿菌|菌種}} penicillin #綠膿討厭TA搞CP",
      "對 β-lactamase 沒有抗性，常搭配 β-lactamase inhibitor：Piperacillin + {{Tazobactam|藥名}}"] },
  { id: "ticarcillin", chapter: 3, name: "Ticarcillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{綠膿桿菌|菌種}} penicillin #綠膿討厭TA搞CP"] },
  { id: "azlocillin", chapter: 3, name: "Azlocillin", type: "drug", group: "Penicillins", class: "penicillins", source: "W2",
    notes: ["抗{{綠膿桿菌|菌種}} penicillin #綠膿討厭TA搞CP"] },

  { id: "cephalexin", chapter: 3, name: "Cephalexin", type: "drug", group: "Cephalosporins", class: "cephalosporins", source: "W2",
    pk: ["可{{口服|給藥途徑}}的 Cephalosporin #吃發糕，啃皮草"] },
  { id: "cefazolin", chapter: 3, name: "Cefazolin", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第一代", source: "W2",
    indications: ["★{{IV|給藥途徑}}，{{手術預防|名詞}}首選"] },
  { id: "cefuroxime", chapter: 3, name: "Cefuroxime", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第二代", source: "W2",
    spectrum: ["{{嗜血桿菌|菌種}}"],
    pk: ["可{{口服|給藥途徑}} #吃發糕，啃皮草"] },
  { id: "cefoxitin", chapter: 3, name: "Cefoxitin", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第二代", source: "W2",
    spectrum: ["抗{{厭氧菌 (B. fragilis)|菌種}} #狐狸喝茶，鑽進腸子裡"],
    indications: ["{{腹腔/骨盆感染|疾病}}"] },
  { id: "cefotetan", chapter: 3, name: "Cefotetan", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第二代", source: "W2",
    spectrum: ["抗{{厭氧菌 (B. fragilis)|菌種}} #狐狸喝茶，鑽進腸子裡"],
    indications: ["{{腹腔/骨盆感染|疾病}}"],
    adverse: ["含 {{MTT 基團|結構}}：{{Disulfiram-like|副作用}}、抗維生素 K → 出血 #看歌劇喝茶的男人不能喝酒還會流血（喝茶是 Cefotetan）"] },
  { id: "cefamandole", chapter: 3, name: "Cefamandole", type: "drug", group: "Cephalosporins", class: "cephalosporins", source: "W2",
    pk: ["經{{膽汁|器官}}排除（腎功能差可用） #有『膽』的三個人：看歌劇的「男人」（Cefamandole）、「歌劇」（Cefoperazone）、「Tri 姐」（Ceftriaxone）"],
    adverse: ["含 {{MTT 基團|結構}}：{{Disulfiram-like|副作用}}、抗維生素 K → 出血 #看歌劇喝茶的男人不能喝酒還會流血（男人是 Cefamandole）"] },
  { id: "ceftriaxone", chapter: 3, name: "Ceftriaxone", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第三代", source: "W2",
    pk: ["可進 {{CSF|部位}} #T家族照 X 光才看得到腦", "經{{膽汁|器官}}排除（腎功能差可用）"],
    indications: ["進 CSF 治{{腦膜炎|疾病}}", "★{{淋病|疾病}}首選 #有T的就是第三代"] },
  { id: "cefotaxime", chapter: 3, name: "Cefotaxime", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第三代", source: "W2",
    pk: ["可進 {{CSF|部位}} #T家族照 X 光才看得到腦"],
    indications: ["治{{腦膜炎|疾病}}"] },
  { id: "ceftazidime", chapter: 3, name: "Ceftazidime", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第三代", source: "W2",
    spectrum: ["抗{{綠膿桿菌|菌種}} #TAZ打綠膿桿菌"] },
  { id: "cefoperazone", chapter: 3, name: "Cefoperazone", type: "drug", group: "Cephalosporins", class: "cephalosporins", source: "W2",
    pk: ["經{{膽汁|器官}}排除（腎功能差可用） #有『膽』的三個人（歌劇是 Cefoperazone）"],
    adverse: ["含 {{MTT 基團|結構}}：{{Disulfiram-like|副作用}}、抗維生素 K → 出血 #看歌劇喝茶的男人不能喝酒還會流血（歌劇是 Cefoperazone）"] },
  { id: "cefepime", chapter: 3, name: "Cefepime", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第四代", source: "W2",
    spectrum: ["{{G(+)、G(-)|菌種}} 皆廣，抗{{綠膿桿菌|菌種}}"] },
  { id: "cefpirome", chapter: 3, name: "Cefpirome", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第四代", source: "W2",
    spectrum: ["{{G(+)、G(-)|菌種}} 皆廣，抗{{綠膿桿菌|菌種}}"] },
  { id: "ceftaroline", chapter: 3, name: "Ceftaroline", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第五代", source: "W2",
    spectrum: ["★可抗 {{MRSA|菌種}} #叫MARA滾"] },
  { id: "ceftobiprole", chapter: 3, name: "Ceftobiprole", type: "drug", group: "Cephalosporins", class: "cephalosporins", generation: "第五代", source: "W2",
    spectrum: ["★可抗 {{MRSA|菌種}} #叫MARA滾"] },

  { id: "aztreonam", chapter: 3, name: "Aztreonam", type: "drug", group: "Monobactams", source: "W2",
    notes: ["屬於 {{Monobactams|藥物類別}}：{{單一 β-lactam ring|結構}}，耐多數 β-lactamase"],
    spectrum: ["{{窄效|名詞}}：只對{{需氧 G(-) 桿菌|菌種}} #阿茲海默阿公只記得陰性的老朋友", "不能治 {{MRSA|菌種}}"],
    adverse: ["★不與其他 {{β-lactam|藥物類別}} 交叉過敏"] },

  { id: "imipenem", chapter: 3, name: "Imipenem", type: "drug", group: "Carbapenems", class: "carbapenems", source: "W2",
    spectrum: ["廣效：G(+)、G(-)、{{厭氧菌|菌種}}（不含 {{MRSA|菌種}}）"],
    pk: ["需併 {{Cilastatin|藥名}}：抑制腎 {{dehydropeptidase|酵素}}，防{{腎毒性|副作用}} #姨媽腎虛，很容易吃什麼都要稀拉"] },
  { id: "meropenem", chapter: 3, name: "Meropenem", type: "drug", group: "Carbapenems", class: "carbapenems", source: "W2",
    spectrum: ["廣效：G(+)、G(-)、{{厭氧菌|菌種}}（不含 {{MRSA|菌種}}）"] },
  { id: "doripenem", chapter: 3, name: "Doripenem", type: "drug", group: "Carbapenems", class: "carbapenems", source: "W2",
    spectrum: ["廣效：G(+)、G(-)、{{厭氧菌|菌種}}（不含 {{MRSA|菌種}}）"],
    pk: ["不需併用 {{Cilastatin|藥名}}"] },
  { id: "ertapenem", chapter: 3, name: "Ertapenem", type: "drug", group: "Carbapenems", class: "carbapenems", source: "W2",
    pk: ["不需併用 {{Cilastatin|藥名}}"] },

  { id: "clavulanate", chapter: 3, name: "Clavulanate", type: "drug", group: "β-lactamase 抑制劑", class: "bl-inhibitors", source: "W2",
    notes: ["{{β-lactamase 抑制劑|藥物類別}}：本身無抗菌力，需併用抗生素 #可舒坦"] },
  { id: "sulbactam", chapter: 3, name: "Sulbactam", type: "drug", group: "β-lactamase 抑制劑", class: "bl-inhibitors", source: "W2",
    notes: ["{{β-lactamase 抑制劑|藥物類別}}：本身無抗菌力，需併用抗生素 #可舒坦"] },
  { id: "tazobactam", chapter: 3, name: "Tazobactam", type: "drug", group: "β-lactamase 抑制劑", class: "bl-inhibitors", source: "W2",
    notes: ["{{β-lactamase 抑制劑|藥物類別}}：本身無抗菌力，需併用抗生素 #可舒坦", "常見組合：{{Piperacillin|藥名}} + Tazobactam"] },

  { id: "vancomycin", chapter: 3, name: "Vancomycin", type: "drug", group: "Glycopeptides", source: "W2",
    mechanism: ["{{Glycopeptide 醣肽類|藥物類別}}：結合 {{D-Ala-D-Ala|受質}}，抑制 {{PGT|標的}}"],
    pk: ["{{IV|給藥途徑}} 緩慢滴注治全身感染", "{{口服|給藥途徑}}只治腸炎"],
    indications: [
      "僅用於嚴重的{{革蘭氏陽性菌|菌種}}感染：MRSA、MRSE、hemolytic Strep.",
      "與 {{Gentamicin|藥名}}（可抑制蛋白質生合成）併用治{{心內膜炎|疾病}}",
      "{{導管/人工瓣膜|部位}}感染",
      "{{抗生素相關性腸炎|疾病}}（口服）：{{Clostridium difficile|菌種}}（厭氧菌）、Staphylococci"
    ],
    adverse: ["{{紅人症候群|副作用}}（{{組織胺|物質}}）", "{{耳毒性|副作用}}", "{{腎毒性|副作用}}"] },
  { id: "teicoplanin", chapter: 3, name: "Teicoplanin", type: "drug", group: "Glycopeptides", source: "W2",
    notes: ["類似 {{Vancomycin|藥名}}"],
    pk: ["脂溶性{{高|性質}}", "t½ {{長|性質}}"] },
  { id: "dalbavancin", chapter: 3, name: "Dalbavancin", type: "drug", group: "Lipoglycopeptides", source: "W2",
    notes: ["屬於 {{Lipoglycopeptides|藥物類別}}"],
    spectrum: ["對 {{G(+)|菌種}} 病原有效，包括 {{MRSA、MRSE|菌種}}"] },
  { id: "telavancin", chapter: 3, name: "Telavancin", type: "drug", group: "Lipoglycopeptides", source: "W2",
    mechanism: ["★雙重機轉：抑制 {{PGT|標的}} + {{細胞膜去極化|機轉}} #一踢一拉：踢掉 PGT，再拉破細胞膜，是雙重機轉；孕婦小心被踢要閃"],
    spectrum: ["只對 {{G(+)|菌種}}（含 MRSA）"],
    contraindications: ["{{孕婦|族群}}禁用"] },

  { id: "cycloserine", chapter: 3, name: "Cycloserine", type: "drug", group: "其他細胞壁抑制劑", source: "W2",
    mechanism: ["抑制 {{Alanine racemase|標的}} / {{D-Ala-D-Ala synthetase|標的}}（步驟一） #腳踏車偷搬東西"],
    indications: ["主要治{{結核|疾病}}、MAC"],
    adverse: ["{{CNS 毒性（癲癇）|副作用}}", "{{周邊神經病變|副作用}}（{{B6|藥名}} 預防）"],
    contraindications: ["與酒精、{{異煙肼 (isoniazid)|藥名}}、乙硫異煙胺 (ethionamide) 併用會增加毒性", "抑制 {{Phenytoin|藥名}} 代謝 → 增加毒性"] },
  { id: "fosfomycin", chapter: 3, name: "Fosfomycin", type: "drug", group: "其他細胞壁抑制劑", source: "W2",
    mechanism: ["抑制 {{MurA|標的}}（步驟一）"],
    pk: ["{{制酸劑、鈣劑、腸胃蠕動藥|物質}}會降低吸收"],
    indications: ["{{G(-) 泌尿道感染|疾病}}", "{{孕婦|族群}}可安全用 #佛"],
    resistance: ["藥物進入細胞不足：依賴甘油磷酸 ({{GlpT|標的}}) 或葡萄糖-6-磷酸 ({{UhpT|標的}}) 運輸系統減少"] },
  { id: "fosmidomycin", chapter: 3, name: "Fosmidomycin", type: "drug", group: "其他細胞壁抑制劑", source: "W2",
    mechanism: ["抑制 {{MurA|標的}}（步驟一）"],
    notes: ["W2 只寫到機轉"] },
  { id: "bacitracin", chapter: 3, name: "Bacitracin", type: "drug", group: "其他細胞壁抑制劑", source: "W2",
    mechanism: ["抑制 {{BP (Bactoprenol)|標的}} {{去磷酸化|反應}}（步驟二） #B讓B回不了家"],
    adverse: ["全身性{{腎毒性|副作用}}"],
    indications: ["僅{{局部|給藥途徑}}使用：革蘭氏陽性菌、{{奈瑟氏菌 (Neisseria)|菌種}}、嗜血桿菌 (Haemophilus)", "口服治 {{C. difficile|菌種}}、{{VRE|菌種}} 腸炎"] },
  { id: "daptomycin", chapter: 3, name: "Daptomycin", type: "drug", group: "其他細胞壁抑制劑", source: "W2",
    mechanism: ["作用於{{細胞膜|作用位置}}！ #大柏愛亂摸", "{{環脂肽|結構}}，{{Ca2+|離子}} 協助插膜 → {{K+|離子}} 流失去極化造成細菌死亡"],
    spectrum: ["治療 G(+) 引發的感染，包含 {{MRSA、VRSA、VRE|菌種}}"],
    contraindications: ["與{{肺表面張力素|物質}}結合 → 不用於{{肺炎|疾病}}"] },

  /* ===== 第 4 章 蛋白質合成抑制劑（W2 後半）=====
     概論、作用位置速記、Aminoglycosides／Tetracyclines／Macrolides 的共通內容在第 4 章知識樹 */
  { id: "streptomycin", chapter: 4, name: "Streptomycin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"] },
  { id: "gentamicin", chapter: 4, name: "Gentamicin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"],
    indications: ["與 Vancomycin 併用治{{心內膜炎|疾病}}"] },
  { id: "tobramycin", chapter: 4, name: "Tobramycin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"] },
  { id: "amikacin", chapter: 4, name: "Amikacin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"],
    resistance: ["較不受{{修飾酶|酵素}}（質體）影響 #阿瑪尼比較厲害"] },
  { id: "netilmicin", chapter: 4, name: "Netilmicin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"],
    resistance: ["較不受{{修飾酶|酵素}}（質體）影響"] },
  { id: "neomycin", chapter: 4, name: "Neomycin", type: "drug", group: "Aminoglycosides", class: "aminoglycosides", source: "W2",
    notes: ["屬於 {{Aminoglycosides|藥物類別}}（{{30S|標的}}）"],
    adverse: ["{{外用|給藥途徑}}易{{過敏|副作用}} #沒辦法，畢竟是新的東西"] },

  { id: "tetracycline", chapter: 4, name: "Tetracycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    notes: ["屬於 {{Tetracyclines|藥物類別}}（{{30S|標的}}）"] },
  { id: "chlortetracycline", chapter: 4, name: "Chlortetracycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    notes: ["屬於 {{Tetracyclines|藥物類別}}（{{30S|標的}}）"] },
  { id: "oxytetracycline", chapter: 4, name: "Oxytetracycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    notes: ["屬於 {{Tetracyclines|藥物類別}}（{{30S|標的}}）"] },
  { id: "demeclocycline", chapter: 4, name: "Demeclocycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    notes: ["屬於 {{Tetracyclines|藥物類別}}（{{30S|標的}}）"] },
  { id: "methacycline", chapter: 4, name: "Methacycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    notes: ["屬於 {{Tetracyclines|藥物類別}}（{{30S|標的}}）"] },
  { id: "doxycycline", chapter: 4, name: "Doxycycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    pk: ["★經{{膽汁|器官}} → 糞便排除，腎功能差可用 #東西要大出來了"],
    indications: ["G(-)：{{霍亂|疾病}}", "螺旋體：{{萊姆病|疾病}}", "{{黴漿菌肺炎|疾病}}（或 Macrolides）", "披衣菌 {{鸚鵡熱|疾病}}（或 Azithromycin）"] },
  { id: "minocycline", chapter: 4, name: "Minocycline", type: "drug", group: "Tetracyclines", class: "tetracyclines", source: "W2",
    pk: ["{{脂溶性|性質}}好，可達 {{CSF|部位}}、淚液、唾液"] },

  { id: "tigecycline", chapter: 4, name: "Tigecycline", type: "drug", group: "Tigecycline", source: "W2",
    notes: ["老虎黴素；{{Glycylcycline|藥物類別}} 衍生物"],
    mechanism: ["結合 {{30S A site|標的}}"],
    resistance: ["★Tetracycline 的抗藥機轉（{{efflux|機轉}}、{{核糖體保護|機轉}}）對它無效"],
    spectrum: ["對一些高度抗藥性的 G(+)、G(-) 和{{厭氧菌|菌種}}有療效"],
    indications: ["{{後線用藥|名詞}}：MRSA、VRE、鏈球菌、厭氧菌", "{{複雜性皮膚感染|疾病}}、{{複雜性腹腔內感染|疾病}}"] },
  { id: "chloramphenicol", chapter: 4, name: "Chloramphenicol", type: "drug", group: "Chloramphenicol", source: "W2",
    mechanism: ["結合 {{50S|標的}}，抑制 {{peptidyl transferase|標的}} #濾網不給你過"],
    pk: ["抑制肝臟的 {{CYP450|酵素}} 系統"],
    spectrum: ["廣效（類似 Tetracyclines）；{{厭氧菌|菌種}}效果極佳", "{{綠膿桿菌|菌種}}、{{披衣菌|菌種}}無效 #小綠綠"],
    indications: ["{{立克次體|菌種}}", "{{眼部局部感染|疾病}}"],
    adverse: ["需監測血中濃度", "★特異體質 → 致命{{再生不良性貧血|副作用}}", "★{{灰嬰症|副作用}}"] },

  { id: "erythromycin", chapter: 4, name: "Erythromycin", type: "drug", group: "Macrolides", class: "macrolides", source: "W2",
    pk: ["食物 {{↓|性質}} 吸收；{{膽汁|器官}}代謝"],
    indications: ["{{白喉|疾病}} #白紅"] },
  { id: "clarithromycin", chapter: 4, name: "Clarithromycin", type: "drug", group: "Macrolides", class: "macrolides", source: "W2",
    pk: ["食物 {{↑|性質}} 吸收；{{尿液|藥動}}排除 #克拉麗沒膽"] },
  { id: "azithromycin", chapter: 4, name: "Azithromycin", type: "drug", group: "Macrolides", class: "macrolides", source: "W2",
    pk: ["食物 {{↓|性質}} 吸收；{{膽汁|器官}}"],
    indications: ["★{{退伍軍人症|疾病}} #阿z是軍人"],
    contraindications: ["Macrolides 抑制 CYP450 的{{例外|名詞}} #阿z剛退伍什麼都不會"] },
  { id: "telithromycin", chapter: 4, name: "Telithromycin", type: "drug", group: "Macrolides", class: "macrolides", source: "W2",
    notes: ["{{ketolide|藥物類別}}"],
    adverse: ["{{重症肌無力|疾病}}惡化、{{QT 延長|副作用}}"] },
  { id: "clindamycin", chapter: 4, name: "Clindamycin", type: "drug", group: "Clindamycin", source: "W2",
    mechanism: ["{{50S|標的}}：抑制 {{translocation|機轉}}"],
    spectrum: ["G(+) 球菌、★厭氧菌 {{B. fragilis|菌種}}"],
    adverse: ["★{{偽膜性結腸炎|副作用}}（C. difficile） #克林奶粉拉稀", "★{{困難梭狀芽孢桿菌 (Clostridium difficile)|菌種}}伺機性感染"] },
  { id: "synercid", chapter: 4, name: "Synercid（Quinupristin / Dalfopristin）", short: "Synercid", type: "drug", group: "Streptogramins", source: "W2",
    notes: ["{{Streptogramins|藥物類別}} 鏈陽菌素：Quinupristin : Dalfopristin = {{30 : 70|數值}} #SD"],
    mechanism: ["結合 50S {{兩個|數值}}不同位點"],
    pk: ["{{IV|給藥途徑}}（5% 葡萄糖）", "堆積{{肺、膽囊|器官}}；能穿透巨噬細胞與多核性白血球", "{{膽汁|器官}}排除"],
    indications: ["G(+) cocci", "VRE（{{E. faecium|菌種}} 有效，E. faecalis 無效） #um有用", "MRSA、MRSE"],
    adverse: ["{{關節/肌肉痛|副作用}}", "抑制 {{CYP3A4|酵素}}（Digoxin）"] },
  { id: "linezolid", chapter: 4, name: "Linezolid (Zyvox)", short: "Linezolid", type: "drug", group: "Linezolid", source: "W2",
    mechanism: ["結合 50S 的 {{23S rRNA|標的}}，抑制蛋白質轉錄的{{起始|反應}}步驟"],
    resistance: ["{{No cross-resistance|名詞}}（無交叉抗藥性）"],
    spectrum: ["G(+)：{{VRE、MRSA、MRSE|菌種}}"] },
  { id: "mupirocin", chapter: 4, name: "Mupirocin", type: "drug", group: "其他蛋白質合成抑制劑", source: "W2",
    mechanism: ["干擾 {{tRNA|標的}} 生合成；{{殺菌|藥效}}劑"],
    indications: ["{{局部外用|給藥途徑}}：{{鼻腔 MRSA|疾病}}感染 #姆姆(用鼻子發出聲音)"] },
  { id: "fusidic-acid", chapter: 4, name: "Fusidic acid", type: "drug", group: "其他蛋白質合成抑制劑", source: "W2",
    mechanism: ["抑制 {{translocation|機轉}}；{{殺菌|藥效}}"],
    spectrum: ["廣效，含 {{MRSA|菌種}}"],
    pk: ["{{膽汁|器官}}排除"] },

  /* ===== 第 5 章 抗分枝桿菌藥物（W3 前半）=====
     分枝桿菌特性、作用標的、Rifamycins 共通內容、一線／二線副作用、MAC 用藥在第 5 章知識樹 */
  { id: "isoniazid", chapter: 5, name: "Isoniazid (INH)", short: "Isoniazid", type: "drug", group: "結核一線用藥", source: "W3",
    mechanism: ["{{Prodrug|名詞}}：經 {{KatG|酵素}} 活化 → Isonicotinic acid + {{ROS|物質}}（攻擊 DNA）", "抑制 {{InhA|標的}} → 抑制 {{mycolic acid|結構}}"],
    pk: ["避免{{制酸劑|物質}}", "{{空腹|性質}}口服"],
    adverse: ["抑制 {{P450|酵素}} → {{Phenytoin|藥名}} 濃度 ↑", "{{Acetylhydrazide|物質}} 有肝毒性", "{{周邊神經病變|副作用}}"] },
  { id: "rifampin", chapter: 5, name: "Rifampin (RIF)", short: "Rifampin", type: "drug", group: "結核一線用藥", class: "rifamycins", source: "W3",
    notes: ["商品名 Rifadin、Rimactane"],
    pk: ["{{誘導|性質}}肝臟酵素 P450，造成藥物交互作用"],
    adverse: ["{{類流感症狀|副作用}}", "{{橘紅色|顏色}}體液"] },
  { id: "rifabutin", chapter: 5, name: "Rifabutin", type: "drug", group: "結核一線用藥", class: "rifamycins", source: "W3",
    indications: ["HIV 病人同時有{{結核病|疾病}}或 MAC 時多選用 #我愛吃布丁", "HIV 病人 {{MAC 預防|名詞}}首選"],
    pk: ["較不會誘導肝臟 P450（HIV 治療會服用經肝臟酵素代謝的{{蛋白酶抑制劑 (PIs)|藥物類別}}、NNRTIs）"] },
  { id: "rifapentine", chapter: 5, name: "Rifapentine", type: "drug", group: "結核一線用藥", class: "rifamycins", source: "W3",
    notes: ["商品名 Priftin"],
    pk: ["{{誘導|性質}}肝臟酵素 P450，有藥物交互作用"] },
  { id: "pyrazinamide", chapter: 5, name: "Pyrazinamide (PZA)", short: "Pyrazinamide", type: "drug", group: "結核一線用藥", source: "W3",
    mechanism: ["{{Prodrug|名詞}}：{{pncA (amidase)|酵素}} → {{Pyrazinoic acid (POA)|物質}}", "抑制 {{Fatty acid synthase I|標的}}；降低 pH", "減少膜通透性、物質運輸"],
    adverse: ["★{{高尿酸血症/痛風|副作用}} #PIZZA放太多海鮮了"] },
  { id: "ethambutol", chapter: 5, name: "Ethambutol (EMB)", short: "Ethambutol", type: "drug", group: "結核一線用藥", source: "W3",
    mechanism: ["抑制 {{arabinosyl transferase|標的}} → 阻斷 {{AG|結構}}（細胞壁重要成分）合成"],
    adverse: ["★影響{{視覺|副作用}}：{{視神經炎|副作用}} #阿拉伯眼(EYE)睛閉閉(B)"] },
  { id: "ethionamide", chapter: 5, name: "Ethionamide (ETA)", short: "Ethionamide", type: "drug", group: "結核二線用藥", source: "W3",
    mechanism: ["抑制 {{InhA|標的}} #New Jeans在打官司"],
    adverse: ["腸胃耐受不佳", "{{肝毒性|副作用}}", "{{甲狀腺機能低下|副作用}}"] },
  { id: "pasa", chapter: 5, name: "PASA", type: "drug", group: "結核二線用藥", source: "W3",
    mechanism: ["模仿 {{PABA|受質}} 抑制{{葉酸|作用位置}}合成"],
    contraindications: ["使 {{INH|藥名}} 在血漿中的濃度提高，產生{{肝毒性|副作用}}"],
    adverse: ["腸胃耐受不佳", "肝毒性", "{{甲狀腺機能低下|副作用}}"] },
  { id: "capreomycin", chapter: 5, name: "Capreomycin", type: "drug", group: "結核二線用藥", source: "W3",
    mechanism: ["抑制{{轉譯|作用位置}} #翻譯卡片可能會違反著作權"],
    adverse: ["{{腎毒性|副作用}}", "{{聽毒性|副作用}}"] },
  { id: "dapsone", chapter: 5, name: "Dapsone", type: "drug", group: "痲瘋病用藥", source: "W3",
    indications: ["{{痲瘋病|疾病}} #打殼"] },
  { id: "clofazimine", chapter: 5, name: "Clofazimine", type: "drug", group: "痲瘋病用藥", source: "W3",
    indications: ["{{痲瘋病|疾病}} #打殼"],
    notes: ["{{深紅色|顏色}}晶體"] },

  /* ===== 第 6 章 抗黴菌藥（W3 後半）=====
     真菌概論、Polyenes／Allylamines／Azoles／Glucan 合成抑制劑的共通內容在第 6 章知識樹 */
  { id: "amphotericin-b", chapter: 6, name: "Amphotericin B", type: "drug", group: "Polyenes", class: "polyenes", source: "W3",
    pk: ["會穿過{{胎盤|部位}}"],
    adverse: ["★{{腎毒性|副作用}}（{{可逆|性質}}） #腎是牛Ｂ"] },
  { id: "nystatin", chapter: 6, name: "Nystatin", type: "drug", group: "Polyenes", class: "polyenes", source: "W3",
    notes: ["屬於 {{Polyenes|藥物類別}}"] },
  { id: "terbinafine", chapter: 6, name: "Terbinafine", type: "drug", group: "Allylamines", class: "allylamines", source: "W3",
    indications: ["{{口服|給藥途徑}}治{{甲癬、頭癬|疾病}}；局部治足/體/股癬", "局部使用：製成 {{1%|數值}} Cream/gel/solution"],
    pk: ["可分布於皮膚、指甲和{{脂肪組織|部位}}", "會堆積在{{乳汁|部位}}中 → {{哺乳中婦女|族群}}禁用 #特別愛胸部"],
    adverse: ["腸胃不適", "{{味覺與視覺|副作用}}受干擾", "為 {{CYP450 2D6|酵素}} 抑制劑"] },
  { id: "naftifine", chapter: 6, name: "Naftifine", type: "drug", group: "Allylamines", class: "allylamines", source: "W3",
    notes: ["屬於 {{Allylamines|藥物類別}}"] },
  { id: "butenafine", chapter: 6, name: "Butenafine", type: "drug", group: "Allylamines", class: "allylamines", source: "W3",
    notes: ["屬於 {{Allylamines|藥物類別}}"] },
  { id: "ketoconazole", chapter: 6, name: "Ketoconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Imidazole|結構}}（2N，多外用） #KMC"] },
  { id: "miconazole", chapter: 6, name: "Miconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Imidazole|結構}}（2N，多外用） #KMC"] },
  { id: "clotrimazole", chapter: 6, name: "Clotrimazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Imidazole|結構}}（2N，多外用） #KMC"] },
  { id: "fluconazole", chapter: 6, name: "Fluconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Triazole|結構}}（3N，全身）"] },
  { id: "itraconazole", chapter: 6, name: "Itraconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Triazole|結構}}（3N，全身）"] },
  { id: "voriconazole", chapter: 6, name: "Voriconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Triazole|結構}}（3N，全身）"] },
  { id: "posaconazole", chapter: 6, name: "Posaconazole", type: "drug", group: "Azoles", class: "azoles", source: "W3",
    notes: ["{{Triazole|結構}}（3N，全身）"] },
  { id: "flucytosine", chapter: 6, name: "Flucytosine (5-FC)", short: "Flucytosine", type: "drug", group: "其他抗黴菌藥", source: "W3",
    mechanism: ["{{Fungal cytosine deaminase|酵素}} → {{5-FU|藥名}} → 5-FdUMP 抑制 {{thymidylate synthase|標的}}"],
    indications: ["主要治療{{隱球菌 (Cryptococcus)|菌種}}", "+ {{Amphotericin B|藥名}} → 隱球菌（腦膜炎）", "+ {{Itraconazole|藥名}} → {{產色黴菌病|疾病}}"],
    adverse: ["{{骨髓抑制|副作用}}（腸道菌產生 5-FU）", "{{腸炎|副作用}}"] },
  { id: "griseofulvin", chapter: 6, name: "Griseofulvin", type: "drug", group: "其他抗黴菌藥", source: "W3",
    mechanism: ["抑制{{微管|標的}} → 阻止{{有絲分裂|反應}}"],
    contraindications: ["{{孕婦|族群}}、{{紫質症|疾病}}禁用"] },
  { id: "caspofungin", chapter: 6, name: "Caspofungin", type: "drug", group: "Glucan 合成抑制劑", class: "echinocandins", source: "W3",
    indications: ["治療{{侵入性念珠菌|疾病}}", "{{侵入性麴菌感染 (invasive aspergillosis)|疾病}}"],
    pk: ["{{肝功能差|疾病}}需調劑量"] },
  { id: "micafungin", chapter: 6, name: "Micafungin", type: "drug", group: "Glucan 合成抑制劑", class: "echinocandins", source: "W3",
    indications: ["{{侵入性念珠菌感染 (invasive candidiasis)|疾病}}{{第一線|名詞}}用藥 #米卡米卡！！！！(米卡丘)", "{{造血幹細胞移植|名詞}}手術預防性投藥"],
    pk: ["腎功能障礙或輕至中度肝功能障礙者{{不須調整劑量|藥動}}"] },
  { id: "anidulafungin", chapter: 6, name: "Anidulafungin", type: "drug", group: "Glucan 合成抑制劑", class: "echinocandins", source: "W3",
    pk: ["{{嚴重肝功能障礙|疾病}}可用 #阿妮丟！！！"] },
  { id: "nikkomycin", chapter: 6, name: "Nikkomycin", type: "drug", group: "其他抗黴菌藥", source: "W3",
    mechanism: ["競爭性抑制{{幾丁質合成酶|標的}}"] }
];
