import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import { buildAudioAttachmentMap } from "@/content/audio/audio-attachment";
import { maybeApplyLocalAudioPilotToLessons } from "@/content/audio/local-audio-pilot";
import { buildTtsManifest } from "@/content/audio/tts-manifest";
import { lessons } from "@/content/curriculum";

describe("local audio pilot overlay", () => {
  it("leaves lessons unchanged by default", async () => {
    const result = await maybeApplyLocalAudioPilotToLessons([lessons[0]], {});

    expect(result).toEqual([lessons[0]]);
  });

  it("attaches playable local URLs only when explicitly enabled", async () => {
    const manifest = buildTtsManifest([lessons[0]]);
    const firstItem = manifest.items[0];
    const publicDir = await mkdtemp(join(tmpdir(), "kyrgyz-public-audio-"));
    const attachmentMapPath = join(
      await mkdtemp(join(tmpdir(), "kyrgyz-audio-map-")),
      "audio-attachment-map.json",
    );
    const audioPath = join(publicDir, firstItem.suggestedFilename);
    await mkdir(dirname(audioPath), { recursive: true });
    await writeFile(audioPath, "fake mp3 fixture");
    const attachmentMap = await buildAudioAttachmentMap(manifest, {
      generatedAudioDir: publicDir,
    });
    await writeFile(attachmentMapPath, JSON.stringify(attachmentMap));

    const [lessonWithPilotAudio] = await maybeApplyLocalAudioPilotToLessons(
      [lessons[0]],
      {
        LOCAL_AUDIO_PILOT: "1",
        LOCAL_AUDIO_ATTACHMENT_MAP: attachmentMapPath,
        LOCAL_AUDIO_PUBLIC_DIR: publicDir,
        LOCAL_AUDIO_PUBLIC_URL_BASE: "http://127.0.0.1:3000/generated-audio",
      },
    );

    expect(lessonWithPilotAudio.vocabulary[0].audio.url).toBe(
      `http://127.0.0.1:3000/generated-audio/${firstItem.suggestedFilename}`,
    );
    expect(lessonWithPilotAudio.vocabulary[0].audio.audioReviewStatus).toBe(
      "needs_review",
    );
  });
});
