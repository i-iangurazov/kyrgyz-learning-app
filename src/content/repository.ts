import type { Lesson, Level, Unit } from "@/content/schemas";
import type { CurriculumContent } from "@/content/db/curriculum-mappers";
import { createPostgresContentRepository } from "@/content/repositories/postgres-content-repository";
import { createSeedContentRepository } from "@/content/repositories/seed-content-repository";

export type ContentSource = "seed" | "postgres";

export type ContentRepository = {
  getCurriculum(): Promise<CurriculumContent>;
  listLevels(): Promise<Level[]>;
  listUnits(): Promise<Unit[]>;
  listLessons(): Promise<Lesson[]>;
  getLessonById(lessonId: string): Promise<Lesson | undefined>;
  getLessonsForUnit(unitId: string): Promise<Lesson[]>;
  getFirstLesson(): Promise<Lesson>;
};

const seedRepository = createSeedContentRepository();

export function getConfiguredContentSource(
  env: NodeJS.ProcessEnv = process.env,
): ContentSource {
  if (env.CONTENT_SOURCE === "postgres") {
    return "postgres";
  }

  return "seed";
}

export async function getCurriculumContent(): Promise<CurriculumContent> {
  return withContentFallback(
    (repository) => repository.getCurriculum(),
    "load curriculum content",
  );
}

export async function listLevels(): Promise<Level[]> {
  return withContentFallback((repository) => repository.listLevels(), "list levels");
}

export async function listUnits(): Promise<Unit[]> {
  return withContentFallback((repository) => repository.listUnits(), "list units");
}

export async function listLessons(): Promise<Lesson[]> {
  return withContentFallback((repository) => repository.listLessons(), "list lessons");
}

export async function getLessonById(
  lessonId: string,
): Promise<Lesson | undefined> {
  return withContentFallback(
    (repository) => repository.getLessonById(lessonId),
    `load lesson ${lessonId}`,
  );
}

export async function getLessonsForUnit(unitId: string): Promise<Lesson[]> {
  return withContentFallback(
    (repository) => repository.getLessonsForUnit(unitId),
    `load unit ${unitId} lessons`,
  );
}

export async function getFirstLesson(): Promise<Lesson> {
  return withContentFallback(
    (repository) => repository.getFirstLesson(),
    "load first lesson",
  );
}

async function withContentFallback<T>(
  read: (repository: ContentRepository) => Promise<T>,
  operationLabel: string,
): Promise<T> {
  if (getConfiguredContentSource() !== "postgres") {
    return read(seedRepository);
  }

  try {
    return await read(createPostgresContentRepository());
  } catch (error) {
    logContentFallbackWarning(operationLabel, error);
    return read(seedRepository);
  }
}

function logContentFallbackWarning(operationLabel: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  console.warn(
    `[content] CONTENT_SOURCE=postgres could not ${operationLabel}; using TypeScript seed content fallback. ${message}`,
  );
}
