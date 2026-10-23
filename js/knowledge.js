/* PHARMA ISLAND：知識樹內容
   每一章一棵知識樹，長在那一章的初始格子上（抗微生物主島的第 1～8 章各一棵，第 9、10、11 章各一棵）。
   點樹會打開知識面板。這裡只放資料，依課堂講義慢慢補。
   - chapter：樹長在哪一章（對應 js/data.js 的 PI.CHAPTERS）。沒有列在這裡的章節不會長知識樹。
   - sections：面板裡的分段。可以改標題、增加或刪除分段。
   - items：每段裡的內容卡片。補內容時照下面的格式往 items 裡加：

       { id: "fq",                              // 選填：藥物格的 class 指到這裡（類別共通內容）
         title: "小標題",
         text: "一段說明文字（選填）",
         points: ["重點一", "重點二"],          // 條列重點（選填）
         image: "assets/knowledge/xxx.png",     // 圖（選填）
         source: "第 3 週講義 p.12" }           // 出處（選填，建議填，方便回去對照）

       或 { unit: "fetal-toxicity" }：直接顯示某個格子（js/units.js）的內容。
       這種引用只給你讀，題目算在格子上，不會重複出題、重複給經驗值。

   挖空寫法和 js/units.js 一樣：{{答案|類型}} 是挖空處、句尾「 #口訣」是提示。
   知識樹的挖空也會出題，答對每題得到 PI.LEVEL.expPerTreeQuestion 經驗值（js/data.js）。
   內容只用講義上的資料；items 是空的時候，面板會顯示「尚未加入內容」。 */
window.PI = window.PI || {};

PI.KNOWLEDGE = {
  ch1: {   // 第 1 章的內容都在主題格上（js/units.js），這裡用 unit 引用，只顯示、不重複出題
    chapter: 1, title: "抗菌藥物療法導論",
    sections: [
      { id: "basics",    title: "基本概念", items: [{ unit: "antibiotics-vs-antimicrobials" }, { unit: "static-vs-cidal" }] },
      { id: "mechanism", title: "藥理機制", items: [{ unit: "moa-wall-membrane" }, { unit: "moa-folate-nucleic" }, { unit: "moa-protein" }] },
      { id: "clinical",  title: "臨床重點", items: [{ unit: "fetal-toxicity" }, { unit: "prophylaxis" }] }
    ]
  },
  ch2: {
    chapter: 2, title: "磺胺藥與泌尿道感染用藥",
    sections: [
      { id: "physiology", title: "生理與病理", items: [
        { title: "葉酸合成路徑", image: "assets/knowledge/folate-pathway.png", source: "W1（講義圖）",
          points: [
            "細菌：Pteridine + {{PABA|受質}} →（{{Dihydropteroate synthase|標的}}）→ Dihydropteroic acid",
            "細菌與人：{{Dihydrofolate|受質}} →（{{DHFR|標的}}）→ {{Tetrahydrofolate|受質}}",
            "Tetrahydrofolate → Purines（DNA、RNA）、Methionine／Glycine／fMet-tRNA（Proteins）、Thymidine（DNA）"
          ] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { title: "干擾葉酸合成路徑", source: "W1",
          points: [
            "抑制細菌 {{DHPS|標的}}（與 {{PABA|受質}} 競爭）：{{Sulfonamides|藥名}}",
            "抑制人與細菌 {{DHFR|標的}}（{{DHF → THF|反應}}）：Trimethoprim、Methotrexate、Pyrimethamine"
          ] },
        { title: "Fluoroquinolones 機轉", source: "W1",
          points: [
            "★G(-) 主打 {{gyrase|標的}}；G(+) 主打 {{topo IV|標的}} #腹肌正脫露腹肌"
          ] }
      ] },
      { id: "classes", title: "藥物分類與作用原理", items: [
        { id: "sulfonamides", title: "Sulfonamides 磺胺藥：藥動", source: "W1",
          points: [
            "大多口服吸收好，也可 IV、局部（例外：Sulfasalazine 口服不吸收）",
            "可穿透 {{BBB|部位}}",
            "與{{白蛋白|物質}}親和力強 → 置換其他藥物",
            "N4 在{{肝|器官}}乙醯化 → {{酸性|性質}}尿中晶尿症"
          ] },
        { title: "Sulfonamides 磺胺藥：臨床應用", source: "W1",
          points: [
            "{{Nocardiosis|疾病}} 土壤絲菌病",
            "急性 {{UTI|疾病}}",
            "外用／燒燙傷：Silver sulfadiazine；抗 Chloroquine 瘧疾：Sulfadoxine + Pyrimethamine；弓漿蟲：Sulfadiazine + Pyrimethamine"
          ] },
        { title: "Sulfonamides 磺胺藥：副作用、禁忌、抗藥性", source: "W1",
          points: [
            "副作用：{{晶尿症|副作用}}、過敏、{{溶血性貧血|副作用}}、暫時性藥物增效",
            "{{核黃疸|副作用}}：置換膽紅素",
            "禁忌：治療 UTI 不可與 {{Methenamine|藥名}} 併用（{{甲醛|物質}}沉澱 → 結晶尿）",
            "抗藥性：磺胺藥間{{交叉抗藥|名詞}}；{{Co-trimoxazole|藥名}} 可能仍有效"
          ] },
        { id: "fq", title: "Fluoroquinolones：特性與藥動", source: "W1",
          points: [
            "結構：有{{四|數值}}代",
            "可治療性傳染病，如 {{Gonorrhea（淋病）|疾病}}；但{{梅毒|疾病}}無效 #腹肌梅辦法",
            "與 {{Al3+/Mg2+/Fe3+/Zn2+|離子}}、制酸劑、Sucralfate、乳製品螯合",
            "骨、前列腺、腎、肺濃度高；在{{肺|器官}}中濃度比血漿中高",
            "多經{{腎|器官}}排除；Moxifloxacin 經肝"
          ] },
        { title: "Fluoroquinolones：副作用", source: "W1",
          points: [
            "{{QT 延長|副作用}} #有腹肌的男生讓我心律不整",
            "{{軟骨受損|副作用}}",
            "藥物交互作用"
          ] },
        { title: "Fluoroquinolones：各代", source: "W1",
          points: [
            "第一代：Nalidixic acid（{{G(-)|菌種}}，已少用）",
            "第二代：Ciprofloxacin、Norfloxacin",
            "第三代：又稱 {{Respiratory FQ|名詞}}；Levofloxacin",
            "第四代：增加{{厭氧菌|菌種}}抗菌譜；Moxifloxacin、Trovafloxacin"
          ] }
      ] }
    ]
  },
  ch3: {
    chapter: 3, title: "細胞壁合成抑制劑",
    sections: [
      { id: "physiology", title: "生理與病理", items: [
        { title: "G(+) vs G(-)", source: "W2",
          points: [
            "G(+)：肽聚醣{{厚|性質}}、藥物易穿透",
            "G(-)：肽聚醣薄、有 {{outer membrane|結構}} + {{porin|結構}}、藥物難穿透"
          ] },
        { title: "名詞", source: "W2",
          points: [
            "{{PBP (transpeptidase)|標的}}：Penicillin 類作用標的",
            "{{β-lactamase|酵素}}：細菌破壞 β-lactam 的酵素"
          ] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { title: "細胞壁合成步驟一：合成單體", source: "W2",
          points: [
            "{{Fosfomycin|藥名}}、Fosmidomycin → 抑制 {{MurA|標的}}",
            "{{Cycloserine|藥名}} → 抑制 {{Alanine racemase|標的}}、D-Ala-D-Ala synthetase"
          ] },
        { title: "細胞壁合成步驟二：單體連接", source: "W2",
          points: [
            "載體 {{BP (Bactoprenol)|標的}} 攜帶翻出膜外；BP 需{{去磷酸化|反應}}才能回收",
            "{{Bacitracin|藥名}} → 抑制 BP 去磷酸化",
            "{{PGT|標的}} 串聯聚合；{{Vancomycin|藥名}}、Teicoplanin → 結合 {{D-Ala-D-Ala|受質}}，抑制 PGT"
          ] },
        { title: "細胞壁合成步驟三：連接體連接", source: "W2",
          points: [
            "{{Transpeptidase (PBP)|標的}}：{{Gly|受質}} 攻擊另一鏈 D-Ala → 網狀結構",
            "{{β-lactam antibiotics|藥物類別}} 抑制 PBP"
          ] }
      ] },
      { id: "classes", title: "藥物分類與作用原理", items: [
        { id: "penicillins", title: "Penicillins：結構與機轉", image: "assets/knowledge/penicillin-structure.png", source: "W2（講義圖）",
          points: [
            "結構：{{β-lactam ring|結構}} + 五元 {{thiazolidine ring|結構}}",
            "{{R 側鏈|結構}}決定：抗菌譜、吸收、耐 β-lactamase",
            "機轉：抑制 {{transpeptidase|標的}}；對{{分裂中|性質}}細菌（autolysin）更有效"
          ] },
        { title: "Penicillins：分類", source: "W2",
          points: [
            "{{天然|名詞}}：Penicillin G（不耐酸不耐酶）、Penicillin V（耐酸可口服）",
            "{{抗葡萄球菌（耐酶）|名詞}}：Methicillin、Nafcillin、Oxacillin、Dicloxacillin",
            "{{廣效|名詞}}：Ampicillin、Amoxicillin",
            "{{抗綠膿|名詞}}：Carbenicillin、Piperacillin、Ticarcillin、Azlocillin",
            "對 β-lactamase 沒有抗性的藥物常會搭配 {{β-lactamase inhibitors|藥物類別}}，如 Piperacillin + Tazobactam"
          ] },
        { title: "Penicillins：藥動", source: "W2",
          points: [
            "不易穿越 {{BBB|部位}} 進入 CSF #鉛筆太粗了",
            "原型經{{腎|器官}}快速排除；尿液會有藥味"
          ] },
        { title: "Penicillins：副作用", source: "W2",
          points: [
            "{{過敏|副作用}}",
            "{{腹瀉|副作用}}：常見於廣效型 penicillin，如 Ampicillin",
            "{{間質性腎炎|副作用}}：Methicillin",
            "{{神經毒性|副作用}}：高劑量／鞘內",
            "{{血液毒性|副作用}}：血小板功能下降",
            "{{陽離子毒性|副作用}}：{{低血鉀|副作用}}"
          ] },
        { title: "Penicillins：抗藥性", source: "W2",
          points: [
            "{{β-lactamase|酵素}}",
            "{{通透性下降|機轉}}：綠膿缺 {{porin|結構}}",
            "{{PBP 改變|機轉}}：{{MRSA|菌種}}、腸球菌",
            "不 {{autolysin|酵素}}"
          ] },
        { id: "cephalosporins", title: "Cephalosporins：結構與藥動", source: "W2",
          points: [
            "結構：β-lactam ring + 六元 {{dihydrothiazine ring|結構}}",
            "多 {{IV/IM|給藥途徑}} #多數要打針",
            "可口服：{{Cephalexin|藥名}}、Cefuroxime 等 #吃發糕，啃皮草",
            "只有第三代 {{Ceftriaxone|藥名}}、Cefotaxime 可進 CSF #T家族照 X 光才看得到腦",
            "大部分經由{{腎小管的分泌作用|藥動}}",
            "{{膽汁|器官}}排除（腎功能差可用）：Cefamandole、Cefoperazone、Ceftriaxone"
          ] },
        { title: "Cephalosporins：各代", source: "W2",
          points: [
            "第一代：{{G(+)|菌種}} 為主（PEcK） #很色PECK",
            "第二代：G(-)↑（{{HENPEcK|名詞}}） #HEN色PEck",
            "第三代：G(-)↑↑、{{G(+)↓|菌種}}",
            "第四代：Cefepime、Cefpirome；G(+)、G(-) 皆廣，抗{{綠膿|菌種}}",
            "第五代：Ceftaroline、Ceftobiprole；★可抗 {{MRSA|菌種}}"
          ] },
        { title: "Cephalosporins：副作用", source: "W2",
          points: [
            "過敏；對 {{Penicillin|藥物類別}} 交叉過敏",
            "{{MTT 基團|結構}}（Cefoperazone、Cefotetan、Cefamandole）：{{Disulfiram-like|副作用}}（乙醛堆積）、抗{{維生素 K|物質}} → 出血、低凝血酶原",
            "{{重疊感染|副作用}}、腎毒性"
          ] },
        { id: "carbapenems", title: "Carbapenems", source: "W2",
          points: [
            "可抵抗大部分 {{β-lactamases|酵素}} 的水解",
            "Imipenem、Meropenem、Doripenem、Ertapenem",
            "Imipenem、Meropenem、Doripenem：廣效 G(+)、G(-)、{{厭氧菌|菌種}}（不含 MRSA）"
          ] },
        { id: "bl-inhibitors", title: "β-lactamase 抑制劑", source: "W2",
          points: [
            "本身{{無抗菌力|性質}}，需併用抗生素",
            "{{Clavulanate|藥名}}、Sulbactam、Tazobactam #可舒坦",
            "對少部分 G(-) 產生的 β-lactamase 無效：如{{柑橘酸桿菌 (Citrobacter)|菌種}}、假單胞菌 (Pseudomonas)、腸桿菌 (Enterobacter)、沙雷氏菌 (Serratia)",
            "常見組合：抗生素 + β-lactamase 抑制劑"
          ] }
      ] }
    ]
  },
  ch4: {
    chapter: 4, title: "蛋白質合成抑制劑",
    sections: [
      { id: "physiology", title: "生理與病理", items: [
        { title: "概論", source: "W2",
          points: ["作用在核糖體：細菌 {{70S|標的}}（30S + 50S）"] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { title: "★作用位置速記（必考）", source: "W2",
          points: [
            "{{30S|標的}}：Tetracyclines、Tigecycline、Aminoglycosides #30歲買AT，50歲搞CSCEL",
            "{{50S|標的}}：Chloramphenicol、Erythromycin (Macrolides)、Clindamycin、Linezolid"
          ] },
        { id: "aminoglycosides", title: "Aminoglycosides（30S）：化學與機轉", source: "W2",
          points: [
            "{{糖基 + 胺基|結構}}組成",
            "{{Streptomyces|菌種}} 來源 → -mycin；{{Micromonospora|菌種}} 來源 → -micin",
            "Streptomycin、Gentamicin、Tobramycin、Amikacin、Netilmicin、Neomycin",
            "干擾核糖體組裝、限制 {{polysome|結構}} 形成",
            "{{mRNA 錯讀|機轉}} → 異常蛋白",
            "★進入菌體需 {{O2|物質}} + 能量 → {{厭氧|性質}}、低 pH 無效 #阿咪容易缺氧、很餓",
            "{{Ca2+、Mg2+|離子}} 抑制其進入"
          ] },
        { id: "tetracyclines", title: "Tetracyclines（30S）：機轉", source: "W2",
          points: [
            "Tetracycline、Chlortetracycline、Oxytetracycline、Demeclocycline、Methacycline、Doxycycline、Minocycline",
            "結合 30S，阻止 {{tRNA|受質}} 接到 {{A site|標的}} #不給你接"
          ] },
        { id: "macrolides", title: "Macrolides 巨環內酯（50S，-thromycin）：機轉", source: "W2",
          points: [
            "Erythromycin、Clarithromycin、Azithromycin、Telithromycin（{{ketolide|藥物類別}}）",
            "結合 50S，抑制 {{translocation|機轉}} #馬馬馬馬馬(切斷擬聲)"
          ] }
      ] },
      { id: "classes", title: "藥物分類與作用原理", items: [
        { title: "Aminoglycosides：藥動與臨床應用", source: "W2",
          points: [
            "高極性、帶多{{正電|性質}}（NH2）→ 口服吸收差；注射或局部 #阿咪是個很正的女孩子",
            "分布廣，但不進 {{CNS|部位}}",
            "嚴重{{需氧 G(-) 桿菌|菌種}}、G(+) 球菌感染",
            "治療指數{{窄|性質}} → 易毒性"
          ] },
        { title: "Aminoglycosides：抗藥性", source: "W2",
          points: [
            "攝取減少：缺 O2 依賴運輸系統",
            "受體改變：{{30S rRNA|標的}} 親和力下降",
            "★{{修飾酶|酵素}}（質體）；{{Amikacin|藥名}}、Netilmicin 較不受影響 #阿瑪尼比較厲害"
          ] },
        { title: "Aminoglycosides：副作用", source: "W2",
          points: [
            "★{{耳毒性|副作用}}（{{不可逆|性質}}）：第{{八|數值}}對腦神經",
            "★{{腎毒性|副作用}}（{{可逆|性質}}） #阿咪時不時壞腎",
            "{{神經肌肉阻斷|副作用}}：抑制突觸前 {{ACh|物質}} 釋放 + 降低受體敏感 → 呼吸抑制 #阿咪還真的是很常缺氧。",
            "過敏：外用 {{Neomycin|藥名}} #沒辦法，畢竟是新的東西"
          ] },
        { title: "Tetracyclines：藥動", source: "W2",
          points: [
            "★與 {{Ca2+、Mg2+、Al3+、Fe2+/Fe3+|離子}} 螯合 → 空腹，勿併牛奶、制酸劑",
            "沉積{{鈣化組織|部位}}（牙齒、骨骼）；可穿透胎盤 → {{孕婦|族群}}禁用",
            "Minocycline：脂溶性好，可達 CSF、淚液、唾液",
            "★Doxycycline：膽汁 → 糞便排除，腎功能差可用"
          ] },
        { title: "Tetracyclines：抗菌範圍與應用", source: "W2",
          points: [
            "G(-)：{{霍亂|疾病}}（Doxycycline）",
            "螺旋體：{{萊姆病|疾病}}（Doxycycline）",
            "{{黴漿菌肺炎|疾病}}：Doxycycline 或 Macrolides",
            "披衣菌 {{鸚鵡熱|疾病}}：Doxycycline 或 Azithromycin",
            "{{立克次體|菌種}}：洛磯山斑疹熱"
          ] },
        { title: "Tetracyclines：抗藥性與副作用", source: "W2",
          points: [
            "R factor（質體）：★{{Mg2+ dependent efflux pump|機轉}}（Tet A、Tet K）最主要",
            "對一種有抗藥 → 全部 Tetracyclines 都抗藥 → 改 {{Tigecycline|藥名}}",
            "腸胃不適",
            "沉積在鈣化組織：牙齒、骨骼變黃；{{8|數值}} 歲以下孩童禁用",
            "致命{{肝毒性|副作用}}：高劑量，孕婦、腎盂腎炎患者"
          ] },
        { title: "Macrolides：藥動、副作用與交互作用", source: "W2",
          points: [
            "皆累積在{{肝臟|器官}}",
            "肝功能差避免：Erythromycin、Azithromycin、Telithromycin",
            "★交互作用：抑制 {{CYP450|酵素}} → 他藥濃度 ↑；{{Azithromycin|藥名}} 例外 #阿z剛退伍什麼都不會"
          ] }
      ] }
    ]
  },
  ch5: {
    chapter: 5, title: "抗分枝桿菌藥物",
    sections: [
      { id: "physiology", title: "生理與病理", items: [
        { title: "分枝桿菌特性", image: "assets/knowledge/mycobacteria-cell-wall.png", source: "W3（講義圖）",
          points: [
            "{{Acid-fast stain|名詞}}：分枝桿菌呈{{紅色|顏色}}",
            "生長{{慢|性質}}、可潛伏",
            "結構：類莢膜、{{Mycolic acid|結構}}、{{Arabinogalactan (AG)|結構}}"
          ] },
        { title: "種類", source: "W3",
          points: [
            "{{M. tuberculosis|菌種}} 結核病：肺部（{{80-85%|數值}}）、腦、骨頭、眼睛、皮膚（藉血液及淋巴系統擴散）",
            "形成{{結節 (tubercles)|名詞}}或肉芽腫 (granulomas)；可休眠再復發",
            "{{M. leprae|菌種}}：痲瘋",
            "{{MAC|菌種}}（M. avium + intracellulare）：難以分辨，常見多種藥物合併使用"
          ] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { title: "作用標的", source: "W3",
          points: [
            "{{細胞壁|作用位置}}：Isoniazid、Ethionamide、Ethambutol、Cycloserine",
            "{{細胞膜|作用位置}}：Pyrazinamide",
            "轉錄（{{RNA polymerase|標的}}）：Rifampin",
            "{{轉譯|作用位置}}：Aminoglycosides",
            "{{葉酸|作用位置}}：PAS",
            "{{DNA gyrase|標的}}：Fluoroquinolones"
          ] },
        { id: "rifamycins", title: "Rifamycins（Rifampin、Rifabutin、Rifapentine）", source: "W3",
          points: [
            "★結合 {{DNA-dependent RNA polymerase|標的}} {{β|結構}} 次單元 → 抑制 RNA 合成",
            "口服；★{{誘導|性質}} P450 → 大量交互作用",
            "★體液（尿、淚、汗）{{橘紅色|顏色}}，隱形眼鏡會染色",
            "副作用：空腹易造成腸胃不適；併服 {{Isoniazid|藥名}} 時肝功能異常機率略增；間歇服用會有 {{flu-like syndrome|副作用}}"
          ] }
      ] },
      { id: "classes", title: "藥物分類與作用原理", items: [
        { title: "結核一線用藥【老師強調重點】", source: "W3",
          points: [
            "{{Isoniazid (INH)|藥名}}、{{Rifampin (RIF)|藥名}}、{{Pyrazinamide (PZA)|藥名}}、{{Ethambutol (EMB)|藥名}} #一粒必醫",
            "一線用藥副作用大多較強"
          ] },
        { title: "一線用藥副作用", source: "W3",
          points: [
            "INH：{{周邊神經病變|副作用}}；{{Phenytoin/Carbamazepine|藥名}} 顯著交互作用",
            "RIF：{{類流感症狀|副作用}}、橘紅色體液",
            "PZA：{{高尿酸血症|副作用}}",
            "EMB：{{視神經炎|副作用}}"
          ] },
        { title: "二線用藥副作用", source: "W3",
          points: [
            "ETA、PASA：腸胃耐受不佳、{{肝毒性|副作用}}、{{甲狀腺機能低下|副作用}}",
            "Aminoglycosides／Capreomycin：{{腎毒性|副作用}}、{{聽毒性|副作用}}"
          ] },
        { title: "治療策略", source: "W3",
          points: [
            "建議藥物服用時長較{{長|性質}}",
            "{{DOTS 都治|名詞}}：送藥到手、服藥入口、吞下再走"
          ] },
        { title: "MAC 用藥", source: "W3",
          points: [
            "{{巨環內酯類|藥物類別}}：Clarithromycin / Azithromycin，抑制蛋白質合成 #都有Ｍ",
            "合併療法：Clarithromycin 或 Azithromycin，再加 {{Ethambutol (EMB)|藥名}}",
            "還可加上 Rifabutin、Fluoroquinolones、{{Amikacin|藥名}}",
            "{{Rifabutin|藥名}}：HIV 病人 MAC 預防首選"
          ] },
        { title: "痲瘋病用藥", source: "W3",
          points: ["{{Dapsone|藥名}}、Clofazimine #打殼"] }
      ] }
    ]
  },
  ch6: {
    chapter: 6, title: "抗黴菌藥",
    sections: [
      { id: "physiology", title: "生理與病理", items: [
        { title: "真菌概論", source: "W3",
          points: [
            "{{真核|名詞}}，細菌藥無效",
            "局部感染（{{足癬、甲癬|疾病}}）常見；全身感染見於{{免疫低下|族群}}",
            "{{Ergosterol|標的}} 為真菌特有 → 主要標的"
          ] }
      ] },
      { id: "mechanism", title: "藥理機制", items: [
        { id: "polyenes", title: "Polyenes（Amphotericin B、Nystatin）", source: "W3",
          points: ["結合 {{ergosterol|標的}} 形成{{孔洞|機轉}}"] },
        { id: "allylamines", title: "Allylamines（Terbinafine、Naftifine、Butenafine）", source: "W3",
          points: ["抑制 {{squalene epoxidase|標的}} #鯊魚被打昏"] },
        { id: "azoles", title: "Azoles", source: "W3",
          points: ["抑制 {{14α-sterol demethylase|標的}}（{{lanosterol → ergosterol|反應}}）"] },
        { id: "echinocandins", title: "Glucan 合成抑制劑（Caspofungin、Micafungin、Anidulafungin）", source: "W3",
          points: ["抑制 {{β-(1,3)-glucan synthase|標的}} → 細胞壁"] }
      ] },
      { id: "classes", title: "藥物分類與作用原理", items: [
        { title: "Polyenes：抗菌範圍與臨床應用", source: "W3",
          points: [
            "廣效：Candida、Cryptococcus、Histoplasma、Aspergillus 等",
            "{{Liposomal|名詞}} 劑型降腎毒性",
            "{{免疫低下|族群}}患者（如 AIDS、骨髓移植空窗期）",
            "治療嚴重真菌感染",
            "局部給藥（優點：降低副作用）：{{角膜感染 (Mycotic corneal ulcers)|疾病}}、角膜炎 (Keratitis)－滴劑、結膜下注射",
            "黴菌性關節炎 (Fungal arthritis)"
          ] },
        { title: "Polyenes：副作用", source: "W3",
          points: [
            "{{發冷發熱|副作用}}",
            "{{腎毒性|副作用}}",
            "{{低血鉀|副作用}}",
            "{{血栓靜脈炎|副作用}}",
            "貧血（{{EPO|物質}} ↓；EPO：紅血球生成素）"
          ] },
        { title: "Azoles：結構與副作用", source: "W3",
          points: [
            "{{Imidazole|結構}}（{{2|數值}}N，多外用）：Ketoconazole、Miconazole、Clotrimazole #KMC",
            "{{Triazole|結構}}（3N，全身）：Fluconazole、Itraconazole、Voriconazole、Posaconazole",
            "副作用：GI、{{致畸|副作用}}"
          ] },
        { title: "Glucan 合成抑制劑：副作用", source: "W3",
          points: ["造成 {{histamine-like syndrome|副作用}}"] }
      ] }
    ]
  },
  ch7: {
    chapter: 7, title: "抗病毒藥物",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch8: {
    chapter: 8, title: "消毒殺菌劑",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch9: {
    chapter: 9, title: "胰島素與口服降血糖藥",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch10: {
    chapter: 10, title: "呼吸系統用藥",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch11: {
    chapter: 11, title: "腸胃道用藥",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  }
};
