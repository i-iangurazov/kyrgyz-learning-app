import { Gamepad2 } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function GamesPage() {
  return (
    <AppPlaceholder
      icon={Gamepad2}
      title="Игры"
      body="Короткие игры будут закреплять слова и фразы из уроков."
      chips={["Звуки", "Быстрый выбор", "Порядок слов", "Память"]}
    />
  );
}
