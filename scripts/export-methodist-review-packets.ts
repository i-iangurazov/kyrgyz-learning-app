import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildMethodistReviewPacketExport } from "../src/content/review-packets.ts";
import { lessonSeedData } from "../src/content/seed/lessons.ts";
import { lessonSchema } from "../src/content/schemas.ts";

type CliOptions = {
  outputDir: string;
  jsonOutputDir: string;
  writeJson: boolean;
};

const defaultOutputDir = fileURLToPath(
  new URL("../docs/review-packets", import.meta.url),
);

const defaultJsonOutputDir = fileURLToPath(
  new URL("../test-results/review-packets", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const lessons = lessonSchema.array().parse(lessonSeedData);
const reviewPacketExport = buildMethodistReviewPacketExport(lessons);

await mkdir(cliOptions.outputDir, { recursive: true });
await writeFile(
  join(cliOptions.outputDir, "README.md"),
  reviewPacketExport.readmeMarkdown,
);

for (const packet of reviewPacketExport.packets) {
  await writeFile(join(cliOptions.outputDir, packet.filename), packet.markdown);
}

if (cliOptions.writeJson) {
  await mkdir(cliOptions.jsonOutputDir, { recursive: true });
  await writeFile(
    join(cliOptions.jsonOutputDir, "index.json"),
    `${JSON.stringify(
      {
        generatedFrom: "src/content/seed/lessons.ts",
        counts: reviewPacketExport.counts,
        lessonIds: reviewPacketExport.packets.map((packet) => packet.lessonId),
      },
      null,
      2,
    )}\n`,
  );

  for (const packet of reviewPacketExport.packets) {
    await writeFile(
      join(cliOptions.jsonOutputDir, `${packet.lessonId}.json`),
      `${JSON.stringify(packet.json, null, 2)}\n`,
    );
  }
}

console.log(`Exported methodist review packets to ${cliOptions.outputDir}`);
if (cliOptions.writeJson) {
  console.log(`Exported reviewer JSON to ${cliOptions.jsonOutputDir}`);
}
console.table(reviewPacketExport.counts);

function parseCliOptions(args: string[]): CliOptions {
  let outputDir = defaultOutputDir;
  let jsonOutputDir = defaultJsonOutputDir;
  let writeJson = true;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--output-dir") {
      outputDir = requireValue(args[index + 1], "--output-dir");
      index += 1;
      continue;
    }

    if (arg === "--json-output-dir") {
      jsonOutputDir = requireValue(args[index + 1], "--json-output-dir");
      index += 1;
      continue;
    }

    if (arg === "--no-json") {
      writeJson = false;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { outputDir, jsonOutputDir, writeJson };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}
