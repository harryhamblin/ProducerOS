import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { createBidShot } from "@/app/(main)/projects/[projectID]/bids/[bidID]/actions";
import EditableCell from "@/components/bids/EditableCell";
import EditableTaskCell from "@/components/bids/EditableTaskCell";
import { Button } from "@/components/ui/button";
import { getBid } from "@/lib/bids";
import { getBidShots } from "@/lib/bidShots";
import { getBidTasks } from "@/lib/bidTasks";
import { getProject } from "@/lib/projects";
import { getProjectTasks } from "@/lib/projectTasks";
import { cost_type } from "../constants";
import EditableSelectCell from "@/components/bids/EditableSelectCell";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";

type Props = {
  params: Promise<{
    projectID: string;
    bidID: string;
  }>;
};

const shotColumns = [
  { key: "shot_code", label: "Shot Code" },
  { key: "thumbnail", label: "Thumbnail" },
  { key: "frames", label: "Frames" },
  { key: "cost_type", label: "Cost Type" },
  { key: "vfx_work_requirements", label: "VFX Work Requirements" },
  { key: "vendor_notes", label: "Vendor Notes" },
  { key: "foreign_spend", label: "Foreign Spend" },
];

const calculatedColumns = [
  { key: "shot_cost", label: "Shot Cost" },
  { key: "quantity", label: "Quantity" },
  { key: "total", label: "Total" },
];

export default async function BidPage({ params }: Props) {
  const { projectID, bidID} = await params;

  const project = await getProject(projectID);
  
  const bid = await getBid(bidID);

if (!project || !bid) {
  throw new Error("Project or bid not found");
}


const projectTasks = await getProjectTasks(projectID);
const bidShots = await getBidShots(bidID);
const bidTasks = await getBidTasks(bidID);

const calculatedBid = calculateBidTotals(
  bidShots,
  bidTasks,
  projectTasks
);


  return (
    <main className="space-y-6 p-8">
      <div className="space-y-4">
  <div>
    <p className="text-sm text-slate-400">
      {project.name}
    </p>

    <h1 className="text-3xl font-bold">
      {bid.name}
    </h1>
  </div>

<div className="flex flex-wrap gap-8 border-t border-slate-800 pt-4">
  <div>
  <p className="text-xs uppercase tracking-wide text-slate-400">
    Bid Name
  </p>
  <p className="text-2xl font-semibold">
      {bid.name}
  </p>
</div>

<div>
    <p className="text-xs uppercase tracking-wide text-slate-400">
    Shot Count
    </p>
    <p className="text-2xl font-semibold">
    {calculatedBid.totals.shotCount.toLocaleString()}
    </p>
</div>


<div>
    <p className="text-xs uppercase tracking-wide text-slate-400">
    Foreign Spend
    </p>
    <p className="text-2xl font-semibold">
    £{calculatedBid.totals.foreignSpend.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}
    </p>
</div>

<div>
    <p className="text-xs uppercase tracking-wide text-slate-400">
    Total Award
    </p>
    <p className="text-2xl font-semibold">
    £{calculatedBid.totals.grandTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}
    </p>
</div>
</div>
</div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {shotColumns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-slate-700 bg-slate-900 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}

              {projectTasks.map((task) => (
                <th
                  key={task.task_id}
                  className="border-b border-slate-700 bg-slate-900 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                >
                  {task.name}
                </th>
              ))}

              {calculatedColumns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-slate-700 bg-slate-900 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bidShots.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    shotColumns.length +
                    projectTasks.length +
                    calculatedColumns.length
                  }
                  className="py-12 text-center text-slate-500"
                >
                  No shots added to this bid.
                </td>
              </tr>
            ) : (
              bidShots.map((shot) => {
                const taskLookup = bidTasks.get(shot.id) ?? new Map();
                const calculatedShot = calculatedBid.shots.get(shot.id)!;

                return (
                  <tr
                    key={shot.id}
                    className="border-b border-slate-800 hover:bg-slate-900/40"
                  >
                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="shot_code"
                        value={shot.shot_code}
                      />
                    </td>

                    <td className="px-3 py-2">
                      {shot.thumbnail_url ? (
                        <img
                          src={shot.thumbnail_url}
                          alt=""
                          className="h-10 w-16 rounded object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="frames"
                        value={shot.frames}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <EditableSelectCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        value={shot.cost_type}
                        options={cost_type}
                        />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="vfx_work_requirements"
                        value={shot.vfx_work_requirements}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="vendor_notes"
                        value={shot.vendor_notes}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="foreign_spend"
                        value={shot.foreign_spend}
                      />
                    </td>

                    {projectTasks.map((task) => {
                      const taskData = taskLookup.get(
                        Number(task.task_id)
                      );

                      return (
                        <td
                          key={task.task_id}
                          className="px-3 py-2 text-center"
                        >
                          <EditableTaskCell
                            projectID={projectID}
                            bidID={bidID}
                            bidShotID={shot.id}
                            taskID={Number(task.task_id)}
                            value={taskData?.duration_days ?? 0}
                          />
                        </td>
                      );
                    })}

                    <td className="px-3 py-2 text-right">
                      £
                      {calculatedShot.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        projectID={projectID}
                        bidID={bidID}
                        shotID={shot.id}
                        field="quantity"
                        value={shot.quantity}
                      />
                    </td>

                    <td className="px-3 py-2 text-right font-medium">
                      £
                      {calculatedShot.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
  <tr>
    <td
      colSpan={
        shotColumns.length +
        projectTasks.length +
        calculatedColumns.length
      }
      className="border-t border-slate-700 p-4"
    >
      <form
        action={async () => {
          "use server";
          await createBidShot(projectID, bidID);
        }}
      >
        <Button
  type="submit"
  variant="outline"
  className="w-full justify-center border-dashed"
>
  <Plus className="mr-2 h-4 w-4" />
  Add Shot
</Button>
      </form>
    </td>
  </tr>
</tfoot>
        </table>
      </div>
    </main>
  );
}