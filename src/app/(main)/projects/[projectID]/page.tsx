import Link from "next/link";

interface Props {
  params: Promise<{
    projectID: string;
  }>;
}

export default async function ProjectWorkspace({ params }: Props) {
  const { projectID } = await params;

  const modules = [
    {
      title: "Finance",
      description: "Bids, invoices and reports",
      href: `/projects/${projectID}/finance`,
    },
    {
      title: "Shots",
      description: "Shot database",
      href: `/projects/${projectID}/shots`,
    },
    {
      title: "Assets",
      description: "Asset database",
      href: `/projects/${projectID}/assets`,
    },
    {
      title: "Crew",
      description: "Project crew",
      href: `/projects/${projectID}/crew`,
    },
  ];

  return (
    <div className="space-y-6 px-10 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Project Workspace</h1>
        <p className="text-muted-foreground">
          Select a module.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="rounded-lg border bg-card p-6 transition hover:border-primary hover:shadow"
          >
            <h2 className="text-xl text-muted-foreground font-semibold">{module.title}</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}