import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  applyAudioAttachmentMapToLessons,
  buildAudioAttachmentMap,
  buildAudioAttachmentApplyPlan,
  isSafeLocalGeneratedPath,
  validateAudioAttachmentMap,
  type AudioAttachmentMap,
} from "@/content/audio/audio-attachment";
import {
  buildTtsManifest,
  filterTtsManifestByLesson,
} from "@/content/audio/tts-manifest";
import { lessons } from "@/content/curriculum";

describe("audio attachment mapping", () => {
  it("generates attached entries when matching files exist", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const firstItem = manifest.items[0];
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const audioPath = join(audioDir, firstItem.suggestedFilename);
    await mkdir(dirname(audioPath), { recursive: true });
    await writeFile(audioPath, "fake mp3 fixture");

    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });
    const validation = validateAudioAttachmentMap(attachmentMap, manifest);

    expect(attachmentMap.items[0]).toEqual(
      expect.objectContaining({
        audioId: firstItem.audioId,
        contentType: firstItem.contentType,
        lessonId: firstItem.lessonId,
        transcript: firstItem.textToSpeak,
        language: "ky",
        voiceType: "synthetic",
        reviewStatus: "needs_audio_review",
        generatedFilePath: audioPath,
        status: "attached",
      }),
    );
    expect(attachmentMap.summary.attached).toBe(1);
    expect(validation.isValid).toBe(true);
    expect(validation.attachedAudioIds).toContain(firstItem.audioId);
  });

  it("reports missing files without treating the map as fully attached", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));

    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });
    const validation = validateAudioAttachmentMap(attachmentMap, manifest);

    expect(attachmentMap.summary.attached).toBe(0);
    expect(attachmentMap.summary.missing).toBe(manifest.items.length);
    expect(attachmentMap.items[0]).toEqual(
      expect.objectContaining({
        generatedFilePath: null,
        status: "missing",
      }),
    );
    expect(validation.isValid).toBe(true);
    expect(validation.allFilesAttached).toBe(false);
    expect(validation.missingAudioIds).toHaveLength(manifest.items.length);
  });

  it("can build a filtered pilot attachment map", async () => {
    const manifest = filterTtsManifestByLesson(
      buildTtsManifest(lessons),
      "k0-u1-l1",
    );
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });

    expect(attachmentMap.items).toHaveLength(manifest.items.length);
    expect(
      attachmentMap.items.every((item) => item.lessonId === "k0-u1-l1"),
    ).toBe(true);
  });

  it("can build a voice-specific pilot attachment map", async () => {
    const manifest = filterTtsManifestByLesson(
      buildTtsManifest(lessons),
      "k0-u1-l1",
    );
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
      voice: "Echo Voice",
      voiceFolder: true,
    });

    expect(attachmentMap.generatedAudioDir).toBe(
      join(audioDir, "echo-voice"),
    );
    expect(attachmentMap.items[0]).toEqual(
      expect.objectContaining({
        lessonId: "k0-u1-l1",
        voice: "Echo Voice",
        generatedFilePath: null,
        status: "missing",
      }),
    );
  });


  it("fails validation for unknown audio IDs", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });
    const invalidMap: AudioAttachmentMap = {
      ...attachmentMap,
      items: [
        ...attachmentMap.items,
        {
          ...attachmentMap.items[0],
          audioId: "audio-unknown",
          manifestItemId: "unknown:item",
        },
      ],
      summary: {
        ...attachmentMap.summary,
        total: attachmentMap.summary.total + 1,
        missing: attachmentMap.summary.missing + 1,
      },
    };

    const validation = validateAudioAttachmentMap(invalidMap, manifest);

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain(
      "Unknown audio ID in attachment map: audio-unknown",
    );
  });

  it("keeps synthetic audio in needs-review status", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });

    expect(attachmentMap.items.every((item) => item.voiceType === "synthetic")).toBe(
      true,
    );
    expect(
      attachmentMap.items.every(
        (item) => item.reviewStatus === "needs_audio_review",
      ),
    ).toBe(true);
  });

  it("does not allow automatic approval status", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const audioDir = await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-"));
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: audioDir,
    });
    const invalidMap = {
      ...attachmentMap,
      items: [
        {
          ...attachmentMap.items[0],
          reviewStatus: "approved",
        },
      ],
      summary: {
        total: 1,
        attached: 0,
        missing: 1,
      },
    } as unknown as AudioAttachmentMap;

    const validation = validateAudioAttachmentMap(invalidMap, manifest);

    expect(validation.isValid).toBe(false);
    expect(validation.errors[0]).toContain("needs_audio_review");
  });

  it("builds an apply dry-run plan without mutating seed lessons", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const firstItem = manifest.items[0];
    const publicDir = await mkdtemp(join(tmpdir(), "kyrgyz-public-audio-"));
    const audioPath = join(publicDir, firstItem.suggestedFilename);
    await mkdir(dirname(audioPath), { recursive: true });
    await writeFile(audioPath, "fake mp3 fixture");
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: publicDir,
    });

    const plan = buildAudioAttachmentApplyPlan([lessons[0]], attachmentMap, {
      publicDir,
      publicUrlBase: "http://127.0.0.1:3000/generated-audio",
    });

    expect(plan.summary.attachable).toBeGreaterThan(0);
    expect(plan.items[0]).toEqual(
      expect.objectContaining({
        audioId: firstItem.audioId,
        canAttach: true,
        currentUrl: null,
        proposedReviewStatus: "needs_review",
        proposedUrl: expect.stringContaining("/generated-audio/"),
      }),
    );
    expect(lessons[0].vocabulary[0].audio.url).toBeUndefined();
  });

  it("can apply local pilot URLs while keeping synthetic audio in review", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const firstItem = manifest.items[0];
    const publicDir = await mkdtemp(join(tmpdir(), "kyrgyz-public-audio-"));
    const audioPath = join(publicDir, firstItem.suggestedFilename);
    await mkdir(dirname(audioPath), { recursive: true });
    await writeFile(audioPath, "fake mp3 fixture");
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: publicDir,
    });

    const [lessonWithAudio] = applyAudioAttachmentMapToLessons(
      [lessons[0]],
      attachmentMap,
      {
        publicDir,
        publicUrlBase: "http://127.0.0.1:3000/generated-audio",
      },
    );

    expect(lessonWithAudio.vocabulary[0].audio.url).toBe(
      `http://127.0.0.1:3000/generated-audio/${firstItem.suggestedFilename}`,
    );
    expect(lessonWithAudio.vocabulary[0].audio.voiceType).toBe("synthetic");
    expect(lessonWithAudio.vocabulary[0].audio.audioReviewStatus).toBe(
      "needs_review",
    );
  });

  it("rejects unsafe generated file paths", () => {
    expect(
      isSafeLocalGeneratedPath(
        "https://cdn.example.com/audio.mp3",
        "/tmp/generated-audio",
      ),
    ).toBe(false);
    expect(
      isSafeLocalGeneratedPath(
        "/tmp/generated-audio/../secret/audio.mp3",
        "/tmp/generated-audio",
      ),
    ).toBe(false);
    expect(
      isSafeLocalGeneratedPath(
        "/tmp/generated-audio/k0-u1-l1/audio.mp3",
        "/tmp/generated-audio",
      ),
    ).toBe(true);
  });
});
