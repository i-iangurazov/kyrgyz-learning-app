import { HomeDashboard } from "@/components/home/home-dashboard";
import { listLessons } from "@/content/repository";

export default async function HomePage() {
  const lessons = await listLessons();

  return <HomeDashboard lessons={lessons} />;
}
