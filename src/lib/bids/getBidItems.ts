import { createClient } from "@/lib/supabase/server";

export async function getBidItems(bidID: string) {
  const supabase = await createClient();

const { data } = await supabase
  .from("bid_items")
  .select(`
    *,
    shot:shots(
      id,
      shot_code,
      description,
      thumbnail_url,
      status_id,
      production_statuses(
        id,
        name,
        colour
      )
    ),
    asset:assets(
      id,
      asset_code,
      asset_type,
      description,
      thumbnail_url,
      status_id,
      production_statuses(
        id,
        name,
        colour
      )
    )
  `)
  .eq("bid_id", bidID)
  .order("sort_order");

return data ?? [];}

export async function deleteBidItem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bid_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}