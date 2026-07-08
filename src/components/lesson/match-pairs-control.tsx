"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ExerciseItem } from "@/lib/exercise-checking";
import {
  getMatchOptionDisplayText,
  getMatchPairsDisplay,
  getMatchPairSides,
  isCorrectMatchPairs,
  serializeMatchPairs,
} from "@/lib/exercise-checking";
import { defaultUiCopy as copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type MatchPairsControlProps = {
  item: ExerciseItem;
  disabled?: boolean;
  showIntro?: boolean;
  submitLabel?: string;
  onSubmit: (attempt: {
    answer: string;
    answerDisplay: string;
    correct: boolean;
  }) => void;
};

export function MatchPairsControl({
  item,
  disabled = false,
  showIntro = true,
  submitLabel = copy.common.check,
  onSubmit,
}: MatchPairsControlProps) {
  const { leftOptions, rightOptions } = getMatchPairSides(item);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [selectedPairs, setSelectedPairs] = useState<Record<string, string>>({});
  const matchedRightIds = new Set(Object.values(selectedPairs));
  const isComplete =
    leftOptions.length > 0 && Object.keys(selectedPairs).length === leftOptions.length;

  const selectLeft = (leftId: string) => {
    if (disabled || selectedPairs[leftId]) {
      return;
    }

    if (selectedRightId) {
      setSelectedPairs((current) => ({
        ...current,
        [leftId]: selectedRightId,
      }));
      setSelectedLeftId(null);
      setSelectedRightId(null);
      return;
    }

    setSelectedLeftId((current) => (current === leftId ? null : leftId));
  };

  const selectRight = (rightId: string) => {
    if (disabled || matchedRightIds.has(rightId)) {
      return;
    }

    if (selectedLeftId) {
      setSelectedPairs((current) => ({
        ...current,
        [selectedLeftId]: rightId,
      }));
      setSelectedLeftId(null);
      setSelectedRightId(null);
      return;
    }

    setSelectedRightId((current) => (current === rightId ? null : rightId));
  };

  const resetPairs = () => {
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setSelectedPairs({});
  };

  const removePair = (leftId: string) => {
    setSelectedPairs((current) => {
      const nextPairs = { ...current };
      delete nextPairs[leftId];
      return nextPairs;
    });
  };

  const handleSubmit = () => {
    onSubmit({
      answer: serializeMatchPairs(selectedPairs),
      answerDisplay: getMatchPairsDisplay(item, selectedPairs),
      correct: isCorrectMatchPairs(item, selectedPairs),
    });
  };

  if (leftOptions.length === 0 || rightOptions.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-[#b6c6bf] bg-[#f8faf7] p-4"
        data-testid="match-pairs-unavailable"
      >
        <p className="text-sm font-semibold">{copy.common.comingSoonTitle}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {copy.common.comingSoonBody}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="match-pairs-control">
      {showIntro ? (
        <div>
          <p className="text-sm font-semibold">{copy.exercise.matchIntroTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {copy.exercise.matchIntroBody}
          </p>
        </div>
      ) : null}

      {Object.keys(selectedPairs).length > 0 ? (
        <div
          className="space-y-2 rounded-lg border border-[#d9e5dd] bg-[#f6faf5] p-3"
          data-testid="match-pairs-selected"
        >
          {Object.entries(selectedPairs).map(([leftId, rightId]) => {
            const leftOption = leftOptions.find((option) => option.id === leftId);
            const rightOption = rightOptions.find((option) => option.id === rightId);

            return (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-left text-sm font-semibold disabled:opacity-80"
                disabled={disabled}
                key={leftId}
                onClick={() => removePair(leftId)}
                type="button"
              >
                <span>
                  {leftOption
                    ? getMatchOptionDisplayText(leftOption, "left")
                    : leftId}{" "}
                  {"→"}{" "}
                  {rightOption
                    ? getMatchOptionDisplayText(rightOption, "right")
                    : rightId}
                </span>
                {!disabled ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    {copy.exercise.remove}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-lg border border-dashed border-[#b6c6bf] bg-[#fbfcfa] p-3"
          data-testid="match-pairs-empty"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {copy.exercise.matchEmpty}
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2" data-testid="match-pairs-left">
          <p className="text-xs font-semibold text-muted-foreground">
            {copy.exercise.matchLeft}
          </p>
          {leftOptions.map((option) => {
            const isSelected = selectedLeftId === option.id;
            const isMatched = Boolean(selectedPairs[option.id]);

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-semibold transition hover:bg-accent disabled:cursor-default",
                  isSelected && "border-[#27645a] bg-[#eef7f1] text-[#1f5e50]",
                  isMatched && "bg-muted text-muted-foreground",
                )}
                disabled={disabled || isMatched}
                key={option.id}
                onClick={() => selectLeft(option.id)}
                type="button"
              >
                {getMatchOptionDisplayText(option, "left")}
              </button>
            );
          })}
        </div>

        <div className="space-y-2" data-testid="match-pairs-right">
          <p className="text-xs font-semibold text-muted-foreground">
            {copy.exercise.matchRight}
          </p>
          {rightOptions.map((option) => {
            const isSelected = selectedRightId === option.id;
            const isMatched = matchedRightIds.has(option.id);

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-semibold transition hover:bg-accent disabled:cursor-default",
                  isSelected && "border-[#27645a] bg-[#eef7f1] text-[#1f5e50]",
                  isMatched && "bg-muted text-muted-foreground",
                )}
                disabled={disabled || isMatched}
                key={option.id}
                onClick={() => selectRight(option.id)}
                type="button"
              >
                {getMatchOptionDisplayText(option, "right")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button disabled={disabled || !isComplete} onClick={handleSubmit} type="button">
          {submitLabel}
        </Button>
        <Button
          disabled={disabled || Object.keys(selectedPairs).length === 0}
          onClick={resetPairs}
          type="button"
          variant="outline"
        >
          {copy.exercise.reset}
        </Button>
      </div>
    </div>
  );
}
