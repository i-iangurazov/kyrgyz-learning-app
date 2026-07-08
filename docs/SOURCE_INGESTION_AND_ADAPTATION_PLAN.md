# Source Ingestion And Adaptation Plan

This plan explains how books and learning materials can inform Kyrgyz lessons safely without copying protected content.

## Core Workflow

Book/source -> extract topics/vocabulary/grammar -> map to level/unit -> create original lesson -> validate -> publish.

## 1. Source Catalog

Every source considered for curriculum work should be cataloged with:

- Title, author/editor, edition, publication year, language, and URL/reference.
- Source category: grammar reference, Kyrgyztest alignment, Kyrgyz-as-foreign-language material, school curriculum, literature, folklore, proverb collection, public-domain text, or licensed source.
- Rights status and allowed usage.
- Internal notes about why the source is useful.

## 2. Rights Check

Before using a source, classify usage:

- `methodology_only`: sequencing, level design, validation, or topic planning only.
- `reference_only`: grammar or usage verification only.
- `adaptation_allowed`: adaptation is permitted by license or permission.
- `licensed_content`: direct excerpts are allowed only within license terms.
- `public_domain`: text may be used if public-domain status is documented.
- `blocked`: unclear or protected rights; do not ingest content.

Protected passages must not be copied into lesson seed data unless the product has explicit rights.

## 3. Extraction

Extraction should capture learning signals, not protected prose:

- Topics and communication situations.
- Candidate vocabulary and phrase categories.
- Grammar points and suffix patterns.
- Common learner mistakes.
- Reading themes and cultural sequence.
- Level-alignment notes.

Do not copy textbook explanations, exercise sets, dialogues, or literary passages.

## 4. Adaptation Into Lessons

For each level/unit:

- Map extracted topics to K0/K1 scope first.
- Keep one main grammar point per lesson.
- Limit new vocabulary according to `docs/CONTENT_GUIDELINES.md`.
- Write original Kyrgyz dialogues/texts for the app.
- Create exercises from the lesson content, not from copied source exercises.
- Keep internal `sourceNotes`, `rightsNotes`, and `methodistReviewStatus`.

## 5. Review

Before publishing:

- A Kyrgyz methodist/linguist reviews vocabulary, grammar, naturalness, translations, cultural appropriateness, and level fit.
- Rights notes are checked.
- Audio is reviewed separately when available.
- Only approved content can move from demo/draft into learner release.

## Future Automation

Future ingestion tools may help catalog sources and extract planning notes, but automated extraction must never bypass rights checks or methodist review.
