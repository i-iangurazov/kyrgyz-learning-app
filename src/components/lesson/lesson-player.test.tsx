import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { lessons } from "@/content/curriculum";
import { progressStorageKey } from "@/lib/progress";

describe("LessonPlayer", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the required lesson sections from lesson data", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("lesson-player")).toBeInTheDocument();
    expect(screen.getByTestId("lesson-step-progress")).toBeInTheDocument();
    expect(screen.getByTestId("section-story")).toBeInTheDocument();
    expect(screen.getByTestId("section-goals")).toBeInTheDocument();
    expect(screen.getByTestId("section-vocabulary")).toBeInTheDocument();
    expect(screen.getByTestId("section-dialogue")).toBeInTheDocument();
    expect(screen.getByTestId("section-breakdown")).toBeInTheDocument();
    expect(screen.getByTestId("section-grammar")).toBeInTheDocument();
    expect(screen.getByTestId("section-exercise")).toBeInTheDocument();
    expect(screen.getByTestId("section-mini-game")).toBeInTheDocument();
    expect(screen.getByTestId("section-speaking")).toBeInTheDocument();
    expect(screen.getByTestId("section-ai-roleplay")).toBeInTheDocument();
    expect(screen.getByTestId("section-review")).toBeInTheDocument();
  });

  it("renders a compact lesson path and learning goals", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("lesson-step-progress")).toHaveTextContent(
      "Step 1 of 11",
    );
    expect(screen.getByRole("link", { name: "Story" })).toBeInTheDocument();
    expect(screen.getByTestId("lesson-step-progress")).toHaveTextContent(
      "Next: Goals",
    );
    expect(
      screen.getByText("What you'll be able to do"),
    ).toBeInTheDocument();
    expect(screen.getByText("Recognize simple greetings.")).toBeInTheDocument();
  });

  it("does not expose implementation or validation copy to learners", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("lesson-player").textContent).not.toMatch(
      /Seeded|typed lesson|schema|placeholder|Sample\/demo|methodist|validation|TODO|sourceNotes|rightsNotes|validatedAgainst|not_reviewed/i,
    );
  });

  it("updates local practice progress after answering an exercise", async () => {
    const user = userEvent.setup();
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Practice 1 of 2",
    );

    await user.click(
      within(screen.getByTestId("section-exercise")).getByRole("button", {
        name: "thank you",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Practice 2 of 2",
      );
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "1 completed",
      );
    });

    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "You're ready for the next step",
      );
      expect(screen.getByTestId("practice-summary")).toHaveTextContent(
        "Practice complete: 2 of 2 correct.",
      );
    });

    await waitFor(() => {
      const storedProgress = JSON.parse(
        window.localStorage.getItem(progressStorageKey) ?? "{}",
      );
      expect(storedProgress.lessonPractice["k0-u1-l1"].totalCount).toBe(2);
      expect(storedProgress.lessonPractice["k0-u1-l1"].completedCount).toBe(2);
      expect(storedProgress.lessonPractice["k0-u1-l1"].correctCount).toBe(2);
      expect(storedProgress.lessonPractice["k0-u1-l1"].practiceComplete).toBe(
        true,
      );
    });
  });
});
