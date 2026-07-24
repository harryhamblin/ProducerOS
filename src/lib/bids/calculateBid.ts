import type {
  BidShot,
  BidTask,
  ProjectTask,
  CalculatedBid,
  CalculatedShot,
} from "@/types/bid";

type Props = {
  shots: BidShot[];
  bidTasks: BidTask[];
  projectTasks: ProjectTask[];
};

export function calculateBid({
  shots,
  bidTasks,
  projectTasks,
}: Props): CalculatedBid {
  // task_id -> daily_rate
  const rateLookup = new Map<number, number>();

  for (const task of projectTasks) {
    rateLookup.set(task.task_id, task.daily_rate);
  }

  // bid_shot_id -> bid tasks
  const tasksByShot = new Map<string, BidTask[]>();

  for (const task of bidTasks) {
    const existing = tasksByShot.get(task.bid_shot_id);

    if (existing) {
      existing.push(task);
    } else {
      tasksByShot.set(task.bid_shot_id, [task]);
    }
  }

  const calculatedShots: CalculatedShot[] = [];

  let labourCost = 0;
  let foreignSpend = 0;
  let grandTotal = 0;

  for (const shot of shots) {
    let shotLabour = 0;

    const shotTasks = tasksByShot.get(shot.id) ?? [];

    for (const bidTask of shotTasks) {
      const dailyRate =
        rateLookup.get(bidTask.task_id) ?? 0;

      shotLabour +=
        (bidTask.duration_days ?? 0) * dailyRate;
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
    totals: {
      shotCount: calculatedShots.length,
      labourCost,
      foreignSpend,
      grandTotal,
    },
  };
}