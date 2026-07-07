import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PracticeSection } from "@/components/lesson/practice-section";
import { lessons } from "@/content/curriculum";
import type { Lesson } from "@/content/schemas";
import {
  emptyLessonPracticeProgress,
  type ExerciseAttempt,
  getExerciseAttemptKey,
  type LessonPracticeProgress,
  summarizeLessonPractice,
} from "@/lib/progress";

const lesson = lessons[0];

function StatefulPracticeSection({
  exercises = lesson.exercises,
}: {
  exercises?: Lesson["exercises"];
}) {
  const [exerciseAttempts, setExerciseAttempts] = useState<
    Record<string, ExerciseAttempt>
  >({});
  const [practiceProgress, setPracticeProgress] = useState<LessonPracticeProgress>({
    ...emptyLessonPracticeProgress,
    totalCount: 2,
  });

  return (
    <>
      <PracticeSection
        exerciseAttempts={exerciseAttempts}
        exercises={exercises}
        lessonId={lesson.id}
        onAttempt={(attempt) => {
          setExerciseAttempts((current) => {
            const attemptKey = getExerciseAttemptKey(
              attempt.lessonId,
              attempt.exerciseId,
              attempt.itemId,
            );
            const nextAttempts = {
              ...current,
              [attemptKey]: {
                lessonId: attempt.lessonId,
                exerciseId: attempt.exerciseId,
                itemId: attempt.itemId,
                answer: attempt.answer,
                attempted: true,
                completed: true,
                correct: attempt.correct,
                attempts: 1,
                updatedAt: "2026-07-08T00:00:00.000Z",
              },
            };

            setPracticeProgress(
              summarizeLessonPractice(
                nextAttempts,
                lesson.id,
                attempt.totalPracticeItems ?? 0,
              ),
            );

            return nextAttempts;
          });
        }}
        practiceProgress={practiceProgress}
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

  it("keeps unsupported exercise fallback learner-friendly", () => {
    render(
      <StatefulPracticeSection
        exercises={[
          {
            ...lesson.exercises[0],
            kind: "sentence_builder",
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
