import { PracticeReviewQueue } from "@/components/practice/practice-review-queue";
import { lessons } from "@/content/curriculum";

const lessonSummaries = lessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title.en,
  levelId: lesson.levelId,
}));

export default function PracticePage() {
  return <PracticeReviewQueue lessons={lessonSummaries} />;
}
