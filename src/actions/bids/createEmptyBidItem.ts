"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBidItem(
  projectID: string,
  bidID: string,
) {
  const supabase = await createClient();

  const { data: bidItems, error: fetchError } = await supabase
    .from("bid_items")
    .select("name")
    .eq("bid_id", bidID);

if (fetchError) throw fetchError;

let highest = 0;

for (const item of bidItems ?? []) {
    const match = item.name?.match(/^ITEM(\d+)$/);

    if (match) {
        highest = Math.max(highest, Number(match[1]));
    }
}

const nextName = `ITEM${String(highest + 1).padStart(3, "0")}`;

const { data: bidItem, error } = await supabase
    .from("bid_items")
    .insert({
        bid_id: bidID,
        item_type: "custom",
        name: nextName,
        cost_type: "Per Item",
        quantity: 1,
    })
    .select()
    .single();

if (error) {
  console.error(error);
  throw new Error(
    `${error.code}: ${error.message}\n${error.details ?? ""}\n${error.hint ?? ""}`
  );
}

const { data: tasks, error: tasksError } = await supabase
  .from("tasks")
  .select("id")
  .order("sort_order");

if (tasksError) throw tasksError;

const bidTasks =
  tasks?.map((task) => ({
    bid_item_id: bidItem.id,
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