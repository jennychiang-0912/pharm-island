/* PHARMA ISLAND：生藥科目
   這個檔案只在 pharmacognosy.html 載入，會把藥理的章節、單元、知識樹換成生藥的。
   格式和藥理一樣（見 js/data.js、js/units.js、js/knowledge.js 的說明）；版面參考藥理藥化平安符頁。
   內容只取自講義「生物鹼」（123_1.pdf）的印刷字；手寫、螢光筆、劃線都不算（劃線劃掉的印刷字照樣收錄）。
   講義上的拼字錯誤已改成正確寫法（見下面 PI.UNITS 的說明）。 */
window.PI = window.PI || {};

PI.STORAGE_KEY = "pharma-island-pharmacognosy-v1";   // 進度和其他科目分開存

PI.CATEGORIES = [
  { id: "pharmacognosy", name: "生藥學", color: "#A39A5C", tint: "#ECE8CF" }
];

/* 地圖：小分類（Pyridine-Piperidine、Tropane…）畫交界線和好萊塢式名牌（js/map.js 的 drawGroups） */
PI.GROUP_REGIONS = true;

/* 生藥的欄位（取代藥理的「機轉、抗菌範圍…」）：照講義表格的欄位 */
PI.UNIT_FIELDS = [
  ["names", "名稱"], ["origin", "基源"], ["family", "科別"], ["part", "部位"],
  ["constituents", "成分"], ["uses", "用途"], ["notes", "其他重點"]
];
/* 資訊卡：中文名放在標題旁邊；基源、科別、部位合成一框「來源」；成分、用途各一框 */
PI.UNIT_TITLE_FIELD = "names";
PI.UNIT_BOXES = [
  { label: "來源", fields: ["origin", "family", "part"] },
  { label: "成分", fields: ["constituents"] },
  { label: "用途", fields: ["uses"] },
  { label: "其他重點", fields: ["notes"] }
];
PI.UNIT_TYPES = { drug: "生藥", preparation: "製劑", category: "分類", topic: "主題" };

/* 章節：之後拿到課程章節再改名、往後加（加章節時記得在下面的 PI.LANDMASSES 把章節編號放進同一座島） */
PI.CHAPTERS = [
  { id: 1, name: "生物鹼", cat: "pharmacognosy", estimate: 56, unitType: "drug", note: "講義：生物鹼（p.1–5、續篇）。依講義的印刷字，手寫和螢光筆沒有放進來。" }
];

/* 一座島 */
PI.LANDMASSES = [
  { id: "pharmacognosy", name: "生藥島", chapters: [1],
    palette: { ground: "#CFC594", light: "#DFD8B0", cliff: "#A89D68" } }
];

/* 學習單元：一個生藥一格，欄位見上面的 PI.UNIT_FIELDS。
   內容只照講義印刷字，手寫筆記、螢光筆、畫線都沒有放。講義上的拼字錯誤已改成正確寫法（例：Nicotinc → Nicotinic、Scopolica → Scopolia）。
   generation 欄位拿來放講義上的星號（★／★★）。 */
const SRC = "生物鹼講義";
const SRC2 = "生物鹼講義（續）";
PI.UNITS = [
  /* ===== Pyridine-Piperidine Alkaloid（講義 p.2）===== */
  { id: "lobelia", chapter: 1, name: "Lobelia", type: "drug", group: "Pyridine-Piperidine", generation: "講義標示 ★★", source: SRC + " p.2",
    names: ["中文：{{北美山梗菜|生藥中文名}}", "英文：Indian tobacco／祛痰菜"],
    origin: ["{{Lobelia inflata|學名}}", "{{L. sessilifolia|學名}}、L. chinensis"],
    family: ["{{山梗菜科|科別}}"], part: ["{{乾燥葉及枝端|部位}}"],
    constituents: ["{{(-)-Lobeline|成分}}：{{piperidine|結構}} 衍生物"],
    uses: ["{{祛痰劑|用途}}；治療氣管與慢性支氣管炎", "具有★{{催吐 Emetic|作用}}及呼吸興奮作用", "做為{{戒菸劑|用途}}，類似 nicotine，但效果較弱"] },
  { id: "areca", chapter: 1, name: "Areca", type: "drug", group: "Pyridine-Piperidine", generation: "講義標示 ★", source: SRC + " p.2",
    names: ["中文：{{檳榔|生藥中文名}}", "英文：Areca nut／Betel nut"],
    origin: ["{{Areca catechu|學名}}"], family: ["{{棕櫚科|科別}}（檳榔科）"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["{{Arecoline|成分}}（液態）：{{Reduced pyridine|結構}} 衍生物", "{{Tannin|成分}}（15%）：可能致{{口腔癌|疾病}}"],
    uses: ["{{獸醫驅蟲|用途}}，殺蟎蟲藥、驅條蟲藥"] },
  { id: "nicotiana", chapter: 1, name: "Nicotiana", type: "drug", group: "Pyridine-Piperidine", generation: "講義標示 ★★", source: SRC + " p.2",
    names: ["中文：{{菸葉|生藥中文名}}", "英文：Tobacco leaves"],
    origin: ["{{Nicotiana tabacum|學名}}"], family: ["{{茄科|科別}}，煙草"], part: ["{{乾燥葉|部位}}"],
    constituents: ["{{Nicotine|成分}}（[★國考]液態）：{{pyridine-pyrrolidine|結構}} 型"],
    uses: ["Nicotine 為{{神經節膽鹼受體作用劑|作用}}，增加自主神經、腎上腺髓質、神經肌肉連結處、大腦等活性", "農業{{殺蟲劑|用途}}",
      "Nicotine 穿皮或咀嚼製劑，用於{{戒菸|用途}}", "長期使用 Nicotine 會導致{{依賴性|副作用}}"],
    notes: ["殺蟲（Insecticides）：成分 {{Nicotine sulfate|成分}}；用途：神經節膽鹼性受器作用劑、局部刺激劑、Paralyzing effect"] },
  { id: "conium", chapter: 1, name: "Conium", type: "drug", group: "Pyridine-Piperidine", source: SRC + " p.2",
    names: ["中文：{{毒芹子|生藥中文名}}", "英文：Poison Hemlock"],
    origin: ["{{Conium maculatum|學名}}"], family: ["{{繖形科|科別}}"], part: ["{{充份成長但未成熟的乾燥果實|部位}}"],
    constituents: ["{{Coniine|成分}}：{{毒性揮發性液體|性質}}"],
    uses: ["治療{{痙攣性|疾病}}、癲癇性疾病；{{運動神經末梢阻斷劑|作用}}"] },
  { id: "granatum", chapter: 1, name: "Granatum", type: "drug", group: "Pyridine-Piperidine", source: SRC + " p.2",
    names: ["中文：{{石榴皮|生藥中文名}}", "英文：Pomegranate／安石榴"],
    origin: ["{{Punica granatum|學名}}"], family: ["{{石榴科|科別}}"], part: ["{{根或莖的皮部|部位}}"],
    constituents: ["{{Pelletierine|成分}}：{{piperidine|結構}} 衍生物，揮發性液體"],
    uses: ["{{驅蟲劑|用途}}、驅條蟲劑", "具鞣質 {{28%|數值}}，為{{收斂劑|用途}}，治療腹瀉"] },
  { id: "pepper", chapter: 1, name: "Pepper", type: "drug", group: "Pyridine-Piperidine", source: SRC + " p.2",
    names: ["中文：{{胡椒果|生藥中文名}}"],
    origin: ["{{Piper nigrum|學名}}", "黑胡椒、白胡椒同源"], family: ["{{胡椒科|科別}}"],
    part: ["{{未成熟核果|部位}}（白胡椒為成熟果實，石灰水浸漬後曬乾）"],
    constituents: ["{{Piperine|成分}}：具{{辛辣味|性質}}"],
    uses: ["{{調味劑|用途}}、刺激劑、健胃劑、興奮劑"] },

  /* ===== Tropane alkaloid（講義 p.3）===== */
  { id: "belladonna", chapter: 1, name: "Belladonna", type: "drug", group: "Tropane", generation: "講義標示 ★★", source: SRC + " p.3",
    names: ["中文：{{顛茄|生藥中文名}}", "英文：Deadly nightshade leaf"],
    origin: ["{{Atropa belladonna|學名}}", "{{A. acuminata|學名}}"], family: ["{{茄科|科別}}"], part: ["{{乾燥葉、根、花、果頂|部位}}"],
    constituents: ["葉：(3/4) {{(-)-Hyoscyamine|成分}}、(1/4) Atropine", "根：(-)-Hyoscyamine、Atropine、{{Scopolamine|成分}}", "{{Atropine|成分}} = (±)-Hyoscyamine"],
    uses: ["{{抗膽鹼|作用}}：散瞳、解痙、止痛、手術前抗黏液", "有機磷或毒扁豆鹼的{{解毒劑|用途}}", "顛茄生物鹼治{{消化性潰瘍|疾病}}"] },
  { id: "hyoscyamus", chapter: 1, name: "Hyoscyamus", type: "drug", group: "Tropane", generation: "講義標示 ★", source: SRC + " p.3",
    names: ["中文：{{東莨菪葉|生藥中文名}}", "英文：Henbane／菲沃斯葉"],
    origin: ["{{Hyoscyamus niger|學名}}"], family: ["{{茄科|科別}}"], part: ["{{乾燥葉|部位}}"],
    constituents: ["(-)-Hyoscyamine", "Scopolamine（{{Hyoscine|成分}}）"],
    uses: ["{{副交感神經抑制劑|作用}}：鎮痛解痙劑、CNS Depressant、止吐止暈（{{動暈症|疾病}}）"] },
  { id: "datura", chapter: 1, name: "Jimson weed", type: "drug", group: "Tropane", generation: "講義標示 ★", source: SRC + " p.3",
    names: ["中文：{{曼陀羅葉|生藥中文名}}", "英文：Thornapple／James-town weed"],
    origin: ["{{Datura stramonium|學名}}"], family: ["{{茄科|科別}}"], part: ["{{乾燥葉、枝端|部位}}"],
    constituents: ["(-)-Hyoscyamine：主要，毒", "(-)-Scopolamine：含有 {{Epoxide|結構}}"],
    uses: ["副交感神經抑制劑：鎮痛解痙劑", "稱為 {{Asthma powder|名詞}}", "當做調味（{{Pot herb|名詞}}），會致死"] },
  { id: "coca", chapter: 1, name: "Coca", type: "drug", group: "Tropane", generation: "講義標示 ★★", source: SRC + " p.3",
    names: ["中文：{{古柯（葉）|生藥中文名}}", "英文：Coca leaves"],
    origin: ["{{Erythroxylum coca|學名}}", "{{E. truxillense|學名}}"],
    family: ["{{古柯樹科|科別}} → 主產地{{南美|產地}}（玻利維亞、秘魯）", "＜唯一非茄科＞"], part: ["{{乾燥葉|部位}}"],
    constituents: ["{{Ecgonine|結構}} 衍生物：{{Cocaine|成分}}、Cinnamylcocaine、α-與β-Truxilline", "Cocaine 水解得{{苯甲酸|物質}}、甲醇、(-)-Ecgonine"],
    uses: ["生藥為{{二級管制品|性質}}，被稱為{{印加神樹|名詞}}", "Cocaine（又稱快克）：{{局部麻醉劑|用途}}，具{{成癮性|副作用}}"] },
  { id: "scopolia", chapter: 1, name: "Scopolia", type: "drug", group: "Tropane", source: SRC + " p.3",
    names: ["中文：{{東莨菪根|生藥中文名}}"],
    origin: ["{{Scopolia japonica|學名}}"], family: ["{{茄科|科別}}"], part: ["{{根莖及根|部位}}"],
    constituents: ["Hyoscyamine、Atropine、Scopolamine"], uses: ["副交感神經抑制劑"] },
  { id: "mandragora", chapter: 1, name: "Mandragora", type: "drug", group: "Tropane", source: SRC + " p.3",
    names: ["中文：{{毆傷牛根草|生藥中文名}}", "英文：曼德拉／mandrake"],
    origin: ["{{Mandragora officinarum|學名}}"], family: ["{{茄科|科別}}"], part: ["{{乾燥根|部位}}"],
    constituents: ["Hyoscyamine、Scopolamine、{{Mandragorin|成分}}"], uses: ["副交感神經抑制劑"] },

  /* ===== Quinoline alkaloid（講義 p.4）===== */
  { id: "cinchona", chapter: 1, name: "Cinchona", type: "drug", group: "Quinoline", generation: "講義標示 ★★", source: SRC + " p.4",
    names: ["中文：{{金雞納皮|生藥中文名}}", "英文：Peruvian bark／規那皮"],
    origin: ["{{Cinchona succirubra|學名}} 紅色", "{{C. ledgeriana|學名}} 列氏", "{{C. calisaya|學名}} 黃色"],
    family: ["{{茜草科|科別}} → 印尼多"], part: ["{{根及莖之皮部|部位}}"],
    constituents: ["Quinine 與 Quinidine 為{{非鏡像異構物|性質}}",
      "{{Quinine sulfate|成分}}（主要存在於{{黃色金雞納皮|來源|紅色金雞納皮/銅色金雞納皮/喜樹}}）：{{抗瘧藥|用途}}、解熱鎮痛",
      "{{Quinidine sulfate|成分}}：{{抗心律不整|用途}}",
      "Cinchonine 與 Cinchonidine 互為{{異構物|性質}}",
      "{{Cinchonidine|成分}}（主要存在於{{紅色金雞納皮|來源|黃色金雞納皮/銅色金雞納皮/喜樹}}）",
      "服用過多金雞納皮的中毒症狀：耳鳴、視力受損 → {{Cinchonism|疾病}}",
      "金雞納具有{{類箭毒|作用}}的作用，會加重{{重症肌無力|疾病}}"] },
  { id: "cuprea", chapter: 1, name: "Cuprea bark", short: "Cuprea", type: "drug", group: "Quinoline", source: SRC + " p.4",
    names: ["中文：{{銅色金雞納皮|生藥中文名}}"],
    origin: ["{{Remijia purdieana|學名}}", "{{R. pedunculata|學名}}"], family: ["{{茜草科|科別}}"], part: ["{{樹皮|部位}}"],
    constituents: ["Quinine", "{{Cupreine|成分}}"], uses: ["銅色金雞納皮為 {{Quinidine|成分}} 商業上主要來源"] },
  { id: "camptotheca", chapter: 1, name: "Camptotheca", type: "drug", group: "Quinoline", source: SRC + " p.4",
    names: ["中文：{{喜樹|生藥中文名}}"],
    origin: ["{{Camptotheca acuminata|學名}}"], family: ["{{Nyssaceae|科別}}"], part: ["{{樹皮、木材、果實|部位}}"],
    constituents: ["{{Camptothecin|成分}} 喜樹鹼"], uses: ["{{抗腫瘤藥|用途}}", "{{Topotecan|藥名}} 及 Irinotecan 原料"] },

  /* ===== Isoquinoline Alkaloid（講義 p.4）===== */
  { id: "ipecac", chapter: 1, name: "Ipecac", type: "drug", group: "Isoquinoline", source: SRC + " p.4",
    names: ["中文：{{吐根|生藥中文名}}"],
    origin: ["{{Cephaelis ipecacuanha|學名}}", "Cephaelis acuminata"], family: ["{{茜草科|科別}}（Rubiaceae）"], part: ["{{乾燥根莖、根|部位}}"],
    constituents: ["★{{Cephaeline|成分}}、Emetine（{{甲基化|反應}}的 Cephaeline）"],
    uses: ["{{Ipecac syrup|製劑}}：{{催吐|作用}}", "{{Dover's powder|製劑}}（Ipecac + Opium）：{{發汗|作用}}", "{{Emetine hydrochloride|成分}}：治{{阿米巴痢疾|疾病}}、齒槽膿溢"] },
  { id: "hydrastis", chapter: 1, name: "Hydrastis", type: "drug", group: "Isoquinoline", source: SRC + " p.4",
    names: ["中文：{{北美黃連|生藥中文名}}", "英文：Goldenseal"],
    origin: ["{{Hydrastis canadensis|學名}}"], family: ["{{毛茛科|科別}}（Ranunculaceae）"], part: ["{{乾燥根莖、根|部位}}"],
    constituents: ["{{Hydrastine|成分}}（最主要）、Berberine、Canadine"],
    uses: ["作為黏膜發炎的{{收斂劑|用途}}"],
    notes: ["Hydrastine 含有 {{Phthalideisoquinoline|結構}}（γ-lactone ring）結構", "Berberine 含有{{四級胺|結構}}的結構，易溶於水",
      "★三種含有四級胺的生物鹼：{{Berberine|成分}}、Sanguinarine、Tubocurarine"] },
  /* ===== Isoquinoline Alkaloid（講義 p.5）===== */
  { id: "sanguinaria", chapter: 1, name: "Sanguinaria", type: "drug", group: "Isoquinoline", source: SRC + " p.5",
    names: ["中文：{{血根|生藥中文名}}", "別名：bloodroot"],
    origin: ["{{Sanguinaria canadensis|學名}}"], family: ["{{罌粟科|科別}}（Papaveraceae）"], part: ["{{乾燥根莖|部位}}"],
    constituents: ["{{Sanguinarine|成分}}（{{四級胺|結構}}，含有★{{Benzophenanthridine|結構}} 結構）、Chelerythrine、Protopine、Allocryptopine"],
    uses: ["{{祛痰|用途}}、催吐", "作為{{牙膏及漱口水|用途}}，可預防牙菌斑及牙周病"],
    notes: ["Sanguinarine + 硝酸或硫酸 → {{淡紅色鹽類|顏色}}", "Sanguinarine + Chelerythrine → {{淡黃色鹽類|顏色}}"] },
  { id: "tubocurarine", chapter: 1, name: "Tubocurarine chloride", short: "Tubocurarine", type: "drug", group: "Isoquinoline", source: SRC + " p.5",
    names: ["中文：{{箭毒|生藥中文名}}", "別名：Curare、South American arrow poison"],
    origin: ["馬錢子科（Loganiaceae）：{{Strychnos castelnaei|學名}}、S. toxifera、S. crevauxii", "防己科（Menispermaceae）：{{Chondodendron tomentosum|學名}}"],
    family: ["{{馬錢子科|科別}}（Loganiaceae）", "{{防己科|科別}}（Menispermaceae）"], part: ["{{樹皮根莖的乾燥萃取物|部位}}"],
    constituents: ["{{(+)-Tubocurarine|成分}}（四級胺化合物，含★{{bis-benzylisoquinoline|結構}}）", "{{兔子垂頭試驗|名詞}}：分析 Tubocurarine 的效價"],
    uses: ["{{骨骼肌鬆弛劑|用途}}", "診斷{{重症肌無力|疾病}}"] },
  { id: "opium", chapter: 1, name: "Opium", type: "drug", group: "Isoquinoline", generation: "講義標示 ★★★", source: SRC + " p.5",
    names: ["中文：{{鴉片|生藥中文名}}", "別名：Gum opium"],
    origin: ["{{Papaver somniferum|學名}} Linne", "睡夢之神之稱的藥用植物"], family: ["{{罌粟科|科別}}（Papaveraceae）"],
    part: ["★★{{未成熟|性質}}的罌粟蒴果割開後滲出的{{白色乳汁|部位}}"],
    constituents: ["★{{Morphine|成分}}（止痛以 {{C-13|結構}} 為中心）", "★{{Codeine|成分}}（{{止咳|用途}}、麻醉、止痛）", "★{{Meconic acid|成分}}",
      "Noscapine、{{Papaverine|成分}}（{{平滑肌放鬆|作用}}）、Thebaine"],
    uses: ["先興奮後抑制中樞神經", "★止痛、安眠、麻醉", "★{{止瀉劑|用途}}", "★{{縮瞳劑|用途}}", "{{Dover's powder|製劑}}"],
    notes: ["Meconic acid 僅存於天然的鴉片中，加入{{氯化鐵|物質}}（FeCl₃）後溶液成{{紅色|顏色}}，可用來鑑定鴉片的真偽",
      "{{Paregoric|製劑}}（Camphorated opium tincture 複方鴉片樟腦酊）、{{Laudanum|製劑}}（Opium tincture 鴉片酊）可作為{{止瀉劑|用途}}"] },

  /* ===== 講義第二份（13.pdf）：只用印刷字；表格欄位照講義（生藥｜基源｜科別｜部位｜成分｜用途），表格下方合併的說明列放在「其他重點」 ===== */
  /* ===== Indole Alkaloid（p.7）===== */
  { id: "catharanthus", chapter: 1, name: "Catharanthus", type: "drug", group: "Indole", source: SRC2 + " p.7",
    names: ["中文：{{長春花|生藥中文名}}、日日春", "別名：Vinca"],
    origin: ["{{Catharanthus roseus|學名}}"], family: ["★{{Apocynaceae|科別}} 夾竹桃科"], part: ["★{{全草|部位}}"],
    constituents: ["{{Vinblastine|成分}}（-NCH₃，★{{N-Methyl|結構}}）", "{{Vincristine|成分}}（-NCHO，★{{N-Formyl|結構}}）"],
    uses: ["可治療 {{Hodgkin's disease|疾病}}、Lymphocytic leukemia 等癌症"],
    notes: ["具有抗腫瘤活性是因為★{{Bisindole|結構}} 結構，且含有★{{4 個 N|數值}}", "常製成★{{硫酸鹽|性質}}",
      "半合成其他抗癌藥物衍生物的最大意義：★治療不同癌症且{{無交互抗藥性|性質}}", "[★國考]可用於治療 {{Acute Lymphocytic leukemia|疾病}}：Vincristine"] },
  { id: "rauwolfia", chapter: 1, name: "Rauwolfia", type: "drug", group: "Indole", source: SRC2 + " p.7",
    names: ["中文：{{印度蛇木|生藥中文名}}、蛇根、蘿芙木"],
    origin: ["{{Rauwolfia serpentina|學名}}", "產地：★{{印度|產地}}"], family: ["★★{{Apocynaceae|科別}} 夾竹桃科"], part: ["{{根莖及根|部位}}"],
    constituents: ["{{Reserpine|成分}}（coryanthe）、Rescinnamine、Deserpidine"],
    uses: ["{{鎮靜|用途}}", "{{降血壓|用途}}、治療高血壓"],
    notes: ["Reserpine → Reserpic acid、Methanol、3,4,5-Trimethoxy{{benzoic acid|物質}}", "Rescinnamine → Reserpic acid、Methanol、3,4,5-Trimethoxy{{cinnamic acid|物質}}",
      "[★國考]{{紅河蛇根|生藥中文名}}（serpentary）- {{馬兜鈴科|科別}}"] },
  { id: "yohimbe", chapter: 1, name: "Yohimbe", type: "drug", group: "Indole", source: SRC2 + " p.7",
    names: ["中文：{{育亨賓|生藥中文名}}"],
    origin: ["{{Pausinystalia yohimbe|學名}}", "產地：★{{西非|產地}}"], family: ["{{Rubiaceae|科別}} 茜草科"], part: ["{{樹皮|部位}}"],
    constituents: ["{{Yohimbine|成分}}"],
    uses: ["減少{{交感神經|作用}}活性", "★{{天然威爾鋼|名詞}}：促進副交感神經，治療 {{impotence|疾病}}"] },
  { id: "physostigma", chapter: 1, name: "Physostigma", type: "drug", group: "Indole", source: SRC2 + " p.7",
    names: ["中文：{{毒扁豆|生藥中文名}}、[★國考]{{神判豆|生藥中文名}}", "英文：(Ordeal / Calabar) bean"],
    origin: ["{{Physostigma venenosum|學名}}"], family: ["{{Fabaceae|科別}}（Leguminosae）豆科"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["{{Physostigmine|成分}}（{{Eserine|成分}}）"],
    uses: ["可逆性抑制{{乙醯膽鹼酯酶|作用}}：縮瞳、降眼壓、治療{{青光眼|疾病}}", "{{Atropine|成分}} 拮抗劑"],
    notes: ["暴露於熱、光、空氣、微量金屬，Eserine 會水解成 {{Eseroline|成分}} 再氧化成★{{紅色|顏色}}的 Rubreserine"] },
  { id: "nux-vomica", chapter: 1, name: "Nux vomica", type: "drug", group: "Indole", source: SRC2 + " p.7、p.13",
    names: ["中文：{{馬錢子|生藥中文名}}、番木鼈"],
    origin: ["{{Strychnos nux-vomica|學名}}"], family: ["★{{Loganiaceae|科別}} 馬錢科"], part: ["{{乾燥成熟種子|部位}}（殺鼠表：★乾燥盤狀種子）"],
    constituents: ["{{Strychnine|成分}}", "{{Brucine|成分}}（{{dimethoxystrychnine|結構}}）"],
    uses: ["Strychnine：{{中樞興奮|作用}}（阻斷突觸後抑制性衝動）→ {{Tonic convulsion|副作用}}", "Strychnine 為{{劇毒藥|性質}}，可當殺蟲劑",
      "Brucine：★{{毒性較小|性質}}，極苦", "Brucine：商業上作★{{酒精變性劑|用途}}"],
    notes: ["殺鼠（Rodenticide）：★Strychnine → {{毒性較強|性質}}；滅野生哺乳類（ex：野狗、狐狸、囓齒動物）"] },
  { id: "ergot", chapter: 1, name: "Ergot", type: "drug", group: "Indole", source: SRC2,
    names: ["中文：{{麥角|生藥中文名}}"],
    origin: ["寄生於黑麥之 {{Claviceps purpurea|學名}}"], family: ["{{Clavicipitaceae|科別}} 麥角菌科", "[★國考]亦可發現於{{旋花科|科別}} Convolvulaceae"], part: ["★{{菌核|部位}}"],
    constituents: ["水不溶 雙肽類：{{Ergotamine|成分}}（★{{5 個 N|數值}}）、Ergotoxine（Ergocristine + Ergocryptine + Ergocornine）",
      "水溶性 非雙肽類：★{{Ergonovine|成分}}", "{{Ergoloid|成分}} = Dihydro-Ergotoxine", "{{LSD|成分}}：(+)-Lysergic acid diethylamide"],
    uses: ["Ergotamine：★治療{{偏頭痛|疾病}}", "Ergonovine：[★國考]{{催產劑|用途}}、減少產後子宮出血", "Ergoloid：[★國考]{{血管擴張|作用}} → 改善記憶、老人痴呆",
      "LSD：★可由 Ergot 合成，為中樞交感興奮劑，有{{迷幻|作用}}作用"],
    notes: ["※Ergot 前驅物為 {{Tryptophan|前驅物}}", "[★國考]均為 {{(+)-Lysergic acid|成分}} 之衍生物",
      "(+)-Lysergic acid 很容易轉變成無活性之 {{(+)-Isolysergic acid|成分}}，但兩者皆為{{右旋|性質}}化合物"] },

  /* ===== Steroidal Alkaloid ===== */
  { id: "green-hellebore", chapter: 1, name: "Green hellebore", type: "drug", group: "Steroidal", source: SRC2,
    names: ["中文：{{綠藜蘆|生藥中文名}}", "別名：American hellebore"],
    origin: ["{{Veratrum viride|學名}}"], family: ["{{Liliaceae|科別}} 百合科"], part: ["{{乾燥根莖|部位}}"],
    constituents: ["{{Protoveratrine|成分}}、Germidine、Germitrine"],
    uses: ["{{降血壓|用途}}、抑制心臟、鎮靜", "可當{{殺蟲劑|用途}}"],
    notes: ["Protoveratrine A = Protoverine + Acetic acid + Methylbutyric acid + {{Methylhydroxybutyric acid|物質}}",
      "Protoveratrine B = Protoverine + Acetic acid + Methylbutyric acid + {{Methyldihydroxybutyric acid|物質}}"] },
  { id: "white-hellebore", chapter: 1, name: "White hellebore", type: "drug", group: "Steroidal", source: SRC2,
    names: ["中文：{{白藜蘆|生藥中文名}}", "別名：European hellebore"],
    origin: ["{{Veratrum album|學名}}"], family: ["{{Liliaceae|科別}} 百合科"], part: ["{{乾燥根莖|部位}}"],
    constituents: ["{{Protoveratrine|成分}}"], uses: ["{{不供藥用|用途}}", "可當殺蟲劑"] },
  { id: "fritillaria", chapter: 1, name: "Fritillaria", type: "drug", group: "Steroidal", source: SRC2,
    names: ["中文：{{貝母|生藥中文名}}"],
    origin: ["{{Fritillaria thunbergii|學名}}", "{{Fritillaria cirrhosa|學名}}"], family: ["★{{Liliaceae|科別}} 百合科"], part: ["★{{鱗莖|部位}}"],
    constituents: ["★{{Verticine|成分}}（考是生物鹼 or 固醇）"], uses: ["{{潤燥化痰|用途}}"] },
  { id: "christmas-rose", chapter: 1, name: "Christmas rose", type: "drug", group: "Steroidal", source: SRC2,
    names: ["中文：比較：{{黑藜蘆|生藥中文名}}"],
    origin: ["{{Helleborus niger|學名}}"], family: ["{{Ranunculaceae|科別}} 毛茛科"], part: ["{{根莖|部位}}"],
    constituents: ["Hellebrin：{{Bufadienolide|結構}}（{{非生物鹼，為配醣體|性質}}）"], uses: ["{{刺激心臟|作用}}（與綠藜蘆相反）"] },

  /* ===== Imidazole Alkaloid（p.6）===== */
  { id: "pilocarpus", chapter: 1, name: "Pilocarpus", type: "drug", group: "Imidazole", source: SRC2 + " p.6",
    names: ["中文：{{毛果芸香葉|生藥中文名}}", "別名：Jaborandi"],
    origin: ["{{Pilocarpus jaborandi|學名}}", "Pilocarpus microphyllus", "Pilocarpus pinnatifolius"], family: ["{{Rutaceae|科別}} 芸香科"], part: ["{{小葉 Leaflet|部位}}"],
    constituents: ["{{Pilocarpine|成分}}：[★國考]具 {{Imidazole|結構}}（鹼性質來源）和 {{γ-Lactone|結構}} 結構"],
    uses: ["{{縮瞳|作用}}、治療{{青光眼|疾病}}"],
    notes: ["Lactone 具★{{2 個不對稱碳原子|結構}}，且易被水解，★為 Pilocarpine {{不安定|性質}}原因（儲存一年生物鹼含量折損一半 → 儲存兩年變為無效藥）",
      "直接作用於 {{Muscarine|標的}} 受體，可產生 Pupil 瞳孔收縮（治療{{窄角型|疾病}}青光眼）及 Ciliary muscle 睫狀肌收縮（治療廣角型青光眼）"] },
  /* ===== Diterpenoidal alkaloid（p.6）===== */
  { id: "aconite", chapter: 1, name: "Aconite", type: "drug", group: "Diterpenoidal", source: SRC2 + " p.6",
    names: ["中文：{{烏頭|生藥中文名}}、附子", "Aconite ★{{炮製|性質}}才能使用"],
    origin: ["{{Aconitum napellus|學名}}"], family: ["★{{Ranunculaceae|科別}} 毛茛科"], part: ["★{{乾燥塊根|部位}}"],
    constituents: ["{{Aconitine|成分}}", "{{Atisines|成分}}（amino alcohol）"],
    uses: ["Aconitine：{{劇毒|性質}}", "Atisines：{{毒性較低|性質}}"] },
  /* ===== Pyrrolizidine alkaloid（p.6）===== */
  { id: "comfrey", chapter: 1, name: "Comfrey", type: "drug", group: "Pyrrolizidine", source: SRC2 + " p.6",
    names: ["中文：{{康復力|生藥中文名}}"],
    origin: ["{{Symphytum officinale|學名}}"], family: ["{{Boraginaceae|科別}} 紫草科"],
    constituents: ["地下部：{{Allantoin|成分}}", "{{Lasiocarpine|成分}}：{{肝毒性|副作用}}"],
    uses: ["外型與{{毛地黃|生藥中文名}}相似，易誤食"] },

  /* ===== Alkaloidal Amine（AA）→ 沒有含 N 雜環的生物鹼 ===== */
  { id: "ephedra", chapter: 1, name: "Ephedra", type: "drug", group: "Alkaloidal Amine", source: SRC2,
    names: ["中文：★{{麻黃|生藥中文名}}（[★國考]{{內蒙|產地}}地區）", "別名：Ma Huang"],
    origin: ["{{Ephedra sinica|學名}}（大陸）", "Ephedra equisetina", "Ephedra distachya", "[★國考]{{裸子植物|性質}}"],
    family: ["麻黃科 {{Gnetaceae|科別}}"], part: ["{{全草|部位}}、草質莖（莖-{{發汗|作用}}；根-止汗）"],
    constituents: ["{{D(-)-Ephedrine|成分}}：[★國考](-)-erythro-α-[1-(methylamino)ethyl]benzyl alcohol", "{{(+)-Pseudoephedrine|成分}}", "Norephedrine"],
    uses: ["α、β₁、β₂ {{agonist|作用}}", "紓解{{氣喘|疾病}}、解鼻充血、枯草熱（花粉過敏）", "[★國考]{{非抗發炎藥物|性質}}"] },
  { id: "colchicine", chapter: 1, name: "Colchicine", type: "drug", group: "Alkaloidal Amine", source: SRC2,
    names: ["中文：{{秋水仙|生藥中文名}}", "別名：Autumn crocus、秋天番紅花"],
    origin: ["{{Colchicum autumnale|學名}}"], family: ["百合科 {{Liliaceae|科別}}"], part: ["[★國考]{{種子|部位}}（0.8%）、{{球莖|部位}}（0.6%）"],
    constituents: ["Colchicine：{{不定形黃白色|性質}}生物鹼，其 amide 為{{中性|性質}}，不與酸形成鹽類"],
    uses: ["{{急性痛風|疾病}}", "{{抗有絲分裂|作用}}：抗癌、雙倍染色體（{{無子西瓜|名詞}}）", "減少發炎反應"] },
  { id: "khat", chapter: 1, name: "Khat", type: "drug", group: "Alkaloidal Amine", source: SRC2,
    names: ["中文：{{恰特草|生藥中文名}}", "別名：Abyssinian tea、阿比西尼亞茶"],
    origin: ["{{Catha edulis|學名}}"], family: ["衛矛科 {{Celastraceae|科別}}"], part: ["★{{新鮮嫩葉|部位}}"],
    constituents: ["{{(-)-Cathinone|成分}}（{{嫩葉|部位}}）", "{{(+)-Norpseudoephedrine|成分}}（老葉）", "[★國考]{{不含咖啡因|性質}}"],
    uses: ["{{止餓|用途}}、抗疲勞", "活性似 {{Amphetamine|成分}}"] },
  { id: "peyote", chapter: 1, name: "Peyote", type: "drug", group: "Alkaloidal Amine", source: SRC2,
    names: ["中文：{{摩根|生藥中文名}}", "別名：Mescal buttons"],
    origin: ["{{Lophophora williamsii|學名}}"], family: ["仙人掌科 {{Cactaceae|科別}}"], part: ["{{乾燥枝梢|部位}}（Dried tops）"],
    constituents: ["{{Mescaline|成分}}"], uses: ["{{Hallucinogen|用途}} 迷幻藥（被視為迷幻藥的先驅）"] },

  /* ===== Purine Alkaloids（p.11）===== */
  { id: "cocoa", chapter: 1, name: "Cocoa bean", short: "Cocoa", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{可可豆|生藥中文名}}"],
    origin: ["{{Theobroma cacao|學名}}"], family: ["★梧桐科 {{Sterculiaceae|科別}}"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["{{Theobromine|成分}}（可可鹼）：{{弱酸中溶解度大|性質}}"], uses: ["{{平滑肌舒張|作用}}、利尿、中樞刺激"] },
  { id: "coffee", chapter: 1, name: "Coffee bean", short: "Coffee", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{咖啡豆|生藥中文名}}"],
    origin: ["{{Coffea arabica|學名}}", "{{Coffea liberica|學名}}"], family: ["★茜草科 {{Rubiaceae|科別}}"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["{{Caffeol|成分}}（揮發油，為咖啡{{香味|性質}}的來源），烘烤後另含有約 {{50%|數值}} 的 Furfurol"], uses: ["{{中樞興奮|作用}}、利尿"] },
  { id: "kola", chapter: 1, name: "Kola", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{可拉|生藥中文名}}", "別名：Cola nut、Kolanuts"],
    origin: ["★{{Cola nitida|學名}}"], family: ["梧桐科 {{Sterculiaceae|科別}}"], part: ["{{乾燥子葉|部位}}（Cotyledon）"],
    constituents: ["Caffeine（{{3.5%|數值}}）", "Theobromine（<1%）"], uses: ["中樞興奮、製造{{可樂飲料|用途}}"] },
  { id: "guarana", chapter: 1, name: "Guarana", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{瓜拉那子|生藥中文名}}", "別名：Brazilian cocoa、巴西可可、巴西野茶膏"],
    origin: ["{{Paullinia cupana|學名}}"], family: ["★無患子科 {{Sapindaceae|科別}}"], part: ["{{壓碎種子的乾燥糊劑|部位}}"],
    constituents: ["Caffeine（{{2.5~5%|數值}}）", "{{Tannin|成分}}（25%）"], uses: ["Caffeine：中樞興奮", "★Tannin：{{收斂|作用}}"] },
  { id: "mate", chapter: 1, name: "Maté", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{巴拿圭茶|生藥中文名}}", "別名：Paraguay tea"],
    origin: ["{{Ilex paraguariensis|學名}}"], family: ["冬青科 {{Aquifoliaceae|科別}}"], part: ["{{葉|部位}}"],
    constituents: ["★Caffeine（{{0.2~2%|數值}}）", "★{{Chlorogenic acid|成分}}（10~16%）"], uses: ["{{發汗|作用}}、利尿、瀉劑（大劑量）"] },
  { id: "tea", chapter: 1, name: "Tea leaf", short: "Tea", type: "drug", group: "Purine", source: SRC2 + " p.11",
    names: ["中文：{{茶葉|生藥中文名}}", "別名：Thea"],
    origin: ["{{Camellia sinensis|學名}}"], family: ["茶科 {{Theaceae|科別}}"], part: ["{{葉、葉芽|部位}}"],
    constituents: ["Caffeine（{{1~4%|數值}}）", "少量 Adenine、Xanthine、Tannin、Theobromine、{{Theophylline|成分}}（茶鹼）", "{{Gallotannic acid|成分}}（15%）→ {{含量最多|性質}}"],
    uses: ["Caffeine：中樞神經興奮", "Tannin：收斂、與{{蛋白質沉澱|作用}}", "Theophylline：平滑肌舒張、利尿、治{{氣喘|疾病}}", "Gallotannic acid：收斂"],
    notes: ["綠茶 Green tea：新鮮葉直接{{溫火迅速乾燥|性質}}（中國、日本）[★國考]{{Polyphenol|成分}} 多酚類具強抗氧化作用，有益人體防癌",
      "紅茶 Black tea：先將新鮮葉堆積至{{醱酵|反應}}，再人工加熱迅速乾燥（斯里蘭卡、印度）"] },

  /* ===== Insecticides 殺蟲（Nicotiana 見上面 Pyridine-Piperidine）===== */
  { id: "pyrethrum", chapter: 1, name: "Pyrethrum flower", short: "Pyrethrum", type: "drug", group: "Insecticides", source: SRC2,
    names: ["中文：{{除蟲菊|生藥中文名}}"],
    origin: ["{{Chrysanthemum coccineum|學名}}"], family: ["菊科 {{Asteraceae|科別}}"], part: ["{{頭狀花|部位}}（筒狀花）"],
    constituents: ["{{Pyrethrin|成分}} I、II", "Cinerin I、II", "Jasmolin I、II"],
    uses: ["攻擊昆蟲的{{神經系統|作用}}，尤其是蚊子和蒼蠅", "★{{Sesamolin|成分}} 會與其產生{{協同作用|作用}}"] },
  { id: "derris", chapter: 1, name: "Rotenone", type: "drug", group: "Insecticides", source: SRC2,
    names: ["中文：{{毒魚藤|生藥中文名}}"],
    origin: ["{{Derris trifoliata|學名}}"], family: ["豆科 {{Fabaceae|科別}}"], part: ["{{根|部位}}"],
    constituents: ["Rotenone（{{魚藤酮|成分}}）"], uses: ["毒魚、殺蟲"] },

  /* ===== Rodenticide 殺鼠（p.13；Nux vomica 見上面 Indole）===== */
  { id: "tonka", chapter: 1, name: "Coumarin", type: "drug", group: "Rodenticide", source: SRC2 + " p.13",
    names: ["中文：★{{香豆素|生藥中文名}}（見苯丙烷類）", "來源：Tonka beans、黑香豆"],
    origin: ["{{Dipteryx odorata|學名}}", "Dipteryx oppositifolia"], family: ["豆科 {{Fabaceae|科別}}"], part: ["{{種子|部位}}"],
    constituents: ["Coumarin"], uses: ["★{{抗凝血|作用}}", "{{芳香劑|用途}}（FDA 禁用）"],
    notes: ["Coumarin：具有 {{lactone|結構}}，為 ortho-羥基與其側鏈的羧基{{環化|反應}}而成"] },
  { id: "sweet-clover", chapter: 1, name: "Dicumarol", type: "drug", group: "Rodenticide", source: SRC2 + " p.13",
    names: ["中文：{{雙羥香豆素|生藥中文名}}（見苯丙烷類）", "來源：Yellow sweet clover 黃香草木樨"],
    origin: ["{{Melilotus officinalis|學名}}"], family: ["豆科 {{Fabaceae|科別}}"], part: ["{{未完全燻製葉|部位}}、花芽（flowering tops）"],
    constituents: ["Dicumarol（{{Bishydroxycoumarin|結構}}）：{{4-Hydroxycoumarin|物質}} 和{{甲醛|物質}}反應合成製造"], uses: ["{{抗凝血|作用}}"] },
  { id: "red-squill", chapter: 1, name: "Red squill", type: "drug", group: "Rodenticide", source: SRC2 + " p.13",
    names: ["中文：★{{紅海蔥|生藥中文名}}（見 glycosides）"],
    origin: ["{{Urginea maritima|學名}}"], family: ["百合科 {{Liliaceae|科別}}"], part: ["{{鱗莖|部位}}（Bulb）"],
    constituents: ["{{Scilliroside|成分}}"], uses: ["{{殺鼠|用途}}"] }
];

/* 知識樹：通則（合成與代謝）＋各類生物鹼的生合成。
   item.group：這張卡片屬於哪一個結構分類；地圖上點那一類的好萊塢名牌，就只看這一類的卡片（機轉）和題目。
   題庫還小，挖空自己指定錯誤選項（{{答案|類型|錯1/錯2/錯3}}），選項都取自同一份講義。 */
PI.KNOWLEDGE = {
  ch1: {
    chapter: 1, title: "生物鹼",
    sections: [
      { id: "general", title: "通則：生物鹼合成與代謝", items: [
        { title: "生物鹼合成與代謝【通則】", source: "生物鹼講義 p.1",
          diagram: "assets/knowledge/alkaloid-general.svg?v=2",
          text: "需謹記的是不同的生物鹼其胺基酸和中間產物為何",
          points: [
            "★前驅物：{{2 個胺基酸|前驅物|Schiff base/Carbanion/Aldehyde}}",
            "★中間產物：{{Schiff base|中間產物|Amine/Aldehyde/Carbanion}}"
          ],
          flow: [
            { title: "起始物為 2 個胺基酸",
              text: ["一個脫去 {{CO₂|物質|H₂O/H⁺/Carbanion}} 而生成{{胺類|物質|醛類/Schiff base/Carbanion}}，另一個經由{{轉胺作用|反應|脫水/縮合反應/水解}}生成{{醛類|物質|胺類/Schiff base/Carbanion}}"] },
            { title: "胺類加醛類脫水",
              text: ["胺類加醛類進行{{脫水|反應|轉胺作用/縮合反應/水解}}，產生 {{Schiff base|中間產物|Amine/Aldehyde/Carbanion}}"] },
            { title: "Mannich-Type condensation",
              text: ["Schiff base 加上 {{Carbanion|物質|Amine/Aldehyde/CO₂}} 進行縮合反應（Mannich-Type condensation）後，形成{{生物鹼|名詞|胺基酸/醛類/胺類}}"] }
          ] }
      ] },
      { id: "biosynthesis", title: "各類生物鹼的生合成", items: [
        { title: "前驅物 → 中間產物一覽", source: "生物鹼講義 p.2–4",
          table: {
            head: ["類別", "★前驅物", "★中間產物"], lastRed: true,
            rows: [
              [{ t: "Pyridine-Piperidine", rs: 2, b: true }, "Pyrrolidine：Ornithine", "N-Methylpyrrolinium ion"],
              [null, "Pyridine：Aspartic acid + Glyceraldehyde-3-phosphate", "Nicotinic acid"],
              [{ t: "★Tropane", rs: 2, b: true }, "Pyrrolidine：Ornithine、Acetate、Methionine", "Tropine"],
              [null, "Pyridine：Phenylalanine", "(-)-Tropic acid"],
              [{ t: "Quinoline", b: true }, "Tryptophan + Secologanin", ""],
              [{ t: "Isoquinoline", b: true }, "Phenylalanine + Tyrosine", ""]
            ],
            note: "[★國考] Tropane 生成物不具光學活性，互為 enantiomer"
          } },
        { title: "Pyridine-Piperidine：Nicotine 生合成", group: "Pyridine-Piperidine", source: "生物鹼講義 p.2",
          points: [
            "Pyrrolidine：由★{{Ornithine|前驅物|Aspartic acid/Phenylalanine/Tryptophan}} 生合成，再形成★中間產物 {{N-Methylpyrrolinium ion|中間產物|Nicotinic acid/Tropine/(-)-Tropic acid}}",
            "Pyridine：★{{Aspartic acid|前驅物|Ornithine/Phenylalanine/Tyrosine}} 與 {{Glyceraldehyde-3-phosphate|前驅物|Acetate/Methionine/Secologanin}} 縮合形成 Quinolinic acid，再形成★中間產物 {{Nicotinic acid|中間產物|N-Methylpyrrolinium ion/Tropine/(-)-Tropic acid}}"
          ] },
        { title: "Tropane：Hyoscyamine 生合成", group: "Tropane", source: "生物鹼講義 p.3",
          points: [
            "[★國考]生成物{{不具光學活性|性質|具光學活性/為非鏡像異構物/含四級胺}}，互為 enantiomer",
            "Pyrrolidine：由★{{Ornithine|前驅物|Tryptophan/Tyrosine/Aspartic acid}}、Acetate、Methionine 生合成，再形成★中間產物 {{Tropine|中間產物|(-)-Tropic acid/Nicotinic acid/N-Methylpyrrolinium ion}}",
            "Pyridine：★{{Phenylalanine|前驅物|Ornithine/Tryptophan/Aspartic acid}}，再形成★中間產物 {{(-)-Tropic acid|中間產物|Tropine/Nicotinic acid/N-Methylpyrrolinium ion}}"
          ] },
        { title: "Quinoline：Quinine 前驅物", group: "Quinoline", source: "生物鹼講義 p.4",
          points: ["Quinine 前驅物為★{{Tryptophan|前驅物|Ornithine/Phenylalanine/Aspartic acid}} 與 {{Secologanin|前驅物|Acetate/Methionine/Glyceraldehyde-3-phosphate}}"] },
        { title: "Isoquinoline：合成前驅物", group: "Isoquinoline", source: "生物鹼講義 p.4",
          points: ["Isoquinoline 的合成前驅物為★{{phenylalanine|前驅物|Ornithine/Tryptophan/Aspartic acid}} 與 {{tyrosine|前驅物|Secologanin/Acetate/Methionine}}"] }
      ] },
      { id: "tests", title: "生物鹼的檢定方式", items: [
        { title: "生物鹼試劑", source: "生物鹼講義 p.5", diagram: "assets/knowledge/alkaloid-tests.svg?v=2",
          points: [
            "Wagner's：{{碘溶於碘化鉀溶液|組成|碘化汞鉀溶液/碘化鉍鉀溶液/氯化鐵溶液}} → {{棕褐色沉澱|反應結果|淡黃色/紅棕色沉澱/淡紅色鹽類}}",
            "Mayer's：{{碘化汞鉀溶液|組成|碘溶於碘化鉀溶液/碘化鉍鉀溶液/氯化鐵溶液}} → {{淡黃色|反應結果|棕褐色沉澱/紅棕色沉澱/淡紅色鹽類}}",
            "Dragendorff's：{{碘化鉍鉀溶液|組成|碘溶於碘化鉀溶液/碘化汞鉀溶液/氯化鐵溶液}} → {{紅棕色沉澱|反應結果|棕褐色沉澱/淡黃色/淡紅色鹽類}}"
          ] }
      ] },
      { id: "isoquinoline-classes", title: "Isoquinoline 分類", items: [
        { title: "Isoquinoline 分類", group: "Isoquinoline", source: "生物鹼講義 p.5",
          points: [
            "{{Benzylisoquinolines|分類|Benzophenanthridines/Morphinans/Protoberberines}}：Papaverine 罌粟鹼、Tubocurarine 箭毒鹼",
            "{{Benzophenanthridines|分類|Benzylisoquinolines/Phthalideisoquinolines/Morphinans}}：Sanguinarine 血根樹鹼",
            "{{Phthalideisoquinolines|分類|Benzylisoquinolines/Benzophenanthridines/Protoberberines}}：Hydrastine 白毛茛鹼",
            "{{Morphinans|分類|Protoberberines/Benzylisoquinolines/Phthalideisoquinolines}}：Opium Alkaloid 鴉片生物鹼",
            "{{Protoberberines|分類|Morphinans/Benzophenanthridines/Benzylisoquinolines}}：Berberine 小蘗鹼"
          ] }
      ] },
      { id: "summary", title: "重點整理", items: [
        { title: "含四級胺的生物鹼", group: "Isoquinoline", source: "生物鹼講義 p.4",
          points: ["★三種含有四級胺的生物鹼：{{Berberine|成分|Hydrastine/Canadine/Emetine}}、{{Sanguinarine|成分|Cephaeline/Coniine/Piperine}}、{{Tubocurarine|成分|Cocaine/Quinine/Nicotine}}"] },
        { title: "Tropane 類：唯一非茄科", group: "Tropane", source: "生物鹼講義 p.3",
          points: ["Tropane alkaloid 的生藥中，{{古柯|生藥中文名|顛茄/東莨菪葉/曼陀羅葉}}（古柯樹科）是唯一非茄科"] }
      ] },
      { id: "morphine", title: "★★★★★Morphine 的合成與代謝", items: [
        { title: "Morphine 的合成與代謝", group: "Isoquinoline", source: "生物鹼講義（續）",
          text: "Morphine 的生合成只須注意下面三項即可，詳細的步驟請參考生藥共筆 Vol. 14 p.32",
          points: [
            "前驅物：{{2 個 Tyrosine|前驅物|2 個 Tryptophan/2 個 Ornithine/2 個 Phenylalanine}}",
            "重要的中間產物：{{(S)-Norcoclaurine|中間產物|(S)-Reticuline/Salutaridine/Codeinone}}",
            "重要反應路徑：{{Mannich-type condensation|反應|Oxidative phenolic coupling/轉胺作用/去甲基}}"
          ],
          flow: [
            { title: "Thebaine（3 個甲基）", text: ["Thebaine：{{無療效|作用|止咳、輕微止痛/止痛（具成癮性）/降血壓}}"] },
            { title: "去甲基 → Codeine（2 個甲基）", text: ["Codeine：{{止咳、輕微止痛|作用|無療效/止痛（具成癮性）/降血壓}}"] },
            { title: "去甲基 → Morphine（1 個甲基）", text: ["Morphine：{{止痛（具成癮性）|作用|無療效/止咳、輕微止痛/降血壓}}"] }
          ],
          diagram: "assets/knowledge/morphine-biosynthesis.svg", original: "assets/knowledge/morphine-biosynthesis.jpg" }
      ] },
      { id: "caffeine", title: "Caffeine", items: [
        { title: "Caffeine：[★國考]2,6-Dioxypurine 衍生物", group: "Purine", source: "生物鹼講義（續）",
          points: [
            "結構：[★國考]{{3 個甲基|結構|2 個甲基/1 個甲基/4 個甲基}} → 1,3,7-trimethylxanthine",
            "兩個環 → {{pyrimidine|結構|pyridine/pyrrolidine/piperidine}} × {{imidazole|結構|indole/quinoline/tropane}}",
            "Theobromine 可可鹼：3,7-dimethylxanthine（{{2 個甲基|結構|3 個甲基/1 個甲基/4 個甲基}}）",
            "Theophylline 茶鹼：1,3-dimethylxanthine（2 個甲基）[★國考]4 個 N",
            "[★國考]{{Murexide test|試驗|Dragendorff's/Mayer's/Wagner's}}（紫脲酸銨試驗）：取少量 Caffeine 結晶蒸發至乾，再加入兩滴 Ammonium hydroxide，可得{{紫色|顏色|紅棕色/淡黃色/棕褐色}}殘餘物"
          ],
          diagram: "assets/knowledge/caffeine-structure.svg?v=2", original: "assets/knowledge/caffeine-structure.jpg" }
      ] },
      { id: "coumarin", title: "Coumarin", items: [
        { title: "Coumarin 與其衍生物", group: "Rodenticide", source: "生物鹼講義（續）p.13",
          points: [
            "Coumarin：具有 {{lactone|結構|lactam/epoxide/imidazole}}，為 ortho-羥基與其側鏈的羧基環化而成",
            "cinnamic acid → o-coumaric acid → o-coumaric acid-β-D-Glucoside ⇌ 環化 → coumarin",
            "Dicumarol：{{Bishydroxycoumarin|結構|6-Methoxy-7-hydroxycoumarin/4-Hydroxycoumarin/o-coumaric acid}}",
            "Scopoletin：{{6-Methoxy-7-hydroxycoumarin|結構|Bishydroxycoumarin/4-Hydroxycoumarin/o-coumaric acid}}"
          ],
          diagram: "assets/knowledge/coumarin-derivatives.svg", original: "assets/knowledge/coumarin-derivatives.jpg" }
      ] },
      { id: "amine", title: "Alkaloidal Amine", items: [
        { title: "Alkaloidal Amine（AA）", group: "Alkaloidal Amine", source: "生物鹼講義（續）",
          points: ["Alkaloidal Amine（AA）→ {{沒有含 N 雜環|結構|含 N 雜環/含四級胺/含 lactone}}的生物鹼"] }
      ] }
    ]
  }
};

/* 名詞小框框：講義上沒有印名詞解釋，先空著（只用講義上印的內容） */
PI.GLOSSARY = {};

/* 和平安符頁一樣：電腦版知識面板開大一點（樣式見 css/style.css 的 .is-amulet） */
document.documentElement.classList.add("is-amulet");

/* ================= 第 2 章：醣類、配醣體（講義 p.14–25，只用印刷字） =================
   地圖上是另一座島「配醣體島」；小分類照講義的黑色標題（同質型多糖、滲出膠、海產膠…）。
   講義上的拼字錯誤已改成正確寫法；被筆劃掉的印刷字（學名）照樣收錄。 */
PI.CHAPTERS.push({ id: 2, name: "醣類、配醣體", cat: "pharmacognosy", estimate: 46, unitType: "drug", note: "講義：醣類、配醣體（p.14–25）。依講義的印刷字。" });
PI.LANDMASSES.push({ id: "glycoside", name: "配醣體島", chapters: [2], palette: { ground: "#B9CFA0", light: "#CDDDB9", cliff: "#8FA878" } });

const SRC3 = "醣類、配醣體講義";
PI.UNITS.push(
  /* ===== 壹、醣類（字尾通常是 -an）：同質型多糖 Homoglycan（p.14）===== */
  { id: "starch", chapter: 2, name: "Starch", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{澱粉|生藥中文名}}"],
    origin: ["玉米：{{Zea mays|學名}}", "小麥：{{Triticum sativum|學名}}", "馬鈴薯：{{Solanum tuberosum|學名}}"],
    family: ["{{禾本科|科別}} Poaceae（玉米、小麥）", "茄科 Solanaceae（馬鈴薯）"], part: ["{{成熟穀粒|部位}}（玉米、小麥）", "{{塊莖|部位}}（馬鈴薯）"],
    constituents: ["{{Amylose|成分}}（25%）：直鏈澱粉，由 250~300 個 {{α-1,4|鍵結}} D-Glucopyranose 以 {{Helix-like|結構}} 的形狀連接；加碘會形成{{深藍色|顏色}}複合物；且較 Amylopectin 易溶於水",
      "{{Amylopectin|成分}}（75%）：支鏈澱粉，由 1000 個以上★α-1,4 glucose 連接，有 {{α-1,6|鍵結}} 支鏈（約 4%），無 Helix；不與酒精錯合"],
    uses: ["製劑輔助劑、{{填充劑|用途}}、黏著劑、解毒劑、{{崩散劑|用途}}（要固定來源來製造錠劑）"] },
  { id: "hetastarch", chapter: 2, name: "Hetastarch", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{羥乙基澱粉|生藥中文名}}"], origin: ["{{半合成產物|來源}}"],
    constituents: ["含 {{90%|數值}} 支鏈澱粉（Amylopectin），每十個葡萄糖多 7~8 個 {{Hydroxyethyl|結構}}（-C₂H₄OH）"],
    uses: ["6% 溶液可作為{{血漿增多劑|用途}}（代用血漿），用以矯正血液容積不足"] },
  { id: "dextran", chapter: 2, name: "Dextran", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{葡萄聚醣|生藥中文名}}"],
    origin: ["由乳酸菌（{{Leuconostoc mesenteroides|學名}}）內的葡萄聚醣轉換酶系統（Transglucosylase enzyme system）發酵{{蔗糖|物質}}所形成[★國考]"],
    family: ["細菌的酵素系統與酵素作用"], part: ["{{微生物|部位}}"],
    constituents: ["為★{{α-1,6|鍵結}}-Linked polyglucan：由葡萄糖組成之水溶性高分子聚合物", "Dextran 原料：★{{蔗糖|物質}}（Sucrose）"],
    uses: ["分子量 70000~75000：製成 {{6%|數值}} 血漿增多劑（滲透壓和黏滯度與血漿相似，不引起血清反應且無毒性）",
      "分子量 40000：製成 10% 溶液可併用治療{{休克|疾病}}，減少血液之黏稠度及改善血流"] },
  { id: "cellulose", chapter: 2, name: "Cellulose", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{纖維素|生藥中文名}}"], origin: ["植物合成{{最多|性質}}的糖是纖維素"],
    constituents: ["由★{{β-1,4|鍵結}}-Linked D-Glucose 所組成"],
    uses: ["草食動物能分解植物中纖維素是因為腸內微生物分泌★{{Cellulase|酵素}} 所致[★國考]"] },
  { id: "inulin", chapter: 2, name: "Inulin", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{菊糖|生藥中文名}}"], origin: ["蒲公英、土木香、{{牛蒡根|來源}}"],
    family: ["{{菊科|科別}} Asteraceae"], part: ["{{植物地下部分|部位}}"],
    constituents: ["由 {{β-2,1|鍵結}} 連結成直線型的 D-fructan，為{{聚果糖|物質}}（Polyfructan）"],
    uses: ["可測定{{腎臟功能|用途}}、鑑定細菌的發酵能力"] },
  { id: "purified-cotton", chapter: 2, name: "Purified cotton", short: "Cotton", type: "drug", group: "Homoglycan", source: SRC3 + " p.14",
    names: ["中文：{{精製棉|生藥中文名}}", "Purified cotton／Absorbent cotton"],
    origin: ["{{Gossypium hirsutum|學名}}"], family: ["{{錦葵科|科別}} Malvaceae"],
    part: ["種子上{{絨毛|部位}}，無附著雜質；且經去掉油脂和漂白"],
    uses: ["{{外科敷料|用途}}，稀釋劑、糖衣黏合劑、穩定劑、崩散劑、稠厚劑"] },

  /* ===== 異質型多糖 Heteroglycan：滲出膠 Exudate gums（p.15）===== */
  { id: "tragacanth", chapter: 2, name: "Tragacanth", type: "drug", group: "Exudate gums", source: SRC3 + " p.15",
    names: ["中文：{{西黃耆膠|生藥中文名}}", "別名：Gum tragacanth"],
    origin: ["{{Astragalus gummifer|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{枝幹乾燥樹膠滲出物|部位}}"],
    constituents: ["{{Bassorin|成分}}（60~70%）：為甲基酸聚體（Polymethoxylated Acids）之混合物，{{不溶於水|性質}}",
      "黃蓍膠（{{Tragacanthin|成分}}）：含有 30% Demethoxylated bassorin，具{{水溶性|性質}}成分"],
    uses: ["{{助懸劑|用途}}、乳化劑、黏著劑"], notes: ["水膠體對{{酸水解|反應}}最具抵抗性"] },
  { id: "acacia", chapter: 2, name: "Acacia", type: "drug", group: "Exudate gums", source: SRC3 + " p.15",
    names: ["中文：{{阿拉伯膠|生藥中文名}}", "別名：Gum Arabic"],
    origin: ["{{Acacia senegal|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{枝幹乾燥樹膠滲出物|部位}}"],
    constituents: ["主成分 {{Arabin|成分}} 為 Arabic acid 之鈣、鎂、鉀鹽之混合物", "結構為★{{1,3-Linked D-Galactopyranose|結構}}[★國考]",
      "Arabic acid 經水解得：L-Arabinose、D-Galactose、D-Glucuronic acid、L-rhamnose", "Acacia 含有酵素 {{Oxidase|酵素}}、Peroxidase、Pectinase"],
    uses: ["{{乳化劑|用途}}、助懸劑、潤滑劑、軟化劑、錠劑製粒的黏和劑"],
    notes: ["可溶於 60% 以下之乙醇溶液★具有{{低黏性|性質}}（水多才可溶）、在 {{pH2~10|數值}} 皆具良好安定性[★國考]"] },
  { id: "karaya", chapter: 2, name: "Karaya Gum", short: "Karaya", type: "drug", group: "Exudate gums", source: SRC3 + " p.15",
    names: ["中文：{{梧桐膠|生藥中文名}}", "別名：Sterculia Gum"],
    origin: ["{{Sterculia urens|學名}}"], family: ["{{梧桐科|科別}} Sterculiaceae"], part: ["{{枝幹乾燥樹膠滲出物|部位}}"],
    constituents: ["是一種{{乙醯化|反應}}含分支的異質多醣", "主鏈為 1,4-α-D-Galacturonic acid 和 1,2-L-Rhamnopyranose，有短的 D-glucopyranosyluronic acid 側鏈以 1→3 鍵結到 D-galacturonic acid 主鏈"],
    uses: ["{{膨脹性緩瀉劑|用途}}（{{水溶性最差|性質}}）、乳化劑、懸浮劑、牙科黏著劑"] },

  /* ===== 海產膠 Marine gums（p.16）===== */
  { id: "alginate", chapter: 2, name: "Sodium Alginate", short: "Alginate", type: "drug", group: "Marine gums", source: SRC3 + " p.16",
    names: ["中文：{{藻酸鈉|生藥中文名}}", "別名：海草素（Algin）"],
    origin: ["{{Macrocystis pyrifera|學名}}"], family: ["{{巨藻科|科別}} Lessoniaceae"], part: ["{{褐藻|部位}}"],
    constituents: ["主成分為 {{Alginic acid|成分}} 的{{鈉鹽|性質}}（Sodium salt）", "Algin 是一種線性的 {{D-Mannuronic acid|結構}} 和 L-Guluronic acid 聚合物"],
    uses: ["Algin 用於食品工業上作為{{助懸劑|用途}}", "藻酸鈣（Calcium Alginate）為{{牙科預鑄模型|用途}}所用的固形凝膠體"],
    notes: ["以{{稀鹼|物質}}抽提褐藻，並經純化而得的碳水化合物"] },
  { id: "agar", chapter: 2, name: "Agar", type: "drug", group: "Marine gums", source: SRC3 + " p.16",
    names: ["中文：{{洋菜|生藥中文名}}", "別名：日本魚膠（Japanese isinglass）、瓊脂、凍瓊脂、石花菜"],
    origin: ["{{Gelidium cartilagineum|學名}}", "{{Gracilaria confervoides|學名}}"],
    family: ["{{石花菜科|科別}} Gelidiaceae", "{{球果藻科|科別}} Sphaerococcaceae"], part: ["{{紅藻|部位}}所得之乾燥、親水性膠狀物質"],
    constituents: ["Agar 是一種{{鈣鹽|性質}}（Calcium salt），為酸性多糖（Acidic polysaccharides）", "主成分：{{Agarose|成分}}／Agaropectin",
      "結構為 1,3-D-Galactopyranosyl，具{{硫酸酯|結構}}（Sulfate ester）取代"],
    uses: ["緩瀉劑（膨脹型）、乳化劑、混懸劑、凝膠劑、潤滑劑", "{{組織培養基|用途}}材料", "{{臨床診斷及蛋白質層析|用途}}的膠[★國考]"] },
  { id: "carrageenan", chapter: 2, name: "Carrageenan", type: "drug", group: "Marine gums", source: SRC3 + " p.16",
    names: ["中文：{{鹿角菜|生藥中文名}}", "別名：愛爾蘭苔（Irish Moss）"],
    origin: ["{{Chondrus crispus|學名}}"], family: ["{{杉海苔科|科別}} Gigartinaceae"], part: ["{{紅藻|部位}}"],
    constituents: ["是一種聚半乳糖（{{Galactan|成分}}）和★硫酸酯（Sulfate ester）結合的水膠體 → 似 Agar，但{{硫酸酯含量較多|性質}}[★國考]",
      "結構由 1,3-β-D-galactose 和 1,4-α-D-galactose 所組成"],
    uses: ["乳化劑、懸浮劑、潤滑劑、脹瀉劑", "{{牙膏製劑|用途}}"],
    notes: ["κ、ι-carrageenan：{{凝膠|性質}}", "λ-carrageenan：{{增稠|性質}}"] },

  /* ===== 種子膠 Seed gums（p.16）===== */
  { id: "plantago", chapter: 2, name: "Plantago Seed", short: "Plantago", type: "drug", group: "Seed gums", source: SRC3 + " p.16",
    names: ["中文：{{車前子|生藥中文名}}", "別名：Psyllium seed、Plantain seed"],
    origin: ["{{Plantago psyllium|學名}}", "Plantago indica", "Plantago ovata"], family: ["{{車前科|科別}} Plantaginaceae"], part: ["{{乾燥種子|部位}}"],
    constituents: ["含有 {{30%|數值}} 的水合膠體，存在於{{外種皮|部位}}"],
    uses: ["是一種{{峻瀉劑|用途}}（Cathartic），具{{搖變性|性質}}（Thixotropic）"],
    notes: ["車前子 1 克，加水 20 毫升，其膨脹後體積不得少於 {{14 毫升|數值}}"] },
  { id: "guar", chapter: 2, name: "Guar Gum", short: "Guar", type: "drug", group: "Seed gums", source: SRC3 + " p.16",
    names: ["中文：{{瓜爾膠|生藥中文名}}", "別名：Guaran"],
    origin: ["{{Cyamopsis tetragonolobus|學名}}"], family: ["{{豆科|科別}} Leguminosae"], part: ["{{內胚乳|部位}}"],
    constituents: ["水膠體為半乳甘露聚糖（{{Galactomannan|成分}}）以 1,4-D-mannopyranosyl 形成直鏈"],
    uses: ["作為{{膨脹性緩瀉劑|用途}}、增稠劑、錠劑黏合劑、崩散劑"], notes: ["Galactomannan = {{Mannose|物質}} 主鏈 + Galactose 取代"] },
  { id: "locust-bean", chapter: 2, name: "Locust Bean Gum", short: "Locust Bean", type: "drug", group: "Seed gums", source: SRC3 + " p.16",
    names: ["中文：{{刺槐豆膠|生藥中文名}}"],
    origin: ["{{Ceratonia siliqua|學名}}"], family: ["{{豆科|科別}} Leguminosae"], part: ["{{內胚乳|部位}}"],
    constituents: ["為半乳甘露聚糖（Galactomannan），較少 Mannose chain 取代"], uses: ["{{增稠劑|用途}}、穩定劑"] },

  /* ===== 微生物膠 Microbial gum、果膠 Pectin（p.17）===== */
  { id: "xanthan", chapter: 2, name: "Xanthan gum", short: "Xanthan", type: "drug", group: "Microbial gum", source: SRC3 + " p.17",
    names: ["中文：{{黃原膠|生藥中文名}}", "別名：三仙膠"],
    origin: ["{{Xanthomonas campestris|學名}}（黃色單胞桿菌）"], family: ["作用在適當的碳水化合物"], part: ["{{微生物|部位}}"],
    constituents: ["主要骨架為 {{1,4-β-D-Glucan|結構}}，在第二個 Glucose 殘基之 O-3 和三醣連結：β-D-Mannopyranose(1→4) → β-D-Glucopyranosyluronic acid(1→2) → α-D-Mannopyranose"],
    uses: ["乳化劑、助懸劑", "具{{假塑性|性質}}（Pseudoplastic），能使牙膏和軟膏易成型，也易於塗敷"],
    notes: ["細胞外樹膠獲得，是經{{異丙醇|物質}}沉澱之發酵湯汁而得"] },
  { id: "pectin", chapter: 2, name: "Pectin", type: "drug", group: "Pectin", source: SRC3 + " p.17",
    names: ["中文：{{果膠|生藥中文名}}"],
    origin: ["Pectin 為精緻碳水化合物製品，得自{{柑橘果皮之內層或蘋果漿|來源}}之稀酸抽提物",
      "先得到的前驅物為不溶性之果膠原（{{Protopectin|物質}}），進一步經由限定水解反應，以稀酸抽提得到可溶性之果膠（Pectin），在醇溶液中 Pectin 會沉澱出"],
    part: ["{{果皮細胞壁|部位}}"], constituents: ["Pectin 單位為 {{1,4-α-D-Galacturonic acid|結構}}"],
    uses: ["{{止瀉藥|用途}}處方、吸著毒素（保護劑）"],
    notes: ["Pectin 分子量 100,000~250,000，其甲氧基（Methoxyl group）的含量不得低於 {{6.7%|數值}}；半乳糖醛酸（Galacturonic acid）的含量不得低於 74%",
      "Galacturonic acid 的數量多寡可影響{{膠著力和黏稠度|性質}}", "一分果膠和九分水加熱可形成{{硬果凍|性質}}（Stiff gel）"] },

  /* ===== 貳、配醣體（字尾通常是 -in）：強心配醣體 Cardiac Glycosides（p.19–20）===== */
  { id: "digitalis", chapter: 2, name: "Digitalis", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.19",
    names: ["中文：{{毛地黃|生藥中文名}}", "別名：紫花毛地黃、洋地黃（Foxglove）"],
    origin: ["{{Digitalis purpurea|學名}}"], family: ["{{玄參科|科別}} Scrophulariaceae"], part: ["{{乾燥葉|部位}}"],
    constituents: ["Purpurea glycosides A → 水解 → ★{{Digitoxin|成分}}；非醣基（苷基）：★Digitoxigenin",
      "Purpurea glycosides B → 水解 → Gitoxin；非醣基：Gitoxigenin", "Gluco-gitaloxin（Purpurea glycosides C）→ 水解 → Gitaloxin；非醣基：Gitaloxigenin",
      "共同產物：{{3 Digitoxose + 1 Glucose|成分}}"],
    uses: ["{{強心利尿|用途}}"], notes: ["Digitoxose 結構：{{2,6-Dideoxy|結構}}-β-D-ribo-hexo-pyranose[★國考]"] },
  { id: "digitalis-lanata", chapter: 2, name: "Digitalis Lanata", short: "D. lanata", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.19",
    names: ["中文：{{長葉毛地黃|生藥中文名}}", "別名：狹葉毛地黃（Grecian foxglove）"],
    origin: ["{{Digitalis lanata|學名}}"], family: ["{{玄參科|科別}} Scrophulariaceae"], part: ["{{乾燥葉|部位}}"],
    constituents: ["Lanatoside A → 水解 → ★Digitoxin；非醣基：Digitoxigenin", "Lanatoside B → Gitoxin；Gitoxigenin",
      "Lanatoside C → ★{{Digoxin|成分}}；Digoxigenin", "Lanatoside D → Diginatin；Diginatigenin", "Lanatoside E → Gitaloxin；Gitaloxigenin",
      "共同產物：3 Digitoxose + 1 Glucose + 1 Acetyldigoxin"],
    uses: ["{{強心利尿|用途}}"], notes: ["{{Lanatoside C|成分}} 去乙醯基得 Deacetyllanatoside，再去醣基得★Digoxin（主要來源）"] },
  { id: "strophanthus", chapter: 2, name: "Strophanthus", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.19",
    names: ["中文：{{毒毛旋花子|生藥中文名}}", "別名：箭毒子"],
    origin: ["綠：{{Strophanthus kombe|學名}}", "棕：{{Strophanthus hispidus|學名}}"], family: ["{{夾竹桃科|科別}} Apocynaceae"],
    part: ["{{乾燥成熟種子去種芒|部位}}（awn）"],
    constituents: ["K-Strophanthoside（Streposide）：為主成份，含醣基 {{Cymarose|成分}}、β-D-Glucose、α-D-Glucose",
      "K-Strophanthide-β：接雙醣基（Cymarose、β-D-Glucose）", "Cymarin：接{{單醣基|結構}}（Cymarose）",
      "三者苷基皆為★{{Strophanthidin|成分}}[★國考]，因此合稱 K-Strophanthin"],
    uses: ["{{強心利尿|用途}}"] },
  { id: "ouabain", chapter: 2, name: "Ouabain", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.19",
    names: ["中文：{{哇巴因|生藥中文名}}", "別名：平滑毒毛旋花子、苦毒毛旋花子（G-strophanthin）"],
    origin: ["{{Strophanthus gratus|學名}}[★國考]"], family: ["{{夾竹桃科|科別}} Apocynaceae"], part: ["{{乾燥成熟種子去種芒|部位}}（awn）"],
    constituents: ["主成份 Ouabain（又稱 {{G-strophanthin|成分}}）", "醣基：{{L-Rhamnose|成分}}[★國考]", "苷基：Ouabagenin，屬於 {{Cardenolide|結構}}[★國考]",
      "具有 {{5 個 OH 基|數值}}，極性高，作用快，★適合{{靜脈注射|給藥途徑}}[★國考]"],
    uses: ["緊急 {{IV|給藥途徑}} 作為強心劑"] },
  { id: "black-hellebore", chapter: 2, name: "Black hellebore", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{黑藜蘆|生藥中文名}}", "別名：聖誕玫瑰（Christmas rose）"],
    origin: ["{{Helleborus niger|學名}}"], family: ["{{毛茛科|科別}} Ranunculaceae[★國考]"], part: ["{{乾燥根莖和根|部位}}"],
    constituents: ["主成份 {{Hellebrin|成分}}，屬於 {{Bufadienolide|結構}}"], uses: ["強心，{{心臟興奮|作用}}（綠藜蘆：心臟抑制）"] },
  { id: "convallaria", chapter: 2, name: "Convallaria", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{鈴蘭|生藥中文名}}", "別名：Lily-of-the-valley-root"],
    origin: ["{{Convallaria majalis|學名}}"], family: ["{{百合科|科別}} Liliaceae"], part: ["{{乾燥根莖和根|部位}}"],
    constituents: ["主成份 {{Convallatoxin|成分}}：醣基：Rhamnose，苷基：Strophanthin"], uses: ["{{強心|用途}}"] },
  { id: "white-squill", chapter: 2, name: "White Squill", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{白海蔥|生藥中文名}}"],
    origin: ["{{Urginea maritima|學名}}"], family: ["{{百合科|科別}} Liliaceae[★國考]"], part: ["{{球莖|部位}}（Bulb）"],
    constituents: ["主成份 {{Scillaren A|成分}}（佔總配糖體 2/3）", "醣基：L-Rhamnose[★國考]", "苷基：★{{Scillarenin|成分}}，屬 {{Bufadienolide|結構}}[★國考]"],
    uses: ["強心利尿", "{{催吐、祛痰|用途}}"] },
  { id: "red-squill-glycoside", chapter: 2, name: "Red Squill", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{紅海蔥|生藥中文名}}"],
    origin: ["{{Urginea maritima|學名}}"], family: ["{{百合科|科別}} Liliaceae[★國考]"], part: ["{{球莖|部位}}（Bulb）"],
    constituents: ["Scillaren A、Glucoscilliroside（當中 {{Scilliroside|成分}} 為殺鼠成分）"], uses: ["{{殺鼠劑|用途}}[★國考]"] },
  { id: "apocynum", chapter: 2, name: "Apocynum", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{加拿大麻|生藥中文名}}、夾竹桃麻", "別名：Dog bane、Canadian hemp、Black indian hemp"],
    origin: ["{{Apocynum cannabinum|學名}}"], family: ["{{夾竹桃科|科別}} Apocynaceae"], part: ["{{乾燥根莖和根|部位}}"],
    constituents: ["主成份 {{Cymarin|成分}}（加大麻素）", "Apocannoside、Cyanocannoside（次要）"], uses: ["{{強心|用途}}"] },
  { id: "adonis", chapter: 2, name: "Adonis", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{側金盞花|生藥中文名}}", "別名：Pheasant's eye"],
    origin: ["{{Adonis vernalis|學名}}"], family: ["{{毛茛科|科別}} Ranunculaceae"], part: ["{{乾燥地上部|部位}}"],
    constituents: ["{{Adonitoxin|成分}}、Cymarin、K-Strophanthin"], uses: ["{{強心|用途}}"] },
  { id: "oleander", chapter: 2, name: "Oleander", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{夾竹桃|生藥中文名}}"],
    origin: ["{{Nerium oleander|學名}}"], family: ["{{夾竹桃科|科別}} Apocynaceae"], part: ["{{葉子|部位}}"],
    constituents: ["主成份 {{Oleandrin|成分}}（為 {{Gitoxigenin|成分}} 的 3-Glycoside-16-acetyl 衍生物）"], uses: ["{{強心|用途}}"] },
  { id: "toad", chapter: 2, name: "Toad cake", short: "Toad", type: "drug", group: "Cardiac Glycosides", source: SRC3 + " p.20",
    names: ["中文：{{蟾蜍|生藥中文名}}", "Toad poison、Toad cake"],
    origin: ["大陸：{{Bufo bufo gargarizans|學名}}", "台灣：Bufo vulgaris formosus", "日本：Bufo vulgaris japonicus"],
    family: ["{{蟾蜍科|科別}} Bufonidae"], part: ["{{耳腺及皮脂腺分泌物|部位}}"],
    constituents: ["{{Bufotoxin|成分}}（{{動物性|性質}}）[★國考]，屬 Bufadienolide，為脂類非苷質，分解形成 Bufotalin 及 Suberoyl-arginine"],
    uses: ["強心利尿", "{{蟾酥|製劑}}、蝦蟆、六神丸"] },

  /* ===== 皂苷類配醣體：三萜類皂苷 Triterpenoid saponins（β-Amyrin）（p.22）===== */
  { id: "glycyrrhiza", chapter: 2, name: "Glycyrrhiza", type: "drug", group: "Triterpenoid saponins", source: SRC3 + " p.22",
    names: ["中文：{{甘草|生藥中文名}}", "別名：Licorice root、藥王"],
    origin: ["東北：{{Glycyrrhiza uralensis|學名}}", "中國：Glycyrrhiza echinata", "歐洲：{{Glycyrrhiza glabra|學名}}"],
    family: ["{{豆科|科別}} Leguminosae"], part: ["{{根莖及根|部位}}"],
    constituents: ["主成份為甘草素（{{Glycyrrhizin|成分}}）：又稱甘草酸（Glycyrrhizic acid），甜度為蔗糖的 {{50 倍|數值}}[★國考]，水解後甜味消失",
      "水解產生 醣基：2 分子葡萄糖醛酸（{{Glucuronic acid|成分}}）；苷基：1 分子甘草次甜酸（{{Glycyrrhetic acid|成分}}）",
      "類黃酮配醣體（Flavonoid glycosides）：Licoricone、Licoricidine 可抗氧化、抗發炎，為★甘草成{{黃色|顏色}}之來源"],
    uses: ["潤滑劑、祛痰劑（感冒糖漿）、遮蓋劑、吸收劑、芳香調味、消炎、胃潰瘍", "★{{愛迪生症|疾病}}（慢性腎上腺功能不全）"],
    notes: ["★由於甘草素會使{{鈉滯留|副作用}}及排除鉀離子，影響血壓恆定，因此心血管疾病和高血壓者應避免服用，也不能併用{{強心配醣體|藥物類別}}"] },
  { id: "ginseng", chapter: 2, name: "Ginseng", type: "drug", group: "Triterpenoid saponins", source: SRC3 + " p.22",
    names: ["中文：{{人參|生藥中文名}}"],
    origin: ["中國：{{Panax ginseng|學名}}（紅參）", "西洋：{{Panax quinquefolius|學名}}（白參）"], family: ["{{五加科|科別}} Araliaceae"],
    part: ["紅參：根部{{連皮|部位}}乾燥，熱水處理再乾燥", "白參：根部{{去皮|部位}}乾燥，日照"],
    constituents: ["Ginsenoside {{Rg1|成分}} 為最主要的皂苷，屬於 {{O-Glycosides|結構}}（醣基-O-非醣基）", "醣基：Glucose 接在第 {{6|數值}} 號 C",
      "苷基：屬於固醇性三萜類非醣基（Steroidal triterpene aglycone），結構為★{{(20S)-Protopanaxatriol|結構}}[★國考]", "Panaxosides、Chikusetsusaponins"],
    uses: ["Rb1：{{中樞抑制鎮靜|作用}}、代謝促進；Rg1：{{中樞興奮|作用}}、抗癌、免疫促進適應劑", "祛風、利尿、降血糖、抗潰瘍、★調理素（{{Adaptogen|名詞}}）調節腎上腺及甲狀腺功能缺失"] },
  { id: "platycodon", chapter: 2, name: "Platycodon", type: "drug", group: "Triterpenoid saponins", source: SRC3 + " p.22",
    names: ["中文：{{桔梗|生藥中文名}}"],
    origin: ["{{Platycodon grandiflorum|學名}}"], family: ["{{桔梗科|科別}} Campanulaceae"], part: ["{{乾燥根|部位}}"],
    constituents: ["皂苷：{{Platycodin|成分}} A-H（五環）"], uses: ["{{鎮咳消炎|用途}}、鎮靜、感冒咳嗽製劑"] },
  { id: "polygala", chapter: 2, name: "Polygala", type: "drug", group: "Triterpenoid saponins", source: SRC3 + " p.22",
    names: ["中文：{{遠志|生藥中文名}}"],
    origin: ["{{Polygala tenuifolia|學名}}"], family: ["{{遠志科|科別}} Polygalaceae"], part: ["{{乾燥根|部位}}"],
    constituents: ["皂苷：{{Onjisaponin|成分}}、Tenuifolin", "結構：3-O-Glucosyl-presenegin"], uses: ["{{鎮咳消炎|用途}}、感冒咳嗽製劑"] },
  { id: "senega", chapter: 2, name: "Senega", type: "drug", group: "Triterpenoid saponins", source: SRC3 + " p.22",
    names: ["中文：{{美遠志|生藥中文名}}"],
    origin: ["{{Polygala senega|學名}}"], family: ["{{遠志科|科別}} Polygalaceae"], part: ["乾燥根表面有{{稜脊|部位}}（Keel）"],
    constituents: ["皂苷：{{Senegin|成分}}（Polygalin 美遠志苷）"], uses: ["{{鎮咳消炎|用途}}、感冒咳嗽製劑"] },

  /* ===== 固醇類皂苷 Steroid saponins（Diogenin）（p.22；講義下緣被切掉，只收看得到的字）===== */
  { id: "dioscorea", chapter: 2, name: "Dioscorea", type: "drug", group: "Steroid saponins", source: SRC3 + " p.22",
    names: ["中文：{{山芋|生藥中文名}}", "別名：山藥"],
    origin: ["美：{{Dioscorea villosa|學名}}", "中：{{Dioscorea batatas|學名}}", "日：Dioscorea japonica"],
    family: ["{{薯蕷科|科別}} Dioscoreaceae"], part: ["{{乾燥根莖|部位}}"],
    constituents: ["{{Dioscin|成分}}（六環）水解產生苷基 {{Diosgenin|成分}}（為植物固醇，經由 {{Marker degradation|反應}}，得到動物性固醇黃體素，可做★{{口服避孕藥|用途}}原料）[★國考]"],
    uses: ["{{固醇類藥物來源|用途}}，可作為腎上腺皮質素、葡萄醣皮質素之先驅物"] },

  /* ===== 蒽醌類配醣體 Anthraquinone Glycosides（p.24–25）===== */
  { id: "cascara", chapter: 2, name: "Cascara sagrada", short: "Cascara", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.24",
    names: ["中文：{{美鼠李皮|生藥中文名}}", "別名：Rhamnus purshianus"],
    origin: ["美：{{Rhamnus purshianus|學名}}"], family: ["{{鼠李科|科別}} Rhamnaceae"], part: ["{{乾燥樹皮|部位}}"],
    constituents: ["主要有效成分：Cascarosides A、B、C、D，皆同時具有★{{O-Glycosides 和 C-Glycosides|結構}} 結構[★國考]",
      "Cascarosides A、B：為 {{Barbaloin|成分}} 衍生物，互為光學異構物", "★Cascarosides C、D：為 {{Chrysaloin|成分}}（Deoxybarbaloin）衍生物，互為光學異構物",
      "配醣體中的醣基為{{雙醣|結構}}，水解後可得到★Rhamnose 和 Glucose"],
    uses: ["{{通腸潤便|用途}}", "★使用前須存放至少 {{1 年|數值}}（使配醣體從還原態轉化為★{{氧化態|性質}}，瀉下作用較和緩才可作為藥用）[★國考]"] },
  { id: "frangula", chapter: 2, name: "Frangula", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.24",
    names: ["中文：{{歐鼠李皮|生藥中文名}}", "別名：Buckthorn bark[★國考]"],
    origin: ["歐：{{Rhamnus frangula|學名}}"], family: ["{{鼠李科|科別}} Rhamnaceae"], part: ["{{乾燥樹皮|部位}}"],
    constituents: ["Frangulin A、B（主要）：★{{1 個醣基|結構}}", "Glucofrangulin A、B：{{2 個醣基|結構}}", "Frangulin A 水解可得大黃素（{{Emodin|成分}}）和 Rhamnose"],
    uses: ["{{通腸潤便|用途}}", "★使用前須存放至少 1 年"] },
  { id: "aloe", chapter: 2, name: "Aloe", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.24",
    names: ["中文：{{蘆薈|生藥中文名}}"],
    origin: ["市面上使用最廣：{{Aloe barbadensis|學名}}", "雜交種：A. ferox + A. africana + A. spicata"], family: ["{{百合科|科別}} Liliaceae"],
    part: ["肉質葉片（旱生植物特有）的★{{乾燥乳液|部位}}（Latex）"],
    constituents: ["有效成份 Aloin A：Barbaloin（10R），★1 個醣基，為★{{C-glycoside|結構}}，屬於水溶性的配醣體混合物",
      "Aloin B：{{Isobarbaloin|成分}}（10S）1 個醣基[★國考]", "Aloinoside：為 O-Glycosides 和 C-Glycosides",
      "無效成份：樹脂類（Resinous material）、揮發油（Volatile oil）：{{味道|性質}}來源"],
    uses: ["可以加入★{{複方安息香酊劑|製劑}}中（Compound Benzoin Tincture = Friar's Balsam）",
      "複方安息香酊劑的成分含★安息香（Benzoin）、蘆薈（Aloe）、蘇合香（Storax）、妥路香膠（Tolu balsam），可幫助排便",
      "為{{峻瀉劑|用途}}，會引發劇烈瀉下，造成腹痛，因此常併服{{祛風藥|藥物類別}}（Carminatives），減緩腸胃痛"],
    notes: ["蘆薈水溶性抽取物之百分比不得少於 {{50%|數值}}"] },
  { id: "aloe-gel", chapter: 2, name: "Aloe Vera Gel", short: "Aloe Gel", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.24",
    names: ["中文：{{蘆薈膠|生藥中文名}}"],
    origin: ["Aloe barbadensis（A. vera）"], family: ["{{百合科|科別}} Liliaceae"], part: ["新鮮{{黏液狀膠體|部位}}（Mucilaginous gel）"],
    constituents: ["{{蘆薈素|成分}}（Aloin）"], uses: ["促進傷口癒合，治療★{{曬傷|疾病}}、高溫燒傷（Deep thermal burns）、輻射灼傷（Radiation burns）"] },
  { id: "rhubarb", chapter: 2, name: "Rhubarb", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.25",
    names: ["中文：{{大黃|生藥中文名}}", "別名：Rheum、Chinese rhubarb"],
    origin: ["★北（掌葉）大黃：{{Rheum palmatum|學名}}", "★南（藥用）大黃：{{Rheum officinale|學名}}", "觀賞用大黃：Rheum rhaponticum"],
    family: ["{{蓼科|科別}} Polygonaceae"], part: ["{{乾燥根莖和根|部位}}"],
    constituents: ["瀉下成分（蒽醌類配醣體）：含 COOH：★大黃酸（{{Rhein|成分}}）；不含 COOH：大黃素（Emodin）、蘆薈大黃素（Aloe-emodin）、大黃酚（Chrysophanol）",
      "★收斂成分：五倍子酸（{{Gallic acid|成分}}）：α-Glucogallin 以及 β-Glucogallin", "單寧（Tannin）：兒茶素（d-Catechin）、表兒茶素（Epicatechin）"],
    uses: ["去角質劑、苦味健胃劑、通便劑", "★試劑檢測：大黃酚 + 氨水（Ammonia）→ 呈{{粉紅色|顏色}}", "大黃 + 5% KOH → 呈{{血紅色|顏色}}",
      "{{Bornträger's test|試驗}} → 呈正反應（為測試蒽醌類的一種方法）"],
    notes: ["南大黃★維管束（星點）為{{不規則散布|性質}}；北大黃則成{{環狀排列|性質}}[★國考]"] },
  { id: "senna", chapter: 2, name: "Senna", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.25",
    names: ["中文：{{番瀉葉|生藥中文名}}", "別名：Senna leaves"],
    origin: ["尖葉番瀉：{{Cassia acutifolia|學名}}", "狹葉番瀉（主要）：{{Cassia angustifolia|學名}}"], family: ["{{豆科|科別}} Leguminosae"], part: ["{{乾燥小葉|部位}}"],
    constituents: ["有效成分有四種：Sennoside A、B、C、D，為{{二聚配糖體|結構}}（Dimeric glycosides）[★國考]",
      "Sennoside A、B（主要）：苷基：大黃二蒽酮（★{{Rhein dianthrone|成分}}），由★{{兩分子大黃酸|結構}}（Rhein）組成[★國考]",
      "Sennoside C、D（次要）：苷基：由★一分子大黃酸（Rhein）和一分子{{蘆薈大黃素|成分}}（Aloe-emodin）組成", "Sennoside A、B 互為{{立體異構物|性質}}"],
    uses: ["治療{{習慣性便祕|疾病}}（Habitual constipation）的瀉劑（Purgative），但常伴隨腸絞痛（Griping），故可併服祛風藥（Carminatives），幫助排氣，減緩此症狀", "因便宜而廣為使用"] },
  { id: "chrysarobin", chapter: 2, name: "Chrysarobin", type: "drug", group: "Anthraquinone Glycosides", source: SRC3 + " p.25",
    names: ["中文：{{柯亞素|生藥中文名}}"],
    origin: ["{{Andira araroba|學名}}"], family: ["{{豆科|科別}} Leguminosae"], part: ["柯亞粉末（{{Goa powder|部位}}）"],
    constituents: ["大黃酚蒽酮（{{Chrysophanol anthrone|成分}}）、大黃蒽酚（Chrysophanol anthranol）、大黃素蒽酮（Emodin anthrone）、去氫大黃素蒽酮（Dehydro-emodin anthrone）"],
    uses: ["緩瀉劑，但{{不能口服|性質}}，因為柯亞素的黏膜刺激性強", "★唯一不口服 Anthraquinone!!"] }
);

/* 知識樹：照講義的黑色標題分段；表格照講義的欄位排，結構式另畫成向量圖 */
PI.KNOWLEDGE.ch2 = {
  chapter: 2, title: "醣類、配醣體",
  sections: [
    { id: "polysaccharide", title: "壹、醣類（字尾通常是 -an）[★國考]", items: [
      { title: "同質型多糖（Homoglycan）整理", group: "Homoglycan", source: SRC3 + " p.15",
        points: [
          "聚葡萄糖（Polyglucan）：{{Amylose、Dextran、Cellulose|分類|Starch、Cellulose、Inulin/Hetastarch、Dextran/Agar、Carrageenan}}",
          "高分子量多糖（High molecular weight polysaccharides）：Starch、Cellulose、Inulin",
          "鍵結方式：Dextran：{{α-1,6 型|鍵結|α-1,4 型/β-1,4 型/β-2,1 型}}；Starch：{{α-1,4 型|鍵結|α-1,6 型/β-1,4 型/β-2,1 型}}；Cellulose：{{β-1,4 型|鍵結|α-1,4 型/α-1,6 型/β-2,1 型}}[★國考]",
          "代用血漿：{{Hetastarch、Dextran|分類|Amylose、Dextran、Cellulose/Starch、Cellulose、Inulin/Agar、Carrageenan}}"
        ] }
    ] },
    { id: "cardiac", title: "貳、配醣體（字尾通常是 -in）：強心配醣體（Cardiac Glycosides）", items: [
      { title: "結構[★國考]", group: "Cardiac Glycosides", source: SRC3 + " p.18",
        diagram: "assets/knowledge/cardiac-structure.svg",
        table: {
          rows: [
            [{ t: "非醣基", cs: 2, b: true }, { t: "Cardenolide", b: true }, { t: "Bufadienolide", b: true }],
            [{ t: "結構", rs: 2, b: true }, "總碳數", "23C", "24C"],
            [null, "C₁₇ 支鏈", "α,β 不飽和雙鍵五元內酯環\n（α,β-Unsaturated 5-membered lactone ring）", "兩個不飽和鍵六元內酯環\n（Double unsaturated 6-membered lactone ring）"],
            [{ t: "來源", cs: 2, b: true }, "紫花毛地黃（Digitalis purpurea）\n長葉毛地黃（Digitalis lanata）", "蟾蜍（Toad cake）"]
          ] },
        points: [
          "配糖體（Glycosides）＝苷元（Genins）＝醣基（Glycone）＋非醣基（{{Aglycone|名詞|Glycone/Genins/Lactone}}，又稱苷基）",
          "A/B/C/D 環的連接方式為 {{cis-trans-cis|結構|trans-trans-trans/cis-cis-cis/trans-cis-trans}}",
          "C-3 上接{{醣基|結構|OH 基/非醣基/甲基}}、C-14 上接 {{OH 基|結構|醣基/非醣基/甲基}}、C-17 上接非醣基（lactone ring），皆以 {{β 型|結構|α 型/γ 型/δ 型}}式連接[★國考]",
          "Cardenolide 總碳數 {{23C|數值|24C/21C/27C}}，C₁₇ 支鏈為{{五元內酯環|結構|六元內酯環/七元內酯環/四元內酯環}}；Bufadienolide 總碳數 24C，C₁₇ 支鏈為六元內酯環"
        ] },
      { title: "作用機制及副作用", group: "Cardiac Glycosides", source: SRC3 + " p.18",
        text: "強心配醣體會抑制細胞膜上 {{Na⁺/K⁺-ATPase|標的|Ca²⁺-ATPase/H⁺/K⁺-ATPase/Na⁺-Ca²⁺ exchanger}} 的作用[★國考]，使胞內 [Na⁺]↑、[K⁺]↓，胞內激增的 [Na⁺] 會導致 Na⁺-Ca²⁺ 離子通道交換的驅動力下降，使胞內 [Ca²⁺] 顯著提升。細胞內多的 Ca²⁺ 會和 {{Troponin|標的|Tropomyosin/Myosin/Calmodulin}} 結合，使肌動蛋白上的橫橋結合位裸露，進入橫橋週期，增強心肌收縮力。",
        points: [
          "副作用：低血鉀（Hypokalaemia）：因此併用 Thiazides 利尿劑與礦物性皮質類固醇（Mineralocorticoid）時，會增加{{毛地黃|生藥中文名|甘草/蟾蜍/大黃}}（Digitalis）的毒性",
          "副作用：高血鈣（Hypercalcemia）",
          "副作用：低血鎂（Hypomagnesemia）"
        ] },
      { title: "毛地黃（Digitalis purpurea）的成分[★國考]", group: "Cardiac Glycosides", source: SRC3 + " p.19",
        table: {
          head: ["成分[★國考]", "", "醣基", "非醣基（苷基）", "共同產物"],
          rows: [
            ["Purpurea glycosides A", { t: "水\n解", rs: 3 }, "★Digitoxin", "★Digitoxigenin", { t: "3 Digitoxose\n+\n1 Glucose", rs: 3 }],
            ["Purpurea glycosides B", null, "Gitoxin", "Gitoxigenin", null],
            ["Gluco-gitaloxin\n（Purpurea glycosides C）", null, "Gitaloxin", "Gitaloxigenin", null]
          ],
          note: "✧ Digitoxose 結構：2,6-Dideoxy-β-D-ribo-hexo-pyranose[★國考]" } },
      { title: "長葉毛地黃（Digitalis lanata）的成分[★國考]", group: "Cardiac Glycosides", source: SRC3 + " p.19",
        table: {
          head: ["成分[★國考]", "", "醣基", "★非醣基（苷基）", "共同產物"],
          rows: [
            ["Lanatoside A", { t: "水\n解", rs: 5 }, "★Digitoxin", "Digitoxigenin", { t: "3 Digitoxose\n+\n1 Glucose\n+\n1 Acetyldigoxin", rs: 5 }],
            ["Lanatoside B", null, "Gitoxin", "Gitoxigenin", null],
            ["Lanatoside C", null, "★Digoxin", "Digoxigenin", null],
            ["Lanatoside D", null, "Diginatin", "Diginatigenin", null],
            ["Lanatoside E", null, "Gitaloxin", "Gitaloxigenin", null]
          ],
          note: "✧ Lanatoside C 去乙醯基得 Deacetyllanatoside，再去醣基得★Digoxin（主要來源）" } }
    ] },
    { id: "saponin", title: "皂苷類配醣體（Saponin Glycoside）", items: [
      { title: "合成與代謝", group: ["Triterpenoid saponins", "Steroid saponins"], source: SRC3 + " p.21",
        diagram: "assets/knowledge/saponin-pathway.svg",
        points: ["合成途徑：{{Acetate-Mevalonate pathway|反應|Acetate-Malonate pathway/Shikimic acid pathway/Mannich-type condensation}}[★國考]"] },
      { title: "結構與特性", group: ["Triterpenoid saponins", "Steroid saponins"], source: SRC3 + " p.21",
        points: [
          "結構：Saponin 由親水性醣基和親脂性非醣基所組成，醣基接於非醣基的 {{C-3|結構|C-14/C-17/C-6}} 上",
          "Saponin Glycosides 水解後所得到的非醣基稱為 {{Sapogenin|名詞|Genins/Aglycone/Glycone}}，可分為：[★國考]",
          "中性皂苷（Neutral saponins）：{{固醇類|分類|三萜類/蒽類/黃酮類}}（Steroid），ex：Diogenin",
          "酸性皂苷（Acid saponins）：{{三萜類|分類|固醇類/蒽類/黃酮類}}（Triterpenoid），ex：β-Amyrin（在 β 位有兩個甲基取代）",
          "特性：Saponin Glycosides 廣泛分佈於高等植物中",
          "特性：具苦味（Bitter）、辛辣味（Acrid taste）",
          "特性：★對{{黏膜具刺激性|性質|具溶血作用/易產生結晶/降低表面張力}}，可作為催噴嚏劑（Sternutatory）及黏膜刺激劑（Mucous membrane）",
          "特性：具{{溶血作用|性質|黏膜刺激性/界面活性劑效果/易產生結晶}}，可破壞紅血球，對冷血動物特別具毒性，可作為魚毒（Fish poisons）",
          "特性：具界面活性劑效果，降低表面張力，與水振搖會產生持續性泡沫，並形成膠體溶液，可作為{{清潔劑|用途|魚毒/催噴嚏劑/血漿增多劑}}[★國考]",
          "特性：經{{乙醯化|反應|水解/氧化/甲基化}}（Acetylation）作用，易產生結晶（Crystallizable）化合物，可利用此方法純化[★國考]"
        ] }
    ] },
    { id: "anthraquinone", title: "蒽醌類配醣體（Anthraquinone Glycosides）", items: [
      { title: "合成與代謝", group: "Anthraquinone Glycosides", source: SRC3 + " p.23",
        points: [
          "合成途徑：{{Acetate-Malonate pathway|反應|Acetate-Mevalonate pathway/Shikimic acid pathway/Mannich-type condensation}}",
          "第一個中間產物：由 {{8|數值|6/10/4}} 個頭尾相連（head-to-tail）的醋酸鹽單元（Acetate unit）所構成的 {{Poly-β-Ketomethylene acid|中間產物|Mevalonate/squalene/Anthranol}}",
          "接著經分子內縮合，形成各種的氧化芳香化合物，包括蒽酚（Anthranols）和蒽酮（Anthrones）等中間產物"
        ] },
      { title: "結構與特性", group: "Anthraquinone Glycosides", source: SRC3 + " p.23",
        diagram: "assets/knowledge/anthraquinone-structures.svg",
        points: [
          "此類配醣體皆含有蒽類（Anthracene）的非醣基，因此可以當成★{{峻瀉劑|用途|止瀉劑/強心劑/祛痰劑}}（Cathartics）[★國考]",
          "蒽醌類（Anthraquinone），又稱 Dioxoanthracene 或 Anthracenedione",
          "★第 3 碳上甲基之氧化生合成[★國考]：R₂ 由 CH₃（大黃酚、大黃素）→ CH₂OH（蘆薈大黃素）→ {{COOH|結構|CHO/CH₃/OH}}（大黃酸 {{Rhein|成分|Emodin/Chrysophanol/Aloe-emodin}}），越往下越氧化"
        ] }
    ] }
  ]
};
