import { UserRound } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function ProfilePage() {
  return (
    <AppPlaceholder
      icon={UserRound}
      title="Профиль"
      body="Здесь будут маршрут обучения, дневная цель, история и настройки."
      chips={["Прогресс", "Маршрут", "Дневная цель", "История"]}
    />
  );
}
