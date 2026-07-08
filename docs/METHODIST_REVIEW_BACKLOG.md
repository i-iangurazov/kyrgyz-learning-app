# Methodist Review Backlog

This backlog tracks the current seed lessons that exist for engine, UX, schema, audio, and database testing. These lessons are prototype samples only. No current seed lesson should be treated as final curriculum until a Kyrgyz methodist/linguist has reviewed and approved it.

## Review Status Values

- `not_reviewed`: no qualified language review has happened.
- `needs_methodist_review`: ready to send to a methodist/linguist for first review.
- `needs_revision`: reviewed and requires content changes.
- `approved_for_beta`: acceptable for limited beta use, with any restrictions documented.
- `approved_for_production`: approved for public production use.

These backlog values are a content QA workflow. They do not replace existing schema enum values unless a future schema task explicitly updates the model.

## Priority Values

- P0: blocks public or beta release.
- P1: important before wider testing.
- P2: polish or later.

## Global Review Requirements

- Current seed lessons are only for testing the app flow, exercise engine, audio placeholders, and DB mapping.
- A methodist/linguist must check Kyrgyz accuracy, naturalness, grammar, level fit, translations, and exercise correctness.
- Audio and TTS pronunciation must be reviewed by a Kyrgyz speaker before beta use.
- Copyright/source safety must remain documented internally; no protected textbook, course, or literary content may be copied into lessons unless licensed.
- Learners should not see internal review, source, rights, or demo metadata in the main UI.

## Lesson `k0-u1-l1`

Status: prototype / not methodist reviewed  
Backlog status: `needs_methodist_review`  
Priority: P0  
Level/unit: K0 / `k0-u1`  
Lesson focus: first greetings and short polite replies.

### Vocabulary To Review

- `salam`: `Салам`, translation `привет` / `hello`; confirm beginner register and whether it is appropriate as the first greeting.
- `rahmat`: `Рахмат`, translation `спасибо` / `thank you`; confirm usage and spelling.
- `jakshy`: `Жакшы`, translation `хорошо` / `good`; confirm learner-facing translation in short replies.
- `sen`: `Сен`, translation `ты` / `you`; confirm whether introducing informal `сен` in K0 is appropriate and whether the example `Сен жакшы.` is natural or should be replaced.

### Dialogue Lines To Review

- `Салам!`
- `Салам! Жакшы?`
- `Жакшы, рахмат.`

Review naturalness, register, whether `Жакшы?` works as a beginner greeting prompt, and whether the dialogue sounds like real Kyrgyz rather than a translated teaching sketch.

### Reading Text To Review

- `Салам. Мен жакшы. Рахмат.`

Review whether `Мен жакшы.` is natural for the intended meaning, whether it should be replaced, and whether this is level-appropriate for K0 micro-reading.

### Grammar Point To Review

- `sample-short-replies`: short replies in greetings.

Review whether this should be treated as a grammar point, phrase pattern, or conversation note. Confirm examples and track-specific explanations for RU_KY, EN_KY, and KY_KY.

### Exercises To Review

- `ex-greeting-match`: multiple choice for `Рахмат`.
- `ex-greeting-fill`: fill blank `Жакшы, ___.`

Review distractors, answer casing rules, feedback, translation accuracy, and whether the exercises reinforce the same lesson goal without adding off-level content.

### Audio/TTS Pronunciation Review Needs

- Vocabulary audio placeholders: `Салам`, `Рахмат`, `Жакшы`, `Сен`.
- Dialogue audio placeholders for all three lines.
- Reading audio placeholder for `Салам. Мен жакшы. Рахмат.`

Review pronunciation, pacing, stress, natural intonation, and whether any synthetic audio is acceptable for beta. Do not mark TTS as approved automatically.

### Translation Review Needs

- Confirm RU/EN translations for all vocabulary, dialogue, reading, grammar examples, prompts, feedback, and review statements.
- Pay special attention to `Жакшы?`, `Мен жакшы.`, and `Сен жакшы.`

### Naturalness Review Needs

- Check whether the lesson sounds like natural Kyrgyz conversation.
- Replace any unnatural direct Russian or English structure.
- Confirm politeness/register for first beginner contact.

### Level Appropriateness Review Needs

- Confirm whether greetings should precede full alphabet work.
- Confirm whether `сен` is appropriate in K0.
- Confirm the vocabulary load and micro-reading length.

### Suspected Risks / Notes

- `Сен жакшы.` may be unnatural or misleading as a beginner example.
- `Мен жакшы.` may not express the intended meaning naturally.
- `Жакшы?` may need a more natural prompt or surrounding phrase.
- Current lesson is useful for UI testing but should not ship as-is.

## Lesson `k0-u1-l2`

Status: prototype / not methodist reviewed  
Backlog status: `needs_methodist_review`  
Priority: P0  
Level/unit: K0 / `k0-u1`  
Lesson focus: recognizing special Kyrgyz letters `ө`, `ү`, `ң`.

### Vocabulary To Review

- `ozon`: `Өзөн`, translation `ручей` / `stream`; confirm beginner usefulness and pronunciation guidance.
- `utuk`: `Үтүк`, translation `утюг` / `iron`; confirm beginner usefulness and pronunciation guidance.
- `tan`: `Таң`, translation `рассвет` / `dawn`; confirm spelling, meaning, and pronunciation guidance for `ң`.

Review whether these are the best starter words for `ө`, `ү`, `ң`, or whether more useful K0 examples should replace them.

### Dialogue Lines To Review

- `Бул ө.`
- `Ө.`
- `Бул ң.`

Review whether the teacher/student sound-check dialogue is natural, pedagogically useful, and clear enough without overclaiming pronunciation accuracy.

### Reading Text To Review

- `Өзөн. Үтүк. Таң.`

Review word selection, difficulty, translation, and whether isolated words are acceptable for this K0 reading step.

### Grammar Point To Review

- `letters-not-grammar`: letter and sound preparation, explicitly not full grammar.

Review pronunciation notation strategy, RU/EN/KY explanations, and whether the lesson should use a separate phonology/reading category in future content models.

### Exercises To Review

- `ex-letter-pick`: multiple choice identifying which word contains `ң`.

Review whether the question wording, options, and feedback support letter recognition without confusing learners.

### Audio/TTS Pronunciation Review Needs

- Vocabulary audio placeholders: `Өзөн`, `Үтүк`, `Таң`.
- Dialogue audio placeholders for the sound-check lines.
- Reading audio placeholder for `Өзөн. Үтүк. Таң.`

This lesson is audio-sensitive. A Kyrgyz speaker must review pronunciation, vowel quality, `ң`, pacing, and whether synthetic audio is acceptable for any beta use.

### Translation Review Needs

- Confirm translations for `Өзөн`, `Үтүк`, `Таң`.
- Confirm whether English/Russian labels for letters and sounds are clear and not misleading.

### Naturalness Review Needs

- Check whether the classroom sound-check dialogue sounds plausible.
- Confirm whether the reading text should include full phrases or isolated words.

### Level Appropriateness Review Needs

- Confirm whether `ө`, `ү`, `ң` should be introduced together or split.
- Confirm whether these words are too low-frequency for early K0.
- Confirm whether this lesson should come before or after greetings.

### Suspected Risks / Notes

- Current transliteration (`ozon`, `utuk`, `tang`) is a placeholder and may mislead pronunciation.
- Using isolated words may be useful for letter recognition but weak for communication.
- The lesson needs stronger phonology guidance before release.

## Lesson `k1-u1-l1`

Status: prototype / not methodist reviewed  
Backlog status: `needs_methodist_review`  
Priority: P0  
Level/unit: K1 / `k1-u1`  
Lesson focus: introductions, asking a name, saying a name.

### Vocabulary To Review

- `at`: `Ат`, translation `имя` / `name`; confirm whether this item needs possessive forms taught as chunks.
- `men`: `Мен`, translation `я` / `I`; confirm whether examples should use full Kyrgyz structures.
- `kim`: `Ким`, translation `кто` / `who`; confirm use in `Атың ким?`
- `chai`: `Чай`, translation `чай` / `tea`; confirm whether it belongs in this lesson or distracts from introductions.
- `senchi`: `Сенчи?`, translation `а ты?` / `and you?`; confirm register, spelling, and beginner explanation.

### Dialogue Lines To Review

- `Салам. Атың ким?`
- `Атым Элина. Сенчи?`
- `Атым Нур.`

Review naturalness, register, politeness, whether informal `сен` is appropriate, and whether a cafe introduction scenario is realistic at this level.

### Reading Text To Review

- `Салам. Атым Нур. Мен чай алам.`

Review whether `Мен чай алам.` belongs before a cafe/order lesson, whether translation `Я беру чай` is natural, and whether the text supports the lesson goal.

### Grammar Point To Review

- `sample-name-pattern`: `Атым ...` and `Атың ким?`

Review possessive forms, beginner explanation, RU_KY/EN_KY/KY_KY explanations, examples, and common-mistake framing. Confirm whether `Менин атым ...` should be introduced, deferred, or avoided in K1.

### Exercises To Review

- `ex-name-pattern`: fill blank `___ Элина.`
- `ex-name-build`: sentence builder for `Атым Элина.`
- `ex-intro-match`: match pairs for `Атым ...`, `Атың ким?`, `Сенчи?`
- `ex-name-correction`: error correction `Атым ким?` -> `Атың ким?`

Review correct-answer alternatives, casing, distractors, whether `ким` as a tile is fair, match-pair labels, correction explanation, and whether exercises teach without overloading suffix grammar.

### Audio/TTS Pronunciation Review Needs

- Vocabulary audio placeholders: `Ат`, `Мен`, `Ким`, `Чай`, `Сенчи?`
- Dialogue audio placeholders for all three lines.
- Reading audio placeholder for `Салам. Атым Нур. Мен чай алам.`

Review pronunciation, intonation for questions, possessive endings, pacing, speaker register, and whether synthetic audio is acceptable for beta.

### Translation Review Needs

- Confirm all RU/EN translations for name patterns.
- Confirm how to translate `Атың ким?`, `Сенчи?`, and `Атым ...` without misleading learners about grammar.
- Confirm whether `Мен чай алам.` should be translated as `Я беру чай`, `Я возьму чай`, or another phrase depending on context.

### Naturalness Review Needs

- Check dialogue and reading for natural Kyrgyz.
- Confirm whether the cafe scenario should be simplified to meeting in class or kept for survival language.
- Confirm names and examples are culturally appropriate.

### Level Appropriateness Review Needs

- Confirm K1 sequencing after K0 greetings/special letters.
- Confirm whether possessive endings are too much for the first K1 lesson.
- Confirm vocabulary count and whether `чай` should wait for cafe/food unit.

### Suspected Risks / Notes

- Possessive forms may need a clearer, methodist-approved explanation.
- `Мен чай алам.` may introduce unrelated ordering vocabulary before the learner is ready.
- Error correction can be useful but may feel too grammar-heavy if introduced before enough examples.
- Current common-mistake note is explicitly a placeholder and should be rewritten by a reviewer.

## Release Gate

Before any of these lessons can be used in a public beta:

- [ ] Backlog status is at least `approved_for_beta`.
- [ ] All vocabulary, dialogues, readings, grammar points, exercises, and feedback are reviewed.
- [ ] RU/EN/KY track text is reviewed or intentionally deferred.
- [ ] Audio/TTS is reviewed by a Kyrgyz speaker if it is playable in learner UI.
- [ ] Copyright/source notes remain internally complete.
- [ ] No learner-facing UI exposes source, rights, schema, or review metadata.
