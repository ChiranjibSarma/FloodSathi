# Security model

- Deny-by-default RLS is enabled on every exposed table. Initial policies intentionally expose only geography, public-safe updates, an authenticated user's profile, and verified volunteers' own assignments.
- Organisation membership and district grants must be checked server-side and in RLS before coordinator modules are enabled.
- Exact locations, phones, identity documents, medical details, audio and evidence are high sensitivity. Store objects in private buckets and issue short-lived signed URLs only after authorisation.
- Phone lookup uses a keyed hash; display uses masking. Encryption keys remain outside the database.
- Public intake requires schema validation, idempotency keys, a honeypot and consent. Add the deployment rate-limit/CAPTCHA adapters before a public pilot.
- Audit events are append-only. Privileged workflows must write an audit event in the same database transaction.
- Never log request bodies, phone numbers, exact coordinates, descriptions, medical flags or recordings. Log only safe identifiers and classified provider errors.
- CSP currently permits development requirements. Replace `unsafe-eval` and apply nonces before production.

Threat-model and penetration-test the final RLS functions, signed URL paths, cross-organisation access and abuse controls before launch.
