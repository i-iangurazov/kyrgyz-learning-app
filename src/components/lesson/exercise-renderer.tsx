"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/schemas";
import { cn } from "@/lib/utils";

type Exercise = Lesson["exercises"][number];
type ExerciseItem = Exercise["items"][number];
type ExerciseOption = NonNullable<ExerciseItem["options"]>[number];

type SubmittedAnswer = {
  answer: string;
  correct: boolean;
};

export type ExerciseAttemptPayload = {
  lessonId: string;
  exerciseId: string;
  itemId: string;
  answer: string;
  correct: boolean;
  totalPracticeItems?: number;
};

type ExerciseRendererProps = {
  exercise: Exercise;
  lessonId: string;
  onAttempt: (attempt: ExerciseAttemptPayload) => void;
};

function normalizeAnswer(answer: string) {
  return answer.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function getOptionById(item: ExerciseItem, optionId: string) {
  return item.options?.find((option) => option.id === optionId);
}

function getCorrectAnswerText(item: ExerciseItem) {
  const value = item.correctAnswerData.value;

  if (typeof value !== "string") {
    return "";
  }

  if (item.correctAnswerData.kind === "choice_id") {
    const option = getOptionById(item, value);
    return option?.text.ky ?? option?.text.en ?? value;
  }

  return value;
}

function isCorrectOption(item: ExerciseItem, option: ExerciseOption) {
  const value = item.correctAnswerData.value;

  if (typeof value !== "string") {
    return false;
  }

  if (item.correctAnswerData.kind === "choice_id") {
    return option.id === value;
  }

  const acceptedAnswers = [option.text.ky, option.text.en, option.text.ru ?? ""].map(
    normalizeAnswer,
  );

  return acceptedAnswers.includes(normalizeAnswer(value));
}

function isCorrectTextAnswer(item: ExerciseItem, answer: string) {
  const value = item.correctAnswerData.value;

  if (typeof value !== "string") {
    return false;
  }

  if (item.correctAnswerData.kind === "choice_id") {
    const option = getOptionById(item, value);
    const acceptedAnswers = [
      option?.text.ky,
      option?.text.en,
      option?.text.ru,
      value,
    ]
      .filter((candidate): candidate is string => Boolean(candidate))
      .map(normalizeAnswer);

    return acceptedAnswers.includes(normalizeAnswer(answer));
  }

  return normalizeAnswer(answer) === normalizeAnswer(value);
}

function FeedbackPanel({
  item,
  submittedAnswer,
}: {
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
              Answer: {correctAnswerText}
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

  const submitAnswer = (item: ExerciseItem, answer: string, correct: boolean) => {
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
      correct,
    });
  };

  if (exercise.kind !== "multiple_choice" && exercise.kind !== "fill_blank") {
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
                        submitAnswer(item, option.id, isCorrectOption(item, option))
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
