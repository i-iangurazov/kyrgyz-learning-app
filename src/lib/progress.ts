export type LessonProgressStatus = "not-started" | "in-progress" | "complete";

export type ExerciseAttempt = {
  lessonId: string;
  exerciseId: string;
  itemId: string;
  answer: string;
  attempted: boolean;
  completed: boolean;
  correct: boolean;
  attempts: number;
  updatedAt: string;
};

export type LessonPracticeProgress = {
  attemptedCount: number;
  completedCount: number;
  correctCount: number;
  incorrectCount: number;
};

export type LocalProgress = {
  activeLessonId: string;
  streakDays: number;
  xp: number;
  completedLessonIds: string[];
  lessonStatus: Record<string, LessonProgressStatus>;
  exerciseAttempts: Record<string, ExerciseAttempt>;
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
  lessonPractice: {},
};

export const progressStorageKey = "kyrgyz-learning-progress-v1";

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
): LessonPracticeProgress {
  const attempts = Object.values(exerciseAttempts).filter(
    (attempt) => attempt.lessonId === lessonId,
  );

  return {
    attemptedCount: attempts.filter((attempt) => attempt.attempted).length,
    completedCount: attempts.filter((attempt) => attempt.completed).length,
    correctCount: attempts.filter((attempt) => attempt.correct).length,
    incorrectCount: attempts.filter(
      (attempt) => attempt.completed && !attempt.correct,
    ).length,
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
