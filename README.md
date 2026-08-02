# FloodSathi Assam

Assamese-first, privacy-conscious flood-relief coordination PWA. It converts public help requests into verified, prioritised, assigned and tracked relief actions. It is explicitly **not** a replacement for official emergency services.

## Current implementation

This greenfield foundation includes the public landing page, bilingual intake, offline local drafts, opaque references, privacy-safe tracking, consent-gated Assamese voice recording, provider-neutral language services (Sarvam and deterministic mocks), strict domain validation and governed status transitions, encrypted Supabase intake persistence, transparent triage/duplicate/matching suggestions, a PostGIS schema with RLS enabled, immutable audit records, Assam district seed data, secure headers, and unit/E2E test scaffolding.

Coordinator, volunteer, inventory and administration screens remain controlled follow-on phases; no placeholder UI claims they are operational.

## Run locally

1. Install Node 20+ and pnpm 9.
2. Copy `.env.example` to `.env.local` and fill the public Supabase values.
3. Generate a 32-byte base64 `DATA_ENCRYPTION_KEY` and a separate high-entropy `PHONE_HASH_KEY`. Run `pnpm install`, `pnpm dev`, then open `http://localhost:3000`.
4. Run `pnpm typecheck`, `pnpm test`, and `pnpm test:e2e`.
5. Apply `supabase/migrations/0001_foundation.sql` to a clean Supabase project, then `supabase/seed.sql`.

Never put `SUPABASE_SERVICE_ROLE_KEY` or `SARVAM_API_KEY` in a `NEXT_PUBLIC_` variable. Demo mode must use fictional records only.

If persistence variables are absent, public intake returns `503 SERVICE_NOT_CONFIGURED` and retains the browser draft. It never presents an unpersisted request as received.

See [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), [DEPLOYMENT.md](DEPLOYMENT.md), and [PILOT_RUNBOOK.md](PILOT_RUNBOOK.md).
