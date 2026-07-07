import { UserRound } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";

export default function ProfilePage() {
  return (
    <AppPlaceholder
      icon={UserRound}
      title="Profile"
      body="Account, track preference, progress history, and learning settings will be connected after the MVP shell."
      chips={["Mock progress", "Track settings", "Daily goal", "History"]}
    />
  );
}
