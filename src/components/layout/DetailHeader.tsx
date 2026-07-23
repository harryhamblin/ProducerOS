import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function DetailHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: DetailHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-8 py-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          )}

          <h1 className="text-2xl font-semibold text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}