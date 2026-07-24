import type {
  BidItem,
  BidTask,
  ProjectTask,
  CalculatedBid,
  BidTaskLookup,
} from "@/types";

interface ItemsTableProps {
    projectId: string;
    bidId: string;

    items: BidItem[];

    tasksByItem: BidTaskLookup;

    tasks: ProjectTask[];

    bid: CalculatedBid;
}