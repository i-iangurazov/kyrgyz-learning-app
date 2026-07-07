"use client";

import { FormEvent, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ExerciseItem } from "@/lib/exercise-checking";
import { isCorrectErrorCorrection } from "@/lib/exercise-checking";

type ErrorCorrectionControlProps = {
  item: ExerciseItem;
  disabled?: boolean;
  submitLabel?: string;
  onSubmit: (attempt: {
    answer: string;
    answerDisplay: string;
    correct: boolean;
  }) => void;
};

export function ErrorCorrectionControl({
  item,
  disabled = false,
  submitLabel = "Check",
  onSubmit,
}: ErrorCorrectionControlProps) {
  const generatedInputId = useId();
  const inputId = `fix-${item.id}-${generatedInputId}`;
  const [draftAnswer, setDraftAnswer] = useState("");
  const trimmedAnswer = draftAnswer.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedAnswer) {
      return;
    }

    onSubmit({
      answer: trimmedAnswer,
      answerDisplay: trimmedAnswer,
      correct: isCorrectErrorCorrection(item, trimmedAnswer),
    });
  };

  return (
    <form
      className="space-y-3"
      data-testid="error-correction-control"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-semibold">Fix the sentence</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {item.feedback.hint.en}
        </p>
      </div>

      <div
        className="rounded-lg border border-[#d9e5dd] bg-[#f6faf5] p-3"
        data-testid="error-correction-source"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          What sounds better?
        </p>
        <p className="mt-2 text-base font-semibold">{item.question.ky}</p>
      </div>

      <label className="block text-sm font-semibold" htmlFor={inputId}>
        Correct version
      </label>
      <input
        aria-describedby={`${inputId}-hint`}
        className="min-h-12 w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-medium outline-none transition focus:border-[#27645a] focus:ring-2 focus:ring-[#27645a]/18 disabled:bg-muted"
        disabled={disabled}
        id={inputId}
        inputMode="text"
        onChange={(event) => setDraftAnswer(event.target.value)}
        placeholder="Type the corrected version"
        value={draftAnswer}
      />
      <p className="text-xs leading-5 text-muted-foreground" id={`${inputId}-hint`}>
        Keep the Kyrgyz phrase short and exact.
      </p>
      <Button
        className="w-full"
        disabled={disabled || trimmedAnswer.length === 0}
        type="submit"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
