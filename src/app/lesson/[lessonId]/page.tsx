import { notFound } from "next/navigation";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { getLessonById, listLessons } from "@/content/repository";

export async function generateStaticParams() {
  const lessons = await listLessons();

  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}
