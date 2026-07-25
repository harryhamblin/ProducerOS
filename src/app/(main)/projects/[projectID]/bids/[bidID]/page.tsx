import type { Metadata } from "next";

import { getBid, getBidItems, getBidTasks } from "@/lib/bids";
import { getProject } from "@/lib/projects";
import { getProjectTasks } from "@/lib/projects/getProjectTasks";
import { calculateBidTotals } from "@/lib/bids/calculateBidTotals";
import { CalculatedBid } from "@/types";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { KpiGrid } from "@/components/layout/KpiGrid";
import { KpiCard } from "@/components/layout/KpiCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { getProductionStatuses } from "@/lib/getProductionStatuses";
import BidItemsTable from "@/components/bid_items/BidItemsTable";

type Props = {
  params: Promise<{
    projectID: string;
    bidID: string;
  }>;
};

const formatCurrency = (value: number) =>
  `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { projectID, bidID } = await params;

  const project = await getProject(projectID);
  const bid = await getBid(bidID);

  return {
    title:
      project && bid
        ? `${bid.name} - ${project.project_code}`
        : "ProducerOS",
  };
}

export default async function BidPage({ params }: Props) {
  const { projectID, bidID } = await params;

  const project = await getProject(projectID);
  const bid = await getBid(bidID);

  if (!project || !bid) {
    throw new Error("Project or bid not found");
  }

  const projectTasks = await getProjectTasks(projectID);
  console.log(projectTasks);
  const bidItems = await getBidItems(bidID);
  const bidTasks = await getBidTasks(bidID);
  const productionStatuses = await getProductionStatuses();
  const calculatedBid = calculateBidTotals(
    bidItems,
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
            label: project.project_name,
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
          label="Items"
          value={calculatedBid.totals.itemCount.toLocaleString()}
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

      <BidItemsTable
        projectID={projectID}
        bidID={bidID}
        bidItems={bidItems}
        bidTasks={bidTasks}
        projectTasks={projectTasks}
        productionStatuses={productionStatuses}
        calculatedBid={calculatedBid}
      />
      
    </PageLayout>
  );
}
