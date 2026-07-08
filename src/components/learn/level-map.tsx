"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson, Level, Unit } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { defaultUiCopy as copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type LevelMapProps = {
  levels: Level[];
  units: Unit[];
  lessons: Lesson[];
};

export function LevelMap({ levels, units, lessons }: LevelMapProps) {
  const { progress, setActiveLesson } = useLocalProgress();

  function getLessonsForUnit(unitId: Unit["id"]) {
    return lessons
      .filter((lesson) => lesson.unitId === unitId)
      .sort((lessonA, lessonB) => lessonA.order - lessonB.order);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-normal">{copy.learn.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {copy.learn.description}
        </p>
      </div>

      {levels.map((level) => (
        <Card key={level.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="secondary">{level.id}</Badge>
                <CardTitle className="mt-3">{level.title.ru}</CardTitle>
              </div>
              <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-xs font-semibold text-[#27645a]">
                {copy.learn.startBadge}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {level.description.ru}
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
                    <p className="font-semibold">{unit.title.ru}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {unit.description.ru}
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
                              {lesson.title.ru}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {lesson.subtitle.ru}
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
