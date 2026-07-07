import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  testId?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  testId,
}: SectionCardProps) {
  return (
    <section data-testid={testId} className="scroll-mt-24">
      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
