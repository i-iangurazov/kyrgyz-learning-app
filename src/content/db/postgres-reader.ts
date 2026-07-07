import { spawnSync } from "node:child_process";

import { mapDbRowsToCurriculum, type CurriculumContent } from "./curriculum-mappers.ts";
import { buildSlice1ExportSql } from "./postgres-sql.ts";
import type { Slice1DbRows } from "./types.ts";

export type PostgresReadOptions = {
  databaseUrl?: string;
  psqlBin?: string;
  env?: NodeJS.ProcessEnv;
};

export function readCurriculumFromPostgres(
  options: PostgresReadOptions = {},
): CurriculumContent {
  return mapDbRowsToCurriculum(readSlice1RowsFromPostgres(options));
}

export function readSlice1RowsFromPostgres(
  options: PostgresReadOptions = {},
): Slice1DbRows {
  const output = runPsqlQuery(buildSlice1ExportSql(), options);

  try {
    return JSON.parse(output) as Slice1DbRows;
  } catch (error) {
    throw new Error("Postgres content read returned invalid JSON.", {
      cause: error,
    });
  }
}

function runPsqlQuery(sql: string, options: PostgresReadOptions) {
  const env = options.env ?? process.env;
  const databaseUrl = options.databaseUrl ?? env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required when CONTENT_SOURCE=postgres or when running local DB read validation.",
    );
  }

  const psqlBin = options.psqlBin ?? env.PSQL_BIN ?? "psql";
  const result = spawnSync(
    psqlBin,
    [
      "-X",
      "-v",
      "ON_ERROR_STOP=1",
      "--tuples-only",
      "--no-align",
      "--dbname",
      databaseUrl,
      "--command",
      sql,
    ],
    {
      encoding: "utf8",
      env,
      maxBuffer: 1024 * 1024 * 20,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      [
        `psql exited with status ${result.status}.`,
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  const output = result.stdout.trim();

  if (!output) {
    throw new Error("Postgres content read returned no rows.");
  }

  return output;
}
