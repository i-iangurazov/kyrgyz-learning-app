import { access } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import type { TtsManifest, TtsManifestItem } from "@/content/audio/tts-manifest";

export type AudioAttachmentStatus = "attached" | "missing";

export type AudioAttachmentMapItem = {
  audioId: string;
  manifestItemId: string;
  lessonId: string;
  contentType: TtsManifestItem["contentType"];
  sourceId: string;
  transcript: string;
  language: "ky";
  voiceType: "synthetic";
  reviewStatus: "needs_audio_review";
  expectedFilename: string;
  generatedFilePath: string | null;
  status: AudioAttachmentStatus;
};

export type AudioAttachmentMapSummary = {
  total: number;
  attached: number;
  missing: number;
};

export type AudioAttachmentMap = {
  schemaVersion: "audio-attachment-map-v1";
  generatedFromManifest: string;
  generatedAudioDir: string;
  items: AudioAttachmentMapItem[];
  summary: AudioAttachmentMapSummary;
};

export type BuildAudioAttachmentMapOptions = {
  generatedFromManifest?: string;
  generatedAudioDir: string;
  fileExists?: (filePath: string) => Promise<boolean>;
};

export type AudioAttachmentValidationResult = {
  isValid: boolean;
  allFilesAttached: boolean;
  errors: string[];
  missingAudioIds: string[];
  attachedAudioIds: string[];
};

export async function buildAudioAttachmentMap(
  manifest: TtsManifest,
  options: BuildAudioAttachmentMapOptions,
): Promise<AudioAttachmentMap> {
  const fileExists = options.fileExists ?? localFileExists;
  const items: AudioAttachmentMapItem[] = [];

  for (const manifestItem of manifest.items) {
    const expectedPath = join(
      options.generatedAudioDir,
      manifestItem.suggestedFilename,
    );
    const hasFile = await fileExists(expectedPath);

    items.push({
      audioId: manifestItem.audioId,
      manifestItemId: manifestItem.id,
      lessonId: manifestItem.lessonId,
      contentType: manifestItem.contentType,
      sourceId: manifestItem.sourceId,
      transcript: manifestItem.textToSpeak,
      language: manifestItem.language,
      voiceType: "synthetic",
      reviewStatus: "needs_audio_review",
      expectedFilename: manifestItem.suggestedFilename,
      generatedFilePath: hasFile ? expectedPath : null,
      status: hasFile ? "attached" : "missing",
    });
  }

  return {
    schemaVersion: "audio-attachment-map-v1",
    generatedFromManifest:
      options.generatedFromManifest ?? manifest.generatedFrom,
    generatedAudioDir: options.generatedAudioDir,
    items,
    summary: summarizeAttachmentItems(items),
  };
}

export function validateAudioAttachmentMap(
  attachmentMap: AudioAttachmentMap,
  manifest: TtsManifest,
): AudioAttachmentValidationResult {
  const errors: string[] = [];
  const manifestAudioIds = new Set(manifest.items.map((item) => item.audioId));
  const mapAudioIds = new Set<string>();
  const missingAudioIds: string[] = [];
  const attachedAudioIds: string[] = [];

  for (const item of attachmentMap.items) {
    if (!manifestAudioIds.has(item.audioId)) {
      errors.push(`Unknown audio ID in attachment map: ${item.audioId}`);
    }

    if (mapAudioIds.has(item.audioId)) {
      errors.push(`Duplicate audio ID in attachment map: ${item.audioId}`);
    }
    mapAudioIds.add(item.audioId);

    if (item.voiceType !== "synthetic") {
      errors.push(`Attachment ${item.audioId} must remain synthetic.`);
    }

    if (item.reviewStatus !== "needs_audio_review") {
      errors.push(
        `Attachment ${item.audioId} must remain needs_audio_review until manually reviewed.`,
      );
    }

    if (item.status === "attached") {
      if (!item.generatedFilePath) {
        errors.push(`Attachment ${item.audioId} is attached without a file path.`);
      } else if (
        !isSafeLocalGeneratedPath(
          item.generatedFilePath,
          attachmentMap.generatedAudioDir,
        )
      ) {
        errors.push(
          `Attachment ${item.audioId} has an unsafe generated file path: ${item.generatedFilePath}`,
        );
      }
      attachedAudioIds.push(item.audioId);
    } else {
      if (item.generatedFilePath) {
        errors.push(`Attachment ${item.audioId} is missing but has a file path.`);
      }
      missingAudioIds.push(item.audioId);
    }
  }

  for (const manifestItem of manifest.items) {
    if (!mapAudioIds.has(manifestItem.audioId)) {
      errors.push(`Manifest audio ID missing from attachment map: ${manifestItem.audioId}`);
    }
  }

  const summary = summarizeAttachmentItems(attachmentMap.items);
  if (
    attachmentMap.summary.total !== summary.total ||
    attachmentMap.summary.attached !== summary.attached ||
    attachmentMap.summary.missing !== summary.missing
  ) {
    errors.push("Attachment map summary does not match item statuses.");
  }

  return {
    isValid: errors.length === 0,
    allFilesAttached: missingAudioIds.length === 0,
    errors,
    missingAudioIds,
    attachedAudioIds,
  };
}

export function isSafeLocalGeneratedPath(filePath: string, rootDir: string) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(filePath)) {
    return false;
  }

  const resolvedRoot = resolve(rootDir);
  const resolvedFile = resolve(filePath);
  const relativePath = relative(resolvedRoot, resolvedFile);

  return Boolean(relativePath) && !relativePath.startsWith("..") && !isAbsolute(relativePath);
}

function summarizeAttachmentItems(
  items: AudioAttachmentMapItem[],
): AudioAttachmentMapSummary {
  const attached = items.filter((item) => item.status === "attached").length;

  return {
    total: items.length,
    attached,
    missing: items.length - attached,
  };
}

async function localFileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
