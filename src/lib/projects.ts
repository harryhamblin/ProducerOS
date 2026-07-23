import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  name: string;
  code: string;
  status_id: number;
  status: ProjectStatus;
  current_award: number | null;
  foreign_spend: number | null;
  shot_count: number | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStatus = {
  id: number;
  name: string;
  colour: string;
};

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
    .order("name", { ascending: true });

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
  name: string;
  code: string;
  status_id?: number;
  current_award?: number;
  foreign_spend?: number;
  shot_count?: number;
};

export async function createProject(input: CreateProjectInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: input.name,
      code: input.code,
      status_id: input.status_id ?? 1,
      current_award: input.current_award ?? null,
      foreign_spend: input.foreign_spend ?? null,
      shot_count: input.shot_count ?? null,
    })
    .select()
    .single();

if (error) {
  console.error("PROJECT INSERT ERROR");
  console.error(JSON.stringify(error, null, 2));
  throw new Error(JSON.stringify(error));
}

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id");

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    throw tasksError;
  }

  const rates = tasks.map((task) => ({
    project_id: data.id,
    task_id: task.id,
    daily_rate: 0,
  }));

if (rates.length > 0) {
  const { error: ratesError } = await supabase
    .from("project_task_rates")
    .insert(rates);

  if (ratesError) {
    console.error("Error creating project task rates:", ratesError);
    throw ratesError;
  }
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
      updated_at: new Date().toISOString(),
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