import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  compact?: boolean;
  id?: string;
  testId?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  compact = false,
  id,
  testId,
}: SectionCardProps) {
  return (
    <section id={id} data-testid={testId} className="scroll-mt-36">
      <Card>
        <CardHeader className={cn(compact && "space-y-1 p-4 pb-3")}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className={cn(compact && "px-4 pb-4")}>{children}</CardContent>
      </Card>
    </section>
  );
}
