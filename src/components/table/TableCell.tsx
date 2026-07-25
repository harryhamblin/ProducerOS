import type { ReactNode } from "react";

import { EditableCell } from "@/components/editable/EditableCell";
import { EditableType } from "@/components/editable/types";

interface TableCellProps {
  table?: string;
  rowId?: string;
  field?: string;
  value?: string | number | null;

  editable?: boolean;
  type?: EditableType;
  revalidatePath?: string;
  className?: string;

  children?: ReactNode;
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
  children,
}: TableCellProps) {
  return (
    <td className={className}>
      {children ? (
        children
      ) : editable ? (
        <EditableCell
          table={table!}
          rowId={rowId!}
          field={field!}
          value={value ?? null}
          type={type}
          revalidatePath={revalidatePath}
        />
      ) : (
        value ?? "—"
      )}
    </td>
  );
}