import { lessonSeedData } from "@/content/seed/lessons";
import { levelSeedData, unitSeedData } from "@/content/seed/curriculum";
import {
  type Lesson,
  type Level,
  type Unit,
  lessonSchema,
  levelSchema,
  unitSchema,
} from "@/content/schemas";

export const lessons = lessonSchema.array().parse(lessonSeedData);

export const units: Unit[] = unitSchema.array().parse(unitSeedData);

export const levels: Level[] = levelSchema.array().parse(levelSeedData);

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getLevelById(levelId: Level["id"]): Level | undefined {
  return levels.find((level) => level.id === levelId);
}

export function getFirstLesson(): Lesson {
  return lessons[0];
}
