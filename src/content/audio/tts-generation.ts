import { join } from "node:path";

import type { TtsManifest } from "@/content/audio/tts-manifest";

export const defaultTtsModel = "gpt-4o-mini-tts";
export const defaultTtsVoice = "alloy";
export const defaultTtsEndpoint = "https://api.openai.com/v1/audio/speech";

export type TtsGenerationOptions = {
  dryRun: boolean;
  outputDir: string;
  voice?: string;
  model?: string;
  endpoint?: string;
  voiceFolder?: boolean;
};

export type TtsGenerationPlan = {
  dryRun: boolean;
  itemCount: number;
  outputDir: string;
  voice: string;
  model: string;
  endpoint: string;
  requiresApiKey: boolean;
  files: Array<{
    audioId: string;
    textToSpeak: string;
    outputPath: string;
  }>;
};

export function createTtsGenerationPlan(
  manifest: TtsManifest,
  options: TtsGenerationOptions,
): TtsGenerationPlan {
  const voice = options.voice ?? defaultTtsVoice;
  const outputDir = options.voiceFolder
    ? resolveVoiceScopedOutputDir(options.outputDir, voice)
    : options.outputDir;

  return {
    dryRun: options.dryRun,
    itemCount: manifest.items.length,
    outputDir,
    voice,
    model: options.model ?? defaultTtsModel,
    endpoint: options.endpoint ?? defaultTtsEndpoint,
    requiresApiKey: !options.dryRun,
    files: manifest.items.map((item) => ({
      audioId: item.audioId,
      textToSpeak: item.textToSpeak,
      outputPath: join(outputDir, item.suggestedFilename),
    })),
  };
}

export function resolveVoiceScopedOutputDir(outputDir: string, voice: string) {
  return join(outputDir, sanitizeVoiceForPath(voice));
}

export function sanitizeVoiceForPath(voice: string) {
  const sanitized = voice
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "voice";
}

export function validateTtsGenerationPlan(
  plan: TtsGenerationPlan,
  apiKey?: string,
) {
  if (!plan.dryRun && !apiKey) {
    throw new Error(
      "Set TTS_API_KEY or OPENAI_API_KEY to generate audio. Use --dry-run to inspect the manifest without calling a TTS provider.",
    );
  }
}
