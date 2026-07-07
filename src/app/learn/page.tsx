import { LevelMap } from "@/components/learn/level-map";
import { getCurriculumContent } from "@/content/repository";

export default async function LearnPage() {
  const { levels, units, lessons } = await getCurriculumContent();

  return <LevelMap levels={levels} units={units} lessons={lessons} />;
}
