import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ExerciseRenderer } from "@/components/lesson/exercise-renderer";
import { lessons } from "@/content/curriculum";
import type { Lesson } from "@/content/schemas";

const multipleChoiceExercise = lessons[0].exercises[0];
const fillBlankExercise = lessons.find((lesson) => lesson.id === "k1-u1-l1")!
  .exercises[0];

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

  it("renders a clean fallback for unsupported exercise types", () => {
    renderExercise({
      ...multipleChoiceExercise,
      kind: "sentence_builder",
    });

    expect(screen.getByTestId("unsupported-exercise")).toHaveTextContent(
      "Practice type coming soon",
    );
    expect(screen.getByTestId("unsupported-exercise").textContent).not.toMatch(
      /schema|unsupported|methodist|source/i,
    );
  });
});
