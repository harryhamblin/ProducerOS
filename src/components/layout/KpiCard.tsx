type KpiCardProps = {
  label: string;
  value: string | number;
  subValue?: string;
  borderRight?: boolean;
};

export function KpiCard({
  label,
  value,
  subValue,
  borderRight = true,
}: KpiCardProps) {
  const displayValue =
    typeof value === "number"
      ? value.toLocaleString()
      : value;

  return (
    <div
      className={`
        flex flex-col justify-center
        px-6 py-5
        ${borderRight ? "border-r border-border" : ""}
      `}
    >
      <p className="text-sm text-white">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {displayValue} {subValue}
      </p>
    </div>
  );
}