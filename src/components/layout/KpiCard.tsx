interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  borderRight?: boolean;
}

export function KpiCard({
  label,
  value,
  borderRight = true,
}: KpiCardProps) {
  return (
    <div
      className={[
        "px-6 py-5",
        borderRight ? "border-r border-slate-800" : "",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 text-3xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}