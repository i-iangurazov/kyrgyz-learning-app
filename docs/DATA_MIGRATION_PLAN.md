# Data Migration Plan

This document defines how to migrate from current TypeScript seed content to database-backed curriculum and progress later. It is not an implementation plan for the current task and does not authorize migrations.

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

- Start with levels, units, lessons, vocabulary, dialogues/readings, exercises, audio assets, and source metadata needed for current seed lessons.
- Add migrations in a dedicated backend implementation task.
- Add RLS from the beginning for user-owned tables if any user data exists.
- Keep admin-only tables private.

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

### Phase 4: Read Lessons From DB Behind Feature Flag

Goal:

- Test DB-backed content without removing seed fallback.

Actions:

- Add content-source flag only when requested.
- Add DB read path for lesson payloads.
- Keep seed fallback.
- Validate DB payload with Zod before rendering.
- Run the lesson player against DB and seed payloads.

Feature flag example:

- `NEXT_PUBLIC_CONTENT_SOURCE=seed`
- `NEXT_PUBLIC_CONTENT_SOURCE=db`

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

- How much of the schema to implement in the first migration.
- Whether DB lesson reads should use direct table joins, views, or RPC.
- How to represent content versions in the admin UI.
- Whether anonymous local progress should merge into accounts after sign-in.
- How to handle content updates that affect generated flashcards.
