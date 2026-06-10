import { Project } from "@/types/project";
import HomeClient from "./HomeClient";

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const projects = await getProjects();
  const heroProjects = projects.filter((p) => p.hero);

  return (
    <HomeClient projects={projects} heroProjects={heroProjects} />
  );
}
