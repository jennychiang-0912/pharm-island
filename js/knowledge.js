/* PHARMA ISLAND：知識樹內容
   每一章一棵知識樹，長在那一章的初始格子上（抗微生物主島的第 1～8 章各一棵，第 9、10、11 章各一棵）。
   點樹會打開知識面板。這裡只放資料，依課堂講義慢慢補。
   - chapter：樹長在哪一章（對應 js/data.js 的 PI.CHAPTERS）。沒有列在這裡的章節不會長知識樹。
   - sections：面板裡的分段。可以改標題、增加或刪除分段。
   - items：每段裡的內容卡片，目前是空的。補內容時照下面的格式往 items 裡加：

       { title: "小標題",
         text: "一段說明文字（選填）",
         points: ["重點一", "重點二"],          // 條列重點（選填）
         source: "第 3 週講義 p.12" }           // 出處（選填，建議填，方便回去對照）

   內容只用講義上的資料；items 是空的時候，面板會顯示「尚未加入內容」。 */
window.PI = window.PI || {};

PI.KNOWLEDGE = {
  ch1: {
    chapter: 1, title: "抗菌藥物療法導論",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  ch2: {
    chapter: 2, title: "磺胺藥與泌尿道感染用藥",
    sections: [
      { id: "physiology", title: "生理與病理",         items: [] },
      { id: "mechanism",  title: "藥理機制",           items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
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
