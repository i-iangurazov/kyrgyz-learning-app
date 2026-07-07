import {
  type Lesson,
  type Level,
  type Unit,
  lessonSchema,
  levelSchema,
  unitSchema,
} from "../schemas.ts";
import { mapDbRowsToLessons } from "./mappers.ts";
import type { Slice1DbRows } from "./types.ts";

export type CurriculumContent = {
  levels: Level[];
  units: Unit[];
  lessons: Lesson[];
};

export function mapDbRowsToCurriculum(rows: Slice1DbRows): CurriculumContent {
  const lessons = lessonSchema.array().parse(mapDbRowsToLessons(rows));
  const units = unitSchema.array().parse(
    rows.units
      .slice()
      .sort(byLevelThenDisplayOrder)
      .map((unitRow) => ({
        id: unitRow.id,
        levelId: unitRow.level_id,
        title: unitRow.title,
        description: unitRow.description,
        lessonIds: lessons
          .filter((lesson) => lesson.unitId === unitRow.id)
          .sort(byLessonOrder)
          .map((lesson) => lesson.id),
      })),
  );
  const levels = levelSchema.array().parse(
    rows.levels
      .slice()
      .sort(byDisplayOrder)
      .map((levelRow) => ({
        id: levelRow.id,
        title: levelRow.title,
        description: levelRow.description,
        unitIds: units
          .filter((unit) => unit.levelId === levelRow.id)
          .map((unit) => unit.id),
      })),
  );

  return { levels, units, lessons };
}

function byDisplayOrder<T extends { display_order: number }>(a: T, b: T) {
  return a.display_order - b.display_order;
}

function byLevelThenDisplayOrder<
  T extends { level_id: string; display_order: number; id: string },
>(a: T, b: T) {
  return (
    a.level_id.localeCompare(b.level_id) ||
    a.display_order - b.display_order ||
    a.id.localeCompare(b.id)
  );
}

function byLessonOrder(a: Lesson, b: Lesson) {
  return a.order - b.order || a.id.localeCompare(b.id);
}
