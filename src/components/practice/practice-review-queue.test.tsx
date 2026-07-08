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
  missedKind?:
    | "multiple_choice"
    | "fill_blank"
    | "sentence_builder"
    | "match_pairs"
    | "error_correction"
    | "fallback";
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
          explanation: "Жакшы, рахмат - короткий вежливый ответ.",
          feedback: "Не совсем. Посмотрите ещё раз на слова урока.",
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
              "Атым Элина - короткое предложение, чтобы назвать свое имя.",
            feedback: "Почти. Проверьте порядок слов и попробуйте ещё раз.",
            corrected,
            retryAnswer: corrected ? "tile-atym tile-elina" : undefined,
            retryAnswerDisplay: corrected ? "Атым Элина" : undefined,
            retryAttempts: corrected ? 1 : 0,
            updatedAt: "2026-07-08T00:00:00.000Z",
          }
      : missedKind === "match_pairs"
        ? {
            lessonId: "k1-u1-l1",
            exerciseId: "ex-intro-match",
            itemId: "item-intro-pairs",
            submittedAnswer:
              "left-atym:right-and-you|left-atyn-kim:right-your-name|left-senchi:right-my-name",
            submittedAnswerDisplay:
              "Атым ... → А ты?; Атың ким? → Как тебя зовут?; Сенчи? → Меня зовут ...",
            correctAnswerDisplay:
              "Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?",
            explanation:
              "Эти пары - короткие фразы для знакомства.",
            feedback: "Почти. Проверьте пары и попробуйте ещё раз.",
            corrected,
            retryAnswer: corrected
              ? "left-atym:right-my-name|left-atyn-kim:right-your-name|left-senchi:right-and-you"
              : undefined,
            retryAnswerDisplay: corrected
              ? "Атым ... → Меня зовут ...; Атың ким? → Как тебя зовут?; Сенчи? → А ты?"
              : undefined,
            retryAttempts: corrected ? 1 : 0,
            updatedAt: "2026-07-08T00:00:00.000Z",
          }
      : missedKind === "error_correction"
        ? {
            lessonId: "k1-u1-l1",
            exerciseId: "ex-name-correction",
            itemId: "item-correct-atyn-kim",
            submittedAnswer: "Атым ким?",
            submittedAnswerDisplay: "Атым ким?",
            correctAnswerDisplay: "Атың ким?",
            explanation:
              "Атым значит мое имя. Атың значит твое имя. В вопросе используйте Атың ким?",
            feedback: "Почти. Посмотрите на окончание.",
            corrected,
            retryAnswer: corrected ? "Атың ким?" : undefined,
            retryAnswerDisplay: corrected ? "Атың ким?" : undefined,
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
          submittedAnswerDisplay: "привет",
          correctAnswerDisplay: "спасибо",
          explanation: "Рахмат значит спасибо.",
          feedback: "Не совсем. Посмотрите ещё раз на слова урока.",
          corrected,
          retryAnswer: corrected ? "thank-you" : undefined,
          retryAnswerDisplay: corrected ? "спасибо" : undefined,
          retryAttempts: corrected ? 1 : 0,
          updatedAt: "2026-07-08T00:00:00.000Z",
        };
  const missedKey =
    missedKind === "fill_blank"
      ? "k0-u1-l1:ex-greeting-fill:item-jakshy-rahmat"
      : missedKind === "sentence_builder"
        ? "k1-u1-l1:ex-name-build:item-build-atym-elina"
      : missedKind === "match_pairs"
        ? "k1-u1-l1:ex-intro-match:item-intro-pairs"
      : missedKind === "error_correction"
        ? "k1-u1-l1:ex-name-correction:item-correct-atyn-kim"
      : missedKind === "fallback"
        ? "k0-u1-l1:ex-review-later:item-review-later"
        : "k0-u1-l1:ex-greeting-match:item-rahmat";
  const lessonId =
    missedKind === "sentence_builder" ||
    missedKind === "match_pairs" ||
    missedKind === "error_correction"
      ? "k1-u1-l1"
      : "k0-u1-l1";

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

function makeMixedProgress(): LocalProgress {
  const needsReviewProgress = makeProgress();
  const correctedProgress = makeProgress({
    corrected: true,
    missedKind: "error_correction",
  });

  return {
    ...defaultProgress,
    missedPractice: {
      ...needsReviewProgress.missedPractice,
      ...correctedProgress.missedPractice,
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
        correctedMissedCount: 0,
        practiceComplete: true,
        missedReviewComplete: false,
      },
      "k1-u1-l1": {
        ...emptyLessonPracticeProgress,
        totalCount: 4,
        attemptedCount: 4,
        completedCount: 4,
        correctCount: 3,
        incorrectCount: 1,
        missedCount: 1,
        correctedMissedCount: 1,
        practiceComplete: true,
        missedReviewComplete: true,
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
        "Пока нечего повторять",
      );
    });
    expect(screen.getByTestId("review-queue-empty")).toHaveTextContent(
      "После урока ошибки появятся здесь",
    );
    expect(screen.getByRole("link", { name: "К урокам" })).toHaveAttribute(
      "href",
      "/learn",
    );
  });

  it("renders practice progress summary from local progress", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const summary = await screen.findByTestId("practice-progress-summary");

    expect(summary).toHaveTextContent("Готово");
    expect(summary).toHaveTextContent("Ошибки");
    expect(summary).toHaveTextContent("Повторить");
    expect(summary).toHaveTextContent("Исправлено");
    expect(summary).toHaveTextContent("2");
    expect(summary).toHaveTextContent("1");
    expect(summary).toHaveTextContent("0");
  });

  it("renders review queue filters with needs review selected by default", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const filters = await screen.findByTestId("review-queue-filters");

    expect(within(filters).getByRole("tab", { name: "Повторить" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(within(filters).getByRole("tab", { name: "Исправлено" })).toBeVisible();
    expect(within(filters).getByRole("tab", { name: "Все" })).toBeVisible();
  });

  it("filters review queue items by needs review, corrected, and all", async () => {
    const user = userEvent.setup();

    seedProgress(makeMixedProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");

    expect(within(queue).getAllByTestId("review-queue-item")).toHaveLength(1);
    expect(queue).toHaveTextContent("привет");
    expect(queue).not.toHaveTextContent("Атым ким?");

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(within(queue).getAllByTestId("review-queue-item")).toHaveLength(1);
    expect(queue).toHaveTextContent("Атым ким?");
    expect(queue).not.toHaveTextContent("привет");

    await user.click(screen.getByRole("tab", { name: "Все" }));

    expect(within(queue).getAllByTestId("review-queue-item")).toHaveLength(2);
    expect(queue).toHaveTextContent("привет");
    expect(queue).toHaveTextContent("Атым ким?");
  });

  it("renders filtered empty states", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress());
    const { unmount } = render(<PracticeReviewQueue lessons={lessons} />);

    await screen.findByTestId("review-queue");
    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
      "Исправленные ответы появятся здесь после повтора ошибок.",
    );

    unmount();
    window.localStorage.clear();
    seedProgress(makeProgress({ corrected: true }));
    render(<PracticeReviewQueue lessons={lessons} />);

    await screen.findByTestId("review-queue");
    expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
      "Сейчас нечего повторять",
    );
  });

  it("shows missed item details in the review queue", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");
    const item = within(queue).getByTestId("review-queue-item");

    expect(queue).toHaveTextContent("Закрепить");
    expect(queue).toHaveTextContent("Первые кыргызские приветствия");
    expect(item).toHaveTextContent("Нужно повторить");
    expect(item).toHaveTextContent("Повторить");
    expect(item).toHaveTextContent("Ваш ответ");
    expect(item).toHaveTextContent("привет");
    expect(item).toHaveTextContent("Правильный ответ");
    expect(item).toHaveTextContent("спасибо");
    expect(item).toHaveTextContent("Рахмат значит спасибо.");
    expect(
      within(item).getByRole("button", { name: "Попробовать ещё раз" }),
    ).toBeInTheDocument();
  });

  it("shows corrected status for corrected missed items", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ corrected: true }));
    render(<PracticeReviewQueue lessons={lessons} />);

    await screen.findByTestId("review-queue");
    await user.click(screen.getByRole("tab", { name: "Исправлено" }));
    const item = await screen.findByTestId("review-queue-item");

    expect(item).toHaveTextContent("Исправлено");
    expect(item).toHaveTextContent("Вы уже закрепили этот ответ.");
    expect(
      within(item).getByRole("link", { name: "Повторить в уроке" }),
    ).toHaveAttribute("href", "/lesson/k0-u1-l1#lesson-practice");
    expect(
      within(item).queryByRole("button", { name: "Попробовать ещё раз" }),
    ).not.toBeInTheDocument();
  });

  it("retries a missed multiple choice item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "спасибо" }));

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
        "Сейчас нечего повторять",
      );
      expect(screen.getByTestId("review-queue-complete")).toHaveTextContent(
        "Повтор завершён",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(await screen.findByTestId("review-queue-item")).toHaveTextContent(
      "Исправлено",
    );
  });

  it("keeps a multiple choice item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "пока" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Почти. Посмотрите на ответ и попробуйте ещё раз.",
      );
      expect(item).toHaveTextContent("Повторить");
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

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.type(within(item).getByLabelText("Введите ответ ещё раз"), "рахмат");
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
        "Сейчас нечего повторять",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(await screen.findByTestId("review-queue-item")).toHaveTextContent(
      "Исправлено",
    );
  });

  it("keeps a fill blank item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "fill_blank" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.type(within(item).getByLabelText("Введите ответ ещё раз"), "салам");
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Почти. Посмотрите на ответ и попробуйте ещё раз.",
      );
      expect(item).toHaveTextContent("Повторить");
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

    expect(queue).toHaveTextContent("Знакомство");
    expect(item).toHaveTextContent("Элина Атым");
    expect(item).toHaveTextContent("Атым Элина");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "Добавить Атым" }));
    await user.click(within(item).getByRole("button", { name: "Добавить Элина" }));
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
        "Сейчас нечего повторять",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(await screen.findByTestId("review-queue-item")).toHaveTextContent(
      "Исправлено",
    );
  });

  it("keeps a sentence builder item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "sentence_builder" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "Добавить Элина" }));
    await user.click(within(item).getByRole("button", { name: "Добавить Атым" }));
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Почти. Посмотрите на ответ и попробуйте ещё раз.",
      );
      expect(item).toHaveTextContent("Повторить");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("retries a missed match pairs item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "match_pairs" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");
    const item = await screen.findByTestId("review-queue-item");

    expect(queue).toHaveTextContent("Знакомство");
    expect(item).toHaveTextContent("Атым ... → А ты?");
    expect(item).toHaveTextContent("Атым ... → Меня зовут ...");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "Атым ..." }));
    await user.click(
      within(item).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(item).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(item).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(item).getByRole("button", { name: "Сенчи?" }));
    await user.click(within(item).getByRole("button", { name: "А ты?" }));
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
        "Сейчас нечего повторять",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(await screen.findByTestId("review-queue-item")).toHaveTextContent(
      "Исправлено",
    );
  });

  it("keeps a match pairs item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "match_pairs" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.click(within(item).getByRole("button", { name: "Атым ..." }));
    await user.click(within(item).getByRole("button", { name: "А ты?" }));
    await user.click(within(item).getByRole("button", { name: "Атың ким?" }));
    await user.click(
      within(item).getByRole("button", { name: "Как тебя зовут?" }),
    );
    await user.click(within(item).getByRole("button", { name: "Сенчи?" }));
    await user.click(
      within(item).getByRole("button", { name: "Меня зовут ..." }),
    );
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Почти. Посмотрите на ответ и попробуйте ещё раз.",
      );
      expect(item).toHaveTextContent("Повторить");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("retries a missed error correction item directly and marks it corrected", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "error_correction" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const queue = await screen.findByTestId("review-queue");
    const item = await screen.findByTestId("review-queue-item");

    expect(queue).toHaveTextContent("Знакомство");
    expect(item).toHaveTextContent("Атым ким?");
    expect(item).toHaveTextContent("Атың ким?");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.type(within(item).getByLabelText("Правильный вариант"), "Атың ким?");
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(screen.getByTestId("review-queue-filter-empty")).toHaveTextContent(
        "Сейчас нечего повторять",
      );
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("practice-summary-corrected")).toHaveTextContent(
        "1",
      );
    });

    await user.click(screen.getByRole("tab", { name: "Исправлено" }));

    expect(await screen.findByTestId("review-queue-item")).toHaveTextContent(
      "Исправлено",
    );
  });

  it("keeps an error correction item in review after an incorrect direct retry", async () => {
    const user = userEvent.setup();

    seedProgress(makeProgress({ missedKind: "error_correction" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    await user.click(within(item).getByRole("button", { name: "Попробовать ещё раз" }));
    await user.type(within(item).getByLabelText("Правильный вариант"), "Атым ким?");
    await user.click(within(item).getByRole("button", { name: "Проверить" }));

    await waitFor(() => {
      expect(item).toHaveTextContent(
        "Почти. Посмотрите на ответ и попробуйте ещё раз.",
      );
      expect(item).toHaveTextContent("Повторить");
      expect(screen.getByTestId("practice-summary-needs-review")).toHaveTextContent(
        "1",
      );
    });
  });

  it("renders a learner-friendly fallback when direct retry is not available", async () => {
    seedProgress(makeProgress({ missedKind: "fallback" }));
    render(<PracticeReviewQueue lessons={lessons} />);

    const item = await screen.findByTestId("review-queue-item");

    expect(item).toHaveTextContent("Откройте урок для повтора");
    expect(item).toHaveTextContent(
      "Этот формат пока удобнее повторять внутри урока.",
    );
    expect(within(item).getByRole("link", { name: "Открыть урок" })).toHaveAttribute(
      "href",
      "/lesson/k0-u1-l1#lesson-practice",
    );
    expect(
      within(item).queryByRole("button", { name: "Попробовать ещё раз" }),
    ).not.toBeInTheDocument();
  });

  it("does not expose implementation or validation metadata", async () => {
    seedProgress(makeProgress());
    render(<PracticeReviewQueue lessons={lessons} />);

    await screen.findByTestId("review-queue");

    expect(screen.getByTestId("practice-review-page").textContent).not.toMatch(
      /localStorage|exercise IDs?|schema|progress object|sourceNotes|rightsNotes|audioReviewStatus|storageKey|methodist|validation|not_recorded|not_reviewed/i,
    );
  });
});
