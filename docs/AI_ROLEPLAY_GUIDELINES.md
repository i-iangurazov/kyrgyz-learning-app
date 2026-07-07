# AI Roleplay Guidelines

AI roleplay is a practice layer, not the authority on Kyrgyz grammar. It must be constrained by lesson data, level data, and methodist-approved content.

## Core Constraints

- AI must stay within the user's current level.
- AI must prefer approved vocabulary and grammar from the current lesson, unit, and level.
- AI must not invent authoritative grammar explanations.
- AI should correct gently.
- AI should provide short explanations.
- AI should tag uncertain outputs for review where possible.
- AI scenarios must be linked to lessons, vocabulary, grammar points, and allowed phrases.

## Roleplay Data Model

Recommended fields:

```ts
aiRoleplay: {
  id: "roleplay-cafe-intro",
  lessonId: "k1-u1-l1",
  scenario: {
    en: "You meet someone new at a cafe.",
    ru: "Вы знакомитесь с новым человеком в кафе.",
    ky: "..."
  },
  learnerGoal: {
    en: "Greet them and say your name.",
    ru: "Поздоровайтесь и назовите свое имя.",
    ky: "..."
  },
  allowedVocabularyIds: ["salam", "at", "men"],
  allowedGrammarPointIds: ["sample-name-pattern"],
  allowedPhrases: ["Салам.", "Атым ..."],
  correctionPolicy: "gentle-short",
  reviewTags: ["demo", "needs-methodist-review"]
}
```

## Level Control

The AI should:

- Use short turns at K0 and K1.
- Prefer known phrases over new constructions.
- Avoid idioms unless approved for the level.
- Avoid advanced grammar in beginner roleplays.
- End or redirect if the learner moves far outside the scenario.

The AI should not:

- Introduce new grammar as if it is part of the lesson.
- Give long grammar lectures.
- Generate unreviewed vocabulary lists.
- Claim that a disputed or uncertain form is definitely correct.

## Correction Style

Corrections should be:

- Short.
- Kind.
- Specific.
- Focused on the current lesson goal.

Recommended correction pattern:

1. Acknowledge the attempt.
2. Give the corrected phrase.
3. Add one short explanation if needed.
4. Continue the roleplay.

Example:

```text
Good try. Say: "Атым Нур." This means "My name is Nur." Now ask my name.
```

## Uncertainty Handling

Where possible, AI outputs should be tagged for review when:

- The AI uses a word outside the approved vocabulary list.
- The AI gives a grammar explanation.
- The learner asks for a form not covered by the lesson.
- The AI generates a sentence that has not been reviewed.

Possible review tags:

- `outside-approved-vocabulary`
- `grammar-explanation-generated`
- `needs-linguist-review`
- `cultural-context-needed`
- `track-specific-risk`

## Scenario Design

Each scenario should connect to:

- A level.
- A unit.
- A lesson.
- Vocabulary IDs.
- Grammar point IDs.
- Allowed phrases.
- A learner goal.
- A stop condition.

Good beginner scenarios:

- Greet a teacher.
- Say your name.
- Order tea.
- Ask a price.
- Give a simple address.
- Tell a taxi driver a destination.

Avoid at K0/K1:

- Open-ended debates.
- Complex cultural explanations.
- Medical, legal, or high-stakes advice.
- Long free conversation without constraints.

## Production Safety

Before real AI roleplay ships:

- Define level-safe prompt templates.
- Add automated tests for prompt assembly.
- Add logging or review sampling for generated Kyrgyz.
- Add fallback behavior when the model goes off-level.
- Add a product decision on whether learners see uncertainty labels.
- Validate scenarios and correction policy with a methodist.
