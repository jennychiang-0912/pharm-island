/* PHARMA ISLAND：知識樹內容
   每座島一棵知識樹，點樹會打開知識面板。這裡只放資料，依課堂講義慢慢補。
   - 鍵（main、endo、resp、gi）對應 js/data.js 的 PI.LANDMASSES 的 id。沒有列在這裡的島不會長知識樹。
   - sections：面板裡的分段。可以改標題、增加或刪除分段。
   - items：每段裡的內容卡片，目前是空的。補內容時照下面的格式往 items 裡加：

       { title: "小標題",
         text: "一段說明文字（選填）",
         points: ["重點一", "重點二"],          // 條列重點（選填）
         source: "第 3 週講義 p.12" }           // 出處（選填，建議填，方便回去對照）

   內容只用講義上的資料；items 是空的時候，面板會顯示「尚未加入內容」。 */
window.PI = window.PI || {};

PI.KNOWLEDGE = {
  main: {
    title: "抗微生物藥物",
    sections: [
      { id: "physiology", title: "生理與病理",       items: [] },
      { id: "mechanism",  title: "藥理機制",         items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  endo: {
    title: "胰島素與口服降血糖藥",
    sections: [
      { id: "physiology", title: "生理與病理",       items: [] },
      { id: "mechanism",  title: "藥理機制",         items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  resp: {
    title: "呼吸系統用藥",
    sections: [
      { id: "physiology", title: "生理與病理",       items: [] },
      { id: "mechanism",  title: "藥理機制",         items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  },
  gi: {
    title: "腸胃道用藥",
    sections: [
      { id: "physiology", title: "生理與病理",       items: [] },
      { id: "mechanism",  title: "藥理機制",         items: [] },
      { id: "classes",    title: "藥物分類與作用原理", items: [] }
    ]
  }
};
