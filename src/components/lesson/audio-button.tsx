"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AudioAsset } from "@/content/schemas";
import { cn } from "@/lib/utils";

type AudioButtonProps = {
  audio?: AudioAsset;
  label: string;
  unavailableLabel?: string;
  className?: string;
  testId?: string;
};

export function AudioButton({
  audio,
  className,
  label,
  testId = "audio-button",
  unavailableLabel = "Audio coming soon",
}: AudioButtonProps) {
  const [playError, setPlayError] = useState(false);
  const hasPlayableAudio = Boolean(audio?.url);
  const buttonLabel = hasPlayableAudio ? label : unavailableLabel;

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
        className="min-h-10 w-full px-3 text-[11px]"
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
        <span className="whitespace-nowrap">{buttonLabel}</span>
      </Button>
      {playError ? (
        <p className="mt-1 text-xs font-medium text-[#87352f]" role="status">
          Audio could not play.
        </p>
      ) : null}
    </div>
  );
}
