# Postgres Schema Proposal

This is a first-pass relational schema proposal for a future Supabase/Postgres backend. It is not a migration and should not be applied directly. The goal is to make the data model concrete enough to review before implementation.

The proposal mirrors the current `lesson-v2` TypeScript/Zod model while separating reusable language knowledge, lesson presentation, exercises, media, progress, and admin review.

## Design Principles

- Use stable text IDs for curriculum/content records where they already exist, such as `k0-u1-l1`, `salam`, or `ex-greeting-fill`.
- Use UUIDs for user-owned records, review tasks, audit events, and generated objects.
- Normalize reusable language knowledge, source records, media, exercises, and progress.
- Use JSONB only for flexible localized text, answer payloads, mini-game config, and version snapshots.
- Keep internal source, rights, review, and audit fields out of learner-facing queries.
- Keep row-level security in mind from the first implementation.

## Enum Proposals

Use Postgres enums or constrained text columns. Enums are stricter; constrained text is easier to evolve. First migration can use constrained text if we expect wording changes.

- `learning_track`: `RU_KY`, `EN_KY`, `KY_KY`
- `level_id`: `K0`, `K1`, `K2`, `K3`, `K4`, `K5`
- `content_status`: `demo`, `draft`, `in_review`, `approved`, `published`, `archived`
- `methodist_review_status`: `not_reviewed`, `needs_revision`, `reviewed`, `approved`
- `target_skill`: `reading`, `listening`, `speaking`, `grammar`, `vocabulary`, `writing`
- `source_category`: `methodology`, `grammar_reference`, `level_alignment`, `kyrgyz_as_foreign_language`, `school_curriculum`, `literature`, `folklore`, `public_domain`, `licensed`, `internal_original`
- `rights_status`: `unknown`, `methodology_only`, `validation_only`, `public_domain`, `licensed`, `permission_granted`, `original_app_authored`, `blocked`
- `usage_permission`: `methodology_only`, `validation_only`, `theme_planning_only`, `copy_allowed`, `adaptation_allowed`, `excerpt_allowed`, `not_allowed`
- `reading_source_type`: `original`, `adapted`, `public_domain`, `licensed`, `excerpt_requires_permission`
- `exercise_kind`: `multiple_choice`, `fill_blank`, `sentence_builder`, `match_pairs`, `error_correction`, `listening_choice`, `short_answer`
- `answer_kind`: `choice_id`, `text`, `ordered_ids`, `pairs`, `free_text`
- `mini_game_type`: `crossword`, `word_match`, `sentence_puzzle`, `find_mistake`, `kyrgyz_wordle`
- `audio_language`: `ky`, `ru`, `en`
- `audio_voice_type`: `human`, `synthetic`, `placeholder`
- `audio_review_status`: `not_recorded`, `needs_review`, `approved`
- `lesson_progress_status`: `not_started`, `in_progress`, `complete`
- `review_queue_status`: `needs_review`, `corrected`, `dismissed`
- `flashcard_status`: `new`, `learning`, `review`, `suspended`, `retired`
- `content_review_task_status`: `open`, `in_review`, `needs_changes`, `approved`, `closed`

## Shared Column Patterns

Content tables should usually include:

- `id`: stable text ID for authored content or UUID for generated/admin records
- `created_at`, `updated_at`
- `content_status`
- `methodist_review_status`
- `source_notes`
- `rights_notes`
- `internal_notes`

Localized text can be JSONB:

```ts
{ ky: string, en: string, ru?: string }
```

Track-specific text can be JSONB:

```ts
{ RU_KY: string, EN_KY: string, KY_KY: string }
```

## A. Source Library

### `source_categories`

Purpose: Controlled categories for source classification.

- Primary key: `id text`
- Important columns: `label`, `description`, `allowed_default_usage`
- Foreign keys: none
- Indexes: unique `label`
- Constraints: `id` should map to source category enum values
- RLS/security: public read can be allowed; writes restricted to admins/editors

### `source_authors`

Purpose: Store authors, editors, institutions, or organizations connected to sources.

- Primary key: `id uuid`
- Important columns: `display_name`, `native_name`, `role_hint`, `notes`
- Foreign keys: none
- Indexes: `display_name`, `native_name`
- Constraints: require at least one display name
- RLS/security: public read is acceptable if sources are public; writes restricted to admins/editors

### `sources`

Purpose: Store source/library records used for methodology, validation, theme planning, or licensed content.

- Primary key: `id text`
- Important columns: `title`, `native_title`, `publication_year`, `category_id`, `language`, `rights_status`, `usage_permission`, `url`, `bibliographic_reference`, `can_copy`, `can_adapt`, `methodology_only`, `validation_only`, `notes`
- Foreign keys: `category_id -> source_categories.id`
- Indexes: `category_id`, `rights_status`, `usage_permission`, `language`, full-text index on `title/native_title`
- Constraints: `can_copy` and `can_adapt` must be false when usage is methodology/validation only
- RLS/security: published source metadata can be readable; rights/license evidence should be admin-only if sensitive

### `source_author_links`

Purpose: Many-to-many link between sources and authors/editors.

- Primary key: composite `source_id`, `author_id`, `role`
- Important columns: `source_id`, `author_id`, `role`, `display_order`
- Foreign keys: `source_id -> sources.id`, `author_id -> source_authors.id`
- Indexes: `source_id`, `author_id`
- Constraints: one author-role-display combination per source
- RLS/security: follows source read rules; writes restricted to admins/editors

### `source_usage_rules`

Purpose: Record explicit allowed and disallowed usage for a source.

- Primary key: `id uuid`
- Important columns: `source_id`, `usage_permission`, `can_copy`, `can_adapt`, `can_quote`, `requires_attribution`, `requires_license`, `license_summary`, `permission_reference`, `reviewed_by`, `reviewed_at`
- Foreign keys: `source_id -> sources.id`, `reviewed_by -> user_profiles.id` later
- Indexes: `source_id`, `usage_permission`, `requires_license`
- Constraints: if `requires_license = true`, require `license_summary` or `permission_reference` before publishing derived content
- RLS/security: admin/editor read; do not expose detailed rights workflow to learners

### `source_notes`

Purpose: Store source-specific notes, methodist validation notes, and rights review notes.

- Primary key: `id uuid`
- Important columns: `source_id`, `note_type`, `body`, `created_by`, `created_at`
- Foreign keys: `source_id -> sources.id`, `created_by -> user_profiles.id` later
- Indexes: `source_id`, `note_type`
- Constraints: note body required
- RLS/security: admin/editor only by default

## B. Curriculum

### `levels`

Purpose: Store K0-K5 level definitions.

- Primary key: `id text`
- Important columns: `title jsonb`, `description jsonb`, `display_order`, `kyrgyztest_level`, `cefr_placeholder`
- Foreign keys: none
- Indexes: `display_order`
- Constraints: `id` must match level enum
- RLS/security: public read for published curriculum

### `units`

Purpose: Group lessons inside a level.

- Primary key: `id text`
- Important columns: `level_id`, `title jsonb`, `description jsonb`, `display_order`, `content_status`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`
- Indexes: `level_id, display_order`, `content_status`
- Constraints: unique `(level_id, display_order)`
- RLS/security: public read for published/demo allowed content; draft rows admin/editor only

### `lessons`

Purpose: Store lesson metadata and lifecycle.

- Primary key: `id text`
- Important columns: `schema_version`, `level_id`, `unit_id`, `stable_lesson_id`, `lesson_number`, `display_order`, `title jsonb`, `subtitle jsonb`, `estimated_duration_minutes`, `sample_notice`, `validation_todos jsonb`, `kyrgyztest_level`, `cefr_level_placeholder`, `content_status`, `methodist_review_status`, `is_demo_content`, `is_original_content`, `requires_license`, `source_notes`, `rights_notes`, `internal_notes jsonb`, `methodist_notes jsonb`
- Foreign keys: `level_id -> levels.id`, `unit_id -> units.id`
- Indexes: `unit_id, display_order`, `level_id`, `content_status`, `methodist_review_status`
- Constraints: unique `stable_lesson_id`, unique `(unit_id, lesson_number)`, duration between 5 and 20 for current MVP
- RLS/security: public read only for published/demo allowed rows; drafts restricted

### `lesson_supported_tracks`

Purpose: Many-to-many lesson support for RU_KY, EN_KY, KY_KY.

- Primary key: composite `lesson_id`, `track`
- Important columns: `lesson_id`, `track`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `track`
- Constraints: track must match `learning_track`
- RLS/security: follows lesson read rules

### `lesson_steps`

Purpose: Store ordered lesson flow sections.

- Primary key: `id uuid`
- Important columns: `lesson_id`, `step_key`, `title`, `display_order`, `content_ref_type`, `content_ref_id`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id, display_order`, `content_ref_type, content_ref_id`
- Constraints: unique `(lesson_id, step_key)`, unique `(lesson_id, display_order)`
- RLS/security: follows lesson read rules

### `learning_goals`

Purpose: Store observable lesson goals.

- Primary key: `id uuid`
- Important columns: `lesson_id`, `goal_text jsonb`, `display_order`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id, display_order`
- Constraints: max 4 active goals per lesson should be enforced in app/admin validation
- RLS/security: follows lesson read rules

### `lesson_prerequisites`

Purpose: Link lesson prerequisites to other lessons or knowledge records.

- Primary key: composite `lesson_id`, `prerequisite_type`, `prerequisite_id`
- Important columns: `lesson_id`, `prerequisite_type`, `prerequisite_id`
- Foreign keys: `lesson_id -> lessons.id`; target references are polymorphic and validated by admin/import logic
- Indexes: `lesson_id`, `prerequisite_type, prerequisite_id`
- Constraints: `prerequisite_type` in `lesson`, `vocabulary`, `grammar_point`, `sentence_pattern`
- RLS/security: follows lesson read rules

### `lesson_target_skills`

Purpose: Many-to-many lesson target skills.

- Primary key: composite `lesson_id`, `target_skill`
- Important columns: `lesson_id`, `target_skill`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `target_skill`
- Constraints: target skill enum
- RLS/security: follows lesson read rules

### `lesson_methodology_refs`

Purpose: Link lessons to methodology/source references.

- Primary key: composite `lesson_id`, `source_id`, `hsk_component`
- Important columns: `lesson_id`, `source_id`, `hsk_component`
- Foreign keys: `lesson_id -> lessons.id`, `source_id -> sources.id`
- Indexes: `lesson_id`, `source_id`, `hsk_component`
- Constraints: HSK component must match existing component enum
- RLS/security: learner queries should not expose internal methodology refs unless intentionally surfaced

## C. Language Knowledge Base

### `vocabulary_items`

Purpose: Store reusable vocabulary and fixed phrases.

- Primary key: `id text`
- Important columns: `kyrgyz`, `transliteration`, `level_id`, `introduced_in_lesson_id`, `tags text[]`, `source_notes`, `rights_notes`, `content_status`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`, `introduced_in_lesson_id -> lessons.id`
- Indexes: `level_id`, `introduced_in_lesson_id`, GIN on `tags`, full-text or trigram index on `kyrgyz`
- Constraints: Kyrgyz text required; final/published items require approved review status
- RLS/security: public read for published/demo allowed content; internal notes hidden

### `vocabulary_examples`

Purpose: Store example sentences for vocabulary.

- Primary key: `id text`
- Important columns: `vocabulary_item_id`, `kyrgyz`, `transliteration`, `translations jsonb`, `audio_asset_id`, `display_order`, `source_notes`, `rights_notes`, `methodist_review_status`
- Foreign keys: `vocabulary_item_id -> vocabulary_items.id`, `audio_asset_id -> audio_assets.id`
- Indexes: `vocabulary_item_id`, `audio_asset_id`
- Constraints: translation JSON must include `en` and `ru`
- RLS/security: follows vocabulary read rules

### `grammar_points`

Purpose: Store reusable grammar explanations.

- Primary key: `id text`
- Important columns: `title jsonb`, `level_id`, `simple_rule jsonb`, `explanations_by_track jsonb`, `source_notes`, `validation_notes`, `validated_against jsonb`, `content_status`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`
- Indexes: `level_id`, `content_status`, `methodist_review_status`
- Constraints: explanations must include RU_KY, EN_KY, KY_KY before publication
- RLS/security: public read for published/demo allowed content; validation notes admin/editor only

### `grammar_examples`

Purpose: Store examples attached to grammar points.

- Primary key: `id text`
- Important columns: `grammar_point_id`, `kyrgyz`, `transliteration`, `translations jsonb`, `display_order`
- Foreign keys: `grammar_point_id -> grammar_points.id`
- Indexes: `grammar_point_id`
- Constraints: translation JSON must include `en` and `ru`
- RLS/security: follows grammar point read rules

### `sentence_patterns`

Purpose: Store reusable phrase/sentence constructions.

- Primary key: `id text`
- Important columns: `level_id`, `pattern`, `title jsonb`, `meaning jsonb`, `notes_by_track jsonb`, `source_notes`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`
- Indexes: `level_id`, `methodist_review_status`
- Constraints: pattern required; must link to at least one example before publication through admin validation
- RLS/security: public read for published/demo allowed content

### `suffix_rules`

Purpose: Store structured suffix rules and examples for Kyrgyz grammar.

- Primary key: `id text`
- Important columns: `level_id`, `suffix`, `rule_title jsonb`, `rule_text_by_track jsonb`, `conditions jsonb`, `examples jsonb`, `source_notes`, `validated_against jsonb`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`
- Indexes: `level_id`, `suffix`
- Constraints: do not publish without validated grammar references
- RLS/security: public read for approved learner-safe rules only; drafts restricted

### `common_mistakes`

Purpose: Store predictable learner mistakes linked to grammar, vocabulary, or patterns.

- Primary key: `id text`
- Important columns: `level_id`, `track`, `incorrect_pattern`, `correction`, `explanation jsonb`, `grammar_point_id`, `vocabulary_item_id`, `sentence_pattern_id`, `source_notes`, `methodist_review_status`
- Foreign keys: `level_id -> levels.id`, optional links to `grammar_points`, `vocabulary_items`, `sentence_patterns`
- Indexes: `level_id`, `track`, `grammar_point_id`, `vocabulary_item_id`, `sentence_pattern_id`
- Constraints: at least one content link should exist before use in exercises
- RLS/security: public read for published/demo allowed content

### `translations`

Purpose: Normalize translations for vocabulary, examples, dialogues, readings, and reusable content when shared translation management is needed.

- Primary key: `id uuid`
- Important columns: `content_type`, `content_id`, `field_name`, `language`, `text`, `review_status`
- Foreign keys: polymorphic target; validated by admin/import logic
- Indexes: `content_type, content_id`, `language`, `review_status`
- Constraints: language in `ky`, `ru`, `en`; source text should usually remain on the parent row
- RLS/security: learner read only for allowed published content; translator/editor writes restricted

### `track_explanations`

Purpose: Store explanations scoped to RU_KY, EN_KY, or KY_KY for reusable knowledge.

- Primary key: `id uuid`
- Important columns: `content_type`, `content_id`, `track`, `explanation`, `review_status`
- Foreign keys: polymorphic target; validated by admin/import logic
- Indexes: `content_type, content_id`, `track`
- Constraints: track enum
- RLS/security: learner sees only the selected track and only for publishable content

### Knowledge join tables

Purpose: Preserve many-to-many links without overloading JSON arrays.

- `vocabulary_lesson_links`: `vocabulary_item_id -> vocabulary_items.id`, `lesson_id -> lessons.id`
- `grammar_lesson_links`: `grammar_point_id -> grammar_points.id`, `lesson_id -> lessons.id`
- `pattern_lesson_links`: `sentence_pattern_id -> sentence_patterns.id`, `lesson_id -> lessons.id`
- `knowledge_source_links`: `content_type`, `content_id`, `source_id -> sources.id`, `relationship_type`

Indexes: both sides of each join. RLS follows the joined content visibility.

## D. Lesson Content

### `dialogues`

Purpose: Store dialogue blocks used in lessons.

- Primary key: `id text`
- Important columns: `lesson_id`, `title jsonb`, `context jsonb`, `audio_asset_id`, `reading_source_type`, `source_notes`, `rights_notes`, `is_original_content`, `requires_license`, `naturalness_review_status`, `methodist_review_status`
- Foreign keys: `lesson_id -> lessons.id`, `audio_asset_id -> audio_assets.id`
- Indexes: `lesson_id`, `naturalness_review_status`
- Constraints: source/rights notes required; naturalness review required before publication
- RLS/security: follows lesson read rules; internal notes hidden

### `dialogue_lines`

Purpose: Store ordered lines inside a dialogue.

- Primary key: `id text`
- Important columns: `dialogue_id`, `speaker`, `kyrgyz`, `transliteration`, `translations jsonb`, `audio_asset_id`, `display_order`
- Foreign keys: `dialogue_id -> dialogues.id`, `audio_asset_id -> audio_assets.id`
- Indexes: `dialogue_id, display_order`, `audio_asset_id`
- Constraints: unique `(dialogue_id, display_order)`; translations include `en` and `ru`
- RLS/security: follows dialogue/lesson read rules

### `reading_texts`

Purpose: Store short readings and future graded texts.

- Primary key: `id text`
- Important columns: `lesson_id`, `title jsonb`, `reading_source_type`, `source_notes`, `rights_notes`, `is_original_content`, `requires_license`, `naturalness_review_status`, `methodist_review_status`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id`, `reading_source_type`, `requires_license`
- Constraints: rights notes required; `requires_license = false` for original/public-domain/published safe readings
- RLS/security: follows lesson read rules; drafts and rights-sensitive notes restricted

### `reading_paragraphs`

Purpose: Store chunked reading text paragraphs.

- Primary key: `id text`
- Important columns: `reading_text_id`, `kyrgyz`, `translations jsonb`, `audio_asset_id`, `display_order`
- Foreign keys: `reading_text_id -> reading_texts.id`, `audio_asset_id -> audio_assets.id`
- Indexes: `reading_text_id, display_order`, `audio_asset_id`
- Constraints: unique `(reading_text_id, display_order)`
- RLS/security: follows reading text read rules

### `breakdown_items`

Purpose: Store phrase/chunk breakdowns linked to dialogue or reading content.

- Primary key: `id text`
- Important columns: `lesson_id`, `source_content_type`, `source_content_id`, `phrase`, `meaning_by_track jsonb`, `notes_by_track jsonb`, `source_notes`, `methodist_review_status`, `display_order`
- Foreign keys: `lesson_id -> lessons.id`; source target is polymorphic and validated by import/admin logic
- Indexes: `lesson_id, display_order`, `source_content_type, source_content_id`
- Constraints: meaning_by_track includes RU_KY, EN_KY, KY_KY
- RLS/security: follows lesson read rules

### Lesson content join tables

- `dialogue_vocabulary_links`: `dialogue_id`, `vocabulary_item_id`
- `dialogue_grammar_links`: `dialogue_id`, `grammar_point_id`
- `reading_vocabulary_links`: `reading_text_id`, `vocabulary_item_id`
- `reading_grammar_links`: `reading_text_id`, `grammar_point_id`
- `breakdown_vocabulary_links`: `breakdown_item_id`, `vocabulary_item_id`
- `breakdown_grammar_links`: `breakdown_item_id`, `grammar_point_id`

Use indexes on both sides. RLS follows parent lesson content.

## E. Exercise Bank

### `exercises`

Purpose: Store exercise groups used in lessons, review, placement, or tests.

- Primary key: `id text`
- Important columns: `lesson_id`, `kind`, `prompt jsonb`, `helper_text_by_track jsonb`, `difficulty`, `hsk_inspired_components text[]`, `source_notes`, `content_status`, `methodist_review_status`, `display_order`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id, display_order`, `kind`, `difficulty`, `content_status`
- Constraints: kind must match exercise enum; prompt must include learner-facing EN/KY and track support as needed
- RLS/security: public read for published/demo allowed exercises; drafts restricted

### `exercise_items`

Purpose: Store individual prompts/items inside exercises.

- Primary key: `id text`
- Important columns: `exercise_id`, `question jsonb`, `audio_asset_id`, `explanation jsonb`, `display_order`
- Foreign keys: `exercise_id -> exercises.id`, `audio_asset_id -> audio_assets.id`
- Indexes: `exercise_id, display_order`, `audio_asset_id`
- Constraints: unique `(exercise_id, display_order)`
- RLS/security: follows exercise read rules

### `exercise_options`

Purpose: Store options and tiles for multiple choice, sentence builder, match pairs, and listening choice.

- Primary key: `id text`
- Important columns: `exercise_item_id`, `option_text jsonb`, `display_order`, `option_group`, `metadata jsonb`
- Foreign keys: `exercise_item_id -> exercise_items.id`
- Indexes: `exercise_item_id, display_order`, `option_group`
- Constraints: options required for option-based exercise kinds through admin validation
- RLS/security: follows exercise item read rules

### `exercise_answers`

Purpose: Store correct answer data and accepted alternatives.

- Primary key: `id uuid`
- Important columns: `exercise_item_id`, `answer_kind`, `value jsonb`, `accepted_alternatives jsonb`, `display_value`, `is_primary`
- Foreign keys: `exercise_item_id -> exercise_items.id`
- Indexes: `exercise_item_id`, `answer_kind`
- Constraints: at least one primary answer per exercise item; `value` shape validated by app/admin schema
- RLS/security: learner clients may need correct answers for local checking in MVP; for future tests/placement, answer access should be RPC/server-gated

### `exercise_feedback`

Purpose: Store feedback, hints, and explanations by item.

- Primary key: `id uuid`
- Important columns: `exercise_item_id`, `correct_feedback jsonb`, `incorrect_feedback jsonb`, `hint jsonb`
- Foreign keys: `exercise_item_id -> exercise_items.id`
- Indexes: `exercise_item_id`
- Constraints: one feedback row per item
- RLS/security: follows exercise item read rules

### `exercise_links`

Purpose: Link exercises or items to vocabulary, grammar, sentence patterns, lessons, and source content.

- Primary key: `id uuid`
- Important columns: `exercise_id`, `exercise_item_id`, `linked_type`, `linked_id`, `relationship_type`
- Foreign keys: `exercise_id -> exercises.id`, `exercise_item_id -> exercise_items.id`
- Indexes: `exercise_id`, `exercise_item_id`, `linked_type, linked_id`
- Constraints: linked target validated by import/admin logic
- RLS/security: follows exercise read rules

## F. Mini-games / Speaking / AI Roleplay

### `mini_game_configs`

Purpose: Store future mini-game configuration.

- Primary key: `id text`
- Important columns: `lesson_id`, `type`, `title jsonb`, `description jsonb`, `config jsonb`, `target_skill`, `difficulty`, `hsk_inspired_components text[]`, `methodist_review_status`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id`, `type`, `target_skill`
- Constraints: config JSON validated by game-specific Zod schema
- RLS/security: public read for published/demo allowed lesson content

### `speaking_prompts`

Purpose: Store speaking prompts and expected phrases.

- Primary key: `id text`
- Important columns: `lesson_id`, `title jsonb`, `prompt jsonb`, `expected_phrases text[]`, `pronunciation_focus`, `sample_answer`, `methodist_review_status`
- Foreign keys: `lesson_id -> lessons.id`
- Indexes: `lesson_id`, `methodist_review_status`
- Constraints: expected phrases required; pronunciation focus should remain review-gated
- RLS/security: public read for published/demo allowed content; review notes hidden

### `ai_roleplay_scenarios`

Purpose: Store constrained roleplay scenarios.

- Primary key: `id text`
- Important columns: `lesson_id`, `scenario_id`, `level_id`, `title jsonb`, `situation jsonb`, `user_goal jsonb`, `ai_character jsonb`, `correction_style`, `uncertainty_rules jsonb`, `refusal_rules jsonb`, `system_prompt_template`, `methodist_review_status`
- Foreign keys: `lesson_id -> lessons.id`, `level_id -> levels.id`
- Indexes: `lesson_id`, `level_id`, `scenario_id`
- Constraints: AI scenarios require allowed vocabulary or phrases before publication
- RLS/security: learner-facing queries should not expose internal system prompts; use server-side function later

### `ai_roleplay_allowed_vocabulary`

Purpose: Link AI scenarios to allowed vocabulary.

- Primary key: composite `scenario_id`, `vocabulary_item_id`
- Important columns: `scenario_id`, `vocabulary_item_id`
- Foreign keys: `scenario_id -> ai_roleplay_scenarios.id`, `vocabulary_item_id -> vocabulary_items.id`
- Indexes: `vocabulary_item_id`
- Constraints: linked vocabulary should be at or below scenario level
- RLS/security: safe to expose as allowed learner content; internal prompt rules hidden

### `ai_roleplay_allowed_grammar`

Purpose: Link AI scenarios to allowed grammar.

- Primary key: composite `scenario_id`, `grammar_point_id`
- Important columns: `scenario_id`, `grammar_point_id`
- Foreign keys: `scenario_id -> ai_roleplay_scenarios.id`, `grammar_point_id -> grammar_points.id`
- Indexes: `grammar_point_id`
- Constraints: linked grammar should be at or below scenario level
- RLS/security: safe to expose summary links if needed

### `ai_roleplay_allowed_phrases`

Purpose: Store allowed phrases for constrained roleplay.

- Primary key: `id uuid`
- Important columns: `scenario_id`, `phrase`, `display_order`
- Foreign keys: `scenario_id -> ai_roleplay_scenarios.id`
- Indexes: `scenario_id, display_order`
- Constraints: phrase required; phrase naturalness must be reviewed before production
- RLS/security: safe to expose as learner guidance

## G. Media

### `speakers`

Purpose: Store speaker metadata for human-recorded audio.

- Primary key: `id uuid`
- Important columns: `display_name`, `region`, `language_background`, `voice_notes`, `consent_status`, `internal_notes`
- Foreign keys: none
- Indexes: `display_name`, `consent_status`
- Constraints: consent required before publishing audio by speaker
- RLS/security: learner UI may not need speaker details; personal/internal details admin-only

### `audio_assets`

Purpose: Store playable or placeholder audio asset records.

- Primary key: `id text`
- Important columns: `storage_key`, `url`, `transcript`, `language`, `voice_type`, `speaker_id`, `speaker_label`, `duration_seconds`, `source_notes`, `rights_notes`, `methodist_review_status`, `audio_review_status`
- Foreign keys: `speaker_id -> speakers.id`
- Indexes: `language`, `voice_type`, `audio_review_status`, `storage_key`
- Constraints: require either `url` or `storage_key`; transcript required; approved audio should have rights notes and review status approved
- RLS/security: public read for playable published audio metadata; storage access controlled by bucket policies; rights/source notes admin-only

### `media_rights`

Purpose: Store rights/permission metadata for audio and future media.

- Primary key: `id uuid`
- Important columns: `media_type`, `media_id`, `rights_status`, `license_summary`, `permission_reference`, `expires_at`, `reviewed_by`, `reviewed_at`
- Foreign keys: `reviewed_by -> user_profiles.id` later; media target polymorphic
- Indexes: `media_type, media_id`, `rights_status`, `expires_at`
- Constraints: approved/published media must have a safe rights status
- RLS/security: admin/editor only

### `media_review_status`

Purpose: Store pronunciation/naturalness/quality review events for media.

- Primary key: `id uuid`
- Important columns: `media_type`, `media_id`, `review_type`, `status`, `reviewer_id`, `notes`, `reviewed_at`
- Foreign keys: `reviewer_id -> user_profiles.id` later
- Indexes: `media_type, media_id`, `review_type`, `status`
- Constraints: notes required for rejected/needs_revision statuses
- RLS/security: admin/editor only

## H. Learner Progress

### `user_profiles`

Purpose: Store app-level profile fields connected to Supabase Auth users later.

- Primary key: `id uuid`
- Important columns: `auth_user_id`, `display_name`, `preferred_track`, `daily_goal_minutes`, `created_at`, `updated_at`
- Foreign keys: `auth_user_id -> auth.users.id` in Supabase
- Indexes: unique `auth_user_id`, `preferred_track`
- Constraints: one profile per auth user
- RLS/security: user can read/update own profile; admin can support/manage

### `user_learning_tracks`

Purpose: Store selected learning tracks and goals.

- Primary key: `id uuid`
- Important columns: `user_id`, `track`, `goal`, `current_level_id`, `placement_result jsonb`, `is_active`
- Foreign keys: `user_id -> user_profiles.id`, `current_level_id -> levels.id`
- Indexes: `user_id`, `track`, `is_active`
- Constraints: one active primary track per user unless product supports multiple
- RLS/security: user-owned only

### `lesson_progress`

Purpose: Store user lesson completion and summary counters.

- Primary key: composite `user_id`, `lesson_id`
- Important columns: `user_id`, `lesson_id`, `status`, `started_at`, `completed_at`, `completed_count`, `correct_count`, `incorrect_count`, `missed_count`, `corrected_missed_count`
- Foreign keys: `user_id -> user_profiles.id`, `lesson_id -> lessons.id`
- Indexes: `user_id, status`, `lesson_id`, `completed_at`
- Constraints: `completed_at` required when status is complete
- RLS/security: users can read/write own progress through app logic; admin aggregate read only if needed

### `exercise_attempts`

Purpose: Store attempts on exercise items.

- Primary key: `id uuid`
- Important columns: `user_id`, `lesson_id`, `exercise_id`, `exercise_item_id`, `answer`, `answer_display`, `correct`, `attempt_number`, `attempted_at`
- Foreign keys: `user_id -> user_profiles.id`, `lesson_id -> lessons.id`, `exercise_id -> exercises.id`, `exercise_item_id -> exercise_items.id`
- Indexes: `user_id, attempted_at`, `lesson_id`, `exercise_item_id`, `correct`
- Constraints: attempt number positive
- RLS/security: user-owned; exercise answers not globally exposed through this table

### `missed_items`

Purpose: Store missed answers and correction state.

- Primary key: `id uuid`
- Important columns: `user_id`, `lesson_id`, `exercise_id`, `exercise_item_id`, `submitted_answer`, `submitted_answer_display`, `correct_answer_display`, `explanation`, `feedback`, `corrected`, `retry_answer`, `retry_answer_display`, `retry_attempts`, `updated_at`
- Foreign keys: `user_id -> user_profiles.id`, `lesson_id -> lessons.id`, `exercise_id -> exercises.id`, `exercise_item_id -> exercise_items.id`
- Indexes: `user_id, corrected`, `lesson_id`, `exercise_item_id`, `updated_at`
- Constraints: unique active missed item per `(user_id, lesson_id, exercise_id, exercise_item_id)` unless history is required
- RLS/security: user-owned; do not expose other learners' mistakes

### `review_queue_items`

Purpose: Store review queue state across missed items, weak grammar, and future flashcards.

- Primary key: `id uuid`
- Important columns: `user_id`, `source_type`, `source_id`, `lesson_id`, `status`, `due_at`, `last_reviewed_at`, `priority`
- Foreign keys: `user_id -> user_profiles.id`, `lesson_id -> lessons.id`
- Indexes: `user_id, status, due_at`, `source_type, source_id`
- Constraints: status enum; due_at nullable for immediate review
- RLS/security: user-owned

### `flashcards`

Purpose: Store generated or saved cards.

- Primary key: `id uuid`
- Important columns: `user_id`, `content_type`, `front jsonb`, `back jsonb`, `track`, `linked_vocabulary_id`, `linked_grammar_point_id`, `linked_lesson_id`, `linked_exercise_id`, `audio_asset_id`, `status`, `due_at`
- Foreign keys: `user_id -> user_profiles.id`, optional links to vocabulary/grammar/lesson/exercise/audio
- Indexes: `user_id, status, due_at`, `linked_vocabulary_id`, `linked_grammar_point_id`
- Constraints: at least one linked content source for generated cards
- RLS/security: user-owned; card templates may be a separate public table later

### `flashcard_reviews`

Purpose: Store review events for cards.

- Primary key: `id uuid`
- Important columns: `flashcard_id`, `user_id`, `rating`, `reviewed_at`, `previous_due_at`, `next_due_at`, `source_screen`
- Foreign keys: `flashcard_id -> flashcards.id`, `user_id -> user_profiles.id`
- Indexes: `user_id, reviewed_at`, `flashcard_id`
- Constraints: rating should map to FSRS labels: again, hard, good, easy
- RLS/security: user-owned

### `srs_state`

Purpose: Store FSRS or other SRS scheduling state per card.

- Primary key: `flashcard_id`
- Important columns: `flashcard_id`, `user_id`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `reps`, `lapses`, `state`, `last_reviewed_at`, `next_review_at`
- Foreign keys: `flashcard_id -> flashcards.id`, `user_id -> user_profiles.id`
- Indexes: `user_id, next_review_at`, `state`
- Constraints: numeric SRS fields nonnegative where appropriate
- RLS/security: user-owned; do not expose raw SRS internals unless the UI intentionally needs them

## I. Admin/CMS

### `content_versions`

Purpose: Store version snapshots for content records.

- Primary key: `id uuid`
- Important columns: `content_type`, `content_id`, `version_number`, `snapshot jsonb`, `change_summary`, `created_by`, `created_at`
- Foreign keys: `created_by -> user_profiles.id` later
- Indexes: `content_type, content_id, version_number`
- Constraints: unique `(content_type, content_id, version_number)`
- RLS/security: admin/editor only

### `content_review_tasks`

Purpose: Track review workflow for content.

- Primary key: `id uuid`
- Important columns: `content_type`, `content_id`, `assigned_to`, `status`, `review_type`, `due_at`, `notes`, `created_at`, `updated_at`
- Foreign keys: `assigned_to -> user_profiles.id` later
- Indexes: `assigned_to, status`, `content_type, content_id`, `due_at`
- Constraints: review type in methodist, linguist, rights, audio, QA
- RLS/security: admin/editor/reviewer only

### `methodist_reviews`

Purpose: Store review outcomes and notes.

- Primary key: `id uuid`
- Important columns: `content_type`, `content_id`, `reviewer_id`, `status`, `notes`, `validated_against jsonb`, `reviewed_at`
- Foreign keys: `reviewer_id -> user_profiles.id` later
- Indexes: `content_type, content_id`, `reviewer_id`, `status`
- Constraints: notes required for needs_revision
- RLS/security: admin/editor/reviewer only

### `audit_log`

Purpose: Record sensitive admin and content events.

- Primary key: `id uuid`
- Important columns: `actor_id`, `action`, `entity_type`, `entity_id`, `before_snapshot jsonb`, `after_snapshot jsonb`, `created_at`, `metadata jsonb`
- Foreign keys: `actor_id -> user_profiles.id` later
- Indexes: `actor_id, created_at`, `entity_type, entity_id`, `action`
- Constraints: action and entity required
- RLS/security: admin only; never expose to learner UI

## JSONB Guidance

Good JSONB candidates:

- localized text: `{ ky, en, ru }`
- track-specific explanations: `{ RU_KY, EN_KY, KY_KY }`
- answer values for flexible exercise kinds
- accepted alternatives
- mini-game configs
- AI uncertainty/refusal rule arrays
- content version snapshots
- placement result snapshots

Keep normalized:

- curriculum hierarchy
- vocabulary items
- grammar points
- exercise items/options/answers
- audio assets
- source records and rights rules
- learner progress and attempts
- flashcards and SRS state
- review tasks and audit events

## Many-to-many Join Table Proposals

- `source_author_links`
- `lesson_supported_tracks`
- `lesson_methodology_refs`
- `lesson_target_skills`
- `lesson_prerequisites`
- `vocabulary_lesson_links`
- `grammar_lesson_links`
- `pattern_lesson_links`
- `knowledge_source_links`
- `dialogue_vocabulary_links`
- `dialogue_grammar_links`
- `reading_vocabulary_links`
- `reading_grammar_links`
- `breakdown_vocabulary_links`
- `breakdown_grammar_links`
- `exercise_links`
- `ai_roleplay_allowed_vocabulary`
- `ai_roleplay_allowed_grammar`

## RLS And Security Summary

Public or anonymous read candidates:

- published/demo curriculum
- published/demo lesson content
- published/demo exercises
- learner-safe audio asset playback metadata

Authenticated user-owned tables:

- user profiles
- learning tracks
- lesson progress
- exercise attempts
- missed items
- review queue items
- flashcards
- flashcard reviews
- SRS state

Admin/editor/reviewer tables:

- source usage rules
- detailed source notes
- media rights
- media review status
- content versions
- content review tasks
- methodist reviews
- audit log

## Risks And Unknowns

- The proposal is broad; first implementation should select a thin vertical slice.
- Polymorphic links are convenient but need admin/import validation to avoid broken references.
- Exercise answers may need server-side checking for placement/exams later.
- Content versioning strategy needs a decision: full snapshots, diffs, or both.
- Supabase RLS policies need careful testing before real users.
- Exact FSRS fields depend on the selected TypeScript implementation.
- Admin/CMS workflow may require more roles than currently modeled.
