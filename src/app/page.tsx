import { HomeDashboard } from "@/components/home/home-dashboard";
import { lessons } from "@/content/curriculum";

export default function HomePage() {
  return <HomeDashboard lessons={lessons} />;
}
