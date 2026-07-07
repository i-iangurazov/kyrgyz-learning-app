"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type LocalProgress,
  defaultProgress,
  emptyLessonPracticeProgress,
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
    missedPractice: stored.missedPractice ?? {},
    lessonPractice: Object.fromEntries(
      Object.entries(stored.lessonPractice ?? {}).map(
        ([lessonId, lessonPractice]) => [
          lessonId,
          {
            ...emptyLessonPracticeProgress,
            ...lessonPractice,
          },
        ],
      ),
    ),
  };
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(defaultProgress);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(progressStorageKey);
      if (stored) {
        setProgress(mergeStoredProgress(JSON.parse(stored)));
      }
    } catch {
      setProgress(defaultProgress);
    } finally {
      setHasLoadedProgress(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }

    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [hasLoadedProgress, progress]);

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
        answerDisplay,
        correct,
        correctAnswerDisplay,
        explanation,
        feedback,
        totalPracticeItems,
      }: {
        lessonId: string;
        exerciseId: string;
        itemId: string;
        answer: string;
        answerDisplay?: string;
        correct: boolean;
        correctAnswerDisplay?: string;
        explanation?: string;
        feedback?: string;
        totalPracticeItems?: number;
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
              answerDisplay: answerDisplay ?? answer,
              attempted: true,
              completed: true,
              correct,
              attempts: (previousAttempt?.attempts ?? 0) + 1,
              updatedAt: new Date().toISOString(),
            },
          };
          const missedPractice = {
            ...current.missedPractice,
          };

          if (correct && missedPractice[attemptKey]) {
            missedPractice[attemptKey] = {
              ...missedPractice[attemptKey],
              corrected: true,
              retryAnswer: answer,
              retryAnswerDisplay: answerDisplay ?? answer,
              retryAttempts: missedPractice[attemptKey].retryAttempts + 1,
              updatedAt: new Date().toISOString(),
            };
          }

          if (!correct) {
            missedPractice[attemptKey] = {
              lessonId,
              exerciseId,
              itemId,
              submittedAnswer: answer,
              submittedAnswerDisplay: answerDisplay ?? answer,
              correctAnswerDisplay: correctAnswerDisplay ?? "",
              explanation: explanation ?? "",
              feedback: feedback ?? "",
              corrected: missedPractice[attemptKey]?.corrected ?? false,
              retryAnswer: missedPractice[attemptKey]?.retryAnswer,
              retryAnswerDisplay: missedPractice[attemptKey]?.retryAnswerDisplay,
              retryAttempts: missedPractice[attemptKey]?.retryAttempts ?? 0,
              updatedAt: new Date().toISOString(),
            };
          }

          return {
            ...current,
            exerciseAttempts,
            missedPractice,
            lessonPractice: {
              ...current.lessonPractice,
              [lessonId]: summarizeLessonPractice(
                exerciseAttempts,
                lessonId,
                totalPracticeItems ??
                  current.lessonPractice[lessonId]?.totalCount ??
                  0,
                missedPractice,
              ),
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
      recordMissedRetry: ({
        lessonId,
        exerciseId,
        itemId,
        answer,
        answerDisplay,
        correct,
      }: {
        lessonId: string;
        exerciseId: string;
        itemId: string;
        answer: string;
        answerDisplay?: string;
        correct: boolean;
      }) => {
        setProgress((current) => {
          const attemptKey = getExerciseAttemptKey(lessonId, exerciseId, itemId);
          const missedItem = current.missedPractice[attemptKey];

          if (!missedItem) {
            return current;
          }

          const missedPractice = {
            ...current.missedPractice,
            [attemptKey]: {
              ...missedItem,
              corrected: missedItem.corrected || correct,
              retryAnswer: answer,
              retryAnswerDisplay: answerDisplay ?? answer,
              retryAttempts: missedItem.retryAttempts + 1,
              updatedAt: new Date().toISOString(),
            },
          };

          return {
            ...current,
            missedPractice,
            lessonPractice: {
              ...current.lessonPractice,
              [lessonId]: summarizeLessonPractice(
                current.exerciseAttempts,
                lessonId,
                current.lessonPractice[lessonId]?.totalCount ?? 0,
                missedPractice,
              ),
            },
          };
        });
      },
    }),
    [progress],
  );
}
