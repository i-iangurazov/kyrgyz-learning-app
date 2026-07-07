"use client";

import { Flame, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";

export function TopHeader() {
  const { progress } = useLocalProgress();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Kyrgyz K0/K1
          </p>
          <h1 className="truncate text-xl font-bold tracking-normal">
            Kyrgyz Path
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-1.5 rounded-full bg-[#fff5d6] px-3 text-sm font-semibold text-[#6f4a00]">
            <Flame className="h-4 w-4" aria-hidden="true" />
            {progress.streakDays}
          </div>
          <Button variant="outline" size="icon" aria-label="Settings">
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
