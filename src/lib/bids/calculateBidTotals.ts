type ProjectTask = {
  task_id: number | string;
  daily_rate: number | string | null;
};

type BidShot = {
  id: string;
  foreign_spend: number | null;
  quantity: number | null;
};

type BidTask = {
  duration_days: number;
};

export type CalculatedShot = {
  labourCost: number;
  foreignSpend: number;
  total: number;
};

export type CalculatedBidTotals = {
  shots: Map<string, CalculatedShot>;
  totals: {
    labourCost: number;
    foreignSpend: number;
    grandTotal: number;
    shotCount: number;
  };
};

export function calculateBidTotals(
  bidShots: BidShot[],
  bidTasks: Map<string, Map<number, BidTask>>,
  projectTasks: ProjectTask[]
): CalculatedBidTotals {
  const rateLookup = new Map<number, number>(
    projectTasks.map((task) => [
      Number(task.task_id),
      Number(task.daily_rate ?? 0),
    ])
  );

  const shots = new Map<string, CalculatedShot>();

  let labourCost = 0;
  let foreignSpend = 0;
  let grandTotal = 0;
  let shotCount = 0;

  for (const shot of bidShots) {
    const taskLookup = bidTasks.get(shot.id) ?? new Map();

    let shotLabour = 0;

    for (const task of projectTasks) {
      const duration =
        taskLookup.get(Number(task.task_id))?.duration_days ?? 0;

      shotLabour +=
        duration *
        (rateLookup.get(Number(task.task_id)) ?? 0);
    }

    const shotForeign = Number(shot.foreign_spend ?? 0);
    const quantity = Number(shot.quantity ?? 1);

    const total = (shotLabour + shotForeign) * quantity;

    shots.set(shot.id, {
      labourCost: shotLabour,
      foreignSpend: shotForeign,
      total,
    });

    labourCost += shotLabour;
    foreignSpend += shotForeign;
    grandTotal += total;
    shotCount += quantity;
  }

  return {
    shots,
    totals: {
      labourCost,
      foreignSpend,
      grandTotal,
      shotCount,
    },
  };
}