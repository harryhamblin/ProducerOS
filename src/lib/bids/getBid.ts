import { createClient } from "@/lib/supabase/server";
import { Bid } from "@/types/bid";

export type CreateBidInput = {
  name: string;
  version: number;
  status_id: number;
  currency: string;
  notes?: string;
};

export async function getBids(projectId: string): Promise<Bid[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bids")
    .select(`
      *,
      bid_statuses (
        id,
        name,
        colour
      )
    `)
    .eq("project_id", projectId)
    .order("version");

  if (error) throw error;

  return (data ?? []) as Bid[];
}

export async function getBid(id: string): Promise<Bid | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bids")
    .select(`
      *,
      bid_statuses (
        id,
        name,
        colour
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching bid:", error);
    throw error;
  }

  return data as Bid | null;
}

export async function deleteBid(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bids")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting bid:", error);
    throw error;
  }
}