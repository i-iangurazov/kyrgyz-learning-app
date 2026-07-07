import type { CurriculumContent } from "@/content/db/curriculum-mappers";
import {
  readCurriculumFromPostgres,
  type PostgresReadOptions,
} from "@/content/db/postgres-reader";
import type { ContentRepository } from "@/content/repository";

export function createPostgresContentRepository(
  options: PostgresReadOptions = {},
): ContentRepository {
  let curriculumPromise: Promise<CurriculumContent> | undefined;

  async function loadCurriculum() {
    curriculumPromise ??= Promise.resolve(readCurriculumFromPostgres(options));
    return curriculumPromise;
  }

  return {
    async getCurriculum() {
      return loadCurriculum();
    },
    async listLevels() {
      return (await loadCurriculum()).levels;
    },
    async listUnits() {
      return (await loadCurriculum()).units;
    },
    async listLessons() {
      return (await loadCurriculum()).lessons;
    },
    async getLessonById(lessonId) {
      return (await loadCurriculum()).lessons.find(
        (lesson) => lesson.id === lessonId,
      );
    },
    async getLessonsForUnit(unitId) {
      return (await loadCurriculum()).lessons
        .filter((lesson) => lesson.unitId === unitId)
        .sort((lessonA, lessonB) => lessonA.order - lessonB.order);
    },
    async getFirstLesson() {
      return (await loadCurriculum()).lessons[0];
    },
  };
}
