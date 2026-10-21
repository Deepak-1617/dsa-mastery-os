# Architecture — DSA Mastery OS

## Stack

| Layer | Choice |
| --- | --- |
| App | Vite 8, React 19, TypeScript |
| Routing | React Router 7 (`src/app/routes.tsx`) |
| Editor | Monaco |
| Auth | Supabase Auth when `VITE_SUPABASE_*` set; else local hashed accounts |
| Progress | `localStorage` / IndexedDB key `dsa-mastery-os:v1` |
| Cross-device | Table `public.user_workspace` (JSONB blob, RLS `auth.uid() = user_id`) |
| Java sandbox | Wandbox OpenJDK 21, Piston 15.0.2 fallback |
| Hidden tests | Edge Function `code-runner` (`mode=submit`) + `hiddenTests.ts` (not imported by Vite) |
| Tutor | Edge Function `ai-tutor` → Groq OpenAI-compatible API |
| Optional Judge0 | Secrets `JUDGE0_*`; status id 3 is COMPLETED, never PASSED |

## Source layout

```
src/app/            routes, providers
src/components/     shell, markdown, chips
src/features/       one folder per product surface
src/data/           topics, lessons, problems, python sessions
src/lib/            javaRunner, pythonRunner, progress, search
src/store/          db, api, cloudAuth, cloudSync, useAppStore
src/types/models.ts A–L lesson fields, submission enum
supabase/migrations Postgres + RLS
supabase/functions  ai-tutor, code-runner
docs/               curriculum blueprint, setup notes
```

## Persistence

`mutate()` writes memory, increments `storeGeneration` (React subscriptions), saves local, then debounces upsert to `user_workspace`. Login: `restoreSupabaseSession` then `pullCloudWorkspace`. Passwords never leave the device in the blob.

## Data models (client)

- Topics 1–22 (`src/data/topics.ts`). Stable ids: `stableId(prefix, slug)`.
- Lessons: `fillLesson` / `packedLesson`. Arrays ≥8, others ≥5.
- Problems + `TestCase.visibility = sample | hidden`.
- Progress rows keyed by `userId`.
- Submission status: QUEUED, RUNNING, PASSED, FAILED, COMPILE_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, JUDGE_ERROR.

## Postgres (existing)

`profiles`, `topics`, `lessons`, `*_progress`, `problems`, `test_cases`, `submissions`, `revision_items`, `python_*`, `groups`, `execution_runs`, plus `user_workspace` for blob sync. RLS in `0002_rls_policies.sql`. Quota RPC in `0004_execution_security.sql`.

## Execution rules

- Browser **Run Java** → `runJavaSource` (Wandbox/Piston). Records QUEUED/error, `graded: false`.
- **Submit** → `code-runner` with user JWT. Compares hidden stdout server-side. Returns `{ passed, total, status }` only.
- Python track → Piston `python 3.10.0` custom run, not a DSA verdict.
