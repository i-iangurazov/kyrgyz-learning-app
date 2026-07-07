# Reading And Literature Plan

This document defines a graded reading path for the Kyrgyz learning app.

Reading content must be original, public-domain, licensed, or explicitly approved by a rights holder. Do not copy modern textbooks or literature into seed data.

## K0 Reading

Focus:

- Micro-reading.
- Letters.
- Syllables.
- Greetings.
- One-sentence texts.

Examples of acceptable original text types:

- Single familiar words.
- Very short greeting lines.
- One-sentence classroom/app instructions.
- Micro-texts built from validated vocabulary.

Constraints:

- Keep text extremely short.
- Support ө, ү, ң recognition.
- Prioritize readability and confidence.
- Validate pronunciation and reading guidance.

## K1 Reading

Focus:

- Short original texts about home, family, cafe, bazaar, taxi, school/work.
- Very short cultural notes.
- Simple proverbs where appropriate and validated.

Examples of acceptable original text types:

- Three to six short sentences about everyday life.
- Short cafe or shop context.
- Simple family description.
- Simple address/taxi text.

Constraints:

- Use mostly known vocabulary.
- Provide EN -> KY and RU -> KY support.
- Keep cultural notes short and reviewed.
- Do not copy textbook examples.

## K2 Reading

Focus:

- Adapted folk stories.
- Simple biographies.
- Short everyday narratives.

Examples of acceptable text types:

- Original retellings of folklore themes.
- Rights-safe adapted stories.
- Short biographies written originally for the app.
- Everyday narratives with controlled grammar.

Constraints:

- Store source and rights notes.
- Mark whether the text is original or adapted.
- Validate adaptation with a methodist.

## K3 Reading

Focus:

- Adapted school-literature themes.
- Short articles.
- Retellings.
- Culture/history texts.

Examples of acceptable text types:

- Original culture/history summaries.
- Adapted retellings of public-domain or licensed materials.
- Short informational articles.
- Thematic readings inspired by school programs.

Constraints:

- Do not copy school textbook content.
- Review cultural framing.
- Track source inspiration and rights status.

## K4 Reading

Focus:

- Semi-authentic articles.
- Interviews.
- Social topics.
- Official/public language.

Examples of acceptable text types:

- Simplified public-information texts.
- Original interview-style readings.
- Social-topic articles written for the app.
- Licensed or public-domain source adaptations.

Constraints:

- Rights review is required for any source-derived text.
- Level and register must be reviewed.
- Longer readings should include comprehension and vocabulary support.

## K5 Reading

Focus:

- Original literature.
- Essays.
- Argumentation.
- Stylistics.
- Public speaking.

Examples of acceptable text types:

- Public-domain literary excerpts where rights are clear.
- Licensed modern excerpts.
- Original essays written for the app.
- Speech and debate texts written for the app.

Constraints:

- Literary content requires rights notes.
- Modern literature requires license or explicit permission.
- Methodists must approve difficulty, cultural context, and learning purpose.

## Copyright Rules

- Do not copy modern textbooks into seed data.
- Do not copy modern literature into seed data.
- Use public-domain or licensed texts only.
- Adapted or original texts must be reviewed by a Kyrgyz methodist.
- Store source notes and rights notes per text.
- Store whether the text is original, adapted, public-domain, licensed, or permission-based.
- Any uncertain rights status means the text cannot ship as learner-facing content.

## Required Reading Metadata

Future reading models should include:

- `readingSourceType`
- `sourceNotes`
- `rightsNotes`
- `isOriginalText`
- `requiresLicense`
- `methodologyRefs`
- `validatedAgainst`
- `kyrgyztestLevel`
- `methodistReviewStatus`

## Review Gates

Before a reading is approved:

- Rights status is clear.
- Kyrgyz is natural.
- Level is appropriate.
- Vocabulary load is controlled.
- Grammar is aligned with the lesson.
- Cultural framing is appropriate.
- Translations are accurate.
- Audio plan is defined if audio is required.
