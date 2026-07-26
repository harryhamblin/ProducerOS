import { Plus } from "lucide-react";

import { createBidItem } from "@/actions/bids";
import { EditableCell } from "@/components/editable/EditableCell";
import { EditableSelect } from "../editable/EditableSelect";
import EditableTaskCell from "@/components/editable/EditableTaskCell";
import { Button } from "@/components/ui/button";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";
import { cost_type } from "@/app/(main)/projects/[projectID]/finance/bids/constants";
import { DeleteBidItemButton } from "./DeleteBidItemButton";
import type {
  BidItem,
  BidTaskLookup,
  ProjectTask,
  CalculatedBid,
} from "@/types/bid";
import type { ProductionStatusOption } from "@/lib/getProductionStatuses";

type BidItemsTableProps = {
  projectID: string;
  bidID: string;
  bidItems: BidItem[];
  bidTasks: BidTaskLookup;
  projectTasks: ProjectTask[];
  calculatedBid: CalculatedBid;
  productionStatuses: ProductionStatusOption[];

  activeTab: "shots" | "assets";
};

const itemColumns = [
  { key: "code", label: "Code" },
  { key: "thumbnail", label: "Thumbnail" },
  { key: "status", label: "Status" },
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
  productionStatuses,
  activeTab,
}: BidItemsTableProps) {
const visibleItems = bidItems
  .filter(item =>
    activeTab === "shots"
      ? item.item_type === "shot"
      : item.item_type === "asset"
  )
  .sort((a, b) => {
    const codeA = a.item_type === "shot"
      ? a.shot?.shot_code ?? ""
      : a.asset?.asset_code ?? "";

    const codeB = b.item_type === "shot"
      ? b.shot?.shot_code ?? ""
      : b.asset?.asset_code ?? "";

    return codeA.localeCompare(codeB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
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
                  className="w-20 min-w-20 px-4 py-3 text-center font-medium text-slate-400"
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
              <th className="px-4 py-3 text-center font-medium text-slate-400">
              Delete
            </th>
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
              visibleItems.map((item) => {
                const taskLookup = bidTasks.get(item.id) ?? new Map();
                const calculatedItem = calculatedBid.items.find(
                  calculated => calculated.id === item.id
                );

                if (!calculatedItem) {
                  return null;
                }
                const itemCode =
                  item.item_type === "shot"
                    ? item.shot?.shot_code
                    : item.asset?.asset_code;

                const thumbnail =
                  item.item_type === "shot"
                    ? item.shot?.thumbnail_url
                    : item.asset?.thumbnail_url;

                const description =
                  item.item_type === "shot"
                    ? item.shot?.description ?? null
                    : item.asset?.description ?? null;

                    const productionStatusId =
                  item.item_type === "shot"
                    ? item.shot?.status_id
                    : item.asset?.status_id;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3 font-medium">
                      {itemCode ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {thumbnail ? (
                          <img
                              src={thumbnail}
                              alt=""
                              className="h-10 w-16 rounded object-cover"
                          />
                      ) : (
                          "-"
                      )}
                    </td>
                    <td className="w-32 min-w-32 px-4 py-3">
                    <EditableSelect
                        table={item.item_type === "shot" ? "shots" : "assets"}
                        rowId={
                            item.item_type === "shot"
                                ? item.shot!.id
                                : item.asset!.id
                        }
                        field="status_id"
                        value={
                            item.item_type === "shot"
                                ? item.shot!.status_id
                                : item.asset!.status_id
                        }
                        options={productionStatuses}
                        revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                    />
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

                    <td className="w-30 min-w-30 px-4 py-3">
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
                          rowId={
                              item.item_type === "shot"
                                  ? item.shot!.id
                                  : item.asset!.id
                          }
                          field="description"
                          value={description}
                          table={item.item_type === "shot" ? "shots" : "assets"}
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

                      if (!taskData) {
                          throw new Error(`Missing task ${task.id}`);
                      }
console.log("Production Statuses:", productionStatuses);
                      return (
                          <td
                              key={task.task_id}
                              className="w-20 min-w-20  px-4 py-3 text-center"
                          >
                              <EditableTaskCell
                                  table="bid_tasks"
                                  rowId={taskData.id}
                                  field="duration_days"
                                  value={Number(taskData.duration_days ?? 0)}
                                  revalidatePath={`/projects/${projectID}/bids/${bidID}`}
                              />
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
                    <td className="px-4 py-3 text-center">
                      <DeleteBidItemButton
                        bidItemId={item.id}
                        bidItemName={itemCode ?? "Untitled"}
                        projectID={projectID}
                        bidID={bidID}
                      />
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