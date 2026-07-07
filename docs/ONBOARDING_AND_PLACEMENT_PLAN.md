# Onboarding And Placement Plan

This document defines the planned onboarding and placement experience. It is not yet implemented.

## Onboarding Goals

Onboarding should:

- Get the learner to a useful starting lesson quickly.
- Identify learning track and goals.
- Avoid making beginners feel tested before they start.
- Allow skipping placement.
- Keep the experience under 10 minutes when placement is included.
- Produce a clear daily plan.

## Step 1: Choose Learning Track

Options:

- RU -> KY
- EN -> KY
- KY -> KY

UX rules:

- Explain each track in one short sentence.
- Keep Kyrgyz as the target language.
- Allow changing track later in Profile.

Output:

- `learningTrack`

## Step 2: Choose Goal

Options:

- Speak in daily life.
- Understand family/community.
- Work/customer service.
- School/university.
- Travel.
- Improve grammar/literacy.

UX rules:

- Let the learner choose one primary goal.
- Later, allow multiple goals.
- Use the goal to prioritize lesson recommendations and examples.

Output:

- `primaryGoal`
- optional `secondaryGoals` later

## Step 3: Choose Current Level

Options:

- I know nothing.
- I can read a little.
- I understand but cannot speak.
- I speak a little.
- I want to improve literacy.

UX rules:

- Use plain language rather than formal level labels.
- Avoid making the learner diagnose grammar knowledge.
- Map the answer to a starting hypothesis, not a final level.

Output:

- `selfReportedLevel`
- initial level recommendation candidate

## Step 4: Placement Test Recommendation

Placement should be recommended, not forced.

Rules:

- Allow skip.
- Keep it under 10 minutes.
- Use adaptive questions later.
- Test reading, vocabulary, grammar, and listening.
- Speaking should be optional later.
- Do not use placement to block learning.

MVP placement can be a placeholder until the content model and first lesson set are stable.

## Placement Test Areas

Reading:

- Recognize letters.
- Read short words.
- Read short phrases.

Vocabulary:

- Recognize common greetings and survival words.
- Match Kyrgyz to track-language meaning.

Grammar:

- Identify simple phrase patterns.
- Choose a correct short response.

Listening later:

- Match audio to word or phrase.
- Recognize common phrases.

Speaking later:

- Repeat a short phrase.
- Say a name/introduction phrase.
- Optional and clearly marked as beta until reliable.

## Placement Output

Placement should produce:

- Recommended level.
- Suggested starting lesson.
- Weak areas.
- Daily plan.

Example output:

```ts
placementResult: {
  recommendedLevel: "K0",
  suggestedStartingLessonId: "k0-u1-l1",
  weakAreas: ["special letters", "greetings"],
  dailyPlan: {
    minutesPerDay: 10,
    focus: "alphabet and greetings",
    firstWeekLessonIds: ["k0-u1-l1", "k0-u1-l2"]
  }
}
```

## Recommended Starting Logic

If the learner knows nothing:

- Start K0 alphabet/greetings.

If the learner can read a little:

- Offer short K0 review or K1 survival start.

If the learner understands but cannot speak:

- Start with K1 speaking-supported survival lessons, with optional K0 reading review.

If the learner speaks a little:

- Recommend placement and start around K1/K2 after methodist-approved levels exist.

If the learner wants literacy:

- Recommend KY -> KY literacy/reading path when available.

## Onboarding Tone

The tone should be:

- Direct.
- Encouraging without hype.
- Adult.
- Practical.

Avoid:

- Long setup forms.
- Asking for account creation before value is shown.
- Scary test language.
- Overpromising fluency.

## Data And Privacy Notes

Future onboarding data should be:

- Editable.
- Used to personalize content.
- Stored locally in MVP or account-backed later.
- Clear to the learner if it affects recommendations.
