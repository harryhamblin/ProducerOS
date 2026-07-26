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

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ projectID: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectID } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("code")
    .eq("id", projectID)
    .single();

  return {
    title: project?.code ?? "Project",
  };
}

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
  const awardedBids = bids.filter(
    (bid) => bid.status_id === 2
  );

  const summary = awardedBids.reduce(
    (acc, bid) => {
      acc.itemCount += bid.totals.itemCount ?? 0;
      acc.labour += bid.totals.labourCost ?? 0;
      acc.foreignSpend += bid.totals.foreignSpend ?? 0;
      acc.totalAward += bid.totals.grandTotal ?? 0;

      return acc;
    },
    {
      itemCount: 0,
      labour: 0,
      foreignSpend: 0,
      totalAward: 0,
    }
  );

const {
  itemCount,
  labour,
  foreignSpend,
  totalAward,
} = summary;
  return (
    <PageLayout>
      <DetailHeader
        title={project.project_name}
        subtitle={project.project_code}
        breadcrumbs={[
          {
            label: "Projects",
            href: "/projects",
          },
          {
            label: project.project_name,
          },
        ]}
      />

      <KpiGrid>
        <KpiCard
          label="Item Count"
          value={itemCount}
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