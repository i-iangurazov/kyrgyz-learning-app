import type { Slice1DbRows } from "./types.ts";

type Slice1TableName = keyof Slice1DbRows;

type Slice1TableSpec = {
  name: Slice1TableName;
  columns: string[];
  conflictColumns: string[];
  jsonbColumns: string[];
  orderBy: string[];
};

export const slice1TableSpecs = [
  {
    name: "sources",
    columns: [
      "id",
      "title",
      "category",
      "language",
      "rights_status",
      "usage_permission",
      "reference_url",
      "notes",
    ],
    conflictColumns: ["id"],
    jsonbColumns: [],
    orderBy: ["id"],
  },
  {
    name: "levels",
    columns: [
      "id",
      "title",
      "description",
      "display_order",
      "kyrgyztest_level",
      "cefr_placeholder",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["title", "description"],
    orderBy: ["display_order", "id"],
  },
  {
    name: "units",
    columns: [
      "id",
      "level_id",
      "title",
      "description",
      "display_order",
      "content_status",
      "methodist_review_status",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["title", "description"],
    orderBy: ["level_id", "display_order", "id"],
  },
  {
    name: "lessons",
    columns: [
      "id",
      "schema_version",
      "level_id",
      "unit_id",
      "stable_lesson_id",
      "lesson_number",
      "display_order",
      "title",
      "subtitle",
      "story",
      "estimated_duration_minutes",
      "sample_notice",
      "validation_todos",
      "content_status",
      "methodist_review_status",
      "is_demo_content",
      "is_original_content",
      "requires_license",
      "source_notes",
      "rights_notes",
      "internal_notes",
      "methodist_notes",
      "methodology_refs",
      "validated_against",
      "hsk_inspired_components",
      "kyrgyztest_level",
      "cefr_level_placeholder",
      "texts",
      "mini_game",
      "speaking_prompt",
      "ai_roleplay",
      "review",
    ],
    conflictColumns: ["id"],
    jsonbColumns: [
      "title",
      "subtitle",
      "story",
      "validation_todos",
      "internal_notes",
      "methodist_notes",
      "methodology_refs",
      "validated_against",
      "hsk_inspired_components",
      "texts",
      "mini_game",
      "speaking_prompt",
      "ai_roleplay",
      "review",
    ],
    orderBy: ["level_id", "unit_id", "display_order", "id"],
  },
  {
    name: "lesson_learning_goals",
    columns: ["id", "lesson_id", "goal_text", "display_order"],
    conflictColumns: ["id"],
    jsonbColumns: ["goal_text"],
    orderBy: ["lesson_id", "display_order", "id"],
  },
  {
    name: "lesson_tracks",
    columns: ["lesson_id", "track", "display_order"],
    conflictColumns: ["lesson_id", "track"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "track"],
  },
  {
    name: "lesson_target_skills",
    columns: ["lesson_id", "target_skill", "display_order"],
    conflictColumns: ["lesson_id", "target_skill"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "target_skill"],
  },
  {
    name: "lesson_prerequisites",
    columns: ["lesson_id", "prerequisite_lesson_id", "display_order"],
    conflictColumns: ["lesson_id", "prerequisite_lesson_id"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "prerequisite_lesson_id"],
  },
  {
    name: "lesson_methodology_refs",
    columns: [
      "lesson_id",
      "source_id",
      "relationship_type",
      "hsk_component",
      "display_order",
    ],
    conflictColumns: ["lesson_id", "source_id", "relationship_type"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "source_id", "relationship_type"],
  },
  {
    name: "vocabulary_items",
    columns: [
      "id",
      "kyrgyz",
      "transliteration",
      "translations",
      "example",
      "audio_placeholder",
      "tags",
      "linked_lesson_ids",
      "source_notes",
      "rights_notes",
      "methodist_review_status",
    ],
    conflictColumns: ["id"],
    jsonbColumns: [
      "translations",
      "example",
      "audio_placeholder",
      "tags",
      "linked_lesson_ids",
    ],
    orderBy: ["id"],
  },
  {
    name: "lesson_vocabulary",
    columns: ["lesson_id", "vocabulary_item_id", "display_order", "introduced_here"],
    conflictColumns: ["lesson_id", "vocabulary_item_id"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "vocabulary_item_id"],
  },
  {
    name: "grammar_points",
    columns: [
      "id",
      "level_id",
      "title",
      "simple_rule",
      "explanations_by_track",
      "examples",
      "common_mistakes",
      "micro_practice_prompts",
      "linked_exercise_ids",
      "methodology_refs",
      "source_notes",
      "validation_notes",
      "validated_against",
      "methodist_review_status",
    ],
    conflictColumns: ["id"],
    jsonbColumns: [
      "title",
      "simple_rule",
      "explanations_by_track",
      "examples",
      "common_mistakes",
      "micro_practice_prompts",
      "linked_exercise_ids",
      "methodology_refs",
      "validated_against",
    ],
    orderBy: ["level_id", "id"],
  },
  {
    name: "lesson_grammar_points",
    columns: ["lesson_id", "grammar_point_id", "display_order", "introduced_here"],
    conflictColumns: ["lesson_id", "grammar_point_id"],
    jsonbColumns: [],
    orderBy: ["lesson_id", "display_order", "grammar_point_id"],
  },
  {
    name: "dialogues",
    columns: [
      "id",
      "lesson_id",
      "title",
      "context",
      "reading_source_type",
      "rights_notes",
      "source_notes",
      "naturalness_review_status",
      "methodist_review_status",
      "is_original_content",
      "requires_license",
      "audio_placeholder",
      "linked_vocabulary_ids",
      "linked_grammar_point_ids",
      "display_order",
    ],
    conflictColumns: ["id"],
    jsonbColumns: [
      "title",
      "context",
      "audio_placeholder",
      "linked_vocabulary_ids",
      "linked_grammar_point_ids",
    ],
    orderBy: ["lesson_id", "display_order", "id"],
  },
  {
    name: "dialogue_lines",
    columns: [
      "id",
      "dialogue_id",
      "speaker",
      "kyrgyz",
      "transliteration",
      "translations",
      "audio_placeholder",
      "display_order",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["translations", "audio_placeholder"],
    orderBy: ["dialogue_id", "display_order", "id"],
  },
  {
    name: "breakdown_items",
    columns: [
      "id",
      "lesson_id",
      "source_content_type",
      "source_content_id",
      "phrase",
      "meaning_by_track",
      "notes_by_track",
      "source_notes",
      "methodist_review_status",
      "display_order",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["meaning_by_track", "notes_by_track"],
    orderBy: ["lesson_id", "display_order", "id"],
  },
  {
    name: "breakdown_vocabulary",
    columns: ["breakdown_item_id", "vocabulary_item_id", "display_order"],
    conflictColumns: ["breakdown_item_id", "vocabulary_item_id"],
    jsonbColumns: [],
    orderBy: ["breakdown_item_id", "display_order", "vocabulary_item_id"],
  },
  {
    name: "breakdown_grammar_points",
    columns: ["breakdown_item_id", "grammar_point_id", "display_order"],
    conflictColumns: ["breakdown_item_id", "grammar_point_id"],
    jsonbColumns: [],
    orderBy: ["breakdown_item_id", "display_order", "grammar_point_id"],
  },
  {
    name: "exercises",
    columns: [
      "id",
      "lesson_id",
      "kind",
      "prompt",
      "helper_text_by_track",
      "hsk_inspired_components",
      "source_notes",
      "methodist_review_status",
      "display_order",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["prompt", "helper_text_by_track", "hsk_inspired_components"],
    orderBy: ["lesson_id", "display_order", "id"],
  },
  {
    name: "exercise_items",
    columns: [
      "id",
      "exercise_id",
      "question",
      "explanation",
      "audio_placeholder",
      "display_order",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["question", "explanation", "audio_placeholder"],
    orderBy: ["exercise_id", "display_order", "id"],
  },
  {
    name: "exercise_options",
    columns: [
      "id",
      "exercise_item_id",
      "option_text",
      "option_group",
      "display_order",
      "metadata",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["option_text", "metadata"],
    orderBy: ["exercise_item_id", "display_order", "id"],
  },
  {
    name: "exercise_answers",
    columns: [
      "id",
      "exercise_item_id",
      "answer_kind",
      "value",
      "accepted_alternatives",
      "display_value",
      "is_primary",
    ],
    conflictColumns: ["id"],
    jsonbColumns: ["value", "accepted_alternatives"],
    orderBy: ["exercise_item_id", "id"],
  },
  {
    name: "exercise_feedback",
    columns: ["exercise_item_id", "correct_feedback", "incorrect_feedback", "hint"],
    conflictColumns: ["exercise_item_id"],
    jsonbColumns: ["correct_feedback", "incorrect_feedback", "hint"],
    orderBy: ["exercise_item_id"],
  },
  {
    name: "exercise_vocabulary",
    columns: ["exercise_id", "vocabulary_item_id", "display_order"],
    conflictColumns: ["exercise_id", "vocabulary_item_id"],
    jsonbColumns: [],
    orderBy: ["exercise_id", "display_order", "vocabulary_item_id"],
  },
  {
    name: "exercise_grammar_points",
    columns: ["exercise_id", "grammar_point_id", "display_order"],
    conflictColumns: ["exercise_id", "grammar_point_id"],
    jsonbColumns: [],
    orderBy: ["exercise_id", "display_order", "grammar_point_id"],
  },
] as const satisfies Slice1TableSpec[];

export function buildSlice1UpsertSql(rows: Slice1DbRows): string {
  const statements = slice1TableSpecs
    .map((spec) => buildTableUpsertSql(spec, rows[spec.name]))
    .filter(Boolean);

  return [
    "begin;",
    "set constraints all immediate;",
    ...statements,
    "commit;",
    "",
  ].join("\n");
}

export function buildSlice1ExportSql(): string {
  const fields = slice1TableSpecs.map(
    (spec) =>
      `${quoteSqlString(spec.name)}, (${buildTableJsonSelectSql(spec)})`,
  );

  return `select jsonb_build_object(${fields.join(", ")})::text;`;
}

function buildTableUpsertSql(
  spec: Slice1TableSpec,
  rows: Slice1DbRows[Slice1TableName],
): string {
  if (rows.length === 0) {
    return "";
  }

  const values = rows
    .map((row) => {
      const rowRecord = row as Record<string, unknown>;
      const rowValues = spec.columns.map((column) =>
        formatSqlValue(rowRecord[column], spec.jsonbColumns.includes(column)),
      );

      return `(${rowValues.join(", ")})`;
    })
    .join(",\n");
  const updateColumns = spec.columns.filter(
    (column) => !spec.conflictColumns.includes(column),
  );
  const updateClause =
    updateColumns.length > 0
      ? `do update set ${updateColumns
          .map((column) => `${quoteIdent(column)} = excluded.${quoteIdent(column)}`)
          .join(", ")}`
      : "do nothing";

  return [
    `insert into public.${quoteIdent(spec.name)} (${spec.columns
      .map(quoteIdent)
      .join(", ")})`,
    `values ${values}`,
    `on conflict (${spec.conflictColumns.map(quoteIdent).join(", ")}) ${updateClause};`,
  ].join("\n");
}

function buildTableJsonSelectSql(spec: Slice1TableSpec): string {
  const columnList = spec.columns.map(quoteIdent).join(", ");
  const orderBy = spec.orderBy.map(quoteIdent).join(", ");

  return [
    "select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)",
    `from (select ${columnList} from public.${quoteIdent(spec.name)} order by ${orderBy}) t`,
  ].join(" ");
}

function formatSqlValue(value: unknown, isJsonb: boolean): string {
  if (value === null || value === undefined) {
    return "null";
  }

  if (isJsonb) {
    return `${quoteSqlString(JSON.stringify(value))}::jsonb`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return quoteSqlString(String(value));
}

function quoteSqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function quoteIdent(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
