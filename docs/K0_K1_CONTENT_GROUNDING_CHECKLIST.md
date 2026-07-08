# K0/K1 Content Grounding Checklist

Use this checklist before rewriting any K0 or K1 lesson. It protects the product from replacing one prototype with another ungrounded prototype.

## General K0/K1 Rewrite Checklist

### Lesson Goal

- [ ] Lesson has one clear communication or reading goal.
- [ ] Goal is observable in the final review.
- [ ] Goal fits the target track, defaulting to RU -> KY for MVP.
- [ ] Goal is appropriate for K0/K1 and not imported from later levels.

### Vocabulary

- [ ] Vocabulary count is controlled: K0 usually 3-6 items; K1 usually 5-8 items.
- [ ] Every vocabulary item appears in dialogue/text or practice.
- [ ] Phrase chunks are treated as vocabulary when the learner must memorize them.
- [ ] Vocabulary supports the lesson goal.
- [ ] Vocabulary translations are checked.
- [ ] Any pronoun/register-sensitive word is methodist-reviewed before beta.

### Kyrgyz Naturalness

- [ ] Every phrase is natural Kyrgyz for the intended situation.
- [ ] Dialogue avoids word-for-word translation from Russian or English.
- [ ] Register and politeness are appropriate.
- [ ] Cultural assumptions are checked.
- [ ] Native speaker/methodist judgment is recorded before approval.

### Translation

- [ ] RU translations preserve meaning and learner clarity.
- [ ] EN translations are present for future EN -> KY support or explicitly deferred for review.
- [ ] KY-only explanations are present where appropriate or explicitly deferred.
- [ ] Translations do not force Russian/English grammar onto Kyrgyz.

### Grammar / Language Note

- [ ] Grammar is not overloaded.
- [ ] Lesson has no more than one main grammar or language point.
- [ ] K0 lessons may use a language note instead of a formal grammar point.
- [ ] Explanation is simple and practical for RU learners.
- [ ] Examples are reviewed and linked to the lesson dialogue/text.
- [ ] Any formal grammar claim is checked against a reference or methodist decision.

### Dialogue And Reading

- [ ] Dialogue is short and realistic.
- [ ] K0 dialogue is usually 2-4 short lines.
- [ ] K1 dialogue is usually 4-8 short lines.
- [ ] Reading is omitted or tiny if the learner is not ready.
- [ ] Reading uses only known or intentionally supported language.
- [ ] Reading text is original, rights-safe, and reviewed.

### Exercises

- [ ] Exercises match lesson vocabulary and grammar.
- [ ] Correct answers are accurate.
- [ ] Distractors are fair and not misleading.
- [ ] Feedback teaches without overexplaining.
- [ ] Exercise difficulty moves from recognition to controlled production.
- [ ] Error correction is used only when appropriate for the level.

### Source And Rights

- [ ] No copyrighted textbook, course, phrasebook, or literature text is copied.
- [ ] Source notes are added for every source or methodist decision used.
- [ ] Rights notes are recorded internally.
- [ ] Allowed use is recorded: methodology only, reference only, adaptation allowed, direct use allowed, or license required.
- [ ] Any direct source use is licensed, public-domain, or explicitly approved.

### Review And Status

- [ ] Methodist review is required before beta.
- [ ] Lesson remains `not_reviewed` or equivalent until explicitly reviewed.
- [ ] `approved_for_beta` is never assigned by Codex without explicit review evidence.
- [ ] Review packets are regenerated after content changes.
- [ ] DB/content export validation still passes after edits.

### Audio

- [ ] Audio transcript list is reviewed before TTS or human recording.
- [ ] Placeholder/TTS audio is not labeled native-quality.
- [ ] Pronunciation, stress/accent, pacing, and speaker register are reviewed by a Kyrgyz speaker before beta.
- [ ] Audio rights/source notes are recorded internally.

## Specific Checklist For `k0-u1-l1`

Use this before rewriting the first lesson.

### Greeting Choice

- [ ] Decide whether first greeting is `Салам`, `Саламатсызбы`, or another phrase.
- [ ] Confirm whether the chosen greeting matches the target learner context.
- [ ] Confirm whether informal greeting is acceptable in the first lesson.
- [ ] Confirm whether a formal greeting should be introduced now or later.

### Formal / Informal Choice

- [ ] Decide whether formal/informal distinction appears in lesson 1.
- [ ] If included, keep explanation short and practical.
- [ ] If deferred, avoid examples that require explaining the distinction.
- [ ] Confirm whether `сен` is used, deferred, or removed.

### First Response Phrase

- [ ] Choose one natural first response.
- [ ] Confirm whether `Жакшы` is natural in the target dialogue.
- [ ] Confirm whether `Рахмат` belongs in lesson 1.
- [ ] Confirm whether response should be taught as a fixed phrase chunk.

### First Pronouns

- [ ] Decide whether pronouns appear in lesson 1.
- [ ] If `сен` appears, validate register and example sentence.
- [ ] Avoid unnatural examples such as direct word-for-word translations.

### Reading Decision

- [ ] Decide whether lesson 1 includes reading.
- [ ] If reading is included, keep it to one micro-reading using taught words only.
- [ ] Remove or replace questionable forms unless methodist-approved.
- [ ] Confirm whether alphabet/sound work should precede reading.

### Exercise Choice

- [ ] Include multiple choice only for taught words/phrases.
- [ ] Include match pairs only if phrase meanings are stable.
- [ ] Include fill blank only if the phrase is natural and reviewed.
- [ ] Use sentence builder only if the target phrase has a natural structure for it.
- [ ] Avoid error correction this early unless a methodist says it helps.

### Audio Transcript List

- [ ] Confirm vocabulary transcript IDs and text.
- [ ] Confirm dialogue line transcript IDs and text.
- [ ] Confirm whether a full-dialogue audio transcript is needed.
- [ ] Confirm reading transcript only if reading stays in the lesson.
- [ ] Review all transcripts before TTS generation or human recording.

## Rewrite Acceptance Gate

Do not merge a K0/K1 lesson rewrite unless:

- [ ] The rewrite follows this checklist.
- [ ] Source notes and review status are preserved.
- [ ] The content remains original or rights-cleared.
- [ ] The lesson is still marked unapproved unless explicit review approval exists.
- [ ] Schema validation, unit tests, content export, round-trip validation, and build pass.
