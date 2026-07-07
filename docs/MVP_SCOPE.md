# MVP Scope

This document defines the current MVP boundary for the Kyrgyz learning app.

## Product Direction

The MVP is a mobile-first web application for learning Kyrgyz with an HSK-style curriculum structure.

The app should feel like a real mobile app, not a desktop website compressed into a narrow column.

The MVP product experience is defined in:

- `docs/UX_EXPERIENCE_BLUEPRINT.md`
- `docs/USER_JOURNEYS.md`
- `docs/ONBOARDING_AND_PLACEMENT_PLAN.md`
- `docs/MOBILE_APP_SHELL_GUIDELINES.md`
- `docs/LESSON_UX_PRINCIPLES.md`

## In Scope Now

- Mobile-first Next.js web app.
- K0 and K1 curriculum foundation only.
- 2-3 demo lessons.
- Typed content models.
- Zod validation for content.
- Local mock progress state.
- Lesson player foundation.
- Level map foundation.
- Placeholder tabs for Practice, Games, and Profile.
- Mini-game placeholders.
- Speaking placeholders.
- AI roleplay placeholders.
- UX/product blueprint documentation.
- User journey documentation.
- Onboarding and placement plan documentation.
- Mobile app shell guidelines.
- Lesson UX principles.
- Tests for content schema and lesson rendering.
- Playwright mobile viewport check.

## K0 MVP Scope

K0 focuses on:

- Alphabet basics.
- Special Kyrgyz letters: ө, ү, ң.
- Basic greetings.
- Simple reading practice.

K0 content is demo-only until reviewed.

## K1 MVP Scope

K1 focuses on everyday survival language:

- Greetings.
- Introductions.
- Family.
- Numbers.
- Food.
- Cafe.
- Shop.
- Bazaar.
- Taxi.
- Address.

Current implementation includes only sample/demo K1 content. The later target is roughly 20 K1 lessons after the methodology and review process are stable.

## Explicitly Out Of Scope Now

- Full mobile app release.
- Expo or native app implementation.
- User accounts.
- Database-backed progress.
- Admin/content management system.
- Real AI roleplay.
- Real speech recognition.
- Production audio pipeline.
- Full onboarding and placement implementation.
- Full step-by-step focused lesson mode.
- Full K2-K5 curriculum.
- Final authoritative grammar content.

## Later Scope

After the MVP shell and methodology are stable:

- Expand K1 to roughly 20 lessons.
- Add richer exercise renderers.
- Add real mini-games using lesson data.
- Add database-backed content.
- Add admin or content editing workflow.
- Add account-backed progress.
- Add spaced review.
- Add native speaker audio.
- Add constrained AI roleplay.
- Add pronunciation and speaking practice after validation.
- Implement onboarding and placement flow.
- Improve lesson step progress and focused lesson UX.

## Future Mobile Path

The first product is web, but implementation should preserve a future path to a real mobile app.

Guidelines:

- Keep content separate from React UI.
- Keep learning logic testable outside the page layer.
- Prefer reusable components and portable state patterns.
- Avoid browser-only assumptions in curriculum and content code.
- Keep interaction patterns mobile-first.
- Follow the UX blueprint and mobile shell guidelines before adding new UI surfaces.

Possible future path:

1. Validate content model and learning loop on web.
2. Stabilize K0/K1 curriculum.
3. Build account and progress infrastructure.
4. Add richer mobile interactions.
5. Port selected UI and learning logic to Expo or another mobile stack.

## Current Acceptance Standard

The MVP foundation is acceptable when:

- The app runs as a Next.js project.
- Main screens render in a mobile app shell.
- Lesson content comes from typed data.
- Demo content is clearly marked.
- Tests pass.
- Production build passes.
- Mobile visual checks are performed for UI changes.
- UX changes follow the documented product experience principles.
