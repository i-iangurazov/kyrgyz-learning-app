"use client";

import { CheckCircle2, MessageCircle, Mic2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionCard } from "@/components/lesson/section-card";
import type { Lesson } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { markLessonComplete, progress } = useLocalProgress();
  const isComplete = progress.completedLessonIds.includes(lesson.id);

  return (
    <article className="space-y-5" data-testid="lesson-player">
      <div className="rounded-lg bg-[#16231f] p-5 text-white">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-3 bg-[#c9f269] text-[#152016] hover:bg-[#c9f269]">
              {lesson.levelId} demo lesson
            </Badge>
            <h2 className="text-2xl font-bold tracking-normal">{lesson.title.en}</h2>
            <p className="mt-2 text-sm leading-6 text-white/76">{lesson.subtitle.en}</p>
          </div>
          <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
            {lesson.order}/3
          </div>
        </div>
        <Progress value={isComplete ? 100 : 42} className="bg-white/18" />
        <p className="mt-3 text-xs leading-5 text-white/68">{lesson.sampleNotice}</p>
      </div>

      <SectionCard
        eyebrow="Story"
        title={lesson.story.title.en}
        description="Context before new language appears."
        testId="section-story"
      >
        <p className="text-sm leading-6 text-foreground">{lesson.story.body.en}</p>
      </SectionCard>

      <SectionCard
        eyebrow="Vocabulary"
        title="Core words"
        description="Seeded from typed lesson data, not React copy."
        testId="section-vocabulary"
      >
        <div className="grid gap-3">
          {lesson.vocabulary.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-[#fbfcf8] p-4"
            >
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-normal">{item.kyrgyz}</p>
                {item.transliteration ? (
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {item.transliteration}
                  </p>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-semibold text-[#27645a]">
                {item.english}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Dialogue"
        title={lesson.dialogues[0].title.en}
        description={lesson.dialogues[0].context?.en}
        testId="section-dialogue"
      >
        <div className="space-y-3">
          {lesson.dialogues[0].lines.map((line, index) => (
            <div
              key={`${line.speaker}-${index}`}
              className="rounded-lg bg-muted px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {line.speaker}
              </p>
              <p className="mt-1 text-base font-semibold">{line.kyrgyz}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {line.english}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {lesson.texts[0] ? (
        <SectionCard
          eyebrow="Text"
          title={lesson.texts[0].title.en}
          description="Simple reading practice."
        >
          <p className="text-lg font-semibold leading-8">{lesson.texts[0].kyrgyz}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {lesson.texts[0].english}
          </p>
        </SectionCard>
      ) : null}

      <SectionCard
        eyebrow="Grammar"
        title={lesson.grammarPoints[0].title.en}
        description="Demo explanation pending expert validation."
        testId="section-grammar"
      >
        <p className="text-sm leading-6 text-foreground">
          {lesson.grammarPoints[0].explanation.en}
        </p>
        <div className="mt-4 space-y-2">
          {lesson.grammarPoints[0].examples.map((example) => (
            <div key={example.kyrgyz} className="rounded-lg border border-border p-3">
              <p className="font-semibold">{example.kyrgyz}</p>
              <p className="text-sm text-muted-foreground">{example.english}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-amber-800">
          {lesson.grammarPoints[0].validationTodo}
        </p>
      </SectionCard>

      <SectionCard
        eyebrow="Practice"
        title={lesson.exercises[0].prompt.en}
        description="Exercise data is schema-driven and ready for richer renderers."
        testId="section-exercise"
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            {lesson.exercises[0].items[0].question.en}
          </p>
          <div className="grid gap-2">
            {(lesson.exercises[0].items[0].options ?? [
              lesson.exercises[0].items[0].answer,
            ]).map((option) => (
              <button
                key={option.en}
                className="rounded-lg border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-accent"
                type="button"
              >
                {option.en}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Mini-game"
        title={lesson.miniGame.title.en}
        description={lesson.miniGame.description.en}
        testId="section-mini-game"
      >
        <div className="flex items-center gap-3 rounded-lg bg-[#eaf6f1] p-4 text-[#1d5c50]">
          <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            Placeholder for {lesson.miniGame.type} interaction.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Speaking"
        title={lesson.speakingPrompt.title.en}
        description={lesson.speakingPrompt.prompt.en}
        testId="section-speaking"
      >
        <Button className="w-full" type="button">
          <Mic2 className="h-4 w-4" aria-hidden="true" />
          Record placeholder
        </Button>
      </SectionCard>

      <SectionCard
        eyebrow="AI Roleplay"
        title={lesson.aiRoleplay.scenario.en}
        description={lesson.aiRoleplay.learnerGoal.en}
        testId="section-ai-roleplay"
      >
        <div className="rounded-lg border border-dashed border-[#66817b] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Roleplay model placeholder
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {lesson.aiRoleplay.systemPromptPlaceholder}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Review"
        title="Lesson summary"
        description={lesson.review.summary.en}
        testId="section-review"
      >
        <div className="space-y-2">
          {lesson.review.canDo.map((item) => (
            <div key={item.en} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2b8a68]" />
              <span>{item.en}</span>
            </div>
          ))}
        </div>
        <Button
          className="mt-5 w-full"
          onClick={() => markLessonComplete(lesson.id)}
          type="button"
        >
          {isComplete ? "Completed" : "Mark complete"}
        </Button>
      </SectionCard>
    </article>
  );
}
