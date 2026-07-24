"use server";

import { createClient } from "@/lib/supabase/client";


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