import type {
  BidItem,
  BidTask,
  ProjectTask,
  CalculatedBidItem,
} from "@/types/bid";

type Props = {
  items: BidItem[];
  bidTasks: BidTask[];
  projectTasks: ProjectTask[];
};

export function calculateBid({
  items,
  bidTasks,
  projectTasks,
}: Props) {
  const rateLookup = new Map<number, number>();

  for (const task of projectTasks) {
    rateLookup.set(task.task_id, task.daily_rate);
  }

  const tasksByItem = new Map<string, BidTask[]>();

  for (const task of bidTasks) {
    const existing = tasksByItem.get(task.bid_item_id);

    if (existing) {
      existing.push(task);
    } else {
      tasksByItem.set(task.bid_item_id, [task]);
    }
  }

  const calculatedItems: CalculatedBidItem[] = [];

  let labourCost = 0;
  let foreignSpend = 0;
  let grandTotal = 0;

  for (const item of items) {
    let labourCostForItem = 0;

    const itemTasks = tasksByItem.get(item.id) ?? [];

    for (const bidTask of itemTasks) {
      const dailyRate = rateLookup.get(bidTask.task_id) ?? 0;

      labourCostForItem +=
        Number(bidTask.duration_days ?? 0) * dailyRate;
    }

    const foreignSpendForItem = Number(item.foreign_spend ?? 0);
    const quantity = Number(item.quantity ?? 1);

    const grandTotalForItem =
      (labourCostForItem + foreignSpendForItem) * quantity;

    labourCost += labourCostForItem;
    foreignSpend += foreignSpendForItem;
    grandTotal += grandTotalForItem;

    calculatedItems.push({
      ...item,
      labourCost: labourCostForItem,
      grandTotal: grandTotalForItem,
    });
  }

  return {
    items: calculatedItems,
    totals: {
      itemCount: calculatedItems.length,
      labourCost,
      foreignSpend,
      grandTotal,
    },
  };
}