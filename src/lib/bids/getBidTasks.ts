import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type BidTask =
  Database["public"]["Tables"]["bid_tasks"]["Row"];

export async function getBidTasks(bidID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bid_tasks")
    .select(`
      id,
      created_at,
      bid_item_id,
      task_id,
      duration_days,
      notes,
      bid_items!inner (
        bid_id
      )
    `)
    .eq("bid_items.bid_id", bidID);

  if (error) {
  console.error(error);
  throw new Error(
    `${error.code}: ${error.message}\n${error.details ?? ""}\n${error.hint ?? ""}`
  );
}

  const lookup = new Map<string, Map<number, BidTask>>();

  for (const row of data ?? []) {
    const task: BidTask = {
    id: row.id,
    created_at: row.created_at,
    bid_item_id: row.bid_item_id,
    task_id: row.task_id,
    duration_days: row.duration_days,
    notes: row.notes,
};

    if (!lookup.has(task.bid_item_id)) {
      lookup.set(task.bid_item_id, new Map());
    }

    lookup.get(task.bid_item_id)!.set(task.task_id, task);
  }

  return lookup;
}