/* PHARMA ISLAND：合併多科目用的共用工具（給之後「五大洲」合併地圖用的）。
   單獨開啟任一科的頁面（index/amulet/pharmaceutics/analysis/medchem/pharmacognosy.html）完全不受影響：
   window.PI_MERGE_MODE 沒開的時候，下面兩支函式什麼都不做，跟今天的行為一模一樣。

   用法（每個 js/subjects/*.js 檔案都要加兩行）：
     - 檔案最開頭（window.PI = window.PI || {}; 之後）：PI.__stash = PI.stashForSubject();
     - 檔案最後面：                                    PI.mergeSubject("科目代號", PI.__stash);
   原理：
     - 單科頁面：stashForSubject 直接回傳 null，不動任何東西，這個檔案照舊「蓋掉」js/data.js 的預設資料、
       自己重新蓋一份，跟今天一樣。
     - 合併模式：stashForSubject 先把「前面科目已經疊好的資料」收走，把 PI.CATEGORIES／CHAPTERS／LANDMASSES／
       UNITS／KNOWLEDGE 清空，讓這個檔案的原始程式碼照舊「以為自己是唯一一科」正常執行一遍（章節號、格子 id
       都還是這個檔案原本的編號，不用改內容）。等這個檔案跑完，mergeSubject 把它剛蓋好的資料全部加上
       「科目代號:」前綴（章節 id、分類 id、島 id、格子 id、知識樹 key 都要跟著換，不然五科各自從 1 開始編的
       章節號會互相蓋掉），再跟前面科目收走的資料接在一起，放回 PI.CATEGORIES 等陣列。 */
window.PI = window.PI || {};

PI.stashForSubject = function () {
  if (!window.PI_MERGE_MODE) return null;
  const stash = {
    categories: PI.CATEGORIES || [],
    chapters: PI.CHAPTERS || [],
    landmasses: PI.LANDMASSES || [],
    units: PI.UNITS || [],
    knowledge: PI.KNOWLEDGE || {},
    clusters: PI.CLUSTERS || {},
    clusterRing: PI.CLUSTER_RING || {},
    clusterDir: PI.CLUSTER_DIR || {}
  };
  PI.CATEGORIES = [];
  PI.CHAPTERS = [];
  PI.LANDMASSES = [];
  PI.UNITS = [];
  PI.KNOWLEDGE = {};
  PI.CLUSTERS = {};
  PI.CLUSTER_RING = {};
  PI.CLUSTER_DIR = {};
  return stash;
};

/* 五大洲：每科的島疊到同一張地圖時，整科的小分類（cluster）都掛在以「科目代號」開頭的大洲底下，
   同科的島盡量黏在一起；window.PI_CONTINENT_ANGLE[key]（度，0 右、90 下、-90 上）決定這一整科
   大致要往地圖的哪個方向長，給每座島的 angle 加一個固定的偏移。 */
PI.mergeSubject = function (key, stash) {
  if (!window.PI_MERGE_MODE || !stash) return;
  const pfx = s => `${key}:${s}`;
  const catMap = new Map(), chMap = new Map(), clMap = new Map();
  const continentAngle = (window.PI_CONTINENT_ANGLE || {})[key] || 0;
  (PI.CATEGORIES || []).forEach(c => { catMap.set(c.id, pfx(c.id)); c.id = pfx(c.id); });
  (PI.CHAPTERS || []).forEach(c => {
    if (c.no == null) c.no = c.id;   // 畫面上顯示章節號用 ch.no（沒設就是原本乾淨的章節 id），不要顯示加了前綴的 ch.id
    chMap.set(c.id, pfx(c.id)); c.id = pfx(c.id);
    if (catMap.has(c.cat)) c.cat = catMap.get(c.cat);
  });
  (PI.LANDMASSES || []).forEach(l => {
    l.id = pfx(l.id);
    l.chapters = (l.chapters || []).map(id => chMap.get(id) ?? pfx(id));
    const oldCl = l.cluster, newCl = pfx(oldCl || "main");
    clMap.set(oldCl, newCl);
    l.cluster = newCl;
    l.angle = (l.angle || 0) + continentAngle;
  });
  (PI.UNITS || []).forEach(u => {
    u.id = pfx(u.id);
    if (chMap.has(u.chapter)) u.chapter = chMap.get(u.chapter);
  });
  const KN = {};
  Object.keys(PI.KNOWLEDGE || {}).forEach(k => {
    const K = PI.KNOWLEDGE[k];
    if (chMap.has(K.chapter)) K.chapter = chMap.get(K.chapter);
    KN[pfx(k)] = K;
  });
  const remapKeys = obj => { const out = {}; Object.keys(obj || {}).forEach(k => { out[clMap.get(k) ?? pfx(k)] = obj[k]; }); return out; };
  const CLUSTERS = remapKeys(PI.CLUSTERS), CLUSTER_RING = remapKeys(PI.CLUSTER_RING), CLUSTER_DIR = remapKeys(PI.CLUSTER_DIR);

  PI.CATEGORIES = stash.categories.concat(PI.CATEGORIES);
  PI.CHAPTERS = stash.chapters.concat(PI.CHAPTERS);
  PI.LANDMASSES = stash.landmasses.concat(PI.LANDMASSES);
  PI.UNITS = stash.units.concat(PI.UNITS);
  PI.KNOWLEDGE = Object.assign({}, stash.knowledge, KN);
  PI.CLUSTERS = Object.assign({}, stash.clusters, CLUSTERS);
  PI.CLUSTER_RING = Object.assign({}, stash.clusterRing, CLUSTER_RING);
  PI.CLUSTER_DIR = Object.assign({}, stash.clusterDir, CLUSTER_DIR);
};
