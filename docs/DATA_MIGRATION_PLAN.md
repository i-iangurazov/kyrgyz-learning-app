# Data Migration Plan

This document defines how to migrate from current TypeScript seed content to database-backed curriculum and progress later. It is not an implementation plan for the current task and does not authorize migrations.

For the first actual migration, use `docs/BACKEND_VERTICAL_SLICE_PLAN.md` to limit scope and `docs/FIRST_MIGRATION_CHECKLIST.md` to verify readiness.

Current Slice 1 migration and validation utilities:

- Migration: `supabase/migrations/20260708000100_slice_1_content_schema.sql`
- Export current seed content to DB-shaped JSON: `pnpm content:export-db-json`
- Validate DB-shaped round trip back to `lesson-v2`: `pnpm content:validate-db-roundtrip`
- Apply Slice 1 migration to local Postgres: `DATABASE_URL=... pnpm content:db:apply-local`
- Import seed rows into local Postgres: `DATABASE_URL=... pnpm content:db:import-local`
- Validate local Postgres round trip: `DATABASE_URL=... pnpm content:db:validate-local`
- Validate the feature-flagged local DB read path: `DATABASE_URL=... pnpm content:db:read-local`
- Run DB-backed learner route smoke E2E: `pnpm test:e2e:db`
- Generated JSON is written under `test-results/` and should not be committed.

## Current State

The app currently uses:

- TypeScript seed lessons in `src/content/seed/lessons.ts`.
- Zod schemas in `src/content/schemas.ts`.
- Derived curriculum exports in `src/content/curriculum.ts`.
- Local progress in browser storage through `src/lib/progress.ts` and `src/hooks/use-local-progress.ts`.

Current strengths:

- Content is typed and schema-validated.
- Lesson flow is stable.
- Exercise and review behavior are testable.
- Seed lessons provide a good import fixture.

Current limitations:

- No database.
- No admin workflow.
- No backend user accounts.
- No backend progress sync.
- No real audio storage workflow.

## Future State

The target backend state:

- Curriculum, language knowledge, lesson content, exercises, media, and source metadata live in Postgres.
- Learner-facing reads use published or explicitly allowed demo content.
- Admin/editor workflows manage draft, review, approval, and publish states.
- User progress syncs to backend after auth exists.
- Flashcards and SRS scheduling are backend-ready.
- Seed data remains useful for tests, local fallback, and import/export fixtures.

## Migration Phases

### Phase 1: Keep Seed Content

Goal:

- Preserve current behavior while database design is reviewed.

Actions:

- Keep TypeScript seed content as canonical MVP data.
- Continue validating with Zod.
- Keep Playwright and Vitest coverage passing.
- Do not change runtime content source.

Exit criteria:

- Postgres schema proposal reviewed.
- Supabase implementation plan reviewed.
- No unresolved rights/modeling blockers for current seed data.

### Phase 2: Create DB Schema

Goal:

- Add a narrow database schema slice when explicitly requested.

Actions:

- Start with the slice 1 tables defined in `docs/BACKEND_VERTICAL_SLICE_PLAN.md`.
- Preserve placeholder audio data where needed, but do not add full media/audio storage tables in the first slice unless explicitly requested.
- Add migrations in a dedicated backend implementation task.
- Add RLS from the beginning for user-owned tables if any user data exists.
- Keep admin-only tables private.
- Keep learner runtime reads on TypeScript seed content until a separate feature-flagged DB read task is requested.

Exit criteria:

- Migrations apply cleanly locally.
- Schema supports current `lesson-v2` seed data.
- No learner-facing app behavior changes unless feature-flagged.

### Phase 3: Seed DB From Existing TypeScript Content

Goal:

- Import current seed lessons into database tables.

Actions:

- Write import script that reads `lessonSeedData`.
- Validate source seed data with existing Zod before import.
- Transform nested lesson data into normalized rows.
- Insert source records, levels, units, lessons, content blocks, knowledge items, exercises, and audio placeholders.
- Run post-import validation queries.
- Export DB lesson payload back into `lesson-v2` shape and compare with seed output.
- Reuse the current Slice 1 mapper and `pnpm content:validate-db-roundtrip` as the offline baseline before connecting to a live database.

Validation:

- All lesson IDs match.
- Lesson ordering matches.
- Vocabulary counts match.
- Dialogue lines and translations match.
- Exercise answer data matches.
- Audio placeholder records match transcripts and storage keys.
- Source/rights/review metadata exists internally.

Exit criteria:

- DB import can be repeated idempotently in local/dev.
- Imported data validates against app schemas.
- Tests pass against seed path.

### Slice 1 Local Validation Guide

Prerequisites:

- Local Supabase or Postgres is running.
- `psql` is available on `PATH`, or `PSQL_BIN` is set.
- `DATABASE_URL` points at the local database.

Recommended sequence:

```bash
pnpm content:export-db-json
pnpm content:validate-db-roundtrip
DATABASE_URL=... pnpm content:db:apply-local
DATABASE_URL=... pnpm content:db:import-local
DATABASE_URL=... pnpm content:db:validate-local
DATABASE_URL=... pnpm content:db:read-local
pnpm test:e2e:db
```

Expected output:

- Offline export prints row counts for Slice 1 tables.
- Offline validation confirms all 3 current seed lessons round-trip.
- Local DB import prints upsert counts by table.
- Local DB validation confirms the database reconstructs valid `lesson-v2` content.
- Local DB read validation confirms the runtime reconstruction layer reads and validates levels, units, lessons, and supported exercise kinds.
- DB-backed E2E builds and starts the app with `CONTENT_SOURCE=postgres`, then verifies Home, Learn, Lesson, and Practice render at a 390px mobile viewport.

Troubleshooting:

- `DATABASE_URL is required`: set a local Supabase/Postgres connection string.
- `psql exited with status`: confirm the database is running and the migration has been applied.
- `relation already exists`: apply the migration to a fresh local database or reset the local database first.
- Round-trip mismatch: do not enable DB reads; inspect the mapper, row ordering, and JSONB fields.

Runtime reminder:

- The learner app still uses TypeScript seed content.
- The DB import/export scripts do not change learner-facing routes.
- The feature-flagged DB path is server-side only and falls back to seed content on failure.
- Normal `pnpm test:e2e`, `pnpm test`, and `pnpm build` do not require a database.

### Phase 4: Read Lessons From DB Behind Feature Flag

Goal:

- Test DB-backed content without removing seed fallback.

Actions:

- Use the server-only `CONTENT_SOURCE` flag.
- Default to TypeScript seed content when `CONTENT_SOURCE` is missing or set to `seed`.
- When `CONTENT_SOURCE=postgres`, require `DATABASE_URL` only for the server-side read path.
- Add DB read path for lesson payloads.
- Keep seed fallback.
- Validate DB payload with Zod before rendering.
- If DB read, validation, or configuration fails, log a server-side warning and render seed content.
- Run the lesson player against DB and seed payloads.
- For route smoke validation, run `pnpm test:e2e:db` after migration/import/read validation succeeds.

Feature flag example:

- `CONTENT_SOURCE=seed`
- `CONTENT_SOURCE=postgres`

Exit criteria:

- Same lesson renders from seed and DB payloads.
- Learner UI does not expose internal metadata.
- E2E tests pass for the DB path in local/dev.

### Phase 5: Add Admin/CMS-lite

Goal:

- Let editors and reviewers manage content without editing TypeScript.

Actions:

- Add admin-only read/write access.
- Add draft/edit/review/approve/publish lifecycle.
- Add content version snapshots.
- Add review task assignment.
- Add methodist, linguist, rights, and audio review status.
- Keep TTS-generated audio metadata aligned with `docs/TTS_AUDIO_PIPELINE.md`.
- Do not migrate generated TTS files into production storage until they are reviewed and intentionally approved for the target release stage.
- Keep generated audio traceable to stable lesson, vocabulary, dialogue, reading, grammar, or future listening IDs.

Exit criteria:

- Draft changes do not affect published learner content.
- Review notes attach to versioned content.
- Published content can be rolled back.

### Phase 6: Move Progress From Local To Backend

Goal:

- Sync learner progress after auth exists.

Actions:

- Add Supabase Auth or selected auth provider.
- Create user profile and learning track tables.
- Map local progress to backend lesson progress, exercise attempts, missed items, review queue items, and flashcards.
- Add conflict/merge behavior.
- Keep local fallback for anonymous users if product needs it.

Migration mapping:

- `completedLessonIds` -> `lesson_progress`
- `lessonStatus` -> `lesson_progress.status`
- `exerciseAttempts` -> `exercise_attempts`
- `missedPractice` -> `missed_items` and `review_queue_items`
- future flashcards -> `flashcards`, `flashcard_reviews`, `srs_state`

Exit criteria:

- Authenticated users keep progress across devices.
- Anonymous local progress can be imported after sign-in if product supports it.
- User-owned data is protected by RLS.

### Phase 7: Keep Export/Import Tools

Goal:

- Avoid lock-in and keep content auditable.

Actions:

- Export DB content to JSON fixtures.
- Import JSON fixtures into local/dev.
- Compare DB payloads with schema snapshots.
- Keep seed/test fixtures small and stable.

Exit criteria:

- Content can be backed up and reviewed outside the app.
- Tests can use deterministic fixtures.
- Migration rollback has usable data snapshots.

## Validation Steps

Before any DB-backed read path is accepted:

- Zod validation passes on source and DB-rendered lesson payload.
- Required source, rights, methodology, and review fields exist.
- No internal source/rights/review metadata appears in learner UI.
- Exercise answer checking still works.
- Audio fallback behavior still works when URL is missing.
- Typecheck, lint, tests, Playwright where relevant, and production build pass.

## Rollback Plan

For content read migration:

- Keep seed content path available.
- Feature flag DB reads.
- If DB read fails validation, fall back to seed content.
- Do not delete seed data until DB-backed content has proven stable.

For migrations:

- Use additive migrations first.
- Avoid destructive table changes until export/import is proven.
- Snapshot content before schema changes.
- Keep content version snapshots for published records.

For progress migration:

- Do not delete local progress immediately.
- Mark migrated local progress with timestamp/version.
- If backend sync fails, preserve local state and retry.

## Content QA Plan

Content QA should verify:

- Level/unit/lesson order.
- Learning goals.
- Vocabulary load.
- Dialogue/text naturalness.
- Grammar accuracy.
- Exercise correctness.
- Audio transcript match.
- Source and rights notes.
- Methodist review status.
- No copied protected content.

Automated QA:

- Zod validation.
- Referential integrity checks.
- Duplicate stable ID checks.
- Missing translation checks.
- Missing rights/source notes checks.
- Published content cannot have `not_reviewed` status unless explicitly allowed for demo.

Manual QA:

- Methodist review.
- Linguist review.
- Rights review.
- Audio review.
- Mobile visual review for learner-facing rendering.

## Methodist Review Workflow

Suggested workflow:

1. Editor drafts or imports content.
2. System validates required fields.
3. Methodist reviews level, sequencing, grammar, and exercises.
4. Linguist reviews naturalness, spelling, translation, and pronunciation claims.
5. Rights reviewer checks source and permissions.
6. Audio reviewer checks recordings when present.
7. Approved version is published.
8. Published content is immutable by version.

Review statuses:

- `not_reviewed`
- `needs_revision`
- `reviewed`
- `approved`

Content statuses:

- `demo`
- `draft`
- `in_review`
- `approved`
- `published`
- `archived`

## Open Decisions

- How much of the schema to implement after the first vertical slice is proven.
- Whether DB lesson reads should use direct table joins, views, or RPC.
- How to represent content versions in the admin UI.
- Whether anonymous local progress should merge into accounts after sign-in.
- How to handle content updates that affect generated flashcards.
