# Backend Vertical Slice Plan

This document defines the smallest safe backend slice for the first actual Postgres/Supabase migration. It narrows the broader `docs/POSTGRES_SCHEMA_PROPOSAL.md` into a practical implementation boundary.

This is planning documentation only. Do not create migrations from this document unless a future task explicitly asks for backend implementation.

## Goal

Slice 1 should prove that the app can store and later load the current K0/K1 `lesson-v2` seed lessons from Postgres without replacing the current TypeScript seed path.

The first slice must support:

- Current K0/K1 seed lessons.
- Future DB-backed lesson reads behind a feature flag.
- The current `lesson-v2` shape from `src/content/schemas.ts`.
- Source and methodology references needed for internal traceability.
- Vocabulary, grammar points, dialogues, dialogue lines, breakdown items, and supported exercises.
- Basic `content_status` and `methodist_review_status`.
- Current supported exercise types: `multiple_choice`, `fill_blank`, `sentence_builder`, `match_pairs`, and `error_correction`.

It should not try to implement the whole future platform.

## Slice 1 Output

The first backend implementation should produce:

- A minimal relational schema for lesson content.
- An idempotent seed import from `src/content/seed/lessons.ts`.
- Validation that DB content can be exported back into the current `lesson-v2` payload shape.
- A preserved TypeScript seed fallback.
- No learner-facing runtime behavior change until a separate feature-flagged DB read task.

## Included Tables

### Source And Methodology

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `sources` | Preserves methodology/source traceability without copying protected material. | `methodologyRefs`, `sourceNotes`, `rightsNotes`, `validatedAgainst`. | `id`, `title`, `category`, `language`, `rights_status`, `usage_permission`, `reference_url`, `notes`, `created_at`, `updated_at`. | Full author model, usage-rule history, reviewer assignment. |
| `lesson_methodology_refs` | Links lessons to methodology/source records. | Lesson-level methodology refs and HSK-inspired component notes. | `lesson_id`, `source_id`, `relationship_type`, `hsk_component`. | Rich source-note threading and per-field source attribution. |

Notes:

- Start with a small set of internal source rows for existing docs and source methodology references.
- Do not expose source, rights, or review metadata to learner-facing lesson queries.

### Curriculum

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `levels` | Stores K0/K1 hierarchy and ordering. | `levelId`, current level map. | `id`, `title`, `description`, `display_order`, `kyrgyztest_level`, `cefr_placeholder`. | K2-K5 detailed scope and assessment rules. |
| `units` | Groups lessons inside levels. | `unitId`, unit order. | `id`, `level_id`, `title`, `description`, `display_order`, `content_status`, `methodist_review_status`. | Unit assessments and unlock rules. |
| `lessons` | Central lesson record and lifecycle. | `id`, `stableLessonId`, `lessonNumber`, title, story, duration, status fields. | `id`, `schema_version`, `level_id`, `unit_id`, `lesson_number`, `display_order`, `title`, `subtitle`, `story`, `estimated_duration_minutes`, `sample_notice`, `validation_todos`, `content_status`, `methodist_review_status`, `is_demo_content`, `is_original_content`, `requires_license`, `source_notes`, `rights_notes`, `internal_notes`, `methodist_notes`. | Full versioning, publish windows, admin assignment, exam metadata. |
| `lesson_learning_goals` | Stores the dedicated goal card content separately from lesson metadata. | `learningGoals`. | `id`, `lesson_id`, `goal_text`, `display_order`. | Goal mastery tracking and placement links. |
| `lesson_supported_tracks` | Keeps RU_KY, EN_KY, KY_KY support explicit. | `supportedTracks`. | `lesson_id`, `track`. | Per-track lesson variants. |
| `lesson_target_skills` | Preserves target skill structure. | `targetSkills`. | `lesson_id`, `target_skill`. | Skill weighting and analytics. |
| `lesson_prerequisites` | Preserves current prerequisite arrays. | `prerequisites`. | `lesson_id`, `prerequisite_lesson_id`, `display_order`. | Vocabulary/grammar prerequisite graph. |

Notes:

- `story` can be JSONB in slice 1 because it is lesson-local and does not need independent reuse yet.
- `learning_goals` in the broader proposal can be named `lesson_learning_goals` in the first migration to make ownership explicit.

### Vocabulary

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `vocabulary_items` | Stores reusable lesson vocabulary and phrases. | `vocabulary[].id`, `kyrgyz`, translations, tags, example, audio placeholder, review metadata. | `id`, `kyrgyz`, `transliteration`, `translations`, `example`, `audio_placeholder`, `tags`, `source_notes`, `rights_notes`, `methodist_review_status`, `created_at`, `updated_at`. | Separate translation table, separate example table, frequency data, dialect notes. |
| `lesson_vocabulary` | Links vocabulary to lessons without duplicating records. | `linkedLessonIds`. | `lesson_id`, `vocabulary_item_id`, `display_order`, `introduced_here`. | Reuse strength, review priority, spaced repetition metadata. |

Notes:

- Use JSONB for `translations`, `example`, `tags`, and `audio_placeholder` in slice 1.
- Do not create media/audio storage tables in slice 1. Preserve non-playable placeholder data only so DB export can reconstruct the current schema.

### Grammar

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `grammar_points` | Stores one main grammar point per lesson and related explanation data. | `grammarPoints[]`, track explanations, examples, common mistakes, micro-practice prompts. | `id`, `level_id`, `title`, `simple_rule`, `explanations_by_track`, `examples`, `common_mistakes`, `micro_practice_prompts`, `source_notes`, `validation_notes`, `validated_against`, `methodist_review_status`. | Separate grammar examples, suffix rules, sentence patterns, common mistake bank. |
| `lesson_grammar` | Links grammar points to lessons. | Lesson grammar arrays and exercise links. | `lesson_id`, `grammar_point_id`, `display_order`, `introduced_here`. | Grammar dependency graph and reusable pattern sequencing. |

Notes:

- Keep grammar examples and common mistakes as JSONB in slice 1 to reduce table count.
- Normalize grammar examples later when flashcards, SRS, or cross-lesson reuse needs independent records.

### Dialogue And Breakdown

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `dialogues` | Stores the lesson dialogue block. | `dialogues[]`, title, context, reading source type, review fields. | `id`, `lesson_id`, `title`, `context`, `reading_source_type`, `rights_notes`, `source_notes`, `naturalness_review_status`, `methodist_review_status`, `is_original_content`, `requires_license`, `audio_placeholder`, `display_order`. | Reading library integration and full media links. |
| `dialogue_lines` | Stores ordered Kyrgyz dialogue lines and translations. | `dialogues[].lines[]`. | `id`, `dialogue_id`, `speaker`, `kyrgyz`, `transliteration`, `translations`, `audio_placeholder`, `display_order`. | Speaker profiles and audio asset foreign keys. |
| `breakdown_items` | Stores phrase breakdowns shown after dialogue/text. | `breakdownItems[]`. | `id`, `lesson_id`, `source_content_type`, `source_content_id`, `phrase`, `meaning_by_track`, `notes_by_track`, `source_notes`, `methodist_review_status`, `display_order`. | Dedicated links to each dialogue line segment. |
| `breakdown_vocabulary` | Links breakdown items to vocabulary. | `linkedVocabularyIds`. | `breakdown_item_id`, `vocabulary_item_id`. | Relationship weighting and review generation rules. |
| `breakdown_grammar` | Links breakdown items to grammar points. | `linkedGrammarPointIds`. | `breakdown_item_id`, `grammar_point_id`. | Pattern-level breakdown linking. |

Notes:

- Current seed lessons use dialogues, not a full reading library. Reading tables can wait unless a seed lesson requires `texts[]` during implementation.
- If a migration must support `texts[]` immediately, add `reading_texts` and `reading_paragraphs` as optional slice tables with the same minimal approach.

### Exercises

| Table | Why Needed Now | Current Seed Support | Minimum Columns | Can Wait |
| --- | --- | --- | --- | --- |
| `exercises` | Stores a practice block tied to a lesson and kind. | `exercises[]`, prompt, helper text, links, HSK component, review status. | `id`, `lesson_id`, `kind`, `prompt`, `helper_text_by_track`, `hsk_inspired_components`, `source_notes`, `methodist_review_status`, `display_order`. | Exercise reuse outside lessons, placement/test mode. |
| `exercise_items` | Stores individual questions inside an exercise. | `exercises[].items[]`. | `id`, `exercise_id`, `question`, `explanation`, `audio_placeholder`, `display_order`. | Item pools and randomized variants. |
| `exercise_options` | Stores choices, sentence tiles, and match-pair cards. | Multiple choice options, sentence builder tiles, match pair sides. | `id`, `exercise_item_id`, `option_text`, `option_group`, `display_order`, `metadata`. | Rich distractor analytics and generated options. |
| `exercise_answers` | Stores correct answer data and accepted alternatives. | `correctAnswerData`. | `id`, `exercise_item_id`, `answer_kind`, `value`, `accepted_alternatives`, `display_value`, `is_primary`. | Server-side hidden answer workflows for exams. |
| `exercise_feedback` | Stores correct/incorrect/hint feedback. | `feedback`, `explanation`. | `id`, `exercise_item_id`, `correct_feedback`, `incorrect_feedback`, `hint`. | Feedback variants by learner track or attempt number. |
| `exercise_links` | Links exercises/items to vocabulary and grammar. | `linkedVocabularyIds`, `linkedGrammarPointIds`. | `id`, `exercise_id`, `exercise_item_id`, `linked_type`, `linked_id`. | Polymorphic links to source paragraphs, mistakes, and patterns. |

Notes:

- JSONB is appropriate for `value` because answer shapes differ by exercise type.
- `exercise_links` is the only generic link table in slice 1. Keep import validation strict so it cannot point to missing records.
- Learner clients currently need answer data for local checking. Later exam/placement flows should gate answer checking server-side.

## Explicitly Excluded From Slice 1

| Domain | Why It Can Wait | Trigger To Add Later |
| --- | --- | --- |
| User auth | Current app has no account flow and local progress works for MVP. | Need cross-device progress, accounts, or protected user data. |
| Backend learner progress | Practice state already exists locally. | DB lesson reads are stable and auth is planned. |
| Flashcards/SRS | Requires review product decisions and likely FSRS integration. | Flashcard MVP task or account-backed review scheduling. |
| Audio storage/media tables | Current audio records are placeholders; no real storage pipeline exists. | Human-recorded audio upload, CDN/storage, or listening exercises with real media. |
| AI roleplay tables | Current AI roleplay is placeholder-only. | Real constrained roleplay implementation begins. |
| Speaking tables | No recording or speech evaluation exists. | Speaking practice starts storing prompts, attempts, or recordings. |
| Mini-game tables | Mini-games are placeholder configs. | First real mini-game implementation needs persisted config beyond lesson JSON. |
| Content versioning | Adds admin complexity before DB read path is proven. | Editors start changing content in DB or publish/rollback is required. |
| Audit log | No admin actions exist yet. | Admin/CMS writes, reviewer actions, or compliance needs. |
| Full admin/CMS workflow | Lesson import/read should be proven first. | Non-developer content editing begins. |
| Complex RLS | No user data or private content in slice 1. | Public/private content split or user-owned tables are added. |
| Literature library | K0/K1 seed lessons do not need it. | Graded reading library, public-domain texts, or licensed excerpts are implemented. |
| Source authors and detailed rights workflow | Basic source records are enough to preserve traceability. | Real rights review workflow or external source catalog is needed. |

## Minimal Read Model

The first DB read path should eventually return a learner-safe lesson payload that matches `lesson-v2`.

Recommended approach:

1. Query normalized slice tables.
2. Reconstruct the nested lesson object in a server-side loader or import/export utility.
3. Validate with the existing Zod `lessonSchema`.
4. Strip internal source, rights, review, and notes before learner-facing rendering.
5. Keep the TypeScript seed fallback if validation fails.

Do not expose raw relational rows directly to React lesson components.

## Feature Flag Boundary

The first implementation should keep runtime content source controlled by a flag such as:

```txt
NEXT_PUBLIC_CONTENT_SOURCE=seed
NEXT_PUBLIC_CONTENT_SOURCE=db
```

Default should remain `seed` until DB import, export, validation, and lesson rendering are proven.

## Slice 1 Acceptance Criteria

Slice 1 is complete only when:

- Migrations apply cleanly in local/dev.
- Current K0/K1 seed lessons import idempotently.
- Required IDs, order, translations, examples, dialogue lines, grammar points, and exercise answer data are preserved.
- DB-exported lesson payloads validate against `lessonSchema`.
- DB-exported lesson payloads can be compared against the TypeScript seed fixture.
- Internal source, rights, methodist, and review metadata do not appear in learner-facing UI.
- TypeScript seed content remains available as fallback.
- Typecheck, lint, tests, and build pass.

## Implementation Order

1. Add migrations for the slice 1 tables only.
2. Add import utilities from `lessonSeedData`.
3. Add DB export utility that rebuilds `lesson-v2` payloads.
4. Add schema validation and fixture comparison tests.
5. Add a feature-flagged read path in a later task.
6. Keep local progress unchanged until content reads are stable.

