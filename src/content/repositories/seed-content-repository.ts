import {
  getFirstLesson as getFirstSeedLesson,
  getLessonById as getSeedLessonById,
  getLessonsForUnit as getSeedLessonsForUnit,
  lessons,
  levels,
  units,
} from "@/content/curriculum";
import type { CurriculumContent } from "@/content/db/curriculum-mappers";
import type { ContentRepository } from "@/content/repository";

export function createSeedContentRepository(): ContentRepository {
  return {
    async getCurriculum() {
      return getSeedCurriculum();
    },
    async listLevels() {
      return levels;
    },
    async listUnits() {
      return units;
    },
    async listLessons() {
      return lessons;
    },
    async getLessonById(lessonId) {
      return getSeedLessonById(lessonId);
    },
    async getLessonsForUnit(unitId) {
      return getSeedLessonsForUnit(unitId);
    },
    async getFirstLesson() {
      return getFirstSeedLesson();
    },
  };
}

function getSeedCurriculum(): CurriculumContent {
  return { levels, units, lessons };
}
