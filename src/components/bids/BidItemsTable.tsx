import { Plus } from "lucide-react";

import { createBidItem } from "@/actions/bids";
import { EditableCell } from "@/components/editable/EditableCell";
import { EditableSelect } from "../editable/EditableSelect";
import EditableTaskCell from "@/components/editable/EditableTaskCell";
import { Button } from "@/components/ui/button";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";
import { cost_type } from "@/app/(main)/projects/[projectID]/bids/constants";
import type {
  BidItem,
  BidTaskLookup,
  ProjectTask,
  CalculatedBid,
} from "@/types/bid";

type BidItemsTableProps = {
  projectID: string;
  bidID: string;
  bidItems: BidItem[];
  bidTasks: BidTaskLookup;
  projectTasks: ProjectTask[];
  calculatedBid: CalculatedBid;
};

const itemColumns = [
  { key: "name", label: "Name" },
  { key: "thumbnail", label: "Thumbnail" },
  { key: "frames", label: "Frames" },
  { key: "cost_type", label: "Cost Type" },
  { key: "description", label: "Description" },
  { key: "vendor_notes", label: "Vendor Notes" },
  { key: "foreign_spend", label: "Foreign Spend" },
];

const calculatedColumns = [
  { key: "item_cost", label: "Item Cost" },
  { key: "quantity", label: "Quantity" },
  { key: "total", label: "Total" },
];

export default function BidItemsTable({
  projectID,
  bidID,
  bidItems,
  bidTasks,
  projectTasks,
  calculatedBid,
}: BidItemsTableProps) {
   return (
  <div className="overflow-x-auto rounded-xl border border-slate-800">
    <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950">
            <tr className="border-b border-slate-800">
              {itemColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-center font-medium text-slate-400"
                >
                  {column.label}
                </th>
              ))}

              {projectTasks.map((task) => (
                <th
                  key={task.task_id}
                  className="px-4 py-3 text-center font-medium text-slate-400"
                >
                  {task.name}
                </th>
              ))}

              {calculatedColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-center font-medium text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bidItems.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    itemColumns.length +
                    projectTasks.length +
                    calculatedColumns.length
                  }
                  className="py-12 text-center text-slate-500"
                >
                  No items added to this bid.
                </td>
              </tr>
            ) : (
              bidItems.map((item) => {
                const taskLookup = bidTasks.get(item.id) ?? new Map();
                const calculatedItem = calculatedBid.items.find(
                  calculated => calculated.id === item.id
                );

                if (!calculatedItem) {
                  return null;
                }

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3">
                      <EditableCell
                        table="bid_items"
                        rowId={item.id}
                        field="item_code"
                        value={item.name}
                        type="text"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-4 py-3">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt=""
                          className="h-10 w-16 rounded object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <EditableCell
                        rowId={item.id}
                        field="frames"
                        value={item.frames}
                        table="bid_items"
                        type="number"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <EditableSelect
                          table="bid_items"
                          rowId={item.id}
                          field="cost_type"
                          value={item.cost_type}
                          options={cost_type}
                          revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                        />
                    </td>

                    <td className="px-4 py-3">
                      <EditableCell
                        rowId={item.id}
                        field="vfx_work_requirements"
                        value={item.description}
                        table="bid_items"
                        type="text"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <EditableCell
                        rowId={item.id}
                        field="vendor_notes"
                        value={item.vendor_notes}
                        table="bid_items"
                        type="text"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <EditableCell
                        rowId={item.id}
                        field="foreign_spend"
                        value={item.foreign_spend}
                        table="bid_items"
                        type="number"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    {projectTasks.map((task) => {
                      const taskData = taskLookup.get(task.id);

                      return (
                        <td
                          key={task.task_id}
                          className="px-4 px-3 text-center"
                        >
                          {taskData ? (
                              <EditableTaskCell
                                  table="bid_tasks"
                                  rowId={taskData.id}
                                  field="duration_days"
                                  value={Number(taskData.duration_days ?? 0)}
                                  revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                              />
                          ) : (
                              <span className="text-slate-500">–</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-right">
                      £
                      {calculatedItem.labourCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-4 py-3">
                      <EditableCell
                        rowId={item.id}
                        field="quantity"
                        value={item.quantity}
                        table="bid_items"
                        type="number"
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                      />
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      £
                      {calculatedItem.grandTotal.toLocaleString(undefined, {
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
        itemColumns.length +
        projectTasks.length +
        calculatedColumns.length
      }
      className="border-t border-slate-700 p-4"
    >
      <div className="flex gap-4">
        
  <form
    action={async () => {
      "use server";
      await createBidItem(projectID, bidID, "shot");
    }}
    className="w-1/5"
  >
    <Button
      type="submit"
      className="w-full justify-center rounded-xl border-2 border-dashed border-slate-700 py-5"
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Shot
    </Button>
  </form>

  <form
    action={async () => {
      "use server";
      await createBidItem(projectID, bidID, "asset");
    }}
    className="w-1/5"
  >
    <Button
      type="submit"
      className="w-full justify-center rounded-xl border-2 border-dashed border-slate-700 py-5"
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Asset
    </Button>
  </form>
</div>
    </td>
  </tr>
</tfoot>
</table>
    </div>
  );
}