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
  let itemName = "";

  // ------------------------------------------------------------------
  // Create the underlying Shot / Asset (or determine custom name)
  // ------------------------------------------------------------------

  if (itemType === "shot") {
    const { data: shots, error } = await supabase
      .from("shots")
      .select("shot_code")
      .eq("project_id", projectID);

    if (error) throw error;

    let highest = 0;

    for (const shot of shots ?? []) {
      const match = shot.shot_code?.match(/^SHOT(\d+)$/);

      if (match) {
        highest = Math.max(highest, Number(match[1]));
      }
    }

    itemName = `SHOT${String(highest + 1).padStart(3, "0")}`;

    const { data: shot, error: shotError } = await supabase
      .from("shots")
      .insert({
        project_id: projectID,
        shot_code: itemName,
      })
      .select()
      .single();

    if (shotError) throw shotError;

    shotID = shot.id;
  }

  else if (itemType === "asset") {
    const { data: assets, error } = await supabase
      .from("assets")
      .select("asset_code")
      .eq("project_id", projectID);

    if (error) throw error;

    let highest = 0;

    for (const asset of assets ?? []) {
      const match = asset.asset_code?.match(/^ASSET(\d+)$/);

      if (match) {
        highest = Math.max(highest, Number(match[1]));
      }
    }

    itemName = `ASSET${String(highest + 1).padStart(3, "0")}`;

    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        project_id: projectID,
        asset_code: itemName,
        name: itemName,
        asset_type: "Other",
        status: "Pending",
      })
      .select()
      .single();

    if (assetError) throw assetError;

    assetID = asset.id;
  }

  else {
    const { data: bidItems, error } = await supabase
      .from("bid_items")
      .select("name")
      .eq("bid_id", bidID);

    if (error) throw error;

    let highest = 0;

    for (const item of bidItems ?? []) {
      const match = item.name?.match(/^ITEM(\d+)$/);

      if (match) {
        highest = Math.max(highest, Number(match[1]));
      }
    }

    itemName = `ITEM${String(highest + 1).padStart(3, "0")}`;
  }

  // ------------------------------------------------------------------
  // Create the Bid Item
  // ------------------------------------------------------------------

  const { data: bidItem, error } = await supabase
    .from("bid_items")
    .insert({
      bid_id: bidID,
      item_type: itemType,
      shot_id: shotID,
      asset_id: assetID,
      name: itemName,
      quantity: 1,
      cost_type: "Per Item",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  // ------------------------------------------------------------------
  // Create empty bid tasks
  // ------------------------------------------------------------------

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id")
    .order("sort_order");

  if (tasksError) throw tasksError;

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

    if (bidTaskError) throw bidTaskError;
  }

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}