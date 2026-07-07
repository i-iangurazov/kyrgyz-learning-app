import { canonicalJson } from "../src/content/db/compare.ts";
import {
  getDbRowCounts,
  mapDbRowsToLessons,
  mapLessonsToDbRows,
} from "../src/content/db/mappers.ts";
import { levelSeedData, unitSeedData } from "../src/content/seed/curriculum.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import {
  lessonSchema,
  levelSchema,
  unitSchema,
} from "../src/content/schemas.ts";

const sourceLessons = lessonSchema.array().parse(lessonSeedData);
const levels = levelSchema.array().parse(levelSeedData);
const units = unitSchema.array().parse(unitSeedData);
const rows = mapLessonsToDbRows(sourceLessons, { levels, units });
const roundTrippedLessons = lessonSchema.array().parse(mapDbRowsToLessons(rows));

if (canonicalJson(roundTrippedLessons) !== canonicalJson(sourceLessons)) {
  throw new Error(
    "DB seed round-trip changed lesson-v2 content. Compare mapper output before continuing.",
  );
}

const exerciseKinds = Array.from(
  new Set(sourceLessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.kind))),
).sort();

console.log("Slice 1 DB seed round-trip validated.");
console.log(`Lessons validated: ${roundTrippedLessons.length}`);
console.log(`Exercise kinds preserved: ${exerciseKinds.join(", ")}`);
console.table(getDbRowCounts(rows));
