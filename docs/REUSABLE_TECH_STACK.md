# Reusable Tech Stack

This document defines the default technology choices and what we should reuse instead of building manually. The product should stay pragmatic: use proven libraries for UI, validation, forms, data fetching, storage, testing, and spaced repetition.

## Principles

- Prefer established libraries over custom infrastructure.
- Keep dependencies lightweight and purposeful.
- Add a library only when it solves a real product or engineering problem.
- Keep mobile-first UX and testability as acceptance criteria.
- Avoid heavy abstractions before the product needs them.

## Next.js

Why:

- Provides the web app foundation.
- Supports file-based routing, static generation, server components, and deployment paths.
- Keeps the MVP portable to backend-backed content later.

Solves:

- App routing.
- Production build pipeline.
- Static pages for current seed content.
- Future server-side data loading.

Do not build manually:

- Custom router.
- Custom SSR/build pipeline.

## TypeScript

Why:

- Keeps content and UI contracts explicit.
- Reduces schema drift across lessons, exercises, progress, and future backend models.

Solves:

- Typed lesson models.
- Typed exercise behavior.
- Safer refactors as content complexity grows.

Do not build manually:

- Runtime-only content assumptions without compile-time types.

## Tailwind CSS

Why:

- Fast mobile-first styling with consistent spacing and responsive constraints.
- Fits the current premium app-shell direction.

Solves:

- Layout.
- Spacing.
- Responsive mobile-first styling.
- Component-level visual polish.

Do not build manually:

- A custom CSS framework.
- One-off CSS systems for every screen.

## shadcn/ui And Radix Primitives

Why:

- Provides accessible, composable UI foundations.
- Keeps components reusable without locking into a heavy design system.

Solves:

- Buttons.
- Cards.
- Tabs/segmented controls.
- Dialogs, menus, and form primitives later.

Do not build manually:

- Low-level accessible primitives when Radix already solves them.

## Zod

Why:

- Current content engine already uses Zod.
- Validates seed data and future database-ready payloads.

Solves:

- Runtime content validation.
- Schema contracts for lessons, exercises, audio, and future imports.

Do not build manually:

- Ad hoc schema checking.
- Unstructured JSON validation.

## React Hook Form

Use when:

- Onboarding forms.
- Placement test inputs.
- Admin/CMS editing forms.
- Profile or settings forms.

Why:

- Reliable form state and validation integration.
- Works well with Zod.

Do not build manually:

- Complex form state, touched/dirty tracking, and validation plumbing.

## TanStack Query

Use when backend data fetching begins.

Why:

- Handles caching, background refresh, mutations, optimistic updates, and loading states.

Solves:

- Database-backed lessons.
- Progress sync.
- Flashcard review mutations.
- Admin content fetching.

Do not build manually:

- Custom fetch cache.
- Custom mutation state management.

## Supabase Or Postgres-backed Backend Candidate

Why:

- Postgres fits the relational content graph: sources, lessons, vocabulary, grammar, exercises, media, progress, and reviews.
- Supabase can provide Postgres, auth, row-level security, and storage in one stack.

Solves:

- Content database.
- User progress.
- Review queue sync.
- Admin workflows.

Do not build manually:

- Custom database server.
- Custom auth before requirements are clear.
- Custom file storage service.

## Supabase Storage Or S3-compatible Storage

Why:

- Audio assets need durable storage, stable URLs or storage keys, rights notes, and review status.

Solves:

- Vocabulary audio.
- Dialogue audio.
- Listening exercise audio.
- Future recording uploads.

Do not build manually:

- Custom object storage.
- Custom CDN logic before scale requires it.

## Playwright

Why:

- Current E2E and mobile visual checks already use Playwright.
- It verifies real browser behavior at the target mobile viewport.

Solves:

- Lesson flow E2E.
- Practice interactions.
- Mobile viewport checks.
- Screenshot-based visual QA.

Do not build manually:

- Custom browser automation.
- Manual-only regression checks for core flows.

## Vitest And Testing Library

Why:

- Fast unit and component tests.
- Fits React and TypeScript workflow.

Solves:

- Schema validation tests.
- Exercise renderer tests.
- Progress utility tests.
- Component rendering tests.

Do not build manually:

- Custom test runner.
- DOM test harness.

## ts-fsrs Or Another FSRS Implementation

Use when flashcards/SRS are implemented.

Why:

- Spaced repetition should use a proven algorithm.
- FSRS can model stability and difficulty without inventing scheduling rules.

Solves:

- Flashcard due dates.
- Review scheduling.
- Rating-driven memory updates.

Do not build manually:

- A custom SRS algorithm unless there is a strong product reason and test coverage.

## Native HTML Audio First

Why:

- Vocabulary and dialogue playback can start with native browser audio.
- Avoids heavy dependencies before recording, waveform, or advanced playback features are needed.

Solves:

- Play/pause for words and phrases.
- Listening exercise playback.
- Basic accessibility.

Do not build manually:

- Custom audio engine.
- Waveform player.
- Speech analysis pipeline.

## Dependency Discipline

Before adding a dependency, confirm:

- It solves a real current problem.
- It is maintained.
- It works with Next.js and TypeScript.
- It does not undermine mobile performance.
- It can be tested.
- It does not duplicate an existing stack capability.

Avoid:

- Heavy UI frameworks on top of the current system.
- Drag-and-drop libraries for simple tap interactions.
- Custom CMS/backend infrastructure before validating Supabase/Postgres.
- Audio processing libraries before actual audio requirements exist.
