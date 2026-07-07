"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BookOpen, CheckCircle2, Dumbbell, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocalProgress } from "@/hooks/use-local-progress";
import {
  getPracticeSummary,
  getReviewQueue,
  type ReviewQueueItem,
} from "@/lib/progress";

type LessonSummary = {
  id: string;
  title: string;
  levelId: string;
};

type PracticeReviewQueueProps = {
  lessons: LessonSummary[];
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

export function PracticeReviewQueue({ lessons }: PracticeReviewQueueProps) {
  const { progress } = useLocalProgress();
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
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold tracking-normal">
            {summary.missedItemsCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Missed items
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold tracking-normal">
            {summary.needsReviewCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Needs review
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
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

          {Object.entries(groupedQueue).map(([lessonId, items]) => {
            const lesson = lessonById.get(lessonId);

            return (
              <div className="space-y-3" data-testid="review-queue-group" key={lessonId}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {lesson?.title ?? "Lesson review"}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {lesson?.levelId ?? "Lesson"} - {items.length}{" "}
                      {pluralize(items.length, "item", "items")}
                    </p>
                  </div>
                </div>

                {items.map((item) => (
                  <Card
                    className={
                      item.corrected
                        ? "border-[#b8dfc8] bg-[#f7fbf8]"
                        : "border-[#ead1cf] bg-[#fffaf8]"
                    }
                    data-testid="review-queue-item"
                    key={item.key}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle>
                            {item.corrected ? "Corrected" : "Missed item"}
                          </CardTitle>
                          <CardDescription>
                            {item.corrected
                              ? "Good work. Keep this one warm."
                              : "A quick review will help this stick."}
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
                          <p className="mt-1 font-semibold">
                            {item.submittedAnswerDisplay}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Answer to remember
                          </p>
                          <p className="mt-1 font-semibold">
                            {item.correctAnswerDisplay}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.explanation || item.feedback}
                      </p>

                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/lesson/${item.lessonId}#lesson-practice`}>
                          <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          {item.corrected ? "Review again" : "Review in lesson"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
