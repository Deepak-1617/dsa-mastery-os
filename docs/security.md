# Security

- Passwords in local workspace mode are salted SHA-256 in `localStorage`. This is **not** a substitute for Supabase Auth in production.
- Production authentication must use Supabase Auth. The application never stores plaintext production passwords.
- RLS is enabled on user-facing tables. Hidden test cases are not selectable by authenticated clients.
- Browser clients cannot insert or update `submissions` or `problem_progress` after migration `0004_execution_security.sql`. Verdicts come from the Edge Function using the service role.
- Group membership uses a `security definer` helper to avoid recursive RLS. Direct self-join is revoked; invitations go through trusted operations.
- Invitation tokens in the local workspace are shown once to the creator. In Supabase, store only `token_hash`.
- CORS for Edge Functions is origin-locked to `APP_ORIGIN`.
- AI and Judge0 keys stay in function secrets. Nothing privileged is prefixed with `VITE_`.
