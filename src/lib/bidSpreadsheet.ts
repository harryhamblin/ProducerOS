import { createClient } from "@/lib/supabase/server";

export type SpreadsheetTaskColumn = {
  id: number;
  name: string;
  dailyRate: number;
};

export type SpreadsheetShot = {
  id: string;
  shotCode: string;
  frames: number;
  thumbnailUrl: string | null;
  costType: string | null;
  vfxWorkRequirements: string | null;
  vendorNotes: string | null;
  foreignSpend: number;
  quantity: number;

  tasks: Record<number, number>;

  shotCost: number;
  total: number;
};

export type BidSpreadsheet = {
  taskColumns: SpreadsheetTaskColumn[];
  shots: SpreadsheetShot[];
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
  // Load bid shots
  //
  const { data: shotRows, error: shotError } = await supabase
    .from("bid_shots")
    .select("*")
    .eq("bid_id", bidID)
    .order("shot_code");

  if (shotError) throw shotError;

  //
  // Load bid task durations
  //
  const { data: taskRows, error: taskError } = await supabase
    .from("bid_tasks")
    .select(`
      bid_shot_id,
      task_id,
      duration_days
    `);

  if (taskError) throw taskError;

  //
  // Build lookup
  //
  const durationLookup = new Map<string, Record<number, number>>();

  for (const row of taskRows ?? []) {
    if (!durationLookup.has(row.bid_shot_id)) {
      durationLookup.set(row.bid_shot_id, {});
    }

    durationLookup.get(row.bid_shot_id)![Number(row.task_id)] =
      Number(row.duration_days);
  }

  //
  // Build spreadsheet rows
  //
  const shots: SpreadsheetShot[] = (shotRows ?? []).map((shot: any) => {
    const tasks = durationLookup.get(shot.id) ?? {};

    let shotCost = Number(shot.foreign_spend ?? 0);

    for (const column of taskColumns) {
      const days = tasks[column.id] ?? 0;
      shotCost += days * column.dailyRate;
    }

    return {
      id: shot.id,
      shotCode: shot.shot_code,
      frames: shot.frames,
      thumbnailUrl: shot.thumbnail_url,
      costType: shot.cost_type,
      vfxWorkRequirements: shot.vfx_work_requirements,
      vendorNotes: shot.vendor_notes,
      foreignSpend: Number(shot.foreign_spend ?? 0),
      quantity: Number(shot.quantity ?? 1),

      tasks,

      shotCost,

      total: shotCost * Number(shot.quantity ?? 1),
    };
  });

  return {
    taskColumns,
    shots,
  };
}