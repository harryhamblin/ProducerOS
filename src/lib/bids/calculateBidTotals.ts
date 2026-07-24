import { calculateBid } from "@/lib/bids/calculateBid";
import type {
  BidShot,
  BidTask,
  ProjectTask,
} from "@/types/bid";

export function calculateBidTotals(
  bidShots: BidShot[],
  bidTasks: Map<string, Map<number, BidTask>>,
  projectTasks: ProjectTask[]
) {
  const flattenedTasks: BidTask[] = [];

  for (const tasks of bidTasks.values()) {
    for (const task of tasks.values()) {
      flattenedTasks.push(task);
    }
  }

  const result = calculateBid({
    shots: bidShots,
    bidTasks: flattenedTasks,
    projectTasks,
  });

  return {
    shots: new Map(
      result.shots.map((shot) => [
        shot.id,
        {
          labourCost: shot.labourCost,
          foreignSpend: shot.foreign_spend ?? 0,
          total: shot.grandTotal,
        },
      ])
    ),
    totals: result.totals,
  };
}