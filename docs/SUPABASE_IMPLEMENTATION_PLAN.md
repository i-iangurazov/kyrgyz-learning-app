# Supabase Implementation Plan

This document explains how the Postgres schema proposal could be implemented with Supabase later. It is not an implementation task and should not be treated as authorization to create migrations, clients, auth, storage, or backend code.

## Why Supabase/Postgres Is A Good Candidate

Supabase gives the product a pragmatic path to:

- Postgres for structured curriculum, content, knowledge, exercises, media, progress, and review data.
- Auth for learner accounts later.
- Row-level security for user progress privacy and admin/editor separation.
- Storage for human-recorded audio assets.
- Local development tooling when implementation starts.
- SQL access for import/export and content QA.

Postgres fits this product because the data is highly relational: lessons link to vocabulary, grammar, exercises, audio, source records, review status, and learner progress.

## Implementation Principles

- Do not implement Supabase until a task explicitly asks for backend implementation.
- Start with a thin vertical slice rather than the entire schema.
- Keep current TypeScript seed content as the source of truth until DB reads are proven.
- Keep Zod validation in the import/read path.
- Keep learner-facing UI free of internal source, rights, review, and audit metadata.
- Add RLS before storing real user data.

## Suggested First Backend Slice

First implementation should be intentionally narrow:

1. Create source/curriculum/content tables needed for current K0/K1 seed lessons.
2. Import existing TypeScript seed lessons into staging or dev tables.
3. Read one lesson from DB behind a feature flag.
4. Compare DB-rendered lesson output against current seed-rendered output.
5. Keep local progress unchanged until content reads are stable.

Avoid implementing user progress, flashcards, SRS, admin workflow, or storage uploads in the first slice unless explicitly requested.

## Auth Plan Later

Use Supabase Auth only when the product needs account-backed progress.

Potential profile model:

- `auth.users` owns authentication.
- `user_profiles` stores app-level fields.
- `user_learning_tracks` stores selected track, goals, and level.
- Progress tables reference `user_profiles.id`.

RLS principle:

- Users can read and update their own profile/progress.
- Users cannot read other users' progress.
- Admin/service roles can perform controlled support or migration operations.

Do not implement yet:

- Sign-in UI.
- Social auth.
- Password reset flow.
- Account deletion flow.
- Progress sync.

## Storage Plan For Audio

Use Supabase Storage or another S3-compatible service for audio.

Recommended bucket direction:

- `lesson-audio-dev` for development/test assets.
- `lesson-audio` for production approved assets later.

Audio records should live in `audio_assets`:

- `storage_key`
- `url` or signed URL strategy
- `transcript`
- `language`
- `voice_type`
- `speaker_id`
- `duration_seconds`
- `rights_notes`
- `audio_review_status`
- `methodist_review_status`

Storage rules:

- Placeholder records can use storage keys without real files.
- Human-recorded Kyrgyz audio is preferred for production.
- Synthetic audio must not be labeled as native-quality final audio.
- Learner UI should show unavailable state when there is no playable URL.
- Rights and review notes stay internal.

Do not implement yet:

- Audio upload UI.
- Recording pipeline.
- CDN policy.
- Signed URL refresh logic.
- Speech recognition or pronunciation scoring.

## RLS Principles

Public read:

- Published curriculum.
- Published lesson content.
- Published exercises that are safe for normal practice.
- Approved playable audio metadata.

Restricted read:

- Draft and in-review content.
- Internal source notes and rights notes.
- Content versions.
- Review tasks.
- Audit logs.
- User progress.

User-owned read/write:

- Lesson progress.
- Exercise attempts.
- Missed items.
- Review queue.
- Flashcards.
- Flashcard reviews.
- SRS state.

Admin/editor/reviewer access:

- Content draft/review tables.
- Methodology/source metadata.
- Rights review.
- Media review.
- Audit events.

RLS policies should be tested with positive and negative cases before launch.

## Public Vs Private Tables

Public learner-readable candidates:

- `levels`
- `units`
- published rows in `lessons`
- published lesson content tables
- published vocabulary/grammar/examples needed for lessons
- published exercise tables for practice
- approved audio metadata needed for playback

Private/internal candidates:

- `source_usage_rules`
- detailed `source_notes`
- `media_rights`
- `media_review_status`
- `content_versions`
- `content_review_tasks`
- `methodist_reviews`
- `audit_log`

User private:

- `user_profiles`
- `user_learning_tracks`
- `lesson_progress`
- `exercise_attempts`
- `missed_items`
- `review_queue_items`
- `flashcards`
- `flashcard_reviews`
- `srs_state`

## Content Read Access

Initial content reads can use one of two patterns:

Option A: direct table reads.

- Simple for early MVP.
- Needs careful RLS and query composition.
- Good for public published content.

Option B: Postgres views or RPC.

- Better for hiding internal fields.
- Can return lesson-shaped payloads matching `lesson-v2`.
- Useful for stable API contracts.

Preferred later approach:

- Use a learner-safe view or RPC that returns only learner-facing fields.
- Keep admin/editor reads separate.
- Validate returned payloads with Zod in app code during migration.

## Admin/Content Editor Access

Admin implementation should come after content read migration.

Possible roles:

- `admin`
- `content_editor`
- `methodist_reviewer`
- `linguist_reviewer`
- `rights_reviewer`
- `audio_reviewer`

Admin capabilities:

- Create drafts.
- Edit unpublished content.
- Add source/rights notes.
- Assign review tasks.
- Approve content versions.
- Publish approved versions.

Do not expose admin tooling in the learner app shell.

## Migration Strategy

Phase 1: documentation and schema proposal.

- Current state.
- No DB implementation.

Phase 2: local Supabase setup.

- Add Supabase tooling only when explicitly requested.
- Create dev database.
- Add first migration for a narrow schema slice.

Phase 3: seed import.

- Import current TypeScript lesson seed data.
- Validate imported DB data against Zod.
- Compare DB lesson payloads with current in-app seed lessons.

Phase 4: feature-flagged DB read path.

- Add environment flag such as `NEXT_PUBLIC_CONTENT_SOURCE=db`.
- Keep seed fallback.
- Run E2E against both paths if practical.

Phase 5: backend progress.

- Add auth.
- Add progress sync.
- Migrate local progress only after user account flow exists.

## Environment Variables Later

Likely variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `NEXT_PUBLIC_CONTENT_SOURCE`
- `AUDIO_BUCKET_NAME`

Rules:

- Service role key is server-only.
- Do not expose admin credentials to browser code.
- Use `.env.local` for local development and deployment secrets for production.

## Local Dev Approach Later

When implementation is requested:

1. Install/configure Supabase CLI if not already present.
2. Run local Supabase stack.
3. Add migrations.
4. Add seed import script.
5. Add Zod validation for imported records.
6. Add tests for DB payload shape.
7. Keep current seed content path as fallback.

## What Not To Implement Yet

- No migrations.
- No Supabase client.
- No auth.
- No storage buckets.
- No admin/CMS UI.
- No backend progress sync.
- No flashcard/SRS backend.
- No replacement of TypeScript seed content.
- No learner-facing exposure of internal source, rights, review, or audit metadata.

## Open Decisions

- Direct table reads vs learner-safe RPC/views.
- Exact role and permission model.
- Whether content versions use normalized rows, JSONB snapshots, or both.
- Whether Supabase Storage is final or an S3-compatible provider is preferred.
- How local progress should merge into backend accounts.
