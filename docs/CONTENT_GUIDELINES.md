# Content Guidelines

These rules apply to lesson content, vocabulary, dialogues, texts, exercises, mini-games, and AI roleplay source material.

## Core Rules

- All learner-facing Kyrgyz examples must be original.
- Do not copy textbook passages, course pages, phrasebooks, or copyrighted exercise sets.
- Source materials may guide methodology, sequencing, and validation, but must not be copied unless the license explicitly allows it.
- Follow `docs/SOURCE_METHODOLOGY.md` for source handling, rights metadata, and validation workflow.
- HSK materials may be used for structure only, not copied content.
- Kyrgyz textbooks and literature may be used for methodology, sequencing, validation, and theme selection only unless licensed.
- All demo content must be marked as sample/demo content requiring methodist and linguist validation.
- Final grammar, pronunciation, cultural, and usage claims require Kyrgyz methodist/linguist approval.
- Content must be stored in typed data models, JSON seed data, or database-ready records, not hardcoded inside React components.

## Vocabulary Count Per Lesson

Recommended new vocabulary budgets:

- K0: 3-6 new items.
- K1: 5-8 new items.
- K2: 6-10 new items.
- K3: 8-12 new items.
- K4: 10-14 new items.
- K5: 12-16 new items.

Rules:

- Count phrases as vocabulary items when the learner must memorize them as chunks.
- Prefer high-frequency and high-utility words.
- Avoid adding words only because they make a dialogue convenient.
- Recycle previous vocabulary aggressively.

## Dialogue Length Per Level

Recommended dialogue length:

- K0: 2-4 very short lines.
- K1: 4-8 short lines.
- K2: 6-10 lines.
- K3: 8-12 lines.
- K4: 10-16 lines.
- K5: 12-20 lines.

Rules:

- Dialogues must be natural Kyrgyz after validation.
- Speaker turns should be short on mobile.
- Keep each dialogue tied to a clear situation.
- Avoid unnatural word-for-word translation from English or Russian.

## Text Length Per Level

Recommended reading text length:

- K0: 1-3 very short sentences.
- K1: 3-6 short sentences.
- K2: 5-8 sentences.
- K3: 1-2 short paragraphs.
- K4: 2-4 short paragraphs.
- K5: longer texts only after a dedicated reading design exists.

Rules:

- Texts should mostly use known or target language.
- Unknown words must be intentional and supported.
- Text must be chunked for mobile reading.

## Translation Requirements

Each final lesson should support:

- Kyrgyz source text.
- English translation for EN -> KY.
- Russian translation for RU -> KY.
- Kyrgyz-only explanation path for KY -> KY where appropriate.

Rules:

- Translations should preserve meaning, not force identical grammar.
- Track-specific explanations should explain what the learner needs from that language background.
- Translations must be reviewed for accuracy and naturalness.

## Audio Requirements

MVP status:

- Audio can be placeholder-only.
- Placeholder audio records may exist in content data to reserve IDs, transcripts, storage keys, and review status.
- Learner UI must show an honest unavailable state when no playable audio URL exists.

Future production requirements:

- Human-recorded Kyrgyz audio is preferred for vocabulary.
- Human-recorded Kyrgyz audio is preferred for dialogues and reading texts.
- Pronunciation examples for K0 sound lessons.
- Audio asset IDs linked from content records.
- Audio transcripts matching the learner-facing Kyrgyz text.
- Source and rights notes for every recorded or uploaded audio asset.
- Audio review status and methodist review status before release.
- Audio QA for clarity, speed, noise, and naturalness.

Rules:

- Do not ship pronunciation claims or speech feedback without validation.
- Audio must be reviewed for pronunciation, naturalness, pacing, and match with the written text.
- Synthetic audio may be used only as temporary/internal placeholder audio if product policy allows it.
- Temporary MVP TTS must follow `docs/TTS_AUDIO_PIPELINE.md`.
- Built-in TTS voices may be used only through offline scripts, never at learner runtime.
- Do not clone real voices, imitate celebrities/public figures/private people, or create character voices for MVP TTS.
- TTS-generated files must remain traceable to lesson, vocabulary, dialogue, reading, grammar, or future listening IDs.
- TTS-generated audio must be marked internally as synthetic and must remain in audio review until checked by a Kyrgyz speaker or qualified reviewer.
- Do not label unreviewed or synthetic audio as native-quality.
- Do not synthesize final audio without a product decision and QA process.
- Do not expose audio source notes, rights notes, storage keys, or review metadata in normal learner-facing UI.

## Exercise Requirements

Exercises should:

- Test content taught in the same lesson or earlier review.
- Have clearly defined correct answers.
- Include feedback where useful.
- Be short enough for mobile.
- Be schema-valid and renderable by reusable exercise components.

Recommended exercise types:

- `multiple_choice`.
- `fill_blank`.
- `sentence_builder`.
- `match_pairs`.
- `error_correction`.
- `listening_choice`.
- `short_answer`.

## Mini-game Content Rules

Mini-games must:

- Use approved vocabulary, phrases, or grammar.
- Reinforce one skill at a time.
- Be playable in a short session.
- Avoid adding new teaching burden.
- Have deterministic testable logic where possible.

## Copyright Safety

Allowed:

- Original examples written for this app.
- Public-domain or licensed materials only when license terms are documented.
- Methodology inspiration and sequencing ideas from external sources.
- Public-domain folklore or literature only when rights status is documented.
- Licensed or permission-based modern literary excerpts only when rights notes are recorded.

Not allowed:

- Copying textbook dialogues.
- Copying exercise sets.
- Lightly paraphrasing copyrighted lesson content.
- Importing examples from unlicensed sources as app content.
- Copying protected modern literature into seed data.

## Demo Content Marking

Every demo lesson or sample item must include:

- A visible or data-level demo marker.
- `contentStatus: "demo"`.
- `isDemoContent: true`.
- `methodistReviewStatus: "not_reviewed"` until reviewed.
- TODO notes for methodist/linguist validation.
- Clear non-authoritative language.
- No claim that grammar or pronunciation is final.

## Required Source And Rights Fields

Future content models should include:

- `methodologyRefs`
- `sourceNotes`
- `rightsNotes`
- `validatedAgainst`
- `hskInspiredComponent`
- `kyrgyztestLevel`
- `cefrLevelPlaceholder`
- `readingSourceType`
- `isOriginalContent`
- `requiresLicense`
- `methodistReviewStatus`

Schema v2 lesson records must also include:

- `schemaVersion: "lesson-v2"`
- `supportedTracks`: `RU_KY`, `EN_KY`, `KY_KY`
- `learningGoals`
- `targetSkills`
- `estimatedDurationMinutes`
- `prerequisites`

Rules:

- Every new Kyrgyz dialogue, grammar example, exercise prompt, or reading must include source notes and methodist review status.
- Every reading or literary item must include rights notes.
- Every source-derived item must state whether it is original, adapted, public-domain, licensed, or permission-based.
- Any unclear rights status blocks learner-facing release.
