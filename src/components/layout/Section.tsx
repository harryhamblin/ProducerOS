import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Section({
  title,
  description,
  actions,
  children,
}: SectionProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900">
      {(title || actions) && (
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-slate-400">
                {description}
              </p>
            )}
          </div>

          {actions}
        </header>
      )}

      <div>{children}</div>
    </section>
  );
}