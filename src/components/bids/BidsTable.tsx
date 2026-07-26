import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

import { EditableCell } from "@/components/editable/EditableCell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../ui/StatusBadge";
import { DeleteBidButton } from "./DeleteBidButton";

interface ProjectBidsTableProps {
  projectId: string;
  projectDbId: string;
  bids: any[];
  currency: Intl.NumberFormat;
  createNewBid: (projectId: string) => Promise<void>;
}

export function ProjectBidsTable({
  projectId,
  projectDbId,
  bids,
  currency,
  createNewBid,
}: ProjectBidsTableProps) {
console.log(
  JSON.stringify(
    bids.map((b) => ({
      id: b.id,
      name: b.name,
      status_id: b.status_id,
      bid_statuses: b.bid_statuses,
    })),
    null,
    2
  )
);
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 z-10 bg-slate-950">
        <tr className="border-b border-slate-800">
          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Bid Name
          </th>
          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Description
          </th>
          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Status
          </th>
          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Foreign Spend
          </th>
          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Total
          </th>
          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Open
          </th>
          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Delete
          </th>
        </tr>
      </thead>

      <tbody>
        {[...bids]
          .sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "", undefined, {
              sensitivity: "base",
              numeric: true,
            })
          )
          .map((bid) => (
          <tr
            key={bid.id}
            className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
          >
            <td className="px-4 py-3">
              <EditableCell
                table="bids"
                rowId={bid.id}
                field="name"
                value={bid.name}
                type="text"
                revalidatePath="/bids"
              />
            </td>

            <td className="px-4 py-3">
              <EditableCell
                table="bids"
                rowId={bid.id}
                field="version"
                value={bid.version}
                type="text"
                revalidatePath="/bids"
              />
            </td>

            <td className="px-4 py-3">
              <StatusBadge
                name={bid.bid_statuses?.name ?? "Unknown"}
                colour={bid.bid_statuses?.colour ?? "#64748b"}
              />
            </td>

            <td className="px-4 py-3">
              {bid.totals.itemCount}
            </td>

            <td className="px-4 py-3">
              {currency.format(bid.totals.foreignSpend)}
            </td>

            <td className="px-6 py-3 font-medium">
              {currency.format(bid.totals.grandTotal)}
            </td>
            <td className="px-4 py-3">
              <Link
                href={`/projects/${projectId}/finance/bids/${bid.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
                title="Open Bid"
              >
                <FolderOpen className="h-4 w-4" />
              </Link>
            </td>
            <td className="px-4 py-3">
              <DeleteBidButton
                bidId={bid.id}
                bidItemName={bid.name}
              />
            </td>
          </tr>
        ))}

        <tr>
          <td
            colSpan={8}
            className="border-t border-dashed border-slate-700 p-0"
          >
            <form
              action={async () => {
                "use server";
                await createNewBid(projectDbId);
              }}
            >
              <Button
                type="submit"
                className="w-full justify-center rounded-xl border-5 border-dashed p-5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Bid
              </Button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}