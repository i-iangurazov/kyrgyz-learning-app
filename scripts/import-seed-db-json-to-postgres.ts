import { buildSlice1UpsertSql } from "../src/content/db/postgres-sql.ts";
import { getDbRowCounts, mapLessonsToDbRows } from "../src/content/db/mappers.ts";
import { levelSeedData, unitSeedData } from "../src/content/seed/curriculum.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import {
  lessonSchema,
  levelSchema,
  unitSchema,
} from "../src/content/schemas.ts";
import { runPsqlScript } from "./lib/postgres-cli.ts";

const lessons = lessonSchema.array().parse(lessonSeedData);
const levels = levelSchema.array().parse(levelSeedData);
const units = unitSchema.array().parse(unitSeedData);
const rows = mapLessonsToDbRows(lessons, { levels, units });
const sql = buildSlice1UpsertSql(rows);

runPsqlScript(sql);

console.log("Imported Slice 1 seed rows into local Postgres.");
console.table(getDbRowCounts(rows));
