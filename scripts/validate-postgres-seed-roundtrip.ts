import { canonicalJson } from "../src/content/db/compare.ts";
import { buildSlice1ExportSql } from "../src/content/db/postgres-sql.ts";
import {
  getDbRowCounts,
  mapDbRowsToLessons,
} from "../src/content/db/mappers.ts";
import type { Slice1DbRows } from "../src/content/db/types.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";
import { runPsqlQuery } from "./lib/postgres-cli.ts";

const sourceLessons = lessonSchema.array().parse(lessonSeedData);
const dbJson = runPsqlQuery(buildSlice1ExportSql());
const rows = JSON.parse(dbJson) as Slice1DbRows;
const dbLessons = lessonSchema.array().parse(mapDbRowsToLessons(rows));

if (canonicalJson(dbLessons) !== canonicalJson(sourceLessons)) {
  throw new Error(
    "Local DB round-trip changed lesson-v2 content. Check imported rows before enabling DB reads.",
  );
}

const exerciseKinds = Array.from(
  new Set(dbLessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.kind))),
).sort();

console.log("Local Postgres Slice 1 seed round-trip validated.");
console.log(`Lessons validated: ${dbLessons.length}`);
console.log(`Exercise kinds preserved: ${exerciseKinds.join(", ")}`);
console.table(getDbRowCounts(rows));
