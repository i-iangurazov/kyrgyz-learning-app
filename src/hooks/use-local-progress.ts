"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type LocalProgress,
  defaultProgress,
  getExerciseAttemptKey,
  progressStorageKey,
  summarizeLessonPractice,
} from "@/lib/progress";

function mergeStoredProgress(stored: Partial<LocalProgress>): LocalProgress {
  return {
    ...defaultProgress,
    ...stored,
    lessonStatus: {
      ...defaultProgress.lessonStatus,
      ...(stored.lessonStatus ?? {}),
    },
    exerciseAttempts: stored.exerciseAttempts ?? {},
    lessonPractice: stored.lessonPractice ?? {},
  };
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(defaultProgress);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(progressStorageKey);
      if (stored) {
        setProgress(mergeStoredProgress(JSON.parse(stored)));
      }
    } catch {
      setProgress(defaultProgress);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [progress]);

  return useMemo(
    () => ({
      progress,
      markLessonComplete: (lessonId: string) => {
        setProgress((current) => {
          const completed = new Set(current.completedLessonIds);
          completed.add(lessonId);

          return {
            ...current,
            xp: current.xp + 20,
            completedLessonIds: Array.from(completed),
            lessonStatus: {
              ...current.lessonStatus,
              [lessonId]: "complete",
            },
          };
        });
      },
      setActiveLesson: (lessonId: string) => {
        setProgress((current) => ({
          ...current,
          activeLessonId: lessonId,
          lessonStatus: {
            ...current.lessonStatus,
            [lessonId]:
              current.lessonStatus[lessonId] === "complete"
                ? "complete"
                : "in-progress",
          },
        }));
      },
      recordExerciseAttempt: ({
        lessonId,
        exerciseId,
        itemId,
        answer,
        correct,
      }: {
        lessonId: string;
        exerciseId: string;
        itemId: string;
        answer: string;
        correct: boolean;
      }) => {
        setProgress((current) => {
          const attemptKey = getExerciseAttemptKey(lessonId, exerciseId, itemId);
          const previousAttempt = current.exerciseAttempts[attemptKey];
          const exerciseAttempts = {
            ...current.exerciseAttempts,
            [attemptKey]: {
              lessonId,
              exerciseId,
              itemId,
              answer,
              attempted: true,
              completed: true,
              correct,
              attempts: (previousAttempt?.attempts ?? 0) + 1,
              updatedAt: new Date().toISOString(),
            },
          };

          return {
            ...current,
            exerciseAttempts,
            lessonPractice: {
              ...current.lessonPractice,
              [lessonId]: summarizeLessonPractice(exerciseAttempts, lessonId),
            },
            lessonStatus: {
              ...current.lessonStatus,
              [lessonId]:
                current.lessonStatus[lessonId] === "complete"
                  ? "complete"
                  : "in-progress",
            },
          };
        });
      },
    }),
    [progress],
  );
}
