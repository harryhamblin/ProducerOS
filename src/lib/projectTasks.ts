import { createClient } from "@/lib/supabase/server";

type ProjectTaskRow = {
  task_id: number;
  daily_rate: number;
  tasks:
    | {
        id: number;
        name: string;
      }
    | null;
};

export async function getProjectTasks(projectID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_task_rates")
    .select(`
      task_id,
      daily_rate,
      tasks (
        id,
        name
      )
    `)
    .eq("project_id", projectID)
    .order("task_id");

  if (error) throw error;

  const rows = data as unknown as ProjectTaskRow[];

  return rows.map((row) => ({
    task_id: row.task_id,
    daily_rate: row.daily_rate,
    id: row.tasks?.id ?? row.task_id,
    name: row.tasks?.name ?? "Unknown",
  }));
}