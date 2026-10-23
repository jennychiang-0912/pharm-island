/* PHARMA ISLAND：學習單元（藥物、製劑、分類、主題）
   一個單元＝島上的一格。章節與地圖格子分開管理：這裡只放單元資料，格子位置由 js/map.js 自動配置。

   格式：
   { id: "vancomycin",        // 唯一 ID（英數與連字號），之後不要改，進度會跟著它
     chapter: 3,              // 對應 PI.CHAPTERS 的 id
     name: "Vancomycin",      // 顯示名稱
     type: "drug",            // drug 藥物、preparation 製劑、category 分類、topic 主題
     group: "Glycopeptides" } // 選填：同一組的單元擴張時會盡量排在一起

   規則：
   - 只能往後加，不要插在中間或刪掉，已配置的格子位置才不會變。
   - 某章的單元數少於 estimate 時，剩下的位置是「預留格」；新單元會依序填進預留格，超過預估才往外擴張。
   - 正式資料還沒提供，所以目前是空的，沒有虛構任何藥物。 */
window.PI = window.PI || {};

PI.UNIT_TYPES = { drug: "藥物", preparation: "製劑", category: "分類", topic: "主題" };

PI.UNITS = [];
