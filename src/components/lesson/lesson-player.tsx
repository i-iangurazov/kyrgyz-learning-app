"use client";

import { CheckCircle2, MessageCircle, Mic2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LessonStepProgress,
  type LessonStep,
} from "@/components/lesson/lesson-step-progress";
import {
  getSupportedPracticeItemCount,
  PracticeSection,
} from "@/components/lesson/practice-section";
import { SectionCard } from "@/components/lesson/section-card";
import type { Lesson } from "@/content/schemas";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { emptyLessonPracticeProgress } from "@/lib/progress";

const lessonSteps = [
  { id: "story", label: "Story", sectionId: "lesson-story" },
  { id: "goals", label: "Goals", sectionId: "lesson-goals" },
  { id: "words", label: "Words", sectionId: "lesson-words" },
  { id: "dialogue", label: "Dialogue/Text", sectionId: "lesson-dialogue" },
  { id: "breakdown", label: "Breakdown", sectionId: "lesson-breakdown" },
  { id: "grammar", label: "Grammar", sectionId: "lesson-grammar" },
  { id: "practice", label: "Practice", sectionId: "lesson-practice" },
  { id: "game", label: "Game", sectionId: "lesson-game" },
  { id: "speaking", label: "Speaking", sectionId: "lesson-speaking" },
  { id: "roleplay", label: "Roleplay", sectionId: "lesson-roleplay" },
  { id: "review", label: "Review", sectionId: "lesson-review" },
] satisfies LessonStep[];

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { markLessonComplete, progress, recordExerciseAttempt } = useLocalProgress();
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
  const practiceResult = practiceComplete
    ? `Practice complete: ${practiceProgress.correctCount} of ${totalPracticeItems} correct.`
    : practiceProgress.completedCount > 0
      ? `${practiceProgress.completedCount} of ${totalPracticeItems} practice items complete. ${practiceProgress.correctCount} correct so far.`
      : "Complete practice to see your result here.";
  const practiceNextStep = practiceComplete
    ? "Review the phrases once more, then mark the lesson complete."
    : totalPracticeItems === 0
      ? "Practice activities are being prepared for this lesson."
      : "Finish the practice card, then come back to this review.";

  return (
    <article className="space-y-4" data-testid="lesson-player">
      <div className="rounded-lg bg-[#16231f] p-4 text-white">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-2 bg-[#c9f269] text-[#152016] hover:bg-[#c9f269]">
              Today&apos;s lesson
            </Badge>
            <h2 className="text-[22px] font-bold leading-7 tracking-normal">
              {lesson.title.en}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/76">{lesson.subtitle.en}</p>
          </div>
          <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
            {lesson.order}/3
          </div>
        </div>
        <p className="text-xs leading-5 text-white/68">
          A short session for building everyday Kyrgyz.
        </p>
      </div>

      <LessonStepProgress steps={lessonSteps} />

      <SectionCard
        id="lesson-story"
        eyebrow="Story"
        title={lesson.story.title.en}
        compact
        description="Context before new language appears."
        testId="section-story"
      >
        <p className="text-sm leading-6 text-foreground">{lesson.story.body.en}</p>
      </SectionCard>

      <SectionCard
        id="lesson-goals"
        eyebrow="Goals"
        title="What you'll be able to do"
        compact
        description="Your targets for this lesson."
        testId="section-goals"
      >
        <div className="space-y-2">
          {lesson.learningGoals.slice(0, 4).map((objective) => (
            <div
              key={objective.en}
              className="flex gap-2.5 rounded-lg bg-[#f5f8f2] p-2.5 text-[13px]"
            >
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2b8a68]"
                aria-hidden="true"
              />
              <span className="font-medium leading-5">{objective.en}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-words"
        eyebrow="Vocabulary"
        title="Core words"
        description="Start with the words you will see in this lesson."
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
                {item.translations.en}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-dialogue"
        eyebrow="Dialogue"
        title={dialogue.title.en}
        description={dialogue.context?.en}
        testId="section-dialogue"
      >
        <div className="space-y-3">
          {dialogue.lines.map((line, index) => (
            <div
              key={`${line.speaker}-${index}`}
              className="rounded-lg bg-muted px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {line.speaker}
              </p>
              <p className="mt-1 text-base font-semibold">{line.kyrgyz}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {line.translations.en}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {readingText ? (
        <SectionCard
          eyebrow="Text"
          title={readingText.title.en}
          description="Simple reading practice."
        >
          {readingText.paragraphs.map((paragraph) => (
            <div key={paragraph.id} className="space-y-2">
              <p className="text-lg font-semibold leading-8">{paragraph.kyrgyz}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {paragraph.translations.en}
              </p>
            </div>
          ))}
        </SectionCard>
      ) : null}

      <SectionCard
        id="lesson-breakdown"
        eyebrow="Breakdown"
        title="How it fits together"
        description="Notice the pieces before you practice."
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
                {item.meaningByTrack.EN_KY}
              </span>
            </div>
          ))}
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Useful chunk
            </p>
            <p className="mt-2 font-semibold">{grammarExample.kyrgyz}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {grammarExample.translations.en}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-grammar"
        eyebrow="Grammar"
        title={grammarPoint.title.en}
        description="Why this phrase works."
        testId="section-grammar"
      >
        <p className="text-sm leading-6 text-foreground">
          {grammarPoint.simpleRule.en}
        </p>
        <div className="mt-4 space-y-2">
          {grammarPoint.examples.map((example) => (
            <div key={example.kyrgyz} className="rounded-lg border border-border p-3">
              <p className="font-semibold">{example.kyrgyz}</p>
              <p className="text-sm text-muted-foreground">
                {example.translations.en}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-practice"
        eyebrow="Practice"
        title="Practice this phrase"
        description="Work through a short guided set."
        testId="section-exercise"
      >
        <PracticeSection
          exerciseAttempts={progress.exerciseAttempts}
          exercises={lesson.exercises}
          lessonId={lesson.id}
          onAttempt={recordExerciseAttempt}
          practiceProgress={practiceProgress}
        />
      </SectionCard>

      <SectionCard
        id="lesson-game"
        eyebrow="Mini-game"
        title={lesson.miniGame.title.en}
        description={lesson.miniGame.description.en}
        testId="section-mini-game"
      >
        <div className="flex items-center gap-3 rounded-lg bg-[#eaf6f1] p-4 text-[#1d5c50]">
          <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            Quick practice with today&apos;s words.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-speaking"
        eyebrow="Speaking"
        title={lesson.speakingPrompt.title.en}
        description={lesson.speakingPrompt.prompt.en}
        testId="section-speaking"
      >
        <Button className="w-full" type="button">
          <Mic2 className="h-4 w-4" aria-hidden="true" />
          Try speaking
        </Button>
      </SectionCard>

      <SectionCard
        id="lesson-roleplay"
        eyebrow="AI Roleplay"
        title={lesson.aiRoleplay.title.en}
        description={lesson.aiRoleplay.userGoal.en}
        testId="section-ai-roleplay"
      >
        <div className="rounded-lg border border-dashed border-[#66817b] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Guided scenario practice
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Use the words from this lesson to respond in a short, safe exchange.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        id="lesson-review"
        eyebrow="Review"
        title="Lesson summary"
        description={lesson.review.summary.en}
        testId="section-review"
      >
        <div
          className="mb-5 rounded-lg bg-[#f4f8f4] p-4 text-sm"
          data-testid="practice-summary"
        >
          <p className="font-semibold">Practice progress</p>
          <p className="mt-1 leading-6 text-muted-foreground">{practiceResult}</p>
          <p className="mt-2 text-xs font-medium text-[#27645a]">
            {practiceNextStep}
          </p>
        </div>
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
