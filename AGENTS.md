# AGENTS.md

Rules for future Codex tasks in this repository:

- Always work mobile-first. The default product target is a mobile viewport around 390px wide.
- UI work must remain mobile-first and must be visually checked at a 390px viewport.
- Do not hardcode final lesson content inside React components.
- Lesson content must come from typed data models, JSON seed data, or database-ready schemas.
- Future lesson or content-related work must follow the methodology docs in `/docs`.
- Future curriculum work must explicitly follow `docs/SOURCE_METHODOLOGY.md`.
- Future UI tasks must follow `docs/UX_EXPERIENCE_BLUEPRINT.md`.
- Future lesson UI must follow `docs/LESSON_UX_PRINCIPLES.md`.
- Future onboarding work must follow `docs/ONBOARDING_AND_PLACEMENT_PLAN.md`.
- Future app shell changes must follow `docs/MOBILE_APP_SHELL_GUIDELINES.md`.
- Future database/backend work must follow `docs/DATABASE_ARCHITECTURE.md`.
- Future backend/database work must read `docs/POSTGRES_SCHEMA_PROPOSAL.md` before proposing tables, migrations, or backend code.
- Before any actual backend migration, Codex must read `docs/BACKEND_VERTICAL_SLICE_PLAN.md`.
- First backend work must implement only the approved vertical slice unless explicitly instructed otherwise.
- Future content knowledge-base work must follow `docs/CONTENT_KNOWLEDGE_BASE.md`.
- Future flashcard or review-system work must follow `docs/FLASHCARDS_AND_SRS_PLAN.md`.
- Future technology choices must check `docs/REUSABLE_TECH_STACK.md` before adding dependencies or custom infrastructure.
- Future UX or app-flow work must check `docs/APP_FLOW_BENCHMARKS.md`.
- Future lesson sequencing must follow `docs/CURRICULUM_SEQUENCING_RULES.md`.
- Feature work must update `/docs` when it changes the learning model, lesson structure, content rules, grammar rules, AI roleplay behavior, review process, or MVP scope.
- Reuse proven libraries instead of reinventing UI, forms, validation, state, and testing.
- Every feature must be testable.
- Every UI change must be visually checked at a mobile viewport.
- Codex must visually check mobile viewport around 390px for UI changes.
- Codex must avoid clutter and avoid exposing internal methodology/source metadata to learners unless it helps UX.
- Before finishing any task, run typecheck, lint, tests, Playwright where relevant, and a production build.
- If a check fails, report it honestly and include the failure context.
- Do not add database migrations, Supabase clients, auth, backend storage, or schema-changing infrastructure unless the task explicitly asks to implement database/backend behavior.
- Migrations must not be created in docs-only tasks.
- Current TypeScript seed content must remain available as fallback until the DB read path is verified.
- Any schema change must update relevant docs and tests.
- Learner-facing UI must not expose internal source, rights, review, audit, or methodist metadata.

Content rules:

- Demo lesson content is sample material only and requires methodist/linguist validation.
- Do not copy textbook content.
- HSK may be used as structural inspiration only; do not copy HSK content.
- Kyrgyz textbooks and literature may be used for methodology, sequencing, validation, and theme selection only unless licensed.
- Use simple original examples.
- Keep content structured for future RU -> KY, EN -> KY, and KY -> KY tracks.
- Do not present sample Kyrgyz grammar as final authoritative content.
- Do not add new grammar or vocabulary as final authoritative content without marking it for methodist/linguist validation.
- Any new Kyrgyz grammar, dialogue, or reading content must include source notes and methodist validation status.
- Any reading or literary content must include copyright/rights notes.
- Add TODO notes where methodist/linguist validation is required.

Final responses must include:

1. Summary of changes
2. Files changed
3. Commands run
4. Test results
5. Visual verification performed
6. Known limitations / risks
7. Suggested next task
