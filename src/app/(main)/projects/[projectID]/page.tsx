import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateBidButton } from "@/components/bids/CreateBidButton";
import { getCalculatedBids } from "@/lib/bids/getCalculatedBids";
import { getProject } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/projects";
import { createNewBid } from "@/actions/bids";
import { FolderOpen } from "lucide-react";
import { EditableCell } from "@/components/editable/EditableCell";

type Props = {
  params: Promise<{
    projectID: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { projectID } = await params;

  const [project, bids] = await Promise.all([
    getProject(projectID),
    getCalculatedBids(projectID),
  ]);

  if (!project) {
    notFound();
  }

  const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  const shotCount = bids.reduce(
    (sum, bid) => sum + (bid.totals.shotCount ?? 0),
    0
  );

  const labour = bids.reduce(
    (sum, bid) => sum + (bid.totals.labourCost ?? 0),
    0
  );

  const foreignSpend = bids.reduce(
    (sum, bid) => sum + (bid.totals.foreignSpend ?? 0),
    0
  );

  const totalAward = bids.reduce(
    (sum, bid) => sum + (bid.totals.grandTotal ?? 0),
    0
  );

  return (
    <main className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-950 px-8 py-6">
        <div className="flex items-center justify-between">
          <Link
      href={`/projects/${project.id}`}
      title="Return to Project"
    >
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {project.name}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {project.code}
            </p>
          </div>
    </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/30">
        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Shot Count
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {shotCount}
          </p>
        </div>

        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Foreign Spend
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {currency.format(foreignSpend)}
          </p>
        </div>

        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Foreign Spend %
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {foreignSpend !== 0 ? ((foreignSpend / totalAward) * 100).toFixed(2) : "0.00"}%
          </p>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Total Award
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {currency.format(totalAward)}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
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

          <tbody>            {bids.map((bid) => (
              <tr
                key={bid.id}
                className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
              >
<td  className="px-4 py-3 text-left">
<div className="flex items-center gap-0">
  <Link
  href={`/projects/${projectID}/bids/${bid.id}`}
  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
  title="Open Bid"
  >
  <FolderOpen className="h-4 w-4" />
  </Link>
</div>
</td>
<td className="px-4 py-3 text-left">
<div className="flex items-center gap-0">
<EditableCell
table="bids"
rowId={bid.id}
field="name"
value={bid.name}
type="text"
revalidatePath="/bids"
/>
</div>
</td>
<td className="px-4 py-3 text-left">
<div className="flex items-center gap-0">
<EditableCell
table="bids"
rowId={bid.id}
field="name"
value={bid.version}
type="text"
revalidatePath="/bids"
/>
</div>
</td>

<td className="px-4 py-3">
  <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
    {bid.status ?? "Unknown"}
  </span>
</td>

                <td className="px-4 py-3 text-left">
                  {bid.totals.shotCount}
                </td>

                <td className="px-4 py-3 text-left">
                  {currency.format(bid.totals.foreignSpend)}
                </td>

                <td className="px-6 py-3 text-left font-medium">
                  {currency.format(bid.totals.grandTotal)}
                </td>
              </tr>
            ))}

<tr>
  <td colSpan={999} className="border-t border-dashed border-slate-700 p-0">
    <form
  action={async () => {
    "use server";
    await createNewBid(project.id);
  }}
>
  <Button
    type="submit"
    variant="outline"
    className="w-full justify-center border-dashed"
  >
    <Plus className="mr-2 h-4 w-4" />
    Add Bid
  </Button>
</form>
  </td>
</tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}