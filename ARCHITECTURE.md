# Architecture

```mermaid
flowchart LR
  P[Public PWA] --> A[Next.js server routes]
  V[Volunteer PWA] --> A
  C[Coordinator console] --> A
  A --> D[Domain services]
  D --> R[Repository interfaces]
  R --> S[(Supabase PostgreSQL + PostGIS)]
  D --> L[Language provider interface]
  L --> SA[Sarvam]
  L --> M[Mock / future Bhashini]
  S --> ST[Private Storage]
  S --> RT[Realtime]
```

The domain owns status transitions, triage governance and assignment rules. Framework, database and language integrations sit at boundaries so Supabase, Sarvam and Vercel can be replaced. Browser code receives no provider or service-role credentials. Original content and every derived transcript/translation are separate immutable facts; corrections do not overwrite originals.

Public tracking is a deliberately narrow projection. Sensitive exact locations, contact data, medical details, recordings and internal notes never enter it.
