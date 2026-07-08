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
const errorCorrectionExercise = lessons
  .find((lesson) => lesson.id === "k1-u1-l1")!
  .exercises.find((exercise) => exercise.id === "ex-name-correction")!;

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
    expect(screen.getByRole("button", { name: "привет" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "спасибо" })).toBeInTheDocument();
  });

  it("shows correct feedback for a correct multiple choice answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(multipleChoiceExercise);

    await user.click(screen.getByRole("button", { name: "спасибо" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Верно. Это подходит к уроку.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Рахмат значит спасибо.",
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

    await user.click(screen.getByRole("button", { name: "привет" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Посмотрите ещё раз на слова урока.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Ответ: спасибо",
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

    await user.type(screen.getByLabelText("___ Элина."), "  атым ");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Верно. Это подходит к уроку.",
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

    await user.type(screen.getByLabelText("___ Элина."), "Ким");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Ответ: Атым",
    );
  });

  it("renders sentence builder tiles and builds a selected sentence", async () => {
    const user = userEvent.setup();
    renderExercise(sentenceBuilderExercise);

    expect(screen.getByTestId("exercise-renderer")).toBeInTheDocument();
    expect(screen.getByText("Составьте: Меня зовут Элина.")).toBeInTheDocument();
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Нажимайте слова по порядку",
    );

    await user.click(screen.getByRole("button", { name: "Добавить Атым" }));
    await user.click(screen.getByRole("button", { name: "Добавить Элина" }));

    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Атым",
    );
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Элина",
    );

    await user.click(screen.getByRole("button", { name: "Убрать Атым" }));

    expect(screen.getByTestId("sentence-builder-answer")).not.toHaveTextContent(
      "Атым",
    );
    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Элина",
    );

    await user.click(screen.getByRole("button", { name: "Очистить" }));

    expect(screen.getByTestId("sentence-builder-answer")).toHaveTextContent(
      "Нажимайте слова по порядку",
    );
  });

  it("accepts a correct sentence builder answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(sentenceBuilderExercise);

    await user.click(screen.getByRole("button", { name: "Добавить Атым" }));
    await user.click(screen.getByRole("button", { name: "Добавить Элина" }));
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Верно. Так подходит.",
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

    await user.click(screen.getByRole("button", { name: "Добавить Элина" }));
    await user.click(screen.getByRole("button", { name: "Добавить Атым" }));
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти. Проверьте порядок слов и попробуйте ещё раз.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Ответ: Атым Элина",
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

    expect(
      screen.getByText("Сопоставьте кыргызские фразы с их значениями."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("match-pairs-empty")).toHaveTextContent(
      "Нажмите элементы, чтобы соединить пару",
    );

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "Меня зовут ..." }));

    expect(screen.getByTestId("match-pairs-selected")).toHaveTextContent(
      "Атым ... → Меня зовут ...",
    );

    await user.click(screen.getByRole("button", { name: "Сбросить" }));

    expect(screen.getByTestId("match-pairs-empty")).toHaveTextContent(
      "Нажмите элементы, чтобы соединить пару",
    );
  });

  it("accepts correct match pairs", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(matchPairsExercise);

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "Меня зовут ..." }));
    await user.click(screen.getByRole("button", { name: "Атың ким?" }));
    await user.click(screen.getByRole("button", { name: "Как тебя зовут?" }));
    await user.click(screen.getByRole("button", { name: "Сенчи?" }));
    await user.click(screen.getByRole("button", { name: "А ты?" }));
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Верно. Эти пары совпадают.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer:
          "left-atym:right-my-name|left-atyn-kim:right-your-name|left-senchi:right-and-you",
        answerDisplay:
          "Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?",
        correct: true,
        correctAnswerDisplay:
          "Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?",
        exerciseId: "ex-intro-match",
        itemId: "item-intro-pairs",
      }),
    );
  });

  it("shows the correct pairs after incorrect match pairs", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(matchPairsExercise);

    await user.click(screen.getByRole("button", { name: "Атым ..." }));
    await user.click(screen.getByRole("button", { name: "А ты?" }));
    await user.click(screen.getByRole("button", { name: "Атың ким?" }));
    await user.click(screen.getByRole("button", { name: "Как тебя зовут?" }));
    await user.click(screen.getByRole("button", { name: "Сенчи?" }));
    await user.click(screen.getByRole("button", { name: "Меня зовут ..." }));
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти. Проверьте пары и попробуйте ещё раз.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Ответ: Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer:
          "left-atym:right-and-you|left-atyn-kim:right-your-name|left-senchi:right-my-name",
        correct: false,
      }),
    );
  });

  it("renders error correction with the incorrect Kyrgyz phrase and input", () => {
    renderExercise(errorCorrectionExercise);

    expect(screen.getByText("Исправьте фразу")).toBeInTheDocument();
    expect(screen.getByTestId("error-correction-source")).toHaveTextContent(
      "Атым ким?",
    );
    expect(screen.getByLabelText("Правильный вариант")).toBeInTheDocument();
  });

  it("accepts a correct error correction answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(errorCorrectionExercise);

    await user.type(screen.getByLabelText("Правильный вариант"), "  атың ким? ");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Верно. Вы исправили фразу.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Атым значит мое имя. Атың значит твое имя.",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "атың ким?",
        answerDisplay: "атың ким?",
        correct: true,
        correctAnswerDisplay: "Атың ким?",
        exerciseId: "ex-name-correction",
        itemId: "item-correct-atyn-kim",
      }),
    );
  });

  it("shows the correct version after an incorrect error correction answer", async () => {
    const user = userEvent.setup();
    const { onAttempt } = renderExercise(errorCorrectionExercise);

    await user.type(screen.getByLabelText("Правильный вариант"), "Атым ким?");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Почти. Посмотрите на окончание.",
    );
    expect(screen.getByTestId("exercise-feedback")).toHaveTextContent(
      "Правильный вариант: Атың ким?",
    );
    expect(onAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "Атым ким?",
        correct: false,
      }),
    );
  });

  it("renders a clean fallback for unsupported exercise types", () => {
    renderExercise({
      ...multipleChoiceExercise,
      kind: "listening_choice",
    });

    expect(screen.getByTestId("unsupported-exercise")).toHaveTextContent(
      "Этот формат скоро появится",
    );
    expect(screen.getByTestId("unsupported-exercise").textContent).not.toMatch(
      /schema|unsupported|methodist|source/i,
    );
  });
});
