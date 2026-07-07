import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTtsManifest } from "../src/content/audio/tts-manifest.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";

type CliOptions = {
  outputPath: string;
  lessonId?: string;
};

const defaultOutputPath = fileURLToPath(
  new URL("../test-results/audio/tts-manifest.json", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const lessons = lessonSchema.array().parse(lessonSeedData);
assertLessonExists(lessons, cliOptions.lessonId);
const manifest = buildTtsManifest(lessons, {
  generatedFrom: "src/content/seed/lessons.ts",
  lessonId: cliOptions.lessonId,
});

await mkdir(dirname(cliOptions.outputPath), { recursive: true });
await writeFile(
  cliOptions.outputPath,
  `${JSON.stringify(
    {
      ...manifest,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log(`Exported TTS manifest to ${cliOptions.outputPath}`);
if (cliOptions.lessonId) {
  console.log(`Lesson filter: ${cliOptions.lessonId}`);
}
console.table(manifest.counts);

function parseCliOptions(args: string[]): CliOptions {
  let outputPath = defaultOutputPath;
  let lessonId = process.env.TTS_LESSON_ID;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--output") {
      outputPath = requireValue(args[index + 1], "--output");
      index += 1;
      continue;
    }

    if (arg === "--lesson") {
      lessonId = requireValue(args[index + 1], "--lesson");
      index += 1;
      continue;
    }

    if (!arg.startsWith("-")) {
      outputPath = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { outputPath, ...(lessonId ? { lessonId } : {}) };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function assertLessonExists(
  lessons: Array<{ id: string }>,
  lessonId: string | undefined,
) {
  if (!lessonId || lessons.some((lesson) => lesson.id === lessonId)) {
    return;
  }

  throw new Error(`No seed lesson found for TTS lesson filter: ${lessonId}`);
}
