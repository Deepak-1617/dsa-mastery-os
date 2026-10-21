# Database

See `supabase/migrations/0001_initial_schema.sql` for tables matching the product spec: profiles, topics, lessons, progress, problems, tests, submissions, revision, python track, groups, invitations, challenges, AI usage, activity.

`0002_rls_policies.sql` enables RLS.

`0004_execution_security.sql` adds `execution_runs`, hourly quotas, and tightens write access.

Curriculum rows use stable `slug` values so student progress ids survive content edits.
