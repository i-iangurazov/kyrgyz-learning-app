import { spawnSync } from "node:child_process";

import { loadLocalEnvFiles } from "./load-local-env.ts";

loadLocalEnvFiles();

export function getRequiredDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required for local DB validation scripts. Example: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres",
    );
  }

  return databaseUrl;
}

export function runPsqlScript(sql: string) {
  const result = runPsql(["--file", "-"], sql);

  if (result.stdout.trim().length > 0) {
    console.log(result.stdout.trim());
  }

  return result;
}

export function runPsqlQuery(sql: string) {
  const result = runPsql(["--tuples-only", "--no-align", "--command", sql]);

  return result.stdout.trim();
}

export function runPsqlFile(filePath: string) {
  const result = runPsql(["--file", filePath]);

  if (result.stdout.trim().length > 0) {
    console.log(result.stdout.trim());
  }

  return result;
}

function runPsql(args: string[], input?: string) {
  const psqlBin = process.env.PSQL_BIN ?? "psql";
  const databaseUrl = getRequiredDatabaseUrl();
  const result = spawnSync(
    psqlBin,
    ["-X", "-v", "ON_ERROR_STOP=1", "--dbname", databaseUrl, ...args],
    {
      input,
      encoding: "utf8",
      env: process.env,
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

  if (result.stderr.trim().length > 0) {
    console.error(result.stderr.trim());
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
  };
}
