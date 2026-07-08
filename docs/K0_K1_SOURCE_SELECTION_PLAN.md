# K0/K1 Source Selection Plan

This plan defines what sources must be selected and cataloged before rewriting `k0-u1-l1` or creating future K0/K1 lessons. It does not authorize copying protected content. Sources are used for level alignment, sequencing, validation, translation checking, and methodist review support unless licensing explicitly allows more.

Use `docs/source-catalog/` to record actual sources, rights status, allowed usage, and methodist decisions before any K0/K1 rewrite.

## Source Record Fields

Every candidate source should be cataloged with:

- Title.
- Author/organization.
- Year or edition.
- Source type.
- URL or internal file location if available.
- Rights status.
- Allowed use:
  - `methodology_only`
  - `reference_only`
  - `adaptation_allowed`
  - `direct_use_allowed`
  - `license_required`
- Relevant levels: K0, K1, Кыргызтест A1, pre-A1, or other.
- Relevant topics: alphabet, greetings, pronouns, formal/informal register, questions, directions, cafe, shop, etc.
- Notes: why the source is useful, uncertainty, reviewer decisions, and restrictions.

## 1. Level Reference Sources

Needed before rewriting K0/K1:

- Кыргызтест A1 expectations, where accessible and rights-safe.
- Beginner/pre-A1 assumptions for complete beginners.
- Any methodist-approved mapping from K0/K1 to Кыргызтест A1 starter expectations.

Selection criteria:

- Source clearly describes beginner communicative ability, not only school grammar.
- Source helps answer what a complete beginner should learn first.
- Source can inform sequencing without copying protected test or textbook content.
- Source supports practical survival-language goals for RU -> KY learners.

Use:

- Define K0 as alphabet/readiness, first greetings, short polite phrases, and confidence with Kyrgyz text.
- Define K1 as everyday survival language, including greetings, introductions, family, numbers, food, cafe, shop, bazaar, taxi, and address.
- Record level alignment notes in lesson metadata and review docs.

Do not:

- Claim exact Кыргызтест equivalence until a methodist validates it.
- Copy test items, textbook tasks, or protected sample passages.

## 2. Grammar Reference Sources

Needed topics:

- Beginner phonetics and alphabet.
- Special letters and sounds: `ө`, `ү`, `ң`.
- Greetings and greeting formulae.
- Personal pronouns only when pedagogically necessary.
- Simple question/answer phrases.
- Formal/informal distinction.
- Direction suffixes only when appropriate for later K1 lessons.

Candidate source categories:

- Approved Kyrgyz grammar references listed in `docs/KYRGYZ_SOURCE_BASE.md`.
- Methodist-approved beginner explanations.
- Native speaker/methodist notes for pragmatic language, register, and naturalness.

Selection criteria:

- Source is reliable for grammar verification.
- Source can answer beginner-specific questions without overloading the lesson.
- Source helps confirm whether a phrase is a grammar point, language note, or memorized chunk.
- Source supports RU_KY explanations, not just abstract grammar terminology.

Use:

- Validate grammar notes and examples.
- Confirm whether a beginner phrase is natural.
- Confirm register and politeness implications.
- Build original explanations after review.

Do not:

- Copy grammar-book explanations into learner UI.
- Introduce advanced grammar just because it appears in a reference.

## 3. Kyrgyz-As-Foreign-Language Materials

Needed before rewriting K0/K1:

- Beginner course materials for sequencing and pacing.
- Examples of how Kyrgyz as a foreign language introduces greetings, alphabet, names, and everyday phrases.
- Methodology notes from level-based materials such as "Алтын көпүрө" style resources, when available and rights-safe.

Selection criteria:

- Source is designed for non-native learners or language teaching.
- Source helps compare vocabulary load and lesson order.
- Source clarifies what explanations are beginner-friendly.
- Rights status is known or treated conservatively.

Allowed use:

- Methodology only.
- Reference only.
- Adaptation only when license or permission explicitly allows it.

Not allowed:

- Copying dialogues.
- Copying exercises.
- Copying reading texts.
- Copying grammar explanations.
- Light paraphrasing protected lesson content.

## 4. School And Cultural Sources

Use primarily for long-term planning, not the first beginner lesson.

Candidate source categories:

- Кыргыз тили 5-11 класс programs.
- Кыргыз адабияты 5-11 класс programs.
- Culture, folklore, proverb, and public-domain source catalogs.

Selection criteria:

- Source helps with theme planning, cultural sequence, and later graded reading.
- Source is not over-advanced for K0/K1.
- Rights status is clear before any direct learner-facing use.

Use:

- Inform long-term reading/literature plan.
- Identify culturally appropriate themes.
- Plan later K2-K5 readings.

Do not:

- Use school literature as direct first-lesson content.
- Copy textbook passages or modern literary excerpts without rights.

## 5. Dictionary And Translation References

Needed for:

- Vocabulary translation checking.
- Phrase meaning checks.
- RU -> KY learner explanations.
- EN -> KY future support.
- Identifying literal translations that should be avoided.

Selection criteria:

- Reference is reputable, current enough for learner use, or methodist-approved.
- It supports Kyrgyz spelling and meaning verification.
- It helps distinguish word meaning from phrase meaning.
- It does not replace native speaker judgment for natural dialogue.

Use:

- Check vocabulary meanings.
- Check whether RU/EN translations preserve meaning without forcing Kyrgyz word order.
- Support internal source notes.

Do not:

- Treat dictionary lookup as proof that a full sentence or dialogue is natural.
- Copy dictionary example sentences unless rights explicitly allow it.

## 6. Native Speaker / Methodist Validation

Required before beta approval.

Reviewer should validate:

- Kyrgyz accuracy.
- Natural spoken Kyrgyz.
- Register, politeness, and formal/informal choices.
- RU translations and learner clarity.
- EN/KY track text where applicable or explicitly deferred.
- Level appropriateness.
- Exercise correctness.
- Audio transcripts and pronunciation requirements.

No lesson can move to `approved_for_beta` or `approved_for_production` from source research alone. A Kyrgyz methodist/linguist review is required.

## Source Selection Gate Before Rewriting

Before rewriting any K0/K1 lesson:

- [ ] At least one level-alignment source or methodist decision is recorded.
- [ ] At least one grammar/reference source or methodist decision is recorded for the main language point.
- [ ] Kyrgyz-as-foreign-language sequencing has been considered, or explicitly deferred with rationale.
- [ ] Dictionary/translation references or reviewer notes are available for new vocabulary.
- [ ] Rights status and allowed use are recorded for every source consulted.
- [ ] Source IDs and methodist decision IDs are recorded in `docs/source-catalog/` or linked revision notes.
- [ ] Direct copying is blocked unless the source is public-domain or licensed.
- [ ] The rewrite plan follows `docs/K0_K1_CONTENT_GROUNDING_CHECKLIST.md`.
