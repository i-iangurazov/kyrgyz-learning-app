# Lesson Template

Each lesson should feel like a short mobile app session. It should be structured, focused, and reusable across RU -> KY, EN -> KY, and KY -> KY tracks.

Lesson content must also follow `docs/SOURCE_METHODOLOGY.md`. HSK-style sources are structural inspiration only. Kyrgyz textbooks, grammar books, Kyrgyz-as-foreign-language materials, school programs, and literature sources may guide methodology, sequencing, validation, and theme selection, but must not be copied unless rights are clear.

Lesson UI must follow `docs/LESSON_UX_PRINCIPLES.md` and the overall product experience in `docs/UX_EXPERIENCE_BLUEPRINT.md`.

Canonical sequence:

1. Story card
2. Learning goals
3. Vocabulary
4. Dialogue or short text
5. Breakdown
6. Grammar point
7. Exercises
8. Mini-game
9. Speaking prompt
10. AI roleplay
11. Review
12. Progress update

## Schema V2 Contract

Lesson records use `schemaVersion: "lesson-v2"`.

Required lesson-level fields:

- Lifecycle: `contentStatus`, `methodistReviewStatus`, `isDemoContent`, `internalNotes`, `methodistNotes`.
- Source and rights: `methodologyRefs`, `sourceNotes`, `rightsNotes`, `validatedAgainst`, `hskInspiredComponent`, `kyrgyztestLevel`, `cefrLevelPlaceholder`, `requiresLicense`, `isOriginalContent`.
- Track support: `supportedTracks` using `RU_KY`, `EN_KY`, and `KY_KY`.
- Lesson metadata: `stableLessonId`, `levelId`, `unitId`, `lessonNumber`, `estimatedDurationMinutes`, `prerequisites`, `learningGoals`, and `targetSkills`.

Canonical enum values:

- `contentStatus`: `demo`, `draft`, `in_review`, `approved`, `published`, `archived`.
- `methodistReviewStatus`: `not_reviewed`, `needs_revision`, `reviewed`, `approved`.
- Exercise `kind`: `multiple_choice`, `fill_blank`, `sentence_builder`, `match_pairs`, `error_correction`, `listening_choice`, `short_answer`.
- Mini-game `type`: `crossword`, `word_match`, `sentence_puzzle`, `find_mistake`, `kyrgyz_wordle`.

Internal source, rights, validation, and methodist fields must not be displayed in normal learner-facing lesson cards.

## 1. Story Card

Purpose:

- Give the learner a reason to care about the lesson.
- Introduce the real-world context without overexplaining.

Content fields needed:

- `title`
- `body`
- `contextTags`
- `sampleNotice`
- `methodologyRefs`
- `sourceNotes`
- `rightsNotes`
- `methodistReviewStatus`

UX behavior:

- Display first as a compact card.
- Keep copy short and readable on a 390px viewport.
- Show demo/validation status when content is not final.
- Do not show raw source or methodist metadata to learners.

Validation rules:

- Must be original.
- Must match the lesson level and unit.
- Must not introduce unapproved vocabulary as required knowledge.

Example:

```ts
story: {
  title: { en: "Meeting at a cafe", ru: "Знакомство в кафе", ky: "Кафедеги таанышуу" },
  body: { en: "Two people greet each other and order tea.", ky: "..." },
  contextTags: ["cafe", "introduction"],
  sourceNotes: "Original demo text inspired by K1 cafe theme.",
  rightsNotes: "Original app-authored text; no external passage copied.",
  methodistReviewStatus: "not_reviewed",
}
```

## 2. Learning Goals

Purpose:

- Tell the learner what they should be able to do after the lesson.
- Give QA and methodists concrete acceptance criteria.

Content fields needed:

- `learningGoals`
- `canDoStatements`
- `targetSkills`
- `kyrgyztestLevel`
- `hskInspiredComponent`

UX behavior:

- Show as 2-3 short bullets or chips.
- Avoid long pedagogical explanations.
- Make the lesson's single primary goal obvious.

Validation rules:

- Goals must be observable.
- Goals must not exceed the level.
- Each goal should connect to practice or review.

## 3. Vocabulary

Purpose:

- Introduce the controlled words and phrases needed for the lesson.

Content fields needed:

- `id`
- `kyrgyz`
- `transliteration` if used
- `english`
- `russian`
- `notes`
- `tags`
- `audioAssetId` later
- `audio.status`
- `sourceNotes`
- `validatedAgainst`
- `methodistReviewStatus`

UX behavior:

- Use compact cards.
- Show Kyrgyz first.
- Keep translations available by track.
- Later: support audio playback, saved words, and spaced review.
- Make cards tappable-friendly for future audio, reveal, or save behavior.

Validation rules:

- Vocabulary must be level-appropriate.
- Meanings must be checked by a Kyrgyz linguist.
- Register and politeness must be noted where relevant.
- Demo vocabulary must be marked as requiring validation.

## 4. Dialogue Or Short Text

Purpose:

- Show the target words and grammar in context.
- Provide input before asking the learner to produce language.

Content fields needed:

- `dialogues[]` or `texts[]`
- speaker names for dialogue
- Kyrgyz lines
- track-specific translations
- optional context note
- optional audio asset references later
- `readingSourceType`
- `isOriginalContent`
- `requiresLicense`
- `sourceNotes`
- `rightsNotes`
- `validatedAgainst`

UX behavior:

- Dialogue lines should be easy to scan.
- Text should be short and chunked.
- Translation display may become toggleable by track.
- Keep dialogue/text before detailed grammar.

Validation rules:

- Must use mostly known or target vocabulary.
- Must be natural Kyrgyz, not word-for-word translation.
- Must be original and copyright-safe.

## 5. Breakdown

Purpose:

- Help the learner understand how the dialogue or text works.
- Point out target phrases, word chunks, and meaning.

Content fields needed:

- `chunks`
- `phrase`
- `meaningByTrack`
- `notesByTrack`
- `linkedVocabularyIds`
- `linkedGrammarPointIds`
- `validatedAgainst`
- `sourceNotes`

UX behavior:

- Use tap-to-reveal or compact expandable rows later.
- Keep explanations short.
- Use progressive disclosure rather than long visible explanation blocks.

Validation rules:

- Breakdown must not introduce unvalidated grammar claims.
- Any uncertainty must be marked for review.

## 6. Grammar Point

Purpose:

- Teach one practical pattern from the lesson.

Content fields needed:

- `id`
- `title`
- `explanationByTrack`
- `examples`
- `commonMistakes`
- `microPractice`
- `validationTodo`
- `approvedBy`
- `validatedAgainst`
- `methodologyRefs`
- `methodistReviewStatus`

UX behavior:

- Simple explanation first.
- Examples second.
- Short practice immediately after.
- Add "Why?" or "More detail" expansion later for deeper grammar.

Validation rules:

- One main grammar point per lesson.
- Must be validated by a Kyrgyz methodist/linguist before final release.
- Track-specific explanations must be accurate for the learner's bridge language.

## 7. Exercises

Purpose:

- Check recognition, comprehension, and controlled production.

Content fields needed:

- `id`
- `kind`
- `prompt`
- `items`
- `correctAnswerData`
- `options`
- `feedback`
- `linkedVocabularyIds`
- `linkedGrammarPointIds`
- `hskInspiredComponent`
- `sourceNotes`

UX behavior:

- Mobile-first interactions.
- Immediate feedback for MVP when possible.
- Keep each item short.
- Wrong answers should teach, not punish.

Validation rules:

- Each item must have one correct answer unless explicitly marked open-ended.
- Distractors must be plausible but fair.
- Exercises must test taught content.

## 8. Mini-game

Purpose:

- Reinforce lesson content through a fast, low-stakes interaction.

Content fields needed:

- `type`
- `title`
- `description`
- `sourceVocabularyIds`
- `sourcePhraseIds`
- `difficulty`
- `validationTodo`
- `hskInspiredComponent`

UX behavior:

- Should be playable with one thumb.
- Should not require desktop precision.
- Should be short enough for a lesson session.
- Reinforce lesson content rather than distract from it.

Validation rules:

- Must use approved lesson or review content.
- Must not introduce unvalidated words.
- Game logic must be testable.

## 9. Speaking Prompt

Purpose:

- Encourage simple output and pronunciation practice.

Content fields needed:

- `prompt`
- `sampleAnswer`
- `allowedPhrases`
- `audioRubric` later
- `validationTodo`
- `methodistReviewStatus`

UX behavior:

- Initially placeholder-only.
- Later: record, replay, compare, and optionally submit for AI-assisted feedback.
- Speaking should come after enough vocabulary and phrase preparation.

Validation rules:

- Prompt must be level-safe.
- Pronunciation guidance requires linguist validation.
- Do not overstate speech recognition accuracy.

## 10. AI Roleplay

Purpose:

- Let the learner practice a realistic scenario while staying within level limits.

Content fields needed:

- `scenario`
- `userGoal`
- `aiCharacter`
- `allowedVocabularyIds`
- `allowedGrammarPointIds`
- `allowedPhrases`
- `correctionStyle`
- `uncertaintyRules`
- `refusalRules`
- `systemPromptPlaceholder`
- `sourceNotes`
- `methodistReviewStatus`

UX behavior:

- MVP uses placeholders only.
- Later roleplay should be short, guided, and restartable.
- The learner should always know the goal.
- AI roleplay should come after preparation and should feel like safe practice.

Validation rules:

- AI must stay within the lesson or level.
- AI must not invent authoritative grammar explanations.
- Uncertain or novel outputs should be tagged for review where possible.

## 11. Review

Purpose:

- Close the lesson with recall and confidence.

Content fields needed:

- `summary`
- `canDo`
- `reviewVocabularyIds`
- `reviewGrammarPointIds`
- `nextLessonId`
- `methodologyRefs`

UX behavior:

- Show a concise summary.
- Show can-do statements.
- Offer a completion action.
- Show what improved and make completion feel rewarding without pressure.

Validation rules:

- Review must reflect what was actually taught.
- Can-do statements must remain level-appropriate.

## 12. Progress Update

Purpose:

- Persist completion and prepare the next learning step.

Content fields needed:

- `lessonId`
- `status`
- `score`
- `completedAt`
- `xpDelta`
- `reviewDueAt` later
- `methodistReviewStatus`

UX behavior:

- MVP can use local state.
- Later implementation should sync to user account progress.

Validation rules:

- Progress state must be testable.
- Content completion must not depend on untracked UI-only state.

## Lesson-level Source Metadata

Every future lesson record should include these source metadata fields directly on the lesson record:

```ts
methodologyRefs: ["docs/HSK_STRUCTURE_ANALYSIS.md", "docs/KYRGYZ_SOURCE_BASE.md"],
sourceNotes: "Original app-authored lesson using HSK-inspired sequence and K1 cafe theme.",
rightsNotes: "No external learner-facing text copied. Requires review before production.",
validatedAgainst: ["pending Kyrgyz grammar reference review"],
hskInspiredComponent: ["vocabulary_list", "dialogue_or_reading_text", "workbook_exercise"],
kyrgyztestLevel: "A1-placeholder",
cefrLevelPlaceholder: "A1 internal placeholder",
requiresLicense: false,
isOriginalContent: true,
methodistReviewStatus: "not_reviewed",
```

For source-derived readings, `requiresLicense` must be true unless the source is confirmed public-domain or already licensed for this use.
