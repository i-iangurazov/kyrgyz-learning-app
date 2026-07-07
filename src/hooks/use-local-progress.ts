"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type LocalProgress,
  defaultProgress,
  progressStorageKey,
} from "@/lib/progress";

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(defaultProgress);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(progressStorageKey);
      if (stored) {
        setProgress({ ...defaultProgress, ...JSON.parse(stored) });
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
    }),
    [progress],
  );
}
