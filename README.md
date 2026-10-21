# DSA Mastery OS

A Java-first Data Structures and Algorithms learning system for college assessments, CRT/PAT, coding rounds, and interviews.

**Learn → Visualize → Understand → Implement → Practice → Analyze → Revise → Master**

This is a working application, not a marketing landing page. Topic statuses, checklists, notes, drafts, revision items, groups, and preparation plans persist. Dashboard numbers come from that stored activity.

## What runs without extra credentials

| Area | Status |
| --- | --- |
| Vite + React + TypeScript app | Runnable locally |
| 22 roadmap topics with structured lessons | Included |
| Interactive visualizers and dry runs | Included |
| Practice catalog (8+ problems per topic) | Included |
| Monaco Java editor, hints, editorials | Included |
| Local accounts and progress | Included (this browser) |
| Optional 8-session Python track | Included |
| Groups / invitations / challenges (same browser, multiple accounts) | Included |
| Supabase Auth, RLS, Realtime | Implemented in SQL + docs; needs a project |
| Isolated Java judge (Judge0) | Edge Function implemented; **not enabled** until you verify isolation |
| AI tutor | Edge Function implemented; needs provider keys |

Java execution is **not** claimed working until Judge0 is configured and tested. Completing a custom run is not a solved verdict.

## Quick start

```bash
npm install
npm run dev
```

Register at http://localhost:5173. The banner **Local workspace** means data is stored in `localStorage` under `dsa-mastery-os:v1`.

```bash
npm test
npm run build
```

## Stack

- React 19, TypeScript, Vite, React Router
- Lucide icons, Monaco editor
- Zod-ready helpers, Vitest
- Supabase (optional): Postgres, Auth, RLS, Edge Functions

## Environment

Copy `.env.example`. Never put service-role, Judge0, or LLM keys in `VITE_*` variables.

See `docs/setup.md`, `docs/architecture.md`, `docs/security.md`, `docs/database.md`, and `docs/deployment.md`.

## Product map

1. Dashboard — real counts, streak, recommendations with reasons
2. Roadmap — 11 foundations + 11 patterns, student-controlled statuses
3. Learn — prerequisites, Java APIs, visualizers,  approaches, checklists, optional MCQs
4. Practice — filters, editor, progressive hints, editorial
5. Revision — 1/3/7/14-day shelf
6. AI Tutor — secure backend when configured
7. Groups — roles, tokens, shared roadmaps, challenges
8. Profile — language, goals, preparation plans
9. `/python` — optional track

## Honest limitations

- Cross-device sync is unverified until a Supabase project is linked and tested.
- Hidden-test grading is not connected. Do not use custom runs for challenge completion.
- Local password hashing is for the offline workspace only. Production must use Supabase Auth.
- Some tree/list problems use array representations so students can practice the algorithm without a custom `ListNode` parser in the judge harness.
