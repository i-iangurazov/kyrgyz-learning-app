"use client";

import { CheckCircle2, MessageCircle, Mic2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/lesson/audio-button";
import {
  LessonStepProgress,
  type LessonStep,
} from "@/components/lesson/lesson-step-progress";
import {
  getSupportedPracticeItemCount,
  PracticeSection,
} from "@/components/lesson/practice-section";
import { SectionCard } from "@/components/lesson/section-card";
import type { Lesson, LocalizedText } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { emptyLessonPracticeProgress } from "@/lib/progress";

const lessonSteps = [
  { id: "story", label: "Ситуация", sectionId: "lesson-story" },
  { id: "goals", label: "Цель", sectionId: "lesson-goals" },
  { id: "words", label: "Слова", sectionId: "lesson-words" },
  { id: "dialogue", label: "Диалог", sectionId: "lesson-dialogue" },
  { id: "breakdown", label: "Разбор", sectionId: "lesson-breakdown" },
  { id: "grammar", label: "Грамматика", sectionId: "lesson-grammar" },
  { id: "practice", label: "Практика", sectionId: "lesson-practice" },
  { id: "game", label: "Игра", sectionId: "lesson-game" },
  { id: "speaking", label: "Речь", sectionId: "lesson-speaking" },
  { id: "roleplay", label: "Диалог", sectionId: "lesson-roleplay" },
  { id: "review", label: "Итог", sectionId: "lesson-review" },
] satisfies LessonStep[];

function ruText(value: LocalizedText) {
  return value.ru ?? value.en;
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { markLessonComplete, progress, recordExerciseAttempt, recordMissedRetry } =
    useLocalProgress();
  const isComplete = progress.completedLessonIds.includes(lesson.id);
  const dialogue = lesson.dialogues[0];
  const readingText = lesson.texts[0];
  const grammarPoint = lesson.grammarPoints[0];
  const grammarExample = grammarPoint.examples[0];
  const breakdownItems =
    dialogue.breakdownItems.length > 0
      ? dialogue.breakdownItems
      : (readingText?.breakdownItems ?? []);
  const totalSupportedPracticeItems = getSupportedPracticeItemCount(
    lesson.exercises,
  );
  const storedPracticeProgress = progress.lessonPractice[lesson.id];
  const practiceProgress = {
    ...emptyLessonPracticeProgress,
    ...(storedPracticeProgress ?? {}),
    totalCount: storedPracticeProgress?.totalCount || totalSupportedPracticeItems,
  };
  const totalPracticeItems =
    practiceProgress.totalCount || totalSupportedPracticeItems;
  const practiceComplete =
    practiceProgress.practiceComplete ||
    (totalPracticeItems > 0 &&
      practiceProgress.completedCount >= totalPracticeItems);
  const missedCount = practiceProgress.missedCount;
  const correctedMissedCount = practiceProgress.correctedMissedCount;
  const missedReviewRemaining = Math.max(missedCount - correctedMissedCount, 0);
  const practiceResult = practiceComplete
    ? missedCount > 0 && missedReviewRemaining === 0
      ? `Вы сделали ${practiceProgress.completedCount} задания, сразу ответили верно на ${practiceProgress.correctCount} и исправили ${correctedMissedCount}.`
      : missedCount > 0
        ? `Вы сделали ${practiceProgress.completedCount} задания. Нужно повторить: ${missedReviewRemaining}.`
        : `Практика завершена: ${practiceProgress.correctCount} из ${totalPracticeItems} верно.`
    : practiceProgress.completedCount > 0
      ? `Готово: ${practiceProgress.completedCount} из ${totalPracticeItems}. Верно: ${practiceProgress.correctCount}.`
      : "Сделайте практику, чтобы увидеть итог.";
  const practiceNextStep = practiceComplete
    ? missedReviewRemaining > 0
      ? "Лучше повторить ошибки перед следующим шагом."
      : "Повторите фразы ещё раз и завершите урок."
    : totalPracticeItems === 0
      ? "Практика для этого урока готовится."
      : "Закончите карточку практики и вернитесь к итогу.";

  return (
    <article className="space-y-4" data-testid="lesson-player">
      <div className="rounded-lg bg-[#16231f] p-4 text-white">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-2 bg-[#c9f269] text-[#152016] hover:bg-[#c9f269]">
              Сегодня
            </Badge>
            <h2 className="text-[22px] font-bold leading-7 tracking-normal">
              {ruText(lesson.title)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/76">{ruText(lesson.subtitle)}</p>
          </div>
          <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
            {lesson.order}/3
          </div>
        </div>
        <p className="text-xs leading-5 text-white/68">
          Короткий урок для повседневного кыргызского.
        </p>
      </div>

      <LessonStepProgress steps={lessonSteps} />

      <SectionCard
        id="lesson-story"
        eyebrow="Ситуация"
        title={ruText(lesson.story.title)}
        compact
        description="Сначала контекст, затем новые слова."
        testId="section-story"
      >
        <p className="text-sm leading-6 text-foreground">{ruText(lesson.story.body)}</p>
      </SectionCard>

      <SectionCard
        id="lesson-goals"
        eyebrow="Цель"
        title="После урока вы сможете"
        compact
        description="2-3 понятных результата."
        testId="section-goals"
      >
        <div className="space-y-2">
          {lesson.learningGoals.slice(0, 4).map((objective) => (
            <div
              key={ruText(objective)}
              className="flex gap-2.5 rounded-lg bg-[#f5f8f2] p-2.5 text-[13px]"
            >
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2b8a68]"
                aria-hidden="true"
              />
              <span className="font-medium leading-5">{ruText(objective)}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-words"
        eyebrow="Слова"
        title="Главные слова"
        description="Они встретятся в диалоге и практике."
        testId="section-vocabulary"
      >
        <div className="grid gap-3">
          {lesson.vocabulary.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-[#fbfcf8] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold tracking-normal">{item.kyrgyz}</p>
                  {item.transliteration ? (
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.transliteration}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-sm font-semibold text-[#27645a]">
                  {item.translations.ru}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 text-xs leading-5 text-muted-foreground">
                  {item.example.translations.ru}
                </p>
                <AudioButton
                  audio={item.audio}
                  ariaLabel="Слушать слово"
                  className="w-[86px] shrink-0"
                  testId="vocabulary-audio-control"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-dialogue"
        eyebrow="Диалог"
        title={ruText(dialogue.title)}
        description={dialogue.context ? ruText(dialogue.context) : undefined}
        testId="section-dialogue"
      >
        <div className="space-y-3">
          {dialogue.lines.map((line, index) => (
            <div
              key={`${line.speaker}-${index}`}
              className="rounded-lg bg-muted px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  {line.speaker}
                </p>
                <AudioButton
                  audio={line.audio}
                  ariaLabel="Слушать фразу"
                  className="w-[86px] shrink-0"
                  testId="dialogue-audio-control"
                />
              </div>
              <p className="mt-1 text-base font-semibold">{line.kyrgyz}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {line.translations.ru}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {readingText ? (
        <SectionCard
          eyebrow="Текст"
          title={ruText(readingText.title)}
          description="Короткое чтение."
        >
          {readingText.paragraphs.map((paragraph) => (
            <div key={paragraph.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-semibold leading-8">
                  {paragraph.kyrgyz}
                </p>
                <AudioButton
                  audio={paragraph.audio}
                  ariaLabel="Слушать текст"
                  className="w-[86px] shrink-0"
                  testId="reading-audio-control"
                />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {paragraph.translations.ru}
              </p>
            </div>
          ))}
        </SectionCard>
      ) : null}

      <SectionCard
        id="lesson-breakdown"
        eyebrow="Разбор"
        title="Как это устроено"
        description="Посмотрите на кусочки перед практикой."
        testId="section-breakdown"
      >
        <div className="space-y-3">
          {breakdownItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3"
            >
              <span className="font-semibold">{item.phrase}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {item.meaningByTrack.RU_KY}
              </span>
            </div>
          ))}
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Полезный кусок
            </p>
            <p className="mt-2 font-semibold">{grammarExample.kyrgyz}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {grammarExample.translations.ru}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-grammar"
        eyebrow="Грамматика"
        title={ruText(grammarPoint.title)}
        description="Почему фраза работает."
        testId="section-grammar"
      >
        <p className="text-sm leading-6 text-foreground">
          {ruText(grammarPoint.simpleRule)}
        </p>
        <div className="mt-4 space-y-2">
          {grammarPoint.examples.map((example) => (
            <div key={example.kyrgyz} className="rounded-lg border border-border p-3">
              <p className="font-semibold">{example.kyrgyz}</p>
              <p className="text-sm text-muted-foreground">
                {example.translations.ru}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-practice"
        eyebrow="Практика"
        title="Проверьте себя"
        description="Короткая серия заданий."
        testId="section-exercise"
      >
        <PracticeSection
          exerciseAttempts={progress.exerciseAttempts}
          exercises={lesson.exercises}
          lessonId={lesson.id}
          missedPractice={progress.missedPractice}
          onAttempt={recordExerciseAttempt}
          onMissedRetry={recordMissedRetry}
          practiceProgress={practiceProgress}
        />
      </SectionCard>

      <SectionCard
        id="lesson-game"
        eyebrow="Игра"
        title={ruText(lesson.miniGame.title)}
        description={ruText(lesson.miniGame.description)}
        testId="section-mini-game"
      >
        <div className="flex items-center gap-3 rounded-lg bg-[#eaf6f1] p-4 text-[#1d5c50]">
          <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            Быстрое повторение слов из урока.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-speaking"
        eyebrow="Речь"
        title={ruText(lesson.speakingPrompt.title)}
        description={ruText(lesson.speakingPrompt.prompt)}
        testId="section-speaking"
      >
        <Button className="w-full" type="button">
          <Mic2 className="h-4 w-4" aria-hidden="true" />
          Попробовать вслух
        </Button>
      </SectionCard>

      <SectionCard
        id="lesson-roleplay"
        eyebrow="Диалог"
        title={ruText(lesson.aiRoleplay.title)}
        description={ruText(lesson.aiRoleplay.userGoal)}
        testId="section-ai-roleplay"
      >
        <div className="rounded-lg border border-dashed border-[#66817b] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Тренировка ситуации
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Используйте слова урока в коротком безопасном диалоге.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-review"
        eyebrow="Повторение"
        title="Итог урока"
        description={ruText(lesson.review.summary)}
        testId="section-review"
      >
        <div
          className="mb-5 rounded-lg bg-[#f4f8f4] p-4 text-sm"
          data-testid="practice-summary"
        >
          <p className="font-semibold">Практика</p>
          <p className="mt-1 leading-6 text-muted-foreground">{practiceResult}</p>
          <p className="mt-2 text-xs font-medium text-[#27645a]">
            {practiceNextStep}
          </p>
        </div>
        <div className="space-y-2">
          {lesson.review.canDo.map((item) => (
            <div key={ruText(item)} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2b8a68]" />
              <span>{ruText(item)}</span>
            </div>
          ))}
        </div>
        <Button
          className="mt-5 w-full"
          onClick={() => markLessonComplete(lesson.id)}
          type="button"
        >
          {isComplete ? "Урок завершён" : "Завершить урок"}
        </Button>
      </SectionCard>
    </article>
  );
}
