# Deployment

## Free-tier first deployment

1. In the prepared Supabase dashboard tab, keep the project name `FloodSathi Assam`, choose the closest available India/Asia region, generate and securely save the database password, then click **Create new project**.
2. In a normal interactive terminal, run `pnpm supabase login`, `pnpm supabase:link --project-ref <PROJECT_REF>`, and `pnpm supabase:push`. The login token and database password must never be pasted into chat or committed.
3. Apply `supabase/seed.sql` from the Supabase SQL editor after the migration succeeds.
4. Copy the project URL and server-only service-role key to `.env.local`. Generate the application secrets locally:

   ```powershell
   $encryptionBytes = [byte[]]::new(32)
   [Security.Cryptography.RandomNumberGenerator]::Fill($encryptionBytes)
   [Convert]::ToBase64String($encryptionBytes)
   [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

   Put the first result in `DATA_ENCRYPTION_KEY` and the second in `PHONE_HASH_KEY`. Do not reuse either value elsewhere.
5. Install GitHub CLI, run `gh auth login`, then publish the repository. The current checkout has no commits or configured remote, so Vercel cannot import the implemented code until this is done.
6. In the prepared Vercel tab, import `https://github.com/ChiranjibSarma/FloodSathi`, select the Hobby plan, and configure all variables from `.env.example` for Production and Preview.
7. Deploy, set `NEXT_PUBLIC_APP_URL` to the generated HTTPS URL, update the Supabase Auth site URL/redirect allowlist, and redeploy.

Free Supabase projects can pause after inactivity. Verify that the database is active before a field demonstration. Vercel Hobby eligibility must remain consistent with Vercel's current usage terms.

## Supabase

Create separate development, staging and production projects; enable PostGIS; apply migrations on staging from a clean database; create private `request-audio`, `request-evidence`, and `volunteer-identity` buckets; configure Auth expiry and redirect allowlists; review every RLS policy with two organisations and a suspended volunteer.

## Vercel

Import the repository, set server-only secrets separately from `NEXT_PUBLIC_*`, select Node 20+, deploy staging, run smoke/E2E checks, then promote the immutable build. Configure Sentry-compatible DSN and scrub sensitive fields before enabling monitoring.

## Docker

Build with the included Node application contract after adding a locked dependency file: install with `pnpm --frozen-lockfile`, run `pnpm build`, and serve with `pnpm start`. PostgreSQL/PostGIS and object storage remain external services.

Rollback the application by promoting the last known-good immutable build. Database migrations must be forward-compatible; use a tested compensating migration, never destructive rollback in an incident. Back up PostgreSQL daily with point-in-time recovery and test restoration quarterly. Object-storage lifecycle and backup policies must match retention rules.
