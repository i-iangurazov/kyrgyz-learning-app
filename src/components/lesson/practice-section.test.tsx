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

describe("PracticeSection", () => {
  it("renders multiple practice exercises with compact progress", () => {
    render(<StatefulPracticeSection />);

    expect(screen.getAllByTestId("exercise-renderer")).toHaveLength(2);
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Practice 1 of 2",
    );
    expect(screen.getAllByTestId("practice-progress-dot")).toHaveLength(2);
  });

  it("updates progress after completing one exercise item", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "thank you" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Practice 2 of 2",
      );
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "1 completed",
      );
    });
  });

  it("shows completion state and continue action after supported items are done", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "thank you" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "You're ready for the next step",
      );
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "2 of 2 answers correct",
      );
    });
    expect(
      within(screen.getByTestId("practice-complete")).getByRole("button", {
        name: "Continue",
      }),
    ).toBeInTheDocument();
  });

  it("shows missed review state after an incorrect answer", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "hello" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Review missed items",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "You missed 1 item",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Your answer: hello",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Answer to remember: ыраазычылык",
      );
    });
    expect(screen.queryByTestId("practice-continue")).not.toBeInTheDocument();
    expect(screen.getByTestId("practice-continue-anyway")).toBeInTheDocument();
  });

  it("marks a missed multiple choice item corrected after a correct retry", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "hello" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await user.click(
      within(screen.getByTestId("missed-review")).getByRole("button", {
        name: "thank you",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Nice - corrected",
      );
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "You corrected 1 missed answer",
      );
    });
    expect(screen.getByTestId("practice-continue")).toBeInTheDocument();
  });

  it("marks a missed fill blank item corrected after a correct retry", async () => {
    const user = userEvent.setup();
    render(<StatefulPracticeSection />);

    await user.click(screen.getByRole("button", { name: "thank you" }));
    await user.type(screen.getByLabelText("Жакшы, ___."), "салам");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Your answer: салам",
      );
    });

    await user.type(screen.getByLabelText("Try the missing word again"), "рахмат");
    await user.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Nice - corrected",
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

    expect(screen.getAllByTestId("exercise-renderer")).toHaveLength(2);
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Practice 1 of 2",
    );

    await user.type(screen.getByLabelText("___ Elina."), "Атым");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Practice 2 of 2",
      );
    });

    await user.click(screen.getByRole("button", { name: "Add Атым" }));
    await user.click(screen.getByRole("button", { name: "Add Элина" }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "2 of 2 answers correct",
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

    await user.type(screen.getByLabelText("___ Elina."), "Атым");
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "Add Элина" }));
    await user.click(screen.getByRole("button", { name: "Add Атым" }));
    await user.click(screen.getByRole("button", { name: "Check" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Review missed items",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Your answer: Элина Атым",
      );
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Answer to remember: Атым Элина",
      );
    });

    const missedReview = screen.getByTestId("missed-review");
    await user.click(within(missedReview).getByRole("button", { name: "Add Атым" }));
    await user.click(
      within(missedReview).getByRole("button", { name: "Add Элина" }),
    );
    await user.click(within(missedReview).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Nice - corrected",
      );
    });
  });

  it("keeps unsupported exercise fallback learner-friendly", () => {
    render(
      <StatefulPracticeSection
        exercises={[
          {
            ...lesson.exercises[0],
            kind: "match_pairs",
          },
        ]}
      />,
    );

    expect(screen.getByTestId("unsupported-exercise")).toHaveTextContent(
      "Practice type coming soon",
    );
    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Practice activities are being prepared",
    );
    expect(screen.getByTestId("unsupported-exercise").textContent).not.toMatch(
      /schema|unsupported|methodist|source|localStorage|exercise id/i,
    );
  });
});
