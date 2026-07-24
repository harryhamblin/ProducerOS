import Link from "next/link";

import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { getForeignSpendPercentage } from "@/lib/project-calculations";
import { getProjects } from "@/lib/projects/getProjects";
import { createProject } from "@/lib/projects/getProjects";
import { createNewProject } from "@/actions/projects/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EditableCell } from "@/components/editable/EditableCell";
import { TableCell } from "@/components/table/TableCell";
import { ArrowUpRight } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Section } from "@/components/layout/Section";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { KpiGrid } from "@/components/layout/KpiGrid";
import { KpiCard } from "@/components/layout/KpiCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  const projectCount = projects.length;

  const totalAward = projects.reduce(
    (sum, project) => sum + (project.current_award ?? 0),
    0
  );

  const totalItems = projects.reduce(
    (sum, project) => sum + (project.item_count ?? 0),
    0
  );

  const activeProjects = projects.filter(
    (project) => project.status.name !== "Archived"
  ).length;

  return (
    <PageLayout>

    <DetailHeader
        title="PROJECTS"
        subtitle="Manage all active and archived projects."
        breadcrumbs={[
          {
            label: "Projects",
            href: "/projects",
          }
        ]}
      />
  <KpiGrid>
          <KpiCard
            label="Active Projects"
            value={"Null"}
          />

          <KpiCard
            label="Active Crew"
            value={"Null"}
          />

          <KpiCard
            label="Active Item Count"
            value={"Null"}
          />

          <KpiCard
            label="Active Award"
            value={"Null"}
          />
        </KpiGrid>
    <Section>
  <ProjectsTable
    projects={projects}
    createNewProject={createNewProject}
  />
</Section>
</PageLayout>
  );
}