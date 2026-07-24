"use server";

import { revalidatePath } from "next/cache";
import { Bid } from "@/types/bid";
import { createClient } from "@/lib/supabase/client";
import { CreateBidInput } from "@/lib/bids/getBid";

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


export async function createNewBid(projectId: string) {
  await createBid(projectId, {
    name: "New Bid",
    version: 1,
    status: "Draft",
    currency: "GBP",
    notes: "",
  });

  revalidatePath(`/projects/${projectId}`);
}