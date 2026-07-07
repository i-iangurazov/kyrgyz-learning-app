import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildAudioAttachmentMap,
  validateAudioAttachmentMap,
} from "../src/content/audio/audio-attachment.ts";
import {
  buildTtsManifest,
  filterTtsManifestByLesson,
  type TtsManifest,
} from "../src/content/audio/tts-manifest.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";

type CliOptions = {
  manifestPath: string;
  outputPath: string;
  audioDir: string;
  lessonId?: string;
};

const defaultManifestPath = fileURLToPath(
  new URL("../test-results/audio/tts-manifest.json", import.meta.url),
);
const defaultOutputPath = fileURLToPath(
  new URL("../test-results/audio/audio-attachment-map.json", import.meta.url),
);
const defaultAudioDir = fileURLToPath(
  new URL("../test-results/audio/files", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const { manifest, source } = await loadOrGenerateManifest(cliOptions.manifestPath);
const filteredManifest = filterTtsManifestByLesson(manifest, cliOptions.lessonId);
assertManifestHasItems(filteredManifest, cliOptions.lessonId);
const attachmentMap = await buildAudioAttachmentMap(filteredManifest, {
  generatedFromManifest: source,
  generatedAudioDir: cliOptions.audioDir,
});
const validation = validateAudioAttachmentMap(attachmentMap, filteredManifest);

await mkdir(dirname(cliOptions.outputPath), { recursive: true });
await writeFile(
  cliOptions.outputPath,
  `${JSON.stringify(
    {
      ...attachmentMap,
      validation: {
        isValid: validation.isValid,
        allFilesAttached: validation.allFilesAttached,
        errors: validation.errors,
      },
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log(`Exported audio attachment map to ${cliOptions.outputPath}`);
console.log(`Manifest source: ${source}`);
if (cliOptions.lessonId) {
  console.log(`Lesson filter: ${cliOptions.lessonId}`);
}
console.table(attachmentMap.summary);

if (!validation.isValid) {
  console.error("Audio attachment map validation failed:");
  for (const error of validation.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (!validation.allFilesAttached) {
  console.log(
    `${validation.missingAudioIds.length} audio file(s) are missing. This is expected until TTS files are intentionally generated and reviewed.`,
  );
}

async function loadOrGenerateManifest(manifestPath: string) {
  try {
    const parsed = JSON.parse(await readFile(manifestPath, "utf8")) as TtsManifest;
    return { manifest: parsed, source: manifestPath };
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }

    const lessons = lessonSchema.array().parse(lessonSeedData);
    return {
      manifest: buildTtsManifest(lessons, {
        generatedFrom: "src/content/seed/lessons.ts",
        lessonId: process.env.TTS_LESSON_ID,
      }),
      source: "generated in memory from src/content/seed/lessons.ts",
    };
  }
}

function parseCliOptions(args: string[]): CliOptions {
  let manifestPath = defaultManifestPath;
  let outputPath = defaultOutputPath;
  let audioDir = defaultAudioDir;
  let lessonId = process.env.TTS_LESSON_ID;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--manifest") {
      manifestPath = requireValue(args[index + 1], "--manifest");
      index += 1;
      continue;
    }

    if (arg === "--output") {
      outputPath = requireValue(args[index + 1], "--output");
      index += 1;
      continue;
    }

    if (arg === "--audio-dir") {
      audioDir = requireValue(args[index + 1], "--audio-dir");
      index += 1;
      continue;
    }

    if (arg === "--lesson") {
      lessonId = requireValue(args[index + 1], "--lesson");
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { manifestPath, outputPath, audioDir, ...(lessonId ? { lessonId } : {}) };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function assertManifestHasItems(manifest: TtsManifest, lessonId: string | undefined) {
  if (manifest.items.length > 0) {
    return;
  }

  throw new Error(
    lessonId
      ? `No TTS manifest items found for lesson ${lessonId}.`
      : "No TTS manifest items found.",
  );
}
