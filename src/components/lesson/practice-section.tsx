"use client";

import { CheckCircle2 } from "lucide-react";

import {
  ExerciseRenderer,
  type ExerciseAttemptPayload,
} from "@/components/lesson/exercise-renderer";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/schemas";
import {
  emptyLessonPracticeProgress,
  type ExerciseAttempt,
  getExerciseAttemptKey,
  type LessonPracticeProgress,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

type Exercise = Lesson["exercises"][number];

const supportedExerciseKinds = ["multiple_choice", "fill_blank"] as const;

function isSupportedExercise(exercise: Exercise) {
  return supportedExerciseKinds.some((kind) => kind === exercise.kind);
}

export function getSupportedPracticeItemCount(exercises: Exercise[]) {
  return exercises
    .filter(isSupportedExercise)
    .reduce((count, exercise) => count + exercise.items.length, 0);
}

type PracticeSectionProps = {
  lessonId: string;
  exercises: Exercise[];
  exerciseAttempts: Record<string, ExerciseAttempt>;
  practiceProgress?: LessonPracticeProgress;
  onAttempt: (attempt: ExerciseAttemptPayload) => void;
  nextSectionId?: string;
};

export function PracticeSection({
  lessonId,
  exercises,
  exerciseAttempts,
  practiceProgress = emptyLessonPracticeProgress,
  onAttempt,
  nextSectionId = "lesson-game",
}: PracticeSectionProps) {
  const supportedItems = exercises
    .filter(isSupportedExercise)
    .flatMap((exercise) =>
      exercise.items.map((item) => ({
        exerciseId: exercise.id,
        itemId: item.id,
        attemptKey: getExerciseAttemptKey(lessonId, exercise.id, item.id),
      })),
    );
  const totalSupportedItems = supportedItems.length;
  const completedSupportedItems = supportedItems.filter(
    (item) => exerciseAttempts[item.attemptKey]?.completed,
  );
  const correctSupportedCount = completedSupportedItems.filter(
    (item) => exerciseAttempts[item.attemptKey]?.correct,
  ).length;
  const completedCount = completedSupportedItems.length;
  const activeStep = Math.min(
    completedCount + 1,
    Math.max(totalSupportedItems, 1),
  );
  const practiceComplete =
    totalSupportedItems > 0 && completedCount >= totalSupportedItems;
  const progressPercent =
    totalSupportedItems > 0
      ? Math.round((completedCount / totalSupportedItems) * 100)
      : 0;
  const statusCopy = practiceComplete
    ? "Practice complete"
    : totalSupportedItems === 0
      ? "Practice activities are being prepared"
      : completedCount > 0
        ? "Nice - keep going"
        : "Take it one item at a time";

  const handleContinue = () => {
    const nextSection = document.getElementById(nextSectionId);

    nextSection?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    nextSection?.setAttribute("tabindex", "-1");
    nextSection?.focus({ preventScroll: true });
  };

  return (
    <div className="space-y-5" data-testid="practice-section">
      <div
        className="rounded-lg border border-[#d9e5dd] bg-[#f6faf5] p-4"
        data-testid="practice-progress"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {practiceComplete ? "Practice complete" : null}
              {!practiceComplete && totalSupportedItems > 0
                ? `Practice ${activeStep} of ${totalSupportedItems}`
                : null}
              {!practiceComplete && totalSupportedItems === 0 ? "Practice" : null}
            </p>
            <p className="mt-1 text-sm font-semibold">{statusCopy}</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#27645a] shadow-sm">
            {completedCount} completed
          </div>
        </div>

        <div
          aria-label="Practice progress"
          aria-valuemax={totalSupportedItems}
          aria-valuemin={0}
          aria-valuenow={completedCount}
          className="mt-4 h-2 overflow-hidden rounded-full bg-[#dce8df]"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-[#27645a] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          {supportedItems.map((item, index) => {
            const isCompleted = Boolean(exerciseAttempts[item.attemptKey]?.completed);
            const isCurrent = !practiceComplete && index === completedCount;

            return (
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border transition",
                  isCompleted && "border-[#27645a] bg-[#27645a]",
                  isCurrent && "border-[#27645a] bg-white",
                  !isCompleted && !isCurrent && "border-[#b6c7bd] bg-white",
                )}
                data-testid="practice-progress-dot"
                key={`${item.exerciseId}-${item.itemId}`}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        {exercises.map((exercise) => (
          <ExerciseRenderer
            exercise={exercise}
            key={exercise.id}
            lessonId={lessonId}
            onAttempt={(attempt) =>
              onAttempt({
                ...attempt,
                totalPracticeItems: totalSupportedItems,
              })
            }
          />
        ))}
      </div>

      {practiceComplete ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-[#b8dfc8] bg-[#f1faf4] p-4"
          data-testid="practice-complete"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#2b8a68]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                You&apos;re ready for the next step
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {correctSupportedCount} of {totalSupportedItems} answers correct.
                Keep the phrase fresh as you move on.
              </p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            data-testid="practice-continue"
            onClick={handleContinue}
            type="button"
          >
            Continue
          </Button>
        </div>
      ) : null}

      {practiceProgress.practiceComplete && !practiceComplete ? (
        <p className="text-xs text-muted-foreground">
          Your earlier practice is saved. Finish the current items to refresh this
          lesson.
        </p>
      ) : null}
    </div>
  );
}
