import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

import { TableCell } from "@/components/table/TableCell";
import { EditableCell } from "@/components/editable/EditableCell";
import { Button } from "@/components/ui/button";
import { getForeignSpendPercentage } from "@/lib/project-calculations";
import { StatusBadge } from "../ui/StatusBadge";

interface ProjectsTableProps {
  projects: any[];
  createNewProject: () => Promise<void>;
}

export function ProjectsTable({
  projects,
  createNewProject,
}: ProjectsTableProps) {
  return (
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
            Items
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
              <td className="px-4 py-3">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
                  title="Open Project"
                >
                  <FolderOpen className="h-4 w-4" />
                </Link>
              </td>

              <td className="px-4 py-3">
                <EditableCell
                  table="projects"
                  rowId={project.id}
                  field="name"
                  value={project.project_name}
                  type="text"
                  revalidatePath="/projects"
                />
              </td>

              <TableCell
                table="projects"
                rowId={project.id}
                field="code"
                value={project.project_code}
                editable
                type="text"
                revalidatePath="/projects"
                className="px-4 py-3"
              />

              <td className="px-4 py-3">
<StatusBadge
  name={project.status?.name ?? "Unknown"}
  colour={project.status?.colour ?? "#64748b"}
/>
</td>

              <TableCell
                table="projects"
                rowId={project.id}
                field="current_award"
                value={project.current_award}
                editable
                type="currency"
                revalidatePath="/projects"
                className="px-4 py-3"
              />

              <TableCell
                table="projects"
                rowId={project.id}
                field="foreign_spend"
                value={project.foreign_spend}
                editable
                type="currency"
                revalidatePath="/projects"
                className="px-4 py-3"
              />

              <td className="px-4 py-3">
                {foreignSpendPercentage !== null
                  ? `${foreignSpendPercentage.toFixed(1)}%`
                  : "—"}
              </td>

              <td className="px-4 py-3">
                {project.item_count ?? "—"}
              </td>
            </tr>
          );
        })}

        <tr>
          <td
            colSpan={8}
            className="border-t border-dashed border-slate-700 p-0"
          >
            <form action={createNewProject}>
              <Button
                type="submit"
                className="w-full justify-center rounded-xl border-5 border-dashed p-5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}