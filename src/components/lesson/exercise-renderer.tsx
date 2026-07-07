"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { ErrorCorrectionControl } from "@/components/lesson/error-correction-control";
import { MatchPairsControl } from "@/components/lesson/match-pairs-control";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/schemas";
import {
  getCorrectAnswerText,
  getOptionDisplayText,
  getSelectedAnswerText,
  isCorrectOption,
  isCorrectSentenceBuilder,
  isCorrectTextAnswer,
} from "@/lib/exercise-checking";
import { cn } from "@/lib/utils";

type Exercise = Lesson["exercises"][number];
type ExerciseItem = Exercise["items"][number];

type SubmittedAnswer = {
  answer: string;
  correct: boolean;
};

export type ExerciseAttemptPayload = {
  lessonId: string;
  exerciseId: string;
  itemId: string;
  answer: string;
  answerDisplay?: string;
  correct: boolean;
  correctAnswerDisplay?: string;
  explanation?: string;
  feedback?: string;
  totalPracticeItems?: number;
};

type ExerciseRendererProps = {
  exercise: Exercise;
  lessonId: string;
  onAttempt: (attempt: ExerciseAttemptPayload) => void;
};

function FeedbackPanel({
  correctAnswerLabel = "Answer",
  item,
  submittedAnswer,
}: {
  correctAnswerLabel?: string;
  item: ExerciseItem;
  submittedAnswer: SubmittedAnswer;
}) {
  const correctAnswerText = getCorrectAnswerText(item);

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        submittedAnswer.correct
          ? "border-[#b8dfc8] bg-[#f1faf4]"
          : "border-[#ead1cf] bg-[#fff7f5]",
      )}
      data-testid="exercise-feedback"
      role="status"
    >
      <div className="flex items-start gap-2">
        {submittedAnswer.correct ? (
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-[#2b8a68]"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-[#9b3d35]"
            aria-hidden="true"
          />
        )}
        <div className="space-y-2">
          <p className="font-semibold">
            {submittedAnswer.correct ? item.feedback.correct.en : "Not quite yet."}
          </p>
          {!submittedAnswer.correct ? (
            <p className="leading-6 text-muted-foreground">
              {item.feedback.incorrect.en}
            </p>
          ) : null}
          <p className="leading-6 text-muted-foreground">{item.explanation.en}</p>
          {!submittedAnswer.correct && correctAnswerText ? (
            <p className="font-medium text-foreground">
              {correctAnswerLabel}: {correctAnswerText}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UnsupportedPractice() {
  return (
    <div
      className="rounded-lg border border-dashed border-[#b6c6bf] bg-[#f8faf7] p-4"
      data-testid="unsupported-exercise"
    >
      <p className="text-sm font-semibold">Practice type coming soon</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This activity will open here later. You can keep moving through the lesson.
      </p>
    </div>
  );
}

export function ExerciseRenderer({
  exercise,
  lessonId,
  onAttempt,
}: ExerciseRendererProps) {
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<string, SubmittedAnswer>
  >({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [selectedSentenceTiles, setSelectedSentenceTiles] = useState<
    Record<string, string[]>
  >({});

  const submitAnswer = (
    item: ExerciseItem,
    answer: string,
    correct: boolean,
    answerDisplay = answer,
  ) => {
    if (submittedAnswers[item.id]) {
      return;
    }

    setSubmittedAnswers((current) => ({
      ...current,
      [item.id]: { answer, correct },
    }));
    onAttempt({
      lessonId,
      exerciseId: exercise.id,
      itemId: item.id,
      answer,
      answerDisplay,
      correct,
      correctAnswerDisplay: getCorrectAnswerText(item),
      explanation: item.explanation.en,
      feedback: correct ? item.feedback.correct.en : item.feedback.incorrect.en,
    });
  };

  if (
    exercise.kind !== "multiple_choice" &&
    exercise.kind !== "fill_blank" &&
    exercise.kind !== "sentence_builder" &&
    exercise.kind !== "match_pairs" &&
    exercise.kind !== "error_correction"
  ) {
    return <UnsupportedPractice />;
  }

  return (
    <div className="space-y-4" data-testid="exercise-renderer">
      <div>
        <p className="text-sm font-semibold">{exercise.prompt.en}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {exercise.helperTextByTrack.EN_KY}
        </p>
      </div>

      {exercise.items.map((item) => {
        const submittedAnswer = submittedAnswers[item.id];

        if (exercise.kind === "multiple_choice") {
          if (!item.options?.length) {
            return <UnsupportedPractice key={item.id} />;
          }

          return (
            <div
              key={item.id}
              className="space-y-3"
              data-testid={`exercise-item-${item.id}`}
            >
              <p className="text-sm font-semibold">{item.question.en}</p>
              <div className="grid gap-2">
                {item.options.map((option) => {
                  const isSelected = submittedAnswer?.answer === option.id;
                  const isCorrect = isCorrectOption(item, option);

                  return (
                    <button
                      key={option.id}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm font-medium transition",
                        !submittedAnswer && "hover:bg-accent",
                        submittedAnswer &&
                          !isSelected &&
                          "cursor-default text-muted-foreground opacity-70",
                        submittedAnswer &&
                          isSelected &&
                          isCorrect &&
                          "border-[#9bd2b3] bg-[#eef9f2] text-[#1e5c49]",
                        submittedAnswer &&
                          isSelected &&
                          !isCorrect &&
                          "border-[#e3b4af] bg-[#fff4f1] text-[#87352f]",
                      )}
                      disabled={Boolean(submittedAnswer)}
                      onClick={() =>
                        submitAnswer(
                          item,
                          option.id,
                          isCorrectOption(item, option),
                          option.text.en,
                        )
                      }
                      type="button"
                    >
                      <span>{option.text.en}</span>
                      {submittedAnswer && isSelected && isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : null}
                      {submittedAnswer && isSelected && !isCorrect ? (
                        <XCircle className="h-4 w-4 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {submittedAnswer ? (
                <FeedbackPanel item={item} submittedAnswer={submittedAnswer} />
              ) : null}
            </div>
          );
        }

        if (exercise.kind === "sentence_builder") {
          if (!item.options?.length) {
            return <UnsupportedPractice key={item.id} />;
          }

          const selectedOptionIds = selectedSentenceTiles[item.id] ?? [];
          const selectedAnswerText = getSelectedAnswerText(item, selectedOptionIds);

          const addTile = (optionId: string) => {
            setSelectedSentenceTiles((current) => ({
              ...current,
              [item.id]: [...(current[item.id] ?? []), optionId],
            }));
          };

          const removeTile = (tileIndex: number) => {
            setSelectedSentenceTiles((current) => ({
              ...current,
              [item.id]: (current[item.id] ?? []).filter(
                (_optionId, index) => index !== tileIndex,
              ),
            }));
          };

          const clearTiles = () => {
            setSelectedSentenceTiles((current) => ({
              ...current,
              [item.id]: [],
            }));
          };

          const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (selectedOptionIds.length === 0) {
              return;
            }

            submitAnswer(
              item,
              selectedOptionIds.join(" "),
              isCorrectSentenceBuilder(item, selectedOptionIds),
              selectedAnswerText,
            );
          };

          return (
            <form
              key={item.id}
              className="space-y-3"
              data-testid={`exercise-item-${item.id}`}
              onSubmit={handleSubmit}
            >
              <div>
                <p className="text-sm font-semibold">{item.question.en}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.feedback.hint.en}
                </p>
              </div>

              <div
                className={cn(
                  "min-h-16 rounded-lg border border-dashed border-[#b6c6bf] bg-[#fbfcfa] p-3",
                  submittedAnswer && "border-solid bg-muted/40",
                )}
                data-testid="sentence-builder-answer"
              >
                {selectedOptionIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedOptionIds.map((optionId, index) => {
                      const option = item.options?.find(
                        (candidate) => candidate.id === optionId,
                      );
                      const optionText = option
                        ? getOptionDisplayText(option)
                        : optionId;

                      return (
                        <button
                          aria-label={`Remove ${optionText}`}
                          className="min-h-10 rounded-full bg-[#27645a] px-3 py-2 text-sm font-semibold text-white disabled:opacity-80"
                          disabled={Boolean(submittedAnswer)}
                          key={`${optionId}-${index}`}
                          onClick={() => removeTile(index)}
                          type="button"
                        >
                          {optionText}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">
                    Tap the words in order
                  </p>
                )}
              </div>

              <div
                aria-label="Available words"
                className="flex flex-wrap gap-2"
                data-testid="sentence-builder-tiles"
              >
                {item.options.map((option) => {
                  const isSelected = selectedOptionIds.includes(option.id);
                  const optionText = getOptionDisplayText(option);

                  return (
                    <button
                      aria-label={`Add ${optionText}`}
                      className="min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground"
                      disabled={Boolean(submittedAnswer) || isSelected}
                      key={option.id}
                      onClick={() => addTile(option.id)}
                      type="button"
                    >
                      {optionText}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Button
                  disabled={
                    Boolean(submittedAnswer) || selectedOptionIds.length === 0
                  }
                  type="submit"
                >
                  Check
                </Button>
                <Button
                  disabled={
                    Boolean(submittedAnswer) || selectedOptionIds.length === 0
                  }
                  onClick={clearTiles}
                  type="button"
                  variant="outline"
                >
                  Clear
                </Button>
              </div>

              {submittedAnswer ? (
                <FeedbackPanel item={item} submittedAnswer={submittedAnswer} />
              ) : null}
            </form>
          );
        }

        if (exercise.kind === "match_pairs") {
          return (
            <div
              key={item.id}
              className="space-y-3"
              data-testid={`exercise-item-${item.id}`}
            >
              <div>
                <p className="text-sm font-semibold">{item.question.en}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.feedback.hint.en}
                </p>
              </div>
              <MatchPairsControl
                disabled={Boolean(submittedAnswer)}
                item={item}
                onSubmit={({ answer, answerDisplay, correct }) =>
                  submitAnswer(item, answer, correct, answerDisplay)
                }
              />
              {submittedAnswer ? (
                <FeedbackPanel item={item} submittedAnswer={submittedAnswer} />
              ) : null}
            </div>
          );
        }

        if (exercise.kind === "error_correction") {
          return (
            <div
              key={item.id}
              className="space-y-3"
              data-testid={`exercise-item-${item.id}`}
            >
              <p className="text-sm font-semibold">{item.question.en}</p>
              <ErrorCorrectionControl
                disabled={Boolean(submittedAnswer)}
                item={item}
                onSubmit={({ answer, answerDisplay, correct }) =>
                  submitAnswer(item, answer, correct, answerDisplay)
                }
              />
              {submittedAnswer ? (
                <FeedbackPanel
                  correctAnswerLabel="Correct version"
                  item={item}
                  submittedAnswer={submittedAnswer}
                />
              ) : null}
            </div>
          );
        }

        const draftAnswer = draftAnswers[item.id] ?? "";

        const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const trimmedAnswer = draftAnswer.trim();

          if (!trimmedAnswer) {
            return;
          }

          submitAnswer(item, trimmedAnswer, isCorrectTextAnswer(item, trimmedAnswer));
        };

        return (
          <form
            key={item.id}
            className="space-y-3"
            data-testid={`exercise-item-${item.id}`}
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-semibold" htmlFor={item.id}>
              {item.question.en}
            </label>
            <input
              aria-describedby={`${item.id}-hint`}
              className="min-h-12 w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-medium outline-none transition focus:border-[#27645a] focus:ring-2 focus:ring-[#27645a]/18 disabled:bg-muted"
              disabled={Boolean(submittedAnswer)}
              id={item.id}
              inputMode="text"
              onChange={(event) =>
                setDraftAnswers((current) => ({
                  ...current,
                  [item.id]: event.target.value,
                }))
              }
              placeholder="Type the missing word"
              value={draftAnswer}
            />
            <p className="text-xs leading-5 text-muted-foreground" id={`${item.id}-hint`}>
              {item.feedback.hint.en}
            </p>
            <Button
              className="w-full"
              disabled={Boolean(submittedAnswer) || draftAnswer.trim().length === 0}
              type="submit"
            >
              Check answer
            </Button>
            {submittedAnswer ? (
              <FeedbackPanel item={item} submittedAnswer={submittedAnswer} />
            ) : null}
          </form>
        );
      })}
    </div>
  );
}
