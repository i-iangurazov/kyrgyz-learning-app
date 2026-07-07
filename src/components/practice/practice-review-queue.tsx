"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Dumbbell, RotateCcw } from "lucide-react";

import { MatchPairsControl } from "@/components/lesson/match-pairs-control";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lesson } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";
import {
  findExerciseItem,
  getCorrectAnswerText,
  getOptionDisplayText,
  getSelectedAnswerText,
  isCorrectOption,
  isCorrectSentenceBuilder,
  isCorrectTextAnswer,
  type Exercise,
  type ExerciseItem,
} from "@/lib/exercise-checking";
import {
  getPracticeSummary,
  getReviewQueue,
  type ReviewQueueItem,
} from "@/lib/progress";

type PracticeReviewQueueProps = {
  lessons: Lesson[];
};

type RetryFeedback = {
  kind: "correct" | "incorrect";
  message: string;
};

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

function groupQueueByLesson(queue: ReviewQueueItem[]) {
  return queue.reduce<Record<string, ReviewQueueItem[]>>((groups, item) => {
    return {
      ...groups,
      [item.lessonId]: [...(groups[item.lessonId] ?? []), item],
    };
  }, {});
}

function canRetryDirectly(exercise?: Exercise, item?: ExerciseItem) {
  if (!exercise || !item) {
    return false;
  }

  if (exercise.kind === "multiple_choice") {
    return Boolean(item.options?.length);
  }

  if (exercise.kind === "sentence_builder") {
    return Boolean(item.options?.length);
  }

  if (exercise.kind === "match_pairs") {
    return Boolean(item.options?.length);
  }

  return exercise.kind === "fill_blank";
}

function ReviewQueueCard({
  item,
  exercise,
  exerciseItem,
  onRetry,
}: {
  item: ReviewQueueItem;
  exercise?: Exercise;
  exerciseItem?: ExerciseItem;
  onRetry: (attempt: {
    lessonId: string;
    exerciseId: string;
    itemId: string;
    answer: string;
    answerDisplay?: string;
    correct: boolean;
  }) => void;
}) {
  const [isRetryOpen, setIsRetryOpen] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [selectedSentenceTiles, setSelectedSentenceTiles] = useState<string[]>([]);
  const [retryFeedback, setRetryFeedback] = useState<RetryFeedback | null>(null);
  const supportsDirectRetry = canRetryDirectly(exercise, exerciseItem);
  const correctAnswerText =
    item.correctAnswerDisplay ||
    (exerciseItem ? getCorrectAnswerText(exerciseItem) : "");

  const submitRetry = (answer: string, answerDisplay: string, correct: boolean) => {
    onRetry({
      lessonId: item.lessonId,
      exerciseId: item.exerciseId,
      itemId: item.itemId,
      answer,
      answerDisplay,
      correct,
    });

    if (!correct) {
      setRetryFeedback({
        kind: "incorrect",
        message: "Not quite yet. Use the answer above and try once more.",
      });
      return;
    }

    setRetryFeedback({
      kind: "correct",
      message: "Nice - corrected",
    });
    setDraftAnswer("");
    setSelectedSentenceTiles([]);
  };

  const handleFillBlankRetry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!exerciseItem) {
      return;
    }

    const trimmedAnswer = draftAnswer.trim();

    if (!trimmedAnswer) {
      return;
    }

    submitRetry(
      trimmedAnswer,
      trimmedAnswer,
      isCorrectTextAnswer(exerciseItem, trimmedAnswer),
    );
  };

  const handleSentenceBuilderRetry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!exerciseItem || selectedSentenceTiles.length === 0) {
      return;
    }

    submitRetry(
      selectedSentenceTiles.join(" "),
      getSelectedAnswerText(exerciseItem, selectedSentenceTiles),
      isCorrectSentenceBuilder(exerciseItem, selectedSentenceTiles),
    );
  };

  return (
    <Card
      className={
        item.corrected
          ? "border-[#b8dfc8] bg-[#f7fbf8]"
          : "border-[#ead1cf] bg-[#fffaf8]"
      }
      data-testid="review-queue-item"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{item.corrected ? "Corrected" : "Missed item"}</CardTitle>
            <CardDescription>
              {item.corrected
                ? "You fixed this one."
                : "A quick retry will help this stick."}
            </CardDescription>
          </div>
          <Badge variant={item.corrected ? "secondary" : "warning"}>
            {item.corrected ? "Corrected" : "Needs review"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Your answer
            </p>
            <p className="mt-1 font-semibold">{item.submittedAnswerDisplay}</p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Answer to remember
            </p>
            <p className="mt-1 font-semibold">{correctAnswerText}</p>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {item.explanation || item.feedback}
        </p>

        {item.corrected ? (
          <div
            className="rounded-lg border border-[#b8dfc8] bg-white p-3"
            data-testid="review-queue-corrected-state"
            role="status"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[#2b8a68]"
              />
              <div>
                <p className="text-sm font-semibold">Nice - corrected</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  You fixed this one. Keep going.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!item.corrected && supportsDirectRetry && !isRetryOpen ? (
          <Button
            className="w-full"
            data-testid="review-try-again"
            onClick={() => setIsRetryOpen(true)}
            type="button"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        ) : null}

        {!item.corrected && supportsDirectRetry && isRetryOpen && exerciseItem ? (
          <div
            className="space-y-3 rounded-lg border border-[#f0dcd6] bg-white p-3"
            data-testid="review-queue-retry"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Try again
              </p>
              <p className="mt-1 text-sm font-semibold">
                {exerciseItem.question.en}
              </p>
            </div>

            {exercise?.kind === "multiple_choice" && exerciseItem.options?.length ? (
              <div className="grid gap-2">
                {exerciseItem.options.map((option) => (
                  <button
                    className="flex min-h-11 w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium transition hover:bg-accent"
                    key={option.id}
                    onClick={() =>
                      submitRetry(
                        option.id,
                        option.text.en,
                        isCorrectOption(exerciseItem, option),
                      )
                    }
                    type="button"
                  >
                    <span>{option.text.en}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {exercise?.kind === "fill_blank" ? (
              <form className="space-y-3" onSubmit={handleFillBlankRetry}>
                <label
                  className="block text-sm font-semibold"
                  htmlFor={`review-retry-${item.key}`}
                >
                  Try the answer again
                </label>
                <input
                  className="min-h-12 w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-medium outline-none transition focus:border-[#27645a] focus:ring-2 focus:ring-[#27645a]/18"
                  id={`review-retry-${item.key}`}
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

            {exercise?.kind === "sentence_builder" && exerciseItem.options?.length ? (
              <form className="space-y-3" onSubmit={handleSentenceBuilderRetry}>
                <div>
                  <p className="text-sm font-semibold">Build the sentence</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Tap the words in order.
                  </p>
                </div>
                <div
                  className="min-h-14 rounded-lg border border-dashed border-[#b6c6bf] bg-[#fbfcfa] p-3"
                  data-testid="review-sentence-builder-answer"
                >
                  {selectedSentenceTiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSentenceTiles.map((optionId, index) => {
                        const option = exerciseItem.options?.find(
                          (candidate) => candidate.id === optionId,
                        );
                        const optionText = option
                          ? getOptionDisplayText(option)
                          : optionId;

                        return (
                          <button
                            aria-label={`Remove ${optionText}`}
                            className="min-h-10 rounded-full bg-[#27645a] px-3 py-2 text-sm font-semibold text-white"
                            key={`${optionId}-${index}`}
                            onClick={() =>
                              setSelectedSentenceTiles((current) =>
                                current.filter(
                                  (_value, tileIndex) => tileIndex !== index,
                                ),
                              )
                            }
                            type="button"
                          >
                            {optionText}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">
                      Tap the words in order
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {exerciseItem.options.map((option) => {
                    const optionText = getOptionDisplayText(option);

                    return (
                      <button
                        aria-label={`Add ${optionText}`}
                        className="min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground"
                        disabled={selectedSentenceTiles.includes(option.id)}
                        key={option.id}
                        onClick={() =>
                          setSelectedSentenceTiles((current) => [
                            ...current,
                            option.id,
                          ])
                        }
                        type="button"
                      >
                        {optionText}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Button
                    className="w-full"
                    disabled={selectedSentenceTiles.length === 0}
                    type="submit"
                  >
                    Try again
                  </Button>
                  <Button
                    disabled={selectedSentenceTiles.length === 0}
                    onClick={() => setSelectedSentenceTiles([])}
                    type="button"
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            ) : null}

            {exercise?.kind === "match_pairs" ? (
              <MatchPairsControl
                item={exerciseItem}
                onSubmit={({ answer, answerDisplay, correct }) =>
                  submitRetry(answer, answerDisplay, correct)
                }
                submitLabel="Try again"
              />
            ) : null}
          </div>
        ) : null}

        {retryFeedback && !item.corrected ? (
          <p
            className={
              retryFeedback.kind === "correct"
                ? "rounded-lg bg-[#f1faf4] p-3 text-sm font-medium text-[#1e5c49]"
                : "rounded-lg bg-[#fff4f1] p-3 text-sm font-medium text-[#87352f]"
            }
            data-testid="review-retry-feedback"
            role="status"
          >
            {retryFeedback.message}
          </p>
        ) : null}

        {!item.corrected && !supportsDirectRetry ? (
          <div
            className="space-y-3 rounded-lg border border-dashed border-[#b6c6bf] bg-white p-3"
            data-testid="review-queue-lesson-fallback"
          >
            <p className="text-sm font-semibold">Open the lesson to review this item</p>
            <p className="text-sm leading-6 text-muted-foreground">
              This review works best inside the lesson for now.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/lesson/${item.lessonId}#lesson-practice`}>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Open lesson
              </Link>
            </Button>
          </div>
        ) : null}

        {item.corrected ? (
          <Button asChild className="w-full" variant="outline">
            <Link href={`/lesson/${item.lessonId}#lesson-practice`}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Review in lesson
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PracticeReviewQueue({ lessons }: PracticeReviewQueueProps) {
  const { progress, recordMissedRetry } = useLocalProgress();
  const summary = getPracticeSummary(progress);
  const queue = getReviewQueue(progress);
  const groupedQueue = groupQueueByLesson(queue);
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // Test environments may not implement scrolling.
    }
  }, []);

  return (
    <div className="space-y-5" data-testid="practice-review-page">
      <section className="rounded-lg bg-[#16231f] p-5 text-white">
        <Dumbbell className="h-7 w-7 text-[#c9f269]" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/56">
          Practice
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-normal">
          Review your weak spots
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/72">
          Keep recent misses fresh with short, focused review.
        </p>
      </section>

      <section
        aria-label="Practice progress summary"
        className="grid grid-cols-2 gap-3"
        data-testid="practice-progress-summary"
      >
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold tracking-normal">
            {summary.completedPracticeItems}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Completed
          </p>
        </div>
        <div
          className="rounded-lg border border-border bg-card p-4"
          data-testid="practice-summary-missed"
        >
          <p className="text-2xl font-bold tracking-normal">
            {summary.missedItemsCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Missed items
          </p>
        </div>
        <div
          className="rounded-lg border border-border bg-card p-4"
          data-testid="practice-summary-needs-review"
        >
          <p className="text-2xl font-bold tracking-normal">
            {summary.needsReviewCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Needs review
          </p>
        </div>
        <div
          className="rounded-lg border border-border bg-card p-4"
          data-testid="practice-summary-corrected"
        >
          <p className="text-2xl font-bold tracking-normal">
            {summary.correctedMissedItemsCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Corrected
          </p>
        </div>
      </section>

      {queue.length === 0 ? (
        <Card data-testid="review-queue-empty">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7f1] text-[#27645a]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>Nothing to review yet</CardTitle>
            <CardDescription>
              You&apos;re all clear for now. Complete a lesson and anything you
              miss will appear here for quick review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/learn">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Go to Learn
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-4" data-testid="review-queue">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Review queue
              </p>
              <h3 className="mt-1 text-lg font-bold tracking-normal">
                Keep it fresh
              </h3>
            </div>
            <Badge variant={summary.needsReviewCount > 0 ? "warning" : "secondary"}>
              {summary.needsReviewCount}{" "}
              {pluralize(summary.needsReviewCount, "item", "items")} open
            </Badge>
          </div>

          {summary.needsReviewCount === 0 ? (
            <div
              className="rounded-lg border border-[#b8dfc8] bg-[#f1faf4] p-4"
              data-testid="review-queue-complete"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#2b8a68]"
                />
                <div>
                  <p className="text-sm font-semibold">Review complete</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    You fixed the current missed items. Keep going.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {Object.entries(groupedQueue).map(([lessonId, items]) => {
            const lesson = lessonById.get(lessonId);

            return (
              <div className="space-y-3" data-testid="review-queue-group" key={lessonId}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {lesson?.title.en ?? "Lesson review"}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {lesson?.levelId ?? "Lesson"} - {items.length}{" "}
                      {pluralize(items.length, "item", "items")}
                    </p>
                  </div>
                </div>

                {items.map((item) => {
                  const exerciseMatch = findExerciseItem(
                    lessons,
                    item.lessonId,
                    item.exerciseId,
                    item.itemId,
                  );

                  return (
                    <ReviewQueueCard
                      exercise={exerciseMatch?.exercise}
                      exerciseItem={exerciseMatch?.item}
                      item={item}
                      key={item.key}
                      onRetry={recordMissedRetry}
                    />
                  );
                })}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
