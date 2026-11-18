/* PHARMA ISLAND：藥化科目
   這個檔案只在 medchem.html 載入，會把藥理的章節、單元、知識樹換成藥物化學的。
   格式和生藥頁一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）。
   章節照「藥物化學國考統整」的目錄：
     統整（一）中樞神經系統：壹～陸 → 第 1～6 章、柒～捌 → 第 7～8 章、玖～拾 → 第 9～10 章、拾壹～拾參 → 第 11～13 章、拾肆～拾伍 → 第 14～15 章（中樞神經島）
     統整（二）化學治療藥物：壹～參 → 第 1～3 章（id 20～22，畫面上的章號用 no 重編；之後的單元陸續加入）（化學治療群島）
     統整（三）心臟血管系統：柒、捌、玖、壹拾壹 → 第 16～19 章（畫面上的章號用 no 重編成 1～4）（心血管島）
   內容來自教授給的期中考複習講義（藥物化學國考統整），只擷取：分類、結構圖、粗體字。
   目前已加入第 1 章到講義 p.14；之後的章節還是預留格。
   結構圖是從講義裁下來的原圖，放在 assets/medchem/（id 和單元 id 一樣）。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-medchem-v1";   // 進度和其他科目分開存

PI.CATEGORIES = [
  { id: "cns", name: "統整（一）中樞神經", color: "#8E7CB8", tint: "#E6E0F2" },
  { id: "chemo", name: "統整（二）化學治療藥物", color: "#4F9490", tint: "#D9ECEA" },
  { id: "cv", name: "統整（三）自主神經、心血管、內分泌", color: "#C77C7C", tint: "#F4DEDE" }
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
  "其他（第一代 H₁-blockers）": "第一代 H₁-blockers（抗組織胺藥物）",
  "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）": "廣效型 Penicillins：α碳上的官能基可幫助穿透 G(-)的細胞壁",
  "Carboxy-penicillins：α碳接有苯環與羧基-COOH，可抗綠膿桿菌": "廣效型 Penicillins：α碳上的官能基可幫助穿透 G(-)的細胞壁",
  "Acylureido-penicillins：Ampicillin 的α-NH₂接有 Urea 類似物，可抗綠膿桿菌": "廣效型 Penicillins：α碳上的官能基可幫助穿透 G(-)的細胞壁",
  "Imidazole 類藥物": "Azoles 類（抗黴菌）",
  "Triazole 類藥物": "Azoles 類（抗黴菌）",
  "Allylamine 類藥物": "Allylamine 類及 Tolnaftate",
  "non-Allylamine 類藥物": "Allylamine 類及 Tolnaftate",
  "ALK Inhibitors": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
  "BCR-ABL Kinase Inhibitors": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
  "EGFR Kinase Inhibitors": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
  "EGFR & HER2 Inhibitors": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
  "VEGFR Kinase Inhibitors": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
  "Proteasome Inhibitor": "其他標靶藥物",
  "mTOR Inhibitor": "其他標靶藥物",
  "免疫調節劑（Immunomodulators）": "其他標靶藥物",
  "B 細胞調節劑": "其他標靶藥物",
  "Catecholamine 類結構（α₁ 致效劑）": "選擇性 α₁ 致效劑",
  "Imidazoline 類結構：皆含有 phenylethylamine 的骨架": "選擇性 α₁ 致效劑",
  "選擇性 α₁A 拮抗劑": "選擇性 α₁ 拮抗劑",
  "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  "去極化性阻斷劑（非競爭型）": "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
  "1,4-Dihydropyridines（1,4-DHP）": "Ca²⁺通道阻斷劑（Ca²⁺-Channel Blockers）",
  "Phenylalkylamines（PAA）": "Ca²⁺通道阻斷劑（Ca²⁺-Channel Blockers）",
  "Benzothiazepines（BTZ）": "Ca²⁺通道阻斷劑（Ca²⁺-Channel Blockers）",
  "Alkylamines（烷基胺類）": "Ca²⁺通道阻斷劑（Ca²⁺-Channel Blockers）",
  "含硫醇抑制劑（Sulfhydryl-containing Inhibitors）": "血管收縮素轉換酶抑制劑（ACEi）",
  "含次磷酸根抑制劑（Phosphinate-containing Inhibitors）": "血管收縮素轉換酶抑制劑（ACEi）",
  "含雙羧酸抑制劑（Dicarboxylate-containing Inhibitors）": "血管收縮素轉換酶抑制劑（ACEi）",
  "非前驅藥 ARB": "血管收縮素Ⅱ受體阻斷劑（ARB）",
  "前驅藥 ARB": "血管收縮素Ⅱ受體阻斷劑（ARB）",
  "第一代 Sulfonylurea": "Sulfonylurea 類藥物",
  "第二代 Sulfonylurea": "Sulfonylurea 類藥物",
  "第三代 Sulfonylurea": "Sulfonylurea 類藥物",
  "6 號位無取代基：Dexamethasone 類衍生物": "16 號 CH₃ 為「α」構型（含 9α-fluoro 取代基）",
  "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one": "16 號 CH₃ 為「α」構型（含 9α-fluoro 取代基）",
  "Steroid 結構之不可逆抑制劑": "Aromatase Inhibitors（芳香酶抑制劑）",
  "Steroid 結構之可逆抑制劑": "Aromatase Inhibitors（芳香酶抑制劑）",
  "雜環結構之抑制劑": "Aromatase Inhibitors（芳香酶抑制劑）",
  "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服": "人工合成雄性激素",
  "C₁₉-norandrogens（C₁₀ 上沒有接甲基）": "人工合成雄性激素",
  "其他人工合成雄性激素": "人工合成雄性激素",
  "類固醇類似物（Steroidal antiandrogens）": "Antiandrogens：與 5α-dihydrotestosterone（5α-DHT）競爭結合雄激素受體",
  "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來": "Antiandrogens：與 5α-dihydrotestosterone（5α-DHT）競爭結合雄激素受體"
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
  "Selective Serotonin Reuptake Inhibitors（SSRIs）": "SSRIs",
  "磺胺類藥物": "Sulfonamides",
  "非磺胺類輔佐藥物": "Adjuncts",
  "第一代 Fluoroquinolones：沒有 F 原子": "Gen 1",
  "第二代 Fluoroquinolones": "Gen 2",
  "第三代 Fluoroquinolones": "Gen 3",
  "第四代 Fluoroquinolones": "Gen 4",
  "Nitrofuran 類藥物": "Nitrofuran",
  "其他類藥物（尿道抗菌劑）": "Urinary Others",
  "Natural Penicillins": "Natural",
  "★抗酵素 Penicillins": "Penicillinase-resistant",
  "廣效型 Penicillins：α碳上的官能基可幫助穿透 G(-)的細胞壁": "Broad-spectrum",
  "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）": "Amino-Pen",
  "Carboxy-penicillins：α碳接有苯環與羧基-COOH，可抗綠膿桿菌": "Carboxy-Pen",
  "Acylureido-penicillins：Ampicillin 的α-NH₂接有 Urea 類似物，可抗綠膿桿菌": "Acylureido-Pen",
  "β-lactamase Inhibitors": "BLIs",
  "第一代 Cephalosporins": "Ceph 1st",
  "第二代 Cephalosporins": "Ceph 2nd",
  "第三代 Cephalosporins": "Ceph 3rd",
  "第四代 Cephalosporins": "Ceph 4th",
  "第五代 Cephalosporins": "Ceph 5th",
  "第一代 Carbapenems：C₄無甲基保護，易被腎臟 Dehydropeptidase-1★（DHP-1）水解": "Carbapenem 1st",
  "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）": "Carbapenem 2nd",
  "單內醯胺類（Monobactams）": "Monobactams",
  "其他細胞壁合成抑制劑": "Other CW Inhibitors",
  "五碳糖（胺醣類）": "Pentose",
  "六碳糖（胺醣類）": "Hexose",
  "Tetracyclines：短效型": "Short-acting",
  "Tetracyclines：中效型": "Intermediate",
  "Tetracyclines：長效型": "Long-acting",
  "Tetracyclines：廣效型": "Broad Tetracycline",
  "Macrolides（大環內酯類）": "Macrolides",
  "Ketolides": "Ketolides",
  "Lincosamide 類": "Lincosamides",
  "其他蛋白質抑制劑": "Other Protein Inhib.",
  "Streptogramin 類": "Streptogramins",
  "Polyenes 類（抗黴菌）": "Polyenes",
  "Azoles 類（抗黴菌）": "Azoles",
  "Imidazole 類藥物": "Imidazoles",
  "Triazole 類藥物": "Triazoles",
  "Allylamine 類及 Tolnaftate": "Allylamines & Tolnaftate",
  "Allylamine 類藥物": "Allylamines",
  "non-Allylamine 類藥物": "non-Allylamine",
  "Morpholine 類（非 Squalene epoxidase 抑制劑）": "Morpholine",
  "Echinocandins 類": "Echinocandins",
  "影響真菌代謝之藥物": "Fungal Metabolism",
  "影響真菌 DNA 或 RNA 之合成藥物": "Fungal DNA/RNA",
  "第一線用藥（抗結核）": "1st-line TB",
  "第二線用藥（抗結核）": "2nd-line TB",
  "抗麻風用藥": "Antileprosy",
  "金雞納生物鹼（Cinchona Alkaloids）": "Cinchona",
  "Polycyclics": "Polycyclics",
  "4-Aminoquinolines": "4-Aminoquinolines",
  "8-Aminoquinolines": "8-Aminoquinolines",
  "混合療法（Fixed Combination）": "Fixed Combination",
  "新型藥物（抗瘧疾）": "New Antimalarials",
  "抗原蟲藥物": "Antiprotozoal",
  "驅蠕蟲藥物": "Anthelmintics",
  "酚性化合物（Phenolic compounds）": "Phenolic",
  "鹵素化合物（Halogen compounds）": "Halogen",
  "氧化性化合物（Oxidative compounds）": "Oxidative",
  "界面活性劑": "Surfactants",
  "製劑用防腐劑": "Preservatives",
  "M₂ 抑制劑（M₂ inhibitors）：阻斷病毒脫殼釋放 RNA": "M2 Inhibitors",
  "神經胺酶抑制劑（Neuraminidase inhibitors）": "Neuraminidase Inhib.",
  "融合抑制劑（Fusion Inhibitors）：治療 HIV 病毒": "Fusion Inhibitors",
  "非環狀核苷類似物（Acyclic Nucleoside Analogs）": "Acyclic Nucleosides",
  "傳統核苷類似物（Conventional Nucleoside Analogs）": "Conventional Nucleosides",
  "非核苷類似物（Non-Nucleoside Analogs）：抗病毒": "Non-Nucleoside (Antiviral)",
  "影響核酸轉譯藥物（Agents affect the Ribosome）": "Ribosome Agents",
  "核苷類反轉錄酶抑制劑（NRTIs）": "NRTIs",
  "非核苷類反轉錄酶抑制劑（NNRTIs）": "NNRTIs",
  "HIV 嵌合酶抑制劑（HIV Integrase Inhibitors）": "Integrase Inhibitors",
  "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）": "Protease Inhibitors",
  "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine": "Nitrogen Mustards",
  "亞硝基脲類（Nitrosoureas）": "Nitrosoureas",
  "DNA 甲基化劑（DNA Methylators）": "DNA Methylators",
  "有機鉑化合物（Organoplatinum complexes）": "Organoplatinum",
  "未歸類烷化劑（Miscellaneous Alkylating Agents）": "Misc. Alkylators",
  "葉酸拮抗劑（Folic acid Antagonists）": "Folic Antagonists",
  "嘧啶拮抗劑（Pyrimidine Antagonists）": "Pyrimidine Antag.",
  "嘌呤拮抗劑（Purine Antagonists）": "Purine Antag.",
  "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）": "DNA Pol Inhibitors",
  "DNA 甲基轉移酶抑制劑（DNA methyltransferase Inhibitors）": "DNMT Inhibitors",
  "抗癌輔助劑（Anticancer Adjuvants）": "Adjuvants",
  "Anthracyclines": "Anthracyclines",
  "Anthracenedione 類": "Anthracenedione",
  "未歸類抗腫瘤抗生素（Miscellaneous Antitumor Antibiotics）": "Misc. Antibiotics",
  "長春花生物鹼（Vinca Alkaloids）": "Vinca Alkaloids",
  "紫杉類藥物（Taxanes）：促進微管聚合": "Taxanes",
  "巨環內酯類（Macrolides）（抗癌）": "Macrolides (Epothilones)",
  "Nitrogen mustards 類（抗癌）": "Nitrogen Mustards 2",
  "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 Topoisomerase II": "Podophyllotoxins",
  "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 Topoisomerase I": "Camptothecins",
  "酵素類藥物（Enzymes）": "Enzymes",
  "其他抗癌藥物": "Other Anticancer",
  "單株抗體（Monoclonal Antibodies）": "Monoclonal Antibodies",
  "免疫療法（Immune Checkpoint Inhibitors）": "Checkpoint Inhibitors",
  "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質": "Tyrosine Kinase Inhibitors",
  "其他標靶藥物": "Other Targeted",
  "ALK Inhibitors": "ALK Inhibitors",
  "BCR-ABL Kinase Inhibitors": "BCR-ABL",
  "EGFR Kinase Inhibitors": "EGFR Inhibitors",
  "EGFR & HER2 Inhibitors": "EGFR & HER2",
  "VEGFR Kinase Inhibitors": "VEGFR",
  "Proteasome Inhibitor": "Proteasome",
  "mTOR Inhibitor": "mTOR",
  "免疫調節劑（Immunomodulators）": "Immunomodulators",
  "B 細胞調節劑": "B-cell Modulator",
  "影響傳訊機制的藥物（自主神經）": "Transmission Drugs",
  "非選擇性致效劑：內生性兒茶酚胺（Endogenous catecholamines）": "Endogenous Catechols",
  "選擇性 α₁ 致效劑": "Selective α1",
  "Catecholamine 類結構（α₁ 致效劑）": "Catecholamine-type",
  "Imidazoline 類結構：皆含有 phenylethylamine 的骨架": "Imidazolines",
  "選擇性 α₂ 致效劑": "Selective α2",
  "非選擇性 β 致效劑": "Non-selective β",
  "混和型致效劑": "Mixed",
  "選擇性 β₂ 致效劑（短效）": "Short β2",
  "選擇性 β₂ 致效劑（長效）": "Long β2",
  "間接作用劑（擬交感神經）": "Indirect Agents",
  "非選擇性 α 拮抗劑": "Non-selective α",
  "選擇性 α₁ 拮抗劑": "Selective α1",
  "選擇性 α₁A 拮抗劑": "Selective α1A",
  "選擇性 α₂ 拮抗劑": "Selective α2",
  "非選擇性 β 拮抗劑": "Non-selective β",
  "選擇性 β₁ 拮抗劑": "Selective β1",
  "混合作用型拮抗劑（作用在 α₁、β 受體）": "Mixed α/β",
  "天然化合物（膽鹼性致效劑）": "Natural Agonists",
  "合成化合物（Acetylcholine 及其衍生物）": "Synthetic ACh Analogs",
  "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）": "Quaternary AChEi",
  "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）": "Tertiary AChEi",
  "不可逆型 AChE 抑制劑": "Irreversible AChEi",
  "有機磷農藥（Parathion / Malathion）": "Organophosphates",
  "解毒劑：Pralidoxime（2-PAM）": "Antidote (2-PAM)",
  "天然茄科生物鹼（Solanaceae Alkaloids）": "Solanaceae Alkaloids",
  "胺醇類膽鹼拮抗劑": "Amino Alcohols",
  "胺醚類（Aminoether）膽鹼拮抗劑": "Aminoethers",
  "其他類膽鹼拮抗劑": "Other Antimuscarinics",
  "抗 Nn 受體藥物（神經節阻斷劑）": "Ganglionic Blockers",
  "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline": "Non-depolarizing",
  "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）": "Steroidal",
  "去極化性阻斷劑（非競爭型）": "Depolarizing",
  "抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）": "Nm Blockers",
  "Ca²⁺通道阻斷劑（Ca²⁺-Channel Blockers）": "Ca Channel Blockers",
  "1,4-Dihydropyridines（1,4-DHP）": "1,4-DHP",
  "Phenylalkylamines（PAA）": "Phenylalkylamines",
  "Benzothiazepines（BTZ）": "Benzothiazepines",
  "Alkylamines（烷基胺類）": "Alkylamines",
  "血管收縮素轉換酶抑制劑（ACEi）": "ACE Inhibitors",
  "含硫醇抑制劑（Sulfhydryl-containing Inhibitors）": "Sulfhydryl-type",
  "含次磷酸根抑制劑（Phosphinate-containing Inhibitors）": "Phosphinate-type",
  "含雙羧酸抑制劑（Dicarboxylate-containing Inhibitors）": "Dicarboxylate-type",
  "血管收縮素Ⅱ受體阻斷劑（ARB）": "ARBs",
  "非前驅藥 ARB": "Active ARBs",
  "前驅藥 ARB": "Prodrug ARBs",
  "腎素抑制劑（Renin inhibitors）": "Renin Inhibitors",
  "K⁺通道活化劑：造成血管擴張": "K+ Channel Openers",
  "α-receptor Agents": "α Agents",
  "α、β-receptor antagonists": "α/β Blockers",
  "其他類（降血壓血管擴張劑）": "Other Vasodilators",
  "Class IA（抗心律不整）": "Class IA",
  "Class IB（抗心律不整）": "Class IB",
  "Class IC（抗心律不整）": "Class IC",
  "Class II（抗心律不整）": "Class II",
  "Class III（抗心律不整）": "Class III",
  "Class IV（抗心律不整）": "Class IV",
  "Other Antiarrhythmic Agents": "Other Agents",
  "膽酸吸附劑（Bile-acid Sequestrants）": "Bile-acid Sequestrants",
  "HMG-CoA Reductase Inhibitors（Statins 類藥物）": "Statins",
  "Fibrates 類藥物（降 TG 最佳藥物）": "Fibrates",
  "Cholesterol Absorption Inhibitor": "Absorption Inhibitor",
  "Niacins": "Niacins",
  "胰島素類似物（Insulin analogs）": "Insulin Analogs",
  "Sulfonylurea 類藥物": "Sulfonylureas",
  "第一代 Sulfonylurea": "1st Generation",
  "第二代 Sulfonylurea": "2nd Generation",
  "第三代 Sulfonylurea": "3rd Generation",
  "Meglitinides 類藥物": "Meglitinides",
  "Biguanides 類藥物": "Biguanides",
  "Thiazolidinediones（TZD）類藥物": "TZDs",
  "α-glucosidase Inhibitors": "α-Glucosidase Inhibitors",
  "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）": "DPP-4 Inhibitors",
  "SGLT-2 inhibitors": "SGLT-2 Inhibitors",
  "GLP-1 受體致效劑（GLP-1 receptor agonists）": "GLP-1 Agonists",
  "其他類降血糖藥物": "Other Agents",
  "Hydrocortisone 類衍生物": "Hydrocortisone-type",
  "Prednisone 類衍生物": "Prednisone-type",
  "16 號 CH₃ 為「α」構型（含 9α-fluoro 取代基）": "16α-CH3 Series",
  "6 號位無取代基：Dexamethasone 類衍生物": "Dexamethasone-type",
  "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one": "Flu…one Series",
  "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物": "Betamethasone-type",
  "Ketal：6、9 號位皆沒有取代基": "Ketal (no 6/9)",
  "Ketal：6 號位具有 α-fluoro 取代基": "Ketal (6α-F)",
  "Ketal：9 號位具有 α-fluoro 取代基": "Ketal (9α-F)",
  "Human Estrogens（人體雌激素及其衍生物）": "Human Estrogens",
  "Synthetic Estrogens（合成雌激素）": "Synthetic Estrogens",
  "Xenoestrogens（環境雌激素）": "Xenoestrogens",
  "Triphenylethylene 類：Selective Estrogen Receptor Modulators（SERMs）": "SERMs",
  "Aromatase Inhibitors（芳香酶抑制劑）": "Aromatase Inhibitors",
  "Steroid 結構之不可逆抑制劑": "Irreversible Steroidal",
  "Steroid 結構之可逆抑制劑": "Reversible Steroidal",
  "雜環結構之抑制劑": "Heterocyclic",
  "Pregnanes 類": "Pregnanes",
  "Androgen 類（黃體激素作用劑）": "Androgen-type Progestins",
  "黃體激素拮抗劑（Progesterone Antagonists）": "Progesterone Antagonists",
  "天然雄性激素：Testosterone 及其衍生物": "Natural Androgens",
  "人工合成雄性激素": "Synthetic Androgens",
  "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服": "17α-Alkyl",
  "C₁₉-norandrogens（C₁₀ 上沒有接甲基）": "19-Nor",
  "其他人工合成雄性激素": "Other Androgens",
  "促性腺激素抑制劑（Gonadotropin inhibitors）": "Gonadotropin Inhibitors",
  "Antiandrogens：與 5α-dihydrotestosterone（5α-DHT）競爭結合雄激素受體": "Antiandrogens",
  "類固醇類似物（Steroidal antiandrogens）": "Steroidal",
  "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來": "Non-steroidal",
  "5α-reductase inhibitors": "5α-Reductase Inhibitors",
  "CYP17A1 inhibitors（抑制 17α-hydroxylase 和 17,20-lyase）": "CYP17A1 Inhibitors",
  "ADH 作用劑（字尾 -pressin）": "-pressin Agonists",
  "ADH 拮抗劑（字尾 -vaptan）": "-vaptan Antagonists",
  "Somatostatin（體抑素）": "Somatostatin",
  "GnRH super agonist（GnRH 的合成類似物）": "GnRH Agonists",
  "GnRH receptor antagonist": "GnRH Antagonists",
  "Growing hormone（GH／生長激素）": "Growth Hormone",
  "Prolactin（泌乳激素）：高泌乳素血症治療藥物": "Prolactin",
  "Oxytocin（催產素）": "Oxytocin",
  "Human chorionic gonadotropin（HCG／人類絨毛生殖腺激素）": "HCG"
};

/* 藥化的欄位：照講義表格的欄位（藥物｜結構｜特性｜藥理及臨床應用） */
PI.UNIT_FIELDS = [["use", "分類／用途"], ["desc", "說明"], ["route", "途徑"], ["res", "耐酸／耐酶"], ["feat", "特性"], ["pharm", "藥理及臨床應用"], ["metab", "藥物代謝"], ["clin", "藥理及臨床用途"], ["bold", "粗體重點"], ["act", "作用"], ["ind", "適應症"], ["rmk", "備註"]];   // 第 1、2 章照講義欄位（說明／特性／藥理及臨床應用），第 3 章是特性／藥物代謝，第 4 章是特性／藥理及臨床用途，第 5、6 章是特性／藥理及臨床應用，其他章還是粗體重點
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
  { id: 20, name: "磺胺類藥物", no: 1, cat: "chemo", estimate: 19, unitType: "drug", note: "統整（二）壹，p.3–7。" },
  { id: 21, name: "喹諾酮類與尿道抗菌劑", no: 2, cat: "chemo", estimate: 15, unitType: "drug", note: "統整（二）貳，p.8–12。" },
  { id: 22, name: "抗生素：細胞壁合成抑制劑", no: 3, cat: "chemo", estimate: 53, unitType: "drug", note: "統整（二）參，p.13–28。" },
  { id: 23, name: "抗生素：蛋白質合成抑制劑", no: 4, cat: "chemo", estimate: 29, unitType: "drug", note: "統整（二）肆，p.29–40。" },
  { id: 24, name: "抗黴菌藥物", no: 5, cat: "chemo", estimate: 31, unitType: "drug", note: "統整（二）伍，p.41–46。" },
  { id: 25, name: "抗結核、抗麻風、抗瘧疾與驅蟲藥物", short: "結核、瘧疾與驅蟲", no: 6, cat: "chemo", estimate: 46, unitType: "drug", note: "統整（二）陸，p.47–54。" },
  { id: 26, name: "抗癌藥物", no: 7, cat: "chemo", estimate: 107, unitType: "drug", note: "統整（二）柒，p.55–79。" },
  { id: 27, name: "抗病毒藥物", no: 8, cat: "chemo", estimate: 51, unitType: "drug", note: "統整（二）捌，p.80–93。" },
  { id: 28, name: "外用抗感染劑與防腐劑", no: 9, cat: "chemo", estimate: 18, unitType: "drug", note: "統整（二）玖，p.94–96。" },
  { id: 29, name: "自主神經系統簡介", no: 1, cat: "cv", estimate: 3, unitType: "drug", note: "統整（三）壹，p.3–7。" },
  { id: 30, name: "擬交感神經作用藥物", short: "擬交感神經藥物", no: 2, cat: "cv", estimate: 24, unitType: "drug", note: "統整（三）貳，p.8–11。" },
  { id: 31, name: "擬交感神經拮抗藥物", short: "擬交感神經拮抗藥物", no: 3, cat: "cv", estimate: 27, unitType: "drug", note: "統整（三）參，p.12–17。" },
  { id: 32, name: "膽鹼性作用藥物", no: 4, cat: "cv", estimate: 23, unitType: "drug", note: "統整（三）肆，p.18–22。" },
  { id: 33, name: "膽鹼性拮抗藥物", no: 5, cat: "cv", estimate: 28, unitType: "drug", note: "統整（三）伍，p.23–27。" },
  { id: 34, name: "高血壓藥物", no: 6, cat: "cv", estimate: 32, unitType: "drug", note: "統整（三）陸 p.28–38：Ca²⁺通道阻斷劑、ACEi、ARB、腎素抑制劑、血管擴張劑" },
  { id: 35, name: "抗心律不整藥物", no: 10, cat: "cv", estimate: 25, unitType: "drug", note: "統整（三）壹拾 p.54–57：Class IA～IV 與其他抗心律不整藥" },
  { id: 36, name: "降血脂藥物", no: 12, cat: "cv", estimate: 17, unitType: "drug", note: "統整（三）壹拾貳 p.70–75：膽酸吸附劑、Statins、Fibrates、膽固醇吸收抑制劑、Niacin" },
  { id: 37, name: "胰島素與口服降血糖藥物", short: "降血糖藥物", no: 13, cat: "cv", estimate: 45, unitType: "drug", note: "統整（三）壹拾參 p.76–86：胰島素、Sulfonylurea、Biguanides、TZD、DPP-4、SGLT-2 等降血糖藥" },
  { id: 38, name: "腎上腺皮質激素", no: 14, cat: "cv", estimate: 24, unitType: "drug", note: "統整（三）壹拾肆 p.87–92：Hydrocortisone／Prednisone／9α-fluoro／Ketal 類皮質類固醇" },
  { id: 39, name: "性荷爾蒙－雌激素相關藥物", short: "雌激素", no: 15, cat: "cv", estimate: 38, unitType: "drug", note: "統整（三）壹拾伍 p.93–99：雌激素作用劑與拮抗劑、芳香酶抑制劑、黃體激素作用劑與拮抗劑" },
  { id: 40, name: "性荷爾蒙－雄激素相關藥物", short: "雄激素", no: 16, cat: "cv", estimate: 25, unitType: "drug", note: "統整（三）壹拾陸 p.100–103：天然與人工合成雄激素、促性腺激素抑制劑、抗雄激素、雄激素合成抑制劑" },
  { id: 41, name: "腦下垂體激素", no: 17, cat: "cv", estimate: 22, unitType: "drug", note: "統整（三）壹拾柒 p.104–106：ADH、Somatostatin、GnRH、GH、Prolactin、Oxytocin、HCG" },
  { id: 16, name: "利尿劑", no: 7, cat: "cv", estimate: 20, unitType: "drug", note: "統整（三）柒，p.39–46。" },
  { id: 17, name: "心絞痛藥物", no: 8, cat: "cv", estimate: 8, unitType: "drug", note: "統整（三）捌，p.47–48。" },
  { id: 18, name: "心衰竭藥物", no: 9, cat: "cv", estimate: 10, unitType: "drug", note: "統整（三）玖，p.49–53。" },
  { id: 19, name: "抗凝血與血液相關藥物", no: 11, cat: "cv", estimate: 25, unitType: "drug", note: "統整（三）壹拾壹，p.58–69。" }
];

/* 章節的 id 全部不重複（資料用），但統整（一）和統整（三）是兩本，顯示的章號用 no 另外從 1 重新編（沒有 no 的章節就用 id） */
/* 兩座島：統整（一）的六章拼成一座、統整（三）的四章拼成一座 */
/* 小白標先修：同一類的格子要先答完小白標（地圖上的小分類名牌）的題目才能挑戰（js/app.js 的 groupGate） */
PI.GROUP_GATE = true;

/* 群島的總名稱（地圖上黑色大字，標在每片群島上方）：key 對應 LANDMASSES 的 cluster */
PI.CLUSTERS = { cns: "中樞神經系統、\n止痛劑與自泌素", chemo: "化學治療藥物", cv: "自主神經系統、心臟血管系統、\n內分泌系統與其他" };
/* 環狀群島：名稱放正中央，島依章節順序（順時針、從正上方開始）圍成一圈 */
PI.CLUSTER_RING = { cns: true, chemo: true, cv: true };
PI.CLUSTER_DIR = { chemo: -50, cv: 135 };   // 第二片環狀群島放在第一片的哪個方向（度，0 是右邊、-90 是上面）
PI.MAP.clusterGap = 22;   // 兩片群島之間隔幾格海（拉遠一點）
PI.MAP.ringGap = 0.5;     // 環狀群島裡，島與島之間隔幾格海（小一點比較緊密）

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
  { id: "chemo20", name: "磺胺島",     chapters: [20], cluster: "chemo", angle: -25,
    palette: { ground: "#A9D0C4", light: "#C3E0D6", cliff: "#7FAA9D" } },
  { id: "chemo21", name: "喹諾酮島",   chapters: [21], cluster: "chemo", angle: 20,
    palette: { ground: "#B2D6B8", light: "#CBE5CF", cliff: "#86AE8D" } },
  { id: "chemo22", name: "細胞壁島",   chapters: [22], cluster: "chemo", angle: 200,
    palette: { ground: "#A4CFD2", light: "#BEE0E2", cliff: "#7AA9AC" } },
  { id: "chemo23", name: "蛋白質島",   chapters: [23], cluster: "chemo", angle: 110,
    palette: { ground: "#9FCBC6", light: "#BADBD7", cliff: "#76A5A0" } },
  { id: "chemo24", name: "黴菌島",     chapters: [24], cluster: "chemo", angle: 160,
    palette: { ground: "#B5D4B0", light: "#CDE3C9", cliff: "#8BAE86" } },
  { id: "chemo25", name: "抗瘧島",     chapters: [25], cluster: "chemo", angle: 250,
    palette: { ground: "#A8D2BB", light: "#C2E1D0", cliff: "#7EAC96" } },
  { id: "chemo26", name: "抗癌島",     chapters: [26], cluster: "chemo", angle: 20,
    palette: { ground: "#A5CFC1", light: "#BFDFD4", cliff: "#7BA999" } },
  { id: "chemo27", name: "抗病毒島",   chapters: [27], cluster: "chemo", angle: 345,
    palette: { ground: "#A2CDC9", light: "#BDDDD9", cliff: "#78A6A2" } },
  { id: "chemo28", name: "外用島",     chapters: [28], cluster: "chemo", angle: 300,
    palette: { ground: "#B0D3C0", light: "#C9E2D6", cliff: "#85AC98" } },
  { id: "cv29", name: "自主神經島", chapters: [29], cluster: "cv", angle: 0,
    palette: { ground: "#E3B5C8", light: "#EDCADA", cliff: "#BE8CA3" } },
  { id: "cv30", name: "擬交感島", chapters: [30], cluster: "cv", angle: 0,
    palette: { ground: "#E6B0B8", light: "#F0C7CD", cliff: "#C2878F" } },
  { id: "cv31", name: "拮抗島", chapters: [31], cluster: "cv", angle: 0,
    palette: { ground: "#DDB3C3", light: "#E8C9D6", cliff: "#B98AA0" } },
  { id: "cv32", name: "膽鹼島", chapters: [32], cluster: "cv", angle: 0,
    palette: { ground: "#E8BCB5", light: "#F1D0CB", cliff: "#C4948D" } },
  { id: "cv33", name: "抗膽鹼島", chapters: [33], cluster: "cv", angle: 0,
    palette: { ground: "#E0B2C0", light: "#ECC8D3", cliff: "#BA899A" } },
  { id: "cv34", name: "降壓島", chapters: [34], cluster: "cv", angle: 0,
    palette: { ground: "#C9B6D8", light: "#DACBE5", cliff: "#A593B8" } },
  { id: "cv35", name: "心律島", chapters: [35], cluster: "cv", angle: 0,
    palette: { ground: "#BFB6DC", light: "#D3CCEA", cliff: "#9A92BE" } },
  { id: "cv36", name: "血脂島", chapters: [36], cluster: "cv", angle: 0,
    palette: { ground: "#B6D2D8", light: "#CCE2E7", cliff: "#8FAAB0" } },
  { id: "cv37", name: "血糖島", chapters: [37], cluster: "cv", angle: 0,
    palette: { ground: "#D8C4A0", light: "#E7D8BC", cliff: "#B39F7B" } },
  { id: "cv38", name: "皮質島", chapters: [38], cluster: "cv", angle: 0,
    palette: { ground: "#E3B8A0", light: "#EFCFBB", cliff: "#BC9079" } },
  { id: "cv39", name: "雌激素島", chapters: [39], cluster: "cv", angle: 0,
    palette: { ground: "#EBB3C8", light: "#F4CBDA", cliff: "#C48DA2" } },
  { id: "cv40", name: "雄激素島", chapters: [40], cluster: "cv", angle: 0,
    palette: { ground: "#A9C4DA", light: "#C3D6E6", cliff: "#8199B0" } },
  { id: "cv41", name: "腦垂島", chapters: [41], cluster: "cv", angle: 0,
    palette: { ground: "#C6B8E0", light: "#D9CEEE", cliff: "#9F93B8" } },
  { id: "cv16",  name: "利尿島",     chapters: [16], cluster: "cv", angle: 75,
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
  feat: ["含有 pyridine、{{pyrrolidine|結構}} 雜環★"] },
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
  ind: ["{{急性|性質|預防}}治療偏頭痛"],
  rmk: ["禁用 {{Ergot|藥物類別}}、MAOI",
    "會造成{{血清素症候群|副作用}}",
    "冠狀動脈患者禁用"] },
{ id: "se-sumatriptan", chapter: 15, name: "Sumatriptan", type: "drug", group: "5-HT₁ agonist", source: "統整（一）p.114–115", img: "assets/medchem/se-sumatriptan.png",
  desc: ["具有 {{Sulfonamide|結構}}、Indole 結構"],
  act: ["5-HT₁B & 5-HT₁D {{agonist|機轉|antagonist}}",
    "使{{腦部血管收縮|機轉}}"],
  ind: ["{{急性|性質|預防}}治療偏頭痛"],
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
    "5-HT₁B/₁D {{agonist|機轉|antagonist}}",
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

/* ===== 第 20 章（統整（二）壹 磺胺類藥物 p.3–7）===== */
/* 化學治療藥物是統整（二），畫面上的章號重編為 1～；p.3 的總說明（作用機轉、藥物動力學、副作用、基本結構、溶血性貧血藥物整理）放告示牌，
   一、磺胺類藥物（p.4–6）與二、非磺胺類輔佐藥物（p.7）沒有黑底灰底，章節標題就是分類。表格欄位是特性／藥理及臨床應用。
   行首「- 」＝子項目、「> 」＝接續行 */

{ id: "sa-sulfamethizole", chapter: 20, name: "Sulfamethizole", type: "drug", group: "磺胺類藥物", source: "統整（二）p.4", img: "assets/medchem/sa-sulfamethizole.png",
  feat: ["（取代基為圈起來的部分）",
    "取代基為 {{Thiazole|結構}} 雜環",
    "Thiazole 之 {{5 號位|位置}}有甲基取代"],
  pharm: ["{{Urobiotic|藥名}}：與 Oxytetracycline 和 Phenazopyridine 併用"] },
{ id: "sa-sulfathiazole", chapter: 20, name: "Sulfathiazole", type: "drug", group: "磺胺類藥物", source: "統整（二）p.4", img: "assets/medchem/sa-sulfathiazole.png",
  feat: ["結構類似 Sulfamethizole，但雜環上少一個 {{N|取代基}}，且無甲基取代"],
  pharm: ["組成 {{Triple Sulfa|藥物類別}}，治療陰道嗜血桿菌",
    "可由 {{Succinylsulfathiazole|藥名}} 分解得到"] },
{ id: "sa-sulfisoxazole", chapter: 20, name: "Sulfisoxazole", type: "drug", group: "磺胺類藥物", source: "統整（二）p.4", img: "assets/medchem/sa-sulfisoxazole.png",
  feat: ["取代基為 {{Isoxazole|結構}}",
    "Isoxazole 有{{兩個|數值|一個}}甲基取代"],
  pharm: ["與 {{Diolamine|藥名}} 併用，作為局部抗菌劑",
    "與 Phenazopyridine 併用，可作為 Azo-Gantrisin"] },
{ id: "sa-sulfamethoxazole", chapter: 20, name: "Sulfamethoxazole", type: "drug", group: "磺胺類藥物", source: "統整（二）p.4", img: "assets/medchem/sa-sulfamethoxazole.png",
  feat: ["結構比 Sulfisoxazole 少了一個甲基",
    "取代基為 Isoxazole",
    "Isoxazole 有{{一個|數值|兩個}}甲基取代"],
  pharm: ["與 {{Trimethoprim|藥名}}★併用（Baktar®），可治療{{尿道感染|疾病}}"] },
{ id: "sa-sulfapyridine", chapter: 20, name: "Sulfapyridine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.4", img: "assets/medchem/sa-sulfapyridine.png",
  feat: ["取代基為 {{Pyridine|結構}}"],
  pharm: ["可由 {{Sulfasalazine|藥名}} 分解得到"] },
{ id: "sa-sulfadiazine", chapter: 20, name: "Sulfadiazine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.5", img: "assets/medchem/sa-sulfadiazine.png",
  feat: ["取代基為 {{Pyrimidine|結構}}★",
    "Pyrimidine 無甲基取代"],
  pharm: ["{{Trisulfapyrimidines|藥物類別}} 組成藥物",
    "與銀離子形成鹽類可治療{{燒燙傷|疾病}}及預防{{綠膿桿菌|名詞}}（Silver sulfadiazine）"] },
{ id: "sa-sulfamerazine", chapter: 20, name: "Sulfamerazine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.5", img: "assets/medchem/sa-sulfamerazine.png",
  feat: ["取代基為 Pyrimidine",
    "Pyrimidine 有{{一個|數值|兩個}}甲基取代"],
  pharm: ["Trisulfapyrimidines 組成藥物"] },
{ id: "sa-sulfamethazine", chapter: 20, name: "Sulfamethazine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.5", img: "assets/medchem/sa-sulfamethazine.png",
  feat: ["取代基為 Pyrimidine",
    "Pyrimidine 有{{兩個|數值|一個}}甲基取代"],
  pharm: ["Trisulfapyrimidines 組成藥物"] },
{ id: "sa-sulfachloropyridazine", chapter: 20, name: "Sulfachloropyridazine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.5", img: "assets/medchem/sa-sulfachloropyridazine.png",
  feat: ["取代基為 {{Pyridazine|結構}}",
    "Pyridazine 有 {{Cl|取代基}} 取代"] },
{ id: "sa-sulfadoxine", chapter: 20, name: "Sulfadoxine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.5", img: "assets/medchem/sa-sulfadoxine.png",
  feat: ["取代基為 Pyrimidine",
    "Pyrimidine 接有{{兩個|數值|一個}}{{甲氧基|取代基}}"],
  pharm: ["與 {{Pyrimethamine|藥名}} 併用（Fansidar）治療對 Chloroquine 產生抗藥性的{{惡性瘧疾|疾病}}"] },
{ id: "sa-sulfacetamide", chapter: 20, name: "Sulfacetamide", type: "drug", group: "磺胺類藥物", source: "統整（二）p.6", img: "assets/medchem/sa-sulfacetamide.png",
  feat: ["取代基為 {{Acetamide|結構}}"],
  pharm: ["製成鈉鹽可治療{{眼睛感染|疾病}}",
    "組成 Triple Sulfa，治療陰道嗜血桿菌"] },
{ id: "sa-sulfabenzamide", chapter: 20, name: "Sulfabenzamide", type: "drug", group: "磺胺類藥物", source: "統整（二）p.6", img: "assets/medchem/sa-sulfabenzamide.png",
  feat: ["取代基為 {{Benzamide|結構}}"],
  pharm: ["組成 Triple Sulfa，治療陰道嗜血桿菌"] },
{ id: "sa-sulfasalazine", chapter: 20, name: "Sulfasalazine", type: "drug", group: "磺胺類藥物", source: "統整（二）p.6", img: "assets/medchem/sa-sulfasalazine.png",
  feat: ["具有 {{Diazo（N=N）|結構}} 氮氮雙鍵",
    "在{{大腸|器官}}被細菌{{還原|代謝}}★成活性代謝物"],
  pharm: ["{{Prodrug|名詞}}，分解產生 {{Sulfapyridine|代謝物}}★ 和 5 / [i]meta[/i]-{{Aminosalicylic acid|代謝物}}★",
    "治療{{潰瘍性結腸炎|疾病}}，有抑菌效果"] },
{ id: "sa-succinylsulfathiazole", chapter: 20, name: "Succinylsulfathiazole", type: "drug", group: "磺胺類藥物", source: "統整（二）p.6", img: "assets/medchem/sa-succinylsulfathiazole.png", imgMore: ["assets/medchem/sa-succinic.png"],
  feat: ["取代基有 {{Succinic acid|結構}} 類似結構"],
  pharm: ["{{Prodrug|名詞}}，分解產生 {{Sulfathiazole|代謝物}}",
    "治療{{腸道感染|疾病}}"] },
{ id: "sa-mafenide", chapter: 20, name: "Mafenide", type: "drug", group: "磺胺類藥物", source: "統整（二）p.6", img: "assets/medchem/sa-mafenide.png",
  feat: ["非 {{Aniline 取代基|取代基}}★之磺胺類藥物",
    "苯環與 NH₂ 相隔{{一個碳|數值|兩個碳}}"],
  pharm: ["治療{{燒燙傷|疾病}}"] },
{ id: "sa-mesalamine", chapter: 20, name: "Mesalamine", type: "drug", group: "非磺胺類輔佐藥物", source: "統整（二）p.7", img: "assets/medchem/sa-mesalamine.png",
  feat: ["即 5-Aminosalicylic acid（[i]meta[/i]-position）",
    "可製成{{雙體|結構}}（dimer）：避免被代謝而失效★"],
  pharm: ["Sulfasalazine 分解產生 Sulfapyridine 與 5-Aminosalicylic acid",
    "具{{止痛|用途}}作用"] },
{ id: "sa-pyrimethamine", chapter: 20, name: "Pyrimethamine", type: "drug", group: "非磺胺類輔佐藥物", source: "統整（二）p.7", img: "assets/medchem/sa-pyrimethamine.png",
  feat: ["抑制 {{Dihydrofolate reductase|酵素}}（DHFR）"],
  pharm: ["與 {{Sulfadoxine|藥名}}★併用，可治療對 Chloroquine 具抗藥性之瘧疾",
    "（可參考抗瘧疾藥物章節）"] },
{ id: "sa-trimethoprim", chapter: 20, name: "Trimethoprim", type: "drug", group: "非磺胺類輔佐藥物", source: "統整（二）p.7", img: "assets/medchem/sa-trimethoprim.png",
  feat: ["具有 {{pyrimidine|結構}} 結構★",
    "抑制 Dihydrofolate reductase（DHFR）"],
  pharm: ["與 {{Sulfamethoxazole|藥名}}★併用（Baktar®）治療尿道感染"] },
{ id: "sa-diolamine", chapter: 20, name: "Diolamine", type: "drug", group: "非磺胺類輔佐藥物", source: "統整（二）p.7", img: "assets/medchem/sa-diolamine.png",
  feat: ["又名 {{Diethanolamine|藥名}}"],
  pharm: ["與 Sulfisoxazole 併用"] },

/* ===== 第 21 章（統整（二）貳 喹諾酮類與尿道抗菌劑 p.8–12；講義標題寫「奎寧類」，章名照單元檔名用「喹諾酮類」）===== */
/* p.8 的 Fluoroquinolones 總說明（作用機轉、藥物動力學、副作用、SAR 表與結構）放告示牌；
   沒有黑底，表格裡灰底的「第一～四代 Fluoroquinolones」、「Nitrofuran 類藥物」、「其他類藥物」各自就是分類；
   p.11 的 Nitrofuran 抗菌活性結構圖放 Nitrofuran 類藥物的知識卡；「其他類藥物」加後綴避免和之後的章節重名。
   表格欄位是特性／藥理及臨床應用。 */

{ id: "qu-nalidixic", chapter: 21, name: "Nalidixic acid", type: "drug", group: "第一代 Fluoroquinolones：沒有 F 原子", source: "統整（二）p.9", img: "assets/medchem/qu-nalidixic.png",
  feat: ["R₁ 接{{乙基|取代基}}、R₇ 接{{甲基|取代基}}",
    "R₈ 被 {{N 原子|取代基}}取代",
    "代謝：形成 CH₂OH，再 {{glucuronidation|代謝}}"],
  pharm: ["{{第一個|數值}}上市的藥物，目前已停產"] },
{ id: "qu-cinoxacin", chapter: 21, name: "Cinoxacin", type: "drug", group: "第一代 Fluoroquinolones：沒有 F 原子", source: "統整（二）p.9", img: "assets/medchem/qu-cinoxacin.png",
  feat: ["R₂ 被 {{N 原子|取代基}}取代（N-N）"],
  pharm: ["吸收較 Nalidixic acid 佳"] },
{ id: "qu-norfloxacin", chapter: 21, name: "Norfloxacin", type: "drug", group: "第二代 Fluoroquinolones", source: "統整（二）p.9", img: "assets/medchem/qu-norfloxacin.png",
  feat: ["R₁ 接乙基",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₇ 接 {{Piperazinyl|取代基}}：可抗{{綠膿桿菌|名詞}}"],
  pharm: ["第一個 {{Fluoroquinolones|藥物類別}}",
    "第一個二代 FQs"] },
{ id: "qu-ciprofloxacin", chapter: 21, name: "Ciprofloxacin", type: "drug", group: "第二代 Fluoroquinolones", source: "統整（二）p.9", img: "assets/medchem/qu-ciprofloxacin.png",
  feat: ["R₁ 接{{環丙基|取代基}}",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₇ 接 Piperazinyl：可抗綠膿桿菌"],
  pharm: ["抑制 {{CYP1A2|酵素}}"] },
{ id: "qu-ofloxacin", chapter: 21, name: "Ofloxacin", type: "drug", group: "第二代 Fluoroquinolones", source: "統整（二）p.9", img: "assets/medchem/qu-ofloxacin.png",
  feat: ["R₁、R₈ 連成環狀結構（類似 {{Morpholine|結構}}）",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₇ 接 Piperazinyl 且 N 上有甲基：與 {{GABA|受體}} 結合↓"],
  pharm: ["{{Levofloxacin|藥名}} 之消旋化合物",
    "抑制 CYP1A2"] },
{ id: "qu-levofloxacin", chapter: 21, name: "Levofloxacin", type: "drug", group: "第三代 Fluoroquinolones", source: "統整（二）p.10", img: "assets/medchem/qu-levofloxacin.png",
  feat: ["{{Ofloxacin|藥名}} 之光學異構物"],
  pharm: ["結合力較強，且抗菌與水溶性也較佳"] },
{ id: "qu-gatifloxacin", chapter: 21, name: "Gatifloxacin", type: "drug", group: "第三代 Fluoroquinolones", source: "統整（二）p.10", img: "assets/medchem/qu-gatifloxacin.png",
  feat: ["R₁ 接環丙基",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₈ 接{{甲氧基|取代基}}：減少{{光敏感性|副作用}}"],
  pharm: ["副作用：{{QT interval|副作用}}"] },
{ id: "qu-gemifloxacin", chapter: 21, name: "Gemifloxacin", type: "drug", group: "第三代 Fluoroquinolones", source: "統整（二）p.10", img: "assets/medchem/qu-gemifloxacin.png",
  feat: ["R₁ 接環丙基",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₇ 具有 {{Imine|結構}} 結構"],
  pharm: ["副作用：QT interval"] },
{ id: "qu-moxifloxacin", chapter: 21, name: "Moxifloxacin", type: "drug", group: "第四代 Fluoroquinolones", source: "統整（二）p.10", img: "assets/medchem/qu-moxifloxacin.png",
  feat: ["R₁ 接環丙基",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₈ 接{{甲氧基|取代基}}：減少{{光敏感性|副作用}}"],
  pharm: ["經由{{膽汁|器官}}★排除",
    "副作用：QT interval"] },
{ id: "qu-besifloxacin", chapter: 21, name: "Besifloxacin", type: "drug", group: "第四代 Fluoroquinolones", source: "統整（二）p.10", img: "assets/medchem/qu-besifloxacin.png",
  feat: ["R₁ 接環丙基",
    "R₆ 接 F：增加穿透細胞壁能力",
    "R₈ 接 {{Cl|取代基}}"],
  pharm: ["可治療{{眼睛感染|疾病}}"] },
{ id: "qu-nitrofurantoin", chapter: 21, name: "Nitrofurantoin", type: "drug", group: "Nitrofuran 類藥物", source: "統整（二）p.11", img: "assets/medchem/qu-nitrofurantoin.png",
  feat: ["R 為 {{Imidazolidine-2,4-dione|結構}}（toin 結構）"],
  pharm: ["治療{{尿道感染|疾病}}"] },
{ id: "qu-nitrofurazone", chapter: 21, name: "Nitrofurazone", type: "drug", group: "Nitrofuran 類藥物", source: "統整（二）p.11", img: "assets/medchem/qu-nitrofurazone.png",
  feat: ["R 為 {{Urea|結構}}"],
  pharm: ["治療{{燒傷|疾病}}",
    "對{{真菌|名詞}}無效"] },
{ id: "qu-furazolidone", chapter: 21, name: "Furazolidone", type: "drug", group: "Nitrofuran 類藥物", source: "統整（二）p.11", img: "assets/medchem/qu-furazolidone.png",
  feat: ["R 為 {{Oxazolidin-2-one|結構}}"],
  pharm: ["抑制 {{Aldehyde dehydrogenase|酵素}}",
    "→ 不可和{{酒精|物質}}併用"] },
{ id: "qu-metronidazole", chapter: 21, name: "Metronidazole", type: "drug", group: "Nitrofuran 類藥物", source: "統整（二）p.11", img: "assets/medchem/qu-metronidazole.png",
  feat: ["非 Furan 五環結構（以 {{Imidazole|結構}} 取代）",
    "不具活性結構 C=N"],
  pharm: ["治療{{陰道感染|疾病}}",
    "治療{{幽門桿菌|名詞}}引起胃潰瘍"] },
{ id: "qu-methenamine", chapter: 21, name: "Methenamine", type: "drug", group: "其他類藥物（尿道抗菌劑）", source: "統整（二）p.12", img: "assets/medchem/qu-methenamine.png",
  feat: ["具雙環結構，含 4 個 N、6 個 CH₂",
    "由甲醛和氨合成，酸性下釋放具抗菌活性的{{甲醛|代謝物}}",
    "每分子藥物釋放 {{6 分子|數值}}的甲醛★",
    "※ 抗癌藥 {{Altretamine|藥名}} 也可釋放甲醛"],
  pharm: ["可製成鹽類",
    "{{Mandelate|藥名}}：提供酸性環境",
    "{{Hippurate|藥名}}：於膀胱濃縮，使抗菌效果增加並提供酸性尿液環境"] },
{ id: "qu-fosfomycin", chapter: 21, name: "Fosfomycin", type: "drug", group: "其他類藥物（尿道抗菌劑）", source: "統整（二）p.12", img: "assets/medchem/qu-fosfomycin.png",
  feat: ["具有磷的{{三元環|結構}}結構",
    "含有 {{Epoxide|結構}} 結構"],
  pharm: ["抑制 {{Enolpyruvial transferase|酵素}}，減少 peptidoglycan 合成，細胞壁合成↓"] },
{ id: "qu-phenazopyridine", chapter: 21, name: "Phenazopyridine", type: "drug", group: "其他類藥物（尿道抗菌劑）", source: "統整（二）p.12", img: "assets/medchem/qu-phenazopyridine.png",
  feat: ["具有 {{Pyridine|結構}} 結構",
    "具有 {{Diazo（N=N）|結構}} 結構"],
  pharm: ["尿道{{止痛劑|藥物類別}}",
    "體外有抗菌活性，但體內無抗菌活性；在尿道黏膜具止痛效果",
    "與 Sulfisoxazole 併用：Azo-Gantrisin"] },

/* ===== 第 22 章（統整（二）參 抗生素－細胞壁合成抑制劑 p.13–28）===== */
/* p.13 的 Penicillin 總說明（結構與 SAR、半合成、降解反應、藥理機轉）和 p.14 的分類比較表放告示牌；
   一、盤尼西林類：灰底「Natural Penicillins」、「★抗酵素 Penicillins」是分類；「廣效型 Penicillins」（深灰）底下的 Amino／Carboxy／Acylureido（淺灰）用第三層小標；
   二、β-lactamase Inhibitors、六、其他細胞壁合成抑制劑 沒有灰底，章節標題就是分類（「其他」加「細胞壁」避免和別章重名）；
   三、頭孢菌素類：第一～五代各自為分類；四、碳青黴烯類：第一代、第二代；五、單內醯胺類：灰底就是章節名。
   p.15–18 的表格多一欄「耐酸/耐酶」（res）、p.20–24 多一欄「途徑」（route），新增在 PI.UNIT_FIELDS。
   Fosfomycin 在第 21 章（尿道抗菌劑）和這章都有，各自一格（id 前綴不同）。
   Vancomycin 與 Teicoplanin 在講義共用同一格藥理說明，Vancomycin 放整格，Teicoplanin 只放專屬它的那一句；焦棓酚（Pyrogallol）結構兩者都附。 */

{ id: "cw-penicillin-g", chapter: 22, name: "Penicillin G", type: "drug", group: "Natural Penicillins", source: "統整（二）p.15", img: "assets/medchem/cw-penicillin-g.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["{{Benzylpenicillin|藥名}}（R=phenyl）",
    "不耐酸：不可口服"],
  pharm: ["第一個用於治療的 penicillin",
    "腦膜炎時可穿過 BBB",
    "製成 {{Benzathine|藥名}} 鹽類可口服、IM",
    "製成 {{Procaine|藥名}} 鹽類可延長藥效"] },
{ id: "cw-penicillin-v", chapter: 22, name: "Penicillin V", type: "drug", group: "Natural Penicillins", source: "統整（二）p.15", img: "assets/medchem/cw-penicillin-v.png",
  res: ["耐酸：{{O|性質|X}}★",
    "耐酶：{{X|性質|O}}"],
  feat: ["{{Phenoxymethylpenicillin|藥名}}",
    "改為甲氧基（拉電子）可提升{{抗酸性|性質}}能力"],
  pharm: ["第一個{{可口服|給藥途徑}}★的 penicillin"] },
{ id: "cw-methicillin", chapter: 22, name: "Methicillin", type: "drug", group: "★抗酵素 Penicillins", source: "統整（二）p.16", img: "assets/medchem/cw-methicillin.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{O|性質|X}}"],
  feat: ["苯環 ortho 位皆具有{{甲氧基|取代基}}"],
  pharm: ["{{不可口服|給藥途徑}}★",
    "為 {{penicillinase inducer|名詞}}"] },
{ id: "cw-nafcillin", chapter: 22, name: "Nafcillin", type: "drug", group: "★抗酵素 Penicillins", source: "統整（二）p.16", img: "assets/medchem/cw-nafcillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{O|性質|X}}"],
  feat: ["6-Acyl 接上 {{Naphthalene|結構}}",
    "萘環在鄰位具有{{乙氧基|取代基}}"],
  pharm: ["血漿蛋白結合率{{高|性質|低}}"] },
{ id: "cw-oxacillin", chapter: 22, name: "Oxacillin", type: "drug", group: "★抗酵素 Penicillins", source: "統整（二）p.16", img: "assets/medchem/cw-oxacillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{O|性質|X}}"],
  feat: ["具有 {{Isoxazole|結構}} 雜環★",
    "Isoxazole 的 3 號位接苯環、5 號位接甲基"] },
{ id: "cw-cloxacillin", chapter: 22, name: "Cloxacillin", type: "drug", group: "★抗酵素 Penicillins", source: "統整（二）p.16", img: "assets/medchem/cw-cloxacillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{O|性質|X}}"],
  feat: ["具有 {{Isoxazole|結構}} 雜環★",
    "Isoxazole 的 3 號位接苯環、5 號位接甲基",
    "苯環在鄰位有{{一個|數值|兩個}} Cl 取代"],
  pharm: ["Cl 取代可增加口服吸收率"] },
{ id: "cw-dicloxacillin", chapter: 22, name: "Dicloxacillin", type: "drug", group: "★抗酵素 Penicillins", source: "統整（二）p.16", img: "assets/medchem/cw-dicloxacillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{O|性質|X}}"],
  feat: ["具有 {{Isoxazole|結構}} 雜環★",
    "Isoxazole 的 3 號位接苯環、5 號位接甲基",
    "苯環在鄰位有{{兩個|數值|一個}} Cl 取代"],
  pharm: ["兩個 Cl 取代使安定性與血漿蛋白結合率皆提升"] },
{ id: "cw-ampicillin", chapter: 22, name: "Ampicillin", type: "drug", group: "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）", source: "統整（二）p.17", img: "assets/medchem/cw-ampicillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["α碳接有苯環與 NH₂",
    "D(-)的作用比 L(+)強"],
  pharm: ["可和 {{Sulbactam|藥名}} 併用（Unasyn®）"] },
{ id: "cw-bacampicillin", chapter: 22, name: "Bacampicillin", type: "drug", group: "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）", source: "統整（二）p.17", img: "assets/medchem/cw-bacampicillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["R₂ 多了{{酯鍵|結構}}"],
  pharm: ["Ampicillin 之{{前驅藥|名詞}}",
    "口服吸收率較佳"] },
{ id: "cw-hetacillin", chapter: 22, name: "Hetacillin", type: "drug", group: "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）", source: "統整（二）p.17", img: "assets/medchem/cw-hetacillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["兩個 N 形成{{五元環|結構}}結構，且有二甲基取代"],
  pharm: ["{{Ampicillin|藥名}}★之前驅藥，\n水解開環形成 Ampicillin+acetone"] },
{ id: "cw-amoxicillin", chapter: 22, name: "Amoxicillin", type: "drug", group: "Amino penicillins：α碳接有苯環與胺基-NH₂ →可口服但容易被水解（耐酸不耐酶★）", source: "統整（二）p.17", img: "assets/medchem/cw-amoxicillin.png",
  res: ["耐酸：{{O|性質|X}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["苯環對位多了一個 {{OH|取代基}} 取代",
    "合成：[i]p[/i]-hydroxyphenylglycine+6-APA"],
  pharm: ["口服生體可用率高且食物不影響吸收",
    "可和 {{Clavulanic acid|藥名}} 併用（Augmentin®）"] },
{ id: "cw-carbenicillin", chapter: 22, name: "Carbenicillin", type: "drug", group: "Carboxy-penicillins：α碳接有苯環與羧基-COOH，可抗綠膿桿菌", source: "統整（二）p.18", img: "assets/medchem/cw-carbenicillin.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["α碳接有苯環與 COOH",
    "脫羧後形成 {{Penicillin G|藥名}}★"],
  pharm: ["可用於對 Ampicillin 具抗藥性的尿道感染"] },
{ id: "cw-ticarcillin", chapter: 22, name: "Ticarcillin", type: "drug", group: "Carboxy-penicillins：α碳接有苯環與羧基-COOH，可抗綠膿桿菌", source: "統整（二）p.18", img: "assets/medchem/cw-ticarcillin.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["{{Carbenicillin|藥名}} 之等效異構物",
    "將 Carbenicillin 苯環上的 CH₂ 改成 {{S|取代基}}",
    "（Phenyl → {{Thienyl|取代基}}）"],
  pharm: ["和 Clavulanic acid 併用（Timentin®）",
    "血清濃度高，Duration 長"] },
{ id: "cw-mezlocillin", chapter: 22, name: "Mezlocillin", type: "drug", group: "Acylureido-penicillins：Ampicillin 的α-NH₂接有 Urea 類似物，可抗綠膿桿菌", source: "統整（二）p.18", img: "assets/medchem/cw-mezlocillin.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["具有 {{acylureido|結構}}★結構",
    "Ampicillin 的胺基接上 acylurea 和 SO₂CH₃"],
  pharm: ["{{不耐酶|性質}}，對會產生β-lactamase 的細菌無效"] },
{ id: "cw-piperacillin", chapter: 22, name: "Piperacillin", type: "drug", group: "Acylureido-penicillins：Ampicillin 的α-NH₂接有 Urea 類似物，可抗綠膿桿菌", source: "統整（二）p.18", img: "assets/medchem/cw-piperacillin.png",
  res: ["耐酸：{{X|性質|O}}",
    "耐酶：{{X|性質|O}}"],
  feat: ["Ampicillin 的胺基接上 acylurea 和 C=O，",
    "形成六元環結構（{{piperazine|結構}}）"],
  pharm: ["可和 {{Tazobactam|藥名}}★併用（Zosyn®）"] },
{ id: "cw-clavulanic", chapter: 22, name: "Clavulanic acid", short: "Clavulanate", type: "drug", group: "β-lactamase Inhibitors", source: "統整（二）p.19", img: "assets/medchem/cw-clavulanic.png",
  feat: ["五元雜環含 N、{{O|取代基}} 原子",
    "含有 {{hydroxyethylidene|結構}} 結構"],
  pharm: ["Augmentin® = {{Amoxicillin|藥名}} + Clavulanate",
    "Timentin® = {{Ticarcillin|藥名}} + Clavulanate"] },
{ id: "cw-sulbactam", chapter: 22, name: "Sulbactam", type: "drug", group: "β-lactamase Inhibitors", source: "統整（二）p.19", img: "assets/medchem/cw-sulbactam.png",
  feat: ["五元雜環含 N、{{S|取代基}} 原子",
    "具有 {{Sulfone|結構}} 結構"],
  pharm: ["Unasyn® = {{Ampicillin|藥名}} + Sulbactam"] },
{ id: "cw-tazobactam", chapter: 22, name: "Tazobactam", type: "drug", group: "β-lactamase Inhibitors", source: "統整（二）p.19", img: "assets/medchem/cw-tazobactam.png",
  feat: ["五元雜環含 N、S 原子",
    "具有 {{Sulfone|結構}}★結構",
    "較 Sulbactam 多了 {{Triazole|結構}} 結構"],
  pharm: ["Zosyn® = {{Piperacillin|藥名}} + Tazobactam"] },
{ id: "cw-cephalexin", chapter: 22, name: "Cephalexin", type: "drug", group: "第一代 Cephalosporins", source: "統整（二）p.20", img: "assets/medchem/cw-cephalexin.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["7 號位 side chain 與 {{Ampicillin|藥名}} 相同"],
  pharm: ["治療尿道與上呼吸道感染"] },
{ id: "cw-cefadroxil", chapter: 22, name: "Cefadroxil", type: "drug", group: "第一代 Cephalosporins", source: "統整（二）p.20", img: "assets/medchem/cw-cefadroxil.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["7 號位 side chain 與 {{Amoxicillin|藥名}} 相同",
    "側鏈結構 D form 活性較佳"] },
{ id: "cw-cefazolin", chapter: 22, name: "Cefazolin", type: "drug", group: "第一代 Cephalosporins", source: "統整（二）p.20", img: "assets/medchem/cw-cefazolin.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有 {{thiadiazole|結構}} 雜環結構",
    "C₇ 接有 {{tetrazole|結構}} 雜環結構"],
  pharm: ["{{術前預防抗生素之首選藥|用途}}",
    "不耐酶"] },
{ id: "cw-cefaclor", chapter: 22, name: "Cefaclor", type: "drug", group: "第二代 Cephalosporins", source: "統整（二）p.21", img: "assets/medchem/cw-cefaclor.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["7 號位 side chain 與 {{Cephalexin|藥名}} 相同",
    "（{{α-aminobenzyl|結構}}★）",
    "C₃ 的甲基改為 Cl 取代"],
  pharm: ["抗菌活性與 Cephalexin 相似"] },
{ id: "cw-cefprozil", chapter: 22, name: "Cefprozil", type: "drug", group: "第二代 Cephalosporins", source: "統整（二）p.21", img: "assets/medchem/cw-cefprozil.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["7 號位 side chain 與 {{Cefadroxil|藥名}} 相同",
    "C₃ 的甲基改為{{丙烯基|取代基}}"],
  pharm: ["抗菌活性與 Cefadroxil 相似",
    "口服吸收極佳，不被制酸劑影響"] },
{ id: "cw-cefuroxime", chapter: 22, name: "Cefuroxime", type: "drug", group: "第二代 Cephalosporins", source: "統整（二）p.21", img: "assets/medchem/cw-cefuroxime.png",
  route: ["{{口服|給藥途徑}}",
    "{{IV|給藥途徑}}"],
  feat: ["C₃ 側鏈有 NH₂ 結構（{{Urethane|結構}}）：耐酸",
    "C₇ 接有 {{Oxime|結構}} 結構：增加立體障礙，耐酶"],
  pharm: ["第二代中唯一可進入 {{BBB|器官}}★",
    "製成 {{axetil|名詞}} 鹽類可口服",
    "與食物併服吸收↑，不可和制酸劑併用",
    "製成 sodium 鹽類以 IV 使用"] },
{ id: "cw-cefoxitin", chapter: 22, name: "Cefoxitin", type: "drug", group: "第二代 Cephalosporins", source: "統整（二）p.21", img: "assets/medchem/cw-cefoxitin.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 側鏈有 NH₂ 結構（Urethane）：耐酸",
    "C₇ 接有 {{7α-methoxy|取代基}}"],
  pharm: ["β-lactamase 的{{競爭型|機轉}}抑制劑"] },
{ id: "cw-cefotetan", chapter: 22, name: "Cefotetan", type: "drug", group: "第二代 Cephalosporins", source: "統整（二）p.21", img: "assets/medchem/cw-cefotetan.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有 {{MTT|結構}} 結構※ →引發{{出血|副作用}}風險",
    "C₇ 接有 7α-methoxy"],
  pharm: ["MTT 副作用：{{凝血困難|副作用}}、{{酒精不耐症|副作用}}",
    "β-lactamase 的競爭型抑制劑"] },
{ id: "cw-cefixime", chapter: 22, name: "Cefixime", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.22", img: "assets/medchem/cw-cefixime.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["C₃ 接有乙烯基",
    "C₇ 接有 3-substituted-5-aminothiazole，可增加對 G(-)的穿透力；另含有 oxime 結構",
    "（{{Methoxyimino|結構}}★，例外：{{Ceftibuten|藥名}}）"],
  pharm: ["第三代中{{第一個口服|性質}}用藥",
    "廣效型，可抗 G(-)與β-lactamase"] },
{ id: "cw-cefpodoxime", chapter: 22, name: "Cefpodoxime", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.22", img: "assets/medchem/cw-cefpodoxime.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["C₃ 接有甲氧基",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["製成 {{proxetil|名詞}} 鹽類前驅藥可口服",
    "廣效型，可抗 G(+)、G(-)與β-lactamase"] },
{ id: "cw-ceftibuten", chapter: 22, name: "Ceftibuten", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.22", img: "assets/medchem/cw-ceftibuten.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["C₃ {{無取代基|取代基}}★",
    "C₇ 接有 3-substituted-5-aminothiazole，可增加對 G(-)的穿透力；另含有 C=C 結構",
    "（[i]Z[/i]-{{Ethylidinecarboxyl|結構}}★ group）",
    "→ 第三代中唯二 C₇ 無 oxime 結構"],
  pharm: ["第三代中{{生體可用率最高|性質}}★",
    "對 SA 與綠膿桿菌無效"] },
{ id: "cw-cefdinir", chapter: 22, name: "Cefdinir", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.22", img: "assets/medchem/cw-cefdinir.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["C₃ 接有乙烯基 →增加口服活性",
    "C₇ 接有 5-aminothiazole 與 oxime 結構；",
    "且含有 OH 可增加抗 G(-)活性"] },
{ id: "cw-cefitoren", chapter: 22, name: "Cefitoren pivoxil", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.22", img: "assets/medchem/cw-cefitoren.png",
  route: ["{{口服|給藥途徑|IV}}"],
  feat: ["C₃ 接有 {{Thiazole|結構}} 雜環",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["與制酸劑併服會使吸收{{下降|性質|上升}}；",
    "與食物併服會使吸收{{上升|性質|下降}}"] },
{ id: "cw-cefotaxime", chapter: 22, name: "Cefotaxime", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.23", img: "assets/medchem/cw-cefotaxime.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有{{酯基|取代基}}",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["第三代中第一個{{非口服|性質}}用藥",
    "可抗 G(+)、G(-)，對 MRSA 無效",
    "Syn-isomers 對 PBP※結合力較高，且抗酶能力較佳"] },
{ id: "cw-ceftizoxime", chapter: 22, name: "Ceftizoxime", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.23", img: "assets/medchem/cw-ceftizoxime.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 無取代基",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["在體內不會被代謝",
    "可抗 G(-)，對{{腸桿菌|名詞}}效果極佳",
    "對 MRSA 無效"] },
{ id: "cw-ceftriaxone", chapter: 22, name: "Ceftriaxone", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.23", img: "assets/medchem/cw-ceftriaxone.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有雜環結構",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["血漿蛋白結合率高，半衰期長",
    "治療{{淋病球菌|名詞}}感染之首選藥物",
    "可抗 G(+)、(-)，對 MRSA、綠膿無效",
    "副作用：{{膽囊炎|副作用}}（由{{膽汁|器官}}排除）"] },
{ id: "cw-ceftazidime", chapter: 22, name: "Ceftazidime", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.23", img: "assets/medchem/cw-ceftazidime.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有 {{Pyridinium|結構}}（四級銨，兩性性質）",
    "C₇ 接有 5-aminothiazole 與 oxime 結構，",
    "具有雙甲基與 isobutyric acid group"],
  pharm: ["可抗 {{Pseudomonas|名詞}}，對 MRSA 無效",
    "可耐β-lactamase"] },
{ id: "cw-cefoperazone", chapter: 22, name: "Cefoperazone", type: "drug", group: "第三代 Cephalosporins", source: "統整（二）p.23", img: "assets/medchem/cw-cefoperazone.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接 MTT 結構",
    "C₇ 側鏈與 {{Piperacillin|藥名}} 相同，可被水解",
    "→ 第三代中唯二 C₇ 無 oxime 結構",
    "→ 第三代中唯一 C₇ 不接 {{thiazole|結構}} 雜環"],
  pharm: ["第三代中唯一不進入 {{BBB|器官}}★",
    "可抗 Pseudomonas，對 MRSA 無效",
    "可耐β-lactamase",
    "經由{{膽汁|器官}}排除"] },
{ id: "cw-cefpirome", chapter: 22, name: "Cefpirome", type: "drug", group: "第四代 Cephalosporins", source: "統整（二）p.24", img: "assets/medchem/cw-cefpirome.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有{{四級銨|結構}}結構",
    "（Pyridine 衍生，具兩性性質）",
    "C₇ 接有 5-aminothiazole 與 oxime 結構"],
  pharm: ["第四代中第一個 {{IV 注射|給藥途徑}}藥物"] },
{ id: "cw-cefepime", chapter: 22, name: "Cefepime", type: "drug", group: "第四代 Cephalosporins", source: "統整（二）p.24", img: "assets/medchem/cw-cefepime.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有四級銨結構",
    "（{{Pyrrolidine|結構}} 衍生，具兩性性質）",
    "C₇ 接有 5-aminothiazole 與 oxime 結構",
    "（{{methoxyimino|結構}}★ group）"],
  pharm: ["化學性質與 Cefpirome 相似"] },
{ id: "cw-ceftaroline", chapter: 22, name: "Ceftaroline", type: "drug", group: "第五代 Cephalosporins", source: "統整（二）p.24", img: "assets/medchem/cw-ceftaroline.png",
  route: ["{{IV|給藥途徑|口服}}"],
  feat: ["C₃ 接有四級銨結構",
    "（Thiazole+Pyridinium，具兩性性質）",
    "C₇ 接有 thiadiazole、oxime、{{磷酸鹽|結構}}結構"],
  pharm: ["對正常與突變的 PBP 皆有親和力"] },
{ id: "cw-thienamycin", chapter: 22, name: "Thienamycin", type: "drug", group: "第一代 Carbapenems：C₄無甲基保護，易被腎臟 Dehydropeptidase-1★（DHP-1）水解", source: "統整（二）p.25", img: "assets/medchem/cw-thienamycin.png",
  feat: ["具有{{三個|數值}} chiral center：5S、6S、8S",
    "C₂、C₃ 間有雙鍵",
    "分子間不穩定，易形成複合體"] },
{ id: "cw-imipenem", chapter: 22, name: "Imipenem", type: "drug", group: "第一代 Carbapenems：C₄無甲基保護，易被腎臟 Dehydropeptidase-1★（DHP-1）水解", source: "統整（二）p.25", img: "assets/medchem/cw-imipenem.png",
  feat: ["C₂、C₃ 間有雙鍵",
    "C₃ 側鏈具有 {{Imine|結構}} 結構（R-C=N）"],
  pharm: ["廣效型，與 {{Cilastatin|藥名}}★併用！",
    "（Cilastatin 為 DHP-1 抑制劑）"] },
{ id: "cw-meropenem", chapter: 22, name: "Meropenem", type: "drug", group: "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）", source: "統整（二）p.26", img: "assets/medchem/cw-meropenem.png",
  feat: ["C₃ 側鏈具有 {{Amide|結構}} 結構"],
  pharm: ["治療腦膜炎、敗血症、肺炎等",
    "對 MRSA 無效且不可口服",
    "對 G(-)和厭氧菌效果較佳"] },
{ id: "cw-doripenem", chapter: 22, name: "Doripenem", type: "drug", group: "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）", source: "統整（二）p.26", img: "assets/medchem/cw-doripenem.png",
  feat: ["C₃ 側鏈具有 {{Sulfone|結構}} 結構"],
  pharm: ["對 {{Pseudomonas|名詞}} 作用強"] },
{ id: "cw-ertapenem", chapter: 22, name: "Ertapenem", type: "drug", group: "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）", source: "統整（二）p.26", img: "assets/medchem/cw-ertapenem.png",
  feat: ["C₃ 側鏈具有 [i]meta[/i]-{{benzoic acid|結構}} 結構"],
  pharm: ["血漿蛋白結合力強",
    "對 [i]Pseudomonas[/i] 和 [i]Acinetobacteria[/i]（鮑氏不動桿菌/AB 菌）{{無效|性質|有效}}"] },
{ id: "cw-tebipenem", chapter: 22, name: "Tebipenem", type: "drug", group: "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）", source: "統整（二）p.26", img: "assets/medchem/cw-tebipenem.png",
  feat: ["C₃ 側鏈具有 {{Thiazole|結構}} 雜環"],
  pharm: ["製成 {{pivoxil|名詞}} 前驅藥可口服"] },
{ id: "cw-biapenem", chapter: 22, name: "Biapenem", type: "drug", group: "第二代 Carbapenems：C₄具有甲基取代，防止被腎臟 DHP-1 水解（不需併用 Cilastatin）", source: "統整（二）p.26", img: "assets/medchem/cw-biapenem.png",
  feat: ["C₃ 側鏈具有雙環、{{triazole|結構}} 結構"],
  pharm: ["廣效抗菌劑，不可口服"] },
{ id: "cw-aztreonam", chapter: 22, name: "Aztreonam", type: "drug", group: "單內醯胺類（Monobactams）", source: "統整（二）p.27", img: "assets/medchem/cw-aztreonam.png",
  feat: ["4 號位具有{{1 個|數值|2 個}}甲基",
    "與 {{Ceftazidime|藥名}} 一樣具有 isobutyric acid",
    "oximinoacyl 結構"],
  pharm: ["對 G(+)、{{厭氧菌|名詞}}無效"] },
{ id: "cw-tigemonam", chapter: 22, name: "Tigemonam", type: "drug", group: "單內醯胺類（Monobactams）", source: "統整（二）p.27", img: "assets/medchem/cw-tigemonam.png",
  feat: ["4 號位具有{{2 個|數值|1 個}}甲基"],
  pharm: ["{{口服|給藥途徑}}使用，可抵抗β-lactamase",
    "對 {{Enterobacteriaceae|名詞}} 腸道菌科非常有效"] },
{ id: "cw-fosfomycin", chapter: 22, name: "Fosfomycin", type: "drug", group: "其他細胞壁合成抑制劑", source: "統整（二）p.28", img: "assets/medchem/cw-fosfomycin.png",
  feat: ["含有 {{epoxide|結構}}、P 原子"],
  pharm: ["機轉：抑制 {{Mur-A|酵素}}★（enolpyruvate transferase）",
    "{{殺菌|性質|抑菌}}作用"] },
{ id: "cw-cycloserine", chapter: 22, name: "Cycloserine", type: "drug", group: "其他細胞壁合成抑制劑", source: "統整（二）p.28", img: "assets/medchem/cw-cycloserine.png",
  feat: ["立體組態：{{R(+) form|結構}}",
    "{{水溶性|性質}}，在酸中不穩定",
    "（比較：Cyclosporin 為脂溶性）"],
  pharm: ["機轉：競爭 {{D-Ala-D-Ala synthetase|酵素}}",
    "為 CYP inhibitor"] },
{ id: "cw-bacitracin", chapter: 22, name: "Bacitracin", type: "drug", group: "其他細胞壁合成抑制劑", source: "統整（二）p.28", img: "assets/medchem/cw-bacitracin.png",
  feat: ["環狀多肽結構"],
  pharm: ["機轉：抑制 BP 磷酸化，使 Murein 無法運送",
    "{{局部使用|給藥途徑}}★，口服不吸收"] },
{ id: "cw-vancomycin", chapter: 22, name: "Vancomycin", type: "drug", group: "其他細胞壁合成抑制劑", source: "統整（二）p.28", img: "assets/medchem/cw-vancomycin.png", imgMore: ["assets/medchem/cw-pyrogallol.png"],
  feat: ["具有 5 個苯環",
    "含有 {{pyrogallol|結構}}（連苯三酚）結構",
    "醣基：glucose、胺醣：vancosamine",
    "可治療 {{MRSA|名詞}}★、{{偽膜性腸炎|疾病}}★"],
  pharm: ["機轉：和 {{D-Ala-D-Ala|標的}} 片段結合，抑制細胞壁",
    "抗藥性：末端變成 D-Ala-D-Lactate",
    "由{{腎臟|器官}}進行排除",
    "副作用：{{Red man Syndrome|副作用}}"] },
{ id: "cw-teicoplanin", chapter: 22, name: "Teicoplanin", type: "drug", group: "其他細胞壁合成抑制劑", source: "統整（二）p.28", img: "assets/medchem/cw-teicoplanin.png", imgMore: ["assets/medchem/cw-pyrogallol.png"],
  feat: ["具有 7 個苯環",
    "含有 pyrogallol（連苯三酚）結構",
    "醣基：D-mannose",
    "胺醣：2 個 glycosamine"],
  pharm: ["脂溶性較{{高|性質|低}}，較不會有副作用"] },

/* ===== 第 23 章（統整（二）肆 抗生素－蛋白質合成抑制劑 p.29–40）===== */
/* p.29 的作用位置總覽圖與表、p.30 胺醣類藥理、p.31 胺醣類基本結構、p.33 四環素藥理與化學性質、p.34 四環素基本結構與 SAR、p.35 Macrolides 藥理、p.40 抗生素分類與抗藥性機轉整理，都是沒有黑底灰底的總說明，放告示牌；
   一、胺醣類：灰底「五碳糖」「六碳糖」是分類（加後綴避免重名）；二、四環類：表格的「分類」欄（短效／中效／長效／廣效）當分類，每個藥的 R₁～R₄ 取代基放「說明」；
   三、Macrolides：灰底 Macrolides、Ketolides；四、Lincosamide 類的基本結構框放該類知識卡；五、其他蛋白質抑制劑：另有灰底 Streptogramin 類。
   講義一列兩個藥共用的說明（Troleandomycin／Oleandomycin、Dalfopristin／Quinupristin 的藥理）兩格都放；只講到其中一個藥的句子只放那一格。 */

{ id: "pr-streptomycin", chapter: 23, name: "Streptomycin", type: "drug", group: "五碳糖（胺醣類）", source: "統整（二）p.31", img: "assets/medchem/pr-streptomycin.png",
  feat: ["主要結構：{{Streptamine|結構}}",
    "（不具有 {{2-deoxystreptamine|結構}}★）",
    "五碳糖：{{Streptose|結構}}",
    "含有 2 個 {{Guanidine|結構}} 基團（C₁、C₃★），為強鹼藥；",
    "強酸下水解得到 {{Streptidine|代謝物}}★、Streptobiosamine"],
  pharm: ["{{第一個|數值}}具有生物活性的胺醣類藥物",
    "高親水性，不易與脂蛋白結合",
    "醛基還原成醇基，造成{{耳聾|副作用}}副作用",
    "{{肺結核|疾病}}第二線用藥"] },
{ id: "pr-neomycin", chapter: 23, name: "Neomycin", type: "drug", group: "五碳糖（胺醣類）", source: "統整（二）p.31", img: "assets/medchem/pr-neomycin.png",
  feat: ["主要結構：{{2-Deoxystreptamine|結構}}",
    "五碳糖：{{D-ribose|結構}}"],
  pharm: ["因{{腎毒性|副作用}}大，需{{口服|給藥途徑}}使用",
    "作為腹腔手術之{{腸道清潔劑|用途}}",
    "與 {{Lactulose|藥名}} 併用治療{{肝性腦病變|疾病}}"] },
{ id: "pr-paromomycin", chapter: 23, name: "Paromomycin", type: "drug", group: "五碳糖（胺醣類）", source: "統整（二）p.31", img: "assets/medchem/pr-paromomycin.png",
  feat: ["主要結構：2-Deoxystreptamine",
    "五碳糖：D-ribose"],
  pharm: ["腎毒性大，{{不可注射|給藥途徑}}使用",
    "可治療{{腸道阿米巴原蟲感染|疾病}}★"] },
{ id: "pr-kanamycin", chapter: 23, name: "Kanamycin", type: "drug", group: "六碳糖（胺醣類）", source: "統整（二）p.32", img: "assets/medchem/pr-kanamycin.png",
  feat: ["主要結構：2-Deoxystreptamine",
    "Kanamycin A 與 {{L-HABA|結構}} {{乙醯化|代謝}}後得到 {{Amikacin|藥名}}",
    "Kanamycin B 去除 {{3'-OH|取代基}} 後得到 {{Tobramycin|藥名}}"],
  pharm: ["抗藥性之產生",
    "Kanamycin A：C3'-OH 被{{磷酸化|代謝}}",
    "Kanamycin B：C6'-NH₂ 被{{乙醯化|代謝}}★"] },
{ id: "pr-amikacin", chapter: 23, name: "Amikacin", type: "drug", group: "六碳糖（胺醣類）", source: "統整（二）p.32", img: "assets/medchem/pr-amikacin.png", imgMore: ["assets/medchem/pr-haba.png"],
  feat: ["主要結構：2-Deoxystreptamine",
    "Kanamycin A 與 L-HABA（結構如下）經乙醯化合成得到",
    "（L-HABA 接在 {{deoxystreptamine|結構}}★上）"],
  pharm: ["由 Kanamycin {{半合成|名詞}}而來",
    "最不容易被酵素分解"] },
{ id: "pr-gentamicin", chapter: 23, name: "Gentamicin", type: "drug", group: "六碳糖（胺醣類）", source: "統整（二）p.32", img: "assets/medchem/pr-gentamicin.png",
  feat: ["主要結構：2-Deoxystreptamine",
    "主結構之 1 號位具有 {{NH₂|取代基}}",
    "缺乏 {{3'-OH|取代基}}★，不會被 phosphotransferase 分解",
    "Gentamicin C₁ₐ 衍生物★：{{Netilmicin|藥名}}、{{Sisomicin|藥名}}",
    "（Sisomicin 的 C3-NH₂ {{乙基化|代謝}}★可得 Netilmicin）"],
  pharm: ["不可和 {{Carbenicillin|藥名}}/{{Ampicillin|藥名}} 併用",
    "因 1-NH₂ 會使 β-lactam 進行 N-乙醯化而失去活性"] },
{ id: "pr-spectinomycin", chapter: 23, name: "Spectinomycin", type: "drug", group: "六碳糖（胺醣類）", source: "統整（二）p.32", img: "assets/medchem/pr-spectinomycin.png",
  feat: ["屬於 {{Aminocyclitol|藥物類別}} 類",
    "不具有 {{2-deoxystreptamine|結構}}★",
    "三個環狀結構直接相接"],
  pharm: ["{{抑菌|性質|殺菌}}：胺醣類唯一不造成 mRNA 誤讀",
    "唯一治療具抗藥性或對 penicillin 過敏的{{淋病|疾病}}患者"] },
{ id: "pr-tetracycline", chapter: 23, name: "Tetracycline", type: "drug", group: "Tetracyclines：短效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：H　R₂（C₆）：CH₃　R₃（C₆）：OH　R₄（C₅）：H"],
  feat: ["{{HCl 鹽類|物質}}可治療{{痤瘡|疾病}}"] },
{ id: "pr-chlortetracycline", chapter: 23, name: "Chlortetracycline", type: "drug", group: "Tetracyclines：短效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：{{Cl|取代基}}　R₂（C₆）：CH₃　R₃（C₆）：OH　R₄（C₅）：H"],
  feat: ["C₇ 接有 Cl 原子，增加{{脂溶性|性質|水溶性}}"] },
{ id: "pr-oxytetracycline", chapter: 23, name: "Oxytetracycline", type: "drug", group: "Tetracyclines：短效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：H　R₂（C₆）：CH₃　R₃（C₆）：OH　R₄（C₅）：{{OH|取代基}}"],
  feat: ["C₅ 接有 α-OH →最{{親水|性質|親脂}}"] },
{ id: "pr-demeclocycline", chapter: 23, name: "Demeclocycline", type: "drug", group: "Tetracyclines：中效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：Cl　R₂（C₆）：{{H|取代基}}　R₃（C₆）：OH　R₄（C₅）：H"],
  feat: ["{{光毒性|副作用}}，最不容易使{{牙齒變色|副作用}}。具抗利尿激素 ADH 作用，可治療 {{SIADH|疾病}}"] },
{ id: "pr-methacycline", chapter: 23, name: "Methacycline", type: "drug", group: "Tetracyclines：中效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：H　R₂、R₃（C₆）：{{C=C|結構}}　R₄（C₅）：OH"],
  feat: ["C₆ 無 OH 基，增加對{{鹼|性質|酸}}的安定性★"] },
{ id: "pr-rolitetracycline", chapter: 23, name: "Rolitetracycline", type: "drug", group: "Tetracyclines：中效型", source: "統整（二）p.34",
  desc: ["Tetracycline + {{Formaldehyde|物質}}★ + {{Pyrrolidine|結構}}★"],
  feat: ["C₂ 進行 {{Mannich 縮合反應|名詞}}，{{水溶性|性質|脂溶性}}增加★，適合做成{{注射劑|名詞}}"] },
{ id: "pr-doxycycline", chapter: 23, name: "Doxycycline", type: "drug", group: "Tetracyclines：長效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：H　R₂（C₆）：CH₃　R₃（C₆）：{{H|取代基}}　R₄（C₅）：OH"],
  feat: ["C₆ 無取代可入 {{BBB|器官}}，口服吸收佳。治療{{披衣菌|名詞}}感染，由{{膽汁|器官}}排除"] },
{ id: "pr-minocycline", chapter: 23, name: "Minocycline", type: "drug", group: "Tetracyclines：長效型", source: "統整（二）p.34",
  desc: ["R₁（C₇）：{{N(CH₃)₂|取代基}}　R₂（C₆）：H　R₃（C₆）：H　R₄（C₅）：H"],
  feat: ["廣效型，口服吸收佳，可入 BBB 治{{腦膜炎|疾病}}。具有{{兩個|數值|一個}} dimethylamino group"] },
{ id: "pr-tigecycline", chapter: 23, name: "Tigecycline", type: "drug", group: "Tetracyclines：廣效型", source: "統整（二）p.34", img: "assets/medchem/pr-tigecycline.png",
  feat: ["C₉ 具有 [i]t[/i]-{{butylglycylamido|取代基}} 基團★、具有兩個 dimethylamino group",
    "可抑制細菌之{{外排幫浦|機轉}}，治療{{超級細菌|名詞}}感染"] },
{ id: "pr-erythromycin", chapter: 23, name: "Erythromycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.36", img: "assets/medchem/pr-erythromycin.png",
  feat: ["非醣基：{{Erythronolide A|結構}}（{{14|數值}} 元環內酯）",
    "C₃ 上醣基：{{Cladinose|結構}}",
    "C₅ 上胺醣：{{Desosamine|結構}}，微鹼性之來源"],
  pharm: ["治療孕婦泌尿道感染{{披衣菌|名詞}}、對 Penicillin 過敏之{{梅毒|疾病}}患者",
    "{{Estolate|名詞}} 製劑可治療{{膽汁鬱積性肝炎|疾病}}",
    "CYP450 抑制劑"] },
{ id: "pr-clarithromycin", chapter: 23, name: "Clarithromycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.36", img: "assets/medchem/pr-clarithromycin.png",
  feat: ["Erythromycin C₆-OH 修飾為 {{-OCH₃|取代基}}★",
    "→對酸穩定，口服生體可用率高，同時可減少腸胃道副作用"],
  pharm: ["{{幽門螺旋桿菌|名詞}}感染首選藥",
    "可治療 [i]H. influenzae[/i]、胃潰瘍三合一療法（PPI+Amoxicillin/Metronidazole）",
    "CYP450 抑制劑，經由{{腎臟|器官}}★排除"] },
{ id: "pr-dirithromycin", chapter: 23, name: "Dirithromycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.36", img: "assets/medchem/pr-dirithromycin.png",
  feat: ["結構多一個環：{{9N,11O-oxazine ring|結構}}",
    "C₉ 接有長鏈結構，使脂溶性增加"],
  pharm: ["代謝產生 9S-erythromycylamine"] },
{ id: "pr-azithromycin", chapter: 23, name: "Azithromycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.37", img: "assets/medchem/pr-azithromycin.png",
  feat: ["唯一 {{15 元環|數值}}內酯結構",
    "Erythromycin 的 C₉、C₁₀ 間導入 {{N-methyl|取代基}}★形成",
    "（將 Erythromycin 與 {{NH₂OH|物質}}★反應）",
    "對酸安定性增加，口服吸收上升"],
  pharm: ["對 G(-)較有效，可治療{{退伍軍人症|疾病}}",
    "{{半衰期最長|性質}}",
    "{{不會|性質|會}}抑制 CYP450"] },
{ id: "pr-troleandomycin", chapter: 23, name: "Troleandomycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.37", img: "assets/medchem/pr-troleandomycin.png",
  feat: ["非醣基：{{Oleanolide|結構}}",
    "C₃★上醣基：{{L-Oleandrose|結構}}",
    "C₅★上胺醣：{{Desosamine|結構}}"],
  pharm: ["Oleandomycin 的三個 OH 基★改成 {{acetyl|取代基}} 後形成 Troleandomycin",
    "Troleandomycin 之血中濃度較{{高|性質|低}}",
    "最強 CYP450 抑制劑"] },
{ id: "pr-oleandomycin", chapter: 23, name: "Oleandomycin", type: "drug", group: "Macrolides（大環內酯類）", source: "統整（二）p.37", img: "assets/medchem/pr-oleandomycin.png",
  feat: ["非醣基：{{Oleanolide|結構}}",
    "C₃★上醣基：{{L-Oleandrose|結構}}",
    "C₅★上胺醣：{{Desosamine|結構}}"],
  pharm: ["Oleandomycin 的三個 OH 基★改成 acetyl 後形成 {{Troleandomycin|藥名}}",
    "最強 CYP450 抑制劑"] },
{ id: "pr-telithromycin", chapter: 23, name: "Telithromycin", type: "drug", group: "Ketolides", source: "統整（二）p.37", img: "assets/medchem/pr-telithromycin.png",
  feat: ["C₃ 為{{酮基|取代基}}、C₆ 為 OCH₃（與 {{Clarithromycin|藥名}} 相同）",
    "C₅ 上胺醣：Desosamine",
    "C₁₁、C₁₂ 接有{{雜環側鏈|結構}}"],
  pharm: ["口服有效",
    "對 Erythromycin 有抗藥性的{{社區型肺炎|疾病}}感染首選藥物",
    "CYP450 抑制劑"] },
{ id: "pr-lincomycin", chapter: 23, name: "Lincomycin", type: "drug", group: "Lincosamide 類", source: "統整（二）p.38", img: "assets/medchem/pr-lincomycin.png",
  feat: ["C₇ 接上 {{OH|取代基}}，立體組態為 {{R form|結構|S form}}（相異處）",
    "與 {{SOCl₂|物質}}★反應可得 Clindamycin"],
  pharm: ["容易引發{{偽膜性腸炎|疾病}}"] },
{ id: "pr-clindamycin", chapter: 23, name: "Clindamycin", type: "drug", group: "Lincosamide 類", source: "統整（二）p.38", img: "assets/medchem/pr-clindamycin.png",
  feat: ["Lincomycin 之 7S-chloro-7-deoxy 衍生物",
    "C₇ 接上 {{Cl|取代基}}★（相異處）"],
  pharm: ["活性較 Lincomycin {{大|性質|小}}",
    "會引起 [i]Clostridium difficile[/i] 的{{偽膜性腸炎|疾病}}",
    "可使用 {{Vancomycin|藥名}}、{{Metronidazole|藥名}} 治療"] },
{ id: "pr-chloramphenicol", chapter: 23, name: "Chloramphenicol", type: "drug", group: "其他蛋白質抑制劑", source: "統整（二）p.38", img: "assets/medchem/pr-chloramphenicol.png",
  feat: ["唯一具有活性：{{D-threo form|結構}}（1R,2R）",
    "水解產生 α,α-dichloroacetic acid",
    "{{Palmitate|物質}} 鹽類無苦味，可做小兒科用藥",
    "高脂溶性，可入 {{BBB|器官}}"],
  pharm: ["機轉：結合 {{50S|標的}} 抑制 Transpeptidase",
    "CYP450 抑制劑",
    "副作用：{{灰嬰症|副作用}}★、新生兒溶血性貧血",
    "代謝：主要在{{肝臟|器官}}進行 3-O-{{glucuronidation|代謝}}"] },
{ id: "pr-linezolid", chapter: 23, name: "Linezolid", type: "drug", group: "其他蛋白質抑制劑", source: "統整（二）p.38", img: "assets/medchem/pr-linezolid.png",
  feat: ["具有 {{Oxazolidinone|結構}} 基團",
    "具有 {{Morpholine|結構}} 基團"],
  pharm: ["機轉：結合 50S，抑制 {{70S|名詞}} 起始複合物形成",
    "G(+)為主，包含 MRSA、VRE，但對 G(+)無效"] },
{ id: "pr-novobiocin", chapter: 23, name: "Novobiocin", type: "drug", group: "其他蛋白質抑制劑", source: "統整（二）p.39", img: "assets/medchem/pr-novobiocin.png",
  feat: ["含有 {{coumarin|結構}} 結構",
    "醣基：{{Noviose|結構}}、非醣基：Novobiocic acid"],
  pharm: ["機轉：抑制蛋白質及核酸合成，{{抑菌|性質|殺菌}}作用",
    "（抑制 {{DNA gyrase|酵素}} 的β次單元）"] },
{ id: "pr-mupirocin", chapter: 23, name: "Mupirocin", type: "drug", group: "其他蛋白質抑制劑", source: "統整（二）p.39", img: "assets/medchem/pr-mupirocin.png",
  feat: ["含有 {{epoxide|結構}}"],
  pharm: ["機轉：抑制 {{isoleucyl transfer RNA synthase|酵素}}，",
    "干擾 RNA 之合成來抑制蛋白質生成，抑菌作用"] },
{ id: "pr-retapamulin", chapter: 23, name: "Retapamulin", type: "drug", group: "其他蛋白質抑制劑", source: "統整（二）p.39", img: "assets/medchem/pr-retapamulin.png",
  feat: ["半合成之二萜衍生物（{{Pleuromutillins|藥物類別}}）",
    "C₁₄ {{sulfamylacetate|結構}} moiety 對 ribosomal peptidyl transferase 的結合最為重要"],
  pharm: ["機轉：結合 50S 抑制 ribosomal peptidyl transferase，產生抑菌作用",
    "治療 {{MRSA|名詞}}、[i]S. pyrogen[/i] 的原發性膿皰瘡",
    "{{局部|給藥途徑}}使用沒有明顯的吸收"] },
{ id: "pr-dalfopristin", chapter: 23, name: "Dalfopristin", type: "drug", group: "Streptogramin 類", source: "統整（二）p.39", img: "assets/medchem/pr-dalfopristin.png",
  feat: ["Streptogramin {{A|性質|B}}",
    "含有 {{Oxazole|結構}} 結構",
    "兩者併用具{{協同|機轉}}作用"],
  pharm: ["機轉：結合到 {{50S|標的}}★，抑制 {{Translocation|機轉}}",
    "分開使用為{{抑菌|性質|殺菌}}，併用為{{殺菌|性質|抑菌}}作用",
    "（Quinupristin：Dalfopristin=30：70）",
    "{{IV|給藥途徑}} 使用，不進入 BBB，經由膽汁排除",
    "治療 G(+)球菌，對 VRE、MRSA、MRSE 有效",
    "{{CYP3A4|酵素}} 抑制劑",
    "可抑制腸道內細菌叢，使 Digoxin 藥效↑"] },
{ id: "pr-quinupristin", chapter: 23, name: "Quinupristin", type: "drug", group: "Streptogramin 類", source: "統整（二）p.39", img: "assets/medchem/pr-quinupristin.png",
  feat: ["Streptogramin {{B|性質|A}}",
    "兩者併用具{{協同|機轉}}作用"],
  pharm: ["機轉：結合到 {{50S|標的}}★，抑制 {{Translocation|機轉}}",
    "分開使用為{{抑菌|性質|殺菌}}，併用為{{殺菌|性質|抑菌}}作用",
    "（Quinupristin：Dalfopristin=30：70）",
    "{{IV|給藥途徑}} 使用，不進入 BBB，經由膽汁排除",
    "治療 G(+)球菌，對 VRE、MRSA、MRSE 有效",
    "{{CYP3A4|酵素}} 抑制劑",
    "可抑制腸道內細菌叢，使 Digoxin 藥效↑"] },

/* ===== 第 24 章（統整（二）伍 抗黴菌藥物 p.41–46）===== */
/* p.41 的作用位置總覽圖放告示牌；一、影響真菌細胞膜：Polyenes 類、Azoles 類（底下 Imidazole 類藥物／Triazole 類藥物是第三層小標）、
   Allylamine 類及 Tolnaftate（底下 Allylamine 類藥物／non-Allylamine 類藥物）、Morpholine 類；二、細胞壁：Echinocandins 類；
   三、影響真菌代謝、四、影響真菌 DNA 或 RNA 合成 沒有灰底，章節標題就是分類（四的藥物名稱在表頭，每個藥一格）。
   Azoles 底下沒有自己的格子（只有結構樹狀圖和 ※ 註），Allylamine 類及 Tolnaftate 也是（基本結構與 bullet 在知識卡）。
   Imidazole／Triazole 的說明欄沒有欄位名稱，放「說明」（desc）；Ketoconazole 的副作用只放 Ketoconazole；
   Echinocandins 一列三個藥共用的說明三格都放，只講 Caspofungin 的那句只放 Caspofungin；Metronidazole 在第 21 章也有，各自一格。 */

{ id: "fu-nystatin", chapter: 24, name: "Nystatin", type: "drug", group: "Polyenes 類（抗黴菌）", source: "統整（二）p.42", img: "assets/medchem/fu-nystatin.png",
  feat: ["{{4|數值}} 個連續共軛雙鍵",
    "含有 {{Lactone|結構}} 結構"],
  pharm: ["{{第一個|數值}}臨床 Polyene 藥物",
    "毒性大，局部或口服治療{{念珠菌|名詞}}",
    "以乳膏或軟膏劑給藥"] },
{ id: "fu-natamycin", chapter: 24, name: "Natamycin", type: "drug", group: "Polyenes 類（抗黴菌）", source: "統整（二）p.42", img: "assets/medchem/fu-natamycin.png",
  feat: ["4 個連續共軛雙鍵",
    "含有 Lactone、{{Epoxide|結構}} 結構"],
  pharm: ["以 5%{{眼用懸浮液|名詞}}給藥"] },
{ id: "fu-amphotericin", chapter: 24, name: "Amphotericin B", type: "drug", group: "Polyenes 類（抗黴菌）", source: "統整（二）p.42", img: "assets/medchem/fu-amphotericin.png",
  feat: ["{{7|數值}} 個★連續共軛雙鍵（conjugated heptaene）",
    "含有 Lactone、{{mycosamine|結構}} 醣基結構",
    "屬於{{兩性|性質}}物質（amphoteric）"],
  pharm: ["{{IV|給藥途徑}} 注射，用於全身性感染",
    "臨床上使用 {{Glucose|物質}} 進行稀釋",
    "副作用：發燒、低血壓、{{肝毒性|副作用}}"] },
{ id: "fu-econazole", chapter: 24, name: "Econazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.43", img: "assets/medchem/fu-econazole.png",
  desc: ["{{3|數值}} 個 Cl 接在兩個苯環"] },
{ id: "fu-clotrimazole", chapter: 24, name: "Clotrimazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.43", img: "assets/medchem/fu-clotrimazole.png",
  desc: ["具有{{四個|數值}}環狀結構。",
    "廣效型，{{不可|性質|可}}用於全身感染"] },
{ id: "fu-ketoconazole", chapter: 24, name: "Ketoconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.43", img: "assets/medchem/fu-ketoconazole.png",
  desc: ["具有 {{Dioxolan|結構}}、{{Piperazine|結構}} 結構",
    "廣效型，{{CYP3A4|酵素}} 抑制劑",
    "Ketoconazole 會抑制人體{{類固醇|物質}}之生合成",
    "副作用：{{多毛症|副作用}}、{{男性女乳症|副作用}}"] },
{ id: "fu-tioconazole", chapter: 24, name: "Tioconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.43", img: "assets/medchem/fu-tioconazole.png",
  desc: ["Econazole 其中一個苯環換成 Thiazole 雜環"] },
{ id: "fu-miconazole", chapter: 24, name: "Miconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-miconazole.png",
  desc: ["比 Econazole 多接一個 Cl，共 {{4|數值}} 個 Cl"] },
{ id: "fu-oxiconazole", chapter: 24, name: "Oxiconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-oxiconazole.png",
  desc: ["Miconazole 衍生，",
    "具有 4 個 Cl 及 {{Imine|結構}} 結構"] },
{ id: "fu-butoconazole", chapter: 24, name: "Butoconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-butoconazole.png",
  desc: ["將 Econazole 的 {{O|取代基}} 改為 {{S|取代基}}，",
    "且 S 直接與苯環相接"] },
{ id: "fu-sulconazole", chapter: 24, name: "Sulconazole", type: "drug", group: "Imidazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-sulconazole.png",
  desc: ["將 Econazole 的 O 改為 S，",
    "且 S 與苯環隔{{一個 C|數值|兩個 C}}"] },
{ id: "fu-terconazole", chapter: 24, name: "Terconazole", type: "drug", group: "Triazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-terconazole.png",
  desc: ["{{Ketoconazole|藥名}} 的 Imidazole 改為 Triazole",
    "一個 Triazole、一個 Dioxolan、一個 Piperazine"] },
{ id: "fu-itraconazole", chapter: 24, name: "Itraconazole", type: "drug", group: "Triazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-itraconazole.png",
  desc: ["{{兩個|數值|一個}} Triazole★、一個 Dioxolan、一個 Piperazine",
    "{{不易|性質|容易}}進入 BBB，CYP 抑制劑，{{沒有肝毒性|性質|有肝毒性}}"] },
{ id: "fu-posaconazole", chapter: 24, name: "Posaconazole", type: "drug", group: "Triazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-posaconazole.png",
  desc: ["含有 {{Tetrahydrofuran|結構}}，為前兩者的綜合體",
    "可通過 BBB"] },
{ id: "fu-fluconazole", chapter: 24, name: "Fluconazole", type: "drug", group: "Triazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-fluconazole.png",
  desc: ["具有{{兩個|數值}} Triazole 和兩個 F",
    "CYP 抑制劑，長效型可通過 BBB，{{沒有肝毒性|性質|有肝毒性}}★"] },
{ id: "fu-voriconazole", chapter: 24, name: "Voriconazole", type: "drug", group: "Triazole 類藥物", source: "統整（二）p.44", img: "assets/medchem/fu-voriconazole.png",
  desc: ["Fluconazole 一個 Triazole 改為接 F 的 {{Pyrimidine|結構}}",
    "可通過 BBB，副作用為{{視覺障礙|副作用}}"] },
{ id: "fu-naftifine", chapter: 24, name: "Naftifine", type: "drug", group: "Allylamine 類藥物", source: "統整（二）p.45", img: "assets/medchem/fu-naftifine.png",
  desc: ["{{第一個|數值}}上市之 Allylamine 藥物"] },
{ id: "fu-terbinafine", chapter: 24, name: "Terbinafine", type: "drug", group: "Allylamine 類藥物", source: "統整（二）p.45", img: "assets/medchem/fu-terbinafine.png",
  desc: ["局部外用或口服，治療{{灰指甲|疾病}}"] },
{ id: "fu-butenafine", chapter: 24, name: "Butenafine", type: "drug", group: "Allylamine 類藥物", source: "統整（二）p.45", img: "assets/medchem/fu-butenafine.png",
  desc: ["不具完整 Allylamine 結構（接{{苯環|結構}}）",
    "OTC 藥物，較 {{Terbinafine|藥名}} 廣效"] },
{ id: "fu-tolnaftate", chapter: 24, name: "Tolnaftate", type: "drug", group: "non-Allylamine 類藥物", source: "統整（二）p.45", img: "assets/medchem/fu-tolnaftate.png",
  desc: ["除抑制 {{epoxidase|酵素}} 之外，",
    "也可影響細胞膜之結構"] },
{ id: "fu-amorolfine", chapter: 24, name: "Amorolfine", type: "drug", group: "Morpholine 類（非 Squalene epoxidase 抑制劑）", source: "統整（二）p.45", img: "assets/medchem/fu-amorolfine.png",
  feat: ["具有 {{Morpholine|結構}} 環",
    "選擇性抑制 {{Ergosterol|物質}} 生合成路徑之酵素：δ-14-reductase 與 δ-7-δ-8-isomerase"],
  pharm: ["可用來治療{{皮癬|疾病}}"] },
{ id: "fu-caspofungin", chapter: 24, name: "Caspofungin", type: "drug", group: "Echinocandins 類", source: "統整（二）p.45",
  feat: ["{{環狀多肽|結構}}★結構，具有長碳鏈"],
  pharm: ["Caspofungin 由 {{IV|給藥途徑}} 給予，對 {{Candida|名詞}} 和 Aspergillus 較有效，",
    "不可治療 [i]Cryptococcus neoformans[/i]",
    "抑制真菌{{細胞壁|標的}}合成之酵素：{{β-1,3-D-glucan synthase|酵素}}"] },
{ id: "fu-anidulafungin", chapter: 24, name: "Anidulafungin", type: "drug", group: "Echinocandins 類", source: "統整（二）p.45",
  feat: ["{{環狀多肽|結構}}★結構，具有長碳鏈"],
  pharm: ["抑制真菌{{細胞壁|標的}}合成之酵素：{{β-1,3-D-glucan synthase|酵素}}"] },
{ id: "fu-micafungin", chapter: 24, name: "Micafungin", type: "drug", group: "Echinocandins 類", source: "統整（二）p.45",
  feat: ["{{環狀多肽|結構}}★結構，具有長碳鏈"],
  pharm: ["抑制真菌{{細胞壁|標的}}合成之酵素：{{β-1,3-D-glucan synthase|酵素}}"] },
{ id: "fu-aureobasidin", chapter: 24, name: "Aureobasidins A", type: "drug", group: "影響真菌代謝之藥物", source: "統整（二）p.46", img: "assets/medchem/fu-aureobasidin.png",
  desc: ["非競爭抑制細菌代謝酵素：{{Inositol Phosphorylceramide Synthase|酵素}}（IPC 合成酶）",
    "由 [i]Aureobasidium pullulan[/i] 發酵產生"] },
{ id: "fu-pradimycin", chapter: 24, name: "Pradimycins、Benanomycins", short: "Pradimycins", type: "drug", group: "影響真菌代謝之藥物", source: "統整（二）p.46", img: "assets/medchem/fu-pradimycin.png",
  desc: ["屬於 {{Naphthalene quinones|結構}} 結構",
    "{{Ca²⁺|離子}}存在時，會破壞真菌的細胞膜"] },
{ id: "fu-haloprogin", chapter: 24, name: "Haloprogin", type: "drug", group: "影響真菌代謝之藥物", source: "統整（二）p.46", img: "assets/medchem/fu-haloprogin.png",
  desc: ["非專一性擾亂代謝：干擾細胞呼吸作用之{{電子傳遞鏈|名詞}}系統；另外可干擾 DNA 之生合成",
    "具有{{光敏感性|副作用}}，局部使用，也作為外用抗菌劑"] },
{ id: "fu-ciclopirox", chapter: 24, name: "Ciclopirox", type: "drug", group: "影響真菌 DNA 或 RNA 之合成藥物", source: "統整（二）p.46", img: "assets/medchem/fu-ciclopirox.png",
  desc: ["{{Pyridinone|結構}} 類結構",
    "抑制 DNA 與 RNA 之合成",
    "螯合{{多價金屬離子|物質}}，使蛋白酶無法作用",
    "低濃度：抑制{{胺基酸吸收|機轉}}",
    "高濃度：改變細胞膜之結構"] },
{ id: "fu-flucytosine", chapter: 24, name: "Flucytosine", type: "drug", group: "影響真菌 DNA 或 RNA 之合成藥物", source: "統整（二）p.46", img: "assets/medchem/fu-flucytosine.png",
  desc: ["經 {{Cytosine deaminase|酵素}}★代謝為 {{5-FU|代謝物}}，抑制 {{thymidylate synthase|酵素}}★"] },
{ id: "fu-griseofulvin", chapter: 24, name: "Griseofulvin", type: "drug", group: "影響真菌 DNA 或 RNA 之合成藥物", source: "統整（二）p.46", img: "assets/medchem/fu-griseofulvin.png",
  desc: ["具有{{甲氧基|結構}}",
    "與 {{RNA|標的}} 及{{微管|標的}}結合"] },
{ id: "fu-metronidazole", chapter: 24, name: "Metronidazole", type: "drug", group: "影響真菌 DNA 或 RNA 之合成藥物", source: "統整（二）p.46", img: "assets/medchem/fu-metronidazole.png",
  desc: ["含有 {{imidazole|結構}} 結構",
    "和 DNA 結合，破壞 DNA 結構"] },

/* ===== 第 25 章（統整（二）陸 抗結核桿菌、抗麻風、抗瘧疾與驅蟲藥物 p.47–54）===== */
/* 沒有黑底，各表格的灰底（第一線用藥、第二線用藥、抗痲瘋用藥、金雞納生物鹼、Polycyclics、4-/8-Aminoquinolines、混合療法、新型藥物、抗原蟲藥物、驅蠕蟲藥物）各自就是分類；
   「第一線用藥」「第二線用藥」「新型藥物」加後綴避免之後重名。p.47–48、p.51–52 的欄位是特性／藥理及臨床應用；p.49–50 的表格沒有欄位名稱（藥物名稱與結構在左、文字在右）、
   p.54 的文字在結構下方，都放「說明」（desc）；p.53 欄位是特性。
   講義一列合併的藥（Sulfadoxine+Pyrimethamine、Atovaquone+Proguanil）每個藥各一格，只放屬於它的句子；Cycloguanil 是 Proguanil 的活性代謝物，結構與說明單獨一格。
   Doxycycline／Streptomycin／Kanamycin／Cycloserine／Fluoroquinolones／Metronidazole 在前面的章節也出現，這裡各自一格（id 前綴不同）。
   p.54「其他驅蟲藥物」（Niclosamide／Oxamnique／Levamisole）沒有結構，放驅蠕蟲藥物的知識卡。 */

{ id: "tb-isoniazid", chapter: 25, name: "Isoniazid（INH）", short: "Isoniazid", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.47", img: "assets/medchem/tb-isoniazid.png",
  feat: ["具有 {{Pyridine|結構}} 環",
    "→ 接上 γ/[i]para[/i]-CONHNH₂ 時活性最大",
    "代謝：主要代謝物為 {{N-Acetylisoniazid|代謝物}}★",
    "再變成 Acetylhydrazide 產生{{乙醯自由基|代謝物}}★，造成{{肝毒性|副作用}}"],
  pharm: ["機轉：影響{{細胞壁|標的}}★成分 {{Mycolic acid|物質}}★之合成",
    "{{Prodrug|名詞}}，需經 {{Catalase|酵素}}（katG 基因）產生活性產物",
    "Isonicotinaldehyde、Isonicotinic acid、Isonicotinamide",
    "→ 抗藥性：InhA 或 katG 基因突變",
    "{{CYP450|酵素}} 抑制劑",
    "副作用：肝毒性、{{周邊神經炎|副作用}}、Lupus-like syndrome"] },
{ id: "tb-pyrazinamide", chapter: 25, name: "Pyrazinamide（PZA）", short: "Pyrazinamide", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.47", img: "assets/medchem/tb-pyrazinamide.png",
  feat: ["{{Nicotinamide|藥名}} 的 {{Pyrazine|結構}} 類似物★",
    "需在{{酸性|性質|鹼性}}★環境下作用"],
  pharm: ["機轉：{{不影響|性質|影響}} Mycolic acid 合成，只殺{{半休眠|性質}}的菌",
    "需經 {{Pyrazinamidase|酵素}}（pncA 基因）活化，水解產生活性產物 Pyrazinoic acid",
    "副作用：肝毒性、影響{{尿酸|物質}}排泄"] },
{ id: "tb-rifampin", chapter: 25, name: "Rifampin（RIF）", short: "Rifampin", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.47", img: "assets/medchem/tb-rifampin.png",
  feat: ["具有 {{Naphthalene|結構}}★結構",
    "代謝：主要於 {{C₂₅|位置}} 進行 {{Deacetylation|代謝}}★"],
  pharm: ["機轉：選擇性結合 {{DNA-dependent RNA 聚合酶|標的}}★，阻斷結核桿菌之 RNA 合成",
    "CYP450 之強力{{誘導劑|機轉|抑制劑}}★",
    "口服吸收佳，為廣效殺菌劑",
    "副作用：肝毒性、{{流感症狀|副作用}}、{{橘紅色尿液|副作用}}"] },
{ id: "tb-rifapentine", chapter: 25, name: "Rifapentine（RPT）", short: "Rifapentine", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.48", img: "assets/medchem/tb-rifapentine.png",
  feat: ["代謝：主要於 C₂₅ 進行 Deacetylation"],
  pharm: ["機轉：選擇性結合 DNA-dependent RNA 聚合酶★，阻斷結核桿菌之 RNA 合成",
    "與血漿蛋白有{{高度|性質|低度}}結合，作用時間長",
    "可用{{肝功能不全|疾病}}患者"] },
{ id: "tb-ethambutol", chapter: 25, name: "Ethambutol（EMB）", short: "Ethambutol", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.48", img: "assets/medchem/tb-ethambutol.png",
  feat: ["{{右旋|結構|左旋}}活性較消旋高 16 倍；",
    "(+)-enantiomer 活性較(-)的高 200 倍"],
  pharm: ["機轉：抑制 {{Arabinosyltransferase|酵素}}★，來抑制細胞壁合成，可殺死{{生長中|性質|半休眠}}的桿菌",
    "副作用：{{視神經炎|副作用}}★、影響{{尿酸|物質}}排泄"] },
{ id: "tb-streptomycin", chapter: 25, name: "Streptomycin（STM）", short: "Streptomycin", type: "drug", group: "第一線用藥（抗結核）", source: "統整（二）p.48", img: "assets/medchem/tb-streptomycin.png",
  feat: ["非 {{Deoxystreptamine|結構}} 的胺醣類藥物",
    "具有 {{Guanidine|結構}}（鹼性）、Streptose 結構",
    "代謝：由細菌的 {{Adenyltransferase|酵素}}、Phosphotransferase 於 {{O-3|位置}} 位置代謝"],
  pharm: ["機轉：干擾 tRNA 與核糖體 {{30S|標的}} 結合",
    "副作用：{{耳毒性|副作用}}",
    "→ 若結構中的醛基還原成醇基，會使耳毒性↑"] },
{ id: "tb-ethionamide", chapter: 25, name: "Ethionamide", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-ethionamide.png",
  desc: ["機轉：抑制 {{inhA enoy reductase|酵素}}",
    "副作用：{{肝毒性|副作用}}"] },
{ id: "tb-pas", chapter: 25, name: "[i]p[/i]-Aminosalicylic acid", short: "PAS", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-pas.png",
  desc: ["結構與 {{PABA|物質}} 類似",
    "機轉：阻止 {{dihydrofolate synthase|酵素}} 催化",
    "副作用：肝毒性",
    "代謝位置：{{OH 基|取代基}}"] },
{ id: "tb-cycloserine", chapter: 25, name: "Cycloserine", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-cycloserine.png",
  desc: ["機轉：競爭抑制 {{D-Alanine-D-Alanine|標的}} 的 racemase 與 ligase★，來抑制{{細胞壁|標的}}生成",
    "副作用：影響 {{GABA|物質}} 代謝，干擾 {{CNS|器官}} 作用"] },
{ id: "tb-capreomycin", chapter: 25, name: "Capreomycin", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-capreomycin.png",
  desc: ["由 {{4|數值}} 個★{{Cyclic peptides|結構}} 組成之結構",
    "副作用：肝腎毒性、{{聽力受損|副作用}}"] },
{ id: "tb-kanamycin", chapter: 25, name: "Kanamycin", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-kanamycin.png",
  desc: ["機轉：與核糖體 30S {{不可逆|性質|可逆}}結合",
    "Kanamycin {{B|性質|A}} 活性較大，但市售為 {{A|性質|B}}",
    "副作用：{{腎毒性|副作用}}、耳毒性"] },
{ id: "tb-fq", chapter: 25, name: "Fluoroquinolones", type: "drug", group: "第二線用藥（抗結核）", source: "統整（二）p.49", img: "assets/medchem/tb-fq.png",
  desc: ["{{Fluorinated|結構}}★ quinolones 為必要結構",
    "與 {{DNA gyrase|酵素}} 結合",
    "（結構可往前複習）"] },
{ id: "tb-dapsone", chapter: 25, name: "Dapsone（DDS）", short: "Dapsone", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-dapsone.png",
  desc: ["機轉：與 {{PABA|物質}} 競爭，抑制{{葉酸|物質}}形成",
    "→ 與 [i]p[/i]-aminobenzoic acid 併用活性↓",
    "含有 {{Sulfone|結構}} 結構，弱鹼性藥物",
    "口服，具抗發炎作用"] },
{ id: "tb-sulfoxone", chapter: 25, name: "Sulfoxone sodium", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-sulfoxone.png",
  desc: ["{{Prodrug|名詞}}，代謝成為 {{Dapsone|藥名}}",
    "DDS 加上 {{methanesulfinate|取代基}} 取代基",
    "機轉：與 PABA 競爭，抑制葉酸形成"] },
{ id: "tb-thiazolsulfone", chapter: 25, name: "Thiazolsulfone", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-thiazolsulfone.png",
  desc: ["DDS 之 Isosteric，含有 {{Thiazole|結構}} 雜環",
    "活性較 DDS {{低|性質|高}}",
    "機轉：與 PABA 競爭，抑制葉酸形成"] },
{ id: "tb-acetosulfone", chapter: 25, name: "Acetosulfone", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-acetosulfone.png",
  desc: ["DDS 之衍生物",
    "{{水溶性增加|性質}}，但活性下降",
    "機轉：與 PABA 競爭，抑制葉酸形成"] },
{ id: "tb-clofazimine", chapter: 25, name: "Clofazimine", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-clofazimine.png",
  desc: ["含有 {{Phenazine|結構}}★、{{Imine|結構}} 結構（必要）",
    "C₃、N₁₀ 的苯環{{對位|位置}}有鹵素取代，使活性↑",
    "→ 活性大小：{{Br|取代基}} > Cl > F ★",
    "有抗發炎、免疫抑制的作用",
    "副作用：{{皮膚色素沉澱|副作用}}"] },
{ id: "tb-thalidomide", chapter: 25, name: "Thalidomide", type: "drug", group: "抗麻風用藥", source: "統整（二）p.50", img: "assets/medchem/tb-thalidomide.png",
  desc: ["具有 {{Glutarimide|結構}} 結構",
    "機轉：抑制 {{TNF-α|標的}}、血管新生",
    "治療多發性骨髓瘤、{{痲瘋結節性紅斑|疾病}}"] },
{ id: "tb-quinine", chapter: 25, name: "Quinine", type: "drug", group: "金雞納生物鹼（Cinchona Alkaloids）", source: "統整（二）p.51", img: "assets/medchem/tb-quinine.png",
  feat: ["立體組態：3R、4S、8S、9R（{{四個|數值}}★）",
    "具有 {{Quinuclidine|結構}}、{{Quinoline|結構}} 環★"],
  pharm: ["{{第一個|數值}}抗瘧疾藥物",
    "Vinyl 基還原形成 {{Dihydroquinine|代謝物}}，具顯著毒性"] },
{ id: "tb-quinidine", chapter: 25, name: "Quinidine", type: "drug", group: "金雞納生物鹼（Cinchona Alkaloids）", source: "統整（二）p.51", img: "assets/medchem/tb-quinidine.png",
  feat: ["立體組態：3R、4S、8R、9S",
    "具有 Quinuclidine、Quinoline 環★"],
  pharm: ["殺{{裂質體|名詞}}",
    "金雞納中毒：{{QT 延長|副作用}}、Lupus-like、{{血小板減少|副作用}}"] },
{ id: "tb-doxycycline", chapter: 25, name: "Doxycycline", type: "drug", group: "Polycyclics", source: "統整（二）p.51", img: "assets/medchem/tb-doxycycline.png",
  feat: ["{{四環素|藥物類別}}類結構（可往前複習）"],
  pharm: ["機轉：結合到核糖體 {{30S|標的}} 上",
    "腎功能異常病人可用（由{{膽汁|器官}}排除）"] },
{ id: "tb-halofantrine", chapter: 25, name: "Halofantrine", type: "drug", group: "Polycyclics", source: "統整（二）p.51", img: "assets/medchem/tb-halofantrine.png",
  feat: ["具有 {{Phenanthrene|結構}} 結構",
    "外消旋化合物"],
  pharm: ["口服",
    "由 {{CYP3A4|酵素}} 代謝為 Desbutylhalofantrine 更具活性"] },
{ id: "tb-lumefantrine", chapter: 25, name: "Lumefantrine", type: "drug", group: "Polycyclics", source: "統整（二）p.51", img: "assets/medchem/tb-lumefantrine.png",
  feat: ["{{Halofantrine|藥名}} 衍生物"],
  pharm: ["殺紅血球內{{裂質體|名詞}}有效",
    "與 {{Artemether|藥名}} 併用治療多重抗藥惡性瘧疾"] },
{ id: "tb-quinacrine", chapter: 25, name: "Quinacrine", type: "drug", group: "4-Aminoquinolines", source: "統整（二）p.52", img: "assets/medchem/tb-quinacrine.png",
  feat: ["含有 {{Acridine|結構}} 結構（三環）"],
  pharm: ["與瘧原蟲 {{DNA|標的}} 相嵌"] },
{ id: "tb-chloroquine", chapter: 25, name: "Chloroquine", type: "drug", group: "4-Aminoquinolines", source: "統整（二）p.52", img: "assets/medchem/tb-chloroquine.png",
  feat: ["具有 Quinoline 環"],
  pharm: ["與瘧原蟲 DNA 相嵌，並抑制 {{Biocrystallization|機轉}}、{{FPIX|物質}}累積",
    "免疫抑制劑"] },
{ id: "tb-mefloquine", chapter: 25, name: "Mefloquine", type: "drug", group: "4-Aminoquinolines", source: "統整（二）p.52", img: "assets/medchem/tb-mefloquine.png",
  feat: ["具有 Quinoline 環",
    "C₄ 接有 {{Piperidine|結構}}★雜環",
    "有 {{CF₃|取代基}} 取代"],
  pharm: ["與瘧原蟲 DNA 相嵌，並抑制 Biocrystallization、FPIX 累積，治療對 {{Chloroquine|藥名}} 具抗藥性的瘧原蟲",
    "僅{{口服|給藥途徑}}使用，經 CYP3A4 代謝"] },
{ id: "tb-primaquine", chapter: 25, name: "Primaquine", type: "drug", group: "8-Aminoquinolines", source: "統整（二）p.52", img: "assets/medchem/tb-primaquine.png",
  feat: ["具有{{一級胺|結構}}側鏈★",
    "C₆ 具有{{甲氧基|取代基}}取代★",
    "8-amino 產生活性 {{ROS|物質}}，干擾瘧原蟲粒線體"],
  pharm: ["{{G6PD 缺乏|疾病}}不可使用，會造成{{溶血性貧血|副作用}}",
    "經 CYP3A4 代謝"] },
{ id: "tb-tafenoquine", chapter: 25, name: "Tafenoquine", type: "drug", group: "8-Aminoquinolines", source: "統整（二）p.52", img: "assets/medchem/tb-tafenoquine.png",
  feat: ["具有{{一級胺|結構}}側鏈★",
    "C₆ 具有{{甲氧基|取代基}}取代★",
    "8-amino 產生活性 {{ROS|物質}}，干擾瘧原蟲粒線體"],
  pharm: ["可用於 {{Erythrocytic|名詞}} 階段與對 Chloroquine 產生抗藥性之瘧原蟲"] },
{ id: "tb-sulfadoxine", chapter: 25, name: "Sulfadoxine", type: "drug", group: "混合療法（Fixed Combination）", source: "統整（二）p.53", img: "assets/medchem/tb-sulfadoxine.png",
  feat: ["抑制 {{DHFR|酵素}}"] },
{ id: "tb-pyrimethamine", chapter: 25, name: "Pyrimethamine", type: "drug", group: "混合療法（Fixed Combination）", source: "統整（二）p.53", img: "assets/medchem/tb-pyrimethamine.png",
  feat: ["抑制{{葉酸|物質}}還原成活性的 {{Tetrahydrofolate|物質}} 形式"] },
{ id: "tb-atovaquone", chapter: 25, name: "Atovaquone", type: "drug", group: "混合療法（Fixed Combination）", source: "統整（二）p.53", img: "assets/medchem/tb-atovaquone.png",
  feat: ["選擇性抑制粒腺體內{{電子傳遞鏈|名詞}}系統，也能抑制 {{Ubiquinone reductase|酵素}}★"] },
{ id: "tb-proguanil", chapter: 25, name: "Proguanil", type: "drug", group: "混合療法（Fixed Combination）", source: "統整（二）p.53", img: "assets/medchem/tb-proguanil.png",
  feat: ["經 {{CYP2C19|酵素}} 代謝成活性態 {{Cycloguanil|代謝物}}★，抑制 DHFR"] },
{ id: "tb-cycloguanil", chapter: 25, name: "Cycloguanil", type: "drug", group: "混合療法（Fixed Combination）", source: "統整（二）p.53", img: "assets/medchem/tb-cycloguanil.png",
  feat: ["具有 {{Triazene|結構}} 結構，但沒有 {{Guanidine|結構}} 結構★"] },
{ id: "tb-artemisinin", chapter: 25, name: "Artemisinins", type: "drug", group: "新型藥物（抗瘧疾）", source: "統整（二）p.53", img: "assets/medchem/tb-artemisinin.png",
  feat: ["從{{青蒿素|藥名}}分離而來",
    "藥效基團：{{Endoperoxide|結構}}★（O-O）",
    "具有 1,2,4-Trioxane 或 1,2-Dioxane 結構",
    "機轉：親脂性藥物，活化後產生{{自由基|代謝物}}★破壞細胞膜"] },
{ id: "tb-fosmidomycin", chapter: 25, name: "Fosmidomycin", type: "drug", group: "新型藥物（抗瘧疾）", source: "統整（二）p.53", img: "assets/medchem/tb-fosmidomycin.png",
  feat: ["臨床試驗進行中",
    "抑制 {{DOXP|酵素}}（1-Deoxy-D-xylulose-5-phosphate reductoisomerase）"] },
{ id: "tb-melarsoprol", chapter: 25, name: "Melarsoprol", type: "drug", group: "抗原蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-melarsoprol.png",
  desc: ["具有{{三價砷|物質}}原子"] },
{ id: "tb-metronidazole", chapter: 25, name: "Metronidazole", type: "drug", group: "抗原蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-metronidazole.png",
  desc: ["{{NO₂|取代基}} 經 Reduction 產生活性"] },
{ id: "tb-ddt", chapter: 25, name: "Chlorphenothane（DDT）", short: "DDT", type: "drug", group: "抗原蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-ddt.png",
  desc: ["含{{氯|物質}}碳氫之化合物"] },
{ id: "tb-diloxanide", chapter: 25, name: "Diloxanide", type: "drug", group: "抗原蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-diloxanide.png",
  desc: ["治療{{阿米巴原蟲|名詞}}感染"] },
{ id: "tb-mebendazole", chapter: 25, name: "Mebendazole", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-mebendazole.png",
  desc: ["具有 {{Benzimidazole|結構}} 雜環",
    "可抑制{{葡萄糖通道|標的}}及{{微管聚合|機轉}}"] },
{ id: "tb-thiabendazole", chapter: 25, name: "Thiabendazole", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-thiabendazole.png",
  desc: ["具有 Benzimidazole、{{Thiazole|結構}}★雜環",
    "可抑制 {{Fumarate 還原酶|酵素}}及微管聚合"] },
{ id: "tb-eflornithine", chapter: 25, name: "Eflornithine", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-eflornithine.png",
  desc: ["不可逆抑制 {{Ornithine decarboxylase|酵素}}",
    "治療{{錐蟲病|疾病}}"] },
{ id: "tb-ivermectin", chapter: 25, name: "Ivermectin", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-ivermectin.png",
  desc: ["{{GABA 致效劑|機轉}}★，使蟲體麻痺",
    "治療{{蟯尾絲蟲病|疾病}}"] },
{ id: "tb-pentamidine", chapter: 25, name: "Pentamidine", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-pentamidine.png",
  desc: ["抑制 {{Topoisomerase|酵素}}，也可結合 DNA",
    "治療{{肺囊蟲肺炎|疾病}}"] },
{ id: "tb-praziquantel", chapter: 25, name: "Praziquantel", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-praziquantel.png",
  desc: ["具有 {{Isoquinoline|結構}}★結構",
    "治療{{血吸蟲|名詞}}、肝吸蟲病之最佳藥物",
    "可增加 {{Ca²⁺|離子}} 穿透細胞膜"] },
{ id: "tb-pyrantel", chapter: 25, name: "Pyrantel", type: "drug", group: "驅蠕蟲藥物", source: "統整（二）p.54", img: "assets/medchem/tb-pyrantel.png",
  desc: ["機轉為{{去極化型神經肌肉阻斷劑|機轉}}★",
    "治療{{蛔蟲病|疾病}}"] },

/* ===== 第 28 章（統整（二）玖 外用抗感染劑與防腐劑 p.94–96；p.96 是講義版權頁）===== */
/* 沒有黑底，表格的灰底（酚性化合物、鹵素化合物、氧化性化合物、界面活性劑、製劑用防腐劑）各自就是分類；表格沒有欄位名稱，結構下方的文字放「說明」（desc）。
   Methylparaben／Propylparaben 講義共用一格說明，兩格都放。Haloprogin 在第 24 章（抗黴菌）也有，這裡另有一格。
   這章沒有總說明或 ※ 註，所以沒有知識告示牌內容。 */

{ id: "tp-hexachlorophene", chapter: 28, name: "Hexachlorophene", type: "drug", group: "酚性化合物（Phenolic compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-hexachlorophene.png",
  desc: ["2,2'-Methylenebis-(3,4,6-trichlorophenol)★"] },
{ id: "tp-hexylresorcinol", chapter: 28, name: "Hexylresorcinol", type: "drug", group: "酚性化合物（Phenolic compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-hexylresorcinol.png",
  desc: ["{{Resorcinol|藥名}} 衍生物"] },
{ id: "tp-cresol", chapter: 28, name: "[i]p[/i]-Cresol", type: "drug", group: "酚性化合物（Phenolic compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-cresol.png",
  desc: ["{{酚類|藥物類別}}化合物"] },
{ id: "tp-eugenol", chapter: 28, name: "Eugenol", type: "drug", group: "酚性化合物（Phenolic compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-eugenol.png",
  desc: ["4-allyl-2-methoxyphenol",
    "{{丁香油酚|藥名}}，有局部{{麻醉|用途}}和防腐作用"] },
{ id: "tp-halazone", chapter: 28, name: "Halazone", type: "drug", group: "鹵素化合物（Halogen compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-halazone.png",
  desc: ["於水中釋出{{次氯酸|代謝物}} HOCl 而有殺菌作用"] },
{ id: "tp-haloprogin", chapter: 28, name: "Haloprogin", type: "drug", group: "鹵素化合物（Halogen compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-haloprogin.png",
  desc: ["含 {{Cl|取代基}}、{{I|取代基}} 原子，對{{光|性質}}敏感，局部使用可抗黴菌"] },
{ id: "tp-povidone", chapter: 28, name: "Povidone-Iodine", type: "drug", group: "鹵素化合物（Halogen compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-povidone.png",
  desc: ["由{{碘|物質}}和 PVP 形成之{{水溶性|性質|脂溶性}}★聚合物"] },
{ id: "tp-benzoyl", chapter: 28, name: "Benzoyl peroxide", type: "drug", group: "氧化性化合物（Oxidative compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-benzoyl.png",
  desc: ["用於{{面皰|疾病}}之{{角質溶解劑|用途}}"] },
{ id: "tp-ethyleneoxide", chapter: 28, name: "Ethylene oxide", type: "drug", group: "氧化性化合物（Oxidative compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-ethyleneoxide.png",
  desc: ["{{氣體|性質}}消毒劑，常和 {{CO₂|物質}} 混用避免爆炸"] },
{ id: "tp-carbamide", chapter: 28, name: "Carbamide solution", type: "drug", group: "氧化性化合物（Oxidative compounds）", source: "統整（二）p.94", img: "assets/medchem/tp-carbamide.png",
  desc: ["主要成分為 {{Hydrogen peroxide|物質}} + {{Urea|物質}}★"] },
{ id: "tp-nonoxynol", chapter: 28, name: "Nonoxynol-9", type: "drug", group: "界面活性劑", source: "統整（二）p.95", img: "assets/medchem/tp-nonoxynol.png",
  desc: ["{{非離子型|性質|陽離子型}}界面活性劑，可作為{{殺精子|用途}}之避孕劑"] },
{ id: "tp-cetylpyridinium", chapter: 28, name: "Cetylpyridinium chloride", type: "drug", group: "界面活性劑", source: "統整（二）p.95", img: "assets/medchem/tp-cetylpyridinium.png",
  desc: ["{{陽離子型|性質|非離子型}}界面活性劑"] },
{ id: "tp-chlorohexidine", chapter: 28, name: "Chlorohexidine", type: "drug", group: "界面活性劑", source: "統整（二）p.95", img: "assets/medchem/tp-chlorohexidine.png",
  desc: ["{{Biguanides|結構}}★官能基有抗菌作用，似陽離子型界面活性劑"] },
{ id: "tp-benzalkonium", chapter: 28, name: "Benzalkonium chloride", type: "drug", group: "界面活性劑", source: "統整（二）p.95", img: "assets/medchem/tp-benzalkonium.png",
  desc: ["n = 8, 10, 12, 14, 16, 18",
    "{{陽離子型|性質|非離子型}}界面活性劑"] },
{ id: "tp-benzethonium", chapter: 28, name: "Benzethonium chloride", type: "drug", group: "界面活性劑", source: "統整（二）p.95", img: "assets/medchem/tp-benzethonium.png",
  desc: ["{{陽離子型|性質|非離子型}}界面活性劑"] },
{ id: "tp-chlorobutanol", chapter: 28, name: "Chlorobutanol", type: "drug", group: "製劑用防腐劑", source: "統整（二）p.95", img: "assets/medchem/tp-chlorobutanol.png",
  desc: ["{{pH<5|性質|pH>8}} 安定，常在{{注射劑|名詞}}、眼鼻用製劑作為防腐劑"] },
{ id: "tp-methylparaben", chapter: 28, name: "Methylparaben", type: "drug", group: "製劑用防腐劑", source: "統整（二）p.95", img: "assets/medchem/tp-methylparaben.png",
  desc: ["結構屬於 Esters of [i]para[/i]-hydroxylbenzoic acid★，差別在於{{酯類的碳數|結構}}"] },
{ id: "tp-propylparaben", chapter: 28, name: "Propylparaben", type: "drug", group: "製劑用防腐劑", source: "統整（二）p.95", img: "assets/medchem/tp-propylparaben.png",
  desc: ["結構屬於 Esters of [i]para[/i]-hydroxylbenzoic acid★，差別在於{{酯類的碳數|結構}}"] },

/* ===== 第 27 章（統整（二）捌 抗病毒藥物 p.80–93）===== */
/* p.80 的抗病毒藥物總覽、抗反轉錄病毒藥物兩張表，p.88 的 B 型肝炎與 C 型肝炎藥物治療表，都是沒有分類的總說明，放告示牌（表格每個大類別的藥名分別放在藥物格子裡）；
   一、流感病毒：灰底 M₂ 抑制劑、神經胺酶抑制劑；二、融合抑制劑沒有灰底，章節標題就是分類；三、核酸複製：灰底非環狀核苷類似物、傳統核苷類似物、非核苷類似物（加「抗病毒」避免和之後的章重名）、影響核酸轉譯藥物；
   四、HIV：灰底 NRTIs、NNRTIs、HIV 嵌合酶抑制劑、HIV 蛋白酶抑制劑。p.85 的三個 B／C 肝病毒藥物（Adefovir、Entecavir、Famciclovir）屬於 p.84 的非環狀核苷類似物灰底。
   各灰底標題後面的說明（阻斷病毒脫殼…、字尾 -navir）放該分類的知識卡；Adamantane 與 Sialic acid 骨架結構圖放知識卡；Fomivirsen 沒有結構圖，結構（寡核苷酸序列）放「說明」；
   Atazanavir／Tipranavir／Darunavir 的文字在結構下方，放「說明」；Acyclovir／Cidofovir／Adefovir 特性欄附的小結構（Deoxyguanosine、Cytosine、Adenine）當附圖。 */

{ id: "av-amantadine", chapter: 27, name: "Amantadine", type: "drug", group: "M₂ 抑制劑（M₂ inhibitors）：阻斷病毒脫殼釋放 RNA", source: "統整（二）p.81", img: "assets/medchem/av-amantadine.png",
  feat: ["接上 NH₂（{{一級胺|結構}}★）",
    "結構具有{{對稱性|性質}}★"],
  pharm: ["抑制 RNA 病毒穿透細胞",
    "有效{{預防和治療 A 型流感|用途}}",
    "對 B 型流感、腺病毒、呼吸道融合細胞病毒 RSV {{無效|性質|有效}}",
    "也可用於治療{{帕金森氏症|疾病}}",
    "口服吸收好，{{酸化尿液|性質}}★可加速鹼性藥物的排泄",
    "副作用：可穿過 BBB，可能造成嚴重 CNS 症狀（{{幻覺|副作用}}）"] },
{ id: "av-rimantadine", chapter: 27, name: "Rimantadine", type: "drug", group: "M₂ 抑制劑（M₂ inhibitors）：阻斷病毒脫殼釋放 RNA", source: "統整（二）p.81", img: "assets/medchem/av-rimantadine.png",
  feat: ["接上 CH₂(NH₂)CH₃"],
  pharm: ["抑制反轉錄酶或病毒合成特定 RNA，不會抑制病毒的附著或穿透",
    "治療大部分 A 型流感病毒，對 B 型流感無效",
    "副作用：{{不易|性質|容易}}通過 BBB，CNS 副作用較 Amantadine {{少|性質|多}}"] },
{ id: "av-zanamivir", chapter: 27, name: "Zanamivir（Relenza®）", short: "Zanamivir", type: "drug", group: "神經胺酶抑制劑（Neuraminidase inhibitors）", source: "統整（二）p.82", img: "assets/medchem/av-zanamivir.png",
  feat: ["具有 {{Pyran|結構}}★結構",
    "C₄ 具有 {{guanidine|結構}}★基團：取代 DNA 的 OH 基，提高與 NA 的專一性結合",
    "C₆ 有 glycerol 側鏈"],
  pharm: ["利用{{吸入|給藥途徑}}★方式給藥"] },
{ id: "av-oseltamivir", chapter: 27, name: "Oseltamivir（Tamiflu®）", short: "Oseltamivir", type: "drug", group: "神經胺酶抑制劑（Neuraminidase inhibitors）", source: "統整（二）p.82", img: "assets/medchem/av-oseltamivir.png",
  feat: ["具有 {{Cyclohexane|結構}}★環狀結構",
    "C₄ 有 NH₂：取代 DNA 的 OH 基，提高與 NA 的專一性結合",
    "C₆ 有 3-Pentyloxy 側鏈：與 NA 有最大結合"],
  pharm: ["第一個用於{{口服|給藥途徑}}的 NA 抑制劑★",
    "{{Prodrug|名詞}}★，水解酯基變成酸基",
    "代謝：將末端 C 氧化成{{羧基|結構}}"] },
{ id: "av-peramivir", chapter: 27, name: "Peramivir（Rapiacta®）", short: "Peramivir", type: "drug", group: "神經胺酶抑制劑（Neuraminidase inhibitors）", source: "統整（二）p.82", img: "assets/medchem/av-peramivir.png",
  feat: ["具有 {{Cyclopentane|結構}}★五元環結構",
    "C₄ 有 guanidine：取代 DAN 的 OH 基，提高與 NA 的專一性結合",
    "C₆ 不含 glycerol 側鏈：口服生體可用率較低"],
  pharm: ["{{IV|給藥途徑}} 注射",
    "當其他抗病毒藥都無法治療，才用來治療嚴重 H1N1 感染"] },
{ id: "av-enfuvirtide", chapter: 27, name: "Enfuvirtide", type: "drug", group: "融合抑制劑（Fusion Inhibitors）：治療 HIV 病毒", source: "統整（二）p.83", img: "assets/medchem/av-enfuvirtide.png",
  feat: ["{{36|數值}} 個胺基酸組成之寡肽鏈",
    "與血漿蛋白結合力高"],
  pharm: ["治療 HIV-1 病毒，對 HIV-2 無效",
    "模仿 {{gp41|標的}} 的 HR-2 片段，阻礙螺旋束形成，抑制 HIV-1 病毒融合進入 {{CD4⁺ T 細胞|器官}}"] },
{ id: "av-maraviroc", chapter: 27, name: "Maraviroc", type: "drug", group: "融合抑制劑（Fusion Inhibitors）：治療 HIV 病毒", source: "統整（二）p.83", img: "assets/medchem/av-maraviroc.png",
  feat: ["含有 {{amide|結構}} 及 {{triazole|結構}} 結構"],
  pharm: ["治療 HIV-1 病毒，對 HIV-2 無效",
    "機轉：{{CCR5|受體}} 拮抗劑（CCR5 為 HIV 病毒進入 CD4 細胞的輔助受器）",
    "需併用其他抗反轉錄病毒藥物",
    "屬於 {{P-gp|標的}} 受質，生體可用率低"] },
{ id: "av-acyclovir", chapter: 27, name: "Acyclovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.84", img: "assets/medchem/av-acyclovir.png", imgMore: ["assets/medchem/av-deoxyguanosine.png"],
  feat: ["{{Deoxyguanosine|藥名}} 之合成類似物"],
  pharm: ["經 {{Viral thymidine kinase|酵素}} 活化成 Acyclo-GTP",
    "治療 HSV-1、HSV-2、VZV、EBV※",
    "對 CMV（巨細胞病毒）較無敏感性",
    "代謝物為{{無活性|性質|有活性}}★ 9-carboxymethoxymethylguanine"] },
{ id: "av-valacyclovir", chapter: 27, name: "Valacyclovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.84", img: "assets/medchem/av-valacyclovir.png",
  feat: ["{{Acyclovir|藥名}} 之{{前驅藥|名詞}}★：",
    "5-OH 被 {{Valine|結構}} 取代"],
  pharm: ["{{Prodrug|名詞}}，需水解酯鍵形成 {{Acyclovir|藥名}}★",
    "對 Thymidine kinase 有較高親和力，口服吸收較佳，也可治療 {{CMV|名詞}}"] },
{ id: "av-ganciclovir", chapter: 27, name: "Ganciclovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.84", img: "assets/medchem/av-ganciclovir.png",
  feat: ["Acyclovir 之類似物：",
    "多了一個 {{CH₂OH|取代基}} 基"],
  pharm: ["需磷酸化成 Ganciclovir triphosphate 才有活性",
    "治療愛滋病人 {{CMV|名詞}} 視網膜炎",
    "治療 CMV 時不需要磷酸化",
    "對人體的毒性較 Acyclovir {{大|性質|小}}"] },
{ id: "av-cidofovir", chapter: 27, name: "Cidofovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.84", img: "assets/medchem/av-cidofovir.png", imgMore: ["assets/medchem/av-cytosine.png"],
  feat: ["{{Cytosine|結構}} 類似物",
    "含有{{磷酸根|結構}}"],
  pharm: ["抑制 DNA polymerase 干擾 DNA 合成與病毒複製",
    "治療愛滋病人 CMV 視網膜炎",
    "具有{{腎毒性|副作用}}"] },
{ id: "av-adefovir", chapter: 27, name: "Adefovir dipivoxil", short: "Adefovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.85", img: "assets/medchem/av-adefovir.png", imgMore: ["assets/medchem/av-adenine.png"],
  feat: ["含有 {{Adenine|結構}} 結構"],
  pharm: ["{{Prodrug|名詞}}，需水解成 Adefovir",
    "經 {{Adenylate kinase|酵素}} 磷酸化為 Adefovir phosphate，嵌入病毒 DNA 中止複製",
    "治療 {{B 型肝炎|疾病}}"] },
{ id: "av-entecavir", chapter: 27, name: "Entecavir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.85", img: "assets/medchem/av-entecavir.png",
  feat: ["{{Deoxyguanosine|藥名}} 之合成類似物"],
  pharm: ["經磷酸化形成 Entecavir triphosphate",
    "具有抑制 DNA 合成及{{反轉錄酶|酵素}}的活性",
    "治療 B 型肝炎"] },
{ id: "av-famciclovir", chapter: 27, name: "Famciclovir", type: "drug", group: "非環狀核苷類似物（Acyclic Nucleoside Analogs）", source: "統整（二）p.85", img: "assets/medchem/av-famciclovir.png",
  feat: ["{{Guanine|結構}} 類似物：少了 {{C=O|結構}} 官能基",
    "具有{{兩個乙醯基|結構}}之前驅藥★"],
  pharm: ["{{Prodrug|名詞}}，切除 2 個 Acetyl 形成 {{Penciclovir|藥名}}★",
    "經 Thymidine kinase 形成 Penciclovir triphosphate",
    "治療肝臟移植患者或再度感染之慢性 B 型肝炎"] },
{ id: "av-idoxuridine", chapter: 27, name: "Idoxuridine", type: "drug", group: "傳統核苷類似物（Conventional Nucleoside Analogs）", source: "統整（二）p.86", img: "assets/medchem/av-idoxuridine.png",
  feat: ["含 {{I|取代基}} 的 {{Thymidine|結構}} 類似物",
    "C₂ 沒有 OH 取代"],
  pharm: ["經 Viral thymidine kinase 磷酸化，抑制 {{DNA polymerase|酵素}}★",
    "治療 HSV {{角膜結膜炎|疾病}}",
    "於 Dimethyl Sulfoxide 中可治療 HSV 造成的口鼻黏膜感染"] },
{ id: "av-cytarabine", chapter: 27, name: "Cytarabine（Ara-C）", short: "Cytarabine", type: "drug", group: "傳統核苷類似物（Conventional Nucleoside Analogs）", source: "統整（二）p.86", img: "assets/medchem/av-cytarabine.png",
  feat: ["Idoxuridine 類似物",
    "→ 相差在 C₂ 有 OH 取代",
    "醣基：{{Arabinose|結構}}★"],
  pharm: ["磷酸化形成 {{Ara-CTP|代謝物}}，與 dCTP 競爭 DNA polymerase",
    "代謝：脫胺產生 {{Arabinosyluracil|代謝物}}（Ara-U），由尿液排出"] },
{ id: "av-trifluridine", chapter: 27, name: "Trifluridine（Trifluorothymidine）", short: "Trifluridine", type: "drug", group: "傳統核苷類似物（Conventional Nucleoside Analogs）", source: "統整（二）p.86", img: "assets/medchem/av-trifluridine.png",
  feat: ["Idoxuridine 類似物",
    "Pyrimidine 上有 {{CF₃|取代基}} 取代",
    "C₂ 沒有 OH 取代"],
  pharm: ["經 Thymidine kinase 三磷酸化，可取代 thymidine，使下游的 mRNA 無法合成（唯一{{抑制下游 mRNA 生成|機轉}}之藥物）",
    "治療 HSV-1&2 感染"] },
{ id: "av-vidarabine", chapter: 27, name: "Vidarabine（Ara-A）", short: "Vidarabine", type: "drug", group: "傳統核苷類似物（Conventional Nucleoside Analogs）", source: "統整（二）p.86", img: "assets/medchem/av-vidarabine.png",
  feat: ["含有 {{Adenosine|結構}}★結構",
    "C₂ 有 OH 取代",
    "醣基：Arabinose"],
  pharm: ["經三磷酸化後，才可抑制 DNA 合成★",
    "治療 HSV-1&2、新生兒口唇疱疹，也曾用做{{抗腫瘤藥物|用途}}★",
    "代謝：{{Adenosine deaminase|酵素}}★代謝為 Ara-HX（脫胺接酮）",
    "{{Allopurinol|藥名}} 會干擾藥物之代謝"] },
{ id: "av-ribavirin", chapter: 27, name: "Ribavirin", type: "drug", group: "非核苷類似物（Non-Nucleoside Analogs）：抗病毒", source: "統整（二）p.86", img: "assets/medchem/av-ribavirin.png",
  feat: ["含有 1,2,4-{{Triazole|結構}}★雜環（非 Nucleoside 類似物）",
    "唯一 C₂-OH 方向朝{{下|性質|上}}"],
  pharm: ["經 {{Adenosine kinase|酵素}} 形成三磷酸產物，可抑制 DNA、RNA 病毒（抗病毒譜較廣）",
    "治療 A 型或 B 型流感，可併用 {{Interferon α-2b|藥名}} 治療 {{HCV|名詞}}",
    "口服或 IV 可至勞 Lassa fever；也可用於 SARS 治療"] },
{ id: "av-boceprevir", chapter: 27, name: "Boceprevir", type: "drug", group: "非核苷類似物（Non-Nucleoside Analogs）：抗病毒", source: "統整（二）p.87", img: "assets/medchem/av-boceprevir.png",
  feat: ["含有 {{Urea|結構}} 結構"],
  pharm: ["機轉：強效 HCV {{NS3/4A protease|酵素}} 抑制劑★，抑制病毒複製",
    "治療 {{C 型肝炎|疾病}}，可搭配 Pegylated interferon 或 Ribavirin"] },
{ id: "av-telaprevir", chapter: 27, name: "Telaprevir", type: "drug", group: "非核苷類似物（Non-Nucleoside Analogs）：抗病毒", source: "統整（二）p.87", img: "assets/medchem/av-telaprevir.png",
  feat: ["含有 {{Pyrazine|結構}} 結構"],
  pharm: ["機轉：強效 HCV {{NS3/4A protease|酵素}} 抑制劑★，抑制病毒複製",
    "治療 C 型肝炎，可搭配 Pegylated interferon 或 Ribavirin"] },
{ id: "av-fomivirsen", chapter: 27, name: "Fomivirsen", type: "drug", group: "非核苷類似物（Non-Nucleoside Analogs）：抗病毒", source: "統整（二）p.87",
  desc: ["結構：5'-GCG TTT GCT CTT CTT CTT GCG-3'"],
  feat: ["{{21|數值}} 個★寡核苷酸組成之片段",
    "屬於 {{Phosphorothioate|結構}}★結構"],
  pharm: ["第一個{{反義寡核苷酸|藥物類別}}（Antisense）★藥物",
    "機轉：抑制病毒基因表現之蛋白質生成",
    "治療 CMV 視網膜炎，也可用於癌症與 Crohn disease"] },
{ id: "av-foscarnet", chapter: 27, name: "Foscarnet", type: "drug", group: "非核苷類似物（Non-Nucleoside Analogs）：抗病毒", source: "統整（二）p.87", img: "assets/medchem/av-foscarnet.png",
  feat: ["屬於 {{Pyrophosphate|結構}} 類似物",
    "{{磷酸三鈉六水|物質}}★化合物",
    "本身有磷酸根，{{不需被病毒酵素活化|性質}}★"],
  pharm: ["機轉：抑制疱疹病毒 Herpes virus 之 DNA 合成酶",
    "治療愛滋病人 CMV 視網膜炎",
    "併用 Zidovudine（ZDV）可抗 CMV、HIV"] },
{ id: "av-methisazone", chapter: 27, name: "Methisazone", type: "drug", group: "影響核酸轉譯藥物（Agents affect the Ribosome）", source: "統整（二）p.87", img: "assets/medchem/av-methisazone.png",
  feat: ["含有 {{Thiourea|結構}} 結構"],
  pharm: ["機轉：干擾 mRNA 轉譯",
    "治療{{痘病毒|名詞}}（Poxvirus）及有效預防{{天花|疾病}}（Smallpox）"] },
{ id: "av-zidovudine", chapter: 27, name: "Zidovudine（AZT／ZDV）", short: "Zidovudine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.89", img: "assets/medchem/av-zidovudine.png",
  feat: ["{{Thymidine|結構}}★類似物",
    "C₃ 接有 {{Azido group|取代基}}★（N₃）",
    "3'-Azido-3'-deoxythymidine★"],
  pharm: ["經 Thymidine kinase {{磷酸化|代謝}}★，形成 5'-monophosphate",
    "可提高 CD4⁺數量，控制 AIDS 相關症狀（ARC）",
    "治療 RNA 反轉錄病毒、HIV-1&2、EBV",
    "副作用：{{骨髓毒性|副作用}}、嗜中性白血球減少"] },
{ id: "av-stavudine", chapter: 27, name: "Stavudine（D4T）", short: "Stavudine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.89", img: "assets/medchem/av-stavudine.png",
  feat: ["Thymidine 類似物",
    "核醣 2、3 號位間有{{雙鍵|結構}}"],
  pharm: ["需磷酸化成 D4T phosphate 才有活性",
    "可降低 p24 抗原並增加 CD4⁺數量",
    "副作用：{{周邊神經毒性|副作用}}（骨髓毒性較低）",
    "代謝：{{Xanthine oxidase|酵素}} 氧化形成{{尿酸|代謝物}}，可併用 Allopurinol"] },
{ id: "av-zalcitabine", chapter: 27, name: "Zalcitabine（ddC）", short: "Zalcitabine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.89", img: "assets/medchem/av-zalcitabine.png",
  feat: ["{{Cytidine|結構}} 類似物",
    "核醣上無 OH 取代（2-deoxycytidine）"],
  pharm: ["Zidovudine 之替代用藥，可穿過 BBB",
    "可降低 p24 抗原並增加 CD4⁺數量",
    "主要代謝物：Dideoxyuridine"] },
{ id: "av-lamivudine", chapter: 27, name: "Lamivudine（3TC）", short: "Lamivudine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.89", img: "assets/medchem/av-lamivudine.png",
  feat: ["{{Cytidine|結構}}★類似物",
    "由 Zalcitabine 衍生而來",
    "核醣上 C₃ 取代為 {{S|取代基}}★（{{Oxathiol|結構}} 環★）"],
  pharm: ["需磷酸化成 5'-3TC phosphate 才有活性",
    "常併用 ZDV 或 D4T 治療",
    "口服低劑量也可治療慢性 {{B 型肝炎|疾病}}"] },
{ id: "av-emtricitabine", chapter: 27, name: "Emtricitabine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.90", img: "assets/medchem/av-emtricitabine.png",
  feat: ["Cytidine 類似物",
    "由 {{Lamivudine|藥名}} 衍生而來",
    "Cytosine 上有 {{F|取代基}} 取代"],
  pharm: ["口服有效，且(-)-enantiomer 活性較佳",
    "{{不會|性質|會}}與血漿蛋白結合",
    "併用 Efavirenz、Didanosine 時有低度抗藥性"] },
{ id: "av-didanosine", chapter: 27, name: "Didanosine（ddI）", short: "Didanosine", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.90", img: "assets/medchem/av-didanosine.png",
  feat: ["{{Inosine|結構}}★類似物"],
  pharm: ["需磷酸化成 {{ddATP|代謝物}} 才具有活性",
    "機轉：與 dATP 競爭反轉錄酶，終止鏈延長",
    "可降低 p24 抗原並增加 CD4⁺數量",
    "代謝：ddI → ddATP → Hypoxanthine → {{Uric acid|代謝物}}★"] },
{ id: "av-abacavir", chapter: 27, name: "Abacavir（ABC）", short: "Abacavir", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.90", img: "assets/medchem/av-abacavir.png",
  feat: ["{{Adenosine|結構}} 類似物",
    "核醣 2、3 號位間有雙鍵",
    "Adenosine 接有 {{Cyclopropane|結構}}"],
  pharm: ["吸收佳可進入 BBB，常併用其他藥物治療 HIV",
    "副作用：致命{{過敏反應|副作用}}、胃腸道問題"] },
{ id: "av-tenofovir", chapter: 27, name: "Tenofovir disoproxil", short: "Tenofovir", type: "drug", group: "核苷類反轉錄酶抑制劑（NRTIs）", source: "統整（二）p.90", img: "assets/medchem/av-tenofovir.png",
  feat: ["Adenosine 類似物",
    "比 {{Adefovir|藥名}} 多一個{{甲基|取代基}}"],
  pharm: ["經 {{esterase|酵素}} 水解成 Tenofovir diphosphate，可和 dATP 競爭使 DNA 鏈延長終止",
    "口服有效，併用其他抗 RT 藥物有協同作用"] },
{ id: "av-nevirapine", chapter: 27, name: "Nevirapine（NVP）", short: "Nevirapine", type: "drug", group: "非核苷類反轉錄酶抑制劑（NNRTIs）", source: "統整（二）p.91", img: "assets/medchem/av-nevirapine.png",
  feat: ["{{Dipyridodiazepinone|結構}}★衍生物"],
  pharm: ["機轉：可直接結合 {{HIV-1 RT|標的}}★，抑制 RNA、DNA 聚合酶活性（不需磷酸化，不會造成 {{DNA Chain Termination|機轉}}★）",
    "不會抑制 HIV-2 的 RT★與人類的 DNA polymerase",
    "口服快速吸收，可通過 BBB",
    "副作用：{{肝毒性|副作用}}、皮膚疹"] },
{ id: "av-efavirenz", chapter: 27, name: "Efavirenz", type: "drug", group: "非核苷類反轉錄酶抑制劑（NNRTIs）", source: "統整（二）p.91", img: "assets/medchem/av-efavirenz.png",
  feat: ["含有 {{C≡C|結構}}、{{Cyclopropane|結構}}"],
  pharm: ["替代 Indinavir 與 ZDV、3TC 併用，可通過 BBB",
    "可減輕雞尾酒療法副作用",
    "不可和 Midazolam、Triazolam、Ergo 類藥品併用"] },
{ id: "av-delavirdine", chapter: 27, name: "Delavirdine", type: "drug", group: "非核苷類反轉錄酶抑制劑（NNRTIs）", source: "統整（二）p.91", img: "assets/medchem/av-delavirdine.png",
  feat: ["Biheteroaryl piperazine 衍生物",
    "含有 Methyl sulfone、{{Indole|結構}}、Piperazine 結構"],
  pharm: ["機轉：直接抑制 RT 和 DNA polymerase 的活性",
    "對 HIV-1 具專一性，可用於早期治療 HIV 感染",
    "併用 Clarithromycin、Rifabutin、Ergo 會使其血中濃度↑",
    "代謝：經肝臟代謝成 {{N-desisopropyl|代謝物}} 產物"] },
{ id: "av-raltegravir", chapter: 27, name: "Raltegravir", type: "drug", group: "HIV 嵌合酶抑制劑（HIV Integrase Inhibitors）", source: "統整（二）p.91", img: "assets/medchem/av-raltegravir.png",
  feat: ["含有 1,3,4-{{Oxadiazole|結構}}★雜環"],
  pharm: ["FDA 第一個認可的 HIV Integrase Inhibitor",
    "機轉：與 {{Mg²⁺|離子}} 結合，抑制 cDNA integration 並阻止 HIV-1 嵌入染色體以進入 T 細胞",
    "HIV-1 第一線用藥，可口服治療對其他藥物產生抗藥性之病人"] },
{ id: "av-saquinavir", chapter: 27, name: "Saquinavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.92", img: "assets/medchem/av-saquinavir.png",
  feat: ["{{Carboxamide|結構}} 衍生物",
    "常被製成 {{Mesylate|物質}} 鹽類"],
  pharm: ["FDA 第一個認可的 HIV Protease Inhibitor",
    "機轉：專一性抑制 HIV protease，阻止轉譯後蛋白合成",
    "治療末期 HIV，使用三重療法效果較佳（+ZDV & ddC）",
    "{{高脂肪|性質}}食物可{{促進|性質|降低}}藥物吸收"] },
{ id: "av-indinavir", chapter: 27, name: "Indinavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.92", img: "assets/medchem/av-indinavir.png",
  feat: ["{{Pentanoic acid amide|結構}}★衍生物",
    "含有 {{Pyridine|結構}}★結構"],
  pharm: ["與其他反轉錄酶抑制劑併用可增加活性",
    "交互作用：Rifabutin 使濃度↑、Ketoconazole 使濃度↓"] },
{ id: "av-ritonavir", chapter: 27, name: "Ritonavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.92", img: "assets/medchem/av-ritonavir.png",
  feat: ["類胜肽結構（{{Peptidomimetic|結構}}）",
    "含有 {{thiazole|結構}}、isopropylthiazole 結構"],
  pharm: ["機轉：可抑制 HIV-1&2 的 protease，為 {{CYP450|酵素}} 抑制劑",
    "治療末期 HIV，可單用或和 3TC、ZDV、ddC 併用 → 增加 CD4⁺數量",
    "代謝：主要進行 {{Isopropylthiazole oxidation|代謝}}"] },
{ id: "av-nelfinavir", chapter: 27, name: "Nelfinavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.92", img: "assets/medchem/av-nelfinavir.png",
  feat: ["類胜肽結構（Peptidomimetic）",
    "含有 {{S|取代基}} 原子"],
  pharm: ["機轉：可抑制 HIV-1&2 的 protease",
    "治療 HIV-1&2 及 ZDV-resistant 病人"] },
{ id: "av-amprenavir", chapter: 27, name: "Amprenavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.93", img: "assets/medchem/av-amprenavir.png",
  feat: ["含有 {{Sulfonamide|結構}} 結構"],
  pharm: ["{{高脂肪|性質}}飲食會{{降低|性質|促進}}藥物吸收",
    "與{{磺胺類|藥物類別}}藥物會產生交互敏感性",
    "可製成磷酸鹽 Prodrug（{{Fosamprenavir|藥名}}）"] },
{ id: "av-lopinavir", chapter: 27, name: "Lopinavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.93", img: "assets/medchem/av-lopinavir.png",
  feat: ["含有 {{Urea|結構}} 結構",
    "含有 Thiazole、Isopropylthiazole 結構"],
  pharm: ["第一個用以治療年輕病患的 Protease Inhibitor",
    "與 {{Ritonavir|藥名}} 併用"] },
{ id: "av-atazanavir", chapter: 27, name: "Atazanavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.93", img: "assets/medchem/av-atazanavir.png",
  desc: ["具有{{兩個|數值}} methoxy group",
    "類胜肽結構（Peptidomimetic）"] },
{ id: "av-tipranavir", chapter: 27, name: "Tipranavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.93", img: "assets/medchem/av-tipranavir.png",
  desc: ["將 {{Amprenavir|藥名}} 的 NH₂ 換成 {{CF₃|取代基}}",
    "具有 Sulfonamide 結構"] },
{ id: "av-darunavir", chapter: 27, name: "Darunavir", type: "drug", group: "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）", source: "統整（二）p.93", img: "assets/medchem/av-darunavir.png",
  desc: ["{{第二代|性質}} HIV Protease Inhibitor",
    "→ 有更佳的結合力"] },

/* ===== 第 26 章（統整（二）柒 抗癌藥物 p.55–79）===== */
/* p.55 的非針對／針對細胞週期藥物兩張總覽表放告示牌；一、烷化劑：灰底芥子氮類、亞硝基脲類、DNA 甲基化劑、有機鉑化合物、未歸類烷化劑；
   二、抗代謝藥物：葉酸拮抗劑、嘧啶拮抗劑、嘌呤拮抗劑、DNA 聚合酶與鏈延長抑制劑、DNA 甲基轉移酶抑制劑、抗癌輔助劑；
   三、抗腫瘤抗生素：Anthracyclines（共通結構與機轉放知識卡）、Anthracenedione 類、未歸類；四、有絲分裂抑制劑：長春花生物鹼、紫杉類、巨環內酯類（加後綴「（抗癌）」避免和第 23 章的 Macrolides 重名）、Nitrogen mustards 類；
   五、拓樸異構酶抑制劑：鬼臼毒素類、喜樹鹼類（藥理共通說明放知識卡）；六、酵素類藥物、七、其他抗癌藥物沒有灰底，章節標題就是分類；
   八、分子標靶藥物：黑底「小分子抑制劑（Tyrosine Kinase Inhibitors）」底下的 ALK／BCR-ABL／EGFR／EGFR & HER2／VEGFR 與黑底「其他標靶藥物」底下的 Proteasome／mTOR／免疫調節劑／B 細胞調節劑用第三層小標；單株抗體與免疫療法沒有黑底灰底，各自為分類。
   p.76–77 的表格欄位是機轉／適應症／副作用與備註（act／ind／rmk），p.78–79 的結構與特性合併到同一格；沒有結構圖的藥（單株抗體、Ceritinib、Crizotinib、Afatinib、Axitinib、Sirolimus、Belimumab、Asparaginase）只有文字。
   Estramustine 在亞硝基脲類（p.58）與 Nitrogen mustards 類（p.72）各一格；Thalidomide 與第 25 章（抗麻風）各自一格；Vinblastine／Vincristine 共用同一張結構圖與說明，兩格都放。 */

{ id: "ca-mechlorethamine", chapter: 26, name: "Mechlorethamine", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.56", img: "assets/medchem/ca-mechlorethamine.png",
  feat: ["直鏈 {{Nitrogen mustard|藥物類別}}",
    "{{最容易|性質}}於體內形成具抗癌活性的 {{Aziridium ion|代謝物}}★"],
  pharm: ["與 Guanine 的 {{N-7|位置}} 結合烷化",
    "可用 {{Sodium thiosulfate|藥名}} 解毒"] },
{ id: "ca-cyclophosphamide", chapter: 26, name: "Cyclophosphamide", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.56", img: "assets/medchem/ca-cyclophosphamide.png", imgMore: ["assets/medchem/ca-acrolein.png"],
  feat: ["具有 {{Oxazaphosphorine|結構}} 結構",
    "{{CYP450|酵素}} 進行氧化代謝（{{Carboxylation|代謝}}★），形成活性 {{4-hydroxy|代謝物}}★代謝物（Carbinolamine）",
    "代謝產生 {{Acrolein|代謝物}}，具有{{膀胱毒性|副作用}}"],
  pharm: ["{{Prodrug|名詞}}",
    "可服用 {{Mesna|藥名}}® 減少膀胱毒性"] },
{ id: "ca-ifosfamide", chapter: 26, name: "Ifosfamide", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.56", img: "assets/medchem/ca-ifosfamide.png",
  feat: ["屬於 {{Phosphoramide mustard|藥物類別}} 衍生物",
    "具有 Oxazaphosphorine 結構",
    "代謝產生膀胱毒性的 {{Acrolein|代謝物}} 及腎毒性的 {{Chloroacetaldehyde|代謝物}}"],
  pharm: ["Prodrug",
    "可服用 Mesna® 減少膀胱毒性",
    "治療{{睪丸癌|疾病}}"] },
{ id: "ca-trofosfamide", chapter: 26, name: "Trofosfamide", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.56", img: "assets/medchem/ca-trofosfamide.png",
  feat: ["屬於 Phosphoramide mustard 衍生物",
    "具有 Oxazaphosphorine 結構"],
  pharm: ["Prodrug，分解產生 {{Ifosfamide|藥名}} 和 {{Cyclophosphamide|藥名}}"] },
{ id: "ca-melphalan", chapter: 26, name: "Melphalan", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.57", img: "assets/medchem/ca-melphalan.png",
  feat: ["屬於 {{Aryl nitrogen mustards|藥物類別}}，化性穩定可口服",
    "含有 {{L-Phenylalanine|結構}}（L-form 藥效較佳）",
    "→ 連接胺基酸之 Nitrogen mustards"] },
{ id: "ca-chlorambucil", chapter: 26, name: "Chlorambucil", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.57", img: "assets/medchem/ca-chlorambucil.png",
  feat: ["屬於 Aryl nitrogen mustards★，化性穩定可口服",
    "代謝產生有活性的 {{Phenylacetic acid mustard|代謝物}}"],
  pharm: ["毒性為本類藥物中{{最低|性質|最高}}",
    "治療 {{CLL|疾病}} 和原發性巨球蛋白血症"] },
{ id: "ca-bendamustine", chapter: 26, name: "Bendamustine", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.57", img: "assets/medchem/ca-bendamustine.png",
  feat: ["屬於 Aryl nitrogen mustards，化性穩定可口服",
    "含有 {{Benzimidazole|結構}} 結構"],
  pharm: ["刺激 {{p21|標的}}、{{p53|標的}} 誘導細胞凋亡，使細胞週期停留在 {{S phase|名詞}}"] },
{ id: "ca-thiotepa", chapter: 26, name: "Thiotepa", type: "drug", group: "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine", source: "統整（二）p.57", img: "assets/medchem/ca-thiotepa.png",
  feat: ["含有 {{Aziridine|結構}} 結構",
    "酸性下，Aziridine 可被質子化成 Aziridinium ion 進而烷化 DNA",
    "代謝去硫化會產生具毒性的 {{TEPA|代謝物}}"] },
{ id: "ca-carmustine", chapter: 26, name: "Carmustine", type: "drug", group: "亞硝基脲類（Nitrosoureas）", source: "統整（二）p.58", img: "assets/medchem/ca-carmustine.png",
  feat: ["體內產生具抗癌活性的代謝物★：",
    "{{Vinyldiazohydroxide|代謝物}}（{{Vinyl Cation|代謝物}}★）、2-Chloroethylamine、2-Chloroethylisocyanate"],
  pharm: ["{{脂溶性高|性質|脂溶性低}}，用來治療{{腦瘤|疾病}}",
    "副作用：{{肝毒性|副作用}}、白血球減少"] },
{ id: "ca-lomustine", chapter: 26, name: "Lomustine", type: "drug", group: "亞硝基脲類（Nitrosoureas）", source: "統整（二）p.58", img: "assets/medchem/ca-lomustine.png",
  feat: ["具有 {{Cyclohexane|結構}} 結構",
    "{{脂溶性高|性質}}★，容易穿透 BBB",
    "形成 {{Chlorovinyl carbocation|代謝物}}，可烷化 DNA 中 guanine 的 O⁶、N⁷ 位置"],
  pharm: ["治療轉移性腦癌與 Hodgkin"] },
{ id: "ca-estramustine", chapter: 26, name: "Estramustine", type: "drug", group: "亞硝基脲類（Nitrosoureas）", source: "統整（二）p.58", img: "assets/medchem/ca-estramustine.png",
  feat: ["具有 {{estrane|結構}}★骨架",
    "含有 {{Carbamate|結構}}★結構"],
  pharm: ["治療{{攝護腺癌|疾病}}",
    "機轉{{非烷化|性質|烷化}}作用，為抑制{{有絲分裂|機轉}}★"] },
{ id: "ca-streptozocin", chapter: 26, name: "Streptozocin", short: "Streptozocin", type: "drug", group: "亞硝基脲類（Nitrosoureas）", source: "統整（二）p.58", img: "assets/medchem/ca-streptozocin.png",
  feat: ["具有醣基 {{Glucopyranose amino sugar|結構}}",
    "醣基會提高水溶性，使{{腎毒性|副作用}}增加"],
  pharm: ["可誘導實驗動物產生{{糖尿病|疾病}}",
    "治療轉移性{{移島細胞癌|疾病}}"] },
{ id: "ca-procarbazine", chapter: 26, name: "Procarbazine", type: "drug", group: "DNA 甲基化劑（DNA Methylators）", source: "統整（二）p.59", img: "assets/medchem/ca-procarbazine.png",
  feat: ["產生 {{Methyl radical|代謝物}}★，具抗癌活性",
    "→ 造成 guanine {{O⁶-methylation|機轉}}★",
    "氧氣存在下，會自我分解形成 {{H₂O₂|物質}}"],
  pharm: ["治療 {{Hodgkin|疾病}}"] },
{ id: "ca-dacarbazine", chapter: 26, name: "Dacarbazine", type: "drug", group: "DNA 甲基化劑（DNA Methylators）", source: "統整（二）p.59", img: "assets/medchem/ca-dacarbazine.png",
  feat: ["具有 {{Imidazole|結構}}、{{Triazene|結構}} 結構",
    "經 CYP450 的 N-去甲基化產生 {{MTIC|代謝物}}，再斷裂產生 {{Diazonium ion|代謝物}}★，最後形成 {{Methyl carbocation|代謝物}}★烷化 Guanine O⁶、N⁷ 位置"],
  pharm: ["治療惡性轉移{{黑色素瘤|疾病}}"] },
{ id: "ca-temozolomide", chapter: 26, name: "Temozolomide", type: "drug", group: "DNA 甲基化劑（DNA Methylators）", source: "統整（二）p.59", img: "assets/medchem/ca-temozolomide.png",
  feat: ["具有 Imidazole、Triazene 結構",
    "{{MTIC|代謝物}} 之 {{Prodrug|名詞}}，不需酵素即可形成 MTIC"],
  pharm: ["治療多形性{{神經膠母細胞瘤|疾病}}",
    "食物會{{減少|性質|增加}}藥物之吸收",
    "副作用：{{骨髓抑制|副作用}}"] },
{ id: "ca-cisplatin", chapter: 26, name: "Cisplatin", type: "drug", group: "有機鉑化合物（Organoplatinum complexes）", source: "統整（二）p.60", img: "assets/medchem/ca-cisplatin.png", imgMore: ["assets/medchem/ca-cisplatin-path.png"],
  feat: ["{{Pt(II) complex|結構}}★：屬於 square planar geometry",
    "鉑原子與 {{Cl|取代基}}、{{NH₃|取代基}} 鍵結★",
    "Cisplatin 之活性態：Cl 被{{水合|機轉}}（aquo form）★"],
  pharm: ["與 DNA 上 guanine 的 {{N-7|位置}}★結合",
    "主要以 guanine-guanine 的 {{intrastrand|名詞}} cross-linking 為主★",
    "{{耳毒性|副作用}}：可用 {{Amifostine|藥名}} 預防",
    "{{腎毒性|副作用}}：注射食鹽水和甘露醇使排除↑",
    "解毒劑：使用 {{Sodium thiosulfate|藥名}} 可中和活性代謝物"] },
{ id: "ca-carboplatin", chapter: 26, name: "Carboplatin", type: "drug", group: "有機鉑化合物（Organoplatinum complexes）", source: "統整（二）p.60", img: "assets/medchem/ca-carboplatin.png",
  feat: ["Pt(II) complex",
    "將 Cisplatin 的 Cl 用酯基與 {{cyclobutane|結構}} 取代"],
  pharm: ["藥效較 Cisplatin {{弱|性質|強}}，耳毒性也較小",
    "治療末期{{卵巢癌|疾病}}"] },
{ id: "ca-oxaliplatin", chapter: 26, name: "Oxaliplatin", type: "drug", group: "有機鉑化合物（Organoplatinum complexes）", source: "統整（二）p.60", img: "assets/medchem/ca-oxaliplatin.png",
  feat: ["Pt(II) complex",
    "含有{{草酸|結構}}（Oxalic acid）結構",
    "草酸在{{鹼性|性質|酸性}}中會分解，注射時要注意交互作用"],
  pharm: ["和 {{5-FU|藥名}} 併用治療轉移性直腸結腸癌",
    "Oxalate 可能與 Ca²⁺螯合，造成神經系統相關副作用（{{周邊神經炎|副作用}}）"] },
{ id: "ca-picoplatin", chapter: 26, name: "Picoplatin", type: "drug", group: "有機鉑化合物（Organoplatinum complexes）", source: "統整（二）p.60", img: "assets/medchem/ca-picoplatin.png",
  feat: ["含有 {{Picoline|結構}} 結構（2-methyl+pyridine）",
    "Pt(II) complex"],
  pharm: ["{{孤兒藥|名詞}}，治療{{小細胞肺癌|疾病}}"] },
{ id: "ca-satraplatin", chapter: 26, name: "Satraplatin", type: "drug", group: "有機鉑化合物（Organoplatinum complexes）", source: "統整（二）p.60", img: "assets/medchem/ca-satraplatin.png",
  feat: ["含有 {{cyclohexane|結構}} 結構",
    "{{Pt(IV)|結構}} complex"],
  pharm: ["治療荷爾蒙難治型{{攝護腺癌|疾病}}"] },
{ id: "ca-busulfan", chapter: 26, name: "Busulfan", type: "drug", group: "未歸類烷化劑（Miscellaneous Alkylating Agents）", source: "統整（二）p.61", img: "assets/medchem/ca-busulfan.png",
  feat: ["含有 {{Sulfonic acid ester|結構}}（Alkylsulfonate）",
    "體內產生具 {{Sulfonate|結構}}★的代謝物"],
  pharm: ["具有{{兩個|數值}} Methylsulfonate 官能基，可和兩個 DNA 產生 {{interstrand|名詞}} cross-linking（guanine N⁷ 位置）"] },
{ id: "ca-altretamine", chapter: 26, name: "Altretamine", type: "drug", group: "未歸類烷化劑（Miscellaneous Alkylating Agents）", source: "統整（二）p.61", img: "assets/medchem/ca-altretamine.png",
  feat: ["含有 1,3,5-{{Triazine|結構}} 雜環結構",
    "產生 {{Iminium ion|代謝物}} 烷化 guanine；",
    "也可經 N-去甲基產生{{甲醛|代謝物}}毒殺細胞",
    "※ {{Methenamine|藥名}} 也可釋放甲醛"],
  pharm: ["治療{{卵巢癌|疾病}}"] },
{ id: "ca-methotrexate", chapter: 26, name: "Methotrexate", type: "drug", group: "葉酸拮抗劑（Folic acid Antagonists）", source: "統整（二）p.62", img: "assets/medchem/ca-methotrexate.png",
  feat: ["4-Amino-4-Deoxy-N¹⁰-methyl 葉酸衍生物",
    "具有 {{Pteridine|結構}}★結構",
    "含有 {{Glutamate tail|結構}}★",
    "{{Diaminopyrimidine|結構}} 可與 DHFR 緊密結合"],
  pharm: ["抑制 {{Dihydrofolate reductase|酵素}}★，使 FH₂ 累積，負回饋抑制 Thymidylate synthase",
    "可併用 {{Leucovorin|藥名}}★降低毒性"] },
{ id: "ca-pemetrexed", chapter: 26, name: "Pemetrexed", type: "drug", group: "葉酸拮抗劑（Folic acid Antagonists）", source: "統整（二）p.62", img: "assets/medchem/ca-pemetrexed.png",
  feat: ["具有 {{Pyrrolopyrimidine|結構}} 結構"],
  pharm: ["可抑制 DHFR 和 Thymidylate synthase",
    "治療轉移性{{非小細胞肺癌|疾病}}",
    "須併用 {{Folate|藥名}}、{{Vit B₁₂|藥名}} 減少副作用"] },
{ id: "ca-trimetrexate", chapter: 26, name: "Trimetrexate", type: "drug", group: "葉酸拮抗劑（Folic acid Antagonists）", source: "統整（二）p.62", img: "assets/medchem/ca-trimetrexate.png",
  feat: ["含有{{三個|數值}}{{甲氧基|取代基}}"],
  pharm: ["間接抑制 Thymidine 形成",
    "不會形成 {{Polyglutamation adducts|代謝物}}"] },
{ id: "ca-pralatrexate", chapter: 26, name: "Pralatrexate", type: "drug", group: "葉酸拮抗劑（Folic acid Antagonists）", source: "統整（二）p.62", img: "assets/medchem/ca-pralatrexate.png",
  feat: ["{{Methotrexate|藥名}} 的 10 號位從 N 換成 {{C|取代基}}",
    "具有 Pteridine 結構",
    "10 號位接有 C-C≡C 結構（{{Propargyl|結構}}）"],
  pharm: ["主要抑制 DHFR",
    "可調控 RFC1/FRGS，使 Polyglutamation 增加"] },
{ id: "ca-fluorouracil", chapter: 26, name: "5-Fluorouracil（5-FU）", short: "5-Fluorouracil", type: "drug", group: "嘧啶拮抗劑（Pyrimidine Antagonists）", source: "統整（二）p.63", img: "assets/medchem/ca-fluorouracil.png",
  feat: ["為 {{Pyrimidine|結構}}★衍生物",
    "抗藥性：癌細胞{{減少|性質|增加}}對藥物之活化（{{Uridine kinase|酵素}} 減少）"],
  pharm: ["{{Prodrug|名詞}}，需磷酸化成 {{5-FdUMP|代謝物}}，再與 Thymidylate synthetase 和輔酶 5,10-methylenetetrahydrofolic acid★ 結合，使 dTMP 缺乏而抑制 DNA 合成",
    "可併用 {{5-Ethynyluracil|藥名}} 增加藥效（抑制 Dihydropyrimidine 脫氫酶）"] },
{ id: "ca-floxuridine", chapter: 26, name: "5-Fluorodeoxyuridine（Floxuridine）", short: "Floxuridine", type: "drug", group: "嘧啶拮抗劑（Pyrimidine Antagonists）", source: "統整（二）p.63", img: "assets/medchem/ca-floxuridine.png",
  feat: ["為 Pyrimidine 衍生物",
    "5-FU 接上 {{Deoxyuridine|結構}} 後形成"],
  pharm: ["{{不受|性質|受}} DPD 酵素影響，不生成 5-FU，可直接產生 5-FdUMP"] },
{ id: "ca-capecitabine", chapter: 26, name: "Capecitabine", type: "drug", group: "嘧啶拮抗劑（Pyrimidine Antagonists）", source: "統整（二）p.63", img: "assets/medchem/ca-capecitabine.png",
  feat: ["為 Pyrimidine 衍生物",
    "含有 {{Carbamate|結構}} 和 {{Pentyl group|結構}}",
    "抑制 {{CYP2C9|酵素}}，與 Warfarin、Phenytoin 有嚴重交互作用"],
  pharm: ["Prodrug，經 {{thymidine phosphorylase|酵素}} 代謝形成 {{5-Fluorouracil|藥名}}★",
    "副作用：{{Hand-foot Syndrome|副作用}}",
    "治療{{結腸直腸癌|疾病}}"] },
{ id: "ca-tegafur", chapter: 26, name: "Tegafur", type: "drug", group: "嘧啶拮抗劑（Pyrimidine Antagonists）", source: "統整（二）p.63", img: "assets/medchem/ca-tegafur.png",
  feat: ["為 Pyrimidine 衍生物"],
  pharm: ["5-FU 的 {{Prodrug|名詞}}★"] },
{ id: "ca-mercaptopurine", chapter: 26, name: "6-Mercaptopurine（6-MP）", short: "6-MP", type: "drug", group: "嘌呤拮抗劑（Purine Antagonists）", source: "統整（二）p.64", img: "assets/medchem/ca-mercaptopurine.png",
  feat: ["具有 {{6-thiopurine|結構}} 結構",
    "可由 {{Hypoxanthine|物質}} 和 Phosphorus pentasulfide（P₄S₁₀）製備"],
  pharm: ["經 {{HGPRT|酵素}} 磷酸化生成 {{6-Thioinosinate|代謝物}}（6-MP ribonucleotide★）抑制 {{5-phosphoribosylamine|代謝物}}★與 DNA 之合成"] },
{ id: "ca-thioguanine", chapter: 26, name: "6-Thioguanine（6-TG）", short: "6-TG", type: "drug", group: "嘌呤拮抗劑（Purine Antagonists）", source: "統整（二）p.64", img: "assets/medchem/ca-thioguanine.png",
  feat: ["具有 6-thiopurine 結構"],
  pharm: ["經 HGPRT 磷酸化生成 {{6-TGTP|代謝物}}",
    "與 {{Cytarabine|藥名}} 併用治療{{急性白血病|疾病}}"] },
{ id: "ca-azathioprine", chapter: 26, name: "Azathioprine", type: "drug", group: "嘌呤拮抗劑（Purine Antagonists）", source: "統整（二）p.64", img: "assets/medchem/ca-azathioprine.png",
  feat: ["由 {{Xanthine oxidase|酵素}} 代謝，故併用 {{Allopurinol|藥名}} 會抑制藥物代謝"],
  pharm: ["{{6-MP|藥名}} 的 Prodrug",
    "經由 {{Glutathione conjugation|代謝}}★轉化成 6-MP",
    "可用於{{器官移植|用途}}的抗排斥藥物"] },
{ id: "ca-cytarabine", chapter: 26, name: "Cytarabine（Ara-C）", short: "Cytarabine", type: "drug", group: "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）", source: "統整（二）p.65", img: "assets/medchem/ca-cytarabine.png",
  feat: ["具有 {{Cytidine|結構}} 結構",
    "五碳核醣 {{Arabinose|結構}}★的 R₂-OH 朝上（β form）"],
  pharm: ["經 deoxycytidine kinase 磷酸化形成活性態的 {{ARA-CTP|代謝物}}★",
    "{{不會|性質|會}}與體內酵素形成共價鍵結"] },
{ id: "ca-gemcitabine", chapter: 26, name: "Gemcitabine（dFdC）", short: "Gemcitabine", type: "drug", group: "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）", source: "統整（二）p.65", img: "assets/medchem/ca-gemcitabine.png",
  feat: ["具有 Cytidine 結構",
    "五碳核醣的 R₂ 接有 {{2 個 F|取代基}} 原子"],
  pharm: ["經 deoxycytidine kinase 磷酸化形成具三磷酸根之 {{d-FdCTP|代謝物}}"] },
{ id: "ca-fludarabine", chapter: 26, name: "Fludarabine", type: "drug", group: "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）", source: "統整（二）p.65", img: "assets/medchem/ca-fludarabine.png",
  feat: ["{{Vidarabine|藥名}}（Ara-A）之衍生物，但藥效更好",
    "具有 {{Adenosine|結構}} 結構",
    "Adenine 的 R₂ 接有 {{F 原子|取代基}}★"],
  pharm: ["需經 deoxycytidine kinase 磷酸化，抑制 {{Ribonucleotide reductase|酵素}}",
    "治療{{慢性淋巴白血病|疾病}}"] },
{ id: "ca-cladribine", chapter: 26, name: "Cladribine", type: "drug", group: "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）", source: "統整（二）p.65", img: "assets/medchem/ca-cladribine.png",
  feat: ["具有 Adenosine 結構",
    "Adenine 的 R₂ 接有 {{Cl 原子|取代基}}"],
  pharm: ["經 {{Cytidine kinase|酵素}} 磷酸化形成三磷酸活化態",
    "抑制 DNA 修復所需的酵素",
    "治療{{髮狀細胞白血病|疾病}}"] },
{ id: "ca-clofarabine", chapter: 26, name: "Clofarabine", type: "drug", group: "DNA 聚合酶與鏈延長抑制劑（DNA polymerase and Chain elongation Inhibitors）", source: "統整（二）p.65", img: "assets/medchem/ca-clofarabine.png",
  feat: ["具有 Adenosine 結構",
    "五碳核醣的 R₂ 接有 {{F 原子|取代基}}",
    "Adenine 的 R₂ 接有 Cl 原子"],
  pharm: ["抑制 Ribonucleotide reductase，抑制 DNA 鏈的延長",
    "治療{{急性淋巴母細胞白血病|疾病}}",
    "副作用：{{腫瘤溶解症候群|副作用}}"] },
{ id: "ca-azacitidine", chapter: 26, name: "Azacitidine", type: "drug", group: "DNA 甲基轉移酶抑制劑（DNA methyltransferase Inhibitors）", source: "統整（二）p.66", img: "assets/medchem/ca-azacitidine.png",
  feat: ["含有 1,3,5-{{Triazine|結構}} 雜環"],
  pharm: ["作用於 {{S phase|名詞}}，去甲基化負責分化生長的 DNA 基因，抑制異常細胞增生",
    "治療{{骨髓發育不良症候群|疾病}} MDS"] },
{ id: "ca-decitabine", chapter: 26, name: "Decitabine", type: "drug", group: "DNA 甲基轉移酶抑制劑（DNA methyltransferase Inhibitors）", source: "統整（二）p.66", img: "assets/medchem/ca-decitabine.png",
  feat: ["含有 1,3,5-Triazine 雜環",
    "與 Azacitidine 相比，醣基 R₂ {{少|性質|多}}一個 {{OH|取代基}}"],
  pharm: ["作用於 S phase，去甲基化負責分化生長的 DNA 基因，抑制異常細胞增生",
    "治療骨髓發育不良症候群 MDS"] },
{ id: "ca-nelarabine", chapter: 26, name: "Nelarabine", type: "drug", group: "DNA 甲基轉移酶抑制劑（DNA methyltransferase Inhibitors）", source: "統整（二）p.66", img: "assets/medchem/ca-nelarabine.png",
  feat: ["具有 {{Guanine|結構}} 類似結構",
    "有{{甲氧基|取代基}}取代"],
  pharm: ["治療 {{T 細胞急性白血病|疾病}}與淋巴癌",
    "副作用：{{Guillain-Barre Syndrome|副作用}}",
    "會被代謝成{{尿酸|代謝物}}，引起高尿酸血症 → 併服 {{Allopurinol|藥名}}"] },
{ id: "ca-leucovorin", chapter: 26, name: "Leucovorin", type: "drug", group: "抗癌輔助劑（Anticancer Adjuvants）", source: "統整（二）p.67", img: "assets/medchem/ca-leucovorin.png",
  feat: ["{{Tetrahydrofolate|物質}} 加上{{醛基|結構}}形成"],
  pharm: ["與 {{Methotrexate|藥名}} 併用降低毒性；與 {{5-FU|藥名}} 併用增加療效"] },
{ id: "ca-mesna", chapter: 26, name: "2-Mercaptoethane（Mesna®）", short: "Mesna", type: "drug", group: "抗癌輔助劑（Anticancer Adjuvants）", source: "統整（二）p.67", img: "assets/medchem/ca-mesna.png",
  feat: ["具有 {{Sulfone|結構}} 結構"],
  pharm: ["可降低 {{Cyclophosphamide|藥名}}、{{Ifosfamide|藥名}} 代謝產生 {{Acrolein|代謝物}} 之毒性"] },
{ id: "ca-levamisole", chapter: 26, name: "Levamisole", type: "drug", group: "抗癌輔助劑（Anticancer Adjuvants）", source: "統整（二）p.67", img: "assets/medchem/ca-levamisole.png",
  feat: ["{{Tetrahydroimidazothiazole|結構}} 結構"],
  pharm: ["具有{{免疫調節|機轉}}作用，可增加人體之免疫力",
    "和 5-FU 併用可治療{{結腸癌|疾病}}，也作為{{驅蟲|用途}}藥物"] },
{ id: "ca-daunorubicin", chapter: 26, name: "Daunorubicin", type: "drug", group: "Anthracyclines", source: "統整（二）p.68", img: "assets/medchem/ca-daunorubicin.png",
  feat: ["C₄ 接 {{OCH₃|取代基}}、C₁₃ 接 {{CH₃|取代基}}",
    "代謝物 {{Daunorubicinol|代謝物}} 具有慢性心臟毒性"],
  pharm: ["可產生自由基，使 DNA 斷裂"] },
{ id: "ca-doxorubicin", chapter: 26, name: "Doxorubicin（Adriamycin）", short: "Doxorubicin", type: "drug", group: "Anthracyclines", source: "統整（二）p.68", img: "assets/medchem/ca-doxorubicin.png",
  feat: ["C₄ 接 OCH₃、C₁₃ 接 {{CH₃OH|取代基}}",
    "多一個 OH 基，代謝慢、半衰期變長",
    "代謝：C₁₃-carbonyl 可被心肌{{還原|代謝}}成毒性代謝物 {{Doxorubicinol|代謝物}}★，產生心毒性"],
  pharm: ["可產生自由基，使 DNA 斷裂"] },
{ id: "ca-idarubicin", chapter: 26, name: "Idarubicin", type: "drug", group: "Anthracyclines", source: "統整（二）p.69", img: "assets/medchem/ca-idarubicin.png",
  feat: ["C₄ {{無取代基|取代基}}（4-desmethoxy）、C₁₃ 接 CH₃",
    "脂溶性提高，可穿過 {{BBB|器官}}",
    "代謝：C₁₃ 進行 hydroxylation 形成具活性的 {{idarubicinol|代謝物}}（活性與原藥相當）"],
  pharm: ["治療{{急性骨髓白血病|疾病}}，不用於腦瘤"] },
{ id: "ca-epirubicin", chapter: 26, name: "Epirubicin", type: "drug", group: "Anthracyclines", source: "統整（二）p.69", img: "assets/medchem/ca-epirubicin.png",
  feat: ["C₄ 接 OCH₃、C₁₃ 接 CH₃OH",
    "和 {{Doxorubicin|藥名}} 為{{立體異構物|結構}}，相差在醣基",
    "醣基 C₄'-OH 之立體組態為 {{β form|結構|α form}}",
    "代謝：C₁₃ 進行 hydroxylation 形成 {{epirubicinol|代謝物}}"],
  pharm: ["不和氧氣產生自由基，心毒性{{小|性質|大}}",
    "代謝物仍具有活性",
    "治療{{乳癌|疾病}}"] },
{ id: "ca-valrubicin", chapter: 26, name: "Valrubicin", type: "drug", group: "Anthracyclines", source: "統整（二）p.69", img: "assets/medchem/ca-valrubicin.png",
  feat: ["C₄ 接 {{valerate ester|結構}}，可提高脂溶性",
    "醣基 C₃'接有 {{trifluoroacetamide|結構}}：減少解離"],
  pharm: ["{{孤兒藥|名詞}}",
    "治療表淺性{{膀胱癌|疾病}}"] },
{ id: "ca-mitoxantrone", chapter: 26, name: "Mitoxantrone", type: "drug", group: "Anthracenedione 類", source: "統整（二）p.69", img: "assets/medchem/ca-mitoxantrone.png", imgMore: ["assets/medchem/ca-mitoxantrone-path.png"],
  feat: ["屬於 {{anthracenedione|結構}} 衍生物、{{沒有醣基|性質|有醣基}}結構★",
    "代謝：N-dealkylation、Oxidative deamination、Glucuronide conjugation",
    "心臟毒性較 Daunorubicin {{低|性質|高}}（quinone 較穩定，不會進行{{還原|代謝}}代謝★）",
    "副作用：{{藍綠色|性質}}尿液，和肝素併服會沉澱"] },
{ id: "ca-bleomycin", chapter: 26, name: "Bleomycin", type: "drug", group: "未歸類抗腫瘤抗生素（Miscellaneous Antitumor Antibiotics）", source: "統整（二）p.70", img: "assets/medchem/ca-bleomycin.png",
  feat: ["屬於 {{Glycopeptide|藥物類別}}★類：含有配糖",
    "具有 {{imidazole|結構}}★、polyamine、pyrazine，可和 {{Fe²⁺|離子}} 螯合★，使紅血球的氧被還原成超氧自由基",
    "具有 {{bi-thiazole|結構}}★雜環，可嵌入 DNA",
    "可形成 {{thymine-N-propenal|代謝物}} 產生抗癌作用★",
    "經由 hydroxylase 產生無活性 carboxylate 代謝物"],
  pharm: ["自然界中與 {{Cu²⁺|離子}} 螯合",
    "治療{{睪丸癌|疾病}}，主要作用在 {{G₂ phase|名詞}}",
    "代謝：amide 變成 carboxylate，減少對 Fe²⁺的螯合",
    "副作用：{{Fatal pulmonary fibrosis|副作用}}★（肺部無 hydrase，{{不會|性質|會}}抑制骨髓）"] },
{ id: "ca-mitomycin", chapter: 26, name: "Mitomycin C", type: "drug", group: "未歸類抗腫瘤抗生素（Miscellaneous Antitumor Antibiotics）", source: "統整（二）p.70", img: "assets/medchem/ca-mitomycin.png",
  feat: ["具有 {{quinone|結構}}、{{aziridine|結構}}、carbamate 結構",
    "經酵素進行{{還原反應|機轉}}★後，形成烷化劑；quinone 還原形成{{超氧自由基|代謝物}}★，再經由 Fenton reaction 可形成 hydroxy radicals"],
  pharm: ["具有 DNA 嵌入、烷化及使 DNA 斷裂等抗癌機轉★",
    "治療{{胰臟癌|疾病}}"] },
{ id: "ca-dactinomycin", chapter: 26, name: "Dactinomycin（Actinomycin D）", short: "Dactinomycin", type: "drug", group: "未歸類抗腫瘤抗生素（Miscellaneous Antitumor Antibiotics）", source: "統整（二）p.70", img: "assets/medchem/ca-dactinomycin.png",
  feat: ["具有 {{phenoxazinone|結構}}，平面結構可{{嵌入|機轉}} DNA",
    "C₁、C₉ 接有{{五元|數值}}胺基酸內酯"],
  pharm: ["{{無法|性質|可以}}通過 BBB，治療固態瘤",
    "{{深紅色|性質}}結晶，具有光敏感性",
    "另外可抑制細胞膜之生合成"] },
{ id: "ca-vinblastine", chapter: 26, name: "Vinblastine", type: "drug", group: "長春花生物鹼（Vinca Alkaloids）", source: "統整（二）p.71", img: "assets/medchem/ca-vinca.png",
  feat: ["具兩個多環結構（{{bis-indole|結構}}），且有{{三級胺|結構}}★結構，可製備成水溶液",
    "Catharanthine：含有 {{Indole|結構}}★結構，有雙鍵",
    "Vindoline：含有 Indole★結構，{{無|性質|有}}雙鍵"],
  pharm: ["抑制{{微管聚合|機轉}}★（Microtubular polymerization），使有絲分裂停止",
    "具有較強的 Dose-dependent {{周邊神經毒性|副作用}}★，但致吐性低"] },
{ id: "ca-vincristine", chapter: 26, name: "Vincristine", type: "drug", group: "長春花生物鹼（Vinca Alkaloids）", source: "統整（二）p.71", img: "assets/medchem/ca-vinca.png",
  feat: ["具兩個多環結構（{{bis-indole|結構}}），且有{{三級胺|結構}}★結構，可製備成水溶液",
    "Catharanthine：含有 {{Indole|結構}}★結構，有雙鍵",
    "Vindoline：含有 Indole★結構，{{無|性質|有}}雙鍵"],
  pharm: ["抑制{{微管聚合|機轉}}★（Microtubular polymerization），使有絲分裂停止",
    "具有較強的 Dose-dependent {{周邊神經毒性|副作用}}★，但致吐性低"] },
{ id: "ca-paclitaxel", chapter: 26, name: "Paclitaxel", type: "drug", group: "紫杉類藥物（Taxanes）：促進微管聚合", source: "統整（二）p.71", img: "assets/medchem/ca-paclitaxel.png",
  feat: ["C₇-OH、C₁₀-{{乙酯基|取代基}}",
    "{{CYP2C8|酵素}} 代謝成具活性 6α-hydroxypaclitaxel★",
    "次要代謝：{{CYP3A4|酵素}} 氧化形成 3-hydroxy 衍生物"],
  pharm: ["與 {{Cisplatin|藥名}} 併用，治療非小細胞肺癌與末期卵巢癌"] },
{ id: "ca-docetaxel", chapter: 26, name: "Docetaxel", type: "drug", group: "紫杉類藥物（Taxanes）：促進微管聚合", source: "統整（二）p.71", img: "assets/medchem/ca-docetaxel.png",
  feat: ["C₇-OH、C₁₀-OH：{{水溶性|性質|脂溶性}}增加★",
    "CYP3A4 氧化代謝 {{t-butoxy group|結構}}★形成 hydroxydocetaxel"],
  pharm: ["治療非小細胞肺癌，無治療{{卵巢癌|疾病}}功效"] },
{ id: "ca-cabazitaxel", chapter: 26, name: "Cabazitaxel", type: "drug", group: "紫杉類藥物（Taxanes）：促進微管聚合", source: "統整（二）p.71", img: "assets/medchem/ca-cabazitaxel.png",
  feat: ["C₇-{{OCH₃|取代基}}、C₁₀-OCH₃",
    "降低對 {{P-gp|標的}} 親和力，半衰期增長",
    "脂溶性提高，可穿過 BBB"],
  pharm: ["治療對 {{Docetaxel|藥名}} 有抗藥性之轉移性{{前列腺癌|疾病}}"] },
{ id: "ca-epothilone", chapter: 26, name: "Epothilone B", type: "drug", group: "巨環內酯類（Macrolides）（抗癌）", source: "統整（二）p.72", img: "assets/medchem/ca-epothilone.png",
  feat: ["{{16|數值}} 環 Macrolide，具有 {{lactone|結構}} 環",
    "具有 thiazole、{{epoxide|結構}} 結構"],
  pharm: ["結合 {{β-微管蛋白|標的}}，形成穩定聚合物",
    "治療固態瘤、血液系統惡性腫瘤"] },
{ id: "ca-ixabepilone", chapter: 26, name: "Ixabepilone", type: "drug", group: "巨環內酯類（Macrolides）（抗癌）", source: "統整（二）p.72", img: "assets/medchem/ca-ixabepilone.png",
  feat: ["16 環 Macrolide，具有 {{lactam|結構}} 環",
    "具有 thiazole、epoxide 結構"],
  pharm: ["結合 β-微管蛋白，形成穩定聚合物",
    "治療對 {{Taxane|藥物類別}} 具抗藥性的轉移性{{乳癌|疾病}}"] },
{ id: "ca-estramustine2", chapter: 26, name: "Estramustine", short: "Estramustine", type: "drug", group: "Nitrogen mustards 類（抗癌）", source: "統整（二）p.72", img: "assets/medchem/ca-estramustine2.png",
  feat: ["具有 {{Carbamate|結構}}★結構",
    "為 {{Estradiol|藥名}} 衍生物：C₁₇ 與 nitrogen mustard 進行 {{carbamoylated|機轉}}",
    "水解形成 17α-Estradiol 和 Nitrogen mustard"],
  pharm: ["{{Prodrug|名詞}}",
    "結合 {{MAP-4|標的}} 使微管去極化解體（為芥子氣類但機轉為{{抑制有絲分裂|機轉}}）",
    "治療{{前列腺癌|疾病}}★"] },
{ id: "ca-podophyllotoxin", chapter: 26, name: "Podophyllotoxin", type: "drug", group: "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 Topoisomerase II", source: "統整（二）p.73", img: "assets/medchem/ca-podophyllotoxin.png",
  feat: ["C₁、C₄ 的取代基為 {{cis form|結構|trans form}}"],
  pharm: ["代解：{{lactone|結構}} 水解開環"] },
{ id: "ca-etoposide", chapter: 26, name: "Etoposide", type: "drug", group: "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 Topoisomerase II", source: "統整（二）p.73", img: "assets/medchem/ca-etoposide.png",
  feat: ["不含 {{N 原子|取代基}}★",
    "C₁、C₄ 的取代基為 {{trans form|結構|cis form}}",
    "C₁ 接有 {{Ethylidene glucose|結構}} 取代基"],
  pharm: ["製成 {{phosphate|結構}} 前驅物 → 可使水溶性提高",
    "治療{{小細胞肺癌|疾病}}、難治型睪丸癌",
    "副作用：嘔吐、低血壓、可逆性禿髮",
    "{{低白蛋白|性質|高白蛋白}}患者發生毒性之機率較高"] },
{ id: "ca-teniposide", chapter: 26, name: "Teniposide", type: "drug", group: "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 Topoisomerase II", source: "統整（二）p.73", img: "assets/medchem/ca-teniposide.png",
  feat: ["C₁、C₄ 的取代基為 trans form",
    "由 Etoposide 衍生，加上 {{thiophene|結構}}★雜環"],
  pharm: ["治療難治型兒童急性{{淋巴白血病|疾病}}"] },
{ id: "ca-camptothecin", chapter: 26, name: "Camptothecin", type: "drug", group: "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 Topoisomerase I", source: "統整（二）p.74", img: "assets/medchem/ca-camptothecin.png",
  feat: ["（如上所述）"] },
{ id: "ca-topotecan", chapter: 26, name: "Topotecan", type: "drug", group: "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 Topoisomerase I", source: "統整（二）p.74", img: "assets/medchem/ca-topotecan.png",
  feat: ["A 環有 OH 及 {{dimethylamino|取代基}} 取代：提高水溶性、降低非預期副作用發生"],
  pharm: ["治療轉移性{{卵巢癌|疾病}}"] },
{ id: "ca-irinotecan", chapter: 26, name: "Irinotecan", type: "drug", group: "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 Topoisomerase I", source: "統整（二）p.74", img: "assets/medchem/ca-irinotecan.png",
  feat: ["具有 {{Piperidine|結構}}★雜環",
    "具有 Carbamate 結構"],
  pharm: ["{{Prodrug|名詞}}，經肝臟 {{Carboxylase|酵素}} 代謝為 {{SN-38|代謝物}} 後，藥效更強",
    "CYP3A4 代謝，使 piperidine 開環",
    "治療轉移性{{直腸結腸癌|疾病}}"] },
{ id: "ca-asparaginase", chapter: 26, name: "Asparaginase", type: "drug", group: "酵素類藥物（Enzymes）", source: "統整（二）p.75",
  desc: ["正常的細胞可自行合成 {{L-Asparagine|物質}}，癌細胞則不能自行合成",
    "L-Asparaginase 因能分解血液中的 L-Asparagine，使需要 L-Asparagine 的癌細胞缺乏營養而達到其抗癌作用",
    "治療{{急性淋巴白血病|疾病}}"] },
{ id: "ca-hydroxyurea", chapter: 26, name: "Hydroxyurea", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-hydroxyurea.png",
  feat: ["尿素中 N 上的一個 H 被 {{OH|取代基}} 取代",
    "抑制 {{Ribonucleotide reductase|酵素}}★，使合成 DNA 的原料減少"],
  pharm: ["作用於 {{S phase|名詞}}",
    "治療急/慢性骨髓白血病、{{鐮刀型貧血|疾病}}"] },
{ id: "ca-pentostatin", chapter: 26, name: "Pentostatin", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-pentostatin.png",
  feat: ["含有 {{Tetrahydrodiazepine|結構}}★結構"],
  pharm: ["機轉：{{Adenosine deaminase|酵素}}★的{{不可逆|性質|可逆}}抑制劑",
    "治療{{髮狀細胞白血病|疾病}}"] },
{ id: "ca-tretinoin", chapter: 26, name: "Tretinoin", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-tretinoin.png",
  feat: ["{{維他命 A 酸|藥物類別}}（Retinoid acid）衍生結構",
    "→ 立體組態全部變為 {{trans form|結構|cis form}}"],
  pharm: ["治療標的為 {{PML-RAR-α|標的}} 異常基因",
    "誘導急性前髓性白血球正常分化，治療急性前髓性白血病（{{APL|疾病}}）"] },
{ id: "ca-mitotane", chapter: 26, name: "Mitotane", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-mitotane.png",
  desc: ["治療{{腎上腺皮質癌|疾病}}"] },
{ id: "ca-bexarotene", chapter: 26, name: "Bexarotene", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-bexarotene.png",
  desc: ["作用機轉未知，治療{{皮膚 T 細胞淋巴癌|疾病}}"] },
{ id: "ca-arsenic", chapter: 26, name: "Arsenic trioxide（As₂O₃）", short: "As₂O₃", type: "drug", group: "其他抗癌藥物", source: "統整（二）p.75", img: "assets/medchem/ca-arsenic.png",
  desc: ["即{{砒霜|藥名}}，治療{{急性骨髓白血病|疾病}}"] },
{ id: "ca-trastuzumab", chapter: 26, name: "Trastuzumab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：{{Anti-HER2|標的}}★（IgG₁）"],
  act: ["抑制 {{EGFR-2|受體}}（HER2）"],
  ind: ["兩者併用治療{{乳癌|疾病}}（{{HER2-positive|名詞}} 首選★）"],
  rmk: ["具有{{心毒性|副作用}}；不可使用 {{D5W|物質}} 稀釋，會使蛋白質凝集"] },
{ id: "ca-pertuzumab", chapter: 26, name: "Pertuzumab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：{{Anti-HER2|標的}}★（IgG₁）"],
  act: ["抑制 {{EGFR-2|受體}}（HER2）"],
  ind: ["兩者併用治療{{乳癌|疾病}}（{{HER2-positive|名詞}} 首選★）"],
  rmk: ["具有{{心毒性|副作用}}；不可使用 {{D5W|物質}} 稀釋，會使蛋白質凝集"] },
{ id: "ca-panitumumab", chapter: 26, name: "Panitumumab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：Anti-EGFR★",
    "{{IgG₂|名詞}} 抗體"],
  act: ["抑制 {{EGFR|受體}}"],
  ind: ["轉移性結腸直腸癌"],
  rmk: ["{{K-Ras|名詞}} 基因無突變時才可使用"] },
{ id: "ca-cetuximab", chapter: 26, name: "Cetuximab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：Anti-EGFR★"],
  act: ["抑制 {{EGFR-1|受體}}（HER1）★"],
  ind: ["併 {{Irinotecan|藥名}} 治大腸直腸癌★"],
  rmk: ["K-Ras 基因無突變時之末期首選藥物；可 IV {{Diphenhydramine|藥名}} 預防紅疹"] },
{ id: "ca-rituximab", chapter: 26, name: "Rituximab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：Anti-CD20"],
  act: ["抑制 {{B cell|名詞}} 的 {{CD20|受體}} 受體"],
  ind: ["{{Non-Hodgkin disease|疾病}}"],
  rmk: ["低血壓、SJS、{{HBV 復發|副作用}}"] },
{ id: "ca-bevacizumab", chapter: 26, name: "Bevacizumab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：{{Anti-VEGF|標的}}★"],
  act: ["Anti-VEGF，抑制{{血管新生|機轉}}"],
  ind: ["非小細胞肺癌、大腸直腸癌"],
  rmk: ["高血壓、血栓、{{胃穿孔|副作用}}、出血★"] },
{ id: "ca-ibritumomab", chapter: 26, name: "Ibritumomab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：Anti-CD20 Radiation（結合 B 細胞並釋放輻射線）"],
  act: ["{{Y⁹⁰|物質}} 接在 Rituximab 上"],
  ind: ["復發或對化療與 Rituximab 具抗藥性的 Non-Hodgkin"],
  rmk: ["輸注反應、骨髓抑制、噁心、疲勞"] },
{ id: "ca-tositumomab", chapter: 26, name: "Tositumomab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：Anti-CD20 Radiation（結合 B 細胞並釋放輻射線）"],
  act: ["{{I¹³¹|物質}} 接在 Rituximab 上"],
  ind: ["復發或對化療與 Rituximab 具抗藥性的 Non-Hodgkin"],
  rmk: ["輸注反應、骨髓抑制、噁心、副甲狀腺功能低下"] },
{ id: "ca-alemtuzumab", chapter: 26, name: "Alemtuzumab", type: "drug", group: "單株抗體（Monoclonal Antibodies）", source: "統整（二）p.76",
  feat: ["受體：{{Anti-CD52|標的}}"],
  act: ["Anti-CD52"],
  ind: ["B 細胞 CLL、淋巴癌"],
  rmk: ["骨髓抑制、感染、發燒、紅疹"] },
{ id: "ca-ipilimumab", chapter: 26, name: "Ipilimumab", type: "drug", group: "免疫療法（Immune Checkpoint Inhibitors）", source: "統整（二）p.76",
  feat: ["抑制淋巴結 {{CTLA-4|標的}}"],
  act: ["活化淋巴結 T cell 免疫功能"],
  ind: ["轉移性{{黑色素瘤|疾病}}"],
  rmk: ["副作用較烷化劑小，專一性針對腫瘤或免疫 T 細胞"] },
{ id: "ca-nivolumab", chapter: 26, name: "Nivolumab", type: "drug", group: "免疫療法（Immune Checkpoint Inhibitors）", source: "統整（二）p.76",
  feat: ["結合 T 細胞之 {{PD-1|標的}}"],
  act: ["阻斷腫瘤的 {{PDL-1|標的}} 受體，使 T cell 免疫功能不會被抑制"],
  ind: ["非小細胞肺癌、黑色素瘤、{{Hodgkin|疾病}}"],
  rmk: ["副作用較烷化劑小，專一性針對腫瘤或免疫 T 細胞"] },
{ id: "ca-pembrolizumab", chapter: 26, name: "Pembrolizumab", type: "drug", group: "免疫療法（Immune Checkpoint Inhibitors）", source: "統整（二）p.76",
  feat: ["結合 T 細胞之 PD-1"],
  act: ["阻斷腫瘤的 {{PDL-1|標的}} 受體，使 T cell 免疫功能不會被抑制"],
  ind: ["非小細胞肺癌、黑色素瘤、頭頸癌"],
  rmk: ["副作用較烷化劑小，專一性針對腫瘤或免疫 T 細胞"] },
{ id: "ca-atezolizumab", chapter: 26, name: "Atezolizumab", type: "drug", group: "免疫療法（Immune Checkpoint Inhibitors）", source: "統整（二）p.76",
  feat: ["結合腫瘤細胞 {{PD-L1|標的}}"],
  act: ["阻斷腫瘤的 {{PDL-1|標的}} 受體，使 T cell 免疫功能不會被抑制"],
  ind: ["{{膀胱癌|疾病}}"],
  rmk: ["副作用較烷化劑小，專一性針對腫瘤或免疫 T 細胞"] },
{ id: "ca-avelumab", chapter: 26, name: "Avelumab", type: "drug", group: "免疫療法（Immune Checkpoint Inhibitors）", source: "統整（二）p.76",
  feat: ["結合腫瘤細胞 PD-L1"],
  act: ["阻斷腫瘤的 {{PDL-1|標的}} 受體，使 T cell 免疫功能不會被抑制"],
  ind: ["膀胱癌"],
  rmk: ["副作用較烷化劑小，專一性針對腫瘤或免疫 T 細胞"] },
{ id: "ca-ceritinib", chapter: 26, name: "Ceritinib", type: "drug", group: "ALK Inhibitors", source: "統整（二）p.77",
  act: ["抑制致癌基因之融合蛋白表現 → 抑制細胞增生、轉移"],
  ind: ["非小細胞肺癌"],
  rmk: ["{{Creatinine|物質}} 增加、高血糖"] },
{ id: "ca-crizotinib", chapter: 26, name: "Crizotinib", type: "drug", group: "ALK Inhibitors", source: "統整（二）p.77",
  act: ["抑制致癌基因之融合蛋白表現 → 抑制細胞增生、轉移"],
  ind: ["非小細胞肺癌"],
  rmk: ["味覺障礙、水腫、{{Bradycardia|副作用}}"] },
{ id: "ca-imatinib", chapter: 26, name: "Imatinib", type: "drug", group: "BCR-ABL Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-imatinib.png",
  feat: ["含有 {{Piperazine|結構}} 結構"],
  act: ["抑制 {{BCR-ABL|標的}}（Tyrosine kinase）"],
  ind: ["慢性骨髓性白血病 {{CML|疾病}}★"],
  rmk: ["體液滯留、頭痛、肌肉痠痛、肝毒性"] },
{ id: "ca-nilotinib", chapter: 26, name: "Nilotinib", type: "drug", group: "BCR-ABL Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-nilotinib.png",
  feat: ["具有 {{Imidazole|結構}}、{{CF₃|取代基}} 結構"],
  act: ["抑制 BCR-ABL（Tyrosine kinase）"],
  ind: ["慢性骨髓性白血病 CML★"],
  rmk: ["高血糖、{{QT 延長|副作用}}、肌肉痠痛、肝毒性"] },
{ id: "ca-dasatinib", chapter: 26, name: "Dasatinib", type: "drug", group: "BCR-ABL Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-dasatinib.png",
  feat: ["含有 {{thiazole|結構}} 結構"],
  act: ["抑制 BCR-ABL（Tyrosine kinase）"],
  ind: ["慢性骨髓性白血病 CML★"],
  rmk: ["體液滯留、{{肋膜積水|副作用}}"] },
{ id: "ca-erlotinib", chapter: 26, name: "Erlotinib", type: "drug", group: "EGFR Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-erlotinib.png",
  feat: ["含有{{三鍵|結構}}結構"],
  act: ["{{可逆性|性質|不可逆}}抑制 EGFR"],
  ind: ["非小細胞肺癌"],
  rmk: ["腹瀉、痤瘡膿皰、食慾下降、間質性肺病"] },
{ id: "ca-afatinib", chapter: 26, name: "Afatinib", type: "drug", group: "EGFR Kinase Inhibitors", source: "統整（二）p.77",
  act: ["{{不可逆|性質|可逆}}抑制 EGFR"],
  ind: ["EGFR 突變的轉移性非小細胞肺癌"],
  rmk: ["腹瀉、水泡、脫屑、間質性肺病"] },
{ id: "ca-gefitinib", chapter: 26, name: "Gefitinib", type: "drug", group: "EGFR Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-gefitinib.png",
  feat: ["含有 {{Morpholine|結構}} 結構"],
  act: ["抑制 EGFR"],
  ind: ["非小細胞肺癌★、非扁平細胞肺癌之腺癌"],
  rmk: ["皮膚疹、間質性肺病"] },
{ id: "ca-lapatinib", chapter: 26, name: "Lapatinib", type: "drug", group: "EGFR & HER2 Inhibitors", source: "統整（二）p.77、79", img: "assets/medchem/ca-lapatinib.png",
  feat: ["具有 4-{{anilinoquinazoline|結構}} 結構",
    "含有 {{Methylsulfone|結構}} 可增加水溶性",
    "{{m-fluorophenylmethoxy|結構}} 可增加對 HER2 的作用"],
  act: ["抑制 HER2、EGFR"],
  ind: ["乳癌"],
  rmk: ["腹瀉、骨髓抑制、QT 延長、肝肺毒性"] },
{ id: "ca-axitinib", chapter: 26, name: "Axitinib", type: "drug", group: "VEGFR Kinase Inhibitors", source: "統整（二）p.77",
  act: ["抑制 VEGF1、2、3"],
  ind: ["{{胰臟癌|疾病}}"],
  rmk: ["高血壓、{{手足症候群|副作用}}、紅疹、腹瀉、嘔吐"] },
{ id: "ca-pazopanib", chapter: 26, name: "Pazopanib", type: "drug", group: "VEGFR Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-pazopanib.png",
  feat: ["含有 {{Sulfonamide|結構}} 結構"],
  act: ["抑制 c-KIT、PDGFR、FGFR"],
  ind: ["腎細胞癌"],
  rmk: ["高血壓、視力模糊、肌肉痙攣、掉髮"] },
{ id: "ca-sorafenib", chapter: 26, name: "Sorafenib", type: "drug", group: "VEGFR Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-sorafenib.png",
  feat: ["含有 {{Urea|結構}} 結構"],
  act: ["抑制血管新生"],
  ind: ["肝癌、腎細胞癌"],
  rmk: ["高血壓、骨髓抑制、紅疹、手足症候群"] },
{ id: "ca-sunitinib", chapter: 26, name: "Sunitinib", type: "drug", group: "VEGFR Kinase Inhibitors", source: "統整（二）p.77–78", img: "assets/medchem/ca-sunitinib.png",
  feat: ["含有 {{Indoline|結構}}、{{Pyrrole|結構}} 結構"],
  act: ["抑制 PDGFR-α、FLT-3"],
  ind: ["胃腸道基質瘤、腎細胞癌"],
  rmk: ["皮膚脫色、手足症、骨髓抑制、QT 延長"] },
{ id: "ca-bortezomib", chapter: 26, name: "Bortezomib", type: "drug", group: "Proteasome Inhibitor", source: "統整（二）p.77、79", img: "assets/medchem/ca-bortezomib.png",
  feat: ["具有 {{Boric acid|結構}} 官能基"],
  act: ["抑制{{蛋白酶體|標的}}，導致細胞凋亡"],
  ind: ["多發性骨髓瘤"],
  rmk: ["噁心嘔吐、血小板減少、周邊神經病變"] },
{ id: "ca-sirolimus", chapter: 26, name: "Sirolimus", type: "drug", group: "mTOR Inhibitor", source: "統整（二）p.77",
  act: ["抑制 {{mTOR kinase|標的}}、VEGFR"],
  ind: ["HER2(-)乳癌、胰臟神經內分泌腫瘤"],
  rmk: ["肺炎、高血糖、高血脂、電解質不平衡"] },
{ id: "ca-everolimus", chapter: 26, name: "Everolimus", type: "drug", group: "mTOR Inhibitor", source: "統整（二）p.77、79", img: "assets/medchem/ca-everolimus.png",
  feat: ["{{Rapamycin|藥名}} 衍生物"],
  act: ["抑制 mTOR kinase、VEGFR"],
  ind: ["HER2(-)乳癌、胰臟神經內分泌腫瘤"],
  rmk: ["肺炎、高血糖、高血脂、電解質不平衡"] },
{ id: "ca-lenalidomide", chapter: 26, name: "Lenalidomide", type: "drug", group: "免疫調節劑（Immunomodulators）", source: "統整（二）p.77、79", img: "assets/medchem/ca-lenalidomide.png",
  feat: ["苯環上有 {{NH₂|取代基}} 取代",
    "具有 {{Glutarimide|結構}} 結構"],
  act: ["抑制內皮細胞生長與抑制{{血管新生|機轉}}★"],
  ind: ["肺癌、多發性骨髓瘤、卵巢癌"],
  rmk: ["便秘；海豹肢、周邊神經病變、靜脈血栓栓塞★、孕婦禁用"] },
{ id: "ca-thalidomide", chapter: 26, name: "Thalidomide", type: "drug", group: "免疫調節劑（Immunomodulators）", source: "統整（二）p.77、79", img: "assets/medchem/ca-thalidomide.png", imgMore: ["assets/medchem/ca-glutarimide.png"],
  feat: ["五元雜環有{{兩個|數值}} C=O",
    "具有 Glutarimide 結構（右圖結構）"],
  act: ["抑制內皮細胞生長與抑制血管新生★"],
  ind: ["多發性骨髓瘤"],
  rmk: ["腹瀉；海豹肢、周邊神經病變、靜脈血栓栓塞★、孕婦禁用"] },
{ id: "ca-belimumab", chapter: 26, name: "Belimumab", type: "drug", group: "B 細胞調節劑", source: "統整（二）p.77",
  act: ["抑制 {{B 細胞|名詞}}活化★"],
  ind: ["全身性紅斑性狼瘡 {{SLE|疾病}}"] },

/* ===== 第 29 章（統整（三）壹 自主神經系統簡介 p.3–7；畫面章號 1）===== */
/* 統整（三）每一單元都編在 PI.CHAPTERS 的 id 29 以後（畫面章號用 no 照講義單元編號）；講義頁碼是統整（三）的頁碼。
   這章是總論：p.3 受體分布、p.4 受體作用總表、p.5 二級傳訊系統三張表、p.7 的 ACh 與 Epinephrine 生合成都放告示牌；
   p.6 的「影響傳訊機制的藥物」表放該分類的知識卡，表下的 Metyrosine／Reserpine／Guanethidine 三個結構各一格，文字放說明（desc）。 */

{ id: "an-metyrosine", chapter: 29, name: "Metyrosine", type: "drug", group: "影響傳訊機制的藥物（自主神經）", source: "統整（三）p.6", img: "assets/medchem/an-metyrosine.png",
  desc: ["α碳上有{{甲基|取代基}}取代，只有 {{S form|結構|R form}} 具活性",
    "{{Tyrosine hydroxylase|酵素}} 競爭抑制劑★"] },
{ id: "an-reserpine", chapter: 29, name: "Reserpine", type: "drug", group: "影響傳訊機制的藥物（自主神經）", source: "統整（三）p.6", img: "assets/medchem/an-reserpine.png",
  desc: ["具有{{五個|數值}}環狀結構（{{Yohimban|結構}}）",
    "含有 {{Indole|結構}} 雜環",
    "副作用：{{憂鬱症|副作用}}"] },
{ id: "an-guanethidine", chapter: 29, name: "Guanethidine", type: "drug", group: "影響傳訊機制的藥物（自主神經）", source: "統整（三）p.6", img: "assets/medchem/an-guanethidine.png",
  desc: ["具有親水 {{guanidine|結構}} 基團，{{無|性質|有}}憂鬱副作用",
    "在肝臟被 {{FMN|物質}} 進行 {{N-oxide|代謝}} 代謝"] },

/* ===== 第 30 章（統整（三）貳 擬交感神經作用藥物 p.8–11；畫面章號 2）===== */
/* 一、直接作用劑：灰底非選擇性致效劑（內生性兒茶酚胺）、選擇性 α₁ 致效劑（底下 Catecholamine 類結構／Imidazoline 類結構是第三層小標）、選擇性 α₂ 致效劑、非選擇性 β 致效劑、混和型致效劑、選擇性 β₂ 致效劑（短效／長效）；
   二、間接作用劑沒有灰底，章節標題就是分類（加後綴避免重名）；p.9 的受體親和力大小放告示牌；三、個論的麻黃素立體關係圖與四點說明放告示牌。
   p.8–9 的表格沒有欄位名稱（藥名在上、結構與文字在下），文字放「說明」；p.10 欄位是特性／藥理及臨床應用。 */

{ id: "sy-norepinephrine", chapter: 30, name: "Norepinephrine", type: "drug", group: "非選擇性致效劑：內生性兒茶酚胺（Endogenous catecholamines）", source: "統整（三）p.8", img: "assets/medchem/sy-norepinephrine.png",
  desc: ["3-OH 受 {{COMT|酵素}} 作用進行{{甲基化|代謝}}反應"] },
{ id: "sy-epinephrine", chapter: 30, name: "Epinephrine", type: "drug", group: "非選擇性致效劑：內生性兒茶酚胺（Endogenous catecholamines）", source: "統整（三）p.8", img: "assets/medchem/sy-epinephrine.png"  },
{ id: "sy-dipivefrin", chapter: 30, name: "Dipivefrin", type: "drug", group: "非選擇性致效劑：內生性兒茶酚胺（Endogenous catecholamines）", source: "統整（三）p.8", img: "assets/medchem/sy-dipivefrin.png"  },
{ id: "sy-phenylephrine", chapter: 30, name: "Phenylephrine", type: "drug", group: "Catecholamine 類結構（α₁ 致效劑）", source: "統整（三）p.8", img: "assets/medchem/sy-phenylephrine.png"  },
{ id: "sy-methoxamine", chapter: 30, name: "Methoxamine", type: "drug", group: "Catecholamine 類結構（α₁ 致效劑）", source: "統整（三）p.8", img: "assets/medchem/sy-methoxamine.png",
  desc: ["代謝物具有{{活性|性質|無活性}}"] },
{ id: "sy-midodrine", chapter: 30, name: "Midodrine", type: "drug", group: "Catecholamine 類結構（α₁ 致效劑）", source: "統整（三）p.8", img: "assets/medchem/sy-midodrine.png",
  desc: ["代謝物具有{{活性|性質|無活性}}"] },
{ id: "sy-naphazoline", chapter: 30, name: "Naphazoline", type: "drug", group: "Imidazoline 類結構：皆含有 phenylethylamine 的骨架", source: "統整（三）p.8", img: "assets/medchem/sy-naphazoline.png",
  desc: ["{{眼藥水|名詞}}常見成分，可使眼睛血管收縮"] },
{ id: "sy-oxymetazoline", chapter: 30, name: "Oxymetazoline", type: "drug", group: "Imidazoline 類結構：皆含有 phenylethylamine 的骨架", source: "統整（三）p.8", img: "assets/medchem/sy-oxymetazoline.png",
  desc: ["市售{{解鼻塞|用途}}噴劑常見成分"] },
{ id: "sy-xylometazoline", chapter: 30, name: "Xylometazoline", type: "drug", group: "Imidazoline 類結構：皆含有 phenylethylamine 的骨架", source: "統整（三）p.8", img: "assets/medchem/sy-xylometazoline.png"  },
{ id: "sy-clonidine", chapter: 30, name: "Clonidine", type: "drug", group: "選擇性 α₂ 致效劑", source: "統整（三）p.8", img: "assets/medchem/sy-clonidine.png",
  desc: ["4-NH₂ 代謝物對 α₂ 選擇性降低，可治療{{青光眼|疾病}}",
    "4-OH 代謝物極性{{高|性質|低}}，無法進入 {{CNS|器官}}"] },
{ id: "sy-methyldopa", chapter: 30, name: "Methyldopa", type: "drug", group: "選擇性 α₂ 致效劑", source: "統整（三）p.8", img: "assets/medchem/sy-methyldopa.png",
  desc: ["{{1R、2S|結構}} 構型可增加 α₂ 活性，但 α₁ 活性會降低",
    "{{非|性質}} imidazoline 結構"] },
{ id: "sy-brimonidine", chapter: 30, name: "Brimonidine", type: "drug", group: "選擇性 α₂ 致效劑", source: "統整（三）p.8", img: "assets/medchem/sy-brimonidine.png",
  desc: ["{{青光眼|疾病}}首選藥"] },
{ id: "sy-isoproterenol", chapter: 30, name: "Isoproterenol", type: "drug", group: "非選擇性 β 致效劑", source: "統整（三）p.9", img: "assets/medchem/sy-isoproterenol.png"  },
{ id: "sy-dopamine", chapter: 30, name: "Dopamine", type: "drug", group: "混和型致效劑", source: "統整（三）p.9", img: "assets/medchem/sy-dopamine.png"  },
{ id: "sy-dobutamine", chapter: 30, name: "Dobutamine", type: "drug", group: "混和型致效劑", source: "統整（三）p.9", img: "assets/medchem/sy-dobutamine.png"  },
{ id: "sy-albuterol", chapter: 30, name: "Albuterol（Salbutamol）", short: "Albuterol", type: "drug", group: "選擇性 β₂ 致效劑（短效）", source: "統整（三）p.9", img: "assets/medchem/sy-albuterol.png"  },
{ id: "sy-terbutaline", chapter: 30, name: "Terbutaline", type: "drug", group: "選擇性 β₂ 致效劑（短效）", source: "統整（三）p.9", img: "assets/medchem/sy-terbutaline.png"  },
{ id: "sy-formoterol", chapter: 30, name: "Formoterol", type: "drug", group: "選擇性 β₂ 致效劑（長效）", source: "統整（三）p.9", img: "assets/medchem/sy-formoterol.png"  },
{ id: "sy-salmeterol", chapter: 30, name: "Salmeterol", type: "drug", group: "選擇性 β₂ 致效劑（長效）", source: "統整（三）p.9", img: "assets/medchem/sy-salmeterol.png"  },
{ id: "sy-indacaterol", chapter: 30, name: "Indacaterol", type: "drug", group: "選擇性 β₂ 致效劑（長效）", source: "統整（三）p.9", img: "assets/medchem/sy-indacaterol.png"  },
{ id: "sy-amphetamine", chapter: 30, name: "Amphetamine（安非他命）", short: "Amphetamine", type: "drug", group: "間接作用劑（擬交感神經）", source: "統整（三）p.10", img: "assets/medchem/sy-amphetamine.png",
  desc: ["屬於{{鹼性|性質|酸性}}藥物",
    "基本結構：{{Phenylisopropylamine|結構}}"],
  feat: ["{{脂溶性高|性質|脂溶性低}}，{{間接|機轉|直接}}作用在神經系統，可釋放細胞內儲存的兒茶酚胺類，也會抑制 {{MAO|酵素}}",
    "具有 {{1|數值}} 個 chiral center，作用大小為：{{S(+)|結構}} > (±) > R(-)★",
    "SAR：① 芳香環最好{{不要|性質|一定要}}有取代基　② 胺基：{{甲基|取代基}}取代最好，且 1° > 2° > 3°",
    "③ α碳取代：{{α-CH₃|取代基}}最好，且 S > R　④ β碳取代：{{酮基|取代基}}可保留，其他取代不佳",
    "代謝（{{不受|性質|受}} COMT 代謝）",
    "1. 經由 α-hydroxylation 和 oxidative deamination 產生 {{phenylacetone|代謝物}}（尿液檢測）",
    "2. phenylacetone 再被氧化代謝成 {{Benzoic acid|代謝物}}",
    "3. 苯甲酸可和 {{Glycine|物質}} 共軛生成最終代謝物 {{Hippuric acid|代謝物}}"] },
{ id: "sy-hydroxyamphetamine", chapter: 30, name: "Hydroxyamphetamine", type: "drug", group: "間接作用劑（擬交感神經）", source: "統整（三）p.10", img: "assets/medchem/sy-hydroxyamphetamine.png",
  feat: ["苯環上具 {{OH|取代基}} 基，極性高，{{無法|性質|可以}}進入 CNS"],
  pharm: ["可和 {{Atropine|藥名}} 併用使{{瞳孔擴張|用途}}，用於視力檢查"] },
{ id: "sy-propylhexedrine", chapter: 30, name: "Propylhexedrine", type: "drug", group: "間接作用劑（擬交感神經）", source: "統整（三）p.10", img: "assets/medchem/sy-propylhexedrine.png",
  feat: ["結構變為{{環己烷|結構}}，失去苯環的平面結構，因此{{難以|性質|容易}}進入 CNS"],
  pharm: ["可使{{鼻腔|器官}}血管收縮，治療{{鼻塞|疾病}}"] },

/* ===== 第 31 章（統整（三）參 擬交感神經拮抗藥物 p.12–17；畫面章號 3）===== */
/* 一～六各小標的灰底（非選擇性 α 拮抗劑、選擇性 α₁ 拮抗劑（底下 α₁A 為第三層小標）、選擇性 α₂ 拮抗劑）和沒有灰底的四、五、六（章節標題就是分類）；
   p.13 的 α₁ 拮抗劑 SAR 結構與說明、四～六各節的共通說明與 ※ 註放該分類的知識卡；Prazosin／Terazosin／Doxazosin 只有結構；
   p.15–16 的表格沒有欄位名稱（藥名在上、特性在結構下方），文字放「說明」。講義一格兩藥共用的說明（Tolazoline／Phentolamine 的副作用、Tamsulosin／Alfuzosin 的藥理）兩格都放。 */

{ id: "ad-tolazoline", chapter: 31, name: "Tolazoline", type: "drug", group: "非選擇性 α 拮抗劑", source: "統整（三）p.12", img: "assets/medchem/ad-tolazoline.png",
  feat: ["具有 {{imidazoline|結構}} 結構"],
  pharm: ["副作用：{{反射性心跳加快|副作用}}、姿勢性低血壓、性功能障礙",
    "治療{{嗜鉻細胞瘤|疾病}}、周邊血管痙攣"] },
{ id: "ad-phentolamine", chapter: 31, name: "Phentolamine", type: "drug", group: "非選擇性 α 拮抗劑", source: "統整（三）p.12", img: "assets/medchem/ad-phentolamine.png",
  feat: ["具有 imidazoline 結構"],
  pharm: ["副作用：{{反射性心跳加快|副作用}}、姿勢性低血壓、性功能障礙",
    "治療{{嗜鉻細胞瘤|疾病}}、周邊血管痙攣"] },
{ id: "ad-phenoxybenzamine", chapter: 31, name: "Phenoxybenzamine", type: "drug", group: "非選擇性 α 拮抗劑", source: "統整（三）p.12", img: "assets/medchem/ad-phenoxybenzamine.png",
  feat: ["具有 {{β-haloalkylamine|結構}}",
    "類似 {{Nitrogen mustard|藥物類別}} 會形成 {{aziridinium|代謝物}}，與受體形成{{不可逆|性質|可逆}}共價鍵★"],
  pharm: ["治療{{嗜鉻細胞瘤|疾病}}"] },
{ id: "ad-prazosin", chapter: 31, name: "Prazosin", type: "drug", group: "選擇性 α₁ 拮抗劑", source: "統整（三）p.13", img: "assets/medchem/ad-prazosin.png"  },
{ id: "ad-terazosin", chapter: 31, name: "Terazosin", type: "drug", group: "選擇性 α₁ 拮抗劑", source: "統整（三）p.13", img: "assets/medchem/ad-terazosin.png"  },
{ id: "ad-doxazosin", chapter: 31, name: "Doxazosin", type: "drug", group: "選擇性 α₁ 拮抗劑", source: "統整（三）p.13", img: "assets/medchem/ad-doxazosin.png"  },
{ id: "ad-tamsulosin", chapter: 31, name: "Tamsulosin", type: "drug", group: "選擇性 α₁A 拮抗劑", source: "統整（三）p.13", img: "assets/medchem/ad-tamsulosin.png",
  feat: ["α₁ 拮抗劑中{{唯一|性質}}不具 {{quinazoline|結構}} 結構",
    "不具有 piperazine 結構",
    "不具有 {{amide linkage|結構}}"],
  pharm: ["專一作用在 {{α₁A|受體}} 受體",
    "治療{{良性前列腺肥大|疾病}}"] },
{ id: "ad-alfuzosin", chapter: 31, name: "Alfuzosin", type: "drug", group: "選擇性 α₁A 拮抗劑", source: "統整（三）p.13", img: "assets/medchem/ad-alfuzosin.png",
  feat: ["{{Prazosin|藥名}} 的 {{propylenediamine|結構}} 衍生物",
    "不具有 piperazine 結構"],
  pharm: ["專一作用在 {{α₁A|受體}} 受體",
    "治療{{良性前列腺肥大|疾病}}"] },
{ id: "ad-yohimbine", chapter: 31, name: "Yohimbine", type: "drug", group: "選擇性 α₂ 拮抗劑", source: "統整（三）p.14", img: "assets/medchem/ad-yohimbine.png",
  feat: ["具有 {{indole|結構}} 結構，且 C₁₆ 接 {{α|結構|β}}-酯鍵"],
  pharm: ["可使血壓上升，改善{{姿勢性低血壓|疾病}}",
    "抑制血管收縮，改善男性{{勃起障礙|疾病}}"] },
{ id: "ad-corynanthine", chapter: 31, name: "Corynanthine", type: "drug", group: "選擇性 α₂ 拮抗劑", source: "統整（三）p.14", img: "assets/medchem/ad-corynanthine.png",
  feat: ["具有 indole 結構，且 C₁₆ 接 {{β|結構|α}}-酯鍵",
    "為 {{Yohimbine|藥名}} 的 {{epimer|名詞}}"],
  pharm: ["治療高血壓、良性前列腺肥大"] },
{ id: "ad-mirtazapine", chapter: 31, name: "Mirtazapine", type: "drug", group: "選擇性 α₂ 拮抗劑", source: "統整（三）p.14", img: "assets/medchem/ad-mirtazapine.png",
  feat: ["具有 {{piperazine|結構}}、{{pyridine|結構}}、{{benzene|結構}} 結構"],
  pharm: ["可用於治療{{憂鬱症|疾病}}（因 {{5-HT|物質}} 濃度↑）"] },
{ id: "ad-propranolol", chapter: 31, name: "Propranolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-propranolol.png",
  desc: ["為非選擇性 β 拮抗劑{{原型|名詞}}，後續藥物多修飾{{苯環|結構}}上的取代基",
    "具有 {{Naphthalene|結構}} 結構，{{脂溶性高|性質|脂溶性低}}可作用於 CNS，治療中樞神經失調",
    "代謝物：{{4-hydroxypropranolol|代謝物}}（有活性）、{{naphthoxyacetic acid|代謝物}}（無活性）"] },
{ id: "ad-carteolol", chapter: 31, name: "Carteolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-carteolol.png",
  desc: ["具有{{內生交感活性|機轉}}"] },
{ id: "ad-penbutolol", chapter: 31, name: "Penbutolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-penbutolol.png",
  desc: ["具有{{內生交感活性|機轉}}"] },
{ id: "ad-pindolol", chapter: 31, name: "Pindolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-pindolol.png",
  desc: ["具有{{內生交感活性|機轉}}"] },
{ id: "ad-nadolol", chapter: 31, name: "Nadolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-nadolol.png",
  desc: ["具有{{最長|性質|最短}}半衰期"] },
{ id: "ad-timolol", chapter: 31, name: "Timolol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-timolol.png",
  desc: ["含有 {{morpholine|結構}}、{{thiadiazole|結構}} 結構"] },
{ id: "ad-sotalol", chapter: 31, name: "Sotalol", type: "drug", group: "非選擇性 β 拮抗劑", source: "統整（三）p.15", img: "assets/medchem/ad-sotalol.png",
  desc: ["具有{{單環|結構|雙環}}結構，C₄ 接有 {{sulfone|結構}}",
    "{{唯一|性質}}不具有 aryloxypropanolamine 結構"] },
{ id: "ad-atenolol", chapter: 31, name: "Atenolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-atenolol.png",
  desc: ["苯環 C₄ 取代含有 {{amide|結構}}，極性增加 → {{無法|性質|可以}}穿過 BBB"] },
{ id: "ad-acebutolol", chapter: 31, name: "Acebutolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-acebutolol.png",
  desc: ["{{唯一|性質}}苯環 C₂、C₄ 具有取代基",
    "唯一苯環上為 {{amine-substituted|結構}}",
    "具有{{內生性交感活性|機轉}}"] },
{ id: "ad-esmolol", chapter: 31, name: "Esmolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-esmolol.png",
  desc: ["苯環 C₄ 取代含有{{酯鍵|結構}}，易被水解",
    "半衰期{{極短|性質|極長}}"] },
{ id: "ad-metoprolol", chapter: 31, name: "Metoprolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-metoprolol.png",
  desc: ["治療高血壓、心絞痛，可用於{{心衰竭|疾病}}之病人"] },
{ id: "ad-bisoprolol", chapter: 31, name: "Bisoprolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-bisoprolol.png",
  desc: ["可降低心跳速率及抑制 {{Renin|物質}} 釋放",
    "可用於心衰竭之病人"] },
{ id: "ad-nebivolol", chapter: 31, name: "Nebivolol", type: "drug", group: "選擇性 β₁ 拮抗劑", source: "統整（三）p.16", img: "assets/medchem/ad-nebivolol.png",
  desc: ["{{唯一|性質}}具有{{雙環|結構|單環}}結構",
    "副作用較小"] },
{ id: "ad-labetalol", chapter: 31, name: "Labetalol", type: "drug", group: "混合作用型拮抗劑（作用在 α₁、β 受體）", source: "統整（三）p.17", img: "assets/medchem/ad-labetalol.png",
  feat: ["結構左邊類似選擇性 β 拮抗劑，但 N 上具有{{芳香烷基|結構}}取代，因此也具有拮抗 α₁ 活性"],
  pharm: ["{{IV|給藥途徑}} 治療急性高血壓",
    "可用於{{孕婦高血壓|疾病}}"] },
{ id: "ad-carvedilol", chapter: 31, name: "Carvedilol", type: "drug", group: "混合作用型拮抗劑（作用在 α₁、β 受體）", source: "統整（三）p.17", img: "assets/medchem/ad-carvedilol.png",
  feat: ["具有 {{Carbazole|結構}} 結構，具有{{抗氧化|機轉}}作用",
    "{{R form|結構|S form}} 僅具有拮抗 α₁ 的活性"],
  pharm: ["治療高血壓、{{鬱血性心衰竭|疾病}}（心衰竭病人適用）"] },

/* ===== 第 32 章（統整（三）肆 膽鹼性作用藥物 p.18–22；畫面章號 4）===== */
/* 一、直接作用劑：灰底天然化合物、合成化合物（Acetylcholine 及其衍生物）；二、間接作用劑：「可逆型 AChE 抑制劑」灰底底下的
   「四級銨化合物」「三級胺化合物」各自為一類（兩個灰底都放類別名稱，講義沒有黑底，我把兩層灰底合併成一個分類名稱）、不可逆型 AChE 抑制劑、有機磷農藥、解毒劑 Pralidoxime。
   p.20 的 AChE 作用機轉圖、p.22 不可逆抑制劑的老化作用圖放知識卡；Physostigmine 的氧化反應圖、Malathion 的代謝圖、Pralidoxime 的活化機轉圖當附圖。
   Neostigmine／Pyridostigmine 講義共用一格特性與藥理，兩格都放；Ambenonium／Demecarium 整列只有文字，沒有結構。 */

{ id: "ch-pilocarpine", chapter: 32, name: "Pilocarpine", type: "drug", group: "天然化合物（膽鹼性致效劑）", source: "統整（三）p.18", img: "assets/medchem/ch-pilocarpine.png",
  feat: ["含有 {{lactone|結構}}、{{imidazole|結構}}★結構",
    "水解 lactone 環產生無活性的 {{Pilocarpic acid|代謝物}}",
    "經 {{Epimerization|代謝}} 產生無活性的 {{Isopilocarpine|代謝物}}"],
  pharm: ["治療{{急性閉角性青光眼|疾病}}，也可治療{{口乾症|疾病}}（Xerostomia）"] },
{ id: "ch-cevimeline", chapter: 32, name: "Cevimeline", type: "drug", group: "天然化合物（膽鹼性致效劑）", source: "統整（三）p.18", img: "assets/medchem/ch-cevimeline.png",
  feat: ["含有 {{quinuclidine|結構}}★結構",
    "經 {{CYP2D6/3A4|酵素}} 代謝，代謝物皆{{無活性|性質|有活性}}"],
  pharm: ["CNS：作用在 {{M₁|受體}} 受體；淚腺、唾腺上皮組織：作用在 {{M₃|受體}} 受體",
    "治療口乾症、{{Sjogren's syndrome|疾病}}"] },
{ id: "ch-arecoline", chapter: 32, name: "Arecoline", type: "drug", group: "天然化合物（膽鹼性致效劑）", source: "統整（三）p.18", img: "assets/medchem/ch-arecoline.png",
  feat: ["含有 {{tetrahydropyridine|結構}} 結構",
    "來自{{檳榔|名詞}}的生物鹼成分"],
  pharm: ["{{M₁、M₂、M₃|受體}} agonist",
    "在中樞作用類似 {{Nicotine|藥名}}，可緩解阿茲海默症；也可用作驅蟲藥"] },
{ id: "ch-xanomeline", chapter: 32, name: "Xanomeline", type: "drug", group: "天然化合物（膽鹼性致效劑）", source: "統整（三）p.18", img: "assets/medchem/ch-xanomeline.png",
  feat: ["{{Arecoline|藥名}} 類似物",
    "含有 tetrahydropyridine 和 {{1,2,5-thiadiazole|結構}}（與 COOH 具生物等價性）"],
  pharm: ["{{M₁、M₄|受體}} agonist"] },
{ id: "ch-oxotremorine", chapter: 32, name: "Oxotremorine", type: "drug", group: "天然化合物（膽鹼性致效劑）", source: "統整（三）p.18", img: "assets/medchem/ch-oxotremorine.png",
  feat: ["含有 {{lactam|結構}}、{{pyrrolidine|結構}}、{{C≡C|結構}}"],
  pharm: ["三級胺對於親核基（參鍵、氧）的距離與 muscarinic 相近，故有類似作用"] },
{ id: "ch-acetylcholine", chapter: 32, name: "Acetylcholine", type: "drug", group: "合成化合物（Acetylcholine 及其衍生物）", source: "統整（三）p.19", img: "assets/medchem/ch-acetylcholine.png",
  feat: ["容易被水解，半衰期{{短|性質|長}}"],
  pharm: ["臨床上少用（半衰期太短）"] },
{ id: "ch-carbachol", chapter: 32, name: "Carbachol", type: "drug", group: "合成化合物（Acetylcholine 及其衍生物）", source: "統整（三）p.19", img: "assets/medchem/ch-carbachol.png",
  feat: ["由 {{Carbamate|結構}} 結構取代 Acetyl group",
    "{{不容易|性質|容易}}被 AchE 水解"],
  pharm: ["無受體選擇性，不適合全身性給藥（常用局部給藥）",
    "可使睫狀肌收縮，促進前房水排出，治療{{青光眼|疾病}}"] },
{ id: "ch-methacholine", chapter: 32, name: "Methacholine", type: "drug", group: "合成化合物（Acetylcholine 及其衍生物）", source: "統整（三）p.19", img: "assets/medchem/ch-methacholine.png",
  feat: ["β 位較 Acetylcholine 多一個{{甲基|取代基}}取代，不容易被 AchE 水解",
    "{{S-(+)|結構|R-(-)}} form 較有效"],
  pharm: ["對{{毒蕈鹼受體|受體}}有選擇性",
    "消旋化合物可用於診斷{{氣喘|疾病}}"] },
{ id: "ch-bethanechol", chapter: 32, name: "Bethanechol", type: "drug", group: "合成化合物（Acetylcholine 及其衍生物）", source: "統整（三）p.19", img: "assets/medchem/ch-bethanechol.png",
  feat: ["β 位較 {{Carbachol|藥名}} 多一個甲基取代",
    "不容易被 AchE 水解"],
  pharm: ["對毒蕈鹼受體有選擇性",
    "促進{{腸胃道|器官}}收縮及{{排尿|用途}}，用於治療術後腸胃蠕動遲緩及排尿困難"] },
{ id: "ch-neostigmine", chapter: 32, name: "Neostigmine", type: "drug", group: "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）", source: "統整（三）p.20", img: "assets/medchem/ch-neostigmine.png",
  feat: ["四級銨鹽水溶性高，無法進入 CNS，只作用於週邊",
    "Neostigmine、Pyridostigmine 含有 {{Carbamate|結構}} 結構"],
  pharm: ["治療{{重症肌無力|疾病}}、術後腹部膨脹、尿液滯留（無法治療{{青光眼|疾病}}）",
    "可拮抗{{非去極性|性質|去極性}} Nm 阻斷劑的作用",
    "長效型，可預防神經毒氣之作用"] },
{ id: "ch-pyridostigmine", chapter: 32, name: "Pyridostigmine", type: "drug", group: "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）", source: "統整（三）p.20", img: "assets/medchem/ch-pyridostigmine.png",
  feat: ["四級銨鹽水溶性高，無法進入 CNS，只作用於週邊",
    "Neostigmine、Pyridostigmine 含有 Carbamate 結構"],
  pharm: ["治療重症肌無力、術後腹部膨脹、尿液滯留",
    "可拮抗非去極性 Nm 阻斷劑的作用",
    "長效型，可預防神經毒氣之作用"] },
{ id: "ch-edrophonium", chapter: 32, name: "Edrophonium", type: "drug", group: "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）", source: "統整（三）p.20", img: "assets/medchem/ch-edrophonium.png",
  feat: ["[i]meta[/i] 位置有 {{OH|取代基}} 取代"],
  pharm: ["直接與 AChE 結合，抑制作用位",
    "{{診斷|用途}}重症肌無力，可直接增加肌肉張力"] },
{ id: "ch-ambenonium", chapter: 32, name: "Ambenonium", type: "drug", group: "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）", source: "統整（三）p.20",
  desc: ["四級銨鹽，具有 {{Oxamide|結構}} 結構可抵抗 AchE。為長效型，可治療重症肌無力"] },
{ id: "ch-demecarium", chapter: 32, name: "Demecarium", type: "drug", group: "可逆型 AChE 抑制劑：四級銨化合物（水溶性高，無法進入 CNS）", source: "統整（三）p.20",
  desc: ["四級銨鹽，結構類似 {{bis-neostigmine|結構}}，中間接有 {{10 個碳|數值}}。為長效型縮瞳劑，可治療青光眼和內斜視"] },
{ id: "ch-physostigmine", chapter: 32, name: "Physostigmine", type: "drug", group: "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）", source: "統整（三）p.21", img: "assets/medchem/ch-physostigmine.png", imgMore: ["assets/medchem/ch-fig-physo.png"],
  feat: ["含有 {{pyrrolidine|結構}}、{{carbamate|結構}} 結構",
    "鹼性下，脫去 carbamic acid 形成 {{Eseroline|代謝物}}，再自行氧化成紅色的 {{Rubreserine|代謝物}}"],
  pharm: ["可穿過 BBB 抑制 {{Atropine|藥名}} 的中樞作用",
    "治療青光眼、阿茲海默症"] },
{ id: "ch-tacrine", chapter: 32, name: "Tacrine", type: "drug", group: "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）", source: "統整（三）p.21", img: "assets/medchem/ch-tacrine.png",
  feat: ["平面結構，屬於 {{Tetrahydroacridine|結構}} 結構",
    "{{1-hydroxytacrine|代謝物}} 為活性代謝物"],
  pharm: ["{{非選擇性|性質|選擇性}} AChE 抑制劑",
    "具有{{肝毒性|副作用}}★，目前已經下市"] },
{ id: "ch-rivastigmine", chapter: 32, name: "Rivastigmine", type: "drug", group: "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）", source: "統整（三）p.21", img: "assets/medchem/ch-rivastigmine.png",
  feat: ["含有 {{Carbamyl group|結構}}"],
  pharm: ["長效型，{{無|性質|有}}肝毒性",
    "可與 {{tartrate|物質}} 製成鹽類"] },
{ id: "ch-donepezil", chapter: 32, name: "Donepezil", type: "drug", group: "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）", source: "統整（三）p.21", img: "assets/medchem/ch-donepezil.png",
  feat: ["具有 {{Piperidine|結構}} 結構"],
  pharm: ["{{選擇性|性質|非選擇性}} AChE 抑制劑",
    "與 Edrophonium 相同直接作用於水解酶",
    "無肝毒性"] },
{ id: "ch-galantamine", chapter: 32, name: "Galantamine", type: "drug", group: "可逆型 AChE 抑制劑：三級胺化合物（可穿過 BBB，治療阿茲海默症）", source: "統整（三）p.21", img: "assets/medchem/ch-galantamine.png",
  feat: ["天然生物鹼",
    "結構類似 {{Codeine|藥名}}"],
  pharm: ["可和{{尼古丁受體|受體}}異位結合，拮抗箭毒之作用"] },
{ id: "ch-sarin", chapter: 32, name: "Sarin", type: "drug", group: "不可逆型 AChE 抑制劑", source: "統整（三）p.22", img: "assets/medchem/ch-sarin.png",
  feat: ["具有 {{F|取代基}} 原子",
    "強效磷酸化物質"],
  pharm: ["{{無|性質|有}}解毒劑"] },
{ id: "ch-echothiophate", chapter: 32, name: "Echothiophate", type: "drug", group: "不可逆型 AChE 抑制劑", source: "統整（三）p.22", img: "assets/medchem/ch-echothiophate.png",
  pharm: ["治療{{青光眼|疾病}}和斜視中，唯一的{{磷酸酯類|結構}}（phosphoester）藥物"] },
{ id: "ch-parathion", chapter: 32, name: "Parathion", type: "drug", group: "有機磷農藥（Parathion / Malathion）", source: "統整（三）p.22", img: "assets/medchem/ch-parathion.png",
  feat: ["脂溶性高，芳香環具有{{拉電子|性質|推電子}}取代基",
    "含有 {{phosphate|結構}} 結構",
    "為 {{Paraoxon|代謝物}} 之前驅物，代謝後產生之 Paraoxon 毒性較大"] },
{ id: "ch-malathion", chapter: 32, name: "Malathion", type: "drug", group: "有機磷農藥（Parathion / Malathion）", source: "統整（三）p.22", img: "assets/medchem/ch-malathion.png", imgMore: ["assets/medchem/ch-fig-malathion.png"],
  feat: ["脂溶性高，芳香環具有拉電子取代基",
    "Malathion 對{{昆蟲|名詞}}具選擇性生物轉化，對人體{{無|性質|有}}作用"] },
{ id: "ch-pralidoxime", chapter: 32, name: "Pralidoxime（2-PAM）", short: "Pralidoxime", type: "drug", group: "解毒劑：Pralidoxime（2-PAM）", source: "統整（三）p.22", img: "assets/medchem/ch-pralidoxime.png", imgMore: ["assets/medchem/ch-fig-pam.png"],
  feat: ["Irreviersible AchE inhibitor {{唯一|性質}}的解毒劑，需在{{老化作用|機轉}}前使用才有效",
    "{{四級銨鹽|結構}}，只作用於週邊系統，可活化 phosphorylated acetylcholinesterase"] },

/* ===== 第 33 章（統整（三）伍 膽鹼性拮抗藥物 p.23–27；畫面章號 5）===== */
/* 一、抗毒蕈鹼受體藥物：灰底天然茄科生物鹼、胺醇類膽鹼拮抗劑、胺醚類（Aminoether）膽鹼拮抗劑、其他類膽鹼拮抗劑；
   二、抗 Nn 受體藥物（神經節阻斷劑）沒有灰底，章節標題就是分類；三、抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）是黑底大分類，底下三個灰底：非去極化型（競爭型）、類固醇尼古丁受體拮抗劑、去極化性阻斷劑（非競爭型）用第三層小標。
   p.23–24 的表格沒有欄位名稱（結構在上、文字在下），文字放說明；p.25–26 欄位是特性／藥理及臨床應用；p.27 文字與結構放在同一格，文字放說明。
   Tiotropium／Ipratropium 講義共用一格說明，兩格都放；Orphenadrine 格子附比較用的 Diphenhydramine 結構圖。p.27 ※ 註放非去極化型的知識卡。 */

{ id: "mu-atropine", chapter: 33, name: "Atropine", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-atropine.png",
  desc: ["(±)-{{Hyoscyamine|藥名}}★，為{{消旋|結構}}★化合物",
    "Tropine 為{{鹼性|性質|酸性}}端，具有三級胺結構（藥物可分布到 CNS）",
    "Tropic acid 為{{酸性|性質|鹼性}}端，具有一個立體中心（★處）",
    "具有{{散瞳|用途}}、減少腺體分泌、治療{{心率過慢|疾病}}等作用，也可和 {{Pralidoxime|藥名}} 併用於有機磷農藥中毒"] },
{ id: "mu-scopolamine", chapter: 33, name: "Scopolamine", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-scopolamine.png",
  desc: ["(-)-{{Hyoscine|藥名}}，其消旋化合物稱為 Atroscine，具有三級胺結構，可分布到 CNS",
    "左旋結構，相較於 Atropine 多了 {{epoxide|結構}} 結構",
    "屬於{{中樞神經抑制劑|藥物類別}}，可預防{{動暈症|疾病}}"] },
{ id: "mu-homatropine", chapter: 33, name: "Homatropine", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-homatropine.png",
  desc: ["與 Atropine 相比{{少|性質|多}}一個{{甲基|取代基}}"] },
{ id: "mu-tiotropium", chapter: 33, name: "Tiotropium", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-tiotropium.png",
  desc: ["四級胺結構，Tiotropium 含有 {{thiophene|結構}}",
    "皆可治療{{慢性阻塞性肺病|疾病}}（COPD）"] },
{ id: "mu-ipratropium", chapter: 33, name: "Ipratropium", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-ipratropium.png",
  desc: ["四級胺結構，Tiotropium 含有 {{thiophene|結構}}",
    "皆可治療{{慢性阻塞性肺病|疾病}}（COPD）"] },
{ id: "mu-oxybutynin", chapter: 33, name: "Oxybutynin", type: "drug", group: "天然茄科生物鹼（Solanaceae Alkaloids）", source: "統整（三）p.23", img: "assets/medchem/mu-oxybutynin.png",
  desc: ["{{非|性質}} Atropine 衍生物，含有{{參鍵|結構}}結構",
    "可治療{{膀胱過度收縮|疾病}}"] },
{ id: "mu-procyclidine", chapter: 33, name: "Procyclidine", type: "drug", group: "胺醇類膽鹼拮抗劑", source: "統整（三）p.24", img: "assets/medchem/mu-procyclidine.png",
  desc: ["具有 {{pyrrolidine|結構}} 結構（五元環）",
    "三級胺可通過 BBB，治療{{帕金森氏症|疾病}}"] },
{ id: "mu-trihexyphenidyl", chapter: 33, name: "Trihexyphenidyl", type: "drug", group: "胺醇類膽鹼拮抗劑", source: "統整（三）p.24", img: "assets/medchem/mu-trihexyphenidyl.png",
  desc: ["具有 {{piperidine|結構}} 結構",
    "三級胺可通過 BBB，治療帕金森氏症"] },
{ id: "mu-tolterodine", chapter: 33, name: "Tolterodine", type: "drug", group: "胺醇類膽鹼拮抗劑", source: "統整（三）p.24", img: "assets/medchem/mu-tolterodine.png",
  desc: ["屬於 {{aminoalkylphenol|結構}}，並非醇類",
    "只能作用於{{周邊|性質|中樞}}組織，用於治療{{膀胱過動症|疾病}}"] },
{ id: "mu-orphenadrine", chapter: 33, name: "Orphenadrine", type: "drug", group: "胺醚類（Aminoether）膽鹼拮抗劑", source: "統整（三）p.24", img: "assets/medchem/mu-orphenadrine.png", imgMore: ["assets/medchem/mu-diphenhydramine.png"],
  desc: ["與第一代抗組織胺 {{Diphenhydramine|藥名}} 的結構只相差{{一個甲基|取代基}}",
    "可治療帕金森氏症，或其他肌肉痙攣、過敏症狀"] },
{ id: "mu-benztropine", chapter: 33, name: "Benztropine", type: "drug", group: "胺醚類（Aminoether）膽鹼拮抗劑", source: "統整（三）p.24", img: "assets/medchem/mu-benztropine.png",
  desc: ["可用於治療帕金森氏症"] },
{ id: "mu-solifenacin", chapter: 33, name: "Solifenacin", type: "drug", group: "其他類膽鹼拮抗劑", source: "統整（三）p.25", img: "assets/medchem/mu-solifenacin.png",
  feat: ["{{Tetrahydroisoquinoline|結構}} 之衍生物"],
  pharm: ["{{M₃|受體}} 選擇性拮抗劑",
    "半衰期{{長|性質|短}}"] },
{ id: "mu-propantheline", chapter: 33, name: "Propantheline", type: "drug", group: "其他類膽鹼拮抗劑", source: "統整（三）p.25", img: "assets/medchem/mu-propantheline.png",
  feat: ["{{Xanthine|結構}} 之衍生物，含有{{四級胺|結構}}結構"],
  pharm: ["可治療{{尿失禁|疾病}}、胃腸道痙攣"] },
{ id: "mu-pirenzepine", chapter: 33, name: "Pirenzepine", type: "drug", group: "其他類膽鹼拮抗劑", source: "統整（三）p.25", img: "assets/medchem/mu-pirenzepine.png"  },
{ id: "mu-tropicamide", chapter: 33, name: "Tropicamide", type: "drug", group: "其他類膽鹼拮抗劑", source: "統整（三）p.25", img: "assets/medchem/mu-tropicamide.png"  },
{ id: "mu-flavoxate", chapter: 33, name: "Flavoxate", type: "drug", group: "其他類膽鹼拮抗劑", source: "統整（三）p.25", img: "assets/medchem/mu-flavoxate.png"  },
{ id: "mu-nicotine", chapter: 33, name: "Nicotine", type: "drug", group: "抗 Nn 受體藥物（神經節阻斷劑）", source: "統整（三）p.26", img: "assets/medchem/mu-nicotine.png",
  feat: ["低劑量：刺激中樞尼古丁受體，增加下游釋放 {{Dopamine|藥名}}；高劑量：作為{{去極化型|性質|非去極化型}}神經節阻斷劑",
    "高脂溶性，可產生欣快感、改善注意力，用於解焦慮及{{戒菸|用途}}",
    "副作用：具{{成癮性|副作用}}、食慾下降、誘導 {{CYP450|酵素}}"] },
{ id: "mu-trimethaphan", chapter: 33, name: "Trimethaphan", type: "drug", group: "抗 Nn 受體藥物（神經節阻斷劑）", source: "統整（三）p.26", img: "assets/medchem/mu-trimethaphan.png",
  feat: ["{{短效|性質|長效}}型神經節阻斷劑",
    "{{IV|給藥途徑}} 注射可治療{{急性高血壓|疾病}}"] },
{ id: "mu-mecamylamine", chapter: 33, name: "Mecamylamine", type: "drug", group: "抗 Nn 受體藥物（神經節阻斷劑）", source: "統整（三）p.26", img: "assets/medchem/mu-mecamylamine.png",
  feat: ["含有{{二級胺|結構}}結構",
    "{{口服|給藥途徑}}可治療急性高血壓"] },
{ id: "mu-tubocurarine", chapter: 33, name: "d-Tubocurarine", short: "d-Tubocurarine", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline", source: "統整（三）p.27", img: "assets/medchem/mu-tubocurarine.png"  },
{ id: "mu-atracurium", chapter: 33, name: "Atracurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline", source: "統整（三）p.27", img: "assets/medchem/mu-atracurium.png",
  desc: ["經由 {{Hofmann degradation|代謝}}★代謝，形成 {{Laudanosine|代謝物}}★",
    "也會經由 {{BuchE|酵素}} 代謝",
    "適合用於{{肝腎疾病|疾病}}之患者★"] },
{ id: "mu-mivacurium", chapter: 33, name: "Mivacurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline", source: "統整（三）p.27", img: "assets/medchem/mu-mivacurium.png",
  desc: ["經由 BuchE 代謝",
    "適合用於肝腎疾病之患者★"] },
{ id: "mu-doxacurium", chapter: 33, name: "Doxacurium", type: "drug", group: "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline", source: "統整（三）p.27", img: "assets/medchem/mu-doxacurium.png"  },
{ id: "mu-pancuronium", chapter: 33, name: "Pancuronium", type: "drug", group: "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）", source: "統整（三）p.27", img: "assets/medchem/mu-pancuronium.png",
  desc: ["具有 {{5α-Androstane|結構}} steroid 骨架"] },
{ id: "mu-vecuronium", chapter: 33, name: "Vecuronium", type: "drug", group: "類固醇尼古丁受體拮抗劑（屬於非去極化性阻斷劑）", source: "統整（三）p.27", img: "assets/medchem/mu-vecuronium.png",
  desc: ["具有 5α-Androstane steroid 骨架"] },
{ id: "mu-succinylcholine", chapter: 33, name: "Succinylcholine", type: "drug", group: "去極化性阻斷劑（非競爭型）", source: "統整（三）p.27", img: "assets/medchem/mu-succinylcholine.png",
  desc: ["為 {{Acetylcholine|藥名}} 的{{雙體|結構}}結構（diquaternary ammonium ester）",
    "半衰期{{極短|性質|極長}}"] },

/* ===== 第 34 章（統整（三）陸 高血壓藥物 p.28–38；畫面章號 6）===== */
/* 一、Ca²⁺通道阻斷劑：黑底大分類，底下灰底 1,4-DHP／PAA／BTZ／Alkylamines 為第三層小標；二、ACE 抑制劑：黑底，灰底含硫醇／含次磷酸根／含雙羧酸；
   三、ARB：黑底，灰底非前驅藥／前驅藥；四、腎素抑制劑：黑底即分類；五、血管擴張劑沒有黑底，灰底 K⁺通道活化劑、α-receptor Agents、α、β-receptor antagonists、其他類各為分類（其他類加後綴避免重名）。
   欄位：特性＝feat、藥理及臨床應用＝pharm；講義特性欄裡的「代謝」子項（Verapamil、Diltiazem、Captopril、Fosinopril）放 metab。
   p.28 總論圖與 RAAS 圖、p.32–33 的 ACEi 骨架圖／環結構表與各 ※ 註放知識卡；α₁-blockers 一列沒有結構，放 α-receptor Agents 的知識卡。 */

{ id: "hy-nicardipine", chapter: 34, name: "Nicardipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.29", img: "assets/medchem/hy-nicardipine.png",
  feat: ["-NO₂ 取代基在苯環 {{3|數值}} 號位（3C）"],
  pharm: ["適用於口服不可行時的高血壓短期治療",
    "{{IV|給藥途徑}} 給予可治療{{急性高血壓|疾病}}"] },
{ id: "hy-nimodipine", chapter: 34, name: "Nimodipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.29", img: "assets/medchem/hy-nimodipine.png",
  feat: ["-NO₂ 取代基在苯環 3 號位（3M）",
    "唯一 C₃ {{異丙酯基|結構}}取代（其餘皆為{{甲酯基|結構}}取代）"],
  pharm: ["可治療{{蛛網膜下腔出血|疾病}}★"] },
{ id: "hy-nifedipine", chapter: 34, name: "Nifedipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.29", img: "assets/medchem/hy-nifedipine.png",
  feat: ["唯一具有{{對稱|性質|不對稱}}酯基（甲酯基）",
    "可由 {{ammonia|物質}}★、{{2-nitrobenzylaldehyde|物質}}★、methyl acetoacetate 共同反應得到"],
  pharm: ["第一個上市的 DHP 藥物",
    "副作用：{{齒齦增生|副作用}} Gingivitis"] },
{ id: "hy-nisodipine", chapter: 34, name: "Nisodipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.29", img: "assets/medchem/hy-nisodipine.png",
  pharm: ["代謝物{{仍有活性|性質|無活性}}！"] },
{ id: "hy-amlodipine", chapter: 34, name: "Amlodipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.30", img: "assets/medchem/hy-amlodipine.png",
  feat: ["唯一 C₂、C₆ {{不對稱|性質|對稱}}：改接醚類結構",
    "Cl 單取代在苯環 {{ortho|結構|meta}} 位"] },
{ id: "hy-felodipine", chapter: 34, name: "Felodipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.30", img: "assets/medchem/hy-felodipine.png",
  feat: ["Cl 雙取代在苯環 {{ortho、meta|結構}} 位"] },
{ id: "hy-clevidipine", chapter: 34, name: "Clevidipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.30", img: "assets/medchem/hy-clevidipine.png", imgMore: ["assets/medchem/hy-acetal.png"],
  feat: ["具有{{縮醛|結構}}及{{雙酯鍵|結構}}結構，易斷（Cleavage）",
    "Cl 雙取代在苯環 ortho、meta 位"],
  pharm: ["{{短效|性質|長效}}藥物",
    "唯一{{不經肝臟代謝|藥動}}★的鈣離子通道阻斷劑，適用於肝腎功能不佳的病患"] },
{ id: "hy-isradipine", chapter: 34, name: "Isradipine", type: "drug", group: "1,4-Dihydropyridines（1,4-DHP）", source: "統整（三）p.30", img: "assets/medchem/hy-isradipine.png",
  feat: ["具有{{雜環|結構}}結構",
    "當 C₃ 的甲基酯-COOCH₃ 換成硝基-NO₂ 時，反而變成鈣離子通道{{活化劑|藥物類別}}★"] },
{ id: "hy-verapamil", chapter: 34, name: "Verapamil", type: "drug", group: "Phenylalkylamines（PAA）", source: "統整（三）p.31", img: "assets/medchem/hy-verapamil.png",
  feat: ["屬於 {{Phenylalkylamine|結構}}★類結構",
    "與{{藜蘆醇|結構}}（Veratrole Alcohol）結構相似",
    "活性：{{右旋|結構|左旋}} > 左旋"],
  metab: ["CYP3A4：3 級 {{N-去甲基化|代謝}}，代謝後仍有活性",
    "CYP2D6：{{O-去甲基化|代謝}}，代謝後無活性"],
  pharm: ["為 {{P-gp|標的}} 抑制劑，會提高 {{digoxin|藥名}} 的血中濃度"] },
{ id: "hy-diltiazem", chapter: 34, name: "Diltiazem", type: "drug", group: "Benzothiazepines（BTZ）", source: "統整（三）p.31", img: "assets/medchem/hy-diltiazem.png",
  feat: ["{{Benzothiazepine|結構}}★結構，含 N、S 七元雜環",
    "有 2 個不對稱中心，且{{右旋|結構|左旋}}★的阻斷作用較佳"],
  metab: ["CYP3A4：N-demethylation（會抑制 CYP3A4）",
    "酵素水解{{去乙醯化|代謝}}★，降低活性"],
  pharm: ["對{{變異性心絞痛|疾病}}★特別有效",
    "有較強的負向強心作用，不可用於 CHF 病人，會有{{心跳過慢|副作用}}之副作用",
    "{{CYP3A 抑制劑|機轉}}★"] },
{ id: "hy-bepridil", chapter: 34, name: "Bepridil", type: "drug", group: "Alkylamines（烷基胺類）", source: "統整（三）p.31", img: "assets/medchem/hy-bepridil.png",
  feat: ["Diaminopropanol ether",
    "容易被代謝，且至少有一代謝物 4-hydroxybepridil 具有活性"],
  pharm: ["用於穩定性心絞痛",
    "最容易抑制動作電位，引發 {{QT interval 延長|副作用}}"] },
{ id: "hy-captopril", chapter: 34, name: "Captopril", type: "drug", group: "含硫醇抑制劑（Sulfhydryl-containing Inhibitors）", source: "統整（三）p.32", img: "assets/medchem/hy-captopril.png",
  feat: ["透過 {{Sulfhydryl group|結構}}★（-SH）與 Zn²⁺ 螯合",
    "含有 {{Proline|結構}} 類似結構"],
  metab: ["氧化型成{{雙硫鍵|結構}}",
    "1. 2 個 Captopril 以雙硫鍵鍵結成 Dimer",
    "2. 與 Cysteine（含-SH）聚合，代謝物無活性"],
  pharm: ["{{非前驅藥|性質|前驅藥}}★",
    "唯一{{短效|性質|長效}}★ ACE 抑制劑（因含有-SH 基團★）",
    "副作用：皮膚會起{{疹子|副作用}}"] },
{ id: "hy-fosinopril", chapter: 34, name: "Fosinopril", type: "drug", group: "含次磷酸根抑制劑（Phosphinate-containing Inhibitors）", source: "統整（三）p.32", img: "assets/medchem/hy-fosinopril.png",
  feat: ["透過-PO₂⁻與 Zn²⁺螯合★",
    "含{{縮醛|結構}}結構，易被水解",
    "需水解成 {{Fosinoprilat|代謝物}} 才具活性"],
  metab: ["glucuronide conjugation"],
  pharm: ["為{{前驅藥|性質|非前驅藥}}（prodrug）",
    "主要由{{肝臟|器官|腎臟}}★代謝"] },
{ id: "hy-enalapril", chapter: 34, name: "Enalapril", type: "drug", group: "含雙羧酸抑制劑（Dicarboxylate-containing Inhibitors）", source: "統整（三）p.33", img: "assets/medchem/hy-enalapril.png",
  feat: ["需酯類水解成 {{Enalaprilat|代謝物}} 才具活性",
    "通常做為 {{Maleate|物質}} 鹽類★",
    "模仿胺基酸結構（{{Phe-Ala-Pro|結構}}）"],
  pharm: ["為前驅藥（prodrug）",
    "生體可用率極高",
    "適合第四期{{心衰竭|疾病}}之病人"] },
{ id: "hy-losartan", chapter: 34, name: "Losartan", type: "drug", group: "非前驅藥 ARB", source: "統整（三）p.34", img: "assets/medchem/hy-losartan.png",
  feat: ["第一個上市的擬肽類 {{imidazole|結構}}★衍生 ARB",
    "{{ortho|結構|meta}} 位置★含有 {{tetrazole|結構}} 結構"],
  pharm: ["經 {{CYP2C9|酵素}}、CYP3A4 代謝。氧化代謝物 {{EXP-3174|代謝物}} 降壓能力更強，但本身也有活性，故{{非前驅藥|性質|前驅藥}}"] },
{ id: "hy-valsartan", chapter: 34, name: "Valsartan", type: "drug", group: "非前驅藥 ARB", source: "統整（三）p.34", img: "assets/medchem/hy-valsartan.png",
  feat: ["Losartan 的 imidazole {{開環|結構}}★修飾而成",
    "Losartan 衍生的第一個 {{biphenyl|結構}}★藥物",
    "具有 {{Valine|結構}} 結構（具異丙基的胺基酸）"],
  pharm: ["第一個{{沒有|性質|具有}} imidazole 結構★的 ARB"] },
{ id: "hy-irbesartan", chapter: 34, name: "Irbesartan", type: "drug", group: "非前驅藥 ARB", source: "統整（三）p.34", img: "assets/medchem/hy-irbesartan.png",
  feat: ["具有{{螺環|結構}}結構（Spiro）",
    "含有 imidazole 結構"] },
{ id: "hy-telmisartan", chapter: 34, name: "Telmisartan", type: "drug", group: "非前驅藥 ARB", source: "統整（三）p.34", img: "assets/medchem/hy-telmisartan.png",
  feat: ["有兩個 {{benzimidazole|結構}} 結構",
    "{{沒有|性質|具有}} tetrazole 結構★",
    "→ 以羧酸取代，兩者互為{{生物等效|名詞}}結構",
    "{{正丙基|結構}}取代正丁基結構"],
  pharm: ["因含 dibenzimidazole 結構，脂溶性高，藥效{{最長|性質|最短}}"] },
{ id: "hy-eprosartan", chapter: 34, name: "Eprosartan", type: "drug", group: "非前驅藥 ARB", source: "統整（三）p.35", img: "assets/medchem/hy-eprosartan.png",
  feat: ["Acid group 為-COOH（唯一{{無 biphenyl|結構}}結構）",
    "含有 imidazole 結構",
    "C 端接有 {{thiophene|結構}}"] },
{ id: "hy-candesartan", chapter: 34, name: "Candesartan", type: "drug", group: "前驅藥 ARB", source: "統整（三）p.35", img: "assets/medchem/hy-candesartan.png",
  feat: ["具有 benzimidazole 結構",
    "以乙氧基（{{epoxy|結構}}）取代正丁基"],
  pharm: ["{{酸性藥|性質|鹼性藥}}，對 ATⅡ 受體有高度親和力"] },
{ id: "hy-olmesartan", chapter: 34, name: "Olmesartan", type: "drug", group: "前驅藥 ARB", source: "統整（三）p.35", img: "assets/medchem/hy-olmesartan.png",
  feat: ["以正丙基取代正丁基",
    "具{{三級醇|結構}}結構（Olmesartan）"] },
{ id: "hy-azilsartan", chapter: 34, name: "Azilsartan", type: "drug", group: "前驅藥 ARB", source: "統整（三）p.35", img: "assets/medchem/hy-azilsartan.png",
  feat: ["以 {{oxadiazolone|結構}} 取代 tetrazole",
    "以乙氧基（epoxy）取代正丁基"] },
{ id: "hy-zankiren", chapter: 34, name: "Zankiren", type: "drug", group: "腎素抑制劑（Renin inhibitors）", source: "統整（三）p.36", img: "assets/medchem/hy-zankiren.png",
  feat: ["以 {{Compound A|名詞}} 為模板發展",
    "Compound A 是模仿 ATⅡ受體的 {{Phe₈-His₉-Leu₁₀|結構}} 結構"] },
{ id: "hy-aliskiren", chapter: 34, name: "Aliskiren", type: "drug", group: "腎素抑制劑（Renin inhibitors）", source: "統整（三）p.36", img: "assets/medchem/hy-aliskiren.png",
  feat: ["由 Zankiren 發展而來的小分子藥物",
    "{{口服|給藥途徑}}藥，可直接與腎素結合",
    "與 ACEi、ARB 一樣不可用於孕婦",
    "年長者與肝腎功能不全者使用不需調整劑量"] },
{ id: "hy-minoxidil", chapter: 34, name: "Minoxidil", type: "drug", group: "K⁺通道活化劑：造成血管擴張", source: "統整（三）p.37", img: "assets/medchem/hy-minoxidil.png",
  feat: ["含有 pyrimidine、piperidine",
    "活性代謝物：{{Minoxidil N-O-sulfate|代謝物}}★",
    "O-glucuronide 代謝物則失去降壓活性"],
  pharm: ["只會擴張{{小動脈|器官|靜脈}}，不會擴張靜脈",
    "有嚴重 Na⁺/水滯留，造成水腫和鬱血性心衰竭",
    "另有刺激{{毛髮生長|用途}}的作用（落健成分）"] },
{ id: "hy-diazoxide", chapter: 34, name: "Diazoxide", type: "drug", group: "K⁺通道活化劑：造成血管擴張", source: "統整（三）p.37", img: "assets/medchem/hy-diazoxide.png",
  feat: ["具有 {{Sulfonamide|結構}} 結構",
    "結構與 {{Thiazides|藥物類別}} 類似"],
  pharm: ["抑制體內 {{Insulin|物質}} 的分泌，故{{糖尿病|疾病}}者禁用",
    "可用於{{胰臟癌|疾病}}的高血壓患者"] },
{ id: "hy-clonidine", chapter: 34, name: "Clonidine", type: "drug", group: "α-receptor Agents", source: "統整（三）p.37", img: "assets/medchem/hy-clonidine.png",
  feat: ["屬於 Aryl-2-{{amidoimidazoline|結構}}",
    "主要進行 {{Aromatic hydroxylation|代謝}}，代謝物不可穿透 BBB，不具降壓活性"],
  pharm: ["{{α₂-agonist|機轉}}★，降低中樞交感神經作用",
    "不會降低腎血流，可用於腎臟疾病合併症",
    "可用於治療 {{Opioid 戒斷症狀|疾病}}、過動症",
    "副作用：鎮靜、{{鼻黏膜乾燥|副作用}}"] },
{ id: "hy-methyldopa", chapter: 34, name: "α-Methyldopa", short: "α-Methyldopa", type: "drug", group: "α-receptor Agents", source: "統整（三）p.37", img: "assets/medchem/hy-methyldopa.png",
  feat: ["在中樞會轉換成 {{Methylnorepinephrine|代謝物}}",
    "→ 其中 {{1R,2S|結構}}★-form 具有 α₂ agonist 活性"],
  pharm: ["{{孕婦高血壓|疾病}}之首選用藥",
    "以{{主動運輸|機轉}}方式進入腦部，藥效較慢且持久",
    "副作用：鎮靜、嗜睡、{{溶血性貧血|副作用}}"] },
{ id: "hy-labetalol", chapter: 34, name: "Labetalol", type: "drug", group: "α、β-receptor antagonists", source: "統整（三）p.38", img: "assets/medchem/hy-labetalol.png",
  pharm: ["同時為 α、β-blocker，可 {{IV|給藥途徑}} 治療{{急性高血壓|疾病}}",
    "可用於{{孕婦高血壓|疾病}}"] },
{ id: "hy-hydralazine", chapter: 34, name: "Hydralazine", type: "drug", group: "其他類（降血壓血管擴張劑）", source: "統整（三）p.38", img: "assets/medchem/hy-hydralazine.png",
  feat: ["含有 {{Phthalazine|結構}} 雜環",
    "主要進行 N、O-glucuronidation 代謝",
    "速率決定步驟：{{N-acetylation|代謝}}"],
  pharm: ["直接血管擴張劑，主要作用於{{動脈|器官|靜脈}}",
    "單一治療可控制懷孕引發的高血壓",
    "副作用：{{Lupus-like syndrome|副作用}}"] },
{ id: "hy-nitroprusside", chapter: 34, name: "Nitroprusside", type: "drug", group: "其他類（降血壓血管擴張劑）", source: "統整（三）p.38", img: "assets/medchem/hy-nitroprusside.png",
  feat: ["含有 5 個 {{cyanide|結構}} 結構（C≡N）",
    "中心為 {{Fe|物質}} 原子",
    "需{{避光|性質}}存放"],
  pharm: ["釋出 {{NO|物質}} 活化 cytosolic guanylate cyclase，增加血管平滑肌之 cGMP 使其擴張",
    "{{高血壓急症|疾病}}之首選用藥（IV 投予）",
    "過量會引起 {{Thiocyanate|物質}} 中毒"] },
{ id: "hy-fenoldopam", chapter: 34, name: "Fenoldopam", type: "drug", group: "其他類（降血壓血管擴張劑）", source: "統整（三）p.38", img: "assets/medchem/hy-fenoldopam.png",
  feat: ["{{Tetrahydrobenazapine|結構}} 結構"],
  pharm: ["周邊的 {{D₁|受體}}-receptor agonist",
    "可維持腎血流，適合{{腎功能不全|疾病}}患者使用",
    "不可使用於{{青光眼|疾病}}患者"] },

/* ===== 第 35 章（統整（三）壹拾 抗心律不整藥物 p.54–57；畫面章號 10）===== */
/* 沒有黑底，灰底 Class IA／IB／IC／II／III／IV／Other Antiarrhythmic Agents 就是分類（加「（抗心律不整）」後綴避免重名）；
   講義每格是藥名在上、結構、文字在下，文字放說明；各 Class 的機轉說明放知識卡；p.57 ※ 阻斷離子通道與心電圖之關係放告示牌。
   Verapamil／Diltiazem／Nifedipine 在上一章已出現，這章照講義再放一格；Dilitiazem 是講義錯字，改成 Diltiazem。 */

{ id: "ar-quinidine", chapter: 35, name: "Quinidine", type: "drug", group: "Class IA（抗心律不整）", source: "統整（三）p.54", img: "assets/medchem/ar-quinidine.png",
  desc: ["具有 {{Quinuclidine|結構}}、{{Quinoline|結構}} 環，立體組態為 3R、4S、8R、9S",
    "中毒症狀：{{QT interval 延長|副作用}}、血小板減少、{{Lupus-like syndrome|副作用}}"],
  rmk: ["可參考 Vol.2 P51"] },
{ id: "ar-procainamide", chapter: 35, name: "Procainamide", type: "drug", group: "Class IA（抗心律不整）", source: "統整（三）p.54", img: "assets/medchem/ar-procainamide.png",
  desc: ["副作用：{{Lupus-like syndrome|副作用}}"] },
{ id: "ar-disopyramide", chapter: 35, name: "Disopyramide", type: "drug", group: "Class IA（抗心律不整）", source: "統整（三）p.54", img: "assets/medchem/ar-disopyramide.png",
  desc: ["競爭性阻斷 {{Muscarinic receptor|受體}} 而加速房室節傳導，減低去極化最大速率",
    "負向強心作用強，不可用於{{心衰竭|疾病}}病人",
    "{{Atropine|藥名}}-like 作用最強"] },
{ id: "ar-pirmenol", chapter: 35, name: "Pirmenol", type: "drug", group: "Class IA（抗心律不整）", source: "統整（三）p.54", img: "assets/medchem/ar-pirmenol.png"  },
{ id: "ar-lidocaine", chapter: 35, name: "Lidocaine", type: "drug", group: "Class IB（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-lidocaine.png",
  desc: ["治療{{毛地黃中毒|疾病}}之首選用藥",
    "降低動作電位 Duration 與去極化最大速率"] },
{ id: "ar-tocainide", chapter: 35, name: "Tocainide", type: "drug", group: "Class IB（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-tocainide.png",
  desc: ["副作用：{{肺纖維化|副作用}}"] },
{ id: "ar-mexiletine", chapter: 35, name: "Mexiletine", type: "drug", group: "Class IB（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-mexiletine.png",
  desc: ["可緩解{{糖尿病神經病變|疾病}}之疼痛"] },
{ id: "ar-phenytoin", chapter: 35, name: "Phenytoin", type: "drug", group: "Class IB（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-phenytoin.png",
  desc: ["可治療{{毛地黃中毒|疾病}}"] },
{ id: "ar-flecainide", chapter: 35, name: "Flecainide", type: "drug", group: "Class IC（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-flecainide.png"  },
{ id: "ar-encainide", chapter: 35, name: "Encainide", type: "drug", group: "Class IC（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-encainide.png"  },
{ id: "ar-propafenone", chapter: 35, name: "Propafenone", type: "drug", group: "Class IC（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-propafenone.png",
  desc: ["副作用：{{顆粒性白血球減少|副作用}}"] },
{ id: "ar-moricizine", chapter: 35, name: "Moricizine", type: "drug", group: "Class IC（抗心律不整）", source: "統整（三）p.55", img: "assets/medchem/ar-moricizine.png"  },
{ id: "ar-propranolol", chapter: 35, name: "Propranolol", type: "drug", group: "Class II（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-propranolol.png"  },
{ id: "ar-esmolol", chapter: 35, name: "Esmolol", type: "drug", group: "Class II（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-esmolol.png",
  desc: ["半衰期短（約 {{10 分鐘|數值}}）",
    "{{IV|給藥途徑}} 治療{{急性|性質|慢性}}心律不整"] },
{ id: "ar-metoprolol", chapter: 35, name: "Metoprolol", type: "drug", group: "Class II（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-metoprolol.png"  },
{ id: "ar-sotalol", chapter: 35, name: "Sotalol", type: "drug", group: "Class III（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-sotalol.png"  },
{ id: "ar-bretylium", chapter: 35, name: "Bretylium tosylate", short: "Bretylium", type: "drug", group: "Class III（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-bretylium.png",
  desc: ["用於{{心室顫動|疾病}}之緊急治療"] },
{ id: "ar-ibutilide", chapter: 35, name: "Ibutilide", type: "drug", group: "Class III（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-ibutilide.png"  },
{ id: "ar-dofetilide", chapter: 35, name: "Dofetilide", type: "drug", group: "Class III（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-dofetilide.png"  },
{ id: "ar-amiodarone", chapter: 35, name: "Amiodarone", type: "drug", group: "Class III（抗心律不整）", source: "統整（三）p.56", img: "assets/medchem/ar-amiodarone.png",
  desc: ["長效，半衰期非常長（{{80~100 天|數值}}）",
    "{{CYP3A4|酵素}} 抑制劑",
    "副作用：{{肺間質纖維化|副作用}}、{{甲狀腺機能異常|副作用}}"] },
{ id: "ar-verapamil", chapter: 35, name: "Verapamil", type: "drug", group: "Class IV（抗心律不整）", source: "統整（三）p.57", img: "assets/medchem/ar-verapamil.png",
  desc: ["首度代謝強：{{肝功能|器官}}不佳要調整劑量"] },
{ id: "ar-diltiazem", chapter: 35, name: "Diltiazem", type: "drug", group: "Class IV（抗心律不整）", source: "統整（三）p.57", img: "assets/medchem/ar-diltiazem.png"  },
{ id: "ar-nifedipine", chapter: 35, name: "Nifedipine", type: "drug", group: "Class IV（抗心律不整）", source: "統整（三）p.57", img: "assets/medchem/ar-nifedipine.png"  },
{ id: "ar-digoxin", chapter: 35, name: "Digoxin", type: "drug", group: "Other Antiarrhythmic Agents", source: "統整（三）p.57", img: "assets/medchem/ar-digoxin.png",
  desc: ["（詳見上一章）"] },
{ id: "ar-adenosine", chapter: 35, name: "Adenosine", type: "drug", group: "Other Antiarrhythmic Agents", source: "統整（三）p.57", img: "assets/medchem/ar-adenosine.png",
  desc: ["{{心室上心搏過速|疾病}}之首選藥物，另可用於陣發性心室心搏過速（Verapamil 也可）",
    "抑制 Ca²⁺電流並增加內向整流之 K⁺電流",
    "最可能誘發 {{Atrial fibrillation|疾病}}"] },

/* ===== 第 36 章（統整（三）壹拾貳 降血脂藥物 p.70–75；畫面章號 12）===== */
/* 一、膽酸吸附劑是黑底，即分類；二～五各節沒有黑底／灰底，章節標題就是分類（Statins、Fibrates、Cholesterol Absorption Inhibitor、Niacins）；六、PCSK9 複合體沒有結構圖，放告示牌。
   p.70 欄位是來源／特性／藥理及臨床應用，來源欄放聚合物合成結構圖（含前驅物），作用機制放知識卡；p.72 Mevastatin 的 SAR 文字放藥理及臨床應用，SAR 圖當附圖；
   p.71 Statins 比較表與 p.73 整理表放 Statins 知識卡；商品名（Lescol 等）放備註；Ezetimibe、Niacin 結構前的星號未特別處理。 */

{ id: "lp-cholestyramine", chapter: 36, name: "Cholestyramine", type: "drug", group: "膽酸吸附劑（Bile-acid Sequestrants）", source: "統整（三）p.70", img: "assets/medchem/lp-cholestyramine.png",
  pharm: ["改善因{{膽道阻塞|疾病}}而使膽酸沉積於皮膚，所引發的{{搔癢|副作用}}",
    "可治療{{毛地黃中毒|疾病}}：吸附 {{Digoxin|藥名}}",
    "可緩解膽鹽引起的結腸分泌型腹瀉"] },
{ id: "lp-colestipol", chapter: 36, name: "Colestipol", type: "drug", group: "膽酸吸附劑（Bile-acid Sequestrants）", source: "統整（三）p.70", img: "assets/medchem/lp-colestipol.png",
  pharm: ["與 Cholestyramine 相同"] },
{ id: "lp-mevastatin", chapter: 36, name: "Mevastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.72", img: "assets/medchem/lp-mevastatin.png", imgMore: ["assets/medchem/lp-fig-sar.png"],
  feat: ["立體構型：{{3R、5R|結構}}★",
    "含有 {{lactone ring|結構}} → {{前驅藥|性質|活性藥}}",
    "C6、C7 以單鍵相接"],
  pharm: ["SAR",
    "1. 以雙環為主要結構，並用 Ethylene bridge 連接 β-hydroxy-δ-lactone",
    "2. 含有 Lactone 的藥物為 {{Prodrug|名詞}}，水解開環形成 3R,5R-dihydroxyheptanoic acid",
    "3. Lactone 與雙環間距離必為{{兩個碳|結構}}"] },
{ id: "lp-lovastatin", chapter: 36, name: "Lovastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.72", img: "assets/medchem/lp-lovastatin.png",
  feat: ["有 lactone ring → 前驅藥",
    "與 Mevastatin 僅相差在 {{6′位|結構}}的{{甲基|取代基}}"] },
{ id: "lp-simvastatin", chapter: 36, name: "Simvastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.72", img: "assets/medchem/lp-simvastatin.png",
  feat: ["有 lactone ring → 前驅藥",
    "與 Lovastatin 僅相差在{{酯基側鏈|結構}}的甲基"],
  pharm: ["活性為 Lovastatin 的 {{2.5 倍|數值}}"] },
{ id: "lp-pravastatin", chapter: 36, name: "Pravastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.72", img: "assets/medchem/lp-pravastatin.png",
  feat: ["Lactone 結構開環形成 {{3,5-dihydroxyheptanoic acid|結構}}",
    "雙環部分加上 {{OH 基|取代基}} → 減少{{肝毒性|副作用}}"],
  pharm: ["不經由 {{CYP450|酵素}} 代謝"] },
{ id: "lp-fluvastatin", chapter: 36, name: "Fluvastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.73", img: "assets/medchem/lp-fluvastatin.png",
  feat: ["中心雜環為 {{indole|結構}}",
    "Lactone 結構開環形成 3,5-dihydroxyheptanoic acid"],
  rmk: ["商品名：Lescol®"] },
{ id: "lp-atorvastatin", chapter: 36, name: "Atorvastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.73", img: "assets/medchem/lp-atorvastatin.png",
  feat: ["中心雜環為 {{pyrrole|結構}}",
    "唯一以{{碳碳單鍵|結構}}連接芳香雜環"],
  rmk: ["商品名：Lipitor®"] },
{ id: "lp-rosuvastatin", chapter: 36, name: "Rosuvastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.73", img: "assets/medchem/lp-rosuvastatin.png",
  feat: ["中心雜環為 {{pyrimidine|結構}}"],
  rmk: ["商品名：Crestor®"] },
{ id: "lp-pitavastatin", chapter: 36, name: "Pitavastatin", type: "drug", group: "HMG-CoA Reductase Inhibitors（Statins 類藥物）", source: "統整（三）p.73", img: "assets/medchem/lp-pitavastatin.png",
  feat: ["中心雜環為 {{quinoline|結構}}"],
  rmk: ["商品名：Livalo®"] },
{ id: "lp-clofibrate", chapter: 36, name: "Clofibrate", type: "drug", group: "Fibrates 類藥物（降 TG 最佳藥物）", source: "統整（三）p.74", img: "assets/medchem/lp-clofibrate.png",
  feat: ["苯環上含有 Cl，可增加{{半衰期|藥動}}"],
  pharm: ["{{Prodrug|名詞}}"] },
{ id: "lp-fenofibrate", chapter: 36, name: "Fenofibrate", type: "drug", group: "Fibrates 類藥物（降 TG 最佳藥物）", source: "統整（三）p.74", img: "assets/medchem/lp-fenofibrate.png",
  feat: ["苯環上含有 Cl",
    "含有 {{Benzophenone|結構}}、{{Isopropylester|結構}}"],
  pharm: ["Prodrug"] },
{ id: "lp-gemfibrozil", chapter: 36, name: "Gemfibrozil", type: "drug", group: "Fibrates 類藥物（降 TG 最佳藥物）", source: "統整（三）p.74", img: "assets/medchem/lp-gemfibrozil.png",
  feat: ["{{1,2,5-三取代|結構}}苯環衍生物",
    "苯環上有兩個甲基，唯一{{沒有 Cl|結構|有 Cl}} 取代"] },
{ id: "lp-ciprofibrate", chapter: 36, name: "Ciprofibrate", type: "drug", group: "Fibrates 類藥物（降 TG 最佳藥物）", source: "統整（三）p.74", img: "assets/medchem/lp-ciprofibrate.png",
  feat: ["結構中含有 {{Cyclopropane|結構}}"] },
{ id: "lp-bezafibrate", chapter: 36, name: "Bezafibrate", type: "drug", group: "Fibrates 類藥物（降 TG 最佳藥物）", source: "統整（三）p.74", img: "assets/medchem/lp-bezafibrate.png",
  feat: ["結構中含有 {{Benzamide|結構}}"] },
{ id: "lp-ezetimibe", chapter: 36, name: "Ezetimibe", type: "drug", group: "Cholesterol Absorption Inhibitor", source: "統整（三）p.75", img: "assets/medchem/lp-ezetimibe.png",
  feat: ["含有 {{Lactam|結構}} 結構",
    "含有 {{F|物質}} 原子"],
  pharm: ["抑制{{小腸|器官}}吸收膽固醇"] },
{ id: "lp-niacin", chapter: 36, name: "Niacin（Nicotinic acid, Vit B₃）", short: "Niacin", type: "drug", group: "Niacins", source: "統整（三）p.75", img: "assets/medchem/lp-niacin.png",
  feat: ["{{增加 HDL|藥效}} 最佳藥物，也可抑制脂肪細胞的 TG 分解，並降低肝臟分泌 {{VLDL|物質}}",
    "降 LDL 作用只有 10-15% → 可併用 {{Cholestyramine|藥名}} 加強",
    "副作用",
    "1. 葡萄糖耐受性降低：{{糖尿病|疾病}}病人不可使用★",
    "2. 皮膚潮紅：可用 {{Ibuprofen|藥名}} 緩解",
    "3. 與 Lovastatin 一樣有增加血清 aminotransferase 之副作用"] },

/* ===== 第 37 章（統整（三）壹拾參 胰島素與口服降血糖藥物 p.76–86；畫面章號 13）===== */
/* 一、胰島素類似物（灰底）沒有結構圖，講義表格的商品名／外觀／Onset／Duration 放特性，結構修飾放說明，備註放備註；速效／短效／中效／長效是表格左側分類，放特性第一行；
   二、Sulfonylurea 沒有黑底灰底，第一／二／三代是表格左側分類，做成第三層小標；R₁、R₂ 欄放說明，特性欄放特性；機轉、SAR、代謝反應、用法、副作用與結構圖放 Sulfonylurea 知識卡；
   三～十各節沒有黑底灰底，章節標題就是分類；GLP-1 受體致效劑、其他類降血糖藥物沒有結構圖。p.76 總論（胰島細胞、胰島素介紹、GLUT 表、影響血糖之藥物表）放知識卡。 */

{ id: "dm-lispro", chapter: 37, name: "Lispro", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["B₂₈：Pro→Lys",
    "B₂₉：Lys→Pro（互換）"],
  feat: ["分類：{{速效|性質|短效/中效/長效}}",
    "商品名：Humalog®",
    "外觀：清澈",
    "Onset：<0.25 hr；Duration：3~4 hr"],
  rmk: ["製成鋅的結晶，需要注射時再溶解",
    "分子量 5808，與內生胰島素相同"] },
{ id: "dm-aspart", chapter: 37, name: "Aspart", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["B₂₈：Pro→{{Asp|物質}}"],
  feat: ["分類：速效",
    "商品名：Novolog®",
    "外觀：清澈",
    "Onset：<0.25 hr；Duration：3~4 hr"],
  rmk: ["使胰島素僅能維持在 monomer，無法形成較安定的 hexamer，故為速效"] },
{ id: "dm-glulisine", chapter: 37, name: "Glulisine", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["B₃：Asn→{{Lys|物質}}",
    "B₂₉：Lys→{{Glu|物質}}",
    "3ᴮ-Lysine-29ᴮ-Glutamic acid human insulin"],
  feat: ["分類：速效",
    "商品名：Apidra®",
    "外觀：清澈",
    "Onset：<0.25 hr；Duration：3~4 hr"],
  rmk: ["分子量 5823，較內生胰島素大"] },
{ id: "dm-regular", chapter: 37, name: "Regular", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["與 Zn²⁺結晶的胰島素製劑"],
  feat: ["分類：{{短效|性質|速效/中效/長效}}",
    "商品名：Humulin-R®",
    "外觀：清澈",
    "Onset：0.5~1 hr；Duration：4~6 hr"],
  rmk: ["{{IV|給藥途徑}} 注射，目前仍在使用"] },
{ id: "dm-lente", chapter: 37, name: "Lente", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["為 Insulin-Zn²⁺的懸浮液製劑"],
  feat: ["分類：{{中效|性質|速效/短效/長效}}",
    "商品名：Humulin-L®",
    "外觀：混濁",
    "Onset：2~4 hr；Duration：18~26 hr"],
  rmk: ["30% Semilente + 70% Ultralente"] },
{ id: "dm-nph", chapter: 37, name: "NPH", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["加入 {{Protamine|物質}} 和鋅形成中性結晶"],
  feat: ["分類：中效",
    "商品名：Humulin-N®",
    "外觀：混濁",
    "Onset：2~4 hr；Duration：18~26 hr"],
  rmk: ["目前仍在使用"] },
{ id: "dm-ultralente", chapter: 37, name: "Ultralente", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["Insulin-Zn²⁺形成大顆粒結晶，吸收較慢"],
  feat: ["分類：{{長效|性質|速效/短效/中效}}",
    "商品名：Humulin-U®",
    "外觀：混濁",
    "Onset：4~8 hr；Duration：>36 hr"],
  rmk: ["第一個長效型胰島素製劑"] },
{ id: "dm-glargine", chapter: 37, name: "Glargine", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["A₂₁：Asn→{{Gly|物質}}",
    "B 鏈：C 端加上兩個 {{Arg|物質}}"],
  feat: ["分類：長效",
    "商品名：Lantus®",
    "外觀：清澈",
    "Onset：1~4 hr；Duration：20~24 hr"],
  rmk: ["改變{{等電點|性質}}（等電點 pH=6.7）"] },
{ id: "dm-detemir", chapter: 37, name: "Detemir", type: "drug", group: "胰島素類似物（Insulin analogs）", source: "統整（三）p.77",
  desc: ["B₂₉：Lys 加上 {{14C 脂肪酸|結構}}",
    "B₃₀：去除 {{Thr|物質}}"],
  feat: ["分類：長效",
    "商品名：Levemir®",
    "外觀：清澈",
    "Onset：1~4 hr；Duration：20~24 hr"] },
{ id: "dm-tolbutamide", chapter: 37, name: "Tolbutamide", type: "drug", group: "第一代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-tolbutamide.png",
  desc: ["R₁：-CH₃",
    "R₂：-(CH₂)₃CH₃"],
  feat: ["苯環上的甲基容易被{{氧化|代謝}}代謝成無活性代謝物，故作用時間{{最短|性質|最長}}"] },
{ id: "dm-chlorpropamide", chapter: 37, name: "Chlorpropamide", type: "drug", group: "第一代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-chlorpropamide.png",
  desc: ["R₁：-Cl",
    "R₂：-(CH₂)₃CH₂"],
  feat: ["以{{原型藥|名詞}}經由尿液排除"] },
{ id: "dm-tolazamide", chapter: 37, name: "Tolazamide", type: "drug", group: "第一代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-tolazamide.png",
  desc: ["R₁：-CH₃",
    "R₂：Azepane"],
  feat: ["{{4′-hydroxylation|代謝}} 為活性代謝物"] },
{ id: "dm-acetohexamide", chapter: 37, name: "Acetohexamide", type: "drug", group: "第一代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-acetohexamide.png",
  desc: ["R₁：Acetyl group",
    "R₂：Cyclohexane"],
  feat: ["經{{還原反應|代謝}}★形成 hydroxyhexamide（活性代謝物）"] },
{ id: "dm-glyburide", chapter: 37, name: "Glyburide", type: "drug", group: "第二代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-glyburide.png",
  desc: ["R₁：巨大取代基",
    "R₂：Cyclohexane"],
  feat: ["R₂ 接環己基的效果最好",
    "主要代謝為 R₂ {{對位|結構}}接 OH 基"] },
{ id: "dm-glipizide", chapter: 37, name: "Glipizide", type: "drug", group: "第二代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-glipizide.png",
  desc: ["R₁：巨大取代基，具 {{pyrazine|結構}}★結構",
    "R₂：Cyclohexane"],
  feat: ["R₂ 接環己基的效果最好"] },
{ id: "dm-glimepiride", chapter: 37, name: "Glimepiride", type: "drug", group: "第三代 Sulfonylurea", source: "統整（三）p.79", img: "assets/medchem/dm-glimepiride.png",
  desc: ["R₁：巨大取代基，具雜環結構",
    "R₂：較 Cyclohexane 多了甲基取代"],
  feat: ["R₂ 上的甲基取代可延長作用時間，並且容易被代謝",
    "唯一可提高{{胰島素受體|標的}}之敏感性"] },
{ id: "dm-repaglinide", chapter: 37, name: "Repaglinide", type: "drug", group: "Meglitinides 類藥物", source: "統整（三）p.80", img: "assets/medchem/dm-repaglinide.png",
  feat: ["具有 {{piperidine|結構}}、ethoxy 結構"],
  pharm: ["相較於其他降血糖藥物 Onset 快、作用時間長",
    "應於{{餐前|性質|餐後}}服用，由{{肝臟|器官}}代謝",
    "較無體重增加、低血糖的副作用"] },
{ id: "dm-nateglinide", chapter: 37, name: "Nateglinide", type: "drug", group: "Meglitinides 類藥物", source: "統整（三）p.80", img: "assets/medchem/dm-nateglinide.png",
  feat: ["將 COOH 移位、苯環換成六元環後形成"],
  pharm: ["主要代謝：Hydroxylation",
    "在 isopropyl 的末端接上 OH，為主要代謝物"] },
{ id: "dm-phenformin", chapter: 37, name: "Phenformin", type: "drug", group: "Biguanides 類藥物", source: "統整（三）p.80", img: "assets/medchem/dm-phenformin.png",
  feat: ["含有苯環結構"],
  pharm: ["因{{乳酸性酸中毒|副作用}}而下市"] },
{ id: "dm-metformin", chapter: 37, name: "Metformin", type: "drug", group: "Biguanides 類藥物", source: "統整（三）p.80", img: "assets/medchem/dm-metformin.png",
  feat: ["N 上有甲基取代"],
  pharm: ["不會造成體重增加",
    "單一療法使用時，不會造成低血糖"] },
{ id: "dm-ciglitazone", chapter: 37, name: "Ciglitazone", type: "drug", group: "Thiazolidinediones（TZD）類藥物", source: "統整（三）p.81", img: "assets/medchem/dm-ciglitazone.png",
  feat: ["含有環己烷結構"] },
{ id: "dm-troglitazone", chapter: 37, name: "Troglitazone", type: "drug", group: "Thiazolidinediones（TZD）類藥物", source: "統整（三）p.81", img: "assets/medchem/dm-troglitazone.png",
  feat: ["主要是苯環上的 OH 進行 sulfate / glucuronide conjugation",
    "經過 CYP3A4/2C8 代謝會產生 {{quinone|結構}} 結構，具有{{肝毒性|副作用}}"] },
{ id: "dm-pioglitazone", chapter: 37, name: "Pioglitazone", type: "drug", group: "Thiazolidinediones（TZD）類藥物", source: "統整（三）p.81", img: "assets/medchem/dm-pioglitazone.png",
  feat: ["含有 {{pyridine|結構}}★雜環"],
  pharm: ["誘導 {{CYP3A4|酵素}}",
    "蛋白結合率 99%，半衰期 3~7 小時",
    "代謝：pyridine 上的乙基進行氧化代謝"] },
{ id: "dm-rosiglitazone", chapter: 37, name: "Rosiglitazone", type: "drug", group: "Thiazolidinediones（TZD）類藥物", source: "統整（三）p.81", img: "assets/medchem/dm-rosiglitazone.png",
  feat: ["含有 pyridine 雜環",
    "具有{{三級胺|結構}}結構"],
  pharm: ["蛋白結合率 99%，半衰期 3~4 小時",
    "可能使心臟病發作機率提高",
    "代謝：pyridine 上進行 Hydroxylation，或在隔壁的 N 上進行 N-demethylation"] },
{ id: "dm-acarbose", chapter: 37, name: "Acarbose", type: "drug", group: "α-glucosidase Inhibitors", source: "統整（三）p.82", img: "assets/medchem/dm-acarbose.png",
  feat: ["含有 {{Carvosine|結構}}★和 Maltose 結構"],
  pharm: ["不可用於嚴重{{腎功能不全|疾病}}之病患"] },
{ id: "dm-voglibose", chapter: 37, name: "Voglibose", type: "drug", group: "α-glucosidase Inhibitors", source: "統整（三）p.82", img: "assets/medchem/dm-voglibose.png",
  feat: ["精簡 Acarbose 結構，保留 N-H linkage 部分"] },
{ id: "dm-miglitol", chapter: 37, name: "Miglitol", type: "drug", group: "α-glucosidase Inhibitors", source: "統整（三）p.82", img: "assets/medchem/dm-miglitol.png",
  feat: ["修飾 Voglibose，用 N 取代環上的 C",
    "具有 {{piperidine|結構}} 結構"],
  pharm: ["不可逆抑制劑"] },
{ id: "dm-sitagliptin", chapter: 37, name: "Sitagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.83", img: "assets/medchem/dm-sitagliptin.png",
  feat: ["以 {{Piperazine|結構}} 和 {{Pyrazole|結構}} 的結合取代 Pyrrolidine",
    "具有 6 個 F 原子"],
  pharm: ["併用 {{P-gp inducer|藥物類別}} 會降低藥效"] },
{ id: "dm-vildagliptin", chapter: 37, name: "Vildagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.83", img: "assets/medchem/dm-vildagliptin.png",
  feat: ["具有 {{Amantadine|結構}} 結構",
    "具有 {{C≡N|結構}} 結構"],
  pharm: ["{{不可逆|性質|可逆}}抑制（因為有 C≡N 結構）",
    "不經過 CYP450 代謝"] },
{ id: "dm-saxagliptin", chapter: 37, name: "Saxagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.83", img: "assets/medchem/dm-saxagliptin.png",
  feat: ["由 Vildagliptin 結構修飾而來",
    "將 Amantadine 的位置改變",
    "pyrrolidine 環接有 {{nitrile|結構}}★（C≡N）"],
  pharm: ["不可逆抑制 DPP-4 效果約為前兩者的 10 倍",
    "副作用小，不會造成體重增加或低血糖",
    "併用 P-gp 或 CYP3A4 inducer 會降低藥效"] },
{ id: "dm-linagliptin", chapter: 37, name: "Linagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-linagliptin.png",
  feat: ["{{Xanthine|結構}} 衍生物",
    "具有 {{C≡C|結構}} 結構"],
  pharm: ["不適用於第一型糖尿病或是有糖尿病酮酸中毒的病人"] },
{ id: "dm-alogliptin", chapter: 37, name: "Alogliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-alogliptin.png",
  feat: ["Xanthine 類似結構",
    "具有 C≡N 結構"],
  pharm: ["增加{{心血管疾病|疾病}}的風險"] },
{ id: "dm-teneligliptin", chapter: 37, name: "Teneligliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-teneligliptin.png",
  feat: ["含 N、S 五元雜環、Pyrazine"],
  pharm: ["在{{日本|名詞}}核准上市"] },
{ id: "dm-gemigliptin", chapter: 37, name: "Gemigliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-gemigliptin.png"  },
{ id: "dm-anagliptin", chapter: 37, name: "Anagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-anagliptin.png"  },
{ id: "dm-trelagliptin", chapter: 37, name: "Trelagliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-trelagliptin.png"  },
{ id: "dm-omarigliptin", chapter: 37, name: "Omarigliptin", type: "drug", group: "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）", source: "統整（三）p.84", img: "assets/medchem/dm-omarigliptin.png"  },
{ id: "dm-empagliflozin", chapter: 37, name: "Empagliflozin", type: "drug", group: "SGLT-2 inhibitors", source: "統整（三）p.85", img: "assets/medchem/dm-empagliflozin.png"  },
{ id: "dm-canagliflozin", chapter: 37, name: "Canagliflozin", type: "drug", group: "SGLT-2 inhibitors", source: "統整（三）p.85", img: "assets/medchem/dm-canagliflozin.png"  },
{ id: "dm-dapagliflozin", chapter: 37, name: "Dapagliflozin", type: "drug", group: "SGLT-2 inhibitors", source: "統整（三）p.85", img: "assets/medchem/dm-dapagliflozin.png"  },
{ id: "dm-exenatide", chapter: 37, name: "Exenatide", type: "drug", group: "GLP-1 受體致效劑（GLP-1 receptor agonists）", source: "統整（三）p.86",
  feat: ["第一個應用在糖尿病治療的 GLP-1 receptor agonist",
    "N 端倒數第二位的 Alanine 取代為 {{Glycine|物質}}，半衰期約 3 小時",
    "由 39 個胺基酸組成，來自{{希拉毒蜥|名詞}}的唾液"] },
{ id: "dm-liraglutide", chapter: 37, name: "Liraglutide", type: "drug", group: "GLP-1 受體致效劑（GLP-1 receptor agonists）", source: "統整（三）p.86",
  feat: ["³⁴Lysine 取代為 ³⁴{{Arginine|物質}}（產生對 DPP-4 的抗性）、²⁶Lysine 接上 {{16C|數值}} 的脂肪酸側鏈",
    "→ 形成 α-l-glutamyl-(N-α-hexadecanoyl)-²⁶Lys³⁴Arg-GLP-1",
    "可能有造成{{甲狀腺 C 細胞腫瘤|副作用}}的風險"] },
{ id: "dm-amylin", chapter: 37, name: "Amylin agonist（澱粉素致效劑）", short: "Amylin agonist", type: "drug", group: "其他類降血糖藥物", source: "統整（三）p.86",
  feat: ["{{Pramlintide|藥名}}為人工合成的 Amylin analogue★，皮下注射可降低飯後高血糖及食物攝取（長期使用體重會下降）",
    "Amylin 由胰臟 β cell 分泌，具有 37 個胺基酸，可減少{{升糖素|物質}}分泌★、降低血糖"] },
{ id: "dm-glucagon-ant", chapter: 37, name: "Glucagon antagonist（升糖素拮抗劑）", short: "Glucagon antagonist", type: "drug", group: "其他類降血糖藥物", source: "統整（三）p.86",
  feat: ["抑制{{升糖素|物質}}的釋放而使血糖降低"] },
{ id: "dm-ptp1b", chapter: 37, name: "PTP1B 抑制劑", type: "drug", group: "其他類降血糖藥物", source: "統整（三）p.86",
  feat: ["{{Protein Tyrosine Phosphatase 1B|酵素}} Inhibitor",
    "PTP1B 屬於一種基因，扮演胰島素負回饋的角色，可治療產生胰島素抗性的第二型糖尿病患者"] },

/* ===== 第 38 章（統整（三）壹拾肆 腎上腺皮質激素 p.87–92；畫面章號 14）===== */
/* 一、Hydrocortisone 類衍生物（黑底）、二、Prednisone 類衍生物（黑底）；三、含 9α-fluoro 取代基類衍生物：16 號 CH₃ 為「α」構型（深灰）底下 6 號位無取代基／具有 α-fluoro（淺灰）為第三層小標，16 號 CH₃ 為「β」構型（深灰）；
   四、含 Ketal 結構之藥物沒有黑底，三個灰底（6、9 號位皆沒有取代基／6 號位具有 α-fluoro／9 號位具有 α-fluoro）各自為分類。
   講義每格是藥名在上、文字、結構，文字放說明，並依 p.87 藥名旁符號加一行「使用途徑」；p.87 取代基總表、p.88 分類與特殊取代基表與二分法、p.89 SAR 與藥理作用、各類共同結構特色放知識卡。
   Alclometasone、Prednicarbate 講義只有取代基表一列、沒有結構圖，放告示牌的總表。 */

{ id: "co-hydrocortisone", chapter: 38, name: "Hydrocortisone（Cortisol）", short: "Hydrocortisone", type: "drug", group: "Hydrocortisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-hydrocortisone.png",
  desc: ["（基本結構）第 {{11β、17α、21|結構}} 號上有 OH",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-cortisone", chapter: 38, name: "Cortisone", type: "drug", group: "Hydrocortisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-cortisone.png",
  desc: ["11 號位從醇基{{脫水成羰基|結構}}",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-fludrocortisone", chapter: 38, name: "Fludrocortisone", type: "drug", group: "Hydrocortisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-fludrocortisone.png",
  desc: ["9 號位接有 {{α-fluoro|取代基}} 取代基，為{{礦物性|性質|糖質性}}皮質激素★",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-prednisolone", chapter: 38, name: "Prednisolone", type: "drug", group: "Prednisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-prednisolone.png",
  desc: ["（基本結構）",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-prednisone", chapter: 38, name: "Prednisone", type: "drug", group: "Prednisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-prednisone.png",
  desc: ["11 號位從醇基脫水成羰基",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-methylprednisolone", chapter: 38, name: "Methylprednisolone", type: "drug", group: "Prednisone 類衍生物", source: "統整（三）p.90", img: "assets/medchem/co-methylprednisolone.png",
  desc: ["6 號位接有 {{α-methyl|取代基}} 取代基",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-dexamethasone", chapter: 38, name: "Dexamethasone", type: "drug", group: "6 號位無取代基：Dexamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-dexamethasone.png",
  desc: ["（基本結構）抗炎活性強",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-mometasone", chapter: 38, name: "Mometasone", type: "drug", group: "6 號位無取代基：Dexamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-mometasone.png",
  desc: ["9α 取代基從 F 改成 {{Cl|取代基}}、21 號位改成 Cl",
    "使用途徑：{{吸入／鼻內|給藥途徑|全身性/局部性}}用藥"] },
{ id: "co-desoximetasone", chapter: 38, name: "Desoximetasone", type: "drug", group: "6 號位無取代基：Dexamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-desoximetasone.png",
  desc: ["17 號位的 OH 改成 {{H|取代基}}（desoxi-）",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-triamcinolone", chapter: 38, name: "Triamcinolone", type: "drug", group: "6 號位無取代基：Dexamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-triamcinolone.png",
  desc: ["16α 位從 CH₃ 改成 {{OH|取代基}}",
    "使用途徑：{{全身性、吸入／鼻內|給藥途徑}}用藥"] },
{ id: "co-flumethasone", chapter: 38, name: "Flumethasone", type: "drug", group: "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one", source: "統整（三）p.91", img: "assets/medchem/co-flumethasone.png",
  desc: ["與 Dexamethasone 只相差 {{6α-fluoro|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-difluocortolone", chapter: 38, name: "Diflucortolone", type: "drug", group: "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one", source: "統整（三）p.91", img: "assets/medchem/co-difluocortolone.png",
  desc: ["17 號位的 OH 改成 H",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-fluticasone", chapter: 38, name: "Fluticasone", type: "drug", group: "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one", source: "統整（三）p.91", img: "assets/medchem/co-fluticasone.png",
  desc: ["21 號位的 OH 改成 {{SCH₂F|取代基}}",
    "使用途徑：{{吸入／鼻內|給藥途徑|全身性/局部性}}用藥"] },
{ id: "co-flucinolone", chapter: 38, name: "Flucinolone", type: "drug", group: "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one", source: "統整（三）p.91", img: "assets/medchem/co-flucinolone.png",
  desc: ["16α 位從 CH₃ 改成 OH",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-betamethasone", chapter: 38, name: "Betamethasone", type: "drug", group: "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-betamethasone.png",
  desc: ["（基本結構）",
    "使用途徑：{{全身性|給藥途徑|局部性/吸入}}用藥"] },
{ id: "co-beclomethasone", chapter: 38, name: "Beclomethasone", type: "drug", group: "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-beclomethasone.png",
  desc: ["9α 取代基從 F 改成 {{Cl|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-clobetasol", chapter: 38, name: "Clobetasol", type: "drug", group: "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-clobetasol.png",
  desc: ["21 號位從 OH 改成 {{Cl|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-halobetasol", chapter: 38, name: "Halobetasol", type: "drug", group: "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物", source: "統整（三）p.91", img: "assets/medchem/co-halobetasol.png",
  desc: ["跟 Clobetasol 比多了 {{6α-fluoro|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-desonide", chapter: 38, name: "Desonide", type: "drug", group: "Ketal：6、9 號位皆沒有取代基", source: "統整（三）p.92", img: "assets/medchem/co-desonide.png",
  desc: ["（基本結構）",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-budesonide", chapter: 38, name: "Budesonide", type: "drug", group: "Ketal：6、9 號位皆沒有取代基", source: "統整（三）p.92", img: "assets/medchem/co-budesonide.png",
  desc: ["ketal 結構從 3C 改成 {{4C|數值|3C/5C}}",
    "使用途徑：{{吸入／鼻內|給藥途徑|全身性/局部性}}用藥"] },
{ id: "co-flunisolide", chapter: 38, name: "Flunisolide", type: "drug", group: "Ketal：6 號位具有 α-fluoro 取代基", source: "統整（三）p.92", img: "assets/medchem/co-flunisolide.png",
  desc: ["與 Desonide 相比多了 {{6α-fluoro|取代基}}",
    "使用途徑：{{吸入／鼻內|給藥途徑|全身性/局部性}}用藥"] },
{ id: "co-flurandrenolide", chapter: 38, name: "Flurandrenolide", type: "drug", group: "Ketal：6 號位具有 α-fluoro 取代基", source: "統整（三）p.92", img: "assets/medchem/co-flurandrenolide.png",
  desc: ["1、2 號位間{{沒有|性質|具有}}雙鍵",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-amcinonide", chapter: 38, name: "Amcinonide", type: "drug", group: "Ketal：9 號位具有 α-fluoro 取代基", source: "統整（三）p.92", img: "assets/medchem/co-amcinonide.png",
  desc: ["ketal 結構從 3C 改成 {{5C|數值|4C}}、21 號位為{{乙酯基|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },
{ id: "co-halcinonide", chapter: 38, name: "Halcinonide", type: "drug", group: "Ketal：9 號位具有 α-fluoro 取代基", source: "統整（三）p.92", img: "assets/medchem/co-halcinonide.png",
  desc: ["1、2 號位間沒有雙鍵、21 號位為 {{Cl|取代基}}",
    "使用途徑：{{局部性|給藥途徑|全身性/吸入}}用藥"] },

/* ===== 第 39 章（統整（三）壹拾伍 性荷爾蒙－雌激素相關藥物 p.93–99；畫面章號 15）===== */
/* 一、性荷爾蒙介紹：碳數口訣表與生合成途徑圖放告示牌；二、雌性激素作用劑：灰底 Human Estrogens／Synthetic Estrogens／Xenoestrogens 各為分類；
   三、雌性激素拮抗劑：灰底 SERMs，與 Aromatase Inhibitors（深灰）底下三個淺灰（Steroid 結構之不可逆／可逆抑制劑、雜環結構之抑制劑）為第三層小標；
   四、黃體激素作用劑：灰底 Pregnanes 類、Androgen 類（加後綴避免與之後章節重名）；五、黃體激素拮抗劑沒有灰底，章節標題就是分類。
   p.94–95、p.97–98 的表格沒有欄位名稱（藥名在上、結構、文字在下），文字放說明；p.96、p.99 欄位是特性／藥理及臨床應用。
   p.94 Human Estrogens 右側共通說明放該分類知識卡；p.97 的代謝路徑說明放雜環結構之抑制劑知識卡；Carbinol 為無活性代謝物，做成一格。 */

{ id: "es-ethinylestradiol", chapter: 39, name: "Ethinyl Estradiol", type: "drug", group: "Human Estrogens（人體雌激素及其衍生物）", source: "統整（三）p.94", img: "assets/medchem/es-ethinylestradiol.png",
  desc: ["17 號位具有{{三鍵|結構}}，口服可耐酸且不易被代謝"] },
{ id: "es-estriol", chapter: 39, name: "Estriol", type: "drug", group: "Human Estrogens（人體雌激素及其衍生物）", source: "統整（三）p.94", img: "assets/medchem/es-estriol.png",
  desc: ["3、16、17 皆有 {{OH|取代基}} 取代，口服使用"] },
{ id: "es-estradiol", chapter: 39, name: "Estradiol", type: "drug", group: "Human Estrogens（人體雌激素及其衍生物）", source: "統整（三）p.94", img: "assets/medchem/es-estradiol.png",
  desc: ["較 Estriol 少了 {{16-OH|取代基}}，IM 注射使用"] },
{ id: "es-estrone", chapter: 39, name: "Estrone", type: "drug", group: "Human Estrogens（人體雌激素及其衍生物）", source: "統整（三）p.94", img: "assets/medchem/es-estrone.png",
  desc: ["17 號的 OH 變成{{酮基|結構}}，IM、陰道或局部使用"] },
{ id: "es-des", chapter: 39, name: "Diethylstilbestrol（DES）", short: "DES", type: "drug", group: "Synthetic Estrogens（合成雌激素）", source: "統整（三）p.94", img: "assets/medchem/es-des.png",
  desc: ["{{trans|結構|cis}}-form 活性較大，活性為 Estradiol 的 {{10 倍|數值}}",
    "會增加{{子宮頸癌|疾病}}的風險，現用來治療{{前列腺癌|疾病}}"] },
{ id: "es-hexestrol", chapter: 39, name: "Hexestrol", type: "drug", group: "Synthetic Estrogens（合成雌激素）", source: "統整（三）p.94", img: "assets/medchem/es-hexestrol.png",
  desc: ["藥效較 DES {{差|性質|好}}"] },
{ id: "es-dienestrol", chapter: 39, name: "Dienestrol", type: "drug", group: "Synthetic Estrogens（合成雌激素）", source: "統整（三）p.94", img: "assets/medchem/es-dienestrol.png",
  desc: ["中間為{{亞乙基|結構}}取代（CH₃CH=）"] },
{ id: "es-genistein", chapter: 39, name: "Genistein", type: "drug", group: "Xenoestrogens（環境雌激素）", source: "統整（三）p.95", img: "assets/medchem/es-genistein.png",
  desc: ["存在於{{黃豆|名詞}}類製品：含有 {{Isoflavanoid|結構}}、Genistein"] },
{ id: "es-zeranol", chapter: 39, name: "Zeranol", type: "drug", group: "Xenoestrogens（環境雌激素）", source: "統整（三）p.95", img: "assets/medchem/es-zeranol.png",
  desc: ["{{黴菌毒素|名詞}}"] },
{ id: "es-coumestrol", chapter: 39, name: "Coumestrol", type: "drug", group: "Xenoestrogens（環境雌激素）", source: "統整（三）p.95", img: "assets/medchem/es-coumestrol.png"  },
{ id: "es-methoxychlor", chapter: 39, name: "Methoxychlor", type: "drug", group: "Xenoestrogens（環境雌激素）", source: "統整（三）p.95", img: "assets/medchem/es-methoxychlor.png",
  desc: ["用作{{殺蟲劑|用途}}"] },
{ id: "es-bisphenola", chapter: 39, name: "Bisphenol A", type: "drug", group: "Xenoestrogens（環境雌激素）", source: "統整（三）p.95", img: "assets/medchem/es-bisphenola.png",
  desc: ["{{工業|用途}}用"] },
{ id: "es-clomiphene", chapter: 39, name: "Clomiphene", type: "drug", group: "Triphenylethylene 類：Selective Estrogen Receptor Modulators（SERMs）", source: "統整（三）p.96", img: "assets/medchem/es-clomiphene.png",
  feat: ["E form：{{Enclomiphene|藥名}}，具有 {{antiestrogenic|性質|estrogenic}} 性質",
    "Z form：{{Zuclomiphene|藥名}}，具有 estrogenic 活性，可促進排卵治療不孕"],
  pharm: ["口服使用（消旋化合物）"] },
{ id: "es-tamoxifen", chapter: 39, name: "Tamoxifen", type: "drug", group: "Triphenylethylene 類：Selective Estrogen Receptor Modulators（SERMs）", source: "統整（三）p.96", img: "assets/medchem/es-tamoxifen.png",
  feat: ["活性結構：{{Aminoethyl ether|結構}} side chain",
    "主要由 {{CYP3A4|酵素}} 進行 N-去甲基化，無活性",
    "也可由 {{CYP2D6|酵素}} 行 4-Hydroxylation，有活性"],
  pharm: ["口服使用，治療 Estrogen-effect {{乳癌|疾病}}",
    "選擇性不佳，於子宮和骨骼皆促效，有{{子宮內膜增生|副作用}}的風險"] },
{ id: "es-raloxifene", chapter: 39, name: "Raloxifene", type: "drug", group: "Triphenylethylene 類：Selective Estrogen Receptor Modulators（SERMs）", source: "統整（三）p.96", img: "assets/medchem/es-raloxifene.png",
  feat: ["具有 {{Benzothiophene|結構}} 結構",
    "兩個 OH 基具有 Estrogen 的效果",
    "將 Tamoxifen 的活性結構換成 {{Piperidine|結構}}，防止進行 N-demethylation"],
  pharm: ["具有組織選擇性：拮抗作用在{{乳房|器官}}組織，促效作用僅在{{骨頭|器官}}，對{{子宮|器官}}無作用",
    "OH 多，首度代謝高，生體可用率 <5%"] },
{ id: "es-formestane", chapter: 39, name: "4-Hydroxy-androstenedione", short: "4-OH-androstenedione", type: "drug", group: "Steroid 結構之不可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-formestane.png"  },
{ id: "es-propynylandrostenedione", chapter: 39, name: "10β-Propynyl-androstenedione", type: "drug", group: "Steroid 結構之不可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-propynylandrostenedione.png"  },
{ id: "es-methyleneandrostenedione", chapter: 39, name: "6-Methylene-androstenedione", type: "drug", group: "Steroid 結構之不可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-methyleneandrostenedione.png"  },
{ id: "es-methylandrostadienedione", chapter: 39, name: "1-Methyl-androstandienedione", type: "drug", group: "Steroid 結構之可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-methylandrostadienedione.png"  },
{ id: "es-aminophenylthio", chapter: 39, name: "7α-Aminophenyl-thioandrostenedione", short: "7α-Aminophenyl-thio...", type: "drug", group: "Steroid 結構之可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-aminophenylthio.png"  },
{ id: "es-aminophenylandro", chapter: 39, name: "7α-Aminophenyl-androstandienedione", short: "7α-Aminophenyl-andro...", type: "drug", group: "Steroid 結構之可逆抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-aminophenylandro.png"  },
{ id: "es-anastrozole", chapter: 39, name: "Anastrozole", type: "drug", group: "雜環結構之抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-anastrozole.png"  },
{ id: "es-letrozole", chapter: 39, name: "Letrozole", type: "drug", group: "雜環結構之抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-letrozole.png"  },
{ id: "es-vorozole", chapter: 39, name: "Vorozole", type: "drug", group: "雜環結構之抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-vorozole.png"  },
{ id: "es-carbinol", chapter: 39, name: "Carbinol（無活性代謝物）", short: "Carbinol", type: "drug", group: "雜環結構之抑制劑", source: "統整（三）p.97", img: "assets/medchem/es-carbinol.png"  },
{ id: "es-acetoxyprogesterone", chapter: 39, name: "17α-Acetoxyprogesterone", type: "drug", group: "Pregnanes 類", source: "統整（三）p.98", img: "assets/medchem/es-acetoxyprogesterone.png"  },
{ id: "es-dydrogesterone", chapter: 39, name: "Dydrogesterone", type: "drug", group: "Pregnanes 類", source: "統整（三）p.98", img: "assets/medchem/es-dydrogesterone.png"  },
{ id: "es-megestrol", chapter: 39, name: "Megestrol acetate", type: "drug", group: "Pregnanes 類", source: "統整（三）p.98", img: "assets/medchem/es-megestrol.png"  },
{ id: "es-chlormadinone", chapter: 39, name: "Chlormadinone acetate", type: "drug", group: "Pregnanes 類", source: "統整（三）p.98", img: "assets/medchem/es-chlormadinone.png"  },
{ id: "es-medroxyprogesterone", chapter: 39, name: "Medroxyprogesterone acetate", type: "drug", group: "Pregnanes 類", source: "統整（三）p.98", img: "assets/medchem/es-medroxyprogesterone.png"  },
{ id: "es-ethisterone", chapter: 39, name: "Ethisterone", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-ethisterone.png"  },
{ id: "es-norethisterone", chapter: 39, name: "Norethisterone", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-norethisterone.png"  },
{ id: "es-etonogestrel", chapter: 39, name: "Etonogestrel", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-etonogestrel.png"  },
{ id: "es-norgestrel", chapter: 39, name: "Norgestrel", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-norgestrel.png"  },
{ id: "es-desogestrel", chapter: 39, name: "Desogestrel", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-desogestrel.png"  },
{ id: "es-ethynodiol", chapter: 39, name: "Ethynodiol diacetate", type: "drug", group: "Androgen 類（黃體激素作用劑）", source: "統整（三）p.98", img: "assets/medchem/es-ethynodiol.png"  },
{ id: "es-mifepristone", chapter: 39, name: "Mifepristone", type: "drug", group: "黃體激素拮抗劑（Progesterone Antagonists）", source: "統整（三）p.99", img: "assets/medchem/es-mifepristone.png",
  feat: ["由 Norethindrone 修飾而來",
    "B 環上多一個雙鍵",
    "11 位接 {{N,N-dimethylphenyl|結構}}★",
    "17 位接 α-{{propyne|結構}}"],
  pharm: ["別名：RU486、Mifeprex",
    "可口服，具有{{抗糖皮質激素|機轉}}活性",
    "{{不會|性質|會}}通過胎盤",
    "與 {{Misoprostol|藥名}} 併用{{墮胎|用途}}"] },
{ id: "es-onapristone", chapter: 39, name: "Onapristone", type: "drug", group: "黃體激素拮抗劑（Progesterone Antagonists）", source: "統整（三）p.99", img: "assets/medchem/es-onapristone.png",
  feat: ["由 Mifepristone 修飾而來",
    "17 位接{{正丙醇|結構}}"],
  pharm: ["修飾後{{降低|性質|增加}}抗糖皮質激素活性"] },

/* ===== 第 40 章（統整（三）壹拾陸 性荷爾蒙－雄激素相關藥物 p.100–103；畫面章號 16）===== */
/* 一、雄性激素：灰底天然雄性激素（Testosterone 及其衍生物，右側六點放說明、5α-DHT 結構當附圖）；人工合成雄性激素（深灰）底下 C₁₇α-alkyl testosterone／C₁₉-norandrogens／其他（淺灰）為第三層小標（其他加前綴避免重名）；
   二、促性腺激素抑制劑沒有灰底，章節標題就是分類；三、Antiandrogens（深灰）底下類固醇類似物／非類固醇類似物（淺灰）；四、雄性激素合成抑制劑的灰底 5α-reductase inhibitors、CYP17A1 inhibitors 各自為分類。
   p.100–101 表格沒有欄位名稱（藥名在上、結構、文字在下），文字放說明；p.102 Antiandrogens 的特性欄沒有欄位名稱，文字放說明；p.101、p.103 欄位是特性／藥理及臨床應用。 */

{ id: "an-testosterone", chapter: 40, name: "Testosterone", type: "drug", group: "天然雄性激素：Testosterone 及其衍生物", source: "統整（三）p.100", img: "assets/medchem/an-testosterone.png", imgMore: ["assets/medchem/an-dht.png"],
  desc: ["{{5α-H|結構}}（5α-androstane）有更佳雄激素活性，如 Stanozolol、{{5α-DHT|藥名}}（結構如圖）",
    "17β-OH 的氧原子對受體結合位很重要，酯化後可延長作用時間；17α-alkyl groups 可防止 17β-OH 被代謝，{{口服|給藥途徑}}有效",
    "C₁₉-norandrogens（C₁₀ 上沒有甲基）：雄性素活性{{下降|性質|上升}}，但保留{{同化代謝|藥效}}的特性",
    "環的擴大或縮小會降低雄性激素的活性，如 Testolactone 屬於 {{18-oxasteroid|結構}} 類",
    "鹵素取代基：只有在 {{C₄ 或 C₉|結構}} 時活性維持或增加",
    "雜環結構：C₂ 以氧原子取代（Oxandrolone），為臨床上唯一有效的雜環類固醇"] },
{ id: "an-methyltestosterone", chapter: 40, name: "17α-Methyltestosterone", type: "drug", group: "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服", source: "統整（三）p.100", img: "assets/medchem/an-methyltestosterone.png"  },
{ id: "an-oxymesterone", chapter: 40, name: "Oxymesterone", type: "drug", group: "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服", source: "統整（三）p.100", img: "assets/medchem/an-oxymesterone.png"  },
{ id: "an-methandrostenolone", chapter: 40, name: "Methandrostenolone", type: "drug", group: "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服", source: "統整（三）p.100", img: "assets/medchem/an-methandrostenolone.png"  },
{ id: "an-fluoxymesterone", chapter: 40, name: "Fluoxymesterone", type: "drug", group: "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服", source: "統整（三）p.100", img: "assets/medchem/an-fluoxymesterone.png"  },
{ id: "an-norethandrolone", chapter: 40, name: "Norethandrolone", type: "drug", group: "C₁₉-norandrogens（C₁₀ 上沒有接甲基）", source: "統整（三）p.100", img: "assets/medchem/an-norethandrolone.png"  },
{ id: "an-nandrolone", chapter: 40, name: "Nandrolone decanoate", type: "drug", group: "C₁₉-norandrogens（C₁₀ 上沒有接甲基）", source: "統整（三）p.100", img: "assets/medchem/an-nandrolone.png"  },
{ id: "an-oxandrolone", chapter: 40, name: "Oxandrolone", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-oxandrolone.png",
  desc: ["唯一有效之{{雜環|結構}}類固醇"] },
{ id: "an-stanozolol", chapter: 40, name: "Stanozolol", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-stanozolol.png",
  desc: ["具有 {{pyrazole|結構}} 雜環"] },
{ id: "an-testolactone", chapter: 40, name: "Testolactone", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-testolactone.png",
  desc: ["D 環置換成{{六元環內酯|結構}}（lactone）"] },
{ id: "an-oxymetholone", chapter: 40, name: "Oxymetholone", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-oxymetholone.png"  },
{ id: "an-ethylestrenol", chapter: 40, name: "Ethylestrenol", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-ethylestrenol.png"  },
{ id: "an-methenolone", chapter: 40, name: "Methenolone acetate", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-methenolone.png"  },
{ id: "an-chlortestosterone", chapter: 40, name: "Chlortestosterone acetate", type: "drug", group: "其他人工合成雄性激素", source: "統整（三）p.101", img: "assets/medchem/an-chlortestosterone.png"  },
{ id: "an-danazol", chapter: 40, name: "Danazol", type: "drug", group: "促性腺激素抑制劑（Gonadotropin inhibitors）", source: "統整（三）p.101", img: "assets/medchem/an-danazol.png",
  feat: ["屬於 {{Ethisterone|藥名}} 的 {{isoxazole|結構}}★衍生物",
    "C₁₇ 有{{乙炔基|結構}}（ethinyl group）",
    "{{CYP3A4|酵素}} 代謝後 isoxazole 開環，形成無活性的 2-hydroxymethylethisterone"],
  pharm: ["抑制腦下垂體和下視丘釋放 {{FSH|物質}} 和 {{LH|物質}}",
    "可治療{{子宮內膜組織異位|疾病}}"] },
{ id: "an-cyproterone", chapter: 40, name: "Cyproterone acetate", type: "drug", group: "類固醇類似物（Steroidal antiandrogens）", source: "統整（三）p.102", img: "assets/medchem/an-cyproterone.png"  },
{ id: "an-oxendolone", chapter: 40, name: "Oxendolone", type: "drug", group: "類固醇類似物（Steroidal antiandrogens）", source: "統整（三）p.102", img: "assets/medchem/an-oxendolone.png"  },
{ id: "an-flutamide", chapter: 40, name: "Flutamide", type: "drug", group: "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來", source: "統整（三）p.102", img: "assets/medchem/an-flutamide.png",
  desc: ["{{Toluidides|結構}} 取代衍生物",
    "由 {{CYP1A2|酵素}} 進行 hydroxylation，得到活性代謝物 {{2-hydroxyflutamide|代謝物}}（抗雄性素活性更強）"] },
{ id: "an-nilutamide", chapter: 40, name: "Nilutamide", type: "drug", group: "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來", source: "統整（三）p.102", img: "assets/medchem/an-nilutamide.png",
  desc: ["Toluidides 取代衍生物",
    "屬於 {{nitroaromatic|結構}} antiandrogen"] },
{ id: "an-bicalutamide", chapter: 40, name: "Bicalutamide", type: "drug", group: "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來", source: "統整（三）p.102", img: "assets/medchem/an-bicalutamide.png",
  desc: ["Toluidides 取代衍生物",
    "具有 {{Fluorosulfonyl benzene|結構}}",
    "僅 {{R-form|結構|S-form}} 具有抗雄性激素活性"] },
{ id: "an-enzalutamide", chapter: 40, name: "Enzalutamide", type: "drug", group: "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來", source: "統整（三）p.102", img: "assets/medchem/an-enzalutamide.png",
  desc: ["類似將 Bicalutamide 中間結構環化，形成 {{Thiohydantion|結構}}",
    "可治療{{去勢無效之前列腺癌|疾病}}"] },
{ id: "an-finasteride", chapter: 40, name: "Finasteride", type: "drug", group: "5α-reductase inhibitors", source: "統整（三）p.103", img: "assets/medchem/an-finasteride.png",
  feat: ["C₄ 以 N 原子取代（{{azasteroid|結構}} progestin）",
    "C₁₇ 的 N 上接有 {{1,1-dimethylethyl|結構}} group"],
  pharm: ["抑制 Type {{2、3|數值|1、2}} 的 5α-reductase",
    "性功能障礙副作用較 Dutasteride {{低|性質|高}}"] },
{ id: "an-dutasteride", chapter: 40, name: "Dutasteride", type: "drug", group: "5α-reductase inhibitors", source: "統整（三）p.103", img: "assets/medchem/an-dutasteride.png",
  feat: ["C₄ 以 N 原子取代（azasteroid progestin）",
    "C₁₇ 的 N 上接有 1,4-bis(trifluoromethyl)-phenyl"],
  pharm: ["專一性較差，同時抑制 Type {{1-3|數值}} 的 5α-reductase",
    "藥效較 Finasteride {{強|性質|弱}}"] },
{ id: "an-abiraterone", chapter: 40, name: "Abiraterone", type: "drug", group: "CYP17A1 inhibitors（抑制 17α-hydroxylase 和 17,20-lyase）", source: "統整（三）p.103", img: "assets/medchem/an-abiraterone.png",
  feat: ["C₅、C₆ 與 C₁₆、C₁₇ 之間有雙鍵",
    "C₁₇ 接有 {{pyridine|結構}}"],
  pharm: ["治療{{去勢無效之前列腺癌|疾病}}"] },
{ id: "an-ketoconazole", chapter: 40, name: "Ketoconazole", type: "drug", group: "CYP17A1 inhibitors（抑制 17α-hydroxylase 和 17,20-lyase）", source: "統整（三）p.103", img: "assets/medchem/an-ketoconazole.png",
  feat: ["具有 {{imidazole|結構}}、{{piperazine|結構}} 結構"],
  pharm: ["{{抗黴菌|藥效}}藥物",
    "高濃度下可抑制 17α-hydroxylase"] },

/* ===== 第 41 章（統整（三）壹拾柒 腦下垂體激素 p.104–106；畫面章號 17）===== */
/* 本單元沒有結構圖，全是文字說明；八個小節沒有黑底灰底，章節標題就是分類（一、ADH 另分作用劑／拮抗劑；三、GnRH 另分 super agonist／receptor antagonist）。
   講義提到的藥名各做一格，沒有結構圖，講義文字放說明；各節的總說明（ADH 簡介、尿崩症表、SIADH、GnRH 簡介、Prolactin 說明）放知識卡。
   Somatostatin、Growth hormone（rhGH）、Oxytocin、HCG 本身也是藥物，各做一格。 */

{ id: "pt-terlipressin", chapter: 41, name: "Terlipressin", type: "drug", group: "ADH 作用劑（字尾 -pressin）", source: "統整（三）p.104",
  desc: ["作用受體：{{V₁|受體|V₂}} receptor，產生{{血管收縮|藥效}}作用",
    "臨床用途：{{食道靜脈曲張出血|疾病}}、第一型肝腎症候群"] },
{ id: "pt-desmopressin", chapter: 41, name: "Desmopressin", type: "drug", group: "ADH 作用劑（字尾 -pressin）", source: "統整（三）p.104",
  desc: ["作用受體：{{V₂|受體|V₁}} receptor，產生{{抗利尿|藥效}}的作用",
    "臨床用途：{{中樞性尿崩症|疾病}}（CDI）",
    "也可促進{{凝血因子 VIII|物質}}的釋放，治療 {{von Willebrand's Disease|疾病}}"] },
{ id: "pt-vasopressin", chapter: 41, name: "Vasopressin", type: "drug", group: "ADH 作用劑（字尾 -pressin）", source: "統整（三）p.104",
  desc: ["作用受體：同時作用在 V₁ 和 V₂ receptor",
    "臨床用途：{{敗血性休克|疾病}}、食道靜脈曲張出血、下腸胃道出血",
    "結構與 {{Oxytocin|藥名}} 相似，兩者皆為 Cyclic nanopeptides"] },
{ id: "pt-conivaptan", chapter: 41, name: "Conivaptan", type: "drug", group: "ADH 拮抗劑（字尾 -vaptan）", source: "統整（三）p.104",
  desc: ["為 {{V₂ receptor antagonist|機轉}}，可干擾 aquaporin channel、抑制水分再吸收（利尿）",
    "治療 {{SIADH|疾病}} 與高容積低血鈉症"] },
{ id: "pt-tanivaptan", chapter: 41, name: "Tanivaptan", type: "drug", group: "ADH 拮抗劑（字尾 -vaptan）", source: "統整（三）p.104",
  desc: ["為 {{V₂ receptor antagonist|機轉}}，可干擾 aquaporin channel、抑制水分再吸收（利尿）",
    "治療 SIADH 與高容積低血鈉症"] },
{ id: "pt-somatostatin", chapter: 41, name: "Somatostatin（體抑素）", short: "Somatostatin", type: "drug", group: "Somatostatin（體抑素）", source: "統整（三）p.105",
  desc: ["由 {{14|數值}} 個胺基酸組成，主要分布在下視丘、胰臟、胃腸道",
    "可抑制{{生長激素|物質}}、{{升糖素|物質}}、{{胰島素|物質}}、胃泌素等激素的釋放",
    "臨床上可用於治療肢端肥大症、食道靜脈曲張及出血、內分泌腫瘤及{{胃泌素瘤|疾病}}（Zollinger-Ellison's syndrome / Gastrinoma）"] },
{ id: "pt-octreotide", chapter: 41, name: "Octreotide®（Sandostatin）", short: "Octreotide", type: "drug", group: "Somatostatin（體抑素）", source: "統整（三）p.105",
  desc: ["為 Somatostatin analog，活性必要胺基酸片段為 {{Phe-Trp-Lys-Thr|結構}}★",
    "可用於治療{{食道靜脈曲張之出血|疾病}}、肢端肥大症、Diabetic diarrhea",
    "副作用為{{膽囊結石|副作用}}與軟便"] },
{ id: "pt-leuprolide", chapter: 41, name: "Leuprolide", type: "drug", group: "GnRH super agonist（GnRH 的合成類似物）", source: "統整（三）p.105",
  desc: ["與 Histrelin★ 皆以 {{NH-Ethyl|結構}} group 置換 C-terminal Glycine¹⁰-NH₂"] },
{ id: "pt-nafarelin", chapter: 41, name: "Nafarelin", type: "drug", group: "GnRH super agonist（GnRH 的合成類似物）", source: "統整（三）p.105",
  desc: ["藥物多在第 {{6|數值}} 位和第 10 位（C 端）進行結構修飾"] },
{ id: "pt-goserelin", chapter: 41, name: "Goserelin", type: "drug", group: "GnRH super agonist（GnRH 的合成類似物）", source: "統整（三）p.105",
  desc: ["藥物多在第 6 位和第 10 位（{{C 端|部位}}）進行結構修飾"] },
{ id: "pt-histrelin", chapter: 41, name: "Histrelin", type: "drug", group: "GnRH super agonist（GnRH 的合成類似物）", source: "統整（三）p.105",
  desc: ["與 Leuprolide 皆以 {{NH-Ethyl|結構}} group 置換 C-terminal Glycine¹⁰-NH₂"] },
{ id: "pt-abarelix", chapter: 41, name: "Abarelix", type: "drug", group: "GnRH receptor antagonist", source: "統整（三）p.105",
  desc: ["GnRH {{receptor antagonist|機轉|super agonist}}"] },
{ id: "pt-cetrorelix", chapter: 41, name: "Cetrorelix", type: "drug", group: "GnRH receptor antagonist", source: "統整（三）p.105",
  desc: ["GnRH {{receptor antagonist|機轉|super agonist}}"] },
{ id: "pt-rhgh", chapter: 41, name: "rhGH（人類重組生長激素）", short: "rhGH", type: "drug", group: "Growing hormone（GH／生長激素）", source: "統整（三）p.105",
  desc: ["含有 {{191|數值}} 個胺基酸，結構與 {{Prolactin|藥名}} 相似",
    "臨床上使用人類重組 rhGH，作用在 {{Cytokine receptor|標的}} 促進骨骼生長",
    "可刺激 {{Insulin-like growth factor-1|物質}}（IGF-1、Somatomedin C），進而促進骨骼增生"] },
{ id: "pt-pegvisomant", chapter: 41, name: "Pegvisomant", type: "drug", group: "Growing hormone（GH／生長激素）", source: "統整（三）p.105",
  desc: ["為 {{GH antagonist|機轉}}，用來治療{{肢端肥大症|疾病}}"] },
{ id: "pt-bromocriptine", chapter: 41, name: "Bromocriptine", type: "drug", group: "Prolactin（泌乳激素）：高泌乳素血症治療藥物", source: "統整（三）p.106",
  desc: ["治療{{高泌乳素血症|疾病}}的藥物（抑制{{乳汁|物質}}分泌）"] },
{ id: "pt-pergoline", chapter: 41, name: "Pergoline", type: "drug", group: "Prolactin（泌乳激素）：高泌乳素血症治療藥物", source: "統整（三）p.106",
  desc: ["治療{{高泌乳素血症|疾病}}的藥物（抑制{{乳汁|物質}}分泌）"] },
{ id: "pt-cabergoline", chapter: 41, name: "Cabergoline", type: "drug", group: "Prolactin（泌乳激素）：高泌乳素血症治療藥物", source: "統整（三）p.106",
  desc: ["治療{{高泌乳素血症|疾病}}的藥物（抑制{{乳汁|物質}}分泌）"] },
{ id: "pt-quinagoline", chapter: 41, name: "Quinagoline", type: "drug", group: "Prolactin（泌乳激素）：高泌乳素血症治療藥物", source: "統整（三）p.106",
  desc: ["治療{{高泌乳素血症|疾病}}的藥物（抑制{{乳汁|物質}}分泌）"] },
{ id: "pt-oxytocin", chapter: 41, name: "Oxytocin（催產素）", short: "Oxytocin", type: "drug", group: "Oxytocin（催產素）", source: "統整（三）p.106",
  desc: ["由腦下垂體{{後葉|器官|前葉}}分泌，為一種環狀的 Nanopeptide（{{9|數值}} 個胺基酸組成），結構與 Vasopressin 相似，不具有 SH 基團但具有一條雙硫鍵",
    "{{IV|給藥途徑}} 使用為{{誘導分娩|用途}}的最佳藥物，也可控制產後子宮出血（具有子宮收縮作用）",
    "於授乳前 2~3 分鐘經{{鼻孔|給藥途徑}}給藥，可誘導乳汁分泌"] },
{ id: "pt-atosiban", chapter: 41, name: "Atosiban", type: "drug", group: "Oxytocin（催產素）", source: "統整（三）p.106",
  desc: ["Oxytocin antagonist：可減少子宮收縮，IV 給予用於{{安胎|用途}}、預防早產"] },
{ id: "pt-hcg", chapter: 41, name: "HCG（人類絨毛生殖腺激素）", short: "HCG", type: "drug", group: "Human chorionic gonadotropin（HCG／人類絨毛生殖腺激素）", source: "統整（三）p.106",
  desc: ["由人類{{胎盤|器官}}產生，並排泄於尿液當中，可由懷孕婦女之尿中萃取並純化之。會刺激{{黃體|器官}}分泌 Progesterone 以維持子宮內膜",
    "利用單株抗體的專一性反應，可用來{{驗孕|用途}}"] },

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
            [{ t: "1st H₁-blockers", b: true }, "因第一代藥物{{脂溶性高|性質|水溶性高/分子量小/蛋白結合率低}}，可通過 BBB 影響中樞", "Diphenhydramine、Doxylamine、Doxepin"],
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
          table: { head: [[{ t: "Ethanolamine ether 類衍生物", cs: 2 }, "Tricyclic 類衍生物"], ["Diphenhydramine", "Doxylamine", "Doxepin"]],
            cols: ["Diphenhydramine", "Doxylamine", "Doxepin"], rowNames: false, rows: [
              ["● {{Antimuscarinic|機轉}} 最強，可穿過 BBB\n● 具有高結合力", "● 和 Diphenhydramine 差一個甲基\n● 具有高結合力", "具有含 O 七元雜環（{{Oxepin|結構}}）\n● {{E form|結構|Z form}} 具有 CNS 抑制活性"],
              [{ img: "assets/medchem/diphenhydramine.png", t: "Diphenhydramine" }, { img: "assets/medchem/doxylamine.png", t: "Doxylamine" }, { img: "assets/medchem/doxepin.png", t: "Doxepin" }]] } }] },
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
                  "Promethazine、Cyproheptadine、Doxepin"
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
  ch20: {
    "chapter": 20,
    "title": "磺胺類藥物",
    "sections": [
      {
        "id": "overview",
        "title": "壹、磺胺類藥物",
        "items": [
          {
            "title": "磺胺類藥物：作用機轉、藥物動力學與副作用",
            "source": "統整（二）p.3",
            "points": [
              "1. 作用機轉：結構類似 PABA，可抑制 {{Dihydropteroate synthetase|酵素}}★（DHPR），屬於抑菌作用",
              "2. 藥物動力學",
              "- (1) 吸收：口服吸收佳。例外：{{Sulfasalazine|藥名}} 為 Prodrug，{{口服無法吸收|性質|口服吸收佳}}，故用於腸道感染。",
              "- (2) 分布：可穿過 BBB，具有高血漿置換率",
              "- (3) 代謝",
              "- A. N₄ 位置在肝臟被{{乙醯化|代謝}}★（Acetylation）代謝而失去活性",
              "- B. 在{{酸性|性質|鹼性}}或中性尿液中，藥物溶解度會大幅降低，造成{{結晶尿|副作用}}或尿道結石的副作用（磺胺藥本身為{{酸性|性質|鹼性}}）",
              "- C. Sulfasalazine 在體內可代謝還原成 {{Sulfapyridine|代謝物}}（抗菌）和 {{Mesalamine|代謝物}} / [i]meta[/i]-aminosalicylic acid（抗發炎）",
              "3. 副作用",
              "- (1) {{結晶尿|副作用}}（Crystalluria）：酸性或中性尿液中，藥物溶解度會降低，且 N₄-Acetylation 代謝物的溶解度也較低",
              "- (2) 第三型過敏反應：{{Stevens-Johnson syndrome|疾病}}",
              "- (3) {{溶血性貧血|副作用}}：藥物具有高氧化力，可破壞紅血球細胞膜而導致破謝，{{G6PD 缺乏|疾病}}患者禁用",
              "- (4) {{核黃疸|副作用}}（Kernicterus）：與血漿白蛋白有高結合率，使膽紅素進入 BBB 的數量增加，故{{兒童|名詞}}禁用"
            ]
          },
          {
            "title": "磺胺類藥物基本結構",
            "source": "統整（二）p.3",
            "images": [
              "assets/medchem/sa-basic.png"
            ],
            "points": [
              "4. 基本結構"
            ]
          },
          {
            "title": "※ 整理：造成溶血性貧血之藥物",
            "source": "統整（二）p.3",
            "points": [
              "※ 整理：造成{{溶血性貧血|副作用}}之藥物",
              "{{Sulfonamides|藥物類別}}、{{Nitrofuran|藥物類別}}、{{Chloramphenicol|藥名}}、Quinolones、Dapsone、[i]p[/i]-Aminosalicylic acid、Sulfones、Primaquine"
            ]
          }
        ]
      },
      {
        "id": "adjunct",
        "title": "二、非磺胺類輔佐藥物",
        "items": []
      }
    ]
  },
  ch21: {
    "chapter": 21,
    "title": "喹諾酮類與尿道抗菌劑",
    "sections": [
      {
        "id": "overview",
        "title": "貳、喹諾酮類藥物與尿道抗菌劑",
        "items": [
          {
            "title": "Fluoroquinolones：作用機轉、藥物動力學與副作用",
            "source": "統整（二）p.8",
            "points": [
              "1. 作用機轉：{{殺菌|性質|抑菌}}作用，與細菌的 {{DNA gyrase|酵素}}★（Topoisomerase II）及 Topoisomerase IV 結合，抑制 DNA 的複製與轉錄",
              "2. 藥物動力學：屬於 Concentration-dependent，並有後抗生素效應",
              "- (1) 吸收：大部分口服使用，但需避免與{{含金屬離子|物質}}之食物或藥物併服",
              "- (2) 分布：對 CNS 與脂肪分布能力不佳（但 {{Ofloxacin|藥名}} 可穿透 BBB）",
              "- (3) 代謝：屬於 CYP1A2 抑制劑，可使 Theophylline 血中濃度上升",
              "- (4) 排除：大部分經由{{腎臟|器官}}排除，例外：{{Moxifloxacin|藥名}}★經由{{膽汁|器官}}排除",
              "3. 副作用",
              "- (1) 破壞軟骨生長，18 歲以下及孕婦禁止使用",
              "- (2) 腎毒性：R₇ 取代基有 1-piperidinyl 或 3-amino-1-pyrrolidinyl 造成",
              "- (3) 光毒性：R₈ {{具有 F 取代基|取代基}}。若再 R₅ 或 R₈ 位置改接胺基或甲氧基，可使光毒性下降",
              "- (4) QT interval：Gatifloxacin、Gemifloxacin、Moxifloxacin",
              "- (5) 錯合作用：R₃ 具有 COOH、R₄ 具有 C=O"
            ]
          },
          {
            "title": "Fluoroquinolones SAR",
            "source": "統整（二）p.8",
            "images": [
              "assets/medchem/qu-sar.png"
            ],
            "table": {
              "head": [
                "結構特徵",
                "構效關係（SAR）"
              ],
              "rowNames": [
                "N₁",
                "C₃、C₄",
                "C₆",
                "C₇",
                "C₈（甲氧基）",
                "C₈（F）"
              ],
              "rows": [
                [
                  "N₁ 具有環丙烷取代",
                  "藥效{{↑|性質|↓}}、QT 副作用{{↑|性質|↓}}"
                ],
                [
                  "C₃-COOH、C₄-ketone",
                  "DNA gyrase 之結合位（{{錯合作用|機轉}}）"
                ],
                [
                  "C₆ 具有 F 原子",
                  "形成 {{Fluoroquinolones|藥物類別}}，細胞壁穿透力 ↑"
                ],
                [
                  "C₇ 具有 piperazine 取代★",
                  "{{必要基團|名詞}}★，對抗 [i]Pseudomonas[/i] 活性 ↑"
                ],
                [
                  "C₈ 具有甲氧基取代",
                  "光毒性{{↓|性質|↑}}"
                ],
                [
                  "C₈ 具有 F 原子★",
                  "光毒性{{↑|性質|↓}}"
                ]
              ]
            }
          }
        ]
      },
      {
        "id": "urinary",
        "title": "二、尿道抗菌劑",
        "items": [
          {
            "title": "※ Nitrofuran 結構（antimicrobial activity）",
            "group": "Nitrofuran 類藥物",
            "source": "統整（二）p.11",
            "images": [
              "assets/medchem/qu-nitrofuran-sar.png"
            ],
            "points": [
              "※ Nitrofuran 結構：antimicrobial activity"
            ]
          }
        ]
      }
    ]
  },
  ch22: {
    "chapter": 22,
    "title": "抗生素：細胞壁合成抑制劑",
    "sections": [
      {
        "id": "overview",
        "title": "參、抗生素－細胞壁合成抑制劑：一、盤尼西林類（Penicillins）",
        "items": [
          {
            "title": "※ 基本結構與 SAR",
            "source": "統整（二）p.13",
            "images": [
              "assets/medchem/cw-fig-penicillin.png"
            ],
            "points": [
              "1. 環狀結構：A 環為 {{Thiazolidine ring|結構}}、B 環為β-lactam ring（易受酸或酵素水解而開環失去活性）",
              "2. 6-Acylamino（N-acyl）group：參與半合成的重要位置",
              "3. 6 號位之 R group：決定藥物的安定性，如耐酸性、耐酶性",
              "4. 立體組態：{{三個|數值}}不對稱碳，3S、5R、6R（此為 CA 制命名，右方圖片為 USP 制命名）"
            ]
          },
          {
            "title": "※ Penicillin 之半合成",
            "source": "統整（二）p.13",
            "images": [
              "assets/medchem/cw-6apa.png"
            ],
            "points": [
              "1. 基本單位：{{6-APA|藥名}}（6-Aminopenicillanic acid，結構如右）",
              "2. 胺基酸 L-cysteine、L-valine 經微生物代謝參與半合成反應"
            ]
          },
          {
            "title": "※ Penicillin 之降解反應",
            "source": "統整（二）p.13",
            "images": [
              "assets/medchem/cw-fig-degrade.png"
            ],
            "points": [
              "藥物安定之 pH 值範圍：{{6~6.8|數值}}★"
            ],
            "table": {
              "head": [
                "降解環境或因子",
                "降解反應過程"
              ],
              "rowNames": [
                "酸性 H⁺",
                "鹼性 OH⁻",
                "Penicillin amidase"
              ],
              "rows": [
                [
                  "酸性 H⁺",
                  "{{Penicillenic acid|代謝物}}★ → Penicillamine → Penicilloaldehyde"
                ],
                [
                  "鹼性 OH⁻",
                  "{{Penicilloic acid|代謝物}}★"
                ],
                [
                  "Penicillin amidase",
                  "{{6-Aminopenicillanic acid|代謝物}}（6-APA）"
                ]
              ]
            }
          },
          {
            "title": "※ Penicillin 之藥理機轉",
            "source": "統整（二）p.13",
            "points": [
              "1. 結構類似 Acyl-D-Ala-D-Ala，可以和 PBP（Penicillin-binding proteins）結合，進而{{抑制 transpeptidase|機轉}}，阻斷合成細胞壁成分 Peptidoglycan",
              "2. 可和{{胺醣類|藥物類別}}抗生素（Aminoglycosides）併用，具有協同作用",
              "→ 但不可和 {{Neomycin|藥名}}、{{Gentamicin|藥名}} 併用，會產生化學性配伍禁忌"
            ]
          },
          {
            "title": "Penicillin 基本結構（R 為各種基團）",
            "source": "統整（二）p.15",
            "images": [
              "assets/medchem/cw-fig-penicillin-sar.png"
            ],
            "points": [
              "R is a range of groups；* = chiral centres"
            ]
          },
          {
            "title": "Penicillin 分類與抗菌範圍比較（下表參考 102 級藥物治療學共筆）",
            "source": "統整（二）p.14",
            "table": {
              "head": [
                "分類",
                "次分類",
                "藥物",
                "說明",
                "副作用",
                "口服",
                "耐酶",
                "G(+)",
                "G(-)",
                "金黃",
                "綠膿"
              ],
              "rowNames": [
                "Penicillin V",
                "Penicillin G 鈉/鉀鹽",
                "Penicillin G Benzathine",
                "Penicillin G Procaine",
                "Methicillin",
                "Nafcillin",
                "Oxacillin",
                "Cloxacillin",
                "Dicloxacillin",
                "Flucloxacillin",
                "Ampicillin",
                "Amoxicillin",
                "Bacampicillin",
                "Mezlocillin",
                "Piperacillin",
                "Carbenicillin",
                "Ticarcillin",
                "Amoxicillin+Clavulanic acid",
                "Ampicillin+Sulbactam",
                "Piperacillin+Tazobactam",
                "Ticarcillin+Clavulanic acid"
              ],
              "rows": [
                [
                  {
                    "t": "Natural Penicillin",
                    "cs": 2,
                    "rs": 4
                  },
                  null,
                  "Penicillin V 鉀鹽",
                  "第一個{{口服|給藥途徑}} Penicillin",
                  {
                    "t": "-",
                    "rs": 4
                  },
                  "O",
                  {
                    "t": "X",
                    "rs": 4
                  },
                  {
                    "t": "Strep.",
                    "rs": 4
                  },
                  {
                    "t": "-",
                    "rs": 4
                  },
                  {
                    "t": "X",
                    "rs": 4
                  },
                  {
                    "t": "X",
                    "rs": 4
                  }
                ],
                [
                  null,
                  null,
                  "Penicillin G 鈉/鉀鹽",
                  "IV 使用",
                  null,
                  "X",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Penicillin G Benzathine",
                  "IM 使用，較長效",
                  null,
                  "X",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Penicillin G Procaine",
                  "IM 使用，長效型",
                  null,
                  "X",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  {
                    "t": "Penicillinase-resistant penicillin\n（Anti-staphylococcal）",
                    "cs": 2,
                    "rs": 6
                  },
                  null,
                  "Methicillin",
                  {
                    "t": "可抗 {{Penicillinase|酵素}}\n可治療無抗藥性之\n葡萄球菌",
                    "rs": 6
                  },
                  {
                    "t": "Methicillin\n{{間質性腎炎|副作用}}",
                    "rs": 6
                  },
                  "X",
                  {
                    "t": "O",
                    "rs": 6
                  },
                  {
                    "t": "Strep.\n&\nStaph.",
                    "rs": 6
                  },
                  {
                    "t": "-",
                    "rs": 6
                  },
                  {
                    "t": "O",
                    "rs": 6
                  },
                  {
                    "t": "X",
                    "rs": 6
                  }
                ],
                [
                  null,
                  null,
                  "Nafcillin",
                  null,
                  null,
                  "O",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Oxacillin",
                  null,
                  null,
                  "O",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Cloxacillin",
                  null,
                  null,
                  "O",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Dicloxacillin",
                  null,
                  null,
                  "O",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Flucloxacillin",
                  null,
                  null,
                  "O",
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  {
                    "t": "Amino-penicillins\n（Extend-spectrum penicillins）",
                    "cs": 2,
                    "rs": 3
                  },
                  null,
                  "Ampicillin",
                  {
                    "t": "較廣效，可治療某些 G(-)\n{{哺乳婦女可用|性質}}",
                    "rs": 3
                  },
                  {
                    "t": "{{腹瀉|副作用}}",
                    "rs": 3
                  },
                  {
                    "t": "O",
                    "rs": 3
                  },
                  {
                    "t": "X",
                    "rs": 3
                  },
                  {
                    "t": "Strep.",
                    "rs": 3
                  },
                  {
                    "t": "↑",
                    "rs": 3
                  },
                  {
                    "t": "X",
                    "rs": 3
                  },
                  {
                    "t": "X",
                    "rs": 3
                  }
                ],
                [
                  null,
                  null,
                  "Amoxicillin",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Bacampicillin",
                  null,
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
                    "t": "Anti-pseudomonal\npenicillins",
                    "rs": 4
                  },
                  {
                    "t": "Acyl-ureido",
                    "rs": 2
                  },
                  "Mezlocillin",
                  {
                    "t": "較 Aminopenicillin 廣效，\n抗 G(-)↑ 抗厭氧↓\n可治療{{綠膿桿菌|名詞}}",
                    "rs": 4
                  },
                  {
                    "t": "陽離子毒性\n{{酸中毒|副作用}}",
                    "rs": 4
                  },
                  {
                    "t": "X",
                    "rs": 4
                  },
                  {
                    "t": "X",
                    "rs": 4
                  },
                  {
                    "t": "Strep.",
                    "rs": 4
                  },
                  {
                    "t": "↑↑",
                    "rs": 4
                  },
                  {
                    "t": "X",
                    "rs": 4
                  },
                  {
                    "t": "O",
                    "rs": 4
                  }
                ],
                [
                  null,
                  null,
                  "Piperacillin",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  {
                    "t": "Carboxyl",
                    "rs": 2
                  },
                  "Carbenicillin",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Ticarcillin",
                  null,
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
                    "t": "合併療法\n併用β-lactamase inhibitors",
                    "cs": 2,
                    "rs": 4
                  },
                  null,
                  "Amoxicillin+Clavulanic acid",
                  "Augmentin®、Curam®",
                  {
                    "t": "減少藥物被酵素水解，\n可治療{{金黃色葡萄球菌|名詞}}",
                    "cs": 7,
                    "rs": 4
                  },
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Ampicillin+Sulbactam",
                  "Unasyn®",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Piperacillin+Tazobactam",
                  "Zosyn®",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Ticarcillin+Clavulanic acid",
                  "Timentin®",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ]
            },
            "points": [
              "※ Penicillin 類經由{{腎臟|器官}}★排除（例外：{{Nafcillin|藥名}}、{{Oxacillin|藥名}} 經由{{膽汁|器官}}排出）"
            ]
          }
        ]
      },
      {
        "id": "bli",
        "title": "二、β-lactamase Inhibitors",
        "items": [
          {
            "title": "※ β-lactamase Inhibitors 共通特性",
            "group": "β-lactamase Inhibitors",
            "source": "統整（二）p.19",
            "points": [
              "- 皆含有{{β-lactam|結構}}★結構，且 6 號位無 {{acylamino 取代基|取代基}}，在酸性環境下穩定",
              "- {{單獨使用沒有抗菌作用|性質}}★，須併用β-lactam 類抗生素",
              "- 僅能抑制 {{plasmid|名詞}} 媒介產生的β-lactamase，對{{染色體|名詞}}媒介產生者{{無效|性質|有效}}"
            ]
          }
        ]
      },
      {
        "id": "ceph",
        "title": "三、頭孢菌素類（Cephalosporins）",
        "items": [
          {
            "title": "頭孢菌素類共通結構",
            "source": "統整（二）p.20",
            "images": [
              "assets/medchem/cw-fig-cephalosporin.png"
            ],
            "points": [
              "- 具有 {{Dihydrothiazine|結構}}★ ring",
              "- 2、3 號位間有雙鍵"
            ]
          },
          {
            "title": "【Cephalosporin 之命名】",
            "source": "統整（二）p.20",
            "points": [
              "第一代：{{Cefa-|名詞}}、{{Cepha-|名詞}}（例外 Cefaclor）",
              "第二代：其他 + {{Cefaclor|藥名}} + {{Cefuroxime|藥名}}",
              "第三代：{{-ime、-one、-en、-ir|名詞}}（例外 Cefuroxime）",
              "第四代：{{-pi(ro)me|名詞}}"
            ]
          },
          {
            "title": "※ MTT 結構與 7α-methoxy",
            "group": "第二代 Cephalosporins",
            "source": "統整（二）p.21",
            "structs": [
              "assets/medchem/cw-mtt.png"
            ],
            "points": [
              "※ MTT 結構：N-methyl-5-thiotetrazole。藥物：{{Cefamandole|藥名}}、{{Cefmetazole|藥名}}、{{Cefotetan|藥名}}、{{Cefoperazone|藥名}}",
              "※ 具有 7α-methoxy 結構：{{Cefoxitin|藥名}}★、Cefotetan、Cefmetazole"
            ]
          },
          {
            "title": "※ PBP",
            "group": "第三代 Cephalosporins",
            "source": "統整（二）p.23",
            "points": [
              "※ PBP：Penicillin-Binding Proteins"
            ]
          },
          {
            "title": "※ Cephalosporins 整理",
            "source": "統整（二）p.24",
            "points": [
              "※ 第三代第一個口服藥物：{{Cefixime|藥名}}",
              "※ 第三代第一個非口服藥物：{{Cefotaxime|藥名}}",
              "※ 第三代中生體可用率最高：{{Ceftibuten|藥名}}★",
              "※ 第四代第一個注射藥物：{{Cefpirome|藥名}}",
              "※ Cephalosporins 大部分經由{{腎臟|器官}}排除。例外：{{Cefamandole|藥名}}、{{Ceftriaxone|藥名}}、{{Cefoperazone|藥名}} 經由{{膽汁|器官}}排出"
            ]
          }
        ]
      },
      {
        "id": "carba",
        "title": "四、碳青黴烯類（Carbapenems）",
        "items": [
          {
            "title": "碳青黴烯類基本結構",
            "source": "統整（二）p.25",
            "images": [
              "assets/medchem/cw-fig-carbapenem.png"
            ],
            "points": [
              "四、碳青黴烯類（Carbapenems）基本結構"
            ]
          },
          {
            "title": "※ Cilastatin 之結構",
            "group": "第一代 Carbapenems：C₄無甲基保護，易被腎臟 Dehydropeptidase-1★（DHP-1）水解",
            "source": "統整（二）p.25",
            "structs": [
              "assets/medchem/cw-cilastatin.png"
            ],
            "points": [
              "※ Cilastatin 之結構"
            ]
          }
        ]
      },
      {
        "id": "mono",
        "title": "五、單內醯胺類（Monobactams）",
        "items": [
          {
            "title": "單內醯胺類基本結構",
            "source": "統整（二）p.27",
            "images": [
              "assets/medchem/cw-fig-monobactam.png"
            ],
            "points": [
              "五、單內醯胺類（Monobactams）基本結構"
            ]
          }
        ]
      },
      {
        "id": "other",
        "title": "六、其他細胞壁合成抑制劑",
        "items": []
      }
    ]
  },
  ch23: {
    "chapter": 23,
    "title": "抗生素：蛋白質合成抑制劑",
    "sections": [
      {
        "id": "overview",
        "title": "肆、抗生素－蛋白質合成抑制劑",
        "items": [
          {
            "title": "蛋白質合成抑制劑：作用位置總覽",
            "source": "統整（二）p.29",
            "images": [
              "assets/medchem/pr-fig-overview.png"
            ],
            "table": {
              "head": [
                "階段",
                "合成步驟",
                "抑制藥物",
                "核糖體",
                "機轉"
              ],
              "rowNames": [
                "Aminoglycosides",
                "Spectinomycin",
                "Tetracycline",
                "Linezolid",
                "Chloramphenicol",
                "Macrolide、Lincosamide、Fusidic acid"
              ],
              "rows": [
                [
                  {
                    "t": "Initation",
                    "rs": 4
                  },
                  {
                    "t": "fMet-tRNA 與 30S 的 P 位結合開始轉譯\n由 tRNA 攜帶胺基酸進入 A 位",
                    "rs": 4
                  },
                  "Aminoglycosides",
                  {
                    "t": "30S",
                    "rs": 3
                  },
                  "抑制起始物形成、造成 mRNA 誤讀"
                ],
                [
                  null,
                  null,
                  "Spectinomycin",
                  null,
                  "不造成 mRNA 誤讀：唯一{{抑菌|性質|殺菌}}的胺醣類"
                ],
                [
                  null,
                  null,
                  "Tetracycline",
                  null,
                  "抑制 tRNA 結合到核糖體之 {{A 位|位置|P 位}}"
                ],
                [
                  null,
                  null,
                  "Linezolid",
                  "50S",
                  "結合到 50S 使 30S、50S 無法形成 {{70S|名詞}} 複合體"
                ],
                [
                  "Peptide 鍵形成",
                  "Transpeptidase 將 P 位胺基酸帶至 A 位",
                  "Chloramphenicol",
                  "50S",
                  "抑制 {{Transpeptidase|酵素}}"
                ],
                [
                  "Translocation",
                  "將 A 位胺基酸 Translocation 至 P 位",
                  "Macrolide、Lincosamide、Fusidic acid",
                  "50S",
                  "抑制 {{Translocation|機轉}} 作用"
                ]
              ]
            },
            "points": [
              "※ Spectinomycin 不會造成 mRNA 誤讀，僅有抑菌效果",
              "※ Mupirocin：結合到 isoleucyl-tRNA-synthase，使細菌缺乏 {{isoleucine|物質}}"
            ]
          }
        ]
      },
      {
        "id": "amino",
        "title": "一、胺醣類抗生素（Aminoglycosides）",
        "items": [
          {
            "title": "※ Aminoglycoside 之藥理作用",
            "source": "統整（二）p.30",
            "points": [
              "1. 作用機轉",
              "- (1) {{抑制起始複合物 fMet-tRNA|機轉}}：胺醣類可結合 {{30S|標的}}，阻止 tRNA 與核糖體結合",
              "- (2) 造成 mRNA 誤讀（{{殺菌|性質|抑菌}}作用）→ {{Spectinomycin|藥名}} 是唯一{{抑菌|性質|殺菌}}的胺醣類，不造成 mRNA 誤讀",
              "- (3) 與 β-lactam 併用對 G(+)有{{協同效果|機轉}}：β-lactam 影響細胞壁合成，增加胺醣類進入細菌的數量",
              "2. 藥物動力學",
              "- (1) 吸收：{{高親水性|性質|高脂溶性}}★，口服吸收差，多 IV 或局部用藥 → {{Neomycin|藥名}} 因腎毒性大，需{{口服|給藥途徑}}使用",
              "- (2) 分布：不會進入 BBB，但會{{穿過胎盤|性質}}，孕婦禁用",
              "- (3) 排除：以原型藥從{{腎臟|器官}}排出",
              "- (4) 具有後抗生素效應（PAE）：為 {{Concentration-dependent|性質|Time-dependent}}，可以使用 once daily dose 投與",
              "3. 抗菌範圍",
              "- (1) G(-)：特別是{{綠膿桿菌|名詞}}（[i]Pseudomonas aeruginosa[/i]），可併用 Ticarcillin 治療",
              "- (2) G(+)球菌：[i]Enterococcus[/i]、[i]Staphylococcus[/i]、[i]Streptococcus[/i]、[i]Listeria monocytogenes[/i]",
              "- (3) 好氧菌：胺醣類對{{厭氧菌|名詞}}無效",
              "- (4) {{Streptomycin|藥名}} 可作為肺結核第二線用藥；{{Paromomycin|藥名}} 可治療腸道阿米巴原蟲感染",
              "- (5) {{Amikacin|藥名}} 可治療多重抗藥性之 [i]Mycobacterium tuberculosis[/i]（結核桿菌）感染",
              "4. 副作用",
              "- (1) {{耳毒性|副作用}}：損害第 8 對聽神經　※註：Furosemide、Ethacrynic acid、Butetanide、Cisplatin 也會造成耳毒性",
              "- (2) {{腎毒性|副作用}}：胺醣類之 NH₂ 可和腎小管上皮細胞的 phospholipase 結合並抑制其增生，併用 Furosemide 會加重腎毒性",
              "- (3) {{呼吸麻痺|副作用}}：抑制 Ca²⁺進入節前神經末梢，減少釋放 ACh。解毒劑為 {{Neostigmine|藥名}}",
              "5. 抗藥性之產生：{{Acetylase|酵素}}、Adenylase、Phosphorylase 酵素進行反應 →{{Netilmicin|藥名}}、{{Amikacin|藥名}} 較不易被分解而失去活性"
            ]
          },
          {
            "title": "胺醣類基本結構",
            "source": "統整（二）p.31",
            "images": [
              "assets/medchem/pr-deoxystreptamine.png"
            ],
            "points": [
              "- 基本結構：{{Deoxystreptamine|結構}}（於 2 號碳上去除 OH 基）→ {{Streptomycin|藥名}}★、{{Spectinomycin|藥名}}★無此結構",
              "- 由胺糖以{{糖苷鍵|結構}}（glycosidic bond）結合",
              "- 至少需含有一個胺基六碳糖，其中 Streptomycin、Neomycin、Paromomycin 另含有去胺基五碳糖",
              "※ 胺醣類中只有 {{Neomycin|藥名}}、{{Paramomycin|藥名}} 為四個醣基（多了 D-ribose），腎毒性大，不可注射給藥（No-parenteral）"
            ]
          }
        ]
      },
      {
        "id": "tc",
        "title": "二、四環類抗生素（Tetracyclines）",
        "items": [
          {
            "title": "※ Tetracycline 之藥理作用",
            "source": "統整（二）p.33",
            "points": [
              "1. 作用機轉：結合 {{30S|標的}}★，抑制 tRNA 結合到核糖體之 A 位，屬於{{抑菌|性質|殺菌}}作用",
              "2. 藥物動力學",
              "- (1) 吸收：可口服、IV、IM，但若與二價、三價金屬離子螯合便{{無法吸收|性質|吸收增加}}（可加入 {{EDTA|物質}} 防止與 Ca²⁺產生不溶性錯離子）",
              "- (2) 分布：不進入 BBB（但 {{Minocycline|藥名}}、{{Doxycycline|藥名}} 脂溶性高，可進入 BBB。其中 Minocycline 可治療腦膜炎）",
              "- (3) 排除：經由尿液排出。例外：{{Doxycycline|藥名}}★經由{{膽汁|器官}}排除",
              "3. 抗菌範圍：幾乎所有 G(+)、{{立克次體|名詞}}",
              "- (1) {{Doxycycline|藥名}}：可用於治療{{披衣菌|名詞}}（[i]Chlamydia trachomatis[/i]）、{{炭疽病|疾病}}",
              "- (2) {{Tigecycline|藥名}}：對於有高度抗藥性之 G(+)、G(-)、厭氧菌有效，包括 MRSA、VRE",
              "4. 副作用：{{牙齒變色|副作用}}、{{光毒性|副作用}}、{{肝腎損傷|副作用}}（孕婦與孩童應避免使用）",
              "5. 抗藥性之產生：細菌產生{{外排幫浦|機轉}}，增加 Tetracycline 之排出"
            ]
          },
          {
            "title": "※ Tetracycline 之化學性質",
            "source": "統整（二）p.33",
            "images": [
              "assets/medchem/pr-fig-tc-pka.png",
              "assets/medchem/pr-fig-tc-acid.png",
              "assets/medchem/pr-fig-tc-base.png"
            ],
            "points": [
              "1. Tetracycline 為{{兩性|性質}}化合物，在中性溶液中為兩性離子",
              "2. 具有 3 個 pKa 值（見右上圖），其中最低之 pKa 值來自 C₁ 到 C₃ 的 {{conjugated trione system|結構}}；最高之 pKa 值來自 C₄ 的 dimethylamino group",
              "3. 於 pH=4~8 時，在 C₄ 產生{{差向異構|機轉}}（epimerization★），即之間只有一個 chiral center 之組態不同，形成 {{4-epitetracycline|代謝物}}（無活性）",
              "4. Tetracycline 於強酸強鹼下之反應：皆在 {{C 環|位置}}產生反應★",
              "- (1) 強酸環境下形成 {{5,6-Anhydrotetracycline|代謝物}}：C 環上之 6-OH 與 5α-H 進行脫水反應，使 C 環芳香化★，產生無活性的 5,6-anhydrotetracycline",
              "- (2) 強鹼環境下形成 {{Isotetracycline|代謝物}}★：C 環上之 6-OH 與強鹼反應，形成 O⁻。11 和 11a 的碳原子斷裂與 O⁻形成 lactone ring，產生無活性的 isotetracycline"
            ]
          },
          {
            "title": "四環素基本結構與 SAR",
            "source": "統整（二）p.34",
            "images": [
              "assets/medchem/pr-tc-basic.png"
            ],
            "points": [
              "基本結構",
              "- 2 號碳上具有 {{amide group|結構}}",
              "- 4 號碳上具有 α 鍵結的 {{dimethylamino group|結構}}",
              "- 4a 碳上的 H 和 12a 碳上的 OH 皆為 α form →屬於 {{cis form|結構|trans form}}",
              "- 最多可有 {{6|數值}} 個 Chiral center：4、4a、5、5a、6、12a（依其上的取代基決定是否為立體中心）",
              "SAR",
              "- 移除 C₆ 之 OH 或 CH₃ 基團：脂溶性↑，提高生體可用率與安定性（C₆ 之基團與抗菌活性{{無關|性質|有關}}★）",
              "- C₇ 接上 {{Cl|取代基}}：使脂溶性↑★，但會使光毒性副作用加重"
            ]
          }
        ]
      },
      {
        "id": "mac",
        "title": "三、巨環內酯類（Macrolides）",
        "items": [
          {
            "title": "※ Macrolides 之藥理作用",
            "source": "統整（二）p.35",
            "points": [
              "1. 作用機轉：結合 {{50S|標的}}，干擾肽鏈 P→A 位的轉位作用，屬於{{抑菌|性質|殺菌}}作用",
              "2. 藥物動力學",
              "- (1) 吸收：口服為主，但 {{Erythromycin|藥名}} 不耐酸，需製為腸溶錠或是酯化結構",
              "- (2) 分布：藥物結構大，{{不進入 BBB|性質|可進入 BBB}}★（即使病理情況下也不會進入）",
              "- (3) 代謝：多為 {{CYP450 抑制劑|機轉}}（Erythromycin、Clarithromycin、Oleandomycin、Telithromycin），皆有活性代謝物；例外：{{Azithromycin|藥名}} 不會抑制 CYP450",
              "- (4) 排除：經由{{膽汁|器官}}★排出。例外：{{Clarithromycin|藥名}} 經由{{尿液|器官}}排除",
              "3. 抗菌範圍",
              "- (1) G(+)球菌：[i]Staphylococcus aureus[/i]、[i]Streptococcus pyogenes[/i]、[i]Streptococcus pneumonia[/i]，但對 {{MRSA|名詞}} 無效★",
              "- (2) G(+)桿菌：白喉棒狀桿菌 [i]Corynebacterium diphtheria[/i]",
              "- (3) G(-)桿菌：{{百日喉桿菌|名詞}} [i]Bordetella pertussis[/i]（第一線用藥）、退伍軍人桿菌 [i]Legionella pneumophila[/i]",
              "- (4) 非典型肺炎感染（披衣菌 [i]Chlamydia[/i]、{{黴漿菌|名詞}} [i]Mycoplasma[/i]）：{{Erythromycin|藥名}} 為社區性肺炎感染首選用藥",
              "- (5) {{退伍軍人症|疾病}}：可使用 Azithromycin 治療（補充：不可使用 β-lactam 類治療，因大部分分離菌都會產生 β-lactamase）",
              "- (6) {{披衣菌|名詞}}：孕婦泌尿道感染可用 Erythromycin 治療",
              "4. 副作用：{{肝毒性|副作用}}、肝臟酵素抑制",
              "- (1) 膽汁鬱積性黃疸：Erythromycin {{estolate|名詞}}",
              "- (2) {{QT-interval 延長|副作用}}：Erythromycin、Clarithromycin"
            ]
          },
          {
            "title": "※ 抑制 CYP450 之 Macrolides",
            "group": "Macrolides（大環內酯類）",
            "source": "統整（二）p.37",
            "points": [
              "※ 抑制 CYP450 之 Macrolides：{{Erythromycin|藥名}}、{{Clarithromycin|藥名}}、{{Oleandomycin|藥名}}、{{Telithromycin|藥名}}"
            ]
          }
        ]
      },
      {
        "id": "linco",
        "title": "四、Lincosamide 類",
        "items": [
          {
            "title": "Lincosamide 類基本結構與機轉",
            "group": "Lincosamide 類",
            "source": "統整（二）p.38",
            "points": [
              "- 基本結構：{{Pyrrolidine|結構}}★的 4 號位接上 [i]n[/i]-propyl、2 號位接上 α-thiolincosamide，結構中含有 -SCH₃（{{含硫抗生素|藥物類別}}★）",
              "- 機轉：結合在核糖體 {{50S|標的}}，抑制{{轉位|機轉}}作用（與 {{Macrolides|藥物類別}} 相同，因此容易產生{{交互抗藥性|機轉}}）"
            ]
          }
        ]
      },
      {
        "id": "other",
        "title": "五、其他蛋白質抑制劑",
        "items": [
          {
            "title": "※ 抗生素主要依作用機轉分類",
            "source": "統整（二）p.40",
            "points": [
              "※ 抗生素主要可依作用機轉分成以下三大類：① 影響{{細胞壁|標的}}之合成　② 影響{{蛋白質|標的}}之合成　③ 影響{{核酸|標的}}之合成",
              "其中具有{{殺菌|性質|抑菌}}作用的是 ① + ③ + {{Aminoglycoside|藥物類別}}（②的例外）",
              "具有{{抑菌|性質|殺菌}}作用的是 ② + {{Sulfonamide|藥物類別}}（③的例外）",
              "若同類相配則具有{{協同|機轉}}作用（如殺菌+殺菌、抑菌+抑菌），但若異類相配則會產生{{拮抗|機轉}}★作用（殺菌+抑菌★）"
            ],
            "table": {
              "head": [
                "藥物",
                "產生抗藥性之機轉"
              ],
              "rowNames": [
                "Aminoglycosides",
                "β-Lactams",
                "Vancomycin",
                "Tetracycline",
                "Macrolides",
                "Chloramphenicol"
              ],
              "rows": [
                [
                  "Aminoglycosides",
                  "{{Acetylase|酵素}}（乙醯化）、磷酸化、腺核酸化"
                ],
                [
                  "β-Lactams",
                  "產生 {{β-lactamase|酵素}}"
                ],
                [
                  "Vancomycin",
                  "改變 {{D-Ala-D-Ala|結構}} 結構"
                ],
                [
                  "Tetracycline",
                  "{{Active transport|機轉}} 將藥物送出細胞外"
                ],
                [
                  "Macrolides",
                  "細菌對 {{Ribosome binding site|位置}} 進行修飾（非對藥物修飾）"
                ],
                [
                  "Chloramphenicol",
                  "{{Acetyltransferase|酵素}}"
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  ch24: {
    "chapter": 24,
    "title": "抗黴菌藥物",
    "sections": [
      {
        "id": "overview",
        "title": "伍、抗黴菌藥物",
        "items": [
          {
            "title": "抗黴菌藥物：作用位置總覽",
            "source": "統整（二）p.41",
            "images": [
              "assets/medchem/fu-fig-overview.png"
            ],
            "points": [
              "{{Tolnaftate|藥名}}：抑制 {{Squalene epoxidase|酵素}}，且影響細胞膜之結構",
              "{{Allylamines|藥物類別}}（Terbinafine、Naftifine、Butenafine）：抑制 Squalene epoxidase",
              "{{Azoles|藥物類別}}（-conazoles）：抑制 {{14α-demethylase|酵素}}",
              "{{Echinocandins|藥物類別}}（Capofungin、Anidulafungin）：抑制細胞壁合成之酵素：β-1,3-D-glucan synthase",
              "{{Polyenes|藥物類別}}（Nystatin、Natamycin、Amphotericin B）：與細胞膜上的 {{Ergosterol|物質}} 結合，促進 K⁺離子流失",
              "{{Ciclopirox|藥名}}：螯合多價金屬離子，抑制蛋白酶；(低)影響胺基酸吸收、(高)改變細胞膜結構",
              "{{Metronidazole|藥名}}：與 DNA 結合，破壞 DNA",
              "{{Flucytosine|藥名}}：抑制 DNA 和 RNA 之合成",
              "{{Griseofulvin|藥名}}：與 RNA 及微管結合"
            ]
          }
        ]
      },
      {
        "id": "membrane",
        "title": "一、影響真菌細胞膜之藥物",
        "items": [
          {
            "title": "Polyenes 類：與細胞膜上之 Ergosterol 結合，促進 K⁺離子流失",
            "group": "Polyenes 類（抗黴菌）",
            "source": "統整（二）p.42",
            "points": [
              "Polyenes 類：與細胞膜上之 {{Ergosterol|物質}} 結合，促進 {{K⁺|離子}} 離子流失"
            ]
          },
          {
            "title": "Azoles 類：抑制細胞膜合成酵素 14α-demethylase",
            "group": "Azoles 類（抗黴菌）",
            "source": "統整（二）p.43",
            "images": [
              "assets/medchem/fu-fig-azole-tree.png"
            ],
            "points": [
              "Azoles 類：抑制細胞膜合成酵素 {{14α-demethylase|酵素}}★，阻止 {{Lanosterol|物質}} 之去甲基作用",
              "※ {{酸性|性質}}胃液可加速 Ketoconazole、Itraconazole 等的溶離與吸收 → {{Cimetidine|藥名}} 會降低吸收（抑制胃酸分泌），而攝取{{食物|物質}}會刺激胃酸分泌、增加吸收"
            ]
          },
          {
            "title": "※ 1,3-dioxolan 之結構",
            "group": "Imidazole 類藥物",
            "source": "統整（二）p.43",
            "structs": [
              "assets/medchem/fu-dioxolan.png"
            ],
            "points": [
              "※ 1,3-dioxolan 之結構"
            ]
          },
          {
            "title": "Allylamine 類及 Tolnaftate：抑制細胞膜合成酵素 Squalene epoxidase",
            "group": "Allylamine 類及 Tolnaftate",
            "source": "統整（二）p.45",
            "images": [
              "assets/medchem/fu-allylamine.png"
            ],
            "points": [
              "Allylamine 類及 Tolnaftate：抑制細胞膜合成酵素 {{Squalene epoxidase|酵素}}★",
              "皆具有 {{Naphthalene|結構}}★結構",
              "- 具完整 Allylamine 結構：{{Naftifine|藥名}}、{{Terbinafine|藥名}}",
              "- 不完整 Allylamine 結構：{{Butenafine|藥名}}",
              "- 非 Allylamine 結構：{{Tolnaftate|藥名}}★（具有 Thiocarbanilate/Thioester 結構）"
            ]
          }
        ]
      },
      {
        "id": "wall",
        "title": "二、影響真菌細胞壁之藥物",
        "items": []
      },
      {
        "id": "metab",
        "title": "三、影響真菌代謝之藥物",
        "items": []
      },
      {
        "id": "dnarna",
        "title": "四、影響真菌 DNA 或 RNA 之合成藥物",
        "items": []
      }
    ]
  },
  ch25: {
    "chapter": 25,
    "title": "抗結核桿菌、抗麻風、抗瘧疾與驅蟲藥物",
    "sections": [
      {
        "id": "tb",
        "title": "一、抗結核桿菌藥物（Antimycobacterial Agents）",
        "items": [
          {
            "title": "※ 具有肝毒性與造成高尿酸之抗結核藥",
            "group": "第一線用藥（抗結核）",
            "source": "統整（二）p.47",
            "points": [
              "※ 具有{{肝毒性|副作用}}：{{Rifampin|藥名}}、{{Isoniazid|藥名}}、{{Pyrazinamide|藥名}}（RIP）；造成{{高尿酸|副作用}}：{{Ethambutol|藥名}}、Pyrazinamide（EP）"
            ]
          }
        ]
      },
      {
        "id": "lep",
        "title": "二、抗痲瘋桿菌藥物（Antileprosy Agents）",
        "items": []
      },
      {
        "id": "mal",
        "title": "三、抗瘧疾藥物（Antimalarial Agents）",
        "items": []
      },
      {
        "id": "par",
        "title": "四、驅蟲藥物",
        "items": [
          {
            "title": "※ 其他驅蟲藥物",
            "group": "驅蠕蟲藥物",
            "source": "統整（二）p.54",
            "points": [
              "※ 其他驅蟲藥物",
              "{{Niclosamide|藥名}}：抑制{{條蟲|名詞}}的粒線體氧化",
              "{{Oxamnique|藥名}}：結合到{{吸蟲|名詞}}的 DNA",
              "{{Levamisole|藥名}}：增加 {{T cell|名詞}} 之免疫力"
            ]
          }
        ]
      }
    ]
  },
  ch28: {
    "chapter": 28,
    "title": "外用抗感染劑與防腐劑",
    "sections": [
      {
        "id": "topical",
        "title": "一、外用抗感染劑",
        "items": []
      },
      {
        "id": "preserv",
        "title": "二、防腐劑",
        "items": []
      }
    ]
  },
  ch27: {
    "chapter": 27,
    "title": "抗病毒藥物",
    "sections": [
      {
        "id": "overview",
        "title": "捌、抗病毒藥物：總覽",
        "items": [
          {
            "title": "※ 抗病毒藥物總覽",
            "source": "統整（二）p.80",
            "table": {
              "head": [
                "抑制步驟",
                "機轉",
                "抑制藥物（類別）",
                "藥物"
              ],
              "rowNames": [
                "附著",
                "融合",
                "M₂",
                "Neuraminidase",
                "非環狀核苷類似物（A）",
                "非環狀核苷類似物（C）",
                "非環狀核苷類似物（G）",
                "核苷類似物（A）",
                "核苷類似物（T）",
                "核苷類似物（Triazole）",
                "非核苷類似物",
                "影響轉譯"
              ],
              "rows": [
                [
                  {
                    "t": "病毒進入或離開細胞",
                    "rs": 4
                  },
                  "病毒結合 CCR5，附著於細胞上",
                  "附著抑制劑",
                  "{{Maraviroc|藥名}}"
                ],
                [
                  null,
                  "gp41 形成螺旋束，使病毒進入細胞",
                  "融合抑制劑",
                  "{{Enfuvirtide|藥名}}"
                ],
                [
                  null,
                  "H⁺進入 M₂ 通道，使病毒脫膜釋放 RNA",
                  "M₂ 抑制劑",
                  "Amantadine、Rimantadine"
                ],
                [
                  null,
                  "NA 切斷與 Sialic acid 連接，使病毒脫離",
                  "Neuroaminase 抑制劑",
                  "Zanamivir、Oseltamivir、Peramivir"
                ],
                [
                  {
                    "t": "病毒複製",
                    "rs": 8
                  },
                  {
                    "t": "形成核苷類似物競爭 DNA 聚合酶，使藥物編入病毒 DNA，進而終止鏈的延長",
                    "rs": 7
                  },
                  {
                    "t": "非環狀核苷類似物",
                    "rs": 3
                  },
                  "A：Adefovir"
                ],
                [
                  null,
                  null,
                  null,
                  "C：Cidofovir"
                ],
                [
                  null,
                  null,
                  null,
                  "G：Acyclovir、Valacyclovir、Ganciclovir、Entecavir、Famciclovir"
                ],
                [
                  null,
                  null,
                  {
                    "t": "核苷類似物",
                    "rs": 3
                  },
                  "A：Vidarabine"
                ],
                [
                  null,
                  null,
                  null,
                  "T：Idoxuridine、Cytarabine、Trifluridine"
                ],
                [
                  null,
                  null,
                  null,
                  "Triazole 結構：Ribavirin"
                ],
                [
                  null,
                  null,
                  "非核苷類似物",
                  "Boceprevir、Relaprevir、Fomivirsen、Foscarnet"
                ],
                [
                  null,
                  "影響轉譯作用",
                  "影響轉譯作用",
                  "Methisazone"
                ]
              ]
            }
          },
          {
            "title": "※ 抗反轉錄病毒藥物（抗 HIV 藥物）",
            "source": "統整（二）p.80",
            "table": {
              "head": [
                "抑制步驟",
                "機轉",
                "抑制藥物（類別）",
                "藥物"
              ],
              "rowNames": [
                "核苷類似物（A）",
                "核苷類似物（T）",
                "核苷類似物（C）",
                "核苷類似物（I）",
                "非核苷類似物",
                "嵌入",
                "轉譯"
              ],
              "rows": [
                [
                  {
                    "t": "病毒複製",
                    "rs": 5
                  },
                  {
                    "t": "形成核苷類似物競爭，使藥物編入病毒 DNA，進而終止鏈的延長",
                    "rs": 5
                  },
                  {
                    "t": "核苷類似物",
                    "rs": 4
                  },
                  "A：Abacavir、Tenofovir"
                ],
                [
                  null,
                  null,
                  null,
                  "T：Zidovudine、Stavudine"
                ],
                [
                  null,
                  null,
                  null,
                  "C：Zalcitabine、Lamivudine、Emtricitabine"
                ],
                [
                  null,
                  null,
                  null,
                  "I：Didanosine"
                ],
                [
                  null,
                  null,
                  "非核苷類似物",
                  "Nevirapine、Efavirenz、Delavirdine"
                ],
                [
                  "嵌入",
                  "病毒嵌入 DNA",
                  "HIV Integrase Inhibitor",
                  "{{Raltegravir|藥名}}"
                ],
                [
                  "轉譯",
                  "蛋白酶使病毒成熟",
                  "HIV Protease Inhibitor",
                  "Saquinavir、Indinavir、Nelfinavir、Amprenavir"
                ]
              ]
            }
          },
          {
            "title": "※ B 型肝炎藥物治療",
            "source": "統整（二）p.88",
            "table": {
              "head": [
                "藥物",
                "機轉",
                "副作用"
              ],
              "rowNames": [
                "Interferon alfa-2b、Pegylated IFN",
                "Lamivudine",
                "Telbivudine",
                "Entecavir",
                "Adefovir",
                "Tenofovir（TFV）",
                "Tenofovir alafenamide（TAF）"
              ],
              "rows": [
                [
                  "Interferon alfa-2b、Pegylated IFN",
                  "{{免疫調節作用|機轉}}",
                  "類流感症狀、干擾情緒、白血球低下"
                ],
                [
                  "Lamivudine",
                  "{{核苷類似物|藥物類別}}",
                  "{{乳酸中毒|副作用}}、胰臟炎"
                ],
                [
                  "Telbivudine",
                  "核苷類似物",
                  "Creatine kinase 上升、周邊神經病變"
                ],
                [
                  "Entecavir",
                  "核苷類似物",
                  "乳酸中毒"
                ],
                [
                  "Adefovir",
                  "核苷酸類似物",
                  "乳酸中毒、急性腎衰竭、糖尿病"
                ],
                [
                  "Tenofovir（TFV）",
                  "核苷酸類似物",
                  "乳酸中毒、骨質變軟、腎病變"
                ],
                [
                  "Tenofovir alafenamide（TAF）",
                  "進入目標細胞後才轉變成 TFV",
                  "減少 TFV 之全身性副作用"
                ]
              ]
            }
          },
          {
            "title": "※ C 型肝炎藥物治療",
            "source": "統整（二）p.88",
            "points": [
              "1. 傳統療法：{{Interferon|藥名}} + {{Ribavirin|藥名}}（治療效果不佳且副作用多）",
              "2. HCV Direct-acting antivirals agents（{{HCV DAAs|名詞}}）：不同結構性蛋白的蛋白酶抑制劑（Protease inhibitors）"
            ],
            "table": {
              "head": [
                "機轉",
                "字尾",
                "藥物"
              ],
              "rowNames": [
                "NS3/4A Protease inhibitors",
                "NS5A replication complex inhibitors",
                "NS5B inhibitors"
              ],
              "rows": [
                [
                  "NS3/4A Protease inhibitors",
                  "-previr",
                  "Asunaprevir、Glecaprevir、Voxilaprevir"
                ],
                [
                  "NS5A replication complex inhibitors",
                  "-asvir",
                  "Ledipasvir、Daclatasvir、Velpatasvir"
                ],
                [
                  "NS5B inhibitors",
                  "-buvir",
                  "Sofosbuvir、Dasabuvir"
                ]
              ]
            }
          }
        ]
      },
      {
        "id": "flu",
        "title": "一、抑制病毒附著、穿透細胞及早期複製藥物：治療流感病毒",
        "items": [
          {
            "title": "M₂ 抑制劑：阻斷病毒脫殼釋放 RNA",
            "group": "M₂ 抑制劑（M₂ inhibitors）：阻斷病毒脫殼釋放 RNA",
            "source": "統整（二）p.81",
            "images": [
              "assets/medchem/av-adamantane.png"
            ],
            "points": [
              "M₂ 抑制劑（M₂ inhibitors）：阻斷病毒{{脫殼|機轉}}釋放 RNA（抑制 RNA 病毒早期複製）",
              "基本結構：{{Adamantane|結構}}"
            ]
          },
          {
            "title": "神經胺酶抑制劑：可用於治療 A 型及 B 型流感",
            "group": "神經胺酶抑制劑（Neuraminidase inhibitors）",
            "source": "統整（二）p.82",
            "images": [
              "assets/medchem/av-sialic.png"
            ],
            "points": [
              "神經胺酶抑制劑（Neuraminidase inhibitors）：可用於治療 A 型及 B 型流感",
              "- 以 {{Sialic acid|結構}}★作為骨架結構",
              "- C₄ 的取代基可提高與 Neuraminidase 的親和性"
            ]
          }
        ]
      },
      {
        "id": "hiv-fusion",
        "title": "二、融合抑制劑（Fusion Inhibitors）：治療 HIV 病毒",
        "items": []
      },
      {
        "id": "nuc",
        "title": "三、干擾病毒核酸複製的藥物（HIV 病毒藥物放在第四大點介紹）",
        "items": [
          {
            "title": "非環狀核苷類似物：競爭性抑制 DNA polymerase",
            "group": "非環狀核苷類似物（Acyclic Nucleoside Analogs）",
            "source": "統整（二）p.84",
            "points": [
              "非環狀核苷類似物（Acyclic Nucleoside Analogs）：競爭性抑制 {{DNA polymerase|酵素}}★",
              "結構缺乏醣基的 {{3-OH|位置}}（{{無醣基結構|結構}}★），與 DNA polymerase 結合時可使複製終止"
            ]
          },
          {
            "title": "※ HSV、VZV、EBV 與併用副作用",
            "group": "非環狀核苷類似物（Acyclic Nucleoside Analogs）",
            "source": "統整（二）p.84",
            "points": [
              "※ {{HSV|名詞}}（單純皰疹病毒 Herpes Simplex Virus）、{{VZV|名詞}}（水痘帶狀皰疹病毒 Varicella-Zoster Virus）、{{EBV|名詞}}（非洲淋巴細胞瘤病毒 Epstein-Barr Virus）",
              "※ {{Ganciclovir|藥名}} 和 {{Zidovudine|藥名}}、Azathioprine 或 Mycophenolate mofetil 併用時，白血球低下的副作用會加重"
            ]
          },
          {
            "title": "※ 用於 C 型肝炎治療之干擾素",
            "group": "非環狀核苷類似物（Acyclic Nucleoside Analogs）",
            "source": "統整（二）p.85",
            "points": [
              "※ 用於 C 型肝炎治療之{{干擾素|藥物類別}}",
              "- Interferon alfa-2a 為速效、短效型（含 165 個胺基酸）；{{Pegylated|名詞}} interferon alfa-2a 為緩效、長效型★",
              "- PEG 與 Interferon alfa-2a 結合之部位為 Lysine²³ 與 Histidine³⁴，結合後成為長效型干擾素",
              "- 多數干擾素會抑制 {{CYP450|酵素}}，造成藥物交互作用"
            ]
          },
          {
            "title": "（以下三個非環狀核苷類藥物用於治療 B 或 C 肝病毒）",
            "group": "非環狀核苷類似物（Acyclic Nucleoside Analogs）",
            "source": "統整（二）p.85",
            "points": [
              "（以下三個非環狀核苷類藥物用於治療 {{B 或 C 肝病毒|疾病}}）：Adefovir dipivoxil、Entecavir、Famciclovir"
            ]
          }
        ]
      },
      {
        "id": "hiv",
        "title": "四、抗反轉錄病毒藥物：治療 HIV 病毒",
        "items": [
          {
            "title": "核苷類反轉錄酶抑制劑：C₃ 去除 OH 基",
            "group": "核苷類反轉錄酶抑制劑（NRTIs）",
            "source": "統整（二）p.89",
            "points": [
              "核苷類反轉錄酶抑制劑（Nucleoside Reverse-Transcriptase Inhibitors, NRTIs）",
              "C₃ 去除 {{OH 基|取代基}}（核醣上皆無 OH 取代），使 DNA 鏈延長中止"
            ]
          },
          {
            "title": "HIV 蛋白酶抑制劑：字尾 -navir",
            "group": "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）",
            "source": "統整（二）p.92",
            "points": [
              "HIV 蛋白酶抑制劑（HIV Protease Inhibitors）：抑制蛋白質切割，使其無法組裝成病毒。字尾{{-navir|名詞}}"
            ]
          }
        ]
      }
    ]
  },
  ch26: {
    "chapter": 26,
    "title": "抗癌藥物",
    "sections": [
      {
        "id": "overview",
        "title": "柒、抗癌藥物：總覽",
        "items": [
          {
            "title": "※ 1. 非針對細胞週期藥物",
            "source": "統整（二）p.55",
            "table": {
              "head": [
                "分類",
                "機轉",
                "藥物"
              ],
              "rowNames": [
                "Nitrogen mustards",
                "Nitrosourea",
                "DNA Methylator（Dacarbazine）",
                "DNA Methylator（Procarbazine）",
                "DNA Methylator（Temozolomide）",
                "Organoplatinum Complex",
                "未歸類藥物（Busulfan）",
                "未歸類藥物（Altretamine）"
              ],
              "rows": [
                [
                  "Nitrogen mustards",
                  "形成帶正電之 {{Aziridinum|代謝物}}，攻擊 N⁷ 形成 interstrand 連結",
                  "Cyclophosphamide、Ifosfamide、Melphalan、Chlorambucil、Bendamustine、Thiotepa"
                ],
                [
                  "Nitrosourea",
                  "形成 {{Carbocation|代謝物}}，抑制有絲分裂",
                  "Carmustine、Lomustine、Streptozocin"
                ],
                [
                  {
                    "t": "DNA Methylator",
                    "rs": 3
                  },
                  "N-去甲基後形成 {{Diazonium ion|代謝物}}，再變成 methyl carbocation，攻擊 N⁷",
                  "Dacarbazine"
                ],
                [
                  null,
                  "活性代謝物 Methylhydrazine 形成{{甲基自由基|代謝物}}",
                  "Procarbazine"
                ],
                [
                  null,
                  "Prodrug。不須酵素即可形成 {{MTIC|代謝物}}",
                  "Temozolomide"
                ],
                [
                  "Organoplatinum Complex",
                  "Prodrug，經水和活化可形成 {{G-G intrastrand cross linkage|機轉}}",
                  "Cisplatin、Carboplatin、Oxaliplatin、Satraplatin"
                ],
                [
                  {
                    "t": "未歸類藥物",
                    "rs": 2
                  },
                  "在體內形成 {{Dioxide|代謝物}}，與 DNA 作用",
                  "Busulfan"
                ],
                [
                  null,
                  "產生{{甲醛|代謝物}}毒殺細胞",
                  "Altretamine"
                ]
              ]
            }
          },
          {
            "title": "※ 2. 針對細胞週期藥物",
            "source": "統整（二）p.55",
            "table": {
              "head": [
                "分類",
                "機轉",
                "藥物"
              ],
              "rowNames": [
                "葉酸類似物",
                "嘌呤類似物",
                "嘧啶類似物",
                "聚合酶與鏈延長抑制劑",
                "DNA 甲基轉移酶抑制劑",
                "植物生物鹼（喜樹鹼類）",
                "植物生物鹼（鬼臼素類）",
                "植物生物鹼（長春花類）",
                "植物生物鹼（紫杉醇類）",
                "抗生素（Topo II）",
                "抗生素（Bleomycin）"
              ],
              "rows": [
                [
                  "葉酸類似物",
                  "抑制 {{DHFR|酵素}}，進而抑制 Thymidylate synthase",
                  "Methotrexate、Trimetrexate、Pemetrexed"
                ],
                [
                  "嘌呤類似物",
                  "經由 {{HGPRT|酵素}} 活化，抑制 5-Phosphoribosylamine",
                  "6-Mercaptopurine、6-Thioguanine"
                ],
                [
                  "嘧啶類似物",
                  "抑制 {{Thymidylate synthase|酵素}}",
                  "5-Fluorouracil、Capecitabine、Tegafur"
                ],
                [
                  "聚合酶與鏈延長抑制劑",
                  "抑制 {{DNA polymerase|酵素}}",
                  "Cytarabine、Gemcitabine、Cladribine"
                ],
                [
                  "DNA 甲基轉移酶抑制劑",
                  "對 DNA 去甲基化，阻礙異常細胞增生",
                  "Azacitidine、Decitabine、Nelarabine"
                ],
                [
                  {
                    "t": "植物生物鹼",
                    "rs": 4
                  },
                  "抑制 {{Topoisomerase I|酵素}}",
                  "喜樹鹼類：Topotecan、Irinotecan"
                ],
                [
                  null,
                  "抑制 {{Topoisomerase II|酵素}}",
                  "鬼臼素類：Etoposide、Teniposide"
                ],
                [
                  null,
                  "阻止{{微管聚合|機轉}}",
                  "長春花類：Vincristine、Vinblastine"
                ],
                [
                  null,
                  "穩定微管，阻止{{去聚合|機轉}}",
                  "紫杉醇類：Paclitaxel、Docetaxel"
                ],
                [
                  {
                    "t": "抗生素",
                    "rs": 2
                  },
                  "抑制 Topoisomerase II",
                  "Doxorubicin、Daunorubicin"
                ],
                [
                  null,
                  "利用 {{Fe²⁺|離子}} 與 DNA 結合，使 DNA 斷裂",
                  "Bleomycin"
                ]
              ]
            }
          }
        ]
      },
      {
        "id": "alkyl",
        "title": "一、烷化劑（Alkylating agents）",
        "items": [
          {
            "title": "芥子氮類藥物：活性結構為 β-chloroethylamine",
            "group": "芥子氮類藥物（Nitrogen Mustards）：活性結構為 β-chloroethylamine",
            "source": "統整（二）p.56",
            "points": [
              "芥子氮類藥物（Nitrogen Mustards）：活性結構為 {{β-chloroethylamine|結構}}★",
              "※ {{MOPP|名詞}}：Mechlorethamine、Vincristine（Oncovin）、Procarbazine、Prednisone，用來治療 {{Hodgkin disease|疾病}}"
            ]
          }
        ]
      },
      {
        "id": "anti",
        "title": "二、抗代謝藥物",
        "items": [
          {
            "title": "葉酸拮抗劑：Folic acid 結構",
            "group": "葉酸拮抗劑（Folic acid Antagonists）",
            "source": "統整（二）p.62",
            "images": [
              "assets/medchem/ca-folic.png"
            ],
            "points": [
              "葉酸拮抗劑（Folic acid Antagonists）",
              "（下方為{{Folic acid|藥名}}的結構）"
            ]
          },
          {
            "title": "※ 補充：Amidophosphoribosyl transferase",
            "group": "嘌呤拮抗劑（Purine Antagonists）",
            "source": "統整（二）p.64",
            "points": [
              "※ 補充：{{Amidophosphoribosyl transferase|酵素}} 可催化 {{purine|物質}} 之生合成"
            ]
          }
        ]
      },
      {
        "id": "antibio",
        "title": "三、抗腫瘤抗生素類（Anti-tumor Antibiotics）",
        "items": [
          {
            "title": "Anthracyclines 共通結構與機轉",
            "group": "Anthracyclines",
            "source": "統整（二）p.68",
            "images": [
              "assets/medchem/ca-fig-anthracycline.png"
            ],
            "points": [
              "- 非醣基：{{Anthracyclinone|結構}} 結構。醣基：C₇ 以 {{α form|結構}}★接上{{胺糖|結構}}★結構 {{L-daunosamine|結構}}★，為 O-glycosides",
              "- {{Fe²⁺|離子}} 離子可螯合在 B、C 環的 OH、C=O 結構",
              "- 代謝：受到 {{NADPH/CYP450 reductase|酵素}} 作用，產生 anthracycline hydroquinone",
              "- 抗癌機轉：Anthracyclinone 部分可{{嵌入 DNA|機轉}}★，也可{{抑制 Topoisomerase II|機轉}}；可被酵素代謝為超氧與氫氧{{自由基|代謝物}}★，使 DNA 斷鏈",
              "- 副作用：代謝物會引發{{心毒性|副作用}}★（Cardiotoxicity）、酚基容易引起光敏感性、{{橘紅色尿液|副作用}}（可使用 {{Dexrazoxane|藥名}} 解除心毒性）",
              "- 心毒性之原因與 Dexrazoxane 之心臟保護機轉：Anthracycline 可和細胞內的{{鐵離子|離子}}形成複合體，為一強力氧化劑。Dexrazoxane 的作用即是螯合細胞內的游離鐵或結合鐵，進而降低過氧代謝物的產生"
            ]
          }
        ]
      },
      {
        "id": "mitotic",
        "title": "四、有絲分裂抑制劑",
        "items": []
      },
      {
        "id": "enz",
        "title": "六、酵素類藥物（Enzymes）",
        "items": []
      },
      {
        "id": "other",
        "title": "七、其他抗癌藥物",
        "items": []
      },
      {
        "id": "target",
        "title": "八、分子標靶藥物（參考 103 級藥治統整本）",
        "items": [
          {
            "title": "※ 小分子抑制劑：皆為 CYP3A4 受質",
            "group": "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 CYP3A4 受質",
            "source": "統整（二）p.77",
            "points": [
              "小分子抑制劑（Tyrosine Kinase Inhibitors）：皆為 {{CYP3A4|酵素}} 受質"
            ]
          },
          {
            "title": "※ 藥效基團：BCR-ABL 與 EGFR",
            "group": "BCR-ABL Kinase Inhibitors",
            "source": "統整（二）p.78",
            "images": [
              "assets/medchem/ca-core-bcrabl.png",
              "assets/medchem/ca-core-egfr.png"
            ],
            "points": [
              "BCR-ABL Kinase Inhibitors 藥效基團：{{2-Phenylaminopyrimidine|結構}}",
              "EGFR Kinase Inhibitors 藥效基團：{{4-Anilinoquinazoline|結構}} + 含氧取代基"
            ]
          }
        ]
      },
      {
        "id": "tops",
        "title": "五、拓樸異構酶抑制劑（Plant-derived Topoisomerase Inhibitors）",
        "items": [
          {
            "title": "鬼臼毒素類衍生物：抑制 Topoisomerase II",
            "group": "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 Topoisomerase II",
            "source": "統整（二）p.73",
            "images": [
              "assets/medchem/ca-fig-podophyllotoxin.png",
              "assets/medchem/ca-lignan.png"
            ],
            "points": [
              "鬼臼毒素類衍生物（Podophyllotoxin derivatives）：抑制 {{Topoisomerase II|酵素}}★",
              "- 不含 {{N 原子|取代基}}★",
              "- 含有 {{lactone|結構}} 與 {{lignan|結構}} 結構",
              "- {{Etoposide|藥名}} 及 {{Teniposide|藥名}} 為 Podophyllotoxin 之半合成衍生物",
              "- 可穩定 DNA-Topoisomerase II★ complex 使 DNA strand 斷裂"
            ]
          },
          {
            "title": "喜樹鹼類衍生物：抑制 Topoisomerase I",
            "group": "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 Topoisomerase I",
            "source": "統整（二）p.74",
            "images": [
              "assets/medchem/ca-fig-camptothecin.png"
            ],
            "points": [
              "喜樹鹼類衍生物（Camptothecin derivatives）：抑制 {{Topoisomerase I|酵素}}★",
              "- 含有 {{quinoline|結構}}、δ-lactam（C₁₇）結構",
              "- δ-lactone（C₂₁）為藥效基團，{{鹼性|性質|酸性}}環境下易開環形成 Carboxylate，使藥效降低",
              "- {{Topotecan|藥名}} 及 {{Irinotecan|藥名}} 為 Camptothecin 之半合成衍生物",
              "- 可穩定 DNA-Topoisomerase I★ complex 使 DNA strand 斷裂",
              "※ 拓樸異構酶抑制劑皆具有 {{lactone|結構}} 結構"
            ]
          }
        ]
      }
    ]
  },
  ch29: {
    "chapter": 29,
    "title": "自主神經系統簡介",
    "sections": [
      {
        "id": "overview",
        "title": "壹、自主神經系統簡介",
        "items": [
          {
            "title": "一、受體之分布",
            "source": "統整（三）p.3",
            "table": {
              "head": [
                "",
                "節前傳導物質",
                "節前受體",
                "節後傳導物質",
                "節後受體",
                "作用器官"
              ],
              "rowNames": [
                "副交感",
                "交感（骨骼肌血管、汗腺）",
                "交感（心肌、平滑肌、腺體）",
                "交感（腎血管）",
                "交感（腎上腺髓質）",
                "體神經"
              ],
              "rows": [
                [
                  "副交感",
                  {
                    "t": "{{ACh|物質}}",
                    "rs": 5
                  },
                  {
                    "t": "N₁／N_N",
                    "rs": 5
                  },
                  "{{ACh|物質}}",
                  "{{M|受體|N}}",
                  "心肌、平滑肌、腺體"
                ],
                [
                  {
                    "t": "交感",
                    "rs": 4
                  },
                  null,
                  null,
                  "{{ACh|物質}}",
                  "{{M|受體|N}}",
                  "{{骨骼肌血管、汗腺|器官}}"
                ],
                [
                  null,
                  null,
                  null,
                  "{{NE|物質}}",
                  {
                    "t": "腎上腺素受體",
                    "rs": 3
                  },
                  "心肌、平滑肌、腺體"
                ],
                [
                  null,
                  null,
                  null,
                  "{{Dopamine|物質}}",
                  null,
                  "腎血管壁的平滑肌"
                ],
                [
                  null,
                  null,
                  null,
                  "{{NE & Epi|物質}}",
                  null,
                  "{{腎上腺髓質|器官}}"
                ],
                [
                  "體神經",
                  {
                    "t": "無神經節",
                    "cs": 2
                  },
                  null,
                  "{{ACh|物質}}",
                  "{{N₂／N_M|受體|M}}",
                  "骨骼肌"
                ]
              ]
            },
            "points": [
              "《附註》腎上腺髓質受{{交感神經|名詞}}支配，於節前接受 ACh 後，釋放{{腎上腺素 Epi|藥名}}（80%）與{{正腎上腺素|藥名}}（20%）",
              "節前傳導物質皆為 ACh，僅節後傳導物質需特別記憶，尤其是交感的例外－{{骨骼肌血管|器官}}與{{汗腺|器官}}。"
            ]
          },
          {
            "title": "二、受體作用總表（參考自 105 藥理學共筆）",
            "source": "統整（三）p.4",
            "table": {
              "head": [
                "器官",
                "部位",
                "交感神經：作用",
                "交感神經：受體",
                "副交感神經：作用",
                "副交感神經：受體"
              ],
              "rowNames": [
                "心臟・SA node",
                "心臟・pacemaker",
                "心臟・收縮",
                "血管・皮膚內臟血管",
                "血管・骨骼肌血管（主要）",
                "血管・骨骼肌血管（次要）",
                "血管・血管內皮",
                "支氣管平滑肌",
                "消化道・管壁",
                "消化道・括約肌",
                "消化道・分泌",
                "眼睛・輻射狀肌",
                "眼睛・環狀肌",
                "眼睛・睫狀肌",
                "泌尿生殖・膀胱壁",
                "泌尿生殖・括約肌",
                "泌尿生殖・子宮（舒張）",
                "泌尿生殖・子宮（收縮）",
                "泌尿生殖・陰莖",
                "代謝・肝臟（糖質新生）",
                "代謝・肝臟（糖解）",
                "代謝・脂肪細胞",
                "代謝・腎臟",
                "皮膚・立毛平滑肌",
                "汗腺・小汗腺",
                "汗腺・大汗腺"
              ],
              "rows": [
                [
                  {
                    "t": "心臟",
                    "rs": 3
                  },
                  "SA node",
                  "加速",
                  "β₁（主）、β₂",
                  "減速",
                  "{{M₂|受體}}"
                ],
                [
                  null,
                  "pacemaker",
                  "加速",
                  "β₁（主）、β₂",
                  "-",
                  "-"
                ],
                [
                  null,
                  "收縮",
                  "增加",
                  "β₁（主）、β₂",
                  "減少",
                  "M₂"
                ],
                [
                  {
                    "t": "血管",
                    "rs": 4
                  },
                  "皮膚、內臟血管",
                  "收縮",
                  "{{α|受體}}",
                  "-",
                  "-"
                ],
                [
                  null,
                  {
                    "t": "骨骼肌血管",
                    "rs": 2
                  },
                  "舒張（主要）",
                  "{{β₂|受體}}",
                  {
                    "t": "-",
                    "rs": 2
                  },
                  {
                    "t": "-",
                    "rs": 2
                  }
                ],
                [
                  null,
                  null,
                  "收縮（次要）",
                  "α",
                  null,
                  null
                ],
                [
                  null,
                  "血管內皮",
                  "-",
                  "-",
                  "合成與釋放 {{EDRF|物質}}（主成份為 {{NO|物質}} 使血管舒張）",
                  "M₃、M₅"
                ],
                [
                  {
                    "t": "支氣管平滑肌",
                    "cs": 2
                  },
                  null,
                  "舒張",
                  "β₂",
                  "收縮",
                  "{{M₃|受體}}"
                ],
                [
                  {
                    "t": "消化道",
                    "rs": 3
                  },
                  "管壁",
                  "舒張",
                  "α₂、β₂",
                  "收縮",
                  "M₃"
                ],
                [
                  null,
                  "括約肌",
                  "收縮",
                  "α₁",
                  "舒張",
                  "M₃"
                ],
                [
                  null,
                  "分泌",
                  "-",
                  "-",
                  "增加",
                  "M₃"
                ],
                [
                  {
                    "t": "眼睛",
                    "rs": 3
                  },
                  "輻射狀肌 Radial muscle",
                  "收縮（造成{{散瞳|性質|縮瞳}}）",
                  "α₁",
                  "-",
                  "-"
                ],
                [
                  null,
                  "環狀肌 Circular muscle",
                  "-",
                  "-",
                  "收縮（造成{{縮瞳|性質|散瞳}}）",
                  "M₃"
                ],
                [
                  null,
                  "睫狀肌 Ciliary muscle",
                  "舒張（次要）",
                  "β",
                  "收縮（主要）（影響水晶體厚薄）",
                  "M₃"
                ],
                [
                  {
                    "t": "泌尿生殖系統平滑肌",
                    "rs": 5
                  },
                  "膀胱壁",
                  "舒張",
                  "β₂",
                  "收縮",
                  "M₃"
                ],
                [
                  null,
                  "括約肌",
                  "收縮",
                  "α₁",
                  "舒張",
                  "M₃"
                ],
                [
                  null,
                  {
                    "t": "子宮",
                    "rs": 2
                  },
                  "舒張",
                  "β₂",
                  "-",
                  "-"
                ],
                [
                  null,
                  null,
                  "收縮",
                  "α",
                  "收縮",
                  "M₃"
                ],
                [
                  null,
                  "陰莖",
                  "{{射精|性質|勃起}}",
                  "α",
                  "{{勃起|性質|射精}}",
                  "M"
                ],
                [
                  {
                    "t": "代謝功能",
                    "rs": 4
                  },
                  {
                    "t": "肝臟",
                    "rs": 2
                  },
                  "糖質新生",
                  "β₂、α",
                  "-",
                  "-"
                ],
                [
                  null,
                  null,
                  "糖解",
                  "β₂、α",
                  "-",
                  "-"
                ],
                [
                  null,
                  "脂肪細胞",
                  "脂肪分解",
                  "{{β₃|受體}}",
                  "-",
                  "-"
                ],
                [
                  null,
                  "腎臟",
                  "分泌腎素",
                  "{{β₁|受體}}",
                  "-",
                  "-"
                ],
                [
                  "皮膚",
                  "立毛平滑肌",
                  "收縮",
                  "α₁",
                  "-",
                  "-"
                ],
                [
                  {
                    "t": "汗腺",
                    "rs": 2
                  },
                  "★小汗腺 Eccrine（散熱）",
                  "增加分泌",
                  "{{M|受體|α}}★",
                  "-",
                  "-"
                ],
                [
                  null,
                  "大汗腺 Apocrine（腋下、私密處）",
                  "增加分泌",
                  "{{α|受體|M}}",
                  "-",
                  "-"
                ]
              ]
            }
          },
          {
            "title": "三、二級傳訊系統",
            "source": "統整（三）p.5",
            "table": {
              "head": [
                "",
                "GABA_A receptor",
                "Nicotinic receptor",
                "β₁、β₂、β₃（所有β受體）",
                "α₂、M₂、M₄（偶數）",
                "α₁、M₁、M₃、M₅（奇數）"
              ],
              "rowNames": [
                "分類",
                "種類",
                "反應機制",
                "作用"
              ],
              "rows": [
                [
                  "分類",
                  {
                    "t": "離子通道受體",
                    "cs": 2
                  },
                  null,
                  {
                    "t": "G 蛋白偶合受體（{{GPCR|名詞}}）",
                    "cs": 3
                  },
                  null,
                  null
                ],
                [
                  "種類",
                  "{{Cl⁻|離子}}通道",
                  "{{Na⁺, K⁺|離子}}通道（Na⁺為主）",
                  "和 {{Gs|受體}} 蛋白偶合，使 cAMP {{↑|性質|↓}}",
                  "和 {{Gi|受體}} 蛋白偶合，使 cAMP {{↓|性質|↑}}",
                  "和 {{Gq|受體}} 蛋白偶合，產生 {{IP₃/DAG|物質}}"
                ],
                [
                  "反應機制",
                  "GABA 結合至受體\n↓\nCl⁻通道開啟\n↓\nCl⁻流入細胞\n↓\n膜電位下降",
                  "ACh 結合至受體\n↓\nNa⁺通道開啟\n↓\nNa⁺流入細胞\n↓\n膜電位上升",
                  "Epi 或 NE 結合至受體（NE 幾乎不作用在β₂）\n↓\nGs 蛋白活化\n↓\n活化 AC\n↓\nATP ⇨ cAMP\n↓\n活化 PKA\n↓\n磷酸化下游蛋白質，產生反應",
                  "Epi、NE 或 ACh 結合至受體\n↓\nGi 蛋白活化\n↓\n抑制 AC\n↓\ncAMP 減少\n↓\n細胞反應減少",
                  "Epi、NE 或 ACh 結合至受體\n↓\nGq 蛋白活化\n↓\n活化 PLC\n↓\nPIP₂ ⇨ IP₃ + DAG\n↓\n內質網釋出 Ca²⁺\n↓\n活化 PKC\n↓\n磷酸化下游蛋白質，產生反應"
                ],
                [
                  "作用",
                  "細胞{{過極化|性質|去極化}}，產生 IPSP，有{{中樞神經抑制|機轉}}的效果",
                  "細胞{{去極化|性質|過極化}}形成 EPSP，加成超過閾值後形成{{動作電位|名詞}}",
                  "平滑肌鬆弛；心跳加快、收縮力增強；脂肪、肝糖分解；促賀爾蒙和神經傳遞物質釋放；抑血小板凝集等等",
                  "和左欄反應相反",
                  "平滑肌收縮；輻射狀肌（radial muscle）收縮；增加腺體分泌"
                ]
              ]
            },
            "points": [
              "※ 奇數：α₁、M₁、M₃、M₅（Gq）；偶數：α₂、M₂、M₄（Gi）；所有 β 受體為 Gs"
            ]
          },
          {
            "title": "二、Acetylcholine 之生合成",
            "source": "統整（三）p.7",
            "images": [
              "assets/medchem/an-fig-ach.png"
            ],
            "points": [
              "Choline 部分由 {{Serine|物質}}★生合成而來",
              "四種構型中，以 {{Synclinal|結構}}★最為安定",
              "Acetyl-CoA + Choline —（{{Choline acetyltransferase|酵素}}）→ Acetylcholine"
            ]
          },
          {
            "title": "三、Epinephrine 之生合成",
            "source": "統整（三）p.7",
            "images": [
              "assets/medchem/an-fig-epi.png"
            ],
            "points": [
              "Phenylalanine —（{{Phenylalanine hydroxylase|酵素}}）→ Tyrosine",
              "Tyrosine —（{{Tyrosine Oxidase|酵素}}）→ L-Dopa",
              "L-Dopa —（{{Aromatic L-amino acid decarboxylase|酵素}}）→ Dopamine",
              "Dopamine —（{{Dopamine-β-hydroxylase|酵素}}）→ Norepinephrine",
              "Norepinephrine —（{{Norepinephrine N-methyltransferase|酵素}}）→ Epinephrine"
            ]
          },
          {
            "title": "四、影響傳訊機制的藥物",
            "group": "影響傳訊機制的藥物（自主神經）",
            "source": "統整（三）p.6",
            "table": {
              "head": [
                "作用機制",
                "ACh：藥物名稱",
                "ACh：[ACh]",
                "多巴胺／NE：藥物名稱",
                "多巴胺／NE：[NE]"
              ],
              "rowNames": [
                "合成",
                "儲存",
                "釋放（ACh／NE↓）",
                "釋放（NE↑）",
                "作用",
                "回收"
              ],
              "rows": [
                [
                  "合成",
                  "{{hemicholiniums|藥名}}",
                  "{{↓|性質|↑}}",
                  "{{metyrosine|藥名}}",
                  "↓"
                ],
                [
                  "儲存",
                  "{{vesamicol|藥名}}",
                  "↓",
                  "{{reserpine|藥名}}",
                  "↓"
                ],
                [
                  {
                    "t": "釋放",
                    "rs": 2
                  },
                  {
                    "t": "{{botulinum toxin|藥名}}",
                    "rs": 2
                  },
                  {
                    "t": "↓",
                    "rs": 2
                  },
                  "{{bretylium|藥名}}、{{guanethidine|藥名}}",
                  "↓"
                ],
                [
                  null,
                  null,
                  null,
                  "{{amphetamine|藥名}}",
                  "{{↑|性質|↓}}"
                ],
                [
                  "作用",
                  "-",
                  "-",
                  "α₂ agonist、β₂ antagonist",
                  "↓"
                ],
                [
                  "回收",
                  "{{AChE inhibitors|藥物類別}}",
                  "{{↑|性質|↓}}",
                  "{{cocaine|藥名}}、TCAD、amphetamine",
                  "↑"
                ]
              ]
            },
            "points": [
              "乙醯膽鹼 ACh：交感、副交感之節前神經；副交感之節後神經；交感（骨骼肌血管、汗腺）之節後神經；體神經之節後神經",
              "多巴胺／NE：交感之節後神經"
            ]
          }
        ]
      }
    ]
  },
  ch30: {
    "chapter": 30,
    "title": "擬交感神經作用藥物",
    "sections": [
      {
        "id": "direct",
        "title": "一、直接作用劑",
        "items": [
          {
            "title": "※ 受體親和力大小",
            "source": "統整（三）p.9",
            "points": [
              "※ 受體親和力大小",
              "α：{{Epinephrine|藥名}} ≥ Norepinephrine ≫ {{Isoproterenol|藥名}}",
              "β：{{Isoproterenol|藥名}} > Epinephrine > {{Norepinephrine|藥名}}"
            ]
          }
        ]
      },
      {
        "id": "indirect",
        "title": "二、間接作用劑",
        "items": []
      },
      {
        "id": "ephedrine",
        "title": "三、個論：麻黃素及其衍生物（立體組態與衍生物之間的立體關係為重點）",
        "items": [
          {
            "title": "麻黃素及其衍生物",
            "source": "統整（三）p.11",
            "images": [
              "assets/medchem/sy-fig-ephedrine.png"
            ],
            "points": [
              "1. (-)-Ephedrine 的立體組態為 {{1R、2S|結構}}★",
              "2. Ephedrine 與 Pseudoephedrine 之間為 {{diastereomers|名詞}}★關係",
              "3. 受體結合強度比較",
              "D-(-)-Ephedrine > (±)-Ephedrine > L-(+)-Ephedrine > L-(+)-Pseudoephedrine > (±)-Pseudoephedrine > D-(-)-Pseudoephedrine",
              "4. Ephedrine 可當{{支氣管擴張劑|用途}}，使血壓上升、心搏輸出增加，也可改善鼻部發炎"
            ]
          }
        ]
      }
    ]
  },
  ch31: {
    "chapter": 31,
    "title": "擬交感神經拮抗藥物",
    "sections": [
      {
        "id": "a",
        "title": "一、非選擇性 α 拮抗劑",
        "items": []
      },
      {
        "id": "a1",
        "title": "二、選擇性 α₁ 拮抗劑",
        "items": [
          {
            "title": "選擇性 α₁ 拮抗劑：SAR 與藥理",
            "group": "選擇性 α₁ 拮抗劑",
            "source": "統整（三）p.13",
            "images": [
              "assets/medchem/ad-fig-sar.png"
            ],
            "points": [
              "1. SAR",
              "- {{Quinazoline|結構}} 上的 4-amino group 可提供 α₁ 受體之親和性",
              "- {{Piperazine|結構}} 為非必要結構，可用其他結構替代",
              "- {{Acyl moiety|結構}} 與 pKa 有關，影響生體可用率與半衰期",
              "2. 藥理作用：使血管舒張，具有降壓作用（因不作用在 α₂，不影響心跳與心輸出量）",
              "3. 臨床用途：{{高血壓|疾病}}、{{良性前列腺肥大|疾病}}",
              "4. 副作用：{{首次劑量效應|副作用}}（First-dose phenomena），可能導致嚴重低血壓"
            ]
          }
        ]
      },
      {
        "id": "a2",
        "title": "三、選擇性 α₂ 拮抗劑",
        "items": [
          {
            "title": "選擇性 α₂ 拮抗劑：機轉",
            "group": "選擇性 α₂ 拮抗劑",
            "source": "統整（三）p.14",
            "points": [
              "抑制中樞及周邊的 {{α₂|受體}} 受體，造成 {{NE|物質}}、{{Serotonin|物質}} 釋放增加"
            ]
          }
        ]
      },
      {
        "id": "b",
        "title": "四、非選擇性 β 拮抗劑",
        "items": [
          {
            "title": "非選擇性 β 拮抗劑：共通結構",
            "group": "非選擇性 β 拮抗劑",
            "source": "統整（三）p.15",
            "points": [
              "具有 {{Aryloxypropanolamine|結構}}（例外：{{Sotalol|藥名}}）",
              "具有{{雙環|結構|單環}}結構（例外：Sotalol 為{{單環|結構|雙環}}結構）"
            ]
          }
        ]
      },
      {
        "id": "b1",
        "title": "五、選擇性 β₁ 拮抗劑",
        "items": [
          {
            "title": "※ 特殊 β-blocker 整理",
            "group": "選擇性 β₁ 拮抗劑",
            "source": "統整（三）p.16",
            "points": [
              "※ 特殊 β-blocker 整理",
              "1. 具有{{內生交感活性|機轉}} ISA：{{Acebutolol|藥名}}、{{Carteolol|藥名}}、{{Pindolol|藥名}}、{{Penbutolol|藥名}}、（Celiprolol），適合用於{{心率過慢|疾病}}之高血壓病人或老年人",
              "2. 可用於{{心衰竭|疾病}}之病人：{{Metoprolol|藥名}}、{{Carvedilol|藥名}}、{{Bisoprolol|藥名}}，可反轉 Catecholamines 對心臟的損害，提升心衰竭病人之存活率"
            ]
          }
        ]
      },
      {
        "id": "mix",
        "title": "六、混合作用型拮抗劑：作用在 α₁、β 受體",
        "items": [
          {
            "title": "※ 懷孕婦女適用之高血壓藥物",
            "group": "混合作用型拮抗劑（作用在 α₁、β 受體）",
            "source": "統整（三）p.17",
            "points": [
              "※ {{懷孕婦女|名詞}}適用之高血壓藥物★：{{α-Methyldopa|藥名}}、β-blockers、{{Hydralazine|藥名}}、{{Labetalol|藥名}}、{{Trimethophan|藥名}}"
            ]
          }
        ]
      }
    ]
  },
  ch32: {
    "chapter": 32,
    "title": "膽鹼性作用藥物",
    "sections": [
      {
        "id": "direct",
        "title": "一、直接作用劑",
        "items": []
      },
      {
        "id": "indirect",
        "title": "二、間接作用劑（AChEi，Acetylcholinesterase inhibitors）",
        "items": [
          {
            "title": "※ AChE 之作用機轉",
            "source": "統整（三）p.20",
            "images": [
              "assets/medchem/ch-fig-ache.png"
            ],
            "points": [
              "① AChE-Ser-OH + Acetylcholine ⇌ 中間物 → AChE-Ser-O-Acetyl（inactive）+ Choline，再經{{水解|機轉}}回復酵素",
              "② 以 {{Carbamate|結構}} 取代：AChE-Ser-O-C(=O)NR₂ + H₂O → {{Carbamic acid|代謝物}} + AChE-Ser-OH → CO₂ + HNR₂"
            ]
          },
          {
            "title": "不可逆型 AChE 抑制劑：作用機轉",
            "group": "不可逆型 AChE 抑制劑",
            "source": "統整（三）p.22",
            "images": [
              "assets/medchem/ch-fig-aging.png"
            ],
            "points": [
              "作用機轉：水解酶被{{磷酸化|機轉}}，由於經過{{老化作用|機轉}}生成的磷酸基團（解離態）無法被切除，因此水解酶會被永久抑制。"
            ]
          }
        ]
      }
    ]
  },
  ch33: {
    "chapter": 33,
    "title": "膽鹼性拮抗藥物",
    "sections": [
      {
        "id": "musc",
        "title": "一、抗毒蕈鹼受體藥物（Anti-muscarinic）",
        "items": []
      },
      {
        "id": "nn",
        "title": "二、抗 Nn 受體藥物（神經節阻斷劑）",
        "items": []
      },
      {
        "id": "nm",
        "title": "三、抗 Nm 受體藥物（週邊性骨骼肌鬆弛劑）",
        "items": [
          {
            "title": "※ 肝腎功能不佳之患者可使用",
            "group": "非去極化型尼古丁受體拮抗劑（競爭型，Non-depolarizing agents）：共同結構為 Tetrahydroisoquinoline",
            "source": "統整（三）p.27",
            "points": [
              "※ 肝腎功能不佳之患者可使用：{{Succinylcholine|藥名}}、{{Atracurium|藥名}}、{{Mivacurium|藥名}}"
            ]
          }
        ]
      }
    ]
  },
  ch34: {
    "chapter": 34,
    "title": "高血壓藥物",
    "sections": [
      {
        "id": "over",
        "title": "總論：高血壓的治療方向與 RAAS",
        "items": [
          {
            "title": "高血壓治療原理",
            "source": "統整（三）p.28",
            "images": [
              "assets/medchem/hy-fig-overview.png",
              "assets/medchem/hy-fig-angina.png"
            ],
            "points": [
              "降低{{心輸出量|名詞}}：β-blocker（降低心跳速率與收縮力）、Ca²⁺通道阻斷劑（降低收縮力）",
              "降低{{周邊血管阻力|名詞}}：血管舒張劑（PDE 抑制劑、硝基化合物）、RAAS 抑制劑、利尿劑",
              "※ 抗凝血藥物：預防血栓"
            ]
          },
          {
            "title": "RAAS 系統",
            "source": "統整（三）p.28",
            "images": [
              "assets/medchem/hy-fig-raas.png"
            ],
            "points": [
              "使用 ACEi 或 ARB 可降低 {{Aldosterone|物質}} 之分泌，造成 Na⁺/水滯留情形減少，但 {{K⁺|離子}} 濃度會上升"
            ]
          }
        ]
      },
      {
        "id": "ccb",
        "title": "一、Ca²⁺通道阻斷劑",
        "items": [
          {
            "title": "1,4-DHP 與 Ni 系列",
            "group": "1,4-Dihydropyridines（1,4-DHP）",
            "source": "統整（三）p.29",
            "points": [
              "1,4-DHP 對{{周邊血管|器官}}之選擇性較佳，且不用於{{心絞痛|疾病}}之病人",
              "※ 字首為 Ni 者，苯環上皆有 -NO₂ 取代基（苯環的 2、3 號位）",
              "※ 造成{{齒齦增生|副作用}}之藥物：{{Phenytoin|藥名}}、{{Cyclosporine|藥名}}、{{Nifedipine|藥名}}"
            ]
          },
          {
            "title": "1,4-DHP 的結構與代謝",
            "group": "1,4-Dihydropyridines（1,4-DHP）",
            "source": "統整（三）p.30",
            "points": [
              "※ 除了 {{Isradipine|藥名}} 為雜環結構，其餘苯環上都有 Cl 取代基",
              "※ 代謝：所有 1,4-DHP（除了 {{Clevidipine|藥名}}）皆由肝臟 {{CYP3A4|酵素}} 氧化代謝成無活性★代謝物（含雜環 {{pyridine|結構}}★）。例外：{{Nisodipine|藥名}} 的代謝物仍有活性★",
              "→ 鈣離子通道阻斷劑中，{{1,4-Dihydropyridine|藥物類別}} 類★藥物較容易與{{葡萄柚汁|物質}}產生交互作用"
            ]
          }
        ]
      },
      {
        "id": "ace",
        "title": "二、RAAS 系統相關藥物：ACE 抑制劑",
        "items": [
          {
            "title": "ACEi 總論",
            "group": "血管收縮素轉換酶抑制劑（ACEi）",
            "source": "統整（三）p.32",
            "images": [
              "assets/medchem/hy-fig-ace.png",
              "assets/medchem/hy-fig-zn.png"
            ],
            "points": [
              "重要副作用：{{乾咳|副作用}}、{{血管水腫|副作用}}",
              "※ {{孕婦|族群}}禁用！且不可用於單/雙側{{腎動脈狹窄|疾病}}的病人，因為 ACEi 會使出球小動脈擴張，造成腎功能不足",
              "ACEi 重要結構：{{Pyrrolidine|結構}}★（Piperidine）+ COOH（需為 S form）",
              "※ 主要由{{肝臟|器官}}代謝：{{Trandolapril|藥名}}、{{Fosinopril|藥名}}、{{Moexipril|藥名}}（TFM - 聽 FM 電台）",
              "※ 結構中沒有 Pyrrolidine：{{Benazepril|藥名}}、{{Moexipril|藥名}}、{{Quinapril|藥名}}（BMQ - B&Q 特力屋）"
            ]
          },
          {
            "title": "ACEi 的環結構與代謝",
            "group": "血管收縮素轉換酶抑制劑（ACEi）",
            "source": "統整（三）p.33",
            "images": [
              "assets/medchem/hy-fig-ring.png"
            ],
            "points": [
              "※ Lisinopril 會形成 {{di-zwitterion|結構}}，親水性高且口服有效",
              "※ 代謝：1. 葡萄糖醛酸共軛反應 → Fosinopril、Benazepril、Quinapril、Ramipril",
              "2. 環化反應（形成 {{piperazinone|結構}}）→ Moexipril、Perindopril、{{Ramipril|藥名}}★",
              "※ 活性比較：Enalaprilat > Fosinoprilat > Captopril",
              "※ ACEIs 除了 {{Captopril|藥名}}★、{{Lisinopril|藥名}}★ 之外，皆為 {{prodrug|名詞}}"
            ]
          }
        ]
      },
      {
        "id": "arb",
        "title": "三、RAAS 系統相關藥物：ARB",
        "items": [
          {
            "title": "ARB 總論",
            "group": "血管收縮素Ⅱ受體阻斷劑（ARB）",
            "source": "統整（三）p.34",
            "points": [
              "※ {{孕婦|族群}}禁用！且具有{{高血鉀|副作用}}之副作用"
            ]
          },
          {
            "title": "ARB 整理",
            "group": "前驅藥 ARB",
            "source": "統整（三）p.35",
            "points": [
              "※ ARB 中不含 {{tetrazole|結構}} 結構者：{{Telmisartan|藥名}}★、{{Azilsartan|藥名}}、{{Eprosartan|藥名}}",
              "※ 代謝：除了 3 個為前驅藥的 ARBs 和 {{Losartan|藥名}}，其餘 ARBs 皆不產生活性代謝物",
              "※ 抑制 AT₁-receptor 之活性大小：Candesartan > Telmisartan > Irbesartan > Valsartan > Losartan"
            ]
          }
        ]
      },
      {
        "id": "renin",
        "title": "四、RAAS 系統相關藥物：腎素抑制劑",
        "items": [
          {
            "title": "腎素抑制劑與 PRA",
            "group": "腎素抑制劑（Renin inhibitors）",
            "source": "統整（三）p.36",
            "points": [
              "※ Aliskiren 為直接抑制 {{Renin|酵素}}，因此會使 Plasma renin activity（PRA）{{下降|性質|上升}}；而 ACEi、ARB 則會使 PRA {{上升|性質|下降}}"
            ]
          }
        ]
      },
      {
        "id": "vaso",
        "title": "五、血管擴張劑",
        "items": [
          {
            "title": "α₁-blockers",
            "group": "α-receptor Agents",
            "source": "統整（三）p.37",
            "points": [
              "α₁-blockers：{{Prazosin|藥名}}、{{Doxazosin|藥名}}、{{Terazosin|藥名}} 等藥物可選擇性阻斷 α₁-receptor，造成血管擴張而使血壓降低",
              "常見副作用為{{反射性心搏過速|副作用}}（初期須並用 β-blocker）及 {{First-dose effect|副作用}}（首次劑量暈厥）"
            ]
          },
          {
            "title": "高血壓特殊族群與解毒",
            "group": "其他類（降血壓血管擴張劑）",
            "source": "統整（三）p.38",
            "points": [
              "※ {{懷孕婦女|族群}}適用之高血壓藥物★：{{α-Methyldopa|藥名}}、β-blockers、{{Hydralazine|藥名}}、{{Labetalol|藥名}}、{{Trimethophan|藥名}}",
              "※ 用於{{急性高血壓|疾病}}之藥物：{{Nitroprusside|藥名}}、{{Labetalol|藥名}}、{{Fenoldopam|藥名}}、{{Nicardipine|藥名}}",
              "※ {{Cyanide|物質}} 中毒可使用 {{Sodium thiosulfate|藥名}}、{{Hydroxycobalamin|藥名}} 解毒",
              "※ 造成 {{Lupus-like syndrome|副作用}} 之藥物★：{{Hydralazine|藥名}}、{{Procainamide|藥名}}、{{Propylthiouracil|藥名}}"
            ]
          }
        ]
      }
    ]
  },
  ch35: {
    "chapter": 35,
    "title": "抗心律不整藥物",
    "sections": [
      {
        "id": "ia",
        "title": "Class IA",
        "items": [
          {
            "title": "Class IA：抑制 Na⁺ 通道",
            "group": "Class IA（抗心律不整）",
            "source": "統整（三）p.54",
            "points": [
              "抑制 {{Na⁺|離子}} 通道，減緩動作電位上升速度，可治療房性或室性心律不整",
              "※ 具有類紅斑性狼瘡之副作用的藥物：{{Procainamide|藥名}}、{{Hydralazine|藥名}}、{{Propylthiouracil|藥名}}"
            ]
          }
        ]
      },
      {
        "id": "ib",
        "title": "Class IB",
        "items": [
          {
            "title": "Class IB：快速與 Na⁺ 通道結合或解離",
            "group": "Class IB（抗心律不整）",
            "source": "統整（三）p.55",
            "points": [
              "快速與 {{Na⁺|離子}} 通道結合或解離，相較於 IA、IC 副作用與心房作用減少，對於{{心室性|性質|心房性}}心律不整特別有效"
            ]
          }
        ]
      },
      {
        "id": "ic",
        "title": "Class IC",
        "items": [
          {
            "title": "Class IC：緩慢由靜態 Na⁺ 通道解離",
            "group": "Class IC（抗心律不整）",
            "source": "統整（三）p.55",
            "points": [
              "緩慢由靜態 {{Na⁺|離子}} 通道解離，可有效抑制房性或室性心律不整，但{{致心律不整|副作用}}副作用較大"
            ]
          }
        ]
      },
      {
        "id": "ii",
        "title": "Class II",
        "items": [
          {
            "title": "Class II：β-blockers",
            "group": "Class II（抗心律不整）",
            "source": "統整（三）p.56",
            "points": [
              "β-blockers，可降低 {{AV node|部位}} 之間的傳導"
            ]
          }
        ]
      },
      {
        "id": "iii",
        "title": "Class III",
        "items": [
          {
            "title": "Class III：抑制 K⁺ 通道",
            "group": "Class III（抗心律不整）",
            "source": "統整（三）p.56",
            "points": [
              "抑制 {{K⁺|離子}} 通道，延長再極化，但容易引起 {{QT prolong|副作用}} 的 Torsade de pointes",
              "※ Class IA、III 的藥物（除 {{Amiodarone|藥名}} 之外）皆會抑制 K⁺ 通道，造成低血鉀而引發心律不整"
            ]
          }
        ]
      },
      {
        "id": "iv",
        "title": "Class IV",
        "items": [
          {
            "title": "Class IV：抑制 Ca²⁺ 通道",
            "group": "Class IV（抗心律不整）",
            "source": "統整（三）p.57",
            "points": [
              "抑制 {{Ca²⁺|離子}} 通道，不可用於{{心衰竭|疾病}}病人"
            ]
          }
        ]
      },
      {
        "id": "other",
        "title": "其他",
        "items": [
          {
            "title": "※ 阻斷離子通道與心電圖之關係",
            "source": "統整（三）p.57",
            "points": [
              "※ 阻斷離子通道與心電圖之關係",
              "1. 抑制 Ca²⁺：{{PR interval|名詞}} 延長",
              "2. 抑制 Na⁺：{{QRS interval|名詞}} 延長",
              "3. 抑制 K⁺：{{QT interval|名詞}} 延長"
            ]
          }
        ]
      }
    ]
  },
  ch36: {
    "chapter": 36,
    "title": "降血脂藥物",
    "sections": [
      {
        "id": "bas",
        "title": "一、膽酸吸附劑（Bile-acid Sequestrants）",
        "items": [
          {
            "title": "BAS 作用機制",
            "group": "膽酸吸附劑（Bile-acid Sequestrants）",
            "source": "統整（三）p.70",
            "points": [
              "此類藥物為{{聚合物|名詞}}，且大多帶有{{正電荷|性質|負電荷}} → 與膽酸的 COO⁻ 進行{{陰離子交換|機轉}}（Anion-exchange）",
              "BAS 會吸附膽酸，抑制負回饋作用，使體內膽固醇合成膽酸的量變多，進而使膽固醇濃度↓",
              "會增加 {{TG|物質}}，{{胰臟炎|疾病}}患者禁用"
            ]
          }
        ]
      },
      {
        "id": "statin",
        "title": "二、HMG-CoA Reductase Inhibitors（Statins 類藥物）",
        "items": [
          {
            "title": "Statins 總論與整理",
            "group": "HMG-CoA Reductase Inhibitors（Statins 類藥物）",
            "source": "統整（三）p.71",
            "table": {
              "head": [
                "比較",
                "Simvastatin",
                "Lovastatin",
                "Atorvastatin",
                "Fluvastatin",
                "Pravastatin",
                "Rosuvastatin",
                "Pitavastatin"
              ],
              "rows": [
                [
                  {
                    "t": "LDL 下降%",
                    "b": true
                  },
                  "41",
                  "34",
                  "{{50|數值}}",
                  "24",
                  "34",
                  "{{50|數值}}",
                  "-"
                ],
                [
                  {
                    "t": "TG 下降%",
                    "b": true
                  },
                  "18",
                  "16",
                  "29",
                  "10",
                  "24",
                  "18",
                  "-"
                ],
                [
                  {
                    "t": "HDL 上升%",
                    "b": true
                  },
                  "12",
                  "9",
                  "6",
                  "8",
                  "12",
                  "8",
                  "-"
                ],
                [
                  {
                    "t": "半衰期（hr）",
                    "b": true
                  },
                  "1~2",
                  "2",
                  "{{14|數值}}",
                  "1~2",
                  "1~2",
                  "{{19|數值}}",
                  "12"
                ],
                [
                  {
                    "t": "是否進入 CNS",
                    "b": true
                  },
                  "✔",
                  "✔",
                  "✘",
                  "✘",
                  "✘",
                  "✘",
                  "-"
                ],
                [
                  {
                    "t": "腎臟排除率%",
                    "b": true
                  },
                  "13",
                  "10",
                  "2",
                  "<6",
                  "20",
                  "10",
                  "-"
                ],
                [
                  {
                    "t": "腎功能不佳可用",
                    "b": true
                  },
                  "✘",
                  "✘",
                  "✔",
                  "✔",
                  "✘",
                  "✘",
                  "-"
                ],
                [
                  {
                    "t": "每日劑量上限（mg）",
                    "b": true
                  },
                  "80",
                  "80",
                  "80",
                  "80",
                  "80",
                  "40",
                  "-"
                ],
                [
                  {
                    "t": "是否為 Prodrug",
                    "b": true
                  },
                  "✔",
                  "✔",
                  "✘",
                  "✘",
                  "✘",
                  "✘",
                  "✘"
                ],
                [
                  {
                    "t": "CYP3A4 代謝",
                    "b": true
                  },
                  "✔",
                  "✔",
                  "✔",
                  "",
                  "",
                  "",
                  ""
                ],
                [
                  {
                    "t": "CYP2C9 代謝",
                    "b": true
                  },
                  "",
                  "",
                  "",
                  "✔",
                  "",
                  "✔",
                  "✔"
                ],
                [
                  {
                    "t": "不經 CYP450 代謝",
                    "b": true
                  },
                  "",
                  "",
                  "",
                  "",
                  "✔",
                  "",
                  ""
                ],
                [
                  {
                    "t": "食物影響吸收",
                    "b": true
                  },
                  "✘",
                  "↑",
                  "✘",
                  "↓",
                  "↓",
                  "✘",
                  "-"
                ]
              ]
            },
            "points": [
              "※ 降 {{LDL|物質}} 最佳藥物！另可增加 LDL 受體；可併用 {{Niacin|藥名}} 但不可並用 {{Fibrates|藥物類別}} 類藥物",
              "※ Statins 類藥物整理（原型藥：{{Mevastatin|藥名}}）",
              "1. Prodrug 前驅藥：Mevastatin、Simvastatin、Lovastatin",
              "2. CYP3A4 代謝：{{Simvastatin|藥名}}、Lovastatin、Atorvastatin",
              "3. CYP2C9 代謝：{{Rosuvastatin|藥名}}、Fluvastatin、Pitavastatin",
              "4. 不經 CYP450 代謝：{{Pravastatin|藥名}}（交互作用少，用於器官移植後的高血脂）",
              "5. 腎功能不佳可使用：{{Atorvastatin|藥名}}、{{Fluvastatin|藥名}}",
              "6. 半衰期長，可 QD 給予：{{Atorvastatin|藥名}}、{{Rosuvastatin|藥名}}",
              "※ 副作用：肝臟酵素上升、{{橫紋肌溶解|副作用}}（腎功能不足或併用 {{Cyclosporin|藥名}}、{{Gemfibrozil|藥名}} 更容易誘發橫紋肌溶解）",
              "※ {{孕婦|族群}}、哺乳婦、兒童或青少年禁用；避免予 {{Warfarin|藥名}} 併用"
            ]
          },
          {
            "title": "Statins 結構整理",
            "group": "HMG-CoA Reductase Inhibitors（Statins 類藥物）",
            "source": "統整（三）p.73",
            "table": {
              "head": [
                {
                  "t": "分類",
                  "cs": 2
                },
                "說明"
              ],
              "rows": [
                [
                  {
                    "t": "含有 Lactone ring 結構",
                    "rs": 3,
                    "b": true
                  },
                  "Mevastatin",
                  "原型藥；構型為 3R、5R"
                ],
                [
                  null,
                  "Lovastatin",
                  "Meva 加一個 6′-CH₃"
                ],
                [
                  null,
                  "Simvastatin",
                  "Lova 的酯基上加一個 CH₃"
                ],
                [
                  {
                    "t": "由 Lactone ring 開環形成",
                    "b": true
                  },
                  "Pravastatin",
                  "lactone 開環形成"
                ],
                [
                  {
                    "t": "含有中心雜環結構",
                    "rs": 4,
                    "b": true
                  },
                  "Fluvastatin",
                  "{{indole|結構}}"
                ],
                [
                  null,
                  "Atorvastatin",
                  "{{pyrrole|結構}}"
                ],
                [
                  null,
                  "Rosuvastatin",
                  "{{pyrimidine|結構}}"
                ],
                [
                  null,
                  "Pitavastatin",
                  "{{quinoline|結構}}"
                ]
              ]
            },
            "points": [
              "※ 含有 Lactone ring 結構的為 Prodrug"
            ]
          }
        ]
      },
      {
        "id": "fibrate",
        "title": "三、Fibrates 類藥物",
        "items": [
          {
            "title": "Fibrates：降 TG 最佳藥物",
            "group": "Fibrates 類藥物（降 TG 最佳藥物）",
            "source": "統整（三）p.74",
            "points": [
              "Fibrates 類藥物：降 {{TG|物質}} 最佳藥物！可活化 {{PPAR|標的}}★受體，基本結構為 {{phenoxyisobutyric acid|結構}} 衍生物"
            ]
          }
        ]
      },
      {
        "id": "ezetimibe",
        "title": "四、Cholesterol Absorption Inhibitor",
        "items": []
      },
      {
        "id": "niacin",
        "title": "五、Niacins",
        "items": [
          {
            "title": "※ 結構比較",
            "group": "Niacins",
            "source": "統整（三）p.75",
            "images": [
              "assets/medchem/lp-fig-nico.png"
            ],
            "points": [
              "※ 結構比較：Nicotine、Niacin（Nicotinic acid）、Nicotinamide"
            ]
          }
        ]
      },
      {
        "id": "pcsk9",
        "title": "六、PCSK9 複合體",
        "items": [
          {
            "title": "PCSK9 複合體",
            "source": "統整（三）p.75",
            "points": [
              "PCSK9 複合體：藥物有 {{Evolocumab|藥名}}、{{Alirocumab|藥名}}，可抑制 {{LDL 受體|標的}}代謝。用於口服治療無效之家族性高膽固醇血症"
            ]
          }
        ]
      }
    ]
  },
  ch37: {
    "chapter": 37,
    "title": "胰島素與口服降血糖藥物",
    "sections": [
      {
        "id": "over",
        "title": "總論：血糖調控與胰島素",
        "items": [
          {
            "title": "血糖調控相關酵素（蘭氏小島細胞）",
            "source": "統整（三）p.76",
            "points": [
              "※ 血糖調控相關酵素：主要由胰臟之蘭氏小島細胞分泌，細胞可分為 α、β、γ 三種",
              "1. α：又可分為 α₁、α₂ 兩種。其中 α₁ 可分泌少量{{體抑素|物質}}（somatostatin）；α₂ 可分泌{{升糖素|物質}}（Glucagon，29 個胺基酸）來升高血糖",
              "2. β：可分泌具有降血糖作用的{{胰島素|物質}}（Insulin）和{{澱粉素|物質}}（Amylin）",
              "3. γ：主要分泌{{體抑素|物質}}（somatostatin），可抑制胰島素和升糖素釋放"
            ]
          },
          {
            "title": "胰島素（Insuline）之介紹",
            "source": "統整（三）p.76",
            "points": [
              "※ 註：{{Glucagon|物質}} 不具有雙硫鍵",
              "1. 共 {{51|數值}} 個胺基酸，由 A chain（21 個）和 B chain（30 個）組成，並以{{雙硫鍵|結構}}連接（{{2 個|數值}}★分子間 interchain 和 {{1 個|數值}}★分子內 intrachain） #兩件內衣",
              "2. B₂₄、B₂₅ 為受體辨識位置，可藉由結構修飾改變胰島素的性質",
              "3. 可形成單體、二元體、六聚體。常見的六聚體（Hexamer）中心有兩個 {{Zn²⁺|離子}} 且較為安定，需要時才會崩解變成具活性的單體形式（Monomer）",
              "4. 胰島素之作用機轉：以下用 {{GLUT4|標的}} 介紹（GLUT4 可被 Insulin 誘導）",
              "(1) 兩個 Insulin monomer 結合到受體 α subunit，使另一端的 β subunit 受質磷酸化，引發接下來的磷酸化連鎖反應",
              "(2) 同時促進 IRS-1&2，引起 GLUT 的 Translocation，使細胞質中的 GLUT 結合到細胞膜上，增加葡萄糖的吸收，以利細胞利用葡萄糖",
              "(3) 胰島素受體屬於 {{Tyrosine kinase receptor|標的}}★",
              "5. 生理作用：促進葡萄糖進入肌肉和脂肪、降低脂肪分解、TG 增加（刺激 HMG-CoA reductase）、增加蛋白質合成"
            ]
          },
          {
            "title": "Glucose Transporter（GLUT）之分類",
            "source": "統整（三）p.76",
            "table": {
              "head": [
                "GLUT",
                "分布",
                "功能"
              ],
              "rows": [
                [
                  {
                    "t": "GLUT-1",
                    "b": true
                  },
                  "所有組織（含腦和紅血球）",
                  "使 Glucose 可以通過 {{BBB|部位}}，提高腦中的血糖"
                ],
                [
                  {
                    "t": "GLUT-2",
                    "b": true
                  },
                  "β cell、肝臟、腸道",
                  "調節 {{Insulin|物質}} 的釋放"
                ],
                [
                  {
                    "t": "GLUT-3",
                    "b": true
                  },
                  "腦、腎臟、胎盤",
                  "攝取 Glucose 到{{神經元|器官}}"
                ],
                [
                  {
                    "t": "GLUT-4",
                    "b": true
                  },
                  "肌肉、脂肪組織",
                  "{{Insulin|物質}} 媒介攝取得到 Glucose"
                ]
              ]
            },
            "points": [
              "※ Glucose Transporter（GLUT）之分類",
              "※ 若降血糖藥物使用過量，可用 {{Octreotide|藥名}}（Somatostatin analog）拮抗其作用"
            ]
          },
          {
            "title": "影響血糖之藥物",
            "source": "統整（三）p.76",
            "table": {
              "head": [
                "酒精",
                "β-blockers",
                "Diazoxide",
                "利尿劑",
                "類固醇類藥物",
                "Niacin"
              ],
              "rows": [
                [
                  "增加 {{Tolbutamide|藥名}} 代謝",
                  "抑制胰島素合成",
                  "抑制胰島素合成",
                  "低血鉀引發之高血糖",
                  "糖質新生作用",
                  "有高血糖的副作用"
                ]
              ]
            },
            "points": [
              "※ 影響血糖之藥物"
            ]
          }
        ]
      },
      {
        "id": "insulin",
        "title": "一、胰島素類似物",
        "items": []
      },
      {
        "id": "su",
        "title": "二、Sulfonylurea 類藥物",
        "items": [
          {
            "title": "Sulfonylurea：機轉、SAR 與代謝",
            "group": "Sulfonylurea 類藥物",
            "source": "統整（三）p.78",
            "images": [
              "assets/medchem/dm-fig-su1.png",
              "assets/medchem/dm-fig-su2.png",
              "assets/medchem/dm-fig-met1.png",
              "assets/medchem/dm-fig-met2.png"
            ],
            "points": [
              "1. 機轉：抑制 {{ATP 敏感型 K⁺ 通道|標的}}，去極化使 {{Ca²⁺|離子}} 流入細胞，刺激胰島素分泌",
              "2. SAR：基本結構為 {{Benzene Sulfonylurea|結構}}",
              "- 第一代：R₁（para-position）具有小的親脂性取代基，如 Cl、Acetyl group；R₂ 需為立體障礙大的取代基，鏈狀或環狀皆可，但碳數不可小於 3 個",
              "- 第二代之後：由第一代結構衍生而來，Onset 較快、作用時間較長；R₁ 的 Amide 上 N 原子與 Sulfonamide 上 N 原子間的距離很重要；R₁ 具有巨大取代基，增加對 K⁺通道親和力；如圖，Glyburide 中 p-(β-arylcarboxamidoethyl) 結構與藥效有關（較難被代謝）",
              "3. 代謝反應",
              "- 第一代：R₁ 進行 {{Oxidation|代謝}}（Chlorpropamide 因有 Cl 取代，不走此路徑）；R₂ 進行 {{Hydroxylation|代謝}}（Tolazamide 的 4′-hydroxylation 產生活性代謝物）",
              "- 第二代：R₁ 脫去環上取代基，形成無活性的 N-acetyl 衍生物；R₂ 進行 Hydroxylation（para 及 meta 位置，產生低活性代謝物）；若在 R₂ 接上 Cl 可延長藥效，但也會延長代謝時間。第三代加上 CH₃ 可較容易被代謝",
              "4. 用法：於早{{餐前|性質|餐後}} 30 分鐘服藥（{{Glipizide|藥名}} 除外），適用於還能製造胰島素的病患，具有{{天花板|名詞}}效應，但孕婦禁用",
              "5. 副作用：{{體重增加|副作用}}、{{低血糖|副作用}}；第一代藥物容易發生腸胃道不適、過敏性紅疹、惡血質"
            ]
          }
        ]
      },
      {
        "id": "megli",
        "title": "三、Meglitinides 類藥物",
        "items": [
          {
            "title": "Meglitinides：由 Sulfonylurea 衍生",
            "group": "Meglitinides 類藥物",
            "source": "統整（三）p.80",
            "images": [
              "assets/medchem/dm-fig-megli.png"
            ],
            "points": [
              "由 Sulfonylurea 類藥物的 non-sulfonylurea 部分結構衍生而來，換成另一個酸性基團 {{COOH|結構}} 形成 Meglitinide（原型藥）",
              "機轉與 Sulfonylurea 相似，都會抑制 ATP 敏感的 K⁺通道，但作用在不同結合位"
            ]
          }
        ]
      },
      {
        "id": "bigu",
        "title": "四、Biguanides 類藥物",
        "items": [
          {
            "title": "Biguanides：胰島素促敏劑",
            "group": "Biguanides 類藥物",
            "source": "統整（三）p.80",
            "points": [
              "機轉不明，為{{胰島素促敏劑|名詞}}。可降低肝臟輸出葡萄糖、提升週邊組織利用葡萄糖，為第二型糖尿病之{{首選藥物|名詞}}"
            ]
          }
        ]
      },
      {
        "id": "tzd",
        "title": "五、Thiazolidinediones（TZD）類藥物",
        "items": [
          {
            "title": "TZD：機轉與結構",
            "group": "Thiazolidinediones（TZD）類藥物",
            "source": "統整（三）p.81",
            "images": [
              "assets/medchem/dm-fig-tzd.png"
            ],
            "points": [
              "機轉：{{PPARγ|標的}}-agonist，製造胰島素調控蛋白，並使細胞對胰島素更加敏感（增加 {{GLUT4|標的}} 合成），為胰島素促敏劑",
              "※ TZD 類的藥物都含有兩個氧雙鍵結構，代謝後容易形成 {{quinone|結構}}，造成{{肝毒性|副作用}}（{{Acetaminophen|藥名}} 也有類似架構的代謝產物）",
              "※ Muraglitazar、Ragaglitazar 也是降血糖藥物，可以作用在 PPARα、PPARγ；另外可提升 HDL-C"
            ]
          }
        ]
      },
      {
        "id": "agi",
        "title": "六、α-glucosidase Inhibitors",
        "items": [
          {
            "title": "α-glucosidase Inhibitors：機轉與副作用",
            "group": "α-glucosidase Inhibitors",
            "source": "統整（三）p.82",
            "points": [
              "機轉：與{{雙糖|名詞}}競爭 α-glucosidase，使其無法被水解為單糖，減少糖份吸收，可降{{餐後|性質|空腹}}血糖",
              "副作用：消化道刺激、腹痛、脹氣",
              "若服藥後有低血糖的情況，可使用 {{glucose|物質}} 或 {{lactose|物質}} 改善（lactose 由 β-glucosidase 分解）"
            ]
          }
        ]
      },
      {
        "id": "dpp",
        "title": "七、Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）",
        "items": [
          {
            "title": "DPP-4 Inhibitors：基本架構與機轉",
            "group": "Dipeptidyl peptidase-4 抑制劑（DPP-4 Inhibitors）",
            "source": "統整（三）p.83",
            "images": [
              "assets/medchem/dm-fig-dpp.png"
            ],
            "points": [
              "此類藥物具有兩種基本架構：{{α-aminoacylpyrrolidine|結構}}★ 或 {{Xanthine|結構}}（其中在 pyrrolidine 二號位加親電子基可使抑制效果↑）",
              "機轉：抑制 DPP 分解 {{GLP-1|物質}} 和 GIP",
              "1. GLP-1 和 GIP 為腸泌素/incretin，可促進 β cell 分泌胰島素並抑制 α cell 分泌升糖素，使血糖降低",
              "2. DPP-4 為一種 {{Serine protease|酵素}}，其與膜的結合態可溶於血漿"
            ]
          }
        ]
      },
      {
        "id": "sglt",
        "title": "八、SGLT-2 inhibitors",
        "items": [
          {
            "title": "SGLT-2 inhibitors：機轉",
            "group": "SGLT-2 inhibitors",
            "source": "統整（三）p.85",
            "points": [
              "機轉：抑制葡萄糖在{{腎臟|器官}}之再吸收作用，增加葡萄糖之尿液排泄量",
              "與葡萄糖再吸收相關之轉運蛋白有 GLUTs 和 SGLTs 等，其中 SGLT-1 和 SGLT-2 在葡萄糖恆定扮演重要的角色。前者主要分布於大腦、心臟與小腸上皮細胞；後者多存在於腎臟之近曲小管"
            ]
          }
        ]
      },
      {
        "id": "glp",
        "title": "九、Glucagon-like Peptide-1 受體致效劑（GLP-1 receptor agonists）",
        "items": [
          {
            "title": "GLP-1 receptor agonists：GLP-1 簡介",
            "group": "GLP-1 受體致效劑（GLP-1 receptor agonists）",
            "source": "統整（三）p.86",
            "points": [
              "由 30 個胺基酸組成的 Polypeptide，存在於腸道 {{L 細胞|器官}} 中",
              "N 端倒數第二位置含有 {{Alanine|物質}}，會被 DPP-4 快速分解 → 在此位置進行結構修飾，且此類藥物皆{{不可口服|給藥途徑}}",
              "GLP-1 可促進胰島 β cell 分泌胰島素，並抑制 α cell 分泌升糖素，使血糖降低"
            ]
          }
        ]
      },
      {
        "id": "other",
        "title": "十、其他類降血糖藥物",
        "items": []
      }
    ]
  },
  ch38: {
    "chapter": 38,
    "title": "腎上腺皮質激素",
    "sections": [
      {
        "id": "over",
        "title": "總論：取代基總表與分類",
        "items": [
          {
            "title": "取代基總表（藥名旁符號：使用途徑）",
            "source": "統整（三）p.87",
            "images": [
              "assets/medchem/co-fig-sterane.png"
            ],
            "table": {
              "head": [
                "藥物",
                "使用途徑",
                "1,2-雙鍵",
                "6",
                "9",
                "11",
                "16",
                "17",
                "21"
              ],
              "rows": [
                [
                  "Hydrocortisone",
                  "全身",
                  "✘",
                  "H",
                  "H",
                  "β-OH",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Cortisone",
                  "全身",
                  "✘",
                  "H",
                  "H",
                  "{{=O|取代基}}",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Fludrocortisone",
                  "全身",
                  "✘",
                  "H",
                  "{{α-fluoro|取代基}}",
                  "β-OH",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Prednisolone",
                  "全身",
                  "✔",
                  "H",
                  "H",
                  "β-OH",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Prednisone",
                  "全身",
                  "✔",
                  "H",
                  "H",
                  "=O",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Methylprednisolone",
                  "全身",
                  "✔",
                  "{{α-CH₃|取代基}}",
                  "H",
                  "β-OH",
                  "H",
                  "α-OH",
                  "OH"
                ],
                [
                  "Betamethasone",
                  "全身",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  "β-CH₃",
                  "α-OH",
                  "OH"
                ],
                [
                  "Beclomethasone",
                  "局部",
                  "✔",
                  "H",
                  "{{α-chloro|取代基}}",
                  "β-OH",
                  "β-CH₃",
                  "α-OH",
                  "OH"
                ],
                [
                  "Clobetasol",
                  "局部",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  "β-CH₃",
                  "α-OH",
                  "{{Cl|取代基}}"
                ],
                [
                  "Halobetasol",
                  "局部",
                  "✔",
                  "{{α-fluoro|取代基}}",
                  "α-fluoro",
                  "β-OH",
                  "β-CH₃",
                  "α-OH",
                  "Cl"
                ],
                [
                  "Dexamethasone",
                  "全身",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  "α-CH₃",
                  "α-OH",
                  "OH"
                ],
                [
                  "Mometasone",
                  "吸入／鼻內",
                  "✔",
                  "H",
                  "α-chloro",
                  "β-OH",
                  "α-CH₃",
                  "α-OH",
                  "Cl"
                ],
                [
                  "Desoximetasone",
                  "局部",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  "α-CH₃",
                  "{{H|取代基}}",
                  "OH"
                ],
                [
                  "Triamcinolone",
                  "全身、吸入／鼻內",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  "{{α-OH|取代基}}",
                  "α-OH",
                  "OH"
                ],
                [
                  "Flumethasone",
                  "局部",
                  "✔",
                  "α-fluoro",
                  "α-fluoro",
                  "β-OH",
                  "α-CH₃",
                  "α-OH",
                  "OH"
                ],
                [
                  "Diflucortolone",
                  "局部",
                  "✔",
                  "α-fluoro",
                  "α-fluoro",
                  "β-OH",
                  "α-CH₃",
                  "H",
                  "OH"
                ],
                [
                  "Fluticasone",
                  "吸入／鼻內",
                  "✔",
                  "α-fluoro",
                  "α-fluoro",
                  "β-OH",
                  "α-CH₃",
                  "α-OH",
                  "{{SCH₂F|取代基}}"
                ],
                [
                  "Flucinolone",
                  "局部",
                  "✔",
                  "α-fluoro",
                  "α-fluoro",
                  "β-OH",
                  "α-OH",
                  "α-OH",
                  "OH"
                ],
                [
                  "Desonide",
                  "局部",
                  "✔",
                  "H",
                  "H",
                  "β-OH",
                  {
                    "t": "ketal（3C）",
                    "cs": 2
                  },
                  null,
                  "OH"
                ],
                [
                  "Budesonide",
                  "吸入／鼻內",
                  "✔",
                  "H",
                  "H",
                  "β-OH",
                  {
                    "t": "ketal（4C）",
                    "cs": 2
                  },
                  null,
                  "OH"
                ],
                [
                  "Amcinonide",
                  "局部",
                  "✔",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  {
                    "t": "ketal（5C）",
                    "cs": 2
                  },
                  null,
                  "乙酯基"
                ],
                [
                  "Halcinonide",
                  "局部",
                  "✘",
                  "H",
                  "α-fluoro",
                  "β-OH",
                  {
                    "t": "ketal（3C）",
                    "cs": 2
                  },
                  null,
                  "Cl"
                ],
                [
                  "Flunisolide",
                  "吸入／鼻內",
                  "✔",
                  "α-fluoro",
                  "H",
                  "β-OH",
                  {
                    "t": "ketal（3C）",
                    "cs": 2
                  },
                  null,
                  "OH"
                ],
                [
                  "Flurandrenolide",
                  "局部",
                  "✘",
                  "α-fluoro",
                  "H",
                  "β-OH",
                  {
                    "t": "ketal（3C）",
                    "cs": 2
                  },
                  null,
                  "OH"
                ],
                [
                  "Alclometasone（補充）",
                  "局部",
                  "✔",
                  "7α-chloro",
                  "H",
                  "β-OH",
                  "α-CH₃",
                  "α-OH",
                  "OH"
                ],
                [
                  "Prednicarbate（補充）",
                  "局部",
                  "✔",
                  "H",
                  "H",
                  "β-OH",
                  "H",
                  "OCOOC₂H₅",
                  "COOC₂H₅"
                ]
              ]
            },
            "points": [
              "藥名旁的符號表示使用途徑：◎ 全身性用藥、◇ 局部性用藥、■ 吸入／鼻內用藥"
            ]
          },
          {
            "title": "取代基總表分成四大類",
            "source": "統整（三）p.88",
            "points": [
              "※ 由上面的取代基總表，可大致將腎上腺皮質藥物分為四大類",
              "1. {{Hydrocortisone|藥名}} 類衍生物：Hydrocortisone、Cortisone、Fludrocortisone",
              "2. {{Prednisolone|藥名}} 類衍生物：Prednisolone、Prednisone、Methylprednisolone",
              "3. 含 9α-fluoro 取代基類衍生物：可再依 16 號位取代基的{{立體構型|名詞}}分為兩類",
              "(1) β 構型：Betamethasone、Beclomethasone、Clobetasol、Halobetasol",
              "(2) α 構型：可再依 6 號位有無取代基分為兩小類",
              "A. 6 號位沒有取代基：Dexamethasone、Mometasone、Desoximetasone、Triamcinolone",
              "B. 6 號位具有 α-fluoro：Flumethasone、Diflucortolone、Fluticasone、Flucinolone",
              "※ 例外：{{Fludrocortisone|藥名}} 含有 9α-fluoro 但 1,2 號位之間沒有雙鍵",
              "4. 含 {{ketal|結構}} 結構的 Desonide 衍生物：可再依 6 或 9 號位有無取代基分為三小類",
              "(1) 6、9 號位沒有取代基：Desonide、Budesonide",
              "(2) 6 號位具有 α-fluoro：Flunisolide、Flurandrenolide",
              "(3) 9 號位具有 α-fluoro：Amcinonide、Halcinonide",
              "5. 其他類（補充）：Alclometasone、Prednicarbate"
            ]
          },
          {
            "title": "特殊取代基之藥物",
            "source": "統整（三）p.88",
            "table": {
              "head": [
                "特殊取代基",
                "藥物"
              ],
              "rows": [
                [
                  "6 號位上有 α-CH₃",
                  "{{Methylprednisolone|藥名}}"
                ],
                [
                  "6 號位上有 α-fluoro",
                  "Halobetasol、Flumethasone、Diflucortolone、Fluticasone、Flucinolone"
                ],
                [
                  "9 號位上有 α-chloro",
                  "{{Beclomethasone|藥名}}、{{Mometasone|藥名}}"
                ],
                [
                  "11 號位為 =O",
                  "{{Cortisone|藥名}}、{{Prednisone|藥名}}（其餘 11 號位皆為 OH）"
                ],
                [
                  "16 號位為 α-OH",
                  "{{Triamcinolone|藥名}}、{{Flucinolone|藥名}}"
                ],
                [
                  "17 號位為 H",
                  "{{Desoximetasone|藥名}}、Diflucortolone（其餘 17 號位接 ketal 或 α-OH）"
                ],
                [
                  {
                    "t": "21 號位為 Cl★",
                    "b": true
                  },
                  "Clobetasol、Halobetasol、Mometasone、Halcinonide"
                ],
                [
                  "21 號位為 SCH₂F",
                  "{{Fluticasone|藥名}}"
                ],
                [
                  "21 號位為乙酯基",
                  "{{Amcinonide|藥名}}"
                ],
                [
                  {
                    "t": "結構中無鹵素原子★",
                    "b": true
                  },
                  "Hydrocortisone、Cortisone、Prednisolone、Prednisone、Methylprednisolone、Desonide、Budesonide"
                ],
                [
                  "結構中總共含 4 個 OH",
                  "Triamcinolone、Flucinolone"
                ]
              ]
            },
            "points": [
              "※ 特殊取代基之藥物"
            ]
          },
          {
            "title": "二分法結構判讀",
            "source": "統整（三）p.88",
            "points": [
              "【二分法結構判讀】",
              "1. 一看到類固醇結構，先看「1、2 號位間有沒有雙鍵？」",
              "→ 是：{{Hydrocortisone|藥名}} 類藥物；否：請繼續看第二點",
              "2. 「第 16、17 號位是否具有 Ketal 結構？」",
              "→ 是：{{Desonide|藥名}} 類藥物；否：請繼續看第三點",
              "3. 「第 9 號位是否具有取代基？」",
              "→ 否：{{Prednisolone|藥名}} 類藥物；是：Betamethasone/Dexamethasone 類藥物，細項分類請繼續看第四點",
              "4. 「第 16 號 CH₃ 之立體構型為何？」",
              "→ 16β-CH₃：{{Betamethasone|藥名}} 類衍生物；16α-CH₃：{{Dexamethasone|藥名}} 類衍生物，細項分類請繼續看第五點",
              "5. 「第 6 號位是否具有 6α-fluoro 取代基？」",
              "→ 是：Flu…one 類藥物；否：Dexamethasone、Mometasone、Desoximetasone、Triamcinolone"
            ]
          },
          {
            "title": "Glucorticoid 藥物之 SAR",
            "source": "統整（三）p.89",
            "images": [
              "assets/medchem/co-fig-sar.png"
            ],
            "table": {
              "head": [
                "增加抗發炎與 Mineralcorticoid 活性",
                "增加抗發炎活性",
                "減少 Mineralcorticoid 活性"
              ],
              "rows": [
                [
                  "17α-OH",
                  "1-dehydro",
                  "6α-CH₃"
                ],
                [
                  "9α-F",
                  "6α-F",
                  "16α/β-CH₃"
                ],
                [
                  "9α-Cl",
                  "11β-OH",
                  "16α/17α-acetonide"
                ],
                [
                  "21-OH",
                  "",
                  "16α-OH"
                ]
              ]
            },
            "points": [
              "※ Glucorticoid 藥物之 SAR（參考自阿摩）",
              "9α-F 會增加 11β-OH 的{{酸性|性質|鹼性}}並減少其氧化作用"
            ]
          },
          {
            "title": "腎上腺皮質素之藥理作用",
            "source": "統整（三）p.89",
            "table": {
              "head": [
                {
                  "t": "藥理作用比較",
                  "cs": 2
                },
                {
                  "t": "鹽類比較",
                  "cs": 2
                }
              ],
              "rows": [
                [
                  "留鈉效力最強",
                  "{{Fludrocortisone|藥名}}",
                  "Cypionate",
                  "脂溶性高，用於 IM"
                ],
                [
                  "唯一對胎兒無副作用",
                  "{{Prednisone|藥名}}",
                  "Sodium succinate",
                  "水溶性高，用於注射劑"
                ],
                [
                  "適合長期抗發炎",
                  "{{Prednisolone|藥名}}",
                  "Sodium phosphate",
                  "用於注射用水及緩衝液之滅菌溶液"
                ],
                [
                  "抗發炎活性最強",
                  "{{Dexamethasone|藥名}}",
                  "Valerate",
                  "外用製劑"
                ]
              ]
            },
            "points": [
              "※ 腎上腺皮質素之藥理作用",
              "1. 全身投與之副作用：增加{{糖質新生|副作用}}（高血糖）、骨質疏鬆、Na⁺/水滯留引起的水腫和高血壓、胃潰瘍、青光眼、低血鉀、精神疾病",
              "2. 使用類固醇藥物不可突然停藥，會有嚴重的戒斷症狀，造成急性{{腎上腺功能不足|疾病}}症候群",
              "3. 胎兒的 Cortisol 可促進{{肺部|器官}}結構成熟，增加表面張力素的生成和分泌，用於預防早產兒呼吸窘迫症候群。通常使用較能穿透胎盤的 {{Betamethasone|藥名}}、Beclomethasone 或 Dexamethasone",
              "4. 唯一對懷孕中的胎兒沒有影響的藥物是 {{Prednisone|藥名}}，因其為前驅藥，不會在胎兒肝臟轉為具活性的 Prednisolone",
              "5. 藥物比較",
              "※ 相關疾病",
              "1. {{Cushing syndrome|疾病}}：糖皮質類固醇含量過多",
              "2. {{Addison disease|疾病}}：缺乏糖皮質類固醇"
            ]
          }
        ]
      },
      {
        "id": "hc",
        "title": "一、Hydrocortisone 類衍生物",
        "items": [
          {
            "title": "Hydrocortisone 類：共同結構特色",
            "group": "Hydrocortisone 類衍生物",
            "source": "統整（三）p.90",
            "points": [
              "重要共同結構特色：1、2 號位間{{不存在|性質|存在}}雙鍵",
              "11 號位具有 hydroxy group（OH）：Hydrocortisone、Fludrocortisone",
              "11 號位具有 ketone group（=O）：Cortisone",
              "從名字可以判別 Fludrocortisone 具有 9α-fluoro group（dro 唸起來很像 9）"
            ]
          }
        ]
      },
      {
        "id": "pn",
        "title": "二、Prednisone 類衍生物",
        "items": [
          {
            "title": "Prednisone 類：共同結構特色",
            "group": "Prednisone 類衍生物",
            "source": "統整（三）p.90",
            "points": [
              "重要共同結構特色：1、2 號位間{{有|性質|沒有}}雙鍵、9 號位{{無取代|性質|有取代}}、結構中沒有鹵素原子",
              "11 號位具有 hydroxy group（OH）：Prednisolone、Methylprednisolone",
              "11 號位具有 ketone group（=O）：Prednisone",
              "從名字可以判別 Methylprednisolone 具有 6α-methyl group（p 上下顛倒就是 6，如果怕記反要記得本類藥物的 9 號位不會有取代基）",
              "※ Hydrocortisone↔Prednisolone、Cortisone↔Prednisone 之間只差一個雙鍵，結構非常類似。記憶：CP 是一對的，但是 P 有凸一根出來，所以多一個雙鍵"
            ]
          }
        ]
      },
      {
        "id": "f9",
        "title": "三、含 9α-fluoro 取代基類衍生物",
        "items": [
          {
            "title": "16 號 CH₃ 為 α 構型",
            "group": "16 號 CH₃ 為「α」構型（含 9α-fluoro 取代基）",
            "source": "統整（三）p.91",
            "points": [
              "16 號 CH₃ 為「α」構型：可再依 6 號位是否有取代基分成兩小類",
              "6 號位無取代基：Dexamethasone 類衍生物",
              "6 號位具有 α-fluoro 取代基：名字皆為 Flu…one（例外：{{Fludrocortisone|藥名}}）"
            ]
          },
          {
            "title": "Betamethasone 類：共同結構特色",
            "group": "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物",
            "source": "統整（三）p.91",
            "points": [
              "16 號 CH₃ 為「β」構型：Betamethasone 類衍生物，名字中皆含有 beta",
              "重要共同結構特色：16-CH₃ 為{{β 構型|結構|α 構型}}、具有 9α-fluoro 取代基",
              "21 號位為 OH：Betamethasone、Beclomethasone",
              "21 號位為 Cl：Clobetasol、Halobetasol",
              "Beclomethasone 為 9 號 Cl 取代、Clobetasol 為 21 號 Cl 取代，不要搞混了～（沒什麼好方法記，就請大家動一下腦袋瓜囉）"
            ]
          }
        ]
      },
      {
        "id": "ketal",
        "title": "四、含 Ketal 結構之藥物",
        "items": [
          {
            "title": "Ketal 類：依 6、9 號位分三類",
            "group": "Ketal：6、9 號位皆沒有取代基",
            "source": "統整（三）p.92",
            "points": [
              "含 {{Ketal|結構}} 結構之藥物：可再依 6、9 號位是否有取代基分成三類",
              "6、9 號位皆沒有取代基：Desonide、Budesonide",
              "6 號位具有 α-fluoro 取代基：Flunisolide、Flurandrenolide",
              "9 號位具有 α-fluoro 取代基：Amcinonide、Halcinonide"
            ]
          }
        ]
      }
    ]
  },
  ch39: {
    "chapter": 39,
    "title": "性荷爾蒙－雌激素相關藥物",
    "sections": [
      {
        "id": "intro",
        "title": "一、性荷爾蒙介紹",
        "items": [
          {
            "title": "相關結構碳數整理",
            "source": "統整（三）p.93",
            "table": {
              "head": [
                "結構",
                "碳數",
                "口訣"
              ],
              "rows": [
                [
                  "雌激素",
                  "18",
                  "十八姑娘一朵花"
                ],
                [
                  "雄激素",
                  "19",
                  "十九少年雄性發"
                ],
                [
                  "黃體素",
                  "21",
                  "黃色書刊一把抓"
                ],
                [
                  "膽固醇",
                  "27",
                  "固定伴侶氣到炸"
                ]
              ]
            },
            "points": [
              "※ 相關結構碳數整理",
              "雌激素 {{18|數值}}、雄激素 {{19|數值}}、黃體素 {{21|數值}}、膽固醇 {{27|數值}} 個碳"
            ]
          },
          {
            "title": "性荷爾蒙生合成途徑",
            "source": "統整（三）p.93",
            "images": [
              "assets/medchem/es-fig-bio.png"
            ],
            "points": [
              "Cholesterol 經 P450scc（Sidechain cleavage）形成 {{Pregnenolone|物質}}",
              "Pregnenolone → 3β-HSD → {{Progesterone|物質}}（progestin）；Progesterone → 21-hydroxylase、Aldosterone synthase → Aldosterone（mineralocorticoid）",
              "Pregnenolone → 17α-hydroxylase → 17α-Hydroxypregnenolone → 3β-HSD、21-hydroxylase、11β-hydroxylase → Hydrocortisone（cortisol，glucocorticoid）",
              "17α-Hydroxypregnenolone → 17,20-lyase → {{DHEA|物質}}（Dehydroepiandrosterone）→ 3β-HSD → Androstenedione",
              "Androstenedione → Aromatase → {{Estrone|物質}}（estrogen）；Androstenedione → 17β-HSD → {{Testosterone|物質}}（androgen）",
              "Testosterone → Aromatase → {{Estradiol|物質}}（estrogen）；Testosterone → 5α-reductase → 5α-Dihydrotestosterone（androgen）",
              "※ 3β-HSD：3β-hydroxysteroid dehydrogenase = Δ⁵⁻⁴-isomerase"
            ]
          }
        ]
      },
      {
        "id": "agonist",
        "title": "二、雌性激素作用劑（Estrogen Agonists）",
        "items": [
          {
            "title": "Human Estrogens：口服與活性順序",
            "group": "Human Estrogens（人體雌激素及其衍生物）",
            "source": "統整（三）p.94",
            "points": [
              "可以口服之化合物？選擇 {{17α|結構}} 和 16 號位上有取代者",
              "皮下注射之活性順序：{{Estradiol|藥名}} > Estrone > Estriol",
              "口服使用之活性順序：{{Ethinyl Estradiol|藥名}} > Estriol > Estradiol > Estrone",
              "若形成酯類衍生物，可延長作用時間（Estradiol 可在 3 或 17β 位上酯化，增加脂溶性）"
            ]
          }
        ]
      },
      {
        "id": "antagonist",
        "title": "三、雌性激素拮抗劑（Estrogen Antagonists）",
        "items": [
          {
            "title": "Aromatase Inhibitors：雜環結構之抑制劑代謝",
            "group": "雜環結構之抑制劑",
            "source": "統整（三）p.97",
            "points": [
              "代謝路徑：經由 {{CYP3A4|酵素}} 和 {{CYP2A6|酵素}} 緩慢代謝成{{無活性|性質|有活性}}代謝物 {{Carbinol|代謝物}}"
            ]
          }
        ]
      },
      {
        "id": "prog",
        "title": "四、黃體激素作用劑（Progesterone Agonists）",
        "items": []
      },
      {
        "id": "pant",
        "title": "五、黃體激素拮抗劑（Progesterone Antagonists）",
        "items": []
      }
    ]
  },
  ch40: {
    "chapter": 40,
    "title": "性荷爾蒙－雄激素相關藥物",
    "sections": [
      {
        "id": "andro",
        "title": "一、雄性激素",
        "items": [
          {
            "title": "人工合成雄性激素：C₁₇α-alkyl testosterone",
            "group": "C₁₇α-alkyl testosterone：C₁₇ 加一個甲基，可以口服",
            "source": "統整（三）p.100",
            "points": [
              "C₁₇α-alkyl testosterone：C₁₇ 加一個{{甲基|取代基}}，可以{{口服|給藥途徑|注射}}"
            ]
          },
          {
            "title": "人工合成雄性激素：C₁₉-norandrogens",
            "group": "C₁₉-norandrogens（C₁₀ 上沒有接甲基）",
            "source": "統整（三）p.100",
            "points": [
              "C₁₉-norandrogens（C₁₀ 上沒有接{{甲基|取代基}}）"
            ]
          }
        ]
      },
      {
        "id": "gi",
        "title": "二、促性腺激素抑制劑（Gonadotropin inhibitors）",
        "items": []
      },
      {
        "id": "anti",
        "title": "三、雄性激素受體拮抗劑（Antiandrogens）",
        "items": [
          {
            "title": "非類固醇類 antiandrogens：3-trifluoromethyl-4-nitroaniline",
            "group": "非類固醇類似物：由 3-trifluoromethyl-4-nitroaniline 衍生而來",
            "source": "統整（三）p.102",
            "images": [
              "assets/medchem/an-fig-aniline.png"
            ],
            "points": [
              "※ 3-trifluoromethyl-4-nitroaniline：具有抗雄性激素活性"
            ]
          }
        ]
      },
      {
        "id": "syn",
        "title": "四、雄性激素合成抑制劑",
        "items": []
      }
    ]
  },
  ch41: {
    "chapter": 41,
    "title": "腦下垂體激素",
    "sections": [
      {
        "id": "adh",
        "title": "一、ADH（抗利尿激素）",
        "items": [
          {
            "title": "ADH 簡介與相關藥物",
            "source": "統整（三）p.104",
            "points": [
              "1. 由腦垂腺{{後葉|器官|前葉}}分泌，具有血管收縮以及抗利尿的作用",
              "2. ADH 相關藥物",
              "(1) 作用劑（字尾 -pressin）：Terlipressin（V₁）、Desmopressin（V₂）、Vasopressin（V₁ 和 V₂）",
              "(2) 拮抗劑（字尾 -vaptan）：Conivaptan、Tanivaptan 為 V₂ receptor antagonist，可干擾 aquaporin channel、抑制水分再吸收（利尿）；治療 SIADH 與高容積低血鈉症"
            ]
          },
          {
            "title": "尿崩症（Diabetes Insipidus）之藥物治療整理",
            "source": "統整（三）p.104",
            "table": {
              "head": [
                "尿崩症分類",
                "病因",
                "藥物治療"
              ],
              "rows": [
                [
                  {
                    "t": "中樞性尿崩症",
                    "b": true
                  },
                  "ADH 分泌不足",
                  "{{Desmopressin|藥名}}"
                ],
                [
                  {
                    "t": "腎因性尿崩症",
                    "b": true
                  },
                  "腎臟對 ADH 之感受不佳",
                  "{{Thiazide Diuretics|藥物類別}}"
                ],
                [
                  {
                    "t": "鋰鹽導致的尿崩症",
                    "b": true
                  },
                  "造成腎小管之損傷",
                  "{{Amiloride|藥名}}（保鉀型利尿劑）"
                ]
              ]
            },
            "points": [
              "3. 相關疾病治療：(1) 尿崩症（Diabetes Insipidus）之藥物治療整理",
              "※ 兒童之腎因性尿崩症多因 {{AVPR-2|標的}} 基因缺陷導致 V₂ receptor 異常所引起",
              "※ 腎臟中的 {{Aquaporin-2|標的}}（水孔蛋白）負責針對 ADH 之水分再吸收"
            ]
          },
          {
            "title": "SIADH（抗利尿激素不適當分泌症候群）",
            "source": "統整（三）p.104",
            "points": [
              "(2) SIADH（抗利尿激素不適當分泌症候群）",
              "A. 成因：惡性疾病或中樞系統疾病等，使 ADH 不適當分泌而造成水分滯留或{{低血鈉症|疾病}}",
              "B. 選擇性藥物治療：V₂ receptor antagonist（Conivaptan、Tanivaptan）",
              "C. 非選擇性藥物治療：ADH antagonist（{{Demeclocycline|藥名}}）、{{Lithium|藥名}}"
            ]
          }
        ]
      },
      {
        "id": "somato",
        "title": "二、Somatostatin（體抑素）",
        "items": []
      },
      {
        "id": "gnrh",
        "title": "三、Gonadotropin-releasing hormone（GnRH／促性腺激素釋放素）",
        "items": [
          {
            "title": "GnRH 簡介與衍生藥物",
            "group": "GnRH super agonist（GnRH 的合成類似物）",
            "source": "統整（三）p.105",
            "points": [
              "1. 由 {{10|數值}} 個胺基酸片段組成，可刺激 {{LH|物質}}、FSH 分泌",
              "2. 大量給予 GnRH analog 最終會造成{{負回饋|機轉}}之結果，可治療攝護腺癌、子宮內膜異位、多發性卵巢癌、乳癌等",
              "3. 衍生藥物：(1) GnRH super agonist：Leuprolide、Nafarelin、Goserelin、Histrelin（GnRH 的合成類似物）；(2) GnRH receptor antagonist：Abarelix、Cetrorelix",
              "4. 藥物多在第 6 位和第 10 位（C 端）進行結構修飾：Leuprolide 與 Histrelin★皆以 NH-Ethyl group 置換 C-terminal Glycine¹⁰-NH₂"
            ]
          }
        ]
      },
      {
        "id": "gh",
        "title": "四、Growing hormone（GH／生長激素）",
        "items": []
      },
      {
        "id": "prl",
        "title": "五、Prolactin（泌乳激素）",
        "items": [
          {
            "title": "Prolactin：分泌與高泌乳素血症",
            "group": "Prolactin（泌乳激素）：高泌乳素血症治療藥物",
            "source": "統整（三）p.106",
            "points": [
              "1. 由腦下垂體{{前葉|器官|後葉}}分泌，可被 {{Dopamine|物質}} 抑制、被 TRH（促甲狀腺釋放素）促進",
              "2. 造成高泌乳素的藥物：抗憂鬱藥、{{Estrogen|藥名}}、Dopamine antagonist、{{Methyldopa|藥名}}",
              "3. 治療高泌乳素血症的藥物（抑制乳汁分泌）：Bromocriptine、Pergoline、Cabergoline、Quinagoline"
            ]
          }
        ]
      },
      {
        "id": "oxy",
        "title": "六、Oxytocin（催產素）",
        "items": []
      },
      {
        "id": "hcg",
        "title": "七、Human chorionic gonadotropin（HCG／人類絨毛生殖腺激素）",
        "items": []
      },
      {
        "id": "trh",
        "title": "八、TRH（促甲狀腺素釋放素）",
        "items": [
          {
            "title": "TRH",
            "source": "統整（三）p.106",
            "points": [
              "TRH（促甲狀腺素釋放素）：詳見下一章"
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
