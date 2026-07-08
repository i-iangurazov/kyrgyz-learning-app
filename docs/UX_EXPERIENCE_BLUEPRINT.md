# UX Experience Blueprint

This document defines how the MVP should feel and work for real users. It complements the curriculum, content, source, and review methodology docs.

## Product Experience

The app is a mobile-first web app that should feel like a premium mobile education app. It should not feel like a desktop website compressed into a phone-sized column.

The target experience:

- Adult, clean, focused, and motivating.
- Practical rather than childish.
- Fast enough for daily use.
- Comfortable on a viewport around 390px wide.
- Useful in 8-12 minute lesson sessions.
- Clear enough for beginners without becoming a textbook page.
- Motivating without creating stress or guilt.

## Product Feel

The product should feel:

- Calm: no visual noise, no excessive decoration, no clutter.
- Confident: each screen has a clear purpose.
- Premium: restrained color, polished spacing, readable typography, and consistent controls.
- Practical: every interaction helps the learner continue learning.
- Respectful: learners are adults with real language goals.

The product should not feel:

- Childish.
- Over-gamified.
- Like a generic landing page.
- Like a long PDF or textbook page.
- Like an admin dashboard.
- Like an internal methodology tool.

## Core UX Principles

- One primary action per screen.
- Short cards instead of long textbook pages.
- Progressive disclosure for grammar details.
- Mobile bottom navigation with 5 tabs maximum.
- No clutter.
- No giant text walls.
- Lesson flow should always show where the user is.
- Every completed lesson should feel rewarding.
- Internal methodology, source, and rights metadata should stay hidden from learners unless it directly improves trust or clarity.
- Learners should see helpful learning context, not content-production bureaucracy.

## Daily Use

Daily use should be fast:

- Open the app.
- See the next useful action.
- Continue the active lesson or review queue.
- Finish something small.
- See progress.

The home screen should answer:

- What should I do now?
- How much progress have I made?
- What is the next lesson or review?

Avoid forcing users through navigation just to resume learning.

## Lesson Length

MVP lessons should feel doable in 8-12 minutes.

Recommended lesson pacing:

- Story and goal: under 1 minute.
- Vocabulary: 2-3 minutes.
- Dialogue/text and breakdown: 2-3 minutes.
- Grammar: 1-2 minutes.
- Practice and mini-game: 2-4 minutes.
- Speaking/AI roleplay placeholder or task: 1-2 minutes.
- Review: under 1 minute.

If a lesson grows beyond this, split it into multiple lessons or move detail into optional expansion.

## Grammar Experience

Grammar should be clear but not overwhelming.

Rules:

- Start with the shortest useful explanation.
- Show examples immediately.
- Use "Why?" or "More detail" expansion later for deeper explanation.
- Keep one main grammar point per lesson.
- Avoid long terminology-heavy blocks.
- Use track-specific explanations when supported.

Grammar should make the learner think, "I can use this now," not "I need to study a reference book."

## Games Experience

Games should reinforce learning, not distract.

Rules:

- Mini-games must use the lesson's vocabulary, phrases, grammar, or review queue.
- A game should have one learning job.
- Game sessions should be short.
- Visual feedback should be quick and calm.
- Game results should feed progress or review only when the logic is reliable.

Avoid games that feel unrelated to the lesson or require excessive dexterity.

## AI Roleplay Experience

AI roleplay should feel like safe speaking practice.

Rules:

- Put AI roleplay after enough preparation.
- Always show the scenario and learner goal.
- Keep AI turns short at K0/K1.
- Prefer approved vocabulary and phrases.
- Correct gently.
- Do not expose prompt internals to learners.
- Do not present generated grammar as authoritative.

For MVP, AI roleplay remains a placeholder.

## Progress Experience

Progress should be visible but not stressful.

Use:

- Current lesson state.
- Completed lesson count.
- Streak or daily activity as a light motivator.
- Review readiness later.
- Can-do statements after completion.

Avoid:

- Shame.
- Punitive streak loss.
- Overloading the learner with scores.
- Showing too many metrics before they have meaning.

## Navigation Model

The app uses 5 bottom tabs:

- Home
- Learn
- Practice
- Games
- Profile

No MVP screen should add additional persistent top-level navigation. Secondary flows can use buttons, cards, segmented controls, or local tabs inside the screen when needed.

## Current MVP UI Audit Notes

Based on current component review:

- The app already uses a centered mobile frame on desktop.
- The bottom floating island tab bar matches the intended app-shell direction.
- The lesson player is card-based and includes the intended learning sequence.
- The lesson currently exposes some implementation-facing copy, such as "Seeded from typed lesson data"; future learner-facing UI should replace this with learner-facing wording.
- The lesson progress indicator is currently coarse and mocked; future lesson UI should show step position more clearly.
- No current screenshots were available in `test-results` during this pass.

## Acceptance Standard For UI Work

Future UI work should be accepted only when:

- The primary action is obvious.
- The screen reads well at around 390px wide.
- Text does not overflow or collide.
- Audio controls fit inside vocabulary, dialogue, and reading cards without including full phrases in visible button text.
- Russian-default learner UI does not accidentally show English labels unless the user selected an English track.
- Repeated section labels and technical-looking uppercase labels are removed or justified by UX.
- The bottom nav remains usable and does not cover final actions.
- Loading and empty states are defined.
- Internal methodology/source metadata is not exposed to learners unless intentionally designed.
- The experience still feels like a mobile app.
