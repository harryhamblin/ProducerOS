import { getCalculatedBids } from "@/lib/bids/getCalculatedBids";
import { calculateProjectSummary } from "./calculateProjectSummary";

export async function getProjectSummary(
    projectId: string
) {

    const bids = await getCalculatedBids(projectId);

    return calculateProjectSummary(bids);

}