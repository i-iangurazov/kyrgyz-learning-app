import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { PracticeReviewQueue } from "@/components/practice/practice-review-queue";
import { lessons } from "@/content/curriculum";
import {
  defaultProgress,
  emptyLessonPracticeProgress,
  progressStorageKey,
  type LocalProgress,
} from "@/lib/progress";

function seedProgress(progress: LocalProgress) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

function makeProgress({
  corrected = false,
  missedKind = "multiple_choice",
}: {
  corrected?: boolean;
  missedKind?: "multiple_choice" | "fill_blank" | "sentence_builder" | "fallback";
} = {}): LocalProgress {
  const missedItem =
    missedKind === "fill_blank"
      ? {
          lessonId: "k0-u1-l1",
          exerciseId: "ex-greeting-fill",
          itemId: "item-jakshy-rahmat",
          submittedAnswer: "салам",
          submittedAnswerDisplay: "салам",
          correctAnswerDisplay: "рахмат",
          explanation: "Jakshy, rahmat is a short polite reply.",
          feedback: "Not quite. Look at the lesson words again.",
          corrected,
          retryAnswer: corrected ? "рахмат" : undefined,
          retryAnswerDisplay: corrected ? "рахмат" : undefined,
          retryAttempts: corrected ? 1 : 0,
          updatedAt: "2026-07-08T00:00:00.000Z",
        }
      : missedKind === "sentence_builder"
        ? {
            lessonId: "k1-u1-l1",
            exerciseId: "ex-name-build",
            itemId: "item-build-atym-elina",
            submittedAnswer: "tile-elina tile-atym",
            submittedAnswerDisplay: "Элина Атым",
            correctAnswerDisplay: "Атым Элина",
            explanation:
              "Atym Elina is a short sentence for giving your name.",
            feedback: "Almost. Check the order and try again.",
            corrected,
            retryAnswer: corrected ? "tile-atym tile-elina" : undefined,
            retryAnswerDisplay: corrected ? "Атым Элина" : undefined,
            retryAttempts: corrected ? 1 : 0,
            updatedAt: "2026-07-08T00:00:00.000Z",
          }
      : {
          lessonId: "k0-u1-l1",
          exerciseId:
            missedKind === "fallback"
              ? "ex-review-later"
              : "ex-greeting-match",
          itemId: missedKind === "fallback" ? "item-review-later" : "item-rahmat",
          submittedAnswer: "hello",
          submittedAnswerDisplay: "hello",
          correctAnswerDisplay: "ыраазычылык",
          explanation: "Rahmat means thank you.",
          feedback: "Not quite. Look at the lesson words again.",
          corrected,
          retryAnswer: corrected ? "thank-you" : undefined,
          retryAnswerDisplay: corrected ? "thank you" : undefined,
          retryAttempts: corrected ? 1 : 0,
          updatedAt: "2026-07-08T00:00:00.000Z",
        };
  const missedKey =
    missedKind === "fill_blank"
      ? "k0-u1-l1:ex-greeting-fill:item-jakshy-rahmat"
      : missedKind === "sentence_builder"
        ? "k1-u1-l1:ex-name-build:item-build-atym-elina"
      : missedKind === "fallback"
        ? "k0-u1-l1:ex-review-later:item-review-later"
        : "k0-u1-l1:ex-greeting-match:item-rahmat";
  const lessonId = missedKind === "sentence_builder" ? "k1-u1-l1" : "k0-u1-l1";

  return {
    ...defaultProgress,
    missedPractice: {
      [missedKey]: missedItem,
    },
    lessonPractice: {
      [lessonId]: {
        ...emptyLessonPracticeProgress,
        totalCount: 2,
        attemptedCount: 2,
        completedCount: 2,
        correctCount: 1,
        incorrectCount: 1,
        missedCount: 1,
        correctedMissedCount: corrected ? 1 : 0,
        practiceComplete: true,
        missedReviewComplete: corrected,
      },
    },
  };
}

describe("PracticeReviewQueue", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders an empty review queue state", async () => {
    render(<PracticeReviewQueue lessons={lessons} />);

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-empty")).toHaveTextContent(
        "Nothing to review yet",
      );
    });
    expect(screen.getByTestId("review-queue-empty")).toHaveTextContent(
      "Complete a lesson and anything you miss will appear here",
    );
    expect(screen.getByRole("link", { name: "Go to Learn" })).toHaveAttribute(
      "href",
      "/learn",
    );
  });

  it("renders practice progress summary from local progress", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const summary = await screen.findByTestId("practice-progress-summary");

    expect(summary).toHaveTextContent("Completed");
    expect(summary).toHaveTextContent("Missed items");
    expect(summary).toHaveTextContent("Needs review");
    expect(summary).toHaveTextContent("Corrected");
    expect(summary).toHaveTextContent("2");
    expect(summary).toHaveTextContent("1");
    expect(summary).toHaveTextContent("0");
  });

  it("shows missed item details in the review queue", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");
    const item = within(queue).getByTestId("review-queue-item");

    expect(queue).toHaveTextContent("Keep it fresh");
    expect(queue).toHaveTextContent("First Kyrgyz greetings");
    expect(item).toHaveTextContent("Missed item");
    expect(item).toHaveTextContent("Needs review");
    expect(item).toHaveTextContent("Your answer");
    expect(item).toHaveTextContent("hello");
    expect(item).toHaveTextContent("Answer to remember");
    expect(item).toHaveTextContent("ыраазычылык");
    expect(item).toHaveTextContent("Rahmat means thank you.");
    expect(within(item).getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("shows corrected status for corrected missed items", async () => {
    seedProgress(makeProgress({ corrected: true }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    expect(item).toHaveTextContent("Corrected");
    expect(item).toHaveTextContent("You fixed this one.");
    expect(item).toHaveTextContent("Nice - corrected");
    expect(
      within(item).getByRole("link", { name: "Review in lesson" }),
    ).toHaveAttribute("href", "/lesson/k0-u1-l1#lesson-practice");
    expect(
      within(item).queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
  });

  it("retries a missed multiple choice item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.click(within(item).getByRole("button", { name: "thank you" }));

    await waitFor(() => {
      expect(item).toHaveTextContent("Nice - corrected");
      expect(screen.getByTestId("review-queue-complete")).toHaveTextContent(
        "Review complete",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });
  });

  it("keeps a multiple choice item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.click(within(item).getByRole("button", { name: "goodbye" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Not quite yet. Use the answer above and try once more.",
      );
      expect(item).toHaveTextContent("Needs review");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("retries a missed fill blank item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "fill_blank" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.type(within(item).getByLabelText("Try the answer again"), "рахмат");
    await user.click(within(item).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(item).toHaveTextContent("Nice - corrected");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });
  });

  it("keeps a fill blank item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "fill_blank" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.type(within(item).getByLabelText("Try the answer again"), "салам");
    await user.click(within(item).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Not quite yet. Use the answer above and try once more.",
      );
      expect(item).toHaveTextContent("Needs review");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("retries a missed sentence builder item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "sentence_builder" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");
    const item = await screen.findByTestId("review-queue-item");

    expect(queue).toHaveTextContent("Introductions");
    expect(item).toHaveTextContent("Элина Атым");
    expect(item).toHaveTextContent("Атым Элина");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.click(within(item).getByRole("button", { name: "Add Атым" }));
    await user.click(within(item).getByRole("button", { name: "Add Элина" }));
    await user.click(within(item).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(item).toHaveTextContent("Nice - corrected");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });
  });

  it("keeps a sentence builder item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "sentence_builder" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Try again" }));
    await user.click(within(item).getByRole("button", { name: "Add Элина" }));
    await user.click(within(item).getByRole("button", { name: "Add Атым" }));
    await user.click(within(item).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Not quite yet. Use the answer above and try once more.",
      );
      expect(item).toHaveTextContent("Needs review");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("renders a learner-friendly fallback when direct retry is not available", async () => {
    seedProgress(makeProgress({ missedKind: "fallback" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    expect(item).toHaveTextContent("Open the lesson to review this item");
    expect(item).toHaveTextContent(
      "This review works best inside the lesson for now.",
    );
    expect(within(item).getByRole("link", { name: "Open lesson" })).toHaveAttribute(
      "href",
      "/lesson/k0-u1-l1#lesson-practice",
    );
    expect(
      within(item).queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
  });

  it("does not expose implementation or validation metadata", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    await screen.findByTestId("review-queue");

    expect(screen.getByTestId("practice-review-page").textContent).not.toMatch(
      /localStorage|exercise IDs?|schema|progress object|sourceNotes|rightsNotes|methodist|validation|not_reviewed/i,
    );
  });
});
