"use client";

import { FormEvent, type Ref, useEffect, useRef, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import {
  ExerciseRenderer,
  type ExerciseAttemptPayload,
} from "@/components/lesson/exercise-renderer";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/schemas";
import {
  getCorrectAnswerText,
  isCorrectOption,
  isCorrectTextAnswer,
} from "@/lib/exercise-checking";
import {
  emptyLessonPracticeProgress,
  type ExerciseAttempt,
  getExerciseAttemptKey,
  type LessonPracticeProgress,
  type MissedPracticeItem,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

type Exercise = Lesson["exercises"][number];
type ExerciseItem = Exercise["items"][number];
type ExerciseOption = NonNullable<ExerciseItem["options"]>[number];

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
  missedPractice: Record<string, MissedPracticeItem>;
  practiceProgress?: LessonPracticeProgress;
  onAttempt: (attempt: ExerciseAttemptPayload) => void;
  onMissedRetry: (attempt: {
    lessonId: string;
    exerciseId: string;
    itemId: string;
    answer: string;
    answerDisplay?: string;
    correct: boolean;
  }) => void;
  nextSectionId?: string;
};

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

function MissedRetryCard({
  exercise,
  item,
  lessonId,
  missedItem,
  onContinue,
  onRetry,
  reviewRef,
  remainingCount,
  totalMissedCount,
}: {
  exercise: Exercise;
  item: ExerciseItem;
  lessonId: string;
  missedItem: MissedPracticeItem;
  onContinue: () => void;
  onRetry: PracticeSectionProps["onMissedRetry"];
  reviewRef?: Ref<HTMLDivElement>;
  remainingCount: number;
  totalMissedCount: number;
}) {
  const [draftAnswer, setDraftAnswer] = useState("");
  const [retryFeedback, setRetryFeedback] = useState("");

  const submitRetry = (answer: string, answerDisplay: string, correct: boolean) => {
    onRetry({
      lessonId,
      exerciseId: exercise.id,
      itemId: item.id,
      answer,
      answerDisplay,
      correct,
    });

    if (!correct) {
      setRetryFeedback("Not quite yet. Use the lesson answer and try once more.");
      return;
    }

    setRetryFeedback("");
    setDraftAnswer("");
  };

  const handleFillBlankRetry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedAnswer = draftAnswer.trim();

    if (!trimmedAnswer) {
      return;
    }

    submitRetry(trimmedAnswer, trimmedAnswer, isCorrectTextAnswer(item, trimmedAnswer));
  };

  return (
    <div
      className="scroll-mt-36 rounded-lg border border-[#ead1cf] bg-[#fffaf8] p-4"
      data-testid="missed-review"
      ref={reviewRef}
    >
      <div className="flex items-start gap-3">
        <RotateCcw
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-[#9b5b35]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b5b35]">
            Review missed items
          </p>
          <h3 className="mt-1 text-base font-semibold">Let&apos;s quickly fix these</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            You missed {totalMissedCount}{" "}
            {pluralize(totalMissedCount, "item", "items")}. {remainingCount}{" "}
            {pluralize(remainingCount, "needs", "need")} a quick retry.
          </p>
          <Button
            className="mt-2 px-0 text-[#27645a] hover:bg-transparent"
            data-testid="practice-continue-anyway"
            onClick={onContinue}
            size="sm"
            type="button"
            variant="ghost"
          >
            Continue anyway
          </Button>
        </div>
      </div>

      <div
        className="mt-4 space-y-3 rounded-lg border border-[#f0dcd6] bg-white p-3"
        data-testid="missed-review-item"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Try again
          </p>
          <p className="mt-1 text-sm font-semibold">{item.question.en}</p>
        </div>
        <div className="grid gap-2 text-sm">
          <p>
            <span className="font-medium">Your answer: </span>
            <span className="text-muted-foreground">
              {missedItem.submittedAnswerDisplay}
            </span>
          </p>
          <p>
            <span className="font-medium">Answer to remember: </span>
            <span className="text-muted-foreground">
              {missedItem.correctAnswerDisplay || getCorrectAnswerText(item)}
            </span>
          </p>
          <p className="leading-6 text-muted-foreground">{missedItem.feedback}</p>
          <p className="leading-6 text-muted-foreground">{missedItem.explanation}</p>
        </div>

        {exercise.kind === "multiple_choice" && item.options?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {item.options.map((option: ExerciseOption) => (
              <button
                className="flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-background px-2 py-3 text-center text-sm font-medium transition hover:bg-accent"
                key={option.id}
                onClick={() =>
                  submitRetry(
                    option.id,
                    option.text.en,
                    isCorrectOption(item, option),
                  )
                }
                type="button"
              >
                <span>{option.text.en}</span>
              </button>
            ))}
          </div>
        ) : null}

        {exercise.kind === "fill_blank" ? (
          <form className="space-y-3" onSubmit={handleFillBlankRetry}>
            <label
              className="block text-sm font-semibold"
              htmlFor={`retry-${item.id}`}
            >
              Try the missing word again
            </label>
            <input
              className="min-h-12 w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-medium outline-none transition focus:border-[#27645a] focus:ring-2 focus:ring-[#27645a]/18"
              id={`retry-${item.id}`}
              inputMode="text"
              onChange={(event) => setDraftAnswer(event.target.value)}
              placeholder="Type the answer"
              value={draftAnswer}
            />
            <Button
              className="w-full"
              disabled={draftAnswer.trim().length === 0}
              type="submit"
            >
              Try again
            </Button>
          </form>
        ) : null}

        {retryFeedback ? (
          <p
            className="rounded-lg bg-[#fff4f1] p-3 text-sm font-medium text-[#87352f]"
            data-testid="missed-retry-feedback"
            role="status"
          >
            {retryFeedback}
          </p>
        ) : null}
      </div>

    </div>
  );
}

export function PracticeSection({
  lessonId,
  exercises,
  exerciseAttempts,
  missedPractice,
  practiceProgress = emptyLessonPracticeProgress,
  onAttempt,
  onMissedRetry,
  nextSectionId = "lesson-game",
}: PracticeSectionProps) {
  const supportedItems = exercises
    .filter(isSupportedExercise)
    .flatMap((exercise) =>
      exercise.items.map((item) => ({
        exerciseId: exercise.id,
        itemId: item.id,
        attemptKey: getExerciseAttemptKey(lessonId, exercise.id, item.id),
        exercise,
        item,
      })),
    );
  const totalSupportedItems = supportedItems.length;
  const completedSupportedItems = supportedItems.filter(
    (item) => exerciseAttempts[item.attemptKey]?.completed,
  );
  const correctSupportedCount = completedSupportedItems.filter(
    (item) => exerciseAttempts[item.attemptKey]?.correct,
  ).length;
  const missedItems: Array<
    (typeof supportedItems)[number] & { missedItem: MissedPracticeItem }
  > = [];

  for (const supportedItem of supportedItems) {
    const missedItem = missedPractice[supportedItem.attemptKey];

    if (missedItem) {
      missedItems.push({
        ...supportedItem,
        missedItem,
      });
    }
  }
  const uncorrectedMissedItems = missedItems.filter(
    (missedItem) => !missedItem.missedItem.corrected,
  );
  const correctedMissedCount = missedItems.filter(
    (missedItem) => missedItem.missedItem.corrected,
  ).length;
  const missedReviewRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!practiceComplete || uncorrectedMissedItems.length === 0) {
      return;
    }

    window.requestAnimationFrame(() => {
      missedReviewRef.current?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [practiceComplete, uncorrectedMissedItems.length]);

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

      {practiceComplete && missedItems.length === 0 ? (
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

      {practiceComplete && uncorrectedMissedItems.length > 0 ? (
        <MissedRetryCard
          exercise={uncorrectedMissedItems[0].exercise}
          item={uncorrectedMissedItems[0].item}
          lessonId={lessonId}
          missedItem={uncorrectedMissedItems[0].missedItem}
          onContinue={handleContinue}
          onRetry={onMissedRetry}
          reviewRef={missedReviewRef}
          remainingCount={uncorrectedMissedItems.length}
          totalMissedCount={missedItems.length}
        />
      ) : null}

      {practiceComplete && missedItems.length > 0 && uncorrectedMissedItems.length === 0 ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-[#b8dfc8] bg-[#f1faf4] p-4"
          data-testid="missed-corrected"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#2b8a68]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Nice - corrected</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                You corrected {correctedMissedCount}{" "}
                {pluralize(correctedMissedCount, "missed answer", "missed answers")}.
                You&apos;re ready for the next step.
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
