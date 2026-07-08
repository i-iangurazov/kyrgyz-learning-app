import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildAudioQaReport,
  renderAudioQaReportMarkdown,
} from "../src/content/audio/audio-qa-report.ts";
import {
  defaultTtsVoice,
  sanitizeVoiceForPath,
} from "../src/content/audio/tts-generation.ts";
import type { AudioAttachmentMap } from "../src/content/audio/audio-attachment.ts";

type CliOptions = {
  attachmentMapPath: string;
  jsonOutputPath: string;
  markdownOutputPath: string;
  voice?: string;
};

const defaultAttachmentMapPath = fileURLToPath(
  new URL("../test-results/audio/audio-attachment-map.json", import.meta.url),
);
const defaultJsonOutputPath = fileURLToPath(
  new URL("../test-results/audio/audio-qa-report.json", import.meta.url),
);
const defaultMarkdownOutputPath = fileURLToPath(
  new URL("../test-results/audio/audio-qa-report.md", import.meta.url),
);

const cliOptions = parseCliOptions(process.argv.slice(2));
const attachmentMap = JSON.parse(
  await readFile(cliOptions.attachmentMapPath, "utf8"),
) as AudioAttachmentMap;
const voice = cliOptions.voice ?? attachmentMap.items[0]?.voice ?? defaultTtsVoice;
const report = buildAudioQaReport(attachmentMap, {
  generatedFromAttachmentMap: cliOptions.attachmentMapPath,
  voice,
});

await mkdir(dirname(cliOptions.jsonOutputPath), { recursive: true });
await mkdir(dirname(cliOptions.markdownOutputPath), { recursive: true });
await writeFile(
  cliOptions.jsonOutputPath,
  `${JSON.stringify(
    {
      ...report,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);
await writeFile(cliOptions.markdownOutputPath, renderAudioQaReportMarkdown(report));

console.log(`Wrote audio QA JSON report to ${cliOptions.jsonOutputPath}`);
console.log(`Wrote audio QA Markdown report to ${cliOptions.markdownOutputPath}`);
console.table(report.summary);

function parseCliOptions(args: string[]): CliOptions {
  let attachmentMapPath = defaultAttachmentMapPath;
  let jsonOutputPath = defaultJsonOutputPath;
  let markdownOutputPath = defaultMarkdownOutputPath;
  let voice = process.env.TTS_VOICE;
  let voiceOutputDefaults = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--attachment-map") {
      attachmentMapPath = requireValue(args[index + 1], "--attachment-map");
      index += 1;
      continue;
    }

    if (arg === "--json-output") {
      jsonOutputPath = requireValue(args[index + 1], "--json-output");
      index += 1;
      continue;
    }

    if (arg === "--markdown-output") {
      markdownOutputPath = requireValue(args[index + 1], "--markdown-output");
      index += 1;
      continue;
    }

    if (arg === "--voice") {
      voice = requireValue(args[index + 1], "--voice");
      index += 1;
      continue;
    }

    if (arg === "--voice-output-defaults") {
      voiceOutputDefaults = true;
      voice ??= defaultTtsVoice;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (voiceOutputDefaults) {
    const voicePath = sanitizeVoiceForPath(voice ?? defaultTtsVoice);
    if (attachmentMapPath === defaultAttachmentMapPath) {
      attachmentMapPath = fileURLToPath(
        new URL(
          `../test-results/audio/voices/${voicePath}/audio-attachment-map.json`,
          import.meta.url,
        ),
      );
    }
    jsonOutputPath = fileURLToPath(
      new URL(`../test-results/audio/voices/${voicePath}/audio-qa-report.json`, import.meta.url),
    );
    markdownOutputPath = fileURLToPath(
      new URL(`../test-results/audio/voices/${voicePath}/audio-qa-report.md`, import.meta.url),
    );
  }

  return {
    attachmentMapPath,
    jsonOutputPath,
    markdownOutputPath,
    ...(voice ? { voice } : {}),
  };
}

function requireValue(value: string | undefined, flag: string) {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}
