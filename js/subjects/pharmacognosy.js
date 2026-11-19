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
/* 小白標先修：同一類的格子要先答完小白標（地圖上的小分類名牌）的題目才能挑戰（js/app.js 的 groupGate） */
PI.GROUP_GATE = true;
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
PI.CHAPTERS.push({ id: 2, name: "醣類、配醣體", cat: "pharmacognosy", estimate: 55, unitType: "drug", note: "講義：醣類、配醣體（p.14–29）。依講義的印刷字。" });
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
    uses: ["緩瀉劑，但{{不能口服|性質}}，因為柯亞素的黏膜刺激性強", "★唯一不口服 Anthraquinone!!"] },
  /* ===== 氰苷配糖體 Cyanogenic Glycosides（p.27）===== */
  { id: "bitter-almond", chapter: 2, name: "Bitter Almond", short: "Almond", type: "drug", group: "Cyanogenic Glycosides", source: SRC3 + " p.27",
    names: ["中文：{{苦杏仁|生藥中文名}}", "別名：Amygdala amara"],
    origin: ["{{Prunus communis|學名}}"], family: ["{{薔薇科|科別}} Rosaceae"], part: ["{{乾燥成熟核仁|部位}}"],
    constituents: ["{{Amygdalin|成分}}，可分解出具毒性的 {{Cyanide|成分}}"], uses: ["{{矯味劑、止咳劑|用途}}"] },
  { id: "apricot-pits", chapter: 2, name: "Apricot Pits", short: "Apricot", type: "drug", group: "Cyanogenic Glycosides", source: SRC3 + " p.27",
    names: ["中文：{{杏核|生藥中文名}}"],
    origin: ["{{Prunus armeniaca|學名}}"], family: ["{{薔薇科|科別}} Rosaceae"], part: ["{{乾燥成熟核仁|部位}}"],
    constituents: ["{{Amygdalin|成分}}，可分解出具毒性的 Cyanide"], uses: ["{{矯味劑、止咳劑|用途}}"] },
  { id: "wild-cherry", chapter: 2, name: "Wild Cherry", type: "drug", group: "Cyanogenic Glycosides", source: SRC3 + " p.27",
    names: ["中文：{{野櫻皮|生藥中文名}}", "別名：Prunus virginiana、Wild black cherry tree"],
    origin: ["{{Prunus serotina|學名}}"], family: ["{{薔薇科|科別}} Rosaceae"], part: ["{{乾燥莖的樹皮|部位}}"],
    constituents: ["{{Prunasin|成分}}〔(R) 或 (D)-Mandelonitrile glucoside〕，屬 {{O-glycoside|結構}}"],
    uses: ["糖漿矯味劑", "★{{鎮定性祛痰藥|用途}}（Sedative expectorant）"] },

  /* ===== 異硫氰酸苷 Isothiocyanate glycosides（Glucosinolates，含 SCN⁻）（p.27）===== */
  { id: "black-mustard", chapter: 2, name: "Black Mustard", short: "B. Mustard", type: "drug", group: "Isothiocyanate glycosides", source: SRC3 + " p.27",
    names: ["中文：{{黑芥子|生藥中文名}}", "別名：Sinapis nigra、brown mustard"],
    origin: ["英國：{{Brassica nigra|學名}}", "印度：B. juncea"], family: ["{{十字花科|科別}} Cruciferae（Brassicaceae）"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["主成份 {{Sinigrin|成分}}（Potassium myronate）：屬 {{S-glycoside|結構}}，水解產生 {{Allyl isothiocyanate|成分}}（揮發芥子油）[★國考]、Glucose、KHSO₄",
      "{{Myrosinase|成分}}（芥子酶）"],
    uses: ["主要為{{調味劑|用途}}，類似辣椒", "局部刺激劑，可用作{{催吐劑|用途}}", "皮膚外用為發紅劑、發泡劑"] },
  { id: "white-mustard", chapter: 2, name: "White Mustard", short: "W. Mustard", type: "drug", group: "Isothiocyanate glycosides", source: SRC3 + " p.27",
    names: ["中文：{{白芥子|生藥中文名}}", "別名：Sinapis alba"],
    origin: ["{{Brassica alba|學名}}"], family: ["{{十字花科|科別}} Cruciferae（Brassicaceae）"], part: ["{{乾燥成熟種子|部位}}"],
    constituents: ["主成份 {{Sinalbin|成分}}（Sinapine glucosinalbate）：屬 S-glycoside，水解產生 {{p-Hydroxybenzyl isothiocyanate|成分}}（{{辛辣無臭味，揮發性較低|性質}}）、glucose、Sinapine acid sulphate",
      "Myrosinase（芥子酶）"],
    uses: ["主要為{{調味劑|用途}}，類似辣椒", "局部刺激劑，可用作催吐劑", "皮膚外用為{{發紅劑、發泡劑|用途}}"] },

  /* ===== 其他有機硫化物 Other Organosulfur Drugs（p.27）===== */
  { id: "garlic", chapter: 2, name: "Garlic", type: "drug", group: "Organosulfur Drugs", source: SRC3 + " p.27",
    names: ["中文：{{大蒜|生藥中文名}}"],
    origin: ["{{Allium sativum|學名}}"], family: ["{{百合科|科別}} Liliaceae"], part: ["{{球莖|部位}}"],
    constituents: ["主成份 {{Alliin|成分}}：{{無味且含硫的氨基酸衍生物|性質}}，接觸氧氣後 {{Alliinase|成分}} 被活化，分解為 Allicin",
      "大蒜素（{{Allicin|成分}}，Diallyldisulfide-S-oxide，Diallylthiosulfinate[★國考]）：{{蒜味來源|性質}}（含 S 原子）[★國考]",
      "衍生物 (E)-Ajoene 與 {{(Z)-Ajoene|成分}} 能抑制血小板上的纖維蛋白受體，後者{{抗血栓|作用}}效果較好"],
    uses: ["抗菌、降血脂、{{抑制血小板凝集|作用}}、增進血纖維溶解作用[★國考]"] },

  /* ===== 醇類配糖體 Alcohol Glycosides（p.28）===== */
  { id: "salicin", chapter: 2, name: "Salicin", type: "drug", group: "Alcohol Glycosides", source: SRC3 + " p.28",
    names: ["中文：{{水楊素|生藥中文名}}"],
    origin: ["{{Salix purpurea|學名}}", "S. fragilis"], family: ["{{楊柳科|科別}} Salicaceae"], part: ["{{樹皮|部位}}"],
    constituents: ["{{Salicin|成分}}：水解得到 D-glucose 和 {{Saligenin|成分}}（Salicyl alcohol）"],
    uses: ["抗風濕", "{{解熱鎮痛|用途}}"],
    notes: ["Salicin 在人體內代謝生成 {{Salicylic acid|成分}}，具類似 {{Aspirin|藥物}} 的作用"] },

  /* ===== 醛類配糖體 Aldehyde glycosides（p.28）===== */
  { id: "vanilla", chapter: 2, name: "Vanilla", type: "drug", group: "Aldehyde glycosides", source: SRC3 + " p.28",
    names: ["中文：{{香莢蘭|生藥中文名}}", "別名：Vanilla bean"],
    origin: ["墨西哥（品質最佳）：{{Vanilla planifolia|學名}}", "大溪地：V. tahitensis"], family: ["{{蘭科|科別}} Orchidaceae"],
    part: ["經發酵、發育完全但{{未成熟的果實|部位}}"],
    constituents: ["{{Glucovanillin|成分}}（Avenein）：經發酵水解（★{{Curing process|反應}}）形成 Glucose + {{Vanillin|成分}}[★國考]",
      "★{{Glucovanillic alcohol|成分}}：水解形成 Glucose + Vanillic alcohol，再氧化成 Vanillic aldehyde（Vanillin）（香味來源）"],
    uses: ["{{食品香料|用途}}", "藥品矯味劑"] },

  /* ===== 酚類配糖體 Phenol glycosides（p.29）===== */
  { id: "methyl-salicylate", chapter: 2, name: "Methyl salicylate", short: "Methyl sal…", type: "drug", group: "Phenol glycosides", source: SRC3 + " p.29",
    names: ["中文：{{甲基水楊酸|生藥中文名}}", "別名：綠油精、冬綠油、Winter green oil、Sweet birch oil、Betula oil、Teaberry oil"],
    origin: ["{{Salix purpurea|學名}}", "S. fragilis"], family: ["{{楊柳科|科別}} Salicaceae"], part: ["{{樹皮|部位}}"],
    constituents: ["甲基水楊酸（Methyl salicylate）：2-Hydroxybenzoic acid methyl ester（C₈H₈O₃），可由{{冬綠苷|成分}}（Gaultherin）經酵素水解而得"],
    uses: ["芳香、防腐、殺菌", "{{止癢|用途}}、治療蟲子咬傷（消炎、解熱鎮痛）"] },
  { id: "arbutin", chapter: 2, name: "Arbutin", type: "drug", group: "Phenol glycosides", source: SRC3 + " p.29",
    names: ["中文：{{熊果素|生藥中文名}}", "別名：Ursin、Arbutoside、Uvasol、Uva ursi、Bearberry leaves、Busserole"],
    origin: ["{{Bergenia crassifolia|學名}}：{{虎耳草科|科別}} Saxifragaceae", "{{Uva ursi|學名}} 熊果葉（主要）：{{杜鵑花科|科別}} Ericaceae"],
    family: ["虎耳草科 Saxifragaceae", "杜鵑花科 Ericaceae"], part: ["{{乾燥葉|部位}}"],
    constituents: ["熊果葉苷（{{Arbutin|成分}}）：白色針狀結晶，能迅速溶於水和乙醇中，可被{{稀酸|性質}}或苦杏仁酶（{{Emulsin|成分}}）水解，形成對苯二酚（{{Hydroquinone|成分}}）和 D-glucose"],
    uses: ["{{防腐抗菌劑|用途}}（antiseptic）", "{{利尿劑|用途}}", "{{收斂劑|用途}}（astringent）：用於清洗傷口，防止局部感染"] },
  { id: "st-johns-wort", chapter: 2, name: "St. John's Wort", short: "St. John's", type: "drug", group: "Phenol glycosides", source: SRC3 + " p.29",
    names: ["中文：{{聖約翰草|生藥中文名}}", "別名：金絲桃、貫葉連翹"],
    origin: ["{{Hypericum perforatum|學名}}"], family: ["{{金絲桃科|科別}} Hypericaceae"], part: ["{{乾燥地上部分|部位}}"],
    constituents: ["金絲桃素（{{Hypericin|成分}}）"],
    uses: ["治療{{輕度至中度憂鬱症|疾病}}，被稱為大自然的百憂解（{{Nature Prozac|名詞}}）"] },

  /* ===== Furanocoumarin Glycoside（p.29）===== */
  { id: "cantharidin-beetles", chapter: 2, name: "Cantharidin Beetles", short: "Cantharides", type: "drug", group: "Furanocoumarin Glycoside", source: SRC3 + " p.29",
    names: ["中文：{{斑蝥甲蟲|生藥中文名}}", "別名：Spanish flies、Russian flies、Blistering flies"],
    origin: ["{{Cantharis vesicatoria|學名}}"], family: ["{{地膽科|科別}} Meloidae"], part: ["{{乾燥甲蟲|部位}}"],
    constituents: ["斑蝥素（{{Cantharidin|成分}}）"],
    uses: ["{{起泡劑、發紅劑|用途}}", "皮膚外用，{{刺激頭髮生長|用途}}", "用於除去特定類型的疣", "斑蝥甲蟲現多被 {{Mylabris|生藥}} 取代"] },
  { id: "mylabris", chapter: 2, name: "Mylabris", type: "drug", group: "Furanocoumarin Glycoside", source: SRC3 + " p.29",
    names: ["中文：{{斑蝥|生藥中文名}}"],
    origin: ["{{Mylabris cichorii|學名}}", "Mylabris pustulata"], family: ["{{地膽科|科別}} Meloidae"], part: ["{{乾燥甲蟲|部位}}"],
    constituents: ["斑蝥素（{{Cantharidin|成分}}）"],
    uses: ["起泡劑、發紅劑", "皮膚外用，刺激頭髮生長", "用於除去特定類型的疣", "斑蝥甲蟲現多被 Mylabris 取代"] },
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
          "蒽醌類（Anthraquinone），又稱 Dioxoanthracene 或 Anthracenedione", "代表性蒽醌的 R₁：大黃酚（Chrysophanol）、蘆薈大黃素（Aloe-emodin）、大黃酸（Rhein）為 {{H|結構|OH/CH₃/COOH}}；大黃素（Emodin）為 {{OH|結構|H/CH₃/COOH}}",
          "★第 3 碳上甲基之氧化生合成[★國考]：R₂ 由 CH₃（大黃酚、大黃素）→ CH₂OH（蘆薈大黃素）→ {{COOH|結構|CHO/CH₃/OH}}（大黃酸 {{Rhein|成分|Emodin/Chrysophanol/Aloe-emodin}}），越往下越氧化"
        ] }
    ] },
    { id: "cyanogenic", title: "氰苷配糖體（Cyanogenic Glycoside）", items: [
      { title: "合成與代謝", group: "Cyanogenic Glycosides", source: SRC3 + " p.26",
        points: [
          "氰苷配醣體為 {{Mandelonitrile|成分|Benzaldehyde/Amygdalin/Phenylalanine}}（Benzaldehyde-Cyanohydrin）的衍生物，含有 {{CN⁻|結構|SCN⁻/COOH/OH}}，依化學結構可分為下表",
          "合成途徑：{{Shikimate pathway|反應|Acetate-Mevalonate pathway/Acetate-Malonate pathway/Mannich-type condensation}} → Phenylalanine（Amino acid）→ Mandelonitrile → Prunasin"
        ],
        table: {
          head: ["結構", "衍生之配糖體", "來源"],
          rows: [
            [{ t: "D-mandelonitrile 或 R-mandelonitrile", rs: 2, b: true }, "苦杏仁苷（Amygdalin）", "1. 分布最廣，亦被歸類為醛苷（Aldehyde glycoside）　2. 大量存在於苦杏仁、杏核仁、櫻桃、桃子、梅、李等薔薇科植物種子中"],
            [null, "櫻芽苷（Prunasin）", "來自野生黑櫻桃（Prunus serotina）"],
            [{ t: "L-mandelonitrile 或 S-mandelonitrile", b: true }, "接骨木苷（Sambunigrin）", "來自接骨木花（Sambucus nigra）"]
          ]
        } },
      { title: "結構與特性：產氰現象（Cyanogenesis）[國考必考★★★]", group: "Cyanogenic Glycosides", source: SRC3 + " p.26",
        points: [
          "反應共有三個步驟（特別注意酵素及醣基的變化以及原始物、反應物、產物之間的關係）",
          "Step 1：Amygdalin（Mandelonitrile-β-gentiobioside）被 {{Amygdalase|酵素|Prunase/Hydroxynitrilase/Myrosinase}}（Amygdalin hydrolase）水解，生成 D-glucose 和 Prunasin（Mandelonitrile-β-glucoside），即 Amygdalin 含有{{兩種糖|結構|一種糖/三種糖/四種糖}}",
          "Step 2：Prunasin 被 {{Prunase|酵素|Amygdalase/Hydroxynitrilase/Emulsin}}（Prunasin hydrolase）水解，生成 D-glucose 和 (R)-Mandelonitrile（Benzaldehyde cyanohydrin）；此步驟切斷 glycone 與 aglycone 連結",
          "Step 3：(R)-Mandelonitrile 被 {{Hydroxynitrilase|酵素|Amygdalase/Prunase/Myrosinase}}（Mandelonitrile lyase）分解，生成 {{HCN|成分|CO₂/NH₃/H₂S}} 和 Benzaldehyde（有香味）",
          "苦杏仁酶（{{Emulsin|酵素|Myrosinase/Alliinase/Rhamnase}}，β-glucosidases）由 Amygdalase 和 Prunase 所組成",
          "配醣體經 Amygdalase（Amygdalin hydrolase）、Prunase（Prunasin hydrolase）、Myrosin（Myrosinase）水解後可得葡萄糖，但 {{Rhamnase|酵素|Emulsin/Prunase/Amygdalase}} 除外"
        ],
        table: {
          head: ["步驟", "★酵素", "反應物", "產物"],
          rows: [
            [{ t: "Step 1", b: true }, "Amygdalase", "Amygdalin（C₆H₁₀O₅–O–C₆H₁₁O₅，Gentibiose）+ H₂O", "Prunasin（Mandelonitrile Glucoside）+ C₆H₁₂O₆（Glucose）"],
            [{ t: "Step 2", b: true }, "Prunase", "Prunasin + H₂O", "Mandelonitrile（Benzaldehyde Cyanohydrin）+ C₆H₁₂O₆"],
            [{ t: "Step 3", b: true }, "Hydroxynitrilase", "Mandelonitrile", "HCN（Hydrocyanic Acid）+ Benzaldehyde"]
          ]
        } }
    ] },
    { id: "aldehyde", title: "醛類配糖體（Aldehyde glycosides）", items: [
      { title: "合成與代謝", group: "Aldehyde glycosides", source: SRC3 + " p.28",
        points: [
          "合成途徑 1：{{Glucovanillin|成分|Glucovanillic alcohol/Coniferin/Salicin}} 經水解 → 得到 Glucose + Vanillin（香草醛）",
          "合成途徑 2：Glucovanillic alcohol 經水解 → 得到 Glucose + Vanillic alcohol；Vanillic alcohol 再經{{氧化|反應|還原/水解/乙醯化}} → 得到 Vanillic aldehyde（Vanillin），為香味來源",
          "Vanillin 結構：4-Hydroxy-3-methoxybenzaldehyde（苯環上 1 號位 CHO、3 號位 OCH₃、4 號位 OH）"
        ],
        table: {
          head: ["", "Glucovanillin", "Vanillin"],
          rows: [
            [{ t: "別名", b: true }, "Vanilloside、Avenein、Vanillin-D-glucoside", "4-Hydroxy-3-methoxybenzaldehyde、Methylprotocatechuic aldehyde"],
            [{ t: "來源／製備", b: true }, "Coniferin 經 Chromium-6-oxide（CrO₃）氧化而得", "天然：Vanilla bean 經 Curing process（醃晒）[★國考★] 乾燥而成；合成：木質素（Lignin）為市售 Vanillin 主要來源"],
            [{ t: "性質", b: true }, "1. 針狀，具苦味　2. 親水性物質，可快速溶於熱水及乙醇中，幾乎不溶於醚類", "1. 白中帶黃的針狀結晶物　2. 易溶於酒精、氯仿及醚類，微溶於水及甘油"]
          ]
        } }
    ] }
  ]
};

/* ================= 第 3 章：類苯基丙烷（講義 p.30–36，只用印刷字） =================
   放在生藥島（和第 1 章同一座島）；小分類照講義的標題：簡單類苯基丙烷、木酚素、黃酮類、單寧。
   講義 p.35 最下面「單寧酸（Tannic acid）」那一列照補掃的頁面收錄（科別、部位欄講義畫箭頭，表示同上一列）。 */
PI.CHAPTERS.push({ id: 3, name: "類苯基丙烷", cat: "pharmacognosy", estimate: 14, unitType: "drug", note: "講義：類苯基丙烷（p.30–36）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(3);

const SRC4 = "類苯基丙烷講義";
PI.UNITS.push(
  /* ===== 簡單類苯基丙烷 Simple phenylpropanoids（p.31–32）===== */
  { id: "capsicum", chapter: 3, name: "Capsicum", type: "drug", group: "Simple phenylpropanoids", source: SRC4 + " p.31",
    names: ["中文：{{辣椒|生藥中文名}}", "英文：Cayenne pepper"],
    origin: ["{{Capsicum frutescens|學名}}", "C. annuum L. var. conoides", "C. annuum var. Longum"],
    family: ["{{茄科|科別}} Solanaceae"], part: ["{{乾燥成熟果實|部位}}"],
    constituents: ["{{Capsaicin|成分}}", "0.2% 的{{抗壞血酸|成分}}（ascorbic acid，即 Vit C）", "脂肪油、1.5% 的揮發油", "類胡蘿蔔素（{{Carotenoids|成分}}）"],
    uses: ["★{{局部塗抹止痛|用途}}：耗盡 {{P 物質|標的}}，緩解 RA、骨關節炎、泡疹等疼痛", "{{抗刺激劑|用途}}：亦稱引赤劑（counterirritant）", "{{調味品|用途}}（condiment）"] },
  { id: "coumarin", chapter: 3, name: "Coumarin", type: "drug", group: "Simple phenylpropanoids", source: SRC4 + " p.31",
    names: ["中文：{{香豆素|生藥中文名}}", "別名：Tonka beans"],
    origin: ["{{Dipteryx odorata|學名}}", "Dipteryx oppositifolia"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{種子|部位}}"],
    constituents: ["{{Coumarin|成分}}：由 {{o-hydroxycinnamic acid|成分}} 進行 ortho hydroxylation 而得的衍生物，屬{{內酯類|結構}}★"],
    uses: ["早期為{{矯味劑|用途}}，因 DDI 被 FDA 禁", "Coumarin 之衍生物 {{Scopoletin|成分}} 具有{{抗痙攣|作用}}活性", "衍生物為{{間接型抗凝血劑|用途}}，可用於預防或治療靜脈血栓和肺栓塞"] },
  { id: "dicumarol", chapter: 3, name: "Dicumarol", type: "drug", group: "Simple phenylpropanoids", source: SRC4 + " p.31",
    names: ["中文：{{雙香豆素|生藥中文名}}", "別名：Bishydroxycoumarin"],
    origin: ["{{Melilotus officinalis|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["從{{發酵不全之葉或花芽|部位}}分離"],
    constituents: ["{{Coumarin|成分}}"],
    uses: ["{{抗凝血劑|用途}}（干擾 {{Vit.K|標的}} 作用），常與其他藥物產生交互作用"] },
  { id: "psoralens", chapter: 3, name: "Psoralens", type: "drug", group: "Simple phenylpropanoids", generation: "講義標示 ★", source: SRC4 + " p.31",
    names: ["中文：★{{補骨脂素|生藥中文名}}"],
    origin: ["{{Ammi majus Linne|學名}}（來源廣泛，主要從繖型 & 芸香科植物得到）", "※補骨脂 {{Psoralea corylifolia|學名}} 屬{{豆科|科別}}植物（Fabaceae）"],
    family: ["{{繖型科|科別}} Apiaceae", "{{芸香科|科別}} Rutaceae"], part: ["★{{乾燥成熟種子|部位}}"],
    constituents: ["{{Furocoumarins|成分}}"],
    uses: ["具{{光敏感性|性質}}（photosensitizing）", "製成 {{Methoxsalen|藥物}} 治療{{牛皮癬|疾病}}（★促進自發性白斑症（idiopathic vitiligo, leukoderma）的{{再色素化|作用}}來緩解症狀，治療時需照 {{UV 光|名詞}}以復色，有{{致癌|副作用}}風險）", "製成 {{Trioxsalen|藥物}} 治療{{白斑症|疾病}}"] },
  { id: "echinacea", chapter: 3, name: "Echinacea", type: "drug", group: "Simple phenylpropanoids", source: SRC4 + " p.32",
    names: ["中文：{{紫錐花|生藥中文名}}", "別名：Cone flower、★purple cone flower"],
    origin: ["★{{Echinacea angustifolia|學名}}（美）", "Echinacea pallida（美）", "{{Echinacea purpurea|學名}}（歐）"],
    family: ["{{菊科|科別}} Asteraceae"], part: ["（美）{{乾燥根／根莖|部位}}（rhizome）", "（歐）{{開花全草|部位}}"],
    constituents: ["（高分子量聚醣體）{{Heteroxylan|成分}}：可活化吞噬細胞，增加吞噬作用", "（高分子量聚醣體）{{Arabinogalactan|成分}}：促 {{TNF|標的}} 釋放", "★{{chicoric acid|成分}}：亦可促進吞噬"],
    uses: ["{{免疫刺激劑|用途}}，但本身不能殺菌", "治療各種傳染病和感染", "於惡性情況下作為緩和劑，能{{治療創傷|用途}}，使傷口癒合"] },
  { id: "khellin", chapter: 3, name: "Khellin", type: "drug", group: "Simple phenylpropanoids", source: SRC4 + " p.32",
    names: ["中文：{{可林素|生藥中文名}}"],
    origin: ["{{Ammi visnage Lam|學名}}"], family: ["{{繖型科|科別}} Apiaceae"], part: ["{{果實|部位}}"],
    constituents: ["屬 {{furochromone|結構}} 類的一種"],
    uses: ["治{{輸尿管痙攣|疾病}}（urethral spasm）和腎絞痛（renal colic）", "強效{{冠狀動脈血管擴張劑|用途}}和支氣管擴張劑",
      "抗過敏藥物 {{cromolyn sodium|藥物}} 的原型藥，為{{肥大細胞穩定劑|作用}}，也可視為抗組織胺"] },

  /* ===== 木酚素 Lignans 或新木酚素 Neolignans（p.33）===== */
  { id: "podophyllum", chapter: 3, name: "Podophyllum", type: "drug", group: "Lignans", source: SRC4 + " p.33",
    names: ["中文：{{鬼臼|生藥中文名}}", "別名：★mayapple 或美國曼德拉草（American mandrake）"],
    origin: ["{{Podophyllum peltatum|學名}}"], family: ["{{小蘗科|科別}} Berberidaceae"], part: ["{{乾燥根莖及根部|部位}}"],
    constituents: ["3.5–6% 樹脂（具活性為木酚素）：★{{Podophyllotoxin|成分}}（20%），lactone 環為{{反式|結構}}才有活性；α／β-{{peltatin|成分}}",
      "（大量）木酚配糖體：因{{水溶性高|性質}}，在製備樹脂時大部分會流失"],
    uses: ["★{{抗癌藥|用途}}：抗{{有絲分裂|作用}}", "強力{{瀉藥|用途}}（含 peltatin）", "{{腐蝕劑|用途}}（caustic）：處理皮膚或器官上的瘡疣", "利尿通便劑"],
    notes: ["鬼臼可用酒精萃取出{{鬼臼樹脂|名詞}}：當溫度 > {{25℃|數值}}或照光時，樹脂顏色會變深，對眼睛和黏膜有強烈刺激"] },
  { id: "indian-podophyllum", chapter: 3, name: "Indian podophyllum", short: "Indian podo…", type: "drug", group: "Lignans", source: SRC4 + " p.33",
    names: ["中文：{{印度鬼臼|生藥中文名}}"],
    origin: ["{{Podophyllum emodi|學名}}"], family: ["{{小蘗科|科別}} Berberidaceae"], part: ["{{根莖|部位}}"],
    constituents: ["Podophyllotoxin 的量為鬼臼{{兩倍|數值}}"],
    uses: ["★抗癌藥：抗有絲分裂", "強力瀉藥（含 peltatin）", "腐蝕劑（caustic）：處理皮膚或器官上的瘡疣", "利尿通便劑"] },

  /* ===== 黃酮類 Flavonoids（p.34）===== */
  { id: "rutin", chapter: 3, name: "Rutin", type: "drug", group: "Flavonoids", generation: "講義標示 ★", source: SRC4 + " p.34",
    names: ["中文：{{芸香素|生藥中文名}}"],
    origin: ["可由多種植物中得到，特別是{{柑橘類|名詞}}植物，因此又屬於柑橘類黃酮"],
    constituents: ["槲皮酐（{{quercetin|成分}}）", "含（★{{rutinose|成分}}），屬於{{雙醣配體|結構}}，含鼠李醣（rhamno）和葡萄醣（glucose）；故又稱：6-O-α-L-rhamnosyl-D-glucose",
      "※Rutin 和橙皮苷（{{hesperidin|成分}}）合稱為★{{Vitamin P|名詞}} 或滲透因子（permeability factor）"],
    uses: ["增強{{微血管的韌性|作用}}，抑制微血管出血", "Vit. P 宣稱能{{緩解感冒|用途}}，但尚無確切證據", "{{高血壓及輻射損傷|疾病}}的營養補充劑"] },
  { id: "milk-thistle", chapter: 3, name: "Milk Thistle", type: "drug", group: "Flavonoids", generation: "講義標示 ★", source: SRC4 + " p.34",
    names: ["中文：★{{大薊|生藥中文名}}"],
    origin: ["★{{Silybum marianum|學名}} (L.) Gaertn"], family: ["★{{菊科|科別}} Asteraceae"], part: ["{{冠毛（pappus）釋放的成熟果實|部位}}"],
    constituents: ["★乳薊素（{{Silybin|成分}}）（主要）", "乳薊素含 isosilybin、dehydrosilybin、silydianin、silychristin"],
    uses: ["促進★{{肝臟恢復|用途}}", "{{慢性肝炎與肝硬化|疾病}}（cirrhosis）的輔助療法"],
    notes: ["機轉：假扮{{天然類固醇|名詞}}，活化 {{RNA 聚合酶 I|標的}}，提升蛋白質合成"] },

  /* ===== 單寧 Tannins（p.35）===== */
  { id: "hamamelis", chapter: 3, name: "Hamamelis Leaf", short: "Hamamelis", type: "drug", group: "Tannins", source: SRC4 + " p.35",
    names: ["中文：{{北美金縷梅葉|生藥中文名}}", "別名：witch hazel leaves"],
    origin: ["★{{Hamamelis virginiana|學名}} L."], family: ["{{金縷梅科|科別}} Hamamelidaceae"], part: ["{{乾燥葉|部位}}"],
    constituents: ["單寧類（皆來自沒食子酸 gallic acid）：{{Hamamelitannin|成分}}、Second tannin", "其他類：沒食子酸、草酸鈣、揮發油、苦味成分、Hexose sugar"],
    uses: ["（可收斂、止血）", "添加於{{痔瘡|疾病}}（hemorrhoidal）藥內，緩解發炎疼痛", "{{蚊蟲叮咬|用途}}塗抹液", "治{{牙痛|用途}}"] },
  { id: "nutgall", chapter: 3, name: "Nutgall", type: "drug", group: "Tannins", source: SRC4 + " p.35",
    names: ["中文：{{五倍子／沒食子|生藥中文名}}", "別名：Chinese galls"],
    origin: ["被咬植物：{{Quercus infectoria|學名}}（或同種植物）", "昆蟲：沒食子蜂 {{Cynips tinctoria|學名}}"],
    family: ["被咬植物：{{山毛櫸科|科別}} Fagaceae"], part: ["{{蟲癭|部位}}"],
    constituents: ["50–70% 單寧酸（{{tannic acid|成分}}）★", "2–4% 沒食子酸（{{gallic acid|成分}}）：來源為 Nutgall 中的單寧酸在{{稀酸中水解|反應}}而得",
      "gallic acid 結構：（★有{{三個酚基|結構}}）3,4,5-trihydroxybenzoic acid + 1H₂O 形成結晶", "gallic acid 應用：沒食子酸鉍（{{Bismuth subgallate|藥物}}）：可用於{{除臭|用途}}",
      "其他：多酚類（ellagic acid）、starch 和 resin"],
    uses: ["工業：★{{製革和染料|用途}}", "醫療：{{收斂作用|作用}}（astringent）"] },
  { id: "chinese-japanese-gall", chapter: 3, name: "中國和日本沒食子", short: "中日沒食子", type: "drug", group: "Tannins", source: SRC4 + " p.35",
    names: ["中文：{{中國和日本沒食子|生藥中文名}}"],
    origin: ["被咬植物：{{Rhus chinensis|學名}} Mill.", "昆蟲：蚜蟲 Aphis"],
    family: ["被咬植物：{{漆樹科|科別}} Anacardiaceae"], part: ["{{蟲癭|部位}}"],
    constituents: ["50–70% 單寧酸（tannic acid）", "2–4% 沒食子酸（gallic acid）", "其他：多酚類（ellagic acid）、starch 和 resin"],
    uses: ["工業上製造{{沒食子酸|用途}}（gallic acid）的來源"] },
  { id: "tannic-acid", chapter: 3, name: "Tannic acid", type: "drug", group: "Tannins", source: SRC4 + " p.35",
    names: ["中文：{{單寧酸|生藥中文名}}", "別名：★{{gallotannic acid|生藥英文名}}、tannin"],
    origin: ["{{Nutgall|生藥}} 分離而得"],
    constituents: ["（主要）由沒食子酸（{{gallic acid|成分}}）和★{{葡萄糖|成分}}（glucose）形成的{{酯類混合物|結構}}"],
    uses: ["局部治療於{{褥瘡|疾病}}（bed sores）、輕微潰瘍", "{{鹼中毒的解毒劑|用途}}（因單寧酸會與{{鹼性物質沉澱|性質}}）"] }
);

/* 知識樹：照講義的黑色標題分段 */
PI.KNOWLEDGE.ch3 = {
  chapter: 3, title: "類苯基丙烷",
  sections: [
    { id: "phenylpropanoid", title: "壹、類苯基丙烷", items: [
      { title: "合成與代謝", source: SRC4 + " p.30",
        points: [
          "合成途徑：前驅物由★{{shikimic acid pathway|反應|Acetate-Mevalonate pathway/Acetate-Malonate pathway/Mannich-type condensation}} 合成而來",
          "前驅物：cinnamic acid、p-hydroxycinnamic acid（★{{p-coumaric acid|成分|ferulic acid/gallic acid/caffeic acid}}）",
          "精簡圖示：PEP ＋ D-Erythrose-4-phosphate → {{DAHP|中間產物|Mevalonate/Malonyl CoA/Squalene}} →（Shikimic acid pathway）→ phenylalanine → Cinnamic acid → ★p-Coumaric acid；tyrosine → ★p-Coumaric acid → 各式類苯基丙烷衍生物"
        ] },
      { title: "成分分類與特性", source: SRC4 + " p.30",
        points: [
          "分類：Simple phenylpropanoids（簡單類苯基丙烷）、Lignans（木酚素）、Neolignans（新木酚素）、Flavonoids（黃酮類）、Tannins（單寧）、Lignins（木質素）",
          "特性：在自然界中主要以{{酚醛（phenolic）|結構|醣苷/生物鹼/萜類}}的形式存在",
          "特性：結構上接著至少一個的 {{hydroxyl group（-OH）|結構|carboxyl group（-COOH）/amino group（-NH₂）/methyl group（-CH₃）}}，因此統稱為多酚類植物（plant phenolics）",
          "特性：可作為組成高分子量聚合物的單元，最主要形成的聚合物為{{木質素（Lignins）和丹寧（Tannins）|分類|黃酮類和香豆素/木酚素和新木酚素/澱粉和纖維素}}"
        ] }
    ] },
    { id: "lignan", title: "貳、木酚素（Lignans）或新木酚素（Neolignans）", items: [
      { title: "生合成", group: "Lignans", source: SRC4 + " p.32",
        points: [
          "Lignans：將 {{Ferulic acid|成分|Cinnamic acid/Gallic acid/p-Coumaric acid}} 還原成 Coniferyl alcohol，再將 Coniferyl alcohol 兩兩氧化耦合，各自以彼此 3 號碳上支鏈的 {{β-carbon|結構|α-carbon/γ-carbon/C-1}} 連接",
          "Neolignans：藉彼此間側鏈上{{不對稱|結構|對稱/反式/順式}}的 C-C 鍵結所合成",
          "木酚素為類苯丙烷的高分子量聚合物，常以★{{雙聚合體|結構|單體/三聚合體/四聚合體}}（dimeric phenylpropanoid derivatives）存在；具{{抗腫瘤與抗病毒|作用|抗凝血與抗痙攣/收斂與止血/保肝與抗氧化}}活性"
        ] },
      { title: "Etoposide & Teniposide（皆為 podophyllotoxin 的半合成產物）", group: "Lignans", source: SRC4 + " p.33",
        table: {
          head: ["", "結構", "機轉", "用途"],
          rows: [
            [{ t: "Etoposide", b: true }, "1. C 環之 C-1 上有★ethylidene glucoside（因此減低抑制微管聚集的毒性）\n2. E 環上 C-4 接 OH（與 Etoposide 引導 DNA 單鏈斷裂有關）",
              { t: "（機轉尚不明確）\n1. 作用在細胞週期：誘導 G2-phase 停止、優先殺死正值★G2 和 S 後期（late S phases）的細胞\n2. 活化核酸內切酶：間接誘導單股 DNA 的斷裂、★抑制 Topoisomerase II\n3. 藉 E 環上 4′-OH 代謝所產生的自由基阻斷癌細胞生長", rs: 2 },
              "1. 常與化療製劑併用，治療難治的睪丸癌\n2. 小細胞肺癌（第一線）"],
            [{ t: "Teniposide", b: true }, "1. Glucopyranoside 環上接 thenylidene ring（Podophyllotoxin 則是接 Me）", null,
              "小孩急性淋巴細胞性白血病（childhood acute lymphocytic leukemia, ALL）的引導療法"]
          ] },
        points: [
          "Etoposide 的 C 環之 C-1 上有★{{ethylidene glucoside|結構|thenylidene ring/lactone ring/methyl group}}，因此減低抑制微管聚集的毒性",
          "Teniposide 的 Glucopyranoside 環上接 {{thenylidene ring|結構|ethylidene glucoside/OH 基/Me}}（Podophyllotoxin 則是接 Me）",
          "優先殺死正值★{{G2 和 S 後期|名詞|G1 期/M 期/G0 期}}的細胞，並★抑制 {{Topoisomerase II|標的|Topoisomerase I/Tubulin/DHFR}}",
          "Etoposide：小細胞肺癌（第一線）、難治的{{睪丸癌|疾病|乳癌/大腸癌/肝癌}}；Teniposide：小孩{{急性淋巴細胞性白血病|疾病|慢性骨髓性白血病/霍奇金氏淋巴瘤/神經母細胞瘤}}（ALL）的引導療法"
        ] }
    ] },
    { id: "flavonoid", title: "參、黃酮類（Flavonoids）", items: [
      { title: "生合成", group: "Flavonoids", source: SRC4 + " p.34",
        points: [
          "由★p-Coumaroyl CoA 和 {{3|數值|1/2/4}} 個 Malonyl CoA 反應而得，以★{{C6-C3-C6|結構|C6-C3/C6-C1/C6-C2-C6}} 為基本骨架，具抗微生物的作用",
          "合成途徑：(1) p-Coumaroyl CoA 和 3 個 Malonyl CoA 反應，來延長原本的側鏈 → (2) 關閉 A 環，形成 {{Chalcones|結構|Flavanone/Coumarins/Lignans}} 的結構（Naringenin chalcone）→ (3) 關閉 B 環，得到 {{flavanone|結構|chalcone/flavone/anthocyanidin}}（Naringenin）"
        ] }
    ] },
    { id: "tannin", title: "肆、單寧（Tannins）", items: [
      { title: "Tannins 重要的性質與分類★", group: "Tannins", source: SRC4 + " p.36",
        points: [
          "常以★{{多酚類物質|結構|生物鹼/醣苷/萜類}}的混合物存在，無晶型",
          "水解型：構成單位 → {{gallic acid 和醣類|結構|catechin/flavan-3-ol/leucocyanidin}}；兩者結合成酯",
          "非水解型（縮合型）：構成單位 → {{catechin|結構|gallic acid/ellagic acid/glucose}}，屬 flavan-3-ol 或 flavan-3,4-diol，如 leucocyanidin；檳榔、★綠茶、葡萄籽富含",
          "非水解型與熱酸反應會產生花青素單體（anthocyanidin）；加入水解劑時，會發生聚合反應產生不溶於水紅色產物 {{phlobaphene|成分|anthocyanidin/ellagic acid/catechin}}",
          "易與單寧形成沉澱：★生物鹼（用於{{生物鹼中毒|用途|重金屬中毒/燒燙傷/口腔癌}}）、金屬離子、★蛋白質（可收斂、止血）、明膠",
          "特殊反應：★Fe³⁺ → {{深藍／黑綠色|顏色|深紅色/黃色/無色}}水溶性物質；鐵氰化鉀（potassium ferricyanide）／氨 → {{深紅色|顏色|深藍色/黑綠色/黃色}}",
          "特性：胃腸道疾病及皮膚擦傷可利用收斂作用，內服止瀉，外用消腫；可治療燒燙傷，形成抗菌保護膜",
          "特性：可當{{抗氧化劑|用途|抗凝血劑/利尿劑/瀉劑}}，是體內自由基清道夫",
          "（缺點）致癌性：可能引起口腔與食道癌（{{檳榔|生藥中文名|綠茶/葡萄籽/五倍子}}，富含非水解型單寧）、食道潰瘍或阻塞（茶，長期飲用造成）"
        ] }
    ] }
  ]
};

/* ================= 第 4 章：脂質（講義 p.37–43，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：飽和脂肪油、單元不飽和油脂、多元不飽和脂肪酸、脂肪、蠟。
   巴西棕櫚蠟的別名欄講義印「黃楊油」（和荷荷巴油同），看起來是誤植，沒有收錄。 */
PI.CHAPTERS.push({ id: 4, name: "脂質", cat: "pharmacognosy", estimate: 24, unitType: "drug", note: "講義：脂質（p.37–43）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(4);

const SRC5 = "脂質講義";
PI.UNITS.push(
  /* ===== 飽和脂肪油 Saturated Fixed Oil（p.38）===== */
  { id: "coconut-oil", chapter: 4, name: "Coconut oil", type: "drug", group: "Saturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{椰子油|生藥中文名}}"],
    origin: ["{{Cocos nucifera|學名}} Linne"], family: ["{{棕櫚科|科別}} Arecaceae"], part: ["{{核仁|部位}}"],
    constituents: ["主要（長鏈）：{{Lauric acids|成分}}、Myristic acids", "次要（中鏈）：{{Caprylic、Capric acids|成分}}"],
    uses: ["肥皂、洗髮精", "{{腸胃營養療法|用途}}（{{中鏈型|結構}}易吸收）", "{{Monocaprin|成分}}：{{抗愛滋|用途}}"] },
  { id: "palm-oil", chapter: 4, name: "Palm oil", type: "drug", group: "Saturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{棕櫚油|生藥中文名}}"],
    origin: ["{{Elaeis guineensis|學名}} Jacquin"], family: ["{{棕櫚科|科別}} Arecaceae"], part: ["{{中果皮|部位}}"],
    constituents: ["飽和：{{Palmitic acids|成分}} 為主", "不飽和：{{Oleic acids|成分}} 為主", "飽和：不飽和 = {{1：1|數值}}"],
    uses: ["常用的{{食用油|用途}}，僅次於大豆油", "肥皂、蠟燭"] },
  { id: "palm-kernel-oil", chapter: 4, name: "Palm kernel oil", short: "Palm kernel", type: "drug", group: "Saturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{棕櫚仁油|生藥中文名}}"],
    origin: ["{{Elaeis guineensis|學名}} Jacquin"], family: ["{{棕櫚科|科別}} Arecaceae"], part: ["{{核仁|部位}}"],
    constituents: ["飽和的 {{Palmitic acids|成分}} 較多（類似椰子油）→ 常溫為{{固態|性質}}（稱為 {{hard oil|名詞}}）"],
    uses: ["食用油、{{人造奶油|用途}}"] },

  /* ===== 單元不飽和油脂 Monounsaturated Fixed Oil：液態（p.38）===== */
  { id: "castor-oil", chapter: 4, name: "Castor oil", type: "drug", group: "Monounsaturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{蓖麻子油|生藥中文名}}"],
    origin: ["{{Ricinus communis|學名}} Linne"], family: ["{{大戟科|科別}} Euphorbiaceae"], part: ["{{成熟種子|部位}}"],
    constituents: ["種子成分：{{Ricin|成分}}（{{毒蛋白|性質}}），富含羥基脂肪酸",
      "油組成：{{Triricinoleoylglycerol|成分}}（被 {{lipase|酵素}} 水解成★{{ricinoleic acid|成分}}（有{{光學活性|性質}}）→ 致瀉）"],
    uses: ["{{刺激性瀉劑|用途}}、硬化劑", "高溫分解成{{抗黴菌劑|用途}} {{Undecyleic acid|成分}}（悠悠藥膏成分）"] },
  { id: "olive-oil", chapter: 4, name: "Olive oil", type: "drug", group: "Monounsaturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{橄欖油|生藥中文名}}", "別名：Sweet oil"],
    origin: ["{{Olea Europaea|學名}} Linne"], family: ["{{木犀科|科別}} Oleaceae"], part: ["{{成熟果實|部位}}"],
    constituents: ["主要為油酸（{{Oleic acid|成分}}）", "{{Virgin oil|名詞}}：{{冷壓法|製法}}而得"],
    uses: ["{{牙科黏著劑|用途}}", "食用油、{{輕瀉劑|用途}}", "製藥輔助劑"] },
  { id: "peanut-oil", chapter: 4, name: "Peanut oil", type: "drug", group: "Monounsaturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{花生油|生藥中文名}}", "別名：Arachis oil"],
    origin: ["{{Arachis hypogeaa|學名}} Linne"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{種子核仁|部位}}"],
    constituents: ["主要為油酸（{{Oleic acid|成分}}）（似橄欖油）", "維生素 B1（{{thiamine|成分}}）"],
    uses: ["主要做為食用油", "{{肌肉注射（IM）的溶劑|用途}}", "{{非乾性油|性質}} → 不可作油漆"] },
  { id: "rapeseed-oil", chapter: 4, name: "Rapeseed oil", type: "drug", group: "Monounsaturated Fixed Oil", source: SRC5 + " p.38",
    names: ["中文：{{油菜籽油|生藥中文名}}"],
    origin: ["{{Brassica campestris|學名}}", "Brassica napus", "Brassica juncea"], family: ["{{十字花科|科別}} Brassicaceae"], part: ["{{種子|部位}}"],
    constituents: ["富含不飽和酸，主要為油酸（Oleic acid）", "含 50% 芥酸（{{Euric acid|成分}}，22:1），有{{抗營養特性|性質}}，不適合食用",
      "芥花油（{{Canola oil|名詞}}）為改良後含{{低芥酸|性質}}的油菜籽油"],
    uses: ["芥花油為{{食用油|用途}}"] },

  /* ===== 多元不飽和脂肪酸 Polyunsaturated Fixed Oil（液態）（p.39–40）===== */
  { id: "soybean-oil", chapter: 4, name: "Soybean Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.39",
    names: ["中文：{{大豆油|生藥中文名}}（{{乾性油|性質}}）"],
    origin: ["{{Glycine soja|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{成熟種子|部位}}"],
    constituents: ["油酸（Oleic Acid）", "亞麻油酸（Linoleic Acid）", "{{尿素酶|成分}}（enzyme urease）", "{{豆脂醇|成分}}（stigmasterol）"],
    uses: ["{{卵磷脂|成分}}（lecithin）來源 → 降血脂；為兩性物質，可做{{乳化劑|用途}}", "豆脂醇（植物固醇），可合成{{固醇類荷爾蒙|用途}}"] },
  { id: "cottonseed-oil", chapter: 4, name: "Cottonseed Oil", short: "Cottonseed", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.39",
    names: ["中文：{{棉花籽油|生藥中文名}}"],
    origin: ["{{Gossypium hirsutum|學名}} or Gossypium"], family: ["{{錦葵科|科別}} Malvaceae"],
    part: ["{{種子|部位}}", "粗製呈{{紅色|顏色}}，須經過濾、脫色、★{{冷卻去除硬脂|製法}}成淡黃"],
    constituents: ["亞麻油酸（linoleic acid）", "棕櫚油酸（palmitic acid）", "油酸（oleic acid）", "棉酯酚（{{Gossypol|成分}}）→ 可用{{鹼|試劑}}移除"],
    uses: ["{{男性避孕藥|用途}}（棉酯酚具{{殺精|作用}}能力）", "IM 注射劑的溶劑"] },
  { id: "sesame-oil", chapter: 4, name: "Sesame Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.39",
    names: ["中文：{{芝麻油|生藥中文名}}", "別名：Teel Oil、Benne Oil"],
    origin: ["{{Sesamum indicum|學名}}"], family: ["{{胡麻科|科別}} Pedaliaceae"], part: ["{{種子|部位}}"],
    constituents: ["油酸（Oleic Acid）", "亞麻油酸（Linoleic Acid）", "{{Sesamolin|成分}}（未皂化木質素）",
      "{{Sesamol|成分}}：（酚類，由 Sesamolin 水解產生）★{{很安定，不酸敗|性質}}，可殺菌"],
    uses: ["食用油：營養、通便瀉下、減緩刺激、潤滑", "IM 注射劑的溶劑", "Sesamolin：★{{除蟲菊殺蟲劑|名詞}}（Pyrethrum insecticides）之{{增強劑|用途}}"] },
  { id: "almond-oil", chapter: 4, name: "Almond Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.39",
    names: ["中文：{{杏仁油|生藥中文名}}", "別名：Expressed Almond Oil、★Sweet Almond Oil"],
    origin: ["{{Prunus amygdalu|學名}}"], family: ["{{薔薇科|科別}} Rosaceae"], part: ["{{種子核仁|部位}}"],
    constituents: ["油酸（Oleic Acid）（多）", "亞麻油酸（Linoleic Acid）", "杏仁素（{{Amygdalin|成分}}）→ 水解後產生有毒的 {{Cyanide（HCN）|成分}}、苯甲醛及揮發油"],
    uses: ["{{甜（南）杏仁|名詞}}：食材、調味劑、潤膚劑、★舊約聖經曾提過", "{{苦（北）杏仁|名詞}}：杏仁素較多，毒性強，只可做藥用，{{潤肺止咳|用途}}"] },
  { id: "persic-oil", chapter: 4, name: "Persic Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.39",
    names: ["中文：{{桃仁油|生藥中文名}}", "別名：Apricot Kernel Oil（杏桃核仁油）、Peach Kernel Oil（桃子核仁油）"],
    origin: ["{{Prunus armeniaca|學名}}（杏桃核仁油的基源）", "{{Prunus persica|學名}}（桃子核仁油的基源）"],
    family: ["{{薔薇科|科別}} Rosaceae"], part: ["{{種子核仁|部位}}"],
    constituents: ["（{{似杏仁油|性質}}）油酸（Oleic Acid）、亞麻油酸（Linoleic Acid）"],
    uses: ["（似杏仁油）可做溶液的{{溶媒或賦形劑|用途}}", "中藥作用為{{活血去瘀|用途}}"] },
  { id: "corn-oil", chapter: 4, name: "Corn Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.40",
    names: ["中文：{{玉米油|生藥中文名}}"],
    origin: ["{{Zea mays|學名}}"], family: ["{{禾本科|科別}} Poaceae"], part: ["{{胚芽|部位}}（Embryos、Germs）"],
    constituents: ["亞麻油酸（linoleic acid）", "油酸（oleic acid）"],
    uses: ["食用油、營養補充品", "{{口服藥基劑|用途}}", "IM 注射劑的溶劑"] },
  { id: "safflower-oil", chapter: 4, name: "Safflower oil", short: "Safflower", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.40",
    names: ["中文：{{紅花籽油|生藥中文名}}"],
    origin: ["★{{Carthamus tinctorius|學名}}"], family: ["{{菊科|科別}} Asteraceae"], part: ["{{種子|部位}}"],
    constituents: ["亞麻油酸（linoleic acid）", "油酸（oleic acid）"],
    uses: ["{{高卡路里營養補充品|用途}}", "{{乾性油|性質}}：（碘價 > {{120|數值}}）可做{{油漆、磨光劑|用途}}"] },
  { id: "sunflower-oil", chapter: 4, name: "Sunflower Oil", short: "Sunflower", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.40",
    names: ["中文：{{向日葵油|生藥中文名}}"],
    origin: ["{{Helianthus annuus|學名}}"], family: ["{{菊科|科別}} Asteraceae"], part: ["{{種子|部位}}"],
    constituents: ["亞麻油酸（linoleic acid）", "油酸（oleic acid）"],
    uses: ["營養補充品", "{{玉米油及紅花籽油|生藥中文名}}之替代品"] },
  { id: "linseed-oil", chapter: 4, name: "Linseed Oil", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.40",
    names: ["中文：{{亞麻仁油|生藥中文名}}", "別名：Flaxseed Oil"],
    origin: ["{{Linum usitatissimum|學名}}"], family: ["{{亞麻科|科別}} Linaceae"], part: ["{{種子|部位}}"],
    constituents: ["次亞麻油酸（{{Linolenic acid|成分}}）（{{18:3|數值}}）", "亞麻油酸（Linoleic acid）（18:2）", "油酸（Oleic acid）"],
    uses: ["含高量次亞麻油酸，{{不適合作食用油|性質}}", "{{乾性油|性質}}：工業上可做{{油漆和亮光漆|用途}}"] },
  { id: "cod-liver-oil", chapter: 4, name: "Cod liver oil", short: "Cod liver", type: "drug", group: "Polyunsaturated Fixed Oil", source: SRC5 + " p.40",
    names: ["中文：{{魚肝油|生藥中文名}}"],
    origin: ["{{Gadus morrhua|學名}}"], family: ["{{鱈科魚類|科別}} Gadidae"],
    part: ["{{新鮮的魚肝|部位}}（含膽鹽或生物鹼表示汙染：含 {{Morrhuine|成分}} 或 Aselline 表分解）"],
    constituents: ["飽和脂肪酸（15%）", "不飽和脂肪酸（85%）（多）：{{EPA 與 DHA|成分}} 為 {{ω-3|結構}}（好的脂肪酸）來源，可降低{{血小板的聚合反應|作用}}，進而避免心血管疾病的發生"],
    uses: ["{{唯一液態的動物油|性質}}", "補充營養（{{Vit. A 和 D|成分}}）", "藥用等級魚肝油：Vit.D > 255 μg（85u）/g，矯味劑不可超過 1%", "{{Morrhuate|藥物}}（注射用硬化劑）可治{{靜脈曲張|疾病}}"] },

  /* ===== 脂肪 Fats（固態）（p.41）===== */
  { id: "theobroma-oil", chapter: 4, name: "Theobroma oil", short: "Theobroma", type: "drug", group: "Fats", source: SRC5 + " p.41",
    names: ["中文：{{可可脂|生藥中文名}}"],
    origin: ["{{Theobroma cacao|學名}}"], family: ["{{梧桐科|科別}} Sterculiaceae"], part: ["（{{烘烤過的|製法}}）{{種子|部位}}"],
    constituents: ["油酸（Oleic Acid）", "硬脂酸（Stearic Acid）", "棕櫚油酸（Palmitic oil）", "亞麻油酸（linoleic acid）",
      "※烘烤後種殼含 {{threobromine|成分}}（可可鹼）：屬{{黃嘌呤衍生物|結構}}（xanthine derivative），為{{支氣管擴張劑、興奮劑|用途}}"],
    uses: ["★{{栓劑基劑|用途}}"] },
  { id: "lanolin", chapter: 4, name: "Lanolin", type: "drug", group: "Fats", source: SRC5 + " p.41",
    names: ["中文：{{羊毛脂|生藥中文名}}", "別名：Hydrous Wool Fat"],
    origin: ["{{Ovis aries|學名}}"], family: ["{{牛科|科別}} Bovidae"], part: ["{{羊毛|部位}}（成品黃白軟膏狀，有特殊氣味）"],
    constituents: ["★膽固醇（{{Cholesterol|成分}}）", "羊毛脂醇（{{Lanosterol|成分}}）", "Dihydrolanosterol", "脂肪族醇類（Aliphatic Alcohols）"],
    uses: ["含 {{25–30%|數值}} 水，勿與{{易水解藥品|性質}}併用，可能致敏", "★{{吸水型的軟膏基劑|用途}}，做化妝品"] },
  { id: "anhydrous-lanolin", chapter: 4, name: "Anhydrous Lanolin", short: "Anhyd. Lanolin", type: "drug", group: "Fats", source: SRC5 + " p.41",
    names: ["中文：{{無水羊毛脂|生藥中文名}}", "別名：Wool Fat"],
    origin: ["{{Ovis aries|學名}}"], family: ["{{牛科|科別}} Bovidae"], part: ["{{羊毛|部位}}（成品黃白軟膏狀，有特殊氣味）"],
    constituents: ["★膽固醇（Cholesterol）", "羊毛脂醇（Lanosterol）", "Dihydrolanosterol", "脂肪族醇類（Aliphatic Alcohols）"],
    uses: ["{{脫水|製法}}而得，水分 < {{0.25%|數值}}，更易吸收，{{較不致敏|性質}}", "★吸水型的軟膏基劑，做化妝品"] },

  /* ===== 蠟 Waxes（固態）：依來源分成動物、植物、昆蟲性蠟（p.42）===== */
  { id: "spermaceti", chapter: 4, name: "Spermaceti", type: "drug", group: "Waxes", source: SRC5 + " p.42",
    names: ["中文：{{鯨蠟|生藥中文名}}", "種類：{{動物性蠟|分類}}"],
    origin: ["{{Physeter macrocephalus|學名}}"], family: ["{{抹香鯨科|科別}} Physeteridae"], part: ["{{腦腔|部位}}"],
    uses: ["（化妝品）潤膚劑、冷霜", "替代品：{{合成鯨蠟|名詞}}★（{{氫化後的荷荷巴油|名詞}}：為 C14-18 的飽和醇及飽和酸的酯類混合物）"] },
  { id: "jojoba-oil", chapter: 4, name: "Jojoba Oil", type: "drug", group: "Waxes", source: SRC5 + " p.42",
    names: ["中文：{{荷荷巴油|生藥中文名}}", "別名：黃楊油", "種類：{{植物性蠟|分類}}"],
    origin: ["{{Simmondsia chinensis|學名}}"], family: ["{{黃楊科|科別}} Buxaceae"], part: ["{{荷荷巴樹的種子|部位}}"],
    constituents: ["約 50% {{酯類混合物|成分}}（{{非三酸甘油脂|性質}}）"],
    uses: ["★{{液態蠟|性質}}，做潤膚劑（Emollient）", "（氫化後）{{鯨蠟的替代品|用途}}（氫化後會形成結晶蠟）"] },
  { id: "beeswax", chapter: 4, name: "Beeswax", type: "drug", group: "Waxes", source: SRC5 + " p.42",
    names: ["中文：{{蜂蠟|生藥中文名}}", "別名：Yellow Wax（黃蠟）", "種類：{{昆蟲性蠟|分類}}"],
    origin: ["{{Apis mellifera|學名}}"], family: ["{{蜜蜂科|科別}} Apidae"], part: ["{{蜂巢|部位}}（工蜂腹部的後四對蠟線分泌）"],
    constituents: ["72% 脂肪與蠟酸形成的烷基酯（alkyl ester of fatty & wax acids）：以 {{myricyl palmitate|成分}}（棕櫚酸蜂花酯）為主",
      "花粉（pollen）和蜂膠（propolis）：蜂蠟主要{{顏色來源|性質}}"],
    uses: ["{{硬化劑|用途}}（stiffening agent）、★{{拋光劑|用途}}", "蠟燭、化妝品", "經漂白純化得到{{白蠟|名詞}}（white wax, bleached beeswax）：基本特性同蜂蠟，可做軟膏、冷霜"] },
  { id: "carnauba-wax", chapter: 4, name: "Carnauba Wax", short: "Carnauba", type: "drug", group: "Waxes", source: SRC5 + " p.42",
    names: ["中文：{{巴西棕櫚蠟|生藥中文名}}", "種類：{{植物性蠟|分類}}"],
    origin: ["{{Copernicia prunifera|學名}}"], family: ["{{棕櫚科|科別}} Arecaceae"], part: ["{{葉子|部位}}"],
    constituents: ["80% alkyl esters of wax acids（蠟酸的烷基酯）：以 {{myricyl cerotate|成分}}（蠟酸蜂花酯）為主", "內酯（Lactone）", "樹脂（Resin）"],
    uses: ["製作蠟燭", "{{替代蜂蠟|用途}}", "Wax Varnish（{{油畫輔助劑|用途}}）", "皮革和家具的{{拋光劑|用途}}"] }
);

/* 知識樹：照講義的黑色標題分段 */
PI.KNOWLEDGE.ch4 = {
  chapter: 4, title: "脂質",
  sections: [
    { id: "lipid", title: "壹、脂質", items: [
      { title: "合成與代謝", source: SRC5 + " p.37",
        points: [
          "以 {{Acetyl-CoA|成分|Malonyl-CoA/Mevalonate/Butyryl-ACP}} 為主體，Malonyl-CoA 為原料（意即 Malonyl-CoA 為脂肪酸鏈延長的 C 來源）",
          "需 ATP、NADPH、{{Mn²⁺|成分|Mg²⁺/Ca²⁺/Fe³⁺}}、ACP（{{醯基載體蛋白|名詞|輔酶 A/脂肪酸合成酶/去飽和酶}}）參與",
          "★飽和脂肪酸的生合成：每一循環會增加 {{2|數值|1/3/4}} 個碳長（★沒有出現 {{deacetylation|反應|decarboxylation/reduction/dehydration}}）；飽和脂肪酸經{{去飽和酶|酵素|ACP/lipase/Mn²⁺}} → 不飽和脂肪酸",
          "流程：① Acetate-Malonate Pathway：Acetyl-CoA ＋ CO₂（耗 1 ATP）→ Malonyl-CoA（3C）；② 和 ACP 結合、③ {{Decarboxylation|反應|Reduction/Dehydration/Hydrolysis}}（每個 cycle 增加 2 個碳）→ Acetoacetyl-ACP（4C）；④ Reduction、⑤ Dehydration、⑥ Reduction → Butyryl-ACP（4C）；⑦ 鏈的延長（2C/cycle）、⑧ 水解後釋出 ACP、⑨ 得到想要的脂肪酸"
        ] },
      { title: "成分分類與特性", source: SRC5 + " p.37",
        points: [
          "Fatty/Fixed oil（液體）、Fats（固體或半固體）：主要由★{{三酸甘油酯|結構|蠟酸烷基酯/磷脂質/膽固醇}}（triacylglycerol）組成",
          "Wax（蠟）：高分子量值鏈脂肪酸 ＋ 高分子量{{一級直鏈醇|結構|甘油/膽固醇/二級醇}}經縮合反應而得",
          "脂質鑑定：酸價：中和 1g 檢品中的{{游離脂肪酸|名詞|酯類/不飽和雙鍵/甘油}}所需 KOH 之 mg 數 → 表示游離脂肪酸含量",
          "脂質鑑定：酯價：使 1g 檢品中的酯{{皂化|反應|中和/氧化/氫化}}所需 KOH 之 mg 數 → 表示酯類含量；皂化價 ＝ 酸價 ＋ 酯價 → 表示游離脂肪酸和酯類含量",
          "脂質鑑定：碘價：{{100g|數值|1g/10g/1000g}} 檢品之脂肪或油所能吸收碘的 g 數 → 表示{{不飽和程度|性質|游離脂肪酸含量/酯類含量/皂化程度}}（碘價越高，不飽和雙鍵越多）；< 100：非乾性油；> 120：乾性油",
          "可用於 IM 注射：花生油、玉米油、芝麻油、{{棉花籽油|生藥中文名|椰子油/亞麻仁油/蓖麻子油}}",
          "可用於 Eternal Nutrition Therapy：★{{椰子油|生藥中文名|橄欖油/亞麻仁油/棉花籽油}}（有 8 or 10C 的中鏈結構）、玉米油、紅花籽油",
          "哺乳動物缺乏某些去飽和酶，無法形成 ω3 和 ω6 脂肪酸，需從食物獲取，為必須脂肪酸，例：{{Linoleic acid（18:2）、Linolenic acid（18:3）|成分|Lauric acid、Myristic acid/Palmitic acid、Stearic acid/Oleic acid、Euric acid}}"
        ] },
      { title: "其他：脂肪酸分類小總覽", source: SRC5 + " p.43",
        points: [
          "飽和脂肪酸：月桂酸（lauric acid, {{12C|數值|14C/16C/18C}}）、肉豆蔻酸（myristic acid, 14C）、棕梠油酸（palmitic acid, 16C）、硬脂酸（stearic, 18C）",
          "不飽和脂肪酸：油酸（oleic acid, {{18:1|數值|18:2/18:3/22:1}}）、亞麻油酸（linoleic acid, 18:2）、次亞麻油酸（linolenic acid, 18:3）；★{{氫化|反應|皂化/水解/乙醯化}}為半固體可避免酸敗",
          "不飽和環狀脂肪酸：大風子油酸（chaulmoogric acid，可治{{痲瘋|疾病|肺結核/牛皮癬/白斑症}}）、次大風子油酸（hydnocarpic acid）",
          "有光學活性：{{蓖麻油酸|成分|大風子油酸/芥酸/油酸}}（riciholeic acid，★[R-(Z)]-12-Hydroxy-9-octadecenoic acid）→ 具瀉下作用"
        ] },
      { title: "其他：依不飽和度分類（油脂吸收空氣中氧的能力）", source: SRC5 + " p.43",
        points: [
          "乾性油（Drying oil，碘價 > {{120|數值|100/80/150}}）：不飽和度最高，空氣中易氧化形成薄膜，常用於油漆，如：亞麻仁油、★紅花籽油（次亞麻油酸比例最高 55–81%）、大豆油",
          "半乾性油（Semidrying oil，碘價 100–120）：介於乾性及非乾性間，如：{{芝麻油、棉花籽油、玉米油|生藥中文名|亞麻仁油、紅花籽油、大豆油/花生油、橄欖油/椰子油、棕櫚油}}",
          "非乾性油（Nonedrying oil，碘價 < 100）：含較少甚至不含不飽和鍵",
          "脂肪油與蘇丹三號（Sudan Ⅲ）作用會呈{{紅色|顏色|藍色/黑綠色/黃色}}"
        ] }
    ] }
  ]
};

/* ================= 第 5 章：萜類（講義「萜類、揮發油、樹脂、類固醇、健康食品」p.44–49，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：單萜類、倍半萜類、雙萜類、四萜類及類胡蘿蔔素（三萜類講義只有「其他」，放在知識樹）。 */
PI.CHAPTERS.push({ id: 5, name: "萜類", cat: "pharmacognosy", estimate: 18, unitType: "drug", note: "講義：萜類（p.44–49）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(5);

const SRC6 = "萜類講義";
PI.UNITS.push(
  /* ===== 單萜類 Monoterpenoids（p.46）===== */
  { id: "camphor", chapter: 5, name: "Camphor", type: "drug", group: "Monoterpenoids", generation: "講義標示 ★★★", source: SRC6 + " p.46",
    names: ["中文：{{樟腦|生藥中文名}}"],
    origin: ["{{Cinnamomun camphora|學名}}"], family: ["{{樟科|科別}} Lauraceae"], part: ["{{樟樹樹幹|部位}}"],
    constituents: ["天然：{{右旋|性質}}★（旋光度 +41°~+43°）", "合成：{{消旋|性質}}★【以 {{Pinene|成分}}★為原料，從龍腦（{{Borneol|成分}}）氧化反應生成】", "{{雙環酮類|結構}}（Borneol 也是）★★★"],
    uses: ["{{局部止癢劑|用途}}（0.1~3%）", "{{抗刺激劑|用途}}（11%），用於纖維組織炎和神經痛", "減緩咳嗽", "吸入性{{局部麻醉劑|用途}}"] },
  { id: "cineole", chapter: 5, name: "Cineole", type: "drug", group: "Monoterpenoids", source: SRC6 + " p.46",
    names: ["中文：{{桉油酚|生藥中文名}}", "別名：Eucalyptol／Cajuputol"],
    origin: ["{{Eucalyptus golbus|學名}}"], family: ["{{桃金孃科|科別}} Myrtaceae"], part: ["{{新鮮樹葉|部位}}（{{蒸氣蒸餾|製法}}而得）"],
    constituents: ["Cineole：為 {{Eucalyptus oil|名詞}} 主成分★（70~85%）", "{{醚類|結構}}"],
    uses: ["調味劑", "抗菌劑（噴霧劑）", "輕微麻醉劑（噴霧劑）", "吸入{{祛痰劑|用途}}★"] },
  { id: "menthol", chapter: 5, name: "Menthol", type: "drug", group: "Monoterpenoids", generation: "講義標示 ★", source: SRC6 + " p.46",
    names: ["中文：{{薄荷醇|生藥中文名}}", "別名：Menthan-3-ol"],
    origin: ["{{Mentha arvensis|學名}}"], family: ["{{唇形科|科別}} Labiatae（Lamiaceae）"], part: ["{{頂花|部位}}"],
    constituents: ["天然：{{左旋|性質}}（-）menthan-3-ol", "合成：消旋（±）menthan-3-ol（由 Pinene 或 {{Thymol|成分}} {{氫化|反應}}★生成）", "{{單環醇類|結構}}★★★"],
    uses: ["{{止癢劑、血管擴張劑|用途}}（0.1~1%）", "{{抗刺激劑|用途}}（1~16%）"] },
  { id: "terpinol-hydrate", chapter: 5, name: "Terpinol hydrate", short: "Terpinol", type: "drug", group: "Monoterpenoids", source: SRC6 + " p.46",
    names: ["中文：{{水合萜二醇|生藥中文名}}"],
    origin: ["{{松節油|生藥中文名}}在醇中經{{硝酸|試劑}}作用"],
    constituents: ["Terpinol 結構：{{cis-p-menthane-1,8-diol hydrate|結構}}"],
    uses: ["{{祛痰劑|用途}}（製成酊劑）"] },
  { id: "thymol", chapter: 5, name: "Thymol", type: "drug", group: "Monoterpenoids", generation: "講義標示 ★", source: SRC6 + " p.46",
    names: ["中文：{{麝香草酚|生藥中文名}}"],
    origin: ["{{Thymus vulgaris|學名}}"], family: ["{{唇形科|科別}} Labiatae"], part: ["{{葉、花穗|部位}}"],
    constituents: ["天然：來自{{麝香草油|名詞}}（Thyme oil）", "合成：{{m-cresol 和 p-cymene|成分}}", "{{單環酚類|結構}}★★"],
    uses: ["{{抗真菌劑、抗菌劑|用途}}", "漱口水（可殺菌，但{{無法殺死芽孢|性質}}）", "潔牙和局部麻醉劑"] },

  /* ===== 倍半萜類 Sesquiterpenoids★★★★（愛考比較）（p.47）===== */
  { id: "artemisinin", chapter: 5, name: "Artemisinin", type: "drug", group: "Sesquiterpenoids", generation: "講義標示 ★", source: SRC6 + " p.47",
    names: ["中文：{{青蒿素／黃花蒿|生藥中文名}}", "別名：Qinghaosu"],
    origin: ["{{Artemisia annua|學名}}"], family: ["{{菊科|科別}} Asteraceae"], part: ["{{葉和花頂|部位}}"],
    constituents: ["{{Artemisinin|成分}}★★：有 {{internal peroxide linkage|結構}}", "可產生{{自由基|作用}}消滅瘧疾"],
    uses: ["{{抗瘧疾|用途}}★：尤其{{顱內瘧疾|疾病}}有效（脂溶性高）", "單獨用易復發，需{{併用其他藥|性質}}"] },
  { id: "chamomile", chapter: 5, name: "Chamomile", type: "drug", group: "Sesquiterpenoids", generation: "講義標示 ★", source: SRC6 + " p.47",
    names: ["中文：{{洋甘菊|生藥中文名}}", "別名：Ginseng of Europe"],
    origin: ["{{Matricaria recutita|學名}}（德國洋甘菊）", "{{Chamaemelum nobile|學名}}（羅馬洋甘菊）"], family: ["{{菊科|科別}} Asteraceae"], part: ["{{乾燥花頭|部位}}"],
    constituents: ["揮發油：(-)-α-bisaboloxide A & B、{{(-)-α-bisabolol|成分}}、Guaianolide lactone {{matricin|成分}}", "非揮發油：{{黃酮類、香豆素|成分}}"],
    uses: ["{{抗發炎劑|用途}}（揮發油）", "{{解痙劑|用途}}（非揮發油）", "祛風劑"] },
  { id: "feverfew", chapter: 5, name: "Feverfew", type: "drug", group: "Sesquiterpenoids", generation: "講義標示 ★", source: SRC6 + " p.47",
    names: ["中文：{{黃葉菊／玲瓏菊|生藥中文名}}"],
    origin: ["{{Tanacetum parthenum|學名}}★"], family: ["{{菊科|科別}} Asteraceae"], part: ["{{葉子|部位}}"],
    constituents: ["{{Parthenolide|成分}}★★：結構：C4 與 C5 有 {{epoxide|結構}}（4α,5β）；C13 有雙鍵", "建議最低濃度 {{0.2%|數值}}，乾燥優值葉片的常用劑量 125mg/day"],
    uses: ["{{血清素拮抗劑|作用}}★", "退熱劑、解熱劑", "預防{{偏頭痛|疾病}}"] },
  { id: "valerian", chapter: 5, name: "Valerian", type: "drug", group: "Sesquiterpenoids", generation: "講義標示 ★", source: SRC6 + " p.47",
    names: ["中文：{{吉草／纈草|生藥中文名}}"],
    origin: ["{{Valeriana officinalis|學名}}"], family: ["{{敗醬科|科別}} Valerianaceae"], part: ["{{乾燥根莖或根|部位}}★"],
    constituents: ["臭味揮發油：Bornyl acetate、{{valerenic acid|成分}}★（sesquiterponids）", "Lipophilic iridoid：{{valepotriates|成分}}"],
    uses: ["{{抗焦慮劑|用途}}", "{{助眠劑|用途}}★", "其雙環單萜類成分僅存在於 {{40°C|數值}} 以下"] },

  /* ===== 雙萜類 Diterpenoids（p.48）===== */
  { id: "forskolin", chapter: 5, name: "Forskolin", type: "drug", group: "Diterpenoids", source: SRC6 + " p.48",
    names: ["中文：{{彩葉草|生藥中文名}}", "別名：colforsin"],
    origin: ["{{Coleus forskohlii|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{根部|部位}}"],
    constituents: ["Forskolin：為{{雙環|結構}}（labdane）", "C8、C13 有 {{epoxide|結構}}", "C14 有雙鍵（不飽和鍵）"],
    uses: ["可活化 {{cAMP-generating system|標的}}，促進 adenylate cyclase", "治療充 {{CHF|疾病}}、氣喘、青光眼和高血壓"] },
  { id: "ginkgo", chapter: 5, name: "Ginkgo", type: "drug", group: "Diterpenoids", source: SRC6 + " p.48",
    names: ["中文：{{銀杏|生藥中文名}}"],
    origin: ["{{Ginkgo biloba|學名}}"], family: ["{{銀杏科|科別}} Ginkgoaceae"], part: ["{{樹葉|部位}}（以濃縮{{丙酮水溶液|試劑}}萃取）"],
    constituents: ["{{Falvone glycosides|成分}}（24%）：{{Rutin type|結構}}", "Diterpenoid（6%）：{{Ginkgolides|成分}} A、B、C、M★"],
    uses: ["Falvone glycosides：預防{{缺血性腦損傷|疾病}}", "Ginkgolides：抑制{{血小板活化因子|標的}}（PAF），促進周邊血液循環，治療腦循環障礙", "{{無延緩記憶力衰退|性質}}之功用"] },
  { id: "taxol", chapter: 5, name: "Taxol", type: "drug", group: "Diterpenoids", generation: "講義標示 ★★", source: SRC6 + " p.48",
    names: ["中文：{{紫杉醇|生藥中文名}}", "別名：Paclitaxel、Pacific yew"],
    origin: ["{{Taxus brevifolia|學名}}：樹皮", "Taxus species：針狀葉"], family: ["{{紅豆杉科|科別}} Taxaceae"], part: ["{{樹皮|部位}}", "針狀葉"],
    constituents: ["Taxol：{{C13|結構}} 的酯鍵具細胞毒性★", "酯鍵連接的 {{2 號碳|結構}}上的 OH 基可使活性增加", "針狀葉萃取出 {{10-desacetylbaccatin Ⅲ|成分}}★，為 Taxol 前驅物"],
    uses: ["破壞微管（Tublin）平衡，並阻斷細胞周期 {{G2 後期與 M 期|名詞}}，抑制細胞複製", "治療{{轉移性乳癌|疾病}}、乳癌的第二線藥物", "為{{脂溶性|性質}}★，注射前需先溶於 {{caster oil|名詞}}"] },

  /* ===== 四萜類及類胡蘿蔔素 Tetraterpenoids and Carotenoids（p.49）===== */
  { id: "retinol", chapter: 5, name: "Retinol", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：維生素 A：{{視黃醇|生藥中文名}}", "別名：Vitamin A、All-trans retinol"],
    origin: ["源自{{魚肝油|生藥中文名}}"],
    constituents: ["{{維生素 A 的主要天然型|性質}}", "活性結構為 {{β-ionone|結構}}"],
    notes: ["{{80~90%|數值}}腸道吸收", "多儲存在{{肝臟|名詞}}（攝取的維生素 A 有 {{1/3|數值}} 會被儲存）"] },
  { id: "tretinoin", chapter: 5, name: "Tretinoin", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：{{維生素 A 酸|生藥中文名}}", "別名：{{All-trans retinoic acid|結構}}"],
    origin: ["源自魚肝油"], constituents: ["活性結構為 β-ionone"],
    uses: ["治療{{青春痘|疾病}}：增加{{表皮細胞有絲分裂和替換|作用}}"],
    notes: ["{{皮膚（局部使用）|名詞}}"] },
  { id: "isotretinoin", chapter: 5, name: "Isotretinoin", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：{{異維生素 A 酸|生藥中文名}}", "別名：{{13-cis retinoic acid|結構}}"],
    origin: ["源自魚肝油"], constituents: ["活性結構為 β-ionone"],
    uses: ["治療{{囊腫性青春痘|疾病}}", "治療皮膚不正常角質化"],
    notes: ["易有副作用，須嚴謹監控", "{{孕婦不能使用|性質}}"] },
  { id: "beta-carotene", chapter: 5, name: "β-carotene", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：{{β-胡蘿蔔素|生藥中文名}}", "別名：beta-carotene"],
    constituents: ["{{維生素 A 的前驅物|性質}}"],
    uses: ["減少血球合成性原紫質症的{{光敏感性|性質}}"],
    notes: ["使用後會造成{{胡蘿蔔素血症|副作用}}（carotenemia）"] },
  { id: "lycopene", chapter: 5, name: "Lycopene", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：類胡蘿蔔素：{{茄紅素|生藥中文名}}"],
    constituents: ["{{單雙鍵相間|結構}}使分子帶有顏色，又稱{{色素體|名詞}}（chromphore）"],
    uses: ["植物與微生物：{{光保護物質|用途}}、光合作用輔助色素、協助穩定細胞膜", "動物：維生素 A 主要來源、光保護物質、預防癌症、抗氧化劑、著色劑"] },
  { id: "xanthophylls", chapter: 5, name: "Xanthophylls", type: "drug", group: "Tetraterpenoids", source: SRC6 + " p.49",
    names: ["中文：類胡蘿蔔素：{{葉黃素|生藥中文名}}"],
    constituents: ["{{茄紅素的氧化延伸物|結構}}"],
    uses: ["植物與微生物：光保護物質、光合作用輔助色素、協助穩定細胞膜", "動物：維生素 A 主要來源、光保護物質、預防癌症、抗氧化劑、{{著色劑|用途}}"] }
);

/* 知識樹：照講義的黑色標題分段 */
PI.KNOWLEDGE.ch5 = {
  chapter: 5, title: "萜類",
  sections: [
    { id: "terpene", title: "壹、萜類", items: [
      { title: "生合成", source: SRC6 + " p.44",
        points: [
          "合成途徑：{{Acetate-Mevalonate pathway|反應|Acetate-Malonate pathway/Shikimic acid pathway/Mannich-type condensation}}★★★【提示：小心不要選成 malonate】",
          "前驅物：{{Acetate|成分|Malonate/Phenylalanine/Shikimic acid}}",
          "中間產物：3-Acetyl-CoA、HMG-CoA、Mevalonic acid、Mevalonate 5-pyrophosphate、Isopentenyl pyrophosphate（IPP, {{5C|數值|10C/15C/20C}}）、Geranyl pyrophosphate（{{10C|數值|5C/15C/20C}}）",
          "產物：單萜類、倍半萜類、雙萜類、三萜類、類固醇、四萜類、類胡蘿蔔素",
          "(1) {{三|數值|兩/四/六}}個 Acetyl-CoA 結合形成 HMG-CoA；(2) HMG-CoA 經 NADPH₂、{{HMG-CoA reductase|酵素|HMG-CoA synthase/Mevalonate kinase/Squalene synthase}} 還原成 Mevalonic acid",
          "(3) Mevalonic acid 經兩次{{磷酸化|反應|脫羧/還原/異構化}}後產生 Mevalonate 5-pyrophosphate；(4) Mevalonate 5-pyrophosphate 去除 {{CO₂|成分|H₂O/ATP/NADPH}}，形成 Isopentenyl pyrophosphate（IPP）",
          "(5) IPP 異構化形成 {{3,3-dimethylallyl pyrophosphate|中間產物|Geranyl pyrophosphate/Farnesyl pyrophosphate/Mevalonic acid}}（化學式不變）；(6) IPP 與 3,3-dimethylallyl pyrophosphate 相接形成 Geranyl pyrophosphate",
          "(7) 單萜類：Geranyl pyrophosphate 上 C₂ 的雙鍵為 {{trans|結構|cis/α/β}}，不易環化，經由 Monoterpenoid synthases 變成 cis 後，才可被環化酶環化",
          "(9) 三萜類：Farnesyl pyrophosphate（15C）會先生成角鯊烯 {{squalene|中間產物|phytoene/lanosterol/geraniol}}（非環化）★，再生成其他三萜",
          "(11) 四萜類：Geranylgeranyl pyrophosphate（20C）頭尾相接形成 prephytoene pyrophosphate（40C），再生成 {{phytoene|中間產物|squalene/lycopene/retinol}}，最後形成四萜類",
          "Geranyl pyrophosphate（10C）＋ IPP（5C）→ Farnesyl pyrophosphate → 倍半萜類（15C）；Farnesyl pyrophosphate ×2 → 三萜類、類固醇（30C）；Farnesyl pyrophosphate ＋ IPP → Geranylgeranyl pyrophosphate → 雙萜類（20C）；×2 → 四萜類、類胡蘿蔔素（40C）"
        ] },
      { title: "依照 Isoprene（異戊二烯，C₅H₈）組成的數量分類★★", source: SRC6 + " p.45",
        table: {
          head: ["分類", "Isoprene 數量", "分子式", "生藥"],
          rows: [
            [{ t: "單萜類 Monoterpenoids", b: true }, "2", "C₁₀H₁₆", "Camphor, Cineole, Menthol, Terpinol, Thymol"],
            [{ t: "倍半萜類 Sesquiterpenoids", b: true }, "3", "C₁₅H₂₄", "Artemisinin, Chamomile, Feverfew, Valerian"],
            [{ t: "雙萜類 Diterpenoids", b: true }, "4", "C₂₀H₃₂", "Forskolin, Ginkgo, Taxol"],
            [{ t: "三萜類 Triterpenoids", b: true }, "6", "C₃₀H₄₈", "Squalene、Saponins"],
            [{ t: "四萜類 Tetraterpenoids", b: true }, "8", "C₄₀H₆₀", "Vitamin A, Tretinoin, Isotretinoin"],
            [{ t: "類胡蘿蔔素 Carotenoids", b: true }, "8", "C₄₀H₆₀", "beta-carotene"]
          ],
          note: "【提示：萜類的 Isoprene 數＝萜數 ×2】" },
        points: [
          "倍半萜類的 Isoprene 數量為 {{3|數值|2/4/6}}，分子式 C₁₅H₂₄",
          "三萜類的 Isoprene 數量為 {{6|數值|3/4/8}}，分子式 {{C₃₀H₄₈|結構|C₂₀H₃₂/C₄₀H₆₀/C₁₅H₂₄}}"
        ] },
      { title: "依照環的數量分類★★★", source: SRC6 + " p.45",
        points: [
          "非環類（Acyclic）：芳樟醇 {{Linallol|成分|Thymol/Borneol/Abietic acid}}",
          "單環類（Monocyclic）：麝香草酚 thymol★★、薄荷 {{menthol|成分|Borneol/Camphor/Pinene}}★★、茴香 Anethole、桂皮油 Cinnamaldehyde",
          "雙環類（Bicyclic）：龍腦 {{Borneol|成分|menthol/thymol/Linallol}}★★、樟腦 Camphor★、Pinene",
          "三環類（Tricyclic）：{{Abietic acid|成分|Pinene/Anethole/Cinnamaldehyde}}"
        ] },
      { title: "萜類衍生物與特性", source: SRC6 + " p.45",
        points: [
          "萜類衍生物：揮發油、樹脂、混萜類 {{Meroterpenoids|分類|Sesquiterpenoids/Diterpenoids/Carotenoids}}",
          "混萜類：由 Isoprene 和 Nonisoprene 混合，包含麥角生物鹼、大麻、奎寧、Phylloquinones（ex. {{Vit. K|成分|Vit. E/Vit. A/Vit. D}}）、Tocopherols（ex. Vit. E）",
          "單萜類：具揮發性（volatility）、強烈氣味（pungent ordors）→ 使植物具有香氣（fragramce）與味道（flavor）的主要成份",
          "{{倍半萜類|分類|單萜類/雙萜類/三萜類}}：萜類中最大的一類",
          "雙萜類：較少與醣類結合成配醣體（唯一的例外是甜菊苷 {{stevioside|成分|saponins/rutin/salicin}}）",
          "三萜類：大部份為醇類，可和醣類形成配醣體，如：{{saponins|成分|stevioside/Ginkgolides/Taxol}}",
          "四萜類及類胡蘿蔔素：具{{光敏感性|性質|揮發性/溶血性/強烈氣味}}"
        ] }
    ] },
    { id: "monoterpene", title: "單萜類：其他", items: [
      { title: "樟腦、松油酚、薄荷並用", group: "Monoterpenoids", source: SRC6 + " p.46",
        points: [
          "樟腦（Camphor）、松油酚（Cineole）、薄荷（Menthol）並用：可製成軟膏、止咳藥、鼻腔噴劑、吸入劑",
          "口服{{小劑量|名詞|大劑量/中劑量/單次劑量}}：祛風劑，舒緩支氣管炎（bronchitis）、鼻竇炎（sinusitis）和鼻塞（nasal congestion）",
          "口服大劑量：有{{心臟抑制|作用|心臟興奮/血管收縮/中樞興奮}}作用，可緩和心律不整（嬰幼兒使用時須特別注意）",
          "結構式：Menthol vs. Thymol：Thymol 為單環{{酚類|結構|醇類/酮類/醚類}}，Menthol 為單環醇類"
        ] }
    ] },
    { id: "sesquiterpene", title: "倍半萜類：其他", items: [
      { title: "依照環碳骨架（carbocyclic skeleton）分為三大類★★★", group: "Sesquiterpenoids", source: SRC6 + " p.47",
        table: {
          head: ["分類", "Germacranolides", "Eudesmanolides", "Guaianolides"],
          rows: [
            [{ t: "結構特色", b: true }, "十元環", "兩個相連的六元環", "相連的五元環和七元環"],
            [{ t: "生藥", b: true }, "Feverfew", "Valerian", "Artemisinin、Chamomile"]
          ] },
        points: [
          "{{Germacranolides|分類|Eudesmanolides/Guaianolides/Monoterpenoids}}：十元環，如 Feverfew",
          "Eudesmanolides：{{兩個相連的六元環|結構|十元環/相連的五元環和七元環/單一六元環}}，如 Valerian",
          "Guaianolides：相連的五元環和七元環，如 Artemisinin、{{Chamomile|生藥|Feverfew/Valerian/Ginkgo}}",
          "特色：皆含有 {{α-methylene-γ-lactone|結構|β-ionone/internal peroxide/epoxide}} 結構",
          "特色：大部份含有 α,β-unsaturated carbonyls 或 {{epoxide|結構|peroxide/hydroxyl/ester}} 官能基"
        ] }
    ] },
    { id: "diterpene", title: "雙萜類、三萜類：其他", items: [
      { title: "雙萜類：結構與生物活性", group: "Diterpenoids", source: SRC6 + " p.48",
        points: [
          "結構：主要為環數少於{{五環|結構|三環/四環/六環}}的碳環化合物，少部分則為非環狀化合物",
          "生物活性：樹脂酸（resin acid）、吉貝素（{{gibberellins|成分|cucurbitacins/limonoids/quassinoid}}）、羅漢松內脂（podolactone）、巴豆脂（diesters of phorbol）"
        ] },
      { title: "三萜類：結構與生物活性", source: SRC6 + " p.48",
        points: [
          "結構：分成{{四環（tetracyclic）和五環化合物（pentacyclic）|結構|單環和雙環化合物/雙環和三環化合物/非環和單環化合物}}",
          "少部份三萜類少於 30 個 C，因為在生合成後期某些片段被移除，如：四降三萜類 Tetranortriterpenoids（{{26|數值|27/28/24}} 個 C，如植物蛻皮素）、C₂₇ steroids",
          "Free triterpenoid 是指 {{OH 基未接其他官能基|結構|未與醣類結合/含有雙鍵/含有 epoxide}}，常為植物的樹脂（resin）、膠體（latex）、表皮（cuticle）",
          "生物活性：雪膽甲素（cucurbitacins）、苦木苦味素（quassinoid）、皂甘（saponins）、檸檬苦素類（{{limonoids|成分|gibberellins/podolactone/phorbol}}）"
        ] }
    ] },
    { id: "tetraterpene", title: "四萜類及類胡蘿蔔素：其他", items: [
      { title: "其他生合成產物", group: "Tetraterpenoids", source: SRC6 + " p.49",
        points: [
          "{{Homocarotenoids|分類|Apocarotenoids/Meroterpenoids/Xanthophylls}}（C₄₅ 和 C₅₀ 的類胡蘿蔔素）：某些微生物在四萜類的主幹上加上 isopentenyl groups 產生",
          "Apocarotenoids（少於 C₄₀ 的類胡蘿蔔素）：C₄₀ 的類胡蘿蔔素被{{氧化|反應|還原/水解/異構化}}而形成低於 C40 的類胡蘿蔔素",
          "維生素 A 類源自{{魚肝油|生藥中文名|大豆油/玉米油/亞麻仁油}}，活性結構為 β-ionone"
        ] }
    ] }
  ]
};

/* ================= 第 6 章：揮發油與香料（講義 p.50–53，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：醇類、醛類、酮類、酚類、氧化型、酚醚類、酯類揮發油。
   樟腦（酮類）和香豆素（氧化型）講義只寫「詳見單萜／詳見配醣體」，格子分別在第 5、3 章，這裡不重複。 */
PI.CHAPTERS.push({ id: 6, name: "揮發油與香料", cat: "pharmacognosy", estimate: 22, unitType: "drug", note: "講義：揮發油與香料（p.50–53）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(6);

const SRC7 = "揮發油與香料講義";
PI.UNITS.push(
  /* ===== 醇類揮發油 Alcohol volatile oil（p.51）===== */
  { id: "peppermint", chapter: 6, name: "Peppermint", type: "drug", group: "Alcohol volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{歐薄荷|生藥中文名}}"],
    origin: ["{{Mentha piperita|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{乾燥葉、花的末梢|部位}}"],
    constituents: ["{{Menthol|成分}}（薄荷腦）", "樹酯（resin）、單寧（tannin）"],
    uses: ["{{驅風|用途}}", "{{矯味劑|用途}}", "{{抗刺激劑|用途}}（外用止癢）"] },
  { id: "peppermint-oil", chapter: 6, name: "Peppermint oil", short: "Pepper. oil", type: "drug", group: "Alcohol volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{薄荷油|生藥中文名}}"],
    origin: ["{{Mentha piperita|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{開花薄荷之地上部|部位}}（經{{蒸氣蒸餾|製法}}而得）"],
    constituents: ["{{(-)-menthol|成分}}（薄荷腦）"],
    uses: ["驅風", "矯味劑", "抗刺激劑（外用止癢）"] },
  { id: "japanese-peppermint-oil", chapter: 6, name: "Japanese peppermint oil", short: "日本薄荷油", type: "drug", group: "Alcohol volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{日本薄荷油|生藥中文名}}", "別名：Menta arvensis oil"],
    origin: ["{{Mentha arvensis|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{頂花|部位}}"],
    constituents: ["Menthol（薄荷腦）"],
    uses: ["{{心臟鎮靜劑|用途}}（口服）", "局部止癢（外用）", "{{薄荷腦來源|用途}}"] },

  /* ===== 醛類揮發油 Aldehyde volatile oil（p.51）===== */
  { id: "saigon-cinnamon", chapter: 6, name: "Saigon Cinnamon", short: "Saigon Cinn.", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：桂皮：{{西貢桂皮|生藥中文名}}"],
    origin: ["{{Cinnamomum loureiroi|學名}}"], family: ["{{樟科|科別}} Lauraceae"], part: ["{{乾燥樹皮|部位}}"],
    constituents: ["{{Cinnamaldehyde|成分}}（桂皮醛）：{{西貢桂皮|生藥中文名}}最多", "{{Mannitol|成分}}：{{甜味來源|性質}}", "Tannin"],
    uses: ["驅風", "矯味劑"] },
  { id: "ceylon-cinnamon", chapter: 6, name: "Ceylon Cinnamon", short: "Ceylon Cinn.", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：桂皮：{{錫蘭桂皮|生藥中文名}}"],
    origin: ["{{Cinnamomum zeylanicum|學名}}"], family: ["{{樟科|科別}} Lauraceae"], part: ["{{灌木嫩枝之乾燥樹皮|部位}}"],
    constituents: ["Cinnamaldehyde（桂皮醛）：西貢桂皮最多", "Mannitol：甜味來源", "Tannin"],
    uses: ["驅風", "矯味劑"] },
  { id: "cassia-cinnamon", chapter: 6, name: "Cassia Cinnamon", short: "Cassia Cinn.", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：桂皮：{{肉桂皮|生藥中文名}}"],
    origin: ["{{Cinnamomum cassia|學名}}"], family: ["{{樟科|科別}} Lauraceae"], part: ["{{乾燥樹皮|部位}}"],
    constituents: ["Cinnamaldehyde（桂皮醛）：西貢桂皮最多", "Mannitol：甜味來源", "Tannin"],
    uses: ["驅風", "矯味劑"] },
  { id: "cinnamon-oil", chapter: 6, name: "Cinnamon oil", short: "Cinn. oil", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：桂皮：{{桂皮油／桂皮葉油|生藥中文名}}", "別名：Cassia oil"],
    origin: ["{{Cinnamomum cassia|學名}}"], family: ["{{樟科|科別}} Lauraceae"], part: ["{{葉及嫩枝|部位}}（經蒸氣蒸餾而得）"],
    constituents: ["Cinnamaldehyde（桂皮醛）", "丁香酚（{{Eugenol|成分}}）：可使 {{FeCl₃|試劑}} 試劑呈{{藍色|顏色}}"],
    uses: ["驅風", "矯味劑"] },
  { id: "lemon-oil", chapter: 6, name: "Lemon oil", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{檸檬油|生藥中文名}}"],
    origin: ["{{Citrus limon|學名}}"], family: ["{{芸香科|科別}} Rutaceae"], part: ["{{新鮮檸檬皮榨出|部位}}"],
    constituents: ["Terpene（> 90%）：{{(+)-limonene|成分}}（檸檬油精），放久後會被分解而產生{{松節油味道|性質}}",
      "Citral（{{檸檬醛|成分}}）：香味來源，為 Citral a、Citral b（{{3:1|數值}}）混和物"],
    uses: ["矯味劑", "{{香水精油|用途}}"] },
  { id: "orange-oil", chapter: 6, name: "Orange oil", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{甜橙油|生藥中文名}}"],
    origin: ["{{Citrus sinensis|學名}}"], family: ["{{芸香科|科別}} Rutaceae"], part: ["{{新鮮果皮|部位}}"],
    constituents: ["{{Limonene|成分}}（檸檬油精）"] },
  { id: "citronella-oil", chapter: 6, name: "Citronella oil", short: "Citronella", type: "drug", group: "Aldehyde volatile oil", source: SRC7 + " p.51",
    names: ["中文：{{香茅油|生藥中文名}}"],
    origin: ["{{Cymbopogon schoeschoenanthus|學名}}"], family: ["{{禾本科|科別}} Poaceae"], part: ["{{葉|部位}}"],
    constituents: ["{{(+)-Citronellol|成分}}（香茅醇）"] },

  /* ===== 酮類揮發油 Ketone volatile oil（p.52）===== */
  { id: "spearmint-oil", chapter: 6, name: "Spearmint oil", short: "Spearmint", type: "drug", group: "Ketone volatile oil", source: SRC7 + " p.52",
    names: ["中文：{{綠薄荷油|生藥中文名}}"],
    origin: ["{{Mentha spicata|學名}}（綠薄荷）", "Mentha cardiac（蘇格蘭綠薄荷）"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{乾燥葉、花的末梢|部位}}"],
    constituents: ["{{(-)-Carvone|成分}}（藏茴香酮）：{{香味來源|性質}}★", "Alcohol、Ethers、Terpene"],
    uses: ["{{矯味劑|用途}}"],
    notes: ["【比較：{{(+)-carvone|成分}} 存在於{{藏茴香（caraway）及蒔蘿油（oil of dill）|名詞}}中】"] },

  /* ===== 酚類揮發油 Phenol volatile oil（p.52）===== */
  { id: "thyme-oil", chapter: 6, name: "Thyme oil", type: "drug", group: "Phenol volatile oil", source: SRC7 + " p.52",
    names: ["中文：{{麝香草油|生藥中文名}}"],
    origin: ["{{Thymus vulgaris|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{葉、花穗|部位}}"],
    constituents: ["{{Thymol|成分}}（麝香草酚）★"],
    uses: ["（詳見單萜：麝香草酚 Thymol）"] },
  { id: "clove-oil", chapter: 6, name: "Clove oil", type: "drug", group: "Phenol volatile oil", generation: "講義標示 ★★", source: SRC7 + " p.52",
    names: ["中文：{{丁香油|生藥中文名}}"],
    origin: ["{{Eugenia caryophyllus|學名}}", "Eugenia caryophyllata"], family: ["{{桃金孃科|科別}} Myrtaceae"], part: ["{{乾燥花蕾|部位}}（經蒸氣蒸餾而得）"],
    constituents: ["Total phenol > {{85%|數值}}", "{{Eugeno|成分}}（丁香酚）★★：可使 {{FeCl₃|試劑}} 試劑呈藍色；大量丁香酚可製造{{香草醛 Vanillin|成分}}★",
      "{{Methyl-n-amyl ketone|成分}}：特殊{{新鮮水果香味|性質}}"],
    uses: ["{{牙科止痛|用途}}（加在牙膏中）", "抗菌、驅風、抗刺激劑", "Clove oil {{比重大於水|性質}}"] },
  { id: "pine-tar", chapter: 6, name: "Pine tar", type: "drug", group: "Phenol volatile oil", source: SRC7 + " p.52",
    names: ["中文：{{松焦油|生藥中文名}}", "別名：Pix pini、Pix liquida"],
    origin: ["{{Pinus palustris|學名}}"], family: ["{{松科|科別}} Pinaceae"], part: ["{{木材|部位}}（經{{破壞性蒸餾|製法}}）"],
    constituents: ["水性餾出物、輕油分餾物、重油分餾物、黑樹酯"],
    uses: ["{{局部刺激、抗菌|用途}}"] },

  /* ===== 氧化型揮發油 Oxide volatile oil（p.52）===== */
  { id: "eucalyptus-oil", chapter: 6, name: "Eucalyptus oil", short: "Eucalyptus", type: "drug", group: "Oxide volatile oil", source: SRC7 + " p.52",
    names: ["中文：{{尤加利油|生藥中文名}}"],
    origin: ["{{Eucalyptus globules|學名}}"], family: ["{{桃金孃科|科別}} Myrtaceae"], part: ["{{乾燥之鐮刀型葉|部位}}"],
    constituents: ["{{Cineole|成分}}（桉油酚）★（> {{70%|數值}}）：詳見單萜", "{{α-pinene|成分}}"],
    uses: ["矯味劑、消炎用之消毒劑、發汗、{{祛痰|用途}}"] },

  /* ===== 酚醚類揮發油 Phenolic ether volatile oil（p.53）===== */
  { id: "anise", chapter: 6, name: "Anise", type: "drug", group: "Phenolic ether volatile oil", source: SRC7 + " p.53",
    names: ["中文：茴香油：{{洋茴香|生藥中文名}}", "別名：Anise oil"],
    origin: ["{{Pimpinella anisum|學名}}"], family: ["{{繖形科|科別}} Umbelliferae／Apiaceae"], part: ["{{乾燥成熟果實|部位}}"],
    constituents: ["{{(E)-Anethole|成分}}（茴香腦）★★：佔 {{80~90%|數值}}，為香味來源", "{{Chavicol|成分}}（胡椒酚）"],
    uses: ["矯味劑", "驅風"] },
  { id: "star-anise", chapter: 6, name: "Star anise", type: "drug", group: "Phenolic ether volatile oil", source: SRC7 + " p.53",
    names: ["中文：茴香油：{{八角茴香|生藥中文名}}"],
    origin: ["{{Illicium verum|學名}}"], family: ["{{木蘭科|科別}} Magnoliaceae"], part: ["{{乾燥成熟果實|部位}}"],
    constituents: ["(E)-Anethole（茴香腦）★★：佔 80~90%，為香味來源", "Chavicol（胡椒酚）"],
    uses: ["矯味劑", "驅風"] },
  { id: "fennel", chapter: 6, name: "Fennel", type: "drug", group: "Phenolic ether volatile oil", source: SRC7 + " p.53",
    names: ["中文：茴香油：{{小茴香|生藥中文名}}"],
    origin: ["{{Foeniculum vulgare|學名}}"], family: ["{{繖形科|科別}} Umbelliferae／Apiaceae"], part: ["{{乾燥成熟果實|部位}}"],
    constituents: ["(E)-Anethole（茴香腦）★★：佔 80~90%，為香味來源", "Chavicol（胡椒酚）"],
    uses: ["矯味劑", "驅風"] },
  { id: "japanese-star-anise", chapter: 6, name: "Japanese star anise", short: "日本八角", type: "drug", group: "Phenolic ether volatile oil", source: SRC7 + " p.53",
    names: ["中文：{{日本八角茴香|生藥中文名}}", "別名：Shikimmi、Skimmi"],
    origin: ["{{Illicium religiosum|學名}}", "Illicium anisatum"], family: ["{{木蘭科|科別}} Magnoliaceae"], part: ["{{果實|部位}}"],
    constituents: ["{{Hananomin|成分}}：{{有劇毒，不可食用|性質}}"],
    uses: ["{{供佛、製香|用途}}", "比重大於水"] },
  { id: "nutmeg", chapter: 6, name: "Nutmeg", type: "drug", group: "Phenolic ether volatile oil", source: SRC7 + " p.53",
    names: ["中文：{{肉豆蔻|生藥中文名}}", "別名：Myristica"],
    origin: ["{{Myristica fragrans|學名}}"], family: ["{{肉豆蔻科|科別}} Myristicaceae"],
    part: ["{{乾燥成熟種子|部位}}（削去種皮與子衣）", "{{種仁|部位}}（經蒸氣蒸餾而得）"],
    constituents: ["乾燥成熟種子：{{Safrole|成分}}（黃樟油精）：{{可能致癌|副作用}}", "乾燥成熟種子：{{Myristicin|成分}}（肉豆蔻醚）、Elemicin（欖鄉脂素）：代謝後有類{{安非他命|藥物}}結構，具{{迷幻作用|作用}}",
      "種仁：α-pinene：{{雙環單萜類|結構}}", "種仁：Sabinene：Myristicin（肉豆蔻醚）、Safrole（黃樟油精）"],
    uses: ["乾燥成熟種子：調味料、芳香劑", "乾燥成熟種子：{{迷幻劑|用途}}（服用 > {{15g|數值}}）", "乾燥成熟種子：肉豆蔻脂在{{常溫時為固態|性質}}，有針狀結晶析出", "種仁：芳香劑、驅風"] },

  /* ===== 酯類揮發油 Ester volatile oil（p.53）===== */
  { id: "wintergreen-oil", chapter: 6, name: "Wintergreen oil", short: "Wintergreen", type: "drug", group: "Ester volatile oil", source: SRC7 + " p.53",
    names: ["中文：{{冬綠油|生藥中文名}}", "別名：Gaultheria oil（白株樹油）、Sweet birch oil（樺木油）、Betula oil"],
    origin: ["{{Gaultheria procumbens|學名}}：{{石南科|科別}} Ericaceae，乾燥葉", "{{Betula lenta|學名}}：{{白樺科|科別}} Betulaceae，樹皮"],
    family: ["石南科 Ericaceae", "白樺科 Betulaceae"], part: ["{{乾燥葉|部位}}（Gaultheria procumbens）", "{{樹皮|部位}}（Betula lenta）"],
    constituents: ["{{Methyl salicylate|成分}}（水楊酸甲酯）：天然：經{{蒸氣蒸餾|製法}}而得；合成：冬綠苷（{{Gaultherin|成分}}）經冬綠酶（{{Gaultherase|酵素}}）水解而得",
      "{{Enanthic alcohol|成分}}（正庚醇）"],
    uses: ["矯味劑、抗刺激劑、消炎、消毒、{{抗風濕|用途}}"] },
  { id: "lavender-oil", chapter: 6, name: "Lavender oil", short: "Lavender", type: "drug", group: "Ester volatile oil", source: SRC7 + " p.53",
    names: ["中文：{{薰衣草油|生藥中文名}}"],
    origin: ["{{Lavandula latifolia|學名}}"], family: ["{{唇形科|科別}} Lamiaceae"], part: ["{{花穗|部位}}"],
    constituents: ["{{(-)-linalyl acetate|成分}}"],
    uses: ["{{芳香|用途}}"] }
);

/* 知識樹：照講義的黑色標題分段 */
PI.KNOWLEDGE.ch6 = {
  chapter: 6, title: "揮發油與香料",
  sections: [
    { id: "volatile-oil", title: "貳、揮發油與香料", items: [
      { title: "合成與代謝", source: SRC7 + " p.50",
        points: [
          "Terpene derivatives（無苯環、直鏈）→ {{Acetate-mevalonic acid pathway|反應|Shikimic acid phenylpropanoid pathway/Acetate-Malonate pathway/Mannich-type condensation}}★★（參考萜類）",
          "Aromatic compounds（含苯環）→ {{Shikimic acid phenylpropanoid pathway|反應|Acetate-mevalonic acid pathway/Acetate-Malonate pathway/Mannich-type condensation}}★★（參考類苯基丙烷）"
        ] },
      { title: "結構分類★★★（框框為 Monoterpenoids）", source: SRC7 + " p.50",
        table: {
          head: ["", "非環類（Acyclic）", "單環類（Monocyclic）", "雙環類（Bicyclic）"],
          rows: [
            [{ t: "醇類", b: true }, "芳樟醇 Linallol、［香茅醇 Citronellol］", "［薄荷腦 Menthol★★］", "［龍腦 Borneol★★］、［Pinene］"],
            [{ t: "醛類", b: true }, "［檸檬醛 Citral］", "桂皮油 Cinnamaldehyde、檸檬油精 Limonene、香草醛 Vanillin", "--"],
            [{ t: "酮類", b: true }, "--", "藏茴香酮 Carvone", "［樟腦 Camphor★］"],
            [{ t: "酚類", b: true }, "--", "［麝香草酚 Thymol★★］、丁香油酚 Eugenol、［茴香 Anethole］", "［桉油酚 Cineole］"],
            [{ t: "醚類", b: true }, "--", "--", "肉豆蔻醚 Myristicin"]
          ],
          note: "［ ］＝講義上框起來的 Monoterpenoids" },
        points: [
          "非環類醇類：芳樟醇 Linallol、香茅醇 {{Citronellol|成分|Citral/Carvone/Borneol}}",
          "非環類醛類：檸檬醛 {{Citral|成分|Limonene/Citronellol/Vanillin}}",
          "單環類酮類：藏茴香酮 {{Carvone|成分|Camphor/Citral/Cineole}}；雙環類酮類：樟腦 Camphor★",
          "雙環類醚類：肉豆蔻醚 {{Myristicin|成分|Anethole/Eugenol/Safrole}}"
        ] },
      { title: "來源：植物科別與特化的分泌構造", source: SRC7 + " p.50",
        points: [
          "唇形科（Lamiaceae）★★：{{腺毛|名詞|油管/柔細胞/離生通道}}（Glandular hairs）★★（例：薄荷）",
          "胡椒科（Piperaceae）：經修飾的{{柔細胞|名詞|腺毛/油管/離生通道}}（parenchyma cell）",
          "繖形科（Apiaceae/Umbelliferae）：稱做{{油室|名詞|腺毛/柔細胞/破生通道}}（vittae）的油管（oil-tubes）（例：丁香）",
          "松柏科（Pinaceae）、芸香科（Rutaceae）：{{離生通道或是破生通道|名詞|腺毛/油室/柔細胞}}（Schizogenous、Lysigenous passages）"
        ] },
      { title: "特性", source: SRC7 + " p.50",
        points: [
          "分離揮發油，冷卻、析出後為固體結晶：{{Stearoptene|名詞|Eleoptene/Meroterpenoids/Oleoresin}}（硬脂腦）：(-)-menthol、Thymol、(E)-anethole",
          "分離揮發油，冷卻、析出後為液體：{{Eleoptene|名詞|Stearoptene/Oleoresin/Balsam}}（輕油精／揮發精油）",
          "比重大於水：{{Clove oil|生藥|Lemon oil/Peppermint oil/Orange oil}}、Japanese star anise oil、Chinese star anise oil"
        ] }
    ] },
    { id: "volatile-other", title: "揮發油：其他", items: [
      { title: "其他酯類揮發油", group: "Ester volatile oil", source: SRC7 + " p.53",
        points: [
          "其他酯類揮發油：Terpineol（松油醇）之醋酸鹽、Borneol（龍腦／冰片）之醋酸鹽、Geraniol（香葉醇）之醋酸鹽、芥子油（Mustard oil）中的 {{Allyl isothiocyanate|成分|Methyl salicylate/linalyl acetate/Enanthic alcohol}}"
        ] },
      { title: "詳見其他章", source: SRC7 + " p.52",
        points: [
          "酮類揮發油：樟腦 Camphor★★★（{{Cinnamomun camphora|學名|Mentha spicata/Thymus vulgaris/Dipteryx oppositifolia}}，樟科，樟樹樹幹）：詳見單萜（第 5 章）",
          "氧化型揮發油：香豆素 Coumarin（Dipteryx oppositifolia，{{豆科|科別|唇形科/樟科/桃金孃科}} Leguminosae，種子）：講義寫「詳見配醣體」（格子在第 3 章簡單類苯基丙烷）"
        ] }
    ] }
  ]
};

/* ================= 第 7 章：樹脂及樹脂類化合物（講義 p.54–56，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：樹脂、油樹脂、油膠樹脂、香膠。
   辣椒（油樹脂）的格子已在第 3 章，這裡不重複，只在知識樹提到。 */
PI.CHAPTERS.push({ id: 7, name: "樹脂", cat: "pharmacognosy", estimate: 16, unitType: "drug", note: "講義：樹脂及樹脂類化合物（p.54–56）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(7);

const SRC8 = "樹脂講義";
PI.UNITS.push(
  /* ===== 樹脂 Resins（p.54）===== */
  { id: "rosin", chapter: 7, name: "Rosin", type: "drug", group: "Resins", generation: "講義標示 ★★", source: SRC8 + " p.54",
    names: ["中文：{{松香|生藥中文名}}", "別名：colophony"],
    origin: ["{{Pinus palustris|學名}}"], family: ["{{松科|科別}} Pinaceae"], part: ["{{固體樹脂|部位}}"],
    constituents: ["Resin acid：{{Anhydride abietic acid|成分}}（無水松香酸），以{{醇|試劑}}處理可得 crystalline abietic acid"],
    uses: ["{{硬化劑|用途}}、硬膏基劑、拌創膏、亮光劑", "{{蒸餾|製法}} {{turpentine|生藥}} 可得"] },
  { id: "eriodictyon", chapter: 7, name: "Eriodictyon", type: "drug", group: "Resins", source: SRC8 + " p.54",
    names: ["中文：{{北美聖草|生藥中文名}}", "別名：yerba santa"],
    origin: ["{{Eriodictyon californicum|學名}}"], family: ["{{田亞麻科|科別}} Hydrophyllaceae"], part: ["{{乾燥葉|部位}}"],
    constituents: ["Resin", "{{Eriodictyol|成分}}（聖草苷）：eriodictin 的{{非糖部分|結構}}"],
    uses: ["矯味劑：掩飾 {{quinine|藥物}} 之苦味", "{{刺激性祛痰劑|用途}}、治氣喘"] },
  { id: "jalap", chapter: 7, name: "Jalap", type: "drug", group: "Resins", source: SRC8 + " p.54",
    names: ["中文：{{藥喇叭|生藥中文名}}"],
    origin: ["{{Exogonium purga|學名}}"], family: ["{{旋花科|科別}} Convolvulaceae"], part: ["{{乾燥塊根|部位}}"],
    constituents: ["Resin，含數種{{糖樹脂|成分}}（glycoresins）"],
    uses: ["{{瀉劑|用途}}（cathartic）"] },
  { id: "mastic", chapter: 7, name: "Mastic", type: "drug", group: "Resins", source: SRC8 + " p.54",
    names: ["中文：{{乳香|生藥中文名}}", "別名：mastich、mastiche"],
    origin: ["{{Pistacia lentiscus|學名}}"], family: ["{{漆樹科|科別}} Anacardiaceae"], part: ["{{樹脂滲出物|部位}}"],
    constituents: ["Resin：α-resin（{{可溶於酒精|性質}}）、β-resin（{{不溶於酒精|性質}}）"],
    uses: ["{{補牙材料|用途}}"] },
  { id: "kava", chapter: 7, name: "Kava", type: "drug", group: "Resins", source: SRC8 + " p.54",
    names: ["中文：{{卡法椒|生藥中文名}}"],
    origin: ["{{Piper methysticum|學名}}"], family: ["{{胡椒科|科別}} Piperaceae"], part: ["{{根莖及根|部位}}"],
    constituents: ["Resin（5~10%），可分出 {{6|數值}} 種 {{Stryrylpyrones|成分}}（例：dihydromethysticin）"],
    uses: ["{{中樞性骨骼肌鬆弛劑|用途}}、{{局部麻醉|用途}}、解熱劑"] },
  { id: "cannabis", chapter: 7, name: "Cannabis", type: "drug", group: "Resins", source: SRC8 + " p.54",
    names: ["中文：{{印度大麻|生藥中文名}}", "別名：Marihuana、hashish、Indian hemp、pot"],
    origin: ["{{Cannabis sativa|學名}}"], family: ["{{桑科|科別}} Moraceae"], part: ["{{雌株的乾燥花梢|部位}}"],
    constituents: ["迷幻成分★：{{Δ⁹-THC|成分}}（9-trans-tetrahydrocannabinol）：亦稱 {{Dronabinol|藥物}}，可用於{{化療止吐|用途}}、促進食慾（可用於 AIDS 患者）",
      "迷幻成分★：Δ⁸-THC", "鎮靜成分：{{Cannabichomene|成分}}、Cannabidiolic acid"] },

  /* ===== 油樹脂 Oleoresins（p.55）===== */
  { id: "turpentine", chapter: 7, name: "Turpentine", type: "drug", group: "Oleoresins", generation: "講義標示 ★", source: SRC8 + " p.55",
    names: ["中文：{{松節油脂|生藥中文名}}", "別名：gum turpentine"],
    origin: ["{{Pinus palustris|學名}}"], family: ["{{松科|科別}} Pinaceae"], part: ["{{導管分泌的油樹脂|部位}}"],
    constituents: ["{{α-pinene|成分}}（主成分）、β-pinene", "經{{蒸汽蒸餾|製法}}後除去 15~30% 揮發油，殘渣再經熱過濾可製得{{松香（rosin）|生藥中文名}}"],
    uses: ["{{抗刺激劑|用途}}"] },
  { id: "ginger", chapter: 7, name: "Ginger", type: "drug", group: "Oleoresins", generation: "講義標示 ★★", source: SRC8 + " p.55",
    names: ["中文：{{薑|生藥中文名}}"],
    origin: ["{{Zingiber officinale|學名}}"], family: ["{{薑科|科別}} Zingiberaceae"], part: ["{{乾燥根莖|部位}}"],
    constituents: ["揮發油（{{倍半萜類|結構}}）：為香味來源：Bisabolene、{{Zingiberene|成分}}、Zingiberol",
      "油樹脂（芳香酮）：具{{辛辣刺激味|性質}}：{{Zingerone|成分}}★★、{{Shogaol|成分}}", "含 {{50%|數值}} 以上的澱粉"],
    uses: ["矯味劑、祛風劑", "{{刺激劑|用途}}", "{{止吐劑|用途}}"] },

  /* ===== 油膠樹脂 Oleo-gum-resins（p.55）===== */
  { id: "myrrh", chapter: 7, name: "Myrrh", type: "drug", group: "Oleo-gum-resins", source: SRC8 + " p.55",
    names: ["中文：{{沒藥|生藥中文名}}", "別名：gum myrrh"],
    origin: ["{{Commiphora molmol|學名}}", "Commiphora abyssinica"], family: ["{{橄欖科|科別}} Burseraceae"], part: ["{{樹皮滲出物|部位}}"],
    constituents: ["樹膠（60%）：可溶：可產生 {{Arabinose|成分}}；不可溶：具{{苦味|性質}}", "樹脂（25~40%）：{{resin acid、resenes|成分}}", "揮發油（2.5~8%）：為{{香味來源|性質}}"],
    uses: ["保護劑、刺激劑", "{{健胃劑|用途}}", "{{收斂劑|用途}}（漱口水）"] },
  { id: "asafetida", chapter: 7, name: "Asafetida", type: "drug", group: "Oleo-gum-resins", source: SRC8 + " p.55",
    names: ["中文：{{阿魏|生藥中文名}}", "別名：devil's dung（魔鬼的糞便）"],
    origin: ["{{Ferula assfoetida|學名}}"], family: ["{{繖形科|科別}} Apiaceae"], part: ["{{根莖滲出物|部位}}"],
    constituents: ["樹膠：阿魏酸（{{ferulic acid|成分}}）", "揮發油：{{isobutylpropanyl disulphide|成分}}（{{臭味|性質}}）"],
    uses: ["驅風劑、祛痰劑、緩瀉劑、{{抗痙攣劑|用途}}"] },

  /* ===== 香膠 Balsams（p.56）===== */
  { id: "storax-levant", chapter: 7, name: "Storax (Levant)", short: "亞洲蘇合香", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：蘇合香：{{亞洲蘇合香|生藥中文名}}", "別名：Storax、Styrax、Levant"],
    origin: ["{{Liquidambar orientalis|學名}} Miller"], family: ["{{金縷梅科|科別}} Hamamelidaceae"], part: ["{{樹幹|部位}}"],
    constituents: ["Resin alcohol：{{α-storesin、β-storesin|成分}}", "{{phenylpropyl cinnamate|成分}}：具特殊香味（{{不含 benzoic acid|性質}}）"],
    uses: ["製造{{安息香酊|用途}}", "刺激劑、祛痰劑、防腐劑", "{{香菸矯味劑|用途}}（Flavoring cigarettes）"] },
  { id: "storax-american", chapter: 7, name: "Storax (American)", short: "美國蘇合香", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：蘇合香：{{美國蘇合香|生藥中文名}}", "別名：Storax、Styrax、American"],
    origin: ["{{Liquidambar styraciflua|學名}} Linné"], family: ["{{金縷梅科|科別}} Hamamelidaceae"], part: ["{{樹幹|部位}}"],
    constituents: ["Resin alcohol：α-storesin、β-storesin", "phenylpropyl cinnamate：具特殊香味（不含 benzoic acid）"],
    uses: ["製造安息香酊", "刺激劑、祛痰劑、防腐劑", "香菸矯味劑（Flavoring cigarettes）"] },
  { id: "peruvian-balsam", chapter: 7, name: "Peruvian Balsam", short: "Peru Balsam", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：{{祕魯香膠|生藥中文名}}", "別名：peru balsam"],
    origin: ["{{Myroxylon pereirae|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{樹幹|部位}}"],
    constituents: ["{{油多酯少|性質}}", "{{Cinnamein|成分}}（60%）：{{benzyl cinnamate|成分}}", "Resin ester（樹脂酯）（30%）"],
    uses: ["治療{{痔瘡|疾病}}（收斂作用）", "{{發紅劑|用途}}", "皮膚病之{{殺寄生蟲劑|用途}}"] },
  { id: "tolu-balsam", chapter: 7, name: "Tolu Balsam", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：{{吐魯香膠|生藥中文名}}"],
    origin: ["{{Myroxylon balsamum|學名}}"], family: ["{{豆科|科別}} Fabaceae"], part: ["{{樹幹|部位}}"],
    constituents: ["{{酯多油少|性質}}", "Resin ester（80%）：{{Toluresinotannol|成分}} cinnamate（多）、benzoate（少）", "Cinnamein（7~8%）"],
    uses: ["製造安息香酊", "{{祛痰劑|用途}}", "矯味劑（{{口香糖原料|用途}}、藥用糖漿、香水）"] },
  { id: "benzoin-siam", chapter: 7, name: "Benzoin (Siam)", short: "暹羅安息香", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：安息香：{{暹羅安息香|生藥中文名}}", "別名：Benzoin、香醋香酯、Siam"],
    origin: ["{{Styrax tonkinensis|學名}}"], family: ["{{安息香科|科別}} Styraceae"], part: ["{{樹幹|部位}}"],
    constituents: ["Alc-soluble extract（> {{90%|數值}}）", "{{coniferyl benzoate|成分}}"],
    uses: ["{{香水|用途}}", "製造{{安息香酊|用途}}"] },
  { id: "benzoin-sumatra", chapter: 7, name: "Benzoin (Sumatra)", short: "蘇門答臘安息香", type: "drug", group: "Balsams", source: SRC8 + " p.56",
    names: ["中文：安息香：{{蘇門答臘安息香|生藥中文名}}", "別名：Benzoin、香醋香酯、Sumatra"],
    origin: ["{{Styrax benzoin|學名}}"], family: ["{{安息香科|科別}} Styraceae"], part: ["{{樹幹|部位}}"],
    constituents: ["Alc-soluble extract（> {{75%|數值}}）", "{{cinnamic acid、benzoic acid|成分}}"],
    uses: ["藥用：{{防腐劑、祛痰劑、利尿劑|用途}}", "製造安息香酊"] }
);

/* 知識樹：照講義的黑色標題分段 */
PI.KNOWLEDGE.ch7 = {
  chapter: 7, title: "樹脂",
  sections: [
    { id: "resin", title: "參、樹脂及樹脂類化合物", items: [
      { title: "成分分類與特性", source: SRC8 + " p.54",
        table: {
          head: ["分類", "組成", "生藥"],
          rows: [
            [{ t: "樹脂（Resins）", b: true }, "多種物質", "松香（Rosin）、北美聖草（Eriodictyon）、乳香（Mastic）、印度大麻（Cannabis）、卡法椒（Kava）、藥喇叭（Jalap）"],
            [{ t: "油樹脂（Oleoresins）", b: true }, "樹脂和揮發油", "松節油脂（Turpentine）、薑（Ginger）、辣椒（Capsicum）"],
            [{ t: "油膠樹脂（Oleo-gum-resins）", b: true }, "油樹脂和樹膠", "沒藥（Myrrh）、阿魏（Asafetida）"],
            [{ t: "香膠（Balsams）", b: true }, "肉桂酸（cinnamic acid）、苯甲酸或此二者之酯類的樹脂", "祕魯香膠（Peruvian Balsam）、吐魯香膠（Tolu Balsam）、安息香（Benzoin）"],
            [{ t: "苷樹脂（Glycoresins）", b: true }, "樹脂和糖基", "配醣體"]
          ] },
        points: [
          "油樹脂（Oleoresins）：由樹脂和{{揮發油|成分|樹膠/糖基/肉桂酸}}組成，如松節油脂、薑、辣椒",
          "油膠樹脂（Oleo-gum-resins）：由{{油樹脂和樹膠|成分|樹脂和揮發油/樹脂和糖基/肉桂酸和苯甲酸}}組成，如沒藥、阿魏",
          "香膠（Balsams）：含肉桂酸（cinnamic acid）、{{苯甲酸|成分|阿魏酸/松香酸/沒食子酸}}或此二者之酯類的樹脂",
          "苷樹脂（Glycoresins）：由樹脂和{{糖基|成分|揮發油/樹膠/肉桂酸}}組成"
        ] },
      { title: "油樹脂：辣椒（格子在第 3 章）", group: "Oleoresins", source: SRC8 + " p.55",
        points: [
          "辣椒 Capsicum（{{Capsicum annum|學名|Zingiber officinale/Pinus palustris/Piper methysticum}}，茄科，果實）：Capsaicin★：辛辣成分，{{酚類|結構|醇類/酮類/醚類}}（藉耗盡痛覺傳遞物質 {{substance P|標的|serotonin/histamine/PAF}} 止痛）",
          "辣椒用途：調味劑、刺激劑、祛風劑"
        ] },
      { title: "其他：複方安息香酊（compound benzoin tincture）", group: "Balsams", source: SRC8 + " p.56",
        points: [
          "成分：Aloe（蘆薈）、Benzoin（安息香）、{{Storax（蘇合香）|生藥|Myrrh（沒藥）/Mastic（乳香）/Rosin（松香）}}、Tolu balsam（吐魯香膠）",
          "功效：局部保護劑，當蒸發時可作為有效的{{祛痰劑|用途|收斂劑/瀉劑/局部麻醉劑}}"
        ] }
    ] }
  ]
};

/* ================= 第 8 章：類固醇（講義 p.57–58，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：Sterol 類、膽固醇合成抑制劑、膽石溶解藥物。 */
PI.CHAPTERS.push({ id: 8, name: "類固醇", cat: "pharmacognosy", estimate: 12, unitType: "drug", note: "講義：類固醇（p.57–58）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(8);

const SRC9 = "類固醇講義";
PI.UNITS.push(
  /* ===== Sterol 類（p.58）===== */
  { id: "cholesterol", chapter: 8, name: "Cholesterol", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：{{膽固醇|生藥中文名}}"],
    origin: ["{{人類的膽結石、動物細胞膜|來源}}"],
    uses: ["{{羊毛脂|生藥中文名}}（Lanolin），常用於化妝品、軟膏基劑"] },
  { id: "ergosterol", chapter: 8, name: "Ergosterol", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：{{麥角固醇|生藥中文名}}", "別名：Provitamin D2"],
    origin: ["{{真菌|來源}}"],
    uses: ["研究指出可能有{{抗癌|用途}}功效"] },
  { id: "beta-sitosterol", chapter: 8, name: "β-sitosterol", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：β-sitosterol", "別名：stigmast-5-en-3β-ol"],
    origin: ["{{植物|來源}}"],
    uses: ["降 {{LDL|標的}}、緩解 {{BPH|疾病}} 的症狀、可能免疫有幫助"] },
  { id: "stigmasterol", chapter: 8, name: "Stigmasterol", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：Stigmasterol（豆脂醇）"],
    origin: ["{{毒扁豆、大豆油|來源}}"],
    uses: ["人工 {{progesterone|藥物}} 的前驅物、人工 {{cortisone|藥物}} 的原料"] },
  { id: "cholecalciferol", chapter: 8, name: "Cholecalciferol", short: "Vit D₃", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：Cholecalciferol", "別名：{{Vitamin D₃|名詞}}"],
    origin: ["儲存在組織中（例：肝臟、皮膚），如{{魚肝油|生藥中文名}}"],
    uses: ["{{7-dehydro-cholesterol|成分}}（provitamin D₃）在人體的皮膚中會經由{{光照|反應}}轉換成"] },
  { id: "ergocalciferol", chapter: 8, name: "Ergocalciferol", short: "Vit D₂", type: "drug", group: "Sterols", source: SRC9 + " p.58",
    names: ["中文：Ergocalciferol", "別名：{{Vitamin D₂|名詞}}"],
    origin: ["從{{麥角固醇|生藥中文名}}（ergosterol）衍生而來"],
    uses: ["Ergosterol 在{{體外|名詞}}經由{{紫外光照射|反應}}後，經 isomerizations 異構化形成"] },

  /* ===== 膽固醇合成抑制劑（Statin）：HMG-CoA reductase inhibitor（p.58）===== */
  { id: "mevastatin", chapter: 8, name: "Mevastatin", type: "drug", group: "Statins", source: SRC9 + " p.58",
    names: ["中文：Mevastatin", "別名：{{compactin|名詞}}"],
    origin: ["{{Penicillium citrinum|學名}}", "P. brevicompactum"], family: ["{{髮菌科|科別}} Trichocomaceae"],
    uses: ["抑制膽固醇的生合成、降低人體內 LDL"] },
  { id: "lovastatin", chapter: 8, name: "Lovastatin", type: "drug", group: "Statins", source: SRC9 + " p.58",
    names: ["中文：Lovastatin", "別名：{{mevinolin|名詞}}"],
    origin: ["{{Aspergillus terreus|學名}}：{{麴菌科|科別}} Aspergillaceae", "{{Monascus ruber|學名}}：{{大團囊菌科|科別}} Elaphomycetaceae"],
    family: ["麴菌科 Aspergillaceae", "大團囊菌科 Elaphomycetaceae"],
    uses: ["抑制膽固醇的生合成、降低人體內 LDL"] },
  { id: "simvastatin", chapter: 8, name: "Simvastatin", type: "drug", group: "Statins", source: SRC9 + " p.58",
    names: ["中文：Simvastatin"],
    origin: ["{{Aspergillus terreus|學名}}"], family: ["{{髮菌科|科別}} Trichocomaceae"],
    uses: ["抑制膽固醇的生合成、降低人體內 LDL"] },
  { id: "pravastatin", chapter: 8, name: "Pravastatin", type: "drug", group: "Statins", source: SRC9 + " p.58",
    names: ["中文：Pravastatin"],
    origin: ["{{Streptomyces carpophilus|學名}}"], family: ["{{鏈黴菌科|科別}} Streptomycetaceae"],
    uses: ["抑制膽固醇的生合成、降低人體內 LDL"] },

  /* ===== 膽石溶解藥物 cholelitholytic agent（p.58）===== */
  { id: "chenodiol", chapter: 8, name: "Chenodiol", type: "drug", group: "Cholelitholytic agents", source: SRC9 + " p.58",
    names: ["中文：Chenodiol", "別名：{{chenodeoxycholic acid|名詞}}"],
    origin: ["{{人膽天然製造／人工合成|來源}}"],
    uses: ["抑制{{肝臟合成膽固醇|作用}}，以降低膽固醇飽和度，將{{未鈣化|性質}}的膽結石逐步溶解", "代謝後產物顯示出有{{肝毒性|副作用}}"] },
  { id: "ursodiol", chapter: 8, name: "Ursodiol", type: "drug", group: "Cholelitholytic agents", source: SRC9 + " p.58",
    names: ["中文：Ursodiol", "別名：ursodeoxycteoxycholic acid"],
    origin: ["人膽（少量）、特定種類的{{熊|來源}}（大量）"],
    uses: ["{{減少肝毒性|性質}}"] }
);

PI.KNOWLEDGE.ch8 = {
  chapter: 8, title: "類固醇",
  sections: [
    { id: "steroid", title: "肆、類固醇", items: [
      { title: "合成與代謝", source: SRC9 + " p.57",
        points: [
          "合成途徑：{{Acetate-Mevalonate pathway|反應|Acetate-Malonate pathway/Shikimic acid pathway/Mannich-type condensation}}（與萜類生合成相似，前端反應皆相同）；前驅物：Acetate",
          "中間產物：Mevalonate、Isopentenyl pyrophosphate（IPP）、{{Squalene|中間產物|Phytoene/Geraniol/Retinol}}、(3S)-2,3-oxidosqualene、lanosterol；產物：Cholesterol（{{27C|數值|30C/24C/21C}}）",
          "複習：2 個 IPP（5C）與 3,3-dimethylallyl pyrophosphate（5C）相接形成 Farnesyl pyrophosphate；兩個 Farnesyl pyrophosphate（15C）相接形成 Squalene（{{30C|數值|27C/20C/40C}}）",
          "(1) Squalene 經 {{squalene epoxidase|酵素|lanosterol cyclase/HMG-CoA reductase/squalene synthase}} 氧化，產生第一個環狀前驅物 (3S)-2,3-oxidosqualene",
          "(2) (3S)-2,3-oxidosqualene 經 {{lanosterol cyclase|酵素|squalene epoxidase/HMG-CoA reductase/7α-dehydroxylase}} 環化，形成 lanosterol",
          "(3) 30C 的 {{Lanosterol|中間產物|Squalene/Cycloartenol/Ergosterol}} 生成最終產物 27C 的 cholesterol"
        ] },
      { title: "結構與分類", source: SRC9 + " p.57",
        table: {
          head: ["", "A/B 環", "B/C 環", "C/D 環"],
          rows: [
            [{ t: "強心配醣體", b: true }, "cis", "trans", "cis"],
            [{ t: "膽酸", b: true }, "cis", "cis", "trans"],
            [{ t: "性荷爾蒙", b: true }, "trans", "trans", "trans"]
          ] },
        points: [
          "基本結構：{{Cyclo-pentane-perhydro-phenathrene|結構|Isoprene/Naphthalene/Anthracene}}",
          "碳數編號：ABD {{逆|結構|順/交錯/對稱}}、C 順",
          "C3 接 {{OH|結構|醣基/支鏈/甲基}}（與其他醣基相接形成配醣體）；C17 接支鏈（β-orineted）",
          "立體組態：8β、9α、10β、13β、{{14α|結構|14β/9β/10α}}",
          "膽酸的 A/B、B/C、C/D 環分別為 {{cis、cis、trans|結構|cis、trans、cis/trans、trans、trans/trans、cis、cis}}；性荷爾蒙皆為 trans",
          "分類：固醇類 Sterols、膽固醇合成抑制劑 Cholesterol Biosynthesis Inhibitors、膽酸 {{Bile acids|分類|Saponins/Cardenolides/Carotenoids}}"
        ] },
      { title: "膽固醇合成抑制劑（Statin）", group: "Statins", source: SRC9 + " p.58",
        points: [
          "Statin 為 {{HMG-CoA reductase|標的|squalene epoxidase/lanosterol cyclase/7α-dehydroxylase}} inhibitor：抑制膽固醇的生合成、降低人體內 LDL"
        ] },
      { title: "膽酸生合成", group: "Cholelitholytic agents", source: SRC9 + " p.58",
        points: [
          "肝臟合成初級膽酸 cholic acid 和 {{chenodeoxycholic acid|成分|Deoxycholic acid/Lithocholic acid/ursodeoxycholic acid}}",
          "腸道微生物進行 {{7α-deoxygenation|反應|3β-hydroxylation/epoxidation/isomerization}}，將初級膽酸轉換成 Deoxycholic acid 和 Lithocholic acid"
        ] }
    ] }
  ]
};

/* ================= 第 9 章：健康食品（講義 p.59–60，只用印刷字） =================
   放在生藥島；小分類照講義的表格標題：心血管保護、器官保護；免疫調節、生理調節。
   洋甘菊、小白菊、青蒿（萜類）、水飛薊、銀杏、紫錐花、聖約翰草的格子已在前面章節，這裡不重複，健康食品講義的版本放在知識樹。 */
PI.CHAPTERS.push({ id: 9, name: "健康食品", cat: "pharmacognosy", estimate: 7, unitType: "drug", note: "講義：健康食品（p.59–60）。依講義的印刷字。" });
PI.LANDMASSES.find(l => l.id === "pharmacognosy").chapters.push(9);

const SRC10 = "健康食品講義";
PI.UNITS.push(
  /* ===== 心血管保護、器官保護（p.59）===== */
  { id: "eleutherococcus", chapter: 9, name: "Eleutherococcus", short: "Siberian Ginseng", type: "drug", group: "Cardiovascular & Organ Protection", source: SRC10 + " p.59",
    names: ["中文：{{刺五加|生藥中文名}}", "別名：Eleutheroco senticosus、Siberian Ginseng"],
    origin: ["{{Acanthopanax senticosus|學名}}（三葉五加）"], family: ["{{五加科|科別}} Araliaceae"], part: ["{{根|部位}}（皮可另製{{五加皮|生藥中文名}}）"],
    constituents: ["{{Eleutheroside M|成分}}（刺五加苷）"],
    uses: ["{{適應原|用途}}（adaptogen）：增強有氧能力，延長耐力，抗疲勞", "改善{{空腹血糖與降血脂|用途}}"] },
  { id: "grape-seed", chapter: 9, name: "Grape seed", type: "drug", group: "Cardiovascular & Organ Protection", source: SRC10 + " p.59",
    names: ["中文：{{葡萄籽|生藥中文名}}"],
    origin: ["{{Vitis vintaceae|學名}}"], family: ["{{葡萄科|科別}} Vitaceae"], part: ["{{種子|部位}}"],
    constituents: ["白藜蘆醇二聚體（{{Resveratrol dimer|成分}}）：{{ε-viniferin|成分}}"],
    uses: ["{{COX-2|標的}} 抑制", "強化血管、修復並強化牙體，{{預防蛀牙|用途}}"] },
  { id: "hawthorn", chapter: 9, name: "Hawthorn", type: "drug", group: "Cardiovascular & Organ Protection", source: SRC10 + " p.59",
    names: ["中文：{{歐山楂|生藥中文名}}"],
    origin: ["{{Crataegus oxyacantha|學名}}"], family: ["{{薔薇科|科別}}"], part: ["{{花、葉|部位}}"],
    constituents: ["{{Procyanidin|成分}}：{{反轉錄酶抑制劑|作用}}", "{{Cinnamtannin A|成分}}：抗氧化"],
    uses: ["{{強心護心劑|用途}}、預防動脈粥狀硬化，降低血壓"] },
  { id: "horse-chestnut", chapter: 9, name: "Horse chestnut", short: "Horse chestnut", type: "drug", group: "Cardiovascular & Organ Protection", source: SRC10 + " p.59",
    names: ["中文：{{馬栗|生藥中文名}}（歐七葉）"],
    origin: ["{{Aesculus hippocastanum|學名}}"], family: ["{{七葉樹科|科別}} Hippocastanaceae"], part: ["{{種子|部位}}"],
    constituents: ["七葉素（{{aescin|成分}}）：促進{{前列腺素|標的}}製造釋放，促進{{靜脈收縮|作用}}"],
    uses: ["緩解{{靜脈屈張及水腫|疾病}}", "能抗發炎但導致過敏，{{禁止兒童使用|性質}}"] },
  { id: "saw-palmetto", chapter: 9, name: "Saw Palmetto", type: "drug", group: "Cardiovascular & Organ Protection", source: SRC10 + " p.59",
    names: ["中文：{{沙巴棕|生藥中文名}}（鋸葉棕）"],
    origin: ["{{Serenoa repens|學名}}"], family: ["{{棕櫚科|科別}} Arecaceae"], part: ["{{果實|部位}}"],
    constituents: ["{{Glycerol 1-myristate|成分}}", "Glycerol 1-laurate"],
    uses: ["舒緩{{良性前列腺增生|疾病}}（BPH）（{{160mg|數值}}，每日二次，一個月）"] },

  /* ===== 免疫調節、生理調節（p.60）===== */
  { id: "evening-primrose-oil", chapter: 9, name: "Evening Primrose Oil", short: "EPO", type: "drug", group: "Immune & Physiological Regulation", source: SRC10 + " p.60",
    names: ["中文：{{月見草油|生藥中文名}}", "別名：EPO"],
    origin: ["{{Oenothera biennis|學名}}"], family: ["{{柳葉菜科|科別}} Onagraceae"], part: ["{{種子|部位}}"],
    constituents: ["{{γ-linolenic acid|成分}}（GLA）：{{Omega-6|結構}} 之必需脂肪酸，代謝成{{前列腺素|標的}}，抑制發炎和血小板凝集"],
    uses: ["緩解{{經前症候群|疾病}}", "改善{{風濕性關節炎|疾病}}（RA）", "{{多發性硬化症|疾病}}（multiplesclerosis）"] },
  { id: "red-yeast", chapter: 9, name: "Red yeast", short: "紅麴菌", type: "drug", group: "Immune & Physiological Regulation", source: SRC10 + " p.60",
    names: ["中文：{{紅麴菌|生藥中文名}}"],
    origin: ["{{Monascus purpureus|學名}} Went"], family: ["{{紅麴菌科|科別}} Monascaceae"],
    constituents: ["{{Lovastatin|成分}}（{{HMG-CoA inhibitor|標的}}）"],
    uses: ["降低{{膽固醇、三酸甘油脂|用途}}"] }
);

PI.KNOWLEDGE.ch9 = {
  chapter: 9, title: "健康食品",
  sections: [
    { id: "health-food", title: "伍、健康食品", items: [
      { title: "菊花茶：萜類（詳見萜類）★★★", source: SRC10 + " p.59",
        table: {
          head: ["生藥", "基源", "部位", "成分", "用途"],
          rows: [
            ["洋甘菊 Chamomile\n（Ginseng of Europe）", "Marticaria recutita（德國）\nChamaemelum nobile（羅馬）", "乾燥的頭狀花", "(-)-α-Bisabolol、(-)-α-Bisaboloxides、Matricin", "抗發炎、解痙"],
            ["小白菊 Feverfew", "Tanacetum parthenium", "葉", "Parthenolide", "抑制 Serotonin 從血小板釋放"],
            ["青蒿 Artemisinin", "Artemisia annua", "葉和花頂", "Artemisinin", "抗瘧疾"]
          ],
          note: "三者皆為菊科 Asteraceae" },
        points: [
          "菊花茶的三種生藥皆為{{菊科|科別|唇形科/繖形科/薔薇科}} Asteraceae",
          "小白菊 Feverfew：成分 {{Parthenolide|成分|Artemisinin/Matricin/Bisabolol}}，抑制 Serotonin 從血小板釋放"
        ] },
      { title: "其他健康食品（格子在前面章節）", source: SRC10 + " p.59",
        table: {
          head: ["生藥", "基源", "科別", "部位", "成分", "用途"],
          rows: [
            ["水飛薊（乳薊）Milk Thistle", "Silybum marianum", "菊科 Asteraceae", "果實的冠毛", "Flavonolignan：Silymarin\nPhenylpropanoid：Silybin", "強力的抗氧化功能，治療慢性肝硬化、慢性肝炎"],
            ["銀杏（公孫樹）Ginkgo", "Ginkgo biloba", "銀杏科 Ginkgoaceae", "樹葉", "Ginkgolides、flavone glycosides", "抑制血小板活化因子（PAF），抗凝血預防血栓，改善末梢血液循環"],
            ["紫錐花 Purple cone flower\n（錐根、cone flower）", "Echinacea purpurea（歐洲）\nEchinacea ngustifolia、Echinacea pallida（美國）", "菊科 Asteraceae", "乾燥莖和根", "L-chicoric acid：增加吞噬細胞活性\nHeteroxyla：活化吞噬細胞\nArabinoglactan：促 TNF 釋放", "服用後快速刺激免疫系統（反覆發作中耳炎才需持續補充）"],
            ["聖約翰草 St John's wort\n（貫葉連翹、金絲桃）", "Hypericum perforatum", "金絲桃科", "花和葉（5：1）", "Hyperforin（金絲桃素）", "舒緩輕度和中度憂鬱症的症狀；CYP450 inducer"]
          ] },
        points: [
          "水飛薊（乳薊）：Flavonolignan：{{Silymarin|成分|Silybin/Hyperforin/aescin}}；Phenylpropanoid：Silybin；治療慢性肝硬化、慢性肝炎",
          "銀杏：抑制{{血小板活化因子（PAF）|標的|COX-2/HMG-CoA reductase/Serotonin}}，抗凝血預防血栓，改善末梢血液循環",
          "紫錐花：服用後快速刺激{{免疫系統|名詞|中樞神經/心血管/內分泌}}（反覆發作中耳炎才需持續補充）",
          "聖約翰草：成分 {{Hyperforin|成分|Hypericin/Silybin/aescin}}（金絲桃素），為 {{CYP450 inducer|作用|CYP450 inhibitor/MAO inhibitor/COX-2 inhibitor}}"
        ] }
    ] }
  ]
};
