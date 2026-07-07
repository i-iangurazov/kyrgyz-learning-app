import { describe, expect, it } from "vitest";

import { lessons, levels, units } from "@/content/curriculum";
import { lessonSchema } from "@/content/schemas";

describe("curriculum content schemas", () => {
  it("validates all seeded lessons", () => {
    expect(() => lessonSchema.array().parse(lessons)).not.toThrow();
  });

  it("marks every seeded lesson as demo content with validation TODOs", () => {
    for (const lesson of lessons) {
      expect(lesson.contentStatus).toBe("demo");
      expect(lesson.sampleNotice).toContain("Sample/demo content");
      expect(lesson.validationTodos.join(" ")).toContain("TODO");
    }
  });

  it("keeps unit and level references connected", () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    const unitIds = new Set(units.map((unit) => unit.id));

    for (const unit of units) {
      expect(unitIds.has(unit.id)).toBe(true);
      for (const lessonId of unit.lessonIds) {
        expect(lessonIds.has(lessonId)).toBe(true);
      }
    }

    for (const level of levels) {
      for (const unitId of level.unitIds) {
        expect(unitIds.has(unitId)).toBe(true);
      }
    }
  });
});
