"use server";

import { createClient } from "@/lib/supabase/client";


export async function addShotsToBid(
  bidId: string,
  shotIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Get all tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id")
    .order("sort_order");

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    throw tasksError;
  }

  // Add shots to the bid
  const { data: bidShots, error: bidShotsError } = await supabase
    .from("bid_shots")
    .insert(
      shotIds.map((shotId) => ({
        bid_id: bidId,
        shot_id: shotId,
      }))
    )
    .select();

  if (bidShotsError) {
    console.error("Error creating bid shots:", bidShotsError);
    throw bidShotsError;
  }

  // Create one bid_task per task for every shot
  const bidTasks = bidShots.flatMap((bidShot) =>
    tasks.map((task) => ({
      bid_shot_id: bidShot.id,
      task_id: task.id,
      duration_days: 0,
      notes: null,
    }))
  );

  if (bidTasks.length > 0) {
    const { error } = await supabase
      .from("bid_tasks")
      .insert(bidTasks);

    if (error) {
      console.error("Error creating bid tasks:", error);
      throw error;
    }
  }
}