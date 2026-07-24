import type { CalculatedBid } from "@/lib/bids/calculateBid";

export type CalculatedProject = {
  currentAward: number;
  foreignSpend: number;
  itemCount: number;
  bidCount: number;
};

export function calculateProject(
  bids: CalculatedBid[]
): CalculatedProject {
  let currentAward = 0;
  let foreignSpend = 0;
  let itemCount = 0;

  for (const bid of bids) {
    currentAward += bid.grandTotal;
    foreignSpend += bid.foreignSpend;
    itemCount += bid.itemCount;
  }

  return {
    currentAward,
    foreignSpend,
    itemCount,
    bidCount: bids.length,
  };
}