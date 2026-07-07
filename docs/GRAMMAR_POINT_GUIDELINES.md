# Grammar Point Guidelines

Grammar should help learners use Kyrgyz in a practical context. It should not become a reference grammar inside each lesson.

## Core Rules

- Teach one main grammar point per lesson.
- Keep the explanation short.
- Put the simple explanation first.
- Put examples immediately after the explanation.
- Include common mistakes when useful.
- Add micro-practice directly after the grammar point.
- Mark all demo grammar as requiring methodist/linguist validation.
- Do not present unreviewed grammar as final authoritative content.
- Validate grammar against approved Kyrgyz references listed in `docs/KYRGYZ_SOURCE_BASE.md`.
- Grammar references may validate app-authored explanations, but their explanations must not be copied.

## Grammar Point Structure

Recommended fields:

```ts
grammarPoint: {
  id: "sample-name-pattern",
  title: {
    ky: "...",
    en: "...",
    ru: "..."
  },
  explanationByTrack: {
    "en-ky": "...",
    "ru-ky": "...",
    "ky-ky": "..."
  },
  examples: [
    {
      kyrgyz: "...",
      english: "...",
      russian: "...",
      notes: "..."
    }
  ],
  commonMistakes: [],
  microPractice: [],
  validatedAgainst: ["pending: К. А. Биялиев grammar reference review"],
  sourceNotes: "Original explanation drafted for app; reference check required.",
  methodistReviewStatus: "needs review",
  validationTodo: "TODO(linguist): validate..."
}
```

## Explanation Pattern

Use this order:

1. What the pattern does.
2. Where the learner saw it in the dialogue or text.
3. Two or three short examples.
4. One common mistake or contrast if needed.
5. One micro-practice item.

Avoid:

- Long terminology-heavy explanations.
- Multiple unrelated rules.
- Historical or linguistic detail that does not help the current task.
- Unvalidated claims about correctness, register, or pronunciation.

## Examples

Examples must:

- Be original.
- Use known or target vocabulary.
- Be short.
- Show the target pattern clearly.
- Include translations for supported tracks.
- Be validated before final release.

For K0:

- Grammar may be replaced by sound, letter, or reading guidance.
- Keep explanations extremely short.

For K1:

- Use practical patterns such as asking names, saying possession, ordering, counting, and basic location/address phrases.
- Avoid dense grammar terminology unless a methodist approves it.

## Common Mistakes

Common mistakes should:

- Be based on real learner issues where possible.
- Be track-specific when useful.
- Avoid shaming language.
- Include a correct replacement.

Example fields:

```ts
commonMistakes: [
  {
    track: "ru-ky",
    incorrectPattern: "...",
    explanation: "...",
    correction: "..."
  }
]
```

## Micro-practice

Micro-practice should:

- Test only the current grammar point.
- Be answerable in seconds.
- Use familiar vocabulary.
- Provide a clear answer and feedback.

Examples:

- Choose the correct phrase.
- Fill one blank.
- Reorder two or three chunks.
- Match a question with an answer.

## Track-specific Guidance

RU -> KY:

- Explain contrasts that matter for Russian-speaking learners.
- Use Russian bridge explanations where they reduce confusion.
- Avoid assuming Russian grammar maps directly to Kyrgyz.

EN -> KY:

- Explain contrasts that matter for English-speaking learners.
- Avoid forcing English word order onto Kyrgyz.
- Use simple English and short examples.

KY -> KY:

- Use simple Kyrgyz explanations.
- Prefer examples over translation.
- Keep the language level appropriate for the learner.

## Validation

Grammar content is not final until reviewed for:

- Accuracy.
- Naturalness.
- Register.
- Level appropriateness.
- Translation quality.
- Track-specific explanation quality.
- Alignment with approved grammar references.
- Source notes and validation status.

Recommended validation metadata:

- `validatedAgainst`
- `sourceNotes`
- `methodologyRefs`
- `kyrgyztestLevel`
- `methodistReviewStatus`
