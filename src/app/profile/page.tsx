import { UserRound } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function ProfilePage() {
  return (
    <AppPlaceholder
      icon={UserRound}
      title="Profile"
      body="Your learning track, daily goal, progress history, and account settings will live here."
      chips={["Progress", "Track settings", "Daily goal", "History"]}
    />
  );
}
