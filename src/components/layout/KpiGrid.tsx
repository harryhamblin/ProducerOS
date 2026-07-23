interface KpiGridProps {
  children: React.ReactNode;
}

export function KpiGrid({ children }: KpiGridProps) {
  return (
    <section className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/30">
      {children}
    </section>
  );
}