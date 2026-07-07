# Source Methodology

This document defines how external sources may inform the Kyrgyz learning app.

The product uses sources for methodology, sequencing, validation, level alignment, grammar verification, and reading theme selection. Sources are not a content quarry. Do not copy textbook lessons, workbook items, grammar explanations, dialogues, literary passages, or exercise sets into the app unless the material is public-domain, licensed for this use, or explicitly approved by the rights holder.

All final Kyrgyz content must be original, licensed, public-domain, or explicitly approved by a methodist/rights holder.

## Source Use Categories

Allowed source uses:

- Methodology: how lessons are structured, sequenced, reviewed, and assessed.
- Level alignment: how learner ability maps to local and international proficiency references.
- Grammar validation: checking whether app explanations and examples are correct.
- Theme planning: choosing age-appropriate and level-appropriate topics.
- Reading difficulty guidance: deciding text length, vocabulary load, and cultural progression.
- Rights-cleared reading selection: using only licensed, public-domain, or explicitly approved texts.

Disallowed source uses:

- Copying HSK textbook content.
- Copying Kyrgyz textbook dialogues or exercises.
- Copying modern literary excerpts without license or permission.
- Lightly paraphrasing protected content as seed content.
- Presenting unvalidated app-generated grammar as authoritative.

## Source Tiers

Tier 1: product methodology references.

- HSK-style structure: level progression, controlled vocabulary, textbook/workbook/teacher-guide logic, gradual language points, reviews, and assessment.
- Use only for structure and process.
- Never copy HSK content.

Tier 2: Kyrgyz level and grammar validation references.

- Кыргызтест A1, A2, B1, B2, C1 as local alignment references.
- К. А. Биялиев, "Справочник по грамматике кыргызского языка".
- "Грамматика литературного кыргызского языка".
- Additional validated grammar references may be added by a methodist.

Tier 3: Kyrgyz-as-foreign-language methodology references.

- "Алтын көпүрө" style level-based materials.
- Other Kyrgyz-as-foreign-language materials approved by a methodist.
- Use for sequencing, skill balance, level expectations, and validation only unless licensed.

Tier 4: school curriculum and reading progression references.

- Кыргыз тили 5-11 класс programs.
- Кыргыз адабияты 5-11 класс programs.
- Use for theme planning, literary/cultural progression, and reading difficulty guidance.

Tier 5: reading and literature sources.

- Folklore.
- Proverbs.
- Public-domain texts.
- School-program themes.
- Adapted original readings.
- Modern literary excerpts only when licensed or explicitly approved.

## Required Source Metadata

Future content models should include source and rights metadata wherever content, grammar, reading, or AI roleplay depends on a methodology or validation source.

Recommended fields:

- `methodologyRefs`: methodology sources that informed structure, sequencing, or assessment.
- `sourceNotes`: plain-language notes about what source category informed the item.
- `rightsNotes`: copyright, license, public-domain, or permission notes.
- `validatedAgainst`: grammar, level, or methodist references used for validation.
- `hskInspiredComponent`: the HSK-style component being adapted, such as vocabulary list, language point, workbook exercise, or review test.
- `kyrgyztestLevel`: local level alignment target, such as A1 or A2, when applicable.
- `readingSourceType`: original, adapted folklore, public-domain, licensed excerpt, school-theme-inspired, or other controlled value.
- `isOriginalText`: whether the learner-facing Kyrgyz text was written originally for this app.
- `requiresLicense`: whether rights clearance is required before learner-facing release.
- `methodistReviewStatus`: draft, needs review, in review, approved, rejected, or approved for demo only.

## Workflow For New Content

1. Choose the level, unit, and communicative goal.
2. Identify the HSK-inspired component pattern being adapted.
3. Check Kyrgyztest/local level alignment target.
4. Draft original Kyrgyz content or select a rights-cleared source.
5. Add source notes and rights notes.
6. Validate grammar against approved references.
7. Send to methodist/linguist review.
8. Keep content marked demo or in-review until approved.

## Review Standard

A lesson is not final until:

- Its content is original, licensed, public-domain, or rights-approved.
- Grammar has been checked against approved references.
- Level has been checked against the product framework and local alignment references.
- Reading/literary content has rights notes.
- Methodist review status is recorded.
