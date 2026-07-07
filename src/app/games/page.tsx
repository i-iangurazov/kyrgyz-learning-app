import { Gamepad2 } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function GamesPage() {
  return (
    <AppPlaceholder
      icon={Gamepad2}
      title="Games"
      body="Mini-games unlock from lesson words and phrases, so every round reinforces what you are learning."
      chips={["Sound match", "Quick pick", "Word order", "Memory"]}
    />
  );
}
