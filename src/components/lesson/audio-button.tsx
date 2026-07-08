"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AudioAsset } from "@/content/schemas";
import { cn } from "@/lib/utils";

type AudioButtonProps = {
  audio?: AudioAsset;
  ariaLabel: string;
  label?: string;
  unavailableLabel?: string;
  className?: string;
  testId?: string;
};

export function AudioButton({
  audio,
  ariaLabel,
  className,
  label = "Слушать",
  testId = "audio-button",
  unavailableLabel = "Скоро",
}: AudioButtonProps) {
  const [playError, setPlayError] = useState(false);
  const hasPlayableAudio = Boolean(audio?.url);
  const visibleLabel = hasPlayableAudio ? label : unavailableLabel;
  const buttonLabel = hasPlayableAudio ? ariaLabel : `${ariaLabel}: скоро`;

  const handlePlay = () => {
    if (!audio?.url) {
      return;
    }

    const player = new Audio(audio.url);
    player.play().catch(() => setPlayError(true));
  };

  return (
    <div className={cn("min-w-0", className)}>
      <Button
        aria-label={buttonLabel}
        className="min-h-9 w-full min-w-0 gap-1.5 px-2.5 text-[11px]"
        data-testid={testId}
        disabled={!hasPlayableAudio}
        onClick={handlePlay}
        size="sm"
        type="button"
        variant="outline"
      >
        {hasPlayableAudio ? (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="truncate">{visibleLabel}</span>
      </Button>
      {playError ? (
        <p className="mt-1 text-xs font-medium text-[#87352f]" role="status">
          Не удалось включить аудио.
        </p>
      ) : null}
    </div>
  );
}
