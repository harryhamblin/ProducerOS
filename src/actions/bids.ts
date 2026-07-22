"use server";

import { revalidatePath } from "next/cache";

import { createBid } from "@/lib/bids";

export async function createBidAction(
  projectId: string,
  formData: FormData
) {
  await createBid(projectId, {
    name: formData.get("name") as string,
    version: Number(formData.get("version")),
    status: formData.get("status") as string,
    currency: formData.get("currency") as string,
    notes: (formData.get("notes") as string) || "",
  });

  revalidatePath(`/projects/${projectId}`);
}