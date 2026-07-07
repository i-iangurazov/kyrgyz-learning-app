import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  createTtsGenerationPlan,
  validateTtsGenerationPlan,
} from "../src/content/audio/tts-generation.ts";
import type { TtsManifest } from "../src/content/audio/tts-manifest.ts";

type CliOptions = {
  dryRun: boolean;
  manifestPath: string;
  outputDir: string;
};

const defaultManifestPath = fileURLToPath(
  new URL("../test-results/audio/tts-manifest.json", import.meta.url),
);
const defaultOutputDir = fileURLToPath(
  new URL("../test-results/audio/files", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const manifest = JSON.parse(
  await readFile(cliOptions.manifestPath, "utf8"),
) as TtsManifest;
const apiKey = process.env.TTS_API_KEY ?? process.env.OPENAI_API_KEY;
const plan = createTtsGenerationPlan(manifest, {
  dryRun: cliOptions.dryRun,
  outputDir: cliOptions.outputDir,
  voice: process.env.TTS_VOICE,
  model: process.env.TTS_MODEL,
  endpoint: process.env.TTS_API_URL,
});

console.log(
  `${plan.dryRun ? "Dry run" : "Generating audio"} for ${plan.itemCount} TTS item(s).`,
);
console.log(`Voice: ${plan.voice}`);
console.log(`Model: ${plan.model}`);
console.log(`Output directory: ${plan.outputDir}`);

if (plan.dryRun) {
  console.table(
    plan.files.slice(0, 10).map((file) => ({
      audioId: file.audioId,
      outputPath: file.outputPath,
      text: file.textToSpeak,
    })),
  );
  if (plan.files.length > 10) {
    console.log(`...and ${plan.files.length - 10} more item(s).`);
  }
  process.exit(0);
}

try {
  validateTtsGenerationPlan(plan, apiKey);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

for (const file of plan.files) {
  await mkdir(dirname(file.outputPath), { recursive: true });
  const response = await fetch(plan.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: plan.model,
      voice: plan.voice,
      input: file.textToSpeak,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `TTS generation failed for ${file.audioId}: ${response.status} ${body}`,
    );
  }

  await writeFile(file.outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${file.outputPath}`);
}

function parseCliOptions(args: string[]): CliOptions {
  let dryRun = false;
  let manifestPath = defaultManifestPath;
  let outputDir = defaultOutputDir;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--manifest") {
      manifestPath = requireValue(args[index + 1], "--manifest");
      index += 1;
      continue;
    }

    if (arg === "--output-dir") {
      outputDir = requireValue(args[index + 1], "--output-dir");
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { dryRun, manifestPath, outputDir };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}
