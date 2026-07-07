import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDbRowCounts,
  mapLessonsToDbRows,
} from "../src/content/db/mappers.ts";
import { levelSeedData, unitSeedData } from "../src/content/seed/curriculum.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import {
  lessonSchema,
  levelSchema,
  unitSchema,
} from "../src/content/schemas.ts";

const outputPath =
  process.argv[2] ??
  fileURLToPath(
    new URL("../test-results/db-seed/slice-1-db-rows.json", import.meta.url),
  );

const lessons = lessonSchema.array().parse(lessonSeedData);
const levels = levelSchema.array().parse(levelSeedData);
const units = unitSchema.array().parse(unitSeedData);
const rows = mapLessonsToDbRows(lessons, { levels, units });
const counts = getDbRowCounts(rows);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      migration: "20260708000100_slice_1_content_schema.sql",
      generatedFrom: "src/content/seed/lessons.ts",
      counts,
      rows,
    },
    null,
    2,
  )}\n`,
);

console.log(`Exported Slice 1 DB-shaped seed rows to ${outputPath}`);
console.table(counts);
