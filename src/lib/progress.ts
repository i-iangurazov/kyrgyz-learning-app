export type LessonProgressStatus = "not-started" | "in-progress" | "complete";

export type ExerciseAttempt = {
  lessonId: string;
  exerciseId: string;
  itemId: string;
  answer: string;
  answerDisplay: string;
  attempted: boolean;
  completed: boolean;
  correct: boolean;
  attempts: number;
  updatedAt: string;
};

export type MissedPracticeItem = {
  lessonId: string;
  exerciseId: string;
  itemId: string;
  submittedAnswer: string;
  submittedAnswerDisplay: string;
  correctAnswerDisplay: string;
  explanation: string;
  feedback: string;
  corrected: boolean;
  retryAnswer?: string;
  retryAnswerDisplay?: string;
  retryAttempts: number;
  updatedAt: string;
};

export type LessonPracticeProgress = {
  totalCount: number;
  attemptedCount: number;
  completedCount: number;
  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  correctedMissedCount: number;
  practiceComplete: boolean;
  missedReviewComplete: boolean;
};

export type LocalProgress = {
  activeLessonId: string;
  streakDays: number;
  xp: number;
  completedLessonIds: string[];
  lessonStatus: Record<string, LessonProgressStatus>;
  exerciseAttempts: Record<string, ExerciseAttempt>;
  missedPractice: Record<string, MissedPracticeItem>;
  lessonPractice: Record<string, LessonPracticeProgress>;
};

export type ReviewQueueItem = MissedPracticeItem & {
  key: string;
  needsReview: boolean;
};

export type ReviewQueueFilter = "needs_review" | "corrected" | "all";

export type PracticeSummary = {
  completedPracticeItems: number;
  missedItemsCount: number;
  correctedMissedItemsCount: number;
  needsReviewCount: number;
};

export const defaultProgress: LocalProgress = {
  activeLessonId: "k0-u1-l1",
  streakDays: 2,
  xp: 120,
  completedLessonIds: [],
  lessonStatus: {
    "k0-u1-l1": "in-progress",
    "k0-u1-l2": "not-started",
    "k1-u1-l1": "not-started",
  },
  exerciseAttempts: {},
  missedPractice: {},
  lessonPractice: {},
};

export const progressStorageKey = "kyrgyz-learning-progress-v1";

export const emptyLessonPracticeProgress: LessonPracticeProgress = {
  totalCount: 0,
  attemptedCount: 0,
  completedCount: 0,
  correctCount: 0,
  incorrectCount: 0,
  missedCount: 0,
  correctedMissedCount: 0,
  practiceComplete: false,
  missedReviewComplete: false,
};

export function getExerciseAttemptKey(
  lessonId: string,
  exerciseId: string,
  itemId: string,
) {
  return `${lessonId}:${exerciseId}:${itemId}`;
}

export function summarizeLessonPractice(
  exerciseAttempts: Record<string, ExerciseAttempt>,
  lessonId: string,
  totalCount = 0,
  missedPractice: Record<string, MissedPracticeItem> = {},
): LessonPracticeProgress {
  const attempts = Object.values(exerciseAttempts).filter(
    (attempt) => attempt.lessonId === lessonId,
  );
  const missedItems = Object.values(missedPractice).filter(
    (item) => item.lessonId === lessonId,
  );
  const completedCount = attempts.filter((attempt) => attempt.completed).length;
  const missedCount = missedItems.length;
  const correctedMissedCount = missedItems.filter((item) => item.corrected).length;

  return {
    totalCount,
    attemptedCount: attempts.filter((attempt) => attempt.attempted).length,
    completedCount,
    correctCount: attempts.filter((attempt) => attempt.correct).length,
    incorrectCount: attempts.filter(
      (attempt) => attempt.completed && !attempt.correct,
    ).length,
    missedCount,
    correctedMissedCount,
    practiceComplete: totalCount > 0 && completedCount >= totalCount,
    missedReviewComplete:
      missedCount === 0 || correctedMissedCount >= missedCount,
  };
}

export function getMissedItems(progress: Pick<LocalProgress, "missedPractice">) {
  return Object.entries(progress.missedPractice)
    .map(([key, item]) => ({
      ...item,
      key,
      needsReview: !item.corrected,
    }))
    .sort((first, second) => {
      if (first.needsReview !== second.needsReview) {
        return first.needsReview ? -1 : 1;
      }

      return (
        new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      );
    });
}

export function getReviewQueue(progress: Pick<LocalProgress, "missedPractice">) {
  return getMissedItems(progress);
}

export function filterReviewQueueItems(
  queue: ReviewQueueItem[],
  filter: ReviewQueueFilter,
) {
  if (filter === "needs_review") {
    return queue.filter((item) => item.needsReview);
  }

  if (filter === "corrected") {
    return queue.filter((item) => item.corrected);
  }

  return queue;
}

export function getNeedsReviewItems(queue: ReviewQueueItem[]) {
  return filterReviewQueueItems(queue, "needs_review");
}

export function getCorrectedReviewItems(queue: ReviewQueueItem[]) {
  return filterReviewQueueItems(queue, "corrected");
}

export function getPracticeSummary(
  progress: Pick<LocalProgress, "lessonPractice" | "missedPractice">,
): PracticeSummary {
  const missedItems = getMissedItems(progress);

  return {
    completedPracticeItems: Object.values(progress.lessonPractice).reduce(
      (total, lessonPractice) => total + lessonPractice.completedCount,
      0,
    ),
    missedItemsCount: missedItems.length,
    correctedMissedItemsCount: missedItems.filter((item) => item.corrected).length,
    needsReviewCount: missedItems.filter((item) => item.needsReview).length,
  };
}

export function calculateLessonCompletion(
  completedLessonIds: string[],
  totalLessons: number,
) {
  if (totalLessons === 0) {
    return 0;
  }

  return Math.round((completedLessonIds.length / totalLessons) * 100);
}
