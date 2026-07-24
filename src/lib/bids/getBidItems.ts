import { createClient } from "@/lib/supabase/server";

export async function getBidItems(bidID: string) {
  const supabase = await createClient();

const { data } = await supabase
  .from("bid_items")
  .select(`
    *,
    shot:shots(*),
    asset:assets(*)
  `)
  .eq("bid_id", bidID)
  .order("sort_order");

return data ?? [];}