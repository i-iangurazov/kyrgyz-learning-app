import { describe, expect, it } from "vitest";

import { mapLessonsToDbRows } from "@/content/db/mappers";
import {
  buildSlice1ExportSql,
  buildSlice1UpsertSql,
  slice1TableSpecs,
} from "@/content/db/postgres-sql";
import { levelSeedData, unitSeedData } from "@/content/seed/curriculum";
import { lessonSeedData } from "@/content/seed/lessons";
import { lessonSchema, levelSchema, unitSchema } from "@/content/schemas";

const sourceLessons = lessonSchema.array().parse(lessonSeedData);
const levels = levelSchema.array().parse(levelSeedData);
const units = unitSchema.array().parse(unitSeedData);
const rows = mapLessonsToDbRows(sourceLessons, { levels, units });

describe("Slice 1 Postgres SQL helpers", () => {
  it("plans inserts for only the Slice 1 tables", () => {
    expect(slice1TableSpecs.map((spec) => spec.name)).toEqual([
      "sources",
      "levels",
      "units",
      "lessons",
      "lesson_learning_goals",
      "lesson_tracks",
      "lesson_target_skills",
      "lesson_prerequisites",
      "lesson_methodology_refs",
      "vocabulary_items",
      "lesson_vocabulary",
      "grammar_points",
      "lesson_grammar_points",
      "dialogues",
      "dialogue_lines",
      "breakdown_items",
      "breakdown_vocabulary",
      "breakdown_grammar_points",
      "exercises",
      "exercise_items",
      "exercise_options",
      "exercise_answers",
      "exercise_feedback",
      "exercise_vocabulary",
      "exercise_grammar_points",
    ]);
  });

  it("generates idempotent upsert SQL in foreign-key-safe order", () => {
    const sql = buildSlice1UpsertSql(rows);

    expect(sql).toContain("begin;");
    expect(sql).toContain("commit;");
    expect(sql).toContain('insert into public."levels"');
    expect(sql).toContain('on conflict ("id") do update set');
    expect(sql.indexOf('insert into public."lessons"')).toBeGreaterThan(
      sql.indexOf('insert into public."units"'),
    );
    expect(sql.indexOf('insert into public."lesson_vocabulary"')).toBeGreaterThan(
      sql.indexOf('insert into public."vocabulary_items"'),
    );
    expect(sql.indexOf('insert into public."exercise_answers"')).toBeGreaterThan(
      sql.indexOf('insert into public."exercise_items"'),
    );
  });

  it("serializes JSONB and Kyrgyz text safely", () => {
    const sql = buildSlice1UpsertSql(rows);

    expect(sql).toContain("Кыргызча саламдашуу");
    expect(sql).toContain("::jsonb");
    expect(sql).toContain("Original app-authored demo content");
  });

  it("generates a single JSON export query for round-trip validation", () => {
    const sql = buildSlice1ExportSql();

    expect(sql).toContain("select jsonb_build_object");
    expect(sql).toContain("from public.\"lessons\"");
    expect(sql).toContain("from public.\"exercise_answers\"");
    expect(sql).toContain("order by \"level_id\", \"unit_id\", \"display_order\", \"id\"");
  });
});
