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
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { KpiGrid } from "@/components/layout/KpiGrid";
import { KpiCard } from "@/components/layout/KpiCard";
import { Section } from "@/components/layout/Section";
import { ShotsTable } from "@/components/projects/ShotsTable";

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
<PageLayout>
  <DetailHeader
    title={bid.name}
    subtitle={project.name}
  />
  <KpiGrid>

    <KpiCard
        title="Bid Name"
        value={bid.name}
    />

    <KpiCard
        title="Shot Count"
        value={calculatedBid.totals.shotCount.toLocaleString()}
    />

    <KpiCard
        title="Foreign Spend"
        value={`£${calculatedBid.totals.foreignSpend.toLocaleString(undefined,{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        })}`}
    />

    <KpiCard
        title="Total Award"
        value={`£${calculatedBid.totals.grandTotal.toLocaleString(undefined,{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        })}`}
    />

</KpiGrid>
      <Section
    title="Shots"
    description="Manage shots and bidding data."
>
    <ShotsTable
        projectID={projectID}
        bidID={bidID}
        bidShots={bidShots}
        bidTasks={bidTasks}
        projectTasks={projectTasks}
        calculatedBid={calculatedBid}
    />
</Section>
</PageLayout>
  );
}