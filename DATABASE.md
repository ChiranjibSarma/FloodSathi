# Database guide

`supabase/migrations/0001_foundation.sql` enables PostGIS and pgcrypto, defines governed enums, operational entities, bilingual preservation, assignment/history records, relief inventory, emergency configuration, immutable audit events and provider health records. RLS is enabled everywhere. Policies are deliberately minimal until authenticated server workflows are implemented.

Apply the migration to an empty staging database, apply `supabase/seed.sql`, and inspect `pg_policies` before enabling APIs. The district seed is administrative geography; it contains no live incidents, victims, volunteers, phone numbers or emergency claims. Pilot villages must be supplied and verified by authorised operators.
