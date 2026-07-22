import type { Database } from "@/lib/database.types";

type BidShot = Database["public"]["Tables"]["bid_shots"]["Row"];
type BidTask = Database["public"]["Tables"]["bid_tasks"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type RateCard = Database["public"]["Tables"]["rate_cards"]["Row"];

export type CalculatedShot = BidShot & {
  labourCost: number;
  grandTotal: number;
};

export type CalculatedBid = {
  shots: CalculatedShot[];
  labourCost: number;
  foreignSpend: number;
  grandTotal: number;
  shotCount: number;
};

type Props = {
  shots: BidShot[];
  bidTasks: BidTask[];
  tasks: Task[];
  rateCards: RateCard[];
};

export function calculateBid({
  shots,
  bidTasks,
  tasks,
  rateCards,
}: Props): CalculatedBid {
  const calculatedShots: CalculatedShot[] = [];

  let labourCost = 0;
  let foreignSpend = 0;
  let grandTotal = 0;

  for (const shot of shots) {
    let shotLabour = 0;

    const shotTasks = bidTasks.filter(
      (task) => task.bid_shot_id === shot.id
    );

    for (const bidTask of shotTasks) {
      const task = tasks.find((t) => t.id === bidTask.task_id);

      if (!task) continue;

      const rate = rateCards.find(
        (r) => r.task_id === task.id
      );

      if (!rate) continue;

      shotLabour +=
        (bidTask.duration_days ?? 0) *
        (rate.day_rate ?? 0);
    }

    const shotForeign = shot.foreign_spend ?? 0;
    const quantity = shot.quantity ?? 1;

    const shotGrand =
      (shotLabour + shotForeign) * quantity;

    labourCost += shotLabour;
    foreignSpend += shotForeign;
    grandTotal += shotGrand;

    calculatedShots.push({
      ...shot,
      labourCost: shotLabour,
      grandTotal: shotGrand,
    });
  }

  return {
    shots: calculatedShots,
    labourCost,
    foreignSpend,
    grandTotal,
    shotCount: shots.length,
  };
}