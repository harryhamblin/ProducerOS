import Link from "next/link";

interface Props {
  params: Promise<{
    projectID: string;
  }>;
}

export default async function FinancePage({ params }: Props) {
  const { projectID } = await params;

  const modules = [
    {
      title: "Bids",
      description: "Create and manage bids",
      href: `/projects/${projectID}/finance/bids`,
    },
    {
      title: "Invoices",
      description: "Coming soon",
      href: `/projects/${projectID}/finance/invoices`,
    },
    {
      title: "Reports",
      description: "Coming soon",
      href: `/projects/${projectID}/finance/reports`,
    },
    {
      title: "Rate Card",
      description: "Project task rates",
      href: `/projects/${projectID}/finance/rate-card`,
    },
  ];

  return (
    <div className="space-y-6 px-10 py-10">
      <div>
        <h1 className="text-3xl font-semibold">
          Finance
        </h1>

        <p className="text-muted-foreground">
          Financial management for this project.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="rounded-lg border bg-card p-6 transition hover:border-primary hover:shadow"
          >
            <h2 className="text-xl text-muted-foreground font-semibold">
              {module.title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}