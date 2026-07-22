import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";

type Props = {
  params: Promise<{
    projectID: string;
  }>;
};

export default async function ProjectSettingsPage({ params }: Props) {
  const { projectID } = await params;

  const project = await getProject(projectID);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {project.name} Settings
      </h1>
    </div>
  );
}