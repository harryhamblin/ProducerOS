"use server";

import { revalidatePath } from "next/cache";
import { createProject, deleteProject } from "@/lib/projects/getProjects";

export async function createNewProject() {
  const projectCode = `PRJ-${Date.now().toString().slice(-6)}`;

  await createProject({
    project_name: "New Project",
    project_code: projectCode,
  });

  revalidatePath("/projects");
}

export async function deleteProjectAction(formData: FormData) {
  const projectId = formData.get("projectId") as string;

  await deleteProject(projectId);

  revalidatePath("/projects");
}