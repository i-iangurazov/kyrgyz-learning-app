import { Dumbbell } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function PracticePage() {
  return (
    <AppPlaceholder
      icon={Dumbbell}
      title="Practice"
      body="A focused queue for spaced review, listening checks, translation, and reading drills will live here."
      chips={["Spaced review", "Listening", "Reading", "Translation"]}
    />
  );
}
