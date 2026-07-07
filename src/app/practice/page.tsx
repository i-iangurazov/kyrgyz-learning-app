import { PracticeReviewQueue } from "@/components/practice/practice-review-queue";
import { lessons } from "@/content/curriculum";

export default function PracticePage() {
  return <PracticeReviewQueue lessons={lessons} />;
}
