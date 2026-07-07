export type LessonProgressStatus = "not-started" | "in-progress" | "complete";

export type LocalProgress = {
  activeLessonId: string;
  streakDays: number;
  xp: number;
  completedLessonIds: string[];
  lessonStatus: Record<string, LessonProgressStatus>;
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
};

export const progressStorageKey = "kyrgyz-learning-progress-v1";

export function calculateLessonCompletion(
  completedLessonIds: string[],
  totalLessons: number,
) {
  if (totalLessons === 0) {
    return 0;
  }

  return Math.round((completedLessonIds.length / totalLessons) * 100);
}
