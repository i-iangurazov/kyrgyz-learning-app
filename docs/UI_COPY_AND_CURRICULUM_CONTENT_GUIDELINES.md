# UI Copy And Curriculum Content Guidelines

This document defines the boundary between reusable app UI copy and curriculum content. The app is RU-first for the MVP, but future EN and KY tracks must remain possible.

## What Belongs In `src/lib/copy.ts`

Use `src/lib/copy.ts` for common app chrome and reusable learner-facing UI text:

- App navigation and tab labels.
- Buttons and common actions.
- Empty states.
- Error states.
- Lesson section labels.
- Practice and review UI labels.
- Generic feedback copy that is not tied to a specific Kyrgyz phrase.
- Audio control labels and accessible labels.
- Common status labels such as completed, corrected, retry, continue, and coming soon.

Examples:

- `Слушать` belongs in `src/lib/copy.ts`.
- `Практика` belongs in `src/lib/copy.ts`.
- Review queue empty state copy belongs in `src/lib/copy.ts`.
- Generic button text like `Проверить`, `Продолжить`, and `Повторить` belongs in `src/lib/copy.ts`.

## What Belongs In Lesson Or Content Data

Use lesson/content data for actual learning material:

- Kyrgyz words.
- Translations of learning content.
- Dialogue lines.
- Reading texts.
- Grammar explanations.
- Exercise prompts.
- Correct answers and accepted alternatives.
- Hints and explanations tied to a specific lesson item.
- Track-specific curriculum content for `RU_KY`, `EN_KY`, and `KY_KY`.
- Source notes, rights notes, and review status fields, stored internally only.

Examples:

- `Мен базарга барам` belongs in lesson content.
- A grammar explanation for a suffix or sentence pattern belongs in lesson content.
- A dialogue line such as `Атым Элина. Сенчи?` belongs in lesson content.
- A fill-blank prompt for a specific phrase belongs in lesson content.

## What Must Not Be Mixed

- Do not put curriculum content into the UI copy dictionary.
- Do not put generic app chrome copy inside lesson data.
- Do not put internal source, rights, review, schema, or methodist metadata into learner-facing copy.
- Do not hardcode learner-facing component text directly in React when it belongs to common UI copy.
- Do not move Kyrgyz lesson examples into `src/lib/copy.ts` just because they appear in multiple components; create shared content records or references instead.

## Practical Decision Rule

Ask what would happen if the learner changed language track:

- If the text is still app UI, such as a button or tab, it belongs in `src/lib/copy.ts`.
- If the text teaches Kyrgyz, tests a Kyrgyz answer, explains grammar, or translates lesson material, it belongs in content data.
- If the text is internal QA/source/review information, it belongs in data metadata or docs, not in learner-facing copy.

## Review Requirements

- Future UI work should use `src/lib/copy.ts` for common app copy.
- Future curriculum work should keep lesson text in typed content data.
- Any lesson text added to content data must keep methodist validation status and source/rights notes.
- Existing seed lesson text remains prototype content until cleared in `docs/METHODIST_REVIEW_BACKLOG.md`.
