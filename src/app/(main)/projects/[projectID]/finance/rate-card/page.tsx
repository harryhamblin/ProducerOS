import { createClient } from "@/lib/supabase/server";
import { EditableCell } from "@/components/editable/EditableCell";

type Props = {
  params: Promise<{
    projectID: string;
  }>;
};

export default async function RateCardPage({ params }: Props) {
  const { projectID } = await params;

  const supabase = await createClient();

  const [
    { data: tasksData, error: tasksError },
    { data: ratesData, error: ratesError },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("active", true)
      .order("sort_order"),

    supabase
      .from("project_task_rates")
      .select("*")
      .eq("project_id", projectID),
  ]);

  if (tasksError) throw tasksError;
  if (ratesError) throw ratesError;

  const tasks = tasksData ?? [];
  const rates = ratesData ?? [];

  const ratesByTask = new Map(
    rates.map((rate) => [rate.task_id, rate])
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Rate Card
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Set the daily bid rate used when creating bids for this project.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-lg">

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b border-slate-800 bg-slate-900/80">

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Task
              </th>

              <th className="w-48 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Daily Rate
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.map((task, index) => {
              const rate = ratesByTask.get(task.id);

              return (
                <tr
                  key={task.id}
                  className={`
                    border-b border-slate-800/70
                    transition-colors
                    hover:bg-slate-800/40
                    ${index === tasks.length - 1 ? "border-b-0" : ""}
                  `}
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: task.colour,
                        }}
                      />

                      <div>

                        <div className="font-medium text-slate-100">
                          {task.name}
                        </div>

                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          {task.short_name}
                        </div>

                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-4 text-right">

                    <div className="inline-block min-w-[120px] rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-right transition-colors hover:border-slate-500">

                      <EditableCell
                        table="project_task_rates"
                        rowId={rate!.id}
                        field="daily_rate"
                        value={rate!.daily_rate}
                        type="currency"
                        revalidatePath={`/projects/${projectID}/finance/rate-card`}
                      />

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}