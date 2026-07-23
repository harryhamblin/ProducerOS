import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-3 flex items-center gap-2 text-sm text-slate-400"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-slate-200" : ""}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            )}
          </div>
        );
      })}
    </nav>
  );
}