import { describe, expect, it } from "vitest";

import {
  buildMethodistReviewPacketExport,
  collectLessonAudioRefs,
} from "@/content/review-packets";
import { lessons } from "@/content/curriculum";

describe("methodist review packet export", () => {
  it("includes all current seed lesson IDs", () => {
    const reviewPacketExport = buildMethodistReviewPacketExport(lessons);

    expect(reviewPacketExport.packets.map((packet) => packet.lessonId)).toEqual([
      "k0-u1-l1",
      "k0-u1-l2",
      "k1-u1-l1",
    ]);
    expect(reviewPacketExport.counts.lessonsExported).toBe(3);
  });

  it("includes vocabulary, dialogue, reading, grammar, and exercise sections", () => {
    const reviewPacketExport = buildMethodistReviewPacketExport(lessons);
    const packet = reviewPacketExport.packets.find(
      (item) => item.lessonId === "k1-u1-l1",
    );

    expect(packet?.markdown).toContain("## 3. Vocabulary Review");
    expect(packet?.markdown).toContain("## 4. Dialogue Review");
    expect(packet?.markdown).toContain("## 5. Reading Text Review");
    expect(packet?.markdown).toContain("## 6. Grammar Review");
    expect(packet?.markdown).toContain("## 7. Exercise Review");
    expect(packet?.markdown).toContain("`ex-name-correction`");
  });

  it("preserves Kyrgyz text and audio IDs", () => {
    const reviewPacketExport = buildMethodistReviewPacketExport(lessons);
    const packet = reviewPacketExport.packets.find(
      (item) => item.lessonId === "k1-u1-l1",
    );

    expect(packet?.markdown).toContain("Атың ким?");
    expect(packet?.markdown).toContain("Атым Элина. Сенчи?");
    expect(packet?.markdown).toContain("audio-k1-u1-l1-dialogue-introductions-1");
  });

  it("includes an empty review decision block without approving content", () => {
    const reviewPacketExport = buildMethodistReviewPacketExport(lessons);
    const packet = reviewPacketExport.packets[0];

    expect(packet.markdown).toContain("## 9. Overall Review Decision");
    expect(packet.markdown).toContain("- [ ] approved_for_beta");
    expect(packet.markdown).toContain("- [ ] approved_for_production");
    expect(packet.markdown).not.toContain("- [x] approved_for_beta");
    expect(packet.markdown).not.toContain("- [x] approved_for_production");
    expect(packet.json.decision.status).toBe("not_selected");
  });

  it("collects audio transcript refs without marking them approved", () => {
    const audioRefs = collectLessonAudioRefs(lessons[0]);

    expect(audioRefs.length).toBeGreaterThan(0);
    expect(audioRefs).toContainEqual(
      expect.objectContaining({
        id: "audio-k0-u1-l1-vocab-salam",
        transcript: "Салам",
        reviewStatus: "not_recorded",
        voiceType: "placeholder",
      }),
    );
    expect(audioRefs.every((audioRef) => audioRef.reviewStatus !== "approved")).toBe(
      true,
    );
  });
});
