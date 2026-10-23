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
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch4: {
    chapter: 4, title: "蛋白質合成抑制劑",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch5: {
    chapter: 5, title: "抗分枝桿菌藥物",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch6: {
    chapter: 6, title: "抗黴菌藥",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
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
