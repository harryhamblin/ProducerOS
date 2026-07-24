import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { createBidShot } from "@/actions/bids/index";
import { EditableCell } from "@/components/editable/EditableCell";
import EditableTaskCell from "@/components/editable/EditableTaskCell";
import { Button } from "@/components/ui/button";
import { getBid } from "@/lib/bids";
import { getBidShots, getBidTasks } from "@/lib/bids/index";
import { getProject } from "@/lib/projects";
import { getProjectTasks } from "@/lib/projects/getProjectTasks";
import { cost_type } from "../constants";
import EditableSelectCell from "@/components/bids/EditableSelectCell";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";
import { ProjectTaskRate } from "@/types/bid";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { KpiGrid } from "@/components/layout/KpiGrid";
import { KpiCard } from "@/components/layout/KpiCard";
import { PageLayout } from "@/components/layout/PageLayout";

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

const formatCurrency = (value: number) =>
  `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
     <PageLayout>
       <DetailHeader
  title={bid.name}
  subtitle={bid.status}
  breadcrumbs={[
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: project.name,
      href: `/projects/${projectID}`,
    },
    {
      label: "Bids",
      href: `/projects/${projectID}/bids`,
    },
    {
      label: bid.name,
    },
  ]}
/>
 
       <KpiGrid>
         <KpiCard
           label="Shot Count"
           value={calculatedBid.totals.shotCount.toLocaleString()}
         />
 
         <KpiCard
  label="Foreign Spend"
  value={formatCurrency(calculatedBid.totals.foreignSpend)}
/>

<KpiCard
  label="Foreign Spend %"
  value={
    calculatedBid.totals.grandTotal > 0
      ? `${(
          (calculatedBid.totals.foreignSpend /
            calculatedBid.totals.grandTotal) *
          100
        ).toFixed(1)}%`
      : "0.0%"
  }
/>
 
<KpiCard
  label="Total Cost"
  value={formatCurrency(calculatedBid.totals.grandTotal)}
  borderRight={false}
/>
</KpiGrid>
 
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
                      table="bid_shots"
                      rowId={shot.id}
                      field="shot_code"
                      value={shot.shot_code}
                      type="text"
                      revalidatePath={`/projects/${projectID}/bids/${bidID}`}
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
  table="bid_shots"
  rowId={shot.id}
  field="frames"
  value={shot.frames}
  type="number"
  revalidatePath={`/projects/${projectID}/bids/${bidID}`}
/>
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                          table="bid_shots"
                          rowId={shot.id}
                          field="cost_type"
                          value={shot.cost_type}
                          type="select"
                          options={cost_type}
                          revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                        />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        table="bid_shots"
                        rowId={shot.id}
                        field="vfx_work_description"
                        value={shot.vfx_work_description}
                        type="text"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        table="bid_shots"
                        rowId={shot.id}
                        field="vendor_notes"
                        value={shot.vendor_notes}
                        type="text"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <EditableCell
                        table="bid_shots"
                        rowId={shot.id}
                        field="foreign_spend"
                        value={shot.foreign_spend}
                        type="currency"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
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
                            table="bid_tasks"
                            rowId={taskData?.id ?? ""}
                            field="duration_days"
                            value={taskData?.duration_days ?? 0}
                            revalidatePath={`/projects/${projectID}/bids/${bidID}`}
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
                        table="bid_shots"
                        rowId={shot.id}
                        field="quantity"
                        value={shot.quantity}
                        type="number"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
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
</PageLayout>
  );
}