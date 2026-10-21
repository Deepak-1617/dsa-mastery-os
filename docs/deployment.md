# Deployment

1. `npm run build`
2. Host `dist/` on any static provider (Vercel, Netlify, Cloudflare Pages, nginx)
3. Set production `VITE_*` at build time
4. Point `APP_ORIGIN` at the HTTPS frontend origin (no trailing slash)
5. `npx supabase db push` against the production project
6. Deploy `code-runner` and `ai-tutor` functions
7. Rotate keys if they ever appeared in a shell history or client bundle

The production build in this repository has been used as the local verification target. Cloud Judge0, Realtime, and LLM calls are **not** claimed verified without credentials.
