import { EditableCell } from "@/components/editable/EditableCell";
import { EditableType } from "@/components/editable/types";

interface TableCellProps {
  table: string;
  rowId: string;
  field: string;
  value: string | number | null;

  editable?: boolean;

  type?: EditableType;

  revalidatePath?: string;

  className?: string;
}

export function TableCell({
  table,
  rowId,
  field,
  value,
  editable = false,
  type = "text",
  revalidatePath,
  className,
}: TableCellProps) {
  return (
    <td className={className}>
      {editable ? (
        <EditableCell
          table={table}
          rowId={rowId}
          field={field}
          value={value}
          type={type}
          revalidatePath={revalidatePath}
        />
      ) : (
        value ?? "—"
      )}
    </td>
  );
}