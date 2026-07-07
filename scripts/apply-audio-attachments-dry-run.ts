import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildAudioAttachmentApplyPlan,
  type AudioAttachmentMap,
} from "../src/content/audio/audio-attachment.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";

type CliOptions = {
  attachmentMapPath: string;
  outputPath: string;
  publicDir: string;
  publicUrlBase: string;
};

const defaultAttachmentMapPath = fileURLToPath(
  new URL("../test-results/audio/audio-attachment-map.json", import.meta.url),
);
const defaultOutputPath = fileURLToPath(
  new URL("../test-results/audio/audio-apply-plan.json", import.meta.url),
);
const defaultPublicDir = fileURLToPath(
  new URL("../public/generated-audio", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const attachmentMap = JSON.parse(
  await readFile(cliOptions.attachmentMapPath, "utf8"),
) as AudioAttachmentMap;
const lessons = lessonSchema.array().parse(lessonSeedData);
const plan = buildAudioAttachmentApplyPlan(lessons, attachmentMap, {
  publicDir: cliOptions.publicDir,
  publicUrlBase: cliOptions.publicUrlBase,
});

await mkdir(dirname(cliOptions.outputPath), { recursive: true });
await writeFile(
  cliOptions.outputPath,
  `${JSON.stringify(
    {
      ...plan,
      dryRunOnly: true,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote dry-run audio attachment apply plan to ${cliOptions.outputPath}`);
console.table(plan.summary);
console.log("No seed content was mutated.");

function parseCliOptions(args: string[]): CliOptions {
  let attachmentMapPath = defaultAttachmentMapPath;
  let outputPath = defaultOutputPath;
  let publicDir = defaultPublicDir;
  let publicUrlBase =
    process.env.LOCAL_AUDIO_PUBLIC_URL_BASE ??
    "http://127.0.0.1:3000/generated-audio";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--attachment-map") {
      attachmentMapPath = requireValue(args[index + 1], "--attachment-map");
      index += 1;
      continue;
    }

    if (arg === "--output") {
      outputPath = requireValue(args[index + 1], "--output");
      index += 1;
      continue;
    }

    if (arg === "--public-dir") {
      publicDir = requireValue(args[index + 1], "--public-dir");
      index += 1;
      continue;
    }

    if (arg === "--public-url-base") {
      publicUrlBase = requireValue(args[index + 1], "--public-url-base");
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { attachmentMapPath, outputPath, publicDir, publicUrlBase };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}
