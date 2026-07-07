import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTtsManifest } from "../src/content/audio/tts-manifest.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";

const outputPath =
  process.argv[2] ??
  fileURLToPath(
    new URL("../test-results/audio/tts-manifest.json", import.meta.url),
  );

const lessons = lessonSchema.array().parse(lessonSeedData);
const manifest = buildTtsManifest(lessons, {
  generatedFrom: "src/content/seed/lessons.ts",
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      ...manifest,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log(`Exported TTS manifest to ${outputPath}`);
console.table(manifest.counts);
