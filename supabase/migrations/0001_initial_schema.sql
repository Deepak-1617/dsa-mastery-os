create extension if not exists "pgcrypto";

create type public.topic_status as enum ('TO_DO', 'ONGOING', 'COMPLETED', 'NEEDS_REVISION');
create type public.difficulty as enum ('EASY', 'MEDIUM', 'HARD');
create type public.user_role as enum ('OWNER', 'ADMIN', 'MEMBER');
create type public.submission_status as enum (
  'QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'COMPILE_ERROR',
  'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'JUDGE_ERROR'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'Java',
  experience_level text,
  study_pace text,
  prefers_group_learning boolean not null default false,
  onboarding_completed boolean not null default false,
  goals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.preparation_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal_type text not null,
  target_date date,
  priority smallint not null default 3 check (priority between 1 and 5),
  notes text,
  topic_ids uuid[] not null default '{}',
  problem_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  phase smallint not null check (phase in (1, 2)),
  title text not null,
  description text not null default '',
  sort_order integer not null unique,
  prerequisites jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  slug text not null,
  title text not null,
  sort_order integer not null,
  content jsonb not null default '{}'::jsonb,
  content_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug),
  unique (topic_id, sort_order)
);

create table public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  status public.topic_status not null default 'TO_DO',
  personal_notes text,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.topic_status not null default 'TO_DO',
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.understanding_checklist_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  item_key text not null,
  description text not null,
  sort_order integer not null,
  unique (lesson_id, item_key)
);

create table public.understanding_checklist_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checklist_item_id uuid not null references public.understanding_checklist_items(id) on delete cascade,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, checklist_item_id)
);

create table public.lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  statement text not null,
  difficulty public.difficulty not null,
  input_format text not null default '',
  output_format text not null default '',
  constraints text not null default '',
  starter_code text not null default '',
  editorial_content jsonb not null default '{}'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.problem_topics (
  problem_id uuid not null references public.problems(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  relationship text not null default 'primary',
  primary key (problem_id, topic_id)
);

create table public.test_cases (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  input text not null,
  expected_output text not null,
  visibility text not null default 'sample' check (visibility in ('sample', 'hidden')),
  sort_order integer not null default 1
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  language text not null default 'java',
  source_code text not null,
  execution_status public.submission_status not null default 'QUEUED',
  result jsonb not null default '{}'::jsonb,
  hint_level_used smallint not null default 0 check (hint_level_used between 0 and 5),
  attempt_number integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  solved boolean not null default false,
  latest_status public.submission_status,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create table public.revision_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id uuid references public.problems(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  reason text not null default 'Student requested revision',
  priority smallint not null default 3 check (priority between 1 and 5),
  due_at timestamptz,
  status text not null default 'OPEN' check (status in ('OPEN', 'COMPLETED', 'DISMISSED')),
  notes text,
  created_at timestamptz not null default now(),
  check (problem_id is not null or lesson_id is not null)
);

create table public.python_sessions (
  id uuid primary key default gen_random_uuid(),
  session_number smallint not null unique,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order smallint not null unique
);

create table public.python_session_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.python_sessions(id) on delete cascade,
  status public.topic_status not null default 'TO_DO',
  checklist jsonb not null default '[]'::jsonb,
  notes text,
  updated_at timestamptz not null default now(),
  unique (user_id, session_id)
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  owner_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null default 'MEMBER',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.group_invitations (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  invited_by uuid not null references auth.users(id),
  token_hash text not null unique,
  status text not null default 'PENDING',
  expires_at timestamptz not null,
  accepted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.shared_roadmaps (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null,
  description text not null default '',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.shared_roadmap_items (
  roadmap_id uuid not null references public.shared_roadmaps(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  problem_id uuid references public.problems(id) on delete cascade,
  sort_order integer not null default 0
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null,
  description text not null default '',
  start_at timestamptz not null,
  end_at timestamptz not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.challenge_problems (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  primary key (challenge_id, problem_id)
);

create table public.challenge_participation (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  solved_problem_ids uuid[] not null default '{}',
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_meta jsonb not null default '{}'::jsonb,
  token_usage integer,
  created_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index topic_progress_user_idx on public.topic_progress (user_id);
create index lesson_progress_user_idx on public.lesson_progress (user_id);
create index submissions_user_problem_idx on public.submissions (user_id, problem_id);
create index revision_items_user_due_idx on public.revision_items (user_id, due_at);
create index problem_topics_topic_idx on public.problem_topics (topic_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons for each row execute procedure public.set_updated_at();
create trigger preparation_plans_set_updated_at before update on public.preparation_plans for each row execute procedure public.set_updated_at();
create trigger topic_progress_set_updated_at before update on public.topic_progress for each row execute procedure public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress for each row execute procedure public.set_updated_at();
create trigger lesson_notes_set_updated_at before update on public.lesson_notes for each row execute procedure public.set_updated_at();
create trigger problem_progress_set_updated_at before update on public.problem_progress for each row execute procedure public.set_updated_at();
create trigger python_session_progress_set_updated_at before update on public.python_session_progress for each row execute procedure public.set_updated_at();
