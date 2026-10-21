# Product Requirements — DSA Mastery OS

## Audience

College students preparing for assessments, CRT/PAT, coding rounds, and interviews. Java is the language they write. English in lessons stays simple.

## Job to be done

Learn a topic with real programs, see a dry run, implement in Java, practise, revise, and optionally ask a tutor — without fake scores or forced paths.

## Core features

1. **Account** — register/login. Cloud Auth when Supabase is configured; otherwise a local workspace.
2. **Roadmap** — 22 topics, two phases. Student sets TO_DO / ONGOING / COMPLETED / NEEDS_REVISION.
3. **Learn** — structured Java lessons (definition, why, syntax, dry run, visualizer, mistakes, brute vs better).
4. **Practice** — original problems, Monaco Java editor, sample I/O.
   - **Run Java**: custom stdin, not a hidden-test verdict.
   - **Submit hidden tests**: server-side compare; counts only; never leak hidden I/O.
   - **I solved this**: self-report. Does not auto-complete the topic.
5. **Playground** — free Java editor (OpenJDK 21 / Piston 15).
6. **Revision** — 1 / 3 / 7 / 14 day shelf.
7. **AI Tutor** — patient teacher via Edge Function. Progressive hints. No quizzes unless asked.
8. **Groups** — local/cloud workspace groups, invitations, private notes.
9. **Python track** — eight optional sessions, same progress engine, Piston Python custom runs.
10. **Dashboard** — counts from stored activity only.

## Primary flows

- Register → onboarding → dashboard → start Arrays → run a program in Playground → practise → optional submit → mark status yourself.
- Stuck → AI Tutor (concept → hint → algorithm → solution on request).
- Fail or flag → revision shelf.

## Out of scope

- Executing Java inside the browser or the Node/Vite process with `javac`.
- Auto-mastery, streaks-as-truth, or invented judge results.
- Duplicating the curriculum per exam brand.
- Returning hidden tests to the client.
- Mixing `ACCEPTED` / `WRONG_ANSWER` with the canonical submission enum.
- Shipping `service_role` or LLM keys to the frontend.
