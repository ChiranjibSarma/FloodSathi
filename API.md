# API contract

## `POST /api/requests`

Accepts JSON matching the public help-request schema. Required fields include language, category, requester name, mobile, district, locality, affected counts, description, consent and a UUID idempotency key. Boolean urgency flags are explicit. A hidden `website` honeypot must remain empty.

Success: `201 { "ok": true, "reference": "FSA-…", "status": "NEW" }`.

Validation failure: `400 { "ok": false, "error": "INVALID_REQUEST", "fields": … }`.

The route validates and persists through the server-only Supabase repository and transactional `submit_help_request` RPC. Sensitive fields are AES-256-GCM encrypted and phone matching uses a separate HMAC key. If persistence is not fully configured it returns `503 SERVICE_NOT_CONFIGURED`; the browser retains the draft. Deployment rate limiting remains required before pilot use. Request payloads must never be logged.
