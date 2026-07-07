import { Gamepad2 } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function GamesPage() {
  return (
    <AppPlaceholder
      icon={Gamepad2}
      title="Games"
      body="Mini-games will reuse lesson data for sound matching, quick picks, word order, and memory practice."
      chips={["Sound match", "Quick pick", "Word order", "Memory"]}
    />
  );
}
