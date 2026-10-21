# DSA Mastery OS — agent rules

Java-first DSA learning app (Vite + React 19 + TypeScript). Not a landing page.

## Commands

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:5173
npx tsc --noEmit
npx vitest run
npx tsx scripts/generate-hidden-tests.ts
```

Restart Vite after changing `.env.local`. Preview hosts must set `server.allowedHosts: true`.

## Stack

- UI: React 19, React Router 7, Monaco, Lucide
- Data: versioned local workspace `dsa-mastery-os:v1` + optional Supabase Auth/RLS
- Java run: Wandbox OpenJDK **21** (Piston **15.0.2** fallback). Never `javac` in the browser or app process.
- AI tutor: Edge Function `ai-tutor` only. Groq model `openai/gpt-oss-20b` (Llama 3.3 retired on free keys).
- Hidden tests: Edge Function `code-runner` mode `submit`. Custom **Run Java** is not a verdict.

## Style

- TypeScript strict. No `any` unless a third-party type forces it.
- Student-owned statuses: `TO_DO | ONGOING | COMPLETED | NEEDS_REVISION`. Do not auto-complete a topic from opening a lesson or one problem.
- One unified curriculum (22 topics). Do not duplicate it per exam goal.
- Topic 12 = Two Pointers **and** Sliding Window intro. Topic 21 = Advanced Sliding Window. Do not merge or skip areas.
- Lessons: easy English, Java, dry-run + visualizer, TC/SC. Do not copy Arrays content into other topics.
- Scanner is always `Scanner sc = new Scanner(System.in)`.
- Canonical submit enum: `QUEUED, RUNNING, PASSED, FAILED, COMPILE_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, JUDGE_ERROR`. Judge0 status 3 = process finished, **not** PASSED.
- Hidden tests never returned to the browser. Custom runs never mark `PASSED`.
- No fake stats, fake AI, or fake execution.
- No quizzes unless the student asks. No nagging.
- Never put `SUPABASE_SERVICE_ROLE_KEY`, Judge0, or LLM keys in `VITE_*`.
- RLS for every user table. Client JWT only.

## Files

- Curriculum: `src/data/topics.ts`, `src/data/lessons/`, `src/data/problems/`
- Store: `src/store/` (`mutate` + `useAppStore`)
- Cloud blob: `user_workspace` via `src/store/cloudSync.ts`
- Functions: `supabase/functions/ai-tutor`, `supabase/functions/code-runner`
