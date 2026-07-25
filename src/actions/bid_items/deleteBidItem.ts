"use server";

import { revalidatePath } from "next/cache";
import { deleteBidItem } from "@/lib/bids/getBidItems";

export async function deleteBidItemAction(formData: FormData) {
    const bidItemId = formData.get("bidItemId") as string;
    const projectID = formData.get("projectID") as string;
    const bidID = formData.get("bidID") as string;

revalidatePath(`/projects/${projectID}/bids/${bidID}`);

  await deleteBidItem(bidItemId);

  revalidatePath(
    `/projects/${projectID}/bids/${bidID}`
  );
}