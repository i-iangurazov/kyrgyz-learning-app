import { describe, expect, it } from "vitest";

import {
  getCorrectAnswerText,
  isCorrectOption,
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
});
