# Database Architecture

This document defines the future database direction for the Kyrgyz learning app. The current seed data in `src/content/seed/lessons.ts` is temporary. It is useful for MVP validation, but production content should move into database-backed, reviewable, versioned records.

The database should preserve the current schema-first discipline: content is structured, linked, validated, reviewable, and safe to render without exposing internal metadata to learners.

Companion implementation-planning docs:

- `docs/POSTGRES_SCHEMA_PROPOSAL.md` defines the first-pass relational table proposal.
- `docs/SUPABASE_IMPLEMENTATION_PLAN.md` defines how Supabase/Postgres could be implemented later.
- `docs/DATA_MIGRATION_PLAN.md` defines how current TypeScript seed content can migrate to database-backed content.

## Design Goals

- Keep curriculum, language knowledge, media, exercises, review, and learner progress as connected domains.
- Support RU -> KY, EN -> KY, and KY -> KY tracks without duplicating lesson logic.
- Preserve source, rights, and validation metadata on every content record.
- Support draft, review, approved, published, and archived content lifecycle states.
- Make every learner-facing item traceable to source/methodology notes and methodist status.
- Keep current local progress models compatible with later backend sync.

## A. Source Library

Purpose:

- Store references used for methodology, sequencing, validation, theme planning, reading selection, and rights review.
- Prevent accidental copying of copyrighted material into app content.

Core entities:

- `sources`
- `authors`
- `source_categories`
- `source_notes`
- `rights_notes`
- `usage_permissions`
- `validated_against_references`

Recommended fields:

- stable source ID
- title
- author or institution
- publication details
- source category: methodology, grammar, Kyrgyztest alignment, Kyrgyz-as-foreign-language, school curriculum, folklore, public-domain, licensed, internal original
- allowed usage: methodology only, validation only, theme planning only, public-domain adaptation, licensed excerpt, explicit permission
- rights notes
- license or permission evidence
- reviewer notes
- created and updated timestamps

Rules:

- HSK and Kyrgyz textbook sources may guide structure, sequencing, validation, and theme planning only unless licensed.
- Modern literary excerpts require license or explicit permission.
- Source records must not imply permission to copy content unless usage permission explicitly allows it.

## B. Curriculum

Purpose:

- Store the navigable learning structure and the lesson flow.

Core entities:

- `levels`
- `units`
- `lessons`
- `lesson_steps`
- `learning_goals`
- `target_skills`
- `prerequisites`

Recommended fields:

- stable IDs for levels, units, lessons, and steps
- level ID: K0-K5
- unit ID and order
- lesson number and order
- estimated duration
- supported tracks: RU_KY, EN_KY, KY_KY
- Kyrgyztest level alignment
- CEFR placeholder, if used internally
- learning goals
- target skills: reading, listening, speaking, grammar, vocabulary, writing
- prerequisite lesson IDs or knowledge item IDs
- content lifecycle status
- methodist review status

Rules:

- The canonical lesson sequence remains: Story -> Goals -> Vocabulary -> Dialogue/Text -> Breakdown -> Grammar -> Practice -> Mini-game -> Speaking -> AI Roleplay -> Review.
- Lesson content must remain database-driven, not hardcoded in React components.
- Learner UI should read published or allowed demo content only.

## C. Language Knowledge Base

Purpose:

- Store reusable Kyrgyz language knowledge independently from individual lessons.
- Let lessons, exercises, flashcards, roleplay, and review connect to the same validated vocabulary and grammar records.

Core entities:

- `vocabulary_items`
- `grammar_points`
- `sentence_patterns`
- `suffix_rules`
- `common_mistakes`
- `examples`
- `translations`
- `track_explanations`

Recommended fields:

- stable knowledge item ID
- level and unit alignment
- Kyrgyz text
- translations: ru, en
- KY-only explanation where needed
- transliteration or pronunciation notes, if approved
- examples
- linked source references
- linked lessons
- linked exercises
- linked audio assets
- methodist review status
- validated against references
- internal notes

Rules:

- Vocabulary and grammar should be reusable across lessons and review systems.
- A grammar point must include examples and common mistakes before it is considered review-ready.
- Suffix rules should be represented as structured knowledge, not buried only in prose.

## D. Exercise Bank

Purpose:

- Store reusable, validated exercise items that can appear in lessons, review sessions, placement, and future tests.

Core entities:

- `exercises`
- `exercise_items`
- `exercise_kinds`
- `exercise_options`
- `correct_answer_data`
- `feedback`
- `difficulty`
- `validation_status`

Supported exercise kinds:

- `multiple_choice`
- `fill_blank`
- `sentence_builder`
- `match_pairs`
- `error_correction`
- `listening_choice`
- `short_answer`

Recommended fields:

- stable exercise ID and item ID
- kind
- prompt by track
- helper text by track
- options, if applicable
- correct answer data
- accepted alternatives, if applicable
- explanation
- feedback: correct, incorrect, hint
- linked vocabulary IDs
- linked grammar point IDs
- linked lesson IDs
- difficulty
- methodist review status
- source notes

Rules:

- Exercises must test taught or review-ready content.
- Wrong-answer feedback should teach, not punish.
- Exercise logic should stay deterministic and testable.

## E. Media

Purpose:

- Store audio and future media assets without mixing storage details into learner-facing content.

Core entities:

- `audio_assets`
- `speakers`
- `transcripts`
- `media_rights`
- `audio_reviews`
- `linked_content`

Recommended audio fields:

- stable audio ID
- URL or storage key
- transcript
- language: ky, ru, en
- voice type: human, synthetic, placeholder
- speaker ID or speaker label
- duration
- rights notes
- source notes
- audio review status: not_recorded, needs_review, approved
- methodist review status
- linked vocabulary, dialogue line, reading paragraph, or exercise item

Rules:

- Human-recorded Kyrgyz audio is preferred for production.
- Synthetic audio may be used only as a temporary/internal placeholder if product policy allows it.
- Missing audio must not block lessons.
- Learner UI must not expose storage keys, rights notes, or review metadata.

## F. Learner Progress

Purpose:

- Track completion, attempts, mistakes, corrected items, review queue state, flashcards, and future SRS scheduling.

Core entities:

- `users`
- `user_lesson_progress`
- `exercise_attempts`
- `mistakes`
- `corrected_items`
- `review_queue_items`
- `flashcards`
- `srs_reviews`
- `srs_schedule`

Recommended fields:

- user ID
- lesson ID
- progress status
- completed at
- exercise attempt answer and result
- submitted answer display
- correct answer display
- explanation shown
- corrected status
- retry attempts
- review queue status
- flashcard due date
- last reviewed and next review
- SRS stability/difficulty fields if FSRS is adopted

Rules:

- Local progress remains acceptable for MVP.
- Backend progress should be designed to import existing local progress concepts.
- Mistakes and corrected items should feed review and future flashcards.
- Do not add stressful learner-facing scoring without a clear UX reason.

## G. Admin/CMS

Purpose:

- Let methodists, linguists, editors, and product owners draft, review, approve, publish, and revise content safely.

Core entities:

- `content_versions`
- `review_tasks`
- `reviewer_notes`
- `approval_events`
- `publish_events`
- `audit_log`

Recommended fields:

- content ID and content type
- version number
- draft payload
- validation results
- reviewer role
- reviewer notes
- methodist review status
- content lifecycle status
- approval timestamp
- published timestamp
- rollback reference

Rules:

- Published learner content should be immutable by version.
- Draft changes should create a new version.
- Reviews should be attached to versioned content, not floating notes.
- Admin metadata must remain hidden from normal learner UI.

## Migration Path From Seed Data

Phase 1:

- Keep `lesson-v2` seed data as the canonical MVP fixture.
- Add database-ready docs and schemas.
- Continue using Zod validation.

Phase 2:

- Introduce database tables mirroring the source, curriculum, knowledge, exercise, media, progress, and admin domains.
- Write import scripts from seed data into staging tables.
- Validate imported records with the existing Zod schemas or generated equivalents.

Phase 3:

- Move learner app reads to published database content.
- Keep seed data for tests and local fallback fixtures.
- Add admin/CMS workflow for draft and review.

Phase 4:

- Add backend user progress sync, review queue sync, flashcards, and SRS scheduling.

## Open Decisions

- Backend choice: Supabase/Postgres is the leading candidate, but should be confirmed before migrations.
- CMS interface: custom admin vs. headless CMS vs. Supabase table/editor workflow.
- Content version format: normalized tables only vs. tables plus versioned JSON snapshots.
- Auth provider and user account model.
- Exact FSRS implementation and schedule storage shape.
