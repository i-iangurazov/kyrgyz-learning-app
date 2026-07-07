import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  applyAudioAttachmentMapToLessons,
  type AudioAttachmentMap,
} from "@/content/audio/audio-attachment";
import type { Lesson } from "@/content/schemas";

const defaultAttachmentMapPath =
  "test-results/audio/pilot/audio-attachment-map-k0-u1-l1.json";
const defaultPublicDir = "public/generated-audio";
const defaultPublicUrlBase = "http://127.0.0.1:3000/generated-audio";

export async function maybeApplyLocalAudioPilotToLessons(
  lessons: Lesson[],
  env: Partial<NodeJS.ProcessEnv> = process.env,
): Promise<Lesson[]> {
  if (!isLocalAudioPilotEnabled(env)) {
    return lessons;
  }

  try {
    const attachmentMap = JSON.parse(
      await readFile(
        resolvePath(env.LOCAL_AUDIO_ATTACHMENT_MAP ?? defaultAttachmentMapPath),
        "utf8",
      ),
    ) as AudioAttachmentMap;

    return applyAudioAttachmentMapToLessons(lessons, attachmentMap, {
      publicDir: resolvePath(env.LOCAL_AUDIO_PUBLIC_DIR ?? defaultPublicDir),
      publicUrlBase: env.LOCAL_AUDIO_PUBLIC_URL_BASE ?? defaultPublicUrlBase,
    });
  } catch (error) {
    logLocalAudioPilotWarning(error);
    return lessons;
  }
}

export function isLocalAudioPilotEnabled(
  env: Partial<NodeJS.ProcessEnv> = process.env,
) {
  return env.LOCAL_AUDIO_PILOT === "1" || env.LOCAL_AUDIO_PILOT === "true";
}

function resolvePath(path: string) {
  return resolve(process.cwd(), path);
}

function logLocalAudioPilotWarning(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(
    `[audio] Local audio pilot could not attach generated audio; using normal lesson audio placeholders. ${message}`,
  );
}
