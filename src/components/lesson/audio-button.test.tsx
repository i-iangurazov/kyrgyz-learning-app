import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AudioButton } from "@/components/lesson/audio-button";
import type { AudioAsset } from "@/content/schemas";

const playableAudio: AudioAsset = {
  id: "audio-test-playable",
  url: "https://cdn.example.com/audio/test.mp3",
  transcript: "Салам",
  language: "ky",
  voiceType: "human",
  sourceNotes: "Test fixture source note.",
  rightsNotes: "Test fixture rights note.",
  methodistReviewStatus: "reviewed",
  audioReviewStatus: "needs_review",
};

const pendingAudio: AudioAsset = {
  id: "audio-test-pending",
  storageKey: "pending/test.mp3",
  transcript: "Рахмат",
  language: "ky",
  voiceType: "placeholder",
  sourceNotes: "Test fixture source note.",
  rightsNotes: "Test fixture rights note.",
  methodistReviewStatus: "not_reviewed",
  audioReviewStatus: "not_recorded",
};

describe("AudioButton", () => {
  it("renders an enabled play control when a URL exists", () => {
    render(<AudioButton audio={playableAudio} ariaLabel="Слушать слово" />);

    const button = screen.getByRole("button", { name: "Слушать слово" });

    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Слушать");
    expect(button).not.toHaveTextContent("Салам");
  });

  it("renders a clean disabled state when audio is unavailable", () => {
    render(<AudioButton audio={pendingAudio} ariaLabel="Слушать слово" />);

    const button = screen.getByRole("button", { name: "Слушать слово: скоро" });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Скоро");
    expect(button).not.toHaveTextContent("Рахмат");
  });
});
