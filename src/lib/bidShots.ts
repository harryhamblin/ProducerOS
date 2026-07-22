import { createClient } from "@/lib/supabase/server";

export async function getBidShots(bidID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bid_shots")
    .select("*")
    .eq("bid_id", bidID)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}