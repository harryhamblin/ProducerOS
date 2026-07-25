"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBidItem(
  projectID: string,
  bidID: string,
  itemType: "shot" | "asset" | "custom"
) {
  const supabase = await createClient();

  let shotID: string | null = null;
  let assetID: string | null = null;

  // ------------------------------------------------------------------
  // Create Shot
  // ------------------------------------------------------------------

  if (itemType === "shot") {
    const { data: lastShot, error: lastShotError } = await supabase
      .from("shots")
      .select("shot_code")
      .eq("project_id", projectID)
      .order("shot_code", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastShotError) {
      console.error("Failed to fetch last shot:", lastShotError);
      throw new Error(lastShotError.message);
    }

    const nextNumber = lastShot
      ? Number(lastShot.shot_code.replace(/\D/g, "")) + 1
      : 1;

    const nextShotCode = `SHOT${String(nextNumber).padStart(3, "0")}`;

    const { data: shot, error: shotError } = await supabase
      .from("shots")
      .insert({
        project_id: projectID,
        shot_code: nextShotCode,
        status_id: 1,
      })
      .select()
      .single();

    if (shotError) {
      console.error("Failed to create shot:", shotError);
      throw new Error(shotError.message);
    }

    shotID = shot.id;
  }

  // ------------------------------------------------------------------
  // Create Asset
  // ------------------------------------------------------------------

  else if (itemType === "asset") {
    const { data: lastAsset, error: lastAssetError } = await supabase
      .from("assets")
      .select("asset_code")
      .eq("project_id", projectID)
      .order("asset_code", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastAssetError) {
      console.error("Failed to fetch last asset:", lastAssetError);
      throw new Error(lastAssetError.message);
    }

    const nextNumber = lastAsset
      ? Number(lastAsset.asset_code.replace(/\D/g, "")) + 1
      : 1;

    const nextAssetCode = `ASSET${String(nextNumber).padStart(3, "0")}`;

    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        project_id: projectID,
        asset_code: nextAssetCode,
        asset_type: "Other",
        status_id: 1,
      })
      .select()
      .single();

    if (assetError) {
      console.error("Failed to create asset:", assetError);
      throw new Error(assetError.message);
    }

    assetID = asset.id;
  }

  // ------------------------------------------------------------------
  // Custom Items
  // ------------------------------------------------------------------

  else {
    // Custom items don't create a Shot or Asset yet.
  }

  // ------------------------------------------------------------------
  // Create Bid Item
  // ------------------------------------------------------------------

  const { data: bidItem, error: bidItemError } = await supabase
    .from("bid_items")
    .insert({
      bid_id: bidID,
      item_type: itemType,
      shot_id: shotID,
      asset_id: assetID,
      quantity: 1,
      cost_type: "Full Cost",
    })
    .select()
    .single();

  if (bidItemError) {
    console.error("Failed to create bid item:", bidItemError);
    throw new Error(bidItemError.message);
  }

  // ------------------------------------------------------------------
  // Create Bid Tasks
  // ------------------------------------------------------------------

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id")
    .order("sort_order");

  if (tasksError) {
    console.error("Failed to load tasks:", tasksError);
    throw new Error(tasksError.message);
  }

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

    if (bidTaskError) {
      console.error("Failed to create bid tasks:", bidTaskError);
      throw new Error(bidTaskError.message);
    }
  }

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}