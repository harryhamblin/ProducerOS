import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

export async function getProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
            *,
            status:project_statuses(
                id,
                name,
                colour
            )
            `)
    .order("project_name", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
   return data as Project[];
}

export async function getProject(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

if (error) {
 console.error(JSON.stringify(error, null, 2));
throw error;
}

  return data as Project | null;
}

type CreateProjectInput = {
  project_name: string;
  project_code: string;
  status_id?: number;
  current_award?: number;
  foreign_spend?: number;
  shot_count?: number;
};

export async function createProject(input: CreateProjectInput) {
  console.log("================================");
  console.log("CREATE PROJECT CALLED");
  console.log(input);
  console.log("project_name =", input.project_name);
  console.log("project_code =", input.project_code);
  console.log("================================");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_name: input.project_name,
      project_code: input.project_code,
      status_id: input.status_id ?? 1,
      current_award: input.current_award ?? null,
      foreign_spend: input.foreign_spend ?? null,
      shot_count: input.shot_count ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(JSON.stringify(error));
  }

  return data as Project;
}




type UpdateProjectInput = Partial<CreateProjectInput>;

export async function updateProject(
  id: string,
  updates: UpdateProjectInput
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...updates,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }

  return data as Project;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}