import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  getSupportedPracticeItemCount,
  PracticeSection,
} from "@/components/lesson/practice-section";
import { lessons } from "@/content/curriculum";
import type { Lesson } from "@/content/schemas";
import {
  emptyLessonPracticeProgress,
  type ExerciseAttempt,
  getExerciseAttemptKey,
  type LessonPracticeProgress,
  type MissedPracticeItem,
  summarizeLessonPractice,
} from "@/lib/progress";

const lesson = lessons[0];
const k1Lesson = lessons.find((candidate) => candidate.id === "k1-u1-l1")!;
type TestUser = ReturnType<typeof userEvent.setup>;

function StatefulPracticeSection({
  exercises = lesson.exercises,
  activeLesson = lesson,
}: {
  exercises?: Lesson["exercises"];
  activeLesson?: Lesson;
}) {
  const totalCount = getSupportedPracticeItemCount(exercises);
  const [state, setState] = useState<{
    exerciseAttempts: Record<string, ExerciseAttempt>;
    missedPractice: Record<string, MissedPracticeItem>;
    practiceProgress: LessonPracticeProgress;
  }>({
    exerciseAttempts: {},
    missedPractice: {},
    practiceProgress: {
      ...emptyLessonPracticeProgress,
      totalCount,
    },
  });

  return (
    <>
      <PracticeSection
        exerciseAttempts={state.exerciseAttempts}
        exercises={exercises}
        lessonId={activeLesson.id}
        missedPractice={state.missedPractice}
        onAttempt={(attempt) => {
          setState((current) => {
            const attemptKey = getExerciseAttemptKey(
              attempt.lessonId,
              attempt.exerciseId,
              attempt.itemId,
            );
            const nextAttempts = {
              ...current.exerciseAttempts,
              [attemptKey]: {
                lessonId: attempt.lessonId,
                exerciseId: attempt.exerciseId,
                itemId: attempt.itemId,
                answer: attempt.answer,
                answerDisplay: attempt.answerDisplay ?? attempt.answer,
                attempted: true,
                completed: true,
                correct: attempt.correct,
                attempts:
                  (current.exerciseAttempts[attemptKey]?.attempts ?? 0) + 1,
                updatedAt: "2026-07-08T00:00:00.000Z",
              },
            };
            const nextMissed = {
              ...current.missedPractice,
            };

            if (!attempt.correct) {
              nextMissed[attemptKey] = {
                lessonId: attempt.lessonId,
                exerciseId: attempt.exerciseId,
                itemId: attempt.itemId,
                submittedAnswer: attempt.answer,
                submittedAnswerDisplay: attempt.answerDisplay ?? attempt.answer,
                correctAnswerDisplay: attempt.correctAnswerDisplay ?? "",
                explanation: attempt.explanation ?? "",
                feedback: attempt.feedback ?? "",
                corrected: false,
                retryAttempts: 0,
                updatedAt: "2026-07-08T00:00:00.000Z",
              };
            }

            return {
              exerciseAttempts: nextAttempts,
              missedPractice: nextMissed,
              practiceProgress: summarizeLessonPractice(
                nextAttempts,
                activeLesson.id,
                attempt.totalPracticeItems ?? 0,
                nextMissed,
              ),
            };
          });
        }}
        onMissedRetry={(attempt) => {
          setState((current) => {
            const attemptKey = getExerciseAttemptKey(
              attempt.lessonId,
              attempt.exerciseId,
              attempt.itemId,
            );
            const missedItem = current.missedPractice[attemptKey];

            if (!missedItem) {
              return current;
            }

            const nextMissed = {
              ...current.missedPractice,
              [attemptKey]: {
                ...missedItem,
                corrected: missedItem.corrected || attempt.correct,
                retryAnswer: attempt.answer,
                retryAnswerDisplay: attempt.answerDisplay ?? attempt.answer,
                retryAttempts: missedItem.retryAttempts + 1,
                updatedAt: "2026-07-08T00:00:00.000Z",
              },
            };

            return {
              ...current,
              missedPractice: nextMissed,
              practiceProgress: summarizeLessonPractice(
                current.exerciseAttempts,
                activeLesson.id,
                current.practiceProgress.totalCount,
                nextMissed,
              ),
            };
          });
        }}
        practiceProgress={state.practiceProgress}
      />
      <section id="lesson-game">Mini-game</section>
    </>
  );
}

async function submitK1FillBlank(user: TestUser, answer = "Атым") {
  const fillBlank = screen.getByTestId("exercise-item-item-atym");

  await user.type(within(fillBlank).getByLabelText("___ Элина."), answer);
  await user.click(
    within(fillBlank).getByRole("button", { name: "Проверить" }),
  );
}

describe("PracticeSection", () => {
  it("renders multiple practice exercises with compact progress", () => {
    render(<StatefulPracticeSection />);

    expect(screen.getAllByTestId("exercise-renderer")).toHaveLength(2);
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Практика 1 из 2",
    );
    expect(screen.getAllByTestId("practice-progress-dot")).toHaveLength(2);
  });

  it("updates progress after completing one exercise item", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "спасибо" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Практика 2 из 2",
      );
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Готово: 1",
      );
    });
  });

  it("shows completion state and continue action after supported items are done", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "спасибо" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "Можно идти дальше",
      );
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "Верно: 2 из 2",
      );
    });
    expect(
      within(screen.getByTestId("practice-complete")).getByRole("button", {
        name: "Продолжить",
      }),
    ).toBeInTheDocument();
  });

  it("shows missed review state after an incorrect answer", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "привет" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Повторить ошибки",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ошибок: 1",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ваш ответ: привет",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Правильный ответ: спасибо",
      );
    });
    expect(screen.queryByTestId("practice-continue")).not.toBeInTheDocument();
    expect(screen.getByTestId("practice-continue-anyway")).toBeInTheDocument();
  });

  it("marks a missed multiple choice item corrected after a correct retry", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "привет" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await user.click(
      within(screen.getByTestId("missed-review")).getByRole("button", {
        name: "спасибо",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено ошибок: 1",
      );
    });
    expect(screen.getByTestId("practice-continue")).toBeInTheDocument();
  });

  it("marks a missed fill blank item corrected after a correct retry", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "спасибо" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "салам");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ваш ответ: салам",
      );
    });

    const missedReview = screen.getByTestId("missed-review");
    await user.type(
      within(missedReview).getByLabelText("Введите ответ ещё раз"),
      "рахмат",
    );
    await user.click(
      within(missedReview).getByRole("button", { name: "Проверить" }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
    });
  });

  it("includes sentence builder items in guided practice progress", async () => {
    const user = userEvent.setup();
    render(
      <StatefulPracticeSection
        activeLesson={k1Lesson}
        exercises={k1Lesson.exercises}
      />,
    );

    expect(screen.getAllByTestId("exercise-renderer")).toHaveLength(4);
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Практика 1 из 4",
    );

    await submitK1FillBlank(user);

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Практика 2 из 4",
      );
    });

    const sentenceBuilder = screen.getByTestId(
      "exercise-item-item-build-atym-elina",
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Добавить Атым" }));
    await user.click(
      within(sentenceBuilder).getByRole("button", { name: "Добавить Элина" }),
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Практика 3 из 4",
      );
    });

    const matchPairs = screen.getByTestId("exercise-item-item-intro-pairs");
    await user.click(within(matchPairs).getByRole("button", { name: "Атым ..." }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Сенчи?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "А ты?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Практика 4 из 4",
      );
    });

    const errorCorrection = screen.getByTestId(
      "exercise-item-item-correct-atyn-kim",
    );
    await user.type(
      within(errorCorrection).getByLabelText("Правильный вариант"),
      "Атың ким?",
    );
    await user.click(within(errorCorrection).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "Верно: 4 из 4",
      );
    });
  });

  it("tracks and corrects a missed sentence builder answer", async () => {
    const user = userEvent.setup();
    render(
      <StatefulPracticeSection
        activeLesson={k1Lesson}
        exercises={k1Lesson.exercises}
      />,
    );

    await submitK1FillBlank(user);
    const sentenceBuilder = screen.getByTestId(
      "exercise-item-item-build-atym-elina",
    );
    await user.click(
      within(sentenceBuilder).getByRole("button", { name: "Добавить Элина" }),
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Добавить Атым" }));
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Проверить" }));

    const matchPairs = screen.getByTestId("exercise-item-item-intro-pairs");
    await user.click(within(matchPairs).getByRole("button", { name: "Атым ..." }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Сенчи?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "А ты?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "Проверить" }));

    const errorCorrection = screen.getByTestId(
      "exercise-item-item-correct-atyn-kim",
    );
    await user.type(
      within(errorCorrection).getByLabelText("Правильный вариант"),
      "Атың ким?",
    );
    await user.click(within(errorCorrection).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Повторить ошибки",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ваш ответ: Элина Атым",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Правильный ответ: Атым Элина",
      );
    });

    const missedReview = screen.getByTestId("missed-review");
    await user.click(within(missedReview).getByRole("button", { name: "Добавить Атым" }));
    await user.click(
      within(missedReview).getByRole("button", { name: "Добавить Элина" }),
    );
    await user.click(within(missedReview).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
    });
  });

  it("tracks and corrects a missed match pairs answer", async () => {
    const user = userEvent.setup();
    render(
      <StatefulPracticeSection
        activeLesson={k1Lesson}
        exercises={k1Lesson.exercises}
      />,
    );

    await submitK1FillBlank(user);
    const sentenceBuilder = screen.getByTestId(
      "exercise-item-item-build-atym-elina",
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Добавить Атым" }));
    await user.click(
      within(sentenceBuilder).getByRole("button", { name: "Добавить Элина" }),
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Проверить" }));

    const matchPairs = screen.getByTestId("exercise-item-item-intro-pairs");
    await user.click(within(matchPairs).getByRole("button", { name: "Атым ..." }));
    await user.click(within(matchPairs).getByRole("button", { name: "А ты?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Сенчи?" }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Проверить" }));

    const errorCorrection = screen.getByTestId(
      "exercise-item-item-correct-atyn-kim",
    );
    await user.type(
      within(errorCorrection).getByLabelText("Правильный вариант"),
      "Атың ким?",
    );
    await user.click(within(errorCorrection).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Повторить ошибки",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ваш ответ: Атым ... → А ты?; Атың ким? → Как тебя зовут?; Сенчи? → Меня зовут ...",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Правильный ответ: Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?",
      );
    });

    const missedReview = screen.getByTestId("missed-review");
    await user.click(within(missedReview).getByRole("button", { name: "Атым ..." }));
    await user.click(
      within(missedReview).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(
      within(missedReview).getByRole("button", { name: "Атың ким?" }),
    );
    await user.click(
      within(missedReview).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(missedReview).getByRole("button", { name: "Сенчи?" }));
    await user.click(
      within(missedReview).getByRole("button", { name: "А ты?" }),
    );
    await user.click(
      within(missedReview).getByRole("button", { name: "Проверить" }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
    });
  });

  it("tracks and corrects a missed error correction answer", async () => {
    const user = userEvent.setup();
    render(
      <StatefulPracticeSection
        activeLesson={k1Lesson}
        exercises={k1Lesson.exercises}
      />,
    );

    await submitK1FillBlank(user);
    const sentenceBuilder = screen.getByTestId(
      "exercise-item-item-build-atym-elina",
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Добавить Атым" }));
    await user.click(
      within(sentenceBuilder).getByRole("button", { name: "Добавить Элина" }),
    );
    await user.click(within(sentenceBuilder).getByRole("button", { name: "Проверить" }));

    const matchPairs = screen.getByTestId("exercise-item-item-intro-pairs");
    await user.click(within(matchPairs).getByRole("button", { name: "Атым ..." }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(matchPairs).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(matchPairs).getByRole("button", { name: "Сенчи?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "А ты?" }));
    await user.click(within(matchPairs).getByRole("button", { name: "Проверить" }));

    const errorCorrection = screen.getByTestId(
      "exercise-item-item-correct-atyn-kim",
    );
    await user.type(
      within(errorCorrection).getByLabelText("Правильный вариант"),
      "Атым ким?",
    );
    await user.click(within(errorCorrection).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Повторить ошибки",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Ваш ответ: Атым ким?",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Правильный ответ: Атың ким?",
      );
    });

    const missedReview = screen.getByTestId("missed-review");
    await user.type(
      within(missedReview).getByLabelText("Правильный вариант"),
      "Атың ким?",
    );
    await user.click(
      within(missedReview).getByRole("button", { name: "Проверить" }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
    });
  });

  it("keeps unsupported exercise fallback learner-friendly", () => {
    render(
      <StatefulPracticeSection
        exercises={[
          {
            ...lesson.exercises[0],
            kind: "listening_choice",
          },
        ]}
      />,
    );

    expect(screen.getByTestId("unsupported-exercise")).toHaveTextContent(
      "Этот формат скоро появится",
    );
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Практика готовится",
    );
    expect(screen.getByTestId("unsupported-exercise").textContent).not.toMatch(
      /schema|unsupported|methodist|source|localStorage|exercise id/i,
    );
  });
});
