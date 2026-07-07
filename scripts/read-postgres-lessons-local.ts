import { mapDbRowsToCurriculum } from "../src/content/db/curriculum-mappers.ts";
import { getDbRowCounts } from "../src/content/db/mappers.ts";
import { readSlice1RowsFromPostgres } from "../src/content/db/postgres-reader.ts";

const rows = readSlice1RowsFromPostgres();
const { levels, units, lessons } = mapDbRowsToCurriculum(rows);
const exerciseKinds = Array.from(
  new Set(
    lessons.flatMap((lesson) =>
      lesson.exercises.map((exercise) => exercise.kind),
    ),
  ),
).sort();

console.log("Local Postgres content read path validated.");
console.log(`Levels read: ${levels.length}`);
console.log(`Units read: ${units.length}`);
console.log(`Lessons read: ${lessons.length}`);
console.log(`Exercise kinds preserved: ${exerciseKinds.join(", ")}`);
console.table(getDbRowCounts(rows));
