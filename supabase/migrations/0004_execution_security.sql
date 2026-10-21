begin;

revoke insert, update, delete, truncate, references, trigger
  on public.submissions, public.problem_progress
  from anon, authenticated;
grant select on public.submissions, public.problem_progress to authenticated;

revoke insert, update, delete on public.groups, public.group_members from anon, authenticated;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_group_member(target_group uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.group_members gm
    where gm.group_id = target_group and gm.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_group_member(uuid) from public;
grant execute on function private.is_group_member(uuid) to authenticated;

create policy "members read their groups" on public.groups
  for select to authenticated using (private.is_group_member(id));
create policy "members read group membership" on public.group_members
  for select to authenticated using (private.is_group_member(group_id));

create table public.execution_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  status text not null check (status in (
    'COMPLETED', 'COMPILE_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'PROVIDER_ERROR'
  )),
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index execution_runs_user_created_idx on public.execution_runs (user_id, created_at desc);
alter table public.execution_runs enable row level security;
revoke all on public.execution_runs from anon, authenticated;
grant select on public.execution_runs to authenticated;
grant all on public.execution_runs to service_role;
create policy "users read own execution runs" on public.execution_runs
  for select to authenticated using ((select auth.uid()) = user_id);

create table public.execution_quotas (
  user_id uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  used integer not null check (used between 1 and 30),
  primary key (user_id, window_start)
);
alter table public.execution_quotas enable row level security;
revoke all on public.execution_quotas from anon, authenticated;
grant all on public.execution_quotas to service_role;

create or replace function public.consume_execution_quota(target_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare consumed integer;
begin
  insert into public.execution_quotas (user_id, window_start, used)
  values (target_user, date_trunc('hour', now(), 'UTC'), 1)
  on conflict (user_id, window_start)
  do update set used = public.execution_quotas.used + 1
    where public.execution_quotas.used < 30
  returning used into consumed;
  return consumed is not null;
end;
$$;

revoke all on function public.consume_execution_quota(uuid) from public, anon, authenticated;
grant execute on function public.consume_execution_quota(uuid) to service_role;

commit;
