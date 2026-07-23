"use server";

import { revalidatePath } from "next/cache";

import { createBid } from "../lib/bids";

export async function createNewBid(projectId: string) {
  await createBid(projectId, {
    name: "New Bid",
    version: 1,
    status: "Draft",
    currency: "GBP",
    notes: "",
  });

  revalidatePath(`/projects/${projectId}`);
}