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

export function calculateLessonCompletion(
  completedLessonIds: string[],
  totalLessons: number,
) {
  if (totalLessons === 0) {
    return 0;
  }

  return Math.round((completedLessonIds.length / totalLessons) * 100);
}
