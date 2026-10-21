-- Cross-device progress blob. RLS: a user may only read/write their own row.
create table if not exists public.user_workspace (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_workspace enable row level security;

drop policy if exists workspace_select_own on public.user_workspace;
create policy workspace_select_own
  on public.user_workspace for select
  using (auth.uid() = user_id);

drop policy if exists workspace_insert_own on public.user_workspace;
create policy workspace_insert_own
  on public.user_workspace for insert
  with check (auth.uid() = user_id);

drop policy if exists workspace_update_own on public.user_workspace;
create policy workspace_update_own
  on public.user_workspace for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
