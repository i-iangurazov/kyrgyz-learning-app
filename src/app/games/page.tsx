import { Gamepad2 } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";
import { defaultUiCopy as copy } from "@/lib/copy";

export default function GamesPage() {
  return (
    <AppPlaceholder
      icon={Gamepad2}
      title={copy.games.title}
      body={copy.games.body}
      chips={[...copy.games.chips]}
    />
  );
}
