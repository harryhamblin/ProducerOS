import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

import { EditableCell } from "@/components/editable/EditableCell";
import { Button } from "@/components/ui/button";

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
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 z-10 bg-slate-950">
        <tr className="border-b border-slate-800">
          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Open
          </th>

          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Bid Name
          </th>

          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Version
          </th>

          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Status
          </th>

          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Shots
          </th>

          <th className="px-4 py-3 text-left font-medium text-slate-400">
            Foreign Spend
          </th>

          <th className="px-6 py-3 text-left font-medium text-slate-400">
            Total
          </th>
        </tr>
      </thead>

      <tbody>
        {bids.map((bid) => (
          <tr
            key={bid.id}
            className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
          >
            <td className="px-4 py-3">
              <Link
                href={`/projects/${projectId}/bids/${bid.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
                title="Open Bid"
              >
                <FolderOpen className="h-4 w-4" />
              </Link>
            </td>

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
              <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                {bid.status ?? "Unknown"}
              </span>
            </td>

            <td className="px-4 py-3">
              {bid.totals.shotCount}
            </td>

            <td className="px-4 py-3">
              {currency.format(bid.totals.foreignSpend)}
            </td>

            <td className="px-6 py-3 font-medium">
              {currency.format(bid.totals.grandTotal)}
            </td>
          </tr>
        ))}

        <tr>
          <td
            colSpan={7}
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
                variant="outline"
                className="w-full justify-center border-0 border-dashed rounded-none"
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