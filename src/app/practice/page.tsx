import { Dumbbell } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function PracticePage() {
  return (
    <AppPlaceholder
      icon={Dumbbell}
      title="Practice"
      body="Your review queue will help you revisit words, phrases, listening, and reading at the right time."
      chips={["Review", "Listening", "Reading", "Translation"]}
    />
  );
}
