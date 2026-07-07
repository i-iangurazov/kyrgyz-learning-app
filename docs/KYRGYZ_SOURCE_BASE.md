# Kyrgyz Source Base

This document defines the planned source base for Kyrgyz language methodology, grammar validation, level alignment, and reading/theme selection.

Sources listed here are references for methodology and validation. They do not grant permission to copy learner-facing content.

## A. Level Alignment

Use as local alignment references:

- Кыргызтест A1.
- Кыргызтест A2.
- Кыргызтест B1.
- Кыргызтест B2.
- Кыргызтест C1.

Usage:

- Align K-level expectations with local Kyrgyz proficiency references.
- Use A1/A2 especially when refining K0/K1/K2 scope.
- Record `kyrgyztestLevel` on lessons, units, readings, exercises, and roleplay scenarios where applicable.

CEFR-like mapping:

- Use only as a placeholder until a methodist approves the mapping.
- Do not claim that K0-K5 exactly equals CEFR levels.
- Treat any mapping as product-internal guidance until validated.

## B. Grammar Validation

Initial grammar validation references:

- К. А. Биялиев, "Справочник по грамматике кыргызского языка".
- "Грамматика литературного кыргызского языка".

Usage:

- Validate grammar explanations.
- Validate example sentence patterns.
- Check terminology and classification where needed.
- Resolve grammar uncertainty before learner-facing release.

Additional references:

- Other validated grammar references may be added later by a Kyrgyz methodist.
- Each added reference should include bibliographic notes, usage scope, and rights notes.

## C. Kyrgyz As A Foreign Language

Methodology references:

- "Алтын көпүрө" style level-based materials.
- Other Kyrgyz-as-foreign-language course materials approved by a methodist.

Usage:

- Inform sequencing.
- Inform lesson pacing.
- Compare vocabulary load.
- Compare skill progression.
- Validate beginner-friendly explanations.

Rights rule:

- Treat these materials as inspiration and validation only unless licensed.
- Do not copy dialogues, exercise sets, reading texts, explanations, or tests.

## D. School Curriculum

Planning references:

- Кыргыз тили 5-11 класс programs.
- Кыргыз адабияты 5-11 класс programs.

Usage:

- Theme planning.
- Literary and cultural progression.
- Reading difficulty guidance.
- Identifying culturally relevant topics.
- Planning later K3-K5 reading pathways.

Rights rule:

- School curriculum topics may guide planning.
- Do not copy textbook content into seed data unless rights are cleared.

## E. Literature And Culture

Potential source categories:

- Folklore.
- Proverbs.
- Public-domain texts.
- School-program themes.
- Adapted readings.
- Original readings written for this app.
- Modern literary excerpts with explicit license or permission.

Usage:

- K0/K1: micro-reading, original everyday texts, and simple cultural notes.
- K2: adapted folk stories and simple narratives.
- K3: adapted school-literature themes and culture/history texts.
- K4: semi-authentic articles, interviews, and public language.
- K5: original literature, essays, argumentation, stylistics, and public speaking.

Rights rule:

- Do not copy protected texts.
- Any modern literary excerpt requires licensing or explicit permission.
- Store `rightsNotes`, `sourceNotes`, `readingSourceType`, `isOriginalText`, and `requiresLicense` for every reading.

## Required Methodology Fields

Future content records should include:

- `methodologyRefs`
- `sourceNotes`
- `rightsNotes`
- `validatedAgainst`
- `hskInspiredComponent`
- `kyrgyztestLevel`
- `readingSourceType`
- `isOriginalText`
- `requiresLicense`
- `methodistReviewStatus`

## Open Work For Methodists

- Confirm K0-K5 relationship to Кыргызтест A1-C1.
- Approve grammar reference hierarchy.
- Approve transliteration/pronunciation notation.
- Approve source categories for reading.
- Define which folklore/public-domain sources are safe to adapt.
- Define rights workflow for modern literature.
