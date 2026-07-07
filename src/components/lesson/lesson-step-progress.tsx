"use client";

import { useEffect, useMemo, useState } from "react";

import { Progress } from "@/components/ui/progress";

export type LessonStep = {
  id: string;
  label: string;
  sectionId: string;
};

export function LessonStepProgress({ steps }: { steps: LessonStep[] }) {
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? "");

  const activeIndex = useMemo(() => {
    const index = steps.findIndex((step) => step.id === activeStepId);
    return index >= 0 ? index : 0;
  }, [activeStepId, steps]);
  const activeStep = steps[activeIndex] ?? steps[0];
  const nextStep = steps[activeIndex + 1];

  useEffect(() => {
    const firstStep = steps[0];
    const finalStep = steps[steps.length - 1];

    if (!firstStep || !finalStep) {
      return;
    }

    let animationFrame = 0;
    let deferredUpdate = 0;

    const updateActiveStep = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const page = document.documentElement;
        const isAtBottom =
          window.innerHeight + window.scrollY >= page.scrollHeight - 8;

        if (isAtBottom) {
          setActiveStepId(finalStep.id);
          return;
        }

        const activeOffset = 170;
        let currentStep = firstStep;

        for (const step of steps) {
          const element = document.getElementById(step.sectionId);

          if (element && element.getBoundingClientRect().top <= activeOffset) {
            currentStep = step;
          }
        }

        setActiveStepId(currentStep.id);
      });
    };

    const applyHashStep = () => {
      const sectionId = decodeURIComponent(window.location.hash.replace("#", ""));
      const hashStep = steps.find((step) => step.sectionId === sectionId);

      if (hashStep) {
        setActiveStepId(hashStep.id);
        return;
      }

      updateActiveStep();
    };

    updateActiveStep();
    applyHashStep();
    deferredUpdate = window.setTimeout(() => {
      updateActiveStep();
      applyHashStep();
    }, 100);
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);
    window.addEventListener("hashchange", applyHashStep);

    return () => {
      window.clearTimeout(deferredUpdate);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
      window.removeEventListener("hashchange", applyHashStep);
    };
  }, [steps]);

  return (
    <nav
      aria-label="Lesson progress"
      className="sticky top-[76px] z-30 -mx-1 rounded-lg border border-border bg-background/95 p-2.5 shadow-sm backdrop-blur-xl"
      data-testid="lesson-step-progress"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <a
            aria-current="step"
            className="rounded-full bg-[#27645a] px-3 py-1 text-[11px] font-semibold text-white"
            href={`#${activeStep.sectionId}`}
          >
            {activeStep.label}
          </a>
          {nextStep ? (
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              Next: {nextStep.label}
            </span>
          ) : null}
        </div>
        <p className="shrink-0 text-[11px] font-semibold text-[#27645a]">
          Step {activeIndex + 1} of {steps.length}
        </p>
      </div>
      <Progress
        className="mt-2 h-1.5"
        value={((activeIndex + 1) / steps.length) * 100}
      />
    </nav>
  );
}
