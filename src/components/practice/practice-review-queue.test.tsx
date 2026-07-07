import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PracticeReviewQueue } from "@/components/practice/practice-review-queue";
import { lessons } from "@/content/curriculum";
import {
  defaultProgress,
  emptyLessonPracticeProgress,
  progressStorageKey,
  type LocalProgress,
} from "@/lib/progress";

const lessonSummaries = lessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title.en,
  levelId: lesson.levelId,
}));

function seedProgress(progress: LocalProgress) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

function makeProgress({
  corrected = false,
}: {
  corrected?: boolean;
} = {}): LocalProgress {
  return {
    ...defaultProgress,
    missedPractice: {
      "k0-u1-l1:ex-greeting-match:item-rahmat": {
        lessonId: "k0-u1-l1",
        exerciseId: "ex-greeting-match",
        itemId: "item-rahmat",
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
      },
    },
    lessonPractice: {
      "k0-u1-l1": {
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
    render(<PracticeReviewQueue lessons={lessonSummaries} />);

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
    render(<PracticeReviewQueue lessons={lessonSummaries} />);

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
    render(<PracticeReviewQueue lessons={lessonSummaries} />);

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
    expect(
      within(item).getByRole("link", { name: "Review in lesson" }),
    ).toHaveAttribute("href", "/lesson/k0-u1-l1#lesson-practice");
  });

  it("shows corrected status for corrected missed items", async () => {
    seedProgress(makeProgress({ corrected: true }));
    render(<PracticeReviewQueue lessons={lessonSummaries} />);

    const item = await screen.findByTestId("review-queue-item");

    expect(item).toHaveTextContent("Corrected");
    expect(item).toHaveTextContent("Good work. Keep this one warm.");
    expect(
      within(item).getByRole("link", { name: "Review again" }),
    ).toHaveAttribute("href", "/lesson/k0-u1-l1#lesson-practice");
  });

  it("does not expose implementation or validation metadata", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessonSummaries} />);

    await screen.findByTestId("review-queue");

    expect(screen.getByTestId("practice-review-page").textContent).not.toMatch(
      /localStorage|exercise IDs?|schema|progress object|sourceNotes|rightsNotes|methodist|validation|not_reviewed/i,
    );
  });
});
