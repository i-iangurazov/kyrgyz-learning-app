import type { AudioAsset, Lesson } from "@/content/schemas";

export const ttsContentTypes = [
  "vocabulary",
  "dialogue_line",
  "reading_paragraph",
  "grammar_example",
  "listening_prompt",
] as const;

export type TtsContentType = (typeof ttsContentTypes)[number];

export type TtsReviewStatus = "needs_audio_review";

export type TtsManifestItem = {
  id: string;
  audioId: string;
  lessonId: string;
  contentType: TtsContentType;
  sourceId: string;
  textToSpeak: string;
  language: "ky";
  suggestedFilename: string;
  voiceType: "synthetic";
  reviewStatus: TtsReviewStatus;
  speakerLabel?: string;
};

export type TtsManifestCounts = Record<TtsContentType, number> & {
  total: number;
};

export type TtsManifest = {
  schemaVersion: "tts-manifest-v1";
  generatedFrom: string;
  lessonId?: string;
  items: TtsManifestItem[];
  counts: TtsManifestCounts;
};

type BuildTtsManifestOptions = {
  generatedFrom?: string;
  lessonId?: string;
};

type AudioBackedManifestInput = {
  lessonId: string;
  contentType: Extract<
    TtsContentType,
    "vocabulary" | "dialogue_line" | "reading_paragraph" | "listening_prompt"
  >;
  sourceId: string;
  audio?: AudioAsset;
};

type TextBackedManifestInput = {
  lessonId: string;
  contentType: Extract<TtsContentType, "grammar_example">;
  sourceId: string;
  text: string;
};

export function buildTtsManifest(
  lessons: Lesson[],
  options: BuildTtsManifestOptions = {},
): TtsManifest {
  const items: TtsManifestItem[] = [];
  const seenItemIds = new Set<string>();
  const selectedLessons = options.lessonId
    ? lessons.filter((lesson) => lesson.id === options.lessonId)
    : lessons;

  for (const lesson of selectedLessons) {
    for (const vocabularyItem of lesson.vocabulary) {
      addManifestItem(
        items,
        seenItemIds,
        audioBackedManifestItem({
          lessonId: lesson.id,
          contentType: "vocabulary",
          sourceId: vocabularyItem.id,
          audio: vocabularyItem.audio,
        }),
      );
    }

    for (const dialogue of lesson.dialogues) {
      for (const line of dialogue.lines) {
        addManifestItem(
          items,
          seenItemIds,
          audioBackedManifestItem({
            lessonId: lesson.id,
            contentType: "dialogue_line",
            sourceId: line.id,
            audio: line.audio,
          }),
        );
      }
    }

    for (const readingText of lesson.texts) {
      for (const paragraph of readingText.paragraphs) {
        addManifestItem(
          items,
          seenItemIds,
          audioBackedManifestItem({
            lessonId: lesson.id,
            contentType: "reading_paragraph",
            sourceId: paragraph.id,
            audio: paragraph.audio,
          }),
        );
      }
    }

    for (const grammarPoint of lesson.grammarPoints) {
      for (const example of grammarPoint.examples) {
        addManifestItem(
          items,
          seenItemIds,
          textBackedManifestItem({
            lessonId: lesson.id,
            contentType: "grammar_example",
            sourceId: `${grammarPoint.id}:${example.id}`,
            text: example.kyrgyz,
          }),
        );
      }
    }

    for (const exercise of lesson.exercises) {
      if (exercise.kind !== "listening_choice") {
        continue;
      }

      for (const item of exercise.items) {
        addManifestItem(
          items,
          seenItemIds,
          audioBackedManifestItem({
            lessonId: lesson.id,
            contentType: "listening_prompt",
            sourceId: item.id,
            audio: item.audio,
          }),
        );
      }
    }
  }

  return {
    schemaVersion: "tts-manifest-v1",
    generatedFrom: options.generatedFrom ?? "src/content/seed/lessons.ts",
    ...(options.lessonId ? { lessonId: options.lessonId } : {}),
    items,
    counts: countTtsManifestItems(items),
  };
}

export function filterTtsManifestByLesson(
  manifest: TtsManifest,
  lessonId?: string,
): TtsManifest {
  if (!lessonId) {
    return manifest;
  }

  const items = manifest.items.filter((item) => item.lessonId === lessonId);

  return {
    ...manifest,
    lessonId,
    items,
    counts: countTtsManifestItems(items),
  };
}

export function countTtsManifestItems(
  items: TtsManifestItem[],
): TtsManifestCounts {
  const counts = Object.fromEntries(
    ttsContentTypes.map((contentType) => [contentType, 0]),
  ) as Record<TtsContentType, number>;

  for (const item of items) {
    counts[item.contentType] += 1;
  }

  return {
    ...counts,
    total: items.length,
  };
}

function audioBackedManifestItem({
  lessonId,
  contentType,
  sourceId,
  audio,
}: AudioBackedManifestInput): TtsManifestItem | null {
  if (!audio) {
    return null;
  }

  const textToSpeak = audio.transcript.trim();

  if (!textToSpeak) {
    return null;
  }

  return {
    id: `${lessonId}:${contentType}:${sourceId}`,
    audioId: audio.id,
    lessonId,
    contentType,
    sourceId,
    textToSpeak,
    language: "ky",
    suggestedFilename: suggestedTtsFilename(lessonId, audio.id),
    voiceType: "synthetic",
    reviewStatus: "needs_audio_review",
    ...(audio.speakerLabel ? { speakerLabel: audio.speakerLabel } : {}),
  };
}

function textBackedManifestItem({
  lessonId,
  contentType,
  sourceId,
  text,
}: TextBackedManifestInput): TtsManifestItem | null {
  const textToSpeak = text.trim();

  if (!textToSpeak) {
    return null;
  }

  const audioId = `audio-${lessonId}-${sanitizePathPart(sourceId)}`;

  return {
    id: `${lessonId}:${contentType}:${sourceId}`,
    audioId,
    lessonId,
    contentType,
    sourceId,
    textToSpeak,
    language: "ky",
    suggestedFilename: suggestedTtsFilename(lessonId, audioId),
    voiceType: "synthetic",
    reviewStatus: "needs_audio_review",
  };
}

function addManifestItem(
  items: TtsManifestItem[],
  seenItemIds: Set<string>,
  item: TtsManifestItem | null,
) {
  if (!item || seenItemIds.has(item.id)) {
    return;
  }

  seenItemIds.add(item.id);
  items.push(item);
}

function suggestedTtsFilename(lessonId: string, audioId: string) {
  return `${sanitizePathPart(lessonId)}/${sanitizePathPart(audioId)}.mp3`;
}

function sanitizePathPart(value: string) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "audio";
}
