import { getBids } from "@/lib/bids/getBid";
import { getBidItems } from "@/lib/bids/getBidItems";
import { getBidTasks } from "@/lib/bids/getBidTasks";
import { getProjectTasks } from "@/lib/projects/getProjectTasks";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";

export async function getCalculatedBids(projectID: string) {
  const [bids, projectTasks] = await Promise.all([
    getBids(projectID),
    getProjectTasks(projectID),
  ]);

  return Promise.all(
    bids.map(async (bid) => {
      const [bidItems, bidTasks] = await Promise.all([
        getBidItems(bid.id),
        getBidTasks(bid.id),
      ]);

      const calculated = calculateBidTotals(
        bidItems,
        bidTasks,
        projectTasks
      );

      return {
      ...bid,
      items: calculated.items,
      totals: calculated.totals,
      };
    })
  );
}