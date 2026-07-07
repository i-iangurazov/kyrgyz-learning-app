import { fileURLToPath } from "node:url";

import { runPsqlFile, runPsqlQuery } from "./lib/postgres-cli.ts";

const migrationPath = fileURLToPath(
  new URL(
    "../supabase/migrations/20260708000100_slice_1_content_schema.sql",
    import.meta.url,
  ),
);

const hasSlice1Schema =
  runPsqlQuery("select to_regclass('public.lessons') is not null;") === "t";

if (hasSlice1Schema) {
  console.log("Slice 1 migration already appears to be applied; skipping.");
  process.exit(0);
}

runPsqlFile(migrationPath);
console.log(`Applied Slice 1 migration: ${migrationPath}`);
