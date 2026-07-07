# Lesson UX Principles

This document defines how lesson screens should feel and behave.

## Lesson Experience Goal

Lessons should feel like guided mobile sessions, not textbook pages.

A good lesson should:

- Be completable in 8-12 minutes.
- Have one clear communication goal.
- Use short cards.
- Show where the learner is in the flow.
- Teach just enough grammar for the task.
- Give immediate practice.
- End with a sense of progress.

## Preferred Lesson Flow

Use this order:

1. Story
2. Goal
3. Vocabulary
4. Dialogue/Text
5. Breakdown
6. Grammar
7. Practice
8. Mini-game
9. Speaking
10. AI Roleplay
11. Review

Progress update happens after review.

## Card-based Lessons

Rules:

- Lessons should be card-based.
- Each card should have one job.
- Cards should be short enough to scan on mobile.
- Do not combine too many concepts in one card.
- Use consistent section labels.
- Avoid giant text walls.

Current MVP note:

- The lesson player already uses cards for story, vocabulary, dialogue, text, grammar, practice, mini-game, speaking, AI roleplay, and review.
- Future work should add clearer step progress and a dedicated learning goal card.

## Progress Through Lesson Steps

The lesson should always show where the user is.

Future options:

- Step count in the hero.
- Thin progress bar tied to lesson sections.
- Sticky compact step header in focused lesson mode.
- Section completion state.

Avoid:

- Large progress UI that competes with learning.
- Multiple progress systems on one screen.

## Vocabulary UX

Vocabulary cards should:

- Show Kyrgyz first.
- Show track-language meaning clearly.
- Keep transliteration secondary and methodist-approved.
- Support audio later.
- Support tap-to-expand later.
- Support swipeable review later if it improves flow.

Rules:

- Do not overload vocabulary cards with internal metadata.
- Keep each card tappable-friendly.
- Use consistent ordering and spacing.

## Dialogue/Text UX

Dialogue and text should:

- Appear before detailed grammar.
- Be chunked.
- Use mostly known or target language.
- Make the lesson goal visible in context.

Future behavior:

- Tap a line to reveal translation or breakdown.
- Toggle track-language support.
- Play line audio when available.

## Breakdown UX

Breakdown should:

- Explain phrases and chunks from the dialogue/text.
- Link meaning to vocabulary and grammar.
- Be optional or progressively disclosed when possible.
- Avoid becoming a grammar dump.

## Grammar UX

Grammar should start simple.

Rules:

- Show the shortest useful explanation first.
- Put examples immediately below.
- Add "Why?" or "More detail" expansion later.
- Include common mistakes only when useful.
- Keep track-specific explanations separate when needed.

Wrong pattern:

- Long grammar article before the learner sees or uses the phrase.

Preferred pattern:

- See phrase.
- Notice pattern.
- Read short explanation.
- Try micro-practice.

## Exercise UX

Exercises should:

- Give instant feedback when possible.
- Use clear tap targets.
- Teach from wrong answers.
- Avoid punishment language.
- Keep each prompt short.
- Avoid trick questions.

Wrong answers should:

- Explain the issue briefly.
- Show the correct answer.
- Let the learner continue.
- Add the item to review later when that system exists.

## Mini-game UX

Mini-games should:

- Use the lesson's vocabulary or grammar.
- Reinforce one skill.
- Be short.
- Be playable with one thumb.
- Avoid adding new content.
- Feed review/progress only when reliable.

Mini-games should not distract from the lesson goal.

## Speaking UX

Speaking should:

- Come after vocabulary and phrase preparation.
- Start with short prompts.
- Let users skip without shame.
- Support replay and retry later.
- Be clear about whether speech evaluation is real or placeholder.

## AI Roleplay UX

AI roleplay should:

- Come after enough preparation.
- Show scenario and learner goal.
- Use approved vocabulary and grammar.
- Keep turns short at beginner levels.
- Correct gently.
- Avoid authoritative grammar claims.
- Offer a clear exit.

MVP state:

- AI roleplay remains placeholder-only.

## Reading UX

Reading should be graded by level.

Rules:

- K0: letters, syllables, greetings, one-sentence micro-texts.
- K1: short original everyday texts.
- K2: adapted folk stories and simple narratives.
- K3: adapted school-literature themes and culture/history texts.
- K4: semi-authentic articles and public language.
- K5: literature, essays, argumentation, stylistics, and public speaking.

Reading UI should:

- Chunk text.
- Provide track-language support.
- Avoid long unbroken paragraphs on mobile.
- Store rights/source metadata internally, not in learner cards.

## Review UX

Review should show what improved.

Review should include:

- Short summary.
- Can-do statements.
- Words or patterns to remember.
- Completion action.
- Next recommended step later.

Review should feel rewarding without overstatement.

## Internal Metadata

Do not expose internal methodology/source metadata in lesson cards unless it improves UX.

Allowed learner-facing labels:

- Demo lesson.
- Review pending.
- Audio coming later.

Avoid learner-facing raw fields:

- `methodologyRefs`
- `rightsNotes`
- `validatedAgainst`
- `methodistReviewStatus`

## Lesson UX Acceptance Checklist

- [ ] Lesson has one primary learning goal.
- [ ] Lesson is card-based.
- [ ] Step progress is visible or planned.
- [ ] Each card has one job.
- [ ] Vocabulary is tappable-friendly.
- [ ] Dialogue/text appears before grammar.
- [ ] Grammar is short and progressively disclosed.
- [ ] Exercises give useful feedback.
- [ ] Wrong answers teach, not punish.
- [ ] Mini-game reinforces lesson content.
- [ ] Speaking/AI comes after preparation.
- [ ] Review shows what improved.
- [ ] Mobile viewport around 390px has been visually checked for UI changes.
