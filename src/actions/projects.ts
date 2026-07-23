"use server";

import { revalidatePath } from "next/cache";
import { createProject } from "@/lib/projects";

export async function createNewProject() {
  const code = `PRJ-${Date.now().toString().slice(-6)}`;

  await createProject({
    name: "New Project",
    code,
  });

  revalidatePath("/projects");
}