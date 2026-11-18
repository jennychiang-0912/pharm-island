/* PHARMA ISLAND：藥化科目
   這個檔案只在 medchem.html 載入，會把藥理的章節、單元、知識樹換成藥物化學的。
   格式和生藥頁一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）。
   章節照「藥物化學國考統整」的目錄：
     統整（一）中樞神經系統：壹～陸 → 第 1～6 章、柒～捌 → 第 7～8 章、玖～拾 → 第 9～10 章、拾壹～拾參 → 第 11～13 章、拾肆～拾伍 → 第 14～15 章（中樞神經島）
     統整（三）心臟血管系統：柒、捌、玖、壹拾壹 → 第 16～19 章（畫面上的章號用 no 重編成 1～4）（心血管島）
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

/* 第三層小標：講義黑底的大分類 > 灰底的子分類。子分類 → 上層分類。
   地圖上上層分類用土黃色框，裡面的子分類再用藍綠色框（js/map.js 的 topOf）。 */
PI.GROUP_PARENTS = {
  "抗癲癇巴比妥類用藥": "巴比妥類（Barbiturates）",
  "Class A（字尾-azepam）": "Benzodiazepine 類衍生物：藥理研究",
  "Class B（s-triazolo-benzodiazepine，含有 1,3,4-triazole ring）": "Benzodiazepine 類衍生物：藥理研究",
  "Class B（imidazo-benzodiazepine）": "Benzodiazepine 類衍生物：藥理研究",
  // 第 2 章
  "Hydantoin 類衍生物": "Ureides 相關結構藥物",
  "抗癲癇巴比妥類（Barbiturates）": "Ureides 相關結構藥物",
  "GABA 類衍生物": "Miscellaneous 雜類結構藥物",
  "含 amide group 之衍生物（字尾-amide）": "Miscellaneous 雜類結構藥物",
  "含 acetamide group 之衍生物（字尾-acetam）": "Miscellaneous 雜類結構藥物",
  "未分類結構": "Miscellaneous 雜類結構藥物",
  "Oxazolidinediones 類衍生物（字尾-dione）": "Ureide 衍生物",
  "Succinimides 類衍生物（字尾-suximide）": "Ureide 衍生物",
  // 第 3 章
  "Amitriptyline 及其衍生物（環外有雙鍵存在）": "含末端三級胺之三環抗憂鬱藥物（TCA-NSRIs）",
  "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）": "含末端三級胺之三環抗憂鬱藥物（TCA-NSRIs）",
  "Phenoxyphenylalkylamine 類衍生物": "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥",
  "Phenylalkylamine 類衍生物": "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥",
  "Miscellaneous 雜類藥物": "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥",
  "不可逆、無選擇性之 MAOI 藥物個論": "單胺氧化酶抑制劑（MAOI）",
  "可逆、具選擇性之 MAOI 藥物個論": "單胺氧化酶抑制劑（MAOI）",
  // 第 4 章
  "麥角生物鹼類": "活化 Dopamine 受體",
  "非麥角生物鹼類": "活化 Dopamine 受體",
  "阻斷中樞毒蕈鹼受體": "降低 ACh 活性",
  "第一代 H₁-blockers": "降低 ACh 活性",
  "Adenosine A₂A antagonist": "促進 Dopamine 釋放",
  // 第 5 章
  "Aliphatic 直鏈衍生物（字尾-promazine）": "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物",
  "Piperidine 衍生物（字尾-ridazine）": "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物",
  "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）": "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物",
  "末端環化成 pyrrolidine，字尾-piride": "第一代精神疾病藥物：Benzamide 類衍生物",
  "Benzisoxazole 類衍生物（-peridone）": "第二代精神疾病藥物：Benzisoxazole/Benzisothiazole 類衍生物",
  "Benzisothiazole 類衍生物（-rasidone）": "第二代精神疾病藥物：Benzisoxazole/Benzisothiazole 類衍生物",
  // 第 6 章
  "Glycerol Monoethers 類衍生物": "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）",
  "Substituted Alkanediols 類衍生物": "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）",
  "Benzoxazole 類衍生物": "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）",
  "Miscellaneous 雜類藥物（肌肉鬆弛劑）": "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）",
  "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  "去極化性阻斷劑（非競爭型）": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  // 第 7 章（局部麻醉劑）
  "Benzoic acid 苯甲酸衍生物": "酯類結構（Ester）",
  "para-amino benzoic acid（PABA）衍生物": "酯類結構（Ester）",
  // 第 8 章（全身麻醉劑）
  "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類": "吸入型全身麻醉劑：沒有特定的目標受器與之結合",
  "Phenol 類衍生物": "IV 注射型全身麻醉劑",
  "Phencyclidine（PCP）類衍生物": "IV 注射型全身麻醉劑",
  "Barbiturate 類衍生物：超短效型": "IV 注射型全身麻醉劑",
  "Carboxylated Imidazole 類衍生物": "IV 注射型全身麻醉劑",
  "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam": "IV 注射型全身麻醉劑",
  // 第 9、10 章
  "Opioid 受體拮抗劑（Pure antagonist）": "修飾 Nitrogen atom",
  "混合型致效劑：μ-antagonist & κ-agonist": "修飾 Nitrogen atom",
  "部分致效劑（Partial agonist）": "修飾 Nitrogen atom",
  // 第 11～13 章
  "Indomethacin 衍生物": "芳香基乙酸類（Arylacetic acid derivatives）",
  "非 Indomethacin 衍生物": "芳香基乙酸類（Arylacetic acid derivatives）",
  "抑制尿酸生成": "痛風藥物",
  "促進尿酸排除": "痛風藥物",
  "TNF-α Inhibitor": "用於類風濕性關節炎之生物製劑",
  "共刺激調節劑（Costimulate Modulator）": "用於類風濕性關節炎之生物製劑",
  "消耗 B cell（Deplete Peripheral B cell）": "用於類風濕性關節炎之生物製劑",
  "標靶合成型 DMARDs": "用於類風濕性關節炎之生物製劑",
  "IL-1 受體拮抗劑（Interleukin-1 Receptor Antagonist）": "用於類風濕性關節炎之生物製劑",
  "Calcineurin Inhibitor": "用於類風濕性關節炎之生物製劑",
  "mTOR Inhibitor": "用於類風濕性關節炎之生物製劑",
  // 第 14、15 章
  "乙二胺類（Ethylenediamine）": "第一代 H₁-blockers（抗組織胺藥物）",
  "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）": "第一代 H₁-blockers（抗組織胺藥物）",
  "丙胺類（Propylamines）": "第一代 H₁-blockers（抗組織胺藥物）",
  "Piperazine 類（字尾-zine）": "第一代 H₁-blockers（抗組織胺藥物）",
  "TCA 三環結構": "第一代 H₁-blockers（抗組織胺藥物）",
  "其他（第一代 H₁-blockers）": "第一代 H₁-blockers（抗組織胺藥物）"
};

/* 地圖名牌：和生藥頁一樣用短的英文（名牌字型只有英文字母，中文字寬、長的名牌會擠成一團）。
   group 本身仍是講義表格的完整標題，滑鼠提示、知識樹、題目都用完整名稱。 */
PI.GROUP_LABELS = {
  "巴比妥類（Barbiturates）": "Barbiturates",
  "抗癲癇巴比妥類用藥": "Antiepileptic",
  "Benzodiazepine 類衍生物：藥理研究": "BZD",
  "Class A（字尾-azepam）": "Class A",
  "Class B（s-triazolo-benzodiazepine，含有 1,3,4-triazole ring）": "Class B - Triazolo",
  "Class B（imidazo-benzodiazepine）": "Class B - Imidazo",
  "Nonbenzodiazepine GABA_A Agonists（Z-drugs）": "Z-drugs",
  "GABA 受體拮抗劑": "GABA Antagonists",
  "血清素受體活化劑（Serotonin Receptor Active Agents）": "5-HT Agonist",
  "選擇性血清素再回收抑制劑（SSRIs）": "SSRIs",
  "褪黑激素受體促效劑（Melatonin Receptor Agonists）": "Melatonin",
  "第一代 H₁ 受體拮抗劑（Histamine H₁ Receptor Antagonists）": "H1-blockers",
  "食慾素拮抗劑（Orexin Antagonist）": "Orexin",
  // 第 2 章
  "Ureides 相關結構藥物": "Ureides",
  "Hydantoin 類衍生物": "Hydantoin",
  "抗癲癇巴比妥類（Barbiturates）": "Barbiturates",
  "抗癲癇 Benzodiazepines 類": "BZD",
  "Iminostilbene 類衍生物": "Iminostilbene",
  "Biscarbamates 類衍生物": "Biscarbamates",
  "Miscellaneous 雜類結構藥物": "Miscellaneous",
  "GABA 類衍生物": "GABA",
  "含 amide group 之衍生物（字尾-amide）": "-amide",
  "含 acetamide group 之衍生物（字尾-acetam）": "-acetam",
  "未分類結構": "Unclassified",
  "Ureide 衍生物": "Ureide",
  "Oxazolidinediones 類衍生物（字尾-dione）": "Oxazolidinediones",
  "Succinimides 類衍生物（字尾-suximide）": "Succinimides",
  // 第 3 章
  "含末端三級胺之三環抗憂鬱藥物（TCA-NSRIs）": "TCA-NSRIs",
  "Amitriptyline 及其衍生物（環外有雙鍵存在）": "Amitriptyline",
  "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）": "Imipramine",
  "非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs）": "Non-TCA NSRIs",
  "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）": "TCA-SNRIs",
  "非三環結構之選擇性 NE 再回收抑制劑（Non-TCA SNRIs）": "Non-TCA SNRIs",
  "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥": "SSRIs",
  "Phenoxyphenylalkylamine 類衍生物": "Phenoxyphenyl",
  "Phenylalkylamine 類衍生物": "Phenylalkyl",
  "Miscellaneous 雜類藥物": "Miscellaneous",
  "多巴胺及正腎上腺素再回收抑制劑（DNRI）": "DNRI",
  "Arylpiperazine 類衍生物": "Arylpiperazine",
  "Indole 類衍生物": "Indole",
  "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）": "NaSSA",
  "單胺氧化酶抑制劑（MAOI）": "MAOI",
  "不可逆、無選擇性之 MAOI 藥物個論": "Irreversible",
  "可逆、具選擇性之 MAOI 藥物個論": "Reversible",
  "情緒穩定劑（Mood Stabilizers）": "Mood Stabilizer",
  // 第 4 章
  "增加 Dopamine 合成": "DA Synthesis",
  "抑制 Dopamine 代謝": "DA Metabolism",
  "活化 Dopamine 受體": "DA Agonists",
  "麥角生物鹼類": "Ergot",
  "非麥角生物鹼類": "Non-ergot",
  "降低 ACh 活性": "Anti-ACh",
  "阻斷中樞毒蕈鹼受體": "Antimuscarinic",
  "第一代 H₁-blockers": "H1-blockers",
  "促進 Dopamine 釋放": "DA Release",
  "Adenosine A₂A antagonist": "A2A Antagonist",
  "可逆型膽鹼酯酶抑制劑：皆有三級胺結構，可穿過 BBB 增加 ACh 濃度": "AChEI",
  "NMDA 受體拮抗劑（NMDA antagonist）": "NMDA Antagonist",
  "治療藥物：降低 Dopamine 的濃度": "Huntington",
  // 第 5 章
  "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物": "Phenothiazine",
  "Aliphatic 直鏈衍生物（字尾-promazine）": "Aliphatic",
  "Piperidine 衍生物（字尾-ridazine）": "Piperidine",
  "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）": "Piperazine",
  "第一代精神疾病藥物：Thioxanthene 類衍生物（名字中有-thix-）": "Thioxanthene",
  "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）": "Butyrophenone",
  "第一代精神疾病藥物：Diphenylbutyl piperidine 類衍生物": "Diphenylbutyl",
  "第一代精神疾病藥物：Benzamide 類衍生物": "Benzamide",
  "末端環化成 pyrrolidine，字尾-piride": "Pyrrolidine",
  "第二代精神疾病藥物：Miscellaneous 雜類藥物": "Miscellaneous",
  "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）": "Benzazepine",
  "第二代精神疾病藥物：Benzisoxazole/Benzisothiazole 類衍生物": "Benzisoxazole/thiazole",
  "Benzisoxazole 類衍生物（-peridone）": "Benzisoxazole",
  "Benzisothiazole 類衍生物（-rasidone）": "Benzisothiazole",
  // 第 6 章
  "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）": "Muscle Relaxants",
  "Glycerol Monoethers 類衍生物": "Glycerol Monoethers",
  "Substituted Alkanediols 類衍生物": "Alkanediols",
  "Benzoxazole 類衍生物": "Benzoxazole",
  "Miscellaneous 雜類藥物（肌肉鬆弛劑）": "Miscellaneous",
  "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）": "Nm Blockers",
  "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）": "Non-depolarizing",
  "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）": "Steroidal",
  "去極化性阻斷劑（非競爭型）": "Depolarizing",
  "抗痙攣劑": "Antispasmodics",
  // 第 7 章（局部麻醉劑）
  "酯類結構（Ester）": "Ester",
  "Benzoic acid 苯甲酸衍生物": "Benzoic acid",
  "para-amino benzoic acid（PABA）衍生物": "PABA",
  "醯胺類結構（Amide）": "Amide",
  // 第 8 章（全身麻醉劑）
  "吸入型全身麻醉劑：沒有特定的目標受器與之結合": "Inhaled",
  "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類": "Halogenated",
  "IV 注射型全身麻醉劑": "IV Agents",
  "Phenol 類衍生物": "Phenol",
  "Phencyclidine（PCP）類衍生物": "PCP",
  "Barbiturate 類衍生物：超短效型": "Barbiturates",
  "Carboxylated Imidazole 類衍生物": "Imidazole",
  "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam": "BZD",
  // 第 9、10 章
  "修飾 Nitrogen atom": "Modify N",
  "Opioid 受體拮抗劑（Pure antagonist）": "Antagonist",
  "混合型致效劑：μ-antagonist & κ-agonist": "Mixed",
  "部分致效劑（Partial agonist）": "Partial",
  "修飾 3-Hydroxyl group": "3-OH",
  "修飾 6α-Hydroxyl group": "6α-OH",
  "6-keto-14β-Hydroxyl 衍生物": "14β-OH",
  "保留 ABCN 環結構：Morphinan 衍生物（移除 4,5-epoxide bridge）": "Morphinan",
  "保留 ABN 環結構：6,7-Benzomorphan 衍生物": "Benzomorphan",
  "保留 AN 環結構：4-Phenylpiperidines 衍生物": "Phenylpiperidine",
  "保留 AN 環結構，但之間以 N 相接：4-Anilidopiperidine 衍生物": "Anilidopiperidine",
  "保留 AB 環結構：Aminotetralin 類": "Aminotetralin",
  "保留 AC 環結構（不含 N 環=不含 piperidine）：4-Phenylcyclohexane 類": "Phenylcyclohexane",
  "僅保留 A 環結構，但與 N 仍間隔 3 個 C：Phenylpropylamine 類": "Phenylpropylamine",
  "東罌粟鹼（Oripavines）及其衍生物": "Oripavine",
  "阿片結構衍生之鎮咳藥物": "Antitussive",
  "阿片結構衍生之止瀉藥物": "Antidiarrheal",
  "中樞神經興奮劑": "Stimulants",
  "Methylxanthine 類": "Methylxanthine",
  "迷幻劑（Hallucinogen）": "Hallucinogen",
  // 第 11～13 章
  "Prostaglandin 衍生物": "Prostaglandins",
  "5-lipoxygenase inhibitor": "5-LO Inhibitor",
  "Leukotriene receptor antagonist": "LT Antagonist",
  "水楊酸衍生物（Salicylic acid derivatives）": "Salicylates",
  "芳香基乙酸類（Arylacetic acid derivatives）": "Arylacetic",
  "Indomethacin 衍生物": "Indomethacin",
  "非 Indomethacin 衍生物": "Non-Indomethacin",
  "鄰胺基苯甲酸類（N-arylanthranilic acid）：屬於 Fenamates 類": "Fenamates",
  "芳香基丙酸類（Arylpropionic acid derivatives）": "Arylpropionic",
  "Oxicams 類": "Oxicams",
  "解熱鎮痛藥": "Antipyretic",
  "選擇性 COX-2 抑制劑（字尾-coxib）": "COX-2 Inhibitors",
  "痛風藥物": "Gout",
  "抑制尿酸生成": "Reduce Uric Acid",
  "促進尿酸排除": "Excrete Uric Acid",
  "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）": "DMARDs",
  "用於類風濕性關節炎之生物製劑": "Biologics",
  "TNF-α Inhibitor": "TNF-α",
  "共刺激調節劑（Costimulate Modulator）": "Costimulation",
  "消耗 B cell（Deplete Peripheral B cell）": "Anti-B cell",
  "標靶合成型 DMARDs": "Targeted",
  "IL-1 受體拮抗劑（Interleukin-1 Receptor Antagonist）": "IL-1 RA",
  "Calcineurin Inhibitor": "Calcineurin",
  "mTOR Inhibitor": "mTOR",
  // 第 14、15 章
  "第一代 H₁-blockers（抗組織胺藥物）": "1st-gen H1",
  "乙二胺類（Ethylenediamine）": "Ethylenediamine",
  "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）": "Ethanolamine",
  "丙胺類（Propylamines）": "Propylamines",
  "Piperazine 類（字尾-zine）": "Piperazine",
  "TCA 三環結構": "TCA",
  "其他（第一代 H₁-blockers）": "Others",
  "第二代 H₁-blockers": "2nd-gen H1",
  "肥大細胞脫粒抑制劑（Mast cell degranulation inhibitors）：抑制組織胺釋放": "Mast Cell",
  "H₂-blockers": "H2-blockers",
  "5-HT₁ agonist": "5-HT1 Agonist",
  "5-HT₂ antagonist": "5-HT2 Antagonist",
  "5-HT₃ antagonist": "5-HT3 Antagonist",
  "5-HT₄ agonist": "5-HT4 Agonist",
  "Selective Serotonin Reuptake Inhibitors（SSRIs）": "SSRIs"
};

/* 藥化的欄位：照講義表格的欄位（藥物｜結構｜特性｜藥理及臨床應用） */
PI.UNIT_FIELDS = [["use", "分類／用途"], ["desc", "說明"], ["feat", "特性"], ["pharm", "藥理及臨床應用"], ["metab", "藥物代謝"], ["clin", "藥理及臨床用途"], ["bold", "粗體重點"], ["act", "作用"], ["ind", "適應症"], ["rmk", "備註"]];   // 第 1、2 章照講義欄位（說明／特性／藥理及臨床應用），第 3 章是特性／藥物代謝，第 4 章是特性／藥理及臨床用途，第 5、6 章是特性／藥理及臨床應用，其他章還是粗體重點
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
  { id: 7, name: "局部麻醉劑", cat: "cns", estimate: 17, unitType: "drug", note: "統整（一）柒，p.68–70。" },
  { id: 8, name: "全身麻醉劑", cat: "cns", estimate: 17, unitType: "drug", note: "統整（一）捌，p.71–76。" },
  { id: 9, name: "阿片類止痛劑", cat: "cns", estimate: 45, unitType: "drug", note: "統整（一）玖，p.77–90。" },
  { id: 10, name: "中樞神經興奮劑、迷幻劑與濫用藥物", short: "興奮劑與迷幻劑", cat: "cns", estimate: 13, unitType: "drug", note: "統整（一）拾，p.91–93。" },
  { id: 11, name: "前列腺及 Leukotriene 相關藥物", short: "前列腺與 Leukotriene", cat: "cns", estimate: 8, unitType: "drug", note: "統整（一）拾壹，p.94–97。" },
  { id: 12, name: "非類固醇消炎止痛藥（NSAIDs）", short: "NSAIDs", cat: "cns", estimate: 25, unitType: "drug", note: "統整（一）拾貳，p.98–103。" },
  { id: 13, name: "痛風藥物與疾病修飾抗風濕藥物", cat: "cns", estimate: 25, unitType: "drug", note: "統整（一）拾參，p.104–106。" },
  { id: 14, name: "抗組織胺藥物", cat: "cns", estimate: 41, unitType: "drug", note: "統整（一）拾肆，p.107–113。" },
  { id: 15, name: "血清素及相關藥物", cat: "cns", estimate: 17, unitType: "drug", note: "統整（一）拾伍，p.114–116。" },
  { id: 16, name: "利尿劑", no: 1, cat: "cv", estimate: 20, unitType: "drug", note: "統整（三）柒，p.39–46。" },
  { id: 17, name: "心絞痛藥物", no: 2, cat: "cv", estimate: 8, unitType: "drug", note: "統整（三）捌，p.47–48。" },
  { id: 18, name: "心衰竭藥物", no: 3, cat: "cv", estimate: 10, unitType: "drug", note: "統整（三）玖，p.49–53。" },
  { id: 19, name: "抗凝血與血液相關藥物", no: 4, cat: "cv", estimate: 25, unitType: "drug", note: "統整（三）壹拾壹，p.58–69。" }
];

/* 章節的 id 全部不重複（資料用），但統整（一）和統整（三）是兩本，顯示的章號用 no 另外從 1 重新編（沒有 no 的章節就用 id） */
/* 兩座島：統整（一）的六章拼成一座、統整（三）的四章拼成一座 */
/* 小白標先修：同一類的格子要先答完小白標（地圖上的小分類名牌）的題目才能挑戰（js/app.js 的 groupGate） */
PI.GROUP_GATE = true;

/* 群島的總名稱（地圖上黑色大字，標在每片群島上方）：key 對應 LANDMASSES 的 cluster */
PI.CLUSTERS = { cns: "中樞神經群島", cv: "心血管群島" };

PI.LANDMASSES = [
  // 一章一座小島，排成兩片群島（cluster）：中樞神經群島（紫色系，第 1 章在中間、2～6 章順時針圍一圈）、心血管群島（粉紅色系，在右邊）
  { id: "cns1", name: "安眠島",     chapters: [1], cluster: "cns",
    palette: { ground: "#C3B5DE", light: "#D5CBE8", cliff: "#9C8CBF" } },
  { id: "cns2", name: "抗癲癇島",   chapters: [2], cluster: "cns", angle: 210,
    palette: { ground: "#B9B8E0", light: "#CFCEEB", cliff: "#8F8EC0" } },
  { id: "cns3", name: "抗憂鬱島",   chapters: [3], cluster: "cns", angle: 270,
    palette: { ground: "#CDB3DA", light: "#DDCAE6", cliff: "#A58AB6" } },
  { id: "cns4", name: "神經疾病島", chapters: [4], cluster: "cns", angle: 0,
    palette: { ground: "#B3C0E0", light: "#CBD4EB", cliff: "#8A98C0" } },
  { id: "cns5", name: "抗精神病島", chapters: [5], cluster: "cns", angle: 60,
    palette: { ground: "#D3B8E0", light: "#E1CDEA", cliff: "#AA8EBD" } },
  { id: "cns6", name: "肌鬆島",     chapters: [6], cluster: "cns", angle: 120,
    palette: { ground: "#BFB0D8", light: "#D2C7E4", cliff: "#9686B5" } },
  { id: "cns7", name: "局麻島",     chapters: [7], cluster: "cns", angle: 165,
    palette: { ground: "#C8AFDC", light: "#DACAE8", cliff: "#A087BB" } },
  { id: "cns8", name: "全麻島",     chapters: [8], cluster: "cns", angle: 315,
    palette: { ground: "#B6AEDD", light: "#CBC6EA", cliff: "#8E87BC" } },
  { id: "cns9", name: "阿片島",     chapters: [9], cluster: "cns", angle: 90,
    palette: { ground: "#C4A9D8", light: "#D7C4E6", cliff: "#9C80B4" } },
  { id: "cns10", name: "興奮劑島",  chapters: [10], cluster: "cns", angle: 345,
    palette: { ground: "#B0B6DE", light: "#C8CCEA", cliff: "#8890BC" } },
  { id: "cns11", name: "前列腺素島", chapters: [11], cluster: "cns", angle: 30,
    palette: { ground: "#CBB0DA", light: "#DCC9E7", cliff: "#A388B6" } },
  { id: "cns12", name: "消炎止痛島", chapters: [12], cluster: "cns", angle: 240,
    palette: { ground: "#B8B2DE", light: "#CDC8EB", cliff: "#9088BE" } },
  { id: "cns13", name: "痛風島",     chapters: [13], cluster: "cns", angle: 140,
    palette: { ground: "#C1AADB", light: "#D4C3E8", cliff: "#997FB7" } },
  { id: "cns14", name: "抗組織胺島", chapters: [14], cluster: "cns", angle: 300,
    palette: { ground: "#BDB0DC", light: "#D0C6EA", cliff: "#9588BC" } },
  { id: "cns15", name: "血清素島",   chapters: [15], cluster: "cns", angle: 190,
    palette: { ground: "#C6ADDA", light: "#D8C6E7", cliff: "#9F85B8" } },
  { id: "cv16",  name: "利尿島",     chapters: [16], cluster: "cv", angle: 0,
    palette: { ground: "#E8B4B0", light: "#F0C9C6", cliff: "#C48A86" } },
  { id: "cv17",  name: "心絞痛島",   chapters: [17], cluster: "cv", angle: 270,
    palette: { ground: "#EBBFA9", light: "#F2D1C1", cliff: "#C79580" } },
  { id: "cv18",  name: "心衰竭島",   chapters: [18], cluster: "cv", angle: 0,
    palette: { ground: "#E6AFBE", light: "#EFC6D1", cliff: "#C28697" } },
  { id: "cv19", name: "抗凝血島",   chapters: [19], cluster: "cv", angle: 45,
    palette: { ground: "#E4B7A6", light: "#EDCBBE", cliff: "#C08D7B" } }
];

PI.UNITS = [
/* ===== 第 1 章 鎮靜安眠與抗焦慮藥物（統整（一）壹，p.3–18）===== */
{ id: "sh-barb-general", chapter: 1, name: "巴比妥類（Barbiturates）", short: "Barb 通論", type: "topic", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4", img: "assets/medchem/sh-barb-general.png", imgMore: ["assets/medchem/sh-barb-urea-malonic.png"],
  bold: [
    "基本結構為 {{5,5-disubstituted barbituric acid|結構}}\n（由尿素 urea 與丙二酸 malonic acid 構成，[u]5 號位[/u]需有{{取代基|結構}}才有活性）",
    "{{高脂溶性|性質}}，為{{弱酸性|性質}}，與 NaOH 反應可製成鈉鹽，增加水溶性",
    "延長 Cl⁻ 通道的開啟[u]{{時間|機轉|頻率/數目/速度}}[/u]，因{{不需要|性質|需要}}經過異位調控，副作用較大",
    "為 CYP450 之強效{{誘導劑|性質|抑制劑/受質/活化劑}}★"
  ] },
{ id: "amobarbital", chapter: 1, name: "Amobarbital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4–5", img: "assets/medchem/amobarbital.png",
  use: ["{{鎮靜安眠|用途}}（青發）"],
  desc: ["R₁ 為 Ethyl group",
    "R₂ 為 {{Isoamyl|取代基}}（[u]5C[/u]）",
    "與 Pentobarbital 互為{{結構異構物|名詞}}",
    "第三級毒品"] },
{ id: "pentobarbital", chapter: 1, name: "Pentobarbital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4–5", img: "assets/medchem/pentobarbital.png",
  use: ["{{鎮靜安眠|用途}}"],
  desc: ["R₁ 為 Ethyl group",
    "R₂ 共有 {{5C|數值|4C/6C/3C}} 結構",
    "與 Amobarbital 互為結構異構物",
    "{{短效藥|作用時間}}"] },
{ id: "butabarbital", chapter: 1, name: "Butabarbital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4–5", img: "assets/medchem/butabarbital.png",
  use: ["{{鎮靜安眠|用途}}"],
  desc: ["R₁ 為 Ethyl group",
    "R₂ 為 {{4C|數值}} 結構"] },
{ id: "methohexital", chapter: 1, name: "Methohexital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.5", img: "assets/medchem/methohexital.png",
  use: ["{{麻醉劑|用途}}"],
  desc: ["IV 型全身麻醉劑"] },
{ id: "phenobarbital", chapter: 1, name: "Phenobarbital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4–5", img: "assets/medchem/phenobarbital.png",
  use: ["{{鎮靜安眠|用途}}、{{抗癲癇|用途}}"],
  desc: ["R₁ 為 Ethyl group",
    "R₂ 為 {{Benzene|取代基}}",
    "{{長效藥|作用時間}}"] },
{ id: "thiopental", chapter: 1, name: "Thiopental", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.5", img: "assets/medchem/thiopental.png",
  use: ["{{麻醉劑|用途}}",
    "又稱 Thiopentobarbital"],
  desc: ["將 [u]Phenobarbital[/u] 第二位的 O 改成 {{S|取代基}}",
    "IV 型全身麻醉劑",
    "{{麻醉誘導|用途}}★"] },
{ id: "secobarbital", chapter: 1, name: "Secobarbital", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.4–5", img: "assets/medchem/secobarbital.png",
  use: ["{{鎮靜安眠|用途}}（紅中）"],
  desc: ["R₁ 為 {{allyl group|取代基}}",
    "與 [u]Pentobarbital[/u] 只差在{{丙烯基|取代基}}",
    "{{短效藥|作用時間}}",
    "第三級毒品"] },
{ id: "thiamylal", chapter: 1, name: "Thiamylal", type: "drug", group: "巴比妥類（Barbiturates）", source: "統整（一）p.5", img: "assets/medchem/thiamylal.png",
  use: ["{{麻醉劑|用途}}"],
  desc: ["{{非 barbital 結尾|名詞}}",
    "將 [u]Secobarbital[/u] 第二位的 O 改成 S",
    "IV 型全身麻醉劑"] },
/* 講義 p.6 的 Phenobarbital（「本藥與上頁重複」）：抗癲癇巴比妥類用藥裡再放一格 */
{ id: "phenobarbital-ae", chapter: 1, name: "Phenobarbital", type: "drug", group: "抗癲癇巴比妥類用藥", source: "統整（一）p.6", img: "assets/medchem/phenobarbital.png",
  use: ["{{鎮靜安眠|用途}}、{{抗癲癇|用途}}", "（本藥與上頁重複）"],
  feat: ["5 號位取代基：苯環、乙基",
    "pKa=7.4 為{{弱酸性|性質}}的藥物，正常生理環境下有 {{50%|數值}} 會解離，且可分布到 CNS 中"],
  pharm: ["阻斷 {{Na⁺|離子}}通道、正向異位調節 GABA_A 受體",
    "{{兒童性熱痙攣|疾病}}之首選藥物",
    "代謝：尿液中約 {{25-50%|數值}}以原型藥排出，剩下的會在苯環 {{para 位接上 OH|代謝}}，再經共軛反應排出"] },
{ id: "mephobarbital", chapter: 1, name: "Mephobarbital", type: "drug", group: "抗癲癇巴比妥類用藥", source: "統整（一）p.6", img: "assets/medchem/mephobarbital.png",
  use: ["{{抗癲癇|用途}}"],
  feat: ["與 Phenobarbital 只相差一個{{甲基|取代基}}",
    "→ 3 號 N 上接 CH₃"],
  pharm: ["代謝：主要在肝臟進行 {{N-去甲基化|代謝}}形成 phenobarbital，後續代謝就與之相同",
    "經 {{CYP2C19|酵素}}（R form）、{{CYP2B6|酵素}}（S form）代謝之 4-hydroxy★代謝物具有立體選擇性",
    "→ CYP2C19 [u]缺陷[/u]之患者藥物{{清除率會降低|性質}}"] },
{ id: "primidone", chapter: 1, name: "Primidone", type: "drug", group: "抗癲癇巴比妥類用藥", source: "統整（一）p.6", img: "assets/medchem/primidone.png",
  use: ["{{抗癲癇|用途}}"],
  feat: ["非 barbital 結尾",
    "為 phenobarbital {{2 號位去氧|結構}}之產物",
    "2 號位{{沒有 C=O|結構}}（carbonyl）",
    "5 號位取代基：苯環、乙基"],
  pharm: ["阻斷 Na⁺通道、正向異位調節 GABA_A 受體",
    "FDA 核准治療局部簡單性癲癇、局部複雜性癲癇、{{強直-陣攣性|疾病}}發作癲癇",
    "約 {{60-80%|數值}}藥物經口服吸收，緩慢的被肝代謝",
    "代謝：由 {{CYP2C9|酵素}}、CYP2C19 負責"] },

{ id: "sh-bzd-general", chapter: 1, name: "Benzodiazepine 類衍生物：藥理研究", short: "BZD 通論", type: "topic", group: "Benzodiazepine 類衍生物：藥理研究", source: "統整（一）p.7", img: "assets/medchem/sh-bzd-general.png",
  bold: [
    "Benzodiazepines 會和 GABA_A 受體的 BZD 位結合，增加 Cl⁻ 通道開啟的[u]{{頻率|機轉|時間/數目/速度}}[/u]",
    "依照吸收速度、脂溶性、代謝物活性不同有不同的用途"
  ] },
{ id: "clorazepate", chapter: 1, name: "Clorazepate", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.8", img: "assets/medchem/clorazepate.png",
  use: ["{{抗焦慮|用途}}、{{抗癲癇|用途}}"],
  feat: ["{{3 號位接 carboxyl group|結構}}★（Clorazep[u]ate[/u]）"],
  pharm: ["屬於 {{Prodrug|性質}}，在胃中會{{脫羧|代謝}}★形成有活性的 Desmethyldiazepam（{{Nordiazepam|代謝物}}）",
    "> ※ 代謝性質與 {{Diazepam|藥名}} 相似★",
    "代謝：先進行 {{decarboxylation|代謝}}，再進行 3-hydroxylation",
    "與[u]制酸劑[/u]併服會{{降低|性質}}吸收"] },
{ id: "diazepam", chapter: 1, name: "Diazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.8", img: "assets/medchem/diazepam.png",
  use: ["{{抗焦慮|用途}}、抗癲癇、麻醉劑、抗痙攣"],
  feat: ["1 號 N 上接{{甲基|取代基}}"],
  pharm: ["IV 可快速控制癲癇重積症 {{status epilepticus|疾病}}",
    "代謝：CYP2C19、CYP3A4 進行 {{N-去甲基化|代謝}}",
    "→ 形成[u]活性[/u]代謝物 {{Nordiazepam|代謝物}}",
    "→ 半衰期由 46 增為 71 小時，{{長效型|作用時間}}藥物",
    "→ Nordiazepam 可再行 {{3-hydroxylation|代謝}} 形成 {{Oxazepam|代謝物}}"] },
{ id: "flurazepam", chapter: 1, name: "Flurazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.8", img: "assets/medchem/flurazepam.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  feat: ["1 號 N 有 {{2-(diethylamino)ethyl|取代基}} 結構（三級胺）",
    "C 環上有 {{2'-F|取代基}} 取代基",
    "口服製劑會做成 {{dihydrochloride salt|性質}}"],
  pharm: ["Onset {{最快|性質}}，{{長效型|作用時間}}",
    "與 Chlodiazepoxide、Diazepam 有相似藥效",
    "副作用：{{過度鎮靜|副作用}}",
    "代謝：主要由 {{N-dealkylation|代謝}}★代謝，而後進行 hydroxylation 形成 N-hydroxy 或 3-hydroxy 產物"] },
{ id: "chlordiazepoxide", chapter: 1, name: "Chlordiazepoxide", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.9", img: "assets/medchem/chlordiazepoxide.png",
  use: ["{{抗焦慮|用途}}"],
  feat: ["2 號位上並非 C=O，而是 {{-NHCH₃|取代基}}"],
  pharm: ["口服吸收佳，若用 {{IM|給藥途徑}} 效果較差也較慢",
    "{{長效型|作用時間}}：因為有{{活性代謝物|性質}}",
    "代謝：主要由 {{CYP3A4|酵素}} 負責",
    "→ 產生[u]活性[/u]代謝物 {{Nordiazepam|代謝物}}"] },
{ id: "quazepam", chapter: 1, name: "Quazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.9", img: "assets/medchem/quazepam.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["唯一 2 號位上的 C=O 改為 {{C=S|結構}}",
    "C 環上有 {{2'-F|取代基}} 取代基",
    "結構中共有 {{4 個|數值}} F 原子（[u]Qua[/u]zepam）"],
  pharm: ["有兩條代謝路徑",
    "> 主要路徑會{{保留|性質|脫去}} CF₃ 基團，而次要路徑則會脫去 CF₃ 基團"] },
{ id: "clonazepam", chapter: 1, name: "Clonazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.9", img: "assets/medchem/clonazepam.png",
  use: ["{{抗癲癇|用途}}"],
  feat: ["[u]7[/u] 號位有 {{NO₂|取代基}} 取代基（Cl[u]on[/u]azepam）",
    "→ Class A 中唯一 R₇ 不接 Cl 者",
    "C 環上有 {{2'-Cl|取代基}} 取代基"],
  pharm: ["被核准治療{{失張性|疾病}} akinetic、{{肌攣性|疾病}} myclonic 發作",
    "只有再 {{Succinimides|藥物類別}} 類藥物無效時才會用來治療失神性發作",
    "代謝：可進行 {{7-reduction|代謝}}★將 NO₂→NH₂"] },
{ id: "sh-bzd-3oh", chapter: 1, name: "含 3-OH 之 BZD（不經肝臟代謝）", short: "3-OH BZD", type: "topic", group: "Class A（字尾-azepam）", source: "統整（一）p.10",
  bold: ["Class A（字尾-{{azepam|結構}}）：以下三者（Temazepam、Lorazepam、Oxazepam）含 {{3-OH|取代基}} 取代基，不經肝臟代謝★，為短效型藥物",
    "※不經肝臟代謝，較適合肝功能不佳者使用的 BZDs：{{Oxazepam|藥名}}★、Lorazepam、Temazepam →皆經由 Glucuronide {{conjugation|代謝}} 代謝★"] },
{ id: "temazepam", chapter: 1, name: "Temazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.10", img: "assets/medchem/temazepam.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["3 號位接 OH",
    "1 號 N 上接{{甲基|取代基}}"],
  pharm: ["[u]{{短效型|作用時間}}[/u]，半衰期短",
    "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation",
    "→ 適合{{肝功能不佳|疾病}}的患者"] },
{ id: "lorazepam", chapter: 1, name: "Lorazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.10", img: "assets/medchem/lorazepam.png",
  use: ["{{抗焦慮|用途}}、抗癲癇、麻醉劑"],
  feat: ["3 號位接 OH",
    "C 環上有 2'-Cl 取代基",
    "為 [u]Oxazepam[/u] 的 {{2'-Cl|取代基}} 衍生物，有相似的半衰期及藥理活性"],
  pharm: ["[u]{{短效型|作用時間}}[/u]，半衰期短",
    "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation",
    "→ 適合{{肝功能不佳|疾病}}的患者",
    "因不經肝臟 CYP 酵素代謝，{{交互作用|名詞}}較少"] },
{ id: "oxazepam", chapter: 1, name: "Oxazepam", type: "drug", group: "Class A（字尾-azepam）", source: "統整（一）p.10", img: "assets/medchem/oxazepam.png",
  use: ["{{抗焦慮|用途}}"],
  feat: ["3 號位接 OH",
    "與 {{Temazepam|藥名}} 只相差一個 CH₃"],
  pharm: ["[u]{{短效型|作用時間}}[/u]，半衰期短",
    "為 {{Chlordiazepoxide|藥名}} 與 Diazepam 的[u]活性[/u]代謝物",
    "代謝：{{不經過肝臟代謝|代謝}}，進行 glucuronide conjugation",
    "→ 適合{{肝功能不佳|疾病}}的患者"] },
{ id: "estazolam", chapter: 1, name: "Estazolam", type: "drug", group: "Class B（s-triazolo-benzodiazepine，含有 1,3,4-triazole ring）", source: "統整（一）p.11", img: "assets/medchem/estazolam.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["[u]{{1 個|數值}}[/u]取代基",
    "- Ring A：7-Cl 取代基"],
  pharm: ["{{中效型|作用時間}}，半衰期較長",
    "結構中[u]沒有甲基[/u]，{{不經 CYP3A4 代謝|代謝}}",
    "代謝物 {{4'-hydroxyestazolam|代謝物}} 脂溶性低，且因[u]立體構型障礙[/u]使其與 GABA_A {{結合力下降|性質}}"] },
{ id: "alprazolam", chapter: 1, name: "Alprazolam", type: "drug", group: "Class B（s-triazolo-benzodiazepine，含有 1,3,4-triazole ring）", source: "統整（一）p.11", img: "assets/medchem/alprazolam.png",
  use: ["{{抗焦慮|用途}}"],
  feat: ["[u]{{2 個|數值}}[/u]取代基",
    "- Ring A：7-Cl 取代基",
    "- Triazole ring：有甲基取代"],
  pharm: ["{{中效型|作用時間}}抗焦慮用藥",
    "可以治療{{恐慌症|疾病}}"] },
{ id: "triazolam", chapter: 1, name: "Triazolam", type: "drug", group: "Class B（s-triazolo-benzodiazepine，含有 1,3,4-triazole ring）", source: "統整（一）p.11", img: "assets/medchem/triazolam.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["[u]{{3 個|數值}}[/u]取代基",
    "- Ring A：7-Cl 取代基",
    "- Ring C：2'-Cl 取代基",
    "- Triazole ring：有甲基取代"],
  pharm: ["{{短效型|作用時間}}：Onset 最快、Duration 短",
    "副作用：{{反彈性失眠|副作用}}★ → 容易有戒斷症狀",
    "代謝：經 CYP3A4 在[u]甲基[/u]氧化代謝後形成活性代謝物 {{α-hydroxytriazolam|代謝物}}"] },
{ id: "midazolam", chapter: 1, name: "Midazolam", type: "drug", group: "Class B（imidazo-benzodiazepine）", source: "統整（一）p.11", img: "assets/medchem/midazolam.png",
  use: ["{{麻醉劑|用途}}、抗焦慮、癲癇"],
  feat: ["[u]{{3 個|數值}}[/u]取代基",
    "- Ring A：7-Cl 取代基",
    "- Ring C：2'-F 取代基",
    "- Imidazole ring：有甲基取代"],
  pharm: ["可治療{{持續性癲癇|疾病}}",
    "IV 注射：{{誘導麻醉|用途}} → Onset 快、恢復快",
    "Dihydrochloride 鹽類體外多為{{開環|結構|閉環}}結構，進入生理環境後會重新閉環（活性結構）"] },
{ id: "eszopiclone", chapter: 1, name: "Eszopiclone", type: "drug", group: "Nonbenzodiazepine GABA_A Agonists（Z-drugs）", source: "統整（一）p.12", img: "assets/medchem/eszopiclone.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  feat: ["屬於 [u]{{Cyclopyrrolone|結構}}[/u] 類",
    "三者中{{唯一有 chiral center|結構}}",
    "{{S-enantiomer|結構}} 活性及親和性較高（Es）",
    "含 pyrazine、pyrrolone、pyridine、piperazine"],
  pharm: ["作用於 BZR 上，增加 Cl⁻ 通道打開的{{頻率|機轉|時間/數目/速度}}",
    "專一性較佳，所以效果比 BZDs 好",
    "作用時間為三者中{{最長|性質}}",
    "主要由 CYP3A4 進行 {{N-去甲基化|代謝}}，代謝產物仍有活性；但若進行 {{N-oxide|代謝}} 代謝，則會失去活性★"] },
{ id: "zaleplon", chapter: 1, name: "Zaleplon", type: "drug", group: "Nonbenzodiazepine GABA_A Agonists（Z-drugs）", source: "統整（一）p.12", img: "assets/medchem/zaleplon.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  feat: ["屬於 [u]{{Pyrazolopyrimidine|結構}}[/u] 類",
    "Pyrazole 環上接 C≡N",
    "N 上接 Acetyl 和 Ethyl group"],
  pharm: ["吸收快速、半衰期短 → {{超短效型|作用時間}}",
    "代謝皆產生{{無活性|性質|有活性}}代謝物",
    "主要經 {{Aldehyde Oxidase|酵素}}★生成 {{5-oxozaleplon|代謝物}}"] },
{ id: "zolpidem", chapter: 1, name: "Zolpidem", type: "drug", group: "Nonbenzodiazepine GABA_A Agonists（Z-drugs）", source: "統整（一）p.12", img: "assets/medchem/zolpidem.png",
  use: ["{{抗焦慮|用途}}、鎮靜安眠"],
  feat: ["屬於 [u]{{Imidazopyridine|結構}}[/u]★類",
    "有{{四個|數值}}甲基（與代謝位置有關）"],
  pharm: ["FDA 已核准口服噴霧劑型 {{Oral spray|劑型}}",
    "主要由 CYP3A4 進行代謝",
    "→ 主要是{{苯環上的甲基|位置}}被氧化接上 OH"] },
{ id: "flumazenil", chapter: 1, name: "Flumazenil", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/flumazenil.png",
  use: ["{{BZD 與 Z-drug 過量之解毒劑|用途}}"],
  desc: ["GABA 負向異位調節劑，不興奮也不抑制，僅擋住受體阻斷藥物作用",
    "僅能 {{IV|給藥途徑}} 給予",
    "可用於 BZD 與 Z-drug 過量之解毒劑"] },
{ id: "beta-carbolines", chapter: 1, name: "β-Carbolines", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/beta-carbolines.png",
  desc: ["選擇性拮抗中樞 GABA_A 受體 {{Inverse agonist|機轉}}，可降低 BZD 之抑制作用"] },
{ id: "bicuculline", chapter: 1, name: "Bicuculline", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/bicuculline.png",
  desc: ["選擇性拮抗中樞 GABA_A 受體 {{Inverse agonist|機轉}}，可降低 BZD 之抑制作用"] },
{ id: "picrotoxin", chapter: 1, name: "Picrotoxin", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/picrotoxin.png",
  desc: ["負向異位作用於 GABA_A 受體 GABA_A antagonist",
    "可用於 {{Barbiturates 過量之解毒劑|用途}}"] },
{ id: "bemegride", chapter: 1, name: "Bemegride", type: "drug", group: "GABA 受體拮抗劑", source: "統整（一）p.13", img: "assets/medchem/bemegride.png",
  desc: ["負向異位作用於 GABA_A 受體 GABA_A antagonist",
    "可用於 {{Barbiturates 過量之解毒劑|用途}}"] },
{ id: "sh-serotonin", chapter: 1, name: "※ 血清素（Serotonin）簡介", short: "血清素簡介", type: "topic", group: "血清素受體活化劑（Serotonin Receptor Active Agents）", source: "統整（一）p.14", img: "assets/medchem/sh-serotonin.png",
  bold: [
    "為{{抑制型|性質|興奮型}}的神經遞質，結構為 {{5-hydroxytryptamine|結構}}（5-HT），主要由 [u]{{L-tryptophan|物質}}[/u]★生合成；代謝主要由 MAO 進行 {{Oxidative deamination|代謝}}★",
    "5-HT {{無法|性質|可以}}通過血腦障壁，必須靠腦中神經細胞自己合成",
    "目前已知的血清素受體有{{七大類|數值}}，其中 {{5-HT1A|受體}} 和調節焦慮有關",
    "血清素被釋放後，會結合並活化突觸後受體，{{抑制|性質|興奮}}神經元的活性",
    "血清素也可作用在神經末梢的{{自體受器|名詞}}（Autoreceptor），可負回饋抑制血清素的神經傳遞"
  ] },
{ id: "buspirone", chapter: 1, name: "Buspirone", type: "drug", group: "血清素受體活化劑（Serotonin Receptor Active Agents）", source: "統整（一）p.14", img: "assets/medchem/buspirone.png",
  use: ["{{抗焦慮|用途}}"],
  feat: ["屬於 {{Azaspirodecanedione|結構}}★類藥物",
    "> （[u]pyrimidinyl[/u]butyl[u]piperazine[/u]）",
    "R group 為 azaspiro[4.5]decane-7,9-dione",
    "> ※ [4.5]：表示碳數，但不包括螺環",
    "含有{{螺環|結構}}結構（Bu[u]spiro[/u]ne）"],
  pharm: ["{{5-HT1A|受體}} 受體{{部分致效劑|機轉}}★（Partial agonist）",
    "Onset {{慢|性質|快}}，約 1~2 週",
    "{{沒有安眠|性質}}、抗痙攣及肌肉鬆弛作用",
    "用於治療{{廣泛性焦慮症|疾病}}",
    "> （Generalized anxiety disorder, GAD）",
    "代謝：經肝臟 CYP3A4 代謝成 {{1-PP|代謝物}}※，會[u]進入腦中[/u]作為 {{α₂-antagonist|機轉}}"] },

/* ----- 第 1 章補充：p.15–18（SSRIs 抗焦慮、褪黑激素、H₁-blocker、Orexin）----- */
{ id: "ssri-anxiolytic", chapter: 1, name: "選擇性血清素再回收抑制劑（SSRIs）", short: "SSRI 抗焦慮", type: "topic", group: "選擇性血清素再回收抑制劑（SSRIs）", source: "統整（一）p.15–16",
  bold: [
    "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：{{第一線抗焦慮|用途}}用藥"
  ] },
{ id: "melatonin-intro", chapter: 1, name: "褪黑激素受體促效劑（Melatonin Receptor Agonists）", short: "褪黑激素總論", type: "topic", group: "褪黑激素受體促效劑（Melatonin Receptor Agonists）", source: "統整（一）p.17",
  bold: [
    "※ 褪黑激素由{{松果體|器官}}（Pineal gland）分泌，受體在 SCN（上視交叉神經核）中有極高的密度：",
    "- MT₁：刺激 MT₁ 可以{{抑制 SCN|機轉}}來促進睡眠",
    "- MT₂：刺激 MT₂ 會影響生理時鐘",
    "※ Melatonin 與 Serotonin 都是由 [u]{{L-tryptophan|物質}}[/u]★生合成而來：L-tryptophan → Serotonin → Melatonin",
    "※ 此類藥物會影響催乳素（Prolactin）和睪固酮（Testosterone）的分泌"
  ] },
{ id: "melatonin", chapter: 1, name: "Melatonin", type: "drug", group: "褪黑激素受體促效劑（Melatonin Receptor Agonists）", source: "統整（一）p.17", img: "assets/medchem/melatonin.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["{{不具有立體中心|性質}}★",
    "含有 {{Indole|結構}} 結構",
    "3 號位有 acylaminoethyl 取代",
    "5 號位有 {{Methoxy|取代基}} 取代"],
  pharm: ["直接補充褪黑激素，刺激受體"] },
{ id: "ramelteon", chapter: 1, name: "S-Ramelteon", type: "drug", group: "褪黑激素受體促效劑（Melatonin Receptor Agonists）", source: "統整（一）p.17", img: "assets/medchem/ramelteon.png",
  use: ["{{鎮靜安眠|用途}}"],
  feat: ["與 Melatonin 結構相異之處",
    "- 5 號位：Methoxy → {{Furan|結構}}",
    "- 芳香環：Indole → {{Indane|結構}}",
    "- 支鏈：乙醯基 → 丙醯基",
    "S form 的活性較 R form 高 {{500|數值}} 倍"],
  pharm: ["可口服，選擇性作用於 MT₁和 MT₂受體",
    "代謝：主要經 {{CYP1A2|酵素}} 代謝",
    "→ 側鏈的 hydroxylation 為活性代謝物",
    "吸菸會誘導 CYP1A2，加速代謝並產生毒性",
    "副作用：頭暈、疲勞、影響{{內分泌|名詞}}"] },
{ id: "h1-intro", chapter: 1, name: "第一代 H₁ 受體拮抗劑（Histamine H₁ Receptor Antagonists）", short: "H₁-blocker 總論", type: "topic", group: "第一代 H₁ 受體拮抗劑（Histamine H₁ Receptor Antagonists）", source: "統整（一）p.18",
  bold: [
    "※ 第一代抗組織胺藥除了可以減緩過敏的症狀，因其{{可以通過 BBB|性質|無法通過 BBB}}，有{{抑制 CNS|機轉|興奮 CNS}}的作用",
    "※ 副作用：鎮靜、嗜睡、減少認知能力等，其中以{{嗜睡|副作用}}最為常見 → 利用這項副作用來達到鎮靜安眠的效果"
  ] },
{ id: "doxylamine", chapter: 1, name: "Doxylamine", type: "drug", group: "第一代 H₁ 受體拮抗劑（Histamine H₁ Receptor Antagonists）", source: "統整（一）p.18", img: "assets/medchem/doxylamine.png",
  use: ["{{鎮靜安眠|用途}}"],
  desc: ["和 {{Diphenhydramine|藥名}} 差一個{{甲基|取代基}}",
    "具有高結合力"] },
{ id: "suvorexant", chapter: 1, name: "Suvorexant", type: "drug", group: "食慾素拮抗劑（Orexin Antagonist）", source: "統整（一）p.18", img: "assets/medchem/suvorexant.png",
  use: ["{{鎮靜安眠|用途}}"],
  pharm: ["食慾素又稱腦下泌素（{{hypocretin|物質}}），是一種由下視丘分泌的 neuropeptide",
    "食慾素相關的神經元負責大腦的{{覺醒|名詞}}（arousal），典型的病態例子是猝睡症（narcolepsy），這些病人大多缺乏食慾素",
    "Suvorexant（Belsomra®）是一種作用在食慾素受體 A 與 B 的{{雙重食慾素阻斷劑|機轉}}，因此影響大腦的覺醒神經路徑",
    "Suvorexant 可顯著縮短入睡及延長睡眠時間"] },

/* ===== 第 2 章 抗癲癇藥物（統整（一）貳，p.19–31）===== */
/* 照講義逐字：精神藥理學簡介、首選藥物、作用位置、總整理放在告示牌（知識樹 ch2，沒有分類的卡片）；
   藥物格子的欄位照講義表格（特性／藥理及臨床應用）。行首「- 」＝子項目、「> 」＝接續行，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 一、局部性及全身強直-痙攣性：Ureides 相關結構藥物 > Hydantoin 類衍生物 */
{ id: "phenytoin", chapter: 2, name: "Phenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/phenytoin.png",
  use: ["（Diphenylhydantoin）"],
  feat: ["含有 {{Hydantoin|結構}} 結構（Pheny[u]toin[/u]）",
    "5 號位接{{兩個苯環|取代基}}（[u]Pheny[/u]toin）",
    "{{水溶性差|性質}}★，pKa=8 常製成鈉鹽增加溶解度",
    "> （屬於{{弱酸性|性質}}★藥物）"],
  pharm: ["藉三個氫鍵、Hydrophobic 作用與 {{Na⁺通道|標的}}★結合",
    "投與劑量與血中濃度{{非線性|性質|線性}}關係",
    "大量與血漿蛋白結合，且會{{誘導|性質|抑制}} CYP3A4",
    "對{{失神性發作|疾病}}沒有療效，可能會惡化疾病",
    "代謝：{{CYP2C9|酵素}} 進行 [i]para[/i]-hydroxylation★"] },
{ id: "fosphenytoin", chapter: 2, name: "Fosphenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/fosphenytoin.png",
  feat: ["比 Phenytoin 多了{{磷酸鹽|結構}}結構",
    "3 號位的 N 上接甲基磷酸根 {{-CH₂OPO₃²⁻|取代基}}",
    "水溶性較高，常以 IV 或 {{IM|給藥途徑}} 給藥★"],
  pharm: ["為 Phenytoin 的 {{Prodrug|性質}}★",
    "體內被磷酸酶切掉[u]磷酯鍵[/u]生成 Phenytoin",
    "副作用：{{齒齦增生|副作用}}、巨球型貧血、致畸胎"] },
{ id: "ethotoin", chapter: 2, name: "Ethotoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/ethotoin.png",
  feat: ["3 號位的 N 上接{{乙基|取代基}}（[u]Etho[/u]toin）",
    "5 號位接{{一個苯環|取代基}}"],
  pharm: ["可治療{{強直-痙攣性|疾病}}及複雜性局部性發作",
    "毒性較 Phenytoin {{低|性質|高}}，但癲癇療效較差、鎮定效果較強，做輔助治療藥物而非首選藥物",
    "代謝：可進行 {{N-去乙基化|代謝}}"] },
{ id: "mephenytoin", chapter: 2, name: "Mephenytoin", type: "drug", group: "Hydantoin 類衍生物", source: "統整（一）p.21", img: "assets/medchem/mephenytoin.png",
  feat: ["3 號位的 N 上接{{甲基|取代基}}（[u]Me[/u]phenytoin）",
    "5 號位接一個苯環及{{乙基|取代基}}"],
  pharm: ["鎮定效果較 Phenytoin {{強|性質|弱}}",
    "具[u]強烈毒性[/u]，可能造成嚴重皮疹、{{無顆粒性白血球症|副作用}}或肝炎，為第二線用藥",
    "{{3-N-demethylation|代謝}} 之代謝物具有毒性",
    "> （5-ethyl-5-phenylhydantoin）"] },

/* 講義 p.22：Barbiturates 及 Benzodiazepines 類藥物已在第 1 章介紹過，這裡再放一次供複習統整（重複的格子） */
{ id: "ae-phenobarbital", chapter: 2, name: "Phenobarbital", type: "drug", group: "抗癲癇巴比妥類（Barbiturates）", source: "統整（一）p.22", img: "assets/medchem/phenobarbital.png",
  use: ["鎮靜安眠、抗癲癇"] },
{ id: "ae-mephobarbital", chapter: 2, name: "Mephobarbital", type: "drug", group: "抗癲癇巴比妥類（Barbiturates）", source: "統整（一）p.22", img: "assets/medchem/mephobarbital.png",
  use: ["抗癲癇"] },
{ id: "ae-primidone", chapter: 2, name: "Primidone", type: "drug", group: "抗癲癇巴比妥類（Barbiturates）", source: "統整（一）p.22", img: "assets/medchem/primidone.png",
  use: ["抗癲癇"] },
{ id: "ae-diazepam", chapter: 2, name: "Diazepam", type: "drug", group: "抗癲癇 Benzodiazepines 類", source: "統整（一）p.22", img: "assets/medchem/diazepam.png",
  use: ["抗焦慮、抗癲癇", "麻醉劑、抗痙攣"] },
{ id: "ae-clonazepam", chapter: 2, name: "Clonazepam", type: "drug", group: "抗癲癇 Benzodiazepines 類", source: "統整（一）p.22", img: "assets/medchem/clonazepam.png",
  use: ["抗癲癇"] },
{ id: "ae-clorazepate", chapter: 2, name: "Clorazepate", type: "drug", group: "抗癲癇 Benzodiazepines 類", source: "統整（一）p.22", img: "assets/medchem/clorazepate.png",
  use: ["抗焦慮、抗癲癇"] },
{ id: "ae-lorazepam", chapter: 2, name: "Lorazepam", type: "drug", group: "抗癲癇 Benzodiazepines 類", source: "統整（一）p.22", img: "assets/medchem/lorazepam.png",
  use: ["抗焦慮、抗癲癇、麻醉劑"] },
{ id: "ae-midazolam", chapter: 2, name: "Midazolam", type: "drug", group: "抗癲癇 Benzodiazepines 類", source: "統整（一）p.22", img: "assets/medchem/midazolam.png",
  use: ["麻醉劑、抗焦慮、癲癇"] },

/* Iminostilbene 類衍生物 */
{ id: "iminostilbene", chapter: 2, name: "Iminostilbene", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/iminostilbene.png", imgMore: ["assets/medchem/ae-stilbene.png"],
  feat: ["為 {{Stilbene|結構}} 之衍生物（見右方說明及結構）",
    "中間結構為含 N {{七元雜環|結構}}，兩側接苯環",
    "第 {{10、11|位置}} 號位有 C=C 雙鍵"],
  pharm: ["為 Stilbene 之衍生物，原本 Stilbene 在 {{trans|名詞|cis}} form 比較穩定，但為了與 NH₂ 反應變成 cis form，最後生成 Iminostilbene"] },
{ id: "carbamazepine", chapter: 2, name: "Carbamazepine", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/carbamazepine.png",
  use: ["（CBZ）"],
  feat: ["Iminostilbene 之衍生物",
    "中間結構為含 N 七元雜環（-azepine）",
    "具有 {{Carboxamide|結構}} 結構",
    "pKa=13，為{{酸性藥|性質}}，在酸中解離程度小"],
  pharm: ["{{局部性發作|用途}}（單純&複雜性）首選用藥★",
    "也可用於治療{{三叉神經痛|疾病}}★",
    "代謝：大部分由 {{CYP3A4|酵素}} 代謝，將 C10-11 之雙鍵代謝為 {{epoxide|代謝物}}★ → 活性及毒性都[u]更強[/u]",
    "CBZ-IQ、2-OHIS※均為活性代謝物，與{{肝毒性|副作用}}有關"] },
{ id: "oxcarbazepine", chapter: 2, name: "Oxcarbazepine", type: "drug", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", img: "assets/medchem/oxcarbazepine.png",
  feat: ["Carbamazepine 之衍生物",
    "與 CBZ 之結構差異",
    "- 第 10、11 號位為{{飽和單鍵|結構|雙鍵}}",
    "- 10 號位有 {{C=O|取代基}}（ketone）取代"],
  pharm: ["可以阻斷 {{Na⁺通道|標的}}",
    "代謝：經 {{Alcohol dehydrogenase|酵素}} 還原成 10-hydroxyoxcarbazepine（活性代謝物）",
    "半衰期較 Carbamazepine {{短|性質|長}}，藥效較弱但肝毒性較小，較容易引起{{低血鈉|副作用}}"] },

/* Biscarbamates 類衍生物 */
{ id: "felbamate", chapter: 2, name: "Felbamate", type: "drug", group: "Biscarbamates 類衍生物", source: "統整（一）p.24", img: "assets/medchem/felbamate.png",
  feat: ["具有{{兩個|數值}} Carbamate 結構",
    "結構與肌肉鬆弛劑 {{Meprobamate|藥名}} 相似"],
  pharm: ["機轉不明，但會和 {{NMDA|受體}}★受體結合，抑制 Ca²⁺流入",
    "形成毒性代謝物 {{2-phenylpropenal|代謝物}}★（Atropaldehyde）"] },
{ id: "fluorofelbamate", chapter: 2, name: "2-Fluorofelbamate", type: "drug", group: "Biscarbamates 類衍生物", source: "統整（一）p.24", img: "assets/medchem/fluorofelbamate.png",
  feat: ["與 Felbamate 只差一個 F",
    "{{C₂|位置}} 上有 F 取代基"],
  pharm: ["為了避免 Felbamate C₂ 上的 H 代謝產生具有毒性的 {{atropaldehyde|代謝物}}，故以 F 取代 H",
    "目前還在研發，尚未上市"] },

/* Miscellaneous 雜類結構藥物 > GABA 類衍生物 */
{ id: "gabapentin", chapter: 2, name: "Gabapentin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/gabapentin.png",
  feat: ["含有 {{GABA|結構}} 結構（下方補充 GABA 結構）",
    "5 個 C 原子（Gaba[u]pentin[/u]）與 GABA 之 β-carbon 形成{{飽和六元環|結構}}"],
  pharm: ["可增加 {{GAD|標的}} 的作用，使 GABA 合成↑",
    "結合 {{P/Q-type|名詞}} Ca²⁺通道[u]異位[/u]調節，減少 Ca²⁺流入",
    "水溶性高，但可作用在 {{CNS|器官}}",
    "可治療{{糖尿病神經痛|疾病}}、皰疹後神經痛",
    "代謝：{{不經過代謝|代謝}}，直接透過腎臟排除"] },
{ id: "pregabalin", chapter: 2, name: "Pregabalin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/pregabalin.png",
  feat: ["結構為 {{S-3-isobutyl|結構}} GABA",
    "有一個 chiral center，以 {{S form|結構|R form}} 存在"],
  pharm: ["結合到 P/Q-type-Ca²⁺通道的 {{α₂δ|名詞}} 次單元，可降低通道活性，減少 Ca²⁺流入",
    "藥效為 Gabapentin 的 {{3-10|數值}} 倍",
    "可治療皰疹後神經痛，輔助治療[u]成人[/u]的局部性發作"] },
{ id: "vigabatrin", chapter: 2, name: "Vigabatrin", type: "drug", group: "GABA 類衍生物", source: "統整（一）p.25", img: "assets/medchem/vigabatrin.png",
  feat: ["結構為 {{γ-vinyl|結構}} GABA",
    "只有 {{S(+)-form|結構}}★具有活性，臨床上用消旋"],
  pharm: ["{{不可逆|性質|可逆}}的 GABA-T 抑制劑★",
    "治療嬰兒痙攣，及在其他藥物難以改善之情況下的成人複雜性局部發作",
    "代謝：以{{原型藥|代謝}}直接由尿液排出"] },

/* 含 amide group 之衍生物（字尾-amide） */
{ id: "rufinamide", chapter: 2, name: "Rufinamide", type: "drug", group: "含 amide group 之衍生物（字尾-amide）", source: "統整（一）p.26", img: "assets/medchem/rufinamide.png",
  feat: ["含五元雜環 {{triazole|結構}} 及一個 amide group",
    "苯環之{{兩個 ortho 位|位置}}有 F 取代"],
  pharm: ["增加 Na⁺通道的{{不活化時間|機轉}}，減少重複放電次數",
    "為治療{{雷葛氏症候群|疾病}}的孤兒藥",
    "代謝：主要由 [u]{{carboxylesterase|酵素}}[/u] 將 amide 水解為 COOH，少部分會在 benzylic carbon 斷裂代謝"] },
{ id: "lacosamide", chapter: 2, name: "Lacosamide", type: "drug", group: "含 amide group 之衍生物（字尾-amide）", source: "統整（一）p.26", img: "assets/medchem/lacosamide.png", imgMore: ["assets/medchem/ae-l-serine.png"],
  feat: ["為 {{L-serine|物質}} 的衍生物，共有[u]兩個[/u] amide",
    "N 端接 acetyl group，C 端接 benzylamine",
    "以 {{-OCH₃|取代基}} 取代 Serine 上的 -OH"],
  pharm: ["阻斷 {{Na⁺通道|標的}}，但和 phenytoin、CBZ 機轉不同",
    "輔助治療 17 歲以上患者之局部性發作",
    "代謝：60% 會經 {{CYP2C9|酵素}} 產生[u]無活性[/u] O-demethyl 代謝物，其餘未經代謝者由尿液排出"] },

/* 含 acetamide group 之衍生物（字尾-acetam） */
{ id: "levetiracetam", chapter: 2, name: "S-(-)-Levetiracetam", type: "drug", group: "含 acetamide group 之衍生物（字尾-acetam）", source: "統整（一）p.26", img: "assets/medchem/levetiracetam.png",
  feat: ["含有 {{pyrrolidone|結構}} 結構",
    "N 上接 {{acetamide|取代基}} 取代基",
    "結構必為{{左旋|性質|右旋}}（[u]Lev[/u]orotory）",
    "Amide 結構容易被 {{esterase|酵素}} 水解代謝"],
  pharm: ["作用機轉不明",
    "輔助治療[u]成人[/u]的局部性發作（與 pregabalin 相同）",
    "代謝：主要以{{原型藥|代謝}}★由尿液排出，其餘將 amide 水解為 COOH（無活性）後排出"] },

/* 未分類結構 */
{ id: "ezogabine", chapter: 2, name: "Ezogabine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/ezogabine.png",
  use: ["（Retigabine）"],
  feat: ["具有 Ethyl 和 {{carbamate|結構}} 結構"],
  pharm: ["機轉：促進開啟 {{K⁺通道|標的}}★，使 K⁺流出細胞造成過極化，抑制中樞神經興奮",
    "輔助治療[u]成人[/u]的局部性發作",
    "代謝：{{不經 CYP450|代謝}} 代謝"] },
{ id: "lamotrigine", chapter: 2, name: "Lamotrigine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/lamotrigine.png",
  feat: ["為 {{6-phenyl-1,2,4-triazine|結構}} 衍生物",
    "主要在 {{2 號位|位置}}★進行 glucuronidation★"],
  pharm: ["機轉：阻斷 {{Na⁺通道|標的}}，也可阻斷 Ca²⁺通道",
    "{{孕婦|名詞}}使用最安全的抗癲癇藥物",
    "和 {{Valproic acid|藥名}}★併用可延長半衰期",
    "> （Valproic acid 為 CYP 抑制劑，可抑制代謝）",
    "治療成人的{{雷葛氏症候群|疾病}} Lennox-Gastaut",
    "副作用：{{紅疹|副作用}}、嗜睡、複視"] },
{ id: "tiagabine", chapter: 2, name: "Tiagabine", type: "drug", group: "未分類結構", source: "統整（一）p.27", img: "assets/medchem/tiagabine.png",
  feat: ["非 GABA 類似結構",
    "含有{{兩個 Thiophene|結構}} 結構",
    "含有 {{Nipecotic acid|結構}} 結構"],
  pharm: ["機轉：抑制 GABA 的再吸收★ → 抑制 {{GAT|標的}}★",
    "口服吸收佳，可通過 {{BBB|器官}}★",
    "代謝：主要經 {{CYP3A4|酵素}} 在 thiophene 上進行 oxidation，之後再進行 glucuronidation"] },
{ id: "topiramate", chapter: 2, name: "Topiramate", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/topiramate.png",
  feat: ["由 {{Fructose|物質}} 形成 [u]ketal[/u] 後與 sulfamate ester 後發展而成的酯類衍生物"],
  pharm: ["目前機轉仍不明",
    "與血漿蛋白結合率{{低|性質|高}}",
    "代謝：大部分藥物會直接經{{尿液|代謝}}排出"] },
{ id: "zonisamide", chapter: 2, name: "Zonisamide", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/zonisamide.png",
  feat: ["為 {{Sulfonamide|結構}}★的衍生物",
    "含有 {{Benzisoxazole|結構}} 結構"],
  pharm: ["機轉：阻斷 {{Na⁺通道|標的}}和 T-type Ca²⁺通道",
    "輔助治療 16 歲以上且第一線藥物難以控制的病症",
    "代謝：",
    "- 於 Sulfonamide 的 N 上行 N-acetylation",
    "- 經由 {{CYP3A4|酵素}} 或 CYP2D6 進行還原",
    "- 在 N-O 之間開環形成 2-sulfamoylacetyl phenol"] },
{ id: "valproic-acid", chapter: 2, name: "Valproic acid", type: "drug", group: "未分類結構", source: "統整（一）p.28", img: "assets/medchem/valproic-acid.png",
  use: ["（VPA）"],
  feat: ["Acetic acid 上有{{兩個丙基|取代基}}，故又稱為 dipropylacetic acid",
    "pKa=4.7，在體內可以{{完全解離|性質}}",
    "為 {{CYP2C9|酵素}} 的抑制劑★，與 lamotrigine 併服可延長其半衰期"],
  pharm: ["機轉[u]可能[/u]是活化 {{glutamic acid decarboxylase|標的}} 或抑制 GABA 轉胺酶 → 使 GABA 濃度上升",
    "代謝：主要由肝臟代謝，在碳鏈上行 hydroxylation★",
    "- 30-50%進行 glucuronidation 後經尿液排出",
    "- 40%經 β-oxidation 形成二級醇，脫水之主要代謝物為具活性的 {{(E)-2-ene-VPA|代謝物}}",
    "- 15-20%經 ω-oxidation 形成一級醇，脫水後產生毒性代謝物 {{(E)-2,4-diene-VPA|代謝物}}"] },

/* 二、失神性發作藥物：Ureide 衍生物 > Oxazolidinediones 類衍生物 */
{ id: "trimethadione", chapter: 2, name: "Trimethadione", type: "drug", group: "Oxazolidinediones 類衍生物（字尾-dione）", source: "統整（一）p.29", img: "assets/medchem/trimethadione.png",
  feat: ["結構中有{{三個甲基|取代基}}（[u]trimetha[/u]dione）"],
  pharm: ["{{Prodrug|性質}}★，必須經 N-demethylation 代謝為 {{dimethadione|代謝物}}★才能作用在 T-type Ca²⁺通道",
    "目前只用於[u]失神性發作[/u]或其他藥物難以改善的病症"] },

/* Succinimides 類衍生物 */
{ id: "ethosuximide", chapter: 2, name: "Ethosuximide", type: "drug", group: "Succinimides 類衍生物（字尾-suximide）", source: "統整（一）p.29", img: "assets/medchem/ethosuximide.png",
  feat: ["將 Oxazolidinedione 五元環上的 {{O→C|結構}}",
    "> （降低毒性）",
    "3 號位接甲基、{{乙基|取代基}}（Etho-）"],
  pharm: ["治療{{失神性發作|用途}}之首選藥★",
    "{{不會|性質}}與血漿蛋白結合★",
    "副作用：刺激胃部、貧血、血小板↓",
    "代謝：{{乙基上氧化|代謝}}為[u]無活性[/u]代謝物，由尿液排出"] },
{ id: "methsuximide", chapter: 2, name: "Methsuximide", type: "drug", group: "Succinimides 類衍生物（字尾-suximide）", source: "統整（一）p.29", img: "assets/medchem/methsuximide.png",
  feat: ["N 上接有{{甲基|取代基}}（Meth-）",
    "3 號位接甲基、{{苯環|取代基}}"],
  pharm: ["毒性較 Ethosuximide {{強|性質|弱}}，較少使用",
    "代謝：經 {{N-demethylation|代謝}} 形成之代謝物具有長半衰期（25 小時）"] },
{ id: "phensuximide", chapter: 2, name: "Phensuximide", type: "drug", group: "Succinimides 類衍生物（字尾-suximide）", source: "統整（一）p.29", img: "assets/medchem/phensuximide.png",
  feat: ["N 上接有{{甲基|取代基}}（Meth-）",
    "3 號位接{{苯環|取代基}}"],
  pharm: ["藥效較 Ethosuximide 弱",
    "會使尿液變成{{粉紅色|性質}}或紅色（無毒性）",
    "代謝：直接由{{膽汁|代謝}}或尿液排出"] },

/* ===== 第 3 章 抗憂鬱藥物（統整（一）參，p.32–43）===== */
/* 照講義逐字：分類總表放在告示牌（知識樹 ch3，沒有分類的卡片）；※ 註解、簡介方框、比較表放進各自的小白標。
   藥物格子的欄位照講義表格（特性／藥物代謝）。行首「- 」＝子項目、「> 」＝接續行，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 一、NSRI：含末端三級胺之三環抗憂鬱藥物（TCA-NSRIs）> Amitriptyline 及其衍生物 */
{ id: "amitriptyline", chapter: 3, name: "Amitriptyline", type: "drug", group: "Amitriptyline 及其衍生物（環外有雙鍵存在）", source: "統整（一）p.33", img: "assets/medchem/ad-amitriptyline.png",
  feat: ["屬於 {{Dibenzocycloheptene|結構}} 類 TCA",
    "5 號位為 {{C 原子|結構|N 原子}}，且接有 {{propylidene|取代基}}",
    "結構和 {{Nortriptyline|藥名}} 相似（SNRIs）"],
  metab: ["{{對光敏感|性質}}，須避光保存，以防氧化成酮而沉澱",
    "主要由 {{CYP2D6|酵素}} 經 N-demethylation 代謝成{{有活性|性質|無活性}}的二級胺 Nortriptyline（SNRI 類）",
    "可在 C₁₀ 進行{{水解|代謝}}，產生有活性的 {{E-10-hydroxy|代謝物}} 代謝物"] },
{ id: "doxepin", chapter: 3, name: "Doxepin", type: "drug", group: "Amitriptyline 及其衍生物（環外有雙鍵存在）", source: "統整（一）p.33", img: "assets/medchem/ad-doxepin.png",
  feat: ["屬於 Dibenz[u]oxep[/u]ine 類 TCA",
    "七元雜環中含有 {{O 原子|結構|S 原子}}（11 號位）",
    "→ 造成三環系統{{不對稱|性質|對稱}}",
    "{{E form|結構|Z form}} 較[u]穩定[/u]但 Z form [u]活性較大[/u]",
    "> （市面上多販售 E/Z=85/15）"],
  metab: ["代謝：主要進行 {{N-desmethylation|代謝}}",
    "- E form：由 CYP2D6、CYP2C19 代謝",
    "- Z form：只由 {{CYP2C19|酵素|CYP2D6}} 代謝"] },
{ id: "dosulepin", chapter: 3, name: "Dosulepin", type: "drug", group: "Amitriptyline 及其衍生物（環外有雙鍵存在）", source: "統整（一）p.33", img: "assets/medchem/ad-dosulepin.png",
  feat: ["為 Doxepin 的 {{Thio-isostere|名詞}}",
    "七元雜環中含有 {{S 原子|結構|O 原子}}（11 號位）",
    "只有 {{E form|結構|Z form}} 具有活性"],
  metab: ["容易在腸胃道 GI 被吸收",
    "代謝：會經{{肝臟首渡代謝|代謝}}",
    "- 主要經 [u]S-oxidation[/u] 生成{{有活性|性質|無活性}}的 Dosulepin S-oxide",
    "- 其次經 N-demethylation 代謝為{{無活性|性質|有活性}}的產物"] },

/* TCA-NSRIs > Imipramine 及其衍生物 */
{ id: "imipramine", chapter: 3, name: "Imipramine", type: "drug", group: "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）", source: "統整（一）p.34", img: "assets/medchem/ad-imipramine.png",
  feat: ["對 {{5-HT|受體|NE}} 的選擇性較佳",
    "若 3 號位接[u]鹵素[/u]或[u]氰基[/u]，可增強對 {{SERT|標的|NET}} 的選擇性"],
  metab: ["主要由 CYP2C19、CYP1A2 行 N-demethylation，產生活性代謝物：[u]二級胺[/u] {{Desipramine|代謝物}}（SNRIs）",
    "→ 失去抑制 5-HT 活性，選擇性抑制 {{NE|物質|5-HT}} 的再吸收",
    "可改善{{兒童遺尿|疾病}}的現象"] },
{ id: "clomipramine", chapter: 3, name: "Clomipramine", type: "drug", group: "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）", source: "統整（一）p.34", img: "assets/medchem/ad-clomipramine.png",
  feat: ["3 號位上有 {{Cl|取代基}} 取代基★→藥效提升 50 倍",
    "與 {{Chlorpromazine|藥名}} 為 isostere"],
  metab: ["主要由 {{CYP2D6|酵素}} 進行 N-demethylation，產生之活性代謝物的選擇性、藥效皆[u]比原來更高[/u]",
    "也可進行 C₂、C₈ 的 {{hydroxylation|代謝}}"] },
{ id: "trimipramine", chapter: 3, name: "Trimipramine", type: "drug", group: "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）", source: "統整（一）p.34", img: "assets/medchem/ad-trimipramine.png",
  feat: ["結構中共有{{三個甲基|取代基}}（Trimi-）",
    "5-propyl 的側鏈{{多接一個甲基|取代基}}",
    "→ 形成 chiral center（★）",
    "主要以{{消旋化合物|性質}}上市"],
  metab: ["(-)-Trimipramine 經 {{CYP2D6|酵素|CYP2C19}} 行 [u]2-hydroxylation[/u]",
    "(+)-Trimipramine 經 {{CYP2C19|酵素|CYP2D6}} 行 [u]N-demethylation[/u]"] },
{ id: "lofepramine", chapter: 3, name: "Lofepramine", type: "drug", group: "Imipramine 及其衍生物：皆為 10,11-dihydrodibenzazepine 類 TCA（結構無雙鍵存在，C₅ 為 N／字尾-pramine）", source: "統整（一）p.34", img: "assets/medchem/ad-lofepramine.png",
  feat: ["末端 N 上接了 {{para-chlorophenacyl|取代基}}",
    "→ {{親脂性提升|性質}}，更容易進入 CNS，對 NET 的選擇性也更高"],
  metab: ["進行 {{N-demethylation|代謝}}，形成[u]二級胺[/u] {{Desipramine|代謝物}}",
    "→ 失去抑制 5-HT 活性，選擇性抑制 NE 的再吸收"] },

/* NSRI：非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs） */
{ id: "venlafaxine", chapter: 3, name: "Venlafaxine / Desvenlafaxine", short: "Venlafaxine", type: "drug", group: "非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs）", source: "統整（一）p.35", img: "assets/medchem/ad-venlafaxine.png",
  use: ["（ODV）", "結構圖圈起來的地方改為 {{OH|取代基}}，即為 Desvenlafaxine"],
  feat: ["以 {{methoxyphenylethylamine|結構}} 為骨架",
    "屬 TCA 開環後的化合物，一邊接苯環，另一邊接 {{cyclohexanol|結構}}",
    "側鏈之距離為{{一個 C|數值|三個 C}}（TCA 是 3 個）",
    "與阿片類止痛藥 {{Tramadol|藥名}} 結構類似"],
  metab: ["主要由 {{CYP2D6|酵素}} 進行 {{O-demethylation|代謝}}",
    "→ 產生活性代謝物 [u]O-desmethyl[/u]venlafaxine（ODV）",
    "→ 直接用此代謝物作為新的藥物：{{Desvenlafaxine|藥名}}",
    "次要由 CYP3A4 進行 N-demethylation"] },
{ id: "milnacipran", chapter: 3, name: "Milnacipran", type: "drug", group: "非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs）", source: "統整（一）p.35", img: "assets/medchem/ad-milnacipran.png",
  feat: ["具有 {{Cyclopropane|結構}} 結構（-cipran）",
    "由 phenylcyclopropanecarboxamide 修飾而得的 {{cis-aminomethyl|結構}} 衍生物",
    "若用 amino[u]propyl[/u] 取代 aminomethyl，會變成強效的 {{NMDA 受體拮抗劑|機轉}}"],
  metab: ["對 {{5-HT|受體|NE}} 選擇性較佳",
    "對α、M、H₁ 受體有較弱親和力 →副作用較 TCA 少",
    "代謝：{{50%|數值}}藥物會直接經尿液排出"] },
{ id: "duloxetine", chapter: 3, name: "Duloxetine", type: "drug", group: "非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs）", source: "統整（一）p.35", img: "assets/medchem/ad-duloxetine.png",
  feat: ["以 {{Fluoxetine|藥名}}（SSRIs）為模板進行改良",
    "- Phenoxy → {{Naphthyloxy|結構}}",
    "- Benzene → {{Thiophene|結構}}（isostere）"],
  metab: ["CYP2D6 進行 N-demethylation，形成{{活性|性質|無活性}}代謝物",
    "CYP1A2 在萘環的 4/5/6 號位進行 hydroxylation",
    "→ {{4-hydroxy|代謝物}} 代謝物仍具有活性，但選擇性抑制 {{SERT|標的|NET}}",
    "次要代謝會在 Thiophene 上行 oxidation，代謝物會導致類似[u]黃疸[/u]的症狀出現（Jaundice-like condition）"] },

/* 二、SNRI：含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs） */
{ id: "desipramine", chapter: 3, name: "Desipramine", type: "drug", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.36", img: "assets/medchem/ad-desipramine.png",
  feat: ["Imipramine {{去掉一個甲基|結構}}後形成（Des-）",
    "屬於 {{Dihydrodibenzazepine|結構}} 類"],
  metab: ["為 {{Imipramine|藥名}} 經 N-去甲基化後的活性代謝物",
    "主要由 CYP2D6 在 {{N 之對位|位置}}進行 2-hydroxylation",
    "次要由 CYP1A2、CYP2C19 於支鏈進行 N-去甲基化，形成{{一級胺|結構|二級胺}}",
    "> （以上兩者均為{{無活性|性質|有活性}}代謝物）"] },
{ id: "nortriptyline", chapter: 3, name: "Nortriptyline", type: "drug", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.36", img: "assets/medchem/ad-nortriptyline.png",
  feat: ["Amitriptyline {{去掉一個甲基|結構}}後形成（Nor-）",
    "屬於 {{Dibenzocycloheptene|結構}} 類"],
  metab: ["為 {{Amitriptyline|藥名}} 經 N-去甲基化後的活性代謝物",
    "主要由 CYP2D6 在支鏈進行 N-demethylation，形成{{一級胺|結構|二級胺}}（無活性）",
    "次要由 CYP2D6 在 benzylic / C₁₀ 進行 hydroxylation，形成{{活性|性質|無活性}}代謝物 {{E-10-hydroxy|代謝物}}nortriptyline",
    "> （Z form 無活性）"] },
{ id: "amoxapine", chapter: 3, name: "Amoxapine", type: "drug", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.36", img: "assets/medchem/ad-amoxapine.png",
  feat: ["屬於 Dibenz[u]oxazep[/u]ine 類",
    "> （含 N、O 七元雜環）",
    "支鏈{{非三個碳|結構}}：以 {{piperazinyl|取代基}} 取代",
    "2 號位有 Cl 取代"],
  metab: ["由 {{Loxapine|藥名}}（抗精神病藥）經 {{N-demethylation|代謝}} 而來",
    "可由 CYP3A4 在沒有接 Cl 的環上進行 hydroxylation，形成 7/8-hydroxyamoxapine（皆{{具有活性|性質|無活性}}）",
    "為{{最快代謝排除|性質}}的 TCA",
    "不可和 {{Ketoconazole|藥名}} 併服，因兩者都由 CYP3A4 代謝"] },
{ id: "protriptyline", chapter: 3, name: "Protriptyline", type: "drug", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.37", img: "assets/medchem/ad-protriptyline.png",
  feat: ["屬於 Dibenzocyclohep[u]triene[/u] TCA",
    "TCA 中唯一中間環有 {{C=C 雙鍵|結構}}者",
    "與 {{Nortriptyline|藥名}} 只差一個雙鍵在環內、一個雙鍵在環外"],
  metab: ["中央環之雙鍵容易形成 {{epoxide|代謝物}}，再被 H₂O {{開環|代謝}}接上兩個 OH 基，形成{{無活性|性質|有活性}}的 diol 代謝物"] },
{ id: "maprotiline", chapter: 3, name: "Maprotiline", type: "drug", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.37", img: "assets/medchem/ad-maprotiline.png",
  feat: ["屬 Dibenzobicyclooctadiene {{四環類|結構|三環類}} TCA",
    "第四環由{{雙碳橋|結構}} ethylene bridge 連接中央六元環之 para 位，形成 {{bicyclo-molecular|結構}}"],
  metab: ["主要由多型 Polymorphic 的 {{CYP2D6|酵素}}、CYP2C19 代謝",
    "N-demethylation 形成{{有活性|性質|無活性}}的代謝物",
    "N-oxidation 形成{{無活性|性質|有活性}}的 Maprotiline-N-oxide"] },

/* SNRI：非三環結構之選擇性 NE 再回收抑制劑（Non-TCA SNRIs） */
{ id: "reboxetine", chapter: 3, name: "Reboxetine", type: "drug", group: "非三環結構之選擇性 NE 再回收抑制劑（Non-TCA SNRIs）", source: "統整（一）p.37", img: "assets/medchem/ad-reboxetine.png",
  feat: ["結構為 {{Phenoxyphenylpropylamine|結構}} 類",
    "含有 {{Morpholine|結構}} 結構",
    "有兩個 chiral center",
    "→ {{S,S-(+)-enantiomer|結構}} 活性較大"],
  metab: ["由 {{CYP3A4|酵素}} 負責進行代謝",
    "主要進行 {{O-dealkylation|代謝}}，產生{{無活性|性質|有活性}}代謝物",
    "> （去除乙氧基的 ethyl group）"] },
{ id: "atomoxetine", chapter: 3, name: "R-(-)-Atomoxetine", short: "Atomoxetine", type: "drug", group: "非三環結構之選擇性 NE 再回收抑制劑（Non-TCA SNRIs）", source: "統整（一）p.37", img: "assets/medchem/ad-atomoxetine.png",
  feat: ["結構為 Phenoxyphenylpropylamine 類",
    "{{R form|結構|S form}} 與 NET 的親和力強 10 倍",
    "治療孩童過動症 {{ADHD|疾病}} 及{{成人憂鬱症|疾病}}",
    "較無抗膽鹼及心血管方面的副作用"],
  metab: ["主要由 {{CYP2D6|酵素}} 在 phenoxy group 對位進行 hydroxylation，形成{{有活性|性質|無活性}}的 4-hydroxy-(R)-代謝物",
    "次要由 CYP2C19 在支鏈進行 N-demethylation"] },

/* 三、SSRI > Phenoxyphenylalkylamine 類衍生物 */
{ id: "fluoxetine-ad", chapter: 3, name: "Fluoxetine", type: "drug", group: "Phenoxyphenylalkylamine 類衍生物", source: "統整（一）p.38", img: "assets/medchem/ad-fluoxetine.png",
  use: ["抗焦慮、抗憂鬱"],
  feat: ["市售為消旋化合物，但 {{S form|結構|R form}} 效果較強",
    "> （左圖★為 chiral center）",
    "含有 {{CF₃|取代基}} 取代基（[u]Flu[/u]oxetine）",
    "{{CYP2D6|酵素}} 強力抑制劑"],
  metab: ["主要由 CYP2D6 行 {{N-去甲基化|代謝}}，形成{{活性|性質|無活性}}代謝物 [u]Nor[/u]fluoxetine",
    "本分類的三個藥物之胺基都會{{質子化|性質}}並與自身氧原子形成氫鍵",
    "→ 形成 {{β-arylamino-like group|結構}}"] },
{ id: "paroxetine", chapter: 3, name: "Paroxetine", type: "drug", group: "Phenoxyphenylalkylamine 類衍生物", source: "統整（一）p.38", img: "assets/medchem/ad-paroxetine.png",
  use: ["抗焦慮、抗憂鬱"],
  feat: ["Fluoxetine 的{{閉環|結構|開環}}類似物",
    "具有兩個 chiral center，所以有 {{4|數值}} 個異構物",
    "→ 市售以 {{(3S, 4R)-(-)-enantiomer|結構}} 為主",
    "{{CYP2D6|酵素}} 強力抑制劑"],
  metab: ["胺基質子化並與自身氧原子形成氫鍵",
    "→ 形成 β-arylamino-like group"] },
{ id: "citalopram", chapter: 3, name: "Citalopram / Escitalopram", short: "Citalopram", type: "drug", group: "Phenoxyphenylalkylamine 類衍生物", source: "統整（一）p.38", img: "assets/medchem/ad-citalopram.png",
  use: ["抗焦慮、抗憂鬱"],
  feat: ["由 Talopram、S-Talsupram 衍生而來",
    "含有 {{C≡N|結構}}、F 原子",
    "其 {{S-enantiomer|結構|R-enantiomer}} 稱為 [u]Es[/u]citalopram，對受體有高度親和力與選擇性"],
  metab: ["進行 N-demethylation，主要代謝物仍有 {{50%|數值}}活性",
    "胺基質子化並與自身氧原子形成氫鍵 →形成 β-arylamino-like group"] },

/* SSRI > Phenylalkylamine 類衍生物 */
{ id: "sertraline", chapter: 3, name: "Sertraline", type: "drug", group: "Phenylalkylamine 類衍生物", source: "統整（一）p.39", img: "assets/medchem/ad-sertraline.png",
  use: ["抗焦慮、抗憂鬱"],
  feat: ["含有 {{tetralin|結構}} 結構，為 phenylaminotetralin",
    "具有兩個 chiral center",
    "→ 市售以 {{S, S-(+)-diastereomer|結構}} 為主"],
  metab: ["主要經 {{CYP2B6|酵素}} 行 N-去甲基化，主要代謝物活性比原來小 5-10 倍",
    "→ 仍屬於{{活性|性質|無活性}}代謝物"] },

/* SSRI > Miscellaneous 雜類藥物 */
{ id: "fluvoxamine", chapter: 3, name: "Fluvoxamine", type: "drug", group: "Miscellaneous 雜類藥物", source: "統整（一）p.39", img: "assets/medchem/ad-fluvoxamine.png",
  use: ["抗焦慮、抗憂鬱"],
  feat: ["屬於 {{nontricyclic SERT inhibitor|名詞}}※",
    "使用上以 {{E form|結構|Z form}} 為主（異側）",
    "由 {{Noxiptilin|藥名}} 開環修飾得到",
    "苯環對位上有 {{CF₃|取代基}} 取代基",
    "具有長碳鏈脂溶性端（aliphatic）"],
  metab: ["CYP2D6 行 [u]O-去甲基化[/u]，最後{{氧化成酸|代謝}}",
    "胺基質子化並與自身氧原子形成氫鍵",
    "→形成β-arylamino-like group"] },

/* 四、DNRI */
{ id: "bupropion", chapter: 3, name: "Bupropion", type: "drug", group: "多巴胺及正腎上腺素再回收抑制劑（DNRI）", source: "統整（一）p.40", img: "assets/medchem/ad-bupropion.png",
  feat: ["結構為 phenylisopropylamino[u]ketone[/u]，由{{甲基安非他命|藥名}}衍生而來",
    "含有 [i]tert[/i]-butyl group",
    "[i]t[/i]-butyl 基團可防止藥物進行 {{N-dealkylation|代謝}} 代謝",
    "→ 防止擬交感神經活性或厭食症 anorexigenic",
    "→ {{最不會|性質|最常}}有體重增加的副作用★"],
  metab: ["[i]tert[/i]-butyl 其中任一甲基可由 {{CYP2B6|酵素}} 氧化形成 hydroxybupropion（50%活性代謝物）",
    "上面的中間產物可再環化成 phenyl[u]morpholin[/u]ol",
    "酮也可被{{還原成 OH|代謝}}，形成具兩個 chiral center 之活性代謝物"] },

/* 五、SRM/SARI > Arylpiperazine 類衍生物 */
{ id: "trazodone", chapter: 3, name: "Trazodone", type: "drug", group: "Arylpiperazine 類衍生物", source: "統整（一）p.41", img: "assets/medchem/ad-trazodone.png",
  feat: ["為 phenylpiperazine-{{triazolopyridine|結構}}★類",
    "具有{{雙重作用|機轉}}",
    "- {{5-HT₂A antagonist|機轉}}★",
    "- 弱的 5-HT reuptake inhibitor"],
  metab: ["主要由 CYP3A4 進行 {{N-dealkylation|代謝}}，產生：",
    "> Triazolopyridinone-propionic acid / TPP 和 {{m-CPP|代謝物}}",
    "> （m-CPP：m-chlorophenylpiperazine，{{活性|性質|無活性}}★代謝物）",
    "次要由 CYP3A4 在苯環 para 位加上 OH 基後：",
    "- 再切掉 TPP，會形成 {{iminoquinone|代謝物}}（有毒性）",
    "- 於 pyridine 形成環氧基，若用{{親核基|名詞}}開環產生{{肝毒性|副作用}}"] },
{ id: "aripiprazole", chapter: 3, name: "Aripiprazole", type: "drug", group: "Arylpiperazine 類衍生物", source: "統整（一）p.41", img: "assets/medchem/ad-aripiprazole.png",
  use: ["精神病、抗憂鬱"],
  feat: ["結構含有 {{quinolinone|結構}}，苯環有{{兩個 Cl|取代基}}",
    "同時為第二代{{抗精神病|用途}}藥物",
    "用於急性躁狂及躁鬱症，青少年及成人皆可用此藥物治療",
    "具有{{雙重作用|機轉}}"],
  metab: ["經 {{CYP3A4|酵素}} 進行 Dehydroxylation，脫水形成{{雙鍵|結構}}",
    "→ 產生活性代謝物 Dehydroaripiprazole",
    "經 CYP3A4 進行 N-dealkylation，產生有活性的 {{DCPP|代謝物}}",
    "經 CYP3A4/2D6 在苯環 para 位接上 OH 基"] },

/* SRM/SARI > Indole 類衍生物 */
{ id: "vilazone", chapter: 3, name: "Vilazodone", type: "drug", group: "Indole 類衍生物", source: "統整（一）p.41", img: "assets/medchem/ad-vilazodone.png",
  feat: ["為 phenylpiperazine-2-benzofuran-carboxamide 類",
    "含有 {{Indole|結構}}、C≡N 結構",
    "具有{{雙重作用|機轉}}：",
    "> 5-HT 的{{部分促效劑|機轉}}及再回收抑制劑"],
  metab: ["主要：{{CYP3A4|酵素}}／次要：CYP2C19、CYP2D6",
    "在苯環 6 號位進行 {{hydroxylation|代謝}}，產生{{無活性|性質|有活性}}代謝物"] },

/* 六、NaSSA：藥物個論（機轉、比較表、代謝放在小白標） */
{ id: "mianserin", chapter: 3, name: "Mianserin", type: "drug", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42", img: "assets/medchem/ad-mianserin.png",
  feat: ["含有 {{benzene|結構|pyridine}} 結構",
    "右邊苯環之 6 號位：C（benzene）",
    "對 NET 之影響：{{NET inhibitor|機轉|無影響}}",
    "抗憂鬱之效果：",
    "- 僅在{{歐洲|名詞|美國}}使用，美國不使用",
    "- 造成{{顆粒性白血球缺乏症|副作用}}、白血球減少症",
    "備註：副作用太大，改用 Mirtazapine",
    "副作用：鎮靜、體重上升★，但不會影響性功能"] },
{ id: "mirtazapine", chapter: 3, name: "Mirtazapine", type: "drug", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42", img: "assets/medchem/ad-mirtazapine.png",
  feat: ["屬於 {{pyrazinopyridobenzazepine|結構}} 類抗憂鬱藥",
    "Mirt[u]aza[/u]pine 含有 {{pyridine|結構|benzene}} 結構",
    "右邊苯環之 6 號位：{{N|結構|C}}（pyridine）",
    "對 NET 之影響：{{無影響|性質|NET inhibitor}}",
    "抗憂鬱之效果：以 pyridine 取代苯環，造成：",
    "- 極性增加",
    "- 分配係數下降／水溶性↑",
    "- {{鹼度下降|性質|鹼度上升}}",
    "- NET 抑制劑活性較弱",
    "備註：具有含 N 之 pyridine（-aza-）",
    "副作用：鎮靜、{{體重上升|副作用|體重下降}}★，但不會影響性功能"],
  metab: ["2 號位上的 C 進行 {{N-desmethylation|代謝}}（代謝物具微弱活性）",
    "8 號位上的 C 水解後加上 OH 基，形成 {{8-hydroxy|代謝物}}mirtazapine（具微弱活性）",
    "N-oxide 之代謝產物{{無活性|性質|具微弱活性}}"] },

/* 七、MAOI > 不可逆、無選擇性之 MAOI 藥物個論 */
{ id: "phenelzine", chapter: 3, name: "Phenelzine", type: "drug", group: "不可逆、無選擇性之 MAOI 藥物個論", source: "統整（一）p.43", img: "assets/medchem/ad-phenelzine.png", imgMore: ["assets/medchem/ad-hydrazine.png"],
  feat: ["結構為 2-(phenylethyl)-hydrazine，為 {{Hydrazine|結構|non-Hydrazine}} 類的 MAOI"],
  metab: ["主要代謝物為 {{Phenylacetic acid|代謝物}} 及 p-hydroxyphenylacetic acid",
    "代謝物β-phenylethylamine 可能會提高腦中 {{GABA|物質}} 的濃度",
    "以 {{N-acetylation|代謝}} 的方式經尿液排出"] },
{ id: "tranylcypromine", chapter: 3, name: "Tranylcypromine", type: "drug", group: "不可逆、無選擇性之 MAOI 藥物個論", source: "統整（一）p.43", img: "assets/medchem/ad-tranylcypromine.png",
  feat: ["結構為(±)-[i]trans[/i]-2-phenylcyclopropylamine，為 {{non-Hydrazine|結構|Hydrazine}} 類的 MAOI",
    "為 {{Amphetamine|藥名}} 的 {{cyclopropyl|結構}} 衍生物",
    "[u]Tranylcypromine[/u] = [u]trans-form[/u] + [u]cyclopropyl[/u] + [u]amphetamine[/u] 衍生物"] },

/* MAOI > 可逆、具選擇性之 MAOI 藥物個論 */
{ id: "moclobemide", chapter: 3, name: "Moclobemide", type: "drug", group: "可逆、具選擇性之 MAOI 藥物個論", source: "統整（一）p.43", img: "assets/medchem/ad-moclobemide.png",
  feat: ["為 {{Benzamide|結構}} 的衍生物，且含有 {{Morpholine|結構}} 結構",
    "[u]Moclobemide[/u] = [u]morpholine[/u] + [i]para[/i]-[u]chloro[/u] + [u]benzamide[/u] 衍生物",
    "具有 {{MAO-A|標的|MAO-B}} 選擇性可避免嚴重{{高血壓|副作用|低血壓}}的副作用"] },

/* 八、情緒穩定劑：Lithium */
{ id: "lithium", chapter: 3, name: "Lithium", type: "drug", group: "情緒穩定劑（Mood Stabilizers）", source: "統整（一）p.43",
  feat: ["1. {{阻斷 IP turnover|機轉}}，減少 IP₃ 和 DAG 之合成，進而降低細胞興奮性",
    "2. 抑制 {{GSK-3|標的}} receptor（屬 Serine/Threonine protein kinase，與阿茲海默症、雙極症有關）",
    "3. 可抑制{{心臟傳導|器官}}，因此患有心臟疾病之患者應小心使用",
    "4. 使受體和其 G protein {{去偶合|機轉}}★，如使 TSH 受體失效造成甲狀腺功能低下、使 ADH 受體失效造成{{腎因性尿崩症|疾病}}"] },

/* ===== 第 4 章 神經疾病相關藥物（統整（一）肆，p.44–48）===== */
/* 照講義逐字：分類總表、合併使用之藥品、MPPP、作用位置圖放在告示牌（知識樹 ch4，沒有分類的卡片）；※ 註解放進各自的小白標。
   藥物格子的欄位照講義表格（特性／藥理及臨床用途）。講義兩個藥共用一格說明時，各自的格子都放；只講到其中一個藥的句子只放在那個藥。
   行首「- 」＝子項目、「> 」＝接續行，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 一、帕金森氏症：增加 Dopamine 合成 */
{ id: "levodopa", chapter: 4, name: "Levodopa", type: "drug", group: "增加 Dopamine 合成", source: "統整（一）p.45", img: "assets/medchem/pd-levodopa.png",
  feat: ["具有三級胺結構，可進入 BBB",
    "> （以 {{Active transport|名詞|Passive diffusion}} 分布到中樞）"],
  clin: ["Prodrug，{{脫羧|代謝}}★形成 Dopamine，口服空腹使用",
    "可併用 Carbidopa，避免 Levodopa 進入中樞前被分解",
    "與 Pyridoxine / {{Vit B₆|物質}} 併用會降低 Levodopa 進入中樞的濃度（因 Vit B₆ 可活化 decarboxylase）",
    "副作用：{{On-off phenomenon|副作用}}、厭食、失眠、棕色尿液"] },

/* 抑制 Dopamine 代謝 */
{ id: "carbidopa", chapter: 4, name: "Carbidopa", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/pd-carbidopa.png",
  feat: ["{{Hydrazine|結構}}★衍生物（-NHNH₂）",
    "立體組態：{{S(-) form|結構|R(+) form}}★"],
  clin: ["抑制{{週邊|位置|中樞}}★Dopamine decarboxylase →藥物不進入 BBB",
    "> （又稱 Aromatic L-amino acid decarboxylase）",
    "Sinemet®={{Levodopa|藥名}}+Carbidopa"] },
{ id: "entacapone", chapter: 4, name: "Entacapone", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/pd-entacapone.png",
  clin: ["抑制 {{COMT|酵素|MAO-B}} 分解 Dopamine，用做輔助治療",
    "與{{鐵劑|物質}}併服會降低藥物吸收，需隔開使用",
    "副作用：腹瀉、橘棕色尿液"] },
{ id: "tolcapone", chapter: 4, name: "Tolcapone", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/pd-tolcapone.png",
  clin: ["抑制 {{COMT|酵素|MAO-B}} 分解 Dopamine，用做輔助治療",
    "與鐵劑併服會降低藥物吸收，需隔開使用",
    "副作用：腹瀉、{{橘棕色尿液|副作用}}"] },
{ id: "selegiline", chapter: 4, name: "Selegiline", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/pd-selegiline.png",
  feat: ["基本結構：{{Propargylamine|結構}}★",
    "Selegiline 於 {{R(-)|結構|R(+)}} 時活性最大"],
  clin: ["{{不可逆|性質|可逆}}抑制 MAO-B※",
    "與 Levodopa 併用可能引發{{高血壓急症|副作用}}"] },
{ id: "rasagiline", chapter: 4, name: "Rasagiline", type: "drug", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", img: "assets/medchem/pd-rasagiline.png",
  feat: ["基本結構：{{Propargylamine|結構}}★",
    "Rasagiline 於 {{R(+)|結構|R(-)}} 時活性最大"],
  clin: ["不可逆抑制 {{MAO-B|酵素|MAO-A}}※",
    "與 Levodopa 併用可能引發高血壓急症"] },

/* 活化 Dopamine 受體 > 麥角生物鹼類 */
{ id: "bromocriptine", chapter: 4, name: "Bromocriptine", type: "drug", group: "麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-bromocriptine.png",
  clin: ["活化 D₂、D₃ →{{不活化 5-HT₂B|機轉|活化 5-HT₂B}}，不會造成心毒性",
    "可{{降低|性質|增加}}帕金森震顫（Tremor）的發生機率（震顫發生於{{休息靜止時|名詞}}）",
    "治療{{高泌乳血症|疾病}}、帕金森氏症、肢端肥大症",
    "具有強效抗膽鹼作用",
    "麥角生物鹼類較容易有{{肋膜及心包膜纖維化|副作用}}之副作用"] },
{ id: "lisuride", chapter: 4, name: "Lisuride", type: "drug", group: "麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-lisuride.png",
  clin: ["活化 D₂、D₃ →不活化 5-HT₂B，{{不會|性質|會}}造成心毒性",
    "可降低帕金森震顫（Tremor）的發生機率（震顫發生於休息靜止時）",
    "治療高泌乳血症、帕金森氏症、{{肢端肥大症|疾病}}",
    "具有強效{{抗膽鹼|機轉}}作用",
    "麥角生物鹼類較容易有肋膜及心包膜纖維化之副作用"] },
{ id: "pergolide", chapter: 4, name: "Pergolide", type: "drug", group: "麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-pergolide.png",
  clin: ["活化 D₂、D₃、{{5-HT₂B|受體}}（活化 5-HT₂B 會造成{{心毒性|副作用}}）",
    "Pergolide 由{{肝臟|器官|腎臟}}排除，半衰期長"] },
{ id: "cabergoline", chapter: 4, name: "Cabergoline", type: "drug", group: "麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-cabergoline.png",
  clin: ["活化 D₂、D₃、{{5-HT₂B|受體}}（活化 5-HT₂B 會造成心毒性）"] },

/* 活化 Dopamine 受體 > 非麥角生物鹼類 */
{ id: "pramipexole", chapter: 4, name: "Pramipexole", type: "drug", group: "非麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-pramipexole.png",
  clin: ["活化 {{D₂、D₃|受體|D₁、D₂}} 受體",
    "多巴胺 agonist 副作用：厭食、姿勢性低血壓、{{遲發性運動障礙|副作用}} Dyskinesia",
    "Pramipexole 由{{腎臟|器官|肝臟}}排除，併用 Cimetidine、FQ 抗生素會抑制其代謝"] },
{ id: "ropinirole", chapter: 4, name: "Ropinirole", type: "drug", group: "非麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-ropinirole.png",
  clin: ["活化 D₂、D₃ 受體",
    "多巴胺 agonist 副作用：厭食、{{姿勢性低血壓|副作用}}、遲發性運動障礙 Dyskinesia"] },
{ id: "rotigotine", chapter: 4, name: "Rotigotine", type: "drug", group: "非麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-rotigotine.png",
  clin: ["Rotigotine 可活化 {{D₁、D₂、D₃|受體|D₁、D₂}} 受體"] },
{ id: "apomorphine", chapter: 4, name: "Apomorphine", type: "drug", group: "非麥角生物鹼類", source: "統整（一）p.46", img: "assets/medchem/pd-apomorphine.png",
  clin: ["Apomorphine 可活化 {{D₁、D₂|受體|D₁、D₂、D₃}} 受體",
    "Apomorphine 立體組態：{{R(-)|結構|S(+)}} form★"] },

/* 降低 ACh 活性 > 阻斷中樞毒蕈鹼受體（講義只有結構，說明在小白標） */
{ id: "benztropine", chapter: 4, name: "Benztropine", type: "drug", group: "阻斷中樞毒蕈鹼受體", source: "統整（一）p.47", img: "assets/medchem/pd-benztropine.png" },
{ id: "biperidine", chapter: 4, name: "Biperiden", type: "drug", group: "阻斷中樞毒蕈鹼受體", source: "統整（一）p.47", img: "assets/medchem/pd-biperiden.png" },
{ id: "trihexyphenidyl", chapter: 4, name: "Trihexyphenidyl", type: "drug", group: "阻斷中樞毒蕈鹼受體", source: "統整（一）p.47", img: "assets/medchem/pd-trihexyphenidyl.png" },

/* 降低 ACh 活性 > 第一代 H₁-blockers */
{ id: "ethopropazine", chapter: 4, name: "Ethopropazine", type: "drug", group: "第一代 H₁-blockers", source: "統整（一）p.47", img: "assets/medchem/pd-ethopropazine.png",
  feat: ["{{Phenothiazine|結構|Aminoalkyl ether}}★衍生物"] },
{ id: "diethazine", chapter: 4, name: "Diethazine", type: "drug", group: "第一代 H₁-blockers", source: "統整（一）p.47", img: "assets/medchem/pd-diethazine.png",
  feat: ["{{Phenothiazine|結構|Aminoalkyl ether}} 衍生物"] },
{ id: "diphenhydramine", chapter: 4, name: "Diphenhydramine", type: "drug", group: "第一代 H₁-blockers", source: "統整（一）p.47", img: "assets/medchem/pd-diphenhydramine.png",
  feat: ["{{Aminoalkyl ether|結構|Phenothiazine}} 類"] },

/* 促進 Dopamine 釋放 > Adenosine A₂A antagonist */
{ id: "amantadine", chapter: 4, name: "Amantadine", type: "drug", group: "Adenosine A₂A antagonist", source: "統整（一）p.47", img: "assets/medchem/pd-amantadine.png",
  clin: ["抑制毒蕈鹼、{{NMDA 受體|受體}}",
    "也當作{{抗病毒藥|用途}}",
    "副作用：{{網狀青斑|副作用}}"] },
{ id: "istradefylline", chapter: 4, name: "Istradefylline", type: "drug", group: "Adenosine A₂A antagonist", source: "統整（一）p.47", img: "assets/medchem/pd-istradefylline.png",
  feat: ["具有 {{Xanthine|結構}}★結構"] },
{ id: "sarizotan", chapter: 4, name: "Sarizotan", type: "drug", group: "Adenosine A₂A antagonist", source: "統整（一）p.47", img: "assets/medchem/pd-sarizotan.png",
  clin: ["同時是 {{5-HT₁A agonist|機轉}}、D₂ partial agonist"] },

/* 二、阿茲海默症 > 可逆型膽鹼酯酶抑制劑 */
{ id: "donepezil", chapter: 4, name: "Donepezil", type: "drug", group: "可逆型膽鹼酯酶抑制劑：皆有三級胺結構，可穿過 BBB 增加 ACh 濃度", source: "統整（一）p.48", img: "assets/medchem/az-donepezil.png",
  feat: ["具有 {{piperidine|結構}} 結構"],
  clin: ["商品名 Aricept®（愛憶欣）",
    "過量時可使用 {{Atropine|藥名}} 作為解毒劑"] },
{ id: "galantamine", chapter: 4, name: "Galantamine", type: "drug", group: "可逆型膽鹼酯酶抑制劑：皆有三級胺結構，可穿過 BBB 增加 ACh 濃度", source: "統整（一）p.48", img: "assets/medchem/az-galantamine.png",
  feat: ["{{天然生物鹼|名詞}}，結構類似 {{Codeine|藥名|Atropine/Tacrine}}"],
  clin: ["商品名 Reminyl®（利憶靈）"] },
{ id: "rivastigmine", chapter: 4, name: "Rivastigmine", type: "drug", group: "可逆型膽鹼酯酶抑制劑：皆有三級胺結構，可穿過 BBB 增加 ACh 濃度", source: "統整（一）p.48", img: "assets/medchem/az-rivastigmine.png",
  feat: ["具有 {{Carbamyl|結構}} group"],
  clin: ["商品名 Exelon®（憶思能）"] },
{ id: "tacrine", chapter: 4, name: "Tacrine", type: "drug", group: "可逆型膽鹼酯酶抑制劑：皆有三級胺結構，可穿過 BBB 增加 ACh 濃度", source: "統整（一）p.48", img: "assets/medchem/az-tacrine.png",
  feat: ["具有 {{Tetrahydroacridine|結構}} 結構",
    "{{活性|性質|無活性}}代謝物：1-hydroxytacrine"],
  clin: ["因{{肝毒性|副作用}}副作用，現已下市"] },

/* 阿茲海默症 > NMDA 受體拮抗劑 */
{ id: "memantine", chapter: 4, name: "Memantine", type: "drug", group: "NMDA 受體拮抗劑（NMDA antagonist）", source: "統整（一）p.48", img: "assets/medchem/az-memantine.png",
  clin: ["可阻斷因 {{Glutamate|物質|GABA}} 強度升高所導致的神經障礙",
    "用於治療阿茲海默症（比較：{{Amantadine|藥名}} 用於治療帕金森氏症）"] },

/* 三、亨廷頓舞蹈症（講義這兩格的結構圖印錯成 Donepezil、Galantamine，改用正確結構） */
{ id: "tetrabenazine", chapter: 4, name: "Tetrabenazine", type: "drug", group: "治療藥物：降低 Dopamine 的濃度", source: "統整（一）p.48", img: "assets/medchem/hd-tetrabenazine.png",
  clin: ["{{Dopamine 排空劑|機轉}}"] },
{ id: "clozapine", chapter: 4, name: "Clozapine", type: "drug", group: "治療藥物：降低 Dopamine 的濃度", source: "統整（一）p.48", img: "assets/medchem/clozapine-ap.png",
  clin: ["{{非典型|藥物類別|典型}}抗精神病藥物"] },

/* ===== 第 5 章 抗精神病藥物（統整（一）伍 精神疾病相關藥物，p.49–62）===== */
/* 照講義逐字：疾病介紹、副作用總整理、總整理放在告示牌（知識樹 ch5，沒有分類的卡片）；各類的分類表、SAR、※ 註解放進各自的小白標。
   藥物格子的欄位照講義表格（特性／藥理及臨床應用）；p.58「結構補充」欄的結構放在格子的結構圖旁邊（imgMore）。
   行首「- 」＝子項目、「> 」＝接續行，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 一、第一代：Phenothiazine（PTZ）類衍生物 > Aliphatic 直鏈衍生物 */
{ id: "chlorpromazine", chapter: 5, name: "Chlorpromazine", type: "drug", group: "Aliphatic 直鏈衍生物（字尾-promazine）", source: "統整（一）p.52", img: "assets/medchem/ap-chlorpromazine.png",
  use: ["（CPZ）"],
  feat: ["2 號位上有 {{Cl|取代基|CF₃}} 取代基",
    "10 號位有 propyldimethylamino group（{{三級胺|結構|二級胺}}）",
    "為了模仿 Dopamine 的構型，直鏈胺基支鏈會{{偏向含有氯取代的環|結構}}",
    "代謝：由 {{CYP2D6|酵素}} 進行 C₇-Hydroxylation（箭頭處）；",
    "> {{Sulfoxide|代謝物}} 代謝物沒有活性★"],
  pharm: ["{{鎮靜|副作用}}副作用最強",
    "具有{{光敏感性|性質}}"] },
{ id: "triflupromazine", chapter: 5, name: "Triflupromazine", type: "drug", group: "Aliphatic 直鏈衍生物（字尾-promazine）", source: "統整（一）p.52", img: "assets/medchem/ap-triflupromazine.png",
  feat: ["2 號位上有 {{CF₃|取代基|Cl}} 取代基"] },

/* PTZ > Piperidine 衍生物 */
{ id: "thioridazine", chapter: 5, name: "Thioridazine", type: "drug", group: "Piperidine 衍生物（字尾-ridazine）", source: "統整（一）p.52", img: "assets/medchem/ap-thioridazine.png",
  feat: ["2 號位上有 {{-SCH₃|取代基|-CF₃/-Cl}} 取代基",
    "Thioridazine [u]氧化[/u]代謝為{{兩倍活性代謝物|代謝物}} Mesoridazine",
    "代謝後多巴胺受體效價從 10nM→4nM",
    "> （藥物會拮抗多巴胺受體）"] },
{ id: "mesoridazine", chapter: 5, name: "Mesoridazine", type: "drug", group: "Piperidine 衍生物（字尾-ridazine）", source: "統整（一）p.52", img: "assets/medchem/ap-mesoridazine.png",
  feat: ["Thioridazine [u]氧化[/u]代謝為兩倍活性代謝物 {{Mesoridazine|藥名|Thioridazine}}",
    "代謝後多巴胺受體效價從 {{10nM→4nM|數值}}",
    "> （藥物會拮抗多巴胺受體）"],
  pharm: ["※ meso：甲基接在 {{S|結構|N}} 上"] },

/* PTZ > Piperazine 衍生物 */
{ id: "perphenazine", chapter: 5, name: "Perphenazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-perphenazine.png",
  feat: ["Piperazine 末端有-NCH₂CH₂{{OH|取代基|CH₃}}",
    "2 號位上有 {{Cl|取代基|CF₃}} 取代基",
    "> （結構與 chlorpromazine 相似）"],
  pharm: ["末端 OH 可做成[u]脂肪酸鹽類[/u]：",
    "> Perphenazine {{enanthate|名詞}}",
    "→ {{長效 IM 注射|給藥途徑}}"] },
{ id: "fluphenazine", chapter: 5, name: "Fluphenazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-fluphenazine.png",
  feat: ["Piperazine 末端有-NCH₂CH₂OH",
    "2 號位上有 {{CF₃|取代基|Cl}}★取代基",
    "> （結構與 triflupromazine 相似）"],
  pharm: ["末端 OH 可做成[u]酯類前驅藥[/u]：",
    "> Fluphenazine {{decanoate|名詞}}/enanthate",
    "→ 長效 IM 注射★",
    "{{高效價|性質|低效價}}，有嚴重錐體外作用(EPS)"] },
{ id: "trifluperazine", chapter: 5, name: "Trifluperazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-trifluperazine.png",
  feat: ["Piperazine 末端有-{{CH₃|取代基|OH}}",
    "結構與 {{Fluphenazine|藥名}} 相似"],
  pharm: ["高效價，有嚴重{{錐體外作用(EPS)|副作用}}"] },
{ id: "prochlorperazine", chapter: 5, name: "Prochlorperazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-prochlorperazine.png",
  feat: ["末端有-{{CH₃|取代基|OH}}，結構與 Perphenazine 相似"] },
{ id: "thiethylperazine", chapter: 5, name: "Thiethylperazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-thiethylperazine.png",
  feat: ["末端有-CH₃，結構與 {{Thioridazine|藥名|Perphenazine}} 相似"] },
{ id: "acetophenazine", chapter: 5, name: "Acetophenazine", type: "drug", group: "Piperazine 衍生物（末端 OH 字尾-phenazine；末端 CH₃ 字尾-perazine）", source: "統整（一）p.53", img: "assets/medchem/ap-acetophenazine.png",
  feat: ["末端含 {{OH|取代基|CH₃}} 基"] },

/* 第一代：Thioxanthene 類衍生物 */
{ id: "thiothixene", chapter: 5, name: "Thiothixene", type: "drug", group: "第一代精神疾病藥物：Thioxanthene 類衍生物（名字中有-thix-）", source: "統整（一）p.54", img: "assets/medchem/ap-thiothixene.png",
  feat: ["具有 {{Sulfonamide|結構}} 結構",
    "{{cis form（Z form）|結構|trans form（E form）}} 的活性較強",
    "可製成 hydrochloride 鹽類"] },
{ id: "flupenthixol", chapter: 5, name: "Flupenthixol", type: "drug", group: "第一代精神疾病藥物：Thioxanthene 類衍生物（名字中有-thix-）", source: "統整（一）p.54", img: "assets/medchem/ap-flupenthixol.png",
  feat: ["末端 piperazine 上的 OH 可被做成脂肪酸鹽類 Flupenthixol {{decanoate|名詞}}",
    "用於{{長效 IM 注射|給藥途徑}}"] },

/* 第一代：Butyrophenone 類衍生物 */
{ id: "haloperidol", chapter: 5, name: "Haloperidol", type: "drug", group: "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）", source: "統整（一）p.55", img: "assets/medchem/ap-haloperidol.png",
  use: ["（Halo：含 F、Cl [u]兩種[/u]鹵素）"],
  feat: ["R group 有 {{OH|取代基|C=O}} 基團（-peridol）",
    "具有 [u]Fluorobutyrophenone[/u] 結構",
    "Piperidine 與羰基相隔 {{3C|數值}} 時，活性最強",
    "苯環的{{對位|位置}}有 F 取代→減少藥物被代謝去活化",
    "代謝：高低劑量有不同代謝酵素",
    "> CYP3A4(高)、{{CYP2D6|酵素}}(低)、CYP1A2(抽菸)",
    "代謝物 [i]p[/i]-fluorophenylacetic acid 和 {{glycine|物質}} 結合"],
  pharm: ["{{高效價|性質|低效價}}，有最嚴重錐體外作用(EPS)",
    "可製成脂肪酸鹽類 decanoate",
    "→ 長效 IM 注射",
    "遲發性運動困難 {{Tardive dyskinesia|副作用}}",
    "> 代謝後產物[u]不可逆烷化[/u] D₂ 受體，使受體過度敏感而讓運動機能亢進",
    "也會造成{{高泌乳素血症|副作用}}★"] },
{ id: "droperidol", chapter: 5, name: "Droperidol", type: "drug", group: "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）", source: "統整（一）p.55", img: "assets/medchem/ap-droperidol.png",
  feat: ["R group 有 {{C=O|取代基|OH}} 基團（Droperidol）",
    "具有 [u]Fluorobutyrophenone[/u] 結構",
    "具有 tetrahydropyridine 結構（有{{雙鍵|結構}}）",
    "具有 {{imidazolone|取代基}} 取代基"],
  pharm: ["{{短效型|作用時間|長效型}}★，還有鎮靜、麻醉、止吐的作用，用於麻醉前之處理",
    "麻醉時會與止痛藥 {{Fentanyl|藥名}} 並用"] },
{ id: "trifluperidol", chapter: 5, name: "Trifluperidol", type: "drug", group: "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）", source: "統整（一）p.55", img: "assets/medchem/ap-trifluperidol.png",
  feat: ["R group 含 {{-OH|取代基|C=O}}"] },
{ id: "spiperone", chapter: 5, name: "Spiperone", type: "drug", group: "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）", source: "統整（一）p.55", img: "assets/medchem/ap-spiperone.png",
  feat: ["R group 含 {{C=O|取代基|-OH}}",
    "具有 {{Spiro 螺環|結構}}結構"] },

/* 第一代：Diphenylbutyl piperidine 類衍生物 */
{ id: "pimozide", chapter: 5, name: "Pimozide", type: "drug", group: "第一代精神疾病藥物：Diphenylbutyl piperidine 類衍生物", source: "統整（一）p.56", img: "assets/medchem/ap-pimozide.png",
  feat: ["結構與 {{Droperidol|藥名}} 相似，差異在 piperidine 及 C=O 基被取代為 4-Fluorophenyl",
    "→ 具有 {{di-4-fluorophenylmethane|結構}} 結構"],
  pharm: ["治療 {{Tourette syndrome|疾病}}"] },
{ id: "penfluridol", chapter: 5, name: "Penfluridol", type: "drug", group: "第一代精神疾病藥物：Diphenylbutyl piperidine 類衍生物", source: "統整（一）p.56", img: "assets/medchem/ap-penfluridol.png",
  feat: ["結構中共有{{五個|數值|四個}} F 原子（[u]Pentaflu[/u]ridol）"] },
{ id: "fluspirilene", chapter: 5, name: "Fluspirilene", type: "drug", group: "第一代精神疾病藥物：Diphenylbutyl piperidine 類衍生物", source: "統整（一）p.56", img: "assets/medchem/ap-fluspirilene.png",
  feat: ["具有{{螺環（Spiro）|結構}}結構",
    "結構與 {{Spiperone|藥名}} 相似"] },

/* 第一代：Benzamide 類衍生物 */
{ id: "metoclopramide", chapter: 5, name: "Metoclopramide", type: "drug", group: "第一代精神疾病藥物：Benzamide 類衍生物", source: "統整（一）p.57", img: "assets/medchem/ap-metoclopramide.png",
  feat: ["{{Benzamide|結構}}★衍生物",
    "苯環上有 {{Cl|取代基}} 取代（Meto[u]clo[/u]pramide）"],
  pharm: ["D₂ 受體拮抗劑：",
    "> 抗精神病、最常用的{{止吐藥|用途}}★",
    "增加胃的收縮力，可{{促進腸胃蠕動|用途}}★與胃部排空（Promeran®）"] },

/* Benzamide > 末端環化成 pyrrolidine */
{ id: "sulpiride", chapter: 5, name: "S-(-)-Sulpiride", short: "Sulpiride", type: "drug", group: "末端環化成 pyrrolidine，字尾-piride", source: "統整（一）p.57", img: "assets/medchem/ap-sulpiride.png",
  feat: ["具有 {{Sulfonamide|結構|Sulfone}}、Benzamide 結構"],
  pharm: ["{{水溶性高|性質|脂溶性高}}，難以通過 BBB",
    "→ 口服吸收率低，效價低",
    "錐體外副作用較{{小|性質|大}}"] },
{ id: "amisulpiride", chapter: 5, name: "Amisulpride", type: "drug", group: "末端環化成 pyrrolidine，字尾-piride", source: "統整（一）p.57", img: "assets/medchem/ap-amisulpiride.png",
  feat: ["為 Sulpiride 之{{對位胺基|取代基}}-外消旋同類物",
    "> （racemic para-[u]amino[/u] congener）",
    "具有 {{Sulfone|結構|Sulfonamide}} 結構"] },
{ id: "remoxipride", chapter: 5, name: "Remoxipride", type: "drug", group: "末端環化成 pyrrolidine，字尾-piride", source: "統整（一）p.57", img: "assets/medchem/ap-remoxipride.png",
  feat: ["苯環上有 {{Br|取代基|Cl}} 取代"],
  pharm: ["效價與 [u]Haloperidol[/u] 相似，但錐體外作用、自主神經副作用較少",
    "造成{{再生不良性貧血|副作用}}，已下市",
    "> （Aplastic anemia）"] },

/* 二、第二代：Miscellaneous 雜類藥物（結構補充欄的結構放在 imgMore） */
{ id: "aripiprazole-ap", chapter: 5, name: "Aripiprazole", type: "drug", group: "第二代精神疾病藥物：Miscellaneous 雜類藥物", source: "統整（一）p.58", img: "assets/medchem/ap-aripiprazole.png", imgMore: ["assets/medchem/ap-quinolinone.png"],
  use: ["精神病、抗憂鬱"],
  feat: ["{{Arylpiperazine quinolinone|結構}}★衍生物",
    "> Aryl-表示芳香環上具有取代基，表示{{芳香環上有 piperazine 取代|結構}}"] },
{ id: "molindone", chapter: 5, name: "Molindone", type: "drug", group: "第二代精神疾病藥物：Miscellaneous 雜類藥物", source: "統整（一）p.58", img: "assets/medchem/ap-molindone.png", imgMore: ["assets/medchem/ap-morpholine.png", "assets/medchem/ap-tetrahydroindole.png"],
  feat: ["Tetrahydro-indole 的{{酮類|結構}}衍生物",
    "> （六元環上的[u]兩個[/u]雙鍵被飽和）",
    "與 {{Ondansetron|藥名}}★同屬β-aminoketones★",
    "> （Ondansetron 為 5-HT₃ 拮抗劑，用於止吐）",
    "具有 {{Morpholine|結構|Piperazine}} 取代基"] },
{ id: "sertindole", chapter: 5, name: "Sertindole", type: "drug", group: "第二代精神疾病藥物：Miscellaneous 雜類藥物", source: "統整（一）p.58", img: "assets/medchem/ap-sertindole.png", imgMore: ["assets/medchem/ap-indole.png", "assets/medchem/ap-imidazolinone.png"],
  feat: ["{{Indole|結構}} 結構之衍生物（Sert[u]indole[/u]）",
    "具有 imidazolin-2-one 取代基",
    "具有 {{piperidine|結構|piperazine}} 結構",
    "> 比較 Aripiprazole 含有 piperazine 結構",
    "和血清素（Serotonin）有類似結構（[u]Sert[/u]indole）"] },

/* 第二代：Benzazepine 類衍生物 */
{ id: "clozapine-ap", chapter: 5, name: "Clozapine", type: "drug", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.59", img: "assets/medchem/ap-clozapine.png",
  use: ["（Clozaril®）"],
  feat: ["為 [u]Dibenzodiazepine[/u]★結構",
    "苯環上有 {{8-Cl|取代基|2-Cl}} 取代（[u]Clo[/u]zapine）",
    "為第二代藥物之{{原型|名詞}}（Prototype）"],
  pharm: ["為多種 GPCRs 之拮抗劑",
    "對 {{D₄|受體|D₂}} 受體有高親和性 →{{EPS 最少|副作用}}",
    "長期使用不會造成 Tardive dyskinesia",
    "副作用：",
    "> {{顆粒性白血球缺乏|副作用}} Agranulocytosis、體重增加、鎮靜、癲癇"] },
{ id: "olanzapine", chapter: 5, name: "Olanzapine", type: "drug", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.59", img: "assets/medchem/ap-olanzapine.png",
  feat: ["為 {{Thienobenzodiazepine|結構}} 結構",
    "含有 {{Thiophene|結構}} 結構",
    "多由 {{CYP1A2|酵素|CYP3A4}} 代謝"],
  pharm: ["對 D₂ 和 {{5-HT₂A|受體}} 受體有高親和力",
    "{{體重增加|副作用}}副作用最明顯★",
    "副作用與 Clozapine 相似，但不會造成顆粒性白血球缺乏"] },
{ id: "loxapine", chapter: 5, name: "Loxapine", type: "drug", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.60", img: "assets/medchem/ap-loxapine.png",
  feat: ["為 [u]Dibenzoxazepine[/u] 結構",
    "苯環上有 {{2-Cl|取代基|8-Cl}} 取代"],
  pharm: ["對 D₂ 和 5-HT₁、H₁ 受體有高親和力，但為弱的 {{M₁|受體}} 拮抗劑",
    "活性代謝物對 D₂ 的親和力[u]更強[/u]",
    "N-去甲基後的代謝物 {{Amoxapine|藥名}} 被用作抗憂鬱藥物"] },
{ id: "quetiapine", chapter: 5, name: "Quetiapine", type: "drug", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.60", img: "assets/medchem/ap-quetiapine.png",
  feat: ["為 [u]Dibenzothiazepine[/u] 結構",
    "多由 {{CYP3A4|酵素|CYP1A2}} 代謝",
    "活性代謝物：{{7-hydroxy|代謝物}}quetiapine"],
  pharm: ["對 {{H₁|受體}} 受體有高度親和力；",
    "> 對 D₂/₃、5-HT₂A 有中度親和力；",
    "> 對 M₁ 為{{弱的拮抗劑|機轉}}（因側鏈非甲基）"] },
{ id: "asenapine", chapter: 5, name: "Asenapine", type: "drug", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.60", img: "assets/medchem/ap-asenapine.png",
  feat: ["為 {{Dihydrodibenzoxepine|結構}} 結構",
    "苯環上有 Cl 取代",
    "由 piperazine 變成 {{pyrrolidine-fused|結構}} 結構",
    "→ 沒有 piperazine ring"],
  pharm: ["對 {{5-HT|受體}} 受體有超高親和力",
    "副作用：EPS 較預期輕微，體重增加狀況較 Olanzapine 少",
    "經腎臟、糞便排除"] },

/* 第二代：Benzisoxazole/Benzisothiazole > Benzisoxazole 類衍生物 */
{ id: "risperidone", chapter: 5, name: "Risperidone", type: "drug", group: "Benzisoxazole 類衍生物（-peridone）", source: "統整（一）p.61", img: "assets/medchem/ap-risperidone.png",
  feat: ["Risperidone：R=H",
    "> Paliperidone：R=OH",
    "Risperidone 經 {{9-hydroxylation|代謝}} 後，",
    "> 變成{{活性代謝物|代謝物}} Paliperidone",
    "主要由 CYP2D6/3A4 代謝"],
  pharm: ["兩者之半衰期約為 {{22|數值}} 小時",
    "最容易發生{{高泌乳血症|副作用}}"] },
{ id: "paliperidone", chapter: 5, name: "Paliperidone", type: "drug", group: "Benzisoxazole 類衍生物（-peridone）", source: "統整（一）p.61", img: "assets/medchem/ap-risperidone.png",
  feat: ["Risperidone：R=H",
    "> Paliperidone：R={{OH|取代基|H}}",
    "Risperidone 經 9-hydroxylation 後，",
    "> 變成活性代謝物 Paliperidone",
    "主要由 {{CYP2D6/3A4|酵素}} 代謝"],
  pharm: ["兩者之半衰期約為 22 小時",
    "最容易發生{{高泌乳血症|副作用}}"] },
{ id: "iloperidone", chapter: 5, name: "Iloperidone", type: "drug", group: "Benzisoxazole 類衍生物（-peridone）", source: "統整（一）p.61", img: "assets/medchem/ap-iloperidone.png",
  feat: ["結構與 GPCR 結合位皆與 {{Risperidone|藥名}} 相似",
    "主要由 CYP3A4、CYP2D6 代謝",
    "→ {{O-demethylation|代謝}} 產生活性代謝物"],
  pharm: ["藥效與 Haloperidol、Risperidone、Ziprasidone 等其他抗精神病藥物相似"] },

/* Benzisoxazole/Benzisothiazole > Benzisothiazole 類衍生物 */
{ id: "ziprasidone", chapter: 5, name: "Ziprasidone", type: "drug", group: "Benzisothiazole 類衍生物（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/ap-ziprasidone.png",
  feat: ["R group 具有 {{Cl|取代基}} 取代基",
    "主要由 CYP3A4、{{Aldehyde oxidase|酵素}} 進行代謝"],
  pharm: ["口服生體可用率約 60%，與{{脂肪類食物|物質}}併服可增加吸收",
    "體重增加作用[u]最不[/u]明顯"] },
{ id: "lurasidone", chapter: 5, name: "Lurasidone", type: "drug", group: "Benzisothiazole 類衍生物（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/ap-lurasidone.png", imgMore: ["assets/medchem/ap-succinimide-norbornane.png"],
  feat: ["側鏈由 {{Succinimide|結構}} 和 {{Norbornane|結構}} 兩個環狀結構融合而成",
    "主要由 CYP3A4 代謝"],
  pharm: ["半衰期約 {{18|數值}} 小時，適合做成每日服用一次的劑型",
    "> （Once-daily dosing）"] },
{ id: "perospirone", chapter: 5, name: "Perospirone", type: "drug", group: "Benzisothiazole 類衍生物（-rasidone）", source: "統整（一）p.62", img: "assets/medchem/ap-perospirone.png",
  use: ["（補充）"],
  pharm: ["在{{日本|名詞}}上市"] },

/* ===== 第 6 章 肌肉鬆弛劑及抗痙攣藥物（統整（一）陸，p.63–67）===== */
/* 照講義逐字：※ 註解放進各自的小白標。藥物格子的欄位照講義表格（特性／藥理及臨床應用）；
   特性欄裡畫的結構（Meprobamate、Carisoprodol 的骨架式、Amitriptyline、GABA、Clonidine）放在格子結構圖旁（imgMore）。
   講義黑底「骨骼肌鬆弛劑」底下：中樞性的四類用第三層小標掛在黑底下；抗 Nm 受體藥物本身又分三類，
   地圖只有兩層，所以抗 Nm 受體藥物自成一類、底下再分非去極化／類固醇／去極化。
   行首「- 」＝子項目、「> 」＝接續行，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 骨骼肌鬆弛劑 > Glycerol Monoethers 類衍生物 */
{ id: "antodyne", chapter: 6, name: "Antodyne", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/mr-antodyne.png",
  feat: ["結構為 3-{{phenoxy|取代基}}-1,2-propanediol"],
  pharm: ["為本類藥物之{{原型|名詞}} Prototype",
    "具有{{鎮痛|用途}} Analgesic、退燒 Antipyretics 的作用，但肌肉鬆弛效果{{太短暫|性質}}，在臨床上並不好用"] },
{ id: "mephenesin", chapter: 6, name: "Mephenesin", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/mr-mephenesin.png",
  feat: ["屬於 {{Glycerol monoether|結構}}★衍生物",
    "結構比 Antodyne 多一個{{甲基|取代基}}",
    "→ 苯環的 {{ortho|位置|para/meta}} 位多一個甲基"] },
{ id: "chlorphenesin-carbamate", chapter: 6, name: "Chlorphenesin carbamate", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/mr-chlorphenesin.png",
  feat: ["具有 {{carbamate|結構}} 結構（圈起來的）",
    "苯環的 {{para|位置|ortho/meta}} 位有 Cl 取代"],
  pharm: ["為 Mephenesin 的 {{carbamate analog|名詞}}，較為{{長效|作用時間|短效}}"] },
{ id: "methocarbamol", chapter: 6, name: "Methocarbamol", type: "drug", group: "Glycerol Monoethers 類衍生物", source: "統整（一）p.63", img: "assets/medchem/mr-methocarbamol.png",
  feat: ["具有 carbamate 結構",
    "苯環的 {{ortho|位置|para/meta}} 位有{{甲氧基|取代基}}",
    "標示★為 chiral center",
    "→ 實驗測得 {{R form|結構|S form}} 活性較佳"],
  pharm: ["為 Mephenesin 的 carbamate analog，較為長效",
    "市售多為{{消旋|性質}} Racemic"] },

/* 骨骼肌鬆弛劑 > Substituted Alkanediols 類衍生物 */
{ id: "meprobamate", chapter: 6, name: "Meprobamate", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/mr-meprobamate.png", imgMore: ["assets/medchem/mr-meprobamate-skeletal.png"],
  feat: ["結構：具有{{兩個|數值|一個}} carbamate"],
  pharm: ["為 {{Carisoprodol|藥名}} 之代謝產物",
    "BZD 藥物之{{鎮靜安眠|用途}}作用",
    "→ 常被依賴與濫用"] },
{ id: "carisoprodol", chapter: 6, name: "Carisoprodol", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/mr-carisoprodol.png", imgMore: ["assets/medchem/mr-carisoprodol-skeletal.png"],
  feat: ["結構：具有 isopropyl、{{biscarbamate|結構}}",
    "與 Meprobamate 只相差在其中一個 carbamate 的 N 上 H 取代為{{異丙基|取代基}}"],
  pharm: ["代謝：經 {{N-dealkylation|代謝}} 代謝後變成 {{Meprobamate|代謝物}}",
    "有類似 BZD 藥物之鎮靜安眠作用",
    "→ 常被{{依賴與濫用|副作用}}"] },
{ id: "metaxalone", chapter: 6, name: "Metaxalone", type: "drug", group: "Substituted Alkanediols 類衍生物", source: "統整（一）p.64", img: "assets/medchem/mr-metaxalone.png",
  feat: ["具有 {{oxazolidin-2-one|結構}} 結構",
    "苯環的兩個 {{meta|位置|ortho/para}} 位具有甲基"],
  pharm: ["{{無|性質|有}}濫用情況"] },

/* 骨骼肌鬆弛劑 > Benzoxazole 類衍生物 */
{ id: "chlorzoxazone", chapter: 6, name: "Chlorzoxazone", type: "drug", group: "Benzoxazole 類衍生物", source: "統整（一）p.65", img: "assets/medchem/mr-chlorzoxazone.png",
  feat: ["具有 {{oxazolidin-2-one|結構}} 結構",
    "Cl 取代基接在相對於 O 之{{苯環對位|位置}}"],
  pharm: ["市售常見的肌肉鬆弛劑",
    "是否有{{解痙攣|用途}}的功能仍未知"] },

/* 骨骼肌鬆弛劑 > Miscellaneous 雜類藥物 */
{ id: "orphenadrine", chapter: 6, name: "Orphenadrine", type: "drug", group: "Miscellaneous 雜類藥物（肌肉鬆弛劑）", source: "統整（一）p.65", img: "assets/medchem/mr-orphenadrine.png",
  feat: ["結構：{{ethanolamine ether|結構}}"],
  pharm: ["屬 {{diphenhydramine|藥名}} 類{{抗組織胺|藥物類別}}藥物",
    "→ 副作用：頭暈、嗜睡",
    "具有 CNS {{抗膽鹼|機轉}}作用",
    "→ 副作用：口乾"] },
{ id: "cyclobenzaprine", chapter: 6, name: "Cyclobenzaprine", type: "drug", group: "Miscellaneous 雜類藥物（肌肉鬆弛劑）", source: "統整（一）p.65", img: "assets/medchem/mr-cyclobenzaprine.png", imgMore: ["assets/medchem/mr-amitriptyline.png"],
  feat: ["結構與 {{Amitriptyline|藥名}}※非常類似（見下方結構），僅相差在七元環上的{{雙鍵|結構}}"],
  pharm: ["有明顯的{{抗膽鹼|機轉}}作用",
    "為 {{5-HT₂ 受體拮抗劑|機轉}}，所以有肌肉鬆弛的效果，但不是很強",
    "{{沒有|性質|有}}抗憂鬱的作用"] },

/* 抗 Nm 受體藥物 > 非去極化型尼古丁受體拮抗劑 */
{ id: "d-tubocurarine", chapter: 6, name: "d-Tubocurarine", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）", source: "統整（一）p.66", img: "assets/medchem/mr-d-tubocurarine.png" },
{ id: "atracurium", chapter: 6, name: "Atracurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）", source: "統整（一）p.66", img: "assets/medchem/mr-atracurium.png",
  pharm: ["經由 [u]Hofmann degradation[/u]★代謝，形成 {{Laudanosine|代謝物}}★",
    "也會經由 {{BuchE|酵素}} 代謝",
    "適合用於{{肝腎疾病|疾病}}之患者★"] },
{ id: "mivacurium", chapter: 6, name: "Mivacurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）", source: "統整（一）p.66", img: "assets/medchem/mr-mivacurium.png",
  pharm: ["經由 {{BuchE|酵素}} 代謝",
    "適合用於{{肝腎疾病|疾病}}之患者★"] },
{ id: "doxacurium", chapter: 6, name: "Doxacurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）", source: "統整（一）p.66", img: "assets/medchem/mr-doxacurium.png" },

/* 抗 Nm 受體藥物 > 類固醇尼古丁受體拮抗劑 */
{ id: "pancuronium", chapter: 6, name: "Pancuronium", type: "drug", group: "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）", source: "統整（一）p.66", img: "assets/medchem/mr-pancuronium.png",
  feat: ["具有 {{5α-Androstane steroid|結構}} 骨架"] },
{ id: "vecuronium", chapter: 6, name: "Vecuronium", type: "drug", group: "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）", source: "統整（一）p.66", img: "assets/medchem/mr-vecuronium.png",
  use: ["★"],
  feat: ["具有 {{5α-Androstane|結構}} steroid 骨架"] },

/* 抗 Nm 受體藥物 > 去極化性阻斷劑 */
{ id: "succinylcholine", chapter: 6, name: "Succinylcholine", type: "drug", group: "去極化性阻斷劑（非競爭型）", source: "統整（一）p.66", img: "assets/medchem/mr-succinylcholine.png",
  feat: ["為 {{Acetylcholine|物質}} 的雙體結構",
    "> （{{diquaternary ammonium ester|結構}}）"],
  pharm: ["半衰期{{極短|性質|極長}}"] },

/* 抗痙攣劑 */
{ id: "msr-diazepam", chapter: 6, name: "Diazepam", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/mr-diazepam.png",
  feat: ["屬於 {{Benzodiazepines|藥物類別}} 類藥物"],
  pharm: ["結合到 GABA_A 的 {{BZD 受體|受體}}，增加 Cl⁻的流入",
    "常被用來當肌肉鬆弛劑，但 FDA {{沒有|性質|有}}核准這項適應症"] },
{ id: "baclofen", chapter: 6, name: "Baclofen", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/mr-baclofen.png", imgMore: ["assets/medchem/mr-gaba.png"],
  use: ["★ 結構重要"],
  feat: ["兩性化合物，含有 {{GABA|物質}}★結構（見下方結構）",
    "{{(R)-enantiomer|結構|(S)-enantiomer}} 較具活性，但核准的是消旋化合物"],
  pharm: ["為 {{GABA_B|受體|GABA_A}} 受體的促效劑★",
    "減少 Ca²⁺的[u]向內電流[/u]，抑制脊髓神經元的過極化，進而降低其活性"] },
{ id: "dantrolene", chapter: 6, name: "Dantrolene", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/mr-dantrolene.png",
  feat: ["為 {{hydantoin|結構}}★衍生物（有 ureide 骨架），也具有 furan、{{nitrobenzene|結構}} 結構",
    "代謝還原後形成 Aminodantrolene",
    "> （NO₂ → NH₂）"],
  pharm: ["作用位置：{{骨骼肌細胞的肌漿網 SR|位置}}",
    "> 與 Ca²⁺通道結合，使其關閉抑制離子釋放",
    "> 阻斷骨骼肌 {{ryanodine|受體}} Ca²⁺ release channel",
    "具{{周邊|位置|中樞}}緩解痙攣的效果",
    "可治療麻醉劑引發的{{惡性高熱|疾病}}"] },
{ id: "tizanidine", chapter: 6, name: "Tizanidine", type: "drug", group: "抗痙攣劑", source: "統整（一）p.67", img: "assets/medchem/mr-tizanidine.png", imgMore: ["assets/medchem/mr-clonidine.png"],
  feat: ["為 {{Clonidine|藥名}} 的類似物（見下方結構）",
    "有 imidazoline、{{benzothiadiazole|結構}} 結構"],
  pharm: ["促進運動神經元前突觸的 {{α₂|受體}} 受體",
    "→ 抑制興奮性神經活性",
    "有{{中樞|位置|周邊}}活性的肌肉鬆弛效果",
    "治療因腦或脊髓損傷造成的痙攣",
    "代謝：三個環的 oxidation"] },

/* ===== 第 7 章 局部麻醉劑（統整（一）柒，p.68–70）===== */
/* 講義黑底「酯類結構（Ester）」底下分兩個灰底（Benzoic acid、PABA）→ 第三層小標；「醯胺類結構（Amide）」沒有灰底，黑底就是分類本身。
   講義這三頁的藥物表格沒有欄位標題，只有一欄說明 → 用 desc；名字底下的小字（Cocaine 的古柯鹼、Crack）放 use。
   共同結構、藥理作用、EMLA 沒有分類 → 告示牌；PABA 說明列、PABA 結構、Amide 代謝速率 → 各自的小白標。
   行首「- 」＝子項目、「> 」＝接續行、「→」縮排，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

/* 酯類結構 > Benzoic acid 苯甲酸衍生物 */
{ id: "la-cocaine", chapter: 7, name: "Cocaine", type: "drug", group: "Benzoic acid 苯甲酸衍生物", source: "統整（一）p.69", img: "assets/medchem/la-cocaine.png",
  use: ["古柯鹼、Crack"],
  desc: ["作用機轉：",
    "> 阻斷{{單胺類|物質}}化合物（NE、5-HT、Dopamine）的{{再回收|機轉}}，會使體溫{{過高|副作用}}",
    "臨床上作為{{局部麻醉劑|用途}}，可阻斷 Na⁺通道",
    "→ {{唯一使血管收縮|性質}}的局部麻醉劑，不須併用收縮劑",
    "代謝：去酯化+去甲基形成 Benzoylecgonine，",
    "> 水解產生 Benzoic acid、Methanol、{{Ecgonine|代謝物}}★",
    "副作用：心律不整、焦慮"] },
{ id: "la-piperocaine", chapter: 7, name: "Piperocaine", type: "drug", group: "Benzoic acid 苯甲酸衍生物", source: "統整（一）p.69", img: "assets/medchem/la-piperocaine.png" },

/* 酯類結構 > para-amino benzoic acid（PABA）衍生物 */
{ id: "la-benzocaine", chapter: 7, name: "Benzocaine", type: "drug", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", img: "assets/medchem/la-benzocaine.png",
  desc: ["缺乏 {{Aliphatic amine|結構}}",
    "→ 不易和酸製成鹽類，{{不適合作注射劑使用|性質|適合作注射劑使用}}★",
    "Atropine 會{{抑制|機轉|活化}} esterase，併用容易產生毒性"] },
{ id: "la-procaine", chapter: 7, name: "Procaine", type: "drug", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", img: "assets/medchem/la-procaine.png",
  desc: ["由 {{pseudo-esterase|酵素}} 和 cholinesterase 水解",
    "和 {{Penicillin G|藥名}} 併用可減少 IM 注射疼痛"] },
{ id: "la-tetracaine", chapter: 7, name: "Tetracaine", type: "drug", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", img: "assets/medchem/la-tetracaine.png",
  desc: ["芳香胺接上 butyl group：{{脂溶性增加|性質|脂溶性下降}}",
    "藥效強，作為{{長效深層脊髓麻醉|用途}}用",
    "有血管舒張作用，須併用{{血管收縮劑|藥物類別}}"] },
{ id: "la-chloroprocaine", chapter: 7, name: "Chloroprocaine", type: "drug", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", img: "assets/medchem/la-chloroprocaine.png",
  desc: ["苯環之 {{ortho|位置|meta/para}} 位★以 Cl 取代",
    "→ {{誘導效應|機轉|共振效應}}★，容易被酯酶水解"] },

/* 醯胺類結構（Amide） */
{ id: "la-lidocaine", chapter: 7, name: "Lidocaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-lidocaine.png",
  desc: ["由 {{Isogramine|藥名}}★經生物等價原理設計而成",
    "IV 可治療{{心律不整|疾病}}（Class Ib）",
    "代謝物 {{Monoethylglycinexylidide|代謝物}}★（MEGX）",
    "> 產生 CNS 毒性"] },
{ id: "la-prilocaine", chapter: 7, name: "Prilocaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-prilocaine.png",
  desc: ["非 {{Xylene|結構}} 衍生物★",
    "代謝物 {{Toluidine|代謝物}} 引發{{變性紅血球症|副作用}}",
    "→ 治療：{{Methylene blue|藥名}}"] },
{ id: "la-bupivacaine", chapter: 7, name: "Bupivacaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-bupivacaine.png",
  desc: ["{{半衰期最長|性質|半衰期最短}}，以注射方式給藥",
    "具有{{心臟毒性|副作用}}，打入血管易導致 CV collapse",
    "{{S(-)|結構|R(+)}} form★之心毒性和 CNS 毒性較小"] },
{ id: "la-etidocaine", chapter: 7, name: "Etidocaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-etidocaine.png",
  desc: ["比 Lidocaine 多了{{α-ethyl|取代基}}和 {{N-propyl|取代基}}",
    "藥效強，具有{{心毒性|副作用}}"] },
{ id: "la-ropivacaine", chapter: 7, name: "Ropivacaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-ropivacaine.png",
  desc: ["具有{{血管收縮|性質|血管擴張}}的效果",
    "具有一個 chiral center，{{S(-)|結構|R(+)}} form 活性最強",
    "主要經肝臟的 {{CYP1A2|酵素}}、3A4 代謝成",
    "> {{3-hydroxy|代謝物}} 代謝物"] },
{ id: "la-articaine", chapter: 7, name: "Articaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-articaine.png",
  desc: ["含有 {{thiophene|結構}}★結構 →易穿透細胞膜",
    "Onset {{快|性質|慢}}、Duration {{短|性質|長}}",
    "{{牙科|用途}}首選用藥"] },
{ id: "la-dibucaine", chapter: 7, name: "Dibucaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-dibucaine.png",
  desc: ["含有 {{quinoline|結構}}★結構",
    "{{不可口服|性質|可口服}}，常製成軟膏劑型",
    "OTC 用於{{曬傷|疾病}}及痔瘡",
    "可供蜘蛛網膜下注射使用"] },
{ id: "la-tocainide", chapter: 7, name: "Tocainide", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-tocainide.png",
  desc: ["為 glycine+{{xylidine|結構}} 之 amide 衍生物",
    "不會產生 {{Carboline|結構}} 衍生物，CNS 毒性小",
    "也可作為{{抗心律不整|用途}}藥物"] },
{ id: "la-mepivacaine", chapter: 7, name: "Mepivacaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-mepivacaine.png",
  desc: ["N 上有接{{甲基|取代基}}",
    "作用與 Lidocaine 類似，但{{沒有血管擴張|性質|有血管擴張}}的作用"] },
{ id: "la-tolycaine", chapter: 7, name: "Tolycaine", type: "drug", group: "醯胺類結構（Amide）", source: "統整（一）p.70", img: "assets/medchem/la-tolycaine.png",
  desc: ["{{極性高|性質|極性低}}，無 CNS 毒性",
    "用來治療{{心律不整|疾病}}"] },

/* ===== 第 8 章 全身麻醉劑（統整（一）捌，p.71–76）===== */
/* 欄位照講義表格（特性／藥理及臨床應用）。講義黑底「吸入型…」「IV 注射型…」是分類；灰底是子分類，用第三層小標掛在黑底下。
   Nitrous Oxide 直接在黑底底下沒有灰底，所以屬於黑底這一類本身。
   Meyer-Overton 性質表、※ 比較列沒有分類 → 告示牌；※ 註解放進所屬小白標。
   Midazolam、Lorazepam、Diazepam 共用一格說明 → 各自都放；只講到 Midazolam 的 Flumazenil 句子只放 Midazolam。 */

/* 吸入型全身麻醉劑 */
{ id: "ga-nitrous-oxide", chapter: 8, name: "Nitrous Oxide（N₂O）", short: "N₂O", type: "drug", group: "吸入型全身麻醉劑：沒有特定的目標受器與之結合", source: "統整（一）p.72", img: "assets/medchem/ga-nitrous-oxide.png",
  feat: ["對血液溶解度差：λ(Blood/Gas){{小|性質|大}}",
    "→ 麻醉{{誘導快|性質|誘導慢}}★、{{恢復快|性質|恢復慢}}、{{作用時間短|性質|作用時間長}}",
    "{{MAC 值太大|性質|MAC 值太小}}，無法在一般氣壓下達到麻醉功效"],
  pharm: ["單獨使用會{{缺氧|副作用}} →需與 20% {{O₂|物質}} 併用",
    "強力{{止痛劑|用途}}，但無{{肌肉鬆弛|用途}}效果",
    "副作用：因 {{Vit B₁₂|物質}}↓，造成{{巨母紅血球貧血|疾病}}"] },

/* 吸入型 > 含鹵素的揮發性麻醉劑 */
{ id: "ga-halothane", chapter: 8, name: "Halothane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.72", img: "assets/medchem/ga-halothane.png",
  feat: ["含兩個碳的{{烷類|結構|醚類}}",
    "唯一含有 {{Br|取代基|F/Cl}}★的揮發性麻醉劑",
    "> （同時含有 F、Cl、Br）",
    "代謝不會產生 {{F⁻|代謝物}}→不會造成{{腎毒性|副作用}}"],
  pharm: ["常用於{{兒科麻醉|用途}}（Pediatric anesthesia）",
    "麻醉效果強，但[u]{{止痛效果差|性質|止痛效果強}}[/u]",
    "副作用：{{肝毒性|副作用}}（產生{{自由基|代謝物}}）、{{惡性盜熱|副作用}}，造成低血壓",
    "→ Halothane 影響{{心血管|器官}}最劇"] },
{ id: "ga-enflurane", chapter: 8, name: "Enflurane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.72", img: "assets/medchem/ga-enflurane.png",
  feat: ["含有 {{5 個|數值|6 個/7 個}} F 原子（E→第五個英文字母）",
    "與 Isoflurane 互為{{結構異構物|名詞}}",
    "常溫下為澄清無色、不可燃液體"],
  pharm: ["經肝臟代謝約 2~5%為有效劑量",
    "不可用於{{癲癇|疾病}}患者",
    "副作用：{{腎毒性|副作用}}、{{惡性盜熱|副作用}}"] },
{ id: "ga-isoflurane", chapter: 8, name: "Isoflurane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.72", img: "assets/medchem/ga-isoflurane.png",
  feat: ["將 Enflurane 的 F、Cl 位置互調，兩者互為",
    "> {{結構異構物|名詞}}（Structural isomer）",
    "代謝：肝臟代謝先形成 CF₃CHO、CF₃COCl，",
    "> 再形成 {{CF₃COOH|代謝物}}★"],
  pharm: ["肝臟代謝率<{{2%|數值}}",
    "心血管副作用較 Enflurane {{少|性質|多}}"] },
{ id: "ga-desflurane", chapter: 8, name: "Desflurane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.73", img: "assets/medchem/ga-desflurane.png",
  feat: ["結構中沒有 Cl 原子，含有 {{6 個|數值|5 個/7 個}} F 原子",
    "血液中溶解度差：λ(Blood/Gas) {{最小|性質|最大}}",
    "→ 麻醉誘導快、恢復快、作用時間短",
    "為不可燃、對[u]{{金屬無腐蝕性|性質|金屬有腐蝕性}}[/u]的刺激性氣體"],
  pharm: ["適合{{門診手術|用途}}的麻醉，不用住院",
    "體內代謝率{{最低|性質|最高}}★，屬於較安全麻醉劑"] },
{ id: "ga-sevoflurane", chapter: 8, name: "Sevoflurane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.73", img: "assets/medchem/ga-sevoflurane.png",
  feat: ["含有 {{7 個|數值|5 個/6 個}} F 原子（Sevo→七個）",
    "血液中溶解度差",
    "→ 麻醉誘導快、恢復快、作用時間短",
    "不可燃、{{無刺激|性質|有刺激}}且味道佳的氣體"],
  pharm: ["代謝量約 {{3%|數值}}，雖會代謝產生 F⁻，但因代謝率低，很少造成{{肝腎毒性|副作用}}"] },
{ id: "ga-methoxyflurane", chapter: 8, name: "Methoxyflurane", type: "drug", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.73", img: "assets/medchem/ga-methoxyflurane.png",
  feat: ["結構含有{{甲氧基|取代基}}（Methoxy group）",
    "血液中溶解度{{最高|性質|最低}}",
    "→ 麻醉誘導速率{{最慢|性質|最快}}、恢復慢"],
  pharm: ["代謝量高達 {{50%|數值}}，穩定度低",
    "副作用：{{強烈腎毒性|副作用}}★，目前少用",
    "> （因一分子藥物會產生 {{2 個|數值}} F⁻）"] },

/* IV 注射型 > Phenol 類衍生物 */
{ id: "ga-propofol", chapter: 8, name: "Propofol", type: "drug", group: "Phenol 類衍生物", source: "統整（一）p.74", img: "assets/medchem/ga-propofol.png",
  feat: ["結構：[u]{{2,6-diisopropylphenol|結構}}[/u]",
    "{{脂溶性高|性質|水溶性高}}，在水中溶解度差"],
  pharm: ["{{無止痛作用|性質|有止痛作用}}★，不會造成術後噁心嘔吐",
    "與體內的蛋白質結合度高",
    "代謝：主要在{{肝臟|器官}}行共軛反應（{{Conjugation|代謝}}）"] },
{ id: "ga-fospropofol", chapter: 8, name: "Fospropofol", type: "drug", group: "Phenol 類衍生物", source: "統整（一）p.74", img: "assets/medchem/ga-fospropofol.png",
  feat: ["為 Propofol 的{{磷酸鹽前驅藥 Prodrug|名詞}}",
    "{{水溶性佳|性質|脂溶性佳}}，注射時較不疼痛"],
  pharm: ["被體內的 {{Alkaline phosphatase|酵素}} 快速[u]水解[/u]成",
    "> 脂溶性的 Propofol"] },

/* IV 注射型 > Phencyclidine（PCP）類衍生物 */
{ id: "ga-ketamine", chapter: 8, name: "Ketamine", type: "drug", group: "Phencyclidine（PCP）類衍生物", source: "統整（一）p.74", img: "assets/medchem/ga-ketamine.png",
  feat: ["結構與 {{Phencyclidine|藥名}}（PCP）相似",
    "含 ketone、amine、{{2-chlorophenyl|結構}} 結構",
    "{{S (+)|結構|R (-)}}-form 具有較大的活性",
    "水溶性、脂溶性都很好"],
  pharm: ["{{NMDA 受體|受體}}（興奮性）拮抗劑",
    "→ 屬於{{解離型麻醉劑|藥物類別}}",
    "口服有{{首渡效應|代謝}} →口服生物可用率{{低|性質|高}}",
    "因 Duration 短，[u]沒有{{骨骼肌鬆弛|用途}}作用[/u]",
    "主要由 {{CYP3A4|酵素}} 代謝，其次為 2B6/2C9",
    "> 進行 {{N-demethylation|代謝}}"] },

/* IV 注射型 > Barbiturate 類衍生物：超短效型 */
{ id: "ga-thiopental", chapter: 8, name: "Thiopental", type: "drug", group: "Barbiturate 類衍生物：超短效型", source: "統整（一）p.75", img: "assets/medchem/ga-thiopental.png",
  feat: ["{{Thiobarbiturate|藥物類別}} 衍生物",
    "五號位接 {{Methylbutyl|取代基}}（5C）和乙基"],
  pharm: ["抑制{{呼吸中樞|器官}}，降低對 CO₂ 的敏感性",
    "{{高脂溶性|性質|低脂溶性}}，易通過 BBB、Onset 快",
    "Duration 短，會再分布到肌肉或脂肪組織，剩下血",
    "> 中游離的部分由肝臟進行代謝",
    "代謝：進行 oxidative desulfurization",
    "→ {{氧化脫硫|代謝}}形成 {{pentobarbital|代謝物}}"] },
{ id: "ga-thiamylal", chapter: 8, name: "Thiamylal", type: "drug", group: "Barbiturate 類衍生物：超短效型", source: "統整（一）p.75", img: "assets/medchem/ga-thiamylal.png",
  feat: ["{{Thiobarbiturate|藥物類別}} 衍生物",
    "五號位接 {{Methylbutyl|取代基}} 和 {{allyl group|取代基}}",
    "與 Thiopental 只差{{一個雙鍵|結構}}"],
  pharm: ["高脂溶性",
    "結構特徵與生理性質和 Thiopental 相似",
    "IV 注射 {{Onset 快|性質|Onset 慢}}、{{Duration 短|性質|Duration 長}}"] },
{ id: "ga-methohexital", chapter: 8, name: "Methohexital", type: "drug", group: "Barbiturate 類衍生物：超短效型", source: "統整（一）p.75", img: "assets/medchem/ga-methohexital.png",
  feat: ["{{N-methyl barbiturate|結構}} 衍生物",
    "N 接上甲基後，[u]pKa={{8.4|數值}} 鹼性更強[/u]",
    "→ {{脂溶性游離酸濃度增加|性質|脂溶性游離酸濃度減少}}"],
  pharm: ["{{親脂性高|性質|親脂性低}}",
    "代謝：參鍵旁的 α-CH₂ 被代謝，為{{無活性|性質}}產物"] },

/* IV 注射型 > Carboxylated Imidazole 類衍生物 */
{ id: "ga-etomidate", chapter: 8, name: "Etomidate", type: "drug", group: "Carboxylated Imidazole 類衍生物", source: "統整（一）p.76", img: "assets/medchem/ga-etomidate.png",
  feat: ["具有 [u]{{Ethyl acetate|結構}}[/u] 酯類結構",
    "含 [u]{{imidazole|結構}}[/u] 環",
    "有立體中心，為 {{R(+)|結構|S(-)}}-isomer",
    "pKa={{4.5|數值}}，為{{弱酸性|性質|弱鹼性}}藥物"],
  pharm: ["GABA_A 受體的{{異位致效劑|機轉}}（allosteric agonist）",
    "為強力、短效、Onset 快的安眠劑（hypnotic），但",
    "> {{沒有止痛效果|性質|有止痛效果}}",
    "被肝臟及血漿中的 {{esterase|酵素}} 代謝成{{無活性|性質}}",
    "{{門診手術|用途}}常用之 IV 麻醉劑",
    "→ 比較：門診手術常用{{吸入型|藥物類別}}為 {{Desflurane|藥名}}"] },

/* IV 注射型 > Benzodiazepines 類衍生物（BZD） */
{ id: "ga-midazolam", chapter: 8, name: "Midazolam", type: "drug", group: "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam", source: "統整（一）p.76", img: "assets/medchem/ga-midazolam.png", imgMore: ["assets/medchem/ga-flumazenil.png"],
  use: ["屬於 {{Class B|藥物類別}} 的 {{imidazo-BZD|藥物類別}}"],
  pharm: ["GABA_A 受體的{{異位致效劑|機轉}}（allosteric agonist）",
    "→ 提高 Cl⁻通道開啟的[u]{{頻率|機轉|持續時間}}[/u]",
    "副作用：{{鎮靜|副作用}}",
    "> {{Flumazenil|藥名}} 可異位拮抗 Midazolam 的鎮靜作用，",
    "> 可作為{{解毒劑|用途}}（結構補充如下）",
    "通常只做{{麻醉誘導|用途}}，常和其他麻醉劑併用"] },
{ id: "ga-lorazepam", chapter: 8, name: "Lorazepam", type: "drug", group: "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam", source: "統整（一）p.76", img: "assets/medchem/ga-lorazepam.png",
  pharm: ["GABA_A 受體的{{異位致效劑|機轉}}（allosteric agonist）",
    "→ 提高 Cl⁻通道開啟的[u]{{頻率|機轉|持續時間}}[/u]",
    "副作用：{{鎮靜|副作用}}",
    "通常只做{{麻醉誘導|用途}}，常和其他麻醉劑併用"] },
{ id: "ga-diazepam", chapter: 8, name: "Diazepam", type: "drug", group: "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam", source: "統整（一）p.76", img: "assets/medchem/ga-diazepam.png",
  pharm: ["GABA_A 受體的{{異位致效劑|機轉}}（allosteric agonist）",
    "→ 提高 Cl⁻通道開啟的[u]{{頻率|機轉|持續時間}}[/u]",
    "副作用：{{鎮靜|副作用}}",
    "通常只做{{麻醉誘導|用途}}，常和其他麻醉劑併用"] },

/* ===== 第 9、10 章（統整（一）玖 阿片類止痛劑 p.77–90、拾 中樞神經興奮劑、迷幻劑與濫用藥物 p.91–93）===== */
/* 欄位照講義表格（特性／藥理及臨床應用）；p.81 的表格沒有欄位標題，藥名底下的小字放 use、結構上方的註解放 feat、下面的條列放 pharm。
   第 9 章：黑底「修飾 Nitrogen atom」底下三個灰底用第三層小標；其他黑底（3-Hydroxyl、6α-Hydroxyl、6-keto-14β-Hydroxyl）自己就是分類；
   二、環狀結構修飾藥物的灰底沒有黑底，灰底就是分類本身。講義重複出現的藥（Buprenorphine、Dezocine、Codeine、Loperamide、Diphenoxylate、Butorphanol、Pentazocine）各放一格。
   第 10 章：中樞神經興奮劑（黑底）底下 Methylxanthine 類用第三層小標；迷幻劑（黑底）。
   行首「- 」＝子項目、「> 」＝接續行、「→」縮排，[u]…[/u]＝底線、[i]…[/i]＝斜體 */

{ id: "op-naloxone", chapter: 9, name: "Naloxone", type: "drug", group: "Opioid 受體拮抗劑（Pure antagonist）", source: "統整（一）p.81", img: "assets/medchem/op-naloxone.png",
  use: ["IV，緊急用"],
  feat: ["N 上接 {{allyl|取代基}}★"],
  pharm: ["Naloxone 可治療{{阿片急性中毒|疾病}}（比較：Methadone、Buprenorphine 用來治療阿片成癮）"] },
{ id: "op-naltrexone", chapter: 9, name: "Naltrexone", type: "drug", group: "Opioid 受體拮抗劑（Pure antagonist）", source: "統整（一）p.81", img: "assets/medchem/op-naltrexone.png",
  use: ["口服"],
  feat: ["N 上接 {{cyclopropylmethyl|取代基}}★"] },
{ id: "op-naltrindole", chapter: 9, name: "Naltrindol(e)", type: "drug", group: "Opioid 受體拮抗劑（Pure antagonist）", source: "統整（一）p.81", img: "assets/medchem/op-naltrindole.png",
  pharm: ["Naltrindol 為選擇性{{δ-opioid 受體拮抗劑|受體}}★"] },
{ id: "op-b-fna", chapter: 9, name: "β-Funaltrexamine（β-FNA）", short: "β-FNA", type: "drug", group: "Opioid 受體拮抗劑（Pure antagonist）", source: "統整（一）p.81", img: "assets/medchem/op-b-fna.png",
  pharm: ["β-FNA 可作為{{阿片受體的親和性標記藥物|用途}}★（affinity labeling agent）",
    "→ 其他可作為親和性標記的藥物：β-CAN、superfit、UPHIT"] },
{ id: "op-nalbuphine", chapter: 9, name: "(-)-Nalbuphine", type: "drug", group: "混合型致效劑：μ-antagonist & κ-agonist", source: "統整（一）p.81", img: "assets/medchem/op-nalbuphine.png",
  use: ["不可用於成癮治療"],
  feat: ["N 上接 {{cyclobutylmethyl|取代基}}"] },
{ id: "op-butorphanol-n", chapter: 9, name: "(-)-Butorphanol", type: "drug", group: "混合型致效劑：μ-antagonist & κ-agonist", source: "統整（一）p.81", img: "assets/medchem/op-butorphanol-n.png",
  use: ["保留 {{ABCN|結構}} 環"],
  feat: ["N 上接 {{cyclobutylmethyl|取代基}}",
    "6 號位{{沒有 OH|結構|有 OH}}，也沒有 O 環"] },
{ id: "op-pentazocine-n", chapter: 9, name: "(-)-Pentazocine", type: "drug", group: "混合型致效劑：μ-antagonist & κ-agonist", source: "統整（一）p.81", img: "assets/medchem/op-pentazocine-n.png",
  use: ["保留 {{ABN|結構}} 環"],
  feat: ["N 上接 {{methallyl|取代基}}"] },
{ id: "op-buprenorphine", chapter: 9, name: "(-)-Buprenorphine", type: "drug", group: "部分致效劑（Partial agonist）", source: "統整（一）p.82", img: "assets/medchem/op-buprenorphine.png",
  feat: ["N 上接 {{cyclopropylmethyl|取代基}}"],
  pharm: ["對μ、κ受體為 {{agonist|機轉}}",
    "對δ受體為強效 {{antagonist|機轉|agonist}}",
    "可治療阿片慢性{{成癮|疾病}}"] },
{ id: "op-dezocine", chapter: 9, name: "(-)-Dezocine", type: "drug", group: "部分致效劑（Partial agonist）", source: "統整（一）p.82", img: "assets/medchem/op-dezocine.png",
  feat: ["僅保留 AB 環結構",
    "含有 {{benzocyclodecenol|結構}} 結構",
    "唯一具有{{一級胺|結構|二級胺/三級胺}}★結構"],
  pharm: ["對μ受體為 {{agonist|機轉}}",
    "對κ、δ受體為{{弱效 agonist|機轉|強效 antagonist}}"] },
{ id: "op-codeine", chapter: 9, name: "Codeine", type: "drug", group: "修飾 3-Hydroxyl group", source: "統整（一）p.82", img: "assets/medchem/op-codeine.png",
  feat: ["Prodrug，為 Morphine 的 {{3-methoxy|取代基}}★衍生物",
    "具有 6α-hydroxyl group（醇性羥基）",
    "具{{鎮咳|用途}}作用，止痛活性較弱"],
  pharm: ["CYP2D6 進行 O-demethylation，",
    "> 形成{{有活性|性質|無活性}}的 Morphine",
    "CYP3A4 進行 N-demethylation，",
    "> 形成{{無活性|性質}}的 Norcodeine",
    "最後都代謝為弱活性 Normorphine"] },
{ id: "op-heroin", chapter: 9, name: "Heroin", type: "drug", group: "修飾 3-Hydroxyl group", source: "統整（一）p.82", img: "assets/medchem/op-heroin.png",
  feat: ["Prodrug，為 Morphine 的 {{3,6-diacetyl|取代基}}★衍生物",
    "{{高脂溶性|性質|低脂溶性}}，可穿 BBB 代謝成 Morphine 作用"],
  pharm: ["經過兩次 {{Hydrolysis|代謝}} 將乙醯基切除，形成 Morphine"] },
{ id: "op-hydromorphone", chapter: 9, name: "(-)-Hydromorphone", type: "drug", group: "修飾 6α-Hydroxyl group", source: "統整（一）p.83", img: "assets/medchem/op-hydromorphone.png",
  feat: ["Morphine 的 {{7,8-dihydro-6-keto|結構}} 衍生物",
    "又名 Dihydromorphone"],
  pharm: ["止痛活性為 Morphine 的 {{10 倍|數值}}"] },
{ id: "op-hydrocodone", chapter: 9, name: "(-)-Hydrocodone", type: "drug", group: "修飾 6α-Hydroxyl group", source: "統整（一）p.83", img: "assets/medchem/op-hydrocodone.png",
  feat: ["Codeine 的 7,8-dihydro-6-keto 衍生物",
    "> （與 Hydromorphone 差在 3 號位取代基）"],
  pharm: ["{{口服|給藥途徑}}使用，可併用 {{Acetaminophen|藥名}}",
    "> 治療中度疼痛"] },
{ id: "op-oxymorphone", chapter: 9, name: "(-)-Oxymorphone", type: "drug", group: "6-keto-14β-Hydroxyl 衍生物", source: "統整（一）p.83", img: "assets/medchem/op-oxymorphone.png",
  feat: ["Morphine 的 {{6-keto-14β-hydroxyl|結構}} 衍生物"],
  pharm: ["活性約為 Morphine 的 {{10 倍|數值}}"] },
{ id: "op-oxycodone", chapter: 9, name: "(-)-Oxycodone", type: "drug", group: "6-keto-14β-Hydroxyl 衍生物", source: "統整（一）p.83", img: "assets/medchem/op-oxycodone.png",
  feat: ["Codeine 的 6-keto-14β-hydroxyl 衍生物",
    "> （與 Oxymorphone 差在 3 號位取代基）"],
  pharm: ["與 Morphine 藥效{{相當|性質|較強}}"] },
{ id: "op-levorphanol", chapter: 9, name: "(-)-Levorphanol", type: "drug", group: "保留 ABCN 環結構：Morphinan 衍生物（移除 4,5-epoxide bridge）", source: "統整（一）p.84", img: "assets/medchem/op-levorphanol.png",
  feat: ["3 號位修飾成甲氧基，形成 Levormethorphan",
    "Dextromethorphan 為 Levormethorphan 的{{右旋|性質|左旋}}★",
    "> 異構物（enantiomer），具有{{止咳|用途}}★作用，無止痛效果"],
  pharm: ["止痛活性為 Morphine 的 {{8 倍|數值}}"] },
{ id: "op-butorphanol", chapter: 9, name: "(-)-Butorphanol", type: "drug", group: "保留 ABCN 環結構：Morphinan 衍生物（移除 4,5-epoxide bridge）", source: "統整（一）p.84", img: "assets/medchem/op-butorphanol.png",
  feat: ["N 上接有 {{cyclobutylmethyl|取代基}}"],
  pharm: ["{{混合致效劑|機轉}}",
    "> （μ antagonist、κ agonist★）"] },
{ id: "op-pentazocine", chapter: 9, name: "Pentazocine", type: "drug", group: "保留 ABN 環結構：6,7-Benzomorphan 衍生物", source: "統整（一）p.84", img: "assets/medchem/op-pentazocine.png",
  feat: ["保留 {{ABN 環結構|結構}}★",
    "具有 {{Benzomorphan|結構}}★結構"],
  pharm: ["弱效μ antagonist（Naloxone 的 {{1/30|數值}}）",
    "弱效κ agonist"] },
{ id: "op-phenazocine", chapter: 9, name: "Phenazocine", type: "drug", group: "保留 ABN 環結構：6,7-Benzomorphan 衍生物", source: "統整（一）p.84", img: "assets/medchem/op-phenazocine.png",
  feat: ["N 上接 {{ethylphenyl|取代基}}"],
  pharm: ["μ antagonist（Naloxone 的 {{1/3|數值}}）",
    "→ 效果較 Pentazocine 強 {{10 倍|數值}}"] },
{ id: "op-meperidine", chapter: 9, name: "Meperidine", type: "drug", group: "保留 AN 環結構：4-Phenylpiperidines 衍生物", source: "統整（一）p.85", img: "assets/medchem/op-meperidine.png",
  use: ["止痛活性為 morphine 的 0.1 倍"],
  feat: ["{{4-Phenylpiperidines|結構}}★衍生物",
    "苯環位於 piperidine 的{{水平|位置|垂直}}位向",
    "代謝：經 {{CYP3A4|酵素}} 進行 N-demethylation，形成",
    "> Normeperidine（藥效減半，具有神經毒性）"],
  pharm: ["可和 {{Atropine|藥名}} 併用止瀉★",
    "禁和 {{MAOI|藥物類別}}、Cimetidine 併用",
    "{{孕婦分娩止痛劑|用途}}★，不用於 PCA★",
    "副作用：",
    "> 過敏、血壓急降，不會{{針狀瞳孔|副作用}}★"] },
{ id: "op-diphenoxylate-85", chapter: 9, name: "Diphenoxylate", type: "drug", group: "保留 AN 環結構：4-Phenylpiperidines 衍生物", source: "統整（一）p.85", img: "assets/medchem/op-diphenoxylate-85.png", imgMore: ["assets/medchem/op-ethyl-isonipecotate.png", "assets/medchem/op-difenoxin-85.png"],
  feat: ["具有 {{Ethyl isonipecotate|結構}} 骨架（右圖）",
    "高極性，無法通過 BBB",
    "經 esterase {{水解|代謝}}形成 Difenoxin"],
  pharm: ["Difenoxin 的口服止瀉",
    "> 效果提高 {{5 倍|數值}}"] },
{ id: "op-loperamide-85", chapter: 9, name: "Loperamide", type: "drug", group: "保留 AN 環結構：4-Phenylpiperidines 衍生物", source: "統整（一）p.85", img: "assets/medchem/op-loperamide-85.png",
  feat: ["具有 diphenylpiperidine 骨架",
    "{{高脂溶性|性質|低脂溶性}}，不可用於 IV 注射"],
  pharm: ["用來當作 {{OTC 止瀉劑|用途}}★",
    "沒有中樞μ-agonist 作用",
    "→ 腦中 {{P-gp|標的}} 會將藥物排出★"] },
{ id: "op-alphaprodine", chapter: 9, name: "Alphaprodine", type: "drug", group: "保留 AN 環結構：4-Phenylpiperidines 衍生物", source: "統整（一）p.85", img: "assets/medchem/op-alphaprodine.png",
  feat: ["與 MPPP 相比，在 pyridine 上多一個{{甲基|取代基}}",
    "具有 hydroxyester 和甲基取代，止痛效果增加"] },
{ id: "op-designer-heroin", chapter: 9, name: "Designer Heroin", type: "drug", group: "保留 AN 環結構：4-Phenylpiperidines 衍生物", source: "統整（一）p.85", img: "assets/medchem/op-designer-heroin.png",
  feat: ["結構為 1-methyl-4-phenylpyridinium propionic acid",
    "> （與 Alphaprodine 相差在 pyridine 上的甲基）",
    "又名 {{MPPP|藥名}}，代謝物造成{{帕金森氏症|疾病}} P.43"],
  pharm: ["Designer drugs 又名 controlled substance analogs，應用於藥物結構與 SAR 之設計"] },
{ id: "op-fentanyl", chapter: 9, name: "Fentanyl", type: "drug", group: "保留 AN 環結構，但之間以 N 相接：4-Anilidopiperidine 衍生物", source: "統整（一）p.86", img: "assets/medchem/op-fentanyl.png",
  feat: ["{{4-Anilidopiperidine|結構}}★衍生物",
    "無活性代謝物，可用於{{肝腎功能不全|疾病}}患者"],
  pharm: ["藥效為 Morphine 的 {{100 倍|數值}}",
    "Onset 快、Duration 短",
    "有{{呼吸抑制|副作用}}的副作用，無鎮靜效果"] },
{ id: "op-sufentanil", chapter: 9, name: "Sufentanil", type: "drug", group: "保留 AN 環結構，但之間以 N 相接：4-Anilidopiperidine 衍生物", source: "統整（一）p.86", img: "assets/medchem/op-sufentanil.png",
  use: ["→ 呼吸抑制作用{{較弱|性質|較強}}"],
  feat: ["含有 {{thiophene|結構}} 結構"] },
{ id: "op-alfentanil", chapter: 9, name: "Alfentanil", type: "drug", group: "保留 AN 環結構，但之間以 N 相接：4-Anilidopiperidine 衍生物", source: "統整（一）p.86", img: "assets/medchem/op-alfentanil.png",
  use: ["→ 呼吸抑制作用{{較弱|性質|較強}}"],
  feat: ["含有 {{tetrazole|結構}}★結構"] },
{ id: "op-remifentanil", chapter: 9, name: "Remifentanil", type: "drug", group: "保留 AN 環結構，但之間以 N 相接：4-Anilidopiperidine 衍生物", source: "統整（一）p.86", img: "assets/medchem/op-remifentanil.png",
  use: ["→ 呼吸抑制作用{{較弱|性質|較強}}"],
  feat: ["含有{{酯類|結構}}結構"] },
{ id: "op-dezocine-ab", chapter: 9, name: "Dezocine", type: "drug", group: "保留 AB 環結構：Aminotetralin 類", source: "統整（一）p.86", img: "assets/medchem/op-dezocine-ab.png",
  feat: ["僅保留 AB 環結構",
    "含有 benzocyclodecenol 結構",
    "唯一具有{{一級胺|結構|二級胺/三級胺}}★結構"],
  pharm: ["{{部分致效劑|機轉}}",
    "對μ受體為 agonist",
    "對κ、δ受體為弱效 agonist"] },
{ id: "op-tramadol", chapter: 9, name: "Tramadol", type: "drug", group: "保留 AC 環結構（不含 N 環=不含 piperidine）：4-Phenylcyclohexane 類", source: "統整（一）p.86", img: "assets/medchem/op-tramadol.png",
  feat: ["{{雙效|性質}}★阿片類藥物，有兩個 chiral center",
    "- 1S、2S (-)：抑制 {{NE|物質|5-HT}} 回收，有興奮作用",
    "- 1R、2R (+)：抑制 {{5-HT|物質|NE}} 回收，有止痛作用",
    "代謝：CYP450 進行 {{O-demethylation|代謝}}，形成活性代謝物，止痛效果提高 {{6 倍|數值}}"],
  pharm: ["上市為消旋化合物，口服有效",
    "因會抑制 5-HT 再吸收，具有憂鬱、{{自殺傾向|副作用}}★等精神副作用"] },
{ id: "op-methadone", chapter: 9, name: "Methadone", type: "drug", group: "僅保留 A 環結構，但與 N 仍間隔 3 個 C：Phenylpropylamine 類", source: "統整（一）p.87", img: "assets/medchem/op-methadone.png",
  feat: ["含有 R-(-)-{{diphenylheptanone|結構}}★骨架",
    "> （也可稱為 {{diphenylpropylamine|結構}}★）"],
  pharm: ["用於戒斷阿片類藥物{{成癮|疾病}}",
    "Duration {{長|性質|短}}"] },
{ id: "op-levomethadyl", chapter: 9, name: "(-)-Levomethadyl（LAAM）", short: "LAAM", type: "drug", group: "僅保留 A 環結構，但與 N 仍間隔 3 個 C：Phenylpropylamine 類", source: "統整（一）p.87", img: "assets/medchem/op-levomethadyl.png",
  feat: ["又名 Levo-alpha-acetylmethadol",
    "立體組態：3S、6S",
    "代謝：{{N-dealkylation|代謝}}，得到均為活性代謝物"],
  pharm: ["用於{{阿片類藥物依賴維持治療|用途}}，效果{{長|性質|短}}"] },
{ id: "op-propoxyphene", chapter: 9, name: "(+)-Propoxyphene", type: "drug", group: "僅保留 A 環結構，但與 N 仍間隔 3 個 C：Phenylpropylamine 類", source: "統整（一）p.87", img: "assets/medchem/op-propoxyphene.png",
  feat: ["(+)-diphenylheptanone 骨架",
    "立體組態：2S、{{3R|結構|3S}}★"],
  pharm: ["Levopropoxyphene 用於{{鎮咳|用途}}★",
    "可能有{{心臟毒性|副作用}}或肺水腫的副作用"] },
{ id: "op-tapentadol", chapter: 9, name: "Tapentadol Hydrochloride", short: "Tapentadol", type: "drug", group: "僅保留 A 環結構，但與 N 仍間隔 3 個 C：Phenylpropylamine 類", source: "統整（一）p.87", img: "assets/medchem/op-tapentadol.png",
  feat: ["A 環上接有 OH 基 →減少活性代謝物在體內的時間"],
  pharm: ["為{{雙效|性質}}阿片類藥物",
    "{{μ-receptor agonist|機轉}}、{{SNRI|藥物類別}}"] },
{ id: "op-thebaine", chapter: 9, name: "Thebaine", type: "drug", group: "東罌粟鹼（Oripavines）及其衍生物", source: "統整（一）p.88", img: "assets/medchem/op-thebaine.png",
  feat: ["具有 {{Phenanthrene|結構}} 結構",
    "Thebaine →[i]去甲基[/i]→ {{Codeine|藥名}} →[i]去甲基[/i]→ Morphine"],
  pharm: ["{{無|性質|有}}阿片受體致效活性",
    "{{痙攣|副作用}}毒性強"] },
{ id: "op-etorphine", chapter: 9, name: "Etorphine", type: "drug", group: "東罌粟鹼（Oripavines）及其衍生物", source: "統整（一）p.88", img: "assets/medchem/op-etorphine.png",
  feat: ["{{高脂溶性|性質|低脂溶性}}，可通過 BBB"],
  pharm: ["μ、κ、δ agonist",
    "毒性強，為{{大型動物|用途}}用藥"] },
{ id: "op-buprenorphine-or", chapter: 9, name: "Buprenorphine", type: "drug", group: "東罌粟鹼（Oripavines）及其衍生物", source: "統整（一）p.88", img: "assets/medchem/op-buprenorphine-or.png",
  feat: ["Etorphine N 上的甲基換成 {{cyclopropylmethyl|取代基}}",
    "→ 變為 partial μ agonist，增加μ受體拮抗活性"],
  pharm: ["μ、κ部分致效劑，δ拮抗劑",
    "{{口服首渡代謝高|性質|口服首渡代謝低}}，以 IV 或舌下給藥",
    "可作為阿片{{解毒劑|用途}}"] },
{ id: "op-apomorphine", chapter: 9, name: "Apomorphine", type: "drug", group: "東罌粟鹼（Oripavines）及其衍生物", source: "統整（一）p.88", img: "assets/medchem/op-apomorphine.png",
  feat: ["四環結構：含有 {{Catechol|結構}} & Piperidine",
    "立體組態：{{R(-)|結構|S(+)}}★ form"],
  pharm: ["強效 {{D₂|受體}} agonist",
    "有{{催吐|用途}}作用，用來治療{{帕金森氏症|疾病}}"] },
{ id: "op-codeine-cough", chapter: 9, name: "Codeine", type: "drug", group: "阿片結構衍生之鎮咳藥物", source: "統整（一）p.89", img: "assets/medchem/op-codeine-cough.png",
  feat: ["Prodrug，為 Morphine 的 {{3-methoxy|取代基}}★衍生物",
    "具有 6α-hydroxyl group",
    "具{{鎮咳|用途}}作用，止痛活性較弱"],
  pharm: ["CYP2D6 進行 O-demethylation，",
    "> 形成{{有活性|性質|無活性}}的 Morphine",
    "CYP3A4 進行 N-demethylation，",
    "> 形成{{無活性|性質}}的 Norcodeine",
    "最後都代謝為弱活性 Normorphine"] },
{ id: "op-dextromethorphan", chapter: 9, name: "Dextromethorphan", type: "drug", group: "阿片結構衍生之鎮咳藥物", source: "統整（一）p.89", img: "assets/medchem/op-dextromethorphan.png",
  feat: ["由 {{Levorphanol|藥名}} 修飾 C₃ 而來",
    "Prodrug，經由 {{CYP2D6|酵素}} 進行 O-demethylation 代謝，",
    "> 得到活性代謝物 Dextrophan"],
  pharm: ["兩者具有鎮咳作用之旋光性相反",
    "結構有 2 個環：{{左止咳|性質|右止咳}}、右止痛",
    "結構有 4 個環：左止痛、{{右止咳|性質|左止咳}}"] },
{ id: "op-levopropoxyphene", chapter: 9, name: "Levopropoxyphene", type: "drug", group: "阿片結構衍生之鎮咳藥物", source: "統整（一）p.89", img: "assets/medchem/op-levopropoxyphene.png",
  feat: ["為(+)-Propoxyphene 的{{鏡像異構物|名詞}}",
    "> （Propoxyphene 屬於 {{Phenylpropylamine|結構}} 類）"],
  pharm: ["兩者具有鎮咳作用之旋光性相反",
    "結構有 2 個環：{{左止咳|性質|右止咳}}、右止痛",
    "結構有 4 個環：左止痛、{{右止咳|性質|左止咳}}"] },
{ id: "op-noscapine", chapter: 9, name: "Noscapine", type: "drug", group: "阿片結構衍生之鎮咳藥物", source: "統整（一）p.89", img: "assets/medchem/op-noscapine.png",
  feat: ["結構含有 {{Isoquinoline|結構}} 類似結構",
    "為{{天然|性質|人工合成}}之鎮咳藥物，可從{{阿片|物質}}中分離而得"],
  pharm: ["{{口服|給藥途徑}}有效，不具成癮性",
    "與 Codeine 效果相似，但麻醉副作用較低"] },
{ id: "op-diphenoxylate", chapter: 9, name: "Diphenoxylate", type: "drug", group: "阿片結構衍生之止瀉藥物", source: "統整（一）p.90", img: "assets/medchem/op-diphenoxylate.png",
  feat: ["經過 esterase {{水解|代謝}}酯基，可形成 Difenoxin",
    "→ 口服止瀉效果提高 {{5 倍|數值}}"],
  pharm: ["與 {{Atropine|藥名}} 併用可加強抑制 ACh 引起的腸胃蠕動"] },
{ id: "op-difenoxin", chapter: 9, name: "Difenoxin", type: "drug", group: "阿片結構衍生之止瀉藥物", source: "統整（一）p.90", img: "assets/medchem/op-difenoxin.png",
  feat: ["為 Diphenoxylate 的活性代謝物",
    "> （經由 esterase 水解產生 {{COOH|結構}} 基團）"],
  pharm: ["極性高，較不會作用在{{中樞|器官}}"] },
{ id: "op-loperamide", chapter: 9, name: "Loperamide", type: "drug", group: "阿片結構衍生之止瀉藥物", source: "統整（一）p.90", img: "assets/medchem/op-loperamide.png",
  feat: ["具有 diphenylpiperidine 骨架",
    "{{高脂溶性|性質|低脂溶性}}，不可使用 IV 注射"],
  pharm: ["用來當作 {{OTC 止瀉劑|用途}}★",
    "沒有中樞μ-agonist 作用",
    "→ 腦中 {{P-gp|標的}} 會將藥物排出★"] },
{ id: "st-caffeine", chapter: 10, name: "Caffeine", type: "drug", group: "Methylxanthine 類", source: "統整（一）p.91", img: "assets/medchem/st-caffeine.png",
  use: ["咖啡因"],
  feat: ["甲基取代：{{1、3、7|位置|1、3/3、7}} 位",
    "臨床應用：{{頭痛|疾病}}、偏頭痛",
    "結構類似 Adenosine，可{{阻斷 Adenosine 受體|機轉}}（抑制性神經遞質），保持清醒",
    "抑制 PDE-4，使 cAMP↑ → 強心、利尿、{{支氣管平滑肌舒張|用途}}",
    "使細胞外 Ca²⁺流入，刺激胃黏膜{{分泌胃酸|副作用}}（不可空腹服用）",
    "副作用：心律不整、胃酸增加、失眠"] },
{ id: "st-theophylline", chapter: 10, name: "Theophylline", type: "drug", group: "Methylxanthine 類", source: "統整（一）p.91", img: "assets/medchem/st-theophylline.png",
  use: ["茶鹼"],
  feat: ["甲基取代：{{1、3|位置|1、3、7/3、7}} 位",
    "臨床應用：{{氣喘|疾病}}",
    "結構類似 Adenosine，可{{阻斷 Adenosine 受體|機轉}}（抑制性神經遞質），保持清醒",
    "抑制 PDE-4，使 cAMP↑ → 強心、利尿、{{支氣管平滑肌舒張|用途}}",
    "使細胞外 Ca²⁺流入，刺激胃黏膜{{分泌胃酸|副作用}}（不可空腹服用）",
    "副作用：心律不整、胃酸增加、失眠"] },
{ id: "st-theobromine", chapter: 10, name: "Theobromine", type: "drug", group: "Methylxanthine 類", source: "統整（一）p.91", img: "assets/medchem/st-theobromine.png",
  use: ["可可鹼"],
  feat: ["甲基取代：{{3、7|位置|1、3、7/1、3}} 位",
    "結構類似 Adenosine，可{{阻斷 Adenosine 受體|機轉}}（抑制性神經遞質），保持清醒",
    "抑制 PDE-4，使 cAMP↑ → 強心、利尿、{{支氣管平滑肌舒張|用途}}",
    "使細胞外 Ca²⁺流入，刺激胃黏膜{{分泌胃酸|副作用}}（不可空腹服用）",
    "副作用：心律不整、胃酸增加、失眠"] },
{ id: "st-nicotine", chapter: 10, name: "Nicotine", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.91", img: "assets/medchem/st-nicotine.png",
  use: ["尼古丁"],
  feat: ["{{高脂溶性|性質|低脂溶性}}，可產生欣快感、改善注意力，用於解焦慮及戒菸",
    "低劑量：刺激中樞尼古丁受體，增加下游釋放 {{Dopamine|物質}}",
    "> 高劑量：作為{{去極化型神經節阻斷劑|機轉}}",
    "副作用：具{{成癮性|副作用}}、{{食慾下降|副作用}}、誘導 {{CYP450|酵素}}"] },
{ id: "st-cocaine", chapter: 10, name: "Cocaine", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.91", img: "assets/medchem/st-cocaine.png",
  use: ["古柯鹼、Crack"],
  feat: ["作用機轉：阻斷{{單胺類|物質}}化合物（NE、5-HT、Dopamine）的{{再回收|機轉}}，會使體溫過高",
    "臨床上作為{{局部麻醉劑|用途}}，可阻斷 Na⁺通道 →{{唯一使血管收縮|性質}}的局部麻醉劑，不須併用收縮劑",
    "代謝：去酯化+去甲基形成 Benzoylecgonine，水解產生 Benzoic acid、Methanol、{{Ecgonine|代謝物}}★",
    "副作用：心律不整、焦慮，可 IV 使用 {{Diazepam|藥名}}、{{Propranolol|藥名}} 控制心律不整和抽搐的症狀"] },
{ id: "st-amphetamine", chapter: 10, name: "Amphetamine", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.92", img: "assets/medchem/st-amphetamine.png",
  use: ["安非他命",
    "【Vol.3 P.12】"],
  feat: ["屬於{{鹼性|性質|酸性}}藥物",
    "基本結構：{{Phenylisopropylamine|結構}}",
    "{{脂溶性高|性質|脂溶性低}}，{{間接|機轉|直接}}作用在神經系統，可釋放細胞內儲存的兒茶酚胺類，也會抑制 MAO",
    "具有 1 個 chiral center，作用大小為：S(+) > (±) > R(-)★",
    "SAR：",
    "- ① 芳香環最好不要有取代基",
    "- ② 胺基：甲基取代最好，且 1°>2°>3°",
    "- ③ α碳取代：α-CH₃ 最好，且 S>R",
    "- ④ β碳取代：{{酮基|取代基}}可保留，其他取代不佳",
    "代謝（不受 {{COMT|酵素}} 代謝）",
    "- 經由α-hydroxylation 和 oxidative deamination 產生 {{phenylacetone|代謝物}}（尿液檢測）",
    "- phenylacetone 再被氧化代謝成 Benzoic acid",
    "- 苯甲酸可和 Glycine 共軛生成最終代謝物 {{Hippuric acid|代謝物}}"] },
{ id: "st-methylphenidate", chapter: 10, name: "Methylphenidate", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.92", img: "assets/medchem/st-methylphenidate.png", imgMore: ["assets/medchem/st-methylphenidate-threo.png"],
  feat: ["具有 2 個 chiral center，包括 {{threo pair|結構|erythro pair}}（活性型）和 erythro pair",
    "Ritalin®為(±)-threo-methylphenidate，臨床上用於治療{{過動症|疾病}}"] },
{ id: "st-mdma", chapter: 10, name: "MDMA", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.92", img: "assets/medchem/st-mdma.png",
  use: ["（搖頭丸、Ecstasy）"],
  feat: ["MDMA = {{Methylenedioxy-methamphetamine|藥名}}，為[u]甲基安非他命[/u]類似物",
    "刺激腦部大量釋出 {{Serotonin|物質}}，並抑制其合成與再回收",
    "高劑量下造成{{體溫過高|副作用}}、幻覺、恐慌、躁動"] },
{ id: "st-strychnine", chapter: 10, name: "Strychnine", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.92",
  feat: ["番木鱉鹼，可抑制 {{Glycine|物質}} 抑制性受體，使中樞興奮而引發{{癲癇|疾病}}"] },
{ id: "st-methylamphetamine", chapter: 10, name: "Methylamphetamine", type: "drug", group: "中樞神經興奮劑", source: "統整（一）p.92",
  feat: ["俗稱 Crystal、Ice，胺基 N 上較 Amphetamine 多了一個{{甲基|取代基}}取代"] },
{ id: "st-lsd", chapter: 10, name: "Lysergic acid diethylamide（LSD）", short: "LSD", type: "drug", group: "迷幻劑（Hallucinogen）", source: "統整（一）p.93", img: "assets/medchem/st-lsd.png",
  feat: ["光學活性：(+)-Lysergic acid",
    "中腦之 {{5-HT₁,₂|受體}} 的血清素受體促效劑",
    "{{Haloperidol|藥名}} 等抗精神病藥物可阻斷 LSD 的迷幻作用，並終止其症狀"] },
{ id: "st-thc", chapter: 10, name: "Tetrahydro-Cannabinol（THC）", short: "THC", type: "drug", group: "迷幻劑（Hallucinogen）", source: "統整（一）p.93", img: "assets/medchem/st-thc.png",
  feat: ["大麻中具神經活性的生物鹼為Δ9-Tetrahydrocannabinol，也稱為 {{Dronabinol|藥名}}",
    "THC 可結合到 {{CB1|受體}} 受體，活化 Gi 受體使 cAMP↓，使抑制型神經遞質無法釋放，間接興奮 VTA，增加 Dopamine 的釋放",
    "臨床用於{{刺激食慾|用途}}★、{{緩和化療之噁心嘔吐|用途}}、口乾、幻覺等"] },
{ id: "st-pcp", chapter: 10, name: "Phencyclidine（PCP）", short: "PCP", type: "drug", group: "迷幻劑（Hallucinogen）", source: "統整（一）p.93", img: "assets/medchem/st-pcp.png",
  feat: ["阻斷{{單胺類|物質}}化合物（NE、5-HT、Dopamine）的再回收：與 Cocaine 相同",
    "抑制 {{NMDA|受體}} 受體，阻斷 Ca²⁺通道：與 {{Ketamine|藥名}}★之結構、作用相同，造成{{解離性|性質}}麻醉",
    "副作用：皮膚過熱、出汗、散瞳、心跳血壓↑"] },

/* ===== 第 11～13 章（統整（一）拾壹 前列腺及 Leukotriene 相關藥物 p.94–97、拾貳 NSAIDs p.98–103、拾參 痛風藥物與疾病修飾抗風濕藥物 p.104–106）===== */
/* 欄位照講義表格（特性／藥理及臨床應用；p.106 生物製劑表只有一欄說明用 desc）。
   第 11 章：一、Prostaglandin 衍生物沒有黑底灰底，章標題就是分類；二、Leukotriene modifiers 的兩個灰底各自為分類。
   第 12 章：黑底為分類，芳香基乙酸類底下兩個灰底（Indomethacin 衍生物／非 Indomethacin 衍生物）用第三層小標。
   第 13 章：痛風藥物底下講義左邊直排的「抑制尿酸生成／促進尿酸排除」用第三層小標，Colchicine 直接屬於痛風藥物；
   DMARDs 自成一類；生物製劑表的「分類」欄各自為分類（掛在生物製劑底下），Mycophenolate mofetil 沒有分類欄，直接屬於生物製劑。
   Leflunomide／Teriflunomide 共用的說明兩個格子都放；Chloroquine／Hydroxychloroquine 各自只放講到自己的句子。
   …＝講義上的粗體字；行首「- 」＝子項目、「> 」＝接續行 */

{ id: "pg-misoprostol", chapter: 11, name: "Misoprostol", type: "drug", group: "Prostaglandin 衍生物", source: "統整（一）p.96", img: "assets/medchem/pg-misoprostol.png",
  feat: ["{{PGE₁|名詞|PGE₂}} 衍生物，只含一個雙鍵",
    "C₁₆ 有{{三級醇|結構}}、{{甲基|取代基}}結構★"],
  pharm: ["{{口服|給藥途徑}}★使用，可抑制胃酸分泌，保護黏膜",
    "→ 與 {{Mifepristone|藥名}} 併用墮胎"] },
{ id: "pg-alprostadil", chapter: 11, name: "Alprostadil", type: "drug", group: "Prostaglandin 衍生物", source: "統整（一）p.96", img: "assets/medchem/pg-alprostadil.png",
  feat: ["{{PGE₁|名詞|PGE₂}} 衍生物，只含一個雙鍵"],
  pharm: ["IV 使用，可使{{血管擴張|用途}}，治療{{陽痿|疾病}}",
    "可讓新生兒{{動脈導管|器官}}開啟",
    "治療陽痿的藥物：Alprostadil、{{Sildenafil|藥名}}、Phentolamine"] },
{ id: "pg-dinoprostone", chapter: 11, name: "Dinoprostone", type: "drug", group: "Prostaglandin 衍生物", source: "統整（一）p.96", img: "assets/medchem/pg-dinoprostone.png",
  feat: ["{{PGE₂|名詞|PGE₁}} 衍生物",
    "與 PGE₁ 相比 5、6 位多了一個{{雙鍵|結構}}"],
  pharm: ["IV 使用，可用來{{人工流產|用途}}"] },
{ id: "pg-treprostinil", chapter: 11, name: "Treprostinil", type: "drug", group: "Prostaglandin 衍生物", source: "統整（一）p.96", img: "assets/medchem/pg-treprostinil.png",
  feat: ["{{PGI₂|名詞|PGE₂}} 衍生物",
    "Epoprostenol 也是 PGI₂ 衍生物，可用來治療肺動脈高血壓"],
  pharm: ["治療{{肺動脈高血壓|疾病}}",
    "Indomethacin、Ibuprofen 會抑制 PGI₂",
    "→ 使新生兒動脈導管{{關閉|性質|開啟}}"] },
{ id: "pg-carboprost", chapter: 11, name: "Carboprost", type: "drug", group: "Prostaglandin 衍生物", source: "統整（一）p.96", img: "assets/medchem/pg-carboprost.png",
  feat: ["{{PGF₂α|名詞|PGE₂}} 衍生物",
    "C₁₅ 有{{三級醇|結構}}、甲基結構★ →增加{{安定性|性質}}"],
  pharm: ["用於{{催生|用途}}、減少產後出血",
    "相似藥物：Latanoprost、Unoprostone"] },
{ id: "lt-zileuton", chapter: 11, name: "Zileuton", type: "drug", group: "5-lipoxygenase inhibitor", source: "統整（一）p.97", img: "assets/medchem/lt-zileuton.png"  },
{ id: "lt-zafirlukast", chapter: 11, name: "Zafirlukast", type: "drug", group: "Leukotriene receptor antagonist", source: "統整（一）p.97", img: "assets/medchem/lt-zafirlukast.png"  },
{ id: "lt-montelukast", chapter: 11, name: "Montelukast", type: "drug", group: "Leukotriene receptor antagonist", source: "統整（一）p.97", img: "assets/medchem/lt-montelukast.png"  },
{ id: "lt-pranlukast", chapter: 11, name: "Pranlukast", type: "drug", group: "Leukotriene receptor antagonist", source: "統整（一）p.97", img: "assets/medchem/lt-pranlukast.png"  },
{ id: "ns-aspirin", chapter: 12, name: "Aspirin", type: "drug", group: "水楊酸衍生物（Salicylic acid derivatives）", source: "統整（一）p.98", img: "assets/medchem/ns-aspirin.png",
  use: ["Acetylsalicylic acid"],
  feat: ["{{脂溶性|性質|水溶性}}，在胃中為非解離型而被吸收",
    "代謝：經 {{esterase|酵素}} 去乙醯化後，形成水楊酸+[u]乙酸[/u]"],
  pharm: ["{{不可逆|性質|可逆}}★抑制 COX",
    "可預防{{心肌梗塞|疾病}}，手術前 7 天禁用",
    "{{痛風|疾病}}及氣喘患者禁用",
    "造成 {{Reye's syndrome|副作用}}"] },
{ id: "ns-diflunisal", chapter: 12, name: "Diflunisal", type: "drug", group: "水楊酸衍生物（Salicylic acid derivatives）", source: "統整（一）p.98", img: "assets/medchem/ns-diflunisal.png",
  feat: ["水楊酸之 C5 以 2,4-difluorophenyl（{{間位|位置|對位/鄰位}}★）取代",
    "→ OH 基[u]{{對位|位置|間位/鄰位}}[/u]苯環取代，增加抗發炎活性"],
  pharm: ["{{可逆|性質|不可逆}}抑制 COX",
    "半衰期{{長|性質|短}}，較不會造成腸胃道出血",
    "不會進入 CNS，故無法{{退燒|用途}}"] },
{ id: "ns-triflusal", chapter: 12, name: "Triflusal", type: "drug", group: "水楊酸衍生物（Salicylic acid derivatives）", source: "統整（一）p.98", img: "assets/medchem/ns-triflusal.png",
  feat: ["COOH 和 CF₃ 為{{對位|位置|間位/鄰位}}關係"] },
{ id: "ns-indomethacin", chapter: 12, name: "Indomethacin", type: "drug", group: "Indomethacin 衍生物", source: "統整（一）p.99", img: "assets/medchem/ns-indomethacin.png",
  feat: ["含有 {{Indole|結構}} 結構",
    "代謝：[u]{{O-demethylation|代謝}}[/u]、Glucuronidation、",
    "> N-dealkylation（非肝代謝）"],
  pharm: ["可治療{{急性痛風|疾病}}、新生兒開放性動脈導管"] },
{ id: "ns-sulindac", chapter: 12, name: "Sulindac", type: "drug", group: "Indomethacin 衍生物", source: "統整（一）p.99", img: "assets/medchem/ns-sulindac.png", imgMore: ["assets/medchem/ns-sulindac-metab.png"],
  feat: ["{{Prodrug|名詞}}，須經肝臟{{還原|代謝}}★成 {{Sulfide|代謝物}}★才有活性",
    "氧化代謝成 Sulfone 失去活性"],
  pharm: ["Indomethacin {{生物等價|名詞}}設計而來",
    "半衰期{{較長|性質|較短}}"] },
{ id: "ns-tolmetin", chapter: 12, name: "Tolmetin", type: "drug", group: "Indomethacin 衍生物", source: "統整（一）p.99", img: "assets/medchem/ns-tolmetin.png", imgMore: ["assets/medchem/ns-tolmetin-metab.png"],
  feat: ["含有 {{pyrrole|結構}}、{{toluene|結構}} 結構",
    "代謝：[i]p[/i]-methyl {{氧化|代謝}}反應形成{{羧酸|代謝物}}代謝物★"] },
{ id: "ns-diclofenac", chapter: 12, name: "Diclofenac", type: "drug", group: "非 Indomethacin 衍生物", source: "統整（一）p.100", img: "assets/medchem/ns-diclofenac.png",
  feat: ["代謝：肝臟 CYP 進行 {{Hydroxylation|代謝}}",
    "→ 3'、4'、5 位加上 OH 基★"] },
{ id: "ns-nabumetone", chapter: 12, name: "Nabumetone", type: "drug", group: "非 Indomethacin 衍生物", source: "統整（一）p.100", img: "assets/medchem/ns-nabumetone.png", imgMore: ["assets/medchem/ns-6mna.png"],
  feat: ["不帶酸根，非酸性的 {{Prodrug|名詞}}",
    "含有 {{naphthalene|結構}} 結構",
    "代謝：主要在 C=O 上反應",
    "- C=O {{氧化|代謝}}成 COOH（6-MNA），具有活性",
    "- C=O {{還原|代謝}}成 OH，失去活性"],
  pharm: ["活性代謝物：{{6-MNA|代謝物}}",
    "經過代謝後才具有乙酸結構"] },
{ id: "ns-mefenamic", chapter: 12, name: "Mefenamic acid", type: "drug", group: "鄰胺基苯甲酸類（N-arylanthranilic acid）：屬於 Fenamates 類", source: "統整（一）p.100", img: "assets/medchem/ns-mefenamic.png",
  feat: ["為 [u]N[/u]-arylanthranilic acid★衍生物",
    "代謝：[i]m[/i]-methyl★接上 {{OH|取代基}}、COOH 接上 {{glucuronide|物質}}"],
  pharm: ["同分類藥物：{{Meclofenamate|藥名}}"] },
{ id: "ns-ibuprofen", chapter: 12, name: "Ibuprofen", type: "drug", group: "芳香基丙酸類（Arylpropionic acid derivatives）", source: "統整（一）p.101", img: "assets/medchem/ns-ibuprofen.png",
  feat: ["屬於 {{Arylpropionic acid|結構}} 衍生物★",
    "代謝：進行ω、{{ω-1|位置|ω/ω-2}}（主要★）、ω-2 氧化反應"] },
{ id: "ns-naproxen", chapter: 12, name: "Naproxen", type: "drug", group: "芳香基丙酸類（Arylpropionic acid derivatives）", source: "統整（一）p.101", img: "assets/medchem/ns-naproxen.png",
  feat: ["含有 {{naphthalene|結構}} 結構",
    "SAR★",
    "- C₆ 的取代基若移位，則抗炎活性降低",
    "- C₆ 甲氧基可換成其他親脂基 Cl、CH₃S、CH₂FO",
    "> （以越大基團取代甲氧基，其活性越低）",
    "- COOH 可換成 CO₂CH₃、CHO、CH₂OH 等基團",
    "> （在體內皆會被氧化代謝回 COOH）"],
  pharm: ["唯一以 {{S(+)|結構|R(-)}} 光學異構物上市★"] },
{ id: "ns-flurbiprofen", chapter: 12, name: "Flurbiprofen", type: "drug", group: "芳香基丙酸類（Arylpropionic acid derivatives）", source: "統整（一）p.101", img: "assets/medchem/ns-flurbiprofen.png",
  feat: ["代謝★：進行{{氧化|代謝}}反應",
    "4'-hydroxy、3',4'-dihydroxy、3'-hydroxy-4'-methoxy"] },
{ id: "ns-oxaprozin", chapter: 12, name: "Oxaprozin", type: "drug", group: "芳香基丙酸類（Arylpropionic acid derivatives）", source: "統整（一）p.101", img: "assets/medchem/ns-oxaprozin.png",
  feat: ["屬於 {{Heteroarylpropionic acid|結構}} 衍生物"],
  pharm: ["Onset {{快|性質|慢}}、Duration {{長|性質|短}}"] },
{ id: "ns-piroxicam", chapter: 12, name: "Piroxicam", type: "drug", group: "Oxicams 類", source: "統整（一）p.102", img: "assets/medchem/ns-piroxicam.png",
  feat: ["含有 {{pyridine|結構}}★結構",
    "代謝：主要在 pyridine 上 carboxamide 的{{對位|位置|間位/鄰位}}★進行",
    "> hydroxylation★"],
  pharm: ["長效型，半衰期 {{50 小時|數值}}",
    "抑制多型核白血球進入發炎部位，並抑制 lysosomal enzyme 的釋放"] },
{ id: "ns-meloxicam", chapter: 12, name: "Meloxicam", type: "drug", group: "Oxicams 類", source: "統整（一）p.102", img: "assets/medchem/ns-meloxicam.png",
  feat: ["含有 {{methyl thiazole|結構}}★結構",
    "代謝：thiazole 上的甲基進行 hydroxylation，再氧化成",
    "> carboxylic acid"] },
{ id: "ns-acetaminophen", chapter: 12, name: "Acetaminophen（Paracetamol）", short: "Acetaminophen", type: "drug", group: "解熱鎮痛藥", source: "統整（一）p.102", img: "assets/medchem/ns-acetaminophen.png",
  use: ["[i]p[/i]-aminophenol 乙醯化產物"],
  feat: ["主要由肝臟進行代謝（在 OH 基上進行代謝）",
    "- 成人：形成 {{O-glucuronide|代謝物}}",
    "- 兒童：形成 {{O-sulfate|代謝物}}",
    "過量時，由其他途徑氧化代謝出毒性代謝物，產生{{肝毒性|副作用}}",
    "> {{N-acetylimidoquinone|代謝物}}（NAPQI）"],
  pharm: ["不具{{抗發炎|性質}}活性",
    "若體內 {{Glutathione|物質}} 下降則毒性↑",
    "解毒劑：{{N-acetylcysteine|藥名}}★"] },
{ id: "ns-celecoxib", chapter: 12, name: "Celecoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-celecoxib.png",
  feat: ["含有 {{phenylpyrazole|結構}}★、sulfonamide、CF₃ 結構",
    "代謝：苯環上的甲基進行 Hydroxylation★形成一級醇，",
    "> 而後再氧化形成羧酸，最後接上 glucuronide"],
  pharm: ["{{磺胺類|藥物類別}}過敏患者不可使用"] },
{ id: "ns-rofecoxib", chapter: 12, name: "Rofecoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-rofecoxib.png",
  feat: ["含有 2-furanone（{{γ-lactone ring|結構}}★）、[i]cis[/i]-stilbenes、",
    "> methanesulfonyl 結構",
    "代謝：[i]cis[/i]-stilbenes 雙鍵被還原、",
    "> lactone 環進行 hydroxylation→O-glucuronidation"],
  pharm: ["對 COX-2 選擇性較 {{Celecoxib|藥名}} 強"] },
{ id: "ns-lumiracoxib", chapter: 12, name: "Lumiracoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-lumiracoxib.png",
  feat: ["代謝：主要由 {{CYP2C9|酵素}} 進行 {{4-hydroxylation|代謝}}★"] },
{ id: "ns-valdecoxib", chapter: 12, name: "Valdecoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-valdecoxib.png",
  feat: ["含有 {{isoxazole|結構}}★"] },
{ id: "ns-parecoxib", chapter: 12, name: "Parecoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-parecoxib.png",
  feat: ["含有 {{isoxazole|結構}}"] },
{ id: "ns-etoricoxib", chapter: 12, name: "Etoricoxib", type: "drug", group: "選擇性 COX-2 抑制劑（字尾-coxib）", source: "統整（一）p.103", img: "assets/medchem/ns-etoricoxib.png",
  feat: ["含有 {{2,3'-bipyridine|結構}}"] },
{ id: "gd-colchicine", chapter: 13, name: "Colchicine", type: "drug", group: "痛風藥物", source: "統整（一）p.104", img: "assets/medchem/gd-colchicine.png",
  feat: ["結構含有 {{2 個七元環|結構}}、{{4 個甲氧基|結構}}"],
  pharm: ["抑制嗜中性白血球{{吞噬|機轉}}作用",
    "與 Indomethacin 用於治療{{急性|性質|慢性}}痛風"] },
{ id: "gd-allopurinol", chapter: 13, name: "Allopurinol", type: "drug", group: "抑制尿酸生成", source: "統整（一）p.104", img: "assets/medchem/gd-allopurinol.png", imgMore: ["assets/medchem/gd-hypoxanthine.png"],
  feat: ["結構與 {{hypoxanthine|物質}}★相似",
    "> （互為同分異構物 {{isostere|名詞}}★）",
    "經 {{Xanthine oxidase|酵素}} 作用主要代謝物為 {{alloxanthine|代謝物}}"],
  pharm: ["{{Xanthine oxidase|酵素}} 抑制劑",
    "{{慢性|性質|急性}}痛風治療首選用藥",
    "併用 {{6-MP|藥名}} 會抑制其代謝"] },
{ id: "gd-febuxostat", chapter: 13, name: "Febuxostat", type: "drug", group: "抑制尿酸生成", source: "統整（一）p.104", img: "assets/medchem/gd-febuxostat.png", imgMore: ["assets/medchem/gd-uric-acid.png"],
  feat: ["非 {{purine|結構}} 結構",
    "尿酸結構（補充結構圖）"],
  pharm: ["{{Xanthine oxidase|酵素}} 抑制劑"] },
{ id: "gd-probenecid", chapter: 13, name: "Probenecid", type: "drug", group: "促進尿酸排除", source: "統整（一）p.104", img: "assets/medchem/gd-probenecid.png",
  feat: ["含有 {{Sulfone|結構}}、Carboxylic acid 結構（對位關係）"],
  pharm: ["抑制尿酸在腎小管的{{再吸收|機轉|分泌}}★"] },
{ id: "gd-sulfinpyrazone", chapter: 13, name: "Sulfinpyrazone", type: "drug", group: "促進尿酸排除", source: "統整（一）p.104", img: "assets/medchem/gd-sulfinpyrazone.png",
  feat: ["含有 3,5-{{pyrazolidine|結構}}dione 結構（含 2N 飽和五元環）",
    "結構中含有 {{3 個|數值|2 個/4 個}}苯環",
    "還原性 {{Sulfide|代謝物}}★產物為 COX 抑制劑，可抗血小板凝集"],
  pharm: ["抑制尿酸在腎小管的{{再吸收|機轉|分泌}}"] },
{ id: "gd-benzbromarone", chapter: 13, name: "Benzbromarone", type: "drug", group: "促進尿酸排除", source: "統整（一）p.104", img: "assets/medchem/gd-benzbromarone.png",
  feat: ["含有 {{Benzofuran|結構}} 結構"],
  pharm: ["可降低血中尿酸濃度並促進排除"] },
{ id: "gd-methotrexate", chapter: 13, name: "Methotrexate", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-methotrexate.png",
  feat: ["葉酸之 4-Amino-4-Deoxy-N¹⁰-methyl",
    "> 衍生物",
    "具有 {{Pteridine|結構}}、{{Glutamate tail|結構}} 結構"],
  pharm: ["{{類風濕性關節炎|疾病}}之首選藥",
    "{{孕婦及哺乳婦|疾病}}禁用",
    "需併用{{葉酸|物質}}減少毒性"] },
{ id: "gd-sulfasalazine", chapter: 13, name: "Sulfasalazine", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-sulfasalazine.png",
  feat: ["具有 {{Diazo|結構}}（N=N）氮氮雙鍵",
    "{{Prodrug|名詞}}，分解產生 Sulfapyridine 和",
    "> {{5-Aminosalicylic acid|代謝物}}"],
  pharm: ["在{{大腸|器官}}被細菌還原成活性代謝物",
    "不可用{{抗生素|藥物類別}}、鐵劑併用",
    "皮膚和尿液會呈{{橘黃色|性質}}"] },
{ id: "gd-leflunomide", chapter: 13, name: "Leflunomide", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-leflunomide.png",
  feat: ["Leflunomide 為 {{Prodrug|名詞}}，isoxazole {{開環|代謝}}★",
    "> 代謝成 Teriflunomide 才有活性"],
  pharm: ["抑制 {{B 細胞|器官}}，減少抗體產生",
    "對嚴重風濕性關節炎有效"] },
{ id: "gd-teriflunomide", chapter: 13, name: "Teriflunomide", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-teriflunomide.png",
  feat: ["Leflunomide 為 {{Prodrug|名詞}}，isoxazole {{開環|代謝}}★",
    "> 代謝成 Teriflunomide 才有活性"],
  pharm: ["抑制 {{B 細胞|器官}}，減少抗體產生",
    "對嚴重風濕性關節炎有效"] },
{ id: "gd-chloroquine", chapter: 13, name: "Chloroquine", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-chloroquine.png",
  pharm: ["Chloroquine 具有{{視網膜毒性|副作用}}"] },
{ id: "gd-hydroxychloroquine", chapter: 13, name: "Hydroxychloroquine", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-hydroxychloroquine.png",
  pharm: ["Hydroxychloroquine 副作用{{較少|性質|較多}}"] },
{ id: "gd-azathioprine", chapter: 13, name: "Azathioprine", type: "drug", group: "疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）", source: "統整（一）p.105", img: "assets/medchem/gd-azathioprine.png",
  feat: ["{{6-Mercaptopurine|藥名}} 之 {{Prodrug|名詞}}"],
  pharm: ["由 {{Xanthine oxidase|酵素}} 代謝，故併用",
    "> {{Allopurinol|藥名}} 會抑制其代謝"] },
{ id: "gd-etanercept", chapter: 13, name: "Etanercept", type: "drug", group: "TNF-α Inhibitor", source: "統整（一）p.106",
  desc: ["非抗體，無輸注反應，為人類 {{IgG|物質}} 抗體的受質。"] },
{ id: "gd-adalimumab", chapter: 13, name: "Adalimumab", type: "drug", group: "TNF-α Inhibitor", source: "統整（一）p.106",
  desc: ["{{全人源抗體|藥物類別}}，有輸注反應（1%）。"] },
{ id: "gd-golimumab", chapter: 13, name: "Golimumab", type: "drug", group: "TNF-α Inhibitor", source: "統整（一）p.106",
  desc: ["{{全人源抗體|藥物類別}}，輸注反應少見。"] },
{ id: "gd-certolizumab", chapter: 13, name: "Certolizumab", type: "drug", group: "TNF-α Inhibitor", source: "統整（一）p.106",
  desc: ["{{人源化抗體|藥物類別}}（Humanized antibody），Onset 較快。"] },
{ id: "gd-infliximab", chapter: 13, name: "Infliximab", type: "drug", group: "TNF-α Inhibitor", source: "統整（一）p.106",
  desc: ["{{人鼠嵌合抗體|藥物類別}}，有輸注反應（20%），須併用 Methotrexate 避免抗體產生、增加藥效。"] },
{ id: "gd-abatacept", chapter: 13, name: "Abatacept", type: "drug", group: "共刺激調節劑（Costimulate Modulator）", source: "統整（一）p.106",
  desc: ["結合到 APC 的 {{CD80/86|受體}} 受體，使其不與 T cell 的 {{CD28|受體}} 受體結合。"] },
{ id: "gd-rituximab", chapter: 13, name: "Rituximab", type: "drug", group: "消耗 B cell（Deplete Peripheral B cell）", source: "統整（一）p.106",
  desc: ["結合到 B cell 的 {{CD20|受體}} 受體。"] },
{ id: "gd-tofacitinib", chapter: 13, name: "Tofacitinib", type: "drug", group: "標靶合成型 DMARDs", source: "統整（一）p.106",
  desc: ["抑制細胞內激酶 Janus Kinase-3（{{JAK3|標的}}）而抑制發炎性細胞激素的生成與傳遞。",
    "口服有效，但具有{{畸胎性|副作用}}，孕婦禁用。"] },
{ id: "gd-anakinra", chapter: 13, name: "Anakinra", type: "drug", group: "IL-1 受體拮抗劑（Interleukin-1 Receptor Antagonist）", source: "統整（一）p.106",
  desc: ["{{IL-1|受體}} 受體拮抗劑。用於 TNF-α Inhibitor 治療失敗的患者。"] },
{ id: "gd-cyclosporine", chapter: 13, name: "Cyclosporine", type: "drug", group: "Calcineurin Inhibitor", source: "統整（一）p.106" ,
  desc: ["結合 {{Cyclophilin|標的|FKBP}}、抑制 {{Calcineurin|標的}}",
    "IL-2 抑制：{{間接|性質|直接}}",
    "副作用：{{腎毒性|副作用|骨髓抑制}}"] },
{ id: "gd-tacrolimus", chapter: 13, name: "Tacrolimus", type: "drug", group: "Calcineurin Inhibitor", source: "統整（一）p.106" ,
  desc: ["抑制 {{Calcineurin|標的}}、結合 {{FKBP|標的|Cyclophilin}}",
    "IL-2 抑制：{{間接|性質|直接}}",
    "副作用：{{腎毒性|副作用|骨髓抑制}}"] },
{ id: "gd-sirolimus", chapter: 13, name: "Sirolimus", type: "drug", group: "mTOR Inhibitor", source: "統整（一）p.106" ,
  desc: ["結合 {{FKBP|標的|Cyclophilin}}、結合 {{mTOR|標的}}",
    "IL-2 抑制：{{直接|性質|間接}}",
    "副作用：{{骨髓抑制|副作用|腎毒性}}"] },
{ id: "gd-mycophenolate", chapter: 13, name: "Mycophenolate mofetil", type: "drug", group: "用於類風濕性關節炎之生物製劑", source: "統整（一）p.106",
  desc: ["抑制 {{purine|物質}} 的 de novo synthesis，進而抑制 T&B cells 的反應。",
    "用於治療器官移植排斥、類風濕性關節炎等。"] },

/* ===== 第 14、15 章（統整（一）拾肆 抗組織胺藥物 p.107–113、拾伍 血清素及相關藥物 p.114–116；p.116 是講義版權頁）===== */
/* 第 14 章：黑底「第一代 H₁-blockers」底下的六個灰底（乙二胺類、乙醇胺醚類、丙胺類、Piperazine 類、TCA 三環結構、其他）用第三層小標；
   二、第二代 H₁-blocker 沒有黑底灰底，章標題就是分類；三、肥大細胞脫粒抑制劑、四、H₂-blockers 的黑底各自為分類。
   第一代 H₁-blockers 的名稱和第 4 章的小分類重複，所以加後綴「（抗組織胺藥物）」。
   講義一列兩個藥共用的說明（Diphenhydramine／Dimenhydrinate、Terfenadine／Fexofenadine、Ebastine／Carebastine、Loratadine／Desloratadine、
   Cromolyn／Nedocromil、Lodoxamide／Pemirolast）兩個格子都放；只講到其中一個藥的句子（Carebastine 的半衰期）只放那一格。
   第 15 章：p.114 的表格欄位是作用／適應症／備註（act／ind／rmk，新增在 PI.UNIT_FIELDS）；p.115 結構圖上方的說明用 desc；
   p.115 的灰底（5-HT₁ agonist／5-HT₂ antagonist／5-HT₃ antagonist／5-HT₄ agonist）沒有黑底，灰底就是分類本身，兩個 5-HT₂ antagonist 灰底是同一類。
   行首「- 」＝子項目、「> 」＝接續行 */

{ id: "ah-phenbenzamine", chapter: 14, name: "Phenbenzamine", type: "drug", group: "乙二胺類（Ethylenediamine）", source: "統整（一）p.107", img: "assets/medchem/ah-phenbenzamine.png"  },
{ id: "ah-tripelennamine", chapter: 14, name: "Tripelennamine", type: "drug", group: "乙二胺類（Ethylenediamine）", source: "統整（一）p.107", img: "assets/medchem/ah-tripelennamine.png"  },
{ id: "ah-antazoline", chapter: 14, name: "Antazoline", type: "drug", group: "乙二胺類（Ethylenediamine）", source: "統整（一）p.107", img: "assets/medchem/ah-antazoline.png",
  feat: ["接 {{imidazoline|結構}} 環"] },
{ id: "ah-diphenhydramine", chapter: 14, name: "Diphenhydramine", type: "drug", group: "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）", source: "統整（一）p.108", img: "assets/medchem/ah-diphenhydramine.png", imgMore: ["assets/medchem/ah-chlorotheophylline.png"],
  feat: ["Dimenhydrinate 為 Diphenhydramine★的 {{8-chlorotheophyllinate|結構}} salt",
    "→ 減少{{中樞抑制|副作用}}的作用"],
  pharm: ["{{Antimuscarinic|機轉}} 最強，可穿過 BBB → 緩解{{帕金森氏症|疾病}}",
    "{{鎮靜|副作用}}作用強，當作{{助眠劑|用途}}★"] },
{ id: "ah-dimenhydrinate", chapter: 14, name: "Dimenhydrinate", type: "drug", group: "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）", source: "統整（一）p.108", img: "assets/medchem/ah-diphenhydramine.png", imgMore: ["assets/medchem/ah-chlorotheophylline.png"],
  feat: ["Dimenhydrinate 為 Diphenhydramine★的 {{8-chlorotheophyllinate|結構}} salt",
    "→ 減少{{中樞抑制|副作用}}的作用"],
  pharm: ["{{Antimuscarinic|機轉}} 最強，可穿過 BBB → 緩解{{帕金森氏症|疾病}}",
    "{{鎮靜|副作用}}作用強，當作{{助眠劑|用途}}★"] },
{ id: "ah-doxylamine", chapter: 14, name: "Doxylamine", type: "drug", group: "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）", source: "統整（一）p.108", img: "assets/medchem/ah-doxylamine.png"  },
{ id: "ah-carbinoxamine", chapter: 14, name: "Carbinoxamine", type: "drug", group: "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）", source: "統整（一）p.108", img: "assets/medchem/ah-carbinoxamine.png"  },
{ id: "ah-clemastine", chapter: 14, name: "Clemastine", type: "drug", group: "乙醇胺醚類（Aminoalkyl ethers / Ethanolamine ethers）", source: "統整（一）p.108", img: "assets/medchem/ah-clemastine.png",
  feat: ["含環狀烷基胺，減少{{鎮靜|副作用}}",
    "具有 {{pyrrolidine|結構}}★結構"] },
{ id: "ah-pheniramine", chapter: 14, name: "Pheniramine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-pheniramine.png"  },
{ id: "ah-triprolidine", chapter: 14, name: "Triprolidine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-triprolidine.png"  },
{ id: "ah-phenindamine", chapter: 14, name: "Phenindamine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-phenindamine.png"  },
{ id: "ah-pyrrobutamine", chapter: 14, name: "Pyrrobutamine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-pyrrobutamine.png",
  feat: ["具有 {{pyrrole|結構}}★結構",
    "常做成 {{diphosphate|物質}} 鹽類"] },
{ id: "ah-chlorpheniramine", chapter: 14, name: "Chlorpheniramine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-chlorpheniramine.png"  },
{ id: "ah-brompheniramine", chapter: 14, name: "Brompheniramine", type: "drug", group: "丙胺類（Propylamines）", source: "統整（一）p.108", img: "assets/medchem/ah-brompheniramine.png"  },
{ id: "ah-meclizine", chapter: 14, name: "Meclizine", type: "drug", group: "Piperazine 類（字尾-zine）", source: "統整（一）p.109", img: "assets/medchem/ah-meclizine.png"  },
{ id: "ah-buclizine", chapter: 14, name: "Buclizine", type: "drug", group: "Piperazine 類（字尾-zine）", source: "統整（一）p.109", img: "assets/medchem/ah-buclizine.png"  },
{ id: "ah-hydroxyzine", chapter: 14, name: "Hydroxyzine", type: "drug", group: "Piperazine 類（字尾-zine）", source: "統整（一）p.109", img: "assets/medchem/ah-hydroxyzine.png",
  feat: ["氧化代謝形成 {{Cetirizine|代謝物}}"] },
{ id: "ah-promethazine", chapter: 14, name: "Promethazine", type: "drug", group: "TCA 三環結構", source: "統整（一）p.109", img: "assets/medchem/ah-promethazine.png",
  feat: ["含有 {{phenothiazine|結構}}★結構"],
  pharm: ["具有抗組織胺、{{止吐|用途}}、治療{{動暈症|疾病}}的作用"] },
{ id: "ah-cyproheptadine", chapter: 14, name: "Cyproheptadine", type: "drug", group: "TCA 三環結構", source: "統整（一）p.109", img: "assets/medchem/ah-cyproheptadine.png",
  feat: ["含有 {{dibenzocycloheptenes|結構}}★結構"],
  pharm: ["可拮抗 H₁、{{5-HT₂A|受體}}：抗組織胺、刺激{{食慾|用途}}"] },
{ id: "ah-doxepin", chapter: 14, name: "Doxepin", type: "drug", group: "TCA 三環結構", source: "統整（一）p.109", img: "assets/medchem/ah-doxepin.png",
  feat: ["含有 {{dibenzoxepine|結構}} 結構",
    "{{E form|結構|Z form}} 較穩定但 {{Z form|結構|E form}} 活性較大"],
  pharm: ["同時為三環抗憂鬱藥，可抑制 NE/5-HT 再回收",
    "具有強力抗組織胺作用"] },
{ id: "ah-levocabastine", chapter: 14, name: "Levocabastine", type: "drug", group: "其他（第一代 H₁-blockers）", source: "統整（一）p.109", img: "assets/medchem/ah-levocabastine.png",
  feat: ["含有 {{C≡N|結構}} 結構"],
  pharm: ["{{局部用|給藥途徑}}抗組織胺，主要用於{{眼部止癢|用途}}"] },
{ id: "ah-terfenadine", chapter: 14, name: "Terfenadine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-terfenadine.png",
  feat: ["經 {{CYP3A4|酵素}} 氧化★代謝成活性代謝物 Fexofenadine",
    "> （箭頭處：CH₃ → COOH）"],
  pharm: ["與 Erythromycin、Clarithromycin 併用有 {{QT 延長|副作用}}作用",
    "→ 影響 {{K⁺|離子}}通道"] },
{ id: "ah-fexofenadine", chapter: 14, name: "Fexofenadine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-terfenadine.png",
  feat: ["經 {{CYP3A4|酵素}} 氧化★代謝成活性代謝物 Fexofenadine",
    "> （箭頭處：CH₃ → COOH）"],
  pharm: ["與 Erythromycin、Clarithromycin 併用有 {{QT 延長|副作用}}作用",
    "→ 影響 {{K⁺|離子}}通道"] },
{ id: "ah-ebastine", chapter: 14, name: "Ebastine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-ebastine.png",
  feat: ["具有 {{piperidine|結構}} 結構",
    "經 {{CYP3A4|酵素}} 氧化代謝成活性代謝物 Carebastine★",
    "> （箭頭處：CH₃ → COOH）"] },
{ id: "ah-carebastine", chapter: 14, name: "Carebastine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-ebastine.png",
  feat: ["具有 {{piperidine|結構}} 結構",
    "經 {{CYP3A4|酵素}} 氧化代謝成活性代謝物 Carebastine★",
    "> （箭頭處：CH₃ → COOH）"],
  pharm: ["Carebastine 半衰期↑心毒性↓"] },
{ id: "ah-cetirizine", chapter: 14, name: "Cetirizine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-cetirizine.png",
  feat: ["具有 {{piperazine|結構}} 結構",
    "由 {{Hydroxyzine|藥名}} 氧化代謝而來"] },
{ id: "ah-loratadine", chapter: 14, name: "Loratadine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-loratadine.png",
  feat: ["將 {{Carbamate|結構}} 切掉後形成活性代謝物 Desloratadine",
    "> （圈起來部分為 Carbamate 結構）",
    "{{benzopyridinocycloheptenes|結構}} 衍生物"] },
{ id: "ah-desloratadine", chapter: 14, name: "Desloratadine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.110", img: "assets/medchem/ah-loratadine.png",
  feat: ["將 {{Carbamate|結構}} 切掉後形成活性代謝物 Desloratadine",
    "> （圈起來部分為 Carbamate 結構）",
    "{{benzopyridinocycloheptenes|結構}} 衍生物"] },
{ id: "ah-rupatadine", chapter: 14, name: "Rupatadine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.111", img: "assets/medchem/ah-rupatadine.png",
  feat: ["結構與 {{Loratadine|藥名}} 相似",
    "含有 {{pyridine|結構}} 雜環"] },
{ id: "ah-acrivastine", chapter: 14, name: "Acrivastine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.111", img: "assets/medchem/ah-acrivastine.png",
  feat: ["含有 pyridine、{{pyrrole|結構}} 雜環"] },
{ id: "ah-mizolastine", chapter: 14, name: "Mizolastine", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.111", img: "assets/medchem/ah-mizolastine.png",
  feat: ["含有 {{Benzimidazole|結構}} 結構"] },
{ id: "ah-astemizole", chapter: 14, name: "Astemizole", type: "drug", group: "第二代 H₁-blockers", source: "統整（一）p.111", img: "assets/medchem/ah-astemizole.png",
  feat: ["含有 {{Benzimidazole|結構}} 結構"] },
{ id: "ah-cromolyn", chapter: 14, name: "Cromolyn", type: "drug", group: "肥大細胞脫粒抑制劑（Mast cell degranulation inhibitors）：抑制組織胺釋放", source: "統整（一）p.112", img: "assets/medchem/ah-cromolyn.png",
  feat: ["含有 {{bis-chromones|結構}}★結構",
    "含有 COOH，水溶性佳：不進入 BBB"],
  pharm: ["抑制肥大細胞{{囊泡破裂|機轉}}，防止組織胺釋放",
    "沒有抗組織胺及抗發炎活性",
    "[u]預防[/u]氣喘及過敏症狀",
    "→ {{急性使用沒有效果|性質}}"] },
{ id: "ah-nedocromil", chapter: 14, name: "Nedocromil", type: "drug", group: "肥大細胞脫粒抑制劑（Mast cell degranulation inhibitors）：抑制組織胺釋放", source: "統整（一）p.112", img: "assets/medchem/ah-nedocromil.png",
  feat: ["含有 {{chromones|結構}} 結構",
    "含有 COOH，水溶性佳：不進入 BBB"],
  pharm: ["抑制肥大細胞{{囊泡破裂|機轉}}，防止組織胺釋放",
    "沒有抗組織胺及抗發炎活性",
    "[u]預防[/u]氣喘及過敏症狀",
    "→ {{急性使用沒有效果|性質}}"] },
{ id: "ah-lodoxamide", chapter: 14, name: "Lodoxamide", type: "drug", group: "肥大細胞脫粒抑制劑（Mast cell degranulation inhibitors）：抑制組織胺釋放", source: "統整（一）p.112", img: "assets/medchem/ah-lodoxamide.png",
  pharm: ["肥大細胞{{穩定劑|藥物類別}}，可抑制突發性過敏",
    "可防止 {{IgE|物質}} 和抗原結合"] },
{ id: "ah-pemirolast", chapter: 14, name: "Pemirolast", type: "drug", group: "肥大細胞脫粒抑制劑（Mast cell degranulation inhibitors）：抑制組織胺釋放", source: "統整（一）p.112", img: "assets/medchem/ah-pemirolast.png",
  feat: ["含有 {{tetrazole|結構}}★結構（COOH 之等效結構），為酸性雜環"],
  pharm: ["肥大細胞{{穩定劑|藥物類別}}，可抑制突發性過敏",
    "可防止 {{IgE|物質}} 和抗原結合"] },
{ id: "ah-cimetidine", chapter: 14, name: "Cimetidine", type: "drug", group: "H₂-blockers", source: "統整（一）p.113", img: "assets/medchem/ah-cimetidine.png", imgMore: ["assets/medchem/ah-cyanoguanidine.png"],
  feat: ["雜環結構：{{imidazole|結構}}★",
    "含有 {{N-cyanoimino|結構}}★、Guanidine、{{S|取代基}}★結構"],
  pharm: ["含 imidazole，會抑制 {{CYP450|酵素}}★",
    "副作用：{{男性女乳症|副作用}}、陽痿"] },
{ id: "ah-ranitidine", chapter: 14, name: "Ranitidine", type: "drug", group: "H₂-blockers", source: "統整（一）p.113", img: "assets/medchem/ah-ranitidine.png",
  feat: ["雜環結構：{{furan|結構}}★",
    "含有 {{nitromethylene|結構}}★結構"] },
{ id: "ah-nizatidine", chapter: 14, name: "Nizatidine", type: "drug", group: "H₂-blockers", source: "統整（一）p.113", img: "assets/medchem/ah-nizatidine.png",
  feat: ["雜環結構：{{thiazole|結構}}★"],
  pharm: ["口服生物可用率{{最高|性質|最低}}★",
    "半衰期短，代謝物仍有活性"] },
{ id: "ah-famotidine", chapter: 14, name: "Famotidine", type: "drug", group: "H₂-blockers", source: "統整（一）p.113", img: "assets/medchem/ah-famotidine.png",
  feat: ["雜環結構：thiazole",
    "含有 {{aminosulfonyl|結構}}、guanidine 結構"],
  pharm: ["藥效{{最強|性質|最弱}}"] },
{ id: "se-fluoxetine", chapter: 15, name: "Fluoxetine", type: "drug", group: "Selective Serotonin Reuptake Inhibitors（SSRIs）", source: "統整（一）p.114",
  act: ["阻斷 5-HT {{再吸收|機轉}}"],
  ind: ["{{憂鬱症|疾病}}（首選）"],
  rmk: ["體重增加、性功能障礙"] },
{ id: "se-sertraline", chapter: 15, name: "Sertraline", type: "drug", group: "Selective Serotonin Reuptake Inhibitors（SSRIs）", source: "統整（一）p.114",
  act: ["阻斷 5-HT {{再吸收|機轉}}"],
  ind: ["{{憂鬱症|疾病}}（首選）"],
  rmk: ["體重增加、性功能障礙"] },
{ id: "se-buspirone", chapter: 15, name: "Buspirone", type: "drug", group: "5-HT₁ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-buspirone.png",
  desc: ["屬於 {{Azapirone|藥物類別}} 類藥物"],
  act: ["5-HT₁A {{partial agonist|機轉|full agonist}}"],
  ind: ["{{抗焦慮|用途}}"],
  rmk: ["無抗痙攣及肌肉鬆弛活性"] },
{ id: "se-almotriptan", chapter: 15, name: "Almotriptan", type: "drug", group: "5-HT₁ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-almotriptan.png",
  desc: ["具有 {{Sulfonamide|結構}}、Indole 結構"],
  act: ["5-HT₁B & 5-HT₁D {{agonist|機轉|antagonist}}",
    "使{{腦部血管收縮|機轉}}"],
  ind: ["預防{{偏頭痛|疾病}}"],
  rmk: ["禁用 {{Ergot|藥物類別}}、MAOI",
    "會造成{{血清素症候群|副作用}}",
    "冠狀動脈患者禁用"] },
{ id: "se-sumatriptan", chapter: 15, name: "Sumatriptan", type: "drug", group: "5-HT₁ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-sumatriptan.png",
  desc: ["具有 {{Sulfonamide|結構}}、Indole 結構"],
  act: ["5-HT₁B & 5-HT₁D {{agonist|機轉|antagonist}}",
    "使{{腦部血管收縮|機轉}}"],
  ind: ["預防{{偏頭痛|疾病}}"],
  rmk: ["禁用 {{Ergot|藥物類別}}、MAOI",
    "會造成{{血清素症候群|副作用}}",
    "冠狀動脈患者禁用"] },
{ id: "se-rizatriptan", chapter: 15, name: "Rizatriptan", type: "drug", group: "5-HT₁ agonist", source: "統整（一）p.115", img: "assets/medchem/se-rizatriptan.png",
  desc: ["將 Sumatriptan 的 sulfonamide 改為 {{triazole|結構}}，脂溶性增加，可治療偏頭痛"] },
{ id: "se-methysergide", chapter: 15, name: "Methysergide", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-methysergide.png",
  act: ["5-HT₂ {{antagonist|機轉|agonist}}"],
  ind: ["預防偏頭痛"],
  rmk: ["造成{{腹部纖維化|副作用}}"] },
{ id: "se-ergotamine", chapter: 15, name: "Ergotamine", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-ergotamine.png",
  act: ["5-HT₂ antagonist",
    "使血管收縮、刺激子宮"],
  ind: ["預防偏頭痛",
    "{{Ergonovine|藥名}} 治產後大出血"],
  rmk: ["冠狀動脈患者禁用",
    "血清素症候群"] },
{ id: "se-trazodone", chapter: 15, name: "Trazodone", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-trazodone.png",
  act: ["5-HT₂ antagonist"],
  ind: ["{{憂鬱症|疾病}}"],
  rmk: ["鎮靜、低血壓"] },
{ id: "se-cyproheptadine", chapter: 15, name: "Cyproheptadine", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-cyproheptadine.png",
  act: ["5-HT₂、{{H₁|受體}} antagonist"],
  ind: ["{{過敏|疾病}}"],
  rmk: ["{{嗜睡|副作用}}"] },
{ id: "se-risperidone", chapter: 15, name: "Risperidone", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-risperidone.png",
  act: ["5-HT₂ antagonist"],
  ind: ["{{精神分裂症|疾病}}"],
  rmk: ["高泌乳血症、{{QT 延長|副作用}}"] },
{ id: "se-clozapine", chapter: 15, name: "Clozapine", type: "drug", group: "5-HT₂ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-clozapine.png",
  act: ["5-HT₂ antagonist"],
  ind: ["{{精神分裂症|疾病}}"],
  rmk: ["高泌乳血症、{{QT 延長|副作用}}"] },
{ id: "se-ondansetron", chapter: 15, name: "Ondansetron", type: "drug", group: "5-HT₃ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-ondansetron.png",
  desc: ["與 Molindone 同為 {{β-aminoketone|結構}}"],
  act: ["5-HT₃ {{antagonist|機轉|agonist}}"],
  ind: ["治療術後或化療{{嘔吐|疾病}}"],
  rmk: ["便祕、頭痛"] },
{ id: "se-alosetron", chapter: 15, name: "Alosetron", type: "drug", group: "5-HT₃ antagonist", source: "統整（一）p.114–115", img: "assets/medchem/se-alosetron.png",
  act: ["5-HT₃ {{antagonist|機轉|agonist}}"],
  ind: ["{{腹瀉型腸躁症|疾病}}"],
  rmk: ["便祕"] },
{ id: "se-tegaserod", chapter: 15, name: "Tegaserod", type: "drug", group: "5-HT₄ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-tegaserod.png",
  desc: ["含有 {{Indole|結構}} 結構"],
  act: ["5-HT₄ {{agonist|機轉|antagonist}}"],
  ind: ["{{便祕型腸躁症|疾病}}"],
  rmk: ["腹瀉"] },
{ id: "se-metoclopramide", chapter: 15, name: "Metoclopramide", type: "drug", group: "5-HT₄ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-metoclopramide.png",
  act: ["5-HT₄ agonist、{{D₂|受體}} 拮抗劑",
    "可釋放 ACh 促進腸胃蠕動"],
  ind: ["促進腸胃蠕動",
    "強效{{止吐劑|用途}}"] },
{ id: "se-cisapride", chapter: 15, name: "Cisapride", type: "drug", group: "5-HT₄ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-cisapride.png",
  act: ["5-HT₄ agonist"],
  ind: ["胃食道逆流、胃痙攣"],
  rmk: ["心律不整、{{QT 延長|副作用}}"] },

/* ===== 第 16 章 利尿劑（統整（三）柒，p.39–46）===== */
{ id: "diu-location", chapter: 16, name: "利尿劑作用位置總論", short: "作用位置", type: "topic", group: "總論", source: "統整（三）p.39",
  bold: [
    "近曲小管：{{碳酸酐酶抑制劑|藥物類別}}（Acetazolamide、Dichlorphenamide）",
    "亨氏套上升支：{{環利尿劑|藥物類別}} Loop（Furosemide、Bumetanide、Torsemide、Ethacrynic acid）",
    "遠曲小管：{{Thiazides|藥物類別}} 利尿劑（Chlorothiazide、Metolazone、Chlorthalidone、Indapamide）",
    "集尿管（阻斷 NaCl）：{{保鉀型利尿劑|藥物類別}}（Spironolactone、Eplerenone、Triamterene、Amiloride）",
    "集尿管（阻斷 H₂O）：抗利尿激素受體拮抗劑 ADH antagonist（{{Tolvaptan|藥名}}）"
  ] },
{ id: "osmotic-intro", chapter: 16, name: "滲透壓型利尿劑總論", short: "滲透壓總論", type: "topic", group: "滲透壓型利尿劑", source: "統整（三）p.40",
  bold: [
    "滲透壓型利尿劑作用在{{亨、近、集|位置}}，副作用為{{心衰竭|副作用}}",
    "可自由通過{{鮑氏囊|器官}}進入腎小管，不會被再吸收（含豐富 OH 基、水溶性極高）",
    "管腔內{{滲透壓增加|機轉}}，使水分從血管進入腎小管",
    "其他類：醣類 Glucose、Sucrose；尿素（{{Urea|物質}}）不具多羥基，但過去還是當作 Osmotic diuretics 使用"
  ] },
{ id: "mannitol", chapter: 16, name: "Mannitol", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/mannitol.png",
  use: ["{{滲透壓型利尿劑|用途}}：最被廣泛使用", "口服吸收不佳，容易被腎小球過濾，但{{不被腎小管再吸收|性質}}★"],
  bold: ["屬於 {{Polyol|結構}} 類（多羥基）化合物", "Mannitol 與 Sorbitol 兩者互為 {{R、S 異構物|性質}}（2-OH 方向不同）", "兩者作用機轉相同"] },
{ id: "sorbitol", chapter: 16, name: "Sorbitol", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/sorbitol.png",
  use: ["{{滲透壓型利尿劑|用途}}"],
  bold: ["與 Mannitol 互為 {{R、S 異構物|性質}}（2-OH 方向不同）", "兩者作用機轉相同"] },
{ id: "isosorbide", chapter: 16, name: "Isosorbide", type: "drug", group: "滲透壓型利尿劑", source: "統整（三）p.40", img: "assets/medchem/isosorbide.png",
  use: ["可口服", "同時可{{降低眼壓|用途}}，治療青光眼 → 降眼壓效果較利尿效果強", "衍生物 Isosorbide Dinitrate 可治療心絞痛"],
  bold: ["為 Sorbitol 之{{雙五環|結構}}★型態（將 Sorbitol 環化）"] },

{ id: "cai-intro", chapter: 16, name: "碳酸酐酶抑制劑總論", short: "CAI 總論", type: "topic", group: "碳酸酐酶抑制劑", source: "統整（三）p.41",
  bold: [
    "碳酸酐酶抑制劑作用在{{近曲小管|位置}}，字尾 -amide",
    "CA 催化 CO₂+H₂O → {{H₂CO₃|物質}}，碳酸解離為 H⁺+HCO₃⁻",
    "H⁺分泌到腎小管交換 Na⁺、HCO₃⁻再吸收（吸鈉留水）；CAI 抑制此反應使 {{Na⁺|離子}} 無法再吸收",
    "作用點太前面，一般用以治療{{青光眼|疾病}}；副作用：{{代謝性酸中毒|副作用}}"
  ] },
{ id: "acetazolamide", chapter: 16, name: "Acetazolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/acetazolamide.png",
  use: ["{{碳酸酐酶抑制劑|用途}}：可用於急性高山症、青光眼、癲癇、代謝性鹼中毒、尿液鹼化劑", "會產生全身性{{酸中毒|副作用}}，使用上受限制"],
  bold: ["具有 {{thiadiazole|結構}}★結構", "本類藥物皆含有 {{Sulfonamide|結構}}★結構", "第一個{{口服有效|性質}}的 CA 抑制劑"] },
{ id: "methazolamide", chapter: 16, name: "Methazolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/methazolamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["與 Acetazolamide 差別僅在 thiadiazole 環 N 上有{{甲基|取代基}}取代 → 增加藥物{{脂溶性|性質}}，使其更容易進入眼內"] },
{ id: "ethoxzolamide", chapter: 16, name: "Ethoxzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/ethoxzolamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["具 {{1,3-benzothiazole|結構}} 結構", "Sulfonamide 接在雜環上", "具有{{乙氧基|取代基}}（ethoxy）"] },
{ id: "dichlorphenamide", chapter: 16, name: "Dichlorphenamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/dichlorphenamide.png",
  use: ["碳酸酐酶抑制劑"],
  bold: ["具有 {{disulfonamide|結構}}★結構", "{{沒有 thiazole ring|結構}}★：與 Acetazolamide 不同", "2、3 位上有 {{Cl|取代基}} 取代"] },
{ id: "dorzolamide", chapter: 16, name: "Dorzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/dorzolamide.png",
  use: ["僅適用於{{青光眼|疾病}}的眼部局部給藥"],
  bold: ["具有可解離的 {{2 級胺|結構}}結構", "仍具相當脂溶性，可穿透角膜"] },
{ id: "brinzolamide", chapter: 16, name: "Brinzolamide", type: "drug", group: "碳酸酐酶抑制劑", source: "統整（三）p.41", img: "assets/medchem/brinzolamide.png",
  use: ["僅適用於{{青光眼|疾病}}的眼部局部給藥"],
  bold: ["與 Dorzolamide 類似，具可解離的 {{2 級胺|結構}}結構，可穿透角膜"] },

{ id: "thiazide-sar", chapter: 16, name: "Thiazide 利尿劑 SAR", short: "Thiazide SAR", type: "topic", group: "Thiazide", source: "統整（三）p.42", img: "assets/medchem/benzothiadiazine.png",
  bold: [
    "Thiazide（Benzothiadiazine）主要作用在{{遠曲小管|位置}}，競爭 Na⁺/Cl⁻通道的氯離子結合位 → 抑制 Na⁺、Cl⁻再吸收",
    "副作用：{{低血鉀|副作用}}（Na⁺-K⁺ pump 補償使 K⁺被分泌）",
    "具有 benzothiadiazine {{1,1-dioxide|結構}} 基本結構，C₇上須有磺胺基-SO₂NH₂，呈{{弱酸性|性質}}",
    "若 3、4 號間的雙鍵{{飽和|性質|不飽和}}，則利尿活性上升★（Hydrochlorothiazide>Chlorothiazide）",
    "{{3 號位|位置}}★上的親脂基團決定 Potency 及 Duration",
    "藥物合成：Chloraminophenamide 與 {{Acylating agents|物質}} 環化可得 Thiazide；與 Aldehydes 脫水環化可得 Hydrothiazide"
  ] },
{ id: "chlorothiazide", chapter: 16, name: "Chlorothiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42", img: "assets/medchem/chlorothiazide.png",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團：{{H|取代基}}", "3、4 號間為{{不飽和雙鍵|結構|飽和單鍵}}（活性較 Hydrochlorothiazide 低）", "C₂的磺胺基酸度較大★，容易和 NaOH 形成水溶性鈉鹽"] },
{ id: "hydrochlorothiazide", chapter: 16, name: "Hydrochlorothiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42", img: "assets/medchem/hydrochlorothiazide.png",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["與 Chlorothiazide 僅差在 3、4 號間{{不飽和雙鍵|結構}}飽和 → 利尿{{活性上升|性質}}★", "3 號位親脂基團：{{H|取代基}}"] },
{ id: "benzthiazide", chapter: 16, name: "Benzthiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{benzylthiomethyl|取代基}}（-CH₂-S-benzyl）", "3、4 號間為{{不飽和雙鍵|結構}}"] },
{ id: "methyclothiazide", chapter: 16, name: "Methyclothiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{ClCH₂|取代基}}", "2 號 N 上有{{甲基|取代基}}取代"] },
{ id: "trichlormethiazide", chapter: 16, name: "Trichlormethiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{CHCl₂|取代基}}（二氯甲基）", "3、4 號間為{{飽和單鍵|結構}}"] },
{ id: "polythiazide", chapter: 16, name: "Polythiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為 {{-CH₂-S-CH₂CF₃|取代基}}", "2 號 N 上有{{甲基|取代基}}取代"] },
{ id: "hydroflumethiazide", chapter: 16, name: "Hydroflumethiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團：{{H|取代基}}", "6 號位為 {{CF₃|取代基}}（非 Cl）"] },
{ id: "bendroflumethiazide", chapter: 16, name: "Bendroflumethiazide", type: "drug", group: "Thiazide", source: "統整（三）p.42",
  use: ["{{Thiazide 利尿劑|用途}}"],
  bold: ["3 號位親脂基團為{{苯環|取代基}}（benzyl）", "6 號位為 {{CF₃|取代基}}"] },
{ id: "metolazone", chapter: 16, name: "Metolazone", type: "drug", group: "Thiazide-like", source: "統整（三）p.43", img: "assets/medchem/metolazone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["不含 Benzothiadiazine 結構，但仍有 {{Sulfonamide|結構}} 結構★，與 Thiazide 有類似作用", "由 Thiazide 之 1(4) 號位的 {{Sulfone|取代基}} 基團置換成 {{C=O|取代基}}★所得", "2 號 N 上有 {{Toluidine|取代基}} 取代基", "3 號 C 上接{{甲基|取代基}}"] },
{ id: "quinethazone", chapter: 16, name: "Quinethazone", type: "drug", group: "Thiazide-like", source: "統整（三）p.43", img: "assets/medchem/quinethazone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["與 Metolazone 一樣含有 {{Quinazolinone|結構}} 雜環★", "2 號 N 上{{沒有取代基|結構}}", "3 號 C 上接{{乙基|取代基}}"] },
{ id: "chlorthalidone", chapter: 16, name: "Chlorthalidone", type: "drug", group: "Thiazide-like", source: "統整（三）p.43", img: "assets/medchem/chlorthalidone.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["屬於 {{Phthalimidine|結構}}★類衍生物", "代謝：在體內會{{開環|代謝}}（含 Benzophenone 結構）"] },
{ id: "indapamide", chapter: 16, name: "Indapamide", type: "drug", group: "Thiazide-like", source: "統整（三）p.43", img: "assets/medchem/indapamide.png",
  use: ["{{Thiazide-like 利尿劑|用途}}"],
  bold: ["屬於 {{Indoline|結構}} 類衍生物", "代謝：透過羥基化、水解、酯化、氧化{{四種|數值}}路徑代謝"] },

{ id: "loop-intro", chapter: 16, name: "環利尿劑總論", short: "環利尿劑總論", type: "topic", group: "環利尿劑", source: "統整（三）p.44",
  bold: [
    "環利尿劑作用在{{亨氏套粗上升支|位置}}的 Na⁺/K⁺/2Cl⁻通道",
    "Onset 快、Duration 短，利尿效果較其他類佳，故稱 {{High-Ceiling|名詞}} Diuretics",
    "此類藥物較無類似結構，是因相似的藥理作用而歸類在一起"
  ] },
{ id: "furosemide", chapter: 16, name: "Furosemide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/furosemide.png",
  use: ["{{環利尿劑|用途}}", "酸性強（因具有-COOH）", "2 號位取代基影響活性：{{furfuryl|取代基}}>benzyl>thienylmethyl★"],
  bold: ["{{ortho-aminobenzoic acid|結構}}★衍生物（5-sulfomyl-2-aminobenzoic acid）", "含有 {{anthranilic acid|結構}} 類似結構", "取代基：胺基+Furan、Cl、SO₂NH₂"] },
{ id: "bumetanide", chapter: 16, name: "Bumetanide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/bumetanide.png",
  use: ["{{環利尿劑|用途}}：效價最強（Furosemide 的 {{40|數值}} 倍）"],
  bold: ["{{meta-aminobenzoic acid|結構}}★衍生物（5-sulfomyl-3-aminobenzoic acid）", "3 號位含有{{正丁基|取代基}}結構（Butyl group）", "4 號位上有 {{Phenoxy|取代基}} 取代（O 改成 N 或 S 仍具活性）"] },
{ id: "torsemide", chapter: 16, name: "Torsemide", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/torsemide.png",
  use: ["{{環利尿劑|用途}}"],
  bold: ["以 {{Pyridine|結構}} 為骨架（不同於其他三者）", "SO₂NH₂ 修飾成 {{Sulfonylurea|結構}}★結構", "N 上有 {{Toluidine|取代基}} 結構", "半衰期{{最長|性質}}"] },
{ id: "ethacrynic-acid", chapter: 16, name: "Ethacrynic acid", type: "drug", group: "環利尿劑", source: "統整（三）p.44", img: "assets/medchem/ethacrynic-acid.png",
  use: ["{{環利尿劑|用途}}", "生體可用率最高（100%）", "可用在對磺胺類過敏的病患", "比其他環利尿劑有更嚴重的{{耳毒性|副作用}}★及腸胃副作用"],
  bold: ["唯一{{不含 Sulfonamide|結構}}★結構的環利尿劑", "含有 {{Acrylic acid|結構}} 結構，Cl 取代在 2、3 位", "Oxyacetic acid 與 αβ-unsaturated carbonyl 為 {{para-position|位置}}★時利尿效果最好", "與腎小管的-SH 形成{{共價鍵|機轉}}結合"] },

{ id: "mra-intro", chapter: 16, name: "保鉀型（MRA）總論", short: "MRA 總論", type: "topic", group: "保鉀型（MRA）", source: "統整（三）p.45",
  bold: [
    "礦物性腎上腺皮質受體抑制劑（MRA）同時歸類為{{保鉀型利尿劑|藥物類別}}",
    "主要抑制{{醛固酮 Aldosterone|物質}}的作用 → 需要 Aldosterone 存在才可作用★",
    "受體（含 {{Methionine|物質}}）被抑制，使 Na⁺和水無法再吸收（K⁺留在體內）"
  ] },
{ id: "spironolactone", chapter: 16, name: "Spironolactone", type: "drug", group: "保鉀型（MRA）", source: "統整（三）p.45", img: "assets/medchem/spironolactone.png",
  use: ["{{保鉀型利尿劑|用途}}", "副作用：{{男性女乳症|副作用}}（gynocomastia）、腸胃不適、昏睡"],
  bold: ["7α★：-SC(O)CH₃（{{Ethanethiolate|取代基}}）★", "17 號：{{γ-lactone ring|結構}}", "7 號取代基可拮抗 Aldosterone 與受體 {{Methionine|物質}}★活化", "代謝：經肝臟首渡代謝脫去-SC(O)CH₃★形成 {{Canrenone|代謝物}}★（有活性）"] },
{ id: "eplerenone", chapter: 16, name: "Eplerenone", type: "drug", group: "保鉀型（MRA）", source: "統整（三）p.45", img: "assets/medchem/eplerenone.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["在 9α、11α 上有 {{epoxy group|取代基}} → 對 MR 親合度較 Spironolactone {{低|性質|高}}", "代謝：經 {{CYP3A4|酵素}} 產生 4 種代謝物"] },

{ id: "ksparing-intro", chapter: 16, name: "保鉀型（Na⁺通道）總論", short: "保鉀型總論", type: "topic", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46",
  bold: [
    "保鉀型利尿劑作用在{{遠曲、集尿管|位置}}的 Na⁺通道，副作用：{{高血鉀|副作用}}",
    "與 Spironolactone、Eplerenone 不同，{{不需要|性質}} Aldosterone 存在即可作用★",
    "皆含有 N 原子，弱酸環境被質子化形成陽離子 BH⁺，與 Na⁺通道上的陰離子基團結合而抑制 Na⁺再吸收"
  ] },
{ id: "triamterene", chapter: 16, name: "Triamterene", type: "drug", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46", img: "assets/medchem/triamterene.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["由 {{Pteridine|結構}}★（4N）發展而來：與葉酸、Methotrexate★結構類似", "結構中有 {{3 個|數值}}胺基-NH₂，故稱 Triamterene", "代謝：經 {{CYP1A2|酵素}} 代謝成 4'-hydroxytriamterene + Sulfate-conjugated，均有活性"] },
{ id: "amiloride", chapter: 16, name: "Amiloride", type: "drug", group: "保鉀型（Na⁺通道）", source: "統整（三）p.46", img: "assets/medchem/amiloride.png",
  use: ["{{保鉀型利尿劑|用途}}"],
  bold: ["由 Triamterene {{開環|結構}}而來，具有 {{pyrazine|結構}}★結構", "具有 Aminopyrazine、{{Guanidine|結構}}★的結構", "鹼性較強，較易質子化", "代謝：幾乎不會代謝，以{{原型|代謝}}排出體外"] },

/* ===== 第 17 章 心絞痛藥物（統整（三）捌，p.47–48）===== */
{ id: "dipyridamole", chapter: 17, name: "Dipyridamole", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/dipyridamole.png",
  use: ["{{心絞痛|疾病}}（PDE 抑制劑，Persantine®）", "抑制 {{PDE-3|標的}}，使 cAMP↑", "同時抑制 {{adenosine|物質}} 再回收★，刺激 adenyl cyclase 使 cAMP↑"],
  bold: ["以 {{pyrimidopyrimidine|結構}} 為骨架", "具 {{piperidine|結構}} 結構"] },
{ id: "cilostazol", chapter: 17, name: "Cilostazol", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/cilostazol.png",
  use: ["{{口服|給藥途徑}}藥，對 {{PDE-3A|標的}} 更具選擇性", "同時抑制 adenosine 再回收，使 cAMP↑", "可治療{{間歇性跛行|疾病}}"],
  bold: ["以 {{quinolinone|結構}} 為骨架", "具 {{tetrazole|結構}} 結構", "具環己烷結構"] },
{ id: "papaverine", chapter: 17, name: "Papaverine", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.47", img: "assets/medchem/papaverine.png",
  use: ["{{心絞痛|疾病}}（作用於血管平滑肌使血管舒張）"],
  bold: ["以 {{Benzoisoquinoline|結構}} 為骨架"] },
{ id: "minoxidil", chapter: 17, name: "Minoxidil", type: "drug", group: "心絞痛（補充）", source: "統整（三）p.47", img: "assets/medchem/minoxidil.png",
  use: ["具有降血壓、血管擴張作用，但{{不用在心衰竭治療|用途}}", "後被發現有促進{{毛髮再生|用途}}的能力"],
  bold: ["為 {{K⁺通道促效劑|機轉}}"] },

{ id: "nitrate-intro", chapter: 17, name: "硝酸酯類總論", short: "硝酸酯總論", type: "topic", group: "硝酸酯類", source: "統整（三）p.48",
  bold: [
    "含硝基血管擴張劑與組織中游離的{{硫醇基|物質}}（R-SH）結合，產生雙硫鍵釋放 NO₂⁻，最後生成 {{NO|物質}}（內生性 NO 由 L-arginine★生合成）",
    "NO 生合成為 nitrosothiol（R-SNO），刺激 {{guanylate cyclase|酵素}}★生成 cGMP",
    "活化 PKG 使 myosine light chain 之{{磷酸化減少|機轉}}★，造成血管平滑肌放鬆（{{靜脈擴張|性質}}>動脈擴張★）",
    "特性：揮發性強、脂溶性高；具爆炸性需防潮；與 amines 形成 {{nitrosamines|物質}} 具致癌性",
    "做成{{舌下錠|給藥途徑}}治療緊急心絞痛；可作{{氰化物|物質}}★中毒之解毒劑",
    "不可和 {{PDE-5 inhibitors|藥物類別}}（Sildenafil、Tadalafil）併用"
  ] },
{ id: "glyceryl-trinitrate", chapter: 17, name: "Glyceryl Trinitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/glyceryl-trinitrate.png",
  use: ["{{心絞痛|疾病}}（舌下錠）"],
  bold: ["又名 nitroglycerin，{{結構式和化學式|名詞}}★要記"] },
{ id: "amyl-nitrite", chapter: 17, name: "Amyl Nitrite", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/amyl-nitrite.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["屬於 {{Nitrite ester|結構}}★亞硝酸酯", "以{{氣體|給藥途徑}}給藥，油溶性高、{{Onset 最快|作用時間}}★"] },
{ id: "isosorbide-dinitrate", chapter: 17, name: "Isosorbide Dinitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/isosorbide-dinitrate.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["具有 {{4 個|數值}}★不對稱中心", "{{活性代謝物|性質}}作用時間更長★"] },
{ id: "pentaerythritol-tetranitrate", chapter: 17, name: "Pentaerythritol Tetranitrate", type: "drug", group: "硝酸酯類", source: "統整（三）p.48", img: "assets/medchem/pentaerythritol-tetranitrate.png",
  use: ["{{心絞痛|疾病}}"],
  bold: ["{{作用時間最長|作用時間}}★"] },
{ id: "molsidomine", chapter: 17, name: "Molsidomine", type: "drug", group: "NO Donor", source: "統整（三）p.48", img: "assets/medchem/molsidomine.png",
  use: ["{{心絞痛|疾病}}（NO donor）", "具光敏性、藥效短，治療劑量時有{{抗血小板|用途}}作用"],
  bold: ["不需要雙硫鍵催化，可直接提供 {{NO|物質}}", "化學結構屬於 {{Mesionic compound|結構}}★", "經 liver esterases 水解成活性代謝物 {{Linsidomine|代謝物}}★（含 imine 結構），再開環成 SIN-1A"] },

/* ===== 第 18 章 心衰竭藥物（統整（三）玖，p.49–53）===== */
{ id: "cg-intro", chapter: 18, name: "強心配醣體：作用機轉與必要結構", short: "強心配醣體總論", type: "topic", group: "強心配醣體", source: "統整（三）p.49", img: "assets/medchem/cg-structure.png",
  bold: [
    "作用機轉：抑制 {{Na⁺/K⁺-ATPase|標的}}，間接使細胞內 {{Ca²⁺|離子}} 濃度上升★，增加心肌收縮力",
    "{{5β,14β-Androstane-3β,14β-diol|結構}} 為抑制 Na⁺/K⁺-ATPase 必須的先導結構",
    "主要為固醇類 C6-C6-C6-C5 結構；環之間結合為 {{cis-trans-cis|結構}}★ form（類固醇 trans-trans-trans、膽酸 cis-trans-trans）",
    "醣基以 {{β-1,4-glucosidic|結構}}★鍵結在 C3 位置；10、13 位有甲基，3、14 位有 β-OH（OH 越多 onset 越快）",
    "17β★位有不飽和 lactone ring：{{Cardenolide|藥物類別}} 為 γ-lactone（五元環★）、Bufadienolides 為 δ-lactone（六元環）"
  ] },
{ id: "cg-compare", chapter: 18, name: "強心配醣體比較（genin／OH／藥動）", short: "強心配醣體比較", type: "topic", group: "強心配醣體", source: "統整（三）p.50",
  bold: [
    "Cardiac genin：Digoxin→{{Digoxigenin|代謝物}}、Digitoxin→Digitoxigenin、Ouabain→Ouabagenin",
    "非醣基 OH 位置：Digoxin 在 3β、12β、14β★（Lanatoside C 同）；Digitoxin 在 3β、14β",
    "脂溶性：Digitoxin（2 OH）>Digoxin（3 OH）>Ouabain（6 OH）；血漿蛋白結合率同序",
    "口服生體可用率：{{Digitoxin|藥名}}>Digoxin>Ouabain（100%／70-85%／0%）",
    "分布體積大小：{{Ouabain|藥名}}>Digoxin>Digitoxin",
    "強心配醣體用於{{左心室收縮異常|疾病}}之病人，不適用舒張型/右心衰竭；也適合原發性高血壓引起之心衰竭"
  ] },
{ id: "digoxin-interactions", chapter: 18, name: "Digoxin 藥物交互作用", short: "Digoxin 交互作用", type: "topic", group: "強心配醣體", source: "統整（三）p.51",
  bold: [
    "使 Digoxin 濃度下降：促進 {{P-gp|標的}}（Rifampin、St. John wort）、破壞腸道絨毛（Neomycin）、與藥物結合（Cholestyramine）、制酸劑、Metoclopramide",
    "使 Digoxin 濃度上升：抑制 P-gp（{{Quinidine|藥名}}、Amiodarone、CCBs 等）、減少腸道菌叢代謝（Erythromycin）、Spironolactone",
    "{{低血鉀|副作用}}★、低血鎂★、高血鈣★皆會增強 Digoxin 毒性；中毒症狀有心室心搏過速、{{T wave 反轉|副作用}}",
    "Digoxin 中毒解毒劑：{{Lidocaine|藥名}}★（首選）、Phenytoin 或 Procainamide，禁用 Quinidine",
    "Digoxin 治療心房顫動：擬副交感神經作用使 PR interval 延長、抑制 {{AV node|標的}} 傳導"
  ] },
{ id: "digoxin", chapter: 18, name: "Digoxin", type: "drug", group: "強心配醣體", source: "統整（三）p.50",
  use: ["{{強心配醣體|用途}}（心衰竭、心房顫動）"],
  bold: ["Cardiac genin 為 {{Digoxigenin|代謝物}}，非醣基 OH 在 {{3β、12β、14β|位置}}★，醣基為 3 digitoxose", "脂溶性中（3 個 OH）、Onset {{快|性質}}★、半衰期短、主要由{{腎臟|器官}}★排泄"] },
{ id: "digitoxin", chapter: 18, name: "Digitoxin", type: "drug", group: "強心配醣體", source: "統整（三）p.50",
  use: ["{{強心配醣體|用途}}"],
  bold: ["Cardiac genin 為 Digitoxigenin，非醣基 OH 在 {{3β、14β|位置}}", "脂溶性{{高|性質}}★（2 個 OH）、口服吸收 100%、蛋白結合率 97%、經{{肝臟|器官}}代謝"] },
{ id: "ouabain", chapter: 18, name: "Ouabain", type: "drug", group: "強心配醣體", source: "統整（三）p.50",
  use: ["{{強心配醣體|用途}}"],
  bold: ["Cardiac genin 為 Ouabagenin，有 {{6 個|數值}} OH，醣基為 1 {{Rhamnose|物質}}★", "脂溶性低、口服吸收 0%、{{分布體積最大|性質}}"] },

{ id: "milrinone", chapter: 18, name: "Milrinone", type: "drug", group: "PDE-3 抑制劑", source: "統整（三）p.52", img: "assets/medchem/milrinone.png",
  use: ["{{心衰竭|疾病}}（抑制 PDE-3 使 cAMP↑★、收縮力↑）", "與 {{furosemide|藥名}} 併用會沉澱", "半衰期較短"],
  bold: ["以 {{pyridine-pyridone|結構}} 為骨架", "有甲基、{{CN|取代基}} 取代"] },
{ id: "inamrinone", chapter: 18, name: "Inamrinone", type: "drug", group: "PDE-3 抑制劑", source: "統整（三）p.52", img: "assets/medchem/inamrinone.png",
  use: ["{{心衰竭|疾病}}（PDE-3 抑制劑）", "副作用：{{血小板減少症|副作用}}（thrombocytopenia）", "造成肝功能損害，不適合長期使用"],
  bold: ["以 {{pyridine-pyridone|結構}} 為骨架", "有 {{-NO₂|取代基}} 取代"] },
{ id: "dobutamine", chapter: 18, name: "Dobutamine", type: "drug", group: "β-agonist", source: "統整（三）p.52", img: "assets/medchem/dobutamine.png",
  use: ["{{β₁-agonist|機轉}}★，使心肌細胞 cAMP、Ca²⁺濃度上升，促進心臟收縮", "{{IV|給藥途徑}} 給予治療急性心衰竭", "長期使用會導致 β 受體去敏感化"],
  bold: ["由 Dopamine 修飾而來，兩者都屬{{兒茶酚胺|藥物類別}}類（Catecholamine）"] },

{ id: "hf-other", chapter: 18, name: "其他心衰竭治療藥物", short: "其他心衰竭藥物", type: "topic", group: "其他心衰竭藥物", source: "統整（三）p.53",
  bold: [
    "{{Aldosterone antagonist|藥物類別}}（Spironolactone、Eplerenone）：預防鹽類滯留、心肌肥大與低血鉀",
    "{{Ivabradine|藥名}}：抑制 SA node 之 funny channel★降低心跳，CYP3A4 代謝，副作用為光幻視",
    "Nesiritide：抑制 {{BNP|物質}}、Carperitide：抑制 ANP，皆 IV 用於急性心衰竭",
    "{{Levosimendan|藥名}}：增加 troponin 對 Ca²⁺敏感性、也抑制 PDE，血管舒張並促心臟收縮",
    "Bosentan：競爭型 {{endothelin|標的}} 抑制劑，核准治療肺動脈高血壓"
  ] },
{ id: "pde5-intro", chapter: 18, name: "PDE-5 抑制劑總論", short: "PDE-5 總論", type: "topic", group: "PDE-5 抑制劑", source: "統整（三）p.53",
  bold: [
    "PDE-5 抑制劑用於治療{{勃起障礙|疾病}}，也用於肺動脈高血壓或高山症",
    "不可和其他 PDE 抑制劑或(亞){{硝酸酯類|藥物類別}}血管擴張劑併用"
  ] },
{ id: "sildenafil", chapter: 18, name: "Sildenafil", type: "drug", group: "PDE-5 抑制劑", source: "統整（三）p.53", img: "assets/medchem/sildenafil.png",
  use: ["{{勃起障礙|疾病}}（Viagra®）", "也可用於治療肺動脈高壓（20 mg）"],
  bold: ["另外會抑制 {{PDE-6|標的}}，造成{{視覺障礙|副作用}}"] },
{ id: "tadalafil", chapter: 18, name: "Tadalafil", type: "drug", group: "PDE-5 抑制劑", source: "統整（三）p.53", img: "assets/medchem/tadalafil.png",
  use: ["{{勃起障礙|疾病}}（Cialis®）"],
  bold: ["抑制 {{PDE-11|標的}} 最強，會造成{{肌肉痠痛|副作用}}"] },
{ id: "vardenafil", chapter: 18, name: "Vardenafil", type: "drug", group: "PDE-5 抑制劑", source: "統整（三）p.53", img: "assets/medchem/vardenafil.png",
  use: ["{{勃起障礙|疾病}}（Levitra®）"],
  bold: ["與 Sildenafil 結構相似（{{imidazotriazinone|結構}} 核）"] },

/* ===== 第 19 章 抗凝血及其血液相關藥物（統整（三）壹拾壹，p.58–69）===== */
/* 一、抗凝血因子藥物 */
{ id: "coag-overview", chapter: 19, name: "凝血級聯與抗凝血藥物總覽", short: "凝血級聯總覽", type: "topic", group: "總論", source: "統整（三）p.58", img: "assets/medchem/coag-cascade.png",
  bold: [
    "內在途徑（XII→XIIa…）與外在途徑（TF-VIIa）匯合於 {{Xa|名詞}}，再使 Prothrombin(II)→Thrombin(IIa)，最後 Fibrinogen(I)→Crosslink Fibrin",
    "Heparin／LMWH：形成 ATIII-Heparins Complex，間接抑制 Xa 與 {{Thrombin|標的}}",
    "{{Fondaparinux|藥名}} 與 Direct Xa inhibitors（Rivaroxaban、Apixaban、Edoxaban）選擇性抑制 Xa",
    "DTIs 直接抑制 {{Thrombin|標的}}（IIa）；口服抗凝血劑經 Vit K cycle 抑制凝血因子 2、7、9、10 活化",
    "Thrombolytic drugs 使 {{Plasminogen|物質}}→Plasmin（纖維溶解酶）分解 fibrin"
  ] },
{ id: "warfarin", chapter: 19, name: "Warfarin", type: "drug", group: "口服抗凝血劑", source: "統整（三）p.60", img: "assets/medchem/warfarin.png",
  use: ["{{口服抗凝血劑|用途}}", "會與血球蛋白高度結合，Vd 小、血漿半衰期長；僅在體內有效；50%肝臟代謝物由尿液排出"],
  bold: ["Coumarin 4-OH 可做成鈉鹽增加水溶性；4-OH 易與右邊 C=O 形成 {{hemiacetal|結構}} 結構→仍具活性", "{{S form|結構}} 活性較高", "代謝：S form 經 {{CYP2C9|酵素}}★在 6、7 位加-OH；R form 經 CYP1A2、CYP2C19 在 6、8 位加-OH"] },
{ id: "acenocoumarol", chapter: 19, name: "Acenocoumarol", type: "drug", group: "口服抗凝血劑", source: "統整（三）p.60", img: "assets/medchem/acenocoumarol.png",
  use: ["{{口服抗凝血劑|用途}}"],
  bold: ["與 Warfarin 只相差一個 {{-NO₂|取代基}} group", "也容易形成 hemiacetal 結構", "{{S form|結構}} 活性較高"] },
{ id: "phenprocoumon", chapter: 19, name: "Phenprocoumon", type: "drug", group: "口服抗凝血劑", source: "統整（三）p.60", img: "assets/medchem/phenprocoumon.png",
  use: ["{{口服抗凝血劑|用途}}（在歐洲使用）"],
  bold: ["與 Warfarin 相差在 C3 上的取代基：有 {{phenyl|取代基}} group", "C3 上具 {{propanyl|取代基}} 支鏈"] },
{ id: "dicoumarol", chapter: 19, name: "Dicoumarol", type: "drug", group: "口服抗凝血劑", source: "統整（三）p.60", img: "assets/medchem/dicoumarol.png",
  use: ["{{口服抗凝血劑|用途}}（在歐洲使用）"],
  bold: ["具有 {{dimer|結構}} 形式（兩個 coumarin 以 CH₂ 相接）"] },
{ id: "phenindione", chapter: 19, name: "Phenindione", type: "drug", group: "1,3-Indandione", source: "統整（三）p.61", img: "assets/medchem/phenindione.png",
  use: ["{{口服抗凝血劑|用途}}（1,3-Indandione 類，支鏈接在 C2 上）"],
  bold: ["支鏈上接了 {{Phenyl|取代基}} group"] },
{ id: "anisindione", chapter: 19, name: "Anisindione", type: "drug", group: "1,3-Indandione", source: "統整（三）p.61", img: "assets/medchem/anisindione.png",
  use: ["{{口服抗凝血劑|用途}}"],
  bold: ["支鏈上接了 {{Anisole|取代基}}（對位 OCH₃ 苯環）"] },
{ id: "chlorophacinone", chapter: 19, name: "Chlorophacinone", type: "drug", group: "1,3-Indandione", source: "統整（三）p.61", img: "assets/medchem/chlorophacinone.png",
  use: ["現今多用來當作{{殺蟲劑|用途}}"],
  bold: ["支鏈具有 {{Cl|取代基}} 原子", "支鏈具有{{兩個|數值}} Phenyl group", "支鏈以丙酮基與苯環相接"] },
{ id: "heparin-intro", chapter: 19, name: "肝素（Heparin）", short: "Heparin", type: "topic", group: "肝素", source: "統整（三）p.62",
  bold: [
    "結構：帶負電的黏多醣硫酸酯（{{Sulfated mucopolysaccharides|結構}}★）聚合物，單體為 N-acetyl-D-glucosamine（NAG）與 glucuronic acid 以 α-1,4 鍵結",
    "作用機轉：五個帶負電硫酸根與 {{Antithrombin III|標的}} 的五個正電基團結合，使其構型改變，加速抑制凝血因子 {{IIa 和 Xa|名詞}} → 類催化劑、間接抑制 Thrombin",
    "副作用：內出血、血小板低下、血脂過低、骨質疏鬆、肝功能異常",
    "引發血小板減少症（{{HIT|疾病}}）時應停用 Heparin，改用 Lepirudin 或 Fondaparinux"
  ] },
{ id: "lmwh-intro", chapter: 19, name: "低分子量肝素（LMWH）", short: "LMWH", type: "topic", group: "肝素", source: "統整（三）p.62",
  bold: [
    "因 Heparin 分子量太大、易與血漿蛋白結合且口服吸收差，發展出小分子肝素，更具{{專一性|性質}}",
    "{{腎功能不足|疾病}}的病患不適合使用",
    "藥物：Ardeparin、Dalteparin、{{Enoxaparin|藥名}}、Tinzaparin；Enoxaparin 可治療 DVT、肺栓塞"
  ] },
{ id: "fondaparinux-xa", chapter: 19, name: "Fondaparinux 與 Direct Xa 抑制劑", short: "Fondaparinux/Xa", type: "topic", group: "Xa 抑制劑", source: "統整（三）p.62",
  bold: [
    "Fondaparinux：人工合成、高度硫化的{{五醣|結構}}（Sulfonated Pentasaccharide★），選擇性抑制凝血因子 {{Xa|名詞}}",
    "Direct Xa Inhibitors（直接抑制 Xa）：{{Rivaroxaban|藥名}}、Apixaban、Edoxaban"
  ] },
{ id: "hirudin", chapter: 19, name: "Hirudin", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63",
  use: ["{{DTI|藥物類別}}：直接抑制凝血因子 II（{{bivalent|名詞}} DTI、不可逆）"],
  bold: ["自 {{medicinal leech|物質}} 的唾腺萃取而來", "屬蛋白質藥物，由 {{65 個|數值}} 胺基酸組成"] },
{ id: "lepirudin", chapter: 19, name: "Lepirudin", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63",
  use: ["{{DTI|藥物類別}}（bivalent DTI、不可逆）"],
  bold: ["N 端胺基酸為 {{leucine-1、threonin-2|名詞}}", "由 65 個胺基酸組成"] },
{ id: "desirudin", chapter: 19, name: "Desirudin", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63",
  use: ["{{DTI|藥物類別}}（bivalent DTI、不可逆）"],
  bold: ["N 端胺基酸為 {{valine-1、valine-2|名詞}}", "由 65 個胺基酸組成"] },
{ id: "bivalirudin", chapter: 19, name: "Bivalirudin", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63",
  use: ["{{DTI|藥物類別}}（短效 bivalent DTI、可逆）"],
  bold: ["由 {{20 個|數值}} 胺基酸組成", "Onset {{快速、短效|作用時間}}"] },
{ id: "argatroban", chapter: 19, name: "Argatroban", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63", img: "assets/medchem/argatroban.png",
  use: ["{{DTI|藥物類別}}：{{Monovalent|名詞}} DTI，選擇性結合 Catalytic site（可逆）"],
  bold: ["具 arginine、{{tetrahydroquinoline|結構}}、piperidine、sulfonamide、-COOH", "代謝：經 {{CYP3A4/5|酵素}} 代謝"] },
{ id: "dabigatran", chapter: 19, name: "Dabigatran Etexilate", short: "Dabigatran", type: "drug", group: "DTI（直接凝血酶抑制劑）", source: "統整（三）p.63", img: "assets/medchem/dabigatran.png",
  use: ["{{DTI|藥物類別}}：口服非擬肽藥物（non-peptidomimetic）", "用於關節置換手術引起的深層靜脈栓塞（VTE）"],
  bold: ["以 {{Benzamidine|結構}} 為基本結構", "為{{前驅藥|性質}}（prodrug）★"] },

/* 二、抗血小板藥物 */
{ id: "antiplatelet-overview", chapter: 19, name: "抗血小板藥物總覽", short: "抗血小板總覽", type: "topic", group: "總論", source: "統整（三）p.59", img: "assets/medchem/antiplatelet-diagram.png",
  bold: [
    "{{COX-1|標的}} 抑制劑（Aspirin、Triflusal、Indobufen）：阻斷 Arachidonic acid→TXA₂",
    "PDE 抑制劑（Dipyridamole、Cilostazol）：使 cAMP↑",
    "{{GP IIb/IIIa|標的}} 抑制劑（Abciximab、Tirofiban、Eptifibatide…）：阻斷血小板凝集最終共同路徑",
    "{{P2Y|受體}} 抑制劑（不可逆：Ticlopidine、Clopidogrel、Prasugrel；可逆：Ticagrelor、Cangrelor）：阻斷 ADP"
  ] },
{ id: "aspirin", chapter: 19, name: "Aspirin", type: "drug", group: "COX-1 抑制劑", source: "統整（三）p.64", img: "assets/medchem/aspirin.png",
  use: ["{{抗血小板|用途}}（正常劑量即可發揮）", "在胃中快速吸收（pH 低、酸性藥好吸收）"],
  bold: ["{{不可逆|性質}}乙醯化 Cyclooxygenase，抑制 {{TXA₂|物質}} 生成（影響 prostaglandin 代謝）", "不是每個 COX-1 抑制劑都可作為 antiplatelet drug"] },
{ id: "triflusal", chapter: 19, name: "Triflusal", type: "drug", group: "COX-1 抑制劑", source: "統整（三）p.64", img: "assets/medchem/triflusal.png",
  use: ["{{抗血小板|用途}}", "去乙醯化的代謝物仍具有活性"],
  bold: ["以 {{salicylic acid|結構}} 為骨架", "具 {{-CF₃|取代基}} 基團"] },
{ id: "indobufen", chapter: 19, name: "Indobufen", type: "drug", group: "COX-1 抑制劑", source: "統整（三）p.64", img: "assets/medchem/indobufen.png",
  use: ["{{抗血小板|用途}}：{{可逆型|性質}}抑制劑", "臨床上目前僅有歐洲使用"],
  bold: ["以 {{isoindolone|結構}} 為骨架", "具 butyric acid 結構"] },
{ id: "dipyridamole-ap", chapter: 19, name: "Dipyridamole", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.64", img: "assets/medchem/dipyridamole.png",
  use: ["{{抗血小板|用途}}（PDEi，同時具血管擴張作用）", "抑制 PDE3 使 cAMP↑，同時抑制 adenosine 再回收"],
  bold: ["以 {{pyrimidopyrimidine|結構}}★為骨架", "具 piperidine 結構"] },
{ id: "cilostazol-ap", chapter: 19, name: "Cilostazol", type: "drug", group: "PDE 抑制劑", source: "統整（三）p.64", img: "assets/medchem/cilostazol.png",
  use: ["{{抗血小板|用途}}：口服藥，對 PDE3A 更具選擇性", "可治療{{間歇性跛行|疾病}}"],
  bold: ["以 {{quinolinone|結構}} 為骨架", "具 {{tetrazole|結構}}★結構", "代謝後仍具活性"] },
{ id: "ticlopidine", chapter: 19, name: "Ticlopidine", type: "drug", group: "P2Y 抑制劑", source: "統整（三）p.65", img: "assets/medchem/ticlopidine.png",
  use: ["{{抗血小板|用途}}：P2Y 抑制劑（不可逆）", "為 prodrug，需經 CYP2C19 代謝產生-SH 才有活性，與受質形成雙硫共價鍵結", "副作用：嗜中性白血球低下（Neutropenia）、TTP"],
  bold: ["以 {{thienopyridine|結構}} 為骨架（含 N、S 雜環）"] },
{ id: "clopidogrel", chapter: 19, name: "(S)-Clopidogrel", short: "Clopidogrel", type: "drug", group: "P2Y 抑制劑", source: "統整（三）p.65", img: "assets/medchem/clopidogrel.png",
  use: ["{{抗血小板|用途}}：P2Y 抑制劑（不可逆）", "為 prodrug，需經 CYP2C19 活化"],
  bold: ["含有 {{Cl|取代基}} 原子", "比 Ticlopidine 多了{{酯類|結構}}結構"] },
{ id: "prasugrel", chapter: 19, name: "Prasugrel", type: "drug", group: "P2Y 抑制劑", source: "統整（三）p.65", img: "assets/medchem/prasugrel.png",
  use: ["{{抗血小板|用途}}：P2Y 抑制劑（不可逆）", "為 prodrug，透過{{水解|代謝}}即可形成活性代謝產物"],
  bold: ["以 {{thienopyridine|結構}} 為骨架", "具 {{Cyclopropane|結構}} 結構，含有 F 原子"] },
{ id: "ticagrelor", chapter: 19, name: "Ticagrelor", type: "drug", group: "P2Y 抑制劑", source: "統整（三）p.65", img: "assets/medchem/ticagrelor.png",
  use: ["第一個口服的{{可逆型|性質}} P2Y₁₂ 抑制劑", "FDA 核准用於急性冠心症（ACS）"],
  bold: ["含 {{triazolopyrimidine|結構}} 結構", "具 Cyclopropane 結構，含有 F 原子"] },
{ id: "cangrelor", chapter: 19, name: "Cangrelor", type: "drug", group: "P2Y 抑制劑", source: "統整（三）p.65", img: "assets/medchem/cangrelor.png",
  use: ["{{抗血小板|用途}}：P2Y 抑制劑（可逆）", "{{IV|給藥途徑}} 給藥、Onset 快、短效"],
  bold: ["含 {{diazolopyrimidine|結構}} 結構"] },
{ id: "abciximab", chapter: 19, name: "Abciximab", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}"],
  bold: ["{{-ximab|名詞}} 表示結構源自動物的嵌合式單株抗體"] },
{ id: "eptifibatide", chapter: 19, name: "Eptifibatide", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66", img: "assets/medchem/eptifibatide.png",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}", "RGD 與受體鍵結力較弱，故為{{可逆型|性質}}抑制"],
  bold: ["含有 {{RGD|名詞}} group（Arg-Gly-Asp）", "為合成的{{環狀七肽鏈|結構}}★，Mercaptopropionyl residue 與 Cys 形成雙硫鍵"] },
{ id: "tirofiban", chapter: 19, name: "Tirofiban", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66", img: "assets/medchem/tirofiban.png",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}"],
  bold: ["{{擬肽或非胜肽|性質}}類，與蛇毒蛋白（disintegrin）結構相似", "分子內 COO⁻和 NH₃⁺的距離與 {{RGD|名詞}} 相符，能和受體結合"] },
{ id: "roxifiban", chapter: 19, name: "Roxifiban", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66", img: "assets/medchem/roxifiban.png",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}（補充）"], bold: [] },
{ id: "lamifiban", chapter: 19, name: "Lamifiban", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66", img: "assets/medchem/lamifiban.png",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}（補充）"], bold: [] },
{ id: "lefradafiban", chapter: 19, name: "Lefradafiban", type: "drug", group: "GP IIb/IIIa 抑制劑", source: "統整（三）p.66", img: "assets/medchem/lefradafiban.png",
  use: ["{{GP IIb/IIIa 抑制劑|用途}}（補充）"], bold: [] },

/* 三、溶血栓藥物 */
{ id: "thrombolytic-intro", chapter: 19, name: "溶血栓藥物總論", short: "溶血栓總論", type: "topic", group: "溶血栓藥物", source: "統整（三）p.67",
  bold: [
    "溶血栓藥物使 {{Plasminogen|物質}}→Plasmin，分解 fibrin",
    "{{fibrin-nonspecific|名詞}} drug：Streptokinase、Urokinase（也催化 Fibrinogen）",
    "{{fibrin-specific|名詞}} drug：Alteplase(tPA)，結合態(tPA-Fibrin)>>游離態"
  ] },
{ id: "streptokinase", chapter: 19, name: "Streptokinase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}：唯一 FDA 認可用於周邊血管疾病的藥品"],
  bold: ["來源：{{β-溶血性鏈球菌|物質}}（β-hemolytic streptococci）", "與 Plasminogen 結合活化成 Plasmin，同時催化 Fibrinogen 降解 → {{fibrin-nonspecific|名詞}} drug"] },
{ id: "urokinase", chapter: 19, name: "Urokinase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}", "人體無相對應 agonist，可直接服用"],
  bold: ["來源：人類胎兒腎臟細胞", "半衰期短（15 mins）、較不易引發過敏", "直接催化 plasminogen→plasmin，屬 fibrin-nonspecific drug"] },
{ id: "alteplase", chapter: 19, name: "Alteplase (tPA)", short: "Alteplase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}", "低劑量時有較佳選擇性"],
  bold: ["來源：人類黑色素瘤細胞（melanoma），為人體未經修飾的 tPA", "與 Plasminogen 結合：結合態(tPA-Fibrin)>>游離態 → {{fibrin-specific|名詞}} drug"] },
{ id: "prourokinase", chapter: 19, name: "Prourokinase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}：活化 plasminogen（似 Urokinase）"],
  bold: ["較無免疫抗原性（immunogenicity）→ 較第一代安全"] },
{ id: "reteplase", chapter: 19, name: "Reteplase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}：可用於心肌梗塞（MI）"],
  bold: ["由 tPA 修飾而來，刪除 {{1-172|名詞}} 的胺基酸 → 降低肝臟排除率、延長半衰期（14-18 min）", "與 fibrin 結合力與選擇性降低"] },
{ id: "tenecteplase", chapter: 19, name: "Tenecteplase (TNKase)", short: "Tenecteplase", type: "drug", group: "溶血栓藥物", source: "統整（三）p.67",
  use: ["{{溶血栓藥物|用途}}"],
  bold: ["由 tPA 修飾而來，發生{{三處|數值}}點突變，使藥物半衰期上升（~17 min）"] },

/* 四、凝血劑 */
{ id: "vitamin-k", chapter: 19, name: "Vitamin K (Phytonadione)", short: "Vitamin K", type: "drug", group: "凝血劑", source: "統整（三）p.68", img: "assets/medchem/vitamin-k.png",
  use: ["{{凝血劑|用途}}：與凝血因子 2、7、9、10 的活化有關（治療速度緩慢）", "口服使用需膽鹽存在才可被小腸吸收", "拮抗 Warfarin 出血症狀；頭孢菌素等抗生素會影響其吸收"],
  bold: ["結構為 {{naphthoquinone|結構}} 接 isoprenoid 側鏈"] },
{ id: "coagulants-other", chapter: 19, name: "其他凝血劑", short: "其他凝血劑", type: "topic", group: "凝血劑", source: "統整（三）p.68",
  bold: [
    "{{Protamine|藥名}}：結構富含 Arginine、鹼性極高，與 Antithrombin III 競爭抑制酸性的 Heparin（拮抗肝素）",
    "Aminocaproic acid、Tranexamic acid：抑制 {{Plasminogen|物質}} 之活化",
    "Cryoprecipitate：治療 {{Fibrinogen|物質}} 缺乏★（von Willebrand's disease、甲型血友病）",
    "Aprotinin：為 {{Serine protease inhibitor|標的}}，阻斷纖維蛋白酶控制出血"
  ] },

/* 五、血球缺乏與貧血 */
{ id: "hematopoietic", chapter: 19, name: "血球缺乏藥物治療", short: "血球缺乏治療", type: "topic", group: "血球缺乏", source: "統整（三）p.68",
  bold: [
    "白血球不足：人類重組 GM-CSF（{{Sargramostim|藥名}}）、G-CSF（Filgrastim）→ 骨髓生長因子",
    "紅血球不足：人類重組 Erythropoetin（{{Epoetin alfa|藥名}}、Darbopoetin alfa）→ 治療慢性腎衰竭貧血，副作用高血壓",
    "血小板不足：人類重組 IL-11（{{Oprelvekin|藥名}}）、血小板生成素受體致效劑（Eltrombopag）"
  ] },
{ id: "anemia-intro", chapter: 19, name: "貧血治療藥物", short: "貧血治療", type: "topic", group: "血球缺乏", source: "統整（三）p.69",
  bold: [
    "缺鐵性貧血：血紅素低（Hypochromic）、紅血球小（Microcytic）→ 使用{{鐵劑|物質}}；巨母紅血球/惡性貧血：高（Hyperchromic）、大（Macrocytic）→ 葉酸、Vitamin B₁₂",
    "惡性貧血缺乏 {{Vit B₁₂|物質}}，需與胃壁細胞分泌的內在因子結合才能由小腸吸收",
    "鐮刀型貧血：Hydroxyurea（增加 HbF）；地中海型貧血：{{Deferoxamine|藥名}}（防止鐵質沉積）；Sideroblastic：Pyridoxine（Vit B₆）",
    "鐵劑補充 {{Fe²⁺|離子}}：口服需飯前，過量用活性碳解毒；注射劑解毒劑為 Deferoxamine"
  ] }
];

/* 知識樹：第 1 章。總論類的主題格用 unit 引用（題目算在格子上）；
   另外會出「看結構選藥名」的認結構題（js/quiz.js 的 structQ，選項都是真的藥名）。 */
PI.KNOWLEDGE = {
  ch1: { chapter: 1, title: "鎮靜安眠與抗焦慮藥物",
    sections: [
      { id: "overview", title: "總覽", items: [
        { title: "Barbiturates 與 Benzodiazepine 之比較（表）", source: "統整（一）p.3",
          table: { head: ["藥物", "Barbiturates", "Benzodiazepine"], rows: [
            [{ t: "機轉", b: true }, "活化 GABA_A 之 Cl⁻ 通道，增加{{開啟時間|機轉}}", "異位活化 GABA_A 之 Cl⁻ 通道，增加{{開啟頻率|機轉}}"],
            [{ t: "劑量與中樞抑制關係", b: true, rs: 2 }, "{{線性|性質|曲線}}", "曲線（較安全）"],
            [null, { t: "產生作用之順序：{{鎮靜 Sedation|名詞|催眠 Hypnosis/麻醉 Anesthesia/昏迷 Coma}} → 催眠 Hypnosis → 麻醉 Anesthesia → 昏迷 Coma", cs: 2 }],
            [{ t: "高劑量下作用", b: true }, "{{可直接打開|機轉|不可直接打開}} Cl⁻ 通道，選擇性低，較不安全", "不可直接打開 Cl⁻ 通道，選擇性高，較安全"],
            [{ t: "睡眠周期之影響", b: true }, { t: "增加{{第二期非快速動眼期|名詞|快速動眼期/慢波睡眠期/第一期非快速動眼期}}的睡眠時間（Stage II：non-REM）\n縮短進入睡眠之時間、縮短{{動眼期|名詞|第二期非快速動眼期}}時間、縮短慢波睡眠期時間", cs: 2 }],
            [{ t: "反彈性失眠", b: true }, "{{短效|作用時間|長效/中效}} > 長效，如 {{Thiopental|藥名|Phenobarbital/Primidone}}", "短效 > 長效，如 {{Triazolam|藥名|Diazepam/Lorazepam}}"],
            [{ t: "解毒劑", b: true }, "{{Picrotoxin|藥名}}（GABA_A 拮抗劑）、{{Bemegride|藥名|Flumazenil/Bicuculline}}", "{{Flumazenil|藥名}}（GABA 之競爭型負向異位調節劑），只能 IV 給予"],
            [{ t: "呼吸抑制", b: true }, "{{O|性質|X}}", "X"],
            [{ t: "CYP450 誘導", b: true }, "{{O|性質|X}}", "X"]
          ], note: "藥理補充：{{β-Carbolines|藥名}}、Bicuculline 為 {{Inverse agonist|機轉}}，可降低 GABA 之抑制作用；{{Flumazenil|藥名}} 可拮抗 BZD 和 Z-drugs 的作用" } },
        { title: "藥物總覽", source: "統整（一）p.3",
          table: { head: ["分類", "作用機轉", "藥物"], rows: [
            [{ t: "Barbiturates", b: true }, "異位活化 GABA_A 的 Cl⁻ 通道，增加開啟時間", "Phenobarbital、Thiopental、Primidone 等"],
            [{ t: "Benzodiazepine", b: true }, "異位活化 GABA_A 的 Cl⁻ 通道，增加開啟頻率", "Diazepam、Lorazepam、Triazolam 等"],
            [{ t: "Z-Drug", b: true }, "選擇作用於 {{BZD₁|受體|BZD₂/GABA_B/5-HT₁A}} 受體，加強 GABA 的抑制作用", "Eszopiclone、{{Zolpidem|藥名|Buspirone/Ramelteon/Suvorexant}}、Zaleplon"],
            [{ t: "Serotonin Agonist", b: true }, "血清素受體活化劑", "{{Buspirone|藥名|Zolpidem/Fluoxetine/Ramelteon}}"],
            [{ t: "抗焦慮藥物", b: true }, "選擇性抑制血清素再回收 SSRI", "Fluoxetine、Paroxetine、Citalopram、Sertraline、Fluvoxamine"],
            [{ t: "Melatonin Agonist", b: true }, "直接刺激{{上視交叉神經|部位|下視丘/松果體/腦幹}}的 MT 受體", "Melatonin、Ramelteon"],
            [{ t: "1st H₁-blockers", b: true }, "因第一代藥物{{脂溶性高|性質|水溶性高/分子量小/蛋白結合率低}}，可通過 BBB 影響中樞", "Diphenhydramine、Doxylamine、Doxepine"],
            [{ t: "Orexin Antagonist", b: true }, "抑制{{食慾素|名詞|血清素/褪黑激素/組織胺}}與受體結合", "{{Suvorexant|藥名|Zaleplon/Buspirone/Ramelteon}}"]
          ] } }
      ] },
      { id: "barb", title: "一、GABA_A 受體促效劑：巴比妥類藥物（Barbiturates）", items: [{ unit: "sh-barb-general" },
        { group: "巴比妥類（Barbiturates）", source: "統整（一）p.4",
          table: { head: [
              [{ t: "鎮靜安眠類\n巴比妥藥物", rs: 2 }, { t: "取代基", cs: 4 }, { t: "脂溶性\nlogP", rs: 2 }, { t: "Onset", rs: 2 }, { t: "Duration", cs: 2, rs: 2 }],
              ["5-R₁", "5-R₂", "側鏈性質", "第 5 位雙取代基總 C 數"]],
            cols: ["鎮靜安眠類巴比妥藥物", "5-R₁", "5-R₂", "側鏈性質", "第 5 位雙取代基總 C 數", "脂溶性 logP", "Onset", "Duration", "Duration"],
            rows: [
              ["Amobarbital", "C₂H₅", { t: "isoamyl", s: true }, "支鏈少，作用時間較長", "7=2+5", "2.07", "45-60", "6-8", "中效型"],
              ["Butabarbital", "C₂H₅", { t: "[i]sec[/i]-butyl", s: true }, "-", "6=2+4", "1.60", "45-60", "6-8", "中效型"],
              ["Pentobarbital", "C₂H₅", "2-[i]n[/i]-pentyl", "支鏈多，作用時間短", "7=2+5", "2.10", "10-15", "3-4", { t: "{{短效型|作用時間}}", s: true }],
              ["Secobarbital", { t: "allyl", s: true }, { t: "2-[i]n[/i]-pentyl", s: true }, "{{雙鍵|取代基}}取代，作用時間短", "8=3+5", "2.36", "10-15", "3-4", { t: "{{短效型|作用時間}}", s: true }],
              ["Phenobarbital", "C₂H₅", { t: "benzene", s: true }, "環狀結構，藥效↑", "8=2+6", "1.46", "30-60", "10-16", { t: "{{長效型|作用時間}}", s: true }]] },
          gallery: [
            { img: "assets/medchem/amobarbital.png", cap: "Amobarbital" },
            { img: "assets/medchem/butabarbital.png", cap: "Butabarbital" },
            { img: "assets/medchem/pentobarbital.png", cap: "Pentobarbital" },
            { img: "assets/medchem/secobarbital.png", cap: "Secobarbital" },
            { img: "assets/medchem/phenobarbital.png", cap: "Phenobarbital" }] },
        { title: "巴比妥類用途", group: "巴比妥類（Barbiturates）", source: "統整（一）p.5", points: ["框起來的 Methohexital、Thiopental、Thiamylal 用於{{全身麻醉劑|用途}}，其餘用於鎮靜安眠"] },
        { title: "※ 補充", group: "抗癲癇巴比妥類用藥", source: "統整（一）p.6", points: ["Barbiturates 可{{促進紫質|副作用}}（Porphyrins）合成，故禁用於急性間歇性紫質症的患者"] }] },
      { id: "bzd", title: "二、GABA_A 受體促效劑：Benzodiazepines", items: [{ unit: "sh-bzd-general" },
        { group: "Benzodiazepine 類衍生物：藥理研究", source: "統整（一）p.7", table: { head: ["吸收速度", "脂溶性", "代謝物活性", "用途"], rows: [
          ["快", "高", "無活性", { t: "{{鎮定 Sedative|用途|抗焦慮 Antianxiety}}", s: true }],
          ["慢", "低", "有活性", { t: "{{抗焦慮 Antianxiety|用途|鎮定 Sedative}}", s: true }]] } },
        { group: "Benzodiazepine 類衍生物：藥理研究", source: "統整（一）p.7", table: { head: ["分類", "藥物/臨床適應症", "半衰期", "Duration", "Onset", "抗焦慮", "失眠", "癲癇", "痙攣", "酒精成癮", "誘導麻醉", "恐慌症"], rows: [
          [{ t: "Class A", rs: 10 }, "Clorazepate", { t: "長", rs: 6 }, { t: "長效", rs: 6 }, "快", "✔", "", "✔", "", "✔", "", ""],
          [null, "Diazepam", null, null, "快", "✔", "", "✔", "✔", "✔", "✔", ""],
          [null, "Flurazepam", null, null, { t: "快", s: true }, "✔", "✔", "", "", "", "", ""],
          [null, "Chlordiazepoxide", null, null, "中", "✔", "", "", "", "✔", "", ""],
          [null, "Halazepam", null, null, "中", "✔", "", "", "", "", "", ""],
          [null, "Quazepam", null, null, "-", "", "✔", "", "", "", "", ""],
          [null, "Clonazepam", "中", "中效", "慢", "", "", "✔", "", "", "", ""],
          [null, "Temazepam", { t: "短", rs: 3 }, { t: "短效", rs: 3, s: true }, "慢", "", "✔", "", "", "", "", ""],
          [null, "Lorazepam", null, null, "中", "✔", "", "✔", "", "✔", "✔", ""],
          [null, "Oxazepam", null, null, "慢", "✔", "", "", "", "✔", "", ""],
          [{ t: "Class B", rs: 4 }, "Alprazolam", { t: "中", rs: 2 }, { t: "中效", rs: 2 }, "中", "✔", "", "", "", "", "", "✔"],
          [null, "Estazolam", null, null, "-", "", "✔", "", "", "", "", ""],
          [null, "Triazolam", { t: "短", rs: 2 }, { t: "短效", rs: 2 }, "快", "", "✔", "", "", "", "", ""],
          [null, "Midazolam", null, null, "快", "✔", "", "✔", "", "", "✔", ""]],
          note: "※ 半衰期[u]{{越短|性質|越長}}[/u]，所造成之反彈性失眠[u]越嚴重[/u]★　　※ {{Flunitrazepam|藥名}} 為 FM2 之成分" } },
        { unit: "sh-bzd-3oh" }] },
      { id: "zdrug", title: "三、GABA_A 受體促效劑：Z-drugs（Nonbenzodiazepines）", items: [
        { group: "Nonbenzodiazepine GABA_A Agonists（Z-drugs）", source: "統整（一）p.12", table: { head: ["藥物", "Onset", "Duration", "DFA(難入睡)", "DMS(難維持)"], rows: [
          [{ t: "Eszopiclone", s: true }, "10-18", "{{中效|作用時間}}", "✔", "✔"],
          [{ t: "Zaleplon", s: true }, "15-30", { t: "超短效", s: true }, "✔", ""],
          [{ t: "Zolpidem", s: true }, "30", "短效", "✔", ""]] } }
      ] },
      { id: "gaba-ant", title: "四、GABA 受體拮抗劑", items: [
        { group: "GABA 受體拮抗劑", source: "統整（一）p.13", table: { head: ["β-Carbolines", "Bicuculline", "Flumazenil★"], rowNames: false, rows: [
          [{ img: "assets/medchem/beta-carbolines.png", t: "β-Carbolines" }, { img: "assets/medchem/bicuculline.png", t: "Bicuculline" }, { img: "assets/medchem/flumazenil.png", t: "Flumazenil" }],
          [{ t: "● 選擇性拮抗中樞 GABA_A 受體 Inverse agonist，可降低 BZD 之抑制作用", cs: 2 }, { t: "● GABA 負向異位調節劑，不興奮也不抑制，僅擋住受體阻斷藥物作用\n● 僅能 IV 給予\n● 可用於 BZD 與 Z-drug 過量之解毒劑", rs: 4 }],
          [{ t: "Picrotoxin", band: true }, { t: "Bemegride", band: true }],
          [{ img: "assets/medchem/picrotoxin.png", t: "Picrotoxin" }, { img: "assets/medchem/bemegride.png", t: "Bemegride" }],
          [{ t: "● 負向異位作用於 GABA_A 受體 GABA_A antagonist\n● 可用於 Barbiturates 過量之解毒劑", cs: 2 }]] } }
      ] },
      { id: "5ht", title: "五、血清素促效劑（Serotonin Agonists）", items: [{ unit: "sh-serotonin" },
        { title: "※ 補充", group: "血清素受體活化劑（Serotonin Receptor Active Agents）", source: "統整（一）p.14", points: [
          "※ 1-PP：1-(2-{{pyrimidyl|結構}}★)-piperazine",
          "※ 比較：{{Bupropion|藥名}} 為 NDRI，用來治療憂鬱症"] },
        { unit: "ssri-anxiolytic" },
        { group: "選擇性血清素再回收抑制劑（SSRIs）", source: "統整（一）p.15–16",
          table: { head: ["藥物", "結構", "特性", "藥理及臨床應用"], rows: [
            [{ t: "Phenoxyphenylalkylamine 類衍生物", cs: 4, band: true }],
            ["Fluoxetine\n抗焦慮、抗憂鬱", { img: "assets/medchem/ax-fluoxetine.png", t: "Fluoxetine" },
              "● 市售為消旋化合物，但 S form 效果較強（左圖★為 chiral center）\n● 含有 CF₃ 取代基（Fluoxetine）",
              "● 代謝：主要由 CYP2D6 行 N-去甲基化，形成活性代謝物 Norfluoxetine\n● 本分類的三個藥物之胺基都會質子化並與自身氧原子形成氫鍵\n→ 形成 {{β-arylamino-like group|結構}}"],
            ["Paroxetine\n抗焦慮、抗憂鬱", { img: "assets/medchem/ax-paroxetine.png", t: "Paroxetine" },
              "● Fluoxetine 的閉環類似物\n● 具有兩個 chiral center，所以有 4 個異構物\n→ 市售以 (3S, 4R)-(-)-enantiomer 為主",
              "● 代謝：胺基質子化並與自身氧原子形成氫鍵\n→ 形成β-arylamino-like group"],
            ["Citalopram\nEscitalopram\n抗焦慮、抗憂鬱", { img: "assets/medchem/ax-citalopram.png", t: "Citalopram" },
              "● 由 Talopram、S-Talsupram 衍生而來\n● 含有 C≡N、F 原子\n● 其 S-enantiomer 稱為 Escitalopram，對受體有高度親和力與選擇性",
              "代謝：\n● 進行 N-demethylation，主要代謝物仍有 50%活性\n● 胺基質子化並與自身氧原子形成氫鍵 → 形成β-arylamino-like group"],
            [{ t: "Phenylalkylamine 類衍生物", cs: 4, band: true }],
            ["Sertraline\n抗焦慮", { img: "assets/medchem/ax-sertraline.png", t: "Sertraline" },
              "● 含有 tetralin 結構，為 phenylaminotetralin\n● 具有兩個 chiral center\n→ 市售以 S, S-(+)-diastereomer 為主",
              "● 代謝：主要經 CYP2B6 行 N-去甲基化，主要代謝物活性比原來小 5-10 倍\n→ 仍屬於活性代謝物"],
            [{ t: "Miscellaneous 雜類藥物", cs: 4, band: true }],
            ["Fluvoxamine\n抗焦慮", { img: "assets/medchem/ax-fluvoxamine.png", t: "Fluvoxamine" },
              "● 屬於 nontricyclic SERT inhibitor※\n● 使用上以 E form 為主（異側）\n● 由 Noxiptilin 開環修飾得到\n● 苯環對位上有 CF₃ 取代基\n● 具有長碳鏈脂溶性端（aliphatic）",
              "代謝：\n● CYP2D6 行 O-去甲基化，最後氧化成酸\n● 胺基質子化並與自身氧原子形成氫鍵 → 形成β-arylamino-like group"]],
            note: "※ SERT（Serotonin transporter）：血清素轉運蛋白，會將移除突觸間隙中的血清素，使血清素濃度下降\n※ Dexfenfluramine：低劑量時可造成 5-HT 釋放並抑制其再回收，進而降低食慾、減輕體重，用作減肥藥，但因心臟副作用已下市" },
          gallery: [
            { img: "assets/medchem/talopram.png", cap: "Talopram" },
            { img: "assets/medchem/talsupram.png", cap: "Talsupram" },
            { img: "assets/medchem/phthalane.png", cap: "Phthalane" },
            { img: "assets/medchem/tetralin.png", cap: "Tetralin" },
            { img: "assets/medchem/noxiptilin.png", cap: "Noxiptilin" }] }] },
      { id: "melatonin", title: "六、褪黑激素受體促效劑（Melatonin Receptor Agonists）", items: [{ unit: "melatonin-intro" }] },
      { id: "h1", title: "七、第一代 H₁-blockers（Anti-histamine Agents）鎮靜安眠", items: [{ unit: "h1-intro" },
        { group: "第一代 H₁ 受體拮抗劑（Histamine H₁ Receptor Antagonists）", source: "統整（一）p.18",
          table: { head: [[{ t: "Ethanolamine ether 類衍生物", cs: 2 }, "Tricyclic 類衍生物"], ["Diphenhydramine", "Doxylamine", "Doxepine"]],
            cols: ["Diphenhydramine", "Doxylamine", "Doxepine"], rowNames: false, rows: [
              ["● {{Antimuscarinic|機轉}} 最強，可穿過 BBB\n● 具有高結合力", "● 和 Diphenhydramine 差一個甲基\n● 具有高結合力", "具有含 O 七元雜環（{{Oxepin|結構}}）\n● {{E form|結構|Z form}} 具有 CNS 抑制活性"],
              [{ img: "assets/medchem/diphenhydramine.png", t: "Diphenhydramine" }, { img: "assets/medchem/doxylamine.png", t: "Doxylamine" }, { img: "assets/medchem/doxepin.png", t: "Doxepine" }]] } }] },
      { id: "orexin", title: "八、Orexin Antagonist", items: [] }
    ] },
  ch2: { chapter: 2, title: "抗癲癇藥物",
    sections: [
      { id: "intro", title: "貳、抗癲癇藥物（Antiseizure Drugs）", items: [
        // 講義 p.19 的示意圖都重畫成 SVG（assets/medchem/ae-*.svg），數字表格改成真的表格
        { title: "精神藥理學簡介", source: "統整（一）p.19", points: [
          "1. 離子通道之分布與動作電位",
          "> a. 人體主要由（生理食鹽）水組成，所以{{細胞外|位置|細胞內}} Na⁺、Cl⁻多",
          "> b. 被動運輸：由{{高|性質|低}}濃度往低濃度方向跑"] },
        { title: "細胞內外的離子分布", source: "統整（一）p.19", images: ["assets/medchem/ae-ions.svg"],
          table: { head: [["細胞內", { t: "", rs: 2 }, "細胞外"], ["Intracellular Water (2/3)", "Extracellular Water (1/3)\nInterstitial (2/3)｜Blood (1/3)"]],
            cols: ["細胞內", "離子", "細胞外"], rows: [
              ["25", { t: "Na", s: true }, "★140"], ["★150", { t: "K", s: true }, "4.5"], ["★15", { t: "Mg", s: true }, "1.2"],
              ["0.01", { t: "Ca", s: true }, "★2.4"], ["2", { t: "Cl", s: true }, "★100"], ["6", { t: "HCO₃", s: true }, "★25"], ["★50", { t: "Phos", s: true }, "1.2"]] } },
        { title: "動作電位與抗癲癇藥物", source: "統整（一）p.19",
          images: ["assets/medchem/ae-flux.svg", "assets/medchem/ae-ap.svg"],
          table: { head: ["抗癲癇藥物：調節離子通道"], rows: [["1. 阻斷 Na⁺通道"], ["2. 阻斷 T-type Ca²⁺通道"], ["3. 促進 K⁺通道"], ["4. 間接促進 Cl⁻通道：BZD 藥物（輔助）"]] },
          points: [
            "興奮狀態（[u]癲癇發作[/u]） → 細胞產生動作電位 → {{正電|性質|負電}}狀態",
            "抗癲癇藥物 → 抑制興奮 → {{負電|性質|正電}}狀態"] },
        { title: "神經傳遞物質", source: "統整（一）p.19", points: [
          "2. 神經傳遞物質（Neurotransmitters）",
          "> ・興奮性神經遞質：{{Glutamate|物質}}、Serotonin、Histamine（註）",
          "> ・抑制性神經遞質：{{GABA|物質}}、Glycine",
          "> ・Acetylcholine、NE、Dopamine 等依據作用受體不同，會產生不同的反應",
          "註：此三種神經遞質並非總是造成興奮性作用，在某些受體作用時會產生抑制性反應，只是興奮的情況仍然佔大多數"],
          images: ["assets/medchem/ae-flow.svg"] },
        { title: "各類型癲癇治療首選藥物整理（★重要）", source: "統整（一）p.19",
          table: { head: [{ t: "癲癇種類", cs: 2 }, "首選藥物"], cols: ["", "首選藥物", "首選藥物"],
            rowNames: ["局部性發作", "全身強直痙攣發作（大發作）", "失神性發作（小發作）", "肌攣性發作", "癲癇重積症"],
            rows: [
              [{ t: "局部性發作", cs: 2 }, "{{Carbamazepine|藥名}}、Phenytoin、Valproic acid"],
              [{ t: "全身性發作", rs: 3 }, { t: "全身強直痙攣發作（大發作）", s: true }, "Carbamazepine、Phenytoin、{{Valproic acid|藥名}}"],
              [null, { t: "失神性發作（小發作）", s: true }, "{{Ethosuximide|藥名}}、Lamotrigine、Valproic acid"],
              [null, "肌攣性發作", "{{Valproic acid|藥名}}、Clonazepam"],
              [{ t: "癲癇重積症", cs: 2, s: true }, "{{Lorazepam|藥名}}、Diazepam"]] } },
        { title: "癲癇之疾病成因", source: "統整（一）p.20", points: [
          "1. 離子通道異常：細胞外 Ca²⁺↓、K⁺↑，造成腦部異常放電",
          "2. 抑制性 GABA 系統被抑制",
          "3. 興奮性 Glutamate 系統被促進"] },
        { title: "藥物作用位置", source: "統整（一）p.20",
          // 題目標題用的列名：挖空在左欄的列，列名改寫成不會洩漏答案的說法（例如「Ethosuximide 的作用位置」）
          table: { rowNames: ["", "阻斷 Na⁺通道", "Ethosuximide 的作用位置", "促進 K⁺通道開啟", "", "抑制 GAT 再回收", "活化 GABA_A 受體", "Vigabatrin 的作用位置", "增強 GAD 作用",
              "", "阻斷 P/Q-type Ca²⁺通道", "阻斷 NMDA 的 Ca²⁺通道", "阻斷 AMPA/KA 的 Na⁺通道", "抑制 Glutamate 釋放", "", "廣效型藥物：多重作用機轉"],
            rows: [
              [{ t: "調節離子通道", cs: 2, band: true }],
              [{ t: "阻斷 Na⁺通道\n（{{最多|性質}}藥物作用）", s: true }, "Carbamazepine、Oxcarbazepine、\nLamotrigine、Lacosamide、Phenytoin"],
              ["阻斷 {{T-type|名詞}} Ca²⁺通道", "Ethosuximide"],
              ["促進 K⁺通道開啟", "{{Ezogabine|藥名}}（[u]Retigabine[/u]）"],
              [{ t: "促進抑制性 GABA 作用", cs: 2, band: true }],
              ["抑制 GAT 再回收", { t: "{{Tiagabine|藥名}}", s: true }],
              ["活化 GABA_A 受體", "BZDs、Phenobarbital"],
              ["抑制 {{GABA-T|標的}} 代謝", { t: "Vigabatrin(不可逆)", s: true }],
              ["增強 GAD 作用", "Gabapentin"],
              [{ t: "抑制興奮性 Glutamate 作用", cs: 2, band: true }],
              ["阻斷 P/Q-type Ca²⁺通道", "Gabapentin、Pregabalin"],
              ["阻斷 NMDA 的 Ca²⁺通道", "{{Felbamate|藥名}}"],
              ["阻斷 AMPA/KA 的 Na⁺通道", "Topiramate"],
              ["抑制 Glutamate 釋放", "Lamotrigine"],
              [{ t: "廣效型藥物：多重作用機轉", cs: 2, band: true }],
              [{ t: "{{Valproate|藥名}}、Levetiracetam、Topiramate、Zonisamide、Felbamate", cs: 2 }]],
            note: "※ GAD = glutamate decarboxylase（可合成 GABA）\n※ GAT = GABA transporter（可回收 GABA）\n※ GABA-T = GABA transaminase（會代謝 GABA）" },
          images: ["assets/medchem/ae-venn.svg"] },
        { title: "癲癇重積症（Status Epilepticus）", source: "統整（一）p.20", table: { rows: [["Diazepam、Lorazepam、Midazolam"]] } }
      ] },
      { id: "partial", title: "一、局部性及全身強直-痙攣性癲癇發作藥物（Drugs for Partial and Generalized Tonic-Clonic Seizures）", items: [
        { group: "抗癲癇巴比妥類（Barbiturates）", source: "統整（一）p.22", points: [
          "（Barbiturates 及 Benzodiazpines 類藥物已經在前面介紹過，這裡在放一次供複習統整使用）",
          "抗癲癇巴比妥類（Barbiturates）：Phenobarbital、Mephobarbital、Primidone",
          "Phenobarbital 為{{兒童復發性癲癇|疾病}}首選藥；{{Primidone|藥名}} 需代謝為 Phenobarbital 才有活性。"] },
        { title: "※ 補充", group: "Iminostilbene 類衍生物", source: "統整（一）p.23", points: [
          "※ Carbamazepine 之代謝路徑：CBZ → 2-hydroxy-CBZ → 2-hydroxyiminostilbene({{2-OHIS|代謝物}}) → CBZ-Iminoquinone(CBZ-IQ)",
          "※ Carbamazepine 和 {{Trazodone|藥名}} 都會代謝產生 Iminoquinone"] },
        { title: "※ 補充", group: "Biscarbamates 類衍生物", source: "統整（一）p.24", points: [
          "※ NMDA 抑制劑：Amantadine、Memantadine、{{Ketamine|藥名}}、PCP、Felbamate",
          "※ Meprobamate"],
          structs: ["assets/medchem/ae-meprobamate.png"] },
        { title: "GABA★", group: "GABA 類衍生物", source: "統整（一）p.25", structs: ["assets/medchem/ae-gaba2.png"] },
        { title: "Nipecotic acid", group: "未分類結構", source: "統整（一）p.27", structs: ["assets/medchem/ae-nipecotic.png"] }
      ] },
      { id: "absence", title: "二、失神性癲癇發作藥物（Drugs for Absence Seizures）：機轉皆為阻斷 T-type Ca²⁺通道", items: [
        { group: "Succinimides 類衍生物（字尾-suximide）", source: "統整（一）p.29", points: [
          "Succinimides 類衍生物（字尾-suximide）：結構中含有 Ureide，機轉皆為阻斷 {{T-type|名詞}} Ca²⁺通道"] }
      ] },
      { id: "myoclonic", title: "三、肌攣性癲癇發作藥物（Drugs for Myoclonic Seizures）", items: [
        { source: "統整（一）p.30", points: [
          "常用之藥物為 {{Clonazepam|藥名}} 和 Valoproate sodium（Valproic acid）",
          "研究顯示 Lamotrigine 和 Topiramate 對於肌攣性發作都有用，但未被 FDA 核准"],
          gallery: [
            { img: "assets/medchem/clonazepam.png", cap: "Clonazepam" },
            { img: "assets/medchem/valproic-acid.png", cap: "Valproic acid" },
            { img: "assets/medchem/lamotrigine.png", cap: "Lamotrigine" },
            { img: "assets/medchem/topiramate.png", cap: "Topiramate" }] }
      ] },
      { id: "status", title: "四、癲癇重積症藥物（Drugs for Status Epilepticus）", items: [
        { source: "統整（一）p.30", points: [
          "常用之藥物為 {{Diazepam|藥名}}★、Lorazepam 和 Midazolam（皆為 {{BZD|藥物類別}} 類藥物）",
          "- Diazepam 可以 IV 或 IM 給藥，為{{最常使用|性質}}的藥物",
          "- Lorazepam 和 Midazolam 沒有被 FDA 核准，但都是臨床上治療用的藥物",
          "> （Lorazepam 的 Duration 長、Midazolam 的 Onset 快）"],
          gallery: [
            { img: "assets/medchem/diazepam.png", cap: "Diazepam" },
            { img: "assets/medchem/lorazepam.png", cap: "Lorazepam" },
            { img: "assets/medchem/midazolam.png", cap: "Midazolam" }] }
      ] },
      { id: "summary", title: "總整理", items: [
        { source: "統整（一）p.31", points: [
          "※ Ureide 基本結構衍生物：{{Barbiturates|藥物類別}}、Hydantoin、Oxazolidinediones、Succinimides",
          "> （Ureide 可形成 {{enolic hydroxy|結構}}，在{{鹼性|性質|酸性}}水溶液中解離程度較大）"],
          images: ["assets/medchem/ae-ureide-classes.png"] },
        { title: "※ 副作用統整", source: "統整（一）p.31", table: { rows: [
          [{ t: "體重增加", b: true }, "{{Valproic acid|藥名}}、Gabapentin、Vigabatrin"],
          [{ t: "體重減少", b: true }, "{{Felbamate|藥名}}、Topiramate、Zonisamide"],
          [{ t: "Absence seizure", b: true }, "Valproic acid、{{Ethosuximide|藥名}}、Lamotrigine"],
          [{ t: "孕婦禁用", b: true }, "{{Phenytoin|藥名}}、Topiramate"],
          [{ t: "無藥物交互作用", b: true }, "Ethosuximide、Gabapentin、{{Levetiracetam|藥名}}"],
          [{ t: "Steve-Johnson 症狀", b: true }, "Phenytoin、Carbamazepine、{{Lamotrigine|藥名}}"]] } }
      ] }
    ] },
  ch3: { chapter: 3, title: "抗憂鬱藥物",
    sections: [
      { id: "overview", title: "參、抗憂鬱藥物（Antidepressant Drugs）", items: [
        { title: "抗憂鬱藥物分類", source: "統整（一）p.32",
          table: { head: ["分類", "縮寫", "藥物"], cols: ["分類", "縮寫", "藥物"],
            rowNames: ["NSRI", "SNRI", "SSRI", "DNRI", "SRM／SARI", "NaSSA", "MAOI", "心情穩定劑"],
            rows: [
              ["非選擇性之正腎上腺素與血清素再回收抑制劑\nNorepinephrine and Serotonin Reuptake Inhibitor", "NSRI",
                "● Amitriptyline 類 TCA：Amitriptyline、Doxepin、Dosulepin\n● Imipramine 類 TCA：Imipramine、Clomipramine、Trimipramine、Lofepramine\n● 非 TCA：Venlafaxine、Desvenlafaxine、Milnacipran、Duloxetine"],
              ["選擇性正腎上腺素再回收抑制劑\nSelective Norepinephrine Reuptake Inhibitor", "SNRI",
                "● TCA：Desipramine、Nortriptyline、Amoxapine、Protriptyline、Maprotiline\n● 非 TCA：Reboxetine、{{Atomoxetine|藥名|Duloxetine/Venlafaxine/Bupropion}}"],
              ["選擇性血清素再回收抑制劑\nSelective Serotonin Reuptake Inhibitor", "SSRI", "Fluoxetine、Paroxetine、Citalopram、Sertraline、Fluvoxamine"],
              ["多巴胺與正腎上腺素再回收抑制劑\nDopamine and Norepinephrine Reuptake Inhibitor", "DNRI", "{{Bupropion|藥名|Trazodone/Mirtazapine/Reboxetine}}"],
              ["血清素受體調節劑（拮抗劑與再回收抑制劑）\nSerotonin Receptor Modulator /\nSerotonin Antagonist & Reuptake Inhibitor", "SRM\nSARI", "{{Trazodone|藥名|Bupropion/Mianserin/Moclobemide}}、Aripiprazole、Vilazodone"],
              ["正腎上腺素與選擇性血清素拮抗劑\nNoradrenaline and Selective Serotonin Antagonist", "NaSSA", "Mianserin、{{Mirtazapine|藥名|Maprotiline/Milnacipran/Moclobemide}}"],
              ["單胺氧化酶抑制劑\nMonoamine Oxidase Inhibitor", "MAOI", "● 選擇性：{{Moclobemide|藥名|Phenelzine/Tranylcypromine}}\n● 非選擇性：Phenelzine、Tranylcypromine"],
              ["心情穩定劑／Mood Stabilizers", "-", "{{Lithium|藥名}}、Valproic acid、Carbamazepine"]] } }
      ] },
      { id: "nsri", title: "一、正腎上腺素及血清素再回收抑制劑 NSRI（Norepinephrine and Serotonin Reuptake Inhibitors）", items: [
        { title: "※ 補充", group: "含末端三級胺之三環抗憂鬱藥物（TCA-NSRIs）", source: "統整（一）p.33", points: [
          "※ TCA 大多具有{{高度首渡代謝|代謝}}，且有 Antihistamine、α-blocker、Antimuscarinic 的副作用（抗 {{HAM|名詞}}）"] },
        { title: "※ 補充", group: "非三環結構之 NE/5-HT 再回收抑制劑（Non-TCA NSRIs）", source: "統整（一）p.35", points: [
          "※ 作用強弱：{{Duloxetine|藥名|Venlafaxine/Milnacipran}} > Milnacipran > Venlafaxine"] }
      ] },
      { id: "snri", title: "二、選擇性正腎上腺素再回收抑制劑 SNRI（Selective Norepinephrine Reuptake Inhibitors）", items: [
        { title: "※ 補充", group: "含末端二級胺之三環抗憂鬱藥物（TCA-SNRIs）", source: "統整（一）p.36", points: [
          "※ Loxapine 的五個活性代謝物：7 or 8-hydroxyloxapine、{{Amoxapine|藥名}}、7 or 8-hydroxyamoxapine"] }
      ] },
      { id: "ssri", title: "三、選擇性血清素再回收抑制劑 SSRI（Selective Serotonin Reuptake Inhibitors）：憂鬱症首選用藥", items: [
        { group: "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥", source: "統整（一）p.38", points: [
          "（與抗焦慮用藥之部分相同）",
          "※ 體重下降：SNRI、{{DNRI|藥物類別|SSRI/NaSSA/TCA}}／體重上升：TCA、SSRI、NaSSA"] },
        { title: "※ 補充", group: "選擇性血清素再回收抑制劑（Selective Serotonin Reuptake Inhibitors, SSRIs）：同時為第一線抗焦慮用藥", source: "統整（一）p.39", points: [
          "※ SERT（Serotonin transporter）：血清素轉運蛋白，會將突觸間隙中的血清素移除，使血清素濃度下降"],
          gallery: [
            { img: "assets/medchem/ad-tetralin.png", cap: "Tetralin" },
            { img: "assets/medchem/ad-noxiptilin.png", cap: "Noxiptilin" }] }
      ] },
      { id: "dnri", title: "四、多巴胺及正腎上腺素再回收抑制劑 DNRI（Dopamine and Norepinephrine Reuptake Inhibitors）", items: [
        { group: "多巴胺及正腎上腺素再回收抑制劑（DNRI）", source: "統整（一）p.40", points: [
          "此類藥物有{{雙重作用|機轉}}：可同時抑制 Dopamine 和 Norepinephrine 的再回收",
          "※ Bupropion 除了可抗憂鬱之外，也能降低菸癮，作為{{戒菸用藥|用途}}。"] },
        { title: "※ Methamphetamine 之結構", group: "多巴胺及正腎上腺素再回收抑制劑（DNRI）", source: "統整（一）p.40",
          structs: ["assets/medchem/ad-methamphetamine.png"] }
      ] },
      { id: "srm", title: "五、血清素受體調節劑 SRM/SARI（Serotonin Receptor Modulator / Serotonin Antagonist & Reuptake Inhibitor）", items: [] },
      { id: "nassa", title: "六、NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", items: [
        { title: "機轉", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42", points: [
          "{{α₂-antagonist|機轉}} 和 {{5-HT₃ antagonist|機轉}}，可以增強傳遞 NE 或是 5-HT（{{沒有|性質|有}}抑制再回收的作用）"] },
        { title: "藥物個論：Mirtazapine、Mianserin", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42", points: [
          "Mirtazapine 屬於 pyrazinopyridobenzazepine 類抗憂鬱藥",
          "Mirtazapine 和 Mianserin [u]互為[/u] {{isostere|名詞}}（生物等效物）",
          "- Mirt[u]aza[/u]pine 含有 pyridine 結構",
          "- Mianserin 含有 benzene 結構"],
          gallery: [
            { img: "assets/medchem/ad-mianserin.png", cap: "Mianserin" },
            { img: "assets/medchem/ad-mirtazapine.png", cap: "Mirtazapine" }] },
        { title: "Mianserin 與 Mirtazapine 比較", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42",
          table: { head: ["藥物", "Mianserin", "Mirtazapine"], cols: ["藥物", "Mianserin", "Mirtazapine"], rows: [
            ["右邊苯環之 6 號位", "C（benzene）", { t: "N（pyridine）", s: true }],
            ["對 NET 之影響", "NET inhibitor", "無影響"],
            ["抗憂鬱之效果", "● 僅在歐洲使用，美國不使用\n● 造成[u]顆粒性白血球缺乏症[/u]、白血球減少症",
              "以 pyridine 取代苯環，造成：\n● 極性增加\n● 分配係數下降／水溶性↑\n● 鹼度下降\n● NET 抑制劑活性較弱"],
            ["備註", "副作用太大，改用 Mirtazapine", "具有含 N 之 pyridine（-aza-）"],
            ["副作用", { t: "鎮靜、體重上升★，但不會影響性功能", cs: 2 }]] } },
        { title: "藥物代謝", group: "NaSSA（Noradrenaline and Specific-Serotonergic Antidepressant）", source: "統整（一）p.42", points: [
          "2 號位上的 C 進行 N-desmethylation（代謝物具微弱活性）",
          "8 號位上的 C 水解後加上 OH 基，形成 8-hydroxymirtazapine（具微弱活性）",
          "{{N-oxide|代謝物|8-hydroxy/N-desmethyl}} 之代謝產物無活性"],
          images: ["assets/medchem/ad-mirtazapine-metabolites.png"] }
      ] },
      { id: "maoi", title: "七、單胺氧化酶抑制劑 MAOI（Monoamine Oxidase Inhibitor）", items: [
        { title: "藥物簡介", group: "單胺氧化酶抑制劑（MAOI）", source: "統整（一）p.43", points: [
          "由 {{Isoniazid|藥名}}（抗分枝桿菌藥物）衍生而來，具有{{單胺氧化酶抑制|機轉}}作用（減緩單胺被降解），可治療憂鬱症",
          "不能和富含 {{Tyramine|物質}} 的食物併服，會有產生{{高血壓|副作用|低血壓}}的風險",
          "> ※ Tyramine 富含於發酵食物，如紅酒、乳酪、優格、味噌、香腸、培根等",
          "因 MAOI 與多種藥物有交互作用，為抗憂鬱症之{{最後一線|名詞|第一線}}用藥"] }
      ] },
      { id: "mood", title: "八、情緒穩定劑：Lithium", items: [] }
    ] },
  ch4: { chapter: 4, title: "神經疾病相關藥物",
    sections: [
      { id: "pd", title: "一、帕金森氏症藥物（Parkinson's Disease）", items: [
        { title: "帕金森氏症藥物分類", source: "統整（一）p.44",
          table: { head: ["分類", "作用機轉", "藥物"], cols: ["分類", "作用機轉", "藥物"],
            rowNames: ["Dopamine 之前驅藥", "抑制週邊 Dopamine decarboxylase", "抑制 COMT 分解 Dopamine", "Selegiline、Rasagiline 的作用機轉",
              "麥角生物鹼類", "非麥角生物鹼類", "阻斷中樞毒蕈鹼受體", "具有中樞抗膽鹼作用之 H₁-blocker", "Adenosine A₂A antagonist"],
            rows: [
              ["增加 Dopamine 合成", "Dopamine 之前驅藥", "Levodopa"],
              [{ t: "抑制 Dopamine 代謝", rs: 3 }, "抑制週邊 Dopamine decarboxylase※", "{{Carbidopa|藥名|Entacapone/Selegiline}}★、Benserazide"],
              [null, "抑制 COMT 分解 Dopamine", "Entacapone（週邊作用）、Tolcapone（{{中樞|位置|週邊}}作用）"],
              [null, "不可逆抑制中樞的 {{MAO-B|酵素|MAO-A/COMT}}", "Selegiline、Rasagiline"],
              [{ t: "活化 Dopamine 受體", rs: 2 }, "麥角生物鹼類", "Bromocriptine、Pergolide、Lisuride★、Cabergoline"],
              [null, "非麥角生物鹼類", "Pramipexole、Ropinirole、Rotigotine、Apomorphine"],
              [{ t: "降低 ACh 活性", rs: 2 }, "阻斷中樞毒蕈鹼受體", "Benztropine、Biperiden、Procyclidine、Trihexyphenidyl"],
              [null, "具有中樞抗膽鹼作用之 H₁-blocker", "Ethopropazine、Diethazine、{{Diphenhydramine|藥名|Benztropine/Trihexyphenidyl}}"],
              ["促進 Dopamine 釋放", "Adenosine A₂A antagonist", "{{Amantadine|藥名|Selegiline/Entacapone}}★、Memantine、Istradefylline、Sarizotan"]],
            note: "註：Dopamine decarboxylase 又名 Aromatic L-amino acid decarboxylase" } },
        { title: "※ 合併使用之藥品", source: "統整（一）p.44", points: [
          "Sinemet® = Levodopa + {{Carbidopa|藥名|Benserazide/Entacapone}}",
          "Madopar® = Levodopa + {{Benserazide|藥名|Carbidopa/Entacapone}}",
          "Stalevo® = Sinemet® + {{Entacapone|藥名|Tolcapone/Benserazide}}"] },
        { title: "※ MPPP 與 MPTP", source: "統整（一）p.44", points: [
          "MPPP 水解後可形成 MPTP，再被 {{MAO-B|酵素|MAO-A/COMT}}★氧化代謝成毒性代謝物 {{MPP⁺|代謝物|MPDP⁺/MPTP}}，可產生自由基破壞多巴胺神經"],
          images: ["assets/medchem/pd-mppp.png"] },
        { title: "帕金森氏症藥物作用位置", source: "統整（一）p.44",
          images: ["assets/medchem/pd-pathway.svg", "assets/medchem/pd-carbidopa.svg"] },
        { title: "※ 補充", group: "抑制 Dopamine 代謝", source: "統整（一）p.45", points: [
          "※ MAO-A：代謝 NE+5-HT、MAO-B：代謝 {{Dopamine|物質|NE/5-HT}}"],
          structs: ["assets/medchem/pd-dopamine.png"] },
        { group: "阻斷中樞毒蕈鹼受體", source: "統整（一）p.47", points: [
          "阻斷{{膽鹼性受體|受體}}可產生類似增加多巴胺神經傳導的作用。",
          "副作用：散瞳、尿液滯留、口乾，{{青光眼|疾病}}、{{前列腺肥大|疾病}}患者應避免使用。"] }
      ] },
      { id: "ad", title: "二、阿茲海默症藥物（Alzheimer's Disease）", items: [
        { title: "阿茲海默症", source: "統整（一）p.48", points: [
          "為一種神經退化性疾病，原因為腦部神經細胞受到破壞。治療阿茲海默症之藥物主要有{{膽鹼酯酶抑制劑|藥物類別|NMDA 受體促效劑}}及 {{NMDA 受體拮抗劑|藥物類別|膽鹼酯酶活化劑}}，幫助患者減緩心智功能退化。",
          "另外也可給予抗精神病藥物或抗憂鬱劑等，用於改善患者的精神行為症狀。"] }
      ] },
      { id: "hd", title: "三、亨廷頓舞蹈症（Huntington's Disease）", items: [
        { title: "亨廷頓舞蹈症", source: "統整（一）p.48", points: [
          "為一種{{體染色體顯性|名詞|體染色體隱性/性聯隱性}}遺傳的中樞退化疾病，原因為第四對染色體的基因突變，導致 {{CAG|名詞}} 重複序列過度擴張。"] }
      ] }
    ] },
  ch5: { chapter: 5, title: "抗精神病藥物",
    sections: [
      { id: "overview", title: "※ 疾病介紹與藥物副作用", items: [
        { title: "1. 思覺失調症/精神分裂症（Schizophrenia）", source: "統整（一）p.49", points: [
          "(1) 與中腦邊緣系統（Mesolimbic-frontal pathway）中的{{多巴胺神經活動增加|機轉|多巴胺神經活動減少}}★有關"],
          table: { head: ["Dopamine 傳導路徑", "功能", "阻斷後之情形"], cols: ["Dopamine 傳導路徑", "功能", "阻斷後之情形"],
            rowNames: ["黑質紋狀體（Nigrostriatal）", "中腦皮質與邊緣系統（Mesocortical & Mesolimbic）", "結節漏斗（Tuberoinfundibular）"],
            rows: [
              ["黑質紋狀體\n（Nigrostriatal）", "運動", "產生{{錐體外作用（EPS）|副作用}}\n→ 類似帕金森氏症的症狀"],
              ["中腦皮質與邊緣系統\n（Mesocortical & Mesolimbic）", "情緒、行為", "可改善{{精神分裂症|疾病}}之症狀\n→ Mesocortical 與{{負向|名詞|正向}}情緒有關\n→ Mesolimbic 與正向情緒有關"],
              ["結節漏斗\n（Tuberoinfundibular）", "荷爾蒙", "導致{{泌乳激素分泌增加|副作用}}（Prolactin）\n→ 可使用 Bromocriptine 治療"]] } },
        { title: "多巴胺與抗精神病藥物", source: "統整（一）p.49", points: [
          "(2) 多巴胺分泌[u]過多[/u]：{{精神分裂症|疾病|帕金森氏症}}★、藥物或酒精濫用",
          "> 多巴胺分泌[u]過少[/u]：{{帕金森氏症|疾病|精神分裂症}}★、高泌乳激素血症",
          "(3) 大多數的抗精神病藥物可{{阻斷|機轉|活化}}中樞神經系統的節後 {{D₂ receptor|受體}}（邊緣系統的 Dopamine 過多產生正向症狀）",
          "(4) 因多巴胺神經元之抑制作用在正常情況下可藉由膽鹼性神經元的興奮作用來達到平衡",
          "→ Anticholinergic agents（如 {{Benztropine|藥名}}）可改善錐體外症狀的副作用",
          "※ 本章藥物主要以 D₂-receptor blockers 為主（以 mesolimbic-frontal pathway 為主）"] },
        { title: "2. 藥物副作用總整理", source: "統整（一）p.50",
          table: { head: [{ t: "藥物", cs: 2 }, "EPS", "抗膽鹼作用", "體重增加", "高泌乳激素血症", "鎮靜"], rows: [
            [{ t: "第一代抗精神疾病藥物", cs: 7, band: true }],
            [{ t: "低效價", rs: 3 }, "Chlorpromazine", "+++", "+++", "++", "+++", { t: "++++", s: true }],
            [null, "Thioridazine", "+++", "++++", "+", "+++", "+++"],
            [null, "Thiothixene", { t: "++++", s: true }, "+", "+", "++++", "+"],
            [{ t: "高效價", rs: 2 }, "Fluphenazine", { t: "++++", s: true }, "+", "+", "++++", "+"],
            [null, "Haloperidol", { t: "++++", s: true }, "+", "+", "++++", "+"],
            [{ t: "第二代抗精神疾病藥物", cs: 7, band: true }],
            [{ t: "Aripiprazole", cs: 2 }, "+", "+", "+", "+", "+"],
            [{ t: "Clozapine", cs: 2 }, "+", "++++", "+++", "+", "++++"],
            [{ t: "Olanzapine", cs: 2 }, "++", "++", { t: "++++", s: true }, "+", "++"],
            [{ t: "Risperidone", cs: 2 }, "++", "+", "++", { t: "++++", s: true }, "+"],
            [{ t: "Paliperidone", cs: 2 }, "++", "+", "++", { t: "++++", s: true }, "+"]] } },
        { title: "副作用重點", source: "統整（一）p.50", points: [
          "(1) 錐體外症狀：主要由{{第一代|藥物類別|第二代}}★抗精神病藥物引起，會產生類帕金森氏症的症狀",
          "(2) 高泌乳激素血症：Prolactin 的分泌會被 Dopamine 所抑制；{{Risperidone|藥名|Olanzapine/Clozapine}}★、Paliperidone 容易產生此副作用",
          "(3) 顆粒性白血球減少：嚴重程度 {{Clozapine|藥名|Olanzapine/Risperidone}}★ > Chlorpromazine > Olanzapine",
          "(4) 體重增加：{{第二代|藥物類別|第一代}}抗精神病藥物較容易產生，推測與阻斷 5-HT 受體有關；增加程度 {{Olanzapine|藥名|Risperidone/Quetiapine}}★ > Risperidone > Quetiapine"] }
      ] },
      { id: "gen1", title: "一、第一代精神疾病藥物（典型）", items: [
        { group: "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物", source: "統整（一）p.51", points: [
          "第一代主要治療{{正向|名詞|負向}}症狀，且具有止吐作用（第二代無止吐作用）",
          "依據不同的 {{N-10|位置|C-2}} 取代基分為以下三類："],
          structs: ["assets/medchem/ap-phenothiazine.png"],
          table: { head: [{ t: "分類", cs: 2 }, "活性", "EPS", "鎮靜", "字尾"], cols: ["分類", "分類", "活性", "EPS", "鎮靜", "字尾"],
            rowNames: ["Aliphatic 直鏈衍生物", "Piperidine 衍生物", "Piperazine 衍生物末端接-CH₃", "Piperazine 衍生物末端接-OH"],
            rows: [
              [{ t: "Aliphatic 直鏈衍生物", cs: 2 }, null, "最弱", "最弱", { t: "{{最強|性質|最弱}}★", s: true }, "-promazine"],
              [{ t: "Piperidine 衍生物", cs: 2 }, null, "↓", "↓", "↓", "{{-ridazine|名詞|-perazine/-phenazine}}"],
              [{ t: "Piperazine 衍生物", rs: 2 }, "末端接-CH₃", "↓", "↓", "↓", "-perazine"],
              [null, "末端接-OH", "最強", { t: "{{最強|性質|最弱}}★", s: true }, "最弱", "{{-phenazine|名詞|-perazine/-promazine}}"]] } },
        { title: "結構修飾與 SAR★ → 模擬 Dopamine 結構", group: "第一代精神疾病藥物：Phenothiazine（PTZ）類衍生物", source: "統整（一）p.51",
          images: ["assets/medchem/ap-ptz-sar.png"],
          table: { rowNames: ["Site A", "Site B", "Site C"], rows: [
            [{ t: "Site A", b: true }, "● 當末端從-CH₃ 變成-{{NC₂H₅OH|取代基}} 時，為最強效之 PTZs"],
            [{ t: "Site B", b: true }, "● 只有{{三個碳|數值|兩個碳}}★的長度才具抗精神病活性，且三個碳上都不可有分支\n● 若為兩個碳的長度，則具抗組織胺 H₁、抗毒蕈鹼活性，為{{帕金森氏症|疾病}}藥物"],
            [{ t: "Site C", b: true }, "● Phenothiazine 之結構{{非同平面|結構}}，而是折成蝶翼的形狀\n● N-10 的側鏈必彎向 2 號碳上的取代基：Site A 和 C 必為 [u]cis form[/u]\n● 取代基只能在 [u]2 號碳[/u]★上（S 的對位），否則會影響抗精神病活性\n● 取代基為{{拉電子基|取代基|推電子基}}時，可增加活性\nex. -Cl、-CF₃★、-SCH₃、-SOCH₃、-COCH₃、-SC₂H₅"]] } },
        { title: "SAR", group: "第一代精神疾病藥物：Thioxanthene 類衍生物（名字中有-thix-）", source: "統整（一）p.54", points: [
          "C9 上接有{{烯雙鍵|結構}}（olefinic double bond）",
          "→ 存在{{順反異構物|結構}}，且 [u]cis form[/u] 活性大",
          "C9 若接飽和單鍵，活性會{{降低|性質|增加}}",
          "其餘 SAR 與 Phenothiazine 類藥物相同"],
          structs: ["assets/medchem/ap-thioxanthene.png"] },
        { title: "※ 補充", group: "第一代精神疾病藥物：Thioxanthene 類衍生物（名字中有-thix-）", source: "統整（一）p.54", points: [
          "※ 代謝：與 Phenothiazine 相似，但兩個芳香環{{不會|性質|會}} hydroxylation"] },
        { title: "Butyrophenone（藥效基團）", group: "第一代精神疾病藥物：Butyrophenone 類衍生物（字尾-peridol / -perone）", source: "統整（一）p.55",
          structs: ["assets/medchem/ap-butyrophenone.png"] },
        { group: "第一代精神疾病藥物：Diphenylbutyl piperidine 類衍生物", source: "統整（一）p.56", points: [
          "將 Butyrophenone 的酮基以 {{4-Fluorophenyl|取代基}} 取代，可有效{{降低藥物的代謝|性質}}，增強作用時間"] },
        { title: "※ 國考", group: "第一代精神疾病藥物：Benzamide 類衍生物", source: "統整（一）p.57", points: [
          "※ 國考：何者不是 Benzamide 類 5-HT₄ agonist 芳香環上常見之取代基？ {{-CF₃|取代基|-Cl/-OCH₃/-NH₂}}"] }
      ] },
      { id: "gen2", title: "二、第二代精神疾病藥物（非典型）：主要阻斷 5-HT₂ receptor", items: [
        { title: "★ 結構總覽", group: "第二代精神疾病藥物：Benzazepine 類衍生物（字尾-apine）", source: "統整（一）p.59", points: [
          "Asenapine 非 piperazine 結構，為 {{pyrrolidine-fused|結構}} 結構"],
          structs: ["assets/medchem/ap-benzazepine-core.png"],
          table: { head: ["藥物", "X", "R", "芳香環", "芳香環取代"], rows: [
            ["Clozapine", "N", "CH₃", "兩苯環", "{{8-Cl|取代基|2-Cl/3-Cl}}"],
            ["Olanzapine", "N", "CH₃", "苯環+{{thiophene|結構}}", "CH₃"],
            ["Loxapine", "O", "CH₃", "兩苯環", "2-Cl"],
            ["Quetiapine", "{{S|結構|N/O}}", "-CH₂CH₂OCH₂CH₂OH", "兩苯環", "-"],
            ["Asenapine", "O", "CH₃", "兩苯環", "3-Cl"]],
            note: "※ Asenapine 之 10-11 雙鍵被飽和，且 10 號 N 被取代成 C（詳見個論）" } },
        { group: "第二代精神疾病藥物：Benzisoxazole/Benzisothiazole 類衍生物", source: "統整（一）p.61", points: [
          "★ 此類藥物為選擇性 monoamine neurotransmitter 拮抗劑，主要阻斷 {{5-HT₂A|受體|D₂}} 受體"],
          structs: ["assets/medchem/ap-benzisoxazole-core.png"],
          table: { head: ["分類", "Benzisoxazole", "Benzisothiazole"], rows: [
            ["X", "CH（Piperidine）", "N（Piperazine）"],
            ["Y", "{{O|結構|S}}", "S"],
            ["Z", "F", "H（苯環無取代）"],
            ["字尾", "-[u]peri[/u]done", "-ra[u]si[/u]done"]] } }
      ] },
      { id: "summary", title: "總整理", items: [
        { source: "統整（一）p.62", points: [
          "※ 鎮靜最強：{{Chlorpromazine|藥名|Haloperidol/Thioridazine}}",
          "※ EPS 錐體外作用最強：{{Haloperidol|藥名|Chlorpromazine/Clozapine}}",
          "※ 最容易造成高泌乳血症：{{Risperidone|藥名|Olanzapine/Ziprasidone}}",
          "※ 最不會增加體重：{{Ziprasidone|藥名|Olanzapine/Clozapine}}"] }
      ] }
    ] },
  ch6: { chapter: 6, title: "肌肉鬆弛劑及抗痙攣藥物",
    sections: [
      { id: "skeletal", title: "骨骼肌鬆弛劑（Skeletal Muscle Relaxants）", items: [
        { title: "※ 補充", group: "Miscellaneous 雜類藥物（肌肉鬆弛劑）", source: "統整（一）p.65", points: [
          "※ Amitriptyline 為一種三環抗憂鬱藥物（{{NSRIs|藥物類別|SSRIs/SNRIs}}）"] }
      ] },
      { id: "nm", title: "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）", items: [
        { title: "※ 補充", group: "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）", source: "統整（一）p.66", points: [
          "※ 肝腎功能不佳之患者可使用：Succinylcholine、{{Atracurium|藥名|Pancuronium/d-Tubocurarine}}、Mivacurium"] },
        { title: "非去極化型的共同結構", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）", source: "統整（一）p.66", points: [
          "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 {{Tetrahydroisoquinoline|結構|5α-Androstane steroid}}★"] }
      ] },
      { id: "antispasm", title: "抗痙攣劑", items: [] }
    ] },
  ch7: { chapter: 7, title: "局部麻醉劑",
    sections: [
      { id: "overview", title: "柒、局部麻醉劑（Local Anesthetics）", items: [
        { title: "局部麻醉劑共同結構", source: "統整（一）p.68", images: ["assets/medchem/la-structure.svg"], points: [
          "1. 親脂基：決定藥物{{疏水性|性質|親水性}}，為羧基或是雜環系統，影響局部麻醉劑穿透神經細胞膜的能力。",
          "> （若苯環接上推電子基，使 C=O 電子密度↑，藥物不容易被 esterase 水解）",
          "2. 親水基：決定藥物{{帶電性|性質|疏水性}}，為二級胺或三級胺系統，與水溶解度有關，也會影響局部麻醉劑穿透神經細胞膜的能力",
          "3. 酯類或醯胺類：決定藥物{{代謝速率|性質|疏水性}}",
          "- (1) 酯類（ester）：由 {{Pseudocholinesterase|酵素}} 代謝，代謝速度快",
          "→ 藥物名稱只有{{一個|數值|兩個}} i",
          "- (2) 醯胺（amide）：由肝臟的 {{CYP450|酵素}} 代謝，代謝速度較慢",
          "→ 藥物名稱中有{{兩個|數值|一個}} i",
          "4. 多數的局部麻醉劑 pKa 值界於 8.0~9.0（{{弱鹼性|性質|弱酸性}}★），於生理 pH 值下呈現[u]{{非離子型|性質|離子型}}[/u]才能穿透細胞膜。"] },
        { title: "局部麻醉劑藥理作用", source: "統整（一）p.68", points: [
          "1. 局部麻醉劑{{抑制 Voltage-gated Na⁺通道|機轉}}★，使去極化的神經無法產生動作電位。",
          "2. 可以抑制神經軸上痛覺衝動傳導。{{直徑較細|性質|直徑較粗}}的神經會先被麻醉，而在相同直徑下，{{有髓鞘|性質|無髓鞘}}的神經會先被麻醉。（比較順序：有髓鞘>直徑細）",
          "3. 可以併用{{血管收縮劑|藥物類別}}（如 Epinephrine）來增加作用時間，但 {{Cocaine|藥名}} 除外★（本身就具有血管收縮的作用）。",
          "4. 若對局部麻醉劑過敏，可改用 {{Diphenhydramine|藥名}}、{{Promethazine|藥名}}"] },
        { title: "EMLA 軟膏（Eutectic Mixture of Local Anesthetic）", source: "統整（一）p.68", points: [
          "1. 含有 2.5% {{Lidocaine|藥名}} 和 2.5% {{Prilocaine|藥名}}",
          "2. 適用於{{表皮|位置|黏膜}}，但不建議用於黏膜 →可能會增加{{變性血紅蛋白血症|疾病}}發生之風險"] }
      ] },
      { id: "ester", title: "酯類結構（Ester）", items: [
        { title: "※ PABA 衍生物", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", points: [
          "含 PABA 結構，苯環對位具有{{胺基|取代基}}，容易{{拮抗磺胺藥|機轉}}★之作用"] },
        { title: "※ PABA 結構", group: "para-amino benzoic acid（PABA）衍生物", source: "統整（一）p.69", structs: ["assets/medchem/la-paba.png"], points: [
          "※ PABA 結構",
          "[i]para[/i]-aminobenzoic acid"] }
      ] },
      { id: "amide", title: "醯胺類結構（Amide）", items: [
        { title: "※ 補充", group: "醯胺類結構（Amide）", source: "統整（一）p.70", points: [
          "※ Amide 類代謝速率：{{Prilocaine|藥名}} > Etidocaine > Lidocaine > Mepivacaine > Ropivacaine > {{Bupivacaine|藥名}}"] }
      ] }
    ] },
  ch8: { chapter: 8, title: "全身麻醉劑",
    sections: [
      { id: "overview", title: "捌、全身麻醉劑（General Anesthetics）", items: [
        { title: "全身麻醉劑的性質：Meyer-Overton Theory", source: "統整（一）p.71",
          table: { head: ["性質", "影響因素", "定義", "說明"],
            rowNames: ["最小肺泡濃度（MAC）", "分布係數 λ (Oil/Gas)", "吸入劑量", "換氣速率", "心輸出量", "分布係數 λ (Blood/Gas)", "治療指數"],
            rows: [
              [{ t: "強度\nPotency", rs: 2 }, "最小肺泡濃度（MAC）\nMinimal Alveolar Concentration", "肺中有多少濃度才達到麻醉\n→ 最低麻醉作用劑量",
                "● MAC ↓、Potency ↑\n（藥效強表示低濃度即可達到麻醉劑量）\n● MAC 可{{互相加成|性質|互相抵消}}"],
              [null, "分布係數\nλ (Oil/Gas)", "代表藥物的{{親脂性|性質|親水性}}\n（類似分配係數的概念）",
                "● 分布係數↑、溶解度↓、{{親脂性|性質|親水性}}↑、Potency↑\n（親脂性越大表示更容易進入細胞作用）\n● 親脂性↑、作用時間 Duration 越長、{{排出速率越慢|性質|排出速率越快}}"],
              [{ t: "誘導速率", rs: 4 }, "吸入劑量", { t: "吸入劑量提高，表示濃度{{增高|性質|降低}}、作用變快，可快速通過誘導期", cs: 2 }, null],
              [null, "換氣速率", { t: "換氣速率提高，使麻醉劑進入體內速率{{變快|性質|變慢}}、作用變快、誘導速率{{加快|性質|變慢}}\n（高脂溶性麻醉劑影響更大）", cs: 2 }, null],
              [null, "心輸出量", { t: "心輸出量增加，雖然會增加麻醉劑運輸到肺部的濃度，但同時會將藥物送到體內其他地方，\n使誘導速率變慢 → 心輸出量{{↑|性質|↓}}、誘導速率{{↓|性質|↑}}", cs: 2 }, null],
              [null, "分布係數\nλ (Blood/Gas)", { t: "定義：藥物在{{血中|性質|肺中}}的溶解度，代表誘導速率 → 血中溶解度{{↑|性質|↓}}、誘導速率{{↓|性質|↑}}\n分布係數/血中溶解度越{{小|性質|大}}、Onset 越{{快|性質|慢}}（溶解度高會使藥物黏在血液中，無法作用）", cs: 2 }, null],
              [{ t: "治療指數\nTherapeutic index" }, { t: "MAC 和 LP₅₀ 之間的距離\n（LP₅₀：半致死濃度，Lethal pressure）", cs: 2 }, null,
                "● 判斷麻醉劑的安全性及安全劑量\n● 治療指數越{{小|性質|大}}、距離越小，表示麻醉劑越{{危險|性質|安全}}"]] } },
        { title: "麻醉劑比較", source: "統整（一）p.71", points: [
          "※ 代謝率：{{Methoxyflurane|藥名}} > Halothane > Sevoflurane > Enflurane > Isoflurane > Desflurane > N₂O",
          "※ λ (Oil/Gas)：{{Methoxyflurane|藥名}} > Halothane > [u]Enflurane[/u] > Isoflurane > Ether > Sevoflurane > {{Desflurane|藥名}} > N₂O →即{{親脂性|性質|親水性}}大小，和 MAC 相反",
          "※ λ (Blood/Gas)：{{Methoxyflurane|藥名}} > Halothane > [u]Isoflurane[/u] > Enflurane > Ether > Sevoflurane > N₂O > {{Desflurane|藥名}} →即[u]{{血中溶解度|性質|親脂性}}[/u]，和誘導速率相反",
          "※ 麻醉效果最佳：{{Methoxyflurane|藥名}}",
          "※ 誘導速率：最快 {{Desflurane|藥名}}、最慢 {{Methoxyflurane|藥名}}",
          "※ 具有肝毒性：{{Halothane|藥名}}",
          "※ 嚴重腎毒性：{{Methoxyflurane|藥名}}",
          "※ 用於門診手術：{{Desflurane|藥名}}",
          "※ 對呼吸道無刺激性：{{Sevoflurane|藥名}}"] }
      ] },
      { id: "inhaled", title: "一、吸入型全身麻醉劑", items: [
        { title: "※ 補充（毒性來源）", group: "吸入型全身麻醉劑：沒有特定的目標受器與之結合", source: "統整（一）p.72", points: [
          "※ [u]肝毒性[/u]是因為代謝產生{{自由基|代謝物|F⁻}}★造成；[u]腎毒性[/u]是因為代謝產生 {{F⁻|代謝物|自由基}} 造成"] },
        { title: "※ 補充（代謝）", group: "吸入型全身麻醉劑：沒有特定的目標受器與之結合", source: "統整（一）p.73", points: [
          "※ 吸入型麻醉劑經 {{CYP2E1|酵素}}★代謝產生 {{acyl halide|代謝物}} 的衍生物",
          "→ 與蛋白質上的親核基反應形成 antigen protein（{{Methoxyflurane|藥名}} 和 {{Sevoflurane|藥名}} 不會產生）"] },
        { title: "鹵烷與烷類之理化性質比較", group: "含鹵素的揮發性麻醉劑：除 Halothane 外皆為醚類", source: "統整（一）p.73", points: [
          "※ 鹵烷與烷類之理化性質比較：",
          "- (1) 均{{不易溶於水|性質|易溶於水}}",
          "- (2) 低碳數的烷類和鹵烷之沸點均低，另外烷類具有{{燃燒性|性質}}及爆炸性",
          "- (3) 同碳數的鹵烷和烷類具有{{不同的偶極矩|性質|相同的偶極矩}}★"] }
      ] },
      { id: "iv", title: "二、IV 注射型全身麻醉劑", items: [
        { title: "※ PCP", group: "Phencyclidine（PCP）類衍生物", source: "統整（一）p.74", structs: ["assets/medchem/ga-pcp.png"], points: [
          "PCP = [u]P[/u]henyl + [u]C[/u]yclohexyl + [u]P[/u]iperidine"] },
        { title: "Barbiturate 類衍生物共通說明", group: "Barbiturate 類衍生物：超短效型", source: "統整（一）p.75", points: [
          "機轉：GABA_A 受體的{{異位致效劑|機轉}}（allosteric agonist），作用於大腦和脊髓的受體，延長 Cl⁻通道開啟的[u]{{持續時間|機轉|頻率}}[/u]",
          "特性：(1) {{Onset 快|性質|Onset 慢}}，常用於外科手術前[u]誘導麻醉[/u]　(2) 作用時間短（Duration）　(3) 具安眠作用但{{無止痛|性質|有止痛}}作用",
          "Barbiturates 均製成{{鈉鹽|物質}}水溶液，以 {{IV|給藥途徑}} 注射為主 → 本身為{{弱酸性|性質|弱鹼性}}",
          "副作用：{{呼吸抑制|副作用}}"] },
        { title: "※ Flumazenil 之結構", group: "Benzodiazepines 類衍生物（BZD）：常用有 Midazolam、Lorazepam、Diazepam", source: "統整（一）p.76", structs: ["assets/medchem/ga-flumazenil.png"], points: [
          "※ Flumazenil 之結構"] }
      ] }
    ] },
  ch9: { chapter: 9, title: "阿片類止痛劑",
    sections: [
      { id: "overview", title: "玖、阿片類止痛劑（Opioid Analgesics）", items: [
        { title: "Opium receptor 之作用", source: "統整（一）p.77",
          table: { head: ["受體分類", "作用", "內生性物質與受體之親和力比較"], rows: [
              ["μ", { t: "{{中樞止痛（主要）|用途}}、呼吸抑制、減緩腸胃蠕動、欣快感", s: true }, "{{endorphin|物質}} > enkephalin > dynorphin"],
              ["δ", "呼吸興奮、血管中樞興奮", "{{enkephalin|物質}} ≫ endorphin = dynorphin"],
              ["κ", "中樞止痛、鎮靜、縮瞳", "{{dynorphin|物質}} ≫ endorphin = enkephalin"]],
            note: "※ 止咳作用與 μ 受體{{無關|性質|有關}}！" } },
        { title: "副作用耐受性與戒斷症狀之比較", source: "統整（一）p.77", points: [
          "2. 副作用耐受性與戒斷症狀之比較",
          "- (1) 較易產生耐受性：嘔吐、止痛、欣快感、止咳",
          "- (2) 中度產生耐受性：心跳變慢",
          "- (3) 不易產生耐受性：{{縮瞳|副作用}}★、{{便秘|副作用}}★",
          "- (4) 戒斷症狀：流淚、{{腹瀉|副作用}}、{{散瞳|副作用}}、{{體溫高熱|副作用}}（與原本 Morphine 之作用相反）"] },
        { title: "Morphine 之使用禁忌", source: "統整（一）p.77", points: [
          "3. Morphine 之使用禁忌",
          "- (1) {{孕婦|疾病}}：若需使用分娩止痛劑，應改用 {{Meperidine|藥名}}",
          "- (2) 氣喘：Morphine 會促進肥大細胞釋放{{組織胺|物質}}",
          "- (3) 肝功能不全患者：影響 Morphine 之代謝",
          "- (4) 腎功能不全患者：造成代謝物 {{Morphine-6-glucuronide|代謝物}} 堆積，產生鎮靜與呼吸抑制作用",
          "- (5) 腦損傷患者：Morphine 會抑制呼吸，導致 CO₂ 滯留體內導致{{腦血管擴張|副作用}}，增加 CSF 壓力",
          "- (6) 良性前列腺肥大、膽絞痛患者"] },
        { title: "Morphine 的結構與 SAR", source: "統整（一）p.78", structs: ["assets/medchem/op-morphine-numbered.png", "assets/medchem/op-morphine-plain.png"], points: [
          "※ Morphine 的結構與 SAR",
          "1. 強效μ-receptor agonist 之必要結構：{{苯環（A 環）|結構}}★、苯環接出去隔 3C 的氮",
          "→ 藥效基團：{{4-Phenylpiperidine|結構}}",
          "2. 屬於兩性化合物：{{C₃ 的酚性醇|結構}}（酸）、{{3 級胺|結構}}（鹼）",
          "3. 結構中共有 5 個 chiral center：5R、6S、9R、13S、{{14R|結構|14S}}★ →結構也要記",
          "4. 天然 Morphine 的光學組態為{{左旋 (-)-isomer|性質|右旋 (+)-isomer}}★",
          "5. 結構基團改變與活性之變化（見下表）"] },
        { title: "結構基團改變與活性之變化", source: "統整（一）p.78",
          table: { head: ["結構基團改變", "止痛活性", "結構基團改變", "止痛活性"],
            rowNames: ["導入 3-CH₃CO-ester／導入 7,8-dihydro", "導入 6-CH₃CO-ester／3-OH 以 3-H 取代", "導入 14β-OH／3-OH 以 3-OCH₃ 取代", "N-CH₃ 以 N-CH₂CH₂-phenyl 替代／6-OH 以 6-H 取代", "N-CH₃ 氧化成 N⁺→O⁻／6-OH 以 6-keto 取代（單純 6-keto）"],
            rows: [
              ["導入 3-CH₃CO-ester", "{{↓|性質|↑}}", { t: "導入 7,8-dihydro★", s: true }, "{{↑|性質|↓}}"],
              ["導入 6-CH₃CO-ester", "{{↑|性質|↓}}", "3-OH 以 3-H 取代", "{{↓|性質|↑}}"],
              [{ t: "導入 14β-OH★", s: true }, "{{↑|性質|↓}}", "3-OH 以 3-OCH₃ 取代", "{{↓|性質|↑}}"],
              ["N-CH₃ 以 N-CH₂CH₂-phenyl 替代★", "{{↑|性質|↓}}", "6-OH 以 6-H 取代", "{{↑|性質|↓}}"],
              ["N-CH₃ 氧化成 N⁺→O⁻", { t: "{{消失|性質|增加}}★", s: true }, "6-OH 以 6-keto 取代（單純 6-keto）", "{{↓|性質|↑}}"]],
            cols: ["結構基團改變", "止痛活性（左欄）", "結構基團改變", "止痛活性（右欄）"],
            note: "※ 單純 6-keto 活性↓；7,8-dihydro-6-keto（如 Hydromorphone）活性↑（約 {{10 倍|數值}}）\n※ 若將 Morphine 結構中的三級胺進行 {{N₁₇-methylation|代謝}}★，形成四級銨化合物，可得到類似箭毒鹼 {{Tubocurarine|藥名}} 的活性，而不具有中樞神經作用。" } },
        { title: "內生性阿片類胜肽", source: "統整（一）p.78", structs: ["assets/medchem/op-morphine.png"], points: [
          "※ 內生性阿片類胜肽：人體可自行於下視丘合成，結合在阿片類受體，具有止痛作用",
          "1. 腦啡肽（Enkephalins）：為兩個各含有 {{5 個|數值|3 個/4 個}}★胺基酸的肽鏈 →序列重要！",
          "- (1) [u]Met[/u]-enkephalin★：H – Tyr – Gly – Gly – Phe – [u]Met[/u] – OH",
          "- (2) [u]Leu[/u]-enkephalin★：H – Tyr – Gly – Gly – Phe – [u]Leu[/u] – OH",
          "- (3) 腦啡肽中的 {{Tyrosine|物質}}★結構，同樣存在於 Morphine 的結構當中",
          "2. 內啡肽（Endorphin）",
          "3. 若以非天然的 D-Amino acids 取代天然的 L-Amino acid，或以 {{D-Alanine|物質}} 取代第二位的 Glycine，則會使此內胜肽具{{抗酶|性質}}的能力（可口服）。"] },
        { title: "親和力大小", source: "統整（一）p.78",
          table: { head: ["受體", "親和力大小"], rows: [
              ["μ", "{{endorphin|物質}} > enkephalin > dynorphin"],
              ["δ", "{{enkephalin|物質}} ≫ endorphin = dynorphin"],
              ["κ", "{{dynorphin|物質}} ≫ endorphin = enkephalin"]],
            note: "※ 親和力大小" } },
        { title: "Morphine 之代謝", source: "統整（一）p.79", points: [
          "※ Morphine 之代謝",
          "1. {{N-demethylation|代謝}}：由 CYP3A4 去甲基化後，形成{{活性較低|性質|活性更強}}的 Normorphine",
          "2. {{6-glucuronidation|代謝}}：經 6-glucuronidation 後，形成[u]{{活性更強|性質|沒有活性}}[/u]的 Morphine-6-glucuronide（M6G）",
          "3. {{3-glucuronidation|代謝}}：經 3-glucuronidation 後，形成[u]{{沒有活性|性質|活性更強}}[/u]的 Morphine-3-glucuronide（M3G）"] },
        { title: "Codeine 之代謝", source: "統整（一）p.79", points: [
          "※ Codeine 之代謝",
          "1. CYP2D6 進行 O-demethylation，形成{{有活性|性質|無活性}}的 Morphine",
          "2. CYP3A4 進行 N-demethylation，形成{{無活性|性質|有活性}}的 Norcodeine",
          "3. 最後都代謝為弱活性 Normorphine"] },
        { title: "Methadone 之代謝", source: "統整（一）p.79", points: [
          "※ Methadone 之代謝",
          "1. 代謝產物大多為{{活性代謝物|性質|無活性代謝物}}，只有 EDDP、EDMP 為{{無活性|性質|有活性}}代謝物",
          "2. 經 N-dealkylation 形成有活性的 Normethadone，再產生 Dinormethadone，最後{{環化|代謝}}形成具 pyrrolidine 結構的 EDDP、EDMP（無活性★）",
          "3. 經 C₃-reduction 代謝成有活性的 Methadol，再進行 N-dealkylation 形成活性代謝物 Dinormethadol"] },
        { title: "Morphine、Codeine 代謝圖", source: "統整（一）p.79", images: ["assets/medchem/op-fig-morphine-metab.png"] },
        { title: "Methadone 代謝圖", source: "統整（一）p.79", images: ["assets/medchem/op-fig-methadone-metab.png"] },
        { title: "Morphine 的衍生物分類（修飾與保留的環）", source: "統整（一）p.80", images: ["assets/medchem/op-fig-overview.png"],
          table: { head: ["修飾 Morphine（左）", "衍生物", "保留的環（右）", "骨架類別", "衍生物"],
            rowNames: ["修飾 N 原子", "修飾 3-OH 基團", "修飾 6-OH 基團", "修飾 14β-OH 基團", "保留 AB 環", "保留 AC 環"],
            rows: [
              ["修飾 N 原子", "Naloxone、Naltrexone、Nalbuphine、Butorphanol、Pentazocine、Buprenorphine、Dezocine", "保留 {{ABCN|結構}} 環", "Morphinan 類", "(-)-Levorphanol、(-)-Butorphanol"],
              ["修飾 3-OH 基團", "{{Codeine|藥名}}、Heroin", "保留 {{ABN|結構}} 環", "Benzomorphan 類", "Pentazocine、Phenazocine"],
              ["修飾 6-OH 基團", "Hydromorphone、Hydrocodone", "保留 {{AN|結構}} 環", "4-Phenylpiperidine 類", "Meperidine、Diphenoxylate、Loperamide、Alphaprodine"],
              ["修飾 14β-OH 基團", "Oxymorphone、Oxycodone", "", "", ""],
              ["保留 AB 環", "Aminotetralin 類：Dezocine", "保留 AN 環\n且中間以 N 相接", "4-Anilidopiperidine 類", "Fentanyl、Sufentanil、Alfentanil、Remifentanil"],
              ["保留 AC 環", "4-Phenylcyclohexane 類：Tramadol", "保留 A 環", "Phenylpropylamine 類", "Methadone、Levomethadyl、Propoxyphene、Tapentadol"]] } }
      ] },
      { id: "morphine", title: "一、Morphine 及其衍生物", items: [
        { title: "阿片成癮與中毒的治療", source: "統整（一）p.81", points: [
          "※ 阿片{{成癮|疾病}}治療：{{Methadone|藥名}}、{{Buprenorphine|藥名}}",
          "※ {{急性中毒|疾病}}治療：{{Naloxone|藥名}}",
          "※ 緩解戒斷症狀：{{Clonidine|藥名}}"] },
        { title: "6α-OH 的影響", group: "修飾 6α-Hydroxyl group", source: "統整（一）p.83", points: [
          "6α-OH 會導致{{過敏|副作用}}相關副作用（Opioid antagonist 無法反轉），修飾成 {{keto|取代基}} 或 desoxy group 可改善"] },
        { title: "14β-OH 的影響", group: "6-keto-14β-Hydroxyl 衍生物", source: "統整（一）p.83", points: [
          "{{14β-Hydroxyl|取代基}} 可加強μ-agonist 活性（止痛活性↑）★，同時降低鎮咳活性"] }
      ] },
      { id: "ring", title: "二、Morphine 環狀結構修飾藥物", items: [] },
      { id: "oripavine", title: "三、東罌粟鹼（Oripavines）及其衍生物", items: [] },
      { id: "antitussive", title: "四、阿片結構衍生之鎮咳藥物", items: [] },
      { id: "antidiarrheal", title: "五、阿片結構衍生之止瀉藥物", items: [
        { title: "止瀉藥物說明", group: "阿片結構衍生之止瀉藥物", source: "統整（一）p.90", points: [
          "4-Phenylpiperidines（保留 AN 環）的結構進行修飾後，發現具有{{止瀉|用途}}的作用",
          "修飾 Meperidine 的結構，可限制其穿過 {{BBB|位置}}，但不影響在腸胃道的作用"] }
      ] }
    ] },
  ch10: { chapter: 10, title: "中樞神經興奮劑、迷幻劑與濫用藥物",
    sections: [
      { id: "stimulant", title: "中樞神經興奮劑", items: [] },
      { id: "hallucinogen", title: "迷幻劑（Hallucinogen）", items: [
        { title: "※ 與「食慾」相關之藥物", group: "迷幻劑（Hallucinogen）", source: "統整（一）p.93", points: [
          "※ 與「食慾」相關之藥物",
          "促進食慾：{{THC|藥名}}、{{Dronabinol|藥名}}",
          "抑制食慾：Rimonabant、MDMA、{{Amphetamine|藥名}}、Dexfenfluramine（抑制 5-HT 再回收）、Sibutramine（抑制 5-HT/NE 再回收）",
          "※ Dexfenfluramine 和 Sibutramine 可{{抑制 5-HT 之再回收|機轉}}，造成食慾下降"] },
        { title: "※ VTA", group: "迷幻劑（Hallucinogen）", source: "統整（一）p.93", points: [
          "※ {{VTA|名詞}}（Ventral Tegmental Area）被認為和濫用藥物之成癮有關"] }
      ] }
    ] },
  ch11: {
    "chapter": 11,
    "title": "前列腺及 Leukotriene 相關藥物",
    "sections": [
      {
        "id": "overview",
        "title": "壹拾壹、前列腺及其相關藥物",
        "items": [
          {
            "title": "Arachidonic acid 的代謝路徑（COX）",
            "source": "統整（一）p.94",
            "images": [
              "assets/medchem/pg-fig-cox.png"
            ],
            "points": [
              "Arachidonic acid（20C）經 {{COX|酵素}}（Prostaglandin Endoperoxide G/H Synthetase，PGHS）形成 PGG₂",
              "PGG₂ 經 {{Peroxidase|酵素}}（還原反應）形成 PGH₂",
              "PGH₂ 經 Prostacyclin Synthetase 形成 {{PGI₂|名詞|TXA₂}}",
              "PGH₂ 經 Thromboxane Synthetase 形成 {{TxA₂|名詞|PGI₂}}",
              "PGH₂ 經 PG endoperoxide E isomerase 形成 {{PGE₂|名詞|PGD₂}}",
              "PGH₂ 經 Glutathione-S-transferase 形成 {{PGD₂|名詞|PGE₂}}",
              "PGH₂ 經 PG endoperoxide reductase 形成 {{PGF₂α|名詞|PGE₂}}"
            ]
          },
          {
            "title": "Leukotriene 的合成（5-LO enzyme）",
            "source": "統整（一）p.94",
            "images": [
              "assets/medchem/lt-fig-5lo.png"
            ],
            "points": [
              "Arachidonic acid 經 {{5-Lipoxygenase|酵素}} 形成 5-HPETE，再經 LTA₄-Synthase 形成 LTA₄（5-LO enzyme）",
              "5-HPETE 經 Peroxidase 形成 5-HETE",
              "LTA₄ 含有 {{Hydroperoxide|結構}}★結構",
              "LTA₄ 經 {{LTA₄-Hydroxylase|酵素}} 形成 LTB₄",
              "LTA₄ 經 LTC₄-Synthase（Glutathione-S-transferase）形成 LTC₄，再經 γ-Glutamyl-transferase 形成 LTD₄，再經 Peptidase 形成 LTE₄"
            ]
          },
          {
            "title": "※ Prostaglandin 及其衍生物",
            "source": "統整（一）p.95",
            "table": {
              "rowNames": [
                "共同前驅物",
                "合成酵素",
                "衍生物",
                "C9",
                "C11",
                "血管",
                "氣管",
                "血小板",
                "子宮",
                "臨床用途"
              ],
              "cols": [
                "",
                "",
                "PGD₂",
                "PGD₂",
                "PGE₂",
                "PGE₂",
                "PGF₂α",
                "PGF₂α",
                "PGI₂",
                "TXA₂"
              ],
              "rows": [
                [
                  {
                    "t": "共同前驅物",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  {
                    "t": "PGG₂ 經過 [i]Peroxidase[/i] 的{{還原|機轉|氧化}}★反應，形成 PGH₂",
                    "cs": 8
                  },
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  {
                    "t": "合成酵素",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  {
                    "t": "[i]{{Glutathione-S-transferase|酵素}}[/i]\n⇩",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "[i]{{PG endoperoxide E-isomerase|酵素}}[/i]\n⇩",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "[i]{{PG endoperoxide reductase|酵素}}[/i]★\n⇩",
                    "cs": 2,
                    "s": true
                  },
                  null,
                  "[i]{{Prostacyclin synthetase|酵素}}[/i]\n⇩",
                  "[i]{{Thromboxane synthetase|酵素}}[/i]\n⇩"
                ],
                [
                  {
                    "t": "衍生物",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  {
                    "t": "PGD₂",
                    "cs": 2,
                    "band": true
                  },
                  null,
                  {
                    "t": "PGE₂",
                    "cs": 2,
                    "band": true
                  },
                  null,
                  {
                    "t": "PGF₂α",
                    "cs": 2,
                    "band": true
                  },
                  null,
                  {
                    "t": "PGI₂",
                    "band": true
                  },
                  {
                    "t": "TXA₂★",
                    "band": true
                  }
                ],
                [
                  {
                    "t": "C9",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  "{{α-OH|取代基|C=O}}",
                  {
                    "img": "assets/medchem/pg-pgd2.png",
                    "t": "PGD₂",
                    "rs": 2
                  },
                  "{{C=O|取代基|α-OH}}",
                  {
                    "img": "assets/medchem/pg-pge2.png",
                    "t": "PGE₂",
                    "rs": 2
                  },
                  "{{α-OH|取代基|C=O}}",
                  {
                    "img": "assets/medchem/pg-pgf2a.png",
                    "t": "PGF₂α",
                    "rs": 2
                  },
                  {
                    "img": "assets/medchem/pg-pgi2.png",
                    "t": "PGI₂",
                    "rs": 2
                  },
                  {
                    "img": "assets/medchem/pg-txa2.png",
                    "t": "TXA₂",
                    "rs": 2
                  }
                ],
                [
                  {
                    "t": "C11",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  "{{C=O|取代基|α-OH}}",
                  null,
                  "{{α-OH|取代基|C=O}}",
                  null,
                  "{{α-OH|取代基|C=O}}",
                  null,
                  null,
                  null
                ],
                [
                  {
                    "t": "作用",
                    "rs": 4,
                    "b": true
                  },
                  {
                    "t": "血管",
                    "b": true
                  },
                  {
                    "t": "",
                    "cs": 2,
                    "rs": 4
                  },
                  null,
                  {
                    "t": "{{血管擴張|性質|血管收縮}}",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{血管收縮|性質|血管擴張}}",
                    "cs": 2
                  },
                  null,
                  "{{血管擴張|性質|血管收縮}}",
                  "{{血管收縮|性質|血管擴張}}"
                ],
                [
                  null,
                  {
                    "t": "氣管",
                    "b": true
                  },
                  null,
                  null,
                  {
                    "t": "{{氣管擴張|性質|氣管收縮}}",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{氣管收縮|性質|氣管擴張}}",
                    "cs": 2
                  },
                  null,
                  "{{氣管擴張|性質|氣管收縮}}",
                  "{{氣管收縮|性質|氣管擴張}}"
                ],
                [
                  null,
                  {
                    "t": "血小板",
                    "b": true
                  },
                  null,
                  null,
                  {
                    "t": "",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{抑制凝集|性質|促進凝集}}★",
                    "s": true
                  },
                  "{{促進凝集|性質|抑制凝集}}"
                ],
                [
                  null,
                  {
                    "t": "子宮",
                    "b": true
                  },
                  null,
                  null,
                  {
                    "t": "{{收縮|性質|舒張}}（懷孕）\n{{舒張|性質|收縮}}（未懷孕）",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{收縮|性質|舒張}}",
                    "cs": 2
                  },
                  null,
                  "",
                  ""
                ],
                [
                  {
                    "t": "臨床用途",
                    "cs": 2,
                    "b": true
                  },
                  null,
                  {
                    "t": "",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{墮胎|用途}}、{{引產劑|用途}}",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "{{青光眼|疾病}}→增加{{前房水|物質}}外流",
                    "cs": 2
                  },
                  null,
                  "維持{{動脈導管|器官}}開放",
                  ""
                ]
              ]
            }
          },
          {
            "title": "※ Leukotriene 之合成路徑",
            "source": "統整（一）p.95",
            "points": [
              "※ Leukotriene 之合成路徑（注意 {{LTB₄|名詞|LTC₄}} 的合成路徑與其他三者不一樣！）",
              "Arachidonic acid →（{{5-Lipoxygenase|酵素}}）→ LTA₄ →（{{Glutathione-S-transferase|酵素}}）→ LTC₄ →（γ-GT、γ-GL）→ LTD₄ →（{{Dipeptidase|酵素}}）→ LTE₄",
              "LTA₄ →（{{LTA₄ hydroxylase|酵素}}）→ LTB₄"
            ]
          }
        ]
      },
      {
        "id": "pg",
        "title": "一、Prostaglandin 衍生物",
        "items": []
      },
      {
        "id": "lt",
        "title": "二、Leukotriene modifiers：可用於治療慢性氣喘",
        "items": [
          {
            "title": "Leukotriene 受體拮抗劑的作用位置",
            "group": "Leukotriene receptor antagonist",
            "source": "統整（一）p.97",
            "images": [
              "assets/medchem/lt-fig-pathway.png"
            ],
            "points": [
              "Zileuton 抑制 {{5-Lipoxygenase|酵素}}（5-lipoxygenase inhibitor）",
              "Montelukast、Zafirlukast、Pranlukast 拮抗 {{CysLT₁|受體}}、CysLT₂（半胱胺醯 Leukotriene 受體）",
              "LTB₄ 作用於 BLT₁、BLT₂"
            ]
          }
        ]
      }
    ]
  },
  ch12: {
    "chapter": 12,
    "title": "非類固醇消炎止痛藥（NSAIDs）",
    "sections": [
      {
        "id": "sal",
        "title": "水楊酸衍生物（Salicylic acid derivatives）",
        "items": [
          {
            "title": "※ 水楊酸衍生物之代謝★",
            "group": "水楊酸衍生物（Salicylic acid derivatives）",
            "source": "統整（一）p.98",
            "images": [
              "assets/medchem/ns-fig-salicylate-metab.png"
            ],
            "points": [
              "※ 水楊酸衍生物之代謝★",
              "皆經由 {{esterase|酵素}} 水解後形成 Salicylic acid，再進行後續代謝",
              "水楊酸主要代謝產物有以下三種（右圖框起來的部分）",
              "- -COOH 接上 {{glycine|物質}}",
              "- -COOH 接上 {{glucuronide|物質}}",
              "- -OH 接上 {{glucuronide|物質}}"
            ]
          }
        ]
      },
      {
        "id": "arylacetic",
        "title": "芳香基乙酸類（Arylacetic acid derivatives）",
        "items": []
      },
      {
        "id": "fenamate",
        "title": "鄰胺基苯甲酸類（N-arylanthranilic acid）：屬於 Fenamates 類",
        "items": []
      },
      {
        "id": "arylpropionic",
        "title": "芳香基丙酸類（Arylpropionic acid derivatives）",
        "items": [
          {
            "title": "※ Ketorolac",
            "group": "芳香基丙酸類（Arylpropionic acid derivatives）",
            "source": "統整（一）p.101",
            "structs": [
              "assets/medchem/ns-ketorolac.png"
            ],
            "points": [
              "※ {{Ketorolac|藥名}}★也屬於 Arylpropionic acid 類 NSAID"
            ]
          }
        ]
      },
      {
        "id": "oxicam",
        "title": "Oxicams 類",
        "items": [
          {
            "title": "Oxicams 類共同結構",
            "group": "Oxicams 類",
            "source": "統整（一）p.102",
            "points": [
              "Oxicams 類共同結構：{{4-hydroxy-1,2-benzothiazine carboxamides|結構}}★。結構中{{無羧基|性質|有羧基}}，進入胃中才會形成酸"
            ]
          }
        ]
      },
      {
        "id": "antipyretic",
        "title": "解熱鎮痛藥",
        "items": [
          {
            "title": "※ p-aminosalicylic acid 之 Phase II 代謝",
            "group": "解熱鎮痛藥",
            "source": "統整（一）p.102",
            "structs": [
              "assets/medchem/ns-paminosalicylic.png"
            ],
            "points": [
              "※ [i]p[/i]-aminosalicylic acid 之 Phase II 代謝",
              "Sulfate conjugation：Ar-OH、R-OH",
              "Glucuronide conjugation：Ar-OH、R-OH、{{R-COOH|結構}}、{{R-NH₂|結構}}"
            ]
          }
        ]
      },
      {
        "id": "coxib",
        "title": "選擇性 COX-2 抑制劑（字尾-coxib）",
        "items": [
          {
            "title": "※ COX-2 之選擇性比較",
            "group": "選擇性 COX-2 抑制劑（字尾-coxib）",
            "source": "統整（一）p.103",
            "points": [
              "※ COX-2 之選擇性比較：{{Rofecoxib|藥名}} > Etoricoxib > Meloxicam > {{Celecoxib|藥名}}"
            ]
          }
        ]
      }
    ]
  },
  ch13: {
    "chapter": 13,
    "title": "痛風藥物與疾病修飾抗風濕藥物",
    "sections": [
      {
        "id": "gout",
        "title": "一、痛風藥物",
        "items": []
      },
      {
        "id": "dmard",
        "title": "二、疾病修飾抗風濕藥（Disease-modifying Antirheumatic Drugs, DMARDs）",
        "items": []
      },
      {
        "id": "bio",
        "title": "三、用於類風濕性關節炎之生物製劑",
        "items": [
          {
            "title": "藥物比較",
            "group": "Calcineurin Inhibitor",
            "source": "統整（一）p.106",
            "table": {
              "head": [
                "藥物比較",
                "結合 Cyclophilin",
                "抑制 Calcineurin",
                "結合 FKBP",
                "結合 mTOR",
                "IL-2 抑制",
                "副作用"
              ],
              "rows": [
                [
                  "Cyclosporine",
                  "✔",
                  "✔",
                  "",
                  "",
                  "{{間接|性質|直接}}",
                  "{{腎毒性|副作用|骨髓抑制}}"
                ],
                [
                  "Tacrolimus",
                  "",
                  "✔",
                  "✔",
                  "",
                  "{{間接|性質|直接}}",
                  "{{腎毒性|副作用|骨髓抑制}}"
                ],
                [
                  "Sirolimus",
                  "",
                  "",
                  "✔",
                  "✔",
                  "{{直接|性質|間接}}",
                  "{{骨髓抑制|副作用|腎毒性}}"
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  ch14: {
    "chapter": 14,
    "title": "抗組織胺藥物",
    "sections": [
      {
        "id": "h1a",
        "title": "壹拾肆、抗組織胺藥物（Anti-histamine drugs）：一、第一代 H₁-blocker",
        "items": [
          {
            "title": "Histamine 之生合成",
            "source": "統整（一）p.107",
            "images": [
              "assets/medchem/ah-fig-histamine.png"
            ],
            "points": [
              "Histamine 之生合成：由 L-Histidine 經{{脫羧|機轉}}★反應，形成 Histamine（Histidine Decarboxylase）",
              "Histamine 存在於{{肥大細胞|器官}}、Basophils、Enterochromaffin-like cell",
              "{{結合態|性質|游離態}}的 Histamine 不具有生物活性"
            ]
          },
          {
            "title": "第一代 H₁-抗組織胺藥物之結構通式",
            "source": "統整（一）p.107",
            "images": [
              "assets/medchem/ah-general.png"
            ],
            "points": [
              "第一代 H₁-抗組織胺藥物之結構通式（結構分類重要！）",
              "代謝：{{N-demethylation|代謝}} → Deamination → Glucuronidation"
            ],
            "table": {
              "rowNames": [
                "X=N",
                "X=O",
                "X=C",
                "其他：Piperazine 類",
                "其他：TCA 類"
              ],
              "cols": [
                "X",
                "結構分類",
                "藥物"
              ],
              "rows": [
                [
                  "X=N",
                  "乙二胺衍生物（Ethylenediamine）",
                  "Phenbenzamine、{{Tripelennamine|藥名}}★、Antazoline"
                ],
                [
                  "X=O",
                  "乙醇胺醚衍生物（Aminoalkyl / Ethanolamine ethers）",
                  "Diphenhydramine、{{Doxylamine|藥名}}★、Carbinoxamine、Clemastine"
                ],
                [
                  "X=C",
                  "丙胺衍生物（Propylamines）",
                  "Pheniramine、Triprolidine、Phenindamine、Pyrrobutamine、Chlorpheniramine、Brompheniramine"
                ],
                [
                  {
                    "t": "其他",
                    "rs": 2
                  },
                  "Piperazine 類",
                  "{{Meclizine|藥名}}★、Buclizine、Hydroxyzine"
                ],
                [
                  null,
                  "TCA 類",
                  "Promethazine、Cyproheptadine、Doxepine"
                ]
              ]
            }
          },
          {
            "title": "乙二胺類的共同結構",
            "group": "乙二胺類（Ethylenediamine）",
            "source": "統整（一）p.107",
            "points": [
              "皆含有{{乙二胺|結構}}結構（例外：{{Antazoline|藥名}}）與芳香環取代"
            ]
          },
          {
            "title": "丙胺類的立體結構",
            "group": "丙胺類（Propylamines）",
            "source": "統整（一）p.108",
            "points": [
              "{{S form|結構|R form}} 最有效，作用時間長且 CNS 副作用減少"
            ]
          }
        ]
      },
      {
        "id": "h1b",
        "title": "二、第二代 H₁-blocker",
        "items": []
      },
      {
        "id": "mast",
        "title": "三、肥大細胞脫粒抑制劑",
        "items": []
      },
      {
        "id": "h2",
        "title": "四、H₂-blocker",
        "items": []
      }
    ]
  },
  ch15: {
    "chapter": 15,
    "title": "血清素及相關藥物",
    "sections": [
      {
        "id": "overview",
        "title": "壹拾伍、血清素相關藥物",
        "items": [
          {
            "title": "血清素受體分類",
            "source": "統整（一）p.114",
            "table": {
              "rowNames": [
                "5-HT₁ agonist",
                "5-HT₂ antagonist",
                "5-HT₃ antagonist",
                "5-HT₄ agonist",
                "SSRIs"
              ],
              "cols": [
                "受體種類",
                "訊息傳遞",
                "受體",
                "藥物"
              ],
              "rows": [
                [
                  "5-HT₁ agonist",
                  "{{Gi|受體}} 抑制型\nG 蛋白受體\ncAMP ↓",
                  "5-HT₁A\n5-HT₁B、5-HT₁D",
                  "Buspirone\nAlmotriptan、Sumatriptan"
                ],
                [
                  "5-HT₂ antagonist",
                  "{{Gq|受體}} 刺激型\nG 蛋白受體\nIP₃、DAG ↑",
                  "5-HT₂",
                  "Methysergide、Ergotamine、Risperidone、Clozapine、Trazodone、Cyproheptadine"
                ],
                [
                  "5-HT₃ antagonist",
                  "Na⁺/K⁺\n{{離子通道|標的}}",
                  "5-HT₃",
                  "Ondansetron、Alosetron"
                ],
                [
                  "5-HT₄ agonist",
                  "{{Gs|受體}} 刺激型\nG 蛋白受體\ncAMP ↑",
                  "5-HT₄",
                  "Tegaserod、Metoclopramide、Cisapride"
                ],
                [
                  {
                    "t": "Selective Serotonin Reuptake Inhibitors（SSRIs）",
                    "cs": 3
                  },
                  null,
                  null,
                  "Fluoxetine、Sertraline"
                ]
              ]
            }
          }
        ]
      },
      {
        "id": "s2",
        "title": "5-HT₂ antagonist",
        "items": [
          {
            "title": "※ Ergotamine 與 Nitroprusside",
            "group": "5-HT₂ antagonist",
            "source": "統整（一）p.114",
            "points": [
              "※ Ergotamine 使用時可併用 {{Caffeine|藥名}} 加強{{吸收|機轉}}",
              "※ {{Nitroprusside|藥名}} 可治療 Ergot alkaloids 引起的周邊血管痙攣"
            ]
          }
        ]
      }
    ]
  },
  ch16: { chapter: 16, title: "利尿劑",
    sections: [
      { id: "overview", title: "總論（作用位置）", items: [{ unit: "diu-location" }] },
      { id: "osmotic", title: "一、滲透壓型利尿劑", items: [{ unit: "osmotic-intro" }] },
      { id: "cai", title: "二、碳酸酐酶抑制劑", items: [{ unit: "cai-intro" }] },
      { id: "thiazide", title: "三、Thiazide 利尿劑", items: [{ unit: "thiazide-sar" }] },
      { id: "loop", title: "四、環利尿劑", items: [{ unit: "loop-intro" }] },
      { id: "mra", title: "五、保鉀型（MRA）", items: [{ unit: "mra-intro" }] },
      { id: "ksparing", title: "六、保鉀型（Na⁺通道）", items: [{ unit: "ksparing-intro" }] }
    ] },
  ch17: { chapter: 17, title: "心絞痛藥物",
    sections: [
      { id: "pde", title: "一、PDE 抑制劑", items: [] },
      { id: "nitrate", title: "二、硝酸酯類", items: [{ unit: "nitrate-intro" }] }
    ] },
  ch18: { chapter: 18, title: "心衰竭藥物",
    sections: [
      { id: "cg", title: "一、強心配醣體", items: [{ unit: "cg-intro" }, { unit: "cg-compare" }, { unit: "digoxin-interactions" }] },
      { id: "pde3", title: "二、PDE-3 抑制劑", items: [] },
      { id: "bagonist", title: "三、β 受體作用劑", items: [] },
      { id: "others", title: "四、其他／PDE-5 抑制劑", items: [{ unit: "hf-other" }, { unit: "pde5-intro" }] }
    ] },
  ch19: { chapter: 19, title: "抗凝血及其血液相關藥物",
    sections: [
      { id: "factor", title: "一、抗凝血因子藥物", items: [{ unit: "coag-overview" }, { unit: "heparin-intro" }, { unit: "lmwh-intro" }, { unit: "fondaparinux-xa" }] },
      { id: "antiplatelet", title: "二、抗血小板藥物", items: [{ unit: "antiplatelet-overview" }] },
      { id: "thrombolytic", title: "三、溶血栓藥物", items: [{ unit: "thrombolytic-intro" }] },
      { id: "coagulant", title: "四、凝血劑", items: [{ unit: "coagulants-other" }] },
      { id: "anemia", title: "五、血球缺乏與貧血", items: [{ unit: "hematopoietic" }, { unit: "anemia-intro" }] }
    ] }
};
/* 整座島的總覽／總論／總整理：不放成格子，直接放進告示牌（題目在告示牌上答） */
/* 小分類裡的通論／簡介（type: topic、有 group）：也不放成格子，改放進那一類的小白標（題目在小白標上答）。
   只搬知識樹有引用的；這一類如果只剩它一格（例如 SSRIs），就留著當格子，不然地圖上這一類會整個不見。 */
(function () {
  const SIGN = ["總覽", "總論", "總整理"], moved = new Map();
  const refd = new Set(Object.values(PI.KNOWLEDGE).flatMap(K => (K.sections || []).flatMap(sec => (sec.items || []).map(it => it.unit).filter(Boolean))));
  const cellsIn = g => PI.UNITS.filter(x => x.type !== "topic" && (x.group === g || (PI.GROUP_PARENTS || {})[x.group] === g)).length;   // 子分類（第三層小標）的格子也算
  PI.UNITS = PI.UNITS.filter(u => {
    if (u.type !== "topic") return true;
    if (SIGN.includes(u.group) || (u.group && refd.has(u.id) && cellsIn(u.group) > 0)) { moved.set(u.id, u); return false; }
    return true; });
  Object.values(PI.KNOWLEDGE).forEach(K => (K.sections || []).forEach(sec => {
    sec.items = (sec.items || []).map(it => { const u = it.unit && moved.get(it.unit); if (!u) return it;
      return { title: u.name, source: u.source, ...(SIGN.includes(u.group) ? {} : { group: u.group }),
        ...(u.img ? { structs: [u.img, ...(u.imgMore || [])] } : {}),
        points: [...(u.use || []), ...(u.bold || [])] }; });
  }));
})();
PI.GLOSSARY = {};

/* 和生藥頁一樣：電腦版知識面板開大一點 */
document.documentElement.classList.add("is-amulet");
