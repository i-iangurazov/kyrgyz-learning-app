import { describe, expect, it } from "vitest";

import { buildTtsManifest } from "@/content/audio/tts-manifest";
import {
  createTtsGenerationPlan,
  validateTtsGenerationPlan,
} from "@/content/audio/tts-generation";
import { lessons } from "@/content/curriculum";
import type { Lesson } from "@/content/schemas";

describe("TTS audio manifest", () => {
  it("includes vocabulary items from current seed lessons", () => {
    const manifest = buildTtsManifest(lessons);

    expect(manifest.counts.vocabulary).toBeGreaterThan(0);
    expect(manifest.items).toContainEqual(
      expect.objectContaining({
        id: "k0-u1-l1:vocabulary:salam",
        audioId: "audio-k0-u1-l1-vocab-salam",
        lessonId: "k0-u1-l1",
        contentType: "vocabulary",
        textToSpeak: "Салам",
        language: "ky",
        voiceType: "synthetic",
        reviewStatus: "needs_audio_review",
      }),
    );
  });

  it("includes dialogue lines from current seed lessons", () => {
    const manifest = buildTtsManifest(lessons);

    expect(manifest.counts.dialogue_line).toBeGreaterThan(0);
    expect(manifest.items).toContainEqual(
      expect.objectContaining({
        id: "k0-u1-l1:dialogue_line:dialogue-greeting-1",
        audioId: "audio-k0-u1-l1-dialogue-greeting-1",
        lessonId: "k0-u1-l1",
        contentType: "dialogue_line",
        textToSpeak: "Салам!",
        speakerLabel: "Айжан",
      }),
    );
  });

  it("creates stable manifest IDs and filenames", () => {
    const firstManifest = buildTtsManifest(lessons);
    const secondManifest = buildTtsManifest(lessons);

    expect(firstManifest.items.map((item) => item.id)).toEqual(
      secondManifest.items.map((item) => item.id),
    );
    expect(firstManifest.items[0]).toEqual(
      expect.objectContaining({
        suggestedFilename: expect.stringMatching(/^k0-u1-l1\/audio-.+\.mp3$/),
      }),
    );
  });

  it("skips empty or missing text", () => {
    const lessonWithEmptyAudio = {
      ...lessons[0],
      vocabulary: [
        {
          ...lessons[0].vocabulary[0],
          id: "empty-audio-word",
          audio: {
            ...lessons[0].vocabulary[0].audio,
            id: "audio-empty-audio-word",
            transcript: "   ",
          },
        },
      ],
      dialogues: [],
      texts: [],
      grammarPoints: [
        {
          ...lessons[0].grammarPoints[0],
          examples: [
            {
              ...lessons[0].grammarPoints[0].examples[0],
              id: "empty-grammar-example",
              kyrgyz: "   ",
            },
          ],
        },
      ],
      exercises: [],
    } satisfies Lesson;

    const manifest = buildTtsManifest([lessonWithEmptyAudio]);

    expect(manifest.items).toHaveLength(0);
  });

  it("supports dry-run planning without an API key", () => {
    const manifest = buildTtsManifest(lessons);
    const plan = createTtsGenerationPlan(manifest, {
      dryRun: true,
      outputDir: "test-results/audio/files",
    });

    expect(plan.requiresApiKey).toBe(false);
    expect(plan.itemCount).toBe(manifest.items.length);
    expect(() => validateTtsGenerationPlan(plan)).not.toThrow();
  });

  it("requires an API key for real generation only", () => {
    const manifest = buildTtsManifest(lessons);
    const plan = createTtsGenerationPlan(manifest, {
      dryRun: false,
      outputDir: "test-results/audio/files",
    });

    expect(plan.requiresApiKey).toBe(true);
    expect(() => validateTtsGenerationPlan(plan)).toThrow(
      /TTS_API_KEY|OPENAI_API_KEY/,
    );
  });
});
