import { fileURLToPath } from "node:url";

import { runPsqlFile } from "./lib/postgres-cli.ts";

const migrationPath = fileURLToPath(
  new URL(
    "../supabase/migrations/20260708000100_slice_1_content_schema.sql",
    import.meta.url,
  ),
);

runPsqlFile(migrationPath);
console.log(`Applied Slice 1 migration: ${migrationPath}`);
