"use server";

import { revalidatePath } from "next/cache";
import { deleteBid
    
 } from "@/lib/bids";
export async function deleteBidAction(formData: FormData) {
  const bidId = formData.get("bidId") as string;

  await deleteBid(bidId);

  revalidatePath("/projects");
}