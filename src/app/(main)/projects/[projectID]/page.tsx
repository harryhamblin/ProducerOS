import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateBidButton } from "@/components/bids/CreateBidButton";
import { getCalculatedBids } from "@/lib/bids/getCalculatedBids";
import { getProject } from "@/lib/projects/getProjects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/projects/getProjects";
import { createNewBid } from "@/actions/bids";
import { FolderOpen } from "lucide-react";
import { EditableCell } from "@/components/editable/EditableCell";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { KpiCard } from "@/components/layout/KpiCard";
import { KpiGrid } from "@/components/layout/KpiGrid";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectBidsTable } from "@/components/bids/BidsTable";
import { Section } from "@/components/layout/Section";
import { CalculatedBid } from "@/types/bid";

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
  (sum: number, bid: CalculatedBid) => sum + (bid.totals.shotCount ?? 0),
  0
);

  const labour = bids.reduce(
    (sum: number, bid: CalculatedBid) => sum + (bid.totals.labourCost ?? 0),
    0
  );

  const foreignSpend = bids.reduce(
    (sum: number, bid: CalculatedBid) => sum + (bid.totals.foreignSpend ?? 0),
    0
  );

  const totalAward = bids.reduce(
    (sum: number, bid: CalculatedBid) => sum + (bid.totals.grandTotal ?? 0),
    0
  );

  return (
    <PageLayout>
      <DetailHeader
        title={project.name}
        subtitle={project.code}
        breadcrumbs={[
          {
            label: "Projects",
            href: "/projects",
          },
          {
            label: project.name,
          },
        ]}
      />

      <KpiGrid>
        <KpiCard
          label="Shot Count"
          value={shotCount}
        />

        <KpiCard
          label="Foreign Spend"
          value={currency.format(foreignSpend)}
        />

        <KpiCard
          label="Foreign Spend %"
          value={
            foreignSpend !== 0
              ? `${((foreignSpend / totalAward) * 100).toFixed(1)}%`
              : "0.0%"
          }
        />

        <KpiCard
          label="Total Award"
          value={currency.format(totalAward)}
          borderRight={false}
        />
      </KpiGrid>

      <Section
    >
        <ProjectBidsTable
          projectId={projectID}
          projectDbId={project.id}
          bids={bids}
          currency={currency}
          createNewBid={createNewBid}
        />
    </Section>
    </PageLayout>
  );
}