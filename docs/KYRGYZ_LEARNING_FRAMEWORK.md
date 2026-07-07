# Kyrgyz Learning Framework

This app uses an HSK-style curriculum model adapted for Kyrgyz. The goal is not to copy HSK content, Chinese pedagogy, or textbook passages. The goal is to borrow the useful structure: clear levels, controlled vocabulary, recurring lesson patterns, measurable can-do outcomes, and review loops.

All Kyrgyz grammar explanations, examples, translations, pronunciations, and final learner-facing content require review by a Kyrgyz methodist and/or linguist before release.

## Core Learning Sequence

Every content unit follows this structure:

Level -> Unit -> Lesson -> Vocabulary -> Dialogue/Text -> Grammar Point -> Practice -> Mini-game -> Speaking/AI Roleplay -> Review

Definitions:

- Level: a broad proficiency band such as K0 or K1.
- Unit: a themed cluster inside a level, such as alphabet basics or cafe language.
- Lesson: one short mobile-first learning session with one main communicative goal.
- Vocabulary: a small controlled set of words or phrases.
- Dialogue/Text: original input that shows the vocabulary in context.
- Grammar Point: one focused pattern or explanation.
- Practice: short checks that prove the learner can recognize or produce the target language.
- Mini-game: a lightweight reinforcement activity using approved lesson content.
- Speaking/AI Roleplay: constrained output practice tied to the lesson.
- Review: can-do summary, key recall items, and progress update.

## Level Design Principles

- Lessons should be short enough to complete on a phone.
- New words and grammar should be intentionally limited.
- Each lesson should have one main outcome.
- Earlier levels prioritize recognition, survival phrases, reading confidence, and high-frequency patterns.
- Later levels can add broader contexts, richer grammar, longer texts, and more open production.
- Review should recycle previous content rather than constantly introducing new content.

## Learning Tracks

The app should eventually support:

- RU -> KY: Russian explanations and translations for learners who use Russian as a bridge language.
- EN -> KY: English explanations and translations for learners who use English as a bridge language.
- KY -> KY: Kyrgyz-only explanations for immersion, heritage learners, and later-stage learners.

Content data must be structured so these tracks can coexist without duplicating the lesson logic. A lesson can share the same Kyrgyz source material while providing track-specific explanations, translations, common mistakes, and prompts.

## K0: Absolute Beginner

K0 is for learners with no reliable Kyrgyz reading or speaking foundation.

Primary goals:

- Recognize the Kyrgyz alphabet at a beginner level.
- Notice Kyrgyz-specific letters and sounds, especially ө, ү, ң.
- Read very short words and phrases.
- Use basic greetings and polite phrases.
- Build confidence with simple Kyrgyz text on a mobile screen.

Recommended K0 scope:

- Alphabet basics.
- Special Kyrgyz letters: ө, ү, ң.
- Basic greetings.
- Thanking and short polite responses.
- Simple classroom or app instructions.
- Very short reading practice.

K0 content constraints:

- 3-6 vocabulary items per lesson.
- 1 main pronunciation or reading focus per lesson.
- Dialogues of 2-4 short lines.
- Texts of 1-3 very short sentences.
- Grammar explanations should be minimal and may be replaced by reading or sound guidance.
- All pronunciation notes must be validated by a Kyrgyz linguist.

K0 learner outcome examples:

- I can recognize the letter ң in a word.
- I can recognize and say Салам.
- I can read a very short phrase with familiar words.

## K1: Everyday Survival

K1 is for learners who can begin using Kyrgyz in predictable everyday situations.

Primary goals:

- Handle basic greetings and introductions.
- Recognize and use everyday survival language.
- Understand short dialogues in familiar contexts.
- Learn controlled vocabulary for common daily scenarios.
- Produce short phrases and simple sentences.

Recommended K1 themes:

- Greetings.
- Introductions.
- Family.
- Numbers.
- Food.
- Cafe.
- Shop.
- Bazaar.
- Taxi.
- Address.

K1 content constraints:

- 5-8 vocabulary items per lesson.
- 1 main grammar point per lesson.
- Dialogues of 4-8 short lines.
- Texts of 3-6 short sentences.
- Exercises should mix recognition and simple production.
- AI roleplay must stay inside approved K1 scenarios and vocabulary.

K1 learner outcome examples:

- I can ask someone's name.
- I can say my name.
- I can order tea in a cafe with a short phrase.
- I can recognize numbers in a price or address.

## K2 Placeholder

K2 should expand everyday interactions beyond survival phrases.

Possible scope:

- Time and schedules.
- Directions.
- Weather.
- Simple preferences.
- More family and social descriptions.
- More productive sentence patterns.

K2 should remain controlled, but learners can handle longer dialogues and short practical texts.

## K3 Placeholder

K3 should introduce more connected language.

Possible scope:

- Past and future references.
- Describing routines and events.
- Basic opinions and reasons.
- Short messages and announcements.
- More culturally grounded everyday situations.

K3 content should increase recycling and mixed-skill practice.

## K4 Placeholder

K4 should move toward intermediate functional communication.

Possible scope:

- Narrating experiences.
- Comparing options.
- Handling problems in services and travel.
- Reading short informational texts.
- More nuanced grammar explanations by track.

K4 may include longer AI roleplays with stronger guardrails and review tagging.

## K5 Placeholder

K5 should support more independent communication.

Possible scope:

- Longer conversations.
- Personal opinions.
- Simple professional and academic contexts.
- Cultural texts.
- Extended reading and listening practice.

K5 content requires a deeper methodist framework before implementation.

## Validation Requirement

No final grammar rule, example sentence, pronunciation guidance, cultural explanation, or translation should be treated as authoritative until approved.

Every demo lesson must include:

- A demo/sample content marker.
- TODO notes for methodist and linguist review.
- Clear separation between content data and UI rendering.
- Structured fields for future RU -> KY, EN -> KY, and KY -> KY tracks.
