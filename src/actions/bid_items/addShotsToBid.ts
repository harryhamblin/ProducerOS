"use server";

import { createClient } from "@/lib/supabase/server";


export async function addItemsToBid(
  bidId: string,
  itemIds: string[]
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

  // Add items to the bid
  const { data: BidItems, error: BidItemsError } = await supabase
    .from("bid_items")
    .insert(
      itemIds.map((itemId) => ({
        bid_id: bidId,
        item_id: itemId,
      }))
    )
    .select();

  if (BidItemsError) {
    console.error("Error creating bid items:", BidItemsError);
    throw BidItemsError;
  }

  // Create one bid_task per task for every item
  const bidTasks = BidItems.flatMap((BidItem) =>
    tasks.map((task) => ({
      bid_item_id: BidItem.id,
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