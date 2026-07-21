import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      status:project_statuses(
        id,
        name,
        colour
      )
    `)
    .order("name");

  if (error) {
    return (
      <main className="p-8">
        <h1 className="mb-4 text-3xl font-bold">Projects</h1>
        <p className="text-red-500">{error.message}</p>
      </main>
    );
  }
  
const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
    });

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

 return (
  <main className="space-y-6 p-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm text-slate-400">
          Manage all active and archived productions.
        </p>
      </div>

      <Button>+ New Project</Button>
    </div>

    <div className="flex items-center gap-4">
      <Input
        placeholder="Search projects..."
        className="max-w-sm"
      />
    </div>

    <div className="overflow-hidden rounded-lg border border-slate-800">
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="text-white">Project</TableHead>
                <TableHead className="text-white">Code</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">Current Award</TableHead>
                <TableHead className="text-right text-white">Foreign Spend</TableHead>
                <TableHead className="text-right text-white">Foreign %</TableHead>
                <TableHead className="text-right text-white">Shots</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
          {projects?.map((project) => (
          <TableRow key={project.id} className="cursor-pointer transition-colors hover:bg-slate-900/50">
            <TableCell className="font-medium">
            <button className="text-left transition-colors hover:text-blue-400">
                {project.name}
            </button>
            </TableCell>

            <TableCell>{project.code}</TableCell>

            <TableCell>
            <span
                className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
                style={{
                backgroundColor: `${project.status.colour}15`,
                color: project.status.colour,
                borderColor: `${project.status.colour}30`,
                }}
            >
                <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: project.status.colour }}
                />
                {project.status.name}
            </span>
            </TableCell>

            <TableCell className="text-right">
            {project.current_award
                ? currency.format(project.current_award)
                : "—"}
            </TableCell>

            <TableCell className="text-right">
            {project.foreign_spend
                ? currency.format(project.foreign_spend)
                : "—"}
            </TableCell>

            <TableCell className="text-right">
            {project.current_award && project.foreign_spend
                ? `${(
                    (project.foreign_spend / project.current_award) *
                    100
                ).toFixed(1)}%`
                : "—"}
            </TableCell>

            <TableCell className="text-right">
            {project.shot_count ?? "—"}
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </main>
)}