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
      "1/11",
    );
    expect(screen.getByRole("link", { name: "Ситуация" })).toBeInTheDocument();
    expect(screen.getByTestId("lesson-step-progress")).toHaveTextContent(
      "Далее: Цель",
    );
    expect(screen.getByText("После урока вы сможете")).toBeInTheDocument();
    expect(screen.getByText("Узнавать простые приветствия.")).toBeInTheDocument();
  });

  it("does not expose implementation or validation copy to learners", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("lesson-player").textContent).not.toMatch(
      /Seeded|typed lesson|schema|placeholder|Sample\/demo|methodist|validation|TODO|sourceNotes|rightsNotes|validatedAgainst|audioReviewStatus|storageKey|not_recorded|not_reviewed|demo/i,
    );
  });

  it("renders audio-ready controls on vocabulary, dialogue, and reading items", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getAllByTestId("vocabulary-audio-control")).toHaveLength(
      lessons[0].vocabulary.length,
    );
    expect(screen.getAllByTestId("dialogue-audio-control")).toHaveLength(
      lessons[0].dialogues[0].lines.length,
    );
    expect(screen.getAllByTestId("reading-audio-control")).toHaveLength(
      lessons[0].texts[0].paragraphs.length,
    );
    expect(
      screen.getAllByRole("button", { name: /Слушать .*: скоро/ }).length,
    ).toBeGreaterThanOrEqual(
      lessons[0].vocabulary.length +
        lessons[0].dialogues[0].lines.length +
        lessons[0].texts[0].paragraphs.length,
    );
  });

  it("updates local practice progress after answering an exercise", async () => {
    const user = userEvent.setup();
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("practice-progress")).toHaveTextContent(
      "Практика 1 из 2",
    );

    await user.click(
      within(screen.getByTestId("section-exercise")).getByRole("button", {
        name: "спасибо",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Практика 2 из 2",
      );
      expect(screen.getByTestId("practice-progress")).toHaveTextContent(
        "Готово: 1",
      );
    });

    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-complete")).toHaveTextContent(
        "Можно идти дальше",
      );
      expect(screen.getByTestId("practice-summary")).toHaveTextContent(
        "Практика завершена: 2 из 2 верно.",
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

  it("tracks missed answers and corrected retries in local progress", async () => {
    const user = userEvent.setup();
    render(<LessonPlayer lesson={lessons[0]} />);

    await user.click(
      within(screen.getByTestId("section-exercise")).getByRole("button", {
        name: "привет",
      }),
    );
    await user.type(screen.getByLabelText("Жакшы, ___."), "рахмат");
    await user.click(screen.getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("missed-review")).toHaveTextContent(
        "Повторить ошибки",
      );
    });

    await waitFor(() => {
      const storedProgress = JSON.parse(
        window.localStorage.getItem(progressStorageKey) ?? "{}",
      );
      const missedItem =
        storedProgress.missedPractice["k0-u1-l1:ex-greeting-match:item-rahmat"];

      expect(missedItem.exerciseId).toBe("ex-greeting-match");
      expect(missedItem.submittedAnswer).toBe("hello");
      expect(missedItem.submittedAnswerDisplay).toBe("привет");
      expect(missedItem.correctAnswerDisplay).toBe("спасибо");
      expect(missedItem.explanation).toBe("Рахмат значит спасибо.");
      expect(missedItem.feedback).toBe(
        "Не совсем. Посмотрите ещё раз на слова урока.",
      );
      expect(missedItem.corrected).toBe(false);
      expect(storedProgress.lessonPractice["k0-u1-l1"].missedCount).toBe(1);
      expect(storedProgress.lessonPractice["k0-u1-l1"].correctedMissedCount).toBe(
        0,
      );
    });

    await user.click(
      within(screen.getByTestId("missed-review")).getByRole("button", {
        name: "спасибо",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("missed-corrected")).toHaveTextContent(
        "Исправлено",
      );
      expect(screen.getByTestId("practice-summary")).toHaveTextContent(
        "Вы сделали 2 задания, сразу ответили верно на 1 и исправили 1.",
      );
    });

    await waitFor(() => {
      const storedProgress = JSON.parse(
        window.localStorage.getItem(progressStorageKey) ?? "{}",
      );
      const missedItem =
        storedProgress.missedPractice["k0-u1-l1:ex-greeting-match:item-rahmat"];

      expect(missedItem.corrected).toBe(true);
      expect(missedItem.retryAnswer).toBe("thank-you");
      expect(missedItem.retryAnswerDisplay).toBe("спасибо");
      expect(missedItem.retryAttempts).toBe(1);
      expect(storedProgress.lessonPractice["k0-u1-l1"].correctedMissedCount).toBe(
        1,
      );
      expect(storedProgress.lessonPractice["k0-u1-l1"].missedReviewComplete).toBe(
        true,
      );
    });
  });
});
