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
  { id: 1, name: "生物鹼", cat: "pharmacognosy", estimate: 24, unitType: "drug", note: "講義：生物鹼（p.1–5）。依講義的印刷字，手寫和螢光筆沒有放進來。" }
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
      "Nicotine 穿皮或咀嚼製劑，用於{{戒菸|用途}}", "長期使用 Nicotine 會導致{{依賴性|副作用}}"] },
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
      "{{Paregoric|製劑}}（Camphorated opium tincture 複方鴉片樟腦酊）、{{Laudanum|製劑}}（Opium tincture 鴉片酊）可作為{{止瀉劑|用途}}"] }
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
            head: ["類別", "★前驅物", "★中間產物"],
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
      ] }
    ]
  }
};

/* 名詞小框框：講義上沒有印名詞解釋，先空著（只用講義上印的內容） */
PI.GLOSSARY = {};

/* 和平安符頁一樣：電腦版知識面板開大一點（樣式見 css/style.css 的 .is-amulet） */
document.documentElement.classList.add("is-amulet");
