import { access } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import type { TtsManifest, TtsManifestItem } from "@/content/audio/tts-manifest";
import type { AudioAsset, Lesson } from "@/content/schemas";

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

export type AudioAttachmentApplyPlanItem = {
  audioId: string;
  lessonId: string;
  contentType: TtsManifestItem["contentType"];
  sourceId: string;
  status: AudioAttachmentStatus;
  canAttach: boolean;
  reason: string;
  currentUrl: string | null;
  proposedUrl: string | null;
  currentReviewStatus: AudioAsset["audioReviewStatus"] | null;
  proposedReviewStatus: "needs_review";
};

export type AudioAttachmentApplyPlan = {
  schemaVersion: "audio-attachment-apply-plan-v1";
  publicDir: string;
  publicUrlBase: string;
  items: AudioAttachmentApplyPlanItem[];
  summary: {
    total: number;
    attachable: number;
    missingFiles: number;
    missingSeedRefs: number;
  };
};

export type BuildAudioAttachmentApplyPlanOptions = {
  publicDir: string;
  publicUrlBase: string;
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

export function buildAudioAttachmentApplyPlan(
  lessons: Lesson[],
  attachmentMap: AudioAttachmentMap,
  options: BuildAudioAttachmentApplyPlanOptions,
): AudioAttachmentApplyPlan {
  const audioRefsById = collectLessonAudioRefs(lessons);
  const items = attachmentMap.items.map((item) => {
    const audioRef = audioRefsById.get(item.audioId);
    const proposedUrl =
      item.status === "attached" && item.generatedFilePath
        ? toPublicAudioUrl(
            item.generatedFilePath,
            options.publicDir,
            options.publicUrlBase,
          )
        : null;
    const canAttach = Boolean(audioRef && proposedUrl);

    return {
      audioId: item.audioId,
      lessonId: item.lessonId,
      contentType: item.contentType,
      sourceId: item.sourceId,
      status: item.status,
      canAttach,
      reason: getApplyPlanReason(item, audioRef, proposedUrl),
      currentUrl: audioRef?.audio.url ?? null,
      proposedUrl,
      currentReviewStatus: audioRef?.audio.audioReviewStatus ?? null,
      proposedReviewStatus: "needs_review" as const,
    };
  });

  return {
    schemaVersion: "audio-attachment-apply-plan-v1",
    publicDir: options.publicDir,
    publicUrlBase: options.publicUrlBase,
    items,
    summary: {
      total: items.length,
      attachable: items.filter((item) => item.canAttach).length,
      missingFiles: items.filter((item) => item.status === "missing").length,
      missingSeedRefs: items.filter(
        (item) => item.status === "attached" && item.reason === "No seed audio field exists for this attachment.",
      ).length,
    },
  };
}

export function applyAudioAttachmentMapToLessons(
  lessons: Lesson[],
  attachmentMap: AudioAttachmentMap,
  options: BuildAudioAttachmentApplyPlanOptions,
): Lesson[] {
  const plan = buildAudioAttachmentApplyPlan(lessons, attachmentMap, options);
  const urlByAudioId = new Map(
    plan.items
      .filter((item) => item.canAttach && item.proposedUrl)
      .map((item) => [item.audioId, item.proposedUrl as string]),
  );

  if (urlByAudioId.size === 0) {
    return lessons;
  }

  const attachAudio = (audio: AudioAsset): AudioAsset => {
    const url = urlByAudioId.get(audio.id);

    if (!url) {
      return audio;
    }

    return {
      ...audio,
      url,
      voiceType: "synthetic",
      audioReviewStatus: "needs_review",
    };
  };

  return lessons.map((lesson) => ({
    ...lesson,
    vocabulary: lesson.vocabulary.map((item) => ({
      ...item,
      audio: attachAudio(item.audio),
    })),
    dialogues: lesson.dialogues.map((dialogue) => ({
      ...dialogue,
      audio: attachAudio(dialogue.audio),
      lines: dialogue.lines.map((line) => ({
        ...line,
        audio: attachAudio(line.audio),
      })),
    })),
    texts: lesson.texts.map((text) => ({
      ...text,
      paragraphs: text.paragraphs.map((paragraph) => ({
        ...paragraph,
        audio: attachAudio(paragraph.audio),
      })),
    })),
    exercises: lesson.exercises.map((exercise) => ({
      ...exercise,
      items: exercise.items.map((item) =>
        item.audio
          ? {
              ...item,
              audio: attachAudio(item.audio),
            }
          : item,
      ),
    })),
  }));
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

export function toPublicAudioUrl(
  filePath: string,
  publicDir: string,
  publicUrlBase: string,
) {
  if (!isSafeLocalGeneratedPath(filePath, publicDir)) {
    return null;
  }

  const relativePath = relative(resolve(publicDir), resolve(filePath))
    .split(/[\\/]+/)
    .map(encodeURIComponent)
    .join("/");
  const trimmedBase = publicUrlBase.replace(/\/+$/, "");

  return `${trimmedBase}/${relativePath}`;
}

type LessonAudioRef = {
  audio: AudioAsset;
};

function collectLessonAudioRefs(lessons: Lesson[]) {
  const audioRefs = new Map<string, LessonAudioRef>();

  for (const lesson of lessons) {
    for (const vocabularyItem of lesson.vocabulary) {
      audioRefs.set(vocabularyItem.audio.id, { audio: vocabularyItem.audio });
    }

    for (const dialogue of lesson.dialogues) {
      audioRefs.set(dialogue.audio.id, { audio: dialogue.audio });

      for (const line of dialogue.lines) {
        audioRefs.set(line.audio.id, { audio: line.audio });
      }
    }

    for (const text of lesson.texts) {
      for (const paragraph of text.paragraphs) {
        audioRefs.set(paragraph.audio.id, { audio: paragraph.audio });
      }
    }

    for (const exercise of lesson.exercises) {
      for (const item of exercise.items) {
        if (item.audio) {
          audioRefs.set(item.audio.id, { audio: item.audio });
        }
      }
    }
  }

  return audioRefs;
}

function getApplyPlanReason(
  item: AudioAttachmentMapItem,
  audioRef: LessonAudioRef | undefined,
  proposedUrl: string | null,
) {
  if (item.status === "missing") {
    return "Generated audio file is missing.";
  }

  if (!audioRef) {
    return "No seed audio field exists for this attachment.";
  }

  if (!proposedUrl) {
    return "Generated file path is outside the configured public audio directory.";
  }

  return "Ready for local playback validation; review status remains needs_review.";
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
