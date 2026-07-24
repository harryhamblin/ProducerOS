import type { Database } from "@/types/database";

export type Bid = {
  id: string;
  project_id: string;
  name: string;
  version: number;
  status: string;
  currency: string;
  notes: string | null;
};

export type BidShot =
  Database["public"]["Tables"]["bid_shots"]["Row"];

export type BidTask =
  Database["public"]["Tables"]["bid_tasks"]["Row"];

export type Task =
  Database["public"]["Tables"]["tasks"]["Row"];

export type ProjectTaskRate =
  Database["public"]["Tables"]["project_task_rates"]["Row"];

export type BidTaskLookup = Map<
  string,
  Map<number, BidTask>
>;

export interface ProjectTask {
  id: number;
  name: string;

  task_id: number;
  daily_rate: number;
}

export type CalculatedShot = BidShot & {
  labourCost: number;
  grandTotal: number;
};

export interface CalculatedBid {
  shots: CalculatedShot[];

  totals: {
    shotCount: number;
    labourCost: number;
    foreignSpend: number;
    grandTotal: number;
  };
}