"use server";

import { createProject } from "@/lib/projects";

export async function createNewProject() {
  return await createProject({
    name: "New Project",
    code: "NEW",
  });
}