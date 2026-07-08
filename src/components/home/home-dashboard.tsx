"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Lesson } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { calculateLessonCompletion } from "@/lib/progress";

export function HomeDashboard({ lessons }: { lessons: Lesson[] }) {
  const { progress } = useLocalProgress();
  const activeLesson =
    lessons.find((lesson) => lesson.id === progress.activeLessonId) ?? lessons[0];
  const completion = calculateLessonCompletion(
    progress.completedLessonIds,
    lessons.length,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-[#16231f] p-5 text-white">
        <p className="text-sm font-semibold text-[#c9f269]">Сегодня</p>
        <h2 className="mt-2 text-3xl font-bold tracking-normal">
          Начните говорить по-кыргызски
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/72">
          Короткие уроки, живые фразы и спокойный ежедневный прогресс.
        </p>
        <Button asChild className="mt-5 bg-white text-[#16231f] hover:bg-white/90">
          <Link href={`/lesson/${activeLesson.id}`}>
            Продолжить урок
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <BookMarked className="h-5 w-5 text-[#27645a]" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold">{lessons.length}</p>
            <p className="text-sm text-muted-foreground">Готовые уроки</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Trophy className="h-5 w-5 text-[#936600]" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold">{progress.xp}</p>
            <p className="text-sm text-muted-foreground">Очки практики</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ваш прогресс</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completion} />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {completion}% текущего маршрута уже пройдено. Двигайтесь короткими
            шагами.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Текущий урок</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{activeLesson.title.ru}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {activeLesson.subtitle.ru}
          </p>
          <Button asChild variant="secondary" className="mt-4 w-full">
            <Link href={`/lesson/${activeLesson.id}`}>Открыть урок</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
