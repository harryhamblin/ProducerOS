interface StatusBadgeProps {
  name: string;
  colour: string;
}

export function StatusBadge({
  name = "Unknown",
  colour = "#64748b",
}: StatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: `${colour}15`,
        borderColor: `${colour}30`,
        color: colour,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: colour }}
      />

      {name}
    </span>
  );
}