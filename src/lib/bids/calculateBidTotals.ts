import { calculateBid } from "@/lib/bids/calculateBid";
import type {
  BidItem,
  BidTask,
  ProjectTask,
  CalculatedBid,
} from "@/types/bid";

export function calculateBidTotals(
  bidItems: BidItem[],
  bidTasks: Map<string, Map<number, BidTask>>,
  projectTasks: ProjectTask[]
): CalculatedBid {
  const flattenedTasks: BidTask[] = [];

  for (const tasks of bidTasks.values()) {
    flattenedTasks.push(...tasks.values());
  }

  return calculateBid({
    items: bidItems,
    bidTasks: flattenedTasks,
    projectTasks,
  });
}