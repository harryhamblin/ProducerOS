"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  editableFields,
  type EditableField,
} from "@/app/(main)/projects/[projectID]/bids/constants";

export async function createBidShot(
  projectID: string,
  bidID: string,
) {
  const supabase = await createClient();

  const { data: shots, error: fetchError } = await supabase
    .from("bid_shots")
    .select("shot_code")
    .eq("bid_id", bidID);

  if (fetchError) throw fetchError;

  let highest = 0;

  for (const shot of shots ?? []) {
    const match = shot.shot_code.match(/^SHOT(\d+)$/);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  }

  const nextShotCode = `SHOT${String(highest + 1).padStart(3, "0")}`;

  const { error } = await supabase.from("bid_shots").insert({
    bid_id: bidID,
    shot_code: nextShotCode,
    cost_type: "Per Shot",
    quantity: 1,
  });

  if (error) throw error;

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}



export async function updateBidShot(
  projectID: string,
  bidID: string,
  shotID: string,
  field: EditableField,
  value: string | number | null
) {
  if (!editableFields.includes(field)) {
    throw new Error(`Field "${field}" is not editable.`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("bid_shots")
    .update({
      [field]: value,
    })
    .eq("id", shotID);

  if (error) throw error;

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}

export async function updateBidTask(
  projectID: string,
  bidID: string,
  bidShotID: string,
  taskID: number,
  durationDays: number
) {
  const supabase = await createClient();

  if (durationDays <= 0) {
    const { error } = await supabase
      .from("bid_tasks")
      .delete()
      .eq("bid_shot_id", bidShotID)
      .eq("task_id", taskID);

    if (error) {
      throw error;
    }

    revalidatePath(`/projects/${projectID}/bids/${bidID}`);

    return;
  }

  //
  // Does this task already exist?
  //
  const { error } = await supabase
  .from("bid_tasks")
  .upsert(
    {
      bid_shot_id: bidShotID,
      task_id: taskID,
      duration_days: durationDays,
    },
    {
      onConflict: "bid_shot_id,task_id",
    }
  );

if (error) {
  throw error;
}

  revalidatePath(`/projects/${projectID}/bids/${bidID}`);
}