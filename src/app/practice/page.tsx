import { PracticeReviewQueue } from "@/components/practice/practice-review-queue";
import { listLessons } from "@/content/repository";

export default async function PracticePage() {
  const lessons = await listLessons();

  return <PracticeReviewQueue lessons={lessons} />;
}
