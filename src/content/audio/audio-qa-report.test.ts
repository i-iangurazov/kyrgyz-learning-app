import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { buildAudioAttachmentMap } from "@/content/audio/audio-attachment";
import {
  buildAudioQaReport,
  renderAudioQaReportMarkdown,
} from "@/content/audio/audio-qa-report";
import { buildTtsManifest } from "@/content/audio/tts-manifest";
import { lessons } from "@/content/curriculum";

describe("audio QA report", () => {
  it("creates manual review fields without approving audio automatically", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-qa-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
      voice: "Echo",
      voiceFolder: true,
    });

    const report = buildAudioQaReport(attachmentMap, {
      generatedFromAttachmentMap: "test-results/audio/voices/echo/audio-attachment-map.json",
      voice: "Echo",
    });
    const markdown = renderAudioQaReportMarkdown(report);

    expect(report.voice).toBe("Echo");
    expect(report.items).toHaveLength(manifest.items.length);
    expect(report.items[0]).toEqual(
      expect.objectContaining({
        voice: "Echo",
        transcript: manifest.items[0].textToSpeak,
        pronunciation_ok: null,
        kyrgyz_accent_quality: "",
        notes: "",
        approved_for_beta: false,
      }),
    );
    expect(report.summary.approvedForBeta).toBe(0);
    expect(markdown).toContain("approved_for_beta: false");
    expect(markdown).toContain(manifest.items[0].audioId);
  });
});
