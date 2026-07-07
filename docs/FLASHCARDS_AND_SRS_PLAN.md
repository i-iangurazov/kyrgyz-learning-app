# Flashcards And SRS Plan

Flashcards should become a core learning feature after lessons, practice, and review queue behavior are stable. The goal is not to build a custom spaced repetition algorithm from scratch. The goal is to connect lesson content and learner mistakes to a proven review model.

For future backend storage, use the flashcard, flashcard review, and SRS state tables proposed in `docs/POSTGRES_SCHEMA_PROPOSAL.md`. Do not implement SRS migrations or scheduling until the task explicitly requests backend implementation.

## Product Role

Flashcards should help learners:

- remember lesson vocabulary
- review phrases and sentence patterns
- fix common mistakes
- return to weak grammar points
- practice listening later
- keep learning useful outside a full lesson

The experience should remain simple, mobile-first, and calm. Early MVP review should avoid complex settings or heavy SRS terminology.

## Flashcard Types

Vocabulary card:

- Front: Kyrgyz word or track-language meaning.
- Back: translation, example, and audio when available.

Phrase card:

- Front: useful Kyrgyz phrase or meaning prompt.
- Back: phrase, translation, and example context.

Sentence pattern card:

- Front: prompt to build or recognize a pattern.
- Back: pattern, short explanation, and example.

Grammar card:

- Front: short usage question.
- Back: simple rule and one example.

Common mistake card:

- Front: incorrect sentence or learner's missed answer.
- Back: corrected version and short explanation.

Audio card later:

- Front: listen to audio.
- Back: transcript, meaning, and optional replay.

## Review Sources

Flashcards can be created from:

- lesson vocabulary
- lesson phrase chunks
- grammar points
- sentence patterns
- wrong exercise answers
- corrected missed items
- weak grammar points
- manually saved words
- future listening mistakes

Rules:

- Do not generate learner-facing cards from unapproved content unless clearly marked demo/internal.
- Do not expose source notes, rights notes, or methodist metadata in learner-facing card UI.
- Mistake-derived cards should feel helpful, not punitive.

## SRS Approach

Do not invent a custom spaced repetition algorithm from scratch.

Candidate:

- Evaluate FSRS and a TypeScript implementation such as `ts-fsrs`.

Why FSRS:

- Proven modern spaced repetition approach.
- Tracks memory stability and difficulty.
- Can support daily review queues without custom scheduling guesswork.
- Has ecosystem implementations that can be tested instead of reinvented.

MVP approach:

- Start with local-only review or a backend-ready model.
- Keep the learner UI simple: due now, reviewed, remembered, needs practice.
- Avoid exposing stability/difficulty numbers to learners.
- Later sync schedule and review history to user accounts.

## Card Fields

Recommended fields:

- `id`
- `contentType`: vocabulary, phrase, sentence_pattern, grammar, common_mistake, audio
- `front`
- `back`
- `track`: RU_KY, EN_KY, KY_KY, or shared
- `linkedVocabularyId`
- `linkedGrammarPointId`
- `linkedLessonId`
- `linkedExerciseId`
- `audioAssetId`
- `sourceReviewItemId`
- `dueDate`
- `lastReviewedAt`
- `nextReviewAt`
- `status`: new, learning, review, suspended, retired
- `reviewHistory`
- `methodistReviewStatus`

If FSRS is used, add:

- `stability`
- `difficulty`
- `elapsedDays`
- `scheduledDays`
- `reps`
- `lapses`
- `state`

## Review History Fields

Recommended fields:

- card ID
- user ID
- reviewed at
- rating
- previous due date
- next due date
- answer result
- source screen: lesson, practice tab, flashcards, placement

Rating labels should be learner-friendly:

- Again
- Hard
- Good
- Easy

These labels can map to FSRS ratings internally.

## MVP Flow

Initial lightweight version:

1. Lesson introduces vocabulary and grammar.
2. Practice records attempts.
3. Missed answers enter the review queue.
4. Practice tab shows needs-review and corrected items.
5. Future flashcard tab or Practice section creates simple cards from lesson and missed items.

Next version:

1. Add saved words.
2. Add card review UI.
3. Store local due dates.
4. Add simple daily review count.

Backend version:

1. Add user accounts.
2. Sync flashcards and reviews.
3. Add FSRS scheduling.
4. Track weak vocabulary and grammar over time.

## Content Rules

- Vocabulary cards must use linked vocabulary records.
- Grammar cards must use linked grammar point records.
- Common mistake cards must link to the source mistake or exercise.
- Audio cards must use reviewed audio before production.
- Cards should be updated or retired if source content changes.

## UX Rules

- Keep review sessions short.
- One card, one job.
- Show clear feedback.
- Let learners skip without shame.
- Avoid overwhelming learners with raw scheduling data.
- Keep touch targets comfortable around 390px wide.

## Open Decisions

- Whether flashcards live inside Practice tab first or get a separate flow later.
- Whether manually saved words create cards immediately.
- Which FSRS TypeScript package to adopt.
- How to migrate local review history into backend accounts.
- How cards version when content is edited after methodist review.
