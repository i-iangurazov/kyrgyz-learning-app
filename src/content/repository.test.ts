import { afterEach, describe, expect, it, vi } from "vitest";

import { lessons, levels, units } from "@/content/curriculum";
import {
  getConfiguredContentSource,
  getCurriculumContent,
  getLessonById,
  listLessons,
} from "@/content/repository";
import { lessonSchema } from "@/content/schemas";

const originalContentSource = process.env.CONTENT_SOURCE;
const originalDatabaseUrl = process.env.DATABASE_URL;
const originalLocalAudioPilot = process.env.LOCAL_AUDIO_PILOT;
const originalLocalAudioAttachmentMap = process.env.LOCAL_AUDIO_ATTACHMENT_MAP;

afterEach(() => {
  restoreEnv("CONTENT_SOURCE", originalContentSource);
  restoreEnv("DATABASE_URL", originalDatabaseUrl);
  restoreEnv("LOCAL_AUDIO_PILOT", originalLocalAudioPilot);
  restoreEnv("LOCAL_AUDIO_ATTACHMENT_MAP", originalLocalAudioAttachmentMap);
  vi.restoreAllMocks();
});

describe("content repository", () => {
  it("defaults to TypeScript seed content when CONTENT_SOURCE is missing", async () => {
    delete process.env.CONTENT_SOURCE;
    delete process.env.DATABASE_URL;
    delete process.env.LOCAL_AUDIO_PILOT;

    expect(getConfiguredContentSource()).toBe("seed");
    await expect(listLessons()).resolves.toEqual(lessons);
  });

  it("uses TypeScript seed content when CONTENT_SOURCE=seed", async () => {
    process.env.CONTENT_SOURCE = "seed";
    delete process.env.DATABASE_URL;
    delete process.env.LOCAL_AUDIO_PILOT;

    const curriculum = await getCurriculumContent();

    expect(curriculum).toEqual({ levels, units, lessons });
  });

  it("falls back to seed content when CONTENT_SOURCE=postgres lacks DATABASE_URL", async () => {
    process.env.CONTENT_SOURCE = "postgres";
    delete process.env.DATABASE_URL;
    delete process.env.LOCAL_AUDIO_PILOT;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const lesson = await getLessonById(lessons[0].id);

    expect(lesson).toEqual(lessons[0]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("using TypeScript seed content fallback"),
    );
  });

  it("returns lessons that still validate against lesson-v2", async () => {
    delete process.env.CONTENT_SOURCE;
    delete process.env.DATABASE_URL;
    delete process.env.LOCAL_AUDIO_PILOT;

    const loadedLessons = await listLessons();

    expect(lessonSchema.array().parse(loadedLessons)).toEqual(lessons);
  });
});

function restoreEnv(
  key:
    | "CONTENT_SOURCE"
    | "DATABASE_URL"
    | "LOCAL_AUDIO_PILOT"
    | "LOCAL_AUDIO_ATTACHMENT_MAP",
  value: string | undefined,
) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
