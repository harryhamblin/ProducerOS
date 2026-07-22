import { getBids } from "@/lib/bids";
import { getBidShots } from "@/lib/bidShots";
import { getBidTasks } from "@/lib/bidTasks";
import { getProjectTasks } from "@/lib/projectTasks";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";

export async function getCalculatedBids(projectID: string) {
  const [bids, projectTasks] = await Promise.all([
    getBids(projectID),
    getProjectTasks(projectID),
  ]);

  return Promise.all(
    bids.map(async (bid) => {
      const [bidShots, bidTasks] = await Promise.all([
        getBidShots(bid.id),
        getBidTasks(bid.id),
      ]);

      const calculated = calculateBidTotals(
        bidShots,
        bidTasks,
        projectTasks
      );

      return {
        ...bid,
        totals: calculated.totals,
      };
    })
  );
}