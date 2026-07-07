"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { levels, units, getLessonsForUnit } from "@/content/curriculum";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";

export function LevelMap() {
  const { progress, setActiveLesson } = useLocalProgress();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-normal">Level map</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Level to unit to lesson to practice loop, structured for future tracks.
        </p>
      </div>

      {levels.map((level) => (
        <Card key={level.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="secondary">{level.id}</Badge>
                <CardTitle className="mt-3">{level.title.en}</CardTitle>
              </div>
              <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-xs font-semibold text-[#27645a]">
                Demo
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {level.description.en}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {level.unitIds.map((unitId) => {
              const unit = units.find((item) => item.id === unitId);
              if (!unit) {
                return null;
              }

              return (
                <div key={unit.id} className="space-y-3">
                  <div>
                    <p className="font-semibold">{unit.title.en}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {unit.description.en}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {getLessonsForUnit(unit.id).map((lesson, index) => {
                      const status =
                        progress.lessonStatus[lesson.id] ?? "not-started";
                      const Icon =
                        status === "complete"
                          ? Check
                          : index <= 1
                            ? Play
                            : Lock;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          onClick={() => setActiveLesson(lesson.id)}
                          className="flex items-center gap-3 rounded-lg border border-border bg-[#fbfcf8] p-3 transition hover:bg-accent"
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9ede4] text-[#30423c]",
                              status === "complete" &&
                                "bg-[#27645a] text-white",
                              status === "in-progress" &&
                                "bg-[#c9f269] text-[#152016]",
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {lesson.title.en}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {lesson.subtitle.en}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
