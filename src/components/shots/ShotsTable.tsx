import type {
  BidShot,
  BidTask,
  ProjectTask,
  CalculatedBid,
  BidTaskLookup,
} from "@/types";

interface ShotsTableProps {
    projectId: string;
    bidId: string;

    shots: BidShot[];

    tasksByShot: BidTaskLookup;

    tasks: ProjectTask[];

    bid: CalculatedBid;
}