import { UserRound } from "lucide-react";

import { AppPlaceholder } from "@/components/placeholders/app-placeholder";
import { defaultUiCopy as copy } from "@/lib/copy";

export default function ProfilePage() {
  return (
    <AppPlaceholder
      icon={UserRound}
      title={copy.profile.title}
      body={copy.profile.body}
      chips={[...copy.profile.chips]}
    />
  );
}
