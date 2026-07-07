# First Migration Checklist

This checklist is for a future implementation task that explicitly asks for the first actual Postgres/Supabase migration. It should be used with `docs/BACKEND_VERTICAL_SLICE_PLAN.md`.

Do not create migrations in docs-only tasks.

Current Slice 1 migration:

- `supabase/migrations/20260708000100_slice_1_content_schema.sql`

Current offline validation commands:

- `pnpm content:export-db-json`
- `pnpm content:validate-db-roundtrip`

## Before Migration

- [ ] Confirm Supabase/Postgres is still the chosen backend.
- [ ] Confirm the first migration is limited to the approved vertical slice.
- [ ] Confirm local dev setup: Supabase CLI or another local Postgres workflow.
- [ ] Confirm required environment variables and where they live.
- [ ] Confirm schema naming conventions:
  - snake_case table and column names
  - stable text IDs for authored content
  - UUIDs for generated records only where needed
- [ ] Confirm status/kind values:
  - `content_status`
  - `methodist_review_status`
  - `learning_track`
  - `target_skill`
  - `exercise_kind`
  - `answer_kind`
- [ ] Decide whether slice 1 uses constrained text columns or Postgres enums.
- [ ] Confirm which JSONB fields are allowed in slice 1.
- [ ] Confirm indexes for lesson ordering, item ordering, and exercise lookup.
- [ ] Confirm RLS plan.
- [ ] For slice 1 prototype content only, RLS may be disabled or minimal for non-user content, but this must be documented clearly.
- [ ] Confirm no user-owned tables are included unless auth/progress is explicitly in scope.
- [ ] Confirm seed lesson mapping from `src/content/seed/lessons.ts`.
- [ ] Confirm current Zod schemas remain the source of validation.
- [ ] Confirm rollback plan and seed fallback.
- [ ] Confirm no learner-facing UI will expose internal source, rights, review, audit, or methodist metadata.

## Seed Mapping

- [ ] Map `levelId` to `levels`.
- [ ] Map `unitId` to `units`.
- [ ] Map lesson metadata to `lessons`.
- [ ] Map `learningGoals` to `lesson_learning_goals`.
- [ ] Map `supportedTracks` to `lesson_supported_tracks`.
- [ ] Map `targetSkills` to `lesson_target_skills`.
- [ ] Map `prerequisites` to `lesson_prerequisites`.
- [ ] Map source/methodology refs to `sources` and `lesson_methodology_refs`.
- [ ] Map `vocabulary` to `vocabulary_items` and `lesson_vocabulary`.
- [ ] Map `grammarPoints` to `grammar_points` and `lesson_grammar`.
- [ ] Map `dialogues` to `dialogues`.
- [ ] Map `dialogues[].lines` to `dialogue_lines`.
- [ ] Map `breakdownItems` to `breakdown_items` plus breakdown join tables.
- [ ] Map `exercises` to `exercises`.
- [ ] Map `exercises[].items` to `exercise_items`.
- [ ] Map `items[].options` to `exercise_options`.
- [ ] Map `correctAnswerData` to `exercise_answers`.
- [ ] Map `feedback` to `exercise_feedback`.
- [ ] Map exercise vocabulary/grammar links to `exercise_links`.
- [ ] Preserve placeholder audio data without creating media tables.

## During Migration

- [ ] Create source/curriculum/content tables from the approved slice.
- [ ] Confirm the migration includes only the Slice 1 content tables.
- [ ] Add primary keys.
- [ ] Add foreign keys where targets are concrete.
- [ ] Add check constraints for status/kind fields.
- [ ] Add uniqueness constraints for stable IDs and ordering:
  - unique lesson IDs
  - unique unit lesson order
  - unique dialogue line order
  - unique exercise item order
- [ ] Add indexes for:
  - level and unit ordering
  - lesson lookup by ID
  - lesson content lookup by lesson ID
  - exercise lookup by lesson ID and kind
  - vocabulary/grammar join lookup
- [ ] Add seed import script.
- [ ] Make seed import idempotent.
- [ ] Seed K0/K1 content from current TypeScript lessons.
- [ ] Run `pnpm content:export-db-json` to inspect generated DB-shaped rows.
- [ ] Run `pnpm content:validate-db-roundtrip` to prove mapper reversibility.
- [ ] Validate all inserted rows have required source, rights, and review fields.
- [ ] Export DB rows back into a `lesson-v2` object.
- [ ] Validate exported lessons with Zod.
- [ ] Compare DB lesson output to current TypeScript seed output.

## After Migration

- [ ] Keep TypeScript seed fallback.
- [ ] Keep runtime content source set to seed by default.
- [ ] Confirm learner-facing routes still import lessons from the TypeScript seed path unless a separate feature-flagged DB read task is in scope.
- [ ] Add or prepare a feature flag for DB lessons later.
- [ ] Add tests for import, export, and schema validation.
- [ ] Test lesson rendering from DB only if that task explicitly includes the DB read path.
- [ ] Add E2E for DB-backed lesson only after the read path exists.
- [ ] Run typecheck.
- [ ] Run lint.
- [ ] Run tests.
- [ ] Run production build.
- [ ] Confirm no internal metadata leaks to learner UI.
- [ ] Document any schema deviations from `docs/BACKEND_VERTICAL_SLICE_PLAN.md`.

## Rollback Plan

- [ ] Keep current TypeScript seed lessons unchanged.
- [ ] Keep feature flag defaulting to seed content.
- [ ] If import fails, drop or reset local/dev slice tables only.
- [ ] If DB export fails validation, block DB read rollout.
- [ ] If learner UI shows internal metadata, disable DB read flag and fix the mapper.
- [ ] Keep migration reversible in local/dev until content import/export is proven.

## Content QA Plan

- [ ] Confirm lesson count matches current seed data.
- [ ] Confirm lesson ordering matches current app.
- [ ] Confirm vocabulary counts match.
- [ ] Confirm dialogue line ordering and translations match.
- [ ] Confirm grammar point IDs and examples match.
- [ ] Confirm exercise kind, prompt, options, answer data, explanation, and feedback match.
- [ ] Confirm supported exercise types import correctly:
  - `multiple_choice`
  - `fill_blank`
  - `sentence_builder`
  - `match_pairs`
  - `error_correction`
- [ ] Confirm audio placeholders round-trip as unavailable/placeholder audio.
- [ ] Confirm all demo content remains marked as demo and not reviewed.
- [ ] Confirm source and rights notes exist internally.

## Done Criteria

The first migration is ready for review only when:

- The schema contains only slice 1 tables.
- Migrations apply locally.
- Seed import is repeatable.
- DB-exported lessons validate against current schemas.
- Seed and DB lesson outputs match for learner-facing fields.
- The TypeScript seed fallback remains intact.
- Required checks pass.
