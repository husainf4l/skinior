## Dashboard Backend Plan

Brief: This document captures a complete, actionable backend plan for the dashboard pages: requirements, data model, API contract, auth/RBAC, caching/metrics, testing, migrations, deployment/CI, and a recommended implementation roadmap.

---

## Checklist (requirements extracted)

- [ ] Secure admin/authenticated access (session/JWT)
- [ ] CRUD for products, orders, users, routines (dashboard pages present in frontend)
- [ ] Filtering, sorting, pagination, and search on list endpoints
- [ ] Aggregated metrics endpoints (KPI: revenue, orders, active users)
- [ ] Audit/logging for actions performed in dashboard (who changed what)
- [ ] Rate limiting, validation, and role-based access control (RBAC)
- [ ] Tests, migrations, and CI for backend changes

Assumptions:

- Frontend is Next.js + TypeScript (confirmed in repo). Backend will be TypeScript (Node). Default DB: PostgreSQL. ORM: Prisma (recommended). If you prefer a different stack (NestJS vs Express, TypeORM, or a different DB), adapt accordingly.

---

## High-level plan

- Design data model
- Define REST API contract (OpenAPI)
- Implement auth & RBAC
- Implement core endpoints (products, orders, users, metrics) with pagination/filter/search
- Add audits, caching, tests, CI/CD and monitoring

---

## 1) Tech choices (recommended)

- Language: TypeScript
- Framework: NestJS (recommended) or Express + TypeScript for a lighter option
- ORM: Prisma (developer DX) with PostgreSQL
- Cache/Rate-limit/Queue: Redis + BullMQ
- Storage: S3-compatible object storage for uploads
- Observability: Sentry (errors), Prometheus + Grafana (metrics)
- Tests: Jest (unit) + Supertest (integration)

---

## 2) Core data models (simplified)

- users: id(uuid), email, password_hash, name, role_id, created_at, updated_at, last_login
- roles: id, name, permissions (json or join table)
- products: id(uuid), sku, title, description, price_cents, stock, images(json), category_id, is_active, created_at, updated_at
- orders: id(uuid), user_id, total_cents, status(enum), items(json), shipping(json), created_at, updated_at
- routines/analyses: id, user_id, type, metadata(json), status, created_at
- audits: id, actor_user_id, entity_type, entity_id, action(create/update/delete), diff(json), timestamp
- sessions/refresh_tokens: id, user_id, token_hash, expires_at, device_info

Notes: store timestamps in UTC; use UUIDs for public IDs; use JSON fields for flexible metadata when necessary.

---

## 3) API surface (REST) - key endpoints

Auth

- POST /api/auth/login -> { accessToken, refreshToken, user }
- POST /api/auth/refresh -> { accessToken, refreshToken }
- POST /api/auth/logout

Users (RBAC: admin/manager)

- GET /api/admin/users?search=&role=&limit=&offset=
- GET /api/admin/users/:id
- POST /api/admin/users
- PATCH /api/admin/users/:id
- DELETE /api/admin/users/:id

Products

- GET /api/admin/products?search=&category=&is_active=&sort=&limit=&cursor=
- GET /api/admin/products/:id
- POST /api/admin/products
- PATCH /api/admin/products/:id
- DELETE /api/admin/products/:id
- POST /api/admin/products/bulk

## User Dashboard Backend Plan

Brief: the dashboard in this repository is a user-facing dashboard (not an admin panel). This document now focuses on the backend needed for the user dashboard demo features: user auth, profile, appointments & scheduling, AI advisor sessions, skin analysis, treatment plans, consultations, favorites/recommendations, orders (reorders), and uploads.

---

## Checklist (requirements from demo pages)

- [ ] User authentication and session management (login/register/me)
- [ ] User profile read/update
- [ ] Appointments: schedule, list, cancel, status updates, availability checks
- [ ] Treatments / routines: create, update progress, schedule milestones
- [ ] Consultations: history, details, follow-ups
- [ ] AI Beauty Advisor: create sessions, instant consultations, track stats
- [ ] Products: favorites, recommended, add/remove from routine, reorder
- [ ] Orders: reorder and order history (for reorders/payments handled elsewhere)
- [ ] Skin analysis: upload images, run analysis jobs, return results
- [ ] File uploads (images) to S3 or object storage
- [ ] Notifications / reminders (email / push) for appointments and follow-ups
- [ ] Basic metrics for the user (consultation counts, active treatments, progress)
- [ ] Input validation, rate limiting, error handling and monitoring
- [ ] Tests, migrations and CI for backend changes

Assumptions / notes:

- This backend serves end users only; the admin/management UI is a separate application.
- Frontend stores the access token in localStorage and calls APIs at NEXT_PUBLIC_API_URL (see `src/services/authService.ts`). APIs should accept Bearer tokens.
- Primary DB: PostgreSQL. ORM: Prisma recommended for TypeScript DX, but alternatives are possible.

---

## High-level plan

- Map demo UI features to backend resources and endpoints
- Design data model and Prisma schema
- Implement auth endpoints used by frontend (/auth/login, /auth/register, /auth/me, /auth/refresh)
- Implement user-facing endpoints: profile, appointments, treatments, consultations, products (favorites/recommendations), orders, skin-analysis, ai-sessions
- Implement background processing (AI analysis, recommendations, emails) with Redis + BullMQ
- Add uploads to S3-compatible storage and signed URLs
- Add monitoring, tests, and CI/CD

---

## 1) Tech choices (recommended)

- Language: TypeScript
- Framework: Express or lightweight NestJS (match team preference). An API-only NestJS app is a good fit.
- ORM: Prisma + PostgreSQL
- Cache / queue: Redis + BullMQ for background jobs (skin analysis, recommendations, exports)
- Storage: S3 or compatible (AWS S3, DigitalOcean Spaces)
- Auth: JWT access tokens (short-lived) + optional refresh tokens stored server-side
- Observability: Sentry + Prometheus (or hosted provider)
- Tests: Jest (unit) + Supertest (integration)

---

## 2) Data models (user-focused)

Note: keep shapes minimal and extendable.

- users

  - id (uuid), email, password_hash, first_name, last_name, phone, dob?, created_at, updated_at, last_login

- profiles (optional separate table)

  - user_id, skin_type, skin_tone, preferences, timezone, locale, metadata(json)

- appointments

  - id(uuid), user_id, advisor_id|null, type(enum), scheduled_at(timestamp), duration_mins, status(enum: pending/confirmed/cancelled/completed), notes, created_at, updated_at

- treatments (plans)

  - id, user_id, name, start_date, end_date|null, duration_weeks, progress_percent, milestones(json), status(enum)

- consultations

  - id, user_id, type, date, advisor, concerns(json), recommendations_count, follow_up_date|null, notes(json), created_at

- ai_sessions

  - id, user_id, session_type(enum instant/analysis), input_refs (images/metadata), result_ref (json), status(enum queued/processing/done/failed), created_at, completed_at

- products_favorites

  - id, user_id, product_id, in_routine(bool), last_used_date, notes

- orders (user-facing history / reorders)

  - id, user_id, external_order_id?, items(json), total_cents, currency, status, created_at

- skin_analyses

  - id, user_id, images(json), results(json), ai_version, status, created_at, completed_at

- uploads

  - id, user_id|null, url, key, mime_type, size, purpose(enum profile, skin_image, product_image), created_at

- notifications / reminders

  - id, user_id, type, channel(email/push/sms), payload(json), scheduled_at, sent_at, status

- refresh_tokens
  - id, user_id, token_hash, issued_at, expires_at, device_info

Index & integrity notes:

- Index appointments by user_id and scheduled_at for quick lists.
- Use transactions for critical multi-step updates (e.g., booking + payment flow if integrated).

---

## 3) API surface (user-facing) — key endpoints

Auth & profile

- POST /api/auth/login { email, password } -> { data: { user, accessToken, expiresIn } }
- POST /api/auth/register { firstName, lastName, email, password, phone } -> { data: { user, accessToken } }
- GET /api/auth/me -> { data: { user } }
- POST /api/auth/refresh { refreshToken } -> { accessToken }
- POST /api/auth/logout { refreshToken }
- GET /api/profile -> { data: profile }
- PATCH /api/profile -> update profile fields

Appointments & scheduling

- GET /api/appointments?from=&to=&status=&limit=&cursor= -> list user appointments
- POST /api/appointments -> { type, scheduledAt, duration, notes } -> creates appointment (validate availability)
- PATCH /api/appointments/:id -> update/cancel
- POST /api/appointments/:id/reschedule -> { newScheduledAt }
- GET /api/availability?date=&advisorId? -> availability slots

Treatments & routines

- GET /api/treatments -> list user plans
- POST /api/treatments -> create plan
- PATCH /api/treatments/:id -> update progress, milestone completion
- GET /api/treatments/:id/milestones -> milestone list

Consultations & AI advisor

- GET /api/consultations -> history
- GET /api/consultations/:id -> detail
- POST /api/ai/sessions -> start instant consultation or analysis (enqueues job) -> { jobId }
- GET /api/ai/sessions/:id -> status/result
- POST /api/ai/sessions/:id/feedback -> user feedback

Products (user-side)

- GET /api/user/products/favorites -> list
- POST /api/user/products/favorites -> add { productId, inRoutine? }
- PATCH /api/user/products/favorites/:id -> toggle inRoutine, update notes
- DELETE /api/user/products/favorites/:id
- GET /api/user/products/recommended -> recommendations (cached) -> { reasons, confidence }
- POST /api/user/products/:id/reorder -> initiates reorder (redirects to shop/payment flow or creates order record)

Orders (history / reorders)

- GET /api/orders -> user orders
- GET /api/orders/:id
- POST /api/orders/:id/reorder -> duplicates order items, returns cart token or order draft

Skin analysis & uploads

- POST /api/uploads -> accept multipart, store file and return key/url
- POST /api/skin-analysis -> { imageKeys, metadata } -> enqueue analysis job, return job id
- GET /api/skin-analysis/:id -> status + results

Notifications

- GET /api/notifications -> list
- PATCH /api/notifications/:id/read

Health & diagnostics

- GET /api/health -> basic health (DB, Redis)

Response shape

- Keep consistent: { status: 'ok'|'error', data, meta?, error? } or return data directly as { data: ... } matching frontend expectations (see authService.handleResponse).

---

## 4) Auth design (match current frontend)

- Frontend stores access token in localStorage and sends Authorization: Bearer <token> header.
- Implement /auth/login, /auth/register, /auth/me endpoints. Return { data: { user, accessToken, expiresIn } } to match `authService`.
- Use short-lived access tokens (JWT) and optional refresh tokens stored hashed in DB.
- Protect all user endpoints with authentication middleware verifying JWT and loading user context.

Security notes:

- Hash passwords with argon2 or bcrypt.
- Rate-limit login attempts per IP and account.

---

## 5) Background jobs & AI integrations

- Use Redis + BullMQ for async jobs:
  - skin analysis (image processing + model inference)
  - generating personalized recommendations
  - sending notifications & reminders
  - preparing AI session transcripts or summaries
- Jobs should store results in `ai_sessions` / `skin_analyses` and emit notifications to the user when complete.

---

## 6) Caching & performance

- Cache recommendations per user for short TTL (30s–5m) in Redis.
- Cache availability queries for advisors per small TTL.
- Use DB indexes for appointment lookups and product favorites.

---

## 7) Validation, errors and edge cases

- Validate date/time and timezone handling (store timestamps in UTC, return localized when requested).
- Handle concurrent bookings: use DB transactions and row-level locking or optimistic checks to prevent double-booking.
- Large image uploads: use direct signed upload URLs to S3 to avoid API memory pressure.
- Rate-limit heavy endpoints (AI session creation) per user.

---

## 8) Observability & monitoring

- Expose /metrics for Prometheus and integrate Sentry.
- Emit events for job lifecycle (queued/started/completed/failed) for monitoring.

---

## 9) Tests, migrations & CI

- Write unit tests for services and utilities (Jest).
- Integration tests for key API flows (auth, book appointment, upload+analysis) using a test DB in CI.
- Migrations via Prisma Migrate and seeds to create a test user and default advisor slots.

---

## 10) Deliverables I can produce next

- OpenAPI (user-dashboard) spec matching the endpoints above.
- Prisma schema and initial migration for core tables.
- Minimal Express or NestJS scaffold with auth, profile, appointments, products favorites, and uploads + example tests.
- Background worker example (BullMQ) with a mock skin-analysis job.

---

## 11) Estimated timeline (single developer)

- Design & schema: 0.5–1 day
- Auth + profile + basic user endpoints: 1–2 days
- Appointments & scheduling: 1–2 days
- Products favorites & recommendations (user): 1 day
- Uploads + skin-analysis job skeleton: 1–2 days
- Tests, CI, monitoring: 1–2 days

Total: ~5–9 working days to have a solid user-dashboard backend MVP.

---

## Requirements coverage

- User auth/profile: covered
- Appointments/scheduling: covered
- Treatments/consultations: covered
- AI advisor / skin analysis: covered
- Products favorites/recommendations and reorders: covered
- Uploads, notifications, jobs, tests and CI: covered

---

Next actions (pick one):

1. I can generate an OpenAPI spec for the user dashboard endpoints now.
2. I can scaffold a small backend (Prisma schema + Express/NestJS) including auth and appointments endpoints.

Tell me which to start with and confirm DB choice (Postgres is recommended) and whether you prefer Express or NestJS.
