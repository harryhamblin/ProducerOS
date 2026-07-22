import type { CalculatedBid } from "@/lib/bids/calculateBid";

export type CalculatedProject = {
  currentAward: number;
  foreignSpend: number;
  shotCount: number;
  bidCount: number;
};

export function calculateProject(
  bids: CalculatedBid[]
): CalculatedProject {
  let currentAward = 0;
  let foreignSpend = 0;
  let shotCount = 0;

  for (const bid of bids) {
    currentAward += bid.grandTotal;
    foreignSpend += bid.foreignSpend;
    shotCount += bid.shotCount;
  }

  return {
    currentAward,
    foreignSpend,
    shotCount,
    bidCount: bids.length,
  };
}