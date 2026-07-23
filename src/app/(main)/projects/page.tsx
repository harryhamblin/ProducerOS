import Link from "next/link";

import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { getForeignSpendPercentage } from "@/lib/project-calculations";
import { getProjects } from "@/lib/projects";
import { createProject } from "@/lib/projects";
import { createNewProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EditableCell } from "@/components/editable/EditableCell";
import { TableCell } from "@/components/table/TableCell";
import { ArrowUpRight } from "lucide-react";
import { FolderOpen } from "lucide-react";

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

  const totalShots = projects.reduce(
    (sum, project) => sum + (project.shot_count ?? 0),
    0
  );

  const activeProjects = projects.filter(
    (project) => project.status.name !== "Archived"
  ).length;

  return (
    <main className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-950 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
      </div>

      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/30">
        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Projects
          </p>
          <p className="mt-2 text-3xl font-semibold">{projectCount}</p>
        </div>

        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Total Award
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {currency.format(totalAward)}
          </p>
        </div>

        <div className="border-r border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Shots
          </p>
          <p className="mt-2 text-3xl font-semibold">{totalShots}</p>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Active Projects
          </p>
          <p className="mt-2 text-3xl font-semibold">{activeProjects}</p>
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
                Project
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Code
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Status
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Award
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Foreign
              </th>

              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Foreign %
              </th>

              <th className="px-6 py-3 text-left font-medium text-slate-400">
                Shots
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => {
              const foreignSpendPercentage = getForeignSpendPercentage(
                project.current_award,
                project.foreign_spend
              );

              return (
                <tr
                  key={project.id}
                  className="border-b border-slate-800 transition-colors hover:bg-slate-900/40"
                >
<td  className="px-4 py-3 text-left">
  <div className="flex items-center gap-2">
    <Link
      href={`/projects/${project.id}`}
      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
      title="Open Project"
    >
      <FolderOpen className="h-4 w-4" />
    </Link>
</div>
</td>
<td className="px-4 py-3 text-left">
<div className="flex items-center gap-0">
    <EditableCell
      table="projects"
      rowId={project.id}
      field="name"
      value={project.name}
      type="text"
      revalidatePath="/projects"
    />
  </div>
</td>

<TableCell
  table="projects"
  rowId={project.id}
  field="code"
  value={project.code}
  editable
  type="text"
  revalidatePath="/projects"
  className="px-4 py-3"
/>

                  <td  className="px-4 py-3 text-left">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: `${project.status.colour}15`,
                        borderColor: `${project.status.colour}30`,
                        color: project.status.colour,
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: project.status.colour,
                        }}
                      />
                      {project.status.name}
                    </span>
                  </td>

<TableCell
    table="projects"
    rowId={project.id}
    field="current_award"
    value={project.current_award}
    editable
    type="currency"
    revalidatePath="/projects"
     className="px-4 py-3 text-left"
/>

<TableCell
    table="projects"
    rowId={project.id}
    field="foreign_spend"
    value={project.foreign_spend}
    editable
    type="currency"
    revalidatePath="/projects"
     className="px-4 py-3 text-left"
/>

<td  className="px-4 py-3 text-left">
  {foreignSpendPercentage !== null
    ? `${foreignSpendPercentage.toFixed(1)}%`
    : "—"}
</td>

<td  className="px-4 py-3 text-left">
  {project.shot_count ?? "—"}
</td>
                </tr>
              );
            })}

<tr>
  <td colSpan={999} className="border-t border-dashed border-slate-700 p-0">
    <form action={createNewProject}>
      <Button
        type="submit"
        variant="outline"
        className="w-full justify-center border-0 rounded-none border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Project
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