# Schema Review Notes

This document reviews `docs/POSTGRES_SCHEMA_PROPOSAL.md` for first-migration risk. The proposal is useful as a long-term map, but it is intentionally broader than the first backend implementation should be.

## Review Summary

The proposed schema covers the right domains for the product: source library, curriculum, language knowledge, lesson content, exercises, media, progress, admin review, and audit history.

The main risk is not the direction. The main risk is implementing too much before the app has proven a DB-backed lesson read path. The first migration should use `docs/BACKEND_VERTICAL_SLICE_PLAN.md` and defer everything that is not required to import/export current K0/K1 seed lessons.

## Necessary Now

These tables or concepts are necessary for the first migration:

- `sources`
- `levels`
- `units`
- `lessons`
- `lesson_learning_goals`
- `lesson_supported_tracks`
- `lesson_target_skills`
- `lesson_prerequisites`
- `lesson_methodology_refs`
- `vocabulary_items`
- `lesson_vocabulary`
- `grammar_points`
- `lesson_grammar`
- `dialogues`
- `dialogue_lines`
- `breakdown_items`
- `breakdown_vocabulary`
- `breakdown_grammar`
- `exercises`
- `exercise_items`
- `exercise_options`
- `exercise_answers`
- `exercise_feedback`
- `exercise_links`

These are enough to store the current seed lessons and rebuild the current `lesson-v2` shape.

## Future-Only For Now

These should not be in the first migration unless a future task explicitly expands the backend scope:

- `source_authors`
- `source_author_links`
- `source_usage_rules`
- `source_notes`
- `vocabulary_examples`
- `grammar_examples`
- `sentence_patterns`
- `suffix_rules`
- `common_mistakes`
- `translations`
- `track_explanations`
- `reading_texts`
- `reading_paragraphs`
- reading-specific join tables
- `mini_game_configs`
- `speaking_prompts`
- AI roleplay tables
- `speakers`
- `audio_assets`
- `media_rights`
- `media_review_status`
- user profile/auth/progress tables
- review queue and flashcard/SRS tables
- `content_versions`
- `content_review_tasks`
- `methodist_reviews`
- `audit_log`

Some of these will be important soon. They should still wait until the app has a working DB content import/export loop.

## Polymorphic Link Risks

The proposal uses polymorphic fields such as `content_type/content_id`, `linked_type/linked_id`, and `source_content_type/source_content_id`.

Risks:

- Postgres cannot enforce foreign keys across polymorphic targets.
- Import bugs can create broken references that only fail at render time.
- Learner-safe queries become harder to reason about.
- Admin tools need extra validation logic.

Recommendations:

- In slice 1, use specific join tables where the target is known, such as `lesson_vocabulary`, `lesson_grammar`, `breakdown_vocabulary`, and `breakdown_grammar`.
- Keep `exercise_links` as the only generic link table if needed, and validate targets during import.
- Avoid generic `translations` and `track_explanations` tables in slice 1.
- Add database checks for `linked_type` values and importer tests for referential integrity.

## JSONB Overuse Risks

JSONB is useful, but overuse can turn Postgres into opaque document storage.

High-risk JSONB uses:

- Entire lesson payloads as a single JSONB column.
- Whole exercise objects without normalized item and answer rows.
- Source/rights/review data that needs filtering or reporting.
- User progress or SRS state that needs indexed queries later.

Recommended JSONB uses in slice 1:

- Localized text objects: `{ ky, en, ru }`.
- Track-specific helper/explanation text: `{ RU_KY, EN_KY, KY_KY }`.
- Exercise answer payloads where shape differs by kind.
- Accepted alternatives.
- Lesson-local story content.
- Non-playable audio placeholders until real media tables exist.
- Grammar examples/common mistakes only while they are lesson-local seed data.

Rule:

- If the app must query, filter, review, schedule, or reuse an item independently, normalize it.
- If it only needs to round-trip current lesson content safely, JSONB is acceptable in slice 1.

## Normalization May Be Too Heavy

The broader proposal normalizes many things that are not yet independently edited or queried.

Likely too heavy for first migration:

- `translations`
- `track_explanations`
- `vocabulary_examples`
- `grammar_examples`
- `sentence_patterns`
- `suffix_rules`
- `source_authors`
- detailed source usage tables
- media rights/review tables
- content review task tables

Recommendation:

- Keep first migration smaller than the final schema.
- Normalize vocabulary, lesson structure, dialogue lines, exercise items, options, answers, and feedback.
- Keep nested grammar examples and audio placeholders in JSONB until reuse pressure is real.

## Schema May Be Too Flexible

Flexible areas that need guardrails:

- `exercise_answers.value jsonb` can accept inconsistent shapes.
- `exercise_links.linked_type` can point to unsupported target types.
- `source_notes` and `rights_notes` as free text may become inconsistent.
- `content_status` and `methodist_review_status` need constraints.

Recommendations:

- Add check constraints for status and kind values.
- Validate each `exercise_answers.value` shape in the seed importer and app tests.
- Keep stable naming conventions for IDs before importing.
- Add duplicate-ID checks across content types.

## Schema May Be Too Rigid

Rigid areas that may slow iteration:

- Postgres enums can be painful when exercise kinds or statuses evolve.
- Duration constraints may reject useful outlier lessons.
- Requiring every track explanation before early prototype import can block migration.
- Requiring real audio asset records for placeholder audio would overcomplicate slice 1.

Recommendations:

- Prefer constrained text over Postgres enums in the first migration unless the value is highly stable.
- Keep `estimated_duration_minutes` validation aligned with current Zod, but do not overfit future lessons.
- Allow demo content to remain `not_reviewed` while clearly preventing it from being treated as production-approved.
- Do not require real `audio_assets` rows until the media slice exists.

## Likely Migration Pain Points

- Mapping nested TypeScript lesson data into relational rows.
- Preserving `display_order` across vocabulary, dialogue lines, breakdown items, and exercises.
- Keeping stable IDs identical between TypeScript and DB rows.
- Rebuilding `lesson-v2` payloads exactly enough for Zod validation.
- Preserving exercise answer data for all supported kinds.
- Handling placeholder audio without adding full media tables.
- Preventing internal source, rights, and review fields from leaking into learner UI.
- Keeping seed imports idempotent.
- Deciding how to compare DB-exported lessons against TypeScript seed fixtures.

## Simplifications Before First Migration

- Use `docs/BACKEND_VERTICAL_SLICE_PLAN.md` as the implementation boundary.
- Do not create admin/CMS, content versioning, audit, progress, SRS, AI, speaking, or media tables in the first migration.
- Keep TypeScript seed data as canonical fallback.
- Add import/export tests before changing the app read path.
- Read from DB behind a feature flag later.
- Do not remove or rewrite the current seed content path.

## Concrete Recommendations

- Keep first migration small and lesson-read focused.
- Avoid premature content versioning.
- Avoid full CMS until lesson read path is working.
- Keep current TypeScript seed data as fallback.
- Use feature flags for DB read path later.
- Prefer explicit join tables over polymorphic links where relationships are known.
- Use JSONB only for flexible localized text, answer payloads, and nested fields that do not yet need independent review or reuse.
- Add importer validation for every row that cannot be enforced with foreign keys.
- Keep learner-safe payload construction separate from admin/internal data queries.

