# AGENTS.md

Rules for future Codex tasks in this repository:

- Always work mobile-first. The default product target is a mobile viewport around 390px wide.
- UI work must remain mobile-first and must be visually checked at a 390px viewport.
- Do not hardcode final lesson content inside React components.
- Lesson content must come from typed data models, JSON seed data, or database-ready schemas.
- Future lesson or content-related work must follow the methodology docs in `/docs`.
- Feature work must update `/docs` when it changes the learning model, lesson structure, content rules, grammar rules, AI roleplay behavior, review process, or MVP scope.
- Reuse proven libraries instead of reinventing UI, forms, validation, state, and testing.
- Every feature must be testable.
- Every UI change must be visually checked at a mobile viewport.
- Before finishing any task, run typecheck, lint, tests, Playwright where relevant, and a production build.
- If a check fails, report it honestly and include the failure context.

Content rules:

- Demo lesson content is sample material only and requires methodist/linguist validation.
- Do not copy textbook content.
- Use simple original examples.
- Keep content structured for future RU -> KY, EN -> KY, and KY -> KY tracks.
- Do not present sample Kyrgyz grammar as final authoritative content.
- Do not add new grammar or vocabulary as final authoritative content without marking it for methodist/linguist validation.
- Add TODO notes where methodist/linguist validation is required.

Final responses must include:

1. Summary of changes
2. Files changed
3. Commands run
4. Test results
5. Visual verification performed
6. Known limitations / risks
7. Suggested next task
