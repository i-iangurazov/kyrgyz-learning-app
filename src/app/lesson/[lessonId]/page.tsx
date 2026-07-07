import { notFound } from "next/navigation";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { getLessonById, lessons } from "@/content/curriculum";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}
