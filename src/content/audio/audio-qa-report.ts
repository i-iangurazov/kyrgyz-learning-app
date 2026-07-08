import { join } from "node:path";

import type { AudioAttachmentMap } from "@/content/audio/audio-attachment";

export type AudioQaReviewFields = {
  pronunciation_ok: boolean | null;
  kyrgyz_accent_quality: string;
  notes: string;
  approved_for_beta: boolean;
};

export type AudioQaReportItem = AudioQaReviewFields & {
  audioId: string;
  lessonId: string;
  contentType: string;
  sourceId: string;
  voice: string;
  filePath: string;
  transcript: string;
  status: string;
};

export type AudioQaReport = {
  schemaVersion: "audio-qa-report-v1";
  generatedFromAttachmentMap: string;
  voice: string;
  items: AudioQaReportItem[];
  summary: {
    total: number;
    attached: number;
    missing: number;
    approvedForBeta: 0;
  };
};

export function buildAudioQaReport(
  attachmentMap: AudioAttachmentMap,
  options: { generatedFromAttachmentMap: string; voice?: string },
): AudioQaReport {
  const voice = options.voice ?? attachmentMap.items[0]?.voice ?? "unknown";
  const items = attachmentMap.items.map((item) => ({
    audioId: item.audioId,
    lessonId: item.lessonId,
    contentType: item.contentType,
    sourceId: item.sourceId,
    voice: item.voice ?? voice,
    filePath:
      item.generatedFilePath ??
      join(attachmentMap.generatedAudioDir, item.expectedFilename),
    transcript: item.transcript,
    status: item.status,
    pronunciation_ok: null,
    kyrgyz_accent_quality: "",
    notes: "",
    approved_for_beta: false,
  }));

  return {
    schemaVersion: "audio-qa-report-v1",
    generatedFromAttachmentMap: options.generatedFromAttachmentMap,
    voice,
    items,
    summary: {
      total: items.length,
      attached: items.filter((item) => item.status === "attached").length,
      missing: items.filter((item) => item.status === "missing").length,
      approvedForBeta: 0,
    },
  };
}

export function renderAudioQaReportMarkdown(report: AudioQaReport) {
  const lines = [
    "# Audio QA Report",
    "",
    `Voice: ${report.voice}`,
    `Items: ${report.summary.total}`,
    `Attached files: ${report.summary.attached}`,
    `Missing files: ${report.summary.missing}`,
    "",
    "No item is approved automatically. Fill the review fields manually after listening.",
    "",
  ];

  for (const item of report.items) {
    lines.push(
      `## ${item.audioId}`,
      "",
      `- Lesson: ${item.lessonId}`,
      `- Content type: ${item.contentType}`,
      `- Source ID: ${item.sourceId}`,
      `- Voice: ${item.voice}`,
      `- File path: ${item.filePath}`,
      `- Transcript: ${item.transcript}`,
      `- Status: ${item.status}`,
      "- pronunciation_ok: ",
      "- kyrgyz_accent_quality: ",
      "- notes: ",
      "- approved_for_beta: false",
      "",
    );
  }

  return `${lines.join("\n")}\n`;
}
