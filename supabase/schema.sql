-- PHARMA ISLAND：雲端同步用的資料表（給 js/sync.js 用）
-- 用法：Supabase 後台 → SQL Editor → 貼上整份 → Run。重複執行不會出錯。
-- 每個帳號、每個科目一列；RLS 只讓登入的本人讀寫自己的存檔。

create table if not exists public.island_saves (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  subject    text        not null,                 -- 科目存檔的 key（PI.STORAGE_KEY，例如 pharma-island-v1）
  data       jsonb       not null default '{}'::jsonb,   -- 整份存檔（PI.state.snapshot()）
  updated_at timestamptz not null default now(),
  primary key (user_id, subject)                   -- sync.js 的 upsert 靠這個主鍵判斷「同一份存檔」
);

alter table public.island_saves enable row level security;

-- 只有登入的使用者（authenticated）能用；沒登入的訪客（anon）完全碰不到
revoke all on public.island_saves from anon;
grant select, insert, update, delete on public.island_saves to authenticated;

drop policy if exists "read own saves"   on public.island_saves;
drop policy if exists "insert own saves" on public.island_saves;
drop policy if exists "update own saves" on public.island_saves;
drop policy if exists "delete own saves" on public.island_saves;

create policy "read own saves"   on public.island_saves for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "insert own saves" on public.island_saves for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "update own saves" on public.island_saves for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own saves" on public.island_saves for delete to authenticated
  using ((select auth.uid()) = user_id);
