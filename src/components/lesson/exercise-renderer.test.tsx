import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ExerciseRenderer } from "@/components/lesson/exercise-renderer";
import { lessons } from "@/content/curriculum";
import type { Lesson } from "@/content/schemas";

const multipleChoiceExercise = lessons[0].exercises[0];
const fillBlankExercise = lessons.find((lesson) => lesson.id === "k1-u1-l1")!
  .exercises[0];
const sentenceBuilderExercise = lessons
  .find((lesson) => lesson.id === "k1-u1-l1")!
  .exercises.find((exercise) => exercise.id === "ex-name-build")!;
const matchPairsExercise = lessons
  .find((lesson) => lesson.id === "k1-u1-l1")!
  .exercises.find((exercise) => exercise.id === "ex-intro-match")!;

function renderExercise(exercise: Lesson["exercises"][number]) {
  const onAttempt = vi.fn();

  render(
    <ExerciseRenderer
      exercise={exercise}
      lessonId="test-lesson"
      onAttempt={onAttempt}
    />,
  );

  return { onAttempt };
}

describe("ExerciseRenderer", () => {
  it("renders multiple choice options", () => {
    renderExercise(multipleChoiceExercise);

    expect(screen.getByTestId("exercise-renderer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "hello" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "thank you" })).toBeInTheDocument();
  });

  it("shows correct feedback for a correct multiple choice answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(multipleChoiceExercise);

    await user.click(screen.getByRole("button", { name: "thank you" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Good. That fits this lesson.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Rahmat means thank you.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "thank-you",
        correct: true,
        exerciseId: "ex-greeting-match",
        itemId: "item-rahmat",
      }),
    );
  });

  it("shows gentle correction for an incorrect multiple choice answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(multipleChoiceExercise);

    await user.click(screen.getByRole("button", { name: "hello" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Not quite yet.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Look at the lesson words again.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Answer: ыраазычылык",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "hello",
        correct: false,
      }),
    );
  });

  it("accepts a correct fill blank answer with trimmed case-insensitive matching", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(fillBlankExercise);

    await user.type(screen.getByLabelText("___ Elina."), "  атым ");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Good. That fits this lesson.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "атым",
        correct: true,
        exerciseId: "ex-name-pattern",
        itemId: "item-atym",
      }),
    );
  });

  it("shows the correct answer after an incorrect fill blank answer", async () => {
    const user = userEvent.setup();
    renderExercise(fillBlankExercise);

    await user.type(screen.getByLabelText("___ Elina."), "Ким");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Not quite yet.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Answer: Атым",
    );
  });

  it("renders sentence builder tiles and builds a selected sentence", async () => {
    const user = userEvent.setup();
    renderExercise(sentenceBuilderExercise);

    expect(screen.getByTestId("exercise-renderer")).toBeInTheDocument();
    expect(screen.getByText("Build: My name is Elina.")).toBeInTheDocument();
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Tap the words in order",
    );

    await user.click(screen.getByRole("button", { name: "Add Атым" }));
    await user.click(screen.getByRole("button", { name: "Add Элина" }));

    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Атым",
    );
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Элина",
    );

    await user.click(screen.getByRole("button", { name: "Remove Атым" }));

    expect(screen.getByTestId("sentence-builder-answer")).not.toHaveTextContent(
      "Атым",
    );
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Элина",
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Tap the words in order",
    );
  });

  it("accepts a correct sentence builder answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(sentenceBuilderExercise);

    await user.click(screen.getByRole("button", { name: "Add Атым" }));
    await user.click(screen.getByRole("button", { name: "Add Элина" }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Nice - that works.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "tile-atym tile-elina",
        answerDisplay: "Атым Элина",
        correct: true,
        correctAnswerDisplay: "Атым Элина",
        exerciseId: "ex-name-build",
        itemId: "item-build-atym-elina",
      }),
    );
  });

  it("shows the correct sentence after an incorrect sentence builder answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(sentenceBuilderExercise);

    await user.click(screen.getByRole("button", { name: "Add Элина" }));
    await user.click(screen.getByRole("button", { name: "Add Атым" }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Not quite yet.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Almost. Check the order and try again.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Answer: Атым Элина",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "tile-elina tile-atym",
        answerDisplay: "Элина Атым",
        correct: false,
      }),
    );
  });

  it("renders match pair cards and creates a selected pair", async () => {
    const user = userEvent.setup();
    renderExercise(matchPairsExercise);

    expect(screen.getByText("Match the pairs")).toBeInTheDocument();
    expect(screen.getByTestId("match-pairs-empty")).toHaveTextContent(
      "Tap a pair to connect it",
    );

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "My name is ..." }));

    expect(screen.getByTestId("match-pairs-selected")).toHaveTextContent(
      "Атым ... -> My name is ...",
    );

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByTestId("match-pairs-empty")).toHaveTextContent(
      "Tap a pair to connect it",
    );
  });

  it("accepts correct match pairs", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(matchPairsExercise);

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "My name is ..." }));
    await user.click(screen.getByRole("button", { name: "Атың ким?" }));
    await user.click(screen.getByRole("button", { name: "What is your name?" }));
    await user.click(screen.getByRole("button", { name: "Сенчи?" }));
    await user.click(screen.getByRole("button", { name: "And you?" }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Nice - these match.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer:
          "left-atym:right-my-name|left-atyn-kim:right-your-name|left-senchi:right-and-you",
        answerDisplay:
          "Атым ... -> My name is ...; Атың ким? -> What is your name?; Сенчи? -> And you?",
        correct: true,
        correctAnswerDisplay:
          "Атым ... -> My name is ...; Атың ким? -> What is your name?; Сенчи? -> And you?",
        exerciseId: "ex-intro-match",
        itemId: "item-intro-pairs",
      }),
    );
  });

  it("shows the correct pairs after incorrect match pairs", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(matchPairsExercise);

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "And you?" }));
    await user.click(screen.getByRole("button", { name: "Атың ким?" }));
    await user.click(screen.getByRole("button", { name: "What is your name?" }));
    await user.click(screen.getByRole("button", { name: "Сенчи?" }));
    await user.click(screen.getByRole("button", { name: "My name is ..." }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Not quite yet.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Almost. Review the pairs and try again.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Answer: Атым ... -> My name is ...; Атың ким? -> What is your name?; Сенчи? -> And you?",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer:
          "left-atym:right-and-you|left-atyn-kim:right-your-name|left-senchi:right-my-name",
        correct: false,
      }),
    );
  });

  it("renders a clean fallback for unsupported exercise types", () => {
    renderExercise({
      ...multipleChoiceExercise,
      kind: "error_correction",
    });

    expect(screen.getByTestId("unsupported-exercise")).toHaveTextContent(
      "Practice type coming soon",
    );
    expect(screen.getByTestId("unsupported-exercise").textContent).not.toMatch(
      /schema|unsupported|methodist|source/i,
    );
  });
});
