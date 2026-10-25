/* PHARMA ISLAND：雲端同步（Supabase）
   登入後，這個科目的整份存檔（佔領的格子、答對紀錄、格子筆記、知識卡片的修改）會同步到雲端，
   電腦、手機用同一個 email 登入就看到同一份。沒登入時跟以前一樣只存在這台裝置的瀏覽器。
   - 資料表 public.island_saves：每個帳號、每個科目（PI.STORAGE_KEY）一列，RLS 只讓本人讀寫。
   - 合併規則在 js/state.js 的 merge：格子和答對紀錄取聯集；筆記和卡片修改每一筆以最後修改的為準。
   - 只在 GitHub Pages（*.github.io）和本機測試開啟；Claude 的預覽頁擋住對外連線，維持只存在瀏覽器。
   - 這裡放的是公開的 Project URL 和 publishable key（本來就會出現在網頁裡）；安全靠 RLS，不靠藏金鑰。 */
window.PI = window.PI || {};

PI.SYNC_CONFIG = PI.SYNC_CONFIG || {
  url: "",   // 例：https://xxxx.supabase.co
  key: "sb_publishable_Pegc7iFrv-z08_taecTFLw_QqpRZI67"    // publishable key（公開金鑰；安全靠資料表的 RLS）
};

PI.sync = (function () {
  const C = PI.SYNC_CONFIG, SUBJECT = PI.STORAGE_KEY || "pharma-island-v1", TABLE = "island_saves";
  const LIB = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.0/dist/umd/supabase.js";
  const host = location.hostname;
  const allowed = /\.github\.io$/.test(host) || host === "localhost" || host === "127.0.0.1";
  const enabled = !!(C.url && C.key) && allowed;
  let client = null, user = null, timer = null, busy = false, again = false;
  let status = enabled ? "還沒登入：進度只存在這台裝置"
    : !(C.url && C.key) ? "還沒設定雲端：進度只存在這台裝置" : "這個網址不能同步（請用 GitHub Pages 的網址）：進度只存在這台裝置";
  const listeners = [];
  const set = s => { status = s; listeners.forEach(fn => fn(status, user)); };

  function loadLib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((ok, bad) => { const s = document.createElement("script"); s.src = LIB; s.onload = ok; s.onerror = () => bad(new Error("同步元件載入失敗（沒有網路？）")); document.head.append(s); });
  }

  // 讀雲端 → 和這台裝置合併 → 寫回雲端（每次上傳都先讀，避免蓋掉另一台裝置剛存的）
  async function syncNow() {
    if (!client || !user) return;
    if (busy) { again = true; return; }
    busy = true; set("同步中…");
    try {
      const { data: row, error } = await client.from(TABLE).select("data").eq("subject", SUBJECT).maybeSingle();
      if (error) throw error;
      const local = PI.state.snapshot();
      const merged = row && row.data ? PI.state.merge(local, row.data) : local;
      if (JSON.stringify(merged) !== JSON.stringify(local)) { PI.state.adopt(merged); afterRemote(); }
      if (!row || JSON.stringify(merged) !== JSON.stringify(row.data)) {
        const { error: e2 } = await client.from(TABLE).upsert({ user_id: user.id, subject: SUBJECT, data: merged, updated_at: new Date().toISOString() });
        if (e2) throw e2;
      }
      set(`已同步（${new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}）・${user.email}`);
    } catch (err) {
      set(`同步失敗，稍後會再試：${err.message || err}`);
    } finally {
      busy = false;
      if (again) { again = false; schedule(); }
    }
  }
  // 雲端的內容合併進來後：重套卡片修改、重畫知識面板（地圖和 EXP 由 state 的 onChange 處理）
  function afterRemote() {
    if (PI.edits) PI.edits.apply();
    if (PI.refreshKnowledge) PI.refreshKnowledge();
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(syncNow, 1500); }

  async function init() {
    if (!enabled) { set(status); return; }
    try {
      await loadLib();
      client = window.supabase.createClient(C.url, C.key, { auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" } });
      client.auth.onAuthStateChange((ev, session) => {
        const was = user && user.id; user = session ? session.user : null;
        if (!user) { set("還沒登入：進度只存在這台裝置"); return; }
        if (was !== user.id) setTimeout(syncNow, 0);   // 剛登入或打開網頁：先合併一次
      });
      PI.state.onSave(() => { if (user) schedule(); });
      window.addEventListener("online", () => user && syncNow());
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && user) syncNow(); });   // 切回這個分頁時拿另一台裝置的新進度
      const { data } = await client.auth.getSession();
      if (!data.session) set("還沒登入：進度只存在這台裝置");
    } catch (err) { set(String(err.message || err)); }
  }

  async function signIn(email) {
    if (!client) throw new Error("這個網址不能同步");
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true } });
    if (error) throw error;
  }
  async function signOut() { if (client) await client.auth.signOut(); user = null; set("已登出：進度只存在這台裝置"); }

  init();
  return { enabled, signIn, signOut, syncNow, onStatus(fn) { listeners.push(fn); fn(status, user); }, get user() { return user; } };
})();
