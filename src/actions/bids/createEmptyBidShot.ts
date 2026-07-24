"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBidShot(
  projectID: string,
  bidID: string,
) {
  const supabase = await createClient();

  const { data: shots, error: fetchError } = await supabase
    .from("bid_shots")
    .select("shot_code")
    .eq("bid_id", bidID);

  if (fetchError) throw fetchError;

  let highest = 0;

  for (const shot of shots ?? []) {
    const match = shot.shot_code.match(/^SHOT(\d+)$/);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  }

  const nextShotCode = `SHOT${String(highest + 1).padStart(3, "0")}`;

const { data: bidShot, error } = await supabase
  .from("bid_shots")
  .insert({
    bid_id: bidID,
    shot_code: nextShotCode,
    cost_type: "Per Shot",
    quantity: 1,
  })
  .select()
  .single();

if (error) throw error;

const { data: tasks, error: tasksError } = await supabase
  .from("tasks")
  .select("id")
  .order("sort_order");

if (tasksError) throw tasksError;

const bidTasks =
  tasks?.map((task) => ({
    bid_shot_id: bidShot.id,
    task_id: task.id,
    duration_days: 0,
    notes: null,
  })) ?? [];
  
if (bidTasks.length) {
  const { error: bidTaskError } = await supabase
    .from("bid_tasks")
    .insert(bidTasks);

  if (bidTaskError) throw bidTaskError;
}

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}