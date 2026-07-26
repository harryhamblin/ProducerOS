import { CalculatedBid } from "@/types/bid";
import { ProjectSummary } from "@/types/project";

const AWARDED_STATUS_ID = 2;

export function calculateProjectSummary(
  bids: CalculatedBid[]
): ProjectSummary {

  const awardedBids = bids.filter(
    bid => bid.status_id === AWARDED_STATUS_ID
  );

  return awardedBids.reduce<ProjectSummary>(
    (summary, bid) => {

      summary.currentAward += bid.totals.grandTotal ?? 0;
      summary.foreignSpend += bid.totals.foreignSpend ?? 0;
      summary.labour += bid.totals.labourCost ?? 0;
      summary.itemCount += bid.totals.itemCount ?? 0;
      summary.shotCount += bid.totals.shotCount ?? 0;
      summary.assetCount += bid.totals.assetCount ?? 0;

      return summary;

    },
    {
      currentAward: 0,
      foreignSpend: 0,
      labour: 0,
      shotCount: 0,
      assetCount: 0,
      itemCount: 0,
    }
  );

}