# Architecture

DSA Mastery OS is a Vite + React + TypeScript client with a local-first persistence layer and optional Supabase for authentication, Postgres, RLS, Realtime, and Edge Functions.

```
src/
  app/                 routing
  components/          layout primitives
  features/            auth, dashboard, lessons, practice, groups, ...
  data/                curriculum, problems, python track
  lib/                 pure helpers (progress, revision, search)
  store/               local workspace database
  types/               shared models
supabase/
  migrations/          Postgres + RLS
  functions/           ai-tutor, code-runner
```

## Persistence

- Without `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, the app uses a versioned `localStorage` database (`dsa-mastery-os:v1`). This is a **local workspace**, not cross-device sync.
- With Supabase configured, the same UI can be pointed at Postgres. The Edge Functions remain the only place that talks to Judge0 or an LLM.

## Execution

The browser never executes Java. `Run Java` calls `supabase/functions/code-runner`, which authenticates the user, consumes a server-side quota, and talks to an isolated Judge0 deployment. Completing a process is **not** a judged pass.

## Learning engine

One topic/lesson/problem graph serves every preparation goal. Plans are overlays (selected topic and problem ids), not duplicated curricula.
