import { describe, expect, it } from "vitest";

import {
  getCorrectAnswerText,
  getMatchPairsDisplay,
  getSelectedAnswerText,
  isCorrectMatchPairs,
  isCorrectOption,
  isCorrectSentenceBuilder,
  isCorrectTextAnswer,
  normalizeAnswer,
} from "@/lib/exercise-checking";
import { lessons } from "@/content/curriculum";

const lesson = lessons[0];
const multipleChoiceExercise = lesson.exercises.find(
  (exercise) => exercise.id === "ex-greeting-match",
)!;
const multipleChoiceItem = multipleChoiceExercise.items[0];
const fillBlankExercise = lesson.exercises.find(
  (exercise) => exercise.id === "ex-greeting-fill",
)!;
const fillBlankItem = fillBlankExercise.items[0];
const k1Lesson = lessons.find((candidate) => candidate.id === "k1-u1-l1")!;
const sentenceBuilderExercise = k1Lesson.exercises.find(
  (exercise) => exercise.id === "ex-name-build",
)!;
const sentenceBuilderItem = sentenceBuilderExercise.items[0];
const matchPairsExercise = k1Lesson.exercises.find(
  (exercise) => exercise.id === "ex-intro-match",
)!;
const matchPairsItem = matchPairsExercise.items[0];

describe("exercise checking", () => {
  it("normalizes whitespace and casing for text answers", () => {
    expect(normalizeAnswer("  РаХмАт  ")).toBe("рахмат");
    expect(normalizeAnswer("жакшы   рахмат")).toBe("жакшы рахмат");
  });

  it("checks multiple choice answers by option id", () => {
    const correctOption = multipleChoiceItem.options!.find(
      (option) => option.id === "thank-you",
    )!;
    const incorrectOption = multipleChoiceItem.options!.find(
      (option) => option.id === "hello",
    )!;

    expect(isCorrectOption(multipleChoiceItem, correctOption)).toBe(true);
    expect(isCorrectOption(multipleChoiceItem, incorrectOption)).toBe(false);
    expect(getCorrectAnswerText(multipleChoiceItem)).toBe("ыраазычылык");
  });

  it("checks fill blank answers with normalized text", () => {
    expect(isCorrectTextAnswer(fillBlankItem, "  РАХМАТ ")).toBe(true);
    expect(isCorrectTextAnswer(fillBlankItem, "салам")).toBe(false);
    expect(getCorrectAnswerText(fillBlankItem)).toBe("рахмат");
  });

  it("checks sentence builder answers by selected tile order", () => {
    expect(
      isCorrectSentenceBuilder(sentenceBuilderItem, ["tile-atym", "tile-elina"]),
    ).toBe(true);
    expect(
      isCorrectSentenceBuilder(sentenceBuilderItem, ["tile-elina", "tile-atym"]),
    ).toBe(false);
    expect(
      getSelectedAnswerText(sentenceBuilderItem, ["tile-atym", "tile-elina"]),
    ).toBe("Атым Элина");
    expect(getCorrectAnswerText(sentenceBuilderItem)).toBe("Атым Элина");
  });

  it("checks match pair answers by stable pair ids", () => {
    const correctPairs = {
      "left-atym": "right-my-name",
      "left-atyn-kim": "right-your-name",
      "left-senchi": "right-and-you",
    };
    const incorrectPairs = {
      "left-atym": "right-and-you",
      "left-atyn-kim": "right-your-name",
      "left-senchi": "right-my-name",
    };

    expect(isCorrectMatchPairs(matchPairsItem, correctPairs)).toBe(true);
    expect(isCorrectMatchPairs(matchPairsItem, incorrectPairs)).toBe(false);
    expect(getMatchPairsDisplay(matchPairsItem, correctPairs)).toBe(
      "Атым ... -> My name is ...; Атың ким? -> What is your name?; Сенчи? -> And you?",
    );
    expect(getCorrectAnswerText(matchPairsItem)).toBe(
      "Атым ... -> My name is ...; Атың ким? -> What is your name?; Сенчи? -> And you?",
    );
  });
});
