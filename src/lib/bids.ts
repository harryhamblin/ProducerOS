import { createClient } from "@/lib/supabase/server";

export type Bid = {
  id: string;
  project_id: string;
  name: string;
  version: number;
  status: string;
  currency: string;
  notes: string | null;
};

export type CreateBidInput = {
  name: string;
  version: number;
  status: string;
  currency: string;
  notes?: string;
};

export async function getBids(projectId: string): Promise<Bid[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bids")
    .select("*")
    .eq("project_id", projectId)
    .order("version");

  if (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }

  return (data ?? []) as Bid[];
}

export async function getBid(id: string): Promise<Bid | null> {
  console.log("getBid id:", id);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bids")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }

  return data as Bid | null;
}


export async function createBid(
  projectId: string,
  input: CreateBidInput
): Promise<Bid> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bids")
    .insert({
      project_id: projectId,
      name: input.name,
      version: input.version,
      status: input.status,
      currency: input.currency,
      notes: input.notes ?? null,
    })
    .select()
    .single();

 if (error) {
  console.error(error);
  throw error;
}

  return data as Bid;
}

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

export async function updateBidTaskDuration(
  bidTaskId: string,
  durationDays: number
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bid_tasks")
    .update({
      duration_days: durationDays,
    })
    .eq("id", bidTaskId);

  if (error) {
    console.error("Error updating bid task:", error);
    throw error;
  }
}