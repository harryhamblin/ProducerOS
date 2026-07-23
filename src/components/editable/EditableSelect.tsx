"use client";

import { EditableCellProps } from "./types";

export function EditableSelect({
  value,
}: EditableCellProps) {
  return (
    <div className="rounded px-2 py-1 text-slate-300">
      {value ?? "—"}
    </div>
  );
}