import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateBidButton } from "@/components/bids/CreateBidButton";
import { getCalculatedBids } from "@/lib/bids/getCalculatedBids";
import { getProject } from "@/lib/projects";

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
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {project.name}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {project.code}
            </p>
          </div>
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
            Labour
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {currency.format(labour)}
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
                Bid
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Version
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Status
              </th>

              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Shots
              </th>

              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Labour
              </th>

              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Foreign
              </th>

              <th className="px-6 py-3 text-right font-medium text-slate-400">
                Total
              </th>
            </tr>
          </thead>

          <tbody>            {bids.map((bid) => (
              <tr
                key={bid.id}
                className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
              >
                <td className="px-6 py-3 font-medium">
                  <Link
                    href={`/projects/${project.id}/bids/${bid.id}`}
                    className="transition-colors hover:text-blue-400"
                  >
                    {bid.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {bid.version}
                </td>

                <td className="px-4 py-3">
  <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
    {bid.status ?? "Unknown"}
  </span>
</td>

                <td className="px-4 py-3 text-right">
                  {bid.totals.shotCount}
                </td>

                <td className="px-4 py-3 text-right">
                  {currency.format(bid.totals.labourCost)}
                </td>

                <td className="px-4 py-3 text-right">
                  {currency.format(bid.totals.foreignSpend)}
                </td>

                <td className="px-6 py-3 text-right font-medium">
                  {currency.format(bid.totals.grandTotal)}
                </td>
              </tr>
            ))}

            <tr>
              <td
                colSpan={7}
                className="border-t border-dashed border-slate-700 p-0"
              >
                <div className="flex justify-center py-3">
                  <CreateBidButton projectId={project.id} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}