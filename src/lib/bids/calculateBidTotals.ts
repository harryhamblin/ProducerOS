import { calculateBid } from "@/lib/bids/calculateBid";
import type {
  BidItem,
  BidTask,
  ProjectTask,
} from "@/types/bid";

export function calculateBidTotals(
  bidItems: BidItem[],
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
    items: bidItems,
    bidTasks: flattenedTasks,
    projectTasks,
  });

  return {
    items: new Map(
      result.items.map((item) => [
        item.id,
        {
          labourCost: item.labourCost,
          foreignSpend: item.foreign_spend ?? 0,
          total: item.grandTotal,
        },
      ])
    ),
    totals: result.totals,
  };
}