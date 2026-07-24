"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database";

type BidTask = Database["public"]["Tables"]["bid_tasks"]["Update"];

export async function updateBidTask<
  K extends keyof BidTask
>(
  id: string,
  field: K,
  value: BidTask[K]
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bid_tasks")
    .update({
      [field]: value,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
}