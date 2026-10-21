# Setup

## Local workspace (no cloud)

```bash
npm install
npm run dev
```

Open http://localhost:5173, register, and use the app. Progress stays in this browser.

## Supabase (needed if login must survive Vite / preview restarts)

1. Create a project at https://supabase.com/dashboard
2. Authentication → Providers → Email: turn **Confirm email** off while you are developing
3. Copy `.env.example` to **`.env.local`** in the project root and paste:
   - `VITE_SUPABASE_URL` from Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` from Settings → API → anon public
   - Never paste `service_role` into any `VITE_` variable
4. `npx supabase db push` (includes the profile-on-signup trigger)
5. Restart Vite (`npm run dev`) so Vite picks up `.env.local`
6. `npx supabase login && npx supabase link --project-ref YOUR_REF`
7. Apply SQL in `supabase/seed/001_curriculum.sql` via the SQL editor (seed files are **not** applied by `db push`)
8. Optional: `npm run seed:curriculum` with `SUPABASE_SERVICE_ROLE_KEY` set (server-only, never `VITE_`)

## Judge0

Never prefix judge secrets with `VITE_`.

```
APP_ORIGIN=http://localhost:5173
JUDGE0_ENABLED=false
JUDGE0_API_URL=
JUDGE0_AUTH_MODE=rapidapi
JUDGE0_API_KEY=
JUDGE0_API_HOST=
JUDGE0_JAVA_LANGUAGE_ID=
```

Verify language id, network isolation, CPU/memory limits, then:

```
npx supabase secrets set --env-file supabase/.env.functions.local
npx supabase functions deploy code-runner
```

Do not deploy with `--no-verify-jwt`.

## AI tutor

The browser never holds the model key. Deploy `supabase/functions/ai-tutor`, then set **Edge Function secrets** (Project Settings → Edge Functions → Secrets). Never put these in `VITE_*`.

Recommended free path (Groq, OpenAI-compatible):

1. Create a key at https://console.groq.com/keys
2. Secrets:
   - `AI_PROVIDER=openai-compatible`
   - `AI_API_URL=https://api.groq.com/openai/v1`
   - `AI_API_KEY=` your Groq key
   - `AI_MODEL=openai/gpt-oss-20b` (Groq retired Llama 3.3 for free/developer keys on 2026-08-16)
   - `APP_ORIGIN=http://localhost:5173`
3. Sign in to the app with the **cloud** account (Supabase session). Local-only accounts cannot call the function.

Google AI Studio also works: `AI_PROVIDER=gemini`, `AI_API_URL=https://generativelanguage.googleapis.com`, `AI_MODEL=gemini-2.0-flash`, `AI_API_KEY=` from https://aistudio.google.com/apikey.
