import { createClient } from "@/lib/supabase/server";

export type SpreadsheetTaskColumn = {
  id: number;
  name: string;
  dailyRate: number;
};

export type SpreadsheetItem = {
  id: string;
  itemCode: string;
  frames: number;
  thumbnailUrl: string | null;
  costType: string | null;
  vfxWorkRequirements: string | null;
  vendorNotes: string | null;
  foreignSpend: number;
  quantity: number;

  tasks: Record<number, number>;

  itemCost: number;
  total: number;
};

export type BidSpreadsheet = {
  taskColumns: SpreadsheetTaskColumn[];
  items: SpreadsheetItem[];
};

export async function getBidSpreadsheet(
  projectID: string,
  bidID: string
): Promise<BidSpreadsheet> {
  const supabase = await createClient();

  //
  // Load project task rates
  //
  const { data: rateRows, error: rateError } = await supabase
    .from("project_task_rates")
    .select(`
      task_id,
      daily_rate,
      tasks (
        id,
        name
      )
    `)
    .eq("project_id", projectID)
    .order("task_id");

  if (rateError) throw rateError;

  const taskColumns: SpreadsheetTaskColumn[] = (rateRows ?? []).map((row: any) => ({
    id: Number(row.task_id),
    name: row.tasks?.name ?? "Unknown",
    dailyRate: Number(row.daily_rate ?? 0),
  }));

  //
  // Load bid items
  //
  const { data: itemRows, error: itemError } = await supabase
    .from("bid_items")
    .select("*")
    .eq("bid_id", bidID)
    .order("item_code");

  if (itemError) throw itemError;

  //
  // Load bid task durations
  //
  const { data: taskRows, error: taskError } = await supabase
    .from("bid_tasks")
    .select(`
      bid_item_id,
      task_id,
      duration_days
    `);

  if (taskError) throw taskError;

  //
  // Build lookup
  //
  const durationLookup = new Map<string, Record<number, number>>();

  for (const row of taskRows ?? []) {
    if (!durationLookup.has(row.bid_item_id)) {
      durationLookup.set(row.bid_item_id, {});
    }

    durationLookup.get(row.bid_item_id)![Number(row.task_id)] =
      Number(row.duration_days);
  }

  //
  // Build spreadsheet rows
  //
  const items: SpreadsheetItem[] = (itemRows ?? []).map((item: any) => {
    const tasks = durationLookup.get(item.id) ?? {};

    let itemCost = Number(item.foreign_spend ?? 0);

    for (const column of taskColumns) {
      const days = tasks[column.id] ?? 0;
      itemCost += days * column.dailyRate;
    }

    return {
      id: item.id,
      itemCode: item.item_code,
      frames: item.frames,
      thumbnailUrl: item.thumbnail,
      costType: item.cost_type,
      vfxWorkRequirements: item.vfx_work_requirements,
      vendorNotes: item.vendor_notes,
      foreignSpend: Number(item.foreign_spend ?? 0),
      quantity: Number(item.quantity ?? 1),

      tasks,

      itemCost,

      total: itemCost * Number(item.quantity ?? 1),
    };
  });

  return {
    taskColumns,
    items,
  };
}