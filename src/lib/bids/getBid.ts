import { createClient } from "@/lib/supabase/server";

export type CreateBidInput = {
  name: string;
  version: number;
  status: string;
  currency: string;
  notes?: string;
};
import { Bid } from "@/types/bid";

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