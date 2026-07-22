import { createClient } from "@/lib/supabase/server";

export type BidTask = {
  id: string;
  bid_shot_id: string;
  task_id: number;
  duration_days: number;
  notes: string | null;
};

export async function getBidTasks(bidID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bid_tasks")
    .select(`
      id,
      bid_shot_id,
      task_id,
      duration_days,
      notes,
      bid_shots!inner (
        bid_id
      )
    `)
    .eq("bid_shots.bid_id", bidID);

  if (error) {
    throw error;
  }

  const lookup = new Map<string, Map<number, BidTask>>();

  for (const row of (data ?? []) as any[]) {
    if (!lookup.has(row.bid_shot_id)) {
      lookup.set(row.bid_shot_id, new Map());
    }

    lookup.get(row.bid_shot_id)!.set(Number(row.task_id), {
      id: row.id,
      bid_shot_id: row.bid_shot_id,
      task_id: Number(row.task_id),
      duration_days: Number(row.duration_days ?? 0),
      notes: row.notes,
    });
  }

  return lookup;
}