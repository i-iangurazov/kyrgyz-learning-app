# Content Knowledge Base

This document defines the long-term Kyrgyz language knowledge base for the app. The knowledge base is not a copied textbook. It is a structured, validated, reusable layer that connects sources, curriculum, language facts, examples, exercises, flashcards, audio, and review.

## Purpose

The knowledge base should let the product answer:

- Which words and phrases belong at each level?
- Which grammar point is taught where?
- Which examples are approved?
- Which mistakes should be reviewed?
- Which exercises and flashcards can be generated from a lesson?
- Which sources validated a vocabulary item, grammar point, or sentence pattern?

## Source Synergy

The knowledge base should be built from a controlled combination of:

- Kyrgyz grammar references.
- Kyrgyztest level alignment.
- Kyrgyz-as-foreign-language books used for methodology and sequencing only unless licensed.
- School curriculum themes and reading progression.
- Literature themes.
- Folklore and proverbs when rights status is safe.
- Original examples written for the app.
- Vocabulary and grammar sequencing decisions approved by methodists.

Copyright rule:

- Copyrighted materials are not copied unless licensed or explicitly approved.
- External sources guide structure, sequencing, validation, and theme planning.
- Learner-facing Kyrgyz content must be original, licensed, public-domain, or rights-approved.

## Core Knowledge Types

Vocabulary items:

- Single words, fixed phrases, classroom/app phrases, survival phrases, and high-frequency chunks.

Grammar points:

- One teachable pattern, explanation, or usage rule that can appear in a lesson.

Sentence patterns:

- Reusable construction templates, such as introductions, questions, direction phrases, or ordering phrases.

Suffix rules:

- Structured representations of suffix behavior, examples, common learner mistakes, and level-safe explanations.

Common mistakes:

- Predictable learner errors, especially Russian-influenced structure, missing suffixes, wrong suffix choice, word order, or phrase-form confusion.

Examples:

- Original sentences or short phrases written for the app and validated before production.

## Required Links For Vocabulary

Every vocabulary item should connect to:

- level
- unit
- first lesson introduced
- later lessons where reused
- translations: ru, en
- KY-only explanation when useful
- examples
- common mistakes, if relevant
- exercises
- flashcards
- audio assets
- tags
- source/methodology notes
- rights notes
- methodist validation status

Recommended vocabulary record fields:

```ts
{
  id: "vocab-bazaar",
  kyrgyz: "Базар",
  translations: { en: "bazaar", ru: "базар" },
  levelId: "K1",
  introducedInLessonId: "k1-market-01",
  reusedInLessonIds: [],
  exampleIds: [],
  exerciseIds: [],
  flashcardIds: [],
  audioAssetIds: [],
  tags: ["bazaar", "survival", "place"],
  sourceNotes: "Original app vocabulary selection; aligned to K1 survival themes.",
  rightsNotes: "Original app-authored entry.",
  methodistReviewStatus: "not_reviewed"
}
```

## Required Links For Grammar Points

Every grammar point should connect to:

- level
- unit
- lesson
- sentence patterns
- examples
- common mistakes
- micro-practice prompts
- exercises
- flashcards
- audio where useful
- source/methodology notes
- validated grammar references
- track-specific explanations
- methodist validation status

Recommended grammar record fields:

```ts
{
  id: "grammar-direction-ga-placeholder",
  title: { en: "Direction suffix", ru: "Суффикс направления", ky: "Багыт мүчөсү" },
  levelId: "K1",
  lessonIds: [],
  patternIds: [],
  examples: [],
  commonMistakes: [],
  explanationsByTrack: {
    RU_KY: "Draft explanation for review.",
    EN_KY: "Draft explanation for review.",
    KY_KY: "Текшериле турган түшүндүрмө."
  },
  validatedAgainst: ["pending: Kyrgyz methodist review"],
  sourceNotes: "Original app explanation; grammar reference check required.",
  methodistReviewStatus: "not_reviewed"
}
```

## Knowledge Base Workflow

1. Choose the level and communicative need.
2. Identify required vocabulary and sentence pattern.
3. Check whether the item already exists.
4. If new, create a knowledge record with source and rights notes.
5. Add original examples.
6. Link to a lesson, exercise, and future flashcard.
7. Validate grammar and translations.
8. Mark review status before publication.

## Track-Specific Knowledge

RU -> KY:

- Explain contrast with Russian where helpful.
- Include Russian translations and common Russian-influenced mistakes.

EN -> KY:

- Explain meaning and structure without assuming Russian.
- Avoid overloading English speakers with terminology too early.

KY -> KY:

- Use simple Kyrgyz explanations.
- Support heritage or improving speakers with literacy, reading, and grammar refinement.

## Knowledge To Lesson Flow

Lessons should draw from the knowledge base in this order:

1. Communication goal.
2. Required vocabulary.
3. Dialogue or text using the vocabulary.
4. One grammar point or sentence pattern shown in context.
5. Practice using only taught or review-ready content.
6. Review and flashcards generated from the same linked records.

## Review And Flashcard Integration

Knowledge records should feed:

- lesson vocabulary cards
- exercise prompts
- missed-answer review queue
- future flashcards
- SRS scheduling
- weak grammar review
- future placement diagnostics

Rules:

- Flashcards should be generated from approved or clearly demo-marked knowledge records.
- Mistakes should link back to the exact vocabulary, grammar point, or sentence pattern.
- Corrected missed items should remain available for light review.

## Open Work

- Define exact DB tables and foreign keys.
- Approve K0/K1 vocabulary scope with a methodist.
- Create a source/reference catalog.
- Define suffix-rule schema after grammar expert input.
- Decide how generated flashcards are versioned when source content changes.
