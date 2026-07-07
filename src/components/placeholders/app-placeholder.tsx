import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type AppPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  chips: string[];
};

export function AppPlaceholder({
  icon: Icon,
  title,
  body,
  chips,
}: AppPlaceholderProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-[#16231f] p-5 text-white">
        <Icon className="h-8 w-8 text-[#c9f269]" aria-hidden="true" />
        <h2 className="mt-5 text-2xl font-bold tracking-normal">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/72">{body}</p>
      </section>
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[#edf1e9] px-3 py-2 text-xs font-semibold text-[#33433e]"
              >
                {chip}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
